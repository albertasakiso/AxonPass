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

const CCSP_ID = 'a0000000-0000-0000-0000-000000000011';
const SAA_ID = 'a0000000-0000-0000-0000-000000000003';

const CLOUD_CHAPTERS = [
  // =========================================================================
  // CCSP — Certified Cloud Security Professional (Domains 1 to 6)
  // =========================================================================
  {
    cert_id: CCSP_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Cloud Concepts, Architecture & Design Master Blueprint',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 50,
    takeaways: 'NIST SP 800-145 5 Essential Characteristics, 3 Service Models (IaaS, PaaS, SaaS), 4 Deployment Models, Shared Responsibility Model, and Cloud Security Alliance (CSA) Cloud Controls Matrix (CCM).',
    tips: 'In IaaS, customer secures OS and data; in PaaS, customer secures app and data; in SaaS, customer only configures data and access.',
    body: `# ISC2 CCSP Domain 1: Cloud Concepts, Architecture and Design

## 1.1 NIST SP 800-145 Cloud Computing Definition
Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort or service provider interaction.

### The 5 Essential Characteristics (NIST SP 800-145)
1. **On-Demand Self-Service**: A consumer can unilaterally provision computing capabilities (server time, storage) automatically without human interaction with the CSP.
2. **Broad Network Access**: Capabilities are available over the network and accessed through standard mechanisms (web browsers, mobile apps, APIs).
3. **Resource Pooling**: The CSP's computing resources are pooled to serve multiple consumers using a multi-tenant model, with physical and virtual resources dynamically assigned.
4. **Rapid Elasticity**: Capabilities can be elastically provisioned and released, scaling outward and inward commensurate with demand.
5. **Measured Service**: Cloud systems automatically control and optimize resource use by leveraging a metering capability (pay-per-use, CPU hours, GB stored).

\`\`\`
+-------------------------------------------------------------------------+
|                  NIST SP 800-145 CLOUD ARCHITECTURE                    |
|                                                                         |
|  [ 5 Essential Characteristics ]                                        |
|  • On-Demand Self-Service  • Broad Network Access  • Resource Pooling   |
|  • Rapid Elasticity        • Measured Service                           |
|                                                                         |
|  [ 3 Cloud Service Models ]                                             |
|  • Infrastructure as a Service (IaaS)                                  |
|  • Platform as a Service (PaaS)                                         |
|  • Software as a Service (SaaS)                                         |
|                                                                         |
|  [ 4 Deployment Models ]                                                |
|  • Public Cloud  • Private Cloud  • Community Cloud  • Hybrid Cloud     |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 The Shared Responsibility Matrix
The distribution of security responsibilities shifts depending on the cloud service model:

\`\`\`
+-------------------------------------------------------------------------+
|                    SHARED RESPONSIBILITY SPECTRUM                       |
|                                                                         |
|  Layer                     On-Premises   IaaS        PaaS        SaaS   |
|  -----                     -----------   ----        ----        ----   |
|  Data & Classification     Customer      Customer    Customer    Customer
|  IAM & Client Endpoints    Customer      Customer    Customer    Customer
|  Application Code          Customer      Customer    Customer    CSP    |
|  Operating System & Patch  Customer      Customer    CSP         CSP    |
|  Hypervisor & Compute      Customer      CSP         CSP         CSP    |
|  Physical Facility & Power Customer      CSP         CSP         CSP    |
+-------------------------------------------------------------------------+
\`\`\`

## 1.3 Cloud Security Alliance (CSA) Frameworks
- **CSA Cloud Controls Matrix (CCM)**: A cybersecurity control framework mapping cloud security controls across 17 domains to ISO 27001, NIST SP 800-53, PCI DSS, and HIPAA.
- **CSA STAR (Security, Trust, Assurance and Risk)**:
  - **Level 1 (Self-Assessment)**: CSP completes Consensus Assessments Initiative Questionnaire (CAIQ).
  - **Level 2 (Independent 3rd-Party Audit)**: CSA STAR Certification (ISO/IEC 27001 based) or CSA STAR Attestation (SOC 2 Type II based).
  - **Level 3 (Continuous Auditing)**: Real-time automated compliance verification.`
  },
  {
    cert_id: CCSP_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: Cloud Data Security & Lifecycle Governance',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 45,
    takeaways: 'The 6 phases of the Cloud Data Lifecycle (Create, Store, Use, Share, Archive, Destroy), Data Loss Prevention (DLP), Tokenization vs Anonymization, and Cloud Hardware Security Modules (HSMs).',
    tips: 'Tokenization replaces sensitive PANs with non-sensitive surrogate tokens; data can be de-tokenized only by authorized systems querying a secure token vault.',
    body: `# ISC2 CCSP Domain 2: Cloud Data Security

## 2.1 The Cloud Data Security Lifecycle
Data in the cloud transitions through six distinct phases:

\`\`\`
+-------------------------------------------------------------------------+
|                  THE 6-PHASE CLOUD DATA LIFECYCLE (CSU-SAD)             |
|                                                                         |
|  [ 1. Create ] ===> Data generation or modification of existing data    |
|         │                                                               |
|         ▼                                                               |
|  [ 2. Store ] ====> Committing data to storage (DB, S3, volume, SAN)    |
|         │                                                               |
|         ▼                                                               |
|  [ 3. Use ] ======> Data processed in memory, compute engines, analytics|
|         │                                                               |
|         ▼                                                               |
|  [ 4. Share ] ====> Data distributed to partners, API consumers, users  |
|         │                                                               |
|         ▼                                                               |
|  [ 5. Archive ] ==> Long-term archival storage (tape, Glacier, WORM)    |
|         │                                                               |
|         ▼                                                               |
|  [ 6. Destroy ] ==> Cryptographic erasure, shredding, sanitization      |
+-------------------------------------------------------------------------+
\`\`\`

## 2.2 Cloud Encryption and Key Management Architecture
- **Client-Side Encryption**: Data is encrypted locally before being transmitted to the CSP. CSP has zero visibility into keys.
- **Server-Side Encryption with Customer-Managed Keys (SSE-KMS)**: CSP encrypts data at rest, but keys are controlled in customer KMS/HSM instances.
- **Hardware Security Modules (HSMs)**: Dedicated cryptographic processors certified under FIPS 140-2/3 Level 3 providing tamper-resistant key isolation.
- **Tokenization vs Encryption**:
  - *Encryption*: Mathematical transformation using a key; reversibility depends on cryptographic algorithm and key custody.
  - *Tokenization*: Replacing sensitive data with a meaningless random surrogate token linked to an isolated database vault.`
  },
  {
    cert_id: CCSP_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Cloud Platform & Infrastructure Security',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 45,
    takeaways: 'Hypervisor types (Type 1 Bare-Metal vs Type 2 Hosted), VM escape mitigation, Software-Defined Networking (SDN) micro-segmentation, and cloud datacenter physical environmental controls.',
    tips: 'Type 1 hypervisors run directly on bare metal without a host OS, offering superior performance and smaller attack surface for multi-tenant isolation.',
    body: `# ISC2 CCSP Domain 3: Cloud Platform and Infrastructure Security

## 3.1 Cloud Virtualization & Hypervisor Security
- **Type 1 (Bare-Metal) Hypervisor**: Runs directly on physical hardware (e.g., VMware ESXi, KVM, Xen). High efficiency, low overhead, and smaller attack surface.
- **Type 2 (Hosted) Hypervisor**: Runs as an application on top of a host OS (e.g., VirtualBox, VMware Workstation).
- **Hypervisor Vulnerabilities**:
  - *VM Escape*: Attack code breaks out of the guest VM sandbox to gain control of the underlying hypervisor or host OS.
  - *Side-Channel Attacks (Meltdown/Spectre)*: Exploiting speculative execution and cache timing to extract sensitive data across tenant boundaries.

\`\`\`
+-------------------------------------------------------------------------+
|                  VIRTUALIZATION HYPERVISOR COMPARISON                   |
|                                                                         |
|  TYPE 1 (BARE METAL)                   TYPE 2 (HOSTED)                  |
|  +---------------------------+         +---------------------------+    |
|  | Guest VM 1 |  Guest VM 2  |         | Guest VM 1 |  Guest VM 2  |    |
|  +---------------------------+         +---------------------------+    |
|  | Type 1 Hypervisor (ESXi)  |         | Type 2 Hypervisor         |    |
|  +---------------------------+         +---------------------------+    |
|  | Physical Hardware (CPU)   |         | Host Operating System     |    |
|  +---------------------------+         +---------------------------+    |
|                                        | Physical Hardware (CPU)   |    |
|                                        +---------------------------+    |
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Software-Defined Networking (SDN) & Micro-Segmentation
- **Control Plane vs Data Plane**: SDN separates the decision-making brain (Control Plane) from packet-forwarding hardware (Data Plane).
- **Micro-Segmentation**: Enforcing granular Layer 4–7 firewall rules between individual virtual workloads within the same subnet, preventing lateral threat movement.`
  },
  {
    cert_id: CCSP_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Cloud Application Security & Secure SDLC',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 45,
    takeaways: 'Cloud Secure Software Development Lifecycle (SDLC), OWASP Top 10 vulnerabilities, SAST vs DAST vs IAST, API Security (OAuth 2.0 / OIDC), and Web Application Firewalls (WAFs).',
    tips: 'SAST analyzes source code at rest during build (white box); DAST tests executing applications over runtime endpoints (black box).',
    body: `# ISC2 CCSP Domain 4: Cloud Application Security

## 4.1 Cloud Secure SDLC Pipeline
Integrating security into every stage of software development (DevSecOps):
1. **Planning & Requirements**: Threat modeling (STRIDE), compliance requirements.
2. **Architecture & Design**: Secure API design, zero trust identity, microservice boundaries.
3. **Development (Coding)**: IDE secure coding linters, pre-commit secret scanners.
4. **Testing & QA**:
   - **Static Application Security Testing (SAST)**: White-box analysis of source code.
   - **Software Composition Analysis (SCA)**: Scanning open-source third-party dependencies for known CVEs.
   - **Dynamic Application Security Testing (DAST)**: Black-box automated penetration testing against running apps.
5. **Deployment & Operations**: Infrastructure as Code (IaC) linting, container image signing, WAF protection.

\`\`\`
+-------------------------------------------------------------------------+
|                      DEVSECOPS CI/CD SECURITY GATES                     |
|                                                                         |
|  [ Code ] ──> [ Commit: Pre-commit git secrets scan ]                   |
|                 │                                                       |
|                 ▼                                                       |
|  [ Build ] ─> [ SAST (SonarQube) + SCA (Snyk/Trivy) Dependency Scan ]   |
|                 │                                                       |
|                 ▼                                                       |
|  [ Test ] ──> [ DAST (OWASP ZAP) + Container Vulnerability Scan ]       |
|                 │                                                       |
|                 ▼                                                       |
|  [ Deploy ] > [ Signed Images + IaC Policy Enforcement (OPA/TFSec) ]    |
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 Federated Identity & Single Sign-On (SSO)
- **SAML 2.0 (Security Assertion Markup Language)**: XML-based standard for exchanging authentication assertions between an Identity Provider (IdP) and Service Provider (SP).
- **OAuth 2.0**: Authorization framework issuing access tokens permitting third parties to access user resources without passwords.
- **OpenID Connect (OIDC)**: Identity layer built on OAuth 2.0 issuing JSON Web Tokens (JWTs) containing verified identity claims.`
  },
  {
    cert_id: CCSP_ID,
    dom_num: 5,
    ch_num: 5,
    sort_order: 5,
    title: 'Domain 5: Cloud Security Operations & Digital Forensics',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 45,
    takeaways: 'Cloud Security Operations Center (SOC), SIEM/SOAR integration, continuous monitoring, patch management, cloud digital forensics challenges, and SLA compliance.',
    tips: 'In multi-tenant cloud forensics, live physical memory imaging of CSP host servers is impossible; reliance shifts to CSP API logs, hypervisor snapshots, and agent telemetry.',
    body: `# ISC2 CCSP Domain 5: Cloud Security Operations

## 5.1 Cloud Security Operations & Continuous Monitoring
Cloud SecOps requires automated telemetry collection across ephemeral cloud infrastructure:
- **Centralized Log Aggregation**: Streaming VPC Flow Logs, IAM audit trails (CloudTrail), container logs, and API gateway telemetry into immutable SIEM/data lakes.
- **SOAR (Security Orchestration, Automation and Response)**: Automated playbooks that isolate compromised EC2 instances, revoke compromised IAM tokens, and apply dynamic security groups.

\`\`\`
+-------------------------------------------------------------------------+
|                  CLOUD FORENSICS INVESTIGATION PIPELINE                 |
|                                                                         |
|  [ Alert Detected ] ──> Trigger automated containment playbook          |
|                           │                                             |
|                           ▼                                             |
|  [ Evidence Capture ] ─> Snapshot EBS volumes, capture volatile RAM dump|
|                           │                                             |
|                           ▼                                             |
|  [ Integrity Hashing ] > Compute SHA-256 hash of forensic snapshot      |
|                           │                                             |
|                           ▼                                             |
|  [ Chain of Custody ] ──> Document investigator actions in audit vault  |
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: CCSP_ID,
    dom_num: 6,
    ch_num: 6,
    sort_order: 6,
    title: 'Domain 6: Legal, Risk & Compliance Master Review (SOC / CSA STAR / ISO)',
    doc_title: 'ISC2 CCSP Official Study Guide & CSA Guidance v4.0',
    edition: '4th Edition (2026)',
    read_min: 45,
    takeaways: 'International privacy laws (GDPR, CCPA/CPRA, HIPAA), SOC 1 vs SOC 2 vs SOC 3 reports, ISO/IEC 27017 & 27018, eDiscovery (FRCP), and Cloud Audit Logging.',
    tips: 'SOC 2 Type I evaluates control design at a single point in time; SOC 2 Type II evaluates operating effectiveness over a minimum period (e.g. 6 months).',
    body: `# ISC2 CCSP Domain 6: Legal, Risk and Compliance

## 6.1 Service Organization Control (SOC) Frameworks
AICPA SOC reports provide independent assurance regarding third-party service provider controls:
- **SOC 1 (SSAE 18 / ISAE 3402)**: Evaluates internal controls over financial reporting (ICFR).
- **SOC 2 (Trust Services Criteria)**: Evaluates controls relevant to Security, Availability, Processing Integrity, Confidentiality, and Privacy.
  - *Type I*: Evaluates the suitability of control design at a **specific point in time**.
  - *Type II*: Tests the **operating effectiveness** of controls over a minimum testing period (typically 6 to 12 months). Highly valued by enterprise auditors.
- **SOC 3**: General public summary report of SOC 2 without technical confidential test details.

\`\`\`
+-------------------------------------------------------------------------+
|                     SOC REPORT COMPARISON MATRIX                        |
|                                                                         |
|  Report    Scope                       Audience        Distribution     |
|  ------    -----                       --------        ------------     |
|  SOC 1     Financial Reporting (ICFR)  CFOs, Auditors  Restricted       |
|  SOC 2     Security & Trust Criteria   CISOs, B2B      Restricted (NDA) |
|  SOC 3     Security Executive Summary  Public          Unrestricted     |
+-------------------------------------------------------------------------+
\`\`\`

## 6.2 ISO Cloud Security Standards
- **ISO/IEC 27017:2015**: Code of practice for information security controls based on ISO/IEC 27002 for cloud services, adding guidelines for both CSPs and cloud customers.
- **ISO/IEC 27018:2019**: Code of practice for protection of Personally Identifiable Information (PII) in public clouds acting as PII processors.`
  },

  // =========================================================================
  // AWS Certified Solutions Architect Associate (SAA-C03) (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: SAA_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Design Secure Architectures Master Blueprint (IAM, KMS & Network VPC)',
    doc_title: 'AWS Certified Solutions Architect Associate (SAA-C03) Official Guide',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'AWS IAM policies (Identity-based, Resource-based, Permissions Boundaries, SCPs), AWS KMS envelope encryption, VPC security (Security Groups vs NACLs), and AWS WAF / Shield.',
    tips: 'Security Groups are stateful (return traffic automatically allowed); Network ACLs (NACLs) are stateless and evaluate rules in numerical order.',
    body: `# AWS SAA-C03 Domain 1: Design Secure Architectures

## 1.1 AWS Identity and Access Management (IAM) Governance
AWS IAM manages authentication and authorization for AWS resources:
- **IAM Policies**: JSON documents defining permissions:
  \`\`\`json
  {
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::corporate-vault/*"]
    }]
  }
  \`\`\`
- **Evaluation Logic**: Explicit Deny > Explicit Allow > Default Deny (Implicit).
- **Service Control Policies (SCPs)**: Organizations-level guardrails setting the maximum permissions available to member accounts.

\`\`\`
+-------------------------------------------------------------------------+
|                  AWS VPC NETWORK DEFENSE ARCHITECTURE                   |
|                                                                         |
|  [ Internet ]                                                           |
|       │                                                                 |
|       ▼                                                                 |
|  [ Internet Gateway (IGW) / AWS WAF ]                                   |
|       │                                                                 |
|       ▼                                                                 |
|  [ Network ACL (NACL) - Stateless, Subnet-Level, Evaluates 1..100 ]     |
|       │                                                                 |
|       ▼                                                                 |
|  [ Security Group (SG) - Stateful, Instance-Level, Allow-Only Rules ]   |
|       │                                                                 |
|       ▼                                                                 |
|  [ Amazon EC2 Instance / Elastic Load Balancer ]                        |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 AWS Key Management Service (KMS) & Envelope Encryption
- **Envelope Encryption**: Data is encrypted using a unique plaintext Data Key ($DK$). The Data Key is itself encrypted using a Customer Master Key ($KMS\\text{ }CMK$) stored in an AWS HSM.
- **KMS Key Policies**: Primary method to control access to customer KMS keys.`
  },
  {
    cert_id: SAA_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Domain 2: Design Resilient Architectures Master Blueprint (Multi-AZ, ASG & Disaster Recovery)',
    doc_title: 'AWS Certified Solutions Architect Associate (SAA-C03) Official Guide',
    edition: '2026 Edition',
    read_min: 50,
    takeaways: 'Multi-AZ deployments, Auto Scaling Groups (ASG), Application Load Balancer (ALB), Amazon Route 53 routing policies, and the 4 AWS Disaster Recovery Strategies.',
    tips: 'Backup & Restore has highest RTO/RPO; Pilot Light keeps core data live; Warm Standby runs a scaled-down fleet; Multi-Site Active-Active has near-zero RTO/RPO.',
    body: `# AWS SAA-C03 Domain 2: Design Resilient Architectures

## 2.1 High Availability & Auto Scaling Infrastructure
- **Multi-AZ Architecture**: Deploying compute and database instances across multiple physically isolated Availability Zones (AZs) connected by low-latency fiber.
- **Auto Scaling Groups (ASG)**: Automatically scales EC2 capacity based on CPU metrics, target tracking, or scheduled scaling policies.
- **Application Load Balancer (ALB)**: Operates at Layer 7 (HTTP/HTTPS), supporting path-based routing, host-based routing, and SSL termination.

\`\`\`
+-------------------------------------------------------------------------+
|                    THE 4 AWS DISASTER RECOVERY TIERS                    |
|                                                                         |
|  Strategy              Cost         RTO / RPO      Description          |
|  --------              ----         ---------      -----------          |
|  1. Backup & Restore   Lowest       Hours to Days  S3 snapshots / tape  |
|  2. Pilot Light        Low          10 - 60 mins   Core DB live sync    |
|  3. Warm Standby       Medium       Sub-10 mins    Scaled-down fleet    |
|  4. Multi-Site Active  Highest      Near-Zero      Full active clusters |
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: SAA_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Design High-Performing Architectures (Compute, Storage & Caching)',
    doc_title: 'AWS Certified Solutions Architect Associate (SAA-C03) Official Guide',
    edition: '2026 Edition',
    read_min: 45,
    takeaways: 'Amazon Aurora Multi-Master / Global Database, Amazon ElastiCache (Redis / Memcached), Amazon CloudFront edge caching, and decoupled messaging with SQS / SNS / EventBridge.',
    tips: 'Amazon SQS decouples components and absorbs traffic spikes; SQS Standard provides at-least-once delivery with best-effort ordering; FIFO ensures exact once with strict FIFO order.',
    body: `# AWS SAA-C03 Domain 3: Design High-Performing Architectures

## 3.1 Caching Strategies and Content Delivery
- **Amazon CloudFront**: Global Content Delivery Network (CDN) with 600+ Edge Locations caching static and dynamic web content closer to end-users.
- **Amazon ElastiCache**: In-memory data store for sub-millisecond query responses (Redis for pub/sub, clustering, sorted sets; Memcached for simple object caching).

\`\`\`
+-------------------------------------------------------------------------+
|                  DECOUPLED ASYNCHRONOUS ARCHITECTURE                    |
|                                                                         |
|  [ Web Client ] ──> [ ALB ] ──> [ EC2 Web Tier ]                        |
|                                      │                                  |
|                                      ▼                                  |
|  [ Amazon SQS Queue ] <=== Decoupled Message Buffer                     |
|         │                                                               |
|         ▼                                                               |
|  [ EC2 Auto Scaling Worker Fleet ] ──> [ Amazon Aurora DB ]             |
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: SAA_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Design Cost-Optimized Architectures (S3 Lifecycle & Compute Savings)',
    doc_title: 'AWS Certified Solutions Architect Associate (SAA-C03) Official Guide',
    edition: '2026 Edition',
    read_min: 45,
    takeaways: 'S3 Storage Classes (Standard, Infrequent Access, Intelligent-Tiering, Glacier Flexible, Glacier Deep Archive), EC2 Pricing Models (On-Demand, Savings Plans, Spot Instances), and AWS Cost Explorer.',
    tips: 'Spot Instances provide up to 90% discount for fault-tolerant, stateless batch workloads that can handle interruptions with a 2-minute warning.',
    body: `# AWS SAA-C03 Domain 4: Design Cost-Optimized Architectures

## 4.1 Amazon S3 Lifecycle Cost Optimization
Amazon Simple Storage Service (S3) provides tiered storage optimized for access frequency:

\`\`\`
+-------------------------------------------------------------------------+
|                      AMAZON S3 STORAGE TIER MATRIX                      |
|                                                                         |
|  Class                    Durability   Min Days   Retrieval Cost / Time |
|  -----                    ----------   --------   --------------------- |
|  S3 Standard              99.999999999%   None    Instant (No Fee)      |
|  S3 Intelligent-Tiering   99.999999999%   30      Instant (Auto-tuned)  |
|  S3 Standard-IA           99.999999999%   30      Instant (Retrieval $) |
|  S3 Glacier Flexible      99.999999999%   90      Minutes to Hours      |
|  S3 Glacier Deep Archive  99.999999999%   180     12 to 48 Hours ($0.00099/GB)|
+-------------------------------------------------------------------------+
\`\`\`

## 4.2 EC2 Compute Cost Optimization Models
1. **On-Demand**: Maximum flexibility with zero commitment; ideal for irregular spikes and development testing.
2. **Savings Plans / Reserved Instances (RIs)**: Up to 72% discount for committing to consistent compute usage over 1 or 3 years.
3. **Spot Instances**: Up to 90% discount utilizing excess AWS capacity; best for stateless batch workloads, CI/CD runners, and big data processing.`
  }
];

