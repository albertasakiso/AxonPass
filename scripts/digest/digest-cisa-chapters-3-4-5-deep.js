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

const CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001';

// ===========================================================================
// CHAPTER 3: IS ACQUISITION, DEVELOPMENT & IMPLEMENTATION (MODULES 3.1 - 3.4)
// ===========================================================================
const mod3_1Markdown = `# Module 3.1: Project Governance, Business Case & SDLC Quality Gates

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Business Case is the Benchmark:** Every project starts with a Business Case calculating Net Present Value (NPV), ROI, and payback period. The Business Case remains the benchmark during the Post-Implementation Review (PIR) to evaluate benefits realization.
> * **SDLC Phase Gates:** Requirements must be formally approved before design; design approved before coding; testing signed off before cutover.
> * **Sanitizing Test Data:** Copying unmasked production databases to testing environments violates privacy laws. Production test data MUST be synthesized or scrambled.

---

## 1. Project Management & Governance

Projects must be managed within the constraints of scope, time, cost, and quality (The Project Management Iron Triangle).

### 1.1 Project Governance Bodies
- **Project Sponsor:** Executive who champions the project, secures funding, and owns business benefits.
- **Project Management Office (PMO):** Standardizes project governance, methodologies, and metrics.
- **Project Steering Committee:** Cross-functional body that monitors milestone progress and approves scope changes.

---

## 2. System Development Life Cycle (SDLC) Phases

The traditional Waterfall and Modern Agile/DevSecOps lifecycles establish strict quality gates:

1. **Feasibility Study:** Evaluates financial, technical, and operational viability.
2. **Requirements Definition:** Elicitation of functional and security requirements (signed by business process owners).
3. **Software Architecture & Design:** Database schemas, API contracts, threat modeling, and input/output validation.
4. **Development & Unit Testing:** Secure coding standards (OWASP Top 10) and automated Static Application Security Testing (SAST).
5. **Integration & System Testing:** Testing end-to-end interactions between components and external services.
6. **User Acceptance Testing (UAT):** Business users validate that the application fulfills business needs.
7. **Implementation / Cutover:** Production deployment, data migration, and fallback mechanisms.
8. **Post-Implementation Review (PIR):** Assesses whether project goals and ROI were achieved (conducted 3–6 months post-deployment).`;

const mod3_2Markdown = `# Module 3.2: Agile Methodologies, DevSecOps & CI/CD Security

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **DevSecOps ("Shift Left"):** Integrating security testing directly into early coding and CI/CD pipelines rather than waiting for penetration testing right before release.
> * **Agile Ceremonies & Roles:**
>   - **Product Owner:** Prioritizes the Product Backlog.
>   - **Scrum Master:** Removes roadblocks and enforces Scrum discipline.
>   - **Sprint Retrospective:** Continuous process improvement at the end of each sprint.
> * **Automated Security Tooling:**
>   - **SAST (Static Analysis):** Analyzes source code without executing it (white-box).
>   - **DAST (Dynamic Analysis):** Tests running application from outside (black-box).
>   - **SCA (Software Composition Analysis):** Scans open-source third-party dependencies for known CVEs.

---

## 1. Agile & Scrum Framework

Agile replaces rigid sequential waterfall models with iterative, incremental 2-to-4 week sprints.

| **Waterfall Model** | **Agile / Scrum Model** |
| :--- | :--- |
| Sequential phases (Requirements -> Design -> Code -> Test) | Iterative sprints producing working software increments |
| Heavy upfront documentation | Working software over comprehensive documentation |
| Scope is fixed; Time and Cost vary | Time and Cost are fixed (Sprints); Scope varies (Backlog) |
| Testing happens at the end | Testing is continuous and automated in every sprint |

---

## 2. Automated DevSecOps Pipeline Architecture

Modern software delivery relies on Continuous Integration and Continuous Deployment (CI/CD):
- **Commit Phase:** Developer commits code -> Pre-commit hooks run linter and secret scanners.
- **Build Phase:** Automated compile -> Unit tests -> SAST scanner analyzes code vulnerabilities.
- **Package Phase:** Container image build -> SCA scans dependencies for vulnerable libraries.
- **Deploy to Staging:** DAST automated vulnerability scanner attacks running staging endpoints.
- **Production Gate:** Automated policy checks -> Deployment with automated canary rollouts.`;

