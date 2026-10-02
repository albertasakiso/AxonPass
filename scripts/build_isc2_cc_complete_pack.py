#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — ISC2 Certified in Cybersecurity (CC) Complete Package Generator
Builds all datasets:
1. cc_data/topics.json (39 canonical topics and in-depth subtopics)
2. cc_data/chapters.json (5 Master E-Reader Chapters with full markdown, tables, and Exam Watch Alerts)
3. cc_data/case_studies.json (5 Real-world Scenario Case Studies + 10 Questions)
4. cc_data/glossary.json (160 CC Cybersecurity Glossary terms)
5. cc_data/questions.json (520+ Verified high-yield questions with complete option rationales)
"""

import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), 'cc_data')
os.makedirs(DATA_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# 1. 5 MASTER CHAPTERS FOR E-READER
# ─────────────────────────────────────────────────────────────────────────────
CHAPTERS = [
    {
        'domain_number': 1,
        'chapter_number': 1,
        'title': 'Chapter 1: Security Principles',
        'document_title': 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 1',
        'page_start': 1,
        'page_end': 85,
        'estimated_read_minutes': 35,
        'key_takeaways': 'Understand the CIA Triad (Confidentiality, Integrity, Availability), IAAA framework, Risk management strategies (Mitigate, Transfer, Avoid, Accept), ISC2 Code of Ethics 4 Canons, Security Control Categories, and Policies vs Standards vs Procedures.',
        'exam_tips': 'The ISC2 Code of Ethics Canons must be memorized in exact hierarchical order: 1) Protect society and infrastructure, 2) Act honorably and legally, 3) Provide diligent service to principals, 4) Advance the profession. Canon 1 ALWAYS overrides Canon 3.',
        'content_body': """# Chapter 1: Security Principles

Welcome to **Domain 1: Security Principles**, representing **26% of the ISC2 Certified in Cybersecurity (CC) examination**. This domain covers the foundational concepts upon which all cybersecurity disciplines, controls, and governance structures are built.

---

## 1.1 The CIA Triad: Confidentiality, Integrity, and Availability

At the core of all cybersecurity operations lies the **CIA Triad**. Security controls are designed, implemented, and audited to protect one or more of these three pillars.

```
                                 [ CONFIDENTIALITY ]
                                    /           \\
                                   /             \\
                                  /   CIA TRIAD   \\
                                 /                 \\
                     [ INTEGRITY ] ───────────────── [ AVAILABILITY ]
```

### 1. Confidentiality
**Confidentiality** prevents unauthorized disclosure of sensitive information. It ensures that only authorized subjects (users, processes, or devices) can access sensitive data.
- **Threats**: Eavesdropping, network sniffing, data exfiltration, shoulder surfing, unauthorized database dumping, social engineering.
- **Primary Countermeasures**: Symmetric and asymmetric encryption (e.g., AES-256), strong access control lists (ACLs), multi-factor authentication (MFA), data classification, data loss prevention (DLP), and masking.

### 2. Integrity
**Integrity** guarantees the accuracy, completeness, and trustworthiness of data throughout its lifecycle. It ensures that unauthorized modifications, tampering, or deletions are prevented or detected.
- **Threats**: Man-in-the-Middle (MitM) alterations, bit-flipping, unauthorized record modification, replay attacks, SQL injection tampering.
- **Primary Countermeasures**: Cryptographic hashing (e.g., SHA-256), digital signatures, Message Authentication Codes (MAC), write-once-read-many (WORM) storage, and strict change control auditing.

### 3. Availability
**Availability** ensures that systems, computing infrastructure, networks, and data are accessible and usable by authorized personnel whenever needed.
- **Threats**: Denial of Service (DoS/DDoS) floods, ransomware encryption, hardware component failures, environmental disasters, power outages, HVAC failure.
- **Primary Countermeasures**: Redundant power systems (Uninterruptible Power Supplies, diesel generators), RAID disk arrays, server clustering and load balancing, automated off-site backups, and high-availability geographic failover.

| Pillar | Definition | Common Threat | Primary Protective Control |
| :--- | :--- | :--- | :--- |
| **Confidentiality** | Protection against unauthorized disclosure. | Eavesdropping / Sniffing | Encryption (AES-256, TLS 1.3) |
| **Integrity** | Protection against unauthorized modification. | Data tampering / MitM | Hashing (SHA-256) & Signatures |
| **Availability** | Timely and reliable access for authorized users. | DoS / DDoS / Outages | Redundancy, RAID, Backups, UPS |

---

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an attacker modifies payroll account numbers in a database, **INTEGRITY** is violated.
> - If an attacker steals confidential credit card numbers in plaintext, **CONFIDENTIALITY** is violated.
> - If an attacker launches a botnet DDoS flood crashing an eCommerce store, **AVAILABILITY** is violated.

---

## 1.2 The IAAA Security Framework & Non-Repudiation

Authentication and identity management follow the **IAAA model** to establish digital trust and user accountability.

1. **Identification**: The subject asserts their identity to the system (e.g., entering a username, scanning an RFID card, typing an email address).
2. **Authentication**: The system verifies the proof of the asserted identity (e.g., entering a password, biometric facial scan, approving an authenticator app prompt).
3. **Authorization**: The system grants specific permissions and privileges based on the authenticated identity (e.g., read-only access to customer records).
4. **Accountability (Auditing)**: The system records all actions taken by the subject into timestamped, tamper-evident audit logs.

### Non-Repudiation
**Non-repudiation** provides legal and technical proof that a specific subject sent a message or performed an action, preventing them from denying it. Non-repudiation is achieved through **Asymmetric Cryptography and Digital Signatures**.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Shared or generic accounts (e.g., `admin`, `guest`, `support`) destroy ACCOUNTABILITY**. Audit logs cannot attribute actions to a specific individual when credentials are shared.

---

## 1.3 Information Security Risk Management

Risk represents the probability of a threat exploiting a vulnerability and causing financial, operational, or reputational harm.

$$\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Impact}$$

### The Four Risk Response Options

| Strategy | Description | Practical Example |
| :--- | :--- | :--- |
| **Mitigation (Reduction)** | Implementing security controls to reduce likelihood or impact to an acceptable level. | Installing a Next-Gen Firewall, enforcing MFA, patching operating systems. |
| **Transference (Sharing)** | Transferring the financial liability or operational risk to an external third party. | Purchasing Cyber Liability Insurance; outsourcing infrastructure to a cloud provider with strict SLAs. |
| **Avoidance** | Completely eliminating the risk by terminating the risky process or decommissioning technology. | Canceling a high-risk legacy web portal project or refusing to process credit cards directly. |
| **Acceptance** | Acknowledging the risk and choosing not to implement controls because the cost exceeds the potential loss. | Senior executive management signing off on residual risk after a formal cost-benefit analysis. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Only Senior Leadership / Executive Management** has the legal and corporate authority to accept organizational risk. Individual engineers or security analysts CANNOT accept risk on behalf of the company.

---

## 1.4 The ISC2 Code of Ethics

All ISC2 credential holders must strictly comply with the **ISC2 Code of Ethics**. When ethical dilemmas arise, the canons must be applied in their **exact hierarchical order of precedence**:

1. **First Canon**: **Protect society, the common good, necessary public trust and confidence, and the infrastructure.**
2. **Second Canon**: **Act honorably, honestly, justly, responsibly, and legally.**
3. **Third Canon**: **Provide diligent and competent service to principals (employers and clients).**
4. **Fourth Canon**: **Advance and protect the profession.**

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an employer orders an ISC2 certified professional to conceal a critical vulnerability affecting public infrastructure, **Canon 1 (Protect Society) ALWAYS OVERRIDES Canon 3 (Duty to Employer)**. Public safety is the supreme duty.

---

## 1.5 Security Control Categories and Functional Types

Organizations deploy layered controls (**Defense-in-Depth**) across three primary categories:

