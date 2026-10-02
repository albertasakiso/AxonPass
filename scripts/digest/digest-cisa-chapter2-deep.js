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

const CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001';

const mod2_1Markdown = `# Module 2.1: IT Governance Structure, Strategy & Strategic Alignment

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **IT Strategy Committee vs IT Steering Committee:** This is one of the most tested distinctions on the CISA exam.
>   - **Strategy Committee:** Sits at the **BOARD OF DIRECTORS** level. Focuses on long-term strategy, risk appetite, ROI, and alignment with corporate mission.
>   - **Steering Committee:** Sits at the **EXECUTIVE / MANAGEMENT** level (CIO, CFO, Business Unit Heads). Focuses on project prioritization, resource allocation, project milestones, and resolving operational roadblocks.
> * **Balanced Scorecard (BSC):** Translates strategy into actionable metrics across 4 dimensions: Financial, Customer, Internal Business Processes, and Learning & Growth.

---

## 1. Corporate Governance and IT Governance Architecture

IT Governance is an integral part of enterprise governance. It consists of the leadership, organizational structures, and processes that ensure the enterprise's IT sustains and extends the organization's strategies and objectives.

### 1.1 The 5 Focus Areas of IT Governance (ISACA Framework)
1. **Strategic Alignment:** Aligning IT operations and investments with enterprise business goals and collaborative solutions.
2. **Value Delivery:** Ensuring IT investments deliver the promised benefits against the business case, optimizing costs and creating tangible return on investment.
3. **Risk Management:** Establishing transparent risk appetite, understanding compliance mandates, and embedding risk assessments into all IT decisions.
4. **Resource Management:** Optimizing the knowledge, infrastructure, applications, information, and people assets.
5. **Performance Measurement:** Tracking project delivery and IT services using balanced scorecards and key performance indicators (KPIs).

---

## 2. Governance Committees & Organizational Structures

Effective governance requires distinct separation between strategic board oversight and management operational execution:

| **Characteristic** | **IT Strategy Committee** | **IT Steering Committee** |
| :--- | :--- | :--- |
| **Organizational Level** | **Board of Directors Level** | **Executive / Operations Level** |
| **Chairperson** | Member of the Board of Directors | Executive Sponsor (CIO, CFO, or COO) |
| **Membership** | Board members and specialized technical advisors | CIO, Business Unit Leaders, IT Directors, PMO |
| **Primary Mandate** | Advises the Board on alignment, risk appetite, and strategic IT investments. | Approves project charters, prioritizes budget, allocates resources, tracks milestones. |
| **Time Horizon** | Long-term strategic horizon (3–5+ years) | Short-to-medium operational horizon (annual/quarterly) |
| **Key Output** | Board risk policies, high-level investment mandates | Approved project roadmaps, resource schedules, status reports |

---

## 3. IT Balanced Scorecard (IT BSC)

Traditional financial metrics only measure past performance. The **IT Balanced Scorecard** establishes a holistic measurement framework across four perspectives:

1. **Financial Perspective:** How does IT contribute to business value and cost optimization? (e.g., IT spend per transaction, ROI on cloud migration).
2. **Customer / User Perspective:** How do internal business units and external clients perceive IT services? (e.g., CSAT scores, SLA compliance rate, helpdesk resolution speed).
3. **Internal Process Perspective:** How efficient and reliable are core IT operational workflows? (e.g., change failure rate, system uptime percentage, patch cycle time).
4. **Learning & Growth Perspective:** How is IT fostering employee innovation and capability? (e.g., staff training hours, retention of key architects, adoption of modern DevOps tooling).

---

## 4. Policy, Standard, Guideline, and Procedure Hierarchy

Enterprise security governance relies on a strictly structured documentation pyramid:
- **1. POLICIES (Mandatory):** High-level statements of management intent and direction (e.g., Information Security Policy, Acceptable Use Policy). Approved by executive management.
- **2. STANDARDS (Mandatory):** Specific, enforceable technical rules and configurations (e.g., passwords must be at least 14 characters, AES-256 encryption required).
- **3. PROCEDURES (Mandatory):** Detailed step-by-step instructions for executing operational tasks (e.g., employee offboarding procedure).
- **4. GUIDELINES (Recommended):** Advisory suggestions and best practices where discretion is permitted (e.g., coding style guides).`;

