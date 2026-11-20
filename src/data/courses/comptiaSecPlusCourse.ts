/* ===================================================================
   ANOXPASS — CompTIA Security+ (SY0-701) End-to-End Course
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const COMPTIA_SEC_PLUS_COURSE: CertificationCourse = {
  certId: 'comptia-security-plus',
  certCode: 'SECURITY+',
  title: 'CompTIA Security+ (SY0-701)',
  provider: 'CompTIA',
  tier: 2,
  tagline: 'Master Zero Trust, cryptography, threats, architecture, SecOps, and GRC.',
  estimatedTotalHours: 70,
  passingScore: '750 / 900',
  domains: [
    {
      id: 'sec-d1',
      domainNumber: 1,
      title: 'General Security Concepts & Cryptography',
      examWeightPercent: 12,
      overview: 'Master Zero Trust architecture, PKI, symmetric vs asymmetric encryption, and hashing.',
      lessons: [
        {
          id: 'sec-d1-l1',
          title: 'Zero Trust Architecture & Applied PKI / Cryptography',
          estimatedMinutes: 40,
          summary: 'Apply Zero Trust (Control Plane + Data Plane) and select the right cryptographic primitives for confidentiality, integrity, and identity.',
          learningObjectives: [
            'Explain Zero Trust Policy Engine, Policy Administrator, and Policy Enforcement Point',
            'Differentiate AES, RSA/ECC, SHA-256, HMAC, and X.509 digital certificates',
            'Understand OCSP stapling, CRLs, and Perfect Forward Secrecy (ECDHE)',
          ],
          coreConcepts: [
            {
              heading: 'PKI & Certificate Trust Chain',
              explanation:
                'A Certificate Authority (CA) signs an X.509 certificate binding a public key to an identity. Browsers verify the CA signature and check revocation via CRL or OCSP stapling.',
              mentalModel: 'CA = Passport Office; X.509 Cert = Passport; OCSP = Live border check.',
            },
          ],
          realWorldScenario: {
            title: 'Preventing Past Traffic Decryption',
            situation: 'An adversary captures TLS traffic today hoping to steal the server’s RSA private key later.',
            analysis: 'Using Ephemeral Diffie-Hellman (ECDHE) provides Perfect Forward Secrecy (PFS), generating unique session keys that cannot be derived from the server’s long-term private key.',
            takeaway: 'Always enable TLS 1.3 with ECDHE for PFS.',
          },
          examTraps: [
            'Salt + slow hash (Argon2/bcrypt) protects stored passwords against rainbow tables and brute force—NEVER encrypt passwords with reversible AES.',
          ],
          keyTerms: [
            { term: 'PEP (Policy Enforcement Point)', definition: 'Zero Trust gateway that enables, monitors, and terminates connections.' },
            { term: 'HSM', definition: 'Hardware Security Module—tamper-resistant appliance for generating and protecting cryptographic keys.' },
          ],
          conceptChecks: [
            {
              id: 'sec-d1-l1-q1',
              question: 'Which mechanism ensures that compromising a server’s long-term private key will NOT decrypt previously recorded TLS sessions?',
              options: ['AES-256-CBC', 'Perfect Forward Secrecy (ECDHE)', 'OCSP Stapling', 'SHA-512'],
              correctIndex: 1,
              rationale: 'ECDHE generates ephemeral per-session keys, guaranteeing Perfect Forward Secrecy.',
            },
          ],
          practicalDrill: {
            title: 'Crypto Primitive Selector',
            prompt: 'Select the right algorithm for: 1) Full-disk encryption, 2) Password storage, 3) API message integrity + auth.',
            steps: ['1) AES-256, 2) Argon2/bcrypt with salt, 3) HMAC-SHA256.'],
            successCriteria: 'All 3 matched accurately.',
          },
          flashcards: [
            { front: 'Best way to store user passwords?', back: 'Unique per-user random salt + slow key-stretching hash (Argon2id or bcrypt).', tag: 'SEC+-D1' },
          ],
          sourceRefs: ['my_documents/CompTIA Cybersecurit 2017.pdf'],
        },
      ],
    },
    {
      id: 'sec-d2',
      domainNumber: 2,
      title: 'Threats, Vulnerabilities, Architecture & SecOps',
      examWeightPercent: 68,
      overview: 'Defend against social engineering, OWASP web attacks, malware, and lead SOC/IR operations.',
      lessons: [
        {
          id: 'sec-d2-l1',
          title: 'Web Attacks (SQLi, XSS, CSRF), IAM Federation & Incident Response',
          estimatedMinutes: 45,
          summary: 'Identify and remediate OWASP Top 10 flaws, configure SAML/OIDC/OAuth2 federation, and triage SIEM alerts.',
          learningObjectives: [
            'Remediate SQL Injection (parameterized queries), XSS (output encoding + CSP), and CSRF (anti-CSRF tokens)',
            'Distinguish SAML 2.0 (XML enterprise SSO), OAuth 2.0 (authorization), and OIDC (authentication)',
            'Apply containment, chain of custody, and order of volatility in IR',
          ],
          coreConcepts: [
            {
              heading: 'OWASP Defense Cheatsheet',
              explanation:
                'SQL Injection -> Prepared Statements / Parameterized Queries. Cross-Site Scripting (XSS) -> Context-aware Output Encoding + Content Security Policy (CSP). Buffer Overflow -> Memory-safe languages, ASLR, DEP.',
              formulaOrRule: 'Order of Volatility: CPU Registers/Cache -> RAM -> Swap/Network -> Disk -> Backups.',
            },
          ],
          realWorldScenario: {
            title: 'Detecting SQL Injection in Web Logs',
            situation: 'WAF logs show `GET /login?user=admin%27%20OR%201=1--`.',
            analysis: 'Classic SQLi authentication bypass attempt. Block at WAF immediately (short-term) and refactor backend to parameterized queries (root-cause fix).',
            takeaway: 'WAF is a compensating control; parameterized queries fix the root cause.',
          },
          examTraps: [
            'OAuth 2.0 is for AUTHORIZATION (delegated access); OpenID Connect (OIDC) adds AUTHENTICATION on top of OAuth 2.0.',
          ],
          keyTerms: [
            { term: 'SOAR', definition: 'Security Orchestration, Automation, and Response—automates repetitive IR playbooks.' },
            { term: 'Chain of Custody', definition: 'Chronological documentation of everyone who handled forensic evidence.' },
          ],
          conceptChecks: [
            {
              id: 'sec-d2-l1-q1',
              question: 'What is the MOST effective root-cause fix to prevent SQL Injection in a web application?',
              options: ['Deploy a WAF', 'Use parameterized queries / prepared statements', 'Disable cookies', 'Enable HTTPS'],
              correctIndex: 1,
              rationale: 'Parameterized queries strictly separate SQL code from user-supplied data.',
            },
          ],
          practicalDrill: {
            title: 'Attack Log Identifier',
            prompt: 'Classify 3 log snippets: `<script>alert(1)</script>`, `../../etc/passwd`, and `OR 1=1--`.',
            steps: ['XSS, Directory/Path Traversal, SQL Injection.'],
            successCriteria: '100% accurate identification and remediation.',
          },
          flashcards: [
            { front: 'OAuth 2.0 vs OIDC?', back: 'OAuth 2.0 = Authorization (access tokens). OIDC = Authentication (ID tokens) built on OAuth 2.0.', tag: 'SEC+-D2' },
          ],
          sourceRefs: ['my_documents/cybersecurity-incident-management-guide-EN.pdf'],
        },
      ],
    },
    {
      id: 'sec-d3',
      domainNumber: 3,
      title: 'Security Program Management & Oversight',
      examWeightPercent: 20,
      overview: 'Master risk assessments (ALE/SLE/ARO), third-party vendor risk, compliance, and audits.',
      lessons: [
        {
          id: 'sec-d3-l1',
          title: 'Quantitative Risk Analysis (ALE/SLE/ARO) & Vendor Governance',
          estimatedMinutes: 35,
          summary: 'Compute financial risk exposure and govern third-party vendors with SLAs, NDAs, MSAs, and SOC 2 reports.',
          learningObjectives: [
            'Calculate SLE = Asset Value × Exposure Factor, and ALE = SLE × ARO',
            'Select appropriate vendor agreements (SLA, NDA, BAA, MOU, ISA)',
          ],
          coreConcepts: [
            {
              heading: 'Quantitative Risk Math',
              explanation:
                'Single Loss Expectancy (SLE) = Asset Value (AV) × Exposure Factor (EF). Annualized Loss Expectancy (ALE) = SLE × Annualized Rate of Occurrence (ARO). A control is cost-effective if Annual Control Cost < (ALE_before − ALE_after).',
              formulaOrRule: 'ALE = AV × EF × ARO',
            },
          ],
          realWorldScenario: {
            title: 'Justifying a $15,000 DDoS Protection Service',
            situation: 'An e-commerce site valued at $100,000 loses 50% availability during a DDoS attack occurring twice a year.',
            analysis: 'SLE = $100k × 0.5 = $50k. ALE = $50k × 2 = $100k/year. Paying $15k/year saves $85k/year—clear ROI.',
            takeaway: 'Never spend more on a control than the annualized loss it prevents.',
          },
          examTraps: [
            'SOC 2 Type II evaluates control effectiveness OVER A PERIOD OF TIME; Type I is only a point-in-time design snapshot.',
          ],
          keyTerms: [
            { term: 'BAA', definition: 'Business Associate Agreement—mandatory HIPAA contract for third parties handling PHI.' },
            { term: 'ALE', definition: 'Annualized Loss Expectancy = SLE × ARO.' },
          ],
          conceptChecks: [
            {
              id: 'sec-d3-l1-q1',
              question: 'An asset is worth $200,000, Exposure Factor is 25%, and ARO is 0.5 (once every 2 years). What is the ALE?',
              options: ['$25,000', '$50,000', '$100,000', '$12,500'],
              correctIndex: 0,
              rationale: 'SLE = $200,000 × 0.25 = $50,000. ALE = $50,000 × 0.5 = $25,000.',
            },
          ],
          practicalDrill: {
            title: 'Vendor Agreement Matcher',
            prompt: 'Match SLA, BAA, NDA, and SOC 2 Type II to their exact procurement use case.',
            steps: ['Uptime guarantees -> SLA', 'Healthcare PHI -> BAA', 'Confidentiality -> NDA', 'Ongoing control assurance -> SOC 2 Type II.'],
            successCriteria: '100% accurate matching.',
          },
          flashcards: [
            { front: 'Formula for ALE?', back: 'ALE = SLE × ARO, where SLE = Asset Value × Exposure Factor.', tag: 'SEC+-D3' },
          ],
          sourceRefs: ['my_documents/CompTIA Cybersecurit 2017.pdf'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Enterprise Zero Trust & SecOps Modernization',
    scenario: 'A mid-size SaaS company suffered a phishing-led credential theft and SQLi breach.',
    tasks: [
      'Design a phishing-resistant MFA + OIDC SSO rollout.',
      'Specify SQLi remediation + SIEM/SOAR detection rules.',
      'Calculate ALE to justify the security budget to the CFO.',
    ],
    modelSolution: 'Deploy FIDO2/WebAuthn MFA + OIDC SSO, refactor APIs to parameterized queries + CSP, centralize logs into SIEM with automated SOAR account-lockout playbooks, and present ALE reduction ROI.',
  },
  examStrategy: {
    examFormat: 'Up to 90 questions (MCQ + PBQs), 90 minutes.',
    timeManagementPlan: 'Skip PBQs initially, crush MCQs in 55 minutes, then return to PBQs with 35 minutes left.',
    mindsetRules: [
      'Know your acronyms cold—CompTIA loves acronym-heavy answer choices.',
      'Always distinguish BEST/MOST effective root-cause fixes from temporary workarounds.',
    ],
    finalWeekChecklist: [
      'Review OWASP Top 10, PKI/Crypto, and ALE/SLE math',
      'Practice reading firewall ACLs and web/SIEM logs',
      'Score >= 85% on 3 timed 90-question mocks',
    ],
  },
};
