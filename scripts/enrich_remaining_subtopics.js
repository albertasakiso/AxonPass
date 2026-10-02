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

const SUBTOPIC_DEFINITIONS = {
  // ==========================================
  // COMPTIA A+ SUBTOPICS (52 SUBTOPICS)
  // ==========================================
  'A+': [
    // D1: Mobile Devices
    {
      topic_code: 'T1.1',
      subtopics: [
        {
          code: '1.1.1',
          name: 'Laptop Hardware Disassembly, SODIMM RAM & Storage Replacement',
          objectives: 'Identify laptop form factors, SODIMM DDR4/DDR5 installation, M.2 NVMe vs 2.5-inch SATA SSD replacement, and battery safety procedures.',
          tips: 'Always disconnect the AC adapter and remove/disable internal battery before touching internal laptop components. Document screw lengths!',
          read_minutes: 8,
          terms: ['SODIMM', 'M.2 NVMe', 'Thermal Paste', 'ZIF Connector'],
          body: 'Laptops utilize compact form-factor components. SODIMM (Small Outline Dual In-line Memory Module) is used for system memory. Storage upgrades typically involve replacing spinning 2.5-inch SATA HDDs with 2.5-inch SATA SSDs or M.2 NVMe PCIe drives. Technicians must observe ESD precautions, utilize plastic pry tools (spudgers), and keep track of varying screw lengths to avoid chassis puncture.'
        },
        {
          code: '1.1.2',
          name: 'Laptop Keyboards, Touchpads, Antennas & Specialty Function Keys',
          objectives: 'Diagnose and replace ribbon cable keyboards, precision touchpads, and internal Wi-Fi/Bluetooth antenna leads.',
          tips: 'Fn key combinations control display toggle, airplane mode, touchpad lock, and keyboard backlighting.',
          read_minutes: 7,
          terms: ['Ribbon Cable', 'Fn Key', 'Touchpad Calibration', 'Antenna Leads'],
          body: 'Laptop keyboards connect via delicate Zero Insertion Force (ZIF) ribbon cables. Built-in wireless antennas route up through the hinge assembly into the display bezel for optimal RF reception. Specialty Fn keys toggle display mirroring, volume, screen brightness, and external monitor outputs.'
        }
      ]
    },
    {
      topic_code: 'T1.2',
      subtopics: [
        {
          code: '1.2.1',
          name: 'LCD (TN, IPS, VA) vs OLED Display Technologies and Digitizers',
          objectives: 'Compare Twisted Nematic (TN), In-Plane Switching (IPS), Vertical Alignment (VA), and OLED mobile screens.',
          tips: 'IPS offers the best viewing angles and color reproduction. TN provides highest refresh rates. OLED provides true blacks without a backlight.',
          read_minutes: 8,
          terms: ['IPS Panel', 'OLED', 'Digitizer', 'Inverter'],
          body: 'Mobile displays use either LCD backlit panels (CCFL or LED) or self-emissive OLED panels. IPS panels provide 178-degree wide viewing angles and accurate color fidelity. OLED displays eliminate backlights, offering per-pixel dimming and true black levels. A digitizer is the glass touch-sensitive layer that converts analog touch/pen gestures into digital coordinates.'
        },
        {
          code: '1.2.2',
          name: 'Webcams, Microphones, Inverters and Display Cable Harnesses',
          objectives: 'Troubleshoot flickering screens, dim backlights on CCFL panels, integrated microphones, and high-flex display harnesses.',
          tips: 'If an LCD screen is very faint and visible only with a flashlight, the backlight or CCFL inverter has failed.',
          read_minutes: 6,
          terms: ['Inverter Board', 'CCFL Backlight', 'Flashlight Test', 'Hinge Harness'],
          body: 'Legacy LCDs use CCFL lamps powered by a high-voltage DC-to-AC inverter board. Modern displays use LED backlights driven directly from the system board. Display issues such as image ghosting or complete darkness while video out works indicate panel or inverter failures. The flashlight test reveals faint graphics if the backlight has failed.'
        }
      ]
    },
    {
      topic_code: 'T1.3',
      subtopics: [
        {
          code: '1.3.1',
          name: 'USB-C, Lightning, Micro-USB, Thunderbolt & Docking Stations',
          objectives: 'Compare peripheral interfaces, data throughput, power delivery (USB-PD), and port replicator vs proprietary dock functionality.',
          tips: 'Thunderbolt 4 provides 40 Gbps bi-directional bandwidth and PCIe tunneling over a standard USB-C connector.',
          read_minutes: 8,
          terms: ['Thunderbolt 4', 'USB-PD (Power Delivery)', 'DisplayPort Alt Mode', 'Port Replicator'],
          body: 'Mobile connectivity relies on standardized interfaces. USB-C offers reversible 24-pin connections supporting USB 3.2/USB4 data, DisplayPort Alt Mode video, and up to 240W USB Power Delivery. Proprietary docking stations provide legacy serial, video, and Ethernet expansion, while universal USB-C docks use DisplayLink or Alt Mode protocols.'
        },
        {
          code: '1.3.2',
          name: 'Mobile Wireless: Cellular (5G/LTE), GPS, NFC, RFID, and Bluetooth',
          objectives: 'Configure cellular data roaming, eSIM vs physical nano-SIM, GPS location services, Bluetooth pairing, and NFC contactless payments.',
          tips: 'NFC operates at 13.56 MHz with a range of under 4 cm, making it ideal for tap-to-pay (Apple Pay/Google Wallet).',
          read_minutes: 7,
          terms: ['eSIM', 'NFC (13.56 MHz)', 'Bluetooth BLE', 'GPS Triangulation'],
          body: 'Mobile devices leverage cellular 4G LTE/5G transceivers for WAN access. eSIM technology replaces physical SIM cards with programmable embedded chips. Bluetooth 5.x allows low-energy (BLE) peripheral connectivity. NFC operates within 4 cm for secure payment authorization and access badges.'
        }
      ]
    },
    // D2: Networking
    {
      topic_code: 'T2.1',
      subtopics: [
        {
          code: '2.1.1',
          name: 'Core TCP/UDP Well-Known Ports (20, 21, 22, 23, 25, 53, 80, 443)',
          objectives: 'Memorize essential network port numbers, transport protocols (TCP vs UDP), and security implications.',
          tips: 'SSH (22) provides encrypted CLI access replacing unencrypted Telnet (23). HTTPS (443) secures web traffic using TLS.',
          read_minutes: 9,
          terms: ['SSH Port 22', 'DNS Port 53', 'HTTPS Port 443', 'Telnet Port 23'],
          body: 'Standard well-known ports (0–1023) facilitate IP communications. FTP uses TCP 20/21, SSH uses TCP 22, Telnet uses TCP 23, SMTP uses TCP 25, DNS uses UDP/TCP 53, HTTP uses TCP 80, and HTTPS uses TCP 443. Secure protocols should always replace cleartext protocols in enterprise environments.'
        },
        {
          code: '2.1.2',
          name: 'Enterprise Service Ports: DHCP, TFTP, NTP, SNMP, LDAP, RDP, SMB',
          objectives: 'Configure and audit network infrastructure services and management ports.',
          tips: 'RDP uses TCP 3389. SMB uses TCP 445. SNMP uses UDP 161/162 for network device telemetry.',
          read_minutes: 8,
          terms: ['RDP 3389', 'SMB 445', 'SNMP 161', 'LDAP 389', 'DHCP 67/68'],
          body: 'Enterprise networks use DHCP (UDP 67/68) for dynamic IP assignment, TFTP (UDP 69) for PXE network booting, NTP (UDP 123) for clock synchronization, SNMP (UDP 161/162) for device monitoring, LDAP (TCP 389) and LDAPS (TCP 636) for directory queries, SMB (TCP 445) for Windows file sharing, and RDP (TCP 3389) for remote desktop access.'
        }
      ]
    },
    {
      topic_code: 'T2.2',
      subtopics: [
        {
          code: '2.2.1',
          name: 'Copper Cabling Categories (Cat 5e, 6, 6a, 7, 8) & T568A/B Pinouts',
          objectives: 'Terminate and test twisted-pair copper cables using T568A and T568B pinout standards.',
          tips: 'T568B order: Orange/White, Orange, Green/White, Blue, Blue/White, Green, Brown/White, Brown.',
          read_minutes: 9,
          terms: ['Cat 6a (10 Gbps 100m)', 'T568B Pinout', 'STP vs UTP', 'RJ-45 Crimping'],
          body: 'Twisted-pair Ethernet cables reduce electromagnetic interference (EMI) via differential signaling. Cat 5e supports 1 Gbps up to 100m. Cat 6 supports 10 Gbps up to 55m. Cat 6a supports 10 Gbps up to 100m. Standard commercial terminations follow the TIA/EIA T568B pinout standard.'
        },
        {
          code: '2.2.2',
          name: 'Fiber Optic Cabling (Single-Mode vs Multi-Mode) & Connectors (LC, SC, ST)',
          objectives: 'Select single-mode vs multi-mode fiber optic cabling, transceivers (SFP, SFP+), and connectors.',
          tips: 'Single-mode fiber (yellow jacket) uses laser light for long-haul WANs (up to 40km+). Multi-mode (aqua/orange) uses LEDs/VCSEL for campus/LAN runs (up to 550m).',
          read_minutes: 8,
          terms: ['Single-Mode Fiber (SMF)', 'Multi-Mode Fiber (MMF)', 'LC Connector', 'SFP+ Transceiver'],
          body: 'Fiber optics transmit data as light pulses, offering complete immunity to EMI/RFI and high bandwidth over long distances. Multi-mode fiber (MMF) features a wider 50/62.5 micron core for short-range links. Single-mode fiber (SMF) has a narrow 9-micron core for laser-driven long-haul links. Common connectors include LC (small form factor push-pull) and SC (square push-pull).'
        }
      ]
    },
    {
      topic_code: 'T2.3',
      subtopics: [
        {
          code: '2.3.1',
          name: '802.11 Wireless Standards (a/b/g/n/ac/ax/be) & Frequency Bands (2.4, 5, 6 GHz)',
          objectives: 'Compare Wi-Fi generation standards, frequency channels, channel bonding, and bandwidth limits.',
          tips: 'Wi-Fi 6 (802.11ax) introduces OFDMA and MU-MIMO across 2.4 GHz and 5 GHz. Wi-Fi 6E adds the 6 GHz spectrum.',
          read_minutes: 9,
          terms: ['Wi-Fi 6 (802.11ax)', '2.4 GHz vs 5 GHz', 'OFDMA', 'Channel Bonding'],
          body: 'Wireless networking operates under the IEEE 802.11 standards. The 2.4 GHz band provides longer range with 3 non-overlapping channels (1, 6, 11) but suffers from high interference. The 5 GHz band offers higher throughput and more non-overlapping channels. Wi-Fi 6 (802.11ax) introduces OFDMA (Orthogonal Frequency-Division Multiple Access) for multi-device efficiency.'
        },
        {
          code: '2.3.2',
          name: 'Wireless Security Protocols: WEP, WPA2-PSK/Enterprise, WPA3 (SAE)',
          objectives: 'Deploy secure wireless authentication methods, RADIUS 802.1X enterprise logins, and WPA3 Simultaneous Authentication of Equals.',
          tips: 'WPA3 uses SAE (Simultaneous Authentication of Equals) to prevent offline dictionary attacks, replacing WPA2 Pre-Shared Key (PSK).',
          read_minutes: 8,
          terms: ['WPA3 SAE', '802.1X RADIUS', 'WPA2-AES', 'Pre-Shared Key'],
          body: 'Legacy WEP and WPA-TKIP are insecure and deprecated. WPA2 utilizes AES-CCMP encryption in either Personal (PSK) or Enterprise (802.1X RADIUS) modes. WPA3 enhances security with 192-bit cryptographic strength and Simultaneous Authentication of Equals (SAE) to protect against passive brute-force eavesdropping.'
        }
      ]
    },
    // D3: Hardware
    {
      topic_code: 'T3.1',
      subtopics: [
        {
          code: '3.1.1',
          name: 'Motherboard Form Factors (ATX, Micro-ATX, Mini-ITX), Sockets & Chipsets',
          objectives: 'Identify motherboard sizes, PCIe expansion slot configurations (x1, x4, x8, x16), CPU socket designs (LGA vs PGA), and chipset architectures.',
          tips: 'LGA (Land Grid Array) places pins on the motherboard socket. PGA (Pin Grid Array) places pins on the CPU chip itself.',
          read_minutes: 9,
          terms: ['ATX Form Factor', 'LGA vs PGA', 'PCIe 4.0/5.0 Lanes', 'Northbridge/Southbridge Chipset'],
          body: 'Motherboards define the physical layout and expansion capacity of desktop systems. Standard ATX measures 12x9.6 inches, Micro-ATX measures 9.6x9.6 inches, and Mini-ITX measures 6.7x6.7 inches. Intel CPUs typically use LGA sockets where fragile pins reside in the socket, while traditional AMD CPUs use PGA where pins are on the processor underside.'
        },
        {
          code: '3.1.2',
          name: 'RAM Types (DDR4, DDR5), Multi-Channel Architecture, ECC vs Non-ECC',
          objectives: 'Calculate memory bandwidth, install dual/quad-channel DIMMs, and explain Error-Correcting Code (ECC) in servers.',
          tips: 'DDR5 memory integrates on-die ECC and dual 32-bit subchannels per DIMM, operating at lower 1.1V power.',
          read_minutes: 8,
          terms: ['DDR5 DIMM', 'Dual-Channel Memory', 'ECC RAM', 'CAS Latency'],
          body: 'System memory (RAM) holds active programs and data. DDR4 features 288 pins operating at 1.2V, while DDR5 maintains 288 pins with a different notch placement and onboard voltage regulation (PMIC) at 1.1V. Installing matched pairs of DIMMs in color-coded slots enables dual-channel memory interleaving, doubling effective memory bus throughput. ECC RAM detects and corrects single-bit errors.'
        }
      ]
    },
    {
      topic_code: 'T3.2',
      subtopics: [
        {
          code: '3.2.1',
          name: 'Storage Media: Magnetic HDD, SATA SSD, M.2 NVMe PCIe, & Optical Drives',
          objectives: 'Compare rotational speeds (5400/7200 RPM), SATA III (6 Gbps) vs NVMe PCIe 4.0 (64 Gbps) throughput, and form factors.',
          tips: 'NVMe SSDs communicate directly over the PCIe bus using the high-performance non-volatile memory express protocol, bypassing legacy AHCI SATA bottlenecks.',
          read_minutes: 8,
          terms: ['M.2 NVMe', 'SATA III 6Gbps', 'PCIe Gen4', 'IOPS'],
          body: 'Storage devices store operating systems and data. Traditional HDDs utilize magnetic spinning platters and actuator arms (high capacity, lower cost, mechanical failure risk). Solid-State Drives (SSDs) use NAND flash memory. While SATA SSDs are limited by the 600 MB/s SATA III limit, M.2 NVMe drives use 4 PCIe lanes to achieve transfer speeds exceeding 7,000 MB/s.'
        },
        {
          code: '3.2.2',
          name: 'RAID Configurations: RAID 0, RAID 1, RAID 5, RAID 10 & Hardware Controllers',
          objectives: 'Design fault-tolerant storage arrays, compute usable disk capacity, and configure hot-spare drives.',
          tips: 'RAID 0 (striping) has ZERO fault tolerance. RAID 1 (mirroring) requires 2 disks (50% capacity). RAID 5 requires minimum 3 disks (tolerates 1 failure). RAID 10 requires 4 disks (striped mirrors).',
          read_minutes: 9,
          terms: ['RAID 0 Striping', 'RAID 1 Mirroring', 'RAID 5 Parity', 'RAID 10 Striped Mirrors'],
          body: 'Redundant Array of Independent Disks (RAID) combines multiple physical drives for performance and/or fault tolerance. RAID 0 stripes data across 2+ drives for maximum speed without redundancy. RAID 1 mirrors data across 2 drives. RAID 5 stripes data with distributed parity across 3+ drives, surviving a single drive failure. RAID 10 combines RAID 1 mirroring and RAID 0 striping across 4+ drives.'
        }
      ]
    },
    {
      topic_code: 'T3.3',
      subtopics: [
        {
          code: '3.3.1',
          name: 'Power Supply Unit (PSU) Sizing, 80 PLUS Efficiency & Modular Cabling',
          objectives: 'Calculate total system wattage, select 24-pin ATX, 4/8-pin EPS CPU, and PCIe power connectors, and verify 80 PLUS certifications.',
          tips: 'Always size PSUs with 20-30% headroom above peak power draw. 80 PLUS Titanium guarantees 90%+ efficiency at all load levels.',
          read_minutes: 7,
          terms: ['24-Pin ATX', 'EPS12V', '80 PLUS Gold', 'Modular PSU'],
          body: 'The Power Supply Unit converts AC line voltage (115V/230V) into regulated DC voltages (+3.3V, +5V, +12V, -12V). Modern graphics cards and multi-core CPUs require dedicated +12V power rails via 8-pin EPS and 6+2-pin PCIe connectors. Modular PSUs allow technicians to connect only necessary cables, improving internal airflow and chassis cable management.'
        },
        {
          code: '3.3.2',
          name: 'Peripheral Interfaces: HDMI, DisplayPort, DVI, USB, and Audio Jacks',
          objectives: 'Connect and configure external monitors, KVM switches, optical audio (TOSLINK), and high-refresh video interfaces.',
          tips: 'DisplayPort supports daisy-chaining multiple monitors using Multi-Stream Transport (MST). HDMI does not support MST.',
          read_minutes: 7,
          terms: ['DisplayPort MST', 'HDMI 2.1', 'KVM Switch', 'TOSLINK'],
          body: 'DisplayPort 1.4/2.0 and HDMI 2.1 represent the modern standards for digital video and multi-channel audio transmission. DisplayPort supports packetized data transmission and Multi-Stream Transport (MST) daisy-chaining. KVM (Keyboard, Video, Mouse) switches allow a single console to control multiple physical workstations.'
        }
      ]
    },
    // D4: Virtualization & Cloud
    {
      topic_code: 'T4.1',
      subtopics: [
        {
          code: '4.1.1',
          name: 'Cloud Delivery Models: IaaS, PaaS, SaaS & Shared Responsibility',
          objectives: 'Differentiate Infrastructure as a Service, Platform as a Service, and Software as a Service delivery models.',
          tips: 'In IaaS, the customer manages OS, middleware, and applications. In SaaS, the cloud provider manages everything including software updates.',
          read_minutes: 8,
          terms: ['IaaS', 'PaaS', 'SaaS', 'Shared Responsibility'],
          body: 'Cloud computing provides on-demand network access to shared computing resources. IaaS (e.g., AWS EC2, Azure VMs) provides raw compute and storage where the customer manages the OS and applications. PaaS (e.g., AWS Elastic Beanstalk, Heroku) abstracts the OS so developers focus on code. SaaS (e.g., Microsoft 365, Salesforce) provides fully managed end-user software applications.'
        },
        {
          code: '4.1.2',
          name: 'Cloud Deployment Models: Public, Private, Hybrid & Community Cloud',
          objectives: 'Evaluate cloud deployment models based on privacy, compliance, capital expenditure, and operational scalability.',
          tips: 'Hybrid cloud combines private on-premises data centers with public cloud infrastructure via secure VPN or Direct Connect.',
          read_minutes: 7,
          terms: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Cloud Bursting'],
          body: 'Public clouds offer multi-tenant resources owned and operated by third-party providers. Private clouds provide dedicated single-tenant infrastructure for sensitive workloads. Hybrid clouds bridge private and public clouds to support elastic scalability, disaster recovery, and cloud bursting during peak traffic demand.'
        }
      ]
    },
    {
      topic_code: 'T4.2',
      subtopics: [
        {
          code: '4.2.1',
          name: 'Client-Side Virtualization: Type 1 (Bare-Metal) vs Type 2 (Hosted) Hypervisors',
          objectives: 'Install and configure desktop hypervisors (VirtualBox, VMware Workstation, Hyper-V) and allocate CPU/RAM resources.',
          tips: 'Type 1 hypervisors (ESXi, Hyper-V bare metal) run directly on hardware. Type 2 hypervisors (VirtualBox, Workstation) run as apps inside an OS.',
          read_minutes: 8,
          terms: ['Type 1 Hypervisor', 'Type 2 Hypervisor', 'Hardware Virtualization (VT-x/AMD-V)', 'Virtual NIC'],
          body: 'Hypervisors manage virtual machines (VMs) by partitioning physical hardware. Type 1 hypervisors run directly on bare metal for enterprise server virtualization. Type 2 hypervisors run on top of an existing host operating system for testing and development. Hardware virtualization must be enabled in the BIOS/UEFI (Intel VT-x or AMD-V).'
        },
        {
          code: '4.2.2',
          name: 'Virtual Networking (Bridged, NAT, Host-Only) & Resource Allocation',
          objectives: 'Configure virtual network adapters, snapshot management, and VM isolation.',
          tips: 'Bridged networking puts the VM directly on the physical LAN with its own IP. NAT shares the host IP address.',
          read_minutes: 7,
          terms: ['Bridged Adapter', 'NAT Virtual Network', 'Host-Only Network', 'VM Snapshot'],
          body: 'Virtual machines require virtual network adapters. Bridged mode connects the VM directly to the physical router, obtaining a dedicated LAN IP address. NAT mode places the VM behind an internal virtual router sharing the host’s IP. Host-only mode isolates VMs in a private network accessible only by the host system.'
        }
      ]
    },
    // D5: Hardware & Network Troubleshooting
    {
      topic_code: 'T5.1',
      subtopics: [
        {
          code: '5.1.1',
          name: 'CompTIA 6-Step Troubleshooting Methodology',
          objectives: 'Apply the official 6-step troubleshooting methodology in correct sequence for all hardware and software faults.',
          tips: '1. Identify problem -> 2. Establish theory of probable cause -> 3. Test theory -> 4. Plan action & implement -> 5. Verify full system functionality -> 6. Document findings.',
          read_minutes: 9,
          terms: ['6-Step Model', 'Theory of Cause', 'Escalation', 'Documentation'],
          body: 'The CompTIA troubleshooting model provides a structured approach: 1. Identify the problem (question the user, check error logs). 2. Establish a theory of probable cause (question the obvious). 3. Test the theory to determine cause. 4. Establish a plan of action and implement the solution. 5. Verify full system functionality and implement preventive measures. 6. Document findings, actions, and outcomes.'
        },
        {
          code: '5.1.2',
          name: 'POST Beep Codes, BIOS/UEFI Diagnostics & Overheating Remediation',
          objectives: 'Interpret Power-On Self-Test (POST) beep codes, motherboard debug LEDs, thermal throttling, and cooling failures.',
          tips: 'Continuous beeping during boot usually indicates missing or improperly seated RAM. Overheating causes unexpected thermal shutdowns under load.',
          read_minutes: 8,
          terms: ['POST Beep Codes', 'Debug 7-Segment LED', 'Thermal Throttling', 'CPU Heatsink'],
          body: 'When a computer boots, the BIOS/UEFI firmware executes the Power-On Self-Test (POST). If critical hardware (RAM, GPU, CPU) is missing or faulty before video initialization, the motherboard issues audible beep codes or displays 2-digit hex codes on debug LEDs. Overheating issues manifest as sudden shutdowns or thermal throttling caused by dried thermal paste or failing fans.'
        }
      ]
    },
    {
      topic_code: 'T5.2',
      subtopics: [
        {
          code: '5.2.1',
          name: 'Hard Drive Failure Symptoms (Click of Death, Bad Sectors, S.M.A.R.T. Errors)',
          objectives: 'Diagnose mechanical drive failures, S.M.A.R.T. threshold warnings, read/write IO errors, and SSD wear-leveling exhaustion.',
          tips: 'Rhythmic clicking sounds from an HDD indicate mechanical actuator arm or head crashes. Immediately back up data and replace the drive!',
          read_minutes: 8,
          terms: ['S.M.A.R.T. Monitoring', 'Click of Death', 'Bad Sectors', 'chkdsk /r'],
          body: 'Hard drive failures can be physical or logical. Mechanical drives exhibit repetitive clicking sounds when actuator heads fail. S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) tracks reallocated sectors and temperature warnings. Running chkdsk /r identifies and recovers readable data from damaged sectors.'
        },
        {
          code: '5.2.2',
          name: 'RAID Degradation, Rebuilding Arrays, and Boot Device Not Found Errors',
          objectives: 'Rebuild degraded RAID 1/5 arrays, recover from missing bootloaders (MBR/GPT), and configure boot order priorities.',
          tips: 'If a "Boot Device Not Found" error occurs, check UEFI boot order, loose SATA/NVMe connections, or corrupted EFI system partitions.',
          read_minutes: 8,
          terms: ['Degraded RAID', 'Hot-Swap Rebuild', 'EFI System Partition', 'Boot Order'],
          body: 'A degraded RAID 5 array continues operating with a single failed drive using parity calculations, but performance drops and a second failure causes data loss. The technician must replace the failed drive with an identical or larger unit and initiate an array rebuild. Missing boot errors occur when boot orders are misconfigured or partition tables are corrupted.'
        }
      ]
    },
    {
      topic_code: 'T5.3',
      subtopics: [
        {
          code: '5.3.1',
          name: 'IP Configuration Diagnostics (APIPA 169.254.x.x, DHCP Failures & DNS Issues)',
          objectives: 'Identify Automatic Private IP Addressing (APIPA), resolve default gateway mismatches, and troubleshoot DNS resolution.',
          tips: 'An IP address starting with 169.254.x.x indicates the client failed to reach a DHCP server (APIPA assigned).',
          read_minutes: 8,
          terms: ['APIPA (169.254.0.0/16)', 'DHCP Exhaustion', 'DNS Resolution Failure', 'ipconfig /release /renew'],
          body: 'When a device is set to DHCP but receives no response, Windows assigns an APIPA address (169.254.0.1 through 169.254.255.254), allowing local communication but preventing Internet access. Resolving DHCP pool exhaustion or network cable disconnects and running ipconfig /renew restores standard IP connectivity.'
        },
        {
          code: '5.3.2',
          name: 'Wi-Fi Signal Degradation: RSSI, Channel Overlap, Attenuation, and Captive Portals',
          objectives: 'Perform wireless site surveys, adjust channel widths, eliminate co-channel interference, and navigate captive portal logins.',
          tips: 'In dense 2.4 GHz environments, use non-overlapping channels 1, 6, and 11 with 20 MHz channel widths to avoid interference.',
          read_minutes: 8,
          terms: ['RSSI (dBm)', 'Co-Channel Interference', 'Captive Portal', 'Channel Width 20/40/80 MHz'],
          body: 'Wireless signal quality is measured via Received Signal Strength Indicator (RSSI) in negative dBm (e.g., -50 dBm is excellent, -85 dBm is unusable). High attenuation from concrete walls or interference from 2.4 GHz microwaves degrades performance. Captive portals require web-based authentication before allowing Internet access.'
        }
      ]
    },
    // D6: Operating Systems
    {
      topic_code: 'T6.1',
      subtopics: [
        {
          code: '6.1.1',
          name: 'Windows 10/11 Administrative Tools: MMC, Task Manager, Event Viewer & Disk Mgmt',
          objectives: 'Navigate Computer Management, Microsoft Management Console (MMC), Performance Monitor, Event Viewer, and Disk Management.',
          tips: 'Event Viewer logs are categorized into Application, Security, Setup, and System logs with Event IDs.',
          read_minutes: 9,
          terms: ['MMC (compmgmt.msc)', 'Event Viewer (eventvwr)', 'Disk Management (diskmgmt.msc)', 'Task Manager'],
          body: 'Windows administrative consoles centralize system control. Task Manager displays real-time CPU, RAM, disk, and GPU utilization along with startup impact. Event Viewer tracks critical application crashes, audit failures in security logs, and hardware driver alerts. Disk Management handles partition resizing, GPT/MBR conversion, and drive letter assignment.'
        },
        {
          code: '6.1.2',
          name: 'Windows CLI Utilities: SFC, DISM, CHKDSK, Taskkill, GPUpdate, GPResult',
          objectives: 'Repair corrupted system files using SFC and DISM, enforce Active Directory Group Policies, and manage CLI tasks.',
          tips: 'Always run DISM /Online /Cleanup-Image /RestoreHealth BEFORE sfc /scannow if the Windows Component Store is corrupted.',
          read_minutes: 9,
          terms: ['sfc /scannow', 'DISM /RestoreHealth', 'gpupdate /force', 'taskkill /PID'],
          body: 'Command-line utilities provide low-level repair capabilities. System File Checker (sfc /scannow) scans and replaces modified or corrupt system binaries from the Component Store. DISM repairs the underlying Component Store using Windows Update sources. gpupdate /force immediately pulls new Group Policy settings from Active Directory.'
        }
      ]
    },
    {
      topic_code: 'T6.2',
      subtopics: [
        {
          code: '6.2.1',
          name: 'macOS Navigation, Mission Control, Keychain & Time Machine Backups',
          objectives: 'Configure macOS System Settings, Keychain password management, Spotlight search, and Time Machine snapshot backups.',
          tips: 'Time Machine creates automated hourly, daily, and weekly incremental backups to external drives or network storage (SMB/AFP).',
          read_minutes: 8,
          terms: ['Time Machine', 'Keychain Access', 'Spotlight (Cmd+Space)', 'Mission Control'],
          body: 'macOS provides integrated system management utilities. Keychain Access securely encrypts passwords, certificates, and Wi-Fi keys. Time Machine provides automated incremental backup and restoration across external and network storage. Terminal provides POSIX-compliant bash/zsh shell access.'
        },
        {
          code: '6.2.2',
          name: 'Linux Terminal Commands: Navigation, Permissions (chmod/chown), grep & Package Mgmt',
          objectives: 'Execute Linux bash commands: ls, cd, pwd, cp, mv, rm, chmod, chown, grep, ps, kill, apt/yum.',
          tips: 'chmod 755 grants Read/Write/Execute to owner (7) and Read/Execute to group and others (5).',
          read_minutes: 9,
          terms: ['chmod 755', 'chown user:group', 'grep -i', 'apt update && apt upgrade'],
          body: 'Linux systems are managed via bash commands. File permissions are represented numerically (4=Read, 2=Write, 1=Execute) modified via chmod. File ownership is changed using chown. grep filters text output from files and piped commands. Package managers like apt (Debian/Ubuntu) and yum/dnf (RHEL/CentOS) manage software installations.'
        }
      ]
    },
    {
      topic_code: 'T6.3',
      subtopics: [
        {
          code: '6.3.1',
          name: 'Windows OS Installation Types: Clean Install, In-Place Upgrade & PXE Boot',
          objectives: 'Execute clean OS installations, in-place upgrades preserving user files, and network deployment via Preboot Execution Environment (PXE).',
          tips: 'A clean install formats the drive, wiping all previous data. An in-place upgrade preserves existing files, settings, and compatible applications.',
          read_minutes: 8,
          terms: ['Clean Install', 'In-Place Upgrade', 'PXE Network Boot', 'Windows PE'],
          body: 'Operating systems can be deployed via multiple methods. Clean installations format the primary partition, eliminating legacy software conflicts. In-place upgrades transition from older editions (e.g., Windows 10 to 11) while maintaining user data. Enterprise rollouts use PXE network booting to load Windows Preinstallation Environment (WinPE) over TFTP.'
        },
        {
          code: '6.3.2',
          name: 'Partition Schemes (MBR vs GPT) and File Systems (NTFS, FAT32, exFAT, APFS, ext4)',
          objectives: 'Format storage partitions, compare Master Boot Record vs GUID Partition Table, and evaluate file systems.',
          tips: 'GPT supports up to 128 primary partitions and drives >2 TB (requires UEFI). FAT32 has a maximum single file size limit of 4 GB.',
          read_minutes: 8,
          terms: ['GPT vs MBR', 'NTFS Permissions', 'FAT32 4GB Limit', 'exFAT Flash Storage'],
          body: 'Storage partitioning organizes raw disk space. MBR supports up to 4 primary partitions and 2 TB maximum volume size. GPT utilizes 64-bit logical block addressing supporting volumes up to 18.8 million TB and 128 partitions. NTFS supports file compression, encryption (EFS), and granular access control lists (ACLs). FAT32 is universally compatible but capped at 4 GB per file.'
        }
      ]
    },
    // D7: Security
    {
      topic_code: 'T7.1',
      subtopics: [
        {
          code: '7.1.1',
          name: 'Physical Security Controls: Mantrap, Biometrics, Badges, Bollards & Locks',
          objectives: 'Implement physical access control barriers, biometric scanners, RFID smart badges, and anti-tailgating mantraps.',
          tips: 'A mantrap (access control vestibule) uses interlocking doors to allow only one authenticated person to enter at a time, preventing tailgating.',
          read_minutes: 8,
          terms: ['Mantrap / Access Control Vestibule', 'Biometric Scanners', 'RFID Badges', 'Bollards'],
          body: 'Physical security protects hardware assets and human life. Mantraps prevent tailgating by requiring the outer door to lock before the inner door unlocks. Biometric authenticators (fingerprint, facial recognition, iris) verify physical identity. Bollards prevent vehicular ramming attacks against data centers.'
        },
        {
          code: '7.1.2',
          name: 'Multi-Factor Authentication (MFA) & Password Management Best Practices',
          objectives: 'Enforce MFA authentication factors (Something You Know, Have, Are, Somewhere You Are, Something You Do).',
          tips: 'Entering a password (Know) and a PIN (Know) is NOT MFA (it is single-factor dual authentication). Password (Know) + Authenticator App OTP (Have) IS MFA.',
          read_minutes: 8,
          terms: ['Something You Know', 'Something You Have', 'Something You Are', 'Time-based OTP (TOTP)'],
          body: 'Multi-factor authentication requires two or more distinct authentication categories: Something You Know (password/PIN), Something You Have (smart card, TOTP hardware token, smartphone app), and Something You Are (biometric fingerprint/retina). Enforcing MFA significantly reduces unauthorized account takeovers.'
        }
      ]
    },
    {
      topic_code: 'T7.2',
      subtopics: [
        {
          code: '7.2.1',
          name: 'Social Engineering Threats: Phishing, Vishing, Smishing, Spear Phishing & Whaling',
          objectives: 'Recognize social engineering tactics, executive impersonation (whaling), credential harvesting, and baiting attacks.',
          tips: 'Whaling specifically targets high-profile C-suite executives (CEO, CFO) to authorize fraudulent wire transfers or disclose executive data.',
          read_minutes: 8,
          terms: ['Spear Phishing', 'Whaling', 'Vishing (Voice)', 'Smishing (SMS)'],
          body: 'Social engineering exploits human psychology rather than technical vulnerabilities. Phishing uses bulk fraudulent emails. Spear phishing crafts customized lures targeting specific employees. Whaling targets executive leadership. Vishing uses deceptive phone calls, and smishing uses SMS text messages containing malicious links.'
        },
        {
          code: '7.2.2',
          name: 'Malware Types: Viruses, Worms, Trojans, Ransomware, Spyware, Rootkits & Botnets',
          objectives: 'Classify malware transmission methods, ransomware encryption, stealth rootkit evasion, and zombie botnet architectures.',
          tips: 'Worms are self-replicating across networks without user intervention. Viruses require a host file and user execution.',
          read_minutes: 8,
          terms: ['Ransomware', 'Self-Replicating Worm', 'Stealth Rootkit', 'Botnet C2'],
          body: 'Malware encompasses harmful software. Viruses attach to host files requiring user execution. Worms self-replicate across network vulnerabilities automatically. Ransomware encrypts user data using asymmetric/symmetric cryptography demanding payment for decryption keys. Rootkits modify kernel binaries to conceal presence from OS detection tools.'
        }
      ]
    },
    {
      topic_code: 'T7.3',
      subtopics: [
        {
          code: '7.3.1',
          name: 'Workstation Hardening: BitLocker Encryption, TPM 2.0, Secure Boot & BIOS Passwords',
          objectives: 'Enable Trusted Platform Module (TPM), BitLocker full-disk encryption, and UEFI Secure Boot signatures.',
          tips: 'BitLocker leverages the onboard TPM chip to store cryptographic volume encryption keys, preventing offline disk tampering.',
          read_minutes: 8,
          terms: ['BitLocker FDE', 'TPM 2.0', 'UEFI Secure Boot', 'Admin BIOS Password'],
          body: 'Workstation hardening protects endpoints against unauthorized access. BitLocker encrypts entire storage volumes, binding encryption keys to the motherboard’s TPM 2.0 chip. UEFI Secure Boot verifies that only digitally signed bootloaders and drivers execute, preventing bootkits from infecting system startup.'
        },
        {
          code: '7.3.2',
          name: 'Data Sanitization Standards (NIST SP 800-88): Clear, Purge, and Destroy',
          objectives: 'Apply data sanitization methods for media decommissioning including degaussing, cryptographic erase, and physical destruction.',
          tips: 'Degaussing renders magnetic media (HDDs/tapes) unusable by disrupting magnetic domains, but has ZERO effect on Solid-State Drives (SSDs).',
          read_minutes: 8,
          terms: ['NIST SP 800-88', 'Degaussing (Magnetic Only)', 'Cryptographic Erase (SSD)', 'Shredding / Incineration'],
          body: 'NIST SP 800-88 defines three levels of media sanitization: Clear (logical overwrite with zeros/patterns), Purge (rendering recovery infeasible via degaussing or Cryptographic Erase), and Destroy (physical shredding, incineration, or disintegration). SSDs must be purged via ATA Secure Erase or physically shredded.'
        }
      ]
    },
    // D8: Software Troubleshooting
    {
      topic_code: 'T8.1',
      subtopics: [
        {
          code: '8.1.1',
          name: 'Blue Screen of Death (BSOD) Troubleshooting, Dump Files & Safe Mode',
          objectives: 'Analyze Windows stop error codes, inspect minidump files with WinDbg, and boot into Safe Mode with Networking.',
          tips: 'Booting into Safe Mode loads only minimal essential drivers, allowing technicians to uninstall faulty GPU or network drivers causing BSODs.',
          read_minutes: 8,
          terms: ['BSOD Stop Code', 'Minidump Analysis (MEMORY.DMP)', 'Safe Mode (F8 / Shift+Restart)', 'Driver Rollback'],
          body: 'A Blue Screen of Death (BSOD) occurs when the Windows kernel encounters an unrecoverable bug check. Analyzing memory dump files reveals the specific driver (e.g., .sys file) or hardware address causing the fault. Safe Mode isolates third-party software conflicts by booting with Microsoft generic drivers.'
        },
        {
          code: '8.1.2',
          name: 'Application Hangs, Windows Services Management and Startup Optimization',
          objectives: 'Resolve application crashes, configure Windows service startup types (Automatic, Manual, Disabled), and manage startup apps.',
          tips: 'Use services.msc to restart hung services (such as Print Spooler) without rebooting the operating system.',
          read_minutes: 7,
          terms: ['services.msc', 'Task Manager Startup Tab', 'Print Spooler Crash', 'Clean Boot (msconfig)'],
          body: 'Application crashes often result from DLL corruption or hung background services. Technicians use services.msc to start, stop, or configure service recovery actions. Performing a clean boot via msconfig disables non-Microsoft services and startup items to isolate software conflicts.'
        }
      ]
    },
    {
      topic_code: 'T8.2',
      subtopics: [
        {
          code: '8.2.1',
          name: 'CompTIA 7-Step Malware Remediation Best Practice',
          objectives: 'Memorize and execute the official 7-step malware removal process in strict chronological sequence.',
          tips: '1. Investigate/Identify -> 2. Quarantine infected system (disconnect network!) -> 3. Disable System Restore -> 4. Remediate (update AV & scan) -> 5. Schedule scans/updates -> 6. Enable System Restore & create restore point -> 7. Educate end user.',
          read_minutes: 9,
          terms: ['7-Step Malware Model', 'Quarantine System', 'Disable System Restore', 'Educate End User'],
          body: 'The official CompTIA 7-step malware remediation process must be strictly adhered to: 1. Investigate and identify malware symptoms. 2. Quarantine the infected system (unplug Ethernet, disconnect Wi-Fi). 3. Disable System Restore (prevents malware reinfection from restore points). 4. Remediate infected systems (update signatures and scan in Safe Mode). 5. Schedule scans and run updates. 6. Enable System Restore and create a clean restore point. 7. Educate the end user.'
        },
        {
          code: '8.2.2',
          name: 'Ransomware Response, Browser Hijacking Remediation & Rogue Antivirus',
          objectives: 'Isolate ransomware outbreaks, restore data from offline immutable backups, and remove malicious browser extensions.',
          tips: 'Never pay ransom demands; disconnect the machine immediately from the network and restore from tested offline backups.',
          read_minutes: 8,
          terms: ['Ransomware Isolation', 'Offline Immutable Backup', 'Browser Redirects', 'Rogue Antivirus Popups'],
          body: 'Ransomware attacks demand immediate network containment to prevent lateral encryption of shared storage. Remediation requires wiping drives and restoring from verified offline backups. Browser hijackers and rogue popups are remediated by clearing cache, resetting browser settings to default, and removing malicious extensions.'
        }
      ]
    },
    {
      topic_code: 'T8.3',
      subtopics: [
        {
          code: '8.3.1',
          name: 'Mobile OS Performance: Battery Drain, Overheating, App Freezes & Storage Limits',
          objectives: 'Troubleshoot iOS/Android battery throttling, background app refresh, thermal safety shutdowns, and cache buildup.',
          tips: 'Excessive battery drain is often caused by rogue background location tracking apps or degraded lithium-ion battery health.',
          read_minutes: 7,
          terms: ['Battery Health (%)', 'Background App Refresh', 'Thermal Throttling', 'Clear App Cache'],
          body: 'Mobile device performance degrades when background tasks consume CPU/GPU cycles or storage approaches capacity. Checking battery health metrics identifies chemically depleted lithium-ion cells requiring physical replacement. Clearing application cache and restricting background location permissions restores battery longevity.'
        },
        {
          code: '8.3.2',
          name: 'Mobile Connectivity Troubleshooting: Wi-Fi Dropouts, Bluetooth & GPS Calibration',
          objectives: 'Resolve mobile network profile corruption, reset network settings, and calibrate compass/GPS sensors.',
          tips: 'Resetting Mobile Network Settings clears corrupted Wi-Fi passwords, Bluetooth pairings, and VPN profiles without deleting personal photos/apps.',
          read_minutes: 7,
          terms: ['Reset Network Settings', 'Airplane Mode Cycle', 'Bluetooth Unpair/Pair', 'GPS Location Accuracy'],
          body: 'Mobile wireless failures are often resolved by toggling Airplane Mode to re-register cellular and Wi-Fi transceivers. If connectivity issues persist, executing a Reset Network Settings flushes corrupted DHCP leases and routing tables while preserving user media.'
        }
      ]
    },
    // D9: Operational Procedures
    {
      topic_code: 'T9.1',
      subtopics: [
        {
          code: '9.1.1',
          name: 'IT Service Management (ITSM): Ticketing, SLAs, Escalation & Asset Tags',
          objectives: 'Log, prioritize, update, and resolve helpdesk tickets according to Service Level Agreements (SLAs) and asset tracking barcodes.',
          tips: 'Always update ticket work notes with customer interactions and technical steps before escalating to Tier 2/Tier 3 support.',
          read_minutes: 8,
          terms: ['ITSM Ticketing', 'SLA Response Times', 'Tiered Escalation (Tier 1/2/3)', 'Asset Inventory Barcode'],
          body: 'IT Service Management (ITSM) standardizes IT support delivery. Helpdesk tickets track incident categorization, user impact, and resolution timestamps. Service Level Agreements (SLAs) legally define maximum response and resolution timeframes. Physical asset tags link workstations to the Configuration Management Database (CMDB).'
        },
        {
          code: '9.1.2',
          name: 'Change Management Lifecycle: RFC, Approval Board (CAB), Rollback Plan & Testing',
          objectives: 'Submit Requests for Change (RFC), defend changes before the Change Advisory Board (CAB), and prepare documented rollback plans.',
          tips: 'Every Request for Change (RFC) MUST have a documented rollback plan before receiving CAB approval.',
          read_minutes: 8,
          terms: ['Request for Change (RFC)', 'Change Advisory Board (CAB)', 'Rollback Plan', 'Post-Implementation Review'],
          body: 'Change management minimizes operational disruption caused by infrastructure modifications. A Request for Change (RFC) outlines business justification, risk analysis, implementation steps, and a mandatory rollback plan. The Change Advisory Board (CAB) reviews and approves scheduled maintenance windows.'
        }
      ]
    },
    {
      topic_code: 'T9.2',
      subtopics: [
        {
          code: '9.2.1',
          name: 'Electrostatic Discharge (ESD) Prevention: Wrist Straps, Mats, and Anti-Static Bags',
          objectives: 'Prevent ESD damage when handling sensitive computer hardware (CPUs, RAM, GPUs).',
          tips: 'Never wear an ESD wrist strap when working inside high-voltage components like CRT monitors or opened Power Supply Units (PSUs)!',
          read_minutes: 7,
          terms: ['ESD Wrist Strap', 'Anti-Static Mat', 'ESD Shielding Bags', 'High-Voltage Safety Warning'],
          body: 'Electrostatic discharge (ESD) can destroy semiconductor gates at voltages as low as 100V—far below the 3,000V threshold human skin can feel. Technicians must wear grounded ESD wrist straps, use dissipative work mats, and store cards in metallic anti-static shielding bags. ESD straps must never be worn near high-voltage power supplies.'
        },
        {
          code: '9.2.2',
          name: 'Environmental Safety: Material Safety Data Sheets (MSDS/SDS) and Proper Disposal',
          objectives: 'Consult Safety Data Sheets (SDS) for chemical handling, battery recycling, and CRT/toner disposal compliance.',
          tips: 'Safety Data Sheets (SDS) contain emergency first-aid measures, chemical handling instructions, and environmental disposal requirements.',
          read_minutes: 7,
          terms: ['Safety Data Sheet (SDS/MSDS)', 'Lithium-Ion Battery Disposal', 'Toner Cartridge Recycling', 'OSHA Compliance'],
          body: 'Environmental safety regulations dictate the handling and disposal of hazardous IT materials. Safety Data Sheets (SDS) provide first-aid protocols, flammability ratings, and spill containment procedures for cleaning solvents and thermal paste. Lithium-ion batteries and mercury-containing CCFL tubes must be sent to certified recycling centers.'
        }
      ]
    },
    {
      topic_code: 'T9.3',
      subtopics: [
        {
          code: '9.3.1',
          name: 'Incident Response Basics: Chain of Custody, First Responder & Evidence Preservation',
          objectives: 'Preserve digital evidence, maintain a strict chain of custody log, and notify legal/security teams during security breaches.',
          tips: 'If a computer is suspected of involvement in a crime or active breach, preserve its volatile RAM state before powering down!',
          read_minutes: 8,
          terms: ['Chain of Custody', 'First Responder Protocol', 'Volatile Memory Capture', 'Evidence Integrity'],
          body: 'First responders to security incidents must follow strict evidence preservation protocols. The chain of custody document records the exact date, time, handler, and storage location for every collected physical or digital artifact. Altering or rebooting compromised machines can destroy volatile RAM evidence.'
        },
        {
          code: '9.3.2',
          name: 'Scripting Fundamentals: PowerShell (.ps1), Bash (.sh), Batch (.bat), Python (.py)',
          objectives: 'Identify basic scripting syntax, variables, loops, comments, and environment variables across shell scripting languages.',
          tips: 'PowerShell scripts use the .ps1 extension. Bash shell scripts use .sh and start with the shebang line (#!/bin/bash).',
          read_minutes: 8,
          terms: ['PowerShell (.ps1)', 'Bash Shebang (#!/bin/bash)', 'Environment Variables', 'Batch Script (.bat)'],
          body: 'Scripting automates repetitive administrative tasks. Windows PowerShell uses verb-noun cmdlets (e.g., Get-Service, Restart-Computer) operating on .NET objects. Linux bash scripts execute shell commands. Batch scripts (.bat) provide legacy command automation, while Python (.py) offers cross-platform data processing.'
        }
      ]
    }
  ],

  // ==========================================
  // COMPTIA NETWORK+ SUBTOPICS (30 SUBTOPICS)
  // ==========================================
  'NETWORK+': [
    // D1: Networking Concepts
    {
      topic_code: 'T1.1',
      subtopics: [
        {
          code: '1.1.1',
          name: 'OSI 7-Layer Model Functions, PDUs, and Encapsulation',
          objectives: 'Map protocols, hardware, and Protocol Data Units (PDUs) to all 7 layers of the OSI model.',
          tips: 'PDUs by layer: Layer 7-5 Data -> Layer 4 Segment -> Layer 3 Packet -> Layer 2 Frame -> Layer 1 Bits.',
          read_minutes: 9,
          terms: ['OSI 7 Layers', 'PDU Encapsulation', 'Layer 2 Frame', 'Layer 3 Packet'],
          body: 'The Open Systems Interconnection (OSI) model standardizes network communication across 7 layers: Physical (Layer 1 - Bits/cables), Data Link (Layer 2 - Frames/MAC/switches), Network (Layer 3 - Packets/IP/routers), Transport (Layer 4 - Segments/TCP/UDP), Session (Layer 5), Presentation (Layer 6 - Encryption/compression), and Application (Layer 7 - User services/HTTP).'
        },
        {
          code: '1.1.2',
          name: 'TCP 3-Way Handshake, TCP vs UDP Header Comparisons and MTU',
          objectives: 'Analyze TCP connection establishment (SYN, SYN-ACK, ACK), teardown (FIN/RST), and Maximum Transmission Unit (MTU) sizing.',
          tips: 'Standard Ethernet MTU is 1500 bytes. Jumbo frames allow up to 9000 bytes for storage networks (iSCSI/SAN).',
          read_minutes: 9,
          terms: ['TCP 3-Way Handshake', 'SYN-ACK', 'UDP Connectionless', 'MTU 1500 vs Jumbo 9000'],
          body: 'TCP provides reliable, ordered, and error-checked byte delivery via a 3-way handshake: Client sends SYN, Server replies with SYN-ACK, Client acknowledges with ACK. UDP is a lightweight connectionless protocol ideal for latency-sensitive voice (VoIP) and streaming video. MTU defines the largest packet size that can be transmitted without fragmentation.'
        }
      ]
    },
    {
      topic_code: 'T1.2',
      subtopics: [
        {
          code: '1.2.1',
          name: 'IPv4 Subnetting, VLSM Calculations & Classless Inter-Domain Routing (CIDR)',
          objectives: 'Calculate network IDs, broadcast addresses, usable host ranges, and subnet masks using Variable Length Subnet Masking (VLSM).',
          tips: 'A /24 subnet provides 254 usable hosts (2^8 - 2). A /28 subnet provides 14 usable hosts (2^4 - 2).',
          read_minutes: 10,
          terms: ['CIDR /24', 'VLSM', 'Network ID vs Broadcast ID', 'RFC 1918 Private IP'],
          body: 'IPv4 addressing uses 32-bit addresses divided into network and host portions. Subnetting partitions networks to improve security and conserve addresses. CIDR notation (e.g., 192.168.1.0/26) specifies the number of mask bits. RFC 1918 defines private address spaces: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.'
        },
        {
          code: '1.2.2',
          name: 'IPv6 Addressing: Global Unicast, Link-Local (fe80::), Anycast & SLAAC',
          objectives: 'Configure 128-bit IPv6 address notations, compress consecutive zeroes (::), and understand Stateless Address Autoconfiguration (SLAAC).',
          tips: 'Link-local addresses always start with fe80::/10 and are non-routable beyond the local network segment.',
          read_minutes: 9,
          terms: ['IPv6 128-Bit', 'Link-Local fe80::', 'Global Unicast 2000::/3', 'SLAAC (EUI-64)'],
          body: 'IPv6 eliminates IPv4 address exhaustion using 128-bit hexadecimal addresses. Address types include Global Unicast (publicly routable), Link-Local (fe80::/10, automatically generated for link-level communication), Multicast (one-to-many, replacing broadcasts), and Anycast (one-to-nearest). SLAAC enables hosts to configure their own IP without a DHCP server using Router Advertisements.'
        }
      ]
    },
    {
      topic_code: 'T1.3',
      subtopics: [
        {
          code: '1.3.1',
          name: 'Network Topologies: Star, Mesh, Spine-and-Leaf, Bus, and Ring',
          objectives: 'Design physical and logical topologies for enterprise data centers and campus networks.',
          tips: 'Spine-and-leaf data center topologies guarantee predictable single-hop latency between any two leaf top-of-rack switches.',
          read_minutes: 8,
          terms: ['Spine-and-Leaf', 'Star Topology', 'Full Mesh Redundancy', 'Top-of-Rack Switch'],
          body: 'Physical and logical topologies determine network fault tolerance and scalability. Modern data centers deploy spine-and-leaf architectures where every leaf switch connects to every spine switch, eliminating spanning tree blocking and providing deterministic east-west traffic latency.'
        },
        {
          code: '1.3.2',
          name: 'Structured Cabling Standards: Patch Panels, MDF/IDF, and Fiber Distribution',
          objectives: 'Design Main Distribution Facilities (MDF), Intermediate Distribution Facilities (IDF), and demarcations.',
          tips: 'The Demarcation Point (Demarc) separates customer-owned premises cabling from the Service Provider / Telco network.',
          read_minutes: 8,
          terms: ['MDF vs IDF', 'Demarcation Point', 'Patch Panel', 'Backbone Cabling'],
          body: 'Structured cabling provides organized physical network infrastructure. The Demarc is where the ISP handover occurs. The Main Distribution Facility (MDF) houses core switches and routers, connected via fiber backbone cabling to Intermediate Distribution Facilities (IDFs) on individual floors.'
        }
      ]
    },
    // D2: Network Implementation
    {
      topic_code: 'T2.1',
      subtopics: [
        {
          code: '2.1.1',
          name: 'Routing Protocols: OSPF (Link-State), BGP (Path-Vector), and Static Routing',
          objectives: 'Compare Interior Gateway Protocols (OSPF, EIGRP) and Exterior Gateway Protocols (BGP), administrative distance, and metrics.',
          tips: 'BGP (Border Gateway Protocol) is the path-vector routing protocol that runs the global Internet between Autonomous Systems (AS).',
          read_minutes: 9,
          terms: ['OSPF Area 0', 'BGP Autonomous System (AS)', 'Administrative Distance', 'Link-State Advertisements'],
          body: 'Routing protocols dynamically discover network paths and build routing tables. OSPF uses link-state advertisements (LSAs) and Dijkstra’s algorithm to calculate the shortest path within an Area. BGP connects independent Autonomous Systems (AS) across the Internet using path attributes and AS-Path prepend policies.'
        },
        {
          code: '2.1.2',
          name: 'Layer 2 Switching: MAC Address Tables, Broadcast Domains & Collision Domains',
          objectives: 'Explain how switches learn MAC addresses, forward unicast frames, and isolate collision domains.',
          tips: 'Each switch port is its own collision domain, but all ports in the same VLAN share a single broadcast domain.',
          read_minutes: 8,
          terms: ['MAC Address Table (CAM)', 'Broadcast Domain', 'Collision Domain', 'Frame Flooding'],
          body: 'Ethernet switches forward traffic at Layer 2 based on destination MAC addresses stored in the Content Addressable Memory (CAM) table. Unknown destination MACs and broadcast frames (FF:FF:FF:FF:FF:FF) are flooded out all ports except the receiving port.'
        }
      ]
    },
    {
      topic_code: 'T2.2',
      subtopics: [
        {
          code: '2.2.1',
          name: 'VLANs, 802.1Q Trunking, Native VLANs and Inter-VLAN Routing',
          objectives: 'Configure Virtual LANs (VLANs), IEEE 802.1Q encapsulation tags, and Router-on-a-Stick inter-VLAN routing.',
          tips: 'IEEE 802.1Q inserts a 4-byte tag into the Ethernet frame header containing a 12-bit VLAN ID (1–4094).',
          read_minutes: 9,
          terms: ['IEEE 802.1Q Tagging', 'Trunk Port vs Access Port', 'Native VLAN', 'Router-on-a-Stick'],
          body: 'Virtual LANs (VLANs) segment a physical switch into multiple logical broadcast domains. Trunk links transport traffic for multiple VLANs between switches by appending an 802.1Q tag. The Native VLAN carries untagged legacy traffic. Inter-VLAN routing is accomplished via Layer 3 switches or Router-on-a-Stick configurations.'
        },
        {
          code: '2.2.2',
          name: 'Spanning Tree Protocol (STP / RSTP 802.1w) & Loop Prevention',
          objectives: 'Prevent Layer 2 switching loops, elect root bridges, and understand Rapid Spanning Tree (RSTP) port roles.',
          tips: 'Without Spanning Tree, Layer 2 broadcast storms will completely crash an Ethernet network within seconds.',
          read_minutes: 9,
          terms: ['RSTP (802.1w)', 'Root Bridge Election', 'BPDU Guard', 'PortFast'],
          body: 'Redundant switch links create Layer 2 loops that cause broadcast storms and MAC table instability. Spanning Tree Protocol (STP 802.1D) and Rapid STP (RSTP 802.1w) elect a Root Bridge and block redundant links, converging in milliseconds when active links fail.'
        }
      ]
    },
    {
      topic_code: 'T2.3',
      subtopics: [
        {
          code: '2.3.1',
          name: 'Enterprise Wireless Architecture: Lightweight APs, WLC & CAPWAP Tunnels',
          objectives: 'Deploy Wireless LAN Controllers (WLC), centralized vs distributed switching, and CAPWAP tunnel management.',
          tips: 'Lightweight Access Points (LWAPs) offload authentication and roaming decisions to a centralized Wireless LAN Controller (WLC).',
          read_minutes: 9,
          terms: ['Wireless LAN Controller (WLC)', 'Lightweight AP (LWAP)', 'CAPWAP Tunnel', 'Seamless Roaming'],
          body: 'Enterprise wireless networks use Lightweight Access Points (LWAPs) managed by a centralized Wireless LAN Controller (WLC) via encrypted CAPWAP tunnels. The WLC centralizes RF channel assignments, power levels, firmware updates, and 802.11k/r/v seamless client roaming.'
        },
        {
          code: '2.3.2',
          name: 'Wireless Antenna Types: Omnidirectional, Directional (Yagi, Patch), and Beamforming',
          objectives: 'Select wireless antenna patterns, calculate dBi gain, and configure MU-MIMO beamforming arrays.',
          tips: 'Use omnidirectional antennas for 360-degree indoor office coverage. Use directional Yagi or patch antennas for point-to-point outdoor building links.',
          read_minutes: 8,
          terms: ['Omnidirectional Antenna', 'Yagi Directional Antenna', 'Patch Antenna', 'Explicit Beamforming'],
          body: 'Antennas shape the radio frequency radiation pattern. Omnidirectional antennas radiate power equally in a 360-degree donut pattern suitable for central ceiling mounts. Directional antennas (Yagi, parabolic, patch) focus RF energy in a narrow beam for long-distance point-to-point bridging. Beamforming directs RF signals toward active client devices.'
        }
      ]
    },
    // D3: Network Operations
    {
      topic_code: 'T3.1',
      subtopics: [
        {
          code: '3.1.1',
          name: 'Network Monitoring: SNMP (v1, v2c, v3), MIBs, OIDs & Syslog Facilities',
          objectives: 'Configure SNMPv3 authentication and privacy encryption, query Management Information Bases (MIBs), and aggregate Syslog.',
          tips: 'SNMPv3 is the only version that provides confidentiality (AES encryption) and authentication (SHA/MD5). v1 and v2c send community strings in cleartext!',
          read_minutes: 9,
          terms: ['SNMPv3 AuthPriv', 'MIB / OID', 'Syslog Port 514', 'SNMP Traps'],
          body: 'Network monitoring relies on telemetry protocols. SNMPv3 secures device polling and asynchronous trap notifications using cryptographic authentication and encryption. Syslog collects system event messages (Severity 0 Emergency to 7 Debug) across port 514 into centralized SIEM platforms.'
        },
        {
          code: '3.1.2',
          name: 'Flow Telemetry: NetFlow, sFlow, IPFIX, and Network Baselines',
          objectives: 'Analyze flow telemetry to identify top bandwidth talkers, protocol distribution, and abnormal baseline deviations.',
          tips: 'NetFlow provides session metadata (Source IP, Dest IP, Port, Bytes) without capturing the entire payload, enabling high-speed traffic analysis.',
          read_minutes: 8,
          terms: ['NetFlow / IPFIX', 'sFlow Packet Sampling', 'Traffic Baselines', 'Top Talkers Analysis'],
          body: 'Flow telemetry captures transactional metadata about network conversations. NetFlow and IPFIX record connection 5-tuples (Source IP, Destination IP, Source Port, Destination Port, Protocol) along with byte counters to identify bandwidth hogs and lateral attack movement.'
        }
      ]
    },
    {
      topic_code: 'T3.2',
      subtopics: [
        {
          code: '3.2.1',
          name: 'High Availability & First Hop Redundancy Protocols (HSRP, VRRP, GLBP)',
          objectives: 'Configure default gateway redundancy using Cisco HSRP, open standard VRRP, and load-balancing GLBP.',
          tips: 'VRRP and HSRP assign a Virtual IP (VIP) shared between active and standby routers, ensuring uninterrupted outbound routing if the primary router fails.',
          read_minutes: 9,
          terms: ['Virtual Router Redundancy (VRRP)', 'HSRP Active/Standby', 'Virtual IP (VIP)', 'GLBP Load Balancing'],
          body: 'First Hop Redundancy Protocols (FHRP) provide high availability for client default gateways. HSRP and VRRP designate an active router forwarding packets and a standby router monitoring heartbeats. If the active fails, the standby assumes the virtual IP and MAC address seamlessly.'
        },
        {
          code: '3.2.2',
          name: 'Disaster Recovery: Cold, Warm, and Hot Sites, RTO, and RPO',
          objectives: 'Calculate Recovery Time Objective (RTO) and Recovery Point Objective (RPO) and evaluate failover site configurations.',
          tips: 'A Hot Site is a fully mirrored, operational facility capable of taking over traffic within minutes/seconds. A Cold Site has power and space but zero pre-installed hardware.',
          read_minutes: 8,
          terms: ['RTO vs RPO', 'Hot Site Failover', 'Warm Site', 'Cold Site'],
          body: 'Disaster recovery planning defines business continuity metrics. RTO specifies maximum allowable downtime before service restoration. RPO defines maximum acceptable data loss measured in time. Hot sites offer immediate automated failover, while cold sites require hardware procurement and provisioning.'
        }
      ]
    },
    {
      topic_code: 'T3.3',
      subtopics: [
        {
          code: '3.3.1',
          name: 'IP Address Management (IPAM), CMDB & Network Documentation',
          objectives: 'Maintain physical and logical network diagrams, IPAM pools, rack elevation diagrams, and baseline documentation.',
          tips: 'Always document physical cable run labels at both ends and update IPAM whenever assigning static IP reservations.',
          read_minutes: 7,
          terms: ['IPAM Software', 'Rack Elevation Diagram', 'Logical vs Physical Topology', 'Asset Labeling'],
          body: 'Comprehensive network documentation ensures operational maintainability. IPAM software prevents IP address conflicts across DHCP and static allocations. Physical diagrams detail rack units, patch panel ports, and cable run numbers, while logical diagrams map VLANs, subnets, and routing boundaries.'
        },
        {
          code: '3.3.2',
          name: 'Network Service Level Agreements (SLAs), MTBF, and MTTR Metrics',
          objectives: 'Calculate Mean Time Between Failures (MTBF), Mean Time to Repair (MTTR), and uptime percentage (99.999% "five nines").',
          tips: 'Five nines (99.999%) availability permits less than 5.26 minutes of total downtime per year.',
          read_minutes: 7,
          terms: ['99.999% Five Nines', 'MTBF (Reliability)', 'MTTR (Recovery Time)', 'SLA Penalty Clauses'],
          body: 'Service Level Agreements define guaranteed network availability, latency, and packet loss metrics. MTBF measures the average operating duration between hardware failures. MTTR measures how quickly technicians can diagnose, replace, and restore a failed network component.'
        }
      ]
    },
    // D4: Network Security
    {
      topic_code: 'T4.1',
      subtopics: [
        {
          code: '4.1.1',
          name: 'Network Attacks: DoS/DDoS, SYN Floods, Amplification, MITM & ARP Poisoning',
          objectives: 'Recognize Layer 2 and Layer 3/4 attacks: ARP spoofing, DNS amplification, reflection DDoS, and TCP SYN flood vectors.',
          tips: 'Dynamic ARP Inspection (DAI) relies on DHCP snooping to validate ARP packets, stopping ARP spoofing/poisoning on switch ports.',
          read_minutes: 9,
          terms: ['ARP Poisoning', 'SYN Flood Attack', 'DNS Amplification DDoS', 'Dynamic ARP Inspection (DAI)'],
          body: 'Attackers target network protocols using volumetric and stealth techniques. ARP poisoning injects forged MAC-to-IP mappings to hijack traffic (Man-in-the-Middle). Distributed Denial of Service (DDoS) uses botnets and reflection/amplification (via open NTP/DNS servers) to saturate upstream bandwidth.'
        },
        {
          code: '4.1.2',
          name: 'Vulnerability Exploits: Rogue DHCP, VLAN Hopping, Evil Twin & Deauth Attacks',
          objectives: 'Mitigate rogue DHCP servers with DHCP Snooping, prevent switch spoofing VLAN hopping, and secure Wi-Fi from deauth frames.',
          tips: 'DHCP Snooping marks switch ports as Trusted (uplinks to legitimate DHCP) or Untrusted (user access ports), dropping unauthorized DHCP offers.',
          read_minutes: 8,
          terms: ['DHCP Snooping', 'VLAN Hopping / Double Tagging', 'Evil Twin AP', '802.11w Protected Frames'],
          body: 'Layer 2 exploits take advantage of default switch behaviors. Rogue DHCP servers assign malicious DNS and gateway settings to clients. VLAN double-tagging allows packets to leap across VLANs. Evil twin APs clone legitimate SSIDs to steal credentials, while 802.11w protected management frames mitigate deauthentication attacks.'
        }
      ]
    },
    {
      topic_code: 'T4.2',
      subtopics: [
        {
          code: '4.2.1',
          name: 'Zero Trust Network Access (ZTNA) & 802.1X Port-Based Authentication',
          objectives: 'Implement IEEE 802.1X port authentication (Supplicant, Authenticator, RADIUS/TACACS+), EAP types, and ZTNA policies.',
          tips: '802.1X requires three entities: Supplicant (client device), Authenticator (switch/AP), and Authentication Server (RADIUS/ISE).',
          read_minutes: 9,
          terms: ['802.1X EAP-TLS', 'RADIUS vs TACACS+', 'ZTNA Least Privilege', 'Supplicant / Authenticator'],
          body: 'Zero Trust Network Access enforces continuous verification and least privilege. IEEE 802.1X port security prevents unauthorized devices from transmitting traffic until authenticated against a RADIUS server. EAP-TLS provides mutual certificate-based authentication.'
        },
        {
          code: '4.2.2',
          name: 'Virtual Private Networks (VPNs): IPsec (IKEv2, AH, ESP) vs SSL/TLS VPNs',
          objectives: 'Configure site-to-site IPsec tunnels, remote access SSL VPNs, Encapsulating Security Payload (ESP), and split tunneling.',
          tips: 'IPsec ESP provides both confidentiality (encryption) and integrity/authentication. IPsec AH provides integrity only (NO encryption).',
          read_minutes: 9,
          terms: ['IPsec ESP vs AH', 'IKEv2 Phase 1 & 2', 'SSL/TLS VPN (Port 443)', 'Split Tunneling vs Full Tunneling'],
          body: 'Virtual Private Networks extend secure private network connectivity across the Internet. IPsec operates at Layer 3 using IKEv2 for key exchange and ESP for symmetric payload encryption (AES-256). SSL/TLS VPNs operate over TCP port 443, making them easy to traverse corporate firewalls for remote workers.'
        }
      ]
    },
    {
      topic_code: 'T4.3',
      subtopics: [
        {
          code: '4.3.1',
          name: 'Next-Generation Firewalls (NGFW), Stateful Inspection & DMZ Architecture',
          objectives: 'Configure stateful packet filtering, Layer 7 Application Control, deep packet inspection (DPI), and De-Militarized Zones (DMZs).',
          tips: 'A DMZ is a semi-trusted subnet isolated between external untrusted Internet firewalls and internal corporate networks.',
          read_minutes: 9,
          terms: ['Next-Gen Firewall (NGFW)', 'Stateful Packet Inspection', 'DMZ Subnet', 'Layer 7 Deep Packet Inspection'],
          body: 'Next-Generation Firewalls (NGFW) inspect traffic up to Layer 7, detecting specific applications regardless of the port number used. Stateful firewalls maintain connection tables tracking TCP state flags (SYN, ESTABLISHED). DMZ segments isolate public-facing web servers from sensitive internal databases.'
        },
        {
          code: '4.3.2',
          name: 'Intrusion Detection/Prevention Systems (IDS/IPS) & Micro-segmentation',
          objectives: 'Differentiate out-of-band IDS detection from inline IPS prevention, signature-based vs anomaly-based detection.',
          tips: 'An IPS is placed INLINE with network traffic to actively block malicious packets. An IDS receives SPAN/TAP mirror traffic passively to alert.',
          read_minutes: 8,
          terms: ['Inline IPS vs Out-of-Band IDS', 'Signature vs Heuristic Anomaly', 'SPAN / Mirror Port', 'East-West Micro-segmentation'],
          body: 'Intrusion Detection Systems (IDS) passively monitor traffic via port mirroring (SPAN), generating alerts on detected anomalies. Intrusion Prevention Systems (IPS) sit directly inline to actively drop offending packets. Micro-segmentation enforces granular security policies between internal workloads to stop lateral movement.'
        }
      ]
    },
    // D5: Network Troubleshooting
    {
      topic_code: 'T5.1',
      subtopics: [
        {
          code: '5.1.1',
          name: 'Structured Network Troubleshooting Methodology & Layered Isolation',
          objectives: 'Apply top-down, bottom-up, divide-and-conquer, and follow-the-path troubleshooting models.',
          tips: 'In divide-and-conquer, you start testing at Layer 3/4 (e.g., ping/traceroute) to immediately cut the OSI search space in half.',
          read_minutes: 8,
          terms: ['Top-Down vs Bottom-Up', 'Divide-and-Conquer', 'Follow-the-Path', 'Action Plan Implementation'],
          body: 'Structured troubleshooting systematically narrows down root causes. The bottom-up approach starts at physical cabling (Layer 1). The top-down approach begins at user application interfaces (Layer 7). The divide-and-conquer approach starts at Layer 3 using ping/traceroute to determine whether the issue is physical/data link or transport/application.'
        },
        {
          code: '5.1.2',
          name: 'Troubleshooting Common Link Faults: Speed/Duplex Mismatches & Transceiver Errors',
          objectives: 'Resolve interface flapping, late collisions, CRC errors, and SFP/SFP+ optical power loss.',
          tips: 'Late collisions and high CRC error counts on an Ethernet interface are classic indicators of a duplex mismatch (one side Half, other Full).',
          read_minutes: 8,
          terms: ['Duplex Mismatch', 'Late Collisions', 'CRC Alignment Errors', 'Interface Flapping'],
          body: 'Physical and data link misconfigurations cause severe network degradation. Duplex mismatches occur when autonegotiation fails and one device operates in Full Duplex while the other operates in Half Duplex, causing collisions under load. High CRC error counts indicate bad cabling or electrical noise.'
        }
      ]
    },
    {
      topic_code: 'T5.2',
      subtopics: [
        {
          code: '5.2.1',
          name: 'Hardware Testing Tools: Cable Certifier, Time-Domain Reflectometer (TDR/OTDR)',
          objectives: 'Locate cable breaks, impedance mismatches, and optical attenuation using TDR and Optical Time-Domain Reflectometers (OTDR).',
          tips: 'An OTDR injects light pulses down a fiber cable to precisely identify breaks, bends, and dirty splice locations in meters/feet.',
          read_minutes: 8,
          terms: ['OTDR (Optical TDR)', 'TDR (Copper)', 'Cable Certifier', 'Optical Power Meter'],
          body: 'Hardware diagnostic tools verify physical link integrity. Time-Domain Reflectometers (TDRs) send electrical pulses down copper pairs to calculate exact distance to a break or short based on reflection velocity. OTDRs perform the same analysis for fiber optics, pinpointing dirty splices and fiber fractures.'
        },
        {
          code: '5.2.2',
          name: 'Physical Tools: Tone Generator/Probe, Loopback Plugs, and Multimeters',
          objectives: 'Trace unlabeled cables through patch panels and ceilings using a toner probe (fox and hound) and verify NIC loopbacks.',
          tips: 'A loopback plug routes transmit pins directly to receive pins on an RJ-45 or fiber port to test the physical NIC transceiver.',
          read_minutes: 7,
          terms: ['Tone Generator and Probe', 'RJ-45 Loopback Plug', 'Continuity Tester', 'Multimeter Voltage Check'],
          body: 'Physical tools assist technicians during cable tracing and installation. Tone generators inject an audio tone onto a copper wire pair, which an inductive probe detects audibly near patch panels. Loopback plugs test physical port hardware by verifying that transmitted frames are received locally.'
        }
      ]
    },
    {
      topic_code: 'T5.3',
      subtopics: [
        {
          code: '5.3.1',
          name: 'Command-Line Diagnostic Tools: ping, traceroute/tracert, nslookup/dig, pathping',
          objectives: 'Execute ICMP diagnostics, identify routing path hops, and debug DNS records with dig and nslookup.',
          tips: 'tracert/traceroute uses incrementing TTL (Time-To-Live) values in IP packet headers to discover intermediate router hops.',
          read_minutes: 8,
          terms: ['tracert TTL Exceeded', 'dig / nslookup', 'pathping / mtr', 'arp -a & netstat -an'],
          body: 'Command-line utilities provide fast Layer 3/4 diagnostics. ping verifies end-to-end IP reachability and round-trip latency. traceroute increments the IP TTL field, eliciting ICMP Time Exceeded messages from each router along the path. dig queries specific DNS record types (A, AAAA, MX, TXT, CNAME).'
        },
        {
          code: '5.3.2',
          name: 'Packet Analysis & Sniffing: Wireshark, tcpdump, Protocol Filters & TCP Flags',
          objectives: 'Capture live traffic, filter by IP/port/protocol, inspect TCP retransmissions, and analyze TLS handshakes.',
          tips: 'In Wireshark, filter tcp.flags.reset == 1 to quickly find connections forcibly terminated by firewalls or target servers.',
          read_minutes: 9,
          terms: ['Wireshark Display Filter', 'tcpdump CLI Capture', 'TCP RST / Retransmission', 'Promiscuous Mode'],
          body: 'Protocol analyzers capture and dissect raw packets traversing a network interface. Wireshark provides graphical packet inspection with deep protocol decoding. tcpdump captures packets in headless Linux environments. Analyzing TCP window scaling, retransmissions, and RST packets reveals underlying MTU, latency, and firewall drops.'
        }
      ]
    }
  ],

  // ==========================================
  // GIAC GSLC SUBTOPICS (24 SUBTOPICS)
  // ==========================================
  'GSLC': [
    // D1: Security Governance
    {
      topic_code: 'T1.1',
      subtopics: [
        {
          code: '1.1.1',
          name: 'Strategic Security Alignment & The Executive CISO Mandate',
          objectives: 'Align enterprise cybersecurity strategies with business goals, revenue drivers, and risk appetites.',
          tips: 'Security is a business enabler. The CISO must translate technical cyber risks into financial and operational impact terms.',
          read_minutes: 9,
          terms: ['CISO Mandate', 'Business Strategic Alignment', 'Risk Appetite Statement', 'Security Program Charter'],
          body: 'Modern security leaders must bridge the gap between technical defense and business strategy. The Chief Information Security Officer (CISO) establishes the security vision, charters the security governance committee, and ensures that cybersecurity investments directly protect key enterprise revenue streams and customer trust.'
        },
        {
          code: '1.1.2',
          name: 'Security Organizational Structure, Roles, and Separation of Duties',
          objectives: 'Design reporting structures (CISO reporting to CEO/Board vs CIO), define security roles, and enforce separation of duties.',
          tips: 'To maintain independence and avoid conflict of interest, the CISO should ideally report to the CEO, General Counsel, or Board Risk Committee rather than the CIO.',
          read_minutes: 8,
          terms: ['CISO Reporting Lines', 'Separation of Duties (SoD)', 'Dual Custody', 'Security Steering Committee'],
          body: 'Governance requires clear separation of operational IT responsibilities from independent security oversight. Placing the CISO under the CIO creates inherent conflicts between uptime/speed and stringent security controls. Establishing cross-functional Security Steering Committees ensures broad executive alignment.'
        }
      ]
    },
    {
      topic_code: 'T1.2',
      subtopics: [
        {
          code: '1.2.1',
          name: 'Policy Hierarchy: Policies, Standards, Baselines, Guidelines & Procedures',
          objectives: 'Structure the 5-tier documentation hierarchy from high-level mandatory policies down to step-by-step procedures.',
          tips: 'Policies are high-level mandatory executive statements. Guidelines are discretionary recommendations. Procedures are mandatory step-by-step instructions.',
          read_minutes: 9,
          terms: ['Policy (Mandatory High-Level)', 'Standard (Mandatory Metric)', 'Guideline (Discretionary)', 'Procedure (Step-by-Step)'],
          body: 'Security documentation follows a formal hierarchy: 1. Policies are high-level, business-aligned executive mandates approved by leadership. 2. Standards define specific mandatory hardware, software, or configuration baselines. 3. Baselines establish minimum security floors. 4. Guidelines offer discretionary best-practice advice. 5. Procedures provide step-by-step operational instructions.'
        },
        {
          code: '1.2.2',
          name: 'Compliance Frameworks: NIST CSF, ISO/IEC 27001, CIS Controls & Regulatory Mandates',
          objectives: 'Select and map enterprise security controls across NIST CSF 2.0, ISO 27001:2022 ISMS, SOC 2, HIPAA, and GDPR.',
          tips: 'ISO 27001 is an internationally certifiable ISMS framework. NIST CSF is an outcome-driven framework organized by Functions: Govern, Identify, Protect, Detect, Respond, Recover.',
          read_minutes: 9,
          terms: ['NIST CSF 2.0', 'ISO/IEC 27001 ISMS', 'CIS Top 18 Controls', 'Regulatory Compliance (GDPR/HIPAA)'],
          body: 'Security programs adopt standardized frameworks to structure controls and prove regulatory compliance. ISO/IEC 27001 defines requirements for an Information Security Management System (ISMS). The NIST Cybersecurity Framework (CSF 2.0) organizes controls into 6 core functions, while the CIS Controls provide prioritized technical implementations.'
        }
      ]
    },
    {
      topic_code: 'T1.3',
      subtopics: [
        {
          code: '1.3.1',
          name: 'Security Metrics, KPIs, KRIs & Board-Level Risk Reporting',
          objectives: 'Develop Key Performance Indicators (KPIs) and Key Risk Indicators (KRIs) that communicate cyber risk to the Board of Directors.',
          tips: 'KRIs are forward-looking metrics indicating increasing risk exposure. KPIs are historical metrics measuring process efficiency.',
          read_minutes: 8,
          terms: ['Key Risk Indicators (KRIs)', 'Key Performance Indicators (KPIs)', 'Board Cyber Dashboard', 'Mean Time to Detect (MTTD)'],
          body: 'Effective communication with the Board of Directors avoids technical jargon, focusing on financial impact, regulatory exposure, and operational readiness. Key Risk Indicators (e.g., number of unpatched critical vulnerabilities older than 30 days) provide early warning signals before incidents manifest.'
        },
        {
          code: '1.3.2',
          name: 'Security Budgeting, CapEx vs OpEx, and Cyber Insurance Portfolio Management',
          objectives: 'Justify security investments using Return on Security Investment (ROSI), manage CapEx/OpEx, and evaluate cyber insurance policies.',
          tips: 'Cyber insurance is a risk transfer mechanism; it does NOT eliminate legal liability or reputational brand damage.',
          read_minutes: 8,
          terms: ['ROSI (Return on Security Investment)', 'CapEx vs OpEx in Cloud', 'Cyber Insurance Underwriting', 'Risk Transfer Strategy'],
          body: 'Security leadership requires financial acumen. As infrastructure shifts to cloud SaaS/IaaS, security expenditures transition from Capital Expenditures (CapEx) to Operational Expenditures (OpEx). Cyber insurance policies transfer residual financial exposure but require strict adherence to multi-factor authentication and patch baselines.'
        }
      ]
    },
    // D2: Defensive Architecture
    {
      topic_code: 'T2.1',
      subtopics: [
        {
          code: '2.1.1',
          name: 'Enterprise Cryptography: Symmetric vs Asymmetric Algorithms, Hashing & Key Life',
          objectives: 'Select encryption algorithms (AES-256, RSA, ECC), secure key lifecycle management, and post-quantum cryptographic roadmaps.',
          tips: 'Elliptic Curve Cryptography (ECC) provides equivalent cryptographic strength to RSA with significantly smaller key sizes and lower compute overhead.',
          read_minutes: 9,
          terms: ['AES-256 GCM', 'Elliptic Curve Cryptography (ECC)', 'Hardware Security Module (HSM)', 'Key Lifecycle Management'],
          body: 'Cryptography underpins data confidentiality, integrity, and non-repudiation. Symmetric ciphers (AES-256) encrypt bulk data at rest and in transit. Asymmetric ciphers (RSA, ECC) handle key exchange and digital signatures. Hardware Security Modules (HSMs) store and safeguard root private keys.'
        },
        {
          code: '2.1.2',
          name: 'Public Key Infrastructure (PKI): Root CAs, Intermediate CAs, CRLs & OCSP Stapling',
          objectives: 'Architect two-tier PKI hierarchies, manage certificate revocation lists (CRLs), and implement Online Certificate Status Protocol (OCSP).',
          tips: 'Keep Root Certificate Authorities (CAs) completely offline and powered off in a secure vault, issuing certificates only to Intermediate CAs.',
          read_minutes: 9,
          terms: ['Offline Root CA', 'Intermediate CA', 'OCSP Stapling', 'Certificate Revocation List (CRL)'],
          body: 'Public Key Infrastructure manages the creation, distribution, and revocation of digital certificates. A resilient enterprise PKI uses an offline Root CA that delegates operational signing authority to subordinate Intermediate CAs. OCSP stapling improves TLS performance by having web servers cache signed revocation statuses.'
        }
      ]
    },
    {
      topic_code: 'T2.2',
      subtopics: [
        {
          code: '2.2.1',
          name: 'Defense-in-Depth & Zero Trust Architecture (NIST SP 800-207)',
          objectives: 'Implement multi-layered defense-in-depth controls across endpoint, network, application, and data layers using Zero Trust principles.',
          tips: 'Zero Trust Core Principle: "Never Trust, Always Verify." Explicitly verify identity, enforce least privilege, and assume breach.',
          read_minutes: 9,
          terms: ['NIST SP 800-207 Zero Trust', 'Defense-in-Depth', 'Policy Decision Point (PDP)', 'Policy Enforcement Point (PEP)'],
          body: 'Defense-in-depth layers physical, administrative, and technical controls so that the failure of any single defense does not compromise the enterprise. NIST SP 800-207 Zero Trust Architecture replaces static perimeter firewalls with dynamic, context-aware policy enforcement points (PEP) evaluating user identity, device posture, and data sensitivity.'
        },
        {
          code: '2.2.2',
          name: 'Network Segmentation, Micro-segmentation & Secure Access Service Edge (SASE)',
          objectives: 'Deploy Software-Defined WAN (SD-WAN), Cloud-delivered security (SASE), and micro-segmentation for hybrid enterprise networks.',
          tips: 'SASE (Secure Access Service Edge) converges SD-WAN networking capabilities with cloud-delivered security services (CASB, FWaaS, ZTNA, SWG).',
          read_minutes: 9,
          terms: ['SASE Framework', 'Cloud Access Security Broker (CASB)', 'Firewall as a Service (FWaaS)', 'Micro-segmentation'],
          body: 'As workforce mobility increases, traditional castle-and-moat network perimeters become obsolete. SASE integrates cloud-delivered security services (Secure Web Gateway, CASB, Zero Trust Network Access) directly with SD-WAN to enforce consistent security policies regardless of user location.'
        }
      ]
    },
    {
      topic_code: 'T2.3',
      subtopics: [
        {
          code: '2.3.1',
          name: 'Cloud Security Posture Management (CSPM) & Cloud Workload Protection (CWPP)',
          objectives: 'Automate cloud security configuration auditing, detect misconfigurations (open S3 buckets), and protect containerized workloads.',
          tips: 'CSPM identifies cloud misconfigurations and compliance drift across multi-cloud APIs. CWPP secures running containers, Kubernetes pods, and VMs.',
          read_minutes: 8,
          terms: ['CSPM (Posture Management)', 'CWPP (Workload Protection)', 'CIEM (Identity Entitlements)', 'Immutable Infrastructure'],
          body: 'Cloud environments require continuous automated governance. Cloud Security Posture Management (CSPM) continuously scans cloud APIs to detect configuration drift and exposed resources. Cloud Workload Protection Platforms (CWPP) provide runtime threat detection, vulnerability scanning, and behavioral monitoring for containerized microservices.'
        },
        {
          code: '2.3.2',
          name: 'SaaS Security Governance, Data Loss Prevention (DLP) & CASB Integration',
          objectives: 'Govern enterprise SaaS applications (M365, Salesforce, Google Workspace), discover Shadow IT, and enforce DLP policies.',
          tips: 'Cloud Access Security Brokers (CASBs) operate in API mode (out-of-band policy scanning) or Proxy mode (inline real-time data blocking).',
          read_minutes: 8,
          terms: ['CASB (API vs Proxy)', 'Shadow IT Discovery', 'Data Loss Prevention (DLP)', 'SaaS Security Posture (SSPM)'],
          body: 'Uncontrolled SaaS adoption leads to Shadow IT and unauthorized data exfiltration. Cloud Access Security Brokers (CASBs) enforce enterprise DLP policies, scan for sensitive data stored in cloud repositories, and restrict unauthorized file sharing based on device compliance.'
        }
      ]
    },
    // D3: Incident Response & Threat Management
    {
      topic_code: 'T3.1',
      subtopics: [
        {
          code: '3.1.1',
          name: 'Incident Response Lifecycle: Preparation, Detection, Containment, Eradication, Recovery',
          objectives: 'Lead incident response teams across NIST SP 800-61 / ISO 27035 incident phases and establish communication playbooks.',
          tips: 'During containment, isolate compromised systems from the network immediately before taking destructive eradication steps to preserve forensics.',
          read_minutes: 9,
          terms: ['NIST SP 800-61 Phases', 'CSIRT Operations', 'Short-Term vs Long-Term Containment', 'Lessons Learned Meeting'],
          body: 'The Incident Response Lifecycle provides a structured response to cyber events: Preparation (tooling, policies, training), Detection & Analysis (alert triage), Containment (limiting blast radius), Eradication (removing malware/backdoors), Recovery (restoring verified clean systems), and Post-Incident Activity (Lessons Learned).'
        },
        {
          code: '3.1.2',
          name: 'Crisis Management, Legal Disclosures & Executive Communications',
          objectives: 'Coordinate with Legal, PR, Law Enforcement, and Regulatory bodies during major data breaches within mandatory timelines (SEC 4-day, GDPR 72-hr).',
          tips: 'GDPR Article 33 requires notifying supervisory authorities within 72 hours of becoming aware of a personal data breach.',
          read_minutes: 8,
          terms: ['SEC 4-Day Disclosure', 'GDPR 72-Hour Breach Notification', 'Crisis PR Playbook', 'Attorney-Client Privilege'],
          body: 'High-severity security incidents require coordinated executive crisis management. The CISO works alongside General Counsel to protect investigative findings under Attorney-Client Privilege while meeting strict statutory breach notification deadlines.'
        }
      ]
    },
    {
      topic_code: 'T3.2',
      subtopics: [
        {
          code: '3.2.1',
          name: 'Cyber Threat Intelligence (CTI): Strategic, Tactical, Operational & MITRE ATT&CK',
          objectives: 'Leverage the MITRE ATT&CK framework, Cyber Kill Chain, STIX/TAXII feeds, and David Bianco’s Pyramid of Pain.',
          tips: 'In the Pyramid of Pain, Hash Values are Trivial for attackers to change, while TTPs (Tactics, Techniques, and Procedures) are Tough to change.',
          read_minutes: 9,
          terms: ['MITRE ATT&CK Framework', 'Pyramid of Pain', 'STIX / TAXII', 'Cyber Kill Chain'],
          body: 'Cyber Threat Intelligence (CTI) translates adversary activity into actionable defensive insights. MITRE ATT&CK catalogs known adversary Tactics, Techniques, and Procedures (TTPs). David Bianco’s Pyramid of Pain demonstrates that disrupting adversary TTPs imposes the highest operational cost on attackers.'
        },
        {
          code: '3.2.2',
          name: 'Threat Hunting & Adversary Emulation',
          objectives: 'Conduct hypothesis-driven threat hunting across endpoint telemetry and validate defenses with automated adversary emulation.',
          tips: 'Threat hunting assumes the perimeter has already been breached and actively searches for undetected adversary presence.',
          read_minutes: 8,
          terms: ['Hypothesis-Driven Hunting', 'Adversary Emulation', 'Atomic Red Team', 'Purple Team Exercises'],
          body: 'Threat hunting proactively searches network and endpoint telemetry for advanced persistent threats (APTs) that bypassed automated security alerts. Purple Team exercises unite Red Team offensive operators and Blue Team defenders to evaluate and optimize detection rules.'
        }
      ]
    },
    {
      topic_code: 'T3.3',
      subtopics: [
        {
          code: '3.3.1',
          name: 'Vulnerability Management Lifecycle: Discovery, Prioritization, Remediation & SLA',
          objectives: 'Score vulnerabilities using CVSS v3/v4, prioritize using EPSS and CISA KEV catalogs, and enforce patch remediation SLAs.',
          tips: 'Prioritize patching vulnerabilities listed on CISA’s Known Exploited Vulnerabilities (KEV) catalog over theoretical high-CVSS scores without active exploits.',
          read_minutes: 8,
          terms: ['CVSS v3/v4 Base Score', 'EPSS (Exploit Prediction)', 'CISA KEV Catalog', 'Vulnerability Remediation SLA'],
          body: 'Enterprise vulnerability management must prioritize actionable risk over raw volume. Combining CVSS severity ratings with the Exploit Prediction Scoring System (EPSS) and CISA Known Exploited Vulnerabilities (KEV) enables security teams to remediate actively weaponized threats first.'
        },
        {
          code: '3.3.2',
          name: 'Penetration Testing, Red Teaming, and Bug Bounty Program Governance',
          objectives: 'Scope penetration tests (Black/White/Gray Box), establish Rules of Engagement (RoE), and govern external responsible disclosure programs.',
          tips: 'The Rules of Engagement (RoE) formally document authorized IP ranges, testing windows, restricted techniques (e.g., no DoS), and escalation emergency contacts.',
          read_minutes: 8,
          terms: ['Rules of Engagement (RoE)', 'Black / Gray / White Box Testing', 'Bug Bounty Policy', 'Vulnerability Disclosure Program (VDP)'],
          body: 'Offensive testing validates technical control effectiveness. Penetration tests follow formal Rules of Engagement (RoE) defining testing scope, off-limit critical infrastructure, and communication channels. Vulnerability Disclosure Programs (VDP) provide a legal and safe harbor for external security researchers.'
        }
      ]
    },
    // D4: Security Operations & Resilience
    {
      topic_code: 'T4.1',
      subtopics: [
        {
          code: '4.1.1',
          name: 'Security Operations Center (SOC) Architecture, SIEM & Telemetry Ingestion',
          objectives: 'Design Tier 1/2/3 SOC workflows, optimize SIEM log ingestion costs, and reduce alert fatigue through correlation rules.',
          tips: 'Tier 1 analysts perform alert triage and initial validation. Tier 2 performs deep investigation and containment. Tier 3 handles forensics and threat hunting.',
          read_minutes: 8,
          terms: ['SOC Tier 1/2/3 Workflows', 'SIEM Correlation Rules', 'Alert Fatigue Reduction', 'Log Ingestion Filtering'],
          body: 'Security Operations Centers (SOCs) continuously monitor enterprise telemetry to detect and contain threats. Modern SOC architectures use SIEM engines to normalize and correlate logs across endpoints, firewalls, and cloud services, leveraging high-fidelity detection rules to minimize false positives.'
        },
        {
          code: '4.1.2',
          name: 'Security Orchestration, Automation, and Response (SOAR) & Automated Playbooks',
          objectives: 'Implement SOAR automated playbooks for phishing triage, endpoint isolation, and IP blacklisting to reduce Mean Time to Respond (MTTR).',
          tips: 'SOAR playbooks automate repetitive containment tasks (e.g., quarantining an infected host or resetting compromised AD passwords) in milliseconds.',
          read_minutes: 8,
          terms: ['SOAR Automated Playbooks', 'Mean Time to Respond (MTTR)', 'API-Driven Automation', 'Phishing Triage Playbook'],
          body: 'Security Orchestration, Automation, and Response (SOAR) integrates diverse security tools via APIs to automate routine incident handling workflows. Automated playbooks execute initial investigation, enrich threat intelligence, and take automated containment actions without human intervention.'
        }
      ]
    },
    {
      topic_code: 'T4.2',
      subtopics: [
        {
          code: '4.2.1',
          name: 'Business Impact Analysis (BIA), Critical Asset Valuation & Dependencies',
          objectives: 'Conduct enterprise Business Impact Analyses (BIA) to quantify financial and operational impacts of system disruptions.',
          tips: 'The Business Impact Analysis (BIA) is the foundational starting point for all Business Continuity (BCP) and Disaster Recovery (DRP) planning.',
          read_minutes: 8,
          terms: ['Business Impact Analysis (BIA)', 'Maximum Tolerable Downtime (MTD)', 'Critical Business Functions (CBF)', 'Interdependency Mapping'],
          body: 'A Business Impact Analysis (BIA) identifies critical business functions (CBFs) and quantifies the operational and financial losses associated with downtime over time. The BIA establishes the Maximum Tolerable Downtime (MTD) and recovery priority hierarchies required for resilience planning.'
        },
        {
          code: '4.2.2',
          name: 'Business Continuity (BCP) and Disaster Recovery (DRP) Testing Exercises',
          objectives: 'Facilitate tabletop exercises, structured walkthroughs, parallel tests, and full interruption DR cutover simulations.',
          tips: 'Tabletop exercises are low-cost, discussion-based walkthroughs. Full interruption tests actively simulate complete datacenter failure by shutting down production.',
          read_minutes: 8,
          terms: ['Tabletop Exercise', 'Parallel Testing', 'Full Interruption Cutover Test', 'BCP/DRP Plan Maintenance'],
          body: 'Disaster recovery plans must be periodically tested to ensure operational readiness. Testing methodologies progress from tabletop simulation exercises to functional parallel testing and full interruption drills that validate emergency failover to alternate sites under simulated disaster conditions.'
        }
      ]
    },
    {
      topic_code: 'T4.3',
      subtopics: [
        {
          code: '4.3.1',
          name: 'Third-Party Risk Management (TPRM) & Vendor Security Due Diligence',
          objectives: 'Evaluate third-party vendor risks using SIG questionnaires, review SOC 2 Type II reports, and enforce right-to-audit contractual clauses.',
          tips: 'A SOC 2 Type II report evaluates the operational effectiveness of controls over a minimum 6-month testing period (unlike Type I which is point-in-time).',
          read_minutes: 9,
          terms: ['SOC 2 Type II Report', 'Third-Party Risk (TPRM)', 'Right-to-Audit Clause', 'Standardized Information Gathering (SIG)'],
          body: 'Third-Party Risk Management (TPRM) protects organizations from supply chain vulnerabilities. Due diligence requires reviewing independent SOC 2 Type II audit reports, ISO 27001 certifications, and enforcing strict contractual security requirements, data ownership guarantees, and breach notification SLAs.'
        },
        {
          code: '4.3.2',
          name: 'Software Supply Chain Security, SBOM (Software Bill of Materials) & Open Source Risk',
          objectives: 'Mandate Software Bills of Materials (SBOMs), scan open-source software dependencies for vulnerabilities, and secure CI/CD pipelines.',
          tips: 'An SBOM (Software Bill of Materials) is an inventory of all open-source libraries, modules, and dependencies included in a software package.',
          read_minutes: 8,
          terms: ['Software Bill of Materials (SBOM)', 'Software Supply Chain Security', 'CI/CD Pipeline Security', 'Open Source Dependency Scanning'],
          body: 'Modern software incorporates extensive third-party open-source components. Mandating Software Bills of Materials (SBOMs) in CycloneDX or SPDX formats enables organizations to rapidly identify affected components when zero-day vulnerabilities (e.g., Log4j) are discovered.'
        }
      ]
    }
  ]
};

