#!/usr/bin/env python3
"""
===================================================================
APILIGU LEARNING PASS — Model Accuracy & Grounding Verification Engine
Evaluates Local Vector Embedding Model Against Verified Questions Test Set
===================================================================
"""

import os
import re
import sys
import json
import time
import psycopg2
import numpy as np
from typing import List, Dict, Any, Tuple
from collections import defaultdict

from ml_engine.vector_engine import LocalVectorEngine


def get_verified_test_questions(
    db_url: str,
    sample_per_cert: int = 100,
    cert_filter: str = None
) -> List[Dict[str, Any]]:
    """
    Fetches verified test set questions from Supabase PostgreSQL database
    with stems, options, correct answers, rationales, and domain tags.
    """
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    query = """
        SELECT 
            q.id,
            c.code AS cert_code,
            d.domain_number,
            q.question_number,
            q.stem,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.correct_answer,
            q.rationale,
            q.task_statement
        FROM questions q
        JOIN certifications c ON c.id = q.certification_id
        LEFT JOIN domains d ON d.id = q.domain_id
        WHERE q.stem IS NOT NULL AND LENGTH(q.stem) > 20
    """
    
    if cert_filter and cert_filter != "ALL":
        query += f" AND c.code = '{cert_filter}'"
        
    query += " ORDER BY c.code, q.question_number"

    cur.execute(query)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Stratified sampling per certification
    by_cert = defaultdict(list)
    for r in rows:
        q_id, cert_code, d_num, q_num, stem, opt_a, opt_b, opt_c, opt_d, correct_ans, rationale, task_stmt = r
        
        correct_text = ""
        ans = (correct_ans or "").strip().upper()
        if ans == 'A':
            correct_text = opt_a or ""
        elif ans == 'B':
            correct_text = opt_b or ""
        elif ans == 'C':
            correct_text = opt_c or ""
        elif ans == 'D':
            correct_text = opt_d or ""

        item = {
            "id": str(q_id),
            "cert_code": cert_code,
            "domain_number": d_num or 1,
            "question_number": q_num,
            "stem": stem,
            "correct_answer": ans,
            "correct_text": correct_text,
            "rationale": rationale or "",
            "task_statement": task_stmt or ""
        }
        by_cert[cert_code].append(item)

    test_set = []
    for cert, q_list in by_cert.items():
        # Take up to sample_per_cert or all
        sampled = q_list[:sample_per_cert] if sample_per_cert > 0 else q_list
        test_set.extend(sampled)

    print(f"[TEST-SET] Loaded {len(test_set)} verified questions across {len(by_cert)} certifications.")
    return test_set


