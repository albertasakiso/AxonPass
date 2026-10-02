import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

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

const A_PLUS_ID = 'a0000000-0000-0000-0000-000000000013';
const NET_PLUS_ID = 'a0000000-0000-0000-0000-000000000014';
const GSLC_ID = 'a0000000-0000-0000-0000-000000000015';

const CASE_STUDIES = [
  {
    cert_id: A_PLUS_ID,
    dom_num: 5,
    title: 'Case Study: Enterprise Workstation Thermal Throttle & BSOD Triage',
    scenario: 'A corporate graphic design firm reports that five high-end workstations running 3D rendering workloads frequently crash with Windows Stop Errors (BSOD: WHEA_UNCORRECTABLE_ERROR) under heavy load. The technician inspects the systems and notices CPU temperatures exceeding 98°C and audible power supply fan whine.',
    learning_obj: 'Diagnose and remediate hardware thermal runaway, apply proper thermal interface material (TIM), and verify power supply wattage headroom.',
    questions: [
      {
        stem: 'What is the FIRST hardware diagnostic step the technician should execute to isolate the root cause of the crashes?',
        a: 'Replace the motherboard immediately without running diagnostic tools.',
        b: 'Inspect the CPU liquid cooling loop/heatsink seating, verify thermal paste application, and test power supply rails with a multimeter.',
        c: 'Reinstall Windows 11 in safe mode without backing up user profiles.',
        d: 'Overclock the processor voltage to force stability.',
        correct: 'B',
        rationale: 'WHEA_UNCORRECTABLE_ERROR paired with 98°C temperatures indicates extreme CPU thermal throttling or voltage instability, requiring immediate heatsink and PSU verification.'
      },
      {
        stem: 'Following heatsink re-seating with fresh thermal paste, CPU temperatures drop to 65°C under full load, but one machine still crashes during GPU raytracing. What is the next most likely culprit?',
        a: 'Insufficient power supply unit (PSU) 12V rail wattage delivering inadequate power to the dedicated GPU under peak load.',
        b: 'Keyboard firmware malfunction.',
        c: 'Ethernet cable category rating.',
        d: 'Monitor refresh rate set to 60Hz.',
        correct: 'A',
        rationale: 'High-end rendering GPUs draw significant 12V current; an underpowered PSU or degraded capacitor will trigger shutdown or crash during peak graphic workloads.'
      }
    ]
  },
  {
    cert_id: NET_PLUS_ID,
    dom_num: 2,
    title: 'Case Study: Enterprise Campus Network Micro-Segmentation & Spanning Tree Loop Outage',
    scenario: 'A regional university campus experiences widespread network slowdowns and broadcast storms across its core switches following an unauthorized switch plugged in by a research lab. Wireshark captures indicate 99% bandwidth utilization consumed by broadcast ARP frames.',
    learning_obj: 'Analyze Layer 2 broadcast storms, configure Rapid Spanning Tree Protocol (RSTP 802.1w), BPDU Guard, and storm control.',
    questions: [
      {
        stem: 'What switch port security feature should have been enabled on edge access ports to instantly disable the port upon detecting an unauthorized switch?',
        a: 'Dynamic Trunking Protocol (DTP).',
        b: 'BPDU Guard enabled in conjunction with PortFast.',
        c: 'Disabling all VLAN routing across the campus.',
        d: 'Enabling Half-Duplex mode on all gigabit ports.',
        correct: 'B',
        rationale: 'BPDU Guard immediately places any access port that receives a Spanning Tree Bridge Protocol Data Unit (BPDU) into an err-disabled state, preventing rogue loops.'
      },
      {
        stem: 'After disconnecting the rogue switch and restoring the network, what protocol standard should the network engineer verify across all core and distribution switches to ensure sub-second loop recovery?',
        a: 'Legacy Spanning Tree Protocol (IEEE 802.1D).',
        b: 'Rapid Spanning Tree Protocol (IEEE 802.1w / RSTP).',
        c: 'Telnet CLI management.',
        d: 'Unicast Reverse Path Forwarding.',
        correct: 'B',
        rationale: 'IEEE 802.1w (RSTP) achieves rapid convergence times of under 1-2 seconds compared to 30-50 seconds in legacy 802.1D STP.'
      }
    ]
  },
  {
    cert_id: GSLC_ID,
    dom_num: 1,
    title: 'Case Study: Executive Ransomware Incident & Board Crisis Communication',
    scenario: 'An international healthcare provider discovers that its electronic health record (EHR) backup servers have been encrypted by a ransomware group demanding $15 million. The CISO must orchestrate incident containment, briefing the CEO, legal counsel, and Board of Directors on regulatory obligations under HIPAA and state breach disclosure laws.',
    learning_obj: 'Execute executive incident leadership, evaluate cyber insurance terms, coordinate legal breach disclosure windows, and manage disaster recovery restoration.',
    questions: [
      {
        stem: 'What is the CISO\'s PRIMARY duty regarding communication with the Board of Directors during the active crisis?',
        a: 'Promise complete recovery within 10 minutes without verifying data backups.',
        b: 'Provide clear, factual briefings on business operational impact, containment status, regulatory disclosure timelines, and validated recovery objectives.',
        c: 'Conceal the incident from external regulators and law enforcement indefinitely.',
        d: 'Pay the ransom immediately using corporate funds without legal consultation.',
        correct: 'B',
        rationale: 'Executive governance mandates transparent, factual communication regarding business operational impact, patient safety, legal liabilities, and validated RTO status.'
      },
      {
        stem: 'To prevent future ransomware attacks from encrypting backup repositories, what architectural control should the CISO mandate immediately?',
        a: 'Immutable write-once-read-many (WORM) cloud backups with strict air-gapped credentials and multi-party authorization.',
        b: 'Storing all backups on local unencrypted thumb drives on employee desks.',
        c: 'Disabling all password complexity requirements.',
        d: 'Permitting unrestricted public internet access to backup management consoles.',
        correct: 'A',
        rationale: 'Immutable WORM storage prevents ransomware actors from deleting or encrypting backup snapshots, guaranteeing clean restoration capabilities.'
      }
    ]
  }
];

