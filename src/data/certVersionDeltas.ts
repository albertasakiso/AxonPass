/* ===================================================================
   APILIGU LEARNING PASS — Universal Multi-Cert Version Delta Repository
   Authoritative blueprint transition matrices across all 15 certifications.
   Covers domain weight shifts, added technical competencies, auditor/analyst
   responsibilities, exam alert traps, and key terms.
   =================================================================== */

export interface DeltaFeature {
  id: string;
  domain: number;
  domainName: string;
  title: string;
  sectionRef: string;
  category: 'AI / Analytics' | 'Cybersecurity' | 'Resilience' | 'Governance & Privacy' | 'SDLC & Cloud' | 'Regulatory & Legal' | 'Infrastructure';
  summary: string;
  whyAdded: string;
  roleResponsibility: string;
  examTip: string;
  keyTerms: string[];
}

export interface DomainWeightComparison {
  domain: number;
  name: string;
  vOld: number;
  vNew: number;
  delta: number;
  impact: string;
}

export interface CertDeltaMatrix {
  certCode: string;
  certName: string;
  oldVersionLabel: string;
  newVersionLabel: string;
  releaseYear: string;
  executiveSummary: string;
  domainWeights: DomainWeightComparison[];
  features: DeltaFeature[];
}

export const CERT_VERSION_DELTAS: Record<string, CertDeltaMatrix> = {
  // 1. ISACA CISA
  cisa: {
    certCode: 'CISA',
    certName: 'Certified Information Systems Auditor',
    oldVersionLabel: 'Version 27 (2019)',
    newVersionLabel: 'Version 28 (August 2024)',
    releaseYear: '2024',
    executiveSummary: 'Major restructuring shifting 6% weight directly into Domain 4 (Operations & Business Resilience), adding formal AI in audit methodologies, Zero Trust, 3-2-1 immutable backups, DevSecOps shift-left automation, and transborder privacy governance.',
    domainWeights: [
      { domain: 1, name: 'IS Auditing Process', vOld: 21, vNew: 18, delta: -3, impact: 'Focus shifted to automated assurance & analytics' },
      { domain: 2, name: 'Governance & Management of IT', vOld: 17, vNew: 18, delta: +1, impact: 'Expanded Data Privacy, ERM & Three Lines Model' },
      { domain: 3, name: 'IS Acquisition & Development', vOld: 12, vNew: 12, delta: 0, impact: 'Integrated DevSecOps, Agile & Cloud CI/CD' },
      { domain: 4, name: 'IS Operations & Business Resilience', vOld: 20, vNew: 26, delta: +6, impact: 'MAJOR EXPANSION: Shadow IT, Cloud HA, 3-2-1 Backups' },
      { domain: 5, name: 'Protection of Information Assets', vOld: 30, vNew: 26, delta: -4, impact: 'Refocused on Zero Trust, PAM, EDR/XDR & SOAR' },
    ],
    features: [
      {
        id: 'cisa-ai-audit',
        domain: 1,
        domainName: 'Information System Auditing Process',
        title: 'Artificial Intelligence & Machine Learning in IS Audit',
        sectionRef: 'Section 1.8.4',
        category: 'AI / Analytics',
        summary: 'Integration of machine learning algorithms for continuous anomaly detection, automated risk scoring, and formal guidelines for auditing AI/ML models.',
        whyAdded: 'Enterprises deploy automated AI decision engines; auditors must evaluate algorithmic bias, training data integrity, and model drift.',
        roleResponsibility: 'Verify data provenance, test AI model explainability, ensure human-in-the-loop oversight, and validate model benchmarks.',
        examTip: 'Watch for questions on model explainability and algorithmic bias. The auditor must verify training data integrity before relying on AI outputs.',
        keyTerms: ['Audit Algorithms', 'Algorithmic Bias', 'Model Explainability', 'Model Drift', 'Continuous Auditing'],
      },
      {
        id: 'cisa-devsecops',
        domain: 3,
        domainName: 'Information Systems Acquisition, Development & Implementation',
        title: 'DevSecOps & Shift-Left CI/CD Pipeline Security',
        sectionRef: 'Sections 3.3.5 & 5.8.10',
        category: 'SDLC & Cloud',
        summary: 'Embedding automated security testing (SAST, DAST, SCA) directly into continuous integration and continuous delivery (CI/CD) pipelines.',
        whyAdded: 'Security cannot be an afterthought at the end of the SDLC. Shift-left automation catches vulnerabilities when they are cheapest to remediate.',
        roleResponsibility: 'Verify that automated security quality gates block vulnerable code from merging, audit secrets management, and review container scanning.',
        examTip: 'SAST analyzes source code (white-box) during development. DAST tests running applications (black-box) during runtime.',
        keyTerms: ['Shift-Left Security', 'SAST vs DAST', 'Software Composition Analysis (SCA)', 'CI/CD Quality Gates', 'IaC Security'],
      },
      {
        id: 'cisa-immutable-backup',
        domain: 4,
        domainName: 'Information Systems Operations and Business Resilience',
        title: '3-2-1 Immutable Backup Architecture & Ransomware Resilience',
        sectionRef: 'Section 4.14.3',
        category: 'Resilience',
        summary: 'Mandating 3-2-1 backup architectures with immutable Write-Once-Read-Many (WORM) storage and air-gapped snapshots to guarantee ransomware survival.',
        whyAdded: 'Ransomware actors actively target and encrypt online backup repositories first. Immutable and air-gapped backups are the only fail-safe recovery mechanism.',
        roleResponsibility: 'Verify physical/logical separation of backup networks, audit regular restoration test logs, and validate RPO/RTO calculations.',
        examTip: 'The 3-2-1 rule: 3 copies of data, on 2 different media, with 1 copy offsite/immutable. Regular restoration testing is mandatory to prove backup integrity.',
        keyTerms: ['3-2-1 Backup Strategy', 'Immutable Storage (WORM)', 'Air-Gapped Repositories', 'RPO / RTO', 'Restoration Verification'],
      },
      {
        id: 'cisa-zero-trust',
        domain: 5,
        domainName: 'Protection of Information Assets',
        title: 'Zero Trust Architecture (NIST SP 800-207) & PAM',
        sectionRef: 'Sections 5.3.3 & 5.3.4',
        category: 'Cybersecurity',
        summary: 'Adoption of NIST SP 800-207 Zero Trust ("Never Trust, Always Verify"), Just-In-Time (JIT) credential elevation, and automated identity governance (IGA).',
        whyAdded: 'Perimeter castle-and-moat defenses fail once credentials are compromised. Zero Trust continuously authenticates and authorizes every session.',
        roleResponsibility: 'Evaluate dynamic access policies, verify PAM vaulting and session recording for superusers, and test microsegmentation boundaries.',
        examTip: 'In Zero Trust, location on internal corporate network grants ZERO implicit trust. Every session requires identity verification and posture assessment.',
        keyTerms: ['Zero Trust (NIST SP 800-207)', 'PAM Vaulting', 'Just-In-Time (JIT) Access', 'Microsegmentation', 'IGA & IDaaS'],
      },
    ],
  },

  // 2. ISC2 CC (Certified in Cybersecurity)
  'isc2-cc': {
    certCode: 'CC',
    certName: 'Certified in Cybersecurity',
    oldVersionLabel: '2022 Launch Outline',
    newVersionLabel: '2024/2025 Refreshed Exam Outline',
    releaseYear: '2024',
    executiveSummary: 'Strengthened emphasis on Zero Trust fundamentals, cloud shared responsibility matrix, remote work hardening, and multi-factor authentication (phishing-resistant MFA) for foundational cyber roles.',
    domainWeights: [
      { domain: 1, name: 'Security Principles', vOld: 26, vNew: 24, delta: -2, impact: 'Rebalanced to emphasize practical application' },
      { domain: 2, name: 'Business Continuity, DR & IR', vOld: 10, vNew: 11, delta: +1, impact: 'Added modern cyber incident response escalation' },
      { domain: 3, name: 'Access Controls Concepts', vOld: 22, vNew: 24, delta: +2, impact: 'Increased weight on Zero Trust, RBAC & MFA' },
      { domain: 4, name: 'Network Security', vOld: 24, vNew: 23, delta: -1, impact: 'Shifted from legacy perimeter to cloud networking' },
      { domain: 5, name: 'Security Operations', vOld: 18, vNew: 18, delta: 0, impact: 'Integrated endpoint protection & patch hygiene' },
    ],
    features: [
      {
        id: 'cc-zero-trust',
        domain: 3,
        domainName: 'Access Controls Concepts',
        title: 'Zero Trust Network Architecture (ZTNA) Fundamentals',
        sectionRef: 'Domain 3 § 3.2',
        category: 'Cybersecurity',
        summary: 'Fundamental shift away from perimeter-only trust towards continuous verification of user identity, device posture, and session context.',
        whyAdded: 'Remote work and cloud services mean network perimeters no longer protect resources.',
        roleResponsibility: 'Configure least privilege access controls, implement RBAC, and enforce session timeouts.',
        examTip: 'ISC2 questions treat least privilege as an absolute core concept. Never grant access beyond what is required for immediate business duty.',
        keyTerms: ['Zero Trust', 'Least Privilege', 'Role-Based Access Control', 'Phishing-Resistant MFA'],
      },
      {
        id: 'cc-cloud-shared-resp',
        domain: 4,
        domainName: 'Network Security',
        title: 'Cloud Shared Responsibility Matrix (IaaS, PaaS, SaaS)',
        sectionRef: 'Domain 4 § 4.3',
        category: 'SDLC & Cloud',
        summary: 'Clear delineation of security accountability between Cloud Service Provider (CSP) and cloud consumer across IaaS, PaaS, and SaaS deployment models.',
        whyAdded: 'Candidate misconceptions regarding CSP security responsibility cause catastrophic configuration errors.',
        roleResponsibility: 'Identify consumer responsibility for data classification, IAM, and client-side encryption across all cloud tiers.',
        examTip: 'In SaaS, the customer is STILL responsible for their data and access credentials! The CSP secures the infrastructure and underlying code.',
        keyTerms: ['IaaS vs PaaS vs SaaS', 'Shared Responsibility', 'Customer Data Ownership', 'Cloud Tenant Security'],
      },
      {
        id: 'cc-phishing-resistant-mfa',
        domain: 3,
        domainName: 'Access Controls Concepts',
        title: 'MFA Modernization & Phishing-Resistant Authenticators',
        sectionRef: 'Domain 3 § 3.4',
        category: 'Cybersecurity',
        summary: 'Transitioning from legacy SMS/voice OTPs (vulnerable to SIM swapping and reverse-proxy phishing) to FIDO2/WebAuthn and authenticator apps.',
        whyAdded: 'SMS-based MFA is actively defeated by credential harvest proxies and AitM (Adversary-in-the-Middle) toolkits.',
        roleResponsibility: 'Enforce hardware security keys or cryptographic token-based MFA for administrative accounts.',
        examTip: 'SMS is considered the weakest form of MFA due to SIM swapping and interception risks. Hardware tokens or cryptographic keys are gold standard.',
        keyTerms: ['FIDO2 / WebAuthn', 'Adversary-in-the-Middle (AitM)', 'SIM Swapping', 'Something You Have'],
      },
    ],
  },

  // 3. ISC2 CISSP
  cissp: {
    certCode: 'CISSP',
    certName: 'Certified Information Systems Security Professional',
    oldVersionLabel: '2021 Exam Blueprint',
    newVersionLabel: 'April 2024 Exam Outline',
    releaseYear: '2024',
    executiveSummary: 'Subtle but impactful re-weighting with Domain 1 (Security & Risk Management) and Domain 8 (Software Development Security) gaining weight, incorporating artificial intelligence attack vectors, quantum cryptography, sovereign cloud architectures, and deep supply chain security controls.',
    domainWeights: [
      { domain: 1, name: 'Security and Risk Management', vOld: 15, vNew: 16, delta: +1, impact: 'Expanded AI risk, cyber insurance & supply chain' },
      { domain: 2, name: 'Asset Security', vOld: 10, vNew: 10, delta: 0, impact: 'Data lifecycle & privacy governance refinement' },
      { domain: 3, name: 'Security Architecture and Engineering', vOld: 13, vNew: 13, delta: 0, impact: 'Quantum cryptography & Zero Trust architectures' },
      { domain: 4, name: 'Communication and Network Security', vOld: 13, vNew: 13, delta: 0, impact: 'SD-WAN, microsegmentation & cloud edge security' },
      { domain: 5, name: 'Identity and Access Management (IAM)', vOld: 13, vNew: 13, delta: 0, impact: 'Decentralized identity, federated OIDC & PAM' },
      { domain: 6, name: 'Security Assessment and Testing', vOld: 12, vNew: 12, delta: 0, impact: 'Automated vulnerability validation & breach simulation' },
      { domain: 7, name: 'Security Operations', vOld: 13, vNew: 13, delta: 0, impact: 'Automated incident containment & threat hunting' },
      { domain: 8, name: 'Software Development Security', vOld: 11, vNew: 12, delta: +1, impact: 'Software Bill of Materials (SBOM) & CI/CD pipeline' },
    ],
    features: [
      {
        id: 'cissp-ai-governance',
        domain: 1,
        domainName: 'Security and Risk Management',
        title: 'Artificial Intelligence Risk & Governance (NIST AI RMF)',
        sectionRef: 'Domain 1 § 1.3',
        category: 'AI / Analytics',
        summary: 'Applying executive risk management to generative AI, prompt injection vulnerabilities, training dataset poisoning, and model inversion.',
        whyAdded: 'AI adoption introduces novel systemic corporate risks that CISOs must govern under enterprise risk management frameworks.',
        roleResponsibility: 'Establish AI acceptable use policies, conduct model impact assessments, and verify human-in-the-loop auditability.',
        examTip: 'CISSP questions test managerial perspective: what is the FIRST action? Policy and risk assessment ALWAYS precede technical controls.',
        keyTerms: ['NIST AI RMF', 'Prompt Injection', 'Model Poisoning', 'Enterprise AI Policy', 'Algorithmic Transparency'],
      },
      {
        id: 'cissp-sbom',
        domain: 8,
        domainName: 'Software Development Security',
        title: 'Software Bill of Materials (SBOM) & Software Supply Chain',
        sectionRef: 'Domain 8 § 8.5',
        category: 'SDLC & Cloud',
        summary: 'Mandating machine-readable inventories (CycloneDX, SPDX) of all third-party and open-source libraries used within application codebases.',
        whyAdded: 'Attacks on upstream dependencies (like Log4j, SolarWinds, XZ Utils) bypass direct application boundaries.',
        roleResponsibility: 'Verify automated SBOM generation during CI/CD builds, set up SCA scanning, and enforce cryptographic signature verification.',
        examTip: 'SBOM provides transparency into nested dependencies so vulnerabilities can be traced within minutes of publication.',
        keyTerms: ['Software Bill of Materials (SBOM)', 'CycloneDX', 'SPDX', 'Software Supply Chain', 'SCA Scanning'],
      },
      {
        id: 'cissp-post-quantum',
        domain: 3,
        domainName: 'Security Architecture and Engineering',
        title: 'Post-Quantum Cryptography (PQC) & Crypto-Agility',
        sectionRef: 'Domain 3 § 3.9',
        category: 'Cybersecurity',
        summary: 'Preparing enterprise cryptographic architectures for NIST post-quantum standardization (ML-KEM, ML-DSA) and Harvest-Now-Decrypt-Later threats.',
        whyAdded: 'Nation-state actors harvest encrypted ciphertext today with the intention of decrypting it once quantum computers reach scale.',
        roleResponsibility: 'Implement cryptographic inventory, evaluate crypto-agility, and phase out deprecated public key algorithms (RSA 2048, ECC).',
        examTip: 'Symmetric encryption (AES-256) remains quantum-resistant; asymmetric algorithms (RSA, Diffie-Hellman, ECC) are vulnerable to Shor algorithm.',
        keyTerms: ['Post-Quantum Cryptography', 'Crypto-Agility', 'Harvest Now Decrypt Later', 'Shor Algorithm', 'NIST PQC Standards'],
      },
    ],
  },

  // 4. ISACA CISM
  cism: {
    certCode: 'CISM',
    certName: 'Certified Information Security Manager',
    oldVersionLabel: '15th Edition Blueprint',
    newVersionLabel: '16th Edition Blueprint (Current)',
    releaseYear: '2023',
    executiveSummary: 'Substantial upgrade aligning with modern CISO executive responsibilities: board-level risk appetite quantification, continuous compliance, multi-cloud risk governance, ransomware crisis management, and cyber insurance integration.',
    domainWeights: [
      { domain: 1, name: 'Information Security Governance', vOld: 24, vNew: 17, delta: -7, impact: 'Rebalanced to align with operational management' },
      { domain: 2, name: 'Information Risk Management', vOld: 30, vNew: 20, delta: -10, impact: 'Condensed to focus on risk quantification' },
      { domain: 3, name: 'Information Security Program', vOld: 27, vNew: 33, delta: +6, impact: 'MAJOR EXPANSION: Implementation, metrics & controls' },
      { domain: 4, name: 'Incident Management', vOld: 19, vNew: 30, delta: +11, impact: 'MASSIVE INCREASE: Real-time containment, forensics & resilience' },
    ],
    features: [
      {
        id: 'cism-board-quantification',
        domain: 1,
        domainName: 'Information Security Governance',
        title: 'Board-Level Risk Communication & Financial Quantification (FAIR)',
        sectionRef: 'Domain 1 § 1.4',
        category: 'Governance & Privacy',
        summary: 'Translating technical vulnerability scores (CVSS) into monetary annualized loss exposure (ALE) and Value-at-Risk using FAIR methodology for board presentations.',
        whyAdded: 'Boards of Directors demand financial risk context, not technical jargon. The CISO must justify security investments in financial terms.',
        roleResponsibility: 'Calculate Value at Risk, align cyber strategy with enterprise strategic goals, and define risk appetite statements.',
        examTip: 'The ultimate authority for approving information security policy and risk appetite is ALWAYS the Board of Directors or Senior Executive Steering Committee.',
        keyTerms: ['Risk Appetite', 'FAIR Methodology', 'Annualized Loss Expectancy', 'Board Reporting', 'Strategic Alignment'],
      },
      {
        id: 'cism-ransomware-crisis',
        domain: 4,
        domainName: 'Incident Management',
        title: 'Ransomware Crisis Playbooks & Regulatory Notification Deadlines',
        sectionRef: 'Domain 4 § 4.3',
        category: 'Resilience',
        summary: 'Comprehensive escalation playbooks covering executive decision trees, extortion communications, cyber insurance liaisons, and 72-hour regulatory reporting.',
        whyAdded: 'Ransomware is an existential business crisis, not merely an IT outage. Executive coordination across legal, PR, and operations is critical.',
        roleResponsibility: 'Lead the Incident Response Team, manage external breach counsel, coordinate forensics, and enforce chain of custody.',
        examTip: 'The FIRST step upon discovering an active ransomware outbreak is CONTAINMENT (isolating affected network segments) to prevent lateral spread.',
        keyTerms: ['Incident Containment', 'Crisis Management Team', 'Regulatory Breach Notification', 'Cyber Insurance', 'Chain of Custody'],
      },
    ],
  },

  // 5. CompTIA Security+ (SY0-701)
  'comptia-sec-plus': {
    certCode: 'SECURITY+',
    certName: 'CompTIA Security+',
    oldVersionLabel: 'SY0-601 Exam Outline',
    newVersionLabel: 'SY0-701 Exam Outline (Current)',
    releaseYear: '2023',
    executiveSummary: 'Focused on enterprise cyber automation, IoT/OT convergence, zero trust architectures, identity-first defense, and hybrid/cloud attack surface reduction.',
    domainWeights: [
      { domain: 1, name: 'General Security Concepts', vOld: 12, vNew: 12, delta: 0, impact: 'Core foundational models & Zero Trust' },
      { domain: 2, name: 'Threats, Vulnerabilities & Mitigations', vOld: 24, vNew: 22, delta: -2, impact: 'Modern threat actor tactics (AI phishing, BEC)' },
      { domain: 3, name: 'Security Architecture', vOld: 21, vNew: 18, delta: -3, impact: 'Cloud & hybrid infrastructure blueprints' },
      { domain: 4, name: 'Security Operations', vOld: 16, vNew: 28, delta: +12, impact: 'MASSIVE INCREASE: Monitoring, SOAR, patch management' },
      { domain: 5, name: 'Security Program Management & Oversight', vOld: 27, vNew: 20, delta: -7, impact: 'Governance, risk compliance & third-party auditing' },
    ],
    features: [
      {
        id: 'secplus-secops-expansion',
        domain: 4,
        domainName: 'Security Operations',
        title: 'Automated SecOps, SOAR & Log Aggregation',
        sectionRef: 'Domain 4 § 4.1',
        category: 'Cybersecurity',
        summary: 'Integration of Security Information and Event Management (SIEM) with SOAR playbooks, automated firewall blocklists, and endpoint quarantine.',
        whyAdded: 'Domain 4 grew from 16% to 28% of the exam, making real-time operational response the most tested skill in SY0-701.',
        roleResponsibility: 'Analyze alert telemetry, configure automated playbook actions, and manage vulnerability scan results.',
        examTip: 'SIEM provides visibility and correlation; SOAR provides orchestration and automated response.',
        keyTerms: ['SIEM', 'SOAR', 'Playbooks', 'API Webhooks', 'Endpoint Quarantine'],
      },
    ],
  },

  // 6. ISACA CRISC
  crisc: {
    certCode: 'CRISC',
    certName: 'Certified in Risk and Information Systems Control',
    oldVersionLabel: '6th Edition Blueprint',
    newVersionLabel: '7th Edition Blueprint (Current)',
    releaseYear: '2022',
    executiveSummary: 'Complete structural overhaul from legacy risk identification/assessment domains into 4 streamlined domains: Governance, IT Risk Assessment, Risk Response & Reporting, and Information Technology & Security.',
    domainWeights: [
      { domain: 1, name: 'Governance', vOld: 20, vNew: 26, delta: +6, impact: 'Organizational governance, risk profile & culture' },
      { domain: 2, name: 'IT Risk Assessment', vOld: 25, vNew: 20, delta: -5, impact: 'Data-driven assessment & threat identification' },
      { domain: 3, name: 'Risk Response and Reporting', vOld: 32, vNew: 32, delta: 0, impact: 'Residual risk, mitigation & executive KRIs' },
      { domain: 4, name: 'Information Technology and Security', vOld: 23, vNew: 22, delta: -1, impact: 'Security architecture, data protection & cloud' },
    ],
    features: [
      {
        id: 'crisc-kri-design',
        domain: 3,
        domainName: 'Risk Response and Reporting',
        title: 'Key Risk Indicators (KRIs) vs Key Performance Indicators (KPIs)',
        sectionRef: 'Domain 3 § 3.4',
        category: 'Governance & Privacy',
        summary: 'Designing forward-looking Key Risk Indicators that act as early warning signals before a risk appetite threshold is breached.',
        whyAdded: 'Organizations must manage risk proactively rather than reacting after losses occur.',
        roleResponsibility: 'Establish KRI triggers, define tolerance bands, and produce risk exception dashboards.',
        examTip: 'KPIs measure past performance (backward-looking); KRIs predict emerging risk exposures before loss events materialize (forward-looking).',
        keyTerms: ['Key Risk Indicators (KRIs)', 'Key Performance Indicators (KPIs)', 'Risk Tolerance', 'Trigger Thresholds'],
      },
    ],
  },

  // 7. CompTIA CySA+
  cysa: {
    certCode: 'CYSA+',
    certName: 'CompTIA Cybersecurity Analyst',
    oldVersionLabel: 'CS0-002 Blueprint',
    newVersionLabel: 'CS0-003 Blueprint (Current)',
    releaseYear: '2023',
    executiveSummary: 'Heightened focus on proactive threat hunting, MITRE ATT&CK framework mapping, cloud security posture management (CSPM), and automated vulnerability prioritization (EPSS).',
    domainWeights: [
      { domain: 1, name: 'Security Operations', vOld: 25, vNew: 33, delta: +8, impact: 'Heavy emphasis on SIEM, packet analysis & monitoring' },
      { domain: 2, name: 'Vulnerability Management', vOld: 22, vNew: 20, delta: -2, impact: 'Shift to Exploit Prediction Scoring System (EPSS)' },
      { domain: 3, name: 'Incident Response and Management', vOld: 20, vNew: 25, delta: +5, impact: 'Forensic artifacts, containment & playbooks' },
      { domain: 4, name: 'Reporting and Communication', vOld: 12, vNew: 22, delta: +10, impact: 'Stakeholder communication & KRI tracking' },
    ],
    features: [
      {
        id: 'cysa-mitre-threat-hunting',
        domain: 1,
        domainName: 'Security Operations',
        title: 'Hypothesis-Driven Threat Hunting & MITRE ATT&CK',
        sectionRef: 'Domain 1 § 1.3',
        category: 'Cybersecurity',
        summary: 'Conducting proactive threat hunts without relying on alerts, mapping adversary TTPs directly against the MITRE ATT&CK matrix.',
        whyAdded: 'Advanced persistent threats (APTs) live in environments without triggering standard signatures. Proactive hunting is essential.',
        roleResponsibility: 'Formulate hunting hypotheses, query centralized telemetry via KQL/SPL, and identify living-off-the-land binaries (LOLBins).',
        examTip: 'A threat hunt ALWAYS begins with a clear hypothesis based on threat intelligence or environmental anomalies, not random log scrolling.',
        keyTerms: ['Threat Hunting', 'MITRE ATT&CK', 'TTPs', 'LOLBins', 'Living off the Land'],
      },
    ],
  },

  // 8. AWS Certified Solutions Architect - Associate (SAA-C03)
  'aws-csaa': {
    certCode: 'SAA-C03',
    certName: 'AWS Certified Solutions Architect - Associate',
    oldVersionLabel: 'SAA-C02 Blueprint',
    newVersionLabel: 'SAA-C03 Blueprint (Current)',
    releaseYear: '2023',
    executiveSummary: 'Expanded coverage of serverless container architectures (ECS, EKS, Fargate), high-throughput data pipelines, hybrid cloud routing via Direct Connect, and cost-effective disaster recovery.',
    domainWeights: [
      { domain: 1, name: 'Design Secure Architectures', vOld: 30, vNew: 30, delta: 0, impact: 'IAM permission boundaries & KMS customer keys' },
      { domain: 2, name: 'Design Resilient Architectures', vOld: 26, vNew: 26, delta: 0, impact: 'Multi-AZ/multi-region active-active failover' },
      { domain: 3, name: 'Design High-Performing Architectures', vOld: 24, vNew: 24, delta: 0, impact: 'Elastic caching, CloudFront & EBS IOPS' },
      { domain: 4, name: 'Design Cost-Optimized Architectures', vOld: 20, vNew: 20, delta: 0, impact: 'S3 lifecycle tiers, Graviton compute & Savings Plans' },
    ],
    features: [
      {
        id: 'aws-s3-tiering',
        domain: 4,
        domainName: 'Design Cost-Optimized Architectures',
        title: 'Intelligent Tiering & Immutable S3 Object Lock',
        sectionRef: 'Domain 4 § 4.2',
        category: 'SDLC & Cloud',
        summary: 'Automating storage cost optimization using S3 Intelligent-Tiering and protecting critical archives using S3 Object Lock compliance mode.',
        whyAdded: 'Unoptimized cloud storage budgets spiral rapidly; ransomware targeting cloud buckets requires write-once compliance locks.',
        roleResponsibility: 'Configure S3 lifecycle rules, implement Object Lock in Compliance Mode, and establish cross-region replication.',
        examTip: 'Compliance Mode prevents EVERYONE (including the AWS root account) from deleting or altering an object until the retention period expires.',
        keyTerms: ['S3 Intelligent-Tiering', 'Object Lock Compliance Mode', 'WORM Storage', 'Lifecycle Policies'],
      },
    ],
  },

  // 9. CCSP (Certified Cloud Security Professional)
  ccsp: {
    certCode: 'CCSP',
    certName: 'Certified Cloud Security Professional',
    oldVersionLabel: '2019/2022 Blueprint',
    newVersionLabel: '2024/2025 Refreshed Blueprint',
    releaseYear: '2024',
    executiveSummary: 'Addresses sovereign cloud data localization, confidential computing (TEE/SGX), SecOps across heterogeneous multi-cloud environments, and container/Kubernetes orchestration security.',
    domainWeights: [
      { domain: 1, name: 'Cloud Concepts, Architecture & Design', vOld: 17, vNew: 17, delta: 0, impact: 'Confidential computing & cloud sovereignty' },
      { domain: 2, name: 'Cloud Data Security', vOld: 19, vNew: 20, delta: +1, impact: 'Data discovery, tokenization & DRM controls' },
      { domain: 3, name: 'Cloud Platform & Infrastructure Security', vOld: 17, vNew: 17, delta: 0, impact: 'Immutable infrastructure & container isolation' },
      { domain: 4, name: 'Cloud Application Security', vOld: 17, vNew: 17, delta: 0, impact: 'API security, OWASP Cloud Top 10 & microservices' },
      { domain: 5, name: 'Cloud Security Operations', vOld: 17, vNew: 16, delta: -1, impact: 'Cloud forensics & CSP SLA auditing' },
      { domain: 6, name: 'Legal, Risk & Compliance', vOld: 13, vNew: 13, delta: 0, impact: 'Transborder privacy regulations & audit artifacts' },
    ],
    features: [
      {
        id: 'ccsp-confidential-computing',
        domain: 1,
        domainName: 'Cloud Concepts, Architecture & Design',
        title: 'Confidential Computing & Trusted Execution Environments (TEEs)',
        sectionRef: 'Domain 1 § 1.4',
        category: 'Cybersecurity',
        summary: 'Protecting data in use by performing memory-level hardware encryption via secure enclaves (Intel SGX, AMD SEV) preventing cloud hypervisors from inspecting memory.',
        whyAdded: 'Cloud tenants handling classified or healthcare data demand mathematical certainty that host infrastructure operators cannot inspect data while in use.',
        roleResponsibility: 'Evaluate TEE capabilities of cloud provider instance types and verify memory encryption attestations.',
        examTip: 'Traditional encryption covers data at rest and data in transit. Confidential computing protects the third state: DATA IN USE.',
        keyTerms: ['Confidential Computing', 'Data in Use', 'Trusted Execution Environment (TEE)', 'Memory Encryption'],
      },
    ],
  },

  // 10. CGEIT
  cgeit: {
    certCode: 'CGEIT',
    certName: 'Certified in the Governance of Enterprise IT',
    oldVersionLabel: '7th Edition Blueprint',
    newVersionLabel: '8th Edition Blueprint',
    releaseYear: '2023',
    executiveSummary: 'Aligned with COBIT 2019 governance principles, digital transformation steering, IT portfolio return-on-investment (ROI), and ESG (Environmental, Social, Governance) sustainability metrics in IT operations.',
    domainWeights: [
      { domain: 1, name: 'Governance of Enterprise IT', vOld: 40, vNew: 40, delta: 0, impact: 'COBIT 2019 governance system design' },
      { domain: 2, name: 'IT Resources', vOld: 15, vNew: 15, delta: 0, impact: 'Human capital, sourcing strategy & vendor lock-in' },
      { domain: 3, name: 'Benefits Realization', vOld: 26, vNew: 26, delta: 0, impact: 'Value management, portfolio optimization & KPIs' },
      { domain: 4, name: 'Risk Optimization', vOld: 19, vNew: 19, delta: 0, impact: 'Enterprise risk alignment & compliance assurance' },
    ],
    features: [
      {
        id: 'cgeit-cobit2019-system',
        domain: 1,
        domainName: 'Governance of Enterprise IT',
        title: 'COBIT 2019 Tailored Governance System Design',
        sectionRef: 'Domain 1 § 1.2',
        category: 'Governance & Privacy',
        summary: 'Using COBIT design factors (enterprise strategy, threat landscape, role of IT, sourcing model) to customize a bespoke governance framework rather than adopting rigid defaults.',
        whyAdded: 'One-size-fits-all governance fails. COBIT 2019 emphasizes tailoring governance systems to unique organizational drivers.',
        roleResponsibility: 'Assess enterprise design factors and configure governance scorecards.',
        examTip: 'Governance ensures stakeholder needs are evaluated to determine balanced enterprise objectives; Management plans, builds, runs, and monitors activities in direction set by governance.',
        keyTerms: ['COBIT 2019', 'Design Factors', 'Governance vs Management', 'Benefits Realization'],
      },
    ],
  },

  // 11. CompTIA Network+
  'comptia-network-plus': {
    certCode: 'NETWORK+',
    certName: 'CompTIA Network+',
    oldVersionLabel: 'N10-008 Blueprint',
    newVersionLabel: 'N10-009 Blueprint (Current)',
    releaseYear: '2024',
    executiveSummary: 'Strengthened coverage of Software-Defined Networking (SDN), network automation, enterprise IPv6 rollout, zero trust microsegmentation, and high-speed multi-gigabit wireless (Wi-Fi 6E/7).',
    domainWeights: [
      { domain: 1, name: 'Networking Concepts', vOld: 23, vNew: 23, delta: 0, impact: 'Modern OSI transport, routing & protocols' },
      { domain: 2, name: 'Network Implementation', vOld: 19, vNew: 20, delta: +1, impact: 'SDN controllers, leaf-spine data centers' },
      { domain: 3, name: 'Network Operations', vOld: 16, vNew: 19, delta: +3, impact: 'Telemetry, automation & disaster recovery' },
      { domain: 4, name: 'Network Security', vOld: 19, vNew: 14, delta: -5, impact: 'Streamlined to focus on infrastructure hardening' },
      { domain: 5, name: 'Network Troubleshooting', vOld: 23, vNew: 24, delta: +1, impact: 'Real-world physical and logical diagnostic methodology' },
    ],
    features: [
      {
        id: 'netplus-sdn-leaf-spine',
        domain: 2,
        domainName: 'Network Implementation',
        title: 'Leaf-Spine Data Center Topology & SDN Control Planes',
        sectionRef: 'Domain 2 § 2.2',
        category: 'Infrastructure',
        summary: 'Replacing legacy three-tier network architectures (Core, Distribution, Access) with low-latency east-west leaf-spine fabric and central SDN controllers.',
        whyAdded: 'Cloud data center traffic is overwhelmingly east-west (server to server). Three-tier trees create bottlenecks.',
        roleResponsibility: 'Configure leaf-spine connectivity and monitor SDN plane separation (Data, Control, Management).',
        examTip: 'Every leaf switch connects to EVERY spine switch. Spines never connect to each other; leaves never connect directly to each other.',
        keyTerms: ['Leaf-Spine Fabric', 'Software-Defined Networking (SDN)', 'Control vs Data Plane', 'East-West Traffic'],
      },
    ],
  },

  // 12. CompTIA A+
  'comptia-a-plus': {
    certCode: 'A+',
    certName: 'CompTIA A+',
    oldVersionLabel: 'Core 1 & Core 2 (220-1001/1002)',
    newVersionLabel: 'Core 1 & Core 2 (220-1101/1102 Current)',
    releaseYear: '2023',
    executiveSummary: 'Substantial modern overhaul supporting remote and hybrid workforces: SaaS application diagnostics, Virtual Desktop Infrastructure (VDI), mobile device management (MDM), and active malware containment.',
    domainWeights: [
      { domain: 1, name: 'Mobile Devices', vOld: 14, vNew: 15, delta: +1, impact: 'Modern smartphone/tablet hardware & accessories' },
      { domain: 2, name: 'Networking', vOld: 20, vNew: 20, delta: 0, impact: 'Wi-Fi 6, mesh networks & SOHO configurations' },
      { domain: 3, name: 'Hardware', vOld: 27, vNew: 25, delta: -2, impact: 'PCIe 4.0/5.0, USB4/Thunderbolt 4, NVMe' },
      { domain: 4, name: 'Virtualization & Cloud Computing', vOld: 12, vNew: 11, delta: -1, impact: 'VDI client configuration & cloud service models' },
      { domain: 5, name: 'Hardware & Network Troubleshooting', vOld: 27, vNew: 29, delta: +2, impact: 'Root cause problem-solving methodology' },
    ],
    features: [
      {
        id: 'aplus-vdi-remote',
        domain: 4,
        domainName: 'Virtualization & Cloud Computing',
        title: 'Virtual Desktop Infrastructure (VDI) & Cloud Client Setup',
        sectionRef: 'Domain 4 § 4.2',
        category: 'Infrastructure',
        summary: 'Deploying thin-client and zero-client remote sessions accessing centralized virtual desktops in cloud/enterprise data centers.',
        whyAdded: 'Hybrid work mandates that sensitive corporate data stays in the cloud rather than on end-user physical hard drives.',
        roleResponsibility: 'Configure VDI clients, manage network bandwidth, and enforce local drive redirection restrictions.',
        examTip: 'A thin client requires minimal local processing and storage, offloading all compute workload to the virtual host server.',
        keyTerms: ['Virtual Desktop Infrastructure (VDI)', 'Thin Client', 'Zero Client', 'Cloud Desktop'],
      },
    ],
  },

  // 13. NIST GRC
  'nist-grc': {
    certCode: 'NIST',
    certName: 'NIST Governance, Risk & Compliance',
    oldVersionLabel: 'NIST CSF 1.1',
    newVersionLabel: 'NIST CSF 2.0 (February 2024)',
    releaseYear: '2024',
    executiveSummary: 'Historical release adding the brand new "GOVERN" (GV) function alongside Identify, Protect, Detect, Respond, and Recover, expanding scope to all organizational types and emphasizing supply chain risk management.',
    domainWeights: [
      { domain: 1, name: 'Govern (GV)', vOld: 0, vNew: 18, delta: +18, impact: 'NEW FUNCTION: Board oversight, strategy, policy & supply chain' },
      { domain: 2, name: 'Identify (ID)', vOld: 25, vNew: 18, delta: -7, impact: 'Asset management, risk assessment & improvement' },
      { domain: 3, name: 'Protect (PR)', vOld: 25, vNew: 18, delta: -7, impact: 'Identity, awareness, data security & platform hygiene' },
      { domain: 4, name: 'Detect (DE)', vOld: 16, vNew: 15, delta: -1, impact: 'Continuous monitoring & anomaly detection' },
      { domain: 5, name: 'Respond (RS)', vOld: 17, vNew: 15, delta: -2, impact: 'Incident mitigation, communications & analysis' },
      { domain: 6, name: 'Recover (RC)', vOld: 17, vNew: 16, delta: -1, impact: 'Restoration execution & post-incident improvements' },
    ],
    features: [
      {
        id: 'nist-govern-function',
        domain: 1,
        domainName: 'Govern (GV)',
        title: 'NIST CSF 2.0 "Govern" Function & Cyber Supply Chain',
        sectionRef: 'Govern (GV) § GV.SC',
        category: 'Governance & Privacy',
        summary: 'Establishment of the overarching 6th core function (Govern) providing the foundational umbrella under which Identify, Protect, Detect, Respond, and Recover operate.',
        whyAdded: 'Without executive governance and third-party supply chain oversight, operational security measures operate in a vacuum.',
        roleResponsibility: 'Establish cyber risk strategy, communicate risk priorities, and formalize C-SCRM supplier requirements.',
        examTip: 'NIST CSF 2.0 officially has SIX functions (Govern, Identify, Protect, Detect, Respond, Recover). Govern is the cross-cutting foundation!',
        keyTerms: ['NIST CSF 2.0', 'Govern (GV)', 'Cyber Supply Chain Risk Management (C-SCRM)', 'Organizational Context'],
      },
    ],
  },

  // 14. GIAC GSLC
  gslc: {
    certCode: 'GSLC',
    certName: 'GIAC Security Leadership Certification',
    oldVersionLabel: 'Legacy Security Management',
    newVersionLabel: 'Executive Security Leadership & Strategic Risk',
    releaseYear: '2024',
    executiveSummary: 'Focused on high-level cyber leadership: executive incident communications, financial risk modeling, secure supply chain procurement, and cross-functional legal and regulatory compliance.',
    domainWeights: [
      { domain: 1, name: 'Security Architecture & Controls', vOld: 25, vNew: 25, delta: 0, impact: 'Zero trust & defense-in-depth frameworks' },
      { domain: 2, name: 'Risk Management & Governance', vOld: 25, vNew: 25, delta: 0, impact: 'Quantitative risk & cyber insurance integration' },
      { domain: 3, name: 'Operations & Incident Response', vOld: 25, vNew: 25, delta: 0, impact: 'Crisis leadership & regulatory reporting' },
      { domain: 4, name: 'Leadership & People Management', vOld: 25, vNew: 25, delta: 0, impact: 'Security culture, talent retention & budget defense' },
    ],
    features: [
      {
        id: 'gslc-crisis-leadership',
        domain: 3,
        domainName: 'Operations & Incident Response',
        title: 'Executive Incident Leadership & Regulatory Crisis Coordination',
        sectionRef: 'Domain 3 § 3.2',
        category: 'Governance & Privacy',
        summary: 'Leading technical teams, executive committees, board members, and external crisis counsel through severe cyber extortion and ransomware incidents.',
        whyAdded: 'Technical recovery is only half the battle; senior security leaders must preserve company reputation, legal privilege, and financial viability.',
        roleResponsibility: 'Direct crisis cadence, protect attorney-client privilege during forensics, and brief C-suite and Board members.',
        examTip: 'To protect forensic reports under attorney-client privilege, external forensic investigators should be retained directly by outside legal counsel, not IT.',
        keyTerms: ['Crisis Leadership', 'Attorney-Client Privilege', 'Board Briefing', 'Extortion Response'],
      },
    ],
  },

  // 15. FIFA Football Agent
  'fifa-agent': {
    certCode: 'FIFA-AGENT',
    certName: 'FIFA Licensed Football Agent Examination',
    oldVersionLabel: 'FFAR 2023 Implementation',
    newVersionLabel: 'FIFA Football Agent Regulations (FFAR) & CAS Jurisprudence',
    releaseYear: '2024',
    executiveSummary: 'Full integration of Court of Arbitration for Sport (CAS) rulings on service fee caps, dual representation strict prohibitions, minors safeguarding requirements, and mandatory FIFA Clearing House financial routing.',
    domainWeights: [
      { domain: 1, name: 'FIFA Football Agent Regulations (FFAR)', vOld: 40, vNew: 40, delta: 0, impact: 'Licensing, representation agreements & fee caps' },
      { domain: 2, name: 'Regulations on the Status and Transfer of Players (RSTP)', vOld: 30, vNew: 30, delta: 0, impact: 'Contract stability, training compensation & solidarity' },
      { domain: 3, name: 'FIFA Clearing House & Financial Regulations', vOld: 10, vNew: 10, delta: 0, impact: 'Payment processing & anti-money laundering compliance' },
      { domain: 4, name: 'Disciplinary & Ethics Codes', vOld: 10, vNew: 10, delta: 0, impact: 'Integrity, anti-bribery & betting prohibitions' },
      { domain: 5, name: 'Safeguarding Minors & Representation', vOld: 10, vNew: 10, delta: 0, impact: 'Guardian consent & representation restrictions' },
    ],
    features: [
      {
        id: 'fifa-dual-representation',
        domain: 1,
        domainName: 'FIFA Football Agent Regulations (FFAR)',
        title: 'Strict Prohibition on Multi-Representation & Permitted Dual Exception',
        sectionRef: 'FFAR Article 12',
        category: 'Regulatory & Legal',
        summary: 'Prohibiting agents from acting for more than one party in a single transaction, with the ONLY sole exception being simultaneous representation of the engaging club AND the player with prior written consent.',
        whyAdded: 'Eliminating conflicts of interest where agents represented releasing club, engaging club, and player simultaneously.',
        roleResponsibility: 'Obtain explicit written consent from both engaging club and player prior to negotiations, and register representation agreement in FIFA Clearing House.',
        examTip: 'An agent CAN NEVER represent the releasing (selling) club and ANY other party! The only permitted dual representation is Engaging Club + Player.',
        keyTerms: ['FFAR Article 12', 'Dual Representation Exception', 'Engaging Club + Player', 'Written Consent', 'Conflict of Interest'],
      },
    ],
  },
};

