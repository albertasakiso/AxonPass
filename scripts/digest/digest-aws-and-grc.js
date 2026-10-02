import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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

const AWS_ID = 'a0000000-0000-0000-0000-000000000003';
const NIST_ID = 'a0000000-0000-0000-0000-000000000004';

const AWS_CURRICULUM = [
  {
    domainNum: 1,
    topicCode: 'AWS-1.1',
    name: 'IAM, KMS & Security Architecture',
    part: 'A',
    contentSummary: 'Identity and Access Management, policies, roles, KMS encryption, Secrets Manager, and VPC security.',
    subtopics: [
      {
        code: 'AWS-1.1.1',
        name: 'AWS Identity & Access Management (IAM) Deep Dive',
        estimatedReadMinutes: 12,
        keyTerms: ['IAM Users', 'IAM Roles', 'IAM Groups', 'AssumeRole', 'Least Privilege', 'KMS Envelope Encryption'],
        examTips: 'Never use AWS Root account for daily operations. Use IAM Roles for EC2 instances instead of hardcoding credentials.',
        learningObjectives: 'Configure secure IAM policies, temporary security tokens (STS), and KMS customer managed keys (CMK).',
        contentBody: `# AWS IAM Architecture & Security Best Practices

AWS Identity and Access Management (IAM) is the foundational access control plane for all AWS services.

---

## 1. Core IAM Constructs
- **IAM Users**: Individual humans or system accounts with permanent credentials.
- **IAM Groups**: Collections of users to attach shared permission policies.
- **IAM Roles**: Secure identities granted temporary credentials via AWS Security Token Service (STS). **Best practice for EC2, Lambda, and cross-account access.**

---

## 2. AWS Key Management Service (KMS) & Envelope Encryption
KMS uses Hardware Security Modules (HSMs) to manage Customer Master Keys (CMKs). 
- **Envelope Encryption**: KMS generates a Data Key. The plaintext data key encrypts the data locally, and the data key itself is stored encrypted alongside the data.`
      }
    ]
  },
  {
    domainNum: 2,
    topicCode: 'AWS-2.1',
    name: 'High Availability & Resilient Multi-AZ/Multi-Region Architecture',
    part: 'A',
    contentSummary: 'Auto Scaling, ALB/NLB load balancing, Route 53 failover routing, and Multi-AZ Aurora/RDS deployments.',
    subtopics: [
      {
        code: 'AWS-2.1.1',
        name: 'Elastic Load Balancing (ALB vs NLB) & Auto Scaling Groups',
        estimatedReadMinutes: 14,
        keyTerms: ['Application Load Balancer (ALB)', 'Network Load Balancer (NLB)', 'Auto Scaling Group (ASG)', 'Target Groups', 'Multi-AZ'],
        examTips: 'ALB works at Layer 7 (HTTP/HTTPS, path-based routing). NLB works at Layer 4 (TCP/UDP, ultra-low latency, millions of requests/sec, static IP).',
        learningObjectives: 'Design fault-tolerant, auto-scaling web application architectures across multiple availability zones.',
        contentBody: `# Resilient Architecture: ELB & Auto Scaling

## 1. Application Load Balancer vs Network Load Balancer

| Feature | Application Load Balancer (ALB) | Network Load Balancer (NLB) |
| :--- | :--- | :--- |
| **OSI Layer** | **Layer 7** (Application) | **Layer 4** (Transport) |
| **Routing Options** | Path-based, host-based, query string routing | TCP/UDP/TLS port forwarding |
| **Throughput** | High | Ultra-high (millions req/sec, ultra-low latency) |
| **Static IP** | No (DNS name) | Yes (Elastic IP per AZ) |`
      }
    ]
  },
  {
    domainNum: 4,
    topicCode: 'AWS-4.1',
    name: 'Cost Optimization & S3 Storage Lifecycle',
    part: 'A',
    contentSummary: 'S3 storage tiers, Glacier Deep Archive, lifecycle policies, Spot/On-Demand/Savings Plans, and Cost Explorer.',
    subtopics: [
      {
        code: 'AWS-4.1.1',
        name: 'Amazon S3 Storage Tiers & Lifecycle Rules',
        estimatedReadMinutes: 12,
        keyTerms: ['S3 Standard', 'S3 Intelligent-Tiering', 'S3 Standard-IA', 'S3 Glacier Flexible', 'S3 Glacier Deep Archive'],
        examTips: 'For unknown or changing access patterns, choose S3 Intelligent-Tiering. For compliance archiving with 12-hour retrieval tolerance, choose Glacier Deep Archive (cheapest).',
        learningObjectives: 'Configure automated S3 lifecycle rules to minimize storage expenditure.',
        contentBody: `# S3 Storage Tiering & Cost Optimization

Amazon S3 offers purpose-built storage classes to minimize cloud costs:

1. **S3 Standard**: 99.99% availability, 11 9s durability. High throughput, low latency. Ideal for active data.
2. **S3 Intelligent-Tiering**: Automatically moves objects between frequent, infrequent, and archive access tiers with NO operational overhead or retrieval fees.
3. **S3 Standard-Infrequent Access (IA)**: Lower storage cost, but retrieval fee applies. For data accessed less than once a month.
4. **S3 Glacier Deep Archive**: Lowest-cost storage in AWS. Retrieval time: 12 to 48 hours. Built for multi-year regulatory retention.`
      }
    ]
  }
];