const GLOSSARY_TERMS = [
  // A+ Terms
  { cert_id: A_PLUS_ID, term: 'SO-DIMM', acronym: 'SO-DIMM', def: 'Small Outline Dual In-line Memory Module; a compact RAM form factor designed specifically for laptops and small-form-factor devices.', cat: 'Hardware' },
  { cert_id: A_PLUS_ID, term: 'NVMe', acronym: 'NVMe', def: 'Non-Volatile Memory Express; an ultra-fast storage access protocol utilizing PCIe bus lanes for solid-state storage drives.', cat: 'Storage' },
  { cert_id: A_PLUS_ID, term: 'Inverter', acronym: 'INV', def: 'An electrical component in legacy CCFL backlit LCD panels that converts low-voltage DC power to high-voltage AC power.', cat: 'Display' },
  { cert_id: A_PLUS_ID, term: 'RAID 5', acronym: 'RAID 5', def: 'Block-level striping with distributed parity across a minimum of three drives, providing single-drive fault tolerance.', cat: 'Storage' },
  { cert_id: A_PLUS_ID, term: 'ESD', acronym: 'ESD', def: 'Electrostatic Discharge; the sudden flow of electricity between two electrically charged objects caused by contact, prevented via antistatic wrist straps.', cat: 'Safety' },
  { cert_id: A_PLUS_ID, term: 'BSOD', acronym: 'BSOD', def: 'Blue Screen of Death; Windows operating system fatal stop error screen displayed when the kernel encounters an unrecoverable error.', cat: 'Operating Systems' },

  // Network+ Terms
  { cert_id: NET_PLUS_ID, term: 'CIDR', acronym: 'CIDR', def: 'Classless Inter-Domain Routing; an IP addressing scheme that replaces traditional address classes to allocate IP addresses and routing more efficiently.', cat: 'Addressing' },
  { cert_id: NET_PLUS_ID, term: '802.1X', acronym: '802.1X', def: 'An IEEE standard for port-based network access control (PNAC) providing authenticated access to wired and wireless enterprise networks.', cat: 'Security' },
  { cert_id: NET_PLUS_ID, term: 'BPDU Guard', acronym: 'BPDU', def: 'A Spanning Tree security feature that automatically disables access ports upon receiving bridge protocol data units, preventing rogue switch loops.', cat: 'Switching' },
  { cert_id: NET_PLUS_ID, term: 'VLAN', acronym: 'VLAN', def: 'Virtual Local Area Network; a logical grouping of network devices operating within the same Layer 2 broadcast domain regardless of physical switch location.', cat: 'Switching' },
  { cert_id: NET_PLUS_ID, term: 'MTU', acronym: 'MTU', def: 'Maximum Transmission Unit; the largest size packet or frame, specified in octets (bytes), that can be sent in a packet- or frame-based network (typically 1500 bytes for standard Ethernet).', cat: 'Protocols' },

  // GSLC Terms
  { cert_id: GSLC_ID, term: 'ROSI', acronym: 'ROSI', def: 'Return on Security Investment; a quantitative metric assessing the financial benefit of security investments relative to the annualized risk exposure mitigated.', cat: 'Governance' },
  { cert_id: GSLC_ID, term: 'CSIRT', acronym: 'CSIRT', def: 'Computer Security Incident Response Team; a dedicated operational unit responsible for receiving, analyzing, and responding to cybersecurity incident reports.', cat: 'Incident Response' },
  { cert_id: GSLC_ID, term: 'MITRE ATT&CK', acronym: 'ATT&CK', def: 'A globally-accessible knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world cyber threat observations.', cat: 'Threat Intel' },
  { cert_id: GSLC_ID, term: 'Zero Trust', acronym: 'ZT', def: 'A strategic cybersecurity architecture model that eliminates implicit trust and continually validates every stage of digital interaction.', cat: 'Architecture' },
  { cert_id: GSLC_ID, term: 'WORM Storage', acronym: 'WORM', def: 'Write Once, Read Many; an immutable data storage technology that prevents stored data from being altered or deleted, critical for ransomware defense.', cat: 'Operations' }
];

