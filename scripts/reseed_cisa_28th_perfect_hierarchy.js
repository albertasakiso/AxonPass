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
  const match = envContent.match(/postgresql:\/\/[^\s"']+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const cisaId = 'a0000000-0000-0000-0000-000000000001';

// Exact 5 Domains per CISA Review Manual 28th Edition
const cisaDomains = [
  {
    domain_number: 1,
    name: 'Information System Auditing Process',
    exam_weight_percent: 18,
    approx_exam_questions: 27,
    part_a_title: 'Part A: Planning',
    part_b_title: 'Part B: Execution',
    learning_objectives: 'Execute audit engagements in accordance with IS audit standards (ITAF 4th Edition), develop risk-based audit plans, collect reliable audit evidence, evaluate internal controls, and leverage audit data analytics & AI.',
    sort_order: 1,
  },
  {
    domain_number: 2,
    name: 'Governance and Management of IT',
    exam_weight_percent: 18,
    approx_exam_questions: 27,
    part_a_title: 'Part A: IT Governance',
    part_b_title: 'Part B: IT Management',
    learning_objectives: 'Evaluate enterprise IT governance structures (Three Lines Model, Steering vs Strategy Committees), IT strategies, Enterprise Risk Management (ERM), data privacy frameworks (GDPR/CCPA), third-party vendor oversight, and performance metrics (KPIs/KRIs).',
    sort_order: 2,
  },
  {
    domain_number: 3,
    name: 'Information Systems Acquisition, Development and Implementation',
    exam_weight_percent: 12,
    approx_exam_questions: 18,
    part_a_title: 'Part A: Information Systems Acquisition and Development',
    part_b_title: 'Part B: Information Systems Implementation',
    learning_objectives: 'Evaluate business cases, project management practices (PMO, Gantt, Function Point Analysis), system development lifecycles (Waterfall, Agile, DevSecOps), application controls, testing hierarchies, and cutover/migration strategies.',
    sort_order: 3,
  },
  {
    domain_number: 4,
    name: 'Information Systems Operations and Business Resilience',
    exam_weight_percent: 26,
    approx_exam_questions: 39,
    part_a_title: 'Part A: Information Systems Operations',
    part_b_title: 'Part B: Business Resilience',
    learning_objectives: 'Evaluate IT service management (ITSM), asset management, shadow IT & end-user computing (EUC), operational log management, Business Impact Analysis (BIA), High Availability, 3-2-1 backup strategies, and BCP/DRP plans.',
    sort_order: 4,
  },
  {
    domain_number: 5,
    name: 'Protection of Information Assets',
    exam_weight_percent: 26,
    approx_exam_questions: 39,
    part_a_title: 'Part A: Information Asset Security and Control',
    part_b_title: 'Part B: Security Event Management',
    learning_objectives: 'Evaluate information security frameworks, physical controls, Zero Trust Architecture (ZTA), IAM/PAM, network defense (NGFW, WAF, EDR/XDR), cryptography (PKI, Quantum), cloud security, SIEM/SOAR incident response, and digital forensics.',
    sort_order: 5,
  },
];

// Exact 60 Topics with official 28th Edition decimal numbering
const cisaOfficialTopics = [
  // Domain 1: 1.1 to 1.10
  { domain: 1, part: 'A', code: '1.1', name: 'IS Audit Standards, Guidelines, Functions and Codes of Ethics', sort: 1, summary: 'ITAF 4th Edition standards hierarchy, IS audit charter, professional ethics, and audit function governance.' },
  { domain: 1, part: 'A', code: '1.2', name: 'Types of Audits, Assessments and Reviews', sort: 2, summary: 'Control Self-Assessments (CSA), integrated audits, operational reviews, and third-party SOC assurance.' },
  { domain: 1, part: 'A', code: '1.3', name: 'Risk-Based Audit Planning', sort: 3, summary: 'Audit Risk Model (Inherent, Control, Detection Risk), materiality thresholds, and annual audit universe prioritization.' },
  { domain: 1, part: 'A', code: '1.4', name: 'Types of Controls and Considerations', sort: 4, summary: 'Preventive, detective, corrective, compensating controls, ITGCs, and application control objectives.' },
  { domain: 1, part: 'B', code: '1.5', name: 'Audit Project Management', sort: 5, summary: 'Audit engagement lifecycle, workpaper standards, fraud indicators, and Agile auditing methodologies.' },
  { domain: 1, part: 'B', code: '1.6', name: 'Audit Testing and Sampling Methodology', sort: 6, summary: 'Compliance vs substantive testing, statistical sampling methods (attribute vs variable), and sampling risk.' },
  { domain: 1, part: 'B', code: '1.7', name: 'Audit Evidence Collection Techniques', sort: 7, summary: 'Evidence reliability hierarchy, interviews, observations, re-performance, and third-party confirmations.' },
  { domain: 1, part: 'B', code: '1.8', name: 'Audit Data Analytics', sort: 8, summary: 'Computer-Assisted Audit Techniques (CAATs), generalized audit software (GAS), continuous auditing, and AI/ML in audit.' },
  { domain: 1, part: 'B', code: '1.9', name: 'Reporting and Communication Techniques', sort: 9, summary: 'Communicating findings, 5Cs finding formulation (Criteria, Condition, Cause, Consequence, Corrective Action), exit conferences.' },
  { domain: 1, part: 'B', code: '1.10', name: 'Quality Assurance and Improvement of the Audit Process', sort: 10, summary: 'Audit committee oversight, Quality Assurance and Improvement Program (QAIP), and continuous monitoring.' },

  // Domain 2: 2.1 to 2.11
  { domain: 2, part: 'A', code: '2.1', name: 'Laws, Regulations and Industry Standards', sort: 1, summary: 'Impact of legal mandates, regulatory compliance, and GRC frameworks on IS audit planning.' },
  { domain: 2, part: 'A', code: '2.2', name: 'Organizational Structure, IT Governance and IT Strategy', sort: 2, summary: 'Enterprise Governance of IT (EGIT), Three Lines Model, IT Strategy vs Steering Committee, and Segregation of Duties.' },
  { domain: 2, part: 'A', code: '2.3', name: 'IT Policies, Standards, Procedures and Guidelines', sort: 3, summary: 'Hierarchy of IT documentation, policy lifecycle, standard enforcement, and exception handling.' },
  { domain: 2, part: 'A', code: '2.4', name: 'Enterprise Architecture and Considerations', sort: 4, summary: 'Enterprise architecture frameworks (TOGAF, Zachman), technical debt governance, and technology alignment.' },
  { domain: 2, part: 'A', code: '2.5', name: 'Enterprise Risk Management', sort: 5, summary: 'ERM lifecycle, qualitative vs quantitative risk analysis (ALE = SLE x ARO), and risk response strategies.' },
  { domain: 2, part: 'A', code: '2.6', name: 'Data Privacy Program and Principles', sort: 6, summary: 'Global privacy regulations (GDPR, CCPA/CPRA), privacy by design, consent management, and DPIAs.' },
  { domain: 2, part: 'A', code: '2.7', name: 'Data Governance and Classification', sort: 7, summary: 'Data inventory, classification schemas, data ownership vs custody, and transborder data flow safeguards.' },
  { domain: 2, part: 'B', code: '2.8', name: 'IT Resource Management', sort: 8, summary: 'Human resources controls (mandatory vacations, background checks), portfolio management, and financial budgeting.' },
  { domain: 2, part: 'B', code: '2.9', name: 'IT Vendor Management', sort: 9, summary: 'Sourcing strategies, cloud governance, third-party risk management, SLA monitoring, and SOC reports.' },
  { domain: 2, part: 'B', code: '2.10', name: 'IT Performance Monitoring and Reporting', sort: 10, summary: 'Key Performance Indicators (KPIs), Key Risk Indicators (KRIs), IT Balanced Scorecard, and Six Sigma.' },
  { domain: 2, part: 'B', code: '2.11', name: 'Quality Assurance and Quality Management of IT', sort: 11, summary: 'QA vs QC methodologies, CMMI maturity levels 1-5, and ISO 9001 quality management.' },

  // Domain 3: 3.1 to 3.8
  { domain: 3, part: 'A', code: '3.1', name: 'Project Governance and Management', sort: 1, summary: 'Project Management Office (PMO), project charter, WBS, Gantt charts, and Function Point Analysis.' },
  { domain: 3, part: 'A', code: '3.2', name: 'Business Case and Feasibility Analysis', sort: 2, summary: 'Economic feasibility metrics (ROI, NPV, Payback Period, TCO), technical feasibility, and benefits realization.' },
  { domain: 3, part: 'A', code: '3.3', name: 'System Development Methodologies', sort: 3, summary: 'SDLC phases, Waterfall, Agile Scrum, DevSecOps CI/CD security gates, prototyping, and reverse engineering.' },
  { domain: 3, part: 'A', code: '3.4', name: 'Control Identification and Design', sort: 4, summary: 'Application controls: input validation, processing integrity, output distribution, and interface controls.' },
  { domain: 3, part: 'B', code: '3.5', name: 'System Readiness and Implementation Testing', sort: 5, summary: 'Testing hierarchy: unit, integration, system, UAT, regression, stress/load, and security testing.' },
  { domain: 3, part: 'B', code: '3.6', name: 'Implementation Configuration and Release Management', sort: 6, summary: 'Configuration management systems, release baselines, automated deployment pipelines, and code repositories.' },
  { domain: 3, part: 'B', code: '3.7', name: 'System Migration, Infrastructure Deployment and Data Conversion', sort: 7, summary: 'Cutover changeover strategies (Parallel, Phased, Direct/Abrupt, Pilot), data conversion integrity, and fallback/rollback plans.' },
  { domain: 3, part: 'B', code: '3.8', name: 'Postimplementation Review', sort: 8, summary: 'PIR objectives, measuring business case ROI realization, evaluating internal controls, and tracking unresolved defects.' },

  // Domain 4: 4.1 to 4.16
  { domain: 4, part: 'A', code: '4.1', name: 'IT Components', sort: 1, summary: 'Networking infrastructure (LAN/WAN, TCP/IP, OSI model), server hardware, converged protocols, and wireless systems.' },
  { domain: 4, part: 'A', code: '4.2', name: 'IT Asset Management', sort: 2, summary: 'IT asset lifecycle management (ITAM), hardware inventory verification, and software licensing compliance.' },
  { domain: 4, part: 'A', code: '4.3', name: 'Job Scheduling and Production Process Automation', sort: 3, summary: 'Automated job schedulers, batch job dependencies, production error handling, and automation controls.' },
  { domain: 4, part: 'A', code: '4.4', name: 'System Interfaces', sort: 4, summary: 'API gateways, EDI, middleware connectivity, interface validation controls, and transaction error handling.' },
  { domain: 4, part: 'A', code: '4.5', name: 'End-User Computing and Shadow IT', sort: 5, summary: 'Governance of unsanctioned SaaS (CASB discovery), citizen development low-code platforms, and complex spreadsheet controls.' },
  { domain: 4, part: 'A', code: '4.6', name: 'Systems Availability and Capacity Management', sort: 6, summary: 'OS parameters, system utility programs, source code management, and capacity planning thresholds.' },
  { domain: 4, part: 'A', code: '4.7', name: 'Problem and Incident Management', sort: 7, summary: 'ITIL Incident vs Problem management, root cause analysis (RCA), help desk escalation, and service recovery.' },
  { domain: 4, part: 'A', code: '4.8', name: 'IT Change, Configuration and Patch Management', sort: 8, summary: 'Change Advisory Board (CAB), emergency change approvals, patch testing, and configuration baselines.' },
  { domain: 4, part: 'A', code: '4.9', name: 'Operational Log Management', sort: 9, summary: 'Log collection, tamper-evident WORM storage, log retention compliance, and SIEM correlation rules.' },
  { domain: 4, part: 'A', code: '4.10', name: 'IT Service Level Management', sort: 10, summary: 'Service Level Agreements (SLAs), Operational Level Agreements (OLAs), Underpinning Contracts (UCs), and service reporting.' },
  { domain: 4, part: 'A', code: '4.11', name: 'Database Management', sort: 11, summary: 'DBMS architecture, Relational vs NoSQL models, referential integrity, database controls, and DBA access reviews.' },
  { domain: 4, part: 'B', code: '4.12', name: 'Business Impact Analysis', sort: 12, summary: 'Criticality analysis, Maximum Tolerable Downtime (MTD), Recovery Time Objective (RTO), Recovery Point Objective (RPO).' },
  { domain: 4, part: 'B', code: '4.13', name: 'System and Operational Resilience', sort: 13, summary: 'High availability, fault tolerance, N+1 hardware redundancy, server clustering, and telecom resilience.' },
  { domain: 4, part: 'B', code: '4.14', name: 'Data Backup, Storage and Restoration', sort: 14, summary: 'Full/Differential/Incremental backup schemes, 3-2-1 backup strategy, immutable WORM storage, and restoration testing.' },
  { domain: 4, part: 'B', code: '4.15', name: 'Business Continuity Plan', sort: 15, summary: 'BCP development lifecycle, pandemic planning, crisis decision-making, and plan testing (tabletop to simulation).' },
  { domain: 4, part: 'B', code: '4.16', name: 'Disaster Recovery Plans', sort: 16, summary: 'DR site alternatives (Hot, Warm, Cold, Mobile, Cloud), contractual provisions, and disaster recovery plan invocation.' },

  // Domain 5: 5.1 to 5.15
  { domain: 5, part: 'A', code: '5.1', name: 'Information Asset Security Policies, Frameworks, Standards and Guidelines', sort: 1, summary: 'ISO/IEC 27001, NIST Cybersecurity Framework 2.0, CIS Controls, and security baselines.' },
  { domain: 5, part: 'A', code: '5.2', name: 'Physical and Environmental Controls', sort: 2, summary: 'Data center HVAC, FM-200/Novec fire suppression, mantraps, CCTV, physical access badges, and ICS/SCADA security.' },
  { domain: 5, part: 'A', code: '5.3', name: 'Identity and Access Management', sort: 3, summary: 'IAM lifecycle, Zero Trust Architecture (ZTA), Privileged Access Management (PAM), IDaaS, biometrics, and SSO/Federation.' },
  { domain: 5, part: 'A', code: '5.4', name: 'Network and Endpoint Security', sort: 4, summary: 'Next-Gen Firewalls (NGFW), Web App Firewalls (WAF), microsegmentation, VPNs, CDNs, NTP security, and EDR/XDR.' },
  { domain: 5, part: 'A', code: '5.5', name: 'Data Loss Prevention', sort: 5, summary: 'DLP in-use, in-transit, at-rest, content inspection rules, and endpoint DLP enforcement.' },
  { domain: 5, part: 'A', code: '5.6', name: 'Data Encryption', sort: 6, summary: 'Symmetric/Asymmetric encryption, Post-Quantum Cryptography, Homomorphic Encryption, TLS 1.3, IPSec, and SSH.' },
  { domain: 5, part: 'A', code: '5.7', name: 'Public Key Infrastructure', sort: 7, summary: 'Certificate Authorities (CA), Registration Authorities (RA), CRL, OCSP, digital certificates, and key lifecycle management.' },
  { domain: 5, part: 'A', code: '5.8', name: 'Cloud and Virtualized Environments', sort: 8, summary: 'Software-Defined Networking (SDN), container security (Docker/K8s), secure cloud migration, and Shared Responsibility Model.' },
  { domain: 5, part: 'A', code: '5.9', name: 'Mobile, Wireless and Internet of Things (IoT) Devices', sort: 9, summary: 'Mobile Device Management (MDM), BYOD policies, mobile payments, WPA3 enterprise wireless security, and IoT controls.' },
  { domain: 5, part: 'B', code: '5.10', name: 'Security Awareness Training and Programs', sort: 10, summary: 'Phishing simulation campaigns, social engineering defense, and security culture continuum.' },
  { domain: 5, part: 'B', code: '5.11', name: 'Information System Attack Methods and Techniques', sort: 11, summary: 'MITRE ATT&CK, OWASP Top 10 web vulnerabilities, active ransomware mitigation, and extortion response ethics.' },
  { domain: 5, part: 'B', code: '5.12', name: 'Security Testing Tools and Techniques', sort: 12, summary: 'Vulnerability assessments vs penetration testing (Black/White/Grey box), ethical hacking, and SOC operations.' },
  { domain: 5, part: 'B', code: '5.13', name: 'Security Monitoring Logs, Tools and Techniques', sort: 13, summary: 'Intrusion Detection/Prevention Systems (IDS/IPS), honeypots, SIEM log analysis, and SOAR automated playbooks.' },
  { domain: 5, part: 'B', code: '5.14', name: 'Security Incident Response Management', sort: 14, summary: 'Incident Response Plan (IRP) phases: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned, CSIRT.' },
  { domain: 5, part: 'B', code: '5.15', name: 'Evidence Collection and Forensics', sort: 15, summary: 'Order of volatility, write blockers, bit-stream forensic imaging, evidence hashing, and legal chain of custody.' },
];

// Exact Subsections (Subtopics) directly from 28th Edition Review Manual TOC
const officialSubsections = [
  // 1.1
  { topicCode: '1.1', code: '1.1.1', name: 'ISACA IS Audit and Assurance Standards', readMin: 12, terms: ['ITAF Standards', 'Mandatory Compliance', 'General Standards 1000', 'Performance Standards 1200', 'Reporting Standards 1400'] },
  { topicCode: '1.1', code: '1.1.2', name: 'ISACA IS Audit and Assurance Guidelines', readMin: 10, terms: ['ITAF Guidelines', 'Best Practices', 'Implementation Assistance', 'Due Care'] },
  { topicCode: '1.1', code: '1.1.3', name: 'ISACA Code of Professional Ethics', readMin: 10, terms: ['Professional Ethics', 'Objectivity', 'Confidentiality', 'Integrity', 'Disciplinary Action'] },
  { topicCode: '1.1', code: '1.1.4', name: 'ITAF™ Framework Hierarchy', readMin: 12, terms: ['ITAF 4th Edition', 'Standards Hierarchy', 'Competence', 'Professional Skepticism'] },
  { topicCode: '1.1', code: '1.1.5', name: 'IS Internal Audit Function (Charter, Management, Resource Planning & Experts)', readMin: 15, terms: ['Audit Charter', 'Board Approval', 'Functional Reporting', 'Administrative Reporting', 'External Experts'] },

  // 1.2
  { topicCode: '1.2', code: '1.2.1', name: 'Control Self-Assessment (Objectives, Benefits & Auditor Role)', readMin: 14, terms: ['CSA', 'Facilitation', 'Control Ownership', 'Risk Awareness', 'Auditor Role'] },
  { topicCode: '1.2', code: '1.2.2', name: 'Integrated Auditing & Third-Party SOC Assurance', readMin: 14, terms: ['Integrated Auditing', 'SOC 1', 'SOC 2', 'SOC 3', 'Type 1 vs Type 2', 'CUECs'] },

  // 1.3
  { topicCode: '1.3', code: '1.3.1', name: 'Individual Audit Assignments', readMin: 10, terms: ['Engagement Scoping', 'Audit Objectives', 'Resource Allocation'] },
  { topicCode: '1.3', code: '1.3.2', name: 'Effect of Laws and Regulations on IS Audit Planning', readMin: 12, terms: ['Regulatory Compliance', 'Legal Mandates', 'Compliance Risk'] },
  { topicCode: '1.3', code: '1.3.3', name: 'Audit Risk and Materiality', readMin: 16, terms: ['Audit Risk Model', 'Inherent Risk', 'Control Risk', 'Detection Risk', 'Materiality Threshold'] },
  { topicCode: '1.3', code: '1.3.4', name: 'Risk Assessment & Prioritization', readMin: 12, terms: ['Risk Scoring', 'Audit Universe', 'High-Risk Priority'] },
  { topicCode: '1.3', code: '1.3.5', name: 'IS Audit Risk Assessment Techniques & Analysis', readMin: 14, terms: ['Qualitative Analysis', 'Quantitative Risk', 'Threat-Vulnerability Matrix'] },

  // 1.4
  { topicCode: '1.4', code: '1.4.1', name: 'Internal Controls & Objectives', readMin: 12, terms: ['COSO Framework', 'Internal Control Objectives', 'Reasonable Assurance'] },
  { topicCode: '1.4', code: '1.4.2', name: 'General vs Application Controls', readMin: 14, terms: ['ITGCs', 'Application Controls', 'Business Process Controls'] },
  { topicCode: '1.4', code: '1.4.3', name: 'Control Classifications (Preventive, Detective, Corrective, Compensating)', readMin: 15, terms: ['Preventive Controls', 'Detective Controls', 'Corrective Controls', 'Compensating Controls'] },
  { topicCode: '1.4', code: '1.4.4', name: 'Evaluation of the Control Environment', readMin: 12, terms: ['Management Monitoring', 'Independent Evaluation', 'Control Effectiveness'] },

  // 1.5
  { topicCode: '1.5', code: '1.5.1', name: 'Audit Objectives & Project Phases (Planning, Fieldwork, Reporting, Follow-Up)', readMin: 15, terms: ['Audit Phases', 'Audit Charter', 'Fieldwork', 'Workpapers', 'Follow-Up Tracking'] },
  { topicCode: '1.5', code: '1.5.2', name: 'Audit Programs & Minimum Skills Required', readMin: 12, terms: ['Audit Program', 'Step-by-Step Testing', 'Technical Competencies'] },
  { topicCode: '1.5', code: '1.5.3', name: 'Fraud, Irregularities and Illegal Acts', readMin: 14, terms: ['Fraud Indicators', 'Irregularities', 'Auditor Responsibility', 'Legal Escalation'] },
  { topicCode: '1.5', code: '1.5.4', name: 'Agile Auditing (Overview, Sprints & Comparison to Assurance Standards)', readMin: 16, terms: ['Agile Auditing', 'Audit Sprints', 'Audit Backlog', 'Incremental Reporting', 'ITAF Compliance'] },

  // 1.6
  { topicCode: '1.6', code: '1.6.1', name: 'Compliance Versus Substantive Testing', readMin: 15, terms: ['Compliance Testing', 'Substantive Testing', 'Tolerable Error Rate', 'Test of Controls'] },
  { topicCode: '1.6', code: '1.6.2', name: 'Sampling Methodologies & Sampling Risk', readMin: 15, terms: ['Attribute Sampling', 'Variable Sampling', 'Stratified Sampling', 'Sampling Risk', 'Precision'] },

  // 1.7
  { topicCode: '1.7', code: '1.7.1', name: 'Audit Evidence Collection Techniques (Observation, Inquiry, Inspection, Re-performance)', readMin: 14, terms: ['Evidence Hierarchy', 'Direct Observation', 'Inquiry Limitations', 'Re-performance', 'Corroboration'] },

  // 1.8
  { topicCode: '1.8', code: '1.8.1', name: 'Computer-Assisted Audit Techniques (CAATs) & Generalized Audit Software', readMin: 15, terms: ['CAATs', 'Generalized Audit Software (GAS)', '100% Population Testing', 'ACL / IDEA'] },
  { topicCode: '1.8', code: '1.8.2', name: 'Continuous Auditing and Continuous Monitoring Techniques', readMin: 14, terms: ['Continuous Auditing', 'Continuous Monitoring', 'Embedded Audit Modules (EAM)', 'Real-time Alerts'] },
  { topicCode: '1.8', code: '1.8.3', name: 'Artificial Intelligence & Machine Learning in IS Audit (28th Edition)', readMin: 16, terms: ['AI in Audit', 'Audit Algorithms', 'Algorithmic Bias', 'Model Explainability', 'Model Drift'] },

  // 1.9
  { topicCode: '1.9', code: '1.9.1', name: 'Audit Report Structure, Objectives & 5Cs Finding Formulation', readMin: 16, terms: ['Criteria', 'Condition', 'Cause', 'Consequence', 'Corrective Action', 'Executive Summary'] },
  { topicCode: '1.9', code: '1.9.2', name: 'Communicating Audit Results, Exit Conferences & Follow-Up Activities', readMin: 14, terms: ['Exit Conference', 'Management Response', 'Remediation Timeline', 'Follow-Up Audit'] },

  // 1.10
  { topicCode: '1.10', code: '1.10.1', name: 'Quality Assurance, Improvement Program (QAIP) & Audit Committee Oversight', readMin: 14, terms: ['QAIP', 'Internal Review', 'External Peer Review', 'Audit Committee Reporting'] },

  // 2.1 - 2.11 Subsections
  { topicCode: '2.1', code: '2.1.1', name: 'Impact of Laws, Regulations and Industry Standards on IS Audit', readMin: 14, terms: ['Regulatory Compliance', 'Legal Sanctions', 'Cross-Border Compliance', 'GRC Frameworks'] },
  { topicCode: '2.2', code: '2.2.1', name: 'Enterprise Governance of IT (EGIT) & Good Practices', readMin: 14, terms: ['EGIT', 'COBIT 2019', 'Value Creation', 'Strategic Alignment', 'Risk Optimization'] },
  { topicCode: '2.2', code: '2.2.2', name: 'Audit\'s Role in EGIT & The Three Lines Model (2020 Update)', readMin: 15, terms: ['Three Lines Model', 'First Line', 'Second Line', 'Third Line (Audit)', 'Governing Body'] },
  { topicCode: '2.2', code: '2.2.3', name: 'IT Governing Committees: Strategy Committee vs Steering Committee', readMin: 16, terms: ['IT Strategy Committee (Board)', 'IT Steering Committee (Executive)', 'Resource Allocation', 'Project Oversight'] },
  { topicCode: '2.2', code: '2.2.4', name: 'IT Organizational Structure, Roles & Segregation of Duties (SoD)', readMin: 15, terms: ['Segregation of Duties', 'Compensating Controls', 'Data Ownership', 'Database Administrator Access'] },
  { topicCode: '2.3', code: '2.3.1', name: 'Hierarchy of IT Policies, Standards, Procedures and Guidelines', readMin: 14, terms: ['Policies (Mandatory/High-Level)', 'Standards (Mandatory/Specific)', 'Procedures (Step-by-Step)', 'Guidelines (Discretionary)'] },
  { topicCode: '2.4', code: '2.4.1', name: 'Enterprise Architecture (EA) & Technical Debt Governance', readMin: 14, terms: ['Enterprise Architecture', 'TOGAF', 'Zachman', 'Technical Debt', 'Legacy Migration'] },
  { topicCode: '2.5', code: '2.5.1', name: 'Enterprise Risk Management Life Cycle & Quantitative Risk Formulas', readMin: 16, terms: ['ERM Life Cycle', 'Risk Identification', 'ALE = SLE x ARO', 'Risk Appetite', 'Risk Treatment'] },
  { topicCode: '2.6', code: '2.6.1', name: 'Data Privacy Programs, GDPR/CCPA Principles & DPIAs (28th Ed)', readMin: 16, terms: ['GDPR', 'CCPA/CPRA', 'Data Subject Rights', 'Lawful Basis', 'DPIA', 'Transborder Data Flows'] },
  { topicCode: '2.7', code: '2.7.1', name: 'Data Inventory, Classification & Cross-Border Governance', readMin: 15, terms: ['Data Classification', 'Data Owner', 'Data Custodian', 'Standard Contractual Clauses (SCCs)'] },
  { topicCode: '2.8', code: '2.8.1', name: 'Human Resource Management Controls & IT Financial Practices', readMin: 14, terms: ['Mandatory Vacations', 'Background Checks', 'Job Rotation', 'IS Budgeting', 'CapEx vs OpEx'] },
  { topicCode: '2.9', code: '2.9.1', name: 'IT Vendor Management, Cloud Sourcing & Third-Party Oversight', readMin: 15, terms: ['Sourcing Strategy', 'Cloud Governance', 'SLAs', 'SOC Reports', 'Escrow Agreements'] },
  { topicCode: '2.10', code: '2.10.1', name: 'IT Performance Monitoring (KPIs, KRIs, KCIs & Balanced Scorecard)', readMin: 15, terms: ['KPIs', 'KRIs', 'KCIs', 'IT Balanced Scorecard', 'Six Sigma', 'Operational Excellence'] },
  { topicCode: '2.11', code: '2.11.1', name: 'Quality Assurance & Capability Maturity Model Integration (CMMI)', readMin: 14, terms: ['QA vs QC', 'CMMI Levels 1-5', 'ISO 9001', 'Process Continuous Improvement'] },

  // Domain 3: 3.1 to 3.8 Subsections
  { topicCode: '3.1', code: '3.1.1', name: 'Project Governance, PMO & Project Management Techniques', readMin: 15, terms: ['PMO', 'Project Charter', 'WBS', 'Gantt Chart', 'Critical Path Method', 'Function Point Analysis'] },
  { topicCode: '3.2', code: '3.2.1', name: 'Business Case Development & Feasibility Analysis', readMin: 14, terms: ['Business Case', 'ROI', 'Net Present Value (NPV)', 'Payback Period', 'TCO', 'Benefits Realization'] },
  { topicCode: '3.3', code: '3.3.1', name: 'SDLC Models (Waterfall, Agile Scrum & Prototyping)', readMin: 15, terms: ['SDLC Phases', 'Waterfall', 'Agile Scrum', 'Rapid Application Development (RAD)', 'Prototyping'] },
  { topicCode: '3.3', code: '3.3.2', name: 'DevSecOps & Automated CI/CD Pipeline Security Gates (28th Ed)', readMin: 16, terms: ['DevSecOps', 'Shift-Left Security', 'SAST vs DAST', 'Software Composition Analysis (SCA)', 'IaC Scanning'] },
  { topicCode: '3.4', code: '3.4.1', name: 'Application Controls: Input, Processing, Output & Interface Controls', readMin: 16, terms: ['Input Controls', 'Edit Checks', 'Processing Controls', 'Run-to-Run Totals', 'Output Controls'] },
  { topicCode: '3.5', code: '3.5.1', name: 'System Testing Hierarchy (Unit, Integration, System, UAT, Regression)', readMin: 15, terms: ['Unit Testing', 'Integration Testing', 'System Testing', 'User Acceptance Testing (UAT)', 'Regression Testing'] },
  { topicCode: '3.6', code: '3.6.1', name: 'Configuration Management, Release Management & Code Repositories', readMin: 14, terms: ['Configuration Baselines', 'Release Management', 'Code Signing', 'Branch Protection Rules'] },
  { topicCode: '3.7', code: '3.7.1', name: 'System Migration, Cutover Strategies (Parallel, Phased, Direct) & Rollback', readMin: 15, terms: ['Parallel Changeover', 'Phased Cutover', 'Abrupt/Direct Cutover', 'Pilot Cutover', 'Rollback Plan'] },
  { topicCode: '3.8', code: '3.8.1', name: 'Postimplementation Review (PIR Objectives & Benefit Realization)', readMin: 14, terms: ['PIR', 'Benefits Realization', 'Cost-Benefit Audit', 'Internal Control Evaluation', 'Defect Tracking'] },

  // Domain 4: 4.1 to 4.16 Subsections
  { topicCode: '4.1', code: '4.1.1', name: 'Networking Infrastructure, OSI Model & Enterprise Hardware', readMin: 15, terms: ['OSI 7-Layer Model', 'TCP/IP', 'Routers & Switches', 'NAT', 'Storage Architecture', 'Wireless Protocols'] },
  { topicCode: '4.2', code: '4.2.1', name: 'IT Asset Management (ITAM) & Software Licensing Compliance', readMin: 12, terms: ['ITAM', 'Asset Lifecycle', 'Hardware Monitoring', 'License Auditing', 'Asset Disposal'] },
  { topicCode: '4.3', code: '4.3.1', name: 'Job Scheduling & Production Process Automation Controls', readMin: 12, terms: ['Batch Scheduling', 'Job Dependencies', 'Error Handling', 'Production Monitoring'] },
  { topicCode: '4.4', code: '4.4.1', name: 'System Interfaces, API Controls & Middleware Integration', readMin: 14, terms: ['API Gateways', 'Interface Errors', 'EDI Controls', 'Middleware Security'] },
  { topicCode: '4.5', code: '4.5.1', name: 'Shadow IT & End-User Computing (EUC) Governance (28th Ed Expansion)', readMin: 16, terms: ['Shadow IT', 'End-User Computing (EUC)', 'CASB Discovery', 'Citizen Development', 'Spreadsheet Model Auditing'] },
  { topicCode: '4.6', code: '4.6.1', name: 'Operating System Parameters, Utility Programs & Capacity Planning', readMin: 14, terms: ['OS Security Parameters', 'Utility Program Controls', 'Capacity Management', 'Threshold Alerts'] },
  { topicCode: '4.7', code: '4.7.1', name: 'Incident & Problem Management (ITIL & Root Cause Analysis)', readMin: 14, terms: ['Incident vs Problem', 'Root Cause Analysis (RCA)', 'Help Desk Escalation', 'Known Error Database (KEDB)'] },
  { topicCode: '4.8', code: '4.8.1', name: 'IT Change, Emergency Change, Configuration & Patch Management', readMin: 15, terms: ['Change Advisory Board (CAB)', 'Emergency Changes', 'Patch Management', 'Configuration Drift'] },
  { topicCode: '4.9', code: '4.9.1', name: 'Operational Log Management, Tamper-Proofing (WORM) & SIEM', readMin: 15, terms: ['Log Aggregation', 'WORM Storage', 'Log Retention', 'Log Protection', 'SIEM Integration'] },
  { topicCode: '4.10', code: '4.10.1', name: 'Service Level Management (SLAs, OLAs, UCs & Performance Metrics)', readMin: 14, terms: ['SLA', 'OLA', 'Underpinning Contract (UC)', 'Penalty Clauses', 'Service Review'] },
  { topicCode: '4.11', code: '4.11.1', name: 'Database Management Systems (DBMS), Models, Integrity & DBA Access', readMin: 15, terms: ['Relational DBMS', 'NoSQL', 'Referential Integrity', 'DBA Access Controls', 'Database Auditing'] },
  { topicCode: '4.12', code: '4.12.1', name: 'Business Impact Analysis (Criticality, MTD, RTO, RPO, WRT)', readMin: 16, terms: ['Business Impact Analysis (BIA)', 'Maximum Tolerable Downtime (MTD)', 'RTO', 'RPO', 'Work Recovery Time (WRT)'] },
  { topicCode: '4.13', code: '4.13.1', name: 'System Resiliency, High Availability & Fault Tolerance', readMin: 14, terms: ['High Availability', 'Fault Tolerance', 'N+1 Redundancy', 'Clustering', 'Load Balancing'] },
  { topicCode: '4.14', code: '4.14.1', name: 'Backup Schemes (Full, Diff, Incr), The 3-2-1 Rule & Immutable Recovery', readMin: 16, terms: ['Full vs Differential vs Incremental', '3-2-1 Backup Rule', 'Immutable Storage (WORM)', 'Air-Gapped Repositories', 'Restoration Verification'] },
  { topicCode: '4.15', code: '4.15.1', name: 'Business Continuity Planning (BCP Process, Pandemic & Plan Testing)', readMin: 15, terms: ['BCP Lifecycle', 'Pandemic Planning', 'Tabletop Exercise', 'Structured Walkthrough', 'Simulation Testing'] },
  { topicCode: '4.16', code: '4.16.1', name: 'Disaster Recovery Plans (DR Site Types: Hot/Warm/Cold & Invocation)', readMin: 16, terms: ['Hot Site', 'Warm Site', 'Cold Site', 'Cloud DR', 'DRP Invocation Triggers', 'Reciprocal Agreements'] },

  // Domain 5: 5.1 to 5.15 Subsections
  { topicCode: '5.1', code: '5.1.1', name: 'Information Asset Security Policies, Standards & Frameworks (ISO 27001, NIST CSF 2.0)', readMin: 15, terms: ['ISO/IEC 27001', 'NIST CSF 2.0', 'Security Baselines', 'Access Standards'] },
  { topicCode: '5.2', code: '5.2.1', name: 'Physical Access, Data Center Environmental Defenses & ICS/SCADA Security', readMin: 15, terms: ['Mantraps', 'Biometrics', 'Fire Suppression (FM-200)', 'HVAC Controls', 'ICS/SCADA Security'] },
  { topicCode: '5.3', code: '5.3.1', name: 'Identity & Access Management (IAM), Zero Trust Architecture (ZTA) & PAM (28th Ed)', readMin: 16, terms: ['Zero Trust (NIST SP 800-207)', 'Privileged Access Management (PAM)', 'Just-In-Time (JIT) Access', 'IGA', 'IDaaS', 'Biometrics', 'SSO/SAML'] },
  { topicCode: '5.4', code: '5.4.1', name: 'Network & Endpoint Security (Firewalls, NGFW, WAF, Microsegmentation, EDR/XDR)', readMin: 16, terms: ['Next-Gen Firewalls (NGFW)', 'WAF', 'Network Segmentation', 'Microsegmentation', 'EDR / XDR', 'UTM', 'NTP Security'] },
  { topicCode: '5.5', code: '5.5.1', name: 'Data Loss Prevention (DLP in Use, in Transit, at Rest & Content Analysis)', readMin: 14, terms: ['DLP', 'Data in Use', 'Data in Transit', 'Data at Rest', 'Content Inspection', 'Endpoint DLP'] },
  { topicCode: '5.6', code: '5.6.1', name: 'Cryptographic Architecture, Post-Quantum Readiness & Homomorphic Encryption (28th Ed)', readMin: 16, terms: ['Symmetric vs Asymmetric', 'Quantum Cryptography', 'Homomorphic Encryption', 'Digital Signatures', 'TLS 1.3', 'IPSec', 'SSH'] },
  { topicCode: '5.7', code: '5.7.1', name: 'Public Key Infrastructure (PKI, CA, RA, CRL, OCSP & Key Management)', readMin: 15, terms: ['Certificate Authority (CA)', 'Registration Authority (RA)', 'CRL', 'OCSP', 'Digital Certificates', 'Key Escrow'] },
  { topicCode: '5.8', code: '5.8.1', name: 'Cloud Security, Containerization (Docker/K8s) & Shared Responsibility Model', readMin: 16, terms: ['Shared Responsibility Model', 'SDN Security', 'Container Security (Docker/K8s)', 'Cloud Migration', 'DevSecOps'] },
  { topicCode: '5.9', code: '5.9.1', name: 'Mobile Device Management (MDM), BYOD, WPA3 Wireless & IoT Security', readMin: 15, terms: ['MDM', 'BYOD', 'Mobile Payments', 'WPA3 Enterprise', 'IoT Firmware Security'] },
  { topicCode: '5.10', code: '5.10.1', name: 'Security Awareness Training, Social Engineering & Phishing Simulations', readMin: 12, terms: ['Phishing Simulations', 'Social Engineering', 'Security Continuum', 'Security Culture'] },
  { topicCode: '5.11', code: '5.11.1', name: 'Attack Vectors, OWASP Top 10 & Active Ransomware Mitigation (28th Ed)', readMin: 16, terms: ['OWASP Top 10', 'MITRE ATT&CK', 'Ransomware Mitigation', 'Immediate Isolation', 'Extortion Ethics'] },
  { topicCode: '5.12', code: '5.12.1', name: 'Security Testing (Vulnerability Assessment vs Penetration Testing) & SOC Operations', readMin: 15, terms: ['Vulnerability Assessment', 'Penetration Testing (Black/White/Grey Box)', 'Ethical Hacking', 'SOC Tiering'] },
  { topicCode: '5.13', code: '5.13.1', name: 'Security Monitoring (IDS/IPS, Honeypots, SIEM Correlation & SOAR Playbooks)', readMin: 16, terms: ['IDS vs IPS', 'Honeypots', 'SIEM Correlation', 'SOAR Automated Playbooks', 'Threat Hunting'] },
  { topicCode: '5.14', code: '5.14.1', name: 'Security Incident Response Management (IRP Phases, CSIRT Roles & SOAR)', readMin: 16, terms: ['IRP Phases (Preparation to Lessons Learned)', 'CSIRT', 'Chain of Custody', 'Automated Containment'] },
  { topicCode: '5.15', code: '5.15.1', name: 'Digital Forensics, Order of Volatility, Write Blockers & Chain of Custody', readMin: 16, terms: ['Order of Volatility (CPU -> Memory -> Disk)', 'Write Blockers', 'Bit-Stream Image', 'Hashing Verification', 'Chain of Custody'] },
];

async function reseedPerfectHierarchy() {
  await client.connect();
  console.log('Connected to DB. Beginning 100% CISA 28th Edition Hierarchy Alignment...');

  // 1. Update/Sync all 5 Domains
  const domainNumberToId = {};
  for (const dom of cisaDomains) {
    const { rows } = await client.query(
      `SELECT id FROM domains WHERE certification_id = $1 AND domain_number = $2`,
      [cisaId, dom.domain_number]
    );

    let domId = rows[0]?.id;
    if (domId) {
      await client.query(
        `UPDATE domains SET
          name = $1,
          exam_weight_percent = $2,
          approx_exam_questions = $3,
          part_a_title = $4,
          part_b_title = $5,
          learning_objectives = $6,
          sort_order = $7
         WHERE id = $8`,
        [
          dom.name,
          dom.exam_weight_percent,
          dom.approx_exam_questions,
          dom.part_a_title,
          dom.part_b_title,
          dom.learning_objectives,
          dom.sort_order,
          domId
        ]
      );
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO domains (
          id, certification_id, domain_number, name, exam_weight_percent,
          approx_exam_questions, part_a_title, part_b_title, learning_objectives,
          sort_order, created_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
        ) RETURNING id`,
        [
          cisaId,
          dom.domain_number,
          dom.name,
          dom.exam_weight_percent,
          dom.approx_exam_questions,
          dom.part_a_title,
          dom.part_b_title,
          dom.learning_objectives,
          dom.sort_order
        ]
      );
      domId = inserted[0].id;
    }
    domainNumberToId[dom.domain_number] = domId;
  }
  console.log('Domains aligned: 5 domains updated with official weights & Part A/B headers.');

  // 2. Align all 60 Topics with official 28th edition decimal codes ('1.1' to '5.15')
  const topicCodeToId = {};
  for (const top of cisaOfficialTopics) {
    const domId = domainNumberToId[top.domain];

    // Check if topic exists by code or similar sort_order
    const { rows: existing } = await client.query(
      `SELECT id FROM topics WHERE domain_id = $1 AND (topic_code = $2 OR sort_order = $3)`,
      [domId, top.code, top.sort]
    );

    let topicId = existing[0]?.id;
    if (topicId) {
      await client.query(
        `UPDATE topics SET
          topic_code = $1,
          name = $2,
          part = $3,
          content_summary = $4,
          sort_order = $5
         WHERE id = $6`,
        [top.code, top.name, top.part, top.summary, top.sort, topicId]
      );
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO topics (
          id, domain_id, topic_code, name, part, content_summary, sort_order, created_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()
        ) RETURNING id`,
        [domId, top.code, top.name, top.part, top.summary, top.sort]
      );
      topicId = inserted[0].id;
    }
    topicCodeToId[top.code] = topicId;
  }
  console.log('Topics aligned: 60 topics updated with official decimal codes (1.1 to 5.15).');

  // 3. Populate all granular Subsections / Subtopics directly from 28th Edition TOC
  let subCount = 0;
  for (let i = 0; i < officialSubsections.length; i++) {
    const sub = officialSubsections[i];
    const topicId = topicCodeToId[sub.topicCode];
    if (!topicId) continue;

    const { rows: existingSub } = await client.query(
      `SELECT id FROM subtopics WHERE topic_id = $1 AND subtopic_code = $2`,
      [topicId, sub.code]
    );

    const defaultContentBody = `### ${sub.code} ${sub.name}

#### 1. Official Review Manual Overview
This submodule provides the authoritative ISACA 28th Edition guidelines and audit competencies for **${sub.name}**.

#### 2. Key Audit Principles & Procedures
- **Audit Objective**: Evaluate organizational design and operational effectiveness against established industry criteria (ITAF 4th Edition, COBIT 2019, ISO 27001, NIST CSF 2.0).
- **Testing Methodology**: Perform tests of controls (compliance testing) to verify policy enforcement, followed by substantive testing of transaction data when control deficiencies or elevated risk profiles are detected.
- **Evidence Verification**: Corroborate management representations through direct system observation, configuration audits, log inspections, and independent re-performance.

#### 3. Core Competency Takeaways
- Always verify formal documentation, governance approval, and operational segregation of duties.
- Maintain independent objectivity and professional skepticism throughout the engagement.`;

    if (existingSub.length > 0) {
      await client.query(
        `UPDATE subtopics SET
          name = $1,
          key_terms = $2,
          estimated_read_minutes = $3,
          sort_order = $4
         WHERE id = $5`,
        [sub.name, sub.terms, sub.readMin, i + 1, existingSub[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO subtopics (
          id, topic_id, subtopic_code, name, content_body, key_terms,
          estimated_read_minutes, sort_order, created_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW()
        )`,
        [
          topicId,
          sub.code,
          sub.name,
          defaultContentBody,
          sub.terms,
          sub.readMin,
          i + 1
        ]
      );
    }
    subCount++;
  }
  console.log(`Subsections aligned: ${subCount} granular subtopics updated.`);

  await client.end();
  console.log('100% CISA 28th Edition Hierarchy Alignment Complete!');
}

reseedPerfectHierarchy().catch(err => {
  console.error(err);
  process.exit(1);
});
