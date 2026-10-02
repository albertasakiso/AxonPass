-- ===================================================================
-- APILIGU LEARNING PASS — Migration 017: Document Vector Embeddings & RAG
-- 100% Open-Source Vector Search Engine with pgvector (384 Dimensions)
-- ===================================================================

-- Ensure pgvector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Table for Document Chunks & Vector Embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_name VARCHAR(255) NOT NULL,
  document_path TEXT NOT NULL,
  certification_code VARCHAR(50) DEFAULT 'GENERAL',
  domain_number INTEGER,
  topic_code VARCHAR(50),
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  char_count INTEGER NOT NULL,
  token_estimate INTEGER,
  embedding vector(384),
  metadata JSONB DEFAULT '{}'::jsonb,
  content_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (document_path, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_cert ON document_chunks (certification_code);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc ON document_chunks (document_name);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_topic ON document_chunks (topic_code);

-- Create HNSW index for vector cosine similarity search
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 2. Table for ML Training & Verification Metrics Benchmarks
CREATE TABLE IF NOT EXISTS ml_verification_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id VARCHAR(100) NOT NULL,
  embedding_model VARCHAR(100) NOT NULL DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
  embedding_dimension INTEGER NOT NULL DEFAULT 384,
  total_documents INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  total_test_questions INTEGER NOT NULL,
  top1_accuracy NUMERIC(6,4) NOT NULL,
  top3_accuracy NUMERIC(6,4) NOT NULL,
  top5_accuracy NUMERIC(6,4) NOT NULL,
  top10_accuracy NUMERIC(6,4) NOT NULL,
  mean_reciprocal_rank NUMERIC(6,4) NOT NULL,
  avg_cosine_similarity NUMERIC(6,4) NOT NULL,
  certification_breakdown JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'COMPLETED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ml_metrics_run ON ml_verification_metrics (run_id);

-- 3. Stored Procedure for Cosine Distance Semantic Matching (RPC)
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(384),
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 5,
  filter_cert varchar(50) DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_name varchar(255),
  document_path text,
  certification_code varchar(50),
  chunk_index int,
  chunk_text text,
  char_count int,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_name,
    dc.document_path,
    dc.certification_code,
    dc.chunk_index,
    dc.chunk_text,
    dc.char_count,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 
    (filter_cert IS NULL OR filter_cert = 'ALL' OR dc.certification_code = filter_cert)
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_verification_metrics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Public read document_chunks" ON document_chunks;
CREATE POLICY "Public read document_chunks" ON document_chunks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read ml_verification_metrics" ON ml_verification_metrics;
CREATE POLICY "Public read ml_verification_metrics" ON ml_verification_metrics FOR SELECT USING (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role full document_chunks" ON document_chunks;
CREATE POLICY "Service role full document_chunks" ON document_chunks FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full ml_verification_metrics" ON ml_verification_metrics;
CREATE POLICY "Service role full ml_verification_metrics" ON ml_verification_metrics FOR ALL TO service_role USING (true);
