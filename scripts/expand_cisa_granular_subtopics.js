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
  const match = envContent.match(/postgresql:\/\/[^\s"']+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const cisaId = 'a0000000-0000-0000-0000-000000000001';

// Comprehensive granular subtopics definitions mapped to the 60 CISA topics
const granularSubtopicsMap = {
  // === DOMAIN 1: 1A1 to 1B6 ===
  '1A1': [
    {
      subtopic_code: '1A1.1',
      name: 'ISACA IS Audit & Assurance Standards Framework (ITAF 4th Edition)',
      estimated_read_minutes: 15,
      learning_objectives: 'Understand the mandatory requirements of ITAF standards (General 1000, Performance 1200, Reporting 1400) and how they govern IS audit engagements.',
      exam_tips: 'Exam Trap: Standards are MANDATORY for all CISA holders. Guidelines are strongly recommended best practices, and Tools/Techniques provide implementation guidance.',
      key_terms: ['ITAF 4th Edition', 'General Standards', 'Performance Standards', 'Reporting Standards', 'Mandatory Compliance'],
      content_body: `### ITAF 4th Edition Standards Framework

The Information Technology Assurance Framework (ITAF™) 4th Edition is ISACA's comprehensive framework establishing mandatory standards and non-mandatory guidance for IT audit professionals.

#### 1. The Three Categories of ITAF Standards
- **General Standards (1000 series)**: Establish guiding principles for auditor independence, objectivity, professional ethics, due professional care, and competence.
  - *Standard 1001 Audit Charter*: Mandates that the purpose, authority, and responsibility of the internal audit activity must be formally documented and approved by the Audit Committee.
  - *Standard 1002 Organizational Independence*: The audit function must report functionally to the Audit Committee/Board and administratively to the CEO to preserve unbiased objectivity.
  - *Standard 1003 Professional Ethics & Due Care*: Adherence to ISACA's Code of Professional Ethics, confidentiality, and professional skepticism.
- **Performance Standards (1200 series)**: Govern the execution of the audit engagement.
  - *Standard 1201 Engagement Planning*: Scoping, risk assessment, and resource allocation.
  - *Standard 1204 Evidence Collection*: Gathering sufficient, reliable, relevant, and useful evidence.
  - *Standard 1205 Sampling*: Application of statistical or non-statistical sampling.
  - *Standard 1207 Irregularities and Illegal Acts*: Assessing fraud indicators.
- **Reporting Standards (1400 series)**: Define the structure, clarity, accuracy, and distribution of audit deliverables.
  - *Standard 1401 Reporting*: Formal issuance of audit opinions, findings (Criteria, Condition, Cause, Consequence, Corrective Action), and management responses.
  - *Standard 1402 Follow-Up Activities*: Tracking remediation of audit findings.`
    },
    {
      subtopic_code: '1A1.2',
      name: 'IS Internal Audit Function, Audit Charter & Resource Management',
      estimated_read_minutes: 14,
      learning_objectives: 'Analyze the essential components of an IS Audit Charter, management of internal audit functions, and auditor independence.',
      exam_tips: 'Exam Watch: The Audit Charter MUST be approved by the highest level of governance (Audit Committee/Board of Directors), NEVER by operational IT management!',
      key_terms: ['Audit Charter', 'Audit Committee Oversight', 'Functional vs Administrative Reporting', 'Resource Management', 'Specialist Outsourcing'],
      content_body: `### The IS Audit Charter & Organization Independence

#### 1. Key Components of the Audit Charter
An Audit Charter is the formal, foundational document establishing the audit function. It must contain:
1. **Mandate and Purpose**: Defines the mission of the internal audit activity.
2. **Authority and Access**: Explicit authority to access all enterprise systems, records, personnel, and physical facilities without restriction.
3. **Scope of Activities**: Boundaries of audit services, consulting, and assurance engagements.
4. **Reporting Lines**: Dual reporting structure—functional reporting to the Audit Committee / Board of Directors and administrative reporting to the CEO.
5. **Approval**: Re-evaluated periodically and formally approved by the Audit Committee.

#### 2. Managing Audit Resources & External Experts
When internal auditors lack specialized technical skills (e.g., assessing quantum cryptography or mainframe OS kernels), Standard 1006 allows engaging external subject matter experts. However, the IS Auditor remains ultimately responsible for the conclusions and opinion expressed in the final audit report.`
    }
  ],

  '1A2': [
    {
      subtopic_code: '1A2.1',
      name: 'Types of Audits, Control Self-Assessments (CSA) & Integrated Auditing',
      estimated_read_minutes: 15,
      learning_objectives: 'Differentiate between financial, compliance, operational, forensic, and integrated audits, and analyze the benefits and auditor role in CSA.',
      exam_tips: 'Exam Favorite: In Control Self-Assessment (CSA), line managers and process owners facilitate and own the control evaluation; the IS auditor acts as an objective facilitator, NOT the owner of the controls.',
      key_terms: ['Control Self-Assessment (CSA)', 'Integrated Auditing', 'Operational Audit', 'Compliance Audit', 'SOC 1 / SOC 2 / SOC 3'],
      content_body: `### Audit Classifications & Modern Assurance Methods

#### 1. Major Types of Audits
- **Financial Audit**: Assesses the fairness and accuracy of financial statements (e.g., SOX, IFRS).
- **Operational Audit**: Evaluates the efficiency, effectiveness, and economy of internal processes and IT operations.
- **Integrated Audit**: Combines financial, operational, and IT audit testing into a unified engagement to assess end-to-end business process controls.
- **Compliance Audit**: Evaluates adherence to laws, regulations, and contractual standards (e.g., HIPAA, GDPR, PCI-DSS).
- **Forensic Audit**: Specialized investigation to uncover fraud, criminal activities, or evidence for legal proceedings.

#### 2. Control Self-Assessment (CSA)
CSA is a formal methodology empowering operational staff and managers to self-evaluate the effectiveness of internal controls within their business units.
- **Objectives**: Early detection of control deficiencies, heightened control awareness, and continuous risk monitoring.
- **IS Auditor\'s Role**: Facilitator, educator, and objective challenger. The auditor does NOT design or manage the controls.
- **Benefits**: Broadened audit coverage, enhanced employee ownership of risks, and reduced remediation friction.`
    },
    {
      subtopic_code: '1A2.2',
      name: 'Third-Party Assurance Reports (SOC 1, SOC 2, SOC 3 / ISAE 3402)',
      estimated_read_minutes: 12,
      learning_objectives: 'Evaluate Service Organization Control (SOC) reports and determine their applicability for third-party cloud and vendor assurance.',
      exam_tips: 'Type 1 reports only evaluate the design of controls at a specific point in time. Type 2 reports evaluate both design AND operational effectiveness over a minimum 6-month testing period.',
      key_terms: ['SOC 1 (SSAE 18)', 'SOC 2 (Trust Services Criteria)', 'SOC 3', 'Type 1 vs Type 2', 'User Entity Controls (CUECs)'],
      content_body: `### Third-Party Service Organization Assurance

#### 1. SOC Report Categories
- **SOC 1 (SSAE 18 / ISAE 3402)**: Focuses strictly on controls relevant to user entities\' **Internal Control over Financial Reporting (ICFR)**.
- **SOC 2**: Evaluates controls based on ISACA/AICPA **Trust Services Criteria (TSC)**: Security (mandatory), Availability, Processing Integrity, Confidentiality, and Privacy.
- **SOC 3**: A publicly distributable summary of the SOC 2 report without proprietary testing technicalities.

#### 2. Type 1 vs Type 2 Reports
- **Type 1**: Management\'s description of the system and independent auditor\'s opinion on whether controls are suitably designed *as of a specific date*.
- **Type 2**: Assesses both design suitability AND **operating effectiveness** throughout a specified testing period (typically 6 to 12 months). User auditors relying on third-party controls MUST request Type 2 reports!

#### 3. Complementary User Entity Controls (CUECs)
Controls that the service organization assumes the customer (user entity) will implement (e.g., customer must manage user account provisioning and MFA). If CUECs fail at the customer side, the third-party control assurance is void.`
    }
  ],

  '1A3': [
    {
      subtopic_code: '1A3.1',
      name: 'Risk-Based Audit Planning & The Audit Risk Model',
      estimated_read_minutes: 16,
      learning_objectives: 'Master the Audit Risk Model formula (Audit Risk = Inherent Risk x Control Risk x Detection Risk) and apply risk assessments to create annual audit plans.',
      exam_tips: 'Crucial Formula: Detection Risk is the ONLY risk directly controlled by the IS Auditor. If Inherent Risk and Control Risk are high, the auditor MUST lower Detection Risk by doing MORE substantive testing!',
      key_terms: ['Audit Risk Model', 'Inherent Risk', 'Control Risk', 'Detection Risk', 'Materiality Threshold'],
      content_body: `### The Audit Risk Model & Annual Planning

#### 1. The Audit Risk Model
Audit Risk ($AR$) is the risk that an auditor expresses an unqualified (clean) opinion when material weaknesses or errors actually exist.

$$\\text{Audit Risk} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

- **Inherent Risk (IR)**: The susceptibility of an asset or business process to material error or vulnerability before considering internal controls (e.g., complexity of cloud microservices, high transaction volume).
- **Control Risk (CR)**: The risk that management\'s internal controls fail to prevent, detect, or correct an error on a timely basis. (Controlled by management).
- **Detection Risk (DR)**: The risk that the auditor\'s testing procedures fail to detect a material error. **Detection Risk is the ONLY component controlled by the auditor.**

#### 2. Risk-Based Annual Audit Universe
The annual audit universe represents all auditable entities. The IS Auditor conducts an enterprise-wide risk assessment (evaluating financial impact, regulatory exposure, technological obsolescence, and past audit findings) to prioritize high-risk systems for immediate engagement.`
    }
  ],

  '1A4': [
    {
      subtopic_code: '1A4.1',
      name: 'Control Classifications: General vs Application & Functional Types',
      estimated_read_minutes: 15,
      learning_objectives: 'Classify internal controls by functional timing (Preventive, Detective, Corrective, Compensating) and scope (IT General Controls vs Application Controls).',
      exam_tips: 'Exam Trap: Segregation of duties, encryption, and password complexity are PREVENTIVE. Log reviews, smoke alarms, and reconciliation checks are DETECTIVE. Backups, disaster recovery, and patch deployment are CORRECTIVE.',
      key_terms: ['Preventive Controls', 'Detective Controls', 'Corrective Controls', 'Compensating Controls', 'ITGCs vs Application Controls'],
      content_body: `### Internal Control Taxonomy & Design

#### 1. Functional Classifications of Controls
- **Preventive Controls**: Deter errors, unauthorized access, or policy violations before they occur.
  - *Examples*: Segregation of duties, multi-factor authentication, input data type validation masks, biometric door locks.
- **Detective Controls**: Identify errors, unauthorized activities, or anomalies after they occur.
  - *Examples*: Audit log reviews, hash integrity verification, batch total reconciliation, IDS alerts, physical motion sensors.
- **Corrective Controls**: Remedy the consequences of detected errors or security incidents and restore systems to an operational baseline.
  - *Examples*: Incident response playbooks, DRP cutover execution, snapshot restorations, system reboot scripts.
- **Compensating Controls**: Alternative controls implemented when primary controls are economically or technically unfeasible (e.g., mandatory supervisory transaction review when segregation of duties cannot be enforced in small teams).

#### 2. IT General Controls (ITGC) vs Application Controls
- **ITGCs**: Apply to the overarching IT infrastructure, OS, network, databases, and operational environments (e.g., Change Management, Logical Access, Backup Operations).
- **Application Controls**: Automated business logic embedded within specific application software (e.g., Input format checks, Range checks, Processing validity checks, Output distribution limits).`
    }
  ],

  // === DOMAIN 1: PART B (1B1 to 1B6) ===
  '1B1': [
    {
      subtopic_code: '1B1.1',
      name: 'Audit Project Management, Workpapers & Agile Auditing (28th Ed Update)',
      estimated_read_minutes: 15,
      learning_objectives: 'Evaluate audit project phases (Planning, Fieldwork, Reporting, Follow-up), workpaper documentation standards, and Agile auditing methodologies introduced in Version 28.',
      exam_tips: 'New in 28th Edition: Agile Auditing utilizes 2-week sprints, product backlogs of audit risks, daily standups, and continuous stakeholder communication, delivering insights faster than traditional linear waterfall audits.',
      key_terms: ['Agile Auditing', 'Audit Sprints', 'Audit Workpapers', 'Custody of Workpapers', 'Audit Program'],
      content_body: `### Audit Project Execution & Agile Auditing

#### 1. Traditional Audit Project Phases
1. **Planning**: Defining scope, objectives, audit criteria, and resource schedules.
2. **Fieldwork**: Executing test procedures, sampling data, interviewing staff, and documenting workpapers.
3. **Reporting**: Drafting formal audit findings, conducting exit meetings, and issuing final reports.
4. **Follow-Up**: Periodically evaluating management implementation of corrective action plans.

#### 2. Agile Auditing in CISA 28th Edition
Version 28 introduces Agile Auditing to adapt to rapid CI/CD deployment cycles and cloud transformations.
- **Audit Backlog**: Prioritized list of high-risk audit areas instead of rigid annual plans.
- **Audit Sprints**: Fixed-duration timeboxes (1-2 weeks) focusing on discrete micro-audit objectives.
- **Continuous Feedback**: Daily stand-ups and sprint reviews provide real-time assurance findings to management without waiting months for a monolithic final report.

#### 3. Audit Workpaper Standards
Workpapers are the property of the audit organization and must document:
- Audit scope, objectives, and testing methodology.
- Source data, sample sizes, and calculation formulas.
- Reviewer signatures confirming supervisory review before draft issuance.`
    }
  ],

  '1B4': [
    {
      subtopic_code: '1B4.1',
      name: 'Audit Data Analytics, CAATs & Artificial Intelligence in IS Audit (28th Ed Update)',
      estimated_read_minutes: 16,
      learning_objectives: 'Analyze Computer-Assisted Audit Techniques (CAATs), Generalized Audit Software (GAS), Continuous Auditing, and the 28th Edition additions on Artificial Intelligence and Machine Learning in IT Audit.',
      exam_tips: 'New in 28th Edition: When auditing AI/ML models, the IS auditor must verify model explainability, algorithmic bias, training data integrity, and drift detection controls!',
      key_terms: ['CAATs', 'Generalized Audit Software (GAS)', 'Continuous Auditing / Monitoring', 'AI in Audit', 'Algorithmic Bias'],
      content_body: `### Audit Data Analytics & AI in IS Audit

#### 1. Computer-Assisted Audit Techniques (CAATs)
CAATs allow auditors to test 100% of transaction populations rather than relying on small sample sizes.
- **Generalized Audit Software (GAS)**: Tools (e.g., ACL, IDEA, Python/SQL scripts) used to extract, filter, join, and analyze large datasets from heterogeneous databases.
- **Continuous Auditing**: Automated scripts running continuously in production to detect control violations and anomalies in real-time.

#### 2. Artificial Intelligence & Machine Learning in IT Audit (28th Edition)
The 28th Edition introduces formal competencies for auditing AI and utilizing AI in audit workflows:
- **Audit Algorithms**: Machine learning classifiers deployed to detect fraudulent expense claims, unusual network traffic, or anomalous ledger entries.
- **Auditing AI Systems**:
  - *Data Provenance & Bias*: Ensuring training datasets are representative, uncorrupted, and free from unfair societal bias.
  - *Model Explainability & Transparency*: Verifying that AI outputs (e.g., automated credit scoring or threat scoring) can be traced and justified to human overseers.
  - *Model Drift & Re-training*: Monitoring automated systems for performance degradation over time.`
    }
  ],

  // === DOMAIN 2: 2A1 to 2B4 ===
  '2A2': [
    {
      subtopic_code: '2A2.1',
      name: 'IT Governance Structures: IT Strategy Committee vs IT Steering Committee',
      estimated_read_minutes: 15,
      learning_objectives: 'Distinguish between the Board-level IT Strategy Committee and executive-level IT Steering Committee, and analyze the Three Lines Model.',
      exam_tips: 'Classic CISA Exam Trap: The IT Strategy Committee is at the BOARD OF DIRECTORS level (governance/oversight). The IT Steering Committee is at the EXECUTIVE MANAGEMENT level (implementation/resource allocation).',
      key_terms: ['IT Strategy Committee', 'IT Steering Committee', 'Board of Directors', 'Three Lines Model', 'Segregation of Duties'],
      content_body: `### IT Governance Structures & Oversight Committees

#### 1. IT Strategy Committee vs IT Steering Committee
- **IT Strategy Committee (Board Level)**:
  - *Members*: Board members and non-executive directors.
  - *Role*: Provides strategic direction, ensures IT aligns with business strategy, reviews IT risk appetite, and advises the full Board.
- **IT Steering Committee (Executive Management Level)**:
  - *Members*: CIO, CFO, Business Unit Heads, Chief Risk Officer.
  - *Role*: Prioritizes IT investments, approves major IT project budgets, resolves resource allocation disputes, monitors project milestones.

#### 2. The Three Lines Model (2020 Update in 28th Edition)
1. **First Line (Operational Management)**: Direct provision of products/services; day-to-day risk management and internal control execution.
2. **Second Line (Risk & Compliance Functions)**: Provides expertise, frameworks, compliance monitoring, and independent challenge to the first line.
3. **Third Line (Internal Audit)**: Provides independent, objective assurance to the Governing Body (Board/Audit Committee) across all enterprise activities.`
    }
  ],

  '2A6': [
    {
      subtopic_code: '2A6.1',
      name: 'Data Privacy Programs, GDPR/CCPA & Transborder Data Flows (28th Ed Update)',
      estimated_read_minutes: 16,
      learning_objectives: 'Evaluate comprehensive data privacy programs, lawful basis for processing, data subject rights, Data Protection Impact Assessments (DPIAs), and cross-border data transfer safeguards.',
      exam_tips: 'New in 28th Edition: Transborder data flows require adequate legal mechanisms (e.g., Standard Contractual Clauses, Binding Corporate Rules) before PII can be exported across jurisdictional borders.',
      key_terms: ['Data Privacy Program', 'GDPR', 'CCPA/CPRA', 'Data Subject Rights', 'Transborder Data Flow', 'DPIA'],
      content_body: `### Data Privacy Governance & Global Regulations

#### 1. Foundational Privacy Principles (GDPR / CCPA / ISO 27701)
- **Lawful Basis for Processing**: Processing requires explicit consent, contractual necessity, legal obligation, vital interests, or legitimate interest.
- **Data Minimization & Purpose Limitation**: Collect only the minimum personal data necessary for the specified purpose, and retain it no longer than required.
- **Data Subject Rights**:
  - *Right of Access*: Data subjects can request copies of their personal data.
  - *Right to Erasure ("Right to be Forgotten")*: Deleting PII when consent is withdrawn or purpose ceases.
  - *Right to Data Portability*: Providing PII in a structured, machine-readable format.

#### 2. Transborder Data Transfers
Transferring personal data outside the jurisdiction of origin (e.g., EU to non-adequate third countries) mandates:
- **Standard Contractual Clauses (SCCs)**: Pre-approved contractual terms ensuring enforceable data protection rights.
- **Binding Corporate Rules (BCRs)**: Intra-enterprise privacy codes for multinational corporations.
- **Data Protection Impact Assessment (DPIA)**: Mandatory audit prior to initiating high-risk automated processing.`
    }
  ],

  // === DOMAIN 3: 3A1 to 3B4 ===
  '3A3': [
    {
      subtopic_code: '3A3.1',
      name: 'SDLC Models, Agile Methodologies & DevSecOps CI/CD Security (28th Ed Update)',
      estimated_read_minutes: 16,
      learning_objectives: 'Evaluate traditional Waterfall SDLC, Agile Scrum, and modern DevSecOps pipelines with automated shift-left security testing.',
      exam_tips: 'New in 28th Edition: DevSecOps embeds automated security gates (SAST, DAST, SCA) directly into the CI/CD pipeline, ensuring security vulnerabilities are caught before production builds.',
      key_terms: ['SDLC Phases', 'Waterfall vs Agile', 'DevSecOps', 'Shift-Left Security', 'SAST vs DAST'],
      content_body: `### Software Development Lifecycle & DevSecOps

#### 1. Software Development Models
- **Waterfall SDLC**: Sequential, formal phases (Feasibility -> Requirements -> Design -> Coding -> Testing -> Implementation). Well-suited for rigid regulatory systems, but inflexible to changing requirements.
- **Agile Methodologies (Scrum / Kanban)**: Iterative development with cross-functional teams delivering minimal viable product (MVP) increments in short sprints.

#### 2. DevSecOps & Automated CI/CD Pipelines
DevSecOps integrates security practices into DevOps culture, automating controls across the build-test-deploy lifecycle.
- **Shift-Left Security**: Addressing security vulnerabilities early in the design and coding stages when remediation costs are lowest.
- **Static Application Security Testing (SAST)**: White-box source code analysis scanning for coding flaws and hardcoded secrets during developer commits.
- **Dynamic Application Security Testing (DAST)**: Black-box runtime penetration testing analyzing running web services and APIs.
- **Software Composition Analysis (SCA)**: Automated auditing of open-source third-party dependencies for known CVE vulnerabilities.`
    }
  ],

  '3B3': [
    {
      subtopic_code: '3B3.1',
      name: 'System Migration, Cutover Strategies & Automated Rollback Plans',
      estimated_read_minutes: 14,
      learning_objectives: 'Compare parallel, phased, abrupt/direct, and pilot cutover strategies, and evaluate data migration integrity controls and rollback triggers.',
      exam_tips: 'Exam Favorite: Parallel cutover offers the lowest risk because the old and new systems run simultaneously, but it has the highest operational cost. Abrupt/direct cutover has the highest risk but lowest cost.',
      key_terms: ['Parallel Cutover', 'Phased Cutover', 'Abrupt / Direct Cutover', 'Pilot Cutover', 'Rollback Plan'],
      content_body: `### System Go-Live & Cutover Strategies

#### 1. Cutover (Changeover) Strategies
- **Parallel Changeover**: Both old and new systems operate simultaneously for a defined period; outputs are reconciled.
  - *Risk*: Lowest risk; easy fallback.
  - *Cost*: Highest cost and dual workload on operational staff.
- **Phased Changeover**: Incremental rollout by business module, department, or geographic branch.
  - *Risk*: Moderate; allows contained adjustments.
- **Abrupt (Direct / Big Bang) Cutover**: The old system is immediately deactivated and the new system goes live at a specific timestamp.
  - *Risk*: Highest risk; requires exhaustive pre-implementation testing and immediate rollback readiness.
- **Pilot Implementation**: Rolling out the complete system to a single isolated branch or beta user group before full organizational deployment.

#### 2. Data Migration & Fallback Readiness
- **Data Cleansing & Validation**: Reconciling record counts, checksums, and hash values before and after migration.
- **Fallback / Rollback Scenarios**: Clearly defined "Go / No-Go" decision gates and automated rollback scripts in the event that cutover validation tests fail.`
    }
  ],

  // === DOMAIN 4: 4A1 to 4B5 ===
  '4A5': [
    {
      subtopic_code: '4A5.1',
      name: 'Shadow IT & End-User Computing (EUC) Governance (28th Ed Major Expansion)',
      estimated_read_minutes: 15,
      learning_objectives: 'Evaluate the governance, security risks, and audit procedures for Shadow IT, unsanctioned SaaS, and End-User Computing applications like complex spreadsheets and low-code apps.',
      exam_tips: 'New in 28th Edition: Shadow IT occurs when business units deploy unsanctioned software or cloud SaaS without IT knowledge. The auditor must check for Cloud Access Security Broker (CASB) discovery tools and EUC spreadsheet version controls.',
      key_terms: ['Shadow IT', 'End-User Computing (EUC)', 'CASB', 'Low-Code / No-Code', 'Spreadsheet Controls'],
      content_body: `### Shadow IT & End-User Computing (EUC)

#### 1. Understanding Shadow IT & EUC Risks
- **Shadow IT**: Hardware, software, or cloud subscriptions utilized by employees without formal IT authorization or cybersecurity vetting.
  - *Risks*: Data leakage, compliance breaches (GDPR/HIPAA), unpatched vulnerabilities, lack of automated backups.
- **End-User Computing (EUC)**: Systems developed and maintained by business users (e.g., complex Excel macros, Access databases, Power Apps workflows) outside of standard SDLC controls.
  - *Risks*: Undetected formula errors, absence of segregation of duties, zero change management audit trails, lack of version control.

#### 2. IS Audit Procedures for EUC & Shadow IT
1. **Inventory & Discovery**: Utilizing CASB (Cloud Access Security Broker) and DNS log analysis to discover unsanctioned cloud SaaS usage.
2. **EUC Policy & Registration**: Verifying an inventory of all critical spreadsheets and end-user tools used for financial reporting.
3. **Control Testing**: Auditing cell locking, password protection, input validation, and independent formula verification.`
    }
  ],

  '4B3': [
    {
      subtopic_code: '4B3.1',
      name: 'Modern Backup Schemes, The 3-2-1 Strategy & Ransomware-Resilient Storage (28th Ed)',
      estimated_read_minutes: 15,
      learning_objectives: 'Analyze Full, Differential, and Incremental backup schemes, and evaluate the 3-2-1 backup strategy, immutable WORM storage, and air-gapped recovery against ransomware.',
      exam_tips: 'Exam Favorite: Incremental backups only copy data modified since the LAST backup (fastest backup, slowest restore). Differential backups copy data modified since the last FULL backup (slower backup, faster restore: Full + 1 Differential).',
      key_terms: ['3-2-1 Backup Rule', 'Full vs Differential vs Incremental', 'Immutable Storage (WORM)', 'Air-Gapped Backup', 'Restoration Testing'],
      content_body: `### Modern Backup Architectures & Cyber Resilience

#### 1. Backup Types Comparison
- **Full Backup**: Complete copy of all data assets.
  - *Pros*: Fastest single-step restoration.
  - *Cons*: High storage consumption, longest backup window.
- **Differential Backup**: Backs up all files changed since the **last Full backup**.
  - *Restoration*: Requires Last Full + Latest Differential.
- **Incremental Backup**: Backs up only files changed since the **last backup of any type** (Full or Incremental).
  - *Restoration*: Requires Last Full + All successive Incremental backups in chronological order.

#### 2. The 3-2-1 Backup Strategy (28th Edition Standard)
To achieve resilience against enterprise ransomware and site disasters:
- **3** Copies of data (1 primary production copy + 2 backup copies).
- **2** Different media types (e.g., local NVMe/SAN + Cloud Object Storage).
- **1** Copy stored offsite, with at least one copy **Immutable (WORM - Write Once, Read Many)** or physically/logically **Air-Gapped** from the production Active Directory network.`
    }
  ],

  // === DOMAIN 5: 5A1 to 5B6 ===
  '5A3': [
    {
      subtopic_code: '5A3.1',
      name: 'Zero Trust Architecture (ZTA), IAM & Privileged Access Management (PAM) (28th Ed)',
      estimated_read_minutes: 16,
      learning_objectives: 'Evaluate Zero Trust Architecture core tenets (NIST SP 800-207), Privileged Access Management (PAM) credential vaulting, Identity Governance (IGA), and IDaaS.',
      exam_tips: 'New in 28th Edition: Zero Trust operates on the principle "Never Trust, Always Verify"—every access request must be authenticated, authorized, and encrypted regardless of whether it originates inside or outside the corporate network perimeter.',
      key_terms: ['Zero Trust Architecture (ZTA)', 'Never Trust Always Verify', 'Privileged Access Management (PAM)', 'Just-In-Time (JIT) Elevation', 'IGA & IDaaS'],
      content_body: `### Zero Trust Architecture & Modern IAM

#### 1. Zero Trust Architecture (NIST SP 800-207)
Traditional perimeter security assumed that all entities inside the internal corporate network were trustworthy. Zero Trust eliminates implicit trust.
- **Core Tenets**:
  1. All data sources and computing services are considered resources.
  2. All communication is secured regardless of network location.
  3. Access to individual enterprise resources is granted on a per-session basis.
  4. Access is determined by dynamic policy (user identity, device posture, location, behavioral anomalies).
  5. Continuous monitoring and evaluation of device and user security posture.

#### 2. Privileged Access Management (PAM)
PAM controls protect superuser, root, and administrator accounts:
- **Credential Vaulting**: Passwords for administrative accounts are stored in an encrypted vault and automatically rotated upon checkout.
- **Just-In-Time (JIT) Privilege Elevation**: Administrators are granted temporary, time-bound elevated privileges that expire automatically after task completion.
- **Session Recording & Keystroke Logging**: Full video and command telemetry recorded for all privileged bastion sessions.`
    }
  ],

  '5B4': [
    {
      subtopic_code: '5B4.1',
      name: 'Security Monitoring, SIEM, SOAR & Threat Intelligence (28th Ed Update)',
      estimated_read_minutes: 15,
      learning_objectives: 'Evaluate Security Information and Event Management (SIEM), Security Orchestration Automation and Response (SOAR), and Security Operations Center (SOC) workflows.',
      exam_tips: 'New in 28th Edition: SIEM aggregates and correlates event logs to detect security anomalies. SOAR takes automated action via playbooks to contain detected threats without human delay.',
      key_terms: ['SIEM', 'SOAR', 'SOC Tiering', 'Automated Playbooks', 'Threat Intelligence Feeds'],
      content_body: `### Advanced Security Operations: SIEM & SOAR

#### 1. Security Information and Event Management (SIEM)
SIEM platforms aggregate, normalize, and analyze logs from endpoints, servers, firewalls, and applications across the enterprise.
- **Log Correlation**: Linking disparate log events (e.g., 5 failed logins on workstation + sudden VPN connection from Russia + database export) to trigger high-severity alerts.
- **Compliance Reporting**: Generating tamper-proof audit trails to satisfy HIPAA, PCI-DSS, and SOX log retention mandates.

#### 2. Security Orchestration, Automation, and Response (SOAR)
SOAR extends SIEM by automating incident triage and remediation workflows:
- **Automated Playbooks**: Predefined machine-speed workflows (e.g., when ransomware is detected on an endpoint -> automatically revoke user session -> isolate network port -> snapshot host memory -> notify SOC on-call).
- **Reduced MTTR**: Drastically reduces Mean Time to Respond (MTTR) and analyst alert fatigue.`
    }
  ]
};

async function expandSubtopics() {
  await client.connect();
  console.log('Connected to DB. Expanding CISA granular subtopics...');

  // Get topic IDs mapped to topic codes
  const { rows: topicRows } = await client.query(`
    SELECT t.id, t.topic_code, d.domain_number
    FROM topics t
    JOIN domains d ON t.domain_id = d.id
    WHERE d.certification_id = $1
  `, [cisaId]);

  const topicCodeToId = {};
  topicRows.forEach(r => {
    topicCodeToId[r.topic_code] = r.id;
  });

  let insertedCount = 0;
  for (const [topicCode, subList] of Object.entries(granularSubtopicsMap)) {
    const topicId = topicCodeToId[topicCode];
    if (!topicId) {
      console.warn(`Topic code ${topicCode} not found in DB!`);
      continue;
    }

    for (let i = 0; i < subList.length; i++) {
      const sub = subList[i];
      // Check if subtopic_code already exists
      const { rows: existing } = await client.query(
        'SELECT id FROM subtopics WHERE topic_id = $1 AND subtopic_code = $2',
        [topicId, sub.subtopic_code]
      );

      if (existing.length > 0) {
        // Update
        await client.query(
          `UPDATE subtopics SET
            name = $1,
            content_body = $2,
            key_terms = $3,
            exam_tips = $4,
            estimated_read_minutes = $5,
            learning_objectives = $6,
            sort_order = $7
           WHERE id = $8`,
          [
            sub.name,
            sub.content_body,
            sub.key_terms,
            sub.exam_tips,
            sub.estimated_read_minutes || 15,
            sub.learning_objectives,
            i + 1,
            existing[0].id
          ]
        );
      } else {
        // Insert
        await client.query(
          `INSERT INTO subtopics (
            id, topic_id, subtopic_code, name, content_body, key_terms,
            exam_tips, estimated_read_minutes, learning_objectives, sort_order, created_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
          )`,
          [
            topicId,
            sub.subtopic_code,
            sub.name,
            sub.content_body,
            sub.key_terms,
            sub.exam_tips,
            sub.estimated_read_minutes || 15,
            sub.learning_objectives,
            i + 1
          ]
        );
      }
      insertedCount++;
    }
  }

  console.log(`Successfully expanded & verified ${insertedCount} rich CISA granular subtopics!`);
  await client.end();
}

expandSubtopics().catch(err => {
  console.error(err);
  process.exit(1);
});
