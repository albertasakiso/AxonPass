/* ===================================================================
   ANOXPASS — GIAC GSLC End-to-End Certification Course
   Tier 5 (Executive) | SANS MGT512 Security Leadership | Zero-to-Exam
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const GSLC_COURSE: CertificationCourse = {
  certId: 'gslc',
  certCode: 'GSLC',
  title: 'GIAC Security Leadership Certification',
  provider: 'GIAC / SANS',
  tier: 5,
  tagline: 'Fuse executive security leadership, team command, and deep hands-on technical architecture oversight.',
  estimatedTotalHours: 85,
  passingScore: '70%',
  domains: [
    // =================================================================
    // DOMAIN 1: SECURITY LEADERSHIP & MANAGEMENT (25%)
    // =================================================================
    {
      id: 'gslc-d1',
      domainNumber: 1,
      title: 'Security Leadership & Management',
      examWeightPercent: 25,
      overview:
        'Equips modern CISOs and security managers with practical leadership mastery: adaptive leadership styles, organizational culture transformation, high-retention security team building, 90-day strategic planning, financial business cases, and persuasive executive communication.',
      lessons: [
        {
          id: 'gslc-d1-l1',
          title: 'Security Leadership Styles, Emotional Intelligence & Building Security Culture',
          estimatedMinutes: 45,
          summary:
            'Transition cleanly from star technical contributor to inspiring security leader using Situational Leadership, Emotional Intelligence (EQ), psychological safety, and Security Champions networks.',
          learningObjectives: [
            'Differentiate Management (planning, budgeting, organizing systems) from Leadership (inspiring vision, influencing behavior, navigating change).',
            'Adapt across leadership styles (Transformational, Servant, Situational/Hersey-Blanchard, Directive during active crisis) based on team maturity and urgency.',
            'Apply Daniel Goleman’s Emotional Intelligence pillars and construct scalable Security Champions programs to transform culture across engineering.',
          ],
          coreConcepts: [
            {
              heading: 'Situational Leadership & Managing vs. Leading',
              explanation:
                'Great engineers often fail when promoted into management because they keep doing hands-on firefighting instead of leading people! Management brings order and predictability (schedules, budgets, SLAs); Leadership creates direction, alignment, and resilience through uncertainty. Under Situational Leadership (Hersey-Blanchard), a security leader adapts dynamically to each analyst’s competence and commitment: Directing (clear step-by-step instructions for junior Tier-1 analysts or active Sev-1 incident command), Coaching (high direction + high support for developing specialists), Supporting (collaborative problem-solving for capable engineers lacking confidence), and Delegating (empowering senior architects with outcomes, NOT micromanaging their methods!).',
              mentalModel:
                'Use Directive command when the server room is literally on fire; use Servant and Delegating leadership when architecting next year’s Zero Trust roadmap with senior engineers.',
              formulaOrRule: 'Active Crisis = Clear Directive Command | Routine Innovation & Senior Staff = Transformational / Delegating Leadership.',
            },
            {
              heading: 'Emotional Intelligence (EQ) & Psychological Safety in Security Teams',
              explanation:
                'Security operates in a high-stress, adversarial environment where technical brilliance without Emotional Intelligence creates toxic silos and attrition. Goleman’s five EQ pillars—Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills—enable a CISO to negotiate calmly with frustrated business VPs instead of triggering defensive turf wars. Inside the security team, cultivating Psychological Safety (Amy Edmondson) ensures analysts immediately escalate mistakes or suspicious anomalies without fear of humiliation—catching breaches hours earlier.',
              mentalModel:
                'A leader with high IQ and zero EQ wins technical arguments while losing the CFO’s budget and the engineering team’s trust.',
              formulaOrRule: 'Psychological Safety = Fast Escalation of Errors & Breaches -> Shorter Dwell Time & Higher Team Retention.',
            },
            {
              heading: 'Scaling Security Culture via Security Champions',
              explanation:
                'A centralized security team of 10 cannot police 500 developers and 4,000 employees alone. Building a Security Champions Network embeds respected volunteers INSIDE each engineering squad and business unit—giving them advanced training, early threat intel, and career recognition so they champion secure design peer-to-peer. Pair this with positive reinforcement ("Catch people doing security right") rather than shaming employees who fail phishing simulations.',
              mentalModel:
                'Security Champions transform Security from an unpopular hallway monitor into trusted teammates sitting right inside every squad.',
              formulaOrRule: 'Culture Shift Formula: Executive Sponsorship + Embedded Security Champions + Positive Reinforcement (Zero Public Shaming).',
            },
          ],
          realWorldScenario: {
            title: 'Turning Around a Burned-Out, Siloed SOC & Engineering Conflict',
            situation:
              'A newly promoted Security Director inherited a team with 40% annual turnover where senior architects felt micromanaged and product engineering treated security tickets as adversarial roadblocks.',
            analysis:
              'The prior director used rigid command-and-control micromanagement for seasoned architects and blocked deployments without empathy for engineering deadlines. Shifting to Delegating/Servant leadership with senior engineers, establishing an embedded Security Champions guild across product squads, and celebrating fast secure releases dropped turnover below 8% and cut remediation lead times in half.',
            takeaway:
              'Match leadership style to task urgency and staff maturity—empower experts with clear outcomes and scale influence through embedded champions.',
          },
          examTraps: [
            'GIAC GSLC classic: Never pick "Micromanage / personally reconfigure the firewall yourself" when a leadership question asks how a Security Manager should handle recurring operational work—delegate clearly with defined standards and accountability!',
            'Wait: In an active, life-or-death or Sev-1 active crisis (ransomware spreading right now), Directive/Command leadership IS appropriate—don’t call a 3-hour consensus brainstorming circle while data exfiltrates!',
            'Publicly naming-and-shaming employees who click simulated phishing links destroys psychological safety and causes staff to HIDE real breaches—ALWAYS choose positive coaching and targeted micro-training!',
          ],
          keyTerms: [
            { term: 'Situational Leadership', definition: 'Adaptive leadership framework matching Directing, Coaching, Supporting, or Delegating behaviors to follower readiness and task urgency.' },
            { term: 'Psychological Safety', definition: 'Shared team belief that members can voice concerns, report errors, and challenge assumptions without fear of punishment or ridicule.' },
            { term: 'Security Champions', definition: 'Trained embedded advocates within engineering and business units who promote secure design and bridge collaboration with central security.' },
            { term: 'Servant Leadership', definition: 'Leadership philosophy prioritizing removing obstacles, developing team capability, and empowering staff to achieve mission excellence.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d1-l1-q1',
              question:
                'A newly hired CISO notices that a highly experienced Principal Cloud Architect is growing disengaged because the previous manager reviewed every single Terraform pull request line-by-line. Applying Situational Leadership, which style should the CISO adopt with this architect?',
              options: [
                'High-direction, low-support Directing',
                'Low-direction, outcome-focused Delegating',
                'Punitive micro-supervision',
                'Complete organizational isolation',
              ],
              correctIndex: 1,
              rationale:
                'Experienced, highly capable and motivated senior staff thrive under Delegating leadership—setting clear strategic goals, guardrails, and outcomes while empowering autonomy over technical execution.',
            },
            {
              id: 'gslc-d1-l1-q2',
              question:
                'After a quarterly phishing simulation, an HR manager suggests posting a "Wall of Shame" listing employees who clicked the test link in the company newsletter. Why should a GIAC-trained Security Leader reject this proposal?',
              options: [
                'Phishing simulations cannot measure click rates accurately',
                'Public shaming destroys psychological safety and incentivizes employees to conceal real security incidents out of fear',
                'Security awareness should only be taught to IT staff',
                'Newsletters violate TCP/IP protocols',
              ],
              correctIndex: 1,
              rationale:
                'Shaming erodes trust and psychological safety; when an employee later falls for a real attack, fear of humiliation delays reporting by critical hours. Constructive coaching and celebrating rapid reporting strengthen security culture.',
            },
          ],
          practicalDrill: {
            title: 'Security Champions Charter & Team Leadership Assessment',
            prompt:
              'Design a 1-page Security Champions rollout plan and team leadership matrix for a 15-person security department.',
            steps: [
              'Map each role in your team (Junior SOC Analyst, Mid-level GRC Specialist, Senior Cloud Architect) to the optimal Situational Leadership quadrant.',
              'Define Security Champion incentives (dedicated 10% learning time, conference passes, formal performance-review recognition, direct Slack channel with AppSec).',
              'Replace punitive awareness tactics with a "Catch & Celebrate Fast Reporting" recognition program.',
            ],
            successCriteria:
              'Plan aligns leadership styles accurately to staff maturity, builds scalable Security Champions incentives, and safeguards psychological safety.',
          },
          flashcards: [
            { front: 'List the 4 styles of Hersey-Blanchard Situational Leadership.', back: 'Directing (S1), Coaching (S2), Supporting (S3), and Delegating (S4).', tag: 'gslc-d1' },
            { front: 'When is Directive leadership the RIGHT choice for a Security Leader?', back: 'During urgent active crises (Sev-1 incident command) or when guiding brand-new junior analysts on unfamiliar high-risk procedures.', tag: 'gslc-d1' },
            { front: 'Why do Security Champions dramatically scale a security program?', back: 'They embed peer security influence directly inside development and business squads, turning security into a shared culture rather than a central bottleneck.', tag: 'gslc-d1' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d1-l2',
          title: 'The CISO 90-Day Strategic Plan, Security Budgets & Executive Influence',
          estimatedMinutes: 45,
          summary:
            'Execute a high-impact First 90 Days CISO roadmap, master budgeting mechanics (CapEx vs. OpEx, Zero-Based vs. Incremental budgeting, Business Cases), and influence skeptical peers without direct authority.',
          learningObjectives: [
            'Structure a disciplined 30-60-90 Day Security Leadership Plan prioritizing listening, stakeholder trust, quick risk wins, and multi-year strategy.',
            'Compare Incremental vs. Zero-Based Budgeting, CapEx vs. OpEx cloud shifts, and ROI/NPV/ALE justification models.',
            'Apply Executive Communication frameworks (BLUF — Bottom Line Up Front, Pyramid Principle, framing risk in business revenue/mission language).',
          ],
          coreConcepts: [
            {
              heading: 'The CISO 30-60-90 Day Leadership Blueprint',
              explanation:
                'New security leaders fail fast when they burst in on Day 1 tearing up policies before understanding the business! A disciplined SANS/GSLC 90-day plan sequences deliberately: Days 1–30 (Listen, Learn & Map): Meet key business leaders, audit crown-jewel assets, assess team morale/skills, review active audits/incidents, identify immediate existential fires (e.g., exposed RDP/missing MFA/no offline backups); Days 31–60 (Quick Wins & Risk Alignment): Deliver visible low-friction quick wins building credibility, establish Security Steering Committee, complete Gap Analysis against NIST CSF/CIS Controls; Days 61–90 (Multi-Year Strategy & Budget): Present a prioritized 1–3 year risk-aligned Security Roadmap and Business Case to the Executive Team and Board.',
              mentalModel:
                'Days 1–30: Diagnose before prescribing. Days 31–60: Stop bleeding + win trust. Days 61–90: Architect the 3-year hospital upgrade.',
              formulaOrRule: '30-60-90 Cadence: Listen & Assess (30) -> Stabilize & Quick Wins (60) -> Present Board Strategy & Roadmap (90).',
            },
            {
              heading: 'Security Budgeting Mechanics & BLUF Executive Communication',
              explanation:
                'Security leaders must speak fluent Finance: CapEx (Capital Expenditure — upfront hardware/perpetual assets depreciated over years) vs. OpEx (Operational Expenditure — recurring SaaS/cloud subscriptions, salaries, MSSP fees); Incremental Budgeting (adjusting last year’s spend by +/- %) vs. Zero-Based Budgeting (justifying every dollar fresh from $0 against strategic risk value—painful yet unbeatable for eliminating shelfware!). When pitching executives, ALWAYS use BLUF (Bottom Line Up Front / Minto Pyramid Principle): Lead with the exact executive recommendation and business outcome in the FIRST 30 seconds, followed by 3 concise supporting financial/risk arguments, reserving technical details strictly for the appendix!',
              mentalModel:
                'Engineers tell stories bottom-up (40 minutes of logs -> conclusion at minute 41). Executives listen top-down (BLUF: conclusion + cost + business risk in slide 1!).',
              formulaOrRule: 'Executive Pitch Rule = BLUF (Decision + Business Impact + Dollar Cost in first 30 seconds) -> Never start with packet captures!',
            },
          ],
          realWorldScenario: {
            title: 'Securing $1.2M for Zero Trust Identity Modernization Using BLUF',
            situation:
              'A Security Director has 7 minutes on the CFO’s calendar to request $1.2M to replace legacy passwords with FIDO2 MFA and PAM. Previous 30-slide technical pitches failed.',
            analysis:
              'Using BLUF on Slide 1: "Requesting $1.2M over 24 months to eliminate our #1 ransomware entry vector ($8.4M modeled downtime risk), satisfy our cyber-insurance renewal mandate saving $320K/yr in premiums, and retire $210K/yr in overlapping legacy VPN shelfware." Clear decision, business math, zero FUD, instant credibility.',
            takeaway:
              'Lead with the business decision, financial trade-offs, and shelfware consolidation—translate technical architecture into CFO economics.',
          },
          examTraps: [
            'GSLC classic: On Day 1 in a new security leadership role, NEVER start by rewriting every policy or firing vendors—START by listening to business stakeholders, understanding mission objectives, and assessing existing crown-jewel risks!',
            'Zero-Based Budgeting requires justifying EVERY line item from zero each cycle (eliminating zombie tools/shelfware), whereas Incremental Budgeting adjusts prior-year totals.',
            'Remember: Never confuse "Security as a Cost Center" with "Security as a Business Enabler"—show how fast, trusted security accelerates enterprise sales (winning enterprise customer RFPs via SOC 2/ISO 27001)!',
          ],
          keyTerms: [
            { term: 'BLUF (Bottom Line Up Front)', definition: 'Executive communication discipline presenting the core conclusion, business impact, and requested decision first before supporting evidence.' },
            { term: 'Zero-Based Budgeting', definition: 'Budgeting methodology requiring every program and tool expense to be justified freshly from zero each period against strategic value.' },
            { term: 'Shelfware', definition: 'Purchased security software or licenses sitting undeployed, unconfigured, or underutilized while draining recurring OpEx.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d1-l2-q1',
              question:
                'During the first 30 days of taking over as a company’s new Security Director, which sequence of actions BEST sets up long-term leadership success?',
              options: [
                'Immediately replace the SIEM vendor and enforce strict new lockouts across all departments',
                'Interview business leaders to learn strategic priorities, assess team strengths, inventory crown-jewel risks, and verify immediate existential safeguards (MFA/offline backups)',
                'Isolate the security team from business meetings to maximize technical focus',
                'Publish a 300-page mandatory policy manual without stakeholder input',
              ],
              correctIndex: 1,
              rationale:
                'The first 30 days focus on building stakeholder trust, understanding the business mission, evaluating team/asset realities, and confirming no existential immediate fires exist before designing a multi-year roadmap.',
            },
            {
              id: 'gslc-d1-l2-q2',
              question:
                'Which budgeting methodology is MOST effective at uncovering and eliminating unused security "shelfware" tools accumulated over previous years?',
              options: [
                'Incremental plus-5% historical budgeting',
                'Zero-Based Budgeting (justifying every dollar fresh against current risk reduction and value)',
                'Ad-hoc emergency credit card spending',
                'Static hardware-only CapEx budgeting',
              ],
              correctIndex: 1,
              rationale:
                'Zero-Based Budgeting forces leaders to justify every recurring tool and contract from $0 based on active measurable value and utilization, rapidly exposing redundant or unused shelfware.',
            },
          ],
          practicalDrill: {
            title: 'CISO 30-60-90 Day Executive Plan & 1-Page BLUF Pitch',
            prompt:
              'Draft a 90-day transition plan for a newly hired CISO joining a 1,500-employee SaaS company.',
            steps: [
              'Days 1–30: Stakeholder listening tour (CEO, CFO, CTO, General Counsel, Sales VP), team 1-on-1s, top-5 existential risk triage (MFA, backups, external perimeter).',
              'Days 31–60: Zero-Based tool audit (cut shelfware), NIST CSF 2.0 baseline assessment, 2 frictionless quick wins.',
              'Days 61–90: Deliver a 5-minute BLUF Board presentation locking in a 24-month roadmap and budget.',
            ],
            successCriteria:
              'Plan sequences listening before policy overhaul, applies Zero-Based shelfware rationalization, and leads executive messaging with BLUF.',
          },
          flashcards: [
            { front: 'What does BLUF stand for in executive security communication?', back: 'Bottom Line Up Front — deliver the core conclusion, business risk/value impact, and exact requested decision in the opening 30 seconds.', tag: 'gslc-d1' },
            { front: 'CapEx vs. OpEx in modern cloud security budgets?', back: 'CapEx = upfront capital assets depreciated over time (on-prem appliances); OpEx = ongoing operational utility/subscription expenses (SaaS, cloud, MSSP, salaries).', tag: 'gslc-d1' },
            { front: 'What is the #1 focus of Days 1–30 in a new CISO 90-day plan?', back: 'Listen and learn: align with business executives, assess team health, locate crown jewels, and confirm immediate existential survival controls (MFA, immutable backups).', tag: 'gslc-d1' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d1-l3',
          title: 'Project Management, Hiring/Retention, Burnout Prevention & Operational Metrics',
          estimatedMinutes: 40,
          summary:
            'Deliver complex security transformations cleanly using Project Management discipline (Scope-Time-Cost Iron Triangle, WBS, Critical Path), retain scarce cyber talent, and eliminate SOC alert burnout.',
          learningObjectives: [
            'Apply Project Management fundamentals (Project Charter, WBS, Critical Path, Scope Creep control, Iron Triangle trade-offs) to security deployments.',
            'Design inclusive hiring rubrics (evaluating aptitude, curiosity, and communication alongside certifications) and structured career ladders to curb attrition.',
            'Eliminate SOC analyst burnout using alert engineering, SOAR automation, sustainable on-call rotations, and clear operational KPIs.',
          ],
          coreConcepts: [
            {
              heading: 'Project Management for Security Leaders (Iron Triangle & Scope Creep)',
              explanation:
                'Security initiatives frequently stall halfway through deployment due to poor project discipline. Every major security rollout (e.g., enterprise MFA or EDR migration) obeys the Project Management Iron Triangle: Scope, Time (Schedule), and Cost (Resources), all bounding Quality—changing ONE side inevitably impacts the others! Control execution via: (1) Written Project Charter & Stakeholder RACI; (2) Work Breakdown Structure (WBS — decomposing complex rollouts into verifiable deliverables); (3) Identifying the Critical Path (longest dependent task sequence governing minimum total project duration—any delay on the Critical Path delays the whole launch!); and (4) Formal Change Control stopping Scope Creep ("while you’re at it, add 5 extra apps!").',
              mentalModel:
                'If executives demand cutting the schedule in half while keeping Scope fixed, you MUST either expand Cost/Resources or explicitly cut lower-priority Scope—never pretend magic makes all three shrink simultaneously.',
              formulaOrRule: 'Iron Triangle: Scope <-> Time <-> Cost (Quality at center). Any slip on the Critical Path = Direct Launch Slip.',
            },
            {
              heading: 'Cyber Talent Strategy, Career Ladders & Defeating SOC Burnout',
              explanation:
                'Replacing a senior security engineer costs 1.5x–2x their annual salary and leaves dangerous coverage blind spots for 6+ months. Beat the talent shortage by: (1) Hiring for problem-solving aptitude, cross-functional curiosity, and internal IT transfers (helpdesk/sysadmins already know corporate infrastructure!) rather than unicorn 10-year job descriptions; (2) Offering dual-track career progression (Technical Principal Architect track alongside People Management track—never force brilliant engineers into management just to earn a raise!); and (3) Crushing SOC burnout by ruthlessly pruning noisy false-positive SIEM alerts, automating repetitive Tier-1 triage with SOAR, protecting dedicated learning time, and capping on-call pager fatigue.',
              mentalModel:
                'Forcing your best malware reverse-engineer into people management to give them a promotion loses a world-class engineer and creates a miserable manager—build a parallel Technical Principal track!',
              formulaOrRule: 'Retention Formula: Dual Career Tracks (Tech + Mgmt) + Automated Noise Pruning (Stop Burnout) + Funded Upskilling + Internal IT Talent Pipeline.',
            },
          ],
          realWorldScenario: {
            title: 'Rescuing a Delayed Zero-Trust Rollout & Halving SOC Alert Fatigue',
            situation:
              'A 6-month EDR deployment hit Month 5 only 40% done because business units kept adding unbudgeted legacy servers mid-flight, while SOC analysts faced 900 daily un-tuned alerts and two analysts resigned.',
            analysis:
              'Uncontrolled Scope Creep derailed the Critical Path, and alert fatigue triggered burnout. Locking Scope via formal change control (deferring unbudgeted legacy edge cases to Phase 2), tracking weekly Critical Path blockers, and dedicating 20% engineering sprint capacity to SIEM detection-tuning + SOAR auto-enrichment cut daily alerts by 78% and brought Phase 1 across the finish line cleanly.',
            takeaway:
              'Relentless scope discipline protects project delivery, and relentless alert-noise reduction protects human defenders.',
          },
          examTraps: [
            'GSLC classic: Know the exact definition of the Critical Path — it is the LONGEST sequential chain of dependent tasks through a project network (having ZERO slack/float), determining the shortest possible completion duration!',
            'Do NOT rely solely on hiring external "unicorn" senior talent—internal cross-training of IT/network/sysadmin staff into cybersecurity yields superior institutional knowledge and higher retention.',
            'Mean Time to Detect (MTTD) and Mean Time to Contain/Respond (MTTC/MTTR) are premier operational SOC performance KPIs—always pair them with False-Positive Rate so analysts aren’t gaming speed by blindly closing alerts!',
          ],
          keyTerms: [
            { term: 'Critical Path', definition: 'Longest sequence of dependent project tasks determining minimum total project duration; tasks on it have zero schedule slack.' },
            { term: 'Work Breakdown Structure (WBS)', definition: 'Hierarchical decomposition of total project scope into discrete, manageable, verifiable work packages.' },
            { term: 'Scope Creep', definition: 'Uncontrolled expansion of project deliverables without corresponding adjustments to schedule, budget, or formal change approval.' },
            { term: 'Dual-Track Career Ladder', definition: 'HR progression model offering equal seniority and compensation along both Individual Contributor (Principal/Fellow) and Management paths.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d1-l3-q1',
              question:
                'In a complex enterprise PAM migration project, an automated database connector task sits directly on the project’s Critical Path and slips by 10 business days. Assuming no schedule compression (crashing/fast-tracking), what is the direct impact?',
              options: [
                'Zero impact because Critical Path tasks have maximum schedule float',
                'The final project completion date slips by 10 business days',
                'Total project budget automatically drops by 10%',
                'Scope Creep is eliminated automatically',
              ],
              correctIndex: 1,
              rationale:
                'Tasks on the Critical Path have zero slack/float; any unmitigated delay on a Critical Path task directly pushes out the final project completion date day-for-day.',
            },
            {
              id: 'gslc-d1-l3-q2',
              question:
                'A SOC manager observes rising analyst burnout and declining investigation quality caused by 1,200 daily low-fidelity SIEM alerts. What is the MOST sustainable leadership intervention?',
              options: [
                'Mandate 14-hour daily shifts until the alert backlog clears',
                'Invest in detection engineering to tune out false positives, deploy SOAR automation for repetitive enrichment, and track alert signal-to-noise ratio',
                'Turn off the SIEM logging agents permanently on weekends',
                'Require analysts to close alerts in under 30 seconds regardless of accuracy',
              ],
              correctIndex: 1,
              rationale:
                'Alert fatigue is an engineering and process problem, not a work-ethic problem. Tuning high-noise rules, automating repetitive enrichment via SOAR, and measuring signal-to-noise quality restores both analyst wellbeing and detection precision.',
            },
          ],
          practicalDrill: {
            title: 'Zero-Burnout SOC & Critical-Path Rollout Plan',
            prompt:
              'Structure an enterprise EDR + SIEM deployment project plan alongside a 12-month SOC retention program.',
            steps: [
              'Draft a 6-item Work Breakdown Structure (WBS) and highlight the Critical Path dependencies (agent packaging -> pilot -> tuning -> production waves).',
              'Establish a formal Change Control rule rejecting mid-flight scope additions unless Schedule or Budget adjusts explicitly.',
              'Launch a weekly "Detection Tuning Friday" cutting false-positive alert volume by 50% and create a Principal Engineer IC track.',
            ],
            successCriteria:
              'Plan protects the Critical Path against Scope Creep and directly targets alert fatigue and dual-track talent retention.',
          },
          flashcards: [
            { front: 'What is the Critical Path in Project Management?', back: 'The longest dependent task sequence with zero float/slack, defining the minimum time required to finish the project.', tag: 'gslc-d1' },
            { front: 'What are the 3 constraints of the Project Management Iron Triangle?', back: 'Scope, Time (Schedule), and Cost (Resources)—changing one inevitably affects the others or Quality.', tag: 'gslc-d1' },
            { front: 'Why is a Dual-Track Career Ladder vital in cybersecurity?', back: 'It lets elite technical specialists advance to Principal/Distinguished pay and influence without forcing them into people management.', tag: 'gslc-d1' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: NETWORK, CLOUD & ENDPOINT ARCHITECTURE (25%)
    // =================================================================
    {
      id: 'gslc-d2',
      domainNumber: 2,
      title: 'Network, Cloud & Endpoint Architecture',
      examWeightPercent: 25,
      overview:
        'Gives security leaders sharp architectural literacy to direct technical teams credibly: modern Defense-in-Depth, Zero Trust & SASE networking, packet/flow telemetry, Cloud/Container/DevSecOps governance, and resilient Endpoint hardening & EDR/XDR.',
      lessons: [
        {
          id: 'gslc-d2-l1',
          title: 'Network Defense-in-Depth, Zero Trust Architecture & Traffic Visibility',
          estimatedMinutes: 45,
          summary:
            'Direct enterprise network modernization from brittle perimeter castles to Zero Trust micro-segmentation, full North-South + East-West visibility (NetFlow, Zeek, DNS telemetry), and encrypted TLS inspection trade-offs.',
          learningObjectives: [
            'Direct transitions from flat perimeter-based networks to Zero Trust Architecture (NIST SP 800-207) and micro-segmentation.',
            'Understand high-value network telemetry sources (NetFlow/IPFIX, DNS query logs, Zeek/Bro metadata, Full Packet Capture) and storage trade-offs.',
            'Balance TLS 1.3 outbound inspection (break-and-inspect proxy) against privacy laws, certificate pinning, and performance.',
          ],
          coreConcepts: [
            {
              heading: 'Defense-in-Depth, Segmentation & Assume-Breach Architecture',
              explanation:
                'A GIAC Security Leader thinks in "Assume Breach": attackers WILL eventually phish a user or exploit a public service—architecture determines whether they hit a dead end in 5 minutes or take over 10,000 endpoints in 3 hours! Enforce layered Defense-in-Depth across: (1) Perimeter & Edge (DDoS scrubbing, WAF, DMZ isolation, egress filtering blocking unauthorized outbound C2 ports); (2) Internal Segmentation (strict VLANs, Private VLANs, firewall zones isolating Crown Jewels, User Workstations, Guest Wi-Fi, IoT, and OT/ICS); and (3) Zero Trust Micro-Segmentation (identity-verified per-session host firewalls stopping lateral SMB/RDP/WinRM movement!).',
              mentalModel:
                'Prevention is ideal, but Detection and Containment are mandatory: block workstation-to-workstation lateral traffic (SMB 445 / RDP 3389) so one phished laptop can NEVER touch its neighbor!',
              formulaOrRule: 'Highest-ROI Lateral Movement Blocker = Block Workstation-to-Workstation East-West SMB/RDP/WinRM via Host Firewalls + Micro-Segmentation.',
            },
            {
              heading: 'Network Visibility Pyramid (Full PCAP vs. Zeek Metadata vs. NetFlow)',
              explanation:
                'Leaders must budget smartly for network forensics visibility without drowning storage budgets: (1) NetFlow / IPFIX — lightweight flow headers (Src IP, Dst IP, Port, Byte count, Timestamp; tiny storage, retained 6–12 months, great for spotting data exfiltration spikes & C2 beacons); (2) Protocol Metadata (Zeek / Suricata logs — extracts DNS queries, HTTP URLs, TLS SNI/JA3/JA4 fingerprints, SMB transfers at ~2% of PCAP size; massive detection bang-for-buck!); (3) Full Packet Capture (PCAP — every raw byte; highest investigative fidelity, massive storage cost, typically retained 7–30 days on rolling buffers at strategic chokepoints). Also enforce centralized internal DNS logging—almost every malware family relies on DNS for C2 or DGA lookups!',
              mentalModel:
                'NetFlow is your phone bill (who called whom and how long); Zeek is an executive summary of every conversation; Full PCAP is a verbatim audio recording of every word.',
              formulaOrRule: 'Visibility Efficiency: NetFlow (Long Retention) + DNS & Zeek Metadata (Highest Detection ROI) + Rolling Full PCAP (Deep Forensics at Chokepoints).',
            },
          ],
          realWorldScenario: {
            title: 'Halting Ransomware Spread Across 40 Branch Offices Using Egress & Host Segmentation',
            situation:
              'A phishing email compromises a branch receptionist laptop. Historically, a single compromised laptop cascaded via open SMB (port 445) across the entire corporate WAN within 20 minutes.',
            analysis:
              'Because the GSLC Security Leader had previously mandated two architectural rules—(1) host-based firewall policies denying workstation-to-workstation SMB/RDP/WinRM traffic, and (2) strict outbound DNS/HTTP proxy egress filtering—the attacker’s lateral scan failed instantly and triggered an immediate Zeek/EDR lateral-movement alert, isolating the single laptop in 4 minutes with zero spread.',
            takeaway:
              'Architectural defaults (host isolation + egress control + DNS logging) quietly defeat entire classes of intrusion automatically.',
          },
          examTraps: [
            'GSLC technical-leadership favorite: DNS logs are one of the highest-value, lowest-cost network detection sources—insist all endpoints use internal monitored DNS resolvers and block direct outbound UDP/TCP port 53 to the internet!',
            'Understand TLS inspection trade-offs: Decrypting outbound TLS at a corporate proxy catches hidden C2 malware, BUT requires privacy policy review (exempting employee banking/healthcare sites!) and breaks certificate-pinned apps.',
            'Egress filtering (controlling what leaves your network outbound!) is just as critical as ingress filtering—stopping reverse shells and raw data exfiltration!',
          ],
          keyTerms: [
            { term: 'Egress Filtering', definition: 'Restricting outbound traffic leaving an enterprise network strictly to authorized proxies, ports, and destinations to disrupt C2 and exfiltration.' },
            { term: 'NetFlow / IPFIX', definition: 'Network flow metadata summarizing source/destination IPs, ports, protocols, and byte volumes without storing full packet payloads.' },
            { term: 'Zeek (Network Security Monitor)', definition: 'Open-source passive network analyzer transforming wire traffic into structured protocol metadata logs (DNS, TLS, HTTP, SMB) for threat hunting.' },
            { term: 'Assume Breach', definition: 'Architectural security philosophy designing segmentation and telemetry assuming perimeter compromise is inevitable, minimizing blast radius.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d2-l1-q1',
              question:
                'A Security Director wants maximum threat-hunting visibility across 10 Gbps corporate internet gateways while staying within a moderate storage budget. Which telemetry combination delivers the HIGHEST analytical value per terabyte?',
              options: [
                'Retaining 3 years of uncompressed Full Packet Capture (PCAP) on all switch ports',
                'Combining structured protocol metadata (Zeek/DNS logs) and NetFlow/IPFIX with short-window rolling PCAP at key chokepoints',
                'Disabling DNS logging and relying only on firewall drop counts',
                'Printing weekly router ARP tables to PDF',
              ],
              correctIndex: 1,
              rationale:
                'Zeek protocol metadata and DNS logs capture ~90% of threat-hunting value (domains, TLS fingerprints, HTTP headers, lateral SMB) at a tiny fraction of full PCAP storage cost, complemented by long-retention NetFlow and rolling chokepoint PCAP.',
            },
            {
              id: 'gslc-d2-l1-q2',
              question:
                'Which single network/host architectural control is MOST effective at stopping ransomware from spreading rapidly from one compromised user workstation to hundreds of neighboring workstations?',
              options: [
                'Enabling ICMP ping responses on perimeter routers',
                'Enforcing host-based firewall micro-segmentation blocking direct workstation-to-workstation SMB, RDP, and WinRM traffic',
                'Changing the company’s public website TLS certificate',
                'Hiding the corporate Wi-Fi SSID',
              ],
              correctIndex: 1,
              rationale:
                'Workstations almost never need direct peer-to-peer administrative protocol access (SMB 445, RDP 3389, WinRM). Blocking workstation-to-workstation lateral traffic cleanly breaks automated ransomware propagation.',
            },
          ],
          practicalDrill: {
            title: 'Assume-Breach Network Visibility & Segmentation Audit',
            prompt:
              'Review your enterprise network architecture with the Network Engineering Lead.',
            steps: [
              'Verify strict egress filtering: block direct outbound SMB, RDP, SSH, and unauthorized port 53 DNS from user subnets.',
              'Mandate host-based firewall rules denying workstation-to-workstation lateral administration.',
              'Deploy centralized DNS logging + NetFlow (180-day retention) + Zeek metadata sensors at WAN/DMZ chokepoints.',
            ],
            successCriteria:
              'Audit stops lateral workstation spread, closes outbound C2 bypasses, and balances telemetry fidelity with storage budget.',
          },
          flashcards: [
            { front: 'Compare NetFlow vs. Zeek Metadata vs. Full PCAP.', back: 'NetFlow = connection summary headers (tiny, long retention); Zeek = structured app/DNS/TLS metadata (highest detection ROI); Full PCAP = complete raw bytes (deepest forensics, heaviest storage).', tag: 'gslc-d2' },
            { front: 'Why should enterprises block direct outbound port 53 from workstations to the internet?', back: 'To force all DNS queries through monitored internal resolvers, exposing malware C2 lookups and preventing DNS tunneling bypass.', tag: 'gslc-d2' },
            { front: 'What legal/ethical nuance must a leader manage before enabling outbound TLS decrypt/inspect proxies?', back: 'Privacy compliance (exempting sensitive personal categories like healthcare/banking) and explicit employee monitoring notification/policies.', tag: 'gslc-d2' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d2-l2',
          title: 'Cloud, Container & DevSecOps Security Leadership Oversight',
          estimatedMinutes: 45,
          summary:
            'Govern multi-cloud velocity without choking innovation by automating security guardrails in Landing Zones, Infrastructure as Code (IaC), container registries, and DevSecOps CI/CD pipelines.',
          learningObjectives: [
            'Architect Multi-Account Cloud Landing Zones using preventive guardrails (Organizations/SCPs, deny-by-default IAM, centralized immutable logging).',
            'Direct engineering teams to secure containers, Kubernetes control planes, and CI/CD pipelines via automated paved roads.',
            'Track leading DevSecOps governance KPIs (deployment velocity alongside mean-time-to-remediate pipeline findings and IaC drift rate).',
          ],
          coreConcepts: [
            {
              heading: 'Cloud Landing Zones & Guardrails Over Manual Ticket Gates',
              explanation:
                'If developers wait 3 weeks for a manual security ticket to spin up a cloud storage bucket, they will bypass security with a corporate credit card! World-class GSLC leaders govern cloud scale via Automated Paved Roads & Guardrails inside a Multi-Account Landing Zone: isolate Prod, Staging, Dev, Shared Services, and Security/Logging into separate cloud accounts (limiting blast radius!); enforce preventive Organization Service Control Policies (SCPs — e.g., impossible to disable CloudTrail, impossible to launch unapproved regions, impossible to create public S3 buckets!); and let developers self-service rapidly inside pre-hardened Terraform modules!',
              mentalModel:
                'Build a modern tollway with steel guardrails (Landing Zone + SCPs + hardened IaC modules) so developers drive at 100 mph safely instead of stopping every 2 miles for a manual tollbooth inspection.',
              formulaOrRule: 'Cloud Scale Governance = Multi-Account Blast-Radius Isolation + Preventive SCP Guardrails + Pre-Hardened IaC Paved Roads + CSPM Drift Alerts.',
            },
            {
              heading: 'Directing Container, Supply-Chain & CI/CD Security',
              explanation:
                'Modern breaches target the software factory itself (compromised CI/CD runners, poisoned npm/PyPI packages, leaked GitHub tokens, unpatched container base images). As a security leader, verify five non-negotiable engineering controls: (1) Signed commits, branch protection, and mandatory peer review on main repos; (2) Automated pre-commit secrets scanning + short-lived OIDC workload federation replacing static CI/CD API keys; (3) Curated internal container registry accepting ONLY scanned, signed minimal base images; (4) Automated SAST + SCA (SBOM) + IaC scanning integrated straight into developer PR comments; and (5) Hardened Kubernetes RBAC + admission policies preventing root/privileged containers.',
              mentalModel:
                'Securing production servers while leaving the CI/CD build server unguarded is like armoring the bank vault while handing burglars the keys to the mint printing the money.',
              formulaOrRule: 'CI/CD Factory Top 3 Controls: Zero Static Long-Lived Secrets (Use OIDC) + Signed Scanned Artifacts/SBOM + Least-Privilege Build Runners.',
            },
          ],
          realWorldScenario: {
            title: 'Stopping Cloud Misconfiguration Sprawl Without Slowing Product Releases',
            situation:
              'A fast-growing SaaS firm accumulated 280 critical cloud misconfigurations across 40 developer accounts. When security tried requiring manual ticket approval for every cloud resource change, deployment frequency dropped 70% and the CTO escalated to the CEO.',
            analysis:
              'Manual human approvals cannot scale to elastic cloud infrastructure. Partnering with Platform Engineering to build a Multi-Account Landing Zone with preventive SCP guardrails (blocking public buckets/unencrypted volumes at the API layer), offering pre-approved Terraform modules, and running automated Checkov/OPA checks in pull requests cut misconfigurations by 94% while RESTORING rapid daily releases!',
            takeaway:
              'In cloud and DevSecOps, automate preventive guardrails into the developer’s paved road so the easiest path is automatically the secure path.',
          },
          examTraps: [
            'GSLC leadership principle: NEVER answer "slow down Agile/DevOps by adding manual security sign-off gates to every sprint"—instead choose "embed automated SAST/SCA/IaC guardrails and paved-road templates directly into CI/CD"!',
            'Understand Multi-Account Isolation: placing Development, Production, and Centralized Security Logs inside ONE single cloud account creates catastrophic blast radius—ALWAYS separate into dedicated accounts/subscriptions!',
            'Static API keys stored inside CI/CD environment variables are prime breach targets—prefer ephemeral Workload Identity Federation (OIDC tokens).',
          ],
          keyTerms: [
            { term: 'Cloud Landing Zone', definition: 'Pre-configured, multi-account enterprise cloud foundation embedding baseline networking, IAM guardrails, centralized logging, and compliance policies.' },
            { term: 'Service Control Policies (SCPs)', definition: 'Organization-level preventive cloud guardrails defining maximum permitted API actions across member accounts (even restricting local account admins).' },
            { term: 'Paved Road (Golden Path)', definition: 'Pre-hardened, self-service IaC modules and CI/CD templates making the secure engineering workflow the fastest and easiest choice.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d2-l2-q1',
              question:
                'Developers deploying microservices to public cloud repeatedly misconfigure storage buckets as publicly readable despite training. What is the MOST scalable, friction-free leadership solution?',
              options: [
                'Require the CISO to manually review every single cloud API request via email',
                'Enforce organization-wide preventive cloud guardrails (SCPs / Policy-as-Code) blocking public buckets automatically while supplying hardened self-service IaC modules',
                'Ban all public cloud usage and move back to physical servers',
                'Audit buckets manually once every 12 months',
              ],
              correctIndex: 1,
              rationale:
                'Preventive organization-level guardrails paired with pre-hardened IaC paved roads eliminate human misconfiguration systematically at machine speed without bottlenecking engineering velocity.',
            },
            {
              id: 'gslc-d2-l2-q2',
              question:
                'Why should enterprise cloud architectures place Production workloads, Development sandboxes, and Centralized Security Audit Logs in SEPARATE cloud accounts rather than one shared account?',
              options: [
                'To increase monthly cloud licensing costs',
                'To enforce strict IAM and billing blast-radius isolation so a dev or prod compromise cannot tamper with immutable security logs or sibling environments',
                'Because public clouds only allow one database per account',
                'To bypass encryption-at-rest requirements',
              ],
              correctIndex: 1,
              rationale:
                'Multi-account isolation provides strong administrative and IAM containment boundaries, preventing compromised dev credentials from touching production and stopping compromised prod admins from erasing centralized security logs.',
            },
          ],
          practicalDrill: {
            title: 'Cloud Paved-Road & CI/CD Governance Scorecard',
            prompt:
              'Co-design a cloud security partnership charter with your VP of Platform Engineering.',
            steps: [
              'Establish 5 preventive Landing Zone guardrails (No public buckets, mandatory encryption, immutable centralized CloudTrail/Audit logs, root MFA, approved regions).',
              'Replace all static CI/CD deployment keys with ephemeral OIDC workload federation.',
              'Track two joint executive KPIs: Deployment Frequency (engineering velocity) alongside Critical IaC/SCA Drift Rate (security health).',
            ],
            successCriteria:
              'Scorecard aligns security with developer velocity, enforces multi-account isolation, and eliminates static CI/CD credentials.',
          },
          flashcards: [
            { front: 'What makes a "Paved Road" so effective for DevSecOps adoption?', back: 'It supplies pre-hardened, compliant IaC/CI-CD templates so doing the secure thing is simultaneously the fastest, easiest option for developers.', tag: 'gslc-d2' },
            { front: 'What is the superpower of Cloud Organization SCPs (Service Control Policies)?', back: 'They enforce hard organization-wide preventive guardrails (e.g., cannot disable audit logs or open public buckets) that even local account admins cannot override.', tag: 'gslc-d2' },
            { front: 'How should modern CI/CD pipelines authenticate to cloud environments instead of static API keys?', back: 'Short-lived, ephemeral Workload Identity Federation (OIDC) tokens scoped strictly per repository/branch.', tag: 'gslc-d2' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d2-l3',
          title: 'Endpoint Defense, Hardening Baselines, Allowlisting & EDR/XDR Oversight',
          estimatedMinutes: 40,
          summary:
            'Eliminate endpoint compromise vectors using CIS Critical Security Controls, removal of local admin privileges, Application Allowlisting, hardware-rooted trust (TPM/Secure Boot), and modern behavioral EDR/XDR.',
          learningObjectives: [
            'Apply the highest-impact CIS Controls for endpoints: Asset Inventory, Least Privilege (NO local admin!), Secure Configuration Baselines, and Automated Patching.',
            'Compare legacy signature-based Antivirus against modern behavioral Endpoint Detection and Response (EDR/XDR) and Application Allowlisting.',
            'Understand hardware-rooted endpoint trust (UEFI Secure Boot, TPM 2.0, BitLocker/FileVault Full-Disk Encryption) and MDM/MAM for mobile/BYOD.',
          ],
          coreConcepts: [
            {
              heading: 'Removing Local Admin Rights & Application Allowlisting',
              explanation:
                'Two foundational endpoint controls neutralize the vast majority of commodity malware and ransomware before EDR even fires: (1) Eliminating Standing Local Administrator Rights on standard user workstations (over 80% of critical Windows CVEs and credential-dumping attacks depend on local admin rights—use EPM/JIT elevation when legitimate installs occur!); and (2) Application Allowlisting (explicitly permitting ONLY cryptographically signed, approved executables/scripts to run—crushing unknown ransomware binaries and Living-off-the-Land abuse, especially high-impact on servers, kiosks, and OT hosts!).',
              mentalModel:
                'Giving every office worker permanent Local Admin rights is like letting every bank customer carry a master blowtorch inside the lobby "just in case they need to open a stuck drawer."',
              formulaOrRule: 'Endpoint High-ROI Pair: Zero Standing Local Admin + Application Allowlisting + Hardened CIS Benchmarks.',
            },
            {
              heading: 'Legacy AV vs. Behavioral EDR/XDR & Hardware Root of Trust',
              explanation:
                'Traditional signature Antivirus only stops yesterday’s known file hashes—failing completely against polymorphic malware, macro-less phishing, and "Living off the Land" (LoTL) attacks abusing built-in PowerShell/WMI tools! Modern Endpoint Detection and Response (EDR) continuously monitors process trees, memory injection, script execution, and registry tampering—allowing defenders to spot behavioral TTPs and isolate a host with one click; XDR correlates EDR with Identity, Email, Cloud, and Network telemetry. Beneath the OS, UEFI Secure Boot + Trusted Platform Module (TPM 2.0) verify firmware/bootloader cryptographic integrity before releasing full-disk encryption keys—blocking bootkits and offline drive theft.',
              mentalModel:
                'Legacy AV checks a printed list of banned license plates; EDR watches driving behavior inside the parking garage and stops a stolen car weaving toward the vault even with legitimate plates.',
              formulaOrRule: 'Fileless/LoTL Defense = Behavioral EDR/XDR + PowerShell Script-Block Logging + Constrained Language Mode + TPM/Secure Boot.',
            },
          ],
          realWorldScenario: {
            title: 'Defeating a Fileless PowerShell Intrusion via Least Privilege & EDR',
            situation:
              'An employee accidentally opened a weaponized invoice executing an obfuscated in-memory PowerShell payload attempting to dump LSASS memory credentials. Legacy AV missed it completely because no malicious `.exe` touched the disk.',
            analysis:
              'Because the GSLC leader had removed Local Admin rights across all workstations and deployed behavioral EDR with Credential Guard (VBS/TPM), the PowerShell payload lacked privileges to read LSASS memory, EDR instantly detected the anomalous Word-spawning-PowerShell process tree, terminated the process, and quarantined the laptop automatically.',
            takeaway:
              'Removing local admin rights + hardware-backed Credential Guard + behavioral EDR breaks modern fileless attack chains decisively.',
          },
          examTraps: [
            'GSLC / CIS Controls classic: What is ALWAYS CIS Control #1 and #2 before anything else? Control #1 = Inventory & Control of Enterprise Assets (hardware); Control #2 = Inventory & Control of Software Assets! You cannot defend what you haven’t inventoried.',
            'Understand BYOD management: MDM (Mobile Device Management) manages/wipes the entire device (often resisted by personal BYOD privacy); MAM (Mobile Application Management) containerizes and selectively wipes ONLY corporate apps/data on personal devices!',
            'Application Allowlisting is vastly stronger than Denylisting—particularly effective on static servers, POS terminals, and high-security workstations.',
          ],
          keyTerms: [
            { term: 'Application Allowlisting', definition: 'Preventive endpoint control permitting only explicitly approved, cryptographically signed executables and scripts to run.' },
            { term: 'EDR (Endpoint Detection & Response)', definition: 'Behavioral telemetry and active containment agent monitoring process execution, memory, and persistence to detect fileless and LoTL attacks.' },
            { term: 'Living off the Land (LoTL)', definition: 'Adversary technique abusing legitimate pre-installed OS tools (PowerShell, WMI, certutil) to evade signature antivirus detection.' },
            { term: 'MAM vs. MDM', definition: 'MDM controls the full mobile device; MAM secures and selectively wipes containerized corporate apps/data on personal BYOD endpoints.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d2-l3-q1',
              question:
                'A company wants to protect corporate email and documents accessed on employees’ personal smartphones (BYOD) WITHOUT gaining access to or risking accidental remote wiping of employees’ personal photos and messages. Which control BEST satisfies this goal?',
              options: [
                'Full-device MDM factory-wipe enforcement',
                'Mobile Application Management (MAM) with encrypted corporate app containerization and selective app-wipe',
                'Disabling screen locks on personal phones',
                'Requiring employees to share Apple/Google personal passwords with IT',
              ],
              correctIndex: 1,
              rationale:
                'MAM isolates corporate apps and data inside an encrypted container, preventing copy/paste leaks and enabling selective wipe of ONLY corporate data upon employee departure—respecting personal BYOD privacy.',
            },
            {
              id: 'gslc-d2-l3-q2',
              question:
                'Which endpoint security investment yields the HIGHEST reduction in privilege escalation, credential harvesting, and malware persistence across a 5,000-workstation fleet?',
              options: [
                'Allowing all employees permanent local administrator rights for convenience',
                'Removing standing local administrator privileges paired with behavioral EDR and CIS baseline hardening',
                'Installing three conflicting legacy signature antivirus products simultaneously',
                'Disabling automatic operating system updates',
              ],
              correctIndex: 1,
              rationale:
                'Eliminating standing local admin rights cuts off the vast majority of endpoint malware persistence and credential-dumping vectors, while behavioral EDR catches fileless/LoTL techniques that signature AV misses.',
            },
          ],
          practicalDrill: {
            title: 'Enterprise Endpoint Hardening Rollout (CIS Implementation Group 1–2)',
            prompt:
              'Design a phased 6-month plan to eliminate local admin rights and modernize endpoint security across 3,000 laptops.',
            steps: [
              'Establish automated Hardware & Software Asset Inventory (CIS Controls #1 & #2) flagging unmanaged shadow endpoints.',
              'Deploy behavioral EDR + TPM 2.0 Full-Disk Encryption + UEFI Secure Boot across 100% of managed endpoints.',
              'Roll out Endpoint Privilege Management (JIT elevation) by pilot waves (Finance -> Sales -> Engineering) to remove standing Local Admin without breaking workflows.',
              'Deploy MAM app containerization for personal BYOD mobile access.',
            ],
            successCriteria:
              'Plan starts with asset inventory, sequences least-privilege rollout smoothly with pilot waves, and uses MAM for BYOD privacy.',
          },
          flashcards: [
            { front: 'What are CIS Critical Security Controls #1 and #2?', back: '#1: Inventory and Control of Enterprise Assets (hardware); #2: Inventory and Control of Software Assets.', tag: 'gslc-d2' },
            { front: 'Why does behavioral EDR outperform legacy signature AV?', back: 'EDR monitors live process trees, memory injection, and script behavior—catching zero-days, fileless attacks, and Living-off-the-Land abuse that bypass static file hashes.', tag: 'gslc-d2' },
            { front: 'MDM vs. MAM for BYOD smartphones?', back: 'MDM controls and wipes the whole device (best for corporate-owned); MAM containerizes and selectively wipes ONLY corporate apps/data (best for personal BYOD).', tag: 'gslc-d2' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: VULNERABILITY, THREAT & INCIDENT COMMAND (25%)
    // =================================================================
    {
      id: 'gslc-d3',
      domainNumber: 3,
      title: 'Vulnerability, Threat & Incident Command',
      examWeightPercent: 25,
      overview:
        'Trains executive leaders to outsmart adversaries systematically: risk-based vulnerability prioritization (CVSS + EPSS + CISA KEV), Threat-Informed Defense using MITRE ATT&CK and Purple Teaming, and calm Executive Incident Command (PICERL/ICS) under crisis pressure.',
      lessons: [
        {
          id: 'gslc-d3-l1',
          title: 'Risk-Based Vulnerability & Exposure Management (CVSS, EPSS & CISA KEV)',
          estimatedMinutes: 40,
          summary:
            'Escape the "patch everything blindly" treadmill by adopting Risk-Based Vulnerability Management (RBVM) combining Asset Criticality, Internet Exposure, CISA KEV, EPSS exploitation probability, and Compensating Controls.',
          learningObjectives: [
            'Explain why patching purely by raw CVSS Base Score overwhelms IT teams and misses actively exploited "Medium/High" flaws.',
            'Combine CVSS + CISA KEV (Known Exploited Vulnerabilities) + EPSS (Exploit Prediction Scoring System) + Asset Context for razor-sharp remediation SLAs.',
            'Manage vulnerability remediation bottlenecks via Continuous Threat Exposure Management (CTEM) and documented Compensating Controls.',
          ],
          coreConcepts: [
            {
              heading: 'Moving Beyond Raw CVSS Base Scores (RBVM Triad)',
              explanation:
                'Over 35,000+ new CVEs publish every year—yet fewer than 5% are EVER exploited in the wild! A naive manager telling IT "patch every CVSS >= 7.0 in 7 days" buries ops teams under 10,000 non-exploited alerts while an actively exploited CVSS 7.5 VPN flaw stays open and gets ransomed! Mature GIAC leaders run Risk-Based Vulnerability Management (RBVM) prioritizing strictly by the intersection of FOUR signals: (1) Active Exploitation (CISA KEV catalog — patch IMMEDIATELY, 24–72 hours!); (2) Exploitation Likelihood (EPSS probability score over next 30 days); (3) Exposure Reachability (Internet-facing edge vs. air-gapped internal lab); and (4) Business Asset Criticality (Crown Jewel vs. disposable sandbox).',
              mentalModel:
                'CVSS tells you how sharp the knife is in a laboratory; CISA KEV + EPSS + Internet Exposure tell you whether a burglar is literally holding that knife outside your front door tonight!',
              formulaOrRule: 'Patch Priority #1 = Internet-Facing + Crown Jewel + CISA KEV / High EPSS (NOT blindly sorting by raw CVSS Base Score!).',
            },
            {
              heading: 'Continuous Threat Exposure Management (CTEM) & Remediation SLAs',
              explanation:
                'Vulnerability scanning is merely discovery—remediation is what reduces risk! Set clear, tiered risk-based SLAs agreed jointly with IT Operations (e.g., Actively Exploited Edge/KEV: 48–72 hours; Critical External: 7 days; Critical Internal: 14–30 days; High: 30–60 days). When an urgent patch breaks a legacy system, invoke formal Exception Governance with Virtual Patching / network isolation rather than letting SLA clocks quietly rot in red.',
              mentalModel:
                'Scanning without joint IT Operations remediation SLAs is like weighing yourself every morning and celebrating that you own a very accurate scale.',
              formulaOrRule: 'Effective VM Lifecycle: Discover -> Contextualize (KEV/EPSS/Asset) -> Prioritize -> Remediate/Virtual-Patch -> Verify Re-Scan.',
            },
          ],
          realWorldScenario: {
            title: 'Eliminating a 90,000-CVE Backlog Through CISA KEV + EPSS Triage',
            situation:
              'An enterprise vulnerability scanner reported 92,000 open "High/Critical" CVEs. IT Operations gave up trying to triage the massive spreadsheet and missed patching an actively exploited edge appliance CVE (CVSS 7.8) listed on CISA KEV.',
            analysis:
              'Raw CVSS overwhelmed ops teams with theoretical risk. Re-scoring the backlog using CISA KEV + EPSS > 0.5 + External Attack Surface context narrowed immediate urgent priorities from 92,000 down to 147 genuinely dangerous exposures—enabling IT to clear 100% of active external threats in 10 days.',
            takeaway:
              'Prioritize ruthlessly on exploitability and business exposure so finite engineering capacity neutralizes real adversary paths first.',
          },
          examTraps: [
            'GSLC classic: CVSS Base Score measures ONLY technical severity in isolation—it does NOT measure business criticality, compensating controls, or real-world active exploitation!',
            'Understand CISA KEV (Known Exploited Vulnerabilities — confirmed active attacks right now) vs. EPSS (statistical prediction of exploitation likelihood in the next 30 days).',
            'Always run AUTHENTICATED (credentialed) vulnerability scans whenever possible to eliminate false positives and spot missing local OS/library patches accurately.',
          ],
          keyTerms: [
            { term: 'CISA KEV', definition: 'Known Exploited Vulnerabilities catalog—authoritative list of CVEs confirmed to be actively exploited by threat actors in the wild.' },
            { term: 'EPSS', definition: 'Exploit Prediction Scoring System—data-driven model estimating the probability (0–100%) that a CVE will be exploited in the wild within the next 30 days.' },
            { term: 'RBVM', definition: 'Risk-Based Vulnerability Management—prioritizing remediation using exploitability intel, exposure reachability, and business asset criticality.' },
            { term: 'CTEM', definition: 'Continuous Threat Exposure Management—proactive 5-stage program (Scoping, Discovery, Prioritization, Validation, Mobilization) validating real attack paths.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d3-l1-q1',
              question:
                'An IT Operations team can patch only ONE vulnerability tonight. Which of the following four findings should a GIAC-trained Security Leader prioritize FIRST?',
              options: [
                'CVSS 9.8 theoretical flaw on an air-gapped offline test server with zero known exploit code',
                'CVSS 7.5 flaw on an internet-facing VPN gateway listed on CISA KEV with active ransomware exploitation reported today',
                'CVSS 8.1 flaw on a decommissioned spare laptop sitting in an IT closet',
                'CVSS 9.0 flaw on an internal test sandbox with EPSS score 0.002',
              ],
              correctIndex: 1,
              rationale:
                'Active real-world exploitation (CISA KEV) on an internet-facing perimeter gateway poses immediate existential breach risk, vastly outweighing higher theoretical CVSS base scores on isolated or non-exploited systems.',
            },
            {
              id: 'gslc-d3-l1-q2',
              question:
                'What is the PRIMARY weakness of prioritizing enterprise patching solely by raw CVSS Base Scores?',
              options: [
                'CVSS Base Scores are too difficult to calculate numerically',
                'CVSS Base Scores ignore real-world active exploitation, network exposure, compensating controls, and business asset criticality',
                'CVSS only applies to cloud SaaS applications',
                'CVSS scores update every 15 minutes causing dashboard flicker',
              ],
              correctIndex: 1,
              rationale:
                'CVSS Base Scores measure intrinsic technical severity in a vacuum; effective leadership layers exploitation intelligence (KEV/EPSS), exposure reachability, and business criticality atop CVSS.',
            },
          ],
          practicalDrill: {
            title: 'Risk-Based Patching SLA Charter (KEV/EPSS Tiering)',
            prompt:
              'Draft a joint Security + IT Operations Vulnerability Remediation SLA Policy.',
            steps: [
              'Tier 0 (Emergency — 48–72h): Any internet-facing CISA KEV or actively exploited zero-day (or immediate Virtual Patch).',
              'Tier 1 (Critical — 7–14d): High EPSS (>= 0.2) or Critical on Tier-1 Crown Jewels.',
              'Tier 2 (Standard — 30–60d): Non-exploited High/Medium internal exposures.',
              'Require verified credentialed re-scanning to close every SLA ticket.',
            ],
            successCriteria:
              'Charter focuses finite ops bandwidth on KEV/EPSS/External threats first and pairs patching with verified re-scans.',
          },
          flashcards: [
            { front: 'Compare CVSS vs. EPSS vs. CISA KEV.', back: 'CVSS = intrinsic technical severity; EPSS = predicted probability of exploitation in next 30 days; CISA KEV = confirmed active real-world exploitation.', tag: 'gslc-d3' },
            { front: 'What 4 factors combine in Risk-Based Vulnerability Management (RBVM)?', back: 'Active/Predicted Exploitation (KEV/EPSS), Internet Exposure/Reachability, Business Asset Criticality, and Existing Compensating Controls.', tag: 'gslc-d3' },
            { front: 'What are the 5 stages of Gartner CTEM?', back: 'Scoping, Discovery, Prioritization, Validation, and Mobilization.', tag: 'gslc-d3' },
          ],
          sourceRefs: [
            'my_documents/GIAC (GSLC) Gold Certification.pdf',
            'my_documents/cyber-exposure-management-webinar-v10_971820.pdf',
          ],
        },
        {
          id: 'gslc-d3-l2',
          title: 'Threat Intelligence, MITRE ATT&CK & Threat-Informed Defense (Purple Teaming)',
          estimatedMinutes: 45,
          summary:
            'Operationalize Cyber Threat Intelligence (Strategic, Operational, Tactical), apply the Pyramid of Pain and Cyber Kill Chain / MITRE ATT&CK, and maximize defense ROI through collaborative Purple Teaming.',
          learningObjectives: [
            'Distinguish Strategic, Operational, and Tactical Cyber Threat Intelligence (CTI) by audience and shelf-life.',
            'Apply David Bianco’s Pyramid of Pain to focus detection investments on adversary TTPs (hard to change) rather than ephemeral hashes/IPs (trivial to change).',
            'Direct Threat-Informed Defense using MITRE ATT&CK coverage heatmaps and collaborative Purple Team exercises.',
          ],
          coreConcepts: [
            {
              heading: 'Cyber Threat Intelligence Tiers & The Pyramid of Pain',
              explanation:
                'Threat intelligence must drive DECISIONS—not just collect dusty IOC lists! Match intel tier to audience: (1) Strategic CTI (non-technical geopolitical/industry trends and threat-actor business motives -> for Board/CISO capital planning); (2) Operational CTI (specific adversary campaign TTPs, timing, and infrastructure -> for Threat Hunters & IR Leads); (3) Tactical CTI (technical IOCs like hashes, IPs, domains -> for automated SIEM/EDR blocking). David Bianco’s Pyramid of Pain explains why blocking hashes (bottom) is "Trivial" for attackers to evade (recompiling changes the hash in 1 second!), IP addresses are "Easy", Domains are "Simple"—whereas detecting Adversary TTPs (Tactics, Techniques, and Procedures at the peak of the Pyramid!) is "TOUGH", forcing attackers to rebuild their entire playbook!',
              mentalModel:
                'Blocking an attacker’s IP address is like banning a bank robber’s rental car license plate; detecting their TTPs (MITRE ATT&CK behavior) catches them no matter which car they rent.',
              formulaOrRule: 'Pyramid of Pain (Bottom to Top): Hash Values (Trivial) -> IPs -> Domains -> Network/Host Artifacts -> Tools -> TTPs (Tough — Highest Defense ROI!).',
            },
            {
              heading: 'MITRE ATT&CK & Collaborative Purple Teaming',
              explanation:
                'MITRE ATT&CK is the global knowledge base of real-world adversary Tactics (the "WHY" — e.g., Initial Access, Credential Access, Lateral Movement, Exfiltration) and Techniques (the "HOW"). Security leaders map defensive telemetry against ATT&CK techniques used specifically by threat groups targeting their industry (e.g., FIN7/Scattered Spider for retail/finance) to expose blind spots objectively. Rather than running adversarial Red-vs.-Blue exercises where Red Team gloats over a PDF report 3 weeks later, Purple Teaming pairs offensive testers and SOC defenders SIDE-BY-SIDE in real time: execute an ATT&CK technique -> verify whether EDR/SIEM detected it -> tune detection rule immediately -> re-test until green!',
              mentalModel:
                'Red Teaming is a surprise final exam; Purple Teaming is an Olympic training scrimmage where offense and defense watch game film together after every single play to level up immediately.',
              formulaOrRule: 'Fastest Detection Maturity ROI = Threat-Informed MITRE ATT&CK Prioritization + Collaborative Purple Team Tuning Loops.',
            },
          ],
          realWorldScenario: {
            title: 'Upgrading a Reactive SOC to Threat-Informed Purple Teaming',
            situation:
              'A financial firm spent $120,000/yr buying commercial IOC threat feeds blocking millions of stale IP addresses while a stealthy adversary bypassed every IP block using legitimate cloud admin tools and Kerberoasting.',
            analysis:
              'Focusing solely at the bottom of the Pyramid of Pain (IPs/hashes) misses behavior-driven intrusions. Shifting focus to Strategic CTI (identifying top 3 threat groups targeting banking), mapping their exact MITRE ATT&CK TTPs, and running quarterly 2-day Purple Team sprints closed 19 critical SIEM/EDR detection gaps in 6 months.',
            takeaway:
              'Invest detection engineering at the top of the Pyramid of Pain (TTPs) and validate controls continuously with Purple Teaming.',
          },
          examTraps: [
            'Know the exact Pyramid of Pain order from bottom (easiest for attacker to change) to top (hardest): Hash Values -> IP Addresses -> Domain Names -> Network/Host Artifacts -> Tools -> TTPs!',
            'Do NOT buy expensive raw IOC feeds unless your SOC has clear Intelligence Requirements (PIRs) and automated ingestion/expiration workflows—stale IPs only generate false positives!',
            'Understand Red vs. Blue vs. Purple: Red = adversarial attack simulation testing detection/response blindly; Blue = defenders; Purple = collaborative real-time joint exercise directly improving Blue detection.',
          ],
          keyTerms: [
            { term: 'Pyramid of Pain', definition: 'Model ranking adversary indicators from easiest to change (Hashes/IPs) to hardest (TTPs), guiding defenders to invest in behavioral detection.' },
            { term: 'MITRE ATT&CK', definition: 'Structured matrix cataloging real-world adversary Tactics, Techniques, and Procedures across the intrusion lifecycle.' },
            { term: 'Purple Teaming', definition: 'Collaborative security exercise pairing offensive operators and SOC defenders in real time to test, observe, and immediately upgrade detections.' },
            { term: 'Priority Intelligence Requirements (PIRs)', definition: 'Executive-defined threat questions driving focused, decision-oriented Cyber Threat Intelligence collection.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d3-l2-q1',
              question:
                'According to David Bianco’s Pyramid of Pain, detecting and disrupting which category imposes the GREATEST cost and operational difficulty on a sophisticated adversary?',
              options: [
                'File MD5/SHA-256 hash values',
                'Command-and-control IP addresses',
                'Tactics, Techniques, and Procedures (TTPs)',
                'Newly registered disposable domain names',
              ],
              correctIndex: 2,
              rationale:
                'Hashes, IPs, and domains sit near the bottom of the Pyramid and are trivially rotated by attackers in seconds. Disrupting TTPs at the top forces attackers to abandon learned behaviors and engineer entirely new attack methods.',
            },
            {
              id: 'gslc-d3-l2-q2',
              question:
                'A CISO wants to rapidly verify and improve SOC detection coverage against the exact techniques used by ransomware groups targeting healthcare. Which exercise model delivers the FASTEST direct improvement to detection rules?',
              options: [
                'Unannounced zero-knowledge Black-Box Red Team once every three years',
                'Collaborative Purple Team exercises emulating relevant MITRE ATT&CK techniques side-by-side with SOC detection engineers',
                'Subscribing to five additional uncurated IP blocklists',
                'Running an unauthenticated external port scan only',
              ],
              correctIndex: 1,
              rationale:
                'Purple Teaming pairs attack emulation directly with Blue Team telemetry inspection and live detection-rule engineering, rapidly validating and closing ATT&CK visibility blind spots.',
            },
          ],
          practicalDrill: {
            title: 'Threat-Informed MITRE ATT&CK & Purple Team Sprint Plan',
            prompt:
              'Design a 1-quarter Threat-Informed Defense sprint for your security operations team.',
            steps: [
              'Draft 3 executive Priority Intelligence Requirements (PIRs) targeting threat actors active in your industry sector.',
              'Select 6 high-frequency ATT&CK techniques used by those actors (e.g., Valid Accounts, Kerberoasting, Ingress Tool Transfer, Data Staged).',
              'Execute a 2-day Purple Team exercise testing each technique, recording Prevented / Alerted / Logged / Blind status, and shipping tuned detections within 5 days.',
            ],
            successCriteria:
              'Plan starts from PIRs, focuses on TTPs at the top of the Pyramid of Pain, and produces verified closed-loop detection improvements.',
          },
          flashcards: [
            { front: 'List the 6 layers of the Pyramid of Pain from bottom to top.', back: '1) Hash Values, 2) IP Addresses, 3) Domain Names, 4) Network/Host Artifacts, 5) Tools, 6) TTPs (Peak).', tag: 'gslc-d3' },
            { front: 'Strategic vs. Operational vs. Tactical Threat Intelligence?', back: 'Strategic = long-term business/geopolitical risk (Board/CISO); Operational = campaign TTPs/intent (IR/Hunters); Tactical = technical IOCs/signatures (SIEM/EDR).', tag: 'gslc-d3' },
            { front: 'What is the core difference between Red Teaming and Purple Teaming?', back: 'Red Teaming simulates a covert adversary blindly testing full defensive readiness; Purple Teaming is open real-time collaboration between offense and defense to rapidly build and verify detections.', tag: 'gslc-d3' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d3-l3',
          title: 'Executive Incident Command (PICERL & ICS), Crisis Comms & SOC Maturity',
          estimatedMinutes: 45,
          summary:
            'Command major cyber crises calmly using SANS PICERL and the Incident Command System (ICS), separate technical investigation from executive crisis management, and scale resilient 24/7 SOC models.',
          learningObjectives: [
            'Apply the exact 6-step SANS Incident Response framework (PICERL: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned).',
            'Implement Incident Command System (ICS) roles (Incident Commander, Operations, Planning, Logistics, Communications/Legal Liaison) so technical leads stay focused without executive interference.',
            'Evaluate 24/7 SOC operating models (In-House, Co-Managed/Hybrid MDR, Fully Outsourced MSSP) against staffing, cost, and maturity realities.',
          ],
          coreConcepts: [
            {
              heading: 'SANS PICERL & Incident Command System (ICS) Leadership',
              explanation:
                'SANS/GIAC standardizes Incident Response around PICERL: (1) Preparation (playbooks, jump bags, out-of-band comms, retainers, tabletops — the single highest-leverage phase!); (2) Identification (confirm true incident vs. false positive, determine initial scope); (3) Containment (short-term stop-the-bleeding + forensic preservation + long-term staging); (4) Eradication (remove malware, persistence, and root cause); (5) Recovery (rebuild clean, validate integrity, monitor closely); (6) Lessons Learned (blameless after-action report within 1–2 weeks). During a severe multi-day crisis, adopt the Incident Command System (ICS): appoint ONE Incident Commander (IC) orchestrating structured pods—Technical Operations Lead (runs hands-on containment/forensics UNINTERRUPTED!), Executive/Board Liaison (Shields the technical team from CEO/Board "status check" interruptions every 10 minutes!), Legal/Privacy Counsel, and Corporate Communications—enforcing mandatory shift handoffs every 8–12 hours so exhausted responders don’t make catastrophic mistakes!',
              mentalModel:
                'A great CISO acts as a heat-shield during a crisis: absorbing Board/CEO/Legal questions calmly on the executive bridge so elite engineers can hunt and contain uninterrupted on the technical bridge.',
              formulaOrRule: 'SANS IR Order = P-I-C-E-R-L. Crisis Leadership Rule: Separate Executive Crisis Bridge from Technical Ops Bridge + Enforce Shift Rotation!',
            },
            {
              heading: 'Scaling 24/7 SOC Operations (Build vs. Hybrid MDR/Co-Managed vs. MSSP)',
              explanation:
                'Running a true 24/7/365 in-house SOC requires a mathematical minimum of ~8–12 dedicated analysts just to cover 3 shifts, weekends, vacations, sick days, and attrition (typically $1.5M–$2.5M+/yr fully loaded!). Most mid-sized organizations cannot sustain a healthy in-house 24/7 SOC without massive burnout. Smart GSLC leaders evaluate a Hybrid / Co-Managed MDR model: outsource 24/7 Tier-1/Tier-2 alert triage and overnight eyes-on-glass to a specialist MDR partner while keeping institutional context, Tier-3 threat hunting, architecture, and incident command authority IN-HOUSE!',
              mentalModel:
                'Trying to staff a 24/7 SOC with 3 analysts is mathematically impossible—it guarantees missed 3 AM ransomware alerts and 100% turnover inside 6 months.',
              formulaOrRule: '24/7 In-House SOC Math: Minimum ~8–12 FTEs needed for sustainable coverage. Below that scale -> Choose Hybrid Co-Managed MDR.',
            },
          ],
          realWorldScenario: {
            title: 'Commanding a Friday-Night Ransomware Crisis Without Responder Collapse',
            situation:
              'At 8:00 PM Friday, ransomware hits 150 servers. Executives begin dialing individual SOC engineers directly demanding live updates every 15 minutes, and engineers have been awake 22 straight hours making risky Active Directory errors.',
            analysis:
              'Unstructured ad-hoc crisis response burns out responders and triggers self-inflicted recovery errors. Activating Incident Command (ICS) immediately splits operations into two bridges: the CISO leads the Executive/Legal/PR Bridge issuing structured 2-hour updates, while a designated Technical Ops Lead directs containment uninterrupted—and Logistics enforces mandatory 10-hour shift rotations paired with the pre-retainer IR firm.',
            takeaway:
              'Calm structure, shielded engineering focus, and mandatory rest rotations separate disciplined crisis command from organizational chaos.',
          },
          examTraps: [
            'Know the exact SANS acronym PICERL: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned!',
            'Classic GSLC leadership trap: Should the CISO personally sit on the keyboard analyzing malware memory dumps during a major corporate breach? NO! The CISO leads Executive Crisis Coordination, shields responders, aligns Legal/PR/Board materiality, and ensures Logistics/rotations—delegating hands-on forensics to technical specialists!',
            'Always enforce shift rotations during multi-day cyber incidents—sleep-deprived responders cause catastrophic misconfigurations and missed indicators.',
          ],
          keyTerms: [
            { term: 'PICERL', definition: 'SANS 6-phase Incident Response methodology: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned.' },
            { term: 'Incident Command System (ICS)', definition: 'Standardized crisis management hierarchy separating Incident Command, Technical Ops, Planning, Logistics, and Executive/Legal Liaison.' },
            { term: 'Hybrid / Co-Managed MDR', definition: 'Operating model combining outsourced 24/7 eyes-on-glass monitoring/triage with internal institutional knowledge and incident command.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d3-l3-q1',
              question:
                'During hour 18 of a critical ransomware incident, multiple business executives keep messaging the lead forensic engineer directly on chat asking when systems will return. What is the CISO’s BEST leadership action?',
              options: [
                'Tell the forensic engineer to pause containment and write individualized replies to every executive',
                'Establish an Incident Command structure separating an Executive Briefing Bridge (led by the CISO on a predictable cadence) from the Technical Bridge so responders work uninterrupted',
                'Cut off all communication with executive leadership until the incident ends next week',
                'Take over the forensic workstation personally while leaving executives unbriefed',
              ],
              correctIndex: 1,
              rationale:
                'ICS crisis leadership establishes a clear executive liaison cadence (e.g., structured briefings every 2 hours) that satisfies Board/C-suite visibility while shielding technical engineers from constant distractions.',
            },
            {
              id: 'gslc-d3-l3-q2',
              question:
                'A mid-sized enterprise with a 4-person IT security team wants true 24/7/365 threat monitoring and rapid overnight containment without burning out staff. Which SOC model is MOST realistic and cost-effective?',
              options: [
                'Put the 4 internal staff on rotating 24/7 on-call shifts indefinitely',
                'Adopt a Hybrid / Co-Managed MDR service for 24/7 eyes-on-glass monitoring while retaining strategic context, escalation authority, and architecture in-house',
                'Monitor alerts only between 9 AM and 5 PM Monday through Friday',
                'Disable overnight network access for global customers',
              ],
              correctIndex: 1,
              rationale:
                'Sustaining true 24/7/365 coverage in-house requires at least 8–12 FTEs to account for shifts, weekends, PTO, and training. A Hybrid Co-Managed MDR gives immediate 24/7 resilience sustainably while keeping ownership internal.',
            },
          ],
          practicalDrill: {
            title: 'ICS Crisis Bridge & 24/7 SOC Operating Model Plan',
            prompt:
              'Design a crisis command playbook and right-sized SOC staffing blueprint for a 2,500-employee enterprise.',
            steps: [
              'Map all 6 SANS PICERL phases with explicit entry/exit checklists and out-of-band bridge tooling.',
              'Define ICS roles (Incident Commander, Technical Ops Lead, Legal Counsel, PR Lead, Logistics/Shift Scheduler) enforcing 8–10 hour max shifts.',
              'Build a 3-year SOC staffing business case comparing 10-FTE In-House 24/7 TCO vs. Hybrid Co-Managed MDR TCO.',
            ],
            successCriteria:
              'Plan cleanly isolates Technical vs. Executive bridges, mandates responder shift rest, and proves 24/7 SOC FTE math realistically.',
          },
          flashcards: [
            { front: 'Spell out SANS PICERL in exact order.', back: 'Preparation -> Identification -> Containment -> Eradication -> Recovery -> Lessons Learned.', tag: 'gslc-d3' },
            { front: 'Approximately how many FTEs are required to staff a sustainable 24/7/365 in-house SOC without burnout?', back: 'Roughly 8–12 FTEs minimum (accounting for 3 daily shifts, weekends, vacations, sick leave, and training).', tag: 'gslc-d3' },
            { front: 'What is the CISO’s primary duty during an active Sev-1 cyber crisis?', back: 'Lead executive crisis alignment (CEO/Board/Legal/PR), shield technical responders from interruption, authorize major business containment calls, and enforce shift rotations.', tag: 'gslc-d3' },
          ],
          sourceRefs: [
            'my_documents/GIAC (GSLC) Gold Certification.pdf',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: CRYPTOGRAPHY, IAM & GOVERNANCE (25%)
    // =================================================================
    {
      id: 'gslc-d4',
      domainNumber: 4,
      title: 'Cryptography, IAM & Governance',
      examWeightPercent: 25,
      overview:
        'Unites executive technical governance over Enterprise Cryptography & PKI lifecycle, Identity/Active Directory Tiering & PAM architecture, scalable Security Policy frameworks, regulatory/vendor compliance, and Boardroom risk mastery.',
      lessons: [
        {
          id: 'gslc-d4-l1',
          title: 'Enterprise Cryptography Governance, PKI Lifecycle & Post-Quantum Planning',
          estimatedMinutes: 40,
          summary:
            'Prevent silent certificate outages and weak cipher drift through automated Certificate Lifecycle Management (ACME/PKI), strong cryptographic standards, HSM governance, and Crypto-Agility for Post-Quantum readiness.',
          learningObjectives: [
            'Establish an Enterprise Cryptographic Standard mandating vetted algorithms (AES-256-GCM, SHA-256/3, ECC/RSA-3072+, TLS 1.3, Argon2id for passwords) and forbidding deprecated primitives.',
            'Eliminate self-inflicted outages from expired TLS certificates via automated Certificate Lifecycle Management (CLM / ACME) and hardened offline Root CAs.',
            'Prepare the enterprise for Post-Quantum Cryptography (PQC) via Cryptographic Inventory (CBOM) and Crypto-Agility.',
          ],
          coreConcepts: [
            {
              heading: 'Enterprise Crypto Standards & Password Hashing Governance',
              explanation:
                'Security leaders do not code math libraries—they enforce strict Cryptographic Standards preventing engineering teams from inventing custom encryption ("Never roll your own crypto!" — Kerckhoffs’s Principle) or deploying broken legacy algorithms (DES, 3DES, RC4, MD5, SHA-1, AES-ECB, TLS 1.0/1.1). Mandate FIPS-validated libraries using AES-256-GCM, SHA-256/SHA-3, TLS 1.3 with PFS, and dedicated memory-hard salted password-hashing algorithms (Argon2id, bcrypt, or PBKDF2—NEVER raw SHA-256 for user passwords, because GPUs brute-force fast hashes at billions per second!).',
              mentalModel:
                'Fast hashes (SHA-256) are great for verifying huge file integrity; SLOW memory-hard salted hashes (Argon2id/bcrypt) are mandatory for passwords so offline GPU cracking grinds to a halt.',
              formulaOrRule: 'File Integrity = SHA-256/SHA-3 | Password Storage = Salted Slow Memory-Hard Hash (Argon2id/bcrypt) | Bulk Crypto = AES-256-GCM.',
            },
            {
              heading: 'PKI Governance, Automated CLM & Post-Quantum Crypto-Agility',
              explanation:
                'Expired TLS certificates are a top cause of embarrassing enterprise outages—and as public browser CA validity shrinks toward 47–90 days, manual spreadsheet tracking is completely dead! Direct teams to deploy Automated Certificate Lifecycle Management (CLM / ACME) paired with an air-gapped Offline Root CA (HSM-protected) issuing to online Subordinate/Issuing CAs. Simultaneously, defend against "Harvest Now, Decrypt Later" quantum adversaries by building a Cryptographic Bill of Materials (CBOM) locating every RSA/ECC dependency today and designing Crypto-Agility (ability to swap algorithms via config without rewriting apps) to transition smoothly to NIST Post-Quantum standards (ML-KEM / ML-DSA).',
              mentalModel:
                'Crypto-Agility is installing standardized electrical outlets so you can swap from an incandescent bulb (RSA) to an LED (Post-Quantum ML-KEM) without tearing open the walls.',
              formulaOrRule: 'PKI Resilience = Offline Root CA + Automated CLM/ACME. Quantum Readiness Step 1 = Cryptographic Discovery/Inventory (CBOM) + Crypto-Agility.',
            },
          ],
          realWorldScenario: {
            title: 'Ending Certificate Outages & Fixing Weak Password Storage After an Audit',
            situation:
              'An expired wildcard TLS certificate took down a healthcare portal for 5 hours, and a code audit simultaneously discovered user passwords stored as unsalted SHA-1 hashes.',
            analysis:
              'Wildcard certificates create massive shared blast radius and spreadsheet tracking guarantees missed renewals. Replacing wildcards with automated short-lived ACME/CLM certificates eliminates renewal outages and shrinks compromise scope; migrating passwords seamlessly to salted Argon2id stops rainbow-table and GPU cracking.',
            takeaway:
              'Automate certificate lifecycles, ban wildcard certs on high-risk systems, enforce Argon2id/bcrypt for passwords, and inventory crypto now for Post-Quantum readiness.',
          },
          examTraps: [
            'GSLC classic: NEVER store user passwords using raw/unsalted MD5, SHA-1, or even plain SHA-256! Always mandate salted, computationally slow key-stretching algorithms (Argon2id, scrypt, bcrypt, PBKDF2).',
            'Understand "Harvest Now, Decrypt Later" (HNDL): adversaries record sensitive encrypted traffic today intending to decrypt it once cryptographically relevant quantum computers arrive—prioritize PQC migration first for data requiring 10+ years of confidentiality!',
            'Why keep an Enterprise Root CA strictly OFFLINE? Because compromising the Root CA’s private key destroys trust across every certificate in the entire enterprise!',
          ],
          keyTerms: [
            { term: 'Crypto-Agility', definition: 'Architectural capability to rapidly replace or upgrade cryptographic algorithms and protocols without disruptive system rewrites.' },
            { term: 'Key Stretching (Argon2id / bcrypt)', definition: 'Deliberately slow, memory-hard salted hashing designed to thwart high-speed offline GPU password cracking.' },
            { term: 'Offline Root CA', definition: 'Top-level enterprise Certificate Authority kept physically air-gapped and powered off except to sign Subordinate CA certificates and CRLs.' },
            { term: 'Harvest Now, Decrypt Later', definition: 'Adversary strategy intercepting long-lived encrypted data today to decrypt later using future quantum computing capabilities.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d4-l1-q1',
              question:
                'During an application security review, a Security Manager learns developers are storing customer login passwords hashed with unsalted SHA-256. What should the manager direct engineering to migrate toward?',
              options: [
                'Encrypting passwords with AES-128-ECB',
                'Salted, slow, memory-hard password hashing such as Argon2id or bcrypt',
                'Base64 encoding concatenated with MD5',
                'Plaintext storage inside an encrypted S3 bucket',
              ],
              correctIndex: 1,
              rationale:
                'Plain SHA-256 is engineered for extreme speed, letting GPU rigs test billions of guesses per second, and lacking unique per-user salts permits rainbow-table/identical-hash exposure. Argon2id/bcrypt with unique salts resists offline cracking.',
            },
            {
              id: 'gslc-d4-l1-q2',
              question:
                'What is the FIRST practical leadership step an enterprise should take today to prepare for Post-Quantum Cryptography (PQC) migration?',
              options: [
                'Immediately replace AES-256 symmetric storage encryption with custom unpublished math',
                'Build a comprehensive Cryptographic Inventory (CBOM) discovering where RSA/ECC keys, certificates, and long-lived sensitive data reside across the enterprise',
                'Turn off TLS 1.3 across public web servers',
                'Wait until a quantum breach occurs before evaluating cryptography',
              ],
              correctIndex: 1,
              rationale:
                'NIST and NSA PQC migration guidance starts with Cryptographic Discovery (CBOM) to locate vulnerable asymmetric algorithms and prioritize long-shelf-life confidential data vulnerable to Harvest Now, Decrypt Later.',
            },
          ],
          practicalDrill: {
            title: 'Enterprise Cryptographic Standard & PQC Readiness Roadmap',
            prompt:
              'Publish a concise 1-page Enterprise Cryptographic Standard for all engineering and infrastructure teams.',
            steps: [
              'Approve explicit standards: AES-256-GCM (rest), TLS 1.3 PFS (transit), SHA-256/SHA-3 (integrity), Argon2id/bcrypt (passwords), HSM-backed Offline Root CA.',
              'Mandate automated CLM/ACME enrollment phasing out all manual certificate tracking and wildcard prod certs.',
              'Launch a 6-month CBOM discovery scan identifying long-lived data streams for Phase 1 NIST PQC (ML-KEM/ML-DSA) Crypto-Agility upgrades.',
            ],
            successCriteria:
              'Standard forbids weak/fast password hashes, eliminates manual cert outages via ACME/CLM, and initiates CBOM PQC discovery.',
          },
          flashcards: [
            { front: 'Why is raw SHA-256 insecure for storing user passwords?', back: 'SHA-256 is extremely fast (allowing billions of GPU guesses/sec) and unsalted hashes expose duplicate passwords; use salted Argon2id or bcrypt instead.', tag: 'gslc-d4' },
            { front: 'Why is an enterprise Root CA kept strictly offline?', back: 'To protect the ultimate root-of-trust private key from online network compromise; day-to-day issuance is delegated to Subordinate/Issuing CAs.', tag: 'gslc-d4' },
            { front: 'What is the #1 first step in Post-Quantum Cryptography (PQC) preparation?', back: 'Cryptographic Discovery / building a CBOM to find every RSA/ECC dependency and prioritizing long-retention confidential data.', tag: 'gslc-d4' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d4-l2',
          title: 'Enterprise Identity Architecture: Active Directory Tiering, PAM & Phishing-Resistant MFA',
          estimatedMinutes: 45,
          summary:
            'Protect the crown jewel of modern enterprise attacks—Identity—by enforcing Active Directory Tiering (Tier 0/1/2), Privileged Access Workstations (PAWs), phishing-resistant FIDO2 MFA, and Service Account governance.',
          learningObjectives: [
            'Architect Active Directory / Identity Tiering (Tier 0 Identity/Control Plane, Tier 1 Enterprise Servers, Tier 2 Workstations) to stop credential-theft escalation.',
            'Compare MFA phishing resistance levels: SMS/Push (phishable!) vs. FIDO2/WebAuthn hardware keys & certificates (phishing-resistant!).',
            'Eliminate hidden identity blind spots: Non-Human/Service Accounts, Kerberoasting, over-privileged OAuth apps, and stale admin groups.',
          ],
          coreConcepts: [
            {
              heading: 'Identity Is the New Perimeter: Active Directory Tiering & PAWs',
              explanation:
                'In over 80% of major enterprise ransomware breaches, attackers do not hack firewalls—they log in using stolen credentials and climb straight to Domain Admin / Cloud Global Admin! Active Directory / Enterprise Identity Tiering breaks credential-theft ladders via strict control boundaries: Tier 0 (Domain Controllers, Entra ID/IdP Global Admins, PKI, PAM, Hypervisor/Backup Admins — the Kingdom Keys!); Tier 1 (Member Servers, Databases, ERP); Tier 2 (User Workstations & Help Desk). Cardinal Rule: A Tier 0 admin NEVER logs into a Tier 1 server or Tier 2 laptop (leaving hashes in compromised workstation RAM!), and administers Tier 0 EXCLUSIVELY from a hardened Privileged Access Workstation (PAW) with zero internet browsing or corporate email!',
              mentalModel:
                'Never check your email or browse news from the nuclear-launch console: keep Tier 0 Identity admins strictly isolated on hardened PAWs so one phished workstation can NEVER steal Domain Admin credentials.',
              formulaOrRule: 'Identity Tiering Golden Law: Higher-tier credentials NEVER log onto lower-tier machines. Administer Tier 0 ONLY from hardened PAWs.',
            },
            {
              heading: 'Phishing-Resistant MFA (FIDO2) & Non-Human Identity Governance',
              explanation:
                'Not all MFA is equal! Adversary-in-the-Middle (AiTM) reverse-proxy phishing kits effortlessly steal passwords, SMS codes, TOTP 6-digit codes, AND spam victims with MFA Push Fatigue until they tap "Approve"! Only cryptographically origin-bound MFA—FIDO2 / WebAuthn hardware keys (Passkeys) or Smart Cards (PIV/CAC)—is truly PHISHING-RESISTANT because the cryptographic token verifies the genuine domain origin automatically and refuses to sign a lookalike phishing domain! Finally, govern Non-Human Identities (service accounts, API keys, OAuth consent tokens), which typically outnumber human employees 10-to-1 yet rarely get MFA or rotation—enforce Group Managed Service Accounts (gMSAs), workload federation, and disable unreviewed user OAuth app consent.',
              mentalModel:
                'SMS and push-notification MFA are a bouncer who shouts your name out loud; FIDO2 cryptographically checks the building’s real deed so a fake pop-up phishing club can NEVER trick your key into unlocking.',
              formulaOrRule: 'Strongest MFA = FIDO2/WebAuthn or Smart Card (Phishing-Resistant) > Number-Matching Push > TOTP > SMS (Weakest/SIM-Swap Vulnerable).',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Scattered-Spider Style MFA-Fatigue & Helpdesk Takeover',
            situation:
              'Attackers phished a senior IT admin via a reverse-proxy login site capturing both password and 6-digit TOTP code, then pivoted into the cloud identity provider and deleted enterprise backups.',
            analysis:
              'TOTP codes and standard push approvals do NOT defeat Adversary-in-the-Middle (AiTM) proxies or social-engineered helpdesk resets. Mandating FIDO2 hardware keys for ALL Tier-0/privileged admins and executive staff, enforcing strict out-of-band identity proofing for IT Helpdesk MFA resets, and isolating backup-admin accounts outside corporate Active Directory closes the entire attack path.',
            takeaway:
              'Protect Tier-0 admins and Backup Consoles with phishing-resistant FIDO2 MFA, PAWs, and hardened helpdesk reset verification.',
          },
          examTraps: [
            'GSLC high-yield modern trap: Is SMS or standard TOTP/Push MFA phishing-resistant? NO! Only origin-bound cryptographic authenticators (FIDO2/WebAuthn Passkeys or PKI Smart Cards) defeat Adversary-in-the-Middle (AiTM) phishing!',
            'Do NOT overlook Backup Administrators in Tier 0! If ransomware attackers compromise corporate Active Directory and your backup server shares AD credentials, they wipe your backups before encrypting production—ALWAYS isolate backup authentication out-of-band!',
            'Understand Kerberoasting: attackers request service tickets for service accounts with weak passwords and crack them offline—mitigate via gMSAs (automated 120-char rotating passwords) or 25+ char vaulted passwords.',
          ],
          keyTerms: [
            { term: 'Tier 0 Identity Assets', definition: 'Highest-privilege control-plane assets (Domain Controllers, Cloud IdP, PKI, PAM, Backup Systems) whose compromise grants full enterprise takeover.' },
            { term: 'Privileged Access Workstation (PAW)', definition: 'Dedicated, strictly hardened admin workstation stripped of web browsing and email used solely to manage Tier-0 infrastructure.' },
            { term: 'Phishing-Resistant MFA (FIDO2)', definition: 'Origin-bound public-key cryptographic authentication verifying genuine site domain automatically, defeating AiTM phishing and push fatigue.' },
            { term: 'gMSA (Group Managed Service Account)', definition: 'Active Directory non-human service account featuring automatic OS-managed long cryptographic password rotation defeating Kerberoasting.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d4-l2-q1',
              question:
                'Sophisticated threat actors are using Adversary-in-the-Middle (AiTM) reverse-proxy phishing pages to steal session cookies and bypass both SMS and 6-digit TOTP codes. Which MFA upgrade defeats AiTM phishing natively?',
              options: [
                'Switching from SMS to email one-time codes',
                'Mandating FIDO2 / WebAuthn phishing-resistant hardware keys or PKI smart cards',
                'Increasing password rotation frequency to every 30 days',
                'Adding three security questions at login',
              ],
              correctIndex: 1,
              rationale:
                'FIDO2/WebAuthn cryptographically binds authentication to the authentic TLS origin domain—refusing to authenticate to lookalike AiTM reverse-proxy phishing domains.',
            },
            {
              id: 'gslc-d4-l2-q2',
              question:
                'Under the Active Directory / Enterprise Identity Tiering model, why MUST a Domain Admin (Tier 0) NEVER log directly into a standard employee’s infected laptop (Tier 2) to troubleshoot an issue?',
              options: [
                'Tier 2 laptops do not support Ethernet networking',
                'Logging in exposes Tier-0 credential material in the compromised Tier-2 workstation’s memory, enabling instant credential theft and full domain takeover',
                'Active Directory forbids Domain Admins from troubleshooting printers',
                'Tier-0 accounts cannot unlock Windows screens',
              ],
              correctIndex: 1,
              rationale:
                'Credential theft tools harvest hashes and Kerberos tickets from compromised workstation memory. Strictly preventing higher-tier credentials from ever touching lower-tier endpoints stops upward privilege escalation.',
            },
          ],
          practicalDrill: {
            title: 'Tier-0 Identity Lockdown & Non-Human Account Audit',
            prompt:
              'Design a 90-day Identity Resilience sprint stopping Active Directory & Cloud IdP takeover.',
            steps: [
              'Inventory all Tier-0 assets (AD, Entra/Okta, PKI, PAM, Hypervisors, Immutable Backups) and issue dual FIDO2 keys + dedicated PAWs to every Tier-0 admin.',
              'Decouple enterprise backup console logins completely from corporate Active Directory.',
              'Migrate legacy static SPN service accounts to gMSAs / workload federation and lock down Helpdesk MFA reset verification with video/manager approval.',
            ],
            successCriteria:
              'Sprint enforces Tier-0 isolation, eliminates AiTM-phishable admin MFA, isolates backup authentication, and addresses non-human service accounts.',
          },
          flashcards: [
            { front: 'Why are SMS, TOTP, and standard Push MFA NOT phishing-resistant?', back: 'Adversary-in-the-Middle (AiTM) phishing proxies intercept codes/sessions in real time, and push notifications suffer from MFA Fatigue; FIDO2/WebAuthn binds cryptographically to the genuine domain.', tag: 'gslc-d4' },
            { front: 'What is the Golden Rule of Identity Tiering (Tier 0 / 1 / 2)?', back: 'Higher-tier credentials NEVER log onto lower-tier machines; administer Tier 0 exclusively from hardened Privileged Access Workstations (PAWs).', tag: 'gslc-d4' },
            { front: 'Why must enterprise backup consoles NEVER rely solely on corporate Active Directory authentication?', back: 'If attackers compromise AD Domain Admin, shared AD auth lets them log straight into the backup server and delete all recovery points prior to launching ransomware.', tag: 'gslc-d4' },
          ],
          sourceRefs: ['my_documents/GIAC (GSLC) Gold Certification.pdf'],
        },
        {
          id: 'gslc-d4-l3',
          title: 'Policy Architecture, Regulatory Governance, Vendor Risk & Boardroom Mastery',
          estimatedMinutes: 45,
          summary:
            'Synthesize security leadership into an enforceable, concise Policy Architecture, align multi-framework compliance efficiently ("Test Once, Comply Many"), govern vendor ecosystems, and command Boardroom cyber risk conversations.',
          learningObjectives: [
            'Write concise, readable, enforceable security policies mapped to a Unified Control Framework ("Map Once, Comply Many" across NIST CSF 2.0, ISO 27001, SOC 2, PCI, HIPAA).',
            'Lead high-impact Boardroom briefings translating technical security posture into fiduciary risk, resilience readiness, and business enablement.',
            'Balance compliance ("floor") versus genuine security resilience ("ceiling") so audits strengthen real defense rather than creating checkbox theater.',
          ],
          coreConcepts: [
            {
              heading: 'Compliance Is the Floor, Not the Ceiling & Unified Control Mapping',
              explanation:
                'Passing a PCI DSS, HIPAA, or SOC 2 audit proves you met a minimum legal/industry baseline on audit day—NOT that you can stop a determined ransomware crew tomorrow ("Compliant != Secure!"). Yet compliance STILL matters deeply for legal survival and enterprise sales! Smart GSLC leaders eliminate redundant audit exhaustion by adopting a Unified Control Framework (e.g., anchored in NIST CSF 2.0 or SCF) mapping ONE internal control set simultaneously to ISO 27001, SOC 2, GDPR, HIPAA, and PCI DSS ("Build Once, Collect Evidence Once, Comply Many")—freeing team energy for genuine threat-informed security!',
              mentalModel:
                'Compliance is passing your car’s annual emissions/brakes inspection (the legal floor); Security Resilience is defensive driving, airbags, and crash-tested engineering (surviving an actual highway collision).',
              formulaOrRule: 'Compliance = Minimum Legal Floor (Check-the-Box fails against real attackers). Unified Control Framework = Test Once, Satisfy Many Audits.',
            },
            {
              heading: 'Commanding the Boardroom as an Executive Risk Leader',
              explanation:
                'The culmination of GIAC GSLC mastery is stepping into the Boardroom as a calm, credible peer to the CFO, General Counsel, and CEO. Follow four executive rules: (1) Zero Jargon / Zero FUD — never say "CVSS 9.8 Kerberoasting on VLAN 42"; say "Eliminated an identity flaw that could halt global billing for 4 days ($12M exposure)"; (2) Speak in Risk Appetite, Peer Benchmarks & Business Outcomes; (3) Own Bad News Transparently Early — never surprise directors with hidden "watermelon" red risks; and (4) Rehearse Board-level materiality and disclosure decisions via annual executive cyber tabletops!',
              mentalModel:
                'Directors don’t hire a CISO to teach them TCP packets—they rely on you to tell them the unvarnished truth about business survival, capital efficiency, and strategic resilience.',
              formulaOrRule: 'Boardroom Presence = Unvarnished Truth + Business/Dollar Impact + Appetite Alignment + Actionable Decisions (Zero FUD, Zero Jargon).',
            },
          ],
          realWorldScenario: {
            title: 'Eliminating Audit Fatigue While Winning a $40M Enterprise Deal',
            situation:
              'A rapidly expanding B2B SaaS firm spent 40% of its security team’s year answering overlapping questionnaires for SOC 2, ISO 27001, GDPR, and 60 enterprise bank customers—leaving zero time for Purple Teaming or IAM hardening.',
            analysis:
              'By mapping a single Unified Control Framework anchored in NIST CSF 2.0 + automated continuous evidence collection (GRC automation) and publishing a clean Trust Center with SOC 2 Type II + CAIQ, the GSLC leader cut audit overhead by 60%, closed a $40M banking contract 3 weeks early, and reinvested saved hours straight into FIDO2 and Purple Teaming.',
            takeaway:
              'Turn compliance from an exhausting manual tax into an automated Trust Engine that accelerates revenue AND funds real threat defense.',
          },
          examTraps: [
            'GSLC classic philosophy: "If an organization achieves 100% PCI DSS / ISO 27001 compliance, is it secure?" -> NEVER! Compliance is a baseline minimum floor, not a guarantee of security against modern adversaries.',
            'Write policies SHORT, clear, technology-agnostic, and ENFORCEABLE—a 150-page policy nobody reads and nobody enforces actually INCREASES legal liability (proving negligence when breached!).',
            'Always link Governance & Policies directly to Executive Sponsorship and periodic annual review (plus review after major business/regulatory shifts).',
          ],
          keyTerms: [
            { term: 'Unified Control Framework', definition: 'Harmonized internal control catalog mapped once across multiple regulations (NIST CSF, ISO 27001, SOC 2, PCI) to eliminate redundant audit work.' },
            { term: 'Compliant != Secure', definition: 'Core security leadership axiom recognizing that meeting baseline regulatory checkboxes does not equate to resilience against active adversaries.' },
            { term: 'Trust Center', definition: 'Customer-facing assurance portal sharing vetted security attestations (SOC 2, ISO 27001, CSA CAIQ) to accelerate enterprise sales safely.' },
          ],
          conceptChecks: [
            {
              id: 'gslc-d4-l3-q1',
              question:
                'A rapidly scaling SaaS security team is losing half its engineering hours responding separately to SOC 2, ISO 27001, HIPAA, and customer vendor audits. What is the BEST strategic governance upgrade?',
              options: [
                'Stop responding to customer security questionnaires',
                'Implement a Unified Control Framework ("Build Once, Comply Many") paired with continuous evidence automation and a customer Trust Center',
                'Hire 15 temporary staff to copy-paste spreadsheets manually every quarter',
                'Drop SOC 2 certification entirely',
              ],
              correctIndex: 1,
              rationale:
                'Harmonizing controls once under a Unified Control Framework mapped to all target regulations eliminates redundant audit effort while accelerating sales trust.',
            },
            {
              id: 'gslc-d4-l3-q2',
              question:
                'Why can maintaining an overly strict, unenforceable 120-page corporate security policy that management routinely ignores actually HARM the organization legally?',
              options: [
                'Long PDFs consume excessive cloud storage costs',
                'Failing to follow your own documented mandatory policies creates direct documented evidence of negligence during breach litigation or regulatory enforcement',
                'Policies cannot be updated once published',
                'Employees only read policies printed in color',
              ],
              correctIndex: 1,
              rationale:
                'Regulators and plaintiffs routinely hold organizations strictly to the written promises in their own policies; unenforceable "shelf policies" become damaging evidence of failure to exercise Due Care.',
            },
          ],
          practicalDrill: {
            title: 'Unified Compliance Map & Executive Boardroom Pitch',
            prompt:
              'Unify 3 overlapping frameworks and rehearse a 5-minute Boardroom cyber risk briefing.',
            steps: [
              'Map 10 core security controls (MFA, Patching, Logging, Encryption, Backups, IR, TPRM, Training, SDLC, Access Reviews) once across NIST CSF 2.0, SOC 2, and ISO 27001.',
              'Prune corporate policies down to short, enforceable 2–3 page documents backed by technical standards.',
              'Deliver a 5-minute jargon-free BLUF Board briefing summarizing business risk exposure, resilience proof, and next-year strategic budget ask.',
            ],
            successCriteria:
              'Unified map eliminates duplicate testing, policies stay concise/enforceable, and the Board briefing contains zero technical jargon or FUD.',
          },
          flashcards: [
            { front: 'Explain the leadership maxim "Compliance is the floor, not the ceiling."', back: 'Regulatory compliance establishes a minimum legal baseline, whereas real security requires continuous threat-informed defense and resilience beyond checkboxes.', tag: 'gslc-d4' },
            { front: 'What is the "Build Once, Comply Many" strategy?', back: 'Maintaining one Unified Control Framework mapped simultaneously across NIST CSF, ISO 27001, SOC 2, HIPAA, and PCI DSS so evidence is collected once.', tag: 'gslc-d4' },
            { front: 'Why are unenforceable "shelf policies" legally dangerous?', back: 'If a breach occurs, violating your own written mandatory policies serves as documented proof of negligence / lack of Due Care.', tag: 'gslc-d4' },
          ],
          sourceRefs: [
            'my_documents/GIAC (GSLC) Gold Certification.pdf',
            'my_documents/𝗥𝗲𝗽𝗼𝗿𝘁𝗶𝗻𝗴 𝗖𝘆𝗯𝗲𝗿𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗥𝗶𝘀𝗸 𝘁𝗼 𝘁𝗵𝗲 𝗕𝗼𝗮𝗿𝗱 𝗼𝗳 𝗗𝗶𝗿𝗲𝗰𝘁𝗼𝗿𝘀.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'First 90 Days as CISO — Crisis-to-Resilience Executive Turnaround',
    scenario:
      'Helios Global Energy (3,500 employees across corporate IT, cloud SaaS, and regional power distribution) hires you as its inaugural CISO after a near-miss intrusion. Your initial discovery reveals: (1) 4 exhausted SOC analysts trying to run 24/7 shifts buried under 1,400 daily false-positive alerts; (2) 65,000 unprioritized CVEs sitting untouched by IT Ops; (3) Domain Admins logging directly into user laptops using SMS MFA, with backups joined to corporate Active Directory; (4) developers bypassing manual cloud review queues creating public buckets; (5) passwords stored with unsalted SHA-256 and manual spreadsheet TLS renewals; and (6) an anxious Board demanding a clear 90-day recovery plan in a 15-minute meeting next week.',
    tasks: [
      'Architect your 30-60-90 Day Leadership Roadmap, team leadership styles, Security Champions guild, and Zero-Based shelfware budget justification (Domain 1).',
      'Design an Assume-Breach technical defense plan covering workstation host isolation, DNS/Zeek visibility, Multi-Account Cloud Landing Zone + SCP paved roads, local admin removal + EDR, and MAM for BYOD (Domain 2).',
      'Replace the 65,000-CVE dump with CISA KEV/EPSS RBVM SLAs, launch MITRE ATT&CK Purple Teaming, stand up Hybrid Co-Managed 24/7 MDR to end SOC burnout, and institute ICS/PICERL crisis command (Domain 3).',
      'Lock down Tier-0 Identity (FIDO2, PAWs, isolated backup auth, gMSAs), upgrade cryptography (Argon2id, ACME CLM, CBOM for PQC), unify compliance frameworks, and script a 5-minute BLUF Boardroom presentation (Domain 4).',
    ],
    modelSolution:
      '1) Leadership & 90-Day Plan (D1): Days 1–30 listen to business/plant leaders, stabilize existential risks, and apply Situational Leadership (Delegating to senior architects, Coaching mid-level engineers) with Psychological Safety and a Dual-Track Career Ladder; Days 31–60 cut unused shelfware via Zero-Based Budgeting and launch an embedded Security Champions guild; Days 61–90 lock multi-year roadmap with Critical Path project discipline preventing Scope Creep. 2) Technical Architecture (D2): Enforce host firewalls blocking workstation-to-workstation SMB/RDP, deploy monitored internal DNS + NetFlow + Zeek telemetry, isolate cloud workloads into a Multi-Account Landing Zone with preventive SCPs and pre-hardened Terraform paved roads, strip standing Local Admin via JIT EPM + behavioral EDR, and secure BYOD via containerized MAM. 3) Threat, Vuln & Incident Command (D3): Collapse 65,000 CVEs immediately using CISA KEV + EPSS + Internet Exposure SLAs (48–72h for active edge KEVs), pivot from stale IP feeds to MITRE ATT&CK TTPs validated via quarterly Purple Team sprints, partner with a Hybrid Co-Managed 24/7 MDR to eliminate 4-analyst burnout while keeping Tier-3 context/command internal, and formalize PICERL + ICS Crisis Command separating Executive and Technical bridges with 10-hour shift rotations. 4) Crypto, IAM & Boardroom (D4): Enforce Tier-0 Active Directory isolation with FIDO2 hardware keys + PAWs + out-of-band backup authentication + gMSAs; migrate passwords to salted Argon2id, automate TLS renewals via ACME/CLM, launch CBOM discovery for Post-Quantum Crypto-Agility; unify audits via NIST CSF 2.0 ("Build Once, Comply Many"); and deliver a crisp 5-minute jargon-free BLUF Board briefing leading with financial risk exposure, KRI tolerance status, resilience verification, and clear capital decisions.',
  },
  examStrategy: {
    examFormat:
      'GIAC GSLC is a 115-question, 3-hour (180-minute), OPEN-BOOK proctored exam with a 70% passing score. Because it is open-book, GIAC tests practical judgment, technical-leadership accuracy, and applied terminology—NOT rote guessing, and speed with a crisp custom alphabetical Index is your superpower!',
    timeManagementPlan:
      'Pace at ~1.4 minutes per question (Question 40 by Minute 55, Question 80 by Minute 110, finishing Question 115 by Minute 160, leaving 20 minutes to revisit skipped items—remember GIAC allows skipping a limited block of questions to review later, though answered items lock!). Use your printed Index only to verify nuanced technical or framework details in < 30 seconds; rely on mastery for 70%+ of items.',
    mindsetRules: [
      'GSLC sits at the unique intersection of Executive Leadership AND Real Technical Fluency—never choose a technically wrong answer just because it sounds "managerial," and never pick a micromanaging sysadmin fix over scalable leadership/architecture!',
      'Build Your Own Alphabetical GIAC Open-Book Index: Sort key terms, frameworks (PICERL, Pyramid of Pain, CIS Controls, NIST 800-207, COBIT, Situational Leadership, FIDO2, Kerberos, Argon2id, Zeek, EPSS/KEV), and color-coded tabs—building the index IS half the studying!',
      'Lead with Business Value & Paved Roads: favor automated DevSecOps guardrails over manual bottlenecks, positive culture/Champions over phishing shaming, and BLUF business metrics over technical jargon.',
      'Assume Breach & Prioritize Ruthlessly: block lateral workstation spread, log DNS/Zeek, patch CISA KEV/EPSS edge assets first, protect Tier-0/backups with FIDO2/PAWs, and separate Executive vs. Technical crisis bridges.',
    ],
    finalWeekChecklist: [
      'Finalize, print, and tab your alphabetical GIAC GSLC Index (targeting < 20 seconds to look up any term, protocol, or leadership framework).',
      'Take both timed 115-question practice exams strictly under open-book exam conditions using ONLY your printed materials and index, refining any missing index entries afterward.',
      'Drill high-yield leadership + technical overlaps: Situational Leadership, 30-60-90 Plan, BLUF, Critical Path, CIS Controls #1/#2, Zeek/NetFlow, SCPs, CISA KEV/EPSS, Pyramid of Pain, PICERL/ICS, Argon2id, Tier-0/FIDO2, Unified Control Framework.',
      'Pack printed binder + index cleanly 24 hours ahead and get 8 full hours of sleep for sharp 3-hour open-book navigation.',
    ],
  },
};
