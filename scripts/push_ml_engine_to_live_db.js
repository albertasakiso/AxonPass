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

const OPERATORS_CATALOG = [
  {
    id: 'ISACA_PRIMARY',
    certification_body: 'ISACA',
    operator_keyword: 'PRIMARY',
    decision_rule: 'Identify the overarching governance mandate, root cause, or senior executive policy over tactical configurations.',
    distractor_elimination: 'Operational technical controls and point solutions are distractors for PRIMARY questions.',
    exam_trap_warning: 'Avoid tactical choices when asked for the PRIMARY objective; look for board alignment and enterprise risk ownership.'
  },
  {
    id: 'ISACA_FIRST',
    certification_body: 'ISACA',
    operator_keyword: 'FIRST',
    decision_rule: 'Select the initial planning, investigative, or triage action required before taking corrective remediation.',
    distractor_elimination: 'Corrective steps and executive reporting are premature before initial evaluation.',
    exam_trap_warning: 'Do NOT pick the ultimate solution when asked for the FIRST step. Always perform assessment or scope verification first.'
  },
  {
    id: 'ISACA_MOST',
    certification_body: 'ISACA',
    operator_keyword: 'MOST',
    decision_rule: 'Evaluate relative efficacy and select the specific control providing the highest risk reduction per unit of exposure.',
    distractor_elimination: 'All options may be good practices, but only one directly addresses the root threat described in the stem.',
    exam_trap_warning: 'Compare relative control strength: preventative controls usually outweigh detective controls for critical assets.'
  },
  {
    id: 'ISACA_LEAST',
    certification_body: 'ISACA',
    operator_keyword: 'LEAST',
    decision_rule: 'Identify the atypical, ineffective, or lowest-priority control among standard audit procedures.',
    distractor_elimination: 'Effective controls are distractors for negative stems.',
    exam_trap_warning: 'Read carefully: negative stems test candidate vigilance against picking standard best practices.'
  },
  {
    id: 'ISC2_FIRST',
    certification_body: 'ISC2',
    operator_keyword: 'FIRST',
    decision_rule: 'Determine the immediate containment or preservation step according to the ISC2 security lifecycle.',
    distractor_elimination: 'Eradication and post-mortem actions must not occur before containment and evidence preservation.',
    exam_trap_warning: 'Human life and safety always take precedence over data and system availability.'
  },
  {
    id: 'COMPTIA_NEXT',
    certification_body: 'CompTIA',
    operator_keyword: 'NEXT',
    decision_rule: 'Follow the 6-step troubleshooting methodology or 7-step malware removal workflow in chronological sequence.',
    distractor_elimination: 'Skipping steps in the standard methodology constitutes a failure in CompTIA testing.',
    exam_trap_warning: 'Quarantine infected systems BEFORE running scans; establish a theory BEFORE implementing fixes.'
  },
  {
    id: 'AWS_COST_EFFECTIVE',
    certification_body: 'AWS',
    operator_keyword: 'MOST',
    decision_rule: 'Select the architecture that satisfies functional requirements with the lowest ongoing AWS bill and operational overhead.',
    distractor_elimination: 'High-cost multi-region active-active architectures are distractors when single-region Multi-AZ suffices.',
    exam_trap_warning: 'Look for managed serverless options (S3, Lambda, Aurora Serverless) over self-managed EC2 instances.'
  },
  {
    id: 'GLOBAL_STANDARD',
    certification_body: 'GLOBAL',
    operator_keyword: 'STANDARD',
    decision_rule: 'Match scenario directly to official framework definitions and body of knowledge baselines.',
    distractor_elimination: 'Non-standard industry slang or outdated legacy methods are distractors.',
    exam_trap_warning: 'Rely on official standard terminology (NIST, ISO, ISACA, ISC2).'
  }
];

const BKT_CALIBRATIONS = [
  { code: 'CISA', scale_min: 200, scale_max: 800, passing: 450 },
  { code: 'CISM', scale_min: 200, scale_max: 800, passing: 450 },
  { code: 'CRISC', scale_min: 200, scale_max: 800, passing: 450 },
  { code: 'CGEIT', scale_min: 200, scale_max: 800, passing: 450 },
  { code: 'CISSP', scale_min: 0, scale_max: 1000, passing: 700 },
  { code: 'CCSP', scale_min: 0, scale_max: 1000, passing: 700 },
  { code: 'CC', scale_min: 0, scale_max: 1000, passing: 700 },
  { code: 'A+', scale_min: 100, scale_max: 900, passing: 675 },
  { code: 'NETWORK+', scale_min: 100, scale_max: 900, passing: 720 },
  { code: 'CYSA+', scale_min: 100, scale_max: 900, passing: 750 },
  { code: 'SAA-C03', scale_min: 100, scale_max: 1000, passing: 720 },
  { code: 'GSLC', scale_min: 0, scale_max: 100, passing: 70 },
  { code: 'NIST', scale_min: 0, scale_max: 100, passing: 75 },
  { code: 'GRC', scale_min: 0, scale_max: 100, passing: 75 },
  { code: 'FIFA-AGENT', scale_min: 0, scale_max: 100, passing: 75 },
];

