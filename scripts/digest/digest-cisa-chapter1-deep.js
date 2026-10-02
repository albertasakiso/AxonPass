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

const mod1Markdown = `# Module 1.1: Planning the IS Audit, Standards & Governance

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Audit Charter is King:** It is the single most critical governance document for an IS auditor. Without a board-approved charter, an internal audit department lacks formal authority, independence, and the mandate to demand evidence.
> * **Reporting Hierarchy:** The Chief Audit Executive (CAE) reports **Functionally to the Audit Committee/Board** (for audit plans, charters, results) and **Administratively to Executive Management / CEO** (for day-to-day payroll, budgeting, and logistics).
> * **ITAF Hierarchy:** Standards are **MANDATORY**; Guidelines are **RECOMMENDED**; Tools and Techniques provide **PROCEDURAL EXAMPLES**.

---

## 1. Management of the IS Audit Function

The Information Systems (IS) audit function provides independent, objective assurance to executive management and the Board of Directors regarding the effectiveness of IT governance, risk management, and internal control structures.

### 1.1 The IS Audit Charter
The **Audit Charter** is a formal, high-level governance document that establishes the overarching mandate of the internal audit activity within an enterprise.

#### Core Elements of the Audit Charter:
1. **Purpose, Authority, and Scope:** Explicitly defines the audit mission, objectives, and boundaries across all business units, physical facilities, cloud environments, and third-party vendors.
2. **Organizational Independence:** Mandates dual-line reporting to safeguard auditor objectivity:
   - **Functional Reporting (Board of Directors / Audit Committee):** Approval of the audit charter, annual risk-based audit plan, budget, CAE appointment/removal, and review of significant audit findings.
   - **Administrative Reporting (CEO or Senior Executive):** Operational day-to-day administration (expense approvals, internal communication, human resources).
3. **Unrestricted Right of Access:** Guarantees auditors unimpeded access to all organizational records, computer systems, databases, networks, personnel, physical premises, and outsourced service providers.
4. **Professional Responsibilities & Due Care:** Binds the audit team to professional standards (ISACA ITAF, IIA International Standards).

| **Attribute** | **Audit Charter** | **Engagement Letter / Scope Memo** |
| :--- | :--- | :--- |
| **Authority Level** | Enterprise-wide governance document | Specific to a single audit project |
| **Approved By** | **Audit Committee / Board of Directors** | Lead Auditor & Auditee Management |
| **Frequency of Review**| Annual periodic review | Issued before each distinct audit engagement |
| **Contents** | Mandate, reporting lines, authority, access | Specific scope, timeline, deliverables, team |

---

### 1.2 ISACA ITAF Standards & Guidelines

ISACA's **Information Technology Assurance Framework (ITAF)** establishes a professional framework of mandatory requirements and guidance for IT audit and assurance professionals:
- **1. STANDARDS (Mandatory):** General Standards (1000 series: Charter, Independence), Performance Standards (1200 series: Planning, Testing), Reporting Standards (1400 series: Criteria, Sign-off).
- **2. GUIDELINES (Recommended Best Practices):** Provide detailed application guidance for Standards. Auditors must document justifications for deviations.
- **3. TOOLS & TECHNIQUES (Procedural Implementations):** Practical sample audit programs, checklists, and scripts.

#### Key ITAF Mandatory Standards:
- **Standard 1001 (Audit Charter):** The audit function shall have a documented charter approved by the highest level of governance.
- **Standard 1002 (Organizational Independence):** The IS audit activity shall be independent of the area or activity being audited to ensure objective judgment.
- **Standard 1003 (Professional Ethics & Due Care):** Compliance with the ISACA Code of Professional Ethics, maintaining technical competence and integrity.
- **Standard 1201 (Engagement Planning):** Audit engagements must be planned with a clear understanding of enterprise risks, controls, and materiality.

---

## 2. Business Processes and Internal Controls Taxonomy

An internal control is any policy, procedure, practice, or organizational structure designed to provide reasonable assurance that business objectives will be achieved and risk events prevented or mitigated.

### 2.1 COSO Internal Control Framework (5 Components)
1. **Control Environment:** The tone at the top, ethical values, organizational structure, and management philosophy.
2. **Risk Assessment:** Systematic identification and analysis of relevant risks to achieving objectives.
3. **Control Activities:** Policies and procedures that ensure management directives are carried out (approvals, reconciliations, authorizations).
4. **Information & Communication:** Timely, accurate capture and transmission of operational and financial information.
5. **Monitoring Activities:** Ongoing evaluations and separate audits to ascertain whether control components are functioning.

---

### 2.2 Functional Control Taxonomy

Controls are classified based on **when** and **how** they act relative to a risk event:

| **Control Type** | **Definition** | **Examples** |
| :--- | :--- | :--- |
| **Preventive Controls** | Prevent errors, omissions, or security breaches **before** they occur. | • Multi-Factor Authentication (MFA)<br>• Segregation of Duties (SoD)<br>• Input validation rules (regex check)<br>• Lockable server racks |
| **Detective Controls** | Identify errors, anomalies, or unauthorized transactions **after** they have occurred. | • Automated log monitoring & SIEM alerts<br>• Bank reconciliations<br>• Hash checksum verification<br>• Internal audit reviews |
| **Corrective Controls** | Remediate problems discovered by detective controls and **restore systems** to nominal states. | • Restoring databases from clean backup<br>• Applying emergency security patches<br>• Disaster Recovery Plan execution<br>• Incident Response containment |
| **Compensating Controls** | Alternative controls applied when primary controls are unfeasible (e.g., small staff lacking SoD). | • Daily supervisory log review when developer has production access<br>• Dual signatures on high-value transfers |
| **Deterrent Controls** | Discourage individuals from attempting unauthorized or malicious actions. | • Warning banners on login screens<br>• Visible CCTV security cameras<br>• Published disciplinary policy |
| **Directive Controls** | Mandate specific behaviors to encourage compliance with governance goals. | • Mandatory annual security awareness training<br>• Clean desk policy enforcement |

---

## 3. Risk-Based Audit Planning & The Audit Risk Model

IS audit resources are finite. Therefore, the Chief Audit Executive must formulate an **Annual Risk-Based Audit Plan** focusing on areas with the highest risk exposure.

### 3.1 The Audit Risk Formula

**Audit Risk (AR) = Inherent Risk (IR) × Control Risk (CR) × Detection Risk (DR)**

Where:
- **Audit Risk (AR):** The risk that the auditor issues an unqualified (clean) opinion on systems containing material control deficiencies or errors. (Targeted by auditors to be <= 5%).
- **Inherent Risk (IR):** The baseline vulnerability of a business process or asset to material error/loss assuming **zero internal controls exist**. (Driven by business complexity, transaction volume, cash liquidity).
- **Control Risk (CR):** The probability that management's internal controls **fail to prevent or detect** an error on a timely basis. (Driven by internal control design and operating effectiveness).
- **Detection Risk (DR):** The risk that the auditor's substantive testing and sampling procedures **fail to uncover** an existing material error.

---

> ### 🚨 ISACA EXAM WATCH: The Inverse Relationship of Detection Risk
> * **Management controls Inherent Risk & Control Risk.** Together, Inherent Risk × Control Risk = Risk of Material Misstatement (RMM).
> * **The Auditor controls ONLY Detection Risk (DR).**
> * If Inherent Risk and Control Risk are assessed as **HIGH**, the auditor must set Detection Risk to **LOW** by:
>   1. Expanding the sample size.
>   2. Performing substantive testing closer to the balance date.
>   3. Using automated Generalized Audit Software (GAS) on 100% of transactions instead of random sampling.`;

