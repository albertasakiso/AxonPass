import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let directUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
    break;
  }
}
if (!directUrl) {
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const CERT_IDS = {
  cisa: 'a0000000-0000-0000-0000-000000000001',
  'isc2-cc': 'a0000000-0000-0000-0000-000000000002',
  'aws-csaa': 'a0000000-0000-0000-0000-000000000003',
  'nist-grc': 'a0000000-0000-0000-0000-000000000004'
};

const OFFICIAL_MANUAL_CHAPTERS = [
  // =========================================================================
  // DOCUMENT 1: ISACA CISA Review Manual (28th & 27th Editions)
  // =========================================================================
  {
    certSlug: 'cisa',
    domainNum: 1,
    docTitle: 'ISACA CISA Review Manual',
    edition: '28th Edition (2024–2026)',
    chapterNumber: 1,
    sectionNumber: 'Ch. 1.0',
    title: 'Chapter 1: Information Systems Auditing Process',
    pageStart: 1,
    pageEnd: 110,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'Mandatory ITAF standards, Audit Charter governance, Audit Risk formula (AR = IR × CR × DR), Attribute vs Variable Sampling, CAATs, and Control Self-Assessment (CSA) dynamics.',
    examTips: 'The audit charter MUST be approved by the Audit Committee/Board. CSA primary risk: "Failure to act on improvement suggestions could damage employee morale." When Inherent/Control risk is high, auditor must reduce Detection risk by increasing sample size.',
    contentMarkdown: `# Chapter 1: Information Systems Auditing Process

The Information Systems (IS) audit function provides independent, objective assurance to executive management and the Board of Directors regarding the effectiveness of IT governance, risk management, and internal control structures.

---

## 1.1 Management of the IS Audit Function

### The IS Audit Charter
The **Audit Charter** is the foundational governance instrument that formally empowers the audit function. It must:
- Outline the **purpose, authority, and responsibility** of the IS audit activity.
- Be formally approved by the **Audit Committee or the Board of Directors**.
- Establish organizational independence: **Functional reporting** to the Board/Audit Committee and **Administrative reporting** to senior executive leadership (e.g., CEO).
- Guarantee **unrestricted access** to all organizational systems, personnel, records, physical facilities, and third-party vendor arrangements.

### ISACA ITAF Standards & Guidelines
ISACA's **Information Technology Assurance Framework (ITAF)** establishes a mandatory hierarchy for assurance practitioners:
1. **Standards (Mandatory)**: Mandatory professional requirements governing independence, due professional care, planning, evidence collection, and reporting format.
2. **Guidelines (Recommended)**: Actionable guidance on applying ISACA standards in complex technical environments.
3. **Tools & Techniques (Procedural)**: Concrete examples, scripts, audit programs, and templates.

---

## 1.2 Risk-Based Audit Planning

Audit resources must be deployed in proportion to the severity and likelihood of inherent enterprise risks.

### The Audit Risk Model
$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

- **Inherent Risk (IR)**: The susceptibility of an asset or business process to material error or fraud assuming no internal controls exist.
- **Control Risk (CR)**: The risk that internal controls fail to prevent or detect errors in a timely manner.
- **Detection Risk (DR)**: The risk that the auditor's testing and sampling procedures fail to detect a material error that is present. **This is the only component directly controlled by the auditor.**

> **Auditor Strategy Rule:** If an entity has high Inherent Risk and high Control Risk, the auditor MUST drive down Detection Risk by expanding substantive testing sample sizes and using automated Generalized Audit Software (GAS).

---

## 1.3 Control Self-Assessment (CSA) & Employee Engagement

**Control Self-Assessment (CSA)** is an audit methodology where business process owners and operational employees evaluate the effectiveness of their own internal controls through structured workshops and surveys.

### Advantages of CSA:
- Early identification of operational risks.
- Fosters a culture of **ownership and accountability** among frontline staff.
- Enhances communication between management, staff, and internal auditors.

### Disadvantages & Behavioral Risks of CSA:
- **Employee Morale Risk**: **Failure to act on improvement suggestions could damage employee morale.** If management solicits control gap feedback but fails to remediate the identified deficiencies, employees perceive the initiative as disingenuous, leading to cynicism and disengagement.
- **Audit Replacement Misconception**: Management may erroneously view CSA as an audit function replacement (CSA supplements, but never replaces, independent audits).

---

## 1.4 Audit Sampling & CAATs

### Sampling Types
- **Attribute Sampling (Compliance Testing)**: Tests whether a control operated (Yes/No outcome).
- **Variable Sampling (Substantive Testing)**: Measures continuous numerical or dollar values.
- **Stratified Sampling**: Segregates heterogeneous populations into homogeneous strata to optimize sample efficiency.

### Computer-Assisted Audit Techniques (CAATs)
- **Generalized Audit Software (GAS)**: Enables 100% population analysis, duplicate identification, and gap detection without sampling risk.
- **Embedded Audit Modules (EAM)**: Real-time audit code integrated directly into production applications to capture high-risk transactions instantly.`
  },
  {
    certSlug: 'cisa',
    domainNum: 2,
    docTitle: 'ISACA CISA Review Manual',
    edition: '28th Edition (2024–2026)',
    chapterNumber: 2,
    sectionNumber: 'Ch. 2.0',
    title: 'Chapter 2: Governance and Management of IT',
    pageStart: 111,
    pageEnd: 215,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'COBIT 2019 framework, IT Strategy Committee (Board) vs IT Steering Committee (Executive), Quantitative Risk Analysis (SLE = AV × EF, ALE = SLE × ARO), Segregation of Duties (SoD), and Third-Party Vendor Management.',
    examTips: 'Strategy Committee is at the Board level. Steering Committee is at the Management level. Sourcing escrow agreements protect the buyer if the software vendor goes bankrupt.',
    contentMarkdown: `# Chapter 2: Governance and Management of IT

IT Governance ensures that enterprise IT sustains and extends organizational strategies and objectives while optimizing risk and resource usage.

---

## 2.1 Corporate & IT Governance Structures

### IT Strategy Committee vs. IT Steering Committee
Effective governance demands a strict separation between strategic board oversight and management execution:

| Characteristic | IT Strategy Committee | IT Steering Committee |
| :--- | :--- | :--- |
| **Organizational Level** | **Board of Directors Level** | **Executive / Management Level** |
| **Composition** | Board members and specialized advisors | CIO, CFO, Business Unit Heads, IT Directors |
| **Mandate** | Advises the Board on alignment, risk appetite, ROI | Approves project roadmaps, budgets, resource allocation |
| **Focus** | Strategic direction and long-term value delivery | Operational project milestones and issue resolution |

---

## 2.2 COBIT 2019 Governance Framework

COBIT 2019 clearly distinguishes between Governance and Management:
- **Governance Domain**: **EDM (Evaluate, Direct, and Monitor)** — Evaluates stakeholder needs, directs strategy, and monitors performance.
- **Management Domains**:
  - **APO (Align, Plan, and Organize)**: Strategy, architecture, portfolio, and supplier management.
  - **BAI (Build, Acquire, and Implement)**: Program management, solution design, and change enablement.
  - **DSS (Deliver, Service, and Support)**: IT operations, service requests, security incidents, and business continuity.
  - **MEA (Monitor, Evaluate, and Assess)**: Performance tracking, internal controls compliance, and assurance reporting.

---

## 2.3 Quantitative Risk Assessment Formulas

Quantitative risk analysis provides financial metrics for cost-benefit evaluations:

$$\\text{Single Loss Expectancy (SLE)} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$

$$\\text{Annualized Loss Expectancy (ALE)} = \\text{Single Loss Expectancy (SLE)} \\times \\text{Annualized Rate of Occurrence (ARO)}$$

### Cost-Benefit Analysis (CBA)
$$\\text{Net Annual Benefit} = (\\text{ALE}_{\\text{current}} - \\text{ALE}_{\\text{modified}}) - \\text{Annual Cost of Safeguard (ACS)}$$

> **Rule:** An organization should never spend more on a security control than the financial reduction in ALE it delivers.`
  },
  {
    certSlug: 'cisa',
    domainNum: 3,
    docTitle: 'ISACA CISA Review Manual',
    edition: '28th Edition (2024–2026)',
    chapterNumber: 3,
    sectionNumber: 'Ch. 3.0',
    title: 'Chapter 3: Information Systems Acquisition, Development & Implementation',
    pageStart: 216,
    pageEnd: 320,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'SDLC phases, Agile/Scrum and DevSecOps controls, Software Escrow, Testing Hierarchy (Unit, Integration, System, UAT, Regression), Cutover strategies (Parallel, Phased, Pilot, Direct), and Post-Implementation Review (PIR).',
    examTips: 'Production data must NEVER be used in test environments without masking. Parallel cutover is the safest (highest cost). Direct cutover is the riskiest. PIR is performed 3–6 months after stabilization.',
    contentMarkdown: `# Chapter 3: IS Acquisition, Development & Implementation

The acquisition, development, and deployment of software systems must be governed by rigorous controls to ensure functionality, security, and investment value.

---

## 3.1 SDLC Phases & Quality Gates

The **System Development Life Cycle (SDLC)** establishes structured governance across distinct phases:
1. **Feasibility Study**: Financial (ROI/NPV), technical, and operational viability analysis.
2. **Requirements Definition**: Elicitation and formal sign-off of functional, non-functional, and security specifications.
3. **System Design**: Architectural blueprints, database schemas, and input/output validation controls.
4. **Development & Coding**: Secure programming, peer code reviews, and automated SAST/DAST.
5. **Testing**: Unit, integration, system, regression, and User Acceptance Testing (UAT).
6. **Implementation / Cutover**: Data migration, user training, and cutover execution.
7. **Post-Implementation Review (PIR)**: Assessment of benefits realization and system performance.

---

## 3.2 Cutover Strategies Comparison

| Strategy | Risk Level | Operating Cost | Key Characteristics |
| :--- | :--- | :--- | :--- |
| **Parallel Cutover** | **Lowest** | **Highest** | Both old and new systems run simultaneously; outputs are compared |
| **Phased Cutover** | Moderate | Moderate | System is deployed module-by-module or by department |
| **Pilot Cutover** | Low-Moderate | Moderate | Deployed at a single branch or location prior to enterprise rollout |
| **Direct (Plunge)**| **Highest** | **Lowest** | Instantaneous shutdown of old system; no fallback mechanism |

---

## 3.3 Test Data Confidentiality & Software Escrow
- **Sanitization of Test Data**: Copying unmasked production databases to staging or development environments violates privacy laws (GDPR, HIPAA). All PII and credentials must be masked or synthesized.
- **Software Escrow Agreements**: Essential when acquiring commercial-off-the-shelf (COTS) proprietary software. Third-party escrow agents hold source code to release to the customer if the vendor goes bankrupt.`
  },
  {
    certSlug: 'cisa',
    domainNum: 4,
    docTitle: 'ISACA CISA Review Manual',
    edition: '28th Edition (2024–2026)',
    chapterNumber: 4,
    sectionNumber: 'Ch. 4.0',
    title: 'Chapter 4: Information Systems Operations and Business Resilience',
    pageStart: 321,
    pageEnd: 435,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'ITSM (Incident vs Problem vs Change Management), Data Center HVAC & Environmental controls (Positive pressure, UPS, Clean-Agent Fire Suppression FM-200/Novec 1230), BIA (RTO, RPO, SDO, MTPD), and Disaster Recovery Site testing.',
    examTips: 'Incident Management restores service fast. Problem Management identifies root cause. RTO is maximum tolerable downtime. RPO is maximum tolerable data loss in time. Full interruption test is the most realistic but highest risk.',
    contentMarkdown: `# Chapter 4: IS Operations and Business Resilience

Operational excellence ensures ongoing system availability, data integrity, and rapid disaster recovery.

---

## 4.1 IT Service Management (ITSM) Operations

- **Incident Management**: Primary objective is the **rapid restoration of normal service operation** with minimal business disruption, frequently using temporary workarounds.
- **Problem Management**: Focuses on **Root Cause Analysis (RCA)** of recurring incidents to formulate permanent remediations.
- **Change Advisory Board (CAB)**: Multidisciplinary team reviewing production change requests, rollback plans, and scheduling to avoid operational conflicts.

---

## 4.2 Data Center Environmental & Physical Controls

- **HVAC Systems**: Must maintain positive air pressure in server rooms to prevent external dust contamination.
- **Power Continuity**: Uninterruptible Power Supply (UPS) battery banks provide immediate bridge power for 15–30 minutes until diesel generators synchronize and take full load.
- **Fire Suppression**:
  - **Clean Agent Gases (FM-200, Novec 1230)**: Extinguishes fire without leaving residue or damaging active electronics.
  - **Pre-Action Dry-Pipe Sprinklers**: Pipes remain dry until smoke detectors trip the valve, preventing accidental water leaks over servers.

---

## 4.3 Business Impact Analysis (BIA) & Resilience Metrics

$$\\text{RTO} = \\text{Maximum Tolerable Downtime (Hours/Days)}$$
$$\\text{RPO} = \\text{Maximum Tolerable Data Loss (Time Window of Transactions)}$$

### Disaster Recovery Alternate Sites:
- **Hot Site**: Fully equipped with identical hardware, telecommunications, and real-time data replication (operational in minutes).
- **Warm Site**: Equipped with hardware and network; recent data must be restored from backup (operational in hours/days).
- **Cold Site**: Basic physical shell with power and HVAC; hardware must be procured and configured (operational in weeks).`
  },
  {
    certSlug: 'cisa',
    domainNum: 5,
    docTitle: 'ISACA CISA Review Manual',
    edition: '28th Edition (2024–2026)',
    chapterNumber: 5,
    sectionNumber: 'Ch. 5.0',
    title: 'Chapter 5: Protection of Information Assets',
    pageStart: 436,
    pageEnd: 560,
    estimatedReadMinutes: 50,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'Identity & Access Management, Biometric Error Rates (FAR, FRR, CER/EER), Cryptography (AES, RSA, Digital Signatures, PKI, CA, OCSP), Network Firewalls (Stateful, NGFW, WAF, IPS), and Digital Forensics (Order of Volatility RFC 3227, Write Blockers, Bit-Stream Imaging).',
    examTips: 'FAR is Type II (security flaw). FRR is Type I (frustration). CER is where FAR = FRR (lower is better). Digital signatures provide Integrity + Non-repudiation. Digital forensics: CPU/RAM first, hard drive later.',
    contentMarkdown: `# Chapter 5: Protection of Information Assets

Securing information assets requires defense-in-depth spanning logical access, cryptography, network perimeters, and forensic readiness.

---

## 5.1 Identity & Access Management & Biometrics

### Multi-Factor Authentication (MFA)
Requires 2 or more distinct factors:
1. **Something You Know**: Password, PIN, passphrase.
2. **Something You Have**: Smart card, hardware token (YubiKey), mobile OTP.
3. **Something You Are**: Biometric fingerprint, iris scan, facial recognition.

### Biometric Error Rates
- **False Acceptance Rate (FAR / Type II Error)**: Probability that an impostor is incorrectly accepted (**critical security risk**).
- **False Rejection Rate (FRR / Type I Error)**: Probability that an authorized user is incorrectly rejected (**user inconvenience**).
- **Crossover Error Rate (CER / EER)**: The point where $\\text{FAR} = \\text{FRR}$. The standard benchmark for comparing biometric devices (a lower CER indicates a superior device).

---

## 5.2 Cryptographic Architecture & PKI

- **Symmetric Encryption (AES-256)**: Single shared secret key; fast, optimized for bulk data at rest.
- **Asymmetric Encryption (RSA, ECC)**: Public/private key pair; used for digital signatures and secure key exchange.
- **Digital Signatures**: The sender hashes the document and encrypts the hash with their **Private Key**. The recipient decrypts using the sender's **Public Key** to verify **Integrity, Authenticity, and Non-Repudiation**.
- **Certificate Revocation**: Online Certificate Status Protocol (OCSP) queries revocation status in real time, overcoming the time lag inherent in Certificate Revocation Lists (CRLs).

---

## 5.3 Digital Forensics & Chain of Custody

### Order of Volatility (RFC 3227)
Evidence must be captured starting with the most perishable state:
1. **CPU registers and cache**
2. **System memory (RAM), ARP cache, process tables**
3. **Temporary file systems and swap space**
4. **Hard disks and solid-state storage**
5. **Remote network logging and SIEM records**
6. **Archival backup media**

> **Forensic Rule:** Always attach a hardware **Write Blocker** to source media and perform an exact **Bit-Stream Disk Image** with cryptographic SHA-256 hash verification before analyzing evidence.`
  },

  // =========================================================================
  // DOCUMENT 2: ISC2 Certified in Cybersecurity Official Study Guide
  // =========================================================================
  {
    certSlug: 'isc2-cc',
    domainNum: 1,
    docTitle: 'ISC2 Certified in Cybersecurity (CC) Official Guide',
    edition: 'Official 1st Edition',
    chapterNumber: 1,
    sectionNumber: 'Module 1',
    title: 'Chapter 1: Security Principles & The CIA Triad',
    pageStart: 1,
    pageEnd: 45,
    estimatedReadMinutes: 30,
    fileRef: 'Chapter - 1.pdf',
    keyTakeaways: 'Confidentiality, Integrity, Availability, Non-repudiation, Authentication, Authorization, Risk formulas, and the 4 ISC2 Canons in strict priority order.',
    examTips: 'The 4 ISC2 Canons must be followed in strict order: 1. Protect society/public trust. 2. Act honorably/legally. 3. Provide competent service. 4. Advance the profession.',
    contentMarkdown: `# Chapter 1: Security Principles & The CIA Triad

The foundation of information security rests on balancing Confidentiality, Integrity, and Availability while upholding strict professional ethics.

---

## 1.1 The CIA Triad
- **Confidentiality**: Preventing unauthorized disclosure of sensitive data through AES encryption, classification labels, and strict Access Control Lists.
- **Integrity**: Protecting data accuracy and preventing unauthorized alterations using SHA-256 cryptographic hashes and digital signatures.
- **Availability**: Ensuring timely, dependable access for authorized users through load balancers, RAID arrays, redundant power supplies, and automated failover.

---

## 1.2 ISC2 Code of Ethics Canons
Certified professionals must adhere to four mandatory Canons in exact order of precedence:
1. **Protect society, the common good, necessary public trust and confidence, and the infrastructure.**
2. **Act honorably, honestly, justly, responsibly, and legally.**
3. **Provide diligent and competent service to principals.**
4. **Advance and protect the profession.**`
  },

  // =========================================================================
  // DOCUMENT 3: AWS Well-Architected Framework & Solutions Architect Guide
  // =========================================================================
  {
    certSlug: 'aws-csaa',
    domainNum: 1,
    docTitle: 'AWS Well-Architected Framework & Solutions Architect Guide',
    edition: 'SAA-C03 Official Edition',
    chapterNumber: 1,
    sectionNumber: 'Module 1',
    title: 'Chapter 1: The 6 Pillars of AWS Architecture & Security',
    pageStart: 1,
    pageEnd: 60,
    estimatedReadMinutes: 35,
    fileRef: 'AWS Well-Architected Framework.pdf',
    keyTakeaways: 'Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability; Stateful Security Groups vs Stateless NACLs; KMS Envelope Encryption.',
    examTips: 'Security Groups are STATEFUL at instance level. NACLs are STATELESS at subnet level. SQS decouples systems to absorb traffic spikes.',
    contentMarkdown: `# Chapter 1: The 6 Pillars of AWS Architecture

The AWS Well-Architected Framework helps cloud architects build secure, high-performing, resilient, and efficient infrastructure.

---

## The 6 Pillars
1. **Operational Excellence**: Running and monitoring systems to deliver business value and continually improve supporting processes.
2. **Security**: Protecting data, systems, and assets through IAM least privilege, AWS KMS encryption, and multi-layer VPC perimeters.
3. **Reliability**: Recovering from infrastructure or service disruptions, dynamically acquiring computing resources to meet demand (Auto Scaling & Multi-AZ).
4. **Performance Efficiency**: Using computing resources efficiently to meet system requirements (ElastiCache, CloudFront, Aurora).
5. **Cost Optimization**: Eliminating unneeded expense (S3 Intelligent-Tiering, Reserved Instances, Spot Instances).
6. **Sustainability**: Minimizing the environmental impacts of running cloud workloads.`
  },

  // =========================================================================
  // DOCUMENT 4: NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)
  // =========================================================================
  {
    certSlug: 'nist-grc',
    domainNum: 1,
    docTitle: 'NIST AI Risk Management Framework (NIST AI 100-1)',
    edition: 'Version 1.0 Official',
    chapterNumber: 1,
    sectionNumber: 'Core 1.0',
    title: 'Chapter 1: Trustworthy AI & Governance Framework',
    pageStart: 1,
    pageEnd: 50,
    estimatedReadMinutes: 30,
    fileRef: 'NIST.AI.100-1.pdf',
    keyTakeaways: '7 Trustworthy AI characteristics, GOVERN, MAP, MEASURE, MANAGE core functions, Human-in-the-Loop oversight, and algorithmic bias auditing.',
    examTips: 'NIST AI RMF Core Functions: GOVERN (culture & accountability), MAP (context & scope), MEASURE (testing & metrics), MANAGE (treatment & fail-safes).',
    contentMarkdown: `# Chapter 1: NIST AI Risk Management Framework (AI RMF 1.0)

The NIST AI RMF provides guidelines to manage risks and promote the development of trustworthy and responsible Artificial Intelligence systems.

---

## 1. The 4 AI RMF Core Functions
- **GOVERN**: Cultivates a culture of risk management, assigns roles, and enforces accountability and compliance across the AI lifecycle.
- **MAP**: Identifies the context of use, data provenance, stakeholder expectations, and potential societal impacts.
- **MEASURE**: Employs quantitative testing, red teaming, bias auditing, and performance benchmarks to evaluate risk.
- **MANAGE**: Allocates resources to treat risks, implements Human-in-the-Loop (HITL) fail-safes, and oversees model decommissioning.`
  }
];

async function digestAllManualChapters() {
  try {
    await client.connect();
    console.log('=== INGESTING FULL OFFICIAL DOCUMENT LIBRARY & MANUAL CHAPTERS ===\n');

    // 1. Fetch domain mappings
    const domRes = await client.query('SELECT d.id, d.domain_number, c.slug FROM domains d JOIN certifications c ON d.certification_id = c.id');
    const domainMap = {};
    domRes.rows.forEach(r => {
      domainMap[`${r.slug}_${r.domain_number}`] = r.id;
    });

    // 2. Ingest study_materials records
    for (const ch of OFFICIAL_MANUAL_CHAPTERS) {
      const certId = CERT_IDS[ch.certSlug];
      const domainId = domainMap[`${ch.certSlug}_${ch.domainNum}`];

      if (!certId || !domainId) {
        console.warn(`Skipping chapter: cert or domain not found for ${ch.certSlug} D${ch.domainNum}`);
        continue;
      }

      const res = await client.query(`
        INSERT INTO study_materials (
          certification_id,
          domain_id,
          title,
          content_type,
          content_body,
          document_title,
          edition,
          chapter_number,
          section_number,
          page_start,
          page_end,
          estimated_read_minutes,
          file_reference,
          key_takeaways,
          exam_tips,
          sort_order
        )
        VALUES ($1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id
      `, [
        certId,
        domainId,
        ch.title,
        ch.contentMarkdown,
        ch.docTitle,
        ch.edition,
        ch.chapterNumber,
        ch.sectionNumber,
        ch.pageStart,
        ch.pageEnd,
        ch.estimatedReadMinutes,
        ch.fileRef,
        ch.keyTakeaways,
        ch.examTips,
        ch.chapterNumber
      ]);

      console.log(`✓ [${ch.certSlug.toUpperCase()}] Ingested ${ch.title} (ID: ${res.rows[0].id})`);
    }

    const countRes = await client.query('SELECT count(*) FROM study_materials');
    console.log('\n=============================================');
    console.log(`Full Manual Digestion Complete!`);
    console.log(`Total Official Manual Chapters in DB: ${countRes.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during manual chapters digestion:', err);
  } finally {
    await client.end();
  }
}

digestAllManualChapters();
