import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

# Complete 60 Canonical Topics for CISA 28th Edition (2024 Blueprint)
# 1A1 - 1B6 (10), 2A1 - 2B4 (11), 3A1 - 3B4 (8), 4A1 - 4B5 (16), 5A1 - 5B6 (15)

ALL_TOPICS = [
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
        "content_summary": "ISACA ITAF standards hierarchy, audit charter governance, organizational independence, and ISACA Code of Professional Ethics.",
        "subtopic": {
            "title": "ITAF Standards Hierarchy, Audit Charter & Professional Ethics",
            "estimated_minutes": 25,
            "key_concepts": ["ITAF Standards (Mandatory)", "ITAF Guidelines (Advisory)", "Audit Charter", "Independence & Objectivity", "ISACA Code of Ethics"],
            "learning_objectives": "Distinguish between mandatory ITAF standards and advisory guidelines, evaluate the governance elements of an audit charter, and apply ethical requirements to resolve independence impairments.",
            "content_markdown": """# IS Audit Standards, Guidelines, Functions & Professional Ethics

## 1. The ISACA Information Technology Assurance Framework (ITAF)
ITAF provides foundational guidance for IT audit and assurance professionals:
- **ITAF Standards (1000, 1200, 1400 Series)**: **MANDATORY** for all CISA holders and ISACA audit engagements.
- **ITAF Guidelines (2000, 2200, 2400 Series)**: **ADVISORY** approaches and methodologies for applying standards.
- **ITAF Tools and Techniques (3000 Series)**: Practical checklists, templates, and white papers.

> 💡 **ISACA / Exam Watch Alert:**
> Standards are **MANDATORY**; Guidelines are **ADVISORY**. If a question asks what an IS auditor *MUST* comply with, the answer is ISACA Standards and the Code of Professional Ethics.

## 2. The Internal Audit Charter
- **Approval Authority**: Must be approved by the **Audit Committee or Board of Directors**. Signing solely by the CFO or CIO impairs organizational independence.
- **Right to Access**: Grants internal audit **unrestricted access** to all records, systems, personnel, and physical facilities.
- **Dual Reporting**: Functional reporting to the Board/Audit Committee; administrative reporting to the CEO.

> 💡 **ISACA / Exam Watch Alert:**
> When an auditor is denied access to critical records by a business unit manager, the **FIRST** step is to **review the Audit Charter** and escalate to the Audit Committee, not abandon testing or confront executives."""
        }
    },
    {
        "topic_code": "1A2",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Types of Audits, Assessments, and Reviews",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Internal vs external audits, compliance audits, financial/operational/integrated audits, third-party SOC assurance, and security reviews.",
        "subtopic": {
            "title": "Audit Classifications, Integrated Audits & Third-Party SOC Assurance",
            "estimated_minutes": 20,
            "key_concepts": ["Internal vs External Audits", "Integrated Auditing", "Compliance & Forensic Audits", "SOC 1 / SOC 2 / SOC 3 Reports", "Type I vs Type II"],
            "learning_objectives": "Compare various types of audits and reviews, analyze integrated audits, and evaluate SOC reports for third-party assurance.",
            "content_markdown": """# Types of Audits, Assessments, and Reviews

## 1. Audit Classifications
- **Integrated Audit**: Combines IT general controls (ITGCs) and automated business process controls with financial and operational reviews to assess overall risk.
- **Compliance Audit**: Evaluates adherence to laws, regulations, and contractual standards (e.g. GDPR, HIPAA, PCI-DSS, SOX).
- **Forensic Audit**: Investigates suspected fraud, requiring strict evidence preservation and chain of custody.

## 2. Third-Party SOC Reports
- **SOC 1 (ICFR)**: Financial reporting controls.
- **SOC 2 (Trust Services Criteria)**: Security, Availability, Processing Integrity, Confidentiality, Privacy.
- **Type I Report**: Control design at a single point in time (insufficient for operational assurance).
- **Type II Report**: Control design AND operating effectiveness over a minimum 6-month period.

> 💡 **ISACA / Exam Watch Alert:**
> A **Type I report is INSUFFICIENT** to rely upon for ongoing operational assurance. An auditor seeking assurance on a service provider's operational controls **MUST require a SOC 2 Type II report**."""
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

## 1. The Risk-Based Approach
A Risk-Based Audit Approach deploys audit resources to areas of greatest risk to the enterprise by evaluating business objectives, threat landscapes, and control environments.

## 2. The Audit Risk Model
$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

- **Inherent Risk (IR)**: Risk before controls (inherent to the business/system).
- **Control Risk (CR)**: Risk that management's controls will fail to prevent or detect errors.
- **Detection Risk (DR)**: Risk that audit substantive testing will fail to detect errors.

> 💡 **ISACA / Exam Watch Alert:**
> Detection risk is the **ONLY component of audit risk that the IS auditor directly controls**! If Inherent Risk and Control Risk are HIGH, the auditor must set Detection Risk to LOW by increasing substantive testing and sample sizes."""
        }
    },
    {
        "topic_code": "1A4",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "domain_num": 1,
        "name": "Types of Controls and Considerations",
        "part": "A",
        "sort_order": 4,
        "content_summary": "Preventive, detective, and corrective controls; automated vs manual controls; and compensating controls.",
        "subtopic": {
            "title": "Control Classifications, Automated Controls & Compensating Controls",
            "estimated_minutes": 20,
            "key_concepts": ["Preventive Controls", "Detective Controls", "Corrective Controls", "Compensating Controls", "Automated vs Manual"],
            "learning_objectives": "Classify internal controls by timing and implementation mechanism, design effective compensating controls, and evaluate automated controls.",
            "content_markdown": """# Types of Controls and Considerations

## 1. Control Classifications by Timing
- **Preventive Controls**: Stop errors or unauthorized transactions BEFORE they occur (e.g. SoD, dual authorization, input masks, biometric locks).
- **Detective Controls**: Identify errors or unauthorized activity AFTER they occur (e.g. audit log reviews, hash verification, reconciliations).
- **Corrective Controls**: Mitigate damage and restore operations AFTER an incident (e.g. backups, disaster recovery, incident response playbooks).

> 💡 **ISACA / Exam Watch Alert:**
> **Preventive controls are ALWAYS preferred** because preventing an error or incident avoids loss and downtime.

## 2. Compensating Controls
When primary controls cannot be implemented (e.g. small team lacking SoD), management implements compensating controls (e.g., independent log monitoring).

> 💡 **ISACA / Exam Watch Alert:**
> The BEST compensating control for a segregation of duties conflict is **independent supervisory review of activity logs** or **automated independent reconciliations**."""
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
1. **Planning & Scoping**: Preliminary survey, risk assessment, formulating the Audit Program.
2. **Fieldwork & Testing**: Compliance testing of controls, substantive testing of data.
3. **Reporting**: Exit conference, draft findings, management responses, final report.
4. **Follow-up**: Tracking management remediation progress.

> 💡 **ISACA / Exam Watch Alert:**
> The **Audit Program** must be approved by the **Audit Manager** before fieldwork begins. Workpapers are the property of the **audit organization**, not the auditee."""
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

## 1. Compliance vs. Substantive Testing
- **Compliance Testing (Test of Controls)**: Tests whether controls operate effectively as designed (uses Attribute Sampling).
- **Substantive Testing (Test of Details)**: Tests the accuracy, completeness, and dollar validity of transactions and balances (uses Variable Sampling).

> 💡 **ISACA / Exam Watch Alert:**
> If Compliance Testing reveals that controls are **INEFFECTIVE**, the auditor must **EXPAND Substantive Testing** to determine the actual extent of errors or unauthorized transactions.

## 2. Sampling Risk
- **Beta Risk (Risk of Incorrect Acceptance / Type II Error)**: Control is ineffective, but the sample suggests it is effective. This is the **GREATEST concern** because it leads to issuing a false clean opinion."""
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

## 1. Evidence Reliability Hierarchy
1. **Direct Re-performance / Physical Inspection** (Most Reliable)
2. **External Third-Party Confirmation** (e.g., bank/custodian)
3. **Direct Observation** (Valid only for the moment observed)
4. **Internal Documentation from Strong Controls**
5. **Internal Documentation from Weak Controls**
6. **Oral Inquiries / Management Assertions** (Least Reliable)

> 💡 **ISACA / Exam Watch Alert:**
> Inquiry alone is **INSUFFICIENT** to support an audit finding. Oral statements from management must always be corroborated with documentary or system evidence."""
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
            "content_markdown": """# Audit Data Analytics & CAATs

## 1. CAATs & Generalized Audit Software
CAATs allow auditors to test 100% of large datasets for duplicate payments, split purchase orders, and anomalies without sampling risk.

## 2. Advanced Automated Audit Techniques
- **Embedded Audit Module (EAM)**: Audit routines built directly into application logic to capture suspect transactions in real time.
- **Integrated Test Facility (ITF)**: Dummy test accounts in production systems.

> 💡 **ISACA / Exam Watch Alert:**
> When using an **Integrated Test Facility (ITF)**, the auditor's GREATEST concern is ensuring test transactions are tagged and reversed so they **DO NOT corrupt live production databases or financial records**."""
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

## 1. The Exit Conference
The IS auditor meets with auditee management to confirm factual accuracy and discuss preliminary findings before publishing the formal report.

## 2. The 5 Cs of an Audit Finding
1. **Criteria**: The required standard, policy, or regulation.
2. **Condition**: The factual evidence found.
3. **Cause**: Why the deviation happened (root cause).
4. **Consequence (Effect)**: The risk or financial/operational impact.
5. **Corrective Action**: Management recommendation for remediation.

> 💡 **ISACA / Exam Watch Alert:**
> If management resolves an issue immediately during fieldwork, the auditor **MUST still document the condition in workpapers** and note in the report that it was remediated prior to closing."""
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
- **Internal Monitoring**: Ongoing supervisory reviews and annual internal self-assessments.
- **External Peer Reviews**: Conducted at least **once every 5 years** by qualified independent external reviewers, reporting results to the Audit Committee.

> 💡 **ISACA / Exam Watch Alert:**
> External quality reviews must be conducted at least **once every 5 years** to ensure ongoing compliance with international auditing standards."""
        }
    },

    # =========================================================================
    # DOMAIN 2: Governance and Management of IT (18% — 11 Topics)
    # =========================================================================
    {
        "topic_code": "2A1",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Laws, Regulations, and Industry Standards",
        "part": "A",
        "sort_order": 1,
        "content_summary": "Legal and regulatory compliance landscape, cross-border data transfer, legal hold requirements, and intellectual property protections.",
        "subtopic": {
            "title": "Legal, Regulatory Compliance & Cross-Border Data Governance",
            "estimated_minutes": 20,
            "key_concepts": ["Regulatory Compliance", "Cross-Border Data Transfer", "Legal Hold & E-Discovery", "Intellectual Property & Licensing"],
            "learning_objectives": "Evaluate legal and regulatory compliance requirements and implement cross-border data governance controls.",
            "content_markdown": """# Laws, Regulations, and Industry Standards

## 1. IT Legal & Regulatory Landscape
Organizations operating internationally must comply with complex regional and industry regulations (e.g., GDPR, CCPA, HIPAA, PCI-DSS, SOX).

## 2. Cross-Border Data Transfers
- **Data Sovereignty**: Data is subject to the legal jurisdictions of the country in which it is physically stored and processed.
- **Standard Contractual Clauses (SCCs) & Adequacy Decisions**: Legal frameworks required when transferring personal data internationally under GDPR.

> 💡 **ISACA / Exam Watch Alert:**
> When an organization stores cloud customer data across multiple international regions, the **PRIMARY legal risk** is non-compliance with **local data privacy laws and cross-border transfer restrictions**."""
        }
    },
    {
        "topic_code": "2A2",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Organizational Structure, IT Governance, and IT Strategy",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Board of Directors oversight, IT Strategy Committee vs IT Steering Committee, IT balanced scorecard, and strategic alignment.",
        "subtopic": {
            "title": "IT Strategy Committee vs IT Steering Committee & Strategic Alignment",
            "estimated_minutes": 25,
            "key_concepts": ["IT Governance vs Management", "IT Strategy Committee (Board)", "IT Steering Committee (Executive)", "IT Balanced Scorecard (IT BSC)", "Strategic Alignment"],
            "learning_objectives": "Differentiate governance from management, compare board IT committees with executive steering committees, and align IT strategy with enterprise goals.",
            "content_markdown": """# Organizational Structure, IT Governance & Strategy

## 1. IT Strategy Committee vs. IT Steering Committee

| Governance Dimension | IT Strategy Committee | IT Steering Committee |
| :--- | :--- | :--- |
| **Level** | **Board of Directors Level** | **Executive Management Level** |
| **Chair** | Board Member (Independent Director) | Executive (CIO, COO, or Business Leader) |
| **Primary Focus** | Long-term strategic direction, risk appetite, ROI alignment with enterprise strategy. | Project prioritization, resource allocation, milestone tracking, budget monitoring. |
| **Frequency** | Quarterly / Bi-annually | Monthly / Bi-weekly |

> 💡 **ISACA / Exam Watch Alert:**
> **IT Strategy Committee = BOARD LEVEL** (advises board on IT alignment and risk).
> **IT Steering Committee = EXECUTIVE/OPERATIONAL LEVEL** (monitors projects, allocates resources, resolves project conflicts).

## 2. The IT Balanced Scorecard (IT BSC)
Measures IT performance across 4 balanced perspectives:
1. **Financial**: Value delivery and cost optimization.
2. **Customer / Business**: Business satisfaction and service quality.
3. **Internal Processes**: Operational excellence and delivery agility.
4. **Learning & Growth**: Human capital and innovation readiness."""
        }
    },
    {
        "topic_code": "2A3",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "IT Policies, Standards, Procedures and Practices",
        "part": "A",
        "sort_order": 3,
        "content_summary": "Policy hierarchy (Policies, Standards, Guidelines, Procedures), exception management, and annual review cycles.",
        "subtopic": {
            "title": "The Documentation Hierarchy: Policies, Standards, Procedures & Guidelines",
            "estimated_minutes": 20,
            "key_concepts": ["Policy Hierarchy", "IT Policies (Mandatory)", "Standards (Mandatory Baseline)", "Procedures (Step-by-Step)", "Guidelines (Advisory)"],
            "learning_objectives": "Structure organizational IT policies, establish baseline standards, and manage policy exceptions.",
            "content_markdown": """# IT Policies, Standards, Procedures & Practices

## 1. The Documentation Hierarchy
- **Policies**: High-level statements of management intent (MANDATORY, approved by Executive/Board).
- **Standards**: Mandatory technical baselines and specifications (e.g., minimum 14-character passwords, AES-256 encryption).
- **Procedures**: Step-by-step instructions for executing tasks (MANDATORY).
- **Guidelines**: Recommended best practices (ADVISORY).

> 💡 **ISACA / Exam Watch Alert:**
> Policies must be reviewed and approved **at least annually** or upon major organizational changes. If an employee cannot comply with a policy, a formal **Policy Exception Process** must be documented and approved by the risk owner with compensating controls."""
        }
    },
    {
        "topic_code": "2A4",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Enterprise Architecture (EA) and Considerations",
        "part": "A",
        "sort_order": 4,
        "content_summary": "TOGAF, Zachman framework, business architecture, data architecture, application architecture, technology architecture, and technical debt.",
        "subtopic": {
            "title": "Enterprise Architecture (EA) Frameworks & Technical Debt",
            "estimated_minutes": 20,
            "key_concepts": ["Enterprise Architecture (EA)", "TOGAF & Zachman", "Current vs Target Architecture", "Technical Debt"],
            "learning_objectives": "Evaluate Enterprise Architecture frameworks, manage technical debt, and ensure architectural alignment with business capabilities.",
            "content_markdown": """# Enterprise Architecture (EA) and Considerations

## 1. Enterprise Architecture Domains (TOGAF)
1. **Business Architecture**: Business strategy, governance, and key business processes.
2. **Data Architecture**: Structure of logical and physical data assets and management resources.
3. **Application Architecture**: Blueprint for individual applications and their interactions.
4. **Technology Architecture**: Hardware, software infrastructure, networks, and cloud platforms.

> 💡 **ISACA / Exam Watch Alert:**
> The primary benefit of an **Enterprise Architecture (EA)** is ensuring that technology investments align with business capabilities and preventing redundant, siloed application sprawl."""
        }
    },
    {
        "topic_code": "2A5",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Enterprise Risk Management (ERM)",
        "part": "A",
        "sort_order": 5,
        "content_summary": "Risk governance, risk appetite vs risk tolerance, quantitative formulas (SLE, ARO, ALE), risk response options (avoid, mitigate, transfer, accept), and risk registers.",
        "subtopic": {
            "title": "ERM Frameworks, Quantitative Risk Formulas & Risk Responses",
            "estimated_minutes": 25,
            "key_concepts": ["Risk Appetite vs Tolerance", "Single Loss Expectancy (SLE)", "Annualized Rate of Occurrence (ARO)", "Annualized Loss Expectancy (ALE)", "Risk Responses"],
            "learning_objectives": "Calculate quantitative risk metrics (ALE, SLE, ARO), evaluate risk appetite and tolerance, and select risk response strategies.",
            "content_markdown": """# Enterprise Risk Management (ERM)

## 1. Risk Appetite vs. Risk Tolerance
- **Risk Appetite**: The amount and type of risk an enterprise is willing to accept in pursuit of its business objectives (set by the **Board of Directors**).
- **Risk Tolerance**: The acceptable operational variation around specific objectives.

## 2. Quantitative Risk Formulas
$$\\text{Single Loss Expectancy (SLE)} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$
$$\\text{Annualized Loss Expectancy (ALE)} = \\text{SLE} \\times \\text{Annualized Rate of Occurrence (ARO)}$$
$$\\text{Cost-Benefit of Safeguard} = \\text{ALE}_{\\text{before}} - \\text{ALE}_{\\text{after}} - \\text{Annual Safeguard Cost}$$

> 💡 **ISACA / Exam Watch Alert:**
> If a safeguard costs more than the reduction in ALE it produces, the safeguard is **NOT cost-effective** and should NOT be implemented.

## 3. The 4 Risk Response Options
1. **Mitigate (Reduce)**: Implement controls.
2. **Transfer (Share)**: Purchase cyber insurance or outsource.
3. **Avoid**: Discontinue the high-risk activity.
4. **Accept**: Retain the risk within risk appetite (approved by executive risk owner)."""
        }
    },
    {
        "topic_code": "2A6",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Privacy Program and Principles",
        "part": "A",
        "sort_order": 6,
        "content_summary": "Privacy by Design, Data Protection Officer (DPO) role, Data Protection Impact Assessments (DPIA), and individual privacy rights.",
        "subtopic": {
            "title": "Privacy by Design, DPIA & Privacy Governance Frameworks",
            "estimated_minutes": 20,
            "key_concepts": ["Privacy by Design & Default", "Data Protection Officer (DPO)", "Data Protection Impact Assessment (DPIA)", "Data Subject Rights"],
            "learning_objectives": "Implement Privacy by Design principles, conduct DPIAs, and evaluate privacy governance structures.",
            "content_markdown": """# Privacy Program and Principles

## 1. Core Privacy Principles (GDPR / OECD)
- **Lawfulness, Fairness & Transparency**: Clear notice and consent.
- **Purpose Limitation**: Data collected only for specified, legitimate purposes.
- **Data Minimization**: Collect only what is strictly necessary.
- **Storage Limitation**: Retain data no longer than required.

> 💡 **ISACA / Exam Watch Alert:**
> A **Data Protection Impact Assessment (DPIA)** must be conducted **BEFORE** deploying any new system or technology that processes sensitive personal data or high-risk consumer profiling."""
        }
    },
    {
        "topic_code": "2A7",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Data Governance and Classification",
        "part": "A",
        "sort_order": 7,
        "content_summary": "Data ownership, data classification schemes, data custodial duties, data dictionary, and data lineage.",
        "subtopic": {
            "title": "Data Classification Schemes, Data Owners vs Custodians & Lineage",
            "estimated_minutes": 20,
            "key_concepts": ["Data Owner (Business)", "Data Custodian (IT)", "Data Classification Schemes", "Data Lineage"],
            "learning_objectives": "Establish data classification schemes, define roles of data owners vs custodians, and audit data lifecycle management.",
            "content_markdown": """# Data Governance and Classification

## 1. Data Roles & Responsibilities

| Role | Typical Identity | Primary Responsibility |
| :--- | :--- | :--- |
| **Data Owner** | Senior Business Leader / Department Head | **Classifies the data**, determines access permissions, approves retention rules, and assumes legal accountability. |
| **Data Custodian** | IT / Database Administrator | **Implements technical safeguards**, performs backups, configures encryption, and maintains system availability. |
| **Data User** | End User | Complies with policies and uses data solely for authorized business tasks. |

> 💡 **ISACA / Exam Watch Alert:**
> The **Data Owner (Business)** has the sole authority to determine data classification and grant access permissions. IT personnel (Data Custodians) only implement technical safeguards."""
        }
    },
    {
        "topic_code": "2B1",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "IT Resource Management",
        "part": "B",
        "sort_order": 8,
        "content_summary": "Human resource controls, mandatory vacations, job rotation, segregation of duties (SoD), and IT budgeting.",
        "subtopic": {
            "title": "Human Resource Controls, Segregation of Duties & Succession Planning",
            "estimated_minutes": 20,
            "key_concepts": ["Segregation of Duties (SoD)", "Mandatory Vacation", "Job Rotation", "Dual Control", "Dual Authorization"],
            "learning_objectives": "Design segregation of duties matrices, evaluate detective HR controls (mandatory vacation, job rotation), and audit IT staffing.",
            "content_markdown": """# IT Resource Management

## 1. Segregation of Duties (SoD)
Critical incompatible roles that MUST be segregated:
- **Developers** must NOT have access to production deployment or production data.
- **Database Administrators (DBAs)** must NOT have user access management rights.
- **Security Administrators** must NOT have operational IT administrative rights.

## 2. Fraud Detection HR Controls
- **Mandatory Vacation (Consecutive Days)**: Forces employees away from their duties for at least 1-2 consecutive weeks, allowing another employee to perform the role (effective at detecting ongoing fraud or embezzlement).
- **Job Rotation**: Periodically rotating employees across responsibilities to detect irregularities and prevent single points of failure.

> 💡 **ISACA / Exam Watch Alert:**
> **Mandatory vacation** is primarily a **DETECTIVE control** designed to uncover fraud, unauthorized modifications, or embezzlement that requires constant manual intervention to conceal."""
        }
    },
    {
        "topic_code": "2B2",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "IT Vendor Management",
        "part": "B",
        "sort_order": 9,
        "content_summary": "Third-party risk management (TPRM), Service Level Agreements (SLAs), right-to-audit clauses, escrow agreements, and cloud exit strategies.",
        "subtopic": {
            "title": "Third-Party Sourcing, SLAs, Right-to-Audit Clauses & Escrow",
            "estimated_minutes": 20,
            "key_concepts": ["Third-Party Risk Management (TPRM)", "Service Level Agreements (SLAs)", "Right-to-Audit Clause", "Software Source Code Escrow", "Exit Strategy"],
            "learning_objectives": "Evaluate third-party vendor contracts, enforce right-to-audit clauses, audit SLAs, and establish source code escrow protections.",
            "content_markdown": """# IT Vendor Management

## 1. Critical Vendor Contract Clauses
- **Right-to-Audit Clause**: Permits the customer (and its external auditors) to inspect the vendor's controls and data centers.
- **Service Level Agreements (SLAs)**: Defines measurable performance targets (uptime, latency, resolution times) and financial penalties for non-performance.
- **Software Escrow Agreement**: A third-party escrow agent holds the vendor's source code, releasing it to the customer if the vendor goes bankrupt or discontinues maintenance.

> 💡 **ISACA / Exam Watch Alert:**
> When acquiring proprietary software from a small or financially unstable vendor, the **MOST critical control** to protect the enterprise against vendor bankruptcy is a **Software Source Code Escrow Agreement**."""
        }
    },
    {
        "topic_code": "2B3",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "IT Performance Monitoring and Reporting",
        "part": "B",
        "sort_order": 10,
        "content_summary": "Key Performance Indicators (KPIs), Key Goal Indicators (KGIs), Key Risk Indicators (KRIs), and executive dashboards.",
        "subtopic": {
            "title": "IT Metrics: KPIs, KGIs, KRIs & Executive Dashboards",
            "estimated_minutes": 20,
            "key_concepts": ["Key Performance Indicators (KPIs)", "Key Goal Indicators (KGIs)", "Key Risk Indicators (KRIs)", "Executive Reporting"],
            "learning_objectives": "Formulate IT performance metrics, differentiate leading KRIs from lagging KPIs, and report performance to executive leadership.",
            "content_markdown": """# IT Performance Monitoring and Reporting

## 1. Metric Classifications
- **Key Goal Indicators (KGIs)**: Lagging metrics measuring *whether an objective was achieved* (e.g., 99.99% annual uptime achieved).
- **Key Performance Indicators (KPIs)**: Measures *how well a process is performing* (e.g., average change implementation failure rate).
- **Key Risk Indicators (KRIs)**: Leading, forward-looking indicators providing early warning of increasing risk exposure (e.g., spike in failed login attempts).

> 💡 **ISACA / Exam Watch Alert:**
> **KRIs are LEADING indicators** (early warning of future risk), whereas **KPIs/KGIs are LAGGING indicators** (historical performance outcomes)."""
        }
    },
    {
        "topic_code": "2B4",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "domain_num": 2,
        "name": "Quality Assurance and Quality Management of IT",
        "part": "B",
        "sort_order": 11,
        "content_summary": "ISO 9001, CMMI maturity levels (1-5), Six Sigma, IT quality audits, and continuous process improvement.",
        "subtopic": {
            "title": "Quality Management Systems (ISO 9001) & CMMI Maturity Levels",
            "estimated_minutes": 20,
            "key_concepts": ["Quality Assurance (QA)", "Quality Control (QC)", "Capability Maturity Model Integration (CMMI)", "ISO 9001"],
            "learning_objectives": "Compare QA with QC, evaluate CMMI maturity levels, and audit quality management systems.",
            "content_markdown": """# Quality Assurance and Quality Management of IT

## 1. QA vs. QC
- **Quality Assurance (QA)**: Process-oriented preventive activities ensuring quality standards are built into development processes.
- **Quality Control (QC)**: Product-oriented detective activities inspecting deliverables for defects before release.

## 2. CMMI Process Maturity Levels (1 to 5)
1. **Initial**: Ad-hoc, chaotic, heroic individual effort.
2. **Managed**: Basic project management established; repeatable at project level.
3. **Defined**: Standard organizational processes documented and standardized.
4. **Quantitatively Managed**: Processes controlled using statistical and quantitative techniques.
5. **Optimizing**: Focus on continuous process improvement and innovation.

> 💡 **ISACA / Exam Watch Alert:**
> Moving from **CMMI Level 2 (Managed) to Level 3 (Defined)** means processes are no longer just project-specific, but are **standardized across the entire organization**."""
        }
    },

    # =========================================================================
    # DOMAIN 3: IS Acquisition, Development, and Implementation (12% — 8 Topics)
    # =========================================================================
    {
        "topic_code": "3A1",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "Project Governance and Management",
        "part": "A",
        "sort_order": 1,
        "content_summary": "Project charter, PMO governance, project sponsor accountability, work breakdown structure (WBS), and critical path method (CPM).",
        "subtopic": {
            "title": "Project Governance, PMO, Critical Path Method (CPM) & EVM",
            "estimated_minutes": 20,
            "key_concepts": ["Project Sponsor", "Project Management Office (PMO)", "Critical Path Method (CPM)", "Earned Value Management (EVM)"],
            "learning_objectives": "Evaluate project governance structures, identify critical path activities, and assess Earned Value Management metrics.",
            "content_markdown": """# Project Governance and Management

## 1. Project Roles & Governance
- **Project Sponsor**: Senior business owner who champions the project, secures funding, and is ultimately accountable for delivering business benefits.
- **Project Steering Committee**: Oversees project scope, budget variances, and resolves cross-functional conflicts.

## 2. Project Scheduling & Critical Path Method (CPM)
- **Critical Path**: The longest sequence of dependent activities in a project network diagram.
- **Zero Float / Slack**: Activities on the critical path have zero float; any delay directly delays the project completion date.

> 💡 **ISACA / Exam Watch Alert:**
> A delay to any task on the **Critical Path** will directly delay the overall project completion date. Non-critical path tasks have float/slack time."""
        }
    },
    {
        "topic_code": "3A2",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "Business Case and Feasibility Analysis",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Business case elements, ROI/NPV/IRR financial justification, feasibility study types, and total cost of ownership (TCO).",
        "subtopic": {
            "title": "Business Case Justification, Feasibility Studies & TCO Analysis",
            "estimated_minutes": 20,
            "key_concepts": ["Business Case", "Feasibility Studies (Economic, Technical, Operational)", "Total Cost of Ownership (TCO)", "NPV & ROI"],
            "learning_objectives": "Evaluate business case feasibility, compute Total Cost of Ownership (TCO), and review financial justification metrics.",
            "content_markdown": """# Business Case and Feasibility Analysis

## 1. The Business Case
A Business Case justifies the investment required to initiate an IT project:
- Defines business problem and strategic alignment.
- Financial cost-benefit analysis (ROI, NPV, Payback Period).
- Risk assessment and feasibility evaluations.

## 2. Feasibility Study Dimensions
- **Economic**: Financial affordability and ROI.
- **Technical**: Availability of technology, hardware, and staff skills.
- **Operational**: Organizational willingness and cultural readiness to adopt the solution.
- **Legal/Regulatory**: Compliance with applicable laws.

> 💡 **ISACA / Exam Watch Alert:**
> **Total Cost of Ownership (TCO)** must include not only initial acquisition and development costs, but also **ongoing maintenance, software licensing, training, infrastructure, and eventual decommissioning costs**."""
        }
    },
    {
        "topic_code": "3A3",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "System Development Methodologies",
        "part": "A",
        "sort_order": 3,
        "content_summary": "Traditional SDLC (Waterfall), Agile (Scrum/Kanban), DevSecOps, CI/CD security pipelines, and Prototyping.",
        "subtopic": {
            "title": "SDLC Methodologies: Waterfall vs Agile, DevSecOps & CI/CD Security",
            "estimated_minutes": 25,
            "key_concepts": ["Traditional Waterfall SDLC", "Agile & Scrum", "DevSecOps & Shift-Left", "CI/CD Automated Security Gates"],
            "learning_objectives": "Compare Waterfall and Agile methodologies, embed security into DevSecOps pipelines, and audit automated CI/CD controls.",
            "content_markdown": """# System Development Methodologies

## 1. Waterfall vs. Agile Methodologies
- **Waterfall**: Sequential, stage-gated phases (Requirements -> Design -> Code -> Test -> Deploy). High documentation; rigid to change.
- **Agile**: Iterative, sprint-based releases (2-4 week sprints). Highly adaptable to changing user requirements; requires continuous customer collaboration.

## 2. DevSecOps & CI/CD Security (Shift-Left)
- **Shift-Left Security**: Integrating security scanning early in the development lifecycle rather than waiting for pre-production penetration testing.
- **SAST (Static Application Security Testing)**: Scans source code for vulnerabilities in the repository/build stage.
- **DAST (Dynamic Application Security Testing)**: Tests running applications against simulated attacks.

> 💡 **ISACA / Exam Watch Alert:**
> In **Agile development**, the IS auditor's primary concern is ensuring that **security and audit logging requirements are included in user stories and Definition of Done (DoD)**, not deferred to future sprints."""
        }
    },
    {
        "topic_code": "3A4",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "Control Identification and Design",
        "part": "A",
        "sort_order": 4,
        "content_summary": "Application controls (input, processing, output), automated integrity checks, boundary checks, and audit trails.",
        "subtopic": {
            "title": "Application Controls: Input, Processing, Output & Audit Trails",
            "estimated_minutes": 20,
            "key_concepts": ["Input Controls (Validation, Masks)", "Processing Controls (Run-to-run, Limits)", "Output Controls (Reconciliation)", "Audit Trail Logging"],
            "learning_objectives": "Design and audit automated application controls across input, processing, and output phases.",
            "content_markdown": """# Control Identification and Design

## 1. Application Control Categories
- **Input Controls**: Verify data accuracy and completeness at the point of entry (e.g., range checks, format checks, check digits, sequence checks).
- **Processing Controls**: Ensure data integrity during computation and file updates (e.g., run-to-run totals, record counts, limit checks).
- **Output Controls**: Ensure reports and outputs are distributed only to authorized recipients and reconcile with input totals.

> 💡 **ISACA / Exam Watch Alert:**
> **Check digits** are a powerful input validation control that detects transposition and transcription errors in identification numbers (e.g. credit cards, account numbers)."""
        }
    },
    {
        "topic_code": "3B1",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "System Readiness and Implementation Testing",
        "part": "B",
        "sort_order": 5,
        "content_summary": "Unit, integration, system, and regression testing; User Acceptance Testing (UAT); test data sanitization and masking.",
        "subtopic": {
            "title": "Testing Hierarchy: Unit, Integration, UAT & Test Data Sanitization",
            "estimated_minutes": 25,
            "key_concepts": ["Unit & Integration Testing", "System & Regression Testing", "User Acceptance Testing (UAT)", "Test Data Sanitization & Masking"],
            "learning_objectives": "Evaluate testing hierarchies, verify UAT business sign-offs, and enforce test data sanitization standards.",
            "content_markdown": """# System Readiness and Implementation Testing

## 1. Software Testing Hierarchy
1. **Unit Testing**: Tests individual code modules (performed by developers).
2. **Integration Testing**: Tests interfaces and data exchange between modules.
3. **System Testing**: Evaluates complete end-to-end functionality against requirements.
4. **Regression Testing**: Verifies that new changes or bug fixes did not break existing functionality.
5. **User Acceptance Testing (UAT)**: Business end-users validate that the system meets business requirements in a dedicated staging environment.

## 2. Test Data Security
- Live production data containing PII or financial records must NEVER be copied into test environments without **masking, tokenization, or obfuscation**.

> 💡 **ISACA / Exam Watch Alert:**
> Using **unmasked live production customer data in testing environments violates privacy regulations** and security baselines. Production data must always be sanitized or masked before use in testing."""
        }
    },
    {
        "topic_code": "3B2",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "Implementation Configuration and Release Management",
        "part": "B",
        "sort_order": 6,
        "content_summary": "Release governance, change control approval gates, emergency changes, and segregation of duties in deployment.",
        "subtopic": {
            "title": "Release Management Governance, CAB Approvals & Emergency Changes",
            "estimated_minutes": 20,
            "key_concepts": ["Change Advisory Board (CAB)", "Release Management", "Emergency Change Procedures", "Deployment SoD"],
            "learning_objectives": "Audit release management workflows, evaluate Change Advisory Board (CAB) controls, and review emergency change logs.",
            "content_markdown": """# Implementation Configuration and Release Management

## 1. Release Governance & CAB
- All standard production changes must be reviewed and approved by the **Change Advisory Board (CAB)**.
- **Emergency Changes**: Require expedited verbal/written approval from designated authorities, but MUST be retrospectively documented and reviewed by CAB within 24-48 hours.

> 💡 **ISACA / Exam Watch Alert:**
> Developers must **NEVER have write or deployment access to production environments**. Releases must be deployed by an independent release management team or automated CI/CD tool."""
        }
    },
    {
        "topic_code": "3B3",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "System Migration, Infrastructure Deployment, and Data Conversion",
        "part": "B",
        "sort_order": 7,
        "content_summary": "Data migration integrity checks, hash matching, cutover strategies (Parallel, Phased, Pilot, Direct Cutover), and fallback plans.",
        "subtopic": {
            "title": "Cutover Strategies (Parallel, Phased, Direct) & Data Conversion",
            "estimated_minutes": 25,
            "key_concepts": ["Parallel Cutover", "Direct Cutover (Plunge)", "Phased & Pilot Cutover", "Data Conversion Reconciliation", "Rollback / Fallback Plan"],
            "learning_objectives": "Compare cutover strategies, evaluate data conversion integrity controls, and audit fallback rollback plans.",
            "content_markdown": """# System Migration, Infrastructure Deployment & Data Conversion

## 1. Cutover Deployment Strategies

| Strategy | Description | Risk Level | Cost | Key Characteristic |
| :--- | :--- | :--- | :--- | :--- |
| **Parallel Cutover** | Run both old and new systems simultaneously for a period. | **LOWEST** | HIGHEST | Safest strategy; outputs are cross-reconciled. High operational effort. |
| **Direct Cutover (Plunge)** | Decommission old system and launch new system immediately. | **HIGHEST** | LOWEST | No fallback safety net; must have a documented and tested rollback plan! |
| **Phased Cutover** | Implement system in gradual functional stages. | Medium | Medium | Manages complexity over time. |
| **Pilot Cutover** | Deploy system first to a single branch/department before full rollout. | Medium | Medium | Tests operational viability on a live subset. |

> 💡 **ISACA / Exam Watch Alert:**
> When management chooses a **Direct Cutover**, the IS auditor's PRIMARY focus is ensuring that a **fully documented, tested fallback/rollback plan exists** in case critical failures occur."""
        }
    },
    {
        "topic_code": "3B4",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "domain_num": 3,
        "name": "Post-Implementation Review",
        "part": "B",
        "sort_order": 8,
        "content_summary": "Post-Implementation Review (PIR) objectives, timing (3-6 months post go-live), ROI validation, and lessons learned.",
        "subtopic": {
            "title": "Post-Implementation Review (PIR) Objectives & Benefits Realization",
            "estimated_minutes": 20,
            "key_concepts": ["Post-Implementation Review (PIR)", "Benefits Realization", "PIR Timing (Stabilization Period)", "Lessons Learned"],
            "learning_objectives": "Conduct Post-Implementation Reviews (PIR), evaluate ROI realization, and assess control effectiveness post-stabilization.",
            "content_markdown": """# Post-Implementation Review (PIR)

## 1. PIR Timing & Objectives
- **Timing**: Conducted **3 to 6 months after go-live** (after normal operational stabilization). Conducting a PIR immediately upon go-live is premature because routine operational patterns and benefits have not materialized.
- **Objectives**:
  1. Determine if business case objectives and ROI were achieved.
  2. Evaluate internal control effectiveness in live production.
  3. Identify lessons learned for future development projects.

> 💡 **ISACA / Exam Watch Alert:**
> A PIR must be conducted **AFTER a stabilization period (typically 3–6 months)**, not immediately upon cutover, to accurately measure benefits realization and operational stability."""
        }
    },

    # =========================================================================
    # DOMAIN 4: IS Operations and Business Resilience (26% — 16 Topics)
    # =========================================================================
    {
        "topic_code": "4A1",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "IT Components",
        "part": "A",
        "sort_order": 1,
        "content_summary": "Hardware architectures, server virtualization, hypervisors (Type 1 vs Type 2), OS controls, and network topology.",
        "subtopic": {
            "title": "IT Hardware Architecture, Hypervisors & OS Hardening",
            "estimated_minutes": 20,
            "key_concepts": ["Type 1 vs Type 2 Hypervisors", "Virtualization Security (VM Escape)", "OS Hardening Baselines", "Network Topology"],
            "learning_objectives": "Evaluate virtualization security controls, differentiate bare-metal vs hosted hypervisors, and audit OS configuration baselines.",
            "content_markdown": """# IT Components

## 1. Virtualization Architectures
- **Type 1 Hypervisor (Bare-Metal)**: Runs directly on physical hardware (e.g. VMware ESXi, Hyper-V, KVM). Highly performant, enterprise standard.
- **Type 2 Hypervisor (Hosted)**: Runs on top of a host operating system (e.g. VirtualBox, VMware Workstation). Higher latency, testing use.

> 💡 **ISACA / Exam Watch Alert:**
> In virtualized environments, the **GREATEST security risk** is **VM Escape** (where an attacker breaks out of a guest virtual machine to gain control of the host hypervisor and all other co-hosted VMs)."""
        }
    },
    {
        "topic_code": "4A2",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "IT Asset Management",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Hardware and software inventory, software license compliance, end-of-life (EOL) management, and media sanitization (NIST SP 800-88).",
        "subtopic": {
            "title": "IT Asset Management (ITAM), Software Licensing & Media Sanitization",
            "estimated_minutes": 20,
            "key_concepts": ["ITAM Inventory", "Software License Compliance", "End-of-Life (EOL) Risks", "NIST SP 800-88 Media Sanitization"],
            "learning_objectives": "Audit IT asset inventories, prevent software license non-compliance, and enforce NIST SP 800-88 media disposal standards.",
            "content_markdown": """# IT Asset Management (ITAM)

## 1. Asset Lifecycle & Media Sanitization (NIST SP 800-88)
- **Clear**: Overwriting storage space with non-sensitive data.
- **Purge**: Cryptographic erase or degaussing (makes recovery infeasible with laboratory tools).
- **Destroy**: Physical shredding, incineration, or disintegration.

> 💡 **ISACA / Exam Watch Alert:**
> When decommissioning magnetic hard drives containing confidential or regulated data, **Degaussing followed by Physical Destruction (shredding)** provides the highest assurance of data destruction."""
        }
    },
    {
        "topic_code": "4A3",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Job Scheduling and Production Process Automation",
        "part": "A",
        "sort_order": 3,
        "content_summary": "Batch processing, job scheduling tools, automated error handling, and restart/recovery controls.",
        "subtopic": {
            "title": "Automated Job Scheduling, Batch Processing & Exception Handling",
            "estimated_minutes": 15,
            "key_concepts": ["Automated Job Schedulers", "Batch Processing Controls", "Job Abends & Restarts", "Operator Overrides"],
            "learning_objectives": "Audit job scheduling systems, evaluate batch processing error handling, and monitor operator override logs.",
            "content_markdown": """# Job Scheduling and Production Process Automation

## 1. Automated Scheduling Controls
- Automated job schedulers execute batch workloads based on predefined calendar triggers and dependency chains.
- **Abnormal End (Abend) Handling**: Automated alerts and checkpoint-restart procedures to prevent duplicate processing upon failure.

> 💡 **ISACA / Exam Watch Alert:**
> When an operator manually overrides or restarts a failed production batch job, the **MOST critical control** is logging the override and requiring **independent supervisory approval**."""
        }
    },
    {
        "topic_code": "4A4",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "System Interfaces",
        "part": "A",
        "sort_order": 4,
        "content_summary": "API security, middleware architecture, electronic data interchange (EDI), and interface reconciliations.",
        "subtopic": {
            "title": "System Interfaces, API Security & Automated Reconciliations",
            "estimated_minutes": 20,
            "key_concepts": ["API Security & OAuth", "System Interfaces & Middleware", "Interface Reconciliations", "Electronic Data Interchange (EDI)"],
            "learning_objectives": "Audit API and system interfaces, verify automated interface reconciliations, and evaluate middleware security.",
            "content_markdown": """# System Interfaces & Middleware

## 1. Interface Controls & Reconciliations
- Systems exchanging data must implement automated **file transfer reconciliations** (record counts, hash totals, control totals).
- **API Security**: Authentication via OAuth 2.0 / mTLS, rate limiting, and input validation to prevent API injection attacks.

> 💡 **ISACA / Exam Watch Alert:**
> To ensure data completeness and integrity across automated system interfaces, organizations must implement **automated end-to-end reconciliation routines (hash totals and record counts)**."""
        }
    },
    {
        "topic_code": "4A5",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Shadow IT and End-User Computing (EUC)",
        "part": "A",
        "sort_order": 5,
        "content_summary": "Spreadsheet risks, low-code/no-code platforms, unapproved SaaS tools, and EUC governance controls.",
        "subtopic": {
            "title": "End-User Computing (EUC), Spreadsheet Controls & Shadow IT",
            "estimated_minutes": 20,
            "key_concepts": ["End-User Computing (EUC)", "Shadow IT & Cloud Discovery", "Spreadsheet Governance (Cell Locking, Formula Validation)"],
            "learning_objectives": "Identify Shadow IT risks, establish End-User Computing governance, and audit critical spreadsheet models.",
            "content_markdown": """# Shadow IT and End-User Computing (EUC)

## 1. End-User Computing (EUC) Risks
- EUC applications (e.g. complex financial spreadsheets, MS Access databases, low-code tools) are created by business users outside formal IT governance.
- **Risks**: Lack of version control, missing audit trails, hardcoded logic errors, unencrypted storage, and no disaster recovery.

> 💡 **ISACA / Exam Watch Alert:**
> For critical financial spreadsheets used in financial reporting, the **GREATEST risk is lack of access controls and formula validation**, allowing unauthorized, undetected modifications."""
        }
    },
    {
        "topic_code": "4A6",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Systems Availability and Capacity Management",
        "part": "A",
        "sort_order": 6,
        "content_summary": "Capacity planning, performance monitoring, load balancing, clustering, and high availability architectures.",
        "subtopic": {
            "title": "Capacity Management, High Availability & Performance Monitoring",
            "estimated_minutes": 20,
            "key_concepts": ["Capacity Planning", "High Availability (HA)", "Clustering & Load Balancing", "Failover Testing"],
            "learning_objectives": "Audit capacity management forecasts, evaluate load-balancing and clustering setups, and review availability SLAs.",
            "content_markdown": """# Systems Availability and Capacity Management

## 1. Capacity Planning vs. Availability Management
- **Capacity Management**: Projects future business growth and technology resource demands (CPU, RAM, storage, network bandwidth) to prevent bottlenecks.
- **High Availability (HA)**: Architecture design (active-active clustering, redundant power supplies) minimizing single points of failure.

> 💡 **ISACA / Exam Watch Alert:**
> In capacity planning, the **PRIMARY objective** is ensuring IT computing resources align with projected future business workload demands while preventing unexpected service degradation."""
        }
    },
    {
        "topic_code": "4A7",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Problem and Incident Management",
        "part": "A",
        "sort_order": 7,
        "content_summary": "Incident management (rapid restoration) vs Problem management (root cause analysis), ITIL frameworks, and known error databases.",
        "subtopic": {
            "title": "ITIL Incident vs Problem Management & Root Cause Analysis (RCA)",
            "estimated_minutes": 20,
            "key_concepts": ["Incident Management (Rapid Restore)", "Problem Management (Root Cause)", "Known Error Database (KEDB)", "ITIL Service Desk"],
            "learning_objectives": "Distinguish incident management from problem management and evaluate Root Cause Analysis (RCA) procedures.",
            "content_markdown": """# Problem and Incident Management

## 1. Incident vs. Problem Management (ITIL)

| Dimension | Incident Management | Problem Management |
| :--- | :--- | :--- |
| **Primary Goal** | **Restore normal service operation as quickly as possible** (minimize downtime). | **Identify the underlying root cause** of incidents to prevent recurrence. |
| **Time Horizon** | Immediate / Reactive | Long-term / Analytical & Proactive |
| **Output** | Workarounds, incident resolution logs. | Root Cause Analysis (RCA), Known Error Database (KEDB) entries. |

> 💡 **ISACA / Exam Watch Alert:**
> **Incident Management = RESTORE SERVICE FAST**.
> **Problem Management = FIND AND FIX THE ROOT CAUSE**."""
        }
    },
    {
        "topic_code": "4A8",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "IT Change, Configuration, and Patch Management",
        "part": "A",
        "sort_order": 8,
        "content_summary": "Change approval workflows, configuration baselines (CMDB), vulnerability patching cycles, and rollback procedures.",
        "subtopic": {
            "title": "Change Advisory Board (CAB), CMDB & Vulnerability Patch Management",
            "estimated_minutes": 25,
            "key_concepts": ["Change Advisory Board (CAB)", "Configuration Management Database (CMDB)", "Patch Management Lifecycle", "Emergency Changes"],
            "learning_objectives": "Audit change management workflows, verify CMDB accuracy, and evaluate patch testing and deployment cycles.",
            "content_markdown": """# IT Change, Configuration, and Patch Management

## 1. Patch Management Lifecycle
1. **Identify & Assess**: Scan systems and monitor vendor security advisories (CVEs).
2. **Acquire & Test**: Test patches in a dedicated staging/test environment to verify stability.
3. **Approve (CAB)**: Submit change request to the Change Advisory Board.
4. **Deploy**: Roll out patch during approved maintenance windows.
5. **Verify**: Rescan systems to confirm vulnerability remediation.

> 💡 **ISACA / Exam Watch Alert:**
> Applying security patches directly to production servers without **prior testing in a staging environment** represents a critical operational risk that could cause widespread system outages."""
        }
    },
    {
        "topic_code": "4A9",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Operational Log Management",
        "part": "A",
        "sort_order": 9,
        "content_summary": "System logs, log retention policies, time synchronization (NTP), immutable log storage (WORM), and log analysis.",
        "subtopic": {
            "title": "Operational Log Governance, NTP Synchronization & Immutable Storage",
            "estimated_minutes": 20,
            "key_concepts": ["Network Time Protocol (NTP)", "Log Retention & Storage", "Write-Once-Read-Many (WORM)", "Log Integrity (Hashing)"],
            "learning_objectives": "Establish log management policies, ensure NTP time synchronization across all servers, and protect log integrity.",
            "content_markdown": """# Operational Log Management

## 1. Network Time Protocol (NTP) Synchronization
- All network devices, servers, and databases must synchronize clocks to a trusted central **NTP source**.
- **Reason**: Without synchronized timestamps, forensic log correlation during an incident investigation is legally and technically impossible.

> 💡 **ISACA / Exam Watch Alert:**
> The **PRIMARY reason** for implementing **Network Time Protocol (NTP)** across all enterprise systems is to ensure **accurate timestamp correlation during incident investigations and log analysis**."""
        }
    },
    {
        "topic_code": "4A10",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "IT Service Level Management",
        "part": "A",
        "sort_order": 10,
        "content_summary": "Service Level Agreements (SLAs), Operational Level Agreements (OLAs), Underpinning Contracts (UCs), and penalty structures.",
        "subtopic": {
            "title": "SLAs, OLAs, Underpinning Contracts & Service Review Cycles",
            "estimated_minutes": 20,
            "key_concepts": ["Service Level Agreement (SLA)", "Operational Level Agreement (OLA)", "Underpinning Contract (UC)", "Service Review"],
            "learning_objectives": "Distinguish external SLAs from internal OLAs and vendor Underpinning Contracts, and audit service level performance.",
            "content_markdown": """# IT Service Level Management

## 1. SLA vs. OLA vs. Underpinning Contract (UC)
- **Service Level Agreement (SLA)**: Agreement between IT service provider and the **external business customer**.
- **Operational Level Agreement (OLA)**: Internal agreement between **internal IT departments** (e.g. Network team and Database team).
- **Underpinning Contract (UC)**: Contract between IT and a **third-party external vendor**.

> 💡 **ISACA / Exam Watch Alert:**
> An **OLA** is an internal agreement between internal departments to support the overarching customer **SLA**."""
        }
    },
    {
        "topic_code": "4A11",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Database Management",
        "part": "A",
        "sort_order": 11,
        "content_summary": "Relational vs NoSQL databases, database integrity constraints (ACID), DBA privileged controls, and database activity monitoring (DAM).",
        "subtopic": {
            "title": "Database Architecture, ACID Properties & DBA Activity Monitoring",
            "estimated_minutes": 20,
            "key_concepts": ["Relational vs NoSQL", "ACID Properties (Atomicity, Consistency, Isolation, Durability)", "DBA Privileges", "Database Activity Monitoring (DAM)"],
            "learning_objectives": "Audit database integrity constraints (ACID), monitor privileged DBA access, and evaluate database security controls.",
            "content_markdown": """# Database Management & Administration

## 1. Database Integrity & ACID Properties
- **Atomicity**: All parts of a transaction succeed, or the entire transaction is rolled back.
- **Consistency**: Database transitions from one valid state to another, preserving integrity constraints.
- **Isolation**: Concurrent transactions execute without interfering with one another.
- **Durability**: Committed transactions are permanently saved and will not be lost during crashes.

> 💡 **ISACA / Exam Watch Alert:**
> Because DBAs hold unrestricted access to production databases, implementing **independent Database Activity Monitoring (DAM)** and immutable audit logging is the BEST control to detect unauthorized DBA activities."""
        }
    },
    {
        "topic_code": "4B1",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Business Impact Analysis (BIA)",
        "part": "B",
        "sort_order": 12,
        "content_summary": "BIA methodologies, identifying critical business functions, Maximum Tolerable Downtime (MTD), RTO, RPO, and Work Recovery Time (WRT).",
        "subtopic": {
            "title": "BIA Methodology & Core Resilience Metrics (MTD, RTO, RPO, WRT)",
            "estimated_minutes": 25,
            "key_concepts": ["Business Impact Analysis (BIA)", "Maximum Tolerable Downtime (MTD)", "Recovery Time Objective (RTO)", "Recovery Point Objective (RPO)", "Work Recovery Time (WRT)"],
            "learning_objectives": "Conduct a Business Impact Analysis (BIA), calculate MTD, RTO, and RPO, and establish technical recovery targets.",
            "content_markdown": """# Business Impact Analysis (BIA) & Resilience Metrics

## 1. Core Resilience Metrics

$$\\text{Maximum Tolerable Downtime (MTD)} \\ge \\text{Recovery Time Objective (RTO)} + \\text{Work Recovery Time (WRT)}$$

| Metric | Definition | Focus |
| :--- | :--- | :--- |
| **Maximum Tolerable Downtime (MTD)** | The absolute maximum time a business process can be inoperable before the organization suffers irrecoverable harm. | **Business Survival** |
| **Recovery Time Objective (RTO)** | The target time within which systems, applications, and networks must be restored and functioning. | **Technical Recovery Time** |
| **Recovery Point Objective (RPO)** | The maximum acceptable amount of data loss resulting from an outage, measured in time. | **Data Loss Tolerance** |
| **Work Recovery Time (WRT)** | The time required to verify data integrity, enter backlog data, and return to normal operations after systems are restored. | **Operational Catch-up** |

> 💡 **ISACA / Exam Watch Alert:**
> The **BIA MUST be completed FIRST** before developing Disaster Recovery Plans or selecting recovery sites. You cannot choose a recovery strategy until the business determines its RTO, RPO, and MTD."""
        }
    },
    {
        "topic_code": "4B2",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "System and Operational Resilience",
        "part": "B",
        "sort_order": 13,
        "content_summary": "High availability architectures, N+1 and 2N redundancy, active-active vs active-passive failover, and RAID arrays.",
        "subtopic": {
            "title": "Operational Resilience, Active-Active Failover & RAID Storage",
            "estimated_minutes": 20,
            "key_concepts": ["System Resilience", "Active-Active vs Active-Passive", "N+1 / 2N Redundancy", "RAID Levels (RAID 0, 1, 5, 6, 10)"],
            "learning_objectives": "Evaluate system redundancy architectures, compare active-active vs active-passive failover, and select RAID configurations.",
            "content_markdown": """# System and Operational Resilience

## 1. RAID Configurations (Redundant Array of Independent Disks)
- **RAID 0 (Striping)**: Performance only; **NO redundancy** (failure of 1 disk loses all data).
- **RAID 1 (Mirroring)**: Complete copy of data on second disk. High redundancy; 50% capacity overhead.
- **RAID 5 (Striping with Distributed Parity)**: Requires min. 3 disks; can survive 1 disk failure.
- **RAID 6 (Dual Parity)**: Requires min. 4 disks; can survive **2 simultaneous disk failures**.
- **RAID 10 (1+0 Striped Mirrors)**: High performance and high redundancy.

> 💡 **ISACA / Exam Watch Alert:**
> **RAID is NOT a backup!** RAID protects against physical hard drive failure, but does NOT protect against accidental deletion, ransomware encryption, or corrupted database writes."""
        }
    },
    {
        "topic_code": "4B3",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Data Backup, Storage, and Restoration",
        "part": "B",
        "sort_order": 14,
        "content_summary": "Full, differential, and incremental backups; continuous data protection (CDP); 3-2-1 backup rule; and restoration testing.",
        "subtopic": {
            "title": "Backup Strategies: Full, Incremental, Differential & 3-2-1 Rule",
            "estimated_minutes": 25,
            "key_concepts": ["Full Backup", "Differential Backup", "Incremental Backup", "Continuous Data Protection (CDP)", "3-2-1 Backup Rule", "Restoration Testing"],
            "learning_objectives": "Compare backup methodologies, audit compliance with the 3-2-1 backup rule, and verify periodic restoration testing.",
            "content_markdown": """# Data Backup, Storage, and Restoration

## 1. Backup Methodologies Compared

| Backup Type | What is Backed Up | Backup Time | Restoration Time | Archive Bit Status |
| :--- | :--- | :--- | :--- | :--- |
| **Full Backup** | All data in the system. | Slowest | Fastest (1 full backup restored) | Cleared (reset to 0) |
| **Differential Backup** | All data changed **since the LAST FULL backup**. | Moderate | Fast (Full + Latest Differential) | **NOT cleared** |
| **Incremental Backup** | All data changed **since the LAST BACKUP (Full or Incremental)**. | Fastest | Slowest (Full + All Incremental sets in order) | Cleared (reset to 0) |

## 2. The 3-2-1 Backup Rule
- **3** copies of critical data.
- **2** different media types (e.g. disk and cloud/tape).
- **1** copy stored **off-site / in an immutable cloud vault**.

> 💡 **ISACA / Exam Watch Alert:**
> A backup program is worthless without **periodic restoration testing**. An IS auditor should verify that backup media are periodically test-restored to an isolated test environment to confirm data integrity."""
        }
    },
    {
        "topic_code": "4B4",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Business Continuity Plan (BCP)",
        "part": "B",
        "sort_order": 15,
        "content_summary": "BCP development life cycle, crisis management teams, emergency communication plans, and supply chain continuity.",
        "subtopic": {
            "title": "Business Continuity Plan (BCP) Development & Crisis Governance",
            "estimated_minutes": 20,
            "key_concepts": ["Business Continuity Plan (BCP)", "Crisis Management Team (CMT)", "Emergency Operations Center (EOC)", "Call Trees"],
            "learning_objectives": "Develop and audit Business Continuity Plans, establish crisis communication hierarchies, and test BCP governance.",
            "content_markdown": """# Business Continuity Plan (BCP)

## 1. BCP Development Life Cycle
1. **Project Initiation & Policy**: Executive charter and committee formation.
2. **Business Impact Analysis (BIA)**: Quantify impacts and establish MTD/RTO/RPO.
3. **Recovery Strategy Formulation**: Select alternate facilities and resources.
4. **Plan Development**: Document crisis playbooks, call trees, and operational workarounds.
5. **Testing & Maintenance**: Conduct drills, update contact lists, and perform annual reviews.

> 💡 **ISACA / Exam Watch Alert:**
> In any crisis or disaster scenario, the **NUMBER ONE PRIORITY is always LIFE SAFETY (personnel safety and evacuation)**, before attempting system recovery or asset preservation."""
        }
    },
    {
        "topic_code": "4B5",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "domain_num": 4,
        "name": "Disaster Recovery Plans (DRP)",
        "part": "B",
        "sort_order": 16,
        "content_summary": "Disaster recovery site types (Hot, Warm, Cold, Mobile, Cloud), testing methodologies (Tabletop, Parallel, Full Interruption), and failback.",
        "subtopic": {
            "title": "DR Sites (Hot, Warm, Cold) & DRP Testing Methodologies",
            "estimated_minutes": 25,
            "key_concepts": ["Hot Site vs Warm Site vs Cold Site", "Tabletop / Structured Walkthrough", "Parallel Testing", "Full Interruption Testing", "Failback"],
            "learning_objectives": "Compare disaster recovery site types, evaluate DRP testing methodologies, and audit failback procedures.",
            "content_markdown": """# Disaster Recovery Plans (DRP) & Alternative Sites

## 1. Alternative Recovery Sites

| Site Type | Hardware Present? | Data Replicated? | RTO / Recovery Speed | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Hot Site** | Fully equipped and powered | Real-time continuous replication | **Minutes to Hours** (Near instant) | Highest |
| **Warm Site** | Hardware present; requires config | Periodic backups shipped/loaded | **Hours to Days** (1-3 days) | Medium |
| **Cold Site** | Space, power, HVAC only (no hardware) | None on site (must procure/install) | **Weeks** | Lowest |
| **Mobile Site** | Trailer/modular container with gear | Configurable on demand | Days to Weeks | Medium |

## 2. DRP Testing Methodologies Hierarchy
1. **Checklist Review / Desk Check**: Reviewing the document for completeness.
2. **Structured Walkthrough (Tabletop)**: Team walks through a scenario in a conference room.
3. **Simulation Test**: Simulated disaster with operational staff executing responses (no production impact).
4. **Parallel Test**: Secondary systems brought online and transactions processed in parallel with production (no production downtime).
5. **Full Interruption (Cutover) Test**: Live production is shut down and operations fail over completely to the DR site (HIGHEST RISK).

> 💡 **ISACA / Exam Watch Alert:**
> A **Parallel Test** is the MOST effective testing method that provides comprehensive operational validation **WITHOUT risking disruption to live production operations**."""
        }
    },

    # =========================================================================
    # DOMAIN 5: Protection of Information Assets (26% — 15 Topics)
    # =========================================================================
    {
        "topic_code": "5A1",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Information Asset Security Policies, Frameworks, Standards, and Guidelines",
        "part": "A",
        "sort_order": 1,
        "content_summary": "NIST Cybersecurity Framework (CSF 2.0), ISO/IEC 27001/27002, Center for Internet Security (CIS) controls, and security governance.",
        "subtopic": {
            "title": "Information Security Frameworks: NIST CSF 2.0 & ISO/IEC 27001",
            "estimated_minutes": 20,
            "key_concepts": ["NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover)", "ISO/IEC 27001 (ISMS)", "ISO/IEC 27002", "CIS Benchmarks"],
            "learning_objectives": "Compare NIST CSF 2.0 with ISO 27001, implement security governance frameworks, and audit security control baselines.",
            "content_markdown": """# Information Asset Security Policies & Frameworks

## 1. NIST Cybersecurity Framework (CSF 2.0)
NIST CSF 2.0 organizes cybersecurity activities into 6 core functions:
1. **Govern (GV)**: Cybersecurity strategy, risk governance, and supply chain management.
2. **Identify (ID)**: Asset discovery, risk assessment, and vulnerability tracking.
3. **Protect (PR)**: IAM, data security, awareness training, and maintenance.
4. **Detect (DE)**: Continuous monitoring, log correlation, and anomaly detection.
5. **Respond (RS)**: Incident mitigation, communication, and containment.
6. **Recover (RC)**: Resilience restoration and post-incident improvements.

> 💡 **ISACA / Exam Watch Alert:**
> **ISO/IEC 27001** specifies requirements for establishing, implementing, maintaining, and certifying an **Information Security Management System (ISMS)**."""
        }
    },
    {
        "topic_code": "5A2",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Physical and Environmental Controls",
        "part": "A",
        "sort_order": 2,
        "content_summary": "Data center perimeters, mantrap / airlock doors, CCTV, HVAC, fire suppression (clean agent vs pre-action water), and UPS power.",
        "subtopic": {
            "title": "Data Center Physical Security, Fire Suppression & Environmental Controls",
            "estimated_minutes": 20,
            "key_concepts": ["Mantrap (Airlock)", "Clean Agent Fire Suppression", "Pre-Action Dry-Pipe Sprinklers", "UPS & Backup Generators", "HVAC Temperature/Humidity"],
            "learning_objectives": "Audit data center physical access controls, evaluate clean agent vs pre-action fire suppression systems, and verify power redundancy.",
            "content_markdown": """# Physical and Environmental Controls

## 1. Physical Access Controls & Mantraps
- **Mantrap / Airlock**: A set of two interlocking doors where the first door must close and lock before the second door opens.
- **Purpose**: **Prevents Tailgating / Piggybacking** into high-security data centers.

## 2. Data Center Fire Suppression Systems
- **Clean Agent Systems (e.g. FM-200, Inergen, Novec 1230)**: Gas discharge that extinguishes fire by chemical reaction or oxygen displacement without leaving residue or damaging computing hardware. Safe for personnel.
- **Pre-Action Dry Pipe Water Sprinklers**: Pipes remain dry until two separate triggers occur (heat detector AND smoke detector activation), preventing accidental water leaks on servers.

> 💡 **ISACA / Exam Watch Alert:**
> The primary purpose of a **Mantrap** is to **prevent Tailgating / Piggybacking** into secure facilities. For data centers, **Clean Agent gaseous suppression** or **Pre-Action Dry-Pipe sprinkler systems** are the standard."""
        }
    },
    {
        "topic_code": "5A3",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Identity and Access Management (IAM & PAM)",
        "part": "A",
        "sort_order": 3,
        "content_summary": "Authentication vs authorization, Multi-Factor Authentication (MFA), Privileged Access Management (PAM), RBAC/ABAC, and Zero Trust Architecture (ZTA).",
        "subtopic": {
            "title": "Zero Trust (ZTA), IAM, PAM Vaulting & Multi-Factor Authentication",
            "estimated_minutes": 25,
            "key_concepts": ["Zero Trust Architecture (ZTA)", "Privileged Access Management (PAM)", "Multi-Factor Authentication (MFA)", "RBAC vs ABAC", "Biometrics (FAR vs FRR)"],
            "learning_objectives": "Implement Zero Trust Architecture, audit Privileged Access Management (PAM) vaulting, and evaluate MFA and biometric controls.",
            "content_markdown": """# Identity and Access Management (IAM & PAM)

## 1. Zero Trust Architecture (ZTA)
- Principle: **"Never Trust, Always Verify"**.
- Microsegmentation, continuous per-session authentication, and device posture health validation on every request regardless of network perimeter.

## 2. Multi-Factor Authentication (MFA)
Requires 2 or more distinct factors:
1. **Something You Know**: Password, PIN, passphrase.
2. **Something You Have**: Hardware token, authenticator app, smart card, SMS OTP.
3. **Something You Are**: Fingerprint, retinal scan, facial biometrics.

## 3. Biometric Error Rates
- **False Rejection Rate (FRR / Type I Error)**: Rejects legitimate user (Inconvenience).
- **False Acceptance Rate (FAR / Type II Error)**: Accepts impostor (**Security Vulnerability**).
- **Crossover Error Rate (CER / EER)**: The point where FAR and FRR are equal (The gold standard measure of biometric accuracy; lower CER = more accurate device).

> 💡 **ISACA / Exam Watch Alert:**
> The **Crossover Error Rate (CER)** is the single most important metric for evaluating biometric accuracy. A **LOWER CER** indicates a superior, more accurate biometric device."""
        }
    },
    {
        "topic_code": "5A4",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Network and End-Point Security",
        "part": "A",
        "sort_order": 4,
        "content_summary": "Next-Gen Firewalls (NGFW), IDS/IPS, network segmentation, micro-segmentation, VPNs, and Endpoint Detection and Response (EDR).",
        "subtopic": {
            "title": "Perimeter Defense: NGFW, IDS/IPS, Micro-segmentation & EDR",
            "estimated_minutes": 25,
            "key_concepts": ["Next-Generation Firewall (NGFW)", "IDS (Detective) vs IPS (Preventive)", "DMZ & Micro-segmentation", "Endpoint Detection & Response (EDR)"],
            "learning_objectives": "Compare IDS with IPS, design DMZ and micro-segmented architectures, and evaluate EDR deployment.",
            "content_markdown": """# Network and End-Point Security

## 1. IDS vs. IPS
- **Intrusion Detection System (IDS)**: Passive **DETECTIVE** sensor that monitors traffic, detects anomalies/signatures, and issues alerts without altering traffic.
- **Intrusion Prevention System (IPS)**: In-line **PREVENTIVE** appliance that analyzes packets in real time and automatically drops or blocks malicious packets.

## 2. Network Demilitarized Zone (DMZ)
- A buffer network situated between the public internet and internal trusted corporate network.
- Hosts public-facing servers (Web, reverse proxy, external mail gateway).

> 💡 **ISACA / Exam Watch Alert:**
> Public-facing servers in the DMZ must **NEVER initiate direct database connections to internal database servers**. Instead, application logic servers should broker the transaction."""
        }
    },
    {
        "topic_code": "5A5",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Data Loss Prevention (DLP)",
        "part": "A",
        "sort_order": 5,
        "content_summary": "DLP in motion, DLP at rest, DLP in use (endpoint), regex pattern matching, and exact data matching (EDM).",
        "subtopic": {
            "title": "Data Loss Prevention (DLP) Across Motion, Rest & Endpoint",
            "estimated_minutes": 20,
            "key_concepts": ["DLP in Motion (Network)", "DLP at Rest (Storage)", "DLP in Use (Endpoint)", "Exact Data Matching (EDM)", "Watermarking"],
            "learning_objectives": "Audit Data Loss Prevention implementations across storage, network, and endpoints, and evaluate detection techniques.",
            "content_markdown": """# Data Loss Prevention (DLP)

## 1. DLP Three States of Data
- **Data in Motion (Network DLP)**: Inspects outgoing emails, cloud uploads, and web traffic for sensitive patterns (credit cards, SSNs).
- **Data at Rest (Storage DLP)**: Scans databases, file shares, and cloud storage to discover unencrypted sensitive data.
- **Data in Use (Endpoint DLP)**: Prevents copying sensitive data to USB drives, clipboard sharing, or unauthorized printing.

> 💡 **ISACA / Exam Watch Alert:**
> The **FIRST step in deploying a DLP solution** is performing a comprehensive **data discovery and classification exercise** to identify where sensitive data resides across the enterprise."""
        }
    },
    {
        "topic_code": "5A6",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Data Encryption & Cryptography",
        "part": "A",
        "sort_order": 6,
        "content_summary": "Symmetric encryption (AES), Asymmetric encryption (RSA, ECC), cryptographic hashing (SHA-256), digital signatures, and key management.",
        "subtopic": {
            "title": "Symmetric vs Asymmetric Cryptography, Hashing & Digital Signatures",
            "estimated_minutes": 25,
            "key_concepts": ["Symmetric (AES, ChaCha20)", "Asymmetric (RSA, ECC)", "Hashing (SHA-256, SHA-3)", "Digital Signatures", "Key Custody & KMS"],
            "learning_objectives": "Compare symmetric and asymmetric cryptography, evaluate hashing and digital signatures, and audit cryptographic key management.",
            "content_markdown": """# Data Encryption & Cryptography

## 1. Symmetric vs. Asymmetric Cryptography

| Dimension | Symmetric Encryption | Asymmetric (Public Key) Encryption |
| :--- | :--- | :--- |
| **Keys Used** | **1 shared secret key** (same for encrypt/decrypt). | **2 mathematically paired keys** (Public Key & Private Key). |
| **Speed** | Very Fast (Ideal for bulk data). | Slower (Computationally intensive). |
| **Key Distribution Problem** | High (Must securely transmit shared key). | Solved (Public key is openly distributed). |
| **Algorithms** | AES-256, ChaCha20, 3DES. | RSA, ECC, Diffie-Hellman. |

## 2. Digital Signatures & Non-Repudiation
1. Sender generates a hash of the message.
2. Sender **encrypts the hash with their PRIVATE key** (creating the Digital Signature).
3. Receiver **decrypts the signature with sender's PUBLIC key** and compares hashes.
4. **Guarantees**: Authentication, Data Integrity, and **Non-Repudiation**.

> 💡 **ISACA / Exam Watch Alert:**
> A **Digital Signature** is generated by encrypting a message hash with the **sender's PRIVATE key**. It proves non-repudiation and integrity."""
        }
    },
    {
        "topic_code": "5A7",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Public Key Infrastructure (PKI)",
        "part": "A",
        "sort_order": 7,
        "content_summary": "Certificate Authorities (CA), Registration Authorities (RA), Certificate Revocation Lists (CRL), OCSP, and root key ceremonies.",
        "subtopic": {
            "title": "PKI Architecture: Certificate Authorities, CRL, OCSP & Key Ceremonies",
            "estimated_minutes": 20,
            "key_concepts": ["Certificate Authority (CA)", "Registration Authority (RA)", "Certificate Revocation List (CRL)", "Online Certificate Status Protocol (OCSP)", "Root CA Key Ceremony"],
            "learning_objectives": "Audit PKI components, evaluate certificate revocation protocols (CRL vs OCSP), and verify root CA protection.",
            "content_markdown": """# Public Key Infrastructure (PKI)

## 1. Core PKI Components
- **Certificate Authority (CA)**: Digitally signs and issues digital certificates (X.509 standard).
- **Registration Authority (RA)**: Verifies the identity of certificate applicants before forwarding requests to the CA.
- **Certificate Revocation List (CRL)**: Periodically published list of revoked, invalid certificates.
- **OCSP (Online Certificate Status Protocol)**: Real-time, fast query protocol to check if a specific certificate is revoked.

> 💡 **ISACA / Exam Watch Alert:**
> The **Root Certificate Authority (Root CA)** private key is the ultimate trust anchor of a PKI. It must be generated in an offline **Key Ceremony** and kept in a secure, disconnected Hardware Security Module (HSM) in a physical vault."""
        }
    },
    {
        "topic_code": "5A8",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Cloud and Virtualized Environments",
        "part": "A",
        "sort_order": 8,
        "content_summary": "Cloud service models (IaaS, PaaS, SaaS), Shared Responsibility Model, CASB, container security, and multi-tenancy risks.",
        "subtopic": {
            "title": "Cloud Shared Responsibility Model, CASB & Container Security",
            "estimated_minutes": 25,
            "key_concepts": ["IaaS vs PaaS vs SaaS", "Shared Responsibility Model", "Cloud Access Security Broker (CASB)", "Container & Kubernetes Security", "Multi-Tenancy"],
            "learning_objectives": "Apply the Cloud Shared Responsibility Model across IaaS/PaaS/SaaS, audit CASB controls, and evaluate container security.",
            "content_markdown": """# Cloud and Virtualized Environments

## 1. The Cloud Shared Responsibility Model

| Cloud Model | Customer Manages | Cloud Provider (CSP) Manages |
| :--- | :--- | :--- |
| **IaaS (Infrastructure)** | **OS, Middleware, Runtime, Apps, Data, IAM, Network config**. | Physical hardware, data center, virtualization hypervisor. |
| **PaaS (Platform)** | **Applications, Data, IAM, App config**. | Physical infrastructure, OS, database engine, runtime patches. |
| **SaaS (Software)** | **Data, User access (IAM), Configuration**. | Entire application stack, code, infrastructure, and updates. |

> 💡 **ISACA / Exam Watch Alert:**
> In **ALL cloud models (IaaS, PaaS, SaaS)**, the **CUSTOMER is ALWAYS responsible for their DATA classification and ACCESS MANAGEMENT (IAM)**. The cloud provider never owns customer data liability."""
        }
    },
    {
        "topic_code": "5A9",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Mobile, Wireless, and Internet-of-Things (IoT) Devices",
        "part": "A",
        "sort_order": 9,
        "content_summary": "Mobile Device Management (MDM), BYOD policies, WPA3 Enterprise wireless security, and IoT/OT/SCADA isolation.",
        "subtopic": {
            "title": "MDM / BYOD Governance, WPA3 Enterprise & IoT/SCADA Security",
            "estimated_minutes": 20,
            "key_concepts": ["Mobile Device Management (MDM)", "BYOD Containerization", "WPA3 Enterprise (802.1X / RADIUS)", "IoT & SCADA Network Isolation"],
            "learning_objectives": "Audit Mobile Device Management (MDM) solutions, enforce BYOD security policies, and evaluate WPA3 Enterprise and IoT isolation.",
            "content_markdown": """# Mobile, Wireless & IoT Security

## 1. Mobile & BYOD Security
- **Mobile Device Management (MDM)**: Enforces device encryption, complex screen-lock PINs, OS updates, remote wipe capabilities, and prevents jailbreaking/rooting.
- **Containerization**: Separates corporate encrypted email/data from personal apps on employee-owned devices.

## 2. Wireless & IoT Security
- **WPA3 Enterprise**: Uses 802.1X authentication with central RADIUS servers and individual credentials (replaces shared pre-shared keys).
- **IoT / OT Isolation**: IoT sensors and SCADA industrial controllers must reside on dedicated, isolated VLANs with no direct outbound internet access.

> 💡 **ISACA / Exam Watch Alert:**
> When an employee's mobile device containing company data is reported lost or stolen, the **FIRST action** the organization should take is to **execute a remote wipe command** via the MDM platform."""
        }
    },
    {
        "topic_code": "5B1",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Security Awareness Training and Programs",
        "part": "B",
        "sort_order": 10,
        "content_summary": "Security awareness culture, simulated phishing campaigns, role-based security training, and social engineering defenses.",
        "subtopic": {
            "title": "Security Awareness Programs, Simulated Phishing & Human Risk",
            "estimated_minutes": 15,
            "key_concepts": ["Security Awareness Training", "Simulated Phishing Exercises", "Role-Based Training (Devs, Execs)", "Social Engineering Defenses"],
            "learning_objectives": "Design and audit security awareness training programs, measure training efficacy via simulated phishing, and mitigate social engineering.",
            "content_markdown": """# Security Awareness Training and Programs

## 1. Security Awareness Programs
- Employees are the first and last line of defense against social engineering, phishing, and business email compromise (BEC).
- **Efficacy Measurement**: Running periodic **simulated phishing campaigns** with immediate just-in-time micro-training for users who fail tests.

> 💡 **ISACA / Exam Watch Alert:**
> The most effective way to measure the **effectiveness of security awareness training** is through **unannounced simulated phishing tests and monitoring real-time employee reporting rates**."""
        }
    },
    {
        "topic_code": "5B2",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Information System Attack Methods and Techniques",
        "part": "B",
        "sort_order": 11,
        "content_summary": "Ransomware, Man-in-the-Middle (MitM), SQL Injection (SQLi), Cross-Site Scripting (XSS), Zero-Day exploits, and supply chain attacks.",
        "subtopic": {
            "title": "Attack Vectors: Ransomware, SQLi, XSS, MitM & Supply Chain Exploits",
            "estimated_minutes": 25,
            "key_concepts": ["Ransomware Mitigation", "SQL Injection (SQLi)", "Cross-Site Scripting (XSS)", "Man-in-the-Middle (MitM)", "Zero-Day Exploits"],
            "learning_objectives": "Analyze modern cyber attack techniques, evaluate web application vulnerabilities (SQLi, XSS), and audit defenses.",
            "content_markdown": """# Information System Attack Methods and Techniques

## 1. Web Application Attacks (OWASP Top 10)
- **SQL Injection (SQLi)**: Attacker inserts malicious SQL code into unvalidated input fields to read/modify database tables.
  - *Best Defense*: **Parameterized queries / Prepared statements** and input validation.
- **Cross-Site Scripting (XSS)**: Attacker injects malicious client-side JavaScript into a trusted web page viewed by other users.
  - *Best Defense*: **Context-aware output encoding** and Content Security Policy (CSP).

> 💡 **ISACA / Exam Watch Alert:**
> The **PRIMARY control to prevent SQL Injection** is using **Parameterized Queries (Prepared Statements)** with strict server-side input validation."""
        }
    },
    {
        "topic_code": "5B3",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Security Testing Tools and Techniques",
        "part": "B",
        "sort_order": 12,
        "content_summary": "Vulnerability assessments vs penetration testing (Black/White/Gray box), red teaming, and bug bounty programs.",
        "subtopic": {
            "title": "Vulnerability Assessments vs Penetration Testing & Red Teaming",
            "estimated_minutes": 20,
            "key_concepts": ["Vulnerability Scanning (Automated)", "Penetration Testing (Exploitation)", "Black Box vs White Box vs Gray Box", "Rules of Engagement (RoE)"],
            "learning_objectives": "Compare vulnerability scanning with penetration testing, establish Rules of Engagement, and review penetration test findings.",
            "content_markdown": """# Security Testing Tools and Techniques

## 1. Vulnerability Assessment vs. Penetration Testing
- **Vulnerability Assessment**: Automated scanning to identify known security weaknesses (CVEs) and missing patches; does NOT actively exploit vulnerabilities.
- **Penetration Testing**: Ethical hackers actively **exploit** vulnerabilities to determine how far an attacker can penetrate internal networks.

## 2. Penetration Test Types
- **Black Box**: Tester has zero prior knowledge of internal network architecture.
- **White Box**: Tester has full access to source code, network diagrams, and credentials.
- **Gray Box**: Tester has partial knowledge (e.g. user-level credentials).

> 💡 **ISACA / Exam Watch Alert:**
> Before conducting any penetration test, the **FIRST step is obtaining formal written authorization and establishing Rules of Engagement (RoE)** signed by senior executive management."""
        }
    },
    {
        "topic_code": "5B4",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Security Monitoring Logs, Tools, and Techniques (SIEM/SOAR)",
        "part": "B",
        "sort_order": 13,
        "content_summary": "SIEM log correlation, SOAR automated playbooks, Security Operations Center (SOC), User and Entity Behavior Analytics (UEBA), and Threat Hunting.",
        "subtopic": {
            "title": "SIEM Log Aggregation, SOAR Playbook Automation & UEBA",
            "estimated_minutes": 20,
            "key_concepts": ["Security Information & Event Management (SIEM)", "Security Orchestration, Automation & Response (SOAR)", "UEBA Anomaly Detection", "SOC Operations"],
            "learning_objectives": "Audit SIEM log correlation architectures, evaluate SOAR automated playbooks, and analyze UEBA behavioral baselines.",
            "content_markdown": """# Security Monitoring Logs, Tools & Techniques (SIEM/SOAR)

## 1. SIEM & SOAR Architecture
- **SIEM (Security Information and Event Management)**: Centralizes, normalizes, and correlates real-time security event logs across firewalls, servers, and endpoint agents.
- **SOAR (Security Orchestration, Automation and Response)**: Automatically executes predefined playbooks (e.g., automatically isolating an infected host on the network) to reduce Mean Time to Respond (MTTR).

> 💡 **ISACA / Exam Watch Alert:**
> The primary benefit of **SOAR** over traditional SIEM is **automated playbook execution**, allowing instant automated threat containment without waiting for manual human triage."""
        }
    },
    {
        "topic_code": "5B5",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Security Incident Response Management",
        "part": "B",
        "sort_order": 14,
        "content_summary": "NIST SP 800-61 incident response lifecycle (Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity), and CSIRT.",
        "subtopic": {
            "title": "NIST Incident Response Lifecycle: Containment, Eradication & Recovery",
            "estimated_minutes": 25,
            "key_concepts": ["NIST SP 800-61 Lifecycle", "CSIRT Team", "Containment (Short vs Long Term)", "Eradication & Recovery", "Lessons Learned Review"],
            "learning_objectives": "Execute the NIST incident response lifecycle, evaluate containment strategies, and audit post-incident lessons learned reviews.",
            "content_markdown": """# Security Incident Response Management

## 1. NIST SP 800-61 Incident Response Lifecycle
1. **Preparation**: Form CSIRT, create playbooks, deploy tools, conduct training.
2. **Detection & Analysis**: Identify indicators of compromise (IoCs), determine scope.
3. **Containment, Eradication & Recovery**:
   - *Containment*: Isolate affected systems to stop breach spread.
   - *Eradication*: Remove malware, patch vulnerabilities, reset compromised passwords.
   - *Recovery*: Restore systems from clean backups and validate integrity.
4. **Post-Incident Activity (Lessons Learned)**: Conduct retrospective within 2 weeks to update policies and improve playbooks.

> 💡 **ISACA / Exam Watch Alert:**
> Once an active security breach is confirmed, the **FIRST operational priority is CONTAINMENT** (isolating affected systems to prevent lateral movement and data exfiltration)."""
        }
    },
    {
        "topic_code": "5B6",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "domain_num": 5,
        "name": "Evidence Collection and Forensics (Chain of Custody)",
        "part": "B",
        "sort_order": 15,
        "content_summary": "Digital forensics principles, Order of Volatility (RFC 3227), write blockers, bit-stream disk imaging, and Chain of Custody documentation.",
        "subtopic": {
            "title": "Digital Forensics: Order of Volatility, Bit-Stream Imaging & Chain of Custody",
            "estimated_minutes": 25,
            "key_concepts": ["Order of Volatility (RFC 3227)", "Bit-Stream Forensic Imaging", "Hardware Write-Blockers", "Chain of Custody", "Hash Verification (MD5/SHA-256)"],
            "learning_objectives": "Apply the forensic Order of Volatility, capture bit-stream disk images using write blockers, and maintain an unbroken Chain of Custody.",
            "content_markdown": """# Evidence Collection and Forensics (Chain of Custody)

## 1. The Forensic Order of Volatility (RFC 3227)
When capturing digital evidence from a running computer, evidence must be collected starting from the **most volatile to least volatile**:

```
MOST VOLATILE (Captures First)
 ▲  [1. CPU Registers and Cache]
 │  [2. System Routing Tables, ARP Cache, Process Tables, Kernel Memory]
 │  [3. Main RAM (Random Access Memory)]
 │  [4. Temporary File Systems / Swap Space]
 │  [5. Hard Disks, SSDs, Storage Media]
 │  [6. Remote Log Data & Network Configurations]
 ▼  [7. Archival Tapes & Physical Printouts]
LEAST VOLATILE (Captures Last)
```

## 2. Forensic Best Practices
- **Bit-Stream Disk Image**: An exact bit-by-bit physical copy of the storage media, including unallocated slack space and deleted file fragments.
- **Hardware Write-Blocker**: Prevents any write operations to the suspect drive during imaging.
- **Hash Verification**: Generating cryptographic hashes (SHA-256) of the original drive and the forensic clone; identical hashes prove the evidence was not altered.
- **Chain of Custody**: A chronological log documenting who seized, possessed, transferred, analyzed, and secured the evidence.

> 💡 **ISACA / Exam Watch Alert:**
> A forensic investigator must **NEVER analyze or boot the original suspect storage media**! Analysis must ALWAYS be performed on a verified **bit-stream copy (forensic image)** captured using a **hardware write-blocker**."""
        }
    }
]