/**
 * Helper to fetch delta matrix for any certification by slug or code.
 */
export function getCertDeltaMatrix(certIdentifier: string): CertDeltaMatrix {
  const clean = certIdentifier.toLowerCase().trim();
  
  if (CERT_VERSION_DELTAS[clean]) return CERT_VERSION_DELTAS[clean];

  // Try alias matching
  const aliasMap: Record<string, string> = {
    'cisa': 'cisa',
    'cc': 'isc2-cc',
    'isc2-cc': 'isc2-cc',
    'cissp': 'cissp',
    'cism': 'cism',
    'secplus': 'comptia-sec-plus',
    'security+': 'comptia-sec-plus',
    'comptia-sec-plus': 'comptia-sec-plus',
    'crisc': 'crisc',
    'cysa': 'cysa',
    'cysa+': 'cysa',
    'aws': 'aws-csaa',
    'aws-csaa': 'aws-csaa',
    'saa-c03': 'aws-csaa',
    'ccsp': 'ccsp',
    'cgeit': 'cgeit',
    'netplus': 'comptia-network-plus',
    'network+': 'comptia-network-plus',
    'comptia-network-plus': 'comptia-network-plus',
    'a+': 'comptia-a-plus',
    'aplus': 'comptia-a-plus',
    'comptia-a-plus': 'comptia-a-plus',
    'nist': 'nist-grc',
    'nist-grc': 'nist-grc',
    'gslc': 'gslc',
    'giac-security-leadership': 'gslc',
    'fifa': 'fifa-agent',
    'fifa-agent': 'fifa-agent',
  };

  const matchedKey = aliasMap[clean];
  if (matchedKey && CERT_VERSION_DELTAS[matchedKey]) {
    return CERT_VERSION_DELTAS[matchedKey];
  }

  // Fallback to CISA if not found
  return CERT_VERSION_DELTAS['cisa'];
}
