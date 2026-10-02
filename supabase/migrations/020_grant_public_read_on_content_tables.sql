-- Migration 020: Enable public/anon read access on educational content tables
-- Ensures guest learners and unauthenticated users can access the full curriculum,
-- subtopics, review manual chapters, case studies, task statements, and document ledger.

DROP POLICY IF EXISTS "Authenticated users can read subtopics" ON public.subtopics;
DROP POLICY IF EXISTS "Allow public read on subtopics" ON public.subtopics;
CREATE POLICY "Allow public read on subtopics" ON public.subtopics
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can read study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Allow public read on study materials" ON public.study_materials;
CREATE POLICY "Allow public read on study materials" ON public.study_materials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can read task_statements" ON public.task_statements;
DROP POLICY IF EXISTS "Allow public read on task_statements" ON public.task_statements;
CREATE POLICY "Allow public read on task_statements" ON public.task_statements
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can read case_studies" ON public.case_studies;
DROP POLICY IF EXISTS "Allow public read on case_studies" ON public.case_studies;
CREATE POLICY "Allow public read on case_studies" ON public.case_studies
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can read case_study_questions" ON public.case_study_questions;
DROP POLICY IF EXISTS "Allow public read on case_study_questions" ON public.case_study_questions;
CREATE POLICY "Allow public read on case_study_questions" ON public.case_study_questions
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on document_ingestion_ledger" ON public.document_ingestion_ledger;
CREATE POLICY "Allow public read on document_ingestion_ledger" ON public.document_ingestion_ledger
  FOR SELECT TO anon, authenticated USING (true);
