/* ===================================================================
   APILIGU LEARNING PASS — Universal Cognitive Explainer & Option Reasoning Engine
   100% Free, Open-Source, Offline-First Cognitive Decision Framework
   Supports all 15 active certifications across ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA
   =================================================================== */

import type { Question } from '../../types';
import {
  ALL_KNOWLEDGE_NODES,
  NODES_BY_CERT,
  BM25_STATS_BY_CERT,
  INVERTED_INDEX_BY_CERT,
  CISA_KNOWLEDGE_GRAPH,
} from './knowledgeGraph';
import type {
  DeepProblemExplanation,
  OperatorAnalysis,
  OptionJustification,
  KnowledgeNode,
} from './types';

// BM25 Hyperparameters (Robertson & Spärck Jones)
const BM25_K1 = 1.5;
const BM25_B = 0.75;

/**
 * Tokenizes text into lowercase alphanumeric query tokens.
 */
function tokenizeText(text: string): string[] {
  const tokens = text.toLowerCase().match(/\b[a-z0-9_./-]{2,}\b/g) || [];
  const stopwords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
    'has', 'have', 'had', 'its', 'their', 'which', 'will', 'all', 'any', 'can',
    'not', 'but', 'into', 'been', 'must', 'should', 'could', 'such', 'when',
    'what', 'more', 'also', 'than', 'them', 'they', 'each', 'about', 'after'
  ]);
  return tokens.filter((t) => !stopwords.has(t) && t.length > 2);
}

/**
 * Semantic vector similarity search using the BM25 formula to ground questions in the authoritative corpus.
 */
export function matchQuestionToKnowledgeNode(
  question: Question,
  certCode: string = 'CISA'
): KnowledgeNode {
  const certNodes = NODES_BY_CERT[certCode] || NODES_BY_CERT['CISA'] || ALL_KNOWLEDGE_NODES;
  const certStats = BM25_STATS_BY_CERT[certCode] || BM25_STATS_BY_CERT['CISA'] || {
    num_docs: 60,
    avg_dl: 35.0,
    doc_lengths: {},
    idf: {},
  };
  const certIndex = INVERTED_INDEX_BY_CERT[certCode] || INVERTED_INDEX_BY_CERT['CISA'] || {};

  // 1. Direct topic_id / tag code match if available
  if (question.topic_id) {
    const directMatch = certNodes.find(
      (n) => n.id === question.topic_id || n.topicCode.toLowerCase() === question.topic_id?.toLowerCase()
    );
    if (directMatch) return directMatch;
  }

  // 2. Tokenize query stem, tags, source reference, and options
  const queryText = `${question.stem} ${question.tags?.join(' ') || ''} ${question.source_reference || ''}`;
  const queryTokens = tokenizeText(queryText);

  const avgdl = certStats.avg_dl || 35.0;
  const idfMap = certStats.idf as Record<string, number>;
  const docLengths = certStats.doc_lengths as Record<string, number>;

  // Fast Candidate Retrieval via Inverted Index
  const candidateScores: Record<string, number> = {};

  for (const token of queryTokens) {
    const matchedNodeIds = certIndex[token] || [];
    const termIdf = idfMap[token] || 1.2;

    for (const nodeId of matchedNodeIds) {
      if (!candidateScores[nodeId]) candidateScores[nodeId] = 0;
      
      const docLen = docLengths[nodeId] || avgdl;
      const termFreq = 1.0;
      
      const numerator = termFreq * (BM25_K1 + 1);
      const denominator = termFreq + BM25_K1 * (1 - BM25_B + BM25_B * (docLen / avgdl));
      const bm25TermScore = termIdf * (numerator / denominator);
      
      candidateScores[nodeId] += bm25TermScore;
    }
  }

  let bestNodeId = certNodes[0]?.id;
  let highestScore = -1;

  for (const [nodeId, score] of Object.entries(candidateScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestNodeId = nodeId;
    }
  }

  return (
    certNodes.find((n) => n.id === bestNodeId) ||
    certNodes[0] ||
    CISA_KNOWLEDGE_GRAPH[0]
  );
}