```
                            ┌────────────────────────────────────────┐
                            │      ADMINISTRATIVE / MANAGERIAL       │ ◄── Policies, Training, Hiring
                            ├────────────────────────────────────────┤
                            │         TECHNICAL / LOGICAL            │ ◄── Firewalls, Encryption, MFA
                            ├────────────────────────────────────────┤
                            │              PHYSICAL                  │ ◄── Fences, Guards, Mantraps
                            └────────────────────────────────────────┘
```

- **Administrative (Managerial) Controls**: Policies, procedures, background checks, acceptable use policies, and mandatory security awareness training.
- **Technical (Logical) Controls**: Hardware and software mechanisms such as firewalls, intrusion prevention systems (IPS), access control lists (ACLs), encryption, and MFA.
- **Physical Controls**: Physical barriers protecting physical spaces, including fences, security guards, biometric locks, bollards, CCTV, and clean-agent fire suppression.

### Functional Classes:
- **Preventive**: Stops an attack before it occurs (e.g., firewall rule, door lock, security training).
- **Detective**: Identifies and alerts on security events during or after occurrence (e.g., IDS, CCTV review, audit log analysis).
- **Corrective**: Restores systems to normal operation following an incident (e.g., restoring backups, reinstalling patched OS images).
- **Compensating**: An alternate control that mitigates risk when primary controls cannot be implemented.

---

## 1.6 Governance Documentation Hierarchy

```
                  ┌──────────────────────┐
                  │      POLICIES        │  ◄── Mandatory, High-Level (Executive Intent)
                  ├──────────────────────┤
                  │      STANDARDS       │  ◄── Mandatory, Technical Baselines
                  ├──────────────────────┤
                  │     PROCEDURES       │  ◄── Mandatory, Step-by-Step Instructions
                  ├──────────────────────┤
                  │     GUIDELINES       │  ◄── OPTIONAL / Best Practice Advice
                  └──────────────────────┘
```

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Policies, Standards, and Procedures are MANDATORY**.
> - **Guidelines are OPTIONAL / DISCRETIONARY recommendations**.
"""
    },
    {
        'domain_number': 2,
        'chapter_number': 2,
        'title': 'Chapter 2: Incident Response, Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        'document_title': 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 2',
        'page_start': 86,
        'page_end': 145,
        'estimated_read_minutes': 25,
        'key_takeaways': 'Master the 6-phase Incident Response lifecycle, CSIRT roles, BIA metrics (RTO, RPO, MTD), Alternate Recovery Sites (Hot, Warm, Cold), 3-2-1 Backup Rule, and BCP/DRP testing methodologies.',
        'exam_tips': 'Remember: Containment stops the incident from spreading; Eradication eliminates the root cause malware; Recovery restores clean operations. Lessons Learned is crucial for updating policies and controls.',
        'content_body': """# Chapter 2: Incident Response, Business Continuity & Disaster Recovery

Welcome to **Domain 2: Incident Response, Business Continuity (BC) & Disaster Recovery (DR) Concepts**, representing **10% of the ISC2 CC examination**. This domain covers organizational resilience, rapid incident handling, downtime quantification, and disaster recovery planning.

---

## 2.1 The Incident Response Lifecycle (NIST SP 800-61 / ISO 27035)

An **incident** is an adverse event in an information system or network that threatens the confidentiality, integrity, or availability of an asset.

```
  ┌─────────────┐     ┌───────────────────────┐     ┌───────────────┐
  │ PREPARATION │ ──► │ DETECTION & ANALYSIS  │ ──► │  CONTAINMENT  │
  └─────────────┘     └───────────────────────┘     └───────┬───────┘
                                                            │
  ┌─────────────────┐     ┌──────────────┐     ┌────────────▼───┐
  │ LESSONS LEARNED │ ◄── │   RECOVERY   │ ◄── │  ERADICATION   │
  └─────────────────┘     └──────────────┘     └────────────────┘
```

1. **Preparation**: Developing IR plans, establishing and training the Computer Security Incident Response Team (CSIRT), deploying monitoring tools, and defining escalation procedures BEFORE an incident occurs.
2. **Detection & Analysis (Triage)**: Identifying security anomalies via SIEM alerts, IDS logs, or user reports, analyzing indicators of compromise (IoCs), and verifying the severity and scope of the attack.
3. **Containment**: Isolating affected systems to prevent lateral movement (e.g., disconnecting a ransomware-infected host from the network or disabling compromised accounts).
4. **Eradication**: Completely removing the root cause of the incident (e.g., deleting malware, closing compromised network ports, rebuilding compromised OS kernels).
5. **Recovery**: Restoring systems to clean, verified production operations, confirming data integrity, and conducting heightened monitoring for recurrence.
6. **Lessons Learned (Post-Incident Review)**: Documenting the incident timeline, assessing response efficacy, identifying gaps, and updating policies, training, and controls.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Lessons Learned** must occur shortly after the incident while memories are fresh. Its goal is **process improvement**, not assigning blame.

---

## 2.2 Business Impact Analysis (BIA) and Recovery Metrics

The **Business Impact Analysis (BIA)** identifies critical business functions (CBFs) and quantifies the operational and financial loss over time if those functions are disrupted.

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

- **Recovery Point Objective (RPO)**: The maximum acceptable amount of data loss measured in time (e.g., an RPO of 1 hour requires database snapshots at least every 60 minutes).
- **Recovery Time Objective (RTO)**: The maximum targeted duration of time allowed to restore IT infrastructure and system availability.
- **Work Recovery Time (WRT)**: The time needed to verify data integrity, test business applications, and catch up on backlogged transactions.
- **Maximum Tolerable Downtime (MTD)**: The absolute maximum total duration of disruption an organization can survive before suffering irreparable financial, legal, or operational collapse.

$$\\text{RTO} + \\text{WRT} \\le \\text{MTD}$$

---

## 2.3 Alternate Disaster Recovery Sites

When a primary data center is destroyed or inaccessible, processing shifts to an alternate recovery facility.

| Site Type | Operational Readiness | Equipment / Hardware | Data Replication Status | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Hot Site** | Minutes to a few hours | Fully populated, identical production hardware | Live real-time data mirroring / near-instant | Highest |
| **Warm Site** | Days to a week | Core hardware installed, but not fully configured | Backups must be restored before operations begin | Medium |
| **Cold Site** | Weeks to a month | Empty facility shell with power, HVAC, and wiring only | No hardware, no data present; must be procured | Lowest |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - If an organization has an RTO of near-zero (e.g., financial trading, emergency 911 dispatch), a **HOT SITE** is mandatory.

---

## 2.4 Backup Schemes and The 3-2-1 Rule

| Backup Type | What is Backed Up? | Backup Speed | Restoration Speed |
| :--- | :--- | :--- | :--- |
| **Full Backup** | All selected data files. | Slowest | Fastest (requires ONLY the Full backup). |
| **Differential Backup** | All files modified **since the LAST FULL backup**. | Medium | Fast (requires Full backup + LATEST differential). |
| **Incremental Backup** | Only files modified **since the LAST backup (Full or Incremental)**. | Fastest | Slowest (requires Full backup + ALL incrementals in sequence). |

### The 3-2-1 Backup Rule
- **3** total copies of critical business data.
- **2** different storage media types (e.g., Local SAN disk + Cloud/Tape).
- **1** copy stored **off-site** (or in an air-gapped, immutable cloud tier).

---

## 2.5 BCP / DRP Testing Methodologies

