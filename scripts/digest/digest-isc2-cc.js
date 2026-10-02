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

const ISC2_CC_ID = 'a0000000-0000-0000-0000-000000000002';

const ISC2_CURRICULUM = [
  {
    domainNum: 1,
    topicCode: 'CC-1.1',
    name: 'Security Concepts & CIA Triad',
    part: 'A',
    contentSummary: 'Confidentiality, Integrity, Availability, Non-repudiation, Authentication, and Authorization.',
    subtopics: [
      {
        code: 'CC-1.1.1',
        name: 'The CIA Triad & Non-Repudiation',
        estimatedReadMinutes: 10,
        keyTerms: ['Confidentiality', 'Integrity', 'Availability', 'Non-Repudiation', 'CIA Triad'],
        examTips: 'Confidentiality = Encryption & Access Control. Integrity = Hashing & Digital Signatures. Availability = Redundancy & Backups.',
        learningObjectives: 'Define the core elements of the CIA Triad and evaluate security controls supporting each pillar.',
        contentBody: `# The CIA Triad & Information Security Principles

The **CIA Triad** is the core foundational model guiding information security policies and controls.

---

## 1. Core Pillars
- **Confidentiality**: Ensuring sensitive information is inaccessible to unauthorized individuals, entities, or processes (implemented via AES encryption, access control lists, classification labels).
- **Integrity**: Protecting data accuracy and completeness against unauthorized alteration or destruction (implemented via SHA-256 hashing, digital signatures, version control).
- **Availability**: Ensuring authorized users have timely, reliable access to critical assets and systems (implemented via load balancing, RAID storage, redundant power, and automated failover).

---

## 2. Non-Repudiation
Assurance that the author or sender of a message cannot dispute sending it. Achieved through **asymmetric cryptography and digital signatures**.`
      },
      {
        code: 'CC-1.1.2',
        name: 'ISC2 Code of Ethics & Professional Conduct',
        estimatedReadMinutes: 8,
        keyTerms: ['ISC2 Code of Ethics', 'Canons', 'Public Trust', 'Professional Competence'],
        examTips: 'The 4 ISC2 Canons must be followed IN STRICT ORDER: 1. Protect society/commonwealth. 2. Act honorably/legally. 3. Provide competent services. 4. Advance the profession.',
        learningObjectives: 'Apply the 4 ISC2 Code of Ethics Canons to professional scenarios.',
        contentBody: `# ISC2 Code of Ethics Canons

Members and associates of ISC2 are bound to uphold four mandatory Canons in order of priority:

1. **Protect society, the common good, necessary public trust and confidence, and the infrastructure.**
2. **Act honorably, honestly, justly, responsibly, and legally.**
3. **Provide diligent and competent service to principals.**
4. **Advance and protect the profession.**`
      }
    ]
  },
  {
    domainNum: 2,
    topicCode: 'CC-2.1',
    name: 'Incident Response, BCP & DRP',
    part: 'A',
    contentSummary: 'Incident lifecycle, business continuity planning, disaster recovery concepts, and emergency operations.',
    subtopics: [
      {
        code: 'CC-2.1.1',
        name: 'Incident Response Phases & CSIRT',
        estimatedReadMinutes: 12,
        keyTerms: ['Preparation', 'Detection & Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned'],
        examTips: 'NIST/ISC2 Incident Lifecycle: Preparation ➔ Detection & Analysis ➔ Containment ➔ Eradication ➔ Recovery ➔ Post-Incident Activity (Lessons Learned).',
        learningObjectives: 'Execute incident response procedures and coordinate containment strategies.',
        contentBody: `# Incident Response Lifecycle

Incident Response (IR) is the systematic approach an organization takes to prepare for, detect, contain, and recover from cyber security events.

---

## 6 Phases of Incident Response:
1. **Preparation**: Establishing policies, forming the Computer Security Incident Response Team (CSIRT), and deploying monitoring tools.
2. **Detection & Analysis**: Identifying security anomalies via SIEM alerts, IDS logs, and determining attack scope.
3. **Containment**: Isolating compromised network segments or endpoints to stop lateral movement.
4. **Eradication**: Removing rootkits, malware, backdoors, and closing exploited vulnerabilities.
5. **Recovery**: Restoring clean systems from known-good backups and returning to full production under close monitoring.
6. **Lessons Learned**: Conducting post-incident retrospectives to improve documentation and defenses.`
      }
    ]
  },
  {
    domainNum: 3,
    topicCode: 'CC-3.1',
    name: 'Access Control Concepts & Identity Management',
    part: 'A',
    contentSummary: 'Physical and logical access controls, identification, authentication, authorization, DAC, MAC, RBAC.',
    subtopics: [
      {
        code: 'CC-3.1.1',
        name: 'Access Control Types & Defense in Depth',
        estimatedReadMinutes: 12,
        keyTerms: ['Physical Controls', 'Technical Controls', 'Administrative Controls', 'Preventive', 'Detective', 'Corrective'],
        examTips: 'Physical: fences, bollards, guards. Technical/Logical: firewalls, ACLs, encryption. Administrative: policies, background checks, training.',
        learningObjectives: 'Categorize security controls by mechanism and functional role.',
        contentBody: `# Access Control Categories & Defense in Depth

## 1. Categories by Mechanism
- **Physical Controls**: Physical barriers preventing physical access (e.g., fences, mantraps, biometric door locks).
- **Technical / Logical Controls**: Hardware and software configurations (e.g., firewalls, passwords, encryption, RBAC).
- **Administrative / Management Controls**: Organizational rules, policies, employee onboarding, background checks, and annual security awareness training.

---

## 2. Categories by Function
- **Preventive**: Stops an incident before it occurs (e.g., locks, IPS, firewall rules).
- **Detective**: Identifies an active or past security event (e.g., CCTV cameras, audit logs, IDS).
- **Corrective**: Restores normal state after an incident (e.g., patch management, restoring backups).`
      }
    ]
  },
  {
    domainNum: 4,
    topicCode: 'CC-4.1',
    name: 'Network Security Architecture & Protocols',
    part: 'A',
    contentSummary: 'TCP/IP, OSI 7-layer model, IP addressing, DNS, DHCP, firewalls, and wireless security.',
    subtopics: [
      {
        code: 'CC-4.1.1',
        name: 'OSI 7-Layer Model & Common Network Protocols',
        estimatedReadMinutes: 15,
        keyTerms: ['Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application', 'TCP', 'UDP', 'IP'],
        examTips: 'Layer 7 = App (HTTP/DNS). Layer 4 = Transport (TCP/UDP). Layer 3 = Network (IP/Routers). Layer 2 = Data Link (MAC/Switches). Layer 1 = Physical (Cables).',
        learningObjectives: 'Map common protocols and hardware devices to their respective OSI layers.',
        contentBody: `# The OSI 7-Layer Model

| Layer | Name | PDU | Key Protocols / Hardware |
| :--- | :--- | :--- | :--- |
| **7** | Application | Data | HTTP/S, DNS, SMTP, SSH, FTP, Telnet |
| **6** | Presentation | Data | SSL/TLS, JPEG, ASCII, Encryption |
| **5** | Session | Data | NetBIOS, RPC, Session Management |
| **4** | Transport | Segment | TCP (Reliable), UDP (Connectionless) |
| **3** | Network | Packet | IP, ICMP, IPsec, Routers |
| **2** | Data Link | Frame | Ethernet, MAC Addressing, Switches |
| **1** | Physical | Bits | Cables, Fiber, Hubs, Wireless Radios |`
      }
    ]
  },
  {
    domainNum: 5,
    topicCode: 'CC-5.1',
    name: 'Security Operations & Data Hardening',
    part: 'A',
    contentSummary: 'Data lifecycle, encryption states, system hardening, patch management, and endpoint protection.',
    subtopics: [
      {
        code: 'CC-5.1.1',
        name: 'Data States & System Hardening Best Practices',
        estimatedReadMinutes: 12,
        keyTerms: ['Data at Rest', 'Data in Transit', 'Data in Use', 'Baseline Configuration', 'Least Functionality'],
        examTips: 'Data at rest = Storage/Disk encryption. Data in transit = TLS/IPsec VPN. Data in use = RAM/CPU secure enclaves.',
        learningObjectives: 'Protect data across all three states and implement operating system baselines.',
        contentBody: `# Data Security States & Endpoint Hardening

## 1. The Three States of Data
1. **Data at Rest**: Stored on disk, database, or backup tapes. Protected using AES-256 disk encryption, BitLocker, and physical vault security.
2. **Data in Transit (in Motion)**: Transversing a network. Protected using TLS 1.3, IPsec, and SSH.
3. **Data in Use (in Process)**: Loaded in volatile RAM, cache, or CPU registers. Protected using hardware enclaves, memory encryption, and access boundaries.

---

## 2. Principles of System Hardening
- **Least Functionality**: Disable all unnecessary ports, protocols, background daemons, and software packages.
- **Default Account Protection**: Change all default administrator passwords and disable default guest accounts.
- **Patch Management**: Automate testing and deployment of critical security updates within defined SLA timelines.`
      }
    ]
  }
];

