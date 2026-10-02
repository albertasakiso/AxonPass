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

const CERT_IDS = {
  cisa: 'a0000000-0000-0000-0000-000000000001',
  'isc2-cc': 'a0000000-0000-0000-0000-000000000002',
  'aws-csaa': 'a0000000-0000-0000-0000-000000000003',
  'nist-grc': 'a0000000-0000-0000-0000-000000000004'
};

const EXPANDED_MANUALS = [
  // =========================================================================
  // ISC2 CERTIFIED IN CYBERSECURITY (CC) — CHAPTERS 1 TO 5
  // =========================================================================
  {
    certSlug: 'isc2-cc',
    domainNum: 2,
    docTitle: 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
    edition: 'Official 1st Edition',
    chapterNumber: 2,
    sectionNumber: 'Module 2',
    title: 'Chapter 2: Incident Response, BCP & DRP Concepts',
    pageStart: 46,
    pageEnd: 90,
    estimatedReadMinutes: 30,
    fileRef: 'Chapter - 2.pdf',
    keyTakeaways: 'Incident Response Lifecycle (Preparation, Detection/Analysis, Containment, Eradication, Recovery, Lessons Learned), CSIRT roles, and BCP/DRP testing.',
    examTips: 'Human safety is always #1. Containment isolates systems to prevent lateral movement. Lessons Learned prevents recurrence.',
    contentMarkdown: `# Chapter 2: Incident Response, BCP & DRP Concepts

Organizations must maintain systematic procedures to respond to incidents and recover from disasters.

---

## 2.1 The Incident Response Lifecycle
1. **Preparation**: Forming the CSIRT team, creating incident response playbooks, and deploying monitoring tools.
2. **Detection & Analysis**: Identifying security anomalies using SIEM alerts, IDS logs, and determining attack scope.
3. **Containment**: Isolating compromised endpoints, network segments, or user accounts to prevent lateral movement.
4. **Eradication**: Removing malware, backdoors, and remediating exploited vulnerabilities.
5. **Recovery**: Restoring clean systems from known-good backups and returning to full production under close monitoring.
6. **Post-Incident Activity (Lessons Learned)**: Conducting retrospectives to improve defenses and documentation.

---

## 2.2 Business Continuity & Disaster Recovery
- **BCP**: Sustains ongoing business operations and customer commitments during a disruption.
- **DRP**: Restores the underlying technology, infrastructure, networks, and databases following an emergency.`
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 3,
    docTitle: 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
    edition: 'Official 1st Edition',
    chapterNumber: 3,
    sectionNumber: 'Module 3',
    title: 'Chapter 3: Access Control Concepts & Identity Management',
    pageStart: 91,
    pageEnd: 135,
    estimatedReadMinutes: 30,
    fileRef: 'Chapter - 3.pdf',
    keyTakeaways: 'Physical vs Logical access controls, Identification, Authentication (MFA), Authorization, DAC, MAC, RBAC, and Defense in Depth.',
    examTips: 'Physical: fences, bollards, mantraps. Technical: firewalls, ACLs, encryption. Administrative: policies, training, background checks.',
    contentMarkdown: `# Chapter 3: Access Control Concepts

Access control ensures that only authorized subjects can access designated objects.

---

## 3.1 Three Categories of Controls
1. **Physical Controls**: Physical barriers preventing physical entry (fences, mantraps, bollards, CCTV, security guards).
2. **Technical / Logical Controls**: Software and hardware configurations (firewalls, MFA, encryption, ACLs).
3. **Administrative / Management Controls**: Policies, procedures, background checks, security awareness training, and separation of duties.

---

## 3.2 Logical Access Models
- **DAC (Discretionary Access Control)**: Owner assigns permissions.
- **MAC (Mandatory Access Control)**: System assigns labels (Top Secret, Secret, Confidential).
- **RBAC (Role-Based Access Control)**: Permissions assigned to job roles; users assigned to roles.`
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 4,
    docTitle: 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
    edition: 'Official 1st Edition',
    chapterNumber: 4,
    sectionNumber: 'Module 4',
    title: 'Chapter 4: Network Security & Protocols',
    pageStart: 136,
    pageEnd: 180,
    estimatedReadMinutes: 30,
    fileRef: 'Chapter - 4.pdf',
    keyTakeaways: 'OSI 7-layer model, TCP/IP, common network protocols, IPv4/IPv6, firewalls, network segmentation, and wireless security (WPA3).',
    examTips: 'Layer 7 = App (HTTP/DNS). Layer 4 = Transport (TCP/UDP). Layer 3 = Network (IP/Routers). Layer 2 = Data Link (MAC/Switches). Layer 1 = Physical (Cables).',
    contentMarkdown: `# Chapter 4: Network Security & Protocols

Networks interconnect enterprise systems and require defense-in-depth protection across all OSI layers.

---

## 4.1 The OSI 7-Layer Model
| Layer | Name | PDU | Key Protocols |
| :--- | :--- | :--- | :--- |
| **7** | Application | Data | HTTP, HTTPS, DNS, SMTP, SSH |
| **6** | Presentation | Data | SSL/TLS, ASCII, JPEG |
| **5** | Session | Data | NetBIOS, RPC, Sockets |
| **4** | Transport | Segment | TCP (Reliable), UDP (Connectionless) |
| **3** | Network | Packet | IP, ICMP, IPsec, Routers |
| **2** | Data Link | Frame | Ethernet, MAC, Switches |
| **1** | Physical | Bits | Cables, Fiber, Wireless Radios |`
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 5,
    docTitle: 'ISC2 Certified in Cybersecurity (CC) Official Course Guide',
    edition: 'Official 1st Edition',
    chapterNumber: 5,
    sectionNumber: 'Module 5',
    title: 'Chapter 5: Security Operations & Data Security',
    pageStart: 181,
    pageEnd: 225,
    estimatedReadMinutes: 30,
    fileRef: 'Chapter - 5.pdf',
    keyTakeaways: 'Data states (At Rest, In Transit, In Use), System Hardening, Patch Management, Clean Desk Policy, and Social Engineering prevention.',
    examTips: 'Data at Rest = Storage encryption. Data in Transit = TLS/VPN. Data in Use = RAM/secure enclaves.',
    contentMarkdown: `# Chapter 5: Security Operations & Data Security

Security operations maintain ongoing protection for data and IT infrastructure throughout their operational lifecycle.

---

## 5.1 The Three States of Data
1. **Data at Rest**: Stored on disk, database, or tape (protected via AES-256 BitLocker encryption).
2. **Data in Transit**: Transversing network wires or wireless frequencies (protected via TLS 1.3 and IPsec VPNs).
3. **Data in Use**: Loaded into volatile RAM or CPU registers (protected via secure memory enclaves and access controls).

---

## 5.2 System Hardening
- **Least Functionality**: Disable all unneeded ports, protocols, services, and default accounts.
- **Automated Patching**: Deploy critical operating system and application security updates within established SLAs.`
  },

  // =========================================================================
  // AWS SOLUTIONS ARCHITECT (SAA-C03) — CHAPTERS 2 TO 4
  // =========================================================================
  {
    certSlug: 'aws-csaa',
    domainNum: 2,
    docTitle: 'AWS Certified Solutions Architect Associate (SAA-C03) Guide',
    edition: 'SAA-C03 Official Edition',
    chapterNumber: 2,
    sectionNumber: 'Module 2',
    title: 'Chapter 2: Designing Resilient & Highly Available Cloud Architectures',
    pageStart: 61,
    pageEnd: 120,
    estimatedReadMinutes: 35,
    fileRef: 'AWS Disaster Recovery Whitepaper.pdf',
    keyTakeaways: 'Multi-AZ deployments, Auto Scaling Groups, Elastic Load Balancers (ALB/NLB), Amazon Aurora Global Database, and Disaster Recovery strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Region Active-Active).',
    examTips: 'Multi-AZ = High Availability (sync). Multi-Region = Disaster Recovery (async). Pilot Light maintains core data replication; Warm Standby maintains scaled-down fleet.',
    contentMarkdown: `# Chapter 2: Resilient Cloud Architectures & Disaster Recovery

Building fault-tolerant systems in AWS requires designing for failure across Availability Zones and Regions.

---

## 2.1 The 4 Disaster Recovery Strategies on AWS
| Strategy | RTO / RPO | Cost | Architecture Description |
| :--- | :--- | :--- | :--- |
| **Backup & Restore** | Hours | Lowest | EBS snapshots & S3 replication restored upon disaster |
| **Pilot Light** | 10s of mins | Low | Core database replicates live; EC2 instances spawned on demand |
| **Warm Standby** | Minutes | Moderate | Scaled-down minimum fleet running live in secondary region |
| **Multi-Region Active-Active**| Real-time | Highest | Traffic routed across multiple active regions with Route 53 |`
  },
  {
    certSlug: 'aws-csaa',
    domainNum: 3,
    docTitle: 'AWS Certified Solutions Architect Associate (SAA-C03) Guide',
    edition: 'SAA-C03 Official Edition',
    chapterNumber: 3,
    sectionNumber: 'Module 3',
    title: 'Chapter 3: High-Performing Compute, Storage & Caching',
    pageStart: 121,
    pageEnd: 180,
    estimatedReadMinutes: 35,
    fileRef: 'AWS Well-Architected Framework.pdf',
    keyTakeaways: 'Amazon EC2 Instance types, AWS Lambda serverless compute, Amazon EBS volume types (gp3, io2), Amazon EFS distributed storage, and ElastiCache Redis caching.',
    examTips: 'EBS is block storage locked to a single AZ. EFS is NFS shared file storage across multiple AZs. S3 is object storage accessible via HTTP/REST.',
    contentMarkdown: `# Chapter 3: High-Performing Cloud Storage & Compute

Selecting the appropriate storage and compute services maximizes throughput and reduces latency.

---

## 3.1 Storage Options Comparison
- **Amazon EBS (Elastic Block Store)**: High-performance block storage attached to a single EC2 instance in one AZ (gp3 for general purpose, io2 for mission-critical databases).
- **Amazon EFS (Elastic File System)**: Managed NFS file system accessible concurrently by thousands of EC2 instances across multiple AZs.
- **Amazon S3**: Exabyte-scale object storage designed for 99.999999999% (11 9s) durability.`
  },
  {
    certSlug: 'aws-csaa',
    domainNum: 4,
    docTitle: 'AWS Certified Solutions Architect Associate (SAA-C03) Guide',
    edition: 'SAA-C03 Official Edition',
    chapterNumber: 4,
    sectionNumber: 'Module 4',
    title: 'Chapter 4: Cost-Optimized Cloud Architectures',
    pageStart: 181,
    pageEnd: 240,
    estimatedReadMinutes: 30,
    fileRef: 'AWS Well-Architected Framework.pdf',
    keyTakeaways: 'S3 Storage Class lifecycle policies, S3 Intelligent-Tiering, EC2 Spot Instances, Savings Plans, and AWS Cost Explorer budget alerts.',
    examTips: 'Spot instances save up to 90% for fault-tolerant workloads. S3 Glacier Deep Archive is the cheapest tier for multi-year regulatory retention.',
    contentMarkdown: `# Chapter 4: Cloud Cost Optimization

Cost optimization ensures architectural goals are met without paying for idle or over-provisioned resources.

---

## 4.1 S3 Storage Lifecycle Rules
- Transition objects from **S3 Standard** to **S3 Standard-IA** after 30 days.
- Transition to **S3 Glacier Flexible** after 90 days.
- Transition to **S3 Glacier Deep Archive** after 180 days for long-term retention.`
  },

  // =========================================================================
  // NIST AI RMF & ENTERPRISE GRC — CHAPTERS 2 TO 4
  // =========================================================================
  {
    certSlug: 'nist-grc',
    domainNum: 2,
    docTitle: 'NIST AI Risk Management Framework (NIST AI 100-1)',
    edition: 'Version 1.0 Official',
    chapterNumber: 2,
    sectionNumber: 'Core 2.0',
    title: 'Chapter 2: MAP Function — Context, Data Provenance & Harms',
    pageStart: 51,
    pageEnd: 90,
    estimatedReadMinutes: 30,
    fileRef: 'NIST.AI.100-1.pdf',
    keyTakeaways: 'Mapping AI system boundaries, context of use, data provenance tracking, third-party model dependencies, and societal harm modeling.',
    examTips: 'MAP establishes organizational context, data lineage, and downstream risks before deploying AI models.',
    contentMarkdown: `# Chapter 2: MAP Function — Context & Risk Framing

The MAP function frames risks related to AI systems in specific organizational and operational contexts.

---

## 2.1 Key MAP Actions
- Define the intended purpose, operational constraints, and expected business benefits of the AI system.
- Map data supply chains, data provenance, and user consent mechanisms.
- Identify potential negative impacts on human rights, privacy, and organizational reputation.`
  },
  {
    certSlug: 'nist-grc',
    domainNum: 3,
    docTitle: 'NIST AI Risk Management Framework (NIST AI 100-1)',
    edition: 'Version 1.0 Official',
    chapterNumber: 3,
    sectionNumber: 'Core 3.0',
    title: 'Chapter 3: MEASURE Function — Quantitative Testing & Red Teaming',
    pageStart: 91,
    pageEnd: 130,
    estimatedReadMinutes: 30,
    fileRef: 'NIST.AI.100-1.pdf',
    keyTakeaways: 'AI evaluation benchmarks, red teaming methodologies, prompt injection defense, fairness metrics, and model drift monitoring.',
    examTips: 'MEASURE uses quantitative metrics and qualitative expert evaluations to assess trustworthiness characteristics.',
    contentMarkdown: `# Chapter 3: MEASURE Function — AI Testing & Evaluation

The MEASURE function employs quantitative benchmarks and red-teaming exercises to evaluate AI model safety and reliability.

---

## 3.1 AI Red Teaming & Testing
- Simulate adversary jailbreaks, prompt injection, and data exfiltration attempts.
- Monitor model drift and performance degradation over time against baseline datasets.`
  },
  {
    certSlug: 'nist-grc',
    domainNum: 4,
    docTitle: 'NIST AI Risk Management Framework (NIST AI 100-1)',
    edition: 'Version 1.0 Official',
    chapterNumber: 4,
    sectionNumber: 'Core 4.0',
    title: 'Chapter 4: MANAGE Function — Risk Treatment & Human Oversight',
    pageStart: 131,
    pageEnd: 170,
    estimatedReadMinutes: 30,
    fileRef: 'NIST.AI.100-1.pdf',
    keyTakeaways: 'Risk treatment prioritization, Human-in-the-Loop fail-safes, emergency kill-switches, continuous monitoring, and decommissioning playbooks.',
    examTips: 'MANAGE requires Human-in-the-Loop (HITL) review for high-consequence AI decisions and documented decommissioning procedures.',
    contentMarkdown: `# Chapter 4: MANAGE Function — AI Risk Treatment & Governance

The MANAGE function allocates resources to treat, monitor, and govern AI systems throughout deployment and retirement.

---

## 4.1 Human-in-the-Loop (HITL) Controls
- High-consequence decisions must have human review and sign-off.
- Decommissioning procedures must ensure model archives, training logs, and customer data are securely purged.`
  }
];

