#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Open-Weights LoRA / QLoRA Fine-Tuning Pipeline
100% Open-Source (HuggingFace Transformers + PEFT + TRL/PyTorch)
Trains a personal LoRA adapter on the user's `my_documents/` corpus,
quiz history, and leadership/speaking/reading coaching examples.
Zero Paid APIs | Runs Locally on GPU (QLoRA 4-bit) or CPU (export-only)
===================================================================
Usage:
    python -m ml_engine.lora_trainer --export-only
    python -m ml_engine.lora_trainer --base-model Qwen/Qwen2.5-7B-Instruct --epochs 2
===================================================================
"""

import os
import json
import argparse
from typing import List, Dict, Any, Optional

SUPPORTED_OPEN_WEIGHTS_MODELS = [
    "Qwen/Qwen2.5-7B-Instruct",
    "meta-llama/Llama-3.1-8B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
]

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_META_PATH = os.path.join(ROOT_DIR, "ml_engine", "chunks_metadata.json")
DEFAULT_DATASET_PATH = os.path.join(ROOT_DIR, "ml_engine", "sft_training_dataset.jsonl")
DEFAULT_OUTPUT_DIR = os.path.join(ROOT_DIR, "ml_engine", "lora_adapters", "anoxpass-coach-lora")


def build_sft_dataset(
    chunks_meta_path: str = DEFAULT_META_PATH,
    quiz_history_path: Optional[str] = None,
    output_jsonl_path: str = DEFAULT_DATASET_PATH,
    max_corpus_examples: int = 1500,
) -> Dict[str, Any]:
    """
    Constructs an Alpaca/ChatML-compatible JSONL instruction dataset from:
    1. Indexed `my_documents/` study chunks (`chunks_metadata.json`)
    2. Optional user quiz history JSON (weak-spot remediation examples)
    3. Built-in 4-mode coaching seed examples (Exam, Speech, Reading, Leadership)
    """
    examples: List[Dict[str, Any]] = []

    # 1. Seed high-signal coaching exemplars across all 4 modes
    seed_examples = [
        {
            "mode": "leadership_mentor",
            "instruction": "[MODE: leadership_mentor] Our team missed a major delivery milestone and morale is low. How should I respond using Bill Walsh's philosophy?",
            "input": "Book: The Score Takes Care of Itself — Bill Walsh",
            "output": (
                "### 1. Standard of Performance Diagnosis\n"
                "Bill Walsh taught that fixating on the scoreboard breeds panic. Diagnose where daily execution standards slipped.\n\n"
                "### 2. Mental Model & Book Framework\n"
                "Apply the **Standard of Performance**: define exact, observable behaviors for preparation, communication, and follow-through.\n\n"
                "### 3. Contingency Playbook\n"
                "1. Hold a calm, blameless post-mortem focused on process gaps.\n"
                "2. Script the next 15 operational actions with clear owners.\n"
                "3. Coach individuals privately and model unwavering composure publicly.\n\n"
                "### 4. Reflection Challenge\n"
                "Which daily standard did you stop inspecting before the deadline slipped?"
            ),
        },
        {
            "mode": "speech_coach",
            "instruction": "[MODE: speech_coach] Critique this 20-second opening: 'Um, hi everyone, so basically today I kind of want to talk about cybersecurity risk.'",
            "input": "Context: Executive board briefing",
            "output": (
                "### 1. Delivery & Structure Score: 52/100\n"
                "Four hedging/filler phrases ('um', 'basically', 'kind of', 'want to') dilute authority in the first 5 seconds.\n\n"
                "### 2. Rewritten Opening / Power Line\n"
                "'Every 11 seconds, an organization faces a ransomware attempt. Today, we will close our three highest-impact exposure gaps.'\n\n"
                "### 3. Next 3-Minute Deliberate Practice Drill\n"
                "Deliver the rewritten opening 5 times standing up with a 2-second silent pause after the first sentence."
            ),
        },
        {
            "mode": "reading_coach",
            "instruction": "[MODE: reading_coach] I just finished a chapter on active reading and Zettelkasten. Help me lock it in.",
            "input": "Method: Analytical Reading + SQ3R",
            "output": (
                "### 1. Comprehension & Synthesis Check\n"
                "Active reading transforms passive consumption into permanent knowledge only when you restate ideas in your own words.\n\n"
                "### 2. Socratic Probing Questions\n"
                "1. What is the single most counterintuitive claim in this chapter?\n"
                "2. How does it connect to an existing note in your knowledge base?\n\n"
                "### 3. Atomic Zettelkasten Note\n"
                "- **Claim**: True retention requires writing atomic notes in your own words and linking them to prior concepts.\n"
                "- **Tags**: `#reading-mastery` `#zettelkasten` `#active-recall`"
            ),
        },
    ]
    examples.extend(seed_examples)

    # 2. Distill study corpus chunks into grounded Q&A / explanation pairs
    if os.path.exists(chunks_meta_path):
        try:
            with open(chunks_meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
            chunks = meta.get("chunks", [])[:max_corpus_examples]
            for ch in chunks:
                cert = ch.get("certification_code", "GENERAL")
                doc = ch.get("document_name", "study_material")
                text = (ch.get("chunk_text") or "").strip()
                if len(text) < 80:
                    continue
                examples.append({
                    "mode": "exam_proctor",
                    "instruction": f"[MODE: exam_proctor] Summarize the authoritative {cert} principle from '{doc}' and explain its exam relevance.",
                    "input": f"Certification: {cert} | Source: {doc}",
                    "output": f"### Authoritative Study Grounding ({cert} — {doc})\n{text}\n\n### Memory Anchor\nAnchor this principle to formal governance, risk reduction, and documented standards.",
                })
        except Exception as err:
            print(f"[LORA-WARN] Could not read chunks metadata ({chunks_meta_path}): {err}")

    # 3. Optional quiz history (missed questions -> high-priority remediation pairs)
    if quiz_history_path and os.path.exists(quiz_history_path):
        try:
            with open(quiz_history_path, "r", encoding="utf-8") as f:
                history = json.load(f)
            for item in history:
                stem = item.get("stem") or item.get("question")
                rationale = item.get("rationale") or item.get("explanation")
                if stem and rationale:
                    examples.append({
                        "mode": "exam_proctor",
                        "instruction": f"[MODE: exam_proctor] Dissect this question: {stem}",
                        "input": f"Correct Answer: {item.get('correct_answer', 'N/A')}",
                        "output": rationale,
                    })
        except Exception as err:
            print(f"[LORA-WARN] Could not read quiz history ({quiz_history_path}): {err}")

    os.makedirs(os.path.dirname(output_jsonl_path), exist_ok=True)
    with open(output_jsonl_path, "w", encoding="utf-8") as out_f:
        for ex in examples:
            out_f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    return {
        "status": "exported",
        "dataset_path": output_jsonl_path,
        "total_examples": len(examples),
    }


def run_lora_finetune(
    base_model: str = "Qwen/Qwen2.5-7B-Instruct",
    dataset_path: str = DEFAULT_DATASET_PATH,
    output_dir: str = DEFAULT_OUTPUT_DIR,
    epochs: int = 2,
    lora_r: int = 16,
    lora_alpha: int = 32,
    learning_rate: float = 2e-4,
    use_qlora_4bit: bool = True,
    dry_run: bool = False,
) -> Dict[str, Any]:
    """
    Fine-tunes an open-weights HuggingFace causal LM with PEFT LoRA/QLoRA.
    Gracefully reports missing optional GPU packages if run on a lightweight CPU machine.
    """
    if not os.path.exists(dataset_path):
        build_sft_dataset(output_jsonl_path=dataset_path)

    config_summary = {
        "base_model": base_model,
        "dataset_path": dataset_path,
        "output_dir": output_dir,
        "epochs": epochs,
        "lora_r": lora_r,
        "lora_alpha": lora_alpha,
        "learning_rate": learning_rate,
        "qlora_4bit": use_qlora_4bit,
        "supported_open_weights": SUPPORTED_OPEN_WEIGHTS_MODELS,
    }

    if dry_run:
        return {"status": "dry_run_ok", "config": config_summary}

    try:
        import torch
        from datasets import load_dataset
        from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, DataCollatorForLanguageModeling
        from peft import LoraConfig, get_peft_model, TaskType
    except ImportError as exc:
        return {
            "status": "missing_optional_deps",
            "message": (
                f"Optional fine-tuning dependency not installed: {exc}. "
                "Install with: pip install torch transformers peft datasets accelerate bitsandbytes"
            ),
            "config": config_summary,
        }

    quant_config = None
    if use_qlora_4bit and torch.cuda.is_available():
        try:
            from transformers import BitsAndBytesConfig
            quant_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.bfloat16,
                bnb_4bit_use_double_quant=True,
            )
        except Exception:
            quant_config = None

    tokenizer = AutoTokenizer.from_pretrained(base_model, use_fast=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        base_model,
        quantization_config=quant_config,
        device_map="auto" if torch.cuda.is_available() else None,
    )

    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    )
    model = get_peft_model(model, peft_config)

    ds = load_dataset("json", data_files=dataset_path, split="train")

    def format_and_tokenize(batch):
        texts = [
            f"### Instruction:\n{inst}\n\n### Context:\n{inp}\n\n### Response:\n{out}{tokenizer.eos_token}"
            for inst, inp, out in zip(batch["instruction"], batch["input"], batch["output"])
        ]
        return tokenizer(texts, truncation=True, max_length=1024, padding="max_length")

    tokenized_ds = ds.map(format_and_tokenize, batched=True, remove_columns=ds.column_names)

    os.makedirs(output_dir, exist_ok=True)
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=learning_rate,
        logging_steps=10,
        save_strategy="epoch",
        bf16=torch.cuda.is_available(),
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_ds,
        data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
    )
    trainer.train()
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    return {
        "status": "trained",
        "adapter_path": output_dir,
        "ollama_import_hint": f"Add 'ADAPTER {output_dir}' to your Modelfile and run: ollama create anoxpass-coach -f Modelfile",
    }


def main():
    parser = argparse.ArgumentParser(description="AnoxPass Open-Weights LoRA/QLoRA Trainer")
    parser.add_argument("--export-only", action="store_true", help="Export SFT JSONL dataset without launching GPU training")
    parser.add_argument("--dry-run", action="store_true", help="Validate config and dataset export only")
    parser.add_argument("--base-model", default="Qwen/Qwen2.5-7B-Instruct", help="HuggingFace open-weights model ID")
    parser.add_argument("--epochs", type=int, default=2, help="Number of LoRA training epochs")
    parser.add_argument("--quiz-history", default=None, help="Optional path to exported quiz history JSON")
    args = parser.parse_args()

    export_res = build_sft_dataset(quiz_history_path=args.quiz_history)
    print(json.dumps(export_res, indent=2))

    if not args.export_only:
        train_res = run_lora_finetune(
            base_model=args.base_model,
            epochs=args.epochs,
            dry_run=args.dry_run,
        )
        print(json.dumps(train_res, indent=2))


if __name__ == "__main__":
    main()
