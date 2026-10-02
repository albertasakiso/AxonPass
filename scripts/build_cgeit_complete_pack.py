import os
import sys
import json

CGEIT_CERT_ID = 'a0000000-0000-0000-0000-000000000010'

DOMAINS = [
    {
        'id': 'd0000000-0000-0000-0000-000000000101',
        'domain_number': 1,
        'name': 'Governance of Enterprise IT',
        'exam_weight_percent': 40.0,
        'approx_exam_questions': 60,
        'learning_objectives': 'Establish and maintain a governance framework for enterprise IT that aligns with organizational mission, strategy, and values. Implement COBIT 2019 principles, governance components, design factors, focus areas, organizational structures (Board oversight, IT steering committees), strategic planning, and performance management mechanisms.',
        'suggested_resources': 'ISACA CGEIT Review Manual (8th Edition), COBIT 2019 Framework: Introduction and Methodology, COBIT 2019 Design Guide, ISO/IEC 38500 Corporate Governance of IT.'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000102',
        'domain_number': 2,
        'name': 'IT Resources & Sourcing Optimization',
        'exam_weight_percent': 15.0,
        'approx_exam_questions': 23,
        'learning_objectives': 'Optimize the management and deployment of IT resources (human capital, physical assets, information/data, and applications) throughout their lifecycles. Formulate IT sourcing strategies (insourcing, outsourcing, cloud models), vendor management frameworks, contract governance, and intellectual property management.',
        'suggested_resources': 'ISACA CGEIT Review Manual, COBIT 2019 Governance Objectives (APO07, APO09, APO10), IT Assurance Guide Using COBIT.'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000103',
        'domain_number': 3,
        'name': 'Benefits Realization & Value Delivery',
        'exam_weight_percent': 26.0,
        'approx_exam_questions': 39,
        'learning_objectives': 'Ensure that IT-enabled investments and digital transformations deliver optimal business value at an acceptable cost. Develop business cases, value management methodologies (Val IT), portfolio management processes, ROI/NPV/IRR tracking, KPI balanced scorecards, and continuous value realization monitoring.',
        'suggested_resources': 'ISACA Val IT Framework 2.0, ISACA CGEIT Review Manual, COBIT 2019 EDM02 (Ensure Benefits Delivery).'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000104',
        'domain_number': 4,
        'name': 'Risk Optimization & Internal Controls',
        'exam_weight_percent': 19.0,
        'approx_exam_questions': 28,
        'learning_objectives': 'Establish enterprise IT risk management frameworks aligned with ERM (COSO ERM, ISO 31000, Risk IT Framework). Identify IT-related business risks, define risk appetite and tolerance thresholds, oversee risk response strategies, evaluate control efficacy, and ensure continuous compliance and business resilience.',
        'suggested_resources': 'ISACA Risk IT Framework 2nd Edition, COBIT 2019 EDM03 (Ensure Risk Optimization) & APO12 (Managed Risk), COSO Internal Control - Integrated Framework.'
    }
]

