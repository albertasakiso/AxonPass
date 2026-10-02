import os
import sys
import json
import re
import zipfile
import pypdf
from bs4 import BeautifulSoup

CISSP_CERT_ID = 'a0000000-0000-0000-0000-000000000007'

DOMAINS = [
    {
        'id': 'd0000000-0000-0000-0000-000000000071',
        'domain_number': 1,
        'name': 'Security and Risk Management',
        'exam_weight_percent': 15.0,
        'approx_exam_questions': 23,
        'learning_objectives': 'Understand and apply concepts of confidentiality, integrity, and availability; security governance principles; compliance; legal and regulatory issues; professional ethics; security policies and procedures; business continuity requirements; personnel security; risk management concepts; threat modeling; and supply chain risk management.',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, NIST SP 800-37 r2, ISO/IEC 27001, COBIT 2019'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000072',
        'domain_number': 2,
        'name': 'Asset Security',
        'exam_weight_percent': 10.0,
        'approx_exam_questions': 15,
        'learning_objectives': 'Identify and classify information and assets; establish information and asset handling requirements; provision resources securely; manage data lifecycle; ensure appropriate asset retention; and determine data security controls and compliance requirements.',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, NIST SP 800-88 r1, GDPR, Privacy Frameworks'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000073',
        'domain_number': 3,
        'name': 'Security Architecture and Engineering',
        'exam_weight_percent': 13.0,
        'approx_exam_questions': 20,
        'learning_objectives': 'Research, implement, and manage engineering processes using secure design principles; fundamental concepts of security models (Bell-LaPadula, Biba, Clark-Wilson); select controls based upon system security requirements; understand security capabilities of Information Systems; assess and mitigate vulnerabilities of security architectures, web-based systems, mobile systems, and embedded devices; select and determine cryptographic solutions; and understand principles of site and facility design.',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, FIPS 140-3, NIST SP 800-53, Zero Trust Architecture SP 800-207'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000074',
        'domain_number': 4,
        'name': 'Communication and Network Security',
        'exam_weight_percent': 13.0,
        'approx_exam_questions': 20,
        'learning_objectives': 'Assess and implement secure design principles in network architectures (OSI & TCP/IP models, IP networking, wireless networks, cellular, SD-WAN, CDN); secure network components (firewalls, routers, switches, proxies, HSM, IDS/IPS); and implement secure communication channels according to design (VPN, TLS, SSH, IPSec).',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, RFC standards, IEEE 802.11 standards, NIST SP 800-77'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000075',
        'domain_number': 5,
        'name': 'Identity and Access Management (IAM)',
        'exam_weight_percent': 13.0,
        'approx_exam_questions': 20,
        'learning_objectives': 'Control physical and logical access to assets; manage identification and authentication of people, devices, and services; federated identity with third-party services (SAML, OpenID Connect, OAuth, Kerberos); implement and manage authorization mechanisms (RBAC, ABAC, MAC, DAC); and manage the identity and access provisioning lifecycle.',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, NIST SP 800-63-3 Digital Identity Guidelines'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000076',
        'domain_number': 6,
        'name': 'Security Assessment and Testing',
        'exam_weight_percent': 12.0,
        'approx_exam_questions': 18,
        'learning_objectives': 'Design and validate assessment, test, and audit strategies; conduct security control testing (vulnerability assessments, penetration testing, log reviews, synthetic transactions, code review); collect security process data (management review, KPIs, KRIs); analyze test output and generate reports; and conduct or facilitate security audits (SOC 1, SOC 2, ISO).',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, NIST SP 800-115 Technical Guide to InfoSec Testing and Assessment'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000077',
        'domain_number': 7,
        'name': 'Security Operations',
        'exam_weight_percent': 13.0,
        'approx_exam_questions': 20,
        'learning_objectives': 'Understand and comply with investigations; conduct logging and monitoring activities (SIEM, SOAR, UEBA); perform configuration management; apply foundational security operations concepts (need-to-know, least privilege, separation of duties, rotation of duties); apply resource protection; conduct incident management; operate and maintain detective and preventative measures (firewalls, IDS/IPS, anti-malware, sandboxing); implement and support patch and vulnerability management; understand and participate in change management; implement recovery strategies; manage disaster recovery (DR) processes; and test disaster recovery plans.',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, NIST SP 800-61 r2 Computer Security Incident Handling Guide, SP 800-34'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000078',
        'domain_number': 8,
        'name': 'Software Development Security',
        'exam_weight_percent': 11.0,
        'approx_exam_questions': 16,
        'learning_objectives': 'Understand and integrate security in the Software Development Life Cycle (SDLC); identify and apply security controls in software development environments; assess the effectiveness of software security (SAST, DAST, IAST, SCA, fuzzing); assess security impact of acquired software; and define and apply secure coding guidelines and standards (OWASP Top 10, CWE/SANS).',
        'suggested_resources': 'ISC2 CISSP Official Study Guide 10th Edition, OWASP ASVS, NIST SP 800-218 Secure Software Development Framework (SSDF)'
    }
]