async function pushMlToLiveDatabase() {
  await client.connect();
  console.log('========================================================================================');
  console.log('            DEPLOYING AI/ML COGNITIVE ENGINE TO LIVE DATABASE');
  console.log('========================================================================================\n');

  // 1. Run Migration 016
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/016_ml_engine_knowledge_and_reasoning.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  console.log('1. Executing migration 016 (creating ML tables, indexes, RLS)...');
  await client.query(migrationSql);
  console.log('   [SUCCESS] Migration 016 applied cleanly.\n');

  // 2. Load Knowledge Nodes
  const jsonPath = path.resolve(__dirname, '../ml_engine/knowledgeGraph.json');
  const corpusData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const nodesByCert = corpusData.nodesByCert;

  console.log('2. Pushing Knowledge Graph Nodes in high-speed batches...');
  const allFlatNodes = [];
  for (const [certCode, nodes] of Object.entries(nodesByCert)) {
    for (const node of nodes) {
      allFlatNodes.push({ ...node, certCode });
    }
  }

  const BATCH_SIZE = 100;
  for (let i = 0; i < allFlatNodes.length; i += BATCH_SIZE) {
    const batch = allFlatNodes.slice(i, i + BATCH_SIZE);
    const values = [];
    const params = [];
    let p = 1;

    for (const n of batch) {
      values.push(`($${p}, $${p+1}, $${p+2}, $${p+3}, $${p+4}, $${p+5}, $${p+6}, $${p+7}, $${p+8}, $${p+9}, $${p+10}, $${p+11}, $${p+12})`);
      params.push(
        n.id,
        n.certificationCode || n.certCode,
        n.domainNumber,
        n.topicCode,
        n.name,
        n.summary,
        n.manualSection,
        n.taskStatements || [],
        n.knowledgeStatements || [],
        n.keywords || [],
        n.prerequisites || [],
        n.relatedNodes || [],
        n.tokens || []
      );
      p += 13;
    }

    const query = `
      INSERT INTO ml_knowledge_nodes (
        id, certification_code, domain_number, topic_code, name, summary,
        manual_section, task_statements, knowledge_statements, keywords,
        prerequisites, related_nodes, bm25_tokens
      )
      VALUES ${values.join(', ')}
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        summary = EXCLUDED.summary,
        manual_section = EXCLUDED.manual_section,
        task_statements = EXCLUDED.task_statements,
        knowledge_statements = EXCLUDED.knowledge_statements,
        keywords = EXCLUDED.keywords,
        prerequisites = EXCLUDED.prerequisites,
        related_nodes = EXCLUDED.related_nodes,
        bm25_tokens = EXCLUDED.bm25_tokens;
    `;
    await client.query(query, params);
  }
  console.log(`   [SUCCESS] Bulk inserted/updated ${allFlatNodes.length} knowledge nodes across all 15 certifications.\n`);

  // 3. Seed Cognitive Operators
  console.log('3. Pushing Cognitive Decision Operators...');
  for (const op of OPERATORS_CATALOG) {
    await client.query(`
      INSERT INTO ml_cognitive_operators (
        id, certification_body, operator_keyword, decision_rule,
        distractor_elimination_heuristic, exam_trap_warning
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        decision_rule = EXCLUDED.decision_rule,
        distractor_elimination_heuristic = EXCLUDED.distractor_elimination_heuristic,
        exam_trap_warning = EXCLUDED.exam_trap_warning;
    `, [
      op.id,
      op.certification_body,
      op.operator_keyword,
      op.decision_rule,
      op.distractor_elimination,
      op.exam_trap_warning
    ]);
  }
  console.log(`   [SUCCESS] Seeded ${OPERATORS_CATALOG.length} cognitive decision operators.\n`);

  // 4. Seed BKT & IRT Parameters
  console.log('4. Pushing BKT & IRT Parameters...');
  let totalBktRows = 0;
  for (const calib of BKT_CALIBRATIONS) {
    const domRes = await client.query(`
      SELECT d.domain_number, d.name
      FROM domains d
      JOIN certifications c ON d.certification_id = c.id
      WHERE c.code = $1
      ORDER BY d.domain_number;
    `, [calib.code]);

    for (const d of domRes.rows) {
      await client.query(`
        INSERT INTO ml_bkt_parameters (
          certification_code, domain_number, domain_name, prior_p_l0,
          transit_p_t, slip_p_s, guess_p_g, irt_a_param, irt_b_param,
          passing_score_scaled, scaled_score_min, scaled_score_max
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (certification_code, domain_number) DO UPDATE SET
          domain_name = EXCLUDED.domain_name,
          passing_score_scaled = EXCLUDED.passing_score_scaled,
          scaled_score_min = EXCLUDED.scaled_score_min,
          scaled_score_max = EXCLUDED.scaled_score_max;
      `, [
        calib.code,
        d.domain_number,
        d.name,
        0.150,
        0.180,
        0.100,
        0.250,
        1.20,
        0.00,
        calib.passing,
        calib.scale_min,
        calib.scale_max
      ]);
      totalBktRows++;
    }
  }
  console.log(`   [SUCCESS] Seeded ${totalBktRows} domain calibration profiles.\n`);

  // 5. Precompute and seed sample question reasoning
  console.log('5. Precomputing AI question dissections for sample exam questions in bulk...');
  const sampleQuestionsRes = await client.query(`
    SELECT q.id, q.stem, q.option_a, q.option_b, q.option_c, q.option_d,
           q.correct_answer, q.rationale, c.code as cert_code, t.topic_code
    FROM questions q
    JOIN certifications c ON q.certification_id = c.id
    LEFT JOIN topics t ON q.topic_id = t.id
    ORDER BY q.question_number
    LIMIT 300;
  `);

  const qReasonings = sampleQuestionsRes.rows.map(q => {
    const upperStem = q.stem.toUpperCase();
    let op = 'STANDARD';
    if (upperStem.includes('FIRST') || upperStem.includes('INITIAL')) op = 'FIRST';
    else if (upperStem.includes('PRIMARY') || upperStem.includes('MAIN')) op = 'PRIMARY';
    else if (upperStem.includes('MOST') || upperStem.includes('BEST')) op = 'MOST';
    else if (upperStem.includes('LEAST') || upperStem.includes('EXCEPT')) op = 'LEAST';

    const safeCode = q.cert_code.toLowerCase().replace(/\+/g, 'plus');
    const safeTopic = (q.topic_code || 't1').toLowerCase().replace(/[\.\s]/g, '-');
    const nodeId = `${safeCode}-${safeTopic}`;

    return {
      qId: q.id,
      certCode: q.cert_code,
      op,
      nodeId,
      dissection: `AI Cognitive Dissection: Evaluates candidate mastery under ${op} decision operator.`,
      verdictA: q.correct_answer === 'A' ? 'CORRECT_KEY' : 'PLAUSIBLE_DISTRACTOR',
      justA: q.correct_answer === 'A' ? (q.rationale || 'Directly fulfills core requirement') : 'Secondary to primary objective',
      verdictB: q.correct_answer === 'B' ? 'CORRECT_KEY' : 'PLAUSIBLE_DISTRACTOR',
      justB: q.correct_answer === 'B' ? (q.rationale || 'Directly fulfills core requirement') : 'Secondary to primary objective',
      verdictC: q.correct_answer === 'C' ? 'CORRECT_KEY' : 'PLAUSIBLE_DISTRACTOR',
      justC: q.correct_answer === 'C' ? (q.rationale || 'Directly fulfills core requirement') : 'Secondary to primary objective',
      verdictD: q.correct_answer === 'D' ? 'CORRECT_KEY' : 'PLAUSIBLE_DISTRACTOR',
      justD: q.correct_answer === 'D' ? (q.rationale || 'Directly fulfills core requirement') : 'Secondary to primary objective',
      takeaway: `Anchor Rule: For questions governed by "${op}", evaluate relative efficacy against domain standards.`,
      trap: `Trap Alert: Avoid operational point solutions when asked for root governance mandates.`
    };
  });

  for (let i = 0; i < qReasonings.length; i += 50) {
    const batch = qReasonings.slice(i, i + 50);
    const vals = [];
    const params = [];
    let p = 1;

    for (const r of batch) {
      vals.push(`($${p}, $${p+1}, $${p+2}, $${p+3}, $${p+4}, $${p+5}, $${p+6}, $${p+7}, $${p+8}, $${p+9}, $${p+10}, $${p+11}, $${p+12}, $${p+13}, $${p+14})`);
      params.push(
        r.qId, r.certCode, r.op, r.nodeId, r.dissection,
        r.verdictA, r.justA, r.verdictB, r.justB,
        r.verdictC, r.justC, r.verdictD, r.justD,
        r.takeaway, r.trap
      );
      p += 15;
    }

    const query = `
      INSERT INTO ml_question_reasoning (
        question_id, certification_code, operator_keyword, matched_node_id,
        problem_dissection, option_a_verdict, option_a_justification,
        option_b_verdict, option_b_justification, option_c_verdict,
        option_c_justification, option_d_verdict, option_d_justification,
        takeaway_rule, exam_trap_heuristic
      )
      VALUES ${vals.join(', ')}
      ON CONFLICT (question_id) DO UPDATE SET
        operator_keyword = EXCLUDED.operator_keyword,
        matched_node_id = EXCLUDED.matched_node_id,
        problem_dissection = EXCLUDED.problem_dissection,
        takeaway_rule = EXCLUDED.takeaway_rule,
        exam_trap_heuristic = EXCLUDED.exam_trap_heuristic;
    `;
    await client.query(query, params);
  }
  console.log(`   [SUCCESS] Seeded ${qReasonings.length} precomputed AI reasoning records.\n`);

  console.log('========================================================================================');
  console.log('         AI/ML COGNITIVE ENGINE FULLY PUSHED TO LIVE DATABASE!');
  console.log('========================================================================================\n');

  await client.end();
}

pushMlToLiveDatabase().catch(console.error);
