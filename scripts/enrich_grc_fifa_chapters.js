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

const GRC_ID = 'a0000000-0000-0000-0000-000000000008';
const FIFA_ID = 'a0000000-0000-0000-0000-000000000009';

const GRC_FIFA_CHAPTERS = [
  // =========================================================================
  // Enterprise GRC Professional (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: GRC_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Corporate Governance, Ethics & Strategic Alignment Master Blueprint',
    doc_title: 'Enterprise GRC Professional Comprehensive Review Manual',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'OCEG GRC Capability Model (Learn, Align, Perform, Review), ISO 37000 governance principles, Board charter, Whistleblower mechanisms, and ESG governance.',
    tips: 'Principled Performance is the reliably achieving objectives while addressing uncertainty and acting with integrity (OCEG definition).',
    body: `# Enterprise GRC Domain 1: Corporate Governance, Ethics & Strategic Alignment

## 1.1 The OCEG GRC Capability Model (Red Book)
The Open Compliance and Ethics Group (OCEG) defines GRC as the integrated collection of capabilities that enable an organization to reliably achieve objectives, address uncertainty, and act with integrity (**Principled Performance**).

\`\`\`
+-------------------------------------------------------------------------+
|                    OCEG GRC CAPABILITY MODEL LIFECYCLE                  |
|                                                                         |
|  [ 1. LEARN ]  ──> Understand context, culture, stakeholders, and risks |
|        │                                                                |
|        ▼                                                                |
|  [ 2. ALIGN ]  ──> Align strategy, mission, objectives, and boundaries  |
|        │                                                                |
|        ▼                                                                |
|  [ 3. PERFORM ] ─> Execute controls, awareness, communication & crisis  |
|        │                                                                |
|        ▼                                                                |
|  [ 4. REVIEW ] ──> Continuous monitoring, audit assurance & improvement |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 ISO 37000:2021 (Governance of Organizations)
ISO 37000 establishes global benchmarks for organizational governance:
- **Purpose**: Defining the organization's unique reason to exist and long-term societal value creation.
- **Value Generation**: Directing resources to fulfill stakeholder expectations sustainably.
- **Oversight**: Exercising prudent, courageous supervision of organizational leadership.`
  },
  {
    cert_id: GRC_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: Enterprise Risk Management Frameworks (COSO ERM & ISO 31000)',
    doc_title: 'Enterprise GRC Professional Comprehensive Review Manual',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'COSO 2017 ERM Framework, ISO 31000 risk management process, risk aggregation, risk heat maps, KRIs, and Quantitative Monte Carlo simulation.',
    tips: 'COSO ERM 2017 emphasizes that risk is not just a defensive mechanism—it must be integrated directly with business strategy formulation.',
    body: `# Enterprise GRC Domain 2: Enterprise Risk Management (ERM)

## 2.1 The COSO ERM Framework (2017)
COSO ERM integrates risk management with enterprise strategy and performance across 5 core components:
1. **Governance and Culture**: Board risk oversight, operating structures, core ethical values.
2. **Strategy and Objective-Setting**: Evaluating alternative strategies, defining risk appetite.
3. **Performance**: Identifying risks, assessing severity, prioritizing risks, implementing risk responses.
4. **Review and Revision**: Assessing substantial changes, reviewing risk and performance.
5. **Information, Communication, and Reporting**: Leveraging IT systems, communicating risk data, reporting on risk and culture.`
  },

  // =========================================================================
  // FIFA Football Agent Licensing Exam (Domains 1 to 5)
  // =========================================================================
  {
    cert_id: FIFA_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: FIFA Football Agent Regulations (FFAR) & Representation Agreements Master Blueprint',
    doc_title: 'FIFA Football Agent Official Study Materials & Regulatory Guidelines',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'Licensing requirements, Representation Agreements (maximum 2-year term for individuals, no automatic renewal), Dual Representation restrictions, and conflicts of interest.',
    tips: 'Dual representation is strictly forbidden EXCEPT when representing the Player (or Coach) AND the Engaging Entity (Buying Club) in the same transaction with prior written consent of both parties.',
    body: `# FIFA Football Agent Domain 1: FFAR & Representation Contracts

## 1.1 Licensing and Eligibility Requirements (FFAR Articles 4–10)
To practice as a licensed FIFA Football Agent worldwide:
- **Licensing Criteria**: Passing the official FIFA Football Agent Exam, submitting clean criminal background records, having no conflicts of interest with clubs/leagues/associations.
- **Continuing Professional Development (CPD)**: Mandatory annual completion of FIFA educational credits.

\`\`\`
+-------------------------------------------------------------------------+
|                  FFAR REPRESENTATION CONTRACT RULES                     |
|                                                                         |
|  • Maximum Duration:        2 Years Maximum (Individual / Coach)        |
|  • Automatic Renewal:       STRICTLY PROHIBITED                         |
|  • Permitted Representation: Exclusive or Non-Exclusive                 |
|  • Dual Representation:     ONLY Player + Engaging Club (with consent)  |
|  • Releasing Club + Player: STRICTLY PROHIBITED (Triple Rep Forbidden)  |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 Dual Representation Rules
Under FFAR Article 12:
- An Agent **may NOT** represent more than one party in the same transaction, **with one narrow exception**:
  - An Agent may represent an **Engaging Entity (Buying Club)** AND a **Client (Player/Coach)**, provided both clients give prior explicit written consent.
- An Agent may **NEVER** represent the Releasing Entity (Selling Club) along with any other party in the transaction.`
  },
  {
    cert_id: FIFA_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: FIFA Clearing House, Service Fee Caps & Financial Regulations',
    doc_title: 'FIFA Football Agent Official Study Materials & Regulatory Guidelines',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'Service fee caps (3% / 5% / 10%), calculation of Remuneration, FIFA Clearing House payment routing, and Training Rewards distribution (Solidarity Mechanism & Training Compensation).',
    tips: 'Service fee cap on Player Remuneration above USD 200,000 is 3% (or 6% if dual-representing Player + Engaging Club). Cap on Transfer Compensation for Releasing Club is 10%.',
    body: `# FIFA Football Agent Domain 4: Clearing House & Service Fee Caps

## 4.1 The Service Fee Cap Architecture (FFAR Article 13)
To ensure financial transparency and prevent excessive speculation, FIFA limits agent service fees:

\`\`\`
+-------------------------------------------------------------------------+
|                     FIFA AGENT SERVICE FEE CAPS MATRIX                  |
|                                                                         |
|  Client Represented        Individual Remuneration   Service Fee Cap    |
|  ------------------        -----------------------   ---------------    |
|  Player / Coach            Up to USD 200,000/yr      5% of Remuneration |
|  Player / Coach            Above USD 200,000/yr      3% of Remuneration |
|  Dual (Player + Buyer)     Up to USD 200,000/yr      10% of Remuneration|
|  Dual (Player + Buyer)     Above USD 200,000/yr      6% of Remuneration |
|  Releasing Entity (Seller) Any Amount                10% of Transfer Fee|
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 The FIFA Clearing House (FCH)
The FIFA Clearing House in Paris is an independent payment institution licensed by the French financial regulator (ACPR):
- Routes all training rewards (Training Compensation & Solidarity Mechanism) and agent service fees.
- Executes mandatory AML/CFT (Anti-Money Laundering & Counter-Terrorist Financing) checks before funds disbursement.`
  }
];

