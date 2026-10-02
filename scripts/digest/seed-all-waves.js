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

const ALL_WAVE_CURRICULUM = [
  // =========================================================================
  // WAVE 1: ISACA CISA (ALL 5 DOMAINS)
  // =========================================================================
  {
    certSlug: 'cisa',
    domainNum: 1,
    topicCode: 'CISA-1.4',
    name: 'Control Self-Assessment (CSA) & Continuous Improvement',
    part: 'A',
    contentSummary: 'CSA objectives, facilitation techniques, advantages, risks, and employee morale impact when suggestions are ignored.',
    subtopics: [
      {
        code: 'CISA-1.4.1',
        name: 'Control Self-Assessment (CSA) Methodologies, Benefits & Limitations',
        estimatedReadMinutes: 15,
        keyTerms: ['Control Self-Assessment (CSA)', 'Facilitated Workshops', 'Employee Morale', 'Continuous Improvement', 'Ownership of Controls'],
        examTips: 'CRITICAL EXAM CONCEPT: The PRIMARY advantage of CSA is building employee ownership and early risk detection. The PRIMARY risk/disadvantage is that "Failure to act on improvement suggestions could damage employee morale" and create employee cynicism.',
        learningObjectives: 'Evaluate the strategic implementation of Control Self-Assessment (CSA) programs, analyze benefits vs risks, and manage organizational impact.',
        contentBody: `# Control Self-Assessment (CSA) & Continuous Improvement

**Control Self-Assessment (CSA)** is an established audit and risk management methodology where operational teams, managers, and staff evaluate the effectiveness of internal controls and risk management processes within their own business units.

---

## 1. Objectives of Control Self-Assessment (CSA)
- Shift accountability for risk identification and internal control monitoring from external/internal auditors directly to **operational process owners**.
- Enhance understanding of business risks and controls at all organizational tiers.
- Identify control gaps, process inefficiencies, and operational risks early before external audits or security incidents.

---

## 2. Core Advantages of CSA
1. **Early Risk & Gap Detection**: Frontline employees identify operational weaknesses and emerging vulnerabilities before they escalate into material errors.
2. **Fosters Control Ownership**: Encourages operational staff to take personal accountability and pride in maintaining rigorous controls.
3. **Improved Communication**: Bridges the gap between management and frontline operations regarding risk appetite and compliance goals.
4. **Enhanced Audit Focus**: Enables internal auditors to concentrate their testing on high-risk areas identified through CSA workshops.

---

## 3. Disadvantages, Limitations & Behavioral Risks of CSA
1. **Damage to Employee Morale**: **Failure to act on improvement suggestions could damage employee morale.** When employees participate in CSA workshops and offer actionable ideas to remediate control deficiencies, management MUST follow through. If management solicits suggestions but takes no action, employees become cynical and refuse to participate in future risk initiatives.
2. **Mistaken for Audit Replacement**: Management or staff may mistakenly believe that CSA eliminates the need for independent, objective IS audits. (CSA complements, but never replaces, formal audits).
3. **Subjectivity & Defensive Bias**: Process owners may downplay risks or overstate control effectiveness to avoid scrutiny.
4. **Resource Intensive**: Facilitated workshops require substantial staff time and sustained executive commitment.`
      },
      {
        code: 'CISA-1.4.2',
        name: 'Continuous Auditing, Continuous Monitoring & Embedded Modules',
        estimatedReadMinutes: 12,
        keyTerms: ['Continuous Auditing', 'Continuous Monitoring', 'Embedded Audit Modules (EAM)', 'Audit Hooks', 'Integrated Test Facility (ITF)'],
        examTips: 'Continuous Auditing is performed by AUDITORS to gain real-time assurance. Continuous Monitoring is performed by MANAGEMENT to supervise operations.',
        learningObjectives: 'Differentiate between continuous auditing and continuous monitoring, and design automated audit hooks.',
        contentBody: `# Continuous Auditing vs Continuous Monitoring

---

## 1. Key Distinctions
- **Continuous Monitoring**: An operational management activity that tracks transactions and system performance against thresholds in real time.
- **Continuous Auditing**: An independent assurance activity performed by internal auditors to gather audit evidence on an automated, near real-time basis.

---

## 2. Automated Audit Techniques
- **Embedded Audit Modules (EAM)**: Dedicated audit code embedded in production software that copies specific transactions matching criteria to an audit log.
- **Integrated Test Facility (ITF)**: A dummy test entity (department or vendor account) created within the live production database to process test transactions alongside real data.
- **Snapshot Techniques**: Capturing the exact state of system registers and database records before and after a specific transaction executes.`
      }
    ]
  },

  // =========================================================================
  // WAVE 2: ISC2 CERTIFIED IN CYBERSECURITY (CC) (ALL 5 DOMAINS)
  // =========================================================================
  {
    certSlug: 'isc2-cc',
    domainNum: 1,
    topicCode: 'CC-1.2',
    name: 'Risk Management Principles & Threat Modeling',
    part: 'A',
    contentSummary: 'Threats, vulnerabilities, risks, likelihood, impact, and risk identification methodologies.',
    subtopics: [
      {
        code: 'CC-1.2.1',
        name: 'Threats, Vulnerabilities & Risk Assessment Process',
        estimatedReadMinutes: 14,
        keyTerms: ['Threat', 'Vulnerability', 'Risk', 'Threat Actor', 'Likelihood', 'Impact'],
        examTips: 'Risk = Threat × Vulnerability × Impact. A vulnerability without an active threat is not a risk; a threat without a matching vulnerability cannot cause harm.',
        learningObjectives: 'Distinguish between threats, vulnerabilities, and risks and perform basic risk assessments.',
        contentBody: `# Cybersecurity Risk Fundamentals

Risk represents the potential for loss, damage, or destruction of an asset resulting from a threat exploiting a vulnerability.

---

## 1. Core Equation & Terminology
- **Vulnerability**: A flaw, weakness, or gap in security controls, system design, or code that can be exploited (e.g., unpatched software, weak passwords).
- **Threat**: Any potential event, entity, or action that can exploit a vulnerability to cause harm (e.g., ransomware gangs, malicious insiders, power surges).
- **Threat Actor / Agent**: The entity executing the threat (nation-state hackers, script kiddies, cybercriminals).
- **Risk**: The probability and consequence of a threat exploiting a vulnerability.`
      }
    ]
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 2,
    topicCode: 'CC-2.2',
    name: 'Business Continuity (BCP) & Disaster Recovery (DRP)',
    part: 'A',
    contentSummary: 'Emergency operations, crisis communications, power backup, and alternate site selection.',
    subtopics: [
      {
        code: 'CC-2.2.1',
        name: 'Business Continuity Planning & Emergency Response',
        estimatedReadMinutes: 12,
        keyTerms: ['BCP', 'DRP', 'Human Safety', 'Crisis Communication', 'Hot Site', 'Cold Site'],
        examTips: 'Human Life and Safety is ALWAYS the #1 priority in any incident, disaster, or evacuation procedure.',
        learningObjectives: 'Prioritize human safety and coordinate emergency response and business continuity plans.',
        contentBody: `# Business Continuity & Emergency Procedures

---

## 1. Paramount Rule: Human Safety
In any emergency (fire, natural disaster, active threat), the protection of human life and personal safety **always takes precedence over data preservation, hardware salvage, or business revenue**.

---

## 2. BCP vs DRP
- **Business Continuity Plan (BCP)**: Focuses on maintaining high-level business operations, revenue generation, and customer service during a disruption.
- **Disaster Recovery Plan (DRP)**: Focuses on the technical restoration of IT systems, networks, applications, and data storage following an emergency.`
      }
    ]
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 3,
    topicCode: 'CC-3.2',
    name: 'Physical Access Security & Environmental Defense',
    part: 'A',
    contentSummary: 'Physical perimeter defense, fences, bollards, mantraps, CCTV, badge readers, and environmental sensors.',
    subtopics: [
      {
        code: 'CC-3.2.1',
        name: 'Physical Security Perimeters, Mantraps & Piggybacking',
        estimatedReadMinutes: 10,
        keyTerms: ['Mantrap / Air Lock', 'Tailgating / Piggybacking', 'Bollards', 'Biometric Turnstiles', 'CCTV'],
        examTips: 'Mantraps prevent tailgating/piggybacking by requiring one door to close and lock before the second door unlocks.',
        learningObjectives: 'Implement layered physical security perimeters to block unauthorized physical entry.',
        contentBody: `# Physical Security Controls

Physical access controls establish physical barriers preventing unauthorized personnel from entering sensitive areas.

---

## 1. Layered Perimeter Defense
1. **Outer Perimeter**: Fences (8ft with barbed wire), security gates, vehicle bollards to stop ram-raiding.
2. **Building Entrance**: Security guards, visitor logs, electronic badges (RFID), and **mantraps**.
3. **Secure Rooms (Server Rooms)**: Biometric authentication, 24/7 CCTV surveillance with 90-day retention, lockable server racks.`
      }
    ]
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 4,
    topicCode: 'CC-4.2',
    name: 'Network Threat Defense & Wireless Security',
    part: 'A',
    contentSummary: 'Denial of Service (DoS/DDoS), Man-in-the-Middle (MitM), DNS spoofing, WPA3-Enterprise, and VPNs.',
    subtopics: [
      {
        code: 'CC-4.2.1',
        name: 'Network Attacks & Wireless Protection',
        estimatedReadMinutes: 12,
        keyTerms: ['DDoS', 'MitM', 'ARP Poisoning', 'WPA3', '802.1X', 'IPsec VPN'],
        examTips: 'WPA3 replaces WPA2 and provides Simultaneous Authentication of Equals (SAE) resistant to offline dictionary attacks.',
        learningObjectives: 'Identify common network-layer attacks and secure wireless enterprise networks.',
        contentBody: `# Network Attacks & Wireless Hardening

---

## 1. Common Network Attacks
- **DDoS (Distributed Denial of Service)**: Flooding target bandwidth or server resources using botnets (SYN flood, UDP flood, DNS amplification).
- **Man-in-the-Middle (MitM)**: Intercepting and altering network packets between two communicating parties (ARP spoofing, DNS cache poisoning).

---

## 2. Wireless Security Standards
- **WPA3-Enterprise**: Uses 192-bit cryptographic suite and 802.1X RADIUS authentication.
- **Rogue AP Detection**: Continuous wireless scanning to locate unauthorized Wi-Fi access points connected to the corporate LAN.`
      }
    ]
  },
  {
    certSlug: 'isc2-cc',
    domainNum: 5,
    topicCode: 'CC-5.2',
    name: 'Security Awareness, Social Engineering & Endpoint Defense',
    part: 'A',
    contentSummary: 'Phishing, spear phishing, vishing, smishing, clean desk policy, and endpoint antivirus/EDR.',
    subtopics: [
      {
        code: 'CC-5.2.1',
        name: 'Social Engineering Vectors & User Awareness Training',
        estimatedReadMinutes: 12,
        keyTerms: ['Phishing', 'Spear Phishing', 'Whaling', 'Vishing', 'Smishing', 'Clean Desk Policy'],
        examTips: 'Spear phishing targets specific individuals. Whaling targets C-suite executives. Security awareness training is the primary defense against social engineering.',
        learningObjectives: 'Recognize social engineering attack patterns and enforce administrative security policies.',
        contentBody: `# Social Engineering & User Training

Humans are frequently the most vulnerable element in any security system.

---

## 1. Social Engineering Attacks
- **Phishing**: Mass generic deceptive emails prompting users to reveal credentials or click malicious links.
- **Spear Phishing**: Highly tailored attack customized with personal information about a specific employee.
- **Whaling**: Spear phishing directed at high-level corporate executives (CEO, CFO).
- **Vishing & Smishing**: Voice phishing via phone calls; SMS phishing via text messages.`
      }
    ]
  },

  // =========================================================================
  // WAVE 3: AWS CERTIFIED SOLUTIONS ARCHITECT (SAA-C03) (ALL 4 DOMAINS)
  // =========================================================================
  {
    certSlug: 'aws-csaa',
    domainNum: 1,
    topicCode: 'AWS-1.2',
    name: 'AWS Identity, KMS Encryption & Network Isolation',
    part: 'A',
    contentSummary: 'IAM Policies, SCPs, AWS KMS customer managed keys, VPC Peering, Transit Gateway, and Security Groups vs NACLs.',
    subtopics: [
      {
        code: 'AWS-1.2.1',
        name: 'IAM Policies, Security Groups & Network ACLs',
        estimatedReadMinutes: 14,
        keyTerms: ['IAM Roles', 'Least Privilege', 'Security Groups (Stateful)', 'Network ACLs (Stateless)', 'AWS KMS', 'VPC'],
        examTips: 'Security Groups are STATEFUL at the instance level (return traffic automatically allowed). NACLs are STATELESS at the subnet level (require explicit inbound & outbound rules).',
        learningObjectives: 'Architect secure AWS VPC perimeters with stateful firewalls and granular IAM roles.',
        contentBody: `# AWS Security Architecture: IAM & VPC Defenses

---

## 1. Stateful vs Stateless Perimeters
- **Security Groups**: Stateful virtual firewall protecting EC2 instances. If an inbound request is permitted, response traffic is automatically allowed regardless of outbound rules.
- **Network ACLs (NACLs)**: Stateless subnet-level packet filter evaluated in numerical rule order. Requires explicit matching rules for both inbound and outbound ports.

---

## 2. AWS Key Management Service (KMS)
- **Envelope Encryption**: Using a Key Management Service (KMS) Customer Master Key (CMK) to encrypt plaintext Data Keys.`
      }
    ]
  },
  {
    certSlug: 'aws-csaa',
    domainNum: 2,
    topicCode: 'AWS-2.2',
    name: 'Multi-AZ High Availability & Multi-Region Disaster Recovery',
    part: 'A',
    contentSummary: 'Auto Scaling Groups, Application Load Balancers, Aurora Global Database, S3 Cross-Region Replication, and Route 53 Failover.',
    subtopics: [
      {
        code: 'AWS-2.2.1',
        name: 'Auto Scaling, ALB & Aurora Global Databases',
        estimatedReadMinutes: 15,
        keyTerms: ['Multi-AZ', 'Application Load Balancer (ALB)', 'Auto Scaling Group (ASG)', 'Amazon Aurora Global DB', 'Route 53 Active-Passive'],
        examTips: 'Multi-AZ provides High Availability (sync replication). Multi-Region provides Disaster Recovery (async replication) with low RTO/RPO.',
        learningObjectives: 'Design fault-tolerant cloud architectures spanning multiple Availability Zones and Regions.',
        contentBody: `# Resilient Multi-AZ & Multi-Region Cloud Architecture

---

## 1. High Availability (Multi-AZ)
- Deploy compute instances in **Auto Scaling Groups across 3 Availability Zones** behind an **Application Load Balancer (ALB)**.
- Deploy databases using **Amazon Aurora Multi-AZ with automated failover in under 30 seconds**.

---

## 2. Disaster Recovery (Multi-Region)
- **Amazon Aurora Global Database**: Sub-second cross-region replication latency with fast recovery in secondary regions.
- **Amazon Route 53**: DNS health checks configured with Failover routing policy to redirect traffic during regional outages.`
      }
    ]
  },
  {
    certSlug: 'aws-csaa',
    domainNum: 3,
    topicCode: 'AWS-3.1',
    name: 'High-Performing Compute, Caching & Microservices',
    part: 'A',
    contentSummary: 'Amazon SQS, SNS, Lambda serverless, ElastiCache Redis, CloudFront CDN, and DynamoDB DAX.',
    subtopics: [
      {
        code: 'AWS-3.1.1',
        name: 'Decoupled Architectures (SQS/SNS) & ElastiCache Caching',
        estimatedReadMinutes: 14,
        keyTerms: ['Amazon SQS', 'Amazon SNS', 'Serverless', 'AWS Lambda', 'Amazon ElastiCache (Redis)', 'CloudFront'],
        examTips: 'SQS decouples producers from consumers and absorbs spikes. ElastiCache reduces database load by caching frequent queries in-memory.',
        learningObjectives: 'Build high-throughput asynchronous architectures with queues and caching layers.',
        contentBody: `# Decoupled Cloud Architecture & In-Memory Caching

---

## 1. Decoupling with SQS and SNS
- **Amazon SQS (Simple Queue Service)**: Buffers messages between microservices to prevent system failure during sudden traffic spikes.
- **Amazon SNS (Simple Notification Service)**: Pub/Sub fanout messaging sending a single message to multiple SQS queues and Lambda triggers.

---

## 2. In-Memory Caching
- **ElastiCache (Redis / Memcached)**: Sub-millisecond read latency for relational databases.
- **DynamoDB Accelerator (DAX)**: Dedicated in-memory cache for DynamoDB providing 10x read performance improvements.`
      }
    ]
  },
  {
    certSlug: 'aws-csaa',
    domainNum: 4,
    topicCode: 'AWS-4.2',
    name: 'Cost Optimization, Storage Tiers & Compute Savings',
    part: 'A',
    contentSummary: 'S3 Lifecycle policies, S3 Intelligent-Tiering, Reserved Instances, Savings Plans, and Spot Instances.',
    subtopics: [
      {
        code: 'AWS-4.2.1',
        name: 'S3 Storage Classes Lifecycle & Compute Pricing Models',
        estimatedReadMinutes: 12,
        keyTerms: ['S3 Standard', 'S3 Glacier Flexible', 'S3 Glacier Deep Archive', 'S3 Intelligent-Tiering', 'Spot Instances', 'Savings Plans'],
        examTips: 'Spot instances offer up to 90% discount for stateless, fault-tolerant batch workloads. S3 Intelligent-Tiering automatically moves data based on access patterns without operational overhead.',
        learningObjectives: 'Optimize cloud expenditure across storage tiers and compute purchasing options.',
        contentBody: `# Cloud Cost Optimization Strategies

---

## 1. Amazon S3 Storage Class Hierarchy
| Storage Class | Use Case | Retrieval Time | Relative Cost |
| :--- | :--- | :--- | :--- |
| **S3 Standard** | Frequently accessed data | Milliseconds | Standard |
| **S3 Standard-IA** | Infrequently accessed data | Milliseconds | Lower storage, retrieval fee |
| **S3 Intelligent-Tiering**| Unknown/changing access patterns | Milliseconds | Automated optimization |
| **S3 Glacier Flexible**| Archival data | 1–5 minutes (Expedited) / 3–5 hours | Very Low |
| **S3 Glacier Deep Archive**| Long-term compliance (7–10 yrs) | 12 hours | Lowest (cents per GB) |

---

## 2. Compute Pricing Optimization
- **On-Demand**: Unpredictable short-term workloads.
- **Savings Plans / Reserved Instances**: 1 or 3-year commitment for predictable baseline workloads (up to 72% savings).
- **Spot Instances**: Spare compute capacity with up to 90% discount for fault-tolerant containerized or batch workloads.`
      }
    ]
  },

  // =========================================================================
  // WAVE 4: NIST AI RMF & ENTERPRISE GRC (ALL 4 DOMAINS)
  // =========================================================================
  {
    certSlug: 'nist-grc',
    domainNum: 1,
    topicCode: 'NIST-1.2',
    name: 'Trustworthy AI Characteristics & Ethical Governance',
    part: 'A',
    contentSummary: 'NIST AI RMF 1.0 core characteristics: Valid & Reliable, Safe, Secure, Accountable, Transparent, Explainable, Fair.',
    subtopics: [
      {
        code: 'NIST-1.2.1',
        name: '7 Characteristics of Trustworthy AI Systems',
        estimatedReadMinutes: 15,
        keyTerms: ['Valid & Reliable', 'Safe', 'Secure & Resilient', 'Accountable & Transparent', 'Explainable & Interpretable', 'Privacy-Enhanced', 'Fair with Harmful Bias Managed'],
        examTips: 'NIST AI RMF 100-1 defines 7 Trustworthy AI characteristics that must be balanced against organizational risk tolerance and system context.',
        learningObjectives: 'Evaluate artificial intelligence applications against the 7 NIST AI RMF trustworthiness criteria.',
        contentBody: `# The 7 Characteristics of Trustworthy AI (NIST AI RMF 1.0)

Under NIST AI 100-1, trustworthiness in AI systems is evaluated across seven interrelated dimensions:

---

## The 7 Trustworthy Dimensions
1. **Valid & Reliable**: System objectively achieves its intended performance criteria under defined operating conditions.
2. **Safe**: AI operations do not cause physical injury or endanger human life or health.
3. **Secure & Resilient**: Defends against adversarial machine learning attacks (data poisoning, model inversion, prompt injection).
4. **Accountable & Transparent**: Transparent disclosure of training datasets, model architecture, and clear human accountability for decisions.
5. **Explainable & Interpretable**: Ability to describe the underlying mechanisms and reasoning behind AI outputs in human-comprehensible terms.
6. **Privacy-Enhanced**: Data minimization and privacy-preserving machine learning (differential privacy, federated learning).
7. **Fair with Harmful Bias Managed**: Systematic identification and mitigation of demographic, systemic, and statistical biases.`
      }
    ]
  },
  {
    certSlug: 'nist-grc',
    domainNum: 2,
    topicCode: 'NIST-2.1',
    name: 'MAP: Context, Impact Assessment & Data Provenance',
    part: 'A',
    contentSummary: 'Mapping AI system boundaries, stakeholder impacts, third-party foundation models, and supply chain provenance.',
    subtopics: [
      {
        code: 'NIST-2.1.1',
        name: 'AI Context Mapping & Data Lineage Assurance',
        estimatedReadMinutes: 12,
        keyTerms: ['AI System Boundary', 'Data Lineage', 'Foundation Models', 'AI Supply Chain', 'Context of Use'],
        examTips: 'The MAP function establishes the context of use, data lineage, and potential societal harms before deployment.',
        learningObjectives: 'Map AI dependencies, data supply chains, and societal impact vectors.',
        contentBody: `# NIST AI RMF: MAP Function

The **MAP** function frames the risks related to an AI system in its specific organizational and societal context.

---

## 1. AI Context Identification
- Document the intended use, known limitations, target user demographics, and secondary downstream impacts.
- Establish strict data provenance logs tracking data sourcing, consent verification, and transformation pipelines.`
      }
    ]
  },
  {
    certSlug: 'nist-grc',
    domainNum: 3,
    topicCode: 'NIST-3.1',
    name: 'MEASURE: Quantitative Testing, Red Teaming & Bias Auditing',
    part: 'A',
    contentSummary: 'AI evaluation benchmarks, red teaming, hallucination metrics, fairness metrics, and adversarial testing.',
    subtopics: [
      {
        code: 'NIST-3.1.1',
        name: 'AI Red Teaming, Bias Audits & Model Evaluation',
        estimatedReadMinutes: 14,
        keyTerms: ['AI Red Teaming', 'Disparate Impact', 'Model Drift', 'Jailbreaking', 'Fairness Metrics'],
        examTips: 'MEASURE uses quantitative and qualitative metrics to evaluate model robustness, fairness, and safety before and during deployment.',
        learningObjectives: 'Conduct AI red teaming exercises and measure model drift and disparate impact.',
        contentBody: `# NIST AI RMF: MEASURE Function

The **MEASURE** function employs quantitative metrics, benchmarks, and qualitative evaluations to assess AI risks.

---

## 1. AI Red Teaming & Adversarial Probing
- Rigorous testing simulating hostile attackers attempting jailbreaks, prompt injection, and unauthorized data extraction.

---

## 2. Bias & Fairness Metrics
- Evaluating disparate impact across protected classes to detect systemic bias in training data and algorithmic predictions.`
      }
    ]
  },
  {
    certSlug: 'nist-grc',
    domainNum: 4,
    topicCode: 'NIST-4.1',
    name: 'MANAGE: AI Incident Response, Fallbacks & Continuous Governance',
    part: 'A',
    contentSummary: 'Risk treatment, continuous monitoring, human-in-the-loop fallback mechanisms, and AI incident decommissioning.',
    subtopics: [
      {
        code: 'NIST-4.1.1',
        name: 'Human-in-the-Loop, AI Incident Response & Model Decommissioning',
        estimatedReadMinutes: 12,
        keyTerms: ['Human-in-the-Loop (HITL)', 'AI Kill Switch', 'Model Decommissioning', 'Continuous Monitoring', 'AI Incident Playbook'],
        examTips: 'The MANAGE function requires dedicated Human-in-the-Loop (HITL) review mechanisms and an emergency shutdown/fallback procedure for rogue AI outputs.',
        learningObjectives: 'Formulate AI risk response plans and deploy human oversight fail-safes.',
        contentBody: `# NIST AI RMF: MANAGE Function

The **MANAGE** function allocates resources to treat, respond to, and continuously monitor identified AI risks.

---

## 1. Human-in-the-Loop (HITL) Controls
- High-consequence decisions (credit approvals, medical diagnoses, hiring) must incorporate mandatory human oversight and approval.
- An **emergency AI fail-safe / kill-switch** must exist to revert to deterministic rule-based algorithms or manual operations upon anomaly detection.`
      }
    ]
  }
];

