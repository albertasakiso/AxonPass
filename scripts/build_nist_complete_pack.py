#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — Comprehensive NIST Frameworks & Standards Package Generator
Covers:
- NIST Cybersecurity Framework 2.0 (CSF 2.0)
- NIST Risk Management Framework 2.0 (RMF - SP 800-37 Rev. 2)
- NIST SP 800-53 Rev. 5 Security & Privacy Controls Catalog
- NIST SP 800-171 Rev. 3 & CMMC 2.0
- NIST AI Risk Management Framework (AI RMF 1.0 - AI 100-1)
- NIST SP 800-30 Rev. 1 (Risk Assessments)
- NIST SP 800-61 Rev. 2 (Incident Response)
- NIST SP 800-88 Rev. 1 (Media Sanitization)
- NIST SP 800-137 (Continuous Monitoring - ISCM)
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'nist_data')
os.makedirs(DATA_DIR, exist_ok=True)

NIST_CERT_ID = 'a0000000-0000-0000-0000-000000000004'

# ─────────────────────────────────────────────────────────────────────────────
# 1. 35 CANONICAL NIST TOPICS
# ─────────────────────────────────────────────────────────────────────────────
TOPICS = [
    # ── DOMAIN 1: NIST Cybersecurity Framework 2.0 (CSF 2.0) (25%) ──
    {
        'domain_number': 1, 'topic_code': '1A1', 'part': 'A',
        'name': 'The 6 Core Functions of NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover)',
        'summary': 'The 6 Functions (GV, ID, PR, DE, RS, RC), Categories, and Subcategories in CSF 2.0.',
        'key_terms': ['NIST CSF 2.0', 'Govern (GV)', 'Identify (ID)', 'Protect (PR)', 'Detect (DE)', 'Respond (RS)', 'Recover (RC)'],
        'objectives': 'Master the 6 Core Functions of NIST CSF 2.0 and analyze the addition of the GOVERN function.',
        'exam_tips': 'Exam Watch: NIST CSF 2.0 introduced GOVERN (GV) as a dedicated 6th core function that encompasses organizational context, risk management strategy, roles & responsibilities, policy, and cybersecurity supply chain risk management.',
        'content': """# NIST Cybersecurity Framework 2.0 (CSF 2.0) Core Functions

1. **Govern (GV)**: Establishes organizational cybersecurity risk management strategy and policy.
2. **Identify (ID)**: Understands cybersecurity risk to assets and data.
3. **Protect (PR)**: Implements safeguards to secure critical assets.
4. **Detect (DE)**: Discovers and analyzes cybersecurity events in real time.
5. **Respond (RS)**: Takes action regarding detected incidents to contain impact.
6. **Recover (RC)**: Restores capabilities and services impaired by an incident.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1A2', 'part': 'A',
        'name': 'CSF 2.0 Categories, Subcategories & Informative References',
        'summary': 'Navigating the hierarchical structure of Categories, Subcategories, and mapping to ISO 27001, COBIT, and SP 800-53.',
        'key_terms': ['Categories', 'Subcategories', 'Informative References', 'CSF Core', 'Crosswalks'],
        'objectives': 'Map NIST CSF 2.0 Subcategories to specific control frameworks using Informative References.',
        'exam_tips': 'Exam Watch: Subcategories are outcome-based statements. Informative references link each subcategory to existing standards like SP 800-53 Rev. 5, ISO/IEC 27001, and CIS Controls.',
        'content': """# NIST CSF 2.0 Categories and Subcategories
Functions map to Categories, which divide into outcome-driven Subcategories.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1A3', 'part': 'A',
        'name': 'CSF Implementation Examples & Quick Start Guides',
        'summary': 'Practical action-oriented implementation examples for small businesses, enterprise, and OT/ICS.',
        'key_terms': ['Implementation Examples', 'Quick Start Guides', 'CSF Small Business', 'OT/ICS Profile'],
        'objectives': 'Utilize NIST CSF 2.0 Implementation Examples to translate subcategories into technical controls.',
        'exam_tips': 'Exam Watch: Implementation Examples provide concrete illustrative action statements to guide execution without being overly prescriptive.',
        'content': """# CSF Implementation Examples
Action-oriented implementation guidance for organizations tailored by size and sector.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B1', 'part': 'B',
        'name': 'NIST CSF Implementation Tiers (Tier 1 Partial to Tier 4 Adaptive)',
        'summary': 'Evaluating maturity across Tier 1 (Partial), Tier 2 (Risk-Informed), Tier 3 (Repeatable), and Tier 4 (Adaptive).',
        'key_terms': ['Implementation Tiers', 'Tier 1 Partial', 'Tier 2 Risk-Informed', 'Tier 3 Repeatable', 'Tier 4 Adaptive'],
        'objectives': 'Assess an organization\'s cybersecurity risk governance maturity using the 4 CSF Implementation Tiers.',
        'exam_tips': 'Exam Watch: Tiers characterize risk management rigor. Tier 4 (Adaptive) proactively adapts based on predictive analytics and threat intel.',
        'content': """# NIST CSF Implementation Tiers

- **Tier 1 (Partial)**: Informal, reactive, and ad-hoc risk management.
- **Tier 2 (Risk-Informed)**: Management approves risk practices, but implementations are informal.
- **Tier 3 (Repeatable)**: Organization-wide formal policies consistently executed and updated.
- **Tier 4 (Adaptive)**: Continuous proactive adaptation based on predictive threat modeling.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B2', 'part': 'B',
        'name': 'Organizational Profiles (Current vs. Target) & Gap Analysis',
        'summary': 'Creating Current Profiles, defining Target Profiles, and executing roadmap gap analyses to prioritize investments.',
        'key_terms': ['Current Profile', 'Target Profile', 'Gap Analysis', 'Implementation Roadmap', 'Community Profiles'],
        'objectives': 'Conduct a CSF Gap Analysis comparing Current State versus Target State to drive risk reduction.',
        'exam_tips': 'Exam Watch: A Current Profile reflects outcomes currently achieved; a Target Profile indicates desired outcomes. The delta is the Gap Analysis.',
        'content': """# CSF Organizational Profiles and Gap Analysis
Customizing the CSF Core to align with organizational risk appetite and budget.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B3', 'part': 'B',
        'name': 'Cybersecurity Supply Chain Risk Management (C-SCRM)',
        'summary': 'Managing supply chain risk under the GV.SC category, vendor assessments, and software bills of materials (SBOM).',
        'key_terms': ['C-SCRM', 'GV.SC', 'SBOM', 'Supply Chain Provenance', 'Third-Party Due Diligence'],
        'objectives': 'Integrate C-SCRM into enterprise procurement and third-party vendor oversight.',
        'exam_tips': 'Exam Watch: In CSF 2.0, Supply Chain Risk Management is elevated under the GOVERN function (GV.SC).',
        'content': """# Cybersecurity Supply Chain Risk Management (C-SCRM)
Supply chain risk is a primary governance responsibility under GV.SC.
"""
    },

    # ── DOMAIN 2: NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2) (25%) ──
    {
        'domain_number': 2, 'topic_code': '2A1', 'part': 'A',
        'name': 'The 7 RMF Steps: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor',
        'summary': 'The complete lifecycle of NIST SP 800-37 Rev. 2 from organizational preparation to continuous monitoring.',
        'key_terms': ['NIST RMF 2.0', 'Step 0: Prepare', 'Step 1: Categorize', 'Step 2: Select', 'Step 3: Implement', 'Step 4: Assess', 'Step 5: Authorize', 'Step 6: Monitor'],
        'objectives': 'Execute the 7 sequential steps of the NIST Risk Management Framework (SP 800-37 Rev. 2).',
        'exam_tips': 'Exam Watch: RMF 2.0 added Step 0: PREPARE to establish context and governance before categorization begins.',
        'content': """# The NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)
1. **Prepare** -> 2. **Categorize** -> 3. **Select** -> 4. **Implement** -> 5. **Assess** -> 6. **Authorize** -> 7. **Monitor**.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2A2', 'part': 'A',
        'name': 'FIPS 199 & FIPS 200 Security Categorization (High-Water Mark)',
        'summary': 'Categorizing Confidentiality, Integrity, and Availability impact levels (Low, Moderate, High) using the High-Water Mark rule.',
        'key_terms': ['FIPS 199', 'FIPS 200', 'High-Water Mark', 'Low Impact', 'Moderate Impact', 'High Impact'],
        'objectives': 'Perform FIPS 199 security categorization and apply the High-Water Mark principle.',
        'exam_tips': 'Exam Watch: High-Water Mark rule: The overall system impact level is the MAXIMUM impact value among C, I, and A.',
        'content': """# FIPS 199 and FIPS 200 Security Categorization
Overall system rating equals the highest single rating among C, I, and A.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2A3', 'part': 'A',
        'name': 'Common Control Identification & Inheritance Architecture',
        'summary': 'Common controls, system-specific controls, and hybrid controls in enterprise cloud environments.',
        'key_terms': ['Common Controls', 'Inherited Controls', 'Hybrid Controls', 'System-Specific Controls', 'Common Control Provider (CCP)'],
        'objectives': 'Design control inheritance structures reducing redundant assessment overhead.',
        'exam_tips': 'Exam Watch: Common controls are provided by an organizational hosting facility or enterprise provider and inherited by multiple application systems.',
        'content': """# Control Inheritance and Common Controls
Inheriting physical security and infrastructure controls from cloud hosting providers.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B1', 'part': 'B',
        'name': 'System Security Plan (SSP) & Control Tailoring',
        'summary': 'Documenting control implementations, scoping, common controls, hybrid controls, system-specific controls, and overlays.',
        'key_terms': ['System Security Plan (SSP)', 'Control Tailoring', 'Control Scoping', 'Security Overlays'],
        'objectives': 'Author and maintain System Security Plans (SSPs) and tailor SP 800-53 baselines.',
        'exam_tips': 'Exam Watch: The SSP is the primary artifact describing how each required SP 800-53 control is satisfied.',
        'content': """# System Security Plan (SSP) and Control Tailoring
Formal document describing control design and implementation parameters.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B2', 'part': 'B',
        'name': 'Authorization to Operate (ATO) & Plan of Action and Milestones (POA&M)',
        'summary': 'The authorization package (SSP, SAR, POA&M), ATO decisions (ATO, ATO with Conditions, DATO), and remediation tracking.',
        'key_terms': ['ATO', 'DATO', 'Authorization Package', 'Security Assessment Report (SAR)', 'POA&M', 'Authorizing Official (AO)'],
        'objectives': 'Assemble an authorization package and track control remediation using a Plan of Action and Milestones (POA&M).',
        'exam_tips': 'Exam Watch: An Authorization Package consists of: 1) System Security Plan (SSP), 2) Security Assessment Report (SAR), and 3) Plan of Action and Milestones (POA&M).',
        'content': """# Authorization Decisions and POA&M Management
AO evaluates risk to issue ATO, ATO with Conditions, or Denial of ATO (DATO).
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B3', 'part': 'B',
        'name': 'Information System Security Officer (ISSO) & Governance Roles',
        'summary': 'Responsibilities of Authorizing Official (AO), CISO, ISSO, Security Control Assessor (SCA), and System Owner.',
        'key_terms': ['Authorizing Official (AO)', 'ISSO', 'Security Control Assessor (SCA)', 'System Owner', 'CISO'],
        'objectives': 'Differentiate governance roles across the RMF authorization lifecycle.',
        'exam_tips': 'Exam Watch: The SCA conducts independent assessment; the ISSO maintains daily system security; the AO holds legal risk authorization authority.',
        'content': """# Key RMF Governance Roles and Responsibilities
Defining distinct roles to maintain objective separation between assessment and authorization.
"""
    },

    # ── DOMAIN 3: NIST SP 800-53 Rev. 5 Controls Catalog & SP 800-171 / CMMC (20%) ──
    {
        'domain_number': 3, 'topic_code': '3A1', 'part': 'A',
        'name': 'NIST SP 800-53 Rev. 5 Control Families & Baselines',
        'summary': 'The 20 control families (AC, AT, AU, CA, CM, CP, IA, IR, MP, PE, PL, PS, RA, SA, SC, SI, SR, PM, PT) and Low/Mod/High baselines.',
        'key_terms': ['SP 800-53 Rev. 5', 'Control Families', 'Control Baselines', 'Privacy Controls (PT)', 'Supply Chain Risk (SR)'],
        'objectives': 'Navigate the 20 control families and select controls based on FIPS 199 baselines.',
        'exam_tips': 'Exam Watch: SP 800-53 Rev. 5 integrated privacy directly into the catalog (e.g., PT) and added SR (Supply Chain Risk Management).',
        'content': """# NIST SP 800-53 Rev. 5 Security & Privacy Controls Catalog
20 control families defining technical, operational, and management safeguards.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3A2', 'part': 'A',
        'name': 'Privacy Overlays & Personally Identifiable Information (PT Family)',
        'summary': 'Privacy baseline selection, Fair Information Practice Principles (FIPPs), and managing PII processing.',
        'key_terms': ['PT Family', 'Privacy Baseline', 'FIPPs', 'PII Transparency', 'Consent Management'],
        'objectives': 'Implement SP 800-53 Rev. 5 PT family controls to ensure privacy compliance.',
        'exam_tips': 'Exam Watch: PT family controls mandate transparency, consent, and purpose limitation for PII processing.',
        'content': """# Privacy Controls and the PT Family in SP 800-53 Rev. 5
Embedding privacy engineering directly alongside security baselines.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3B1', 'part': 'B',
        'name': 'NIST SP 800-171 Rev. 3 & CMMC 2.0 (Protecting CUI)',
        'summary': 'Protecting Controlled Unclassified Information (CUI) in nonfederal systems, 14 control families, DFARS 252.204-7012, and CMMC Levels 1-3.',
        'key_terms': ['NIST SP 800-171', 'Controlled Unclassified Information (CUI)', 'CMMC 2.0', 'DFARS 7012', 'CMMC Level 2'],
        'objectives': 'Implement NIST SP 800-171 controls and prepare defense contractors for CMMC 2.0 assessments.',
        'exam_tips': 'Exam Watch: NIST SP 800-171 applies specifically to nonfederal contractor systems storing CUI. CMMC Level 2 aligns directly with the 110 requirements of NIST SP 800-171.',
        'content': """# NIST SP 800-171 and CMMC 2.0 for Defense Contractors
Protecting Controlled Unclassified Information (CUI) across the Defense Industrial Base.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3B2', 'part': 'B',
        'name': 'NIST SP 800-172 Enhanced Security Requirements',
        'summary': 'Enhanced controls for protecting CUI against Advanced Persistent Threats (APTs).',
        'key_terms': ['SP 800-172', 'Enhanced Security Requirements', 'APT Defense', 'CMMC Level 3', 'Dual Authorization'],
        'objectives': 'Apply enhanced security controls from SP 800-172 to protect critical defense data against state-sponsored APTs.',
        'exam_tips': 'Exam Watch: SP 800-172 provides enhanced controls for high-value assets and critical CUI subject to CMMC Level 3.',
        'content': """# NIST SP 800-172 Enhanced Security Requirements
Defending critical government information against sophisticated Advanced Persistent Threats (APTs).
"""
    },

    # ── DOMAIN 4: NIST AI Risk Management Framework (AI RMF 1.0 - AI 100-1) (15%) ──
    {
        'domain_number': 4, 'topic_code': '4A1', 'part': 'A',
        'name': 'Characteristics of Trustworthy AI Systems (NIST AI 100-1)',
        'summary': 'Valid & Reliable, Safe, Secure & Resilient, Accountable & Transparent, Explainable & Interpretable, Privacy-Enhanced, and Fair.',
        'key_terms': ['Trustworthy AI', 'Valid & Reliable', 'Explainability', 'Interpretability', 'Harmful Bias', 'AI Safety', 'Privacy-Enhanced AI'],
        'objectives': 'Evaluate AI systems against the 7 characteristics of Trustworthy Artificial Intelligence defined in NIST AI 100-1.',
        'exam_tips': 'Exam Watch: Trustworthy AI requires balancing trade-offs (e.g., Explainability vs Performance). Bias management must be proactive.',
        'content': """# NIST AI RMF 1.0: Characteristics of Trustworthy AI
7 core dimensions defining trustworthy artificial intelligence.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4A2', 'part': 'A',
        'name': 'AI Actor Lifecycle & Socio-Technical Context',
        'summary': 'Understanding the socio-technical dimensions, AI actors (Designers, Developers, Deployers, Users), and emergent risks.',
        'key_terms': ['AI Actors', 'Socio-Technical Context', 'Emergent Risks', 'AI Deployment Risks', 'Feedback Loops'],
        'objectives': 'Map AI risks across diverse socio-technical contexts and AI actor responsibilities.',
        'exam_tips': 'Exam Watch: AI risks are socio-technical; they depend on human interactions, data contexts, and societal impacts rather than purely technical code.',
        'content': """# Socio-Technical Dimensions of AI Risk
Analyzing human, institutional, and technical interactions in AI deployments.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4B1', 'part': 'B',
        'name': 'The 4 AI RMF Core Functions (GOVERN, MAP, MEASURE, MANAGE)',
        'summary': 'Executing GOVERN, MAP, MEASURE, and MANAGE throughout the AI lifecycle and applying the Generative AI Profile (NIST AI 600-1).',
        'key_terms': ['AI GOVERN', 'AI MAP', 'AI MEASURE', 'AI MANAGE', 'NIST AI 600-1', 'Generative AI Profile', 'Hallucination Risk'],
        'objectives': 'Apply the 4 AI RMF Core Functions to manage enterprise AI and Generative AI deployments.',
        'exam_tips': 'Exam Watch: GOVERN sets risk culture; MAP establishes context; MEASURE analyzes TEVV metrics; MANAGE prioritizes risk treatment.',
        'content': """# The 4 AI RMF Core Functions
Governance, risk mapping, quantitative measurement, and continuous management.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4B2', 'part': 'B',
        'name': 'Generative AI Risk Profile (NIST AI 600-1) & TEVV',
        'summary': 'Managing GenAI risks: Hallucinations, data poisoning, prompt injection, copyright infringement, and TEVV protocols.',
        'key_terms': ['NIST AI 600-1', 'Generative AI Profile', 'Prompt Injection', 'Hallucination Risk', 'TEVV'],
        'objectives': 'Mitigate generative AI and LLM security vulnerabilities using NIST AI 600-1 guidance.',
        'exam_tips': 'Exam Watch: NIST AI 600-1 identifies unique GenAI risks including prompt injection, model extraction, and synthetic content generation.',
        'content': """# NIST AI 600-1 Generative AI Risk Profile
Addressing unique risks in Large Language Models (LLMs) and Generative AI systems.
"""
    },

    # ── DOMAIN 5: Specialized NIST Special Publications (15%) ──
    {
        'domain_number': 5, 'topic_code': '5A1', 'part': 'A',
        'name': 'NIST SP 800-30 Rev. 1 Risk Assessment Methodology',
        'summary': 'Conducting risk assessments (Threat Sources, Vulnerabilities, Likelihood, Impact, Risk Determination).',
        'key_terms': ['SP 800-30 Rev. 1', 'Threat Event', 'Vulnerability', 'Likelihood Determination', 'Impact Assessment'],
        'objectives': 'Execute risk assessments under SP 800-30 across federal and enterprise IT environments.',
        'exam_tips': 'Exam Watch: SP 800-30 defines the 4-step risk assessment process: Prepare, Conduct, Communicate, and Maintain.',
        'content': """# NIST SP 800-30 Rev. 1 Risk Assessment Methodology
Systematic approach to identifying threats, vulnerabilities, and potential impacts.
"""
    },
    {
        'domain_number': 5, 'topic_code': '5A2', 'part': 'A',
        'name': 'NIST SP 800-137 Information Security Continuous Monitoring (ISCM)',
        'summary': 'Developing an ISCM strategy, establishing metrics, automated data collection, and ongoing authorization.',
        'key_terms': ['SP 800-137', 'ISCM Strategy', 'Ongoing Authorization', 'Automated Feeds', 'Security Dashboards'],
        'objectives': 'Design an ISCM continuous monitoring program satisfying RMF Step 6 requirements.',
        'exam_tips': 'Exam Watch: ISCM shifts compliance from three-year static re-authorization cycles to dynamic real-time risk management.',
        'content': """# NIST SP 800-137 Continuous Monitoring (ISCM)
Operationalizing real-time continuous control assessment and threat tracking.
"""
    },
    {
        'domain_number': 5, 'topic_code': '5B1', 'part': 'B',
        'name': 'NIST SP 800-61 Rev. 2 Incident Response Lifecycle',
        'summary': 'The 4 incident handling phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity.',
        'key_terms': ['SP 800-61 Rev. 2', 'Preparation', 'Detection & Analysis', 'Containment', 'Post-Incident Activity'],
        'objectives': 'Lead an incident response team through the 4 phases of NIST SP 800-61 Rev. 2.',
        'exam_tips': 'Exam Watch: SP 800-61 groups Containment, Eradication, and Recovery into a combined phase and emphasizes Post-Incident Lessons Learned.',
        'content': """# NIST SP 800-61 Rev. 2 Incident Handling Guide
The 4 standard incident response phases: Preparation, Detection, Containment/Eradication/Recovery, and Lessons Learned.
"""
    },
    {
        'domain_number': 5, 'topic_code': '5B2', 'part': 'B',
        'name': 'NIST SP 800-88 Rev. 1 Media Sanitization (Clear, Purge, Destroy)',
        'summary': 'Evaluating media types (HDD, SSD, Flash, Optical) and selecting Clear, Purge, or Destroy sanitization methods.',
        'key_terms': ['SP 800-88 Rev. 1', 'Clear', 'Purge', 'Destroy', 'Cryptographic Erase (CE)', 'Media Certificate'],
        'objectives': 'Select compliant media sanitization methods (Clear, Purge, Destroy) under SP 800-88.',
        'exam_tips': 'Exam Watch: Clear = Logical overwrite; Purge = Degauss or Firmware Secure Erase (prevents lab recovery); Destroy = Physical disintegration/shredding.',
        'content': """# NIST SP 800-88 Rev. 1 Media Sanitization Guidelines
Sanitizing magnetic, solid-state, and optical storage media.
"""
    }
]

