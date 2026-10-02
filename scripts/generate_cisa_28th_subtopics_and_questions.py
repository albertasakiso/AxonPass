import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

print("Generating CISA 28th Edition Subtopics & Topic-Aligned Practice Questions...")

# Load topics
with open(os.path.join(DATA_DIR, "topics.json"), "r", encoding="utf-8") as f:
    topics = json.load(f)

# Build subtopics
subtopics = []
for i, t in enumerate(topics):
    topic_code = t["topic_code"]
    domain_id = t["domain_id"]
    name = t["name"]
    part = t["part"]
    
    subtopics.append({
        "id": f"s0000000-0000-0000-0000-{i+1:012d}",
        "topic_id": t.get("id", f"t0000000-0000-0000-0000-{i+1:012d}"),
        "domain_id": domain_id,
        "topic_code": topic_code,
        "subtopic_code": f"{topic_code}.1",
        "title": f"{topic_code}: {name}",
        "sort_order": i + 1,
        "estimated_minutes": 15,
        "key_concepts": [
            f"Core principles of {name}",
            "Relevant ISACA ITAF standards, guidelines, and control baselines",
            "Key risk factors, vulnerabilities, and management controls",
            "Practical IS audit procedures and evidence evaluation techniques"
        ],
        "content_markdown": f"""# {topic_code}: {name}
*CISA Official Review Manual, 28th Edition (2024)*

## 1. Overview & Learning Objectives
This module covers **{name}** in accordance with the ISACA August 2024 Exam Content Outline. Candidates must understand the theoretical frameworks, operational controls, and specific IS audit testing procedures required to assess this area.

## 2. Core Concepts & Frameworks
- **Subject Matter Foundation**: Understanding the organizational, technical, and regulatory dimensions of {name}.
- **Governance & Control Alignment**: Aligning processes with COBIT 2019, NIST frameworks, ISO/IEC standards, and ITAF assurance guidelines.
- **Roles and Responsibilities**: Delineation between governance oversight (Board of Directors), executive management execution, and independent audit assurance.

## 3. Key Risks & Vulnerabilities
- Risk of non-compliance with statutory and regulatory mandates.
- Operational breakdowns resulting from inadequate control design or operating failures.
- Unauthorized access, data leakage, and fraud risks resulting from deficient segregation of duties.

## 4. IS Audit Testing Procedures & Evidence
1. **Inquiry & Interview**: Conduct structured interviews with process owners and key stakeholders.
2. **Inspection & Review**: Examine documented policies, charters, system logs, architectural diagrams, and configuration baselines.
3. **Observation & Walkthrough**: Observe operational processes and verify that controls operate as documented.
4. **Re-performance & Substantive Testing**: Re-perform calculations, execute CAAT data analytics queries, and inspect transaction samples.

## 5. Exam Watch & Key Takeaways
> [!TIP]
> **ISACA Exam Tip**: Always determine whether the question asks for the **PRIMARY** objective, the **FIRST** step in a process, or the **BEST** compensating control. Mandatory requirements are always defined by ISACA Standards.
"""
    })

with open(os.path.join(DATA_DIR, "subtopics.json"), "w", encoding="utf-8") as f:
    json.dump(subtopics, f, indent=2)

print(f"Generated {len(subtopics)} rich subtopic modules.")

# =====================================================================
# 2. GENERATE HIGH-YIELD BLUEPRINT PRACTICE QUESTIONS
# =====================================================================