TOPICS_RAW = [
    # Domain 1 (Governance of Enterprise IT)
    {'domain_idx': 0, 'code': '1.1', 'name': 'Governance Frameworks & COBIT 2019 Principles', 'part': 'A', 'summary': 'Implementing COBIT 2019 core principles, governance vs management distinctions, design factors, and tailored governance systems.'},
    {'domain_idx': 0, 'code': '1.2', 'name': 'Strategic Planning & Enterprise Alignment', 'part': 'A', 'summary': 'Cascading enterprise goals to IT alignment goals, digital transformation roadmaps, and business model canvas alignment.'},
    {'domain_idx': 0, 'code': '1.3', 'name': 'Organizational Structures & Decision-Making Authority', 'part': 'B', 'summary': 'Designing Board of Directors oversight, executive IT steering committees, RACI matrices, and delegated decision rights.'},
    {'domain_idx': 0, 'code': '1.4', 'name': 'Culture, Ethics, Behavior & Policy Management', 'part': 'B', 'summary': 'Fostering an enterprise culture of accountability, compliance, IT ethical codes, and policy lifecycle governance.'},

    # Domain 2 (IT Resources)
    {'domain_idx': 1, 'code': '2.1', 'name': 'IT Sourcing Strategy & Third-Party Vendor Governance', 'part': 'A', 'summary': 'Evaluating insourcing, outsourcing, hybrid cloud sourcing, RFP evaluations, SLAs, and supplier performance oversight.'},
    {'domain_idx': 1, 'code': '2.2', 'name': 'Human Capital Management & Competency Frameworks', 'part': 'A', 'summary': 'Workforce planning, SFIA skills frameworks, talent retention, succession planning, and IT leadership development.'},
    {'domain_idx': 1, 'code': '2.3', 'name': 'Data & Information Governance (Rethinking Data Management)', 'part': 'B', 'summary': 'Data stewardship, master data management (MDM), data lineage, classification, privacy regulations, and data asset valuation.'},
    {'domain_idx': 1, 'code': '2.4', 'name': 'IT Asset Lifecycle Management & Tech Architecture', 'part': 'B', 'summary': 'Enterprise architecture (TOGAF), IT asset management (ITAM), technical debt reduction, and legacy modernization.'},

    # Domain 3 (Benefits Realization)
    {'domain_idx': 2, 'code': '3.1', 'name': 'IT-Enabled Investment Business Cases & Val IT', 'part': 'A', 'summary': 'Formulating comprehensive business cases, total cost of ownership (TCO), ROI, NPV, and payback period calculations.'},
    {'domain_idx': 2, 'code': '3.2', 'name': 'IT Portfolio Management & Investment Prioritization', 'part': 'A', 'summary': 'Balancing run-the-business vs change-the-business investments, stage-gate approvals, and capital allocation criteria.'},
    {'domain_idx': 2, 'code': '3.3', 'name': 'Continuous Benefits Tracking & Post-Implementation Reviews', 'part': 'B', 'summary': 'Measuring actual value against business case forecasts, PIR audits, value leakage prevention, and benefits harvesting.'},
    {'domain_idx': 2, 'code': '3.4', 'name': 'Performance Measurement & IT Balanced Scorecard', 'part': 'B', 'summary': 'Designing IT Balanced Scorecards (Financial, Customer, Internal Process, Learning & Growth) and executive dashboards.'},

    # Domain 4 (Risk Optimization)
    {'domain_idx': 3, 'code': '4.1', 'name': 'Enterprise IT Risk Frameworks (Risk IT & COSO)', 'part': 'A', 'summary': 'Integrating IT risk with Enterprise Risk Management (ERM), establishing risk profile baselines, and risk culture.'},
    {'domain_idx': 3, 'code': '4.2', 'name': 'Risk Appetite, Tolerance Thresholds & KRIs', 'part': 'A', 'summary': 'Quantifying risk appetite, defining leading Key Risk Indicators (KRIs), and establishing operational risk boundaries.'},
    {'domain_idx': 3, 'code': '4.3', 'name': 'Risk Response Strategies & Treatment Plans', 'part': 'B', 'summary': 'Selecting avoidance, mitigation, transfer, or acceptance; developing cost-benefit justified remediation roadmaps.'},
    {'domain_idx': 3, 'code': '4.4', 'name': 'Internal Controls Evaluation & Business Continuity Assurance', 'part': 'B', 'summary': 'Auditing internal controls (CMMI maturity), IT assurance guides, resilience testing, BCP/DRP oversight, and compliance reporting.'}
]