const mod2_2Markdown = `# Module 2.2: IT Governance Frameworks & COBIT 2019 Architecture

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **COBIT 2019 Structure:** COBIT separates **Governance** from **Management**.
>   - **Governance (1 Domain):** **EDM** (Evaluate, Direct, and Monitor) — Owned by the Board of Directors.
>   - **Management (4 Domains):** **APO** (Align, Plan, Organize), **BAI** (Build, Acquire, Implement), **DSS** (Deliver, Service, Support), and **MEA** (Monitor, Evaluate, Assess) — Owned by Executive Management.
> * **CMMI Maturity Levels (0 to 5):**
>   - 0: Incomplete | 1: Initial (Ad-hoc) | 2: Managed (Project level) | 3: Defined (Enterprise standard) | 4: Quantitatively Managed (Measured) | 5: Optimizing (Continuous improvement).

---

## 1. COBIT 2019 Framework Overview

**COBIT 2019** (Control Objectives for Information and Related Technologies) is ISACA's premier enterprise IT governance and management framework. It provides principles, design factors, and 40 core governance and management objectives.

### 1.1 The Core Distinction: Governance vs. Management
- **Governance:** Evaluates stakeholder needs, conditions, and options; sets direction through prioritization and decision-making; and monitors performance and compliance against agreed-upon direction (**EDM**).
- **Management:** Plans, builds, runs, and monitors activities in alignment with the direction set by the governance body to achieve the enterprise objectives (**APO, BAI, DSS, MEA**).

---

### 1.2 The 5 COBIT 2019 Domains
1. **EDM (Evaluate, Direct, and Monitor - 5 Objectives):** Governance framework, benefits delivery, risk optimization, resource optimization, stakeholder engagement.
2. **APO (Align, Plan, and Organize - 14 Objectives):** Strategy, architecture, portfolio, innovation, organizational structure, HR, quality, risk, security.
3. **BAI (Build, Acquire, and Implement - 11 Objectives):** Programs, requirements, solutions, availability, change enablement, knowledge, assets, configuration.
4. **DSS (Deliver, Service, and Support - 6 Objectives):** Operations, service requests, problems, continuity, security services, business process controls.
5. **MEA (Monitor, Evaluate, and Assess - 4 Objectives):** Performance and conformance monitoring, internal control system, compliance, assurance.

---

## 2. Capability Maturity Model Integration (CMMI Levels 0–5)

Auditors use process maturity models to assess the institutional rigor of organizational workflows:

| **Level** | **Maturity Level** | **Operational Characteristics** |
| :--- | :--- | :--- |
| **0** | **Incomplete** | Work is not performed or fails to achieve intended goals. |
| **1** | **Initial (Ad-hoc)** | Processes are unpredictable, chaotic, and reactive. Success depends entirely on individual heroics. |
| **2** | **Managed** | Processes are planned, documented, and performed at the project level, but vary between teams. |
| **3** | **Defined** | Processes are standardized, well-documented, and integrated across the entire enterprise. |
| **4** | **Quantitatively Managed** | Processes are measured using statistical metrics and predictable quantitative quality targets. |
| **5** | **Optimizing** | Focus is on continuous process improvement and agile innovation using defect cause analysis. |

---

## 3. Complementary Industry Frameworks
- **ITIL v4 (IT Infrastructure Library):** Focuses on IT Service Management (ITSM), incident management, service desk, and service value chain.
- **ISO/IEC 27001:** The global standard for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).
- **ISO/IEC 38500:** Corporate governance of information technology standard defining principles for governing bodies (Responsibility, Strategy, Acquisition, Performance, Conformance, Human Behavior).
- **TOGAF (The Open Group Architecture Framework):** Enterprise architecture framework for structuring business, data, application, and technology domains.`;

