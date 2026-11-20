/* ===================================================================
   ANOXPASS — Shared Academy, Mastery Paths, Books & FSRS Types
   =================================================================== */

export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export type DifficultyLabel =
  | 'Foundational'
  | 'Associate'
  | 'Professional'
  | 'Specialist'
  | 'Executive';

export const DIFFICULTY_TIER_META: Record<
  DifficultyTier,
  { label: DifficultyLabel; color: string; description: string }
> = {
  1: {
    label: 'Foundational',
    color: '#10b981',
    description: 'Core IT, networking, and security fundamentals with zero prerequisites.',
  },
  2: {
    label: 'Associate',
    color: '#3b82f6',
    description: 'Applied cloud, cybersecurity, and governance frameworks for practitioners.',
  },
  3: {
    label: 'Professional',
    color: '#8b5cf6',
    description: 'Audit, risk, defensive analysis, and high-stakes domain mastery.',
  },
  4: {
    label: 'Specialist',
    color: '#f59e0b',
    description: 'Senior enterprise architecture, cloud security, and management mastery.',
  },
  5: {
    label: 'Executive',
    color: '#ef4444',
    description: 'Board-level IT governance, strategic leadership, and enterprise assurance.',
  },
};

export type CoachMode =
  | 'exam_proctor'
  | 'speech_coach'
  | 'reading_coach'
  | 'leadership_mentor';

export interface PathDomainWeight {
  domain: string;
  weightPercent: number;
  keyTopics: string[];
}

export interface PathMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  readinessGate: string;
  xpReward: number;
}

export interface CertificationPath {
  id: string;
  certCode: string;
  title: string;
  provider: string;
  tier: DifficultyTier;
  tierLabel: DifficultyLabel;
  tagline: string;
  description: string;
  estimatedHours: number;
  examDurationMinutes: number;
  passingScore: string;
  questionCount: number;
  prerequisites: string[];
  nextRecommendedIds: string[];
  myDocumentsRefs: string[];
  domainWeights: PathDomainWeight[];
  readinessCriteria: string[];
  milestones: PathMilestone[];
  careerOutcomes: string[];
}

export type AcademyId = 'public-speaking' | 'reading-mastery' | 'leadership-mastery';

export type DrillType =
  | 'timed_speech'
  | 'impromptu_prompt'
  | 'vocal_drill'
  | 'reading_sprint'
  | 'sq3r_synthesis'
  | 'zettelkasten_card'
  | 'case_study'
  | 'decision_matrix'
  | 'reflection';

export interface PracticeDrill {
  id: string;
  title: string;
  type: DrillType;
  durationMinutes: number;
  prompt: string;
  steps: string[];
  successCriteria: string[];
  coachMode: CoachMode;
  xpReward: number;
}

export interface AcademyLesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  summary: string;
  keyConcepts: string[];
  frameworkName?: string;
  actionableTakeaway: string;
  drill: PracticeDrill;
  xpReward: number;
}

export interface AcademyModule {
  id: string;
  trackId: AcademyId;
  order: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  lessons: AcademyLesson[];
}

export interface AcademyTrack {
  id: AcademyId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  coachMode: CoachMode;
  estimatedHours: number;
  coreOutcomes: string[];
  modules: AcademyModule[];
}

export interface BookKeyIdea {
  id: string;
  number: number;
  title: string;
  summary: string;
  mentalModel: string;
  actionDrill: string;
  quote?: string;
}

export interface LeadershipBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  year: number;
  category:
    | 'Culture & Standards'
    | 'Ownership & Execution'
    | 'Trust & Team Leadership'
    | 'Strategy & Greatness'
    | 'Personal Effectiveness'
    | 'Habits & Systems'
    | 'Decision Science';
  featured?: boolean;
  readTimeMinutes: number;
  difficulty: DifficultyTier;
  accentColor: string;
  executiveSummary: string;
  whyItMatters: string;
  coreFramework: string;
  keyIdeas: BookKeyIdea[];
  discussionPrompts: string[];
  tags: string[];
}

export type FSRSRating = 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy

export type FSRSState = 'new' | 'learning' | 'review' | 'relearning';

export interface FSRSCard {
  id: string;
  sourceType: 'certification' | 'academy' | 'book';
  sourceId: string;
  front: string;
  back: string;
  tags: string[];
  // FSRS v4.5 parameters
  due: string; // ISO timestamp
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: FSRSState;
  lastReview?: string;
}
