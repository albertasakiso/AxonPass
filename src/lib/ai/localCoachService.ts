/**
 * AnoxPass Local Open-Weights AI Coach Service
 * 100% Self-Hosted, Open-Source, Zero Paid APIs.
 *
 * Connection priority:
 *   1. Local Python RAG + Coach Bridge (`http://127.0.0.1:8765/coach`)
 *   2. Direct Local Ollama Open-Weights Server (`http://127.0.0.1:11434/api/generate`)
 *   3. Deterministic Offline Coaching Engine (works 100% in-browser / airplane mode)
 */

export type LocalCoachMode =
  | 'exam_proctor'
  | 'speech_coach'
  | 'reading_coach'
  | 'leadership_mentor';

export interface LocalCoachSource {
  document_name?: string;
  certification_code?: string;
  similarity_score?: number;
}

export interface SpeechMetrics {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  fillerCount: number;
  fillerRatePercent: number;
  wpm: number | null;
  deliveryScore: number;
}

export interface LocalCoachRequest {
  mode: LocalCoachMode;
  message: string;
  domain?: string;
  model?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface LocalCoachResponse {
  mode: LocalCoachMode;
  engine: string;
  response: string;
  sources: LocalCoachSource[];
  speechMetrics?: SpeechMetrics;
  offlineFallback: boolean;
}

export interface LocalCoachHealth {
  bridgeOnline: boolean;
  ollamaOnline: boolean;
  activeEngine: 'python-rag-bridge' | 'ollama-direct' | 'offline-deterministic';
  availableModels: string[];
  ragChunks: number;
}

export interface LocalStorageStats {
  strategy: string;
  raw_local_mb: number;
  optimized_local_mb: number;
  compact_cloud_pack_gz_mb: number;
  compression_savings_percent: number;
  unique_chunks: number;
  duplicates_removed: number;
  supabase_budget_cap_mb: number;
  zero_raw_pdfs_in_cloud: boolean;
  zero_float32_vectors_in_cloud: boolean;
  bridgeOnline: boolean;
}

const DEFAULT_BRIDGE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LOCAL_AI_BRIDGE_URL ||
  'http://127.0.0.1:8765';

const DEFAULT_OLLAMA_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OLLAMA_URL ||
  'http://127.0.0.1:11434';

const DEFAULT_OLLAMA_MODEL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OLLAMA_MODEL ||
  'anoxpass-coach';

const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'basically',
  'actually',
  'literally',
  'sort of',
  'kind of',
  'i mean',
];

export const COACH_MODE_CONFIG: Record<
  LocalCoachMode,
  { title: string; subtitle: string; placeholder: string; badge: string }
> = {
  exam_proctor: {
    title: 'Exam Proctor',
    subtitle: '4-part psychometric dissection grounded in your local study corpus',
    placeholder: 'Paste a certification question or ask why an answer is correct...',
    badge: 'Psychometric RAG',
  },
  speech_coach: {
    title: 'Public Speaking Coach',
    subtitle: 'Rhetoric, pacing, filler-word audit & 3-minute deliberate practice drills',
    placeholder: 'Paste your speech opening, pitch, or impromptu transcript...',
    badge: 'Rhetoric & Pacing',
  },
  reading_coach: {
    title: 'Socratic Reading Coach',
    subtitle: 'Analytical/Syntopical reading, SQ3R, Zettelkasten atomic notes & active recall',
    placeholder: 'Summarize a chapter or paste a passage you want to master...',
    badge: 'SQ3R & Zettelkasten',
  },
  leadership_mentor: {
    title: 'Leadership Case-Study Mentor',
    subtitle: "Bill Walsh's Standard of Performance & classic executive playbooks",
    placeholder: 'Describe a leadership dilemma or ask about The Score Takes Care of Itself...',
    badge: 'Bill Walsh Playbook',
  },
};

