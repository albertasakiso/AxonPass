import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
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

const CISA_TOPICS_AND_SUBTOPICS = [
  // ==========================================
  // DOMAIN 1: Auditing Process (21%)
  // ==========================================
  {
    domainNumber: 1,
    topicCode: '1.1',
    name: 'IS Audit Standards, Guidelines and Code of Professional Ethics',
    part: 'A',
    contentSummary: 'ITAF framework, mandatory standards, guidelines, tools and techniques, and ethical requirements for IS auditors.',
    subtopics: [
      {
        code: '1.1.1',
        name: 'ISACA ITAF Framework & Mandatory Standards',
        estimatedReadMinutes: 12,
        keyTerms: ['ITAF', 'General Standards', 'Performance Standards', 'Reporting Standards', 'Mandatory vs Guidance'],
        examTips: 'Remember that IS Audit Standards are MANDATORY. Guidelines explain HOW to comply, and Tools/Techniques give step-by-step procedures.',
        learningObjectives: 'Distinguish between mandatory standards and non-mandatory guidance in ITAF; understand audit independence requirements.',
        contentBody: `# ITAF Framework & Mandatory Audit Standards

The **Information Technology Assurance Framework (ITAF)** is a comprehensive, good-practice model established by ISACA. It provides the foundational structure for information systems (IS) audit and assurance professionals globally.

---

## 1. Structure of ITAF

ITAF categorizes its guidance into three distinct tiers:

1. **IS Audit and Assurance Standards (Mandatory)**:
   - **General Standards (Series 1000)**: Focus on the audit charter, independence, objectivity, professional ethics, and due professional care.
   - **Performance Standards (Series 1200)**: Address engagement planning, risk assessment, performance, supervision, and evidence collection.
   - **Reporting Standards (Series 1400)**: Cover reporting format, communication of results, findings, and follow-up activities.
2. **IS Audit and Assurance Guidelines (Non-Mandatory)**:
   - Provide guidance on *how* to apply the standards in specific operational and technological scenarios.
3. **Tools and Techniques (Non-Mandatory)**:
   - Provide procedural examples, templates, scripts, and step-by-step methodologies.

---

## 2. Professional Ethics & Independence

- **Organizational Independence**: The audit function must report to a level that allows fulfilling its responsibilities without management interference (typically the Audit Committee or Board of Directors).
- **Professional Objectivity**: Auditors must maintain an impartial, unbiased attitude and avoid any conflicts of interest. If an auditor previously designed or implemented a system, they must refrain from auditing it for a cooling-off period (usually at least 1 year).`
      },
      {
        code: '1.1.2',
        name: 'Audit Charter & Terms of Engagement',
        estimatedReadMinutes: 10,
        keyTerms: ['Audit Charter', 'Authority', 'Scope', 'Responsibilities', 'Audit Committee Approval'],
        examTips: 'The audit charter MUST be approved by the Audit Committee or Board of Directors. It grants the auditor formal authority and full access to records and personnel.',
        learningObjectives: 'Define the essential components of an audit charter and the approval hierarchy.',
        contentBody: `# The IS Audit Charter

The **Audit Charter** is the foundational document that formally establishes the internal audit activity within an enterprise.

---

## Key Components of an Audit Charter:
1. **Purpose and Mission**: Clear statement of the role of the IS audit function.
2. **Authority and Access**: Explicit right of access to records, physical property, systems, and personnel necessary for audit execution.
3. **Scope of Work**: Definition of the operational boundaries and types of audit engagements.
4. **Accountability & Reporting Line**: Direct reporting line to the **Audit Committee / Board of Directors** to ensure operational independence.
5. **Responsibility of Management**: Recognition that management retains ultimate responsibility for risk management and internal controls.`
      },
      {
        code: '1.1.3',
        name: 'Risk-Based Audit Planning & Universe',
        estimatedReadMinutes: 15,
        keyTerms: ['Audit Universe', 'Inherent Risk', 'Control Risk', 'Detection Risk', 'Audit Risk Model'],
        examTips: 'Inherent Risk × Control Risk × Detection Risk = Audit Risk. The auditor can only directly control DETECTION RISK through audit sample size and testing rigor.',
        learningObjectives: 'Calculate audit risk components and build a dynamic risk-based annual audit plan.',
        contentBody: `# Risk-Based IS Audit Planning

Risk-based auditing allows the IS auditor to focus limited audit resources on systems and processes representing the greatest financial, operational, and regulatory exposure to the organization.

---

## The Audit Risk Model

$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

* **Inherent Risk (IR)**: The susceptibility of an asset or process to significant error/breach assuming no related internal controls exist.
* **Control Risk (CR)**: The risk that an error or attack will NOT be prevented, detected, or corrected on a timely basis by the internal control system.
* **Detection Risk (DR)**: The risk that the auditor's substantive procedures will fail to detect a material misstatement or control breakdown. **This is the ONLY risk directly controlled by the auditor.**`
      }
    ]
  },
  {
    domainNumber: 1,
    topicCode: '1.2',
    name: 'Audit Project Management and Execution',
    part: 'B',
    contentSummary: 'Fieldwork execution, sampling methods, evidence collection, CAATs, reporting, and follow-up.',
    subtopics: [
      {
        code: '1.2.1',
        name: 'Statistical vs Non-Statistical Sampling & CAATs',
        estimatedReadMinutes: 14,
        keyTerms: ['Attribute Sampling', 'Variable Sampling', 'Stratified Sampling', 'CAATs', 'General Audit Software (GAS)'],
        examTips: 'Attribute sampling = Compliance/Control testing (Yes/No, rate of error). Variable sampling = Substantive testing (Monetary value, balances).',
        learningObjectives: 'Select appropriate sampling techniques and utilize Computer-Assisted Audit Techniques (CAATs).',
        contentBody: `# Audit Sampling & CAATs

Auditors rarely examine 100% of transactions. Sampling allows reaching defensible conclusions on an entire population based on a representative sample.

---

## 1. Sampling Methodologies

- **Attribute Sampling**: Used for **Compliance / Control Testing**. Answers: *Did the control operate or fail?* (e.g., were passwords changed every 90 days?).
- **Variable Sampling**: Used for **Substantive Testing**. Evaluates monetary value or numerical volume (e.g., account balance accuracy).
- **Stratified Sampling**: Subdividing a population into homogenous groups with similar characteristics (e.g., high-dollar transactions analyzed separately).
- **Stop-or-Go Sampling**: Sequential sampling to avoid unnecessary testing when very low error rates are anticipated.

---

## 2. Computer-Assisted Audit Techniques (CAATs)

CAATs enable testing 100% of records in large databases rather than relying on sampling.
- **Generalized Audit Software (GAS)**: Read-only extraction, recalculation, sequence checking, and duplicate record detection.`
      },
      {
        code: '1.2.2',
        name: 'Audit Evidence, Documentation & RCM',
        estimatedReadMinutes: 12,
        keyTerms: ['Audit Evidence', 'Sufficiency', 'Competence', 'Chain of Custody', 'Risk and Control Matrix (RCM)'],
        examTips: 'Evidence hierarchy: Direct physical observation > Independent 3rd party confirmation > Internally generated documentation > Oral inquiry.',
        learningObjectives: 'Evaluate evidence sufficiency and competence; document findings in the Risk and Control Matrix.',
        contentBody: `# Audit Evidence & Risk Control Matrix

Audit findings must be substantiated by competent, relevant, and sufficient evidence.

---

## Evidence Reliability Hierarchy

1. **Most Reliable**: Direct physical observation and inspection by the auditor.
2. **High Reliability**: External, independent third-party confirmations (e.g., bank confirmations, vendor SOC 2 reports).
3. **Moderate Reliability**: Internally generated documentation with strong underlying automated controls.
4. **Least Reliable**: Uncorroborated oral statements from management or auditees.`
      }
    ]
  },

  // ==========================================
  // DOMAIN 2: Governance and Management of IT (17%)
  // ==========================================
  {
    domainNumber: 2,
    topicCode: '2.1',
    name: 'IT Governance Strategy and Frameworks',
    part: 'A',
    contentSummary: 'Strategic alignment, COBIT, IT Strategy Committee, policies, and enterprise architecture.',
    subtopics: [
      {
        code: '2.1.1',
        name: 'IT Strategy Committee vs IT Steering Committee',
        estimatedReadMinutes: 12,
        keyTerms: ['IT Strategy Committee', 'IT Steering Committee', 'Board of Directors', 'COBIT', 'Strategic Alignment'],
        examTips: 'IT Strategy Committee is at the BOARD level (advisory). IT Steering Committee is at the EXECUTIVE / MANAGEMENT level (operational resource allocation).',
        learningObjectives: 'Differentiate board-level IT strategy functions from management steering functions.',
        contentBody: `# IT Strategy Committee vs. IT Steering Committee

Governance ensures that enterprise objectives are achieved by evaluating stakeholder needs, directing through prioritization, and monitoring performance.

---

| Feature | IT Strategy Committee | IT Steering Committee |
| :--- | :--- | :--- |
| **Organizational Level** | **Board of Directors** Level | **Executive / Senior Management** Level |
| **Role** | Strategic Oversight & Guidance | Operational Allocation & Execution |
| **Key Members** | Board members, external IT advisors | CIO, CTO, CFO, Business Unit Heads |
| **Primary Tasks** | Align IT with business strategy; oversee major technology risk & ROI | Prioritize project portfolio, approve IT budgets, resolve cross-departmental conflicts |`
      },
      {
        code: '2.1.2',
        name: 'IT Policies, Standards, Guidelines & Procedures',
        estimatedReadMinutes: 10,
        keyTerms: ['Policy Hierarchy', 'Standards', 'Guidelines', 'Procedures', 'Exceptions'],
        examTips: 'Policies = High-level management mandate (What to do). Standards = Mandatory rules/baselines. Procedures = Step-by-step instructions (How to do it). Guidelines = Recommended best practices.',
        learningObjectives: 'Build and audit the enterprise information security policy hierarchy.',
        contentBody: `# Enterprise Policy Hierarchy

A well-architected governance structure relies on a clear, four-tier documentation hierarchy:

1. **Policies (Mandatory)**: Broad, high-level statements reflecting management philosophy, intent, and direction. Signed by CEO/Board.
2. **Standards (Mandatory)**: Specific metrics, configurations, hardware/software baselines, and rules required to implement policy.
3. **Procedures (Mandatory)**: Detailed step-by-step operational workflows describing *who*, *what*, *when*, and *how*.
4. **Guidelines (Discretionary)**: Practical suggestions, recommendations, and best practices.`
      }
    ]
  },
  {
    domainNumber: 2,
    topicCode: '2.2',
    name: 'IT Risk Management & Resource Allocation',
    part: 'B',
    contentSummary: 'Risk assessment frameworks, risk response, KPI/KRI metrics, and human resource management.',
    subtopics: [
      {
        code: '2.2.1',
        name: 'Risk Treatment Strategies & KRI/KPI Metrics',
        estimatedReadMinutes: 14,
        keyTerms: ['Risk Avoidance', 'Risk Mitigation', 'Risk Transfer', 'Risk Acceptance', 'KRI', 'KPI'],
        examTips: 'Buying cyber insurance is Risk TRANSFER. Shutting down a high-risk service is Risk AVOIDANCE. Installing a firewall is Risk MITIGATION.',
        learningObjectives: 'Select risk treatment options and differentiate between lagging KPIs and leading KRIs.',
        contentBody: `# Risk Treatment Options & Metrics

Once risk is assessed against organizational risk appetite, management selects one of four primary risk responses:

---

## 1. Four Risk Responses
- **Mitigation / Reduction**: Applying internal controls (e.g., encryption, multi-factor authentication) to lower likelihood or impact.
- **Transfer / Sharing**: Passing risk to a third party (e.g., purchasing insurance, outsourcing contracts with SLA warranties).
- **Avoidance**: Eliminating the activity causing the risk (e.g., exiting a risky market, decommissioning vulnerable legacy software).
- **Acceptance**: Formally acknowledging the residual risk and deciding not to take further action because cost of controls exceeds asset value.

---

## 2. Key Performance Indicators (KPIs) vs Key Risk Indicators (KRIs)
- **KPIs (Lagging Indicators)**: Measure historical performance against strategic objectives (e.g., network uptime percentage).
- **KRIs (Leading Indicators)**: Forward-looking predictive indicators that signal increasing risk exposure before an incident occurs (e.g., number of open unpatched high-severity CVEs).`
      }
    ]
  },

  // ==========================================
  // DOMAIN 3: IS Acquisition & Development (12%)
  // ==========================================
  {
    domainNumber: 3,
    topicCode: '3.1',
    name: 'Business Case Analysis & Project Management',
    part: 'A',
    contentSummary: 'Feasibility analysis, business case, PMO, agile vs waterfall, and cost-benefit analysis.',
    subtopics: [
      {
        code: '3.1.1',
        name: 'Business Case Development & Feasibility Studies',
        estimatedReadMinutes: 11,
        keyTerms: ['Business Case', 'Feasibility Study', 'ROI', 'NPV', 'IRR', 'Payback Period'],
        examTips: 'The Business Case is maintained throughout the entire project lifecycle to ensure continued business justification.',
        learningObjectives: 'Evaluate feasibility studies and project justification metrics.',
        contentBody: `# Business Case & Project Feasibility

A business case justifies the capital investment for acquiring or developing new information systems.

---

## Dimensions of Feasibility
- **Economic Feasibility**: Net Present Value (NPV), Internal Rate of Return (IRR), Return on Investment (ROI), Payback Period.
- **Technical Feasibility**: Availability of required hardware, expertise, infrastructure, and compatibility.
- **Operational Feasibility**: User adoption capability, cultural change management, organizational readiness.
- **Legal/Regulatory Feasibility**: GDPR, HIPAA, PCI-DSS compliance requirements.`
      }
    ]
  },
  {
    domainNumber: 3,
    topicCode: '3.2',
    name: 'System Development Methodologies & Post-Implementation Review',
    part: 'B',
    contentSummary: 'SDLC phases, Agile/DevOps, software testing, cutover strategies, and PIR.',
    subtopics: [
      {
        code: '3.2.1',
        name: 'SDLC Phases, Software Testing & Cutover Strategies',
        estimatedReadMinutes: 15,
        keyTerms: ['Unit Testing', 'Integration Testing', 'System Testing', 'UAT', 'Parallel Run', 'Phased Cutover'],
        examTips: 'Parallel run is the SAFEST cutover method but most resource-intensive. Direct / Big Bang cutover is fastest but highest risk.',
        learningObjectives: 'Audit software testing methodologies and evaluate system cutover risks.',
        contentBody: `# Software Testing Hierarchy & Release Strategies

## 1. Testing Phases
1. **Unit Testing**: Conducted by developers on individual code modules.
2. **Integration Testing**: Verifies communication between distinct software components or APIs.
3. **System Testing**: Validates the end-to-end functionality against functional specifications.
4. **User Acceptance Testing (UAT)**: Conducted by business users to verify the system meets operational business needs. **Sign-off is required before production deployment.**

---

## 2. Cutover / Transition Strategies
- **Parallel Run**: Old and new systems run simultaneously. Results compared. **Lowest risk, highest cost.**
- **Phased Cutover**: Incremental rollout by module, branch, or geography.
- **Direct / Cutover (Big Bang)**: Old system decommissioned immediately as new system goes live. **Highest risk.**
- **Pilot Run**: Tested with a single representative user group before full organizational rollout.`
      },
      {
        code: '3.2.2',
        name: 'Post-Implementation Review (PIR)',
        estimatedReadMinutes: 10,
        keyTerms: ['PIR', 'Benefits Realization', 'Lessons Learned', 'Stable State'],
        examTips: 'PIR must occur AFTER the system has operated in normal production for a reasonable period (typically 3 to 6 months) so real benefits and bugs can be evaluated.',
        learningObjectives: 'Conduct post-implementation reviews to assess project success against original business case goals.',
        contentBody: `# Post-Implementation Review (PIR)

The **Post-Implementation Review (PIR)** is conducted after a system has stabilized in live production.

---

## Core Objectives of PIR
1. **Assess Business Case Realization**: Did the new system deliver projected cost savings, revenue increases, or operational efficiencies?
2. **Evaluate Internal Controls**: Are automated controls operating effectively in production?
3. **Review Actual vs Budgeted Costs**: Determine cost and schedule variance.
4. **Identify Lessons Learned**: Feed insights into enterprise project management practices.`
      }
    ]
  },

  // ==========================================
  // DOMAIN 4: IS Operations & Business Resilience (23%)
  // ==========================================
  {
    domainNumber: 4,
    topicCode: '4.1',
    name: 'IT Service Management and Database Administration',
    part: 'A',
    contentSummary: 'ITIL processes, incident/problem management, SLA/OLA, database controls, and change management.',
    subtopics: [
      {
        code: '4.1.1',
        name: 'Incident Management vs Problem Management & Change Control',
        estimatedReadMinutes: 13,
        keyTerms: ['Incident Management', 'Problem Management', 'Root Cause Analysis (RCA)', 'Change Advisory Board (CAB)', 'Emergency Changes'],
        examTips: 'Incident Management = Restore normal service as FAST as possible (workaround). Problem Management = Find and eliminate root cause.',
        learningObjectives: 'Differentiate incident and problem workflows and audit change control authorization gates.',
        contentBody: `# ITSM Incident, Problem & Change Management

## 1. Incident vs Problem Management
- **Incident Management**: Primary goal is restoring service availability as quickly as possible with minimal business disruption (using temporary workarounds if necessary).
- **Problem Management**: Identifies the underlying root cause of incidents to prevent recurrence.

---

## 2. Change Management Lifecycle
All changes to production hardware, network, OS, and software must follow formal governance:
1. **Request for Change (RFC)** submitted.
2. **Impact Assessment & Backout Plan**: Must specify testing evidence and a verified fallback plan.
3. **Change Advisory Board (CAB)** Approval.
4. **Scheduled Implementation & Post-Implementation Verification**.`
      }
    ]
  },
  {
    domainNumber: 4,
    topicCode: '4.2',
    name: 'Business Continuity & Disaster Recovery Planning (BCP/DRP)',
    part: 'B',
    contentSummary: 'BIA, RTO, RPO, recovery sites (Hot, Warm, Cold), and DRP testing methodologies.',
    subtopics: [
      {
        code: '4.2.1',
        name: 'Business Impact Analysis (BIA), RTO, RPO & MTD',
        estimatedReadMinutes: 15,
        keyTerms: ['BIA', 'Recovery Time Objective (RTO)', 'Recovery Point Objective (RPO)', 'Maximum Tolerable Downtime (MTD)', 'Critical Business Functions'],
        examTips: 'BIA is the FIRST step in BCP. RTO = time to restore system. RPO = acceptable data loss measured in time. RTO + WRT must be <= MTD.',
        learningObjectives: 'Calculate RTO, RPO, and MTD and prioritize critical business processes.',
        contentBody: `# Business Impact Analysis (BIA) & Resilience Metrics

The **Business Impact Analysis (BIA)** is the foundational first step in developing an effective Business Continuity Plan (BCP).

---

## Critical Resilience Metrics

1. **Maximum Tolerable Downtime (MTD)**: The maximum duration a business process can remain unavailable before irreversible harm occurs.
2. **Recovery Time Objective (RTO)**: The target duration within which a system or application must be restored following an outage ($RTO \\le MTD$).
3. **Recovery Point Objective (RPO)**: The acceptable data loss volume measured backward in time from the moment of disruption.
4. **Work Recovery Time (WRT)**: Time needed to verify data integrity and resume normal business operations ($RTO + WRT \\le MTD$).`
      },
      {
        code: '4.2.2',
        name: 'Recovery Site Types & DRP Testing Hierarchy',
        estimatedReadMinutes: 14,
        keyTerms: ['Hot Site', 'Warm Site', 'Cold Site', 'Tabletop Exercise', 'Simulation Test', 'Parallel Test', 'Full Interruption Test'],
        examTips: 'DRP testing order: Checklist review ➔ Tabletop/Walkthrough ➔ Simulation ➔ Parallel test ➔ Full interruption (cutoff). Full interruption carries the HIGHEST operational risk.',
        learningObjectives: 'Select alternate processing sites and design progressive DRP exercise scenarios.',
        contentBody: `# Alternate Processing Sites & DRP Testing

## 1. Alternate Site Strategies
- **Hot Site**: Fully configured with mirrored hardware, software, and real-time replicated data. RTO: Minutes to hours. **Highest cost.**
- **Warm Site**: Equipped with hardware and network, but data must be restored from backups. RTO: 24 to 72 hours.
- **Cold Site**: Basic facility with HVAC, power, and connectivity, but NO pre-installed computing hardware. RTO: Weeks. **Lowest cost.**
- **Cloud Disaster Recovery**: On-demand spin-up with pilot light or warm standby architectures.

---

## 2. Five DRP Test Types
1. **Checklist Review (Desktop Review)**: Plan distributed to managers to verify accuracy.
2. **Tabletop / Structured Walkthrough**: Team gathers to verbally walk through a disaster scenario.
3. **Simulation Test**: Simulated event where recovery teams mobilize without interrupting live operations.
4. **Parallel Test**: Recovery site is brought live and tested with historical transactions while primary site remains in full production.
5. **Full Interruption Test**: Primary site is shut down and all production traffic fails over to the recovery site. **Maximum realism, maximum risk.**`
      }
    ]
  },

  // ==========================================
  // DOMAIN 5: Protection of Information Assets (27%)
  // ==========================================
  {
    domainNumber: 5,
    topicCode: '5.1',
    name: 'Logical Access Controls & Identity Management',
    part: 'A',
    contentSummary: 'Authentication, authorization, RBAC/ABAC, directory services, PAM, and multi-factor authentication.',
    subtopics: [
      {
        code: '5.1.1',
        name: 'Authentication Factors & Access Control Models',
        estimatedReadMinutes: 14,
        keyTerms: ['MFA', 'Something you know', 'Something you have', 'Something you are', 'RBAC', 'ABAC', 'Principle of Least Privilege'],
        examTips: 'MFA requires 2 or more DIFFERENT categories (e.g. password + hardware token). Two passwords is NOT MFA. Biometrics = Type 3 (something you are).',
        learningObjectives: 'Implement multi-factor authentication architectures and evaluate least privilege access control models.',
        contentBody: `# Authentication & Access Control Models

## 1. The Three Primary Authentication Factors
True **Multi-Factor Authentication (MFA)** requires credentials from at least two **distinct** categories:
1. **Knowledge (Something you know)**: Passwords, PINs, passphrase.
2. **Possession (Something you have)**: Smart cards, hardware tokens, Authenticator app TOTP codes.
3. **Inherence (Something you are)**: Fingerprint, iris scan, facial geometry.

---

## 2. Access Control Models
- **Role-Based Access Control (RBAC)**: Permissions assigned based on job function or title.
- **Attribute-Based Access Control (ABAC)**: Dynamic evaluation of user attributes, resource tags, environmental factors (location, time).
- **Discretionary Access Control (DAC)**: The owner of the data determines access permissions.
- **Mandatory Access Control (MAC)**: Central authority defines security labels (e.g., Top Secret, Confidential) and compares with user security clearances.`
      }
    ]
  },
  {
    domainNumber: 5,
    topicCode: '5.2',
    name: 'Network Security Architecture & Cryptography',
    part: 'B',
    contentSummary: 'Firewalls, IDS/IPS, VPN, symmetric/asymmetric encryption, hashing, and PKI.',
    subtopics: [
      {
        code: '5.2.1',
        name: 'Cryptography: Symmetric, Asymmetric & Public Key Infrastructure (PKI)',
        estimatedReadMinutes: 16,
        keyTerms: ['AES', 'RSA', 'Symmetric vs Asymmetric', 'Digital Signature', 'Certificate Authority (CA)', 'Non-Repudiation'],
        examTips: 'Symmetric = Fast, bulk data encryption (same key). Asymmetric = Key exchange & digital signatures (public/private pair). Digital signature = Hash encrypted with sender’s PRIVATE key (provides Integrity, Authenticity & Non-Repudiation).',
        learningObjectives: 'Differentiate cryptographic algorithms and audit PKI digital certificate lifecycles.',
        contentBody: `# Cryptography Fundamentals & PKI

## 1. Symmetric vs Asymmetric Cryptography

| Feature | Symmetric Encryption | Asymmetric Encryption |
| :--- | :--- | :--- |
| **Keys Used** | 1 Shared Secret Key | 2 Mathematically Related Keys (Public & Private) |
| **Performance** | Extremely fast; ideal for bulk data | Slower (computational overhead) |
| **Algorithms** | AES (128/256-bit), 3DES, ChaCha20 | RSA, ECC, Diffie-Hellman |
| **Primary Use** | Database encryption, disk encryption, VPN tunnels | Digital signatures, SSL/TLS handshake, key exchange |

---

## 2. How Digital Signatures Work
1. Sender creates a cryptographic hash (SHA-256) of the document.
2. Sender encrypts the hash using their **PRIVATE key**.
3. Recipient decrypts the hash using the sender's **PUBLIC key** and compares it to their own computed hash.
4. **Guarantees**: **Integrity** (data unmodified), **Authentication** (proven sender), and **Non-Repudiation** (sender cannot deny transmitting message).`
      }
    ]
  }
];

