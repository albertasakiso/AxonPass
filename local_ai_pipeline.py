#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Master Self-Hosted Open-Weights AI/ML Pipeline & Local Bridge
100% Free, Open-Source, Zero Paid APIs:
  - Local RAG over `my_documents/` (sentence-transformers + FAISS/NumPy)
  - 4-Mode Local AI Coach via Ollama (deepseek-r1:8b / llama3.1:8b / qwen2.5:7b / mistral:7b)
  - Open-Weights LoRA/QLoRA Fine-Tuning Dataset & Adapter Pipeline
  - Adaptive FSRS v4.5 Spaced Repetition & Difficulty-Ranked Path Recommender
  - Optional Local HTTP Bridge (`--serve`) for the AnoxPass React Frontend
===================================================================
Usage:
    python local_ai_pipeline.py --serve             # Start local HTTP bridge on :8765
    python local_ai_pipeline.py --ingest            # Index my_documents/ into local RAG
    python local_ai_pipeline.py --finetune-export   # Export LoRA SFT dataset JSONL
    python local_ai_pipeline.py --coach "Your prompt" --mode leadership_mentor
    python local_ai_pipeline.py --recommend-paths   # Show adaptive path recommendations
===================================================================
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any, List, Optional

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(ROOT_DIR, "my_documents")
DEFAULT_OLLAMA_URL = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
DEFAULT_OLLAMA_MODEL = os.environ.get("ANOXPASS_OLLAMA_MODEL", "anoxpass-coach")

from ml_engine.rag_engine import LocalRAGEngine
from ml_engine.coaching_modes import (
    COACH_MODES,
    build_coach_prompt,
    deterministic_offline_coach,
    analyze_speech_metrics,
)
from ml_engine.adaptive_fsrs import (
    FSRSCardState,
    schedule_fsrs_card,
    predict_exam_readiness,
    recommend_next_paths,
)
from ml_engine.lora_trainer import build_sft_dataset, run_lora_finetune
from ml_engine.storage_optimizer import (
    optimize_local_storage,
    export_compact_cloud_pack,
    get_storage_stats,
)
from ml_engine.batch_synthesizer import (
    run_batch_synthesis,
    get_synthesis_status,
    sync_synthesized_to_supabase,
)


def query_local_ollama(
    prompt: str,
    system_prompt: str,
    model: str = DEFAULT_OLLAMA_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    timeout: int = 45,
) -> Optional[str]:
    """Calls local self-hosted Ollama HTTP API (zero paid cloud calls)."""
    url = f"{ollama_url.rstrip('/')}/api/generate"
    payload = json.dumps({
        "model": model,
        "system": system_prompt,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.25, "num_ctx": 8192},
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response")
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError):
        return None


def run_local_coach(
    rag_engine: LocalRAGEngine,
    mode: str,
    message: str,
    domain: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    model: str = DEFAULT_OLLAMA_MODEL,
) -> Dict[str, Any]:
    """Executes RAG retrieval + local Ollama open-weights generation with offline fallback."""
    rag_hits = rag_engine.retrieve(message, top_k=4, filter_domain=domain)
    built = build_coach_prompt(mode=mode, user_message=message, rag_context=rag_hits, metadata=metadata)

    ollama_text = query_local_ollama(
        prompt=built["prompt"],
        system_prompt=built["system"],
        model=model,
    )

    if ollama_text:
        result: Dict[str, Any] = {
            "mode": built["mode"],
            "engine": f"ollama:{model}",
            "response": ollama_text,
            "sources": [
                {
                    "document_name": h.get("document_name"),
                    "certification_code": h.get("certification_code"),
                    "similarity_score": h.get("similarity_score"),
                }
                for h in rag_hits
            ],
        }
        if built["mode"] == "speech_coach":
            dur = (metadata or {}).get("duration_seconds")
            result["metrics"] = analyze_speech_metrics(message, float(dur) if dur else None)
        return result

    fallback = deterministic_offline_coach(
        mode=built["mode"],
        user_message=message,
        rag_context=rag_hits,
        metadata=metadata,
    )
    fallback["sources"] = [
        {
            "document_name": h.get("document_name"),
            "certification_code": h.get("certification_code"),
            "similarity_score": h.get("similarity_score"),
        }
        for h in rag_hits
    ]
    return fallback