const NIST_CURRICULUM = [
  {
    domainNum: 1,
    topicCode: 'NIST-1.1',
    name: 'GOVERN: AI Governance & Risk Management Culture',
    part: 'A',
    contentSummary: 'NIST AI 100-1 framework structure, organizational culture, accountability, ethical AI principles, and legal compliance.',
    subtopics: [
      {
        code: 'NIST-1.1.1',
        name: 'NIST AI RMF Core Functions & Ethical Trustworthiness',
        estimatedReadMinutes: 15,
        keyTerms: ['NIST AI 100-1', 'GOVERN', 'MAP', 'MEASURE', 'MANAGE', 'Explainability', 'Bias Mitigation', 'Safety & Resilience'],
        examTips: 'The NIST AI RMF Core consists of 4 functions: GOVERN (Cross-cutting culture), MAP (Context identification), MEASURE (Analysis & metrics), and MANAGE (Resource allocation & response).',
        learningObjectives: 'Understand the four NIST AI RMF Core functions and seven AI trustworthiness characteristics.',
        contentBody: `# NIST AI Risk Management Framework (AI RMF 1.0)

Published as **NIST AI 100-1**, the AI RMF provides a voluntary, consensus-based methodology to address risks associated with artificial intelligence systems throughout their lifecycle.

---

## 1. The Four Core Functions
- **GOVERN**: Cultivates a risk-management culture, establishes enterprise accountability, transparent policies, and organizational structure. **Governs all other functions.**
- **MAP**: Establishes context, understands interdependencies, categorizes AI capabilities, and identifies potential societal and enterprise harms.
- **MEASURE**: Employs quantitative, qualitative, or expert evaluation to analyze and track AI risks and system performance.
- **MANAGE**: Allocates resources to prioritized risks, enacts mitigation strategies, and performs ongoing post-deployment monitoring.

---

## 2. Seven AI Trustworthiness Characteristics
1. **Valid and Reliable**
2. **Safe**
3. **Secure and Resilient**
4. **Accountable and Transparent**
5. **Explainable and Interpretable**
6. **Privacy-Enhanced**
7. **Fair with Harmful Bias Managed**`
      }
    ]
  }
];

