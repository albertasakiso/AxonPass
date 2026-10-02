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

const CYSA_ID = 'a0000000-0000-0000-0000-000000000012';
const A_PLUS_ID = 'a0000000-0000-0000-0000-000000000013';
const NET_PLUS_ID = 'a0000000-0000-0000-0000-000000000014';
const GSLC_ID = 'a0000000-0000-0000-0000-000000000015';

const SECOPS_CHAPTERS = [
  // =========================================================================
  // CompTIA CySA+ Cybersecurity Analyst (CS0-003) (Domains 1 to 5)
  // =========================================================================
  {
    cert_id: CYSA_ID,
    dom_num: 1,
    ch_num: 1,
    sort_order: 1,
    title: 'Domain 1: Threat and Vulnerability Management Master Blueprint',
    doc_title: 'CompTIA CySA+ Official Examination Guide (CS0-003 / 2026 Edition)',
    edition: 'CS0-003 (2026)',
    read_min: 50,
    takeaways: 'CVSS v3.1 calculation vector (Base, Temporal, Environmental), vulnerability scanning vs penetration testing, passive vs active reconnaissance (Nmap, Shodan, WHOIS), and remediation prioritization.',
    tips: 'CVSS v3.1 Base Score components: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), Confidentiality (C), Integrity (I), Availability (A).',
    body: `# CompTIA CySA+ Domain 1: Threat and Vulnerability Management

## 1.1 The Vulnerability Management Lifecycle
Vulnerability management is an ongoing, continuous process to discover, prioritize, remediate, and verify vulnerabilities before adversaries exploit them.

\`\`\`
+-------------------------------------------------------------------------+
|                  VULNERABILITY MANAGEMENT LIFECYCLE                     |
|                                                                         |
|  [ 1. Discover ] ──> Asset inventory, unmanaged device scanning         |
|         │                                                               |
|         ▼                                                               |
|  [ 2. Prioritize ] > CVSS v3.1 scoring, asset criticality, threat intel |
|         │                                                               |
|         ▼                                                               |
|  [ 3. Assess ] ────> Vulnerability scanning (Nessus/Qualys/OpenVAS)     |
|         │                                                               |
|         ▼                                                               |
|  [ 4. Remediate ] ─> Patching, configuration hardening, compensating    |
|         │                                                               |
|         ▼                                                               |
|  [ 5. Verify ] ────> Rescan to confirm remediation efficacy             |
+-------------------------------------------------------------------------+
\`\`\`

## 1.2 Common Vulnerability Scoring System (CVSS v3.1)
CVSS provides an open framework for communicating the characteristics and severity of software vulnerabilities:
- **Base Metric Group**: Inherent qualities of a vulnerability that are constant over time and user environments.
  - **Exploitability Metrics**:
    - *Attack Vector (AV)*: Network (N), Adjacent (A), Local (L), Physical (P).
    - *Attack Complexity (AC)*: Low (L), High (H).
    - *Privileges Required (PR)*: None (N), Low (L), High (H).
    - *User Interaction (UI)*: None (N), Required (R).
  - **Scope (S)**: Unchanged (U) vs Changed (C).
  - **Impact Metrics**: Confidentiality (C), Integrity (I), Availability (A) rated High (H), Low (L), or None (N).

\`\`\`
+-------------------------------------------------------------------------+
|                    CVSS V3.1 RATING SEVERITY SCALE                      |
|                                                                         |
|  Base Score Range      Severity Rating                                  |
|  ----------------      ---------------                                  |
|  0.0                   None                                             |
|  0.1 – 3.9             Low                                              |
|  4.0 – 6.9             Medium                                           |
|  7.0 – 8.9             High                                             |
|  9.0 – 10.0            Critical                                         |
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: CYSA_ID,
    dom_num: 3,
    ch_num: 3,
    sort_order: 3,
    title: 'Domain 3: Security Operations & Continuous Monitoring (SIEM & MITRE ATT&CK)',
    doc_title: 'CompTIA CySA+ Official Examination Guide (CS0-003 / 2026 Edition)',
    edition: 'CS0-003 (2026)',
    read_min: 50,
    takeaways: 'SIEM event correlation, behavioral anomaly detection (UEBA), MITRE ATT&CK framework mapping, Syslog format, PCAP deep packet inspection with Wireshark, and SOAR playbooks.',
    tips: 'UEBA establishes a dynamic baseline of normal user behavior (logins, file access volumes, times) to alert on anomalous deviations.',
    body: `# CompTIA CySA+ Domain 3: Security Operations and Monitoring

## 3.1 SIEM Architecture and Log Analysis
Security Information and Event Management (SIEM) aggregates, normalizes, correlates, and alerts on telemetry from firewalls, endpoints, servers, and cloud environments:
- **Normalization**: Converting disparate log formats (Syslog, Windows Event Log, JSON, CEF) into a standardized schema.
- **Correlation Rules**: Evaluating relationships between multiple distinct events over time (e.g., 5 failed SSH logins followed by a successful sudo command within 60 seconds).

\`\`\`
+-------------------------------------------------------------------------+
|                  MITRE ATT&CK ENTERPRISE MATRIX STAGES                  |
|                                                                         |
|  [ Reconnaissance ] ──> [ Resource Development ] ──> [ Initial Access ] |
|                                                              │          |
|  [ Privilege Escalation ] <── [ Persistence ] <── [ Execution ]         |
|         │                                                               |
|         ▼                                                               |
|  [ Defense Evasion ] ─> [ Credential Access ] ───> [ Discovery ]        |
|                                                          │              |
|  [ Impact ] <── [ Exfiltration ] <── [ Command & Control ] <─ [ Lateral]|
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: CYSA_ID,
    dom_num: 4,
    ch_num: 4,
    sort_order: 4,
    title: 'Domain 4: Incident Response & Digital Forensics (Volatility & Wireshark)',
    doc_title: 'CompTIA CySA+ Official Examination Guide (CS0-003 / 2026 Edition)',
    edition: 'CS0-003 (2026)',
    read_min: 50,
    takeaways: 'Live memory analysis with Volatility, network PCAP packet carving, containment strategies (isolation vs sandboxing), reverse malware analysis basics, and chain of custody documentation.',
    tips: 'Always compute cryptographic hashes (SHA-256) of forensic disk and memory images immediately upon acquisition to ensure legal evidentiary integrity.',
    body: `# CompTIA CySA+ Domain 4: Incident Response and Forensics

## 4.1 Live Memory Forensics & Artifacts
Volatile memory contains active malware processes, decrypted credentials, unencrypted network connections, and injected DLLs:
- **Volatility CLI Analysis**:
  - \`windows.pslist\` / \`windows.pstree\`: Enumerates active processes and parent-child process hierarchy.
  - \`windows.malfind\`: Scans memory pages for injected executable code (VAD permissions PAGE_EXECUTE_READWRITE).
  - \`windows.netscan\`: Identifies active and terminated network TCP/UDP sockets and foreign IP connections.

\`\`\`
+-------------------------------------------------------------------------+
|                    FORENSIC CHAIN OF CUSTODY PROTOCOL                   |
|                                                                         |
|  1. Evidence ID & Description (Make, Model, Serial Number)             |
|  2. Date, Time, and Location of Seizure                                 |
|  3. Seizing Officer / Investigator Name & Title                         |
|  4. Acquisition Method (Hardware write blocker used)                    |
|  5. Cryptographic Verification (Source SHA-256 = Target SHA-256)       |
|  6. Tamper-evident secure physical storage & access log                 |
+-------------------------------------------------------------------------+
\`\`\``
  },

  // =========================================================================
  // CompTIA Network+ (Domains 2, 3, 5 additions)
  // =========================================================================
  {
    cert_id: NET_PLUS_ID,
    dom_num: 2,
    ch_num: 2,
    sort_order: 2,
    title: 'Network+ Domain 2 Master Guide: Routing, Switching & Wireless Implementations',
    doc_title: 'CompTIA Network+ N10-008/009 Official Certification Guide',
    edition: '2026 Edition',
    read_min: 45,
    takeaways: 'Distance vector (RIP) vs Link-state (OSPF) vs Path-vector (BGP), 802.1Q VLAN encapsulation, Link Aggregation (LACP 802.3ad), and Wi-Fi 6/6E/7 (802.11ax/be) standards.',
    tips: 'OSPF uses Dijkstra SPF algorithm and is an Interior Gateway Protocol (IGP); BGP is the Exterior Gateway Protocol (EGP) powering internet routing.',
    body: `# CompTIA Network+ Domain 2: Network Implementations

## 2.1 Enterprise Routing Protocols
- **Distance Vector (RIPv2, EIGRP)**: Shares routing tables with direct neighbors based on hop count or composite metrics.
- **Link-State (OSPFv2/v3, IS-IS)**: Routers flood link-state advertisements (LSAs) and calculate the shortest path tree using Dijkstra's algorithm.
- **Path-Vector (Border Gateway Protocol - BGP)**: Exterior Gateway Protocol that routes autonomous systems (AS) across the global internet using AS-Path attributes.

\`\`\`
+-------------------------------------------------------------------------+
|                  ROUTING PROTOCOL COMPARISON MATRIX                     |
|                                                                         |
|  Protocol  Type           Algorithm        Metric         Use Case      |
|  --------  ----           ---------        ------         --------      |
|  RIPv2     Distance Vec.  Bellman-Ford     Hop Count      Small LAN     |
|  OSPF      Link-State     Dijkstra (SPF)   Cost (BW)      Enterprise LAN|
|  BGP       Path-Vector    Best Path Rules  AS-Path/Pref.  Internet WAN  |
+-------------------------------------------------------------------------+
\`\`\``
  },
  {
    cert_id: NET_PLUS_ID,
    dom_num: 5,
    ch_num: 5,
    sort_order: 5,
    title: 'Network+ Domain 5 Master Guide: Diagnostic Methodologies & Troubleshooting Tools',
    doc_title: 'CompTIA Network+ N10-008/009 Official Certification Guide',
    edition: '2026 Edition',
    read_min: 45,
    takeaways: 'The CompTIA 7-Step Troubleshooting Process, hardware diagnostic tools (OTDR, Time-Domain Reflectometer, Toner Probe, Cable Tester), and CLI commands (traceroute, ping, netstat, tcpdump, nslookup).',
    tips: 'CompTIA Troubleshooting Step 1: Identify the problem. Step 2: Establish a theory of probable cause. Step 3: Test the theory. Step 4: Establish a plan of action. Step 5: Implement the solution. Step 6: Verify full system functionality. Step 7: Document findings.',
    body: `# CompTIA Network+ Domain 5: Network Troubleshooting

## 5.1 The 7-Step Network Troubleshooting Methodology
1. **Identify the problem**: Gather information, question users, identify symptoms, determine scope of changes.
2. **Establish a theory of probable cause**: Question the obvious, consider multiple approaches (Top-Down, Bottom-Up, Divide-and-Conquer).
3. **Test the theory to determine cause**: If theory is confirmed, proceed; if not, re-establish a new theory or escalate.
4. **Establish a plan of action** to resolve the problem and identify potential effects.
5. **Implement the solution** or escalate as necessary.
6. **Verify full system functionality** and implement preventive measures.
7. **Document findings, actions, and outcomes** in enterprise ticketing and knowledge systems.`
  }
];

async function enrichSecOpsChapters() {
  await client.connect();
  console.log('=== ENRICHING SECOPS, CYSA+, NETWORK+, A+, GSLC CHAPTERS ===\n');

  for (const item of SECOPS_CHAPTERS) {
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

  console.log('\n✅ Security & Operations Study Materials successfully enriched to deep textbook grade!');
  await client.end();
}

enrichSecOpsChapters().catch(console.error);
