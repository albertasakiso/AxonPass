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

const CC_CERT_ID = 'a0000000-0000-0000-0000-000000000002';

function hashContent(text) {
  return crypto.createHash('sha256').update(text.trim().toLowerCase().replace(/\s+/g, ' ')).digest('hex');
}

// 1. Deep Ingest for ISC2 CC Chapters 1 - 5
const CC_DEEP_CHAPTERS = [
  {
    chapterNumber: 1,
    sectionNumber: 'Ch. 1.0',
    domainNum: 1,
    title: 'Chapter 1: Security Principles, CIA Triad & Ethics',
    pageStart: 1,
    pageEnd: 45,
    estimatedReadMinutes: 35,
    fileRef: 'Chapter - 1.pdf',
    keyTakeaways: 'Confidentiality, Integrity, Availability, Authentication, Authorization, Accounting, Risk equation (R = T x V x I), and the 4 ISC2 Canons in strict priority order.',
    examTips: 'The 4 ISC2 Canons must be observed in STRICT order of precedence: 1. Protect society/public trust. 2. Act honorably/legally. 3. Diligent service to principals. 4. Advance profession. Human safety always comes before asset protection.',
    contentMarkdown: `# Chapter 1: Security Principles, CIA Triad & Professional Ethics

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The 4 ISC2 Code of Ethics Canons (In Strict Order):**
>   1. **Protect society, the common good, necessary public trust and confidence, and the infrastructure.** (Highest priority!)
>   2. **Act honorably, honestly, justly, responsibly, and legally.**
>   3. **Provide diligent and competent service to principals.**
>   4. **Advance and protect the profession.**
> * **Risk Core Equation:** $$\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Impact}$$
>   - Vulnerability without an active threat is NOT a risk. Threat without a matching vulnerability cannot cause damage.

---

## 1. The Core Security Principles (The CIA Triad)

Information security balances three core pillars:
1. **Confidentiality:** Ensuring data is not disclosed to unauthorized entities (achieved via AES-256 encryption, access control lists, classification labels).
2. **Integrity:** Ensuring data is accurate, complete, and protected against unauthorized modification (achieved via SHA-256 cryptographic hashes, digital signatures, version control).
3. **Availability:** Ensuring timely, reliable access to systems and data for authorized users (achieved via redundant hardware, RAID arrays, load balancers, UPS power).

---

## 2. Authentication, Authorization & Accounting (AAA)
- **Identification:** Stating who you are (e.g., username, badge ID).
- **Authentication:** Proving who you are (e.g., password, biometric scan, OTP token).
- **Authorization:** Granting specific access rights and permissions based on identity.
- **Accounting / Auditing:** Logging user activities to establish accountability and non-repudiation.

---

## 3. The 4 Risk Treatment Strategies
- **Mitigate (Reduce):** Implementing security controls (firewalls, training).
- **Transfer (Share):** Purchasing insurance or outsourcing to third-party providers.
- **Avoid:** Discontinuing the risky activity.
- **Accept:** Acknowledging residual risk within organizational risk appetite.`
  },
  {
    chapterNumber: 2,
    sectionNumber: 'Ch. 2.0',
    domainNum: 2,
    title: 'Chapter 2: Incident Response, BCP & Disaster Recovery',
    pageStart: 46,
    pageEnd: 90,
    estimatedReadMinutes: 35,
    fileRef: 'Chapter - 2.pdf',
    keyTakeaways: 'Incident Response Phases, CSIRT, Human Life as #1 Priority, BCP vs DRP, RTO, RPO, Hot/Warm/Cold alternate sites, and Backup rotations.',
    examTips: 'Human safety and preservation of life is ALWAYS the #1 priority in any incident or evacuation. Containment isolates infected endpoints to stop lateral spread. Lessons learned prevents recurrence.',
    contentMarkdown: `# Chapter 2: Incident Response, Business Continuity & Disaster Recovery

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Paramount Rule:** **HUMAN LIFE AND SAFETY ALWAYS COMES FIRST.** Data, hardware, and profits are secondary to protecting human lives during a crisis.
> * **Incident Response Phases (NIST SP 800-61):**
>   1. **Preparation** -> 2. **Detection & Analysis** -> 3. **Containment** -> 4. **Eradication** -> 5. **Recovery** -> 6. **Post-Incident Activity (Lessons Learned)**.
> * **BCP vs DRP:**
>   - **BCP (Business Continuity Plan):** Sustains ongoing business operations and revenue streams during a disaster.
>   - **DRP (Disaster Recovery Plan):** Focuses on technical restoration of IT systems, networks, and databases.

---

## 1. The Incident Response Lifecycle
1. **Preparation:** Establishing the Computer Security Incident Response Team (CSIRT), communication playbooks, and forensic toolsets.
2. **Detection & Analysis:** Identifying anomalies via SIEM alerts, IDS telemetry, and triaging incident scope.
3. **Containment:** Isolating compromised hosts or network subnets to stop malware lateral movement.
4. **Eradication:** Removing malware artifacts, disabling compromised accounts, and closing security gaps.
5. **Recovery:** Restoring systems from verified clean backups and validating nominal operation under heightened monitoring.
6. **Lessons Learned:** Retrospective meeting to update playbooks and remediate root causes.

---

## 2. Disaster Recovery Alternate Sites Comparison

| Site Type | Recovery Speed (RTO) | Hardware Status | Cost |
| :--- | :--- | :--- | :--- |
| **Hot Site** | **Minutes to Hours** | Fully equipped + live real-time data sync | Highest |
| **Warm Site** | **Hours to Days** | Hardware present; data must be restored from backup | Moderate |
| **Cold Site** | **Weeks** | Basic facility with power/HVAC; hardware must be shipped | Lowest |`
  },
  {
    chapterNumber: 3,
    sectionNumber: 'Ch. 3.0',
    domainNum: 3,
    title: 'Chapter 3: Access Control Concepts & Physical Security',
    pageStart: 91,
    pageEnd: 135,
    estimatedReadMinutes: 35,
    fileRef: 'Chapter - 3.pdf',
    keyTakeaways: 'Physical vs Logical vs Administrative controls, DAC, MAC, RBAC, Defense in Depth, Mantraps, and Tailgating prevention.',
    examTips: 'Mantraps prevent tailgating/piggybacking by interlocking two doors. Discretionary (DAC) is owner-controlled; Mandatory (MAC) is label-controlled (military); Role-Based (RBAC) is job-role controlled.',
    contentMarkdown: `# Chapter 3: Access Control Concepts & Physical Security

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **Access Control Categories:**
>   - **Physical:** Fences, locks, bollards, security guards, CCTV, mantraps.
>   - **Technical / Logical:** Firewalls, ACLs, encryption, MFA, intrusion detection.
>   - **Administrative:** Security policies, background checks, training, separation of duties.
> * **Tailgating vs Piggybacking:**
>   - **Tailgating:** Unauthorized person slips behind authorized employee without consent.
>   - **Piggybacking:** Unauthorized person enters with employee consent/collusion.
>   - **Countermeasure:** **Mantraps (Air-locks)** with interlocked doors.

---

## 1. Logical Access Control Models
- **Discretionary Access Control (DAC):** Data owner defines permissions for individual users (e.g., Windows file permissions).
- **Mandatory Access Control (MAC):** System enforces access based on classification labels (Top Secret, Secret, Confidential) and user clearance levels.
- **Role-Based Access Control (RBAC):** Permissions are assigned to job functions (e.g., Billing Clerk, IT Admin); users are assigned to roles.

---

## 2. Multi-Factor Authentication (MFA)
Requires 2 or more factors from different categories:
1. **Something You Know:** Password, PIN.
2. **Something You Have:** Smartcard, hardware token (YubiKey), mobile OTP.
3. **Something You Are:** Biometric fingerprint, facial recognition, iris scan.`
  },
  {
    chapterNumber: 4,
    sectionNumber: 'Ch. 4.0',
    domainNum: 4,
    title: 'Chapter 4: Network Security, OSI Model & Hardening',
    pageStart: 136,
    pageEnd: 180,
    estimatedReadMinutes: 35,
    fileRef: 'Chapter - 4.pdf',
    keyTakeaways: 'OSI 7-Layer Model, TCP vs UDP, Ports & Protocols, Firewalls, WPA3-Enterprise, VPNs, and Network Segmentation.',
    examTips: 'Layer 7 = App (HTTP/DNS). Layer 4 = Transport (TCP/UDP). Layer 3 = Network (IP). Layer 2 = Data Link (MAC/Switch). Layer 1 = Physical (Cables). WPA3 uses SAE to stop offline dictionary attacks.',
    contentMarkdown: `# Chapter 4: Network Security, OSI Model & Hardening

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **OSI 7 Layers (Mnemonic: Please Do Not Throw Sausage Pizza Away):**
>   - 1. Physical | 2. Data Link | 3. Network | 4. Transport | 5. Session | 6. Presentation | 7. Application
> * **Common Ports to Memorize:**
>   - Port 22: SSH / SFTP | Port 53: DNS | Port 80: HTTP | Port 443: HTTPS | Port 3389: RDP | Port 25: SMTP

---

## 1. The OSI 7-Layer Hierarchy

| Layer | Name | PDU | Hardware / Protocol |
| :--- | :--- | :--- | :--- |
| **7** | Application | Data | HTTP, HTTPS, DNS, SSH, SMTP |
| **6** | Presentation | Data | SSL/TLS, JPEG, ASCII, Data Compression |
| **5** | Session | Data | NetBIOS, RPC, Sockets |
| **4** | Transport | Segment | TCP (Reliable/Connection-oriented), UDP (Connectionless/Fast) |
| **3** | Network | Packet | IP, ICMP, IPsec, Routers |
| **2** | Data Link | Frame | Ethernet, MAC addresses, Network Switches |
| **1** | Physical | Bits | Network Cables, Fiber, Wi-Fi Radios, Hubs |

---

## 2. Wireless Network Security Standards
- **WEP / WPA:** Deprecated, vulnerable to IV injection and packet capture attacks.
- **WPA2:** Uses AES-CCMP encryption; vulnerable to KRACK key reinstallation attacks.
- **WPA3:** Modern standard using Simultaneous Authentication of Equals (SAE) resistant to offline dictionary attacks and brute force.`
  },
  {
    chapterNumber: 5,
    sectionNumber: 'Ch. 5.0',
    domainNum: 5,
    title: 'Chapter 5: Security Operations, Data States & User Awareness',
    pageStart: 181,
    pageEnd: 225,
    estimatedReadMinutes: 35,
    fileRef: 'Chapter - 5.pdf',
    keyTakeaways: 'Data states (At Rest, In Transit, In Use), System Hardening, Patching SLAs, Clean Desk Policy, and Social Engineering vectors.',
    examTips: 'Data at Rest is protected by disk encryption (BitLocker). Data in Transit is protected by TLS/VPN. Data in Use is in volatile memory. Security awareness training is the primary defense against social engineering.',
    contentMarkdown: `# Chapter 5: Security Operations, Data States & User Awareness

---

> ### 💡 KEY ASIDE: What the Learner Needs to Know
> * **The Three States of Data:**
>   1. **Data at Rest:** Stored on storage media (protected via AES-256 BitLocker).
>   2. **Data in Transit / Motion:** Moving across networks (protected via TLS 1.3, IPsec).
>   3. **Data in Use:** Loaded into volatile RAM or CPU registers (protected via secure memory enclaves).
> * **Social Engineering Taxonomy:**
>   - **Phishing:** Mass broadcast fraudulent emails.
>   - **Spear Phishing:** Customized attack targeting a specific person.
>   - **Whaling:** Spear phishing targeting executive leadership (CEO/CFO).
>   - **Vishing:** Voice phishing over phone.
>   - **Smishing:** SMS text message phishing.

---

## 1. System Hardening & Operational Baselines
- **Principle of Least Functionality:** Disable all unneeded services, open ports, and default guest accounts.
- **Automated Patch Management:** Testing and deploying operating system updates within defined SLA timeframes.
- **Clean Desk & Clear Screen Policy:** Employees must lock computer workstations when leaving desks and secure sensitive paper documents in locked drawers.

---

## 2. Data Disposal & Sanitization
- **Clearing:** Overwriting data with random characters (can be recovered with laboratory tools).
- **Purging / Degaussing:** Exposing magnetic media to powerful magnetic fields (sanitizes for reuse).
- **Destruction:** Shredding, incinerating, or pulverizing physical drives (highest security).`
  }
];