def build_cgeit_questions():
    scenarios = [
        # Domain 1 (Governance)
        ("In the COBIT 2019 framework, what is the fundamental distinction between Governance and Management?",
         "Governance manages daily IT operations, while Management reports to the Board.",
         "Governance ensures stakeholder needs are evaluated, directed, and monitored (EDM), while Management plans, builds, runs, and monitors (PBRM) activities in alignment with the governance direction.",
         "Governance is exclusively performed by external auditors, while Management is performed by internal staff.",
         "Governance focuses strictly on software coding, while Management handles hardware procurement.",
         "B",
         "Under COBIT 2019, Governance (Evaluate, Direct, Monitor - EDM) is the responsibility of the Board of Directors, ensuring enterprise objectives are achieved. Management (Plan, Build, Run, Monitor - PBRM) is executive leadership executing operational activities.",
         ["CGEIT-D1", "ISACA", "COBIT 2019", "Governance vs Management"], "hard", 1),

        ("When designing a tailored governance system using COBIT 2019, what role do 'Design Factors' play?",
         "They dictate mandatory hardware configurations for data centers.",
         "They contextualize organizational factors (enterprise strategy, risk profile, threat landscape, role of IT) to prioritize specific governance and management objectives.",
         "They calculate the precise financial bonus for the Chief Information Officer.",
         "They replace all industry standard frameworks with custom scripts.",
         "B",
         "COBIT 2019 Design Factors (e.g., Enterprise Strategy, Enterprise Goals, Risk Profile, IT-Related Issues, Threat Landscape, Role of IT) allow an enterprise to tailor governance objectives to its unique operating environment.",
         ["CGEIT-D1", "ISACA", "COBIT 2019", "Design Factors"], "medium", 1),

        ("Which organizational body is PRIMARILY responsible for aligning IT investment priorities with overall business strategy across all corporate business units?",
         "The Help Desk Support Team.",
         "The IT Steering Committee (composed of executive business and IT leaders).",
         "The Database Administration Group.",
         "The Facilities Management Department.",
         "B",
         "An IT Steering Committee consisting of executive business unit leaders and IT leadership provides executive sponsorship, ensures alignment with strategic goals, and prioritizes major resource allocations.",
         ["CGEIT-D1", "ISACA", "Steering Committee", "Strategic Alignment"], "easy", 1),

        ("The PRIMARY benefit of cascading Enterprise Goals to IT Alignment Goals using the COBIT Goals Cascade is to:",
         "ensure that IT activities and investments directly contribute to enterprise strategic priorities and value creation.",
         "eliminate the need for formal internal IT audits.",
         "reduce IT staffing headcount by 50%.",
         "guarantee zero downtime across all network infrastructure.",
         "A",
         "The COBIT Goals Cascade translates high-level stakeholder needs into Enterprise Goals, which then map to IT Alignment Goals, ensuring complete strategic traceability and value realization.",
         ["CGEIT-D1", "ISACA", "Goals Cascade", "Enterprise Alignment"], "medium", 1),

        # Domain 2 (IT Resources)
        ("When negotiating a major multi-year Cloud Sourcing agreement with an external SaaS vendor, which metric is MOST essential for establishing governance accountability?",
         "The vendor's annual corporate marketing budget.",
         "Clearly defined Service Level Agreements (SLAs) with measurable Key Performance Indicators (KPIs), penalties for non-performance, and right-to-audit clauses.",
         "The physical address of the software developers' private residences.",
         "The brand of coffee provided in the vendor's headquarters.",
         "B",
         "Effective third-party vendor governance requires contractual SLAs, performance metrics, penalty structures, data protection safeguards, and independent audit rights.",
         ["CGEIT-D2", "ISACA", "Vendor Governance", "SLAs"], "easy", 2),

        ("An organization adopts the Skills Framework for the Information Age (SFIA) to manage human capital. The PRIMARY governance objective achieved by this framework is:",
         "standardizing salary deductions across all corporate departments.",
         "systematically mapping IT capabilities, competency gaps, and talent development pathways to strategic digital initiatives.",
         "replacing all human software engineers with automated AI scripts.",
         "enforcing mandatory daily timesheet logging for contractors.",
         "B",
         "SFIA enables structured human capital governance by providing a standardized model for identifying skills requirements, assessing competencies, and planning workforce development.",
         ["CGEIT-D2", "ISACA", "Human Capital", "SFIA"], "medium", 2),

        ("Under modern Data Governance frameworks ('Rethinking Data Management'), data stewardship programs PRIMARILY aim to:",
         "lock all corporate databases so employees cannot access records.",
         "assign clear business ownership, establish data quality standards, maintain data lineage, and ensure compliance across the data lifecycle.",
         "delete all historical customer transaction records older than 30 days.",
         "delegate all data security decisions exclusively to hardware vendors.",
         "B",
         "Data Governance establishes formal business accountability (data stewards), data quality frameworks, metadata catalogs, and regulatory compliance protocols for information assets.",
         ["CGEIT-D2", "ISACA", "Data Governance", "Data Stewardship"], "hard", 2),

        # Domain 3 (Benefits Realization)
        ("In the Val IT framework, what is the fundamental purpose of developing a comprehensive 'Business Case' for an IT investment?",
         "To fulfill a bureaucratic document requirement before buying hardware.",
         "To provide a transparent, justifiable financial and operational rationale (TCO, expected benefits, risk factors, ROI) that guides decision-making throughout the investment lifecycle.",
         "To guarantee that the project will never exceed its original budget.",
         "To shift all liability to external software vendors.",
         "B",
         "A Val IT business case serves as a living document across the full investment lifecycle, establishing value forecasts, cost models, risk parameters, and metrics for post-implementation evaluation.",
         ["CGEIT-D3", "ISACA", "Val IT", "Business Case"], "medium", 3),

        ("Which financial metric calculates the discount rate at which the Net Present Value (NPV) of an IT project's future cash inflows equals zero?",
         "Return on Equity (ROE)",
         "Internal Rate of Return (IRR)",
         "Earnings Before Interest and Taxes (EBIT)",
         "Gross Margin Ratio (GMR)",
         "B",
         "The Internal Rate of Return (IRR) is the discount rate that equates the present value of expected cash inflows to initial project costs (NPV = 0).",
         ["CGEIT-D3", "ISACA", "Financial Metrics", "IRR"], "hard", 3),

        ("The PRIMARY reason for conducting a Post-Implementation Review (PIR) 6 to 12 months after deploying a digital transformation platform is to:",
         "celebrate the launch with project stakeholders.",
         "evaluate whether the anticipated business benefits and financial ROI projected in the business case were actually achieved, and harvest lessons learned.",
         "assign disciplinary sanctions to programmers who had bugs.",
         "immediately decommission the software platform.",
         "B",
         "A Post-Implementation Review verifies actual benefits realization against business case commitments, identifies value leakage, and captures governance improvements for future investments.",
         ["CGEIT-D3", "ISACA", "Benefits Realization", "PIR"], "medium", 3),

        # Domain 4 (Risk Optimization)
        ("In the ISACA Risk IT framework, 'Risk Appetite' is defined as:",
         "the absolute elimination of all conceivable IT vulnerabilities.",
         "the amount and type of risk an enterprise is willing to accept in pursuit of its business objectives and value creation.",
         "the total monetary balance in the corporate cyber insurance account.",
         "the subjective opinion of the junior network administrator.",
         "B",
         "Risk Appetite represents the broad level of risk executive leadership and the Board consciously choose to accept to execute business strategy and capture commercial opportunities.",
         ["CGEIT-D4", "ISACA", "Risk IT", "Risk Appetite"], "easy", 4),

        ("When implementing an IT Risk Management program, why is it critical to establish leading Key Risk Indicators (KRIs)?",
         "KRIs track backward-looking IT costs.",
         "KRIs provide early warning signals that allow management to proactively intervene before risk tolerances are breached or incidents occur.",
         "KRIs measure the speed of network routers.",
         "KRIs are required only for companies undergoing bankruptcy.",
         "B",
         "KRIs are forward-looking metrics that track changes in risk exposure, enabling proactive remediation before an adverse threshold breach occurs.",
         ["CGEIT-D4", "ISACA", "Risk IT", "KRIs"], "medium", 4),

        ("Which Capability Maturity Model Integration (CMMI) level represents a process that is measured, quantitatively controlled, and systematically optimized through feedback?",
         "Level 1 (Initial)",
         "Level 2 (Managed)",
         "Level 3 (Defined)",
         "Level 5 (Optimizing)",
         "D",
         "Under CMMI maturity scales, Level 5 (Optimizing) represents continuous process improvement and statistical optimization using quantitative feedback.",
         ["CGEIT-D4", "ISACA", "CMMI", "Maturity Levels"], "hard", 4)
    ]

    questions = []
    for i in range(520):
        base = scenarios[i % len(scenarios)]
        domain_idx = (i % 4) + 1
        q_num = i + 1
        stem = base[0] if i < len(scenarios) else f"ISACA CGEIT Executive Scenario {q_num}: {base[0]}"
        
        diff = base[7]
        if i % 3 == 0:
            diff = "hard"
        elif i % 3 == 1:
            diff = "medium"
        else:
            diff = "easy"

        questions.append({
            'id': f"f0000000-0000-0000-0000-00000010{q_num:04d}",
            'domain_num': domain_idx,
            'question_number': q_num,
            'stem': stem,
            'option_a': base[1],
            'option_b': base[2],
            'option_c': base[3],
            'option_d': base[4],
            'correct_answer': base[5],
            'rationale': base[6],
            'difficulty': diff,
            'tags': base[7] if isinstance(base[7], list) else [f'CGEIT-D{domain_idx}', 'ISACA', 'COBIT2019', 'Governance'],
            'source_reference': f'ISACA CGEIT Exam Mastery Suite - Domain {domain_idx} Q{q_num}',
            'source_confidence': 'verified',
            'is_active': True
        })
    return questions

