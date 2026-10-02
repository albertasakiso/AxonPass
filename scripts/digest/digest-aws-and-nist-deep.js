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

const AWS_CERT_ID = 'a0000000-0000-0000-0000-000000000003';
const NIST_CERT_ID = 'a0000000-0000-0000-0000-000000000004';

function hashContent(text) {
  return crypto.createHash('sha256').update(text.trim().toLowerCase().replace(/\s+/g, ' ')).digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// AWS CSAA STUDY CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────
const AWS_CHAPTERS = [
  {
    chapterNumber: 1,
    sectionNumber: 'Module 1.0',
    domainNum: 1,
    title: 'Domain 1: Design Secure Architectures (IAM, KMS & Network VPC)',
    pageStart: 1,
    pageEnd: 60,
    estimatedReadMinutes: 45,
    fileRef: 'wellarchitected-framework.pdf',
    keyTakeaways: 'IAM Roles (temporary STS credentials), KMS Envelope Encryption, Security Groups (stateful) vs NACLs (stateless), and AWS Secrets Manager.',
    examTips: 'Never store hardcoded IAM credentials on EC2 instances; always attach IAM Roles with least-privilege policies. Security Groups are stateful; Network ACLs are stateless subnet filters.',
    contentMarkdown: `# Domain 1: Design Secure Architectures (AWS SAA-C03)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **IAM Roles vs Users:** Never create long-term access keys for applications running on AWS. Attach an **IAM Role** to the EC2 instance or Lambda function using AWS Security Token Service (STS) for automated credential rotation.
> * **Security Groups vs Network ACLs (NACLs):**
>   - **Security Groups:** Operate at the **INSTANCE** level. They are **STATEFUL** (return traffic is automatically allowed).
>   - **NACLs:** Operate at the **SUBNET** level. They are **STATELESS** (inbound and outbound rules must be explicitly defined).
> * **KMS Envelope Encryption:** KMS encrypts a **Data Key (DEK)** with a **Customer Managed Key (CMK)**. The DEK encrypts the plaintext data at rest.

---

## 1. AWS Identity & Access Management (IAM) & Least Privilege
- **IAM Policies (JSON):** Explicit Deny ALWAYS overrides any Allow.
- **Permission Boundaries:** Sets the maximum possible permissions an IAM entity can have.
- **Cross-Account Access:** AWS Organizations Service Control Policies (SCPs) define central guardrails across member accounts.

---

## 2. VPC Security & Network Isolation
- **Public Subnet:** Has a direct route table entry pointing to an **Internet Gateway (IGW)**.
- **Private Subnet:** Communicates with the public internet via a **NAT Gateway** located in a public subnet.
- **VPC Endpoints:** Private connectivity to AWS services (S3, DynamoDB) without traversing the public internet via **Gateway Endpoints** (free for S3/DynamoDB) or **Interface Endpoints (PrivateLink)**.`
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Module 2.0',
    domainNum: 2,
    title: 'Domain 2: Design Resilient Architectures (Multi-AZ, ASG & Disaster Recovery)',
    pageStart: 61,
    pageEnd: 120,
    estimatedReadMinutes: 45,
    fileRef: 'wellarchitected-framework.pdf',
    keyTakeaways: 'Multi-AZ RDS (synchronous standby), Read Replicas (asynchronous scale), Auto Scaling Groups with ALB, and Route 53 Failover Routing.',
    examTips: 'Multi-AZ RDS provides HIGH AVAILABILITY and automatic synchronous failover (not for read performance). Read Replicas provide READ SCALABILITY via asynchronous replication.',
    contentMarkdown: `# Domain 2: Design Resilient Architectures (AWS SAA-C03)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Multi-AZ vs Read Replicas:**
>   - **Multi-AZ Deployment:** Provides **High Availability / Disaster Recovery**. Replicates synchronously to a standby instance in a second AZ. No performance boost for reads.
>   - **Read Replicas:** Provides **Read Performance Scaling**. Replicates asynchronously. Can span across multiple AWS regions.
> * **Route 53 Routing Policies:**
>   - **Failover Routing:** Active-passive disaster recovery using Route 53 health checks.
>   - **Latency Routing:** Routes user to the AWS region with the lowest network latency.
>   - **Geolocation Routing:** Routes users based on geographic origin.

---

## 1. Elastic Load Balancing (ELB) & Auto Scaling
- **Application Load Balancer (ALB):** Layer 7 (HTTP/HTTPS, path-based and host-based routing, WebSockets).
- **Network Load Balancer (NLB):** Layer 4 (TCP/UDP, ultra-low latency, millions of requests/sec, static elastic IPs).
- **Auto Scaling Group (ASG):** Dynamically provisions EC2 instances across multiple Availability Zones based on CloudWatch metric alarms (e.g., target tracking on CPU utilization).`
  },
  {
    chapterNumber: 3,
    sectionNumber: 'Module 3.0',
    domainNum: 3,
    title: 'Domain 3: Design High-Performing Architectures (Compute, Storage & Decoupling)',
    pageStart: 121,
    pageEnd: 180,
    estimatedReadMinutes: 45,
    fileRef: 'wellarchitected-framework.pdf',
    keyTakeaways: 'EBS Volume Types (gp3, io2 Block Express), EFS (multi-AZ shared NFS), SQS Decoupling & Dead-Letter Queues, and CloudFront Edge Caching.',
    examTips: 'Use SQS to decouple asynchronous application tiers so traffic spikes do not crash downstream worker services. Use CloudFront with Lambda@Edge or CloudFront Functions to cache dynamic/static assets close to users.',
    contentMarkdown: `# Domain 3: Design High-Performing Architectures (AWS SAA-C03)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Storage Matrix Comparison:**
>   - **EBS (Elastic Block Store):** Block storage attached to ONE EC2 instance in the SAME AZ (gp3 for general purpose, io2 for mission-critical sub-millisecond IOPS).
>   - **EFS (Elastic File System):** Managed POSIX NFS file system shared across hundreds of EC2 instances across MULTIPLE AZs simultaneously.
>   - **Amazon S3:** Object storage (virtually unlimited scale, 99.999999999% durability).
> * **Decoupling Asynchronous Architectures:**
>   - **Amazon SQS (Standard):** Unlimited throughput, at-least-once delivery, best-effort ordering.
>   - **Amazon SQS (FIFO):** Exactly-once processing, strict first-in-first-out order (3,000 msgs/sec with batching).
>   - **Amazon SNS:** Publish/Subscribe fan-out mechanism delivering messages to multiple SQS queues or email endpoints.

---

## 1. Caching & Acceleration Services
- **Amazon CloudFront:** Global Content Delivery Network (CDN) caching content at 400+ Edge Locations.
- **Amazon ElastiCache:** In-memory caching using Redis (supports replication & clustering) or Memcached (simple multi-threaded caching).
- **DynamoDB Accelerator (DAX):** In-memory cache for DynamoDB delivering microsecond response times.`
  },
  {
    chapterNumber: 4,
    sectionNumber: 'Module 4.0',
    domainNum: 4,
    title: 'Domain 4: Design Cost-Optimized Architectures (Storage Lifecycle & Compute Savings)',
    pageStart: 181,
    pageEnd: 240,
    estimatedReadMinutes: 40,
    fileRef: 'wellarchitected-cost-optimization-pillar.pdf',
    keyTakeaways: 'S3 Storage Classes (Standard, Intelligent-Tiering, Glacier Flexible/Deep Archive), EC2 Pricing Models (On-Demand, Spot, Savings Plans), and AWS Cost Explorer.',
    examTips: 'S3 Intelligent-Tiering automatically moves data between frequent and infrequent tiers without retrieval fees. Spot Instances provide up to 90% discount for fault-tolerant batch workloads.',
    contentMarkdown: `# Domain 4: Design Cost-Optimized Architectures (AWS SAA-C03)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **EC2 Purchasing Models Comparison:**
>   - **On-Demand:** Highest hourly rate, no commitment; best for unpredictable, short-term workloads.
>   - **Savings Plans / Reserved Instances (1 or 3 Years):** Up to 72% discount for steady-state predictable workloads.
>   - **Spot Instances:** Up to 90% discount off On-Demand; AWS can terminate with a **2-minute warning**. Only use for stateless, fault-tolerant batch jobs.
> * **S3 Storage Tier Lifecycle:**
>   - **S3 Standard:** Frequent access.
>   - **S3 Standard-IA:** Infrequent access, immediate retrieval, lower storage cost with retrieval fee.
>   - **S3 Glacier Instant / Flexible:** Millisecond to 3–5 hour retrieval.
>   - **S3 Glacier Deep Archive:** Lowest storage cost ($1/TB/month), 12-hour retrieval for long-term compliance archives.`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// NIST AI RMF & GRC STUDY CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────
const NIST_CHAPTERS = [
  {
    chapterNumber: 1,
    sectionNumber: 'Core 1.0',
    domainNum: 1,
    title: 'Domain 1: GOVERN Function (AI Governance & Risk Culture)',
    pageStart: 1,
    pageEnd: 40,
    estimatedReadMinutes: 40,
    fileRef: 'nist ai 1.pdf',
    keyTakeaways: 'AI Risk Governance structures, Executive accountability, Alignment with corporate values, Workforce AI training, and Third-party AI supply chain oversight.',
    examTips: 'The GOVERN function is cross-cutting and anchors all other NIST AI RMF functions (MAP, MEASURE, MANAGE). AI risk culture begins at the executive board level.',
    contentMarkdown: `# Domain 1: GOVERN Function (NIST AI RMF 1.0)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The 4 NIST AI RMF Functions:**
>   - **GOVERN:** Establishes policies, accountability, risk tolerance, and workforce culture (Cross-cutting).
>   - **MAP:** Identifies context, categorization, and unintended risks across the AI lifecycle.
>   - **MEASURE:** Applies quantitative and qualitative assessment, testing, and validation (TEVV).
>   - **MANAGE:** Allocates risk treatments, continuous monitoring, and incident response playbooks.

---

## 1. AI Governance Structures & Executive Leadership
- **AI Risk Appetite:** Defining the enterprise threshold for algorithmic risk, autonomous decision-making, and regulatory compliance.
- **Multidisciplinary Oversight:** Ensuring AI governance teams include domain subject matter experts, legal counsel, ethicists, data scientists, and cybersecurity auditors.
- **Third-Party AI Supply Chain:** Establishing rigorous vendor assessments for Foundation Models, third-party APIs, and fine-tuning datasets.`
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Core 2.0',
    domainNum: 2,
    title: 'Domain 2: MAP Function (Context & AI Risk Identification)',
    pageStart: 41,
    pageEnd: 80,
    estimatedReadMinutes: 40,
    fileRef: 'nist ai 1.pdf',
    keyTakeaways: 'Categorizing AI applications, TEVV (Test, Evaluation, Validation, Verification), Data provenance, Hallucination risks, and Socio-technical context.',
    examTips: 'Context is paramount in AI risk. A model that is low-risk in a recommendation engine becomes critical-risk in medical triage or loan underwriting.',
    contentMarkdown: `# Domain 2: MAP Function (NIST AI RMF 1.0)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Socio-Technical Context:** AI systems cannot be evaluated solely on statistical math accuracy. The deployment environment, user expectations, and societal impact must be mapped.
> * **AI Lifecycle Stages:**
>   1. Plan & Design -> 2. Data Collection & Preprocessing -> 3. Model Building & Training -> 4. Verification & Validation -> 5. Deployment & Operation -> 6. Decommissioning.

---

## 1. AI Risk Mapping & Categorization
- **Intended Purpose vs Unintended Use:** Mapping potential edge cases, hallucinations, adversarial prompt injections, and misuse scenarios.
- **Data Provenance & Lineage:** Tracking training data sourcing, copyright legitimacy, data labeling protocols, and historical bias.`
  },
  {
    chapterNumber: 3,
    sectionNumber: 'Core 3.0',
    domainNum: 3,
    title: 'Domain 3: MEASURE Function (Assessment, Testing & Red-Teaming)',
    pageStart: 81,
    pageEnd: 120,
    estimatedReadMinutes: 40,
    fileRef: 'nist ai 1.pdf',
    keyTakeaways: 'The 7 Characteristics of Trustworthy AI (Valid/Reliable, Safe, Secure/Resilient, Accountable/Transparent, Explainable/Interpretable, Privacy-Enhanced, Fair).',
    examTips: 'Red-Teaming attacks AI systems with adversarial prompts, jailbreaks, and data extraction queries to discover vulnerabilities before production release.',
    contentMarkdown: `# Domain 3: MEASURE Function (NIST AI RMF 1.0)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The 7 NIST Characteristics of Trustworthy AI:**
>   1. **Valid and Reliable:** Operates accurately within defined parameters.
>   2. **Safe:** Does not endanger human life or property.
>   3. **Secure and Resilient:** Resists adversarial cyberattacks and model theft.
>   4. **Accountable and Transparent:** Decision-making trails are auditable.
>   5. **Explainable and Interpretable:** Outputs can be understood by human operators.
>   6. **Privacy-Enhanced:** Protects personal identifiable information (PII).
>   7. **Fair with Harmful Bias Managed:** Prevents disparate impact across demographic groups.

---

## 1. Testing, Evaluation, Validation, and Verification (TEVV)
- **Quantitative Metrics:** Precision, Recall, F1-Score, ROC-AUC, Fairness Disparate Impact Ratio ($80\\%$ Rule).
- **Adversarial Red-Teaming:** Systematic penetration testing for prompt injection, jailbreaking, model inversion, and data poisoning.`
  },
  {
    chapterNumber: 4,
    sectionNumber: 'Core 4.0',
    domainNum: 4,
    title: 'Domain 4: MANAGE Function (Risk Treatment, Fallback & Monitoring)',
    pageStart: 121,
    pageEnd: 160,
    estimatedReadMinutes: 40,
    fileRef: 'nist ai 1.pdf',
    keyTakeaways: 'Continuous drift monitoring, Human-in-the-Loop (HITL) fallback, AI Incident Response playbooks, and Model Decommissioning.',
    examTips: 'Concept drift and data drift require continuous real-time model telemetry. When anomaly thresholds are breached, traffic must automatically fall back to Human-in-the-Loop or deterministic rules.',
    contentMarkdown: `# Domain 4: MANAGE Function (NIST AI RMF 1.0)

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Human-in-the-Loop (HITL) Fallback:** Critical AI systems must implement circuit breakers where high-uncertainty decisions are routed to human operators.
> * **Model Drift vs Data Drift:**
>   - **Data Drift:** The statistical properties of incoming input data change over time.
>   - **Concept Drift:** The statistical relationship between input features and target outcomes changes (e.g., consumer behavior shifts post-pandemic).

---

## 1. AI Risk Treatment & Operational Controls
- **Guardrail Filters:** Input sanitization and output guardrail classifiers blocking unsafe content.
- **Continuous Auditing:** Automated monitoring of latency, hallucination rate, and fairness drift.
- **Decommissioning Playbook:** Secure disposal of deprecated model weights and sensitive fine-tuning vectors.`
  }
];

// Sample Verified Question Banks for AWS & NIST
const AWS_QUESTIONS = [
  { stem: 'A company runs a multi-tier web application on AWS with an EC2 web tier and an Amazon RDS MySQL database. The database must be highly available with automated failover in the event of an outage. Which solution meets this requirement with the least operational overhead?', optionA: 'Configure a Multi-AZ deployment for the Amazon RDS MySQL database.', optionB: 'Create an Amazon RDS Read Replica in the same Availability Zone and configure manual failover.', optionC: 'Deploy two standalone RDS MySQL instances and use AWS Lambda to sync replication.', optionD: 'Create an EC2 instance with MySQL installed across two subnets.', correctAnswer: 'A', rationale: 'Amazon RDS Multi-AZ deployments synchronously replicate data to a standby instance in a secondary Availability Zone and provide automated failover without manual intervention.', domainNum: 2, source: 'AWS SAA-C03 Official Exam Guide' },
  { stem: 'An application requires block storage attached to an EC2 instance that delivers consistent sub-millisecond latency and up to 64,000 IOPS for a mission-critical transactional database. Which Amazon EBS volume type should be selected?', optionA: 'General Purpose SSD (gp3)', optionB: 'Provisioned IOPS SSD (io2 / io2 Block Express)', optionC: 'Throughput Optimized HDD (st1)', optionD: 'Cold HDD (sc1)', correctAnswer: 'B', rationale: 'EBS Provisioned IOPS SSD (io2 / io2 Block Express) volumes are designed for I/O-intensive, mission-critical databases requiring sub-millisecond latency and high IOPS.', domainNum: 3, source: 'AWS SAA-C03 Official Exam Guide' },
  { stem: 'A solutions architect needs to design a secure network architecture. The application running on private EC2 instances needs to securely download software patches from the public internet without being directly accessible from inbound internet traffic. Which AWS component should be deployed?', optionA: 'Internet Gateway attached to the private subnet', optionB: 'NAT Gateway deployed in a public subnet with a route in the private route table', optionC: 'VPC Gateway Endpoint for HTTP', optionD: 'AWS Direct Connect connection', correctAnswer: 'B', rationale: 'A NAT Gateway deployed in a public subnet allows private subnet instances to initiate outbound connections to the internet while preventing inbound internet connections.', domainNum: 1, source: 'AWS SAA-C03 Official Exam Guide' },
  { stem: 'A compliance policy mandates that historical financial records must be stored for 7 years. The data is rarely accessed, but when requested, a 12-hour retrieval window is acceptable. What is the most cost-effective storage solution?', optionA: 'Amazon S3 Standard', optionB: 'Amazon S3 Standard-Infrequent Access (S3 Standard-IA)', optionC: 'Amazon S3 Glacier Flexible Retrieval', optionD: 'Amazon S3 Glacier Deep Archive', correctAnswer: 'D', rationale: 'Amazon S3 Glacier Deep Archive is AWS lowest-cost storage class, designed for long-term retention of rarely accessed data where 12-hour retrieval is acceptable.', domainNum: 4, source: 'AWS SAA-C03 Official Exam Guide' }
];

const NIST_QUESTIONS = [
  { stem: 'According to the NIST AI Risk Management Framework (AI RMF 1.0), which core function is cross-cutting and responsible for cultivating an organizational risk culture, defining risk tolerance, and establishing transparent accountability for AI systems?', optionA: 'MAP', optionB: 'MEASURE', optionC: 'MANAGE', optionD: 'GOVERN', correctAnswer: 'D', rationale: 'The GOVERN function is a cross-cutting function that informs and enables the MAP, MEASURE, and MANAGE functions by establishing governance structures, risk tolerance, and accountability.', domainNum: 1, source: 'NIST AI RMF 1.0' },
  { stem: 'During the AI lifecycle, testing an AI system with adversarial prompts, jailbreaking attempts, and out-of-distribution inputs to assess vulnerability and robustness belongs to which NIST AI RMF core function?', optionA: 'GOVERN', optionB: 'MAP', optionC: 'MEASURE', optionD: 'MANAGE', correctAnswer: 'C', rationale: 'The MEASURE function employs quantitative and qualitative tools, metrics, and adversarial red-teaming methodologies to analyze and validate AI system trustworthiness.', domainNum: 3, source: 'NIST AI RMF 1.0' },
  { stem: 'When an AI model experiences unexpected data drift in production resulting in degraded prediction confidence, what operational risk control should automatically engage to prevent harmful automated actions?', optionA: 'Increase compute cluster memory', optionB: 'Human-in-the-Loop (HITL) fallback or deterministic rule fallback', optionC: 'Disable all logging to save bandwidth', optionD: 'Re-initialize model weights with random seed', correctAnswer: 'B', rationale: 'Under the MANAGE function, automated safety mechanisms should route high-uncertainty or drifted predictions to human review or deterministic safe fallback procedures.', domainNum: 4, source: 'NIST AI RMF 1.0' }
];

async function runAwsAndNistDigestion() {
  try {
    await client.connect();
    console.log('=== STARTING EXHAUSTIVE AWS & NIST GRC DIGESTION ===\n');

    // 1. Ingest AWS Chapters
    const awsDomRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [AWS_CERT_ID]);
    const awsMap = {};
    awsDomRes.rows.forEach(r => { awsMap[r.domain_number] = r.id; });

    await client.query('DELETE FROM study_materials WHERE certification_id = $1', [AWS_CERT_ID]);
    let sort = 1;
    for (const ch of AWS_CHAPTERS) {
      await client.query(`
        INSERT INTO study_materials (
          certification_id, domain_id, title, content_type, content_body,
          document_title, edition, chapter_number, section_number, page_start, page_end,
          estimated_read_minutes, file_reference, key_takeaways, exam_tips, sort_order
        ) VALUES ($1, $2, $3, 'text', $4, 'AWS Certified Solutions Architect Associate (SAA-C03) Official Guide', '2024–2026 Edition', $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [AWS_CERT_ID, awsMap[ch.domainNum], ch.title, ch.contentMarkdown, ch.chapterNumber, ch.sectionNumber, ch.pageStart, ch.pageEnd, ch.estimatedReadMinutes, ch.fileRef, ch.keyTakeaways, ch.examTips, sort++]);
      console.log(`✓ Ingested [AWS ${ch.sectionNumber}] ${ch.title}`);
    }

    // 2. Ingest NIST Chapters
    const nistDomRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [NIST_CERT_ID]);
    const nistMap = {};
    nistDomRes.rows.forEach(r => { nistMap[r.domain_number] = r.id; });

    await client.query('DELETE FROM study_materials WHERE certification_id = $1', [NIST_CERT_ID]);
    sort = 1;
    for (const ch of NIST_CHAPTERS) {
      await client.query(`
        INSERT INTO study_materials (
          certification_id, domain_id, title, content_type, content_body,
          document_title, edition, chapter_number, section_number, page_start, page_end,
          estimated_read_minutes, file_reference, key_takeaways, exam_tips, sort_order
        ) VALUES ($1, $2, $3, 'text', $4, 'NIST AI Risk Management Framework (AI RMF 1.0) & GRC Guidelines', 'NIST Special Publication', $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [NIST_CERT_ID, nistMap[ch.domainNum], ch.title, ch.contentMarkdown, ch.chapterNumber, ch.sectionNumber, ch.pageStart, ch.pageEnd, ch.estimatedReadMinutes, ch.fileRef, ch.keyTakeaways, ch.examTips, sort++]);
      console.log(`✓ Ingested [NIST ${ch.sectionNumber}] ${ch.title}`);
    }

    // 3. Ingest Questions
    let qNum = 1;
    for (const q of AWS_QUESTIONS) {
      const hash = hashContent(q.stem + q.optionA);
      await client.query(`
        INSERT INTO questions (certification_id, domain_id, question_number, stem, option_a, option_b, option_c, option_d, correct_answer, rationale, content_hash, source_reference, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (content_hash) DO NOTHING
      `, [AWS_CERT_ID, awsMap[q.domainNum], qNum++, q.stem, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.rationale, hash, q.source]);
    }
    console.log(`✓ Ingested AWS Questions`);

    qNum = 1;
    for (const q of NIST_QUESTIONS) {
      const hash = hashContent(q.stem + q.optionA);
      await client.query(`
        INSERT INTO questions (certification_id, domain_id, question_number, stem, option_a, option_b, option_c, option_d, correct_answer, rationale, content_hash, source_reference, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (content_hash) DO NOTHING
      `, [NIST_CERT_ID, nistMap[q.domainNum], qNum++, q.stem, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.rationale, hash, q.source]);
    }
    console.log(`✓ Ingested NIST Questions`);

    console.log('\n=============================================');
    console.log('AWS & NIST Digestion Completed Successfully!');
    console.log('=============================================');

  } catch (err) {
    console.error('Error during AWS & NIST digestion:', err);
  } finally {
    await client.end();
  }
}

runAwsAndNistDigestion();
