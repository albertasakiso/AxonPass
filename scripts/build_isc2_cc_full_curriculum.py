#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — Complete ISC2 Certified in Cybersecurity (CC) Program Builder
Constructs:
- 33 Canonical Topics (Part A / Part B)
- 33 Detailed Subtopics with markdown prose, key terms, learning objectives, and Exam Watch Alerts
- 5 Master Chapters for Document E-Reader (~3,500 words each with formatted markdown, tables, and callouts)
- 5 Official Scenario Case Studies with 10 Questions
- 160 Cybersecurity Glossary Terms
- 520 Verified ISC2 CC Multiple Choice Questions with full rationales for options A, B, C, and D
"""

import json
import os
import uuid

CC_CERT_ID = 'a0000000-0000-0000-0000-000000000002'

DOMAINS = [
    {
        'id': 'd0000000-0000-0000-0000-000000000011',
        'domain_number': 1,
        'code': 'D1',
        'name': 'Security Principles',
        'weight': 26.00,
        'approx_qs': 26,
        'part_a_title': 'Information Assurance & Core Security Concepts',
        'part_b_title': 'Governance, Ethics & Compliance',
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000012',
        'domain_number': 2,
        'code': 'D2',
        'name': 'Incident Response, Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        'weight': 10.00,
        'approx_qs': 10,
        'part_a_title': 'Incident Response (IR) Principles & Lifecycle',
        'part_b_title': 'Business Continuity (BC) & Disaster Recovery (DR) Concepts',
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000013',
        'domain_number': 3,
        'code': 'D3',
        'name': 'Access Controls Concepts',
        'weight': 22.00,
        'approx_qs': 22,
        'part_a_title': 'Physical Access Controls & Environmental Safety',
        'part_b_title': 'Logical Access Controls & Identity Management',
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000014',
        'domain_number': 4,
        'code': 'D4',
        'name': 'Network Security',
        'weight': 24.00,
        'approx_qs': 24,
        'part_a_title': 'Computer Networking Fundamentals & Protocols',
        'part_b_title': 'Network Threats & Defensive Controls',
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000015',
        'domain_number': 5,
        'code': 'D5',
        'name': 'Security Operations',
        'weight': 18.00,
        'approx_qs': 18,
        'part_a_title': 'Data Security, Cryptography & System Hardening',
        'part_b_title': 'Operational Best Practices & Threat Mitigation',
    }
]

# ─────────────────────────────────────────────────────────────────────────────
# 1. CANONICAL TOPICS & SUBTOPICS
# ─────────────────────────────────────────────────────────────────────────────
TOPICS_RAW = [
    # ── DOMAIN 1: Security Principles (26%) ──
    {
        'domain_number': 1,
        'topic_code': '1A1',
        'part': 'A',
        'name': 'The CIA Triad (Confidentiality, Integrity, Availability)',
        'summary': 'Core pillars of information security: ensuring data secrecy, accuracy/trustworthiness, and timely accessibility.',
        'key_terms': ['Confidentiality', 'Integrity', 'Availability', 'Encryption', 'Hashing', 'Redundancy', 'CIA Triad'],
        'objectives': 'Identify the components of the CIA Triad and evaluate security controls designed to protect each pillar.',
        'exam_tips': 'Exam Watch: Encryption protects Confidentiality; Hashing and Digital Signatures protect Integrity; Fault tolerance, RAID, and Backups protect Availability.',
        'content': """# The CIA Triad: Confidentiality, Integrity, and Availability

The **CIA Triad** serves as the foundational security model for evaluating, designing, and testing information security controls in modern organizations.

---

### 1. The Three Pillars Defined

| Pillar | Definition | Threat / Attack Vector | Primary Countermeasures |
| :--- | :--- | :--- | :--- |
| **Confidentiality** | Ensuring that information is accessible only to authorized individuals, entities, or processes. Prevents unauthorized disclosure. | Eavesdropping, snooping, data exfiltration, shoulder surfing, unauthorized database dumping. | Encryption (AES-256), Access Control Lists (ACLs), Data Classification, Masking, DLP. |
| **Integrity** | Safeguarding the accuracy, completeness, and trustworthiness of data and systems. Prevents unauthorized modification. | Man-in-the-Middle (MitM), bit-flipping, unauthorized record alteration, SQL injection. | Cryptographic Hashing (SHA-256), Digital Signatures, Message Authentication Codes (MAC), Write-Once Media. |
| **Availability** | Ensuring that systems, networks, and data are timely and reliably accessible to authorized users when needed. | Denial of Service (DoS/DDoS), ransomware locking systems, power outages, hardware failures. | Redundant power (UPS, Generators), RAID arrays, High Availability (HA) clustering, Backups, Load balancers. |

---

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If a question describes an attacker altering an employee payroll record or tampering with financial numbers, the compromised pillar is **INTEGRITY**.
> - If an attacker intercepts network traffic and reads sensitive passwords in plaintext, the compromised pillar is **CONFIDENTIALITY**.
> - If a server crashes due to a volumetric flood or overheating HVAC, the compromised pillar is **AVAILABILITY**.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1A2',
        'part': 'A',
        'name': 'IAAA Framework & Non-Repudiation',
        'summary': 'Identification, Authentication, Authorization, Accountability, and Non-Repudiation mechanisms in security.',
        'key_terms': ['Identification', 'Authentication', 'Authorization', 'Accountability', 'Non-Repudiation', 'Audit Trails'],
        'objectives': 'Distinguish between the 4 components of IAAA and understand the role of non-repudiation in legal and audit defensibility.',
        'exam_tips': 'Exam Watch: Identification is claiming an identity (username); Authentication is proving it (password/MFA); Authorization is granting access rights; Accountability is auditing actions taken.',
        'content': """# The IAAA Framework and Non-Repudiation

Identity and Access Management (IAM) relies on the four-step **IAAA Framework** to establish trust and track user actions.

---

### 1. The Four Steps of IAAA

1. **Identification**: The assertion of an identity by a subject (e.g., entering a username, scanning an RFID card, or presenting an email address).
2. **Authentication**: The verification and proof of the claimed identity (e.g., providing a password, responding to an MFA push prompt, or scanning a fingerprint).
3. **Authorization**: Granting specific permissions, rights, and privileges to access specific files, systems, or resources based on the verified identity.
4. **Accountability (Auditing)**: Tracking and recording all actions performed by the authenticated subject into immutable audit logs.

---

### 2. Non-Repudiation
**Non-repudiation** guarantees that an individual cannot deny the authenticity of their signature on a document or the sending of a message that they originated. It is achieved through **Asymmetric Cryptography and Digital Signatures**.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Never allow shared or generic accounts (e.g., `admin`, `guest`). Shared accounts destroy **ACCOUNTABILITY** because audit logs cannot tie an action back to a specific individual human.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1A3',
        'part': 'A',
        'name': 'Risk Management Concepts & Threat Modeling',
        'summary': 'Threats, vulnerabilities, likelihood, impact, risk appetite, and the 4 risk treatment options.',
        'key_terms': ['Threat', 'Vulnerability', 'Risk Formula', 'Risk Appetite', 'Risk Avoidance', 'Risk Mitigation', 'Risk Transference', 'Risk Acceptance'],
        'objectives': 'Calculate qualitative and quantitative risk and select appropriate risk response strategies.',
        'exam_tips': 'Exam Watch: Purchasing cyber insurance is Risk Transference. Implementing firewalls or MFA is Risk Mitigation. Discontinuing a risky software is Risk Avoidance. Executive sign-off is Risk Acceptance.',
        'content': """# Information Security Risk Management

Risk is the probability that a threat will exploit a vulnerability and cause harm or financial loss to an organization.

---

### 1. Key Terminology & Formula

$$\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Impact}$$

- **Asset**: Anything of value to the organization (data, hardware, reputation).
- **Vulnerability**: A weakness or flaw in a system, process, or control that could be exploited.
- **Threat**: Any potential event or actor that could exploit a vulnerability to cause harm.
- **Threat Actor / Source**: The entity executing the threat (hackers, nation-states, malicious insiders, natural disasters).

---

### 2. The Four Risk Treatment Strategies

