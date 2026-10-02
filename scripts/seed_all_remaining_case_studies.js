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

const COMPLETE_COVERAGE_CASE_STUDIES = [
  // =========================================================================
  // CCSP — DOMAINS 1, 3, 5, 6
  // =========================================================================
  {
    certSlug: 'ccsp',
    domainNumber: 1,
    title: 'Multi-Tenant SaaS Isolation & Shared Responsibility Architecture',
    scenarioText: 'CloudTech Corp delivers a multi-tenant ERP platform hosted across AWS and Azure. A financial services customer demands dedicated database isolation and SOC 2 Type II audit rights. The Lead Cloud Architect must design a zero-trust tenant boundary while adhering to the CSA Cloud Controls Matrix.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under the Shared Responsibility Model for SaaS, which party is PRIMARILY responsible for data classification, tenant user access governance, and client-side encryption?',
        optionA: 'The underlying cloud infrastructure provider (AWS/Azure).',
        optionB: 'The Cloud Customer / SaaS Consumer.',
        optionC: 'The local Internet Service Provider.',
        optionD: 'The database open-source foundation.',
        correctAnswer: 'B',
        rationale: 'In SaaS deployments, the customer retains accountability for their data governance, identity lifecycle, access permissions, and regulatory compliance.'
      },
      {
        questionNumber: 2,
        stem: 'Which CSA Cloud Controls Matrix (CCM) domain should CloudTech Corp evaluate to verify cryptographic tenant data isolation?',
        optionA: 'Facility and Substation Power Management.',
        optionB: 'Cryptography, Encryption and Key Management (CEK).',
        optionC: 'Social Media Marketing Guidelines.',
        optionD: 'Physical Mail Delivery Protocol.',
        correctAnswer: 'B',
        rationale: 'The CEK domain within the CSA CCM addresses encryption algorithms, envelope key management, and cryptographic separation of multi-tenant workloads.'
      }
    ]
  },
  {
    certSlug: 'ccsp',
    domainNumber: 3,
    title: 'Kubernetes Container Escape & Virtual Network Segmentation',
    scenarioText: 'A high-frequency trading platform runs containerized microservices on AWS EKS. During a red-team assessment, ethical hackers exploit an unpatched vulnerability in an ingress container and attempt to break out to the underlying EC2 host hypervisor.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which host hardening control MOST effectively prevents container breakout attacks from compromising the underlying virtual machine?',
        optionA: 'Running all Docker containers as root user.',
        optionB: 'Applying Linux seccomp profiles, AppArmor / SELinux policies, and utilizing non-root containers with read-only root filesystems.',
        optionC: 'Disabling host logging.',
        optionD: 'Opening all TCP ports on the node security group.',
        correctAnswer: 'B',
        rationale: 'Linux security modules (AppArmor/SELinux), seccomp syscall filtering, and immutable root filesystems constrain container privileges, blocking VM breakout.'
      },
      {
        questionNumber: 2,
        stem: 'To enforce micro-segmentation between trading execution pods and analytics pods within the same Kubernetes cluster, which mechanism should be deployed?',
        optionA: 'Flat Layer 2 bridging.',
        optionB: 'Kubernetes NetworkPolicies paired with a Container Network Interface (CNI) supporting eBPF/mTLS.',
        optionC: 'DNS round-robin routing.',
        optionD: 'Static IP assignment without firewall rules.',
        correctAnswer: 'B',
        rationale: 'NetworkPolicies enforce zero-trust egress and ingress rules between specific pod labels and namespaces, isolating sensitive microservices.'
      }
    ]
  },
  {
    certSlug: 'ccsp',
    domainNumber: 5,
    title: 'Cloud Ephemeral Forensics & Automated Incident Response',
    scenarioText: 'At 03:00 UTC, an unauthorized serverless AWS Lambda function executes cryptocurrency mining scripts using stolen IAM role credentials. The DevOps team prepares to terminate the function, but the Incident Commander mandates evidence preservation for law enforcement.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Why is evidence preservation in serverless cloud environments distinct from traditional on-premises server forensics?',
        optionA: 'Serverless environments do not generate logs.',
        optionB: 'Compute instances are ephemeral and terminate rapidly, requiring instant automated ingestion of execution telemetry, CloudTrail logs, and invocation payloads.',
        optionC: 'Digital forensics is illegal in public cloud environments.',
        optionD: 'Lambda functions run on analog hardware.',
        correctAnswer: 'B',
        rationale: 'Serverless computing destroys execution containers upon completion; forensic readiness requires real-time streaming of execution logs and API audit trails.'
      },
      {
        questionNumber: 2,
        stem: 'What immediate containment action will stop the rogue execution without destroying forensic logs in AWS CloudTrail?',
        optionA: 'Delete the entire AWS root account.',
        optionB: 'Attach an explicit Deny-All inline policy to the compromised IAM execution role and revoke existing session tokens.',
        optionC: 'Format all developer laptops.',
        optionD: 'Publish the credentials on social media.',
        correctAnswer: 'B',
        rationale: 'Attaching an explicit Deny policy and revoking session tokens instantly cuts off attacker access while keeping all immutable audit logs intact.'
      }
    ]
  },
  {
    certSlug: 'ccsp',
    domainNumber: 6,
    title: 'EU-US Cross-Border Data Transfer & Schrems II Compliance Audit',
    scenarioText: 'A German e-commerce retailer utilizes a US-based cloud CRM platform storing 2 million EU citizen profiles. Following the Schrems II ruling, the German Data Protection Authority (DPA) conducts an audit demanding proof that US intelligence agencies cannot access EU personal data in plaintext.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which technical supplementary measure satisfies GDPR cross-border transfer requirements under European Data Protection Board (EDPB) guidelines?',
        optionA: 'A verbal agreement between company CEOs.',
        optionB: 'End-to-end client-side encryption where master encryption keys are exclusively retained and operated within the EU (Hold Your Own Key - HYOK).',
        optionC: 'Sending records via unencrypted FTP.',
        optionD: 'Hiding the database files in an obscure directory.',
        correctAnswer: 'B',
        rationale: 'EDPB guidelines state that transferring encrypted data to a third country is compliant only if the encryption keys are retained exclusively under EU jurisdiction.'
      },
      {
        questionNumber: 2,
        stem: 'Which independent cloud compliance certification specifically audits the protection of Personally Identifiable Information (PII) in public cloud environments?',
        optionA: 'ISO/IEC 27018',
        optionB: 'IEEE 802.11ac',
        optionC: 'PCI PIN Security Standard',
        optionD: 'OSI 7-Layer Protocol',
        correctAnswer: 'A',
        rationale: 'ISO/IEC 27018 is the international standard specifically addressing privacy protection and PII safeguards for public cloud service providers.'
      }
    ]
  },

  // =========================================================================
  // CGEIT — DOMAINS 2, 3
  // =========================================================================
  {
    certSlug: 'cgeit',
    domainNumber: 2,
    title: 'Global IT Sourcing & Multi-Vendor Governance Failure',
    scenarioText: 'GlobalCorp outsourced its core infrastructure and software development to three separate offshore suppliers. Due to poorly defined RACI matrices and conflicting contractual SLAs, a critical payment outage resulted in finger-pointing between vendors and a $10M revenue loss. The Board mandates a comprehensive IT resource optimization overhaul.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'To eliminate operational ambiguity across multi-vendor service delivery, which governance mechanism should the CGEIT leader establish?',
        optionA: 'Cancel all vendor contracts immediately without replacement.',
        optionB: 'Implement a Service Integration and Management (SIAM) framework with end-to-end multi-sourcing accountability and unified cross-vendor SLAs.',
        optionC: 'Let vendors resolve disputes informally without documentation.',
        optionD: 'Appoint junior developers to manage vendor contract disputes.',
        correctAnswer: 'B',
        rationale: 'SIAM provides governance and orchestration across multiple internal and external service providers, ensuring unified service delivery and single accountability.'
      },
      {
        questionNumber: 2,
        stem: 'How should enterprise data stewardship be structured when intellectual property and customer records are processed by external vendors?',
        optionA: 'Delegate all data ownership and liability to the lowest-bidding vendor.',
        optionB: 'Maintain internal business Data Stewards who retain data classification authority, enforce data lineage, and mandate contractually binding audit clauses.',
        optionC: 'Allow vendors to monetize enterprise customer data to reduce fees.',
        optionD: 'Delete all metadata to prevent vendors from inspecting schemas.',
        correctAnswer: 'B',
        rationale: 'Data ownership can never be outsourced; internal enterprise data stewards must govern data classification, quality, and contractual compliance.'
      }
    ]
  },
  {
    certSlug: 'cgeit',
    domainNumber: 3,
    title: 'Val IT Portfolio Governance & ERP Transformation Business Case',
    scenarioText: 'Omega Industrial initiates a $100M digital supply chain transformation. Two years into execution, the project is 80% over budget, core manufacturing modules are delayed by 18 months, and anticipated cost savings have failed to materialize. The CEO tasks the CGEIT director with salvaging the investment.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under the Val IT framework, what process should be immediately executed to determine whether the transformation should proceed, pivot, or terminate?',
        optionA: 'An automated code linting scan.',
        optionB: 'A Stage-Gate Investment Review evaluating revised Business Case forecasts (TCO, updated NPV/IRR, residual risk, and realistic benefits realization milestones).',
        optionC: 'Immediate project completion celebration.',
        optionD: 'Issuing a press release declaring success.',
        correctAnswer: 'B',
        rationale: 'Val IT Stage-Gate reviews evaluate ongoing viability against updated business case metrics (NPV/IRR/TCO) to make informed go/kill/pivot governance decisions.'
      },
      {
        questionNumber: 2,
        stem: 'Who holds primary governance accountability for ensuring that projected business benefits are harvested following go-live?',
        optionA: 'The external software integration contractor.',
        optionB: 'The Executive Business Sponsor / Business Unit Leader.',
        optionC: 'The night-shift help desk operator.',
        optionD: 'The server rack hardware technician.',
        correctAnswer: 'B',
        rationale: 'Under Val IT, ultimate accountability for benefits realization always resides with the Business Sponsor who owns the operational capability.'
      }
    ]
  },

  // =========================================================================
  // CISM — DOMAINS 2, 3
  // =========================================================================
  {
    certSlug: 'cism',
    domainNumber: 2,
    title: 'Quantitative Risk Assessment & Cyber Insurance Optimization',
    scenarioText: 'A healthcare conglomerate evaluates the risk of a major ransomware attack encrypting its Electronic Health Record (EHR) database. Asset Value is $50,000,000, Exposure Factor is 40%, and Annualized Rate of Occurrence is estimated at 0.10. An automated EDR solution costs $400,000 annually and reduces EF to 5%.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What is the pre-control Annualized Loss Expectancy (ALE) for this ransomware risk scenario?',
        optionA: '$5,000,000',
        optionB: '$2,000,000',
        optionC: '$20,000,000',
        optionD: '$500,000',
        correctAnswer: 'B',
        rationale: 'SLE = $50M * 0.40 = $20M. ALE = $20M * 0.10 = $2,000,000.'
      },
      {
        questionNumber: 2,
        stem: 'Post-control SLE becomes $2.5M ($50M * 0.05), making post-control ALE $250,000. Is implementing the $400,000 EDR control financially justified?',
        optionA: 'No, because any cost above $100,000 is too expensive.',
        optionB: 'Yes, because Cost-Benefit Analysis (CBA) yields a net annual savings of $1,350,000 ($2M - $250k - $400k).',
        optionC: 'No, because cybersecurity should never be measured mathematically.',
        optionD: 'Yes, but only if approved by hardware vendors.',
        correctAnswer: 'B',
        rationale: 'CBA = Pre-ALE ($2M) - Post-ALE ($250k) - Control Cost ($400k) = $1,350,000 net annual savings, making the investment highly justified.'
      }
    ]
  },
  {
    certSlug: 'cism',
    domainNumber: 3,
    title: 'Zero Trust Security Architecture & Identity Governance Rollout',
    scenarioText: 'Following a remote worker credential stuffing breach, the CISO mandates transition from legacy perimeter VPNs to a Zero Trust Architecture (ZTA) across 50,000 global endpoints. The engineering team expresses concern regarding employee friction and potential operational downtime.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What fundamental design principle of Zero Trust Architecture (NIST SP 800-207) must guide the access policy engine?',
        optionA: 'Granting permanent local administrator rights to developers.',
        optionB: 'Never trust, always verify: dynamic evaluation of subject identity, device security posture, geographical location, and resource sensitivity on every request.',
        optionC: 'Trusting all traffic originating from corporate Wi-Fi.',
        optionD: 'Eliminating all password and biometric checks.',
        correctAnswer: 'B',
        rationale: 'Zero Trust eliminates implicit trust based on network location, dynamically authenticating and authorizing every transaction contextually.'
      },
      {
        questionNumber: 2,
        stem: 'To measure actual behavioral security improvement resulting from the new program, which metric is MOST meaningful for the CISO to report to the Board?',
        optionA: 'Number of pages in the new policy document.',
        optionB: 'Phishing simulation failure rate trends and mean time to detect/revoke compromised credentials (MTTD/MTTR).',
        optionC: 'Total cost of company coffee cups.',
        optionD: 'Number of firewall reboots.',
        correctAnswer: 'B',
        rationale: 'Behavioral metrics (phishing click resilience, MTTR) demonstrate practical security posture improvement rather than passive compliance activities.'
      }
    ]
  },

  // =========================================================================
  // CISSP — DOMAINS 2, 3, 4, 5, 6, 8
  // =========================================================================
  {
    certSlug: 'cissp',
    domainNumber: 2,
    title: 'Enterprise Data Classification & Media Sanitization Governance',
    scenarioText: 'A defense subcontractor handles Controlled Unclassified Information (CUI). An IT refresh decommissions 500 Solid State Drives (SSDs) containing sensitive defense telemetry. An intern recommends using an electromagnetic degausser before donating the drives to a local school.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under NIST SP 800-88 Rev. 1, why is electromagnetic degaussing INEFFECTIVE for sanitizing Solid State Drives (SSDs)?',
        optionA: 'SSDs are made of glass.',
        optionB: 'SSDs store data using non-magnetic flash memory cells (NAND flash) unaffected by magnetic fields; they must be Purged via Cryptographic Erase or physically Destroyed.',
        optionC: 'Degaussing only works on paper documents.',
        optionD: 'SSDs automatically delete data when powered off.',
        correctAnswer: 'B',
        rationale: 'Degaussers destroy magnetic media (tapes/HDDs) but have zero effect on semiconductor NAND flash memory.'
      },
      {
        questionNumber: 2,
        stem: 'Who holds legal accountability for determining the initial security classification and handling requirements of proprietary defense data?',
        optionA: 'The Data Custodian (Database Administrator).',
        optionB: 'The Data Owner / Information Owner.',
        optionC: 'The Hardware Maintenance Contractor.',
        optionD: 'The Building Security Guard.',
        correctAnswer: 'B',
        rationale: 'The Data Owner has ultimate accountability for classifying data and specifying protection controls; the Data Custodian merely implements them.'
      }
    ]
  },
  {
    certSlug: 'cissp',
    domainNumber: 3,
    title: 'Cryptographic Architecture & Public Key Infrastructure (PKI) Defense',
    scenarioText: 'A financial payment gateway processes credit card transactions. Security architects must design an end-to-end cryptographic infrastructure that guarantees Confidentiality, Integrity, Non-Repudiation, and Post-Quantum forward secrecy.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which cryptographic combination provides both message integrity and sender non-repudiation in electronic funds transfers?',
        optionA: 'Encrypting with a symmetric AES key only.',
        optionB: 'Hashing the transaction with SHA-256 and encrypting the resulting hash with the sender private key (Digital Signature).',
        optionC: 'Encoding data in Base64 format.',
        optionD: 'Sending plaintext over HTTP.',
        correctAnswer: 'B',
        rationale: 'A digital signature (hash encrypted with sender private key) guarantees data integrity and legally binds the sender, providing non-repudiation.'
      },
      {
        questionNumber: 2,
        stem: 'In a micro-segmented Zero Trust network, what protocol guarantees mutual cryptographic authentication between communicating microservices?',
        optionA: 'Unencrypted Telnet.',
        optionB: 'Mutual TLS (mTLS) with X.509 client and server certificates.',
        optionC: 'SNMP v1.',
        optionD: 'FTP with anonymous login.',
        correctAnswer: 'B',
        rationale: 'mTLS validates both client and server identities using dual X.509 digital certificates, ensuring encrypted and authenticated transport.'
      }
    ]
  },
  {
    certSlug: 'cissp',
    domainNumber: 4,
    title: 'Network Perimeter Defense & BGP Route Hijacking Mitigation',
    scenarioText: 'An international cryptocurrency exchange suffers a major traffic redirection attack when an adversary announces fraudulent BGP routes, diverting DNS queries and stealing $20M in wallet credentials over 2 hours.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which routing security standard prevents BGP route hijacking by cryptographically validating Autonomous System (AS) route announcements?',
        optionA: 'Static RIP routing.',
        optionB: 'Resource Public Key Infrastructure (RPKI) with Route Origin Authorization (ROA).',
        optionC: 'Disabling all routers.',
        optionD: 'Using WEP encryption on office Wi-Fi.',
        correctAnswer: 'B',
        rationale: 'RPKI uses cryptographic certificates to verify that an autonomous system is legitimately authorized to originate IP route prefixes.'
      },
      {
        questionNumber: 2,
        stem: 'At which layer of the OSI model does an IPsec VPN operate when encapsulating packets in Tunnel Mode?',
        optionA: 'Layer 7 (Application)',
        optionB: 'Layer 3 (Network)',
        optionC: 'Layer 2 (Data Link)',
        optionD: 'Layer 1 (Physical)',
        correctAnswer: 'B',
        rationale: 'IPsec operates at OSI Layer 3 (Network Layer), encrypting and encapsulating the entire original IP packet within a new IP header.'
      }
    ]
  },
  {
    certSlug: 'cissp',
    domainNumber: 5,
    title: 'Privileged Access Management (PAM) & Zero Trust Identity Governance',
    scenarioText: 'A global aerospace contractor discovers that a compromised domain administrator account was used to exfiltrate satellite telemetry. An audit reveals standing administrative privileges across 500 domain controllers without just-in-time elevation.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which Privileged Access Management (PAM) architecture BEST mitigates lateral movement from compromised administrative credentials?',
        optionA: 'Sharing a single root password on an internal wiki.',
        optionB: 'Ephemeral Just-In-Time (JIT) privilege elevation with hardware FIDO2 MFA, session recording, and automatic credential vaulting.',
        optionC: 'Allowing permanent domain admin rights for all developers.',
        optionD: 'Disabling all password expirations.',
        correctAnswer: 'B',
        rationale: 'JIT privilege elevation provides temporary, audited credentials only when required, eliminating permanent standing administrative attack surfaces.'
      },
      {
        questionNumber: 2,
        stem: 'Which authentication protocol standardizes passwordless biometric authentication across web browsers without sending credentials over the network?',
        optionA: 'Basic HTTP Auth',
        optionB: 'FIDO2 / WebAuthn with public key cryptography',
        optionC: 'PAP (Password Authentication Protocol)',
        optionD: 'Telnet login',
        correctAnswer: 'B',
        rationale: 'FIDO2 / WebAuthn utilizes device-bound asymmetric cryptographic keys and biometrics, providing complete phishing resistance.'
      }
    ]
  },
  {
    certSlug: 'cissp',
    domainNumber: 6,
    title: 'Security Assessment, Penetration Testing & Vulnerability Management',
    scenarioText: 'A healthcare software vendor prepares for SOC 2 Type II certification. Management commissions an independent red-team penetration test and automated SAST/DAST pipeline scan across its medical imaging portal.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What is the primary difference between a Vulnerability Assessment and a Penetration Test?',
        optionA: 'Vulnerability assessments are illegal; penetration testing is mandatory.',
        optionB: 'Vulnerability assessments identify and categorize potential weaknesses, whereas Penetration Tests actively exploit vulnerabilities to determine realistic business impact.',
        optionC: 'Vulnerability assessments are done by attackers; pen tests by internal staff.',
        optionD: 'There is no difference.',
        correctAnswer: 'B',
        rationale: 'Vulnerability assessments scan for flaws; penetration tests exploit discovered flaws to measure real-world defensive resilience and attack blast radius.'
      },
      {
        questionNumber: 2,
        stem: 'Which testing technique evaluates compiled binary applications during active runtime without access to underlying source code?',
        optionA: 'Static Application Security Testing (SAST).',
        optionB: 'Dynamic Application Security Testing (DAST) / Fuzzing.',
        optionC: 'Manual code architecture inspection.',
        optionD: 'Peer review meetings.',
        correctAnswer: 'B',
        rationale: 'DAST tests applications externally during execution (black-box), injecting malicious payloads to identify runtime vulnerabilities.'
      }
    ]
  },
  {
    certSlug: 'cissp',
    domainNumber: 8,
    title: 'Software Development Security & DevSecOps CI/CD Integration',
    scenarioText: 'A fintech unicorn migrates from waterfall development to automated DevSecOps CI/CD pipelines deploying code 50 times per day. Security leadership must shift security left without slowing down release velocity.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What is the primary objective of "Shifting Left" in the Software Development Life Cycle (SDLC)?',
        optionA: 'Moving all software developers to the left side of the building.',
        optionB: 'Integrating automated security testing (threat modeling, SAST, secret scanning) into the earliest phases of development to fix flaws at the lowest cost.',
        optionC: 'Deferring all security reviews until production release.',
        optionD: 'Eliminating QA testing entirely.',
        correctAnswer: 'B',
        rationale: 'Shifting left identifies vulnerabilities during coding and commit stages, where remediation is dramatically cheaper and faster than post-production fixes.'
      },
      {
        questionNumber: 2,
        stem: 'Which software supply chain security control protects CI/CD pipelines against malicious third-party dependency injection (e.g., SolarWinds/Log4j)?',
        optionA: 'Using default passwords on GitHub repositories.',
        optionB: 'Software Bill of Materials (SBOM) tracking, dependency vulnerability scanning, and cryptographic artifact signing (Sigstore/Cosign).',
        optionC: 'Never updating third-party libraries.',
        optionD: 'Allowing unverified public npm packages to run with root access.',
        correctAnswer: 'B',
        rationale: 'SBOMs provide transparent visibility into open-source components, while artifact signing verifies software provenance and integrity.'
      }
    ]
  },

  // =========================================================================
  // CRISC — DOMAINS 1, 3, 4
  // =========================================================================
  {
    certSlug: 'crisc',
    domainNumber: 1,
    title: 'Executive Risk Governance & Three Lines Model Failure',
    scenarioText: 'A regional bank failed a regulatory stress test because 1st Line operational managers were not conducting control testing, assuming the 2nd Line risk team was responsible for executing daily security controls.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under the IIA Three Lines Model, who holds primary operational responsibility for owning, identifying, and directly managing risks during day-to-day business activities?',
        optionA: 'External independent financial auditors.',
        optionB: '1st Line Operational Management and Business Process Owners.',
        optionC: 'The 3rd Line Internal Audit department.',
        optionD: 'The national news media.',
        correctAnswer: 'B',
        rationale: 'The 1st Line owns and directly manages operational risks and executes internal controls in routine business processes.'
      },
      {
        questionNumber: 2,
        stem: 'What is the primary function of the 2nd Line within an enterprise risk governance framework?',
        optionA: 'Performing independent financial statement sign-off.',
        optionB: 'Providing specialized risk management expertise, setting compliance policies, monitoring 1st Line risk execution, and establishing KRI thresholds.',
        optionC: 'Writing application source code.',
        optionD: 'Replacing the Board of Directors.',
        correctAnswer: 'B',
        rationale: 'The 2nd Line provides policy frameworks, guidance, compliance monitoring, and objective challenge to 1st Line risk management.'
      }
    ]
  },
  {
    certSlug: 'crisc',
    domainNumber: 3,
    title: 'Plan of Action and Milestones (POA&M) & Risk Register Governance',
    scenarioText: 'Following an external compliance audit, 45 high-risk deficiencies were identified in a global bank loan processing system. The Chief Risk Officer mandates the creation of a formal Risk Register and remediation tracking system.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What core information MUST be documented for each risk entry in an enterprise Risk Register?',
        optionA: 'The risk ID, description, risk owner, initial risk rating, treatment decision, remediation plan (POA&M), deadline, and residual risk rating.',
        optionB: 'Only the name of the software vendor.',
        optionC: 'The auditor salary history.',
        optionD: 'A list of computer brands used in the office.',
        correctAnswer: 'A',
        rationale: 'An actionable Risk Register requires complete traceability: ownership, severity ratings, treatment roadmaps, milestones, and residual risk tracking.'
      },
      {
        questionNumber: 2,
        stem: 'When a project team cannot remediate a critical vulnerability before the agreed deadline, who must review and approve the temporary risk exception?',
        optionA: 'The junior developer who created the bug.',
        optionB: 'The designated Business Risk Owner in consultation with the Risk Committee.',
        optionC: 'The external cafeteria contractor.',
        optionD: 'The building landlord.',
        correctAnswer: 'B',
        rationale: 'Risk exceptions require formal evaluation and sign-off by the accountable Business Risk Owner and risk oversight body.'
      }
    ]
  },
  {
    certSlug: 'crisc',
    domainNumber: 4,
    title: 'Automated Control Testing & Continuous Resilience Monitoring',
    scenarioText: 'A high-growth fintech company automates its SOX and PCI DSS compliance testing by replacing annual manual audit spreadsheets with continuous control monitoring (CCM) agents across its cloud database clusters.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'What is the primary advantage of Continuous Control Monitoring (CCM) over traditional periodic audits?',
        optionA: 'It eliminates the need to follow laws.',
        optionB: 'It provides real-time visibility into control failures, detects configuration drift instantly, and shortens the window of risk exposure.',
        optionC: 'It allows employees to bypass password requirements.',
        optionD: 'It reduces software execution speed.',
        correctAnswer: 'B',
        rationale: 'Continuous monitoring transforms audit from a backward-looking annual snapshot into active real-time assurance.'
      },
      {
        questionNumber: 2,
        stem: 'Which metric measures the maximum tolerable duration of data loss following an unplanned IT outage?',
        optionA: 'Recovery Time Objective (RTO)',
        optionB: 'Recovery Point Objective (RPO)',
        optionC: 'Mean Time Between Failures (MTBF)',
        optionD: 'Single Loss Expectancy (SLE)',
        correctAnswer: 'B',
        rationale: 'RPO defines the maximum acceptable age of data that must be recovered from backups (data loss tolerance).'
      }
    ]
  },

  // =========================================================================
  // COMPTIA CYSA+ — DOMAINS 2, 4, 5
  // =========================================================================
  {
    certSlug: 'cysa',
    domainNumber: 2,
    title: 'Endpoint Detection & Response (EDR) Behavioral Malware Containment',
    scenarioText: 'A zero-day obfuscated PowerShell script executes in memory on a financial executive workstation. The script attempts to dump LSASS process memory to harvest active Kerberos ticket-granting tickets (TGT).',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Why did traditional signature-based antivirus fail to alert on the obfuscated PowerShell payload?',
        optionA: 'Antivirus software is incompatible with Windows.',
        optionB: 'The attack was fileless and executed directly in volatile memory (RAM) with dynamic string obfuscation, bypassing static hash matching.',
        optionC: 'The computer was disconnected from power.',
        optionD: 'PowerShell cannot be inspected by any security tool.',
        correctAnswer: 'B',
        rationale: 'Fileless in-memory attacks do not write binary files to disk, requiring behavioral endpoint monitoring (EDR/AMSI) to intercept execution.'
      },
      {
        questionNumber: 2,
        stem: 'Which immediate action should the EDR agent automate upon detecting unauthorized LSASS memory scraping?',
        optionA: 'Send a calendar invitation to the attacker.',
        optionB: 'Terminate the malicious PowerShell process tree and isolate the endpoint from the corporate network at the kernel driver layer.',
        optionC: 'Format the hard drive without saving memory.',
        optionD: 'Increase screen brightness.',
        correctAnswer: 'B',
        rationale: 'Automated EDR host isolation and process termination halts credential theft while maintaining an encrypted telemetry channel to the SOC.'
      }
    ]
  },
  {
    certSlug: 'cysa',
    domainNumber: 4,
    title: 'Enterprise Volatility Memory Forensics & Network PCAP Analysis',
    scenarioText: 'A domain controller in a manufacturing enterprise is suspected of being beaconing to a known Cobalt Strike command-and-control server. The incident handler creates a raw memory dump using LiME / FTK Imager.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which open-source command-line framework is industry standard for analyzing volatile RAM artifacts (running processes, injected DLLs, network sockets)?',
        optionA: 'Notepad++',
        optionB: 'Volatility 3',
        optionC: 'VLC Media Player',
        optionD: 'Calculator',
        correctAnswer: 'B',
        rationale: 'Volatility is the premier memory forensics framework for dissecting kernel structures, process trees, and hidden memory injections.'
      },
      {
        questionNumber: 2,
        stem: 'When analyzing the corresponding network packet capture in Wireshark, which display filter isolates all DNS queries transmitting anomalous TXT records?',
        optionA: 'http.request',
        optionB: 'dns.qry.type == 16',
        optionC: 'arp.opcode == 1',
        optionD: 'icmp.type == 8',
        correctAnswer: 'B',
        rationale: 'In Wireshark, DNS query type 16 corresponds specifically to TXT records, frequently utilized for DNS data exfiltration and C2 beaconing.'
      }
    ]
  },
  {
    certSlug: 'cysa',
    domainNumber: 5,
    title: 'PCI DSS 4.0 Cardholder Data Environment (CDE) Audit Remediation',
    scenarioText: 'A retail payment gateway is audited under PCI DSS 4.0. Auditors discover that developers have access to production cardholder databases and network vulnerability scans are conducted only once per year.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under PCI DSS Requirement 11, what is the mandatory frequency for performing external vulnerability scans by an Approved Scanning Vendor (ASV)?',
        optionA: 'Every 5 years.',
        optionB: 'At least once every 90 days (quarterly) and after any significant network change.',
        optionC: 'Only after a reported credit card breach.',
        optionD: 'Once during corporate founding.',
        correctAnswer: 'B',
        rationale: 'PCI DSS strictly mandates quarterly (every 90 days) ASV vulnerability scans and immediate re-scans after significant architecture modifications.'
      },
      {
        questionNumber: 2,
        stem: 'Which architectural strategy reduces PCI DSS audit scope by removing plaintext credit card numbers from internal server storage?',
        optionA: 'Storing credit cards in Excel spreadsheets.',
        optionB: 'Credit card Tokenization with an external PCI-certified token vault.',
        optionC: 'Renaming the database table to hide it.',
        optionD: 'Writing card numbers on sticky notes.',
        correctAnswer: 'B',
        rationale: 'Tokenization replaces sensitive primary account numbers (PAN) with non-sensitive surrogate tokens, taking internal systems out of PCI audit scope.'
      }
    ]
  },

  // =========================================================================
  // FIFA FOOTBALL AGENT — DOMAINS 3, 4, 5
  // =========================================================================
  {
    certSlug: 'fifa-agent',
    domainNumber: 3,
    title: 'Match-Fixing Prevention & Disciplinary Sanctions Enforcement',
    scenarioText: 'An international football agent represents a goalkeeper in a European league. The agent is approached by an illegal gambling syndicate offering €100,000 to instruct the player to concede early goals. The agent rejects the bribe but decides not to report the encounter to authorities.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under Article 27 and Article 18 of the FIFA Code of Ethics, did the agent commit a regulatory offense by failing to report the approach?',
        optionA: 'No, because the agent rejected the bribe and did not participate in betting.',
        optionB: 'Yes, because bound persons have a mandatory duty to immediately report any match-manipulation approach or integrity breach to the FIFA Secretariat.',
        optionC: 'No, reporting is purely optional.',
        optionD: 'No, unless the match was televised internationally.',
        correctAnswer: 'B',
        rationale: 'Article 18/27 of the FIFA Code of Ethics establishes a strict duty of reporting; failure to disclose an approach constitutes an independent violation subject to sanctions.'
      },
      {
        questionNumber: 2,
        stem: 'What maximum sanction may the FIFA Disciplinary Committee impose on an agent found guilty of match-fixing involvement?',
        optionA: 'A warning letter.',
        optionB: 'A heavy monetary fine and a lifetime worldwide ban from conducting any football-related activities.',
        optionC: 'Mandatory attendance at 5 football matches.',
        optionD: 'A 1-week suspension.',
        correctAnswer: 'B',
        rationale: 'Match manipulation carries the most severe disciplinary penalties under FIFA rules, including lifetime worldwide bans and substantial financial penalties.'
      }
    ]
  },
  {
    certSlug: 'fifa-agent',
    domainNumber: 4,
    title: 'FIFA Clearing House Payment Processing & TPO Circumvention Dispute',
    scenarioText: 'A French club transfers a midfielder to an Italian club for €20,000,000. An agent submits an invoice for €3,000,000 (15%) claiming additional scouting fees directly to the player bank account to bypass the FIFA Clearing House and fee caps.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'How will the FIFA Clearing House (FCH) and Compliance Division treat the agent direct invoice and fee structure?',
        optionA: 'Approve the transaction immediately.',
        optionB: 'Reject the invoice for violating the statutory fee cap (max 10% for releasing club / 3% for player) and violating mandatory FCH payment routing rules.',
        optionC: 'Allow the fee if paid in gold bullion.',
        optionD: 'Ignore the transaction because both clubs are in the EU.',
        correctAnswer: 'B',
        rationale: 'All agent service fees in international transfers must flow through FCH and adhere strictly to statutory fee caps; reclassifying fees to circumvent caps is strictly illegal.'
      },
      {
        questionNumber: 2,
        stem: 'Under RSTP Article 18ter, what constitutes prohibited Third-Party Ownership (TPO)?',
        optionA: 'A club owning its stadium.',
        optionB: 'Any agreement where a third party acquires the right to participate, in whole or in part, in compensation payable in relation to future player transfers.',
        optionC: 'A player hiring an accountant.',
        optionD: 'A club purchasing sports drinks from a vendor.',
        correctAnswer: 'B',
        rationale: 'Article 18ter bans all third-party economic rights and investment schemes in player transfer valuations.'
      }
    ]
  },
  {
    certSlug: 'fifa-agent',
    domainNumber: 5,
    title: 'CAS Lausanne Arbitration & Minor Safeguarding Violation',
    scenarioText: 'An unlicensed intermediary in South America charges a 15-year-old player family $15,000 promising an academy contract in Europe. When the contract fails to materialize, the family files a complaint before the Football Tribunal.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Under FFAR Article 13, what is the statutory rule regarding charging commission or fees to a minor player?',
        optionA: 'Agents may charge minors up to 20% of their future earnings.',
        optionB: 'No service fee or remuneration may be charged or received by an agent for services rendered to a minor unless the minor is signing a professional contract.',
        optionC: 'Agents can charge minors unlimited upfront trial fees.',
        optionD: 'Minors must pay double the adult commission rate.',
        correctAnswer: 'B',
        rationale: 'FFAR Article 13 strictly prohibits extracting fees from minor players or families for academy trials or non-professional representation.'
      },
      {
        questionNumber: 2,
        stem: 'If the intermediary appeals a ruling of the FIFA Football Tribunal, within how many days must the statement of appeal be filed with the Court of Arbitration for Sport (CAS)?',
        optionA: '90 days',
        optionB: '21 days from receipt of the reasoned decision.',
        optionC: '5 years',
        optionD: '24 hours',
        correctAnswer: 'B',
        rationale: 'FIFA Statutes and CAS Code dictate that appeals against final decisions must be lodged with CAS in Lausanne within 21 calendar days.'
      }
    ]
  },

  // =========================================================================
  // AWS SAA-C03 — DOMAINS 1, 3, 4
  // =========================================================================
  {
    certSlug: 'aws-csaa',
    domainNumber: 1,
    title: 'Zero Trust Cloud Architecture, IAM Delegation & AWS WAF Defense',
    scenarioText: 'A financial analytics SaaS provider deploys a multi-account AWS organization. An external API experiences automated SQL injection probes and brute-force credential stuffing. The Solutions Architect must design a defense-in-depth security perimeter.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which AWS edge security service inspects incoming HTTP/HTTPS traffic to block SQL injection and rate-limit credential stuffing attacks?',
        optionA: 'AWS Direct Connect',
        optionB: 'AWS WAF (Web Application Firewall) with managed rule sets and rate-based rules attached to CloudFront or Application Load Balancer.',
        optionC: 'Amazon S3 Glacier',
        optionD: 'AWS Snowcone',
        correctAnswer: 'B',
        rationale: 'AWS WAF inspects HTTP headers, query strings, and body payloads at the edge, blocking SQLi/XSS and mitigating DDoS brute force.'
      },
      {
        questionNumber: 2,
        stem: 'When granting EC2 instances access to read objects from an Amazon S3 bucket, which IAM mechanism adheres to the principle of least privilege without storing long-term credentials on disk?',
        optionA: 'Hardcoding root IAM access keys in application configuration files.',
        optionB: 'Assigning an IAM Role with an IAM Instance Profile that automatically rotates temporary STS credentials.',
        optionC: 'Making the S3 bucket publicly readable by everyone.',
        optionD: 'Disabling all IAM policies.',
        correctAnswer: 'B',
        rationale: 'IAM Roles for EC2 leverage temporary Security Token Service (STS) credentials, eliminating risky hardcoded access keys.'
      }
    ]
  },
  {
    certSlug: 'aws-csaa',
    domainNumber: 3,
    title: 'High-Throughput Distributed Microservices Caching with Redis & EFS',
    scenarioText: 'An e-commerce mobile application experiences severe database bottlenecks during Black Friday, generating 100,000 read requests per second on MySQL. Concurrent batch image workers across 500 EC2 instances also need shared file system access.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which caching strategy should be implemented to offload 90% of repeated read traffic from the relational database?',
        optionA: 'Writing queries to flat text files on EC2 instance store.',
        optionB: 'Deploying Amazon ElastiCache for Redis in Cluster Mode with Multi-AZ replication.',
        optionC: 'Increasing database EBS volume size only.',
        optionD: 'Rebooting the database every 10 minutes.',
        correctAnswer: 'B',
        rationale: 'Amazon ElastiCache Redis provides sub-millisecond in-memory caching, absorbing read spikes and offloading relational database engines.'
      },
      {
        questionNumber: 2,
        stem: 'Which AWS storage service provides a POSIX-compliant file system accessible concurrently by hundreds of EC2 instances across multiple Availability Zones?',
        optionA: 'Amazon Elastic Block Store (EBS gp3)',
        optionB: 'Amazon Elastic File System (EFS)',
        optionC: 'Amazon S3 Glacier Flexible Archive',
        optionD: 'AWS Storage Gateway Tape Gateway',
        correctAnswer: 'B',
        rationale: 'Amazon EFS provides a managed NFS file system that mounts concurrently across thousands of instances and multiple AZs.'
      }
    ]
  },
  {
    certSlug: 'aws-csaa',
    domainNumber: 4,
    title: 'Enterprise Petabyte-Scale S3 Lifecycle Cost Optimization',
    scenarioText: 'A media conglomerate stores 5 Petabytes of raw video files on Amazon S3. Videos are accessed heavily during the first 30 days, rarely for the next 90 days, and must be retained for 7 years for legal compliance without active access.',
    sortOrder: 1,
    questions: [
      {
        questionNumber: 1,
        stem: 'Which S3 Lifecycle policy configuration optimizes storage costs while fulfilling legal compliance?',
        optionA: 'Keep all 5 PB in S3 Standard forever.',
        optionB: 'Transition objects to S3 Standard-IA after 30 days, transition to S3 Glacier Flexible after 90 days, transition to S3 Glacier Deep Archive after 180 days, and expire after 7 years.',
        optionC: 'Delete all video files after 24 hours.',
        optionD: 'Download all files to employee laptops.',
        correctAnswer: 'B',
        rationale: 'Lifecycle tiering moves aging objects to lower-cost storage classes (Glacier Deep Archive is ~$0.00099/GB/month), reducing annual storage costs by over 80%.'
      },
      {
        questionNumber: 2,
        stem: 'For fault-tolerant containerized batch video rendering workloads, which EC2 pricing model delivers up to 90% cost savings compared to On-Demand rates?',
        optionA: 'Dedicated Hosts',
        optionB: 'EC2 Spot Instances',
        optionC: 'On-Demand Multi-Year Standard Instances',
        optionD: 'Outposts on-premises leasing',
        correctAnswer: 'B',
        rationale: 'Spot Instances utilize spare EC2 capacity at steep discounts (up to 90%), ideal for stateless, fault-tolerant batch workloads.'
      }
    ]
  }
];

