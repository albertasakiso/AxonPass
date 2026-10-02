-- ===================================================================
-- APILIGU LEARNING PASS — Migration 010: Seed CISA Data
-- ===================================================================

-- Insert CISA certification
INSERT INTO certifications (id, slug, name, version, publisher, total_domains, total_exam_questions, exam_duration_minutes, passing_score_percent, description)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'cisa',
  'CISA — Certified Information Systems Auditor',
  '27th Edition (2019)',
  'ISACA',
  5,
  150,
  240,
  80.00,
  'The Certified Information Systems Auditor (CISA) certification is a globally recognized standard of achievement among information systems audit, control, and security professionals.'
) ON CONFLICT (slug) DO NOTHING;

-- Insert 5 CISA domains
INSERT INTO domains (id, certification_id, domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title, sort_order, learning_objectives)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'The Process of Auditing Information Systems', 21.00, 32, 'Planning', 'Execution', 1,
   'T1: Plan audit to determine whether IS are protected, controlled, and provide value. T2: Conduct audit in accordance with IS audit standards. T3: Communicate audit progress, findings, results. T4: Conduct audit follow-up. T36: Utilize data analytics. T37: Provide consulting services. T38: Identify process improvement opportunities.'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 'Governance and Management of IT', 17.00, 26, 'IT Governance', 'IT Management', 2,
   'T5: Evaluate IT strategy alignment. T6: Evaluate IT governance. T7: Evaluate IT policies. T8: Evaluate compliance. T9: Evaluate IT resource management. T10: Evaluate risk management. T11: Evaluate IT monitoring. T12: Evaluate IT KPIs. T15: Evaluate IT supplier management. T20: Evaluate IT service management. T21: Periodic review of IS/EA. T25: Evaluate data governance.'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 'Information Systems Acquisition, Development & Implementation', 12.00, 18, 'IS Acquisition and Development', 'IS Implementation', 3,
   'T14: Evaluate business case for changes. T16: Evaluate project management. T17: Evaluate SDLC controls. T18: Evaluate IS readiness for production. T19: Conduct post-implementation review.'),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 4, 'Information Systems Operations and Business Resilience', 23.00, 34, 'IS Operations', 'Business Resilience', 4,
   'T13: Evaluate business continuity. T22: Evaluate IT operations. T23: Evaluate IT maintenance. T24: Evaluate database management. T26: Evaluate problem/incident management. T27: Evaluate change management. T28: Evaluate end-user computing.'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 5, 'Protection of Information Assets', 27.00, 41, 'Information Asset Security and Control', 'Security Event Management', 5,
   'T29: Evaluate security/privacy policies. T30: Evaluate physical controls. T31: Evaluate logical security. T32: Evaluate data classification. T33: Evaluate asset lifecycle. T34: Evaluate security program. T35: Perform security testing. T39: Evaluate emerging technologies.')
ON CONFLICT DO NOTHING;

-- Insert Domain 1 Topics
INSERT INTO topics (id, domain_id, topic_code, name, part, sort_order)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '1.1', 'IS Audit Standards, Guidelines and Codes of Ethics', 'A', 1),
  ('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '1.2', 'Business Processes', 'A', 2),
  ('b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '1.3', 'Types of Controls', 'A', 3),
  ('b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', '1.4', 'Risk-based Audit Planning', 'A', 4),
  ('b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', '1.5', 'Types of Audits and Assessments', 'A', 5),
  ('b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', '1.6', 'Audit Project Management', 'B', 6),
  ('b0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000001', '1.7', 'Sampling Methodology', 'B', 7),
  ('b0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000001', '1.8', 'Audit Evidence Collection Techniques', 'B', 8),
  ('b0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000001', '1.9', 'Data Analytics', 'B', 9),
  ('b0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000001', '1.10', 'Reporting and Communication Techniques', 'B', 10),
  ('b0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000001', '1.11', 'Quality Assurance and Improvement of the Audit Process', 'B', 11)
ON CONFLICT DO NOTHING;