const mod2Markdown = `# Module 1.2: Audit Evidence, Fieldwork & Sampling Methodologies

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Evidence Reliability Hierarchy:** 
>   1. **Direct Auditor Observation / Physical Inspection** (Most Reliable)
>   2. **External Third-Party Confirmation** (Banks, Vendors, Lawyers)
>   3. **Internally Generated Documents with Strong Controls** (System generated logs)
>   4. **Oral Inquiries / Client Testimonials** (Least Reliable — requires corroboration)
> * **Compliance vs Substantive:**
>   - **Compliance Testing (Test of Controls):** Answers *"Did the control operate as intended?"* (e.g., Was the user access form signed?). Uses **Attribute Sampling**.
>   - **Substantive Testing (Test of Details):** Answers *"Are the transaction balances and data values accurate?"* (e.g., Is the calculated interest accurate?). Uses **Variable Sampling**.

---

## 1. Audit Evidence Competence, Sufficiency & Techniques

Audit evidence consists of all facts, records, documents, observations, and calculations obtained by the auditor to support audit findings and conclusions.

### 1.1 Criteria for High-Quality Audit Evidence
- **Sufficiency (Quantity):** A measure of the amount of evidence gathered. Driven by the assessed risk of error.
- **Competence / Appropriateness (Quality):** A measure of the relevance and reliability of the evidence.
- **Relevance:** The evidence directly addresses the specific audit objective or control assertion being evaluated.
- **Reliability:** The objective trustworthiness of the evidence source.

---

### 1.2 Evidence Gathering Techniques
1. **Inquiry:** Interviewing systems administrators and operational personnel. (Must be corroborated with objective evidence).
2. **Observation:** Watching an employee execute a procedure (e.g., visitor badge sign-in). *Limitation: Observation only provides evidence for the exact moment the auditor is present.*
3. **Inspection of Records / Assets:** Examining firewall rules, system configurations, purchase orders, or inspecting server room physical hardware.
4. **External Confirmation:** Directly obtaining written verification from an independent third party (e.g., verifying cloud SOC 2 report with external auditor or bank balances).
5. **Recalculation:** Independently verifying mathematical calculations (e.g., depreciation formulas, payroll taxes, automated discounts).
6. **Reperformance:** The auditor independently executes the control procedure to verify that the result matches the system output.
7. **Analytical Procedures:** Comparing financial or operational ratios, trend analysis, and benchmarking against historical patterns to identify unexpected anomalies.

---

## 2. Compliance Testing vs. Substantive Testing

Every audit testing procedure falls into one of two fundamental categories:

| **Characteristic** | **Compliance Testing (Test of Controls)** | **Substantive Testing (Test of Details)** |
| :--- | :--- | :--- |
| **Primary Question** | *"Did the internal control operate effectively?"* | *"Is the data value / transaction balance accurate?"* |
| **Focus** | Process compliance, authorizations, access controls | Monetary balances, calculations, data integrity |
| **Outcome** | Qualitative / Binary (Compliant or Non-Compliant) | Quantitative / Numerical (Dollar error / Mismatch) |
| **Sampling Method** | **Attribute Sampling** (Frequency of control failure) | **Variable Sampling** (Total monetary error estimation) |
| **Example** | Checking whether 50 change tickets contain approval signatures | Re-calculating database interest payments across 10,000 accounts |
| **Sequence** | Performed **first**. If controls are strong, substantive testing is reduced. | Performed **second**. If controls fail, substantive testing is expanded. |

---

## 3. Audit Sampling Methodologies & Sample Size Determinants

Auditors rarely test 100% of manual transactions due to cost and time constraints. Sampling allows the auditor to draw valid conclusions about an entire population from a subset of items.

### 3.1 Statistical vs. Non-Statistical Sampling
- **Statistical Sampling:** Uses mathematical probability theory (e.g., random number generators) to calculate sample size, quantify sampling risk, and project results with a measurable confidence interval.
- **Non-Statistical (Judgmental) Sampling:** Relies on the auditor's subjective judgment and experience to select specific items. Cannot mathematically measure sampling risk.

---

### 3.2 Sampling Techniques
1. **Attribute Sampling:** Used in **Compliance Testing** to determine the rate of occurrence of a specific attribute (e.g., error rate in access authorization).
2. **Variable Sampling (Classical Variable Sampling):** Used in **Substantive Testing** to estimate the total dollar value or numerical amount of a population (Mean-per-Unit, Ratio Estimation, Difference Estimation).
3. **Stratified Sampling:** Dividing a heterogeneous population into homogeneous subgroups (strata) to optimize sample efficiency (e.g., separating all transactions > $100,000 into a 100% audit stratum, while randomly sampling transactions < $10,000).
4. **Monetary Unit Sampling (MUS) / Dollar-Unit Sampling:** A hybrid statistical sampling method where every individual dollar in the population has an equal probability of selection, naturally weighting high-value transactions.
5. **Stop-or-Go Sampling:** A sequential sampling method designed to avoid over-sampling when the auditor expects very few control errors. Testing stops as soon as a predetermined confidence level is reached.
6. **Discovery Sampling:** A specialized attribute sampling approach used when searching for **fraud or critical non-compliance**. The objective is to discover at least **one** occurrence if the violation rate exceeds a specified threshold.

---

### 3.3 Sample Size Determinants (The Levers of Sampling)

| **Parameter** | **Definition** | **Impact on Sample Size** |
| :--- | :--- | :---: |
| **Confidence Level (Desired Reliability)** | Probability that the sample represents the population (e.g., 95% vs 99%). | **Higher Confidence -> LARGER Sample Size** (Up) |
| **Tolerable Error Rate (TER)** | The maximum rate of error the auditor is willing to accept without failing the control. | **Higher Tolerable Error -> SMALLER Sample Size** (Down) |
| **Expected Error Rate (EER)** | The auditor's prior estimate of error rate based on historical audits or pilot samples. | **Higher Expected Error -> LARGER Sample Size** (Up) |
| **Precision Interval** | The allowable margin of difference between the sample estimate and true population. | **Tighter Precision -> LARGER Sample Size** (Up) |
| **Population Size (N)** | Total number of items in the population. | **Negligible impact** on sample size once N > 10,000 |

---

> ### 🚨 ISACA EXAM WATCH: Sampling Pitfalls
> * **Tolerable Error vs Expected Error:** If Expected Error Rate approaches or exceeds Tolerable Error Rate, sampling is useless—the control has already failed, and 100% substantive testing or remediation reporting is required.
> * **Sampling Risk:**
>   - **Risk of Under-reliance (Type I Error / Alpha Risk):** Auditor concludes control is ineffective when it is actually effective (causes audit inefficiency).
>   - **Risk of Over-reliance (Type II Error / Beta Risk):** Auditor concludes control is effective when it is actually broken (**causes audit failure / material risk**).`;

