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
  const match = envContent.match(/postgresql:\/\/[^\s"']+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const cisaId = 'a0000000-0000-0000-0000-000000000001';

async function seedGapAnalysis() {
  await client.connect();
  console.log('Connected to DB. Seeding CISA 27th vs 28th Gap Analysis Study Materials...');

  // Fetch domain 1 id for linking
  const { rows: domRows } = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = 1', [cisaId]);
  const dom1Id = domRows[0]?.id;

  const gapContent = `## Executive Overview: CISA 28th Edition (2024) vs 27th Edition (2019)

ISACA significantly overhauled the Certified Information Systems Auditor (CISA®) Job Practice blueprint to align with the modern technological threat landscape. As cyber threats, cloud migrations, and artificial intelligence accelerate, the 28th Edition introduces essential new domains, modules, and auditor competencies.

---

### 1. Domain Weighting Comparison & Examination Matrix

| Domain | Focus Area | 27th Edition (2019) | 28th Edition (2024) | Exam Shift & Significance |
|---|---|:---:|:---:|---|
| **Domain 1** | Information System Auditing Process | **21%** (31 Qs) | **18%** (27 Qs) | -3% (Shifted toward Operations & Resilience) |
| **Domain 2** | Governance and Management of IT | **17%** (25 Qs) | **18%** (27 Qs) | +1% (Expanded Data Privacy & ERM) |
| **Domain 3** | IS Acquisition, Development & Implementation | **12%** (18 Qs) | **12%** (18 Qs) | Maintained (Integrated DevSecOps & CI/CD) |
| **Domain 4** | IS Operations and Business Resilience | **20%** (30 Qs) | **26%** (39 Qs) | **+6% (LARGEST EXPANSION: Shadow IT, Cloud HA, 3-2-1 Backups)** |
| **Domain 5** | Protection of Information Assets | **30%** (45 Qs) | **26%** (39 Qs) | -4% (Refocused on Zero Trust, EDR/XDR, SOAR) |
| **Total** | **150 Questions / 4 Hours** | **100%** | **100%** | **Passing Score: 450 / 800 Scaled Score** |

---

### 2. Major New Modules & Technological Additions in 28th Edition

#### A. Artificial Intelligence & Machine Learning in Audit (Section 1.8.4)
- **What Changed**: Version 27 treated CAATs primarily as basic Generalized Audit Software (GAS) queries (e.g., ACL/IDEA). Version 28 introduces formal requirements for auditing AI models and utilizing ML in continuous audit workflows.
- **Key Concepts**: Audit Algorithms, Algorithmic Bias detection, Model Explainability/Interpretability, Training Data Integrity, and AI Governance Risk.
- **Auditor Takeaway**: Auditors must be prepared to audit automated decision-making engines and evaluate AI risk governance frameworks (e.g., NIST AI RMF).

#### B. Agile Auditing Methodologies (Section 1.5.6)
- **What Changed**: Replaces traditional multi-month rigid waterfall audit engagements with timeboxed 2-week sprints.
- **Key Concepts**: Dynamic risk backlogs, continuous client feedback, daily standups, and incremental assurance reporting.

#### C. Shadow IT & End-User Computing (EUC) Governance (Section 4.5)
- **What Changed**: Version 28 gives dedicated attention to the proliferation of unsanctioned SaaS tools, citizen development (low-code/no-code), and ungoverned spreadsheets.
- **Auditor Takeaway**: The auditor must verify discovery mechanisms (CASB, DNS analytics) and review controls over business-critical EUC models used in financial reporting.

#### D. Zero Trust Architecture (ZTA) & PAM (Section 5.3.3 & 5.3.4)
- **What Changed**: Shifted away from obsolete "perimeter-based castle-and-moat" security models to NIST SP 800-207 Zero Trust ("Never Trust, Always Verify").
- **Key Concepts**: Continuous per-session authentication, Just-In-Time (JIT) privileged access elevation, credential vaulting, and microsegmentation.

#### E. DevSecOps & Shift-Left CI/CD Pipeline Security (Section 3.3.5 & 5.8.10)
- **What Changed**: Integrates automated security scanning (SAST, DAST, SCA) directly into developer pipelines rather than treating security testing as an afterthought at end of SDLC.

#### F. Advanced Threat Detection & Response (Section 5.4.15 & 5.14.4)
- **What Changed**: Traditional signature antivirus and manual incident ticketing are replaced with **Endpoint Detection & Response (EDR/XDR)** and **Security Orchestration, Automation, and Response (SOAR)** automated playbooks.

#### G. Modern Cyber Resilience & 3-2-1 Backup Strategy (Section 4.14.3)
- **What Changed**: Introduces 3-2-1 backup requirements with immutable (WORM) and air-gapped protection specifically designed to resist enterprise-wide ransomware extortion.

---

### 3. Summary of Retired & Restructured Content
- Outdated legacy protocols (e.g., WEP, Telnet, DES, basic symmetric dial-up RAS) have been de-emphasized.
- The 2020 IIA/ISACA **Three Lines Model** officially replaces the "Three Lines of Defense" nomenclature.
- ITAF 4th Edition standards and guidelines are fully integrated across all audit execution modules.`;

  // Check if study material for gap analysis exists
  const { rows: existingMat } = await client.query(
    'SELECT id FROM study_materials WHERE certification_id = $1 AND chapter_number = 0',
    [cisaId]
  );

  if (existingMat.length > 0) {
    await client.query(
      `UPDATE study_materials SET
        title = $1,
        content_body = $2,
        key_takeaways = $3,
        exam_tips = $4,
        estimated_read_minutes = $5,
        sort_order = 0
       WHERE id = $6`,
      [
        'Chapter 0: CISA 28th vs 27th Edition Comprehensive Gap Analysis & Syllabus Matrix',
        gapContent,
        'Domain 4 increased to 26% (+6%). New 28th edition core topics: AI in Audit, Zero Trust, DevSecOps, Shadow IT/EUC, SOAR, EDR/XDR, and 3-2-1 Immutable Backups.',
        'Always look for modern ISACA terminology on the exam: Three Lines Model (not Three Lines of Defense), Zero Trust (not Perimeter Security), and DevSecOps automated gates.',
        25,
        existingMat[0].id
      ]
    );
  } else {
    await client.query(
      `INSERT INTO study_materials (
        id, certification_id, domain_id, title, content_type, content_body,
        chapter_number, section_number, estimated_read_minutes, key_takeaways,
        exam_tips, sort_order, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, 'text', $4,
        0, 'Gap Analysis', 25, $5,
        $6, 0, NOW()
      )`,
      [
        cisaId,
        dom1Id,
        'Chapter 0: CISA 28th vs 27th Edition Comprehensive Gap Analysis & Syllabus Matrix',
        gapContent,
        'Domain 4 increased to 26% (+6%). New 28th edition core topics: AI in Audit, Zero Trust, DevSecOps, Shadow IT/EUC, SOAR, EDR/XDR, and 3-2-1 Immutable Backups.',
        'Always look for modern ISACA terminology on the exam: Three Lines Model (not Three Lines of Defense), Zero Trust (not Perimeter Security), and DevSecOps automated gates.'
      ]
    );
  }

  console.log('Successfully seeded CISA Gap Analysis Study Material!');
  await client.end();
}

seedGapAnalysis().catch(err => {
  console.error(err);
  process.exit(1);
});