const mod3_3Markdown = `# Module 3.3: Software Testing Hierarchy & Quality Assurance

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Testing Progression Hierarchy:**
>   1. **Unit Testing:** Individual functions tested in isolation by developers.
>   2. **Integration Testing:** Interaction between two or more modules.
>   3. **System Testing:** The entire integrated application operating as a whole.
>   4. **UAT (User Acceptance Testing):** Performed by BUSINESS END USERS in a realistic staging environment.
>   5. **Regression Testing:** Re-running previous tests after code changes to ensure existing functionality didn't break.
> * **UAT is the Final Quality Gate:** Production cutover must NEVER proceed without formal UAT sign-off from business process owners.

---

## 1. Software Testing Taxonomy

Testing provides objective evidence of software stability, performance, and security.

### 1.1 Testing Types Comparison
- **Unit Testing (White-Box):** Conducted by programmers to test individual functions, classes, and logic branches.
- **Integration Testing:** Tests interfaces, API data contracts, and middleware communication between distinct components.
- **System Testing:** Validates end-to-end functionality, load capacity, stress limits, and disaster recovery failover.
- **Regression Testing:** Automated suite executed whenever new code is merged to ensure bug fixes do not introduce new defects.
- **User Acceptance Testing (UAT):** Business users test real-world scenarios to confirm the software meets operational requirements.
- **Fuzz Testing (Fuzzing):** Feeding random, malformed, or invalid inputs into software to identify crashes and buffer overflows.

---

## 2. Test Data Privacy & Protection
- Copying unmasked production databases to staging or development environments exposes customer PII and violates global privacy regulations (GDPR, HIPAA, CCPA).
- **Remediation:** Data masking, pseudonymization, or generating synthetic test datasets.`;

const mod3_4Markdown = `# Module 3.4: Data Migration, Cutover Strategies & Post-Implementation Review

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Cutover Strategies Comparison:**
>   - **Parallel Cutover:** **LOWEST RISK, HIGHEST COST.** Old and new systems run simultaneously. Outputs are compared until parity is verified.
>   - **Direct Cutover (Plunge / Big Bang):** **HIGHEST RISK, LOWEST COST.** Old system shut down instantly; no fallback if new system fails.
>   - **Phased Cutover:** System deployed in stages (module-by-module).
>   - **Pilot Cutover:** System deployed at a single test branch or subsidiary before enterprise rollout.
> * **Post-Implementation Review (PIR):** Must be conducted **3 to 6 months AFTER stabilization** (NOT immediately on launch day) to allow operational settling and accurate ROI measurement against the original Business Case.

---

## 1. Data Migration & Cleansing Controls

Data migration transfers historical records from legacy databases to the new enterprise system.

### 1.1 Key Migration Controls
1. **Data Cleansing:** Standardizing records, eliminating duplicates, and purging obsolete data before migration.
2. **Data Mapping:** Documenting source-to-target field transformations.
3. **Record Count Reconciliation:** Automated checksums and hash totals verifying that all source rows were transferred.
4. **Fallback / Rollback Plan:** Tested procedures to revert to legacy systems if migration fails.

---

## 2. Cutover Strategies Comparison Matrix

| Strategy | Risk Level | Operational Cost | Characteristics |
| :--- | :--- | :--- | :--- |
| **Parallel Cutover** | **Lowest** | **Highest** | Both old and new systems run simultaneously; dual data entry; outputs compared |
| **Phased Cutover** | Moderate | Moderate | Rollout is staged by functional module or department |
| **Pilot Cutover** | Low-Moderate | Moderate | System is deployed to a single test location before enterprise rollout |
| **Direct Cutover** | **Highest** | **Lowest** | Sudden switch-over; old system decommissioned immediately; high impact if bug occurs |

---

## 3. Post-Implementation Review (PIR)

The PIR is the final phase of the SDLC.
- **Timing:** Conducted 3–6 months post-go-live.
- **Key Objectives:**
  - Verify that business requirements and ROI promised in the initial **Business Case** were realized.
  - Assess system performance, user satisfaction, and internal control effectiveness under normal operations.
  - Document lessons learned to improve future development projects.`;

