/* ===================================================================
   ANOXPASS — Lightweight Supabase Knowledge Graph & BM25 Matcher Service
   Replaces the 15.05 MB static knowledgeGraph.ts bundle with lazy DB
   fetches against public.ml_knowledge_nodes + localStorage cache.
   100% Open-Source / Zero Paid APIs.
   =================================================================== */

import { supabase, isSupabaseConfigured } from '../supabase';
import type { Question } from '../../types';
import type { KnowledgeNode } from './types';

const STORAGE_KEY = 'anoxpass_ml_knowledge_nodes_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const ALIAS_TO_GRAPH_CODE: Record<string, string> = {
  cisa: 'CISA',
  cc: 'CC',
  'isc2-cc': 'CC',
  cissp: 'CISSP',
  cism: 'CISM',
  crisc: 'CRISC',
  ccsp: 'CCSP',
  'isc2-ccsp': 'CCSP',
  cgeit: 'CGEIT',
  cysa: 'CYSA+',
  'cysa+': 'CYSA+',
  'comptia-cysa-plus': 'CYSA+',
  'comptia-a-plus': 'A+',
  'a+': 'A+',
  aplus: 'A+',
  'comptia-network-plus': 'NETWORK+',
  'network+': 'NETWORK+',
  netplus: 'NETWORK+',
  'comptia-security-plus': 'SEC+',
  'sec+': 'SEC+',
  'security+': 'SEC+',
  'fifa-agent': 'FIFA-AGENT',
  fifa: 'FIFA-AGENT',
  grc: 'GRC',
  'grc-enterprise': 'GRC',
  gslc: 'GSLC',
  'giac-security-leadership': 'GSLC',
  'nist-grc': 'NIST',
  nist: 'NIST',
  'aws-csaa': 'SAA-C03',
  'aws-saa-c03': 'SAA-C03',
  'saa-c03': 'SAA-C03',
};

let memoryNodes: KnowledgeNode[] = [];
let inflightLoad: Promise<KnowledgeNode[]> | null = null;

export function resolveCertCodeForGraph(certSlugOrCode?: string): string {
  const raw = (certSlugOrCode || '').trim();
  if (!raw) return 'CISA';
  const low = raw.toLowerCase();
  if (ALIAS_TO_GRAPH_CODE[low]) return ALIAS_TO_GRAPH_CODE[low];
  return raw.toUpperCase();
}

function mapDbRowToNode(row: Record<string, unknown>): KnowledgeNode {
  const domNum = Number(row.domain_number || 1);
  return {
    id: String(row.id || ''),
    certificationCode: String(row.certification_code || 'CISA'),
    domainNumber: domNum,
    domainName: `Domain ${domNum}`,
    topicCode: String(row.topic_code || `T${domNum}.1`),
    name: String(row.name || 'Core Concept'),
    summary: String(row.summary || ''),
    manualSection: String(row.manual_section || `Domain ${domNum}`),
    taskStatements: Array.isArray(row.task_statements) ? row.task_statements.map(String) : [],
    knowledgeStatements: Array.isArray(row.knowledge_statements) ? row.knowledge_statements.map(String) : [],
    keywords: Array.isArray(row.keywords) ? row.keywords.map(String) : [],
    prerequisites: Array.isArray(row.prerequisites) ? row.prerequisites.map(String) : [],
    relatedNodes: Array.isArray(row.related_nodes) ? row.related_nodes.map(String) : [],
  };
}

function hydrateFromLocalStorage(): KnowledgeNode[] {
  if (memoryNodes.length > 0) return memoryNodes;
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { ts?: number; nodes?: KnowledgeNode[] };
    if (Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
      if (!parsed.ts || Date.now() - parsed.ts < CACHE_TTL_MS * 7) {
        memoryNodes = parsed.nodes;
        return memoryNodes;
      }
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

/**
 * Loads all lightweight ml_knowledge_nodes (338+ rows, omitting bm25_tokens) once and caches them.
 */
export async function preloadKnowledgeGraph(force = false): Promise<KnowledgeNode[]> {
  if (!force) {
    const cached = hydrateFromLocalStorage();
    if (cached.length > 0) return cached;
  }
  if (inflightLoad) return inflightLoad;
  if (!isSupabaseConfigured || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return hydrateFromLocalStorage();
  }

  inflightLoad = (async () => {
    try {
      const { data, error } = await supabase
        .from('ml_knowledge_nodes')
        .select('id, certification_code, domain_number, topic_code, name, summary, manual_section, task_statements, knowledge_statements, keywords, prerequisites, related_nodes')
        .order('certification_code')
        .order('domain_number');

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((r) => mapDbRowToNode(r as Record<string, unknown>));
        memoryNodes = mapped;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), nodes: mapped }));
          } catch {
            // ignore quota exceeded
          }
        }
        return mapped;
      }
    } catch (err) {
      console.warn('[KnowledgeGraphService] Remote load fallback:', err);
    } finally {
      inflightLoad = null;
    }
    return hydrateFromLocalStorage();
  })();

  return inflightLoad;
}