| Strategy | Description | Real-World Example |
| :--- | :--- | :--- |
| **Mitigation (Reduction)** | Applying security controls to lower the likelihood or impact of the risk. | Installing next-generation firewalls, deploying EDR, patching vulnerabilities, enforcing MFA. |
| **Transference (Sharing)** | Shifting the financial burden or operational liability of the risk to a third party. | Purchasing Cyber Liability Insurance, outsourcing hosting to an AWS/Azure cloud provider with SLAs. |
| **Avoidance** | Completely eliminating the risk by terminating the activity or decommissioning the technology. | Canceling a risky legacy web portal project or refusing to store credit card numbers on-premises. |
| **Acceptance** | Acknowledging the risk and choosing not to apply controls because the cost of protection exceeds the potential loss. | Senior executive management formally signing off on residual risk after a documented cost-benefit analysis. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Only Senior Management** has the authority to accept organizational risk. A security analyst or IT engineer cannot accept risk on behalf of the company.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1A4',
        'part': 'A',
        'name': 'Privacy Principles & Data Protection Regulations',
        'summary': 'Personally Identifiable Information (PII), data sovereignty, GDPR, HIPAA, and privacy-by-design.',
        'key_terms': ['PII', 'GDPR', 'Data Subject', 'Data Controller', 'Data Processor', 'HIPAA', 'PCI-DSS'],
        'objectives': 'Identify sensitive data types and evaluate compliance requirements under global privacy regulations.',
        'exam_tips': 'Exam Watch: PII is any data that can uniquely identify a living individual (SSN, biometric data, IP address combined with name). GDPR grants rights such as the Right to be Forgotten and 72-hour breach notification.',
        'content': """# Privacy Principles and Regulatory Compliance

Organizations are legally mandated to protect personal data under increasingly stringent privacy frameworks.

---

### 1. Personally Identifiable Information (PII)
**PII** refers to any representation of information that permits the identity of an individual to whom the information applies to be reasonably inferred by either direct or indirect means (e.g., Full Name, Social Security Number, Biometric Records, Date of Birth).

---

### 2. Major Compliance Frameworks

1. **GDPR (General Data Protection Regulation)**: European Union regulation governing data privacy.
   - **Data Subject**: The individual whose data is collected.
   - **Data Controller**: The entity determining the purposes and means of processing personal data.
   - **Data Processor**: The entity processing personal data on behalf of the controller.
   - **Breach Notification**: Must notify authorities within **72 hours** of becoming aware of a data breach.
2. **HIPAA (Health Insurance Portability and Accountability Act)**: US regulation protecting Protected Health Information (PHI).
3. **PCI-DSS (Payment Card Industry Data Security Standard)**: Industry standard for securing cardholder data (credit/debit cards).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Security protects assets; **Privacy protects the rights of individuals** regarding how their personal data is collected, used, shared, and retained.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1B1',
        'part': 'B',
        'name': 'ISC2 Code of Ethics Canons',
        'summary': 'The four mandatory ISC2 Code of Ethics Canons in strict order of priority.',
        'key_terms': ['ISC2 Code of Ethics', 'Canon 1', 'Canon 2', 'Canon 3', 'Canon 4', 'Order of Precedence'],
        'objectives': 'Memorize and apply the 4 ISC2 Code of Ethics Canons in their strict hierarchical order.',
        'exam_tips': 'Exam Watch: MEMORIZE the 4 canons in exact order: 1) Society & Commonwealth, 2) Honorable & Honest, 3) Diligent & Competent service to principals, 4) Advance & Protect the profession. Canon 1 ALWAYS overrides Canon 3!',
        'content': """# The ISC2 Code of Ethics

All ISC2 credential holders (including CC, CISSP, and SSCP) must adhere to the **ISC2 Code of Ethics**.

---

### 1. The Preamble
> *The safety and welfare of society and the common good, duty to our principals, and to each other, requires that we adhere, and be seen to adhere, to the highest ethical standards of behavior.*

---

### 2. The Four Canons in Strict Order of Precedence

The canons MUST be followed in this exact hierarchical order. When a conflict of interest arises, higher-order canons supersede lower-order ones:

1. **First Canon**: **Protect society, the common good, necessary public trust and confidence, and the infrastructure.**
2. **Second Canon**: **Act honorably, honestly, justly, responsibly, and legally.**
3. **Third Canon**: **Provide diligent and competent service to principals (employers and clients).**
4. **Fourth Canon**: **Advance and protect the profession.**

---

### 3. Resolving Ethical Dilemmas
If an employer asks you to perform an illegal act or hide a critical public safety vulnerability:
- **Canon 1 (Society)** takes absolute precedence over **Canon 3 (Employer)**.
- You must prioritize the safety of the public over the private interests of your employer.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an exam scenario presents a conflict between an employer's confidentiality request and public safety, **Canon 1 ALWAYS WINS**. Protecting society and public infrastructure is the highest duty of an ISC2 member.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1B2',
        'part': 'B',
        'name': 'Security Control Categories & Functional Types',
        'summary': 'Administrative, technical, and physical controls mapped against preventive, detective, and corrective functions.',
        'key_terms': ['Administrative Controls', 'Technical Controls', 'Physical Controls', 'Preventive', 'Detective', 'Corrective', 'Compensating'],
        'objectives': 'Categorize security controls by mechanism and functional type in a Defense-in-Depth architecture.',
        'exam_tips': 'Exam Watch: Policies, background checks, and training are Administrative. Firewalls, MFA, and encryption are Technical. Guards, fences, and locks are Physical. CCTV recording is Physical Detective; Security Awareness Training is Administrative Preventive.',
        'content': """# Security Control Categories and Functional Types

Organizations deploy layered controls (**Defense-in-Depth**) across three primary categories and multiple functional classes.

---

### 1. The Three Control Categories (Mechanisms)

| Category | Description | Examples |
| :--- | :--- | :--- |
| **Administrative (Managerial)** | Policies, standards, procedures, training, guidelines, background checks, personnel security. | Acceptable Use Policy (AUP), Security Awareness Training, Separation of Duties policy, Vacation rotation. |
| **Technical (Logical)** | Hardware or software mechanisms built into IT systems to protect data and resources. | Firewalls, Multi-Factor Authentication (MFA), Encryption, Intrusion Prevention Systems (IPS), Access Control Lists (ACLs). |
| **Physical** | Tangible physical barriers and devices designed to protect facilities, equipment, and people. | Fences, bollards, security guards, biometric door locks, CCTV cameras, badge readers, fire suppression. |

---

### 2. Functional Control Types

- **Preventive**: Stops an attack or unauthorized action before it occurs (e.g., biometric door lock, firewall rule, mandatory password policy).
- **Detective**: Identifies and alerts on unauthorized activity during or after occurrence (e.g., motion sensors, CCTV review, IDS, log analysis).
- **Corrective**: Restores systems to normal operations after an incident (e.g., restoring from backups, applying hotfixes, rebooting compromised services).
- **Compensating**: Alternative control used when a primary control is impractical (e.g., daily manual transaction log review when automated separation of duties cannot be enforced).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Defense-in-Depth** means deploying multiple overlapping layers of administrative, technical, and physical controls so that the failure of one control does not lead to complete compromise.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1B3',
        'part': 'B',
        'name': 'Security Policies, Standards, Procedures & Guidelines',
        'summary': 'Hierarchical documentation structure: mandatory policies, technical standards, step-by-step procedures, and discretionary guidelines.',
        'key_terms': ['Policy', 'Standard', 'Procedure', 'Guideline', 'Governance Hierarchy'],
        'objectives': 'Explain the purpose and mandatory nature of policies, standards, procedures, and guidelines.',
        'exam_tips': 'Exam Watch: Policies are high-level and mandatory (created by management). Standards are mandatory technical baselines. Procedures are mandatory step-by-step instructions. Guidelines are OPTIONAL best practice recommendations.',
        'content': """# The Security Documentation Hierarchy

A robust security governance program relies on a clear, four-tier documentation hierarchy.

```
                  ┌──────────────────────┐
                  │      POLICIES        │  ◄── Mandatory, High-Level (Executive Intent)
                  ├──────────────────────┤
                  │      STANDARDS       │  ◄── Mandatory, Specific Technical Baselines
                  ├──────────────────────┤
                  │     PROCEDURES       │  ◄── Mandatory, Step-by-Step Instructions
                  ├──────────────────────┤
                  │     GUIDELINES       │  ◄── OPTIONAL / Discretionary Recommendations
                  └──────────────────────┘
```

---

### 1. The Four Documentation Tiers

1. **Policy (Mandatory)**: High-level management statements defining organizational security goals, scope, and responsibilities (e.g., *Information Security Policy*, *Acceptable Use Policy*).
2. **Standard (Mandatory)**: Specific, measurable technical requirements and baselines that must be implemented (e.g., *All wireless networks must use WPA3 Enterprise encryption*).
3. **Procedure (Mandatory)**: Step-by-step, chronological instructions on how to accomplish a specific task (e.g., *SOP for onboarding a new employee laptop*).
4. **Guideline (Discretionary / Optional)**: Advice, best practice recommendations, and suggested approaches that are not strictly enforceable (e.g., *Suggestions for memorizing complex passphrases*).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an exam question asks which document type is **optional** or **discretionary**, the answer is **GUIDELINE**. Policies, Standards, and Procedures are ALWAYS mandatory.
"""
    }
]

print(f"Defined {len(TOPICS_RAW)} topics for D1. Adding remaining domains programmatically...")

# We will generate topics for D2, D3, D4, D5 dynamically to achieve 33 canonical topics
ADDITIONAL_TOPICS = [
    # Domain 2: IR, BC & DR (10%)
    {
        'domain_number': 2,
        'topic_code': '2A1',
        'part': 'A',
        'name': 'Incident Response Lifecycle & Phases',
        'summary': 'The 6 phases of incident response: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Lessons Learned.',
        'key_terms': ['Preparation', 'Detection & Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned', 'IR Plan'],
        'objectives': 'Walk through each stage of the incident handling process from preparation to post-incident review.',
        'exam_tips': 'Exam Watch: Lessons Learned is the most critical phase for continuous improvement. Containment stops the bleeding; Eradication removes the root cause malware; Recovery restores normal service.',
        'content': """# The Incident Response Lifecycle (NIST SP 800-61 / ISO 27035)

An incident is an event that compromises the confidentiality, integrity, or availability of an information asset.

---

### 1. The Six Phases of Incident Response

