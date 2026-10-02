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

const NEW_CERTS = [
  {
    id: 'a0000000-0000-0000-0000-000000000013',
    code: 'A+',
    slug: 'comptia-a-plus',
    name: 'CompTIA A+ Core Series (220-1101 & 220-1102)',
    publisher: 'CompTIA',
    body: 'CompTIA',
    version: '220-1101/1102',
    total_domains: 9,
    description: 'The industry standard for launching IT careers and establishing foundational mastery across mobile devices, networking technology, hardware, virtualization, cloud computing, and operating systems.',
    total_exam_questions: 90,
    exam_duration_minutes: 90,
    passing_score_percent: 75,
    passing_scaled_score: 675,
    scaled_score_min: 100,
    scaled_score_max: 900,
    domains: [
      { num: 1, name: 'Mobile Devices & Peripherals', weight: 15, topics: ['Laptop Hardware & Upgrades', 'Mobile Device Display Components', 'Mobile Device Accessories & Network Connectivity'] },
      { num: 2, name: 'Networking Technology & Protocols', weight: 20, topics: ['TCP/IP Common Ports & Protocols', 'Network Hardware & Cabling', 'Wireless Networking Standards & Configurations'] },
      { num: 3, name: 'Hardware & Component Architecture', weight: 25, topics: ['Motherboards, CPUs & Memory (RAM)', 'Storage Devices & RAID Arrays', 'Power Supplies & Peripheral Connectors'] },
      { num: 4, name: 'Virtualization & Cloud Computing', weight: 11, topics: ['Cloud Computing Concepts (IaaS, PaaS, SaaS)', 'Client-Side Virtualization & Hypervisors'] },
      { num: 5, name: 'Hardware & Network Troubleshooting', weight: 29, topics: ['Motherboard, RAM & CPU Troubleshooting', 'Storage Drive Troubleshooting', 'Wired & Wireless Troubleshooting'] },
      { num: 6, name: 'Operating Systems (Windows, macOS, Linux)', weight: 31, topics: ['Windows OS Editions & Tools', 'macOS & Linux Terminal Commands', 'OS Installation & Upgrade Methods'] },
      { num: 7, name: 'Security Concepts & Access Control', weight: 25, topics: ['Physical Security & Authentication', 'Social Engineering & Threat Types', 'OS Hardening & Workstation Security'] },
      { num: 8, name: 'Software Troubleshooting & Malware Removal', weight: 22, topics: ['Windows OS Boot Errors & BSODs', 'Malware Removal 7-Step Best Practice', 'Mobile OS Troubleshooting'] },
      { num: 9, name: 'Operational Procedures & Professionalism', weight: 22, topics: ['Ticketing Systems & Asset Management', 'Environmental Safety & Electrostatic Discharge (ESD)', 'Incident Response & Scripting Basics'] }
    ]
  },
  {
    id: 'a0000000-0000-0000-0000-000000000014',
    code: 'NETWORK+',
    slug: 'comptia-network-plus',
    name: 'CompTIA Network+ (N10-008 / N10-009)',
    publisher: 'CompTIA',
    body: 'CompTIA',
    version: 'N10-008/009',
    total_domains: 5,
    description: 'Comprehensive network engineering certification validating the technical knowledge required to securely establish, maintain, and troubleshoot the essential networks that businesses rely on.',
    total_exam_questions: 90,
    exam_duration_minutes: 90,
    passing_score_percent: 80,
    passing_scaled_score: 720,
    scaled_score_min: 100,
    scaled_score_max: 900,
    domains: [
      { num: 1, name: 'Networking Fundamentals', weight: 24, topics: ['OSI & TCP/IP Protocol Suites', 'IPv4 & IPv6 Subnetting & Addressing', 'Network Topologies & Cable Types (Fiber, Copper)'] },
      { num: 2, name: 'Network Implementations', weight: 19, topics: ['Routing Protocols & Switching Configurations', 'VLANs, Trunking & Spanning Tree (STP)', 'Wireless Technologies (802.11ax/Wi-Fi 6)'] },
      { num: 3, name: 'Network Operations', weight: 16, topics: ['Network Monitoring & SNMP/NetFlow', 'High Availability, Redundancy & DR', 'Organizational Policies & Documentation (IPAM/CMDB)'] },
      { num: 4, name: 'Network Security', weight: 19, topics: ['Network Attacks & Threat Actors', 'Zero Trust & Access Control (802.1X/Radius)', 'Firewalls, IDS/IPS & Network Micro-segmentation'] },
      { num: 5, name: 'Network Troubleshooting', weight: 22, topics: ['CompTIA 7-Step Troubleshooting Model', 'Hardware & Cable Testing Tools (OTDR, Tone Probe)', 'Software Diagnostic Utilities (Wireshark, tcpdump, ping)'] }
    ]
  },
  {
    id: 'a0000000-0000-0000-0000-000000000015',
    code: 'GSLC',
    slug: 'giac-security-leadership',
    name: 'GIAC Security Leadership Certification (GSLC)',
    publisher: 'GIAC / SANS',
    body: 'GIAC',
    version: '2026 Edition',
    total_domains: 4,
    description: 'Gold-standard executive cybersecurity leadership certification (aligned with SANS MGT512) validating the technical and managerial expertise needed to run enterprise cybersecurity programs.',
    total_exam_questions: 115,
    exam_duration_minutes: 180,
    passing_score_percent: 70,
    passing_scaled_score: 70,
    scaled_score_min: 0,
    scaled_score_max: 100,
    domains: [
      { num: 1, name: 'Security Governance & Strategic Leadership', weight: 25, topics: ['Strategic Security Alignment & CISO Mandate', 'Policy Hierarchy & Compliance Frameworks (NIST/ISO)', 'Security Metrics, KRIs & Board Communication'] },
      { num: 2, name: 'Cryptography & Perimeter Defense', weight: 20, topics: ['Enterprise Cryptography, PKI & Key Management', 'Network Defense-in-Depth & Zero Trust Architecture', 'Cloud Workload Protection & SaaS Governance'] },
      { num: 3, name: 'Incident Response & Threat Intelligence', weight: 25, topics: ['Incident Handling Lifecycle & CSIRT Operations', 'Cyber Threat Intelligence & MITRE ATT&CK', 'Vulnerability Management & Red/Blue Teaming'] },
      { num: 4, name: 'Security Operations & Business Resilience', weight: 30, topics: ['Security Operations Center (SOC) & SIEM/SOAR', 'Business Impact Analysis (BIA) & Disaster Recovery', 'Third-Party Risk Management (TPRM) & Supply Chain'] }
    ]
  }
];

