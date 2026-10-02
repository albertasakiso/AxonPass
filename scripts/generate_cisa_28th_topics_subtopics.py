import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

TOPICS_DEFINITIONS = [
    # =========================================================================
    # DOMAIN 1: Information System Auditing Process (18% — 10 Topics)
    # =========================================================================
    {
        "topic_code": "1A1",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
        "part": "A",
        "sort_order": 1,
        "content_summary": "ISACA ITAF standards hierarchy (mandatory standards, guidelines, tools), audit charter governance, organizational independence, and the ISACA Code of Professional Ethics.",
        "subtopic": {
            "title": "ITAF Standards Hierarchy, Audit Charter & Professional Ethics",
            "estimated_minutes": 25,
            "key_concepts": ["ITAF Standards (Mandatory)", "ITAF Guidelines (Advisory)", "Audit Charter", "Independence & Objectivity", "ISACA Code of Ethics"],
            "learning_objectives": "Distinguish between mandatory ITAF standards and advisory guidelines, evaluate the governance elements of an audit charter, and apply ethical requirements to resolve independence impairments.",
            "content_markdown": """# IS Audit Standards, Guidelines, Functions & Professional Ethics

## 1. The ISACA Information Technology Assurance Framework (ITAF)

ITAF provides foundational guidance for IT audit and assurance professionals. ITAF establishes a structured hierarchy of guidance:

| Guidance Level | Authority | Description |
| :--- | :--- | :--- |
| **ITAF Standards (1000, 1200, 1400 Series)** | **MANDATORY** | Must be followed by all CISA holders and ISACA audit engagements. Failure to comply can result in disciplinary action. |
| **ITAF Guidelines (2000, 2200, 2400 Series)** | **ADVISORY** | Provide recommended approaches, explanations, and methodologies for implementing the mandatory standards. |
| **ITAF Tools and Techniques (3000 Series)** | **PRACTICAL EXAMPLES** | White papers, audit programs, checklists, and templates illustrating practical application. |

### ITAF Standards Breakdown:
- **General Standards (1000 series)**: Address the audit charter, organizational independence, professional ethics, due professional care, and competence.
- **Performance Standards (1200 series)**: Address engagement planning, risk assessment, supervision, evidence collection, and professional judgment.
- **Reporting Standards (1400 series)**: Address report format, communication of findings, distribution restrictions, and follow-up activities.

> 💡 **ISACA / Exam Watch Alert:**
> On the CISA exam, remember: **Standards are MANDATORY**; **Guidelines are ADVISORY/RECOMMENDED**. If a scenario asks what an IS auditor *MUST* comply with, the answer is ISACA Standards and the Code of Professional Ethics.

---

## 2. The Internal Audit Charter

The **Audit Charter** is the formal document that establishes the internal audit function's purpose, authority, responsibility, and standing within the organization.

### Key Governance Requirements for the Audit Charter:
1. **Approval Authority**: The audit charter **MUST be approved by the Audit Committee or the Board of Directors**. Approval by executive management (e.g., CFO, CIO, CEO alone) is an impairment to organizational independence.
2. **Right to Access**: The charter must grant the IS audit function **unrestricted access** to all organizational records, personnel, physical premises, systems, and data necessary to execute engagements.
3. **Scope and Objectives**: Clearly defines the boundaries and mission of internal audit activities.
4. **Dual-Reporting Structure**:
   - **Functional Reporting**: Reports directly to the **Audit Committee / Board of Directors** (for audit plan approval, charter review, and findings presentation).
   - **Administrative Reporting**: Reports to executive management (e.g., CEO) for day-to-day operational administration (e.g., budget, office logistics).

> 💡 **ISACA / Exam Watch Alert:**
> When an exam question mentions that an auditor is denied access to critical records or systems by a department manager, the **FIRST** step the auditor should take is to **review the Audit Charter** and escalate the matter to the **Audit Committee/Board**, not confront executive leadership or abandon testing.

---

## 3. Independence and Objectivity

- **Independence**: Freedom from conditions that threaten the ability of the audit activity to perform responsibilities in an unbiased manner (organizational standing).
- **Objectivity**: An unbiased mental attitude that allows auditors to perform engagements without compromising quality or judgment.

### Managing Independence Impairments:
- **Cooling-Off Period**: An IS auditor who previously designed, implemented, or operated a system must **NOT audit that system for at least one year** (12-month cooling-off period).
- **Recusal**: If an auditor has a personal relationship, financial interest, or prior operational involvement, the auditor must disclose the conflict and be **recused** from the audit team.
- **Consulting vs. Assurance**: If internal audit provides advisory or consulting services on system design, they must disclose that independence is impaired for future assurance audits of that system.

> 💡 **ISACA / Exam Watch Alert:**
> An IS auditor should **NEVER design or implement controls** for the organization they audit. Doing so completely destroys auditor independence. If management asks the auditor to design a control, the auditor should provide recommendations or best-practice frameworks, but management MUST make the design and implementation decision."""
        }
    },
    {
        "topic_code": "1A2",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Types of Audits, Assessments, and Reviews",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Internal vs external audits, compliance audits, financial/operational/integrated audits, third-party SOC 1/2/3 assurance reports, and specialized security reviews.",
        "subtopic": {
            "title": "Audit Classifications, Integrated Audits & Third-Party SOC Assurance",
            "estimated_minutes": 20,
            "key_concepts": ["Internal vs External Audits", "Integrated Auditing", "Compliance & Forensic Audits", "SOC 1 / SOC 2 / SOC 3 Reports", "Type I vs Type II"],
            "learning_objectives": "Compare various types of audits and reviews, analyze the role of integrated audits, and evaluate Service Organization Control (SOC) reports for third-party assurance.",
            "content_markdown": """# Types of Audits, Assessments, and Reviews

## 1. Audit Classifications

Organizations perform diverse types of audit engagements depending on regulatory mandates, operational risks, and governance objectives:

| Audit Type | Objective | Key Characteristics |
| :--- | :--- | :--- |
| **Financial Audit** | Assess the fairness and integrity of financial statements. | Focuses on financial internal controls (ICFR), balance sheet accuracy, and general ledger transactions. |
| **Operational Audit** | Evaluate the efficiency, effectiveness, and economy of operational processes. | Focuses on workflow productivity, resource utilization, and management control systems. |
| **Integrated Audit** | Combine IS audit procedures with financial/operational audits. | IS and financial auditors work together to test IT General Controls (ITGCs) and automated application controls simultaneously. |
| **Compliance Audit** | Verify adherence to laws, regulations, and contractual requirements. | Assesses conformity to frameworks such as GDPR, HIPAA, PCI-DSS, SOX, and ISO 27001. |
| **Forensic Audit** | Investigate suspected fraud, embezzlement, or digital crimes. | Involves strict evidence preservation, chain of custody, and preparation for legal proceedings. |

> 💡 **ISACA / Exam Watch Alert:**
> In an **Integrated Audit**, the primary advantage is that IT general controls (ITGCs) and automated business process controls are evaluated in conjunction with manual controls, providing a holistic view of business risk and eliminating redundant testing.

---

## 2. Third-Party Assurance: SOC Reports (SSAE 18 / ISAE 3402)

When an enterprise outsources critical IT or business services to a cloud or managed service provider (MSP), the IS auditor evaluates **Service Organization Control (SOC)** reports:

### SOC 1 vs. SOC 2 vs. SOC 3:
- **SOC 1 (ICFR)**: Evaluates controls relevant to the user organization's **Internal Control over Financial Reporting**.
- **SOC 2 (Trust Services Criteria)**: Evaluates controls relevant to **Security, Availability, Processing Integrity, Confidentiality, and Privacy**.
- **SOC 3 (Public Summary)**: A high-level, general-use summary of the SOC 2 report without technical test details.

### Type I vs. Type II Reports:
- **Type I Report**: Report on the **suitability of the design** of controls as of a **specified point in time** (e.g., as of June 30).
- **Type II Report**: Report on the **suitability of design AND the operating effectiveness** of controls over a **specified minimum period** (typically 6 to 12 months).

> 💡 **ISACA / Exam Watch Alert:**
> A **Type I report is INSUFFICIENT** to rely upon for ongoing operational assurance because it only tests control design at a single instant in time without testing whether controls actually operated effectively over time. An IS auditor seeking assurance on a cloud vendor's operational controls **MUST require a SOC 2 Type II report**."""
        }
    },
    {
        "topic_code": "1A3",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Risk-Based Audit Planning",
        "part": "A",
        "sort_order": 3,
        "content_summary": "Risk assessment methodologies, audit universe definition, audit risk formula (inherent risk, control risk, detection risk), and resource allocation.",
        "subtopic": {
            "title": "Risk-Based Audit Planning & The Audit Risk Model",
            "estimated_minutes": 25,
            "key_concepts": ["Audit Universe", "Inherent Risk", "Control Risk", "Detection Risk", "Audit Risk Formula"],
            "learning_objectives": "Construct a risk-based annual audit plan, calculate audit risk components, and allocate audit resources based on risk rankings.",
            "content_markdown": """# Risk-Based Audit Planning

## 1. The Risk-Based Audit Approach

A **Risk-Based Audit Approach** ensures that audit resources are deployed to areas of greatest risk to the enterprise. Rather than reviewing all systems equally or rotating through a calendar, the IS auditor evaluates business objectives, threat landscapes, and internal control environments to prioritize high-risk processes.

### Steps in Risk-Based Audit Planning:
1. **Define the Audit Universe**: Identify all auditable entities, business units, systems, and applications across the enterprise.
2. **Conduct Risk Assessment**: Evaluate inherent risks, business impact, regulatory exposure, and past audit findings for each entity.
3. **Rank and Prioritize**: Categorize auditable entities into High, Medium, and Low risk tiers.
4. **Develop Annual Audit Plan**: Allocate audit hours and subject-matter specialists to high-risk areas first.
5. **Obtain Audit Committee Approval**: Submit the annual audit plan and resource budget to the Audit Committee for review and formal approval.

> 💡 **ISACA / Exam Watch Alert:**
> In risk-based audit planning, the **FIRST** step an IS auditor must take is to **understand the organization's business strategy and objectives**, followed by identifying the systems and assets supporting those objectives.

---

## 2. The Audit Risk Model

**Audit Risk (AR)** is the risk that the auditor will issue an unqualified (clean) opinion or fail to detect material errors, control deficiencies, or fraud.

$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

| Risk Component | Definition | Controlled By |
| :--- | :--- | :--- |
| **Inherent Risk (IR)** | The susceptibility of a business process or IT asset to material error or security breach, assuming there are no internal controls. | Environment / Business Nature (Auditee) |
| **Control Risk (CR)** | The risk that internal controls implemented by management will fail to prevent or detect errors on a timely basis. | Management Control Design & Operation |
| **Detection Risk (DR)** | The risk that the auditor's substantive testing procedures will fail to detect a material error or weakness. | **The IS Auditor** (via sample size & test depth) |

### Key Exam Insights on Detection Risk:
- When Inherent Risk (IR) and Control Risk (CR) are **HIGH**, the auditor must set Detection Risk (DR) to **LOW**.
- To achieve a **LOW Detection Risk**, the auditor must **increase sample sizes**, perform more extensive substantive testing, and apply advanced Computer-Assisted Audit Techniques (CAATs).

> 💡 **ISACA / Exam Watch Alert:**
> Detection risk is the **ONLY component of audit risk that the IS auditor directly controls**! Inherent risk and control risk exist independently of the audit. If control risk is assessed as high, the auditor MUST lower detection risk by performing more substantive testing."""
        }
    },
    {
        "topic_code": "1A4",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Types of Controls and Considerations",
        "part": "A",
        "sort_order": 4,
        "content_summary": "Preventive, detective, and corrective controls; administrative, physical, and technical controls; automated vs manual controls; and compensating controls.",
        "subtopic": {
            "title": "Control Classifications, Automated Controls & Compensating Controls",
            "estimated_minutes": 20,
            "key_concepts": ["Preventive Controls", "Detective Controls", "Corrective Controls", "Compensating Controls", "Automated vs Manual"],
            "learning_objectives": "Classify internal controls by timing and implementation mechanism, design effective compensating controls, and evaluate automated application controls.",
            "content_markdown": """# Types of Controls and Considerations

## 1. Control Classifications by Timing

Internal controls are policies, procedures, practices, and organizational structures designed to provide reasonable assurance that business objectives will be achieved and risk will be prevented or mitigated:

| Classification | Primary Purpose | Examples |
| :--- | :--- | :--- |
| **Preventive Controls** | Stop errors, unauthorized transactions, or security breaches **BEFORE** they occur. (Most cost-effective). | Segregation of Duties (SoD), biometric access locks, input validation checks, dual authorization, firewalls. |
| **Detective Controls** | Identify errors, anomalies, or security incidents **AFTER** they occur. | Audit log reviews, hash integrity checks, reconciliation reports, IDS sensors, physical inventory counts. |
| **Corrective Controls** | Mitigate the impact, restore systems, and remediate errors **AFTER** detection. | Disaster recovery backups, automated failover scripts, incident response playbooks, data patch utilities. |

> 💡 **ISACA / Exam Watch Alert:**
> **Preventive controls are ALWAYS preferred over detective or corrective controls** because preventing an error or intrusion avoids financial loss and operational disruption. However, a sound internal control system incorporates defense-in-depth across all three layers.

---

## 2. Compensating Controls

When a primary control cannot be implemented due to technical limitations, operational constraints, or cost-prohibitive factors (e.g., a small IT shop where one administrator performs development and operations), management must implement **Compensating Controls**.

### Requirements for a Valid Compensating Control:
1. It must accomplish the **same objective** as the missing primary control.
2. It must provide **equivalent security/assurance**.
3. It must be **independently reviewed and monitored** on an ongoing basis.

### Classic SoD Compensating Control Example:
- *Conflict*: Database Administrator (DBA) also has user access management rights.
- *Compensating Control*: Implement automated Database Activity Monitoring (DAM) with audit logs stored on an immutable server and reviewed daily by an independent security analyst.

> 💡 **ISACA / Exam Watch Alert:**
> When asked for the BEST compensating control for a segregation of duties conflict, look for **independent supervisory review of activity logs** or **automated independent transaction reconciliations**."""
        }
    },
    {
        "topic_code": "1B1",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Audit Project Management",
        "part": "B",
        "sort_order": 5,
        "content_summary": "Audit engagement planning, scoping, resource scheduling, workpaper documentation, and audit supervision.",
        "subtopic": {
            "title": "Audit Engagement Planning, Scoping & Workpaper Documentation",
            "estimated_minutes": 20,
            "key_concepts": ["Audit Charter", "Engagement Letter", "Audit Scope", "Workpapers", "Supervisory Review"],
            "learning_objectives": "Formulate audit engagement objectives, define scope boundaries, manage audit project timelines, and maintain audit workpapers compliant with ITAF.",
            "content_markdown": """# Audit Project Management

## 1. Audit Engagement Life Cycle

Each audit engagement is executed as a project with defined initiation, planning, fieldwork, reporting, and follow-up phases:

```
[Phase 1: Planning & Scoping] ➔ [Phase 2: Fieldwork & Testing] ➔ [Phase 3: Reporting & Exit] ➔ [Phase 4: Follow-up]
 - Preliminary Survey           - Compliance Testing           - Draft Report                 - Remediation Tracking
 - Define Scope & Objectives    - Substantive Testing          - Exit Conference              - Re-testing
 - Audit Program Formulation    - Evidence Collection          - Final Report to Board
```

### Steps in Engagement Planning:
1. **Perform Preliminary Survey**: Review prior audit reports, risk registers, and system architecture diagrams.
2. **Define Scope and Boundaries**: Determine which locations, systems, time periods, and processes are included and explicitly excluded.
3. **Formulate the Audit Program**: Document detailed testing steps, sampling methods, and evidence requirements.
4. **Allocate Resources**: Assign auditors with requisite technical proficiency and establish project milestone deadlines.

> 💡 **ISACA / Exam Watch Alert:**
> The **Audit Program** must be approved by the **Audit Manager / Lead Auditor** prior to the commencement of fieldwork testing. Any significant mid-engagement scope changes must also be formally documented and approved.

---

## 2. Audit Workpapers & Documentation

**Audit Workpapers** are the official records of the audit procedures performed, evidence obtained, and conclusions reached:
- **Custody & Ownership**: Audit workpapers are the property of the **audit organization**, not the auditee or individual auditor.
- **Sufficiency**: Workpapers must be sufficiently complete and detailed to enable an **independent auditor with no prior connection to the engagement** to re-perform the work and arrive at the same conclusion.
- **Supervisory Review**: All workpapers must be reviewed and signed off by the audit supervisor before the final report is issued."""
        }
    },
    {
        "topic_code": "1B2",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Audit Testing and Sampling Methodology",
        "part": "B",
        "sort_order": 6,
        "content_summary": "Compliance testing vs substantive testing, statistical vs non-statistical sampling, attribute sampling, variable sampling, and sampling risk.",
        "subtopic": {
            "title": "Compliance vs Substantive Testing & Statistical Sampling",
            "estimated_minutes": 25,
            "key_concepts": ["Compliance Testing", "Substantive Testing", "Attribute Sampling", "Variable Sampling", "Sampling Risk (Alpha & Beta)"],
            "learning_objectives": "Distinguish compliance testing from substantive testing, select appropriate statistical sampling techniques, and control sampling risk.",
            "content_markdown": """# Audit Testing and Sampling Methodology

## 1. Compliance Testing vs. Substantive Testing

| Attribute | Compliance Testing (Test of Controls) | Substantive Testing (Test of Details) |
| :--- | :--- | :--- |
| **Objective** | Determine whether internal controls are **operating effectively** as designed. | Verify the **accuracy, completeness, and validity** of data, transactions, and balances. |
| **Question Asked** | *"Did the control operate properly?"* | *"Is the data or dollar balance correct?"* |
| **Typical Techniques** | Inspecting authorization signatures, testing user access matrices, reviewing log review logs. | Account balance recalculation, bank reconciliations, inventory physical counts, 100% data analytics matching. |
| **Sampling Method** | **Attribute Sampling** (rate of occurrence / error rate). | **Variable Sampling** (dollar value / weight / numeric quantity). |

> 💡 **ISACA / Exam Watch Alert:**
> If **Compliance Testing** reveals that internal controls are **INEFFECTIVE**, the IS auditor must NOT immediately fail the audit; instead, the auditor must **EXPAND Substantive Testing** to determine if actual financial loss, data corruption, or unauthorized transactions occurred.

---

## 2. Statistical vs. Non-Statistical Sampling

- **Statistical Sampling**: Every item in the population has a known, non-zero chance of selection. Allows mathematical calculation of sampling risk, confidence levels, and precision.
- **Non-Statistical (Judgmental) Sampling**: Selection is based on the auditor's subjective judgment and experience. Cannot mathematically quantify sampling risk.

### Statistical Sampling Types:
1. **Attribute Sampling**: Used for compliance testing to estimate the rate of control deviation in a population (e.g., percentage of purchase orders lacking manager approval).
   - *Stop-or-Go Sampling*: Used when very few errors are expected to minimize sample size.
   - *Discovery Sampling*: Used when looking for fraud or critical violations where even a single deviation requires immediate investigation.
2. **Variable Sampling**: Used for substantive testing to estimate numerical or monetary quantities (e.g., total value of inventory misstatement).
   - *Stratified Mean-per-Unit*: Divides population into sub-groups (strata) to reduce variance.
   - *Monetary Unit Sampling (MUS)*: Weights sample selection by dollar value (larger transactions have higher probability of selection).

### Sampling Risk Types:
- **Type I Error (Alpha Risk / Risk of Incorrect Rejection)**: Control is effective, but sample suggests it is ineffective. Leads to **audit inefficiency** (excess testing).
- **Type II Error (Beta Risk / Risk of Incorrect Acceptance)**: Control is ineffective, but sample suggests it is effective. Leads to **audit ineffectiveness** (loss of audit quality / failure to detect risk).

> 💡 **ISACA / Exam Watch Alert:**
> **Beta Risk (Risk of Incorrect Acceptance)** is the GREATEST concern to the IS auditor because it results in issuing a clean audit opinion on a flawed control system, exposing the organization to undetected material risk."""
        }
    },
    {
        "topic_code": "1B3",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Audit Evidence Collection Techniques",
        "part": "B",
        "sort_order": 7,
        "content_summary": "Evidence reliability hierarchy, inquiry, observation, inspection, re-performance, and confirmation.",
        "subtopic": {
            "title": "Evidence Reliability Hierarchy & Audit Verification Techniques",
            "estimated_minutes": 20,
            "key_concepts": ["Audit Evidence", "Evidence Reliability Hierarchy", "Inquiry & Interviewing", "Observation", "Re-performance & Confirmation"],
            "learning_objectives": "Evaluate the competence and sufficiency of audit evidence and apply the evidence reliability hierarchy during fieldwork.",
            "content_markdown": """# Audit Evidence Collection Techniques

## 1. The Evidence Reliability Hierarchy

Audit evidence comprises all information used by the IS auditor in arriving at conclusions upon which the audit opinion is based. Evidence must be **sufficient** (quantity) and **appropriate** (quality, relevance, reliability):

```
HIGHEST RELIABILITY
 ▲  [1. Direct Auditor Re-performance / Physical Inspection]
 │  [2. Objective External Third-Party Confirmation (e.g., bank/custodian)]
 │  [3. Auditor Direct Observation (real-time point in time)]
 │  [4. Internal Documentation generated under strong controls]
 │  [5. Internal Documentation generated under weak controls]
 ▼  [6. Oral Inquiries / Management Assertions]
LOWEST RELIABILITY
```

### Key Evidence Principles:
- **Direct Re-performance**: Auditor recalculates an algorithm or reproduces a script independently.
- **External Confirmation**: Direct written response to the auditor from a third party (e.g., bank balance confirmation, cloud provider certificate).
- **Observation Limitation**: Observation is only valid for the **exact moment** the auditor is watching; personnel may alter their behavior while under observation (*Hawthorne effect*).
- **Inquiry**: Inquiry alone is **INSUFFICIENT** to support an audit finding. Inquiries must always be corroborated with documentary evidence or system verification.

> 💡 **ISACA / Exam Watch Alert:**
> An oral assertion or statement from management is the **LEAST reliable** form of audit evidence. When an auditor receives an oral explanation, the auditor's **NEXT step is to obtain supporting documentary evidence** or test system logs directly."""
        }
    },
    {
        "topic_code": "1B4",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Audit Data Analytics (including audit algorithms)",
        "part": "B",
        "sort_order": 8,
        "content_summary": "Computer-Assisted Audit Techniques (CAATs), Generalized Audit Software (GAS), Continuous Auditing, Embedded Audit Modules (EAM), and data analytics algorithms.",
        "subtopic": {
            "title": "CAATs, Generalized Audit Software & Continuous Auditing",
            "estimated_minutes": 25,
            "key_concepts": ["CAATs", "Generalized Audit Software (GAS)", "Continuous Auditing", "Embedded Audit Module (EAM)", "Snapshot & Integrated Test Facility (ITF)"],
            "learning_objectives": "Deploy CAATs and Generalized Audit Software for 100% population analysis, evaluate Continuous Auditing architectures, and compare automated audit techniques.",
            "content_markdown": """# Audit Data Analytics & Computer-Assisted Audit Techniques (CAATs)

## 1. CAATs & Generalized Audit Software (GAS)

**Computer-Assisted Audit Techniques (CAATs)** enable the IS auditor to analyze large volumes of data directly from production databases and application logs:
- **Generalized Audit Software (GAS)**: Commercial tools (e.g., ACL, IDEA, Python/SQL analytics) that allow auditors to perform independent calculations, statistical sampling, duplicate detection, and gap analysis across 100% of transaction populations.
- **100% Population Testing**: CAATs eliminate sampling risk by examining every record in a multi-million row transaction ledger.

---

## 2. Continuous Auditing & Continuous Monitoring

- **Continuous Auditing (CA)**: Performed by **internal audit** to continuously evaluate systems and transactions for control breakdowns in real time or near-real time.
- **Continuous Monitoring (CM)**: Performed by **operational management** to oversee operational compliance and system performance.

### Advanced Automated Audit Techniques:

| Technique | Description | Exam Key |
| :--- | :--- | :--- |
| **Embedded Audit Module (EAM)** | Specialized audit code built directly into application logic to capture transactions matching specific risk criteria in real time. | Requires developer collaboration; must be tested so it does not degrade system performance. |
| **Integrated Test Facility (ITF)** | Creates dummy entity/test accounts in live production to test transactions alongside real data. | **GREATEST RISK**: Test transactions must be tagged and reversed to prevent corrupting live financial accounts! |
| **Snapshot Technique** | Takes a digital picture of a transaction's data state at predetermined processing points in the program flow. | Used for tracing logic paths and data modifications. |
| **Audit Hook** | Exit routine that flags unusual transactions to an audit log before processing completes. | Allows real-time intervention before transaction completion. |

> 💡 **ISACA / Exam Watch Alert:**
> When using an **Integrated Test Facility (ITF)** in a live production environment, the IS auditor's GREATEST concern is ensuring that test transactions are properly segregated and purged/reversed so that they **do not corrupt live production databases or financial records**."""
        }
    },
    {
        "topic_code": "1B5",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Reporting and Communication Techniques",
        "part": "B",
        "sort_order": 9,
        "content_summary": "Exit conference protocols, findings formulation (Condition, Criteria, Cause, Consequence, Corrective Action), executive summaries, and remediation tracking.",
        "subtopic": {
            "title": "Audit Findings Formulation (5Cs), Exit Conferences & Reporting",
            "estimated_minutes": 20,
            "key_concepts": ["Exit Conference", "5 Cs of Audit Findings", "Condition, Criteria, Cause, Consequence, Corrective Action", "Executive Summary", "Follow-up"],
            "learning_objectives": "Structure audit findings using the 5 Cs framework, conduct constructive exit conferences, and draft executive audit reports.",
            "content_markdown": """# Reporting and Communication Techniques

## 1. The Exit Conference (Closing Meeting)

Before issuing the formal written audit report, the IS auditor conducts an **Exit Conference** with auditee management:
- **Purpose**: Present preliminary findings, confirm factual accuracy, discuss root causes, and resolve any misunderstandings.
- **Management Responses**: Auditee management is given the opportunity to provide written responses, remediation plans, target completion dates, and assigned owners.
- **Disagreements**: If management disagrees with a finding, the auditor notes management's disagreement in the workpapers/report, but the auditor retains sole responsibility for audit conclusions.

> 💡 **ISACA / Exam Watch Alert:**
> If an auditee management team immediately corrects a minor deficiency during the audit fieldwork, the auditor **MUST still document the condition in the audit workpapers** and note in the report that management resolved the issue prior to engagement completion.

---

## 2. The 5 Cs of a High-Impact Audit Finding

Every finding in an IS audit report should follow the standard **5 Cs structure**:

1. **Criteria**: What *should* be (The benchmark, policy, standard, or regulation — e.g., *"IT Policy requires quarterly user access reviews"*).
2. **Condition**: What *is* (The factual evidence observed — e.g., *"3 of 12 applications did not conduct quarterly access reviews in 2024"*).
3. **Cause**: *Why* it happened (The root cause — e.g., *"Application owners lacked automated notification workflows"*).
4. **Consequence (Effect)**: What is the *risk or impact* (Financial, operational, security impact — e.g., *"Dormant accounts of terminated employees remained active for up to 90 days"*).
5. **Corrective Action (Recommendation)**: What management *should do* (Practical, cost-effective remediation — e.g., *"Implement automated quarterly access certification in IAM tool"*)."""
        }
    },
    {
        "topic_code": "1B6",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Quality Assurance and Improvement of Audit Process",
        "part": "B",
        "sort_order": 10,
        "content_summary": "Internal quality assessments, external peer reviews (every 5 years), continuous professional development (CPE), and audit KPI metrics.",
        "subtopic": {
            "title": "Audit Quality Assurance & Continuous Improvement Programs",
            "estimated_minutes": 15,
            "key_concepts": ["Quality Assurance and Improvement Program (QAIP)", "External Peer Review", "Continuous Professional Education (CPE)", "Audit Key Performance Indicators"],
            "learning_objectives": "Establish a Quality Assurance and Improvement Program (QAIP), meet external peer review standards, and monitor audit department metrics.",
            "content_markdown": """# Quality Assurance and Improvement of Audit Process

## 1. Quality Assurance and Improvement Program (QAIP)

Under ISACA ITAF and IIA standards, the internal audit activity must maintain a formal **Quality Assurance and Improvement Program (QAIP)** covering all aspects of the audit department:

- **Internal Assessments**:
  - *Ongoing Monitoring*: Routine supervisory reviews of workpapers, engagement budget tracking, and post-audit auditee customer feedback surveys.
  - *Periodic Self-Assessments*: Annual internal evaluations of audit processes, methodology compliance, and staff competency.
- **External Assessments (Peer Review)**:
  - Must be conducted at least **once every five years** by a qualified, independent reviewer from outside the organization.
  - Results must be communicated directly to the **Audit Committee and Chief Executive Officer**.

> 💡 **ISACA / Exam Watch Alert:**
> External quality reviews must be conducted at least **once every 5 years** by independent reviewers to ensure compliance with professional auditing standards."""
        }
    }
]

print(f"Domain 1: {len(TOPICS_DEFINITIONS)} topics ready.")
