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

const BATCH2_GLOSSARY = {
  'ccsp': [
    { term: 'Cloud Access Security Broker (CASB)', definition: 'On-premises or cloud-hosted security policy enforcement point placed between cloud consumers and cloud service providers.' },
    { term: 'Data Loss Prevention (DLP)', definition: 'A suite of technologies designed to prevent sensitive data from leaving the corporate boundary via endpoint, network, or cloud storage.' },
    { term: 'Data Sanitization (NIST SP 800-88)', definition: 'The process of rendering access to target data on media infeasible for a given level of effort (Clear, Purge, Destroy).' },
    { term: 'Cryptographic Erase (CE)', definition: 'Sanitizing data by securely deleting or zeroizing the decryption key that encrypts the target storage media.' },
    { term: 'Data Discovery', definition: 'Automated scanning techniques (metadata, classification labels, content inspection) used to find and catalog sensitive enterprise data.' },
    { term: 'Micro-segmentation', definition: 'A network security technique enabling fine-grained security policies assigned to individual data center and cloud workloads.' },
    { term: 'API Gateway', definition: 'An architectural component acting as a single entry point for API clients, managing routing, rate limiting, and mTLS authentication.' },
    { term: 'Federated Identity Management (FIdM)', definition: 'An arrangement enabling subscribers to use the same identification data to gain access across multiple enterprise security domains.' },
    { term: 'SAML 2.0 (Security Assertion Markup Language)', definition: 'An XML-based standard for exchanging authentication and authorization data between identity providers and service providers.' },
    { term: 'OpenID Connect (OIDC)', definition: 'An identity layer built on top of the OAuth 2.0 protocol enabling client applications to verify the identity of an end user.' },
    { term: 'SCIM (System for Cross-domain Identity Management)', definition: 'An open standard protocol for automating the exchange of user identity information and provisioning across cloud domains.' },
    { term: 'Data Sovereignty', definition: 'The legal principle that digital data is subject to the statutory laws and jurisdiction of the geographic country in which it is collected or stored.' }
  ],
  'cgeit': [
    { term: 'IT Governance Charter', definition: 'A founding enterprise document establishing the authority, composition, and decision rights of the IT governance structure.' },
    { term: 'Enterprise Architecture (EA)', definition: 'The conceptual blueprint defining the structure and operation of an enterprise, aligning business strategy with IT capabilities (TOGAF).' },
    { term: 'Total Cost of Ownership (TCO)', definition: 'A comprehensive financial estimate of all direct and indirect costs associated with acquiring, deploying, operating, and retiring an IT asset.' },
    { term: 'Net Present Value (NPV)', definition: 'The difference between the present value of cash inflows and outflows discounted at a specified rate over an investment lifecycle.' },
    { term: 'Internal Rate of Return (IRR)', definition: 'The discount rate at which the Net Present Value (NPV) of all cash flows from an IT-enabled investment equals zero.' },
    { term: 'Stage-Gate Review Process', definition: 'A project governance mechanism dividing large initiatives into stages separated by formal decision gates where continuation is approved or denied.' },
    { term: 'RACI Matrix', definition: 'A responsibility assignment matrix clarifying roles: Responsible (R), Accountable (A), Consulted (C), and Informed (I).' },
    { term: 'SFIA (Skills Framework for the Information Age)', definition: 'A globally recognized framework defining the professional skills and competencies required by IT professionals.' },
    { term: 'IT Service Level Agreement (SLA)', definition: 'A formally negotiated contract between a service provider and customer defining specific measurable service level expectations and remedies.' },
    { term: 'Continuous Improvement (PDCA)', definition: 'The iterative four-step management method: Plan, Do, Check, Act, driving continuous quality enhancement.' }
  ],
  'crisc': [
    { term: 'Risk Aggregation', definition: 'The process of combining individual risk scores across multiple operational units to evaluate total enterprise exposure.' },
    { term: 'Risk Culture', definition: 'The shared values, beliefs, knowledge, and behaviors regarding risk management exhibited by employees across an organization.' },
    { term: 'Monte Carlo Simulation', definition: 'A mathematical quantitative modeling technique calculating the probability distribution of risk outcomes through thousands of randomized trials.' },
    { term: 'Threat Event Frequency (TEF)', definition: 'The estimated rate at which a threat agent attempts to exploit an asset vulnerability within a defined time period.' },
    { term: 'Vulnerability Severity', definition: 'A measure of the ease of exploitation and magnitude of damage resulting from a specific system flaw.' },
    { term: 'Business Continuity Plan (BCP)', definition: 'A documented operational strategy detailing procedures to sustain critical business operations during and after a disaster.' },
    { term: 'Disaster Recovery Plan (DRP)', definition: 'A documented technical procedure for restoring IT infrastructure, data centers, networks, and databases following a catastrophic outage.' },
    { term: 'Tabletop Exercise (TTX)', definition: 'A structured discussion-based simulation where key stakeholders walk through simulated incident scenarios without live disruption.' },
    { term: 'Crisis Management Team (CMT)', definition: 'Executive leadership convened during high-severity emergencies to manage communication, legal liability, and brand reputation.' },
    { term: 'Audit Finding Remediation', definition: 'The formal process of correcting internal control deficiencies identified during external or internal audit engagements.' }
  ],
  'cysa': [
    { term: 'Threat Hunting', definition: 'A proactive, hypothesis-driven analytical search through networks and endpoints to detect latent threats that evaded automated security tools.' },
    { term: 'Behavioral Analytics (UEBA)', definition: 'User and Entity Behavior Analytics software modeling baseline behavioral patterns to detect anomalous deviations.' },
    { term: 'Memory Dump (RAM Acquisition)', definition: 'The process of capturing the complete volatile memory contents of a target system for offline digital forensics.' },
    { term: 'Wireshark PCAP', definition: 'A packet capture file containing raw network frame headers and payloads recorded during network sniffing.' },
    { term: 'NetFlow / IPFIX', definition: 'Network protocol telemetry providing summary metadata (source, destination, port, bytes) without recording full packet payloads.' },
    { term: 'YARA Rule', definition: 'A pattern-matching rule syntax used by malware researchers to classify and identify malware families based on textual or binary signatures.' },
    { term: 'Sigma Rule', definition: 'A generic, open signature format for describing log events, translatable into diverse SIEM query languages.' },
    { term: 'MITRE D3FEND', definition: 'A complementary matrix to ATT&CK cataloging defensive cybersecurity countermeasures and architectural hardening techniques.' },
    { term: 'Kernel Rootkit', definition: 'Malicious software executing at Ring 0 with kernel privileges, capable of subverting operating system APIs and hiding from security tools.' },
    { term: 'Command and Control (C2)', definition: 'The infrastructure and communication channels maintained by adversaries to remotely control compromised botnets or implants.' },
    { term: 'Data Exfiltration', definition: 'The unauthorized illicit copying, transfer, or retrieval of confidential data from an enterprise network by an adversary.' },
    { term: 'Zero-Day Vulnerability', definition: 'A software flaw unknown to the vendor or without an available security patch, leaving systems exposed to active exploitation.' }
  ],
  'fifa-agent': [
    { term: 'International Transfer Certificate (ITC)', definition: 'A mandatory electronic document issued via FIFA TMS authorizing the registration of an internationally transferred player.' },
    { term: 'Transfer Matching System (TMS)', definition: 'FIFA mandatory web-based data system designed to ensure football authorities have transparency over international transfers.' },
    { term: 'Electronic Player Passport (EPP)', definition: 'An automated electronic record detailing a player complete career and registration history from age 12 onward.' },
    { term: 'FIFA Guardians Safeguarding Officer', definition: 'A designated certified individual within an MAs or club responsible for child welfare and safeguarding compliance.' },
    { term: 'Minor Player (Article 19 RSTP)', definition: 'A football player who has not yet reached the age of 18; international transfers are strictly banned except under narrow exceptions.' },
    { term: 'Unilateral Contract Termination', definition: 'The termination of an employment contract by one party without mutual consent or just cause, triggering compensation.' },
    { term: 'Just Cause (RSTP Article 14)', definition: 'Valid legal grounds for terminating a contract without financial penalty (e.g., non-payment of salary for 2+ consecutive months).' },
    { term: 'Sporting Just Cause (Article 15)', definition: 'Grounds for an established player who appeared in fewer than 10% of official matches to terminate their contract at season end.' },
    { term: 'Buyout Clause (Release Clause)', definition: 'A contractual clause in a player agreement specifying a predetermined financial sum upon payment of which the contract is terminated.' },
    { term: 'Football Agent Examination', definition: 'The official periodic licensing test administered worldwide by FIFA assessing knowledge of FFAR, RSTP, Statutes, and Ethics.' },
    { term: 'FIFA Clearing House Compliance Assessment', definition: 'Mandatory anti-money laundering and background verification conducted on agents and clubs before funds disbursement.' },
    { term: 'Continuing Professional Development (CPD)', definition: 'Mandatory annual educational credits licensed football agents must complete through the FIFA Agent Platform to retain licensure.' }
  ],
  'aws-csaa': [
    { term: 'VPC Peering', definition: 'A networking connection between two Virtual Private Clouds (VPCs) enabling routing using private IPv4/IPv6 addresses without public transit.' },
    { term: 'AWS Transit Gateway', definition: 'A network transit hub interconnecting thousands of VPCs and on-premises networks into a unified mesh architecture.' },
    { term: 'Application Load Balancer (ALB)', definition: 'A Layer 7 load balancer routing HTTP/HTTPS traffic based on advanced request parameters (path, host header, query strings).' },
    { term: 'Network Load Balancer (NLB)', definition: 'An ultra-low latency Layer 4 load balancer capable of handling millions of requests per second at TCP, UDP, and TLS levels.' },
    { term: 'Amazon S3 Standard-IA', definition: 'Storage class for data accessed less frequently but requiring millisecond rapid retrieval when needed, at lower storage cost.' },
    { term: 'Amazon S3 One Zone-IA', definition: 'Lower-cost storage class for infrequently accessed data stored in a single Availability Zone (ideal for reproducible backup data).' },
    { term: 'Amazon CloudFront', definition: 'A global Content Delivery Network (CDN) service securely delivering data, videos, applications, and APIs with low latency.' },
    { term: 'AWS CloudTrail', definition: 'A governance and compliance service recording AWS account activity and API calls across management and data events.' },
    { term: 'Amazon CloudWatch', definition: 'A monitoring and observability service providing data and actionable insights for AWS, hybrid, and on-premises resources.' },
    { term: 'AWS Organizations & SCPs', definition: 'Account management service using Service Control Policies (SCPs) to define central access guardrails across AWS accounts.' },
    { term: 'AWS Direct Connect', definition: 'A dedicated private physical network connection from an on-premises data center to AWS, bypassing public Internet routing.' },
    { term: 'AWS Secrets Manager', definition: 'A service that helps protect secrets needed to access applications and services, featuring automated database credential rotation.' },
    { term: 'AWS Lambda Serverless', definition: 'An event-driven compute service running application code in response to triggers without provisioning or managing servers.' },
    { term: 'Amazon RDS Multi-AZ', definition: 'A high-availability deployment option creating a synchronous standby replica in a distinct Availability Zone with automated failover.' }
  ]
};

async function expandBatch2() {
  await client.connect();
  console.log('=== INGESTING BATCH 2 GLOSSARY EXPANSIONS ===\n');

  let totalAdded = 0;

  for (const [slug, terms] of Object.entries(BATCH2_GLOSSARY)) {
    const certRes = await client.query('SELECT id, name FROM certifications WHERE slug = $1', [slug]);
    const cert = certRes.rows[0];

    if (!cert) continue;

    console.log(`Ingesting batch 2 for [${slug.toUpperCase()}] ${cert.name}...`);

    for (const t of terms) {
      await client.query(`
        INSERT INTO glossary_terms (id, certification_id, term, definition)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (certification_id, term) DO UPDATE SET
          definition = EXCLUDED.definition;
      `, [uuidv4(), cert.id, t.term, t.definition]);
      totalAdded++;
    }

    console.log(`✓ Added/Updated ${terms.length} terms for ${slug.toUpperCase()}`);
  }

  console.log(`\n========================================================================================`);
  console.log(`SUCCESSFULLY INGESTED BATCH 2 (${totalAdded} TERMS)!`);
  console.log(`========================================================================================\n`);

  await client.end();
}

expandBatch2().catch(console.error);
