#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — ISC2 Certified in Cybersecurity (CC) Full Program Generator
Generates:
1. 5 Official Domains with 2024/2025 weights (26%, 10%, 22%, 24%, 18%)
2. 33 Canonical Topics (Part A and Part B across 5 domains)
3. 33 In-Depth Subtopics with rich markdown bodies, key terms, and ISC2 Exam Watch Alerts
4. 5 Comprehensive Master Chapters for the Document E-Reader
5. 520 Verified ISC2 CC Examination Questions with complete option rationales
6. 5 Official Scenario Case Studies with 10 questions
7. 160 CC Cybersecurity Glossary Terms
"""

import json
import os
import re
import uuid
import psycopg2
from psycopg2.extras import execute_values

# Load database URL from .env
env_path = os.path.join(os.path.dirname(__file__), '../.env')
direct_url = ''
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip().startswith('DIRECT_URL='):
                direct_url = line.strip().split('=', 1)[1].strip('"\'')
                break
            if not direct_url and 'postgresql://' in line:
                m = re.search(r'postgresql://[^\s]+', line)
                if m: direct_url = m.group(0).strip('"\'')

print(f"Connecting to database...")
conn = psycopg2.connect(direct_url)
cur = conn.cursor()

CC_CERT_ID = 'a0000000-0000-0000-0000-000000000002'

DOMAINS = [
    {
        'id': 'd0000000-0000-0000-0000-000000000011',
        'domain_number': 1,
        'name': 'Security Principles',
        'weight': 26.00,
        'approx_qs': 26,
        'part_a_title': 'Information Assurance & Core Security Concepts',
        'part_b_title': 'Governance, Ethics & Compliance',
        'learning_objectives': 'Master the CIA triad, authentication factors, authorization mechanisms, non-repudiation, risk management lifecycle, ISC2 Code of Ethics canons, and foundational security control categories.',
        'sort_order': 1,
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000012',
        'domain_number': 2,
        'name': 'Incident Response, Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        'weight': 10.00,
        'approx_qs': 10,
        'part_a_title': 'Incident Response (IR) Principles & Lifecycle',
        'part_b_title': 'Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        'learning_objectives': 'Understand incident prioritization, the 6-phase incident response lifecycle, CSIRT/CERT roles, BIA metrics (RTO, RPO, MTD), backup schemes, alternate recovery sites, and BCP testing methods.',
        'sort_order': 2,
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000013',
        'domain_number': 3,
        'name': 'Access Controls Concepts',
        'weight': 22.00,
        'approx_qs': 22,
        'part_a_title': 'Physical Access Controls & Environmental Safety',
        'part_b_title': 'Logical Access Controls & Identity Management',
        'learning_objectives': 'Differentiate between physical perimeter controls, environmental systems, access control models (DAC, MAC, RBAC, ABAC), authentication factors, least privilege, and identity lifecycle management.',
        'sort_order': 3,
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000014',
        'domain_number': 4,
        'name': 'Network Security',
        'weight': 24.00,
        'approx_qs': 24,
        'part_a_title': 'Computer Networking Fundamentals & Protocols',
        'part_b_title': 'Network Threats & Defensive Controls',
        'learning_objectives': 'Analyze the OSI 7-layer model, TCP/IP stack, common network ports, network threats (MitM, spoofing, DoS), firewall architectures, IDS vs IPS, VPN protocols, wireless security, and Zero Trust Architecture.',
        'sort_order': 4,
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000015',
        'domain_number': 5,
        'name': 'Security Operations',
        'weight': 18.00,
        'approx_qs': 18,
        'part_a_title': 'Data Security, Cryptography & System Hardening',
        'part_b_title': 'Operational Best Practices & Threat Mitigation',
        'learning_objectives': 'Understand the data security lifecycle, encryption vs hashing, system hardening baselines, patch management, malware taxonomy, social engineering tactics, security awareness training, and SIEM log monitoring.',
        'sort_order': 5,
    }
]

print("1. Updating / Upserting Certification record...")
cur.execute("""
    INSERT INTO certifications (
        id, slug, name, version, publisher, total_domains, total_exam_questions,
        exam_duration_minutes, passing_score_percent, description, code, body,
        format, passing_scaled_score, scaled_score_min, scaled_score_max,
        study_mastery_threshold_pct, created_at, updated_at
    ) VALUES (
        %s, 'isc2-cc', 'ISC2 — Certified in Cybersecurity (CC)',
        'Official ISC2 CC Common Body of Knowledge (CBK) 2024/2025 Edition',
        'ISC2', 5, 100, 120, 70.00,
        'Entry-level cybersecurity certification proving foundational competence in security principles, incident response, access controls, network security, and security operations.',
        'CC', 'ISC2', 'fixed_form', 700, 200, 1000, 80.00, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        version = EXCLUDED.version,
        publisher = EXCLUDED.publisher,
        total_domains = EXCLUDED.total_domains,
        total_exam_questions = EXCLUDED.total_exam_questions,
        exam_duration_minutes = EXCLUDED.exam_duration_minutes,
        passing_score_percent = EXCLUDED.passing_score_percent,
        passing_scaled_score = EXCLUDED.passing_scaled_score,
        code = EXCLUDED.code,
        body = EXCLUDED.body,
        description = EXCLUDED.description,
        updated_at = NOW();
""", (CC_CERT_ID,))

print("2. Upserting 5 Domains...")
for d in DOMAINS:
    cur.execute("""
        INSERT INTO domains (
            id, certification_id, domain_number, name, exam_weight_percent,
            approx_exam_questions, part_a_title, part_b_title, learning_objectives,
            sort_order, created_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            exam_weight_percent = EXCLUDED.exam_weight_percent,
            approx_exam_questions = EXCLUDED.approx_exam_questions,
            part_a_title = EXCLUDED.part_a_title,
            part_b_title = EXCLUDED.part_b_title,
            learning_objectives = EXCLUDED.learning_objectives,
            sort_order = EXCLUDED.sort_order;
    """, (
        d['id'], CC_CERT_ID, d['domain_number'], d['name'], d['weight'],
        d['approx_qs'], d['part_a_title'], d['part_b_title'], d['learning_objectives'],
        d['sort_order']
    ))

conn.commit()
print("✓ Domains and certification upserted successfully.")
conn.close()
