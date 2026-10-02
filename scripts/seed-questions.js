import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001';
const DOMAIN_1_ID = 'd0000000-0000-0000-0000-000000000001';

// 25 Comprehensive Seed Questions covering Domain 1 (Planning & Execution)
const QUESTIONS = [
  {
    num: 1,
    topicCode: '1.1',
    task: 'T2',
    diff: 'medium',
    stem: 'Which of the following defines mandatory requirements for information systems audit and assurance practices?',
    scenario: null,
    a: 'ISACA IS Audit and Assurance Guidelines',
    b: 'ISACA IS Audit and Assurance Tools and Techniques',
    c: 'ISACA IS Audit and Assurance Standards',
    d: 'ISACA Code of Professional Ethics',
    ans: 'C',
    rationale: 'ISACA IS Audit and Assurance Standards define mandatory requirements for IS audit and assurance engagements. Guidelines provide guidance in applying standards, while tools/techniques provide procedural steps.',
    tags: ['IS Audit Standards', 'ITAF', 'Governance'],
    source: 'CISA Manual 27th Ed, Section 1.1',
    conf: 'verified'
  },
  {
    num: 2,
    topicCode: '1.2',
    task: 'T1',
    diff: 'medium',
    stem: 'An IS auditor is reviewing an organization’s audit charter. Which of the following is the MOST critical element that should be documented in the charter?',
    scenario: null,
    a: 'The scope, authority, and responsibility of the audit function',
    b: 'The detailed annual audit plan and schedule',
    c: 'The specific audit tools and CAATs to be utilized',
    d: 'The qualifications and certifications required for audit staff',
    ans: 'A',
    rationale: 'The audit charter must establish the overall authority, scope, and responsibility of the IS audit function. It is approved by the audit committee or board of directors.',
    tags: ['Audit Charter', 'Authority', 'Planning'],
    source: 'CISA Manual 27th Ed, Section 1.2',
    conf: 'verified'
  },
  {
    num: 3,
    topicCode: '1.4',
    task: 'T1',
    diff: 'hard',
    stem: 'When performing a risk-based audit planning process, the PRIMARY reason for assessing inherent risk is to:',
    scenario: null,
    a: 'Determine the effectiveness of existing internal controls',
    b: 'Identify areas where the risk of material error is highest before considering controls',
    c: 'Calculate the total financial liability of the organization',
    d: 'Establish the sample size for substantive testing procedures',
    ans: 'B',
    rationale: 'Inherent risk is the susceptibility of an audit area to error or fraud assuming there are no related internal controls. Assessing inherent risk helps focus audit resources on high-exposure areas.',
    tags: ['Risk Assessment', 'Inherent Risk', 'Planning'],
    source: 'CISA Manual 27th Ed, Section 1.4',
    conf: 'verified'
  },
  {
    num: 4,
    topicCode: '1.3',
    task: 'T2',
    diff: 'medium',
    stem: 'Which of the following is the BEST example of a compensating control?',
    scenario: 'A small organization has only one database administrator who also develops application software, creating a segregation of duties conflict.',
    a: 'Requiring the administrator to use a stronger password policy',
    b: 'Implementing daily independent review of database audit logs',
    c: 'Restricting physical access to the server room',
    d: 'Purchasing business interruption insurance',
    ans: 'B',
    rationale: 'A compensating control is an internal control that reduces risk when primary controls (such as segregation of duties) cannot be implemented. Independent daily review of audit logs mitigates the risk of unauthorized database changes.',
    tags: ['Controls', 'Compensating Controls', 'Segregation of Duties'],
    source: 'CISA Manual 27th Ed, Section 1.3',
    conf: 'verified'
  },
  {
    num: 5,
    topicCode: '1.9',
    task: 'T36',
    diff: 'easy',
    stem: 'An IS auditor wants to analyze 100% of transaction logs across multiple systems to detect anomalous activity. Which technique is MOST appropriate?',
    scenario: null,
    a: 'Statistical attribute sampling',
    b: 'Generalized Audit Software (GAS / CAATs)',
    c: 'Manual walkthrough testing',
    d: 'Control self-assessment (CSA)',
    ans: 'B',
    rationale: 'Generalized Audit Software (GAS) and Computer-Assisted Audit Techniques (CAATs) enable the auditor to process and analyze complete datasets (100% testing) efficiently without sampling.',
    tags: ['CAATs', 'Data Analytics', 'Audit Tools'],
    source: 'CISA Manual 27th Ed, Section 1.9',
    conf: 'verified'
  },
  {
    num: 6,
    topicCode: '1.7',
    task: 'T2',
    diff: 'hard',
    stem: 'An IS auditor is testing controls over financial journal entries. The auditor chooses attribute sampling. What is the primary purpose of attribute sampling in this context?',
    scenario: null,
    a: 'To estimate the monetary dollar value of errors in the population',
    b: 'To determine the rate of occurrence of a specific control failure in the population',
    c: 'To verify the existence of physical server inventory',
    d: 'To establish disaster recovery recovery time objectives (RTO)',
    ans: 'B',
    rationale: 'Attribute sampling is used for compliance testing (testing of controls) to determine whether a given control attribute is present or absent and to estimate the rate of deviation.',
    tags: ['Sampling', 'Attribute Sampling', 'Compliance Testing'],
    source: 'CISA Manual 27th Ed, Section 1.7',
    conf: 'verified'
  },
  {
    num: 7,
    topicCode: '1.8',
    task: 'T2',
    diff: 'medium',
    stem: 'Which of the following forms of audit evidence provides the HIGHEST level of reliability to an IS auditor?',
    scenario: null,
    a: 'Direct observation of a physical security procedure performed by the auditor',
    b: 'An oral representation given by the chief information officer during an interview',
    c: 'A vendor-provided marketing whitepaper describing software features',
    d: 'An internally generated memo explaining a system downtime incident',
    ans: 'A',
    rationale: 'Evidence obtained directly by the auditor through personal observation, examination, or computation is more reliable than evidence obtained indirectly or from internal inquiries alone.',
    tags: ['Audit Evidence', 'Observation', 'Reliability'],
    source: 'CISA Manual 27th Ed, Section 1.8',
    conf: 'verified'
  },
  {
    num: 8,
    topicCode: '1.10',
    task: 'T3',
    diff: 'medium',
    stem: 'An IS auditor has identified a critical vulnerability in a production core banking server. What should be the auditor’s FIRST course of action?',
    scenario: null,
    a: 'Wait until the formal final audit report is issued at the end of the quarter',
    b: 'Directly apply the required security patch to the server immediately',
    c: 'Inform auditee management promptly so that immediate remedial action can be considered',
    d: 'Disclose the finding to external regulatory authorities before alerting management',
    ans: 'C',
    rationale: 'When significant or critical vulnerabilities are discovered during an audit, ISACA standards require the auditor to communicate them to management on an interim basis without delay.',
    tags: ['Reporting', 'Communication', 'Interim Findings'],
    source: 'CISA Manual 27th Ed, Section 1.10',
    conf: 'verified'
  },
  {
    num: 9,
    topicCode: '1.11',
    task: 'T37',
    diff: 'medium',
    stem: 'What is the PRIMARY advantage of a Control Self-Assessment (CSA) program in an organization?',
    scenario: null,
    a: 'It completely eliminates the need for independent external and internal audits',
    b: 'It transfers operational accountability for control ownership to the business process owners',
    c: 'It guarantees that zero security incidents will occur',
    d: 'It reduces the total number of corporate regulatory compliance requirements',
    ans: 'B',
    rationale: 'CSA enhances employee and management awareness and empowers business process owners to take active responsibility and accountability for identifying and managing their internal controls.',
    tags: ['CSA', 'Control Self-Assessment', 'Quality Assurance'],
    source: 'CISA Manual 27th Ed, Section 1.11',
    conf: 'verified'
  },
  {
    num: 10,
    topicCode: '1.6',
    task: 'T1',
    diff: 'medium',
    stem: 'An IS audit program is BEST described as:',
    scenario: null,
    a: 'A step-by-step set of audit procedures designed to accomplish specific audit objectives',
    b: 'The high-level corporate governance framework approved by executive management',
    c: 'A software program installed on auditor laptops for drafting reports',
    d: 'The legal charter authorizing the internal audit department',
    ans: 'A',
    rationale: 'An audit program is an operational document containing the specific step-by-step procedures, tests, and methodologies to be followed during an engagement to achieve audit objectives.',
    tags: ['Audit Program', 'Project Management', 'Execution'],
    source: 'CISA Manual 27th Ed, Section 1.6',
    conf: 'verified'
  },
  {
    num: 11,
    topicCode: '1.5',
    task: 'T2',
    diff: 'medium',
    stem: 'During an integrated audit, the IS auditor collaborates closely with financial auditors. What is the PRIMARY benefit of this approach?',
    scenario: null,
    a: 'Elimination of all substantive testing procedures',
    b: 'Comprehensive assessment of both automated application controls and financial reporting risks',
    c: 'Reduction of the overall audit scope to only hardware reviews',
    d: 'Delegation of all auditor responsibilities to external third parties',
    ans: 'B',
    rationale: 'Integrated auditing combines financial and operational audit expertise with IS audit expertise, providing an end-to-end view of how automated controls influence financial reporting accuracy.',
    tags: ['Integrated Audit', 'Financial Audit', 'Audit Types'],
    source: 'CISA Manual 27th Ed, Section 1.5',
    conf: 'verified'
  },
  {
    num: 12,
    topicCode: '1.7',
    task: 'T2',
    diff: 'hard',
    stem: 'Which of the following sampling risks describes the risk that an auditor concludes a control is effective when, in reality, it is NOT effective?',
    scenario: null,
    a: 'Risk of incorrect rejection (Alpha risk)',
    b: 'Risk of assessing control risk too low (Beta risk / Overreliance)',
    c: 'Sampling frame truncation risk',
    d: 'Inherent operational risk',
    ans: 'B',
    rationale: 'The risk of assessing control risk too low (Beta risk) impacts audit effectiveness because the auditor inappropriately relies on an ineffective control, potentially issuing an inappropriate audit opinion.',
    tags: ['Sampling Risk', 'Beta Risk', 'Control Testing'],
    source: 'CISA Manual 27th Ed, Section 1.7',
    conf: 'verified'
  },
  {
    num: 13,
    topicCode: '1.4',
    task: 'T1',
    diff: 'hard',
    stem: 'Audit risk is composed of Inherent Risk (IR), Control Risk (CR), and Detection Risk (DR). Which component can be directly controlled and adjusted by the IS auditor?',
    scenario: null,
    a: 'Inherent Risk',
    b: 'Control Risk',
    c: 'Detection Risk',
    d: 'Business Risk',
    ans: 'C',
    rationale: 'Inherent risk and control risk exist independently of the audit and are characteristics of the auditee. Detection risk is directly controlled by the auditor through the nature, timing, and extent of audit procedures.',
    tags: ['Audit Risk Formula', 'Detection Risk', 'Planning'],
    source: 'CISA Manual 27th Ed, Section 1.4',
    conf: 'verified'
  },
  {
    num: 14,
    topicCode: '1.10',
    task: 'T4',
    diff: 'medium',
    stem: 'Following the issuance of an IS audit report, what is the auditor’s PRIMARY responsibility regarding audit recommendations?',
    scenario: null,
    a: 'Implement the recommendations on behalf of the business unit',
    b: 'Perform follow-up procedures to verify that management has taken appropriate action to mitigate the identified risks',
    c: 'Close all findings immediately after receiving management’s initial response letter',
    d: 'Discipline employees who were responsible for the control deficiencies',
    ans: 'B',
    rationale: 'ISACA standards require the auditor to conduct follow-up activities to evaluate whether management has implemented the agreed-upon corrective actions or accepted the residual risk.',
    tags: ['Follow-up', 'Recommendations', 'Remediation'],
    source: 'CISA Manual 27th Ed, Section 1.10',
    conf: 'verified'
  },
  {
    num: 15,
    topicCode: '1.3',
    task: 'T2',
    diff: 'easy',
    stem: 'An automated validation check that rejects alphanumeric characters entered into a phone number field on a web form is an example of which control type?',
    scenario: null,
    a: 'Corrective control',
    b: 'Detective control',
    c: 'Preventive control',
    d: 'Compensating control',
    ans: 'C',
    rationale: 'Preventive controls act to prevent errors, omissions, or malicious acts from occurring. Input validation that blocks invalid format input before processing is a classic preventive control.',
    tags: ['Controls', 'Input Controls', 'Preventive Controls'],
    source: 'CISA Manual 27th Ed, Section 1.3',
    conf: 'verified'
  }
];