async function seedCaseStudiesAndGlossary() {
  await client.connect();
  console.log('=== SEEDING CASE STUDIES & GLOSSARY FOR NEW CERTS ===\n');

  // 1. Seed Case Studies
  for (const cs of CASE_STUDIES) {
    const domRes = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [cs.cert_id, cs.dom_num]);
    if (domRes.rows.length === 0) continue;
    const domainId = domRes.rows[0].id;

    const csId = uuidv4();
    await client.query(`
      INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING;
    `, [csId, domainId, cs.title, cs.scenario, 1]);

    console.log(`[CASE STUDY] Ingested: "${cs.title}"`);

    for (let qIdx = 0; qIdx < cs.questions.length; qIdx++) {
      const q = cs.questions[qIdx];
      const qId = uuidv4();
      await client.query(`
        INSERT INTO case_study_questions (
          id, case_study_id, question_number, stem, option_a, option_b,
          option_c, option_d, correct_answer, rationale, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING;
      `, [qId, csId, qIdx + 1, q.stem, q.a, q.b, q.c, q.d, q.correct, q.rationale, qIdx + 1]);
    }
  }

  // 2. Seed Glossary Terms
  for (const item of GLOSSARY_TERMS) {
    const gId = uuidv4();
    await client.query(`
      INSERT INTO glossary_terms (id, certification_id, term, acronym, definition, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING;
    `, [gId, item.cert_id, item.term, item.acronym, item.def, item.cat]);
  }

  console.log(`[GLOSSARY] Ingested ${GLOSSARY_TERMS.length} new authoritative terms.`);

  const totalCs = await client.query('SELECT count(*) FROM case_studies');
  const totalTerms = await client.query('SELECT count(*) FROM glossary_terms');
  console.log(`\n========================================================================================`);
  console.log(`✅ TOTAL CASE STUDIES IN SYSTEM: ${totalCs.rows[0].count}`);
  console.log(`✅ TOTAL GLOSSARY TERMS IN SYSTEM: ${totalTerms.rows[0].count}`);
  console.log(`========================================================================================\n`);

  await client.end();
}

seedCaseStudiesAndGlossary().catch(console.error);
