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
 * Synthesizes an authoritative, concrete pedagogical explanation of WHY the correct answer is correct,
 * completely replacing raw dumped references or citation headers with genuine technical reasoning.
 */
export function synthesizeConcreteCorrectReasoning(
  question: Question,
  correctOptionText: string,
  node: KnowledgeNode,
  operatorAnalysis: OperatorAnalysis
): { concreteReason: string; sourceCitation: string } {
  let rawRationale = (question.rationale || '').trim();
  let citation = node.manualSection;

  // Extract explicit citation header if present (e.g., "Explanation/Reference: Section: Governance and Management of IT")
  const refMatch = rawRationale.match(/(?:explanation\s*\/\s*)?reference:\s*(?:section:)?\s*([^\n\r.]+)/i);
  if (refMatch) {
    citation = refMatch[1].trim() || node.manualSection;
    rawRationale = rawRationale.replace(/(?:explanation\s*\/\s*)?reference:\s*(?:section:)?\s*[^\n\r.]+[.\n\r]*/i, '').trim();
  }

  // If the remaining rationale already has substantive, deep sentences (> 45 chars and has explanatory words)
  if (
    rawRationale.length > 45 &&
    (rawRationale.toLowerCase().includes('because') ||
      rawRationale.toLowerCase().includes('requires') ||
      rawRationale.toLowerCase().includes('ensure') ||
      rawRationale.toLowerCase().includes('provides') ||
      rawRationale.toLowerCase().includes('is the primary') ||
      rawRationale.toLowerCase().includes('is the most') ||
      rawRationale.toLowerCase().includes('in order to'))
  ) {
    return {
      concreteReason: rawRationale,
      sourceCitation: citation,
    };
  }

  // Otherwise, construct substantive domain-grounded pedagogical explanation:
  const actionText = correctOptionText.replace(/\.$/, '').trim();
  const stemLower = question.stem.toLowerCase();
  const optLower = correctOptionText.toLowerCase();

  let domainExplanation = '';

  if (optLower.includes('regulat') || optLower.includes('legal') || stemLower.includes('jurisdiction') || stemLower.includes('regulat') || stemLower.includes('statut')) {
    domainExplanation = `Statutory laws and regulatory requirements carry binding legal authority across operating jurisdictions. Direct coordination with legal and regulatory compliance officers is mandatory to establish the authoritative legal baseline across all applicable territories before determining audit scope or designing controls. Operating without their explicit requirements risks legal non-compliance, regulatory sanctions, and misaligned audit objectives.`;
  } else if (optLower.includes('risk assessment') || optLower.includes('business impact') || stemLower.includes('priorit') || stemLower.includes('first')) {
    domainExplanation = `A comprehensive risk assessment provides the quantitative and qualitative foundation required to prioritize organizational resources toward the highest risk exposures. Establishing this risk baseline is the essential prerequisite before allocating capital, configuring technical controls, or initiating remediation.`;
  } else if (optLower.includes('segregation of duties') || optLower.includes('least privilege') || optLower.includes('access control') || optLower.includes('role-based')) {
    domainExplanation = `Enforcing strict separation of duties and least-privilege access minimizes single points of human failure, prevents fraudulent concealment, and establishes dual-custody oversight across critical business functions.`;
  } else if (optLower.includes('governance') || optLower.includes('steering committee') || optLower.includes('board') || optLower.includes('senior management approval')) {
    domainExplanation = `Sound IT governance requires executive alignment where the steering committee and senior leadership maintain ultimate accountability for strategic direction, policy authorization, and risk appetite thresholds.`;
  } else if (optLower.includes('independent') || optLower.includes('substantive test') || optLower.includes('verify') || optLower.includes('sample') || optLower.includes('evidence')) {
    domainExplanation = `Professional audit standards mandate gathering sufficient, reliable, and independent evidence through direct substantive testing rather than relying on passive inquiry or uncorroborated management assertions.`;
  } else if (optLower.includes('incident response') || optLower.includes('contain') || optLower.includes('isolate') || optLower.includes('quarantine')) {
    domainExplanation = `During an active security event or operational crisis, rapid containment and system isolation stops lateral adversarial movement and limits the blast radius before launching forensic investigation or root-cause eradication.`;
  } else if (optLower.includes('business continuity') || optLower.includes('disaster recovery') || optLower.includes('rto') || optLower.includes('rpo')) {
    domainExplanation = `Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) dictated by the Business Impact Analysis (BIA) establish the non-negotiable operational thresholds for data preservation and system restoration.`;
  } else {
    domainExplanation = `This action directly operationalizes the core standard of ${node.name}. Under the ${operatorAnalysis.highlightPhrase}, it resolves the primary risk factor while maintaining regulatory compliance and authoritative alignment with ${node.manualSection}.`;
  }

  const concreteReason = `"${actionText}" is authoritatively correct because it directly addresses the core operational requirement in this scenario. ${domainExplanation}`;

  return {
    concreteReason,
    sourceCitation: citation,
  };
}

