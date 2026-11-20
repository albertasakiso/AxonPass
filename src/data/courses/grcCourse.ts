/* ===================================================================
   ANOXPASS — End-to-End Certification Course: Enterprise GRC
   Governance, Risk Management & Compliance Mastery (Tier 2 Associate)
   Grounded in my_documents/nist-grc/ (Steinberg GRC, Holmquist Policy
   Management, NIST SP 800-37 Rev 2 RMF, NIST CSF 2.0, NIST AI RMF 1.0,
   ISO Guide 73, and COBIT 2019).
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const GRC_COURSE: CertificationCourse = {
  certId: 'grc-enterprise',
  certCode: 'GRC',
  title: 'Enterprise Governance, Risk & Compliance (GRC) Practitioner',
  provider: 'OCEG / NIST / COSO',
  tier: 2,
  tagline:
    'Master integrated governance, enterprise risk management, NIST SP 800-37 RMF, SOX/COSO internal controls, and AI/third-party compliance.',
  estimatedTotalHours: 55,
  passingScore: '80% Mastery Benchmark (Scenario & Framework Assessment)',
  domains: [
    // =================================================================
    // DOMAIN 1: Enterprise Governance, Board Oversight & Ethics (25%)
    // =================================================================
    {
      id: 'grc-d1',
      domainNumber: 1,
      title: 'Enterprise Governance, Board Oversight & Policy Architecture',
      examWeightPercent: 25,
      overview:
        'Establishes how boards and executive leadership direct organizational strategy, embed ethical tone at the top, align accountability through the Three Lines Model, and translate corporate mandate into enforceable policy hierarchies.',
      lessons: [
        {
          id: 'grc-d1-l1',
          title: 'Corporate Governance, Board Oversight & the Three Lines Model',
          estimatedMinutes: 45,
          summary:
            'Understand why GRC is fundamentally a business performance discipline—not an IT paperwork exercise—and how the board, executives, risk functions, and internal audit divide accountability without blind spots.',
          learningObjectives: [
            'Differentiate governance (direction and oversight) from management (execution and operations) using COBIT 2019 and OCEG Principled Performance.',
            'Assign clear ownership across the IIA Three Lines Model (1st Line operational owners, 2nd Line risk/compliance, 3rd Line independent assurance).',
            'Explain why Tone at the Top, board independence, and executive ethics programs prevent catastrophic corporate failures (e.g., Enron, 2008 financial crisis, Daimler).',
            'Identify board governance pitfalls including groupthink, filtered reporting, and misaligned executive incentive structures.',
          ],
          coreConcepts: [
            {
              heading: 'Principled Performance: The True Purpose of GRC',
              explanation:
                'OCEG defines GRC as the integrated collection of capabilities that enable an organization to reliably achieve objectives, address uncertainty, and act with integrity—a state termed Principled Performance. Governance sets strategic direction and risk boundaries; Risk Management identifies and treats uncertainty that could derail objectives; Compliance proves adherence to external mandates and internal commitments. Treating GRC as siloed checklists creates duplicate audits, conflicting policies, and dangerous visibility gaps between departments.',
              mentalModel:
                'Think of a Formula 1 car: Governance is the race strategy and driver steering, Risk Management is the braking and telemetry system that lets you take corners faster safely, and Compliance is the FIA technical inspection keeping you eligible to race. Brakes do not exist to make the car slow—they exist so the car can go fast without crashing.',
              formulaOrRule:
                'GRC Value Equation: Reliable Objective Achievement (G) + Managed Uncertainty (R) + Acting with Integrity (C) = Principled Performance.',
            },
            {
              heading: 'Governance vs. Management & Board Fiduciary Duty',
              explanation:
                'Board directors exercise fiduciary duties of Care (informed, diligent decision-making) and Loyalty (putting enterprise interests above personal gain). Under COBIT 2019, Governance follows EDM (Evaluate stakeholder needs, Direct via prioritization and policy, Monitor performance and compliance), while Management executes PBRM (Plan, Build, Run, Monitor). As Richard Steinberg emphasizes, boards must oversee strategy and risk appetite without micromanaging daily operations, and must maintain independent committees (Audit, Risk, Compensation) with unfettered access to raw management data.',
              mentalModel:
                'Noses in, fingers out: The Board sets the destination, fuel limits, and safety guardrails (EDM), while executive management flies the aircraft (PBRM).',
              formulaOrRule:
                'Board Authority = Evaluate, Direct, Monitor (EDM) | Management Execution = Plan, Build, Run, Monitor (PBRM).',
            },
            {
              heading: 'The IIA Three Lines Model & Accountability Boundaries',
              explanation:
                'Modern GRC assigns risk ownership across three distinct lines reporting to the Governing Body. First Line (Business & IT Operations) owns risks and executes controls daily. Second Line (Enterprise Risk Management, Information Security, Compliance, Legal) provides frameworks, challenge, monitoring, and expertise—but does NOT own operational business risk. Third Line (Internal Audit) delivers independent, objective assurance directly to the Audit Committee of the Board and must never design or operate management controls.',
              mentalModel:
                'Soccer match analogy: 1st Line are the players executing the game plan; 2nd Line are the coaches and trainers setting tactics and monitoring fitness; 3rd Line is the independent referee reporting rule violations straight to the league (Board).',
              formulaOrRule:
                '1st Line = Owns & operates risk/controls | 2nd Line = Advises, monitors & challenges | 3rd Line = Independent assurance to the Board.',
            },
            {
              heading: 'Tone at the Top, Ethics Culture & Board Pitfalls',
              explanation:
                'Policies fail when executive incentives contradict written ethics codes. Historical corporate collapses documented by Steinberg (Societe Generale, Merrill Lynch, Washington Mutual, Daimler) share recurring governance defects: boards "following the herd," short-term bonus structures rewarding excessive risk-taking, suppressed whistleblower channels, and sanitized status reports hiding operational decay. An effective ethics program integrates clear conduct standards, anonymous speak-up hotlines, consistent disciplinary enforcement even for top revenue producers, and board-level executive sessions without the CEO.',
              mentalModel:
                'Culture is not what is framed on the lobby wall; it is the worst behavior leadership is willing to tolerate from a top performer.',
            },
          ],
          realWorldScenario: {
            title: 'The Filtered Risk Dashboard at Apex Financial',
            situation:
              'Apex Financial is expanding rapidly into consumer lending. The Chief Sales Officer ties 80% of branch manager bonuses to loan origination volume. The 2nd-line Compliance Officer flags surging policy exceptions and lax borrower verification, but reports administratively and functionally to the Chief Operating Officer, who trims the severity ratings from "Red" to "Amber" before sending slides to the Board Risk Committee.',
            analysis:
              'Three classic governance failures are occurring simultaneously: (1) perverse compensation incentives driving 1st-line control bypass; (2) impaired 2nd-line independence because Compliance lacks a direct escalation path to the Board Risk/Audit Committee; and (3) sanitized upward reporting starving directors of critical risk intelligence needed to fulfill their Duty of Care.',
            takeaway:
              'Effective GRC requires dual-reporting lines (functional access to the Board Committee), alignment of executive compensation with risk-adjusted performance, and unfiltered KRI reporting.',
          },
          examTraps: [
            'Trap: Assuming the 2nd Line (GRC/CISO/Compliance) owns business risk. In reality, 1st Line business/process owners ALWAYS own the risk; 2nd Line advises, facilitates, and challenges.',
            'Trap: Letting Internal Audit (3rd Line) implement controls or approve risk exceptions. Doing so destroys audit independence—audit can recommend remediation, never own management controls.',
            'Trap: Equating "compliance" with "security" or "low risk." Passing an annual compliance audit is a point-in-time floor, never proof of continuous risk resilience.',
          ],
          keyTerms: [
            {
              term: 'Principled Performance',
              definition:
                'OCEG framework outcome where an organization reliably achieves business objectives while addressing uncertainty and acting with integrity.',
            },
            {
              term: 'Three Lines Model',
              definition:
                'IIA governance structure separating operational risk ownership (1st Line), risk/compliance oversight (2nd Line), and independent board assurance (3rd Line).',
            },
            {
              term: 'Tone at the Top',
              definition:
                'The visible ethical climate set by the Board and C-suite through resource allocation, incentive design, and consistent accountability.',
            },
            {
              term: 'Fiduciary Duty of Care',
              definition:
                'Legal obligation requiring board directors to make informed, diligent, good-faith decisions grounded in accurate organizational data.',
            },
            {
              term: 'EDM (Evaluate, Direct, Monitor)',
              definition:
                'The three COBIT 2019 governance activities executed by the governing body to steer enterprise IT and risk alignment.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d1-l1-q1',
              question:
                'During a ransomware readiness review, who holds ultimate ownership for accepting residual operational risk in a revenue-generating payment system?',
              options: [
                'The Chief Information Security Officer (2nd Line)',
                'The Head of Internal Audit (3rd Line)',
                'The Business Process / System Owner (1st Line)',
                'The External Compliance Assessor',
              ],
              correctIndex: 2,
              rationale:
                'Under the Three Lines Model, 1st Line business and system owners own operational risks and make risk acceptance decisions within board-approved appetite. The CISO (2nd Line) advises and monitors, Internal Audit (3rd Line) provides independent assurance, and external assessors evaluate compliance without assuming risk ownership.',
            },
            {
              id: 'grc-d1-l1-q2',
              question:
                'Which governance failure MOST directly undermines a Board of Directors’ ability to discharge its Fiduciary Duty of Care?',
              options: [
                'Delegating daily firewall rule changes to network operations staff',
                'Receiving executive-filtered risk summaries with no direct channel to the Chief Risk Officer or Internal Audit',
                'Requiring business units to fund their own compliance remediation budgets',
                'Separating the Chairman of the Board role from the Chief Executive Officer role',
              ],
              correctIndex: 1,
              rationale:
                'Duty of Care requires directors to make informed decisions based on accurate, unvarnished information. Filtered reporting without independent escalation channels creates critical blind spots. Delegating operational tasks is appropriate (Management vs. Governance), and separating Chair/CEO generally strengthens oversight.',
            },
            {
              id: 'grc-d1-l1-q3',
              question:
                'Internal Audit discovers a severe segregation-of-duties defect in ERP vendor master files. To expedite remediation before year-end, the CFO asks Internal Audit to design and configure the new ERP role permissions. What should Internal Audit do?',
              options: [
                'Configure the roles temporarily and hand them off after the external audit',
                'Decline to configure controls, document the finding, and advise management on design criteria while preserving independence',
                'Escalate directly to external regulators before notifying the Audit Committee',
                'Waive the finding if the CFO signs a verbal risk acceptance',
              ],
              correctIndex: 1,
              rationale:
                'Third-line Internal Audit cannot design, configure, or operate management controls without impairing its objectivity and independence on future audits. It may provide advisory criteria, but 1st/2nd line management must own and implement the fix.',
            },
          ],
          practicalDrill: {
            title: 'Three Lines Accountability & Escalation Charter',
            prompt:
              'Draft a concise RACI and reporting-line matrix for an enterprise launching a new customer-facing cloud platform subject to PCI DSS and GDPR.',
            steps: [
              'List five core activities: Setting Risk Appetite, Configuring Cloud Controls, Defining Security Policies, Monitoring Control Drift, and Independent Pre-Launch Assurance.',
              'Map each activity to Governing Body, 1st Line (Product/Cloud Engineering), 2nd Line (GRC/InfoSec/Privacy), and 3rd Line (Internal Audit).',
              'Specify functional vs. administrative reporting lines for the CRO, CISO, and Chief Audit Executive (CAE).',
              'Identify one potential conflict of interest in your chart and specify the structural safeguard that prevents it.',
            ],
            successCriteria:
              'Zero overlap where 3rd Line owns operational execution, 1st Line clearly owns operational risk, and both CRO and CAE hold direct escalation access to a Board committee.',
          },
          flashcards: [
            {
              front: 'What are the three pillars of OCEG Principled Performance?',
              back: 'Reliably achieve objectives (Governance), address uncertainty (Risk Management), and act with integrity (Compliance).',
              tag: 'GRC-D1',
            },
            {
              front: 'In the IIA Three Lines Model, how do the 1st, 2nd, and 3rd Lines differ?',
              back: '1st Line owns risks and executes controls; 2nd Line provides frameworks, oversight, and challenge; 3rd Line (Internal Audit) provides independent assurance directly to the Board.',
              tag: 'GRC-D1',
            },
            {
              front: 'How does COBIT 2019 distinguish Governance from Management?',
              back: 'Governance Evaluates, Directs, and Monitors (EDM); Management Plans, Builds, Runs, and Monitors (PBRM) in alignment with governance direction.',
              tag: 'GRC-D1',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc2.pdf',
            'my_documents/COBIT_2019_Framework_Introduction_and_Methodology_res_eng_1118.pdf',
          ],
        },
        {
          id: 'grc-d1-l2',
          title: 'Policy Management Hierarchy, Lifecycle & Exception Governance',
          estimatedMinutes: 40,
          summary:
            'Build an enforceable governance document stack—policies, standards, baselines, guidelines, and procedures—supported by formal lifecycle reviews, attestation workflows, and time-bound risk exceptions.',
          learningObjectives: [
            'Distinguish the exact legal and operational force of Policies, Standards, Baselines, Procedures, and Guidelines.',
            'Design an end-to-end policy management lifecycle covering authoring, legal alignment, approval, dissemination, attestation, and periodic retirement.',
            'Construct a formal Policy Exception workflow that enforces compensating controls, executive sign-off, and mandatory expiration dates.',
            'Apply Eric Holmquist’s cross-functional GRC principle to align policy ownership across IT, business heads, physical records, and third-party owners.',
          ],
          coreConcepts: [
            {
              heading: 'The 5-Tier Governance Document Hierarchy',
              explanation:
                'Well-architected GRC programs separate high-level intent from fast-changing technical detail. Policies are senior-management-approved, mandatory, technology-agnostic statements of intent ("All confidential data must be encrypted in transit"). Standards translate policies into mandatory, measurable technical/operational rules ("TLS 1.3 or TLS 1.2 with AEAD ciphers"). Baselines define minimum secure configuration builds for specific platforms (e.g., CIS Benchmark for Ubuntu 24.04). Procedures provide mandatory step-by-step instructions to execute tasks consistently. Guidelines offer non-mandatory best-practice recommendations when discretion is appropriate.',
              mentalModel:
                'Law hierarchy: Policy = Constitution (stable principles); Standards = Statutes (mandatory rules); Baselines = Building Codes (minimum specs); Procedures = Operating Manual (exact steps); Guidelines = Advisory Handbook (recommended tips).',
              formulaOrRule:
                'Mandatory: Policy -> Standard -> Baseline -> Procedure | Discretionary (Recommended): Guideline.',
            },
            {
              heading: 'Policy Management Lifecycle & Attestation Evidence',
              explanation:
                'A policy sitting unread on an intranet wiki offers zero legal defense or operational control. Effective policy management operates as a continuous 6-stage lifecycle: (1) Need & Regulatory Mapping, (2) Cross-Functional Drafting (IT, Legal, HR, Business Owners), (3) Governance Committee Approval, (4) Role-Targeted Publication & Training, (5) Tracked Employee Attestation & Enforcement Monitoring, and (6) Annual Review or Triggered Update (upon mergers, breaches, or regulatory changes). Attestation records provide auditable proof of due care.',
              mentalModel:
                'Treat policies like production software: version-controlled, peer-reviewed, mapped to requirements, deployed with user onboarding, monitored for defects, and patched on schedule.',
            },
            {
              heading: 'Formal Policy Exception & Compensating Control Governance',
              explanation:
                'Rigid policies without a structured exception process drive Shadow IT, because business units quietly work around blockers. Conversely, informal email waivers create unmonitored risk exposure. A mature exception process requires: documented business justification, risk assessment of the gap, mandatory compensating controls reducing residual exposure, formal approval by the Risk Owner (escalated to executive level for High/Critical exceptions), entry into the Risk Register, and an automatic expiration date (typically 90–180 days) forcing re-evaluation or remediation.',
              mentalModel:
                'An exception is a short-term loan with collateral (compensating controls) and a hard maturity date—never a permanent gift.',
              formulaOrRule:
                'Valid Exception = Business Justification + Risk Analysis + Compensating Control + Risk Owner Sign-Off + Expiration Date.',
            },
          ],
          realWorldScenario: {
            title: 'The "Legacy Medical Scanner" Policy Conflict',
            situation:
              'A hospital’s Information Security Policy mandates that all network-connected endpoints run modern EDR agents and receive monthly OS patches. Biomedical Engineering purchases a $1.2M MRI control workstation whose FDA certification becomes void if third-party EDR software is installed on its embedded Windows OS. IT threatens to disconnect the scanner; clinicians warn patient care will halt.',
            analysis:
              'This is a classic case requiring structured Policy Exception Governance rather than policy abandonment or secret circumvention. The policy stays intact, while the Risk Owner submits a time-bound exception supported by compensating controls: isolating the MRI workstation on a strict micro-segmented VLAN, blocking outbound internet access, deploying passive network intrusion detection (IDS/NDR), and enforcing physical badge access.',
            takeaway:
              'Exceptions are not governance failures—untracked, unmitigated exceptions are. Compensating controls bridge business reality and risk appetite.',
          },
          examTraps: [
            'Trap: Putting specific product names or cipher versions inside a corporate Policy. Technical specifics belong in Standards or Baselines so you do not need Board re-approval every time technology updates.',
            'Trap: Confusing Guidelines (optional/advisory) with Standards or Baselines (mandatory). Exam questions frequently test whether a recommendation is enforceable.',
            'Trap: Allowing permanent policy waivers. Every valid risk exception MUST have a defined expiration/review date and compensating controls.',
          ],
          keyTerms: [
            {
              term: 'Security Standard',
              definition:
                'Mandatory, measurable technical or operational requirement that enforces a high-level policy.',
            },
            {
              term: 'Configuration Baseline',
              definition:
                'Documented minimum acceptable security settings required for a specific operating system, cloud service, or device class.',
            },
            {
              term: 'Guideline',
              definition:
                'Recommended best practice offering flexible guidance when no strict standard applies; non-mandatory by definition.',
            },
            {
              term: 'Compensating Control',
              definition:
                'An alternative safeguard deployed to achieve an equivalent level of risk reduction when a primary control is technically or operationally infeasible.',
            },
            {
              term: 'Policy Attestation',
              definition:
                'Auditable confirmation that personnel have received, read, understood, and agreed to comply with applicable corporate policies.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d1-l2-q1',
              question:
                'Where should an enterprise document the requirement that all AWS S3 buckets must enforce AES-256 server-side encryption and block public ACLs?',
              options: [
                'Enterprise Information Security Policy',
                'Cloud Storage Security Standard / Baseline',
                'Employee Acceptable Use Guideline',
                'Board Audit Committee Charter',
              ],
              correctIndex: 1,
              rationale:
                'Technology-specific, mandatory configuration rules belong in a Standard or Baseline. Policies remain high-level and technology-agnostic ("encrypt sensitive data at rest"), while Guidelines are non-mandatory.',
            },
            {
              id: 'grc-d1-l2-q2',
              question:
                'Which element is MOST critical to prevent an approved policy exception from turning into permanent, forgotten organizational risk?',
              options: [
                'Allowing the IT administrator to grant verbal extensions as needed',
                'Removing the affected asset from the enterprise asset inventory',
                'Setting a mandatory expiration date linked to the Risk Register with periodic re-approval',
                'Rewriting the corporate policy to exempt the entire department permanently',
              ],
              correctIndex: 2,
              rationale:
                'Time-bound expiration dates tracked in the Risk Register force periodic reassessment of whether the original business constraint still exists or can now be remediated.',
            },
          ],
          practicalDrill: {
            title: 'Deconstruct a Policy Into All 5 Governance Tiers',
            prompt:
              'Take the corporate mandate "Protect enterprise identities from unauthorized access" and draft concrete, one-to-two-sentence entries for all five document tiers.',
            steps: [
              'Write the high-level Policy statement (technology-agnostic, board-level).',
              'Write the mandatory Standard specifying authentication strength (e.g., phishing-resistant MFA such as FIDO2/WebAuthn for privileged roles).',
              'Write a platform Baseline entry (e.g., idle session timeout = 15 minutes, lockout threshold = 5 attempts).',
              'Write a 3-step Procedure for onboarding a new privileged administrator.',
              'Write a Guideline offering practical tips for travel or remote work hygiene.',
            ],
            successCriteria:
              'Clear separation of mandatory vs. advisory language, zero vendor/version lock-in at the Policy tier, and verifiable metrics in Standards/Baselines.',
          },
          flashcards: [
            {
              front: 'Which governance document tier is advisory and NOT mandatory?',
              back: 'Guidelines. Policies, Standards, Baselines, and Procedures are all mandatory.',
              tag: 'GRC-D1',
            },
            {
              front: 'What five ingredients make a Policy Exception defensible to auditors?',
              back: 'Business justification, documented risk assessment, compensating controls, formal Risk Owner sign-off, and a fixed expiration date tracked in the Risk Register.',
              tag: 'GRC-D1',
            },
            {
              front: 'Why should corporate Policies remain technology-agnostic?',
              back: 'So policies endure across technology shifts without requiring repeated executive/board re-approval; technical specifics live in Standards and Baselines.',
              tag: 'GRC-D1',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc1.pdf',
            'my_documents/nist-grc/grc2.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: Enterprise Risk Management & NIST SP 800-37 RMF (30%)
    // =================================================================
    {
      id: 'grc-d2',
      domainNumber: 2,
      title: 'Enterprise Risk Management & NIST SP 800-37 Rev 2 RMF',
      examWeightPercent: 30,
      overview:
        'Builds rigorous command of ISO Guide 73 risk vocabulary, Holmquist cross-functional risk assessments, COSO ERM, the complete 7-step NIST SP 800-37 Rev 2 Risk Management Framework, and KRI-driven board reporting.',
      lessons: [
        {
          id: 'grc-d2-l1',
          title: 'ERM Foundations, ISO Guide 73 & Multi-Focal Risk Assessments',
          estimatedMinutes: 45,
          summary:
            'Internalize canonical ISO Guide 73 risk definitions, execute business-driven multi-focal risk assessments (IT systems, electronic data, physical files, third parties), and compare COSO ERM and ISO 31000.',
          learningObjectives: [
            'Apply exact ISO Guide 73 definitions for risk, risk source, likelihood, consequence, inherent risk, residual risk, risk appetite, and risk tolerance.',
            'Design a multi-focal risk assessment across Holmquist’s four focal points: Information Systems, Electronic Data, Physical Files, and Third Parties.',
            'Evaluate qualitative vs. quantitative risk analysis methods and choose the right approach for executive decision-making.',
            'Compare the structure and emphasis of COSO ERM (Strategy & Performance) and ISO 31000.',
          ],
          coreConcepts: [
            {
              heading: 'ISO Guide 73 Canonical Risk Vocabulary',
              explanation:
                'ISO Guide 73 defines risk as the "effect of uncertainty on objectives"—meaning risk can be negative (downside threat) or positive (missed opportunity). Risk is expressed as a combination of the consequences (impact) of an event and the associated likelihood of occurrence. Inherent Risk is exposure before controls are applied; Residual Risk is exposure remaining after controls operate; Secondary Risk is new risk introduced by a control itself (e.g., centralized key vaults creating a single point of failure).',
              mentalModel:
                'Rainstorm analogy: Going outside without an umbrella = Inherent Risk. Carrying an umbrella = Control. Getting your shoes wet anyway = Residual Risk. Getting hit by lightning because the umbrella has a metal tip = Secondary Risk.',
              formulaOrRule:
                'Risk = Likelihood × Impact (Consequence) | Residual Risk = Inherent Risk − Control Effectiveness (+ Secondary Risk).',
            },
            {
              heading: 'Multi-Focal Business Risk Assessments (Holmquist Method)',
              explanation:
                'As detailed in grc1.pdf, a classic failure is handing risk assessment solely to IT. Because information security is a business issue, effective assessment evaluates four distinct focal points with business ownership: (1) Information Systems (owned by IT), (2) Electronic Data (owned by business heads), (3) Physical Files (owned by department heads), and (4) Third Parties (owned by relationship owners). Each asset is scored on data quantity + sensitivity (Confidential, Sensitive, Public) combined with four compromise impact dimensions: Financial, Operational, Reputational, and Regulatory/Legal.',
              mentalModel:
                'Four-legged stool: Assessing only IT servers while ignoring paper HR files, business spreadsheets, and SaaS vendors guarantees the stool collapses.',
              formulaOrRule:
                'Asset Criticality = (Data Quantity + Sensitivity Classification) × Max Impact (Financial, Operational, Reputational, Regulatory).',
            },
            {
              heading: 'Qualitative vs. Quantitative Analysis & COSO ERM vs. ISO 31000',
              explanation:
                'Qualitative analysis uses ordinal scales (Low/Medium/High or 1–5 heat maps) for rapid triage and broad enterprise coverage, but suffers from subjectivity and poor cost-benefit precision. Quantitative analysis expresses exposure in monetary terms using SLE (Single Loss Expectancy = Asset Value × Exposure Factor), ARO (Annualized Rate of Occurrence), and ALE (SLE × ARO) or Monte Carlo FAIR simulations. COSO ERM (2017) integrates risk directly into corporate Strategy and Performance across 5 components (Governance & Culture, Strategy & Objective-Setting, Performance, Review & Revision, Information/Communication/Reporting), whereas ISO 31000 provides a streamlined, globally harmonized principles-framework-process standard.',
              mentalModel:
                'Qualitative = triage thermometer (fast, directional); Quantitative = blood-chemistry lab panel (slower, precise enough to justify a $2M investment to the CFO).',
              formulaOrRule:
                'SLE = Asset Value × Exposure Factor (EF) | ALE = SLE × ARO | Control ROI = (ALE_before − ALE_after) − Annual Control Cost.',
            },
          ],
          realWorldScenario: {
            title: 'The $400,000 Firewall Pitch Rejected by the CFO',
            situation:
              'A security manager tells the CFO that an unpatched legacy ERP interface is a "High-High Red Risk" and requests $400,000/year for a specialized virtual patching appliance. The CFO rejects the request because three other departments also submitted "Red Risks."',
            analysis:
              'Using qualitative colors alone gives executives zero capital-allocation guidance. When the GRC lead runs a quantitative analysis with Finance, they establish Asset Value = $2M, Exposure Factor = 25% (SLE = $500,000), and ARO = 0.3 (once every ~3.3 years), giving ALE_before = $150,000/year. Spending $400,000/year to prevent $150,000/year in annualized loss is economically irrational! Instead, network segmentation plus compensating monitoring costs $35,000/year and lowers ARO to 0.05 (ALE_after = $25,000), delivering a net positive risk reduction of $90,000/year.',
            takeaway:
              'Never recommend a control whose annualized cost exceeds the annualized risk reduction it achieves (unless legally mandated or protecting human safety).',
          },
          examTraps: [
            'Trap: Saying risk is "always negative." ISO Guide 73 explicitly defines risk as the effect of uncertainty on objectives, which may be positive, negative, or both.',
            'Trap: Buying a control whose annual cost exceeds the reduction in ALE. GRC decisions must be proportionate and business-justified.',
            'Trap: Confusing Exposure Factor (percentage of asset value lost in one incident, 0–100%) with ARO (frequency per year, which can exceed 1.0).',
          ],
          keyTerms: [
            {
              term: 'ISO Guide 73',
              definition:
                'International vocabulary standard defining authoritative risk management terminology used across ISO 31000 and ISO 27005.',
            },
            {
              term: 'Single Loss Expectancy (SLE)',
              definition:
                'Expected monetary loss from a single occurrence of a risk event (Asset Value × Exposure Factor).',
            },
            {
              term: 'Annualized Loss Expectancy (ALE)',
              definition:
                'Expected annual financial loss from a threat (SLE × Annualized Rate of Occurrence).',
            },
            {
              term: 'Inherent vs. Residual Risk',
              definition:
                'Inherent risk is raw exposure before controls; residual risk is the exposure remaining after controls are applied.',
            },
            {
              term: 'COSO ERM',
              definition:
                'Enterprise Risk Management framework integrating risk governance directly into organizational strategy and performance.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d2-l1-q1',
              question:
                'A customer billing database valued at $1,200,000 faces a ransomware scenario with a 50% Exposure Factor and an estimated frequency of once every 4 years (ARO = 0.25). A proposed immutable backup solution costs $80,000/year and lowers the Exposure Factor to 10%. What is the net annual financial benefit of the control?',
              options: [
                '$40,000 net annual savings',
                '$70,000 net annual savings',
                '$120,000 net annual savings',
                'Negative $20,000 (control is too expensive)',
              ],
              correctIndex: 0,
              rationale:
                'ALE_before = ($1,200,000 × 0.50) × 0.25 = $600,000 × 0.25 = $150,000. ALE_after = ($1,200,000 × 0.10) × 0.25 = $120,000 × 0.25 = $30,000. Gross risk reduction = $150,000 − $30,000 = $120,000. Subtracting the $80,000 annual control cost yields $40,000 net annual benefit.',
            },
            {
              id: 'grc-d2-l1-q2',
              question:
                'Under Eric Holmquist’s multi-focal GRC risk assessment model, why must business heads and relationship owners lead assessments alongside IT?',
              options: [
                'IT staff lack technical understanding of vulnerability scanners',
                'Sensitive assets also reside in business electronic data, physical files, and third parties whose business impacts only operational leaders can accurately quantify',
                'Regulatory law prohibits IT from participating in risk workshops',
                'Business heads can override ISO Guide 73 definitions to reduce audit scope',
              ],
              correctIndex: 1,
              rationale:
                'Information risk spans four focal points (IT systems, electronic business data, physical files, third parties). Only business owners know the financial, operational, reputational, and regulatory consequences of data compromise.',
            },
          ],
          practicalDrill: {
            title: 'Multi-Focal Asset & ALE Mini-Assessment',
            prompt:
              'Evaluate a mid-size e-commerce firm across all four GRC focal points and compute one full quantitative control justification.',
            steps: [
              'Identify one critical asset in each focal point: (1) IT System, (2) Electronic Data, (3) Physical Files, (4) Third-Party SaaS.',
              'Assign sensitivity (Confidential/Sensitive/Public) and score impact across Financial, Operational, Reputational, and Regulatory dimensions (1–5).',
              'Pick the highest-scoring asset and calculate SLE, ARO, and ALE_before.',
              'Propose a control with an annual cost, recalculate ALE_after, and justify Approve vs. Reject to a CFO.',
            ],
            successCriteria:
              'All four focal points covered with named business owners, mathematically accurate ALE calculations, and an economically sound recommendation.',
          },
          flashcards: [
            {
              front: 'How does ISO Guide 73 define "Risk"?',
              back: 'The effect of uncertainty on objectives (which may be positive, negative, or both).',
              tag: 'GRC-D2',
            },
            {
              front: 'What is the formula for ALE and Control Net Benefit?',
              back: 'SLE = AV × EF; ALE = SLE × ARO; Net Benefit = (ALE_before − ALE_after) − Annual Control Cost.',
              tag: 'GRC-D2',
            },
            {
              front: 'What are Holmquist’s 4 focal points of an enterprise risk assessment?',
              back: 'Information Systems (IT), Electronic Data (Business Heads), Physical Files (Department Heads), and Third Parties (Relationship Owners).',
              tag: 'GRC-D2',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc1.pdf',
            'my_documents/iso_guide_73-2009-(Terminology).pdf',
          ],
        },
        {
          id: 'grc-d2-l2',
          title: 'Mastering NIST SP 800-37 Rev 2: The 7-Step Risk Management Framework (RMF)',
          estimatedMinutes: 50,
          summary:
            'Walk end-to-end through NIST SP 800-37 Revision 2 (Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor), understanding key roles like the Authorizing Official (AO), FIPS 199 impact levels, and continuous authorization.',
          learningObjectives: [
            'Sequence all 7 steps of NIST SP 800-37 Rev 2 and explain why the "Prepare" step was added in Revision 2.',
            'Categorize an information system using FIPS 199 High-Water Mark logic across Confidentiality, Integrity, and Availability.',
            'Differentiate the responsibilities of the Authorizing Official (AO), System Owner (SO), Common Control Provider (CCP), and Security Control Assessor (SCA).',
            'Explain the authorization package artifacts: System Security Plan (SSP), Security Assessment Report (SAR), and Plan of Action and Milestones (POA&M).',
          ],
          coreConcepts: [
            {
              heading: 'The 7-Step NIST SP 800-37 Rev 2 Lifecycle',
              explanation:
                'NIST SP 800-37 Revision 2 modernized the classic 6-step RMF by introducing Step 0: PREPARE (organization-level and system-level readiness, risk strategy, common controls, and privacy integration). The full cycle runs: (1) Prepare -> (2) Categorize (FIPS 199 / SP 800-60) -> (3) Select (tailor NIST SP 800-53 controls and overlays) -> (4) Implement (engineer controls and document in the SSP) -> (5) Assess (independent SCA evaluates effectiveness per SP 800-53A, producing the SAR) -> (6) Authorize (Authorizing Official grants ATO or denies based on residual risk and POA&M) -> (7) Monitor (continuous monitoring of control drift, changes, and ongoing authorization).',
              mentalModel:
                'Mnemonic: "Please Call Security Immediately After Authorization Morning" — Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor.',
              formulaOrRule:
                'RMF 7 Steps: Prepare -> Categorize -> Select -> Implement -> Assess -> Authorize -> Monitor.',
            },
            {
              heading: 'FIPS 199 Categorization & the High-Water Mark Principle',
              explanation:
                'During the Categorize step, systems are classified by the potential adverse impact (Low, Moderate, or High) of a loss of Confidentiality, Integrity, or Availability. Under FIPS 199, the overall system impact categorization follows the High-Water Mark principle: the highest impact rating among C, I, or A determines the baseline security control set selected from NIST SP 800-53 (e.g., C=Low, I=Moderate, A=High -> Overall System Impact = HIGH).',
              mentalModel:
                'Flood-wall rule: If a levee protects against 10-foot waves on two sides and 30-foot waves on the third, you engineer the baseline for the 30-foot high-water mark.',
              formulaOrRule:
                'FIPS 199 Overall Impact = MAX(Confidentiality Impact, Integrity Impact, Availability Impact).',
            },
            {
              heading: 'RMF Key Roles & the Authorization Package Triad (SSP, SAR, POA&M)',
              explanation:
                'RMF enforces strict separation between builders, assessors, and risk acceptors. The System Owner builds and operates the system and maintains the System Security Plan (SSP). The Security Control Assessor (SCA) independently tests controls (examine, interview, test) and produces the Security Assessment Report (SAR). For any weaknesses found, the System Owner creates a Plan of Action and Milestones (POA&M) detailing remediation tasks, resources, and target dates. Only the Authorizing Official (AO)—a senior executive with budgetary and mission authority—reviews the SSP + SAR + POA&M package to grant an Authority to Operate (ATO), Interim/Common Control Authorization, or Denial of Authorization (DATO).',
              mentalModel:
                'Aviation certification: Engineer writes the aircraft blueprint (SSP) -> FAA Inspector tests the plane and writes the defect report (SAR) -> Manufacturer commits to a repair schedule (POA&M) -> Aviation Director signs the airworthiness certificate (ATO).',
              formulaOrRule:
                'Authorization Package = SSP (What is built) + SAR (What passed/failed) + POA&M (How/when defects get fixed) -> AO issues ATO or DATO.',
            },
            {
              heading: 'Common Controls, Inheritance & Continuous Monitoring (ISCM)',
              explanation:
                'To eliminate redundant compliance work, SP 800-37 Rev 2 leverages Common Controls (inherited enterprise safeguards like physical data center security, corporate IAM, or SOC monitoring) alongside Hybrid Controls (shared between organization and system) and System-Specific Controls. Step 7 (Monitor) shifts organizations away from static 3-year paperwork recertifications toward Information Security Continuous Monitoring (ISCM), tracking configuration drift, vulnerability feeds, and security impact analyses whenever major system changes occur.',
              mentalModel:
                'Apartment building security: Every tenant inherits the building’s front-desk guard and fire sprinklers (Common Controls) while installing their own door lock (System-Specific Control).',
            },
          ],
          realWorldScenario: {
            title: 'Moving a Federal Health Claims Portal Through RMF',
            situation:
              'A healthcare SaaS vendor is pursuing FedRAMP Moderate / NIST SP 800-37 Rev 2 authorization for a claims portal storing 4 million patient records. During the Assess step, the independent SCA finds that database encryption at rest is enabled, but audit log review procedures are undocumented and 2 critical vulnerabilities remain unpatched.',
            analysis:
              'Because patient data carries Moderate confidentiality and integrity impact (and Moderate availability), FIPS 199 categorizes the system as Moderate. The SCA documents both findings objectively in the SAR—never altering findings to please the vendor. The System Owner updates the SSP after documenting log reviews and adds the 2 vulnerabilities to the POA&M with a 30-day remediation milestone and temporary WAF compensating controls. The Authorizing Official evaluates whether the residual risk is acceptable to grant an ATO conditional on closing the POA&M.',
            takeaway:
              'An ATO does not mean "zero risk"—it means an empowered executive formally accepted documented residual risk backed by an independent SAR and binding POA&M.',
          },
          examTraps: [
            'Trap: Forgetting the "Prepare" step added in NIST SP 800-37 Revision 2 (Rev 1 only had 6 steps starting with Categorize).',
            'Trap: Saying the Security Control Assessor (SCA) or System Owner grants the ATO. ONLY the Authorizing Official (AO) can formally accept risk and issue an ATO.',
            'Trap: Averaging C, I, and A ratings in FIPS 199. FIPS 199 ALWAYS uses the High-Water Mark (maximum rating), never an average.',
          ],
          keyTerms: [
            {
              term: 'Authorizing Official (AO)',
              definition:
                'Senior organizational official with authority to formally assume responsibility for operating an information system at an acceptable level of risk (issuing ATO/DATO).',
            },
            {
              term: 'System Security Plan (SSP)',
              definition:
                'Formal living document describing system boundaries, operational environment, and how selected security and privacy controls are implemented.',
            },
            {
              term: 'Security Assessment Report (SAR)',
              definition:
                'Independent report produced by the SCA detailing assessment results, control effectiveness determinations, and identified weaknesses.',
            },
            {
              term: 'Plan of Action and Milestones (POA&M)',
              definition:
                'Actionable remediation tracker listing control deficiencies, assigned owners, required resources, milestones, and scheduled completion dates.',
            },
            {
              term: 'FIPS 199 High-Water Mark',
              definition:
                'Rule assigning a system’s overall impact categorization based on the highest impact level among Confidentiality, Integrity, and Availability.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d2-l2-q1',
              question:
                'A public-facing emergency alert system has Confidentiality = Low, Integrity = High, and Availability = High. Under FIPS 199, what is its overall security categorization?',
              options: [
                'Low (lowest common denominator)',
                'Moderate (average of Low, High, and High)',
                'High (High-Water Mark principle)',
                'Undefined until penetration testing completes',
              ],
              correctIndex: 2,
              rationale:
                'Under FIPS 199, the High-Water Mark principle sets the overall system categorization to the highest impact across C, I, and A—here, High.',
            },
            {
              id: 'grc-d2-l2-q2',
              question:
                'Which three core documents form the executive Authorization Package reviewed by the Authorizing Official in Step 6 (Authorize) of NIST SP 800-37 Rev 2?',
              options: [
                'Business Continuity Plan, Incident Response Plan, and SLA',
                'System Security Plan (SSP), Security Assessment Report (SAR), and Plan of Action and Milestones (POA&M)',
                'Network Topology Diagram, Pen-Test Executive Summary, and Nondisclosure Agreement',
                'Risk Appetite Statement, Acceptable Use Policy, and Procurement Contract',
              ],
              correctIndex: 1,
              rationale:
                'The Authorization Package consists of the SSP (control implementation), SAR (independent assessment findings), and POA&M (remediation plan for open deficiencies).',
            },
            {
              id: 'grc-d2-l2-q3',
              question:
                'What major structural enhancement did NIST SP 800-37 Revision 2 add to align enterprise-level governance with system-level risk management?',
              options: [
                'Eliminating the Monitor step in favor of annual manual checklists',
                'Adding the Prepare step (organization-level and system-level readiness) and integrating privacy risk management and CSF alignment',
                'Transferring ATO authority from the Authorizing Official to the Security Control Assessor',
                'Replacing NIST SP 800-53 controls with ISO 9001 quality standards',
              ],
              correctIndex: 1,
              rationale:
                'Revision 2 introduced the Prepare step to execute foundational enterprise risk readiness, common control identification, supply chain risk alignment, and privacy integration before categorizing individual systems.',
            },
          ],
          practicalDrill: {
            title: 'NIST SP 800-37 Rev 2 System Authorization Walkthrough',
            prompt:
              'Map a new cloud-hosted Payroll & HR system through all 7 RMF steps.',
            steps: [
              'Prepare: Identify 2 enterprise Common Controls the Payroll system will inherit (e.g., corporate SSO/MFA, SOC monitoring).',
              'Categorize: Score Confidentiality, Integrity, and Availability (Low/Moderate/High) with justification and state the FIPS 199 High-Water Mark.',
              'Select & Implement: Name 3 key NIST SP 800-53 control families critical to Payroll (e.g., AC, AU, SC) and note how they are recorded in the SSP.',
              'Assess & Authorize: Draft 1 realistic SAR deficiency and its corresponding POA&M entry (owner, milestone, compensating control, due date).',
              'Monitor: Define 2 automated continuous monitoring metrics that trigger a Security Impact Analysis if breached.',
            ],
            successCriteria:
              'Logical FIPS 199 High-Water Mark, clear inheritance distinction, realistic SAR-to-POA&M traceability, and measurable continuous monitoring triggers.',
          },
          flashcards: [
            {
              front: 'List the 7 steps of NIST SP 800-37 Revision 2 in exact order.',
              back: '1. Prepare, 2. Categorize, 3. Select, 4. Implement, 5. Assess, 6. Authorize, 7. Monitor.',
              tag: 'GRC-D2',
            },
            {
              front: 'Who is the ONLY role authorized to issue an ATO in NIST RMF?',
              back: 'The Authorizing Official (AO)—a senior official who formally accepts residual risk on behalf of the organization.',
              tag: 'GRC-D2',
            },
            {
              front: 'What is the purpose of a POA&M in an RMF authorization package?',
              back: 'It tracks identified control weaknesses from the SAR along with remediation milestones, resource needs, owners, and target completion dates.',
              tag: 'GRC-D2',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/rsk1.pdf',
            'my_documents/nist-grc/nist1.pdf',
          ],
        },
        {
          id: 'grc-d2-l3',
          title: 'Risk Appetite, Tolerance, KRIs & Board-Level Risk Reporting',
          estimatedMinutes: 40,
          summary:
            'Translate technical security telemetry into decision-grade board intelligence using calibrated Risk Appetite/Tolerance thresholds, forward-looking Key Risk Indicators (KRIs), and actionable executive scorecards.',
          learningObjectives: [
            'Distinguish Risk Capacity, Risk Appetite, and Risk Tolerance with concrete operational examples.',
            'Design leading Key Risk Indicators (KRIs) and differentiate them cleanly from Key Performance Indicators (KPIs) and Key Control Indicators (KCIs).',
            'Structure a concise, decision-oriented Board Risk Report that links exposure to strategic objectives, budget trade-offs, and risk appetite thresholds.',
          ],
          coreConcepts: [
            {
              heading: 'Risk Capacity vs. Risk Appetite vs. Risk Tolerance',
              explanation:
                'These three boundaries govern every risk decision. Risk Capacity is the absolute maximum loss an enterprise can absorb before insolvency or existential failure. Risk Appetite (set by the Board) is the broad amount and type of risk the organization is willing to pursue or retain to achieve its strategy (always strictly below Capacity). Risk Tolerance is the acceptable tactical variation around specific objectives or metrics—the operational guardrails that trigger escalation before Appetite is breached.',
              mentalModel:
                'Driving on a mountain highway: Capacity = cliff edge (fatal crash); Appetite = posted speed limit (60 mph); Tolerance = acceptable cruising band (55–65 mph before you ease off the gas).',
              formulaOrRule:
                'Hierarchy: Operational Tolerance Band < Board Risk Appetite < Enterprise Risk Capacity.',
            },
            {
              heading: 'KRIs vs. KPIs vs. KCIs: Leading vs. Lagging Intelligence',
              explanation:
                'Boards drown in backward-looking activity metrics ("We blocked 4 million firewall packets!"). Mature GRC separates three metric families: KPIs measure goal achievement and operational performance (e.g., 99.95% payment uptime). KCIs measure whether specific safeguards are functioning as designed (e.g., 98% of critical patches applied within 14 days). KRIs are forward-looking early-warning signals that risk exposure is trending toward an appetite breach (e.g., rising mean time to remediate internet-facing critical CVEs, or surging privileged account exception counts).',
              mentalModel:
                'Health checkup: KPI = marathon finish time (performance); KCI = daily medication adherence (control execution); KRI = steadily climbing blood pressure (early warning of future heart attack).',
              formulaOrRule:
                'Good KRI Criteria: Predictive (leading), Measurable, Comparable over time, Tied to a specific Risk & Trigger Threshold (Green/Amber/Red).',
            },
            {
              heading: 'Communicating Cyber & GRC Risk to the Board of Directors',
              explanation:
                'Board directors are stewards of capital, strategy, and reputation—not firewall administrators. Effective board reporting replaces raw vulnerability counts with four crisp elements: (1) Top Enterprise Risk Scenarios ranked by business impact and current trend arrow; (2) Current exposure plotted directly against Board-approved Risk Appetite; (3) KRI threshold breaches with root cause and management action plans; and (4) Concrete decisions requested from the Board (funding trade-offs, risk acceptances, or strategic pivots).',
              mentalModel:
                'Bottom-Line Up Front (BLUF): Every board slide should answer "So what?" and "What decision or oversight action do you need from us today?" in 30 seconds.',
            },
          ],
          realWorldScenario: {
            title: 'Redesigning a Failed CISO Board Deck',
            situation:
              'At a quarterly Audit Committee meeting, the CISO presents 28 slides showing 14,200 blocked phishing emails, 830 patched CVEs, and SIEM EPS graphs. The Audit Chair interrupts: "Are we safer than last quarter, and could a ransomware attack shut down our factories before Q4 peak season?" The CISO has no clear answer.',
            analysis:
              'The deck reported raw operational volume (vanity metrics) instead of risk posture relative to business objectives and appetite. By pivoting to 4 core KRIs—(1) % of Tier-1 factory workloads backed by tested immutable backups, (2) Mean Time to Remediate exploited (KEV) internet-facing flaws, (3) % of privileged users on phishing-resistant MFA, and (4) Top 3 third-party logistics vendors with open Critical findings—the CISO directly answers the Board’s resilience question and unlocks $600k for OT segmentation.',
            takeaway:
              'Boards fund risk reduction tied to business survivability and appetite gaps—never raw alert volumes.',
          },
          examTraps: [
            'Trap: Choosing a backward-looking count of past breaches ("number of data breaches last year") as the BEST leading KRI. Lagging loss counts report history; leading KRIs predict rising exposure BEFORE losses happen.',
            'Trap: Setting Risk Appetite higher than Risk Capacity. Appetite must always sit safely inside Capacity.',
            'Trap: Letting middle managers unilaterally set Enterprise Risk Appetite. Enterprise Risk Appetite is approved by the Board of Directors / Senior Governing Body.',
          ],
          keyTerms: [
            {
              term: 'Risk Capacity',
              definition:
                'Absolute maximum level of risk an enterprise can bear without threatening its survival or statutory solvency.',
            },
            {
              term: 'Risk Appetite',
              definition:
                'Board-approved aggregate level and types of risk an organization is willing to accept in pursuit of strategic value.',
            },
            {
              term: 'Risk Tolerance',
              definition:
                'Acceptable tactical deviation around a specific objective or metric that operationalizes risk appetite.',
            },
            {
              term: 'Key Risk Indicator (KRI)',
              definition:
                'Forward-looking metric providing early warning of increasing risk exposure before an appetite threshold is breached.',
            },
            {
              term: 'Key Control Indicator (KCI)',
              definition:
                'Metric measuring the operating effectiveness and coverage of a specific risk-mitigating control.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d2-l3-q1',
              question:
                'Which metric is the BEST example of a forward-looking Key Risk Indicator (KRI) for enterprise ransomware exposure?',
              options: [
                'Total ransom paid during the previous fiscal year',
                'Percentage of critical production servers whose backups failed restoration testing over the last 30 days',
                'Total number of spam emails quarantined by the email gateway last month',
                'Annual cybersecurity training budget as a percentage of IT spend',
              ],
              correctIndex: 1,
              rationale:
                'Failed backup restoration tests directly signal rising catastrophic recovery exposure BEFORE a ransomware event hits, enabling proactive intervention. Prior ransom paid is a lagging loss metric, spam count is an activity metric, and budget % is an input metric.',
            },
            {
              id: 'grc-d2-l3-q2',
              question:
                'A bank’s board approves an annual fraud loss ceiling of $5M (Appetite) while capital reserves can survive up to $50M (Capacity). The card operations team triggers mandatory investigation whenever monthly fraud exceeds $450,000. That $450,000 monthly trigger represents:',
              options: [
                'Risk Capacity',
                'Inherent Risk',
                'Risk Tolerance / Operational Trigger Threshold',
                'Secondary Risk',
              ],
              correctIndex: 2,
              rationale:
                'The operational variance threshold ($450,000/month) set around a specific objective to keep annual exposure inside the $5M Board Appetite is Risk Tolerance.',
            },
          ],
          practicalDrill: {
            title: 'Design a 1-Page Executive Board Risk Scorecard',
            prompt:
              'Build a concise Board Risk Committee scorecard for a SaaS fintech processing $2B/year in payments.',
            steps: [
              'Draft a 2-sentence Enterprise Risk Appetite statement covering Data Privacy and Service Availability.',
              'Define 3 leading KRIs with explicit Green, Amber, and Red trigger thresholds.',
              'Pair each KRI with a supporting KCI that verifies control health.',
              'Write one BLUF executive decision request showing a Red KRI and the budgeted remediation trade-off.',
            ],
            successCriteria:
              'Zero technical jargon without business translation, clear quantitative Red/Amber/Green thresholds, and explicit link to Board Risk Appetite.',
          },
          flashcards: [
            {
              front: 'Contrast Risk Capacity, Risk Appetite, and Risk Tolerance.',
              back: 'Capacity = max survivable loss; Appetite = board-approved risk willing to take for strategy; Tolerance = tactical variance guardrails around specific objectives.',
              tag: 'GRC-D2',
            },
            {
              front: 'How do KRIs, KPIs, and KCIs differ?',
              back: 'KRIs warn early of rising risk exposure; KPIs measure business goal performance; KCIs measure whether specific controls operate effectively.',
              tag: 'GRC-D2',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc2.pdf',
            'my_documents/iso_guide_73-2009-(Terminology).pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: Internal Controls, Operational Assurance & Compliance (25%)
    // =================================================================
    {
      id: 'grc-d3',
      domainNumber: 3,
      title: 'Internal Controls, Operational Assurance & Regulatory Compliance',
      examWeightPercent: 25,
      overview:
        'Covers COSO Internal Control Integrated Framework, Sarbanes-Oxley (SOX 404) IT General Controls (ITGCs), control testing (design vs. operating effectiveness), and multi-framework compliance harmonization.',
      lessons: [
        {
          id: 'grc-d3-l1',
          title: 'COSO Internal Control, SOX 404 & IT General Controls (ITGCs)',
          estimatedMinutes: 45,
          summary:
            'Master the architecture of enterprise internal controls—preventive, detective, and corrective—along with SOX 404 financial reporting accountability, COSO’s 5 components, and the four ITGC pillars.',
          learningObjectives: [
            'Classify controls by nature (Preventive, Detective, Corrective, Deterrent, Compensating) and execution (Automated vs. Manual).',
            'Explain management’s and external auditors’ statutory duties under Sarbanes-Oxley Sections 302 and 404.',
            'Evaluate the four pillars of IT General Controls (ITGCs) and explain how ITGC failures invalidate automated application controls.',
            'Distinguish Control Design Effectiveness from Control Operating Effectiveness during assurance testing.',
          ],
          coreConcepts: [
            {
              heading: 'COSO Internal Control Integrated Framework (ICIF) & SOX 404',
              explanation:
                'Sarbanes-Oxley (SOX) was enacted after Enron and WorldCom to restore trust in financial markets. Section 302 requires the CEO and CFO to personally certify financial statement accuracy and disclosure controls. Section 404 requires management (404a) and—for accelerated filers—the independent external auditor (404b) to assess Internal Control over Financial Reporting (ICFR). Most enterprises anchor ICFR on the COSO Cube’s five integrated components: Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities—spanning 17 foundational principles.',
              mentalModel:
                'Think of COSO’s Control Environment as the concrete foundation of a house: if Tone at the Top and ethics are cracked, upper-floor control activities (locks and alarms) can be overridden by executives.',
              formulaOrRule:
                'COSO 5 Components: Control Environment + Risk Assessment + Control Activities + Information & Communication + Monitoring.',
            },
            {
              heading: 'IT General Controls (ITGCs) vs. Automated Application Controls',
              explanation:
                'Modern financial reporting depends heavily on ERP and billing software. IT Application Controls operate inside business workflows (e.g., three-way invoice match, automated credit limit checks). However, auditors can ONLY rely on automated application controls if underlying IT General Controls (ITGCs) are effective across four pillars: (1) Logical Access Security (provisioning, deprovisioning, privileged access, quarterly user access reviews), (2) Program Change Management (segregation between developers and production deployment), (3) System Development / Acquisition, and (4) Computer Operations (batch jobs, backups, incident recovery).',
              mentalModel:
                'Application Controls are the locked vault door; ITGCs are the walls and key-control logs. If a developer can push unapproved code straight into production (Change Management ITGC failure), the vault door cannot be trusted.',
              formulaOrRule:
                'Reliable Automated Controls = Effective Application Logic + Effective Supporting ITGCs (Access, Change, SDLC, Operations).',
            },
            {
              heading: 'Design Effectiveness vs. Operating Effectiveness & Deficiency Severity',
              explanation:
                'Control testing asks two distinct questions. Testing of Design (ToD) asks via inquiry and walkthrough: "If performed as written, would this control actually prevent or detect a material error?" Testing of Operating Effectiveness (ToE) samples evidence across the audit period: "Was this control consistently executed by qualified personnel?" Deficiencies escalate across three legal tiers: Control Deficiency (minor flaw) -> Significant Deficiency (important enough to merit Audit Committee attention) -> Material Weakness (reasonable possibility a material misstatement will not be prevented or detected on a timely basis—must be publicly disclosed under SOX).',
              mentalModel:
                'Seatbelt test: Design Effectiveness = Does the car have a sturdy 3-point seatbelt bolted to the frame? Operating Effectiveness = Did the driver actually buckle it on 25 out of 25 sampled trips?',
              formulaOrRule:
                'Deficiency Escalation: Control Deficiency < Significant Deficiency (Audit Committee) < Material Weakness (Public Disclosure / Adverse ICFR Opinion).',
            },
          ],
          realWorldScenario: {
            title: 'The Terminated Accountant & the SOX 404 Material Weakness',
            situation:
              'During a Q4 SOX 404 audit of a public retailer, auditors sample 25 terminated employees and discover that 4 former finance staff retained active ERP journal-entry access for 21 to 64 days after leaving because HR emailed IT manually instead of using an automated IAM trigger. No fraudulent entries were found during the year.',
            analysis:
              'Even though zero actual fraud occurred, the control failed Operating Effectiveness (4 of 25 exceptions = 16% failure rate). Worse, management had no timely detective compensating control reviewing post-termination activity. Because unauthorized journal entries could materially misstate revenue without timely detection, external auditors classify the gap as a Material Weakness unless management proves a timely, precise compensating control operated throughout the entire year.',
            takeaway:
              'In SOX and GRC assurance, "we did not get hacked or defrauded this year" is NEVER a valid defense for a broken control—potential material exposure defines severity.',
          },
          examTraps: [
            'Trap: Assuming a Material Weakness requires an actual financial misstatement or fraud to have already occurred. It only requires a "reasonable possibility" that a material misstatement would NOT be prevented or detected timely.',
            'Trap: Testing Operating Effectiveness on a control that failed Design Effectiveness. If a control is poorly designed, testing 40 samples wastes effort—fix the design first.',
            'Trap: Believing strong internal controls eliminate management override or collusion. As Steinberg highlights, even SOX 404 controls can be bypassed by colluding executives—which is why independent Board/Audit Committee oversight and whistleblowing remain vital.',
          ],
          keyTerms: [
            {
              term: 'IT General Controls (ITGCs)',
              definition:
                'Foundational IT controls over logical access, change management, SDLC, and operations that underpin trust in automated application controls.',
            },
            {
              term: 'Material Weakness',
              definition:
                'A deficiency (or combination of deficiencies) in ICFR creating a reasonable possibility that a material financial misstatement will not be prevented or detected timely.',
            },
            {
              term: 'Segregation of Duties (SoD)',
              definition:
                'Preventive internal control dividing incompatible functions (authorization, custody, recording, reconciliation) across different individuals to deter fraud and error.',
            },
            {
              term: 'Design vs. Operating Effectiveness',
              definition:
                'Design evaluates whether a control is capable of mitigating risk on paper; Operating evaluates whether it ran consistently over the review period.',
            },
            {
              term: 'Walkthrough',
              definition:
                'End-to-end trace of a single transaction from initiation through financial reporting to verify control design and confirm system understanding.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d3-l1-q1',
              question:
                'An ERP software developer holds production administrative rights and deploys payroll calculation code changes directly to production without peer review or approval tickets. Which control domain has failed, and what is the audit impact?',
              options: [
                'Physical Security; impact is limited to data center badge logs',
                'Change Management ITGC; auditors cannot rely on automated payroll application controls without extensive substantive testing',
                'Compliance Attestation; only requires an updated employee handbook',
                'Incident Response; requires immediate breach notification to regulators',
              ],
              correctIndex: 1,
              rationale:
                'Allowing developers to deploy unreviewed code into production breaks Change Management and Segregation of Duties (a core ITGC). Without reliable ITGCs, auditors cannot trust automated application controls running inside that ERP.',
            },
            {
              id: 'grc-d3-l1-q2',
              question:
                'Why does a Material Weakness under SOX 404 still exist even if forensic investigation confirms zero fraudulent transactions happened during the fiscal year?',
              options: [
                'Because SOX penalizes companies solely on IT headcount',
                'Because Material Weakness is defined by the reasonable possibility of an undetected material misstatement, not merely past occurrence',
                'Because external auditors must issue at least one Material Weakness every three years',
                'Because automated controls are prohibited under COSO ICIF',
              ],
              correctIndex: 1,
              rationale:
                'ICFR assurance evaluates whether controls reliably prevent or detect material misstatements. Getting lucky for one year does not erase a reasonable possibility of failure.',
            },
          ],
          practicalDrill: {
            title: 'ITGC Walkthrough & SoD Conflict Audit',
            prompt:
              'Evaluate a procure-to-pay (P2P) cloud ERP process for Segregation of Duties and ITGC gaps.',
            steps: [
              'List the four incompatible P2P roles: Create Vendor, Approve Purchase Order, Record Goods Receipt, Release Bank Payment.',
              'Identify what fraud scheme becomes possible if one person holds both "Create Vendor" and "Release Bank Payment."',
              'Specify one Preventive ITGC (RBAC/SoD rule) and one Detective compensating control (exception report reviewed by Controller) for a small finance team.',
              'Define the exact audit evidence artifacts needed to pass both Testing of Design (ToD) and Testing of Operating Effectiveness (ToE).',
            ],
            successCriteria:
              'Explicit fraud scenario explained, both preventive and detective controls clearly bounded, and verifiable population/sample evidence defined.',
          },
          flashcards: [
            {
              front: 'What are the 4 pillars of IT General Controls (ITGCs)?',
              back: '1. Logical Access Security, 2. Change Management, 3. Program Development/Acquisition (SDLC), 4. Computer Operations.',
              tag: 'GRC-D3',
            },
            {
              front: 'Rank the 3 SOX 404 deficiency levels from lowest to highest severity.',
              back: 'Control Deficiency < Significant Deficiency (reported to Audit Committee) < Material Weakness (requires public disclosure).',
              tag: 'GRC-D3',
            },
            {
              front: 'Why can internal controls never deliver 100% absolute assurance?',
              back: 'Because of inherent limitations: human error, faulty judgment, cost-benefit constraints, collusion, and management override.',
              tag: 'GRC-D3',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc2.pdf',
            'my_documents/COBIT_2019_Framework_Introduction_and_Methodology_res_eng_1118.pdf',
          ],
        },
        {
          id: 'grc-d3-l2',
          title: 'Compliance Harmonization, Control Rationalization & Continuous Assurance',
          estimatedMinutes: 40,
          summary:
            'Eliminate "audit fatigue" across SOC 2, ISO 27001, PCI DSS, HIPAA, GDPR, and NIST CSF 2.0 by designing a Unified Control Framework (UCF) ("test once, comply many") backed by automated compliance telemetry.',
          learningObjectives: [
            'Design a Unified Control Framework (UCF) that maps one internal control statement to multiple overlapping regulations and standards.',
            'Differentiate regulatory mandates (GDPR, HIPAA, SOX), contractual frameworks (PCI DSS), and voluntary assurance attestations (SOC 2 Type II, ISO 27001).',
            'Explain the crucial difference between SOC 2 Type I and SOC 2 Type II reports and the five Trust Services Criteria.',
            'Transition from annual spreadsheet evidence chasing to Continuous Controls Monitoring (CCM).',
          ],
          coreConcepts: [
            {
              heading: 'Control Rationalization: "Test Once, Comply Many"',
              explanation:
                'Mid-to-large enterprises routinely face 6 to 15 concurrent audits (ISO 27001, SOC 2, PCI DSS, HIPAA, SOX, GDPR, NIST 800-53). Managing each framework in separate spreadsheets forces engineers to collect the exact same MFA screenshot six times a year. Control Rationalization builds a single canonical Internal Control Catalog (a Unified Control Framework / Common Controls Framework) where each enterprise control is authored once, tested once on a defined cadence, and cross-mapped to every applicable authoritative requirement.',
              mentalModel:
                'Universal power adapter: Instead of wiring six separate electrical grids into your house for each appliance, wire one unified grid and plug in framework-specific adapters.',
              formulaOrRule:
                'Unified GRC Pattern: Many Authoritative Sources -> Deduplicated Common Control -> Single Automated Evidence Collection -> Multiple Audit Views.',
            },
            {
              heading: 'Assurance Landscape: Statutory vs. Contractual vs. Attestation Reports',
              explanation:
                'GRC leaders must classify obligations by legal force and scope. Statutory/Regulatory laws carry government fines and criminal/civil liability (SOX, GDPR, HIPAA, EU AI Act, DORA). Contractual mandates bind via commercial agreements (PCI DSS via card brands, customer DPAs). Voluntary assurance certifications/attestations prove trust to customers: ISO/IEC 27001 certifies an Information Security Management System (ISMS) via accredited registrars, while AICPA SOC 2 evaluates Security (mandatory) plus optional Availability, Processing Integrity, Confidentiality, and Privacy. SOC 2 Type I evaluates control design at a single point in time; SOC 2 Type II evaluates both design AND operating effectiveness over a minimum period (typically 6–12 months).',
              mentalModel:
                'SOC 2 Type I is a wedding photo (everything looks great on that one day); SOC 2 Type II is a 12-month security camera reel proving you actually lived that way all year.',
              formulaOrRule:
                'SOC 2 Type I = Design at a Point in Time | SOC 2 Type II = Design + Operating Effectiveness over a Period of Time.',
            },
            {
              heading: 'Continuous Controls Monitoring (CCM)',
              explanation:
                'Traditional point-in-time audits leave 11 months of blind spots where cloud buckets turn public or MFA gets disabled between reviews. Continuous Controls Monitoring connects the GRC platform via APIs directly to IdPs (Okta/Entra ID), CSPMs (AWS Security Hub/Wiz), ticketing (Jira), and EDR tools to test 100% of the asset population daily instead of sampling 25 manual screenshots once a year.',
              mentalModel:
                'Shift from annual dental X-rays (manual sampling) to a continuous ECG heart monitor (automated API control validation).',
            },
          ],
          realWorldScenario: {
            title: 'Cutting Audit Hours by 60% at CloudMed SaaS',
            situation:
              'CloudMed holds ISO 27001, SOC 2 Type II, HIPAA readiness, and PCI DSS Level 1 compliance. Engineering complains they spend 1,400 hours per year answering repetitive auditor requests for user access lists, change tickets, and encryption proofs.',
            analysis:
              'CloudMed’s GRC lead inventories 640 scattered requirements across all four frameworks and discovers 72% overlap. By rationalizing them into 145 Unified Enterprise Controls mapped in a single cross-walk matrix and automating evidence ingestion from GitHub, Okta, and AWS Config, evidence collection runs continuously for 100% of assets and feeds all four auditors from one repository.',
            takeaway:
              'Compliance maturity is measured by reduced operational friction and real-time control assurance—not by how many spreadsheets your team maintains.',
          },
          examTraps: [
            'Trap: Accepting a vendor’s SOC 2 Type I report as proof that controls operated reliably all year. Only a SOC 2 Type II report tests operating effectiveness over a review window.',
            'Trap: Calling PCI DSS a federal law. PCI DSS is a contractual industry standard enforced by payment card brands and acquiring banks, though breaches can trigger statutory penalties.',
            'Trap: Mapping controls 1-to-1 to every framework requirement without deduplication, creating massive audit fatigue and conflicting evidence.',
          ],
          keyTerms: [
            {
              term: 'Unified Control Framework (UCF)',
              definition:
                'Harmonized master set of internal controls cross-mapped to multiple overlapping regulatory and industry frameworks.',
            },
            {
              term: 'SOC 2 Type II',
              definition:
                'Independent AICPA attestation evaluating both the design and operating effectiveness of Trust Services Criteria controls over a sustained time window.',
            },
            {
              term: 'Continuous Controls Monitoring (CCM)',
              definition:
                'Automated, ongoing verification of control compliance across full system populations using direct telemetry integrations.',
            },
            {
              term: 'Regulatory Horizon Scanning',
              definition:
                'Structured process of monitoring emerging legislation, standards updates, and enforcement trends to update compliance obligations proactively.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d3-l2-q1',
              question:
                'A fintech enterprise must comply simultaneously with SOC 2 Type II, ISO 27001, PCI DSS, and NIST CSF 2.0. What is the MOST effective GRC strategy to prevent engineering audit fatigue?',
              options: [
                'Assign four separate compliance teams to maintain independent spreadsheets per framework',
                'Build a rationalized Common Control Framework mapped once to all four authoritative sources ("test once, comply many")',
                'Drop ISO 27001 and rely exclusively on annual penetration tests',
                'Outsource all engineering changes to an external audit firm',
              ],
              correctIndex: 1,
              rationale:
                'Control rationalization consolidates overlapping requirements into unified enterprise controls so a single test/evidence artifact satisfies multiple frameworks simultaneously.',
            },
            {
              id: 'grc-d3-l2-q2',
              question:
                'You are reviewing a critical payroll SaaS vendor before signing a 3-year contract. The vendor provides a clean SOC 2 Type I report dated last week. What is the key limitation of this report?',
              options: [
                'It only evaluates physical data center locks and omits logical access',
                'It verifies control design only at a single point in time and provides no assurance of sustained operating effectiveness',
                'It is only valid for healthcare organizations under HIPAA',
                'It cannot cover the Security Trust Services Criterion',
              ],
              correctIndex: 1,
              rationale:
                'SOC 2 Type I confirms suitability of control design as of a single date. To confirm controls actually operated reliably over months, you need a SOC 2 Type II report.',
            },
          ],
          practicalDrill: {
            title: 'Cross-Framework Control Mapping Exercise',
            prompt:
              'Create a mini Unified Control entry for Privileged Multi-Factor Authentication mapped across 3 frameworks.',
            steps: [
              'Author one concise canonical internal control statement (ID: UCF-IAM-04) covering scope, frequency, and owner.',
              'Map UCF-IAM-04 to corresponding requirements in NIST CSF 2.0 (PR.AA-03), ISO 27001 (A.8.5), and SOC 2 (CC6.1).',
              'Specify an automated Continuous Controls Monitoring (CCM) API check that proves 100% population compliance.',
              'Define the automated alert workflow when a privileged account is detected without MFA.',
            ],
            successCriteria:
              'Single clear control statement mapped accurately to all three frameworks with an automated evidence source and escalation rule.',
          },
          flashcards: [
            {
              front: 'What is the core difference between SOC 2 Type I and SOC 2 Type II?',
              back: 'Type I evaluates control design at a single point in time; Type II evaluates both design and operating effectiveness over a defined period (typically 6–12 months).',
              tag: 'GRC-D3',
            },
            {
              front: 'What are the 5 AICPA SOC 2 Trust Services Criteria?',
              back: 'Security (Common Criteria—mandatory), Availability, Processing Integrity, Confidentiality, and Privacy.',
              tag: 'GRC-D3',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc1.pdf',
            'my_documents/nist-grc/nist1.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: Third-Party, AI & Modern Integrated GRC Programs (20%)
    // =================================================================
    {
      id: 'grc-d4',
      domainNumber: 4,
      title: 'Third-Party Risk, AI Governance & Integrated GRC Architecture',
      examWeightPercent: 20,
      overview:
        'Addresses the modern extended enterprise: Cyber Supply Chain and Third-Party Risk Management (TPRM), governing generative and predictive AI via NIST AI RMF 1.0, and avoiding buyer pitfalls when selecting GRC platforms.',
      lessons: [
        {
          id: 'grc-d4-l1',
          title: 'Third-Party Risk Management (TPRM) & Cyber Supply Chain Governance',
          estimatedMinutes: 45,
          summary:
            'Manage vendor, SaaS, and fourth-party concentration risk across the complete TPRM lifecycle—tiering, due diligence, contractual security addenda, continuous monitoring, and secure offboarding.',
          learningObjectives: [
            'Apply the Golden Rule of Outsourcing: you can outsource operations, but you can NEVER outsource legal/regulatory accountability.',
            'Execute risk-tiered vendor due diligence (Critical/High/Medium/Low) proportionate to data sensitivity and business criticality.',
            'Specify non-negotiable contractual clauses: Right to Audit, Breach Notification SLAs, Subprocessor (4th-Party) disclosure, and Data Return/Destruction.',
            'Identify concentration risk and fourth-party cascade failures in cloud and software supply chains (NIST CSF 2.0 GV.SC).',
          ],
          coreConcepts: [
            {
              heading: 'The 5-Stage TPRM Lifecycle & Risk Tiering',
              explanation:
                'Sending a 400-question security spreadsheet to a catering vendor wastes time while under-scrutinizing a payment processor. Effective TPRM runs in five risk-tiered stages: (1) Intake & Inherent Risk Tiering (Tier 1 Critical -> Tier 4 Low based on data access, network connectivity, and operational substitutability); (2) Proportionate Due Diligence (SOC 2 Type II, ISO 27001, SIG questionnaires, pen-test summaries); (3) Contracting & Risk Treatment (Security Addendum, SLAs, cyber insurance, remediation clauses); (4) Ongoing Performance & Risk Monitoring (security ratings, breach alerts, annual reassessments); and (5) Offboarding & Exit Planning (revoking API keys/SSO, certified data destruction, exit portability).',
              mentalModel:
                'Airport security lanes: Tier 1 vendors handling crown-jewel data get full-body scrutiny and continuous surveillance; Tier 4 office-supply vendors get basic verification.',
              formulaOrRule:
                'Golden Rule of TPRM: Operations can be outsourced; Accountability and Reputational Liability ALWAYS remain with your organization.',
            },
            {
              heading: 'Essential Contractual Protections & Fourth-Party Concentration Risk',
              explanation:
                'Assessments only show a vendor’s posture today; contracts enforce your rights tomorrow. Critical TPRM clauses include: Breach Notification deadlines (e.g., 24–48 hours so YOU can still meet 72-hour GDPR/regulatory clocks), Right to Audit, Mandatory Subprocessor (Fourth-Party) notification and flow-down security terms, Service Level Agreements (SLAs) with RTO/RPO commitments, Data Ownership & Sanitization upon termination, and Cyber Liability Insurance minimums. Fourth-party risk arises when ten different Tier-1 vendors all secretly depend on the same cloud provider, identity service, or open-source library (concentration risk).',
              mentalModel:
                'Your supply chain is a web, not a straight line. If five "independent" vendors all run on the same single-region subprocessor, you have a hidden single point of failure.',
            },
          ],
          realWorldScenario: {
            title: 'The 72-Hour Regulatory Breach Clock Squeeze',
            situation:
              'A European insurer’s third-party claims SaaS vendor suffers a credential-stuffing breach exposing 180,000 policyholder records. The vendor’s standard contract only promises breach notification "within 15 business days of completing internal forensics." The insurer learns of the breach 19 days late, severely violating GDPR’s 72-hour regulator reporting window.',
            analysis:
              'The insurer relied on the vendor’s boilerplate MSA without negotiating a Security Addendum / Data Processing Agreement (DPA). Because statutory accountability stays with the Data Controller (insurer), regulators fine the insurer regardless of who got hacked.',
            takeaway:
              'Vendor breach notification windows must ALWAYS be significantly shorter than your own statutory reporting deadline (e.g., 24–36 hours to leave time for triage before a 72-hour regulator filing).',
          },
          examTraps: [
            'Trap: Believing a vendor SLA or liability cap transfers regulatory accountability to the vendor. Regulators hold the primary organization accountable.',
            'Trap: Skipping offboarding governance after canceling a SaaS subscription. Orphaned OAuth tokens, API keys, and unpurged backups at former vendors are frequent breach vectors.',
            'Trap: Treating vendor questionnaires (SIG/CAIQ) as verified truth. Self-attestation is weak evidence; corroborate Tier-1 claims with independent SOC 2 Type II / ISO 27001 reports.',
          ],
          keyTerms: [
            {
              term: 'Fourth-Party Risk',
              definition:
                'Risk arising from your vendors’ own subcontractors, subprocessors, and upstream software dependencies.',
            },
            {
              term: 'Concentration Risk',
              definition:
                'Systemic exposure created when multiple critical business processes depend on a single vendor, cloud region, or underlying technology.',
            },
            {
              term: 'Right-to-Audit Clause',
              definition:
                'Contractual provision granting the customer (or independent assessor) authority to inspect a vendor’s controls and compliance evidence.',
            },
            {
              term: 'C-SCRM (Cyber Supply Chain Risk Management)',
              definition:
                'NIST CSF 2.0 Govern category (GV.SC) managing cybersecurity risks across suppliers, software components, and service lifecycles.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d4-l1-q1',
              question:
                'Your company is subject to a 72-hour statutory breach notification law. When negotiating a Data Processing Agreement with a Tier-1 SaaS processor, what breach notification timeline should you require from the vendor?',
              options: [
                'Within 72 hours of final legal conclusion of their investigation',
                'Within 24 to 36 hours of becoming aware of a confirmed or suspected security incident affecting your data',
                'During the next quarterly business review',
                'No timeline is needed because the vendor is legally responsible for filing with your regulator',
              ],
              correctIndex: 1,
              rationale:
                'Because statutory accountability remains with your enterprise, you need notice well inside 72 hours (typically 24–36 hours) to investigate scope and file on time.',
            },
            {
              id: 'grc-d4-l1-q2',
              question:
                'Which evidence artifact provides the STRONGEST independent assurance during due diligence of a new Tier-1 cloud vendor?',
              options: [
                'A marketing whitepaper claiming "military-grade encryption"',
                'A self-completed 200-question vendor security questionnaire',
                'A current, unqualified SOC 2 Type II report covering relevant systems plus review of Complementary User Entity Controls (CUECs)',
                'A verbal reassurance from the vendor’s sales engineer',
              ],
              correctIndex: 2,
              rationale:
                'An independent, unqualified SOC 2 Type II report verifies control design and sustained operating effectiveness—and reviewing CUECs clarifies which security controls YOUR company must still implement.',
            },
          ],
          practicalDrill: {
            title: 'Tier-1 SaaS Vendor Security Addendum Checklist',
            prompt:
              'You are onboarding an AI-powered customer support SaaS vendor that will ingest live customer PII and chat transcripts.',
            steps: [
              'Assign the vendor’s Inherent Risk Tier and justify it using data sensitivity and business criticality.',
              'List 4 mandatory due-diligence artifacts to request prior to contract signature (including AI training opt-out confirmation).',
              'Draft 4 non-negotiable contractual clauses (Breach SLA, Subprocessor approval, Prohibition on training shared models on your data, Certified Data Deletion on exit).',
              'Identify 2 fourth-party concentration questions you will ask the vendor.',
            ],
            successCriteria:
              'Covers full lifecycle from pre-contract diligence through offboarding, explicitly protecting customer data from unauthorized AI model training.',
          },
          flashcards: [
            {
              front: 'What is the Golden Rule of Outsourcing in GRC?',
              back: 'You can outsource operational execution, but you can NEVER outsource ultimate accountability for risk and regulatory compliance.',
              tag: 'GRC-D4',
            },
            {
              front: 'What are Complementary User Entity Controls (CUECs) in a SOC 2 report?',
              back: 'Controls the customer organization MUST implement on its own side for the vendor’s control objectives to be fully achieved (e.g., configuring SSO and reviewing user roles).',
              tag: 'GRC-D4',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/grc1.pdf',
            'my_documents/nist-grc/nist1.pdf',
            'my_documents/nist-grc/rsk1.pdf',
          ],
        },
        {
          id: 'grc-d4-l2',
          title: 'Governing AI Risk (NIST AI RMF 1.0) & Evaluating GRC Platforms',
          estimatedMinutes: 45,
          summary:
            'Apply NIST AI RMF 1.0 (Govern, Map, Measure, Manage) and its 7 Trustworthy AI characteristics to enterprise AI systems, and apply Holmquist’s "Buyer Beware" discipline when selecting GRC software.',
          learningObjectives: [
            'Operationalize the four functions of NIST AI RMF 1.0: Govern, Map, Measure, and Manage.',
            'Evaluate AI systems against all seven NIST Trustworthy AI characteristics (Valid & Reliable, Safe, Secure & Resilient, Accountable & Transparent, Explainable & Interpretable, Privacy-Enhanced, Fair with Harmful Bias Managed).',
            'Identify high-risk enterprise AI failure modes: Shadow AI, training data leakage, prompt injection, hallucination liability, and algorithmic bias.',
            'Avoid common "Buyer Beware" traps when evaluating GRC software platforms (buying tools before defining processes).',
          ],
          coreConcepts: [
            {
              heading: 'NIST AI RMF 1.0 Core Functions (Govern, Map, Measure, Manage)',
              explanation:
                'Published as NIST AI 100-1 (stored in my_documents/nist-grc/nist ai 1.pdf), the NIST AI Risk Management Framework structures AI governance across four continuous functions. GOVERN (cross-cutting) establishes policies, accountability, legal alignment, and AI risk culture. MAP establishes deployment context, intended use, stakeholder impacts, and data provenance before build/buy. MEASURE applies quantitative and qualitative testing (red-teaming, bias metrics, drift monitoring, explainability checks) to evaluate AI trustworthiness. MANAGE prioritizes, treats, and monitors AI risks in production, including human-in-the-loop overrides and incident decommissioning triggers.',
              mentalModel:
                'AI Flight Governance: GOVERN = aviation regulations & pilot licensing; MAP = flight plan & weather risks; MEASURE = cockpit instruments & stress tests; MANAGE = in-flight course corrections & emergency landing protocol.',
              formulaOrRule:
                'NIST AI RMF Core = GOVERN (Cross-cutting foundation) guiding MAP -> MEASURE -> MANAGE.',
            },
            {
              heading: 'The 7 Characteristics of Trustworthy AI',
              explanation:
                'NIST AI RMF defines seven interdependent traits of trustworthy AI—with Valid & Reliable serving as the foundation and Accountable & Transparent spanning all others: (1) Valid and Reliable (accurate under real-world conditions), (2) Safe (no endangerment of human life, health, or property), (3) Secure and Resilient (resists adversarial attacks like prompt injection or poisoning), (4) Accountable and Transparent (clear ownership and disclosure), (5) Explainable and Interpretable (humans understand why an output was produced), (6) Privacy-Enhanced (minimizes PII exposure and inference attacks), and (7) Fair — with Harmful Bias Managed (prevents systemic, computational, and human-cognitive discrimination).',
              mentalModel:
                'Note the trade-offs: Maximizing model accuracy with a deep black-box network can reduce Explainability; strict Privacy noise (differential privacy) can reduce precision. GRC documents these trade-offs explicitly rather than ignoring them.',
            },
            {
              heading: 'Buyer Beware: Evaluating GRC Technology Platforms (Holmquist)',
              explanation:
                'As warned in Chapter 3 of grc1.pdf ("Buyer Beware: The Complexities of Evaluating GRC Solutions"), organizations frequently fail by buying an expensive monolithic GRC suite before defining their risk taxonomy, control catalog, and governance workflows. A GRC tool amplifies whatever process you put inside it—automating a broken process just produces chaos faster. Successful GRC platform selection starts with concrete use cases, data-model flexibility, API integrations for Continuous Controls Monitoring (CCM), reporting clarity for executives, and phased deployment.',
              mentalModel:
                'Never buy a $300,000 commercial kitchen before you have written your menu and recipes. Process -> Data Model -> Tool, ALWAYS in that order.',
              formulaOrRule:
                'GRC Implementation Order: 1. Governance Objectives & Process -> 2. Unified Taxonomy & Data Model -> 3. Platform Selection & Automation.',
            },
          ],
          realWorldScenario: {
            title: 'The Biased AI Hiring Screener',
            situation:
              'An enterprise HR department subscribes to a third-party resume-screening AI tool without notifying Legal or GRC ("Shadow AI"). Six months later, an internal diversity audit reveals the model systematically downgrades resumes containing women’s college names because it was trained on 10 years of historically male-dominated engineering hires.',
            analysis:
              'All four NIST AI RMF functions failed: GOVERN lacked an AI Acceptable Use Policy and procurement gate; MAP never evaluated protected-class impact or historical training bias; MEASURE performed zero pre-deployment fairness testing; MANAGE had no human-in-the-loop audit trail or kill-switch. Under modern AI governance (and frameworks like the EU AI Act, where employment screening is High-Risk AI), the deploying enterprise faces regulatory enforcement and discrimination lawsuits.',
            takeaway:
              'Buying AI from a third-party vendor does NOT absolve your enterprise of algorithmic bias, explainability, or privacy governance.',
          },
          examTraps: [
            'Trap: Treating NIST AI RMF "Govern" as a one-time phase completed only at project start. Govern is cross-cutting and continuous across Map, Measure, and Manage.',
            'Trap: Purchasing a GRC software tool as Step 1 of building a GRC program. Always design governance processes, roles, and risk taxonomy BEFORE procuring tooling.',
            'Trap: Assuming high statistical accuracy on test data guarantees a trustworthy AI model. A highly accurate model can still violate fairness, privacy, explainability, or adversarial security.',
          ],
          keyTerms: [
            {
              term: 'NIST AI RMF 1.0 (AI 100-1)',
              definition:
                'Voluntary NIST framework organizing trustworthy AI risk management across four functions: Govern, Map, Measure, and Manage.',
            },
            {
              term: 'Shadow AI',
              definition:
                'Unsanctioned adoption of generative or analytical AI tools by employees or business units outside governance, privacy, and security review.',
            },
            {
              term: 'Algorithmic Bias',
              definition:
                'Systemic, computational, or human-cognitive distortions causing an AI system to produce unfair or discriminatory outcomes.',
            },
            {
              term: 'Model Drift',
              definition:
                'Degradation of an AI model’s predictive accuracy or fairness over time as real-world input data diverges from training distributions.',
            },
          ],
          conceptChecks: [
            {
              id: 'grc-d4-l2-q1',
              question:
                'A bank wants to deploy an LLM chatbot to advise retail customers on loan eligibility. Under NIST AI RMF 1.0, which function focuses on red-teaming the model for prompt injection, hallucination rates, and demographic bias BEFORE launch?',
              options: [
                'Govern',
                'Map',
                'Measure',
                'Retire',
              ],
              correctIndex: 2,
              rationale:
                'Measure employs quantitative, qualitative, and red-teaming evaluations to assess AI trustworthiness metrics (accuracy, bias, adversarial resilience, explainability) before and during deployment.',
            },
            {
              id: 'grc-d4-l2-q2',
              question:
                'An executive asks you to immediately issue an RFP for an enterprise GRC software suite to fix inconsistent risk reporting across five subsidiaries. What should you do FIRST?',
              options: [
                'Select the vendor with the highest number of pre-built compliance templates',
                'Establish a unified risk taxonomy, governance roles, and core reporting processes across the subsidiaries before selecting a tool',
                'Allow each subsidiary to buy its own separate GRC tool to move faster',
                'Eliminate internal audit reviews until the software goes live',
              ],
              correctIndex: 1,
              rationale:
                'Automating fragmented processes and inconsistent scoring scales inside a GRC suite guarantees failed adoption. Define harmonized taxonomy, governance ownership, and workflows first, then choose tooling that supports them.',
            },
          ],
          practicalDrill: {
            title: 'AI Governance Pre-Deployment Review (NIST AI RMF)',
            prompt:
              'Conduct a pre-launch NIST AI RMF intake review for an internal GenAI assistant that summarizes customer support tickets and drafts refund recommendations.',
            steps: [
              'Govern: Define who owns AI risk sign-off and list 2 rules for the enterprise AI Acceptable Use Policy.',
              'Map: Document intended use, prohibited out-of-scope uses, and PII/data-leakage boundaries.',
              'Measure: Define 3 pre-launch evaluation metrics (e.g., hallucination rate on refund policy, prompt-injection resistance, demographic fairness).',
              'Manage: Design a human-in-the-loop approval threshold (e.g., refunds > $100) and a rollback trigger if drift exceeds tolerance.',
            ],
            successCriteria:
              'Every NIST AI RMF function produces an auditable artifact with clear human accountability and concrete kill-switch criteria.',
          },
          flashcards: [
            {
              front: 'What are the 4 core functions of NIST AI RMF 1.0?',
              back: 'Govern (cross-cutting foundation), Map (context & impacts), Measure (testing & metrics), and Manage (risk response & monitoring).',
              tag: 'GRC-D4',
            },
            {
              front: 'Name the 7 NIST AI RMF characteristics of Trustworthy AI.',
              back: 'Valid & Reliable, Safe, Secure & Resilient, Accountable & Transparent, Explainable & Interpretable, Privacy-Enhanced, and Fair (with harmful bias managed).',
              tag: 'GRC-D4',
            },
            {
              front: 'What is the #1 "Buyer Beware" rule when adopting a GRC platform?',
              back: 'Define your governance process, risk taxonomy, and unified control framework BEFORE purchasing GRC software—tools amplify existing processes.',
              tag: 'GRC-D4',
            },
          ],
          sourceRefs: [
            'my_documents/nist-grc/nist ai 1.pdf',
            'my_documents/nist-grc/grc1.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Capstone: Turning Around Enterprise GRC at Meridian HealthTech',
    scenario:
      'Meridian HealthTech is a newly public digital health company operating across the US and EU. Following rapid acquisitions, it faces four simultaneous crises: (1) External SOX 404 auditors flagged unapproved developer changes in the billing ERP and 18% orphaned accounts after terminations; (2) Engineering spends 1,200 hours/year repeating manual evidence collection for HIPAA, SOC 2 Type II, ISO 27001, and GDPR; (3) Sales deployed an unvetted third-party AI diagnostic triage widget handling live patient symptoms; and (4) The Board Audit Committee complains that quarterly risk decks contain 40 pages of raw vulnerability scan graphs without answering whether Meridian is operating inside its risk appetite.',
    tasks: [
      'Restructure governance accountability using the IIA Three Lines Model, specifying direct Board Committee escalation lines and fixing executive oversight blind spots.',
      'Diagnose the SOX 404 ERP deficiencies (ToD vs. ToE, ITGC pillar, Material Weakness threshold) and design immediate compensating + permanent remediation controls.',
      'Architect a Unified Control Framework ("test once, comply many") plus NIST SP 800-37 Rev 2 continuous authorization workflow across HIPAA, SOC 2, ISO 27001, and GDPR.',
      'Execute a rapid NIST AI RMF (Govern/Map/Measure/Manage) and TPRM intervention on the third-party AI triage widget, including contractual DPA/breach-SLA clauses.',
      'Replace the 40-page technical slide deck with a 1-page Board Risk Scorecard containing 4 leading KRIs tied directly to Risk Appetite and Risk Tolerance thresholds.',
    ],
    modelSolution:
      '1) Governance & Three Lines: Establish a dual-reporting Chief Risk/Compliance Officer (functional access to Board Risk Committee) and independent Chief Audit Executive (reporting functionally to Audit Committee). Require 1st-line business/engineering VPs to sign risk ownership charters; prohibit Internal Audit from configuring ERP controls.\n2) SOX 404 Remediation: Classify unapproved developer production access (Change Management ITGC) and 18% terminated-user access (Logical Access ITGC) as potential Material Weaknesses because automated billing controls cannot be relied upon. Immediately revoke developer prod access, enforce automated HR-to-IdP deprovisioning, deploy a detective monthly post-termination activity reconciliation, and track closure via a POA&M before year-end testing.\n3) Compliance Harmonization & RMF: Consolidate overlapping HIPAA/SOC 2/ISO 27001/GDPR obligations into ~140 Unified Controls mapped in a central cross-walk and wire API-based Continuous Controls Monitoring (IdP, CI/CD, CSPM) to eliminate manual screenshot sampling. Apply NIST SP 800-37 Rev 2 (FIPS 199 High-Water Mark = High for PHI clinical systems) with formal SSP, independent SAR, and AO-signed ATO.\n4) AI & TPRM Containment: Immediately pause live PHI ingestion into the unvetted AI widget until TPRM Tier-1 diligence completes (SOC 2 Type II, HIPAA BAA, GDPR DPA with 24-hour breach notification, explicit ban on training shared models on Meridian PHI, and NIST AI RMF Measure testing for clinical safety, bias, and hallucination limits with physician-in-the-loop review).\n5) Board Scorecard: Replace scan graphs with four Red/Amber/Green leading KRIs: (a) % Tier-1 systems with verified immutable backup recovery, (b) % ERP changes following enforced CI/CD approval gates, (c) Mean time to revoke terminated identities (<24h tolerance), and (d) Count of Tier-1/AI vendors operating with open Critical findings—paired with explicit capital-allocation decisions for the Board.',
  },
  examStrategy: {
    examFormat:
      'Scenario-based GRC practitioner assessment combining framework synthesis (OCEG, COSO, ISO 31000/Guide 73, NIST SP 800-37 Rev 2, NIST CSF 2.0, NIST AI RMF 1.0, SOX 404/ITGC, TPRM) with quantitative ALE/ROI and governance judgment questions.',
    timeManagementPlan:
      'Allocate 90 seconds per scenario question. Spend the first 20 seconds identifying WHICH role is being tested (Board vs. 1st Line Owner vs. 2nd Line GRC vs. 3rd Line Internal Audit) and WHAT stage of the lifecycle the prompt describes (e.g., RMF Prepare vs. Assess vs. Authorize). Flag calculation questions (SLE/ALE) for a quick verification pass.',
    mindsetRules: [
      'Business Alignment First: GRC exists to enable Principled Performance—never choose an answer that blocks business unnecessarily when proportionate risk treatment exists.',
      'Protect Accountability Lines: 1st Line owns operational risk; 2nd Line advises/challenges; 3rd Line (Audit) provides independent assurance; Board approves Enterprise Risk Appetite.',
      'Process Before Tooling: Always choose defining taxonomy, policies, and governance processes BEFORE buying GRC software.',
      'Leading Beats Lagging: When asked for the BEST KRI, prefer forward-looking predictive indicators of rising risk over counts of past incidents or raw alert volume.',
      'Accountability Never Outsources: Vendors execute tasks, but statutory and reputational accountability always stays with your organization.',
      'High-Water Mark & Independent Evidence: Use FIPS 199 maximum impact (never average) and prefer independent Type II attestations over self-reported questionnaires.',
    ],
    finalWeekChecklist: [
      'Recite all 7 steps of NIST SP 800-37 Rev 2 (Prepare -> Monitor) and the 3 Authorization Package artifacts (SSP, SAR, POA&M) from memory.',
      'Drill SLE/ALE/ROI math until you solve control cost-benefit questions accurately in under 45 seconds.',
      'Review the exact differences between Risk Capacity, Risk Appetite, and Risk Tolerance, plus KRI vs. KPI vs. KCI.',
      'Verify mastery of Policy vs. Standard vs. Baseline vs. Procedure vs. Guideline and valid Policy Exception criteria.',
      'Review SOX 404 ITGC pillars, Design vs. Operating Effectiveness, and Control Deficiency -> Significant Deficiency -> Material Weakness.',
      'Walk through NIST AI RMF 1.0 (Govern, Map, Measure, Manage) and the 7 Trustworthy AI characteristics.',
    ],
  },
};