async function seedAllCaseStudies() {
  await client.connect();
  console.log('=== SEEDING ALL REMAINING CASE STUDIES ACROSS ALL 12 CERTS ===\n');

  let insertedCS = 0;
  let insertedQ = 0;

  for (const cs of COMPLETE_COVERAGE_CASE_STUDIES) {
    const certRes = await client.query('SELECT id FROM certifications WHERE slug = $1', [cs.certSlug]);
    const certId = certRes.rows[0]?.id;

    if (!certId) {
      console.log(`⚠️ Certification not found for slug ${cs.certSlug}`);
      continue;
    }

    const domRes = await client.query(
      'SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2',
      [certId, cs.domainNumber]
    );
    const domainId = domRes.rows[0]?.id;

    if (!domainId) {
      console.log(`⚠️ Domain ${cs.domainNumber} not found for ${cs.certSlug}`);
      continue;
    }

    // Check if case study title already exists in this domain
    const existing = await client.query(
      'SELECT id FROM case_studies WHERE domain_id = $1 AND title = $2',
      [domainId, cs.title]
    );

    let csId;
    if (existing.rows.length > 0) {
      csId = existing.rows[0].id;
      await client.query('UPDATE case_studies SET scenario_text = $1 WHERE id = $2', [cs.scenarioText, csId]);
      await client.query('DELETE FROM case_study_questions WHERE case_study_id = $1', [csId]);
    } else {
      csId = uuidv4();
      await client.query(`
        INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
        VALUES ($1, $2, $3, $4, $5);
      `, [csId, domainId, cs.title, cs.scenarioText, cs.sortOrder]);
      insertedCS++;
    }

    for (const q of cs.questions) {
      await client.query(`
        INSERT INTO case_study_questions (
          id, case_study_id, question_number, stem, option_a, option_b,
          option_c, option_d, correct_answer, rationale, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        uuidv4(), csId, q.questionNumber, q.stem, q.optionA, q.optionB,
        q.optionC, q.optionD, q.correctAnswer, q.rationale, q.questionNumber
      ]);
      insertedQ++;
    }

    console.log(`✓ [${cs.certSlug.toUpperCase()}] Ingested/Enriched Case Study for Domain ${cs.domainNumber}: ${cs.title} (${cs.questions.length} questions)`);
  }

  console.log(`\n========================================================================================`);
  console.log(`SUCCESSFULLY INGESTED / ENRICHED CASE STUDIES AND SCENARIO QUESTIONS!`);
  console.log(`========================================================================================\n`);

  await client.end();
}

seedAllCaseStudies().catch(console.error);