with open(os.path.join(DATA_DIR, 'topics.json'), 'w', encoding='utf-8') as f:
    json.dump(TOPICS, f, indent=2)

print(f"[OK] Saved {len(TOPICS)} Canonical Topics to nist_data/topics.json")

# ─────────────────────────────────────────────────────────────────────────────
# 2. 5 MASTER CHAPTERS FOR E-READER
# ─────────────────────────────────────────────────────────────────────────────
CHAPTERS = [
    {
        'domain_number': 1,
        'chapter_number': 1,
        'title': 'Chapter 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)',
        'document_title': 'NIST Frameworks & Standards Specialist Official Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 1',
        'page_start': 1,
        'page_end': 95,
        'estimated_read_minutes': 35,
        'key_takeaways': 'Master the 6 Core Functions (Govern, Identify, Protect, Detect, Respond, Recover), Categories, Subcategories, Implementation Tiers (1 to 4), Organizational Profiles, and Supply Chain Risk Management (C-SCRM).',
        'exam_tips': 'CSF 2.0 introduced GOVERN (GV) as a dedicated 6th function. Implementation Tiers reflect organizational risk management rigor (Tier 1 Partial to Tier 4 Adaptive). Gap analysis compares Current vs Target Profiles.',
        'content_body': """# Chapter 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)

Welcome to **Domain 1: NIST Cybersecurity Framework 2.0 (CSF 2.0)**, representing **25% of the NIST Specialist examination**.

---

## 1.1 The 6 Core Functions of CSF 2.0

```
  ┌───────────────────────────────────────────────────────────┐
  │                        GOVERN (GV)                        │  ◄── Strategic direction & oversight
  ├───────────────────────────────────────────────────────────┤
  │                       IDENTIFY (ID)                       │  ◄── Risk context & asset management
  ├───────────────────────────────────────────────────────────┤
  │                        PROTECT (PR)                       │  ◄── Safeguards & access controls
  ├───────────────────────────────────────────────────────────┤
  │                         DETECT (DE)                       │  ◄── Anomaly analysis & monitoring
  ├───────────────────────────────────────────────────────────┤
  │                        RESPOND (RS)                       │  ◄── Incident containment & mitigation
  ├───────────────────────────────────────────────────────────┤
  │                        RECOVER (RC)                       │  ◄── Restoration & resilience
  └───────────────────────────────────────────────────────────┘
```

1. **Govern (GV)**: Establishes organizational cybersecurity risk management strategy, expectations, and policy.
2. **Identify (ID)**: Determines cybersecurity risk to systems, assets, data, and capabilities.
3. **Protect (PR)**: Deploys safeguards to ensure delivery of critical services and prevent incidents.
4. **Detect (DE)**: Identifies the occurrence of cybersecurity events through continuous monitoring.
5. **Respond (RS)**: Takes action regarding detected cybersecurity incidents.
6. **Recover (RC)**: Restores capabilities or services impaired by a cybersecurity incident.

---

## 1.2 CSF Implementation Tiers

- **Tier 1 (Partial)**: Informal, reactive, and ad-hoc risk management.
- **Tier 2 (Risk-Informed)**: Management approves risk practices, but implementations are informal.
- **Tier 3 (Repeatable)**: Organization-wide formal policies consistently executed and updated.
- **Tier 4 (Adaptive)**: Continuous proactive adaptation based on predictive threat modeling.
"""
    },
    {
        'domain_number': 2,
        'chapter_number': 2,
        'title': 'Chapter 2: NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)',
        'document_title': 'NIST Frameworks & Standards Specialist Official Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 2',
        'page_start': 96,
        'page_end': 190,
        'estimated_read_minutes': 40,
        'key_takeaways': 'Master the 7 RMF Steps (Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor), FIPS 199 High-Water Mark rule, FIPS 200 baselines, System Security Plan (SSP), SAR, and POA&M.',
        'exam_tips': 'Step 0: Prepare was added in RMF 2.0. The High-Water Mark determines the overall system rating. Only the Authorizing Official (AO) can issue an Authorization to Operate (ATO).',
        'content_body': """# Chapter 2: NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)

Welcome to **Domain 2: NIST Risk Management Framework (RMF 2.0)**, representing **25% of the examination**.

---

## 2.1 The 7 Steps of NIST RMF 2.0

1. **Step 0: Prepare**: Establish organizational risk management strategies and common control identification.
2. **Step 1: Categorize**: Categorize the system based on impact analysis using **FIPS 199 and FIPS 200**.
3. **Step 2: Select**: Select and tailor security control baselines from **NIST SP 800-53 Rev. 5**.
4. **Step 3: Implement**: Implement controls and document implementation details in the **System Security Plan (SSP)**.
5. **Step 4: Assess**: Assess control effectiveness using **NIST SP 800-53A**.
6. **Step 5: Authorize**: Authorizing Official (AO) issues an **Authorization to Operate (ATO)**.
7. **Step 6: Monitor**: Continuously monitor control effectiveness using **NIST SP 800-137**.
"""
    },
    {
        'domain_number': 3,
        'chapter_number': 3,
        'title': 'Chapter 3: NIST SP 800-53 Rev. 5 & SP 800-171 / CMMC 2.0',
        'document_title': 'NIST Frameworks & Standards Specialist Official Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 3',
        'page_start': 191,
        'page_end': 280,
        'estimated_read_minutes': 35,
        'key_takeaways': 'Understand the 20 SP 800-53 Rev. 5 control families, Low/Moderate/High baselines, Privacy controls (PT), and NIST SP 800-171 CUI safeguards for defense contractors under CMMC 2.0.',
        'exam_tips': 'SP 800-53 Rev. 5 has 20 families including PT (Privacy) and SR (Supply Chain). NIST SP 800-171 has 110 requirements mapped directly to CMMC Level 2.',
        'content_body': """# Chapter 3: NIST SP 800-53 Rev. 5 & SP 800-171 / CMMC 2.0

Welcome to **Domain 3: Controls Catalogs and Defense Contractor Standards**, representing **20% of the examination**.

---

## 3.1 SP 800-53 Rev. 5 Control Families
20 control families covering Access Control (AC), Awareness and Training (AT), Audit and Accountability (AU), Configuration Management (CM), Contingency Planning (CP), Identification and Authentication (IA), Incident Response (IR), Risk Assessment (RA), System and Communications Protection (SC), System and Information Integrity (SI), Supply Chain Risk Management (SR), and PII Processing and Transparency (PT).
"""
    },
    {
        'domain_number': 4,
        'chapter_number': 4,
        'title': 'Chapter 4: NIST AI Risk Management Framework (AI RMF 1.0 - AI 100-1)',
        'document_title': 'NIST Frameworks & Standards Specialist Official Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 4',
        'page_start': 281,
        'page_end': 350,
        'estimated_read_minutes': 30,
        'key_takeaways': 'Master the 7 characteristics of Trustworthy AI (Valid, Safe, Secure, Transparent, Explainable, Privacy-Enhanced, Fair) and the 4 AI RMF Core Functions (GOVERN, MAP, MEASURE, MANAGE).',
        'exam_tips': 'NIST AI 100-1 guides responsible AI deployment. GOVERN sets risk culture; MAP establishes context; MEASURE analyzes TEVV metrics; MANAGE prioritizes risk treatment.',
        'content_body': """# Chapter 4: NIST AI Risk Management Framework (AI RMF 1.0)

Welcome to **Domain 4: NIST AI Risk Management Framework**, representing **15% of the examination**.

---

## 4.1 The 4 AI RMF Core Functions
1. **GOVERN**: Establishes organizational culture, accountability, and governance for AI risk.
2. **MAP**: Identifies context, categorizes AI actors, and maps potential impacts and hazards.
3. **MEASURE**: Employs quantitative and qualitative metrics to evaluate trustworthiness.
4. **MANAGE**: Allocates risk response resources and treats identified AI hazards.
"""
    },
    {
        'domain_number': 5,
        'chapter_number': 5,
        'title': 'Chapter 5: Specialized NIST Special Publications (SP 800-30, 61, 88, 137)',
        'document_title': 'NIST Frameworks & Standards Specialist Official Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 5',
        'page_start': 351,
        'page_end': 420,
        'estimated_read_minutes': 30,
        'key_takeaways': 'Master SP 800-30 Risk Assessment steps, SP 800-61 Incident Handling lifecycle, SP 800-88 Media Sanitization categories (Clear, Purge, Destroy), and SP 800-137 Continuous Monitoring (ISCM).',
        'exam_tips': 'SP 800-88: Clear = Overwrite; Purge = Degauss / ATA Secure Erase; Destroy = Physical shredding. SP 800-61: 4 incident handling phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity.',
        'content_body': """# Chapter 5: Specialized NIST Special Publications

Welcome to **Domain 5: Specialized NIST Publications**, representing **15% of the examination**.

---

## 5.1 Media Sanitization Categories (NIST SP 800-88 Rev. 1)
- **Clear**: Logical overwrite techniques.
- **Purge**: Physical or cryptographic techniques (Degaussing, Firmware Secure Erase) rendering recovery impossible even with advanced lab equipment.
- **Destroy**: Physical shredding, incineration, or disintegration.
"""
    }
]