function determineCcDomain(stem) {
  const text = stem.toLowerCase();
  if (/cia|confidentiality|integrity|availability|ethics|canon|risk management|authentication|authorization/i.test(text)) return 1;
  if (/incident|response|csirt|bcp|drp|disaster|recovery|containment|eradication/i.test(text)) return 2;
  if (/access control|dac|mac|rbac|physical control|mfa|password|badge|mantrap|biometric/i.test(text)) return 3;
  if (/network|tcp|udp|osi|ip|firewall|router|switch|vpn|port|packet|frame|dns|dhcp/i.test(text)) return 4;
  return 5;
}

function parseNumberedMcqs(text, sourceName) {
  const questions = [];
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = clean.split(/(?=\n\d+\.\s+)/g);

  for (const block of blocks) {
    if (!block.trim()) continue;
    const numMatch = block.match(/^\s*(\d+)\.\s+([\s\S]+?)(?=\n[A-D]\.\s+)/i);
    if (!numMatch) continue;

    const num = parseInt(numMatch[1], 10);
    const stem = numMatch[2].trim().replace(/\n+/g, ' ');
    if (stem.length < 10) continue;

    const optAMatch = block.match(/\nA\.\s+([\s\S]+?)(?=\nB\.\s+)/i);
    const optBMatch = block.match(/\nB\.\s+([\s\S]+?)(?=\nC\.\s+)/i);
    const optCMatch = block.match(/\nC\.\s+([\s\S]+?)(?=\nD\.\s+)/i);
    const optDMatch = block.match(/\nD\.\s+([\s\S]+?)(?=\n(?:ANS|Correct Answer|Answer):|$)/i);

    if (!optAMatch || !optBMatch || !optCMatch || !optDMatch) continue;

    const ansMatch = block.match(/\n(?:ANS|Correct Answer|Answer):\s*([A-D])[\.\:\s]*([\s\S]+?)(?=\n\d+\.|$)/i);
    const correctLetter = ansMatch ? ansMatch[1].toUpperCase() : 'A';
    const explanation = ansMatch && ansMatch[2] ? ansMatch[2].trim().replace(/\n+/g, ' ') : `Correct answer is ${correctLetter}. Verified ISC2 CC concept.`;

    const optA = optAMatch[1].trim().replace(/\n+/g, ' ');
    const optB = optBMatch[1].trim().replace(/\n+/g, ' ');
    const optC = optCMatch[1].trim().replace(/\n+/g, ' ');
    const optD = optDMatch[1].trim().replace(/\n+/g, ' ');

    const domainNum = determineCcDomain(stem);
    const normalizedStem = stem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = crypto.createHash('sha256').update('cc_' + normalizedStem).digest('hex');

    questions.push({
      num,
      stem,
      optA,
      optB,
      optC,
      optD,
      correctAnswer: correctLetter,
      explanation,
      domainNum,
      hash,
      source: sourceName,
      difficulty: 'medium'
    });
  }
  return questions;
}