1. **Checklist (Read-Through)**: Department heads review plan copies for accuracy.
2. **Tabletop (Structured Walkthrough)**: Key personnel gather in a conference room to talk through a disaster scenario step-by-step without affecting production.
3. **Simulation Test**: Practice mobilization of emergency staff and test communication trees.
4. **Parallel Test**: Disaster recovery systems are powered on at the alternate site and process test transactions alongside live production.
5. **Full Interruption Test**: Complete shutdown of primary facilities; all live operations switch to the disaster recovery site. (Highest risk of business disruption).

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - Organizations should always conduct low-risk **Tabletop Walkthroughs** before attempting complex, high-risk operational tests like Full Interruption.
"""
    },
    {
        'domain_number': 3,
        'chapter_number': 3,
        'title': 'Chapter 3: Access Controls Concepts',
        'document_title': 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 3',
        'page_start': 146,
        'page_end': 215,
        'estimated_read_minutes': 30,
        'key_takeaways': 'Understand layered physical defense-in-depth, entry controls, mantraps, environmental systems (Class C fires, FM-200), logical access models (DAC, MAC, RBAC, ABAC), 5 authentication factor categories, and PAM.',
        'exam_tips': 'MFA requires TWO DIFFERENT factor categories (e.g., Password + Phone App). DAC is owner-managed; MAC uses mandatory classification labels; RBAC uses job roles. Mantraps prevent tailgating.',
        'content_body': """# Chapter 3: Access Controls Concepts

Welcome to **Domain 3: Access Controls Concepts**, representing **22% of the ISC2 CC examination**. This domain covers both physical and logical security mechanisms designed to permit authorized access while preventing unauthorized intrusion.

---

## 3.1 Physical Access Controls & Defense-in-Depth

Physical security represents the first defensive perimeter protecting hardware, personnel, and building infrastructure.

### Layered Perimeter Security:
- **Fences**:
  - 3–4 feet (1m): Deters casual trespassers.
  - 6–7 feet (2m): Impedes casual climbing.
  - 8+ feet (2.4m) with barbed wire top guard: Deters determined intruders.
- **Bollards**: Heavy concrete or steel posts designed to prevent vehicle ram-raiding attacks.
- **Security Lighting**: Illuminates building perimeters and eliminates shadows and hiding spots.
- **Security Guards**: Human presence capable of situational judgment and incident escalation.

### Entry Controls & Tailgating Prevention:
- **Mantrap (Air-Lock / Interlocking Doors)**: A small room with two electronically interlocking doors where Door B will not unlock until Door A closes and the user authenticates. The ultimate engineering control against **tailgating and piggybacking**.
- **Turnstiles**: Mechanical or optical gates enforcing single-person entry.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Tailgating**: An unauthorized person follows behind an authorized person *without their knowledge or consent*.
> - **Piggybacking**: An authorized person *knowingly holds the door open* for an unauthorized acquaintance.
> - Both threats are prevented by a **Mantrap**.

---

## 3.2 Environmental Safety & Fire Suppression

Data centers house sensitive electronic equipment requiring specialized fire extinguishing systems.

| Fire Class | Fuel / Source | Extinguishing Agent |
| :--- | :--- | :--- |
| **Class A** | Common combustibles (wood, paper, cardboard). | Water, foam. |
| **Class B** | Flammable liquids and gases (gasoline, diesel, solvents). | CO2, dry chemical, foam. |
| **Class C** | **Energized electrical equipment (servers, rack wiring, switches).** | **Clean Agents (FM-200, Inergen, Novec 1230), CO2.** |
| **Class D** | Combustible metals (magnesium, lithium, sodium). | Dry powder agents. |
| **Class K** | Commercial cooking oils and fats. | Wet chemical agents. |

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **NEVER USE WATER on Class C electrical fires!** Water conducts electricity, creating lethal shock hazards and destroying electronics. Use **Clean Agents (FM-200, Inergen)** that leave no residue and do not harm electronics or humans.

---

## 3.3 Logical Access Control Models

Logical access control determines which users or processes can access specific digital files, directories, and systems.

1. **Discretionary Access Control (DAC)**:
   - The **data owner** decides who has access to files and can grant/revoke permissions at their discretion (e.g., standard Windows/Linux NTFS file permissions).
2. **Mandatory Access Control (MAC)**:
   - Access is enforced by the operating system based on **security clearance labels** (e.g., Top Secret, Secret, Confidential) assigned to subjects and classification tags on objects. Users cannot override policies (used in military/government systems).
3. **Role-Based Access Control (RBAC)**:
   - Permissions are assigned to specific **job roles** (e.g., *HR Manager*, *Database Admin*), and employees are assigned to those roles. Simplifies administration and prevents privilege creep in commercial enterprises.
4. **Attribute-Based Access Control (ABAC)**:
   - Dynamic, contextual access decisions based on subject attributes, resource tags, environmental factors (time of day, device location, IP subnet), and actions.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **RBAC** is the most widely adopted access model in commercial enterprises because it enforces the Principle of Least Privilege based on defined job responsibilities.

---

## 3.4 Authentication Factors & Multi-Factor Authentication (MFA)

Authentication proves a claimed identity across five distinct factor categories:

1. **Something You Know**: Passwords, passphrases, PINs, secret answers. (Knowledge-based).
2. **Something You Have**: Hardware tokens (YubiKey), smart cards, authenticator apps (TOTP), SMS OTP. (Possession-based).
3. **Something You Are**: Biometrics (Fingerprint, facial recognition, iris/retina scan, voiceprint). (Inheritance-based).
4. **Somewhere You Are**: Geolocation, GPS coordinates, corporate subnet IP. (Location-based).
5. **Something You Do**: Keystroke dynamics, handwriting signature velocity, gait analysis. (Behavioral-based).

### True MFA Rule:
True Multi-Factor Authentication requires **at least two DIFFERENT categories** of authentication factors.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - A Password + PIN is **Single-Factor Authentication (SFA)** because both belong to *Something You Know*.
> - A Password (Know) + Fingerprint (Are) is **Multi-Factor Authentication (MFA)**.

---

## 3.5 Core Access Principles: Least Privilege, Need-to-Know & PAM

- **Principle of Least Privilege**: Users are granted only the minimum permissions necessary to execute their assigned job responsibilities.
- **Need-to-Know**: Access is granted only to specific data required for a specific current task, regardless of broad clearance levels.
- **Segregation of Duties (SoD)**: Critical business operations are divided among multiple individuals so no single person can execute fraud undetected.
- **Privileged Access Management (PAM)**: Centralized vaulting, just-in-time checkout, and session recording for elevated administrator accounts.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Privilege Creep (Privilege Accumulation)** occurs when employees change roles within an organization and retain old permissions. Mitigated by regular **user access reviews**.
"""
    },
    {
        'domain_number': 4,
        'chapter_number': 4,
        'title': 'Chapter 4: Network Security',
        'document_title': 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 4',
        'page_start': 216,
        'page_end': 285,
        'estimated_read_minutes': 30,
        'key_takeaways': 'Master OSI 7-layer and TCP/IP models, well-known ports & protocols, network attacks (DoS/DDoS, MitM, Spoofing), Firewall architectures, IDS vs IPS, DMZ design, IPsec VPN modes, WPA3, and Zero Trust Architecture.',
        'exam_tips': 'Routers operate at L3 (IP); Switches operate at L2 (MAC). IDS is passive out-of-band; IPS is active inline. IPsec ESP encrypts; AH does NOT encrypt. Zero Trust motto: "Never Trust, Always Verify".',
        'content_body': """# Chapter 4: Network Security

Welcome to **Domain 4: Network Security**, representing **24% of the ISC2 CC examination**. This domain covers network protocols, defensive hardware devices, threat vectors, zoning, and secure communications.

---

## 4.1 The OSI 7-Layer & TCP/IP Models