async function seedNewCerts() {
  await client.connect();
  console.log('=== SEEDING 3 NEW CERTIFICATIONS TAXONOMY (A+, NETWORK+, GSLC) ===\n');

  for (const cert of NEW_CERTS) {
    // 1. Insert Certification
    await client.query(`
      INSERT INTO certifications (
        id, code, slug, name, publisher, body, version, total_domains,
        description, total_exam_questions, exam_duration_minutes,
        passing_score_percent, passing_scaled_score, scaled_score_min, scaled_score_max
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        publisher = EXCLUDED.publisher,
        body = EXCLUDED.body,
        version = EXCLUDED.version,
        total_domains = EXCLUDED.total_domains,
        description = EXCLUDED.description,
        total_exam_questions = EXCLUDED.total_exam_questions,
        exam_duration_minutes = EXCLUDED.exam_duration_minutes,
        passing_score_percent = EXCLUDED.passing_score_percent,
        passing_scaled_score = EXCLUDED.passing_scaled_score,
        scaled_score_min = EXCLUDED.scaled_score_min,
        scaled_score_max = EXCLUDED.scaled_score_max;
    `, [
      cert.id, cert.code, cert.slug, cert.name, cert.publisher, cert.body, cert.version,
      cert.total_domains, cert.description, cert.total_exam_questions, cert.exam_duration_minutes,
      cert.passing_score_percent, cert.passing_scaled_score, cert.scaled_score_min, cert.scaled_score_max
    ]);

    console.log(`[CERT] Inserted: [${cert.code}] ${cert.name}`);

    // 2. Insert Domains
    for (const dom of cert.domains) {
      // Check if domain exists
      let domainId = null;
      const existDom = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [cert.id, dom.num]);
      if (existDom.rows.length > 0) {
        domainId = existDom.rows[0].id;
        await client.query(`
          UPDATE domains SET
            name = $1,
            exam_weight_percent = $2,
            approx_exam_questions = $3,
            sort_order = $4
          WHERE id = $5
        `, [dom.name, dom.weight, Math.round(cert.total_exam_questions * (dom.weight / 100)), dom.num, domainId]);
      } else {
        const domRes = await client.query(`
          INSERT INTO domains (certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `, [cert.id, dom.num, dom.name, dom.weight, Math.round(cert.total_exam_questions * (dom.weight / 100)), dom.num]);
        domainId = domRes.rows[0].id;
      }

      console.log(`  └─ [DOM ${dom.num}] ${dom.name}`);

      // 3. Insert Topics
      for (let tIdx = 0; tIdx < dom.topics.length; tIdx++) {
        const topicTitle = dom.topics[tIdx];
        const topicCode = `T${dom.num}.${tIdx + 1}`;
        const existTopic = await client.query('SELECT id FROM topics WHERE domain_id = $1 AND topic_code = $2', [domainId, topicCode]);
        if (existTopic.rows.length > 0) {
          await client.query(`
            UPDATE topics SET
              name = $1,
              content_summary = $2,
              sort_order = $3
            WHERE id = $4
          `, [topicTitle, `Comprehensive study syllabus for ${topicTitle}`, tIdx + 1, existTopic.rows[0].id]);
        } else {
          await client.query(`
            INSERT INTO topics (domain_id, topic_code, name, part, content_summary, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6);
          `, [domainId, topicCode, topicTitle, 'A', `Comprehensive study syllabus for ${topicTitle}`, tIdx + 1]);
        }
      }
    }
  }

  const allCerts = await client.query('SELECT count(*) FROM certifications');
  console.log(`\n========================================================================================`);
  console.log(`✅ TOTAL CERTIFICATIONS NOW ACTIVE IN SYSTEM: ${allCerts.rows[0].count}`);
  console.log(`========================================================================================\n`);

  await client.end();
}

seedNewCerts().catch(console.error);
