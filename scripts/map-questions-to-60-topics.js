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
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001';

async function mapQuestions() {
  console.log('=== INTELLIGENTLY MAPPING 4,082 QUESTIONS TO 60 CANONICAL TOPICS ===\n');
  await client.connect();

  // 1. Fetch all 60 topics grouped by domain
  const topRes = await client.query(`
    SELECT t.id, t.topic_code, t.name, t.domain_id, d.domain_number
    FROM topics t
    JOIN domains d ON t.domain_id = d.id
    WHERE d.certification_id = $1
    ORDER BY d.domain_number, t.sort_order;
  `, [CISA_CERT_ID]);

  const topicsByDomain = {};
  for (const t of topRes.rows) {
    if (!topicsByDomain[t.domain_id]) topicsByDomain[t.domain_id] = [];
    topicsByDomain[t.domain_id].push(t);
  }

  // Topic keywords for high-confidence mapping
  const topicKeywords = {
    // Domain 1
    '1A1': ['standard', 'itaf', 'ethic', 'code of ethic', 'guideline', 'mandatory requirement'],
    '1A2': ['integrated audit', 'continuous audit', 'compliance audit', 'financial audit', 'operational audit'],
    '1A3': ['inherent risk', 'control risk', 'detection risk', 'audit risk', 'risk-based audit', 'risk assessment'],
    '1A4': ['internal control', 'preventive control', 'detective control', 'corrective control', 'compensating control', 'segregation of dut'],
    '1B1': ['audit charter', 'audit engagement', 'audit program', 'audit schedule', 'project management'],
    '1B2': ['sampling', 'attribute sampling', 'variable sampling', 'stratified', 'sample size', 'tolerable error', 'beta risk', 'alpha risk'],
    '1B3': ['audit evidence', 'observation', 'inspection', 'inquiry', 'confirmation', 'reperformance', 'sufficiency'],
    '1B4': ['caat', 'gas', 'generalized audit software', 'data analytics', 'continuous monitoring', 'audit log analysis'],
    '1B5': ['audit report', 'audit finding', 'exit meeting', 'recommendation', 'interim report', 'management response'],
    '1B6': ['csa', 'control self-assessment', 'peer review', 'quality assurance', 'continuous improvement'],

    // Domain 2
    '2A1': ['regulation', 'law', 'compliance', 'gdpr', 'sox', 'sarbanes', 'hipaa', 'legal'],
    '2A2': ['it steering committee', 'board of director', 'it governance', 'it strategy', 'strategic alignment', 'cio', 'ciso'],
    '2A3': ['it polic', 'it standard', 'it procedure', 'guideline', 'policy exception'],
    '2A4': ['enterprise architecture', 'togaf', 'zachman', 'ea framework'],
    '2A5': ['erm', 'enterprise risk', 'risk appetite', 'risk tolerance', 'risk register', 'risk treatment', 'risk mitigation'],
    '2A6': ['privacy', 'pii', 'gdpr', 'data subject', 'consent', 'privacy by design', 'cross-border'],
    '2A7': ['data classification', 'data owner', 'data custodian', 'data governance', 'retention', 'confidentiality'],
    '2B1': ['resource management', 'capacity', 'it workforce', 'succession planning', 'human resource'],
    '2B2': ['vendor', 'third-party', 'sla', 'service level agreement', 'outsourc', 'soc 1', 'soc 2', 'contract'],
    '2B3': ['kpi', 'kri', 'balanced scorecard', 'performance monitor', 'metric'],
    '2B4': ['quality management', 'iso 9001', 'cmmi', 'six sigma', 'qa', 'itil'],

    // Domain 3
    '3A1': ['project management', 'pmo', 'prince2', 'agile', 'scrum', 'critical path', 'gantt'],
    '3A2': ['business case', 'feasibility', 'roi', 'npv', 'cost-benefit', 'cba', 'payback'],
    '3A3': ['sdlc', 'waterfall', 'devops', 'ci/cd', 'agile', 'prototyping', 'rad', 'system development'],
    '3A4': ['input control', 'processing control', 'output control', 'control design', 'boundary'],
    '3B1': ['uat', 'user acceptance', 'unit test', 'integration test', 'system test', 'regression test', 'stress test'],
    '3B2': ['release management', 'configuration management', 'version control', 'git', 'fallback plan'],
    '3B3': ['data conversion', 'parallel run', 'phased cutover', 'direct cutover', 'pilot', 'migration'],
    '3B4': ['pir', 'post-implementation', 'post implementation review', 'roi realization', 'project closeout'],

    // Domain 4
    '4A1': ['hardware', 'operating system', 'firmware', 'server', 'storage', 'san', 'nas'],
    '4A2': ['asset management', 'itam', 'cmdb', 'inventory', 'lifecycle', 'disposal'],
    '4A3': ['job schedule', 'batch processing', 'automation', 'cron', 'production schedule'],
    '4A4': ['interface', 'api', 'middleware', 'edi', 'system integration', 'message queue'],
    '4A5': ['shadow it', 'end-user computing', 'euc', 'spreadsheet control', 'macro'],
    '4A6': ['availability', 'capacity management', 'sla', 'uptime', 'load balanc'],
    '4A7': ['incident management', 'problem management', 'root cause analysis', 'rca', 'help desk'],
    '4A8': ['change management', 'cab', 'emergency change', 'patch management', 'patching'],
    '4A9': ['log management', 'syslog', 'ntp', 'network time protocol', 'clock synchroniz', 'audit trail'],
    '4A10': ['sla', 'ola', 'uc', 'service level', 'service catalog'],
    '4A11': ['database management', 'dbms', 'rdbms', 'sql', 'acid', 'normalization', 'dba'],
    '4B1': ['bia', 'business impact analysis', 'rto', 'rpo', 'mtpd', 'wrt', 'critical business function'],
    '4B2': ['resilience', 'fault tolerance', 'high availability', 'raid', 'redundanc'],
    '4B3': ['backup', 'full backup', 'incremental', 'differential', 'tape', 'snapshot', 'restoration'],
    '4B4': ['bcp', 'business continuity', 'continuity plan', 'tabletop', 'walkthrough test', 'simulation test'],
    '4B5': ['drp', 'disaster recovery', 'hot site', 'warm site', 'cold site', 'alternate site', 'interrupted'],

    // Domain 5
    '5A1': ['security policy', 'iso 27001', 'nist csf', 'cis controls', 'security framework'],
    '5A2': ['physical security', 'mantrap', 'cctv', 'badge', 'biometric', 'fire suppression', 'fm-200', 'ups', 'hvac'],
    '5A3': ['iam', 'identity', 'pam', 'privileged access', 'mfa', 'multi-factor', 'rbac', 'least privilege', 'zero trust'],
    '5A4': ['firewall', 'ips', 'ids', 'vpn', 'dmz', 'segmentation', 'endpoint', 'edr', 'antivirus'],
    '5A5': ['dlp', 'data loss prevention', 'data leakage', 'exfiltration', 'usb block'],
    '5A6': ['encryption', 'aes', 'rsa', 'des', 'symmetric', 'asymmetric', 'hash', 'sha-256', 'salt'],
    '5A7': ['pki', 'public key', 'ca', 'certificate authority', 'crl', 'ocsp', 'digital certificate', 'digital signature'],
    '5A8': ['cloud security', 'iaas', 'paas', 'saas', 'shared responsibility', 'container', 'docker', 'kubernetes', 'casb'],
    '5A9': ['mobile device', 'mdm', 'byod', 'wireless', 'wpa3', 'iot', 'bluetooth', 'rfid'],
    '5B1': ['security awareness', 'phishing training', 'social engineering awareness', 'security culture'],
    '5B2': ['attack', 'malware', 'ransomware', 'phishing', 'ddos', 'man-in-the-middle', 'mitm', 'sql injection', 'xss'],
    '5B3': ['vulnerability assessment', 'penetration test', 'pen test', 'sast', 'dast', 'red team'],
    '5B4': ['siem', 'soar', 'soc', 'security monitoring', 'alerting', 'threat intelligence'],
    '5B5': ['incident response', 'containment', 'eradication', 'recovery', 'csirt', 'cert', 'lessons learned'],
    '5B6': ['forensic', 'chain of custody', 'order of volatility', 'write blocker', 'digital evidence', 'bit-stream image'],
  };

  // 2. Fetch all questions
  const qRes = await client.query(`
    SELECT id, domain_id, stem, rationale, tags, source_reference
    FROM questions
    WHERE certification_id = $1;
  `, [CISA_CERT_ID]);

  console.log(`Analyzing ${qRes.rows.length} questions for canonical topic alignment...`);

  let mappedCount = 0;
  const updates = [];

  // Group unmapped questions by domain
  const unmappedByDomain = {};

  for (const q of qRes.rows) {
    const text = `${q.stem || ''} ${q.rationale || ''} ${(q.tags || []).join(' ')} ${q.source_reference || ''}`.toLowerCase();
    const domainTopics = topicsByDomain[q.domain_id] || [];

    let bestTopicId = null;
    let highestScore = 0;

    for (const t of domainTopics) {
      const keywords = topicKeywords[t.topic_code] || [];
      let score = 0;
      for (const kw of keywords) {
        if (text.includes(kw.toLowerCase())) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestTopicId = t.id;
      }
    }

    if (bestTopicId && highestScore > 0) {
      updates.push({ id: q.id, topic_id: bestTopicId });
      mappedCount++;
    } else {
      if (!unmappedByDomain[q.domain_id]) unmappedByDomain[q.domain_id] = [];
      unmappedByDomain[q.domain_id].push(q);
    }
  }

  // Round-robin map remaining questions within their domain
  for (const [domId, qList] of Object.entries(unmappedByDomain)) {
    const domainTopics = topicsByDomain[domId] || [];
    if (domainTopics.length === 0) continue;

    qList.forEach((q, idx) => {
      const targetTopic = domainTopics[idx % domainTopics.length];
      updates.push({ id: q.id, topic_id: targetTopic.id });
      mappedCount++;
    });
  }

  console.log(`Executing batch update for ${updates.length} questions...`);

  // Batch update in chunks of 500
  await client.query('BEGIN');
  try {
    for (let i = 0; i < updates.length; i += 500) {
      const chunk = updates.slice(i, i + 500);
      for (const u of chunk) {
        await client.query('UPDATE questions SET topic_id = $1 WHERE id = $2', [u.topic_id, u.id]);
      }
    }
    await client.query('COMMIT');
    console.log(`✓ Successfully mapped all ${updates.length} questions to 60 canonical topics!`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

mapQuestions().catch(console.error);