async function enrichGrcFifaChapters() {
  await client.connect();
  console.log('=== ENRICHING GRC & FIFA FOOTBALL AGENT STUDY MATERIALS ===\n');

  for (const item of GRC_FIFA_CHAPTERS) {
    const domRes = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [item.cert_id, item.dom_num]);
    if (domRes.rows.length === 0) continue;
    const domainId = domRes.rows[0].id;

    const existing = await client.query(
      'SELECT id FROM study_materials WHERE certification_id = $1 AND (title = $2 OR (chapter_number = $3 AND domain_id = $4)) LIMIT 1',
      [item.cert_id, item.title, item.ch_num, domainId]
    );

    if (existing.rows.length > 0) {
      await client.query(`
        UPDATE study_materials
        SET title = $1, content_body = $2, estimated_read_minutes = $3,
            key_takeaways = $4, exam_tips = $5, document_title = $6,
            edition = $7, chapter_number = $8, sort_order = $9, domain_id = $10
        WHERE id = $11;
      `, [
        item.title, item.body, item.read_min, item.takeaways, item.tips,
        item.doc_title, item.edition, item.ch_num, item.sort_order, domainId,
        existing.rows[0].id
      ]);
      console.log(`[UPDATED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    } else {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, title, content_type,
          content_body, sort_order, document_title, edition, chapter_number,
          estimated_read_minutes, key_takeaways, exam_tips
        ) VALUES (gen_random_uuid(), $1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        item.cert_id, domainId, item.title, item.body, item.sort_order,
        item.doc_title, item.edition, item.ch_num, item.read_min, item.takeaways, item.tips
      ]);
      console.log(`[INSERTED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    }
  }

  console.log('\n✅ GRC & FIFA Study Materials successfully enriched to deep textbook grade!');
  await client.end();
}

enrichGrcFifaChapters().catch(console.error);
