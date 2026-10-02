import os
import json
import re

OUTPUT_DIR = 'scripts/cisa_28th_data'
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Building CISA 28th Edition dataset...")

# -------------------------------------------------------------
# 1. Official CISA 28th Edition Domains & Blueprint (August 2024)
# -------------------------------------------------------------
DOMAINS = [
    {
        "id": "d0000000-0000-0000-0000-000000000001",
        "domain_number": 1,
        "name": "Information System Auditing Process",
        "code": "1",
        "exam_weight_percent": 18.0,
        "approx_exam_questions": 27,
        "learning_objectives": "Master IS audit standards (ITAF), risk-based audit planning, audit project management, sampling methodology, evidence collection, data analytics, reporting techniques, and quality assurance of the audit process.",
        "description": "Domain 1 ensures that the candidate has the knowledge necessary to provide audit services in accordance with IT audit standards to assist the organization in protecting and controlling information systems."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000002",
        "domain_number": 2,
        "name": "Governance and Management of IT",
        "code": "2",
        "exam_weight_percent": 18.0,
        "approx_exam_questions": 27,
        "learning_objectives": "Evaluate IT governance structures, laws and regulations, policies and standards, enterprise architecture, enterprise risk management (ERM), privacy programs, data governance, IT resource management, vendor management, performance monitoring, and quality management.",
        "description": "Domain 2 validates that the candidate has the knowledge necessary to ensure that the organization has the structure, policies, accountability, and specific mechanisms in place to achieve good governance and management over IT."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000003",
        "domain_number": 3,
        "name": "IS Acquisition, Development, and Implementation",
        "code": "3",
        "exam_weight_percent": 12.0,
        "approx_exam_questions": 18,
        "learning_objectives": "Assess project governance and management, business case and feasibility analysis, system development methodologies (Agile, Waterfall, CI/CD), control identification and design, system readiness and implementation testing, configuration and release management, system migration, and post-implementation review.",
        "description": "Domain 3 ensures that the candidate can provide assurance that the practices for the acquisition, development, testing and implementation of information systems meet the enterprise’s strategies and objectives."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000004",
        "domain_number": 4,
        "name": "IS Operations and Business Resilience",
        "code": "4",
        "exam_weight_percent": 26.0,
        "approx_exam_questions": 39,
        "learning_objectives": "Evaluate IT components, asset management, job scheduling, system interfaces, shadow IT/EUC, availability and capacity management, problem and incident management, change/configuration/patch management, operational log management, IT service level management, database management, business impact analysis (BIA), system resilience, data backup and restoration, BCP, and DRP.",
        "description": "Domain 4 confirms that the candidate has the knowledge necessary to ensure that the operational activities of IT systems meet business requirements and that business resilience strategies (BCP/DRP/BIA) protect organizational viability."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000005",
        "domain_number": 5,
        "name": "Protection of Information Assets",
        "code": "5",
        "exam_weight_percent": 26.0,
        "approx_exam_questions": 39,
        "learning_objectives": "Audit information asset security policies, physical and environmental controls, identity and access management (IAM/PAM), Zero Trust Architecture (ZTA), network and endpoint security, DLP, data encryption, PKI, cloud and virtualized environments, mobile/wireless/IoT devices, security awareness, attack methods, security testing tools, security monitoring (SIEM/SOAR), incident response management, and evidence collection/forensics.",
        "description": "Domain 5 guarantees that the candidate has the knowledge necessary to ensure that the organization’s security policies, standards, procedures, and controls ensure the confidentiality, integrity, and availability of information assets."
    }
]

