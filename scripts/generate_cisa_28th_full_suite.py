import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

# =====================================================================
# 1. CASE STUDIES & CASE STUDY QUESTIONS (Official 28th Edition)
# =====================================================================

CASE_STUDIES = [
    {
        "id": "c0000000-0000-0000-0000-000000000001",
        "domain_id": "d0000000-0000-0000-0000-000000000001",
        "title": "Case Study: Betatronics — IS Audit Planning, Sampling & CAATs",
        "scenario": """Betatronics is a mid-sized global manufacturer of industrial electronics with headquarters in Chicago and manufacturing facilities across Europe and Asia. The internal audit department has recently completed its annual risk assessment and is preparing the IS audit plan for the upcoming fiscal year.

During the preliminary survey of the automated enterprise inventory and procurement system (AutoProcure), the IS audit team noted the following:
1. AutoProcure processes over $850 million in automated purchase orders and supplier disbursements annually.
2. The system was customized three years ago by an internal development team led by a software engineer who is now an IS audit specialist on the current audit team.
3. The internal audit charter was last reviewed and signed by the Chief Financial Officer (CFO) four years ago; it does not mention the Audit Committee.
4. Management asserts that control testing can be minimized because external financial auditors completed an IT general controls (ITGC) review six months ago.
5. The audit team plans to analyze 4.5 million purchase transactions to identify duplicate payments, split purchase orders (structuring to bypass approval thresholds), and ghost vendors.""",
        "learning_objectives": "Evaluate audit charter governance, manage auditor independence impairments, determine appropriate sampling and CAAT data analytics techniques, and assess reliance on external audit workpapers.",
        "sort_order": 1
    },
    {
        "id": "c0000000-0000-0000-0000-000000000002",
        "domain_id": "d0000000-0000-0000-0000-000000000002",
        "title": "Case Study: Accenco — IT Governance Alignment & Sourcing Strategy",
        "scenario": """Accenco is a rapidly expanding financial technology enterprise providing mobile wealth management services. Over the past 18 months, Accenco has doubled its customer base, leading to rapid IT infrastructure expansion.

An IS audit of IT governance and risk management revealed:
1. The Board of Directors does not have an IT oversight committee, and IT strategic initiatives are rarely discussed during board meetings.
2. The CIO reports directly to the Chief Marketing Officer (CMO), and IT project investments are prioritized based on marketing campaign schedules rather than an enterprise balanced scorecard.
3. To handle rapid transaction growth, IT management outsourced core payment processing and customer database hosting to a third-party cloud provider (CloudFin).
4. The outsourcing contract with CloudFin does not contain a 'right-to-audit' clause or specific security breach notification timelines. CloudFin provided a SOC 1 Type I report from 14 months ago.
5. In the internal database administration team, two senior DBAs also hold active user account administration and application release deployment rights.""",
        "learning_objectives": "Assess IT governance structures, evaluate Board and IT Steering Committee oversight, analyze third-party vendor sourcing risks and SOC reports, and design compensating controls for Segregation of Duties conflicts.",
        "sort_order": 2
    },
    {
        "id": "c0000000-0000-0000-0000-000000000003",
        "domain_id": "d0000000-0000-0000-0000-000000000003",
        "title": "Case Study: Wonderwheels — ERP Acquisition, Agile Migration & UAT",
        "scenario": """Wonderwheels is a major national retail chain specializing in outdoor sports and all-terrain vehicles (ATVs) with 140 retail superstores and a major e-commerce portal. The enterprise is replacing its 15-year-old legacy inventory and point-of-sale (POS) system with a modern commercial off-the-shelf (COTS) cloud ERP solution.

Key facts gathered during the IS audit of the acquisition and development process:
1. The business case projected a 22% ROI over 3 years based on inventory carrying cost reductions.
2. The implementation team adopted an Agile framework with two-week sprints. However, security requirements and audit logging were deferred to a 'future sprint' to meet executive go-live deadlines.
3. For User Acceptance Testing (UAT), developers copied the unmasked live production customer database (including credit card numbers and home addresses) into the test environment.
4. Due to project delays, project management proposed a Direct Cutover (plunge) over a single holiday weekend, bypassing parallel testing.
5. No Post-Implementation Review (PIR) schedule was established in the project charter.""",
        "learning_objectives": "Evaluate business case justification, assess Agile/DevSecOps control integration, enforce test data sanitization standards, evaluate cutover risk mitigation strategies, and design post-implementation review criteria.",
        "sort_order": 3
    },
    {
        "id": "c0000000-0000-0000-0000-000000000004",
        "domain_id": "d0000000-0000-0000-0000-000000000004",
        "title": "Case Study: GlobalCloud Logistics — Operations Resilience & BCP/DRP",
        "scenario": """GlobalCloud Logistics manages freight tracking and automated warehouse fulfillment across three continents. Its core logistics dispatch platform (DispatchLive) operates 24/7.

An IS audit of IT operations and business resilience identified the following conditions:
1. A Business Impact Analysis (BIA) conducted three years ago established a Maximum Tolerable Downtime (MTD) of 4 hours, an RTO of 2 hours, and an RPO of 15 minutes for DispatchLive.
2. However, database backups are currently scheduled once every 24 hours (differential daily, full weekly). No continuous data replication or CDP is implemented.
3. The secondary recovery site is a 'Warm Site' subscription with a contracted server provisioning lead time of 48 hours.
4. The Disaster Recovery Plan has not been tested in the last 24 months due to fear of interrupting warehouse operations.
5. In IT operations, critical security patches on production database servers have been delayed for up to 9 months because system owners refuse maintenance downtime.""",
        "learning_objectives": "Align BIA parameters (MTD, RTO, RPO) with technical recovery architecture, evaluate backup frequencies, assess recovery site capabilities, design safe DRP testing programs, and audit patch management workflows.",
        "sort_order": 4
    },
    {
        "id": "c0000000-0000-0000-0000-000000000005",
        "domain_id": "d0000000-0000-0000-0000-000000000005",
        "title": "Case Study: Spectertainment — Digital Asset Security, PKI & Forensics",
        "scenario": """Spectertainment is a digital media enterprise that produces, streams, and licenses high-definition audio and video content. The company's primary digital assets include master recordings and proprietary streaming algorithms.

An IS security and forensics audit revealed:
1. Master video recordings stored in the cloud are transmitted to distribution partners over unencrypted microwave links and public internet protocols.
2. The enterprise implemented a Public Key Infrastructure (PKI) for digital signing of licensing contracts. However, the root Certificate Authority (CA) private key is stored on an unencrypted share drive accessible to all IT network engineers.
3. Remote employees authenticate to internal corporate resources using single-factor passwords, with no MFA or Zero Trust device health checks enforced.
4. During an ongoing investigation into intellectual property theft, an IT support technician accessed a suspect workstation, booted into Windows, ran antivirus scans, and copied files onto a personal USB flash drive.""",
        "learning_objectives": "Audit data in transit protections, evaluate PKI key management and root CA security, enforce Multi-Factor Authentication (MFA) and Zero Trust Architecture (ZTA), and identify forensic evidence preservation and chain of custody violations.",
        "sort_order": 5
    }
]

