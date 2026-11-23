/* ===================================================================
   ANOXPASS — Interactive Performance-Based Question (PBQ) Labs
   Hands-on ordering, matching, and triage scenarios across certs.
   =================================================================== */

export type PbqMechanic = 'ordering' | 'matching' | 'triage';

export interface PbqOrderingItem {
  id: string;
  label: string;
  detail: string;
}

export interface PbqMatchingRow {
  id: string;
  prompt: string;
  options: string[];
  correctOption: string;
  rationale: string;
}

export interface PbqLab {
  id: string;
  certSlug: string;
  certCode: string;
  title: string;
  mechanic: PbqMechanic;
  difficulty: 'associate' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  scenario: string;
  xpReward: number;
  // For 'ordering'
  orderingItems?: PbqOrderingItem[];
  correctOrderIds?: string[];
  orderingRationale?: string;
  // For 'matching' & 'triage'
  rows?: PbqMatchingRow[];
}

export const PBQ_LABS: PbqLab[] = [
  {
    id: 'pbq-secplus-acl-order',
    certSlug: 'comptia-security-plus',
    certCode: 'SEC+',
    title: 'Edge Firewall ACL Top-Down Rule Ordering',
    mechanic: 'ordering',
    difficulty: 'associate',
    estimatedMinutes: 5,
    xpReward: 40,
    scenario:
      'A DMZ web app server (10.20.1.50) must accept HTTPS from any client while blocking known malicious botnet IP 203.0.113.88, allow SSH solely from the admin bastion (10.10.0.10), and drop everything else. Order the stateful firewall rules top-to-bottom so explicit blocks fire before permits.',
    orderingItems: [
      { id: 'r-implicit-deny', label: 'DENY ANY ANY (Explicit Cleanup Drop)', detail: 'Catch-all final rule at bottom of ACL' },
      { id: 'r-allow-https', label: 'ALLOW TCP ANY -> 10.20.1.50:443', detail: 'Public customer HTTPS ingress to DMZ web host' },
      { id: 'r-deny-botnet', label: 'DENY IP 203.0.113.88 -> ANY (Log)', detail: 'Explicit threat-intel block for active brute-forcer' },
      { id: 'r-allow-ssh', label: 'ALLOW TCP 10.10.0.10 -> 10.20.1.50:22', detail: 'Bastion jump-host SSH administrative access' },
    ],
    correctOrderIds: ['r-deny-botnet', 'r-allow-ssh', 'r-allow-https', 'r-implicit-deny'],
    orderingRationale:
      'Firewalls evaluate ACLs strictly top-to-bottom on first match: explicit DENY for malicious 203.0.113.88 must precede the broad ANY->443 permit, followed by least-privilege SSH and the final cleanup DENY ANY ANY.',
  },
  {
    id: 'pbq-secplus-zta-matching',
    certSlug: 'comptia-security-plus',
    certCode: 'SEC+',
    title: 'Zero Trust Control Plane vs Data Plane Mapping',
    mechanic: 'matching',
    difficulty: 'intermediate',
    estimatedMinutes: 4,
    xpReward: 40,
    scenario:
      'Map each enterprise requirement from a NIST SP 800-207 Zero Trust rollout to the exact architectural component.',
    rows: [
      {
        id: 'm1',
        prompt: 'Computes real-time risk score from device MDM compliance & user geolocation before granting access',
        options: ['Policy Engine (PE)', 'Policy Enforcement Point (PEP)', 'SIEM Collector', 'CRL Server'],
        correctOption: 'Policy Engine (PE)',
        rationale: 'The Policy Engine executes trust algorithms on the Control Plane to evaluate allow/deny decisions.',
      },
      {
        id: 'm2',
        prompt: 'Sits directly inline on network traffic to forward or terminate sessions based on Control Plane tokens',
        options: ['Policy Engine (PE)', 'Policy Enforcement Point (PEP)', 'HSM Key Vault', 'DMARC'],
        correctOption: 'Policy Enforcement Point (PEP)',
        rationale: 'The PEP enforces session termination and access boundaries inline on the Data Plane.',
      },
      {
        id: 'm3',
        prompt: 'Cryptographically binds hardware key authentication to the exact HTTPS origin domain against AiTM phishing',
        options: ['SMS OTP', 'FIDO2 / WebAuthn', 'RADIUS PAP', 'LDAP Plaintext'],
        correctOption: 'FIDO2 / WebAuthn',
        rationale: 'FIDO2 origin-bound signatures prevent Adversary-in-the-Middle token relay.',
      },
      {
        id: 'm4',
        prompt: 'Replaces raw credit card numbers in checkout DB with non-reversible vault references to shrink PCI scope',
        options: ['Base64 Encoding', 'Tokenization', 'RAID 5', 'Split Tunnel VPN'],
        correctOption: 'Tokenization',
        rationale: 'Tokenization removes real PANs from out-of-scope databases without a mathematical decryption relationship.',
      },
    ],
  },
  {
    id: 'pbq-cysa-ir-triage',
    certSlug: 'cysa',
    certCode: 'CYSA+',
    title: 'RFC 3227 Forensic Volatility Acquisition Order',
    mechanic: 'ordering',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    xpReward: 40,
    scenario:
      'A critical Linux API server shows active ransomware/lotL memory injection and suspicious outbound TLS sockets. Arrange your forensic collection tasks from MOST volatile to LEAST volatile.',
    orderingItems: [
      { id: 'v-disk', label: 'Bit-stream disk image + SHA-256 hash', detail: 'NVMe / block storage volumes' },
      { id: 'v-ram', label: 'CPU registers, cache & volatile RAM dump (LiME)', detail: 'In-memory keys and injected payloads' },
      { id: 'v-backup', label: 'Offline immutable archival backup tapes', detail: 'Long-term cold storage snapshots' },
      { id: 'v-net', label: 'Active network connections, routing table & ARP cache', detail: 'Live C2 sockets (`ss -tunap`)' },
    ],
    correctOrderIds: ['v-ram', 'v-net', 'v-disk', 'v-backup'],
    orderingRationale:
      'Under RFC 3227 Order of Volatility, capture ephemeral RAM/CPU state first, then live network tables, then non-volatile disk images with write-blockers, and archival backups last.',
  },
  {
    id: 'pbq-aws-arch-triage',
    certSlug: 'aws-csaa',
    certCode: 'SAA-C03',
    title: 'AWS Multi-Tier Well-Architected Security & Resilience Triage',
    mechanic: 'triage',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    xpReward: 40,
    scenario:
      'Review an architecture ticket for a regulated SaaS workload in AWS us-east-1 and select the BEST Well-Architected solution for each requirement.',
    rows: [
      {
        id: 'a1',
        prompt: 'EC2 private app nodes must read from Amazon S3 without traffic traversing the public Internet or paying NAT Gateway GB charges',
        options: ['Internet Gateway', 'S3 Gateway VPC Endpoint', 'Public Elastic IP', 'AWS Direct Connect'],
        correctOption: 'S3 Gateway VPC Endpoint',
        rationale: 'A Gateway VPC Endpoint routes S3 traffic privately over the AWS backbone at zero per-GB NAT charge.',
      },
      {
        id: 'a2',
        prompt: 'Relational PostgreSQL DB requires automatic synchronous standby failover across Availability Zones (<60s)',
        options: ['RDS Multi-AZ Deployment', 'RDS Read Replica only', 'S3 Standard-IA', 'EBS Instance Store'],
        correctOption: 'RDS Multi-AZ Deployment',
        rationale: 'RDS Multi-AZ synchronously replicates data to another AZ for high availability and automatic DNS failover.',
      },
      {
        id: 'a3',
        prompt: 'Enforce strict defense-in-depth at Subnet boundary (stateless allow/deny CIDR rules) + Instance boundary (stateful allow)',
        options: ['IAM Group + KMS', 'Network ACL (NACL) + Security Group', 'Route 53 + CloudFront', 'AWS Config only'],
        correctOption: 'Network ACL (NACL) + Security Group',
        rationale: 'NACLs provide stateless subnet-level allow/deny evaluation while Security Groups provide stateful instance-level permit rules.',
      },
    ],
  },
  {
    id: 'pbq-cisa-audit-triage',
    certSlug: 'cisa',
    certCode: 'CISA',
    title: 'ISACA Audit Evidence Reliability & Finding Classification',
    mechanic: 'triage',
    difficulty: 'advanced',
    estimatedMinutes: 6,
    xpReward: 40,
    scenario:
      'As Lead IS Auditor under ITAF 4th Edition, classify the reliability & mandatory next audit step for each scenario.',
    rows: [
      {
        id: 'c1',
        prompt: 'Database admin states verbally that backup restores are tested quarterly, but no logs exist',
        options: ['Accept verbal assertion as sufficient evidence', 'Corroborate via direct observation or independent restore re-performance', 'Immediately issue clean unqualified report', 'Delegate testing to the DBA'],
        correctOption: 'Corroborate via direct observation or independent restore re-performance',
        rationale: 'Inquiry alone is the least reliable audit evidence; ITAF requires independent corroboration or re-performance.',
      },
      {
        id: 'c2',
        prompt: 'Ranked from MOST reliable to LEAST reliable evidence source during financial systems audit:',
        options: [
          'Management email > External bank confirmation',
          'Independent auditor re-performance / External confirmation > Internal strong controls > Oral inquiry',
          'Oral interview > Automated system log',
          'Internal memo with weak controls > Physical inspection',
        ],
        correctOption: 'Independent auditor re-performance / External confirmation > Internal strong controls > Oral inquiry',
        rationale: 'Direct auditor re-performance and independent external third-party confirmations rank highest in CISA evidence hierarchy.',
      },
      {
        id: 'c3',
        prompt: 'A single developer must temporarily hold production push rights in a 4-person startup. Best recommendation:',
        options: [
          'Approve permanent undocumented exception',
          'Enforce automated immutable logs reviewed independently each day (Compensating Control)',
          'Disable production change tickets',
          'Purchase cyber liability policy instead of controls',
        ],
        correctOption: 'Enforce automated immutable logs reviewed independently each day (Compensating Control)',
        rationale: 'When SoD is impractical due to headcount, detective compensating controls + independent log review mitigate risk.',
      },
    ],
  },
  {
    id: 'pbq-crisc-quant-risk',
    certSlug: 'crisc',
    certCode: 'CRISC',
    title: 'Quantitative Risk (SLE / ALE) & Safeguard ROI Analysis',
    mechanic: 'triage',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    xpReward: 40,
    scenario:
      'A core ERP cluster valued at $800,000 has a Single Incident Exposure Factor (EF) of 25% and occurs once every 2 years (ARO = 0.5). An automated failover control reduces ARO to 0.1 and costs $35,000/yr.',
    rows: [
      {
        id: 'q1',
        prompt: 'Calculate Single Loss Expectancy (SLE = AV × EF)',
        options: ['$400,000', '$200,000', '$100,000', '$80,000'],
        correctOption: '$200,000',
        rationale: 'SLE = $800,000 × 0.25 = $200,000.',
      },
      {
        id: 'q2',
        prompt: 'Calculate Annualized Loss Expectancy BEFORE the safeguard (ALE_before = SLE × ARO)',
        options: ['$100,000 / year', '$200,000 / year', '$50,000 / year', '$20,000 / year'],
        correctOption: '$100,000 / year',
        rationale: 'ALE_before = $200,000 × 0.5 = $100,000 per year.',
      },
      {
        id: 'q3',
        prompt: 'Calculate Net Annual Safeguard Benefit (ALE_before - ALE_after - Annual Control Cost)',
        options: ['+$45,000 net savings/yr (Justified)', '-$15,000 net loss/yr (Reject)', '+$80,000 net savings/yr', '$0 break-even'],
        correctOption: '+$45,000 net savings/yr (Justified)',
        rationale: 'ALE_after = $200,000 × 0.1 = $20,000. Benefit = $100,000 - $20,000 - $35,000 = +$45,000/yr net value.',
      },
    ],
  },
  {
    id: 'pbq-fifa-fee-cap',
    certSlug: 'fifa-agent',
    certCode: 'FIFA-AGENT',
    title: 'FIFA FFAR Commission Fee Cap & Dual Representation Triage',
    mechanic: 'triage',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    xpReward: 40,
    scenario:
      'Evaluate transfer representation contracts under the FIFA Football Agent Regulations (FFAR).',
    rows: [
      {
        id: 'f1',
        prompt: 'A player earns $300,000 USD annual remuneration (above $200,000 threshold). Maximum agent cap on the portion ABOVE $200,000 when representing ONLY the player:',
        options: ['10%', '5%', '3%', '6%'],
        correctOption: '3%',
        rationale: 'Under FFAR Art. 15, when representing an Individual, fee cap is 5% on first $200,000 and 3% on annual remuneration above $200,000.',
      },
      {
        id: 'f2',
        prompt: 'Which parties MAY a FIFA Football Agent legally represent via Permitted Dual Representation in the SAME transfer?',
        options: [
          'Releasing Club and Player simultaneously',
          'Engaging Entity and Individual ONLY (with prior explicit written consent from both)',
          'All three parties simultaneously',
          'Releasing Club and Engaging Entity',
        ],
        correctOption: 'Engaging Entity and Individual ONLY (with prior explicit written consent from both)',
        rationale: 'FFAR prohibits representing releasing entity with any other party; dual representation is strictly limited to Engaging Entity + Individual with prior written consent.',
      },
      {
        id: 'f3',
        prompt: 'How may an agent execute a valid Representation Agreement with a minor (under 18)?',
        options: [
          'Verbal handshake with club coach',
          'Never permitted until earliest 6 months before age eligible to sign first professional contract + legal guardian co-signature & minor CPD course',
          'Signed solely by minor at age 13',
          'Fee cap increased to 15%',
        ],
        correctOption: 'Never permitted until earliest 6 months before age eligible to sign first professional contract + legal guardian co-signature & minor CPD course',
        rationale: 'FFAR strict minor protection forbids approaching minors earlier than 6 months prior to first pro contract eligibility and requires guardian co-signature + specialized CPD.',
      },
    ],
  },
  {
    id: 'pbq-netplus-osi-matching',
    certSlug: 'comptia-network-plus',
    certCode: 'NETWORK+',
    title: 'OSI Layer Protocol & Troubleshooting Mapping',
    mechanic: 'matching',
    difficulty: 'associate',
    estimatedMinutes: 4,
    xpReward: 40,
    scenario: 'Match each network failure or encapsulation header to its correct OSI layer.',
    rows: [
      {
        id: 'n1',
        prompt: 'Broadcast storm caused by disabled Spanning Tree Protocol (STP) between access switches',
        options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 7 (Application)'],
        correctOption: 'Layer 2 (Data Link)',
        rationale: 'Ethernet switching, MAC frames, VLAN 802.1Q tags, and STP operate at OSI Layer 2.',
      },
      {
        id: 'n2',
        prompt: 'IP packet fragmentation and OSPF dynamic routing table convergence across subnets',
        options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 6 (Presentation)'],
        correctOption: 'Layer 3 (Network)',
        rationale: 'IP logical addressing and routing decisions happen at OSI Layer 3.',
      },
      {
        id: 'n3',
        prompt: 'TLS 1.3 cipher negotiation and X.509 MIME encoding translation before HTTP handling',
        options: ['Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 6 (Presentation)', 'Layer 1 (Physical)'],
        correctOption: 'Layer 6 (Presentation)',
        rationale: 'Encryption, compression, and character formatting conceptually map to Layer 6 (Presentation).',
      },
    ],
  },
];