const SAMPLE_AWS_QUESTIONS = [
  {
    stem: 'A company runs an e-commerce application on Amazon EC2 instances behind an Application Load Balancer. The traffic fluctuates significantly throughout the year. Which solution ensures high availability and cost efficiency during traffic spikes?',
    a: 'Deploy EC2 instances in a single Availability Zone with an Auto Scaling Group',
    b: 'Deploy an Auto Scaling Group across multiple Availability Zones attached to the Application Load Balancer',
    c: 'Use large Reserved Instances in a single Availability Zone',
    d: 'Manually add EC2 instances whenever CPU utilization exceeds 80%',
    ans: 'B',
    rationale: 'Deploying an Auto Scaling Group across multiple Availability Zones provides high availability, fault tolerance, and automated horizontal scaling during traffic spikes.',
    domainNum: 2
  },
  {
    stem: 'An organization needs to store medical records for 10 years to comply with regulatory standards. The records are rarely accessed after the first 30 days, but must be retained. Which S3 storage configuration is the MOST cost-effective?',
    a: 'S3 Standard storage class for the entire 10-year retention period',
    b: 'S3 One Zone-IA for 10 years without backup',
    c: 'An S3 Lifecycle policy to transition objects from S3 Standard to S3 Glacier Deep Archive after 30 days',
    d: 'EBS Cold HDD volumes attached to an active EC2 instance',
    ans: 'C',
    rationale: 'S3 Glacier Deep Archive provides the lowest-cost storage tier across AWS, making it the most cost-effective solution for long-term compliance retention where data is rarely accessed.',
    domainNum: 4
  }
];

const SAMPLE_NIST_QUESTIONS = [
  {
    stem: 'According to the NIST AI Risk Management Framework (AI 100-1), which function is responsible for establishing the overarching risk management culture, policies, and accountability across an organization?',
    a: 'MAP',
    b: 'MEASURE',
    c: 'MANAGE',
    d: 'GOVERN',
    ans: 'D',
    rationale: 'The GOVERN function is cross-cutting and foundational. It establishes organizational processes, risk tolerances, and leadership accountability for managing AI risks.',
    domainNum: 1
  },
  {
    stem: 'Under the NIST AI RMF, during which lifecycle stage should an organization identify intended system context, capabilities, and potential societal impacts?',
    a: 'MAP function',
    b: 'MEASURE function',
    c: 'DEPLOY stage only',
    d: 'DECOMMISSION stage',
    ans: 'A',
    rationale: 'The MAP function provides the context to understand potential positive and negative impacts, AI system categorization, and deployment environment requirements.',
    domainNum: 2
  }
];