const mod2_3Markdown = `# Module 2.3: IT Risk Management & Quantitative Formulas

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Core Formulas:**
>   - **Single Loss Expectancy (SLE):** SLE = Asset Value (AV) × Exposure Factor (EF)
>   - **Annualized Loss Expectancy (ALE):** ALE = SLE × Annualized Rate of Occurrence (ARO)
>   - **Cost-Benefit Analysis (CBA):** Net Benefit = (ALE_prior - ALE_post) - Annual Cost of Safeguard (ACS)
> * **The 4 Risk Responses:**
>   1. **Mitigation / Reduction:** Implement technical controls (Firewalls, MFA).
>   2. **Transfer / Sharing:** Purchase cyber insurance or contractually outsource risk to vendors.
>   3. **Avoidance:** Terminate the high-risk activity (e.g., cancel product launch in high-risk country).
>   4. **Acceptance:** Acknowledge residual risk within risk appetite (formally signed off by management).

---

## 1. Risk Management Concepts & Principles

Risk is the combination of the probability of an event and its consequence.

### 1.1 Risk Appetite vs. Risk Tolerance
- **Risk Appetite:** The broad amount and type of risk an enterprise is **willing to accept** in pursuit of its strategic objectives (set by the Board of Directors).
- **Risk Tolerance:** The acceptable level of **variation or deviation** around specific operational objectives (e.g., willing to tolerate a maximum of 2 hours downtime per quarter).
- **Residual Risk:** The risk that remains after internal controls and countermeasures have been implemented:
  Residual Risk = Inherent Risk - Mitigated Risk

---

## 2. Quantitative Risk Assessment Calculations (Step-by-Step)

Quantitative risk analysis assigns objective monetary figures to assets, losses, and safeguards.

### Step 1: Calculate Single Loss Expectancy (SLE)
**SLE = AV × EF**
- **Asset Value (AV):** Total financial value of the asset (replacement cost, data value, revenue impact).
- **Exposure Factor (EF):** Percentage of asset value lost if a specific threat successfully exploits the vulnerability (ranges from 0% to 100%).

#### Example:
An e-commerce database server has an **Asset Value (AV) of $500,000**. A flood incident would destroy **40% (EF = 0.40)** of the server hardware and data.
SLE = $500,000 × 0.40 = **$200,000**

---

### Step 2: Calculate Annualized Loss Expectancy (ALE)
**ALE = SLE × ARO**
- **Annualized Rate of Occurrence (ARO):** The estimated frequency that a risk event occurs within a single 1-year period.
  - Occurs once every 10 years: ARO = 0.10
  - Occurs twice a year: ARO = 2.0

#### Example:
If the flood threat occurs once every 5 years (ARO = 0.20):
ALE = $200,000 × 0.20 = **$40,000 per year**

---

### Step 3: Cost-Benefit Analysis (CBA) of Safeguards
**Net Annual Benefit = (ALE_current - ALE_modified) - ACS**
- **ACS (Annual Cost of Safeguard):** Maintenance, licensing, and operational cost of the control per year.

#### Example:
Management considers installing water detection sensors and flood barriers costing **$10,000/year (ACS)**. This reduces the flood ARO to once every 25 years (ARO = 0.04), lowering modified ALE to:
ALE_modified = $200,000 × 0.04 = $8,000
Net Benefit = ($40,000 - $8,000) - $10,000 = **$22,000 Net Savings/Year**
*Decision:* Since Net Benefit is positive ($22,000), the safeguard is **economically justified**.

---

## 3. Qualitative Risk Assessment
When financial data is unavailable, qualitative methods rank risk using descriptive scales:
- **Risk Matrix / Heat Map:** 5x5 grid evaluating Likelihood (Rare to Almost Certain) vs Impact (Insignificant to Catastrophic).
- **Delphi Technique:** An anonymous, iterative consensus-building method using expert questionnaires to avoid peer-pressure bias.
- **Monte Carlo Simulation:** A computerized mathematical technique that runs thousands of randomized risk simulations to generate probability distributions of potential outcomes.`;

