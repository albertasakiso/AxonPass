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

const ISACA_TRACKS = [
  // =========================================================================
  // CISM — 4 DOMAINS
  // =========================================================================
  {
    certSlug: 'cism',
    certId: 'a0000000-0000-0000-0000-000000000005',
    chapterNumber: 1,
    title: 'Domain 1: Information Security Governance & Strategic Alignment',
    documentTitle: 'ISACA CISM Review Manual & CISO Leadership Guide',
    edition: '16th Edition Official',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Executive alignment, CISO reporting structures, steering committee mandate, business cases, and regulatory compliance (GDPR/HIPAA/SOX).',
    examTips: 'Think like a CISO. Security must enable business goals within risk tolerance. Functional reporting goes to the Board/Steering Committee.',
    fileReference: 'my_documents/CISM Certified Information Security Manager Study Guide - Mike Chapple.epub',
    contentMarkdown: `# Domain 1: Information Security Governance

Information security governance provides strategic direction, ensures objectives are achieved, manages risks appropriately, uses resources responsibly, and monitors program success.

---

## 1.1 Alignment of Security with Enterprise Strategy

The foundational purpose of information security is to support enterprise business objectives while preserving stakeholder value.

\`\`\`
                     ┌───────────────────────────────────────────┐
                     │          ENTERPRISE BUSINESS GOALS        │
                     └─────────────────────┬─────────────────────┘
                                           │ Cascading Alignment
                                           ▼
                     ┌───────────────────────────────────────────┐
                     │       INFORMATION SECURITY STRATEGY       │
                     └─────────────────────┬─────────────────────┘
                                           │ Execution Blueprint
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  POLICIES & ARCH │             │  RISK MANAGEMENT │             │  INCIDENT OPS    │
│ Security Standards             │ Appetite & KRIs  │             │ CSIRT Readiness  │
└──────────────────┘             └──────────────────┘             └──────────────────┘
\`\`\`

### Core Governance Outcomes:
1. **Strategic Alignment**: Security investments directly enable commercial and operational goals.
2. **Risk Optimization**: Mitigate intolerable exposure while pursuing business opportunities within risk appetite.
3. **Value Delivery**: Maximize return on security expenditure (ROSI) and eliminate redundant controls.
4. **Resource Optimization**: Deploy skilled personnel, automated tooling, and MSSPs effectively.
5. **Performance Measurement**: Quantifiable metrics (KRIs/KPIs) reported to executive leadership.

---

## 1.2 Steering Committee Mandate & Roles

The **Information Security Steering Committee (ISSC)** provides cross-functional oversight:
- **Composition**: Business unit leaders (Finance, Legal, HR, Operations), CISO, CIO, and Chief Risk Officer.
- **Mandate**: Approves security strategy, prioritizes major security projects, reviews residual risk exposures, and resolves cross-departmental friction.

| Role | Governance Responsibility | Operational Mandate |
| :--- | :--- | :--- |
| **Board of Directors** | Ultimate accountability for enterprise risk | Evaluates and monitors governance outcomes |
| **Executive Management (CEO/COO)** | Allocates budget and operational mandate | Enforces security policies across business units |
| **CISO** | Designs, coordinates, and manages security program | Reports residual risk and KRI trends to leadership |
| **Business Asset Owner** | **Owns the business risk** and approves access | Classifies assets and signs off on risk acceptance |

> [!IMPORTANT]
> **💡 CISM Exam Watch**:
> - The CISO does **NOT** own the business risk and cannot accept risk on behalf of the business. Ultimate risk acceptance belongs exclusively to the **Business Asset Owner**.`
  },
  {
    certSlug: 'cism',
    certId: 'a0000000-0000-0000-0000-000000000005',
    chapterNumber: 2,
    title: 'Domain 2: Information Security Risk Management & Threat Analysis',
    documentTitle: 'ISACA CISM Review Manual & Risk IT Framework',
    edition: '16th Edition Official',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Quantitative vs Qualitative risk assessment, ALE/SLE/ARO calculations, risk treatment options, and forward-looking Key Risk Indicators (KRIs).',
    examTips: 'Controls must be cost-effective. If control cost exceeds ALE, consider risk transfer or formal acceptance.',
    fileReference: 'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
    contentMarkdown: `# Domain 2: Information Security Risk Management

Risk management identifies, evaluates, and treats information security risks to an acceptable level based on enterprise risk appetite.

---

## 2.1 Quantitative Risk Analysis Formulas

$$\\text{Single Loss Expectancy (SLE)} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$

$$\\text{Annualized Loss Expectancy (ALE)} = \\text{SLE} \\times \\text{Annualized Rate of Occurrence (ARO)}$$

$$\\text{Cost-Benefit Analysis (CBA)} = (\\text{ALE}_{\\text{pre-control}} - \\text{ALE}_{\\text{post-control}}) - \\text{Annual Cost of Control (ACC)}$$

### Risk Treatment Strategies:
1. **Mitigation (Reduction)**: Implementing technical or administrative controls (e.g., MFA, encryption).
2. **Transfer (Sharing)**: Purchasing cyber insurance or outsourcing liability via contractual indemnity.
3. **Avoidance**: Terminating the high-risk activity, product, or service entirely.
4. **Acceptance**: Formally retaining residual risk within approved risk appetite limits.`
  },
  {
    certSlug: 'cism',
    certId: 'a0000000-0000-0000-0000-000000000005',
    chapterNumber: 3,
    title: 'Domain 3: Information Security Program Development & Management',
    documentTitle: 'ISACA CISM Review Manual & ISO/IEC 27001 Blueprint',
    edition: '16th Edition Official',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 50,
    keyTakeaways: 'Security documentation hierarchy (Policy > Standard > Procedure > Guideline), Zero Trust architecture, security awareness metrics, and defense-in-depth.',
    examTips: 'Policies are mandatory executive directives. Procedures provide step-by-step instructions. Guidelines are discretionary recommendations.',
    fileReference: 'my_documents/Complete Guide to CISM Certification.pdf',
    contentMarkdown: `# Domain 3: Information Security Program Development

Developing and managing an information security program translates strategy into operational reality across architecture, people, process, and technology.

---

## 3.1 Documentation Hierarchy

1. **Policies (Mandatory)**: High-level executive mandates reflecting organizational security philosophy.
2. **Standards (Mandatory)**: Specific measurable technical configurations (e.g., AES-256 encryption, 16-character passwords).
3. **Procedures (Mandatory)**: Step-by-step operational workflows (e.g., patch deployment runbooks).
4. **Guidelines (Discretionary)**: Recommended best practices and implementation advice.`
  },
  {
    certSlug: 'cism',
    certId: 'a0000000-0000-0000-0000-000000000005',
    chapterNumber: 4,
    title: 'Domain 4: Information Security Incident Management & Resilience',
    documentTitle: 'ISACA CISM Review Manual & Incident Handling Guide',
    edition: '16th Edition Official',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'CSIRT response lifecycle, containment vs forensics, crisis management, BIA/RTO/RPO alignment, and post-incident root cause analysis.',
    examTips: 'Human life and safety is always #1 priority. Immediate containment isolates infected subnets while preserving volatile forensic evidence.',
    fileReference: 'my_documents/cybersecurity-incident-management-guide-EN.pdf',
    contentMarkdown: `# Domain 4: Information Security Incident Management

Incident management ensures rapid detection, containment, eradication, and recovery from adverse security events to minimize business disruption.

---

## 4.1 Incident Response Lifecycle (NIST SP 800-61 / ISACA)

1. **Preparation**: Developing playbooks, establishing CSIRT, deploying SIEM/SOAR monitoring.
2. **Detection & Triage**: Correlating alerts, determining incident severity and scope.
3. **Containment**: Halting lateral movement (network isolation, account revocation) while safeguarding evidence.
4. **Eradication**: Removing adversary backdoors, malware, and patching exploited flaws.
5. **Recovery**: Restoring services from verified clean backups and conducting heightened telemetry.
6. **Lessons Learned**: Conducting post-incident retrospectives to prevent recurrence.`
  },

  // =========================================================================
  // CGEIT — 4 DOMAINS
  // =========================================================================
  {
    certSlug: 'cgeit',
    certId: 'a0000000-0000-0000-0000-000000000010',
    chapterNumber: 1,
    title: 'Domain 1: Governance of Enterprise IT (Frameworks & COBIT 2019)',
    documentTitle: 'ISACA CGEIT Review Manual & COBIT 2019 Methodology',
    edition: '8th Edition Official',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 50,
    keyTakeaways: 'COBIT 2019 6 Governance Principles, Evaluate-Direct-Monitor (EDM), Design Factors, Goals Cascade, and Board decision rights.',
    examTips: 'Governance is the responsibility of the Board (EDM). Management executes daily activities (PBRM).',
    fileReference: 'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
    contentMarkdown: `# Domain 1: Governance of Enterprise IT

Enterprise Governance of IT (EGIT) ensures technology enables enterprise strategy, generates business value, and optimizes risks and resources.

---

## 1.1 COBIT 2019 Core Principles

1. **Provide Stakeholder Value**: Balance benefits realization, risk optimization, and resource utilization.
2. **Holistic Approach**: Integrate processes, structures, information, skills, and culture.
3. **Dynamic Governance System**: Continuously adapt to organizational strategy shifts.
4. **Governance Distinct from Management**: Clear separation between Board direction (EDM) and Executive execution (PBRM).
5. **Tailored to Enterprise Needs**: Contextualized using COBIT Design Factors.
6. **End-to-End Enterprise Coverage**: Encompasses all technology across the enterprise.`
  },
  {
    certSlug: 'cgeit',
    certId: 'a0000000-0000-0000-0000-000000000010',
    chapterNumber: 2,
    title: 'Domain 2: IT Resources & Sourcing Optimization',
    documentTitle: 'ISACA CGEIT Review Manual & Sourcing Frameworks',
    edition: '8th Edition Official',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Third-party vendor governance, cloud sourcing, SLAs, SFIA human capital management, and Data Stewardship governance.',
    examTips: 'Vendor contracts must include clear SLAs, right-to-audit clauses, and defined data ownership exit strategies.',
    fileReference: 'my_documents/Rethinking-Data-Governance-and-Data-Management_whp_Eng_0220.pdf',
    contentMarkdown: `# Domain 2: IT Resources Optimization

Optimizing IT resources ensures human capital, financial investments, data assets, and technology infrastructure deliver maximum capability.

---

## 2.1 Vendor & Cloud Governance Framework
- **Service Level Agreements (SLAs)**: Contractually binding metrics with penalties.
- **Data Stewardship**: Designating business owners accountable for data quality, lineage, and privacy.`
  },
  {
    certSlug: 'cgeit',
    certId: 'a0000000-0000-0000-0000-000000000010',
    chapterNumber: 3,
    title: 'Domain 3: Benefits Realization & Value Delivery (Val IT)',
    documentTitle: 'ISACA CGEIT Review Manual & Val IT 2.0 Framework',
    edition: '8th Edition Official',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Val IT 3 domains, business case lifecycle, Stage-Gate investment reviews, ROI/NPV/IRR calculations, and Post-Implementation Reviews (PIR).',
    examTips: 'Business case accountability resides with the business sponsor who benefits from the investment, not purely IT.',
    fileReference: 'my_documents/IT Assurance Guide_ Using COBIT ( PDFDrive.com ).pdf',
    contentMarkdown: `# Domain 3: Benefits Realization & Value Delivery

Val IT ensures IT-enabled business investments create measurable enterprise value at an acceptable cost within approved risk boundaries.

---

## 3.1 The 3 Val IT Domains
1. **Value Governance**: Aligning investment policies and evaluation criteria.
2. **Portfolio Management**: Balancing change-the-business vs run-the-business allocations.
3. **Investment Management**: Managing business case lifecycles through Stage-Gate milestones.`
  },
  {
    certSlug: 'cgeit',
    certId: 'a0000000-0000-0000-0000-000000000010',
    chapterNumber: 4,
    title: 'Domain 4: Risk Optimization & Internal Controls (CMMI & Risk IT)',
    documentTitle: 'ISACA CGEIT Review Manual & Risk IT Framework',
    edition: '8th Edition Official',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Risk Appetite vs Tolerance, Key Risk Indicators (KRIs), CMMI maturity levels (1 to 5), and business continuity assurance.',
    examTips: 'Level 5 CMMI represents continuous statistical optimization. KRIs are forward-looking predictive risk metrics.',
    fileReference: 'my_documents/CMM_Implementation_Guide.pdf',
    contentMarkdown: `# Domain 4: Risk Optimization & Internal Controls

Risk optimization ensures enterprise exposure is systematically identified, quantified, and treated within executive risk appetite boundaries.

---

## 4.1 CMMI Maturity Levels (1 to 5)
- **Level 1 (Initial)**: Unpredictable, poorly controlled, reactive.
- **Level 2 (Managed)**: Planned and executed at project level.
- **Level 3 (Defined)**: Standardized organizational processes.
- **Level 4 (Quantitatively Managed)**: Measured and controlled with data.
- **Level 5 (Optimizing)**: Continuous process improvement and automated optimization.`
  },

  // =========================================================================
  // CRISC — 4 DOMAINS
  // =========================================================================
  {
    certSlug: 'crisc',
    certId: 'a0000000-0000-0000-0000-000000000006',
    chapterNumber: 1,
    title: 'Domain 1: Governance & Organizational Risk Culture',
    documentTitle: 'ISACA CRISC Review Manual & ERM Integration',
    edition: '7th Edition Official',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Three Lines Model, Risk Appetite Statements, Board risk committees, and risk culture enablement.',
    examTips: '1st Line = Operational management. 2nd Line = Risk & Compliance functions. 3rd Line = Internal Audit (independent assurance).',
    fileReference: 'my_documents/CRISC Review Manual.pdf',
    contentMarkdown: `# Domain 1: Governance & Organizational Risk Culture

Risk governance establishes organizational risk culture, accountability structures, and alignment with Enterprise Risk Management (ERM).

---

## 1.1 The IIA Three Lines Model

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                   GOVERNING BODY / AUDIT COMMITTEE                     │
│                  Accountability to Stakeholders for Oversight           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
    ▼                                                               ▼
┌──────────────────────────────────────────────┐   ┌─────────────────────────────┐
│              SENIOR MANAGEMENT               │   │      INTERNAL AUDIT         │
│  Actions (including risk management)         │   │  Independent Assurance     │
│                                              │   │  (3rd Line)                 │
│  ┌────────────────────┐ ┌──────────────────┐ │   └─────────────────────────────┘
│  │    1st LINE        │ │     2nd LINE     │ │
│  │ Operational Mgmt,  │ │ Risk, Compliance,│ │
│  │ Control Execution  │ │ Security Oversight│ │
│  └────────────────────┘ └──────────────────┘ │
└──────────────────────────────────────────────┘
\`\`\``
  },
  {
    certSlug: 'crisc',
    certId: 'a0000000-0000-0000-0000-000000000006',
    chapterNumber: 2,
    title: 'Domain 2: IT Risk Assessment Methodologies & Threat Scenarios',
    documentTitle: 'ISACA CRISC Review Manual & Risk Assessment Guide',
    edition: '7th Edition Official',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Risk identification, threat modeling, vulnerability analysis, BIA impact rating, and risk register maintenance.',
    examTips: 'Threat * Vulnerability * Impact = Risk. A vulnerability without an active threat source poses zero immediate risk.',
    fileReference: 'my_documents/CRISC review manual 2016.pdf',
    contentMarkdown: `# Domain 2: IT Risk Assessment

Risk assessment identifies, analyzes, and evaluates risks against defined risk criteria to produce actionable risk registers for executive decision-makers.`
  },
  {
    certSlug: 'crisc',
    certId: 'a0000000-0000-0000-0000-000000000006',
    chapterNumber: 3,
    title: 'Domain 3: Risk Response, Treatment & Reporting',
    documentTitle: 'ISACA CRISC Review Manual & Risk Treatment Plans',
    edition: '7th Edition Official',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Selecting optimal treatment (Mitigate, Transfer, Avoid, Accept), cost-benefit analysis, POA&Ms, and executive dashboards.',
    examTips: 'Risk response must consider control ownership, remediation deadlines, and residual risk tracking.',
    fileReference: 'my_documents/CRISC Exam Study Guide - Hemang Doshi- Preview.pdf',
    contentMarkdown: `# Domain 3: Risk Response and Reporting

Risk response selects and implements prioritized actions to bring risk exposures within approved enterprise tolerance levels.`
  },
  {
    certSlug: 'crisc',
    certId: 'a0000000-0000-0000-0000-000000000006',
    chapterNumber: 4,
    title: 'Domain 4: Information Technology & Security Controls Design',
    documentTitle: 'ISACA CRISC Review Manual & Control Assurance',
    edition: '7th Edition Official',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Preventive, Detective, Corrective, Compensating controls; control testing methodologies; continuous monitoring; BCP/DRP.',
    examTips: 'Automated detective controls paired with automated corrective actions (SOAR) provide the lowest mean time to respond (MTTR).',
    fileReference: 'my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf',
    contentMarkdown: `# Domain 4: Information Technology and Security

Designing, implementing, and assessing robust internal IT controls ensures long-term operational resilience and regulatory compliance.`
  }
];

