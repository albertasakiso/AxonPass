-- ===================================================================
-- APILIGU LEARNING PASS — Migration 015: Re-seed CISA to August 2024 Outline
-- Updates domain weights, names, and topics to ISACA's current
-- Exam Content Outline (effective 1 August 2024), per v3 §6.2 / Appendix A
-- ===================================================================

-- 1. Update CISA certification metadata
UPDATE certifications SET
  version = 'Exam Content Outline (Aug 2024)',
  passing_scaled_score = 450,
  scaled_score_min = 200,
  scaled_score_max = 800,
  study_mastery_threshold_pct = 80.00,
  format = 'fixed_form',
  code = 'CISA',
  body = 'ISACA'
WHERE slug = 'cisa';

-- 2. Update CISA domain names, weights, and approx questions to 2024 outline
-- Domain 1: 21% → 18%
UPDATE domains SET
  name = 'Information System Auditing Process',
  exam_weight_percent = 18.00,
  approx_exam_questions = 27,
  code = '1',
  learning_objectives = 'Master IS audit standards, risk-based audit planning, audit project management, sampling methodology, evidence collection, data analytics, reporting techniques, and quality assurance of the audit process.'
WHERE id = 'd0000000-0000-0000-0000-000000000001';

-- Domain 2: 17% → 18%
UPDATE domains SET
  name = 'Governance and Management of IT',
  exam_weight_percent = 18.00,
  approx_exam_questions = 27,
  code = '2',
  learning_objectives = 'Evaluate IT governance structures, laws and regulations, policies and standards, enterprise architecture, enterprise risk management, privacy programs, data governance, IT resource management, vendor management, performance monitoring, and quality management.'
WHERE id = 'd0000000-0000-0000-0000-000000000002';

-- Domain 3: 12% unchanged
UPDATE domains SET
  name = 'IS Acquisition, Development, and Implementation',
  exam_weight_percent = 12.00,
  approx_exam_questions = 18,
  code = '3',
  learning_objectives = 'Assess project governance and management, business case and feasibility analysis, system development methodologies, control identification and design, system readiness and implementation testing, configuration and release management, system migration, and post-implementation review.'
WHERE id = 'd0000000-0000-0000-0000-000000000003';

-- Domain 4: 23% → 26%
UPDATE domains SET
  name = 'IS Operations and Business Resilience',
  exam_weight_percent = 26.00,
  approx_exam_questions = 39,
  code = '4',
  learning_objectives = 'Evaluate IT components, asset management, job scheduling, system interfaces, shadow IT/EUC, availability and capacity management, problem and incident management, change/configuration/patch management, operational log management, IT service level management, database management, business impact analysis, system resilience, data backup and restoration, BCP, and DRP.'
WHERE id = 'd0000000-0000-0000-0000-000000000004';

-- Domain 5: 27% → 26%
UPDATE domains SET
  name = 'Protection of Information Assets',
  exam_weight_percent = 26.00,
  approx_exam_questions = 39,
  code = '5',
  learning_objectives = 'Audit information asset security policies, physical and environmental controls, identity and access management, network and endpoint security, DLP, data encryption, PKI, cloud and virtualized environments, mobile/wireless/IoT devices, security awareness, attack methods, security testing tools, security monitoring, incident response management, and evidence collection/forensics.'
WHERE id = 'd0000000-0000-0000-0000-000000000005';

-- 3. Clear old topic foreign keys and subtopics before updating topics
UPDATE questions SET topic_id = NULL WHERE domain_id = 'd0000000-0000-0000-0000-000000000001';
DELETE FROM subtopics WHERE topic_id IN (SELECT id FROM topics WHERE domain_id = 'd0000000-0000-0000-0000-000000000001');
DELETE FROM topics WHERE domain_id = 'd0000000-0000-0000-0000-000000000001';

-- 4. Insert all 55 topics from ISACA's August 2024 Exam Content Outline (Appendix A)

-- Domain 1 — Information System Auditing Process (18%) — 10 topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order) VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1A1', 'IS Audit Standards, Guidelines, Functions, and Codes of Ethics', 'A', 1),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1A2', 'Types of Audits, Assessments, and Reviews', 'A', 2),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1A3', 'Risk-Based Audit Planning', 'A', 3),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1A4', 'Types of Controls and Considerations', 'A', 4),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B1', 'Audit Project Management', 'B', 5),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B2', 'Audit Testing and Sampling Methodology', 'B', 6),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B3', 'Audit Evidence Collection Techniques', 'B', 7),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B4', 'Audit Data Analytics (including audit algorithms)', 'B', 8),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B5', 'Reporting and Communication Techniques', 'B', 9),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', '1B6', 'Quality Assurance and Improvement of Audit Process', 'B', 10)
ON CONFLICT DO NOTHING;

-- Domain 2 — Governance and Management of IT (18%) — 11 topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order) VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A1', 'Laws, Regulations, and Industry Standards', 'A', 1),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A2', 'Organizational Structure, IT Governance, and IT Strategy', 'A', 2),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A3', 'IT Policies, Standards, Procedures and Practices', 'A', 3),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A4', 'Enterprise Architecture (EA) and Considerations', 'A', 4),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A5', 'Enterprise Risk Management (ERM)', 'A', 5),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A6', 'Privacy Program and Principles', 'A', 6),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2A7', 'Data Governance and Classification', 'A', 7),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2B1', 'IT Resource Management', 'B', 8),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2B2', 'IT Vendor Management', 'B', 9),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2B3', 'IT Performance Monitoring and Reporting', 'B', 10),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', '2B4', 'Quality Assurance and Quality Management of IT', 'B', 11)
ON CONFLICT DO NOTHING;

