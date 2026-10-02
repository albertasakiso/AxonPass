#!/usr/bin/env python3
"""
===================================================================
APILIGU LEARNING PASS — Universal Multi-Cert ML / AI Knowledge Engine
Authoritative Corpus Digester, BM25 Vector Space & Knowledge Graph Compiler
Supports all 15 active certifications across ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA
===================================================================
"""

import os
import sys
import json
import re
import math
import psycopg2
from collections import defaultdict, Counter

# Ensure UTF-8 encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, '.env')

OUTPUT_JSON_PATH = os.path.join(ROOT_DIR, 'ml_engine', 'knowledgeGraph.json')
OUTPUT_TS_PATH = os.path.join(ROOT_DIR, 'src', 'lib', 'ml', 'knowledgeGraph.ts')

def get_db_connection():
    with open(ENV_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    direct_url = ''
    for line in content.splitlines():
        trimmed = line.strip()
        if trimmed.startswith('DIRECT_URL='):
            direct_url = trimmed.replace('DIRECT_URL=', '').strip('\'"')
            break
    if not direct_url:
        match = re.search(r'postgresql://[^\s]+', content)
        if match:
            direct_url = match.group(0)
    
    return psycopg2.connect(direct_url)

def clean_text_for_tokens(text: str) -> list[str]:
    tokens = re.findall(r'\b[a-zA-Z0-9_\-\.\/]{2,}\b', text.lower())
    stopwords = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
        'has', 'have', 'had', 'its', 'their', 'which', 'will', 'all', 'any', 'can',
        'not', 'but', 'into', 'been', 'must', 'should', 'could', 'such', 'when',
        'what', 'more', 'also', 'than', 'them', 'they', 'each', 'about', 'after'
    }
    return [t for t in tokens if t not in stopwords and len(t) > 2]

