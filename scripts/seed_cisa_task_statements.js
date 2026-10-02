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

const cisaTaskStatements = [
  // Domain 1: Information System Auditing Process
  {
    task_code: 'T1.1',
    description: 'Execute an audit plan based on IS audit standards to confirm that information systems are protected and controlled.',
    related_domains: [1],
  },
  {
    task_code: 'T1.2',
    description: 'Plan an audit to determine whether information systems are protected, controlled, and provide value to the organization.',
    related_domains: [1],
  },
  {
    task_code: 'T1.3',
    description: 'Conduct an audit in accordance with IS audit standards to achieve scheduled audit objectives.',
    related_domains: [1],
  },
  {
    task_code: 'T1.4',
    description: 'Communicate audit results and recommend potential solutions to key stakeholders.',
    related_domains: [1],
  },
  {
    task_code: 'T1.5',
    description: 'Conduct audit follow-ups to determine whether appropriate actions have been taken by management in a timely manner.',
    related_domains: [1],
  },
  {
    task_code: 'T1.6',
    description: 'Apply audit data analytics (ADA), computer-assisted audit techniques (CAATs), and AI/ML algorithms to enhance audit testing depth and continuous monitoring.',
    related_domains: [1],
  },
  {
    task_code: 'T1.7',
    description: 'Evaluate the internal audit function governance, audit charter, professional ethics, and independence under ITAF guidelines.',
    related_domains: [1],
  },

  // Domain 2: Governance and Management of IT
  {
    task_code: 'T2.1',
    description: 'Evaluate the IT strategy for alignment with the organization\'s mission, vision, and strategic business objectives.',
    related_domains: [2],
  },
  {
    task_code: 'T2.2',
    description: 'Evaluate the IT governance structure and processes (e.g., IT Steering Committee vs IT Strategy Committee, Three Lines Model) to ensure proper oversight.',
    related_domains: [2],
  },
  {
    task_code: 'T2.3',
    description: 'Evaluate the IT organizational structure, segregation of duties (SoD), and human resources management controls.',
    related_domains: [2],
  },
  {
    task_code: 'T2.4',
    description: 'Evaluate the organization\'s IT policies, standards, and procedures for regulatory compliance, completeness, and strategic alignment.',
    related_domains: [2],
  },
  {
    task_code: 'T2.5',
    description: 'Evaluate IT resource, financial, and portfolio management practices to ensure maximum value delivery and budget accountability.',
    related_domains: [2],
  },
  {
    task_code: 'T2.6',
    description: 'Evaluate enterprise IT risk management (ERM) practices to ensure risks are identified, analyzed (qualitative/quantitative), and treated within organizational risk appetite.',
    related_domains: [2],
  },
  {
    task_code: 'T2.7',
    description: 'Evaluate IT performance monitoring and reporting mechanisms (KPIs, KRIs, KCIs, IT Balanced Scorecard).',
    related_domains: [2],
  },
  {
    task_code: 'T2.8',
    description: 'Evaluate data governance, classification schemas, and data privacy programs (GDPR, CCPA, cross-border data transfer safeguards).',
    related_domains: [2],
  },
  {
    task_code: 'T2.9',
    description: 'Evaluate IT vendor, cloud outsourcing, and third-party contract governance, including SOC 1/2/3 assurance reports and SLA adherence.',
    related_domains: [2],
  },

  // Domain 3: Information Systems Acquisition, Development and Implementation
  {
    task_code: 'T3.1',
    description: 'Evaluate the business case and feasibility analysis for proposed information system acquisitions or in-house development.',
    related_domains: [3],
  },
  {
    task_code: 'T3.2',
    description: 'Evaluate the project management framework, PMO governance, and project controls (Gantt, WBS, Function Point Analysis).',
    related_domains: [3],
  },
  {
    task_code: 'T3.3',
    description: 'Evaluate system development methodologies (Waterfall, Agile, DevSecOps) and quality gates throughout the SDLC.',
    related_domains: [3],
  },
  {
    task_code: 'T3.4',
    description: 'Evaluate control identification and application control design (input, processing, output, and interface validation controls).',
    related_domains: [3],
  },
  {
    task_code: 'T3.5',
    description: 'Evaluate system readiness testing hierarchy (unit, integration, system, user acceptance testing (UAT), regression, security testing).',
    related_domains: [3],
  },
  {
    task_code: 'T3.6',
    description: 'Evaluate configuration management, release management, CI/CD pipeline security gates, and code repository baselines.',
    related_domains: [3],
  },
  {
    task_code: 'T3.7',
    description: 'Evaluate data migration, conversion integrity, cutover strategies (parallel, phased, abrupt/direct), and fallback/rollback procedures.',
    related_domains: [3],
  },
  {
    task_code: 'T3.8',
    description: 'Conduct post-implementation reviews (PIR) to determine whether project objectives, ROI, and internal controls were achieved.',
    related_domains: [3],
  },

  // Domain 4: Information Systems Operations and Business Resilience
  {
    task_code: 'T4.1',
    description: 'Evaluate IT service management (ITSM) operations, service level agreements (SLAs), and operational performance metrics.',
    related_domains: [4],
  },
  {
    task_code: 'T4.2',
    description: 'Evaluate IT asset lifecycle management practices (ITAM) for hardware, software licenses, and virtualized components.',
    related_domains: [4],
  },
  {
    task_code: 'T4.3',
    description: 'Evaluate job scheduling, batch processing, and production automation controls.',
    related_domains: [4],
  },
  {
    task_code: 'T4.4',
    description: 'Evaluate system interface integrity, middleware connectivity, and API transaction error handling.',
    related_domains: [4],
  },
  {
    task_code: 'T4.5',
    description: 'Evaluate end-user computing (EUC) controls and shadow IT discovery mechanisms to mitigate unmanaged IT risks.',
    related_domains: [4],
  },
  {
    task_code: 'T4.6',
    description: 'Evaluate database management systems (DBMS) architecture, data integrity rules, and database administrator (DBA) access controls.',
    related_domains: [4],
  },
  {
    task_code: 'T4.7',
    description: 'Evaluate IT change management, emergency change authorizations, configuration baselines, and patch management processes.',
    related_domains: [4],
  },
  {
    task_code: 'T4.8',
    description: 'Evaluate incident and problem management processes, including root cause analysis (RCA) and help desk escalations.',
    related_domains: [4],
  },
  {
    task_code: 'T4.9',
    description: 'Evaluate operational log management, log collection, tamper-proofing (WORM), retention policies, and SIEM correlation.',
    related_domains: [4],
  },
  {
    task_code: 'T4.10',
    description: 'Evaluate business impact analysis (BIA) to determine critical business processes, MTD, RTO, RPO, and WRT metrics.',
    related_domains: [4],
  },
  {
    task_code: 'T4.11',
    description: 'Evaluate system resilience, high availability configurations, fault tolerance, and N+1 redundancy architectures.',
    related_domains: [4],
  },
  {
    task_code: 'T4.12',
    description: 'Evaluate data backup schemes (3-2-1 strategy), cloud backups, offsite immutable storage, and restoration test frequencies.',
    related_domains: [4],
  },
  {
    task_code: 'T4.13',
    description: 'Evaluate business continuity plans (BCP) and disaster recovery plans (DRP), including hot/warm/cold site provisioning, pandemic resilience, and simulation testing.',
    related_domains: [4],
  },

  // Domain 5: Protection of Information Assets
  {
    task_code: 'T5.1',
    description: 'Evaluate information security policies, baselines, standards (ISO/IEC 27001, NIST CSF 2.0), and governance frameworks.',
    related_domains: [5],
  },
  {
    task_code: 'T5.2',
    description: 'Evaluate physical and environmental security controls protecting data centers and sensitive facilities.',
    related_domains: [5],
  },
  {
    task_code: 'T5.3',
    description: 'Evaluate identity and access management (IAM), Zero Trust Architecture (ZTA), Privileged Access Management (PAM), and IGA controls.',
    related_domains: [5],
  },
  {
    task_code: 'T5.4',
    description: 'Evaluate network and perimeter security controls (NGFW, WAF, network segmentation, microsegmentation, EDR/XDR, UTM).',
    related_domains: [5],
  },
  {
    task_code: 'T5.5',
    description: 'Evaluate Data Loss Prevention (DLP) controls across all data states: in-use, in-transit, and at-rest.',
    related_domains: [5],
  },
  {
    task_code: 'T5.6',
    description: 'Evaluate cryptographic algorithms, key lifecycle management, quantum-resistant cryptosystems, and Public Key Infrastructure (PKI).',
    related_domains: [5],
  },
  {
    task_code: 'T5.7',
    description: 'Evaluate cloud computing security, containerization (Docker/Kubernetes), and the Cloud Shared Responsibility Model (SRM).',
    related_domains: [5],
  },
  {
    task_code: 'T5.8',
    description: 'Evaluate mobile device management (MDM), BYOD policies, wireless security (WPA3), and Internet of Things (IoT) security.',
    related_domains: [5],
  },
  {
    task_code: 'T5.9',
    description: 'Evaluate security awareness training programs, phishing simulations, and human risk reduction metrics.',
    related_domains: [5],
  },
  {
    task_code: 'T5.10',
    description: 'Evaluate attack detection, vulnerability assessments, penetration testing, and Security Operations Center (SOC) operations.',
    related_domains: [5],
  },
  {
    task_code: 'T5.11',
    description: 'Evaluate security incident response management (IRP), CSIRT operational readiness, and automated containment (SOAR).',
    related_domains: [5],
  },
  {
    task_code: 'T5.12',
    description: 'Evaluate digital forensics readiness, evidence acquisition, order of volatility, bit-stream imaging, and legal chain of custody.',
    related_domains: [5],
  },
];

async function seed() {
  await client.connect();
  console.log('Connected to DB. Seeding CISA Task Statements...');

  // Delete existing CISA task statements
  await client.query('DELETE FROM task_statements WHERE certification_id = $1', [cisaId]);

  for (const task of cisaTaskStatements) {
    await client.query(
      `INSERT INTO task_statements (id, certification_id, task_code, description, related_domains, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
      [cisaId, task.task_code, task.description, task.related_domains]
    );
  }

  const { rows } = await client.query('SELECT count(*) FROM task_statements WHERE certification_id = $1', [cisaId]);
  console.log(`Successfully seeded ${rows[0].count} CISA Task Statements!`);

  await client.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