def start_local_http_bridge(host: str = "127.0.0.1", port: int = 8765):
    """Starts a zero-dependency local HTTP JSON bridge for the AnoxPass web frontend."""
    rag_engine = LocalRAGEngine()
    rag_engine.load()

    class AnoxPassHandler(BaseHTTPRequestHandler):
        def _send_json(self, payload: Dict[str, Any], status: int = 200):
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_OPTIONS(self):
            self._send_json({"ok": True})

        def do_GET(self):
            if self.path == "/health":
                self._send_json({
                    "status": "ok",
                    "engine": "anoxpass-local-open-weights",
                    "ollama_url": DEFAULT_OLLAMA_URL,
                    "default_model": DEFAULT_OLLAMA_MODEL,
                    "modes": list(COACH_MODES.keys()),
                    "rag": rag_engine.get_stats(),
                })
                return
            if self.path == "/storage/stats":
                self._send_json(get_storage_stats())
                return
            if self.path == "/synthesis/status":
                self._send_json(get_synthesis_status())
                return
            self._send_json({"error": "Not found"}, status=404)

        def do_POST(self):
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                body = json.loads(raw)
            except json.JSONDecodeError:
                self._send_json({"error": "Invalid JSON"}, status=400)
                return

            if self.path == "/coach":
                res = run_local_coach(
                    rag_engine=rag_engine,
                    mode=body.get("mode", "exam_proctor"),
                    message=body.get("message", ""),
                    domain=body.get("domain"),
                    metadata=body.get("metadata"),
                    model=body.get("model", DEFAULT_OLLAMA_MODEL),
                )
                self._send_json(res)
                return

            if self.path == "/course/tutor":
                cert_code = body.get("cert_code") or body.get("domain")
                lesson_title = body.get("lesson_title", "Lesson")
                question = body.get("question") or body.get("message", "")
                tutor_prompt = (
                    f"Lesson: {lesson_title} ({cert_code or 'Certification'})\n"
                    f"Learner Question / Drill: {question}"
                )
                res = run_local_coach(
                    rag_engine=rag_engine,
                    mode="exam_proctor",
                    message=tutor_prompt,
                    domain=cert_code,
                    metadata={
                        "lesson_title": lesson_title,
                        "cert_code": cert_code,
                        "drill_title": body.get("drill_title"),
                    },
                    model=body.get("model", DEFAULT_OLLAMA_MODEL),
                )
                self._send_json(res)
                return

            if self.path == "/rag/search":
                hits = rag_engine.retrieve(
                    query=body.get("query", ""),
                    top_k=int(body.get("top_k", 5)),
                    filter_domain=body.get("domain"),
                )
                self._send_json({"results": hits})
                return

            if self.path == "/fsrs/schedule":
                card_data = body.get("card", {})
                card = FSRSCardState(
                    card_id=card_data.get("card_id", "card-1"),
                    stability=float(card_data.get("stability", 0.0)),
                    difficulty=float(card_data.get("difficulty", 5.0)),
                    reps=int(card_data.get("reps", 0)),
                    lapses=int(card_data.get("lapses", 0)),
                    state=card_data.get("state", "new"),
                    last_review=card_data.get("last_review"),
                    due=card_data.get("due"),
                )
                res = schedule_fsrs_card(card, int(body.get("rating", 3)))
                self._send_json(res)
                return

            if self.path == "/paths/recommend":
                recs = recommend_next_paths(
                    completed_certs=body.get("completed_certs", []),
                    mastery_by_cert=body.get("mastery_by_cert", {}),
                    top_n=int(body.get("top_n", 3)),
                )
                readiness = predict_exam_readiness(
                    accuracy_rate=float(body.get("accuracy_rate", 0.72)),
                    avg_stability_days=float(body.get("avg_stability_days", 10.0)),
                    coverage_ratio=float(body.get("coverage_ratio", 0.5)),
                    streak_days=int(body.get("streak_days", 0)),
                )
                self._send_json({"recommendations": recs, "readiness": readiness})
                return

            self._send_json({"error": "Unknown endpoint"}, status=404)

    server = HTTPServer((host, port), AnoxPassHandler)
    print(f"[ANOXPASS-AI] Local Open-Weights Bridge listening on http://{host}:{port}")
    print(f"[ANOXPASS-AI] Endpoints: GET /health, POST /coach, POST /rag/search, POST /fsrs/schedule, POST /paths/recommend")
    server.serve_forever()