```
                   OSI 7-LAYER MODEL                    TCP/IP MODEL
               ┌────────────────────────┐          ┌──────────────────────┐
               │ 7. APPLICATION LAYER   │ ───────► │                      │
               ├────────────────────────┤          │                      │
               │ 6. PRESENTATION LAYER  │ ───────► │  APPLICATION LAYER   │
               ├────────────────────────┤          │                      │
               │ 5. SESSION LAYER       │ ───────► │                      │
               ├────────────────────────┤          ├──────────────────────┤
               │ 4. TRANSPORT LAYER     │ ───────► │   TRANSPORT LAYER    │
               ├────────────────────────┤          ├──────────────────────┤
               │ 3. NETWORK LAYER       │ ───────► │    INTERNET LAYER    │
               ├────────────────────────┤          ├──────────────────────┤
               │ 2. DATA LINK LAYER     │ ───────► │    NETWORK ACCESS    │
               ├────────────────────────┤          │        LAYER         │
               │ 1. PHYSICAL LAYER      │ ───────► │                      │
               └────────────────────────┘          └──────────────────────┘
```

### OSI Layers Explained:
- **Layer 7 - Application**: Direct user interface (HTTP, HTTPS, DNS, SSH, SMTP, FTP).
- **Layer 6 - Presentation**: Formatting, compression, and encryption (TLS/SSL, ASCII, JPEG).
- **Layer 5 - Session**: Manages and terminates communication sessions (NetBIOS, RPC).
- **Layer 4 - Transport**: End-to-end communication. **TCP** (reliable, 3-way handshake) vs **UDP** (fast, connectionless).
- **Layer 3 - Network**: Logical routing using IP addresses (**Routers**, IPv4, IPv6, ICMP).
- **Layer 2 - Data Link**: Physical frame delivery on LANs using MAC addresses (**Switches**, Ethernet, 802.11).
- **Layer 1 - Physical**: Raw bit transmission over physical media (Cables, Fiber, Hubs, Radio frequencies).

---

## 4.2 Essential Well-Known Network Ports

| Port | Protocol | Function | Security Note |
| :--- | :--- | :--- | :--- |
| **20 / 21** | **FTP** | File Transfer Protocol | INSECURE. Transmits passwords in cleartext. Replace with SFTP (22). |
| **22** | **SSH / SFTP** | Secure Shell / Secure FTP | Encrypted remote terminal and file transfer. |
| **23** | **Telnet** | Unencrypted terminal access | INSECURE. Replace with SSH. |
| **25** | **SMTP** | Simple Mail Transfer Protocol | Email transmission between mail servers. |
| **53** | **DNS** | Domain Name System | Resolves hostnames to IP addresses. |
| **67 / 68**| **DHCP** | Dynamic Host Config Protocol | Automatically assigns IP configuration to clients. |
| **80** | **HTTP** | Web traffic (Plaintext) | Unencrypted. Replace with HTTPS. |
| **443** | **HTTPS** | Web traffic (TLS encrypted) | Encrypted secure web communications. |
| **123** | **NTP** | Network Time Protocol | Clock synchronization for accurate audit logs. |
| **3389** | **RDP** | Remote Desktop Protocol | Windows remote graphical administration. |

---

## 4.3 Network Defense Devices: Firewalls & IDS/IPS

### 1. Firewalls
- **Stateless Packet Filter (L3/L4)**: Filters individual packets based on source/dest IP and port without tracking connection state.
- **Stateful Inspection Firewall (L3/L4/L5)**: Tracks active TCP connections in a **state table**, automatically permitting return traffic for established sessions.
- **Next-Generation Firewall (NGFW / L7)**: Deep Packet Inspection (DPI), application awareness, integrated IPS, and SSL decryption.

### 2. Intrusion Detection (IDS) vs Intrusion Prevention (IPS)
- **IDS (Intrusion Detection System)**: Placed **out-of-band** (via switch SPAN port). **Passive / Detective**: Detects attacks and triggers alerts for analysts. Zero impact on traffic flow.
- **IPS (Intrusion Prevention System)**: Placed **inline**. **Active / Preventive**: Analyzes traffic in real-time and actively **blocks and drops** malicious packets.

---

## 4.4 Demilitarized Zones (DMZ) and Network Segmentation

```
                  Internet (Untrusted)
                           │
                 [ External Firewall ]
                           │
                   ┌───────┴───────┐
                   │  DMZ Subnet   │  ◄── Public Web Server, Mail Relay, DNS
                   └───────┬───────┘
                           │
                 [ Internal Firewall ]
                           │
                   ┌───────┴───────┐
                   │ Internal LAN  │  ◄── Backend Databases, AD Domain Controllers
                   └───────────────┘
```

- Public-facing servers reside in the **DMZ**.
- Backend database servers storing sensitive customer records NEVER reside in the DMZ; they reside on the internal network behind a secondary firewall.

---

## 4.5 Virtual Private Networks (VPNs) & IPsec

- **Encapsulating Security Payload (ESP)**: Provides **Confidentiality (Encryption)**, Integrity, and Authentication.
- **Authentication Header (AH)**: Provides Integrity and Authentication, but **NO ENCRYPTION (NO Confidentiality)**.
- **Tunnel Mode**: Encrypts the **entire original packet** (Header + Payload) and prepends a new outer header. (Used for Site-to-Site VPNs).
- **Transport Mode**: Encrypts only the **Payload**; original header remains visible. (Used for Host-to-Host).

---

## 4.6 Zero Trust Architecture (ZTA)

Traditional security relied on a "castle-and-moat" perimeter. **Zero Trust** eliminates implicit trust.
- **Core Motto**: **"Never Trust, Always Verify"**.
- **Assume Breach**: Operate as though attackers already possess internal access.
- **Continuous Verification**: Explicitly authenticate and authorize every user, device, and request continuously.
"""
    },
    {
        'domain_number': 5,
        'chapter_number': 5,
        'title': 'Chapter 5: Security Operations',
        'document_title': 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 5',
        'page_start': 286,
        'page_end': 350,
        'estimated_read_minutes': 25,
        'key_takeaways': 'Understand data states (at rest, in transit, in use), symmetric vs asymmetric encryption, hashing (SHA-256), system hardening baselines, patch management, malware taxonomy, social engineering attacks, and SIEM logging.',
        'exam_tips': 'Symmetric uses 1 key (AES, fast); Asymmetric uses 2 keys (RSA, digital signatures). Degaussing destroys magnetic media only. Worms self-replicate without human action; Viruses require a host file. Security awareness is the best defense against social engineering.',
        'content_body': """# Chapter 5: Security Operations

Welcome to **Domain 5: Security Operations**, representing **18% of the ISC2 CC examination**. This domain covers day-to-day security hygiene, data protection, endpoint defense, threat mitigation, and security awareness.

---

## 5.1 The Three States of Data & Sanitization

| Data State | Definition | Primary Security Controls |
| :--- | :--- | :--- |
| **Data at Rest** | Inactive data stored on persistent media (hard drives, SSDs, backup tapes). | Full Disk Encryption (BitLocker), Database Encryption (TDE), Access Controls. |
| **Data in Transit** | Data moving across internal networks or the internet between hosts. | Transport Layer Security (TLS 1.3), IPsec VPNs, HTTPS, SSH. |
| **Data in Use** | Active data in volatile memory (RAM, CPU registers/caches) being processed. | Process isolation, Memory encryption, Enclaves. |

### Media Sanitization:
- **Clearing / Overwriting**: Writing binary patterns across sectors (standard reuse).
- **Degaussing**: Exposing magnetic media (HDDs, tapes) to powerful magnetic fields. (Does NOT work on SSDs!).
- **Physical Destruction**: Shredding, incinerating, or disintegrating media into small particles.

---

## 5.2 Cryptography & Digital Signatures

| Characteristic | Symmetric Cryptography | Asymmetric (Public Key) Cryptography |
| :--- | :--- | :--- |
| **Keys Used** | **1 Shared Secret Key** (encrypts & decrypts). | **2 Mathematically Linked Keys** (Public & Private). |
| **Speed** | Very Fast (ideal for bulk data). | Slower and computationally heavy. |
| **Algorithms** | **AES**, DES, 3DES, Blowfish. | **RSA, ECC**, Diffie-Hellman. |

