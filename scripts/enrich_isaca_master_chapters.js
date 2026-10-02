import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let directUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
    break;
  }
}
if (!directUrl) {
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const CISA_ID = 'a0000000-0000-0000-0000-000000000001';
const CISM_ID = 'a0000000-0000-0000-0000-000000000005';
const CRISC_ID = 'a0000000-0000-0000-0000-000000000006';
const CGEIT_ID = 'a0000000-0000-0000-0000-000000000010';

const ISACA_CHAPTERS = [
  // =========================================================================
  // CISM — Certified Information Security Manager (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: CISM_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Information Security Governance Master Blueprint',
    doc_title: 'ISACA CISM Review Manual (16th Edition / 2026 Release)',
    edition: '16th Edition (2026)',
    read_min: 45,
    takeaways: 'Alignment of security strategy with business objectives, CISO charter, Board oversight, metrics and reporting (KPIs/KRIs/KGIs), and security policy hierarchy.',
    tips: 'On the CISM exam, always think like a business leader / CISO: business goals dictate security goals, not vice versa. Cost-benefit analysis is required before implementing controls.',
    body: `# ISACA CISM Domain 1: Information Security Governance

## 1.1 Foundation of Information Security Governance
Information Security Governance is the system by which an organization's information security program is directed and controlled. It consists of the leadership, organizational structures, and processes that safeguard information assets and support the enterprise's strategic mission.

\`\`\`
+-------------------------------------------------------------------------+
|                  INFORMATION SECURITY GOVERNANCE STRUCTURE              |
|                                                                         |
|  [ Board of Directors ] <========== Directs & Sets Risk Appetite =====  |
|          |                                                             |
|          v                                                             |
|  [ Executive Management (CEO / COO) ] <=== Establishes Strategy ===    |
|          |                                                             |
|          v                                                             |
|  [ Information Security Steering Committee ] <== Cross-Functional ===  |
|          |                                                             |
|          v                                                             |
|  [ Chief Information Security Officer (CISO) ]                         |
|          |                                                             |
|          +---> Security Operations, Architecture, Compliance & Risk    |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 The 6 Outcomes of Effective Information Security Governance
According to ISACA, an effective information security governance program must deliver six specific business outcomes:
1. **Strategic Alignment**: Security requirements are aligned with enterprise goals and business strategy.
2. **Risk Management**: Mitigating risks to an acceptable level defined by executive risk appetite.
3. **Value Delivery**: Optimizing security investments in support of business objectives.
4. **Resource Optimization**: Security knowledge and infrastructure are utilized efficiently and effectively.
5. **Performance Measurement**: Tracking and reporting metrics (KPIs, KRIs, KGIs) to ensure objectives are achieved.
6. **Integration / Assurance**: Seamlessly integrating assurance processes to ensure operations function as intended.

## 1.3 Governance Frameworks and Standards
- **ISO/IEC 27001:2022**: Specification for an Information Security Management System (ISMS), using the Plan-Do-Check-Act (PDCA) lifecycle.
- **COBIT 2019**: Focuses on the governance and management of enterprise IT, establishing distinct governance (EDM) and management (APO, BAI, DSS, MEA) objectives.
- **NIST Cybersecurity Framework (CSF 2.0)**: Organizes security activities into Govern, Identify, Protect, Detect, Respond, and Recover.

## 1.4 Security Policy Hierarchy & Architecture
A robust security program requires a clearly defined document hierarchy:
- **Policy (Mandatory)**: High-level management statements reflecting executive commitment (e.g., Enterprise Information Security Policy).
- **Standards (Mandatory)**: Specific, mandatory requirements, hardware/software specifications, and numerical limits (e.g., minimum 16-character passwords with MFA).
- **Baselines (Mandatory)**: Standardized minimum configuration baselines (e.g., CIS Benchmarks Level 1).
- **Guidelines (Discretionary)**: Recommended best practices and advice.
- **Procedures (Mandatory)**: Detailed step-by-step operational workflows.

## 1.5 Governance Metrics: KPIs, KRIs, and KGIs
- **Key Goal Indicators (KGIs)**: Lagging metrics that indicate *after the fact* whether a business goal was achieved (e.g., zero regulatory fines incurred this fiscal year).
- **Key Performance Indicators (KPIs)**: Measures how well a process is performing in achieving its goals (e.g., 99% of endpoints running updated EDR definitions).
- **Key Risk Indicators (KRIs)**: Leading, forward-looking indicators that provide an early warning signal of increasing risk exposure (e.g., a 40% surge in phishing clicks among finance personnel).

\`\`\`
+-------------------------------------------------------------------------+
|                       METRICS HIERARCHY MATRIX                          |
|                                                                         |
|  Type    Orientation    Purpose                   Example               |
|  ----    -----------    -------                   -------               |
|  KGI     Lagging        Did we reach the goal?    Zero data breaches    |
|  KPI     Operational    Is process working?       95% patches in 14 days|
|  KRI     Leading        Is danger approaching?    Spike in failed logins|
+-------------------------------------------------------------------------+
\`\`\`

## 1.6 Business Case Development & Return on Security Investment (ROSI)
Every major security initiative requires a formal business case demonstrating return on investment.
$$\\text{ROSI} = \\frac{(\\text{ALE}_{\\text{prior}} - \\text{ALE}_{\\text{post}}) - \\text{Annual Cost of Control}}{\\text{Annual Cost of Control}} \\times 100\\%$$`
  },
  {
    cert_id: CISM_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: Information Security Risk Management & Threat Analysis',
    doc_title: 'ISACA CISM Review Manual (16th Edition / 2026 Release)',
    edition: '16th Edition (2026)',
    read_min: 45,
    takeaways: 'Risk identification, qualitative vs quantitative risk analysis, risk appetite vs tolerance, risk treatment options (Accept, Mitigate, Transfer, Avoid), and third-party risk management.',
    tips: 'The Business Owner (Data Owner) is ultimately accountable for accepting risk—the CISO acts as an advisor who quantifies risk and recommends controls.',
    body: `# ISACA CISM Domain 2: Information Security Risk Management

## 2.1 The Risk Management Lifecycle
Information security risk management is the systematic process of identifying, assessing, responding to, and monitoring risks to information assets.

\`\`\`
+-------------------------------------------------------------------------+
|                     RISK MANAGEMENT PROCESS FLOW                        |
|                                                                         |
|  [ 1. Context & Scope ] ===> Define boundaries, assets & risk appetite  |
|            |                                                            |
|            v                                                            |
|  [ 2. Risk Identification ] ==> Assets, Threats, Vulnerabilities, Impact|
|            |                                                            |
|            v                                                            |
|  [ 3. Risk Analysis ] ======> Qualitative (Matrix) & Quantitative (ALE) |
|            |                                                            |
|            v                                                            |
|  [ 4. Risk Evaluation ] ====> Compare against Enterprise Risk Tolerance |
|            |                                                            |
|            v                                                            |
|  [ 5. Risk Treatment ] =====> Mitigate, Transfer, Avoid, or Accept      |
|            |                                                            |
|            v                                                            |
|  [ 6. Continuous Monitoring ] > Track KRIs, audits & control efficacy   |
+-------------------------------------------------------------------------+
\`\`\`

## 2.2 Quantitative Risk Analysis Formulas
Quantitative risk analysis assigns monetary dollar values to all components of risk:
- **Asset Value ($AV$)**: Total replacement and business value of the asset.
- **Exposure Factor ($EF$)**: The percentage of asset value lost if a specific threat event occurs (expressed as a decimal or percentage).
- **Single Loss Expectancy ($SLE$)**: The monetary loss expected each time a threat event strikes:
  $$SLE = AV \\times EF$$
- **Annualized Rate of Occurrence ($ARO$)**: The estimated frequency with which a threat event occurs per calendar year.
- **Annualized Loss Expectancy ($ALE$)**: The expected monetary loss per year resulting from the threat:
  $$ALE = SLE \\times ARO = (AV \\times EF) \\times ARO$$
- **Cost-Benefit Analysis ($CBA$) of a Control**:
  $$\\text{Net Benefit} = ALE_{\\text{before}} - ALE_{\\text{after}} - \\text{Annual Cost of Safeguard (ACS)}$$
  *Rule*: If Net Benefit is positive, the control is financially justified.

\`\`\`
+-------------------------------------------------------------------------+
|                  QUANTITATIVE RISK CALCULATION EXAMPLE                  |
|                                                                         |
|  Datacenter Hardware Asset Value (AV):           $2,000,000             |
|  Flood Exposure Factor (EF):                     50% (0.50)             |
|  Single Loss Expectancy (SLE = AV * EF):         $1,000,000             |
|  Annualized Rate of Occurrence (ARO):            0.1 (Once per 10 yrs)  |
|  ---------------------------------------------------------------------  |
|  Annualized Loss Expectancy (ALE = SLE * ARO):   $100,000 / year        |
|  Cost of Flood Barrier Control (ACS):            $30,000 / year         |
|  ALE Post-Control (residual risk):               $10,000 / year         |
|  Net Annual Benefit ($100k - $10k - $30k):       +$60,000 (JUSTIFIED)   |
+-------------------------------------------------------------------------+
\`\`\`

## 2.3 Risk Appetite vs Risk Tolerance vs Risk Capacity
- **Risk Capacity**: The maximum amount of loss an organization can endure before insolvency/collapse.
- **Risk Appetite**: The broad amount of risk an enterprise is willing to accept in pursuit of its strategic objectives (set by the Board).
- **Risk Tolerance**: The acceptable deviation from the risk appetite for specific projects or operational units.

## 2.4 The 4 Risk Response / Treatment Strategies
1. **Risk Mitigation (Reduction)**: Implementing technical, administrative, or physical safeguards to lower the probability or impact of a threat (e.g., deploying NGFWs and MFA).
2. **Risk Transfer (Sharing)**: Shifting financial risk to a third party (e.g., purchasing cyber liability insurance or outsourcing non-core functions with contractual indemnification).
3. **Risk Avoidance**: Discontinuing the risky activity or business process entirely (e.g., cancelling a high-risk cloud initiative in an unstable jurisdiction).
4. **Risk Acceptance**: Acknowledging the risk and making a conscious executive decision not to implement controls because the cost of mitigation exceeds the potential loss. Must be signed off by the **Asset / Business Owner** and documented in the **Risk Register**.`
  },
  {
    cert_id: CISM_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Information Security Program Development & Management',
    doc_title: 'ISACA CISM Review Manual (16th Edition / 2026 Release)',
    edition: '16th Edition (2026)',
    read_min: 45,
    takeaways: 'Security architecture design, Defense-in-Depth, Security Operations Center (SOC) capabilities, Identity & Access Management (IAM), Security Awareness Training, and continuous control monitoring.',
    tips: 'Security is not an IT project—it is an ongoing operational program. Defense-in-depth ensures that no single point of failure compromises the enterprise.',
    body: `# ISACA CISM Domain 3: Information Security Program Development & Management

## 3.1 Architecture of an Enterprise Security Program
The Information Security Program translates executive governance and risk management strategies into operational security capabilities and safeguards.

\`\`\`
+-------------------------------------------------------------------------+
|                  ENTERPRISE DEFENSE-IN-DEPTH LAYERS                     |
|                                                                         |
|  [ 1. Administrative Controls ] -> Policies, Standards, Background Check|
|          |                                                              |
|          v                                                              |
|  [ 2. Physical Controls ] ======> Fencing, Biometric Locks, CCTV, HVAC  |
|          |                                                              |
|          v                                                              |
|  [ 3. Network Perimeter ] ======> NGFW, DDoS Mitigation, WAF, VPN       |
|          |                                                              |
|          v                                                              |
|  [ 4. Host & Endpoint ] ========> EDR, Patching, Full Disk Encryption   |
|          |                                                              |
|          v                                                              |
|  [ 5. Application Security ] ===> WAF, SAST/DAST, API Gateways          |
|          |                                                              |
|          v                                                              |
|  [ 6. Data Security Core ] =====> AES-256 Encryption, DLP, RBAC, Tokens |
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Security Control Classifications
Security controls are classified by their implementation type and operational function:
- **By Implementation Type**:
  - **Administrative (Managerial)**: Policies, procedures, awareness training, security reviews.
  - **Technical (Logical)**: Firewalls, encryption, authentication systems, SIEM/SOAR.
  - **Physical**: Guard stations, fences, biometric locks, fire suppression systems.
- **By Operational Function**:
  - **Preventive**: Inhibits an attack from succeeding (e.g., MFA, IPS, security guards).
  - **Detective**: Identifies that an attack or anomaly has occurred (e.g., SIEM logs, IDS, audits).
  - **Corrective**: Restores systems back to normal after an incident (e.g., patch management, backup restores).
  - **Deterrent**: Discourages adversaries from attempting attacks (e.g., warning banners, visible CCTV).
  - **Compensating**: Alternative control that provides comparable protection when a primary control is unfeasible.

## 3.3 Identity and Access Management (IAM) Governance
- **Principle of Least Privilege**: Granting users only the minimum permissions necessary to perform their job functions.
- **Separation of Duties (SoD)**: Dividing critical tasks among multiple individuals to prevent fraud and unauthorized changes (e.g., software developers cannot deploy directly to production).
- **Authentication Factors (MFA)**:
  1. *Something you know* (Password, PIN).
  2. *Something you have* (Smartcard, Hardware Token, Authenticator App).
  3. *Something you are* (Biometric fingerprint, facial scan, iris).
  4. *Somewhere you are* (GPS / Geolocation).
  5. *Something you do* (Typing cadence, gait analysis).`
  },
  {
    cert_id: CISM_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Information Security Incident Management & Resilience',
    doc_title: 'ISACA CISM Review Manual (16th Edition / 2026 Release)',
    edition: '16th Edition (2026)',
    read_min: 45,
    takeaways: 'Incident response lifecycle (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned), CSIRT roles, BCP/DRP integration, crisis communications, and post-incident reviews.',
    tips: 'During an active incident, containment and evidence preservation must be balanced with business continuity. Containment takes precedence before eradication.',
    body: `# ISACA CISM Domain 4: Information Security Incident Management

## 4.1 Incident Management Lifecycle & Workflow
Incident management is the capability to detect, analyze, contain, eradicate, and recover from cybersecurity incidents while minimizing business operational disruption.

\`\`\`
+-------------------------------------------------------------------------+
|                  ISACA / NIST INCIDENT RESPONSE LIFECYCLE               |
|                                                                         |
|  [ 1. Preparation ] ======> Tools, playbooks, team training, SLAs       |
|          |                                                              |
|          v                                                              |
|  [ 2. Detection & Analysis ] -> SIEM triage, scoping, classification   |
|          |                                                              |
|          v                                                              |
|  [ 3. Containment ] ======> Short-term isolation vs long-term staging   |
|          |                                                              |
|          v                                                              |
|  [ 4. Eradication ] ======> Root cause elimination, malware removal     |
|          |                                                              |
|          v                                                              |
|  [ 5. Recovery ] ========> Validated production restoration, testing    |
|          |                                                              |
|          v                                                              |
|  [ 6. Post-Incident Review ] -> Lessons learned, root cause analysis    |
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 Computer Security Incident Response Team (CSIRT) Organization
The CSIRT is the operational unit designated to lead incident response:
- **Core Technical Team**: Incident Handler, Forensics Analyst, Network Security Engineer, Threat Intelligence Analyst.
- **Advisory Stakeholders**: Legal Counsel, Human Resources, Public Relations / Communications, Executive Management.
- **Incident Commander (IC)**: Single designated authority responsible for tactical decisions during an active crisis.

## 4.3 Digital Forensics & Order of Volatility
When collecting evidence from a compromised host, the digital forensics investigator must follow the RFC 3227 **Order of Volatility** (from most volatile to least volatile):
1. **CPU Registers and Cache** (Nanoseconds).
2. **System Memory (RAM), routing tables, ARP cache, process tables** (Microseconds).
3. **Temporary File Systems / Swap space / Pagefile**.
4. **Hard Disk Drives, SSDs, non-volatile storage media**.
5. **Remote log repositories, SIEM event logs**.
6. **Physical network topology and archival backup media**.`
  },

  // =========================================================================
  // CRISC — Certified in Risk and Information Systems Control (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: CRISC_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Corporate Governance & Organizational Risk Culture',
    doc_title: 'ISACA CRISC Review Manual (7th Edition / 2026 Release)',
    edition: '7th Edition (2026)',
    read_min: 45,
    takeaways: 'The Three Lines Model, Enterprise Risk Management (ERM) integration (COSO / ISO 31000), Risk Appetite Statements, and Risk Governance committees.',
    tips: 'The Board is responsible for risk oversight and defining appetite; operational business unit leaders (1st Line) own and manage day-to-day risk.',
    body: `# ISACA CRISC Domain 1: Governance & Organizational Risk Culture

## 1.1 Organizational Governance and Risk Culture
Effective risk management begins with strong governance and a culture where risk awareness is embedded into every operational decision.

\`\`\`
+-------------------------------------------------------------------------+
|                    THE IIA THREE LINES MODEL IN RISK                    |
|                                                                         |
|  [ GOVERNING BODY / BOARD OF DIRECTORS / AUDIT COMMITTEE ]              |
|        │                                                ▲               |
|        │ Sets Risk Appetite & Accountability            │ Independent   |
|        ▼                                                │ Assurance     |
|  ┌──────────────────────────────────────────┐           │               |
|  │          EXECUTIVE MANAGEMENT            │           │               |
|  └─────┬──────────────────────────────┬─────┘           │               |
|        │                              │                 │               |
|        ▼                              ▼                 │               |
|  [ 1st LINE OF DEFENSE ]     [ 2nd LINE OF DEFENSE ]    [ 3rd LINE ]    |
|  • Operational Management    • Risk Management Team     • Internal Audit|
|  • Business Unit Leaders     • Compliance & Legal       • Independent   |
|  • Owns & Manages Risk       • Oversight & Challenge    • Objective     |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 Enterprise Risk Management (ERM) Frameworks
1. **COSO ERM 2017 (Enterprise Risk Management - Integrating with Strategy and Performance)**:
   - 5 Interrelated Components: Governance & Culture, Strategy & Objective-Setting, Performance, Review & Revision, and Information, Communication & Reporting.
2. **ISO 31000:2018 (Risk Management Guidelines)**:
   - Core Principles: Integrated, structured, customized, inclusive, dynamic, best available information, human/cultural factors, and continual improvement.

## 1.3 Risk Appetite Statements & Boundary Setting
A formal **Risk Appetite Statement (RAS)** articulates the types and degrees of risk an organization is willing to accept:
- **Qualitative Statements**: "The enterprise has zero tolerance for intentional regulatory non-compliance or patient data exposure."
- **Quantitative Thresholds**: "Total annualized IT loss exposure must not exceed 2% of annual operating revenue."`
  },
  {
    cert_id: CRISC_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: IT Risk Assessment Methodologies & Threat Scenarios',
    doc_title: 'ISACA CRISC Review Manual (7th Edition / 2026 Release)',
    edition: '7th Edition (2026)',
    read_min: 45,
    takeaways: 'Threat scenario identification, vulnerability analysis, risk registers, qualitative risk matrices, and quantitative Monte Carlo simulations.',
    tips: 'A risk scenario must always combine a threat source, a vulnerability, and an adverse business impact on an asset.',
    body: `# ISACA CRISC Domain 2: IT Risk Assessment

## 2.1 Risk Scenario Construction
A valid IT risk scenario consists of four essential components:
- **Asset**: The business process, database, intellectual property, or server at risk.
- **Threat Actor / Source**: Internal malicious user, cybercriminal syndicate, accidental employee error, or natural disaster.
- **Vulnerability**: An unpatched software flaw, missing MFA, lack of physical access controls, or deficient training.
- **Business Consequence**: Financial loss, regulatory sanctions, reputation degradation, or operational outage.

\`\`\`
+-------------------------------------------------------------------------+
|                  RISK SCENARIO CAUSAL CHAIN MODEL                       |
|                                                                         |
|  [ Threat Actor ] === Exploits ===> [ Vulnerability ]                   |
|                                             |                           |
|                                             v                           |
|  [ Adverse Event / Impact ] <=== Affects == [ Critical Business Asset ] |
+-------------------------------------------------------------------------+
\`\`\`

## 2.2 Risk Register Management
The **Risk Register** is the centralized repository of all identified risks across the enterprise:
- **Risk ID & Description**: Unique reference code and plain-language summary.
- **Risk Category**: Operational, strategic, compliance, financial, reputational.
- **Inherent Risk Score**: Impact x Likelihood without safeguards.
- **Current Controls & Control Effectiveness Rating**.
- **Residual Risk Score**: Impact x Likelihood after current controls.
- **Risk Treatment Action Plan & Target Completion Date**.
- **Risk Owner**: Designated business executive accountable for managing the risk.`
  },
  {
    cert_id: CRISC_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Risk Response, Treatment & Reporting',
    doc_title: 'ISACA CRISC Review Manual (7th Edition / 2026 Release)',
    edition: '7th Edition (2026)',
    read_min: 45,
    takeaways: 'Risk response selection (Mitigate, Transfer, Avoid, Accept), Plan of Action & Milestones (POA&M), exception management, and executive risk heat maps.',
    tips: 'Risk acceptance must have an expiration date and mandatory re-evaluation schedule. Unapproved risk acceptance is a governance violation.',
    body: `# ISACA CRISC Domain 3: Risk Response & Reporting

## 3.1 Evaluating and Selecting Risk Responses
When residual risk exceeds the organizational risk tolerance, the risk owner must select an appropriate risk treatment option based on cost-benefit analysis.

\`\`\`
+-------------------------------------------------------------------------+
|                      RISK RESPONSE DECISION MATRIX                      |
|                                                                         |
|  Residual Risk Level    Action Required                                 |
|  -------------------    ----------------------------------------------  |
|  High / Critical        Mitigate immediately or Avoid activity          |
|  Medium / Moderate      Mitigate or Transfer (Insurance / Contracts)    |
|  Low / Minor            Accept risk with formal executive sign-off      |
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Plan of Action & Milestones (POA&M)
A POA&M is a structured remediation tracking tool:
- Identifies specific tasks, milestones, allocated budget, and accountable project managers.
- Tracks remediation velocity against defined completion deadlines.
- Flags overdue remediation items for escalation to executive risk committees.`
  },
  {
    cert_id: CRISC_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Information Technology & Security Controls Design',
    doc_title: 'ISACA CRISC Review Manual (7th Edition / 2026 Release)',
    edition: '7th Edition (2026)',
    read_min: 45,
    takeaways: 'Control design principles, Automated vs Manual controls, Continuous Control Monitoring (CCM), Key Control Indicators (KCIs), and control testing techniques.',
    tips: 'Automated controls provide higher consistency, lower execution cost, and continuous audit trails compared to manual controls.',
    body: `# ISACA CRISC Domain 4: Information Technology & Security Controls

## 4.1 Control Design and Implementation Principles
Internal controls are policies, procedures, practices, and organizational structures designed to provide reasonable assurance that business objectives will be achieved.

### Automated vs Manual Controls
- **Automated Controls**: Built into application software and infrastructure (e.g., system-enforced password complexity, automated database field validation, automated encryption). Highly reliable, consistent, and resistant to human error.
- **Manual Controls**: Performed by individuals (e.g., manual reconciliation of financial reports, physical security check-in log reviews). Subject to human fatigue, error, and intentional bypass.

\`\`\`
+-------------------------------------------------------------------------+
|               CONTINUOUS CONTROL MONITORING (CCM) CYCLE                 |
|                                                                         |
|  [ Enterprise Systems ] === Telemetry Logs ===> [ Analytics Engine ]    |
|                                                          |              |
|  [ Remediation Workflow ] <=== Anomaly Detected =========+              |
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 Key Control Indicators (KCIs)
KCIs measure the effectiveness and reliability of a specific control mechanism:
- Percentage of successful daily immutable backup snapshots.
- Number of unauthorized administrative privilege modifications detected.
- Average time to patch critical zero-day vulnerabilities across the server fleet.`
  },

  // =========================================================================
  // CGEIT — Certified in the Governance of Enterprise IT (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: CGEIT_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Governance of Enterprise IT (Frameworks & COBIT 2019)',
    doc_title: 'ISACA CGEIT Review Manual (8th Edition / 2026 Release)',
    edition: '8th Edition (2026)',
    read_min: 45,
    takeaways: 'COBIT 2019 governance system principles, EDM / APO / BAI / DSS / MEA objectives, IT Strategy alignment, and Board-level governance structures.',
    tips: 'Governance ensures stakeholder needs, conditions, and options are evaluated; Management plans, builds, runs, and monitors activities in alignment with direction set by the governance body.',
    body: `# ISACA CGEIT Domain 1: Governance of Enterprise IT

## 1.1 Core Principles of Enterprise IT Governance
Governance of Enterprise IT (GEIT) ensures that information and technology deliver value to the enterprise, optimize risk, and optimize resource usage.

\`\`\`
+-------------------------------------------------------------------------+
|                  COBIT 2019 GOVERNANCE VS MANAGEMENT                   |
|                                                                         |
|  GOVERNANCE (Board of Directors / Strategy Committee):                  |
|    - Evaluate, Direct and Monitor (EDM Domain)                          |
|                                                                         |
|  MANAGEMENT (Executive Management / Business Unit Leaders):             |
|    - Align, Plan and Organize (APO Domain - 14 Objectives)              |
|    - Build, Acquire and Implement (BAI Domain - 11 Objectives)          |
|    - Deliver, Service and Support (DSS Domain - 6 Objectives)           |
|    - Monitor, Evaluate and Assess (MEA Domain - 4 Objectives)           |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 The 6 Governance System Principles of COBIT 2019
1. **Provide Stakeholder Value**: Balancing benefits, risk, and resources.
2. **Holistic Approach**: Combining processes, structures, information, skills, and culture.
3. **Dynamic Governance System**: Adapting continuously when design factors change.
4. **Governance Distinct from Management**: Clear separation of duties.
5. **Tailored to Enterprise Needs**: Customizing the system using enterprise design factors.
6. **End-to-End Governance System**: Covering all IT functions across the entire enterprise.`
  },
  {
    cert_id: CGEIT_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: IT Resources & Sourcing Optimization',
    doc_title: 'ISACA CGEIT Review Manual (8th Edition / 2026 Release)',
    edition: '8th Edition (2026)',
    read_min: 45,
    takeaways: 'Human resource management, IT sourcing strategies (Insourcing vs Outsourcing vs Cloud), vendor lifecycle management, and Enterprise Architecture (TOGAF).',
    tips: 'When outsourcing, operational tasks are transferred, but ultimate accountability for governance and compliance always remains with enterprise executive leadership.',
    body: `# ISACA CGEIT Domain 2: IT Resources & Sourcing Optimization

## 2.1 Strategic IT Sourcing Models
Enterprises optimize resource utilization through strategic sourcing:
- **Insourcing**: Retaining core competencies and proprietary IP in-house.
- **Outsourcing**: Delegating commodity IT services to specialized vendors.
- **Cloud Computing Models (IaaS, PaaS, SaaS)**: Shifting capital expenditures (CapEx) to operational expenditures (OpEx).

\`\`\`
+-------------------------------------------------------------------------+
|                  VENDOR LIFECYCLE GOVERNANCE STAGES                     |
|                                                                         |
|  [ 1. Sourcing Strategy ] ===> Define business requirements & scope     |
|            |                                                            |
|            v                                                            |
|  [ 2. Due Diligence & RFP ] => Financial health, SOC 2 / ISO 27001 audit|
|            |                                                            |
|            v                                                            |
|  [ 3. Contract & SLA ] ======> Measurable KPIs, Right to Audit, Escrow  |
|            |                                                            |
|            v                                                            |
|  [ 4. Performance Oversight ]> Continuous SLA tracking & quarterly reviews
|            |                                                            |
|            v                                                            |
|  [ 5. Termination & Exit ] ==> Secure data destruction & transition plan|
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: CGEIT_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Benefits Realization & Value Delivery (Val IT)',
    doc_title: 'ISACA CGEIT Review Manual (8th Edition / 2026 Release)',
    edition: '8th Edition (2026)',
    read_min: 45,
    takeaways: 'ISACA Val IT 2.0 Framework, Portfolio / Program / Project Governance, Business Case Lifecycle, Net Present Value (NPV), and Total Cost of Ownership (TCO).',
    tips: 'A business case is not a one-time approval document—it must be maintained and tracked throughout the entire investment lifecycle until benefits are realized.',
    body: `# ISACA CGEIT Domain 3: Benefits Realization & Value Delivery

## 3.1 The ISACA Val IT Framework
Val IT complements COBIT by establishing best practices for enterprise IT investments:
1. **Value Governance (VG)**: Establish governance structures, define investment mix, and set evaluation criteria.
2. **Portfolio Management (PM)**: Identify resource constraints, evaluate and prioritize investment opportunities.
3. **Investment Management (IM)**: Develop comprehensive business cases, execute programs, and monitor benefit realization.

\`\`\`
+-------------------------------------------------------------------------+
|                      VAL IT 2.0 DOMAIN ARCHITECTURE                     |
|                                                                         |
|  [ Value Governance (VG) ] === Sets Strategy, Mix & Hurdle Rates ====>  |
|            |                                                            |
|            v                                                            |
|  [ Portfolio Management (PM) ] === Evaluates & Allocates Capital =====> |
|            |                                                            |
|            v                                                            |
|  [ Investment Management (IM) ] == Executes Programs & Realizes Value = |
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Financial Evaluation Metrics
- **Net Present Value (NPV)**: Sum of present values of incoming cash flows minus initial investment:
  $$NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t} - \\text{Initial Investment}$$
  *Rule*: Accept investments where $NPV > 0$.
- **Total Cost of Ownership (TCO)**: Comprehensive assessment of all direct and indirect costs over the asset lifecycle (acquisition, implementation, maintenance, training, downtime, and decommissioning).`
  },
  {
    cert_id: CGEIT_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Risk Optimization & Internal Controls (CMMI & Risk IT)',
    doc_title: 'ISACA CGEIT Review Manual (8th Edition / 2026 Release)',
    edition: '8th Edition (2026)',
    read_min: 45,
    takeaways: 'CMMI Process Capability Levels (0 to 5), ISACA Risk IT Framework, Key Risk Indicators, and Business Continuity Resilience.',
    tips: 'CMMI Level 3 (Defined) represents standardized organizational processes; Level 5 (Optimizing) focuses on continuous process improvement.',
    body: `# ISACA CGEIT Domain 4: Risk Optimization & Internal Controls

## 4.1 Capability Maturity Model Integration (CMMI) Levels
CMMI evaluates the maturity and effectiveness of enterprise IT processes across 6 levels:

\`\`\`
+-------------------------------------------------------------------------+
|                  CMMI PROCESS MATURITY LEVELS HIERARCHY                 |
|                                                                         |
|  Level 5: OPTIMIZING    -> Continuous improvement via quantitative feed |
|  Level 4: QUANTITATIVE  -> Measured, controlled, and statistically tuned|
|  Level 3: DEFINED       -> Standardized across entire organization      |
|  Level 2: MANAGED       -> Planned, performed, measured, and controlled |
|  Level 1: INITIAL       -> Ad-hoc, chaotic, heroic individual efforts   |
|  Level 0: INCOMPLETE    -> Process not performed or fails to reach goals|
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 ISACA Risk IT Framework
Risk IT bridges the gap between generic ERM frameworks and technical IT risk:
- **Risk Governance (RG)**: Establish risk appetite and common risk view.
- **Risk Evaluation (RE)**: Collect risk data, analyze threats, and maintain risk profiles.
- **Risk Response (RR)**: Articulate risk, select cost-effective treatments, and react to incidents.`
  }
];