/**
 * Returns nodes for a specific certification slug or code (fetches on demand if needed).
 */
export async function fetchKnowledgeNodesForCert(certSlugOrCode?: string): Promise<{
  code: string;
  nodes: KnowledgeNode[];
}> {
  const resolvedCode = resolveCertCodeForGraph(certSlugOrCode);
  const all = await preloadKnowledgeGraph();
  const filtered = all.filter((n) => (n.certificationCode || '').toUpperCase() === resolvedCode);
  if (filtered.length > 0) {
    return { code: resolvedCode, nodes: filtered };
  }
  // If remote cache was stale before a new cert (e.g. SEC+) was added, try direct cert query
  if (isSupabaseConfigured && (typeof navigator === 'undefined' || navigator.onLine)) {
    const { data } = await supabase
      .from('ml_knowledge_nodes')
      .select('id, certification_code, domain_number, topic_code, name, summary, manual_section, task_statements, knowledge_statements, keywords, prerequisites, related_nodes')
      .eq('certification_code', resolvedCode);
    if (Array.isArray(data) && data.length > 0) {
      const mapped = data.map((r) => mapDbRowToNode(r as Record<string, unknown>));
      memoryNodes = [...memoryNodes.filter((n) => (n.certificationCode || '').toUpperCase() !== resolvedCode), ...mapped];
      return { code: resolvedCode, nodes: mapped };
    }
  }
  const cisaNodes = all.filter((n) => (n.certificationCode || '').toUpperCase() === 'CISA');
  return { code: resolvedCode, nodes: cisaNodes.length > 0 ? cisaNodes : all.slice(0, 30) };
}

export function getCachedKnowledgeNodes(certSlugOrCode?: string): KnowledgeNode[] {
  const all = hydrateFromLocalStorage();
  if (!certSlugOrCode) return all;
  const code = resolveCertCodeForGraph(certSlugOrCode);
  const matching = all.filter((n) => (n.certificationCode || '').toUpperCase() === code);
  return matching.length > 0 ? matching : all;
}

function tokenizeSimple(text: string): Set<string> {
  const tokens = (text || '').toLowerCase().match(/\b[a-z0-9_./-]{3,}\b/g) || [];
  return new Set(tokens);
}

/**
 * Fast synchronous matcher using cached DB nodes + synthesized fallback node from question metadata.
 */
export function matchQuestionToKnowledgeNodeLightweight(
  question: Question,
  certCode: string = 'CISA'
): KnowledgeNode {
  const resolvedCode = resolveCertCodeForGraph(certCode);
  const certNodes = getCachedKnowledgeNodes(resolvedCode);

  if (certNodes.length > 0) {
    if (question.topic_id) {
      const directMatch = certNodes.find(
        (n) => n.id === question.topic_id || n.topicCode.toLowerCase() === question.topic_id?.toLowerCase()
      );
      if (directMatch) return directMatch;
    }

    const qTokens = tokenizeSimple(`${question.stem} ${question.tags?.join(' ') || ''} ${question.source_reference || ''}`);
    let bestNode = certNodes[0];
    let bestScore = -1;

    for (const node of certNodes) {
      let score = 0;
      const haystack = `${node.name} ${node.summary} ${node.keywords.join(' ')} ${node.topicCode}`.toLowerCase();
      for (const tok of qTokens) {
        if (haystack.includes(tok)) {
          score += node.keywords.some((k) => k.toLowerCase().includes(tok)) ? 2.2 : 1.0;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    }
    return bestNode;
  }

  // Trigger async warm-up for subsequent opens without blocking UI
  if (typeof window !== 'undefined') {
    void preloadKnowledgeGraph();
  }

  return {
    id: question.topic_id || 'fallback-node',
    certificationCode: resolvedCode,
    domainNumber: 1,
    domainName: `${resolvedCode} Core Blueprint`,
    topicCode: question.task_statement || '1.1',
    name: question.tags?.[0] || `${resolvedCode} Core Principles`,
    summary: question.rationale?.slice(0, 200) || `Authoritative ${resolvedCode} exam concept.`,
    manualSection: question.source_reference || `${resolvedCode} Official Review Manual`,
    taskStatements: question.task_statement ? [question.task_statement] : ['T1.1'],
    knowledgeStatements: ['K1.1'],
    keywords: question.tags?.length ? question.tags : [resolvedCode, 'Risk', 'Control', 'Governance'],
    prerequisites: [],
    relatedNodes: [],
  };
}
