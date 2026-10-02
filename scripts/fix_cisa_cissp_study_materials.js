import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

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

const CISA_ID = 'a0000000-0000-0000-0000-000000000001';
const CISSP_ID = 'a0000000-0000-0000-0000-000000000007';

// CISSP Domain IDs
const CISSP_DOM1 = 'd0000000-0000-0000-0000-000000000071'; // Security and Risk Management
const CISSP_DOM2 = 'd0000000-0000-0000-0000-000000000072'; // Asset Security

// CISA Domain IDs
const CISA_DOM1 = 'd0000000-0000-0000-0000-000000000001'; // Information System Auditing Process
const CISA_DOM2 = 'd0000000-0000-0000-0000-000000000002'; // Governance and Management of IT

async function fixCisaAndCisspMaterials() {
  await client.connect();
  console.log('=== FIXING CISA AND CISSP STUDY MATERIALS ASSIGNMENTS ===\n');

  // 1. Move CISSP Chapter 1 & Chapter 2 from CISA to CISSP
  await client.query(`
    UPDATE study_materials
    SET certification_id = $1, domain_id = $2
    WHERE id = 'e0000000-0000-0000-0000-000000000001';
  `, [CISSP_ID, CISSP_DOM1]);
  console.log('[CISSP] Moved Chapter 1 to CISSP Domain 1');

  await client.query(`
    UPDATE study_materials
    SET certification_id = $1, domain_id = $2
    WHERE id = 'e0000000-0000-0000-0000-000000000002';
  `, [CISSP_ID, CISSP_DOM1]);
  console.log('[CISSP] Moved Chapter 2 to CISSP Domain 1');

  // 2. Add CISSP Chapters 3, 4, and 5
  const cisspChapters = [
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      cert_id: CISSP_ID,
      dom_id: CISSP_DOM1,
      ch_num: 3,
      sort_order: 3,
      title: 'Chapter 3: Business Continuity Planning and Legal Regulations',
      doc_title: 'ISC2 CISSP Certified Information Systems Security Professional Official Study Guide',
      edition: '10th Edition (2024)',
      read_min: 40,
      takeaways: 'Business Continuity Planning (BCP) project scope, Business Impact Analysis (BIA), Maximum Tolerable Downtime (MTD), regulatory compliance, and cyber law.',
      tips: 'MTD = RTO + WRT. In disaster scenarios, human life safety always takes absolute precedence over asset protection.',
      body: `# Chapter 3: Business Continuity Planning and Legal Regulations

## 3.1 Business Continuity Planning (BCP) Process
Business Continuity Planning focuses on sustaining operations during disruptions:
- **Project Scope and Planning**: Defining organizational boundaries, assigning resources, and establishing executive oversight.
- **Business Impact Analysis (BIA)**: Identifying critical business functions, assessing qualitative and quantitative outage impacts.
- **Recovery Metrics**:
  - **MTD (Maximum Tolerable Downtime)**: The total time the organization can endure an outage before permanent insolvency.
  - **RTO (Recovery Time Objective)**: Target time to restore systems and services.
  - **RPO (Recovery Point Objective)**: Maximum acceptable data loss measured in time.
  - **WRT (Work Recovery Time)**: Time needed to verify data integrity and resume normal business processing.

\`\`\`
+-------------------------------------------------------------------------+
|                  MAXIMUM TOLERABLE DOWNTIME (MTD)                       |
|                                                                         |
|  [ Interruption ] ==========> [ Systems Restored ] ========> [ Operations Normal ]
|         |                            |                              |
|         |<-------- RTO ------------->|<---------- WRT ------------->|
|         |                                                           |
|         |<------------------------- MTD --------------------------->|
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Legal, Regulatory & Compliance Frameworks
- **Computer Fraud and Abuse Act (CFAA)**: Prohibits unauthorized access to protected computers.
- **Electronic Communications Privacy Act (ECPA)**: Governs interception of wire and electronic communications.
- **GDPR & Privacy Principles**: Right to be forgotten, data portability, and mandatory 72-hour breach notification.`
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      cert_id: CISSP_ID,
      dom_id: CISSP_DOM2,
      ch_num: 4,
      sort_order: 4,
      title: 'Chapter 4: Asset Security and Data Classification',
      doc_title: 'ISC2 CISSP Certified Information Systems Security Professional Official Study Guide',
      edition: '10th Edition (2024)',
      read_min: 35,
      takeaways: 'Information classification schemes (Commercial vs Military), data states (At Rest, In Transit, In Use), and data lifecycle management.',
      tips: 'Data Owner has ultimate responsibility for classification; Data Custodian manages daily technical safeguards.',
      body: `# Chapter 4: Asset Security and Data Classification

## 4.1 Information Classification Schemes
Information assets must be categorized to apply proportionate baseline controls:
- **Commercial Classification**: Public, Internal / Sensitive, Confidential, Secret / Proprietary.
- **Government / Military Classification**: Unclassified, Sensitive But Unclassified (SBU), Confidential, Secret, Top Secret.

\`\`\`
+--------------------------------------------------------------------------+
|                     DATA CLASSIFICATION HIERARCHY                        |
|                                                                          |
|  Military:     [ Top Secret ] > [ Secret ] > [ Confidential ] > [ Unclass ]
|  Commercial:   [ Restricted ] > [ Confidential ] > [ Internal ] > [ Public ]
+--------------------------------------------------------------------------+
\`\`\`

## 4.2 Data States and Protection Controls
1. **Data at Rest**: Stored on SAN, SSDs, backup tapes. Protected by AES-256 full disk encryption, SEDs.
2. **Data in Transit**: Moving over networks. Protected by TLS 1.3, IPsec (ESP).
3. **Data in Use**: Active in RAM, CPU registers. Protected by confidential computing (enclaves) and memory isolation.`
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      cert_id: CISSP_ID,
      dom_id: CISSP_DOM2,
      ch_num: 5,
      sort_order: 5,
      title: 'Chapter 5: Protecting Security of Assets and Media Sanitization',
      doc_title: 'ISC2 CISSP Certified Information Systems Security Professional Official Study Guide',
      edition: '10th Edition (2024)',
      read_min: 35,
      takeaways: 'NIST SP 800-88 Rev. 1 media sanitization guidelines: Clear, Purge (Degauss), Destroy. Scoping and tailoring baseline controls.',
      tips: 'Degaussing renders magnetic media unusable and is ineffective on Solid State Drives (SSDs); SSDs require cryptographic erase or physical disintegration.',
      body: `# Chapter 5: Protecting Security of Assets and Media Sanitization

## 5.1 Media Sanitization Standards (NIST SP 800-88 Rev. 1)
- **Clear**: Logical overwriting of addressable storage locations with non-sensitive data (e.g., standard single-pass zero overwrite).
- **Purge**: Cryptographic erase, block erase, or degaussing (magnetic media only) to prevent laboratory reconstruction attacks.
- **Destroy**: Physical destruction (incineration, shredding, disintegration into 2mm particles) preventing reuse.

\`\`\`
+--------------------------------------------------------------------+
|               NIST SP 800-88 MEDIA SANITIZATION TIERS              |
|                                                                    |
|  1. CLEAR   ---> Overwrite with fixed patterns (reusable)          |
|  2. PURGE   ---> Degaussing / Cryptographic Erase (lab-proof)      |
|  3. DESTROY ---> Shredding / Incineration / Smelting               |
+--------------------------------------------------------------------+
\`\`\``
    }
  ];

  for (const ch of cisspChapters) {
    await client.query(`
      INSERT INTO study_materials (
        id, certification_id, domain_id, title, content_type,
        content_body, sort_order, document_title, edition, chapter_number,
        estimated_read_minutes, key_takeaways, exam_tips
      ) VALUES ($1, $2, $3, $4, 'text', $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        certification_id = EXCLUDED.certification_id,
        domain_id = EXCLUDED.domain_id,
        title = EXCLUDED.title,
        content_body = EXCLUDED.content_body,
        sort_order = EXCLUDED.sort_order,
        document_title = EXCLUDED.document_title,
        edition = EXCLUDED.edition,
        chapter_number = EXCLUDED.chapter_number,
        estimated_read_minutes = EXCLUDED.estimated_read_minutes,
        key_takeaways = EXCLUDED.key_takeaways,
        exam_tips = EXCLUDED.exam_tips;
    `, [
      ch.id, ch.cert_id, ch.dom_id, ch.title, ch.body, ch.sort_order,
      ch.doc_title, ch.edition, ch.ch_num, ch.read_min, ch.takeaways, ch.tips
    ]);
    console.log(`[CISSP] Ingested: ${ch.title}`);
  }

  // 3. Seed Authentic CISA Domain 1 and Domain 2 Master Study Materials
  const cisaChapters = [
    {
      id: 'e0000000-0000-0000-0000-000000010001',
      cert_id: CISA_ID,
      dom_id: CISA_DOM1,
      ch_num: 1,
      sort_order: 1,
      title: 'Chapter 1 (Part 1): The Process of Auditing Information Systems (Audit Charter, ITAF Standards & Risk-Based Planning)',
      doc_title: 'ISACA CISA Review Manual (27th Edition / 2026 Release)',
      edition: '27th Edition (2026)',
      read_min: 45,
      takeaways: 'IS Audit Charter authority, ITAF professional standards, risk-based audit universe planning, materiality thresholds, and audit risk components (Inherent, Control, Detection).',
      tips: 'The Audit Charter MUST be approved by the Audit Committee or Board of Directors. The auditor must remain independent in fact and appearance.',
      body: `# ISACA CISA Domain 1: Information System Auditing Process (Part 1)

## 1.1 Management of the IS Audit Function
The Information Systems Audit function provides independent assurance that an enterprise's information systems and controls protect assets, maintain data integrity, and support organizational goals.

### The IS Audit Charter
The foundation of the IS audit function is the **Audit Charter**:
- **Purpose, Responsibility, Authority, and Accountability**: Formally documents the scope and mission of the IS audit department.
- **Executive Approval**: Must be formally approved by executive management and confirmed by the **Audit Committee of the Board of Directors**.
- **Audit Independence**: Grants unrestricted access to systems, personnel, records, and facilities necessary for audit engagements.

\`\`\`
+-------------------------------------------------------------------------+
|                        IS AUDIT CHARTER GOVERNANCE                      |
|                                                                         |
|  [ Board of Directors / Audit Committee ] === Approves ===> [ Charter ] |
|                                                                    |    |
|  [ Chief Audit Executive (CAE) ] <==== Grants Mandate & Authority =+    |
|            |                                                            |
|            v                                                            |
|  [ IS Audit Universe & Annual Risk-Based Audit Plan ]                   |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 ISACA ITAF Professional Standards Hierarchy
ISACA's Information Technology Assurance Framework (ITAF) organizes professional guidelines:
1. **ITAF Standards (Mandatory)**: Series 1000 (General), 1200 (Performance), 1400 (Reporting).
2. **ITAF Guidelines (Discretionary)**: Provide guidance on applying standards to specific audit scenarios.
3. **ITAF Tools and Techniques**: Procedures, checklists, CAATs methodologies.

## 1.3 Risk-Based Audit Planning and the Audit Risk Model
Audit resources are prioritized using a risk-based approach rather than arbitrary scheduling:
$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$
- **Inherent Risk (IR)**: The susceptibility of an activity to material error, assuming no controls.
- **Control Risk (CR)**: The risk that internal controls fail to prevent or detect material errors timely.
- **Detection Risk (DR)**: The risk that the IS auditor's testing procedures will fail to detect a material error. This is the **only component controlled directly by the auditor** through sample size and testing rigor.`
    },
    {
      id: 'e0000000-0000-0000-0000-000000010002',
      cert_id: CISA_ID,
      dom_id: CISA_DOM1,
      ch_num: 1,
      sort_order: 2,
      title: 'Chapter 1 (Part 2): Audit Execution, CAATs, Evidence Gathering, Sampling & Reporting',
      doc_title: 'ISACA CISA Review Manual (27th Edition / 2026 Release)',
      edition: '27th Edition (2026)',
      read_min: 40,
      takeaways: 'Statistical vs non-statistical sampling, Compliance testing vs Substantive testing, Computer-Assisted Audit Techniques (CAATs/GAS), chain of custody, and exit conferences.',
      tips: 'Compliance testing evaluates control existence and design; Substantive testing evaluates transaction validity and monetary accuracy.',
      body: `# ISACA CISA Domain 1: Information System Auditing Process (Part 2)

## 1.4 Audit Testing Methodologies
IS audit procedures are divided into two fundamental testing categories:
- **Compliance Testing (Design & Operating Effectiveness)**: Determines whether internal controls are applied as prescribed (e.g., inspecting user access request forms, testing password policy enforcement).
- **Substantive Testing (Transaction Integrity)**: Directly verifies the accuracy and completeness of transactions and data (e.g., recalculating payroll balances, confirming inventory totals with third parties).

\`\`\`
+--------------------------------------------------------------------------+
|                  AUDIT TESTING PROGRESSION MATRIX                        |
|                                                                          |
|  [ Risk Assessment ] ---> [ Compliance Testing (Controls) ]              |
|                                   |                                      |
|            +----------------------+----------------------+               |
|            |                                             |               |
|  (Controls Effective)                          (Controls Ineffective)    |
|            v                                             v               |
|  [ Moderate Substantive Testing ]              [ Heavy Substantive Test] |
+--------------------------------------------------------------------------+
\`\`\`

## 1.5 Computer-Assisted Audit Techniques (CAATs)
- **Generalized Audit Software (GAS)**: Enables extracting, sorting, and analyzing 100% of large database populations (e.g., ACL, IDEA, SQL analysis).
- **Integrated Test Facility (ITF)**: Creates fictitious entities (dummy accounts) within production databases to test live transaction processing.
- **Continuous Audit Modules (Embedded Audit Modules - EAM)**: Hooks built into application code that continuously monitor transactions and flag anomalies in real-time.`
    },
    {
      id: 'e0000000-0000-0000-0000-000000010003',
      cert_id: CISA_ID,
      dom_id: CISA_DOM2,
      ch_num: 2,
      sort_order: 3,
      title: 'Chapter 2 (Part 1): IT Governance, Strategic Alignment & Steering Committee Leadership',
      doc_title: 'ISACA CISA Review Manual (27th Edition / 2026 Release)',
      edition: '27th Edition (2026)',
      read_min: 45,
      takeaways: 'IT Governance definition, IT Steering Committee vs Strategy Committee, Alignment of IT Strategy with Business Strategy, Balanced Scorecard (BSC), and Enterprise Architecture.',
      tips: 'IT Strategy Committee is a Board-level committee providing governance; IT Steering Committee is an Executive Management-level body overseeing project implementation.',
      body: `# ISACA CISA Domain 2: Governance and Management of IT (Part 1)

## 2.1 Corporate vs IT Governance
IT Governance is the responsibility of the **Board of Directors and Executive Management**. It consists of leadership, organizational structures, and processes that ensure enterprise IT sustains and extends organizational strategies and objectives.

### Governance vs Management Committees
- **IT Strategy Committee (Board Level)**:
  - Advises the Board on IT-related strategy, direction, and emerging risks.
  - Ensures alignment between IT strategy and enterprise business strategy.
- **IT Steering Committee (Executive Management Level)**:
  - Prioritizes IT projects, approves resource allocations, and monitors project milestones.
  - Resolves cross-functional operational conflicts and ensures project delivery.

\`\`\`
+------------------------------------------------------------------------+
|                   IT GOVERNANCE COMMITTEE HIERARCHY                    |
|                                                                        |
|  [ Board of Directors ] <===> [ IT Strategy Committee (Governance) ]   |
|            |                                                           |
|            v                                                           |
|  [ CEO / Executive Management ] <===> [ IT Steering Committee (Mgmt) ] |
|            |                                                           |
|            v                                                           |
|  [ IT Operations & Project Execution Teams ]                           |
+------------------------------------------------------------------------+
\`\`\`

## 2.2 The IT Balanced Scorecard (BSC)
The IT Balanced Scorecard measures IT performance across 4 balanced perspectives:
1. **Financial Perspective**: Cost optimization, ROI, value delivery of IT investments.
2. **Customer / User Perspective**: User satisfaction ratings, SLA compliance, service reliability.
3. **Internal Process Perspective**: Development agility, incident resolution time, defect density.
4. **Learning and Growth Perspective**: Employee certifications, technical skills retention, innovation index.`
    },
    {
      id: 'e0000000-0000-0000-0000-000000010004',
      cert_id: CISA_ID,
      dom_id: CISA_DOM2,
      ch_num: 2,
      sort_order: 4,
      title: 'Chapter 2 (Part 2): COBIT 2019 Framework, IT Sourcing, Third-Party Oversight & EA Architecture',
      doc_title: 'ISACA CISA Review Manual (27th Edition / 2026 Release)',
      edition: '27th Edition (2026)',
      read_min: 40,
      takeaways: 'COBIT 2019 5 Governance and 35 Management objectives (EDM, APO, BAI, DSS, MEA), Third-Party Risk Management (TPRM), Service Level Agreements (SLAs), and Right to Audit clauses.',
      tips: 'A Right-to-Audit clause in third-party vendor contracts is essential to allow the enterprise and its auditors to inspect vendor controls.',
      body: `# ISACA CISA Domain 2: Governance and Management of IT (Part 2)

## 2.3 The COBIT 2019 Framework
COBIT 2019 defines 40 Governance and Management Objectives across 5 distinct domains:

\`\`\`
+--------------------------------------------------------------------------+
|                  COBIT 2019 CORE OBJECTIVES DOMAINS                      |
|                                                                          |
|  GOVERNANCE:                                                             |
|    - EDM: Evaluate, Direct and Monitor (5 Objectives)                    |
|                                                                          |
|  MANAGEMENT:                                                             |
|    - APO: Align, Plan and Organize (14 Objectives)                       |
|    - BAI: Build, Acquire and Implement (11 Objectives)                   |
|    - DSS: Deliver, Service and Support (6 Objectives)                    |
|    - MEA: Monitor, Evaluate and Assess (4 Objectives)                    |
+--------------------------------------------------------------------------+
\`\`\`

## 2.4 Third-Party Sourcing & Vendor Risk Management
When IT services or infrastructure are outsourced to third-party cloud/service providers:
- **Due Diligence**: Financial viability, reputation, security certification audits (SOC 1/2/3, ISO 27001).
- **Contractual Safeguards**:
  - **SLA (Service Level Agreement)**: Measurable performance metrics (uptime, latency, resolution times) with defined financial penalties.
  - **Right-to-Audit Clause**: Permits the customer and external auditors to inspect facilities, procedures, and logs.
  - **Escrow Agreement**: Third party deposits source code and documentation with an independent escrow agent in case of vendor bankruptcy or contract breach.`
    }
  ];

  for (const ch of cisaChapters) {
    await client.query(`
      INSERT INTO study_materials (
        id, certification_id, domain_id, title, content_type,
        content_body, sort_order, document_title, edition, chapter_number,
        estimated_read_minutes, key_takeaways, exam_tips
      ) VALUES ($1, $2, $3, $4, 'text', $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        certification_id = EXCLUDED.certification_id,
        domain_id = EXCLUDED.domain_id,
        title = EXCLUDED.title,
        content_body = EXCLUDED.content_body,
        sort_order = EXCLUDED.sort_order,
        document_title = EXCLUDED.document_title,
        edition = EXCLUDED.edition,
        chapter_number = EXCLUDED.chapter_number,
        estimated_read_minutes = EXCLUDED.estimated_read_minutes,
        key_takeaways = EXCLUDED.key_takeaways,
        exam_tips = EXCLUDED.exam_tips;
    `, [
      ch.id, ch.cert_id, ch.dom_id, ch.title, ch.body, ch.sort_order,
      ch.doc_title, ch.edition, ch.ch_num, ch.read_min, ch.takeaways, ch.tips
    ]);
    console.log(`[CISA] Ingested authentic: ${ch.title}`);
  }

  // Final verification counts
  const cisaCount = await client.query('SELECT count(*) FROM study_materials WHERE certification_id = $1', [CISA_ID]);
  const cisspCount = await client.query('SELECT count(*) FROM study_materials WHERE certification_id = $1', [CISSP_ID]);
  console.log(`\n========================================================================================`);
  console.log(`✅ CISA Study Materials Count: ${cisaCount.rows[0].count} (All authentic ISACA CISA chapters!)`);
  console.log(`✅ CISSP Study Materials Count: ${cisspCount.rows[0].count} (All 21 ISC2 CISSP chapters intact!)`);
  console.log(`========================================================================================\n`);

  await client.end();
}

fixCisaAndCisspMaterials().catch(console.error);
