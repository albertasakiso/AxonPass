-- ===================================================================
-- APILIGU LEARNING PASS — Migration 012: Multi-Certification Curriculum & Learning Modules
-- ===================================================================

-- 1. Adjust column types if needed
ALTER TABLE certifications ALTER COLUMN version TYPE VARCHAR(100);

-- 2. Enhance subtopics table with rich learning fields
ALTER TABLE subtopics ADD COLUMN IF NOT EXISTS exam_tips TEXT;
ALTER TABLE subtopics ADD COLUMN IF NOT EXISTS estimated_read_minutes INTEGER DEFAULT 10;
ALTER TABLE subtopics ADD COLUMN IF NOT EXISTS learning_objectives TEXT;

-- 3. Ensure glossary terms table has category column and unique constraint
ALTER TABLE glossary_terms ADD COLUMN IF NOT EXISTS category VARCHAR(100);
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'glossary_terms_cert_term_key'
  ) THEN
    ALTER TABLE glossary_terms ADD CONSTRAINT glossary_terms_cert_term_key UNIQUE (certification_id, term);
  END IF;
END $$;

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read glossary_terms" ON glossary_terms;
CREATE POLICY "Public read glossary_terms"
  ON glossary_terms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role manage glossary_terms" ON glossary_terms;
CREATE POLICY "Service role manage glossary_terms"
  ON glossary_terms FOR ALL TO service_role USING (true);

-- 4. Upsert Certifications
INSERT INTO certifications (id, slug, name, version, publisher, total_domains, total_exam_questions, exam_duration_minutes, passing_score_percent, description)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'cisa', 'CISA — Certified Information Systems Auditor', '28th Edition (2024)', 'ISACA', 5, 150, 240, 80.00, 'The CISA designation is a globally recognized certification for IS audit control, assurance, and security professionals.'),
  ('a0000000-0000-0000-0000-000000000002', 'isc2-cc', 'ISC2 — Certified in Cybersecurity (CC)', '2024/2025 Edition', 'ISC2', 5, 100, 120, 70.00, 'Entry-level cybersecurity certification proving foundational knowledge in security principles, access control, incident response, network security, and security operations.'),
  ('a0000000-0000-0000-0000-000000000003', 'aws-csaa', 'AWS Certified Solutions Architect — Associate (SAA-C03)', 'SAA-C03', 'Amazon Web Services', 4, 65, 130, 72.00, 'Validates expertise in designing highly available, cost-effective, fault-tolerant, and scalable distributed systems on AWS.'),
  ('a0000000-0000-0000-0000-000000000004', 'nist-grc', 'NIST AI RMF & Enterprise GRC Specialist', 'NIST AI 100-1 / CSF 2.0', 'NIST & ISO', 4, 100, 150, 75.00, 'Comprehensive mastery of the NIST AI Risk Management Framework, Governance, Risk, and Compliance (GRC) program implementation.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  version = EXCLUDED.version,
  publisher = EXCLUDED.publisher,
  total_domains = EXCLUDED.total_domains,
  total_exam_questions = EXCLUDED.total_exam_questions,
  exam_duration_minutes = EXCLUDED.exam_duration_minutes,
  passing_score_percent = EXCLUDED.passing_score_percent,
  description = EXCLUDED.description;

-- 5. Upsert Domains for CISA (Domains 1 to 5)
INSERT INTO domains (id, certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title, sort_order, learning_objectives)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'Information Systems Auditing Process', 21.00, 32, 'Planning', 'Execution', 1, 'Master audit standards, risk-based audit planning, audit project management, sampling, evidence collection, and reporting techniques.'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 'Governance and Management of IT', 17.00, 26, 'IT Governance', 'IT Management', 2, 'Evaluate IT organizational structure, strategic alignment, risk management frameworks, policies, and resource management.'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 'Information Systems Acquisition, Development & Implementation', 12.00, 18, 'IS Acquisition and Development', 'IS Implementation', 3, 'Assess business case analysis, project management, system development methodologies (SDLC/Agile), controls, and post-implementation reviews.'),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 4, 'Information Systems Operations and Business Resilience', 23.00, 34, 'IS Operations', 'Business Resilience', 4, 'Evaluate IT service management, hardware and infrastructure monitoring, database administration, disaster recovery planning (DRP), and business continuity (BCP).'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 5, 'Protection of Information Assets', 27.00, 41, 'Information Asset Security and Control', 'Security Event Management', 5, 'Audit logical and physical access controls, network security architecture, data encryption, incident management, and security awareness programs.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  exam_weight_percent = EXCLUDED.exam_weight_percent,
  approx_exam_questions = EXCLUDED.approx_exam_questions,
  part_a_title = EXCLUDED.part_a_title,
  part_b_title = EXCLUDED.part_b_title,
  sort_order = EXCLUDED.sort_order,
  learning_objectives = EXCLUDED.learning_objectives;

