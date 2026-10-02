from sentence_transformers import SentenceTransformer
import numpy as np

print("Loading local embedding model: all-MiniLM-L6-v2...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")

sentences = [
    "Information systems auditing evaluates internal control effectiveness and risk posture.",
    "A disaster recovery plan ensures business continuity following a catastrophic disruption."
]

embeddings = model.encode(sentences)
print(f"Generated embeddings shape: {embeddings.shape}")
print(f"Dimension: {embeddings.shape[1]}")
dot_prod = np.dot(embeddings[0], embeddings[1])
print(f"Cosine similarity between sentences: {dot_prod:.4f}")