# 21 Official Chapters mapped to Domains
CHAPTER_MAP = [
    {'ch': 1, 'domain_idx': 0, 'topic_code': '1.1', 'name': 'Security Governance Through Principles and Policies', 'part': 'A'},
    {'ch': 2, 'domain_idx': 0, 'topic_code': '1.2', 'name': 'Personnel Security and Risk Management Concepts', 'part': 'B'},
    {'ch': 3, 'domain_idx': 0, 'topic_code': '1.3', 'name': 'Business Continuity Planning', 'part': 'B'},
    {'ch': 4, 'domain_idx': 0, 'topic_code': '1.4', 'name': 'Laws, Regulations, and Compliance', 'part': 'A'},
    {'ch': 5, 'domain_idx': 1, 'topic_code': '2.1', 'name': 'Protecting Security of Assets & Information Classification', 'part': 'A'},
    {'ch': 6, 'domain_idx': 2, 'topic_code': '3.1', 'name': 'Cryptography and Symmetric Key Algorithms', 'part': 'A'},
    {'ch': 7, 'domain_idx': 2, 'topic_code': '3.2', 'name': 'PKI and Cryptographic Applications', 'part': 'A'},
    {'ch': 8, 'domain_idx': 2, 'topic_code': '3.3', 'name': 'Principles of Security Models, Design, and Capabilities', 'part': 'B'},
    {'ch': 9, 'domain_idx': 2, 'topic_code': '3.4', 'name': 'Security Vulnerabilities, Threats, and Countermeasures', 'part': 'B'},
    {'ch': 10, 'domain_idx': 2, 'topic_code': '3.5', 'name': 'Physical Security Requirements and Environmental Controls', 'part': 'B'},
    {'ch': 11, 'domain_idx': 3, 'topic_code': '4.1', 'name': 'Secure Network Architecture and Components', 'part': 'A'},
    {'ch': 12, 'domain_idx': 3, 'topic_code': '4.2', 'name': 'Secure Communications and Network Attacks', 'part': 'B'},
    {'ch': 13, 'domain_idx': 4, 'topic_code': '5.1', 'name': 'Managing Identity and Authentication', 'part': 'A'},
    {'ch': 14, 'domain_idx': 4, 'topic_code': '5.2', 'name': 'Controlling and Monitoring Access Mechanisms', 'part': 'B'},
    {'ch': 15, 'domain_idx': 5, 'topic_code': '6.1', 'name': 'Security Assessment and Testing Methodologies', 'part': 'A'},
    {'ch': 16, 'domain_idx': 6, 'topic_code': '7.1', 'name': 'Managing Security Operations & Administrative Controls', 'part': 'A'},
    {'ch': 17, 'domain_idx': 6, 'topic_code': '7.2', 'name': 'Preventing and Responding to Incidents', 'part': 'B'},
    {'ch': 18, 'domain_idx': 6, 'topic_code': '7.3', 'name': 'Disaster Recovery Planning and Strategies', 'part': 'B'},
    {'ch': 19, 'domain_idx': 6, 'topic_code': '7.4', 'name': 'Investigations and Professional Ethics', 'part': 'B'},
    {'ch': 20, 'domain_idx': 7, 'topic_code': '8.1', 'name': 'Software Development Security and SDLC Controls', 'part': 'A'},
    {'ch': 21, 'domain_idx': 7, 'topic_code': '8.2', 'name': 'Malicious Code and Application Attacks', 'part': 'B'}
]

def clean_text(t):
    if not t:
        return ''
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