// ===========================================================================
// CHAPTER 4: OPERATIONS AND RESILIENCE (MODULES 4.1 - 4.4)
// ===========================================================================
const mod4_1Markdown = `# Module 4.1: ITSM Operations, Incident, Problem & Change Management

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Incident vs Problem Management:**
>   - **Incident Management:** Objective is **RAPID RESTORATION** of normal service operation (often using quick workarounds).
>   - **Problem Management:** Objective is **ROOT CAUSE ANALYSIS (RCA)** to permanently prevent recurring incidents.
> * **Emergency Change Procedures:** When a critical production outage occurs, emergency changes can be implemented immediately, but MUST be formally documented and retrospectively reviewed by the CAB within 24–48 hours.

---

## 1. IT Service Management (ITSM) Core Processes

ITSM aligns IT services with business needs using standardized operational lifecycles (ITIL v4).

### 1.1 Incident vs Problem vs Change Management

| **Process** | **Primary Objective** | **Key Activity** |
| :--- | :--- | :--- |
| **Incident Management** | Restore normal service as quickly as possible with minimal business disruption. | Ticket triage, workarounds, service desk escalation. |
| **Problem Management** | Identify root causes of incidents and prevent recurring disruptions. | Root Cause Analysis (RCA), Known Error Database (KEDB). |
| **Change Management** | Ensure standard methods are used for efficient handling of all production changes. | Change Advisory Board (CAB) reviews, rollback testing. |
| **Release Management** | Plan, schedule, and control the deployment of software releases into production. | Automated staging deployment, blue-green cutover. |

---

## 2. Change Advisory Board (CAB) Governance
- Every production change request (RFC) must document:
  - Technical justification and business impact assessment.
  - Comprehensive rollback and fallback plan in case of failure.
  - Pre-deployment testing evidence and user approval.`;

const mod4_2Markdown = `# Module 4.2: Data Center Environmental, Power & Physical Defenses

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Positive Air Pressure:** Server rooms must maintain **positive air pressure** so that when doors open, clean filtered air flows outward, preventing external dust contamination.
> * **UPS vs Generators:** UPS battery banks provide **immediate bridge power for 15–30 minutes** until backup diesel generators synchronize and take full electrical load.
> * **Clean Agent Fire Suppression:** FM-200, Novec 1230, and Inergen extinguish fires by removing heat or oxygen without leaving residue or damaging active electronics.

---

## 1. Physical Perimeter & Server Room Defenses

Physical security prevents unauthorized physical entry and environmental hazards.

### 1.1 Layered Physical Perimeter
1. **Outer Perimeter:** 8-foot chain-link fence with barbed wire overhang, vehicle bollards to stop ram-raiding.
2. **Building Entry:** Badge readers (RFID), security guard stations, and **mantraps** (preventing piggybacking/tailgating).
3. **Data Center Floor:** Biometric multi-factor authentication, 24/7 CCTV surveillance (90-day retention), lockable server racks.

---

## 2. Environmental Controls & Power Continuity
- **HVAC Temperature & Humidity:** Temperature maintained at 18°C–27°C (64°F–81°F); relative humidity at 40%–60% (low humidity causes static electricity; high humidity causes condensation/corrosion).
- **Water Leak Detection:** Rope moisture sensors installed under raised flooring near cooling units.
- **Fire Suppression Systems:**
  - **Pre-Action Dry-Pipe Sprinklers:** Pipes remain dry until smoke detectors trip the valve, preventing accidental water leaks.
  - **Clean Agent Gaseous Suppression:** Floods server room with non-conductive gas (FM-200 / Novec 1230) to extinguish electrical fires safely.`;