async function enrichIsacaChapters() {
  await client.connect();
  console.log('=== ENRICHING ISACA SUITE STUDY MATERIALS TO TEXTBOOK DEPTH ===\n');

  for (const item of ISACA_CHAPTERS) {
    const domRes = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [item.cert_id, item.dom_num]);
    if (domRes.rows.length === 0) {
      console.log(`[SKIP] Could not find domain for cert ${item.cert_id} dom ${item.dom_num}`);
      continue;
    }
    const domainId = domRes.rows[0].id;

    // Check if chapter exists by title / cert / domain
    const existing = await client.query(
      'SELECT id FROM study_materials WHERE certification_id = $1 AND (title = $2 OR (chapter_number = $3 AND domain_id = $4)) LIMIT 1',
      [item.cert_id, item.title, item.ch_num, domainId]
    );

    if (existing.rows.length > 0) {
      await client.query(`
        UPDATE study_materials
        SET title = $1, content_body = $2, estimated_read_minutes = $3,
            key_takeaways = $4, exam_tips = $5, document_title = $6,
            edition = $7, chapter_number = $8, sort_order = $9, domain_id = $10
        WHERE id = $11;
      `, [
        item.title, item.body, item.read_min, item.takeaways, item.tips,
        item.doc_title, item.edition, item.ch_num, item.sort_order, domainId,
        existing.rows[0].id
      ]);
      console.log(`[UPDATED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    } else {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, title, content_type,
          content_body, sort_order, document_title, edition, chapter_number,
          estimated_read_minutes, key_takeaways, exam_tips
        ) VALUES (gen_random_uuid(), $1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        item.cert_id, domainId, item.title, item.body, item.sort_order,
        item.doc_title, item.edition, item.ch_num, item.read_min, item.takeaways, item.tips
      ]);
      console.log(`[INSERTED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    }
  }

  console.log('\n✅ ISACA Suite Study Materials successfully enriched to deep textbook grade!');
  await client.end();
}

enrichIsacaChapters().catch(console.error);