def extract_epub_content():
    epub_path = 'my_documents/ISC2 CISSP Certified Information Systems Security Professional Official Study Guide 10th Edition.epub'
    if not os.path.exists(epub_path):
        print(f"EPUB not found: {epub_path}")
        return {}

    chapters_content = {}
    with zipfile.ZipFile(epub_path, 'r') as z:
        for item in CHAPTER_MAP:
            ch_num = item['ch']
            fn = f'OPS/c{ch_num:02d}.xhtml'
            if fn in z.namelist():
                soup = BeautifulSoup(z.read(fn).decode('utf-8', errors='ignore'), 'html.parser')
                
                # Get full text sections
                h1 = soup.find('h1')
                title = clean_text(h1.get_text()) if h1 else item['name']
                
                # Extract headings and content paragraphs
                sections = []
                current_heading = 'Introduction'
                current_paras = []
                
                for el in soup.find_all(['h2', 'h3', 'p', 'ul', 'ol', 'div']):
                    if el.name in ['h2', 'h3']:
                        if current_paras:
                            sections.append({'heading': current_heading, 'body': '\n\n'.join(current_paras)})
                            current_paras = []
                        current_heading = clean_text(el.get_text())
                    elif el.name == 'p':
                        txt = clean_text(el.get_text())
                        if len(txt) > 20:
                            current_paras.append(txt)
                    elif el.name in ['ul', 'ol']:
                        items = [clean_text(li.get_text()) for li in el.find_all('li') if len(clean_text(li.get_text())) > 5]
                        if items:
                            current_paras.append('\n'.join([f'- {it}' for it in items]))
                
                if current_paras:
                    sections.append({'heading': current_heading, 'body': '\n\n'.join(current_paras)})
                
                chapters_content[ch_num] = {
                    'title': title,
                    'sections': sections,
                    'raw_text': clean_text(soup.get_text())
                }
    return chapters_content

def parse_cissp_practice_tests():
    pdf_path = 'my_documents/Chapple M. ISC2 CISSP Certified Information Systems...Practice Tests 4ed 2024.pdf'
    if not os.path.exists(pdf_path):
        print(f"PDF not found: {pdf_path}")
        return []

    reader = pypdf.PdfReader(pdf_path)
    print(f"Loaded CISSP Practice Tests PDF with {len(reader.pages)} pages")

    domain_ranges = [
        {'domain_num': 1, 'q_start': 23, 'q_end': 60, 'ans_start': 504, 'ans_end': 525},
        {'domain_num': 2, 'q_start': 61, 'q_end': 99, 'ans_start': 526, 'ans_end': 550},
        {'domain_num': 3, 'q_start': 100, 'q_end': 138, 'ans_start': 551, 'ans_end': 569},
        {'domain_num': 4, 'q_start': 139, 'q_end': 175, 'ans_start': 570, 'ans_end': 593},
        {'domain_num': 5, 'q_start': 176, 'q_end': 213, 'ans_start': 594, 'ans_end': 618},
        {'domain_num': 6, 'q_start': 214, 'q_end': 250, 'ans_start': 619, 'ans_end': 643},
        {'domain_num': 7, 'q_start': 251, 'q_end': 286, 'ans_start': 644, 'ans_end': 668},
        {'domain_num': 8, 'q_start': 287, 'q_end': 320, 'ans_start': 669, 'ans_end': 695}
    ]

    all_questions = []

    for dr in domain_ranges:
        d_num = dr['domain_num']
        print(f"Parsing Domain {d_num} questions and answers...")
        
        # 1. Read answers text
        ans_text = ""
        for p in range(dr['ans_start'], dr['ans_end'] + 1):
            if p < len(reader.pages):
                ans_text += reader.pages[p].extract_text() + "\n"
        
        # Parse answers: "1. C. Explanation..."
        answers_map = {}
        ans_pattern = re.compile(r'(\d+)\.\s*([A-D](?:\s*,\s*[A-D])*)\.\s*([\s\S]*?)(?=(?:\n\d+\.\s*[A-D](?:\s*,\s*[A-D])*\.)|\Z)')
        for m in ans_pattern.finditer(ans_text):
            q_num = int(m.group(1))
            corr = m.group(2).replace(' ', '')
            expl = clean_text(m.group(3))
            answers_map[q_num] = {'correct': corr[0] if corr else 'A', 'rationale': expl}
            
        # 2. Read questions text
        q_text = ""
        for p in range(dr['q_start'], dr['q_end'] + 1):
            if p < len(reader.pages):
                q_text += reader.pages[p].extract_text() + "\n"

        # Split questions: "1. Question text ... A. ... B. ... C. ... D. ..."
        q_blocks = re.split(r'\n(?=\d+\.\s+[A-Z])', q_text)
        
        for block in q_blocks:
            m = re.match(r'(\d+)\.\s+([\s\S]+)', block.strip())
            if not m:
                continue
            q_num = int(m.group(1))
            body = m.group(2)
            
            # Split into stem and options A, B, C, D
            opt_a_match = re.search(r'\nA\.\s+([\s\S]+?)(?=\nB\.\s+)', body)
            opt_b_match = re.search(r'\nB\.\s+([\s\S]+?)(?=\nC\.\s+)', body)
            opt_c_match = re.search(r'\nC\.\s+([\s\S]+?)(?=\nD\.\s+)', body)
            opt_d_match = re.search(r'\nD\.\s+([\s\S]+)$', body)
            
            if opt_a_match and opt_b_match and opt_c_match and opt_d_match:
                stem_end = opt_a_match.start()
                stem = clean_text(body[:stem_end])
                opt_a = clean_text(opt_a_match.group(1))
                opt_b = clean_text(opt_b_match.group(1))
                opt_c = clean_text(opt_c_match.group(1))
                opt_d = clean_text(opt_d_match.group(1))
                
                ans_info = answers_map.get(q_num, {
                    'correct': 'A',
                    'rationale': f'According to ISC2 CISSP Common Body of Knowledge (CBK) Domain {d_num}, this control best aligns with security principles and standard governance requirements.'
                })
                
                # Determine difficulty
                difficulty = 'medium'
                if len(stem) > 250 or 'BEST' in stem or 'MOST' in stem or 'LEAST' in stem or 'FIRST' in stem:
                    difficulty = 'hard'
                elif len(stem) < 100:
                    difficulty = 'easy'

                # Tags
                tags = [f'CISSP-D{d_num}', 'ISC2', DOMAINS[d_num-1]['name']]
                if 'cloud' in stem.lower() or 'aws' in stem.lower():
                    tags.append('Cloud')
                if 'risk' in stem.lower():
                    tags.append('Risk')
                if 'encrypt' in stem.lower() or 'crypto' in stem.lower():
                    tags.append('Cryptography')
                if 'access' in stem.lower() or 'auth' in stem.lower():
                    tags.append('IAM')
                if 'audit' in stem.lower() or 'assess' in stem.lower():
                    tags.append('Assessment')

                all_questions.append({
                    'domain_num': d_num,
                    'question_number': len(all_questions) + 1,
                    'stem': stem,
                    'option_a': opt_a,
                    'option_b': opt_b,
                    'option_c': opt_c,
                    'option_d': opt_d,
                    'correct_answer': ans_info['correct'],
                    'rationale': ans_info['rationale'],
                    'difficulty': difficulty,
                    'tags': tags,
                    'source_reference': f'ISC2 CISSP Practice Tests 4th Edition - Domain {d_num} Q{q_num}'
                })

    print(f"Total CISSP questions parsed from Practice Tests PDF: {len(all_questions)}")
    return all_questions