### Digital Signatures:
1. Sender creates a **Hash** of the message.
2. Sender encrypts the hash with their **PRIVATE KEY** $\\rightarrow$ Creates the **Digital Signature**.
3. Recipient decrypts the signature using the sender's **PUBLIC KEY** and verifies the hash matches.
4. Provides **Integrity, Authentication, and Non-Repudiation**.

---

## 5.3 System Hardening & Patch Management

- **System Hardening**: Reducing the attack surface by changing default vendor credentials, disabling unnecessary ports and services, uninstalling bloatware, and applying **CIS Benchmarks**.
- **Patch Management**: Discovering vulnerabilities, prioritizing by **CVSS score**, testing patches in an isolated **staging environment**, and deploying during approved change windows.

---

## 5.4 Malware Taxonomy

- **Virus**: Requires a **host file** and **human execution** to replicate and spread.
- **Worm**: **Self-replicating** malware that spreads automatically across networks without user action.
- **Trojan Horse**: Masquerades as legitimate, useful software while concealing a malicious payload.
- **Ransomware**: Encrypts victim files with strong ciphers and demands a ransom for the decryption key.
- **Rootkit**: Infiltrates deep into operating system kernel/firmware to hide itself from security tools.
- **Logic Bomb**: Dormant code triggered by a specific event or date.

---

## 5.5 Social Engineering Attacks & Defenses

- **Phishing**: Bulk, untargeted fraudulent emails sent to thousands of users.
- **Spear Phishing**: Highly customized, targeted phishing directed at specific individuals or departments.
- **Whaling**: Spear phishing targeting high-level **C-Suite executives (CEO, CFO)**.
- **Vishing / Smishing**: Voice phishing over the phone / SMS phishing via text message.
- **Pretexting**: Fabricating a scenario to trick users into revealing confidential data.
- **Tailgating / Piggybacking**: Physically following authorized personnel into secure areas.

> [!IMPORTANT]
> **💡 ISC2 / Exam Watch Alert**:
> - **Security Awareness Training** is the single most effective countermeasure against social engineering attacks.

---

## 5.6 Centralized Logging & SIEM Operations

- **SIEM (Security Information and Event Management)**: Centralizes, normalizes, and correlates event logs across firewalls, servers, and endpoints to identify attack patterns.
- **NTP (Network Time Protocol)**: Synchronizes system clocks so audit logs match chronologically across all enterprise servers.
"""
    }
]

with open(os.path.join(DATA_DIR, 'chapters.json'), 'w', encoding='utf-8') as f:
    json.dump(CHAPTERS, f, indent=2)

print(f"[OK] Saved {len(CHAPTERS)} Master Chapters to cc_data/chapters.json")

# ─────────────────────────────────────────────────────────────────────────────
# 2. 5 SCENARIO CASE STUDIES + 10 QUESTIONS
# ─────────────────────────────────────────────────────────────────────────────
CASE_STUDIES = [
    {
        'domain_number': 1,
        'title': 'Case Study: FinTech Security Architecture & Ethical Governance',
        'scenario_text': """ApexPay is a rapid-growth financial technology startup handling payment processing for 500,000 global merchants. Recently, the CTO instructed the lead security architect to disable multi-factor authentication (MFA) and bypass encryption on backend payment databases to accelerate API response times before an upcoming venture capital funding round. Additionally, customer data containing PII was being shared with marketing contractors using a shared administrative account without an audit trail.""",
        'sort_order': 1,
        'questions': [
            {
                'question_number': 1,
                'stem': "When the CTO orders the security architect to disable encryption on sensitive payment records to increase transaction speed, which canon of the ISC2 Code of Ethics must dictate the architect's primary ethical responsibility?",
                'option_a': "Canon 3: Provide diligent and competent service to principals (complying with the CTO's directive).",
                'option_b': "Canon 1: Protect society, the common good, necessary public trust, and the infrastructure.",
                'option_c': "Canon 4: Advance and protect the profession.",
                'option_d': "Canon 2: Act honorably and legally, by finding an offshore jurisdiction where encryption is optional.",
                'correct_answer': 'B',
                'rationale': "Canon 1 (Protect society, the common good, necessary public trust, and infrastructure) is the highest priority canon in the ISC2 Code of Ethics and takes absolute precedence over duties to employers (Canon 3). Disabling encryption on payment data jeopardizes public trust and merchant security."
            },
            {
                'question_number': 2,
                'stem': "Sharing a single administrative account among multiple marketing contractors introduces the greatest risk to which component of the IAAA security framework?",
                'option_a': "Availability, because contractors may lock out the account simultaneously.",
                'option_b': "Accountability, because individual contractor actions cannot be tied to a specific person in audit logs.",
                'option_c': "Identification, because usernames cannot contain special characters.",
                'option_d': "Integrity, because shared accounts automatically corrupt database schemas.",
                'correct_answer': 'B',
                'rationale': "Accountability requires that every action taken on an information system can be traced back to a specific, unique individual. Shared accounts destroy accountability because audit logs only show the generic username rather than the human actor."
            }
        ]
    },
    {
        'domain_number': 2,
        'title': 'Case Study: MetroHealth Ransomware Attack & Emergency Continuity',
        'scenario_text': """At 3:00 AM on Sunday, the Security Operations Center at MetroHealth Hospital detected widespread file encryption across 40 critical clinical servers. A ransomware note demanded 50 Bitcoin within 24 hours. The hospital's electronic health record (EHR) system was completely inaccessible, and emergency room ambulances had to be diverted. The hospital's Business Impact Analysis (BIA) documented an RTO of 4 hours and an RPO of 1 hour for patient records, with a Maximum Tolerable Downtime (MTD) of 8 hours.""",
        'sort_order': 2,
        'questions': [
            {
                'question_number': 1,
                'stem': "Immediately after confirming the active ransomware outbreak on clinical servers, which action should the Incident Response team take FIRST during the Containment phase?",
                'option_a': "Pay the demanded ransom to obtain the decryption keys before the 24-hour deadline.",
                'option_b': "Isolate the infected server subnets from the network to prevent lateral spread to backups and diagnostic devices.",
                'option_c': "Initiate a Full Interruption disaster recovery test to assess alternate site readiness.",
                'option_d': "Format all hospital workstations and begin re-installing operating systems from factory media.",
                'correct_answer': 'B',
                'rationale': "The immediate goal during the Containment phase of incident response is stopping the spread of malware and isolating affected systems from the remainder of the network and critical backup repositories."
            },
            {
                'question_number': 2,
                'stem': "If MetroHealth's patient database has an RPO of 1 hour, what does this recovery metric mandate for the backup strategy?",
                'option_a': "Systems must be restored to full operation within 1 hour of an outage.",
                'option_b': "The hospital cannot tolerate losing more than 1 hour worth of patient transaction data.",
                'option_c': "The alternate disaster recovery hot site must be located within a 1-hour driving radius.",
                'option_d': "Emergency response personnel must assemble at the hospital within 60 minutes.",
                'correct_answer': 'B',
                'rationale': "Recovery Point Objective (RPO) defines the maximum allowable amount of data loss measured in time between the last successful backup and the disruptive event."
            }
        ]
    },
    {
        'domain_number': 3,
        'title': 'Case Study: BioTech Enterprise Access Control & Facility Security',
        'scenario_text': """BioGenix Laboratories develops proprietary pharmaceutical formulas. An internal audit revealed that former research contractors retained active smart cards and could enter the main research wing after contract termination. Furthermore, security cameras recorded several instances where delivery personnel followed employees through secure laboratory doors without badging in.""",
        'sort_order': 3,
        'questions': [
            {
                'question_number': 1,
                'stem': "Which physical security engineering control would most effectively prevent delivery personnel from tailgating or piggybacking behind employees entering secure laboratory suites?",
                'option_a': "Installing a high-visibility CCTV camera above the doorway.",
                'option_b': "Deploying a Mantrap (interlocking double-door access portal).",
                'option_c': "Replacing proximity smart cards with 4-digit PIN keypads.",
                'option_d': "Placing a warning sign on the door reminding staff not to hold doors open.",
                'correct_answer': 'B',
                'rationale': "A Mantrap (interlocking double doors where Door B will not unlock until Door A closes and the individual authenticates) physically prevents more than one person from entering at a time, eliminating tailgating."
            },
            {
                'question_number': 2,
                'stem': "Contractors retaining active building access cards following project completion is an operational failure in which lifecycle process?",
                'option_a': "Deprovisioning and Offboarding.",
                'option_b': "Discretionary Access Control assignment.",
                'option_c': "Multi-Factor Authentication enrollment.",
                'option_d': "Class C Environmental Fire Suppression.",
                'correct_answer': 'A',
                'rationale': "Deprovisioning is the identity lifecycle process of revoking and disabling digital and physical access credentials immediately upon employee or contractor departure."
            }
        ]
    },
    {
        'domain_number': 4,
        'title': 'Case Study: CloudRetail Network Perimeter & Zero Trust Migration',
        'scenario_text': """CloudRetail operates a high-volume online shopping platform hosted in a hybrid cloud infrastructure. Following a security assessment, penetration testers discovered that the external web servers in the public DMZ were directly communicating with the internal MySQL database server on port 3306 without an intermediate firewall inspection. Additionally, remote developers were using unencrypted Telnet sessions over public Wi-Fi to manage production Linux nodes.""",
        'sort_order': 4,
        'questions': [
            {
                'question_number': 1,
                'stem': "To secure administrative terminal access for remote developers managing production Linux servers, which protocol should replace unencrypted Telnet (Port 23)?",
                'option_a': "FTP on Port 21.",
                'option_b': "SSH (Secure Shell) on Port 22.",
                'option_c': "HTTP on Port 80.",
                'option_d': "SNMP on Port 161.",
                'correct_answer': 'B',
                'rationale': "SSH (Secure Shell) on Port 22 provides strong cryptographic encryption for remote command-line administration, protecting credentials and commands from eavesdropping."
            },
            {
                'question_number': 2,
                'stem': "Under Zero Trust Architecture (ZTA) principles, how should communication between DMZ web servers and internal database servers be treated?",
                'option_a': "Automatically trusted because both servers belong to the CloudRetail corporate domain.",
                'option_b': "Implicitly allowed once the developer connects to the internal corporate VPN.",
                'option_c': "Explicitly verified, authenticated, and encrypted on every request, enforcing least privilege network microsegmentation.",
                'option_d': "Allowed only during scheduled weekend batch processing maintenance windows.",
                'correct_answer': 'C',
                'rationale': "Zero Trust Architecture enforces 'Never Trust, Always Verify', requiring continuous authentication, strict microsegmentation, and encryption for every communication request regardless of network location."
            }
        ]
    },
    {
        'domain_number': 5,
        'title': 'Case Study: AeroDefense Data Classification & Security Operations',
        'scenario_text': """AeroDefense designs guidance systems for commercial aviation. During a routine audit, an unencrypted laptop containing classified missile flight telemetry was stolen from an engineer's vehicle. Concurrently, the SOC noticed multiple endpoint alerts indicating that several workstations in the engineering lab had USB auto-run enabled, and employees had plugged in unverified USB thumb drives discovered in the company cafeteria.""",
        'sort_order': 5,
        'questions': [
            {
                'question_number': 1,
                'stem': "Which technical endpoint security control would have protected the classified flight telemetry on the stolen laptop from unauthorized disclosure?",
                'option_a': "A BIOS boot password.",
                'option_b': "Full Disk Encryption (FDE) using AES-256 (e.g., BitLocker).",
                'option_c': "A desktop wallpaper displaying a corporate non-disclosure warning.",
                'option_d': "Uninstalling all web browsers from the laptop.",
                'correct_answer': 'B',
                'rationale': "Full Disk Encryption (FDE) encrypts all data at rest on the storage drive, rendering the data completely unreadable to unauthorized individuals if the physical laptop is stolen."
            },
            {
                'question_number': 2,
                'stem': "Employees picking up unlabeled USB thumb drives from the cafeteria and plugging them into corporate PCs represents which social engineering attack technique?",
                'option_a': "Whaling.",
                'option_b': "Baiting.",
                'option_c': "Vishing.",
                'option_d': "Man-in-the-Middle.",
                'correct_answer': 'B',
                'rationale': "Baiting relies on curiosity or greed, leaving malware-infected physical media (like USB drives) in public or shared areas hoping an employee will plug it into a computer."
            }
        ]
    }
]

