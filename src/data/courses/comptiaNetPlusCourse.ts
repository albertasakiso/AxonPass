/* ===================================================================
   ANOXPASS — CompTIA Network+ (N10-008 / N10-009) End-to-End Course
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const COMPTIA_NET_PLUS_COURSE: CertificationCourse = {
  certId: 'comptia-network-plus',
  certCode: 'NETWORK+',
  title: 'CompTIA Network+',
  provider: 'CompTIA',
  tier: 1,
  tagline: 'Master enterprise networking, IPv4/IPv6 subnetting, routing, security, and Layer 1–7 diagnostics.',
  estimatedTotalHours: 60,
  passingScore: '720 / 900',
  domains: [
    {
      id: 'net-d1',
      domainNumber: 1,
      title: 'Networking Fundamentals & Subnetting',
      examWeightPercent: 24,
      overview: 'Master OSI encapsulation, IPv4 CIDR subnetting, IPv6 addressing, and cabling standards.',
      lessons: [
        {
          id: 'net-d1-l1',
          title: 'IPv4 CIDR Subnetting & RFC 1918 Private Ranges',
          estimatedMinutes: 45,
          summary: 'Calculate subnets, usable host counts, network IDs, and broadcast addresses rapidly under exam conditions.',
          learningObjectives: [
            'Calculate usable hosts using 2^h − 2 for any /24 to /30 prefix',
            'Identify RFC 1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)',
            'Differentiate Single-Mode Fiber (SMF) vs Multi-Mode Fiber (MMF) and Cat6/Cat6a',
          ],
          coreConcepts: [
            {
              heading: 'Fast CIDR Subnetting Table',
              explanation:
                '/24 = 254 hosts (255.255.255.0), /25 = 126 hosts (.128), /26 = 62 hosts (.192), /27 = 30 hosts (.224), /28 = 14 hosts (.240), /29 = 6 hosts (.248), /30 = 2 hosts (.252 — point-to-point links).',
              formulaOrRule: 'Usable Hosts = 2^(32 − CIDR) − 2 | Block Size = 256 − last octet.',
            },
          ],
          realWorldScenario: {
            title: 'Branch Office Subnet Allocation',
            situation: 'A branch office needs 50 workstations on one subnet with minimal IP waste.',
            analysis: '/27 gives 30 hosts (too small); /26 gives 62 usable hosts (optimal fit).',
            takeaway: 'Always pick the smallest power-of-2 block that fits (needed hosts + 2).',
          },
          examTraps: [
            '172.32.0.1 is PUBLIC—RFC 1918 Class B private range stops at 172.31.255.255.',
            'Single-Mode Fiber (yellow jacket, laser) goes kilometers; Multi-Mode (aqua/orange, LED) is for shorter building runs.',
          ],
          keyTerms: [
            { term: 'CIDR', definition: 'Classless Inter-Domain Routing—variable-length subnet masking.' },
            { term: 'VLAN', definition: 'Virtual LAN—segments broadcast domains at Layer 2.' },
          ],
          conceptChecks: [
            {
              id: 'net-d1-l1-q1',
              question: 'Which CIDR prefix provides the MOST efficient subnet for a point-to-point router link needing 2 usable IPs?',
              options: ['/28', '/29', '/30', '/24'],
              correctIndex: 2,
              rationale: '/30 yields 2^2 − 2 = 2 usable host addresses.',
            },
          ],
          practicalDrill: {
            title: '60-Second Subnetting Sprint',
            prompt: 'Find network ID, broadcast, and usable range for 192.168.10.75/26.',
            steps: ['Block size = 64 -> Subnets: 0, 64, 128, 192.', '75 falls in 64–127 -> Usable: .65 to .126.'],
            successCriteria: 'Solved in under 60 seconds with 100% accuracy.',
          },
          flashcards: [
            { front: 'RFC 1918 Private IPv4 Ranges?', back: '10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), 192.168.0.0/16.', tag: 'NET+-D1' },
          ],
          sourceRefs: ['my_documents/Chapple M. CompTIA Network+ CertMike. Prepare. Practice...Exam N10-008 2023.pdf', 'my_documents/OSI Layers.pdf'],
        },
      ],
    },
    {
      id: 'net-d2',
      domainNumber: 2,
      title: 'Routing, Switching, Security & Troubleshooting',
      examWeightPercent: 76,
      overview: 'Master VLANs, STP, OSPF/BGP, 802.1X, ACLs, and Layer 1–7 CLI diagnostics.',
      lessons: [
        {
          id: 'net-d2-l1',
          title: 'Switching (VLANs/STP), Routing (OSPF/BGP) & CLI Diagnostics',
          estimatedMinutes: 40,
          summary: 'Prevent Layer 2 loops with STP, route dynamically with OSPF/BGP, and isolate faults using traceroute, dig, netstat, and tcpdump.',
          learningObjectives: [
            'Explain 802.1Q VLAN trunking and Spanning Tree Protocol (STP) loop prevention',
            'Compare OSPF (internal link-state) vs BGP (internet path-vector)',
            'Use ping, traceroute, arp, nslookup/dig, and netstat to diagnose outages',
          ],
          coreConcepts: [
            {
              heading: 'Routing Protocols & Switching',
              explanation:
                '802.1Q tags VLAN traffic across trunk links. STP prevents broadcast storms by blocking redundant switch loops. OSPF is an IGP using Dijkstra shortest-path; BGP is the EGP routing the internet between Autonomous Systems.',
              mentalModel: 'OSPF = Inside the enterprise; BGP = Between enterprises/ISPs.',
            },
          ],
          realWorldScenario: {
            title: 'Intermittent Broadcast Storm',
            situation: 'After adding a redundant uplink between two switches, CPU spikes to 100% and the LAN collapses.',
            analysis: 'STP was disabled on the switch ports, creating a Layer 2 switching loop.',
            takeaway: 'Enable RSTP (802.1w) and BPDU Guard on access ports.',
          },
          examTraps: [
            '802.1Q = VLAN tagging; 802.1X = Port-based Network Access Control (NAC) using RADIUS.',
            'Duplex mismatch causes late collisions and sluggish throughput without dropping the link completely.',
          ],
          keyTerms: [
            { term: 'STP (802.1D / 802.1w)', definition: 'Spanning Tree Protocol—prevents Layer 2 loops in redundant switch topologies.' },
            { term: '802.1X', definition: 'Port-based network access control authenticating devices via RADIUS before granting LAN access.' },
          ],
          conceptChecks: [
            {
              id: 'net-d2-l1-q1',
              question: 'Which protocol is used to exchange routing tables between different ISPs across the internet?',
              options: ['OSPF', 'RIP', 'BGP', 'STP'],
              correctIndex: 2,
              rationale: 'BGP (Border Gateway Protocol) is the exterior gateway protocol used between Autonomous Systems.',
            },
          ],
          practicalDrill: {
            title: 'Layer 1–7 Diagnostic Ladder',
            prompt: 'Diagnose why a user can ping 8.8.8.8 but cannot open https://example.com.',
            steps: ['Layer 1–3 OK (IP reachable).', 'Test DNS with `nslookup example.com` -> DNS failure or firewall blocking UDP 53 / TCP 443.'],
            successCriteria: 'Pinpoint DNS or Layer 7/firewall block accurately.',
          },
          flashcards: [
            { front: '802.1Q vs 802.1X?', back: '802.1Q = VLAN trunk tagging. 802.1X = Port-based NAC authentication (RADIUS).', tag: 'NET+-D2' },
          ],
          sourceRefs: ['my_documents/Chapple M. CompTIA Network+ CertMike. Prepare. Practice...Exam N10-008 2023.pdf'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Multi-VLAN Campus Network Design',
    scenario: 'Design a segmented 3-floor office network with Data, Voice, Guest, and Management VLANs, redundant core switches, and dual ISP failover.',
    tasks: [
      'Allocate /26 subnets from 10.20.0.0/22.',
      'Specify 802.1Q trunks, RSTP, and 802.1X NAC.',
      'Define BGP/static failover to secondary ISP.',
    ],
    modelSolution: 'Assign dedicated VLANs + /26 subnets, 802.1Q trunks between access/core with RSTP root bridge on Core-1, 802.1X + RADIUS on access ports, and dual-ISP active/standby failover.',
  },
  examStrategy: {
    examFormat: 'Up to 90 questions (MCQ + PBQs), 90 minutes.',
    timeManagementPlan: 'Write your CIDR subnetting cheat table on the scratchpad during the 5-minute pre-exam NDA screen.',
    mindsetRules: [
      'Troubleshoot bottom-up (Layer 1 -> Layer 7) unless symptoms clearly point to Layer 7 (DNS/TLS).',
      'Distinguish 802.1Q, 802.1X, 802.11ax, and 802.3af/at (PoE) instantly.',
    ],
    finalWeekChecklist: [
      'Solve 20 CIDR subnetting problems in under 15 minutes',
      'Review all CLI tools (ping, tracert, dig, netstat, arp, tcpdump)',
      'Score >= 85% on CertMike practice tests',
    ],
  },
};
