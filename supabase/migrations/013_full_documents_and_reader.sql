-- Migration 013: Full Document Library, Manual Chapters & Reading Progress

-- 1. Enhance study_materials table for full document and chapter hierarchy
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS document_title VARCHAR(255);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS edition VARCHAR(100);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS chapter_number INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS section_number VARCHAR(50);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS page_start INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS page_end INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS estimated_read_minutes INTEGER DEFAULT 15;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS file_reference VARCHAR(255);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS key_takeaways TEXT;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS exam_tips TEXT;

-- 2. Reading progress tracking table
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  last_read_position_percent INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_material_progress UNIQUE (user_id, material_id)
);

CREATE INDEX IF NOT EXISTS idx_study_materials_cert_chapter ON study_materials(certification_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