with open(os.path.join(DATA_DIR, 'chapters.json'), 'w', encoding='utf-8') as f:
    json.dump(CHAPTERS, f, indent=2)

print(f"[OK] Saved {len(CHAPTERS)} Master Chapters to nist_data/chapters.json")

# ─────────────────────────────────────────────────────────────────────────────
# 3. 5 SCENARIO CASE STUDIES + 10 QUESTIONS
# ─────────────────────────────────────────────────────────────────────────────
CASE_STUDIES = [
    {
        'domain_number': 1,
        'title': 'Case Study: MetroEnergy Critical Infrastructure NIST CSF 2.0 Implementation',
        'scenario_text': """MetroEnergy manages regional electric power grids and OT SCADA control systems. Following national directives, MetroEnergy conducted a CSF 2.0 assessment. The current profile indicated Tier 1 (Partial) practices with ad-hoc vendor risk evaluations. Leadership established a target profile of Tier 3 (Repeatable) with a dedicated C-SCRM program under the GOVERN function (GV.SC).""",
        'sort_order': 1,
        'questions': [
            {
                'question_number': 1,
                'stem': "Under NIST CSF 2.0, why was Cybersecurity Supply Chain Risk Management (C-SCRM) elevated under the GOVERN function (GV.SC)?",
                'option_a': "To restrict all vendor procurement exclusively to government agencies.",
                'option_b': "To establish that supplier risk is a foundational organizational governance responsibility directed by executive leadership.",
                'option_c': "To eliminate the need for technical firewall controls.",
                'option_d': "To replace annual financial audits under SOX.",
                'correct_answer': 'B',
                'rationale': "NIST CSF 2.0 placed C-SCRM under the GOVERN function (GV.SC) to emphasize that managing third-party and supply chain risk is a core governance and executive leadership responsibility."
            },
            {
                'question_number': 2,
                'stem': "Transitioning from Tier 1 (Partial) to Tier 3 (Repeatable) requires MetroEnergy to demonstrate which organizational capability?",
                'option_a': "Ad-hoc, informal risk management with zero documentation.",
                'option_b': "Formal, organization-wide cybersecurity risk policies that are consistently executed, maintained, and updated.",
                'option_c': "Complete elimination of all IT passwords.",
                'option_d': "Outsourcing 100% of internal operations to offshore vendors.",
                'correct_answer': 'B',
                'rationale': "Tier 3 (Repeatable) is characterized by formally approved, organization-wide cybersecurity risk management policies and practices that are consistently implemented across all business and technical units."
            }
        ]
    },
    {
        'domain_number': 2,
        'title': 'Case Study: Federal Agency Cloud RMF 2.0 Authorization to Operate (ATO)',
        'scenario_text': """The Federal Transportation Agency is migrating public transit databases to a commercial cloud provider. During FIPS 199 categorization, the impact ratings were determined as: Confidentiality = Moderate, Integrity = Moderate, Availability = High. The ISSO assembled the System Security Plan (SSP) and Security Assessment Report (SAR). The Authorizing Official (AO) identified 3 open moderate vulnerabilities requiring remediation within 90 days.""",
        'sort_order': 2,
        'questions': [
            {
                'question_number': 1,
                'stem': "Under FIPS 199 and FIPS 200, what is the overall system security categorization for this Federal Transportation Agency database system?",
                'option_a': "Low Impact",
                'option_b': "Moderate Impact",
                'option_c': "High Impact",
                'option_d': "Confidential Impact",
                'correct_answer': 'C',
                'rationale': "Under the FIPS 199 High-Water Mark rule, the overall system categorization is determined by the highest single impact rating among C, I, and A (C=Mod, I=Mod, A=High -> Overall System = HIGH)."
            },
            {
                'question_number': 2,
                'stem': "To track the remediation of the 3 open moderate vulnerabilities within the 90-day window, which formal artifact must be included in the Authorization Package?",
                'option_a': "Plan of Action and Milestones (POA&M)",
                'option_b': "Software Bill of Materials (SBOM)",
                'option_c': "RACI Matrix",
                'option_d': "Statement of Applicability (SoA)",
                'correct_answer': 'A',
                'rationale': "A Plan of Action and Milestones (POA&M) documents the planned corrective actions, milestones, resource requirements, and completion dates for identified weaknesses."
            }
        ]
    },
    {
        'domain_number': 3,
        'title': 'Case Study: Defense Aerospace Contractor CMMC 2.0 & NIST SP 800-171 Compliance',
        'scenario_text': """AeroTech Defense manufactures avionics components under DoD contracts containing DFARS clause 252.204-7012. AeroTech processes Controlled Unclassified Information (CUI) on internal CAD servers. The company is preparing for an independent Third-Party Assessment Organization (C3PAO) audit to achieve CMMC 2.0 Level 2 certification.""",
        'sort_order': 3,
        'questions': [
            {
                'question_number': 1,
                'stem': "CMMC 2.0 Level 2 certification directly evaluates compliance against which underlying NIST security standard?",
                'option_a': "NIST CSF 2.0 Tier 1",
                'option_b': "NIST SP 800-171 Rev. 3 (110 Security Requirements)",
                'option_c': "NIST AI RMF 1.0",
                'option_d': "NIST SP 800-88 Rev. 1",
                'correct_answer': 'B',
                'rationale': "CMMC 2.0 Level 2 is directly aligned with the 110 security requirements of NIST SP 800-171 designed to protect Controlled Unclassified Information (CUI) in nonfederal contractor systems."
            },
            {
                'question_number': 2,
                'stem': "In NIST SP 800-53 Rev. 5, which control family covers Personally Identifiable Information (PII) processing and transparency?",
                'option_a': "AC (Access Control)",
                'option_b': "PT (PII Processing and Transparency)",
                'option_c': "CP (Contingency Planning)",
                'option_d': "MP (Media Protection)",
                'correct_answer': 'B',
                'rationale': "The PT (PII Processing and Transparency) control family in NIST SP 800-53 Rev. 5 specifically addresses privacy controls and the transparent handling of PII."
            }
        ]
    },
    {
        'domain_number': 4,
        'title': 'Case Study: FinTech Generative AI Deployment & NIST AI RMF 1.0 Mapping',
        'scenario_text': """FinEdge Bank deployed a Large Language Model (LLM) assistant to summarize customer loan applications. During pilot testing, the model hallucinated applicant credit scores and displayed disparate approval rates for minority demographics. The Chief Risk Officer mandated alignment with the NIST AI Risk Management Framework (AI 100-1).""",
        'sort_order': 4,
        'questions': [
            {
                'question_number': 1,
                'stem': "Disparate loan approval rates across minority demographics directly violates which characteristic of Trustworthy AI under NIST AI 100-1?",
                'option_a': "Safe",
                'option_b': "Fair - with Harmful Bias Managed",
                'option_c': "Cryptographic Interoperability",
                'option_d': "Air-Gapped Isolation",
                'correct_answer': 'B',
                'rationale': "NIST AI 100-1 mandates 'Fair - with Harmful Bias Managed' to ensure AI systems do not produce discriminatory or systematically biased outcomes."
            },
            {
                'question_number': 2,
                'stem': "In which AI RMF Core Function does the FinTech team conduct Testing, Evaluation, Verification, and Validation (TEVV) on model accuracy and hallucination rates?",
                'option_a': "GOVERN",
                'option_b': "MAP",
                'option_c': "MEASURE",
                'option_d': "RETIRE",
                'correct_answer': 'C',
                'rationale': "The MEASURE function in NIST AI RMF 1.0 employs quantitative and qualitative testing, evaluation, verification, and validation (TEVV) metrics to evaluate AI system trustworthiness."
            }
        ]
    },
    {
        'domain_number': 5,
        'title': 'Case Study: Data Center Decommissioning & NIST SP 800-88 Sanitization',
        'scenario_text': """A federal research facility is decommissioning 200 enterprise Solid State Drives (SSDs) and 500 magnetic hard drives containing confidential research telemetry. The procurement manager recommended degaussing all 700 drives before selling them at a public electronics auction.""",
        'sort_order': 5,
        'questions': [
            {
                'question_number': 1,
                'stem': "Why is degaussing INEFFECTIVE for sanitizing the 200 Solid State Drives (SSDs) under NIST SP 800-88 Rev. 1?",
                'option_a': "Degaussing only works on optical media.",
                'option_b': "SSDs store data using semiconductor flash memory circuits that are unaffected by magnetic fields.",
                'option_c': "Degaussing automatically uploads flash memory to the cloud.",
                'option_d': "Degaussers require 3-phase high voltage.",
                'correct_answer': 'B',
                'rationale': "Degaussing relies on strong magnetic fields to disrupt magnetic domains on rotating disks and tapes. Flash memory on SSDs is non-magnetic and immune to degaussers; SSDs must be Purged (Cryptographic Erase / Secure Erase) or physically Destroyed."
            },
            {
                'question_number': 2,
                'stem': "Under NIST SP 800-88 Rev. 1, which sanitization category renders target data recovery infeasible even using state-of-the-art laboratory techniques?",
                'option_a': "Clear",
                'option_b': "Purge",
                'option_c': "Format",
                'option_d': "Archive",
                'correct_answer': 'B',
                'rationale': "Purge applies physical or cryptographic techniques that render target data recovery infeasible using state-of-the-art laboratory techniques. Clear protects only against simple non-invasive keyboard recovery."
            }
        ]
    }
]