function inferDomain(text) {
  const lower = text.toLowerCase();
  if (lower.includes('incident') || lower.includes('disaster') || lower.includes('bcp') || lower.includes('drp') || lower.includes('backup') || lower.includes('recovery') || lower.includes('csirt')) return 2;
  if (lower.includes('access control') || lower.includes('mantrap') || lower.includes('rbac') || lower.includes('mac') || lower.includes('dac') || lower.includes('authentication') || lower.includes('mfa') || lower.includes('biometric') || lower.includes('tailgating')) return 3;
  if (lower.includes('network') || lower.includes('osi') || lower.includes('tcp') || lower.includes('port') || lower.includes('firewall') || lower.includes('wpa') || lower.includes('protocol') || lower.includes('ipsec') || lower.includes('ssl') || lower.includes('vpn') || lower.includes('router') || lower.includes('switch')) return 4;
  if (lower.includes('phishing') || lower.includes('social engineering') || lower.includes('hardening') || lower.includes('patch') || lower.includes('clean desk') || lower.includes('data at rest') || lower.includes('sanitization') || lower.includes('operations') || lower.includes('degauss') || lower.includes('shred')) return 5;
  return 1;
}

function parseFormat1(content, filename) {
  const blocks = content.split(/\n\s*---\s*\n/);
  const questions = [];

  for (const block of blocks) {
    const qMatch = block.match(/\*\*Q\d+:\*\*\s*([\s\S]+?)(?=\n\s*Option 1:|\n\s*A[\.:]|$)/i);
    const opt1Match = block.match(/Option 1:\s*([^\n]+)/i);
    const opt2Match = block.match(/Option 2:\s*([^\n]+)/i);
    const opt3Match = block.match(/Option 3:\s*([^\n]+)/i);
    const opt4Match = block.match(/Option 4:\s*([^\n]+)/i);
    const ansMatch = block.match(/Correct Answer:\s*([^\n]+)/i);

    if (qMatch && opt1Match && opt2Match && opt3Match && opt4Match && ansMatch) {
      const stem = qMatch[1].trim();
      const oA = opt1Match[1].trim();
      const oB = opt2Match[1].trim();
      const oC = opt3Match[1].trim();
      const oD = opt4Match[1].trim();
      const rawAns = ansMatch[1].trim();

      let correct = 'A';
      if (rawAns.toLowerCase().includes(oB.toLowerCase()) || rawAns.toLowerCase() === 'option 2' || rawAns.toLowerCase() === 'b') correct = 'B';
      else if (rawAns.toLowerCase().includes(oC.toLowerCase()) || rawAns.toLowerCase() === 'option 3' || rawAns.toLowerCase() === 'c') correct = 'C';
      else if (rawAns.toLowerCase().includes(oD.toLowerCase()) || rawAns.toLowerCase() === 'option 4' || rawAns.toLowerCase() === 'd') correct = 'D';

      questions.push({
        stem,
        optionA: oA,
        optionB: oB,
        optionC: oC,
        optionD: oD,
        correctAnswer: correct,
        rationale: `ISC2 CC Exam Rationale: The correct answer is Option ${correct} (${rawAns}).`,
        domainNum: inferDomain(stem),
        source: filename
      });
    }
  }
  return questions;
}

