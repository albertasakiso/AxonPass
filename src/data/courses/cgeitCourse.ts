/* ===================================================================
   ANOXPASS — ISACA CGEIT End-to-End Certification Course
   Tier 5 (Executive) | All 4 Official Domains | Zero-to-Exam-Ready
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const CGEIT_COURSE: CertificationCourse = {
  certId: 'cgeit',
  certCode: 'CGEIT',
  title: 'ISACA Certified in the Governance of Enterprise IT',
  provider: 'ISACA',
  tier: 5,
  tagline: 'Master board-level Enterprise IT Governance, COBIT 2019, IT value delivery, resource optimization, and risk governance.',
  estimatedTotalHours: 90,
  passingScore: '450 / 800 (Scaled)',
  domains: [
    // =================================================================
    // DOMAIN 1: GOVERNANCE OF ENTERPRISE IT (40%)
    // =================================================================
    {
      id: 'cgeit-d1',
      domainNumber: 1,
      title: 'Governance of Enterprise IT',
      examWeightPercent: 40,
      overview:
        'The powerhouse domain of CGEIT (40% of the entire exam!). Masters board-level IT governance frameworks (COBIT 2019, ISO/IEC 38500), the strict boundary between Governance (EDM) and Management (PBRM), the Goals Cascade, 11 Design Factors, 7 Governance Components, and organizational culture.',
      lessons: [
        {
          id: 'cgeit-d1-l1',
          title: 'COBIT 2019 Core Architecture (EDM vs. PBRM) & ISO/IEC 38500',
          estimatedMinutes: 50,
          summary:
            'Master the exact separation of Governance (Evaluate, Direct, Monitor — Board) from Management (Plan, Build, Run, Monitor — C-Suite/Ops), COBIT 2019’s 40 Governance & Management Objectives, and ISO/IEC 38500’s six corporate IT governance principles.',
          learningObjectives: [
            'Distinguish the 5 COBIT 2019 Governance Objectives (EDM01–EDM05) from the 4 Management Domains (APO, BAI, DSS, MEA).',
            'Explain COBIT 2019’s 6 Governance System Principles and 3 Governance Framework Principles.',
            'Apply ISO/IEC 38500’s Evaluate-Direct-Monitor model and 6 Principles (Responsibility, Strategy, Acquisition, Performance, Conformance, Human Behavior).',
            'Articulate why Enterprise Governance of IT (EGIT) is an integral part of Corporate Governance—NOT an isolated IT department task.',
          ],
          coreConcepts: [
            {
              heading: 'COBIT 2019: Strict Separation of Governance (EDM) & Management (PBRM)',
              explanation:
                'COBIT 2019 enforces a razor-sharp architectural boundary between Governance and Management across 40 objectives: Governance (owned by the Board of Directors under Chair leadership) comprises 1 domain with 5 exact objectives — EDM (Evaluate, Direct, and Monitor): EDM01 Ensured Governance Framework Setting & Maintenance, EDM02 Ensured Benefits Delivery, EDM03 Ensured Risk Optimization, EDM04 Ensured Resource Optimization, and EDM05 Ensured Stakeholder Engagement. Management (owned by Executive Management under the CEO) spans 4 operational domains (PBRM — 35 objectives): APO (Align, Plan, Organize), BAI (Build, Acquire, Implement), DSS (Deliver, Service, Support), and MEA (Monitor, Evaluate, Assess).',
              mentalModel:
                'Notice how the 5 EDM objectives literally map 1-to-1 onto CGEIT’s four exam domains! EDM01/05 = Governance (D1), EDM04 = IT Resources (D2), EDM02 = Benefits Realization (D3), EDM03 = Risk Optimization (D4).',
              formulaOrRule: 'Board = EDM (5 Objectives: Framework, Benefits, Risk, Resources, Stakeholders). Exec Mgmt = PBRM (APO, BAI, DSS, MEA — 35 Objectives).',
            },
            {
              heading: 'Stakeholder Value Creation Formula & ISO/IEC 38500',
              explanation:
                'The supreme purpose of Enterprise Governance of IT (EGIT) is Stakeholder Value Creation—defined as the continuous balancing of three competing forces: Benefits Realization (creating value) + Risk Optimization (preserving value) + Resource Optimization (using capital/talent efficiently). ISO/IEC 38500 reinforces this at the Board level via six guiding principles: (1) Responsibility (clear ownership), (2) Strategy (IT supports current/future business plans), (3) Acquisition (valid business cases balancing benefit/cost/risk), (4) Performance (fit-for-purpose service), (5) Conformance (comply with laws/policies), and (6) Human Behavior (respecting culture and all people affected).',
              mentalModel:
                'Stakeholder Value is a three-legged stool: Benefits Realization, Risk Optimization, and Resource Optimization. Saw off any one leg and the enterprise topples.',
              formulaOrRule: 'Stakeholder Value = Benefits Realization + Risk Optimization + Resource Optimization.',
            },
            {
              heading: 'The 6 COBIT 2019 Governance System Principles',
              explanation:
                'A world-class EGIT system MUST satisfy six COBIT 2019 System Principles: (1) Provide Stakeholder Value; (2) Holistic Approach (built from multiple interacting components, not just policies); (3) Dynamic Governance System (adapts whenever design factors/strategy change); (4) Governance Distinct from Management; (5) Tailored to Enterprise Needs (using Design Factors—never one-size-fits-all!); and (6) End-to-End Governance System (covers ALL enterprise information and tech, not merely the internal IT department!).',
              mentalModel:
                'End-to-End means EGIT governs SaaS marketing apps, factory robotics, shadow AI tools, and cloud vendors—not just servers sitting inside the CIO’s data center.',
              formulaOrRule: 'EGIT Scope = ALL information & technology processing across the entire enterprise (end-to-end), NOT just the IT department.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Board Micromanagement vs. Board Abdication at a Global Bank',
            situation:
              'At a multinational bank, the Board of Directors either completely delegates IT oversight to the CIO ("IT is too technical for us") OR wastes 45 minutes of board meetings debating which database vendor to buy.',
            analysis:
              'Both extremes break EGIT! Delegating governance to the CIO abdicates fiduciary duty (failing EDM01–05), while picking database vendors crosses into Management (BAI). Implementing COBIT 2019 EDM + ISO/IEC 38500 sets clear Board Governance boundaries: the Board Evaluates strategic needs, Directs via risk appetite and investment guardrails, and Monitors value/risk scorecards—empowering Management (CEO/CIO) to Plan, Build, Run, and Monitor technology execution.',
            takeaway:
              'Good boards steer direction and demand accountability (EDM); they never abdicate oversight and never micromanage operational IT choices (PBRM).',
          },
          examTraps: [
            'CGEIT classic: Who is ultimately accountable for Enterprise Governance of IT? ALWAYS the Board of Directors (never the CIO, never the CISO, never Internal Audit!).',
            'Watch out for the scope trap: EGIT covers ALL information and technology across the ENTIRE enterprise—including business-unit SaaS, OT, and outsourced processes—NOT merely the IT department.',
            'Know the exact difference between EDM (Governance — Board) and MEA (Monitor, Evaluate, Assess — Management’s operational compliance/assurance monitoring!).',
          ],
          keyTerms: [
            { term: 'EGIT', definition: 'Enterprise Governance of Information and Technology—board-led discipline ensuring IT creates stakeholder value through benefits realization, risk optimization, and resource optimization.' },
            { term: 'EDM (Evaluate, Direct, Monitor)', definition: 'The 5 COBIT 2019 Board-level governance objectives covering framework setting, benefits, risk, resources, and stakeholder engagement.' },
            { term: 'ISO/IEC 38500', definition: 'International standard for Corporate Governance of IT structured around Evaluate-Direct-Monitor and six executive principles.' },
            { term: 'PBRM (APO/BAI/DSS/MEA)', definition: 'COBIT 2019’s four Management domains executing Plan, Build, Run, and Monitor activities aligned with Board direction.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d1-l1-q1',
              question:
                'Which combination of three core outcomes defines "Stakeholder Value Creation" under COBIT 2019 and ISACA’s Enterprise Governance of IT?',
              options: [
                'Software Coding, Network Firewalls, and Cloud Migration',
                'Benefits Realization, Risk Optimization, and Resource Optimization',
                'Hardware Depreciation, Audit Compliance, and Incident Containment',
                'Project Scheduling, Vendor Contracting, and Help Desk SLA Attainment',
              ],
              correctIndex: 1,
              rationale:
                'Under COBIT 2019, stakeholder value is created by achieving the optimal balance of three governance objectives: realizing benefits (EDM02), optimizing risk (EDM03), and optimizing resources (EDM04).',
            },
            {
              id: 'cgeit-d1-l1-q2',
              question:
                'A corporate board asks an executive advisor to distinguish its Governance responsibilities from Executive Management’s responsibilities under COBIT 2019. Which activity belongs strictly to Governance (EDM)?',
              options: [
                'Selecting specific cloud container orchestration software (BAI)',
                'Operating the 24/7 IT service desk and incident queue (DSS)',
                'Evaluating stakeholder needs, directing strategic priorities/risk appetite, and monitoring overall performance (EDM)',
                'Configuring database backup schedules and patch testing (DSS)',
              ],
              correctIndex: 2,
              rationale:
                'Governance (Board level) evaluates stakeholder conditions/options, directs through prioritization and decision-making, and monitors performance and compliance against agreed direction (EDM). Building, running, and operating IT belong to Management (PBRM).',
            },
          ],
          practicalDrill: {
            title: 'Board vs. Management EGIT Charter Allocation',
            prompt:
              'Draft a concise Board IT Governance Committee Charter separating EDM governance oversight from CIO/CEO PBRM execution.',
            steps: [
              'Map each of EDM01–EDM05 to quarterly Board IT Governance Committee agenda items.',
              'Explicitly exclude operational technology procurement/configuration decisions (APO/BAI/DSS) from Board sign-off unless crossing materiality thresholds.',
              'Verify ISO/IEC 38500’s 6th principle ("Human Behavior") is explicitly addressed for workforce change management.',
            ],
            successCriteria:
              'Charter cleanly distinguishes Board EDM accountability from Management PBRM execution and encompasses enterprise-wide IT end-to-end.',
          },
          flashcards: [
            { front: 'List all 5 COBIT 2019 Governance (EDM) Objectives.', back: 'EDM01 Framework Setting, EDM02 Benefits Delivery, EDM03 Risk Optimization, EDM04 Resource Optimization, EDM05 Stakeholder Engagement.', tag: 'cgeit-d1' },
            { front: 'Name the 4 COBIT 2019 Management Domains (PBRM).', back: 'APO (Align, Plan, Organize), BAI (Build, Acquire, Implement), DSS (Deliver, Service, Support), MEA (Monitor, Evaluate, Assess).', tag: 'cgeit-d1' },
            { front: 'List the 6 principles of ISO/IEC 38500.', back: 'Responsibility, Strategy, Acquisition, Performance, Conformance, and Human Behavior.', tag: 'cgeit-d1' },
          ],
          sourceRefs: [
            'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
            'my_documents/COBIT_2019_Framework_Introduction_and_Methodology_res_eng_1118.pdf',
          ],
        },
        {
          id: 'cgeit-d1-l2',
          title: 'COBIT 2019 Goals Cascade, 7 Components & Tailoring via Design Factors',
          estimatedMinutes: 45,
          summary:
            'Translate top-level stakeholder needs into actionable IT goals using the COBIT Goals Cascade, orchestrate all 7 Governance Components holistically, and tailor EGIT using the 11 Design Factors.',
          learningObjectives: [
            'Trace the exact 4-step COBIT 2019 Goals Cascade from Stakeholder Drivers & Needs down to Governance & Management Objectives.',
            'Manage all 7 Components of a Governance System (Processes; Org Structures; Principles/Policies/Frameworks; Information; Culture/Ethics/Behavior; People/Skills/Competencies; Services/Infrastructure/Apps).',
            'Tailor an enterprise governance system using COBIT 2019 Design Factors (Enterprise Strategy, Risk Profile, Threat Landscape, Compliance, Role of IT, Sourcing, IT Implementation Methods, Enterprise Size).',
          ],
          coreConcepts: [
            {
              heading: 'The COBIT 2019 Goals Cascade (Traceability Engine)',
              explanation:
                'How do you prove to a skeptical CEO that an IT governance control actually drives shareholder value? Through the 4-tier COBIT 2019 Goals Cascade: (1) Stakeholder Drivers & Needs (internal/external pressures — regulators, investors, customers) -> cascade into -> (2) Enterprise Goals (13 Balanced Scorecard goals across Financial, Customer, Internal, Growth) -> cascade into -> (3) Alignment Goals (13 IT-aligned goals connecting business needs to IT capabilities) -> cascade into -> (4) Governance & Management Objectives (the 40 EDM/APO/BAI/DSS/MEA objectives). Every governance investment MUST trace vertically up the Goals Cascade!',
              mentalModel:
                'The Goals Cascade is a golden thread connecting the Boardroom to the Data Center—pull on any IT project and you should immediately see which Stakeholder Need it serves.',
              formulaOrRule: 'Goals Cascade Order: Stakeholder Drivers/Needs -> Enterprise Goals -> Alignment Goals -> Governance & Management Objectives.',
            },
            {
              heading: 'The 7 Components of a Holistic Governance System',
              explanation:
                'A fatal governance blunder is thinking "IT Governance = writing policies and process flowcharts." COBIT 2019 mandates integrating SEVEN mutually reinforcing Components (formerly "Enablers"): (1) Processes; (2) Organizational Structures (committees, decision bodies); (3) Principles, Policies, and Frameworks; (4) Information (timely, accurate decision data); (5) Culture, Ethics, and Behavior (often underestimated—determines real adoption!); (6) People, Skills, and Competencies; and (7) Services, Infrastructure, and Applications. Neglecting even one component (like Culture or Skills) causes the best-written Processes to fail!',
              mentalModel:
                'Processes are just sheet music; you still need the Orchestra (People/Skills), Instruments (Infrastructure), Conductor (Org Structure), and Passion (Culture) to make music.',
              formulaOrRule: 'Holistic EGIT = All 7 Components working together (never policies or processes alone!).',
            },
            {
              heading: 'Tailoring EGIT with COBIT 2019 Design Factors',
              explanation:
                'A 50-person AI startup using Agile DevOps and cloud SaaS needs a vastly different governance design than a 90,000-employee regulated global bank running legacy mainframes. COBIT 2019 provides 11 Design Factors (Enterprise Strategy, Enterprise Goals, Risk Profile, I&T-Related Issues, Threat Landscape, Compliance Requirements, Role of IT [Support/Factory/Turnaround/Strategic], Sourcing Model, IT Implementation Methods [Agile/DevOps/Traditional], Tech Adoption Strategy [First Mover/Follower/Slow Adopter], and Enterprise Size) to tailor target capability levels and prioritize exactly which governance objectives matter most.',
              mentalModel:
                'Design Factors act like a master tailor’s tape measure—ensuring a nimble startup isn’t suffocated by a giant bank’s bureaucracy and a giant bank isn’t under-governed like a startup.',
              formulaOrRule: 'Never adopt COBIT/ITIL "out of the box"—ALWAYS tailor using Enterprise Context & Design Factors!',
            },
          ],
          realWorldScenario: {
            title: 'Why an Un-Tailored Governance Rollout Collapsed in a High-Speed Tech Scale-Up',
            situation:
              'A newly hired Governance VP copied a heavy 40-process banking governance handbook verbatim into a 350-person Agile SaaS company. Product teams ignored the 6-week change-approval boards, spawned shadow cloud accounts, and executive sponsors threatened to dissolve the governance team.',
            analysis:
              'The VP ignored COBIT 2019 Design Factors (Enterprise Strategy: Growth/Innovation; Implementation Method: Agile/DevOps; Size: Medium; Culture: Autonomous) and focused solely on Policies/Processes while neglecting Culture, Ethics, and Behavior. Tailoring governance around lightweight automated DevOps guardrails, focusing on high-priority objectives only, and engaging product leads in co-design restored alignment.',
            takeaway:
              'Governance fails whenever it is copy-pasted without tailoring to Enterprise Design Factors and Culture.',
          },
          examTraps: [
            'CGEIT classic: "What is the FIRST step when designing or tailoring an Enterprise Governance of IT framework?" -> Understand enterprise context, strategy, and stakeholder needs (Step 1 of the Goals Cascade / Design Factors)!',
            'Watch out for the "IT Role" Design Factor (McFarlan Strategic Grid): Support (low current/future impact), Factory (high current uptime, low future innovation), Turnaround (low current, high future digital disruption), Strategic (high current AND high future reliance—demands maximum Board governance!).',
            'When a governance initiative stalls despite well-written policies and executive sponsorship, inspect Component #5 (Culture, Ethics, and Behavior) and Component #6 (People/Skills) plus Change Management!',
          ],
          keyTerms: [
            { term: 'COBIT Goals Cascade', definition: 'Structured mechanism translating Stakeholder Needs -> Enterprise Goals -> Alignment Goals -> Governance & Management Objectives.' },
            { term: 'Governance Components', definition: 'Seven interacting elements required for a holistic EGIT system: Processes, Org Structures, Policies/Frameworks, Information, Culture/Behavior, People/Skills, and Services/Infrastructure.' },
            { term: 'Design Factors', definition: 'Eleven enterprise-specific contextual variables (strategy, risk profile, compliance, size, sourcing, Agile/DevOps) used to tailor a governance system.' },
            { term: 'Strategic Role of IT', definition: 'Highest McFarlan/COBIT classification where IT is critical BOTH for current daily operations AND future competitive differentiation.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d1-l2-q1',
              question:
                'In the COBIT 2019 Goals Cascade, what directly bridges broad "Enterprise Goals" to concrete "Governance and Management Objectives"?',
              options: [
                'Service Level Agreements (SLAs)',
                'Alignment Goals',
                'Technical Firewall Baselines',
                'Vendor Contracts',
              ],
              correctIndex: 1,
              rationale:
                'The exact 4-tier COBIT 2019 Goals Cascade flows: Stakeholder Drivers & Needs -> Enterprise Goals -> Alignment Goals -> Governance & Management Objectives.',
            },
            {
              id: 'cgeit-d1-l2-q2',
              question:
                'A global enterprise publishes comprehensive IT governance policies and establishes formal steering committees, yet business units consistently bypass governance controls using shadow SaaS tools. Which COBIT Governance Component has MOST likely been neglected?',
              options: [
                'Services, Infrastructure, and Applications',
                'Culture, Ethics, and Behavior (alongside Stakeholder Engagement)',
                'Network Routing Protocols',
                'Hardware Depreciation Schedules',
              ],
              correctIndex: 1,
              rationale:
                'Governance systems fail when organizations build policies and structures without addressing Culture, Ethics, and Behavior, organizational change management, and meaningful stakeholder engagement.',
            },
          ],
          practicalDrill: {
            title: 'COBIT 2019 Design Factor Tailoring Workshop',
            prompt:
              'Tailor an EGIT system for a regulated FinTech moving from legacy waterfall to cloud-native Agile.',
            steps: [
              'Trace 1 Stakeholder Need ("Zero regulatory penalties while launching 2x faster") down all 4 tiers of the Goals Cascade.',
              'Score 5 Design Factors (Strategy: Innovation/Compliance; Risk Profile: High; Role of IT: Strategic; Sourcing: Cloud; Method: DevOps).',
              'Specify actions across all 7 Governance Components—explicitly including Culture/Behavior and Skills—rather than just writing policies.',
            ],
            successCriteria:
              'Workshop traces all 4 Goals Cascade tiers cleanly and tailors across all 7 Components using Design Factors.',
          },
          flashcards: [
            { front: 'Trace the 4 steps of the COBIT 2019 Goals Cascade.', back: 'Stakeholder Drivers & Needs -> Enterprise Goals -> Alignment Goals -> Governance & Management Objectives.', tag: 'cgeit-d1' },
            { front: 'List all 7 COBIT 2019 Governance System Components.', back: '1) Processes, 2) Org Structures, 3) Principles/Policies/Frameworks, 4) Information, 5) Culture/Ethics/Behavior, 6) People/Skills/Competencies, 7) Services/Infrastructure/Apps.', tag: 'cgeit-d1' },
            { front: 'Name the 4 quadrants of the "Role of IT" Design Factor (McFarlan Grid).', back: 'Support, Factory, Turnaround, and Strategic (highest current + future dependency).', tag: 'cgeit-d1' },
          ],
          sourceRefs: ['my_documents/COBIT_2019_Framework_Introduction_and_Methodology_res_eng_1118.pdf'],
        },
        {
          id: 'cgeit-d1-l3',
          title: 'Strategic Alignment, Information/Data Governance & Organizational Change',
          estimatedMinutes: 40,
          summary:
            'Achieve true two-way Business-IT Strategic Alignment, establish enterprise Information & Data Governance as a boardroom asset, and sustain EGIT via Organizational Change Management (OCM) and continual improvement.',
          learningObjectives: [
            'Distinguish one-way IT support from dynamic two-way Business-IT Strategic Alignment where IT actively shapes corporate strategy.',
            'Govern Information and Data across its full lifecycle (Data Governance vs. Data Management, quality, privacy, monetization, AI ethics).',
            'Apply Organizational Change Management (Kotter / ADKAR) and Capability Assessment (CMMI 0–5) to sustain EGIT transformation.',
          ],
          coreConcepts: [
            {
              heading: 'Two-Way Business-IT Strategic Alignment & Governance Committees',
              explanation:
                'Mature enterprises go beyond "IT reacts to business orders." True Strategic Alignment is bidirectional: Business strategy informs IT architecture AND emerging technology possibilities (AI, cloud ecosystems, data platforms) actively shape new business models! Alignment is operationalized via two distinct executive committees: (1) IT Strategy Committee (Board level — advises the Board on long-term IT strategy, major investments, and risk); and (2) IT Steering Committee (Executive Management level — translates strategy into portfolio priorities, resolves cross-BU resource conflicts, and tracks delivery).',
              mentalModel:
                'The IT Strategy Committee sits IN the Boardroom charting the 5-year voyage; the IT Steering Committee sits on the Executive Bridge allocating fuel, crews, and budgets to each ship.',
              formulaOrRule: 'Board Level = IT Strategy Committee (EDM oversight) | Executive Management Level = IT Steering Committee (Portfolio/Priority execution).',
            },
            {
              heading: 'Information & Data Governance vs. Data Management',
              explanation:
                'Data is an enterprise balance-sheet asset, not a technical byproduct. Mirroring COBIT, Data Governance sets decision rights, accountability (Chief Data Officer, Data Owners), policies, quality standards, ethical/AI usage boundaries, and compliance guardrails—while Data Management executes pipelines, master data catalogs, cleansing, and database storage. Poor data quality silently poisons executive dashboards, AI models, and regulatory filings.',
              mentalModel:
                'Data Governance decides the traffic laws, speed limits, and licensing rules; Data Management builds and paves the highways.',
              formulaOrRule: 'Data Governance (Board/CDO/Data Owners) sets accountability & rules -> Data Management (IT/Engineers) operates pipelines & quality controls.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Failed AI Customer-Pricing Rollout via Data Governance',
            situation:
              'An insurance group spent $8M training an AI underwriting model, only to discover post-launch that fragmented legacy customer records duplicated 18% of policyholders and embedded biased regional proxies—triggering a regulator cease-and-desist order.',
            analysis:
              'The firm invested heavily in AI technology (Data Management/Tools) without foundational Information Governance (data lineage, master data ownership, ethical review, quality KPIs). Establishing a CDO-led Data Governance Council reporting to the IT Strategy Committee ensures data quality, privacy compliance, and ethical AI guardrails precede model deployment.',
            takeaway:
              'You cannot build trustworthy AI or accurate board analytics atop ungoverned, fragmented enterprise data.',
          },
          examTraps: [
            'CGEIT classic committee distinction: IT STRATEGY Committee operates at the BOARD level (advising Board on strategic direction & governance); IT STEERING Committee operates at the EXECUTIVE MANAGEMENT level (overseeing portfolios, project priorities, and resource allocation)!',
            'Watch out for Organizational Change Management (OCM): technical excellence fails if human adoption and resistance are ignored—always include executive sponsorship, clear communication ("What’s in it for me?"), training, and cultural reinforcement!',
            'Capability Levels (COBIT 2019 / CMMI 0–5) evaluate individual PROCESS/OBJECTIVE capability, whereas Maturity Levels evaluate enterprise-wide FOCUS AREAS.',
          ],
          keyTerms: [
            { term: 'IT Strategy Committee', definition: 'Board-level committee advising directors on strategic IT alignment, value creation, and major enterprise IT risks.' },
            { term: 'IT Steering Committee', definition: 'Executive management committee overseeing IT investment portfolios, cross-business prioritization, and delivery performance.' },
            { term: 'Data Governance', definition: 'Exercise of decision-making authority, accountability, and standards over enterprise data assets (distinct from technical Data Management).' },
            { term: 'Organizational Change Management (OCM)', definition: 'Structured approach transitioning individuals, teams, and corporate culture smoothly to adopt new governance ways of working.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d1-l3-q1',
              question:
                'Which governance body operates at the BOARD OF DIRECTORS level to provide insight and advice on long-term strategic IT direction, major technology risks, and alignment with corporate mission?',
              options: [
                'Change Advisory Board (CAB)',
                'IT Strategy Committee',
                'IT Operations Help Desk',
                'Project Management Office (PMO)',
              ],
              correctIndex: 1,
              rationale:
                'The IT Strategy Committee operates at the Board level (composed of Board directors and specialist advisors), whereas the IT Steering Committee operates at the Executive Management level to govern portfolios and delivery.',
            },
            {
              id: 'cgeit-d1-l3-q2',
              question:
                'What is the PRIMARY distinction between Data Governance and Data Management?',
              options: [
                'Data Governance purchases servers while Data Management writes Board charters',
                'Data Governance establishes decision rights, accountability, and policies over data assets, while Data Management executes technical pipelines, storage, and cleansing',
                'Data Management is only for structured SQL databases while Data Governance is only for backups',
                'There is no practical distinction between the two terms',
              ],
              correctIndex: 1,
              rationale:
                'Consistent with COBIT’s Governance vs. Management separation, Data Governance defines ownership, policies, and strategic standards while Data Management executes day-to-day technical stewardship and infrastructure operations.',
            },
          ],
          practicalDrill: {
            title: 'IT Strategy Committee + Data Governance Integration Plan',
            prompt:
              'Design a two-tier committee hierarchy and Data Governance policy for a global enterprise adopting generative AI.',
            steps: [
              'Charter the Board-level IT Strategy Committee (EDM) and Executive-level IT Steering Committee (Portfolio/Delivery) with clean non-overlapping mandates.',
              'Establish Data Owners, Data Stewards, master data quality KPIs, and AI ethical/privacy review gates.',
              'Build an OCM rollout plan using stakeholder champions, visible executive modeling, and quarterly capability maturity reviews.',
            ],
            successCriteria:
              'Plan cleanly differentiates IT Strategy vs. IT Steering committees, separates Data Governance from Management, and integrates OCM.',
          },
          flashcards: [
            { front: 'IT Strategy Committee vs. IT Steering Committee?', back: 'IT Strategy Committee = Board level (long-term strategy, major IT risk/direction); IT Steering Committee = Executive Management level (portfolio prioritization, budgets, delivery oversight).', tag: 'cgeit-d1' },
            { front: 'COBIT 2019: Capability Level vs. Maturity Level?', back: 'Capability Level (0–5) measures how well a single specific governance/management objective performs; Maturity Level (0–5) measures broader enterprise focus-area performance.', tag: 'cgeit-d1' },
            { front: 'Why do technically sound EGIT rollouts most commonly fail?', back: 'Neglecting Organizational Change Management (OCM), stakeholder engagement, and organizational culture.', tag: 'cgeit-d1' },
          ],
          sourceRefs: [
            'my_documents/Rethinking-Data-Governance-and-Data-Management_whp_Eng_0220.pdf',
            'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: IT RESOURCES (15%)
    // =================================================================
    {
      id: 'cgeit-d2',
      domainNumber: 2,
      title: 'IT Resources',
      examWeightPercent: 15,
      overview:
        'Ensures the enterprise optimizes ALL IT capabilities—people, skills, information, applications, infrastructure, and external service providers (EDM04)—through strategic capacity planning, Enterprise Architecture, and disciplined sourcing/vendor governance.',
      lessons: [
        {
          id: 'cgeit-d2-l1',
          title: 'Strategic Resource Planning, Talent Competencies & Enterprise Architecture',
          estimatedMinutes: 40,
          summary:
            'Optimize scarce IT capital, workforce capabilities, and infrastructure lifecycle through Enterprise Architecture (TOGAF/Zachman), skills gap mapping, succession planning, and asset rationalization.',
          learningObjectives: [
            'Govern IT Resource Optimization across People, Processes, Information, Applications, and Infrastructure (EDM04).',
            'Leverage Enterprise Architecture (EA) to eliminate duplicate legacy applications, standardize technology stacks, and lower technical debt.',
            'Mitigate key-person dependency and talent shortages through competency frameworks, cross-training, succession planning, and capacity forecasting.',
          ],
          coreConcepts: [
            {
              heading: 'IT Resource Optimization & Application Rationalization',
              explanation:
                'IT Resources span far more than hardware budgets—they encompass skilled talent, applications, infrastructure, information, and external partners. Resource Optimization (EDM04) maximizes capability while minimizing waste by: (1) Inventorying current capacity vs. strategic multi-year demand; (2) Performing Application Portfolio Rationalization (retiring redundant legacy tools acquired via M&A or shadow IT so maintenance spend shrinks—shifting budget from "Keep the Lights On" to innovation!); and (3) Enforcing Enterprise Architecture (EA) standards (Business, Data, Application, Technology layers — TOGAF) so new investments reuse shared platforms rather than creating isolated silos.',
              mentalModel:
                'If 80% of your IT budget is burned maintaining 4 overlapping legacy ERP systems ("technical debt"), you have zero oxygen left to innovate—Enterprise Architecture & Rationalization free that oxygen.',
              formulaOrRule: 'IT Resource Optimization = Right Skills + Right Infrastructure + Right Architecture + Zero Redundant Legacy Sprawl.',
            },
            {
              heading: 'Human Resource Governance, Key-Person Risk & Knowledge Management',
              explanation:
                'People are both the scarcest IT resource and a prime operational vulnerability. Executive resource governance evaluates current workforce skills against future strategic roadmaps (e.g., cloud, AI, cyber), fills gaps via structured upskilling/reskilling, strategic hiring, or targeted outsourcing, and neutralizes Single-Point-of-Failure ("Key-Person / Bus Factor") risk through mandatory cross-training, living knowledge bases, job rotation, and executive succession planning.',
              mentalModel:
                'If one senior COBOL architect retiring tomorrow halts billing nationwide, that is a Board-level Resource Risk—not an HR inconvenience.',
              formulaOrRule: 'Eliminate Key-Person Dependency = Cross-Training + Documented Knowledge Management + Succession Planning.',
            },
          ],
          realWorldScenario: {
            title: 'Eliminating 14 Redundant CRM Tools Through Enterprise Architecture',
            situation:
              'After five regional acquisitions, a manufacturing enterprise spends 82% of its annual IT budget maintaining 14 separate CRM systems and 9 ERP platforms, leaving almost no capital for its Board-mandated AI customer portal.',
            analysis:
              'Unchecked technical debt and shadow acquisitions violated Resource Optimization (EDM04). Conducting an Enterprise Architecture Application Rationalization (TIME model: Tolerate, Invest, Migrate, Eliminate) consolidates 14 CRMs into 1 unified cloud platform—slashing annual maintenance costs by 35% and reallocating saved budget and staff directly to strategic growth.',
            takeaway:
              'Application rationalization and Enterprise Architecture standards turn bloated maintenance costs into strategic investment fuel.',
          },
          examTraps: [
            'CGEIT classic: When an enterprise struggles with duplicate incompatible software across divisions, the BEST governance answer is establishing/enforcing Enterprise Architecture (EA) and Application Rationalization!',
            'Do not treat IT Resource Optimization as "cutting IT budget to the bone"—optimization means allocating the RIGHT resources to the HIGHEST-VALUE strategic priorities (maximizing value per dollar, not simply spending the least!).',
            'Human Capital Risk: always recognize cross-training, knowledge transfer, and succession planning as primary mitigations for key-person dependency.',
          ],
          keyTerms: [
            { term: 'Enterprise Architecture (EA)', definition: 'Holistic blueprint aligning Business, Data, Application, and Technology architectures to standardize investments and eliminate silos.' },
            { term: 'Application Rationalization', definition: 'Systematic evaluation of an enterprise software portfolio to retire redundant, obsolete, or low-value systems and consolidate onto strategic platforms.' },
            { term: 'Technical Debt', definition: 'Accumulated maintenance burden and architectural fragility caused by expedient short-term IT decisions and deferred modernization.' },
            { term: 'Succession Planning', definition: 'Proactive talent governance ensuring trained internal successors exist for mission-critical technical and executive leadership roles.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d2-l1-q1',
              question:
                'Following three acquisitions, an enterprise discovers it is paying maintenance licenses for six overlapping HR platforms while struggling to fund new strategic digital initiatives. Which governance practice BEST resolves this resource inefficiency?',
              options: [
                'Freezing all employee training budgets',
                'Executing Enterprise Architecture-guided Application Portfolio Rationalization',
                'Upgrading workstation RAM across all branches',
                'Extending legacy maintenance contracts for five more years',
              ],
              correctIndex: 1,
              rationale:
                'Application Portfolio Rationalization guided by Enterprise Architecture identifies redundant legacy platforms for retirement/consolidation, freeing locked operational budget for higher-value strategic projects.',
            },
            {
              id: 'cgeit-d2-l1-q2',
              question:
                'A single veteran engineer is the only individual who understands the architecture of the enterprise’s core settlement engine and plans to retire in nine months. Which resource governance control BEST mitigates this risk?',
              options: [
                'Purchasing cyber liability insurance',
                'Implementing structured knowledge transfer, documentation, cross-training, and formal succession planning immediately',
                'Increasing firewall logging verbosity',
                'Offering a one-time retention bonus without training a backup',
              ],
              correctIndex: 1,
              rationale:
                'Key-person dependency is an existential operational resource risk; structured knowledge capture, cross-training, and succession planning eliminate the single point of failure sustainably.',
            },
          ],
          practicalDrill: {
            title: 'Strategic Resource Capacity & Technical Debt Audit',
            prompt:
              'Assess an IT organization spending 80% on maintenance ("Run") and 20% on innovation ("Grow/Transform").',
            steps: [
              'Inventory top 15 business applications using the TIME quadrant (Tolerate, Invest, Migrate, Eliminate) to cut maintenance overhead.',
              'Map current engineering skills against the 3-year target cloud/AI strategy to isolate skill gaps and single-person dependencies.',
              'Define a blended Build (upskill), Buy (hire), and Borrow (strategic partner) talent plan.',
            ],
            successCriteria:
              'Audit ties rationalization directly to freeing strategic capital and closes key-person gaps via cross-training and succession.',
          },
          flashcards: [
            { front: 'What does Resource Optimization (EDM04) truly mean—cost minimization or value allocation?', back: 'Optimal allocation of people, tech, and capital to maximize strategic value—NOT blindly slashing IT budgets.', tag: 'cgeit-d2' },
            { front: 'What are the 4 architectural domains of TOGAF Enterprise Architecture?', back: 'Business Architecture, Data Architecture, Application Architecture, and Technology Architecture (B-D-A-T).', tag: 'cgeit-d2' },
            { front: 'How do you mitigate Key-Person ("Bus Factor = 1") risk?', back: 'Formal Knowledge Management/documentation, mandatory cross-training, job rotation, and succession planning.', tag: 'cgeit-d2' },
          ],
          sourceRefs: ['my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf'],
        },
        {
          id: 'cgeit-d2-l2',
          title: 'IT Sourcing Strategy, Outsourcing Governance, SLAs & Exit Readiness',
          estimatedMinutes: 40,
          summary:
            'Make disciplined Make-vs.-Buy sourcing decisions (Insourcing, Outsourcing, Multisourcing, Cloud, Co-Sourcing), enforce outcome-based SLAs, and retain core strategic competencies in-house.',
          learningObjectives: [
            'Evaluate sourcing models (Insourcing, Outtasking, Full Outsourcing, Multisourcing, Cloud/XaaS, Captive Offshoring) against strategic differentiation and risk.',
            'Enforce the cardinal sourcing governance rule: NEVER outsource core competitive differentiators OR ultimate governance accountability!',
            'Design outcome-based SLAs, vendor performance scorecards, right-to-audit clauses, and contract Exit/Transition Plans.',
          ],
          coreConcepts: [
            {
              heading: 'Sourcing Strategy: Core Competency Rule & Multisourcing',
              explanation:
                'Smart executives outsource COMMODITY IT functions (commodity hosting, payroll SaaS, Tier-1 help desk) where specialist providers achieve superior scale and cost, while retaining CORE COMPETITIVE DIFFERENTIATORS (proprietary IP algorithms, customer experience architecture, enterprise governance!) IN-HOUSE! Compare models: Single-Vendor Outsourcing (simpler governance, massive vendor lock-in risk), Multisourcing (best-of-breed vendors per function—lower lock-in, higher internal integration/governance overhead requiring a strong Vendor Management Office [VMO] / SIAM), and Co-Sourcing (shared blended internal + vendor team transferring knowledge inward).',
              mentalModel:
                'Outsource the electricity and cafeteria (commodities); NEVER outsource your secret recipe or the CEO’s steering wheel (core differentiation & governance accountability).',
              formulaOrRule: 'Outsource = Commodity/Non-Differentiating Functions. Retain In-House = Core Competitive IP + Governance Accountability.',
            },
            {
              heading: 'Vendor Governance, Outcome-Based SLAs & Exit Strategy',
              explanation:
                'Outsourcing fails most often due to weak ongoing Vendor Governance—signing a 5-year contract and walking away ("set and forget"). Effective governance requires: (1) Thorough Pre-Contract Due Diligence (financial stability, security/SOC 2, cultural fit, geopolitical/sub-contractor risk); (2) Outcome-Based SLAs (measuring business outcomes like "order processing availability & resolution time", NOT merely vendor effort hours, paired with meaningful incentives/penalties); (3) Active VMO Performance Reviews; and (4) A contractually funded Exit / Transition Plan BEFORE Day 1 detailing data return formats, transition assistance obligations, IP ownership, and escrow so the company can smoothly bring services back in-house (Backsourcing) or switch vendors if performance collapses.',
              mentalModel:
                'Write the divorce agreement (Exit Plan) on the wedding day while everyone is still smiling—once a vendor relationship sours, negotiating exit data transfer costs a fortune.',
              formulaOrRule: 'Every Critical Sourcing Contract Requires: Outcome-Based SLAs + Right-to-Audit + Clear IP Ownership + Contracted Exit/Transition Plan.',
            },
          ],
          realWorldScenario: {
            title: 'Rescuing a Failed Total-Outsourcing Deal via Multisourcing & Exit Governance',
            situation:
              'An airline outsourced its entire IT organization—including flight-scheduling algorithms and governance architecture—to one mega-outsourcer under a fixed 7-year contract. Three years in, innovation stalled, hidden change-order fees doubled costs, and the airline realized it lacked both internal staff and a contractual exit clause to leave.',
            analysis:
              'The airline broke two CGEIT sourcing laws: (1) it outsourced core strategic differentiation and retained zero internal architecture/governance competence ("hollowed-out IT"), and (2) it entered a single-vendor lock-in with no contracted Exit/Transition Assistance clause. Restructuring into controlled Multisourcing with an internal Enterprise Architecture & VMO team restores strategic leverage.',
            takeaway:
              'Even when you outsource execution, ALWAYS retain strategic architecture, vendor management (VMO), and governance accountability in-house.',
          },
          examTraps: [
            'CGEIT classic: "Can an enterprise outsource accountability for IT governance or regulatory compliance along with its IT operations?" -> NEVER! Execution can be outsourced; accountability remains 100% with the enterprise Board/Management.',
            'Watch out for "Hidden Costs of Outsourcing": transition/migration costs, contract legal fees, ongoing Vendor Management Office (VMO) oversight overhead, change-order surcharges, and knowledge loss!',
            'Multisourcing lowers single-vendor lock-in but INCREASES internal coordination complexity and requires stronger internal vendor governance (SIAM/VMO).',
          ],
          keyTerms: [
            { term: 'Multisourcing', definition: 'Disciplined blending of internal IT and multiple best-of-breed external service providers to balance capability, cost, and vendor lock-in risk.' },
            { term: 'Backsourcing', definition: 'Bringing previously outsourced IT services and personnel back in-house upon contract expiration, failure, or strategic shift.' },
            { term: 'Vendor Management Office (VMO)', definition: 'Internal governance function overseeing vendor contracts, SLA attainment, financial billing, relationship health, and risk.' },
            { term: 'Exit Strategy (Sourcing)', definition: 'Pre-negotiated contractual roadmap ensuring smooth data migration, IP retention, and continuity when terminating or switching a provider.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d2-l2-q1',
              question:
                'An enterprise plans to transition from a single mega-outsourcer to a Multisourcing model across four specialized cloud and managed-service vendors. What is the PRIMARY governance trade-off management MUST prepare for?',
              options: [
                'Elimination of all internal vendor oversight roles',
                'Higher internal coordination, integration, and vendor management governance complexity across multiple providers',
                'Complete transfer of legal regulatory accountability to the four vendors',
                'Guaranteed zero switching costs between vendors',
              ],
              correctIndex: 1,
              rationale:
                'While Multisourcing reduces single-vendor dependency and unlocks best-of-breed capabilities, it significantly increases internal governance, interface management, and cross-vendor SLA orchestration overhead (requiring a strong VMO).',
            },
            {
              id: 'cgeit-d2-l2-q2',
              question:
                'Which function should an innovative e-commerce company MOST likely retain IN-HOUSE rather than fully outsourcing?',
              options: [
                'Standard employee payroll processing SaaS',
                'Commodity data center power and cooling',
                'Proprietary customer recommendation architecture and Enterprise IT Governance oversight',
                'After-hours password reset call center',
              ],
              correctIndex: 2,
              rationale:
                'Core competitive differentiators (proprietary customer algorithms) and Enterprise IT Governance accountability should always remain retained in-house, while non-differentiating commodities are ideal outsourcing candidates.',
            },
          ],
          practicalDrill: {
            title: 'Executive Sourcing Decision & Exit Governance Checklist',
            prompt:
              'Evaluate a proposal to outsource enterprise cloud infrastructure and Tier-1/Tier-2 service desk operations for 5 years.',
            steps: [
              'Verify core business differentiators and Enterprise Architecture / VMO governance stay strictly in-house.',
              'Define 4 outcome-based SLAs (user productivity uptime, resolution quality, security patch SLA, innovation KPIs) with earn-back/credit mechanics.',
              'Mandate Right-to-Audit, sub-contractor disclosure, IP ownership clauses, and a pre-priced 180-day Exit & Transition Assistance schedule prior to signing.',
            ],
            successCriteria:
              'Checklist guards core competencies, enforces outcome-based SLAs, budgets for internal VMO oversight, and locks in an Exit Plan before signing.',
          },
          flashcards: [
            { front: 'What 2 things must an enterprise NEVER outsource?', back: '1) Ultimate Governance/Regulatory Accountability, and 2) Core Competitive Differentiating Competencies.', tag: 'cgeit-d2' },
            { front: 'When MUST a sourcing Exit Strategy be negotiated?', back: 'BEFORE signing the initial contract—when buyer negotiating leverage is highest.', tag: 'cgeit-d2' },
            { front: 'What is Backsourcing?', back: 'Bringing previously outsourced IT operations or services back inside the enterprise organization.', tag: 'cgeit-d2' },
          ],
          sourceRefs: ['my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: BENEFITS REALIZATION (26%)
    // =================================================================
    {
      id: 'cgeit-d3',
      domainNumber: 3,
      title: 'Benefits Realization',
      examWeightPercent: 26,
      overview:
        'Second highest-weighted CGEIT domain (26%). Masters IT-enabled investment governance (Val IT / EDM02): balancing Run-Grow-Transform portfolios, rigorous Stage-Gate Business Cases, financial valuation (NPV/IRR/ROI/Payback), Balanced Scorecards, and Post-Implementation Benefits Harvesting.',
      lessons: [
        {
          id: 'cgeit-d3-l1',
          title: 'IT Investment Portfolio Governance, Business Cases & Stage-Gate Controls',
          estimatedMinutes: 45,
          summary:
            'Govern IT spending as an executive investment portfolio (Run / Grow / Transform), mandate Business-Sponsor-owned Business Cases, and kill underperforming initiatives cleanly via Stage-Gate reviews.',
          learningObjectives: [
            'Balance an Enterprise IT Investment Portfolio across Mandatory/Compliance, Run (Maintain), Grow (Scale), and Transform (Innovate) buckets.',
            'Require a named Business Sponsor (NOT IT!) to own every IT-enabled Business Case and its promised business benefits.',
            'Enforce Stage-Gate investment governance ensuring failing projects are pivoted or terminated cleanly without Sunk Cost Fallacy.',
          ],
          coreConcepts: [
            {
              heading: 'Portfolio vs. Program vs. Project & Run-Grow-Transform Balance',
              explanation:
                'CGEIT operates at the PORTFOLIO level: Projects produce specific outputs (e.g., install an ERP module); Programs group related projects to achieve a broader business capability/outcome; Portfolios manage ALL enterprise IT investments collectively to maximize total strategic value within finite capital and risk limits! Mature boards balance portfolio spend intentionally across Run (mandatory ops/compliance keeping lights on), Grow (enhancing existing revenue/efficiency), and Transform (disruptive new markets/AI products)—constantly challenging bloated Run costs so Transform investments stay funded.',
              mentalModel:
                'A stockbroker doesn’t judge one stock in isolation—they balance an entire Portfolio across safe bonds (Run), blue-chip dividends (Grow), and high-upside ventures (Transform).',
              formulaOrRule: 'Project = Output | Program = Integrated Outcome | Portfolio = Maximizing Total Enterprise Value Across All Investments.',
            },
            {
              heading: 'Business Sponsor Ownership & Stage-Gate Governance (Defeating Sunk Cost!)',
              explanation:
                'ISACA’s #1 law of Benefits Realization: There is NO SUCH THING as an "IT project"—only BUSINESS CHANGE PROGRAMS enabled by IT! Therefore, a BUSINESS EXECUTIVE SPONSOR (never the CIO alone!) MUST own the Business Case and remain accountable for harvesting the projected revenue/cost-saving benefits after go-live. Funding should NEVER be handed out as a 100% lump sum on Day 1; instead, release tranches sequentially through Stage-Gate Reviews—re-validating the living Business Case at every gate! If market conditions shift or costs overrun so expected future value turns negative, Governance MUST terminate the project ruthlessly—ignoring past "Sunk Costs" already spent!',
              mentalModel:
                'Never throw $5M more good money after $3M already burned just to "save face"—sunk costs are gone forever; judge every Stage-Gate solely on FUTURE incremental benefit vs. FUTURE remaining cost!',
              formulaOrRule: 'Benefits Accountability = Business Sponsor (NEVER IT alone!). Stage-Gate Decision Rule = Evaluate FUTURE Benefits vs. FUTURE Cost (Ignore Sunk Costs!).',
            },
          ],
          realWorldScenario: {
            title: 'Pulling the Plug on a $12M Runaway ERP Rewrite Using Stage-Gate Governance',
            situation:
              'An enterprise has already spent $12M over two years on a custom supply-chain system originally budgeted at $10M. At Stage Gate 3, updated projections show $9M MORE is required to finish, while a rival commercial SaaS now delivers identical benefits for $3M total. The project champion argues: "We can’t cancel now or the $12M we already spent is wasted!"',
            analysis:
              'That argument is the textbook Sunk Cost Fallacy! The $12M is irrecoverable either way. Comparing future options strictly on forward economics ($9M remaining custom build vs. $3M commercial SaaS) saves the enterprise $6M immediately and accelerates benefits delivery by 14 months. Strong Portfolio Governance terminates the custom build cleanly.',
            takeaway:
              'Courageous IT governance celebrates early Stage-Gate cancellation of value-destroying projects as a governance triumph, not a failure.',
          },
          examTraps: [
            'CGEIT classic: "Who should be held primarily accountable for realizing the expected business benefits of a new CRM IT implementation?" -> The BUSINESS SPONSOR / Business Process Owner (NEVER the CIO or IT Project Manager!).',
            'Watch out for Sunk Cost Fallacy distractors: NEVER recommend continuing an over-budget project simply because significant funds have already been invested!',
            'A Business Case is a LIVING DOCUMENT updated at every Stage Gate through Post-Implementation Review—NEVER a one-time slide deck filed away after initial approval!',
          ],
          keyTerms: [
            { term: 'Portfolio Management', definition: 'Centralized executive governance selecting, prioritizing, balancing, and funding IT investments to maximize enterprise strategic value.' },
            { term: 'Business Sponsor', definition: 'Senior business executive accountable for championing an IT-enabled investment, validating the living Business Case, and realizing projected business benefits.' },
            { term: 'Stage-Gate Governance', definition: 'Incremental tranche-funding discipline requiring formal Business Case re-validation at predefined checkpoints before releasing next-phase capital.' },
            { term: 'Sunk Cost Fallacy', definition: 'Cognitive bias causing leaders to keep funding a failing investment because of past irrecoverable spending rather than forward-looking net value.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d3-l1-q1',
              question:
                'An enterprise invests $6M in a new AI-powered customer billing platform delivered on time and on budget by IT, yet six months post-launch customer retention and billing efficiency have not improved. Who bears PRIMARY accountability for the failure to realize these business benefits?',
              options: [
                'The Lead Software Developer',
                'The Business Sponsor / Business Owner of the investment',
                'The External Financial Auditor',
                'The Data Center Infrastructure Manager',
              ],
              correctIndex: 1,
              rationale:
                'IT is accountable for delivering the technical capability on time, on budget, and to specification; the Business Sponsor is accountable for driving business change and harvesting the promised business benefits.',
            },
            {
              id: 'cgeit-d3-l1-q2',
              question:
                'During a Stage-Gate 2 review, a portfolio committee finds that a $4M software project (with $2.5M already spent) now requires an additional $4M to complete while shifting market dynamics reduced total expected lifetime benefits to $2.8M. What is the BEST governance decision?',
              options: [
                'Continue funding because $2.5M has already been invested and must not go to waste',
                'Terminate the project immediately because remaining incremental costs ($4M) exceed remaining expected benefits ($2.8M)',
                'Hide the updated figures until project go-live',
                'Transfer the remaining $4M cost into the operational maintenance budget',
              ],
              correctIndex: 1,
              rationale:
                'Ignore irrecoverable sunk costs ($2.5M). Forward-looking incremental investment ($4M) destroys $1.2M more value against only $2.8M in remaining benefit—Stage-Gate governance must terminate the project cleanly.',
            },
          ],
          practicalDrill: {
            title: 'Portfolio Stage-Gate & Business Sponsor Charter',
            prompt:
              'Establish a portfolio governance intake process for $25M in annual enterprise IT capital.',
            steps: [
              'Target an explicit portfolio mix (e.g., 50% Run, 30% Grow, 20% Transform) aligned with corporate strategy.',
              'Mandate that EVERY funding request names a Business Executive Sponsor who signs accountability for post-launch benefits.',
              'Design 4 Stage-Gates (Concept, Architecture/Business Case, Pre-Launch, Post-Implementation Benefits Review) with explicit kill-switch criteria.',
            ],
            successCriteria:
              'Charter eliminates IT-owned benefits, defeats Sunk Cost Fallacy via tranche funding, and balances Run-Grow-Transform deliberately.',
          },
          flashcards: [
            { front: 'Project vs. Program vs. Portfolio?', back: 'Project = delivers a specific output; Program = coordinates related projects for a business outcome; Portfolio = governs ALL investments collectively for maximum strategic enterprise value.', tag: 'cgeit-d3' },
            { front: 'Who owns the living Business Case and benefits realization?', back: 'The Business Executive Sponsor (NEVER IT alone!).', tag: 'cgeit-d3' },
            { front: 'How does Stage-Gate governance counter the Sunk Cost Fallacy?', back: 'By releasing funding in incremental tranches and forcing objective re-evaluation of FUTURE incremental cost vs. FUTURE benefit at each gate, enabling clean early cancellation.', tag: 'cgeit-d3' },
          ],
          sourceRefs: ['my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf'],
        },
        {
          id: 'cgeit-d3-l2',
          title: 'Financial Valuation (NPV, IRR, ROI, Payback) & Balanced Scorecard',
          estimatedMinutes: 45,
          summary:
            'Evaluate competing capital proposals using time-value-of-money metrics (NPV, IRR, Payback, ROI, TCO) and capture non-financial strategic value via the IT Balanced Scorecard.',
          learningObjectives: [
            'Compare and select the right financial metric for executive decisions: Net Present Value (NPV), Internal Rate of Return (IRR), ROI, and Payback Period.',
            'Explain why NPV is generally superior to Payback Period and simple ROI for multi-year capital investments (accounts for Time Value of Money and absolute dollar value!).',
            'Apply all 4 perspectives of the Kaplan & Norton / IT Balanced Scorecard to measure intangible and strategic IT value.',
          ],
          coreConcepts: [
            {
              heading: 'Executive Financial Metrics Matrix (CGEIT High-Yield!)',
              explanation:
                'Executives compare competing IT investments using four core financial lenses: (1) Payback Period — how fast initial cash outlay is recovered (simple liquidity check, ignores cash flows AFTER payback AND ignores Time Value of Money!); (2) Return on Investment (ROI) = `(Net Benefit / Total Cost) x 100%` (intuitive %, but ignores project duration and Time Value of Money!); (3) Net Present Value (NPV) — discounts ALL future cash inflows/outflows back to today’s dollars using the firm’s cost of capital/hurdle rate (`NPV > 0` creates shareholder wealth; when choosing between mutually exclusive projects, HIGHEST POSITIVE NPV WINS!); (4) Internal Rate of Return (IRR) — the discount rate where `NPV = 0` (approve if `IRR > Corporate Hurdle Rate / WACC`, though beware small projects having high IRR % yet tiny absolute dollar NPV!).',
              mentalModel:
                'A dollar today is worth MORE than a dollar 5 years from now (Time Value of Money). Payback tells you when you break even; IRR tells you the % speed; NPV tells you exact today-dollars of wealth created!',
              formulaOrRule: 'Mutually Exclusive Multi-Year Projects -> Choose HIGHEST POSITIVE NPV! Approve Standalone Project if NPV > 0 and IRR > Hurdle Rate.',
            },
            {
              heading: 'The IT Balanced Scorecard (Capturing Intangible Value)',
              explanation:
                'Pure financial math misses vital long-term drivers like brand trust, employee capability, customer agility, and architectural scalability. The Balanced Scorecard (Kaplan & Norton, adapted for IT by Van Grembergen) balances lagging financial results with leading operational and future-readiness metrics across FOUR exact perspectives: (1) Corporate Contribution (Financial / Business Value); (2) User/Customer Orientation (Stakeholder satisfaction & service value); (3) Operational Excellence (Internal IT processes, reliability, security); and (4) Future Orientation (Learning & Growth — talent skills, innovation, architectural readiness).',
              mentalModel:
                'Flying a jet using ONLY the Financial gauge is flying blind—the Balanced Scorecard puts Financial, Customer, Internal Operations, and Future Readiness dials side by side in the cockpit.',
              formulaOrRule: '4 IT Balanced Scorecard Perspectives: Corporate Contribution (Financial), User/Customer Orientation, Operational Excellence (Internal), Future Orientation (Growth).',
            },
          ],
          realWorldScenario: {
            title: 'Choosing Between Two Mutually Exclusive Digital Transformation Proposals',
            situation:
              'The IT Steering Committee has capital for ONE initiative. Project Alpha costs $500K, boasts an impressive 45% IRR and 1-year payback, and yields an NPV of +$180K. Project Beta costs $4M, has a 24% IRR (still well above the 10% corporate hurdle rate) and 2.5-year payback, and yields an NPV of +$2.9M while strengthening customer retention.',
            analysis:
              'Choosing solely by highest IRR percentage or shortest Payback would mistakenly pick Project Alpha—leaving $2.72M of true shareholder wealth on the table! Because both projects exceed the 10% hurdle rate and are mutually exclusive, Net Present Value (NPV) is the decisive financial metric—selecting Project Beta (+$2.9M NPV) paired with Balanced Scorecard customer metrics.',
            takeaway:
              'When competing multi-year projects are mutually exclusive, Highest Positive NPV beats raw IRR percentage or Payback Period.',
          },
          examTraps: [
            'CGEIT classic: "Which financial valuation metric BEST accounts for the Time Value of Money AND absolute wealth creation when ranking mutually exclusive multi-year IT investments?" -> Net Present Value (NPV)!',
            'Payback Period’s two fatal weaknesses: (1) ignores Time Value of Money (unless Discounted Payback), and (2) completely ignores all profits generated AFTER the payback date!',
            'Do NOT ignore intangible benefits (customer loyalty, brand reputation, regulatory license to operate)—capture them explicitly inside the IT Balanced Scorecard!',
          ],
          keyTerms: [
            { term: 'Net Present Value (NPV)', definition: 'Present value of expected future cash inflows minus present value of cash outflows discounted at the hurdle rate; gold standard for wealth creation.' },
            { term: 'Internal Rate of Return (IRR)', definition: 'Annualized effective discount rate at which an investment’s NPV equals zero; compared against corporate cost of capital (hurdle rate).' },
            { term: 'Payback Period', definition: 'Length of time required for cumulative project cash inflows to recover initial outlay; measures liquidity speed but ignores post-payback gains.' },
            { term: 'IT Balanced Scorecard', definition: 'Strategic performance management framework balancing Financial/Corporate Contribution, User Orientation, Operational Excellence, and Future Orientation.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d3-l2-q1',
              question:
                'An executive committee must choose between two mutually exclusive 5-year IT transformation initiatives. Both exceed the company’s 10% cost of capital. Project X has a 2-year Payback Period and +$400,000 NPV; Project Y has a 3-year Payback Period and +$1,800,000 NPV. Based strictly on corporate wealth maximization, which metric should drive the decision?',
              options: [
                'Select Project X because shorter Payback Period always maximizes long-term wealth',
                'Select Project Y because Net Present Value (NPV) captures both Time Value of Money and total discounted dollar value created over the full lifecycle',
                'Reject both projects because neither pays back within 12 months',
                'Choose whichever project has the lower initial Year-1 CapEx regardless of future cash flows',
              ],
              correctIndex: 1,
              rationale:
                'Payback Period ignores both Time Value of Money and cash flows occurring after payback. For mutually exclusive multi-year investments, choosing the project with the highest positive NPV maximizes true enterprise economic value.',
            },
            {
              id: 'cgeit-d3-l2-q2',
              question:
                'In the IT Balanced Scorecard, measuring "percentage of engineering staff certified in cloud architecture and AI governance" maps to which perspective?',
              options: [
                'Corporate Contribution (Financial)',
                'User/Customer Orientation',
                'Operational Excellence',
                'Future Orientation (Learning & Growth)',
              ],
              correctIndex: 3,
              rationale:
                'Future Orientation (Learning & Growth) measures long-term organizational readiness—including workforce skills, training, innovation capacity, and architectural agility.',
            },
          ],
          practicalDrill: {
            title: 'Investment Ranking & IT Balanced Scorecard Blueprint',
            prompt:
              'Evaluate three competing enterprise IT proposals and build a 4-quadrant IT Balanced Scorecard for the winning program.',
            steps: [
              'Rank the proposals using NPV (>0), IRR (>WACC hurdle rate), Payback, and full 5-year TCO.',
              'Flag intangible strategic benefits (brand trust, compliance readiness) alongside financial figures.',
              'Construct 2 KPIs for each of the 4 IT Balanced Scorecard quadrants (Corporate Contribution, User Orientation, Operational Excellence, Future Orientation).',
            ],
            successCriteria:
              'Analysis ranks mutually exclusive options by highest NPV, respects hurdle rate, and balances financial vs. non-financial KPIs across all 4 quadrants.',
          },
          flashcards: [
            { front: 'Compare NPV vs. IRR vs. Payback Period in one sentence each.', back: 'NPV = discounted today-dollars of wealth created (best for mutually exclusive choice); IRR = % return rate where NPV=0 (compare to hurdle rate); Payback = years to break even (ignores TVM & post-payback profit).', tag: 'cgeit-d3' },
            { front: 'What are the 4 perspectives of the IT Balanced Scorecard?', back: 'Corporate Contribution (Financial), User/Customer Orientation, Operational Excellence (Internal), and Future Orientation (Learning & Growth).', tag: 'cgeit-d3' },
            { front: 'If NPV is negative (< $0) at the corporate hurdle rate, what does that tell leadership?', back: 'The investment destroys economic value relative to the firm’s cost of capital (approve ONLY if mandatory for legal/regulatory survival or human safety).', tag: 'cgeit-d3' },
          ],
          sourceRefs: ['my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf'],
        },
        {
          id: 'cgeit-d3-l3',
          title: 'Benefits Realization Plan, Value Harvesting & Post-Implementation Reviews (PIR)',
          estimatedMinutes: 40,
          summary:
            'Close the "Go-Live Value Gap" using Benefits Realization Management (BRM), baseline metrics, Benefits Dependency Networks, and Post-Implementation Reviews (PIR) 6–12 months after deployment.',
          learningObjectives: [
            'Explain why IT value is ONLY harvested AFTER go-live when business processes and user behaviors actually change.',
            'Construct a Benefits Realization Plan mapping IT outputs -> Business Changes -> Measurable Outcomes -> Strategic Value (Benefits Dependency Network).',
            'Execute Post-Implementation Reviews (PIR) comparing actual realized benefits and TCO against original Business Case baselines.',
          ],
          coreConcepts: [
            {
              heading: 'Closing the Go-Live Value Gap (Benefits Realization Management)',
              explanation:
                'Over 60% of IT investments fail to deliver promised ROI NOT because the software crashed, but because organizations declare victory the day code goes live and walk away! Software deployment creates only a CAPABILITY (potential value); real benefits materialize ONLY when business units adopt new workflows, retire old workarounds, and harvest cost savings or revenue growth! A Benefits Realization Plan therefore establishes: (1) Pre-investment Baseline Metrics (you cannot prove a 20% speed gain without measuring the starting baseline!); (2) Named Business Benefit Owners; (3) Clear Benefit Realization Timelines (often 6–18 months post-go-live); and (4) Tracking Dashboards audited independently.',
              mentalModel:
                'Buying a $3,000 treadmill (IT Go-Live) burns ZERO calories—calories only burn when you actually run on it daily and track weight against your Day-1 baseline (Benefits Harvesting).',
              formulaOrRule: 'IT Deployment = Capability ONLY. Real Value = Capability + Business Process Change + User Adoption + Baseline Measurement.',
            },
            {
              heading: 'Post-Implementation Review (PIR) & Continuous Value Accountability',
              explanation:
                'A Post-Implementation Review (PIR) occurs AFTER the system has stabilized in live business operations (typically 3–12 months post-go-live—NOT on Day 1 of launch!). Its dual mission is: (1) Benefits Audit — objectively comparing actual realized benefits and full TCO against the original Business Case forecasts; and (2) Organizational Learning — capturing estimation bias (stopping business sponsors from inflating fake ROI numbers to win funding next year!) and launching corrective optimization actions if adoption is lagging.',
              mentalModel:
                'If executives know nobody ever checks the Business Case 9 months after launch, every funding pitch turns into creative fiction—PIR enforces honest capital discipline!',
              formulaOrRule: 'Conduct PIR = After operational stabilization (3–12 months post-launch) to validate actual ROI/Benefits vs. Business Case.',
            },
          ],
          realWorldScenario: {
            title: 'Uncovering Unrealized CRM Value Through a 9-Month PIR',
            situation:
              'A global distributor celebrated launching a $5M cloud CRM "on time and under budget." Nine months later, a mandatory Post-Implementation Review reveals that 65% of sales reps still track deals in personal Excel spreadsheets, yielding zero lift in conversion rates.',
            analysis:
              'IT met every project metric, yet Benefits Realization failed completely because Business Change Management and adoption incentives were ignored! Because the PIR surfaced the gap while the system was still active, the Business Sponsor launched targeted sales enablement, retired legacy spreadsheets, and linked CRM pipeline usage to sales commission reporting—harvesting $3.2M in incremental revenue over the next year.',
            takeaway:
              'Project success (on time, on budget) does NOT equal Business Value success—measure adoption and realized outcomes via PIR!',
          },
          examTraps: [
            'CGEIT classic: "What MUST be established BEFORE launching an IT investment to accurately verify benefits realization later?" -> Current-state BASELINE PERFORMANCE METRICS!',
            'Wait: "When is the BEST time to conduct a Benefits Realization Post-Implementation Review (PIR)?" -> After the system has operated in production long enough for business processes to stabilize and measurable outcomes to emerge (e.g., 6–12 months post-launch, NEVER the week of go-live!).',
            'Never confuse Project Management outputs (on schedule, on budget) with Governance Benefits Realization outcomes (higher margin, lower churn, reduced risk)!',
          ],
          keyTerms: [
            { term: 'Benefits Realization Plan', definition: 'Formal governance roadmap specifying target benefits, pre-project baselines, named business owners, measurement criteria, and realization timelines.' },
            { term: 'Post-Implementation Review (PIR)', definition: 'Objective post-stabilization audit comparing actual delivered business benefits and lifecycle costs against original Business Case projections.' },
            { term: 'Benefits Dependency Network', definition: 'Visual chain linking technical IT enablers to required business process changes, measurable outcomes, and strategic objectives.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d3-l3-q1',
              question:
                'An IT department completes a major ERP deployment two weeks ahead of schedule and 5% under budget. Why can the Board NOT yet declare the investment a Benefits Realization success?',
              options: [
                'Because on-time delivery automatically indicates scope cutting',
                'Because IT delivery creates only technical capability—true value depends on post-launch business adoption and verified achievement of Business Case outcomes',
                'Because ERP systems never produce measurable ROI',
                'Because only Internal Audit is permitted to install software',
              ],
              correctIndex: 1,
              rationale:
                'Delivering software on time and on budget measures project execution efficiency, NOT enterprise value. True Benefits Realization occurs only after business workflows change and promised outcomes are verified via PIR.',
            },
            {
              id: 'cgeit-d3-l3-q2',
              question:
                'Which foundational step is MOST critical BEFORE starting an IT-enabled cost-reduction program so leadership can objectively prove benefits were achieved afterward?',
              options: [
                'Purchasing long-term server warranties',
                'Capturing accurate pre-project baseline performance and cost metrics',
                'Renaming the project steering committee',
                'Hiring an external marketing agency',
              ],
              correctIndex: 1,
              rationale:
                'Without verified pre-project baseline metrics, any post-implementation claim of cost reduction or productivity improvement is unprovable guesswork.',
            },
          ],
          practicalDrill: {
            title: 'Benefits Dependency Network & 9-Month PIR Scorecard',
            prompt:
              'Design a Benefits Realization Plan for an automated AI customer-support platform promising 30% lower support cost and +15 NPS.',
            steps: [
              'Capture verifiable pre-launch baselines (current cost-per-ticket, average handle time, baseline NPS).',
              'Map the Benefits Dependency Network: AI Tool (IT Output) -> Agent Workflow Redesign & Training (Business Change) -> Faster First-Contact Resolution (Outcome) -> -30% OpEx & +15 NPS (Value).',
              'Schedule a 6-month adoption check and 12-month formal PIR comparing actuals to the living Business Case.',
            ],
            successCriteria:
              'Plan locks down pre-launch baselines, assigns a Business Sponsor owner, maps process change dependencies, and schedules post-stabilization PIR.',
          },
          flashcards: [
            { front: 'Why does "On Time and On Budget" NOT equal Benefits Realization?', back: 'On-time/on-budget measures Project Output; Benefits Realization measures post-launch Business Value harvested via workflow adoption and measurable outcomes.', tag: 'cgeit-d3' },
            { front: 'What is required BEFORE launch to prove benefits afterward?', back: 'Verified pre-project Baseline Metrics.', tag: 'cgeit-d3' },
            { front: 'When should a Benefits Realization PIR occur?', back: 'After operational stabilization (typically 3–12 months post-go-live) so real business outcomes and full TCO can be measured accurately.', tag: 'cgeit-d3' },
          ],
          sourceRefs: ['my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: RISK OPTIMIZATION (19%)
    // =================================================================
    {
      id: 'cgeit-d4',
      domainNumber: 4,
      title: 'Risk Optimization',
      examWeightPercent: 19,
      overview:
        'Unifies IT Risk Governance with Enterprise Risk Management (ERM — COSO ERM, ISO 31000, ISACA Risk IT). Focuses on Risk Optimization (EDM03) — balancing value creation (upside opportunity) against value preservation (downside loss), enterprise risk culture, and clear Boardroom cyber risk reporting.',
      lessons: [
        {
          id: 'cgeit-d4-l1',
          title: 'Risk Optimization (EDM03), ERM Integration & Risk Culture',
          estimatedMinutes: 45,
          summary:
            'Move beyond defensive "risk elimination" to executive Risk Optimization: integrating IT risk seamlessly into Enterprise Risk Management (COSO ERM / ISO 31000 / Risk IT) and cultivating transparent risk culture.',
          learningObjectives: [
            'Explain why CGEIT emphasizes Risk OPTIMIZATION (not Risk Elimination!)—taking smart, calculated IT risks to capture business upside.',
            'Integrate IT Risk Management directly into Enterprise Risk Management (ERM — COSO ERM / ISO 31000) rather than operating as an isolated technical silo.',
            'Establish Board-level Risk Appetite statements, Risk Tolerance thresholds, and a transparent "no-blame" enterprise Risk Culture.',
          ],
          coreConcepts: [
            {
              heading: 'Risk Optimization vs. Risk Elimination & The Two Sides of IT Risk',
              explanation:
                'Risk-averse technicians try to drive risk to zero by saying "No" to cloud, AI, and digital channels—which creates the deadliest risk of all: competitive obsolescence! ISACA defines Risk Optimization (EDM03) as balancing TWO distinct risk halves: (1) IT Benefit/Value Enablement Risk (MISSED OPPORTUNITY — failing to adopt emerging technology fast enough, losing market share); and (2) IT Program/Operations & Cyber Risk (DOWNSIDE LOSS — breaches, outages, failed projects). Enterprise Governance of IT ensures IT risk is never managed in an isolated IT bubble, but folded seamlessly into Enterprise Risk Management (COSO ERM / ISO 31000) using ONE shared enterprise risk taxonomy and scoring scale!',
              mentalModel:
                'A ship is 100% safe anchored permanently inside the harbor, yet it earns zero revenue and goes bankrupt—Risk Optimization charts the safest profitable route across the ocean.',
              formulaOrRule: 'IT Risk = Value Enablement Risk (Opportunity Missed) + Delivery/Ops/Cyber Risk (Loss Suffered). Always integrate IT Risk into Corporate ERM!',
            },
            {
              heading: 'Cultivating Executive Risk Culture & Escalation Transparency',
              explanation:
                'A toxic "shoot the messenger" culture causes mid-level managers to paint red risks green ("watermelon reporting"—green on the outside for the Board, bright red inside!) until a catastrophic breach explodes in headlines. Strong Risk Culture—modeled by the Board and CEO—rewards early transparent escalation of bad news, embeds risk awareness into executive incentives, and balances entrepreneurial speed with disciplined accountability.',
              mentalModel:
                'Watermelon dashboards fool the Board right up until the ransom note appears—rewarding early red flags saves millions.',
              formulaOrRule: 'Healthy Risk Culture = Visible Board Tone + No-Blame Early Escalation + Incentives Rewarding Sustainable Value (not reckless shortcuts).',
            },
          ],
          realWorldScenario: {
            title: 'Eliminating "Watermelon Reporting" Through ERM Integration',
            situation:
              'For four quarters, IT presented an isolated green "Cyber Health: 95%" score to the Board using its own proprietary 1–10 scale. Meanwhile, Corporate ERM tracked financial and operational risks in dollars—leaving the Board totally blind when a $18M ERP outage struck.',
            analysis:
              'Operating IT risk in a separate taxonomy disconnected from Corporate ERM prevented directors from comparing cyber exposure against credit, supply-chain, or regulatory risks. Adopting one unified ERM framework (ISO 31000 / COSO ERM + Risk IT) reporting IT risks in consistent financial/business-impact language eliminated the blind spot.',
            takeaway:
              'IT risk is simply BUSINESS risk enabled by technology—express and integrate it inside Corporate ERM using the exact same financial and strategic scales.',
          },
          examTraps: [
            'CGEIT classic: "What is the PRIMARY objective of IT Risk Optimization (EDM03)?" -> Ensuring IT-related enterprise risk does not exceed Board Risk Appetite while optimizing risk-adjusted value creation (NEVER "eliminating all IT risk"!).',
            'Always recognize that IT Risk Management MUST be integrated into broader Enterprise Risk Management (ERM)—never managed as a standalone IT silo.',
            'Remember the two sides of IT risk: missing strategic technology opportunities (Benefit Enablement Risk) is just as dangerous to the enterprise as cyber breaches (Ops/Delivery Risk)!',
          ],
          keyTerms: [
            { term: 'Risk Optimization', definition: 'Governance objective ensuring risk is managed proactively within enterprise risk appetite while capturing optimal risk-adjusted strategic value.' },
            { term: 'Enterprise Risk Management (ERM)', definition: 'Enterprise-wide discipline (COSO ERM / ISO 31000) unifying financial, operational, strategic, compliance, and IT/cyber risks under one Board framework.' },
            { term: 'Watermelon Reporting', definition: 'Dysfunctional status reporting disguising deep operational red failures beneath superficially green executive summary indicators.' },
            { term: 'ISACA Risk IT Framework', definition: 'COBIT-aligned framework structured into Risk Governance (RG), Risk Evaluation (RE), and Risk Response (RR).' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d4-l1-q1',
              question:
                'Why does ISACA emphasize "Risk Optimization" rather than "Risk Elimination" in Enterprise Governance of IT?',
              options: [
                'Because risk frameworks forbid buying security tools',
                'Because zero risk is unattainable and overly defensive controls stifle innovation and destroy shareholder value',
                'Because cyber insurance eliminates all governance duties',
                'Because Risk Optimization applies only to software developers',
              ],
              correctIndex: 1,
              rationale:
                'Zero risk is impossible and attempting it costs more than the assets protected while blocking growth opportunities. Risk Optimization balances downside protection with upside value creation within Board risk appetite.',
            },
            {
              id: 'cgeit-d4-l1-q2',
              question:
                'What is the MOST effective way to give the Board of Directors a holistic view of how cyber and IT outages compare against financial, legal, and supply-chain threats?',
              options: [
                'Maintain a completely separate IT-only risk scoring rubric using technical CVE counts',
                'Integrate IT Risk Management directly into Enterprise Risk Management (ERM) using common business-impact and financial scales',
                'Delegate all risk oversight solely to network administrators',
                'Report IT risks to the Board only after a major breach occurs',
              ],
              correctIndex: 1,
              rationale:
                'Integrating IT risk into Corporate ERM using common business/financial terminology allows directors to compare cyber/IT exposures directly alongside financial and operational risks when allocating enterprise capital.',
            },
          ],
          practicalDrill: {
            title: 'ERM-Integrated Risk Appetite & Culture Charter',
            prompt:
              'Unify an enterprise’s isolated IT security risk log into the Chief Risk Officer’s Corporate ERM framework.',
            steps: [
              'Translate technical IT risk scores into the enterprise’s standardized 5x5 business-impact (financial/regulatory/reputational) and likelihood scales.',
              'Draft two Board Risk Appetite statements covering BOTH downside cyber resilience AND upside digital innovation speed.',
              'Eliminate "watermelon reporting" by auditing raw KRI triggers directly alongside management commentary.',
            ],
            successCriteria:
              'Charter integrates IT risk natively into Corporate ERM, balances upside/downside risk optimization, and counters watermelon reporting.',
          },
          flashcards: [
            { front: 'What are the 3 domains of ISACA’s Risk IT Framework?', back: 'Risk Governance (RG), Risk Evaluation (RE), and Risk Response (RR).', tag: 'cgeit-d4' },
            { front: 'What are the two opposing halves of IT Risk in CGEIT?', back: '1) Value/Benefit Enablement Risk (missing digital innovation upside), and 2) Program Delivery / Operations & Cyber Risk (downside loss/breach/outage).', tag: 'cgeit-d4' },
            { front: 'Why must IT risk never operate as an isolated technical silo?', back: 'Because IT risk directly impacts revenue, legal survival, and reputation—it must integrate into Corporate ERM using one common business language.', tag: 'cgeit-d4' },
          ],
          sourceRefs: [
            'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
          ],
        },
        {
          id: 'cgeit-d4-l2',
          title: 'Risk Scenarios, Emerging Tech/AI Governance & Quantitative Risk (FAIR)',
          estimatedMinutes: 40,
          summary:
            'Sharpen board risk decisions using concrete Risk Scenarios (Top-Down + Bottom-Up), financial quantification (FAIR), and proactive governance of emerging technologies (AI, Cloud, Supply Chain).',
          learningObjectives: [
            'Construct actionable IT Risk Scenarios combining Top-Down (business-driven) and Bottom-Up (threat/tech-driven) approaches.',
            'Compare qualitative heatmaps against financial quantification models (FAIR / Monte Carlo loss exceedance curves) for executive capital allocation.',
            'Govern emerging technology adoption (Generative AI, multi-cloud, IoT) via sandboxed experimentation and explicit ethical/privacy guardrails.',
          ],
          coreConcepts: [
            {
              heading: 'Top-Down vs. Bottom-Up Risk Scenarios & FAIR Quantification',
              explanation:
                'Vague risk statements like "Cloud Risk: High" give executives nothing to act on! Effective CGEIT risk evaluation develops concrete Risk Scenarios specifying: Actor + Threat Type + Event + Asset/Resource + Timing/Business Effect. Combine Top-Down (starting from critical business goals and asking "what IT failures could derail them?") with Bottom-Up (mapping real threat intelligence and technical vulnerabilities up to business impact). While 5x5 heatmaps help quick triage, Factor Analysis of Information Risk (FAIR) translates scenarios into probabilistic dollar loss distributions (Loss Event Frequency x Loss Magnitude)—empowering CFOs and Boards to compare a $2M cyber control directly against $14M expected annualized loss exposure!',
              mentalModel:
                'A red square on a heatmap says "Storm coming!" FAIR says "There is a 20% probability of $8M–$15M flood damage this year, and a $900K levee cuts expected loss by 80%."',
              formulaOrRule: 'Complete Risk Assessment = Top-Down (Business-Driven) + Bottom-Up (Threat-Driven) Scenarios -> Quantify Major Risks Financially (FAIR/ALE).',
            },
            {
              heading: 'Governing Emerging Technologies (AI, Cloud & Third-Party Concentration)',
              explanation:
                'Banning emerging technologies (like Generative AI) outright simply drives employees to shadow personal accounts! Effective governance enables safe innovation through controlled governance guardrails: establish an approved enterprise AI/Emerging Tech Policy, deploy monitored internal sandboxes, enforce NIST AI RMF principles (Govern, Map, Measure, Manage — testing for bias, IP leakage, hallucination, and explainability), and monitor Cloud Concentration Risk (over-reliance on a single hyperscaler or critical SaaS supplier creating systemic enterprise fragility).',
              mentalModel:
                'Guardrails on a mountain highway don’t exist to stop cars from driving—they let cars drive FAST without plunging off the cliff.',
              formulaOrRule: 'Emerging Tech Governance = Controlled Safe Sandbox + Clear Policy Guardrails + Concentration Risk Monitoring (NEVER blind outright bans!).',
            },
          ],
          realWorldScenario: {
            title: 'Turning an Outright AI Ban into Governed Enterprise Value',
            situation:
              'After discovering employees pasting client contracts into public chatbots, Legal proposed a total ban on all AI tools. Within 30 days, shadow AI usage doubled on personal phones while a competitor launched an AI contract-review tool winning 15% market share.',
            analysis:
              'An outright ban failed Risk Optimization: it failed to stop leakage (shadow IT) AND maximized Value Enablement Risk (losing market share). Replacing the ban with a governed private enterprise LLM instance (zero public training retention, DLP prompt filtering, human-in-the-loop sign-off, and clear Acceptable Use Policy) optimized both innovation and confidentiality simultaneously.',
            takeaway:
              'Executive IT governance builds safe paved roads so the business moves fast within approved risk boundaries.',
          },
          examTraps: [
            'CGEIT classic: Why combine BOTH Top-Down AND Bottom-Up risk scenario analysis? Top-Down ensures alignment to strategic business objectives; Bottom-Up catches real technical/threat exposures business executives might not foresee!',
            'Watch out for Concentration Risk: putting 100% of core banking, email, identity, and backups inside ONE single vendor creates systemic single-point-of-failure risk scrutinized heavily by financial regulators (e.g., EU DORA)!',
            'FAIR models risk financially via Loss Event Frequency (LEF) x Loss Magnitude (LM)—ideal for executive capital justification.',
          ],
          keyTerms: [
            { term: 'FAIR (Factor Analysis of Information Risk)', definition: 'International quantitative risk standard expressing cyber/operational risk probabilistically in financial terms (Loss Event Frequency x Loss Magnitude).' },
            { term: 'Concentration Risk', definition: 'Systemic exposure arising from heavy over-dependence on a single cloud hyperscaler, software vendor, or geographic region.' },
            { term: 'Risk Scenario', definition: 'Concrete description of a plausible threat event specifying actor, action, affected asset, and resulting business impact.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d4-l2-q1',
              question:
                'Why do mature CGEIT risk programs combine BOTH Top-Down and Bottom-Up approaches when constructing enterprise IT risk scenarios?',
              options: [
                'To double the paperwork required for external regulators',
                'Top-Down aligns risk directly to critical business objectives while Bottom-Up uncovers granular technical and threat exposures executives might overlook',
                'Bottom-Up eliminates the need for executive risk appetite',
                'Top-Down replaces all vulnerability scanning',
              ],
              correctIndex: 1,
              rationale:
                'Top-Down ensures scenarios stay grounded in strategic business priorities, while Bottom-Up translates real technical/operational vulnerabilities into realistic business-impact scenarios—ensuring zero blind spots.',
            },
            {
              id: 'cgeit-d4-l2-q2',
              question:
                'A major retail bank hosts its core ledger, identity provider, fraud engine, and disaster recovery backups exclusively with one single public cloud provider. Which specific risk is European and global financial governance MOST concerned about here?',
              options: [
                'Third-party Vendor Concentration Risk',
                'Sunk Cost Fallacy',
                'Scope Creep',
                'Password Complexity Fatigue',
              ],
              correctIndex: 0,
              rationale:
                'Relying exclusively on one provider for all critical operations AND recovery creates severe systemic Vendor Concentration Risk—a major focus of modern board resilience governance and regulations like EU DORA.',
            },
          ],
          practicalDrill: {
            title: 'Board Risk Scenario & Emerging AI Governance Framework',
            prompt:
              'Translate two technical risks (Ransomware + Shadow Generative AI) into quantified Board-level Risk Scenarios.',
            steps: [
              'Write full Risk Scenarios (Actor + Event + Asset + Quantified Financial/Business Impact) using Top-Down + Bottom-Up inputs.',
              'Estimate annualized financial loss ranges (FAIR lens) alongside proposed safeguard ROI.',
              'Design a safe governed enterprise AI sandbox replacing blanket bans with DLP, privacy guardrails, and NIST AI RMF accountability.',
            ],
            successCriteria:
              'Scenarios abandon vague "High/Red" labels for financial impact ranges and balance AI innovation with risk protection.',
          },
          flashcards: [
            { front: 'Top-Down vs. Bottom-Up Risk Scenario Analysis?', back: 'Top-Down starts from business objectives asking what IT failures could derail them; Bottom-Up maps technical/threat weaknesses upward to business impact.', tag: 'cgeit-d4' },
            { front: 'What are the two top-level components of FAIR financial risk quantification?', back: 'Loss Event Frequency (LEF) x Loss Magnitude (LM).', tag: 'cgeit-d4' },
            { front: 'Why do blanket bans on emerging technologies like AI typically fail?', back: 'They drive shadow IT usage on unmanaged channels while inflicting competitive Value Enablement Risk; governed safe sandboxes optimize both value and risk.', tag: 'cgeit-d4' },
          ],
          sourceRefs: [
            'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
            'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
          ],
        },
        {
          id: 'cgeit-d4-l3',
          title: 'Boardroom Cyber Risk Reporting, Resilience & Independent Assurance',
          estimatedMinutes: 40,
          summary:
            'Deliver crisp, decision-ready Boardroom cyber risk briefings, govern enterprise operational resilience, and coordinate independent Three-Lines assurance for directors.',
          learningObjectives: [
            'Structure high-impact Boardroom cyber & IT risk briefings focusing on business exposure, appetite variance, investment ROI, and peer benchmarks—NOT technical jargon.',
            'Govern Enterprise Operational Resilience beyond traditional IT backups (supply chain, cyber crisis exercises, Board tabletop participation).',
            'Ensure directors receive objective, independent assurance on IT governance effectiveness via Internal/External Audit without management filtering.',
          ],
          coreConcepts: [
            {
              heading: 'Reporting Cybersecurity & IT Risk to the Board of Directors',
              explanation:
                'Directors have fiduciary duty ("Duty of Care" and "Duty of Oversight" — e.g., Caremark/SEC cyber disclosure rules) yet typically spend only 15–30 minutes per quarter on IT/cyber risk. Effective Board briefings MUST answer five exact director questions in plain business English: (1) What are our crown-jewel business assets and top 5 quantified cyber/IT risk scenarios? (2) Where are we operating outside Board Risk Appetite (KRIs vs. Tolerance)? (3) Are our security/IT investments measurably reducing risk and creating value (ROSI / Maturity progress)? (4) How resilient are we if a major attack or vendor outage hits tomorrow (recent test results, RTO/MTD)? (5) What specific governance decisions or budget approvals do we need from the Board today?',
              mentalModel:
                'Never dump a 90-page SIEM/CVE encyclopedia on the Board table—hand them a 5-slide executive cockpit highlighting exposure in dollars, appetite status, resilience proof, and clear decisions.',
              formulaOrRule: 'Board Briefing Rule: Business Impact in Dollars + Risk Appetite Variance + Independent Assurance Proof + Clear Ask (ZERO technical jargon!).',
            },
            {
              heading: 'Independent Governance Assurance & Operational Resilience',
              explanation:
                'Management self-reporting is inherently optimistic. To fulfill fiduciary oversight, the Board relies on Independent Assurance (Internal Audit reporting functionally to the Audit Committee + Accredited External Auditors) to verify that EGIT frameworks, risk registers, and resilience plans actually operate as claimed. Modern Operational Resilience goes further than restoring single servers: it tests whether the ENTERPRISE can continue delivering vital customer services during severe prolonged disruption (cyberattack + third-party vendor collapse simultaneously), including active Board-level crisis tabletop exercises!',
              mentalModel:
                'You don’t learn how the Board reacts to a $20M ransomware extortion demand during a real crisis—you practice it safely in an annual Board Crisis Tabletop.',
              formulaOrRule: 'Board Oversight Triad: Unfiltered Independent Audit Assurance + Quantified KRI Scorecards + Annual Executive/Board Crisis Simulation.',
            },
          ],
          realWorldScenario: {
            title: 'Transforming a Board Cyber Briefing Ahead of SEC Disclosure Scrutiny',
            situation:
              'A publicly traded retailer’s Audit Committee warned the CIO/CISO that their quarterly technical slide decks ("1.4M blocked phishing emails, 87% endpoint coverage") failed to demonstrate informed Board oversight under modern material-cyber-risk disclosure mandates.',
            analysis:
              'Replacing raw technical activity counts with a crisp 5-page Board Risk Report—showing top 5 quantified financial risk scenarios, KRI appetite gauges, third-party concentration status, independent Line-3 audit validation, and results from a live Board ransomware tabletop—equipped directors with true fiduciary visibility and rapid materiality assessment.',
            takeaway:
              'Board reporting exists to enable informed fiduciary decisions, not to showcase IT operational busywork.',
          },
          examTraps: [
            'CGEIT classic: "What is the MOST important attribute of IT risk reporting presented to the Board of Directors?" -> Expressed in clear BUSINESS/FINANCIAL IMPACT terms aligned to risk appetite and strategic goals (never granular technical logs/CVEs!).',
            'Remember: Independent Assurance (Internal/External Audit) MUST report functionally straight to the Board Audit Committee—unfiltered by CIO/CISO management!',
            'Boards should actively participate in periodic Crisis / Cyber Resilience Tabletop Exercises so executive materiality, legal disclosure, and ransom/continuity governance decisions are rehearsed BEFORE an emergency.',
          ],
          keyTerms: [
            { term: 'Fiduciary Oversight', definition: 'Legal obligation of corporate directors to act with informed care and diligence in overseeing material enterprise risks including IT and cybersecurity.' },
            { term: 'Operational Resilience', definition: 'Enterprise-wide capability to prevent, adapt to, respond to, and continue delivering critical business services through severe cyber or vendor disruptions.' },
            { term: 'Independent Assurance', definition: 'Objective evaluation by Line-3 Internal Audit or external accredited auditors verifying governance and risk controls operate effectively without management bias.' },
          ],
          conceptChecks: [
            {
              id: 'cgeit-d4-l3-q1',
              question:
                'When preparing the quarterly IT and cybersecurity risk briefing for the Board of Directors, which information is MOST critical to include?',
              options: [
                'Complete list of every medium-severity CVE detected on internal workstations',
                'Top enterprise IT risk scenarios expressed in business/financial impact terms, current KRI posture against risk appetite, resilience test outcomes, and independent assurance status',
                'Raw firewall packet-drop trends grouped by TCP port number',
                'Detailed network router CLI configuration diffs',
              ],
              correctIndex: 1,
              rationale:
                'Directors need concise, business-oriented decision data connecting top IT risks to financial/strategic impact, approved risk appetite, proven operational resilience, and objective independent audit confirmation.',
            },
            {
              id: 'cgeit-d4-l3-q2',
              question:
                'How does the Board Audit Committee BEST ensure it receives objective, unfiltered visibility into whether Enterprise IT Governance controls are truly effective?',
              options: [
                'Relying exclusively on verbal status updates from the IT Infrastructure Manager',
                'Ensuring Internal Audit reports functionally directly to the Audit Committee and commissions periodic independent third-party assurance reviews',
                'Having the CIO edit all Internal Audit findings before Board distribution',
                'Eliminating quarterly governance KPIs',
              ],
              correctIndex: 1,
              rationale:
                'Functional reporting of Line-3 Internal Audit directly to the Board Audit Committee (unfiltered by IT management) paired with external third-party reviews guarantees objective, independent assurance.',
            },
          ],
          practicalDrill: {
            title: '5-Slide Boardroom IT & Cyber Risk Deck Outline',
            prompt:
              'Design a concise 15-minute Board Audit & Risk Committee presentation deck.',
            steps: [
              'Slide 1: Executive Risk Appetite Dashboard (Green/Amber/Red KRIs vs. Board Tolerance across top 5 scenarios).',
              'Slide 2: Financial Risk Quantification (FAIR exposure ranges + ROSI of top 3 risk mitigation investments).',
              'Slide 3: Operational Resilience & Third-Party Concentration status (last parallel failover test + Tier-1 vendor assurance).',
              'Slide 4: Unfiltered Line-3 Independent Audit Findings & POA&M closure trend.',
              'Slide 5: Specific Governance Decisions & Capital Approvals requested from the Board today.',
            ],
            successCriteria:
              'Deck stays strictly jargon-free, connects risk to dollars/appetite, includes unfiltered independent assurance, and ends with clear Board decisions.',
          },
          flashcards: [
            { front: 'What are the 5 essential questions every Board cyber/IT risk briefing must answer?', back: '1) Top business-impact risk scenarios? 2) Variance vs. Risk Appetite? 3) Investment value/ROSI? 4) Proven operational resilience? 5) Clear Board decisions needed?', tag: 'cgeit-d4' },
            { front: 'Who must Internal Audit report to functionally to preserve Board assurance independence?', back: 'Directly to the Board Audit Committee (never filtered through CIO or IT management).', tag: 'cgeit-d4' },
            { front: 'How does Operational Resilience expand beyond traditional IT DRP?', back: 'It focuses on sustaining critical end-to-end customer/business services through severe prolonged disruptions including cyberattacks and third-party vendor failures.', tag: 'cgeit-d4' },
          ],
          sourceRefs: [
            'my_documents/𝗥𝗲𝗽𝗼𝗿𝘁𝗶𝗻𝗴 𝗖𝘆𝗯𝗲𝗿𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗥𝗶𝘀𝗸 𝘁𝗼 𝘁𝗵𝗲 𝗕𝗼𝗮𝗿𝗱 𝗼𝗳 𝗗𝗶𝗿𝗲𝗰𝘁𝗼𝗿𝘀.pdf',
            'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Board-Level Digital Governance Overhaul at a Global Financial Holding Group',
    scenario:
      'Aurelia Financial Group (4 operating banks across Europe and North America) is struggling with stagnant digital growth and regulatory warnings. A Board-commissioned review reveals: (1) IT governance is fragmented—each bank runs its own legacy stack totaling 11 ERPs and 82% "Run" maintenance spend; (2) the Board delegates all IT decisions blindly to the group CIO without an IT Strategy Committee; (3) a $15M custom mobile-banking project is $7M over budget with $10M still needed while a commercial platform costs $4M, yet executives refuse to cancel due to past spend; (4) IT reports technical green metrics disconnected from Corporate ERM; and (5) all cloud operations sit inside one hyperscaler with no exit plan.',
    tasks: [
      'Design a tailored COBIT 2019 / ISO 38500 Governance Architecture establishing EDM vs. PBRM boundaries, Board IT Strategy Committee vs. Executive IT Steering Committee, Goals Cascade, and all 7 Governance Components (Domain 1).',
      'Formulate an Enterprise Architecture Application Rationalization, Key-Person succession plan, and Multisourcing + Exit Strategy governance program (Domain 2).',
      'Establish Portfolio Stage-Gate Governance, resolve the $15M runaway mobile project decisively (defeating Sunk Cost Fallacy), rank replacement options via NPV & IT Balanced Scorecard, and install Business-Sponsor-owned Benefits Realization PIRs (Domain 3).',
      'Integrate IT Risk into Corporate ERM (FAIR financial scenarios, Vendor Concentration mitigation, governed AI sandbox) and construct a 5-slide Board Risk Report backed by unfiltered Audit Committee assurance (Domain 4).',
    ],
    modelSolution:
      '1) EGIT Framework (D1): Establish a Board-level IT Strategy Committee (EDM01–05) distinct from an Executive-level IT Steering Committee (APO/BAI/DSS/MEA); tailor COBIT 2019 via Design Factors (Strategic Role of IT, High Compliance, Regulated Multi-Entity) tracing all initiatives up the 4-tier Goals Cascade and reinforcing all 7 Components—especially Culture, Ethics, and Behavior plus Data Governance via a Group CDO. 2) Resource & Sourcing Optimization (D2): Execute TOGAF Enterprise Architecture Application Rationalization consolidating 11 ERPs into 2 core platforms to cut "Run" spend from 82% toward 55% freeing Transform capital; enforce cross-training/succession for key legacy staff; adopt governed Multisourcing overseen by an internal VMO keeping core banking IP and governance in-house while negotiating outcome-based SLAs, Right-to-Audit, and pre-priced Exit Plans. 3) Benefits Realization (D3): Terminate the runaway $15M mobile project immediately at Stage-Gate (ignoring $15M sunk cost; $4M commercial platform beats $10M remaining custom cost by $6M); rank future mutually exclusive proposals by Highest Positive NPV (> hurdle rate) complemented by all 4 IT Balanced Scorecard quadrants; assign Business Executive Sponsors (never IT alone) to every living Business Case with pre-launch baselines and mandatory 9-month PIR audits. 4) Risk Optimization & Board Reporting (D4): Unify IT risk natively into Corporate ERM using Top-Down + Bottom-Up FAIR quantified scenarios; mitigate single-hyperscaler Concentration Risk via multi-cloud portability/exit drills; replace blanket AI bans with governed safe sandboxes; replace "watermelon" technical decks with a 5-slide Board Risk Briefing expressing financial exposure vs. Risk Appetite backed by unfiltered Line-3 Internal Audit reporting straight to the Audit Committee.',
  },
  examStrategy: {
    examFormat:
      '150 multiple-choice questions, 4 hours (240 minutes), passing scaled score 450 / 800. Domain 1 (40%) + Domain 3 (26%) account for TWO-THIRDS (66%) of the entire CGEIT exam—master COBIT 2019 EDM and Benefits Realization cold!',
    timeManagementPlan:
      'Target ~1.3 minutes per question (Question 50 by Minute 65, Question 100 by Minute 130, Question 150 by Minute 195), keeping 45 minutes to re-read nuanced board-governance items. Read every qualifier word (PRIMARY, MOST, FIRST, BEST) twice.',
    mindsetRules: [
      'Sit in the BOARDROOM / CIO-ADVISOR Chair — higher elevation than CISSP or even CISM! CGEIT is about Enterprise Value Creation across ALL IT, not just cybersecurity.',
      'Stakeholder Value = Benefits Realization + Risk Optimization + Resource Optimization. Test every answer option against this 3-part compass.',
      'Separate Governance (Board: Evaluate, Direct, Monitor) from Management (Execs/IT: Plan, Build, Run, Monitor) rigorously.',
      'Business Sponsors OWN business cases and benefits; IT delivers technical capabilities; Boards hold ultimate accountability; Auditors provide independent unfiltered assurance.',
      'Kill Sunk Cost Fallacy instantly, tailor COBIT via Design Factors (never copy-paste!), rank mutually exclusive investments by Highest Positive NPV, and integrate IT Risk inside Corporate ERM.',
    ],
    finalWeekChecklist: [
      'Master Domain 1 (40%): All 5 EDM objectives, 4 Management domains, 4-step Goals Cascade, 7 Components, Design Factors, ISO 38500’s 6 principles, and IT Strategy vs. IT Steering Committee.',
      'Master Domain 3 (26%): Run/Grow/Transform portfolios, Business Sponsor accountability, Stage-Gate vs. Sunk Cost, NPV vs. IRR vs. Payback, 4 IT Balanced Scorecard quadrants, and Pre-Launch Baselines + PIR.',
      'Drill Resource Optimization (D2: EA Rationalization, Sourcing Core Rule, Multisourcing VMO, Exit Plans) and Risk Optimization (D4: Upside+Downside Risk, ERM Integration, FAIR, Concentration Risk, Board Reporting).',
      'Complete two full 150-question 4-hour timed executive mocks targeting >= 85% accuracy.',
    ],
  },
};