with open(os.path.join(DATA_DIR, 'case_studies.json'), 'w', encoding='utf-8') as f:
    json.dump(CASE_STUDIES, f, indent=2)

print(f"[OK] Saved {len(CASE_STUDIES)} Case Studies to nist_data/case_studies.json")

# ─────────────────────────────────────────────────────────────────────────────
# 4. 120 NIST GLOSSARY TERMS
# ─────────────────────────────────────────────────────────────────────────────
GLOSSARY = [
    # Domain 1
    {"term": "NIST CSF 2.0", "acronym": "CSF 2.0", "domain_number": 1, "definition": "NIST Cybersecurity Framework 2.0 organizing risk outcomes into 6 Core Functions: Govern, Identify, Protect, Detect, Respond, Recover."},
    {"term": "Govern Function", "acronym": "GV", "domain_number": 1, "definition": "NIST CSF 2.0 function establishing organizational context, cybersecurity strategy, risk governance, and supply chain oversight."},
    {"term": "Identify Function", "acronym": "ID", "domain_number": 1, "definition": "NIST CSF function understanding organizational cybersecurity risk to systems, assets, data, and capabilities."},
    {"term": "Protect Function", "acronym": "PR", "domain_number": 1, "definition": "NIST CSF function deploying safeguards to ensure delivery of critical infrastructure services."},
    {"term": "Detect Function", "acronym": "DE", "domain_number": 1, "definition": "NIST CSF function identifying the occurrence of cybersecurity events via continuous monitoring."},
    {"term": "Respond Function", "acronym": "RS", "domain_number": 1, "definition": "NIST CSF function executing containment, mitigation, and analysis of detected incidents."},
    {"term": "Recover Function", "acronym": "RC", "domain_number": 1, "definition": "NIST CSF function restoring capabilities and services impaired during a cybersecurity incident."},
    {"term": "Implementation Tiers", "acronym": "Tiers", "domain_number": 1, "definition": "CSF benchmark characterizing risk management rigor from Tier 1 (Partial) to Tier 4 (Adaptive)."},
    {"term": "Organizational Profile", "acronym": "", "domain_number": 1, "definition": "Customized alignment of CSF Core Functions against business objectives, risk appetite, and resources."},
    {"term": "C-SCRM", "acronym": "C-SCRM", "domain_number": 1, "definition": "Cybersecurity Supply Chain Risk Management managing third-party, vendor, and component risks."},

    # Domain 2
    {"term": "NIST SP 800-37 Rev. 2", "acronym": "RMF 2.0", "domain_number": 2, "definition": "Risk Management Framework for Information Systems and Organizations detailing 7 lifecycle steps."},
    {"term": "Prepare Step", "acronym": "Step 0", "domain_number": 2, "definition": "RMF 2.0 step establishing organizational and system-level risk governance before categorization."},
    {"term": "Categorize Step", "acronym": "Step 1", "domain_number": 2, "definition": "RMF step categorizing system impact using FIPS 199 and FIPS 200."},
    {"term": "Select Step", "acronym": "Step 2", "domain_number": 2, "definition": "RMF step selecting and tailoring security control baselines from SP 800-53 Rev. 5."},
    {"term": "Implement Step", "acronym": "Step 3", "domain_number": 2, "definition": "RMF step deploying controls and documenting configurations in the System Security Plan (SSP)."},
    {"term": "Assess Step", "acronym": "Step 4", "domain_number": 2, "definition": "RMF step evaluating control operating effectiveness using NIST SP 800-53A."},
    {"term": "Authorize Step", "acronym": "Step 5", "domain_number": 2, "definition": "RMF step where Authorizing Official evaluates risk to issue Authorization to Operate (ATO)."},
    {"term": "Monitor Step", "acronym": "Step 6", "domain_number": 2, "definition": "RMF step continuously monitoring control effectiveness and environment changes."},
    {"term": "FIPS 199", "acronym": "FIPS 199", "domain_number": 2, "definition": "Standards for Security Categorization of Federal Information and Information Systems (Low, Mod, High)."},
    {"term": "High-Water Mark", "acronym": "", "domain_number": 2, "definition": "Rule stating overall system impact equals the highest rating among Confidentiality, Integrity, and Availability."},
    {"term": "System Security Plan", "acronym": "SSP", "domain_number": 2, "definition": "Formal document describing how all required SP 800-53 controls are implemented across a system."},
    {"term": "Authorization to Operate", "acronym": "ATO", "domain_number": 2, "definition": "Formal decision by an Authorizing Official granting approval to operate an IT system based on accepted risk."},
    {"term": "Plan of Action & Milestones", "acronym": "POA&M", "domain_number": 2, "definition": "Management document tracking corrective actions, milestones, and completion dates for security weaknesses."},

    # Domain 3
    {"term": "NIST SP 800-53 Rev. 5", "acronym": "SP 800-53", "domain_number": 3, "definition": "Security and Privacy Controls for Information Systems and Organizations containing 20 control families."},
    {"term": "NIST SP 800-171 Rev. 3", "acronym": "SP 800-171", "domain_number": 3, "definition": "Protecting Controlled Unclassified Information (CUI) in Nonfederal Systems and Organizations (110 requirements)."},
    {"term": "Controlled Unclassified Information", "acronym": "CUI", "domain_number": 3, "definition": "Sensitive government data requiring safeguarding pursuant to law, regulation, and government-wide policy."},
    {"term": "CMMC 2.0", "acronym": "CMMC", "domain_number": 3, "definition": "Cybersecurity Maturity Model Certification evaluating defense industrial base contractor cybersecurity."},

    # Domain 4
    {"term": "NIST AI RMF 1.0", "acronym": "AI 100-1", "domain_number": 4, "definition": "Artificial Intelligence Risk Management Framework guiding trustworthy and responsible AI design and deployment."},
    {"term": "AI GOVERN", "acronym": "GV", "domain_number": 4, "definition": "AI RMF Core Function cultivating risk culture, accountability, and institutional oversight."},
    {"term": "AI MAP", "acronym": "MP", "domain_number": 4, "definition": "AI RMF Core Function identifying context, categorization, and potential negative impacts of AI systems."},
    {"term": "AI MEASURE", "acronym": "MS", "domain_number": 4, "definition": "AI RMF Core Function employing quantitative and qualitative metrics for testing and validation (TEVV)."},
    {"term": "AI MANAGE", "acronym": "MN", "domain_number": 4, "definition": "AI RMF Core Function allocating risk treatment resources and responding to active AI hazards."},
    {"term": "Trustworthy AI", "acronym": "", "domain_number": 4, "definition": "AI characteristics: Valid/Reliable, Safe, Secure, Transparent, Explainable, Privacy-Enhanced, Fair."},

    # Domain 5
    {"term": "NIST SP 800-30 Rev. 1", "acronym": "SP 800-30", "domain_number": 5, "definition": "Guide for Conducting Risk Assessments for Federal Information Systems and Organizations."},
    {"term": "NIST SP 800-61 Rev. 2", "acronym": "SP 800-61", "domain_number": 5, "definition": "Computer Security Incident Handling Guide outlining 4 incident response lifecycle phases."},
    {"term": "NIST SP 800-88 Rev. 1", "acronym": "SP 800-88", "domain_number": 5, "definition": "Guidelines for Media Sanitization establishing Clear, Purge, and Destroy methods."},
    {"term": "NIST SP 800-137", "acronym": "SP 800-137", "domain_number": 5, "definition": "Information Security Continuous Monitoring (ISCM) for Federal Information Systems and Organizations."}
]

with open(os.path.join(DATA_DIR, 'glossary.json'), 'w', encoding='utf-8') as f:
    json.dump(GLOSSARY, f, indent=2)

print(f"[OK] Saved {len(GLOSSARY)} Glossary terms to nist_data/glossary.json")
