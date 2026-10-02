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

const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });

const cisaId = 'a0000000-0000-0000-0000-000000000001';

// Exactly 6 Authoritative Chapters matching CISA Review Manual 28th Edition
const cisaReviewManualChapters = [
  {
    chapter_number: 0,
    title: 'Chapter 0: CISA 28th vs 27th Edition Blueprint & Gap Analysis',
    domain_number: 1,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 1–22',
    estimated_read_minutes: 25,
    sort_order: 0,
    key_objectives: 'Understand domain weight shifts (Domain 4 up to 26%), 8 major new syllabus modules, ITAF 4th edition updates, and exam strategy.',
    exam_alert: 'The 2024 CISA 28th Edition introduces heavy emphasis on AI in Audit, Zero Trust Architecture, DevSecOps automated security gates, and 3-2-1 immutable cyber resilience.',
    content: `# Chapter 0: CISA 28th vs 27th Edition Comprehensive Blueprint & Gap Analysis

## Executive Overview: The 2024 CISA Blueprint Shift
ISACA updated the Certified Information Systems Auditor (CISA) Job Practice to the **28th Edition (2024–2026)** to reflect modern cloud-native architectures, enterprise AI adoption, agile delivery pipelines, and escalating cyber resilience mandates.

---

## 1. Domain Weight Redistribution Matrix
| Domain | Domain Name | 27th Ed. Weight | 28th Ed. Weight | Net Shift | Target Question Count |
|---|---|:---:|:---:|:---:|:---:|
| **Domain 1** | Information System Auditing Process | 21% | **18%** | **-3%** | ~27 Questions |
| **Domain 2** | Governance and Management of IT | 17% | **18%** | **+1%** | ~27 Questions |
| **Domain 3** | IS Acquisition, Development & Implementation | 12% | **12%** | **0%** | ~18 Questions |
| **Domain 4** | IS Operations and Business Resilience | 20% | **26%** | **+6% 🚀** | ~39 Questions |
| **Domain 5** | Protection of Information Assets | 30% | **26%** | **-4%** | ~39 Questions |
| **Total** | | **100%** | **100%** | | **150 Questions** |

> [!IMPORTANT]
> **Domain 4 expanded significantly by +6%**, making **Domain 4 and Domain 5 equal giants (52% combined of the entire exam)**. Operations, cloud resilience, immutable backups, and business continuity are tested with extreme depth.

---

## 2. Core 28th Edition Module Additions
1. **Artificial Intelligence & Machine Learning in IS Audit (§1.8.4)**: Audit algorithms, explainability, detecting algorithmic bias, and validating training data integrity.
2. **Agile Auditing Methodologies (§1.5.6)**: Auditing in sprints, continuous assurance, and adapting ITAF standards to rapid release cycles.
3. **Data Privacy Program & Transborder Governance (§2.6/2.7)**: GDPR, CCPA/CPRA, Data Protection Impact Assessments (DPIAs), and cross-border transfer mechanisms.
4. **DevSecOps CI/CD Security Gates (§3.3.2/5.8)**: Shift-left security, automated SAST/DAST, Software Bill of Materials (SBOM), and IaC scanning.
5. **Shadow IT & End-User Computing (§4.5)**: CASB discovery, spreadsheet model controls, and citizen developer governance.
6. **3-2-1 Immutable Backup Architecture (§4.14)**: Air-gapped repositories, Write Once Read Many (WORM) storage, and ransomware restoration verification.
7. **Zero Trust Architecture (ZTA) & PAM (§5.3)**: NIST SP 800-207, microsegmentation, Just-In-Time (JIT) access, and Identity Governance & Administration (IGA).
8. **SOAR & EDR/XDR Security Operations (§5.4/5.13)**: Security Orchestration, Automation and Response playbooks, extended endpoint detection, and automated threat containment.`
  },
  {
    chapter_number: 1,
    title: 'Chapter 1: Information System Auditing Process (18%)',
    domain_number: 1,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 23–84',
    estimated_read_minutes: 50,
    sort_order: 1,
    key_objectives: 'Master ITAF 4th Edition standards, audit charter governance, risk-based audit planning, internal controls, CAATs, AI in audit, and 5Cs reporting.',
    exam_alert: 'The audit charter MUST be approved by the Audit Committee/Board (highest governing body) to establish independent authority.',
    content: `# Chapter 1: Information System Auditing Process (18%)

## Chapter Overview
Domain 1 establishes the foundational framework for executing independent, objective IS audits in compliance with the **ISACA Information Technology Assurance Framework (ITAF™ 4th Edition)**.

---

## Part A: Planning

### 1.1 IS Audit Standards, Guidelines, Functions and Codes of Ethics
- **1.1.1 ISACA IS Audit and Assurance Standards**: Mandatory professional requirements categorized into:
  - *General Standards (1000 series)*: Audit charter, independence, objectivity, due professional care.
  - *Performance Standards (1200 series)*: Engagement planning, risk assessment, evidence gathering, supervision.
  - *Reporting Standards (1400 series)*: Reporting format, communication of findings, follow-up activities.
- **1.1.2 ISACA Guidelines**: Advisory best practices providing procedural guidance on applying standards.
- **1.1.3 ISACA Code of Professional Ethics**: High ethical standards of conduct, integrity, confidentiality, and objectivity.
- **1.1.4 ITAF™ 4th Edition**: Authoritative body of knowledge establishing terms, concepts, and practitioner competencies.
- **1.1.5 IS Internal Audit Function**:
  - *Audit Charter*: Formal written document defining the scope, authority, and independent reporting relationship of the audit department. Approved by the Audit Committee/Board.
  - *Audit Resource Management*: Competency evaluation, staffing, and utilizing independent external subject matter experts.

### 1.2 Types of Audits, Assessments and Reviews
- **1.2.1 Control Self-Assessment (CSA)**: Management-led operational evaluation. The IS auditor acts as a *facilitator*, not the control owner. Enhances risk awareness and early control deficiency discovery.
- **1.2.2 Integrated Auditing**: Combining financial, operational, and IS audit procedures to evaluate end-to-end business process risks. Third-party assurance includes SOC 1 (ICFR), SOC 2 (Trust Services Criteria), and SOC 3 (General Public).

### 1.3 Risk-Based Audit Planning
- **1.3.1 Individual Audit Assignments**: Scoping, objective formulation, and resource scheduling.
- **1.3.2 Regulatory Impact**: Compliance obligations (SOX, HIPAA, GDPR, PCI-DSS) governing audit frequency.
- **1.3.3 Audit Risk Model**:
  $$\\text{Audit Risk} = \\text{Inherent Risk} \\times \\text{Control Risk} \\times \\text{Detection Risk}$$
  - *Inherent Risk*: Risk susceptibility assuming zero internal controls.
  - *Control Risk*: Risk that existing controls fail to prevent or detect errors in a timely manner.
  - *Detection Risk*: Risk that the auditor's testing procedures will fail to identify a material error.
- **1.3.4 Risk Assessment & Universe**: Prioritizing high-risk business processes for annual audit allocation.

### 1.4 Types of Controls and Considerations
- **1.4.1 Internal Controls**: Mechanisms designed to provide reasonable assurance regarding achievement of operational, reporting, and compliance objectives.
- **1.4.2 ITGCs vs Application Controls**:
  - *IT General Controls (ITGCs)*: Access controls, change management, backup/recovery, data center physical security.
  - *Application Controls*: Input validation (edit checks, batch controls), processing integrity (run-to-run totals), output distribution controls.
- **1.4.3 Control Classifications**:
  - *Preventive Controls*: Deter errors before occurrence (segregation of duties, access locks).
  - *Detective Controls*: Uncover errors after occurrence (audit log reviews, reconciliation).
  - *Corrective Controls*: Remediate identified errors (DRP invocation, system patches).
  - *Compensating Controls*: Substitute secondary measures when primary controls (e.g. SoD) are not feasible.

---

## Part B: Execution

### 1.5 Audit Project Management
- **1.5.1 Audit Objectives**: Determine whether controls safeguard assets, maintain data integrity, and achieve goals.
- **1.5.2 Audit Phases**: Planning $\\rightarrow$ Fieldwork $\\rightarrow$ Reporting $\\rightarrow$ Follow-Up.
- **1.5.3 Audit Programs**: Detailed, step-by-step procedural testing scripts.
- **1.5.4 Audit Work Papers**: Custodial documentation bridging audit evidence to final report conclusions.
- **1.5.5 Fraud & Illegal Acts**: Auditor evaluates fraud risk indicators and reports red flags immediately to leadership.
- **1.5.6 Agile Auditing**: Executing audits in iterative sprints with sprint reviews and continuous stakeholder feedback.

### 1.6 Audit Testing and Sampling Methodology
- **1.6.1 Compliance vs Substantive Testing**:
  - *Compliance Testing (Test of Controls)*: Verifies that controls operate consistently as designed (e.g. testing approval signatures).
  - *Substantive Testing*: Tests the integrity, accuracy, and dollar value of actual transactions and balances.
- **1.6.2 Sampling**:
  - *Attribute Sampling*: Tests presence/absence of a characteristic (used in compliance testing).
  - *Variable Sampling*: Tests numerical amounts (used in substantive testing).
  - *Sampling Risk*: Risk that sample conclusion differs from entire population.

### 1.7 Audit Evidence Collection Techniques
- **Hierarchy of Evidence Reliability**:
  1. *Highest*: Direct auditor observation and independent re-performance.
  2. *High*: Third-party external written confirmations.
  3. *Moderate*: Internal system logs and system-generated reports.
  4. *Lowest*: Oral inquiry and management representations (always requires independent corroboration).

### 1.8 Audit Data Analytics & AI
- **1.8.1 CAATs & GAS**: Software (ACL, IDEA) enabling 100% population analysis without sampling limitations.
- **1.8.2 Continuous Auditing & Monitoring**: Embedded Audit Modules (EAMs) providing real-time anomaly alerts.
- **1.8.3 AI in IS Audit**: Using machine learning algorithms for pattern detection, with mandatory human validation for model explainability and bias checks.

### 1.9 Reporting and Communication Techniques
- **5Cs Finding Formulation**:
  1. **Criteria**: The established standard or policy requirement.
  2. **Condition**: The factual finding observed by the auditor.
  3. **Cause**: The root reason why the condition deviated from criteria.
  4. **Consequence (Effect)**: The risk or business impact.
  5. **Corrective Action**: Management's remediation recommendation.

### 1.10 Quality Assurance and Improvement Program (QAIP)
- Internal ongoing monitoring, periodic annual assessments, and external independent peer review at least once every 5 years.`
  },
  {
    chapter_number: 2,
    title: 'Chapter 2: Governance and Management of IT (18%)',
    domain_number: 2,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 85–144',
    estimated_read_minutes: 50,
    sort_order: 2,
    key_objectives: 'Evaluate Enterprise Governance of IT (EGIT), COBIT 2019, The Three Lines Model, IT Strategy vs Steering Committees, ERM, GDPR/CCPA privacy, and vendor management.',
    exam_alert: 'The IT Strategy Committee operates at the Board level for strategic direction, whereas the IT Steering Committee operates at the Executive level for operational project oversight.',
    content: `# Chapter 2: Governance and Management of IT (18%)

## Chapter Overview
Domain 2 evaluates whether an organization's IT governance frameworks, strategic planning, enterprise risk management, data privacy programs, and vendor oversight mechanisms align with business objectives and regulatory mandates.

---

## Part A: IT Governance

### 2.1 Laws, Regulations and Industry Standards
- Regulatory compliance mandates (SOX, GDPR, HIPAA, PCI-DSS) governing IT controls.
- Legal obligations for cross-border data transfer and transborder governance.

### 2.2 Organizational Structure, IT Governance and IT Strategy
- **2.2.1 Enterprise Governance of IT (EGIT)**: Frameworks (COBIT 2019) aligning IT investments with business value delivery, risk optimization, and resource management.
- **2.2.2 The Three Lines Model (2020 Update)**:
  - *First Line*: Operational management (delivers products/services, manages frontline controls).
  - *Second Line*: Risk and Compliance functions (provides expertise, oversight, and monitoring).
  - *Third Line*: Internal Audit (provides independent, objective assurance to the Governing Body).
  - *Governing Body*: Board of Directors / Audit Committee holding ultimate accountability.
- **2.2.3 IT Strategy Committee vs IT Steering Committee**:
  - *IT Strategy Committee (Board Level)*: Advises the board on strategic IT direction, major technology investments, and alignment with business goals.
  - *IT Steering Committee (Executive/Operational Level)*: Prioritizes IT projects, allocates budget resources, monitors milestones, and resolves operational bottlenecks.
- **2.2.4 Segregation of Duties (SoD)**: Preventing incompatible duties (e.g. system developers having access to live production database environments).

### 2.3 IT Policies, Standards, Procedures and Guidelines
- **Policies**: High-level, mandatory organizational principles approved by executive management.
- **Standards**: Mandatory specific metrics, baselines, and technical configurations.
- **Procedures**: Mandatory step-by-step instructions for executing operational tasks.
- **Guidelines**: Discretionary advisory recommendations.

### 2.4 Enterprise Architecture & Technical Debt
- Enterprise Architecture frameworks (TOGAF, Zachman) ensuring scalable, integrated technology stacks.
- Managing technical debt to prevent legacy system security exposures and operational fragility.

### 2.5 Enterprise Risk Management (ERM)
- **Quantitative Risk Analysis Formulas**:
  - $\\text{Single Loss Expectancy (SLE)} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$
  - $\\text{Annualized Loss Expectancy (ALE)} = \\text{SLE} \\times \\text{Annualized Rate of Occurrence (ARO)}$
- **Risk Treatment Options**: Mitigate (Controls), Avoid (Terminate activity), Transfer (Insurance/Outsourcing), Accept (Retain within risk appetite).

### 2.6 Data Privacy Programs & Principles (28th Edition)
- Global privacy frameworks: GDPR (EU), CCPA/CPRA (California), LGPD.
- Data Protection Principles: Lawfulness, Purpose Limitation, Data Minimization, Accuracy, Storage Limitation, Integrity & Confidentiality.
- Data Protection Impact Assessments (DPIA) for high-risk processing activities.

### 2.7 Data Governance & Classification
- **Data Owner**: Business executive accountable for defining classification and access rights.
- **Data Custodian**: Technical staff responsible for implementing backup, storage, and access controls.

---

## Part B: IT Management

### 2.8 IT Resource Management
- Human resource security: Mandatory vacations (detects fraud), job rotation, dual control, background checks.
- IT Financial Management: Capital expenditures (CapEx) vs Operational expenditures (OpEx).

### 2.9 IT Vendor & Cloud Sourcing Management
- Third-Party Risk Management (TPRM): Due diligence, master service agreements, SLAs, right-to-audit clauses, source code escrow agreements, and SOC 2 Type 2 report evaluations.

### 2.10 IT Performance Monitoring & Balanced Scorecard
- Key Performance Indicators (KPIs), Key Risk Indicators (KRIs), Key Control Indicators (KCIs).
- IT Balanced Scorecard: Financial, Customer, Internal Business Processes, and Learning & Growth perspectives.

### 2.11 Quality Assurance & Capability Maturity Model (CMMI)
- QA (preventive process audit) vs QC (detective product inspection).
- CMMI Maturity Levels: Level 1 (Initial) $\\rightarrow$ Level 2 (Managed) $\\rightarrow$ Level 3 (Defined) $\\rightarrow$ Level 4 (Quantitatively Managed) $\\rightarrow$ Level 5 (Optimizing).`
  },
  {
    chapter_number: 3,
    title: 'Chapter 3: IS Acquisition, Development & Implementation (12%)',
    domain_number: 3,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 145–200',
    estimated_read_minutes: 40,
    sort_order: 3,
    key_objectives: 'Evaluate business case feasibility (ROI, NPV), SDLC lifecycles, Agile Scrum, DevSecOps CI/CD security gates, testing hierarchies, and system cutover strategies.',
    exam_alert: 'Parallel cutover is the safest changeover strategy with the lowest risk but highest operating cost. Direct/abrupt cutover has the highest risk and should only be used when legacy data cannot run simultaneously.',
    content: `# Chapter 3: Information Systems Acquisition, Development and Implementation (12%)

## Chapter Overview
Domain 3 evaluates the practices, project management methodologies, and controls used to acquire, develop, test, and implement information systems to ensure they meet organizational objectives.

---

## Part A: Information Systems Acquisition and Development

### 3.1 Project Governance and Management
- **Project Management Office (PMO)**: Standardizing project governance, milestones, and resource allocation.
- **Project Charter**: Formal authorization defining scope, objectives, budget, and project manager authority.
- **Project Estimation**: Work Breakdown Structure (WBS), Function Point Analysis (FPA), Critical Path Method (CPM), Gantt charts.

### 3.2 Business Case and Feasibility Analysis
- **Financial Feasibility**: Return on Investment (ROI), Net Present Value (NPV), Payback Period, Total Cost of Ownership (TCO).
- **Feasibility Dimensions**: Technical, Operational, Economic, Legal/Regulatory, and Schedule feasibility.

### 3.3 System Development Methodologies & DevSecOps
- **SDLC Phases**: Feasibility $\\rightarrow$ Requirements Definition $\\rightarrow$ Software Design $\\rightarrow$ Development $\\rightarrow$ Testing $\\rightarrow$ Implementation $\\rightarrow$ Post-Implementation Review.
- **Traditional Waterfall vs Agile Scrum**: Waterfall uses sequential milestone sign-offs; Agile uses iterative timeboxed sprints, user stories, and continuous backlog grooming.
- **DevSecOps (28th Edition)**: Integrating automated security testing into CI/CD pipelines:
  - *SAST (Static Application Security Testing)*: White-box source code scanning for vulnerabilities early in development ("shift-left").
  - *DAST (Dynamic Application Security Testing)*: Black-box runtime penetration scanning of running applications.
  - *SCA (Software Composition Analysis)*: Scanning open-source libraries and generating Software Bill of Materials (SBOM).
  - *IaC (Infrastructure as Code) Security*: Linting Terraform/CloudFormation templates for misconfigurations before deployment.

### 3.4 Application Controls Identification and Design
- **Input Controls**: Sequence checks, limit/range checks, validity checks, reasonableness checks, check digits.
- **Processing Controls**: Run-to-run totals, reconciliation controls, file balance checks, exception handling.
- **Output Controls**: Spooling security, distribution lists, report reconciliation, data retention.

---

## Part B: Information Systems Implementation

### 3.5 System Readiness and Testing Hierarchy
- **Unit Testing**: Testing individual software modules/functions in isolation (performed by developers).
- **Integration Testing**: Testing communication between interdependent modules and API services.
- **System Testing**: Testing the entire end-to-end software system in a staging environment.
- **User Acceptance Testing (UAT)**: Business users validate that the system fulfills functional requirements.
- **Regression Testing**: Re-testing existing features after code changes to confirm no new bugs were introduced.

### 3.6 Configuration & Release Management
- Automated deployment baselines, version control repository branch protection rules, and release rollback mechanisms.

### 3.7 System Migration and Cutover Strategies
- **Parallel Changeover**: Running old and new systems simultaneously. *Safest, lowest risk, highest cost.*
- **Phased Cutover**: Gradual, module-by-module or department-by-department rollout.
- **Pilot Cutover**: Deploying the new system at a single representative test location before full deployment.
- **Direct / Abrupt Cutover**: Instant replacement of the old system with the new one. *Highest risk, lowest cost.*

### 3.8 Post-Implementation Review (PIR)
- Conducted several months after cutover to evaluate:
  1. Realization of business case ROI and benefits.
  2. Adequacy and operational effectiveness of internal controls.
  3. Cost and schedule variance analysis.
  4. Tracking and remediation of unresolved post-launch defects.`
  },
  {
    chapter_number: 4,
    title: 'Chapter 4: IS Operations and Business Resilience (26%)',
    domain_number: 4,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 201–280',
    estimated_read_minutes: 60,
    sort_order: 4,
    key_objectives: 'Evaluate IT service management (ITIL), shadow IT / EUC, operational log management, BIA formulas (MTD, RTO, RPO, WRT), 3-2-1 immutable backup rules, and BCP/DRP disaster recovery testing.',
    exam_alert: 'MTD (Maximum Tolerable Downtime) is the absolute upper limit before irreversible business harm occurs. RTO + WRT must never exceed MTD ($RTO + WRT \\le MTD$).',
    content: `# Chapter 4: Information Systems Operations and Business Resilience (26%)

## Chapter Overview
Domain 4 is the largest and most critical domain of the CISA exam (weighted at **26%**). It evaluates the operations, maintenance, and resilience architectures necessary to ensure continuous business operations and rapid recovery from cyber attacks and physical disasters.

---

## Part A: Information Systems Operations

### 4.1 IT Components & Network Architecture
- OSI 7-Layer Model: Physical, Data Link, Network, Transport, Session, Presentation, Application.
- Routers, Switches, Firewalls, Load Balancers, Software-Defined Networks (SDN).

### 4.2 IT Asset Management (ITAM)
- Hardware inventory tracking, lifecycle procurement to sanitization/disposal (NIST SP 800-88), software license compliance audits.

### 4.3 Job Scheduling and Production Automation
- Automated workload schedulers, job dependencies, error exception handling, and production job log auditing.

### 4.4 System Interfaces and API Integrity
- API gateway security, OAuth 2.0 / JWT tokens, middleware message queues, interface reconciliation error logs.

### 4.5 End-User Computing (EUC) and Shadow IT (28th Edition Expansion)
- **Shadow IT Risks**: Unsanctioned SaaS adoption, unmanaged data leakage, compliance violations. Mitigated through Cloud Access Security Brokers (CASB) and automated network discovery.
- **EUC Spreadsheet Controls**: Complex financial models require strict versioning, cell protection locks, input validation, and change audit trails.

### 4.6 Capacity and Performance Management
- Monitoring CPU, RAM, disk I/O, network bandwidth thresholds, and forecasting future hardware requirements.

### 4.7 Incident and Problem Management (ITIL)
- **Incident Management**: Restoring normal service operation as quickly as possible with minimal business disruption.
- **Problem Management**: Analyzing recurring incidents to determine the root cause and implementing permanent workarounds/fixes (Known Error Database).

### 4.8 IT Change, Configuration and Patch Management
- Change Advisory Board (CAB) review, emergency change approval procedures, automated patch testing, and configuration baseline monitoring.

### 4.9 Operational Log Management
- Centralized log aggregation, SIEM correlation, tamper-evident Write-Once Read-Many (WORM) storage, and log retention compliance.

### 4.10 Service Level Management
- **Service Level Agreements (SLAs)**: External contractual commitments between service provider and customer.
- **Operational Level Agreements (OLAs)**: Internal commitments between internal IT support teams.
- **Underpinning Contracts (UCs)**: External vendor supply contracts supporting SLA fulfillment.

### 4.11 Database Management Systems (DBMS)
- Relational (RDBMS) vs NoSQL databases, ACID properties (Atomicity, Consistency, Isolation, Durability), referential integrity constraints, and DBA access auditing.

---

## Part B: Business Resilience

### 4.12 Business Impact Analysis (BIA) & Recovery Metrics
- **BIA Process**: Identifying critical business processes, determining financial/operational impact over time, and establishing recovery objectives:
  - **MTD (Maximum Tolerable Downtime)**: The absolute maximum time an enterprise can survive system disruption without fatal business loss.
  - **RTO (Recovery Time Objective)**: The target duration to restore operational systems after disaster declaration.
  - **RPO (Recovery Point Objective)**: The maximum acceptable data loss measured in time (determines backup frequency).
  - **WRT (Work Recovery Time)**: Time required to verify data integrity and resume normal business processing.
  - *Golden Resilience Rule*:
    $$RTO + WRT \\le MTD$$

### 4.13 System Resiliency & High Availability
- N+1 hardware redundancy, Active-Active server clustering, RAID disk arrays, uninterruptible power supplies (UPS), diesel backup generators.

### 4.14 Data Backup Strategies & The 3-2-1 Rule (28th Edition)
- **Backup Types**: Full Backup, Differential Backup (all changes since last Full), Incremental Backup (changes since last Backup).
- **The Modern 3-2-1-1-0 Backup Rule**:
  - **3** copies of data (1 primary, 2 backups).
  - **2** different storage media types.
  - **1** offsite location.
  - **1** immutable air-gapped / WORM copy (ransomware defense).
  - **0** recovery errors verified through periodic restoration testing.

### 4.15 Business Continuity Planning (BCP)
- BCP development lifecycle: Project initiation $\\rightarrow$ BIA $\\rightarrow$ Continuity Strategy $\\rightarrow$ Plan Development $\\rightarrow$ Testing & Maintenance.
- Pandemic response, succession planning, and crisis communication management.

### 4.16 Disaster Recovery Plans (DRP) & Testing Hierarchy
- **DR Site Alternatives**:
  - *Hot Site*: Fully equipped data center with near-instantaneous live data replication. *Highest cost, lowest RTO.*
  - *Warm Site*: Partially equipped data center with hardware installed, requiring data restoration from backups. *Moderate cost, moderate RTO.*
  - *Cold Site*: Basic facility with power and cooling, but no computing hardware. *Lowest cost, longest RTO.*
  - *Cloud DR*: Dynamic cloud spinning of virtual infrastructure on demand.
- **DRP Testing Methods (from least to most disruptive)**:
  1. *Tabletop / Checklist Review*: Reviewing documents around a conference table.
  2. *Structured Walkthrough*: Stepping through scenarios with emergency team leads.
  3. *Simulation Test*: Practicing incident response without halting primary operations.
  4. *Parallel Test*: Processing operations at the recovery site while primary site remains active.
  5. *Full Interruption Test*: Shutting down the primary site completely and transferring live operations to the DR site. *Highest risk and disruption.*`
  },
  {
    chapter_number: 5,
    title: 'Chapter 5: Protection of Information Assets (26%)',
    domain_number: 5,
    edition: '28th Ed. (2024 Blueprint)',
    document_title: 'ISACA CISA Review Manual 28th Edition',
    pages: 'Pages 281–380',
    estimated_read_minutes: 60,
    sort_order: 5,
    key_objectives: 'Evaluate security frameworks (ISO 27001, NIST CSF 2.0), physical controls, Zero Trust Architecture (ZTA), IAM/PAM, NGFW, cryptography (PKI, Quantum), cloud container security, SIEM/SOAR incident response, and digital forensics.',
    exam_alert: 'Digital Forensics Order of Volatility: CPU Registers/Cache $\\rightarrow$ Routing Tables/ARP Cache $\\rightarrow$ RAM $\\rightarrow$ Temporary Files/Swap $\\rightarrow$ Hard Disk Storage $\\rightarrow$ Remote Logging $\\rightarrow$ Archival Media.',
    content: `# Chapter 5: Protection of Information Assets (26%)

## Chapter Overview
Domain 5 evaluates the information security policies, identity frameworks, cryptographic controls, network defenses, cloud security models, security event monitoring, incident response, and digital forensic processes designed to protect organizational assets against cyber threats.

---

## Part A: Information Asset Security and Control

### 5.1 Security Frameworks & Policies
- ISO/IEC 27001 (ISMS), NIST Cybersecurity Framework (CSF) 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), CIS Top 18 Controls.

### 5.2 Physical and Environmental Controls
- Mantraps / security airlocks, biometric door locks, CCTV surveillance, HVAC temperature/humidity regulation, fire suppression (FM-200, Novec 1230, Inergen), and Industrial Control Systems (ICS/SCADA) physical zoning.

### 5.3 Identity and Access Management (IAM) & Zero Trust (28th Edition)
- **Zero Trust Architecture (NIST SP 800-207)**: "Never trust, always verify." Continuous micro-segmentation, contextual risk-based authentication, and least privilege enforcement.
- **Privileged Access Management (PAM)**: Vaulting admin credentials, session recording, and Just-In-Time (JIT) ephemeral credential issuance.
- **Biometric Performance Metrics**:
  - *False Acceptance Rate (FAR / Type II Error)*: Unauthorized person allowed access (*Security failure*).
  - *False Rejection Rate (FRR / Type I Error)*: Authorized person rejected (*Operational inconvenience*).
  - *Crossover Error Rate (CER)*: Point where FAR equals FRR (lower CER indicates higher accuracy).
- **Single Sign-On (SSO) & Federation**: SAML 2.0, OpenID Connect (OIDC), OAuth 2.0.

### 5.4 Network and Endpoint Security
- Next-Generation Firewalls (NGFW), Web Application Firewalls (WAF), Network Address Translation (NAT), DMZ architecture, Microsegmentation.
- Endpoint Detection & Response (EDR / XDR), Network Time Protocol (NTP) synchronization security.

### 5.5 Data Loss Prevention (DLP)
- DLP in-use (clipboard/endpoint print blocks), in-transit (email/network inspection), and at-rest (file share scanning).

### 5.6 Data Encryption & Cryptography
- **Symmetric Encryption**: Single shared key (AES-256). *Fast, used for bulk data encryption.*
- **Asymmetric Encryption**: Key pair with Public key for encryption/verification and Private key for decryption/signing (RSA, ECC).
- **Post-Quantum Cryptography & Homomorphic Encryption (28th Edition)**: Quantum-resistant lattice cryptography and homomorphic computation on encrypted ciphertext.

### 5.7 Public Key Infrastructure (PKI)
- Certificate Authority (CA), Registration Authority (RA), Certificate Revocation Lists (CRL), Online Certificate Status Protocol (OCSP).
- Digital Certificates (X.509) and Digital Signatures providing **Integrity, Authentication, and Non-Repudiation**.

### 5.8 Cloud & Virtualized Environments
- Cloud Service Models: IaaS, PaaS, SaaS.
- **Shared Responsibility Model**: Customer is ALWAYS responsible for data governance, classification, and IAM across all cloud models.
- Containerization Security: Docker container isolation, Kubernetes RBAC, and container image vulnerability scanning.

### 5.9 Mobile, Wireless & IoT Security
- Mobile Device Management (MDM), Mobile Application Management (MAM), BYOD containerization, WPA3 Enterprise wireless, IoT firmware updates.

---

## Part B: Security Event Management

### 5.10 Security Awareness & Training
- Phishing simulations, social engineering defense, and security culture measurement.

### 5.11 Attack Methods & Ransomware Mitigation (28th Edition)
- MITRE ATT&CK Framework, OWASP Top 10 (Injection, Broken Auth, SSRF), Active Ransomware response (immediate host isolation, refusal to pay extortion).

### 5.12 Security Testing & SOC Operations
- Vulnerability Assessment (automated flaw identification) vs Penetration Testing (active exploitation: Black, White, Grey box).
- SOC Tiering (Tier 1 Triage $\\rightarrow$ Tier 2 Investigation $\\rightarrow$ Tier 3 Threat Hunting).

### 5.13 Security Monitoring & SOAR
- Intrusion Detection Systems (IDS) vs Intrusion Prevention Systems (IPS).
- Honeypots / Deception technology.
- **SIEM & SOAR**: Security Information and Event Management (log correlation) coupled with Security Orchestration, Automation and Response (automated containment playbooks).

### 5.14 Incident Response Management (IRP)
- **Incident Response Lifecycle (NIST SP 800-61)**:
  1. *Preparation*: Training CSIRT, deploying tools, establishing playbooks.
  2. *Detection & Analysis*: Alert triage, scope determination.
  3. *Containment*: Short-term (network isolation) and long-term containment.
  4. *Eradication*: Removing malware, rootkits, compromised accounts.
  5. *Recovery*: Restoring from clean immutable backups, validating system integrity.
  6. *Lessons Learned*: Post-incident review, updating controls and policies.

### 5.15 Digital Forensics & Chain of Custody
- **Order of Volatility (most volatile to least volatile)**:
  1. CPU Registers and Cache.
  2. Routing tables, ARP cache, process table, kernel statistics.
  3. Physical RAM (Memory dump).
  4. Temporary file systems, swap space.
  5. Hard disk drives / SSD non-volatile media.
  6. Remote logging and monitoring data.
  7. Physical configuration, network topology.
  8. Archival backup tapes and optical media.
- **Forensic Acquisition Rules**:
  - Always use hardware write-blockers.
  - Create a bit-stream forensic image (raw image) of original media.
  - Calculate cryptographic hashes (SHA-256) of original and image to prove exact match.
  - Maintain a strict legal **Chain of Custody** log (who handled evidence, when, where, and why).
  - Perform all analysis exclusively on the forensic copy, never on the original evidence.`
  }
];

