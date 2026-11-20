/* ===================================================================
   ANOXPASS — End-to-End Certification Course Schema
   Powers zero-to-exam-ready structured learning inside AnoxPass.
   =================================================================== */

import type { DifficultyTier } from './academy';

export interface CourseConcept {
  heading: string;
  explanation: string;
  mentalModel?: string;
  formulaOrRule?: string;
}

export interface CourseScenario {
  title: string;
  situation: string;
  analysis: string;
  takeaway: string;
}

export interface CourseKeyTerm {
  term: string;
  definition: string;
}

export interface CourseConceptCheck {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface CoursePracticalDrill {
  title: string;
  prompt: string;
  steps: string[];
  successCriteria: string;
}

export interface CourseFlashcard {
  front: string;
  back: string;
  tag: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  summary: string;
  learningObjectives: string[];
  coreConcepts: CourseConcept[];
  realWorldScenario: CourseScenario;
  examTraps: string[];
  keyTerms: CourseKeyTerm[];
  conceptChecks: CourseConceptCheck[];
  practicalDrill: CoursePracticalDrill;
  flashcards: CourseFlashcard[];
  sourceRefs?: string[];
}

export interface CourseDomain {
  id: string;
  domainNumber: number;
  title: string;
  examWeightPercent: number;
  overview: string;
  lessons: CourseLesson[];
}

export interface CapstoneCaseStudy {
  title: string;
  scenario: string;
  tasks: string[];
  modelSolution: string;
}

export interface ExamStrategy {
  examFormat: string;
  timeManagementPlan: string;
  mindsetRules: string[];
  finalWeekChecklist: string[];
}

export interface CertificationCourse {
  certId: string; // Matches CertificationPath.id in src/data/certificationPaths.ts
  certCode: string;
  title: string;
  provider: string;
  tier: DifficultyTier;
  tagline: string;
  estimatedTotalHours: number;
  passingScore: string;
  domains: CourseDomain[];
  capstone: CapstoneCaseStudy;
  examStrategy: ExamStrategy;
}