const mod4_3Markdown = `# Module 4.3: Business Impact Analysis (BIA) & Resilience Metrics

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Core Resilience Metrics:**
>   - **RTO (Recovery Time Objective):** Maximum acceptable duration of system downtime forward in time.
>   - **RPO (Recovery Point Objective):** Maximum acceptable data loss measured back in time (frequency of backups).
>   - **MTPD (Maximum Tolerable Period of Disruption):** Fatal threshold beyond which the organization cannot recover.
>   - **SDO (Service Delivery Objective):** Minimum acceptable operational service level during disaster recovery.
> * **The Golden Relationship:** **$$\\text{RTO} \\le \\text{MTPD}$$** (If RTO exceeds MTPD, the business will fail before recovery completes!).

---

## 1. Business Impact Analysis (BIA) Lifecycle

The BIA is the foundational first step in Business Continuity Planning (BCP).

### 1.1 Objectives of the BIA:
1. Identify all critical business functions and supporting IT assets.
2. Quantify the financial and operational impact of disruptions over time.
3. Establish recovery timeframes (RTO, RPO, MTPD).
4. Prioritize recovery order based on criticality.

---

## 2. Mathematical Disaster Recovery Metrics

$$\\mathbf{RPO} = \\text{Maximum Tolerable Data Loss (Time Window)}$$
$$\\mathbf{RTO} = \\text{Maximum Tolerable System Downtime}$$
$$\\mathbf{MTPD} = \\text{Fatal Disruption Limit}$$

| Metric | Target | Technical Mechanism |
| :--- | :--- | :--- |
| **RPO = 0** | Zero data loss | Synchronous real-time database replication (Multi-AZ) |
| **RPO = 1 Hour** | Up to 1 hour data loss | Hourly database transaction log snapshots |
| **RTO = 15 Mins** | Operational in 15 mins | Hot Site with automated load balancer failover |
| **RTO = 48 Hours**| Operational in 2 days | Warm/Cold Site with restore from backup media |`;

const mod4_4Markdown = `# Module 4.4: Disaster Recovery Sites, Backup Strategies & Testing

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Alternate Site Types:**
>   - **Hot Site:** Fully equipped hardware + real-time data replication. Ready in **minutes/hours** (Highest cost).
>   - **Warm Site:** Hardware present; data must be restored from backup. Ready in **hours/days** (Moderate cost).
>   - **Cold Site:** Empty shell with power and HVAC; hardware must be procured and configured. Ready in **weeks** (Lowest cost).
>   - **Mobile Site:** Self-contained modular trailer/container with equipment.
> * **DR Testing Progression:** Tabletop Walkthrough -> Structured Walkthrough -> Simulation -> Parallel Test -> **Full Interruption Test** (Most realistic, but highest risk to production!).

---

## 1. Backup Strategies Comparison

- **Full Backup:** Copies all data. Longest backup time, fastest restore time.
- **Differential Backup:** Copies all data modified since the **last Full backup**. Moderate backup time, requires Full + 1 Differential to restore.
- **Incremental Backup:** Copies all data modified since the **last backup of any type**. Fastest backup time, requires Full + ALL intermediate Incrementals to restore.

---

## 2. Disaster Recovery Testing Methodologies

1. **Tabletop Review / Checklist:** Team reviews the plan document around a table to verify completeness.
2. **Structured Walkthrough:** Team talks through disaster scenarios step-by-step to find procedural gaps.
3. **Simulation Test:** Emergency response team mobilizes in a simulated crisis without affecting live production.
4. **Parallel Test:** Operations are activated at the backup recovery site alongside live production.
5. **Full Interruption Test:** Complete shutdown of primary data center; entire business operates solely from the disaster recovery site. (*Requires executive sign-off due to high risk*).`;

// ===========================================================================
// CHAPTER 5: PROTECTION OF INFORMATION ASSETS (MODULES 5.1 - 5.4)
// ===========================================================================
const mod5_1Markdown = `# Module 5.1: Identity & Access Management (IAM), Biometrics & Zero Trust

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Biometric Error Rates:**
>   - **False Acceptance Rate (FAR / Type II Error):** Impostor is incorrectly accepted. (**CRITICAL SECURITY RISK**).
>   - **False Rejection Rate (FRR / Type I Error):** Authorized user is incorrectly rejected. (**USER FRUSTRATION**).
>   - **Crossover Error Rate (CER / EER):** Point where FAR = FRR. Benchmark for device quality (LOWER CER = BETTER DEVICE).
> * **Multi-Factor Authentication (MFA):** Requires 2+ distinct categories (Something you know, Something you have, Something you are). Two passwords is NOT MFA (same category).

---

## 1. Identity & Access Management (IAM)

IAM governs the lifecycle of user identities and ensures least privilege access.

### 1.1 Multi-Factor Authentication (MFA) Categories
1. **Something You Know:** Passwords, PINs, secret passphrases.
2. **Something You Have:** Smartcards, hardware tokens (YubiKey), smartphone authenticator OTPs.
3. **Something You Are (Biometrics):** Fingerprints, iris patterns, facial geometry, retina scans.

---

## 2. Biometric Performance Evaluation (The CER Curve)

$$\\mathbf{\\text{CER}} = \\text{Point where } \\mathbf{FAR = FRR}$$

- High-security facilities (bank vaults) configure biometrics to minimize FAR, accepting higher FRR.
- Consumer applications (smartphones) configure biometrics to minimize FRR for user convenience.`;