const GLOSSARY_SEED = [
  { term: 'ITAF', acronym: 'ITAF', def: 'Information Technology Assurance Framework: ISACA framework establishing professional standards and guidelines for IS auditors.', cat: 'Audit Standards', domainNum: 1 },
  { term: 'Audit Charter', acronym: 'AC', def: 'Formal document approved by the board defining audit purpose, authority, scope, and responsibility.', cat: 'Governance', domainNum: 1 },
  { term: 'Inherent Risk', acronym: 'IR', def: 'The susceptibility of an asset or process to error or breach assuming no internal controls exist.', cat: 'Risk', domainNum: 1 },
  { term: 'Control Risk', acronym: 'CR', def: 'The risk that an internal control fails to prevent or detect an error or threat on a timely basis.', cat: 'Risk', domainNum: 1 },
  { term: 'Detection Risk', acronym: 'DR', def: 'The risk that the auditor substantive testing fails to detect a material control breakdown or error.', cat: 'Audit Risk', domainNum: 1 },
  { term: 'CAATs', acronym: 'CAAT', def: 'Computer-Assisted Audit Techniques: Automated software used by auditors to analyze entire datasets.', cat: 'Audit Tools', domainNum: 1 },
  { term: 'COBIT', acronym: 'COBIT', def: 'Control Objectives for Information and Related Technologies: Comprehensive governance framework by ISACA.', cat: 'IT Governance', domainNum: 2 },
  { term: 'IT Strategy Committee', acronym: 'ITSC', def: 'Board-level committee providing governance, strategic alignment, and risk oversight of enterprise IT.', cat: 'Governance', domainNum: 2 },
  { term: 'IT Steering Committee', acronym: 'ITSC', def: 'Executive management committee responsible for prioritizing projects and allocating IT resources.', cat: 'Management', domainNum: 2 },
  { term: 'Key Risk Indicator', acronym: 'KRI', def: 'A leading metric used by management to signal rising risk exposure before an incident occurs.', cat: 'Risk Metrics', domainNum: 2 },
  { term: 'Recovery Time Objective', acronym: 'RTO', def: 'Target time within which an IT system or process must be restored following an outage.', cat: 'Resilience', domainNum: 4 },
  { term: 'Recovery Point Objective', acronym: 'RPO', def: 'Maximum acceptable data loss measured back in time from the disruption event.', cat: 'Resilience', domainNum: 4 },
  { term: 'Maximum Tolerable Downtime', acronym: 'MTD', def: 'Maximum duration an organization can survive without a critical business process.', cat: 'BCP/DRP', domainNum: 4 },
  { term: 'Hot Site', acronym: null, def: 'Fully equipped backup site with real-time data replication capable of immediate failover within hours.', cat: 'Disaster Recovery', domainNum: 4 },
  { term: 'Public Key Infrastructure', acronym: 'PKI', def: 'Framework of policies, hardware, and certificates used to manage public key encryption and digital signatures.', cat: 'Cryptography', domainNum: 5 },
  { term: 'Non-Repudiation', acronym: null, def: 'Assurance that the author or sender of a transaction cannot deny authenticating or sending it.', cat: 'Security', domainNum: 5 }
];

