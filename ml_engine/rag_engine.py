#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Local Open-Source RAG Engine (sentence-transformers + FAISS/NumPy)
Indexes `my_documents/` across Certifications, Public Speaking, Reading & Leadership
100% Self-Hosted, Offline-First, Zero Paid APIs
===================================================================
"""

import os
import re
import json
import math
from typing import List, Dict, Any, Optional, Tuple
from collections import defaultdict

import numpy as np

from ml_engine.document_parser import UniversalDocumentParser
from ml_engine.vector_engine import LocalVectorEngine

try:
    import faiss  # type: ignore
except ImportError:
    faiss = None


ACADEMY_KEYWORDS: Dict[str, List[str]] = {
    "PUBLIC-SPEAKING": ["speaking", "rhetoric", "speech", "presentation", "oratory", "toastmasters", "storytelling"],
    "READING-MASTERY": ["reading", "zettelkasten", "sq3r", "speed-reading", "adler", "memory", "study-skills"],
    "LEADERSHIP": ["leadership", "management", "walsh", "score-takes-care", "extreme-ownership", "good-to-great", "habits"],
    "BOOKS": ["book", "summary", "playbook", "biography", "classic"],
}


def classify_corpus_domain(file_path: str, filename: str, base_cert: str) -> str:
    """Extends certification detection with Academy & Leadership Books categories."""
    if base_cert and base_cert != "GENERAL":
        return base_cert
    lower = f"{file_path} {filename}".lower()
    for category, keywords in ACADEMY_KEYWORDS.items():
        if any(kw in lower for kw in keywords):
            return category
    return "GENERAL"


class LocalRAGEngine:
    """
    Hybrid local RAG engine combining dense embeddings (sentence-transformers)
    with optional FAISS IndexFlatIP acceleration and lexical keyword boost.
    """

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        index_dir: Optional[str] = None,
    ):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.docs_dir = os.path.join(root_dir, "my_documents")
        self.index_dir = index_dir or os.path.join(root_dir, "ml_engine")
        self.npz_path = os.path.join(self.index_dir, "vector_store.npz")
        self.meta_path = os.path.join(self.index_dir, "chunks_metadata.json")
        self.faiss_path = os.path.join(self.index_dir, "vector_store.faiss")

        self.vector_engine = LocalVectorEngine(model_name=model_name)
        self.faiss_index = None
        self.is_loaded = False

    def _build_faiss_index(self, embeddings: np.ndarray) -> None:
        if faiss is None or embeddings is None or len(embeddings) == 0:
            return
        dim = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)
        index.add(np.ascontiguousarray(embeddings.astype(np.float32)))
        self.faiss_index = index

    def ingest_and_index(self, docs_dir: Optional[str] = None, max_files: int = 0) -> Dict[str, Any]:
        """Scans my_documents/, chunks files, embeds with open-weights model, and persists index."""
        target_dir = docs_dir or self.docs_dir
        parser = UniversalDocumentParser(chunk_size=700, chunk_overlap=120)
        all_chunks: List[Dict[str, Any]] = []
        domain_counts: Dict[str, int] = defaultdict(int)
        files_processed = 0

        if not os.path.isdir(target_dir):
            return {"status": "missing_docs_dir", "docs_dir": target_dir, "chunks": 0}

        for root, _, files in os.walk(target_dir):
            for fname in files:
                ext = os.path.splitext(fname)[1].lower()
                if ext not in (".pdf", ".docx", ".doc", ".epub", ".md", ".txt", ".text"):
                    continue
                full_path = os.path.join(root, fname)
                files_processed += 1
                try:
                    file_chunks = parser.process_file(full_path, target_dir)
                    for ch in file_chunks:
                        ch["certification_code"] = classify_corpus_domain(
                            full_path, fname, ch.get("certification_code", "GENERAL")
                        )
                        domain_counts[ch["certification_code"]] += 1
                    all_chunks.extend(file_chunks)
                except Exception as err:
                    print(f"  [RAG-WARN] Skipping {fname}: {err}")

                if max_files > 0 and files_processed >= max_files:
                    break
            if max_files > 0 and files_processed >= max_files:
                break

        if not all_chunks:
            return {"status": "empty", "files_processed": files_processed, "chunks": 0}

        embeddings = self.vector_engine.train_and_index(all_chunks, show_progress=True)
        self.vector_engine.save_index(self.npz_path, self.meta_path)

        if faiss is not None:
            self._build_faiss_index(embeddings)
            faiss.write_index(self.faiss_index, self.faiss_path)

        self.is_loaded = True
        return {
            "status": "indexed",
            "files_processed": files_processed,
            "total_chunks": len(all_chunks),
            "domains": dict(domain_counts),
            "backend": "faiss" if self.faiss_index is not None else "numpy",
        }

    def load(self) -> bool:
        """Loads persisted vector index and optional FAISS index from disk."""
        if self.is_loaded:
            return True
        loaded = self.vector_engine.load_index(self.npz_path, self.meta_path)
        if not loaded:
            return False
        if faiss is not None:
            if os.path.exists(self.faiss_path):
                self.faiss_index = faiss.read_index(self.faiss_path)
            elif self.vector_engine.embeddings is not None:
                self._build_faiss_index(self.vector_engine.embeddings)
        self.is_loaded = True
        return True

    @staticmethod
    def _lexical_overlap(query: str, text: str) -> float:
        q_tokens = set(re.findall(r"\b[a-z0-9]{3,}\b", query.lower()))
        if not q_tokens:
            return 0.0
        t_tokens = set(re.findall(r"\b[a-z0-9]{3,}\b", text.lower()))
        return len(q_tokens & t_tokens) / len(q_tokens)

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        filter_domain: Optional[str] = None,
        hybrid_alpha: float = 0.85,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top-k relevant passages using dense cosine similarity + lexical reranking.
        Falls back gracefully to pure lexical search if embeddings are unavailable.
        """
        if not self.is_loaded:
            self.load()

        if not self.vector_engine.chunks_metadata:
            return []

        candidates: List[Tuple[Dict[str, Any], float]] = []
        try:
            if self.faiss_index is not None and not filter_domain:
                q_vec = self.vector_engine.encode_single(query).reshape(1, -1)
                scores, indices = self.faiss_index.search(q_vec, min(top_k * 3, len(self.vector_engine.chunks_metadata)))
                for score, idx in zip(scores[0], indices[0]):
                    if 0 <= idx < len(self.vector_engine.chunks_metadata):
                        candidates.append((self.vector_engine.chunks_metadata[idx], float(score)))
            else:
                candidates = self.vector_engine.search(query, top_k=top_k * 3, filter_cert=filter_domain)
        except Exception:
            # Pure lexical fallback if sentence-transformers model is not cached offline
            for ch in self.vector_engine.chunks_metadata:
                if filter_domain and filter_domain != "ALL" and ch.get("certification_code") != filter_domain:
                    continue
                lex = self._lexical_overlap(query, ch.get("chunk_text", ""))
                if lex > 0:
                    candidates.append((ch, lex))

        reranked = []
        for chunk, dense_score in candidates:
            lex_score = self._lexical_overlap(query, chunk.get("chunk_text", ""))
            final_score = hybrid_alpha * dense_score + (1.0 - hybrid_alpha) * lex_score
            item = dict(chunk)
            item["similarity_score"] = round(float(final_score), 4)
            reranked.append(item)

        reranked.sort(key=lambda x: x["similarity_score"], reverse=True)
        return reranked[:top_k]

    def get_stats(self) -> Dict[str, Any]:
        """Returns current local RAG index status."""
        if not self.is_loaded:
            self.load()
        chunks = self.vector_engine.chunks_metadata
        by_domain: Dict[str, int] = defaultdict(int)
        for ch in chunks:
            by_domain[ch.get("certification_code", "GENERAL")] += 1
        return {
            "loaded": self.is_loaded,
            "total_chunks": len(chunks),
            "backend": "faiss" if self.faiss_index is not None else "numpy",
            "embedding_model": self.vector_engine.model_name,
            "domains": dict(by_domain),
        }