async function run() {
  try {
    await client.connect();
    console.log('=== EXPANDING DOCUMENT LIBRARY WITH ALL CHAPTERS FOR ALL 4 TRACKS ===\n');

    const domRes = await client.query('SELECT d.id, d.domain_number, c.slug FROM domains d JOIN certifications c ON d.certification_id = c.id');
    const domainMap = {};
    domRes.rows.forEach(r => {
      domainMap[`${r.slug}_${r.domain_number}`] = r.id;
    });

    for (const ch of EXPANDED_MANUALS) {
      const certId = CERT_IDS[ch.certSlug];
      const domainId = domainMap[`${ch.certSlug}_${ch.domainNum}`];

      if (!certId || !domainId) continue;

      await client.query(`
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
        VALUES ($1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        certId,
        domainId,
        ch.title,
        ch.contentMarkdown,
        ch.docTitle,
        ch.edition,
        ch.chapterNumber,
        ch.sectionNumber,
        ch.pageStart,
        ch.pageEnd,
        ch.estimatedReadMinutes,
        ch.fileRef,
        ch.keyTakeaways,
        ch.examTips,
        ch.chapterNumber
      ]);

      console.log(`✓ [${ch.certSlug.toUpperCase()}] Ingested ${ch.title}`);
    }

    const countRes = await client.query('SELECT c.slug, count(sm.id) FROM study_materials sm JOIN certifications c ON sm.certification_id = c.id GROUP BY c.slug');
    console.log('\n=============================================');
    console.log('Document Library Chapters by Track:');
    for (const r of countRes.rows) {
      console.log(`- ${r.slug.toUpperCase()}: ${r.count} full chapters`);
    }
    console.log('=============================================');

  } catch (err) {
    console.error('Error expanding manual chapters:', err);
  } finally {
    await client.end();
  }
}

run();
