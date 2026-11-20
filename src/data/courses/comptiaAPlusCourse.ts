/* ===================================================================
   ANOXPASS — CompTIA A+ (Core 1 & Core 2) End-to-End Course
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const COMPTIA_A_PLUS_COURSE: CertificationCourse = {
  certId: 'comptia-a-plus',
  certCode: 'A+',
  title: 'CompTIA A+ (Core 1 220-1101 & Core 2 220-1102)',
  provider: 'CompTIA',
  tier: 1,
  tagline: 'Hands-on mastery of hardware, networking, virtualization, OS, and 6-step troubleshooting.',
  estimatedTotalHours: 55,
  passingScore: '675 / 900 (Core 1) | 700 / 900 (Core 2)',
  domains: [
    {
      id: 'aplus-d1',
      domainNumber: 1,
      title: 'Mobile Devices & Hardware Architecture',
      examWeightPercent: 40,
      overview: 'Master laptop/mobile components, RAM, CPUs, motherboards, PSUs, storage (NVMe/RAID), and printers.',
      lessons: [
        {
          id: 'aplus-d1-l1',
          title: 'Storage, RAID Levels & Core PC Components',
          estimatedMinutes: 40,
          summary: 'Select optimal RAID arrays, RAM types, power supplies, and cooling for workstations and servers.',
          learningObjectives: [
            'Compare RAID 0, 1, 5, 6, and 10 for redundancy, speed, and minimum drive count',
            'Differentiate NVMe M.2 vs SATA SSD vs spinning HDD',
            'Diagnose PSU, RAM, and POST beep/LED boot failures',
          ],
          coreConcepts: [
            {
              heading: 'RAID Matrix',
              explanation:
                'RAID 0 (Striping, min 2 drives, fast, ZERO fault tolerance). RAID 1 (Mirroring, min 2 drives, 50% capacity). RAID 5 (Striping + Parity, min 3 drives, survives 1 drive failure). RAID 10 (Stripe of Mirrors, min 4 drives, fast + redundant).',
              formulaOrRule: 'RAID 5 usable capacity = (N − 1) × smallest drive size.',
            },
            {
              heading: 'Laser Printer 7-Step Imaging Process',
              explanation: 'Processing -> Charging -> Exposing -> Developing -> Transferring -> Fusing -> Cleaning.',
              mentalModel: 'Please Come Early During The First Class.',
            },
          ],
          realWorldScenario: {
            title: 'Smudged Laser Printer Output',
            situation: 'Printed pages smear when touched immediately after exiting the laser printer.',
            analysis: 'Toner is not being melted onto the paper—the Fuser Assembly is failing.',
            takeaway: 'Smearing toner = Fuser; Ghosting = Drum/Cleaning blade.',
          },
          examTraps: [
            'RAID is NOT a backup—it protects against hardware failure, not accidental deletion or ransomware.',
            'Never open a PSU or CRT monitor due to lethal capacitor charge.',
          ],
          keyTerms: [
            { term: 'ECC RAM', definition: 'Error-Correcting Code memory used in servers to detect/fix single-bit errors.' },
            { term: 'MDM', definition: 'Mobile Device Management—enforces policies, encryption, and remote wipe on phones/tablets.' },
          ],
          conceptChecks: [
            {
              id: 'aplus-d1-l1-q1',
              question: 'A client needs fault tolerance for 1 drive failure with maximum usable capacity across 4 drives. Which RAID level fits best?',
              options: ['RAID 0', 'RAID 1', 'RAID 5', 'JBOD'],
              correctIndex: 2,
              rationale: 'RAID 5 uses 1 drive for parity, yielding 75% usable capacity across 4 drives while surviving 1 failure.',
            },
          ],
          practicalDrill: {
            title: 'Workstation Spec Builder',
            prompt: 'Spec a CAD/Video Editing workstation vs a Thin Client (RAM, GPU, Storage, Cooling).',
            steps: ['Choose ECC/high-capacity RAM + NVMe + dedicated GPU for CAD.', 'Choose minimal local storage + reliable NIC for Thin Client.'],
            successCriteria: 'Accurate component justification for both profiles.',
          },
          flashcards: [
            { front: 'Laser printer 7 steps?', back: 'Processing, Charging, Exposing, Developing, Transferring, Fusing, Cleaning.', tag: 'A+-D1' },
          ],
          sourceRefs: ['my_documents/Chapple M. CompTIA A+ CertMike. Prepare. Practice...Exam 220-1101 2023.pdf'],
        },
      ],
    },
    {
      id: 'aplus-d2',
      domainNumber: 2,
      title: 'Networking, Virtualization & Cloud Computing',
      examWeightPercent: 31,
      overview: 'Master TCP/UDP ports, SOHO routers, Wi-Fi standards, DNS/DHCP, hypervisors, and cloud models.',
      lessons: [
        {
          id: 'aplus-d2-l1',
          title: 'Ports, IP Addressing, DNS/DHCP & Hypervisors',
          estimatedMinutes: 35,
          summary: 'Configure SOHO networks, recognize APIPA failures, and compare Type 1 vs Type 2 hypervisors.',
          learningObjectives: [
            'Identify APIPA (169.254.x.x) as a DHCP failure indicator',
            'Differentiate Type 1 (bare-metal) vs Type 2 (hosted) hypervisors',
            'Compare IaaS, PaaS, and SaaS cloud service models',
          ],
          coreConcepts: [
            {
              heading: 'DHCP & APIPA Diagnostics',
              explanation:
                'DHCP assigns IP, subnet mask, gateway, and DNS automatically (DORA: Discover, Offer, Request, Acknowledge). If a Windows host cannot reach DHCP, it self-assigns an APIPA address (169.254.0.0/16).',
              mentalModel: '169.254.x.x = "I shouted for DHCP and nobody answered."',
            },
            {
              heading: 'Virtualization & Cloud',
              explanation:
                'Type 1 hypervisors (ESXi, Hyper-V, KVM) run directly on hardware for production servers. Type 2 (VirtualBox, VMware Workstation) run on top of a host OS for labs.',
            },
          ],
          realWorldScenario: {
            title: 'No Internet on Single Workstation',
            situation: 'A user reports no internet; `ipconfig` shows `169.254.42.19`.',
            analysis: 'APIPA indicates the NIC cannot reach the DHCP server—check patch cable, switch port, or DHCP scope exhaustion.',
            takeaway: 'Always run `ipconfig /all` first on connectivity tickets.',
          },
          examTraps: [
            '127.0.0.1 is loopback (tests local TCP/IP stack), NOT a DHCP failure.',
            'DNS uses UDP 53 for standard queries and TCP 53 for zone transfers.',
          ],
          keyTerms: [
            { term: 'APIPA', definition: 'Automatic Private IP Addressing (169.254.0.0/16) assigned when DHCP is unreachable.' },
            { term: 'SOHO', definition: 'Small Office / Home Office router combining switch, WAP, firewall, and NAT.' },
          ],
          conceptChecks: [
            {
              id: 'aplus-d2-l1-q1',
              question: 'A workstation has IP 169.254.12.88 and cannot reach any network resources. What is the MOST likely cause?',
              options: ['DNS server down', 'DHCP server unreachable', 'Incorrect default gateway', 'Duplicate static IP'],
              correctIndex: 1,
              rationale: '169.254.x.x is an APIPA address automatically assigned when DHCP fails.',
            },
          ],
          practicalDrill: {
            title: 'CLI Network Triage',
            prompt: 'Sequence `ping 127.0.0.1`, `ipconfig`, `ping <gateway>`, `ping 8.8.8.8`, `nslookup` to isolate a fault.',
            steps: ['Test local stack -> local LAN -> internet IP -> DNS resolution.'],
            successCriteria: 'Exact fault isolation at each hop.',
          },
          flashcards: [
            { front: 'What does 169.254.x.x indicate?', back: 'APIPA — the host could not reach a DHCP server.', tag: 'A+-D2' },
          ],
          sourceRefs: ['my_documents/Chapple M. CompTIA A+ CertMike. Prepare. Practice...Exam 220-1101 2023.pdf'],
        },
      ],
    },
    {
      id: 'aplus-d3',
      domainNumber: 3,
      title: 'CompTIA 6-Step Troubleshooting & OS Operations',
      examWeightPercent: 29,
      overview: 'Apply CompTIA’s structured troubleshooting methodology and malware removal steps.',
      lessons: [
        {
          id: 'aplus-d3-l1',
          title: 'The 6-Step Troubleshooting Methodology & Malware Removal',
          estimatedMinutes: 35,
          summary: 'Master the exact order of CompTIA’s troubleshooting steps—one of the highest-yield topics on both A+ exams.',
          learningObjectives: [
            'Execute all 6 CompTIA troubleshooting steps in exact order',
            'Execute the 7-step Malware Removal process (Quarantine -> Disable System Restore -> Remediate -> Re-enable)',
          ],
          coreConcepts: [
            {
              heading: 'CompTIA 6-Step Troubleshooting Methodology',
              explanation:
                '1. Identify the problem (gather info, backup data!). 2. Establish a theory of probable cause (question the obvious). 3. Test the theory to determine cause. 4. Establish a plan of action & implement. 5. Verify full system functionality & implement preventive measures. 6. Document findings, actions, and outcomes.',
              mentalModel: 'Identify -> Theorize -> Test -> Plan/Fix -> Verify -> Document.',
            },
          ],
          realWorldScenario: {
            title: 'Ransomware Infection on Accounting PC',
            situation: 'User reports popups and encrypted desktop files.',
            analysis: 'Step 1 of malware removal is Identify/Research, Step 2 is Quarantine (disconnect network immediately) before scanning.',
            takeaway: 'Always quarantine an infected host before running remediation tools.',
          },
          examTraps: [
            'Always BACK UP user data before making invasive repairs (Step 1).',
            'Documentation (Step 6) is always the FINAL step—never skip Verify Full Functionality (Step 5).',
          ],
          keyTerms: [
            { term: 'BSOD', definition: 'Blue Screen of Death—Windows kernel stop error often caused by faulty drivers or RAM.' },
            { term: 'SFC /scannow', definition: 'System File Checker utility that repairs corrupted Windows system files.' },
          ],
          conceptChecks: [
            {
              id: 'aplus-d3-l1-q1',
              question: 'You have just replaced a faulty NIC and confirmed the user can browse the web. What is the NEXT step in CompTIA’s methodology?',
              options: ['Establish a new theory', 'Document findings, actions, and outcomes', 'Backup user data', 'Escalate to Tier 2'],
              correctIndex: 1,
              rationale: 'After verifying full system functionality (Step 5), Step 6 is Document findings, actions, and outcomes.',
            },
          ],
          practicalDrill: {
            title: '6-Step Ticket Walkthrough',
            prompt: 'Walk a "No Display on Boot" ticket through all 6 CompTIA steps.',
            steps: ['Check monitor power/cable (question obvious), test known-good monitor, replace cable, verify boot, document.'],
            successCriteria: 'All 6 steps explicitly demonstrated in order.',
          },
          flashcards: [
            { front: 'CompTIA 6-Step Troubleshooting Order?', back: '1. Identify, 2. Establish theory, 3. Test theory, 4. Plan & implement, 5. Verify functionality, 6. Document.', tag: 'A+-D3' },
          ],
          sourceRefs: ['my_documents/Chapple M. CompTIA A+ CertMike. Prepare. Practice...Exam 220-1101 2023.pdf'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Small Business IT Rollout & Triage',
    scenario: 'A 15-person clinic needs new workstations, RAID-5 file server, secure Wi-Fi, and a malware incident response checklist.',
    tasks: [
      'Design the server storage (RAID) + backup plan.',
      'Configure SOHO Wi-Fi (WPA3) and DHCP reservation for the laser printer.',
      'Write a 6-step troubleshooting SOP for the help desk.',
    ],
    modelSolution: 'Deploy 4-drive RAID-5 NAS + offsite 3-2-1 cloud backup, WPA3-Personal/Enterprise Wi-Fi with isolated Guest SSID, static DHCP lease for printer, and CompTIA 6-step ticket template.',
  },
  examStrategy: {
    examFormat: 'Up to 90 questions (MCQ + PBQs), 90 minutes per Core exam.',
    timeManagementPlan: 'Flag PBQs (Performance-Based Questions) at the start, finish all MCQs in 55 minutes, then spend 35 minutes calmly solving PBQs.',
    mindsetRules: [
      'Always question the obvious first (power, cables, Wi-Fi switch).',
      'Always back up data before destructive troubleshooting.',
    ],
    finalWeekChecklist: [
      'Memorize all common ports and RAID levels',
      'Memorize 6-step troubleshooting and 7-step laser printing',
      'Score >= 85% on CertMike practice tests',
    ],
  },
};