const mod5_2Markdown = `# Module 5.2: Cryptographic Architecture, PKI & Digital Signatures

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Symmetric vs Asymmetric:**
>   - **Symmetric (AES-256):** 1 shared secret key. Fast, used for bulk data encryption at rest.
>   - **Asymmetric (RSA, ECC):** 2 mathematically linked keys (Public & Private). Used for key exchange and digital signatures.
> * **Digital Signature Mechanism:**
>   - Sender hashes document -> Encrypts hash with sender's **PRIVATE KEY**.
>   - Recipient decrypts signature using sender's **PUBLIC KEY** -> Verifies **Integrity, Authenticity, and Non-Repudiation**.
> * **Certificate Revocation:** OCSP (Online Certificate Status Protocol) provides real-time revocation checks, replacing slow Certificate Revocation Lists (CRLs).

---

## 1. Cryptographic Algorithms & Key Lengths
- **AES (Advanced Encryption Standard):** Standard symmetric cipher (128, 192, 256-bit keys).
- **RSA (Rivest-Shamir-Adleman):** Standard asymmetric cipher (2048 to 4096-bit keys).
- **SHA-256 / SHA-3:** Cryptographic hash functions providing collision resistance.

---

## 2. Public Key Infrastructure (PKI) Architecture
- **Certificate Authority (CA):** Trusted entity that issues and signs digital certificates.
- **Registration Authority (RA):** Verifies identity of certificate applicants before CA issuance.
- **Certificate Revocation:** OCSP queries CA in real-time to verify certificate validity.`;

const mod5_3Markdown = `# Module 5.3: Network Perimeter Defense, Firewalls & Intrusion Prevention

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Firewall Generations:**
>   - **Packet Filtering (Stateless):** Inspects header IP/Port only (Layer 3/4).
>   - **Stateful Inspection:** Tracks TCP connection states in a state table (Layer 4).
>   - **Next-Gen Firewall (NGFW):** Inspects full application payload and SSL traffic (Layer 7).
>   - **WAF (Web Application Firewall):** Protects web apps against OWASP Top 10 (SQLi, XSS).
> * **IDS vs IPS:**
>   - **IDS (Detection):** Passive monitor; generates alerts upon anomaly.
>   - **IPS (Prevention):** Inline device; actively drops malicious packets.

---

## 1. Network Boundary Defenses

Perimeter defense enforces network segmentation and traffic filtering.

### 1.1 Firewall Taxonomy
- **DMZ (Demilitarized Zone):** Subnet isolating public-facing servers (web/mail) from the internal private network.
- **Proxy Servers:** Intercepts client outbound requests, caches content, and hides internal IP addresses.
- **Web Application Firewall (WAF):** Deployed in front of HTTP/HTTPS web servers to block SQL injection and cross-site scripting.`;

const mod5_4Markdown = `# Module 5.4: Digital Forensics, Order of Volatility & Incident Response

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Order of Volatility (RFC 3227):** Evidence must be collected starting with the most perishable state:
>   1. CPU registers & cache
>   2. RAM / ARP cache / Process tables
>   3. Temporary files / swap space
>   4. Hard disk / SSD storage
>   5. Remote logging / SIEM
>   6. Archival backup media
> * **Forensic Disk Imaging:** ALWAYS connect a hardware **Write Blocker** to source media and perform a **Bit-Stream Disk Image** with SHA-256 hash verification. Never analyze live original evidence!

---

## 1. Digital Forensics Principles & Legal Admissibility

Digital forensics is the scientifically proven identification, preservation, extraction, and documentation of digital evidence.

### 1.1 The 4 Forensic Rules of Evidence:
1. **Admissible:** Must conform to legal standards and rules of evidence.
2. **Authentic:** Proves the evidence came from the crime scene without tampering (Chain of Custody).
3. **Complete:** Includes all exculpatory and incriminating evidence.
4. **Reliable:** Forensic acquisition tools and procedures must be scientifically sound and reproducible.

---

## 2. Chain of Custody Governance
- Detailed log documenting every individual who collected, transported, analyzed, and stored evidence.
- Any unbroken gap in the chain of custody renders digital evidence inadmissible in court.`;

