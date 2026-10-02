#!/usr/bin/env python3
"""
===================================================================
APILIGU LEARNING PASS — Local Vector Embedding & Semantic Retrieval Engine
100% Free, Open-Source Vector Machine Learning Pipeline (all-MiniLM-L6-v2)
===================================================================
"""

import os
import sys
import json
import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from collections import defaultdict

# Suppress HF symlinks warning on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None


class LocalVectorEngine:
    """High-performance local vector embedding engine and semantic retrieval index."""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2", batch_size: int = 64):
        self.model_name = model_name
        self.batch_size = batch_size
        self.model = None
        self.embeddings: Optional[np.ndarray] = None
        self.chunks_metadata: List[Dict[str, Any]] = []
        self.cert_indices: Dict[str, List[int]] = defaultdict(list)
        self.bm25_idf: Dict[str, float] = {}
        self.bm25_doc_freq: Dict[str, int] = defaultdict(int)

    def load_model(self):
        """Loads the sentence transformer model locally."""
        if self.model is None:
            print(f"[ML-ENGINE] Initializing local embedding model: '{self.model_name}'...")
            if SentenceTransformer is None:
                raise ImportError("sentence-transformers is required. Run 'pip install sentence-transformers'.")
            self.model = SentenceTransformer(self.model_name)
            print(f"[ML-ENGINE] Model loaded successfully! (Embedding Dim: 384, Offline: 100%)")

    def encode_texts(self, texts: List[str], show_progress: bool = True) -> np.ndarray:
        """Generates normalized vector embeddings for a list of text strings."""
        self.load_model()
        embeddings = self.model.encode(
            texts,
            batch_size=self.batch_size,
            show_progress_bar=show_progress,
            normalize_embeddings=True,
            convert_to_numpy=True
        )
        return embeddings.astype(np.float32)

    def encode_single(self, text: str) -> np.ndarray:
        """Encodes a single query text string to a normalized 384-d vector."""
        self.load_model()
        vec = self.model.encode(
            [text],
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_numpy=True
        )[0]
        return vec.astype(np.float32)

    def train_and_index(self, chunks: List[Dict[str, Any]], show_progress: bool = True) -> np.ndarray:
        """
        Takes all document chunks, extracts text, computes vector embeddings,
        builds the multi-cert index, and caches metadata.
        """
        print(f"\n[ML-TRAIN] Commencing local embedding training on {len(chunks)} document chunks...")
        self.chunks_metadata = chunks
        self.cert_indices.clear()

        for idx, chunk in enumerate(chunks):
            cert = chunk.get("certification_code", "GENERAL")
            self.cert_indices[cert].append(idx)

        texts = [c["chunk_text"] for c in chunks]
        self.embeddings = self.encode_texts(texts, show_progress=show_progress)

        print(f"[ML-TRAIN] Training complete! Embedding Matrix Shape: {self.embeddings.shape}")
        return self.embeddings

    def search(
        self,
        query: str,
        top_k: int = 5,
        filter_cert: Optional[str] = None
    ) -> List[Tuple[Dict[str, Any], float]]:
        """
        Performs sub-millisecond semantic cosine similarity search.
        Returns list of (chunk_metadata, similarity_score).
        """
        if self.embeddings is None or len(self.chunks_metadata) == 0:
            return []

        query_vec = self.encode_single(query)

        if filter_cert and filter_cert != "ALL" and filter_cert in self.cert_indices:
            candidate_indices = self.cert_indices[filter_cert]
            subset_embeddings = self.embeddings[candidate_indices]
            # Cosine similarity is dot product because vectors are L2-normalized
            scores = np.dot(subset_embeddings, query_vec)
            top_local_idx = np.argsort(-scores)[:top_k]
            
            results = []
            for l_idx in top_local_idx:
                global_idx = candidate_indices[l_idx]
                results.append((self.chunks_metadata[global_idx], float(scores[l_idx])))
            return results
        else:
            scores = np.dot(self.embeddings, query_vec)
            top_idx = np.argsort(-scores)[:top_k]
            results = []
            for g_idx in top_idx:
                results.append((self.chunks_metadata[g_idx], float(scores[g_idx])))
            return results

    def save_index(self, npz_path: str, meta_path: str):
        """Persists learned vector index and chunk metadata locally to disk."""
        if self.embeddings is not None:
            os.makedirs(os.path.dirname(npz_path), exist_ok=True)
            np.savez_compressed(npz_path, embeddings=self.embeddings)
            print(f"[STORAGE] Saved vector embeddings matrix -> {npz_path}")

        os.makedirs(os.path.dirname(meta_path), exist_ok=True)
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump({
                "model_name": self.model_name,
                "embedding_dim": 384,
                "total_chunks": len(self.chunks_metadata),
                "certifications": list(self.cert_indices.keys()),
                "chunks": self.chunks_metadata
            }, f, indent=2)
        print(f"[STORAGE] Saved chunks metadata -> {meta_path}")

    def load_index(self, npz_path: str, meta_path: str) -> bool:
        """Loads precomputed vector index and metadata from disk."""
        if not os.path.exists(npz_path) or not os.path.exists(meta_path):
            return False

        print(f"[STORAGE] Loading vector store from {npz_path}...")
        npz_data = np.load(npz_path)
        self.embeddings = npz_data['embeddings']

        with open(meta_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.chunks_metadata = data["chunks"]

        self.cert_indices.clear()
        for idx, chunk in enumerate(self.chunks_metadata):
            cert = chunk.get("certification_code", "GENERAL")
            self.cert_indices[cert].append(idx)

        print(f"[STORAGE] Loaded {len(self.chunks_metadata)} chunks with {self.embeddings.shape[1]}-d vectors.")
        return True


if __name__ == '__main__':
    engine = LocalVectorEngine()
    test_chunks = [
        {"chunk_text": "An audit charter establishes the authority and scope of the IT audit function.", "certification_code": "CISA"},
        {"chunk_text": "Risk assessment involves identifying vulnerabilities, threats, and potential business impacts.", "certification_code": "CRISC"},
        {"chunk_text": "Business Impact Analysis determines Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO).", "certification_code": "CISM"}
    ]
    engine.train_and_index(test_chunks, show_progress=False)
    results = engine.search("What document defines the role and authority of an internal auditor?", top_k=1)
    print("\nSearch Verification:")
    for chunk, score in results:
        print(f"Score: {score:.4f} | Cert: {chunk['certification_code']} | Text: {chunk['chunk_text']}")