async function seedSubtopics() {
  await client.connect();
  console.log('=== SEEDING GRANULAR SUBTOPICS FOR A+, NETWORK+, GSLC ===\n');

  for (const [certCode, topicsData] of Object.entries(SUBTOPIC_DEFINITIONS)) {
    console.log(`\n--- Processing ${certCode} ---`);
    let count = 0;

    for (const tGroup of topicsData) {
      // Find topic in DB
      const topicRes = await client.query(`
        SELECT t.id, t.domain_id, d.domain_number, d.certification_id 
        FROM topics t
        JOIN domains d ON t.domain_id = d.id
        JOIN certifications c ON d.certification_id = c.id
        WHERE c.code = $1 AND t.topic_code = $2
      `, [certCode, tGroup.topic_code]);

      if (topicRes.rows.length === 0) {
        console.log(`[WARN] Could not find topic ${tGroup.topic_code} for ${certCode}`);
        continue;
      }

      const topicId = topicRes.rows[0].id;
      let sortOrder = 1;

      for (const st of tGroup.subtopics) {
        // Upsert subtopic
        await client.query(`
          INSERT INTO subtopics (
            id, topic_id, subtopic_code, name, content_body, key_terms,
            exam_tips, estimated_read_minutes, learning_objectives, sort_order
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            content_body = EXCLUDED.content_body,
            key_terms = EXCLUDED.key_terms,
            exam_tips = EXCLUDED.exam_tips,
            estimated_read_minutes = EXCLUDED.estimated_read_minutes,
            learning_objectives = EXCLUDED.learning_objectives,
            sort_order = EXCLUDED.sort_order;
        `, [
          uuidv4(),
          topicId,
          st.code,
          st.name,
          st.body,
          st.terms,
          st.tips,
          st.read_minutes,
          st.objectives,
          sortOrder++
        ]);
        count++;
      }
    }
    console.log(`[SUCCESS] Seeded ${count} subtopics for ${certCode}`);
  }

  await client.end();
}

seedSubtopics().catch(console.error);