const ALL_NEW_CHAPTERS = [
  // Chapter 3 Modules
  { chapterNumber: 3, sectionNumber: 'Module 3.1', domainNum: 3, title: 'Chapter 3 (Part 1): Project Governance, Business Case & SDLC Quality Gates', pageStart: 216, pageEnd: 240, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Project Sponsor, PMO, Business Case, SDLC Phase Gates, and Test Data Sanitization.', examTips: 'Business case is benchmark for PIR. Test data must be sanitized.', contentMarkdown: mod3_1Markdown },
  { chapterNumber: 3, sectionNumber: 'Module 3.2', domainNum: 3, title: 'Chapter 3 (Part 2): Agile Methodologies, DevSecOps & CI/CD Security', pageStart: 241, pageEnd: 265, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Agile/Scrum ceremonies, DevSecOps shift-left, SAST vs DAST vs SCA.', examTips: 'SAST scans source code; DAST attacks running apps; SCA scans open-source libraries.', contentMarkdown: mod3_2Markdown },
  { chapterNumber: 3, sectionNumber: 'Module 3.3', domainNum: 3, title: 'Chapter 3 (Part 3): Software Testing Hierarchy & Quality Assurance', pageStart: 266, pageEnd: 290, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Unit, Integration, System, UAT, Regression, and Fuzz testing.', examTips: 'UAT is performed by business end users and is the final quality gate.', contentMarkdown: mod3_3Markdown },
  { chapterNumber: 3, sectionNumber: 'Module 3.4', domainNum: 3, title: 'Chapter 3 (Part 4): Data Migration, Cutover Strategies & PIR', pageStart: 291, pageEnd: 320, estimatedReadMinutes: 45, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Data cleansing, Parallel vs Direct vs Phased vs Pilot cutover, PIR timing (3-6 months).', examTips: 'Parallel is safest (highest cost). Direct is riskiest. PIR occurs 3-6 months after stabilization.', contentMarkdown: mod3_4Markdown },

  // Chapter 4 Modules
  { chapterNumber: 4, sectionNumber: 'Module 4.1', domainNum: 4, title: 'Chapter 4 (Part 1): ITSM Operations, Incident, Problem & Change Management', pageStart: 321, pageEnd: 350, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Incident (fast restore) vs Problem (root cause), CAB reviews, emergency changes.', examTips: 'Incident management restores service fast. Emergency changes require retroactive CAB review.', contentMarkdown: mod4_1Markdown },
  { chapterNumber: 4, sectionNumber: 'Module 4.2', domainNum: 4, title: 'Chapter 4 (Part 2): Data Center Environmental, Power & Physical Defenses', pageStart: 351, pageEnd: 380, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Positive air pressure, UPS bridge power, Clean-agent FM-200/Novec 1230 fire suppression, Mantraps.', examTips: 'Positive air pressure stops dust. UPS bridges power for 15-30 mins until diesel generators start.', contentMarkdown: mod4_2Markdown },
  { chapterNumber: 4, sectionNumber: 'Module 4.3', domainNum: 4, title: 'Chapter 4 (Part 3): Business Impact Analysis (BIA) & Resilience Metrics', pageStart: 381, pageEnd: 410, estimatedReadMinutes: 45, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'BIA lifecycle, RTO vs RPO vs MTPD vs SDO calculations.', examTips: 'RTO is downtime forward; RPO is data loss backward. RTO must be <= MTPD.', contentMarkdown: mod4_3Markdown },
  { chapterNumber: 4, sectionNumber: 'Module 4.4', domainNum: 4, title: 'Chapter 4 (Part 4): Disaster Recovery Sites, Backup Strategies & Testing', pageStart: 411, pageEnd: 435, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Hot vs Warm vs Cold sites, Full vs Differential vs Incremental backups, 5 DR test types.', examTips: 'Full interruption test is most realistic but riskiest. Hot site is operational in minutes.', contentMarkdown: mod4_4Markdown },

  // Chapter 5 Modules
  { chapterNumber: 5, sectionNumber: 'Module 5.1', domainNum: 5, title: 'Chapter 5 (Part 1): IAM, Biometrics & Zero Trust', pageStart: 436, pageEnd: 465, estimatedReadMinutes: 45, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'MFA categories, FAR vs FRR vs CER crossover error rate.', examTips: 'FAR is Type II (security flaw). FRR is Type I (frustration). CER is where FAR=FRR (lower is better).', contentMarkdown: mod5_1Markdown },
  { chapterNumber: 5, sectionNumber: 'Module 5.2', domainNum: 5, title: 'Chapter 5 (Part 2): Cryptographic Architecture, PKI & Digital Signatures', pageStart: 466, pageEnd: 495, estimatedReadMinutes: 45, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'AES vs RSA, Digital signature signing with Private Key, OCSP revocation.', examTips: 'Digital signatures provide Integrity, Authenticity, Non-repudiation. OCSP checks revocation in real time.', contentMarkdown: mod5_2Markdown },
  { chapterNumber: 5, sectionNumber: 'Module 5.3', domainNum: 5, title: 'Chapter 5 (Part 3): Network Perimeter Defense, Firewalls & IPS', pageStart: 496, pageEnd: 525, estimatedReadMinutes: 40, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Stateful vs NGFW vs WAF, DMZ architecture, IDS vs IPS inline blocking.', examTips: 'WAF protects web apps against OWASP Top 10. IPS actively drops malicious packets inline.', contentMarkdown: mod5_3Markdown },
  { chapterNumber: 5, sectionNumber: 'Module 5.4', domainNum: 5, title: 'Chapter 5 (Part 4): Digital Forensics, Order of Volatility & Chain of Custody', pageStart: 526, pageEnd: 560, estimatedReadMinutes: 45, fileRef: 'CISA Official Review Manual, 28th Edition 2024 by ISACA.pdf', keyTakeaways: 'Order of Volatility (RFC 3227), Write Blockers, Bit-Stream disk imaging, Chain of Custody.', examTips: 'Order of Volatility: CPU/RAM first, hard drive later. Write blocker prevents evidence alteration.', contentMarkdown: mod5_4Markdown },
];

async function runDeepChapters345Digestion() {
  try {
    await client.connect();
    console.log('=== DIGESTING DEEP EXHAUSTIVE CHAPTERS 3, 4, 5 MODULE-BY-MODULE ===\n');

    // Fetch Domain mappings
    const domRes = await client.query(`
      SELECT d.id, d.domain_number FROM domains d 
      JOIN certifications c ON d.certification_id = c.id 
      WHERE c.slug = 'cisa'
    `);
    const domainMap = {};
    domRes.rows.forEach(r => {
      domainMap[r.domain_number] = r.id;
    });

    // Delete existing Chapters 3, 4, 5 summary records
    await client.query(`
      DELETE FROM study_materials 
      WHERE certification_id = $1 AND chapter_number IN (3, 4, 5)
    `, [CISA_CERT_ID]);
    console.log('Cleared previous summary records for Chapters 3, 4, 5.');

    // Ingest all modules
    let sortOrder = 9;
    for (const mod of ALL_NEW_CHAPTERS) {
      const domainId = domainMap[mod.domainNum];
      const res = await client.query(`
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
        VALUES ($1, $2, $3, 'text', $4, 'ISACA CISA Review Manual', '28th Edition (2024–2026)', $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `, [
        CISA_CERT_ID,
        domainId,
        mod.title,
        mod.contentMarkdown,
        mod.chapterNumber,
        mod.sectionNumber,
        mod.pageStart,
        mod.pageEnd,
        mod.estimatedReadMinutes,
        mod.fileRef,
        mod.keyTakeaways,
        mod.examTips,
        sortOrder++
      ]);

      console.log(`✓ Ingested [Ch.${mod.chapterNumber} ${mod.sectionNumber}] ${mod.title} (ID: ${res.rows[0].id})`);
    }

    const countRes = await client.query(`
      SELECT count(*) FROM study_materials WHERE certification_id = $1
    `, [CISA_CERT_ID]);

    console.log('\n=============================================');
    console.log(`Deep Digestion for Chapters 1 to 5 Completed!`);
    console.log(`Total CISA Manual Modules in DB: ${countRes.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during deep Chapters 3, 4, 5 digestion:', err);
  } finally {
    await client.end();
  }
}

runDeepChapters345Digestion();