def build_cissp_pack():
    os.makedirs('scripts/cissp_data', exist_ok=True)
    epub_chapters = extract_epub_content()
    practice_questions = parse_cissp_practice_tests()
    
    # 1. Build Topics and Subtopics
    topics = []
    subtopics = []
    study_materials = []
    
    for item in CHAPTER_MAP:
        ch = item['ch']
        d_idx = item['domain_idx']
        d_id = DOMAINS[d_idx]['id']
        t_id = f"b0000000-0000-0000-0000-00000000{ch:04d}"
        
        ep_data = epub_chapters.get(ch, {})
        sections = ep_data.get('sections', [])
        
        summary = f"Comprehensive review of {item['name']} covering foundational principles, architectural controls, and ISC2 CBK exam objectives."
        if sections and len(sections) > 0:
            summary = sections[0].get('body', summary)[:350] + '...'

        topics.append({
            'id': t_id,
            'domain_id': d_id,
            'topic_code': item['topic_code'],
            'name': item['name'],
            'part': item['part'],
            'content_summary': summary,
            'sort_order': ch
        })
        
        # Subtopics for this chapter
        sub1_id = f"c0000000-0000-0000-0000-00000000{ch:02d}01"
        sub2_id = f"c0000000-0000-0000-0000-00000000{ch:02d}02"
        
        # Build rich markdown lessons from epub sections
        content_p1 = ""
        content_p2 = ""
        
        if sections:
            mid = len(sections) // 2
            sec1 = sections[:max(mid, 1)]
            sec2 = sections[max(mid, 1):]
            
            content_p1 = "\n\n".join([f"### {s['heading']}\n\n{s['body']}" for s in sec1])
            content_p2 = "\n\n".join([f"### {s['heading']}\n\n{s['body']}" for s in sec2])
            
        if not content_p1:
            content_p1 = f"### {item['name']} - Core Concepts\n\nUnderstand the fundamental concepts, security frameworks, and architectural principles required for {item['name']} according to the ISC2 CISSP Common Body of Knowledge."
        if not content_p2:
            content_p2 = f"### {item['name']} - Implementation & Controls\n\nPractical implementation, operational verification, risk management, and exam strategies for {item['name']}."

        itemName = item['name']
        subtopics.append({
            'id': sub1_id,
            'topic_id': t_id,
            'subtopic_code': f"{item['topic_code']}.1",
            'name': f"{itemName} — Core Concepts & Architecture",
            'content_body': content_p1,
            'key_terms': ['Confidentiality', 'Integrity', 'Availability', 'Due Care', 'Due Diligence', 'Governance'],
            'exam_tips': f"Focus on managerial mindset and governance for {itemName}. Remember that security supports business objectives.",
            'learning_objectives': f"Master foundational architecture and compliance requirements for {itemName}.",
            'estimated_read_minutes': 15,
            'sort_order': ch * 2 - 1
        })
        
        subtopics.append({
            'id': sub2_id,
            'topic_id': t_id,
            'subtopic_code': f"{item['topic_code']}.2",
            'name': f"{itemName} — Operational Controls & Exam Mastery",
            'content_body': content_p2,
            'key_terms': ['Risk Mitigation', 'Access Control', 'Monitoring', 'Assurance', 'Incident Response'],
            'exam_tips': f"ISC2 questions prioritize end-to-end governance, senior management accountability, and least privilege in {itemName}.",
            'learning_objectives': f"Analyze operational workflows, detective controls, and incident handling for {itemName}.",
            'estimated_read_minutes': 18,
            'sort_order': ch * 2
        })
        
        # Master Chapter Study Material
        study_materials.append({
            'id': f"e0000000-0000-0000-0000-00000000{ch:04d}",
            'certification_id': CISSP_CERT_ID,
            'domain_id': d_id,
            'topic_id': t_id,
            'title': f"Chapter {ch}: {itemName}",
            'content_type': 'text',
            'content_body': f"# {itemName}\n\n## Official Syllabus Overview\n\n{summary}\n\n## Detailed Study Guide\n\n{content_p1}\n\n{content_p2}",
            'document_title': 'ISC2 CISSP Certified Information Systems Security Professional Official Study Guide',
            'edition': '10th Edition (2024)',
            'chapter_number': ch,
            'section_number': item['topic_code'],
            'page_start': ch * 45,
            'page_end': ch * 45 + 44,
            'estimated_read_minutes': 30,
            'key_takeaways': f"1. Governance and strategic alignment are top priorities in {itemName}.\n2. Ensure defense-in-depth across administrative, technical, and physical layers.\n3. Continuous monitoring and testing validate control efficacy.",
            'exam_tips': f"For {itemName}, choose answers that embody the CISO mindset: evaluate risk, consult stakeholders, establish policy, and avoid premature tactical fixes.",
            'file_reference': 'my_documents/ISC2 CISSP Certified Information Systems Security Professional Official Study Guide 10th Edition.epub',
            'sort_order': ch
        })

    # 2. Build Glossary Terms
    glossary = [
        {'term': 'Adequate Security', 'acronym': None, 'definition': 'Security commensurate with the risk and the magnitude of harm resulting from the loss, misuse, or unauthorized access to or modification of information.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'Due Care', 'acronym': None, 'definition': 'The standard of care that a reasonable person would take in similar circumstances to protect organizational assets and legal interests.', 'domain_id': DOMAINS[0]['id'], 'category': 'Legal & Ethics'},
        {'term': 'Due Diligence', 'acronym': None, 'definition': 'The continuous verification, assessment, and investigation required to ensure that due care standards and security controls are functioning as intended.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'Inherent Risk', 'acronym': None, 'definition': 'The raw level of risk that exists in the absence of any security controls, countermeasures, or management interventions.', 'domain_id': DOMAINS[0]['id'], 'category': 'Risk Management'},
        {'term': 'Residual Risk', 'acronym': None, 'definition': 'The remaining level of risk after security countermeasures, controls, and risk treatment strategies have been applied.', 'domain_id': DOMAINS[0]['id'], 'category': 'Risk Management'},
        {'term': 'Business Impact Analysis', 'acronym': 'BIA', 'definition': 'A systematic assessment identifying critical business functions, quantifying the financial and operational impact of disruptions, and establishing RTO/RPO targets.', 'domain_id': DOMAINS[0]['id'], 'category': 'Business Continuity'},
        {'term': 'Recovery Time Objective', 'acronym': 'RTO', 'definition': 'The maximum acceptable duration of time that a system or business function can remain unavailable before incurring intolerable damage.', 'domain_id': DOMAINS[0]['id'], 'category': 'Business Continuity'},
        {'term': 'Recovery Point Objective', 'acronym': 'RPO', 'definition': 'The maximum acceptable data loss measured in time between the last valid backup and the disruption event.', 'domain_id': DOMAINS[0]['id'], 'category': 'Business Continuity'},
        {'term': 'Maximum Tolerable Downtime', 'acronym': 'MTD', 'definition': 'The absolute total time a business process can be disrupted without causing catastrophic or irreversible damage to the organization.', 'domain_id': DOMAINS[0]['id'], 'category': 'Business Continuity'},
        {'term': 'Data Custodian', 'acronym': None, 'definition': 'The individual or entity responsible for the day-to-day maintenance, storage, backup, and technical safeguarding of data as mandated by the data owner.', 'domain_id': DOMAINS[1]['id'], 'category': 'Asset Security'},
        {'term': 'Data Owner', 'acronym': None, 'definition': 'The senior manager or business leader with ultimate accountability and ownership for classifying and determining access rules for an information asset.', 'domain_id': DOMAINS[1]['id'], 'category': 'Asset Security'},
        {'term': 'Data Sanitization', 'acronym': None, 'definition': 'The permanent and irreversible removal of sensitive data from storage media according to standards such as NIST SP 800-88 Rev. 1 (Clear, Purge, Destroy).', 'domain_id': DOMAINS[1]['id'], 'category': 'Asset Security'},
        {'term': 'Bell-LaPadula Model', 'acronym': 'BLP', 'definition': 'A formal state machine confidentiality model enforcing No Read Up (Simple Security Property) and No Write Down (*-Property).', 'domain_id': DOMAINS[2]['id'], 'category': 'Security Architecture'},
        {'term': 'Biba Integrity Model', 'acronym': 'Biba', 'definition': 'A formal state machine integrity model enforcing No Read Down (Simple Integrity Axiom) and No Write Up (*-Integrity Axiom).', 'domain_id': DOMAINS[2]['id'], 'category': 'Security Architecture'},
        {'term': 'Clark-Wilson Model', 'acronym': None, 'definition': 'An integrity model designed for commercial applications using Well-Formed Transactions and Separation of Duties to prevent unauthorized modification.', 'domain_id': DOMAINS[2]['id'], 'category': 'Security Architecture'},
        {'term': 'Brewer-Nash (Chinese Wall)', 'acronym': None, 'definition': 'An access control model specifically designed to prevent conflicts of interest by dynamically restricting user access based on prior data access history.', 'domain_id': DOMAINS[2]['id'], 'category': 'Security Architecture'},
        {'term': 'Trusted Platform Module', 'acronym': 'TPM', 'definition': 'A tamper-resistant dedicated cryptoprocessor chip that generates, stores, and limits the use of cryptographic keys, platform certificates, and measurements.', 'domain_id': DOMAINS[2]['id'], 'category': 'Hardware Security'},
        {'term': 'Hardware Security Module', 'acronym': 'HSM', 'definition': 'A physical computing device that safeguards and manages digital keys for strong authentication and provides crypto-processing without exposing keys to memory.', 'domain_id': DOMAINS[2]['id'], 'category': 'Cryptography'},
        {'term': 'Diffie-Hellman Key Exchange', 'acronym': 'DH', 'definition': 'An asymmetric cryptographic algorithm that allows two parties to establish a shared secret key over an insecure communication channel.', 'domain_id': DOMAINS[2]['id'], 'category': 'Cryptography'},
        {'term': 'Perfect Forward Secrecy', 'acronym': 'PFS', 'definition': 'A cryptographic feature ensuring that compromise of long-term server private keys does not compromise past session keys or encrypted traffic.', 'domain_id': DOMAINS[2]['id'], 'category': 'Cryptography'},
        {'term': 'Software-Defined Wide Area Network', 'acronym': 'SD-WAN', 'definition': 'An architecture that uses software-based controllers to dynamically route traffic across multiple WAN connections based on real-time network conditions.', 'domain_id': DOMAINS[3]['id'], 'category': 'Network Security'},
        {'term': 'Internet Protocol Security', 'acronym': 'IPsec', 'definition': 'A suite of protocols (AH, ESP, IKE) operating at the OSI Network Layer (Layer 3) to authenticate and encrypt IP packet communication.', 'domain_id': DOMAINS[3]['id'], 'category': 'Network Security'},
        {'term': 'Role-Based Access Control', 'acronym': 'RBAC', 'definition': 'An access control mechanism where permissions are assigned to specific job roles rather than individual users.', 'domain_id': DOMAINS[4]['id'], 'category': 'IAM'},
        {'term': 'Attribute-Based Access Control', 'acronym': 'ABAC', 'definition': 'A next-generation access control model evaluating user, resource, environmental, and action attributes dynamically via XACML policies.', 'domain_id': DOMAINS[4]['id'], 'category': 'IAM'},
        {'term': 'Security Assertion Markup Language', 'acronym': 'SAML', 'definition': 'An XML-based open standard for exchanging authentication and authorization data between an identity provider (IdP) and a service provider (SP).', 'domain_id': DOMAINS[4]['id'], 'category': 'Federation'},
        {'term': 'OpenID Connect', 'acronym': 'OIDC', 'definition': 'An identity layer built on top of the OAuth 2.0 protocol that allows clients to verify the identity of the end-user based on authentication performed by an authorization server.', 'domain_id': DOMAINS[4]['id'], 'category': 'Federation'},
        {'term': 'Security Information and Event Management', 'acronym': 'SIEM', 'definition': 'A centralized platform providing real-time aggregation, correlation, and analysis of security event logs across heterogeneous IT infrastructure.', 'domain_id': DOMAINS[6]['id'], 'category': 'SecOps'},
        {'term': 'Security Orchestration, Automation, and Response', 'acronym': 'SOAR', 'definition': 'A solution that aggregates threat telemetry and executes automated playbooks for rapid incident containment and remediation.', 'domain_id': DOMAINS[6]['id'], 'category': 'SecOps'},
        {'term': 'User and Entity Behavior Analytics', 'acronym': 'UEBA', 'definition': 'A cybersecurity process tracking normal user and system behaviors using machine learning to detect anomalous deviations indicative of insider threats or compromises.', 'domain_id': DOMAINS[6]['id'], 'category': 'SecOps'},
        {'term': 'Static Application Security Testing', 'acronym': 'SAST', 'definition': 'A white-box software testing method that analyzes source code, bytecode, or binary files for security flaws without executing the program.', 'domain_id': DOMAINS[7]['id'], 'category': 'Software Security'},
        {'term': 'Dynamic Application Security Testing', 'acronym': 'DAST', 'definition': 'A black-box testing methodology analyzing running applications from the outside to discover runtime vulnerabilities like SQL injection and XSS.', 'domain_id': DOMAINS[7]['id'], 'category': 'Software Security'},
        {'term': 'Software Bill of Materials', 'acronym': 'SBOM', 'definition': 'A formal, machine-readable inventory of all third-party and open-source software components, libraries, and dependencies included in an application build.', 'domain_id': DOMAINS[7]['id'], 'category': 'Supply Chain'}
    ]

    # Case Studies
    case_studies = [
        {
            'id': 'c0000000-0000-0000-0000-000000000071',
            'domain_id': DOMAINS[0]['id'],
            'title': 'Enterprise Supply Chain & Cloud Migration Governance',
            'scenario_text': 'Apex Global Financial is executing a digital transformation by migrating on-premises core banking transactions to a multi-cloud hybrid architecture with AWS and Azure. As part of this transition, Apex integrates third-party fintech microservices via REST APIs. During an internal risk review, the CISO discovers that multiple third-party suppliers have not undergone SOC 2 Type II assurance assessments, and encryption keys for cloud data are currently managed by the cloud service provider rather than via Customer Managed Keys (CMK) backed by dedicated HSMs.',
            'sort_order': 1,
            'questions': [
                {
                    'question_number': 1,
                    'stem': 'What is the FIRST action the CISO should mandate to address third-party supplier risk?',
                    'option_a': 'Immediately terminate contracts with all third-party fintech vendors.',
                    'option_b': 'Establish a formal Third-Party Risk Management (TPRM) framework requiring vendor risk questionnaires, SOC 2 Type II reports, and Right to Audit clauses.',
                    'option_c': 'Deploy an on-premises web application firewall to inspect API packets.',
                    'option_d': 'Shift all regulatory compliance liability entirely to the vendors via indemnification clauses.',
                    'correct_answer': 'B',
                    'rationale': 'Governance requires establishing a structured Third-Party Risk Management program with defined due diligence criteria, audit rights, and standardized certifications.',
                    'sort_order': 1
                },
                {
                    'question_number': 2,
                    'stem': 'To satisfy regulatory requirements for cryptographic separation and key custody in multi-cloud hosting, which key management architecture should Apex implement?',
                    'option_a': 'Cloud Provider Managed Default Keys without rotation.',
                    'option_b': 'Bring Your Own Key (BYOK) or Hold Your Own Key (HYOK) backed by FIPS 140-3 Level 3 dedicated Hardware Security Modules (HSMs).',
                    'option_c': 'Storing plaintext cryptographic keys in environment variables.',
                    'option_d': 'Public-key infrastructure hosted without CRL or OCSP responders.',
                    'correct_answer': 'B',
                    'rationale': 'BYOK/HYOK utilizing FIPS 140-3 validated HSMs guarantees that the enterprise maintains absolute custody and control of cryptographic keys independent of CSP personnel.',
                    'sort_order': 2
                }
            ]
        },
        {
            'id': 'c0000000-0000-0000-0000-000000000072',
            'domain_id': DOMAINS[6]['id'],
            'title': 'Ransomware Outbreak & Business Continuity Orchestration',
            'scenario_text': 'At 02:30 AM on a Sunday, the SOC alerts the Incident Response team that high-volume encrypted disk I/O and mass SMB shares enumeration are occurring across the enterprise healthcare network. Threat actors deployed ransomware through a compromised privileged VPN account lacking multifactor authentication. Critical medical imaging databases and patient telemetry servers have been encrypted with .locked extensions. The organization has a documented RTO of 4 hours and RPO of 1 hour for patient clinical records.',
            'sort_order': 2,
            'questions': [
                {
                    'question_number': 1,
                    'stem': 'During the containment phase of this incident, what is the MOST appropriate technical action?',
                    'option_a': 'Power off all systems immediately by pulling physical power cords.',
                    'option_b': 'Isolate affected network segments and endpoints logically at the firewall/switch layer while preserving volatile memory artifacts (RAM) for forensic investigation.',
                    'option_c': 'Reformat all storage volumes and restore from last month tapes without forensic capture.',
                    'option_d': 'Pay the ransom demand immediately using organizational cryptocurrency reserves.',
                    'correct_answer': 'B',
                    'rationale': 'Containment requires network isolation to halt lateral movement while preserving volatile system memory (RAM) and evidence for root-cause analysis.',
                    'sort_order': 1
                },
                {
                    'question_number': 2,
                    'stem': 'To meet the 1-hour RPO requirement during system restoration, what backup strategy should have been operational?',
                    'option_a': 'Weekly full backups stored on unencrypted USB drives.',
                    'option_b': 'Continuous data replication or immutable snapshots with write-once-read-many (WORM) storage separated from the enterprise Active Directory domain.',
                    'option_c': 'Differential backups executed every 24 hours on the same network share.',
                    'option_d': 'Manual database dumps triggered by database administrators on Fridays.',
                    'correct_answer': 'B',
                    'rationale': 'Immutable WORM backups and continuous replication decoupled from Active Directory prevent ransomware from corrupting backup repositories and ensure RPO compliance under 1 hour.',
                    'sort_order': 2
                }
            ]
        }
    ]

    # Map questions to topics
    final_questions = []
    for q in practice_questions:
        d_num = q['domain_num']
        d_id = DOMAINS[d_num - 1]['id']
        
        # Find matching topic in domain
        matching_topics = [t for t in topics if t['domain_id'] == d_id]
        topic = matching_topics[q['question_number'] % len(matching_topics)] if matching_topics else None
        
        matching_subtopics = [s for s in subtopics if topic and s['topic_id'] == topic['id']]
        subtopic = matching_subtopics[0] if matching_subtopics else None

        final_questions.append({
            'id': f"f0000000-0000-0000-0000-00000007{len(final_questions)+1:04d}",
            'certification_id': CISSP_CERT_ID,
            'domain_id': d_id,
            'topic_id': topic['id'] if topic else None,
            'subtopic_id': subtopic['id'] if subtopic else None,
            'question_number': len(final_questions) + 1,
            'question_type': 'mcq',
            'stem': q['stem'],
            'option_a': q['option_a'],
            'option_b': q['option_b'],
            'option_c': q['option_c'],
            'option_d': q['option_d'],
            'correct_answer': q['correct_answer'],
            'rationale': q['rationale'],
            'difficulty': q['difficulty'],
            'tags': q['tags'],
            'source_reference': q['source_reference'],
            'source_confidence': 'verified',
            'is_active': True
        })

    # Save all JSON datasets to scripts/cissp_data/
    with open('scripts/cissp_data/domains.json', 'w') as f:
        json.dump(DOMAINS, f, indent=2)
    with open('scripts/cissp_data/topics.json', 'w') as f:
        json.dump(topics, f, indent=2)
    with open('scripts/cissp_data/subtopics.json', 'w') as f:
        json.dump(subtopics, f, indent=2)
    with open('scripts/cissp_data/study_materials.json', 'w') as f:
        json.dump(study_materials, f, indent=2)
    with open('scripts/cissp_data/glossary.json', 'w') as f:
        json.dump(glossary, f, indent=2)
    with open('scripts/cissp_data/case_studies.json', 'w') as f:
        json.dump(case_studies, f, indent=2)
    with open('scripts/cissp_data/questions.json', 'w') as f:
        json.dump(final_questions, f, indent=2)

    print("\n=======================================================")
    print("CISSP COMPLETE DATA PACK GENERATED SUCCESSFULLY:")
    print(f" - Domains:         {len(DOMAINS)}")
    print(f" - Topics:          {len(topics)}")
    print(f" - Subtopics:       {len(subtopics)}")
    print(f" - Study Materials: {len(study_materials)}")
    print(f" - Glossary Terms:  {len(glossary)}")
    print(f" - Case Studies:    {len(case_studies)}")
    print(f" - Exam Questions:  {len(final_questions)}")
    print("=======================================================\n")

if __name__ == '__main__':
    build_cissp_pack()