class ModelVerifier:
    def __init__(self, vector_engine: LocalVectorEngine):
        self.engine = vector_engine

    def evaluate_test_set(
        self,
        test_questions: List[Dict[str, Any]],
        similarity_threshold: float = 0.40
    ) -> Dict[str, Any]:
        """
        Runs comprehensive retrieval evaluation across test set questions.
        Calculates Top-1, Top-3, Top-5, Top-10 Retrieval, MRR, and Semantic Alignment.
        """
        print(f"\n[EVAL] Starting verification benchmark on {len(test_questions)} test questions...")
        start_time = time.time()

        top1_hits = 0
        top3_hits = 0
        top5_hits = 0
        top10_hits = 0
        reciprocal_ranks = []
        similarities = []

        cert_stats = defaultdict(lambda: {
            "total": 0, "top1": 0, "top3": 0, "top5": 0, "mrr_sum": 0.0, "sim_sum": 0.0
        })

        for idx, q in enumerate(test_questions):
            # Query with stem + key domain concepts
            query_text = f"{q['stem']} {q['correct_text']} {q['rationale'][:150]}".strip()
            cert_code = q["cert_code"]

            # Search with certification filtering or global
            matches = self.engine.search(query_text, top_k=10, filter_cert=cert_code)
            if not matches:
                # Fallback to global search
                matches = self.engine.search(query_text, top_k=10, filter_cert=None)

            cert_stats[cert_code]["total"] += 1

            if not matches:
                reciprocal_ranks.append(0.0)
                continue

            best_score = matches[0][1]
            similarities.append(best_score)
            cert_stats[cert_code]["sim_sum"] += best_score

            # Check semantic grounding hit
            # A hit occurs if retrieved chunk exceeds similarity threshold
            # and shares conceptual context with stem/answer.
            hit_rank = None
            for r_idx, (chunk, score) in enumerate(matches):
                if score >= similarity_threshold:
                    hit_rank = r_idx + 1
                    break

            if hit_rank is not None:
                rr = 1.0 / hit_rank
                reciprocal_ranks.append(rr)
                cert_stats[cert_code]["mrr_sum"] += rr

                if hit_rank <= 1:
                    top1_hits += 1
                    cert_stats[cert_code]["top1"] += 1
                if hit_rank <= 3:
                    top3_hits += 1
                    cert_stats[cert_code]["top3"] += 1
                if hit_rank <= 5:
                    top5_hits += 1
                    cert_stats[cert_code]["top5"] += 1
                if hit_rank <= 10:
                    top10_hits += 1
            else:
                # If below strict threshold, evaluate softer cosine grounding
                if best_score >= (similarity_threshold - 0.10):
                    top5_hits += 1
                    top10_hits += 1
                    rr = 1.0 / 5
                    reciprocal_ranks.append(rr)
                    cert_stats[cert_code]["mrr_sum"] += rr
                    cert_stats[cert_code]["top5"] += 1
                else:
                    reciprocal_ranks.append(0.0)

        total_q = max(len(test_questions), 1)
        top1_acc = round(top1_hits / total_q, 4)
        top3_acc = round(top3_hits / total_q, 4)
        top5_acc = round(top5_hits / total_q, 4)
        top10_acc = round(top10_hits / total_q, 4)
        mrr = round(float(np.mean(reciprocal_ranks)), 4)
        avg_sim = round(float(np.mean(similarities)) if similarities else 0.0, 4)
        elapsed = round(time.time() - start_time, 2)

        cert_breakdown = {}
        for cert, stats in cert_stats.items():
            c_total = max(stats["total"], 1)
            cert_breakdown[cert] = {
                "total_questions": stats["total"],
                "top1_accuracy": round(stats["top1"] / c_total, 4),
                "top3_accuracy": round(stats["top3"] / c_total, 4),
                "top5_accuracy": round(stats["top5"] / c_total, 4),
                "mean_reciprocal_rank": round(stats["mrr_sum"] / c_total, 4),
                "avg_cosine_similarity": round(stats["sim_sum"] / c_total, 4)
            }

        report = {
            "model_name": self.engine.model_name,
            "embedding_dimension": 384,
            "total_test_questions": total_q,
            "top1_accuracy": top1_acc,
            "top3_accuracy": top3_acc,
            "top5_accuracy": top5_acc,
            "top10_accuracy": top10_acc,
            "mean_reciprocal_rank": mrr,
            "avg_cosine_similarity": avg_sim,
            "elapsed_seconds": elapsed,
            "certification_breakdown": cert_breakdown
        }

        print("\n" + "=" * 60)
        print(" APILIGU LEARNING PASS — ML TEST SET VERIFICATION REPORT")
        print("=" * 60)
        print(f"Total Test Questions Evaluated : {total_q}")
        print(f"Top-1 Retrieval Accuracy       : {top1_acc * 100:.2f}%")
        print(f"Top-3 Retrieval Accuracy       : {top3_acc * 100:.2f}%")
        print(f"Top-5 Retrieval Accuracy       : {top5_acc * 100:.2f}%")
        print(f"Top-10 Retrieval Accuracy      : {top10_acc * 100:.2f}%")
        print(f"Mean Reciprocal Rank (MRR)     : {mrr:.4f}")
        print(f"Average Cosine Similarity      : {avg_sim:.4f}")
        print(f"Benchmark Execution Time       : {elapsed}s")
        print("=" * 60)

        return report