SAMPLE_QUESTIONS = [
    # Domain 1 (18% / Topic 1A1 - 1B6)
    {
        "num": 1,
        "domain_num": 1,
        "topicCode": "1A1",
        "diff": "medium",
        "stem": "Which of the following documents defines mandatory requirements that all IS audit and assurance professionals must adhere to?",
        "scenario": None,
        "a": "ISACA IS Audit and Assurance Guidelines",
        "b": "ISACA IS Audit and Assurance Tools and Techniques",
        "c": "ISACA IS Audit and Assurance Standards (ITAF)",
        "d": "ISACA Whitepapers and Frameworks",
        "ans": "C",
        "rationale": "Under ISACA's ITAF framework, IS Audit and Assurance Standards are mandatory requirements for all IS audit engagements. Guidelines provide advisory guidance in applying standards, and Tools & Techniques provide procedural steps.",
        "tags": ["ITAF", "Standards", "Governance"],
        "source": "CISA 28th Edition, Section 1.1"
    },
    {
        "num": 2,
        "domain_num": 1,
        "topicCode": "1A1",
        "diff": "hard",
        "stem": "An IS auditor was involved in the system design of a critical ERP module 9 months ago. The auditor has now been assigned to audit the ERP's internal controls. What is the auditor's BEST course of action?",
        "scenario": None,
        "a": "Perform the audit using only automated CAAT tools to maintain objectivity.",
        "b": "Disclose the conflict of interest to audit management and request recusal from the engagement.",
        "c": "Proceed with the audit but have a peer auditor review all workpapers.",
        "d": "Obtain written approval from the ERP project manager before commencing testing.",
        "ans": "B",
        "rationale": "Under ITAF Standard 1002 (Independence and Objectivity), auditing a system designed or implemented by the auditor within the past 12 months constitutes an impairment to independence and objectivity. The auditor must immediately disclose the impairment and recuse themselves.",
        "tags": ["Independence", "Objectivity", "Ethics"],
        "source": "CISA 28th Edition, Section 1.1.3"
    },
    {
        "num": 3,
        "domain_num": 1,
        "topicCode": "1A3",
        "diff": "medium",
        "stem": "During risk-based audit planning, which of the following is the PRIMARY purpose of evaluating inherent risk?",
        "scenario": None,
        "a": "To determine the operating effectiveness of automated controls.",
        "b": "To identify audit areas with the highest exposure before considering internal controls.",
        "c": "To calculate the total financial liability of the organization.",
        "d": "To establish the specific sample size for compliance testing.",
        "ans": "B",
        "rationale": "Inherent risk represents the susceptibility of an audit universe area or business process to material error or fraud assuming no internal controls exist. Assessing inherent risk allows the auditor to prioritize high-exposure areas in the annual audit plan.",
        "tags": ["Risk Assessment", "Inherent Risk", "Audit Planning"],
        "source": "CISA 28th Edition, Section 1.2"
    },
    {
        "num": 4,
        "domain_num": 1,
        "topicCode": "1B2",
        "diff": "hard",
        "stem": "An IS auditor is testing user access controls to determine the rate of unauthorized access approvals. Which sampling method is MOST appropriate?",
        "scenario": None,
        "a": "Variable sampling",
        "b": "Attribute sampling",
        "c": "Stratified mean-per-unit sampling",
        "d": "Discovery sampling with zero confidence interval",
        "ans": "B",
        "rationale": "Attribute sampling is used in compliance (control) testing to estimate the rate of occurrence of a specific characteristic or control deviation (yes/no, compliant/non-compliant). Variable sampling is used in substantive testing to estimate monetary values or quantities.",
        "tags": ["Sampling", "Compliance Testing", "Attribute Sampling"],
        "source": "CISA 28th Edition, Section 1.4"
    },
    {
        "num": 5,
        "domain_num": 1,
        "topicCode": "1B4",
        "diff": "medium",
        "stem": "Which of the following is the GREATEST advantage of utilizing Computer-Assisted Audit Techniques (CAATs) and Generalized Audit Software (GAS)?",
        "scenario": None,
        "a": "They eliminate the need for an IS audit charter.",
        "b": "They allow the auditor to analyze 100% of large transaction populations rather than relying on samples.",
        "c": "They guarantee that internal control deficiencies will be remediated automatically.",
        "d": "They allow the auditor to modify production databases during live testing.",
        "ans": "B",
        "rationale": "CAATs and Generalized Audit Software enable the auditor to query and analyze 100% of transaction populations without altering source databases, significantly increasing audit coverage, speed, and precision.",
        "tags": ["CAATs", "Data Analytics", "Audit Testing"],
        "source": "CISA 28th Edition, Section 1.5"
    },

    # Domain 2 (18% / Topic 2A1 - 2B4)
    {
        "num": 6,
        "domain_num": 2,
        "topicCode": "2A2",
        "diff": "medium",
        "stem": "Who holds ULTIMATE accountability for the governance and risk management of information systems within an enterprise?",
        "scenario": None,
        "a": "Chief Information Officer (CIO)",
        "b": "Chief Information Security Officer (CISO)",
        "c": "Board of Directors",
        "d": "Lead IS Auditor",
        "ans": "C",
        "rationale": "Under COBIT 2019 and corporate governance principles, the Board of Directors holds ultimate accountability for the governance of enterprise IT, setting risk appetite, and ensuring business-IT alignment.",
        "tags": ["Governance", "Board Accountability", "COBIT 2019"],
        "source": "CISA 28th Edition, Section 2.1"
    },
    {
        "num": 7,
        "domain_num": 2,
        "topicCode": "2A3",
        "diff": "medium",
        "stem": "An organization is updating its information security documentation. Which of the following represents a MANDATORY rule specifying measurable technical requirements?",
        "scenario": None,
        "a": "Information Security Policy",
        "b": "Security Standard",
        "c": "Security Guideline",
        "d": "Security Procedure",
        "ans": "B",
        "rationale": "Standards define specific, mandatory, and measurable rules or technical baselines (e.g., minimum 14-character passwords). Policies define high-level mandatory management intent; procedures provide step-by-step instructions; guidelines are advisory.",
        "tags": ["Policies", "Standards", "Documentation Hierarchy"],
        "source": "CISA 28th Edition, Section 2.3"
    },
    {
        "num": 8,
        "domain_num": 2,
        "topicCode": "2A5",
        "diff": "hard",
        "stem": "An enterprise decides to purchase cybersecurity breach insurance to address potential ransomware losses. Which risk response strategy is being implemented?",
        "scenario": None,
        "a": "Risk Avoidance",
        "b": "Risk Mitigation",
        "c": "Risk Transfer (Sharing)",
        "d": "Risk Acceptance",
        "ans": "C",
        "rationale": "Purchasing insurance or entering into indemnification contracts transfers or shares the financial impact of a risk event with a third party. Mitigation reduces risk via controls; avoidance eliminates the risky activity; acceptance acknowledges residual risk.",
        "tags": ["Risk Management", "Risk Treatment", "Risk Transfer"],
        "source": "CISA 28th Edition, Section 2.4"
    },
    {
        "num": 9,
        "domain_num": 2,
        "topicCode": "2B2",
        "diff": "hard",
        "stem": "When evaluating a cloud SaaS vendor, which type of third-party audit report provides the BEST evidence regarding the OPERATING EFFECTIVENESS of security controls over time?",
        "scenario": None,
        "a": "SOC 1 Type I",
        "b": "SOC 2 Type I",
        "c": "SOC 2 Type II",
        "d": "Vendor Self-Assessment Questionnaire",
        "ans": "C",
        "rationale": "A SOC 2 Type II report includes detailed testing and an independent auditor opinion on both the suitability of control design and the operating effectiveness of controls over a specified period (typically 6-12 months). Type I reports only assess design at a single point in time.",
        "tags": ["Vendor Management", "SOC Reports", "Third Party Risk"],
        "source": "CISA 28th Edition, Section 2.5"
    },

    # Domain 3 (12% / Topic 3A1 - 3B4)
    {
        "num": 10,
        "domain_num": 3,
        "topicCode": "3A2",
        "diff": "medium",
        "stem": "What is the PRIMARY purpose of developing a business case prior to initiating a major IT acquisition project?",
        "scenario": None,
        "a": "To select the software programming language.",
        "b": "To justify the project investment by demonstrating expected business value, feasibility, and ROI.",
        "c": "To generate user acceptance test test scripts.",
        "d": "To establish the daily scrum meeting schedule.",
        "ans": "B",
        "rationale": "A business case provides strategic justification, cost-benefit analysis, feasibility evaluation, and projected return on investment (ROI) to enable senior leadership to make informed investment decisions.",
        "tags": ["Business Case", "Feasibility", "Project Initiation"],
        "source": "CISA 28th Edition, Section 3.1"
    },
    {
        "num": 11,
        "domain_num": 3,
        "topicCode": "3B1",
        "diff": "hard",
        "stem": "Who is responsible for formally signing off and approving the results of User Acceptance Testing (UAT)?",
        "scenario": None,
        "a": "Lead Software Developer",
        "b": "Database Administrator",
        "c": "Business Process Owner / System Owner",
        "d": "IS Quality Assurance Auditor",
        "ans": "C",
        "rationale": "User Acceptance Testing (UAT) verifies that the system meets business requirements. The Business Process Owner / System Owner is accountable for accepting the system and providing formal authorization for production deployment.",
        "tags": ["UAT", "Testing", "Sign-off"],
        "source": "CISA 28th Edition, Section 3.4"
    },
    {
        "num": 12,
        "domain_num": 3,
        "topicCode": "3B3",
        "diff": "medium",
        "stem": "Which system conversion cutover strategy carries the HIGHEST operational risk if unexpected critical failures occur?",
        "scenario": None,
        "a": "Parallel adoption",
        "b": "Phased implementation",
        "c": "Direct cutover (Plunge)",
        "d": "Pilot conversion",
        "ans": "C",
        "rationale": "Direct cutover immediately terminates the legacy system when the new system goes live. If critical errors occur, there is no active fallback system, resulting in the highest operational risk.",
        "tags": ["Cutover", "Direct Cutover", "System Migration"],
        "source": "CISA 28th Edition, Section 3.5"
    },
    {
        "num": 13,
        "domain_num": 3,
        "topicCode": "3B4",
        "diff": "medium",
        "stem": "A Post-Implementation Review (PIR) is typically conducted 3 to 6 months after system deployment. What is the PRIMARY objective of the PIR?",
        "scenario": None,
        "a": "To complete unit testing of secondary modules.",
        "b": "To determine whether the system realized its intended business objectives and projected ROI.",
        "c": "To write the initial software requirements specification.",
        "d": "To decommission the development server.",
        "ans": "B",
        "rationale": "The primary objective of a Post-Implementation Review is to evaluate whether the live system is delivering the business benefits, controls, and financial ROI projected in the original business case after operations have stabilized.",
        "tags": ["PIR", "Benefit Realization", "SDLC"],
        "source": "CISA 28th Edition, Section 3.6"
    },

    # Domain 4 (26% / Topic 4A1 - 4B5)
    {
        "num": 14,
        "domain_num": 4,
        "topicCode": "4A7",
        "diff": "medium",
        "stem": "What is the PRIMARY difference between Incident Management and Problem Management in ITIL service operations?",
        "scenario": None,
        "a": "Incident management identifies root causes; problem management focuses on hardware warranties.",
        "b": "Incident management focuses on rapid restoration of normal service; problem management identifies and resolves underlying root causes.",
        "c": "Incident management is performed by external auditors; problem management is performed by developers.",
        "d": "Incident management manages procurement; problem management configures firewalls.",
        "ans": "B",
        "rationale": "Incident Management aims to restore normal service operation as quickly as possible and minimize disruption. Problem Management aims to diagnose root causes to prevent recurring incidents.",
        "tags": ["ITIL", "Incident Management", "Problem Management"],
        "source": "CISA 28th Edition, Section 4.1"
    },
    {
        "num": 15,
        "domain_num": 4,
        "topicCode": "4B1",
        "diff": "hard",
        "stem": "What is the FIRST step an organization should undertake when developing a comprehensive Business Continuity Plan (BCP)?",
        "scenario": None,
        "a": "Contracting with an external hot site facility.",
        "b": "Purchasing disaster recovery simulation software.",
        "c": "Conducting a Business Impact Analysis (BIA).",
        "d": "Conducting a full interruption disaster test.",
        "ans": "C",
        "rationale": "A Business Impact Analysis (BIA) is the foundational prerequisite for BCP/DRP. It identifies critical business processes and determines recovery priorities, MTD, RTO, and RPO.",
        "tags": ["BIA", "BCP", "Disaster Recovery"],
        "source": "CISA 28th Edition, Section 4.4"
    },
    {
        "num": 16,
        "domain_num": 4,
        "topicCode": "4B1",
        "diff": "hard",
        "stem": "A critical financial reporting database has a Recovery Point Objective (RPO) of 30 minutes and a Recovery Time Objective (RTO) of 2 hours. Which technical solution is REQUIRED to meet the RPO?",
        "scenario": None,
        "a": "Weekly full backups transferred to offsite tape storage.",
        "b": "Daily incremental backups performed at midnight.",
        "c": "Continuous data replication or synchronous database mirroring to a secondary site.",
        "d": "Cold site facility subscription with 48-hour hardware provisioning.",
        "ans": "C",
        "rationale": "RPO defines the maximum tolerable data loss in time. An RPO of 30 minutes means data loss cannot exceed 30 minutes. Continuous replication or synchronous mirroring ensures data changes are preserved in near real-time, fulfilling the 30-minute threshold.",
        "tags": ["RPO", "RTO", "Replication"],
        "source": "CISA 28th Edition, Section 4.4.1"
    },
    {
        "num": 17,
        "domain_num": 4,
        "topicCode": "4B5",
        "diff": "medium",
        "stem": "Which disaster recovery site alternative provides fully configured hardware, active networks, and near-instantaneous recovery capability at the HIGHEST operational cost?",
        "scenario": None,
        "a": "Cold Site",
        "b": "Warm Site",
        "c": "Hot Site",
        "d": "Mobile Trailer Site",
        "ans": "C",
        "rationale": "A Hot Site is a fully operational, mirrored facility with complete hardware, systems, and synchronized data, providing near-zero RTO at the highest operational expense.",
        "tags": ["Hot Site", "Recovery Strategy", "DRP"],
        "source": "CISA 28th Edition, Section 4.4.2"
    },

    # Domain 5 (26% / Topic 5A1 - 5B6)
    {
        "num": 18,
        "domain_num": 5,
        "topicCode": "5A3",
        "diff": "medium",
        "stem": "Which of the following authentication implementations constitutes TRUE Multi-Factor Authentication (MFA)?",
        "scenario": None,
        "a": "Entering a password followed by a memorable secret security question.",
        "b": "Entering a password followed by a biometric fingerprint scan.",
        "c": "Entering a password followed by a second alphanumeric PIN.",
        "d": "Entering a username and scanning an ID badge twice.",
        "ans": "B",
        "rationale": "Multi-Factor Authentication requires two or more distinct authentication factors: something you know (password), something you have (token/card), or something you are (biometric fingerprint). A password and security question are both 'something you know' (single-factor).",
        "tags": ["MFA", "Authentication", "IAM"],
        "source": "CISA 28th Edition, Section 5.2"
    },
    {
        "num": 19,
        "domain_num": 5,
        "topicCode": "5A6",
        "diff": "hard",
        "stem": "When creating a Digital Signature, which key is used by the SENDER to encrypt the cryptographic hash of the message?",
        "scenario": None,
        "a": "Sender's Public Key",
        "b": "Sender's Private Key",
        "c": "Recipient's Public Key",
        "d": "Recipient's Private Key",
        "ans": "B",
        "rationale": "To create a digital signature, the sender encrypts the document hash with their own PRIVATE key. Anyone can verify the signature using the sender's PUBLIC key. This provides authentication, integrity, and non-repudiation.",
        "tags": ["Digital Signature", "PKI", "Cryptography"],
        "source": "CISA 28th Edition, Section 5.3"
    },
    {
        "num": 20,
        "domain_num": 5,
        "topicCode": "5A8",
        "diff": "medium",
        "stem": "In the Cloud Shared Responsibility Model for Infrastructure as a Service (IaaS), which of the following is the PRIMARY responsibility of the CUSTOMER?",
        "scenario": None,
        "a": "Physical security of the hypervisor hardware in the datacenter.",
        "b": "Operating system patching, middleware configuration, and application security.",
        "c": "HVAC and electrical power generators.",
        "d": "Disposal and destruction of physical hard drives.",
        "ans": "B",
        "rationale": "In IaaS, the cloud provider manages physical infrastructure, virtualization hypervisors, and data center facilities. The customer is responsible for operating systems, application code, middleware, network firewall configurations, and data security.",
        "tags": ["Cloud Security", "IaaS", "Shared Responsibility"],
        "source": "CISA 28th Edition, Section 5.5"
    },
    {
        "num": 21,
        "domain_num": 5,
        "topicCode": "5B4",
        "diff": "medium",
        "stem": "What is the PRIMARY operational difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?",
        "scenario": None,
        "a": "An IDS is active and blocks packets; an IPS is passive and only generates alerts.",
        "b": "An IDS passively monitors traffic and sends alerts; an IPS sits inline and actively blocks or drops malicious traffic in real time.",
        "c": "An IDS encrypts data at rest; an IPS encrypts data in transit.",
        "d": "An IDS operates at Layer 7; an IPS only operates at Layer 1.",
        "ans": "B",
        "rationale": "An IDS is a passive monitoring tool that analyzes network traffic copies and generates alerts. An IPS is deployed inline and can actively block packets, reset TCP sessions, and drop malicious traffic in real time.",
        "tags": ["IDS", "IPS", "Network Security"],
        "source": "CISA 28th Edition, Section 5.4"
    },
    {
        "num": 22,
        "domain_num": 5,
        "topicCode": "5B6",
        "diff": "hard",
        "stem": "During a digital forensics investigation, which storage component should be captured FIRST according to the Order of Volatility?",
        "scenario": None,
        "a": "Solid-State Drive (SSD) storage",
        "b": "CPU registers and CPU cache memory",
        "c": "Removable USB flash backup drive",
        "d": "Network print server event logs",
        "ans": "B",
        "rationale": "The Order of Volatility dictates collecting the most transient/volatile evidence first before powering down or modifying the system: CPU Registers/Cache -> RAM/Routing Tables -> Temporary File Systems -> Disk -> Remote Logs -> Archival Media.",
        "tags": ["Forensics", "Order of Volatility", "Evidence Collection"],
        "source": "CISA 28th Edition, Section 5.6"
    }
]

with open(os.path.join(DATA_DIR, "sample_questions.json"), "w", encoding="utf-8") as f:
    json.dump(SAMPLE_QUESTIONS, f, indent=2)

print(f"Generated {len(SAMPLE_QUESTIONS)} high-yield topic-aligned practice questions.")
