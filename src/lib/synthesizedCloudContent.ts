/* ===================================================================
   ANOXPASS — Cloud-Synced Ollama-Synthesized Curriculum Client
   Reads compact text/JSON rows from Supabase (migration 025) so
   learners can study & take mock exams from ANY device without local
   Ollama running. Gracefully falls back to empty arrays offline.
   =================================================================== */

import { supabase } from './supabase';
import { toCourseCertId } from './textbookService';
import type { CourseLesson } from '../types/course';

export interface SynthesizedExamQuestion {
  id: string;
  cert_id: string;
  domain_name: string;
  difficulty: string;
  question_text: string;
  options: string[];
  correct_index: number;
  rationale: string;
  exam_trap?: string;
  source_ref?: string;
  model_name?: string;
}

export interface SynthesisJobRow {
  id: string;
  cert_id: string;
  status: string;
  total_units: number;
  completed_units: number;
  lessons_created: number;
  questions_created: number;
  est_db_mb: number;
  model_name?: string;
  updated_at?: string;
}

/**
 * Fetches cloud-synced synthesized lessons for a certification and normalizes
 * them into the CourseLesson shape used by CoursePlayerPage.
 */
export async function fetchSynthesizedLessons(certId: string): Promise<CourseLesson[]> {
  try {
    const normalizedId = toCourseCertId(certId);
    const { data, error } = await supabase
      .from('synthesized_lessons')
      .select('id, cert_id, domain_name, lesson_slug, title, content_json, source_refs')
      .eq('cert_id', normalizedId)
      .order('created_at', { ascending: true });

    if (error || !Array.isArray(data)) return [];

    return data.map((row) => {
      const c = (row.content_json || {}) as Partial<CourseLesson>;
      return {
        id: `cloud-${row.id}`,
        title: c.title || row.title || 'Synthesized Lesson',
        estimatedMinutes: c.estimatedMinutes || 15,
        summary: c.summary || `AI-synthesized deep dive for ${row.domain_name || certId}.`,
        learningObjectives: Array.isArray(c.learningObjectives) ? c.learningObjectives : [],
        coreConcepts: Array.isArray(c.coreConcepts) ? c.coreConcepts : [],
        realWorldScenario: c.realWorldScenario || {
          title: 'Applied Scenario',
          situation: 'Apply the core principles from this synthesized unit.',
          analysis: 'Evaluate risk, governance, and technical controls systematically.',
          takeaway: 'Ground every decision in documented standards.',
        },
        examTraps: Array.isArray(c.examTraps) ? c.examTraps : [],
        keyTerms: Array.isArray(c.keyTerms) ? c.keyTerms : [],
        conceptChecks: Array.isArray(c.conceptChecks) ? c.conceptChecks : [],
        practicalDrill: c.practicalDrill || {
          title: 'Synthesis Drill',
          prompt: 'Summarize the key concepts in your own words.',
          steps: ['Review core concepts', 'Identify 2 exam traps', 'Add flashcards to FSRS'],
          successCriteria: 'Clear, accurate recall without notes.',
        },
        flashcards: Array.isArray(c.flashcards) ? c.flashcards : [],
        sourceRefs: Array.isArray(row.source_refs) && row.source_refs.length > 0
          ? row.source_refs
          : c.sourceRefs,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetches cloud-synced scenario exam questions for a certification.
 */
export async function fetchSynthesizedQuestions(
  certId: string,
  limit = 50
): Promise<SynthesizedExamQuestion[]> {
  try {
    const normalizedId = toCourseCertId(certId);
    const { data, error } = await supabase
      .from('synthesized_exam_questions')
      .select(
        'id, cert_id, domain_name, difficulty, question_text, options_json, correct_index, rationale, exam_trap, source_ref, model_name'
      )
      .eq('cert_id', normalizedId)
      .limit(limit);

    if (error || !Array.isArray(data)) return [];

    return data.map((row) => ({
      id: String(row.id),
      cert_id: String(row.cert_id),
      domain_name: String(row.domain_name || 'General'),
      difficulty: String(row.difficulty || 'medium'),
      question_text: String(row.question_text || ''),
      options: Array.isArray(row.options_json) ? row.options_json.map(String) : [],
      correct_index: Number(row.correct_index ?? 0),
      rationale: String(row.rationale || ''),
      exam_trap: row.exam_trap ? String(row.exam_trap) : undefined,
      source_ref: row.source_ref ? String(row.source_ref) : undefined,
      model_name: row.model_name ? String(row.model_name) : undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches live synthesis job progress across all certifications.
 */
export async function fetchSynthesisJobProgress(): Promise<SynthesisJobRow[]> {
  try {
    const { data, error } = await supabase
      .from('synthesis_jobs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !Array.isArray(data)) return [];

    return data.map((row) => ({
      id: String(row.id),
      cert_id: String(row.cert_id),
      status: String(row.status || 'pending'),
      total_units: Number(row.total_units || 0),
      completed_units: Number(row.completed_units || 0),
      lessons_created: Number(row.lessons_created || 0),
      questions_created: Number(row.questions_created || 0),
      est_db_mb: Number(row.est_db_mb || 0),
      model_name: row.model_name ? String(row.model_name) : undefined,
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    }));
  } catch {
    return [];
  }
}
