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

const EXPANDED_GLOSSARY = {
  'A+': [
    { term: 'Small Outline Dual In-line Memory Module', acronym: 'SODIMM', category: 'Hardware', definition: 'A smaller form factor memory module specifically designed for laptops, all-in-one PCs, and compact devices.' },
    { term: 'Non-Volatile Memory Express', acronym: 'NVMe', category: 'Storage', definition: 'A high-performance host controller interface and storage protocol designed for solid-state drives using high-speed PCIe lanes.' },
    { term: 'Unified Extensible Firmware Interface', acronym: 'UEFI', category: 'Firmware', definition: 'Modern firmware interface for PCs designed to replace the legacy BIOS, supporting drives >2TB and Secure Boot cryptographic signatures.' },
    { term: 'Trusted Platform Module', acronym: 'TPM', category: 'Security', definition: 'A dedicated hardware microchip embedded on motherboards that performs cryptographic key generation, hardware attestation, and BitLocker encryption.' },
    { term: 'Power-On Self-Test', acronym: 'POST', category: 'Hardware', definition: 'A built-in diagnostic program executed by firmware upon startup to verify essential hardware (CPU, RAM, GPU, storage) before booting the OS.' },
    { term: 'DisplayPort Multi-Stream Transport', acronym: 'MST', category: 'Peripherals', definition: 'A video technology that allows multiple independent video signals to be transmitted over a single DisplayPort cable to daisy-chained monitors.' },
    { term: 'Automatic Private IP Addressing', acronym: 'APIPA', category: 'Networking', definition: 'An automatic IP assignment protocol (169.254.0.1 - 169.254.255.254) used by Windows when a client fails to contact a dynamic DHCP server.' },
    { term: 'Near Field Communication', acronym: 'NFC', category: 'Mobile', definition: 'A short-range wireless communication standard operating at 13.56 MHz within 4 cm, used for contactless mobile payments and smart card access.' },
    { term: 'Simultaneous Authentication of Equals', acronym: 'SAE', category: 'Wireless Security', definition: 'A secure key exchange protocol used in WPA3 Personal networks that resists offline dictionary and brute-force eavesdropping attacks.' },
    { term: 'System File Checker', acronym: 'SFC', category: 'Operating Systems', definition: 'A Windows command-line utility (sfc /scannow) that scans and repairs damaged or modified protected system files from the Component Store.' },
    { term: 'Deployment Image Servicing and Management', acronym: 'DISM', category: 'Operating Systems', definition: 'A Windows CLI tool used to service, repair, and recover the Windows Component Store image using Windows Update or local ISO media.' },
    { term: 'Group Policy Object', acronym: 'GPO', category: 'Operating Systems', definition: 'A collection of administrative settings applied across Active Directory domain computers and users to enforce standardized security configurations.' },
    { term: 'Electrostatic Discharge', acronym: 'ESD', category: 'Safety', definition: 'The sudden flow of electricity between two objects caused by contact, which can destroy semiconductor components at voltages undetectable to humans.' },
    { term: 'Safety Data Sheet', acronym: 'SDS', category: 'Safety', definition: 'A standardized OSHA-mandated document outlining chemical hazards, safe handling procedures, personal protective equipment, and disposal protocols.' },
    { term: 'Zero Insertion Force', acronym: 'ZIF', category: 'Hardware', definition: 'A type of socket or connector designed so that no downward force is required to insert sensitive integrated circuits or ribbon cables.' },
    { term: 'Error-Correcting Code Memory', acronym: 'ECC RAM', category: 'Hardware', definition: 'Specialized system memory that uses an extra parity bit per byte to detect and correct single-bit memory errors, common in critical servers.' },
    { term: 'Preboot Execution Environment', acronym: 'PXE', category: 'Deployment', definition: 'An industry standard client/server environment allowing workstations to boot directly from a network interface card using DHCP and TFTP.' },
    { term: 'Redundant Array of Independent Disks', acronym: 'RAID', category: 'Storage', definition: 'A data storage virtualization technology that combines multiple physical disk drives into a single logical unit for redundancy or performance.' },
    { term: 'Blue Screen of Death', acronym: 'BSOD', category: 'Troubleshooting', definition: 'A Windows fatal stop error screen displayed when the OS kernel encounters a critical hardware driver failure or memory corruption.' },
    { term: 'Self-Monitoring, Analysis and Reporting Technology', acronym: 'S.M.A.R.T.', category: 'Storage', definition: 'A drive firmware monitoring system that tracks internal reliability indicators such as bad sectors and temperature to anticipate hardware failures.' },
    { term: 'Remote Desktop Protocol', acronym: 'RDP', category: 'Networking', definition: 'A proprietary Microsoft protocol operating over TCP port 3389 that provides graphical user interface remote management of Windows computers.' },
    { term: 'Server Message Block', acronym: 'SMB', category: 'Networking', definition: 'A network file sharing and communication protocol operating over TCP port 445 used extensively in Windows network environments.' },
    { term: 'Light-Emitting Diode Backlight', acronym: 'LED Backlight', category: 'Display', definition: 'An array of energy-efficient solid-state diodes placed behind or around the edges of an LCD panel to provide screen illumination.' },
    { term: 'In-Plane Switching', acronym: 'IPS', category: 'Display', definition: 'An LCD panel technology where liquid crystals align horizontally, delivering superior color accuracy and 178-degree wide viewing angles.' },
    { term: 'Twisted Nematic', acronym: 'TN', category: 'Display', definition: 'An LCD panel technology characterized by fast pixel response times and high refresh rates at the expense of narrow viewing angles and contrast.' },
    { term: 'Organic Light-Emitting Diode', acronym: 'OLED', category: 'Display', definition: 'A display technology where each individual subpixel emits its own light, eliminating the need for a backlight and delivering true infinite blacks.' },
    { term: 'Cold Cathode Fluorescent Lamp', acronym: 'CCFL', category: 'Display', definition: 'Legacy fluorescent tubes used as backlights in early LCD screens, requiring a high-voltage DC-to-AC power inverter board.' },
    { term: 'Time-Based One-Time Password', acronym: 'TOTP', category: 'Security', definition: 'An open algorithmic standard that computes a unique 6-digit authentication passcode based on a shared secret key and the current Unix epoch time.' },
    { term: 'BitLocker Drive Encryption', acronym: 'BitLocker', category: 'Security', definition: 'A full-volume encryption feature included in Windows Pro and Enterprise editions that protects data by encrypting the entire volume with AES.' },
    { term: 'Network Address Translation', acronym: 'NAT', category: 'Networking', definition: 'A networking technique that modifies IP header address information while in transit across a router, allowing multiple private hosts to share a single public IP.' },
    { term: 'Dynamic Host Configuration Protocol', acronym: 'DHCP', category: 'Networking', definition: 'A network management protocol operating on UDP ports 67/68 that automatically assigns IP addresses, subnet masks, and DNS servers to clients.' },
    { term: 'Domain Name System', acronym: 'DNS', category: 'Networking', definition: 'A hierarchical decentralized naming system operating on UDP/TCP port 53 that resolves human-readable domain names into numerical IP addresses.' },
    { term: 'Simple Mail Transfer Protocol', acronym: 'SMTP', category: 'Networking', definition: 'An Internet standard communication protocol operating on TCP ports 25, 587, and 465 used for sending electronic mail between servers.' },
    { term: 'Internet Message Access Protocol', acronym: 'IMAP', category: 'Networking', definition: 'An email retrieval protocol operating on TCP port 143 (or 993 with TLS) that synchronizes mailboxes bidirectionally between client devices and servers.' },
    { term: 'Post Office Protocol version 3', acronym: 'POP3', category: 'Networking', definition: 'A legacy email retrieval protocol operating on TCP port 110 (or 995 with TLS) that downloads emails locally and deletes them from the server.' },
    { term: 'Secure Shell', acronym: 'SSH', category: 'Networking', definition: 'A cryptographic network protocol operating on TCP port 22 for secure command-line access, remote login, and automated execution.' },
    { term: 'Simple Network Management Protocol', acronym: 'SNMP', category: 'Networking', definition: 'An application layer protocol operating on UDP ports 161/162 used for monitoring and managing network hardware components and bandwidth.' },
    { term: 'Lightweight Directory Access Protocol', acronym: 'LDAP', category: 'Networking', definition: 'An open vendor-neutral protocol operating on TCP port 389 (636 for LDAPS) used for querying and modifying directory services like Active Directory.' },
    { term: 'Change Advisory Board', acronym: 'CAB', category: 'Operations', definition: 'A committee of IT stakeholders responsible for reviewing, evaluating, authorizing, and scheduling changes to production IT environments.' },
    { term: 'Service Level Agreement', acronym: 'SLA', category: 'Operations', definition: 'A formal contractual commitment between a service provider and a customer that specifies measurable performance standards and uptime metrics.' },
    { term: 'Configuration Management Database', acronym: 'CMDB', category: 'Operations', definition: 'A centralized repository that stores information about all hardware, software, systems, and personnel configuration items (CIs) in an IT estate.' },
    { term: 'Chain of Custody', acronym: 'CoC', category: 'Security', definition: 'A chronological paper trail and evidentiary documentation recording the custody, control, transfer, analysis, and disposition of digital evidence.' },
    { term: 'Software as a Service', acronym: 'SaaS', category: 'Cloud', definition: 'A cloud delivery model where end-user software applications are hosted, maintained, and managed entirely by a third-party cloud provider.' },
    { term: 'Infrastructure as a Service', acronym: 'IaaS', category: 'Cloud', definition: 'A cloud computing model that provides virtualized computing infrastructure such as servers, networking, and raw block storage over the Internet.' },
    { term: 'Platform as a Service', acronym: 'PaaS', category: 'Cloud', definition: 'A cloud model providing a complete hardware and operating system development platform, allowing programmers to develop and deploy apps without server setup.' }
  ],

  'NETWORK+': [
    { term: 'Open Systems Interconnection Model', acronym: 'OSI Model', category: 'Concepts', definition: 'A 7-layer conceptual framework developed by ISO characterizing and standardizing telecommunication and computing functions.' },
    { term: 'Protocol Data Unit', acronym: 'PDU', category: 'Concepts', definition: 'A single unit of information transmitted among peer entities in a computer network (Data, Segment, Packet, Frame, Bits).' },
    { term: 'Variable Length Subnet Masking', acronym: 'VLSM', category: 'Addressing', definition: 'An IP subnetting technique that allows engineers to allocate subnets of different sizes to match host requirements without wasting address space.' },
    { term: 'Classless Inter-Domain Routing', acronym: 'CIDR', category: 'Addressing', definition: 'A method for allocating IP addresses and IP routing using prefix mask notation (e.g., /24) to replace rigid legacy classful address classes.' },
    { term: 'Stateless Address Autoconfiguration', acronym: 'SLAAC', category: 'Addressing', definition: 'An IPv6 method enabling host devices to dynamically configure their own IPv6 address and default gateway without requiring a DHCPv6 server.' },
    { term: 'Open Shortest Path First', acronym: 'OSPF', category: 'Routing', definition: 'An interior gateway link-state routing protocol that utilizes Dijkstra’s algorithm and Link-State Advertisements (LSAs) within hierarchical Areas.' },
    { term: 'Border Gateway Protocol', acronym: 'BGP', category: 'Routing', definition: 'The standard path-vector exterior gateway protocol that manages routing decisions across Autonomous Systems (AS) on the global Internet.' },
    { term: 'Virtual Local Area Network', acronym: 'VLAN', category: 'Switching', definition: 'A logical subnetwork that groups collections of network devices across physical switches into isolated broadcast domains.' },
    { term: 'IEEE 802.1Q', acronym: '802.1Q', category: 'Switching', definition: 'The networking standard that supports VLAN tagging on Ethernet frames by inserting a 4-byte header containing a 12-bit VLAN identifier.' },
    { term: 'Rapid Spanning Tree Protocol', acronym: 'RSTP', category: 'Switching', definition: 'An IEEE standard (802.1w) that prevents Layer 2 bridge loops and converges link topologies in milliseconds following topology changes.' },
    { term: 'Bridge Protocol Data Unit', acronym: 'BPDU', category: 'Switching', definition: 'Data messages exchanged across switches running Spanning Tree Protocol to elect root bridges and establish loop-free paths.' },
    { term: 'Link Aggregation Control Protocol', acronym: 'LACP', category: 'Switching', definition: 'An IEEE standard (802.3ad/802.1ax) allowing multiple physical Ethernet links to be bundled into a single high-bandwidth logical link.' },
    { term: 'Wireless LAN Controller', acronym: 'WLC', category: 'Wireless', definition: 'A centralized appliance that manages and configures multiple Lightweight Access Points (LWAPs) across an enterprise wireless network.' },
    { term: 'Control and Provisioning of Wireless APs', acronym: 'CAPWAP', category: 'Wireless', definition: 'A standard networking protocol operating over UDP ports 5246/5247 that encapsulates control and data traffic between LWAPs and WLCs.' },
    { term: 'Orthogonal Frequency-Division Multiple Access', acronym: 'OFDMA', category: 'Wireless', definition: 'A multi-user wireless technology in Wi-Fi 6 (802.11ax) that subdivides RF channels into smaller sub-carriers to transmit to multiple clients simultaneously.' },
    { term: 'Multiple-Input Multiple-Output', acronym: 'MIMO', category: 'Wireless', definition: 'A wireless antenna technology that utilizes multiple transmit and receive antennas to multiply radio link capacity and spatial throughput.' },
    { term: 'Virtual Router Redundancy Protocol', acronym: 'VRRP', category: 'Operations', definition: 'An open standard First Hop Redundancy Protocol that dynamically assigns a virtual default gateway IP shared between active and standby routers.' },
    { term: 'Hot Standby Router Protocol', acronym: 'HSRP', category: 'Operations', definition: 'A proprietary Cisco default gateway redundancy protocol that provides transparent failover of first-hop IP devices.' },
    { term: 'Management Information Base', acronym: 'MIB', category: 'Monitoring', definition: 'A hierarchical database used by SNMP containing categorized Object Identifiers (OIDs) representing device status and metrics.' },
    { term: 'Object Identifier', acronym: 'OID', category: 'Monitoring', definition: 'A string of decimal numbers separated by dots (e.g., 1.3.6.1.2.1) used to uniquely identify managed parameters within an SNMP MIB.' },
    { term: 'IP Flow Information Export', acronym: 'IPFIX', category: 'Monitoring', definition: 'An IETF standard protocol based on NetFlow v9 for exporting IP network flow telemetry to network traffic analyzers.' },
    { term: 'Recovery Time Objective', acronym: 'RTO', category: 'Resilience', definition: 'The target duration of time within which a business process or network service must be restored following an outage or disaster.' },
    { term: 'Recovery Point Objective', acronym: 'RPO', category: 'Resilience', definition: 'The maximum acceptable amount of data loss measured in time that an organization can tolerate after a disruption.' },
    { term: 'Dynamic ARP Inspection', acronym: 'DAI', category: 'Security', definition: 'A security feature on network switches that validates ARP packets against the DHCP snooping binding database to prevent ARP spoofing.' },
    { term: 'DHCP Snooping', acronym: 'DHCP Snooping', category: 'Security', definition: 'A Layer 2 security mechanism that intercepts DHCP messages, builds a valid binding table, and filters untrusted DHCP offers from rogue servers.' },
    { term: 'IEEE 802.1X', acronym: '802.1X', category: 'Security', definition: 'An IEEE standard for port-based network access control that provides authenticated network access for devices using EAP protocols.' },
    { term: 'Extensible Authentication Protocol', acronym: 'EAP', category: 'Security', definition: 'An authentication framework frequently used in wireless networks and point-to-point connections providing methods like EAP-TLS and PEAP.' },
    { term: 'Remote Authentication Dial-In User Service', acronym: 'RADIUS', category: 'Security', definition: 'A centralized client/server protocol operating on UDP ports 1812/1813 that provides Authentication, Authorization, and Accounting (AAA).' },
    { term: 'Terminal Access Controller Access-Control System Plus', acronym: 'TACACS+', category: 'Security', definition: 'A Cisco-proprietary AAA protocol operating on TCP port 49 that completely separates authentication and authorization and encrypts entire payloads.' },
    { term: 'Encapsulating Security Payload', acronym: 'ESP', category: 'Security', definition: 'An IPsec protocol (IP protocol 50) that provides origin authenticity, data integrity, anti-replay, and confidential payload encryption.' },
    { term: 'Authentication Header', acronym: 'AH', category: 'Security', definition: 'An IPsec protocol (IP protocol 51) that provides data origin authentication and integrity for IP packets, but does NOT provide encryption.' },
    { term: 'Internet Key Exchange', acronym: 'IKEv2', category: 'Security', definition: 'A protocol used in IPsec VPNs that handles mutual authentication and establishes security associations (SAs) using Diffie-Hellman.' },
    { term: 'Next-Generation Firewall', acronym: 'NGFW', category: 'Security', definition: 'A deep-packet inspection firewall that integrates traditional port filtering with application awareness, TLS decryption, and inline IPS.' },
    { term: 'Demilitarized Zone', acronym: 'DMZ', category: 'Security', definition: 'A physical or logical subnetwork that exposes an organization’s external-facing services to an untrusted network while protecting internal LANs.' },
    { term: 'Secure Access Service Edge', acronym: 'SASE', category: 'Architecture', definition: 'A cloud-native architecture combining SD-WAN networking capabilities with security functions like CASB, FWaaS, and Zero Trust access.' },
    { term: 'Time-Domain Reflectometer', acronym: 'TDR', category: 'Diagnostics', definition: 'An electronic diagnostic instrument used to characterize and locate faults in metallic copper cables by measuring signal reflections.' },
    { term: 'Optical Time-Domain Reflectometer', acronym: 'OTDR', category: 'Diagnostics', definition: 'An optoelectronic instrument used to inspect optical fibers, measuring attenuation, splice losses, and distance to fiber breaks.' },
    { term: 'Small Form-Factor Pluggable', acronym: 'SFP', category: 'Hardware', definition: 'A compact hot-pluggable network interface transceiver used for telecommunications and data communications up to 1 Gbps (SFP+ up to 10 Gbps).' },
    { term: 'Carrier Sense Multiple Access with Collision Detection', acronym: 'CSMA/CD', category: 'Legacy', definition: 'A legacy media access control method used in half-duplex Ethernet to detect packet collisions and back off with randomized exponential delays.' },
    { term: 'Maximum Transmission Unit', acronym: 'MTU', category: 'Concepts', definition: 'The size of the largest Protocol Data Unit (PDU) that can be communicated in a single network layer transaction (typically 1500 bytes for Ethernet).' }
  ],

  'GSLC': [
    { term: 'Chief Information Security Officer', acronym: 'CISO', category: 'Governance', definition: 'The senior executive responsible for establishing and maintaining enterprise vision, strategy, and program to protect information assets.' },
    { term: 'Information Security Management System', acronym: 'ISMS', category: 'Governance', definition: 'A systematic approach defined in ISO/IEC 27001 for managing sensitive company information encompassing people, processes, and IT systems.' },
    { term: 'NIST Cybersecurity Framework 2.0', acronym: 'NIST CSF', category: 'Governance', definition: 'A voluntary guidance framework structured around six core functions: Govern, Identify, Protect, Detect, Respond, and Recover.' },
    { term: 'Key Performance Indicator', acronym: 'KPI', category: 'Metrics', definition: 'A quantifiable measure used to evaluate the success of an organization or employee in meeting strategic operational targets.' },
    { term: 'Key Risk Indicator', acronym: 'KRI', category: 'Metrics', definition: 'A forward-looking operational metric indicating changes in the risk profile of an enterprise or the likelihood of an adverse security event.' },
    { term: 'Return on Security Investment', acronym: 'ROSI', category: 'Finance', definition: 'A quantitative financial formula: ROSI = ((Monetary Risk Reduction - Cost of Control) / Cost of Control) * 100.' },
    { term: 'Hardware Security Module', acronym: 'HSM', category: 'Cryptography', definition: 'A dedicated physical computing device that safeguards and manages digital keys for strong authentication and cryptographic operations.' },
    { term: 'Public Key Infrastructure', acronym: 'PKI', category: 'Cryptography', definition: 'A comprehensive framework of hardware, software, policies, and procedures to create, manage, distribute, and revoke digital certificates.' },
    { term: 'Online Certificate Status Protocol', acronym: 'OCSP', category: 'Cryptography', definition: 'An Internet protocol used for obtaining the real-time revocation status of an X.509 digital certificate without downloading large CRLs.' },
    { term: 'Certificate Revocation List', acronym: 'CRL', category: 'Cryptography', definition: 'A list of digital certificates that have been revoked by the issuing Certificate Authority (CA) before their scheduled expiration date.' },
    { term: 'Zero Trust Architecture', acronym: 'ZTA', category: 'Architecture', definition: 'A security model defined in NIST SP 800-207 based on the principle of never trust, always verify, eliminating implicit trust based on network location.' },
    { term: 'Cloud Security Posture Management', acronym: 'CSPM', category: 'Cloud Security', definition: 'An automated market segment of security tools that assess cloud computing configurations to identify risk, drift, and compliance gaps.' },
    { term: 'Cloud Workload Protection Platform', acronym: 'CWPP', category: 'Cloud Security', definition: 'Workload-centric security solutions that discover and protect server VMs, containers, and serverless functions in cloud deployments.' },
    { term: 'Cloud Infrastructure Entitlement Management', acronym: 'CIEM', category: 'Cloud Security', definition: 'Next-generation solutions for managing cloud identities, access permissions, and enforcing least privilege across IAM roles.' },
    { term: 'Computer Security Incident Response Team', acronym: 'CSIRT', category: 'Operations', definition: 'A dedicated cross-functional group of security professionals that receives, reviews, investigates, and responds to cybersecurity incidents.' },
    { term: 'Tactics, Techniques, and Procedures', acronym: 'TTPs', category: 'Threat Intel', definition: 'The patterns of activities, methods, and specific behaviors associated with cyber threat actors cataloged in frameworks like MITRE ATT&CK.' },
    { term: 'Common Vulnerability Scoring System', acronym: 'CVSS', category: 'Vulnerability', definition: 'An open industry standard for assessing the severity of computer system security vulnerabilities on a scale from 0.0 to 10.0.' },
    { term: 'Exploit Prediction Scoring System', acronym: 'EPSS', category: 'Vulnerability', definition: 'A data-driven scoring system that estimates the probability (0 to 100%) that a software vulnerability will be exploited in the wild.' },
    { term: 'Known Exploited Vulnerabilities Catalog', acronym: 'CISA KEV', category: 'Vulnerability', definition: 'An authoritative catalog maintained by the US CISA listing vulnerabilities that have been confirmed to be weaponized in real-world attacks.' },
    { term: 'Security Orchestration, Automation, and Response', acronym: 'SOAR', category: 'Operations', definition: 'A stack of software programs that enables organizations to collect data about security threats and respond to events via automated playbooks.' },
    { term: 'Security Information and Event Management', acronym: 'SIEM', category: 'Operations', definition: 'A security system that aggregates, normalizes, and correlates log data from across an enterprise to detect active intrusions in real time.' },
    { term: 'Business Impact Analysis', acronym: 'BIA', category: 'Resilience', definition: 'A systematic process to determine and evaluate the potential operational and financial impacts of an interruption to critical business functions.' },
    { term: 'Maximum Tolerable Downtime', acronym: 'MTD', category: 'Resilience', definition: 'The maximum total time a business process can be disrupted without causing catastrophic or irreparable harm to the organization.' },
    { term: 'Third-Party Risk Management', acronym: 'TPRM', category: 'Governance', definition: 'The discipline of identifying, assessing, and mitigating risks associated with outsourcing work and partnering with third-party vendors.' },
    { term: 'Software Bill of Materials', acronym: 'SBOM', category: 'Supply Chain', definition: 'A formal, structured machine-readable inventory of software components, libraries, dependencies, and hierarchical metadata used in building software.' },
    { term: 'System and Organization Controls 2 Type II', acronym: 'SOC 2 Type II', category: 'Compliance', definition: 'An independent attestation report evaluating the operational design and operating effectiveness of security controls over a minimum 6-month period.' },
    { term: 'Standardized Information Gathering Questionnaire', acronym: 'SIG', category: 'Vendor Risk', definition: 'A standardized vendor risk assessment tool used to evaluate vendor security posture across 19 critical risk domains.' },
    { term: 'Attorney-Client Privilege', acronym: 'Legal', category: 'Legal', definition: 'A legal principle that keeps communications between an attorney and their client confidential, frequently leveraged during cyber breach investigations.' },
    { term: 'Purple Team Exercise', acronym: 'Testing', category: 'Testing', definition: 'A collaborative security testing engagement where Red Team attackers and Blue Team defenders work together in real-time to optimize detection capabilities.' }
  ]
};

async function expandGlossary() {
  await client.connect();
  console.log('=== EXPANDING GLOSSARY TERMS ACROSS CERTIFICATIONS ===\n');

  for (const [certCode, terms] of Object.entries(EXPANDED_GLOSSARY)) {
    console.log(`\n--- Expanding glossary for ${certCode} (${terms.length} terms) ---`);
    const certRes = await client.query('SELECT id FROM certifications WHERE code = $1', [certCode]);
    if (certRes.rows.length === 0) {
      console.log(`[WARN] Certification ${certCode} not found in DB`);
      continue;
    }
    const certId = certRes.rows[0].id;
    let count = 0;

    for (const item of terms) {
      await client.query(`
        INSERT INTO glossary_terms (id, certification_id, term, acronym, definition, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (certification_id, term) DO UPDATE SET
          acronym = EXCLUDED.acronym,
          definition = EXCLUDED.definition,
          category = EXCLUDED.category;
      `, [
        uuidv4(),
        certId,
        item.term,
        item.acronym || null,
        item.definition,
        item.category || 'General'
      ]);
      count++;
    }
    console.log(`[SUCCESS] Seeded/Updated ${count} terms for ${certCode}`);
  }

  await client.end();
}

expandGlossary().catch(console.error);
