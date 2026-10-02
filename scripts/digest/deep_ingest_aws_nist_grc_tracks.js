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

const REMAINING_TRACKS = [
  // =========================================================================
  // AWS SAA-C03 — 4 DOMAINS
  // =========================================================================
  {
    certSlug: 'aws-csaa',
    certId: 'a0000000-0000-0000-0000-000000000003',
    chapterNumber: 1,
    title: 'Domain 1: Design Secure Architectures (IAM, KMS, VPC & WAF)',
    documentTitle: 'AWS Certified Solutions Architect Associate (SAA-C03) Guide',
    edition: 'SAA-C03 Official Edition',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'IAM policies (Least Privilege, Role Delegation), AWS KMS Envelope Encryption, VPC Security Groups vs Network ACLs, and AWS Shield/WAF DDoS protection.',
    examTips: 'Security Groups are stateful (inbound allows return outbound automatically). NACLs are stateless (must explicitly allow return traffic).',
    fileReference: 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/README.md',
    contentMarkdown: `# Domain 1: Design Secure Cloud Architectures

Securing AWS workloads through identity boundaries, KMS encryption, isolated VPC topologies, and edge protection.

---

## 1.1 VPC Security Group vs Network ACL (NACL)

| Feature | Security Group | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operates At** | Instance / ENI Level | Subnet Level |
| **State** | **Stateful** (Return traffic allowed) | **Stateless** (Return traffic must be allowed) |
| **Rule Types** | **ALLOW rules only** | **ALLOW and DENY rules** |
| **Evaluation** | All rules evaluated before decision | Evaluated in sequential number order |`
  },
  {
    certSlug: 'aws-csaa',
    certId: 'a0000000-0000-0000-0000-000000000003',
    chapterNumber: 2,
    title: 'Domain 2: Design Resilient Architectures (Multi-AZ, ALB & Disaster Recovery)',
    documentTitle: 'AWS Disaster Recovery Whitepaper & Well-Architected Framework',
    edition: 'SAA-C03 Official Edition',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Multi-AZ high availability, Auto Scaling Groups, Amazon Aurora Global Database, and the 4 DR strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Region Active-Active).',
    examTips: 'Multi-AZ is for High Availability (synchronous within a Region). Multi-Region is for Disaster Recovery (asynchronous cross-region).',
    fileReference: 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/README.md',
    contentMarkdown: `# Domain 2: Design Resilient Architectures

Building fault-tolerant cloud systems designed to withstand availability zone and regional disruptions.

---

## 2.1 The 4 Disaster Recovery Strategies

\`\`\`
RTO / RPO:    Hours                 Tens of Minutes           Minutes               Real-Time
Cost:         $                     $$                        $$$                   $$$$
Strategies: [Backup & Restore] ──► [Pilot Light] ───────► [Warm Standby] ─────► [Multi-Region Active-Active]
\`\`\``
  },
  {
    certSlug: 'aws-csaa',
    certId: 'a0000000-0000-0000-0000-000000000003',
    chapterNumber: 3,
    title: 'Domain 3: Design High-Performing Architectures (Compute, Storage & Caching)',
    documentTitle: 'AWS Well-Architected Framework: Performance Efficiency Pillar',
    edition: 'SAA-C03 Official Edition',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'EC2 instance families, Lambda serverless scaling, EBS (gp3/io2), EFS shared POSIX storage, S3 performance (Prefix hashing), and ElastiCache Redis.',
    examTips: 'EBS is block storage locked to 1 AZ. EFS is shared file storage across multiple AZs. S3 is global HTTP/REST object storage.',
    fileReference: 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/README.md',
    contentMarkdown: `# Domain 3: Design High-Performing Architectures

Selecting optimal storage tiers, caching layers, and compute engines to deliver low latency and high throughput.`
  },
  {
    certSlug: 'aws-csaa',
    certId: 'a0000000-0000-0000-0000-000000000003',
    chapterNumber: 4,
    title: 'Domain 4: Design Cost-Optimized Architectures (S3 Lifecycle & Spot Instances)',
    documentTitle: 'AWS Well-Architected Framework: Cost Optimization Pillar',
    edition: 'SAA-C03 Official Edition',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 40,
    keyTakeaways: 'S3 storage lifecycle transitions, S3 Intelligent-Tiering, EC2 Spot instances (up to 90% savings), Savings Plans, and AWS Cost Explorer.',
    examTips: 'Spot instances are ideal for fault-tolerant, stateless batch workloads. S3 Glacier Deep Archive is lowest cost for multi-year retention.',
    fileReference: 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/README.md',
    contentMarkdown: `# Domain 4: Design Cost-Optimized Architectures

Maximizing business value by eliminating idle capacity, optimizing storage lifecycle tiers, and utilizing dynamic pricing models.`
  },

  // =========================================================================
  // GRC — 4 DOMAINS
  // =========================================================================
  {
    certSlug: 'grc',
    certId: 'a0000000-0000-0000-0000-000000000008',
    chapterNumber: 1,
    title: 'Domain 1: Corporate Governance, Ethics & Strategic Alignment',
    documentTitle: 'Enterprise GRC Professional Body of Knowledge (OCEG & ISO 37000)',
    edition: '1st Edition Official',
    sectionNumber: 'Domain 1',
    estimatedReadMinutes: 45,
    keyTakeaways: 'OCEG Red Book GRC Capability Model, Learn-Align-Perform-Review (LAPR), Board fiduciary duty, stakeholder governance, and codes of conduct.',
    examTips: 'Principled Performance is the OCEG core objective: reliably achieving objectives while addressing uncertainty and acting with integrity.',
    fileReference: 'my_documents/grc1.pdf',
    contentMarkdown: `# Domain 1: Corporate Governance and Ethics

Governance establishes the accountability, strategic direction, and ethical boundaries for principled enterprise performance.`
  },
  {
    certSlug: 'grc',
    certId: 'a0000000-0000-0000-0000-000000000008',
    chapterNumber: 2,
    title: 'Domain 2: Enterprise Risk Management Frameworks (COSO ERM & ISO 31000)',
    documentTitle: 'Enterprise GRC Professional Body of Knowledge & ISO 31000',
    edition: '1st Edition Official',
    sectionNumber: 'Domain 2',
    estimatedReadMinutes: 45,
    keyTakeaways: 'ISO 31000 Risk Management principles, COSO ERM 5 components, risk identification, Monte Carlo modeling, and risk treatment prioritization.',
    examTips: 'ISO 31000 defines risk as the "effect of uncertainty on objectives." Risk encompasses both threats (downside) and opportunities (upside).',
    fileReference: 'my_documents/grc2.pdf',
    contentMarkdown: `# Domain 2: Enterprise Risk Management

Systematic risk identification, quantification, and treatment aligned with COSO ERM and ISO 31000.`
  },
  {
    certSlug: 'grc',
    certId: 'a0000000-0000-0000-0000-000000000008',
    chapterNumber: 3,
    title: 'Domain 3: Regulatory Compliance, Auditing & Legal Obligations',
    documentTitle: 'Enterprise GRC Professional Body of Knowledge & Compliance',
    edition: '1st Edition Official',
    sectionNumber: 'Domain 3',
    estimatedReadMinutes: 45,
    keyTakeaways: 'Compliance management systems (ISO 37301), regulatory tracking, whistleblowing mechanisms, audit independence, and enforcement.',
    examTips: 'Compliance culture requires active tone at the top, non-retaliation whistleblower protections, and regular compliance audits.',
    fileReference: 'my_documents/rsk1.pdf',
    contentMarkdown: `# Domain 3: Regulatory Compliance and Auditing

Establishing a comprehensive compliance management system that guarantees adherence to statutory, regulatory, and contractual obligations.`
  },
  {
    certSlug: 'grc',
    certId: 'a0000000-0000-0000-0000-000000000008',
    chapterNumber: 4,
    title: 'Domain 4: Internal Controls, Assurance & Continuous Monitoring',
    documentTitle: 'Enterprise GRC Professional Body of Knowledge & COSO Internal Control',
    edition: '1st Edition Official',
    sectionNumber: 'Domain 4',
    estimatedReadMinutes: 45,
    keyTakeaways: 'COSO 5 components & 17 principles, Three Lines Model, control design vs operating effectiveness, and continuous audit analytics.',
    examTips: 'Control operating effectiveness must be tested across a representative sample over the full audit period.',
    fileReference: 'my_documents/iso_guide_73-2009-(Terminology).pdf',
    contentMarkdown: `# Domain 4: Internal Controls and Assurance

Designing, testing, and continuously monitoring internal control frameworks to ensure operational efficacy and audit assurance.`
  }
];

async function ingestRemainingTracks() {
  await client.connect();
  console.log('=== DEEP INGESTION: AWS SAA-C03 & GRC TRACKS ===\n');

  for (const mod of REMAINING_TRACKS) {
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
  console.log('\n=== AWS & GRC TRACKS DEEP INGESTION COMPLETE! ===\n');
}

ingestRemainingTracks().catch(console.error);