function parseFormat2(content, filename) {
  // Regex for "1. Question... A. ... B. ... C. ... D. ... ANS: X. Explanation"
  const regex = /(\d+)\.\s+([\s\S]+?)\s*\n\s*A[\.:]\s*([^\n]+)\s*\n\s*B[\.:]\s*([^\n]+)\s*\n\s*C[\.:]\s*([^\n]+)\s*\n\s*D[\.:]\s*([^\n]+)\s*\n\s*ANS:\s*([A-D])[\.:\s]*([\s\S]*?)(?=\n\s*\d+\.|\s*$)/gi;
  const questions = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const stem = match[2].trim().replace(/\n+/g, ' ');
    const oA = match[3].trim();
    const oB = match[4].trim();
    const oC = match[5].trim();
    const oD = match[6].trim();
    const correct = match[7].toUpperCase();
    const explanation = match[8].trim().replace(/\n+/g, ' ');

    questions.push({
      stem,
      optionA: oA,
      optionB: oB,
      optionC: oC,
      optionD: oD,
      correctAnswer: correct,
      rationale: explanation || `ISC2 CC Exam Rationale: The correct answer is Option ${correct}.`,
      domainNum: inferDomain(stem),
      source: filename
    });
  }

  return questions;
}

async function runIsc2CcExhaustiveDigestion() {
  try {
    await client.connect();
    console.log('=== STARTING EXHAUSTIVE ISC2 CC DIGESTION (CHAPTERS 1-5 & QUESTION BANKS) ===\n');

    // 1. Fetch ISC2 CC Domain Mappings
    const domRes = await client.query(`
      SELECT d.id, d.domain_number FROM domains d
      JOIN certifications c ON d.certification_id = c.id
      WHERE c.slug = 'isc2-cc'
    `);
    const domainMap = {};
    domRes.rows.forEach(r => {
      domainMap[r.domain_number] = r.id;
    });

    // 2. Ingest Deep Manual Chapters 1 - 5 into study_materials
    await client.query(`
      DELETE FROM study_materials WHERE certification_id = $1
    `, [CC_CERT_ID]);
    console.log('Cleared previous summary study materials for ISC2 CC.');

    let sortOrder = 1;
    for (const ch of CC_DEEP_CHAPTERS) {
      const domainId = domainMap[ch.domainNum];
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
        VALUES ($1, $2, $3, 'text', $4, 'ISC2 Certified in Cybersecurity (CC) Official Guide', 'Official 1st Edition', $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        CC_CERT_ID,
        domainId,
        ch.title,
        ch.contentMarkdown,
        ch.chapterNumber,
        ch.sectionNumber,
        ch.pageStart,
        ch.pageEnd,
        ch.estimatedReadMinutes,
        ch.fileRef,
        ch.keyTakeaways,
        ch.examTips,
        sortOrder++
      ]);

      console.log(`✓ Ingested [ISC2 CC ${ch.sectionNumber}] ${ch.title}`);
    }

    // 3. Parse and Ingest Questions from Dump Questions
    const dumpDir = path.resolve(__dirname, '../../my_documents/isc2-cc/ISC2-CC-Dump-Questions-Study-Material-main/Dump Questions');
    
    const file1 = path.join(dumpDir, '170+ ISC2 CC Dump Questions.md');
    const file2 = path.join(dumpDir, '70+ Additional dumps.md');

    let allQuestions = [];
    if (fs.existsSync(file1)) {
      const p1 = parseFormat1(fs.readFileSync(file1, 'utf8'), '170+ ISC2 CC Dump Questions.md');
      console.log(`Parsed ${p1.length} questions from 170+ ISC2 CC Dump Questions.md`);
      allQuestions.push(...p1);
    }
    if (fs.existsSync(file2)) {
      const p2 = parseFormat2(fs.readFileSync(file2, 'utf8'), '70+ Additional dumps.md');
      console.log(`Parsed ${p2.length} questions from 70+ Additional dumps.md`);
      allQuestions.push(...p2);
    }

    console.log(`\nTotal parsed ISC2 CC questions: ${allQuestions.length}. Ingesting into database...`);

    const seenHashes = new Set();
    let insertedCount = 0;

    for (const q of allQuestions) {
      const hash = hashContent(q.stem + q.optionA + q.optionB);
      if (seenHashes.has(hash)) continue;
      seenHashes.add(hash);

      const domainId = domainMap[q.domainNum] || domainMap[1];

      await client.query(`
        INSERT INTO questions (
          certification_id,
          domain_id,
          question_number,
          stem,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          rationale,
          content_hash,
          source_reference,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (content_hash) DO UPDATE SET
          rationale = EXCLUDED.rationale,
          source_reference = EXCLUDED.source_reference
      `, [
        CC_CERT_ID,
        domainId,
        insertedCount + 1,
        q.stem,
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
        q.correctAnswer,
        q.rationale,
        hash,
        q.source
      ]);
      insertedCount++;
    }

    const totalCCQ = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [CC_CERT_ID]);

    console.log('\n=============================================');
    console.log('ISC2 CC Exhaustive Ingestion Complete!');
    console.log(`Total ISC2 CC Questions in DB: ${totalCCQ.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during ISC2 CC ingestion:', err);
  } finally {
    await client.end();
  }
}

runIsc2CcExhaustiveDigestion();