const mod3Markdown = `# Module 1.3: CAATs, Data Analytics & Continuous Auditing

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Why use CAATs?** Manual sampling tests only 20–50 transactions out of millions. CAATs allow testing **100% of the entire population** in seconds with zero sampling risk.
> * **ITF (Integrated Test Facility):** Sets up a fictional branch/vendor (e.g., Branch 999) inside live production. Test transactions are processed through the exact same production business logic. Must ensure test transactions do NOT distort financial statements or get mailed to real customers!
> * **EAM (Embedded Audit Module):** Specialized audit code written inside production applications that copies transactions meeting specified criteria (e.g., transfers > $10,000) to a secure audit log file.

---

## 1. Computer-Assisted Audit Techniques (CAATs)

CAATs encompass specialized software, scripts, queries, and automated routines that enable auditors to extract, interrogate, analyze, and test electronic data directly from enterprise systems.

### 1.1 Generalized Audit Software (GAS)
**Generalized Audit Software (GAS)** (e.g., ACL, IDEA, Python/SQL scripts) is designed to run read-only analyses on diverse data formats extracted from mainframe, relational, and cloud databases.

#### Primary Functions of GAS:
1. **100% Population Interrogation:** Eliminates sampling risk by validating every single record.
2. **Duplicate Detection:** Rapidly identifies duplicate invoice numbers, check numbers, or employee Social Security Numbers.
3. **Gap Detection:** Identifies missing numbers in sequential ranges (e.g., missing check numbers or unrecorded purchase orders indicative of fraud).
4. **Data Stratification & Aging:** Groups inventory, receivables, or ledger entries into aging buckets.
5. **Statistical Sampling Selection:** Automatically draws random, stratified, or monetary-unit samples.
6. **Cross-System Reconciliations:** Matches employee bank accounts against vendor bank accounts to identify conflict-of-interest kickbacks.

---

### 1.2 Automated Embedded Audit Techniques Comparison

| **Technique** | **How It Works** | **Key Advantages** | **Risks & Limitations** |
| :--- | :--- | :--- | :--- |
| **Integrated Test Facility (ITF)** | Creates a dummy entity (e.g., Department 99) in the live production database. Auditor runs test transactions alongside real data. | Tests real-time live production code and interfaces directly. | Test data can corrupt live financial statements if not properly isolated/reversed. |
| **Embedded Audit Module (EAM)** | Specialized audit subroutines embedded in application source code that intercept transactions meeting criteria. | Real-time continuous detection of high-risk transactions. | High programming overhead; requires maintenance when application code updates. |
| **Snapshot Technique** | Takes a digital picture of internal system registers and variables before and after a specific transaction executes. | Provides step-by-step insight into complex algorithmic calculations. | Substantial system processing overhead; generates massive log volumes. |
| **System Control Audit Review File (SCARF)** | Embedded audit routines that write selected transactions to a dedicated, tamper-resistant audit file for later review. | Historical archive of transactions exceeding risk thresholds. | Must secure the SCARF log file from administrative tampering. |
| **Audit Hooks** | Specialized triggers embedded in software to flag suspicious transactions and immediately notify auditors. | Real-time red flag alerting before damage spreads. | High alert volume can lead to alert fatigue. |
| **Parallel Simulation** | Auditor writes an independent program to process real transactions and compares outputs with production results. | Verifies that production software processes data correctly without touching production code. | Labor-intensive; requires rebuilding complex business logic in the audit program. |

---

## 2. Continuous Auditing vs. Continuous Monitoring

Traditional auditing relies on periodic, retrospective reviews performed months after transactions occur. In modern automated enterprises, assurance must be continuous.

### Key Differences:
- **Continuous Monitoring:** An **operational management activity** that tracks business transactions against defined business rules and operating thresholds to detect errors, fraud, and process deviations in near real-time.
- **Continuous Auditing:** An **independent assurance activity** performed by internal auditors to gather automated audit evidence on continuous transactions, providing real-time reporting on internal control effectiveness.`;

