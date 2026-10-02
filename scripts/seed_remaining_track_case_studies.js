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

const REMAINING_CASE_STUDIES = [
  // ==========================================
  // COMPTIA A+ CASE STUDIES (DOMAINS 2 - 9)
  // ==========================================
  {
    certCode: 'A+',
    domainNumber: 2,
    title: 'Branch Office Network Infrastructure Upgrade & Cabling Deployment',
    scenarioText: 'A regional health clinic is upgrading its local area network. Technicians must replace legacy Cat 5 cabling with Cat 6a runs to support 10 Gbps medical imaging workstations, deploy 802.11ax Wi-Fi 6 access points with WPA3-Enterprise authentication, and isolate guest Wi-Fi from the electronic health record (EHR) server VLAN.',
    sortOrder: 2,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which Ethernet cabling category standard should the lead technician specify to guarantee 10 Gbps transmission speeds at maximum channel lengths up to 100 meters (328 feet)?',
        optionA: 'Category 5e (Cat 5e)',
        optionB: 'Category 6 (Cat 6)',
        optionC: 'Category 6a (Cat 6a)',
        optionD: 'Category 3 (Cat 3)',
        correctAnswer: 'C',
        rationale: 'Cat 6a (Augmented) operates at 500 MHz and guarantees 10 Gbps speeds up to the full 100-meter standard distance, whereas standard Cat 6 is limited to 55 meters for 10 Gbps.'
      },
      {
        questionNumber: 2,
        stem: 'The clinic requires enterprise-grade wireless security where employees log in using their individual domain credentials rather than a shared passphrase. Which protocol must be configured on the RADIUS server?',
        optionA: 'WPA2-PSK (Pre-Shared Key)',
        optionB: 'IEEE 802.1X with EAP-TLS / PEAP',
        optionC: 'WEP 128-bit Shared Key',
        optionD: 'WPS (Wi-Fi Protected Setup) Push-Button',
        correctAnswer: 'B',
        rationale: 'WPA2/WPA3-Enterprise leverages IEEE 802.1X and a backend RADIUS server to authenticate each user individually using EAP-TLS or PEAP credentials.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 3,
    title: 'High-Performance Video Editing Workstation Hardware Assembly',
    scenarioText: 'A digital media agency orders custom-built workstations for 8K video rendering. The build requires multi-core Intel Core i9 processors, 128 GB of DDR5 RAM across 4 channels, dual M.2 NVMe PCIe Gen 4 SSDs configured for performance and parity, and an 80 PLUS Platinum power supply.',
    sortOrder: 3,
    questions: [
      {
        questionNumber: 1,
        stem: 'The video editors require a dedicated scratch disk that delivers maximum read/write IOPS and throughput without needing fault tolerance (since project files are archived to a central NAS). Which RAID configuration should be created across two NVMe drives?',
        optionA: 'RAID 0 (Disk Striping)',
        optionB: 'RAID 1 (Disk Mirroring)',
        optionC: 'RAID 5 (Disk Striping with Parity)',
        optionD: 'RAID 10 (Striped Mirrors)',
        correctAnswer: 'A',
        rationale: 'RAID 0 stripes data across both drives for maximum performance and 100% combined storage capacity, which is ideal for temporary scratch disks where redundancy is not required.'
      },
      {
        questionNumber: 2,
        stem: 'During the build, the technician notices the motherboard socket features flat contact pads while the CPU has an array of delicate gold pins. Which socket type is being installed?',
        optionA: 'LGA (Land Grid Array)',
        optionB: 'PGA (Pin Grid Array)',
        optionC: 'BGA (Ball Grid Array)',
        optionD: 'ZIF Socket 7',
        correctAnswer: 'B',
        rationale: 'In PGA (Pin Grid Array) processors, the pins are located on the underside of the CPU chip itself, whereas LGA places the pins inside the motherboard socket.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 4,
    title: 'Enterprise Client Virtualization & Cloud Sandbox Deployment',
    scenarioText: 'A software security testing firm requires developers to test untrusted applications on Windows 11 host workstations. Technicians configure Type 2 hypervisors with isolated virtual network adapters and automated sandbox restoration points.',
    sortOrder: 4,
    questions: [
      {
        questionNumber: 1,
        stem: 'A developer needs a virtual machine to be completely isolated from both the host operating system and the physical corporate network while testing potential malware. Which virtual switch adapter mode should the technician configure?',
        optionA: 'Bridged Adapter',
        optionB: 'NAT (Network Address Translation)',
        optionC: 'Host-Only / Internal Isolated Network',
        optionD: 'Promiscuous Mode Trunk',
        correctAnswer: 'C',
        rationale: 'Host-Only or Internal isolated networking creates a private network segment that prevents the guest VM from reaching external networks or the corporate LAN.'
      },
      {
        questionNumber: 2,
        stem: 'Before installing the client hypervisor, the installation wizard alerts that virtualization extensions are unavailable. Where must the technician navigate to resolve this issue?',
        optionA: 'Device Manager -> System Devices',
        optionB: 'UEFI/BIOS Firmware Settings -> CPU Configuration (Intel VT-x / AMD-V)',
        optionC: 'Windows Registry -> HKEY_LOCAL_MACHINE',
        optionD: 'Task Manager -> Services Tab',
        correctAnswer: 'B',
        rationale: 'Hardware virtualization extensions (Intel VT-x or AMD-V) must be explicitly enabled in the motherboard BIOS/UEFI firmware settings before hypervisors can initialize.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 5,
    title: 'Emergency Server Room Thermal Shutdown & Storage Degradation Diagnosis',
    scenarioText: 'An accounting firm’s primary on-premises file server suddenly shuts down in the middle of tax season. Upon reboot, the system generates loud clicking noises, displays S.M.A.R.T. threshold warnings, and flashes amber LEDs on drive bay #3 of its RAID 5 storage array.',
    sortOrder: 5,
    questions: [
      {
        questionNumber: 1,
        stem: 'According to the CompTIA 6-step troubleshooting methodology, what is the FIRST action the technician should take upon arriving at the server room?',
        optionA: 'Immediately purchase replacement hard drives from a vendor.',
        optionB: 'Identify the problem by gathering information, reviewing server event logs, and questioning users about symptoms.',
        optionC: 'Establish a theory of probable cause.',
        optionD: 'Reformat the entire RAID volume.',
        correctAnswer: 'B',
        rationale: 'Step 1 of the CompTIA troubleshooting model is to Identify the Problem: gather information, identify symptoms, question users, and inspect error logs.'
      },
      {
        questionNumber: 2,
        stem: 'The server RAID controller indicates that the RAID 5 volume is currently in a "Degraded" state due to the failure of Drive 3. What action should the technician perform to restore full redundancy?',
        optionA: 'Delete the RAID array and reconfigure as RAID 0.',
        optionB: 'Hot-swap the failed drive with an identical certified replacement drive and verify the rebuild initiates.',
        optionC: 'Disable S.M.A.R.T. monitoring in BIOS to suppress warning lights.',
        optionD: 'Power off the server for 48 hours to allow the magnetic platters to cool.',
        correctAnswer: 'B',
        rationale: 'In a degraded RAID 5 array, replacing the failed drive with a new unit allows the hardware controller to rebuild parity data onto the new disk without data loss.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 6,
    title: 'Enterprise Windows 11 Fleet Migration & Active Directory Deployment',
    scenarioText: 'Global Logistics Corp is migrating 500 legacy Windows 10 laptops to Windows 11 Enterprise. The lead systems administrator must prepare automated PXE deployment images, verify TPM 2.0 and Secure Boot compatibility, and enforce Group Policy lockdown settings.',
    sortOrder: 6,
    questions: [
      {
        questionNumber: 1,
        stem: 'Several older laptops fail the Windows 11 hardware prerequisite check. Which specific motherboard and firmware features are mandatory for native Windows 11 installations?',
        optionA: 'Legacy BIOS, MBR partition scheme, and DirectX 9',
        optionB: 'UEFI firmware with Secure Boot enabled and a TPM 2.0 chip',
        optionC: 'FAT32 file system and at least 2 GB of RAM',
        optionD: 'Parallel IDE interface and VGA graphics',
        correctAnswer: 'B',
        rationale: 'Windows 11 requires a compatible 64-bit multi-core CPU, 4 GB+ RAM, UEFI firmware with Secure Boot capability, and a Trusted Platform Module (TPM 2.0).'
      },
      {
        questionNumber: 2,
        stem: 'A technician needs to update Group Policy settings on a client workstation immediately without waiting for the default 90-minute background refresh interval. Which command-line tool should be executed?',
        optionA: 'gpresult /v',
        optionB: 'gpupdate /force',
        optionC: 'sfc /scannow',
        optionD: 'dism /online /cleanup-image',
        correctAnswer: 'B',
        rationale: 'The gpupdate /force command forces an immediate reapplication and synchronization of all user and computer Group Policy settings from Active Directory.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 7,
    title: 'Corporate Data Security Lockdown & Physical Access Control Overhaul',
    scenarioText: 'A financial institution is auditing its headquarters security. An external auditor discovers workstations left unlocked, contractors tailgating through secure doors, and decommissioned magnetic storage drives stored in an unlocked closet.',
    sortOrder: 7,
    questions: [
      {
        questionNumber: 1,
        stem: 'To prevent unauthorized personnel from following authorized employees through secure building entryways without badging in (tailgating), what physical security barrier should management install?',
        optionA: 'Bollards in the parking lot',
        optionB: 'An access control vestibule (mantrap)',
        optionC: 'CCTV dummy cameras',
        optionD: 'Keypad door knobs with shared 4-digit PINs',
        correctAnswer: 'B',
        rationale: 'An access control vestibule (mantrap) uses interlocking doors where the first door must fully close and lock before the authenticated user can pass through the second door, preventing tailgaters.'
      },
      {
        questionNumber: 2,
        stem: 'The IT department must decommission 50 legacy magnetic hard drives containing customer PII. According to NIST SP 800-88 guidelines, which sanitization technique renders magnetic media permanently unreadable by exposing it to strong magnetic fields?',
        optionA: 'Overwriting with zeros once (Quick Format)',
        optionB: 'Degaussing',
        optionC: 'Deleting all partitions in Disk Management',
        optionD: 'Placing drives in anti-static ESD shielding bags',
        correctAnswer: 'B',
        rationale: 'Degaussing exposes magnetic platters to powerful magnetic fields that permanently disrupt magnetic domains, sanitizing the data (Purge level under NIST SP 800-88).'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 8,
    title: 'Severe Ransomware Incident & 7-Step Malware Remediation Campaign',
    scenarioText: 'A marketing manager opens an invoice attachment from an unknown sender. Within minutes, desktop icons change to lock symbols, ransom notes pop up on screen, and network mapped drives begin showing encrypted files.',
    sortOrder: 8,
    questions: [
      {
        questionNumber: 1,
        stem: 'According to the CompTIA 7-step malware removal best practice, what is the IMMEDIATE priority action the first responder must take after identifying ransomware symptoms?',
        optionA: 'Disable Windows System Restore.',
        optionB: 'Quarantine the infected system by disconnecting Ethernet cables and turning off Wi-Fi.',
        optionC: 'Educate the marketing manager on phishing emails.',
        optionD: 'Pay the cryptocurrency ransom demand.',
        correctAnswer: 'B',
        rationale: 'Step 2 of the 7-step malware model is to Quarantine the infected system immediately to prevent lateral spread across corporate network shares and cloud backups.'
      },
      {
        questionNumber: 2,
        stem: 'Why does the CompTIA malware removal procedure require disabling Windows System Restore BEFORE initiating anti-malware scanning and remediation?',
        optionA: 'System Restore consumes too much CPU during scans.',
        optionB: 'To prevent malware binaries from being archived into restore points where they could reinfect the system later.',
        optionC: 'System Restore automatically deletes user documents.',
        optionD: 'It is required to unlock BitLocker.',
        correctAnswer: 'B',
        rationale: 'Disabling System Restore purges previous restore points, preventing hidden malware payloads from persisting in system volume backups and reinfecting the OS upon restoration.'
      }
    ]
  },
  {
    certCode: 'A+',
    domainNumber: 9,
    title: 'Enterprise Incident Handling, Safety & Change Management Compliance',
    scenarioText: 'An IT technician is dispatched to replace a failed power supply inside a computer involved in an active intellectual property theft investigation. The legal team requires strict evidence preservation, while the facility manager enforces environmental and ESD safety standards.',
    sortOrder: 9,
    questions: [
      {
        questionNumber: 1,
        stem: 'A digital forensic investigator hands the technician a hard drive tagged as legal evidence. What document MUST be meticulously signed and maintained every time physical control of the drive changes hands?',
        optionA: 'Service Level Agreement (SLA)',
        optionB: 'Chain of Custody Form',
        optionC: 'Request for Change (RFC)',
        optionD: 'Material Safety Data Sheet (MSDS)',
        correctAnswer: 'B',
        rationale: 'A Chain of Custody document chronologically tracks every individual who took possession of evidence, recording dates, times, purposes, and signatures to ensure legal admissibility in court.'
      },
      {
        questionNumber: 2,
        stem: 'Under which specific technical condition should an IT technician NEVER wear an Electrostatic Discharge (ESD) grounding wrist strap?',
        optionA: 'When installing DDR5 memory modules on a server motherboard',
        optionB: 'When repairing high-voltage internal components such as Power Supply Units (PSUs) or CRT displays',
        optionC: 'When handling M.2 NVMe solid-state storage drives',
        optionD: 'When crimping Cat 6a Ethernet cables',
        correctAnswer: 'B',
        rationale: 'Technicians must never wear grounded ESD wrist straps when working inside high-voltage devices (PSUs, CRTs) because the grounding wire creates a dangerous low-resistance path for electric shock through the technician’s body.'
      }
    ]
  },

  // ==========================================
  // COMPTIA NETWORK+ CASE STUDIES (DOMAINS 2 - 5)
  // ==========================================
  {
    certCode: 'NETWORK+',
    domainNumber: 2,
    title: 'Campus Switching Loop Prevention & 802.1Q VLAN Trunking Design',
    scenarioText: 'Apex University is expanding its campus network. Network engineers are linking four distribution switches in a ring topology to provide redundancy. During testing without STP configured, a broadcast storm consumes 100% of switch CPU capacity and causes total network failure.',
    sortOrder: 2,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which standard protocol must be enabled on all campus distribution switches to dynamically detect and block redundant Layer 2 loops while enabling sub-second failover?',
        optionA: 'Border Gateway Protocol (BGP)',
        optionB: 'Rapid Spanning Tree Protocol (RSTP - IEEE 802.1w)',
        optionC: 'Virtual Router Redundancy Protocol (VRRP)',
        optionD: 'Dynamic Host Configuration Protocol (DHCP)',
        correctAnswer: 'B',
        rationale: 'RSTP (IEEE 802.1w) prevents switching loops by creating a loop-free logical topology, transitioning ports to forwarding states in milliseconds during link failures.'
      },
      {
        questionNumber: 2,
        stem: 'When transmitting traffic across an inter-switch trunk carrying VLAN 10 (Faculty) and VLAN 20 (Students), what header encapsulation standard inserts a 12-bit VLAN identifier into Ethernet frames?',
        optionA: 'IEEE 802.11ax',
        optionB: 'IEEE 802.1Q',
        optionC: 'IEEE 802.3af (PoE)',
        optionD: 'IEEE 802.1X',
        correctAnswer: 'B',
        rationale: 'IEEE 802.1Q is the industry standard for VLAN trunking, inserting a 4-byte tag with a 12-bit VLAN ID (supporting up to 4094 VLANs) into the Ethernet frame.'
      }
    ]
  },
  {
    certCode: 'NETWORK+',
    domainNumber: 3,
    title: 'Enterprise Network Telemetry, SNMPv3 Monitoring & HA Redundancy',
    scenarioText: 'A multi-datacenter e-commerce enterprise requires 99.999% network availability during Black Friday. Network operations engineers configure SNMPv3 monitoring, flow telemetry analyzers, and First Hop Redundancy Protocols.',
    sortOrder: 3,
    questions: [
      {
        questionNumber: 1,
        stem: 'Security policy mandates that all network device telemetry must be protected against cleartext eavesdropping and unauthorized tampering. Which SNMP version and security level must be implemented?',
        optionA: 'SNMPv1 with public community string',
        optionB: 'SNMPv2c with read-write community strings',
        optionC: 'SNMPv3 with AuthPriv (Authentication and Privacy Encryption)',
        optionD: 'Syslog UDP 514 cleartext',
        correctAnswer: 'C',
        rationale: 'SNMPv3 with AuthPriv provides both cryptographic authentication (SHA-256) and privacy/confidentiality (AES-256 encryption), eliminating cleartext community string vulnerabilities.'
      },
      {
        questionNumber: 2,
        stem: 'Workstations on the trading floor require continuous outbound Internet access even if their primary default gateway switch suffers a hardware power failure. Which open-standard protocol provides default gateway redundancy via a shared Virtual IP?',
        optionA: 'VRRP (Virtual Router Redundancy Protocol)',
        optionB: 'OSPF (Open Shortest Path First)',
        optionC: 'LACP (Link Aggregation Control Protocol)',
        optionD: 'LLDP (Link Layer Discovery Protocol)',
        correctAnswer: 'A',
        rationale: 'VRRP is an open-standard First Hop Redundancy Protocol (FHRP) that creates a Virtual IP and MAC address shared between active and backup routers for seamless failover.'
      }
    ]
  },
  {
    certCode: 'NETWORK+',
    domainNumber: 4,
    title: 'Zero Trust Network Segmentation, NGFW & Threat Defense Architecture',
    scenarioText: 'A defense contractor is hardening its research network against nation-state advanced persistent threats (APTs). Security engineers implement 802.1X port authentication, inline Next-Generation Firewalls with TLS decryption, and Dynamic ARP Inspection.',
    sortOrder: 4,
    questions: [
      {
        questionNumber: 1,
        stem: 'An attacker connects an unauthorized laptop to a conference room Ethernet port and attempts to execute an ARP poisoning attack. Which switch security feature stops ARP spoofing by validating ARP requests against the DHCP snooping table?',
        optionA: 'BPDU Guard',
        optionB: 'Dynamic ARP Inspection (DAI)',
        optionC: 'PortFast',
        optionD: 'Jumbo Frames',
        correctAnswer: 'B',
        rationale: 'Dynamic ARP Inspection (DAI) intercepts all ARP requests and responses on untrusted switch ports, comparing them against the DHCP snooping database to drop spoofed ARP packets.'
      },
      {
        questionNumber: 2,
        stem: 'Which security framework component acts as the Authenticator in an IEEE 802.1X network access control deployment?',
        optionA: 'The client laptop running 802.1X software (Supplicant)',
        optionB: 'The network switch or wireless access point (Authenticator)',
        optionC: 'The central RADIUS / TACACS+ server (Authentication Server)',
        optionD: 'The Active Directory Certificate Authority',
        correctAnswer: 'B',
        rationale: 'In the IEEE 802.1X architecture, the Authenticator is the edge network device (switch or AP) that relays EAP packets between the Supplicant (client) and the Authentication Server (RADIUS).'
      }
    ]
  },
  {
    certCode: 'NETWORK+',
    domainNumber: 5,
    title: 'High-Latency Optical Backbone Diagnostics & Layer 3 Troubleshooting',
    scenarioText: 'A hospital network experiences intermittent packet loss and severe latency across its multi-mode fiber optic backbone linking the surgical wing to the main data center. Network engineers deploy hardware test gear and packet sniffers.',
    sortOrder: 5,
    questions: [
      {
        questionNumber: 1,
        stem: 'To determine the exact physical location of a suspected micro-fracture or dirty optical splice along a 400-meter fiber run, which diagnostic tool should the network engineer connect?',
        optionA: 'Tone Generator and Probe',
        optionB: 'Optical Time-Domain Reflectometer (OTDR)',
        optionC: 'Loopback plug',
        optionD: 'Punchdown tool',
        correctAnswer: 'B',
        rationale: 'An Optical Time-Domain Reflectometer (OTDR) transmits light pulses into the fiber core and analyzes reflected backscatter to measure exact distance (in meters) to cable breaks, bends, and dirty splices.'
      },
      {
        questionNumber: 2,
        stem: 'While capturing traffic in Wireshark, the engineer observes excessive TCP Retransmissions and TCP Dup ACKs. What is the most likely underlying root cause?',
        optionA: 'DNS resolution failure',
        optionB: 'Physical packet loss or asymmetric link congestion causing packets to drop in transit',
        optionC: 'The client using IPv6 instead of IPv4',
        optionD: 'Incorrect NTP time synchronization',
        correctAnswer: 'B',
        rationale: 'TCP Retransmissions and Duplicate ACKs occur when transmitted segments fail to reach the receiver or acknowledgments are lost, indicating physical packet drop or severe link congestion.'
      }
    ]
  },

  // ==========================================
  // GIAC GSLC CASE STUDIES (DOMAINS 2 - 4)
  // ==========================================
  {
    certCode: 'GSLC',
    domainNumber: 2,
    title: 'Enterprise Zero Trust Architecture & PKI Certificate Lifecycle Overhaul',
    scenarioText: 'A global fintech enterprise is transitioning from a traditional perimeter security model to a NIST SP 800-207 Zero Trust Architecture. The Chief Information Security Officer (CISO) must oversee an enterprise Public Key Infrastructure (PKI) refresh, mandate Hardware Security Modules (HSMs), and enforce micro-segmentation across hybrid multi-cloud workloads.',
    sortOrder: 2,
    questions: [
      {
        questionNumber: 1,
        stem: 'To protect the root of trust for the entire enterprise Public Key Infrastructure (PKI), how should the Root Certificate Authority (Root CA) be operated?',
        optionA: 'Hosted on a publicly accessible cloud VM with automated auto-scaling',
        optionB: 'Kept in an offline, air-gapped secure vault, powered off except when issuing certificates to Intermediate CAs',
        optionC: 'Configured on every domain controller running Active Directory Certificate Services',
        optionD: 'Stored in cleartext on a shared internal file server',
        correctAnswer: 'B',
        rationale: 'Best-practice enterprise PKI requires the Root CA to remain completely offline in a physically secure, air-gapped environment, issuing certificates only to subordinate Intermediate CAs that handle operational certificate issuance.'
      },
      {
        questionNumber: 2,
        stem: 'Under NIST SP 800-207 Zero Trust principles, which architectural component is responsible for evaluating user identity, device health, and environmental context to grant or deny access to a corporate resource?',
        optionA: 'Policy Decision Point (PDP)',
        optionB: 'Network Interface Card (NIC)',
        optionC: 'Static Perimeter Firewall',
        optionD: 'DNS Resolver Cache',
        correctAnswer: 'A',
        rationale: 'In Zero Trust Architecture, the Policy Decision Point (PDP) evaluates access requests against security policies and context, instructing the Policy Enforcement Point (PEP) to permit or block access.'
      }
    ]
  },
  {
    certCode: 'GSLC',
    domainNumber: 3,
    title: 'Major Ransomware Incident Response, CSIRT Coordination & Legal Disclosure',
    scenarioText: 'A healthcare system experiences an active double-extortion ransomware attack targeting patient databases and medical records. The CISO activates the Computer Security Incident Response Team (CSIRT), coordinates with General Counsel under Attorney-Client Privilege, and prepares regulatory notifications.',
    sortOrder: 3,
    questions: [
      {
        questionNumber: 1,
        stem: 'During the Containment phase of the incident response lifecycle, what is the critical technical priority before beginning eradication and remediation steps?',
        optionA: 'Immediately reformat all compromised domain controllers.',
        optionB: 'Isolate compromised network segments and preserve volatile memory (RAM) and log evidence for forensic analysis.',
        optionC: 'Delete all Active Directory user accounts.',
        optionD: 'Issue a press release disclosing the technical names of all compromised servers.',
        correctAnswer: 'B',
        rationale: 'During containment, isolating affected systems stops lateral malware propagation while preserving volatile forensic artifacts (memory dumps, live network connections) necessary for root cause analysis.'
      },
      {
        questionNumber: 2,
        stem: 'If the incident results in the confirmed compromise of protected health information (PHI) affecting over 500 individuals, what federal mandate dictates reporting timelines to the HHS Office for Civil Rights and affected individuals?',
        optionA: 'HIPAA Breach Notification Rule (within 60 days)',
        optionB: 'PCI-DSS Section 12',
        optionC: 'Sarbanes-Oxley Act (SOX) Section 404',
        optionD: 'FERPA Student Privacy Regulation',
        correctAnswer: 'A',
        rationale: 'The HIPAA Breach Notification Rule mandates that covered entities notify affected individuals and the HHS Office for Civil Rights without unreasonable delay and no later than 60 days following the discovery of a breach affecting 500+ individuals.'
      }
    ]
  },
  {
    certCode: 'GSLC',
    domainNumber: 4,
    title: 'SOC Transformation, SOAR Playbook Automation & Third-Party Risk Oversight',
    scenarioText: 'An insurance conglomerate is modernizing its Security Operations Center (SOC). To combat analyst alert fatigue and reduce Mean Time to Respond (MTTR), the CISO authorizes a Security Orchestration, Automation, and Response (SOAR) platform and implements a comprehensive Third-Party Risk Management (TPRM) audit for all cloud vendors.',
    sortOrder: 4,
    questions: [
      {
        questionNumber: 1,
        stem: 'What is the PRIMARY operational benefit of deploying automated SOAR playbooks for routine security alerts (such as reported phishing emails and brute-force lockouts)?',
        optionA: 'Completely eliminating the need for all security staff and CISO leadership',
        optionB: 'Drastically reducing Mean Time to Respond (MTTR) by automating evidence enrichment and rapid containment in milliseconds',
        optionC: 'Bypassing corporate change management requirements',
        optionD: 'Encrypting all production databases with symmetric keys',
        correctAnswer: 'B',
        rationale: 'SOAR platforms automate repetitive investigative and containment steps through API integrations, accelerating incident triage and drastically slashing Mean Time to Respond (MTTR).'
      },
      {
        questionNumber: 2,
        stem: 'When conducting third-party vendor due diligence for a critical cloud SaaS vendor storing corporate financials, which independent attestation report provides verified assurance on the OPERATIONAL EFFECTIVENESS of security controls over a minimum 6-month evaluation window?',
        optionA: 'SOC 1 Type I Report',
        optionB: 'SOC 2 Type II Report',
        optionC: 'Vendor self-attested marketing brochure',
        optionD: 'A copy of the vendor’s SSL certificate',
        correctAnswer: 'B',
        rationale: 'A SOC 2 Type II report provides independent CPA verification of both the suitability of control design and the operating effectiveness of those controls tested over a minimum 6-month historical period.'
      }
    ]
  }
];

async function seedCaseStudies() {
  await client.connect();
  console.log('=== SEEDING REMAINING DOMAIN CASE STUDIES FOR A+, NETWORK+, GSLC ===\n');

  for (const cs of REMAINING_CASE_STUDIES) {
    console.log(`\n--- Seeding Case Study: [${cs.certCode}] Domain ${cs.domainNumber} - "${cs.title}" ---`);
    
    // Find domain
    const domRes = await client.query(`
      SELECT d.id FROM domains d
      JOIN certifications c ON d.certification_id = c.id
      WHERE c.code = $1 AND d.domain_number = $2
    `, [cs.certCode, cs.domainNumber]);

    if (domRes.rows.length === 0) {
      console.log(`[WARN] Domain ${cs.domainNumber} for ${cs.certCode} not found!`);
      continue;
    }

    const domainId = domRes.rows[0].id;
    const caseStudyId = uuidv4();

    // Insert case study
    await client.query(`
      INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
      VALUES ($1, $2, $3, $4, $5);
    `, [caseStudyId, domainId, cs.title, cs.scenarioText, cs.sortOrder]);

    // Insert questions
    let qCount = 0;
    for (const q of cs.questions) {
      await client.query(`
        INSERT INTO case_study_questions (
          id, case_study_id, question_number, stem, option_a, option_b, option_c, option_d,
          correct_answer, rationale, sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        uuidv4(),
        caseStudyId,
        q.questionNumber,
        q.stem,
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
        q.correctAnswer,
        q.rationale,
        q.questionNumber
      ]);
      qCount++;
    }
    console.log(`[SUCCESS] Seeded case study with ${qCount} scenario questions`);
  }

  await client.end();
}

seedCaseStudies().catch(console.error);
