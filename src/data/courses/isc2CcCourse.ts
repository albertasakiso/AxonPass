/* ===================================================================
   ANOXPASS — ISC2 Certified in Cybersecurity (CC) End-to-End Course
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const ISC2_CC_COURSE: CertificationCourse = {
  certId: 'isc2-cc',
  certCode: 'CC',
  title: 'ISC2 Certified in Cybersecurity (CC)',
  provider: 'ISC2',
  tier: 1,
  tagline: 'Zero-to-exam-ready mastery across all 5 ISC2 CC domains.',
  estimatedTotalHours: 35,
  passingScore: '700 / 1000',
  domains: [
    {
      id: 'cc-d1',
      domainNumber: 1,
      title: 'Security Principles',
      examWeightPercent: 26,
      overview: 'Master the CIA Triad, AAA, Risk Management, Security Controls, Governance, and the ISC2 Code of Ethics.',
      lessons: [
        {
          id: 'cc-d1-l1',
          title: 'Information Assurance: CIA Triad, AAA & Non-Repudiation',
          estimatedMinutes: 35,
          summary: 'Understand the core pillars of information security and how authentication, authorization, and accounting enforce them.',
          learningObjectives: [
            'Differentiate Confidentiality, Integrity, and Availability with concrete controls',
            'Explain Authentication, Authorization, Accounting (AAA) and Non-Repudiation',
            'Select appropriate controls (Preventive, Detective, Corrective) for real threats',
          ],
          coreConcepts: [
            {
              heading: 'The CIA Triad',
              explanation:
                'Confidentiality ensures only authorized parties view data (encryption, ACLs). Integrity ensures data is accurate and unaltered (hashing, digital signatures). Availability ensures authorized users have reliable, timely access (redundancy, backups, DDoS protection).',
              mentalModel: 'Lock (Confidentiality), Wax Seal (Integrity), Open Door for Keyholders (Availability).',
            },
            {
              heading: 'AAA & Non-Repudiation',
              explanation:
                'Authentication proves identity (MFA: something you know, have, or are). Authorization determines permitted actions (RBAC). Accounting logs activity for audit trails. Non-repudiation uses asymmetric digital signatures so a sender cannot deny signing a transaction.',
              formulaOrRule: 'Digital Signature = Hash(Message) encrypted with Sender Private Key.',
            },
          ],
          realWorldScenario: {
            title: 'Payroll Wire Fraud Prevention',
            situation: 'An attacker spoofs the CFO email and requests an urgent $250,000 wire transfer.',
            analysis: 'Without digital signatures (integrity/non-repudiation) and out-of-band verification (procedural control), confidentiality was not breached—integrity and authentication were.',
            takeaway: 'Always map attacks to the exact CIA pillar violated before selecting controls.',
          },
          examTraps: [
            'Hashing provides Integrity, NOT Confidentiality (encryption provides confidentiality).',
            'MFA requires factors from DIFFERENT categories—two passwords is NOT MFA.',
          ],
          keyTerms: [
            { term: 'Non-Repudiation', definition: 'Assurance that a party cannot deny the authenticity of their signature or action.' },
            { term: 'Defense in Depth', definition: 'Layering multiple independent security controls so a single failure does not cause breach.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d1-l1-q1',
              question: 'Which control BEST provides non-repudiation for an electronic contract?',
              options: ['AES-256 symmetric encryption', 'SHA-256 hash alone', 'Digital signature using sender private key', 'RADIUS accounting logs'],
              correctIndex: 2,
              rationale: 'Only asymmetric digital signatures bind the signer’s unique private key to the message hash, preventing denial.',
            },
            {
              id: 'cc-d1-l1-q2',
              question: 'A user enters a PIN and swipes a smart badge. What is this an example of?',
              options: ['Single-factor authentication', 'Multi-factor authentication (Knowledge + Possession)', 'Role-Based Access Control', 'Single Sign-On'],
              correctIndex: 1,
              rationale: 'PIN (something you know) + smart badge (something you have) are two distinct authentication factor categories.',
            },
          ],
          practicalDrill: {
            title: 'CIA Control Mapping Matrix',
            prompt: 'Map 6 common controls (AES, SHA-256, RAID-6, RBAC, SIEM, UPS) to their primary CIA pillar and control category.',
            steps: ['Classify each control as C, I, or A.', 'Classify each as Preventive, Detective, or Corrective.'],
            successCriteria: '100% accurate mapping of all 6 controls.',
          },
          flashcards: [
            { front: 'What does a Digital Signature provide?', back: 'Integrity, Authentication, and Non-Repudiation (NOT Confidentiality).', tag: 'ISC2-CC-D1' },
            { front: 'What are the 3 MFA factor categories?', back: 'Something you know (password), something you have (token), something you are (biometric).', tag: 'ISC2-CC-D1' },
          ],
          sourceRefs: ['my_documents/isc2-cc/', 'my_documents/ISC2-CC-Dump-Questions-Study-Material-main/Most essential topics.md'],
        },
        {
          id: 'cc-d1-l2',
          title: 'Risk Management, Governance & ISC2 Code of Ethics',
          estimatedMinutes: 35,
          summary: 'Master risk formulas, the 4 risk treatment options, policy hierarchy, and the mandatory priority order of the ISC2 Ethics Canons.',
          learningObjectives: [
            'Differentiate Threat, Vulnerability, Likelihood, Impact, and Risk',
            'Apply Risk Avoidance, Mitigation, Transference, and Acceptance',
            'Rank the 4 ISC2 Code of Ethics Canons in strict priority order',
          ],
          coreConcepts: [
            {
              heading: 'Risk Formula & Treatment',
              explanation:
                'Risk occurs where a Threat exploits a Vulnerability causing business Impact. Treatment options: Avoid (stop the activity), Mitigate (add controls), Transfer (cyber insurance/outsourcing), Accept (document residual risk within appetite).',
              formulaOrRule: 'Risk = Likelihood × Impact | Residual Risk = Inherent Risk − Controls',
            },
            {
              heading: 'ISC2 Code of Ethics Canons (Strict Order)',
              explanation:
                '1. Protect society, the common good, necessary public trust and confidence, and the infrastructure. 2. Act honorably, honestly, justly, responsibly, and legally. 3. Provide diligent and competent service to principals. 4. Advance and protect the profession.',
              mentalModel: 'Society -> Honor/Law -> Principals (Employer) -> Profession.',
            },
          ],
          realWorldScenario: {
            title: 'Conflicting Executive Order',
            situation: 'A manager asks you to hide a vulnerability that exposes citizen medical records to avoid delaying a product launch.',
            analysis: 'Canon 1 (Protect society & public trust) strictly overrides Canon 3 (Service to principals).',
            takeaway: 'On ISC2 exams, public safety and societal protection ALWAYS outrank employer convenience.',
          },
          examTraps: [
            'Policies are high-level and mandatory; Guidelines are optional recommendations; Procedures are step-by-step instructions.',
            'Cyber insurance transfers FINANCIAL risk, never legal or reputational accountability.',
          ],
          keyTerms: [
            { term: 'Residual Risk', definition: 'Risk remaining after security controls have been implemented.' },
            { term: 'Standard', definition: 'Mandatory technical or operational specification supporting a policy.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d1-l2-q1',
              question: 'Purchasing cyber liability insurance is an example of which risk treatment?',
              options: ['Risk Avoidance', 'Risk Mitigation', 'Risk Transference', 'Risk Acceptance'],
              correctIndex: 2,
              rationale: 'Insurance shifts the financial impact of an incident to a third-party insurer (Risk Transference).',
            },
          ],
          practicalDrill: {
            title: 'Governance Document Classifier',
            prompt: 'Classify 4 organizational documents into Policy, Standard, Procedure, or Guideline.',
            steps: ['Identify mandatory vs optional.', 'Identify strategic vs step-by-step.'],
            successCriteria: 'Correctly distinguish all 4 governance tiers.',
          },
          flashcards: [
            { front: 'Order of ISC2 Code of Ethics Canons?', back: '1. Protect society, 2. Act honorably/legally, 3. Diligent service to principals, 4. Advance the profession.', tag: 'ISC2-CC-D1' },
          ],
          sourceRefs: ['my_documents/ISC2-CC-Dump-Questions-Study-Material-main/Preparation for ISC2 CC.pdf'],
        },
      ],
    },
    {
      id: 'cc-d2',
      domainNumber: 2,
      title: 'Business Continuity, Disaster Recovery & Incident Response',
      examWeightPercent: 10,
      overview: 'Prepare organizations to survive disruptions and contain security incidents rapidly.',
      lessons: [
        {
          id: 'cc-d2-l1',
          title: 'BCP, DRP, BIA & The Incident Response Lifecycle',
          estimatedMinutes: 35,
          summary: 'Distinguish Business Continuity (keeping business running) from Disaster Recovery (restoring IT) and master NIST IR phases.',
          learningObjectives: [
            'Calculate and compare RTO, RPO, and MTD/MTPD',
            'Sequence the NIST Incident Response phases accurately',
            'Select Hot, Warm, or Cold recovery sites based on RTO/cost',
          ],
          coreConcepts: [
            {
              heading: 'BCP vs DRP & Key Metrics',
              explanation:
                'Business Impact Analysis (BIA) identifies critical functions. RTO (Recovery Time Objective) is max tolerable downtime. RPO (Recovery Point Objective) is max tolerable data loss (dictates backup frequency).',
              mentalModel: 'RPO looks backward in time (data); RTO looks forward in time (downtime).',
            },
            {
              heading: 'NIST Incident Response Lifecycle',
              explanation:
                'Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity (Lessons Learned).',
              formulaOrRule: 'Human life & safety ALWAYS come first in any emergency.',
            },
          ],
          realWorldScenario: {
            title: 'Ransomware on Hospital EHR',
            situation: 'Workstations begin encrypting files; backups run every 4 hours.',
            analysis: 'Immediate step after detection is Containment (isolate infected VLANs) to stop lateral spread. Maximum data loss is 4 hours (RPO).',
            takeaway: 'Contain before you eradicate; never wipe forensic evidence prematurely.',
          },
          examTraps: [
            'Hot sites have the lowest RTO and highest cost; Cold sites have the highest RTO and lowest cost.',
            'Tabletop exercises are discussion-based and lowest risk; Full Interruption tests carry the highest operational risk.',
          ],
          keyTerms: [
            { term: 'RPO', definition: 'Maximum acceptable amount of data loss measured in time.' },
            { term: 'RTO', definition: 'Target time to restore a system after a disruption.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d2-l1-q1',
              question: 'A bank requires zero data loss (RPO = 0) and recovery within 15 minutes. Which site is required?',
              options: ['Cold site', 'Warm site', 'Hot site with synchronous replication', 'Mobile trailer'],
              correctIndex: 2,
              rationale: 'Only a hot site with real-time synchronous replication achieves near-zero RPO and rapid RTO.',
            },
          ],
          practicalDrill: {
            title: 'IR Phase Ordering Drill',
            prompt: 'Sequence 6 real-world SOC actions into the 4 NIST IR phases.',
            steps: ['Map SIEM alert triage, VLAN isolation, malware removal, backup restore, and lessons-learned report.'],
            successCriteria: 'Zero out-of-order phases.',
          },
          flashcards: [
            { front: 'RPO vs RTO?', back: 'RPO = max acceptable data loss (backup frequency). RTO = max acceptable downtime (recovery speed).', tag: 'ISC2-CC-D2' },
          ],
          sourceRefs: ['my_documents/ISC2-CC-Dump-Questions-Study-Material-main/Last Week Preparations/'],
        },
      ],
    },
    {
      id: 'cc-d3',
      domainNumber: 3,
      title: 'Access Controls Concepts',
      examWeightPercent: 22,
      overview: 'Master physical and logical access controls, Least Privilege, Segregation of Duties, and MAC/DAC/RBAC/ABAC.',
      lessons: [
        {
          id: 'cc-d3-l1',
          title: 'Physical Controls & Logical Access Models (MAC, DAC, RBAC, ABAC)',
          estimatedMinutes: 35,
          summary: 'Apply layered physical security and choose the right logical authorization model for enterprise and government environments.',
          learningObjectives: [
            'Compare DAC, MAC, RBAC, and ABAC access control models',
            'Apply Principle of Least Privilege and Segregation of Duties',
            'Design physical security perimeters (mantraps, bollards, CCTV, badges)',
          ],
          coreConcepts: [
            {
              heading: 'Access Control Models',
              explanation:
                'DAC (Discretionary): data owner sets permissions (Windows/Linux files). MAC (Mandatory): OS enforces security clearance labels (Top Secret/Secret). RBAC (Role-Based): permissions tied to job function. ABAC (Attribute-Based): dynamic rules using user, time, location, and device attributes.',
              mentalModel: 'DAC = Owner decides; MAC = Government labels; RBAC = Job title; ABAC = Dynamic policy.',
            },
            {
              heading: 'Least Privilege & Segregation of Duties (SoD)',
              explanation:
                'Least Privilege grants only the minimum access needed for a task. SoD splits critical transactions across two people (e.g., one requests payment, another approves) to prevent fraud.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Tailgating in a Data Center',
            situation: 'Contractors frequently hold the door open for unbadged visitors entering the server room.',
            analysis: 'Installing an access control vestibule (mantrap) physically enforces one-person-per-authentication.',
            takeaway: 'Physical controls prevent tailgating better than awareness posters alone.',
          },
          examTraps: [
            'Mandatory Access Control (MAC) is NOT about network MAC addresses—it is label-based clearance enforcement.',
          ],
          keyTerms: [
            { term: 'Mantrap', definition: 'Dual-door physical vestibule preventing tailgating/piggybacking.' },
            { term: 'Privilege Creep', definition: 'Accumulation of unnecessary permissions when users change roles without access reviews.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d3-l1-q1',
              question: 'Which model grants permissions based on a user’s job function such as "Payroll Clerk"?',
              options: ['DAC', 'MAC', 'RBAC', 'Rule-Based'],
              correctIndex: 2,
              rationale: 'Role-Based Access Control (RBAC) assigns permissions to organizational roles.',
            },
          ],
          practicalDrill: {
            title: 'SoD Conflict Detector',
            prompt: 'Spot 3 Segregation of Duties violations in a small IT shop (Developer + Prod Deployer, Admin + Auditor).',
            steps: ['Identify conflicting privileges.', 'Propose compensating detective controls if headcount is limited.'],
            successCriteria: 'All 3 conflicts identified with valid compensating controls.',
          },
          flashcards: [
            { front: 'How do you prevent Privilege Creep?', back: 'Periodic access reviews / recertification and immediate revocation upon role change.', tag: 'ISC2-CC-D3' },
          ],
          sourceRefs: ['my_documents/ISC2-CC-Dump-Questions-Study-Material-main/Resources by ISC2/'],
        },
      ],
    },
    {
      id: 'cc-d4',
      domainNumber: 4,
      title: 'Network Security',
      examWeightPercent: 24,
      overview: 'Master the OSI Model, TCP/IP, common ports, firewalls, segmentation, and cloud shared responsibility.',
      lessons: [
        {
          id: 'cc-d4-l1',
          title: 'OSI Model, Ports, Segmentation & Network Defense',
          estimatedMinutes: 40,
          summary: 'Understand how data traverses Layers 1–7, secure network perimeters with DMZs/VLANs/VPNs, and defend against network attacks.',
          learningObjectives: [
            'Map protocols and devices to OSI Layers 1–7',
            'Memorize critical ports (22, 23, 25, 53, 80, 443, 3389)',
            'Explain DMZ, VLAN segmentation, IDS vs IPS, and Cloud Shared Responsibility',
          ],
          coreConcepts: [
            {
              heading: 'OSI Model Layers (7 -> 1)',
              explanation:
                '7-Application (HTTP/DNS), 6-Presentation (TLS/Encryption), 5-Session, 4-Transport (TCP/UDP), 3-Network (IP/Routers), 2-Data Link (MAC/Switches/ARP), 1-Physical (Cables/Hubs).',
              mentalModel: 'Please Do Not Throw Sausage Pizza Away (1->7).',
            },
            {
              heading: 'IDS vs IPS & Segmentation',
              explanation:
                'IDS (Intrusion Detection System) is passive and alerts only. IPS (Intrusion Prevention System) sits inline and actively blocks malicious traffic. DMZ isolates public-facing web servers from internal LANs.',
            },
          ],
          realWorldScenario: {
            title: 'Securing Public Web Servers',
            situation: 'A company hosts an e-commerce web server on the same flat subnet as its HR database.',
            analysis: 'Compromising the web server gives direct access to HR data. Move the web server into a DMZ and segment HR onto a restricted VLAN.',
            takeaway: 'Network segmentation limits blast radius.',
          },
          examTraps: [
            'TCP is connection-oriented (3-way handshake: SYN, SYN-ACK, ACK); UDP is connectionless and faster (DNS, VoIP).',
            'In Cloud IaaS, the customer still patches the Guest OS; in SaaS, the provider manages almost everything except data & user access.',
          ],
          keyTerms: [
            { term: 'DMZ (Screened Subnet)', definition: 'Buffer network isolating public-facing services from internal corporate networks.' },
            { term: 'Zero Trust', definition: 'Never trust, always verify—authenticate and authorize every request regardless of network location.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d4-l1-q1',
              question: 'At which OSI layer do routers forward packets using IP addresses?',
              options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
              correctIndex: 1,
              rationale: 'Routers operate at Layer 3 (Network) using logical IP addressing.',
            },
          ],
          practicalDrill: {
            title: 'Port & Protocol Speed Drill',
            prompt: 'Match SSH (22), Telnet (23), DNS (53), HTTP (80), HTTPS (443), RDP (3389) to their secure/insecure status.',
            steps: ['Flag Telnet and HTTP as plaintext.', 'Specify their encrypted replacements (SSH, HTTPS).'],
            successCriteria: '100% accuracy in under 60 seconds.',
          },
          flashcards: [
            { front: 'TCP 3-Way Handshake?', back: 'SYN -> SYN-ACK -> ACK.', tag: 'ISC2-CC-D4' },
            { front: 'IDS vs IPS?', back: 'IDS = passive detection/alerting. IPS = inline active blocking.', tag: 'ISC2-CC-D4' },
          ],
          sourceRefs: ['my_documents/OSI Layers.pdf', 'my_documents/ISC2-CC-Dump-Questions-Study-Material-main/'],
        },
      ],
    },
    {
      id: 'cc-d5',
      domainNumber: 5,
      title: 'Security Operations',
      examWeightPercent: 18,
      overview: 'Master data handling, encryption, logging/SIEM, configuration & change management, and security awareness.',
      lessons: [
        {
          id: 'cc-d5-l1',
          title: 'Data Lifecycle, Change Management & Security Awareness',
          estimatedMinutes: 35,
          summary: 'Protect data from creation to destruction, prevent outages with formal change control, and harden the human layer.',
          learningObjectives: [
            'Apply Data Classification, Labeling, Retention, and Sanitization (Cryptographic Erasure, Degaussing, Destruction)',
            'Follow formal Change Management (Request -> CAB Approval -> Test -> Deploy -> Document)',
            'Design effective anti-phishing security awareness training',
          ],
          coreConcepts: [
            {
              heading: 'Data States & Encryption',
              explanation:
                'Data at Rest (AES-256 full-disk/DB encryption), Data in Transit (TLS 1.3/IPsec), Data in Use (RAM/enclaves). Proper disposal prevents data remanence.',
              mentalModel: 'Rest = Vault, Transit = Armored Truck, Use = Secure Room.',
            },
            {
              heading: 'Configuration & Change Management',
              explanation:
                'Establish hardened security baselines (CIS Benchmarks). Every production change requires a ticket, impact assessment, Change Advisory Board (CAB) approval, rollback plan, and documentation.',
            },
          ],
          realWorldScenario: {
            title: 'Decommissioning Old SSDs',
            situation: 'IT plans to donate old laptops after running a quick OS format.',
            analysis: 'Quick formatting leaves data recoverable. For SSDs, use cryptographic erasure or physical shredding (degaussing does NOT work on SSDs!).',
            takeaway: 'Never degauss SSDs—degaussing only works on magnetic media (HDDs/tapes).',
          },
          examTraps: [
            'Degaussing works ONLY on magnetic storage (HDD/tape), NOT on SSDs/flash.',
            'Symmetric encryption (AES) is fast for bulk data; Asymmetric (RSA/ECC) is slower and used for key exchange and signatures.',
          ],
          keyTerms: [
            { term: 'Hardening', definition: 'Removing unnecessary services, default accounts, and open ports to shrink attack surface.' },
            { term: 'SIEM', definition: 'Security Information and Event Management—centralizes and correlates logs for threat detection.' },
          ],
          conceptChecks: [
            {
              id: 'cc-d5-l1-q1',
              question: 'Why is a Change Advisory Board (CAB) used in change management?',
              options: ['To write application code', 'To review risk, business impact, and rollback plans before approving changes', 'To replace firewalls', 'To conduct phishing tests'],
              correctIndex: 1,
              rationale: 'CAB ensures changes are evaluated for security/operational risk and have tested rollback plans.',
            },
          ],
          practicalDrill: {
            title: 'Data Sanitization Selector',
            prompt: 'Choose the right disposal method for Paper, Magnetic HDD, and Encrypted SSD.',
            steps: ['Paper -> Cross-cut shred/pulping', 'HDD -> Degauss/crush', 'SSD -> Crypto-erase/shred'],
            successCriteria: 'Zero media-method mismatches.',
          },
          flashcards: [
            { front: 'Does degaussing work on SSDs?', back: 'No—degaussing only works on magnetic media (HDDs/tapes). Use cryptographic erasure or physical shredding for SSDs.', tag: 'ISC2-CC-D5' },
          ],
          sourceRefs: ['my_documents/ISC2-CC-Dump-Questions-Study-Material-main/practice_exam.md'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Startup Security Launchpad Audit',
    scenario: 'A 40-person fintech startup has flat Wi-Fi, shared admin passwords, no backups, and zero incident response plan.',
    tasks: [
      'Prioritize the top 3 controls mapped to CIA Triad.',
      'Recommend an Access Control model and MFA policy.',
      'Design a basic 3-2-1 backup and IR containment plan.',
    ],
    modelSolution: '1) Eliminate shared admin accounts + enforce MFA + RBAC (Confidentiality/Access). 2) Segment guest Wi-Fi, production, and corporate VLANs (Network Security). 3) Implement 3-2-1 immutable backups + written IR containment playbook (Availability/DR).',
  },
  examStrategy: {
    examFormat: '100 multiple-choice questions, 2 hours (120 minutes), linear (cannot go back to previous questions on ISC2 CC!).',
    timeManagementPlan: 'Average 72 seconds per question. Read the stem twice before locking your answer since you cannot revisit questions.',
    mindsetRules: [
      'Always prioritize human life and safety first.',
      'Apply ISC2 Code of Ethics priority: Society -> Law/Honor -> Principals -> Profession.',
      'Choose the most foundational, policy-driven answer when two technical answers look close.',
    ],
    finalWeekChecklist: [
      'Review all 5 domain weights and OSI Layer 1–7 chart',
      'Score >= 85% on 3 consecutive 100-question timed mocks',
      'Clear all due FSRS flashcards',
    ],
  },
};