# Case study questions
CASE_STUDY_QUESTIONS = [
    # Domain 1 Case Study Questions
    {
        "id": "c0000000-0000-0000-0000-000000000011",
        "case_study_id": "c0000000-0000-0000-0000-000000000001",
        "question_number": 1,
        "stem": "Regarding the internal audit charter at Betatronics, which of the following is the GREATEST concern that the IS auditor should report to leadership?",
        "option_a": "The charter does not specify the specific audit software tools that auditors are permitted to use.",
        "option_b": "The charter was signed solely by the CFO rather than approved by the Board of Directors or Audit Committee.",
        "option_c": "The charter fails to define the detailed audit schedule for the upcoming fiscal year.",
        "option_d": "The charter does not include performance bonus metrics for the IS audit team.",
        "correct_option": "B",
        "rationale": "An audit charter must be approved by the Audit Committee or Board of Directors to establish the independence, authority, and standing of the internal audit function. Signing by the CFO alone impairs organizational independence since audit must be free to evaluate finance.",
        "sort_order": 1
    },
    {
        "id": "c0000000-0000-0000-0000-000000000012",
        "case_study_id": "c0000000-0000-0000-0000-000000000001",
        "question_number": 2,
        "stem": "How should audit leadership address the assignment of the audit specialist who previously developed the AutoProcure system?",
        "option_a": "Assign the specialist to lead the AutoProcure audit because their deep technical knowledge will maximize audit efficiency.",
        "option_b": "Allow the specialist to test the system controls provided an external consultant reviews their workpapers.",
        "option_c": "Recuse the specialist from auditing AutoProcure to prevent an impairment to objectivity and independence.",
        "option_d": "Require the specialist to sign a non-disclosure agreement before performing substantive testing.",
        "correct_option": "C",
        "rationale": "Under ISACA ITAF Standard 1002 (Independence and Objectivity), an auditor must not audit systems or operations for which they had design, development, or operational responsibility within the past year (or where significant conflict of interest exists). The auditor must be recused.",
        "sort_order": 2
    },
    {
        "id": "c0000000-0000-0000-0000-000000000013",
        "case_study_id": "c0000000-0000-0000-0000-000000000001",
        "question_number": 3,
        "stem": "Which audit testing technique is MOST appropriate for identifying duplicate disbursements and split purchase orders across the 4.5 million transactions?",
        "option_a": "Statistical attribute sampling of 100 randomly selected purchase orders",
        "option_b": "Computer-Assisted Audit Techniques (CAATs) / Generalized Audit Software to analyze 100% of the dataset",
        "option_c": "Manual walkthrough of 25 purchase orders from requisition to disbursement",
        "option_d": "Judgmental sampling focused solely on purchase orders over $500,000",
        "correct_option": "B",
        "rationale": "CAATs / Generalized Audit Software (GAS) and data analytics allow the auditor to evaluate 100% of large transaction populations. Scripted matching algorithms can instantly detect exact and fuzzy duplicate payments and split orders designed to circumvent approval limits.",
        "sort_order": 3
    },

    # Domain 2 Case Study Questions
    {
        "id": "c0000000-0000-0000-0000-000000000014",
        "case_study_id": "c0000000-0000-0000-0000-000000000002",
        "question_number": 1,
        "stem": "Which organizational governance finding represents the GREATEST risk to the strategic alignment of IT at Accenco?",
        "option_a": "The lack of an active board-level IT strategy committee and absence of an executive IT Steering Committee.",
        "option_b": "The CIO having a background in software engineering rather than financial management.",
        "option_c": "The IT department using cloud services rather than building an on-premise data center.",
        "option_d": "The absence of weekly operational status meetings between IT support and marketing teams.",
        "correct_option": "A",
        "rationale": "Without an IT Strategy Committee at the board level and an executive IT Steering Committee, IT investments and priorities will not align with overall enterprise strategic objectives, leading to misdirected capital and unmanaged risk.",
        "sort_order": 1
    },
    {
        "id": "c0000000-0000-0000-0000-000000000015",
        "case_study_id": "c0000000-0000-0000-0000-000000000002",
        "question_number": 2,
        "stem": "Why is the 14-month-old SOC 1 Type I report provided by CloudFin INSUFFICIENT for the IS auditor's assurance needs?",
        "option_a": "A SOC 1 report only addresses environmental green energy metrics.",
        "option_b": "A Type I report only evaluates control design at a single point in time, and the report is outdated (exceeds 12 months).",
        "option_c": "SOC 1 reports can only be reviewed by certified public accountants, not IS auditors.",
        "option_d": "Cloud providers are legally prohibited from sharing SOC reports with audit clients.",
        "correct_option": "B",
        "rationale": "A SOC 1 Type I report only provides an opinion on the design of controls at a specific point in time; it does NOT test operating effectiveness over a period. Furthermore, the report is stale (14 months old). The auditor requires a current SOC 2 Type II report.",
        "sort_order": 2
    },
    {
        "id": "c0000000-0000-0000-0000-000000000016",
        "case_study_id": "c0000000-0000-0000-0000-000000000002",
        "question_number": 3,
        "stem": "What is the BEST compensating control for the segregation of duties conflict where DBAs also hold user administration and release deployment rights?",
        "option_a": "Requiring DBAs to sign a conflict-of-interest acknowledgment annually.",
        "option_b": "Implementing automated database activity monitoring (DAM) with independent daily review of privileged audit logs.",
        "option_c": "Enforcing complex password rotation rules on DBA user accounts.",
        "option_d": "Increasing the frequency of quarterly financial reconciliations.",
        "correct_option": "B",
        "rationale": "When segregation of duties cannot be enforced, the best compensating control is independent logging of privileged DBA activities (via DAM or immutable audit logs) combined with regular review by an independent security or audit function.",
        "sort_order": 3
    },

    # Domain 3 Case Study Questions
    {
        "id": "c0000000-0000-0000-0000-000000000017",
        "case_study_id": "c0000000-0000-0000-0000-000000000003",
        "question_number": 1,
        "stem": "Which of the following practices observed during User Acceptance Testing (UAT) represents the GREATEST compliance and security risk?",
        "option_a": "Conducting UAT tests using automated testing frameworks.",
        "option_b": "Copying unmasked production customer data containing credit cards into the test environment.",
        "option_c": "Involving business end users in the execution of test scenarios.",
        "option_d": "Performing testing in a dedicated virtualized staging environment.",
        "correct_option": "B",
        "rationale": "Using unmasked live production data (especially PCI-DSS sensitive credit cards and PII) in development and testing environments violates privacy laws, industry regulations, and ISACA standards. Test environments generally have lower security controls.",
        "sort_order": 1
    },
    {
        "id": "c0000000-0000-0000-0000-000000000018",
        "case_study_id": "c0000000-0000-0000-0000-000000000003",
        "question_number": 2,
        "stem": "Management decides to proceed with a Direct Cutover strategy. What is the MOST critical artifact the IS auditor should verify exists prior to cutover approval?",
        "option_a": "A fully tested and documented fallback / rollback contingency plan.",
        "option_b": "A press release announcing the go-live to industry media.",
        "option_c": "A signed software vendor license renewal agreement.",
        "option_d": "A revised budget requesting additional capital expenditure.",
        "correct_option": "A",
        "rationale": "Direct cutover carries the highest operational risk because the legacy system is discontinued immediately. A thoroughly tested rollback and fallback contingency plan is essential in case unforeseen critical failures occur during migration.",
        "sort_order": 2
    },

    # Domain 4 Case Study Questions
    {
        "id": "c0000000-0000-0000-0000-000000000019",
        "case_study_id": "c0000000-0000-0000-0000-000000000004",
        "question_number": 1,
        "stem": "At GlobalCloud Logistics, DispatchLive has an RTO of 2 hours and an RPO of 15 minutes. Why is the current disaster recovery setup deficient?",
        "option_a": "The warm site's 48-hour provisioning time exceeds the 2-hour RTO, and 24-hour backup cycles exceed the 15-minute RPO.",
        "option_b": "The BIA was approved by business unit leaders instead of technical sysadmins.",
        "option_c": "Warm sites are legally prohibited from supporting logistics applications.",
        "option_d": "The system should use optical disc storage rather than magnetic disk arrays.",
        "correct_option": "A",
        "rationale": "The technical recovery strategy does not support the business requirements defined in the BIA. A 48-hour warm site cannot meet a 2-hour RTO, and daily 24-hour backups expose the firm to up to 24 hours of data loss (violating the 15-minute RPO).",
        "sort_order": 1
    },

    # Domain 5 Case Study Questions
    {
        "id": "c0000000-0000-0000-0000-000000000020",
        "case_study_id": "c0000000-0000-0000-0000-000000000005",
        "question_number": 1,
        "stem": "Which action by the IT technician during the investigation into IP theft fatally compromised the forensic integrity of the digital evidence?",
        "option_a": "Interviewing the suspect employee prior to contacting legal counsel.",
        "option_b": "Booting the suspect workstation and running scans without using a hardware write-blocker or creating a bit-stream image.",
        "option_c": "Logging into the domain controller using an administrator account.",
        "option_d": "Reviewing firewall traffic logs on the central SIEM console.",
        "correct_option": "B",
        "rationale": "Booting the suspect computer alters file metadata, timestamps, registry entries, and memory contents. In digital forensics, storage media must be imaged using a hardware write-blocker to generate a bit-stream copy, and analysis must be performed on the copy, preserving the original.",
        "sort_order": 1
    }
]

with open(os.path.join(DATA_DIR, "case_studies.json"), "w", encoding="utf-8") as f:
    json.dump(CASE_STUDIES, f, indent=2)

with open(os.path.join(DATA_DIR, "case_study_questions.json"), "w", encoding="utf-8") as f:
    json.dump(CASE_STUDY_QUESTIONS, f, indent=2)

print(f"Generated {len(CASE_STUDIES)} official case studies with {len(CASE_STUDY_QUESTIONS)} multi-question scenarios with valid hex UUIDs.")