-- 6. Upsert Domains for ISC2 CC
INSERT INTO domains (id, certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title, sort_order, learning_objectives)
VALUES
  ('d0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 1, 'Security Principles', 26.00, 26, 'Information Assurance', 'Risk Management', 1, 'Understand CIA Triad, authentication, authorization, non-repudiation, risk management, and the ISC2 Code of Ethics.'),
  ('d0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 2, 'Incident Response, Business Continuity & Disaster Recovery', 10.00, 10, 'Incident Response (IR)', 'BC & DR Concepts', 2, 'Differentiate between Incident Response, Business Continuity (BCP), and Disaster Recovery Plans (DRP).'),
  ('d0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 3, 'Access Controls Concepts', 22.00, 22, 'Access Control Fundamentals', 'Identity Management', 3, 'Master Physical & Logical access controls, DAC, MAC, RBAC, and multi-factor authentication (MFA).'),
  ('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000002', 4, 'Network Security', 24.00, 24, 'Network Architecture', 'Network Threats & Protection', 4, 'Understand TCP/IP, OSI model, firewalls, VPNs, microsegmentation, and network attack vectors.'),
  ('d0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 5, 'Security Operations', 18.00, 18, 'Data & System Security', 'Policies & Best Practices', 5, 'Understand data security lifecycle, system hardening, patch management, and security awareness training.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  exam_weight_percent = EXCLUDED.exam_weight_percent,
  approx_exam_questions = EXCLUDED.approx_exam_questions,
  part_a_title = EXCLUDED.part_a_title,
  part_b_title = EXCLUDED.part_b_title,
  sort_order = EXCLUDED.sort_order,
  learning_objectives = EXCLUDED.learning_objectives;

-- 7. Upsert Domains for AWS CSAA
INSERT INTO domains (id, certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title, sort_order, learning_objectives)
VALUES
  ('d0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 1, 'Design Secure Architectures', 30.00, 20, 'IAM & Access Management', 'Data & Infrastructure Security', 1, 'Design secure access to AWS resources, secure application tiers, and data protection at rest and in transit.'),
  ('d0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000003', 2, 'Design Resilient Architectures', 26.00, 17, 'High Availability', 'Disaster Recovery Strategies', 2, 'Design scalable, loosely coupled, and highly available architectures across Multi-AZ and Multi-Region environments.'),
  ('d0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000003', 3, 'Design High-Performing Architectures', 24.00, 15, 'Compute & Storage Selection', 'Database & Networking Caching', 3, 'Select high-performing storage, compute, database solutions, and caching layers like CloudFront and ElastiCache.'),
  ('d0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 4, 'Design Cost-Optimized Architectures', 20.00, 13, 'Cost-Effective Storage & Compute', 'Data Transfer Optimization', 4, 'Optimize storage tiering (S3 Glacier/Intelligent-Tiering), compute purchasing models (Savings Plans/Spot), and networking costs.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  exam_weight_percent = EXCLUDED.exam_weight_percent,
  approx_exam_questions = EXCLUDED.approx_exam_questions,
  part_a_title = EXCLUDED.part_a_title,
  part_b_title = EXCLUDED.part_b_title,
  sort_order = EXCLUDED.sort_order,
  learning_objectives = EXCLUDED.learning_objectives;

-- 8. Upsert Domains for NIST GRC
INSERT INTO domains (id, certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title, sort_order, learning_objectives)
VALUES
  ('d0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000004', 1, 'GOVERN: AI Governance & Risk Culture', 25.00, 25, 'Organizational Structures', 'Policies & Accountability', 1, 'Establish organizational AI risk governance, ethical AI principles, roles, risk tolerances, and compliance policies.'),
  ('d0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000004', 2, 'MAP: Context & Risk Identification', 25.00, 25, 'AI System Categorization', 'Impact Assessment', 2, 'Map AI system context, evaluate societal and organizational impacts, identify third-party AI risks, and establish lifecycle stages.'),
  ('d0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000004', 3, 'MEASURE: Assessment & Testing', 25.00, 25, 'Trustworthiness Metrics', 'Continuous Evaluation', 3, 'Employ quantitative and qualitative metrics to evaluate bias, explainability, safety, security, and resilience of AI models.'),
  ('d0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000004', 4, 'MANAGE: Risk Treatment & Incident Response', 25.00, 25, 'Mitigation Strategies', 'Monitoring & Response', 4, 'Implement risk response strategies, incident response for AI failures, continuous monitoring, and continuous improvement.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  exam_weight_percent = EXCLUDED.exam_weight_percent,
  approx_exam_questions = EXCLUDED.approx_exam_questions,
  part_a_title = EXCLUDED.part_a_title,
  part_b_title = EXCLUDED.part_b_title,
  sort_order = EXCLUDED.sort_order,
  learning_objectives = EXCLUDED.learning_objectives;