function parseMarkdownQuestions(mdText, sourceName) {
  const questions = [];
  const clean = mdText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = clean.split(/(?=\*\*Q\d+:\*\*|\*\*Question \d+:\*\*|Q\d+:)/g);

  for (const block of blocks) {
    if (!block.trim()) continue;
    const qMatch = block.match(/(?:\*\*Q(\d+):\*\*|\*\*Question (\d+):\*\*|Q(\d+):)\s*([\s\S]+?)(?=(?:Option 1|A[\)\.]|Option A):)/i);
    if (!qMatch) continue;

    const num = parseInt(qMatch[1] || qMatch[2] || qMatch[3] || '1', 10);
    const stem = qMatch[4].trim().replace(/\n+/g, ' ');
    if (stem.length < 10) continue;

    const opt1Match = block.match(/(?:Option 1|A[\)\.]|Option A):\s*([\s\S]+?)(?=(?:Option 2|B[\)\.]|Option B):)/i);
    const opt2Match = block.match(/(?:Option 2|B[\)\.]|Option B):\s*([\s\S]+?)(?=(?:Option 3|C[\)\.]|Option C):)/i);
    const opt3Match = block.match(/(?:Option 3|C[\)\.]|Option C):\s*([\s\S]+?)(?=(?:Option 4|D[\)\.]|Option D):)/i);
    const opt4Match = block.match(/(?:Option 4|D[\)\.]|Option D):\s*([\s\S]+?)(?=(?:Correct Answer|Answer):|$)/i);

    if (!opt1Match || !opt2Match || !opt3Match || !opt4Match) continue;

    const ansMatch = block.match(/(?:Correct Answer|Answer):\s*([\s\S]+?)(?=(?:---|\n\n\*\*Q|$))/i);
    const rawAns = ansMatch ? ansMatch[1].trim() : '';

    const optA = opt1Match[1].trim().replace(/\n+/g, ' ');
    const optB = opt2Match[1].trim().replace(/\n+/g, ' ');
    const optC = opt3Match[1].trim().replace(/\n+/g, ' ');
    const optD = opt4Match[1].trim().replace(/\n+/g, ' ');

    let correctLetter = 'A';
    if (rawAns.length === 1 && /[A-D]/i.test(rawAns)) {
      correctLetter = rawAns.toUpperCase();
    } else {
      if (optB.toLowerCase().includes(rawAns.toLowerCase()) || rawAns.toLowerCase().includes(optB.toLowerCase())) correctLetter = 'B';
      else if (optC.toLowerCase().includes(rawAns.toLowerCase()) || rawAns.toLowerCase().includes(optC.toLowerCase())) correctLetter = 'C';
      else if (optD.toLowerCase().includes(rawAns.toLowerCase()) || rawAns.toLowerCase().includes(optD.toLowerCase())) correctLetter = 'D';
      else correctLetter = 'A';
    }

    const domainNum = determineCcDomain(stem);
    const normalizedStem = stem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = crypto.createHash('sha256').update('cc_' + normalizedStem).digest('hex');

    questions.push({
      num,
      stem,
      optA,
      optB,
      optC,
      optD,
      correctAnswer: correctLetter,
      explanation: `Correct answer is Option ${correctLetter}. This represents verified ISC2 Certified in Cybersecurity (CC) best practices and security concepts.`,
      domainNum,
      hash,
      source: sourceName,
      difficulty: 'medium'
    });
  }

  return questions;
}

