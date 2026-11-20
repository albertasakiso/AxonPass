#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Local AI Coaching Modes & Structured Evaluators
100% Open-Source, Self-Hosted Open-Weights Prompting & Offline Fallbacks
Supports: exam_proctor, speech_coach, reading_coach, leadership_mentor
===================================================================
"""

import re
from typing import Dict, Any, List, Optional

COACH_MODES: Dict[str, Dict[str, Any]] = {
    "exam_proctor": {
        "id": "exam_proctor",
        "title": "Exam Proctor",
        "subtitle": "Psychometric 4-part dissection grounded in your study corpus",
        "system_prompt": (
            "You are the AnoxPass Exam Proctor. Dissect certification questions using the "
            "4-part matrix: (1) Decision Operator & Principle, (2) Option-by-Option Matrix, "
            "(3) Authoritative Standard & RAG Citation, (4) Exam Trap Warning & Memory Anchor."
        ),
        "recommended_models": ["deepseek-r1:8b", "llama3.1:8b", "qwen2.5:7b"],
    },
    "speech_coach": {
        "id": "speech_coach",
        "title": "Public Speaking Speech Coach",
        "subtitle": "Rhetoric, pacing, filler-word audit, storytelling & executive presence",
        "system_prompt": (
            "You are the AnoxPass Public Speaking Coach. Evaluate speech drafts and transcripts "
            "on Hook, Structure (PREP/STAR), Pacing (130-150 WPM), Filler Words, and Call to Action. "
            "Return a score (0-100), strengths, a tightened power line, and a 3-minute practice drill."
        ),
        "recommended_models": ["llama3.1:8b", "mistral:7b", "qwen2.5:7b"],
    },
    "reading_coach": {
        "id": "reading_coach",
        "title": "Socratic Reading & Book Coach",
        "subtitle": "SQ3R, Analytical/Syntopical reading, Zettelkasten notes & active recall",
        "system_prompt": (
            "You are the AnoxPass Socratic Reading Coach. Guide the learner through Adler's "
            "Analytical and Syntopical reading, SQ3R, and Zettelkasten atomic notes. Never just "
            "lecture—challenge them with 2-3 sharp Socratic questions and a reusable atomic note."
        ),
        "recommended_models": ["qwen2.5:7b", "llama3.1:8b", "deepseek-r1:8b"],
    },
    "leadership_mentor": {
        "id": "leadership_mentor",
        "title": "Leadership Case-Study Mentor",
        "subtitle": "Bill Walsh's Standard of Performance & classic executive playbooks",
        "system_prompt": (
            "You are the AnoxPass Executive Leadership Mentor grounded in Bill Walsh's "
            "'The Score Takes Care of Itself' (Standard of Performance, contingency scripting, "
            "teaching culture) and leadership classics (Extreme Ownership, Leaders Eat Last, "
            "Good to Great, 7 Habits, Atomic Habits, Thinking Fast and Slow). Diagnose the "
            "scenario, apply a mental model, and give 3 concrete contingency actions."
        ),
        "recommended_models": ["llama3.1:8b", "deepseek-r1:8b", "qwen2.5:7b"],
    },
}

FILLER_WORDS = [
    "um", "uh", "like", "you know", "basically", "actually", "literally",
    "sort of", "kind of", "so yeah", "i mean", "right?",
]

EXAM_OPERATORS = {
    "FIRST": "Sequence operator — prioritize immediate containment, assessment, or governance authorization before remediation.",
    "INITIAL": "Sequence operator — identify the very first diagnostic or planning step.",
    "PRIMARY": "Root-cause / governance operator — choose the overarching policy, objective, or fundamental control.",
    "MOST": "Relative efficacy operator — select the option that delivers the greatest risk reduction or impact.",
    "BEST": "Optimization operator — choose the most complete, standards-aligned, and sustainable control.",
    "LEAST": "Inverse operator — identify the weakest, most risky, or least appropriate choice.",
}


def build_coach_prompt(
    mode: str,
    user_message: str,
    rag_context: Optional[List[Dict[str, Any]]] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, str]:
    """Builds system + user prompts tagged with [MODE: ...] and grounded RAG passages."""
    mode_key = mode if mode in COACH_MODES else "exam_proctor"
    cfg = COACH_MODES[mode_key]

    context_block = ""
    if rag_context:
        snippets = []
        for idx, item in enumerate(rag_context[:4], start=1):
            doc = item.get("document_name", "local_corpus")
            cert = item.get("certification_code", "GENERAL")
            text = (item.get("chunk_text") or "")[:500].strip()
            snippets.append(f"[{idx}] ({cert} | {doc}): {text}")
        context_block = "\n\nRETRIEVED LOCAL CORPUS CONTEXT:\n" + "\n".join(snippets)

    meta_block = ""
    if metadata:
        meta_parts = [f"{k}: {v}" for k, v in metadata.items() if v is not None and str(v).strip()]
        if meta_parts:
            meta_block = "\n\nSESSION CONTEXT:\n" + "\n".join(meta_parts)

    prompt = f"[MODE: {mode_key}]\n{user_message.strip()}{meta_block}{context_block}"
    return {
        "mode": mode_key,
        "system": cfg["system_prompt"],
        "prompt": prompt,
    }


def analyze_speech_metrics(transcript: str, duration_seconds: Optional[float] = None) -> Dict[str, Any]:
    """Deterministic local speech analyzer (WPM, filler density, sentence rhythm)."""
    words = re.findall(r"\b[\w']+\b", transcript)
    word_count = len(words)
    lower_text = transcript.lower()

    filler_hits: Dict[str, int] = {}
    total_fillers = 0
    for fw in FILLER_WORDS:
        count = len(re.findall(r"\b" + re.escape(fw) + r"\b", lower_text))
        if count > 0:
            filler_hits[fw] = count
            total_fillers += count

    sentences = [s.strip() for s in re.split(r"[.!?]+", transcript) if s.strip()]
    avg_sentence_len = round(word_count / max(len(sentences), 1), 1)
    filler_rate = round((total_fillers / max(word_count, 1)) * 100, 2)

    wpm = None
    pacing_verdict = "Provide duration_seconds to measure WPM (target: 130–150 WPM)."
    if duration_seconds and duration_seconds > 0:
        wpm = round((word_count / duration_seconds) * 60, 1)
        if 125 <= wpm <= 155:
            pacing_verdict = f"Optimal executive cadence ({wpm} WPM)."
        elif wpm < 125:
            pacing_verdict = f"Slightly slow ({wpm} WPM) — tighten transitions and project energy."
        else:
            pacing_verdict = f"Fast ({wpm} WPM) — insert 1.5-second pauses after key claims."

    score = 88
    score -= min(25, int(filler_rate * 4))
    if avg_sentence_len > 24:
        score -= 8
    if word_count < 25:
        score -= 10
    score = max(40, min(99, score))

    return {
        "word_count": word_count,
        "sentence_count": len(sentences),
        "avg_sentence_length": avg_sentence_len,
        "filler_count": total_fillers,
        "filler_rate_percent": filler_rate,
        "filler_breakdown": filler_hits,
        "wpm": wpm,
        "pacing_verdict": pacing_verdict,
        "delivery_score": score,
    }


def deterministic_offline_coach(
    mode: str,
    user_message: str,
    rag_context: Optional[List[Dict[str, Any]]] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    100% offline deterministic coaching fallback when Ollama is not running.
    Guarantees structured, actionable feedback with zero external API calls.
    """
    mode_key = mode if mode in COACH_MODES else "exam_proctor"
    rag_citations = [
        f"- **{c.get('certification_code', 'CORPUS')}** (`{c.get('document_name', 'document')}`): "
        f"{(c.get('chunk_text') or '')[:180].strip()}..."
        for c in (rag_context or [])[:2]
    ]
    citation_md = "\n".join(rag_citations) if rag_citations else "- Local offline heuristic mode (start Ollama with `ollama run anoxpass-coach` for deep open-weights reasoning)."

    if mode_key == "speech_coach":
        dur = (metadata or {}).get("duration_seconds")
        metrics = analyze_speech_metrics(user_message, float(dur) if dur else None)
        response = (
            f"### 1. Delivery & Structure Score: **{metrics['delivery_score']}/100**\n"
            f"- **Word Count**: {metrics['word_count']} words across {metrics['sentence_count']} sentences (avg {metrics['avg_sentence_length']} words/sentence).\n"
            f"- **Filler Density**: {metrics['filler_count']} fillers ({metrics['filler_rate_percent']}%). {metrics['pacing_verdict']}\n\n"
            f"### 2. Rhetoric & Storytelling Breakdown\n"
            f"- Aim for short, punchy sentences (<18 words) on your thesis and call-to-action.\n"
            f"- Anchor your point with **PREP**: Point -> Reason -> Concrete Example -> Point.\n\n"
            f"### 3. Next 3-Minute Deliberate Practice Drill\n"
            f"- Deliver the opening 30 seconds aloud twice: once with a 2-second silent pause after the hook, and once cutting all filler words.\n\n"
            f"### Local Corpus Grounding\n{citation_md}"
        )
        return {"mode": mode_key, "engine": "offline-deterministic", "response": response, "metrics": metrics}

    if mode_key == "reading_coach":
        words = user_message.split()
        response = (
            f"### 1. Comprehension & Synthesis Check\n"
            f"- You captured a {len(words)}-word synthesis. Test whether it answers **What is the author's core claim?** and **What evidence supports it?**\n\n"
            f"### 2. Socratic Probing Questions\n"
            f"1. If you had to refute this author's main thesis in 2 sentences, what counter-example would you use?\n"
            f"2. How does this idea connect to another book or certification domain you are studying?\n"
            f"3. What single behavior will you change this week because of this passage?\n\n"
            f"### 3. Atomic Zettelkasten Note Template\n"
            f"- **Claim**: {user_message[:140].strip()}\n"
            f"- **Tags**: `#active-reading` `#synthesis` `#zettelkasten`\n\n"
            f"### Local Corpus Grounding\n{citation_md}"
        )
        return {"mode": mode_key, "engine": "offline-deterministic", "response": response}

    if mode_key == "leadership_mentor":
        response = (
            f"### 1. Standard of Performance Diagnosis (Bill Walsh)\n"
            f"- *The Score Takes Care of Itself*: Focus on raising the daily operational standard rather than obsessing over short-term scoreboard outcomes.\n\n"
            f"### 2. Mental Model & Book Framework\n"
            f"- Combine **Standard of Performance** (Bill Walsh) with **Extreme Ownership** (Jocko Willink): clarify expectations, own the system gap, and coach the behavior.\n\n"
            f"### 3. Contingency Playbook (3 Concrete Actions)\n"
            f"1. **Script the First 15 Plays**: Define the exact non-negotiable standards for your next team interaction.\n"
            f"2. **Teach, Don't Just Critique**: Turn the friction point into a repeatable checklist or rehearsal.\n"
            f"3. **Protect Composure**: Model calm decisiveness under pressure so the team mirrors your poise.\n\n"
            f"### 4. Reflection Challenge\n"
            f"- Which specific standard have you tolerated slipping because it felt uncomfortable to enforce?\n\n"
            f"### Local Corpus Grounding\n{citation_md}"
        )
        return {"mode": mode_key, "engine": "offline-deterministic", "response": response}

    # Default: exam_proctor
    upper_msg = user_message.upper()
    detected_op = "BEST / PRIMARY"
    op_rule = "Prioritize the governance-aligned, risk-based control that addresses the root cause."
    for op, rule in EXAM_OPERATORS.items():
        if re.search(rf"\b{op}\b", upper_msg):
            detected_op = op
            op_rule = rule
            break

    response = (
        f"### 1. Decision Operator & Cognitive Principle\n"
        f"- **Detected Operator**: `{detected_op}`\n"
        f"- **Governing Rule**: {op_rule}\n\n"
        f"### 2. Option Elimination Heuristic\n"
        f"- Eliminate options that are purely reactive, skip management/governance approval, or have an auditor implement controls directly.\n"
        f"- Favor options grounded in formal risk assessment, documented policy, and measurable business alignment.\n\n"
        f"### 3. Local Corpus & Standard Grounding\n{citation_md}\n\n"
        f"### 4. Exam Trap Warning & Memory Anchor\n"
        f"- *Assess before acting; align with governance before executing technical fixes.*"
    )
    return {"mode": mode_key, "engine": "offline-deterministic", "response": response}