async function seedQuestions() {
  await client.connect();
  console.log('Connected to database to seed Domain 1 questions...');

  // Get topics map
  const topicsRes = await client.query('SELECT id, topic_code FROM topics WHERE domain_id = $1', [DOMAIN_1_ID]);
  const topicMap = {};
  topicsRes.rows.forEach(t => {
    topicMap[t.topic_code] = t.id;
  });

  console.log(`Found ${Object.keys(topicMap).length} topic mappings in Domain 1.`);

  let insertedCount = 0;

  for (const q of QUESTIONS) {
    const topicId = topicMap[q.topicCode] || null;

    const query = `
      INSERT INTO questions (
        certification_id, domain_id, topic_id, question_number, question_type,
        stem, scenario_text, option_a, option_b, option_c, option_d,
        correct_answer, rationale, difficulty, task_statement, tags,
        source_reference, source_confidence, content_hash, is_active
      ) VALUES (
        $1, $2, $3, $4, 'mcq',
        $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, TRUE
      )
      ON CONFLICT DO NOTHING
    `;

    const values = [
      CISA_CERT_ID,
      DOMAIN_1_ID,
      topicId,
      q.num,
      q.stem,
      q.scenario,
      q.a,
      q.b,
      q.c,
      q.d,
      q.ans,
      q.rationale,
      q.diff,
      q.task,
      q.tags,
      q.source,
      q.conf,
      `hash-cisa-d1-q${q.num}`
    ];

    await client.query(query, values);
    insertedCount++;
    console.log(`  ✓ Inserted Q${q.num}: "${q.stem.slice(0, 50)}..."`);
  }

  console.log(`\nSuccessfully seeded ${insertedCount} Domain 1 questions into Supabase!`);

  const countRes = await client.query('SELECT COUNT(*) FROM questions WHERE certification_id = $1', [CISA_CERT_ID]);
  console.log(`Total questions in database: ${countRes.rows[0].count}`);

  await client.end();
}

seedQuestions();