async function ingestISACATracks() {
  await client.connect();
  console.log('=== DEEP INGESTION: ISACA TRACKS (CISM, CGEIT, CRISC) ===\n');

  for (const mod of ISACA_TRACKS) {
    // Check if domain exists
    const domRes = await client.query(
      'SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2',
      [mod.certId, mod.chapterNumber]
    );
    const domainId = domRes.rows[0]?.id;

    if (!domainId) {
      console.log(`⚠️ Domain ${mod.chapterNumber} not found for cert ${mod.certSlug}`);
      continue;
    }

    await client.query(`
      INSERT INTO study_materials (
        certification_id, domain_id, title, content_type, content_body,
        document_title, edition, chapter_number, section_number,
        estimated_read_minutes, key_takeaways, exam_tips, file_reference, sort_order
      ) VALUES (
        $1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content_body = EXCLUDED.content_body,
        document_title = EXCLUDED.document_title,
        edition = EXCLUDED.edition,
        estimated_read_minutes = EXCLUDED.estimated_read_minutes,
        key_takeaways = EXCLUDED.key_takeaways,
        exam_tips = EXCLUDED.exam_tips,
        file_reference = EXCLUDED.file_reference;
    `, [
      mod.certId, domainId, mod.title, mod.contentMarkdown,
      mod.documentTitle, mod.edition, mod.chapterNumber, mod.sectionNumber,
      mod.estimatedReadMinutes, mod.keyTakeaways, mod.examTips, mod.fileReference,
      mod.chapterNumber
    ]);

    console.log(`✓ [${mod.certSlug.toUpperCase()}] Fully Ingested Module ${mod.chapterNumber}: ${mod.title}`);
  }

  await client.end();
  console.log('\n=== ISACA TRACKS DEEP INGESTION COMPLETE! ===\n');
}

ingestISACATracks().catch(console.error);