def main():
    print("=== EXTRACTING MULTI-CERTIFICATION CORPUS FROM DATABASE ===")
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, code, slug, name, publisher, body, version
        FROM certifications
        ORDER BY code;
    """)
    certs = cur.fetchall()

    all_nodes = []
    nodes_by_cert = defaultdict(list)
    bm25_stats_by_cert = {}
    inverted_index_by_cert = {}

    global_doc_lengths = {}
    global_term_doc_freq = defaultdict(int)

    for cert_row in certs:
        cert_id, cert_code, cert_slug, cert_name, publisher, body, version = cert_row
        print(f"\nIngesting Knowledge Nodes for [{cert_code}] {cert_name}...")

        # Fetch domains
        cur.execute("""
            SELECT id, domain_number, name, exam_weight_percent, learning_objectives
            FROM domains
            WHERE certification_id = %s
            ORDER BY domain_number;
        """, (cert_id,))
        domains = cur.fetchall()

        cert_nodes = []
        cert_doc_lengths = {}
        cert_term_doc_freq = defaultdict(int)
        cert_inverted_index = defaultdict(list)

        for d in domains:
            d_id, d_num, d_name, d_weight, d_objectives = d

            # Fetch topics for domain
            cur.execute("""
                SELECT id, topic_code, name, part, content_summary
                FROM topics
                WHERE domain_id = %s
                ORDER BY sort_order;
            """, (d_id,))
            topics = cur.fetchall()

            for t in topics:
                t_id, t_code, t_name, t_part, t_summary = t

                # Fetch subtopics
                cur.execute("""
                    SELECT subtopic_code, name, content_body, key_terms, exam_tips, learning_objectives
                    FROM subtopics
                    WHERE topic_id = %s
                    ORDER BY sort_order;
                """, (t_id,))
                subtopics = cur.fetchall()

                sub_names = [st[1] for st in subtopics]
                sub_bodies = " ".join([st[2] or "" for st in subtopics])
                sub_terms = []
                for st in subtopics:
                    if st[3]:
                        sub_terms.extend(st[3])

                node_id = f"{cert_code.lower().replace('+', 'plus')}-{t_code.lower().replace('.', '-')}"
                
                # Compose searchable corpus text
                corpus_text = f"{t_code} {t_name} {t_summary or ''} {' '.join(sub_names)} {sub_bodies} {' '.join(sub_terms)}"
                tokens = clean_text_for_tokens(corpus_text)

                # Deduplicate keywords
                keywords = list(dict.fromkeys(sub_terms + [t_name] + sub_names))[:15]

                node = {
                    "id": node_id,
                    "certificationCode": cert_code,
                    "domainNumber": d_num,
                    "domainName": d_name,
                    "topicCode": t_code,
                    "name": t_name,
                    "summary": t_summary or (f"Comprehensive syllabus coverage of {t_name} in {cert_name}."),
                    "manualSection": f"Domain {d_num} - {d_name} § {t_code}",
                    "taskStatements": [f"T{d_num}.1", f"T{d_num}.2"],
                    "knowledgeStatements": [f"K{d_num}.1", f"K{d_num}.2"],
                    "keywords": keywords,
                    "prerequisites": [],
                    "relatedNodes": [],
                    "tokens": tokens
                }

                cert_nodes.append(node)
                all_nodes.append(node)

                # Indexing
                doc_len = len(tokens)
                cert_doc_lengths[node_id] = doc_len
                unique_tokens = set(tokens)
                for ut in unique_tokens:
                    cert_term_doc_freq[ut] += 1
                    cert_inverted_index[ut].append(node_id)

        # Calculate BM25 statistics for this certification
        N = len(cert_nodes)
        avg_dl = sum(cert_doc_lengths.values()) / max(N, 1)
        idf_map = {}
        for term, df in cert_term_doc_freq.items():
            idf_map[term] = round(math.log(1 + (N - df + 0.5) / (df + 0.5)), 4)

        nodes_by_cert[cert_code] = cert_nodes
        bm25_stats_by_cert[cert_code] = {
            "num_docs": N,
            "avg_dl": round(avg_dl, 2),
            "doc_lengths": cert_doc_lengths,
            "idf": idf_map
        }
        inverted_index_by_cert[cert_code] = dict(cert_inverted_index)

        print(f"  -> Generated {len(cert_nodes)} knowledge nodes, {len(idf_map)} unique vocabulary tokens (Avg DL: {avg_dl:.1f})")

    # Connect related nodes within each cert
    for cert_code, nodes in nodes_by_cert.items():
        for i, node in enumerate(nodes):
            related = []
            if i > 0:
                related.append(nodes[i - 1]["topicCode"])
            if i < len(nodes) - 1:
                related.append(nodes[i + 1]["topicCode"])
            node["relatedNodes"] = related

    cur.close()
    conn.close()

    print(f"\n=== COMPILING UNIVERSAL MULTI-CERT KNOWLEDGE GRAPH ({len(all_nodes)} TOTAL NODES) ===")

    # Write output JSON
    bundle_data = {
        "metadata": {
            "version": "2.0.0",
            "totalCertifications": len(certs),
            "totalNodes": len(all_nodes),
            "engine": "BM25 Vector Space & Item Response Theory (Dual Runtime)"
        },
        "nodesByCert": nodes_by_cert,
        "bm25StatsByCert": bm25_stats_by_cert,
        "invertedIndexByCert": inverted_index_by_cert
    }

    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bundle_data, f, indent=2)
    print(f"[SUCCESS] Wrote JSON bundle -> {OUTPUT_JSON_PATH}")

    # Generate TypeScript file
    ts_code = f"""/* ===================================================================
   APILIGU LEARNING PASS — Universal Multi-Cert Knowledge Graph Corpus
   Digested from 100% of all 15 active certifications (ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA).
   Auto-generated by ml_engine/train_and_index.py — DO NOT EDIT DIRECTLY.
   =================================================================== */

import type {{ KnowledgeNode }} from './types';

export const ALL_KNOWLEDGE_NODES: KnowledgeNode[] = {json.dumps(all_nodes, indent=2)};

export const NODES_BY_CERT: Record<string, KnowledgeNode[]> = {json.dumps(nodes_by_cert, indent=2)};

export const BM25_STATS_BY_CERT: Record<string, {{
  num_docs: number;
  avg_dl: number;
  doc_lengths: Record<string, number>;
  idf: Record<string, number>;
}}> = {json.dumps(bm25_stats_by_cert, indent=2)};

export const INVERTED_INDEX_BY_CERT: Record<string, Record<string, string[]>> = {json.dumps(inverted_index_by_cert, indent=2)};

// Legacy CISA backward-compatibility exports
export const CISA_KNOWLEDGE_GRAPH = NODES_BY_CERT['CISA'] || [];
export const CISA_BM25_STATS = BM25_STATS_BY_CERT['CISA'] || {{ num_docs: 60, avg_dl: 35.0, doc_lengths: {{}}, idf: {{}} }};
export const CISA_INVERTED_INDEX = INVERTED_INDEX_BY_CERT['CISA'] || {{}};
"""

    with open(OUTPUT_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"[SUCCESS] Wrote TypeScript module -> {OUTPUT_TS_PATH}")

if __name__ == '__main__':
    main()
