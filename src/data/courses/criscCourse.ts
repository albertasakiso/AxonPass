/* ===================================================================
   ANOXPASS — End-to-End Certification Course: ISACA CRISC (7th Ed)
   Certified in Risk and Information Systems Control — 4-Domain Mastery
   Grounded in my_documents/CRISC Review Manual.pdf, CRISC Exam Study
   Guide.pdf, Crisc Q A.pdf & Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf.
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const CRISC_COURSE: CertificationCourse = {
  certId: 'crisc',
  certCode: 'CRISC',
  title: 'ISACA Certified in Risk and Information Systems Control (CRISC 7th Ed)',
  provider: 'ISACA',
  tier: 3,
  tagline:
    'Master ISACA’s Risk IT practitioner mindset across Governance, IT Risk Assessment, Risk Response & Reporting (32%), and IT/Security Controls.',
  estimatedTotalHours: 95,
  passingScore: '450 / 800 (Scaled Score — 150 questions in 240 minutes)',
  domains: [
    // =================================================================
    // DOMAIN 1: Governance (26%)
    // =================================================================
    {
      id: 'crisc-d1',
      domainNumber: 1,
      title: 'Governance',
      examWeightPercent: 26,
      overview:
        'Covers organizational and IT risk governance structures, the Three Lines Model, Board Risk Appetite vs. Risk Tolerance vs. Capacity, Risk Culture & Behavior, ethical leadership, and legal/regulatory/third-party governance.',
      lessons: [
        {
          id: 'crisc-d1-l1',
          title: 'Organizational & Risk Governance, Three Lines & Risk Ownership Accountability',
          estimatedMinutes: 45,
          summary:
            'Internalize the core CRISC governance truth: IT risk IS business risk—learn exactly how the Board, Risk Committee, Risk Owner, Control Owner, and Risk Practitioner divide accountability under ISACA’s Risk IT Framework 2nd Edition.',
          learningObjectives: [
            'Explain ISACA Risk IT 2nd Edition’s three core governance/management domains: Risk Governance (RG), Risk Evaluation (RE), and Risk Response (RR).',
            'Assign exact RACI accountability across Board of Directors, Business Risk Owner, Control Owner, Risk Practitioner (CRISC), and Internal Audit.',
            'Differentiate Risk Governance (Board direction and oversight) from Risk Management (operational identification, analysis, and response).',
            'Align IT risk governance directly to enterprise business goals, strategy, and stakeholder value creation.',
          ],
          coreConcepts: [
            {
              heading: 'ISACA Risk IT Framework (2nd Edition) & Business Alignment',
              explanation:
                'ISACA’s Risk IT Framework bridges the dangerous gap between generic Enterprise Risk Management (ERM) and technical IT risk silos. IT risk is NOT merely technical downtime or cyber hacking—it includes missed business value ("benefit/value enablement risk"), delayed IT projects ("program/project delivery risk"), and day-to-day IT failures ("operations & service delivery risk"). Risk IT aligns with COBIT 2019 across three domains: Risk Governance (RG — integrate with ERM, make risk-aware business decisions), Risk Evaluation (RE — collect data, analyze risk, maintain risk profile), and Risk Response (RR — articulate risk, manage risk, react to events).',
              mentalModel:
                'Risk IT acts as the universal translator connecting the server room to the boardroom so IT risk is never managed in an isolated technical bubble.',
              formulaOrRule:
                '3 Categories of IT Risk (Risk IT): 1. IT Benefit/Value Enablement Risk | 2. IT Program & Project Delivery Risk | 3. IT Operations & Service Delivery Risk.',
            },
            {
              heading: 'The CRISC Accountability Quartet (Most Tested Role Distinction!)',
              explanation:
                'CRISC exam questions relentlessly test WHO owns WHAT—memorize these four roles cold:\n• Board of Directors / Governing Body: Ultimate oversight authority; approves Enterprise Risk Appetite and overall risk strategy.\n• Risk Owner (ALWAYS a Senior Business Executive/Manager with authority and budget!): Accountable for the specific risk, decides whether to mitigate/accept/avoid/transfer, and funds treatment.\n• Control Owner (Often IT/Ops/Business Manager): Responsible for implementing, operating, and maintaining the specific control mitigating the risk.\n• Risk Practitioner (YOU — the CRISC!): Facilitates risk assessments, maintains the Risk Register, advises Risk Owners objectively, aggregates enterprise risk profiles, and monitors KRIs—NEVER unilaterally accepts risk or owns business controls!',
              mentalModel:
                'Hospital analogy: Patient/Family (Risk Owner) decides whether to undergo risky surgery; Surgeon (Control Owner) performs the operation; Risk Practitioner (Medical Advisor) presents accurate odds and tracks recovery vitals.',
              formulaOrRule:
                'Risk Acceptance Authority = Risk Owner (within Board Risk Appetite) — NEVER the Risk Practitioner, NEVER IT Admin, NEVER Internal Audit!',
            },
          ],
          realWorldScenario: {
            title: 'The Risk Manager Asked to Sign Off on a High-Risk Launch',
            situation:
              'A VP of Digital Commerce wants to launch a new mobile checkout app before a major holiday weekend despite three unresolved High-rated API authentication vulnerabilities. To speed things up, the VP emails the CRISC Risk Practitioner: "Please sign this risk acceptance memo so we can launch tonight."',
            analysis:
              'Classic CRISC exam trap! The Risk Practitioner (2nd Line) NEVER signs risk acceptances—doing so transfers operational risk accountability away from the business and compromises objective oversight. Instead, the Risk Practitioner documents the quantified business exposure in the Risk Register, confirms whether residual risk exceeds Board-approved Risk Appetite (requiring executive/Board escalation if above appetite), and requires the accountable Business Risk Owner (VP/Executive Sponsor) to formally sign any within-appetite risk acceptance.',
            takeaway:
              'On CRISC, the Risk Practitioner advises, quantifies, documents, and escalates—ONLY the Risk Owner (or Board, if above appetite) can accept risk!',
          },
          examTraps: [
            'Trap: Picking "IT Manager" or "Risk Practitioner" as the Risk Owner for a customer payment system. The Risk Owner MUST be the Business Process Owner / Senior Business Executive who owns the business value and budget.',
            'Trap: Confusing Control Owner with Risk Owner. One business Risk Owner may rely on three different IT Control Owners (Network, IAM, DBA) to operate safeguards—ultimate risk accountability stays with the single Risk Owner!',
            'Trap: Viewing IT Risk purely as cybersecurity attacks. Remember Risk IT’s three categories: missed business opportunity (value enablement) and failed IT projects are also IT risks!',
          ],
          keyTerms: [
            {
              term: 'Risk Owner',
              definition:
                'Accountable business executive or manager with authority and budget to manage a risk, select response options, and formally accept residual risk within appetite.',
            },
            {
              term: 'Control Owner',
              definition:
                'Operational or technical manager responsible for designing, operating, testing, and maintaining specific controls that mitigate a risk.',
            },
            {
              term: 'Risk Profile',
              definition:
                'Aggregate snapshot of all current enterprise risks, their likelihood/impact ratings, treatment status, and alignment with risk appetite.',
            },
            {
              term: 'Risk IT Framework',
              definition:
                'ISACA framework integrating IT-related business risk into Enterprise Risk Management across Governance, Evaluation, and Response.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d1-l1-q1',
              question:
                'A critical SaaS CRM migration has an unresolved residual risk that sits WITHIN the organization’s board-approved Risk Appetite. Who holds the proper authority to formally sign off on accepting this residual risk?',
              options: [
                'The Enterprise IT Risk Practitioner (CRISC)',
                'The Chief Audit Executive (Internal Audit)',
                'The Accountable Business Risk Owner (e.g., VP of Sales / CRM Business Sponsor)',
                'The Database Administrator implementing the migration',
              ],
              correctIndex: 2,
              rationale:
                'Only the accountable Business Risk Owner has authority to accept residual risk within board-approved appetite. If residual risk EXCEEDS appetite, it must escalate to Senior Leadership / Board.',
            },
            {
              id: 'crisc-d1-l1-q2',
              question:
                'Which statement BEST reflects the relationship between IT Risk and Enterprise Risk Management (ERM) under ISACA’s Risk IT Framework?',
              options: [
                'IT risk is strictly a technical concern delegated entirely to the CIO',
                'IT risk is a subset of business risk encompassing value enablement, project delivery, and operations, and must be fully integrated into ERM',
                'IT risk only arises when external cyber attackers breach firewalls',
                'IT risk governance replaces corporate governance in technology companies',
              ],
              correctIndex: 1,
              rationale:
                'Risk IT emphasizes that IT risk IS business risk across value enablement, project delivery, and operations, and must integrate seamlessly into ERM.',
            },
          ],
          practicalDrill: {
            title: 'CRISC RACI & Risk-vs-Control Ownership Matrix',
            prompt:
              'Assign R, A, C, I (with exactly ONE "A" per row!) for an enterprise ERP upgrade across Board, Business Risk Owner, IT Control Owner, Risk Practitioner, and Internal Audit.',
            steps: [
              'Row 1: Approve Enterprise Risk Appetite Statement.',
              'Row 2: Facilitate IT Risk Assessment Workshop and update Risk Register.',
              'Row 3: Select Risk Response and Sign Residual Risk Acceptance (within appetite).',
              'Row 4: Implement MFA & ERP Patch Controls and track daily KCI compliance.',
              'Row 5: Independently audit whether risk governance and controls are effective.',
            ],
            successCriteria:
              'Single Accountable ("A") per row: 1=Board, 2=Risk Practitioner, 3=Business Risk Owner, 4=IT Control Owner, 5=Internal Audit.',
          },
          flashcards: [
            {
              front: 'What is the crucial difference between a Risk Owner and a Control Owner on CRISC?',
              back: 'The Risk Owner (business executive) is accountable for the risk, budget, and risk-response/acceptance decisions; the Control Owner is responsible for implementing and operating a specific mitigating control.',
              tag: 'CRISC-D1',
            },
            {
              front: 'What are ISACA Risk IT’s three categories of IT risk?',
              back: '1. IT Benefit/Value Enablement Risk, 2. IT Program & Project Delivery Risk, and 3. IT Operations & Service Delivery Risk.',
              tag: 'CRISC-D1',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
          ],
        },
        {
          id: 'crisc-d1-l2',
          title: 'Risk Appetite, Tolerance, Capacity & Building a Resilient Risk Culture',
          estimatedMinutes: 45,
          summary:
            'Calibrate enterprise Risk Capacity, Risk Appetite, and Risk Tolerance with surgical precision, and diagnose organizational Risk Culture enablers and inhibitors (risk-taking vs. risk-averse vs. risk-neutral behaviors).',
          learningObjectives: [
            'Differentiate Risk Capacity, Risk Appetite, Risk Tolerance, and Risk Thresholds across strategic and operational scenarios.',
            'Evaluate factors shaping organizational Risk Culture (leadership tone, bad-news tolerance, accountability, incentives, communication).',
            'Diagnose toxic risk-culture failure patterns such as "shoot the messenger," blame cultures, and incentive misalignment.',
          ],
          coreConcepts: [
            {
              heading: 'Risk Capacity, Appetite & Tolerance Precision Boundaries',
              explanation:
                'CRISC examines how risk boundaries steer decisions:\n• Risk Capacity: Objective financial/operational ceiling an enterprise can endure without failing (bankruptcy, license revocation).\n• Risk Appetite: Broad, Board-approved amount of risk an enterprise WILLINGLY takes to generate value (can vary by domain—e.g., High appetite for R&D innovation, Near-Zero appetite for regulatory non-compliance or safety failure!).\n• Risk Tolerance: Acceptable tactical variance around specific business objectives/metrics operationalizing Appetite (e.g., "Target 99.9% uptime with tolerance down to 99.7% before executive intervention").\nCrucial Rule: If a residual risk exceeds Risk Tolerance -> notify Risk Owner and deploy mitigation. If a residual risk exceeds Board Risk Appetite -> MUST escalate to Senior Management / Board (cannot be silently accepted by a department head!).',
              mentalModel:
                'Tightrope over a canyon: Capacity = rope breaking strength (1,000 lbs); Appetite = max load policy (600 lbs); Tolerance = live wind-sway band (+/- 10%) triggering an immediate pause.',
              formulaOrRule:
                'Residual Risk > Risk Appetite -> Mandatory Escalation to Executive Leadership / Board (Cannot be locally accepted!).',
            },
            {
              heading: 'Risk Culture: The Invisible Make-or-Break Factor',
              explanation:
                'Even the sharpest Risk Register collapses inside a dysfunctional Risk Culture. ISACA’s Risk IT highlights four pillars of healthy Risk Culture: (1) Behavior toward Negative News (does leadership reward early risk escalation, or punish/silence bearers of bad news?); (2) Risk-Aware Decision Making (do business units consult risk data before launching products, or treat risk as a bureaucratic hurdle?); (3) Consistent Accountability & Incentives (do bonuses reward sustainable risk-adjusted profit, or reckless short-term volume?); and (4) Clear Tone at the Top & Open Communication across silos.',
              mentalModel:
                'If the first employee who flags a critical project delay gets blamed and sidelined, every other employee will hide red flags until the entire project explodes.',
            },
          ],
          realWorldScenario: {
            title: 'The "Always-Green" Project Portfolio Culture',
            situation:
              'A global bank’s IT transformation dashboard shows 28 of 30 strategic initiatives glowing "Green" every month—until two core projects suddenly collapse 6 weeks before regulatory deadlines, incurring $15M in fines. Anonymous staff surveys reveal managers feared being humiliated in executive reviews for reporting "Amber" or "Red" risks.',
            analysis:
              'This is the textbook "Watermelon Project" (green on the outside, red inside) caused by a punitive Risk Culture that punishes bad news. Fixing the reporting template won’t fix the culture—leadership must visibly reward early transparent escalation, tie leadership evaluations to accurate risk transparency, create psychological safety, and empower independent 2nd-line challenge.',
            takeaway:
              'On CRISC, the #1 symptom of a broken Risk Culture is hiding bad news, bypassing policies, or treating risk teams as enemies rather than partners.',
          },
          examTraps: [
            'Trap: Assuming an organization must have ONE uniform risk appetite across every activity. Enterprises deliberately hold DIFFERENT risk appetites across categories (e.g., High for new product experimentation, Low/Zero for regulatory/fraud/safety).',
            'Trap: Confusing Risk Appetite (strategic/broad willingness to take risk) with Risk Tolerance (specific measurable variance around an objective).',
            'Trap: Thinking "Risk Awareness Training" alone fixes a toxic Risk Culture when executive bonuses still reward reckless shortcuts. Tone at the top and incentive alignment come FIRST!',
          ],
          keyTerms: [
            {
              term: 'Risk Culture',
              definition:
                'Collective norms, attitudes, behaviors, and incentives determining how individuals across an enterprise identify, escalate, and act upon risk.',
            },
            {
              term: 'Risk Appetite Statement',
              definition:
                'Formal board-approved articulation of the types and aggregate amounts of risk an enterprise is willing to accept to achieve strategic goals.',
            },
            {
              term: 'Risk Threshold',
              definition:
                'Specific quantitative trigger level aligned to risk tolerance that mandates management notification or corrective intervention when crossed.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d1-l2-q1',
              question:
                'During quarterly risk reviews, a CRISC practitioner notices that business unit leaders routinely conceal known operational defects until audit discovers them. What is the MOST fundamental underlying governance weakness?',
              options: [
                'Outdated SIEM log retention settings',
                'A punitive or immature Risk Culture that discourages transparent escalation of bad news',
                'Insufficient encryption key length on corporate laptops',
                'Failure to purchase cyber liability insurance',
              ],
              correctIndex: 1,
              rationale:
                'Concealing risks until forced by audit directly reflects a weak/punitive Risk Culture where leadership fails to encourage and reward open risk communication.',
            },
            {
              id: 'crisc-d1-l2-q2',
              question:
                'A proposed cloud AI product carries a residual privacy risk quantified above the Board’s approved Risk Appetite, even though the product VP believes revenue upside is huge. What MUST happen next?',
              options: [
                'The product VP signs local acceptance and launches immediately',
                'The Risk Practitioner lowers the risk score so it fits inside appetite',
                'The risk must be further mitigated below appetite OR formally escalated to the Board / Executive Risk Committee for an explicit appetite exception or avoidance decision',
                'Internal Audit modifies the Board’s Risk Appetite statement',
              ],
              correctIndex: 2,
              rationale:
                'No single department head or practitioner may unilaterally accept residual risk above Board Risk Appetite—it must be mitigated down or escalated to the Governing Body.',
            },
          ],
          practicalDrill: {
            title: 'Diagnose & Repair Risk Culture & Appetite Statements',
            prompt:
              'Write a multi-domain Risk Appetite table and a 3-step Risk Culture turnaround plan.',
            steps: [
              'Draft tailored Appetite levels (Zero/Low/Moderate/High) + 1 measurable Tolerance guardrail for: (a) Regulatory Compliance, (b) Product Innovation, (c) Core System Availability.',
              'Identify 3 leading cultural indicators showing whether staff trust escalation channels (e.g., anonymous survey scores, voluntary self-identified risk rate, policy exception compliance).',
              'Specify how executive compensation adjustments reinforce healthy risk behavior.',
            ],
            successCriteria:
              'Differentiated domain appetites, concrete quantitative tolerances, and incentive-backed cultural remedies.',
          },
          flashcards: [
            {
              front: 'Can an enterprise have different Risk Appetites for different risk categories?',
              back: 'Yes! For example, an enterprise may set High appetite for R&D innovation while maintaining Low/Near-Zero appetite for regulatory compliance or human safety.',
              tag: 'CRISC-D1',
            },
            {
              front: 'What is the #1 indicator of a healthy Risk Culture under ISACA Risk IT?',
              back: 'Transparent, blameless early escalation of bad news/risks supported by consistent Tone at the Top and risk-aligned incentives.',
              tag: 'CRISC-D1',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
          ],
        },
        {
          id: 'crisc-d1-l3',
          title: 'Legal, Regulatory, Ethical & Third-Party Risk Governance',
          estimatedMinutes: 40,
          summary:
            'Navigate global regulatory compliance risk, cross-border legal exposure, ethical obligations of the risk practitioner, and enterprise governance over third-party and cloud supply chains.',
          learningObjectives: [
            'Integrate regulatory, contractual, and statutory obligations (GDPR, HIPAA, SOX, PCI DSS, DORA) into the enterprise risk profile.',
            'Apply ISACA’s Code of Professional Ethics when facing executive pressure to suppress or understate risk findings.',
            'Govern third-party/vendor risk holistically—covering inherent risk tiering, SLAs, SOC 2 Type II/CUECs, fourth-party concentration, and exit resilience.',
          ],
          coreConcepts: [
            {
              heading: 'Compliance vs. Risk Management & Regulatory Horizon Scanning',
              explanation:
                'Compliance is necessary—but NEVER sufficient—for risk management. You can be 100% compliant with an outdated checklist and still suffer a company-ending breach. However, non-compliance IS a severe IT/business risk triggering regulatory fines, operational bans, and lawsuits. Mature governance runs continuous Regulatory Horizon Scanning across all jurisdictions where the enterprise operates or holds customer data, translating new laws into control baselines BEFORE effective deadlines.',
              mentalModel:
                'Compliance is passing the driver’s license test; Risk Management is staying alive on an icy mountain highway at night.',
            },
            {
              heading: 'Third-Party Risk Governance & Ethical Integrity',
              explanation:
                'Outsourcing a business function transfers day-to-day operational work to a vendor, NEVER ultimate accountability or legal liability! Risk governance demands pre-contract due diligence (verifying financial stability, security posture, independent SOC 2 Type II/ISO 27001 reports, and Complementary User Entity Controls), binding contractual protections (Right to Audit, breach notification inside statutory windows, subprocessor flow-downs, exit/data-return plans), and continuous vendor monitoring. Ethically, a CRISC practitioner must maintain strict objectivity, protect confidential client data, disclose conflicts of interest, and never misrepresent risk data even under executive pressure.',
              mentalModel:
                'You can hire a chauffeur to drive your car, but if they run a red light with your company logo on the door, your firm still takes the lawsuit and brand damage.',
            },
          ],
          realWorldScenario: {
            title: 'Cloud Concentration Risk Across Three "Independent" Vendors',
            situation:
              'A regional airline’s vendor risk audit reveals that its separate Crew Scheduling SaaS, Passenger Check-In SaaS, and Baggage Routing SaaS all run exclusively inside a single AWS US-East region managed by the same small fourth-party DevOps integrator.',
            analysis:
              'Individual vendor reviews looked clean on paper, but enterprise-level third-party governance exposed severe Fourth-Party & Geographic Concentration Risk: one regional outage or one compromised DevOps vendor halts the entire airline simultaneously. Risk governance must map fourth-party dependencies, mandate multi-region resilience in Tier-1 SLAs, and maintain tested manual/alternate failover plans.',
            takeaway:
              'Always look past individual vendor scorecards to aggregate enterprise concentration and fourth-party cascade risk.',
          },
          examTraps: [
            'Trap: Assuming a liability-cap clause or vendor SLA eliminates your company’s regulatory accountability. Statutory accountability NEVER transfers to a vendor.',
            'Trap: Overlooking Complementary User Entity Controls (CUECs) inside a vendor’s clean SOC 2 Type II report—if YOUR team fails to implement CUECs, the vendor’s control guarantee is invalid!',
          ],
          keyTerms: [
            {
              term: 'Complementary User Entity Controls (CUECs)',
              definition:
                'Security and operational controls documented in a SOC 2 report that the customer organization must implement for the vendor’s controls to work effectively.',
            },
            {
              term: 'Fourth-Party / Concentration Risk',
              definition:
                'Systemic risk arising when multiple critical third-party vendors depend on the same underlying subprocessor, software component, or cloud region.',
            },
            {
              term: 'Right-to-Audit Clause',
              definition:
                'Contractual right enabling an organization or independent assessor to verify a vendor’s control effectiveness and compliance evidence.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d1-l3-q1',
              question:
                'An enterprise outsources its entire customer identity and payroll operations to a global cloud provider under a strict SLA with financial penalty credits. Who remains ultimately accountable to regulators if customer personal data is breached?',
              options: [
                'The cloud provider exclusively',
                'The enterprise (outsourcing organization) retains ultimate accountability',
                'The external penetration testing firm',
                'The enterprise’s cyber insurance broker',
              ],
              correctIndex: 1,
              rationale:
                'Operations can be outsourced, but ultimate legal, regulatory, and reputational accountability ALWAYS remains with the outsourcing enterprise.',
            },
            {
              id: 'crisc-d1-l3-q2',
              question:
                'When reviewing a Tier-1 SaaS vendor’s unqualified SOC 2 Type II report, which section MUST the CRISC practitioner check carefully to confirm what controls their OWN company is obligated to operate?',
              options: [
                'The vendor’s marketing history',
                'Complementary User Entity Controls (CUECs)',
                'The auditor’s travel expenses',
                'Hardware serial numbers of retired servers',
              ],
              correctIndex: 1,
              rationale:
                'CUECs explicitly list the customer-side controls (such as enforcing SSO/MFA, reviewing user roles, and revoking terminated users) required for the vendor’s SOC 2 assurances to hold true.',
            },
          ],
          practicalDrill: {
            title: 'Third-Party Concentration & CUEC Audit Exercise',
            prompt:
              'Inspect a 3-vendor SaaS portfolio for hidden governance gaps.',
            steps: [
              'List 4 mandatory pre-contract TPRM due diligence items for a Tier-1 payment processor.',
              'Identify 3 common CUECs your internal IT team must verify after reading a vendor’s SOC 2 Type II report.',
              'Define an Exit Strategy checklist covering data portability, cryptographic erasure certification, and API key revocation.',
            ],
            successCriteria:
              'Covers pre-contract, ongoing monitoring, CUEC assignment, fourth-party mapping, and clean termination/exit controls.',
          },
          flashcards: [
            {
              front: 'Does purchasing cyber insurance or signing a strict vendor SLA transfer legal/regulatory accountability?',
              back: 'No! Insurance transfers financial loss (partially) and SLAs define remedies, but ultimate accountability ALWAYS stays with the enterprise.',
              tag: 'CRISC-D1',
            },
            {
              front: 'Why is Compliance NOT equivalent to effective Risk Management?',
              back: 'Compliance verifies adherence to a minimum point-in-time baseline, whereas Risk Management continuously aligns dynamic threats and uncertainty to strategic business objectives.',
              tag: 'CRISC-D1',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/CRISC Exam Study Guide.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: IT Risk Assessment (20%)
    // =================================================================
    {
      id: 'crisc-d2',
      domainNumber: 2,
      title: 'IT Risk Assessment',
      examWeightPercent: 20,
      overview:
        'Master systematic IT risk identification (threats, vulnerabilities, assets, top-down vs. bottom-up Risk IT Scenarios) and rigorous risk analysis/evaluation (Qualitative, Semi-Quantitative, Quantitative SLE/ARO/ALE, FAIR, Delphi, Bow-Tie, FMEA).',
      lessons: [
        {
          id: 'crisc-d2-l1',
          title: 'IT Risk Identification, Threat/Vulnerability Modeling & Risk Scenarios',
          estimatedMinutes: 45,
          summary:
            'Construct vivid, actionable IT Risk Scenarios combining ISACA’s six scenario components using both Top-Down (business-objective driven) and Bottom-Up (technical-vulnerability driven) approaches.',
          learningObjectives: [
            'Distinguish Asset, Threat Actor, Threat Event, Vulnerability, Likelihood, and Business Impact cleanly.',
            'Build complete Risk IT Scenarios covering Actor, Threat Type, Event, Asset/Resource, Timing, and Business Effect.',
            'Combine Top-Down (business objectives -> IT risks) and Bottom-Up (generic scenario lists/vulnerabilities -> business impacts) identification for 360-degree coverage.',
            'Select structured elicitation techniques (Delphi Method, Brainstorming, Checklists, Interviews, Bow-Tie Analysis, Root Cause Analysis) without groupthink bias.',
          ],
          coreConcepts: [
            {
              heading: 'Anatomy of a Crisp IT Risk Scenario (Risk IT Core Skill!)',
              explanation:
                'Writing "Ransomware" or "Outdated server" in a Risk Register is useless—those are a threat and a vulnerability, NOT a risk! A proper ISACA IT Risk Scenario links cause to business consequence across six elements: (1) Threat Actor (internal/external, malicious/accidental), (2) Threat Type (malicious, failure, human error, natural), (3) Event (disclosure, interruption, modification, theft, ineffective design), (4) Asset/Resource impacted (people, apps, infrastructure, data, vendor), (5) Timing/Duration (peak holiday vs. idle weekend; short vs. extended), and (6) Business Consequence (lost revenue, regulatory fine, patient harm). Example: "An external ransomware group exploits an unpatched VPN gateway during Q4 peak shipping, encrypting warehouse ERP databases for 72 hours, causing $4.5M in lost orders and SLA penalties."',
              mentalModel:
                'Risk Scenario sentence template: "[WHO/WHAT] exploits [VULNERABILITY] causing [EVENT] on [ASSET] during [TIMING], resulting in [MEASURABLE BUSINESS IMPACT]."',
              formulaOrRule:
                'Risk requires ALL THREE: Threat + Vulnerability + Business Impact on an Asset (Missing any one = negligible risk!).',
            },
            {
              heading: 'Top-Down vs. Bottom-Up Identification & the Delphi Method',
              explanation:
                'Great CRISC practitioners combine two lenses:\n• Top-Down Approach: Starts with overall enterprise business objectives and asks "What IT events could derail our strategic goals?" (Ensures alignment with executive priorities; might miss obscure technical flaws).\n• Bottom-Up Approach: Starts with generic technical risk lists, vulnerability scans, audit findings, and incident logs and traces upward to business impact (Catches granular tech flaws; risks getting bogged down in low-value trivia).\nTo prevent loud senior executives from intimidating quieter experts during workshops (groupthink/dominance bias), use the **Delphi Method**: multiple rounds of ANONYMOUS expert questionnaires aggregated by a facilitator until consensus converges!',
              mentalModel:
                'Top-Down = satellite map showing major highways to your goal; Bottom-Up = street-level inspection spotting potholes. Delphi = blind taste test eliminating peer pressure.',
              formulaOrRule:
                'Preventing Workshop Groupthink / Dominant-Executive Bias -> Choose the DELPHI METHOD (anonymous iterative expert consensus)!',
            },
          ],
          realWorldScenario: {
            title: 'Eliminating Groupthink in a Core-Banking Risk Workshop',
            situation:
              'During an annual IT risk workshop, an outspoken VP of Engineering dismisses concerns about third-party API rate limits as "overblown," causing junior architects to fall silent. Two months later, an API cascade crashes mobile banking for 9 hours.',
            analysis:
              'Open brainstorming failed due to hierarchy/dominance bias. Switching to the **Delphi Method** (anonymous multi-round elicitation) combined with **Top-Down + Bottom-Up** scenario development allows architects to surface technical failure modes safely while business executives quantify realistic outage impacts.',
            takeaway:
              'Whenever a CRISC question mentions "dominant personalities," "executive intimidation," or "geographically dispersed experts," the Delphi Method is almost always the BEST answer!',
          },
          examTraps: [
            'Trap: Entering a bare vulnerability ("Unpatched Apache server") or bare threat ("Phishing") as a complete Risk Scenario. Always tie Threat + Vulnerability + Asset -> Business Impact!',
            'Trap: Using ONLY Bottom-Up vulnerability scans for enterprise risk identification—this misses strategic IT benefit-enablement and project-delivery risks. Best practice combines Top-Down AND Bottom-Up!',
            'Trap: Ignoring Timing/Duration in scenarios—a 4-hour outage on Sunday at 3 AM has radically lower business impact than a 4-hour outage on Cyber Monday.',
          ],
          keyTerms: [
            {
              term: 'IT Risk Scenario',
              definition:
                'Vivid description of a plausible IT-related event connecting actor, threat, vulnerability, asset, timing, and measurable business impact.',
            },
            {
              term: 'Delphi Method',
              definition:
                'Structured, anonymous multi-round expert consensus technique that eliminates peer pressure, groupthink, and dominant-personality bias.',
            },
            {
              term: 'Bow-Tie Analysis',
              definition:
                'Visual risk diagram mapping preventive causes on the left, the central risk event in the middle, and reactive/corrective consequences on the right.',
            },
            {
              term: 'Threat vs. Vulnerability',
              definition:
                'A Threat is any potential cause of an unwanted incident; a Vulnerability is a weakness in an asset or control that a threat can exploit.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d2-l1-q1',
              question:
                'A CRISC practitioner must gather candid IT risk estimates from 12 senior business and technical experts across four continents, knowing two outspoken executives tend to dominate live meetings. Which elicitation technique is BEST?',
              options: [
                'Open group brainstorming in a single conference room',
                'The Delphi Method (anonymous iterative questionnaires)',
                'Reviewing only automated port-scan outputs',
                'Letting the most senior executive score all risks unilaterally',
              ],
              correctIndex: 1,
              rationale:
                'The Delphi Method preserves anonymity across iterative rounds, neutralizing dominant personalities, hierarchy pressure, and geographic barriers.',
            },
            {
              id: 'crisc-d2-l1-q2',
              question:
                'Which statement represents a COMPLETE, well-formed IT Risk Scenario suitable for executive decision-making?',
              options: [
                'SQL Injection vulnerability',
                'External cybercriminals',
                'External attackers exploit unparameterized SQL queries in the public billing portal during month-end invoicing, exfiltrating 150,000 customer records and triggering $6M in regulatory fines and churn',
                'Firewall firmware is two minor versions behind',
              ],
              correctIndex: 2,
              rationale:
                'Only option C links Threat Actor, Vulnerability, Asset, Timing, Event, and measurable Business Impact into an actionable scenario.',
            },
          ],
          practicalDrill: {
            title: 'Draft Top-Down & Bottom-Up Risk IT Scenarios',
            prompt:
              'Convert two vague technical alerts into crisp, board-ready Risk IT Scenarios.',
            steps: [
              'Transform "No MFA on vendor VPN" into a complete 6-element Risk Scenario (Actor, Threat, Event, Asset, Timing, Business Consequence).',
              'Transform a Top-Down strategic goal ("Launch real-time instant loans in 90 days") into an IT Benefit/Project Delivery Risk Scenario.',
              'Map one scenario on a quick Bow-Tie sketch: 2 Preventive controls on the left -> Central Event -> 2 Recovery/Mitigating controls on the right.',
            ],
            successCriteria:
              'Both scenarios quantify realistic business consequences rather than technical jargon, and the Bow-Tie cleanly separates preventive vs. corrective barriers.',
          },
          flashcards: [
            {
              front: 'Why is the Delphi Method heavily tested on ISACA CRISC?',
              back: 'Because anonymous, iterative expert rounds eliminate groupthink, hierarchy intimidation, and dominant-personality bias while building consensus across dispersed teams.',
              tag: 'CRISC-D2',
            },
            {
              front: 'Compare Top-Down vs. Bottom-Up risk scenario identification.',
              back: 'Top-Down starts from business objectives to ensure strategic alignment; Bottom-Up starts from technical vulnerabilities/generic scenarios to catch operational flaws. Combining BOTH yields the best coverage.',
              tag: 'CRISC-D2',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
          ],
        },
        {
          id: 'crisc-d2-l2',
          title: 'Risk Analysis & Evaluation: Qualitative, Quantitative (ALE/FAIR) & Inherent vs. Residual Risk',
          estimatedMinutes: 50,
          summary:
            'Compare Qualitative, Semi-Quantitative, and Quantitative analysis (SLE, ARO, ALE, FAIR, Monte Carlo), prioritize risks cleanly against Risk Appetite, and avoid heat-map ranking distortions.',
          learningObjectives: [
            'Compare Qualitative (fast, subjective), Semi-Quantitative (weighted numerical scales), and Quantitative (monetary SLE/ARO/ALE, FAIR, Monte Carlo) analysis methods.',
            'Calculate SLE, ARO, ALE, and Control Cost-Benefit ROI accurately under timed exam conditions.',
            'Explain the FAIR (Factor Analysis of Information Risk) taxonomy decomposing Risk into Loss Event Frequency (LEF) and Loss Magnitude (LM).',
            'Evaluate Inherent Risk, Current/Control Effectiveness, and Residual Risk to rank exposures against organizational Risk Appetite.',
          ],
          coreConcepts: [
            {
              heading: 'Qualitative vs. Semi-Quantitative vs. Quantitative Risk Analysis',
              explanation:
                'Selecting the right analysis depth depends on decision stakes and data availability:\n• Qualitative Analysis: Descriptive scales (High/Medium/Low) plotted on a heat map. Pros: fast, low cost, great for initial triage and when historical loss data is scarce. Cons: subjective ("your High is my Medium"), cannot calculate financial ROI for expensive controls!\n• Semi-Quantitative Analysis: Assigns numerical buckets/weights (e.g., 1–5 scales or ranges) to improve consistency while keeping speed.\n• Quantitative Analysis: Expresses risk in hard financial dollars using `SLE = Asset Value × Exposure Factor`, `ALE = SLE × ARO`, or probabilistic models like **FAIR** and **Monte Carlo Simulation** (running thousands of random iterations over min/most-likely/max ranges to produce realistic loss-exceedance curves!). Pros: objective, enables CFO-grade cost-benefit justification. Cons: time-consuming and data-intensive.',
              mentalModel:
                'Use Qualitative to sort 200 risks down to the Top 15 quickly; then apply Quantitative (ALE/FAIR) on the Top 15 to defend multimillion-dollar mitigation budgets to the Board!',
              formulaOrRule:
                'SLE = AV × EF | ALE = SLE × ARO | Safeguard Value = (ALE_before − ALE_after) − Annual Safeguard Cost.',
            },
            {
              heading: 'FAIR Model & Risk Evaluation Against Appetite',
              explanation:
                'FAIR (Factor Analysis of Information Risk) is the premier quantitative IT risk ontology: Risk = Loss Event Frequency (LEF = Threat Event Frequency × Vulnerability) × Loss Magnitude (LM = Primary Loss + Secondary Loss, such as regulatory fines and reputational churn). During Risk Evaluation, every analyzed risk is compared directly against Board Risk Appetite and Tolerance—generating a prioritized backlog distinguishing (1) Above Appetite (mandatory escalation/mitigation), (2) Inside Appetite but Above Tolerance (manage/monitor closely), and (3) Inside Tolerance (eligible for formal Risk Acceptance by Risk Owner).',
              mentalModel:
                'Risk Analysis calculates the score; Risk Evaluation decides "Is this score acceptable or unacceptable relative to our Risk Appetite?"',
            },
          ],
          realWorldScenario: {
            title: 'Two "High" Risks on a Heat Map — Radically Different Dollar Reality',
            situation:
              'A qualitative 3×3 heat map rates BOTH "Laptop Theft" (High Likelihood, Medium Impact) and "Core Payment Ransomware" (Low Likelihood, Catastrophic Impact) as "Amber/Medium-High." Management threatens to cut the ransomware backup budget to buy extra laptop cable locks.',
            analysis:
              'Qualitative ordinal scales compress vastly different dollar magnitudes into identical colors ("range compression bias"). Switching to Quantitative / FAIR modeling shows Laptop Theft ALE = $65,000/yr while Core Payment Ransomware carries a 10% annual probability of a $12M loss (ALE = $1.2M/yr + existential tail risk). Quantitative analysis immediately corrects capital allocation.',
            takeaway:
              'Whenever a CRISC question asks how to justify a major security investment to executives or resolve a tie between subjective ratings, Quantitative Analysis (ALE/FAIR/Cost-Benefit) is the winning tool.',
          },
          examTraps: [
            'Trap: Multiplying ordinal qualitative numbers (like "Impact 4 × Likelihood 3 = 12") and treating "12" as mathematically twice as expensive as "6." Ordinal scales do NOT scale linearly!',
            'Trap: Saying Quantitative Analysis is ALWAYS better than Qualitative Analysis. Quantitative requires reliable historical data and higher effort; Qualitative is best for rapid broad screening or intangible reputational factors where hard numbers do not exist.',
            'Trap: Forgetting to reassess Residual Risk AFTER implementing a control—always verify whether the remaining risk actually sits inside Risk Appetite AND check for newly introduced Secondary Risk!',
          ],
          keyTerms: [
            {
              term: 'FAIR (Factor Analysis of Information Risk)',
              definition:
                'Quantitative risk framework expressing financial cyber exposure via Loss Event Frequency (LEF) and Loss Magnitude (Primary + Secondary Losses).',
            },
            {
              term: 'Monte Carlo Simulation',
              definition:
                'Probabilistic statistical modeling running thousands of randomized trials across min/most-likely/max parameter ranges to forecast loss probability distributions.',
            },
            {
              term: 'Exposure Factor (EF)',
              definition:
                'Estimated percentage (0%–100%) of an asset’s value lost if a specific threat event occurs once.',
            },
            {
              term: 'Secondary Risk',
              definition:
                'New risk created as a direct side effect of implementing a risk response or control (e.g., complex MFA lockouts slowing emergency clinical access).',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d2-l2-q1',
              question:
                'An enterprise wants to evaluate whether a $180,000/year DDoS mitigation service is financially justified for an e-commerce platform valued at $3,000,000 where each major outage causes a 20% loss (EF = 0.20) and occurs once every 2 years (ARO = 0.5). The service reduces ARO to 0.05. What is the net annual financial benefit?',
              options: [
                '$90,000 net annual savings (Approve)',
                '$120,000 net annual savings (Approve)',
                '$300,000 net annual savings (Approve)',
                'Negative $10,000 (Reject)',
              ],
              correctIndex: 0,
              rationale:
                'SLE = $3,000,000 × 0.20 = $600,000. ALE_before = $600,000 × 0.5 = $300,000. ALE_after = $600,000 × 0.05 = $30,000. Risk reduction = $270,000. Subtracting $180,000 annual cost leaves +$90,000 net annual benefit.',
            },
            {
              id: 'crisc-d2-l2-q2',
              question:
                'What is the PRIMARY advantage of Qualitative Risk Analysis over Quantitative Risk Analysis during an enterprise-wide initial risk screening?',
              options: [
                'It calculates precise monetary ROI for capital budgeting',
                'It is faster, less resource-intensive, and usable even when precise historical financial loss data is unavailable',
                'It completely eliminates subjective evaluator bias',
                'It automatically satisfies SOX 404 substantive testing',
              ],
              correctIndex: 1,
              rationale:
                'Qualitative analysis excels at rapid, low-cost prioritization across many assets when hard historical loss frequencies are lacking, though it cannot replace quantitative ROI analysis for major investments.',
            },
          ],
          practicalDrill: {
            title: 'Two-Stage Qualitative-to-Quantitative Risk Evaluation',
            prompt:
              'Triage three enterprise risks qualitatively, then quantify the top scenario for a CFO funding pitch.',
            steps: [
              'Score Likelihood (1–5) and Impact (1–5) for: (A) Cloud S3 Customer Data Leak, (B) Office Printer Failure, (C) Core Payment API Ransomware.',
              'Calculate SLE, ARO, ALE_before, ALE_after, and Net Safeguard Value for Scenario C given a proposed $150k immutable backup & EDR upgrade.',
              'Identify one potential Secondary Risk created by the new control and note how you will manage it.',
            ],
            successCriteria:
              'Accurate math, clean separation of Inherent vs. Residual vs. Secondary risk, and financially sound CFO recommendation.',
          },
          flashcards: [
            {
              front: 'What are the two top-level branches of the FAIR quantitative risk model?',
              back: 'Loss Event Frequency (LEF = Threat Event Frequency × Vulnerability) and Loss Magnitude (LM = Primary Loss + Secondary Loss).',
              tag: 'CRISC-D2',
            },
            {
              front: 'What is Secondary Risk?',
              back: 'A brand-new risk introduced directly as a side effect of implementing a risk treatment or security control.',
              tag: 'CRISC-D2',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Crisc Q A.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: Risk Response and Reporting (32% — HIGHEST WEIGHTED DOMAIN!)
    // =================================================================
    {
      id: 'crisc-d3',
      domainNumber: 3,
      title: 'Risk Response and Reporting',
      examWeightPercent: 32,
      overview:
        'Nearly ONE-THIRD of the entire CRISC exam! Masters selecting optimal Risk Responses (Mitigate, Avoid, Transfer/Share, Accept), designing and monitoring controls (Preventive/Detective/Corrective/Compensating), maintaining living Risk Registers, and building leading Key Risk Indicators (KRIs) for executive reporting.',
      lessons: [
        {
          id: 'crisc-d3-l1',
          title: 'The 4 Risk Response Options, Cost-Benefit Decisions & Residual Risk Acceptance',
          estimatedMinutes: 50,
          summary:
            'Choose the exact right risk treatment option—Mitigate, Avoid, Transfer/Share, or Accept—balancing business value, cost-benefit ratios, risk appetite, and human/regulatory constraints.',
          learningObjectives: [
            'Select cleanly among the four canonical CRISC risk responses: Risk Avoidance, Risk Mitigation (Reduction), Risk Transfer (Sharing), and Risk Acceptance.',
            'Apply cost-benefit discipline: never spend more on a control than the risk exposure it reduces (unless mandated by law or human safety).',
            'Explain why Risk Transfer (insurance/outsourcing) reduces FINANCIAL exposure ONLY—never operational outage reality or legal accountability.',
            'Manage formal Risk Acceptance criteria (within appetite, documented in Risk Register, signed by Risk Owner, periodically reviewed).',
          ],
          coreConcepts: [
            {
              heading: 'The 4 Canonical Risk Treatment Options (Know Every Nuance!)',
              explanation:
                'Every identified risk receives an explicit response chosen by the Risk Owner:\n1. Risk Mitigation (Reduction): Implement controls lowering Likelihood, Impact, or both until Residual Risk sits inside Appetite (most common for core business activities!).\n2. Risk Avoidance: Eliminate the risk entirely by halting or refusing the risky activity/technology/market (e.g., shutting down a legacy unpatchable portal or refusing to store raw CVV card numbers). Use when exposure vastly exceeds business benefit and cannot be cost-effectively mitigated!\n3. Risk Transfer (Sharing): Shift financial loss impact to a third party via Cyber Insurance, indemnification contracts, hedging, or outsourcing. CRITICAL CRISC RULE: Transfer shifts FINANCIAL loss ONLY—you still suffer reputational damage, operational disruption, and statutory accountability! Ideal for LOW-FREQUENCY, HIGH-IMPACT (catastrophic tail) risks!\n4. Risk Acceptance: Consciously retain residual risk with NO additional controls when residual risk sits INSIDE Risk Appetite OR mitigation cost exceeds potential loss. MUST be documented in the Risk Register, signed by the Risk Owner, and re-evaluated periodically as threats change!',
              mentalModel:
                'Decision compass: Core profitable process + manageable flaw -> MITIGATE; Terrible ROI + massive exposure -> AVOID; Rare catastrophic dollar hit -> TRANSFER (Insure); Tiny impact below appetite -> ACCEPT (formally!).',
              formulaOrRule:
                'Low Likelihood + High Financial Impact -> Best candidate for RISK TRANSFER (Insurance) | Cost of Control > Benefit -> ACCEPT (if inside appetite) or AVOID!',
            },
            {
              heading: 'Risk Action Plans & Managing Residual Risk',
              explanation:
                'A Risk Response is just an intention until translated into a Risk Action Plan specifying: chosen treatment, exact control/remediation tasks, Control Owner, budget/resources, milestone dates, target residual risk, and verification method. Once controls deploy, the practitioner re-measures Residual Risk. If Residual Risk STILL exceeds appetite, loop back for additional mitigation or executive escalation.',
              mentalModel:
                'Never mark a risk "Closed" just because management approved a plan—risk only drops when the control is implemented AND verified operating effectively!',
            },
          ],
          realWorldScenario: {
            title: 'The "Too-Expensive-to-Mitigate" Legacy Crypto Portal',
            situation:
              'A small regional credit union operates an experimental cryptocurrency trading widget generating $45,000/year in net fees. A risk assessment reveals $420,000/year in mandatory regulatory compliance and cold-wallet security costs to bring residual risk inside the Board’s risk appetite.',
            analysis:
              'Mitigation costs nearly 10× the annual business revenue ($420k vs. $45k), Acceptance violates Board Risk Appetite and banking regulations, and Insurance will not cover intentional non-compliance. The ONLY rational business-aligned risk response is **Risk Avoidance**—decommissioning the experimental widget cleanly.',
            takeaway:
              'On CRISC, when risk vastly exceeds business value and cannot be economically mitigated inside appetite, Risk Avoidance is the sharpest strategic answer.',
          },
          examTraps: [
            'Trap: Thinking "Risk Acceptance" means "doing nothing and forgetting about it." Valid Risk Acceptance MUST be formal, documented in the Risk Register, signed by the Risk Owner, within Risk Appetite, and periodically monitored!',
            'Trap: Saying Cyber Insurance "eliminates" or "mitigates the likelihood of" a ransomware attack. Insurance is Risk Transfer—it reduces financial loss AFTER an attack, never prevents it!',
            'Trap: Choosing Mitigation when the annual control cost is $500k and the total worst-case asset loss is $80k (with no legal/safety mandate). Always check cost-benefit proportionality!',
          ],
          keyTerms: [
            {
              term: 'Risk Avoidance',
              definition:
                'Eliminating exposure completely by exiting, refusing, or discontinuing the underlying risky activity or asset.',
            },
            {
              term: 'Risk Transfer (Sharing)',
              definition:
                'Shifting partial financial consequences of a risk event to another party (e.g., insurance or contractual indemnity) while retaining accountability.',
            },
            {
              term: 'Risk Mitigation (Reduction)',
              definition:
                'Deploying controls that reduce the likelihood and/or business impact of a risk event to an acceptable residual level.',
            },
            {
              term: 'Risk Acceptance',
              definition:
                'Formal, documented decision by the Risk Owner to retain residual risk without further control investment when exposure lies within appetite.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d3-l1-q1',
              question:
                'Which risk profile is the MOST suitable candidate for Risk Transfer via cyber liability insurance?',
              options: [
                'High-frequency, low-impact daily help-desk password lockouts',
                'Low-frequency, high-financial-impact catastrophic breach scenarios',
                'Known intentional violations of mandatory banking privacy statutes',
                'Routine software patching failures on internet-facing web servers',
              ],
              correctIndex: 1,
              rationale:
                'Insurance (Risk Transfer) is economically optimal for low-probability, high-severity catastrophic tail risks. High-frequency/low-impact events should be mitigated/accepted operationally, and intentional non-compliance is uninsurable.',
            },
            {
              id: 'crisc-d3-l1-q2',
              question:
                'An enterprise discovers that a side-project mobile game generates $20,000/year in revenue but exposes the firm to $2,000,000 in potential privacy fines, and bringing it into compliance costs $300,000/year. Which risk response is BEST?',
              options: [
                'Risk Mitigation by spending $300,000/year',
                'Risk Acceptance signed by the lead developer',
                'Risk Avoidance by shutting down and discontinuing the mobile game',
                'Risk Transfer by raising customer subscription fees by $1',
              ],
              correctIndex: 2,
              rationale:
                'When compliance/mitigation cost ($300k) dwarfs business return ($20k) and retaining risk violates legal/appetite boundaries, Risk Avoidance (discontinuing the activity) is optimal.',
            },
          ],
          practicalDrill: {
            title: '4-Scenario Risk Treatment Selection Drill',
            prompt:
              'Match each scenario to Mitigate, Avoid, Transfer, or Accept and defend in two crisp sentences.',
            steps: [
              'Scenario 1: Core customer login portal lacks phishing-resistant MFA (High likelihood, High impact, $40k fix).',
              'Scenario 2: Rare catastrophic regional earthquake destroying headquarters data center (Low likelihood, $40M impact).',
              'Scenario 3: Non-sensitive internal cafeteria menu webpage occasionally lags by 2 seconds ($120k to upgrade servers).',
              'Scenario 4: Unprofitable legacy fax-to-email gateway running unpatchable Windows NT exposed to PII leaks.',
            ],
            successCriteria:
              '1=Mitigate, 2=Transfer (property/BI insurance) + Mitigate (DR site), 3=Accept (formally documented inside appetite), 4=Avoid (decommission).',
          },
          flashcards: [
            {
              front: 'What are the 4 Risk Treatment / Response options in ISACA CRISC?',
              back: 'Avoid, Mitigate (Reduce), Transfer (Share), and Accept.',
              tag: 'CRISC-D3',
            },
            {
              front: 'What four criteria make a Risk Acceptance decision valid under CRISC?',
              back: '1. Residual risk is within Board Risk Appetite, 2. Formally signed by the accountable Risk Owner, 3. Documented in the Risk Register, 4. Periodically reviewed.',
              tag: 'CRISC-D3',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Crisc Q A.pdf',
          ],
        },
        {
          id: 'crisc-d3-l2',
          title: 'Control Design, Implementation, Compensating Controls & Control Monitoring',
          estimatedMinutes: 45,
          summary:
            'Engineer layered, cost-effective controls (Preventive, Detective, Corrective, Deterrent, Compensating), manage control decay/override, and track ongoing effectiveness via Control Self-Assessments (CSAs) and Key Control Indicators (KCIs).',
          learningObjectives: [
            'Select optimal control mixes across Preventive, Detective, Corrective, Deterrent, and Compensating categories—and know why Automated Preventive controls are strongest.',
            'Explain Control Design Effectiveness vs. Operating Effectiveness and how controls decay over time without continuous monitoring.',
            'Use Control Self-Assessments (CSAs) to empower 1st-line business managers while recognizing CSA objectivity limits.',
          ],
          coreConcepts: [
            {
              heading: 'Control Taxonomy & Defense-in-Depth Balance',
              explanation:
                'Strong control design layers safeguards across the timeline of a threat:\n• Preventive Controls stop incidents BEFORE they occur (MFA, RBAC, Segregation of Duties, parameterized queries, input validation—highest preference when cost-effective!).\n• Detective Controls identify events during or shortly after occurrence (SIEM alerts, IDS, access reconciliation logs, CCTV, exception reports).\n• Corrective Controls restore normal state and minimize damage AFTER detection (immutable backup restore, incident containment playbooks, patching).\n• Deterrent Controls discourage attempts (warning banners, visible guards, disciplinary policies).\n• Compensating Controls substitute equivalent protection when a primary control is infeasible (e.g., supervisory log review + mandatory vacation when small headcount prevents SoD).\nAutomated controls are generally more reliable and consistent than manual controls because humans fatigue and make mistakes.',
              mentalModel:
                'Preventive = deadbolt lock; Deterrent = "Beware of Dog" sign; Detective = burglar alarm; Corrective = fire extinguisher & insurance rebuild; Compensating = hiring a night watchman while the lock is broken.',
              formulaOrRule:
                'Reliability Preference: Automated Preventive > Manual Preventive > Automated Detective > Manual Detective.',
            },
            {
              heading: 'Control Testing, Control Decay & Control Self-Assessments (CSAs)',
              explanation:
                'Controls degrade silently ("control decay") due to staff turnover, cloud drift, software upgrades, or deliberate bypass. Ongoing Control Monitoring pairs automated Key Control Indicators (KCIs—e.g., "% of servers compliant with CIS hardening baseline") with periodic testing and **Control Self-Assessments (CSAs)**. In a CSA, 1st-line business/process owners evaluate their OWN controls via facilitated workshops or questionnaires. Pros: fast, cheap, boosts 1st-line risk ownership and awareness. CRITICAL CRISC EXAM LIMITATION: CSA is NOT independent assurance—management may overstate effectiveness, so CSAs complement (NEVER replace!) independent 3rd-line audit!',
              mentalModel:
                'CSA is grading your own practice test—super helpful for learning and owning your mistakes, but universities still require an independent proctored final exam!',
            },
          ],
          realWorldScenario: {
            title: 'The Silently Broken DLP Control',
            situation:
              'A financial firm spent $600k implementing an automated Data Loss Prevention (DLP) tool to block outbound email exfiltration of customer SSNs. During a 2-year gap with no control monitoring, an Exchange Online TLS upgrade silently broke the DLP connector—meaning zero alerts or blocks ran for 14 months until an employee emailed 9,000 SSNs to a personal Gmail account.',
            analysis:
              'Control Design was sound on Day 1, but absence of continuous Control Monitoring (KCI heartbeat checks / synthetic test emails verifying DLP blocking weekly) allowed silent control failure. Every critical control needs a named Control Owner, defined testing frequency, and automated health KCIs.',
            takeaway:
              'Implementing a control is only half the job—an unmonitored control creates dangerous false confidence!',
          },
          examTraps: [
            'Trap: Treating Control Self-Assessment (CSA) as a substitute for independent internal or external audit. CSA improves 1st-line ownership and early detection, but lacks 3rd-line independence!',
            'Trap: Selecting ONLY preventive controls and ignoring detective/corrective layers. No preventive control is 100% impenetrable—defense-in-depth requires detective and corrective fallback.',
            'Trap: Ignoring total lifecycle cost of a control (licensing + tuning + staff maintenance + user friction/productivity drag), not just upfront purchase price!',
          ],
          keyTerms: [
            {
              term: 'Control Self-Assessment (CSA)',
              definition:
                'Process whereby 1st-line management and staff evaluate their own internal controls to build ownership and spot gaps early (not independent assurance).',
            },
            {
              term: 'Key Control Indicator (KCI)',
              definition:
                'Metric tracking whether a specific safeguard is operating at its required coverage and effectiveness threshold.',
            },
            {
              term: 'Control Decay (Drift)',
              definition:
                'Gradual degradation of control effectiveness over time caused by system changes, staff turnover, misconfiguration, or workarounds.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d3-l2-q1',
              question:
                'What is the PRIMARY benefit AND primary limitation of implementing a Control Self-Assessment (CSA) program across business units?',
              options: [
                'Benefit: eliminates the need for Internal Audit; Limitation: extremely expensive software',
                'Benefit: strengthens 1st-line risk/control ownership and early gap visibility; Limitation: reduced objectivity compared to independent 3rd-line audit',
                'Benefit: replaces all technical firewalls; Limitation: only applies to financial banks',
                'Benefit: guarantees zero inherent risk; Limitation: violates ISO 31000',
              ],
              correctIndex: 1,
              rationale:
                'CSA engages business process owners directly to boost ownership and surface issues early, but self-evaluation inherently lacks independent audit objectivity.',
            },
            {
              id: 'crisc-d3-l2-q2',
              question:
                'Which control type is MOST reliable for consistently preventing employees from entering invalid negative quantities into a high-volume ERP order screen?',
              options: [
                'A manual quarterly supervisory review of printed order reports',
                'An automated preventive input-validation edit check embedded in the ERP application',
                'A poster in the breakroom reminding clerks to double-check entries',
                'An annual employee policy attestation',
              ],
              correctIndex: 1,
              rationale:
                'Automated preventive controls execute consistently on 100% of transactions at the point of entry without human fatigue.',
            },
          ],
          practicalDrill: {
            title: 'Control Lifecycle & KCI Design Blueprint',
            prompt:
              'Design a complete preventive + detective + corrective control stack with automated KCIs for privileged cloud console access.',
            steps: [
              'Specify 1 Automated Preventive control (e.g., FIDO2 MFA + JIT PAM).',
              'Specify 1 Automated Detective control (e.g., SIEM alert on root/break-glass login or IAM policy mutation).',
              'Specify 1 Corrective control (e.g., automated session kill + credential rotation playbook).',
              'Define 2 measurable KCIs that immediately detect control decay before an attacker exploits it.',
            ],
            successCriteria:
              'All three control types accurately categorized with named Control Owners and automated anti-decay KCIs.',
          },
          flashcards: [
            {
              front: 'What is the main limitation of Control Self-Assessment (CSA)?',
              back: 'Lack of independence/objectivity—1st-line owners may overlook or understate their own control weaknesses, so CSA cannot replace independent 3rd-line audit.',
              tag: 'CRISC-D3',
            },
            {
              front: 'Why are Automated Preventive controls preferred over Manual Detective controls when cost-effective?',
              back: 'They stop errors/attacks proactively before damage occurs and execute consistently across 100% of transactions without human fatigue.',
              tag: 'CRISC-D3',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Crisc Q A.pdf',
          ],
        },
        {
          id: 'crisc-d3-l3',
          title: 'Living Risk Registers, KRI Engineering & Executive Risk Reporting',
          estimatedMinutes: 50,
          summary:
            'Architect a decision-grade enterprise Risk Register, engineer predictive Key Risk Indicators (KRIs) with optimal escalation thresholds, and deliver tailored risk reporting to Boards, Executives, and Operational Owners.',
          learningObjectives: [
            'Specify every mandatory field of an enterprise IT Risk Register and maintain it as a dynamic, living governance repository.',
            'Select and calibrate high-signal Key Risk Indicators (KRIs) using four quality tests: Predictive (leading), Measurable, Repeatable/Automated, and Actionable (linked to thresholds & owners).',
            'Distinguish Leading KRIs from Lagging KPIs/Loss Metrics and avoid "metric overload" by prioritizing root-cause & intermediate-event indicators.',
            'Tailor risk reporting frequency, aggregation level, and visual framing for Board, Executive Risk Committee, and Operational Management audiences.',
          ],
          coreConcepts: [
            {
              heading: 'The Living Risk Register: Single Source of Risk Truth',
              explanation:
                'The Risk Register is the authoritative central repository enabling consistent enterprise risk prioritization, tracking, and reporting. Mandatory fields include: Unique Risk ID, Risk Scenario description, Category/Domain, Accountable Risk Owner, Inherent Risk (Likelihood & Impact), Existing Controls & Control Owners, Current Residual Risk, Risk Appetite Status (Within/Breached), Chosen Risk Response & Action Plan (target date), Linked KRIs & Current Trend, and Last Review Date. CRITICAL CRISC RULE: A Risk Register is NEVER a static annual spreadsheet created once for auditors—it MUST be updated continuously whenever major IT changes, incidents, audits, mergers, or new threat intelligence occur!',
              mentalModel:
                'Think of the Risk Register as air-traffic control radar: an outdated radar snapshot from 6 months ago is worse than useless when planes are landing right now.',
            },
            {
              heading: 'KRI Engineering Mastery (Top CRISC Domain 3 Exam Gold!)',
              explanation:
                'ISACA tests KRI selection MORE heavily than almost any other CRISC topic! A great KRI provides an EARLY WARNING signal BEFORE risk appetite is breached so management still has time to act.\n• Lagging Indicators (Historical): Tell you losses ALREADY happened (e.g., "Number of customer data breaches this quarter"). Useful for trend validation, TOO LATE to prevent today’s disaster!\n• Leading Indicators (Predictive KRIs): Signal rising exposure BEFORE loss strikes (e.g., "% of critical internet-facing systems unpatched past SLA," "Rising employee turnover in SOC/DBA teams," "Spike in emergency unapproved production changes," "Increasing failed DR restore tests").\nSelect KRIs targeting **Root Causes** and **Intermediate Events** for your highest-impact risks, map clear **Trigger Thresholds** (Green = normal; Amber = Risk Owner alert/action; Red = Executive escalation), and keep the executive set lean (top 10–20 actionable KRIs, avoiding dashboard clutter!).',
              mentalModel:
                'Driving toward a bridge washout: Lagging metric = counting how many cars fell into the river; Leading KRI = upstream river-level gauge crossing the Amber flood mark 3 hours BEFORE the bridge washes out!',
              formulaOrRule:
                'BEST KRI Formula: Forward-Looking (Leading) + Tied to High-Impact Risk Root Cause + Measurable/Objective + Explicit Escalation Threshold + Named Owner.',
            },
          ],
          realWorldScenario: {
            title: 'Spotting Impending Core System Outage via Leading KRIs',
            situation:
              'A payments processor’s monthly KPI shows "99.98% uptime — Green!" every month, reassuring executives. Meanwhile, the CRISC practitioner tracks three leading KRIs: (1) Emergency unapproved production changes jumped from 2/month to 19/month; (2) Database storage utilization hit 91% with flat capacity budget; (3) Senior SRE attrition reached 35% in 6 months.',
            analysis:
              'The backward-looking uptime KPI painted a falsely calm picture right up until failure. The leading KRIs crossed Amber/Red thresholds MONTHS before a catastrophic outage—giving executive leadership timely proof to freeze risky releases, fund storage expansion, and launch SRE retention before uptime collapsed.',
            takeaway:
              'Green KPIs can mask glowing Red KRIs! On CRISC, ALWAYS choose predictive indicators of growing stress/control erosion over historical incident or uptime counts.',
          },
          examTraps: [
            'Trap: Picking a past loss count ("Total ransomware downtime hours last year") as the BEST KRI for preventing future downtime. Always choose a forward-looking LEADING indicator!',
            'Trap: Setting KRI thresholds SO tight that false alarms ring daily (alert fatigue -> ignored dashboard) OR SO loose that alarms only fire AFTER the disaster already hit!',
            'Trap: Tracking 300 unprioritized KRIs for the Board. Executive reporting must aggregate high-signal KRIs aligned to top enterprise risks and risk appetite.',
          ],
          keyTerms: [
            {
              term: 'Risk Register',
              definition:
                'Central, continuously updated repository documenting enterprise risk scenarios, owners, inherent/residual ratings, controls, treatment plans, and KRI status.',
            },
            {
              term: 'Leading vs. Lagging Indicator',
              definition:
                'Leading indicators predict emerging risk exposure before loss occurs (ideal KRIs); lagging indicators measure historical losses or outcomes after the fact.',
            },
            {
              term: 'KRI Escalation Threshold',
              definition:
                'Pre-defined quantitative trigger (Amber/Red) requiring automatic notification and predefined management intervention when breached.',
            },
            {
              term: 'Risk Aggregation',
              definition:
                'Rolling up individual system/departmental risks to reveal combined enterprise-wide exposure (e.g., shared cloud/vendor exposure across units).',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d3-l3-q1',
              question:
                'An organization wants a LEADING Key Risk Indicator (KRI) that provides early warning of increasing risk of unauthorized production outages caused by flawed code deployments. Which metric is BEST?',
              options: [
                'Total revenue lost during production outages last fiscal year',
                'Rising percentage of production deployments bypassing peer review or automated regression testing over the past 30 days',
                'Total number of programmers employed in the engineering department',
                'Number of annual IT governance policies published on the intranet',
              ],
              correctIndex: 1,
              rationale:
                'A rising rate of bypassed peer reviews / regression tests directly predicts upcoming flawed deployments BEFORE an outage occurs—making it an ideal leading KRI.',
            },
            {
              id: 'crisc-d3-l3-q2',
              question:
                'When MUST a CRISC practitioner update the enterprise IT Risk Register?',
              options: [
                'Strictly once per year two weeks prior to the external financial audit',
                'Continuously / whenever significant organizational changes, new technologies, incidents, audit findings, or risk treatments alter exposure',
                'Only after a material cybersecurity breach occurs',
                'Only when the Chief Risk Officer resigns',
              ],
              correctIndex: 1,
              rationale:
                'The Risk Register is a dynamic, living tool that must reflect material changes in threats, business operations, IT architecture, incidents, and control status continuously.',
            },
          ],
          practicalDrill: {
            title: 'Engineer 4 Leading KRIs + Escalation Playbook',
            prompt:
              'Convert four major enterprise IT risks into leading KRIs with Green/Amber/Red thresholds.',
            steps: [
              'Risk 1 (Ransomware Recovery Failure) -> Design 1 Leading KRI + thresholds.',
              'Risk 2 (Privileged Insider Data Theft) -> Design 1 Leading KRI + thresholds.',
              'Risk 3 (Third-Party SaaS Breach) -> Design 1 Leading KRI + thresholds.',
              'Risk 4 (Critical IT Project Delivery Failure) -> Design 1 Leading KRI + thresholds, and define the exact escalation step when Amber turns Red.',
            ],
            successCriteria:
              'All four metrics are forward-looking (zero historical loss counts), measurable, and paired with clear owner escalation rules.',
          },
          flashcards: [
            {
              front: 'What four traits define a world-class Key Risk Indicator (KRI)?',
              back: 'Forward-looking (leading/predictive), objective & measurable, repeatable/automatable, and linked to a specific high-impact risk with clear escalation thresholds.',
              tag: 'CRISC-D3',
            },
            {
              front: 'What is the difference between Risk Aggregation and an isolated asset Risk Register entry?',
              back: 'Risk Aggregation combines correlated risks across business units (e.g., 5 teams relying on the same cloud vendor or legacy DB) to reveal total enterprise-level exposure.',
              tag: 'CRISC-D3',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
            'my_documents/Crisc Q A.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: Information Technology and Security (22%)
    // =================================================================
    {
      id: 'crisc-d4',
      domainNumber: 4,
      title: 'Information Technology and Security',
      examWeightPercent: 22,
      overview:
        'Connects IT architecture and security engineering directly to enterprise risk reduction—covering Enterprise Architecture, SDLC & Change Management risk, Cloud/AI/Emerging Tech risks, Data Privacy Lifecycle, IAM, and Business Resilience.',
      lessons: [
        {
          id: 'crisc-d4-l1',
          title: 'Enterprise Architecture, SDLC, Change Management & Cloud/AI Emerging Tech Risk',
          estimatedMinutes: 45,
          summary:
            'Identify architectural risk drivers across legacy technical debt, SDLC/DevOps velocity, cloud Shared Responsibility boundaries, and emerging AI/IoT/Shadow IT adoption.',
          learningObjectives: [
            'Explain how Enterprise Architecture (EA) reduces systemic risk by eliminating shadow silos, single points of failure, and unmaintainable technical debt.',
            'Identify key IT risks across SDLC phases (scope creep, missing security requirements, inadequate testing, unapproved change deployment) and Agile/DevSecOps pipelines.',
            'Apply the Cloud Shared Responsibility Model across IaaS, PaaS, and SaaS so risk owners never assume the CSP handles customer IAM, configuration, or data classification.',
            'Assess emerging technology risks (Generative AI data leakage/hallucination/bias, IoT/OT weak authentication, API sprawl) BEFORE enterprise adoption.',
          ],
          coreConcepts: [
            {
              heading: 'Enterprise Architecture (EA) & SDLC Risk Touchpoints',
              explanation:
                'Fragmented IT infrastructure breeds hidden risk: duplicate databases, unpatched orphan servers, and fragile point-to-point integrations. Enterprise Architecture (e.g., TOGAF / Zachman) standardizes Business, Data, Application, and Technology layers so risk controls scale cleanly. Inside the SDLC, risk practitioners embed early checkpoints: (1) Feasibility/Requirements (embed privacy-by-design, security requirements, and threat modeling—cheapest defect fix!), (2) Development/CI-CD (automated SAST/SCA, peer review, strict Dev/Test/Prod separation, anonymized test data), (3) Testing (UAT business sign-off, stress/security testing), and (4) Change & Release Management (formal impact analysis, CAB/automated gates, tested rollback).',
              mentalModel:
                'EA is city zoning and standardized electrical codes; without it, every neighborhood wires its own incompatible grid and one storm blacks out the whole city.',
            },
            {
              heading: 'Cloud Shared Responsibility & Emerging AI/IoT Risk Governance',
              explanation:
                'Cloud adoption transforms—NOT eliminates—IT risk. Across ALL models (IaaS, PaaS, SaaS), the **Customer ALWAYS retains responsibility for Data Classification/Governance, User Identity & Access (IAM), Endpoint Security, and Regulatory Accountability**. As you move from On-Prem -> IaaS -> PaaS -> SaaS, the Cloud Provider takes over progressively more lower-stack layers (physical -> hypervisor -> OS -> runtime -> application). For Emerging Technologies (Generative AI, LLM agents, IoT/OT sensors, Blockchain): conduct formal Pre-Adoption Risk Assessments evaluating vendor lock-in, training data leakage, adversarial attacks, regulatory uncertainty, and exit portability BEFORE authorizing production data ingestion.',
              mentalModel:
                'Renting a furnished apartment (SaaS) vs. leasing raw land (IaaS): Even in a fully managed SaaS hotel suite, YOU are still responsible for who you hand your room key to (IAM) and what valuables you leave out (Data)!',
              formulaOrRule:
                'Always Customer-Owned Across IaaS/PaaS/SaaS: Data + Classification + Identity/Access (IAM) + Endpoints + Compliance Accountability.',
            },
          ],
          realWorldScenario: {
            title: 'The "Cloud Provider Handles Security" Misconception',
            situation:
              'A healthcare startup migrates its patient portal to AWS IaaS EC2 instances and Amazon S3 buckets. The CTO skips internal OS patching and leaves an S3 bucket ACL set to `public-read`, telling the Board "AWS is HIPAA and SOC 2 certified, so our cloud security is covered."',
            analysis:
              'Fatal misunderstanding of the IaaS Shared Responsibility Model! AWS secures the physical data centers, host hypervisors, and underlying S3 service ("security OF the cloud"), while the startup is 100% responsible for guest OS patching, IAM policies, S3 bucket permissions, encryption settings, and application security ("security IN the cloud").',
            takeaway:
              'On CRISC, a Cloud Service Provider’s SOC 2/ISO certification NEVER covers customer misconfigurations, IAM hygiene, or data governance.',
          },
          examTraps: [
            'Trap: Believing that migrating to SaaS eliminates customer IAM or data-security risk. Even in SaaS, the customer owns user provisioning/deprovisioning, MFA enforcement, role permissions, and data governance!',
            'Trap: Allowing rapid Agile/DevOps sprints to bypass security requirements or Change Management traceability. Embed automated CI/CD risk gates rather than skipping governance.',
          ],
          keyTerms: [
            {
              term: 'Shared Responsibility Model',
              definition:
                'Delineation of security and operational duties between Cloud Service Provider ("security OF the cloud") and Customer ("security IN the cloud") across IaaS, PaaS, and SaaS.',
            },
            {
              term: 'Technical Debt',
              definition:
                'Accumulated operational and security risk caused by deferring architectural modernization, refactoring, or end-of-life upgrades for short-term speed.',
            },
            {
              term: 'Privacy by Design',
              definition:
                'Embedding data minimization, consent, encryption, and retention limits directly into system architecture during SDLC design rather than bolting them on post-launch.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d4-l1-q1',
              question:
                'An enterprise migrates its HR records to a multi-tenant SaaS platform. Which security responsibility STILL rests primarily with the enterprise (customer)?',
              options: [
                'Physical perimeter guards at the cloud data center',
                'Patching the underlying virtualization hypervisor',
                'Managing user identities, role-based access provisioning/revocation, MFA enforcement, and data classification',
                'Maintaining cooling HVAC systems inside the provider’s server racks',
              ],
              correctIndex: 2,
              rationale:
                'Even in SaaS, the customer remains accountable for IAM (identities, roles, MFA, timely offboarding) and data classification/governance.',
            },
            {
              id: 'crisc-d4-l1-q2',
              question:
                'A business division wants to connect an experimental third-party Generative AI agent directly to internal customer support databases next week. What is the CRISC practitioner’s FIRST recommended action?',
              options: [
                'Approve immediate launch to maximize competitive advantage',
                'Conduct a structured pre-adoption risk & privacy impact assessment covering data leakage, vendor training opt-out, bias/hallucination risk, and regulatory obligations before granting data access',
                'Ban all AI technologies permanently across the entire enterprise',
                'Install RAID 5 on the support database',
              ],
              correctIndex: 1,
              rationale:
                'Risk-informed enablement evaluates emerging-technology risks BEFORE live data exposure so appropriate guardrails and business-owner approvals are established without blindly blocking innovation.',
            },
          ],
          practicalDrill: {
            title: 'Cloud Shared Responsibility & Emerging AI Risk Assessment',
            prompt:
              'Map responsibilities across IaaS/PaaS/SaaS and evaluate 3 GenAI risks.',
            steps: [
              'For IaaS vs. PaaS vs. SaaS, mark CSP vs. Customer ownership for: Physical DC, Guest OS Patching, Application Code, IAM/MFA, and Data Classification.',
              'Identify 3 primary risks of deploying an internal RAG/LLM chatbot connected to HR & legal documents.',
              'Define 1 preventive and 1 detective control for each AI risk.',
            ],
            successCriteria:
              '100% accurate IaaS/PaaS/SaaS boundaries and concrete controls for prompt injection, unauthorized ACL leakage, and shadow AI.',
          },
          flashcards: [
            {
              front: 'Across IaaS, PaaS, and SaaS, which responsibilities NEVER leave the cloud customer?',
              back: 'Data governance & classification, Identity & Access Management (IAM/MFA/offboarding), client endpoints, and overall regulatory accountability.',
              tag: 'CRISC-D4',
            },
            {
              front: 'How does Enterprise Architecture (EA) reduce IT risk?',
              back: 'By standardizing technology stacks, eliminating siloed shadow systems, reducing complexity/technical debt, and embedding consistent security patterns across business units.',
              tag: 'CRISC-D4',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/CRISC Exam Study Guide.pdf',
          ],
        },
        {
          id: 'crisc-d4-l2',
          title: 'Data Lifecycle, Privacy, IAM, Cryptography & Business Continuity Resilience',
          estimatedMinutes: 45,
          summary:
            'Protect information across every stage of the Data Lifecycle—classification, encryption, DLP, retention/secure disposal—and align IAM, Incident Response, and BCP/DRP (BIA/RTO/RPO) to enterprise risk tolerance.',
          learningObjectives: [
            'Apply controls proportionately across all 6 stages of the Data Lifecycle (Create -> Store -> Use -> Share -> Archive -> Destroy) driven by Data Classification.',
            'Select appropriate cryptographic protections for Data at Rest, Data in Transit, and Data in Use, plus strong IAM/Least Privilege/SoD controls.',
            'Integrate Incident Response, Crisis Management, Business Impact Analysis (BIA), and tested BCP/DRP directly with enterprise risk appetite.',
          ],
          coreConcepts: [
            {
              heading: 'Data Classification & the 6-Stage Data Lifecycle',
              explanation:
                'You cannot protect everything equally without going bankrupt—Data Classification (owned by the **Data Owner**, a business leader—NOT IT!) labels data by sensitivity and business criticality (e.g., Public, Internal, Confidential, Restricted) so controls scale proportionately across all six lifecycle stages: (1) Creation (apply sensitivity labels + data minimization—don’t collect PII you don’t need!), (2) Storage (AES-256 encryption at rest + secure KMS/HSM key separation), (3) Use (RBAC/ABAC least privilege, masking, confidential computing/TEEs), (4) Sharing (TLS 1.3 in transit, DLP egress rules, DPAs with third parties), (5) Archival (immutable retention per legal schedules), and (6) Destruction/Sanitization (cryptographic erasure, degaussing, physical shredding—NEVER simply deleting file pointers or tossing drives in trash!).',
              mentalModel:
                'Data Minimization secret: The safest, cheapest data to protect from a breach is sensitive data you never collected or already securely destroyed once its retention period expired!',
              formulaOrRule:
                'Data Owner (Business) classifies data & approves access | Data Custodian (IT) implements storage, backups, encryption & technical controls.',
            },
            {
              heading: 'Resilience Integration: BIA, RTO/RPO, Testing & Crisis Coordination',
              explanation:
                'Business Continuity Management (BCM) translates enterprise risk tolerance for downtime into operational survivability. Start with a Business Impact Analysis (BIA) identifying critical processes, Maximum Tolerable Downtime (MTD), Recovery Time Objective (RTO), and Recovery Point Objective (RPO). Validate recovery plans via progressive testing (Tabletop -> Simulation -> Parallel -> Full Interruption), preserve single-voice crisis communications across Legal/PR/Regulators, and ensure third-party SaaS vendors’ contracted RTO/RPO actually match YOUR enterprise BIA targets!',
              mentalModel:
                'A chain snaps at its weakest link: if your internal ERP has a 2-hour RTO but your outsourced cloud identity provider only guarantees a 24-hour SLA, your real business RTO is 24 hours!',
            },
          ],
          realWorldScenario: {
            title: 'The Retained 12-Year-Old Customer Archive Breach',
            situation:
              'A retailer suffers a breach of an unindexed legacy archive server containing 9 million former customers’ SSNs and payment records dating back 12 years—even though statutory tax/audit retention only required keeping records for 7 years.',
            analysis:
              'Failure of Data Lifecycle Destruction & Data Minimization multiplied breach cost, regulatory fines, and notification expenses by 5×. Enforcing automated retention schedules and certified cryptographic erasure/sanitization at end-of-life shrinks inherent breach exposure dramatically at near-zero cost.',
            takeaway:
              'Keeping unneeded sensitive data forever turns a minor security incident into a massive regulatory catastrophe. Enforce retention and secure disposal!',
          },
          examTraps: [
            'Trap: Assigning Data Classification responsibility to IT Administrators (Data Custodians). The Business Data Owner ALWAYS determines data classification and approves access; IT (Custodian) enforces technical controls.',
            'Trap: Thinking "Standard OS file deletion" or "Quick Format" sanitizes retired drives containing Restricted data. Secure disposal requires Cryptographic Erasure, NIST SP 800-88 Purge/Overwrite, Degaussing (magnetic media only—doesn’t work on SSDs!), or Physical Destruction.',
          ],
          keyTerms: [
            {
              term: 'Data Owner vs. Data Custodian',
              definition:
                'Data Owner (business executive) sets classification, retention, and access rules; Data Custodian (IT) operates technical storage, encryption, and backup safeguards.',
            },
            {
              term: 'Data Minimization',
              definition:
                'Privacy and risk principle limiting personal/sensitive data collection and retention strictly to what is necessary for stated lawful purposes.',
            },
            {
              term: 'Cryptographic Erasure (Crypto-Shredding)',
              definition:
                'Sanitizing encrypted storage (especially cloud or SSD media) by securely destroying the underlying encryption keys, rendering ciphertext permanently unrecoverable.',
            },
          ],
          conceptChecks: [
            {
              id: 'crisc-d4-l2-q1',
              question:
                'Who holds primary responsibility for determining the sensitivity classification level and retention period for a new enterprise customer loyalty database?',
              options: [
                'The Database Administrator (Data Custodian)',
                'The Network Operations Center Lead',
                'The Business Data Owner (e.g., VP of Customer Experience / Marketing)',
                'The External Penetration Tester',
              ],
              correctIndex: 2,
              rationale:
                'The Business Data Owner understands the business value, legal sensitivity, and operational impact of the data and therefore sets classification and access rules; IT Custodians implement the technical controls.',
            },
            {
              id: 'crisc-d4-l2-q2',
              question:
                'An enterprise retires 200 encrypted solid-state drives (SSDs) previously storing Restricted health records from a multi-tenant cloud-edge cluster. Which sanitization method is INEFFECTIVE for SSDs?',
              options: [
                'Cryptographic erasure (destroying the AES-256 encryption keys)',
                'Physical shredding/pulverizing of the flash memory chips',
                'Degaussing with a strong magnetic field',
                'Vendor-certified NIST SP 800-88 Purge command plus verification',
              ],
              correctIndex: 2,
              rationale:
                'Degaussing disrupts magnetic fields and ONLY works on magnetic media (HDDs/tapes)—it has ZERO effect on flash-based SSDs! Use cryptographic erasure, NIST Purge, or physical destruction for SSDs.',
            },
          ],
          practicalDrill: {
            title: 'Data Lifecycle & Third-Party RTO Alignment Audit',
            prompt:
              'Map controls across all 6 Data Lifecycle stages for customer payment data and check vendor DR alignment.',
            steps: [
              'Assign 1 primary risk control to each stage: Create, Store, Use, Share, Archive, Destroy (specify SSD/cloud sanitization!).',
              'Identify Data Owner vs. Data Custodian for the database.',
              'Spot the hidden resilience flaw when your internal app has RTO = 4h, RPO = 15m, while its critical authentication SaaS SLA guarantees RTO = 24h.',
            ],
            successCriteria:
              'All six stages covered with Data Minimization and Crypto-Shredding/Physical Destruction, proper Owner/Custodian split, and vendor SLA gap exposed.',
          },
          flashcards: [
            {
              front: 'Contrast Data Owner vs. Data Custodian on ISACA CRISC.',
              back: 'Data Owner (Business) classifies data, sets retention, and authorizes access; Data Custodian (IT) implements and maintains technical safeguards, backups, and encryption.',
              tag: 'CRISC-D4',
            },
            {
              front: 'Why does degaussing NOT sanitize Solid-State Drives (SSDs)?',
              back: 'SSDs store data electronically in NAND flash memory rather than magnetically—use cryptographic erasure, NIST SP 800-88 Purge, or physical destruction instead.',
              tag: 'CRISC-D4',
            },
          ],
          sourceRefs: [
            'my_documents/CRISC Review Manual.pdf',
            'my_documents/CRISC Exam Study Guide.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Capstone: Enterprise IT Risk Transformation at Stratos Logistics Group (CRISC)',
    scenario:
      'Stratos Logistics Group is modernizing its global freight-routing ecosystem across 14 countries. As the newly hired Lead CRISC Practitioner, you uncover four intertwined challenges: (1) Freight business leaders treat IT risk as "the CIO’s job" and hide project delays to keep monthly status slides green; (2) An upcoming AI route-optimization SaaS vendor holds SOC 2 Type II, yet nobody reviewed its CUECs or checked that its 24-hour RTO contradicts Stratos’s 4-hour dispatch MTD; (3) Two top risks sit tied as "High" on a crude qualitative heat map—one is a $150k/yr laptop-theft risk and the other is a potential $18M ransomware shutdown of automated ports—and IT wants $500k/yr for a control that only cuts $120k/yr in exposure; (4) Executive dashboards show only backward-looking incident counts with zero leading KRIs and a Risk Register last edited 11 months ago.',
    tasks: [
      'D1 Governance: Re-establish Risk Ownership accountability (Board vs. Business Risk Owners vs. IT Control Owners vs. Risk Practitioner) and outline a Risk Culture intervention to eliminate "watermelon" green-washing.',
      'D2 Risk Assessment: Draft a 6-element Risk IT Scenario for the automated port ransomware exposure, explain how to prevent workshop groupthink (Delphi), and use Quantitative ALE/FAIR modeling to break the heat-map tie and reject the irrational $500k control.',
      'D3 Risk Response & Reporting: Choose exact risk responses (Mitigate, Transfer, Avoid, Accept) across the portfolio, convert the static spreadsheet into a Living Risk Register, and engineer 4 predictive Leading KRIs with Amber/Red thresholds.',
      'D4 IT & Security: Close the SaaS Shared Responsibility, CUEC, vendor-RTO mismatch, and AI data-minimization/lifecycle gaps before production go-live.',
    ],
    modelSolution:
      '1) Governance & Culture (D1): Present a clear Risk Governance Charter to the Board Risk Committee establishing Board-approved Risk Appetite and naming Freight VPs as accountable Business Risk Owners (never the CIO or Risk Practitioner). Repair the punitive "watermelon" Risk Culture by having the CEO visibly reward transparent early risk escalation, aligning executive bonuses to risk-adjusted delivery, and introducing blameless independent 2nd-line review.\n2) Risk Assessment (D2): Run anonymous Delphi elicitation combined with Top-Down (business dispatch goals) + Bottom-Up (technical scans) identification. Write a complete 6-element port ransomware scenario tying threat actor, vulnerability, timing (peak holiday shipping), asset, and $18M business loss. Run Quantitative ALE/FAIR analysis proving port ransomware dominates capital allocation over laptop theft, and reject the $500k control cutting only $120k ALE (negative net benefit of −$380k/yr) in favor of cost-proportionate segmentation + immutable backups.\n3) Risk Response & Reporting (D3): Pair Risk Mitigation (MFA, segmentation, immutable backups) with Risk Transfer (catastrophic cyber/BI insurance) for port ransomware, and formal documented Risk Acceptance (by Risk Owner, inside appetite) where mitigation is uneconomical. Turn the Risk Register into a continuously updated live system linked to 4 Leading KRIs: (a) % critical Tier-1 systems with verified restore tests inside RTO, (b) % emergency unapproved production changes, (c) overdue critical internet-facing patches past SLA, and (d) Tier-1 vendors with open CUEC or RTO alignment gaps—triggering Amber (Risk Owner) and Red (Executive Committee) escalations.\n4) IT & Security Controls (D4): Before connecting live logistics data to the AI SaaS vendor, complete a pre-adoption Risk & Privacy Impact Assessment, assign internal IT Control Owners for every SOC 2 CUEC (SSO/MFA, RBAC, prompt offboarding), negotiate a contractual RTO <= 2h (matching Stratos’s 4h MTD with WRT buffer) or build a fallback dispatch workflow, enforce Data Classification/Minimization, and set retention + crypto-shredding disposal schedules.',
  },
  examStrategy: {
    examFormat:
      'ISACA CRISC (7th Edition): 150 multiple-choice questions in 240 minutes (4 hours). Scaled passing score: 450 / 800. Domain 3 (Risk Response & Reporting — 32%) and Domain 1 (Governance — 26%) together represent 58% of the exam!',
    timeManagementPlan:
      'Pace at ~72 seconds per question (50 questions/hour), completing your first full pass in 3 hours so you preserve 60 minutes to carefully audit flagged FIRST / BEST / PRIMARY / MOST questions.',
    mindsetRules: [
      'You Are an Objective Risk Advisor—NOT the Risk Owner and NOT the Fix-It Admin: Never unilaterally accept risk, modify appetite, or configure controls; advise, quantify, document in the Risk Register, and escalate!',
      'Business Alignment Rules Everything: IT risk IS business risk. Always prioritize solutions anchored to enterprise objectives, Risk Appetite, and CFO-sound cost-benefit ROI.',
      'Master Ownership Boundaries: Board sets Enterprise Risk Appetite; Business Risk Owner owns risk & accepts residual risk within appetite; Control Owner runs controls; Data Owner classifies data; Data Custodian (IT) secures it.',
      'Leading KRIs Beat Lagging Counts Every Time: When asked for the BEST KRI, pick the forward-looking early-warning signal tied to a root cause BEFORE loss occurs.',
      'Know Your Special Tools Cold: Dominance/groupthink bias -> Delphi Method; Rare catastrophic dollar loss -> Risk Transfer (Insurance); Negative ROI & above appetite -> Risk Avoidance; Small team SoD -> Compensating Controls.',
      'Control Self-Assessment (CSA) Caveat: Great for 1st-line ownership and speed, NEVER a replacement for independent 3rd-line audit!',
    ],
    finalWeekChecklist: [
      'Score >=85% across all 4 CRISC domains in `my_documents/Crisc Q A.pdf`—especially Domain 3 (32%) and Domain 1 (26%).',
      'Drill SLE/ARO/ALE/Net-Benefit math and FAIR (LEF × LM) concepts until automatic.',
      'Review all Risk Ownership role boundaries (Board vs. Risk Owner vs. Control Owner vs. Data Owner vs. Data Custodian vs. Risk Practitioner).',
      'Memorize Risk Capacity vs. Appetite vs. Tolerance, Leading KRI vs. Lagging KPI vs. KCI, and all 4 Risk Responses (Avoid, Mitigate, Transfer, Accept).',
      'Review `my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf` core principles and run two full timed 150-question endurance mocks.',
    ],
  },
};