# -------------------------------------------------------------
# 2. Official 60 Topics (August 2024 28th Edition Blueprint)
# -------------------------------------------------------------
TOPICS = [
    # Domain 1 (10 Topics)
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1A1", "name": "IS Audit Standards, Guidelines, Functions, and Codes of Ethics", "part": "A", "sort_order": 1},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1A2", "name": "Types of Audits, Assessments, and Reviews", "part": "A", "sort_order": 2},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1A3", "name": "Risk-Based Audit Planning", "part": "A", "sort_order": 3},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1A4", "name": "Types of Controls and Considerations", "part": "A", "sort_order": 4},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B1", "name": "Audit Project Management", "part": "B", "sort_order": 5},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B2", "name": "Audit Testing and Sampling Methodology", "part": "B", "sort_order": 6},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B3", "name": "Audit Evidence Collection Techniques", "part": "B", "sort_order": 7},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B4", "name": "Audit Data Analytics (including audit algorithms)", "part": "B", "sort_order": 8},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B5", "name": "Reporting and Communication Techniques", "part": "B", "sort_order": 9},
    {"domain_id": "d0000000-0000-0000-0000-000000000001", "topic_code": "1B6", "name": "Quality Assurance and Improvement of Audit Process", "part": "B", "sort_order": 10},

    # Domain 2 (11 Topics)
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A1", "name": "Laws, Regulations, and Industry Standards", "part": "A", "sort_order": 1},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A2", "name": "Organizational Structure, IT Governance, and IT Strategy", "part": "A", "sort_order": 2},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A3", "name": "IT Policies, Standards, Procedures and Practices", "part": "A", "sort_order": 3},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A4", "name": "Enterprise Architecture (EA) and Considerations", "part": "A", "sort_order": 4},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A5", "name": "Enterprise Risk Management (ERM)", "part": "A", "sort_order": 5},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A6", "name": "Privacy Program and Principles", "part": "A", "sort_order": 6},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2A7", "name": "Data Governance and Classification", "part": "A", "sort_order": 7},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2B1", "name": "IT Resource Management", "part": "B", "sort_order": 8},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2B2", "name": "IT Vendor Management", "part": "B", "sort_order": 9},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2B3", "name": "IT Performance Monitoring and Reporting", "part": "B", "sort_order": 10},
    {"domain_id": "d0000000-0000-0000-0000-000000000002", "topic_code": "2B4", "name": "Quality Assurance and Quality Management of IT", "part": "B", "sort_order": 11},

    # Domain 3 (8 Topics)
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3A1", "name": "Project Governance and Management", "part": "A", "sort_order": 1},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3A2", "name": "Business Case and Feasibility Analysis", "part": "A", "sort_order": 2},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3A3", "name": "System Development Methodologies", "part": "A", "sort_order": 3},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3A4", "name": "Control Identification and Design", "part": "A", "sort_order": 4},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3B1", "name": "System Readiness and Implementation Testing", "part": "B", "sort_order": 5},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3B2", "name": "Implementation Configuration and Release Management", "part": "B", "sort_order": 6},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3B3", "name": "System Migration, Infrastructure Deployment, and Data Conversion", "part": "B", "sort_order": 7},
    {"domain_id": "d0000000-0000-0000-0000-000000000003", "topic_code": "3B4", "name": "Post-Implementation Review", "part": "B", "sort_order": 8},

    # Domain 4 (16 Topics)
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A1", "name": "IT Components", "part": "A", "sort_order": 1},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A2", "name": "IT Asset Management", "part": "A", "sort_order": 2},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A3", "name": "Job Scheduling and Production Process Automation", "part": "A", "sort_order": 3},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A4", "name": "System Interfaces", "part": "A", "sort_order": 4},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A5", "name": "Shadow IT and End-User Computing (EUC)", "part": "A", "sort_order": 5},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A6", "name": "Systems Availability and Capacity Management", "part": "A", "sort_order": 6},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A7", "name": "Problem and Incident Management", "part": "A", "sort_order": 7},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A8", "name": "IT Change, Configuration, and Patch Management", "part": "A", "sort_order": 8},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A9", "name": "Operational Log Management", "part": "A", "sort_order": 9},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A10", "name": "IT Service Level Management", "part": "A", "sort_order": 10},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4A11", "name": "Database Management", "part": "A", "sort_order": 11},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4B1", "name": "Business Impact Analysis (BIA)", "part": "B", "sort_order": 12},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4B2", "name": "System and Operational Resilience", "part": "B", "sort_order": 13},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4B3", "name": "Data Backup, Storage, and Restoration", "part": "B", "sort_order": 14},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4B4", "name": "Business Continuity Plan (BCP)", "part": "B", "sort_order": 15},
    {"domain_id": "d0000000-0000-0000-0000-000000000004", "topic_code": "4B5", "name": "Disaster Recovery Plans (DRP)", "part": "B", "sort_order": 16},

    # Domain 5 (15 Topics)
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A1", "name": "Information Asset Security Policies, Frameworks, Standards, and Guidelines", "part": "A", "sort_order": 1},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A2", "name": "Physical and Environmental Controls", "part": "A", "sort_order": 2},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A3", "name": "Identity and Access Management (IAM & PAM)", "part": "A", "sort_order": 3},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A4", "name": "Network and End-Point Security", "part": "A", "sort_order": 4},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A5", "name": "Data Loss Prevention (DLP)", "part": "A", "sort_order": 5},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A6", "name": "Data Encryption & Cryptography", "part": "A", "sort_order": 6},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A7", "name": "Public Key Infrastructure (PKI)", "part": "A", "sort_order": 7},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A8", "name": "Cloud and Virtualized Environments", "part": "A", "sort_order": 8},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5A9", "name": "Mobile, Wireless, and Internet-of-Things (IoT) Devices", "part": "A", "sort_order": 9},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B1", "name": "Security Awareness Training and Programs", "part": "B", "sort_order": 10},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B2", "name": "Information System Attack Methods and Techniques", "part": "B", "sort_order": 11},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B3", "name": "Security Testing Tools and Techniques", "part": "B", "sort_order": 12},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B4", "name": "Security Monitoring Logs, Tools, and Techniques (SIEM/SOAR)", "part": "B", "sort_order": 13},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B5", "name": "Security Incident Response Management", "part": "B", "sort_order": 14},
    {"domain_id": "d0000000-0000-0000-0000-000000000005", "topic_code": "5B6", "name": "Evidence Collection and Forensics (Chain of Custody)", "part": "B", "sort_order": 15}
]

with open(os.path.join(OUTPUT_DIR, "domains.json"), "w", encoding="utf-8") as f:
    json.dump(DOMAINS, f, indent=2)

with open(os.path.join(OUTPUT_DIR, "topics.json"), "w", encoding="utf-8") as f:
    json.dump(TOPICS, f, indent=2)

print(f"Saved {len(DOMAINS)} domains and {len(TOPICS)} topics.")
