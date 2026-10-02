/* ===================================================================
   AXONPASS — Local Ollama AI Client Service
   Direct IP & Tailscale Integration for Deep Exam Dissections
   Zero Recurring Cost | 100% Private Cognitive Inference
   =================================================================== */

import type { Question } from '../../types';
import { matchQuestionToKnowledgeNode } from '../ml/explainerEngine';
import type { KnowledgeNode } from '../ml/types';

export interface OllamaSettings {
  endpoint: string; // e.g., 'http://localhost:11434' or 'http://100.x.y.z:11434'
  model: string; // e.g., 'axonpass-mentor', 'deepseek-r1:8b', 'qwen2.5:7b'
  temperature: number;
  enabled: boolean;
}

const SETTINGS_KEY = 'axonpass_ollama_settings';

export const DEFAULT_OLLAMA_SETTINGS: OllamaSettings = {
  endpoint: 'http://localhost:11434',
  model: 'axonpass-mentor',
  temperature: 0.2,
  enabled: true,
};

export function getOllamaSettings(): OllamaSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_OLLAMA_SETTINGS;
    return { ...DEFAULT_OLLAMA_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_OLLAMA_SETTINGS;
  }
}

export function saveOllamaSettings(settings: Partial<OllamaSettings>): OllamaSettings {
  const current = getOllamaSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Checks connectivity to the Ollama endpoint and returns the list of available models.
 */
export async function testOllamaConnection(
  endpointUrl?: string
): Promise<{ ok: boolean; models: string[]; latencyMs: number; error?: string }> {
  const base = (endpointUrl || getOllamaSettings().endpoint).replace(/\/+$/, '');
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${base}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      return {
        ok: false,
        models: [],
        latencyMs,
        error: `Ollama returned status ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];

    return {
      ok: true,
      models,
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const msg = err instanceof Error ? err.message : String(err);

    let friendlyError = msg;
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      friendlyError =
        'Cannot connect to Ollama. Ensure: 1) Ollama is running. 2) OLLAMA_ORIGINS="*" is set. 3) If using HTTPS on the web, use Tailscale Serve or a secure tunnel.';
    }

    return {
      ok: false,
      models: [],
      latencyMs,
      error: friendlyError,
    };
  }
}

/**
 * Automatically builds an authoritative grounded prompt payload so the user
 * never has to explain the context or framework to Ollama.
 */
export function buildGroundedPrompt(
  question: Question,
  selectedOption?: 'A' | 'B' | 'C' | 'D' | null,
  groundingNode?: KnowledgeNode
): string {
  const node = groundingNode || matchQuestionToKnowledgeNode(question);

  const optionsMap: Record<string, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  const candidateAnswer = selectedOption ? `Option ${selectedOption}: "${optionsMap[selectedOption] || ''}"` : 'Not yet selected';
  const correctAnswer = `Option ${question.correct_answer}: "${optionsMap[question.correct_answer] || ''}"`;

  return `
[EXAM DOMAIN]: ${node.certificationCode} — Domain ${node.domainNumber} (${node.domainName})
[SYLLABUS GROUNDING]: [${node.topicCode}] ${node.name}
[MANUAL SECTION]: ${node.manualSection}
[TASK STATEMENTS]: ${node.taskStatements?.join(', ') || 'N/A'}
[KNOWLEDGE ANCHORS]: ${node.keywords?.slice(0, 10).join(', ') || 'N/A'}

[QUESTION STEM]:
${question.stem}

[OPTIONS]:
A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}

[CANDIDATE SELECTION]: ${candidateAnswer}
[OFFICIAL CORRECT KEY]: ${correctAnswer}
[AUTHORITATIVE RATIONALE]:
${question.rationale}

Dissect this question immediately using your 4-part matrix (Decision Operator, Option-by-Option Justification Matrix, Official Syllabus Grounding, and Exam Trap Warning).
`.trim();
}

/**
 * Streams a live cognitive explanation from the local or Tailscale Ollama instance.
 */
export async function streamOllamaExplanation(
  question: Question,
  selectedOption: 'A' | 'B' | 'C' | 'D' | null | undefined,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const settings = getOllamaSettings();
  const base = settings.endpoint.replace(/\/+$/, '');
  const prompt = buildGroundedPrompt(question, selectedOption);

  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model,
      prompt,
      stream: true,
      options: {
        temperature: settings.temperature,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Ollama request failed (${res.status}): ${errorText}`);
  }

  if (!res.body) {
    throw new Error('ReadableStream not supported by browser or response has no body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          accumulated += parsed.response;
          onChunk(accumulated);
        }
      } catch {
        // partial json chunk, continue
      }
    }
  }

  return accumulated;
}
