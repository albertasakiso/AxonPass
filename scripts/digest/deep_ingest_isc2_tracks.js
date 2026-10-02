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

const ISC2_TRACKS = [
  // =========================================================================
  // CCSP — 6 DOMAINS
  // =========================================================================
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 1,
    title: 'Domain 1: Cloud Concepts, Architecture & Design',
    documentTitle: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'NIST SP 800-145 definitions, Shared Responsibility across IaaS/PaaS/SaaS, CSA CCM, and Cloud Security Design Principles.',
    examTips: 'In IaaS, customer owns OS to apps. In SaaS, customer owns data and IAM only.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 1: Cloud Concepts, Architecture and Design

Cloud architecture establishes security parameters across multi-tenant virtualized environments based on NIST SP 800-145 and CSA reference models.

---

## 1.1 Shared Responsibility Model Breakdown

\`\`\`
┌──────────────────┬──────────────┬──────────────┬──────────────┐
│ RESPONSIBILITY   │    IaaS      │    PaaS      │    SaaS      │
├──────────────────┼──────────────┼──────────────┼──────────────┤
│ Data & Access    │   CUSTOMER   │   CUSTOMER   │   CUSTOMER   │
│ Applications     │   CUSTOMER   │   CUSTOMER   │     CSP      │
│ Middleware / OS  │   CUSTOMER   │     CSP      │     CSP      │
│ Virtualization   │     CSP      │     CSP      │     CSP      │
│ Physical & Net   │     CSP      │     CSP      │     CSP      │
└──────────────────┴──────────────┴──────────────┴──────────────┘
\`\`\``
  },
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 2,
    title: 'Domain 2: Cloud Data Security & Lifecycle Governance',
    documentTitle: 'ISC2 CCSP Official Study Guide & Cloud Data Governance',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'CSUAD Data Lifecycle (Create, Store, Use, Share, Archive, Destroy), Envelope Encryption, Cloud HSM/BYOK/HYOK, and DLP.',
    examTips: 'Envelope encryption encrypts DEK with KEK. HYOK keeps root keys on-premises, preventing CSP access to plaintext.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 2: Cloud Data Security

Managing the cloud data lifecycle (Create, Store, Use, Share, Archive, Destroy) ensures data confidentiality, integrity, and regulatory sovereignty.

---

## 2.1 Envelope Encryption Architecture

$$\\text{Plaintext} + \\text{Data Encryption Key (DEK)} \\longrightarrow \\text{Ciphertext}$$

$$\\text{DEK} + \\text{Key Encryption Key (KEK in HSM)} \\longrightarrow \\text{Encrypted DEK (Wrapped Key)}$$`
  },
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 3,
    title: 'Domain 3: Cloud Platform & Infrastructure Security',
    documentTitle: 'ISC2 CCSP Official Study Guide & Virtualization Security',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Type 1 vs Type 2 Hypervisors, VM Escape defense, Container isolation, Micro-segmentation, and Multi-region BC/DR.',
    examTips: 'Type 1 hypervisors run directly on bare metal. VM escape is mitigated through patched hypervisors and minimal guest privileges.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 3: Cloud Platform & Infrastructure Security

Protecting cloud compute, hypervisors, orchestrators, and software-defined networks from multi-tenant side-channel attacks.`
  },
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 4,
    title: 'Domain 4: Cloud Application Security & IAM Federation',
    documentTitle: 'ISC2 CCSP Official Study Guide & Secure Cloud SDLC',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Cloud SDLC, OWASP Top 10, Federated IAM (SAML 2.0, OAuth 2.0, OpenID Connect, SCIM), and SAST/DAST/RASP.',
    examTips: 'SAML is for enterprise Web SSO assertions. OAuth 2.0 is for delegated API authorization. SCIM is for user identity provisioning.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 4: Cloud Application Security

Securing cloud-native software architectures, REST APIs, microservices, and implementing cross-domain federated identity management.`
  },
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 5,
    title: 'Domain 5: Cloud Security Operations & Digital Forensics',
    documentTitle: 'ISC2 CCSP Official Study Guide & Cloud SecOps',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 5',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Cloud SIEM/SOAR, immutable audit logs (CloudTrail), digital forensics in multi-tenant environments, and automated patching.',
    examTips: 'Direct physical RAM scraping is prohibited in public cloud. Forensics relies on API snapshot imaging and cloud telemetry.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 5: Cloud Security Operations

Continuous security monitoring, telemetry aggregation, vulnerability management, and incident forensics across distributed cloud workloads.`
  },
  {
    certSlug: 'ccsp',
    certId: 'a0000000-0000-0000-0000-000000000011',
    chapterNumber: 6,
    title: 'Domain 6: Legal, Risk, Compliance & Assurance (SOC / CSA STAR)',
    documentTitle: 'ISC2 CCSP Official Study Guide & Cloud Compliance',
    edition: '3rd Edition Official',
    sectionNumber: 'Domain 6',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Data sovereignty, GDPR, CLOUD Act, SOC 1/2/3 Type II reports, CSA STAR levels, ISO 27017, and ISO 27018.',
    examTips: 'SOC 2 Type II evaluates control operating effectiveness over a minimum 6-month period. SOC 3 is for public marketing distribution.',
    fileReference: 'my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf',
    contentMarkdown: `# Domain 6: Legal, Risk and Compliance

Navigating international jurisdictional boundaries, data residency laws (Schrems II, GDPR), and evaluating independent CSP audit attestations.`
  }
];

async function ingestISC2Tracks() {
  await client.connect();
  console.log('=== DEEP INGESTION: ISC2 TRACKS (CCSP & CISSP ENRICHMENT) ===\n');

  for (const mod of ISC2_TRACKS) {
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
  console.log('\n=== ISC2 TRACKS DEEP INGESTION COMPLETE! ===\n');
}

ingestISC2Tracks().catch(console.error);
