/* ===================================================================
   ANOXPASS — ISACA CISM End-to-End Certification Course (16th Ed)
   Tier 4 (Specialist) | All 4 Official Domains | Zero-to-Exam-Ready
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const CISM_COURSE: CertificationCourse = {
  certId: 'cism',
  certCode: 'CISM',
  title: 'ISACA Certified Information Security Manager',
  provider: 'ISACA',
  tier: 4,
  tagline: 'Lead business-aligned enterprise information security governance, risk, programs, and incident response.',
  estimatedTotalHours: 100,
  passingScore: '450 / 800 (Scaled)',
  domains: [
    // =================================================================
    // DOMAIN 1: INFORMATION SECURITY GOVERNANCE (17%)
    // =================================================================
    {
      id: 'cism-d1',
      domainNumber: 1,
      title: 'Information Security Governance',
      examWeightPercent: 17,
      overview:
        'Establishes the boardroom mandate for security. Covers the six strategic outcomes of security governance, aligning security strategy strictly to enterprise business objectives, navigating corporate culture, and structuring Steering Committees and RACI accountability.',
      lessons: [
        {
          id: 'cism-d1-l1',
          title: 'Security Governance Foundations, Strategic Alignment & The 6 Outcomes',
          estimatedMinutes: 45,
          summary:
            'Master ISACA’s exact distinction between Governance (directing & monitoring) and Management (executing), the six mandatory outcomes of effective security governance, and why business alignment precedes every security action.',
          learningObjectives: [
            'Distinguish Governance (Board/Executive direction and oversight) from Management (planning, building, running, monitoring operations).',
            'Recite and apply ISACA’s 6 Outcomes of Information Security Governance (Strategic Alignment, Risk Management, Value Delivery, Resource Optimization, Performance Measurement, Assurance Process Integration).',
            'Recognize Senior Management commitment ("Tone at the Top") as the #1 prerequisite for any governance or program initiative.',
          ],
          coreConcepts: [
            {
              heading: 'Governance vs. Management & The 6 Governance Outcomes',
              explanation:
                'ISACA separates Governance from Management cleanly: Governance (owned by the Board of Directors and Executive Leadership) evaluates stakeholder needs, sets strategic direction, and monitors compliance and performance. Management (led by the CISO / Information Security Manager) plans, builds, runs, and monitors activities in alignment with that direction. Effective Information Security Governance MUST deliver six exact outcomes: (1) Strategic Alignment (security enables business goals); (2) Risk Management (mitigating threats to acceptable levels); (3) Value Delivery (optimizing security investments to support business objectives); (4) Resource Optimization (using capital, staff, and tech efficiently); (5) Performance Measurement (tracking progress via meaningful metrics); and (6) Assurance Process Integration (coordinating audit, risk, compliance, and security functions to eliminate silos).',
              mentalModel:
                'The Board steers the ship’s destination and checks the compass (Governance); the CISO and engineering crew run the engines and navigate daily waves (Management).',
              formulaOrRule: 'CISM Golden Axiom: Security exists SOLELY to enable and protect business objectives—NEVER for security’s own sake.',
            },
            {
              heading: 'Tone at the Top & Business Alignment First',
              explanation:
                'On the CISM exam, whenever a newly hired Information Security Manager starts a security program or governance initiative, the VERY FIRST step is ALWAYS understanding the organization’s business objectives and securing Senior Management sponsorship ("Tone at the Top"). Without executive backing and alignment with business goals, policies are ignored, budgets are rejected, and security is viewed as an obstructive roadblock ("Department of No").',
              mentalModel:
                'Never write a security policy in an ivory tower before reading the company’s 3-year business strategy—otherwise you build a castle wall around the wrong city.',
              formulaOrRule: 'Most Important Success Factor for Governance = Senior Management Support & Alignment with Business Goals.',
            },
          ],
          realWorldScenario: {
            title: 'Resetting a Rejected Security Strategy at a Retail Conglomerate',
            situation:
              'A newly appointed Information Security Manager spends 60 days drafting a 90-page ISO 27001 technical control policy mandating strict blocks on all cloud SaaS and third-party marketing APIs. When presented to the Executive Committee, the CEO rejects the entire charter immediately.',
            analysis:
              'The manager failed ISACA’s cardinal governance rule: they prioritized technical compliance templates before understanding the business strategy (which centered on rapid omnichannel e-commerce growth via SaaS partners). Re-anchoring the strategy around enabling secure SaaS onboarding and presenting risk trade-offs in business revenue terms earns immediate executive sponsorship.',
            takeaway:
              'Always begin by interviewing business unit leaders and aligning the security strategy directly to corporate revenue, growth, and regulatory priorities.',
          },
          examTraps: [
            'ISACA classic: "What is the MOST important factor for the success of an information security governance program?" ALWAYS select "Senior Management support / commitment" or "Alignment with business objectives" (never "latest security tools" or "technical staff certifications").',
            'Remember: The Board of Directors holds ULTIMATE accountability for enterprise governance—the Information Security Manager advises and executes.',
            'Assurance Process Integration specifically means aligning separate assurance silos (Internal Audit, Legal, Compliance, Physical Security, IT Risk, BCP) so they speak one common risk language instead of duplicating audits.',
          ],
          keyTerms: [
            { term: 'Strategic Alignment', definition: 'Ensuring information security strategy directly supports and enables enterprise business goals and stakeholder value.' },
            { term: 'Value Delivery', definition: 'Optimizing security investments to achieve proportional risk reduction and measurable business enablement.' },
            { term: 'Assurance Process Integration', definition: 'Integrating all enterprise assurance functions (audit, legal, privacy, physical, cyber risk) to eliminate gaps and redundant efforts.' },
            { term: 'Tone at the Top', definition: 'Visible commitment, ethical behavior, and active sponsorship demonstrated by the Board and C-Suite toward security governance.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d1-l1-q1',
              question:
                'A newly hired Information Security Manager is tasked with establishing an enterprise information security governance framework from scratch. What should the manager do FIRST?',
              options: [
                'Purchase an enterprise SIEM and vulnerability scanner',
                'Understand the organization’s business objectives and strategic direction',
                'Publish mandatory workstation password complexity standards',
                'Conduct an unannounced social engineering penetration test',
              ],
              correctIndex: 1,
              rationale:
                'ISACA emphasizes that security governance must be strictly driven by business objectives. Before drafting policies or buying tools, the manager must first understand what the business does, what it values, and where it is heading.',
            },
            {
              id: 'cism-d1-l1-q2',
              question:
                'An enterprise suffers from audit fatigue because Internal Audit, Privacy, Physical Security, and Cyber Risk independently issue conflicting questionnaires to business units every quarter. Which governance outcome is MOST clearly failing?',
              options: [
                'Resource Optimization',
                'Assurance Process Integration',
                'Incident Containment',
                'Cryptographic Standardization',
              ],
              correctIndex: 1,
              rationale:
                'Assurance Process Integration coordinates overlapping assurance functions (audit, risk, compliance, security) to eliminate silos, conflicting directives, and redundant assessments.',
            },
          ],
          practicalDrill: {
            title: 'Board-Ready Governance Charter Alignment',
            prompt:
              'Draft the executive summary of an Information Security Governance Charter for a fast-growing digital bank.',
            steps: [
              'Interview the CEO/CFO/COO (simulated) to extract top 3 business objectives (e.g., mobile expansion, zero payment downtime, regulatory licensing).',
              'Map each of ISACA’s 6 Governance Outcomes to one concrete executive KPI/KGI.',
              'Clarify Board accountability (Evaluate-Direct-Monitor) vs. CISO management execution.',
            ],
            successCriteria:
              'Charter directly links security governance to business goals, secures Board sponsorship, and covers all 6 ISACA outcomes.',
          },
          flashcards: [
            { front: 'List all 6 ISACA Outcomes of Information Security Governance.', back: '1) Strategic Alignment, 2) Risk Management, 3) Value Delivery, 4) Resource Optimization, 5) Performance Measurement, 6) Assurance Process Integration.', tag: 'cism-d1' },
            { front: 'What is the #1 prerequisite for security governance success on CISM?', back: 'Senior Management commitment/sponsorship ("Tone at the Top") and alignment with enterprise business objectives.', tag: 'cism-d1' },
            { front: 'Governance vs. Management in ISACA terms?', back: 'Governance sets direction, evaluates needs, and monitors performance (Board/Execs); Management plans, builds, runs, and monitors day-to-day operations.', tag: 'cism-d1' },
          ],
          sourceRefs: [
            'my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub',
            'my_documents/CISM - 16th Edition Exam Topics.pdf',
          ],
        },
        {
          id: 'cism-d1-l2',
          title: 'Security Strategy Development, Gap Analysis & Organizational Culture',
          estimatedMinutes: 40,
          summary:
            'Build an actionable Information Security Strategy from Current State vs. Desired State gap analysis, align policies to culture, and leverage frameworks (COBIT, ISO 27001, NIST CSF).',
          learningObjectives: [
            'Formulate an Information Security Strategy by defining Desired State, assessing Current State, conducting Gap Analysis, and building a prioritized roadmap.',
            'Recognize how organizational culture, structure (centralized vs. decentralized), and risk appetite shape security strategy adoption.',
            'Map policies, standards, procedures, and guidelines to strategy execution and manage formal Policy Exceptions.',
          ],
          coreConcepts: [
            {
              heading: 'Developing an Information Security Strategy (Current vs. Desired State)',
              explanation:
                'An Information Security Strategy is the multi-year bridge between business objectives and tactical security programs. Building it follows a disciplined sequence: (1) Define the Desired State (target maturity/capability aligned to business risk appetite, e.g., CMMI Level 3 or NIST Tier 3); (2) Assess the Current State (baseline capabilities, existing controls, culture, and gaps); (3) Perform Gap Analysis (measure distance between Current and Desired); (4) Create a Risk-Prioritized Roadmap with business cases, resource needs, and Key Goal Indicators (KGIs).',
              mentalModel:
                'GPS navigation needs two coordinates before plotting a route: your Destination (Desired State) and your Starting Pin (Current State). Gap Analysis is the road map connecting them.',
              formulaOrRule: 'Strategy Creation Order: Business Objectives -> Desired State -> Current State Assessment -> Gap Analysis -> Prioritized Roadmap.',
            },
            {
              heading: 'Organizational Culture & Managing Policy Exceptions',
              explanation:
                'Peter Drucker’s rule governs CISM: "Culture eats strategy for breakfast." A rigid command-and-control policy copy-pasted from a bank will fail instantly inside an open academic research university or startup—the security manager must tailor communication and control friction to organizational culture. When a business unit cannot comply with a policy, NEVER grant informal verbal waivers and NEVER ignore non-compliance! Require a Formal Policy Exception process: documented business justification, Risk Assessment quantifying exposure, Compensating Controls reducing residual risk, explicit Executive/Risk Owner sign-off, AND a mandatory Expiration Date forcing periodic review!',
              mentalModel:
                'A Policy Exception is a temporary medical prescription with an expiration date—never a permanent lifetime hall pass to ignore security.',
              formulaOrRule: 'Valid Policy Exception Requires: Risk Analysis + Compensating Controls + Business Risk Owner Sign-Off + Mandatory Expiration Date.',
            },
          ],
          realWorldScenario: {
            title: 'Handling an Urgent Sales Request to Bypass Encryption Policy',
            situation:
              'A regional VP of Sales wants to connect a legacy client CRM feed that only supports unencrypted FTP, threatening that blocking it will lose a $3M deal. They demand the Information Security Manager "just approve a permanent waiver today."',
            analysis:
              'An ISACA CISM manager neither blindly refuses business revenue nor casually waives security permanently. Instead, the manager invokes the Formal Policy Exception process: quantifies the risk exposure, implements compensating controls (IPsec VPN tunnel wrapping the FTP feed + IP allowlisting + automated monitoring), secures written risk acceptance from the Business/Data Owner (not the CISO!), and sets a strict 90-day expiration date for migrating to SFTP.',
            takeaway:
              'Never accept business risk on behalf of business executives—quantify the risk, propose compensating controls, obtain Business Owner sign-off, and time-box every exception.',
          },
          examTraps: [
            'On CISM, the Information Security Manager NEVER accepts residual business risk—ONLY Senior Management / the Business Risk Owner has authority to accept risk!',
            'Watch for "Policy Exception" questions: the BEST answer always includes documented risk assessment, compensating controls, business owner approval, AND a time-bound expiration/review date.',
            'Centralized security governance ensures uniform consistency and lower cost; Decentralized governance provides faster local responsiveness to diverse global subsidiaries (at the risk of inconsistent compliance).',
          ],
          keyTerms: [
            { term: 'Desired State', definition: 'Target security maturity and capability profile required to meet business objectives within approved risk appetite.' },
            { term: 'Policy Exception', definition: 'Formally approved, time-bound deviation from security policy requiring risk assessment, compensating controls, and risk-owner sign-off.' },
            { term: 'Key Goal Indicator (KGI)', definition: 'Lagging strategic metric confirming whether a governance or business objective has actually been achieved.' },
            { term: 'Gap Analysis', definition: 'Structured comparison between current security posture and desired target state to prioritize remediation investments.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d1-l2-q1',
              question:
                'A business unit cannot meet a mandatory encryption standard on a critical revenue-generating legacy system for the next six months. What is the Information Security Manager’s BEST course of action?',
              options: [
                'Unilaterally accept the risk on behalf of the company and grant a permanent waiver',
                'Immediately shut down the legacy server until encryption is installed',
                'Assess the risk, implement compensating controls, obtain formal Business Owner risk acceptance, and set an exception expiration date',
                'Delete the encryption requirement from corporate security policy',
              ],
              correctIndex: 2,
              rationale:
                'Formal exception management balances business enablement with risk governance: evaluate the risk, reduce exposure via compensating controls, ensure the appropriate Business Risk Owner signs formal acceptance, and enforce an expiration date for re-evaluation.',
            },
            {
              id: 'cism-d1-l2-q2',
              question:
                'Which factor is the MOST critical obstacle to overcome when implementing a newly approved corporate information security strategy across recently acquired international subsidiaries?',
              options: [
                'Selecting an antivirus vendor',
                'Aligning security practices with differing organizational cultures and local legal norms',
                'Upgrading workstation monitors',
                'Replacing fiber optic cables',
              ],
              correctIndex: 1,
              rationale:
                'Organizational culture heavily dictates whether policies are adopted or bypassed ("shadow workarounds"). Adapting governance engagement to local corporate culture and regulatory regimes is essential for sustainable adoption.',
            },
          ],
          practicalDrill: {
            title: 'Strategy Gap Analysis & Time-Bound Exception Template',
            prompt:
              'Design a 1-page Security Strategy Gap Analysis and Formal Policy Exception form.',
            steps: [
              'Benchmark Current State (e.g., NIST CSF Tier 1) vs. Desired State (Tier 3) across Govern, Protect, Detect, Respond, Recover.',
              'Prioritize top 3 gaps by business risk reduction per dollar invested.',
              'Build a Policy Exception intake template requiring: Business Justification, Quantified Risk Rating, Compensating Control, Business Owner Signature, and <= 180-day Expiration Date.',
            ],
            successCriteria:
              'Deliverables anchor strategy to Gap Analysis and lock down Policy Exceptions with Risk Owner sign-off and expiration dates.',
          },
          flashcards: [
            { front: 'Who has authority to accept residual business risk on a policy exception?', back: 'Senior Management / the Business Risk Owner (NEVER the Information Security Manager unilaterally!).', tag: 'cism-d1' },
            { front: 'What 4 elements make a Policy Exception valid under ISACA CISM?', back: '1) Documented Risk Assessment, 2) Compensating Controls, 3) Business Risk Owner Approval, 4) Fixed Expiration/Review Date.', tag: 'cism-d1' },
            { front: 'What is the difference between a KGI and a KPI?', back: 'KGI (Key Goal Indicator) tells you AFTER the fact whether you achieved the strategic goal; KPI (Key Performance Indicator) tells you DURING execution how well the process is performing toward that goal.', tag: 'cism-d1' },
          ],
          sourceRefs: ['my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub'],
        },
        {
          id: 'cism-d1-l3',
          title: 'Governance Roles, Security Steering Committee & Reporting Lines',
          estimatedMinutes: 40,
          summary:
            'Structure conflict-free CISO reporting lines, leverage an Information Security Steering Committee for cross-enterprise buy-in, and apply RACI and the IIA Three Lines Model.',
          learningObjectives: [
            'Explain why an Information Security Steering Committee is the #1 mechanism for cross-departmental governance consensus and alignment.',
            'Evaluate optimal CISO reporting lines (CEO, CRO, General Counsel, Board Audit Committee) vs. conflict-of-interest reporting to the CIO.',
            'Assign unambiguous accountability using RACI charts (exactly ONE Accountable per task!) and the Three Lines Model.',
          ],
          coreConcepts: [
            {
              heading: 'Information Security Steering Committee (ISACA’s Favorite Answer!)',
              explanation:
                'An Information Security Steering Committee brings together senior stakeholders from across the enterprise—IT, Legal, HR, Finance, Operations, Risk, Audit, and Business Unit leaders—chaired by an executive sponsor. Its primary purpose is ensuring cross-functional consensus, resolving competing business vs. security priorities, aligning security investments with enterprise strategy, and validating policies BEFORE rollout so departments genuinely own compliance instead of fighting it.',
              mentalModel:
                'The Steering Committee is the enterprise parliament: when Legal, Sales, Ops, and IT co-author security priorities at the same table, nobody can claim security was forced on them.',
              formulaOrRule: 'CISM Pattern: Cross-department disagreement / Lack of business buy-in / Prioritizing security projects -> Establish or consult the Information Security Steering Committee!',
            },
            {
              heading: 'CISO Reporting Lines & Independence (Avoiding CIO Conflict)',
              explanation:
                'Where should the Information Security Manager / CISO report? Reporting directly to the CIO creates an inherent CONFLICT OF INTEREST because the CIO is incentivized on IT uptime, delivery speed, and cutting IT cost—creating pressure to suppress or under-report security flaws! Ideal reporting lines preserve independence: reporting to the CEO, Chief Risk Officer (CRO), Chief Operating Officer (COO), General Counsel, or CFO—paired with a direct dotted-line (unfiltered) reporting channel to the Board Audit & Risk Committee.',
              mentalModel:
                'Having the CISO report solely to the CIO is like having the restaurant health inspector report to the head chef—conflict of interest is built into the org chart.',
              formulaOrRule: 'Avoid CISO -> CIO Conflict of Interest. Best Independence = Report to CEO/CRO/Legal + Direct Access to Board Audit Committee.',
            },
            {
              heading: 'RACI Accountability & The Three Lines Model',
              explanation:
                'Every governance task requires clear RACI roles: Responsible (does the work), Accountable (owns final sign-off and answerability — MUST BE EXACTLY ONE PERSON per task!), Consulted (two-way expert input), Informed (one-way status updates). Under the IIA Three Lines Model: Line 1 = Operational Management & IT (owns and manages daily risk/controls); Line 2 = Information Security, Risk Management & Compliance (sets standards, monitors, advises Line 1); Line 3 = Internal Audit (independent assurance reporting straight to the Board — NEVER designs or operates controls!).',
              mentalModel:
                'If TWO people are "Accountable" on a RACI chart, NOBODY is accountable when things fail.',
              formulaOrRule: 'RACI Golden Rule: Exactly ONE "A" (Accountable) per row. Line 3 (Internal Audit) MUST stay independent (never implements controls).',
            },
          ],
          realWorldScenario: {
            title: 'Resolving Reporting-Line Conflict Before an IPO',
            situation:
              'Ahead of an Initial Public Offering (IPO), external auditors flag that the CISO reports two levels beneath the CIO, and critical security vulnerability findings were softened in Board packets to avoid delaying product launches.',
            analysis:
              'Burying the CISO under IT delivery creates an organizational conflict of interest that compromises board visibility into cyber risk. Re-aligning the CISO to report to the Chief Risk Officer (or CEO) with direct quarterly briefings to the Board Audit Committee—and chartering a cross-functional Information Security Steering Committee—restores independence and governance integrity.',
            takeaway:
              'Org-chart placement determines whether security has independent voice or gets muted by operational delivery pressures.',
          },
          examTraps: [
            'ISACA classic: "Who is BEST positioned to ensure security initiatives remain aligned with business unit needs across the organization?" -> Information Security Steering Committee!',
            'Wait: NEVER put Internal Audit in charge of implementing security controls or approving operational configurations—that destroys Line 3 independence!',
            'On a RACI chart, multiple people can be Responsible (R), Consulted (C), or Informed (I), but ONLY ONE role can be Accountable (A).',
          ],
          keyTerms: [
            { term: 'Information Security Steering Committee', definition: 'Cross-functional executive body providing strategic oversight, priority alignment, and business buy-in for the security program.' },
            { term: 'RACI Matrix', definition: 'Governance tool defining Responsible, Accountable (strictly one per activity), Consulted, and Informed roles.' },
            { term: 'Three Lines Model', definition: 'Governance structure separating Operational Owners (1st Line), Risk/Security Oversight (2nd Line), and Independent Internal Audit (3rd Line).' },
          ],
          conceptChecks: [
            {
              id: 'cism-d1-l3-q1',
              question:
                'To maximize objectivity and avoid operational conflicts of interest, to whom should the Chief Information Security Officer (CISO) ideally NOT report exclusively?',
              options: [
                'Chief Risk Officer (CRO)',
                'Chief Information Officer (CIO)',
                'Chief Executive Officer (CEO)',
                'General Counsel / Chief Legal Officer',
              ],
              correctIndex: 1,
              rationale:
                'The CIO is primarily measured on IT uptime, delivery speed, and infrastructure cost efficiency, creating a direct conflict of interest if the CISO must report IT security gaps exclusively through the CIO.',
            },
            {
              id: 'cism-d1-l3-q2',
              question:
                'Which governance body is MOST effective at securing cross-departmental buy-in and ensuring security priorities stay continuously aligned with evolving business unit goals?',
              options: [
                'SOC Tier 1 Shift Lead team',
                'Information Security Steering Committee',
                'External Penetration Testing vendor',
                'IT Help Desk escalation queue',
              ],
              correctIndex: 1,
              rationale:
                'An Information Security Steering Committee brings senior representatives from all major business units together to govern priorities, resolve conflicts, and align security investments with enterprise strategy.',
            },
          ],
          practicalDrill: {
            title: 'CISO Charter, Steering Committee & RACI Design',
            prompt:
              'Design a conflict-free governance structure for a 2,000-employee multinational firm.',
            steps: [
              'Place the CISO reporting to the CRO/CEO with direct dotted-line quarterly access to the Board Audit Committee.',
              'Charter an Information Security Steering Committee naming exact members (Business VPs, CIO, Legal, HR, CFO rep, CISO, Internal Audit as non-voting observer).',
              'Construct a 5-row RACI verifying strictly ONE "A" per activity and preserving Internal Audit’s Line 3 independence.',
            ],
            successCriteria:
              'Design eliminates CIO conflict, includes Audit strictly as non-voting observer, and obeys the single-"A" RACI law.',
          },
          flashcards: [
            { front: 'Why should the CISO avoid reporting solely to the CIO?', back: 'Conflict of interest—the CIO is incentivized on IT speed, uptime, and cost reduction, which can conflict with transparent reporting of security risks.', tag: 'cism-d1' },
            { front: 'What is the #1 rule of a RACI matrix?', back: 'There MUST be EXACTLY ONE "A" (Accountable) role per task or decision.', tag: 'cism-d1' },
            { front: 'What is Internal Audit’s role on an Information Security Steering Committee?', back: 'Independent non-voting advisor/observer (Line 3) so audit objectivity is never compromised by owning management decisions.', tag: 'cism-d1' },
          ],
          sourceRefs: [
            'my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub',
            'my_documents/CISM QA, 9th Edition.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: INFORMATION SECURITY RISK MANAGEMENT (20%)
    // =================================================================
    {
      id: 'cism-d2',
      domainNumber: 2,
      title: 'Information Security Risk Management',
      examWeightPercent: 20,
      overview:
        'Covers identifying and valuing information assets, conducting Business Impact Analyses and threat/vulnerability assessments, aligning treatments with Risk Appetite vs. Risk Tolerance, managing third-party risk, and operating a living Enterprise Risk Register.',
      lessons: [
        {
          id: 'cism-d2-l1',
          title: 'Asset Valuation, Classification & Business Impact Analysis (BIA)',
          estimatedMinutes: 45,
          summary:
            'Anchor risk management in complete asset inventories, accurate business-value classification owned by Information Owners, and BIA-driven criticality ranking.',
          learningObjectives: [
            'Explain why Asset Identification and Classification is the foundational FIRST step of Risk Management.',
            'Assign Asset Valuation based on business criticality, replacement cost, regulatory fines, and brand impact—not merely hardware purchase price.',
            'Leverage Business Impact Analysis (BIA) to connect IT assets directly to business processes, dependencies, and outage impact.',
          ],
          coreConcepts: [
            {
              heading: 'Asset Identification & Classification Come First',
              explanation:
                'You cannot protect or assess risk on assets you do not know you own. The FIRST operational step of Information Security Risk Management is establishing a comprehensive inventory of information assets, assigning an accountable Information/Data Owner (business executive) to every asset, and classifying each asset by business value and sensitivity. Crucially, an asset’s true value is NOT its server hardware invoice—a $2,000 server storing $50 million in unreleased pharmaceutical formulas is worth $50 million to risk calculations!',
              mentalModel:
                'A USB stick costs $10 at a stationery store, but if it holds the company’s source code and customer database, its Asset Value is millions of dollars.',
              formulaOrRule: 'Risk Management Step 1 = Identify Assets -> Assign Business Owners -> Classify by Business Value/Criticality.',
            },
            {
              heading: 'Business Impact Analysis (BIA) & Dependency Mapping',
              explanation:
                'The BIA bridges technical infrastructure to business survival by asking business unit leaders: "If process X stops for 1 hour, 24 hours, or 7 days, what exact revenue, legal, and reputational harm occurs?" It uncovers hidden upstream/downstream dependencies (such as a minor authentication microservice whose outage halts a $1M/hour factory floor!) and defines Maximum Tolerable Downtime (MTD/MAO), RTO, RPO, and Recovery Order Priority.',
              mentalModel:
                'Dependency mapping reveals the $50 spark plug hiding inside a $500,000 engine—without BIA, IT prioritizes big expensive servers while overlooking small critical chokepoints.',
              formulaOrRule: 'BIA Owner = Driven by Business Unit Owners (facilitated by Security/BC Manager), NEVER guessed solely by IT!',
            },
          ],
          realWorldScenario: {
            title: 'Uncovering a Hidden Critical Asset Through BIA Valuation',
            situation:
              'An IT team ranked a legacy Windows print/label server as "Low Priority" because the server hardware was 8 years old and worth $400. During a formal BIA with warehouse managers, the CISM manager discovered that if that server goes down, zero shipping barcodes print and all 14 global distribution hubs halt completely within 45 minutes.',
            analysis:
              'Hardware replacement cost completely misrepresented true business value! Conducting a business-driven BIA exposed the hidden single point of failure, re-classifying the server as Tier-1 Critical and justifying redundant failover and strict access hardening.',
            takeaway:
              'Always let Business Owners define asset criticality and downtime impact via BIA—IT hardware price tags blind you to real operational risk.',
          },
          examTraps: [
            'CISM classic: "What is the FIRST step in establishing an effective risk management program / data classification scheme?" -> Identify and inventory information assets and their Business Owners!',
            'Who determines the classification and criticality of an information asset? ALWAYS the Data/Information Owner (business executive), NEVER IT or the Security Manager.',
            'Watch out for Aggregated Data valuation: combining multiple "Internal" datasets into one central data lake often elevates the composite lake to "Confidential/Restricted"!',
          ],
          keyTerms: [
            { term: 'Information/Data Owner', definition: 'Business executive accountable for determining asset value, classification, acceptable risk, and access authorization.' },
            { term: 'Asset Valuation', definition: 'Determining an asset’s true worth to the enterprise including revenue impact, IP value, regulatory penalties, and brand reputation.' },
            { term: 'Dependency Mapping', definition: 'Tracing upstream and downstream technology, people, and vendor links required to sustain critical business processes.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d2-l1-q1',
              question:
                'What is the MOST important criterion when determining the value of an enterprise information asset for risk management prioritization?',
              options: [
                'Original purchase price of the physical server hardware',
                'Business impact to the organization if the asset’s confidentiality, integrity, or availability is compromised',
                'Number of terabytes the database occupies on disk',
                'Age of the operating system running on the host',
              ],
              correctIndex: 1,
              rationale:
                'True asset valuation reflects the business, financial, legal, and reputational impact of compromise—not physical hardware depreciation or storage size.',
            },
            {
              id: 'cism-d2-l1-q2',
              question:
                'Who is PRIMARILY responsible for assigning the sensitivity classification level to a newly deployed customer analytics dataset?',
              options: [
                'Database Administrator',
                'Information Security Manager',
                'Business Data Owner',
                'Internal Audit Director',
              ],
              correctIndex: 2,
              rationale:
                'Under ISACA governance, the Business Data Owner knows the business value and regulatory obligations of the information and therefore assigns classification; Security advises and IT Custodians implement controls.',
            },
          ],
          practicalDrill: {
            title: 'BIA-Driven Criticality & Dependency Register',
            prompt:
              'Re-evaluate 4 enterprise systems (Payroll, Public Blog, Warehouse Label Server, R&D Formula Vault) by true business impact.',
            steps: [
              'Assign a named Business Owner to each asset.',
              'Score CIA impact (Financial, Legal, Reputational) independent of hardware replacement cost.',
              'Map hidden upstream dependencies (IdP, DNS, cloud KMS) that inherit the highest criticality of any system depending on them.',
            ],
            successCriteria:
              'Register elevates hidden chokepoints to Tier-1 criticality and assigns Business Owners (not IT) to every classification.',
          },
          flashcards: [
            { front: 'What is the #1 foundation required BEFORE conducting accurate risk assessments?', back: 'An up-to-date Information Asset Inventory with named Business Owners and value-based Classification.', tag: 'cism-d2' },
            { front: 'If a low-cost microservice supports a mission-critical trading platform, what criticality tier does the microservice inherit?', back: 'Tier-1 Mission-Critical (dependencies inherit the highest criticality of the business processes they support).', tag: 'cism-d2' },
            { front: 'Who drives the Business Impact Analysis (BIA)?', back: 'Business Unit Leaders / Process Owners (facilitated by the Security/BC Manager)—NOT IT guessing alone.', tag: 'cism-d2' },
          ],
          sourceRefs: ['my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub'],
        },
        {
          id: 'cism-d2-l2',
          title: 'Risk Assessment, Appetite vs. Tolerance & Cost-Effective Treatment',
          estimatedMinutes: 45,
          summary:
            'Apply quantitative and qualitative risk assessment frameworks, distinguish Risk Appetite from Risk Tolerance and Risk Capacity, and select economically rational risk responses.',
          learningObjectives: [
            'Distinguish Risk Appetite (broad strategic willingness), Risk Tolerance (acceptable variance band), and Risk Capacity (maximum survivable loss).',
            'Select appropriate risk responses (Mitigate, Avoid, Transfer/Share, Accept) keeping residual risk strictly within Risk Appetite.',
            'Recognize when to trigger out-of-cycle risk reassessments (major business change, M&A, new cloud migration, severe emerging threat).',
          ],
          coreConcepts: [
            {
              heading: 'Risk Appetite vs. Risk Tolerance vs. Risk Capacity',
              explanation:
                'ISACA exams test these three concentric boundaries with laser precision: (1) Risk Capacity — the absolute maximum loss an enterprise can suffer before insolvency/bankruptcy (hard survival ceiling); (2) Risk Appetite — the broad strategic level of risk the Board is willing to accept to pursue business growth (must sit safely below Capacity); (3) Risk Tolerance — the specific measurable acceptable deviation/variance around a targeted objective or KRI threshold (e.g., "Target uptime 99.95%, tolerance +/- 0.05% before escalating").',
              mentalModel:
                'Risk Capacity = cliff edge (fall off and die); Risk Appetite = posted speed limit (65 mph); Risk Tolerance = acceptable wiggle room (65 +/- 5 mph before flashing warning lights trigger).',
              formulaOrRule: 'Hierarchy: Risk Tolerance (tactical variance) <= Risk Appetite (strategic board level) < Risk Capacity (survival ceiling).',
            },
            {
              heading: 'Inherent Risk, Residual Risk & When to Re-Assess',
              explanation:
                'Inherent Risk is raw exposure before controls; Residual Risk is remaining exposure AFTER controls are implemented (never 0%!). Controls MUST be cost-effective: cost of control must never exceed expected loss reduction (unless mandated by law or life safety). Risk assessments are NOT merely once-a-year rituals—re-assess IMMEDIATELY whenever a MAJOR CHANGE occurs: mergers/acquisitions, major cloud/ERP migration, new regulatory mandates, major breach, or material shift in the threat landscape!',
              mentalModel:
                'Risk assessment is a living weather radar, not an annual photo album—if a hurricane (major business change) forms in July, you do not wait until December’s scheduled check.',
              formulaOrRule: 'Trigger Immediate Risk Assessment Upon: Major Technology Change, M&A, New Regulatory Rule, or Major Threat/Incident.',
            },
          ],
          realWorldScenario: {
            title: 'Halting an Unassessed Generative-AI Rollout Using Risk Tolerance Triggers',
            situation:
              'Midway through the fiscal year, the Customer Support VP integrates an external third-party generative AI plugin directly into live customer billing tickets, stating "Our annual IT risk assessment isn’t due until November."',
            analysis:
              'Introducing a major external data-processing technology radically alters the organization’s inherent risk profile and data privacy exposure. Under ISACA risk management, significant architectural or business changes IMMEDIATELY trigger an out-of-cycle risk assessment BEFORE production launch—waiting for an annual calendar date violates governance.',
            takeaway:
              'Tie mandatory risk assessments directly to Change Management, Project Management (SDLC), and Procurement gates so major changes never slip into production unassessed.',
          },
          examTraps: [
            'CISM classic: "When is the BEST time to update a risk assessment?" -> "Whenever a significant change occurs to business processes, technology, or the threat landscape" (beats "Annually" every time!).',
            'Never confuse Risk Transference (buying cyber insurance or outsourcing) with eliminating liability—you can transfer financial/operational cost, NEVER legal accountability or brand damage!',
            'If Residual Risk exceeds Risk Appetite even after proposed controls, the manager MUST either implement additional cost-effective controls, avoid the activity, OR escalate to Senior Management for formal risk acceptance/re-evaluation.',
          ],
          keyTerms: [
            { term: 'Risk Tolerance', definition: 'Acceptable level of measurable variation/deviation around specific objectives or risk appetite thresholds.' },
            { term: 'Risk Capacity', definition: 'Absolute maximum amount of risk loss an enterprise can absorb without failing or ceasing operations.' },
            { term: 'Inherent Risk', definition: 'Raw level of risk exposure inherent to a process or asset before any security controls are applied.' },
            { term: 'Residual Risk', definition: 'Remaining level of risk after security controls have been designed, implemented, and verified.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d2-l2-q1',
              question:
                'An enterprise completes its comprehensive annual IT risk assessment in January. In May, executive leadership acquires an overseas fintech startup with legacy payment infrastructure. When should the Information Security Manager update the enterprise risk assessment?',
              options: [
                'Wait until next January to maintain consistent annual benchmarking',
                'Immediately—major business changes such as M&A require an immediate risk reassessment',
                'Only after the acquired systems experience a security incident',
                'Two years later once legacy systems are fully depreciated',
              ],
              correctIndex: 1,
              rationale:
                'Risk management is continuous. Material changes—especially mergers, acquisitions, new cloud architectures, or major regulatory shifts—immediately invalidate prior risk baselines and require prompt reassessment.',
            },
            {
              id: 'cism-d2-l2-q2',
              question:
                'After deploying cost-effective technical controls on a new mobile app, residual risk STILL exceeds the Board’s approved risk appetite. What should the Information Security Manager do NEXT?',
              options: [
                'Quietly sign off on launch to avoid delaying revenue',
                'Present additional risk treatment options (further mitigation, avoidance, or transfer) and escalate to Senior Management for a formal risk decision',
                'Lower the calculated risk score manually until it fits inside risk appetite',
                'Purchase cyber insurance and declare residual risk eliminated to zero',
              ],
              correctIndex: 1,
              rationale:
                'When residual risk exceeds approved risk appetite, the security manager must NEVER alter scores or unilaterally accept risk—they must present options (mitigate further, avoid, transfer) and escalate to Senior Management/Risk Owners.',
            },
          ],
          practicalDrill: {
            title: 'Risk Treatment & Appetite Threshold Matrix',
            prompt:
              'Classify 4 enterprise risks into Mitigate, Avoid, Transfer, or Accept against an approved Board Risk Appetite.',
            steps: [
              'Define Risk Capacity (e.g., $20M survival ceiling), Risk Appetite ($2M max annual cyber exposure), and Risk Tolerance (+/- 10% KRI alert triggers).',
              'Embed mandatory risk-assessment triggers into M&A due diligence, Procurement onboarding, and SDLC Gate 1.',
              'Verify every risk treatment preserves Cost of Control < Risk Reduction unless legally mandated.',
            ],
            successCriteria:
              'Matrix cleanly separates Capacity, Appetite, and Tolerance, and integrates dynamic change-triggered reassessments.',
          },
          flashcards: [
            { front: 'Risk Capacity vs. Risk Appetite vs. Risk Tolerance?', back: 'Capacity = max survivable loss; Appetite = broad strategic risk level Board accepts; Tolerance = measurable acceptable variance around specific targets.', tag: 'cism-d2' },
            { front: 'When must an enterprise risk assessment be updated (beyond annual reviews)?', back: 'Immediately whenever a significant business, architectural, regulatory, M&A, or threat landscape change occurs.', tag: 'cism-d2' },
            { front: 'What is the ONLY valid exception to the rule "Control cost must not exceed expected risk loss"?', back: 'Human life/safety protection and mandatory legal/regulatory compliance.', tag: 'cism-d2' },
          ],
          sourceRefs: ['my_documents/CISM QA, 9th Edition.pdf', 'my_documents/Complete Guide to CISM Certification.pdf'],
        },
        {
          id: 'cism-d2-l3',
          title: 'Enterprise Risk Register, KRIs & Third-Party Risk Management (TPRM)',
          estimatedMinutes: 40,
          summary:
            'Operate a living Risk Register with named Risk Owners, monitor risk drift via calibrated KRIs, and control vendor/outsourcing exposure across the full third-party lifecycle.',
          learningObjectives: [
            'Maintain an authoritative Risk Register capturing risk scenarios, inherent/residual ratings, named Risk Owners, treatment status, and review dates.',
            'Select predictive Key Risk Indicators (KRIs) calibrated to alert management BEFORE risk tolerance is breached.',
            'Govern the full Third-Party Risk Management (TPRM) lifecycle: Due Diligence -> Contracting (Right-to-Audit/SLAs) -> Continuous Monitoring -> Offboarding/Data Return.',
          ],
          coreConcepts: [
            {
              heading: 'The Living Risk Register & Predictive KRIs',
              explanation:
                'A Risk Register is the central repository of all identified enterprise risks—NOT a static spreadsheet created once for auditors! Every entry MUST contain: clear Risk Scenario description, Inherent Risk, Existing Controls, Residual Risk, Chosen Treatment Plan, single accountable Risk Owner (business executive!), Target Closure Date, and Linked KRIs. Good KRIs are LEADING (forward-looking) indicators tied directly to risk appetite—for example, "Percentage of internet-facing critical systems unpatched > 14 days" warns you BEFORE ransomware strikes, whereas "Number of breaches suffered last year" is a lagging metric.',
              mentalModel:
                'A lagging metric tells you the house already burned down; a leading KRI smells smoke in the kitchen while a hand extinguisher still works.',
              formulaOrRule: 'Every Risk Register entry MUST have ONE named Business Risk Owner + Target Date + Linked Leading KRI.',
            },
            {
              heading: 'Third-Party & Supply-Chain Risk Management (TPRM)',
              explanation:
                'Outsourcing an IT function NEVER outsources risk accountability. TPRM governs vendors across four mandatory gates: (1) Tiering & Pre-Contract Due Diligence (tier vendors by data/operational criticality; inspect SOC 2 Type II, ISO 27001, financial health, fourth-party sub-processors BEFORE signing); (2) Contract & SLA Protections (embed Right-to-Audit, security baseline clauses, 24-hour breach notification, SLA penalties, and data ownership/return terms); (3) Ongoing Continuous Monitoring (annual reassessments, continuous attack-surface telemetry, SLA tracking); (4) Clean Offboarding (revoke API/SSO keys immediately and obtain verified data sanitization certificates).',
              mentalModel:
                'Never sign a vendor contract first and plan to "check their security later"—your negotiating leverage drops to zero the moment ink hits the paper!',
              formulaOrRule: 'TPRM Golden Rule: Perform security due diligence and negotiate Right-to-Audit/SLAs BEFORE signing the vendor contract.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Fourth-Party Payroll Breach Through TPRM Contracting',
            situation:
              'A procurement manager is ready to sign a 3-year contract with a boutique cloud HR vendor offering 30% lower fees. Security reviews the draft agreement and notices zero breach-notification timeline, no right-to-audit clause, and undisclosed hosting on an uncertified fourth-party offshore server farm.',
            analysis:
              'Signing without right-to-audit, breach SLAs, or sub-processor controls blinds the enterprise to severe regulatory risk. By embedding security into the Procurement gate BEFORE contract signature, the CISM manager mandates SOC 2 Type II attestation, sub-processor disclosure/approval rights, 24-hour incident notice, and verified termination data destruction—protecting the firm while negotiating from peak leverage.',
            takeaway:
              'Integrating Information Security into Procurement and Vendor Onboarding prevents risky contracts from ever being signed.',
          },
          examTraps: [
            'ISACA loves testing Procurement timing: "When is the BEST time to define security requirements and Right-to-Audit clauses for a third-party service?" -> BEFORE contract signing (during RFP / vendor selection / contracting)!',
            'Watch out for Risk Owner vs. Control Owner: the Business Executive is the Risk Owner (owns the risk scenario & acceptance); IT/Security is often the Control Owner (operates the firewall/MFA control mitigating it).',
            'A Right-to-Audit clause in a vendor contract is critical because without it, you have zero legal standing to inspect controls or demand independent assurance reports when vendor performance slips.',
          ],
          keyTerms: [
            { term: 'Risk Register', definition: 'Centralized living log tracking identified risk scenarios, inherent/residual ratings, named Risk Owners, treatment plans, and KRI status.' },
            { term: 'Risk Owner', definition: 'Accountable business executive with authority and budget to make risk treatment and acceptance decisions for a specific risk.' },
            { term: 'Right-to-Audit Clause', definition: 'Contractual provision authorizing a customer (or accredited third-party auditor) to inspect a vendor’s security controls and compliance.' },
            { term: 'Fourth-Party Risk', definition: 'Risk introduced by sub-processors and downstream suppliers utilized by your direct third-party vendor.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d2-l3-q1',
              question:
                'What is the MOST effective way for an Information Security Manager to ensure third-party cloud and outsourcing vendors comply with enterprise security requirements?',
              options: [
                'Run unannounced vulnerability scans against the vendor after go-live',
                'Embed enforceable security requirements, SLAs, breach notification windows, and Right-to-Audit clauses into contracts prior to signing',
                'Rely on verbal assurances from the vendor’s sales account executive',
                'Ask Internal Audit to review the vendor three years after deployment',
              ],
              correctIndex: 1,
              rationale:
                'Security requirements carry legal force only when written into the contract/SLA BEFORE signature, backed by due diligence and Right-to-Audit provisions.',
            },
            {
              id: 'cism-d2-l3-q2',
              question:
                'Which attribute makes a Key Risk Indicator (KRI) MOST valuable to executive risk governance?',
              options: [
                'It counts historical security incidents from three years ago',
                'It provides early predictive warning before risk exposure breaches organizational tolerance thresholds',
                'It requires raw packet hex dumps to interpret',
                'It tracks only IT server CPU utilization',
              ],
              correctIndex: 1,
              rationale:
                'An effective KRI is forward-looking and tied to risk tolerance thresholds so management can take proactive corrective action BEFORE a major loss occurs.',
            },
          ],
          practicalDrill: {
            title: 'Tier-1 Vendor TPRM Gate & Risk Register Audit',
            prompt:
              'Stand up a Procurement-integrated TPRM program for an organization onboarding 40 SaaS vendors per year.',
            steps: [
              'Tier vendors into Tier 1 (Critical PII/Ops), Tier 2 (Internal Data), and Tier 3 (Public/Low Risk) to allocate due-diligence effort proportionally.',
              'Mandate pre-contract SOC 2 Type II + fourth-party sub-processor disclosure + Right-to-Audit + 24h breach SLA for all Tier-1 vendors.',
              'Log any residual vendor gaps into the Enterprise Risk Register with a named Business Risk Owner and quarterly KRI monitoring.',
            ],
            successCriteria:
              'Program embeds security BEFORE contract signing, tiers vendors by criticality, and enforces named Risk Owners in the Risk Register.',
          },
          flashcards: [
            { front: 'Risk Owner vs. Control Owner?', back: 'Risk Owner = Business executive accountable for the risk scenario and acceptance; Control Owner = Operational manager running the safeguard that mitigates the risk.', tag: 'cism-d2' },
            { front: 'When is your leverage highest to enforce third-party security requirements?', back: 'During RFP / vendor selection BEFORE signing the contract (embedding SLAs, Right-to-Audit, and breach notice clauses).', tag: 'cism-d2' },
            { front: 'Leading vs. Lagging KRI example?', back: 'Leading KRI = rising count of unpatched critical external assets >14d (predicts breach); Lagging metric = number of breaches last year (post-facto).', tag: 'cism-d2' },
          ],
          sourceRefs: ['my_documents/CISM QA, 9th Edition.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: INFORMATION SECURITY PROGRAM (33%)
    // =================================================================
    {
      id: 'cism-d3',
      domainNumber: 3,
      title: 'Information Security Program',
      examWeightPercent: 33,
      overview:
        'The single highest-weighted CISM domain (33% — one-third of the entire exam!). Covers translating strategy into an actionable Program Charter and roadmap, integrating security into enterprise architecture and SDLC/PMO, justifying budgets via Business Cases, building security culture, and driving metrics-led assurance.',
      lessons: [
        {
          id: 'cism-d3-l1',
          title: 'Security Program Charter, Enterprise Architecture & SDLC/PMO Integration',
          estimatedMinutes: 50,
          summary:
            'Turn strategic intent into an executive-backed Security Program Charter, leverage Enterprise Security Architecture (SABSA/TOGAF/Zachman), and embed security gates natively into PMO, Procurement, and Change Management.',
          learningObjectives: [
            'Draft an authoritative Information Security Program Charter establishing scope, authority, funding mandate, and alignment with corporate strategy.',
            'Apply Enterprise Security Architecture frameworks (SABSA, TOGAF, Zachman) to replace ad-hoc point tools with cohesive, scalable defense-in-depth.',
            'Embed security into enterprise processes (PMO project gates, SDLC, Change Management, HR, Procurement) to prevent "bolt-on" security failures.',
          ],
          coreConcepts: [
            {
              heading: 'Program Charter & Enterprise Security Architecture (SABSA / TOGAF)',
              explanation:
                'A Security Strategy says WHERE we are going; the Security Program is the structured portfolio of people, processes, and technologies that GETS us there! It begins with a Senior-Management-approved Program Charter granting formal authority and scope. Rather than buying fragmented vendor point-tools ("tool sprawl"), mature programs build atop Enterprise Security Architecture—especially SABSA (Sherwood Applied Business Security Architecture, a 6-layer business-driven framework starting from Contextual/Business View down to Component/Operational View) or TOGAF—ensuring every control traces directly back to a business requirement.',
              mentalModel:
                'Buying point security tools without Enterprise Security Architecture is like buying expensive windows, doors, and roof tiles without an architectural blueprint—nothing fits cleanly and gaps stay wide open.',
              formulaOrRule: 'Strategy (Direction) -> Program Charter (Authority/Mandate) -> Enterprise Security Architecture (Blueprint) -> Control Implementation.',
            },
            {
              heading: 'Integrating Security into Business & IT Lifecycle Gates',
              explanation:
                'Security teams are always outnumbered 50:1 or 100:1 by business and engineering staff. The ONLY way a CISM manager scales security across an enterprise is by embedding mandatory security checkpoints directly inside existing corporate workflows: (1) Project Management Office (PMO) — require security requirements at Project Initiation BEFORE code or budget locks; (2) Procurement — gate vendor selection before signing; (3) SDLC / DevSecOps — shift security left into design and CI/CD; (4) Change Management — review security impact of every production change; (5) HR — bake security into job descriptions, onboarding, and termination!',
              mentalModel:
                'Instead of chasing 500 trains after they leave the station, put one lightweight security switch inside the central train dispatch system (PMO, Procurement, Change Control).',
              formulaOrRule: 'Highest-Leverage Program Multiplier = Integrating security into existing PMO, SDLC, Change Management, and Procurement workflows.',
            },
          ],
          realWorldScenario: {
            title: 'Ending "Midnight Go-Live" Surprises Through PMO Integration',
            situation:
              'Every quarter, business units unveil newly built customer applications 48 hours before launch and ask Security to "rubber-stamp approval by Friday." Discovering critical flaws at the last minute either delays revenue launches or forces insecure releases.',
            analysis:
              'Operating security as a late-stage inspection gate guarantees friction and expensive rework. By partnering with the Enterprise PMO and CIO to embed a mandatory Security Requirements & Threat-Modeling sign-off into Project Gate 1 (Initiation/Design)—before funding unlocks for Build—engineering builds controls natively at 1/30th the cost and launches cleanly on schedule.',
            takeaway:
              'Embed security at Project Initiation (Gate 1), NEVER as a surprise pre-launch bottleneck.',
          },
          examTraps: [
            'CISM classic: "What is the MOST cost-effective way to integrate information security into enterprise projects?" -> Embed security requirements into the earliest stage of the SDLC / Project Management Initiation phase!',
            'Remember SABSA’s superpower on CISM: it is explicitly BUSINESS-DRIVEN (starts with Contextual Business Attributes before selecting technical components).',
            'Watch out for "Tool Sprawl": when an exam question describes redundant overlapping tools causing alert fatigue and budget bloat, the answer is developing/aligning to an Enterprise Security Architecture and rationalizing overlapping controls.',
          ],
          keyTerms: [
            { term: 'Security Program Charter', definition: 'Executive-approved foundational document establishing the security program’s mission, scope, authority, governance structure, and accountability.' },
            { term: 'SABSA', definition: 'Sherwood Applied Business Security Architecture—business-driven 6-layer enterprise security architecture framework aligning security design to business attributes.' },
            { term: 'Defense in Depth', definition: 'Layered architectural approach deploying multiple independent preventive, detective, and corrective safeguards so single control failure never causes total compromise.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d3-l1-q1',
              question:
                'Business units repeatedly submit major IT systems for security review just days before scheduled production launch, causing costly redesigns and launch delays. What is the BEST long-term solution?',
              options: [
                'Hire 10 additional penetration testers to work weekends before launches',
                'Integrate mandatory security requirements and risk reviews into the Enterprise Project Management (PMO) initiation phase',
                'Waive security reviews for revenue-generating projects',
                'Block all project deployments permanently via firewall rules',
              ],
              correctIndex: 1,
              rationale:
                'Embedding security natively into PMO Initiation / early SDLC catches architectural flaws at the cheapest stage, eliminates last-minute friction, and scales across the entire enterprise sustainably.',
            },
            {
              id: 'cism-d3-l1-q2',
              question:
                'What is the PRIMARY benefit of establishing an Enterprise Security Architecture (such as SABSA) before purchasing new security technologies?',
              options: [
                'It guarantees zero security incidents forever',
                'It ensures security controls are cohesive, standardized, business-aligned, and free of costly overlapping gaps',
                'It eliminates the need for Senior Management approval',
                'It replaces all security awareness training',
              ],
              correctIndex: 1,
              rationale:
                'Enterprise Security Architecture provides a structured, business-aligned blueprint ensuring controls interoperate cleanly, close architectural gaps, and prevent ad-hoc tool sprawl.',
            },
          ],
          practicalDrill: {
            title: 'PMO-Integrated Security Program Roadmap',
            prompt:
              'Design a 4-gate security integration workflow across your company’s Project Management lifecycle.',
            steps: [
              'Gate 1 (Initiation): Asset classification + initial risk triage + security budget allocation.',
              'Gate 2 (Design): SABSA/Architecture review + Threat Model + Privacy Impact Assessment (PIA).',
              'Gate 3 (Build/Test): Automated DevSecOps SAST/SCA/DAST + remediated critical findings.',
              'Gate 4 (Operate/Retire): Operational monitoring handoff (SIEM/IR playbooks) + end-of-life sanitization plan.',
            ],
            successCriteria:
              'Workflow embeds security at every stage starting at Gate 1 so zero projects reach launch unreviewed.',
          },
          flashcards: [
            { front: 'What is the #1 purpose of an Information Security Program Charter?', back: 'To secure formal executive mandate defining the program’s authority, scope, objectives, and governance accountability.', tag: 'cism-d3' },
            { front: 'Why is SABSA highlighted in ISACA CISM Domain 3?', back: 'SABSA is a business-driven Enterprise Security Architecture framework tracing every technical control directly back to business attributes and risk.', tag: 'cism-d3' },
            { front: 'Where is the cheapest and most effective place to embed security in enterprise projects?', back: 'Project Initiation / Requirements Gathering (Gate 1 of PMO & SDLC).', tag: 'cism-d3' },
          ],
          sourceRefs: [
            'my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub',
            'my_documents/CISM - 16th Edition Exam Topics.pdf',
          ],
        },
        {
          id: 'cism-d3-l2',
          title: 'Business Cases, Resource Optimization, Budgets & Security Awareness Culture',
          estimatedMinutes: 45,
          summary:
            'Win executive budget approval using rock-solid Business Cases (ROI, ROSI, TCO, Payback, NPV), optimize staff and managed-service resources, and build measurable role-based security culture.',
          learningObjectives: [
            'Construct persuasive executive Business Cases demonstrating Return on Security Investment (ROSI), Total Cost of Ownership (TCO), and intangible business value.',
            'Optimize security resources across internal FTEs, co-managed MSSPs, automation, and cross-training to avoid single-person dependency.',
            'Design tiered, role-based Security Awareness & Training programs measured by behavioral change—not merely attendance completion rates.',
          ],
          coreConcepts: [
            {
              heading: 'Executive Business Cases & Financial Justification (ROSI / TCO)',
              explanation:
                'CFOs never approve budgets based on Fear, Uncertainty, and Doubt (FUD — "hackers are scary!"). Every major CISM investment requires a structured Business Case articulating: (1) Business Problem/Risk Opportunity; (2) Options Considered (ALWAYS include "Do Nothing / Status Quo" baseline plus 2–3 alternatives!); (3) Total Cost of Ownership (TCO — initial purchase + integration + ongoing staffing/training + annual licensing + maintenance over 3–5 years); (4) Quantified Risk Reduction / ROSI = `(ALE_reduction - Annual_Cost) / Annual_Cost` alongside strategic enablement benefits; and (5) Implementation Risks and Success Metrics.',
              mentalModel:
                'The sticker price of a SIEM is only the tip of the iceberg—TCO includes the 3 analysts, storage ingestion fees, tuning consultants, and 5-year renewals hidden beneath the waterline.',
              formulaOrRule: 'ROSI = ((Risk Exposure x % Risk Mitigated) - Solution Cost) / Solution Cost. Always calculate FULL TCO, never just Day-1 purchase price!',
            },
            {
              heading: 'Security Awareness, Training & Measuring Real Behavior Change',
              explanation:
                'Technology alone fails if employees click phishing links or share credentials. Effective programs tailor delivery by audience: Executive Briefings (board risk/oversight), General Workforce Awareness (phishing, social engineering, clean desk), and Role-Based Training (OWASP secure coding for devs, cloud IAM for architects, wire-fraud checks for Finance). Critical CISM metric trap: "99% of staff clicked through the annual e-learning video" measures ACTIVITY, NOT EFFECTIVENESS! True effectiveness is measured by behavioral metrics: declining phishing click rates, rising proactive suspicious-email reporting rates, and fewer policy violations.',
              mentalModel:
                'Counting who attended a swimming lecture doesn’t prove anyone can swim—watching them swim safely in the pool (reduced phishing clicks & faster reporting) proves effectiveness.',
              formulaOrRule: 'Awareness Effectiveness Metric = Behavioral Change (e.g., Phishing Click Drop + Reporting Rate Rise), NOT Course Completion %.',
            },
          ],
          realWorldScenario: {
            title: 'Winning CFO Approval for an Identity Governance Platform',
            situation:
              'A security manager asks the CFO for $400,000 for an Identity Governance tool citing "industry ransomware headlines." The CFO declines. The manager returns with a formal Business Case quantifying: (1) $180,000/yr in saved IT helpdesk manual password/provisioning hours, (2) elimination of $350,000/yr expected audit-remediation penalties, and (3) full 3-year TCO compared against Status Quo and MSSP alternatives.',
            analysis:
              'Replacing technical fear-mongering with a rigorous Business Case incorporating TCO, operational efficiency savings, and risk reduction speaks the CFO’s exact language and transforms security from a "cost center" into a measurable value driver.',
            takeaway:
              'Never sell security with FUD; sell with Business Cases showing full TCO, quantified risk reduction, and business operational efficiency.',
          },
          examTraps: [
            'ISACA classic: "What is the BEST metric to evaluate the effectiveness of a security awareness program?" -> Behavioral change (e.g., decline in phishing clicks / increase in incident reporting / fewer human-error incidents)—NEVER "percentage of employees who completed training"!',
            'Watch out for Total Cost of Ownership (TCO): always include hidden ongoing costs (staffing, training, maintenance, support, decommissioning), not just initial license CapEx.',
            'Security Awareness must be CONTINUOUS (reinforcing messages year-round), NOT a once-a-year check-the-box slide deck!',
          ],
          keyTerms: [
            { term: 'Business Case', definition: 'Structured executive justification comparing investment alternatives, full TCO, quantified benefits/ROSI, and alignment to business objectives.' },
            { term: 'TCO (Total Cost of Ownership)', definition: 'Complete lifecycle financial cost of a control including acquisition, integration, staffing, training, licensing, maintenance, and retirement.' },
            { term: 'ROSI', definition: 'Return on Security Investment—financial measure comparing annualized risk loss prevented against total annual cost of the safeguard.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d3-l2-q1',
              question:
                'An Information Security Manager wants to measure the TRUE effectiveness of a newly launched enterprise security awareness program. Which metric provides the STRONGEST evidence?',
              options: [
                '98% employee completion rate on the annual online compliance module',
                'Measurable reduction in simulated phishing click rates paired with faster employee reporting of suspicious emails',
                'Total number of security posters hung in corporate breakrooms',
                'Average exam score immediately after watching a 15-minute video',
              ],
              correctIndex: 1,
              rationale:
                'True awareness effectiveness is proven by sustained behavioral change in real operational scenarios (fewer clicks, faster threat reporting, fewer security incidents)—not mere attendance or completion counts.',
            },
            {
              id: 'cism-d3-l2-q2',
              question:
                'When presenting a Business Case to executive leadership for a new Privileged Access Management (PAM) platform, which financial factor is MOST commonly underestimated yet critical for accurate budgeting?',
              options: [
                'Initial year-one software sticker price',
                'Total Cost of Ownership (TCO) including integration, ongoing operational staffing, training, and multi-year maintenance',
                'Vendor marketing brochure design',
                'Number of slides in the vendor pitch deck',
              ],
              correctIndex: 1,
              rationale:
                'Accurate executive decision-making depends on full lifecycle TCO—hidden integration, engineering hours, ongoing maintenance, and training often exceed initial acquisition cost.',
            },
          ],
          practicalDrill: {
            title: 'CFO-Ready Security Investment Business Case',
            prompt:
              'Draft a concise Business Case requesting $250,000 for automated IAM/PAM modernization.',
            steps: [
              'Compare 3 options: (A) Do Nothing (Status Quo risk + audit fines), (B) In-House Cloud PAM (3-yr TCO), (C) Co-Managed MSSP PAM (3-yr TCO).',
              'Calculate ROSI combining ALE reduction + IT helpdesk productivity savings.',
              'Attach a role-based awareness & behavioral KPI dashboard tracking adoption post-rollout.',
            ],
            successCriteria:
              'Business case avoids FUD, includes Status Quo baseline, captures full 3-year TCO, and pairs deployment with behavioral effectiveness metrics.',
          },
          flashcards: [
            { front: 'What is the BEST way to measure Security Awareness effectiveness on CISM?', back: 'Sustained behavioral improvement (reduced phishing clicks, higher/faster incident reporting, fewer policy violations)—NOT completion percentage.', tag: 'cism-d3' },
            { front: 'What must EVERY executive Business Case include alongside the proposed tool?', back: 'A "Do Nothing / Status Quo" option, alternative options, full lifecycle TCO, quantified ROSI/benefits, and risk alignment.', tag: 'cism-d3' },
            { front: 'Why should security managers avoid using "FUD" with the Board?', back: 'Fear, Uncertainty, and Doubt erodes executive credibility; C-suite leaders allocate capital based on quantified business risk, TCO, and value alignment.', tag: 'cism-d3' },
          ],
          sourceRefs: ['my_documents/CISM QA, 9th Edition.pdf'],
        },
        {
          id: 'cism-d3-l3',
          title: 'Program Metrics (KGI/KPI/KRI), Maturity Models & Continuous Assurance',
          estimatedMinutes: 45,
          summary:
            'Prove security program value to the Board using balanced KGI/KPI/KRI cascades, benchmark capability maturity (CMMI/COBIT), and verify control effectiveness via continuous assurance audits.',
          learningObjectives: [
            'Cascade executive metrics cleanly across KGIs (goal achieved), KPIs (process efficiency), and KRIs (emerging risk exposure).',
            'Use Capability Maturity Models (Levels 0–5) to align target maturity to business risk appetite (avoiding wasteful over-investment at Level 5!).',
            'Validate security program operational effectiveness through control self-assessments (CSAs), independent audits, and continuous monitoring.',
          ],
          coreConcepts: [
            {
              heading: 'The Balanced Metric Cascade: KGI vs. KPI vs. KRI',
              explanation:
                'ISACA demands crisp precision across three metric families: (1) Key Goal Indicators (KGIs) — lagging strategic metrics confirming WHETHER an objective was achieved (e.g., "Zero material regulatory compliance fines this fiscal year", "99.95% core payment availability"); (2) Key Performance Indicators (KPIs) — operational metrics showing HOW WELL a process is performing toward achieving the KGI (e.g., "Mean Time to Detect = 18 min", "96% critical patches applied within SLA"); (3) Key Risk Indicators (KRIs) — leading risk radar warning of rising threat/exposure (e.g., "18% jump in privileged access exceptions", "Unpatched internet-facing CVEs trending upward"). Tailor dashboards strictly to audience: Technical Ops needs granular KPIs; the Board wants 5–7 concise business-linked KGIs and KRIs!',
              mentalModel:
                'Running a marathon: KGI = Crossing the finish line under 4 hours; KPI = Current pace of 8:55 min/mile; KRI = Heart rate spiking into the red danger zone at Mile 16.',
              formulaOrRule: 'Target Achieved? = KGI | Process Performing Well? = KPI | Risk Rising Toward Danger? = KRI.',
            },
            {
              heading: 'Right-Sizing Program Maturity (Why Level 5 Is NOT Always the Goal!)',
              explanation:
                'A classic CISM executive insight: NEVER blindly aim for Maturity Level 5 (Optimizing) across every security process! Reaching Level 5 requires immense recurring budget and staff overhead. Instead, target the OPTIMAL maturity level dictated by organizational risk appetite and business criticality (e.g., Level 4–5 for Core Payment Processing and Incident Response, Level 2–3 for low-risk internal marketing blogs). Over-securing low-value assets destroys Value Delivery and wastes capital.',
              mentalModel:
                'You put Level-5 bank-vault engineering on Fort Knox—not on the office supply closet holding staplers and sticky notes.',
              formulaOrRule: 'Target Maturity Rule: Optimize maturity to match Business Criticality & Risk Appetite—Level 5 everywhere is wasteful over-engineering!',
            },
          ],
          realWorldScenario: {
            title: 'Right-Sizing Maturity & Proving ROI to an Audit Committee',
            situation:
              'A security director submits a $4M budget request to push ALL 28 security domains to CMMI Maturity Level 5 across a mid-sized regional manufacturing firm. The Board Audit Committee pushes back hard, questioning both cost and relevance.',
            analysis:
              'Level 5 across every domain violates Value Delivery and Resource Optimization. By mapping business criticality first—setting Level 4 targets for OT Plant Isolation, IAM, and Incident Response while keeping Level 2–3 for low-risk administrative areas—and reporting 6 clear KGIs/KRIs tied to plant uptime, the director trims cost by 55% and wins immediate unanimous approval.',
            takeaway:
              'Right-sized maturity aligned to business risk always outperforms gold-plated technical perfection.',
          },
          examTraps: [
            'ISACA classic trap: "Should every enterprise strive for Maturity Level 5 across all security processes?" -> NO! Target the optimal maturity level justified by business criticality, risk appetite, and cost-benefit!',
            'Always tailor metrics to the AUDIENCE: technical alert counts for SOC managers, process KPIs for IT directors, and business-aligned KGIs/KRIs for the Board.',
            'Control Self-Assessments (CSAs) help operational managers spot gaps quickly and build ownership, while Independent Audits (Internal/External) provide objective assurance to the Board.',
          ],
          keyTerms: [
            { term: 'Key Goal Indicator (KGI)', definition: 'Metric confirming after the fact whether a strategic security or business goal was successfully accomplished.' },
            { term: 'Control Self-Assessment (CSA)', definition: 'Structured internal review where business/process owners evaluate the effectiveness of their own controls prior to formal audits.' },
            { term: 'Capability Maturity Model', definition: '0–5 scale assessing process discipline from Incomplete/Initial to Quantitatively Managed and Optimizing.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d3-l3-q1',
              question:
                'A mid-sized retail company assesses its information security program at Maturity Level 2 across most domains. What should guide the Information Security Manager in setting target maturity levels for the next 3 years?',
              options: [
                'Mandating Maturity Level 5 uniformly across every single security process',
                'Aligning target maturity per domain with business objectives, asset criticality, risk appetite, and cost-benefit analysis',
                'Matching whatever maturity level the largest global defense contractor uses',
                'Keeping all domains permanently at Level 1 to minimize IT spending',
              ],
              correctIndex: 1,
              rationale:
                'ISACA emphasizes value delivery and resource optimization: optimal target maturity depends on each domain’s business criticality, regulatory drivers, and enterprise risk appetite—not chasing Level 5 everywhere.',
            },
            {
              id: 'cism-d3-l3-q2',
              question:
                'Which set of metrics is MOST appropriate to present during a 15-minute quarterly briefing to the Board of Directors?',
              options: [
                'Raw firewall packet drop counts and IDS signature update logs',
                'A concise executive scorecard of business-aligned KGIs, KRIs against risk tolerance, and major program roadmap status',
                'Individual server CPU utilization and patch KB numbers',
                'Full 400-page unedited vulnerability scanner PDF dumps',
              ],
              correctIndex: 1,
              rationale:
                'Board members need concise, strategic, decision-oriented visibility into whether security goals are being met (KGIs), whether risk exposure is approaching tolerance (KRIs), and how major investments are tracking.',
            },
          ],
          practicalDrill: {
            title: 'Balanced KGI-KPI-KRI Scorecard & Target Maturity Map',
            prompt:
              'Create a tiered metric and maturity blueprint for an enterprise security program.',
            steps: [
              'Pair 3 Strategic KGIs with supporting Operational KPIs and Predictive KRIs.',
              'Assign tailored Target Maturity Levels (e.g., L4 for IAM & IR, L3 for AppSec & TPRM, L2 for low-risk legacy print ops) with business justification.',
              'Establish quarterly Control Self-Assessments paired with annual Independent Third-Party Assurance.',
            ],
            successCriteria:
              'Blueprint clearly distinguishes KGI/KPI/KRI, justifies right-sized maturity instead of blanket Level 5, and fits executive brevity.',
          },
          flashcards: [
            { front: 'Give one crisp example each of a KGI, KPI, and KRI for Incident Response.', back: 'KGI = Zero incidents exceeding 4-hour MTD; KPI = Mean Time to Contain < 45 minutes; KRI = Rising surge of uninvestigated high-severity alerts > 24 hours.', tag: 'cism-d3' },
            { front: 'Why is Maturity Level 5 NOT automatically the best goal for every security process?', back: 'Achieving and sustaining Level 5 carries high cost; rational governance matches maturity to business criticality and risk appetite.', tag: 'cism-d3' },
            { front: 'What is the main value of Control Self-Assessments (CSAs)?', back: 'They engage business/control owners proactively to detect gaps early and increase accountability between independent audits.', tag: 'cism-d3' },
          ],
          sourceRefs: [
            'my_documents/CISM QA, 9th Edition.pdf',
            'my_documents/Complete Guide to CISM Certification.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: INCIDENT MANAGEMENT (30%)
    // =================================================================
    {
      id: 'cism-d4',
      domainNumber: 4,
      title: 'Incident Management',
      examWeightPercent: 30,
      overview:
        'Second highest-weighted CISM domain (30%!). Covers building Incident Management readiness, triage and escalation governance, executing containment aligned to business impact, integrating IR with BCP/DRP, rigorous plan testing, and driving Post-Incident Reviews.',
      lessons: [
        {
          id: 'cism-d4-l1',
          title: 'Incident Readiness, CSIRT Governance, Triage & Escalation Criteria',
          estimatedMinutes: 45,
          summary:
            'Build an Incident Response Plan (IRP) grounded in clear Event vs. Incident vs. Crisis definitions, pre-authorized CSIRT containment powers, triage severity matrices, and stakeholder escalation rules.',
          learningObjectives: [
            'Differentiate Event, Security Event, Security Incident, and Enterprise Crisis accurately.',
            'Establish Incident Management Readiness: Senior Management charter, pre-authorized containment authority, communication trees, and external retainers (Legal, Forensics, Law Enforcement).',
            'Design clear Triage, Classification, and Escalation thresholds ensuring critical incidents reach leadership without drowning executives in noise.',
          ],
          coreConcepts: [
            {
              heading: 'Event vs. Incident vs. Crisis & Pre-Authorized CSIRT Authority',
              explanation:
                'Not every alert is an incident: an Event is any normal observable occurrence (e.g., user login); an Adverse/Security Event hints at policy violation (e.g., 10 failed logins); a Security Incident is a confirmed event threatening confidentiality, integrity, or availability (e.g., active credential compromise); a Crisis is a severe incident threatening organizational survival, brand viability, or human safety—triggering Executive Crisis Management! Crucially, during a 3 AM ransomware outbreak, the CSIRT cannot waste 2 hours hunting down a VP to approve isolating an infected subnet—Senior Management MUST grant Pre-Authorized Containment Authority inside the approved IRP charter BEFORE an incident occurs.',
              mentalModel:
                'Firefighters do not phone City Hall for written permission before spraying water on a burning roof—pre-authorized IRP rules define exactly when CSIRT can isolate systems immediately.',
              formulaOrRule: 'Readiness Prerequisite = Approved IRP + Pre-Authorized CSIRT Containment Rules + Tested Escalation & Out-of-Band Comms.',
            },
            {
              heading: 'Triage, Prioritization & Stakeholder Escalation',
              explanation:
                'When multiple alerts hit simultaneously, Triage prioritizes incidents by BUSINESS IMPACT and urgency (using BIA asset criticality!), NOT merely technical CVSS score or "first-in, first-out." Escalation rules must pre-define exactly WHO speaks to whom: Legal Counsel directs breach notification determinations and attorney-client privilege over external forensics; Public Relations / Corporate Comms handles ALL media/customer statements (engineers NEVER speak to press!); HR handles insider disciplinary steps; and Law Enforcement notification is decided jointly by Senior Management and Legal (NOT unilaterally by a SOC analyst!).',
              mentalModel:
                'One voice to the outside world: Legal leads regulatory/forensic privilege, PR speaks to media, and CSIRT focuses 100% on containment and evidence.',
              formulaOrRule: 'Triage Priority = Business Criticality / Impact (from BIA). External Media Comms = Designated PR Spokesperson ONLY. Law Enforcement = Legal + Senior Mgmt decision.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Unauthorized Media Disclosures During a Ransomware Triage',
            situation:
              'After discovering ransomware on 40 branch workstations, an eager IT administrator emails affected customers directly apologizing for a "data breach" and calls the local police—before forensic confirmation of whether any data was exfiltrated.',
            analysis:
              'Unverified external admissions create massive legal liability, prematurely trigger regulatory clocks without factual scope, and breach communication governance. An ISACA-grade IRP restricts ALL external disclosures to pre-approved Legal/PR protocols and directs law-enforcement engagement exclusively through Executive Management and General Counsel.',
            takeaway:
              'Clear escalation authority and single-spokesperson communication protocols are as vital to incident survival as technical containment.',
          },
          examTraps: [
            'ISACA classic: "Who decides whether to report a cyber intrusion to Law Enforcement or disclose publicly?" -> Senior Management in consultation with Legal Counsel (NEVER the SOC lead or IT admin unilaterally!).',
            'Incident prioritization ALWAYS follows Business Impact / Asset Criticality (from the BIA)—a high-severity alert on a non-production test sandbox ranks BELOW a medium alert on the live payment gateway!',
            'Why retain an external Incident Response / Forensics firm via Legal Counsel BEFORE a breach? (1) Guarantees rapid SLA response without procurement delays, and (2) engaging forensics via outside Legal Counsel can help protect investigative findings under attorney-client privilege where applicable.',
          ],
          keyTerms: [
            { term: 'CSIRT', definition: 'Computer Security Incident Response Team—cross-functional team chartered to detect, triage, contain, eradicate, and recover from security incidents.' },
            { term: 'Triage', definition: 'Rapid initial sorting, validation, and categorization of alerts by business impact and urgency to allocate response resources optimally.' },
            { term: 'Escalation Matrix', definition: 'Pre-defined thresholds mapping incident severity levels to exact notification timelines, decision authorities, and executive stakeholders.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d4-l1-q1',
              question:
                'During a major cyberattack affecting customer billing portals, a national business journalist contacts the Information Security Manager requesting immediate comment. What MUST the manager do?',
              options: [
                'Share preliminary technical root-cause details transparently to build public trust',
                'Refer the journalist immediately to the designated Corporate Communications / PR spokesperson per the IRP',
                'Deny that any technical issue exists regardless of facts',
                'Forward the inquiry to the SOC Tier 1 analyst on duty',
              ],
              correctIndex: 1,
              rationale:
                'All external media communications must flow strictly through designated Public Relations / Corporate Communications spokespersons vetted by Legal Counsel to prevent inaccurate statements and legal exposure.',
            },
            {
              id: 'cism-d4-l1-q2',
              question:
                'A CSIRT receives two confirmed alerts simultaneously: a critical malware infection on an isolated developer test VM, and a suspicious privilege escalation on the enterprise revenue-billing database. Which factor should PRIMARILY dictate triage priority?',
              options: [
                'Which alert arrived in the SIEM queue first',
                'Business impact and asset criticality established by the BIA',
                'CVSS base score of the malware alone',
                'Physical distance of the servers from HQ',
              ],
              correctIndex: 1,
              rationale:
                'Incident triage must always prioritize based on business criticality and potential impact to core organizational operations (derived from the BIA), placing the revenue-billing database firmly ahead of an isolated test VM.',
            },
          ],
          practicalDrill: {
            title: 'CSIRT Charter, Escalation Matrix & Comms Protocol',
            prompt:
              'Establish Incident Management Readiness for a multi-region enterprise.',
            steps: [
              'Define Severity Levels 1–4 tied directly to BIA business impact thresholds (not just technical alert counts).',
              'Specify pre-authorized CSIRT isolation powers for Sev-1/Sev-2 active threats alongside out-of-band communication channels (in case corporate email/Slack is compromised!).',
              'Assign exact roles for Legal (privilege/regulators), PR (single external voice), HR (insider cases), and Executive Management (law enforcement/ransom policy).',
            ],
            successCriteria:
              'Readiness plan includes out-of-band comms, pre-authorized containment rules, BIA-driven severity tiers, and strict Legal/PR external comms control.',
          },
          flashcards: [
            { front: 'Why MUST an Incident Response Plan include Out-of-Band communication channels?', back: 'Because attackers frequently compromise corporate email, Active Directory, and chat platforms—responders need independent encrypted comms the attacker cannot monitor or disable.', tag: 'cism-d4' },
            { front: 'What is the #1 criterion for triaging competing security incidents on CISM?', back: 'Business impact and asset criticality (per the BIA), NOT first-come-first-served or CVSS score alone.', tag: 'cism-d4' },
            { front: 'Who authorizes contacting Law Enforcement after a confirmed breach?', back: 'Senior Management in consultation with Legal Counsel.', tag: 'cism-d4' },
          ],
          sourceRefs: [
            'my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
        {
          id: 'cism-d4-l2',
          title: 'Containment Strategy, Forensic Preservation & Eradication vs. Recovery',
          estimatedMinutes: 45,
          summary:
            'Balance rapid business-aligned containment against forensic preservation, decide when to isolate vs. monitor, ensure complete root-cause eradication, and manage safe restoration.',
          learningObjectives: [
            'Balance containment urgency against operational disruption and legal evidence preservation.',
            'Enforce Chain of Custody and forensic integrity whenever legal action, regulatory investigation, or insurance claims are plausible.',
            'Distinguish Containment (stop the spread), Eradication (remove root cause & persistence), and Recovery (validate clean return to production).',
          ],
          coreConcepts: [
            {
              heading: 'Containment Trade-Offs: Stop Bleeding Without Destroying Evidence or Business',
              explanation:
                'Containment is the single highest-stakes tactical judgment call in Incident Management. Shutting down a core payment mainframe abruptly stops an attacker, but might inflict $10M in immediate business loss or wipe volatile forensic evidence! Therefore, containment choices follow business risk: isolate network segments, revoke compromised tokens, fail over to clean backup capacity, and preserve volatile memory + disk snapshots BEFORE wiping or rebuilding. Never immediately notify an insider suspect or prematurely shut off a system before verifying forensic capture requirements with Legal!',
              mentalModel:
                'A skilled surgeon stops the bleeding (Containment) cleanly without harming vital organs (Critical Business Ops) and saves the tissue biopsy for the lab (Forensics) before stitching up (Recovery).',
              formulaOrRule: 'Containment Priority Order: Human Safety -> Preserve Business Viability & Contain Spread -> Preserve Forensic Evidence -> Eradicate -> Verified Clean Recovery.',
            },
            {
              heading: 'Complete Eradication & Verified Recovery Monitoring',
              explanation:
                'A frequent operational catastrophe is recovering too fast without complete Eradication—restoring backups onto a server that STILL carries the original unpatched VPN flaw or hidden attacker backdoor, only to be re-compromised 24 hours later! True Eradication eliminates BOTH the attacker’s artifacts (malware, rogue accounts, webshells) AND the initial entry vulnerability. Recovery then rebuilds from verified clean golden images, restores verified uncontaminated backups (checking backup timestamps predating attacker dwell time!), and runs heightened post-recovery monitoring to verify zero recurrence.',
              mentalModel:
                'Restoring clean furniture into a house without fixing the broken lock (Eradication) simply invites the burglar right back inside tomorrow night.',
              formulaOrRule: 'Before Reconnecting Recovered Systems: Root Cause Patched + All Credentials Rotated + Clean Image Rebuilt + Backup Verified Pre-Compromise + Heightened Monitoring On.',
            },
          ],
          realWorldScenario: {
            title: 'Stopping Re-Infection After a Rushed Ransomware Restoration',
            situation:
              'After a ransomware hit, IT Ops rapidly restored 30 servers from last week’s backup in 6 hours to impress executives—without patching the vulnerable internet-facing VPN gateway or rotating Active Directory service passwords. Thirty-six hours later, the exact same threat actor re-encrypted the entire network.',
            analysis:
              'Skipping Eradication to rush Recovery turned a manageable disruption into a devastating repeat breach. Proper CISM management enforces a strict Recovery Gate: identify initial access vector, patch/close root cause, invalidate all potentially harvested credentials, verify backup cleanliness prior to initial attacker dwell time, and monitor closely upon phased reconnection.',
            takeaway:
              'Speed without Eradication guarantees repeat compromise—never restore production until the entry vector and persistence mechanisms are confirmed eliminated.',
          },
          examTraps: [
            'ISACA classic: "What is the MOST critical action to take BEFORE wiping and rebuilding a compromised server when prosecution or regulatory inquiry is possible?" -> Capture a forensically sound image (RAM + bit-stream disk) and establish Chain of Custody!',
            'Remember: NEVER restore backups blindly without verifying the backup predates the attacker’s initial compromise (dwell time)—otherwise you literally restore the attacker’s backdoor!',
            'Containment stops spread NOW; Eradication removes the root cause and attacker foothold completely; Recovery returns verified clean operations to the business.',
          ],
          keyTerms: [
            { term: 'Dwell Time', definition: 'Elapsed duration between an attacker’s initial unauthorized entry into an environment and their detection by defenders.' },
            { term: 'Containment', definition: 'Immediate tactical actions restricting incident scope and preventing further lateral spread or data loss.' },
            { term: 'Eradication', definition: 'Complete removal of malicious artifacts, unauthorized accounts, persistence mechanisms, and the underlying root-cause vulnerability.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d4-l2-q1',
              question:
                'Following a confirmed network intrusion, IT operations proposes immediately formatting compromised application servers and restoring yesterday’s backups to minimize downtime. What is the Information Security Manager’s GREATEST concern with this plan?',
              options: [
                'Formatting drives takes slightly longer than deleting files',
                'Destroying forensic evidence and risking immediate re-compromise if the root-cause vulnerability and backup dwell-time cleanliness have not been verified',
                'Backups might consume extra network bandwidth',
                'Employees will have to log back into their workstations',
              ],
              correctIndex: 1,
              rationale:
                'Rushing to wipe and restore skips two vital steps: (1) preserving forensic evidence/Chain of Custody, and (2) completing Eradication (confirming the initial attack vector is closed and verifying backups predate attacker dwell time).',
            },
            {
              id: 'cism-d4-l2-q2',
              question:
                'Which step IMMEDIATELY follows Containment in the standard ISACA incident response workflow?',
              options: [
                'Preparation',
                'Eradication',
                'Initial Triage',
                'Annual Budget Planning',
              ],
              correctIndex: 1,
              rationale:
                'Once the threat is Contained (bleeding stopped), the team proceeds to Eradication (removing malware, attacker persistence, and root-cause vulnerabilities) prior to clean Recovery and Lessons Learned.',
            },
          ],
          practicalDrill: {
            title: 'Clean Recovery Gate Checklist',
            prompt:
              'Define the mandatory sign-off criteria an Incident Commander must verify before reconnecting any recovered system to production.',
            steps: [
              'Confirm forensic RAM/disk snapshots are hashed and archived in Chain of Custody.',
              'Verify initial access vector is patched/closed and ALL privileged + `krbtgt` / API credentials have been rotated.',
              'Confirm restored backup timestamp precedes earliest known indicator of compromise (dwell time).',
              'Enable enhanced EDR/SIEM watch rules for 30 days post-restoration.',
            ],
            successCriteria:
              'Checklist eliminates re-infection risk, protects forensic integrity, and sequences Containment -> Eradication -> Verified Recovery cleanly.',
          },
          flashcards: [
            { front: 'Why must responders check "Dwell Time" before restoring backups?', back: 'If attackers were inside for 14 days, restoring a 3-day-old backup simply reinstalls their malware and persistence backdoors.', tag: 'cism-d4' },
            { front: 'Containment vs. Eradication vs. Recovery?', back: 'Containment = isolate/stop spread; Eradication = remove malware, backdoors, AND root cause; Recovery = restore verified clean systems and monitor closely.', tag: 'cism-d4' },
            { front: 'What must be preserved BEFORE wiping a compromised machine if legal action is possible?', back: 'Volatile memory (RAM), write-blocked bit-stream disk image, SHA-256 hashes, and documented Chain of Custody.', tag: 'cism-d4' },
          ],
          sourceRefs: ['my_documents/CISM QA, 9th Edition.pdf'],
        },
        {
          id: 'cism-d4-l3',
          title: 'BCP/DRP Integration, Testing Programs & Post-Incident Reviews (PIR)',
          estimatedMinutes: 45,
          summary:
            'Unify Incident Response with Business Continuity and Disaster Recovery (MTD, RTO, RPO, SDO, MTO), run progressive testing regimes, and institutionalize blameless Post-Incident Reviews.',
          learningObjectives: [
            'Integrate Incident Response (IRP), Disaster Recovery (DRP), and Business Continuity (BCP) seamlessly around shared BIA thresholds.',
            'Master ISACA-specific continuity metrics: MTD/MAO, RTO, RPO, Service Delivery Objective (SDO), and Maximum Tolerable Outage (MTO).',
            'Design recurring IRP/BCP/DRP testing schedules and update plans after EVERY test or major organizational change.',
            'Execute blameless Post-Incident Reviews (PIR / Lessons Learned) feeding directly back into Risk Management and Program Controls.',
          ],
          coreConcepts: [
            {
              heading: 'Seamless IRP <-> DRP <-> BCP Integration & ISACA Continuity Metrics',
              explanation:
                'A cyberattack that wipes Active Directory or core ERP servers rapidly crosses from an IT security incident into a full Business Continuity / Disaster Recovery event! Therefore, IRP, DRP, and BCP MUST share one unified BIA, one crisis escalation tree, and compatible metrics: RTO (time to restore IT tech), RPO (max acceptable data loss in time), Work Recovery Time (WRT — time to verify data integrity and restore business workflows after IT is up; `RTO + WRT <= MTD`), Service Delivery Objective (SDO — minimum degraded service level required to survive during alternate-mode operations), and Maximum Tolerable Outage (MTO — maximum time the company can survive running in degraded SDO alternate mode before failing!).',
              mentalModel:
                'RTO restarts the hospital generator; WRT checks the surgical monitors and patient charts; SDO is running critical ER surgeries only (deferring elective care); MTO is how many days you can survive on emergency generator mode before normal power MUST return.',
              formulaOrRule: 'RTO + WRT <= MTD | SDO = Minimum Acceptable Degraded Level | MTO = Max Duration Surviving in Degraded Alternate Mode.',
            },
            {
              heading: 'Testing, Maintenance & Post-Incident Reviews (Lessons Learned)',
              explanation:
                'ISACA’s #1 test rule: An untested IRP/BCP/DRP is effectively nonexistent—and a plan that isn’t UPDATED after testing, personnel turnover, or IT changes decays rapidly into obsolescence! Run regular progressive tests (Tabletop -> Simulation -> Parallel -> Full where safe) and track every gap found to closure. After EVERY real incident (or major exercise), conduct a prompt, BLAMELESS Post-Incident Review (PIR / Lessons Learned) asking: What worked? What slowed detection/containment? Which controls failed? Feed outputs straight into (1) updated IRP playbooks, (2) Risk Register updates, (3) permanent control fixes, and (4) security awareness updates.',
              mentalModel:
                'Blame makes teams hide mistakes; a blameless Post-Incident Review turns every crisis into permanent organizational armor.',
              formulaOrRule: 'Most Important Goal of Post-Incident Review (PIR) = Identify Root Causes & Improve Controls/Plans to Prevent Recurrence (NOT punish staff).',
            },
          ],
          realWorldScenario: {
            title: 'Closing the Loop After a Simulated Ransomware Crisis Exercise',
            situation:
              'During an annual joint IRP/BCP tabletop exercise, the team discovers three critical flaws: the backup CISO’s phone number was 2 years out of date, the PR legal hold templates were inaccessible because SharePoint was "encrypted" in the scenario, and RTO estimates ignored the 6 hours needed by Finance to reconcile transaction ledgers (WRT).',
            analysis:
              'Testing exposed hidden operational blind spots safely at zero real-world cost! Updating out-of-band contact trees, storing printed/offline crisis playbooks, revising BIA schedules to include Finance’s 6-hour WRT (`RTO + WRT <= MTD`), and scheduling a follow-up verification drill transforms a paper binder into genuine resilience.',
            takeaway:
              'Every drill and real incident must produce tracked remediation owners and updated plans—otherwise the same failure repeats under live fire.',
          },
          examTraps: [
            'Know the exact ISACA formula: `RTO + WRT <= MTD` (Maximum Tolerable Downtime). If RTO = 6 hrs and WRT = 4 hrs, total recovery takes 10 hrs—violating an 8-hour MTD!',
            'ISACA classic: "What is the PRIMARY reason for conducting a Post-Incident Review (Lessons Learned)?" -> To identify root causes and improve processes, controls, and the IRP to prevent future recurrence (NEVER "to discipline negligent staff").',
            'When must an IRP / BCP / DRP be updated? At least annually AND immediately following any test failures, real incidents, key personnel changes, or significant business/IT architecture changes!',
          ],
          keyTerms: [
            { term: 'Work Recovery Time (WRT)', definition: 'Elapsed time required after IT systems are technically restored (RTO) to verify data integrity and resume normal business workflows.' },
            { term: 'Service Delivery Objective (SDO)', definition: 'Minimum acceptable level of degraded business service required to sustain survival during alternate-site/continuity operations.' },
            { term: 'Maximum Tolerable Outage (MTO)', definition: 'Maximum time an enterprise can sustain operating in degraded alternate mode (SDO) before suffering unacceptable business failure.' },
            { term: 'Post-Incident Review (PIR)', definition: 'Blameless structured retrospective following an incident to capture root causes, measure response effectiveness, and upgrade controls and playbooks.' },
          ],
          conceptChecks: [
            {
              id: 'cism-d4-l3-q1',
              question:
                'A mission-critical payment process has a Maximum Tolerable Downtime (MTD) of 8 hours. IT infrastructure restoration (RTO) takes 5 hours, and business transaction reconciliation plus data validation (WRT) takes 4 hours. What should the Information Security Manager conclude?',
              options: [
                'The recovery strategy safely meets the MTD because RTO (5h) is less than MTD (8h)',
                'The recovery strategy FAILS to meet the MTD because RTO + WRT (9 hours) exceeds the 8-hour MTD',
                'WRT is irrelevant to Business Continuity Planning',
                'RPO must automatically be increased to 9 hours',
              ],
              correctIndex: 1,
              rationale:
                'Total business resumption time equals RTO + WRT (5 + 4 = 9 hours), which breaches the 8-hour MTD! The organization must reduce RTO or streamline WRT reconciliation to fit safely within 8 hours.',
            },
            {
              id: 'cism-d4-l3-q2',
              question:
                'What is the PRIMARY objective of conducting a Post-Incident Review (PIR) shortly after resolving a major security incident?',
              options: [
                'Determining which IT engineer should be terminated for the outage',
                'Identifying root causes, measuring response performance, and updating controls and playbooks to prevent recurrence',
                'Deleting all incident tickets to protect corporate reputation',
                'Replacing the Information Security Steering Committee',
              ],
              correctIndex: 1,
              rationale:
                'Post-Incident Reviews focus constructively on lessons learned, root-cause elimination, playbook updates, and control improvements to strengthen future resilience.',
            },
          ],
          practicalDrill: {
            title: 'Unified IRP-BCP-DRP Metric Validation & PIR Workflow',
            prompt:
              'Audit your organization’s top 3 business processes for recovery-time feasibility and PIR discipline.',
            steps: [
              'Verify `RTO + WRT <= MTD` for every Tier-1 process—flagging any hidden manual business reconciliation time.',
              'Define SDO (degraded operation minimum) and MTO (max alternate-mode duration) alongside Business Owners.',
              'Mandate a blameless PIR within 5 business days of every Sev-1/Sev-2 incident feeding tracked action items straight into the Risk Register and IRP.',
            ],
            successCriteria:
              'Audit verifies `RTO + WRT <= MTD`, integrates SDO/MTO, and enforces a closed-loop blameless PIR pipeline.',
          },
          flashcards: [
            { front: 'State the exact mathematical relationship between RTO, WRT, and MTD.', back: 'RTO (IT recovery) + WRT (business workflow/data verification) MUST be <= MTD (Maximum Tolerable Downtime).', tag: 'cism-d4' },
            { front: 'Contrast SDO vs. MTO in ISACA continuity terminology.', back: 'SDO (Service Delivery Objective) = minimum acceptable degraded service level during disruption; MTO (Maximum Tolerable Outage) = max time the org can survive in that degraded mode.', tag: 'cism-d4' },
            { front: 'When MUST a BCP/DRP/IRP be updated?', back: 'At least annually, AND immediately after tests, real incidents, key staff changes, or significant business/technology changes.', tag: 'cism-d4' },
          ],
          sourceRefs: [
            'my_documents/CISM QA, 9th Edition.pdf',
            'my_documents/Complete Guide to CISM Certification.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Enterprise CISO Turnaround — From Siloed IT Security to Board-Aligned CISM Governance',
    scenario:
      'Vanguard Global Logistics (8,500 employees across 18 countries) suffered a 36-hour regional ransomware disruption six months ago. You are hired as their new VP / Information Security Manager. Your Day-1 audit reveals: (1) Security currently reports under the VP of Infrastructure (who blocks security upgrades that slow deployments); (2) zero Information Security Steering Committee exists; (3) business units routinely sign SaaS vendor contracts without security review and request permanent verbal waivers; (4) IT ranks system criticality by server age rather than BIA; and (5) during the past ransomware attack, an IT lead emailed press unapproved guesses and restored infected backups before closing the initial VPN flaw.',
    tasks: [
      'Redesign governance authority, reporting lines, and an Information Security Steering Committee Charter aligned to ISACA’s 6 Outcomes (Domain 1).',
      'Establish business-driven Asset Valuation/BIA, a time-bound Policy Exception process, Risk Appetite/Tolerance thresholds, and Procurement-gated TPRM (Domains 1 & 2).',
      'Integrate security into PMO Gate 1, craft a CFO-ready Business Case (full TCO + ROSI) for right-sized target maturity, and replace completion-rate metrics with behavioral awareness and balanced KGI/KPI/KRI dashboards (Domain 3).',
      'Rebuild Incident Management readiness (pre-authorized CSIRT powers, out-of-band comms, Legal/PR external rules, dwell-time clean recovery gates, `RTO + WRT <= MTD`, and blameless PIR) (Domain 4).',
    ],
    modelSolution:
      '1) Governance (D1): Elevate CISO reporting out of IT Infrastructure to the CRO/CEO with direct quarterly access to the Board Audit Committee; charter a cross-functional Information Security Steering Committee (Business VPs, Legal, HR, CFO, CIO, Internal Audit as non-voting Line-3 observer) aligned directly to corporate logistics expansion goals across ISACA’s 6 Outcomes. 2) Risk & TPRM (D2): Anchor risk management in a complete Asset Inventory owned by Business Executives and a business-led BIA uncovering true downtime value (`RTO + WRT <= MTD`); institute a living Risk Register with named Business Risk Owners, leading KRIs, and change-triggered reassessments; enforce formal time-bound Policy Exceptions (risk analysis + compensating controls + Business Owner sign-off + expiration date); gate Procurement so Tier-1 vendors undergo SOC 2 Type II due diligence and sign Right-to-Audit + 24h breach SLA contracts BEFORE signature. 3) Security Program (D3): Adopt business-driven Enterprise Security Architecture (SABSA), embed mandatory security sign-off into PMO Gate 1 (Project Initiation), justify investments via CFO Business Cases comparing Status Quo + full 3-year TCO + ROSI targeting right-sized maturity (not blanket Level 5), measure awareness via behavioral change (phishing click drop/reporting speed), and brief the Board with 6 concise KGIs/KRIs. 4) Incident Management (D4): Publish an executive-approved IRP granting pre-authorized Sev-1 containment, deploy out-of-band crisis comms, route ALL external press strictly through PR and Law Enforcement decisions through Legal + Senior Management, mandate forensic capture + root-cause Eradication + pre-dwell-time clean backup verification before Recovery, run Parallel tests, and close every incident with a blameless PIR updating controls and the Risk Register.',
  },
  examStrategy: {
    examFormat:
      '150 multiple-choice questions, 4 hours (240 minutes), passing scaled score 450 / 800 (roughly 65–72% raw depending on question difficulty). Notice the massive weight concentration: Domains 3 (33%) + 4 (30%) equal 63% of the entire exam!',
    timeManagementPlan:
      'Target ~1.3 minutes per question (Question 50 by Minute 65, Question 100 by Minute 130, Question 150 by Minute 195), leaving 45 full minutes to review flagged scenario questions. Unlike ISC2 exams, ISACA ALLOWS flagging and revisiting previous questions—use it wisely, changing answers only when you spot a clear misread!',
    mindsetRules: [
      'The ISACA CISM Golden Lens: You are an Enterprise Information Security MANAGER advising the Board—NEVER an engineer clicking buttons on a firewall!',
      'Business Objectives Rule Everything: Whenever two answers look good, pick the one that aligns security with business goals, reduces risk cost-effectively, or requires Senior Management / Business Owner involvement.',
      'Steering Committee = Magic Answer for cross-departmental alignment, priority disputes, and business buy-in.',
      'Timing Triggers Matter: "FIRST" almost always points to understanding business goals, classifying assets, conducting BIA/Risk Assessment, or verifying/containing an incident before jumping into technical execution.',
      'Never Let Security Accept Business Risk: Security identifies, quantifies, and recommends treatments—ONLY Senior Management / Risk Owners accept residual risk.',
    ],
    finalWeekChecklist: [
      'Drill Domains 3 (33%) and 4 (30%) hardest—they represent nearly two-thirds of your score.',
      'Score >= 85% across all 4 domains in the ISACA CISM Q&A Manual (9th Edition), reading EVERY rationale for why ISACA rejected the runner-up distractor.',
      'Memorize key ISACA distinctions: Governance vs. Management, KGI vs. KPI vs. KRI, Risk Capacity vs. Appetite vs. Tolerance, `RTO + WRT <= MTD`, SDO vs. MTO, and Pre-Contract TPRM.',
      'Run two full 150-question 4-hour stamina simulations so focus stays razor-sharp through Questions 120–150.',
    ],
  },
};