async function digestAwsAndGrc() {
  try {
    await client.connect();
    console.log('Connected to live database. Ingesting AWS and NIST GRC curricula & question banks...');

    // 1. AWS Domains Map
    const awsDomRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [AWS_ID]);
    const awsMap = {};
    awsDomRes.rows.forEach(r => { awsMap[r.domain_number] = r.id; });

    // Ingest AWS Curriculum
    for (const item of AWS_CURRICULUM) {
      const domId = awsMap[item.domainNum];
      if (!domId) continue;

      const tRes = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, content_summary, sort_order)
        VALUES ($1, $2, $3, $4, $5, 1)
        ON CONFLICT (domain_id, topic_code) DO UPDATE SET
          name = EXCLUDED.name,
          content_summary = EXCLUDED.content_summary
        RETURNING id
      `, [domId, item.topicCode, item.name, item.part, item.contentSummary]);

      const tId = tRes.rows[0].id;
      let sSort = 1;
      for (const sub of item.subtopics) {
        await client.query(`
          INSERT INTO subtopics (topic_id, subtopic_code, name, content_body, key_terms, exam_tips, estimated_read_minutes, learning_objectives, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (topic_id, subtopic_code) DO UPDATE SET
            name = EXCLUDED.name,
            content_body = EXCLUDED.content_body,
            key_terms = EXCLUDED.key_terms,
            exam_tips = EXCLUDED.exam_tips,
            estimated_read_minutes = EXCLUDED.estimated_read_minutes,
            learning_objectives = EXCLUDED.learning_objectives
        `, [tId, sub.code, sub.name, sub.contentBody, sub.keyTerms, sub.examTips, sub.estimatedReadMinutes, sub.learningObjectives, sSort++]);
      }
      console.log(`  ✓ AWS Topic ${item.topicCode}: ${item.name}`);
    }

    // Ingest AWS Questions
    let awsQNum = 1;
    for (const q of SAMPLE_AWS_QUESTIONS) {
      const domId = awsMap[q.domainNum];
      const hash = crypto.createHash('sha256').update('aws_' + q.stem.toLowerCase().replace(/[^a-z0-9]/g, '')).digest('hex');

      await client.query(`
        INSERT INTO questions (certification_id, domain_id, question_number, question_type, stem, option_a, option_b, option_c, option_d, correct_answer, rationale, difficulty, source_reference, source_confidence, content_hash, is_active)
        VALUES ($1, $2, $3, 'mcq', $4, $5, $6, $7, $8, $9, $10, 'medium', 'AWS SAA-C03 Guide', 'verified', $11, true)
        ON CONFLICT (content_hash) DO UPDATE SET stem = EXCLUDED.stem, rationale = EXCLUDED.rationale
      `, [AWS_ID, domId, awsQNum++, q.stem, q.a, q.b, q.c, q.d, q.ans, q.rationale, hash]);
    }
    console.log(`  ✓ Ingested AWS SAA-C03 Questions.`);

    // 2. NIST GRC Domains Map
    const nistDomRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [NIST_ID]);
    const nistMap = {};
    nistDomRes.rows.forEach(r => { nistMap[r.domain_number] = r.id; });

    // Ingest NIST Curriculum
    for (const item of NIST_CURRICULUM) {
      const domId = nistMap[item.domainNum];
      if (!domId) continue;

      const tRes = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, content_summary, sort_order)
        VALUES ($1, $2, $3, $4, $5, 1)
        ON CONFLICT (domain_id, topic_code) DO UPDATE SET
          name = EXCLUDED.name,
          content_summary = EXCLUDED.content_summary
        RETURNING id
      `, [domId, item.topicCode, item.name, item.part, item.contentSummary]);

      const tId = tRes.rows[0].id;
      let sSort = 1;
      for (const sub of item.subtopics) {
        await client.query(`
          INSERT INTO subtopics (topic_id, subtopic_code, name, content_body, key_terms, exam_tips, estimated_read_minutes, learning_objectives, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (topic_id, subtopic_code) DO UPDATE SET
            name = EXCLUDED.name,
            content_body = EXCLUDED.content_body,
            key_terms = EXCLUDED.key_terms,
            exam_tips = EXCLUDED.exam_tips,
            estimated_read_minutes = EXCLUDED.estimated_read_minutes,
            learning_objectives = EXCLUDED.learning_objectives
        `, [tId, sub.code, sub.name, sub.contentBody, sub.keyTerms, sub.examTips, sub.estimatedReadMinutes, sub.learningObjectives, sSort++]);
      }
      console.log(`  ✓ NIST GRC Topic ${item.topicCode}: ${item.name}`);
    }

    // Ingest NIST Questions
    let nistQNum = 1;
    for (const q of SAMPLE_NIST_QUESTIONS) {
      const domId = nistMap[q.domainNum];
      const hash = crypto.createHash('sha256').update('nist_' + q.stem.toLowerCase().replace(/[^a-z0-9]/g, '')).digest('hex');

      await client.query(`
        INSERT INTO questions (certification_id, domain_id, question_number, question_type, stem, option_a, option_b, option_c, option_d, correct_answer, rationale, difficulty, source_reference, source_confidence, content_hash, is_active)
        VALUES ($1, $2, $3, 'mcq', $4, $5, $6, $7, $8, $9, $10, 'medium', 'NIST AI 100-1 Standard', 'verified', $11, true)
        ON CONFLICT (content_hash) DO UPDATE SET stem = EXCLUDED.stem, rationale = EXCLUDED.rationale
      `, [NIST_ID, domId, nistQNum++, q.stem, q.a, q.b, q.c, q.d, q.ans, q.rationale, hash]);
    }
    console.log(`  ✓ Ingested NIST GRC Questions.`);

    console.log('\n=============================================');
    console.log('AWS & NIST GRC Digestion Complete!');
    console.log('=============================================');
  } catch (err) {
    console.error('Error during AWS & NIST GRC digestion:', err);
  } finally {
    await client.end();
  }
}

digestAwsAndGrc();