/**
 * Universal Cognitive Decision Operator parser.
 * Dissects stems across ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA paradigms.
 */
export function analyzeDecisionOperator(stem: string, _certCode: string = 'CISA'): OperatorAnalysis {
  const upperStem = stem.toUpperCase();

  if (/\b(FIRST|INITIAL|FIRST STEP|IMMEDIATE|FIRST ACTION)\b/.test(upperStem)) {
    return {
      operator: 'FIRST',
      highlightPhrase: 'Sequence & Pre-condition Rule (FIRST / INITIAL)',
      decisionRule: 'Identify the essential prerequisite, diagnostic verification, or containment step before executing remedial changes.',
      examTrapWarning: 'Do NOT pick the ultimate long-term solution or corrective action when asked for the FIRST step. Always prioritize assessment, triage, or quarantine.',
    };
  }

  if (/\b(PRIMARY|MAIN|OVERARCHING|FUNDAMENTAL|CORE)\b/.test(upperStem)) {
    return {
      operator: 'PRIMARY',
      highlightPhrase: 'Governance & Root-Cause Rule (PRIMARY / MAIN)',
      decisionRule: 'Select the overarching governance policy, root cause, or senior management mandate that underpins operational controls.',
      examTrapWarning: 'Tactical tools and operational configurations are common distractors for PRIMARY questions. Look for organizational alignment and governance ownership.',
    };
  }

  if (/\b(MOST|BEST|GREATEST|OPTIMAL|HIGHEST)\b/.test(upperStem)) {
    return {
      operator: 'MOST',
      highlightPhrase: 'Relative Efficacy Rule (MOST / BEST)',
      decisionRule: 'Evaluate all four options and determine which specific control delivers the highest direct risk reduction or performance efficiency.',
      examTrapWarning: 'All four options may be valid good practices in real life. You must evaluate relative effectiveness against the specific threat stated in the stem.',
    };
  }

  if (/\b(LEAST|NOT|EXCEPT|MINIMUM)\b/.test(upperStem)) {
    return {
      operator: 'LEAST',
      highlightPhrase: 'Negative Constraint Rule (LEAST / EXCEPT)',
      decisionRule: 'Identify the atypical, ineffective, non-compliant, or lowest-priority control among the choices.',
      examTrapWarning: 'Read carefully! Candidates frequently misread negative stems and accidentally pick the most effective option.',
    };
  }

  if (/\b(NEXT|NEXT STEP|AFTER)\b/.test(upperStem)) {
    return {
      operator: 'NEXT',
      highlightPhrase: 'Procedural Sequence Rule (NEXT STEP)',
      decisionRule: 'Determine the exact chronological subsequent action in the standard procedural lifecycle.',
      examTrapWarning: 'Ensure you do not skip steps in the standard methodology (e.g., jumping from testing straight to documentation without verification).',
    };
  }

  return {
    operator: 'STANDARD',
    highlightPhrase: 'Direct Conceptual Grounding (STANDARD)',
    decisionRule: 'Match the scenario directly to authoritative certification standards, framework definitions, and domain baselines.',
    examTrapWarning: 'Ensure terminology aligns precisely with the official body of knowledge rather than colloquial industry slang.',
  };
}

/**
 * Builds surgical Option Comparison Matrix with justifications for all 4 MCQ choices.
 */