def main():
    parser = argparse.ArgumentParser(description="AnoxPass Self-Hosted Open-Weights AI/ML Pipeline")
    parser.add_argument("--ingest", action="store_true", help="Ingest & index my_documents/ into local RAG")
    parser.add_argument("--limit-files", type=int, default=0, help="Limit files during ingestion (0 = all)")
    parser.add_argument("--finetune-export", action="store_true", help="Export LoRA SFT dataset JSONL")
    parser.add_argument("--finetune", action="store_true", help="Run open-weights LoRA/QLoRA fine-tuning")
    parser.add_argument("--base-model", default="Qwen/Qwen2.5-7B-Instruct", help="HuggingFace open-weights model")
    parser.add_argument("--coach", type=str, default=None, help="Run a single local coaching prompt")
    parser.add_argument("--mode", default="exam_proctor", choices=list(COACH_MODES.keys()), help="Coaching mode")
    parser.add_argument("--recommend-paths", action="store_true", help="Print adaptive difficulty-ranked path recommendations")
    parser.add_argument("--optimize-storage", action="store_true", help="Deduplicate & int8-quantize local RAG storage")
    parser.add_argument("--export-compact-pack", action="store_true", help="Export compact high-signal Supabase knowledge pack")
    parser.add_argument("--max-mb", type=float, default=25.0, help="Budget cap in MB for compact Supabase pack or synthesis")
    parser.add_argument("--synthesize-all", action="store_true", help="Run resumable Ollama synthesis for all 16 certifications")
    parser.add_argument("--synthesize-cert", type=str, default=None, help="Run resumable Ollama synthesis for one cert ID (e.g. cisa)")
    parser.add_argument("--synthesize-status", action="store_true", help="Show per-cert Ollama synthesis completion table")
    parser.add_argument("--sync-synthesized", action="store_true", help="Sync completed synthesized lessons & questions to Supabase")
    parser.add_argument("--sync-supabase", action="store_true", help="Sync to Supabase after synthesis completes")
    parser.add_argument("--dry-run", action="store_true", help="Plan synthesis clusters & estimate MB without calling Ollama")
    parser.add_argument("--model", type=str, default=DEFAULT_OLLAMA_MODEL, help="Local Ollama model name")
    parser.add_argument("--serve", action="store_true", help="Start local HTTP bridge for frontend")
    parser.add_argument("--port", type=int, default=8765, help="Port for local HTTP bridge")
    args = parser.parse_args()

    rag_engine = LocalRAGEngine()

    if args.optimize_storage:
        print(json.dumps(optimize_local_storage(), indent=2))
        return

    if args.export_compact_pack:
        print(json.dumps(export_compact_cloud_pack(max_mb=args.max_mb), indent=2))
        return

    if args.synthesize_status:
        print(json.dumps(get_synthesis_status(), indent=2))
        return

    if args.sync_synthesized:
        print(json.dumps(sync_synthesized_to_supabase(model_name=args.model), indent=2))
        return

    if args.synthesize_all or args.synthesize_cert:
        target = "all" if args.synthesize_all else args.synthesize_cert
        budget = args.max_mb if args.max_mb != 25.0 else 40.0
        res = run_batch_synthesis(
            cert=target,
            model=args.model,
            max_mb=budget,
            dry_run=args.dry_run,
            sync_supabase=args.sync_supabase,
        )
        print(json.dumps(res, indent=2))
        return

    if args.ingest:
        summary = rag_engine.ingest_and_index(DOCS_DIR, max_files=args.limit_files)
        print(json.dumps(summary, indent=2))
        return

    if args.finetune_export:
        print(json.dumps(build_sft_dataset(), indent=2))
        return

    if args.finetune:
        build_sft_dataset()
        print(json.dumps(run_lora_finetune(base_model=args.base_model), indent=2))
        return

    if args.recommend_paths:
        recs = recommend_next_paths(completed_certs=[], mastery_by_cert={"CISA": 62.0})
        print(json.dumps(recs, indent=2))
        return

    if args.coach:
        res = run_local_coach(rag_engine=rag_engine, mode=args.mode, message=args.coach)
        print(res["response"])
        return

    if args.serve:
        start_local_http_bridge(port=args.port)
        return

    parser.print_help()


if __name__ == "__main__":
    main()