print(f"Total topics to write: {len(ALL_TOPICS)}")

# Format topics and subtopics for export
topics_export = []
subtopics_export = []

for t in ALL_TOPICS:
    topics_export.append({
        "domain_id": t["domain_id"],
        "topic_code": t["topic_code"],
        "name": t["name"],
        "part": t["part"],
        "sort_order": t["sort_order"],
        "content_summary": t["content_summary"]
    })
    
    subtopics_export.append({
        "topic_code": t["topic_code"],
        "subtopic_code": f"{t['topic_code']}.1",
        "title": t["subtopic"]["title"],
        "estimated_minutes": t["subtopic"]["estimated_minutes"],
        "sort_order": 1,
        "key_concepts": t["subtopic"]["key_concepts"],
        "learning_objectives": t["subtopic"]["learning_objectives"],
        "content_markdown": t["subtopic"]["content_markdown"]
    })

with open(os.path.join(DATA_DIR, "topics.json"), "w", encoding="utf-8") as f:
    json.dump(topics_export, f, indent=2)

with open(os.path.join(DATA_DIR, "subtopics.json"), "w", encoding="utf-8") as f:
    json.dump(subtopics_export, f, indent=2)

print(f"Saved {len(topics_export)} canonical topics and {len(subtopics_export)} in-depth lessons with Exam Watch Alerts.")
