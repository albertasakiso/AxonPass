/* ===================================================================
   APILIGU LEARNING PASS — Universal Machine Learning & AI Engine Types
   100% Free, Open-Source, Offline-First Cognitive Architecture
   Supports all 15 active certifications across ISACA, ISC2, CompTIA, AWS, GIAC, NIST, FIFA
   =================================================================== */

export type DecisionOperator =
  | 'PRIMARY'
  | 'MOST'
  | 'FIRST'
  | 'LEAST'
  | 'BEST'
  | 'NEXT'
  | 'INITIAL'
  | 'CRITICAL'
  | 'STANDARD';

export type IsacaDecisionOperator = DecisionOperator; // Backward compatibility

export interface OperatorAnalysis {
  operator: DecisionOperator;
  highlightPhrase: string;
  decisionRule: string;
  examTrapWarning: string;
}

export interface OptionJustification {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  verdict: 'CORRECT_KEY' | 'PLAUSIBLE_DISTRACTOR' | 'SECONDARY_ACTION' | 'IRRELEVANT_OUT_OF_SCOPE';
  confidenceScore: number; // 0.0 - 1.0
  reasoning: string;
  flawOrAdvantage: string;
  sourceCitation?: string;
}

export interface DeepProblemExplanation {
  questionId: string;
  certificationCode?: string;
  domainNumber: number;
  domainName: string;
  topicCode: string;
  topicName: string;
  taskStatementCode: string;
  taskStatementName: string;
  reviewManualSection: string;
  keyConcepts: string[];
  
  // Cognitive breakdown
  operatorAnalysis: OperatorAnalysis;
  problemDissection: string;
  optionsBreakdown: OptionJustification[];
  
  // High-yield memory anchor
  takeawayRule: string;
  examTrapHeuristic: string;
  
  // Correlated practice
  relatedQuestionIds: string[];
  relatedTopicIds: string[];
}

export interface KnowledgeNode {
  id: string;
  certificationCode?: string;
  domainNumber: number;
  domainName?: string;
  topicCode: string;
  name: string;
  summary: string;
  manualSection: string;
  taskStatements: string[];
  knowledgeStatements: string[];
  keywords: string[];
  prerequisites: string[];
  relatedNodes: string[];
  tokens?: string[];
}

export interface BktTopicState {
  topicId: string;
  topicCode: string;
  masteryProbability: number; // 0.0 - 1.0 (P(L))
  totalInteractions: number;
  consecutiveCorrect: number;
  lastUpdated: string;
}

export interface IrtAbilityEstimate {
  theta: number; // -3.0 to +3.0 latent ability
  standardError: number;
  predictedScaledScore: number; // 200 - 800 (or cert-specific scale)
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
  passingProbability: number; // 0.0 - 1.0
  readinessCategory: 'READY' | 'BORDERLINE' | 'NEEDS_REMEDIATION';
}