const mod4Markdown = `# Module 1.4: Control Self-Assessment (CSA), Reporting & Remediation

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Golden Rule of CSA:** **"Failure to act on improvement suggestions could damage employee morale."** When frontline workers participate in CSA workshops and highlight vulnerabilities, management MUST act. Ignoring suggestions breeds cynicism, employee frustration, and destruction of trust.
> * **Auditor Role in CSA:** The auditor is a **Facilitator, Trainer, and Moderator**. Line management and operational staff **OWN** the risks and controls.
> * **The 5 Cs of Audit Findings:**
>   1. **Criteria:** What SHOULD be (Policy, Standard, Law).
>   2. **Condition:** What IS (The factual gap discovered).
>   3. **Cause:** WHY it happened (Root cause: lack of training, staffing).
>   4. **Consequence / Effect:** The RISK or financial impact.
>   5. **Corrective Action:** The RECOMMENDED remediation.

---

## 1. Control Self-Assessment (CSA) Methodologies

**Control Self-Assessment (CSA)** is an established audit and risk management approach where operational staff and business process owners evaluate the adequacy and effectiveness of their own internal controls and risk management processes.

### 1.1 The Three Traditional Approaches to CSA:
1. **Facilitated Team Workshops:** Structured group sessions moderated by an IS auditor where operational staff and management discuss risk scenarios, evaluate control effectiveness, and brainstorm remediation. (Most effective for complex cross-functional processes).
2. **Surveys & Questionnaires:** Pre-structured digital questionnaires distributed to a broad employee population to assess control culture and procedural compliance. (Cost-effective for geographically dispersed operations).
3. **Management-Produced Analysis:** Process owners generate formal risk and control matrices for internal audit verification.

---

### 1.2 Roles in a CSA Workshop:
- **Operational Line Managers & Staff:** **Own and evaluate the risks and controls.** They know the daily operational realities and propose realistic solutions.
- **The IS Auditor:** Acts as a **Facilitator, Educator, and Independent Consultant**. The auditor moderates the discussions, provides risk frameworks, and ensures objective evaluation without taking ownership of operational controls.

---

### 1.3 Comprehensive Analysis of CSA Advantages vs. Disadvantages

| **Advantages of CSA** | **Disadvantages & Behavioral Risks of CSA** |
| :--- | :--- |
| **Fosters Control Ownership:** Staff take personal pride and responsibility for controls. | **Employee Morale Damage:** **Failure to act on improvement suggestions damages employee morale.** If management fails to implement solutions, staff become cynical and refuse future participation. |
| **Early Risk Identification:** Frontline staff spot control gaps long before external audits occur. | **Mistaken as Audit Replacement:** Management may erroneously assume CSA replaces independent audits. (CSA complements audits, never replaces them). |
| **Improves Communication:** Bridges the communication barrier between senior leadership and operational staff. | **Subjectivity & Defensive Reporting:** Process owners may downplay vulnerabilities to avoid management blame. |
| **Optimizes Audit Resources:** Allows auditors to focus testing on high-risk areas identified in workshops. | **Time & Resource Demands:** Requires significant staff hours and ongoing executive commitment. |

---

## 2. Audit Communication, Reporting & Exit Conferences

### 2.1 The Exit Conference (Closing Meeting)
Prior to issuing the formal written audit report, the lead IS auditor must conduct an **Exit Conference** with auditee management.

#### Objectives of the Exit Conference:
- Present preliminary audit findings and factual evidence to operational management.
- **Fact-Check:** Verify that there are no factual misunderstandings or misinterpretations of technical configurations.
- Agree upon realistic remediation target dates and ownership for corrective action plans.
- Ensure that management is not surprised by anything in the final executive report.

> **Auditor Conflict Rule:** If management disagrees with an audit finding, the auditor should review additional evidence provided by management. If disagreement persists, the auditor MUST retain the finding in the report while documenting management's dissenting view.

---

### 2.2 Structure of a High-Impact Audit Finding (The 5 Cs)

Every audit finding in an IS audit report must be structured according to the **5 Cs Framework**:
1. **CRITERIA (What should be):** The standard, baseline, or policy (e.g., ISO 27001, Internal Security Policy).
2. **CONDITION (What is):** The actual factual defect discovered during fieldwork.
3. **CAUSE (Why it happened):** The underlying root reason (e.g., lack of training, staffing shortage, missing automation).
4. **CONSEQUENCE / EFFECT (The Risk):** The business risk and financial/operational impact.
5. **CORRECTIVE PLAN (Action):** The practical recommendation to remediate the gap.

---

## 3. Audit Workpapers & Remediation Follow-up

### 3.1 Audit Documentation & Workpaper Governance
- **Ownership & Custody:** Audit workpapers are the property of the **audit organization**, NOT the auditee or the individual auditor.
- **Retention & Confidentiality:** Workpapers contain sensitive vulnerability data and must be encrypted at rest with restricted role-based access. Retention must comply with legal and regulatory mandates.
- **Re-performance Standard:** Workpapers must be sufficiently detailed so that another competent auditor, with no prior connection to the engagement, can re-perform the testing and arrive at the exact same conclusion.

---

### 3.2 Follow-Up & Remediation Tracking
- The audit engagement is **NOT complete** when the report is issued.
- The IS audit function must maintain a formal **Remediation Tracking Matrix** to verify whether management implemented agreed-upon corrective actions within established deadlines.
- **Escalation Policy:** If management fails to remediate critical control deficiencies or assumes unacceptable levels of residual risk, the Chief Audit Executive must **escalate the matter directly to the Audit Committee and Board of Directors**.`;

