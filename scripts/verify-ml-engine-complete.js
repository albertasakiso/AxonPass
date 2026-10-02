/**
 * ===================================================================
 * APILIGU LEARNING PASS — ML / AI Engine Verification Suite
 * Automated Test & Validation of Knowledge Graph, BM25, BKT & IRT
 * ===================================================================
 */

import { CISA_KNOWLEDGE_GRAPH, CISA_BM25_STATS, CISA_INVERTED_INDEX } from '../src/lib/ml/knowledgeGraph.js';
import {
  analyzeDecisionOperator,
  matchQuestionToKnowledgeNode,
  generateOptionJustifications,
  buildDeepProblemExplanation,
} from '../src/lib/ml/explainerEngine.js';
import { updateTopicBkt, estimateIrtScaledScore } from '../src/lib/ml/bktEngine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

console.log('===================================================================');
console.log('APILIGU LEARNING PASS — AI/ML COGNITIVE REASONING ENGINE AUDIT');
console.log('===================================================================');

// -------------------------------------------------------------------
// TEST 1: Knowledge Graph Topology & Corpus Completeness (60 Topics)
// -------------------------------------------------------------------
console.log('\n--- 1. Knowledge Graph Topology & 60-Topic Coverage ---');
assert(Array.isArray(CISA_KNOWLEDGE_GRAPH), 'CISA_KNOWLEDGE_GRAPH is an array');
assert(CISA_KNOWLEDGE_GRAPH.length === 60, `Knowledge graph contains exactly 60 canonical topics (found: ${CISA_KNOWLEDGE_GRAPH.length})`);

const domainCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
CISA_KNOWLEDGE_GRAPH.forEach((node) => {
  domainCounts[node.domainNumber] = (domainCounts[node.domainNumber] || 0) + 1;
  assert(node.id && node.id.length > 0, `Node ${node.topicCode} has valid ID`);
  assert(node.name && node.name.length > 3, `Node ${node.topicCode} has valid name`);
  assert(node.summary && node.summary.length > 10, `Node ${node.topicCode} has valid summary`);
  assert(node.manualSection && node.manualSection.includes('Section'), `Node ${node.topicCode} has manual section citation`);
  assert(Array.isArray(node.taskStatements) && node.taskStatements.length > 0, `Node ${node.topicCode} has task statement links`);
  assert(Array.isArray(node.keywords) && node.keywords.length > 0, `Node ${node.topicCode} has keyword anchors`);
});

assert(domainCounts[1] === 10, `Domain 1 has 10 topics (found ${domainCounts[1]})`);
assert(domainCounts[2] === 11, `Domain 2 has 11 topics (found ${domainCounts[2]})`);
assert(domainCounts[3] === 8, `Domain 3 has 8 topics (found ${domainCounts[3]})`);
assert(domainCounts[4] === 16, `Domain 4 has 16 topics (found ${domainCounts[4]})`);
assert(domainCounts[5] === 15, `Domain 5 has 15 topics (found ${domainCounts[5]})`);

assert(CISA_BM25_STATS && CISA_BM25_STATS.avg_dl > 0, 'BM25 corpus statistics computed and non-zero');
assert(Object.keys(CISA_INVERTED_INDEX).length >= 500, `Inverted index contains >= 500 tokens (found: ${Object.keys(CISA_INVERTED_INDEX).length})`);

// -------------------------------------------------------------------
// TEST 2: ISACA Decision Focus Operator Analysis
// -------------------------------------------------------------------
console.log('\n--- 2. ISACA Cognitive Decision Operator Recognition ---');
const op1 = analyzeDecisionOperator('Which of the following is the PRIMARY reason an auditor reviews the charter?');
assert(op1.operator === 'PRIMARY', 'Correctly identified PRIMARY operator');

const op2 = analyzeDecisionOperator('An auditor discovers data exfiltration. What should be done FIRST?');
assert(op2.operator === 'FIRST', 'Correctly identified FIRST operator');