-- Domain 3 — IS Acquisition, Development, and Implementation (12%) — 8 topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order) VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3A1', 'Project Governance and Management', 'A', 1),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3A2', 'Business Case and Feasibility Analysis', 'A', 2),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3A3', 'System Development Methodologies', 'A', 3),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3A4', 'Control Identification and Design', 'A', 4),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3B1', 'System Readiness and Implementation Testing', 'B', 5),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3B2', 'Implementation Configuration and Release Management', 'B', 6),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3B3', 'System Migration, Infrastructure Deployment, and Data Conversion', 'B', 7),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', '3B4', 'Post-Implementation Review', 'B', 8)
ON CONFLICT DO NOTHING;

-- Domain 4 — IS Operations and Business Resilience (26%) — 16 topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order) VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A1', 'IT Components', 'A', 1),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A2', 'IT Asset Management', 'A', 2),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A3', 'Job Scheduling and Production Process Automation', 'A', 3),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A4', 'System Interfaces', 'A', 4),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A5', 'Shadow IT and End-User Computing (EUC)', 'A', 5),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A6', 'Systems Availability and Capacity Management', 'A', 6),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A7', 'Problem and Incident Management', 'A', 7),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A8', 'IT Change, Configuration, and Patch Management', 'A', 8),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A9', 'Operational Log Management', 'A', 9),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A10', 'IT Service Level Management', 'A', 10),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4A11', 'Database Management', 'A', 11),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4B1', 'Business Impact Analysis (BIA)', 'B', 12),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4B2', 'System and Operational Resilience', 'B', 13),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4B3', 'Data Backup, Storage, and Restoration', 'B', 14),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4B4', 'Business Continuity Plan (BCP)', 'B', 15),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000004', '4B5', 'Disaster Recovery Plans (DRP)', 'B', 16)
ON CONFLICT DO NOTHING;

-- Domain 5 — Protection of Information Assets (26%) — 14 topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order) VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A1', 'Information Asset Security Policies, Frameworks, Standards, and Guidelines', 'A', 1),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A2', 'Physical and Environmental Controls', 'A', 2),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A3', 'Identity and Access Management', 'A', 3),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A4', 'Network and End-Point Security', 'A', 4),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A5', 'Data Loss Prevention (DLP)', 'A', 5),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A6', 'Data Encryption', 'A', 6),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A7', 'Public Key Infrastructure (PKI)', 'A', 7),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A8', 'Cloud and Virtualized Environments', 'A', 8),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5A9', 'Mobile, Wireless, and Internet-of-Things (IoT) Devices', 'A', 9),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B1', 'Security Awareness Training and Programs', 'B', 10),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B2', 'Information System Attack Methods and Techniques', 'B', 11),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B3', 'Security Testing Tools and Techniques', 'B', 12),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B4', 'Security Monitoring Logs, Tools, and Techniques', 'B', 13),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B5', 'Security Incident Response Management', 'B', 14),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000005', '5B6', 'Evidence Collection and Forensics', 'B', 15)
ON CONFLICT DO NOTHING;

-- 5. Update app_config: break reminder to 60 minutes per v3 §7.6
UPDATE app_config SET value = '60' WHERE key = 'break_reminder_minutes';

-- 6. Seed CISM, CRISC, CISSP certifications per v3 §7.2
INSERT INTO certifications (id, slug, code, body, name, version, publisher, format, total_domains, total_exam_questions, exam_duration_minutes, passing_score_percent, passing_scaled_score, scaled_score_min, scaled_score_max, study_mastery_threshold_pct, description)
VALUES
  ('a0000000-0000-0000-0000-000000000005', 'cism', 'CISM', 'ISACA', 'CISM — Certified Information Security Manager', 'Current Exam Content Outline', 'ISACA', 'fixed_form', 4, 150, 240, 80.00, 450, 200, 800, 80.00, 'The CISM certification validates expertise in information security governance, risk management, security program development and management, and incident management.'),
  ('a0000000-0000-0000-0000-000000000006', 'crisc', 'CRISC', 'ISACA', 'CRISC — Certified in Risk and Information Systems Control', 'Current Exam Content Outline', 'ISACA', 'fixed_form', 4, 150, 240, 80.00, 450, 200, 800, 80.00, 'The CRISC certification demonstrates expertise in IT risk identification, assessment, response, and monitoring, and information systems control design and implementation.'),
  ('a0000000-0000-0000-0000-000000000007', 'cissp', 'CISSP', 'ISC2', 'CISSP — Certified Information Systems Security Professional', 'Current CBK', 'ISC2', 'adaptive_cat', 8, 150, 240, 70.00, 700, 0, 1000, 80.00, 'The CISSP certification demonstrates mastery across 8 CBK domains of information security. Uses Computerized Adaptive Testing (CAT) with 125-175 questions.')
ON CONFLICT (slug) DO UPDATE SET
  code = EXCLUDED.code,
  body = EXCLUDED.body,
  format = EXCLUDED.format,
  passing_scaled_score = EXCLUDED.passing_scaled_score,
  scaled_score_min = EXCLUDED.scaled_score_min,
  scaled_score_max = EXCLUDED.scaled_score_max,
  study_mastery_threshold_pct = EXCLUDED.study_mastery_threshold_pct;