const CHAPTER_1_MODULES = [
  {
    chapterNumber: 1,
    sectionNumber: 'Module 1.1',
    title: 'Chapter 1 (Part 1): Planning the IS Audit, Standards & Governance',
    pageStart: 1,
    pageEnd: 30,
    estimatedReadMinutes: 40,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'ITAF mandatory standards hierarchy, Audit Charter governance, Functional vs Administrative reporting, COSO Internal Control Taxonomy, Types of Audits, and Risk-Based Audit Planning.',
    examTips: 'The Audit Charter MUST be approved by the Audit Committee/Board. The Audit Charter grants UNRESTRICTED access to systems and personnel. Inherent Risk + Control Risk = Risk of Material Misstatement (RMM). Auditor controls ONLY Detection Risk.',
    contentMarkdown: mod1Markdown
  },
  {
    chapterNumber: 1,
    sectionNumber: 'Module 1.2',
    title: 'Chapter 1 (Part 2): Audit Evidence, Fieldwork & Sampling Methodologies',
    pageStart: 31,
    pageEnd: 60,
    estimatedReadMinutes: 40,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'Hierarchy of Audit Evidence, Compliance vs Substantive Testing, Statistical vs Non-Statistical Sampling, Attribute Sampling for controls, Variable Sampling for dollar balances, Sample Size Determinants.',
    examTips: 'Third-party written confirmations and physical observation are MORE reliable than internal client documents. Attribute sampling evaluates controls (Yes/No). Variable sampling evaluates numerical amounts ($). Increasing Tolerable Error DECREASES sample size. Increasing Confidence Level INCREASES sample size.',
    contentMarkdown: mod2Markdown
  },
  {
    chapterNumber: 1,
    sectionNumber: 'Module 1.3',
    title: 'Chapter 1 (Part 3): CAATs, Data Analytics & Continuous Auditing',
    pageStart: 61,
    pageEnd: 85,
    estimatedReadMinutes: 35,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'Generalized Audit Software (GAS), Embedded Audit Modules (EAM), Integrated Test Facility (ITF), Snapshot & SCARF techniques, Continuous Auditing vs Continuous Monitoring, and Data Analytics.',
    examTips: 'GAS enables 100% population screening, duplicate checks, and gap analysis. ITF processes dummy test transactions alongside live production data (requires strict reversal controls). Continuous Auditing is AUDITOR-DRIVEN; Continuous Monitoring is MANAGEMENT-DRIVEN.',
    contentMarkdown: mod3Markdown
  },
  {
    chapterNumber: 1,
    sectionNumber: 'Module 1.4',
    title: 'Chapter 1 (Part 4): Control Self-Assessment (CSA), Reporting & Remediation',
    pageStart: 86,
    pageEnd: 110,
    estimatedReadMinutes: 40,
    fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf',
    keyTakeaways: 'CSA objectives, Facilitated workshop approaches, Advantages and Behavioral risks, Employee Morale Impact, Audit Report Structure (5Cs: Criteria, Condition, Cause, Consequence, Corrective Action), Exit Conference, Workpapers custody, and Remediation Tracking.',
    examTips: 'CRITICAL ISACA CONCEPT: Failure to act on improvement suggestions damages employee morale and creates cynicism. The IS Auditor in CSA acts as a FACILITATOR/EDUCATOR, NOT the control owner. Exit conference is for fact-checking and resolving misunderstandings BEFORE releasing the final report. Repeat audit findings must be escalated to the Audit Committee.',
    contentMarkdown: mod4Markdown
  }
];