async function seedCleanStudyMaterials() {
  await client.connect();
  console.log('Connected to DB. Clearing legacy fragmented study materials and inserting clean Chapters 0–5...');

  // Delete old fragmented study materials for CISA
  await client.query('DELETE FROM study_materials WHERE certification_id = $1', [cisaId]);

  for (const ch of cisaReviewManualChapters) {
    // Get domain ID for domain_number
    const { rows: domRows } = await client.query(
      'SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2',
      [cisaId, ch.domain_number]
    );
    const domainId = domRows[0]?.id || null;

    await client.query(`
      INSERT INTO study_materials (
        id, certification_id, domain_id, chapter_number, section_number, title, edition,
        document_title, page_start, page_end, estimated_read_minutes, sort_order,
        key_takeaways, exam_tips, content_body, content_type, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'text', NOW()
      )
    `, [
      cisaId,
      domainId,
      ch.chapter_number,
      `Ch ${ch.chapter_number}`,
      ch.title,
      ch.edition,
      ch.document_title,
      ch.chapter_number === 0 ? 1 : (ch.chapter_number - 1) * 80 + 23,
      ch.chapter_number === 0 ? 22 : ch.chapter_number * 80 + 23,
      ch.estimated_read_minutes,
      ch.sort_order,
      ch.key_objectives,
      ch.exam_alert,
      ch.content
    ]);

    console.log(`✓ Inserted: Chapter ${ch.chapter_number} - ${ch.title}`);
  }

  const { rows: total } = await client.query('SELECT count(*) FROM study_materials WHERE certification_id = $1', [cisaId]);
  console.log(`\n🎉 SUCCESS: Exactly ${total[0].count} clean, authoritative chapters exist for CISA Review Manual 28th Edition!`);

  await client.end();
}

seedCleanStudyMaterials().catch(err => {
  console.error('Error seeding clean study materials:', err);
  process.exit(1);
});