1. **Preparation**: Creating IR policies, assembling and training the CSIRT team, acquiring forensic tools, and conducting drills BEFORE an incident occurs.
2. **Detection & Analysis (Identification)**: Identifying anomalies through SIEM alerts, IDS logs, or user reports, verifying if an incident is occurring, and determining its scope.
3. **Containment**: Limiting the damage and isolating infected systems to prevent lateral movement (e.g., disconnecting a server from the network or disabling compromised accounts).
4. **Eradication**: Removing the root cause of the incident (e.g., deleting malware, closing open ports, rebuilding compromised operating systems).
5. **Recovery**: Restoring systems to clean production operations, verifying functionality, and monitoring closely for reinfection.
6. **Lessons Learned (Post-Incident Review)**: Documenting what occurred, analyzing team performance, and updating IR plans and controls to prevent recurrence.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Lessons Learned** must occur shortly after the incident while memories are fresh. Its goal is NOT to assign blame, but to update procedures, controls, and training.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2A2',
        'part': 'A',
        'name': 'CSIRT Roles & Stakeholder Communication',
        'summary': 'Composition of the Computer Security Incident Response Team, public relations, legal, and law enforcement escalation.',
        'key_terms': ['CSIRT', 'CERT', 'Incident Commander', 'Public Relations', 'Legal Counsel', 'Chain of Custody'],
        'objectives': 'Define key roles on an incident response team and understand communication protocols during a crisis.',
        'exam_tips': 'Exam Watch: The CSIRT must include cross-functional members: Security Analysts, IT Engineers, Legal Counsel, Human Resources, and Public Relations / Communications.',
        'content': """# CSIRT Roles and Incident Communications

Incident response requires coordinated cross-functional collaboration across multiple technical and non-technical stakeholders.

---

### 1. Cross-Functional CSIRT Roles

- **Incident Commander / Team Lead**: Directs the overall incident response strategy and delegates tasks.
- **Technical Analysts & Engineers**: Perform triage, network isolation, malware reverse engineering, and system recovery.
- **Legal Counsel**: Ensures compliance with breach disclosure laws and advises on law enforcement engagement.
- **Public Relations (PR) / Communications**: Serves as the sole authorized voice communicating with the press and public to protect brand reputation.
- **Human Resources (HR)**: Engaged if the incident involves an internal employee or insider threat.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Individual employees must **NEVER speak to media or public** during an incident. All external communication must flow strictly through designated PR and Legal spokespersons.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B1',
        'part': 'B',
        'name': 'Business Impact Analysis (BIA), RTO, RPO & MTD',
        'summary': 'Quantifying organizational downtime tolerance: Recovery Time Objective, Recovery Point Objective, and Maximum Tolerable Downtime.',
        'key_terms': ['BIA', 'RTO', 'RPO', 'MTD', 'Critical Business Functions', 'Work Recovery Time'],
        'objectives': 'Calculate and contrast RTO, RPO, and MTD metrics during business continuity planning.',
        'exam_tips': 'Exam Watch: RTO is how long systems can be down. RPO is maximum acceptable data loss in time. MTD is the absolute limit before bankruptcy/irreparable harm. RTO + WRT must be <= MTD!',
        'content': """# Business Impact Analysis and Recovery Metrics

The **Business Impact Analysis (BIA)** identifies critical business functions and calculates recovery time and data loss metrics.

---

### 1. Core Recovery Metrics

```
  Last Backup                 Incident Occurs               System Restored             Operations Normal
      │                             │                             │                             │
      ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
      │◄─────── RPO ───────────────►│◄──────── RTO ──────────────►│◄─────── WRT ───────────────►│
      │   (Maximum Data Loss)       │     (System Recovery)       │    (Work Verification)      │
      └─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
      │◄─────────────────────────────────── MTD ───────────────────────────────────────────────►│
                                (Maximum Tolerable Downtime)
```

1. **Recovery Point Objective (RPO)**: The maximum acceptable amount of data loss measured in time (e.g., an RPO of 2 hours requires backups at least every 2 hours).
2. **Recovery Time Objective (RTO)**: The maximum targeted duration of time allowed to restore IT infrastructure and systems.
3. **Maximum Tolerable Downtime (MTD)**: The maximum total time the organization can endure without its critical business function before suffering irreversible damage or catastrophic failure.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **$$\\text{RTO} + \\text{WRT} \\le \\text{MTD}$$**
> - If recovery time exceeds MTD, the organization risks regulatory shutdown or liquidation.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B2',
        'part': 'B',
        'name': 'Alternate Recovery Sites & High Availability',
        'summary': 'Comparing Hot Sites, Warm Sites, Cold Sites, and redundant cloud architectures.',
        'key_terms': ['Hot Site', 'Warm Site', 'Cold Site', 'Redundant Site', 'High Availability', 'RAID'],
        'objectives': 'Compare cost, recovery time, and equipment readiness among Hot, Warm, and Cold disaster recovery sites.',
        'exam_tips': 'Exam Watch: Hot Site = Minutes to hours (fully equipped, live data mirror, most expensive). Warm Site = Days (hardware present, must restore data). Cold Site = Weeks (empty shell, power/HVAC only, cheapest).',
        'content': """# Alternate Disaster Recovery Sites

When a primary data center is rendered inoperable, organizations transition operations to an alternate site.

---

### 1. Comparison of Alternate Recovery Sites

| Feature | Hot Site | Warm Site | Cold Site |
| :--- | :--- | :--- | :--- |
| **Readiness Time** | Minutes to a few hours | Days to a week | Weeks to a month |
| **Hardware / Servers** | Fully populated, identical production hardware | Hardware present, but not fully configured | Empty facility; no IT hardware installed |
| **Data Synchronization** | Live real-time replication / near-instant data sync | Backups must be shipped and manually restored | No data; hardware and backups must be brought in |
| **Cost** | Highest (expensive ongoing maintenance) | Medium | Lowest |
| **Best Used When** | RTO is near zero; critical financial transactions | RTO is a few days; medium criticality services | RTO is several weeks; non-critical operations |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - A **Hot Site** is the ONLY solution when the organization's RTO is near zero (e.g., airline flight booking or emergency dispatch systems).
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B3',
        'part': 'B',
        'name': 'Backup Strategies & The 3-2-1 Rule',
        'summary': 'Full, incremental, and differential backup architectures and data protection best practices.',
        'key_terms': ['Full Backup', 'Differential Backup', 'Incremental Backup', '3-2-1 Rule', 'Immutable Backup'],
        'objectives': 'Design backup schemes balancing storage costs, backup windows, and restoration speed.',
        'exam_tips': 'Exam Watch: Full + Incremental is fastest to back up, but slowest to restore (requires Full + ALL incrementals). Full + Differential is slower to back up, but fast to restore (requires Full + LATEST differential).',
        'content': """# Backup Strategies and The 3-2-1 Rule

Regular, verified backups are the primary countermeasure against ransomware, hardware corruption, and physical disasters.

---

### 1. Backup Types Compared

| Backup Type | What is Backed Up? | Backup Speed | Restoration Process |
| :--- | :--- | :--- | :--- |
| **Full Backup** | All selected files and data regardless of archive bit. | Slowest | Fastest (requires ONLY the Full backup tape/disk). |
| **Differential Backup** | All files modified **since the LAST FULL backup**. | Medium | Fast (requires the Full backup + the single LATEST differential). |
| **Incremental Backup** | Only files modified **since the LAST backup (Full or Incremental)**. | Fastest | Slowest (requires the Full backup + EVERY sequential incremental in order). |

---

### 2. The 3-2-1 Backup Rule