async function seedCurriculum() {
  try {
    await client.connect();
    console.log('Connected to live database. Ingesting CISA Curriculum...');

    // 1. Fetch domain mappings
    const domainsRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [CISA_ID]);
    const domainMap = {};
    domainsRes.rows.forEach(r => { domainMap[r.domain_number] = r.id; });

    console.log(`Found ${domainsRes.rows.length} CISA domains in database.`);

    for (const topicData of CISA_TOPICS_AND_SUBTOPICS) {
      const domainId = domainMap[topicData.domainNumber];
      if (!domainId) {
        console.warn(`Domain ${topicData.domainNumber} not found in DB!`);
        continue;
      }

      // Upsert topic
      const topicRes = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, content_summary, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (domain_id, topic_code) DO UPDATE SET
          name = EXCLUDED.name,
          part = EXCLUDED.part,
          content_summary = EXCLUDED.content_summary,
          sort_order = EXCLUDED.sort_order
        RETURNING id
      `, [domainId, topicData.topicCode, topicData.name, topicData.part, topicData.contentSummary, parseInt(topicData.topicCode.replace('.', ''))]);

      const topicId = topicRes.rows[0].id;
      console.log(`  ✓ Topic ${topicData.topicCode}: ${topicData.name}`);

      // Upsert subtopics
      let subSort = 1;
      for (const sub of topicData.subtopics) {
        await client.query(`
          INSERT INTO subtopics (topic_id, subtopic_code, name, content_body, key_terms, exam_tips, estimated_read_minutes, learning_objectives, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (topic_id, subtopic_code) DO UPDATE SET
            name = EXCLUDED.name,
            content_body = EXCLUDED.content_body,
            key_terms = EXCLUDED.key_terms,
            exam_tips = EXCLUDED.exam_tips,
            estimated_read_minutes = EXCLUDED.estimated_read_minutes,
            learning_objectives = EXCLUDED.learning_objectives,
            sort_order = EXCLUDED.sort_order
        `, [
          topicId,
          sub.code,
          sub.name,
          sub.contentBody,
          sub.keyTerms,
          sub.examTips,
          sub.estimatedReadMinutes,
          sub.learningObjectives,
          subSort++
        ]);
        console.log(`    ↳ Subtopic ${sub.code}: ${sub.name}`);
      }
    }

    // 2. Ingest Glossary terms
    console.log('\nIngesting CISA Glossary Terms...');
    for (const term of GLOSSARY_SEED) {
      const domainId = domainMap[term.domainNum] || null;
      await client.query(`
        INSERT INTO glossary_terms (certification_id, domain_id, term, acronym, definition, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (certification_id, term) DO UPDATE SET
          domain_id = EXCLUDED.domain_id,
          acronym = EXCLUDED.acronym,
          definition = EXCLUDED.definition,
          category = EXCLUDED.category
      `, [CISA_ID, domainId, term.term, term.acronym, term.def, term.cat]);
    }
    console.log(`  ✓ Ingested ${GLOSSARY_SEED.length} glossary terms.`);

    console.log('\n=============================================');
    console.log('CISA Curriculum Digestion Complete!');
    console.log('=============================================');
  } catch (err) {
    console.error('Error during CISA curriculum digestion:', err);
  } finally {
    await client.end();
  }
}

seedCurriculum();