const op3 = analyzeDecisionOperator('Which control provides the GREATEST assurance against unauthorized database access?');
assert(op3.operator === 'MOST', 'Correctly identified MOST/GREATEST operator');

const op4 = analyzeDecisionOperator('All of the following are valid evidence EXCEPT:');
assert(op4.operator === 'LEAST', 'Correctly identified LEAST/EXCEPT operator');

const op5 = analyzeDecisionOperator('An organization implements continuous auditing.');
assert(op5.operator === 'STANDARD', 'Correctly identified STANDARD operator');

// -------------------------------------------------------------------
// TEST 3: BM25 Semantic Vector Matching & Grounding
// -------------------------------------------------------------------
console.log('\n--- 3. BM25 Semantic Grounding & Topic Matching ---');
const sampleQ1 = {
  id: 'test-q-1',
  stem: 'When planning an IS audit, how does the auditor determine the audit universe and allocate resources based on inherent risk?',
  option_a: 'By prioritizing high inherent risk business processes',
  option_b: 'By auditing all systems equally',
  option_c: 'By consulting the CFO directly',
  option_d: 'By reviewing only completed workpapers',
  correct_answer: 'A',
  rationale: 'Risk-based audit planning aligns resources with areas of highest inherent risk.',
  tags: ['Audit Planning', 'Inherent Risk'],
  domain_id: 'd1',
};

const matchedNode1 = matchQuestionToKnowledgeNode(sampleQ1);
assert(matchedNode1.domainNumber === 1, `Question 1 matched Domain 1 (found Domain ${matchedNode1.domainNumber})`);
assert(matchedNode1.topicCode === '1A3' || matchedNode1.topicCode.startsWith('1A'), `Question 1 matched Risk Planning node (${matchedNode1.topicCode})`);

const sampleQ2 = {
  id: 'test-q-2',
  stem: 'Which metric establishes the Maximum Tolerable Downtime (MTD) and Recovery Point Objective (RPO) during a disaster recovery assessment?',
  option_a: 'User Acceptance Testing (UAT)',
  option_b: 'Business Impact Analysis (BIA)',
  option_c: 'Code review metrics',
  option_d: 'Service Desk ticket volume',
  correct_answer: 'B',
  rationale: 'The BIA identifies critical business processes, MTD, RTO, and RPO.',
  tags: ['BIA', 'RPO', 'MTD'],
};

const matchedNode2 = matchQuestionToKnowledgeNode(sampleQ2);
assert(matchedNode2.domainNumber === 4, `Question 2 matched Domain 4 (found Domain ${matchedNode2.domainNumber})`);
assert(matchedNode2.topicCode === '4B1', `Question 2 matched BIA topic 4B1 (found ${matchedNode2.topicCode})`);

// -------------------------------------------------------------------
// TEST 4: 4-Part Deep Explainer & Option Justification Matrix
// -------------------------------------------------------------------
console.log('\n--- 4. 4-Part Deep Explainer & Choice Matrix ---');
const deepExplanation = buildDeepProblemExplanation(sampleQ1);

assert(deepExplanation.questionId === sampleQ1.id, 'Explainer has valid question ID');
assert(deepExplanation.operatorAnalysis.operator === 'STANDARD', 'Explainer parsed operator analysis');
assert(deepExplanation.optionsBreakdown.length === 4, 'Explainer produced 4 option breakdowns');

const correctOpt = deepExplanation.optionsBreakdown.find((o) => o.label === 'A');
assert(correctOpt && correctOpt.verdict === 'CORRECT_KEY', 'Option A correctly marked as CORRECT_KEY');
assert(correctOpt.confidenceScore >= 0.95, 'Correct option has high confidence score');

const distractorB = deepExplanation.optionsBreakdown.find((o) => o.label === 'B');
assert(distractorB && distractorB.verdict !== 'CORRECT_KEY', 'Option B marked as distractor');
assert(distractorB.reasoning && distractorB.reasoning.length > 10, 'Option B has deep reasoning justification');