async function runDeepChapter1Digestion() {
  try {
    await client.connect();
    console.log('=== DIGESTING DEEP EXHAUSTIVE CHAPTER 1 MODULE-BY-MODULE ===\n');

    // 1. Fetch Domain 1 ID for CISA
    const domRes = await client.query(`
      SELECT d.id FROM domains d 
      JOIN certifications c ON d.certification_id = c.id 
      WHERE c.slug = 'cisa' AND d.domain_number = 1
    `);

    if (domRes.rows.length === 0) {
      throw new Error('CISA Domain 1 not found in database');
    }
    const domain1Id = domRes.rows[0].id;

    // 2. Delete existing Chapter 1 study_materials to replace with deep modules
    await client.query(`
      DELETE FROM study_materials 
      WHERE certification_id = $1 AND chapter_number = 1
    `, [CISA_CERT_ID]);
    console.log('Cleared previous summary Chapter 1 records.');

    // 3. Ingest all 4 deep modules
    let sortOrder = 1;
    for (const mod of CHAPTER_1_MODULES) {
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
        domain1Id,
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
    console.log(`Deep Chapter 1 Digestion Completed!`);
    console.log(`Total CISA Manual Modules/Chapters in DB: ${countRes.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during deep Chapter 1 digestion:', err);
  } finally {
    await client.end();
  }
}

runDeepChapter1Digestion();