async function seedAllWaves() {
  try {
    await client.connect();
    console.log('=== SEEDING ALL 4 PHASED CERTIFICATION WAVES INTO LIVE DB ===\n');

    // 1. Fetch All Domain Mappings for all 4 Certs
    const domRes = await client.query('SELECT d.id, d.domain_number, c.slug FROM domains d JOIN certifications c ON d.certification_id = c.id');
    const domainMap = {};
    domRes.rows.forEach(r => {
      domainMap[`${r.slug}_${r.domain_number}`] = r.id;
    });

    // 2. Ingest Multi-Wave Curriculum
    for (const item of ALL_WAVE_CURRICULUM) {
      const domainId = domainMap[`${item.certSlug}_${item.domainNum}`];
      if (!domainId) {
        console.warn(`Domain not found for ${item.certSlug} D${item.domainNum}`);
        continue;
      }

      const topicRes = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, content_summary, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (domain_id, topic_code) DO UPDATE SET
          name = EXCLUDED.name,
          part = EXCLUDED.part,
          content_summary = EXCLUDED.content_summary
        RETURNING id
      `, [domainId, item.topicCode, item.name, item.part, item.contentSummary, 1]);

      const topicId = topicRes.rows[0].id;
      console.log(`✓ [${item.certSlug.toUpperCase()}] Topic ${item.topicCode}: ${item.name}`);

      let subSort = 1;
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
        `, [
          topicId,
          sub.code,
          sub.name,
          sub.contentBody,
          sub.keyTerms,
          sub.examTips,
          sub.estimatedReadMinutes,
          sub.learningObjectives,
          subSort++
        ]);
        console.log(`  ↳ Subtopic ${sub.code}: ${sub.name}`);
      }
    }

    console.log('\n=============================================');
    console.log('All 4 Waves Seeding Completed Successfully!');
    console.log('=============================================');
  } catch (err) {
    console.error('Error during multi-wave seeding:', err);
  } finally {
    await client.end();
  }
}

seedAllWaves();