/**
 * Synthesizes a concrete, pedagogically rich explanation of why a distractor is flawed,
 * completely replacing vague "is suboptimal under standard" boilerplate.
 */
export function synthesizeConcreteDistractorFlaw(
  distractorText: string,
  stemText: string,
  _correctOptionText: string,
  node: KnowledgeNode,
  operatorAnalysis: OperatorAnalysis
): { flawTitle: string; detailedFlaw: string; verdict: OptionJustification['verdict'] } {
  const dLower = distractorText.toLowerCase();
  const sLower = stemText.toLowerCase();

  // 1. Voluntary Framework vs Statutory Law Trap
  if (
    (dLower.includes('industry standard') || dLower.includes('framework') || dLower.includes('best practice')) &&
    (sLower.includes('legal') || sLower.includes('regulat') || sLower.includes('law') || sLower.includes('jurisdiction') || sLower.includes('statut'))
  ) {
    return {
      flawTitle: 'Voluntary Standard Fallacy',
      detailedFlaw: `Industry frameworks (such as ISO/IEC 27001 or COBIT) are voluntary best practices and do not carry the force of statutory law. Auditing exclusively to industry standards leaves the organization exposed to statutory non-compliance and legal liabilities in jurisdictions with specific statutory mandates.`,
      verdict: 'PLAUSIBLE_DISTRACTOR',
    };
  }

  // 2. Extreme / Strictest Standard Over-Scoping Trap
  if (
    dLower.includes('highest requirement') ||
    dLower.includes('strictest') ||
    dLower.includes('all systems') ||
    dLower.includes('exclusively') ||
    dLower.includes('every component') ||
    dLower.includes('eliminate all risk')
  ) {
    return {
      flawTitle: 'Over-Scoping & Extremism Trap',
      detailedFlaw: `Auditing to the standard with the "highest requirements" or imposing universal extremes is an over-scoping fallacy. Imposing controls that exceed applicable legal, statutory, or business mandates creates exorbitant costs, operational paralysis, and may conflict with local regulations in other operating jurisdictions.`,
      verdict: 'PLAUSIBLE_DISTRACTOR',
    };
  }

  // 3. Circular Internal Policy Bias Trap
  if (
    dLower.includes('policies and procedures of the organization') ||
    dLower.includes('internal policies') ||
    dLower.includes('company guidelines') ||
    dLower.includes('internal standard operating')
  ) {
    return {
      flawTitle: 'Internal Circularity Trap',
      detailedFlaw: `Auditing solely against existing internal organizational policies provides false assurance. Internal policies may be outdated, incomplete, or fundamentally non-compliant with external statutory and regulatory amendments enacted across operating jurisdictions.`,
      verdict: 'PLAUSIBLE_DISTRACTOR',
    };
  }

  // 4. Premature Technical Action / Inverted Procedural Sequence
  if (
    (dLower.includes('implement') || dLower.includes('reconfigure') || dLower.includes('deploy') || dLower.includes('install') || dLower.includes('patch')) &&
    (operatorAnalysis.operator === 'FIRST' || operatorAnalysis.operator === 'INITIAL' || sLower.includes('first') || sLower.includes('initial'))
  ) {
    return {
      flawTitle: 'Premature Remediation Trap (Wrong Timing)',
      detailedFlaw: `Technical configuration changes or control implementations must never be executed before completing proper scoping, risk assessment, and stakeholder authorization. Jumping straight to remediation skips critical prerequisite analysis.`,
      verdict: 'SECONDARY_ACTION',
    };
  }

  // 5. Premature Reporting / Escalation
  if (
    dLower.includes('report to executive') ||
    dLower.includes('notify the board') ||
    dLower.includes('inform law enforcement') ||
    dLower.includes('escalate immediately')
  ) {
    return {
      flawTitle: 'Premature Escalation Trap',
      detailedFlaw: `Reporting or escalation without first obtaining verified factual evidence, assessing severity, and determining business impact creates unnecessary organizational alarm and violates standard procedural triage.`,
      verdict: 'SECONDARY_ACTION',
    };
  }

  // 6. Auditor Operational Independence Violation
  if (
    dLower.includes('auditor should implement') ||
    dLower.includes('auditor should design') ||
    dLower.includes('auditor should approve') ||
    dLower.includes('auditor should manage')
  ) {
    return {
      flawTitle: 'Independence Impairment Violation',
      detailedFlaw: `An IS auditor must maintain strict operational independence and objectivity. The auditor provides independent evaluation and advisory findings, but must never design, implement, or manage operational systems.`,
      verdict: 'IRRELEVANT_OUT_OF_SCOPE',
    };
  }

  // 7. Passive / Inadequate Due Diligence
  if (
    dLower.includes('accept the') ||
    dLower.includes('rely on vendor') ||
    dLower.includes('rely solely on inquiry') ||
    dLower.includes('assume compliance') ||
    dLower.includes('take no action')
  ) {
    return {
      flawTitle: 'Inadequate Due Care Trap',
      detailedFlaw: `Professional audit standards require corroborative substantive testing and independent verification. Relying on passive assumptions or unsubstantiated inquiries violates the professional standard of due care.`,
      verdict: 'PLAUSIBLE_DISTRACTOR',
    };
  }

  // 8. Dynamic Contextual Fallback
  return {
    flawTitle: 'Suboptimal Focus',
    detailedFlaw: `"${distractorText}" addresses a tangential operational activity rather than the primary mandate governed by ${node.name}. Under ${operatorAnalysis.highlightPhrase}, this option fails to satisfy the critical decision criteria required in this scenario.`,
    verdict: operatorAnalysis.operator === 'FIRST' ? 'SECONDARY_ACTION' : 'PLAUSIBLE_DISTRACTOR',
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

  const correctOpt = options.find((o) => o.label === correctKey) || options[0];
  const { concreteReason, sourceCitation } = synthesizeConcreteCorrectReasoning(
    question,
    correctOpt.text,
    node,
    operatorAnalysis
  );

  return options.map((opt) => {
    const isCorrect = opt.label === correctKey;

    if (isCorrect) {
      return {
        label: opt.label,
        text: opt.text,
        verdict: 'CORRECT_KEY',
        confidenceScore: 0.98,
        reasoning: concreteReason,
        flawOrAdvantage: `Authoritative standard: Directly satisfies ${node.name} and eliminates the primary risk.`,
        sourceCitation: sourceCitation,
      };
    }

    // Check if question has explicit pre-authored distractor rationale
    if (opt.rationaleField && opt.rationaleField.trim().length > 20) {
      return {
        label: opt.label,
        text: opt.text,
        verdict: 'PLAUSIBLE_DISTRACTOR',
        confidenceScore: 0.88,
        reasoning: opt.rationaleField.trim(),
        flawOrAdvantage: 'Suboptimal choice compared to the authoritative standard.',
        sourceCitation: node.manualSection,
      };
    }

    // Synthesize concrete pedagogical flaw
    const { flawTitle, detailedFlaw, verdict } = synthesizeConcreteDistractorFlaw(
      opt.text,
      question.stem,
      correctOpt.text,
      node,
      operatorAnalysis
    );

    return {
      label: opt.label,
      text: opt.text,
      verdict: verdict,
      confidenceScore: 0.88,
      reasoning: detailedFlaw,
      flawOrAdvantage: `Exam Trap: ${flawTitle}`,
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