assert(deepExplanation.takeawayRule && deepExplanation.takeawayRule.length > 20, 'Explainer includes high-yield takeaway rule');
assert(deepExplanation.examTrapHeuristic && deepExplanation.examTrapHeuristic.length > 10, 'Explainer includes exam trap heuristic');

// -------------------------------------------------------------------
// TEST 5: Bayesian Knowledge Tracing (BKT) Engine
// -------------------------------------------------------------------
console.log('\n--- 5. Bayesian Knowledge Tracing (BKT) Transitions ---');
let bktState = updateTopicBkt(null, true, 'd1-1a3', '1A3');
assert(bktState.masteryProbability > 0.15, `Mastery increased after correct answer: ${bktState.masteryProbability.toFixed(3)}`);
assert(bktState.consecutiveCorrect === 1, 'Consecutive correct incremented to 1');

bktState = updateTopicBkt(bktState, true, 'd1-1a3', '1A3');
assert(bktState.masteryProbability > 0.40, `Mastery increased further after 2nd correct answer: ${bktState.masteryProbability.toFixed(3)}`);
assert(bktState.consecutiveCorrect === 2, 'Consecutive correct incremented to 2');

bktState = updateTopicBkt(bktState, true, 'd1-1a3', '1A3');
assert(bktState.masteryProbability > 0.70, `Mastery reached high mastery after 3rd correct answer: ${bktState.masteryProbability.toFixed(3)}`);

// Now test incorrect response penalty
bktState = updateTopicBkt(bktState, false, 'd1-1a3', '1A3');
assert(bktState.consecutiveCorrect === 0, 'Consecutive correct reset to 0 after mistake');
assert(bktState.totalInteractions === 4, 'Total interactions incremented to 4');

// -------------------------------------------------------------------
// TEST 6: Item Response Theory (IRT 2PL) Scaled Score Projection (200-800)
// -------------------------------------------------------------------
console.log('\n--- 6. IRT 2PL Latent Ability & Scaled Score Predictor ---');
const emptyIrt = estimateIrtScaledScore([]);
assert(emptyIrt.predictedScaledScore === 400, 'Empty records default to baseline scaled score');

const sampleProgressRecords = [
  { question_id: 'q1', times_seen: 3, times_correct: 3, box_level: 4 },
  { question_id: 'q2', times_seen: 2, times_correct: 2, box_level: 3 },
  { question_id: 'q3', times_seen: 4, times_correct: 3, box_level: 3 },
  { question_id: 'q4', times_seen: 2, times_correct: 2, box_level: 4 },
  { question_id: 'q5', times_seen: 3, times_correct: 2, box_level: 2 },
  { question_id: 'q6', times_seen: 2, times_correct: 2, box_level: 3 },
  { question_id: 'q7', times_seen: 1, times_correct: 1, box_level: 2 },
  { question_id: 'q8', times_seen: 3, times_correct: 3, box_level: 4 },
];

const irtEstimate = estimateIrtScaledScore(sampleProgressRecords);
assert(irtEstimate.theta > 0, `Latent ability theta estimated positive: ${irtEstimate.theta}`);
assert(irtEstimate.predictedScaledScore >= 500, `Predicted scaled score is passing (>=500): ${irtEstimate.predictedScaledScore}`);
assert(irtEstimate.predictedScaledScore <= 800, `Predicted scaled score clamped <= 800: ${irtEstimate.predictedScaledScore}`);
assert(irtEstimate.confidenceIntervalLow >= 200, `Confidence interval lower bound >= 200: ${irtEstimate.confidenceIntervalLow}`);
assert(irtEstimate.confidenceIntervalHigh <= 800, `Confidence interval upper bound <= 800: ${irtEstimate.confidenceIntervalHigh}`);
assert(irtEstimate.passingProbability >= 0.80, `Passing probability high for proficient student: ${(irtEstimate.passingProbability * 100).toFixed(1)}%`);
assert(irtEstimate.readinessCategory === 'READY', `Readiness category is READY: ${irtEstimate.readinessCategory}`);

console.log('\n===================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} ML/AI ENGINE TESTS PASSED PERFECTLY!`);
console.log('===================================================================');
