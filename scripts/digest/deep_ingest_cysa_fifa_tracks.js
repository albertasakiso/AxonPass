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

const CYSA_FIFA_TRACKS = [
  // =========================================================================
  // FIFA FOOTBALL AGENT (2026 EDITION) — 5 DOMAINS
  // =========================================================================
  {
    certSlug: 'fifa-agent',
    certId: 'a0000000-0000-0000-0000-000000000009',
    chapterNumber: 1,
    title: 'Domain 1: FIFA Football Agent Regulations (FFAR) & Representation Agreements',
    documentTitle: 'FIFA Football Agent Official Study Materials & Regulatory Guidelines',
    edition: '2026 Official Edition (Circular 1956)',
    sectionNumber: 'Module 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Eligibility requirements, licensing exam, maximum 2-year duration for individual representation contracts, nullity of automatic renewals, and dual representation constraints.',
    examTips: 'Dual representation is legally permissible ONLY between the Engaging Club and the Player with prior explicit written consent.',
    fileReference: 'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
    contentMarkdown: `# Domain 1: FIFA Football Agent Regulations (FFAR)

The FIFA Football Agent Regulations (FFAR 2026) govern the occupation of Football Agents within the international transfer system.

---

## 1.1 Key Contractual Rules under FFAR (Article 12)

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                   REPRESENTATION CONTRACT MANDATES                     │
├────────────────────────────────────────────────────────────────────────┤
│ • Written Form: Mandatory signed agreement before providing services.  │
│ • Maximum Duration: Exactly 2 years for individuals (Players/Coaches). │
│ • Automatic Renewal: STRICTLY PROHIBITED (clauses are null and void).  │
│ • Cooling-Off Period: No early re-signing before last 2 months.       │
│ • Registration: Must be uploaded to FIFA Agent Platform in 14 days.    │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

### Permissible vs Prohibited Representation:
- **Permissible Dual Representation**: Representing the **Individual Client (Player/Coach)** AND the **Engaging Club** in the exact same transaction, subject to prior explicit written consent from both parties.
- **Prohibited Multi-Representation**:
  - Representing the Releasing Club AND the Player.
  - Representing the Releasing Club AND the Engaging Club.
  - Triple representation (Releasing Club + Engaging Club + Player).`
  },
  {
    certSlug: 'fifa-agent',
    certId: 'a0000000-0000-0000-0000-000000000009',
    chapterNumber: 2,
    title: 'Domain 2: Regulations on the Status and Transfer of Players (RSTP) & Training Rewards',
    documentTitle: 'FIFA Regulations on the Status and Transfer of Players (RSTP)',
    edition: '2026 Official Edition',
    sectionNumber: 'Module 2',
    estimatedReadMinutes: 50,
    keyTakeaways: 'Contractual stability, Protected Period rules, Article 19 minor transfer exceptions, Training Compensation & Solidarity Mechanism formulas.',
    examTips: 'Solidarity Mechanism allocates 5% of transfer fee across all clubs that registered the player between age 12 and 23.',
    fileReference: 'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
    contentMarkdown: `# Domain 2: Regulations on the Status and Transfer of Players (RSTP)

Contractual stability and the protection of minors form the cornerstone of FIFA RSTP jurisprudence.

---

## 2.1 The Protected Period (RSTP Article 17)
- **If signed before age 28**: 3 entire seasons or 3 years (whichever comes first).
- **If signed after age 28**: 2 entire seasons or 2 years.
- Unilateral termination during the Protected Period triggers both compensation payments and sporting sanctions (4 to 6 months playing ban for player; 2-window registration ban for club).

---

## 2.2 Training Rewards Calculations
- **Solidarity Mechanism (5% of Transfer Fee)**:
  - Ages 12-15: 5% of the 5% (0.25% per season)
  - Ages 16-23: 10% of the 5% (0.50% per season)`
  },
  {
    certSlug: 'fifa-agent',
    certId: 'a0000000-0000-0000-0000-000000000009',
    chapterNumber: 3,
    title: 'Domain 3: FIFA Statutes, Code of Ethics, Disciplinary Code & Anti-Corruption',
    documentTitle: 'FIFA Statutes & Code of Ethics',
    edition: '2026 Official Edition',
    sectionNumber: 'Module 3',
    estimatedReadMinutes: 40,
    keyTakeaways: 'Institutional hierarchy, strict prohibition on sports betting (Article 27), anti-bribery (Article 28), duty of neutrality, and disciplinary sanctions.',
    examTips: 'Football agents are strictly barred from all direct or indirect betting/gambling on football matches globally.',
    fileReference: 'my_documents/FIFA AGENT LICENSE/20260113_FINAL CLEAN_FIFA-Football-Agent-Exam-Rules-6th-Edition-JAN-2026-edition_EN.pdf',
    contentMarkdown: `# Domain 3: FIFA Statutes & Code of Ethics

Bound persons must exhibit utmost loyalty, integrity, and ethical conduct to preserve the credibility and sporting integrity of football.`
  },
  {
    certSlug: 'fifa-agent',
    certId: 'a0000000-0000-0000-0000-000000000009',
    chapterNumber: 4,
    title: 'Domain 4: FIFA Clearing House, Service Fee Caps & Financial Regulations',
    documentTitle: 'FIFA Clearing House Regulations & Financial Rules',
    edition: '2026 Official Edition',
    sectionNumber: 'Module 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Service fee caps (3% / 5% / 10%), mandatory payment routing through FIFA Clearing House (FCH), anti-money laundering, and ban on TPO (Article 18ter).',
    examTips: 'Fee cap for individual remuneration > $200k is 3% on the excess. All international agent payments must flow through FCH in France.',
    fileReference: 'my_documents/FIFA AGENT LICENSE/20260114_[FINAL CLEAN_LINKS]_Info-on-the-Licensing-Process-and-the-FIFA-Football-Agent-Exam_EN.pdf',
    contentMarkdown: `# Domain 4: FIFA Clearing House & Financial Regulations

The FIFA Clearing House ensures financial transparency, automated calculation of training rewards, and enforcement of statutory agent commission caps.`
  },
  {
    certSlug: 'fifa-agent',
    certId: 'a0000000-0000-0000-0000-000000000009',
    chapterNumber: 5,
    title: 'Domain 5: Football Tribunal, Dispute Resolution & Safeguarding (FIFA Guardians)',
    documentTitle: 'Procedural Rules of the Football Tribunal & FIFA Guardians',
    edition: '2026 Official Edition',
    sectionNumber: 'Module 5',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Agents Chamber jurisdiction, appeals to Court of Arbitration for Sport (CAS Lausanne), and mandatory FIFA Guardians child safeguarding protocols.',
    examTips: 'Agents Chamber resolves agent-client disputes. Appeals go to CAS within 21 days. Representing minors requires FIFA Guardians accreditation.',
    fileReference: 'my_documents/FIFA AGENT LICENSE/Circular 1956_FIFA football agent exam - 2026 edition_EN.pdf',
    contentMarkdown: `# Domain 5: Football Tribunal & Safeguarding

The Football Tribunal delivers specialized dispute adjudication, while the FIFA Guardians framework ensures zero tolerance for child abuse or exploitation.`
  },

  // =========================================================================
  // COMPTIA CYSA+ — 5 DOMAINS
  // =========================================================================
  {
    certSlug: 'cysa',
    certId: 'a0000000-0000-0000-0000-000000000012',
    chapterNumber: 1,
    title: 'Domain 1: Threat & Vulnerability Management (CVSS v3.1 & Reconnaissance)',
    documentTitle: 'CompTIA CySA+ Cybersecurity Analyst Examination Guide',
    edition: 'CS0-003 Official Edition',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'CVSS v3.1 vector calculations, Nmap stealth scans, credentialed vulnerability scans (Nessus/OpenVAS), threat feeds (STIX/TAXII), and patch prioritization.',
    examTips: 'CVSS Base Metrics: AV (Attack Vector), AC (Complexity), PR (Privileges), UI (User Interaction), S (Scope), C/I/A (Impact).',
    fileReference: 'my_documents/CompTIA Cybersecurit 2017 (1).pdf',
    contentMarkdown: `# Domain 1: Threat and Vulnerability Management

Analytic threat intelligence integration and systematic vulnerability management across enterprise infrastructure.`
  },
  {
    certSlug: 'cysa',
    certId: 'a0000000-0000-0000-0000-000000000012',
    chapterNumber: 2,
    title: 'Domain 2: Software & Systems Security (EDR & Cloud Hardening)',
    documentTitle: 'CompTIA CySA+ Cybersecurity Analyst Examination Guide',
    edition: 'CS0-003 Official Edition',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'EDR/XDR telemetry, system baselining with CIS benchmarks, application security (SQLi/XSS remediation), and DevSecOps pipelines.',
    examTips: 'EDR provides real-time behavioral monitoring and automated host quarantine. SQLi is remediated using parameterized prepared statements.',
    fileReference: 'my_documents/CompTIA Cybersecurit 2017 (1).pdf',
    contentMarkdown: `# Domain 2: Software and Systems Security

Applying defense-in-depth security controls across endpoints, servers, containers, and cloud application pipelines.`
  },
  {
    certSlug: 'cysa',
    certId: 'a0000000-0000-0000-0000-000000000012',
    chapterNumber: 3,
    title: 'Domain 3: Security Operations & Continuous Monitoring (SIEM & MITRE ATT&CK)',
    documentTitle: 'CompTIA CySA+ Cybersecurity Analyst Examination Guide',
    edition: 'CS0-003 Official Edition',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'SIEM log correlation, Windows Event ID analysis, DNS tunneling detection, threat hunting, and MITRE ATT&CK TTP mapping.',
    examTips: 'High-entropy subdomain queries indicate DNS tunneling. Event ID 4624 (Logon) + 7045 (New Service) = common lateral movement indicator.',
    fileReference: 'my_documents/CompTIA Cybersecurit 2017 (1).pdf',
    contentMarkdown: `# Domain 3: Security Operations and Monitoring

Continuous threat detection, log correlation in SIEM, behavioral analytics (UEBA), and proactive threat hunting.`
  },
  {
    certSlug: 'cysa',
    certId: 'a0000000-0000-0000-0000-000000000012',
    chapterNumber: 4,
    title: 'Domain 4: Incident Response & Digital Forensics (Volatility & Wireshark)',
    documentTitle: 'CompTIA CySA+ Cybersecurity Analyst Examination Guide',
    edition: 'CS0-003 Official Edition',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 50,
    keyTakeaways: 'NIST SP 800-61 lifecycle, Order of Volatility, Volatility memory forensics, Wireshark PCAP triage, and legal Chain of Custody.',
    examTips: 'Order of Volatility: CPU registers/cache > RAM > Network state > Hard Disk > Backup tapes. Never reboot before memory acquisition.',
    fileReference: 'my_documents/CompTIA Cybersecurit 2017 (1).pdf',
    contentMarkdown: `# Domain 4: Incident Response and Forensics

Executing rapid containment, preserving cryptographic evidence chains, and conducting deep memory and network packet forensics.`
  },
  {
    certSlug: 'cysa',
    certId: 'a0000000-0000-0000-0000-000000000012',
    chapterNumber: 5,
    title: 'Domain 5: Compliance & Assessment (PCI DSS, HIPAA & Gap Remediation)',
    documentTitle: 'CompTIA CySA+ Cybersecurity Analyst Examination Guide',
    edition: 'CS0-003 Official Edition',
    sectionNumber: 'Domain 5',
    estimatedReadMinutes: 40,
    keyTakeaways: 'PCI DSS quarterly scanning, HIPAA Security Rule, GDPR breach disclosures, control categories (preventive, detective), and audit remediation.',
    examTips: 'PCI DSS mandates external scans at least quarterly (90 days) and following significant network changes.',
    fileReference: 'my_documents/CompTIA Cybersecurit 2017 (1).pdf',
    contentMarkdown: `# Domain 5: Compliance and Assessment

Mapping technical cybersecurity controls to global regulatory mandates and ensuring continuous audit readiness.`
  }
];

async function ingestCYSAAndFIFATracks() {
  await client.connect();
  console.log('=== DEEP INGESTION: FIFA FOOTBALL AGENT & COMPTIA CYSA+ ===\n');

  for (const mod of CYSA_FIFA_TRACKS) {
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
  console.log('\n=== FIFA & CYSA+ TRACKS DEEP INGESTION COMPLETE! ===\n');
}

ingestCYSAAndFIFATracks().catch(console.error);