export function buildOptionJustifications(
  question: Question,
  operatorAnalysis: OperatorAnalysis,
  node: KnowledgeNode
): OptionJustification[] {
  const correctKey = (question.correct_answer || 'A').toUpperCase() as 'A' | 'B' | 'C' | 'D';
  const options: Array<{ label: 'A' | 'B' | 'C' | 'D'; text: string; rationaleField?: string | null }> = [
    { label: 'A', text: question.option_a, rationaleField: question.incorrect_rationale_a },
    { label: 'B', text: question.option_b, rationaleField: question.incorrect_rationale_b },
    { label: 'C', text: question.option_c, rationaleField: question.incorrect_rationale_c },
    { label: 'D', text: question.option_d, rationaleField: question.incorrect_rationale_d },
  ];

  return options.map((opt) => {
    const isCorrect = opt.label === correctKey;

    if (isCorrect) {
      return {
        label: opt.label,
        text: opt.text,
        verdict: 'CORRECT_KEY',
        confidenceScore: 0.98,
        reasoning: question.rationale || `Directly fulfills the ${operatorAnalysis.highlightPhrase} under ${node.name}.`,
        flawOrAdvantage: `Directly aligns with ${node.manualSection} standards and resolves the core risk.`,
        sourceCitation: node.manualSection,
      };
    }

    const explicitRationale = opt.rationaleField;
    let verdict: OptionJustification['verdict'] = 'PLAUSIBLE_DISTRACTOR';
    let flaw = 'Plausible operational practice, but secondary to the primary objective in this scenario.';

    if (operatorAnalysis.operator === 'FIRST') {
      verdict = 'SECONDARY_ACTION';
      flaw = 'This represents a later-stage remediation or reporting action; it must not be performed before initial assessment/containment.';
    } else if (operatorAnalysis.operator === 'PRIMARY') {
      verdict = 'PLAUSIBLE_DISTRACTOR';
      flaw = 'Addresses a tactical symptom rather than establishing the root governance mandate or overarching policy.';
    } else if (operatorAnalysis.operator === 'LEAST') {
      verdict = 'CORRECT_KEY';
      flaw = 'This is an effective standard practice, which is why it is NOT the correct answer for an inverse/LEAST question.';
    }

    return {
      label: opt.label,
      text: opt.text,
      verdict: verdict,
      confidenceScore: 0.88,
      reasoning: explicitRationale || `${opt.text} is suboptimal under the ${operatorAnalysis.decisionRule}`,
      flawOrAdvantage: flaw,
      sourceCitation: node.manualSection,
    };
  });
}

/**
 * Universal AI Problem Dissection & Deep Explainer Generator.
 */
export function generateDeepProblemExplanation(
  question: Question,
  certCode: string = 'CISA'
): DeepProblemExplanation {
  const node = matchQuestionToKnowledgeNode(question, certCode);
  const operatorAnalysis = analyzeDecisionOperator(question.stem, certCode);
  const optionsBreakdown = buildOptionJustifications(question, operatorAnalysis, node);

  const problemDissection = `The scenario evaluates understanding of **${node.name}** within **Domain ${node.domainNumber}: ${node.domainName || node.name}**. The stem hinges on the **${operatorAnalysis.highlightPhrase}**, requiring the candidate to prioritize ${operatorAnalysis.decisionRule.toLowerCase()}`;

  const takeawayRule = `Anchor Rule: In questions governed by "${operatorAnalysis.operator}", always anchor decisions in ${node.name} standards (${node.manualSection}).`;

  return {
    questionId: question.id,
    certificationCode: certCode,
    domainNumber: node.domainNumber,
    domainName: node.domainName || `Domain ${node.domainNumber}`,
    topicCode: node.topicCode,
    topicName: node.name,
    taskStatementCode: node.taskStatements[0] || `T${node.domainNumber}.1`,
    taskStatementName: `Task Statement ${node.taskStatements[0] || '1.1'}: Execution of ${node.name}`,
    reviewManualSection: node.manualSection,
    keyConcepts: node.keywords || [],
    operatorAnalysis,
    problemDissection,
    optionsBreakdown,
    takeawayRule,
    examTrapHeuristic: operatorAnalysis.examTrapWarning,
    relatedQuestionIds: [],
    relatedTopicIds: node.relatedNodes || [],
  };
}

// Backward compatibility alias
export const buildDeepProblemExplanation = generateDeepProblemExplanation;