const mod2_4Markdown = `# Module 2.4: Human Resources, Segregation of Duties (SoD) & Sourcing

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Segregation of Duties (SoD):** No single individual should be able to execute and conceal an unauthorized transaction or error from start to finish.
> * **Classic Incompatible Duties:**
>   - **Software Developers must NEVER have write access to Production databases or servers.**
>   - **Systems Administrators must NEVER administer security access permissions or edit audit logs without oversight.**
> * **Software Escrow:** An arrangement where third-party escrow agents hold vendor source code. If the vendor goes bankrupt or ceases maintenance, the source code is released to the licensee.

---

## 1. Human Resource Security Lifecycle

Employees represent both an enterprise's strongest asset and its most vulnerable threat vector.

### 1.1 Key HR Security Controls
1. **Background Screening:** Verifying criminal records, employment history, and credentials prior to hiring.
2. **Non-Disclosure Agreements (NDAs):** Legally binding agreements protecting proprietary intellectual property.
3. **Mandatory Vacations (1–2 consecutive weeks):** Forces employees in sensitive roles (treasury, database admin) away from systems to uncover ongoing fraud or embezzlement.
4. **Job Rotation:** Cross-training staff while preventing single points of failure and reducing fraud opportunities.
5. **Dual Control / Split Knowledge:** Requiring two distinct individuals to approve a single transaction (e.g., dual authorization on transfers > $50,000).
6. **Immediate Termination Workflow:** Instant revocation of all logical access, recovery of physical keys/badges, and escort off premises.

---

## 2. Segregation of Duties (SoD) & Compensating Controls

SoD divides critical operational tasks among multiple people to prevent fraud, unauthorized modifications, and concealment.

### 2.1 Segregation of Duties Conflict Matrix

| Role | Incompatible Role | Why They Must Be Separated |
| :--- | :--- | :--- |
| **Software Developer** | **Production Release / Live Access** | Developers could introduce backdoors or untested code into live production. |
| **Systems Administrator** | **Security Administrator / Audit Log Reviewer** | Admins could modify configurations and delete audit logs to hide malicious activity. |
| **Data Entry Clerk** | **Reconciliation / Approval Officer** | A clerk could create fictitious vendors and approve fraudulent payments. |
| **Database Administrator (DBA)** | **Application User / End User** | DBAs could directly manipulate financial database rows bypassing application validation. |

### 2.2 Compensating Controls for Small IT Teams
When small organization size prevents full separation of duties, the IS auditor must verify that **compensating controls** are active:
- **Daily Independent Log Review:** Management reviews audit logs of all privileged actions.
- **Automated Workflow Alerts:** Automated alerts triggered whenever administrative changes are made.
- **Mandatory Dual Approval:** Requiring second-party executive sign-off on database updates.

---

## 3. Third-Party Vendor Management & Sourcing

Enterprises frequently outsource IT infrastructure, development, and cloud services to third parties.

### 3.1 Sourcing Strategies
- **Insourcing:** Retaining all IT staff and infrastructure in-house.
- **Outsourcing:** Contracting IT functions (e.g., helpdesk, infrastructure) to an external third-party service provider.
- **Offshoring:** Relocating business/IT operations to a foreign subsidiary or vendor to capitalize on cost advantages.
- **Cloud Computing (IaaS, PaaS, SaaS):** Shared responsibility model for hosting and computing.

---

### 3.2 Key Third-Party Governance Controls
1. **Service Level Agreements (SLAs):** Formal contractual commitments defining measurable service targets (e.g., 99.99% uptime, < 15 min incident response).
2. **Right-to-Audit Clauses:** Explicit contractual right granting the client's internal and external auditors authority to inspect the vendor's physical facilities, systems, and controls.
3. **Software Escrow Agreements:** Essential when purchasing commercial proprietary software (COTS). A third-party escrow agent holds source code to be released if the vendor goes bankrupt or ceases maintenance.
4. **Third-Party Assurance Reports (SOC 1 / SOC 2 / SOC 3):**
   - **SOC 1 (SSAE 18 / ISAE 3402):** Focuses on controls relevant to client **Financial Reporting**.
   - **SOC 2:** Evaluates controls against the **Trust Services Criteria** (Security, Availability, Processing Integrity, Confidentiality, Privacy).
     - *Type I Report:* Assesses control **design** at a single point in time.
     - *Type II Report:* Assesses control **design AND operating effectiveness over a 6–12 month period** (highest assurance).
   - **SOC 3:** General public summary of SOC 2 for marketing purposes without technical details.`;

