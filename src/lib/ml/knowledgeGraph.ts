/* ===================================================================
   ANOXPASS — Knowledge Graph Compatibility Shim
   The full 338+ node corpus is served dynamically from Supabase
   `public.ml_knowledge_nodes` via `knowledgeGraphService.ts`, keeping
   initial Vite / PWA bundles tiny (<4 MB instead of 15+ MB).
   =================================================================== */

import type { KnowledgeNode } from './types';
import { getCachedKnowledgeNodes } from './knowledgeGraphService';

export const ALL_KNOWLEDGE_NODES: KnowledgeNode[] = [];
export const NODES_BY_CERT: Record<string, KnowledgeNode[]> = {};
export const BM25_STATS_BY_CERT: Record<string, { num_docs: number; avg_dl: number; doc_lengths: Record<string, number>; idf: Record<string, number> }> = {};
export const INVERTED_INDEX_BY_CERT: Record<string, Record<string, string[]>> = {};
export const CISA_KNOWLEDGE_GRAPH: KnowledgeNode[] = [];
export const CISA_BM25_STATS = { num_docs: 60, avg_dl: 35.0, doc_lengths: {} as Record<string, number>, idf: {} as Record<string, number> };
export const CISA_INVERTED_INDEX: Record<string, string[]> = {};

export { getCachedKnowledgeNodes };
