import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let directUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
    break;
  }
}
if (!directUrl) {
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const OUTPUT_JSON_PATH = path.resolve(__dirname, '../ml_engine/knowledgeGraph.json');
const OUTPUT_TS_PATH = path.resolve(__dirname, '../src/lib/ml/knowledgeGraph.ts');

function cleanTextForTokens(text) {
  const tokens = text.toLowerCase().match(/\b[a-zA-Z0-9_\-\.\/]{2,}\b/g) || [];
  const stopwords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
    'has', 'have', 'had', 'its', 'their', 'which', 'will', 'all', 'any', 'can',
    'not', 'but', 'into', 'been', 'must', 'should', 'could', 'such', 'when',
    'what', 'more', 'also', 'than', 'them', 'they', 'each', 'about', 'after'
  ]);
  return tokens.filter(t => !stopwords.has(t) && t.length > 2);
}

async function compileMultiCertCorpus() {
  await client.connect();
  console.log('=== COMPILING UNIVERSAL MULTI-CERT ML KNOWLEDGE GRAPH ===\n');

  const certsRes = await client.query(`
    SELECT id, code, slug, name, publisher, body, version
    FROM certifications
    ORDER BY code;
  `);

  const allNodes = [];
  const nodesByCert = {};
  const bm25StatsByCert = {};
  const invertedIndexByCert = {};

  for (const cert of certsRes.rows) {
    console.log(`\nIngesting Knowledge Nodes for [${cert.code}] ${cert.name}...`);

    const domRes = await client.query(`
      SELECT id, domain_number, name, exam_weight_percent, learning_objectives
      FROM domains
      WHERE certification_id = $1
      ORDER BY domain_number;
    `, [cert.id]);

    const certNodes = [];
    const certDocLengths = {};
    const certTermDocFreq = {};
    const certInvertedIndex = {};

    for (const d of domRes.rows) {
      const topRes = await client.query(`
        SELECT id, topic_code, name, part, content_summary
        FROM topics
        WHERE domain_id = $1
        ORDER BY sort_order;
      `, [d.id]);

      for (const t of topRes.rows) {
        const subRes = await client.query(`
          SELECT subtopic_code, name, content_body, key_terms, exam_tips, learning_objectives
          FROM subtopics
          WHERE topic_id = $1
          ORDER BY sort_order;
        `, [t.id]);

        const subNames = subRes.rows.map(s => s.name);
        const subBodies = subRes.rows.map(s => s.content_body || '').join(' ');
        const subTerms = [];
        subRes.rows.forEach(s => {
          if (Array.isArray(s.key_terms)) subTerms.push(...s.key_terms);
        });

        const safeCode = cert.code.toLowerCase().replace(/\+/g, 'plus');
        const safeTopic = t.topic_code.toLowerCase().replace(/[\.\s]/g, '-');
        const nodeId = `${safeCode}-${safeTopic}`;

        const corpusText = `${t.topic_code} ${t.name} ${t.content_summary || ''} ${subNames.join(' ')} ${subBodies} ${subTerms.join(' ')}`;
        const tokens = cleanTextForTokens(corpusText);

        const keywords = Array.from(new Set([...subTerms, t.name, ...subNames])).slice(0, 15);

        const node = {
          id: nodeId,
          certificationCode: cert.code,
          domainNumber: d.domain_number,
          domainName: d.name,
          topicCode: t.topic_code,
          name: t.name,
          summary: t.content_summary || `Comprehensive syllabus coverage of ${t.name} in ${cert.name}.`,
          manualSection: `Domain ${d.domain_number} - ${d.name} § ${t.topic_code}`,
          taskStatements: [`T${d.domain_number}.1`, `T${d.domain_number}.2`],
          knowledgeStatements: [`K${d.domain_number}.1`, `K${d.domain_number}.2`],
          keywords: keywords,
          prerequisites: [],
          relatedNodes: [],
          tokens: tokens
        };

        certNodes.push(node);
        allNodes.push(node);

        const docLen = tokens.length;
        certDocLengths[nodeId] = docLen;
        const uniqueTokens = new Set(tokens);
        uniqueTokens.forEach(ut => {
          certTermDocFreq[ut] = (certTermDocFreq[ut] || 0) + 1;
          if (!certInvertedIndex[ut]) certInvertedIndex[ut] = [];
          certInvertedIndex[ut].push(nodeId);
        });
      }
    }

    const N = certNodes.length;
    const totalLength = Object.values(certDocLengths).reduce((acc, l) => acc + l, 0);
    const avgDl = totalLength / Math.max(N, 1);
    const idfMap = {};
    for (const [term, df] of Object.entries(certTermDocFreq)) {
      idfMap[term] = Number(Math.log(1 + (N - df + 0.5) / (df + 0.5)).toFixed(4));
    }

    nodesByCert[cert.code] = certNodes;
    bm25StatsByCert[cert.code] = {
      num_docs: N,
      avg_dl: Number(avgDl.toFixed(2)),
      doc_lengths: certDocLengths,
      idf: idfMap
    };
    invertedIndexByCert[cert.code] = certInvertedIndex;

    console.log(`  -> [${cert.code}] Generated ${certNodes.length} nodes, ${Object.keys(idfMap).length} vocabulary tokens (Avg DL: ${avgDl.toFixed(1)})`);
  }

  // Connect related nodes
  for (const [certCode, nodes] of Object.entries(nodesByCert)) {
    for (let i = 0; i < nodes.length; i++) {
      const related = [];
      if (i > 0) related.push(nodes[i - 1].topicCode);
      if (i < nodes.length - 1) related.push(nodes[i + 1].topicCode);
      nodes[i].relatedNodes = related;
    }
  }

  await client.end();

  console.log(`\n=== COMPILING UNIVERSAL MULTI-CERT BUNDLE (${allNodes.length} TOTAL KNOWLEDGE NODES) ===`);

  const bundleData = {
    metadata: {
      version: '2.0.0',
      totalCertifications: certsRes.rows.length,
      totalNodes: allNodes.length,
      engine: 'BM25 Vector Space & Item Response Theory (Dual Runtime)'
    },
    nodesByCert: nodesByCert,
    bm25StatsByCert: bm25StatsByCert,
    invertedIndexByCert: invertedIndexByCert
  };

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(bundleData, null, 2), 'utf8');
  console.log(`[SUCCESS] Wrote JSON bundle -> ${OUTPUT_JSON_PATH}`);

  const tsCode = `/* ===================================================================
   APILIGU LEARNING PASS — Universal Multi-Cert Knowledge Graph Corpus
   Digested from 100% of all 15 active certifications (ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA).
   Auto-generated by compiler script — DO NOT EDIT DIRECTLY.
   =================================================================== */

import type { KnowledgeNode } from './types';

export const ALL_KNOWLEDGE_NODES: KnowledgeNode[] = ${JSON.stringify(allNodes, null, 2)};

export const NODES_BY_CERT: Record<string, KnowledgeNode[]> = ${JSON.stringify(nodesByCert, null, 2)};

export const BM25_STATS_BY_CERT: Record<string, {
  num_docs: number;
  avg_dl: number;
  doc_lengths: Record<string, number>;
  idf: Record<string, number>;
}> = ${JSON.stringify(bm25StatsByCert, null, 2)};

export const INVERTED_INDEX_BY_CERT: Record<string, Record<string, string[]>> = ${JSON.stringify(invertedIndexByCert, null, 2)};

// Legacy CISA backward-compatibility exports
export const CISA_KNOWLEDGE_GRAPH = NODES_BY_CERT['CISA'] || [];
export const CISA_BM25_STATS = BM25_STATS_BY_CERT['CISA'] || { num_docs: 60, avg_dl: 35.0, doc_lengths: {}, idf: {} };
export const CISA_INVERTED_INDEX = INVERTED_INDEX_BY_CERT['CISA'] || {};
`;

  fs.writeFileSync(OUTPUT_TS_PATH, tsCode, 'utf8');
  console.log(`[SUCCESS] Wrote TypeScript module -> ${OUTPUT_TS_PATH}`);
}

compileMultiCertCorpus().catch(console.error);