const CHAPTER_2_MODULES = [
  {
    chapterNumber: 2,
    sectionNumber: 'Module 2.1',
    title: 'Chapter 2 (Part 1): IT Governance Structure, Strategy & Alignment',
    pageStart: 111,
    pageEnd: 135,
    estimatedReadMinutes: 40,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'IT Strategy Committee (Board) vs IT Steering Committee (Executive), 5 Focus Areas of IT Governance, Balanced Scorecard (IT BSC), and Policy Hierarchy.',
    examTips: 'Strategy Committee is at the BOARD level. Steering Committee is at the MANAGEMENT level. Policies are mandatory and high-level; Standards are mandatory and specific; Guidelines are recommended.',
    contentMarkdown: mod2_1Markdown
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Module 2.2',
    title: 'Chapter 2 (Part 2): IT Governance Frameworks & COBIT 2019 Architecture',
    pageStart: 136,
    pageEnd: 160,
    estimatedReadMinutes: 40,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'COBIT 2019 Governance (EDM) vs Management (APO, BAI, DSS, MEA), CMMI Maturity Levels 0 to 5, and complementary frameworks (ITIL, ISO 27001, ISO 38500).',
    examTips: 'Governance evaluates, directs, and monitors (EDM). Management plans, builds, runs, and monitors (APO/BAI/DSS/MEA). CMMI Level 3 is standardized across enterprise; Level 4 is quantitatively measured; Level 5 is optimizing.',
    contentMarkdown: mod2_2Markdown
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Module 2.3',
    title: 'Chapter 2 (Part 3): IT Risk Management & Quantitative Formulas',
    pageStart: 161,
    pageEnd: 185,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'Risk Appetite vs Tolerance, Quantitative formulas: SLE = AV x EF, ALE = SLE x ARO, Cost-Benefit Analysis (CBA), and the 4 Risk Responses.',
    examTips: 'SLE = AV x EF. ALE = SLE x ARO. A safeguard is only justified if Net Benefit is positive. Residual Risk = Inherent Risk - Mitigated Risk. The Delphi technique prevents peer bias.',
    contentMarkdown: mod2_3Markdown
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Module 2.4',
    title: 'Chapter 2 (Part 4): Human Resources, Segregation of Duties & Sourcing',
    pageStart: 186,
    pageEnd: 215,
    estimatedReadMinutes: 45,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'HR security lifecycle, Mandatory vacations, Segregation of Duties conflicts, Compensating controls, Software Escrow, and SOC 1/2/3 Type I vs Type II reports.',
    examTips: 'Developers must NEVER have write access to production. Mandatory vacations uncover ongoing fraud. Software escrow protects buyers if vendor goes bankrupt. SOC 2 Type II tests operating effectiveness over time.',
    contentMarkdown: mod2_4Markdown
  }
];

async function runDeepChapter2Digestion() {
  try {
    await client.connect();
    console.log('=== DIGESTING DEEP EXHAUSTIVE CHAPTER 2 MODULE-BY-MODULE ===\n');

    // 1. Fetch Domain 2 ID for CISA
    const domRes = await client.query(`
      SELECT d.id FROM domains d 
      JOIN certifications c ON d.certification_id = c.id 
      WHERE c.slug = 'cisa' AND d.domain_number = 2
    `);

    if (domRes.rows.length === 0) {
      throw new Error('CISA Domain 2 not found in database');
    }
    const domain2Id = domRes.rows[0].id;

    // 2. Delete existing Chapter 2 study_materials
    await client.query(`
      DELETE FROM study_materials 
      WHERE certification_id = $1 AND chapter_number = 2
    `, [CISA_CERT_ID]);
    console.log('Cleared previous summary Chapter 2 records.');

    // 3. Ingest all 4 deep modules
    let sortOrder = 5;
    for (const mod of CHAPTER_2_MODULES) {
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
        VALUES ($1, $2, $3, 'text', $4, 'ISACA CISA Review Manual', '28th Edition (2024–2026)', $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `, [
        CISA_CERT_ID,
        domain2Id,
        mod.title,
        mod.contentMarkdown,
        mod.chapterNumber,
        mod.sectionNumber,
        mod.pageStart,
        mod.pageEnd,
        mod.estimatedReadMinutes,
        mod.fileRef,
        mod.keyTakeaways,
        mod.examTips,
        sortOrder++
      ]);

      console.log(`✓ Ingested [${mod.sectionNumber}] ${mod.title} (ID: ${res.rows[0].id})`);
    }

    const countRes = await client.query(`
      SELECT count(*) FROM study_materials WHERE certification_id = $1
    `, [CISA_CERT_ID]);

    console.log('\n=============================================');
    console.log(`Deep Chapter 2 Digestion Completed!`);
    console.log(`Total CISA Manual Modules/Chapters in DB: ${countRes.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during deep Chapter 2 digestion:', err);
  } finally {
    await client.end();
  }
}

runDeepChapter2Digestion();
