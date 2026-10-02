import os
import json
import re

DATA_DIR = 'scripts/cisa_28th_data'
EXTRACTED_DIR = 'scripts/cisa_28th_extracted'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

print("Synthesizing CISA 28th Edition curriculum, study materials, case studies, glossary, and questions...")

# =====================================================================
# 1. GENERATE STUDY MATERIALS (5 Full E-Reader Chapters)
# =====================================================================

STUDY_MATERIALS = [
    {
        "id": "e0000000-0000-0000-0000-000000000001",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "title": "Domain 1: Information System Auditing Process (Official 28th Ed.)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024)",
        "chapter_number": 1,
        "section_number": "1.0 - 1.10",
        "page_start": 26,
        "page_end": 88,
        "estimated_read_minutes": 55,
        "sort_order": 1,
        "key_takeaways": "• The Audit Charter establishes authority, purpose, scope, and responsibility; must be approved by the Audit Committee.\n• ITAF Standards are mandatory; Guidelines provide implementation guidance; Tools & Techniques provide procedural steps.\n• Risk-Based Auditing prioritizes engagements by assessing Inherent Risk and Control Risk before determining Substantive testing sample size.\n• Independence and Objectivity must be preserved in fact and appearance; an auditor cannot audit systems they recently designed or operated.\n• Audit Sampling: Statistical sampling provides mathematical measure of sampling risk, whereas Non-statistical uses auditor judgment.\n• Computer-Assisted Audit Techniques (CAATs) and Data Analytics enable testing 100% of populations rather than sample-only testing.",
        "exam_tips": "• Look for keywords: PRIMARY, MOST, FIRST, BEST. When asked what defines mandatory requirements, always select 'ISACA Standards'.\n• When a conflict of interest arises, the auditor's FIRST action is to disclose the impairment to audit management or the audit committee.\n• When evaluating internal control effectiveness, tests of controls (compliance testing) precede substantive testing.\n• The audit charter should NEVER contain detailed annual audit schedules—it is a high-level governance instrument.",
        "content_markdown": """# Domain 1: Information System Auditing Process
*CISA Official Review Manual, 28th Edition (2024) — Exam Weight: 18% (~27 Exam Questions)*

---

## 1.1 Management of the IS Audit Function
The Information Systems (IS) audit function provides independent, objective assurance to the board of directors, audit committee, and executive leadership regarding the effectiveness of IT governance, risk management, and internal controls.

### 1.1.1 The IS Audit Charter
The **Audit Charter** is the foundational governance document establishing the role and standing of the internal audit function.
- **Mandatory Elements**:
  1. Purpose, mission, and scope of the IS audit activity.
  2. Authority granted to the audit team, including unrestricted access to records, personnel, physical premises, and digital assets.
  3. Reporting lines (functionally reporting to the **Audit Committee / Board of Directors** to preserve organizational independence; administratively reporting to the CEO or senior executive).
  4. Accountability and responsibilities of the Chief Audit Executive (CAE).
- **Approval**: The charter must be formally reviewed and approved by the **Audit Committee or Board of Directors** at least annually.
- **Important Distinction**: The charter establishes high-level authority; it does *not* contain transient operational details such as the annual audit plan, project schedules, or specific audit procedures.

### 1.1.2 ITAF (Information Technology Assurance Framework)
ISACA’s **ITAF** provides a comprehensive framework for IS audit and assurance professionals:
- **Standards (Mandatory)**: Mandatory requirements that all IS audit and assurance professionals must follow. Failure to comply can result in disciplinary action under the ISACA Code of Professional Ethics.
  - *General Standards (1000 series)*: Audit charter, independence, professional ethics, due professional care, proficiency, quality assurance.
  - *Performance Standards (1200 series)*: Engagement planning, risk assessment, performance and supervision, audit evidence, professional judgment.
  - *Reporting Standards (1400 series)*: Reporting format, communication of findings, follow-up activities.
- **Guidelines (Advisory)**: Best-practice guidance in applying the standards to various engagement types (e.g., continuous auditing, mobile security, cloud reviews).
- **Tools and Techniques (Procedural)**: Concrete examples, templates, audit programs, and CAAT algorithms.

### 1.1.3 Independence vs. Objectivity
- **Independence**: The freedom from conditions that threaten the ability of the audit activity to carry out audit responsibilities in an unbiased manner. It is achieved through organizational status (reporting to the Audit Committee).
- **Objectivity**: An unbiased mental attitude that allows IS auditors to perform engagements without compromising quality or judgment.
- **Impairments**: If an IS auditor was involved in the design, development, or implementation of a system within the past 12 months, their independence and objectivity regarding that system are impaired. The auditor **must disclose** the impairment and recuse themselves from auditing that system.

---

## 1.2 IS Audit Planning & Risk Assessment
Risk-based audit planning ensures that scarce audit resources are directed to the systems and processes with the greatest potential impact on the enterprise.

### 1.2.1 Audit Risk Model
The total audit risk ($AR$) is the risk that an auditor will issue an inappropriate, unqualified audit opinion on financial or operational statements containing material misstatements or control deficiencies.
$$\\text{Audit Risk} = \\text{Inherent Risk} \\times \\text{Control Risk} \\times \\text{Detection Risk}$$

1. **Inherent Risk (IR)**: The susceptibility of an audit area, business process, or asset to material error or breach, assuming there are no related internal controls in place. (e.g., a complex online payment processing gateway inherently has high risk).
2. **Control Risk (CR)**: The risk that internal controls implemented by management will fail to prevent, detect, or correct an error or security incident on a timely basis. (Management owns and controls CR).
3. **Detection Risk (DR)**: The risk that the auditor's testing procedures will fail to detect a material error or control weakness. (The IS auditor controls DR through substantive testing sample size, test depth, and rigor).
   - *Key Exam Relationship*: When Inherent Risk and Control Risk are high, the auditor must set Detection Risk **low**, requiring **larger sample sizes** and more comprehensive substantive testing.

### 1.2.2 Types of Audits
- **Financial Audit**: Assesses the accuracy and completeness of financial reporting.
- **Operational Audit**: Evaluates the efficiency and effectiveness of business and IT processes.
- **Integrated Audit**: Combines financial, operational, and IS audit expertise into a unified assessment.
- **Compliance Audit**: Evaluates conformity with laws, regulations, contracts, and industry standards (e.g., GDPR, PCI-DSS, HIPAA, SOX).
- **Forensic / Investigative Audit**: Focuses on discovering evidence of fraud, crime, or intentional misconduct for legal proceedings.

---

## 1.3 Audit Execution & Project Management
An IS audit engagement follows four structured phases:
1. **Planning**: Understand the subject matter, define scope and objectives, perform risk assessment, review prior audit reports, draft the audit program.
2. **Fieldwork & Evidence Gathering**: Execute compliance and substantive tests, document workpapers, identify findings.
3. **Reporting**: Draft findings, hold exit conference with auditee management, obtain management responses/action plans, issue formal report.
4. **Follow-Up**: Verify that agreed-upon remediation actions have been implemented effectively.

---

## 1.4 Audit Testing & Sampling Methodology

### 1.4.1 Compliance vs. Substantive Testing
| Attribute | Compliance (Control) Testing | Substantive Testing |
| :--- | :--- | :--- |
| **Objective** | Verify that internal controls exist and operate effectively as designed. | Verify the accuracy, integrity, and validity of transactions and data balances. |
| **Example** | Testing whether all user access requests have documented manager approval before provisioning. | Verifying account balance calculations or comparing bank statements against ledger records. |
| **Sequence** | Performed **first**. If controls are effective, substantive testing can be reduced. | Performed **second**. If controls fail, substantive testing must be expanded. |

### 1.4.2 Sampling Approaches
1. **Statistical Sampling**: Allows the auditor to mathematically measure and control sampling risk (confidence level and precision). Every item in the population has a known, non-zero chance of selection.
   - *Attribute Sampling*: Used in compliance testing (measuring the rate of occurrence of an attribute/error, yes/no).
   - *Variable Sampling*: Used in substantive testing (measuring dollar values, weights, or continuous quantities).
   - *Stratified Sampling*: Dividing a heterogeneous population into homogeneous subgroups before sampling (e.g., sampling 100% of transactions over $100,000 and 5% of transactions under $10,000).
2. **Non-Statistical (Judgmental) Sampling**: Relies on the auditor's subjective experience and risk judgment. Cannot mathematically measure sampling risk.

---

## 1.5 Audit Evidence & Data Analytics (CAATs)

### 1.5.1 Hierarchy of Evidence Reliability
Audit evidence is information gathered during an engagement that supports the auditor's conclusions.
- **Most Reliable**: Evidence obtained directly by the auditor through personal observation, independent re-performance, physical inspection, or direct system data extraction.
- **Moderate Reliability**: Evidence obtained from independent external third parties (e.g., external bank confirmations, vendor SOC 2 reports).
- **Least Reliable**: Oral representations and internal uncorroborated documents provided by the auditee.

### 1.5.2 Computer-Assisted Audit Techniques (CAATs) & Data Analytics
- **Generalized Audit Software (GAS)**: Tools (e.g., ACL, IDEA, SQL queries, Python scripts) enabling auditors to extract, filter, join, match, and analyze 100% of transaction populations without altering source databases.
- **Continuous Auditing**: Automated, continuous monitoring of business transactions and control telemetry in real time, triggering alerts when control exceptions or anomalous patterns occur.
- **Audit Data Analytics (ADA)**: Applying descriptive, diagnostic, predictive, and prescriptive analytics to identify outliers, duplicate transactions, ghost employees, and segregation of duties (SoD) conflicts.

---

## 1.6 Audit Reporting, Exit Conferences & Follow-Up
- **Exit Conference**: Before issuing the final report, the IS auditor conducts an exit meeting with auditee management to discuss preliminary findings, ensure factual accuracy, and clarify context.
- **Audit Report Structure**:
  1. Scope, objectives, period of review, and methodology.
  2. Findings structured using the 5 C's:
     - **Condition**: What was found (the factual situation).
     - **Criteria**: The standard, policy, or baseline that should have been met.
     - **Cause**: Why the condition occurred (root cause).
     - **Consequence / Impact**: The business risk or exposure resulting from the condition.
     - **Corrective Action / Recommendation**: The proposed remediation.
  3. Management response and agreed remediation target dates.
- **Follow-Up Responsibility**: The Chief Audit Executive (CAE) is responsible for establishing a follow-up process to track and ensure that management has effectively addressed identified risks. If management accepts a high level of residual risk that exceeds the enterprise's risk appetite, the CAE must discuss the matter with senior management and, if unresolved, report it to the **Audit Committee**.
"""
    },
    {
        "id": "e0000000-0000-0000-0000-000000000002",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "title": "Domain 2: Governance and Management of IT (Official 28th Ed.)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024)",
        "chapter_number": 2,
        "section_number": "2.0 - 2.11",
        "page_start": 89,
        "page_end": 165,
        "estimated_read_minutes": 60,
        "sort_order": 2,
        "key_takeaways": "• Governance vs. Management: Governance (Board/EDM) sets direction, evaluates needs, and monitors compliance; Management (Executive/PBR) plans, builds, runs, and monitors activities in alignment with direction.\n• IT Steering Committee ensures business-IT alignment, prioritizes IT investments, and reviews major projects.\n• COBIT 2019 defines 40 Governance and Management Objectives across 5 Domains (EDM, APO, BAI, DSS, MEA).\n• Enterprise Risk Management (ERM): Risk Appetite defines how much risk the board will accept; Risk Tolerance defines allowable operational variance.\n• Segregation of Duties (SoD) is the primary internal control against fraud; Compensating controls (e.g., audit logs) are required when SoD cannot be maintained.\n• Third-Party Vendor Management requires due diligence, SLAs, right-to-audit clauses, and SOC 2 Type II report evaluations.",
        "exam_tips": "• If a question asks who is ULTIMATELY responsible for IT governance and information security, the answer is ALWAYS the **Board of Directors**.\n• When evaluating whether IT strategy aligns with business strategy, look for an active **IT Steering Committee** comprising business and IT executive leadership.\n• When Segregation of Duties is not feasible in a small IT team (e.g., Developer has DBA access), the BEST compensating control is **independent logging and daily review of database modifications**.\n• Policies represent high-level management intent (mandatory); Standards set specific mandatory rules; Procedures provide step-by-step instructions; Guidelines are advisory.",
        "content_markdown": """# Domain 2: Governance and Management of IT
*CISA Official Review Manual, 28th Edition (2024) — Exam Weight: 18% (~27 Exam Questions)*

---

## 2.1 Enterprise Governance of IT (EGIT)
Enterprise Governance of IT (EGIT) is an integral part of enterprise governance, exercised by the **Board of Directors**. It oversees the definition and implementation of processes, structures, and relational mechanisms that enable both business and IT personnel to execute their responsibilities in support of business-IT alignment and the creation of business value.

### 2.1.1 Governance vs. Management (COBIT 2019 Principles)
| Domain | Primary Entity | Core Activities (COBIT Domains) | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Governance** | Board of Directors / Governing Body | **EDM**: Evaluate, Direct, Monitor | Evaluates stakeholder needs; directs strategy through prioritization and decision making; monitors performance and compliance against objectives. |
| **Management** | Executive Management / CEO / CIO | **APO**: Align, Plan, Organize<br>**BAI**: Build, Acquire, Implement<br>**DSS**: Deliver, Service, Support<br>**MEA**: Monitor, Evaluate, Assess | Plans, builds, runs, and monitors operational activities in alignment with the direction set by the governance body. |

### 2.1.2 Organizational Structures & Committees
- **Board of Directors**: Holds **ultimate accountability** for governance, risk management, and the internal control environment.
- **Audit Committee**: Independent subcommittee of the board overseeing financial reporting, internal/external audit activities, and internal control effectiveness.
- **IT Strategy / Governance Committee**: Board-level committee ensuring IT is on the board's agenda and aligned with business strategy.
- **IT Steering Committee**: Executive-level committee (including business unit heads, CFO, CIO, and CISO) responsible for:
  - Prioritizing enterprise IT investments and major project portfolios.
  - Resolving resource conflicts between business units.
  - Monitoring major IT project delivery and milestones.
  - Ensuring ongoing alignment between business goals and IT operational plans.

---

## 2.2 IT Strategy & Enterprise Architecture
### 2.2.1 Business-IT Alignment
IT strategy must be directly derived from and support enterprise business strategy. The IS auditor assesses:
- Clear mapping between business goals and IT enabling objectives.
- Balanced Scorecard (BSC) metrics covering Financial, Customer, Internal Business Processes, and Learning/Growth.
- IT Investment Portfolios evaluated through Return on Investment (ROI), Net Present Value (NPV), and Total Cost of Ownership (TCO).

### 2.2.2 Enterprise Architecture (EA)
Enterprise Architecture provides a comprehensive blueprint of an organization's current and target states across four key layers:
1. **Business Architecture**: Business strategy, governance, organization, and key business processes.
2. **Data / Information Architecture**: Structure of logical and physical data assets and data management resources.
3. **Application Architecture**: Blueprint for individual application systems, interactions, and relationships to core business processes.
4. **Technology Architecture**: Hardware, software, cloud infrastructure, and network connectivity supporting application deployment.
*Frameworks*: TOGAF (The Open Group Architecture Framework), Zachman Framework.

---

## 2.3 IT Policies, Standards, Procedures & Guidelines
Management expresses its intent and requirements through a hierarchical documentation framework:
```
┌─────────────────────────────────────────────────────────┐
│ POLICIES (Mandatory, High-Level Management Intent)       │
├─────────────────────────────────────────────────────────┤
│ STANDARDS (Mandatory, Specific Measurable Metrics/Rules) │
├─────────────────────────────────────────────────────────┤
│ PROCEDURES (Mandatory, Step-by-Step Execution Tasks)     │
├─────────────────────────────────────────────────────────┤
│ GUIDELINES (Advisory, Recommended Practices/Examples)    │
└─────────────────────────────────────────────────────────┘
```
- **Policy Lifecycle**: Must be documented, communicated to all relevant employees, formally approved by executive management, and reviewed at least annually or upon significant organizational/technology changes.
- **Exceptions Process**: A formal policy exception process must exist, requiring documented risk assessment, compensating controls, senior management sign-off, and expiration dates.

---

## 2.4 Enterprise Risk Management (ERM)
Risk management is the systematic process of identifying, assessing, responding to, and monitoring risks that could affect the achievement of organizational objectives.

### 2.4.1 Risk Terminology
- **Threat**: Any circumstance or event with the potential to adversely impact organizational operations, assets, or individuals.
- **Vulnerability**: A weakness in an information system, security procedure, internal control, or implementation that can be exploited by a threat source.
- **Impact / Consequence**: The magnitude of harm resulting from the occurrence of a risk event.
- **Likelihood / Probability**: The frequency or probability of a risk event occurring.
- **Risk Appetite**: The amount and type of risk an enterprise is willing to accept in pursuit of its business objectives (set by the Board).
- **Risk Tolerance**: The acceptable variation in the size and degree of a specific risk outcome relative to objectives.

### 2.4.2 Risk Treatment / Response Options
1. **Risk Avoidance**: Exiting activities, canceling projects, or shutting down systems that expose the organization to unmanageable risk.
2. **Risk Mitigation (Reduction)**: Implementing internal controls, security countermeasures, and policies to reduce likelihood and/or impact.
3. **Risk Transfer (Sharing)**: Shifting financial risk exposure to third parties via cybersecurity insurance, outsourcing contracts, or warranty agreements.
4. **Risk Acceptance**: Acknowledging residual risk and choosing not to take action, formally authorized by senior business management when the risk falls within the risk appetite.

---

## 2.5 Data Governance, Privacy & Sourcing Strategy

### 2.5.1 Data Governance & Information Classification
Data assets must be classified based on their criticality and sensitivity to ensure proportional security controls:
- **Data Classification Levels**: Public, Internal, Confidential, Restricted/Secret.
- **Roles & Responsibilities**:
  - **Data Owner**: Senior business executive accountable for defining classification, determining access rights, and authorizing data use.
  - **Data Custodian**: Technical staff (e.g., DBAs, sysadmins) responsible for implementing controls, backups, encryption, and maintenance per Data Owner specifications.
  - **Data User**: Individuals authorized to access and process data in the performance of their duties.

### 2.5.2 Privacy Programs & Principles (GDPR, ISO/IEC 27701)
- **Data Minimization**: Collect only the personal data necessary for specified purposes.
- **Purpose Limitation**: Personal data must not be processed in ways incompatible with initial consent.
- **Data Subject Rights**: Right of access, rectification, erasure (right to be forgotten), and portability.
- **Privacy by Design & Default**: Privacy controls embedded into system development life cycles from inception.

### 2.5.3 Third-Party Vendor Management & Sourcing
When outsourcing IT functions (cloud services, managed service providers, software vendors):
1. **Due Diligence**: Evaluate financial health, security posture, compliance track record, and operational capabilities prior to contract execution.
2. **Contractual Protections**:
   - **Service Level Agreements (SLAs)**: Clear metrics for availability, response time, performance penalties, and uptime.
   - **Right-to-Audit Clause**: Unconditional right for the organization or its appointed auditors to inspect vendor facilities, systems, and controls.
   - **Data Ownership & Return**: Express clause stating all enterprise data remains the sole property of the client and must be sanitized upon termination.
   - **Breach Notification**: Requirement to notify the client within a specified timeframe (e.g., 24-72 hours) of any security incident.
3. **SOC Reports (System and Organization Controls)**:
   - **SOC 1**: Controls relevant to user entities' internal control over financial reporting (ICFR).
   - **SOC 2**: Controls relevant to Security, Availability, Processing Integrity, Confidentiality, and Privacy.
     - *Type I*: Opinion on management's description of controls as of a *point in time*.
     - *Type II*: Tests of the *operating effectiveness* of controls over a minimum 6-month period. (IS auditors rely on Type II reports).
"""
    },
    {
        "id": "e0000000-0000-0000-0000-000000000003",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "title": "Domain 3: IS Acquisition, Development, and Implementation (Official 28th Ed.)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024)",
        "chapter_number": 3,
        "section_number": "3.0 - 3.8",
        "page_start": 166,
        "page_end": 246,
        "estimated_read_minutes": 50,
        "sort_order": 3,
        "key_takeaways": "• The Business Case provides the financial justification, feasibility analysis, risk assessment, and ROI/TCO for project authorization.\n• System Development Life Cycle (SDLC): Requirements -> Design -> Development -> Testing -> Implementation -> Post-Implementation.\n• In Agile/DevOps, controls must be integrated into CI/CD automated pipelines (DevSecOps, automated testing, static/dynamic code analysis).\n• User Acceptance Testing (UAT) is the final stage before go-live; it must be performed by business end users in an isolated testing environment using sanitized data.\n• Cutover Strategies: Parallel adoption provides the safest fallback; Phased adoption reduces risk incrementally; Direct cutover (plunge) carries highest risk.\n• Post-Implementation Review (PIR) must be performed after the system has stabilized (3-6 months) to evaluate realized business benefits against the original business case.",
        "exam_tips": "• What is the IS auditor's PRIMARY role during SDLC? Ensuring that appropriate internal controls are designed into the system and that project governance/testing standards are followed (without designing the controls themselves to maintain independence).\n• Who MUST sign off on User Acceptance Testing (UAT)? The **Business Process Owner / System Owner**.\n• When migrating production databases, live customer production data should NEVER be used in test environments unless it is fully **anonymized or masked**.\n• In a Post-Implementation Review, the primary objective is to verify whether the system achieved its intended **business benefits and objectives** defined in the business case.",
        "content_markdown": """# Domain 3: IS Acquisition, Development, and Implementation
*CISA Official Review Manual, 28th Edition (2024) — Exam Weight: 12% (~18 Exam Questions)*

---

## 3.1 Project Governance & Management
Effective project governance ensures that IT investments deliver expected business capabilities on time, within budget, and in accordance with strategic priorities.

### 3.1.1 Project Management Frameworks
- **Project Sponsor**: Senior business executive who champions the project, secures funding, and is accountable for realizing business benefits.
- **Project Steering Committee**: Oversees project progress, resolves escalated issues, approves major change requests, and manages budget allocations.
- **Project Manager**: Manages daily execution, schedule, budget, risk log, and deliverables.
- **Triple Constraint**: Scope, Time, Cost (with Quality as the central outcome). A change in one dimension invariably impacts the others.

### 3.1.2 The Business Case & Feasibility Analysis
The business case is the primary document used to justify project initiation.
- **Feasibility Dimensions**:
  - *Economic Feasibility*: Cost-Benefit Analysis (CBA), Net Present Value (NPV), Internal Rate of Return (IRR), Return on Investment (ROI), Payback Period.
  - *Technical Feasibility*: Availability of technology, infrastructure compatibility, architectural alignment.
  - *Operational Feasibility*: Organizational readiness, user adoption, process change impact.
  - *Legal & Regulatory Feasibility*: Compliance with privacy laws, industry regulations, and licensing.

---

## 3.2 System Development Methodologies (SDLC)

```mermaid
graph LR
    A[1. Requirements] --> B[2. Design]
    B --> C[3. Development]
    C --> D[4. Testing UAT]
    D --> E[5. Implementation Cutover]
    E --> F[6. Post-Implementation Review]
```

### 3.2.1 Waterfall vs. Agile vs. DevOps
| Methodology | Characteristics | Key Audit Considerations |
| :--- | :--- | :--- |
| **Traditional Waterfall** | Linear, sequential phases. Requirements strictly locked before design begins. Formal stage-gate approvals. | Clear documentation trail; audit checks for formal sign-offs at each gate. High risk of late requirement discovery. |
| **Agile (Scrum / Kanban)** | Iterative sprints (1-4 weeks). Evolving requirements, user stories, product backlogs, daily standups, sprint retrospectives. | Ensure definition of done includes security/control testing. Traceability between user stories and test cases. |
| **DevOps & CI/CD** | Automated pipelines integrating development, automated testing, security scanning (DevSecOps), and rapid deployment. | Segregation of duties enforced via automated pipeline controls, branch protection rules, automated linting/SAST/DAST, and immutable deployment logs. |

---

## 3.3 Control Identification & Design
Controls designed into software during early development phases are significantly cheaper and more effective than controls retrofitted after go-live.
- **Input Controls**: Batch controls (hash totals, record counts), format checks, range checks, validity checks, sequence checks, check digits.
- **Processing Controls**: Run-to-run totals, data validation, boundary checks, automated error handling and logging.
- **Output Controls**: Spooler security, report distribution lists, reconciliation of output totals to input totals.
- **Database & Integrity Controls**: ACID properties (Atomicity, Consistency, Isolation, Durability), referential integrity constraints, concurrency locks.

---

## 3.4 System Testing & Quality Assurance
Software testing must follow a structured progression across isolated environments (Development -> Testing/QA -> Staging/UAT -> Production):

```
Unit Testing (Developers verify code units/functions)
       ↓
Integration Testing (Verify interfaces between modules)
       ↓
System Testing (Verify end-to-end functionality, performance, load, security)
       ↓
User Acceptance Testing (UAT) (Business users validate against business requirements)
       ↓
Regression Testing (Verify new code changes did not break existing features)
```

- **User Acceptance Testing (UAT)**: The definitive testing phase where actual business process users validate that the system meets business requirements in a production-mirror environment. The **Business Process Owner** must provide formal written sign-off before deployment.
- **Test Data Management**: Using unmasked, un-sanitized production data containing PII or sensitive financial records in development/test environments violates privacy regulations and introduces severe data leakage risks. Production data must be **anonymized, pseudonymized, or synthetic** before use in testing.

---

## 3.5 System Migration, Cutover & Data Conversion
Transitioning from a legacy system to a new system requires careful cutover planning:

### 3.5.1 Cutover Strategies
1. **Parallel Run**: The legacy system and new system operate concurrently for a defined period. Outputs and balances are reconciled.
   - *Advantage*: Safest approach; allows immediate rollback if the new system fails.
   - *Disadvantage*: Most expensive and resource-intensive (double workload for users).
2. **Phased Cutover**: The new system is implemented incrementally by module, business unit, or geographic region.
   - *Advantage*: Limits risk to a subset of operations; provides learning curve.
   - *Disadvantage*: Requires complex temporary interfaces between new and legacy systems.
3. **Direct Cutover (Cold Turkey / Plunge)**: The legacy system is completely decommissioned and the new system goes live at a specific cutover instant.
   - *Advantage*: Fastest, least costly implementation.
   - *Disadvantage*: **Highest risk**; no fallback if critical failures occur. Requires exhaustive testing and a detailed contingency/rollback plan.
4. **Pilot Cutover**: The system is fully deployed in one representative branch or location before enterprise rollout.

### 3.5.2 Data Conversion Controls
- Completeness and accuracy verified through pre- and post-conversion record counts, financial hash totals, and field-level reconciliations.
- Data cleansing performed *before* migration to avoid corrupting the target database.

---

## 3.6 Post-Implementation Review (PIR)
A Post-Implementation Review is conducted **3 to 6 months after system stabilization**.
- **Primary Objectives**:
  1. Determine whether the system met its intended business objectives and realized the ROI/benefits promised in the original business case.
  2. Verify that internal controls are operating effectively in the live environment.
  3. Identify operational deficiencies, unexpected costs, and performance bottlenecks.
  4. Capture lessons learned for future development projects.
- **Auditor Role**: The IS auditor independently evaluates the PIR methodology, reviews benefit realization reports, and assesses unresolved system defect logs.
"""
    },
    {
        "id": "e0000000-0000-0000-0000-000000000004",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "title": "Domain 4: IS Operations and Business Resilience (Official 28th Ed.)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024)",
        "chapter_number": 4,
        "section_number": "4.0 - 4.15",
        "page_start": 247,
        "page_end": 342,
        "estimated_read_minutes": 65,
        "sort_order": 4,
        "key_takeaways": "• IT Operations ensures reliability, availability, and performance of IT hardware, infrastructure, cloud workloads, and operational processes.\n• ITIL Service Management Framework: Service Strategy, Design, Transition, Operation, and Continual Improvement.\n• Incident Management restores normal service operation as quickly as possible; Problem Management investigates root causes to prevent recurring incidents.\n• Change & Configuration Management: Every production change requires request, technical review, rollback plan, CAB approval, and post-implementation review.\n• Business Impact Analysis (BIA) is the foundational starting point for BCP/DRP; it identifies critical business processes and determines MTD, RTO, and RPO.\n• Recovery Sites: Hot Site (fully equipped, minutes to hours), Warm Site (hardware present, days), Cold Site (basic shell, weeks), Mobile Site.\n• Testing BCP/DRP: Tabletop/Walkthrough -> Structured Walkthrough -> Simulation -> Parallel Test -> Full Interruption Test.",
        "exam_tips": "• What is the FIRST step in developing a Business Continuity Plan (BCP)? Conducting a **Business Impact Analysis (BIA)**.\n• Understand the difference between RTO and RPO:\n  - **RTO (Recovery Time Objective)** = How much downtime can be tolerated before operations are restored.\n  - **RPO (Recovery Point Objective)** = How much data loss can be tolerated (measured in time from last backup to disaster).\n• **MTD (Maximum Tolerable Downtime)** is the absolute maximum time the business can survive without the critical function. Rule: RTO + Work Recovery Time must be $\\le$ MTD.\n• What is the primary purpose of Problem Management? Identifying the **root cause** of incidents to prevent recurrence (unlike Incident Management, which focuses on immediate restoration).",
        "content_markdown": """# Domain 4: IS Operations and Business Resilience
*CISA Official Review Manual, 28th Edition (2024) — Exam Weight: 26% (~39 Exam Questions)*

---

## 4.1 IT Operations & Service Management
IT Operations encompasses the day-to-day administration of hardware, operating systems, networks, virtualization platforms, databases, and peripheral infrastructure.

### 4.1.1 IT Service Management (ITSM / ITIL)
The ITIL framework provides standardized best practices for IT service delivery:
- **Service Level Management**: Defines, negotiates, and monitors **Service Level Agreements (SLAs)** with business customers, **Operational Level Agreements (OLAs)** with internal IT teams, and **Underpinning Contracts (UCs)** with external vendors.
- **Incident Management**: Primary goal is to **restore normal service operation as rapidly as possible** and minimize adverse impact on business operations.
- **Problem Management**: Primary goal is to identify and resolve the **root causes** of incidents, eliminate recurring incidents, and create Workarounds / Known Error Databases (KEDB).
- **Change Management**: Ensures all changes to production configurations, code, and infrastructure are assessed for risk, tested, authorized by the **Change Advisory Board (CAB)**, and accompanied by a documented rollback plan.
- **Release and Deployment Management**: Coordinates packaging, testing, and deployment of software releases into production environments.
- **Configuration Management & CMDB**: Maintains an accurate, up-to-date repository of all Configuration Items (CIs) and their relational dependencies across the enterprise.

---

## 4.2 IT Asset Management, EUC & Shadow IT

### 4.2.1 IT Asset Management (ITAM)
- Comprehensive inventory tracking hardware, software licenses, firmware, and cloud resources throughout their lifecycle (Procurement -> Deployment -> Maintenance -> Decommissioning/Disposal).
- **Media Sanitization**: Ensuring retired storage devices and servers undergo verified cryptographic erasure, degaussing, or physical destruction (NIST SP 800-88) to prevent data leakage.

### 4.2.2 End-User Computing (EUC) & Shadow IT
End-User Computing (e.g., complex business spreadsheets, user-created Access databases, low-code/no-code automated scripts) creates serious organizational exposure:
- **Key Risks**: Lack of segregation of duties, absence of formal version control, inadequate input validation, missing audit trails, un-tested logic, and lack of automated backup.
- **Shadow IT**: Departmental adoption of SaaS solutions or cloud infrastructure without IT visibility or security approval.
- **Audit Approach**: Maintain an enterprise inventory of critical EUC assets, mandate standardized template protections (cell locking, password protection), enforce periodic independent validation of calculation logic, and implement Cloud Access Security Brokers (CASB) to detect shadow SaaS usage.

---

## 4.3 Database, Storage & Capacity Management
- **Database Administration**: Database Administrators (DBAs) manage schema structures, index tuning, performance, query execution plans, and backup routines.
  - *SoD Concern*: DBAs should not possess application development privileges or business transaction creation rights.
  - *Database Activity Monitoring (DAM)*: Independent logging of all DBA activities and direct SQL commands.
- **Capacity & Availability Management**: Proactive monitoring of CPU, RAM, IOPS, network bandwidth, and storage growth to prevent service degradation before performance thresholds are breached.

---

## 4.4 Business Continuity Planning (BCP) & Disaster Recovery (DRP)

```mermaid
graph TD
    A[Business Impact Analysis BIA] --> B[Define MTD, RTO, RPO]
    B --> C[Develop BCP Business Continuity Strategy]
    B --> D[Develop DRP Disaster Recovery Plans]
    C --> E[Testing, Training & Maintenance]
    D --> E
```

### 4.4.1 Business Impact Analysis (BIA)
The **BIA is the foundational prerequisite** for all business continuity and disaster recovery planning.
- **Core Objectives**:
  1. Identify and inventory critical business processes and supporting IT systems.
  2. Quantify the financial, operational, regulatory, and reputational impact of disruptions over time.
  3. Establish recovery time metrics:
     - **Maximum Tolerable Downtime (MTD)**: The maximum time a business process can be inoperable before irreparable harm occurs to enterprise survival.
     - **Recovery Time Objective (RTO)**: The target time within which a system or process must be restored following an outage ($RTO \\le MTD$).
     - **Recovery Point Objective (RPO)**: The maximum acceptable amount of data loss measured in time (e.g., an RPO of 2 hours requires backups at least every 2 hours).

### 4.4.2 Recovery Site Alternatives
| Recovery Site Type | Description | RTO Capability | Cost Profile |
| :--- | :--- | :--- | :--- |
| **Hot Site** | Fully configured, mirrored hardware, operational operating systems, replicated real-time data, and network links ready immediately. | Minutes to hours ($RTO \\approx 0$) | Highest |
| **Warm Site** | Facilities equipped with hardware and network connections, but applications and current data must be restored from backups. | Hours to days | Moderate |
| **Cold Site** | Basic facility with power, HVAC, and raised flooring, but no computing hardware installed. Equipment must be procured and configured. | Days to weeks | Lowest |
| **Reciprocal Agreement** | Mutual agreement between two companies to share computing facilities in the event of a disaster. | Variable (High risk of resource contention/incompatibility) | Low |
| **Cloud Disaster Recovery** | Cloud-native elastic infrastructure (e.g., Pilot Light, Multi-Region Active-Active failover). | Seconds to hours | Scalable / Cost-effective |

---

## 4.5 Data Backup, Storage & Restoration
- **Full Backup**: Complete copy of all data in the designated system. Longest backup time; fastest restoration.
- **Differential Backup**: Backs up all files changed since the **last Full backup**. Restoration requires: Last Full + Last Differential.
- **Incremental Backup**: Backs up only files changed since the **last Full or Incremental backup**. Fastest backup; slowest restoration (requires Last Full + ALL subsequent Incrementals in sequence).
- **Continuous Data Protection (CDP)**: Real-time journaling of data changes to secondary storage, allowing point-in-time recovery to any prior second ($RPO \\approx 0$).
- **Tape / Storage Offsite Storage**: Backups must be encrypted in transit and at rest, stored at a geographical distance that prevents simultaneous destruction by the same regional disaster, and periodically tested via **actual test restorations**.

---

## 4.6 Testing the BCP / DRP
Plans that are not tested will invariably fail during a real crisis. Testing must progress through escalating tiers:
1. **Tabletop / Paper Test**: Key stakeholders review the plan around a conference table to identify gaps and update contact details.
2. **Structured Walkthrough Test**: Participants walk through verbal scenario simulations step-by-step to validate operational workflows.
3. **Simulation Test**: Recovery personnel respond to a simulated disaster scenario, activating emergency operations centers and executing communications without failing over production systems.
4. **Parallel Test**: Recovery systems and backup sites are brought online and tested with historical transactions alongside live production operations.
5. **Full Interruption (Cutover) Test**: Live production operations are shut down and completely transferred to the disaster recovery site.
   - *Caution*: **Highest operational risk**. Must be authorized by executive leadership and conducted during lowest business volume periods.
"""
    },
    {
        "id": "e0000000-0000-0000-0000-000000000005",
        "certification_id": CISA_CERT_ID,
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "title": "Domain 5: Protection of Information Assets (Official 28th Ed.)",
        "document_title": "CISA Official Review Manual",
        "edition": "28th Edition (2024)",
        "chapter_number": 5,
        "section_number": "5.0 - 5.15",
        "page_start": 343,
        "page_end": 547,
        "estimated_read_minutes": 75,
        "sort_order": 5,
        "key_takeaways": "• The CIA Triad (Confidentiality, Integrity, Availability) forms the cornerstone of information security architecture.\n• Zero Trust Architecture (ZTA): 'Never trust, always verify.' Authenticate and authorize every request explicitly based on identity, device posture, and context.\n• Identity and Access Management (IAM): Role-Based Access Control (RBAC), Least Privilege, Need-to-Know, and Multi-Factor Authentication (MFA).\n• Privileged Access Management (PAM): Just-In-Time (JIT) access, credential vaulting, session recording, and strict MFA for all administrative accounts.\n• Cryptography: Symmetric (AES, fast, shared key) vs. Asymmetric (RSA/ECC, public/private key pairs, digital signatures, PKI).\n• Cloud Shared Responsibility: IaaS (Customer controls OS/Apps/Data), PaaS (Customer controls Apps/Data), SaaS (Customer controls Data/Access).\n• Incident Response: Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Post-Incident Lessons Learned.\n• Digital Forensics: Preservation of evidence, strict Chain of Custody, write-blockers, bit-stream disk imaging, and cryptographic hashing (SHA-256).",
        "exam_tips": "• What provides Non-Repudiation? A **Digital Signature** (created by encrypting the document hash with the sender's **Private Key**; verified with the sender's **Public Key**).\n• In a Public Key Infrastructure (PKI), who validates the identity of the certificate applicant? The **Registration Authority (RA)**. Who signs and issues the certificate? The **Certificate Authority (CA)**.\n• When a security breach occurs, what is the FIRST technical priority after human safety? **Containing the incident** to prevent further spread and damage while **preserving forensic evidence** (never reboot a compromised system without capturing volatile RAM).\n• What is the primary difference between IDS and IPS? An **IDS (Intrusion Detection System)** is passive and only detects/alerts; an **IPS (Intrusion Prevention System)** sits inline and actively blocks/drops malicious traffic.",
        "content_markdown": """# Domain 5: Protection of Information Assets
*CISA Official Review Manual, 28th Edition (2024) — Exam Weight: 26% (~39 Exam Questions)*

---

## 5.1 Information Security Governance & Architecture

### 5.1.1 The CIA Triad & Key Principles
- **Confidentiality**: Ensuring information is accessible only to authorized individuals, entities, or processes (enforced via encryption, access controls, DLP).
- **Integrity**: Safeguarding the accuracy, completeness, and authentic state of information and processing systems against unauthorized alteration (enforced via hashing, digital signatures, integrity checks).
- **Availability**: Ensuring authorized users have timely, reliable access to information assets when needed (enforced via redundancy, failover, DDoS mitigation, DRP).
- **Non-Repudiation**: Ensuring a party cannot deny the authenticity of their signature or the origination of a transaction (achieved via digital signatures and PKI).

### 5.1.2 Zero Trust Architecture (ZTA - NIST SP 800-207)
Modern enterprise security shifts from traditional perimeter-based security ('castle-and-moat') to Zero Trust:
1. **Core Tenet**: 'Never trust, always verify.' No implicit trust is granted based solely on physical or network location.
2. **Key Pillars**:
   - Explicit authentication and authorization for every access request.
   - Dynamic policy evaluation using context (user identity, device health, geolocation, threat telemetry).
   - Least privilege access and micro-segmentation of network environments.
   - Continuous inspection and telemetry logging across all sessions.

---

## 5.2 Identity and Access Management (IAM & PAM)

### 5.2.1 Identification, Authentication, Authorization & Accounting (IAAA)
- **Identification**: Asserting an identity (e.g., username, smart card ID).
- **Authentication**: Proving the asserted identity.
  - *Factors of Authentication*:
    1. **Something you know** (passwords, PINs, passphrases).
    2. **Something you have** (smart cards, hardware tokens, OTP authenticator app, push notification).
    3. **Something you are** (biometrics: fingerprints, retina, iris, facial geometry).
  - *Multi-Factor Authentication (MFA)* requires **two or more DIFFERENT categories** (e.g., password + hardware token). Two passwords are still single-factor.
- **Authorization**: Granting specific access rights based on proven identity:
  - *Role-Based Access Control (RBAC)*: Access granted based on organizational job roles.
  - *Attribute-Based Access Control (ABAC)*: Access evaluated dynamically based on user attributes, resource attributes, and environmental conditions.
  - *Discretionary Access Control (DAC)*: Data owner determines permissions.
  - *Mandatory Access Control (MAC)*: System enforces permissions based on security labels and user clearance levels (e.g., Top Secret).
- **Accounting & Auditability**: Logging all user actions, logon attempts, privilege escalations, and object access.

### 5.2.2 Privileged Access Management (PAM)
Administrative and root accounts represent the highest risk attack vector:
- **PAM Controls**:
  - Centralized Credential Vaulting (passwords rotated automatically and never revealed to administrators).
  - Just-In-Time (JIT) access granting temporary elevated privileges for a specific maintenance window.
  - Session Recording and real-time monitoring of all privileged terminal sessions.
  - Prohibition of shared generic admin accounts; every administrator must be individually identifiable.

---

## 5.3 Cryptography & Public Key Infrastructure (PKI)

### 5.3.1 Symmetric vs. Asymmetric Cryptography
| Feature | Symmetric Encryption | Asymmetric Encryption (Public Key) |
| :--- | :--- | :--- |
| **Keys** | Single shared secret key for encryption and decryption. | Key pair: Public Key (shared openly) and Private Key (kept strictly confidential). |
| **Algorithms** | AES (128/256-bit), 3DES, Blowfish, ChaCha20. | RSA, ECC (Elliptic Curve Cryptography), Diffie-Hellman, DSA. |
| **Speed** | Very fast; suitable for bulk data and disk encryption. | Computationally intensive / slow; suitable for key exchange and digital signatures. |
| **Key Exchange** | Difficult key distribution problem ($n(n-1)/2$ keys). | Scalable key distribution ($2n$ keys). |

### 5.3.2 Digital Signatures & Non-Repudiation
A digital signature provides **Authentication, Integrity, and Non-Repudiation**:
1. **Creation (Sender)**:
   - A mathematical cryptographic hash of the document is generated (e.g., SHA-256).
   - The sender encrypts the hash using their **Private Key**. This encrypted hash is the *Digital Signature*.
2. **Verification (Recipient)**:
   - The recipient decrypts the digital signature using the sender's **Public Key** to retrieve the original hash.
   - The recipient independently hashes the received document.
   - If the decrypted hash matches the newly calculated hash, the document is proven authentic and unmodified.

### 5.3.3 Public Key Infrastructure (PKI) Components
- **Certificate Authority (CA)**: Trusted third-party entity that digitally signs and issues X.509 digital certificates, binding a public key to an entity's identity.
- **Registration Authority (RA)**: Verifies the identity of certificate applicants on behalf of the CA prior to issuance.
- **Certificate Revocation List (CRL) & OCSP**:
  - *CRL*: Periodically published list of revoked certificates (may suffer from latency).
  - *OCSP (Online Certificate Status Protocol)*: Real-time query mechanism to verify the current validity of a certificate.

---

## 5.4 Network Security, Firewalls & Architecture
- **Network Segmentation**: Dividing physical or virtual networks into isolated subnetworks (VLANs, DMZs) to contain lateral movement by attackers.
- **Firewall Generations**:
  1. *Packet Filtering (Stateless)*: Inspects packet headers (source/dest IP, port, protocol) against static rules (Layer 3/4).
  2. *Stateful Inspection*: Tracks active connection state in a state table, ensuring incoming packets belong to established sessions.
  3. *Next-Generation Firewalls (NGFW)*: Deep packet inspection (DPI), application-level awareness (Layer 7), integrated IDS/IPS, TLS/SSL inspection, threat intelligence.
  4. *Web Application Firewall (WAF)*: Protects web applications against Layer 7 attacks (OWASP Top 10: SQLi, XSS, CSRF, remote code execution).
- **Intrusion Detection (IDS) vs. Intrusion Prevention (IPS)**:
  - *IDS*: Passive sensor (connected via SPAN/mirror port); detects anomalies and alerts administrators. Does not alter traffic flow.
  - *IPS*: Active inline device; inspects traffic in real time and automatically drops malicious packets or resets TCP connections.

---

## 5.5 Cloud Security & Virtualization

### 5.5.1 Cloud Shared Responsibility Model
```
┌─────────────────────────────────────────────────────────────┐
│ SaaS (Software as a Service)                                │
│ Customer: Data, Access & User Management                    │
│ Provider: Application, OS, Hypervisor, Network, Physical    │
├─────────────────────────────────────────────────────────────┤
│ PaaS (Platform as a Service)                                │
│ Customer: Application Code, Data, Configuration             │
│ Provider: Runtime, OS, Hypervisor, Network, Physical        │
├─────────────────────────────────────────────────────────────┤
│ IaaS (Infrastructure as a Service)                          │
│ Customer: OS, Middleware, Apps, Data, Network Config        │
│ Provider: Hypervisor, Physical Servers, Datacenter Security │
└─────────────────────────────────────────────────────────────┘
```

### 5.5.2 Virtualization & Container Security
- **Type 1 (Bare-Metal) Hypervisor**: Runs directly on physical hardware (e.g., VMware ESXi, KVM). More secure and performant.
- **Type 2 (Hosted) Hypervisor**: Runs on top of a host operating system (e.g., VirtualBox).
- **Containerization (Docker/Kubernetes)**: Lightweight application isolation sharing the host OS kernel.
  - *Container Security*: Vulnerability scanning of base container images, immutable containers, runtime behavioral monitoring, restricting root execution inside containers.

---

## 5.6 Security Monitoring, Incident Response & Forensics

### 5.6.1 Security Information and Event Management (SIEM) & SOAR
- **SIEM**: Centralizes log aggregation, correlation, normalization, and automated alert generation across servers, firewalls, and applications.
- **SOAR (Security Orchestration, Automation and Response)**: Automates threat triage, enrichment, and automated playbook execution (e.g., automatically isolating a malware-infected endpoint).

### 5.6.2 Incident Response Life Cycle (NIST SP 800-61)
1. **Preparation**: Form CSIRT team, establish incident response policy, develop playbooks, configure monitoring tools.
2. **Detection & Analysis**: Identify security events, triage alerts, determine attack scope and severity.
3. **Containment**:
   - *Short-Term*: Isolate compromised hosts from network, disable compromised user credentials (stop active spread).
   - *Long-Term*: Deploy temporary controls while forensic images are acquired.
4. **Eradication**: Remove malware, remediate root vulnerabilities, sanitize systems.
5. **Recovery**: Restore systems from clean backups, validate normal operations, enhance monitoring.
6. **Lessons Learned (Post-Incident Review)**: Document findings, update playbooks, calculate financial impact.

### 5.6.3 Digital Forensics & Chain of Custody
Digital evidence must be collected and handled according to strict legal standards to ensure admissibility in court:
- **Order of Volatility**: Collect evidence starting from the most volatile to least volatile storage:
  $$\\text{CPU Registers/Cache} \\rightarrow \\text{RAM/Routing Tables} \\rightarrow \\text{Temporary Swap Files} \\rightarrow \\text{Disk Storage} \\rightarrow \\text{Remote Logs} \\rightarrow \\text{Archival Media}$$
- **Forensic Disk Imaging**: Always create a **bit-stream physical image (clone)** of the original storage media using a hardware **Write-Blocker**. Analysis is performed exclusively on forensic copies, NEVER on the original suspect drive.
- **Integrity Verification**: Calculate cryptographic hash values (SHA-256, MD5) of the drive *before* and *after* imaging. If hashes match, forensic integrity is proven.
- **Chain of Custody**: Continuous, unbroken documentary log detailing who collected the evidence, when, where, why, and every individual who had custody of it thereafter.
"""
    }
]

with open(os.path.join(DATA_DIR, "study_materials.json"), "w", encoding="utf-8") as f:
    json.dump(STUDY_MATERIALS, f, indent=2)

print(f"Generated {len(STUDY_MATERIALS)} comprehensive study materials chapters with valid UUIDs.")
