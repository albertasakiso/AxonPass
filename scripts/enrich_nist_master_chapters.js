import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
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

const NIST_CERT_ID = 'a0000000-0000-0000-0000-000000000004';

const ENRICHED_CHAPTERS = [
  {
    chapter_number: 1,
    title: 'Chapter 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)',
    content_body: `# Chapter 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)

Welcome to **Domain 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)**, representing **25% of the examination**. The NIST CSF 2.0 provides guidance to industry, government agencies, and organizations worldwide to manage and reduce cybersecurity risks.

---

## 1.1 The 6 Core Functions of NIST CSF 2.0

NIST CSF 2.0 expanded upon the original 5 functions by introducing **GOVERN (GV)** as a dedicated foundational pillar.

\`\`\`
                              ┌───────────────────────────────┐
                              │          GOVERN (GV)          │ ◄── Strategy, Oversight & Supply Chain
                              └───────────────┬───────────────┘
                                              │
             ┌────────────────────────────────┼────────────────────────────────┐
             │                                │                                │
             ▼                                ▼                                ▼
┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│       IDENTIFY (ID)       │   │        PROTECT (PR)       │   │        DETECT (DE)        │
│ • Asset Management        │   │ • Identity Management     │   │ • Continuous Monitoring   │
│ • Risk Assessment         │   │ • Data Security           │   │ • Adverse Event Detection │
│ • Improvement             │   │ • Platform Security       │   │ • Anomaly Analysis        │
└───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
             │                                │                                │
             └────────────────────────────────┼────────────────────────────────┘
                                              │
             ┌────────────────────────────────┴────────────────────────────────┐
             │                                                                 │
             ▼                                                                 ▼
┌───────────────────────────┐                                   ┌───────────────────────────┐
│        RESPOND (RS)       │                                   │        RECOVER (RC)       │
│ • Incident Management     │                                   │ • Incident Recovery Plan  │
│ • Incident Analysis       │                                   │ • Recovery Communication  │
│ • Incident Mitigation     │                                   │ • Resilience Updates      │
└───────────────────────────┘                                   └───────────────────────────┘
\`\`\`

### 1. The 6 Core Functions Defined:
1. **Govern (GV)**: Establishes and monitors the organization's cybersecurity risk management strategy, expectations, and policy.
2. **Identify (ID)**: Understands the organization's cybersecurity risks to systems, people, assets, data, and capabilities.
3. **Protect (PR)**: Deploys safeguards to manage cybersecurity risks and protect critical infrastructure.
4. **Detect (DE)**: Discovers and analyzes cybersecurity events and potential compromises in real time.
5. **Respond (RS)**: Takes action regarding a detected cybersecurity incident to contain operational impact.
6. **Recover (RC)**: Restores capabilities or services impaired due to a cybersecurity incident.

---

## 1.2 CSF Implementation Tiers

Implementation Tiers characterize the rigor, sophistication, and integration of an organization's risk management practices:

| Implementation Tier | Characteristics | Approach to Risk |
| :--- | :--- | :--- |
| **Tier 1: Partial** | Informal, reactive, and ad-hoc risk management. Minimal organizational awareness. | Reactive / Siloed |
| **Tier 2: Risk-Informed** | Risk management practices are approved by management, but not standardized enterprise-wide. | Informal awareness |
| **Tier 3: Repeatable** | Formal, organization-wide cybersecurity risk management policies consistently executed and updated. | Standardized & Formal |
| **Tier 4: Adaptive** | Continuous improvement, predictive threat modeling, and rapid automated adaptation to emerging threats. | Proactive & Predictive |

> [!IMPORTANT]
> **💡 NIST / Exam Watch Alert**:
> - **Tiers do not represent maturity levels in a CMM sense**. Organizations should choose a Target Tier that matches their specific risk profile, regulatory mandates, and available budget.

---

## 1.3 Organizational Profiles and Gap Analysis
- **Current Profile**: Captures cybersecurity outcomes the organization currently achieves.
- **Target Profile**: Identifies desired cybersecurity outcomes needed to satisfy risk objectives.
- **Gap Analysis**: The prioritized action plan and roadmap closing the delta between Current and Target states.
`
  },
  {
    chapter_number: 2,
    title: 'Chapter 2: NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)',
    content_body: `# Chapter 2: NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)

Welcome to **Domain 2: NIST Risk Management Framework (RMF 2.0)**, representing **25% of the examination**. RMF 2.0 provides a structured, disciplined process that integrates security, privacy, and supply chain risk management into the system development life cycle (SDLC).

---

## 2.1 The 7 Steps of NIST RMF 2.0

\`\`\`
                              ┌───────────────────────────────┐
                              │       STEP 0: PREPARE         │ ◄── Context & Organization Governance
                              └───────────────┬───────────────┘
                                              │
  ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
  │                                           │                                           │
  ▼                                           ▼                                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│     STEP 1: CATEGORIZE    │   │      STEP 2: SELECT       │   │     STEP 3: IMPLEMENT     │
│ (FIPS 199 / FIPS 200)     │──►│ (SP 800-53 Rev. 5 Controls│──►│ (Deploy controls &        │
│ High-Water Mark (L, M, H) │   │ & Tailoring Overlays)     │   │  document in SSP)         │
└───────────────────────────┘   └───────────────────────────┘   └─────────────┬─────────────┘
                                                                              │
  ┌───────────────────────────────────────────────────────────────────────────┘
  │
  ▼                                           ▼                                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│      STEP 4: ASSESS       │   │     STEP 5: AUTHORIZE     │   │      STEP 6: MONITOR      │
│ (SP 800-53A Testing &     │──►│ (Authorizing Official AO  │──►│ (ISCM, continuous testing │
│  Security Assessment Rep) │   │  issues formal ATO/POA&M) │   │  & ongoing authorization) │
└───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
\`\`\`

1. **Step 0: Prepare**: Essential organizational and system-level activities to establish governance and context.
2. **Step 1: Categorize**: Security categorization using **FIPS 199 and FIPS 200** based on impact analysis.
3. **Step 2: Select**: Baseline selection and tailoring from **NIST SP 800-53 Rev. 5**.
4. **Step 3: Implement**: Deploying controls and documenting parameters in the **System Security Plan (SSP)**.
5. **Step 4: Assess**: Validating control effectiveness using **NIST SP 800-53A**.
6. **Step 5: Authorize**: Authorizing Official (AO) evaluates residual risk to issue an **Authorization to Operate (ATO)**.
7. **Step 6: Monitor**: Information Security Continuous Monitoring (**NIST SP 800-137**).

---

## 2.2 FIPS 199 Security Categorization & High-Water Mark Rule

Impact levels are evaluated across Confidentiality, Integrity, and Availability:
- **Low**: Limited adverse effect.
- **Moderate**: Serious adverse effect.
- **High**: Severe or catastrophic adverse effect.

$$\\text{High-Water Mark Rule}: \\text{Overall System Rating} = \\max(\\text{Impact}_C, \\text{Impact}_I, \\text{Impact}_A)$$

> [!IMPORTANT]
> **💡 NIST / Exam Watch Alert**:
> - Only the **Authorizing Official (AO)** has the legal authority to grant an **Authorization to Operate (ATO)**. The ISSO or CISO cannot authorize a system into production.
`
  },
  {
    chapter_number: 3,
    title: 'Chapter 3: NIST SP 800-53 Rev. 5 & SP 800-171 / CMMC 2.0',
    content_body: `# Chapter 3: NIST SP 800-53 Rev. 5 & SP 800-171 / CMMC 2.0

Welcome to **Domain 3: Controls Catalogs and Defense Contractor Standards**, representing **20% of the examination**.

---

## 3.1 NIST SP 800-53 Rev. 5 Control Families

NIST SP 800-53 Rev. 5 provides a catalog of security and privacy controls organized into **20 control families**:
- **AC**: Access Control
- **AT**: Awareness and Training
- **AU**: Audit and Accountability
- **CA**: Assessment, Authorization, and Monitoring
- **CM**: Configuration Management
- **CP**: Contingency Planning
- **IA**: Identification and Authentication
- **IR**: Incident Response
- **MA**: Maintenance
- **MP**: Media Protection
- **PE**: Physical and Environmental Protection
- **PL**: Planning
- **PM**: Program Management
- **PS**: Personnel Security
- **PT**: PII Processing and Transparency (Privacy)
- **RA**: Risk Assessment
- **SA**: System and Services Acquisition
- **SC**: System and Communications Protection
- **SI**: System and Information Integrity
- **SR**: Supply Chain Risk Management

---

## 3.2 NIST SP 800-171 Rev. 3 & CMMC 2.0 for Defense Contractors

- **Controlled Unclassified Information (CUI)**: Sensitive government information requiring safeguarding in nonfederal systems.
- **CMMC 2.0 Levels**:
  - **Level 1 (Foundational)**: 15 basic cyber hygiene practices.
  - **Level 2 (Advanced)**: 110 requirements aligned 100% with **NIST SP 800-171 Rev. 3**.
  - **Level 3 (Expert)**: Enhanced controls from **NIST SP 800-172** defending against state-sponsored APTs.
`
  },
  {
    chapter_number: 4,
    title: 'Chapter 4: NIST AI Risk Management Framework (AI RMF 1.0 - AI 100-1)',
    content_body: `# Chapter 4: NIST AI Risk Management Framework (AI RMF 1.0)

Welcome to **Domain 4: NIST AI Risk Management Framework**, representing **15% of the examination**.

---

## 4.1 The 7 Characteristics of Trustworthy AI (NIST AI 100-1)

1. **Valid and Reliable**: Accurate performance within expected statistical distributions.
2. **Safe**: AI operation does not endanger human life, health, or property.
3. **Secure and Resilient**: Resistant to adversarial attacks (e.g., prompt injection, data poisoning).
4. **Accountable and Transparent**: Clear documentation of models, training data, and decision accountability.
5. **Explainable and Interpretable**: End-users can understand model reasoning and output logic.
6. **Privacy-Enhanced**: Safeguards data privacy throughout training and inference.
7. **Fair - with Harmful Bias Managed**: Actively identifies and mitigates systematic algorithmic bias and discriminatory outcomes.

---

## 4.2 The 4 AI RMF Core Functions

- **GOVERN**: Cultivates organizational risk culture, accountability, and AI policies.
- **MAP**: Identifies context, categorizes AI actors, and maps potential hazards and impacts.
- **MEASURE**: Employs quantitative and qualitative metrics for testing, evaluation, verification, and validation (TEVV).
- **MANAGE**: Allocates risk response resources and treats identified AI hazards in production.
`
  },
  {
    chapter_number: 5,
    title: 'Chapter 5: Specialized NIST Special Publications (SP 800-30, 61, 88, 137)',
    content_body: `# Chapter 5: Specialized NIST Special Publications

Welcome to **Domain 5: Specialized NIST Publications**, representing **15% of the examination**.

---

## 5.1 NIST SP 800-30 Rev. 1 Risk Assessment Process
1. **Prepare for Assessment** $\\rightarrow$ 2. **Conduct Assessment** (Identify threat sources, vulnerabilities, determine likelihood & impact) $\\rightarrow$ 3. **Communicate Results** $\\rightarrow$ 4. **Maintain Assessment**.

---

## 5.2 NIST SP 800-88 Rev. 1 Media Sanitization Categories

| Sanitization Category | Technical Method | Protection Level |
| :--- | :--- | :--- |
| **Clear** | Logical overwrite with binary patterns (zeros/ones). | Protects against simple keyboard/software recovery. |
| **Purge** | Physical/cryptographic techniques (Degaussing, ATA Secure Erase, Cryptographic Erase). | **Renders data recovery infeasible even using advanced laboratory techniques.** |
| **Destroy** | Physical disintegration, incineration, shredding, or melting. | Absolute physical destruction. |

> [!IMPORTANT]
> **💡 NIST / Exam Watch Alert**:
> - **Degaussing is INEFFECTIVE on Solid State Drives (SSDs)** because flash memory is non-magnetic. SSDs must be Purged via Cryptographic Erase / Secure Erase or physically Destroyed.
`
  }
];

async function enrichChapters() {
  await client.connect();
  for (const ch of ENRICHED_CHAPTERS) {
    await client.query(`
      UPDATE study_materials
      SET content_body = $1, title = $2
      WHERE certification_id = $3 AND chapter_number = $4;
    `, [ch.content_body, ch.title, NIST_CERT_ID, ch.chapter_number]);
  }
  console.log('Successfully enriched 5 Master Chapters for NIST in study_materials!');
  await client.end();
}

enrichChapters().catch(console.error);
