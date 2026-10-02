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

// Additional study materials for existing certifications
const CISA_ID = 'a0000000-0000-0000-0000-000000000001';
const CRISC_ID = 'a0000000-0000-0000-0000-000000000006';
const NIST_ID = 'a0000000-0000-0000-0000-000000000004';
const GRC_ID = 'a0000000-0000-0000-0000-000000000008';

const NEW_MATERIALS = [
  // =========================================================================
  // CompTIA A+ Master Chapters (Domains 1 to 9)
  // =========================================================================
  {
    cert_id: A_PLUS_ID,
    dom_num: 1,
    title: 'A+ Domain 1 Master Guide: Mobile Devices & Peripheral Architecture',
    doc_title: 'CompTIA A+ Core Series Certification Manual (220-1101/1102)',
    edition: '2026 Edition',
    chapter_number: 1,
    read_min: 30,
    takeaways: 'Master laptop hardware replacements, SO-DIMM RAM, M.2 NVMe vs SATA SSDs, OLED/LCD display inverter mechanisms, and mobile biometric connectivity.',
    tips: 'Watch for questions distinguishing between cellular baseband radios, NFC (4cm radius), and Bluetooth 5.0 pairing states.',
    body: `# CompTIA A+ Domain 1: Mobile Devices & Peripheral Architecture

## 1.1 Laptop Hardware Disassembly & Form Factors
Laptops use specialized, compact form factor components compared to standard desktop computers:
- **SO-DIMM (Small Outline Dual In-line Memory Module)**: 204-pin (DDR3), 260-pin (DDR4), and 262-pin (DDR5) architectures.
- **Storage Subsystems**: 2.5-inch SATA SSDs (6 Gbps) vs **M.2 NVMe (PCIe Gen 3/4/5)** utilizing high-speed lanes directly connected to the CPU.
- **Battery Chemistries**: Lithium-Ion (Li-Ion) and Lithium Polymer (Li-Polymer). Proper handling protocols to avoid thermal runaway.

\`\`\`
+-----------------------------------------------------------------------+
|                 LAPTOP MOTHERBOARD COMPONENT TOPOLOGY                 |
|                                                                       |
|  [ CPU + Thermal Heatpipe ] <---> [ SO-DIMM RAM Slot 1 / Slot 2 ]     |
|             |                                                         |
|             v                                                         |
|  [ M.2 Key-M NVMe SSD ]     [ Wi-Fi / BT M.2 Key-E Combo Card ]      |
|             |                                                         |
|             +---> [ Embedded DisplayPort (eDP) Cable to LCD Panel ]   |
+-----------------------------------------------------------------------+
\`\`\`

## 1.2 Mobile Display Technologies & Inverters
- **OLED (Organic Light Emitting Diode)**: Requires no backlight; each pixel emits its own light, delivering deep blacks and thin profiles.
- **IPS LCD vs TN LCD**: In-Plane Switching offers superior color accuracy and 178-degree viewing angles; Twisted Nematic provides faster response times but narrower viewing angles.
- **CCFL vs LED Backlighting**: Legacy CCFL tubes require an **Inverter board** (converting DC power to high-voltage AC). Modern LED displays run directly on low-voltage DC power without an inverter.
- **Digitizers**: Converts analog physical stylus/finger touches into digital X/Y coordinate inputs directly over the display glass.`
  },
  {
    cert_id: A_PLUS_ID,
    dom_num: 2,
    title: 'A+ Domain 2 Master Guide: Networking Technology & Protocol Standards',
    doc_title: 'CompTIA A+ Core Series Certification Manual (220-1101/1102)',
    edition: '2026 Edition',
    chapter_number: 2,
    read_min: 35,
    takeaways: 'Authoritative port registry (Ports 20-443, 3389, 389, 636, 53, 67/68), 802.11 standards, and twisted-pair cabling T568A vs T568B.',
    tips: 'Memorize TCP/UDP port numbers: SSH=22, RDP=3389, DNS=53 (UDP/TCP), HTTPS=443, DHCP=67/68, SNMP=161/162.',
    body: `# CompTIA A+ Domain 2: Networking Technology & Protocols

## 2.1 Essential Protocol Port Numbers
The foundational networking registry required for enterprise technical support:
- **Port 20/21 (TCP)**: File Transfer Protocol (FTP) - Data and Control channels.
- **Port 22 (TCP)**: Secure Shell (SSH) / Secure Copy (SCP) / SFTP.
- **Port 23 (TCP)**: Telnet (Unencrypted terminal emulation - Deprecated).
- **Port 25 (TCP)**: Simple Mail Transfer Protocol (SMTP) - Mail relay.
- **Port 53 (UDP/TCP)**: Domain Name System (DNS) - Name resolution.
- **Port 67/68 (UDP)**: Dynamic Host Configuration Protocol (DHCP) - IP address leasing.
- **Port 80 (TCP)**: Hypertext Transfer Protocol (HTTP).
- **Port 110 (TCP)**: Post Office Protocol v3 (POP3) - Client mail retrieval.
- **Port 143 (TCP)**: Internet Message Access Protocol (IMAP4) - Client mail synchronization.
- **Port 443 (TCP)**: Hypertext Transfer Protocol Secure (HTTPS - TLS encrypted).
- **Port 445 (TCP)**: Server Message Block (SMB) - Windows network file sharing.
- **Port 3389 (TCP)**: Remote Desktop Protocol (RDP) - Microsoft remote desktop GUI.

\`\`\`
+--------------------------------------------------------------------+
|               TWISTED PAIR CABLING STANDARDS (TIA/EIA)             |
|                                                                    |
| Pin   T568A Standard                     T568B Standard (Common)   |
| ---   -------------------------          ------------------------  |
|  1    White / Green                      White / Orange            |
|  2    Green                              Orange                    |
|  3    White / Orange                     White / Green             |
|  4    Blue                               Blue                      |
|  5    White / Blue                       White / Blue              |
|  6    Orange                             Green                     |
|  7    White / Brown                      White / Brown             |
|  8    Brown                              Brown                     |
+--------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: A_PLUS_ID,
    dom_num: 3,
    title: 'A+ Domain 3 Master Guide: Hardware & Component Architecture',
    doc_title: 'CompTIA A+ Core Series Certification Manual (220-1101/1102)',
    edition: '2026 Edition',
    chapter_number: 3,
    read_min: 30,
    takeaways: 'Motherboard socket architectures (LGA vs PGA), PCIe lane allocations, Power Supply Ratings (80 PLUS certification), and RAID 0, 1, 5, 10 mechanics.',
    tips: 'RAID 5 requires a minimum of 3 drives and tolerates 1 drive failure (N-1 capacity). RAID 10 requires 4 drives and can tolerate up to 2 drive failures (one per mirror pair).',
    body: `# CompTIA A+ Domain 3: Hardware & Component Architecture

## 3.1 Motherboard Architectures & Form Factors
- **ATX (Advanced Technology eXtended)**: 12 x 9.6 inches; up to 7 expansion slots.
- **Micro-ATX (mATX)**: 9.6 x 9.6 inches; up to 4 expansion slots; backwards compatible with ATX cases and power supplies.
- **Mini-ITX**: 6.7 x 6.7 inches; 1 expansion slot; optimized for low-power compact home theater PCs (HTPC) and small form factor (SFF) builds.

## 3.2 Enterprise RAID Storage Formations
- **RAID 0 (Striping)**: Minimum 2 drives. 100% capacity utilization. Zero fault tolerance. One failed drive causes total array data loss.
- **RAID 1 (Mirroring)**: Minimum 2 drives. 50% capacity. Tolerates 1 drive failure per pair.
- **RAID 5 (Striping with Distributed Parity)**: Minimum 3 drives. Capacity = (N - 1) x Drive Size. Tolerates single drive loss with parity reconstruction.
- **RAID 10 (1+0 Striping of Mirrors)**: Minimum 4 drives. Combines RAID 1 mirror redundancy with RAID 0 performance.`
  },

  // =========================================================================
  // CompTIA Network+ Master Chapters (Domains 1 to 5)
  // =========================================================================
  {
    cert_id: NET_PLUS_ID,
    dom_num: 1,
    title: 'Network+ Domain 1 Master Guide: Networking Architecture & Subnetting Mechanics',
    doc_title: 'CompTIA Network+ N10-008/009 Official Certification Guide',
    edition: '2026 Edition',
    chapter_number: 1,
    read_min: 40,
    takeaways: 'OSI 7-Layer encapsulation model, IPv4 Classless Inter-Domain Routing (CIDR) binary subnet calculations, and IPv6 global unicast addressing.',
    tips: 'Remember the formula for usable IPv4 hosts per subnet: 2^(32 - CIDR) - 2 (subtracting network and broadcast addresses).',
    body: `# CompTIA Network+ Domain 1: Networking Fundamentals & Subnetting

## 1.1 The OSI 7-Layer Reference Model & PDU Encapsulation

\`\`\`
+--------------------------------------------------------------------------+
| Layer | Name         | Protocol Data Unit (PDU) | Key Protocols / Devices|
+-------+--------------+--------------------------+------------------------+
|   7   | Application  | Data                     | HTTP, DNS, SSH, SNMP   |
|   6   | Presentation | Data                     | TLS, SSL, JPEG, ASCII  |
|   5   | Session      | Data                     | NetBIOS, RPC, Sockets  |
|   4   | Transport    | Segment (TCP) / Datagram | TCP, UDP (Port Nums)   |
|   3   | Network      | Packet                   | IPv4, IPv6, ICMP, IPsec|
|   2   | Data Link    | Frame                    | Ethernet, MAC, 802.1Q  |
|   1   | Physical     | Bits                     | Cables, RJ-45, SFP+    |
+--------------------------------------------------------------------------+
\`\`\`

## 1.2 Binary IPv4 Subnet Calculation Rules
To calculate any IPv4 CIDR subnet:
- **Host Bits ($H$)** = $32 - \\text{CIDR Prefix}$
- **Total IP Addresses** = $2^H$
- **Usable Host Addresses** = $2^H - 2$
- **Block Size (Magic Number)** = $256 - \\text{Subnet Octet Value}$

*Example for /27 subnet ($255.255.255.224$):*
$H = 32 - 27 = 5$. Total IPs = $2^5 = 32$. Usable hosts = $32 - 2 = 30$.`
  },
  {
    cert_id: NET_PLUS_ID,
    dom_num: 4,
    title: 'Network+ Domain 4 Master Guide: Enterprise Network Defense & Zero Trust Security',
    doc_title: 'CompTIA Network+ N10-008/009 Official Certification Guide',
    edition: '2026 Edition',
    chapter_number: 4,
    read_min: 35,
    takeaways: 'IEEE 802.1X EAP-TLS port-based authentication, Next-Gen Firewalls (NGFW), stateful inspection vs packet filtering, and micro-segmentation.',
    tips: 'Stateful firewalls maintain connection state tables tracking SYN, SYN-ACK, ACK sequences; stateless ACLs evaluate each packet in isolation.',
    body: `# CompTIA Network+ Domain 4: Network Security & Zero Trust

## 4.1 IEEE 802.1X Port-Based Network Access Control (PNAC)
802.1X provides strong cryptographic authentication for wired Ethernet ports and wireless SSIDs:
- **Supplicant**: Client device requesting access (workstation, phone).
- **Authenticator**: Edge switch or Wireless Access Point (WAP) enforcing port state.
- **Authentication Server**: Central RADIUS (Remote Authentication Dial-In User Service) or TACACS+ server verifying credentials against Active Directory/LDAP.

\`\`\`
+--------------+        EAPOL         +---------------+        RADIUS        +-----------------------+
|  Supplicant  | <==================> | Authenticator | <==================> | Authentication Server |
| (Client PC)  |   (802.1X Protocol)  | (Edge Switch) |     (Access-Req)     |   (RADIUS / Identity) |
+--------------+                      +---------------+                      +-----------------------+
\`\`\`

## 4.2 Network Attack Vectors & Mitigations
- **ARP Poisoning / Spoofing**: Attacker sends fraudulent ARP replies associating their MAC address with default gateway IP. **Mitigation**: Dynamic ARP Inspection (DAI) coupled with DHCP Snooping.
- **Rogue DHCP Server**: Unauthorized device leases invalid IP configurations. **Mitigation**: DHCP Snooping trusted switch ports.
- **VLAN Hopping**: Switch Spoofing (exploiting DTP) or Double Tagging. **Mitigation**: Disable Dynamic Trunking Protocol (DTP) and change default Native VLAN 1.`
  },

  // =========================================================================
  // GIAC Security Leadership Certification (GSLC) Master Chapters (Domains 1 to 4)
  // =========================================================================
  {
    cert_id: GSLC_ID,
    dom_num: 1,
    title: 'GSLC Domain 1 Master Guide: Executive Security Governance & Strategic Leadership',
    doc_title: 'SANS MGT512 / GIAC Security Leadership Body of Knowledge',
    edition: '2026 Edition',
    chapter_number: 1,
    read_min: 45,
    takeaways: 'Aligning cybersecurity with business goals, CISO charter, Executive Board communication, Policy/Standard/Guideline hierarchy, and ROSI calculations.',
    tips: 'Return on Security Investment formula: ROSI = (ALE_before - ALE_after - Annual_Cost) / Annual_Cost.',
    body: `# GIAC Security Leadership (GSLC) Domain 1: Governance & Strategic Leadership

## 1.1 The Executive Security Governance Mandate
Enterprise security management is a business enabler rather than a purely technical function. Key leadership pillars:
- **CISO Reporting Structure**: Direct reporting to the CEO, COO, or Audit Committee of the Board avoids operational conflicts of interest often present when reporting solely to IT infrastructure heads.
- **Information Security Charter**: Formally delegates authority to the security organization, endorsed by the Board of Directors.
- **Security Policy Hierarchy**:
  1. **Policies (Mandatory)**: High-level management directives (e.g., Acceptable Use Policy).
  2. **Standards (Mandatory)**: Specific, measurable rules (e.g., AES-256 encryption for all data at rest).
  3. **Baselines (Mandatory)**: Minimum security configuration templates (e.g., CIS Level 1 OS benchmarks).
  4. **Guidelines (Discretionary)**: Recommended best practice advice.
  5. **Procedures (Mandatory)**: Step-by-step implementation instructions.

\`\`\`
+-------------------------------------------------------------------+
|               RETURN ON SECURITY INVESTMENT (ROSI)                |
|                                                                   |
|          (Risk Mitigation Value - Annual Cost of Solution)        |
|  ROSI = ----------------------------------------------------      |
|                      Annual Cost of Solution                      |
|                                                                   |
|  Where: Risk Mitigation Value = (ALE_prior - ALE_post_control)    |
+-------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: GSLC_ID,
    dom_num: 3,
    title: 'GSLC Domain 3 Master Guide: Incident Response Orchestration & Cyber Threat Intelligence',
    doc_title: 'SANS MGT512 / GIAC Security Leadership Body of Knowledge',
    edition: '2026 Edition',
    chapter_number: 3,
    read_min: 40,
    takeaways: 'NIST SP 800-61 vs SANS 6-step incident handling lifecycle, Cyber Kill Chain & MITRE ATT&CK integration, and executive crisis communication.',
    tips: 'SANS Incident Steps: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned (PICERL).',
    body: `# GIAC Security Leadership (GSLC) Domain 3: Incident Response & Threat Intelligence

## 3.1 SANS 6-Phase Incident Handling Lifecycle (PICERL)

\`\`\`
+-------------------------------------------------------------------------+
|                  SANS INCIDENT HANDLING LIFECYCLE (PICERL)              |
|                                                                         |
|  [ 1. Preparation ]   ---> Tooling, playbooks, team readiness, training |
|          |                                                              |
|          v                                                              |
|  [ 2. Identification ] ---> Anomaly detection, triage, scope assessment |
|          |                                                              |
|          v                                                              |
|  [ 3. Containment ]   ---> Short-term isolation vs long-term staging    |
|          |                                                              |
|          v                                                              |
|  [ 4. Eradication ]   ---> Malware removal, vulnerability remediation   |
|          |                                                              |
|          v                                                              |
|  [ 5. Recovery ]      ---> Validated restoration to clean production    |
|          |                                                              |
|          v                                                              |
|  [ 6. Lessons Learned ] -> Post-mortem, RCA, playbook improvements      |
+-------------------------------------------------------------------------+
\`\`\`

## 3.2 Threat Intelligence Integration & Diamond Model
- **Strategic Threat Intel**: High-level geopolitical and industry risk summaries for executive leadership and Board committees.
- **Operational Threat Intel**: Adversary TTPs (Tactics, Techniques, and Procedures) mapped to the MITRE ATT&CK enterprise matrix.
- **Tactical Threat Intel**: Indicators of Compromise (IoCs) like SHA-256 malware hashes, malicious C2 IP addresses, and phishing URLs fed automatically to SIEM/SOAR playbooks.`
  },

  // =========================================================================
  // Additional Deep Reference Materials for Existing Certifications
  // =========================================================================
  {
    cert_id: CISA_ID,
    dom_num: 1,
    title: 'ISACA ITAF 4th Edition Standards & Comprehensive IT Audit Manual Reference',
    doc_title: 'IT Audit Manual Volumes 1-3 & ISACA ITAF 4th Edition',
    edition: '4th Edition / 2026 Release',
    chapter_number: 6,
    read_min: 35,
    takeaways: 'ITAF General, Performance, and Reporting standards, CAATs sampling strategies, and audit evidence sufficiency principles.',
    tips: 'ITAF Standard 1001 mandates an approved Audit Charter; Standard 1202 mandates objectivity and independence in mental attitude.',
    body: `# ISACA ITAF 4th Edition Standards & IT Audit Manual

## 1. Information Technology Assurance Framework (ITAF)
ITAF is the comprehensive framework of standards, guidelines, and tools establishing global benchmarks for IS audit:
- **General Standards (Series 1000)**: Audit charter mandate (1001), organizational independence (1002), professional competence (1003), due professional care (1004), and quality assurance (1005).
- **Performance Standards (Series 1200)**: Engagement planning (1201), risk assessment in planning (1202), audit performance and supervision (1203), materiality (1204), and evidence collection (1205).
- **Reporting Standards (Series 1400)**: Reporting format (1401) and follow-up activities on prior recommendations (1402).`
  },
  {
    cert_id: CRISC_ID,
    dom_num: 1,
    title: 'ISACA Risk IT Framework 2nd Edition Reference Guide',
    doc_title: 'Risk IT Framework 2nd Edition by ISACA',
    edition: '2nd Edition',
    chapter_number: 5,
    read_min: 30,
    takeaways: 'The 3 Risk IT Domains: Risk Governance (RG), Risk Evaluation (RE), and Risk Response (RR).',
    tips: 'Risk IT aligns operational IT risks with COSO Enterprise Risk Management (ERM) across all three lines of defense.',
    body: `# ISACA Risk IT Framework 2nd Edition Reference Guide

## 1. Risk IT Core Architecture & Domains
Risk IT complements COBIT by providing an end-to-end framework for managing IT-related enterprise risk:
1. **Risk Governance (RG)**: Establish common risk view, integrate with ERM, make risk-aware business decisions, set risk appetite.
2. **Risk Evaluation (RE)**: Collect risk data, analyze risk (quantitative & qualitative), maintain risk profiles and risk registers.
3. **Risk Response (RR)**: Articulate risk, select cost-effective risk treatments, react to risk events and incident anomalies.`
  },
  {
    cert_id: NIST_ID,
    dom_num: 4,
    title: 'NIST CSWP 29 & AI Risk Management Profile Reference',
    doc_title: 'NIST Cybersecurity White Paper 29 (NIST CSWP 29)',
    edition: '2026 Edition',
    chapter_number: 6,
    read_min: 35,
    takeaways: 'Bridging NIST CSF 2.0 and NIST AI RMF 1.0, AI trustworthiness characteristics, and automated LLM prompt injection defenses.',
    tips: 'NIST CSWP 29 aligns Govern, Map, Measure, and Manage functions for organizations deploying generative AI and machine learning.',
    body: `# NIST CSWP 29 & AI Risk Management Profile

## 1. Executive Summary of NIST CSWP 29
NIST Cybersecurity White Paper (CSWP) 29 provides an authoritative profile for applying the NIST Cybersecurity Framework (CSF 2.0) and NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0) to secure AI pipelines:
- **Training Data Poisoning**: Adversaries tamper with model training datasets to induce backdoors or biased behavior.
- **Model Inversion & Extraction**: Reconstruction of proprietary training data or sensitive personal information via query inference attacks.
- **Prompt Injection Defense**: Guardrails validating and isolating system instructions from untrusted user prompt inputs.`
  }
];