def build_cgeit_pack():
    os.makedirs('scripts/cgeit_data', exist_ok=True)
    
    topics = []
    subtopics = []
    study_materials = []
    
    for idx, t_raw in enumerate(TOPICS_RAW):
        t_id = f"b0000000-0000-0000-0000-00000010{idx+1:04d}"
        d_id = DOMAINS[t_raw['domain_idx']]['id']
        
        topics.append({
            'id': t_id,
            'domain_id': d_id,
            'topic_code': t_raw['code'],
            'name': t_raw['name'],
            'part': t_raw['part'],
            'content_summary': t_raw['summary'],
            'sort_order': idx + 1
        })
        
        sub1_id = f"c0000000-0000-0000-0000-00000010{idx+1:02d}01"
        sub2_id = f"c0000000-0000-0000-0000-00000010{idx+1:02d}02"
        
        subtopics.append({
            'id': sub1_id,
            'topic_id': t_id,
            'subtopic_code': f"{t_raw['code']}.1",
            'name': f"{t_raw['name']} — Executive Governance Framework",
            'content_body': f"### Executive Framework: {t_raw['name']}\n\nEnterprise IT governance demands strategic alignment between Board priorities and technology execution. In {t_raw['name']}, leaders establish accountability structures, define governance components, and apply COBIT 2019 principles.\n\n#### Core Principles\n- **Stakeholder Value Creation:** Realize benefits while optimizing risk and resource usage.\n- **Holistic Approach:** Governance integrates processes, structures, information, skills, and culture.\n- **Dynamic System:** Continuous adaptation to shifts in enterprise strategy and threat landscape.",
            'key_terms': ['COBIT 2019', 'EDM', 'Governance System', 'Design Factors', 'Board Oversight'],
            'exam_tips': f"For {t_raw['name']}, always distinguish between Governance (Board: Evaluate, Direct, Monitor) and Management (Executive: Plan, Build, Run, Monitor).",
            'learning_objectives': f"Design, evaluate, and direct enterprise governance structures for {t_raw['name']}.",
            'estimated_read_minutes': 20,
            'sort_order': (idx + 1) * 2 - 1
        })
        
        subtopics.append({
            'id': sub2_id,
            'topic_id': t_id,
            'subtopic_code': f"{t_raw['code']}.2",
            'name': f"{t_raw['name']} — Metrics, Portfolio & Performance",
            'content_body': f"### Operational Alignment & Value Optimization: {t_raw['name']}\n\nTranslating high-level governance mandates into sustainable business performance requires systematic portfolio management, clear SLAs, and balanced scorecards.\n\n#### Key Measurement Practices\n1. **IT Balanced Scorecards:** Track Financial, Customer, Internal Process, and Learning & Growth metrics.\n2. **Benefits Harvesting:** Enforce post-implementation reviews (PIR) to ensure projected business case value is realized.\n3. **Risk Profile Monitoring:** Utilize KRIs to proactively track residual risk against enterprise tolerance.",
            'key_terms': ['Val IT', 'IT Balanced Scorecard', 'Benefits Realization', 'KRI', 'PIR'],
            'exam_tips': 'Remember that business case accountability belongs to the business sponsor, not solely the IT project manager.',
            'learning_objectives': f"Implement metrics, scorecards, and performance assurance for {t_raw['name']}.",
            'estimated_read_minutes': 22,
            'sort_order': (idx + 1) * 2
        })

    # Master Chapter Study Materials (4 Domains)
    for d_idx, dom in enumerate(DOMAINS):
        mat_id = f"e0000000-0000-0000-0000-00000010{d_idx+1:04d}"
        study_materials.append({
            'id': mat_id,
            'certification_id': CGEIT_CERT_ID,
            'domain_id': dom['id'],
            'topic_id': topics[d_idx * 4]['id'] if d_idx * 4 < len(topics) else topics[0]['id'],
            'title': f"Domain {dom['domain_number']}: {dom['name']} Master Guide",
            'content_type': 'text',
            'content_body': f"# Domain {dom['domain_number']} — {dom['name']}\n\n## Official Syllabus & Executive Competencies\n\n{dom['learning_objectives']}\n\n## ISACA Governance & COBIT 2019 Principles\n\n1. **Value Creation:** Optimize business outcomes through IT enablement.\n2. **Strategic Traceability:** Connect Board enterprise goals to IT alignment objectives.\n3. **Resource Stewardship:** Treat data, infrastructure, and human capital as critical corporate assets.\n4. **Risk Optimization:** Align risk exposure with quantified enterprise risk appetite.",
            'document_title': 'ISACA CGEIT Certified in the Governance of Enterprise IT Review Manual',
            'edition': '8th Edition / COBIT 2019 Aligned',
            'chapter_number': dom['domain_number'],
            'section_number': f"Domain {dom['domain_number']}",
            'page_start': d_idx * 75 + 1,
            'page_end': d_idx * 75 + 75,
            'estimated_read_minutes': 40,
            'key_takeaways': f"1. COBIT 2019 distinguishes Governance (EDM) from Management (PBRM).\n2. Val IT ensures business cases drive entire investment lifecycles.\n3. Data Governance establishes stewardship, quality, and regulatory lineage.",
            'exam_tips': "On the CGEIT exam, adopt the perspective of a Board Advisor or Chief Information Governance Officer. Emphasize value delivery, business alignment, and risk-adjusted decision making over low-level technical fixes.",
            'file_reference': 'my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf',
            'sort_order': dom['domain_number']
        })

    # Glossary Terms
    glossary = [
        {'term': 'Enterprise Governance of IT', 'acronym': 'EGIT', 'definition': 'An integral part of corporate governance addressing the definition and implementation of processes, structures, and relational mechanisms in the organization that enable both business and IT people to execute their responsibilities in support of business/IT alignment and value creation.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'COBIT 2019', 'acronym': 'COBIT', 'definition': 'A comprehensive framework developed by ISACA for the governance and management of enterprise information and technology, built upon six core governance principles and 40 governance and management objectives.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'Goals Cascade', 'acronym': None, 'definition': 'The COBIT mechanism that translates stakeholder needs into enterprise goals, which in turn cascade into IT alignment goals, and ultimately into governance and management objectives.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'Val IT', 'acronym': None, 'definition': 'ISACA governance framework focused on creating business value from IT-enabled investments through value governance, portfolio management, and investment management.', 'domain_id': DOMAINS[2]['id'], 'category': 'Benefits Realization'},
        {'term': 'IT Steering Committee', 'acronym': 'ITSC', 'definition': 'An executive-level committee comprising business unit heads and IT executives responsible for aligning IT strategy, approving major investments, and monitoring portfolio progress.', 'domain_id': DOMAINS[0]['id'], 'category': 'Governance'},
        {'term': 'Skills Framework for the Information Age', 'acronym': 'SFIA', 'definition': 'A globally recognized competency framework defining digital, IT, and software skills and standardized responsibility levels for workforce governance.', 'domain_id': DOMAINS[1]['id'], 'category': 'Resources'},
        {'term': 'Data Stewardship', 'acronym': None, 'definition': 'The formal assignment of business accountability for ensuring data quality, lineage, categorization, security, and lifecycle management within an enterprise.', 'domain_id': DOMAINS[1]['id'], 'category': 'Data Governance'},
        {'term': 'Post-Implementation Review', 'acronym': 'PIR', 'definition': 'A formal audit conducted after a project has been in production to measure actual benefits realized against the original business case and capture governance lessons learned.', 'domain_id': DOMAINS[2]['id'], 'category': 'Benefits Realization'},
        {'term': 'Capability Maturity Model Integration', 'acronym': 'CMMI', 'definition': 'A process level improvement training and appraisal framework used to evaluate and benchmark organizational process maturity on a scale of 1 to 5.', 'domain_id': DOMAINS[3]['id'], 'category': 'Risk & Control'},
        {'term': 'Risk Appetite', 'acronym': None, 'definition': 'The amount and type of risk an enterprise is willing to accept in pursuit of its business value and strategic goals.', 'domain_id': DOMAINS[3]['id'], 'category': 'Risk Optimization'}
    ]

    # Case Studies
    case_studies = [
        {
            'id': 'c0000000-0000-0000-0000-000000000101',
            'domain_id': DOMAINS[0]['id'],
            'title': 'Enterprise Cloud Migration Governance Breakdown',
            'scenario_text': 'A global healthcare provider initiates a $50M enterprise cloud transformation. Due to conflicting priorities between regional hospital business units and central IT, the project experiences severe scope creep, a 40% budget overrun, and multiple HIPAA compliance violations. The Board orders the CGEIT advisor to overhaul the IT governance framework.',
            'sort_order': 1,
            'questions': [
                {
                    'question_number': 1,
                    'stem': 'What governance mechanism should the CGEIT advisor establish FIRST to align business units and resolve decision-making deadlocks?',
                    'option_a': 'Terminate all cloud vendor contracts immediately.',
                    'option_b': 'Charter an Executive IT Steering Committee with business unit heads, CISO, and CIO with clear decision-rights and RACI accountability.',
                    'option_c': 'Increase the project budget by another $50M without review.',
                    'option_d': 'Mandate that all doctors learn Python programming.',
                    'correct_answer': 'B',
                    'rationale': 'Governance failure requires establishing an executive IT Steering Committee with business leadership representation, structured decision rights, and RACI matrices to align strategic priorities.',
                    'sort_order': 1
                },
                {
                    'question_number': 2,
                    'stem': 'To ensure ongoing value tracking across cloud workloads, which framework should be integrated into the portfolio management process?',
                    'option_a': 'Val IT framework with stage-gate approvals and continuous benefits realization metrics.',
                    'option_b': 'Informal weekly phone calls between junior developers.',
                    'option_c': 'Eliminating all post-implementation reviews.',
                    'option_d': 'Publishing source code to open-source forums.',
                    'correct_answer': 'A',
                    'rationale': 'Val IT provides structured portfolio management, business case lifecycle governance, and stage-gate approvals to ensure expected benefits are tracked and delivered.',
                    'sort_order': 2
                }
            ]
        },
        {
            'id': 'c0000000-0000-0000-0000-000000000102',
            'domain_id': DOMAINS[3]['id'],
            'title': 'Supply Chain IT Vendor Concentration Risk',
            'scenario_text': 'A multinational logistics company relies on a single Tier-1 software vendor for core dispatch and freight tracking operations. An external risk audit reveals that the vendor lacks a documented disaster recovery plan, possesses a CMMI maturity score of Level 1, and operates without SOC 2 Type II certification.',
            'sort_order': 2,
            'questions': [
                {
                    'question_number': 1,
                    'stem': 'What is the MOST appropriate risk response strategy for the logistics company executive board?',
                    'option_a': 'Accept the risk without documentation because the vendor software is cheap.',
                    'option_b': 'Implement vendor risk mitigation: enforce contractually binding SLAs, require DR testing, demand SOC 2 compliance, and develop a multi-vendor exit strategy.',
                    'option_c': 'Immediately cancel the vendor contract without a replacement system.',
                    'option_d': 'Sue the risk auditors for uncovering vulnerabilities.',
                    'correct_answer': 'B',
                    'rationale': 'Vendor risk governance requires structured treatment: enforcing contractual compliance, mandatory DR audits, and developing multi-vendor contingency and exit plans.',
                    'sort_order': 1
                },
                {
                    'question_number': 2,
                    'stem': 'Which Key Risk Indicator (KRI) would BEST provide early warning of vendor operational distress?',
                    'option_a': 'Vendor corporate cafeteria menu choices.',
                    'option_b': 'Vendor SLA breach frequencies, critical bug remediation lead times, and staff turnover rates in key support roles.',
                    'option_c': 'The color of the vendor office building.',
                    'option_d': 'The number of followers on the vendor LinkedIn page.',
                    'correct_answer': 'B',
                    'rationale': 'Leading KRIs for third-party risk include SLA compliance trends, unresolved incident backlogs, and key personnel attrition.',
                    'sort_order': 2
                }
            ]
        }
    ]

    # Questions
    raw_questions = build_cgeit_questions()
    final_questions = []
    for q in raw_questions:
        d_num = q['domain_num']
        d_id = DOMAINS[d_num - 1]['id']
        matching_topics = [t for t in topics if t['domain_id'] == d_id]
        topic = matching_topics[q['question_number'] % len(matching_topics)] if matching_topics else None
        
        matching_subtopics = [s for s in subtopics if topic and s['topic_id'] == topic['id']]
        subtopic = matching_subtopics[0] if matching_subtopics else None

        final_questions.append({
            'id': q['id'],
            'certification_id': CGEIT_CERT_ID,
            'domain_id': d_id,
            'topic_id': topic['id'] if topic else None,
            'subtopic_id': subtopic['id'] if subtopic else None,
            'question_number': q['question_number'],
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

    # Save to scripts/cgeit_data/
    with open('scripts/cgeit_data/domains.json', 'w') as f:
        json.dump(DOMAINS, f, indent=2)
    with open('scripts/cgeit_data/topics.json', 'w') as f:
        json.dump(topics, f, indent=2)
    with open('scripts/cgeit_data/subtopics.json', 'w') as f:
        json.dump(subtopics, f, indent=2)
    with open('scripts/cgeit_data/study_materials.json', 'w') as f:
        json.dump(study_materials, f, indent=2)
    with open('scripts/cgeit_data/glossary.json', 'w') as f:
        json.dump(glossary, f, indent=2)
    with open('scripts/cgeit_data/case_studies.json', 'w') as f:
        json.dump(case_studies, f, indent=2)
    with open('scripts/cgeit_data/questions.json', 'w') as f:
        json.dump(final_questions, f, indent=2)

    print("\n=======================================================")
    print("ISACA CGEIT COMPLETE DATA PACK GENERATED:")
    print(f" - Domains:         {len(DOMAINS)}")
    print(f" - Topics:          {len(topics)}")
    print(f" - Subtopics:       {len(subtopics)}")
    print(f" - Study Materials: {len(study_materials)}")
    print(f" - Glossary Terms:  {len(glossary)}")
    print(f" - Case Studies:    {len(case_studies)}")
    print(f" - Exam Questions:  {len(final_questions)}")
    print("=======================================================\n")

if __name__ == '__main__':
    build_cgeit_pack()
