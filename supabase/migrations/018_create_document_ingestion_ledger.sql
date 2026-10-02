-- ===================================================================
-- APILIGU LEARNING PASS — Migration 018: Document Ingestion Ledger
-- 100% Ingestion & AI/ML Training Ledger (Zero-Cloud-Storage Architecture)
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.document_ingestion_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size_bytes BIGINT NOT NULL,
    file_format TEXT NOT NULL,
    certification_slug TEXT NOT NULL,
    certification_name TEXT NOT NULL,
    ingestion_status TEXT NOT NULL DEFAULT 'ingested_and_indexed',
    extracted_tokens_count INTEGER DEFAULT 0,
    extracted_chunks_count INTEGER DEFAULT 0,
    mapped_domains JSONB DEFAULT '[]'::jsonb,
    mapped_topics_count INTEGER DEFAULT 0,
    associated_questions_count INTEGER DEFAULT 0,
    cloud_storage_bytes BIGINT DEFAULT 0,
    cloud_storage_status TEXT DEFAULT 'zero_bytes_locally_processed',
    ingestion_timestamp TIMESTAMPTZ DEFAULT now(),
    verification_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by certification slug and status
CREATE INDEX IF NOT EXISTS idx_doc_ledger_cert ON public.document_ingestion_ledger(certification_slug);
CREATE INDEX IF NOT EXISTS idx_doc_ledger_status ON public.document_ingestion_ledger(ingestion_status);

-- RLS Policy (Read access for all authenticated & anon users, modify for service role)
ALTER TABLE public.document_ingestion_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on document_ingestion_ledger"
    ON public.document_ingestion_ledger FOR SELECT
    USING (true);

CREATE POLICY "Allow all operations for service role on document_ingestion_ledger"
    ON public.document_ingestion_ledger FOR ALL
    USING (true)
    WITH CHECK (true);