async function seedNewStudyMaterials() {
  await client.connect();
  console.log('=== SEEDING NEW MASTER STUDY MATERIALS & DEEP REFERENCES ===\n');

  for (const item of NEW_MATERIALS) {
    // Find domain_id
    const domRes = await client.query('SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2', [item.cert_id, item.dom_num]);
    if (domRes.rows.length === 0) {
      console.log(`[SKIP] Could not find domain for cert ${item.cert_id} dom ${item.dom_num}`);
      continue;
    }
    const domainId = domRes.rows[0].id;

    // Find first topic in domain
    const topRes = await client.query('SELECT id FROM topics WHERE domain_id = $1 ORDER BY sort_order LIMIT 1', [domainId]);
    const topicId = topRes.rows.length > 0 ? topRes.rows[0].id : null;

    const smId = uuidv4();
    await client.query(`
      INSERT INTO study_materials (
        id, certification_id, domain_id, topic_id, title, content_type,
        content_body, sort_order, document_title, edition, chapter_number,
        estimated_read_minutes, key_takeaways, exam_tips
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING;
    `, [
      smId, item.cert_id, domainId, topicId, item.title, 'text',
      item.body, item.chapter_number, item.doc_title, item.edition, item.chapter_number,
      item.read_min, item.takeaways, item.tips
    ]);

    console.log(`[MATERIAL] Ingested: "${item.title}"`);
  }

  const totalSm = await client.query('SELECT count(*) FROM study_materials');
  console.log(`\n========================================================================================`);
  console.log(`✅ TOTAL STUDY MATERIALS IN SYSTEM: ${totalSm.rows[0].count}`);
  console.log(`========================================================================================\n`);

  await client.end();
}

seedNewStudyMaterials().catch(console.error);