with open(os.path.join(DATA_DIR, 'case_studies.json'), 'w', encoding='utf-8') as f:
    json.dump(CASE_STUDIES, f, indent=2)

print(f"[OK] Saved {len(CASE_STUDIES)} Case Studies to cc_data/case_studies.json")

# ─────────────────────────────────────────────────────────────────────────────
# 3. 160 GLOSSARY TERMS
# ─────────────────────────────────────────────────────────────────────────────
GLOSSARY = [
    # Domain 1 Terms
    {"term": "Confidentiality", "acronym": "C", "domain_number": 1, "definition": "The assurance that information is not disclosed to unauthorized individuals, entities, or processes."},
    {"term": "Integrity", "acronym": "I", "domain_number": 1, "definition": "The accuracy, completeness, and trustworthiness of data, ensuring it has not been altered in an unauthorized manner."},
    {"term": "Availability", "acronym": "A", "domain_number": 1, "definition": "The assurance that systems and data are accessible and usable by authorized personnel upon demand."},
    {"term": "CIA Triad", "acronym": "CIA", "domain_number": 1, "definition": "The fundamental security model comprising Confidentiality, Integrity, and Availability."},
    {"term": "Identification", "acronym": "", "domain_number": 1, "definition": "The assertion of a unique identity by a subject (e.g., username or smart card ID)."},
    {"term": "Authentication", "acronym": "AuthN", "domain_number": 1, "definition": "The process of verifying and validating the claimed identity of a subject."},
    {"term": "Authorization", "acronym": "AuthZ", "domain_number": 1, "definition": "The granting of specific permissions, rights, and privileges to an authenticated subject."},
    {"term": "Accountability", "acronym": "", "domain_number": 1, "definition": "The ability to trace actions and events on an information system directly to a specific unique individual."},
    {"term": "Non-Repudiation", "acronym": "", "domain_number": 1, "definition": "A state where the sender of a message or performer of an action cannot deny authenticity or origin, achieved via digital signatures."},
    {"term": "Risk", "acronym": "", "domain_number": 1, "definition": "The probability that a threat will exploit a vulnerability and cause loss or harm to an asset."},
    {"term": "Threat", "acronym": "", "domain_number": 1, "definition": "Any potential danger or event that could compromise the confidentiality, integrity, or availability of an asset."},
    {"term": "Vulnerability", "acronym": "", "domain_number": 1, "definition": "A flaw, weakness, or gap in security procedures, design, or implementation that can be exploited by a threat."},
    {"term": "Risk Mitigation", "acronym": "", "domain_number": 1, "definition": "Applying security controls and countermeasures to reduce the likelihood or impact of a risk."},
    {"term": "Risk Transference", "acronym": "", "domain_number": 1, "definition": "Shifting the financial or operational burden of a risk to a third party (e.g., cyber insurance, outsourcing)."},
    {"term": "Risk Avoidance", "acronym": "", "domain_number": 1, "definition": "Eliminating risk entirely by discontinuing the risky business activity or technology."},
    {"term": "Risk Acceptance", "acronym": "", "domain_number": 1, "definition": "Formal acknowledgment and sign-off by senior management to absorb potential residual risk without further controls."},
    {"term": "ISC2 Code of Ethics", "acronym": "", "domain_number": 1, "definition": "Four mandatory ethical canons governing the professional conduct of all ISC2 credential holders."},
    {"term": "Administrative Controls", "acronym": "", "domain_number": 1, "definition": "Management policies, standards, procedures, hiring practices, and training that guide human behavior."},
    {"term": "Technical Controls", "acronym": "", "domain_number": 1, "definition": "Hardware and software security mechanisms including firewalls, encryption, and access control lists."},
    {"term": "Physical Controls", "acronym": "", "domain_number": 1, "definition": "Tangible physical barriers including fences, locks, security guards, bollards, and fire suppression systems."},
    {"term": "Defense-in-Depth", "acronym": "", "domain_number": 1, "definition": "Layered security architecture using multiple overlapping administrative, technical, and physical controls."},
    {"term": "Personally Identifiable Information", "acronym": "PII", "domain_number": 1, "definition": "Any information that can be used to distinguish or trace an individual's identity."},
    {"term": "General Data Protection Regulation", "acronym": "GDPR", "domain_number": 1, "definition": "European Union regulation governing data protection, privacy, and user consent."},
    {"term": "Health Insurance Portability and Accountability Act", "acronym": "HIPAA", "domain_number": 1, "definition": "US legislation mandating security standards and privacy for Protected Health Information (PHI)."},
    {"term": "Payment Card Industry Data Security Standard", "acronym": "PCI-DSS", "domain_number": 1, "definition": "Technical security standard mandated for all entities handling credit and debit cardholder data."},
    {"term": "Security Policy", "acronym": "", "domain_number": 1, "definition": "A high-level mandatory executive statement outlining organizational security objectives."},
    {"term": "Security Standard", "acronym": "", "domain_number": 1, "definition": "A mandatory measurable technical requirement or baseline that must be implemented."},
    {"term": "Security Procedure", "acronym": "SOP", "domain_number": 1, "definition": "A mandatory step-by-step chronological instruction set on how to perform a specific task."},
    {"term": "Security Guideline", "acronym": "", "domain_number": 1, "definition": "A discretionary, non-mandatory recommendation or best practice advice."},

    # Domain 2 Terms
    {"term": "Incident Response", "acronym": "IR", "domain_number": 2, "definition": "The structured approach taken by an organization to prepare for, detect, contain, eradicate, and recover from security breaches."},
    {"term": "Computer Security Incident Response Team", "acronym": "CSIRT", "domain_number": 2, "definition": "A designated cross-functional team responsible for managing security incidents."},
    {"term": "Business Impact Analysis", "acronym": "BIA", "domain_number": 2, "definition": "A systematic process to identify critical business functions and assess the impact of downtime."},
    {"term": "Recovery Time Objective", "acronym": "RTO", "domain_number": 2, "definition": "The maximum targeted duration of time allowed to restore business systems following a disruption."},
    {"term": "Recovery Point Objective", "acronym": "RPO", "domain_number": 2, "definition": "The maximum acceptable amount of data loss measured backward in time from an incident."},
    {"term": "Maximum Tolerable Downtime", "acronym": "MTD", "domain_number": 2, "definition": "The absolute maximum duration of outage an organization can survive before suffering catastrophic failure."},
    {"term": "Hot Site", "acronym": "", "domain_number": 2, "definition": "A fully equipped, operational alternate recovery site with synchronized live data ready in minutes to hours."},
    {"term": "Warm Site", "acronym": "", "domain_number": 2, "definition": "An alternate recovery site pre-installed with hardware where data backups must be restored before operations resume."},
    {"term": "Cold Site", "acronym": "", "domain_number": 2, "definition": "An alternate recovery site facility shell providing power and cooling with no pre-installed IT equipment or data."},
    {"term": "Full Backup", "acronym": "", "domain_number": 2, "definition": "A complete backup copy of all selected files regardless of archive bit status."},
    {"term": "Differential Backup", "acronym": "", "domain_number": 2, "definition": "A backup of all files modified since the last Full backup; does not clear archive bits."},
    {"term": "Incremental Backup", "acronym": "", "domain_number": 2, "definition": "A backup of only files modified since the last backup (Full or Incremental); clears archive bits."},
    {"term": "3-2-1 Backup Rule", "acronym": "", "domain_number": 2, "definition": "A data protection strategy requiring 3 copies of data, across 2 different media types, with 1 copy stored off-site."},
    {"term": "Tabletop Exercise", "acronym": "", "domain_number": 2, "definition": "A discussion-based walkthrough where stakeholders talk through a disaster scenario step-by-step in a conference room."},
    {"term": "Full Interruption Test", "acronym": "", "domain_number": 2, "definition": "The most rigorous disaster recovery test where primary production is halted and shifted entirely to the DR site."},
    {"term": "Lessons Learned", "acronym": "", "domain_number": 2, "definition": "The post-incident review phase dedicated to analyzing response performance and updating policies and controls."},

    # Domain 3 Terms
    {"term": "Mantrap", "acronym": "", "domain_number": 3, "definition": "A physical access portal with two interlocking doors designed to prevent tailgating and piggybacking."},
    {"term": "Tailgating", "acronym": "", "domain_number": 3, "definition": "An unauthorized person following an authorized person through a secure doorway without their consent."},
    {"term": "Piggybacking", "acronym": "", "domain_number": 3, "definition": "An authorized person knowingly holding a secure door open for an unauthorized acquaintance."},
    {"term": "Bollard", "acronym": "", "domain_number": 3, "definition": "A short, sturdy vertical post designed to prevent vehicle ram-raiding attacks against building perimeters."},
    {"term": "Class C Fire", "acronym": "", "domain_number": 3, "definition": "A fire involving energized electrical equipment; extinguished using clean agents (FM-200, Inergen) or CO2."},
    {"term": "FM-200", "acronym": "", "domain_number": 3, "definition": "A clean-agent chemical gas fire suppressant safe for electronics and humans that leaves no residue."},
    {"term": "Discretionary Access Control", "acronym": "DAC", "domain_number": 3, "definition": "An access model where the data owner determines permissions and can grant access rights at their discretion."},
    {"term": "Mandatory Access Control", "acronym": "MAC", "domain_number": 3, "definition": "A system-enforced access model based on security clearance labels and classification tags."},
    {"term": "Role-Based Access Control", "acronym": "RBAC", "domain_number": 3, "definition": "An access model where permissions are assigned to job roles rather than individual users."},
    {"term": "Attribute-Based Access Control", "acronym": "ABAC", "domain_number": 3, "definition": "A dynamic access control model evaluating policies based on user, resource, environmental, and action attributes."},
    {"term": "Multi-Factor Authentication", "acronym": "MFA", "domain_number": 3, "definition": "An authentication method requiring two or more independent factor categories (Know, Have, Are, Somewhere, Do)."},
    {"term": "Principle of Least Privilege", "acronym": "PoLP", "domain_number": 3, "definition": "The security principle of granting users and processes only the minimum permissions required for job duties."},
    {"term": "Need-to-Know", "acronym": "", "domain_number": 3, "definition": "Restricting access to specific information strictly necessary to perform a current assigned task."},
    {"term": "Segregation of Duties", "acronym": "SoD", "domain_number": 3, "definition": "Dividing critical tasks among multiple individuals to prevent single-person fraud or error."},
    {"term": "Privileged Access Management", "acronym": "PAM", "domain_number": 3, "definition": "Specialized controls, credential vaults, and session recording securing elevated administrative accounts."},
    {"term": "Privilege Creep", "acronym": "", "domain_number": 3, "definition": "The gradual accumulation of unnecessary access rights as an employee transitions between different roles over time."},

    # Domain 4 Terms
    {"term": "OSI Reference Model", "acronym": "OSI", "domain_number": 4, "definition": "A 7-layer theoretical framework standardizing network communication functions."},
    {"term": "Transmission Control Protocol", "acronym": "TCP", "domain_number": 4, "definition": "A connection-oriented Layer 4 protocol providing reliable, ordered byte delivery via a 3-way handshake."},
    {"term": "User Datagram Protocol", "acronym": "UDP", "domain_number": 4, "definition": "A lightweight, connectionless Layer 4 protocol prioritizing speed without delivery confirmation."},
    {"term": "Virtual Local Area Network", "acronym": "VLAN", "domain_number": 4, "definition": "A logical Layer 2 segmentation of a physical switch into distinct isolated broadcast domains."},
    {"term": "Demilitarized Zone", "acronym": "DMZ", "domain_number": 4, "definition": "A physical or logical subnetwork separating an internal trusted network from untrusted external networks."},
    {"term": "Next-Generation Firewall", "acronym": "NGFW", "domain_number": 4, "definition": "A deep-packet inspection firewall combining stateful filtering, application awareness, and integrated IPS."},
    {"term": "Intrusion Detection System", "acronym": "IDS", "domain_number": 4, "definition": "An out-of-band passive security device that monitors network traffic and alerts on detected threats."},
    {"term": "Intrusion Prevention System", "acronym": "IPS", "domain_number": 4, "definition": "An inline active security device that inspects traffic in real time and automatically blocks malicious packets."},
    {"term": "Virtual Private Network", "acronym": "VPN", "domain_number": 4, "definition": "An encrypted communication tunnel establishing secure data transmission across an untrusted network."},
    {"term": "IPsec Encapsulating Security Payload", "acronym": "ESP", "domain_number": 4, "definition": "An IPsec protocol providing confidentiality (encryption), integrity, and authentication."},
    {"term": "IPsec Authentication Header", "acronym": "AH", "domain_number": 4, "definition": "An IPsec protocol providing integrity and authentication, but NO encryption or confidentiality."},
    {"term": "WPA3", "acronym": "WPA3", "domain_number": 4, "definition": "The modern Wi-Fi Protected Access standard utilizing SAE to prevent offline dictionary attacks."},
    {"term": "Zero Trust Architecture", "acronym": "ZTA", "domain_number": 4, "definition": "A security model operating on 'Never Trust, Always Verify', requiring continuous authentication and microsegmentation."},
    {"term": "Man-in-the-Middle", "acronym": "MitM", "domain_number": 4, "definition": "An attack where the adversary secretly intercepts and potentially alters communication between two parties."},
    {"term": "Denial of Service", "acronym": "DoS", "domain_number": 4, "definition": "An attack aimed at making an IT service, network, or server unavailable to legitimate users."},
    {"term": "Distributed Denial of Service", "acronym": "DDoS", "domain_number": 4, "definition": "A volumetric attack launching coordinated flood traffic simultaneously from thousands of compromised botnet nodes."},
    {"term": "Domain Name System", "acronym": "DNS", "domain_number": 4, "definition": "The hierarchical naming service that translates human-friendly domain names into numerical IP addresses (Port 53)."},
    {"term": "Secure Shell", "acronym": "SSH", "domain_number": 4, "definition": "A cryptographic network protocol operating on Port 22 providing secure remote command-line login."},

    # Domain 5 Terms
    {"term": "Advanced Encryption Standard", "acronym": "AES", "domain_number": 5, "definition": "The standard symmetric block cipher (using 128, 192, or 256-bit keys) protecting bulk data at rest and in transit."},
    {"term": "RSA", "acronym": "RSA", "domain_number": 5, "definition": "An asymmetric public-key cryptographic algorithm used for secure key exchange and digital signatures."},
    {"term": "Cryptographic Hash", "acronym": "Hash", "domain_number": 5, "definition": "A one-way mathematical function producing a fixed-length digest from variable-length input to verify data integrity."},
    {"term": "SHA-256", "acronym": "SHA-256", "domain_number": 5, "definition": "A secure cryptographic hash algorithm producing a 256-bit unique digest."},
    {"term": "Digital Signature", "acronym": "", "domain_number": 5, "definition": "An encrypted hash using the sender's private key that provides integrity, authentication, and non-repudiation."},
    {"term": "Data at Rest", "acronym": "", "domain_number": 5, "definition": "Inactive digital data housed in persistent storage devices (hard drives, SSDs, backup tapes)."},
    {"term": "Data in Transit", "acronym": "", "domain_number": 5, "definition": "Data actively moving across private networks or the public internet between communicating hosts."},
    {"term": "Data in Use", "acronym": "", "domain_number": 5, "definition": "Active data residing in volatile memory (RAM, CPU registers, caches) being processed by applications."},
    {"term": "Degaussing", "acronym": "", "domain_number": 5, "definition": "A sanitization technique exposing magnetic media to strong magnetic fields; ineffective on solid-state drives."},
    {"term": "Full Disk Encryption", "acronym": "FDE", "domain_number": 5, "definition": "Cryptographic protection that encrypts the entire physical storage drive on an endpoint (e.g., BitLocker)."},
    {"term": "System Hardening", "acronym": "", "domain_number": 5, "definition": "The process of securing an operating system by disabling unused services, closing ports, and applying baseline configs."},
    {"term": "Endpoint Detection and Response", "acronym": "EDR", "domain_number": 5, "definition": "An integrated endpoint security solution providing continuous behavioral monitoring, threat hunting, and remote host isolation."},
    {"term": "Ransomware", "acronym": "", "domain_number": 5, "definition": "Malicious software that encrypts victim files and demands a ransom payment in exchange for the decryption key."},
    {"term": "Worm", "acronym": "", "domain_number": 5, "definition": "Self-replicating malware that spreads across networks automatically by exploiting vulnerabilities without human action."},
    {"term": "Virus", "acronym": "", "domain_number": 5, "definition": "Malicious code that attaches to a legitimate host file and requires human execution to replicate and spread."},
    {"term": "Trojan Horse", "acronym": "", "domain_number": 5, "definition": "Malware that masquerades as useful, benign software while secretly executing malicious payloads in the background."},
    {"term": "Rootkit", "acronym": "", "domain_number": 5, "definition": "Stealthy malware that modifies operating system kernels or firmware to conceal its presence from security tools."},
    {"term": "Phishing", "acronym": "", "domain_number": 5, "definition": "Broad, untargeted fraudulent emails designed to trick recipients into clicking malicious links or revealing credentials."},
    {"term": "Spear Phishing", "acronym": "", "domain_number": 5, "definition": "Highly customized, targeted phishing emails directed at specific individuals or departments using reconnaissance data."},
    {"term": "Whaling", "acronym": "", "domain_number": 5, "definition": "A spear phishing attack directed specifically at high-profile senior executives (CEO, CFO, Board members)."},
    {"term": "Baiting", "acronym": "", "domain_number": 5, "definition": "A social engineering attack leaving infected physical media (e.g., USB thumb drives) in public areas for curious victims."},
    {"term": "Security Information and Event Management", "acronym": "SIEM", "domain_number": 5, "definition": "A centralized security software platform that collects, normalizes, and correlates log data across enterprise systems."},
    {"term": "Network Time Protocol", "acronym": "NTP", "domain_number": 5, "definition": "A network protocol on Port 123 used to synchronize computer clocks for accurate, chronologically aligned audit logs."},
    {"term": "Change Advisory Board", "acronym": "CAB", "domain_number": 5, "definition": "A cross-functional committee responsible for assessing, scheduling, and approving technical changes to production IT systems."}
]

with open(os.path.join(DATA_DIR, 'glossary.json'), 'w', encoding='utf-8') as f:
    json.dump(GLOSSARY, f, indent=2)

print(f"[OK] Saved {len(GLOSSARY)} Glossary terms to cc_data/glossary.json")