export function analyzeSpeechLocally(
  transcript: string,
  durationSeconds?: number
): SpeechMetrics {
  const words = transcript.match(/\b[\w']+\b/g) || [];
  const wordCount = words.length;
  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLength = Number((wordCount / sentenceCount).toFixed(1));

  const lower = transcript.toLowerCase();
  let fillerCount = 0;
  for (const fw of FILLER_WORDS) {
    const matches = lower.match(new RegExp(`\\b${fw.replace(/\s+/g, '\\s+')}\\b`, 'g'));
    if (matches) fillerCount += matches.length;
  }

  const fillerRatePercent = Number(((fillerCount / Math.max(wordCount, 1)) * 100).toFixed(2));
  const wpm =
    durationSeconds && durationSeconds > 0
      ? Number(((wordCount / durationSeconds) * 60).toFixed(1))
      : null;

  let deliveryScore = 88 - Math.min(25, Math.round(fillerRatePercent * 4));
  if (avgSentenceLength > 24) deliveryScore -= 8;
  if (wordCount < 25) deliveryScore -= 10;
  deliveryScore = Math.max(40, Math.min(99, deliveryScore));

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    fillerCount,
    fillerRatePercent,
    wpm,
    deliveryScore,
  };
}

function buildOfflineFallback(req: LocalCoachRequest): LocalCoachResponse {
  const { mode, message, metadata } = req;

  if (mode === 'speech_coach') {
    const dur = typeof metadata?.duration_seconds === 'number' ? metadata.duration_seconds : undefined;
    const metrics = analyzeSpeechLocally(message, dur);
    return {
      mode,
      engine: 'offline-deterministic',
      offlineFallback: true,
      sources: [],
      speechMetrics: metrics,
      response: [
        `### 1. Delivery & Structure Score: **${metrics.deliveryScore}/100**`,
        `- **Length**: ${metrics.wordCount} words across ${metrics.sentenceCount} sentences (avg ${metrics.avgSentenceLength} words/sentence).`,
        `- **Filler Words**: ${metrics.fillerCount} detected (${metrics.fillerRatePercent}%).${metrics.wpm ? ` **Pace**: ${metrics.wpm} WPM (target 130–150 WPM).` : ''}`,
        '',
        '### 2. Rhetoric & Storytelling Breakdown',
        '- Structure your argument with **PREP** (Point → Reason → Example → Point).',
        '- Keep your thesis sentence under 16 words and pause 2 full seconds after delivering it.',
        '',
        '### 3. Next 3-Minute Deliberate Practice Drill',
        '- Stand up and deliver your opening 30 seconds aloud twice: once at 80% speed with deliberate pauses, and once removing every hedge word.',
      ].join('\n'),
    };
  }

  if (mode === 'reading_coach') {
    const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
    return {
      mode,
      engine: 'offline-deterministic',
      offlineFallback: true,
      sources: [],
      response: [
        '### 1. Comprehension & Synthesis Check',
        `- Captured a ${wordCount}-word synthesis. Verify you can state the author's core thesis without looking at the page.`,
        '',
        '### 2. Socratic Probing Questions',
        '1. What is the single strongest piece of evidence the author uses — and where could it fail?',
        '2. How does this concept reinforce or contradict another book or certification framework you know?',
        '3. What concrete habit or decision will you change this week based on this insight?',
        '',
        '### 3. Atomic Zettelkasten Note',
        `- **Core Claim**: ${message.slice(0, 140).trim()}${message.length > 140 ? '…' : ''}`,
        '- **Tags**: `#active-reading` `#sq3r` `#zettelkasten`',
      ].join('\n'),
    };
  }

  if (mode === 'leadership_mentor') {
    return {
      mode,
      engine: 'offline-deterministic',
      offlineFallback: true,
      sources: [],
      response: [
        '### 1. Standard of Performance Diagnosis (Bill Walsh)',
        '- *The Score Takes Care of Itself*: Stop obsessing over the scoreboard and inspect the daily execution standards that produce the outcome.',
        '',
        '### 2. Mental Model & Book Framework',
        '- Pair **Standard of Performance** (Bill Walsh) with **Extreme Ownership** (Jocko Willink): own the clarity of expectations, coach the system, and protect team composure.',
        '',
        '### 3. Contingency Playbook (3 Concrete Actions)',
        '1. **Script the First 15 Plays**: Write down the exact non-negotiable standards for your next team meeting.',
        '2. **Teach, Don’t Just Critique**: Turn recurring friction into a simple, rehearsed checklist.',
        '3. **Model Composure**: Your emotional steadiness under pressure sets the ceiling for your team.',
        '',
        '### 4. Reflection Challenge',
        '- Which standard have you quietly tolerated slipping over the last 30 days?',
      ].join('\n'),
    };
  }

  // exam_proctor default
  const upper = message.toUpperCase();
  const operator =
    ['FIRST', 'INITIAL', 'PRIMARY', 'MOST', 'BEST', 'LEAST'].find((op) =>
      new RegExp(`\\b${op}\\b`).test(upper)
    ) || 'BEST / PRIMARY';

  return {
    mode: 'exam_proctor',
    engine: 'offline-deterministic',
    offlineFallback: true,
    sources: [],
    response: [
      '### 1. Decision Operator & Cognitive Principle',
      `- **Detected Operator**: \`${operator}\``,
      '- Prioritize formal governance, risk assessment, and root-cause controls before tactical fixes.',
      '',
      '### 2. Option Elimination Heuristic',
      '- Eliminate choices where an auditor directly implements operational controls or bypasses management approval.',
      '- Favor answers grounded in documented policy, business alignment, and lowest residual risk.',
      '',
      '### 3. Memory Anchor',
      '- *Assess before acting; align with governance before executing technical remediation.*',
      '',
      '_Tip: Run `python local_ai_pipeline.py --serve` or `ollama run anoxpass-coach` for full local open-weights RAG reasoning._',
    ].join('\n'),
  };
}

export async function checkLocalCoachHealth(): Promise<LocalCoachHealth> {
  // 1. Check Python local RAG bridge
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${DEFAULT_BRIDGE_URL}/health`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return {
        bridgeOnline: true,
        ollamaOnline: true,
        activeEngine: 'python-rag-bridge',
        availableModels: [data.default_model || DEFAULT_OLLAMA_MODEL],
        ragChunks: data.rag?.total_chunks ?? 0,
      };
    }
  } catch {
    // Fall through to direct Ollama check
  }

  // 2. Check direct local Ollama server
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${DEFAULT_OLLAMA_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const models = Array.isArray(data.models)
        ? data.models.map((m: { name?: string }) => m.name || '').filter(Boolean)
        : [];
      return {
        bridgeOnline: false,
        ollamaOnline: true,
        activeEngine: 'ollama-direct',
        availableModels: models,
        ragChunks: 0,
      };
    }
  } catch {
    // Offline fallback
  }

  return {
    bridgeOnline: false,
    ollamaOnline: false,
    activeEngine: 'offline-deterministic',
    availableModels: [],
    ragChunks: 0,
  };
}

export async function askLocalCoach(req: LocalCoachRequest): Promise<LocalCoachResponse> {
  const model = req.model || DEFAULT_OLLAMA_MODEL;

  // 1. Try local Python RAG + Ollama bridge first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${DEFAULT_BRIDGE_URL}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: req.mode,
        message: req.message,
        domain: req.domain,
        metadata: req.metadata,
        model,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return {
        mode: req.mode,
        engine: data.engine || 'python-rag-bridge',
        response: data.response || '',
        sources: Array.isArray(data.sources) ? data.sources : [],
        offlineFallback: data.engine === 'offline-deterministic',
      };
    }
  } catch {
    // Fall through to direct Ollama
  }

  // 2. Try direct local Ollama server
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${DEFAULT_OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `[MODE: ${req.mode}]\n${req.message}`,
        stream: false,
        options: { temperature: 0.25 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.response) {
        return {
          mode: req.mode,
          engine: `ollama:${model}`,
          response: data.response,
          sources: [],
          offlineFallback: false,
        };
      }
    }
  } catch {
    // Fall through to deterministic offline coach
  }

  // 3. Guaranteed offline deterministic fallback
  return buildOfflineFallback(req);
}

export async function fetchLocalStorageStats(): Promise<LocalStorageStats> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${DEFAULT_BRIDGE_URL}/storage/stats`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return { ...data, bridgeOnline: true };
    }
  } catch {
    // Offline fallback
  }

  return {
    strategy: '3-tier-local-first-hybrid',
    raw_local_mb: 0,
    optimized_local_mb: 0,
    compact_cloud_pack_gz_mb: 0,
    compression_savings_percent: 0,
    unique_chunks: 0,
    duplicates_removed: 0,
    supabase_budget_cap_mb: 25,
    zero_raw_pdfs_in_cloud: true,
    zero_float32_vectors_in_cloud: true,
    bridgeOnline: false,
  };
}

export async function askCourseTutor(params: {
  certCode: string;
  lessonTitle: string;
  question: string;
  drillTitle?: string;
}): Promise<LocalCoachResponse> {
  return askLocalCoach({
    mode: 'exam_proctor',
    domain: params.certCode,
    message: `Lesson: ${params.lessonTitle} (${params.certCode})\n${params.drillTitle ? `Drill: ${params.drillTitle}\n` : ''}Question: ${params.question}`,
    metadata: {
      cert_code: params.certCode,
      lesson_title: params.lessonTitle,
      drill_title: params.drillTitle,
    },
  });
}
