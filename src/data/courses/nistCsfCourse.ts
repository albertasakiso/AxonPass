/* ===================================================================
   ANOXPASS — NIST CSF 2.0, AI RMF & Enterprise GRC End-to-End Course
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const NIST_CSF_COURSE: CertificationCourse = {
  certId: 'nist-grc',
  certCode: 'NIST',
  title: 'NIST CSF 2.0, NIST AI RMF & Enterprise GRC',
  provider: 'NIST / GRC',
  tier: 2,
  tagline: 'Operationalize NIST CSF 2.0 (6 Functions), NIST AI RMF 1.0, and ISO 31000/Guide 73 GRC.',
  estimatedTotalHours: 50,
  passingScore: '80% Mastery Benchmark',
  domains: [
    {
      id: 'nist-d1',
      domainNumber: 1,
      title: 'NIST CSF 2.0 Core & The Govern Function',
      examWeightPercent: 45,
      overview: 'Master the 6 NIST CSF 2.0 Functions (Govern, Identify, Protect, Detect, Respond, Recover), Tiers 1–4, and Organizational Profiles.',
      lessons: [
        {
          id: 'nist-d1-l1',
          title: 'NIST CSF 2.0 Architecture: Govern at the Center',
          estimatedMinutes: 40,
          summary: 'Understand why NIST CSF 2.0 elevated GOVERN (GV) to the center of cybersecurity risk management and how Profiles drive continuous improvement.',
          learningObjectives: [
            'Explain all 6 CSF 2.0 Functions: Govern, Identify, Protect, Detect, Respond, Recover',
            'Use Current Profile vs Target Profile to build a risk-prioritized Action Plan',
            'Differentiate Implementation Tiers 1 (Partial) through 4 (Adaptive)',
          ],
          coreConcepts: [
            {
              heading: 'The 6 Functions of NIST CSF 2.0',
              explanation:
                'GOVERN (GV) establishes organizational context, risk strategy, roles, policy, and supply chain risk. It wraps around IDENTIFY (ID), PROTECT (PR), DETECT (DE), RESPOND (RS), and RECOVER (RC).',
              mentalModel: 'Govern is the steering wheel; ID/PR/DE/RS/RC are the engine and brakes.',
            },
          ],
          realWorldScenario: {
            title: 'Board-Driven Cybersecurity Maturity Upgrade',
            situation: 'A manufacturing firm is at Tier 1 (ad-hoc) with zero visibility into third-party vendor risks.',
            analysis: 'Start with GV.SC (Cybersecurity Supply Chain Risk Management) and build a Current vs Target Profile targeting Tier 3 (Repeatable) for critical OT/IT assets.',
            takeaway: 'Tiers are NOT maturity grades everyone must max out—choose the Tier that matches your risk appetite and budget.',
          },
          examTraps: [
            'Higher NIST CSF Tiers (e.g., Tier 4) are NOT automatically required for every organization—Tiers reflect risk management rigor, not a mandatory compliance score.',
          ],
          keyTerms: [
            { term: 'Organizational Profile', definition: 'Alignment of CSF outcomes with business mission—comparing Current State vs Target State.' },
            { term: 'GV.SC', definition: 'Cybersecurity Supply Chain Risk Management category under Govern.' },
          ],
          conceptChecks: [
            {
              id: 'nist-d1-l1-q1',
              question: 'Which NEW top-level Function was added in NIST CSF 2.0 to anchor cybersecurity strategy, roles, and supply chain risk?',
              options: ['Audit', 'Govern', 'Assess', 'Comply'],
              correctIndex: 1,
              rationale: 'NIST CSF 2.0 introduced GOVERN (GV) as the 6th core function overseeing the other five.',
            },
          ],
          practicalDrill: {
            title: 'Current vs Target Profile Gap Map',
            prompt: 'Map 3 gaps (no asset inventory, no MFA, no DR testing) to exact CSF 2.0 Functions.',
            steps: ['Asset inventory -> Identify (ID.AM)', 'MFA -> Protect (PR.AA)', 'DR testing -> Recover (RC.RP).'],
            successCriteria: 'All 3 mapped to correct CSF 2.0 functions.',
          },
          flashcards: [
            { front: 'What are the 6 NIST CSF 2.0 Functions?', back: 'Govern, Identify, Protect, Detect, Respond, Recover.', tag: 'NIST-D1' },
          ],
          sourceRefs: ['my_documents/nist-grc/nist1.pdf', 'my_documents/NIST.CSWP.29.pdf'],
        },
      ],
    },
    {
      id: 'nist-d2',
      domainNumber: 2,
      title: 'NIST AI RMF 1.0 & ISO Guide 73 Risk Terminology',
      examWeightPercent: 55,
      overview: 'Govern trustworthy AI systems (Govern, Map, Measure, Manage) and standardize enterprise risk vocabulary.',
      lessons: [
        {
          id: 'nist-d2-l1',
          title: 'NIST AI RMF 1.0: Govern, Map, Measure, Manage',
          estimatedMinutes: 40,
          summary: 'Evaluate AI trustworthiness characteristics (Valid/Reliable, Safe, Secure/Resilient, Accountable/Transparent, Explainable, Privacy-Enhanced, Fair) across the AI lifecycle.',
          learningObjectives: [
            'Apply the 4 NIST AI RMF Functions: Govern, Map, Measure, Manage',
            'Identify algorithmic bias, data drift, hallucination, and prompt injection risks',
            'Use ISO Guide 73 standard definitions for Risk, Appetite, Tolerance, and Residual Risk',
          ],
          coreConcepts: [
            {
              heading: 'NIST AI RMF 4 Functions',
              explanation:
                'GOVERN cultivates AI risk culture and accountability. MAP contextualizes AI use cases and impacts. MEASURE quantitatively/qualitatively tests accuracy, bias, and robustness. MANAGE prioritizes and mitigates identified AI risks.',
              mentalModel: 'Govern (Culture) -> Map (Context) -> Measure (Test) -> Manage (Act).',
            },
          ],
          realWorldScenario: {
            title: 'Auditing an AI Loan-Approval Model',
            situation: 'A bank deploys an ML credit scoring model that shows disparate rejection rates across demographics.',
            analysis: 'Under MEASURE, run fairness/bias metrics and explainability (SHAP) audits; under MANAGE, require human-in-the-loop review and retrain on balanced data.',
            takeaway: 'Never deploy high-impact AI without human-in-the-loop oversight and continuous drift monitoring.',
          },
          examTraps: [
            'ISO Guide 73 defines Risk as the "effect of uncertainty on objectives" (it can be positive/opportunity OR negative/threat!).',
          ],
          keyTerms: [
            { term: 'Model Drift', definition: 'Degradation of AI model accuracy over time as real-world data diverges from training data.' },
            { term: 'Risk Appetite', definition: 'Amount and type of risk an organization is willing to pursue or retain (ISO Guide 73).' },
          ],
          conceptChecks: [
            {
              id: 'nist-d2-l1-q1',
              question: 'In NIST AI RMF 1.0, which function focuses on testing and benchmarking an AI model for bias, accuracy, and robustness?',
              options: ['Govern', 'Map', 'Measure', 'Manage'],
              correctIndex: 2,
              rationale: 'MEASURE employs quantitative and qualitative methods to analyze, assess, and benchmark AI risks.',
            },
          ],
          practicalDrill: {
            title: 'AI Risk Register Entry',
            prompt: 'Draft a 1-row AI Risk Register entry for an enterprise LLM customer-support bot.',
            steps: ['Risk: Hallucinated refund policy / prompt injection.', 'Control: RAG grounding + output guardrails + human escalation.'],
            successCriteria: 'Includes inherent risk, control, and residual risk.',
          },
          flashcards: [
            { front: 'What are the 4 NIST AI RMF Functions?', back: 'Govern, Map, Measure, Manage.', tag: 'NIST-D2' },
          ],
          sourceRefs: ['my_documents/nist-grc/nist ai 1.pdf', 'my_documents/iso_guide_73-2009-(Terminology).pdf'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Integrated NIST CSF 2.0 + AI RMF Governance Blueprint',
    scenario: 'A healthcare fintech is adopting GenAI triage tools while preparing for a board cybersecurity governance review.',
    tasks: [
      'Build a CSF 2.0 Target Profile anchored in Govern.',
      'Apply AI RMF Map/Measure/Manage to the GenAI tool.',
      'Present a 1-page Board Risk Scorecard.',
    ],
    modelSolution: 'Establish AI & Cyber Steering Committee (GV), map PHI data flows (ID/Map), test GenAI for hallucination & privacy leakage (Measure), enforce human-in-the-loop + DLP + 3-2-1 backups (Protect/Manage).',
  },
  examStrategy: {
    examFormat: '60 scenario & framework-mapping questions, 90 minutes, 80% mastery benchmark.',
    timeManagementPlan: '1.5 minutes per question; always anchor answers in Govern/business context first.',
    mindsetRules: [
      'Remember ISO Guide 73: Risk is the effect of uncertainty on objectives.',
      'Governance sets direction; Management executes.',
    ],
    finalWeekChecklist: [
      'Memorize all 6 CSF 2.0 Functions and 4 AI RMF Functions',
      'Review ISO Guide 73 risk definitions',
      'Complete the Capstone Board Risk Scorecard',
    ],
  },
};