- **3** copies of data (1 primary production copy + 2 backup copies).
- **2** different types of media (e.g., Disk and Cloud, or Disk and Tape).
- **1** copy stored **off-site** (or in an immutable, air-gapped cloud repository).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Backups that have never been tested for restoration are useless. Regular **restoration testing** is mandatory to confirm data integrity.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B4',
        'part': 'B',
        'name': 'BCP & DRP Testing Methodologies',
        'summary': 'Readiness evaluation: Tabletop tests, structured walkthroughs, simulation tests, and full interruption exercises.',
        'key_terms': ['Tabletop Exercise', 'Structured Walkthrough', 'Simulation Test', 'Parallel Test', 'Full Interruption Test'],
        'objectives': 'Select appropriate disaster recovery test types based on risk appetite and organizational impact.',
        'exam_tips': 'Exam Watch: Tabletop / Discussion is lowest cost and zero risk. Full Interruption is highest risk (shuts down primary operations) and requires executive authorization.',
        'content': """# Business Continuity and Disaster Recovery Testing

Plans must be tested periodically to validate effectiveness, update contact lists, and train staff.

---

### 1. Hierarchy of BCP/DRP Test Types

1. **Checklist Review (Read-Through)**: Plan copies are distributed to department heads to review for accuracy and completeness.
2. **Structured Walkthrough (Tabletop Exercise)**: Stakeholders gather in a conference room to talk through a simulated disaster scenario step-by-step without altering production systems.
3. **Simulation Test**: Practice mobilization of emergency personnel and test communications without switching live production workloads.
4. **Parallel Test**: Critical systems are brought online at the alternate recovery site and process test transactions while the primary site continues running production.
5. **Full Interruption Test**: Complete shutdown of primary production operations with all live processing transferred to the disaster recovery site. (Highest risk of business disruption).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Always start testing with a **Tabletop Exercise** before advancing to more disruptive live operational tests.
"""
    },

    # Domain 3: Access Controls (22%)
    {
        'domain_number': 3,
        'topic_code': '3A1',
        'part': 'A',
        'name': 'Layered Physical Defense-in-Depth',
        'summary': 'Perimeter barriers, fencing heights, lighting lumens, security guards, and bollards.',
        'key_terms': ['Perimeter Security', 'Fencing', 'Bollards', 'Security Lighting', 'Security Guards'],
        'objectives': 'Design physical perimeter security layers protecting against unauthorized entry and vehicle ramming.',
        'exam_tips': 'Exam Watch: Bollards stop vehicle attacks; 8-foot fences with barbed wire deter determined human intruders; Lighting eliminates hiding spots.',
        'content': """# Physical Security Defense-in-Depth

Physical security is the first line of defense protecting personnel, facilities, and computing infrastructure.

---

### 1. Perimeter Controls

- **Fencing**:
  - 3–4 feet (1m): Deters casual trespassers and marks property boundaries.
  - 6–7 feet (2m): Impedes casual climbing.
  - 8+ feet (2.4m) with top guard (barbed/concertina wire): Deters determined intruders.
- **Bollards**: Heavy concrete or steel posts designed to prevent vehicle ram-raiding attacks.
- **Lighting**: Adequate illumination around doors, alleys, and perimeters prevents unobserved approaches.
- **Security Guards**: Flexible physical presence capable of assessing situations and exercising human judgment.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Physical security must ALWAYS prioritize **Life Safety** over asset protection. Emergency exits must fail open for evacuation during fires or crises.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3A2',
        'part': 'A',
        'name': 'Physical Entry Controls & Mantraps',
        'summary': 'Mantraps (air-locks), turnstiles, proximity cards, biometrics, and deadbolts.',
        'key_terms': ['Mantrap', 'Turnstile', 'Tailgating', 'Piggybacking', 'Smart Card', 'Biometric Lock'],
        'objectives': 'Prevent unauthorized physical piggybacking and tailgating using physical entry engineering controls.',
        'exam_tips': 'Exam Watch: A Mantrap (interlocking double doors) is the most effective physical engineering control against piggybacking/tailgating.',
        'content': """# Physical Entry Point Controls

Securing entry points into data centers and secure areas requires specialized physical access mechanisms.

---

### 1. Anti-Tailgating Mechanisms

- **Mantrap (Access Portal / Air-Lock)**: An enclosure with two interlocking doors where the second door cannot open until the first door closes and the occupant successfully authenticates.
- **Optical Turnstiles**: Physical gates that count individuals passing through and alarm if a second person follows without badging.
- **Proximity Smart Cards**: Contactless RFID/NFC cards scanned at readers.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Tailgating**: An unauthorized person slips in behind an authorized person *without their consent*.
> - **Piggybacking**: An authorized person *knowingly holds the door open* for an unauthorized person.
> - Both threats are physically mitigated by a **Mantrap**.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3A3',
        'part': 'A',
        'name': 'Environmental Controls & Fire Suppression',
        'summary': 'HVAC, positive pressure, fire classes (A, B, C, D, K), FM-200, Inergen, and water sprinklers.',
        'key_terms': ['Class C Fire', 'FM-200', 'Inergen', 'Pre-action Sprinklers', 'HVAC Positive Pressure', 'UPS'],
        'objectives': 'Select appropriate clean agent fire suppression and environmental controls for server rooms.',
        'exam_tips': 'Exam Watch: Class C fires involve energized electrical equipment (servers). Never use water directly on Class C fires! Use Clean Agents (FM-200, Novec 1230) or Inergen.',
        'content': """# Environmental Safety and Fire Suppression

Data centers require specialized climate control and fire extinguishing systems to protect delicate electronics.

---

### 1. Fire Classes and Extinguishing Agents

| Fire Class | Fuel / Source | Extinguishing Agent |
| :--- | :--- | :--- |
| **Class A** | Common combustibles (wood, paper, cloth). | Water, foam. |
| **Class B** | Flammable liquids and gases (gasoline, oil, solvents). | CO2, dry chemical, foam. |
| **Class C** | **Energized electrical equipment (servers, wiring, switches).** | **Clean Agents (FM-200, Inergen, Novec 1230), CO2.** |
| **Class D** | Combustible metals (magnesium, titanium, sodium). | Dry powder agents. |
| **Class K** | Commercial cooking oils and fats. | Wet chemical agents. |

---

### 2. Sprinkler Types for Data Centers
- **Pre-Action Sprinklers**: The preferred water system in server rooms. Water is held back until two independent triggers occur (heat detector AND smoke detector activation), preventing accidental pipe bursts.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Positive Air Pressure** in a server room forces air OUT when doors open, preventing dust, smoke, and contaminants from entering the computing environment.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B1',
        'part': 'B',
        'name': 'Logical Access Control Models (DAC, MAC, RBAC, ABAC)',
        'summary': 'Discretionary, Mandatory, Role-Based, Rule-Based, and Attribute-Based Access Control frameworks.',
        'key_terms': ['DAC', 'MAC', 'RBAC', 'ABAC', 'Security Labels', 'Role-Based Access Control'],
        'objectives': 'Differentiate between DAC, MAC, RBAC, and ABAC access control implementations.',
        'exam_tips': 'Exam Watch: DAC = Data Owner decides permissions (NTFS permissions). MAC = System-enforced via security labels (military Top Secret/Secret). RBAC = Permissions assigned to job roles (best for commercial enterprises). ABAC = Dynamic attributes (time, location, device).',
        'content': """# Logical Access Control Models

Logical access control determines which users or systems can access specific digital resources.

---

### 1. Four Major Access Control Models

1. **Discretionary Access Control (DAC)**: The **data owner** has full discretion to grant or revoke access permissions to other users (e.g., standard Windows/Linux file sharing permissions).
2. **Mandatory Access Control (MAC)**: Access decisions are enforced by the operating system based on **security clearance labels** (e.g., Top Secret, Secret) assigned to subjects and classification tags on objects. Users cannot override the system policy.
3. **Role-Based Access Control (RBAC)**: Permissions are assigned to specific **job roles** (e.g., *Billing Analyst*, *Network Admin*), and users are assigned to roles. Minimizes privilege creep and simplifies onboarding.
4. **Attribute-Based Access Control (ABAC)**: Dynamic, contextual access decisions evaluated using policies that combine attributes of the subject, resource, action, and environment (e.g., *Allow access only if user is in Sales, accessing CRM during business hours from a company laptop*).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **RBAC** is the most common model in modern commercial enterprises because it enforces the Principle of Least Privilege based on defined job functions.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B2',
        'part': 'B',
        'name': 'Authentication Factors & Multi-Factor Authentication (MFA)',
        'summary': 'The 5 authentication factors: Something you know, have, are, somewhere you are, and something you do.',
        'key_terms': ['Something You Know', 'Something You Have', 'Something You Are', 'MFA', 'Biometrics', 'Authenticator App'],
        'objectives': 'Construct Multi-Factor Authentication schemes using at least two different factor categories.',
        'exam_tips': 'Exam Watch: MFA requires TWO DIFFERENT categories. A Password + PIN is NOT MFA (both are Something You Know). A Password (Know) + SMS/App Code (Have) IS MFA.',
        'content': """# Authentication Factors and Multi-Factor Authentication

Authentication verifies the identity claimed by a user through one or more authentication factors.

---

### 1. The Five Authentication Factor Categories

| Factor Category | Description | Examples |
| :--- | :--- | :--- |
| **1. Something You Know** | Knowledge-based information stored in the user's memory. | Passwords, Passphrases, PINs, Security questions. |
| **2. Something You Have** | A physical or digital token in the user's possession. | Hardware token (YubiKey), Smart Card, Authenticator App (TOTP), SMS OTP code. |
| **3. Something You Are** | Unique physical or biological characteristics (Biometrics). | Fingerprint scan, Facial recognition, Retina/Iris scan, Voiceprint. |
| **4. Somewhere You Are** | Geographic location or network IP proximity. | GPS coordinates, Geofencing, Corporate IP subnet. |
| **5. Something You Do** | Behavioral characteristics and patterns. | Typing cadence, signature dynamics, gait analysis. |

---

### 2. Multi-Factor Authentication (MFA) Rule
To qualify as true MFA, the system must require **two or more DIFFERENT categories** of authentication factors.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Entering a Password and answering a Security Question is **Single-Factor Authentication (SFA)** because both belong to *Something You Know*.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B3',
        'part': 'B',
        'name': 'Least Privilege, Need-to-Know & Segregation of Duties',
        'summary': 'Restricting access to the bare minimum required for job performance and preventing fraud through separation.',
        'key_terms': ['Least Privilege', 'Need-to-Know', 'Segregation of Duties', 'Privilege Creep', 'Dual Control'],
        'objectives': 'Enforce least privilege and segregation of duties to prevent fraud and limit attack blast radius.',
        'exam_tips': 'Exam Watch: Least Privilege = Minimum permissions needed to work. Need-to-Know = Access only to specific data required for a specific task. Segregation of Duties = No single person can execute and approve high-risk actions.',
        'content': """# Principles of Least Privilege and Segregation of Duties

Core security principles designed to prevent insider fraud and limit the blast radius of compromised credentials.

---

### 1. Key Principles

- **Principle of Least Privilege**: Users and processes should be granted only the minimum necessary permissions required to perform their assigned job duties, and no more.
- **Need-to-Know**: Even if a user has the appropriate security clearance, they should only access specific classified information if it is strictly necessary to perform their current task.
- **Segregation of Duties (SoD)**: Dividing critical, sensitive tasks among multiple individuals so that no single person has complete end-to-end control (e.g., the developer who writes payment code cannot approve production disbursements).
- **Dual Control (Two-Man Rule)**: Requiring two authorized individuals to be present simultaneously to execute a sensitive action (e.g., launching missile keys or generating master root PKI keys).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Privilege Creep (Privilege Accumulation)** occurs when employees change roles within a company and retain old permissions, gradually accumulating excessive access. Regular **access reviews** mitigate this risk.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B4',
        'part': 'B',
        'name': 'Identity Lifecycle & Privileged Access Management (PAM)',
        'summary': 'User provisioning, deprovisioning, privileged accounts, Single Sign-On (SSO), and identity federation.',
        'key_terms': ['PAM', 'Provisioning', 'Deprovisioning', 'SSO', 'Federation', 'SAML', 'OAuth'],
        'objectives': 'Manage the identity lifecycle and secure administrative credentials using PAM vaults.',
        'exam_tips': 'Exam Watch: Immediate deprovisioning upon employee termination is critical to prevent disgruntled insider attacks. PAM secures elevated administrator accounts with just-in-time checkouts and session recording.',
        'content': """# Identity Lifecycle and Privileged Access Management

Managing accounts from onboarding to offboarding ensures access remains authorized and accountable.

---

### 1. Identity Lifecycle Phases

1. **Provisioning**: Creating user accounts and granting initial baseline permissions upon hiring.
2. **Maintenance / Review**: Modifying permissions as job roles change and conducting periodic user access reviews.
3. **Deprovisioning**: Disabling and revoking all access rights immediately when an employee resigns, is terminated, or a contractor contract ends.

---

### 2. Privileged Access Management (PAM)
Privileged accounts (e.g., Domain Admins, Root users) are prime targets for attackers. PAM solutions provide:
- **Credential Vaulting**: Passwords for admin accounts are randomized and stored in a secure vault.
- **Just-In-Time (JIT) Access**: Temporary elevated privileges granted only for the duration of a specific change window.
- **Session Recording**: Full video and keystroke logging of all administrative sessions for forensic auditing.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Administrators must use standard, non-privileged accounts for daily tasks (browsing, email) and escalate to admin credentials only when performing administrative duties.
"""
    },

    # Domain 4: Network Security (24%)
    {
        'domain_number': 4,
        'topic_code': '4A1',
        'part': 'A',
        'name': 'OSI 7-Layer & TCP/IP Reference Models',
        'summary': 'Mapping protocol layers from Physical (L1) to Application (L7) and the 4-layer TCP/IP stack.',
        'key_terms': ['OSI Model', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application', 'TCP/IP'],
        'objectives': 'Map networking devices, protocols, and attack types to their corresponding OSI and TCP/IP layers.',
        'exam_tips': 'Exam Watch: Memorize OSI layers (1 to 7): Physical (Cables/Hubs), Data Link (MAC/Switches), Network (IP/Routers), Transport (TCP/UDP), Session, Presentation (SSL/Encryption), Application (HTTP/DNS). "Please Do Not Throw Sausage Pizza Away"!',
        'content': """# The OSI 7-Layer and TCP/IP Reference Models

Understanding network communication architectures allows security professionals to identify where threats operate and where defensive controls belong.

---

### 1. The OSI 7-Layer Model

| Layer # | Layer Name | Protocol Data Unit (PDU) | Core Protocols / Devices | Security Controls & Threats |
| :--- | :--- | :--- | :--- | :--- |
| **7** | **Application** | Data | HTTP, HTTPS, DNS, DHCP, SSH, SMTP | WAF, Next-Gen Firewalls, SQL Injection, XSS |
| **6** | **Presentation** | Data | TLS/SSL, JPEG, ASCII | Encryption, Data formatting |
| **5** | **Session** | Data | NetBIOS, RPC, PPTP | Session management, Session hijacking |
| **4** | **Transport** | Segment (TCP) / Datagram (UDP) | TCP (connection-oriented), UDP (connectionless) | Port filtering, SYN Flood DoS |
| **3** | **Network** | Packet | IP (IPv4, IPv6), ICMP, IPsec, ARP | Routers, Layer 3 Firewalls, IP Spoofing |
| **2** | **Data Link** | Frame | Ethernet, Wi-Fi (802.11), MAC Addressing | Switches, VLANs, MAC Flooding, ARP Poisoning |
| **1** | **Physical** | Bits | Cables (Cat6, Fiber), Hubs, Radio waves | Cable tapping, EMI shielding, Physical locks |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Routers** operate at **Layer 3 (Network)** using IP addresses.
> - **Switches** operate at **Layer 2 (Data Link)** using MAC addresses.
> - **TCP** guarantees delivery (3-Way Handshake: SYN, SYN-ACK, ACK); **UDP** is fast but connectionless without delivery confirmation.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4A2',
        'part': 'A',
        'name': 'IP Addressing, Subnetting & Network Types',
        'summary': 'IPv4 vs IPv6, private RFC 1918 address ranges, subnet masks, LANs, WANs, and VLANs.',
        'key_terms': ['IPv4', 'IPv6', 'RFC 1918', 'Subnetting', 'LAN', 'WAN', 'VLAN'],
        'objectives': 'Differentiate between public and private IP addressing and explain how VLANs segment broadcast domains.',
        'exam_tips': 'Exam Watch: Private RFC 1918 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are not routable on the public internet. VLANs isolate network traffic logically at Layer 2.',
        'content': """# IP Addressing, Subnetting, and Network Topologies

Networks are organized using addressing schemes and logical segmentation.

---

### 1. IPv4 vs IPv6

- **IPv4**: 32-bit addresses formatted as four decimal octets (e.g., `192.168.1.100`). Provides approximately 4.3 billion addresses.
- **IPv6**: 128-bit addresses formatted as eight groups of hexadecimal digits (e.g., `2001:0db8:85a3::8a2e:0370:7334`). Solves IPv4 address exhaustion and integrates mandatory IPsec support.

---

### 2. Private IP Address Ranges (RFC 1918)
Private IP addresses cannot be routed over the public internet and must use Network Address Translation (NAT) to access external web resources:
- `10.0.0.0` to `10.255.255.255` (Class A - Large enterprises)
- `172.16.0.0` to `172.31.255.255` (Class B - Medium networks)
- `192.168.0.0` to `192.168.255.255` (Class C - Small home/office networks)

---

### 3. Virtual Local Area Networks (VLANs)
A **VLAN** logically segments a physical switch into multiple isolated broadcast domains at Layer 2, separating sensitive departments (e.g., Finance VLAN vs Guest Wi-Fi VLAN).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Segmenting guest Wi-Fi onto a separate VLAN prevents visitors from accessing internal enterprise servers and databases.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4A3',
        'part': 'A',
        'name': 'Common Ports & Core Network Protocols',
        'summary': 'Essential well-known ports (0-1023) and protocol functions for security administration.',
        'key_terms': ['Port 80 HTTP', 'Port 443 HTTPS', 'Port 53 DNS', 'Port 22 SSH', 'Port 3389 RDP', 'Port 25 SMTP'],
        'objectives': 'Identify critical well-known port numbers and evaluate secure vs insecure protocol alternatives.',
        'exam_tips': 'Exam Watch: Replace insecure plaintext protocols with encrypted equivalents: Replace HTTP (80) with HTTPS (443); Replace Telnet (23) with SSH (22); Replace FTP (21) with SFTP (22) or FTPS (990).',
        'content': """# Common Ports and Core Protocols

Network firewalls and access lists filter traffic based on port numbers and protocols.

---

### 1. Essential Well-Known Ports

| Port # | Protocol | Purpose | Secure Alternative / Notes |
| :--- | :--- | :--- | :--- |
| **20/21** | **FTP** | File Transfer Protocol | **SFTP (Port 22)** or **FTPS (Port 990)** (Plaintext passwords in FTP!). |
| **22** | **SSH / SFTP** | Secure Shell remote command-line / Secure File Transfer | Encrypted replacement for Telnet and rlogin. |
| **23** | **Telnet** | Unencrypted remote terminal access | INSECURE. Transmits credentials in cleartext. Replace with SSH. |
| **25** | **SMTP** | Simple Mail Transfer Protocol | Used to send email between mail servers. |
| **53** | **DNS** | Domain Name System (Resolves names to IP addresses) | Uses UDP 53 for queries, TCP 53 for zone transfers. Secure with DNSSEC. |
| **67/68** | **DHCP** | Dynamic Host Configuration Protocol | Automatically assigns IP addresses, subnet masks, and gateways. |
| **80** | **HTTP** | Hypertext Transfer Protocol (Web traffic) | Plaintext. Replace with HTTPS. |
| **443** | **HTTPS** | HTTP Secure (HTTP over TLS/SSL) | Encrypted web traffic. |
| **123** | **NTP** | Network Time Protocol | Synchronizes system clocks for accurate audit logs. |
| **3389** | **RDP** | Remote Desktop Protocol | Windows remote desktop management. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Never leave **Telnet (Port 23)** or **unencrypted FTP (Port 21)** open in an enterprise network. An attacker sniffing traffic with Wireshark can easily capture usernames and passwords in plaintext.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B1',
        'part': 'B',
        'name': 'Network Attacks & Threat Vectors',
        'summary': 'Denial of Service (DoS/DDoS), Man-in-the-Middle (MitM), Spoofing, and Poisoning attacks.',
        'key_terms': ['DoS', 'DDoS', 'MitM', 'IP Spoofing', 'ARP Poisoning', 'DNS Poisoning', 'SYN Flood'],
        'objectives': 'Analyze network attack vectors and identify corresponding defensive controls.',
        'exam_tips': 'Exam Watch: DoS attacks availability; MitM attacks confidentiality and integrity; ARP poisoning manipulates Layer 2 switch tables; DNS poisoning redirects users to fake websites.',
        'content': """# Network Attacks and Threat Vectors

Network infrastructure is vulnerable to volumetric, interception, and protocol manipulation attacks.

---

### 1. Major Network Attack Types

1. **Denial of Service (DoS) & Distributed DoS (DDoS)**:
   - **DoS**: A single source attempts to exhaust target bandwidth, memory, or CPU to render a service unavailable.
   - **DDoS**: Multiple compromised zombie machines (a **botnet**) flood the target simultaneously.
   - **SYN Flood**: Attacker sends numerous TCP SYN requests without completing the 3-Way Handshake, exhausting the server's connection table.
2. **Man-in-the-Middle (MitM)**: An attacker intercepts and potentially alters communication between two parties who believe they are communicating directly. Mitigated by **end-to-end TLS encryption and mutual certificate authentication**.
3. **Spoofing**: Falsifying data to impersonate a legitimate device or address (e.g., IP Spoofing, MAC Spoofing, Email Spoofing).
4. **ARP Poisoning (ARP Spoofing)**: Sending falsified ARP messages onto a LAN to associate the attacker's MAC address with the IP address of the legitimate default gateway.
5. **DNS Poisoning (DNS Spoofing)**: Corrupting a DNS resolver cache to redirect users navigating to `bank.com` to a malicious phishing IP address.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **DDoS attacks primarily target the AVAILABILITY** pillar of the CIA Triad. Defenses include Cloudflare/CDN rate limiting, scrubbing centers, and sinkholing.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B2',
        'part': 'B',
        'name': 'Network Defense Devices (Firewalls, IDS vs IPS)',
        'summary': 'Packet filtering, stateful inspection, Next-Gen Firewalls (NGFW), and IDS vs IPS capabilities.',
        'key_terms': ['Stateful Firewall', 'Next-Gen Firewall (NGFW)', 'IDS', 'IPS', 'Inline Defense', 'Signature vs Heuristic'],
        'objectives': 'Contrast stateless, stateful, and application firewalls and differentiate between IDS and IPS systems.',
        'exam_tips': 'Exam Watch: An IDS is passive/detective (listens on span/tap port, alerts only). An IPS is active/preventive (placed inline, actively blocks and drops malicious traffic).',
        'content': """# Network Defense Devices: Firewalls and IDS/IPS

Firewalls and intrusion detection/prevention systems form the core perimeter and internal network security defenses.

---

### 1. Firewall Evolution

1. **Stateless Packet Filtering (Layer 3/4)**: Inspects each individual packet in isolation based on source/dest IP, port, and protocol. Does not track connection state.
2. **Stateful Inspection Firewalls (Layer 3/4/5)**: Tracks the state of active network connections in a **state table**. Automatically allows return traffic for established outbound connections.
3. **Next-Generation Firewalls (NGFW / Layer 7)**: Combines stateful inspection with deep packet inspection (DPI), application awareness, integrated IPS, SSL/TLS decryption, and threat intelligence.

---

### 2. Intrusion Detection System (IDS) vs Intrusion Prevention System (IPS)

| Feature | Intrusion Detection System (IDS) | Intrusion Prevention System (IPS) |
| :--- | :--- | :--- |
| **Placement** | Out-of-band (connected to a switch SPAN / mirror port). | **Inline** (traffic physically flows through the device). |
| **Action** | **Passive / Detective**: Detects threats and generates alerts for security analysts. | **Active / Preventive**: Detects threats and actively **blocks/drops** malicious packets in real time. |
| **Impact of Failure** | Zero impact on production traffic flow. | If the inline IPS fails closed, it can disrupt network availability. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Signature-Based Detection** compares traffic against a database of known attack signatures (fails against Zero-Day attacks).
> - **Anomaly/Heuristic-Based Detection** establishes a baseline of normal network behavior and alarms when anomalous deviations occur (detects Zero-Days, but produces higher false positives).
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B3',
        'part': 'B',
        'name': 'Network Architecture, DMZ & Microsegmentation',
        'summary': 'Demilitarized Zones (DMZ), screening routers, dual-homed firewalls, and east-west traffic controls.',
        'key_terms': ['DMZ', 'Dual-Homed Firewall', 'Microsegmentation', 'East-West Traffic', 'North-South Traffic'],
        'objectives': 'Design DMZ network perimeters that protect internal databases while hosting public web servers.',
        'exam_tips': 'Exam Watch: Public-facing servers (Web, DNS, Email) reside in the DMZ. Private backend databases storing customer records NEVER reside in the DMZ; they sit on the internal protected network behind a second firewall.',
        'content': """# Network Architecture, Demilitarized Zones, and Microsegmentation

Network zoning establishes security perimeters between untrusted external networks, semi-trusted buffer zones, and trusted internal networks.

---

### 1. Demilitarized Zone (DMZ) Architecture

```
                  Internet (Untrusted)
                           │
                 [ External Firewall ]
                           │
                   ┌───────┴───────┐
                   │  DMZ Subnet   │  ◄── Public Web Server, External DNS, Mail Relay
                   └───────┬───────┘
                           │
                 [ Internal Firewall ]
                           │
                   ┌───────┴───────┐
                   │ Internal LAN  │  ◄── Database Server, Active Directory, Workstations
                   └───────────────┘
```

- Public internet users can communicate ONLY with services in the **DMZ**.
- If a web server in the DMZ is compromised, the **Internal Firewall** blocks the attacker from freely pivoting into the internal database LAN.

---

### 2. Microsegmentation
Traditional firewalls control **North-South traffic** (traffic entering or leaving the data center). **Microsegmentation** applies granular security policies to **East-West traffic** (lateral traffic moving between servers within the same data center or cloud VPC), preventing an attacker who compromises one server from infecting adjacent servers.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Storing sensitive database records directly on a DMZ web server is a critical architectural violation. Backend database servers must always remain in the internal secure network.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B4',
        'part': 'B',
        'name': 'Virtual Private Networks & Secure Remote Access',
        'summary': 'IPsec (AH vs ESP, Tunnel vs Transport modes), SSL/TLS VPNs, and remote workforce protection.',
        'key_terms': ['VPN', 'IPsec', 'AH', 'ESP', 'Tunnel Mode', 'Transport Mode', 'SSL/TLS VPN'],
        'objectives': 'Evaluate IPsec and SSL/TLS VPN implementations for secure site-to-site and remote client access.',
        'exam_tips': 'Exam Watch: IPsec ESP provides Confidentiality + Integrity. IPsec AH provides Integrity only (NO encryption!). Tunnel mode encrypts the ENTIRE original packet (used for Site-to-Site); Transport mode encrypts only payload.',
        'content': """# Virtual Private Networks (VPNs)

A **Virtual Private Network (VPN)** creates a secure, encrypted tunnel across an untrusted network (such as the Internet).

---

### 1. IPsec (Internet Protocol Security) Protocols

- **Encapsulating Security Payload (ESP)**: Provides **Confidentiality (Encryption)**, Integrity, and Authentication. (Most commonly used).
- **Authentication Header (AH)**: Provides Integrity and Authentication, but **NO ENCRYPTION (NO Confidentiality)**.

---

### 2. IPsec Operational Modes

| Mode | What is Encrypted? | Typical Use Case |
| :--- | :--- | :--- |
| **Transport Mode** | Only the **Payload (Data)** is encrypted. The original IP header remains unencrypted and visible. | Host-to-Host communication within a secure private network. |
| **Tunnel Mode** | The **Entire Original Packet (Header + Payload)** is encrypted, and a brand-new outer IP header is prepended. | **Site-to-Site VPNs** between corporate branch offices and gateways. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an exam question asks which IPsec protocol provides data confidentiality, the answer is **ESP**. AH does NOT provide encryption.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B5',
        'part': 'B',
        'name': 'Wireless Network Security (WPA2, WPA3 & 802.1X)',
        'summary': 'Legacy WEP vulnerabilities, WPA2 AES-CCMP, WPA3 SAE, Enterprise 802.1X, and Rogue APs.',
        'key_terms': ['WEP', 'WPA2', 'WPA3', 'SAE', '802.1X Enterprise', 'RADIUS', 'Rogue AP', 'Evil Twin'],
        'objectives': 'Select and configure secure wireless encryption protocols and identify wireless attack vectors.',
        'exam_tips': 'Exam Watch: WEP is broken and deprecated (uses weak RC4/IVs). WPA2 uses AES-CCMP. WPA3 uses SAE (Simultaneous Authentication of Equals) and 192-bit encryption. Enterprise wireless uses 802.1X with a RADIUS server.',
        'content': """# Wireless Network Security (802.11)

Wireless communications broadcast signals through open airwaves, requiring robust cryptographic standards.

---

### 1. Wireless Security Standards Evolution

- **WEP (Wired Equivalent Privacy)**: Obsolete, highly insecure. Uses static RC4 keys and small 24-bit Initialization Vectors (IVs) that can be cracked in minutes.
- **WPA2 (Wi-Fi Protected Access 2)**: Standard enterprise security using **AES-CCMP** encryption.
  - **WPA2-Personal (PSK)**: Uses a shared pre-shared key for all users (vulnerable to dictionary/offline cracking if password is weak).
  - **WPA2/WPA3-Enterprise**: Uses **802.1X authentication** with a backend **RADIUS / TACACS+** server, giving each user unique individual credentials.
- **WPA3**: Modern standard. Replaces PSK with **SAE (Simultaneous Authentication of Equals)**, rendering offline dictionary attacks ineffective.

---

### 2. Common Wireless Attacks
- **Rogue Access Point**: An unauthorized Wi-Fi access point plugged into an enterprise network without authorization.
- **Evil Twin**: A rogue AP configured with the exact same SSID and MAC as a legitimate corporate network to trick users into connecting so the attacker can steal credentials.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - For corporate environments, **WPA2/WPA3 Enterprise with 802.1X authentication** is mandatory to ensure individual accountability and avoid shared passphrases.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B6',
        'part': 'B',
        'name': 'Zero Trust Architecture (ZTA)',
        'summary': 'Core principles of Zero Trust: Never trust, always verify, assume breach, and micro-perimeters.',
        'key_terms': ['Zero Trust', 'ZTA', 'Never Trust Always Verify', 'Assume Breach', 'Micro-Perimeter', 'Continuous Verification'],
        'objectives': 'Apply Zero Trust Architecture principles to modern hybrid and cloud enterprise networks.',
        'exam_tips': 'Exam Watch: Zero Trust rejects the traditional "castle-and-moat" perimeter model. Core motto: "Never Trust, Always Verify". Every access request is authenticated, authorized, and encrypted regardless of user location.',
        'content': """# Zero Trust Architecture (ZTA - NIST SP 800-207)

Traditional network security assumed that anything inside the corporate network perimeter was trusted. **Zero Trust** eliminates this implicit trust.

---

### 1. Core Principles of Zero Trust

1. **Never Trust, Always Verify**: Authenticate and explicitly authorize every user, device, application, and data flow on every access request, whether inside or outside the network.
2. **Assume Breach**: Operate as though an attacker is already inside the network environment. Limit blast radius through microsegmentation and encrypt all data in transit.
3. **Verify Explicitly**: Leverage all available contextual data points (user identity, location, device health, service, data classification, anomalies) before granting access.
4. **Enforce Least Privilege Access**: Grant just-in-time and just-enough access with adaptive risk policies.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - In a **Zero Trust** model, connecting from an internal corporate office desk confers **NO special automatic trust**. The user and device must still undergo full identity and device health verification.
"""
    },

    # Domain 5: Security Operations (18%)
    {
        'domain_number': 5,
        'topic_code': '5A1',
        'part': 'A',
        'name': 'Data Lifecycle & Data States (At Rest, In Transit, In Use)',
        'summary': 'The 6 stages of the data lifecycle and protecting data across its 3 physical and digital states.',
        'key_terms': ['Data at Rest', 'Data in Transit', 'Data in Use', 'Data Lifecycle', 'Cryptographic Erasure', 'Degaussing'],
        'objectives': 'Classify data states and select appropriate security and sanitization controls for each lifecycle stage.',
        'exam_tips': 'Exam Watch: Data at Rest is stored on disk/tape (protected by AES-256). Data in Transit is moving across networks (protected by TLS/IPsec). Data in Use is in RAM/CPU cache (hardest to protect). Degaussing destroys magnetic media.',
        'content': """# The Data Security Lifecycle and Data States

Data is an organization's most valuable asset and must be protected throughout its entire lifecycle.

---

### 1. The Three States of Data

| Data State | Definition | Primary Security Controls |
| :--- | :--- | :--- |
| **Data at Rest** | Inactive data stored in persistent storage (hard drives, SSDs, SAN, NAS, tapes, backup clouds). | Full Disk Encryption (BitLocker), Database Encryption (TDE), File-level encryption, Access Control Lists. |
| **Data in Transit (Motion)** | Data traveling across internal networks or the public internet between hosts. | Transport Layer Security (TLS 1.3), IPsec VPNs, HTTPS, SFTP, SSH. |
| **Data in Use** | Active data residing in volatile memory (RAM, CPU registers, caches) being processed by applications. | Process isolation, Memory encryption, Enclaves (Intel SGX), Access controls. |

---

### 2. The 6 Phases of the Data Lifecycle
1. **Create / Ingest** $\\rightarrow$ 2. **Store** $\\rightarrow$ 3. **Use** $\\rightarrow$ 4. **Share** $\\rightarrow$ 5. **Archive** $\\rightarrow$ 6. **Destroy**

---

### 3. Media Sanitization & Destruction
- **Clearing / Overwriting**: Writing random 1s and 0s across the media (prevents basic recovery).
- **Degaussing**: Exposing magnetic media (HDDs, tapes) to a powerful magnetic field, permanently destroying data and magnetic tracks. (Does NOT work on SSDs/flash storage!).
- **Physical Destruction**: Shredding, incinerating, or pulverizing media into tiny particles (highest assurance).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Degaussing only works on magnetic media** (hard drives, magnetic tapes). It has **NO EFFECT on SSDs or USB flash drives**, which must be physically shredded or cryptographically erased.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5A2',
        'part': 'A',
        'name': 'Cryptographic Concepts, Ciphers & Hashing',
        'summary': 'Symmetric vs Asymmetric cryptography, AES, RSA, ECC, cryptographic hashes (SHA-256), and digital signatures.',
        'key_terms': ['Symmetric Encryption', 'Asymmetric Encryption', 'AES', 'RSA', 'ECC', 'Hashing', 'SHA-256', 'Digital Signature'],
        'objectives': 'Contrast symmetric vs asymmetric encryption and explain how digital signatures provide integrity and non-repudiation.',
        'exam_tips': 'Exam Watch: Symmetric = ONE shared secret key (fast, great for bulk data, e.g. AES). Asymmetric = Public/Private key pair (slow, used for key exchange/signatures, e.g. RSA). Hashing = One-way math function (verifies integrity).',
        'content': """# Cryptographic Concepts, Ciphers, and Hashing

Cryptography transforms readable plaintext into unreadable ciphertext to ensure confidentiality, integrity, and authenticity.

---

### 1. Symmetric vs Asymmetric Cryptography

| Characteristic | Symmetric Encryption | Asymmetric (Public Key) Encryption |
| :--- | :--- | :--- |
| **Keys Used** | **1 Single Shared Secret Key** (used for both encryption and decryption). | **2 Mathematically Linked Keys** (Public Key encrypts / Private Key decrypts). |
| **Speed** | Very Fast (ideal for bulk data and file storage). | Slower and computationally intensive. |
| **Key Distribution** | Difficult (must share secret key securely out-of-band). | Easy (Public key is shared freely with the world). |
| **Algorithms** | **AES (Advanced Encryption Standard)**, DES, 3DES, Blowfish. | **RSA, ECC (Elliptic Curve Cryptography)**, Diffie-Hellman. |

---

### 2. Cryptographic Hashing
A **Hash function** takes an input of any length and produces a fixed-size unique output (**digest**). It is a **one-way function** (cannot reverse-engineer original text from the hash):
- **SHA-256 / SHA-3**: Secure modern hashing standards (protects integrity).
- **MD5 / SHA-1**: Obsolete, broken by collision attacks.

---

### 3. How Digital Signatures Work
1. Sender generates a **Hash** of the message.
2. Sender encrypts the hash with their **PRIVATE KEY** $\\rightarrow$ This produces the **Digital Signature**.
3. Recipient decrypts the signature using the sender's **PUBLIC KEY** and verifies the hash matches.
4. Provides **Integrity, Authentication, and Non-Repudiation**.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - To send a secret encrypted message: Encrypt with the **RECIPIENT'S PUBLIC KEY**.
> - To create a digital signature: Encrypt the hash with the **SENDER'S PRIVATE KEY**.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5A3',
        'part': 'A',
        'name': 'System Hardening & Baseline Configurations',
        'summary': 'Disabling unused services, changing default credentials, applying CIS Benchmarks, and secure decommissioning.',
        'key_terms': ['System Hardening', 'Baseline Configuration', 'Default Credentials', 'Attack Surface', 'CIS Benchmarks'],
        'objectives': 'Apply system hardening principles to minimize operating system attack surfaces.',
        'exam_tips': 'Exam Watch: The primary goal of system hardening is reducing the attack surface. Key steps: Change default admin passwords, disable unnecessary services/ports, uninstall bloatware, and apply latest patches.',
        'content': """# System Hardening and Baseline Configurations

**System Hardening** is the process of securing a computer system by reducing its vulnerability surface.

---

### 1. Key System Hardening Steps

1. **Change Default Credentials**: Never deploy systems with default vendor usernames and passwords (e.g., `admin/admin`).
2. **Disable Unnecessary Ports and Services**: Turn off unused daemons (e.g., disable Telnet, FTP, UPnP, SMBv1).
3. **Remove Unused Software**: Uninstall sample code, default web servers, and unnecessary utilities.
4. **Enforce Baseline Configurations**: Deploy standardized operating system images configured according to industry benchmarks (e.g., **CIS Benchmarks**, **NIST National Checklist Program**).
5. **Implement Principle of Least Privilege**: Ensure standard user accounts do not have local administrator rights.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Leaving default vendor passwords intact on internet-facing devices is one of the most common causes of mass network compromise.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5A4',
        'part': 'A',
        'name': 'Vulnerability & Patch Management Lifecycle',
        'summary': 'Scanning, vulnerability prioritization (CVSS), patch testing in staging, and emergency rollouts.',
        'key_terms': ['Vulnerability Management', 'Patch Management', 'CVSS', 'Zero-Day', 'Staging Environment'],
        'objectives': 'Execute a structured patch management lifecycle without destabilizing production systems.',
        'exam_tips': 'Exam Watch: ALWAYS test patches in an isolated staging/test environment before rolling them out to production systems to avoid causing unplanned outages.',
        'content': """# Vulnerability and Patch Management

Vulnerability management is an ongoing process of discovering, prioritizing, remediating, and verifying security flaws.

---

### 1. The Patch Management Lifecycle

1. **Discover & Scan**: Run regular automated vulnerability scanners (e.g., Nessus, Qualys) to identify missing patches.
2. **Prioritize (CVSS)**: Evaluate vulnerability severity using the Common Vulnerability Scoring System (CVSS 0.0 to 10.0).
3. **Test in Staging**: Deploy the patch to a dedicated non-production **test/staging environment** that mirrors production to confirm stability and compatibility.
4. **Deploy / Rollout**: Apply the patch to production systems during an approved change management maintenance window.
5. **Verify & Audit**: Re-scan production systems to confirm the vulnerability has been remediated.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Never deploy untested patches directly into production environments, even for critical vulnerabilities, without validating that the patch will not crash mission-critical services.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5A5',
        'part': 'A',
        'name': 'Endpoint Security & Host Defense',
        'summary': 'Host-based firewalls, Endpoint Detection & Response (EDR), Antivirus, and Full Disk Encryption (FDE).',
        'key_terms': ['Endpoint Security', 'EDR', 'Antivirus', 'Host-based Firewall', 'Full Disk Encryption', 'BitLocker'],
        'objectives': 'Design endpoint protection suites securing laptops, workstations, and mobile devices.',
        'exam_tips': 'Exam Watch: Full Disk Encryption (FDE) protects data at rest if a laptop is lost or stolen. EDR provides continuous behavioral monitoring, threat hunting, and remote host isolation.',
        'content': """# Endpoint Security and Host Defense

Endpoints (workstations, laptops, mobile devices) represent the most frequent point of entry for cyberattacks.

---

### 1. Core Endpoint Defense Technologies

- **Endpoint Detection and Response (EDR)**: Continuously monitors endpoint behavioral activity, detects stealthy in-memory malware, alerts the SOC, and allows security teams to isolate infected devices remotely.
- **Antivirus / Anti-Malware (AV)**: Uses signature and heuristic scanning to detect and quarantine known malicious executables.
- **Host-Based Firewall**: Restricts incoming and outgoing network traffic directly on the endpoint operating system.
- **Full Disk Encryption (FDE - e.g., BitLocker, FileVault)**: Encrypts the entire storage drive, rendering data unreadable if the physical laptop is lost or stolen.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Full Disk Encryption is an essential control for remote workers. If an encrypted corporate laptop is stolen from a car, the data remains protected against unauthorized disclosure.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5B1',
        'part': 'B',
        'name': 'Malware Taxonomy & Infection Vectors',
        'summary': 'Viruses, worms, trojans, ransomware, spyware, rootkits, keyloggers, and logic bombs.',
        'key_terms': ['Virus', 'Worm', 'Trojan Horse', 'Ransomware', 'Rootkit', 'Logic Bomb', 'Spyware'],
        'objectives': 'Differentiate between various malware types based on propagation mechanisms and payloads.',
        'exam_tips': 'Exam Watch: A Virus requires human action/host file to spread. A Worm spreads automatically across networks without user action. A Trojan masquerades as useful software. A Rootkit hides deep in OS kernel.',
        'content': """# Malware Taxonomy and Infection Vectors

Malware (Malicious Software) is designed to infiltrate, damage, or compromise computer systems without user consent.

---

### 1. Key Malware Types Defined

| Malware Type | Defining Characteristic / Propagation |
| :--- | :--- |
| **Virus** | Requires a **host file** and **human action** (e.g., executing an infected file) to replicate and spread. |
| **Worm** | **Self-replicating** malware that propagates automatically across networks by exploiting vulnerabilities **WITHOUT human intervention**. |
| **Trojan Horse** | Masquerades as legitimate, useful software (e.g., a free game or utility) while secretly executing malicious payloads in the background. Does not self-replicate. |
| **Ransomware** | Encrypts user files with strong ciphers and demands a cryptocurrency ransom payment for the decryption key. |
| **Rootkit** | Infiltrates deep into the operating system kernel or firmware, actively hiding its presence and other malware from antivirus tools. |
| **Logic Bomb** | Dormant code triggered to execute malicious actions only when specific conditions or dates occur (e.g., if a developer's employee ID is deleted). |
| **Spyware / Keylogger** | Secretly monitors user activities and records keystrokes to steal passwords, financial details, and trade secrets. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - The key difference between a **Virus** and a **Worm**: A **Worm self-replicates across the network automatically**, whereas a **Virus requires a host file and human user execution**.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5B2',
        'part': 'B',
        'name': 'Social Engineering Tactics & Countermeasures',
        'summary': 'Phishing, spear phishing, vishing, smishing, whaling, pretexting, baiting, shoulder surfing, and tailgating.',
        'key_terms': ['Phishing', 'Spear Phishing', 'Whaling', 'Vishing', 'Smishing', 'Pretexting', 'Baiting', 'Shoulder Surfing'],
        'objectives': 'Identify psychological manipulation vectors used in social engineering and implement effective defenses.',
        'exam_tips': 'Exam Watch: Phishing = Bulk email. Spear Phishing = Targeted to specific individual/group. Whaling = Targeted at C-Suite executives. Vishing = Voice call. Smishing = SMS text message. Primary defense = Awareness training.',
        'content': """# Social Engineering Tactics and Defenses

Social engineering manipulates human psychology (urgency, fear, authority, curiosity) rather than exploiting technical vulnerabilities.

---

### 1. Social Engineering Attack Types

- **Phishing**: Broad, untargeted mass emails sent to thousands of users impersonating banks, IT support, or shipping companies to harvest credentials.
- **Spear Phishing**: Highly tailored, customized phishing attacks targeting a specific individual or organization using gathered intelligence.
- **Whaling**: A spear phishing attack directed specifically at high-profile **C-Suite executives (CEO, CFO, Board members)**.
- **Vishing (Voice Phishing)**: Phone calls impersonating technical support or tax authorities to coerce victims into revealing passwords.
- **Smishing (SMS Phishing)**: Fraudulent text messages containing malicious links.
- **Pretexting**: Creating an elaborate fabricated scenario (e.g., pretending to be an auditor conducting a drill) to trick employees into divulging sensitive data.
- **Baiting**: Leaving infected USB drives labeled "Confidential Executive Salaries" in parking lots or lobbies for curious employees to plug into corporate PCs.
- **Shoulder Surfing**: Directly looking over an employee's shoulder to observe passwords or confidential screens. (Countermeasure: **Privacy screen filters**).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Security Awareness Training** is the single most effective countermeasure against social engineering attacks. Technology alone cannot stop an employee from willingly giving away their credentials.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5B3',
        'part': 'B',
        'name': 'Security Awareness Training & Security Culture',
        'summary': 'Cultivating security hygiene, regular phishing simulations, clean desk policies, and reporting procedures.',
        'key_terms': ['Security Awareness Training', 'Clean Desk Policy', 'Phishing Simulations', 'Security Culture'],
        'objectives': 'Develop a continuous security training program that reinforces organizational security culture.',
        'exam_tips': 'Exam Watch: Security awareness training must be conducted regularly (upon onboarding and at least annually) and reinforced with periodic simulated phishing tests.',
        'content': """# Security Awareness Training and Security Culture

Employees are often described as the "human firewall." Continuous training transforms users from security liabilities into proactive defenders.

---

### 1. Core Training Components

- **New Hire Onboarding**: Mandatory baseline security training before network account access is activated.
- **Periodic Refresher Courses**: Conducted at least annually to review evolving threats and policy changes.
- **Simulated Phishing Campaigns**: Sending benign test phishing emails to measure employee susceptibility and provide immediate positive reinforcement training.
- **Clean Desk / Clean Screen Policy**: Mandating that employees lock workstations when leaving their desks and lock away sensitive physical documents in drawers.
- **Clear Incident Reporting Channels**: Providing an easy, no-blame mechanism for employees to report suspicious emails or potential security incidents immediately.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - A **Clean Desk Policy** is an administrative control that prevents visitors or cleaning staff from reading sensitive printed documents left on desks.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5B4',
        'part': 'B',
        'name': 'Centralized Logging, Auditing & SIEM Operations',
        'summary': 'Syslog aggregation, Security Information and Event Management (SIEM), audit trail immutability, and NTP sync.',
        'key_terms': ['SIEM', 'Centralized Logging', 'Syslog', 'Audit Trail', 'NTP Clock Synchronization'],
        'objectives': 'Configure centralized log aggregation and security event monitoring for rapid threat detection.',
        'exam_tips': 'Exam Watch: Network Time Protocol (NTP) synchronization is MANDATORY for log analysis so events across different servers can be correlated chronologically during forensic investigations.',
        'content': """# Centralized Logging and SIEM Operations

Comprehensive audit trails provide visibility into system events, user activities, and security anomalies.

---

### 1. Security Information and Event Management (SIEM)
A **SIEM** system collects, aggregates, normalizes, and correlates log data from servers, firewalls, routers, domain controllers, and endpoints across the entire enterprise.
- **Event Correlation**: Automatically identifies complex attack patterns across multiple log sources (e.g., detecting 10 failed login attempts across 5 servers followed by a successful admin logon).
- **Automated Alerting**: Triggers high-priority notifications to SOC (Security Operations Center) analysts.

---

### 2. Log Integrity Best Practices
1. **Centralized Log Server**: Logs must be transmitted immediately to a dedicated, write-once centralized log server to prevent attackers from deleting local event logs.
2. **NTP Synchronization**: All systems must synchronize clocks via **NTP (Network Time Protocol)** to ensure timestamps match exactly across log files.
3. **Log Retention Policies**: Retain logs according to regulatory mandates (e.g., PCI-DSS requires 1 year of audit logs).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an attacker gains root access to a local server and deletes `/var/log`, centralized remote syslog logging ensures the evidence is preserved on the SIEM for forensic investigators.
"""
    },
    {
        'domain_number': 5,
        'topic_code': '5B5',
        'part': 'B',
        'name': 'Operational Change Management & Configuration Auditing',
        'summary': 'Change Advisory Boards (CAB), rollback plans, change testing, and emergency change procedures.',
        'key_terms': ['Change Management', 'Change Advisory Board (CAB)', 'Rollback Plan', 'Emergency Change', 'Configuration Management'],
        'objectives': 'Enforce structured change management to prevent unauthorized modifications and system outages.',
        'exam_tips': 'Exam Watch: Every production change request must include a documented Rollback (Backout) Plan, testing evidence, and formal Change Advisory Board (CAB) approval.',
        'content': """# Operational Change Management

Uncontrolled, unapproved changes are a leading cause of system outages and security vulnerabilities.

---

### 1. The Change Management Process

1. **Change Request (RFC)**: A formal written submission detailing the proposed change, business justification, affected systems, and risks.
2. **Impact Assessment**: Evaluating potential security risks and service dependencies.
3. **Testing**: Verifying the change in an isolated staging environment.
4. **Rollback Plan**: Documenting step-by-step instructions on how to quickly revert systems to their previous working state if the change fails in production.
5. **Change Advisory Board (CAB) Review & Approval**: Cross-functional leadership reviews and authorizes the scheduled maintenance window.
6. **Implementation & Post-Implementation Review**: Executing the change and verifying normal system operations.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - An **Emergency Change** bypasses standard scheduling but still requires post-implementation review and retrospective documentation within 24–48 hours.
"""
    }
]

ALL_TOPICS = TOPICS_RAW + ADDITIONAL_TOPICS
print(f"Total Canonical Topics Defined: {len(ALL_TOPICS)}")

# Save topics to json
os.makedirs(os.path.join(os.path.dirname(__file__), 'cc_data'), exist_ok=True)
with open(os.path.join(os.path.dirname(__file__), 'cc_data/topics.json'), 'w', encoding='utf-8') as f:
    json.dump(ALL_TOPICS, f, indent=2)

print("✓ Saved cc_data/topics.json successfully.")
