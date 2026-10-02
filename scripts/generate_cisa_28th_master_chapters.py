import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

MASTER_CHAPTERS = [
    # =========================================================================
    # CHAPTER 1: DOMAIN 1 (18% — Pages 26 to 88)
    # =========================================================================
    {
        "id": "e0000000-0000-0000-0000-000000000001",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "chapter_number": 1,
        "section_number": "Domain 1",
        "title": "Domain 1: Information System Auditing Process (Official CISA 28th Edition)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024–2026)",
        "page_start": 26,
        "page_end": 88,
        "estimated_read_minutes": 60,
        "sort_order": 1,
        "key_takeaways": "Master the mandatory ITAF standards hierarchy, the audit charter approval governance, the Audit Risk formula (AR = IR × CR × DR), statistical attribute vs variable sampling, evidence reliability hierarchy, CAATs automated testing, the 5 Cs of audit findings, and QAIP peer reviews.",
        "exam_tips": "Always look for highest governance authority (Audit Committee/Board) for charter approval. Auditor never designs controls. Detection risk is the ONLY risk component auditor directly controls. If control risk is HIGH, expand substantive testing. Beta risk is greatest sampling danger.",
        "content_markdown": """# Domain 1: Information System Auditing Process

**Exam Weight: 18% (~27 Questions)** | **Official Reference: CISA Review Manual 28th Edition, Pages 26–88**

---

## 1.1 IS Audit Standards, Guidelines & Code of Ethics (ITAF)

The **Information Technology Assurance Framework (ITAF)** establishes a comprehensive professional model for IS audit and assurance professionals.

### The ITAF Guidance Hierarchy
1. **ITAF Standards (1000, 1200, 1400 Series)**: **MANDATORY**. Must be followed by all CISA holders and IS audit engagements. Failure to comply may result in formal investigation and credential revocation.
   - *General Standards (1000)*: Audit charter, organizational independence, objectivity, professional ethics, due care.
   - *Performance Standards (1200)*: Planning, risk assessment, supervision, evidence, professional judgment.
   - *Reporting Standards (1400)*: Reporting format, communication of findings, follow-up.
2. **ITAF Guidelines (2000, 2200, 2400 Series)**: **ADVISORY / RECOMMENDED**. Provide practical methodologies and explanations for implementing mandatory standards.
3. **ITAF Tools and Techniques (3000 Series)**: Practical white papers, audit programs, sample checklists, and templates.

> 💡 **ISACA / Exam Watch Alert:**
> Standards are **MANDATORY**; Guidelines are **ADVISORY**. If an exam question asks what an IS auditor *MUST* follow, the answer is ISACA Standards and the Code of Professional Ethics.

---

## 1.2 The Internal Audit Charter & Independence

The **Audit Charter** is the foundational governance document empowering the internal audit function.

### Mandatory Governance Rules:
- **Approval**: The charter **MUST be approved by the Audit Committee or Board of Directors**. Signing solely by the CFO, CIO, or CEO impairs organizational independence.
- **Authority**: Must grant the audit team **unrestricted access** to all records, systems, personnel, and physical facilities.
- **Reporting Lines**: Dual-reporting structure—**functional reporting** to the Board/Audit Committee and **administrative reporting** to the CEO.

### Managing Independence Conflicts:
- **Cooling-Off Period**: An IS auditor who previously designed, implemented, or operated a system must **NOT audit that system for at least 12 months (1 year)**.
- **Recusal**: An auditor with a personal conflict of interest must be recused from the engagement.

> 💡 **ISACA / Exam Watch Alert:**
> An IS auditor should **NEVER design or implement controls** for an auditee. Doing so destroys auditor independence. The auditor may recommend best-practice frameworks, but management MUST make all design decisions.

---

## 1.3 Risk-Based Audit Planning & The Audit Risk Model

A **Risk-Based Audit Approach** ensures audit resources are deployed to areas of greatest risk to enterprise objectives.

### The Audit Risk Formula:
$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

| Component | Definition | Controlled By |
| :--- | :--- | :--- |
| **Inherent Risk (IR)** | The susceptibility of a business process to material error or breach, assuming no controls. | Nature of Business / Environment |
| **Control Risk (CR)** | The risk that internal controls fail to prevent or detect errors on a timely basis. | Management Control Design |
| **Detection Risk (DR)** | The risk that the auditor's substantive testing procedures fail to detect errors. | **The IS Auditor** (Sample size & depth) |

> 💡 **ISACA / Exam Watch Alert:**
> **Detection Risk is the ONLY component of audit risk that the IS auditor directly controls!** If Inherent Risk and Control Risk are HIGH, the auditor must set Detection Risk to LOW by increasing substantive testing and sample sizes.

---

## 1.4 Control Classifications & Compensating Controls

- **Preventive Controls**: Stop errors or breaches BEFORE they happen (e.g. SoD, dual authorization, input validation, biometric locks). *Most cost-effective*.
- **Detective Controls**: Discover errors or anomalies AFTER they occur (e.g. log reviews, hash verification, reconciliations).
- **Corrective Controls**: Mitigate impact and restore systems AFTER an incident (e.g. backups, disaster recovery, incident playbooks).

> 💡 **ISACA / Exam Watch Alert:**
> **Preventive controls are ALWAYS preferred over detective or corrective controls**. When a primary control cannot be implemented, management must establish **Compensating Controls** (e.g., independent review of privileged audit logs).

---

## 1.5 Audit Testing & Sampling Methodologies

### Compliance Testing vs. Substantive Testing
- **Compliance Testing (Test of Controls)**: Determines whether internal controls are operating effectively as designed (uses **Attribute Sampling**).
- **Substantive Testing (Test of Details)**: Verifies the dollar accuracy, completeness, and validity of transactions and balances (uses **Variable Sampling**).

> 💡 **ISACA / Exam Watch Alert:**
> If Compliance Testing reveals that controls are **INEFFECTIVE**, the IS auditor must **EXPAND Substantive Testing** to determine the actual financial or operational loss.

### Sampling Risk:
- **Alpha Risk (Type I Error / Incorrect Rejection)**: Control is effective, but sample suggests it is ineffective (causes *audit inefficiency*).
- **Beta Risk (Type II Error / Incorrect Acceptance)**: Control is ineffective, but sample suggests it is effective (causes *audit ineffectiveness*).

> 💡 **ISACA / Exam Watch Alert:**
> **Beta Risk (Incorrect Acceptance)** is the GREATEST danger because the auditor issues a clean opinion on a broken system, exposing the organization to undetected risk.

---

## 1.6 Audit Evidence Reliability Hierarchy

```
HIGHEST RELIABILITY
 ▲  [1. Direct Auditor Re-performance / Physical Inspection]
 │  [2. External Third-Party Confirmation (bank/custodian)]
 │  [3. Auditor Direct Observation (valid only while watching)]
 │  [4. Internal Documentation from Strong Controls]
 │  [5. Internal Documentation from Weak Controls]
 ▼  [6. Oral Inquiries / Management Assertions]
LOWEST RELIABILITY
```

> 💡 **ISACA / Exam Watch Alert:**
> Oral inquiries from management are the **LEAST reliable** form of audit evidence. Inquiries MUST always be corroborated with supporting documentary evidence or system logs.

---

## 1.7 CAATs, Data Analytics & Continuous Auditing

- **Generalized Audit Software (GAS)**: Enables 100% population analysis, eliminating sampling risk for large transaction ledgers.
- **Embedded Audit Module (EAM)**: Real-time code embedded in applications to capture suspect transactions.
- **Integrated Test Facility (ITF)**: Dummy test accounts processed in production alongside live data.

> 💡 **ISACA / Exam Watch Alert:**
> In an **Integrated Test Facility (ITF)**, the auditor's GREATEST concern is ensuring that test transactions are tagged and reversed so they **DO NOT corrupt live production databases or financial ledgers**.

---

## 1.8 Reporting, Findings (5 Cs) & QAIP

### The 5 Cs of a High-Impact Audit Finding:
1. **Criteria**: The benchmark or policy (What should be).
2. **Condition**: The factual evidence observed (What is).
3. **Cause**: The root cause (Why it happened).
4. **Consequence (Effect)**: The business/security impact (Risk).
5. **Corrective Action**: Management recommendation for remediation.

> 💡 **ISACA / Exam Watch Alert:**
> External quality reviews (Peer Reviews) under a **Quality Assurance and Improvement Program (QAIP)** must be conducted at least **once every 5 years** by qualified independent reviewers."""
    },

    # =========================================================================
    # CHAPTER 2: DOMAIN 2 (18% — Pages 89 to 165)
    # =========================================================================
    {
        "id": "e0000000-0000-0000-0000-000000000002",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "chapter_number": 2,
        "section_number": "Domain 2",
        "title": "Domain 2: Governance and Management of IT (Official CISA 28th Edition)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024–2026)",
        "page_start": 89,
        "page_end": 165,
        "estimated_read_minutes": 65,
        "sort_order": 2,
        "key_takeaways": "Master the difference between Board-level IT Strategy Committees and Executive IT Steering Committees, COBIT 2019 architecture, ERM quantitative formulas (ALE = SLE × ARO), Privacy by Design & DPIA, Data Owner vs Custodian accountability, Segregation of Duties, Software Escrow, and CMMI maturity levels.",
        "exam_tips": "IT Strategy Committee = Board level. IT Steering Committee = Executive management. Board sets risk appetite; management operates within it. Data Owner classifies data; IT Custodian protects it. Mandatory vacation detects fraud. Software escrow protects against vendor bankruptcy.",
        "content_markdown": """# Domain 2: Governance and Management of IT

**Exam Weight: 18% (~27 Questions)** | **Official Reference: CISA Review Manual 28th Edition, Pages 89–165**

---

## 2.1 Governance vs. Management of IT

- **Governance (Board of Directors)**: Evaluates stakeholder needs, sets direction through prioritization and decision-making, and monitors performance and compliance (COBIT EDM domain).
- **Management (Executive Management / CIO)**: Plans, builds, runs, and monitors activities in alignment with the direction set by the governance body (COBIT APO, BAI, DSS, MEA domains).

### IT Strategy Committee vs. IT Steering Committee

| Governance Dimension | IT Strategy Committee | IT Steering Committee |
| :--- | :--- | :--- |
| **Organizational Level** | **Board of Directors Level** | **Executive Management Level** |
| **Chairperson** | Independent Board Member | Executive (CIO, COO, or Business Leader) |
| **Primary Mandate** | Advises board on IT alignment, long-term investments, and enterprise risk appetite. | Oversees project budgets, milestone delivery, resource allocation, and project conflicts. |
| **Meeting Cadence** | Quarterly / Bi-annually | Monthly / Bi-weekly |

> 💡 **ISACA / Exam Watch Alert:**
> **IT Strategy Committee = BOARD LEVEL** (advises board on strategic alignment).
> **IT Steering Committee = EXECUTIVE LEVEL** (prioritizes projects and monitors budgets).

---

## 2.2 Enterprise Risk Management (ERM) & Quantitative Risk Formulas

- **Risk Appetite**: The amount and type of risk an enterprise is willing to accept in pursuit of its business goals (set by the **Board of Directors**).
- **Risk Tolerance**: The acceptable operational variation around specific objectives.

### Quantitative Risk Calculations:
$$\\text{Single Loss Expectancy (SLE)} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$
$$\\text{Annualized Loss Expectancy (ALE)} = \\text{SLE} \\times \\text{Annualized Rate of Occurrence (ARO)}$$
$$\\text{Cost-Benefit of Control} = \\text{ALE}_{\\text{before}} - \\text{ALE}_{\\text{after}} - \\text{Annual Control Cost}$$

> 💡 **ISACA / Exam Watch Alert:**
> A security safeguard is **ONLY cost-effective if the annual cost of the control is LESS THAN the reduction in ALE** it achieves.

### The 4 Risk Treatment Responses:
1. **Mitigate (Reduce)**: Implement internal controls.
2. **Transfer (Share)**: Purchase cyber insurance or outsource.
3. **Avoid**: Eliminate the high-risk process or product.
4. **Accept**: Retain the risk within risk appetite (approved by executive risk owner).

---

## 2.3 Privacy Governance & Privacy by Design

- **Privacy by Design & Default**: Embedding data protection into the architecture of systems from the initial concept stage.
- **Data Protection Impact Assessment (DPIA)**: Mandatory risk assessment conducted **BEFORE deploying new technology** that processes sensitive personal data.
- **Cross-Border Transfers**: Compliance with GDPR Standard Contractual Clauses (SCCs) and data sovereignty mandates.

> 💡 **ISACA / Exam Watch Alert:**
> A **DPIA must be completed BEFORE** deploying systems that handle sensitive personal data or automated customer profiling.

---

## 2.4 Data Governance: Data Owners vs. Data Custodians

| Role | Typical Title | Key Responsibilities |
| :--- | :--- | :--- |
| **Data Owner** | Senior Business Leader / VP | **Classifies data**, approves access rights, sets retention periods, assumes legal accountability. |
| **Data Custodian** | IT / Database Administrator | **Implements technical safeguards**, configures encryption, performs backups, ensures uptime. |

> 💡 **ISACA / Exam Watch Alert:**
> The **Data Owner (Business)** is solely accountable for determining data classification and granting user permissions. IT personnel (Data Custodians) only implement technical configurations.

---

## 2.5 Segregation of Duties (SoD) & Fraud Detection Controls

### Critical Incompatible Roles:
- **Developers** must NEVER have deployment or write access to production environments.
- **Database Administrators (DBAs)** must NOT manage user accounts or modify security policies.
- **Security Administrators** must NOT have operational IT management rights.

### Fraud Detection HR Controls:
- **Mandatory Vacation (Consecutive Days)**: Forces employees away from their duties for at least 1-2 consecutive weeks while another employee performs the role. Highly effective at uncovering ongoing fraud.
- **Job Rotation**: Periodically rotating roles to uncover irregularities.

> 💡 **ISACA / Exam Watch Alert:**
> **Mandatory vacation is a DETECTIVE control** designed to uncover fraud, unauthorized modifications, or embezzlement that requires constant manual intervention to conceal.

---

## 2.6 IT Vendor Management & Software Escrow

- **Right-to-Audit Clause**: Allows customer and its auditors to inspect third-party controls and facilities.
- **SOC 2 Type II Report**: Evaluates control design AND operational effectiveness over minimum 6 months.
- **Software Escrow Agreement**: A neutral third-party holds source code, releasing it to the customer if the vendor goes bankrupt.

> 💡 **ISACA / Exam Watch Alert:**
> When purchasing proprietary software from a small vendor, a **Software Source Code Escrow Agreement** is the MOST effective control to protect against vendor insolvency or bankruptcy.

---

## 2.7 CMMI Maturity Levels (1 to 5)

1. **Initial**: Ad-hoc, chaotic, heroic individual effort.
2. **Managed**: Basic project management; repeatable at project level.
3. **Defined**: Standardized processes documented across the **entire organization**.
4. **Quantitatively Managed**: Statistical control and quantitative measurement.
5. **Optimizing**: Continuous improvement and proactive innovation.

> 💡 **ISACA / Exam Watch Alert:**
> Moving from **CMMI Level 2 to Level 3** means processes are standardized **across the ENTIRE organization**, not just within individual projects."""
    },

    # =========================================================================
    # CHAPTER 3: DOMAIN 3 (12% — Pages 166 to 246)
    # =========================================================================
    {
        "id": "e0000000-0000-0000-0000-000000000003",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "chapter_number": 3,
        "section_number": "Domain 3",
        "title": "Domain 3: IS Acquisition, Development, and Implementation (Official CISA 28th Edition)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024–2026)",
        "page_start": 166,
        "page_end": 246,
        "estimated_read_minutes": 50,
        "sort_order": 3,
        "key_takeaways": "Master Project Sponsor accountability, Critical Path Method (CPM), Total Cost of Ownership (TCO), Agile/DevSecOps security integration, automated application controls (check digits, validation), software testing hierarchy, cutover strategies (Parallel vs Direct), and Post-Implementation Review (PIR) timing.",
        "exam_tips": "Project Sponsor is accountable for business benefits. Tasks on the Critical Path have ZERO slack time. Never use unmasked live production data in testing. Direct cutover requires a tested fallback plan. PIR occurs 3-6 months after go-live, never immediately upon launch.",
        "content_markdown": """# Domain 3: IS Acquisition, Development, and Implementation

**Exam Weight: 12% (~18 Questions)** | **Official Reference: CISA Review Manual 28th Edition, Pages 166–246**

---

## 3.1 Project Governance & Critical Path Method (CPM)

- **Project Sponsor**: Senior business executive accountable for funding and realization of business benefits.
- **Critical Path Method (CPM)**: The longest sequence of dependent activities in a project schedule.
  - Tasks on the critical path have **zero float/slack**. Any delay to a critical path task directly delays the final project completion date.

> 💡 **ISACA / Exam Watch Alert:**
> A delay to any activity on the **Critical Path** will directly delay the project go-live date. Non-critical path activities have float/slack time.

---

## 3.2 Business Case & Total Cost of Ownership (TCO)

A Business Case justifies investment through financial metrics (ROI, NPV, Payback Period) and feasibility studies.
- **Total Cost of Ownership (TCO)** must incorporate initial acquisition, customization, infrastructure, training, ongoing maintenance, and eventual decommissioning costs.

---

## 3.3 SDLC Methodologies: Agile, DevSecOps & Shift-Left

- **Waterfall**: Linear, stage-gated, heavy documentation.
- **Agile**: Iterative, sprint-based (2-4 weeks), highly collaborative.
- **DevSecOps (Shift-Left)**: Integrating automated security checks (SAST, DAST, dependency scanning) early in the CI/CD pipeline rather than waiting for pre-release testing.

> 💡 **ISACA / Exam Watch Alert:**
> In **Agile development**, the IS auditor's primary focus is ensuring that **security and audit logging requirements are included in user stories and Definition of Done (DoD)**, not postponed to future sprints.

---

## 3.4 Automated Application Controls

- **Input Controls**: Range checks, limit checks, format validation, and **check digits** (mathematical algorithm detecting transcription/transposition errors in account numbers).
- **Processing Controls**: Run-to-run control totals, sequence checks, record counts.
- **Output Controls**: Reconciliation reports and authorized report distribution.

> 💡 **ISACA / Exam Watch Alert:**
> **Check digits** are a powerful input validation control designed specifically to detect **transposition (e.g. 78 instead of 87) and transcription errors** in identification numbers.

---

## 3.5 Software Testing Hierarchy & Test Data Security

```
[1. Unit Testing] (Individual modules by developers)
       ▼
[2. Integration Testing] (Interfaces between modules)
       ▼
[3. System Testing] (End-to-end functionality against specs)
       ▼
[4. Regression Testing] (Verifying changes did not break existing features)
       ▼
[5. User Acceptance Testing (UAT)] (Business users validate in staging)
```

> 💡 **ISACA / Exam Watch Alert:**
> **Copying unmasked live production customer data into test environments violates privacy standards!** Test data must always be sanitized, masked, or synthesized.

---

## 3.6 Cutover Strategies & Data Migration

| Strategy | Description | Operational Risk | Cost | Key Characteristic |
| :--- | :--- | :--- | :--- | :--- |
| **Parallel Cutover** | Old and new systems run simultaneously. | **LOWEST** | HIGHEST | Safest strategy; outputs are cross-reconciled. |
| **Direct Cutover (Plunge)** | Old system stops; new system starts immediately. | **HIGHEST** | LOWEST | No safety net; MUST have a tested rollback plan! |
| **Phased Cutover** | Implemented in gradual functional modules. | Moderate | Moderate | Spreads risk over time. |
| **Pilot Cutover** | Deployed first to one branch or department. | Moderate | Moderate | Validates in a live subset. |

> 💡 **ISACA / Exam Watch Alert:**
> When using a **Direct Cutover**, the IS auditor's PRIMARY focus is verifying the existence of a **fully tested fallback/rollback contingency plan**.

---

## 3.7 Post-Implementation Review (PIR)

- **Timing**: Conducted **3 to 6 months after go-live** (after operational stabilization).
- **Objectives**: Validate ROI and business case benefits realization, evaluate live controls, and document lessons learned.

> 💡 **ISACA / Exam Watch Alert:**
> A PIR must be conducted **AFTER a stabilization period (3–6 months)**, never immediately upon cutover, so actual benefits and operational stability can be accurately measured."""
    },

    # =========================================================================
    # CHAPTER 4: DOMAIN 4 (26% — Pages 247 to 342)
    # =========================================================================
    {
        "id": "e0000000-0000-0000-0000-000000000004",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "chapter_number": 4,
        "section_number": "Domain 4",
        "title": "Domain 4: IS Operations and Business Resilience (Official CISA 28th Edition)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024–2026)",
        "page_start": 247,
        "page_end": 342,
        "estimated_read_minutes": 70,
        "sort_order": 4,
        "key_takeaways": "Master ITIL Incident vs Problem management, Shadow IT risks, NTP time synchronization, DBA activity monitoring, BIA resilience metrics (MTD, RTO, RPO, WRT), RAID redundancy vs backup, 3-2-1 backup rule, Life Safety priorities, Hot/Warm/Cold DR sites, and Parallel DRP testing.",
        "exam_tips": "Incident = restore fast. Problem = root cause. NTP ensures log correlation. BIA MUST precede recovery site selection. MTD >= RTO + WRT. RAID is NOT a backup. Life safety is always #1 priority in disaster. Parallel test is most effective without risking live downtime.",
        "content_markdown": """# Domain 4: IS Operations and Business Resilience

**Exam Weight: 26% (~39 Questions)** | **Official Reference: CISA Review Manual 28th Edition, Pages 247–342**

---

## 4.1 IT Operations & Service Management (ITIL)

### Incident Management vs. Problem Management
- **Incident Management**: Primary goal is to **restore normal service operation as quickly as possible** (reactive, short-term focus, uses workarounds).
- **Problem Management**: Primary goal is to **identify root causes** to prevent recurring incidents (proactive, analytical, creates Known Error Database entries).

> 💡 **ISACA / Exam Watch Alert:**
> **Incident Management = RESTORE SERVICE FAST**.
> **Problem Management = FIND AND RESOLVE THE ROOT CAUSE**.

---

## 4.2 Operational Log Management & NTP Synchronization

- **Network Time Protocol (NTP)**: All servers, routers, firewalls, and databases must synchronize clocks to an authenticated central NTP source.
- **Forensic Correlation**: Without synchronized timestamps, cross-system log correlation during incident investigations is legally and technically invalid.

> 💡 **ISACA / Exam Watch Alert:**
> The **PRIMARY reason** for implementing **NTP synchronization** is ensuring **accurate timestamp correlation during incident investigations and log analysis**.

---

## 4.3 Database Administration & DBA Privileges

- DBAs possess unrestricted access to database tables and system configurations.
- **Best Control**: Implement **Database Activity Monitoring (DAM)** with immutable audit logs reviewed daily by an independent security analyst.

---

## 4.4 Business Impact Analysis (BIA) & Resilience Metrics

The BIA identifies critical business functions and establishes recovery thresholds:

$$\\text{Maximum Tolerable Downtime (MTD)} \\ge \\text{Recovery Time Objective (RTO)} + \\text{Work Recovery Time (WRT)}$$

| Metric | Focus | Exam Key |
| :--- | :--- | :--- |
| **Maximum Tolerable Downtime (MTD)** | **Business Survival** | Maximum time a process can be down before the organization suffers irrecoverable harm. |
| **Recovery Time Objective (RTO)** | **Technical Recovery** | Target duration to restore systems, servers, and applications. |
| **Recovery Point Objective (RPO)** | **Data Loss Tolerance** | Maximum acceptable data loss measured in time (dictates backup frequency). |
| **Work Recovery Time (WRT)** | **Operational Recovery** | Time required to verify data, process backlogs, and return to normal operations. |

> 💡 **ISACA / Exam Watch Alert:**
> The **BIA MUST be completed FIRST** before developing Disaster Recovery Plans or selecting recovery sites. You cannot choose recovery technology until the business defines its RTO and RPO.

---

## 4.5 System Redundancy & RAID Arrays

- **RAID 0**: Striping only (NO redundancy; failure of 1 drive loses all data).
- **RAID 1**: Mirroring (100% redundancy; 50% storage overhead).
- **RAID 5**: Striping with single parity (can survive 1 disk failure; min. 3 disks).
- **RAID 6**: Dual parity (can survive **2 simultaneous disk failures**; min. 4 disks).
- **RAID 10**: Striped mirrors (high speed and high redundancy).

> 💡 **ISACA / Exam Watch Alert:**
> **RAID is NOT a backup!** RAID protects against physical drive hardware failures, but does NOT protect against ransomware, accidental file deletion, or corrupted writes.

---

## 4.6 Backup Strategies & The 3-2-1 Rule

| Backup Type | What is Backed Up | Backup Speed | Restore Speed | Archive Bit |
| :--- | :--- | :--- | :--- | :--- |
| **Full Backup** | All data. | Slowest | Fastest (1 set) | Cleared |
| **Differential** | All changes **since LAST FULL backup**. | Moderate | Fast (Full + Latest Diff) | **NOT cleared** |
| **Incremental** | All changes **since LAST BACKUP (any type)**. | Fastest | Slowest (Full + All Incs) | Cleared |

- **3-2-1 Rule**: 3 copies of data, on 2 different media types, with 1 copy stored off-site.

> 💡 **ISACA / Exam Watch Alert:**
> Backups are useless without **periodic restoration testing**. The IS auditor must verify that backup media are periodically test-restored to confirm data integrity.

---

## 4.7 Disaster Recovery Sites & DRP Testing

### Alternative Recovery Sites:
- **Hot Site**: Fully equipped data center with real-time continuous data replication. RTO = **Minutes to Hours**. Highest cost.
- **Warm Site**: Hardware present but requires loading software and restoring backups. RTO = **Hours to Days**.
- **Cold Site**: Space, power, and cooling only (no computing hardware). RTO = **Weeks**. Lowest cost.

### DRP Testing Methodologies:
1. **Desk Check / Checklist**: Document review.
2. **Structured Walkthrough (Tabletop)**: Team discusses scenario in a room.
3. **Simulation Test**: Operational staff execute simulated response.
4. **Parallel Test**: Secondary systems brought online and transactions processed in parallel with production (no production downtime).
5. **Full Interruption Test**: Live production is shut down and failed over to DR site (HIGHEST RISK).

> 💡 **ISACA / Exam Watch Alert:**
> In any disaster, the **NUMBER ONE PRIORITY is always LIFE SAFETY (personnel safety and evacuation)**.
> A **Parallel Test** is the MOST effective testing method that validates operations **WITHOUT risking production downtime**."""
    },

    # =========================================================================
    # CHAPTER 5: DOMAIN 5 (26% — Pages 343 to 547)
    # =========================================================================
    {
        "id": "e0000000-0000-0000-0000-000000000005",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "chapter_number": 5,
        "section_number": "Domain 5",
        "title": "Domain 5: Protection of Information Assets (Official CISA 28th Edition)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024–2026)",
        "page_start": 343,
        "page_end": 547,
        "estimated_read_minutes": 80,
        "sort_order": 5,
        "key_takeaways": "Master Zero Trust Architecture (ZTA), IAM/PAM vaulting, Biometric Crossover Error Rate (CER), Mantraps and Clean Agent fire suppression, Symmetric vs Asymmetric Cryptography, Digital Signatures, PKI root key protection, Cloud Shared Responsibility Model, SQL Injection prevention, SIEM/SOAR playbooks, NIST Incident Response containment, and Digital Forensics Order of Volatility (RFC 3227).",
        "exam_tips": "Lower CER = more accurate biometrics. Mantrap prevents tailgating. Digital signature = hash encrypted with sender's private key. In cloud, customer is ALWAYS responsible for data and IAM. Parameterized queries prevent SQLi. Containment is #1 priority in active breach. Forensics order of volatility: CPU registers -> RAM -> Disk. Never analyze original media.",
        "content_markdown": """# Domain 5: Protection of Information Assets

**Exam Weight: 26% (~39 Questions)** | **Official Reference: CISA Review Manual 28th Edition, Pages 343–547**

---

## 5.1 Security Governance, NIST CSF 2.0 & ISO 27001

- **NIST CSF 2.0 Functions**: Govern, Identify, Protect, Detect, Respond, Recover.
- **ISO/IEC 27001**: Formal international standard for establishing and certifying an **Information Security Management System (ISMS)**.

---

## 5.2 Physical Security, Mantraps & Fire Suppression

- **Mantrap (Airlock)**: Interlocking doors where one door must fully close before the next opens. **Prevents Tailgating / Piggybacking**.
- **Clean Agent Fire Suppression (FM-200, Novec 1230)**: Extinguishes fire without leaving residue or damaging electronic hardware; safe for personnel.
- **Pre-Action Dry-Pipe Sprinklers**: Requires heat AND smoke detector triggers before water enters pipes, preventing accidental server water damage.

> 💡 **ISACA / Exam Watch Alert:**
> The primary purpose of a **Mantrap** is to **prevent Tailgating / Piggybacking** into secure facilities.

---

## 5.3 Zero Trust Architecture (ZTA), IAM & Biometrics

- **Zero Trust Principles**: *"Never Trust, Always Verify"*. Microsegmentation and continuous session validation.
- **Multi-Factor Authentication (MFA)**: Combines something you know, something you have, and something you are.
- **Biometric Accuracy & Crossover Error Rate (CER)**:
  - *False Rejection Rate (FRR / Type I)*: Rejects legitimate user.
  - *False Acceptance Rate (FAR / Type II)*: Accepts impostor (**Security Risk**).
  - *CER (EER)*: Point where FAR equals FRR. **LOWER CER = MORE ACCURATE DEVICE**.

> 💡 **ISACA / Exam Watch Alert:**
> The **Crossover Error Rate (CER)** is the gold standard for biometric accuracy. A **LOWER CER** indicates a superior, more accurate biometric system.

---

## 5.4 Network Perimeter Defenses: NGFW, IDS/IPS & DMZ

- **IDS (Detective)**: Passive sensor that alerts on anomalies.
- **IPS (Preventive)**: In-line appliance that automatically drops malicious packets.
- **DMZ (Demilitarized Zone)**: Buffer network hosting public-facing servers.

> 💡 **ISACA / Exam Watch Alert:**
> Public-facing servers in the DMZ must **NEVER initiate direct database connections to internal database servers**. Transactions must be brokered by application servers.

---

## 5.5 Cryptography, PKI & Digital Signatures

| Dimension | Symmetric Encryption | Asymmetric (Public Key) |
| :--- | :--- | :--- |
| **Keys** | **1 shared secret key** | **2 paired keys** (Public & Private) |
| **Speed** | Extremely Fast (bulk data) | Slower (key exchange) |
| **Algorithms** | AES-256, ChaCha20 | RSA, ECC |

### Digital Signature Process:
1. Sender hashes message.
2. Sender **encrypts hash with their PRIVATE key** (Digital Signature).
3. Receiver **decrypts signature with sender's PUBLIC key** and matches hashes.
4. **Provides**: Authentication, Data Integrity, and **Non-Repudiation**.

> 💡 **ISACA / Exam Watch Alert:**
> A **Digital Signature** is created by encrypting a message hash with the **sender's PRIVATE key**. It guarantees integrity and non-repudiation.

---

## 5.6 Cloud Shared Responsibility Model

- **IaaS**: Customer manages OS, middleware, runtime, applications, data, and IAM. CSP manages hardware and virtualization.
- **PaaS**: Customer manages applications, data, and IAM. CSP manages OS and runtime.
- **SaaS**: Customer manages data and IAM. CSP manages application stack.

> 💡 **ISACA / Exam Watch Alert:**
> In **ALL cloud models (IaaS, PaaS, SaaS)**, the **CUSTOMER is ALWAYS responsible for DATA classification and ACCESS MANAGEMENT (IAM)**.

---

## 5.7 Common Attacks & OWASP Top 10 Defenses

- **SQL Injection (SQLi)**: Malicious SQL injected into inputs.
  - *Best Defense*: **Parameterized Queries (Prepared Statements)**.
- **Cross-Site Scripting (XSS)**: Malicious script executed in victim browser.
  - *Best Defense*: **Context-aware output encoding** and CSP.

> 💡 **ISACA / Exam Watch Alert:**
> The **PRIMARY defense against SQL Injection** is using **Parameterized Queries (Prepared Statements)** with strict server-side validation.

---

## 5.8 Incident Response & Containment

- **NIST SP 800-61 Steps**: Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity.
- Once a breach is confirmed, the **FIRST operational priority is CONTAINMENT** (isolating infected hosts).

> 💡 **ISACA / Exam Watch Alert:**
> Once an active security breach is confirmed, the **FIRST operational priority is CONTAINMENT** (isolating affected systems to stop lateral spread and data exfiltration).

---

## 5.9 Digital Forensics & Order of Volatility (RFC 3227)

```
MOST VOLATILE (Captures First)
 ▲  [1. CPU Registers and Cache]
 │  [2. Routing Tables, ARP Cache, Process Memory, Kernel State]
 │  [3. Main RAM (Random Access Memory)]
 │  [4. Temporary File Systems / Swap Space]
 │  [5. Hard Disks, SSDs, Storage Media]
 │  [6. Remote Log Data & Network Configurations]
 ▼  [7. Archival Tapes & Physical Printouts]
LEAST VOLATILE (Captures Last)
```

- **Forensic Rules**:
  - NEVER analyze or boot original media.
  - Capture bit-stream images using **hardware write-blockers**.
  - Maintain an unbroken **Chain of Custody**.

> 💡 **ISACA / Exam Watch Alert:**
> A forensic investigator must **NEVER analyze or boot the original suspect media**! Analysis must ALWAYS be performed on a verified **bit-stream copy (forensic image)** captured with a **hardware write-blocker**."""
    }
]

with open(os.path.join(DATA_DIR, "study_materials.json"), "w", encoding="utf-8") as f:
    json.dump(MASTER_CHAPTERS, f, indent=2)

print(f"Saved {len(MASTER_CHAPTERS)} comprehensive Master Chapters with rich markdown and Exam Watch Alerts.")