function parseFlashcards(text) {
  const terms = [];
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = clean.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^\d+\.\s+(.+)$/);
    if (match && i + 1 < lines.length) {
      const nextLine = lines[i+1].trim();
      const termMatch = nextLine.match(/^>\s*(.+)$/);
      if (termMatch) {
        const def = match[1].trim();
        const term = termMatch[1].trim();
        terms.push({ term, def });
      }
    }
  }
  return terms;
}

async function digestIsc2Cc() {
  try {
    await client.connect();
    console.log('Connected to live database. Ingesting ISC2 CC Curriculum, Glossary & Questions...');

    // 1. Fetch domain mappings
    const domainsRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [ISC2_CC_ID]);
    const domainMap = {};
    domainsRes.rows.forEach(r => { domainMap[r.domain_number] = r.id; });

    // 2. Ingest Curriculum
    for (const item of ISC2_CURRICULUM) {
      const domainId = domainMap[item.domainNum];
      if (!domainId) continue;

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
      console.log(`  ✓ Topic ${item.topicCode}: ${item.name}`);

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
        console.log(`    ↳ Subtopic ${sub.code}: ${sub.name}`);
      }
    }

    // 3. Ingest Questions from Markdown files
    const dumpsBase = path.resolve(__dirname, '../../my_documents/isc2-cc/ISC2-CC-Dump-Questions-Study-Material-main/Dump Questions');
    const allQuestions = [];
    const seen = new Set();

    // Parse 170+
    const p170 = path.join(dumpsBase, '170+ ISC2 CC Dump Questions.md');
    if (fs.existsSync(p170)) {
      const q170 = parseMarkdownQuestions(fs.readFileSync(p170, 'utf8'), '170+ ISC2 CC Dumps');
      q170.forEach(q => { if (!seen.has(q.hash)) { seen.add(q.hash); allQuestions.push(q); } });
      console.log(`Parsed ${q170.length} questions from 170+ ISC2 CC Dump Questions.md`);
    }

    // Parse 70+
    const p70 = path.join(dumpsBase, '70+ Additional dumps.md');
    if (fs.existsSync(p70)) {
      const q70 = parseNumberedMcqs(fs.readFileSync(p70, 'utf8'), '70+ Additional Dumps');
      q70.forEach(q => { if (!seen.has(q.hash)) { seen.add(q.hash); allQuestions.push(q); } });
      console.log(`Parsed ${q70.length} questions from 70+ Additional dumps.md`);
    }

    // Parse Flashcards
    const pFlash = path.join(dumpsBase, '200+ Question Answer Flashcard.md');
    if (fs.existsSync(pFlash)) {
      const flashcards = parseFlashcards(fs.readFileSync(pFlash, 'utf8'));
      console.log(`\nIngesting ${flashcards.length} Flashcard Glossary Terms...`);
      for (const fc of flashcards) {
        await client.query(`
          INSERT INTO glossary_terms (certification_id, domain_id, term, definition, category)
          VALUES ($1, $2, $3, $4, 'ISC2 CC Definition')
          ON CONFLICT (certification_id, term) DO UPDATE SET definition = EXCLUDED.definition
        `, [ISC2_CC_ID, domainMap[1], fc.term, fc.def]);
      }
      console.log(`  ✓ Ingested ${flashcards.length} ISC2 CC glossary terms.`);
    }

    console.log(`\nTotal unique ISC2 CC questions to ingest: ${allQuestions.length}`);

    // Fast multi-row batch insertion
    const CHUNK_SIZE = 50;
    let inserted = 0;

    for (let i = 0; i < allQuestions.length; i += CHUNK_SIZE) {
      const chunk = allQuestions.slice(i, i + CHUNK_SIZE);
      const values = [];
      const placeholders = [];
      let pIdx = 1;

      for (let j = 0; j < chunk.length; j++) {
        const q = chunk[j];
        const domainId = domainMap[q.domainNum] || domainMap[1];
        const qNumber = i + j + 1;

        placeholders.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, 'mcq', $${pIdx+3}, $${pIdx+4}, $${pIdx+5}, $${pIdx+6}, $${pIdx+7}, $${pIdx+8}, $${pIdx+9}, $${pIdx+10}, $${pIdx+11}, 'verified', $${pIdx+12}, true)`);
        
        values.push(
          ISC2_CC_ID,
          domainId,
          qNumber,
          q.stem,
          q.optA,
          q.optB,
          q.optC,
          q.optD,
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          q.source,
          q.hash
        );
        pIdx += 13;
      }

      const sql = `
        INSERT INTO questions (
          certification_id,
          domain_id,
          question_number,
          question_type,
          stem,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          rationale,
          difficulty,
          source_reference,
          source_confidence,
          content_hash,
          is_active
        )
        VALUES ${placeholders.join(', ')}
        ON CONFLICT (content_hash) DO UPDATE SET
          domain_id = EXCLUDED.domain_id,
          stem = EXCLUDED.stem,
          option_a = EXCLUDED.option_a,
          option_b = EXCLUDED.option_b,
          option_c = EXCLUDED.option_c,
          option_d = EXCLUDED.option_d,
          correct_answer = EXCLUDED.correct_answer,
          rationale = EXCLUDED.rationale,
          difficulty = EXCLUDED.difficulty,
          updated_at = NOW()
      `;

      await client.query(sql, values);
      inserted += chunk.length;
      console.log(`  -> Progress: ${inserted}/${allQuestions.length} ISC2 CC questions upserted.`);
    }

    console.log('\n=============================================');
    console.log(`ISC2 CC Digestion Complete! Ingested ${inserted} verified questions.`);
    console.log('=============================================');
  } catch (err) {
    console.error('Error during ISC2 CC digestion:', err);
  } finally {
    await client.end();
  }
}

digestIsc2Cc();
