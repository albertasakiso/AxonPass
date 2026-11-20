/* ===================================================================
   ANOXPASS — ISC2 CISSP End-to-End Certification Course (2024 CBK)
   Tier 4 (Specialist) | All 8 Official Domains | Zero-to-Exam-Ready
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const CISSP_COURSE: CertificationCourse = {
  certId: 'cissp',
  certCode: 'CISSP',
  title: 'ISC2 Certified Information Systems Security Professional',
  provider: 'ISC2',
  tier: 4,
  tagline: 'Master all 8 ISC2 CBK domains with the executive "Think Like a Manager" decision framework.',
  estimatedTotalHours: 140,
  passingScore: '700 / 1000 (CAT Adaptive)',
  domains: [
    // =================================================================
    // DOMAIN 1: SECURITY AND RISK MANAGEMENT (16%)
    // =================================================================
    {
      id: 'cissp-d1',
      domainNumber: 1,
      title: 'Security and Risk Management',
      examWeightPercent: 16,
      overview:
        'The highest-weighted CISSP domain (16%) and the philosophical core of the entire exam. Covers the CIA triad, ISC2 Code of Ethics, governance documentation hierarchy, quantitative/qualitative risk management, BCP, legal/regulatory compliance, and supply chain risk.',
      lessons: [
        {
          id: 'cissp-d1-l1',
          title: 'CIA Triad, ISC2 Code of Ethics & Security Governance Hierarchy',
          estimatedMinutes: 50,
          summary:
            'Internalize the foundational priorities of CISSP decision-making: human life and safety first, the four ISC2 Ethics Canons in strict order, Due Care vs. Due Diligence, and Policy-Standard-Procedure hierarchy.',
          learningObjectives: [
            'Apply the CIA Triad plus DAD (Disclosure, Alteration, Destruction) and AAA/Non-Repudiation to business scenarios.',
            'Rank all four ISC2 Code of Ethics Canons in exact precedence order to resolve ethical dilemmas.',
            'Differentiate Policies, Standards, Baselines, Guidelines, and Procedures by mandatory vs. advisory nature.',
            'Distinguish Due Diligence (knowing/assessing risk) from Due Care (doing/implementing prudent controls).',
          ],
          coreConcepts: [
            {
              heading: 'The 4 ISC2 Code of Ethics Canons (Strict Priority Order)',
              explanation:
                'Every CISSP candidate agrees to uphold four mandatory Canons in strict descending priority: (1) Protect society, the common good, necessary public trust and confidence, and the infrastructure; (2) Act honorably, honestly, justly, responsibly, and legally; (3) Provide diligent and competent service to principals; (4) Advance and protect the profession. When two canons conflict—for example, a client (Canon 3) orders you to conceal a dangerous medical-device flaw endangering patients (Canon 1)—Canon 1 ALWAYS prevails.',
              mentalModel:
                'Mnemonic "S-A-P-A": Society first, Act honorably second, Principals (employers/clients) third, Advance the profession fourth. Human life and safety ALWAYS beat profits or contracts.',
              formulaOrRule: 'CISSP Ethics Precedence: Canon 1 (Society/Safety) > Canon 2 (Law/Honor) > Canon 3 (Principals/Employer) > Canon 4 (Profession).',
            },
            {
              heading: 'Governance Documentation Hierarchy',
              explanation:
                'Security governance flows top-down from board strategy to daily operations through five distinct documents: Policies (high-level, mandatory management intent—technology-agnostic), Standards (mandatory specific requirements, e.g., "use AES-256"), Baselines (mandatory minimum secure configuration benchmarks for a system), Procedures (mandatory step-by-step tactical instructions to execute a task), and Guidelines (NON-mandatory recommended best practices providing flexibility when no strict standard applies).',
              mentalModel:
                'Policy = "All houses must be locked" (high-level rule); Standard = "Use Grade-1 deadbolts"; Baseline = "Windows 11 CIS Level 1 image"; Procedure = "Step 1: Turn key clockwise"; Guideline = "Consider adding a porch light" (optional).',
              formulaOrRule: 'Mandatory: Policy, Standard, Baseline, Procedure. Advisory/Optional ONLY: Guideline.',
            },
            {
              heading: 'Due Diligence vs. Due Care & Security Control Categories',
              explanation:
                'Due Diligence ("Do Detect / Do Research") is the investigative work of understanding risks, auditing vendors, and keeping policies current. Due Care ("Do Correct / Do Act") is exercising the prudence a reasonable person would take by actually implementing and operating controls. Controls are classified by implementation type (Administrative/Management, Technical/Logical, Physical) and functional role (Preventive, Detective, Corrective, Deterrent, Recovery, Compensating, Directive).',
              mentalModel:
                'Due Diligence is researching crash safety ratings before buying a car; Due Care is buckling your seatbelt and changing worn brake pads.',
              formulaOrRule: 'Due Diligence = Research & Assess (Know); Due Care = Implement & Maintain (Do).',
            },
          ],
          realWorldScenario: {
            title: 'Resolving an Ethical Conflict Over a Vulnerable Hospital Infusion Pump',
            situation:
              'As a senior security advisor for a medical device manufacturer, you discover a critical flaw allowing unauthorized modification of insulin dosage over hospital Wi-Fi. The VP of Sales insists on shipping the product on schedule and patching quietly six months later to hit quarterly earnings targets.',
            analysis:
              'Under ISC2 Canon 1 ("Protect society, the common good..."), patient life and safety override loyalty to employer earnings (Canon 3). As a CISSP risk advisor, you escalate immediately through executive governance, legal, and product safety committees—refusing to sign off on shipment until the safety risk is mitigated.',
            takeaway:
              'On CISSP, ANY answer option that protects human life or physical safety wins instantly over availability, confidentiality, or financial savings.',
          },
          examTraps: [
            'Guidelines are NEVER mandatory—if a question asks for a flexible recommendation rather than a strict rule, pick Guideline; if mandatory technical detail is needed, pick Standard.',
            'Non-repudiation is NOT achieved by symmetric encryption (because both parties share the same secret key)—it requires Asymmetric Digital Signatures (signed with sender’s private key).',
            'Senior management (CEO/Board) ALWAYS holds ultimate liability and accountability for organizational security—the CISO advises and executes, never absorbs ultimate board accountability.',
            'A Compensating Control is an alternate control deployed when the primary/required control is infeasible due to legacy hardware or business constraints.',
          ],
          keyTerms: [
            { term: 'Due Care', definition: 'Prudent, reasonable actions taken to implement, maintain, and operate security controls to protect organizational assets.' },
            { term: 'Due Diligence', definition: 'Ongoing research, assessment, auditing, and monitoring performed to understand risks and verify controls work effectively.' },
            { term: 'Compensating Control', definition: 'Alternative safeguard implemented to achieve equivalent risk reduction when a standard primary control cannot be deployed.' },
            { term: 'Guideline', definition: 'Non-mandatory, recommended best-practice guidance offering flexibility where rigid standards do not apply.' },
            { term: 'Strategic Plan', definition: 'Long-term (3–5+ year) executive direction aligned with corporate mission, contrasting with Tactical (1–2 yr) and Operational (<1 yr) plans.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d1-l1-q1',
              question:
                'A legacy manufacturing controller cannot support AES-256 encryption mandated by corporate cryptography standards without halting factory production. Security places the device inside an air-gapped VLAN with strict physical locks and continuous passive IDS monitoring. What type of control has been applied?',
              options: [
                'Deterrent control',
                'Compensating control',
                'Directive control',
                'Corrective control',
              ],
              correctIndex: 1,
              rationale:
                'A compensating control is an alternative safeguard deployed to provide equivalent protection when the primary mandated control (AES-256) cannot be technically or economically implemented.',
            },
            {
              id: 'cissp-d1-l1-q2',
              question:
                'An enterprise wants to publish flexible recommendations helping software teams choose secure logging formats across diverse programming languages without mandating one rigid implementation. Which governance document should be created?',
              options: [
                'Security Policy',
                'Security Standard',
                'Security Guideline',
                'Operating Procedure',
              ],
              correctIndex: 2,
              rationale:
                'Guidelines are non-mandatory, flexible recommendations. Policies, standards, baselines, and procedures are all mandatory governance artifacts.',
            },
            {
              id: 'cissp-d1-l1-q3',
              question:
                'Before acquiring a smaller logistics firm, a CISO conducts a comprehensive cybersecurity risk assessment, inspects the target’s SOC 2 reports, and reviews open regulatory findings. Which legal concept is the CISO primarily demonstrating?',
              options: [
                'Due Care',
                'Due Diligence',
                'Transference',
                'Vicarious Liability',
              ],
              correctIndex: 1,
              rationale:
                'Due Diligence is the investigative research and assessment performed to identify risks before making a business decision. Implementing controls afterward demonstrates Due Care.',
            },
          ],
          practicalDrill: {
            title: 'Governance Document & Ethics Escalation Mapping',
            prompt:
              'Translate a board-level directive ("Protect all customer payment data") into all 5 governance document tiers.',
            steps: [
              'Draft 1 sentence each for: Policy (high-level mandate), Standard (specific crypto/MFA rule), Baseline (hardened server benchmark), Procedure (step-by-step key rotation), and Guideline (optional developer recommendation).',
              'Map each document to its executive or operational owner (Board/CISO vs. Architect vs. SysAdmin).',
              'Verify how Due Diligence (annual audits) and Due Care (enforcing controls) interact across the hierarchy.',
            ],
            successCriteria:
              'All 5 governance tiers are cleanly distinguished with Policy technology-agnostic, Standard/Baseline/Procedure mandatory, and Guideline advisory.',
          },
          flashcards: [
            { front: 'List the 4 ISC2 Code of Ethics Canons in strict priority order.', back: '1) Protect society/common good/infrastructure; 2) Act honorably, honestly, justly, responsibly, legally; 3) Provide diligent/competent service to principals; 4) Advance and protect the profession.', tag: 'cissp-d1' },
            { front: 'Due Diligence vs. Due Care?', back: 'Due Diligence = Researching/assessing risks (Know); Due Care = Acting prudently by implementing and maintaining controls (Do).', tag: 'cissp-d1' },
            { front: 'Which of Policy, Standard, Baseline, Procedure, and Guideline is NON-mandatory?', back: 'Guideline ONLY—all other four are mandatory.', tag: 'cissp-d1' },
          ],
          sourceRefs: [
            'my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf',
            'my_documents/CISSP Cheat sheet-1.pdf',
          ],
        },
        {
          id: 'cissp-d1-l2',
          title: 'Quantitative & Qualitative Risk Analysis, BCP & Threat Modeling',
          estimatedMinutes: 50,
          summary:
            'Master every CISSP quantitative risk formula (AV, EF, SLE, ARO, ALE, Safeguard Value), contrast qualitative scoring, lead Business Continuity Planning (BIA), and execute threat modeling.',
          learningObjectives: [
            'Calculate SLE, ALE, and Annualized Cost-Benefit (Safeguard Value) accurately under exam conditions.',
            'Compare Quantitative vs. Qualitative vs. Hybrid risk assessments and select cost-effective risk treatments.',
            'Execute the Business Continuity Planning (BCP) lifecycle anchored by Business Impact Analysis (BIA).',
            'Apply threat modeling methodologies (STRIDE, PASTA, VAST, DREAD) and NIST RMF steps.',
          ],
          coreConcepts: [
            {
              heading: 'Quantitative Risk Math & Safeguard Cost-Benefit Rule',
              explanation:
                'Quantitative risk assigns concrete monetary values so executives can evaluate ROI. Four equations are non-negotiable for CISSP: (1) Single Loss Expectancy (SLE) = Asset Value (AV) x Exposure Factor (EF, percentage of asset lost in one incident); (2) Annualized Loss Expectancy (ALE) = SLE x Annualized Rate of Occurrence (ARO, expected frequency per year—e.g., once every 5 years = 0.2); (3) Safeguard Value (Annual Net Benefit) = ALE(before control) - ALE(after control) - Annual Cost of Safeguard (ACS). Golden Business Rule: NEVER spend more on a control than the annual loss it prevents (except when protecting human life or mandatory legal compliance)!',
              mentalModel:
                'Do not buy a $10,000 armored vault to protect a $500 bicycle—unless the law requires it or human safety is on the line.',
              formulaOrRule: 'SLE = AV x EF | ALE = SLE x ARO | Control Value = (ALE_prior - ALE_post) - ACS. Only buy if Value > $0.',
            },
            {
              heading: 'Risk Maturity, Residual Risk & The 4 Risk Treatments',
              explanation:
                'Total Risk = Threats x Vulnerabilities x Asset Value (often phrased as Inherent Risk before controls). Implementing controls leaves Residual Risk = Total Risk - Controls Gap; remember Residual Risk is NEVER zero! Risk can be treated in four ways: Mitigate/Reduce (deploy controls), Transfer/Share (insurance/outsourcing—liability remains), Avoid (stop the risky process), or Accept (formal sign-off when residual risk sits within organizational Risk Appetite). Secondary Risk occurs when a new control itself introduces a fresh risk (e.g., complex password rules causing users to write passwords on sticky notes).',
              mentalModel:
                'Inherent risk is driving on an icy highway with no brakes; Residual risk is driving carefully with snow tires and ABS—safer, never zero.',
              formulaOrRule: 'Control Countermeasure Rule: Controls reduce risk to an ACCEPTABLE level (never 0%). Only Senior Management can formally Accept Risk.',
            },
            {
              heading: 'Business Continuity Planning (BCP) & NIST SP 800-34',
              explanation:
                'BCP ensures critical business processes survive major disruptions (whereas DRP focuses on restoring IT systems afterward). BCP follows four core steps: (1) Project Scope & Planning (obtain senior management sponsorship FIRST!); (2) Business Impact Analysis (BIA — identifies critical functions, quantifies financial/operational downtime impact, and establishes MTD, RTO, and RPO); (3) Continuity Planning (strategy selection & plan development); (4) Approval, Implementation, Training & Testing.',
              mentalModel:
                'BCP keeps the company selling products while the headquarters is flooded; DRP rebuilds the flooded server room.',
              formulaOrRule: 'BCP Step 1 = Management Support & Scope; Step 2 = BIA (outputs MTD, RTO, RPO, critical asset priority).',
            },
          ],
          realWorldScenario: {
            title: 'Justifying a DDoS Mitigation Platform to a Skeptical CFO',
            situation:
              'An e-commerce warehouse valued at $2,000,000 suffers an Exposure Factor of 25% per major DDoS outage, occurring roughly once every 2 years (ARO = 0.5). A vendor pitches an anti-DDoS appliance costing $300,000/year that reduces ARO to 0.05.',
            analysis:
              'Calculate carefully: SLE = $2,000,000 x 0.25 = $500,000. Prior ALE = $500,000 x 0.5 = $250,000/year. Post-control ALE = $500,000 x 0.05 = $25,000/year. Annual risk reduction = $225,000. Subtracting the $300,000 annual cost yields -$75,000 net loss per year! A technical engineer might buy the shiny tool; a CISSP manager rejects it and negotiates a lower-cost cloud scrubbing tier under $225,000/year.',
            takeaway:
              'Run the ALE cost-benefit formula before recommending expensive technical controls—the best security answer aligns with economic reality.',
          },
          examTraps: [
            'Watch ARO wording carefully! "Once every 4 years" means ARO = 0.25 (1/4), NOT 4! "Twice a year" means ARO = 2.0.',
            'Qualitative risk analysis (High/Medium/Low, Delphi technique) is faster, easier for non-technical executives, and handles intangible assets (brand reputation), whereas Quantitative is objective/monetary but time-consuming and relies on hard historical data.',
            'The Delphi Technique gathers anonymous expert opinions iteratively to eliminate groupthink and dominant-personality bias in qualitative risk scoring.',
            'NIST RMF (SP 800-37 Rev 2) has SEVEN steps starting with PREPARE: Prepare -> Categorize -> Select -> Implement -> Assess -> Authorize -> Monitor.',
          ],
          keyTerms: [
            { term: 'SLE (Single Loss Expectancy)', definition: 'Expected monetary loss from a single occurrence of a risk event (Asset Value x Exposure Factor).' },
            { term: 'ALE (Annualized Loss Expectancy)', definition: 'Expected yearly monetary loss from a specific threat (SLE x Annualized Rate of Occurrence).' },
            { term: 'Business Impact Analysis (BIA)', definition: 'Systematic study identifying critical business functions, dependencies, downtime costs, and recovery targets (MTD, RTO, RPO).' },
            { term: 'Delphi Technique', definition: 'Structured anonymous group estimation method using iterative feedback rounds to reach expert consensus without peer pressure.' },
            { term: 'Risk Appetite', definition: 'Total amount and type of risk an organization is willing to pursue or retain in achieving strategic objectives.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d1-l2-q1',
              question:
                'A manufacturing plant valued at $4,000,000 faces a flood threat with an Exposure Factor of 30% occurring once every 10 years. A flood-barrier system reduces the ARO to 0.01 and costs $80,000 annually to maintain. What is the net annual financial value of purchasing this safeguard?',
              options: [
                '+$120,000 (justifies purchase)',
                '+$28,000 (justifies purchase)',
                '-$68,000 (not cost-effective purely on ALE)',
                '+$40,000 (justifies purchase)',
              ],
              correctIndex: 1,
              rationale:
                'SLE = $4,000,000 x 0.30 = $1,200,000. Prior ALE = $1,200,000 x 0.10 (once per 10 yrs) = $120,000. Post ALE = $1,200,000 x 0.01 = $12,000. Value = ($120,000 - $12,000) - $80,000 = $108,000 - $80,000 = +$28,000/year net savings.',
            },
            {
              id: 'cissp-d1-l2-q2',
              question:
                'What is the PRIMARY purpose of conducting a Business Impact Analysis (BIA) during Business Continuity Planning?',
              options: [
                'To configure automated firewall failover clusters across data centers',
                'To identify critical business processes, quantify disruption impacts, and establish MTD, RTO, and RPO targets',
                'To perform penetration testing against production web applications',
                'To assign blame for prior operational outages',
              ],
              correctIndex: 1,
              rationale:
                'The BIA identifies mission-critical processes, maps dependencies, quantifies financial/operational outage impacts over time, and defines recovery objectives (MTD, RTO, RPO) that guide all subsequent DR/BC investments.',
            },
          ],
          practicalDrill: {
            title: 'Executive Risk Calculation & NIST RMF Mapping',
            prompt:
              'Evaluate a $500,000 customer portal facing ransomware (EF = 60%, ARO = 0.5) and decide between two competing controls.',
            steps: [
              'Compute baseline SLE ($300,000) and Prior ALE ($150,000).',
              'Compare Control A (Immutable Backups + EDR: ACS = $45,000, lowers EF to 10% and ARO to 0.2) vs. Control B (Enterprise Suite: ACS = $140,000, lowers ARO to 0.05).',
              'Calculate Safeguard Value for both options and write a 3-sentence executive recommendation.',
              'Map the chosen control across the 7 NIST RMF steps (Prepare -> Categorize -> Select -> Implement -> Assess -> Authorize -> Monitor).',
            ],
            successCriteria:
              'Math accurately identifies Control A (+$99,000 net benefit) over Control B (-$5,000 net loss), and all 7 NIST RMF steps appear in order.',
          },
          flashcards: [
            { front: 'Write the 3 core CISSP Quantitative Risk equations.', back: 'SLE = AV x EF; ALE = SLE x ARO; Safeguard Value = (ALE_before - ALE_after) - Annual Cost of Safeguard.', tag: 'cissp-d1' },
            { front: 'List the 7 steps of NIST RMF (SP 800-37 Rev 2) in order.', back: 'Prepare -> Categorize -> Select -> Implement -> Assess -> Authorize -> Monitor.', tag: 'cissp-d1' },
            { front: 'What is the Delphi Technique used for?', back: 'Anonymous iterative expert polling in qualitative risk analysis to reach consensus while preventing dominant-voice groupthink.', tag: 'cissp-d1' },
          ],
          sourceRefs: [
            'my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf',
            'my_documents/Chapple M. ISC2 CISSP Certified Information Systems...Practice Tests 4ed 2024.pdf',
          ],
        },
        {
          id: 'cissp-d1-l3',
          title: 'Legal Systems, Intellectual Property, Privacy & Third-Party Risk',
          estimatedMinutes: 40,
          summary:
            'Navigate criminal vs. civil vs. administrative law, protect IP (Copyright, Patent, Trademark, Trade Secret), comply with global privacy principles, and manage personnel and vendor supply-chain risk.',
          learningObjectives: [
            'Compare Criminal Law (beyond a reasonable doubt), Civil/Tort Law (preponderance of evidence), and Administrative/Regulatory Law.',
            'Differentiate Patents, Copyrights, Trademarks, and Trade Secrets by protection scope, duration, and disclosure requirements.',
            'Manage personnel security controls (background checks, NDAs, onboarding, graceful vs. hostile termination) and vendor/supply chain risk.',
            'Apply security awareness, training, and education programs tailored to audience roles.',
          ],
          coreConcepts: [
            {
              heading: 'Legal Categories & Burden of Proof',
              explanation:
                'CISSP tests three US/Common Law branches: (1) Criminal Law — offenses against society prosecuted by the government; highest burden of proof ("beyond a reasonable doubt"); penalties include imprisonment and fines. (2) Civil (Tort) Law — disputes between private parties seeking restitution/damages; lower burden of proof ("preponderance of the evidence" — >50% likely). (3) Administrative/Regulatory Law — rules promulgated by executive agencies (SEC, FTC, HIPAA/HHS, FCC) governing industry conduct without needing new Congressional statutes.',
              mentalModel:
                'Criminal = Jail (99% certainty); Civil = Money damages (>50% certainty); Administrative = Industry regulator fines and compliance orders.',
              formulaOrRule: 'Burdens of Proof: Criminal = Beyond Reasonable Doubt | Civil = Preponderance of Evidence.',
            },
            {
              heading: 'Intellectual Property (IP) Protection Matrix',
              explanation:
                'Choose the exact IP vehicle for each exam scenario: Copyright protects creative EXPRESSION (source code, books, music—automatic upon creation, author’s life + 70 yrs), NOT underlying ideas; Patent grants an exclusive 20-year monopoly over a novel, useful, non-obvious INVENTION/process—in exchange for PUBLIC disclosure; Trademark protects brand identity (logos, slogans, trade dress—renewable indefinitely while in commercial use); Trade Secret protects confidential business advantage (Coca-Cola formula, proprietary pricing algorithm) INDEFINITELY as long as the company takes active reasonable measures to keep it secret (NDAs, access control).',
              mentalModel:
                'Want secrecy forever? Trade Secret. Want a 20-year legal monopoly and okay publishing how it works? Patent. Wrote source code? Copyright. Designed a brand logo? Trademark.',
              formulaOrRule: 'Code/Expression = Copyright | Novel Invention (20 yr public) = Patent | Brand/Logo = Trademark | Secret Formula (indefinite if protected) = Trade Secret.',
            },
            {
              heading: 'Personnel Security & Supply Chain Risk Management (SCRM)',
              explanation:
                'Security starts before Day 1 with background checks, reference verification, and NDAs; continues through Least Privilege, Separation of Duties, Job Rotation, and Mandatory Vacations (which expose fraud!); and closes cleanly at termination—for hostile terminations, disable accounts and badge access AT THE EXACT MOMENT HR delivers the termination notice (never warn the employee in advance) and escort them off-site. Supply Chain Risk Management (NIST SP 800-161) secures third-party vendors via due diligence, right-to-audit clauses, SBOM verification, hardware tamper seals, and continuous vendor SLA monitoring.',
              mentalModel:
                'Mandatory vacations are a detective control: if the accountant who refuses to take time off is suddenly out for two weeks, the substitute spots the cooked books immediately.',
              formulaOrRule: 'Hostile Termination Order: Revoke Logical & Physical Access simultaneously with HR notification -> Escort -> Recover Assets -> Conduct Exit Review.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Insider Sabotage During an Executive Restructuring',
            situation:
              'A senior database administrator with root privileges is slated for involuntary termination due to performance disputes. HR notifies the DBA on Friday morning that their last day will be the following Friday so they can "document handover notes."',
            analysis:
              'Giving advance notice of an involuntary/hostile termination to a privileged insider is a catastrophic personnel-security failure inviting logic bombs, data theft, or destructive deletions. Proper procedure synchronizes HR and IAM so all credentials, VPN tokens, SSH keys, and physical badges are revoked immediately as HR conducts the termination meeting, with security escorting the individual to collect personal items.',
            takeaway:
              'Never grant privileged insiders a "lame-duck window" during involuntary termination; pre-stage automated IAM revocation synchronized with HR.',
          },
          examTraps: [
            'Distinguish Awareness (keeps security top-of-mind for ALL employees—posters, newsletters), Training (builds specific job skills—e.g., phishing triage, secure coding), and Education (deep academic/degree-level mastery for security professionals).',
            'Copyright protects the EXACT SOURCE CODE written, NOT the underlying algorithm or business idea; Patents require public disclosure and expire after 20 years.',
            'Remember: Job Rotation and Mandatory Vacations are primarily DETECTIVE/DETERRENT controls against collusion and insider fraud, while Separation of Duties is PREVENTIVE.',
          ],
          keyTerms: [
            { term: 'Trade Secret', definition: 'Confidential business information granting competitive advantage, legally protected indefinitely so long as reasonable secrecy controls are maintained.' },
            { term: 'Civil Law (Tort)', definition: 'Legal disputes between private entities decided by preponderance of evidence, yielding monetary damages or injunctions rather than prison.' },
            { term: 'Mandatory Vacation', definition: 'Administrative control requiring personnel in sensitive roles to take consecutive time off while another person audits/covers their duties to detect fraud.' },
            { term: 'SBOM', definition: 'Software Bill of Materials—machine-readable inventory of all components and third-party libraries inside a software product for supply-chain transparency.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d1-l3-q1',
              question:
                'A fintech startup develops a proprietary machine-learning credit-scoring formula that gives it a massive market edge. The founders do NOT want to publish how the formula works publicly and hope to protect it for more than 20 years. Which IP protection mechanism should they rely on?',
              options: [
                'Utility Patent',
                'Trade Secret backed by NDAs and strict access controls',
                'Trademark registration',
                'Creative Commons Copyright',
              ],
              correctIndex: 1,
              rationale:
                'Patents require full public disclosure and expire after 20 years. Trade Secrets protect confidential proprietary formulas indefinitely without public disclosure—provided the company enforces active confidentiality measures (NDAs, encryption, need-to-know access).',
            },
            {
              id: 'cissp-d1-l3-q2',
              question:
                'Which administrative control is MOST effective at detecting an employee who has been secretly manipulating wire-transfer reconciliation logs for two years?',
              options: [
                'Pre-employment background screening',
                'Mandatory consecutive vacations combined with job rotation',
                'Signing an updated Acceptable Use Policy',
                'Biometric turnstiles at the lobby entrance',
              ],
              correctIndex: 1,
              rationale:
                'Mandatory vacations (typically 1–2 consecutive weeks) combined with job rotation force another employee to execute and inspect the absent employee’s processes, rapidly uncovering ongoing concealed fraud.',
            },
          ],
          practicalDrill: {
            title: 'Third-Party Supply Chain & Termination Governance Checklist',
            prompt:
              'Audit your organization’s insider and vendor risk procedures ahead of an enterprise M&A integration.',
            steps: [
              'Classify all corporate IP into Copyright, Patent, Trademark, and Trade Secret inventories with matching protection controls.',
              'Build a synchronized HR-to-IAM hostile termination runbook disabling SSO, VPN, SSH, cloud keys, and physical badges within 5 minutes.',
              'Define mandatory vendor onboarding gates: SOC 2 Type II, SBOM requirement, SLA breach notification, and right-to-audit clause.',
            ],
            successCriteria:
              'Checklist cleanly separates all 4 IP types, enforces zero-window hostile offboarding, and embeds NIST 800-161 SCRM gates.',
          },
          flashcards: [
            { front: 'Contrast Awareness vs. Training vs. Education on CISSP.', back: 'Awareness = broad reminders for everyone (posters/phishing sims); Training = role-specific hands-on skills; Education = formal deep academic mastery for security specialists.', tag: 'cissp-d1' },
            { front: 'Patent vs. Trade Secret: Key trade-off?', back: 'Patent gives a 20-year exclusive monopoly but requires PUBLIC disclosure; Trade Secret lasts forever with NO public disclosure, but requires active secrecy controls and does not block independent reverse engineering.', tag: 'cissp-d1' },
            { front: 'Criminal Law vs. Civil Law burden of proof?', back: 'Criminal = Beyond a Reasonable Doubt (imprisonment/fines); Civil = Preponderance of the Evidence (monetary restitution/damages).', tag: 'cissp-d1' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: ASSET SECURITY (10%)
    // =================================================================
    {
      id: 'cissp-d2',
      domainNumber: 2,
      title: 'Asset Security',
      examWeightPercent: 10,
      overview:
        'Covers information and asset classification, data ownership roles (Owner, Controller, Processor, Custodian, Steward), privacy protection, retention, data remanence and sanitization (NIST SP 800-88), and scoping/tailoring security baselines.',
      lessons: [
        {
          id: 'cissp-d2-l1',
          title: 'Data Classification, Ownership Roles & Lifecycle Governance',
          estimatedMinutes: 40,
          summary:
            'Distinguish Government vs. Commercial classification tiers, map exact CISSP accountability across Data Owner, System Owner, Data Custodian, and Data Steward, and enforce asset lifecycle handling.',
          learningObjectives: [
            'Compare Government classification tiers (Top Secret, Secret, Confidential, Unclassified) with Commercial tiers (Confidential/Restricted, Private, Sensitive, Public).',
            'Assign exact responsibilities to Data Owner, System Owner, Data Custodian, Data Steward, Data Controller, and Data Processor.',
            'Implement labeling, handling, marking, and end-of-life retention policies tied directly to classification.',
          ],
          coreConcepts: [
            {
              heading: 'Exact CISSP Data Roles (High-Yield Exam Favorite)',
              explanation:
                'CISSP obsessively tests who does WHAT: (1) Data Owner — senior business executive (VP/Director) ultimately ACCOUNTABLE for data, sets classification labels, approves access criteria, and determines retention; (2) Data Custodian — technical IT administrator (DBA/SysAdmin) executing day-to-day operational protection (backups, patching, implementing permissions approved by the Data Owner); (3) System Owner — owns the hardware/software platform hosting the data; (4) Data Steward — business/data-quality specialist ensuring accuracy, formatting, and metadata lineage; (5) Business/Mission Owner — owns the overall business process.',
              mentalModel:
                'Data Owner is the homeowner who sets house rules and decides who gets a key; Data Custodian is the property manager who installs the locks, tests alarms, and maintains backups.',
              formulaOrRule: 'Classifies & Approves Access = Data Owner (Senior Manager); Implements Backups & Permissions = Data Custodian (IT Ops).',
            },
            {
              heading: 'Government vs. Commercial Classification Schemes',
              explanation:
                'Classification ensures security spending matches asset value (avoiding under-protecting crown jewels or wasting money over-protecting public brochures). US Government tiers measure harm to national security: Top Secret (exceptionally grave damage), Secret (serious damage), Confidential (damage), Unclassified. Commercial tiers measure business impact: Confidential/Restricted (trade secrets, M&A—highest sensitivity), Private (HR/PII internal personal info), Sensitive (financial/operational internals), Public (approved press releases).',
              mentalModel:
                'Never put a $50 lock on a $5 million diamond, and never hire armed guards for public marketing flyers.',
              formulaOrRule: 'Classification Criterion = Value + Sensitivity + Impact of Compromise -> Drives all downstream handling & encryption controls.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Unauthorized Access Escalation Through Clear Role Ownership',
            situation:
              'A marketing analyst submits a helpdesk ticket asking the database administrator (DBA) for read access to raw HR salary tables for a "benchmarking project." The DBA checks that the analyst is an active employee and grants access directly.',
            analysis:
              'The DBA (Data Custodian) violated role separation by self-approving access! Only the Data Owner (VP of Human Resources) has authority to approve access to HR data based on Need-to-Know and classification policy; the Custodian may ONLY provision access after verified Owner authorization.',
            takeaway:
              'Custodians implement; Owners classify and authorize. Never permit technical administrators to grant business data access without documented Data Owner sign-off.',
          },
          examTraps: [
            'NEVER confuse Data Owner with Data Custodian! If an exam question asks "Who determines the classification level and approves user access requests?", ALWAYS pick Data Owner. "Who runs backups and enforces ACLs?" -> Data Custodian.',
            'Remember: In CISSP commercial terminology, "Private" specifically refers to internal personal/HR data (like PII/salaries), whereas "Confidential" typically denotes corporate trade secrets/proprietary IP.',
            'Classification MUST be reviewed periodically—over-classifying stale documents bloats storage and compliance costs (declassification lowers cost as sensitivity decays).',
          ],
          keyTerms: [
            { term: 'Data Owner', definition: 'Senior business manager accountable for data assets who assigns classification labels and approves access and retention rules.' },
            { term: 'Data Custodian', definition: 'IT/technical operational role responsible for implementing safeguards, backups, and access controls defined by the Data Owner.' },
            { term: 'Data Steward', definition: 'Role ensuring data quality, consistency, metadata accuracy, and adherence to data governance rules.' },
            { term: 'Need-to-Know', definition: 'Access principle restricting classified data strictly to individuals whose specific job tasks require it, even if they hold sufficient clearance.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d2-l1-q1',
              question:
                'A newly ingested customer credit-scoring dataset needs a formal classification label and an approved retention schedule before being stored in the enterprise data lake. Who is responsible for making these decisions?',
              options: [
                'Database Administrator (Data Custodian)',
                'Senior Business Executive (Data Owner)',
                'SOC Tier 2 Analyst',
                'External Cloud Auditor',
              ],
              correctIndex: 1,
              rationale:
                'The Data Owner (a senior business manager) determines data classification, approves access criteria, and establishes retention requirements. The Data Custodian executes technical implementation.',
            },
            {
              id: 'cissp-d2-l1-q2',
              question:
                'An employee holds a Top Secret clearance, yet is denied access to a Top Secret defense satellite project file. Which security principle justifies this denial?',
              options: [
                'Least Functionality',
                'Need-to-Know',
                'Separation of Duties',
                'Data Aggregation',
              ],
              correctIndex: 1,
              rationale:
                'Even with a matching clearance level, Mandatory Access Control enforces Need-to-Know (compartmentalization)—users may only view classified records strictly required for their assigned duties.',
            },
          ],
          practicalDrill: {
            title: 'Enterprise Asset Classification & RACI Matrix',
            prompt:
              'Build a 4-tier commercial classification standard (Public, Internal/Sensitive, Private/PII, Confidential/IP).',
            steps: [
              'Assign a named Data Owner role and Data Custodian role for each tier.',
              'Define required handling rules across Storage (encryption), Transit (TLS/mTLS), Marking (headers/watermarks), and End-of-Life sanitization.',
              'Specify an annual re-classification review trigger to declassify aged operational records safely.',
            ],
            successCriteria:
              'Matrix cleanly separates Data Owner accountability from Custodian execution and ties controls proportionately to sensitivity.',
          },
          flashcards: [
            { front: 'Data Owner vs. Data Custodian vs. Data Steward?', back: 'Owner = senior exec who classifies & approves access; Custodian = IT ops implementing controls/backups; Steward = ensures data quality, accuracy, and lineage.', tag: 'cissp-d2' },
            { front: 'List the 4 US Government classification tiers from highest to lowest.', back: 'Top Secret -> Secret -> Confidential -> Unclassified.', tag: 'cissp-d2' },
            { front: 'Why is periodic declassification important?', back: 'Data loses sensitivity over time; failing to downgrade stale data wastes budget and administrative overhead over-protecting obsolete files.', tag: 'cissp-d2' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d2-l2',
          title: 'Data Remanence, NIST SP 800-88 Sanitization & Scoping/Tailoring Baselines',
          estimatedMinutes: 40,
          summary:
            'Eliminate data remanence across magnetic disks and SSDs using NIST SP 800-88 (Clear, Purge, Destroy), and master Scoping and Tailoring when applying security baselines.',
          learningObjectives: [
            'Contrast NIST SP 800-88 sanitization tiers: Clearing, Purging (including Cryptographic Erase), and Physical Destruction.',
            'Explain why degaussing and standard overwriting fail on Solid-State Drives (SSDs) due to wear leveling.',
            'Apply Scoping and Tailoring to adapt baseline control frameworks (NIST SP 800-53 / CIS) to real systems.',
            'Protect data across all three states (At Rest, In Transit, In Use) with proportionate technical controls.',
          ],
          coreConcepts: [
            {
              heading: 'Data Remanence & NIST SP 800-88 Media Sanitization',
              explanation:
                'Data Remanence is residual data remaining on storage media after casual deletion or formatting (which merely unlinks filesystem pointers). NIST SP 800-88 defines three escalating sanitization levels: (1) Clear — logical overwriting using standard read/write commands to stop simple keyboard/recovery tools (media stays reusable inside the same security domain); (2) Purge — rendering data infeasible to recover even against state-of-the-art laboratory attacks using Degaussing (magnetic HDDs/tapes ONLY—destroys drive electronics/servo tracks!), SSD Secure Erase, or Cryptographic Erase / Crypto-Shredding (media may be reused or leave control); (3) Destroy — physical incineration, pulverizing, shredding, or smelting (mandatory when highest-classified media leaves control permanently).',
              mentalModel:
                'Deleting a file only tears out the book’s table of contents; Clearing scribbles over every page; Purging chemically bleaches the ink or burns the cipher key; Destroying tosses the book into a blast furnace.',
              formulaOrRule: 'NIST 800-88 Hierarchy: Clear (logical overwrite) < Purge (lab-resistant: Degauss HDD / Crypto-Erase SSD) < Destroy (incinerate/shred).',
            },
            {
              heading: 'Why SSDs Break Legacy Sanitization Rules',
              explanation:
                'Magnetic degaussers apply an intense magnetic field that erases spinning hard drives (HDDs) and magnetic tapes, but SSDs store charge in NAND flash transistors—so degaussing has ZERO effect on an SSD! Furthermore, SSD wear-leveling algorithms remap logical blocks to spare physical cells, leaving old sensitive blocks untouched by OS-level overwriting utilities. Therefore, NIST recommends Cryptographic Erase (encrypt SSD from Day 1, destroy key) or Physical Destruction (shredding/disintegration to <= 2mm particles) for SSDs.',
              mentalModel:
                'Using a magnet to erase an SSD is like trying to magnetize a plastic credit card—nothing happens inside the flash chips.',
              formulaOrRule: 'SSD Sanitization Rule: NEVER Degauss an SSD! Use Cryptographic Erase (Purge) or Physical Disintegration/Shredding (Destroy).',
            },
            {
              heading: 'Scoping vs. Tailoring Security Baselines',
              explanation:
                'Baselines (like NIST SP 800-53 Moderate) are starting templates—never blind checklists. Scoping removes baseline controls that do NOT apply to the environment (e.g., removing wireless controls from an air-gapped wired-only server room). Tailoring customizes the remaining applicable baseline controls to fit specific organizational risk, regulatory rules, or technology (e.g., adjusting password/MFA settings, adding compensating controls, or tightening encryption strength).',
              mentalModel:
                'Scoping crosses irrelevant sections off the checklist; Tailoring hems the sleeves of the suit so the remaining controls fit your exact system.',
              formulaOrRule: 'Scoping = Selecting WHICH baseline controls apply; Tailoring = Customizing HOW those controls are configured.',
            },
          ],
          realWorldScenario: {
            title: 'Decommissioning Retired Healthcare SSD Arrays',
            situation:
              'A hospital upgrades its storage cluster and plans to donate 120 retired NVMe SSD drives containing electronic PHI to a local charity after running a single-pass OS format and passing them through the IT department’s magnetic degausser.',
            analysis:
              'Both actions fail completely! Quick formatting leaves raw flash blocks intact, and magnetic degaussing does nothing to NAND flash SSDs. Donating these drives would constitute a massive HIPAA breach. Because the drives contain regulated PHI and are leaving organizational control, the hospital must execute verified Cryptographic Erase (if self-encrypting drives were active from Day 1) or physical SSD shredding/pulverization with a Certificate of Destruction.',
            takeaway:
              'Match media sanitization precisely to media physics (magnetic vs. flash) AND whether the drive stays inside or leaves organizational custody.',
          },
          examTraps: [
            'Classic CISSP trap: Degaussing works ONLY on magnetic media (HDDs, tapes) and NEVER on SSDs, optical discs (CD/DVD), or flash memory.',
            'Clearing protects against simple non-invasive recovery (staying internal); Purging protects against advanced laboratory recovery (leaving internal control or reuse across security boundaries); Destruction physically ruins the media.',
            'Do not swap Scoping (determining which controls apply to your scope) and Tailoring (modifying/customizing those selected controls to match specific risks).',
          ],
          keyTerms: [
            { term: 'Data Remanence', definition: 'Residual representation of digital data remaining on storage media after nominal deletion or reformatting.' },
            { term: 'Purging (NIST SP 800-88)', definition: 'Sanitization rendering target data recovery infeasible even via state-of-the-art laboratory techniques (e.g., degaussing magnetic media, cryptographic erase).' },
            { term: 'Scoping', definition: 'Reviewing baseline security controls to identify and apply only those relevant to a system’s specific operational scope.' },
            { term: 'Tailoring', definition: 'Customizing scoped baseline controls—modifying parameters or adding compensating controls—to align with organizational risk.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d2-l2-q1',
              question:
                'A defense contractor is retiring Solid-State Drives (SSDs) that previously stored Secret blueprints and must dispose of them externally. Which sanitization approach complies with NIST SP 800-88?',
              options: [
                'High-coercivity magnetic degaussing followed by resale',
                'Quick NTFS reformatting and overwriting free space',
                'Physical disintegration/shredding (Destruction) with verified chain of custody',
                'Deleting the volume partition table in BIOS',
              ],
              correctIndex: 2,
              rationale:
                'Degaussing fails on non-magnetic flash SSDs, and logical formatting/overwriting misses wear-leveled spare NAND blocks. Physical destruction (shredding/pulverization) ensures zero data remanence when high-sensitivity SSDs leave custody.',
            },
            {
              id: 'cissp-d2-l2-q2',
              question:
                'While adopting NIST SP 800-53 Moderate baselines for a cloud-only SaaS application, an architect removes all physical badge-reader controls from the internal checklist because physical security is inherited from the CSP, then strengthens session timeout parameters from 30 to 15 minutes. Which two processes did the architect perform respectively?',
              options: [
                'Tailoring, then Scoping',
                'Scoping, then Tailoring',
                'Clearing, then Purging',
                'Categorization, then Authorization',
              ],
              correctIndex: 1,
              rationale:
                'Removing inapplicable baseline controls is Scoping; modifying parameters of retained controls (tightening timeout to 15 min) is Tailoring.',
            },
          ],
          practicalDrill: {
            title: 'NIST SP 800-88 Media Disposal Decision Tree',
            prompt:
              'Create a disposal standard covering 4 retired assets: (1) Internal-use HDD being redeployed to Finance, (2) External-disposal HDD with PII, (3) External-disposal SSD with Trade Secrets, (4) Cloud encrypted bucket.',
            steps: [
              'Assign Clear, Purge, or Destroy to each asset with exact technical method.',
              'Mandate verification sampling and a signed Certificate of Destruction for external recyclers.',
              'Confirm zero use of degaussing on SSDs or cloud volumes.',
            ],
            successCriteria:
              'Decision tree applies NIST 800-88 accurately across magnetic, flash, and cloud media.',
          },
          flashcards: [
            { front: 'NIST SP 800-88: Clear vs. Purge vs. Destroy?', back: 'Clear = logical overwrite (stops basic recovery, internal reuse); Purge = resists lab forensics (degauss HDD / crypto-erase SSD); Destroy = physical ruin (shred/incinerate/pulverize).', tag: 'cissp-d2' },
            { front: 'Why does OS-level overwriting fail on SSDs?', back: 'Wear-leveling controllers remap writes to spare flash blocks, leaving sensitive data stranded in unreachable physical cells.', tag: 'cissp-d2' },
            { front: 'Scoping vs. Tailoring baselines?', back: 'Scoping decides WHICH controls apply to your system; Tailoring customizes HOW those selected controls are configured.', tag: 'cissp-d2' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: SECURITY ARCHITECTURE AND ENGINEERING (13%)
    // =================================================================
    {
      id: 'cissp-d3',
      domainNumber: 3,
      title: 'Security Architecture and Engineering',
      examWeightPercent: 13,
      overview:
        'Deep engineering mastery across formal security models (Bell-LaPadula, Biba, Clark-Wilson, Brewer-Nash), trusted computing bases, Common Criteria, applied cryptography & PKI, physical facility security, and modern architectural paradigms.',
      lessons: [
        {
          id: 'cissp-d3-l1',
          title: 'Formal Security Models, Trusted Computing Base & Common Criteria',
          estimatedMinutes: 50,
          summary:
            'Master every formal security state-machine/lattice model tested on CISSP, CPU protection rings and reference monitors, covert channels, and ISO/IEC 15408 Common Criteria evaluation.',
          learningObjectives: [
            'Contrast Bell-LaPadula (Confidentiality), Biba (Integrity), Clark-Wilson (Commercial Integrity / Well-Formed Transactions), and Brewer-Nash (Chinese Wall).',
            'Explain Trusted Computing Base (TCB), Security Perimeter, Reference Monitor (Always Invoked, Tamperproof, Small Enough to Verify), and Protection Rings (0–3).',
            'Apply Common Criteria terminology: TOE, Protection Profile (PP), Security Target (ST), and Evaluation Assurance Levels (EAL 1–7).',
            'Identify hardware/architecture flaws including TOCTOU race conditions, covert storage/timing channels, and side-channel attacks.',
          ],
          coreConcepts: [
            {
              heading: 'Formal Security Models Cheat Matrix',
              explanation:
                'Know the exact security objective and rules of the Big Four models: (1) Bell-LaPadula (CONFIDENTIALITY — military): Simple Security Property ("No Read Up") and Star (*) Property ("No Write Down") prevent classified secrets from leaking to lower levels. (2) Biba (INTEGRITY — inverse of Bell-LaPadula): Simple Integrity ("No Read Down" — don’t read untrusted garbage) and Star (*) Integrity ("No Write Up" — don’t corrupt higher-integrity data). (3) Clark-Wilson (COMMERCIAL INTEGRITY): enforces Separation of Duties and Well-Formed Transactions requiring Subjects to access Constrained Data Items (CDIs) ONLY through certified Transformation Procedures (TPs). (4) Brewer-Nash / Chinese Wall: dynamically adapts access to prevent Conflicts of Interest (e.g., once a consultant reads Bank A’s files, access to competitor Bank B is dynamically blocked).',
              mentalModel:
                'Bell-LaPadula = "No Read Up, No Write Down" (keep secrets UP); Biba = "No Read Down, No Write Up" (keep integrity CLEAN); Clark-Wilson = ATM software (must use approved transactions); Chinese Wall = Law firm avoiding competing clients.',
              formulaOrRule: 'BLP = Confidentiality (NRU/NWD) | Biba = Integrity (NRD/NWU) | Clark-Wilson = Commercial Integrity (TP/CDI/SoD) | Brewer-Nash = Conflict of Interest.',
            },
            {
              heading: 'TCB, Reference Monitor & CPU Protection Rings',
              explanation:
                'The Trusted Computing Base (TCB) is the totality of all hardware, firmware, and software enforcing security policy inside a system; the boundary separating TCB from untrusted components is the Security Perimeter. At the heart of the TCB sits the Reference Monitor (abstract concept implemented by the Security Kernel), which mediates EVERY subject-to-object access and MUST satisfy three properties: (1) Complete Mediation (always invoked), (2) Tamperproof (isolated from alteration), and (3) Verifiable (small enough to prove mathematically). x86 Protection Rings grant Ring 0 to the OS Kernel (highest privilege), Rings 1–2 to drivers/services, and Ring 3 to User Applications (least privilege).',
              mentalModel:
                'Ring 0 is the nuclear reactor core; Ring 3 is the public lobby; the Reference Monitor is the armored checkpoint inspecting every single badge moving between them.',
              formulaOrRule: 'Reference Monitor 3 Rules: Always Invoked + Tamperproof + Small Enough to Test/Verify.',
            },
            {
              heading: 'Common Criteria (ISO/IEC 15408)',
              explanation:
                'Common Criteria provides standardized, independent assurance evaluation of IT security products. Key vocabulary: Target of Evaluation (TOE — the product being tested), Protection Profile (PP — vendor-agnostic customer requirements wishlist), Security Target (ST — vendor’s concrete written claims about how its product meets requirements), and Evaluation Assurance Levels (EAL 1 [functionally tested] through EAL 7 [formally verified design and tested]). Remember: higher EAL means more rigorous TESTING/ASSURANCE, NOT necessarily more security features!',
              mentalModel:
                'Protection Profile = Buyer’s RFP wishlist; Security Target = Vendor’s sales specification; TOE = The actual product in the test lab; EAL = How deeply the lab tested it (1 to 7).',
              formulaOrRule: 'PP = Customer Requirements | ST = Vendor Claims | TOE = Product Tested | EAL 4 = Highest commercially practical level (methodically designed, tested, reviewed).',
            },
          ],
          realWorldScenario: {
            title: 'Stopping Conflict-of-Interest Leaks in a Multi-Client Consulting Portal',
            situation:
              'A global management consultancy advises competing pharmaceutical giants. Analysts roam freely across project folders until one analyst inadvertently opens proprietary drug trial data for Competitor B after advising Competitor A, triggering a regulatory lawsuit.',
            analysis:
              'Static clearance levels (Bell-LaPadula) do not solve lateral peer-competitor conflicts. Implementing the Brewer-Nash (Chinese Wall) model dynamically updates each analyst’s access matrix the instant they access one dataset in a conflict class, automatically blocking access to all rival companies in that class.',
            takeaway:
              'Match the formal security model precisely to the threat: secrets leakage -> Bell-LaPadula; data corruption -> Biba/Clark-Wilson; competing-client conflict -> Brewer-Nash.',
          },
          examTraps: [
            'Memory anchor to NEVER mix up BLP and Biba: "BLP has an L -> Look Down, Write Up (No Read Up, No Write Down)." Biba is the exact mirror opposite (No Read Down, No Write Up).',
            'Watch out for Common Criteria EAL trap: EAL 4 is the highest commercially viable assurance level without redesigning the product from scratch (EAL 5–7 require semi-formal/formal mathematical proofs).',
            'Covert Storage Channel hides signals in shared storage attributes (e.g., disk quota/file lock state); Covert Timing Channel modulates system speed/CPU execution time to leak bits.',
            'TOCTOU (Time-of-Check to Time-of-Use) is a race condition exploiting the tiny delay between verifying a permission/resource and actually using it.',
          ],
          keyTerms: [
            { term: 'Bell-LaPadula Model', definition: 'Confidentiality-focused state machine model enforcing Simple Security (No Read Up) and Star Property (No Write Down).' },
            { term: 'Clark-Wilson Model', definition: 'Commercial integrity model enforcing Well-Formed Transactions (via Transformation Procedures on Constrained Data Items) and Separation of Duties.' },
            { term: 'Brewer-Nash (Chinese Wall)', definition: 'Dynamic access model preventing Conflicts of Interest by blocking access to competing datasets within the same conflict class.' },
            { term: 'Reference Monitor', definition: 'Abstract TCB mechanism mediating all subject-object access; must be always invoked, tamperproof, and small enough to verify.' },
            { term: 'Protection Profile (PP)', definition: 'Common Criteria implementation-independent set of customer security requirements for a product category.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d3-l1-q1',
              question:
                'A commercial banking ledger requires that tellers can ONLY modify customer balances through certified accounting software routines and enforces strict Separation of Duties between developers and production operators. Which formal security model BEST describes this architecture?',
              options: [
                'Bell-LaPadula',
                'Brewer-Nash',
                'Clark-Wilson',
                'Take-Grant',
              ],
              correctIndex: 2,
              rationale:
                'Clark-Wilson focuses on commercial data integrity through Well-Formed Transactions (users access Constrained Data Items exclusively through certified Transformation Procedures) and strict Separation of Duties.',
            },
            {
              id: 'cissp-d3-l1-q2',
              question:
                'In ISO/IEC 15408 Common Criteria, which document is authored by the VENDOR to specify the exact security claims and capabilities of its specific Target of Evaluation (TOE)?',
              options: [
                'Protection Profile (PP)',
                'Security Target (ST)',
                'Evaluation Assurance Level (EAL)',
                'Statement of Applicability (SoA)',
              ],
              correctIndex: 1,
              rationale:
                'The Security Target (ST) is created by the vendor to describe the exact security properties of its product (TOE). The Protection Profile (PP) is the vendor-neutral requirements document authored by customers/communities.',
            },
          ],
          practicalDrill: {
            title: 'Formal Model Selection & Common Criteria Procurement Drill',
            prompt:
              'Select the exact formal model and procurement specification for 3 enterprise systems: Military Classified Vault, Investment Bank M&A Portal, and Core ERP Ledger.',
            steps: [
              'Map Military Vault -> Bell-LaPadula; M&A Portal -> Brewer-Nash (Chinese Wall); ERP Ledger -> Clark-Wilson.',
              'Draft a Common Criteria Protection Profile requirement specifying EAL 4+ for a network firewall RFP.',
              'List two countermeasures against TOCTOU race conditions (atomic lock operations) and covert timing channels (strict resource isolation/noise injection).',
            ],
            successCriteria:
              'Each system maps to the right formal model, EAL 4 is justified commercially, and PP vs. ST roles are accurate.',
          },
          flashcards: [
            { front: 'Bell-LaPadula vs. Biba: State both rules of each model.', back: 'Bell-LaPadula (Confidentiality): No Read Up, No Write Down. Biba (Integrity): No Read Down, No Write Up.', tag: 'cissp-d3' },
            { front: 'What are the 3 required properties of a Reference Monitor?', back: '1) Always invoked (Complete Mediation), 2) Tamperproof, 3) Small enough to be thoroughly tested and verified.', tag: 'cissp-d3' },
            { front: 'Protection Profile (PP) vs. Security Target (ST) in Common Criteria?', back: 'PP = vendor-neutral customer requirements; ST = vendor-specific claims for a Target of Evaluation (TOE).', tag: 'cissp-d3' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d3-l2',
          title: 'Applied Cryptography, PKI, Digital Signatures & Cryptanalysis',
          estimatedMinutes: 55,
          summary:
            'Master symmetric vs. asymmetric cryptography, AES block cipher modes (ECB vs. CBC vs. GCM), SHA hashing, digital signatures, X.509 PKI certificate revocation (CRL/OCSP/Stapling), and post-quantum readiness.',
          learningObjectives: [
            'Compare Symmetric algorithms (AES, ChaCha20) vs. Asymmetric algorithms (RSA, ECC, Diffie-Hellman) for speed, key count (`n(n-1)/2` vs `2n`), and use cases.',
            'Differentiate AES block cipher modes: ECB (insecure patterns), CBC (chained IV), CTR, and GCM (Authenticated Encryption with Associated Data — AEAD).',
            'Trace exact key usage for Encryption vs. Digital Signatures (Confidentiality vs. Integrity + Authentication + Non-Repudiation).',
            'Architect X.509 PKI trust hierarchies, Certificate Revocation (CRL, OCSP, OCSP Stapling), and mitigate cryptographic attacks (Birthday, Downgrade, Side-Channel).',
          ],
          coreConcepts: [
            {
              heading: 'Symmetric vs. Asymmetric Cryptography & Key Scaling Math',
              explanation:
                'Symmetric encryption (AES-128/256, ChaCha20, legacy 3DES) uses ONE shared secret key for encryption and decryption—blazingly fast for bulk data at rest/in transit, but suffers from key distribution challenges and provides NO non-repudiation; for `n` communicating users, symmetric requires `n(n - 1) / 2` unique keys. Asymmetric (Public Key) encryption (RSA, Elliptic Curve Cryptography [ECC], Diffie-Hellman) uses mathematically paired Public + Private keys (`2n` total keys)—slower, so used for key exchange, digital signatures, and hybrid encryption (encrypt bulk payload with fast symmetric session key, wrap session key with recipient’s public key). ECC delivers equivalent security to RSA with vastly smaller keys (256-bit ECC ~ 3072-bit RSA), ideal for mobile/IoT.',
              mentalModel:
                'Hybrid encryption (like TLS) puts the heavy furniture in a fast truck locked with a disposable padlock (AES session key), then mails that tiny padlock key inside an armored envelope locked with the receiver’s public key (RSA/ECC).',
              formulaOrRule: 'Symmetric Keys = n(n-1)/2 (Fast, Confidentiality ONLY) | Asymmetric Keys = 2n (Slower, Key Exchange + Digital Signatures + Non-Repudiation).',
            },
            {
              heading: 'Block Cipher Modes & Exact Key Usage for Digital Signatures',
              explanation:
                'Block cipher modes determine how multi-block plaintext is encrypted: ECB (Electronic Codebook) encrypts identical plaintext blocks into identical ciphertext blocks—NEVER use ECB (leaks patterns!). CBC (Cipher Block Chaining) XORs each block with the previous ciphertext block using an Initialization Vector (IV) to hide patterns. GCM (Galois/Counter Mode) is the modern gold standard providing AEAD (Confidentiality + Integrity/Authentication simultaneously). For Asymmetric messaging: Encrypt with RECIPIENT’s PUBLIC key (only Recipient’s Private key can decrypt -> Confidentiality). Digitally Sign by hashing the message (SHA-256/SHA-3) and encrypting the HASH with SENDER’s PRIVATE key (anyone verifies with Sender’s Public key -> Integrity + Authentication + Non-Repudiation).',
              mentalModel:
                'To send a SECRET letter to Alice, lock the mailbox with Alice’s PUBLIC padlock. To SIGN a check proving it came from Bob, stamp it with Bob’s PRIVATE wax seal.',
              formulaOrRule: 'Confidentiality = Encrypt w/ Recipient PUBLIC Key. Digital Signature = Sign Hash w/ Sender PRIVATE Key (Integrity + AuthN + Non-Repudiation).',
            },
            {
              heading: 'PKI, Certificate Revocation (CRL/OCSP) & Cryptanalysis',
              explanation:
                'Public Key Infrastructure (PKI) binds identities to public keys via X.509 digital certificates issued by a Certificate Authority (CA) after verification by a Registration Authority (RA). If a private key leaks before expiration, the CA revokes it via a Certificate Revocation List (CRL — periodically downloaded list, introduces latency) or Online Certificate Status Protocol (OCSP — real-time query). OCSP Stapling fixes OCSP privacy and latency issues by having the web server fetch and "staple" a fresh CA-signed timestamped status proof directly inside the TLS handshake. Key cryptographic laws: Kerckhoffs’s Principle (a cryptosystem must remain secure even if everything EXCEPT the key is public—never rely on security through obscurity!), and Quantum threats (Shor’s algorithm threatens RSA/ECC -> migrate to NIST Post-Quantum Cryptography ML-KEM/ML-DSA; Grover’s algorithm halves symmetric key strength -> upgrade AES-128 to AES-256).',
              mentalModel:
                'CRL is a printed weekly list of stolen credit cards; OCSP calls the bank live at checkout; OCSP Stapling lets the merchant hand you a fresh bank-stamped receipt at the door.',
              formulaOrRule: 'Kerckhoffs’s Principle = Secrecy lies ONLY in the Key. Quantum Defense: Asymmetric -> NIST PQC (Lattice); Symmetric -> Double Key Size (AES-256).',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Pattern Leakage & Securing High-Throughput Microservice TLS',
            situation:
              'An engineering team built an internal document encryption tool using AES-256 in ECB mode with a static hardcoded key and ignored OCSP checks on internal certificates because live CA lookups slowed API latency.',
            analysis:
              'AES-256-ECB exposes identical plaintext patterns (even though AES-256 itself is strong!), and skipping revocation checks lets attackers reuse stolen certificates indefinitely. Switching to AES-256-GCM with unique random nonces/IVs delivers authenticated encryption, while enabling OCSP Stapling eliminates real-time revocation latency without sacrificing validity checks.',
            takeaway:
              'Strong algorithms used in the wrong mode (ECB) or with reused IVs/nonces collapse completely. Pair AES-GCM with hybrid TLS 1.3 and OCSP Stapling.',
          },
          examTraps: [
            'CISSP classic: "Bob wants to send Alice a message guaranteeing Integrity and Non-Repudiation (NOT confidentiality). Which key does Bob use?" -> Hash message + encrypt hash with BOB’s PRIVATE key!',
            'Wait: "Which key does Alice use to VERIFY Bob’s signature?" -> BOB’s PUBLIC key!',
            'A Digital Signature alone provides Integrity, Authentication, and Non-Repudiation—it does NOT provide Confidentiality unless you ALSO encrypt the message!',
            'Birthday Attack targets HASH COLLISIONS (finding ANY two different inputs producing the same hash, reducing complexity to 2^(n/2)). Always use SHA-256 or SHA-3 (never MD5 or SHA-1).',
            'Never confuse Perfect Forward Secrecy (PFS — uses Ephemeral Diffie-Hellman [ECDHE/DHE] so compromising a server’s long-term private key CANNOT decrypt past recorded sessions).',
          ],
          keyTerms: [
            { term: 'Kerckhoffs’s Principle', definition: 'Cryptographic axiom stating a system should remain secure even if the algorithm is fully public, relying strictly on secrecy of the key.' },
            { term: 'Perfect Forward Secrecy (PFS)', definition: 'Key-agreement property (via ephemeral ECDHE/DHE) ensuring compromise of long-term private keys cannot decrypt previously captured traffic.' },
            { term: 'AES-GCM', definition: 'Galois/Counter Mode—authenticated symmetric block cipher mode providing both confidentiality and integrity simultaneously (AEAD).' },
            { term: 'OCSP Stapling', definition: 'TLS optimization where the server caches and attaches a CA-signed timestamped revocation status response directly in the TLS handshake.' },
            { term: 'Birthday Attack', definition: 'Cryptanalytic collision attack exploiting probability theory to find two distinct inputs generating an identical hash digest in ~2^(n/2) attempts.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d3-l2-q1',
              question:
                'How many unique symmetric secret keys are required to enable private pairwise communication among 10 business executives?',
              options: [
                '20',
                '45',
                '90',
                '100',
              ],
              correctIndex: 1,
              rationale:
                'Symmetric key count formula is n(n - 1) / 2 = 10(9) / 2 = 45 unique shared keys. (By contrast, asymmetric PKI requires only 2n = 20 keys—one keypair per executive.)',
            },
            {
              id: 'cissp-d3-l2-q2',
              question:
                'An attorney must email a merger contract to opposing counsel so that the recipient can prove the contract was unaltered AND could only have been sent by the attorney (non-repudiation). Which operation achieves this?',
              options: [
                'Encrypting the contract with a shared AES-256 key',
                'Computing a SHA-256 hash of the contract and encrypting the hash with the attorney’s PRIVATE key',
                'Encrypting the contract with the opposing counsel’s PUBLIC key',
                'Encrypting the contract with the attorney’s PUBLIC key',
              ],
              correctIndex: 1,
              rationale:
                'A digital signature—hashing the message and encrypting the digest with the SENDER’s private key—provides integrity, sender authentication, and non-repudiation. Encrypting with recipient’s public key provides only confidentiality.',
            },
            {
              id: 'cissp-d3-l2-q3',
              question:
                'Which cryptographic capability ensures that an adversary who records encrypted TLS traffic today and steals the web server’s private RSA certificate key two years later STILL cannot decrypt the recorded sessions?',
              options: [
                'AES-256-ECB mode',
                'Perfect Forward Secrecy (PFS) using Ephemeral Elliptic Curve Diffie-Hellman (ECDHE)',
                'Certificate Pinning with CRL distribution points',
                'Key Escrow backed by Hardware Security Modules',
              ],
              correctIndex: 1,
              rationale:
                'Perfect Forward Secrecy (PFS) generates unique ephemeral session keys via ECDHE/DHE that are never derived solely from the server’s long-term private key and are discarded immediately after each session.',
            },
          ],
          practicalDrill: {
            title: 'Hybrid Cryptography & PKI Architecture Walkthrough',
            prompt:
              'Design an end-to-end encrypted and signed document exchange protocol for a global legal consortium.',
            steps: [
              'Choose AES-256-GCM (random 96-bit IV/nonce) for payload confidentiality and integrity.',
              'Wrap the ephemeral AES session key with the recipient’s ECC/RSA public key (or ECDHE for PFS).',
              'Compute SHA-256 digest of the payload and sign with sender’s private key stored in a FIPS 140-3 Level 3 HSM.',
              'Enable OCSP Stapling on gateways and map a 2-year Post-Quantum migration roadmap to NIST ML-KEM / ML-DSA.',
            ],
            successCriteria:
              'Protocol achieves CIA + Non-Repudiation + PFS without using ECB, SHA-1, or raw asymmetric bulk encryption.',
          },
          flashcards: [
            { front: 'How many keys do 20 users need in Symmetric vs. Asymmetric encryption?', back: 'Symmetric = n(n-1)/2 = 20(19)/2 = 190 keys. Asymmetric = 2n = 40 keys.', tag: 'cissp-d3' },
            { front: 'Which key creates a Digital Signature, and which key verifies it?', back: 'Sender’s PRIVATE key signs the hash; Sender’s PUBLIC key verifies the signature.', tag: 'cissp-d3' },
            { front: 'Why should AES-ECB NEVER be used for multi-block data?', back: 'Identical plaintext blocks produce identical ciphertext blocks, leaking clear visual and structural patterns.', tag: 'cissp-d3' },
          ],
          sourceRefs: [
            'my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf',
            'my_documents/CISSP Cheat sheet-1.pdf',
          ],
        },
        {
          id: 'cissp-d3-l3',
          title: 'Physical Security, Facility Design, Fire Suppression & Modern Architectures',
          estimatedMinutes: 40,
          summary:
            'Apply Crime Prevention Through Environmental Design (CPTED), layered physical perimeters, fire classes and suppression agents, plus architectural security for ICS/OT, IoT, and Embedded systems.',
          learningObjectives: [
            'Design concentric physical defenses using CPTED, mantraps/access control vestibules, lighting, fences, and fail-safe vs. fail-secure doors.',
            'Match Fire Classes (A, B, C, D, K) to appropriate water, gas, and dry-chemical suppression systems prioritizing human life safety.',
            'Evaluate water sprinkler systems (Wet Pipe, Dry Pipe, Pre-Action, Deluge) for data centers.',
            'Secure specialized architectures: Industrial Control Systems (ICS/SCADA/Purdue Model), IoT, and Microservices.',
          ],
          coreConcepts: [
            {
              heading: 'CPTED, Layered Perimeters & Fail-Safe vs. Fail-Secure',
              explanation:
                'Physical security applies Defense-in-Depth from property line inward (CPTED: natural surveillance, access control, territorial reinforcement — trim hedges, illuminate critical zones to 2 foot-candles / 8 feet high, use 8ft+ fences with top-guards to deter serious intruders, bollards against vehicle ramming, and access control vestibules/mantraps preventing tailgating/piggybacking). Critical CISSP life-safety distinction: Fail-Safe (Fail-Open) doors UNLOCK upon power failure so humans can escape fires safely; Fail-Secure (Fail-Closed) doors STAY LOCKED upon power loss (acceptable ONLY where alternate physical emergency exits/crash bars ensure human escape!).',
              mentalModel:
                'Fail-SAFE saves PEOPLE (unlocks so humans escape); Fail-SECURE saves ASSETS (locks tight). Remember: Human Life Safety ALWAYS comes first!',
              formulaOrRule: 'Power Failure on Human Exit Door -> Fail-Safe (Unlocks). Server Room High-Security Vault -> Fail-Secure + Mechanical Emergency Egress Bar.',
            },
            {
              heading: 'Fire Classes & Data Center Suppression Systems',
              explanation:
                'Know the 5 Fire Classes: Class A (Common combustibles: wood/paper -> Water/Soda-acid), Class B (Flammable liquids/oil -> CO2, Halon substitutes, Foam), Class C (Energized Electrical equipment — DATA CENTERS! -> CO2 or Clean Agents like FM-200 / Novec 1230; NEVER plain water on live electricity!), Class D (Combustible metals -> Dry powder), Class K (Commercial kitchen grease -> Wet chemical). For water sprinklers in server rooms, Pre-Action (dry pipe) is preferred over Wet Pipe because it requires TWO independent triggers (smoke/heat sensor fills pipe, then fusible sprinkler link melts) preventing accidental leaks from ruining hardware. Never use CO2 in occupied rooms without evacuation alarms—CO2 suffocates humans!',
              mentalModel:
                'A = Ash (wood), B = Boil (liquids), C = Current (electrical), D = Dents (metals), K = Kitchen. Pre-Action sprinklers act like two-factor authentication for water.',
              formulaOrRule: 'Occupied Data Center Fire Suppression = Clean Agent (FM-200/Novec 1230) or Pre-Action Sprinkler. NEVER CO2 in occupied spaces without delay/alarm!',
            },
            {
              heading: 'ICS/OT/SCADA & Purdue Model Segmentation',
              explanation:
                'Operational Technology (OT) and Industrial Control Systems (ICS/SCADA/PLCs) invert the traditional IT CIA triad: Safety & AVAILABILITY come FIRST, then Integrity, then Confidentiality! Legacy PLCs often lack authentication, run fragile real-time firmware that crashes during active vulnerability scans, and cannot be rebooted for monthly patching. Therefore, OT security relies on strict network isolation (Purdue Model Levels 0–5 with an Industrial DMZ separating Enterprise IT from Plant OT), passive network monitoring, and unidirectional security gateways (data diodes).',
              mentalModel:
                'Running an aggressive Nmap/Nessus scan against a power-plant PLC can freeze a turbine—always use passive monitoring and a strict OT DMZ.',
              formulaOrRule: 'IT Priority = C-I-A | ICS/OT Priority = Safety -> Availability -> Integrity -> Confidentiality.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Fatal Fire-Suppression Mistake in a Staffed NOC',
            situation:
              'A facilities manager proposes installing an automated high-concentration CO2 flooding fire suppression system inside a 24/7 staffed Network Operations Center (NOC) to save money compared to clean-agent gas.',
            analysis:
              'While CO2 extinguishes Class C electrical fires cleanly without damaging servers, it works by displacing oxygen—which rapidly suffocates human operators! Under CISSP Canon 1 (Human Life Safety first), CO2 flooding is strictly reserved for unmanned equipment vaults. Occupied server rooms/NOCs require human-safe Clean Agents (FM-200, Novec 1230, Inergen) or Pre-Action sprinklers paired with audible evacuation strobes.',
            takeaway:
              'Human safety ALWAYS overrides equipment preservation or cost savings in every physical security question.',
          },
          examTraps: [
            'Tailgating = unauthorized person slips through a door WITHOUT the authorized employee’s awareness; Piggybacking = unauthorized person enters WITH the authorized employee’s consent/help (e.g., holding the door politely). Mantraps stop both!',
            'Fence heights on CISSP: 3–4 ft deters casual trespassers; 6–7 ft is too high to climb easily; 8 ft+ with barbed/razor wire top-guard deters determined intruders.',
            'Power anomaly vocabulary: Fault = momentary power loss; Blackout = complete prolonged loss; Sag = momentary low voltage; Brownout = prolonged low voltage; Spike = momentary high voltage; Surge = prolonged high voltage.',
          ],
          keyTerms: [
            { term: 'CPTED', definition: 'Crime Prevention Through Environmental Design—shaping physical spaces (lighting, sightlines, landscaping) to deter crime naturally.' },
            { term: 'Pre-Action Sprinkler', definition: 'Dry-pipe fire suppression system requiring two triggers (detection alarm + heat-activated sprinkler head) before releasing water.' },
            { term: 'Fail-Safe vs. Fail-Secure', definition: 'Fail-Safe unlocks doors during power loss to protect human life; Fail-Secure keeps doors locked to protect assets.' },
            { term: 'Purdue Model', definition: 'Reference architecture segmenting Enterprise IT networks from Industrial Control Systems (OT/SCADA) via an Industrial DMZ.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d3-l3-q1',
              question:
                'Which water-based fire suppression system is BEST suited for a high-value enterprise data center to minimize the risk of accidental water discharge damaging live server racks?',
              options: [
                'Wet-pipe sprinkler system',
                'Deluge sprinkler system',
                'Pre-action dry-pipe sprinkler system',
                'Pressurized Class K foam system',
              ],
              correctIndex: 2,
              rationale:
                'A Pre-Action system keeps pipes dry until a fire sensor opens the pre-action valve, and STILL waits for an individual sprinkler head’s thermal link to melt before discharging water—giving operators time to respond to false alarms and preventing burst-pipe flooding.',
            },
            {
              id: 'cissp-d3-l3-q2',
              question:
                'A prolonged drop in utility electrical voltage lasting several hours dims facility lights and stresses unconditioned server power supplies. Which power anomaly is occurring?',
              options: [
                'Sag',
                'Brownout',
                'Blackout',
                'Spike',
              ],
              correctIndex: 1,
              rationale:
                'A Brownout is a prolonged drop in voltage. A Sag is only a momentary low-voltage dip; a Blackout is a complete prolonged loss of power; a Spike is a momentary high-voltage surge.',
            },
          ],
          practicalDrill: {
            title: 'Data Center Physical Defense & Fire Safety Audit',
            prompt:
              'Design concentric physical and environmental controls for a newly built Tier-III enterprise data center housing a staffed operations pod.',
            steps: [
              'Perimeter: CPTED landscaping, 8ft fence + top-guard, bollards, and 2 foot-candle lighting.',
              'Entry: Badge + biometric two-factor access control vestibule (mantrap) defeating tailgating/piggybacking.',
              'Safety: Fail-Safe doors on occupied exits, Clean Agent (FM-200/Novec 1230) or Pre-Action sprinklers in server floor (NO CO2 in staffed zones).',
              'Power/HVAC: Dual utility feeds + UPS + Diesel Generator + 40–60% RH hot/cold aisle containment.',
            ],
            successCriteria:
              'Audit prioritizes human life safety (Fail-Safe exits, non-lethal suppression), defeats tailgating, and covers power/HVAC resilience.',
          },
          flashcards: [
            { front: 'Memorize all 6 electrical power anomalies (Momentary vs. Prolonged).', back: 'Loss: Fault (momentary) / Blackout (prolonged). Low Voltage: Sag (momentary) / Brownout (prolonged). High Voltage: Spike (momentary) / Surge (prolonged).', tag: 'cissp-d3' },
            { front: 'Tailgating vs. Piggybacking?', back: 'Tailgating = sneaking in behind someone WITHOUT their knowledge; Piggybacking = entering WITH the authorized person’s assistance/consent.', tag: 'cissp-d3' },
            { front: 'Why must CO2 flooding NOT be used in occupied server rooms?', back: 'CO2 extinguishes fire by displacing oxygen, posing a fatal asphyxiation hazard to humans (violating life safety priority).', tag: 'cissp-d3' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: COMMUNICATION AND NETWORK SECURITY (13%)
    // =================================================================
    {
      id: 'cissp-d4',
      domainNumber: 4,
      title: 'Communication and Network Security',
      examWeightPercent: 13,
      overview:
        'Covers secure network architecture across OSI and TCP/IP layers, segmentation (VLANs, DMZs, SDN, Zero Trust, SASE), wireless security (WPA3/802.1X), encrypted channels (TLS 1.3, IPsec AH/ESP), and mitigating network-layer threats.',
      lessons: [
        {
          id: 'cissp-d4-l1',
          title: 'OSI/TCP-IP Deep Architecture, Network Segmentation, SDN & Wireless Security',
          estimatedMinutes: 45,
          summary:
            'Map security controls and attacks accurately across all 7 OSI layers, architect modern zero-trust/SDN micro-segmented topologies, and harden enterprise Wi-Fi with WPA3-Enterprise and 802.1X.',
          learningObjectives: [
            'Map protocols, devices, PDUs, and security threats across OSI Layers 1–7 and the 4-layer TCP/IP model.',
            'Design resilient network segmentation using screened subnets (DMZs), VLANs, NAC (802.1X), SDN, and micro-segmentation.',
            'Compare wireless encryption standards (WEP, WPA2-CCMP, WPA3-SAE/GCMP) and EAP authentication variants (EAP-TLS vs. PEAP).',
            'Evaluate converged protocols (VoIP/SRTP, FCoE, MPLS, SD-WAN) and prevent Layer 2 attacks (ARP spoofing, MAC flooding, VLAN hopping).',
          ],
          coreConcepts: [
            {
              heading: 'OSI 7-Layer Security Control & Attack Map',
              explanation:
                'CISSP expects instant fluency linking protocols and defenses to exact OSI layers: Layer 1 Physical (bits, hubs, fiber taps, EMI shielding); Layer 2 Data Link (frames, MAC addresses, switches, ARP, 802.1X/NAC, STP—defend against ARP spoofing with Dynamic ARP Inspection & port security); Layer 3 Network (packets, IP, ICMP, routers, IPsec, packet-filtering firewalls); Layer 4 Transport (segments, TCP/UDP ports, stateful firewalls, TLS); Layer 5 Session (dialog control, RPC, NetBIOS); Layer 6 Presentation (formatting, compression, encryption); Layer 7 Application (HTTP, DNS, SMTP, Next-Gen Firewalls/WAFs inspecting deep payload semantics).',
              mentalModel:
                'Mnemonic from bottom to top: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application). PDU order: Bits -> Frames -> Packets -> Segments -> Data.',
              formulaOrRule: 'Layer 2 = Frames/MAC/Switch/ARP/802.1X | Layer 3 = Packets/IP/Router/IPsec | Layer 4 = Segments/TCP-UDP/Stateful FW | Layer 7 = WAF/Proxy/NGFW.',
            },
            {
              heading: 'Firewall Evolution & Enterprise Network Access Control (802.1X)',
              explanation:
                'Firewalls evolved across four generations: Packet-Filtering (stateless Layer 3/4 ACLs—fast, blind to session state), Stateful Inspection (tracks TCP connection state table at Layer 4), Application Proxy / Circuit-Level Gateways (terminates and rebuilds connections hiding internal IPs), and Next-Generation Firewalls (NGFW — deep Layer 7 app/user identity awareness + integrated IPS). IEEE 802.1X enforces Port-Based Network Access Control (NAC) at Layer 2 using three roles: Supplicant (client endpoint), Authenticator (switch or wireless AP), and Authentication Server (RADIUS/AAA server).',
              mentalModel:
                '802.1X at a club door: Supplicant is the guest showing ID, Authenticator is the bouncer holding the velvet rope, and the RADIUS server is the VIP database confirming membership.',
              formulaOrRule: '802.1X Triad: Supplicant (Client) -> Authenticator (Switch/AP) -> Authentication Server (RADIUS/AAA).',
            },
            {
              heading: 'Enterprise Wireless Security (WPA3 & EAP-TLS)',
              explanation:
                'Never deploy WEP (broken RC4/IV) or WPA-TKIP. WPA2 uses AES-CCMP (vulnerable to KRACK and offline dictionary attacks in Personal PSK mode). WPA3 replaces PSK with Simultaneous Authentication of Equals (SAE / Dragonfly handshake), providing forward secrecy and neutralizing offline brute-force attacks, while WPA3-Enterprise 192-bit mode enforces CNSA-grade GCMP-256 encryption. For enterprise authentication, EAP-TLS is the gold standard because it enforces MUTUAL X.509 certificate authentication (both server AND client verify certificates—defeating Evil Twin rogue APs!).',
              mentalModel:
                'EAP-TLS checks BOTH IDs before speaking—your laptop verifies the Wi-Fi network’s certificate AND the network verifies your laptop’s certificate, neutralizing fake rogue hotspots.',
              formulaOrRule: 'Strongest Wi-Fi Auth = WPA3-Enterprise + 802.1X + EAP-TLS (Mutual Certificates). Personal Wi-Fi = WPA3-SAE (stops offline dictionary attacks).',
            },
          ],
          realWorldScenario: {
            title: 'Defeating an Evil Twin Rogue Access Point at a Corporate Headquarters',
            situation:
              'An attacker sits in a café outside corporate HQ broadcasting the company’s exact Wi-Fi SSID ("CorpSecure") using a high-gain antenna. Employees running WPA2-Enterprise with PEAP-MSCHAPv2 click "Accept Certificate Warning" and leak hashed domain credentials.',
            analysis:
              'PEAP only authenticates the server via certificate (if users ignore warnings or certificate validation isn’t pinned via MDM, credentials leak). Migrating to WPA3-Enterprise with EAP-TLS (mutual device certificates deployed via MDM + strict server CA pinning) plus WIPS (Wireless Intrusion Prevention) neutralizes Evil Twin harvesting completely.',
            takeaway:
              'Always pair enterprise Wi-Fi with mutual certificate authentication (EAP-TLS) and MDM-enforced server certificate validation.',
          },
          examTraps: [
            'Do NOT rely on SSID hiding or MAC filtering as real wireless security—both are trivial to sniff and spoof in seconds.',
            'Know the exact 802.1X component names: the switch/AP is the Authenticator (NOT the Authentication Server—that’s RADIUS!).',
            'VLANs segment broadcast domains at Layer 2, NOT inherently impenetrable firewalls—always harden trunk ports (disable DTP, change native VLAN from VLAN 1) to stop VLAN Hopping.',
          ],
          keyTerms: [
            { term: 'IEEE 802.1X', definition: 'Port-based Network Access Control standard authenticating devices at Layer 2 via Supplicant, Authenticator, and RADIUS server.' },
            { term: 'WPA3-SAE', definition: 'Simultaneous Authentication of Equals—WPA3 password-authenticated key exchange defeating offline dictionary attacks and providing forward secrecy.' },
            { term: 'EAP-TLS', definition: 'Extensible Authentication Protocol requiring mutual X.509 certificates on both client and authentication server; strongest enterprise EAP method.' },
            { term: 'Screened Subnet (DMZ)', definition: 'Isolated perimeter network segment hosting public-facing servers between external and internal firewalls to protect the internal LAN.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d4-l1-q1',
              question:
                'During an IEEE 802.1X wired authentication workflow, which component blocks all non-EAP network traffic on a physical switch port until the central RADIUS server returns an Access-Accept message?',
              options: [
                'Supplicant',
                'Authenticator',
                'Identity Provider',
                'Certificate Authority',
              ],
              correctIndex: 1,
              rationale:
                'The Authenticator (the network switch or wireless access point) controls the physical/logical port gate—blocking general traffic while relaying EAP frames between the Supplicant (endpoint) and Authentication Server (RADIUS).',
            },
            {
              id: 'cissp-d4-l1-q2',
              question:
                'Which Wi-Fi authentication mechanism provides the STRONGEST resistance against both credential-stuffing and Evil Twin rogue access points in an enterprise environment?',
              options: [
                'WPA2-PSK with SSID broadcasting disabled and MAC allowlisting',
                'WPA3-Enterprise using 802.1X with EAP-TLS mutual certificate authentication',
                'Captive portal authentication over open Wi-Fi',
                'WEP-128 with rotated static keys',
              ],
              correctIndex: 1,
              rationale:
                'WPA3-Enterprise with EAP-TLS mandates mutual X.509 certificate verification between endpoint and RADIUS server, preventing rogue Evil Twin APs and eliminating static password harvesting.',
            },
          ],
          practicalDrill: {
            title: 'Zero-Trust Campus & Wireless Architecture Upgrade',
            prompt:
              'Redesign a flat corporate LAN/WLAN vulnerable to ARP spoofing, rogue laptops, and Evil Twin Wi-Fi.',
            steps: [
              'Segment the network into User, Server, IoT/OT, Guest, and Screened Subnet (DMZ) zones with NGFW east-west inspection.',
              'Deploy 802.1X NAC across all wired switch ports with Dynamic ARP Inspection (DAI) and DHCP Snooping.',
              'Migrate Wi-Fi to WPA3-Enterprise + EAP-TLS with MDM-pushed client/root certificates.',
            ],
            successCriteria:
              'Design eliminates flat Layer 2 lateral movement, secures wired ports via 802.1X, and hardens Wi-Fi via mutual EAP-TLS.',
          },
          flashcards: [
            { front: 'List the 7 OSI layers and their exact Protocol Data Units (PDUs).', back: 'L7 App/L6 Pres/L5 Sess = Data; L4 Transport = Segment; L3 Network = Packet; L2 Data Link = Frame; L1 Physical = Bits.', tag: 'cissp-d4' },
            { front: 'What are the 3 roles in IEEE 802.1X?', back: 'Supplicant (client device), Authenticator (switch/AP), and Authentication Server (RADIUS/AAA).', tag: 'cissp-d4' },
            { front: 'How does WPA3-Personal (SAE) improve on WPA2-PSK?', back: 'SAE replaces the 4-way PSK handshake with Dragonfly key exchange, preventing offline dictionary cracking and adding forward secrecy.', tag: 'cissp-d4' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d4-l2',
          title: 'Secure Channels (IPsec, TLS 1.3, DNSSEC) & Network Threat Defense',
          estimatedMinutes: 45,
          summary:
            'Master IPsec protocols (AH vs. ESP, Tunnel vs. Transport mode, IKEv2), TLS 1.3 handshake security, DNSSEC/SPF/DKIM/DMARC authentication, and layered DDoS/MITM defense.',
          learningObjectives: [
            'Compare IPsec Authentication Header (AH — integrity/auth ONLY) vs. Encapsulating Security Payload (ESP — adds confidentiality) and Transport vs. Tunnel mode.',
            'Explain TLS 1.3 improvements (mandatory PFS, 1-RTT handshake, removal of weak ciphers like RC4/SHA-1/static RSA).',
            'Deploy email and DNS security protocols: DNSSEC (stops cache poisoning), SPF, DKIM, and DMARC.',
            'Architect defenses against volumetric, protocol, and application-layer DDoS, BGP hijacking, and Man-in-the-Middle attacks.',
          ],
          coreConcepts: [
            {
              heading: 'IPsec Architecture: AH vs. ESP & Transport vs. Tunnel Mode',
              explanation:
                'IPsec operates at Layer 3 (Network) using IKEv2 (Internet Key Exchange) to establish Security Associations (SAs — unidirectional trust parameters identified by an SPI). Choose the right protocol: Authentication Header (AH, IP Protocol 51) provides Integrity, Origin Authentication, and Anti-Replay ONLY (NO encryption, breaks through NAT!); Encapsulating Security Payload (ESP, IP Protocol 50) provides Confidentiality (encryption) PLUS optional integrity/authentication and works with NAT-Traversal (UDP 4500). Choose the right mode: Transport Mode encrypts ONLY the payload (leaving the original IP header visible — used host-to-host inside a trusted LAN); Tunnel Mode encrypts the ENTIRE original IP packet and wraps it in a new outer IP header (used gateway-to-gateway VPNs across the untrusted internet).',
              mentalModel:
                'Transport Mode seals the letter inside a clear envelope (addresses visible); Tunnel Mode puts the entire original envelope inside a brand-new armored FedEx box (hiding original internal IPs).',
              formulaOrRule: 'Confidentiality in IPsec = ESP (NEVER AH!). Site-to-Site VPN over Internet = ESP Tunnel Mode.',
            },
            {
              heading: 'TLS 1.3 & Email/DNS Trust Protocols',
              explanation:
                'TLS 1.3 stripped away legacy vulnerable cipher suites (static RSA key exchange, CBC mode, MD5/SHA-1, RC4), mandated Ephemeral Diffie-Hellman (Perfect Forward Secrecy) and AEAD ciphers (AES-GCM/ChaCha20-Poly1305), and cut handshake latency to 1-RTT. For DNS integrity, DNSSEC cryptographically signs DNS records to prevent DNS Cache Poisoning/Spoofing (note: DNSSEC provides integrity/auth, NOT confidentiality—use DoH/DoT for DNS privacy!). For email anti-spoofing: SPF lists authorized sending IP addresses in DNS; DKIM cryptographically signs outgoing emails; DMARC ties SPF + DKIM together with alignment policy (`none`, `quarantine`, `reject`) and aggregate reporting.',
              mentalModel:
                'SPF checks the return-address zip code; DKIM checks the wax signature seal; DMARC tells the post office to shred any forged mail failing those checks.',
              formulaOrRule: 'DNS Integrity = DNSSEC | DNS Privacy = DoH/DoT | Anti-Phishing/Spoofing Email Triad = SPF + DKIM + DMARC (p=reject).',
            },
          ],
          realWorldScenario: {
            title: 'Stopping Executive Impersonation & Securing Branch-to-Cloud Traffic',
            situation:
              'Attackers spoofed the CEO’s exact domain to send fraudulent wire requests to partners, while a branch office attempted to connect to HQ using IPsec AH through a NAT router—causing VPN tunnels to fail repeatedly.',
            analysis:
              'First, publishing strict SPF, DKIM signing, and DMARC (`p=reject`) stops unauthorized servers from spoofing the corporate domain. Second, IPsec AH authenticates the outer IP header (which NAT rewrites, invalidating the checksum!) and provides zero encryption. Switching to IPsec ESP in Tunnel Mode with NAT-T (UDP 4500) delivers both confidentiality and NAT compatibility.',
            takeaway:
              'Know protocol mechanics down to the header: AH fails across NAT and does not encrypt; ESP Tunnel Mode is the enterprise VPN standard.',
          },
          examTraps: [
            'CISSP classic: IPsec AH provides ZERO encryption/confidentiality! Whenever a question demands confidential VPN traffic, ALWAYS select ESP.',
            'IPsec Security Associations (SAs) are UNIDIRECTIONAL—therefore a standard bidirectional ESP tunnel requires TWO SAs (one inbound, one outbound).',
            'DNSSEC guarantees DNS data authenticity/integrity—it does NOT encrypt DNS queries (that’s DNS-over-HTTPS [DoH] or DNS-over-TLS [DoT]).',
          ],
          keyTerms: [
            { term: 'IPsec ESP', definition: 'Encapsulating Security Payload—Layer 3 protocol delivering confidentiality (encryption), optional integrity, authentication, and anti-replay.' },
            { term: 'IPsec Tunnel Mode', definition: 'Mode encapsulating and encrypting the entire original IP packet inside a new outer IP header for site-to-site VPNs.' },
            { term: 'Security Association (SA)', definition: 'Unidirectional agreement specifying cryptographic algorithms, keys, and parameters for an IPsec connection.' },
            { term: 'DMARC', definition: 'Email authentication policy protocol unifying SPF and DKIM alignment to instruct receiving servers to quarantine or reject spoofed mail.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d4-l2-q1',
              question:
                'Two branch offices must transmit confidential financial transactions across the public internet while concealing internal private IP addressing behind NAT gateways. Which IPsec configuration MUST be deployed?',
              options: [
                'AH in Transport Mode',
                'AH in Tunnel Mode',
                'ESP in Transport Mode',
                'ESP in Tunnel Mode with NAT-T',
              ],
              correctIndex: 3,
              rationale:
                'ESP provides encryption/confidentiality (AH does not), Tunnel Mode encrypts the entire original IP packet hiding internal IP headers, and NAT-T (UDP 4500) permits traversal across NAT gateways.',
            },
            {
              id: 'cissp-d4-l2-q2',
              question:
                'Which protocol prevents an attacker from poisoning recursive DNS caches with forged IP addresses by validating cryptographic signatures on DNS resource records?',
              options: [
                'TLS 1.3',
                'DNSSEC',
                'DMARC',
                'BGP-4',
              ],
              correctIndex: 1,
              rationale:
                'DNSSEC adds public-key cryptographic signatures (RRSIG) to DNS zones so resolvers verify record authenticity and integrity, stopping DNS cache poisoning.',
            },
          ],
          practicalDrill: {
            title: 'Encrypted Channel & Anti-Spoofing Hardening Plan',
            prompt:
              'Upgrade a legacy enterprise’s external communications from TLS 1.1, unauthenticated email, and unencrypted branch WAN links.',
            steps: [
              'Enforce TLS 1.3 (AEAD + ECDHE PFS) across all external web/API gateways and disable TLS 1.0/1.1.',
              'Configure IPsec ESP Tunnel Mode (IKEv2 + AES-256-GCM) between branch offices and cloud VPC gateways.',
              'Deploy DNSSEC on public authoritative zones and stage DMARC rollout (`p=none` -> `quarantine` -> `reject`) backed by SPF and DKIM.',
            ],
            successCriteria:
              'Plan enforces PFS via TLS 1.3, selects ESP Tunnel Mode for VPN confidentiality, and stages DMARC safely before enforcement.',
          },
          flashcards: [
            { front: 'IPsec AH vs. ESP?', back: 'AH = Integrity + AuthN + Anti-Replay ONLY (no encryption, breaks NAT); ESP = Confidentiality + optional Integrity/AuthN + works with NAT-T.', tag: 'cissp-d4' },
            { front: 'IPsec Transport Mode vs. Tunnel Mode?', back: 'Transport = encrypts payload only (host-to-host); Tunnel = encrypts entire original IP packet inside a new IP header (gateway-to-gateway VPN).', tag: 'cissp-d4' },
            { front: 'Does DNSSEC encrypt DNS queries?', back: 'NO—DNSSEC provides authenticity and integrity (stops cache poisoning). Encryption requires DoH or DoT.', tag: 'cissp-d4' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 5: IDENTITY AND ACCESS MANAGEMENT (IAM) (13%)
    // =================================================================
    {
      id: 'cissp-d5',
      domainNumber: 5,
      title: 'Identity and Access Management (IAM)',
      examWeightPercent: 13,
      overview:
        'Covers physical and logical access governance, AAA (Identification, Authentication, Authorization, Accountability), MFA & Biometrics (FAR/FRR/CER), Kerberos & Federated SSO (SAML/OIDC), access control models (MAC/DAC/RBAC/ABAC), PAM, and identity lifecycle management.',
      lessons: [
        {
          id: 'cissp-d5-l1',
          title: 'AAA, MFA, Biometrics (CER/EER) & Kerberos / Federated SSO',
          estimatedMinutes: 45,
          summary:
            'Master true multi-factor authentication, biometric accuracy metrics (Type I FRR, Type II FAR, CER), the Kerberos ticket-granting sequence, and RADIUS vs. TACACS+.',
          learningObjectives: [
            'Distinguish the 3 primary authentication factors (Knowledge, Possession, Inherence) and avoid single-factor traps.',
            'Interpret biometric error metrics: False Rejection Rate (FRR / Type I), False Acceptance Rate (FAR / Type II), and Crossover Error Rate (CER / EER).',
            'Trace the Kerberos v5 authentication workflow (AS, TGT, TGS, Service Ticket) and its vulnerabilities (Pass-the-Ticket, Golden Ticket, clock skew).',
            'Compare centralized AAA protocols: RADIUS (UDP, encrypts password only) vs. TACACS+ (TCP, encrypts entire payload, separates AAA).',
          ],
          coreConcepts: [
            {
              heading: 'Biometric Metrics: FRR (Type I), FAR (Type II) & CER',
              explanation:
                'Biometric accuracy balances usability against security using two opposing error rates: False Rejection Rate (FRR — Type I Error: mistakenly rejecting a LEGITIMATE user, hurting availability/usability) and False Acceptance Rate (FAR — Type II Error: mistakenly admitting an IMPOSTOR—the far more dangerous security failure!). Adjusting sensitivity down reduces FRR but raises FAR. The single best metric for comparing two biometric systems is the Crossover Error Rate (CER, also called Equal Error Rate / EER)—the point where FRR equals FAR. LOWER CER = MORE ACCURATE SYSTEM.',
              mentalModel:
                'Type I (FRR) locks the homeowner out in the rain (annoying); Type II (FAR) lets a burglar inside the vault (catastrophic!). Lower CER wins.',
              formulaOrRule: 'Type I = FRR (False Reject) | Type II = FAR (False Accept — worst security risk) | Best Overall Accuracy = Lowest CER (EER).',
            },
            {
              heading: 'Kerberos v5 Ticket Architecture & Weaknesses',
              explanation:
                'Kerberos provides single sign-on via symmetric cryptography inside Active Directory domains using a trusted third party called the Key Distribution Center (KDC), composed of the Authentication Service (AS) and Ticket Granting Service (TGS). Flow: (1) User authenticates to AS -> receives encrypted Ticket Granting Ticket (TGT); (2) User sends TGT to TGS requesting access to a file server -> TGS returns a Service Ticket (ST); (3) User presents ST to the file server. Strengths: passwords never cross the wire, mutual authentication. Weaknesses: KDC is a single point of failure (and compromising the `krbtgt` hash enables forged Golden Tickets), requires strict NTP time sync (<5 min skew) to stop replay attacks.',
              mentalModel:
                'Kerberos is an amusement park: show ID once at the front booth (AS) to get a wristband (TGT), show the wristband at the ticket kiosk (TGS) for a roller-coaster pass (Service Ticket), then hand that pass to the ride operator.',
              formulaOrRule: 'Kerberos Flow: Client -> AS (gets TGT) -> TGS (gets Service Ticket) -> Target Resource. Needs NTP <= 5 min skew.',
            },
            {
              heading: 'RADIUS vs. TACACS+ & True MFA',
              explanation:
                'True Multi-Factor Authentication requires AT LEAST TWO DIFFERENT factor categories: Type 1 (Something you KNOW: password/PIN), Type 2 (Something you HAVE: FIDO2 key, smart card, TOTP app), Type 3 (Something you ARE: iris/fingerprint biometric). A password plus a security question is NOT MFA (both are Type 1!). For network device AAA: RADIUS runs on UDP, combines Authentication and Authorization, and encrypts ONLY the password field; TACACS+ (Cisco) runs on TCP (reliable), cleanly SEPARATES Authentication, Authorization, and Accounting, and encrypts the ENTIRE packet payload—making TACACS+ superior for privileged router/firewall administration.',
              mentalModel:
                'RADIUS = UDP + Password-only encryption (great for Wi-Fi/VPN user access); TACACS+ = TCP + Full payload encryption + Separate AAA (gold standard for router/switch admins).',
              formulaOrRule: 'Network Device Admin AAA = TACACS+ (TCP, full encryption, per-command authorization). Wi-Fi/Remote User AAA = RADIUS (UDP).',
            },
          ],
          realWorldScenario: {
            title: 'Securing Privileged Core Router Administration & Stopping Credential Replay',
            situation:
              'Network engineers manage core data-center routers using shared local passwords over RADIUS, allowing any engineer to run destructive BGP commands without granular command-level logging or per-command authorization.',
            analysis:
              'RADIUS couples authentication with authorization and encrypts only passwords. Migrating core router management to TACACS+ enables per-command authorization (blocking junior engineers from running destructive config commands), encrypts the entire administrative session over TCP, and creates granular command-level accounting logs tied to individual MFA-verified identities.',
            takeaway:
              'Choose TACACS+ for privileged network infrastructure administration and FIDO2/WebAuthn for phishing-resistant workforce MFA.',
          },
          examTraps: [
            'CISSP biometric favorite: "Which single metric best compares the overall accuracy of two fingerprint scanners?" -> ALWAYS Crossover Error Rate (CER / EER) — and the LOWER the CER percentage, the BETTER the scanner!',
            'Wait: In high-security military vaults where keeping impostors out is paramount, tune sensitivity to minimize FAR (Type II Error), accepting a slightly higher FRR (Type I Error).',
            'Password + PIN + Mother’s Maiden Name = Single-Factor Authentication (all Type 1 Knowledge!). True MFA requires crossing categories.',
            'Remember: Kerberos uses SYMMETRIC cryptography internally (not asymmetric PKI, unless PKINIT smart-card extension is specified).',
          ],
          keyTerms: [
            { term: 'Crossover Error Rate (CER)', definition: 'Point where a biometric system’s False Rejection Rate equals its False Acceptance Rate; lower CER indicates higher overall accuracy.' },
            { term: 'False Acceptance Rate (FAR)', definition: 'Type II biometric error where an unauthorized impostor is erroneously authenticated—the most dangerous biometric failure.' },
            { term: 'Kerberos KDC', definition: 'Key Distribution Center combining Authentication Service (AS) and Ticket Granting Service (TGS) to issue SSO tickets.' },
            { term: 'TACACS+', definition: 'TCP-based AAA protocol encrypting the entire packet payload and separating Authentication, Authorization, and Accounting for network device admin.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d5-l1-q1',
              question:
                'A security director evaluates two retinal scanners for an enterprise research vault. Scanner A has a CER of 0.4%, while Scanner B has a CER of 1.2%. Which statement is TRUE?',
              options: [
                'Scanner B is more accurate because it has a higher CER',
                'Scanner A is more accurate overall because a lower CER indicates fewer combined Type I and Type II errors',
                'CER only measures enrollment throughput speed, not accuracy',
                'Both scanners have identical FAR values regardless of tuning',
              ],
              correctIndex: 1,
              rationale:
                'Crossover Error Rate (CER / EER) represents where FRR equals FAR. A lower CER directly indicates superior overall biometric accuracy.',
            },
            {
              id: 'cissp-d5-l1-q2',
              question:
                'Why is TACACS+ generally preferred over RADIUS for controlling administrative CLI access to core enterprise switches and firewalls?',
              options: [
                'TACACS+ uses connectionless UDP for lower overhead',
                'TACACS+ encrypts the entire packet payload over TCP and decouples Authentication, Authorization, and Accounting for per-command control',
                'RADIUS cannot integrate with Active Directory',
                'TACACS+ eliminates the need for individual user accounts',
              ],
              correctIndex: 1,
              rationale:
                'TACACS+ runs over reliable TCP, encrypts the entire payload (not just the password), and cleanly separates Authentication, Authorization, and Accounting—allowing granular per-command CLI authorization.',
            },
          ],
          practicalDrill: {
            title: 'Enterprise Authentication & AAA Hardening Blueprint',
            prompt:
              'Eliminate password-only logins across workforce SSO, network gear, and physical lab doors.',
            steps: [
              'Enforce FIDO2/WebAuthn hardware keys (Possession + Inherence/PIN) for all cloud and VPN logins.',
              'Verify NTP synchronization (<1 sec drift) across Active Directory domain controllers to protect Kerberos ticket integrity and rotate `krbtgt` twice post-incident.',
              'Deploy TACACS+ for core router/firewall CLI authorization and RADIUS for 802.1X Wi-Fi.',
              'Select biometric readers for R&D labs based on lowest CER and tune thresholds tightly to minimize Type II (FAR) errors.',
            ],
            successCriteria:
              'Blueprint clearly matches TACACS+ vs. RADIUS, applies true multi-category MFA, and minimizes FAR in high-security zones.',
          },
          flashcards: [
            { front: 'Type I vs. Type II biometric error?', back: 'Type I = FRR (False Rejection — rejects valid user); Type II = FAR (False Acceptance — admits impostor, highest security risk).', tag: 'cissp-d5' },
            { front: 'RADIUS vs. TACACS+ in 3 crisp differences?', back: 'RADIUS = UDP, encrypts password only, combines AuthN+AuthZ. TACACS+ = TCP, encrypts entire payload, separates AuthN/AuthZ/Accounting.', tag: 'cissp-d5' },
            { front: 'What type of cryptography does core Kerberos v5 use?', back: 'Symmetric cryptography (shared secret keys between KDC, clients, and service servers).', tag: 'cissp-d5' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d5-l2',
          title: 'Access Control Models (DAC, MAC, RBAC, ABAC), PAM & Identity Lifecycle',
          estimatedMinutes: 45,
          summary:
            'Select the optimal access control architecture for military, corporate, and cloud-dynamic environments, eliminate standing privilege via PAM/JIT, and stop Privilege Creep through recertification.',
          learningObjectives: [
            'Compare Discretionary (DAC), Mandatory (MAC), Role-Based (RBAC), Rule-Based (RuBAC), and Attribute-Based (ABAC) access controls.',
            'Eliminate standing admin rights via Privileged Access Management (PAM), Just-in-Time (JIT) elevation, and break-glass accounts.',
            'Prevent Privilege Creep and Orphaned Accounts through automated JML (Joiner-Mover-Leaver) provisioning and periodic access recertification.',
          ],
          coreConcepts: [
            {
              heading: 'The 5 Access Control Models Compared',
              explanation:
                'Master the exact triggers for each model: (1) DAC (Discretionary) — the DATA/FILE OWNER has discretion to grant permissions via ACLs (flexible, used in Windows/Linux filesystems, vulnerable to Trojan horses inheriting user rights); (2) MAC (Mandatory) — centralized OS/system enforces rigid security labels (Clearance vs. Classification); users CANNOT share files even if they created them (strongest confidentiality, military); (3) RBAC (Role-Based / Non-Discretionary) — permissions assigned to JOB ROLES, users assigned to roles (scalable for large enterprises with high turnover); (4) Rule-Based (RuBAC) — stateless IF/THEN rules (e.g., firewall ACLs, time-of-day login restrictions); (5) ABAC (Attribute-Based) — dynamic fine-grained policy engine combining Subject + Object + Action + Environment attributes (e.g., "Allow Physician in ER to edit Patient Record ONLY from managed tablet during shift").',
              mentalModel:
                'DAC = You own the house and hand out spare keys; MAC = The military assigns clearance badges; RBAC = Keys belong to the job title ("Branch Manager"); ABAC = Smart lock checking who you are, what room, what time, and which device.',
              formulaOrRule: 'High Turnover Enterprise -> RBAC | Dynamic Context-Aware Cloud/Zero Trust -> ABAC | Classified Military -> MAC | File Owner Decides -> DAC.',
            },
            {
              heading: 'Identity Lifecycle, Privilege Creep & PAM (JIT)',
              explanation:
                'Over years, employees transfer between departments (Finance -> Operations -> Marketing) accumulating old permissions without revoking prior roles—this is Privilege Creep (Aggregation of Privileges), which violates Least Privilege and Separation of Duties. Mitigate it via automated Joiner-Mover-Leaver (JML) IAM workflows integrated with HR and mandatory Periodic Access Reviews (Recertification) where Data Owners re-approve every user’s rights. For administrators, Privileged Access Management (PAM) eliminates "standing privilege" by vaulting credentials, enforcing Just-in-Time (JIT) ephemeral elevation with ticket approval, and recording every privileged session.',
              mentalModel:
                'Standing root privileges are leaving a loaded vault key sitting on your desk 24/7; JIT PAM checks out a self-destructing key for 60 minutes only when a verified work order exists.',
              formulaOrRule: 'Stop Privilege Creep = Automated Mover De-provisioning + Periodic Access Recertification. Secure Admins = Zero Standing Privilege + JIT PAM + Session Recording.',
            },
          ],
          realWorldScenario: {
            title: 'Unraveling Five Years of Privilege Creep Before a SOX Audit',
            situation:
              'During an external SOX audit, auditors discover that an Accounts Payable clerk who previously worked in IT Operations still retains database schema write access AND vendor payment approval rights—a severe Separation of Duties breach.',
            analysis:
              'The firm provisioned new roles when the clerk transferred ("Mover") without revoking legacy IT roles—classic Privilege Creep. Implementing HR-driven JML automation that strips prior-department roles upon transfer, paired with quarterly Data Owner Access Recertification and automated SoD conflict checks, closes the gap permanently.',
            takeaway:
              'The "Mover" stage of the Identity Lifecycle is where most enterprise privilege creep silently accumulates.',
          },
          examTraps: [
            'Never confuse RBAC (Role-Based — job functions) with RuBAC (Rule-Based — firewall/router IF-THEN conditions like IP/port/time).',
            'When a CISSP question asks for context-aware dynamic access (time of day + geolocation + device health + resource tag), ALWAYS pick ABAC!',
            'DAC’s classic exam flaw: because permissions follow the user’s identity, malware (Trojan horse) executed by a user automatically inherits all of that user’s discretionary permissions—MAC prevents this.',
          ],
          keyTerms: [
            { term: 'ABAC (Attribute-Based Access Control)', definition: 'Dynamic policy model evaluating subject, resource, action, and environmental attributes (location, time, device trust) per request.' },
            { term: 'Privilege Creep', definition: 'Gradual accumulation of unnecessary access rights over time as employees change roles without revoking prior permissions.' },
            { term: 'Access Recertification', definition: 'Periodic formal review by Data/Business Owners confirming every user’s current privileges remain justified by active job duties.' },
            { term: 'Just-in-Time (JIT) PAM', definition: 'Privileged Access Management practice granting temporary, time-bound elevated rights only upon verified approval, eliminating standing admin accounts.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d5-l2-q1',
              question:
                'A global hospital system wants doctors to access patient records ONLY when they are assigned to that patient’s ward, connecting from an encrypted hospital tablet, during their scheduled clinical shift. Which access control model BEST enforces these dynamic conditions?',
              options: [
                'Discretionary Access Control (DAC)',
                'Mandatory Access Control (MAC)',
                'Attribute-Based Access Control (ABAC)',
                'Static Role-Based Access Control (RBAC)',
              ],
              correctIndex: 2,
              rationale:
                'ABAC evaluates rich combinations of subject attributes (doctor/ward), resource attributes (patient record), and environmental attributes (managed device, shift hours) dynamically at access time.',
            },
            {
              id: 'cissp-d5-l2-q2',
              question:
                'Which governance process is MOST effective at detecting and remediating Privilege Creep accumulated by long-tenured employees who have transferred across multiple business units?',
              options: [
                'Increasing password complexity to 16 characters',
                'Conducting periodic Access Reviews (Recertification) by Data Owners',
                'Enabling full-disk encryption on employee laptops',
                'Deploying an external Web Application Firewall',
              ],
              correctIndex: 1,
              rationale:
                'Periodic Access Recertification requires Data Owners to audit and re-validate active user permissions against current job responsibilities, identifying and revoking stale privileges from prior roles.',
            },
          ],
          practicalDrill: {
            title: 'Zero Standing Privilege & Recertification Charter',
            prompt:
              'Design an enterprise IAM governance policy eliminating standing root rights and privilege creep.',
            steps: [
              'Select RBAC for baseline department access layered with ABAC conditional access policies (device posture + geo-velocity).',
              'Move all domain/cloud administrators into a JIT PAM workflow with 2-hour max elevation, MFA, and full session recording.',
              'Connect Workday/HR Mover & Leaver events to automated SCIM de-provisioning plus quarterly privileged / semi-annual standard access recertification.',
            ],
            successCriteria:
              'Charter eliminates standing admin rights, prevents Mover privilege creep, and assigns recertification accountability to Data Owners.',
          },
          flashcards: [
            { front: 'DAC vs. MAC vs. RBAC vs. ABAC in one phrase each?', back: 'DAC = owner decides; MAC = OS enforces rigid labels; RBAC = assigned by job role; ABAC = dynamic multi-attribute context policies.', tag: 'cissp-d5' },
            { front: 'What causes Privilege Creep and what control catches it?', back: 'Caused by employees changing roles ("Movers") without revoking old rights; caught by Periodic Access Recertification and HR-driven JML automation.', tag: 'cissp-d5' },
            { front: 'What is Zero Standing Privilege?', back: 'Eliminating permanent always-on admin accounts in favor of Just-in-Time (JIT) ephemeral elevation approved per task.', tag: 'cissp-d5' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 6: SECURITY ASSESSMENT AND TESTING (12%)
    // =================================================================
    {
      id: 'cissp-d6',
      domainNumber: 6,
      title: 'Security Assessment and Testing',
      examWeightPercent: 12,
      overview:
        'Covers designing and validating assessment strategies: internal/external/third-party audits, SOC 1/2/3 assurance, vulnerability scanning vs. penetration testing (Black/Gray/White Box), software testing (Fuzzing, Mutation, Interface, Code Coverage), and security metrics/KPIs.',
      lessons: [
        {
          id: 'cissp-d6-l1',
          title: 'Security Audits, Vulnerability Scanning vs. Penetration Testing & Code Testing',
          estimatedMinutes: 45,
          summary:
            'Distinguish audits, vulnerability assessments, and penetration tests; enforce written Rules of Engagement; and master software assurance testing methods including Fuzzing, Code Reviews, and Synthetic Transactions.',
          learningObjectives: [
            'Differentiate First-Party (Internal), Second-Party (Customer-on-Vendor), and Third-Party (Independent Accredited) audits.',
            'Contrast Vulnerability Assessments (identify & prioritize flaws) with Penetration Testing (actively exploit flaws under signed Rules of Engagement).',
            'Compare White-Box (Crystal), Gray-Box, and Black-Box testing scopes and phases (Recon, Scanning, Gaining Access, Maintaining Access, Reporting).',
            'Apply software test methods: SAST, DAST, Mutation/Dumb vs. Generation/Smart Fuzzing, Regression Testing, and Code Coverage.',
          ],
          coreConcepts: [
            {
              heading: 'Vulnerability Assessment vs. Penetration Testing & Rules of Engagement',
              explanation:
                'A Vulnerability Assessment uses automated scanners (authenticated credentialed scans yield far deeper accuracy and fewer false positives than unauthenticated scans!) to inventory weaknesses without exploiting them. A Penetration Test goes further by actively exploiting vulnerabilities to prove real-world business impact and attack-chain feasibility. Cardinal CISSP rule: NEVER run a penetration test without explicit, written authorization signed by Senior Management AND defined Rules of Engagement (RoE) specifying exact in-scope IPs, off-limits systems, testing hours, emergency contacts, and data-handling limits!',
              mentalModel:
                'A vulnerability scan checks every door and window to see which locks look loose; a penetration tester gets signed written permission from the owner to actually pick the lock and see if they can reach the safe.',
              formulaOrRule: 'Pen Test Prerequisite #1 = Signed Written Management Authorization + Rules of Engagement (RoE). Credentialed Scans > Unauthenticated Scans.',
            },
            {
              heading: 'Fuzzing, Interface Testing, Synthetic Transactions & Code Reviews',
              explanation:
                'Beyond SAST and DAST, CISSP tests specialized verification techniques: Fuzzing injects malformed, random, or boundary-breaking inputs to trigger crashes or memory leaks—Mutation (Dumb) Fuzzing flips random bits in valid inputs, whereas Generational (Smart) Fuzzing builds malformed inputs using protocol/schema models to penetrate deeper code paths. Interface Testing validates API, UI, and physical subsystem handoffs. Synthetic Transactions (Passive/Active synthetic scripts) simulate real customer logins/checkouts continuously to benchmark availability and performance. Fagan Inspection is a formal, structured peer code-review methodology following strict planning, overview, preparation, inspection, rework, and follow-up stages.',
              mentalModel:
                'Mutation fuzzing bangs randomly on the keyboard; Generational fuzzing speaks the app’s exact grammar while slipping poisoned words inside to bypass front-door checks.',
              formulaOrRule: 'Smart/Generational Fuzzing = model-aware (deeper coverage); Dumb/Mutation Fuzzing = bit-flipping existing inputs. Code Coverage = % of paths tested.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Liability Disaster During a Red-Team Engagement',
            situation:
              'An IT manager verbally asks an external consultant over coffee to "test our public web portal and cloud database this weekend and send me a report." During the test, the consultant crashes a shared third-party payment partner’s API.',
            analysis:
              'Verbal permission from a mid-level IT manager is legally worthless and exposes both the consultant and company to criminal CFAA/Computer Misuse Act liability and partner breach-of-contract suits. Every penetration test requires formal written authorization from Senior Executive Management, explicit written Rules of Engagement excluding third-party infrastructure, and CSP policy compliance.',
            takeaway:
              'Without signed executive authorization and crystal-clear Rules of Engagement, penetration testing is indistinguishable from an illegal cyberattack.',
          },
          examTraps: [
            'Know the 3 Audit Parties: First-Party = Internal Audit (least independent); Second-Party = Customer auditing a Vendor; Third-Party = Accredited independent external firm (highest objectivity/independence).',
            'Watch out for "Authenticated vs. Unauthenticated" vulnerability scans: Authenticated (credentialed) scans see missing OS patches and registry configs directly with fewer false positives; Unauthenticated scans show only what an external attacker sees from outside.',
            'False Positive = scanner cries wolf (flags safe system as vulnerable); False Negative = scanner misses a real vulnerability (FAR more dangerous!).',
          ],
          keyTerms: [
            { term: 'Rules of Engagement (RoE)', definition: 'Written authorization document defining scope, permissible techniques, testing windows, off-limits systems, and emergency contacts for a pen test.' },
            { term: 'Generational Fuzzing', definition: 'Model-aware ("smart") fuzz testing constructing malformed inputs from protocol or file specifications to reach deep logic paths.' },
            { term: 'Fagan Inspection', definition: 'Formal, highly structured multi-stage peer code review methodology identifying software defects prior to testing.' },
            { term: 'Synthetic Transaction', definition: 'Automated scripted user workflow simulating real operations to continuously monitor application availability and response times.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d6-l1-q1',
              question:
                'Before an external red team begins active exploitation testing against a corporate web application, which document MUST be signed and finalized FIRST?',
              options: [
                'SOC 3 compliance seal',
                'Written Senior Management authorization and Rules of Engagement (RoE)',
                'Post-incident lessons-learned report',
                'Disaster recovery parallel test plan',
              ],
              correctIndex: 1,
              rationale:
                'Written authorization from senior management paired with explicit Rules of Engagement is legally and ethically mandatory prior to conducting any penetration test.',
            },
            {
              id: 'cissp-d6-l1-q2',
              question:
                'Which vulnerability scanning error represents the GREATEST security risk to an enterprise?',
              options: [
                'False Positive',
                'False Negative',
                'True Positive',
                'True Negative',
              ],
              correctIndex: 1,
              rationale:
                'A False Negative fails to report an actually existing vulnerability, leaving the organization falsely confident and completely exposed to exploitation.',
            },
          ],
          practicalDrill: {
            title: 'Penetration Test Rules of Engagement & Assurance Plan',
            prompt:
              'Draft an annual security assurance calendar combining automated scanning, code testing, and independent audits.',
            steps: [
              'Schedule weekly credentialed vulnerability scans and quarterly external unauthenticated scans.',
              'Draft a Penetration Test RoE specifying scope, black/gray-box mode, off-limits OT/third-party hosts, and emergency kill-switch contacts.',
              'Add Generational Fuzzing in CI/CD for public parsers and annual Third-Party SOC 2 Type II / ISO 27001 audits.',
            ],
            successCriteria:
              'Plan covers written RoE governance, distinguishes authenticated vs. unauthenticated scans, and pairs internal testing with independent third-party assurance.',
          },
          flashcards: [
            { front: 'First-Party vs. Second-Party vs. Third-Party Audit?', back: '1st = Internal audit; 2nd = Customer auditing a supplier; 3rd = Independent external accredited auditor (highest objectivity).', tag: 'cissp-d6' },
            { front: 'Mutation (Dumb) vs. Generational (Smart) Fuzzing?', back: 'Mutation flips random bits in valid inputs; Generational creates malformed inputs using protocol/schema models to reach deeper code branches.', tag: 'cissp-d6' },
            { front: 'False Positive vs. False Negative in vulnerability scanning?', back: 'False Positive = false alarm (wastes analyst time); False Negative = missed real vulnerability (greatest security danger).', tag: 'cissp-d6' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d6-l2',
          title: 'Security Metrics (KPIs/KRIs), Continuous Monitoring & Management Review',
          estimatedMinutes: 35,
          summary:
            'Translate raw technical logs into board-ready KPIs and KRIs, implement NIST SP 800-137 Continuous Monitoring (ISCM), and drive closed-loop remediation tracking.',
          learningObjectives: [
            'Differentiate Key Performance Indicators (KPIs — control effectiveness/past) from Key Risk Indicators (KRIs — early risk warning signals/future).',
            'Design SMART security metrics aligned to executive decisions rather than vanity counts.',
            'Operationalize Information Security Continuous Monitoring (ISCM) and formal Management Review remediation loops.',
          ],
          coreConcepts: [
            {
              heading: 'KPIs vs. KRIs & Actionable Executive Metrics',
              explanation:
                'Executives drown in raw vanity metrics ("We blocked 4.2 million firewall packets!"). Effective CISSP leaders report two structured indicators: Key Performance Indicators (KPIs) measure how well security processes perform against targets (e.g., "% of critical CVEs patched within 14-day SLA", "Mean Time to Contain [MTTC]"); Key Risk Indicators (KRIs) act as forward-looking early-warning radar signaling rising risk exposure BEFORE a breach occurs (e.g., "Rising count of overdue high-risk vendor exceptions", "Spike in unpatched internet-facing assets"). Metrics must be SMART (Specific, Measurable, Achievable, Relevant, Timely).',
              mentalModel:
                'KPIs are the speedometer and fuel efficiency gauge (how well the car is performing); KRIs are the engine temperature warning light flashing BEFORE the engine seizes.',
              formulaOrRule: 'KPI = Control/Process Performance | KRI = Early Warning of Escalating Risk Exposure.',
            },
            {
              heading: 'Continuous Monitoring (NIST SP 800-137) & Finding Remediation Tracking',
              explanation:
                'Point-in-time annual audits go stale the next afternoon. Information Security Continuous Monitoring (ISCM) maintains ongoing awareness of vulnerabilities, configuration drift, and threats to support dynamic risk decisions. Every audit or test finding MUST enter a tracked Remediation Register (Plan of Action & Milestones — POA&M) assigning a single accountable owner, risk severity, target due date, and independent re-test validation—never mark an audit finding "closed" solely on an owner’s verbal claim!',
              mentalModel:
                'An audit report without a tracked POA&M and independent re-testing is just an expensive binder collecting dust.',
              formulaOrRule: 'Closed-Loop Assurance: Discover Finding -> Risk-Rank -> Assign Owner & SLA (POA&M) -> Remediate -> Independently Re-Test to Close.',
            },
          ],
          realWorldScenario: {
            title: 'Replacing Vanity Firewall Counts with Board-Ready Risk Dashboards',
            situation:
              'A CISO presented a quarterly board slide boasting "12 million intrusions blocked and 100% antivirus deployed." A board audit committee member asked: "Are we safer than last quarter, and where is our next breach likely to start?" The CISO had no answer.',
            analysis:
              'Blocked packet counts measure internet background noise, not organizational risk posture. Rebuilding the board dashboard around 4 KPIs (Critical Patch SLA %, MTTC, Phishing Reporting Rate, Access Recertification %) and 3 KRIs (External Critical Exposure Age, Tier-1 Vendors Missing SOC 2, Overdue Risk Exceptions) directly connects technical operations to board risk appetite.',
            takeaway:
              'Good metrics drive decisions and budget allocation; vanity metrics only fill slides.',
          },
          examTraps: [
            'Never close an audit or penetration test finding simply because engineering reports "fixed"—ALWAYS require independent verification/re-testing!',
            'Understand Coverage vs. Depth: Coverage measures breadth (how much of the asset estate is scanned/tested); Depth measures rigor (how deeply each component is inspected).',
            'KRIs trigger management intervention when they cross pre-defined Risk Thresholds/Tolerance bands.',
          ],
          keyTerms: [
            { term: 'Key Risk Indicator (KRI)', definition: 'Early-warning metric signaling increasing risk exposure approaching organizational risk tolerance thresholds.' },
            { term: 'Key Performance Indicator (KPI)', definition: 'Quantitative metric evaluating how effectively a security control or process achieves operational objectives.' },
            { term: 'POA&M', definition: 'Plan of Action and Milestones—structured remediation tracker documenting security weaknesses, owners, resources, and target completion dates.' },
            { term: 'ISCM (NIST SP 800-137)', definition: 'Information Security Continuous Monitoring—maintaining ongoing situational awareness of security posture and threats.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d6-l2-q1',
              question:
                'Which metric serves BEST as a Key Risk Indicator (KRI) alerting executive leadership to escalating third-party breach exposure?',
              options: [
                'Total number of firewall packets dropped last month',
                'Percentage of Tier-1 suppliers with unresolved critical vulnerabilities exceeding 30 days',
                'Average hours spent writing security policies',
                'Number of slides in the annual security awareness deck',
              ],
              correctIndex: 1,
              rationale:
                'Unresolved critical vulnerabilities in Tier-1 suppliers directly signals rising external breach exposure approaching risk tolerance—making it a forward-looking KRI. Dropped packets and slide counts are vanity/activity stats.',
            },
            {
              id: 'cissp-d6-l2-q2',
              question:
                'An engineering manager reports that all five high-severity findings from last month’s penetration test have been patched. What MUST occur before formally closing those findings in the risk register?',
              options: [
                'Delete the original penetration test report',
                'Perform independent validation / re-testing confirming remediation effectiveness',
                'Increase cyber insurance coverage limits',
                'Wait until the next annual audit 11 months later',
              ],
              correctIndex: 1,
              rationale:
                'Findings must be independently re-tested and verified effective before closure—relying solely on self-attestation leaves incomplete fixes undetected.',
            },
          ],
          practicalDrill: {
            title: 'Board Security Scorecard (KPI/KRI) & POA&M Design',
            prompt:
              'Construct a 1-page executive risk dashboard for a quarterly Audit Committee meeting.',
            steps: [
              'Define 3 KPIs (e.g., Patch SLA Attainment, MTTC, Access Review Completion) with green/amber/red targets.',
              'Define 3 KRIs (e.g., Unpatched Critical Internet Assets >7d, Privileged Standing Accounts, Overdue Vendor Audits) tied to risk tolerance thresholds.',
              'Establish a POA&M workflow requiring independent Security Assurance re-verification prior to closure.',
            ],
            successCriteria:
              'Scorecard cleanly distinguishes KPIs from KRIs, eliminates vanity numbers, and embeds independent re-test closure.',
          },
          flashcards: [
            { front: 'KPI vs. KRI?', back: 'KPI measures how effectively a control/process performs; KRI provides early warning that risk exposure is rising toward tolerance limits.', tag: 'cissp-d6' },
            { front: 'What is required before closing an audit finding in a POA&M?', back: 'Independent verification / re-testing proving the remediation actually fixed the root vulnerability.', tag: 'cissp-d6' },
            { front: 'Which NIST standard defines Information Security Continuous Monitoring (ISCM)?', back: 'NIST SP 800-137.', tag: 'cissp-d6' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 7: SECURITY OPERATIONS (13%)
    // =================================================================
    {
      id: 'cissp-d7',
      domainNumber: 7,
      title: 'Security Operations',
      examWeightPercent: 13,
      overview:
        'Covers legal investigations & digital forensics, evidence admissibility, SIEM/SOAR/IDS/IPS monitoring, the 7-step Incident Management lifecycle, change/patch/configuration discipline, and full Disaster Recovery architecture & testing.',
      lessons: [
        {
          id: 'cissp-d7-l1',
          title: 'Investigations, Evidence Admissibility, Digital Forensics & Monitoring',
          estimatedMinutes: 45,
          summary:
            'Master investigation types (Administrative, Civil, Criminal, Regulatory), evidence rules (Real, Documentary, Testimonial, Best Evidence, Hearsay), forensic imaging, and SIEM/IDS tuning.',
          learningObjectives: [
            'Match investigation types (Administrative, Criminal, Civil, Regulatory) to their exact evidentiary and legal standards.',
            'Differentiate Real, Direct, Circumstantial, Corroborative, Hearsay, and Best Evidence rules plus Chain of Custody.',
            'Execute forensically sound acquisition respecting Order of Volatility (RFC 3227), write-blockers, and bit-stream imaging.',
            'Compare IDS vs. IPS and Signature-based vs. Anomaly/Heuristic detection trade-offs.',
          ],
          coreConcepts: [
            {
              heading: 'Legal Evidence Types & Admissibility Rules',
              explanation:
                'For digital evidence to survive in court, it must be Relevant, Authentic, Complete, Reliable, and Legally Obtained (fourth-amendment/warrant rules for law enforcement; clear login warning banners for employer monitoring!). Key evidence classifications: Real/Physical Evidence (tangible objects like a seized server or thumb drive), Documentary Evidence (business records, system logs—generally considered Hearsay UNLESS admitted under the Business Records Exception showing logs are generated automatically in the normal course of business!), Testimonial Evidence (witness sworn statements), Best Evidence Rule (original document/bitstream clone required rather than altered secondary copy), and Corroborative Evidence (supporting evidence backing up primary evidence).',
              mentalModel:
                'System logs are "computer hearsay" until you prove they are authentic, unaltered automated Business Records backed by Chain of Custody and SHA-256 hashes.',
              formulaOrRule: 'Admissible Digital Evidence = Legally Collected + Bit-Stream Copy (Write-Blocker) + SHA-256 Hash + Unbroken Chain of Custody.',
            },
            {
              heading: 'Forensic Acquisition & Order of Volatility (RFC 3227)',
              explanation:
                'Never analyze a live original evidence drive directly! Use a hardware write-blocker to capture an exact bit-stream (bit-for-bit) forensic image including unallocated slack space, verify identical cryptographic hashes (SHA-256) on original and copy, lock the original in evidence storage, and analyze ONLY the verified copy. Collect evidence strictly from most volatile to least volatile: (1) CPU registers/cache -> (2) RAM/routing tables/active connections -> (3) Temporary/swap files -> (4) Hard drives/SSDs -> (5) Remote logs -> (6) Archival backups/tapes.',
              mentalModel:
                'Collect melting ice before carved stone: grab RAM before disk, always use a write-blocker, and never touch the original again after hashing.',
              formulaOrRule: 'Order of Volatility: Registers/Cache -> RAM/Network State -> Temp/Swap -> Disk -> Remote Logs -> Archival Media.',
            },
            {
              heading: 'SIEM, SOAR, Egress Monitoring & IDS/IPS Tuning',
              explanation:
                'IDS (Intrusion Detection) sits passively (out-of-band via SPAN/TAP) alerting without blocking; IPS (Intrusion Prevention) sits inline actively dropping malicious traffic (risking false-positive outages—configure fail-open vs. fail-closed thoughtfully!). Signature-based detection catches known attacks with low false positives but misses zero-days; Anomaly/Behavioral (Heuristic/UEBA) detection flags deviations from normal baselines, catching zero-days at the cost of higher false positives. Centralized SIEM aggregates and correlates logs across endpoints, firewalls, and IdPs; SOAR automates repeatable response playbooks.',
              mentalModel:
                'IDS is a security camera calling the guard; IPS is an automated steel gate slamming shut inline; Signature = wanted poster; Anomaly = spotting someone sprinting in a library.',
              formulaOrRule: 'Unknown/Zero-Day Attacks -> Anomaly/Behavioral Detection; Known CVEs -> Signature Detection; Inline Blocking -> IPS.',
            },
          ],
          realWorldScenario: {
            title: 'Salvaging an Insider IP Theft Case Through Proper Forensics',
            situation:
              'An engineer suspects a departing colleague copied proprietary source code to USB. The engineer logs into the colleague’s laptop using their own admin account, opens several files to check timestamps, and emails screenshots to Legal.',
            analysis:
              'Logging in and opening files on the suspect’s live machine altered MAC (Modified/Accessed/Created) filesystem timestamps, overwrote volatile RAM and unallocated sectors, and broke Chain of Custody—making the evidence vulnerable to suppression in court. Proper procedure captures RAM first, images the drive bit-for-bit via a hardware write-blocker, hashes both images, and analyzes ONLY the verified copy.',
            takeaway:
              'Amateur tinkering destroys digital evidence instantly; preserve Order of Volatility, write-block, hash, and document Chain of Custody.',
          },
          examTraps: [
            'CISSP classic: "Do system logs qualify as Best Evidence or Hearsay?" Logs are Documentary Evidence treated as Hearsay UNLESS admitted under the Business Records Exception (regularly created automated records verified authentic).',
            'Entrapment (illegal: inducing someone to commit a crime they had no predisposition to commit) vs. Enticement (legal: making a honeypot look attractive to someone ALREADY predisposed to break in). Always warn users with a login banner—never coerce!',
            'Honeypot = single decoy system; Honeynet = network of decoys. Watch out for legal liability if an attacker uses your honeypot to launch downstream attacks against third parties!',
          ],
          keyTerms: [
            { term: 'Best Evidence Rule', definition: 'Legal standard requiring original evidence or an exact forensically verified bit-stream duplicate rather than unverified summaries.' },
            { term: 'Hardware Write-Blocker', definition: 'Forensic device permitting read-only acquisition from storage media while preventing any accidental write or timestamp modification.' },
            { term: 'Enticement vs. Entrapment', definition: 'Enticement lawfully attracts an already-predisposed attacker (e.g., honeypot); Entrapment illegally coerces an innocent party into committing a crime.' },
            { term: 'Anomaly-Based IDS', definition: 'Detection engine comparing live activity against a learned normal baseline to spot zero-day or novel behavioral attacks.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d7-l1-q1',
              question:
                'A forensic investigator arrives at a compromised workstation that is still powered on. Following RFC 3227 Order of Volatility, which artifact should be collected FIRST?',
              options: [
                'Full bit-stream image of the internal NVMe SSD',
                'Volatile system memory (RAM) and active network connection tables',
                'Offsite monthly backup tapes',
                'Centralized SIEM firewall logs from the previous week',
              ],
              correctIndex: 1,
              rationale:
                'RAM and active network state vanish instantaneously upon power loss or reboot and therefore rank far higher in the Order of Volatility than persistent SSDs, remote SIEM logs, or archival tapes.',
            },
            {
              id: 'cissp-d7-l1-q2',
              question:
                'Under which legal doctrine are automated firewall and authentication server logs typically admitted as valid evidence in court despite technically being out-of-court documentary statements?',
              options: [
                'Doctrine of Sovereign Immunity',
                'Business Records Exception to the Hearsay Rule',
                'Enticement Safe Harbor',
                'Strict Criminal Liability',
              ],
              correctIndex: 1,
              rationale:
                'Computer-generated logs are documentary evidence normally subject to hearsay objections unless verified as trustworthy, routinely generated records maintained in the normal course of business (Business Records Exception).',
            },
          ],
          practicalDrill: {
            title: 'Forensic First-Responder Evidence Kit & SOP',
            prompt:
              'Establish a legally defensible forensic collection SOP for corporate incident responders.',
            steps: [
              'Verify corporate login warning banners explicitly establish zero expectation of privacy on company devices.',
              'Sequence capture tools strictly by RFC 3227 (RAM dump -> live sockets -> hardware write-blocked disk bitstream image).',
              'Compute dual hashes (SHA-256) immediately, log into tamper-evident Chain of Custody forms, and seal original media in an anti-static evidence bag.',
            ],
            successCriteria:
              'SOP protects admissibility via warning banners, Order of Volatility, write-blocking, SHA-256 hashing, and unbroken Chain of Custody.',
          },
          flashcards: [
            { front: 'Enticement vs. Entrapment?', back: 'Enticement (legal) passively attracts someone already intent on offending (honeypot); Entrapment (illegal) actively persuades someone to commit a crime they otherwise would not.', tag: 'cissp-d7' },
            { front: 'Why do forensic investigators ALWAYS use a hardware write-blocker?', back: 'To create an exact bit-stream copy without altering a single byte or MAC timestamp on the original evidence drive.', tag: 'cissp-d7' },
            { front: 'How do automated system logs overcome the Hearsay objection in court?', back: 'Via the Business Records Exception—proving logs are created routinely, automatically, and protected from tampering in the ordinary course of business.', tag: 'cissp-d7' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d7-l2',
          title: 'Incident Management Lifecycle, Change Control & Patch Discipline',
          estimatedMinutes: 40,
          summary:
            'Lead the exact 7-step ISC2 Incident Response process, prevent operational outages via formal Change & Configuration Management, and prioritize risk-based patch deployment.',
          learningObjectives: [
            'Sequence all 7 ISC2 Incident Management steps (Detection, Response, Mitigation, Reporting, Recovery, Remediation, Lessons Learned) alongside NIST SP 800-61.',
            'Enforce formal Change Management (Request -> Impact Assessment -> CAB Approval -> Test -> Implement -> Document/Review) including Emergency Changes.',
            'Design risk-based Patch & Vulnerability Management workflows using virtual patching when immediate reboot is impossible.',
          ],
          coreConcepts: [
            {
              heading: 'Incident Management Lifecycle (ISC2 7 Steps & NIST SP 800-61)',
              explanation:
                'An Event is any observable occurrence; an Incident is an adverse event violating security policy or threatening CIA. ISC2 structures incident response into seven disciplined phases: (1) Detection (triage alerts, distinguish true incidents from false positives); (2) Response (activate CSIRT, verify scope); (3) Mitigation / Containment (stop bleeding—short-term isolation without destroying needed evidence); (4) Reporting (notify executives, legal, regulators per statutory windows); (5) Recovery (rebuild clean from verified images/backups, verify integrity before reconnecting to prod); (6) Remediation (eradicate root cause—patch flaw, rotate all keys); (7) Lessons Learned (blameless post-mortem updating playbooks, controls, and training). Remember: PREPARATION precedes everything!',
              mentalModel:
                'Preparation builds the firehouse; Containment digs the trench around the wildfire; Eradication puts out the embers; Recovery reopens the road; Lessons Learned upgrades building codes.',
              formulaOrRule: 'NIST SP 800-61 Order: Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity.',
            },
            {
              heading: 'Change Management & Emergency Patching Discipline',
              explanation:
                'Uncontrolled changes cause both security holes and catastrophic outages. Formal Change Management requires: Change Request -> Risk/Impact & Rollback Plan -> Change Advisory Board (CAB) approval -> Testing in isolated Staging -> Scheduled Production Implementation -> Post-Implementation Verification. What about a zero-day active exploit at 3 AM? Use an Emergency Change process (expedited executive authorization + minimal sanity test + mandatory retrospective CAB audit & documentation after stabilization—NEVER skip documentation permanently!). When a critical legacy system cannot be patched immediately, deploy a Virtual Patch (WAF/IPS signature blocking the exploit vector) as a compensating control.',
              mentalModel:
                'Never patch production directly without testing in staging and having a tested rollback plan—a bad Friday patch can inflict more downtime than an attacker.',
              formulaOrRule: 'Patching Rule: Test in non-prod first + Backout/Rollback Plan. Unpatchable legacy CVE -> Virtual Patch (WAF/IPS) compensating control.',
            },
          ],
          realWorldScenario: {
            title: 'Containing a Zero-Day Vulnerability on an Unpatchable Legacy ERP',
            situation:
              'A critical remote-code-execution CVE drops for a Java web framework running a 24/7 hospital billing ERP. Vendor testing shows applying the binary patch breaks billing integration for 72 hours, yet internet scanners are actively probing the exploit.',
            analysis:
              'Applying an untested patch blindly risks a multi-day clinical billing outage, while doing nothing invites ransomware. Applying an Emergency Change to deploy a WAF/IPS Virtual Patch blocks the exploit signature within 30 minutes (compensating control), buying engineering a safe 72-hour window to test, stage, and apply the permanent vendor patch cleanly.',
            takeaway:
              'Virtual patching is an indispensable bridge between active zero-day exploitation and safe tested permanent remediation.',
          },
          examTraps: [
            'If a CISSP question asks what to do FIRST after discovering a security incident (assuming Preparation is already done), check whether it asks to Detect/Confirm/Contain vs. notify Senior Management/CSIRT—NEVER jump straight to Eradication or Public Press Release before confirming and containing!',
            'Emergency Changes STILL require authorization (Emergency CAB / designated executive) and MUST be fully documented and reviewed retroactively.',
            'Lessons Learned (Post-Incident Review) MUST be blameless and happen promptly (within days, while memories are fresh) to update policies, playbooks, and detective rules.',
          ],
          keyTerms: [
            { term: 'Virtual Patching', definition: 'Compensating control deploying external WAF/IPS rules to block exploitation of a vulnerability until a tested code patch can be installed.' },
            { term: 'Change Advisory Board (CAB)', definition: 'Cross-functional governance body reviewing risk, business impact, and rollback plans before approving production changes.' },
            { term: 'Lessons Learned', definition: 'Blameless post-incident analysis identifying control gaps, playbook improvements, and root-cause prevention actions.' },
            { term: 'Rollback Plan', definition: 'Tested step-by-step procedure restoring a system cleanly to its last known-good baseline if a change fails.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d7-l2-q1',
              question:
                'A critical zero-day vulnerability is discovered in an enterprise web server at 1:00 AM and requires an urgent firewall/WAF rule update outside the normal weekly CAB cycle. How should security handle this change?',
              options: [
                'Implement the rule silently without logging it so auditors are not alarmed',
                'Wait until the regular weekly CAB meeting four days later',
                'Execute the formal Emergency Change procedure with expedited approval, followed by retrospective documentation and CAB review',
                'Shut down the entire corporate network indefinitely',
              ],
              correctIndex: 2,
              rationale:
                'Emergency Change procedures balance rapid threat containment with accountability—requiring expedited executive approval, tested safety checks, and mandatory post-implementation documentation and CAB review.',
            },
            {
              id: 'cissp-d7-l2-q2',
              question:
                'During incident recovery, after eradicating malware from a compromised domain controller, what is the SAFEST practice before restoring it to full production?',
              options: [
                'Run one antivirus scan and immediately reconnect it to the network',
                'Rebuild the server from verified clean media/golden images, apply all patches, restore verified clean data, and validate integrity',
                'Rename the server hostname and change its IP address',
                'Disable security logging to speed up recovery',
              ],
              correctIndex: 1,
              rationale:
                'Sophisticated attackers plant hidden persistence/rootkits that AV scans routinely miss. Rebuilding from clean trusted media/golden images, fully patching, rotating credentials, and validating integrity ensures complete eradication.',
            },
          ],
          practicalDrill: {
            title: 'Zero-Day Incident & Emergency Change Tabletop',
            prompt:
              'Walk a CSIRT team through a confirmed SQL-injection intrusion on a public customer portal.',
            steps: [
              'Triage & Activate CSIRT; preserve volatile memory and DB/web logs before isolation.',
              'Contain via WAF Virtual Patch (Emergency Change) and revoke compromised DB service credentials.',
              'Notify Legal, Privacy Officer, and Senior Management to evaluate regulatory breach-reporting clocks.',
              'Rebuild clean from golden IaC after code patch passes staging QA, then host a blameless Lessons Learned review within 5 days.',
            ],
            successCriteria:
              'Tabletop hits every NIST/ISC2 IR phase in sequence without destroying evidence or bypassing Emergency Change documentation.',
          },
          flashcards: [
            { front: 'List the 4 phases of NIST SP 800-61 Incident Response.', back: '1) Preparation; 2) Detection & Analysis; 3) Containment, Eradication & Recovery; 4) Post-Incident Activity (Lessons Learned).', tag: 'cissp-d7' },
            { front: 'When is Virtual Patching used?', back: 'As a rapid compensating control (WAF/IPS filter) to block exploits when an urgent OS/app patch cannot be immediately tested or installed without breaking critical operations.', tag: 'cissp-d7' },
            { front: 'Do Emergency Changes bypass documentation?', back: 'NEVER—Emergency Changes get expedited approval to act fast, then MUST be fully documented and reviewed retroactively by the CAB.', tag: 'cissp-d7' },
          ],
          sourceRefs: [
            'my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
        {
          id: 'cissp-d7-l3',
          title: 'Disaster Recovery Sites, Backup Strategies & DR Testing Hierarchy',
          estimatedMinutes: 45,
          summary:
            'Architect cost-effective Disaster Recovery facilities (Hot, Warm, Cold, Cloud/Reciprocal), compare Full/Incremental/Differential backups, and sequence all 5 DR test levels safely.',
          learningObjectives: [
            'Compare Hot, Warm, Cold, Mobile, and Reciprocal DR sites across cost, readiness, and RTO/RPO trade-offs.',
            'Calculate backup and restoration speed trade-offs across Full, Incremental, and Differential backup schemes (plus 3-2-1-1-0 immutable ransomware protection).',
            'Sequence all 5 DR Testing levels from Checklist to Full Interruption and recognize when each is appropriate.',
            'Distinguish RAID levels (0, 1, 5, 6, 10) for disk availability vs. backup resilience.',
          ],
          coreConcepts: [
            {
              heading: 'DR Recovery Site Comparison & Cloud Modernity',
              explanation:
                'Traditional DR facilities balance cost against RTO: (1) Cold Site — empty shell with power, HVAC, and raised floors ONLY; cheapest, takes WEEKS to order/install hardware; (2) Warm Site — facility pre-equipped with servers, networking, and hardware, but missing live production data (restore backups on failover); moderate cost, hours-to-days RTO; (3) Hot Site — fully mirrored live hardware AND near-real-time replicated data; most expensive, minutes-to-hours RTO; (4) Reciprocal Agreement — mutual pact between two companies to share facilities (cheapest, but rarely recommended due to privacy, capacity contention, and testing barriers!). Cloud Pilot Light / Warm Standby / Active-Active increasingly replaces physical sites with OpEx elasticity.',
              mentalModel:
                'Cold Site = Empty rental apartment (bring your own furniture); Warm Site = Furnished apartment (bring your suitcase/backups); Hot Site = Identical twin house with dinner already warm on the table.',
              formulaOrRule: 'Cost & Speed Order: Cold (Cheapest, Slowest) < Warm (Balanced) < Hot (Costliest, Fastest). Reciprocal = High Legal/Capacity Risk.',
            },
            {
              heading: 'Full vs. Incremental vs. Differential Backups (Archive Bit Math!)',
              explanation:
                'Every exam tests how backup strategies trade backup speed/storage against RESTORE speed: (1) Full Backup copies everything and CLEARS the archive bit (slowest backup, fastest 1-step restore); (2) Incremental Backup copies ONLY files changed since the LAST backup of ANY type and CLEARS the archive bit (fastest nightly backup, smallest storage, SLOWEST/riskiest restore — requires Last Full + EVERY single daily Incremental in sequence!); (3) Differential Backup copies ALL files changed since the LAST FULL backup and does NOT clear the archive bit (grows larger each night, FAST 2-step restore — requires ONLY Last Full + Latest Differential!). Against ransomware, enforce 3-2-1-1-0 (3 copies, 2 media types, 1 offsite, 1 offline/immutable WORM, 0 restore errors).',
              mentalModel:
                'Incremental = Daily diary entries (fast to write, must read Monday + Tuesday + Wednesday + Thursday to catch up); Differential = Cumulative weekly summary (slower to write by Thursday, but only need Sunday Full + Thursday summary to restore!).',
              formulaOrRule: 'Fastest Backup = Incremental (clears bit) | Fastest Partial Restore = Differential (does NOT clear bit: Last Full + Latest Diff ONLY).',
            },
            {
              heading: 'The 5 DR Testing Levels (Least to Most Disruptive)',
              explanation:
                'Never jump straight into pulling the power plug on production! Escalate DR validation progressively: (1) Checklist Review — individuals read the plan checking for missing contacts/steps; (2) Structured Walkthrough / Tabletop — team sits together verbally stepping through a simulated disaster; (3) Simulation Test — realistic role-play exercising communication and procedures without cutting over live IT systems; (4) Parallel Test — actually spin up the DR site and process test/mirrored transactions WHILE primary production keeps running untouched (validates technical failover safely!); (5) Full-Interruption Test — deliberately shut down primary production and run live business on the DR site (most realistic, HIGHEST outage risk!).',
              mentalModel:
                'Parallel Test is test-driving the spare airplane on the runway while the main plane keeps flying; Full-Interruption turns off the main plane’s engines mid-flight.',
              formulaOrRule: 'DR Test Ladder: Checklist -> Tabletop/Walkthrough -> Simulation -> Parallel (Safest Technical Proof) -> Full Interruption (Highest Risk).',
            },
          ],
          realWorldScenario: {
            title: 'Balancing Backup Window Limits Against Tight Recovery Objectives',
            situation:
              'A financial clearinghouse runs a Full backup every Sunday night. On Thursday morning, ransomware encrypts the primary file server. Because the team used daily Incremental backups and Tuesday’s incremental tape is corrupted, Wednesday’s backup cannot be cleanly replayed.',
            analysis:
              'Incremental backups create a fragile restoration chain—losing any single intermediate tape breaks recovery beyond that day. Switching to Differential backups (Sunday Full + Mon–Sat Differential) backed by immutable WORM cloud snapshots guarantees that Thursday recovery requires ONLY Sunday’s Full + Wednesday’s Differential, dramatically shrinking RTO and eliminating chained-tape failure.',
            takeaway:
              'Optimize backups for RESTORE speed and integrity, not merely nightly write speed—and always keep at least one immutable/air-gapped copy.',
          },
          examTraps: [
            'Archive Bit Trap: Full and Incremental CLEAR the archive bit; Differential does NOT clear the archive bit!',
            'RAID is a fault-tolerance / availability control against hardware disk failure—RAID is NEVER a backup! (Deleting a file or ransomware encryption immediately replicates across all RAID disks!)',
            'Know exact RAID levels: RAID 0 = Striping ONLY (zero fault tolerance!); RAID 1 = Mirroring (50% overhead); RAID 5 = Striping + single distributed parity (survives 1 disk loss, min 3 disks); RAID 6 = Dual parity (survives 2 disk losses, min 4 disks); RAID 10 = Mirrored stripes (fast + resilient, min 4 disks).',
            'Parallel Testing is almost always the CISSP "BEST" answer when management wants real technical failover validation WITHOUT risking production downtime.',
          ],
          keyTerms: [
            { term: 'Differential Backup', definition: 'Backup copying all files modified since the last Full backup without clearing the archive bit; restores in just two steps (Full + latest Differential).' },
            { term: 'Incremental Backup', definition: 'Backup copying only files changed since the most recent backup (Full or Incremental) and clearing the archive bit; fastest backup, slowest restore.' },
            { term: 'Parallel DR Test', definition: 'Disaster recovery test activating backup systems and processing workloads alongside live primary operations to validate technical recovery safely.' },
            { term: 'Warm Site', definition: 'Alternate recovery facility pre-equipped with hardware, power, and connectivity but lacking live production data until backups are restored.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d7-l3-q1',
              question:
                'An organization completes a Full backup every Sunday night and Differential backups Monday through Saturday. If a storage failure destroys the primary database on Friday morning, which backups are required for complete restoration?',
              options: [
                'Sunday Full + Monday + Tuesday + Wednesday + Thursday Differentials',
                'Sunday Full + Thursday Differential ONLY',
                'Thursday Differential ONLY',
                'Sunday Full ONLY',
              ],
              correctIndex: 1,
              rationale:
                'Because Differential backups do not clear the archive bit, Thursday’s Differential contains ALL changes accumulated since Sunday’s Full backup—requiring only 2 datasets (Sunday Full + Thursday Differential) for complete restoration.',
            },
            {
              id: 'cissp-d7-l3-q2',
              question:
                'Executive leadership wants to verify that the company’s secondary DR data center can technically execute live order-processing applications under load, but strictly forbids any interruption to the primary production data center. Which DR test type should be executed?',
              options: [
                'Tabletop Walkthrough',
                'Parallel Test',
                'Full-Interruption Test',
                'Checklist Review',
              ],
              correctIndex: 1,
              rationale:
                'A Parallel Test brings secondary DR systems fully online and executes real/mirrored workloads to validate technical readiness while keeping primary production completely untouched.',
            },
          ],
          practicalDrill: {
            title: 'Ransomware-Resilient Backup & Annual DR Testing Schedule',
            prompt:
              'Design a 12-month DR validation and backup strategy for a 24/7 logistics platform with a 4-hour RTO and 1-hour RPO.',
            steps: [
              'Select Warm Standby (or Warm Site + hourly log shipping) over Cold Site to meet the 4-hour RTO cost-effectively.',
              'Implement 3-2-1-1-0 backups: Weekly Full + Daily Differential + Hourly transaction logs replicated to immutable WORM cloud storage.',
              'Schedule Quarterly Tabletop drills, Semi-Annual Parallel Tests validating actual RTO/RPO timing, and Monthly automated restore integrity tests.',
            ],
            successCriteria:
              'Schedule meets RTO/RPO cleanly, prevents ransomware backup deletion via WORM immutability, and validates technical failover safely via Parallel Tests.',
          },
          flashcards: [
            { front: 'Incremental vs. Differential Backup: Which clears the archive bit, and which restores faster?', back: 'Incremental CLEARS the archive bit (faster backup, slower restore); Differential does NOT clear the bit (larger backup, faster 2-step restore: Last Full + Latest Diff).', tag: 'cissp-d7' },
            { front: 'List the 5 DR Test levels in ascending order of realism and disruption.', back: 'Checklist -> Walkthrough/Tabletop -> Simulation -> Parallel -> Full Interruption.', tag: 'cissp-d7' },
            { front: 'Is RAID 6 a valid backup strategy against ransomware?', back: 'NO—RAID protects ONLY against physical drive failure (availability). Ransomware encryption instantly replicates across every disk in the RAID array.', tag: 'cissp-d7' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
      ],
    },

    // =================================================================
    // DOMAIN 8: SOFTWARE DEVELOPMENT SECURITY (10%)
    // =================================================================
    {
      id: 'cissp-d8',
      domainNumber: 8,
      title: 'Software Development Security',
      examWeightPercent: 10,
      overview:
        'Covers integrating security across SDLC methodologies (Waterfall, Agile, DevSecOps), capability maturity models (CMMI/SAMM), OWASP web/API defenses, database security (ACID, Inference, Aggregation, Polyinstantiation), and software supply-chain integrity.',
      lessons: [
        {
          id: 'cissp-d8-l1',
          title: 'SDLC Methodologies, DevSecOps, Maturity Models (CMMI) & Secure Coding',
          estimatedMinutes: 40,
          summary:
            'Embed security into Waterfall, Agile/Scrum, Spiral, and DevSecOps lifecycles; progress through the 5 CMMI maturity levels; and prevent memory/injection defects through input validation and parameterized queries.',
          learningObjectives: [
            'Contrast Waterfall, Spiral (risk-driven), Agile/Scrum (iterative sprints), and DevSecOps CI/CD security integration.',
            'Memorize all 5 Capability Maturity Model Integration (CMMI) levels (Initial, Managed, Defined, Quantitatively Managed, Optimizing).',
            'Enforce secure coding fundamentals: server-side allowlist input validation, parameterized queries, output encoding, and separation of dev/test/prod environments.',
          ],
          coreConcepts: [
            {
              heading: 'SDLC Models & The 5 CMMI Maturity Levels',
              explanation:
                'Security must be designed in at Phase 1 (Requirements)—never bolted on after deployment! Compare key SDLC models: Waterfall (sequential rigid stages, works for stable requirements), Spiral (iterative cycles explicitly centering on RISK ANALYSIS in every loop), Agile/Scrum (short 1–4 week sprints prioritizing rapid working software—embed "Security User Stories" and automated CI/CD gates), and DevSecOps (automates SAST/SCA/DAST/IaC gates continuously). CMMI measures process maturity across 5 exact levels: Level 1 Initial (ad-hoc, chaotic, hero-dependent); Level 2 Managed (repeatable at project level); Level 3 Defined (standardized across the ENTIRE organization); Level 4 Quantitatively Managed (measured via statistical metrics/KPIs); Level 5 Optimizing (continuous data-driven improvement).',
              mentalModel:
                'CMMI Mnemonic "I-M-D-Q-O": Initial (chaos) -> Managed (project repeatable) -> Defined (org-wide standard) -> Quantitatively Managed (measured by numbers) -> Optimizing (continuously perfecting).',
              formulaOrRule: 'CMMI Levels 1–5: Initial -> Managed -> Defined -> Quantitatively Managed -> Optimizing. Spiral Model = Risk-Driven.',
            },
            {
              heading: 'Environment Separation & Core Secure Coding Defenses',
              explanation:
                'Enforce strict Separation of Duties across three isolated environments: Development (developers write/unit-test code using dummy/masked data ONLY), Testing/Staging (QA/security executes integration/DAST tests), and Production (locked down—developers have ZERO direct write access; deployments occur ONLY via audited CI/CD or Operations release pipelines!). Secure coding rule #1: NEVER trust client-side input! Always enforce SERVER-SIDE Allowlist Input Validation (preferred over denylists, which attackers bypass with encoding tricks), Parameterized Queries / Prepared Statements (separating SQL code from user data to crush SQL Injection), Context-Aware Output Encoding (stopping XSS), and Memory-Safe Languages or bounds checking + ASLR/DEP (stopping Buffer Overflows).',
              mentalModel:
                'A Denylist tries to memorize every criminal’s face (easy to fool with a disguise); an Allowlist checks a short VIP guest list and rejects everyone else automatically.',
              formulaOrRule: 'SQLi Cure = Parameterized Queries (Prepared Statements) | XSS Cure = Context-Aware Output Encoding + CSP | Validation = Server-Side Allowlist.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing a Fraudulent Backdoor via Dev-to-Prod Separation of Duties',
            situation:
              'At a fast-moving fintech company, lead developers have direct SSH and deployment credentials to production payment servers so they can "hotfix bugs fast." During a quarterly review, auditors flag an unreviewed code commit silently diverting fractional rounding pennies into an external account.',
            analysis:
              'Allowing the same individual who writes code to push unreviewed code directly into production completely violates Separation of Duties and Change Management. Enforcing mandatory peer code review (two-person rule), automated CI/CD signed builds, and restricting production promotion solely to locked pipelines/operations closes the insider backdoor vector.',
            takeaway:
              'Developers build in Dev; automated pipelines or independent Release Ops promote peer-reviewed artifacts to Production—never grant developers direct prod write access.',
          },
          examTraps: [
            'CISSP classic: "What is the MOST effective defense against SQL Injection?" -> Parameterized Queries / Prepared Statements (even stronger than input filtering alone because code and data planes are strictly separated!).',
            'Never validate security strictly in client-side JavaScript—attackers bypass browser validation effortlessly via proxy tools (Burp Suite/curl); ALWAYS validate SERVER-SIDE.',
            'Remember CMMI Level 2 (Managed = project-level discipline) vs. Level 3 (Defined = enterprise-wide standardized processes) vs. Level 4 (Quantitatively Managed = statistical metrics).',
          ],
          keyTerms: [
            { term: 'Parameterized Queries', definition: 'Prepared SQL statements enforcing strict separation between executable query structure and user-supplied data parameters, neutralizing SQL injection.' },
            { term: 'CMMI', definition: 'Capability Maturity Model Integration—5-tier framework evaluating organizational software/process maturity from Initial (1) to Optimizing (5).' },
            { term: 'Spiral Model', definition: 'Iterative SDLC methodology explicitly embedding risk analysis and prototyping into every development cycle.' },
            { term: 'Allowlist Validation', definition: 'Input validation permitting strictly known-good characters/formats and rejecting all other input; stronger than denylisting.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d8-l1-q1',
              question:
                'An enterprise software team has standardized its secure coding procedures across all business units and documented them in an organization-wide engineering handbook, but does not yet track statistical defect rates quantitatively. Which CMMI maturity level does this describe?',
              options: [
                'Level 1: Initial',
                'Level 2: Managed',
                'Level 3: Defined',
                'Level 4: Quantitatively Managed',
              ],
              correctIndex: 2,
              rationale:
                'Level 3 (Defined) is characterized by standardized, documented processes adopted consistently across the entire organization. Adding statistical quantitative tracking progresses to Level 4 (Quantitatively Managed).',
            },
            {
              id: 'cissp-d8-l1-q2',
              question:
                'Which coding practice provides the SINGLE MOST reliable defense against SQL Injection across dynamic web applications?',
              options: [
                'Escaping single quotes using client-side JavaScript regex',
                'Using Parameterized Queries (Prepared Statements) on the server',
                'Hiding database table names using HTML comments',
                'Enabling TLS 1.3 between the browser and web server',
              ],
              correctIndex: 1,
              rationale:
                'Parameterized queries bind user input strictly as literal data values rather than executable SQL syntax, neutralizing SQL injection regardless of special characters. TLS protects data in transit, not injection flaws.',
            },
          ],
          practicalDrill: {
            title: 'Secure SDLC & Dev-Test-Prod Separation Charter',
            prompt:
              'Upgrade an ad-hoc Agile engineering group (CMMI Level 1) to Level 3 Defined DevSecOps discipline.',
            steps: [
              'Establish three strictly isolated environments (Dev, Test/Staging, Prod) with zero production PII in Dev/Test and zero direct developer write access to Prod.',
              'Mandate peer pull-request reviews, Parameterized Queries, Server-Side Allowlist Validation, and Context-Aware Output Encoding in the corporate coding standard.',
              'Embed automated SAST, SCA/SBOM, secrets scanning, and DAST build breakers inside CI/CD.',
            ],
            successCriteria:
              'Charter enforces Dev-to-Prod Separation of Duties, replaces denylists with parameterized queries/allowlists, and maps cleanly to CMMI Level 3.',
          },
          flashcards: [
            { front: 'List the 5 CMMI levels in exact order.', back: '1) Initial, 2) Managed, 3) Defined, 4) Quantitatively Managed, 5) Optimizing.', tag: 'cissp-d8' },
            { front: 'Primary defense for SQLi vs. XSS vs. CSRF?', back: 'SQLi = Parameterized Queries; XSS = Context-Aware Output Encoding + CSP; CSRF = Anti-CSRF synchronizer tokens + SameSite cookies.', tag: 'cissp-d8' },
            { front: 'Why is Dev-Test-Prod separation mandatory?', back: 'Enforces Separation of Duties so developers cannot inject unauthorized backdoors into production and ensures untested code never crashes live systems.', tag: 'cissp-d8' },
          ],
          sourceRefs: ['my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf'],
        },
        {
          id: 'cissp-d8-l2',
          title: 'Database Security (ACID, Inference, Aggregation, Polyinstantiation) & OWASP',
          estimatedMinutes: 45,
          summary:
            'Master relational database security concepts heavily tested on CISSP—ACID properties, referential integrity, Aggregation vs. Inference attacks, Polyinstantiation, and modern web/API vulnerability mitigation.',
          learningObjectives: [
            'Explain ACID transaction guarantees (Atomicity, Consistency, Isolation, Durability) and Primary/Foreign Key Referential Integrity.',
            'Differentiate Aggregation (combining low-level facts into higher sensitivity) from Inference (deducing hidden secrets indirectly) and apply Polyinstantiation.',
            'Mitigate critical OWASP threats: CSRF, SSRF, Broken Access Control, Insecure Deserialization, and Software Supply Chain risks.',
          ],
          coreConcepts: [
            {
              heading: 'Database Integrity: ACID & Referential Integrity',
              explanation:
                'Relational Database Management Systems (RDBMS) preserve transactional reliability through ACID: Atomicity ("all or nothing" — if a wire transfer fails halfway, debit AND credit roll back cleanly), Consistency (transactions move DB strictly from one valid schema state to another), Isolation (concurrent transactions do not corrupt each other’s intermediate state), and Durability (once committed, data survives power failure via transaction logs). Referential Integrity ensures every Foreign Key in a child table points to an existing valid Primary Key in the parent table (no orphaned records).',
              mentalModel:
                'Atomicity guarantees the ATM never debits your checking account without actually dispensing the cash or crediting the destination.',
              formulaOrRule: 'ACID = Atomicity (all-or-nothing), Consistency (valid rules), Isolation (concurrency safety), Durability (permanent commit).',
            },
            {
              heading: 'Aggregation vs. Inference & Polyinstantiation (CISSP Classic!)',
              explanation:
                'Two subtle database confidentiality threats appear on nearly every CISSP exam: (1) Aggregation — combining many individually non-sensitive or low-classification pieces of data to assemble a composite picture of MUCH HIGHER sensitivity (e.g., 100 separate unclassified troop supply manifests reveal a Top Secret battle plan). (2) Inference — using authorized lower-level facts plus deductive reasoning to figure out a RESTRICTED secret you are NOT allowed to see (e.g., querying average salary of a 3-person department, subtracting your salary and Bob’s salary to deduce the VP’s secret salary!). Polyinstantiation defeats inference in multilevel secure databases by storing MULTIPLE distinct rows with the same primary key at different classification levels—returning a harmless cover story to low-clearance users and the real truth to Top Secret users.',
              mentalModel:
                'Aggregation is putting 50 harmless puzzle pieces together to reveal the secret blueprint; Inference is reading the shadows to deduce what’s behind the curtain; Polyinstantiation shows a decoy blueprint to lower clearances.',
              formulaOrRule: 'Combine many low pieces -> high sensitivity = Aggregation | Deduce hidden secret indirectly = Inference | Multilevel decoy rows = Polyinstantiation.',
            },
            {
              heading: 'Web & API Threats (CSRF, XSS, Deserialization & AI/ML App Risks)',
              explanation:
                'Know the crisp differences among web exploits: Cross-Site Scripting (XSS) tricks the victim’s BROWSER into executing attacker JavaScript inside a trusted site (fix: output encoding + Content Security Policy); Cross-Site Request Forgery (CSRF) tricks an authenticated victim’s browser into sending an unintended state-changing request carrying their active session cookie (fix: unique unpredictable Anti-CSRF tokens + `SameSite=Strict/Lax` cookies); Insecure Deserialization allows tampered serialized objects to trigger remote code execution (fix: avoid deserializing untrusted binary/pickle blobs, use strict JSON schemas). For modern AI/ML applications, guard against Prompt Injection, Training Data Poisoning, and Model Extraction.',
              mentalModel:
                'XSS exploits the trust a USER has in a website; CSRF exploits the trust a WEBSITE has in the user’s authenticated browser.',
              formulaOrRule: 'XSS = User trusts Site (Output Encode + CSP) | CSRF = Site trusts Browser Cookie (Anti-CSRF Token + SameSite Cookie).',
            },
          ],
          realWorldScenario: {
            title: 'Blocking Salary Inference in an HR Analytics Portal',
            situation:
              'An HR analytics database prohibits employees from querying individual salaries but permits aggregate queries (`AVG(salary)`) by department and tenure band. A savvy employee runs two narrow filters that isolate a single executive and mathematically deduces their exact compensation.',
            analysis:
              'This is a classic Inference attack! Even though direct row access was blocked, narrow statistical queries leaked the protected value. Countermeasures include enforcing minimum query result-set sizes (e.g., suppress aggregate queries matching fewer than 10 records), differential privacy / cell suppression, and query auditing.',
            takeaway:
              'Row-level ACLs alone do not stop statistical Inference—restrict small-set aggregate queries and apply noise/suppression or polyinstantiation.',
          },
          examTraps: [
            'Memorize Polyinstantiation’s exact purpose: it prevents INFERENCE attacks in multilevel databases by allowing multiple rows with the same primary key at different security classification levels.',
            'Do not confuse XSS with CSRF: XSS injects malicious scripts running in the user’s browser (cured by output encoding); CSRF abuses automatic browser session cookies (cured by Anti-CSRF tokens and SameSite cookies).',
            'Database Views restrict access to specific subsets of columns/rows (great for Least Privilege and hiding PII columns from analytics queries).',
          ],
          keyTerms: [
            { term: 'Aggregation', definition: 'Combining multiple low-sensitivity data points to produce information of a higher overall sensitivity level.' },
            { term: 'Inference', definition: 'Deducing unauthorized sensitive information indirectly by analyzing permitted non-sensitive data and metadata.' },
            { term: 'Polyinstantiation', definition: 'Multilevel database defense creating multiple distinct records with identical primary keys at different classification levels to prevent inference.' },
            { term: 'CSRF (Cross-Site Request Forgery)', definition: 'Attack forcing an authenticated user’s browser to submit forged state-changing requests to a trusted web application.' },
          ],
          conceptChecks: [
            {
              id: 'cissp-d8-l2-q1',
              question:
                'A classified defense database stores a naval ship’s covert destination at the Top Secret level while displaying a routine training-exercise destination under the exact same Ship ID to Confidential-cleared logistics clerks. Which database security mechanism is being used?',
              options: [
                'Referential Integrity',
                'Polyinstantiation',
                'Database Normalization',
                'Data Aggregation',
              ],
              correctIndex: 1,
              rationale:
                'Polyinstantiation stores multiple versions of a record under the same primary key differentiated by classification label, preventing low-clearance users from inferring the existence or content of higher-classified records.',
            },
            {
              id: 'cissp-d8-l2-q2',
              question:
                'While logged into her online brokerage, a user visits a malicious blog containing a hidden HTML form that automatically submits a stock-transfer POST request to the brokerage using her active session cookie. Which vulnerability was exploited, and what is the primary defense?',
              options: [
                'SQL Injection — Parameterized Queries',
                'Cross-Site Request Forgery (CSRF) — Anti-CSRF Synchronizer Tokens and SameSite Cookies',
                'Buffer Overflow — Address Space Layout Randomization (ASLR)',
                'Directory Traversal — Chroot Jail',
              ],
              correctIndex: 1,
              rationale:
                'CSRF exploits a web application’s automatic trust in a logged-in user’s browser cookies. Unpredictable per-session Anti-CSRF tokens paired with `SameSite` cookie attributes neutralize forged cross-origin requests.',
            },
          ],
          practicalDrill: {
            title: 'Database & Web Application Defense Matrix',
            prompt:
              'Harden a multi-tenant HR and financial web platform against SQLi, XSS, CSRF, Inference, and Aggregation.',
            steps: [
              'Enforce Parameterized Queries across all ORM/SQL calls and Context-Aware Output Encoding + strict CSP headers.',
              'Add Anti-CSRF synchronizer tokens and `HttpOnly; Secure; SameSite=Strict` cookie flags.',
              'Configure restricted SQL Views hiding SSN/Salary columns, enforce minimum k>=10 cohort thresholds on aggregate analytics queries to stop Inference, and monitor bulk export volume to flag Aggregation.',
            ],
            successCriteria:
              'Matrix accurately pairs every threat (SQLi, XSS, CSRF, Inference, Aggregation) with its exact primary architectural defense.',
          },
          flashcards: [
            { front: 'Aggregation vs. Inference in database security?', back: 'Aggregation = combining many low-level facts to create higher-sensitivity info; Inference = deducing hidden secrets indirectly from authorized facts.', tag: 'cissp-d8' },
            { front: 'What is Polyinstantiation and what attack does it stop?', back: 'Storing multiple rows with the same primary key at different classification levels to prevent Inference attacks.', tag: 'cissp-d8' },
            { front: 'What do the four letters in ACID stand for?', back: 'Atomicity, Consistency, Isolation, Durability.', tag: 'cissp-d8' },
          ],
          sourceRefs: [
            'my_documents/Chapple M.  ISC2 CISSP Certified Information Systems...Study Guide 10ed 2024.pdf',
            'my_documents/CISSP Exam Certification Companion. 1000+ Practice Questions...Strategies 2024.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Global Healthcare & Life-Sciences Enterprise Security Transformation (All 8 Domains)',
    scenario:
      'Aethelgard BioSystems operates 14 clinical research labs, 3 automated pharmaceutical manufacturing plants (ICS/OT), and a cloud patient-telemetry platform across the US and EU. Following a failed regulatory audit and a near-miss ransomware scare, the Board hires you as Chief Security Architect. You face: (1) executives pressuring IT to ship a wireless insulin monitor despite an unpatched Bluetooth flaw; (2) retired SSDs containing PHI awaiting donation; (3) flat factory/office networks with weak Wi-Fi and standing Domain Admin accounts; (4) developers pushing hotfixes directly to production; and (5) untested Sunday-full/daily-incremental tape backups.',
    tasks: [
      'Resolve the medical-device ethical dilemma using the ISC2 Code of Ethics and construct an ALE-based investment case for the Board (Domain 1).',
      'Establish Data Owner vs. Custodian governance and prescribe NIST SP 800-88 sanitization for the retired PHI SSDs (Domain 2).',
      'Architect Purdue Model OT segmentation, occupied-NOC fire suppression, AES-GCM/PFS cryptography, and Brewer-Nash/Clark-Wilson controls (Domains 3 & 4).',
      'Design WPA3-Enterprise EAP-TLS, TACACS+ network admin AAA, ABAC + JIT PAM access controls, and Penetration Testing Rules of Engagement (Domains 4, 5, 6).',
      'Overhaul forensic first-response, Emergency Change / Virtual Patching, immutable Differential backups + Parallel DR testing, and Dev-Test-Prod CI/CD separation (Domains 7 & 8).',
    ],
    modelSolution:
      '1) Ethics & Governance (D1): Invoke ISC2 Canon 1 (Protect Society / Patient Safety) to halt shipment of the vulnerable insulin monitor until remediated—life safety overrides earnings. Build quantitative SLE/ALE cost-benefit cases for board funding and separate mandatory Policies/Standards from advisory Guidelines. 2) Asset Security (D2): Appoint senior clinical executives as Data Owners (classify/approve access) and IT as Data Custodians; halt donation of retired PHI SSDs immediately and execute verified physical SSD destruction or Crypto-Erase (NEVER degauss SSDs!). 3) Architecture & Networks (D3–D4): Isolate ICS/OT plants using the Purdue Model Industrial DMZ and passive monitoring (prioritizing Safety & Availability); equip occupied NOCs with human-safe Clean Agents or Pre-Action sprinklers (no CO2) and Fail-Safe emergency exits; standardize on AES-256-GCM, TLS 1.3 with ECDHE PFS, IPsec ESP Tunnel Mode, WPA3-Enterprise + EAP-TLS, and TACACS+ for core router administration. 4) IAM & Assurance (D5–D6): Replace standing Domain Admins with JIT PAM + FIDO2 MFA, adopt ABAC for clinical context-aware access, institute quarterly Data Owner Access Recertification to stop Privilege Creep, and require signed Senior Management Rules of Engagement before pen testing plus independent re-testing to close POA&M findings. 5) SecOps & AppSec (D7–D8): Enforce RFC 3227 Order of Volatility (RAM before write-blocked bit-stream disk imaging + SHA-256 + Chain of Custody), use Emergency Change + WAF Virtual Patching for unpatchable legacy apps, upgrade backups to 3-2-1-1-0 immutable Differential sets validated via Parallel DR Tests, and enforce strict Dev-Test-Prod separation with Parameterized Queries, Output Encoding, Anti-CSRF tokens, and query-size thresholds preventing statistical Inference.',
  },
  examStrategy: {
    examFormat:
      'Computerized Adaptive Testing (CAT): 100 to 150 multiple-choice and advanced innovative questions (25 unscored pretest items), 3 hours (180 minutes), passing score 700 / 1000 across ALL 8 domains. You CANNOT go back to change previous answers—every click is final.',
    timeManagementPlan:
      'Budget ~1.2 minutes per question assuming the full 150-question run (Question 50 by Minute 60, Question 100 by Minute 120). Do NOT panic if the exam continues past Question 100—it simply means the CAT algorithm is gathering precision to confirm a pass; stay calm and keep applying manager judgment!',
    mindsetRules: [
      'Rule #1 — Human Life & Safety ALWAYS Comes First: Any option protecting physical safety beats CIA, uptime, or cost.',
      'Rule #2 — Think Like a Senior Risk Advisor / CISO, NOT a Hands-On Technician: Do not rush to "reconfigure the firewall" or "install tool X" if the better answer is "conduct risk assessment / update policy / consult Data Owner / validate BIA".',
      'Rule #3 — Look for the Umbrella Answer: When three choices are specific tactical tasks and one choice encompasses them (e.g., "Perform a Business Impact Analysis" or "Follow the Change Management Process"), pick the umbrella governance answer.',
      'Rule #4 — Read the Qualifier Word Twice: FIRST, BEST, MOST, PRIMARY, LEAST, EXCEPT. Often all four answers are technically true, and only ONE matches the exact lifecycle step asked.',
      'Rule #5 — Respect Organizational Roles: Senior Management holds ultimate accountability and accepts risk; Data Owners classify and approve access; Custodians implement; Auditors never own controls.',
    ],
    finalWeekChecklist: [
      'Review the 5 high-yield cheat sheets: ISC2 Ethics Order, Quantitative Risk Math (SLE/ALE), Formal Models (BLP/Biba/Clark-Wilson/Brewer-Nash), Cryptography/PKI Keys, and DR/Backup Archive Bits.',
      'Run two full 150-question timed mocks from Mike Chapple’s 4th Edition Practice Tests scoring >= 85% with ZERO domains below 80%.',
      'Re-read your missed-question error log focusing on WHY you fell for a "technician trap" instead of the "manager/risk advisor" answer.',
      'Stop heavy studying 24 hours before the exam—CAT tests calm analytical reading stamina, not last-minute memorization.',
    ],
  },
};