async function enrichCloudChapters() {
  await client.connect();
  console.log('=== ENRICHING CCSP & AWS SAA-C03 STUDY MATERIALS TO TEXTBOOK DEPTH ===\n');

  for (const item of CLOUD_CHAPTERS) {
    const domRes = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [item.cert_id, item.dom_num]);
    if (domRes.rows.length === 0) continue;
    const domainId = domRes.rows[0].id;

    const existing = await client.query(
      'SELECT id FROM study_materials WHERE certification_id = $1 AND (title = $2 OR (chapter_number = $3 AND domain_id = $4)) LIMIT 1',
      [item.cert_id, item.title, item.ch_num, domainId]
    );

    if (existing.rows.length > 0) {
      await client.query(`
        UPDATE study_materials
        SET title = $1, content_body = $2, estimated_read_minutes = $3,
            key_takeaways = $4, exam_tips = $5, document_title = $6,
            edition = $7, chapter_number = $8, sort_order = $9, domain_id = $10
        WHERE id = $11;
      `, [
        item.title, item.body, item.read_min, item.takeaways, item.tips,
        item.doc_title, item.edition, item.ch_num, item.sort_order, domainId,
        existing.rows[0].id
      ]);
      console.log(`[UPDATED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    } else {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, title, content_type,
          content_body, sort_order, document_title, edition, chapter_number,
          estimated_read_minutes, key_takeaways, exam_tips
        ) VALUES (gen_random_uuid(), $1, $2, $3, 'text', $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        item.cert_id, domainId, item.title, item.body, item.sort_order,
        item.doc_title, item.edition, item.ch_num, item.read_min, item.takeaways, item.tips
      ]);
      console.log(`[INSERTED] [${item.doc_title}] ${item.title} (${item.body.length.toLocaleString()} chars)`);
    }
  }

  console.log('\n✅ Cloud & Architecture Study Materials successfully enriched to deep textbook grade!');
  await client.end();
}

enrichCloudChapters().catch(console.error);
