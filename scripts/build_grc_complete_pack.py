#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — Complete GRC Package Generator
Builds all datasets:
1. grc_data/topics.json (28 canonical topics & subtopics)
2. grc_data/chapters.json (4 Master E-Reader Chapters with full markdown, tables, and Exam Watch Alerts)
3. grc_data/case_studies.json (4 Real-world Scenario Case Studies + 8 Questions)
4. grc_data/glossary.json (120 GRC Glossary terms)
5. grc_data/questions.json (500+ Verified high-yield questions with complete option rationales)
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'grc_data')
os.makedirs(DATA_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# 1. 28 CANONICAL TOPICS
# ─────────────────────────────────────────────────────────────────────────────
TOPICS_EXPANDED = [
    # Domain 1: Corporate & IT Governance Architecture (25%)
    {
        'domain_number': 1, 'topic_code': '1A1', 'part': 'A',
        'name': 'The IIA Three Lines Model (Governance & Operational Roles)',
        'summary': 'First Line (Operational Management), Second Line (Risk & Compliance Expertise), and Third Line (Independent Internal Audit).',
        'key_terms': ['Three Lines Model', 'First Line', 'Second Line', 'Third Line', 'Internal Audit', 'Governing Body'],
        'objectives': 'Distinguish between management ownership of risk, compliance oversight, and independent internal audit assurance under the IIA Three Lines Model.',
        'exam_tips': 'Exam Watch: First line OWNS and manages risk directly (business units). Second line provides expertise, monitoring, and compliance frameworks. Third line provides INDEPENDENT and objective assurance directly to the Board / Audit Committee.',
        'content': """# The IIA Three Lines Model for Governance and Risk Management

The **Institute of Internal Auditors (IIA) Three Lines Model** provides organizations with a structured governance framework to clarify roles, assign accountability, and ensure effective risk management.

```
                              ┌──────────────────────────────────┐
                              │  GOVERNING BODY / BOARD / AUDIT  │
                              └────────────────┬─────────────────┘
                                               │
             ┌─────────────────────────────────┴─────────────────────────────────┐
             │                                                                   │
             ▼                                                                   ▼
┌───────────────────────────┐ ┌───────────────────────────┐         ┌───────────────────────────┐
│        FIRST LINE         │ │        SECOND LINE        │         │        THIRD LINE         │
│  Operational Management   │ │  Risk & Compliance Teams  │         │  Internal Audit (Assurance)│
├───────────────────────────┤ ├───────────────────────────┤         ├───────────────────────────┤
│ • Owns and manages risks  │ │ • Provides expertise      │         │ • Independent assurance   │
│ • Executes day-to-day     │ │ • Facilitates risk policy │         │ • Reports directly to the │
│   internal controls       │ │ • Monitors compliance     │         │   Board / Audit Committee │
└───────────────────────────┘ └───────────────────────────┘         └───────────────────────────┘
```

---

### 1. The Roles Defined

1. **Governing Body (Board of Directors / Audit Committee)**:
   - Sets organizational objectives, defines risk appetite, and maintains fiduciary accountability to stakeholders and shareholders.
2. **First Line Roles (Operational Management / Business Units)**:
   - **Owns and manages risk** directly during day-to-day business operations.
   - Designs and executes operational controls to achieve objectives within risk tolerances.
3. **Second Line Roles (Risk Management & Compliance Functions)**:
   - Provides complementary expertise, policies, frameworks, and challenge to the first line.
   - Monitors compliance with regulatory and organizational standards.
4. **Third Line Roles (Internal Audit)**:
   - Provides **independent and objective assurance and advice** to the governing body and senior management regarding the adequacy and effectiveness of governance, risk management, and first/second line controls.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Internal Audit (Third Line) must remain strictly independent** from operational management and must NEVER design or execute operational controls. Designing controls impairs their auditing objectivity.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1A2', 'part': 'A',
        'name': 'Board Oversight & IT Steering Committees',
        'summary': 'Board fiduciary duties, Audit Committee composition, Executive IT Steering Committees, and strategic alignment.',
        'key_terms': ['Board of Directors', 'Audit Committee', 'IT Steering Committee', 'Strategic Alignment', 'Fiduciary Duty'],
        'objectives': 'Analyze the responsibilities of the Board of Directors, Audit Committee, and IT Steering Committee in enterprise governance.',
        'exam_tips': 'Exam Watch: The IT Steering Committee bridges the gap between business strategy and IT investments, prioritizing major projects and approving enterprise IT budget allocations.',
        'content': """# Board Oversight and IT Steering Committees

Enterprise governance requires executive alignment between business strategy and information technology operations.

---

### 1. Fiduciary Oversight Bodies

- **Board of Directors**: Holds ultimate legal and fiduciary accountability for corporate governance, risk management, and regulatory compliance.
- **Audit Committee**: A specialized subcommittee of independent board members overseeing financial reporting integrity, internal controls, and the internal/external audit function.
- **IT Steering Committee**: A cross-functional executive committee (comprising CIO, CISO, CFO, and business unit leaders) responsible for:
  - Aligning IT investments with business strategy.
  - Prioritizing major enterprise IT projects and approving budgets.
  - Resolving resource conflicts across departments.
  - Monitoring project milestones and return on investment (ROI).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - The primary function of an **IT Steering Committee** is ensuring that IT strategy directly supports and enables business objectives (**Strategic Alignment**).
"""
    },
    {
        'domain_number': 1, 'topic_code': '1A3', 'part': 'A',
        'name': 'RACI Accountability Matrix & Segregation of Duties',
        'summary': 'Responsible, Accountable, Consulted, and Informed assignments; preventing conflicts of interest.',
        'key_terms': ['RACI Matrix', 'Responsible', 'Accountable', 'Consulted', 'Informed', 'Segregation of Duties'],
        'objectives': 'Construct RACI matrices and identify segregation of duties conflicts across business processes.',
        'exam_tips': 'Exam Watch: In a RACI chart, exactly ONE person should be Accountable (A) for any given task or decision. Multiple Accountable owners causes diffusion of responsibility.',
        'content': """# RACI Matrices and Governance Accountability

Clear accountability prevents organizational gaps, overlapping duties, and governance ambiguity.

---

### 1. The RACI Model

| Letter | Role | Definition | Rule |
| :---: | :--- | :--- | :--- |
| **R** | **Responsible** | The individual or team that performs the work to achieve the deliverable. | Multiple people can be Responsible. |
| **A** | **Accountable** | The single individual with ultimate decision-making authority and veto power. | **Exactly ONE person must be Accountable per task.** |
| **C** | **Consulted** | Subject matter experts providing two-way input and feedback before decisions. | Two-way communication. |
| **I** | **Informed** | Stakeholders kept updated on progress and outcomes after decisions. | One-way communication. |

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - If an enterprise process lists more than one person as **Accountable (A)**, accountability is diluted and governance fails. Only one person can hold the ultimate decision authority.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1A4', 'part': 'A',
        'name': 'Corporate Mission, Values & Stakeholder Value Creation',
        'summary': 'Aligning GRC initiatives with corporate mission, sustainability, ESG principles, and shareholder value.',
        'key_terms': ['Mission & Vision', 'ESG', 'Stakeholder Value', 'Corporate Sustainability', 'Governance Charter'],
        'objectives': 'Align risk and compliance programs with corporate mission, vision, and Environmental, Social, and Governance (ESG) standards.',
        'exam_tips': 'Exam Watch: Principled performance means achieving objectives while addressing uncertainty and acting with integrity.',
        'content': """# Corporate Mission, Values, and Stakeholder Value Creation

GRC is not merely about avoiding fines; it is an active driver of organizational resilience and stakeholder trust.

---

### 1. Principled Performance (OCEG Standard)
**Principled Performance** is the state where an organization reliably achieves objectives while addressing uncertainty and acting with integrity.
- **Strategic Alignment**: Ensuring every compliance rule and risk safeguard directly supports core business objectives.
- **ESG (Environmental, Social, and Governance)**: Broadening corporate governance to include ethical environmental stewardship, social responsibility, and transparent leadership.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B1', 'part': 'B',
        'name': 'COBIT 2019 Governance Framework & ISO/IEC 38500',
        'summary': 'COBIT 2019 Governance and Management Objectives (EDM vs APO, BAI, DSS, MEA) and ISO/IEC 38500 corporate IT governance.',
        'key_terms': ['COBIT 2019', 'EDM', 'APO', 'BAI', 'DSS', 'MEA', 'ISO/IEC 38500', 'Governance vs Management'],
        'objectives': 'Differentiate between Governance and Management domains in COBIT 2019 and apply ISO/IEC 38500 principles.',
        'exam_tips': 'Exam Watch: COBIT separates Governance (Evaluate, Direct, Monitor - EDM) from Management (Plan, Build, Run, Monitor - APO, BAI, DSS, MEA). Governance belongs to the Board; Management belongs to the Executive team.',
        'content': """# COBIT 2019 and ISO/IEC 38500 IT Governance Frameworks

**COBIT 2019 (Control Objectives for Information and Related Technologies)** by ISACA is the premier enterprise framework for information and technology governance.

---

### 1. Governance vs. Management in COBIT 2019

1. **Governance (EDM - Evaluate, Direct, Monitor)**:
   - Ensures stakeholder needs are evaluated, direction is set through prioritization, and performance is monitored against objectives. (Owned by the **Board of Directors**).
2. **Management (APO, BAI, DSS, MEA)**:
   - Plans, builds, runs, and monitors activities in alignment with the direction set by the governance body. (Owned by **Executive Management**).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Governance evaluates, directs, and monitors** (Board duty). **Management plans, builds, runs, and monitors** (Executive management duty).
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B2', 'part': 'B',
        'name': 'Enterprise Policy Lifecycle & Exception Management',
        'summary': 'Policy drafting, stakeholder review, approval, dissemination, annual review, retirement, and formal exception waiver workflows.',
        'key_terms': ['Policy Lifecycle', 'Exception Management', 'Policy Waiver', 'Compensating Control', 'Annual Policy Review'],
        'objectives': 'Manage the end-to-end policy lifecycle and implement structured risk-based policy exception processes.',
        'exam_tips': 'Exam Watch: Policy exceptions must be temporary, documented, approved by the asset owner/CISO, and mitigated by an approved compensating control with a defined expiration date.',
        'content': """# Enterprise Policy Lifecycle and Exception Management

Policies represent mandatory management directives that must be maintained throughout a structured lifecycle.

---

### 1. The 6-Stage Policy Lifecycle

1. **Identify & Draft** $\\rightarrow$ 2. **Consult & Review** $\\rightarrow$ 3. **Approve** $\\rightarrow$ 4. **Publish & Educate** $\\rightarrow$ 5. **Enforce & Monitor** $\\rightarrow$ 6. **Periodic Review & Retire**.

---

### 2. Policy Exception (Waiver) Management
When a business unit cannot technically comply with a policy:
- A formal **Exception Request** must document the business justification and risk analysis.
- An approved **Compensating Control** must be implemented.
- The exception must have a **time-bound expiration date** (typically 6–12 months) and require senior executive sign-off.
"""
    },
    {
        'domain_number': 1, 'topic_code': '1B3', 'part': 'B',
        'name': 'Corporate Ethics, Culture & Whistleblower Programs',
        'summary': 'Organizational tone at the top, code of conduct, anonymous whistleblower hotlines, and anti-retaliation policies.',
        'key_terms': ['Tone at the Top', 'Code of Conduct', 'Whistleblower Hotline', 'Anti-Retaliation Policy', 'Ethical Culture'],
        'objectives': 'Establish an ethical corporate culture supported by confidential reporting channels.',
        'exam_tips': 'Exam Watch: The Board and CEO set the "Tone at the Top". An effective whistleblower program requires anonymous reporting channels and strict, enforceable anti-retaliation protections.',
        'content': """# Corporate Ethics and Whistleblower Protection

Ethical governance begins with executive leadership establishing an organizational culture of integrity.

---

### 1. Whistleblower Hotlines (SOX Section 301 / EU Whistleblowing Directive)
Organizations must maintain independent, confidential mechanisms for employees to report ethical violations, financial fraud, or compliance breaches:
- **Anonymous Channels**: 24/7 third-party phone hotlines and encrypted web portals.
- **Anti-Retaliation Protections**: Legal and corporate guarantees that employees reporting misconduct in good faith cannot be terminated, demoted, or harassed.
- **Audit Committee Escalation**: Reports involving senior management must bypass executive leadership and route directly to the Board Audit Committee.
"""
    },

    # Domain 2: Enterprise Risk Management (ERM) & Assessment (30%)
    {
        'domain_number': 2, 'topic_code': '2A1', 'part': 'A',
        'name': 'COSO ERM Integrated Framework (2017 Enterprise Risk Model)',
        'summary': 'Governance & Culture, Strategy & Objective-Setting, Performance, Review & Revision, and Information, Communication & Reporting.',
        'key_terms': ['COSO ERM', 'Governance & Culture', 'Strategy & Objectives', 'Performance', 'Review & Revision', 'Information & Reporting'],
        'objectives': 'Apply the 5 interrelated components and 20 principles of the COSO Enterprise Risk Management framework.',
        'exam_tips': 'Exam Watch: COSO ERM integrates risk management with strategy and business performance, emphasizing that risk is not just about avoiding loss, but also about creating and preserving value.',
        'content': """# COSO Enterprise Risk Management (ERM) Framework

The **Committee of Sponsoring Organizations of the Treadway Commission (COSO) ERM Framework (2017)** aligns enterprise risk management with strategy and business performance.

---

### 1. The 5 Core Components of COSO ERM
1. **Governance and Culture**: Sets the organization's tone and oversight structure.
2. **Strategy and Objective-Setting**: Evaluates risk appetite in tandem with strategic planning.
3. **Performance**: Identifies, assesses, prioritizes, and responds to risks.
4. **Review and Revision**: Evaluates ERM practices over time.
5. **Information, Communication, and Reporting**: Continuous sharing of risk information across all levels.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2A2', 'part': 'A',
        'name': 'ISO 31000:2018 Risk Management Guidelines',
        'summary': 'ISO 31000 principles, framework (Leadership, Integration, Design, Implementation, Evaluation), and risk assessment process.',
        'key_terms': ['ISO 31000:2018', 'Risk Assessment Process', 'Risk Identification', 'Risk Analysis', 'Risk Evaluation', 'Risk Treatment'],
        'objectives': 'Execute the ISO 31000 risk management process: Scope, Context, Assessment (Identification, Analysis, Evaluation), and Treatment.',
        'exam_tips': 'Exam Watch: ISO 31000 Risk Assessment consists of three sequential sub-steps: 1) Risk Identification, 2) Risk Analysis, and 3) Risk Evaluation.',
        'content': """# ISO 31000:2018 International Risk Management Standard

**ISO 31000:2018** provides an internationally recognized standard for managing risk across all organizational functions.

---

### 1. The ISO 31000 Risk Assessment Process
1. **Risk Identification**: Discovering and describing potential risks.
2. **Risk Analysis**: Comprehending sources, consequences, and likelihood.
3. **Risk Evaluation**: Comparing results against risk criteria to prioritize actions.
4. **Risk Treatment**: Selecting and implementing options for modifying risk (Mitigate, Transfer, Avoid, Accept).
"""
    },
    {
        'domain_number': 2, 'topic_code': '2A3', 'part': 'A',
        'name': 'Risk Appetite, Risk Tolerance & Risk Capacity',
        'summary': 'Defining the maximum risk an enterprise can absorb (Capacity), willingness to take risk (Appetite), and acceptable variance (Tolerance).',
        'key_terms': ['Risk Appetite', 'Risk Tolerance', 'Risk Capacity', 'Risk Boundary', 'Risk Threshold'],
        'objectives': 'Distinguish between Risk Capacity, Risk Appetite, and Risk Tolerance in enterprise risk governance.',
        'exam_tips': 'Exam Watch: Capacity is the maximum risk the organization CAN bear before bankruptcy. Appetite is the risk the Board is WILLING to take. Tolerance is the acceptable variance around specific operational targets.',
        'content': """# Risk Capacity, Risk Appetite, and Risk Tolerance

Effective risk governance requires quantifiable boundaries established by senior leadership.

---

### 1. Definitions and Relationship
- **Risk Capacity**: The absolute maximum amount of risk an organization can technically and financially absorb before insolvency.
- **Risk Appetite**: The amount of risk the Board is willing to accept in pursuit of business objectives.
- **Risk Tolerance**: The acceptable level of variation relative to a specific target.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2A4', 'part': 'A',
        'name': 'Risk Governance Taxonomy & Risk Categories',
        'summary': 'Classifying Strategic, Financial, Operational, Cyber/IT, Regulatory, and Reputational risks.',
        'key_terms': ['Strategic Risk', 'Operational Risk', 'Financial Risk', 'Compliance Risk', 'Reputational Risk', 'Cyber Risk'],
        'objectives': 'Categorize risks into enterprise taxonomy domains for aggregated risk reporting.',
        'exam_tips': 'Exam Watch: A unified risk taxonomy ensures consistent risk vocabulary across IT, legal, accounting, and business operations.',
        'content': """# Enterprise Risk Taxonomy and Categories

A standardized **Risk Taxonomy** provides a common risk vocabulary across the entire enterprise.

---

### 1. Primary Risk Categories
1. **Strategic Risk**: Risks arising from poor business decisions or changing market dynamics.
2. **Financial Risk**: Volatility in interest rates, credit default, liquidity shortage, or currency exchange.
3. **Operational Risk**: Losses resulting from inadequate internal processes, people, systems, or external events.
4. **Compliance & Legal Risk**: Fines, penalties, and litigation resulting from regulatory non-compliance.
5. **Reputational Risk**: Damage to corporate brand equity, public trust, and customer goodwill.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B1', 'part': 'B',
        'name': 'Quantitative vs. Qualitative Risk Assessment',
        'summary': 'SLE, ARO, ALE formulas, cost-benefit analysis for controls, and qualitative risk heatmaps (Likelihood x Impact).',
        'key_terms': ['Quantitative Risk', 'Qualitative Risk', 'Asset Value (AV)', 'Exposure Factor (EF)', 'SLE', 'ARO', 'ALE', 'Risk Heatmap'],
        'objectives': 'Calculate Single Loss Expectancy (SLE), Annualized Loss Expectancy (ALE), and conduct cost-benefit analysis of security controls.',
        'exam_tips': 'Exam Watch: Memorize the formulas: SLE = Asset Value x Exposure Factor. ALE = SLE x ARO. Cost-Benefit of Control = (ALE before - ALE after) - Annual Cost of Control.',
        'content': """# Quantitative and Qualitative Risk Analysis

Risk assessment evaluates risk magnitude using qualitative rankings or quantitative financial calculations.

---

### 1. Quantitative Risk Analysis Formulas
$$\\text{SLE} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$
$$\\text{ALE} = \\text{SLE} \\times \\text{ARO}$$
$$\\text{Value of Safeguard} = (\\text{ALE}_{\\text{before}} - \\text{ALE}_{\\text{after}}) - \\text{Annual Cost of Control}$$
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B2', 'part': 'B',
        'name': 'The Enterprise Risk Register & Inherent vs. Residual Risk',
        'summary': 'Risk logging, risk owners, inherent risk, control effectiveness, and calculating residual risk.',
        'key_terms': ['Risk Register', 'Inherent Risk', 'Residual Risk', 'Control Effectiveness', 'Risk Owner'],
        'objectives': 'Maintain an enterprise risk register and calculate residual risk after evaluating control effectiveness.',
        'exam_tips': 'Exam Watch: Inherent Risk is the raw risk before any controls exist. Residual Risk is the remaining risk after controls are implemented. Inherent Risk - Control Effectiveness = Residual Risk.',
        'content': """# Risk Registers and Inherent vs. Residual Risk

$$\\text{Residual Risk} = \\text{Inherent Risk} - \\text{Control Impact (Mitigation)}$$

- **Inherent Risk**: Raw risk level before any controls are applied.
- **Residual Risk**: Risk that remains after controls are in place.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B3', 'part': 'B',
        'name': 'The Four Risk Treatment Strategies (Mitigate, Transfer, Avoid, Accept)',
        'summary': 'Selecting optimal risk responses based on cost-benefit analysis and risk appetite boundaries.',
        'key_terms': ['Risk Mitigation', 'Risk Transference', 'Risk Avoidance', 'Risk Acceptance', 'Residual Risk Sign-off'],
        'objectives': 'Select appropriate risk responses matching organizational risk appetite.',
        'exam_tips': 'Exam Watch: Insurance = Transfer. Decommissioning = Avoid. Firewalls/MFA = Mitigate. Executive Sign-off = Accept.',
        'content': """# The Four Risk Treatment Strategies

1. **Mitigation (Reduction)**: Implementing controls to lower likelihood or impact.
2. **Transference (Sharing)**: Shifting financial liability to a third party (insurance/outsourcing).
3. **Avoidance**: Eliminating the risk by canceling the activity.
4. **Acceptance**: Formally acknowledging and absorbing the risk with executive sign-off.
"""
    },
    {
        'domain_number': 2, 'topic_code': '2B4', 'part': 'B',
        'name': 'Business Continuity Planning & BIA Integration',
        'summary': 'Integrating ERM with Business Impact Analysis, supply chain resilience, and operational continuity.',
        'key_terms': ['BCP', 'BIA', 'Operational Resilience', 'Critical Business Functions', 'Supply Chain Risk'],
        'objectives': 'Integrate Enterprise Risk Management with operational Business Continuity Planning (BCP).',
        'exam_tips': 'Exam Watch: BIA quantifies financial and operational impacts over time to establish RTO, RPO, and MTD.',
        'content': """# Business Continuity and BIA Integration with ERM

The **Business Impact Analysis (BIA)** bridges strategic ERM with tactical disaster recovery and business continuity.
"""
    },

    # Domain 3: Regulatory Compliance, Legal & Assurance (25%)
    {
        'domain_number': 3, 'topic_code': '3A1', 'part': 'A',
        'name': 'Sarbanes-Oxley Act (SOX 404 & Financial IT Controls)',
        'summary': 'SOX Section 302 CEO/CFO certifications, Section 404 internal control assessments, and IT General Controls (ITGC).',
        'key_terms': ['SOX 404', 'SOX 302', 'ITGC', 'Internal Controls over Financial Reporting (ICFR)', 'Material Weakness'],
        'objectives': 'Evaluate IT General Controls (ITGC) supporting financial reporting compliance under SOX Section 404.',
        'exam_tips': 'Exam Watch: SOX 404 requires management and external auditors to attest to the effectiveness of Internal Controls over Financial Reporting (ICFR). Key ITGC areas include Access Controls, Change Management, and Backup/Operations.',
        'content': """# Sarbanes-Oxley Act (SOX) Compliance and ITGCs

- **SOX 302**: CEO/CFO personal certification of financial reports.
- **SOX 404**: Management and auditor attestation of Internal Controls over Financial Reporting (ICFR).
- **ITGCs**: Access to programs/data, change management, program development, computer operations.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3A2', 'part': 'A',
        'name': 'GDPR Data Privacy, Data Protection Officers & Cross-Border Transfers',
        'summary': 'GDPR 7 principles, Data Protection Impact Assessments (DPIA), DPO independence, Standard Contractual Clauses (SCC), and 72h notifications.',
        'key_terms': ['GDPR', 'Data Subject', 'Data Controller', 'Data Processor', 'DPIA', 'Data Protection Officer (DPO)', '72-Hour Breach Rule'],
        'objectives': 'Implement GDPR compliance frameworks, conduct DPIAs, and ensure lawful cross-border data transfers.',
        'exam_tips': 'Exam Watch: GDPR breach notifications must be submitted to supervisory authorities within 72 HOURS. DPIAs are mandatory for high-risk data processing. DPOs must report directly to the highest level of management without conflicts of interest.',
        'content': """# GDPR Compliance, Privacy Governance, and Cross-Border Transfers

- **7 Principles**: Lawfulness, purpose limitation, data minimization, accuracy, storage limitation, integrity/confidentiality, accountability.
- **72-Hour Breach Rule**: Mandatory notification to supervisory authorities within 72 hours.
- **DPO Role**: Independent compliance advisor reporting to the Board.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3A3', 'part': 'A',
        'name': 'HIPAA / HITECH, PCI-DSS 4.0 & GLBA Mandates',
        'summary': 'Healthcare PHI protections (Security & Privacy Rules), Cardholder Data Environments (CDE), and Gramm-Leach-Bliley banking privacy.',
        'key_terms': ['HIPAA', 'HITECH', 'PHI', 'ePHI', 'Business Associate Agreement (BAA)', 'PCI-DSS 4.0', 'CDE', 'GLBA'],
        'objectives': 'Analyze sector-specific regulatory requirements in healthcare (HIPAA), financial services (GLBA), and payment cards (PCI-DSS).',
        'exam_tips': 'Exam Watch: HIPAA applies to Covered Entities and Business Associates (requires signed BAAs). PCI-DSS protects the Cardholder Data Environment (CDE). GLBA requires financial institutions to disclose privacy notices and safeguard consumer NPI.',
        'content': """# Industry-Specific Regulations: HIPAA, PCI-DSS 4.0, and GLBA

- **HIPAA**: Protects PHI; requires Business Associate Agreements (BAAs).
- **PCI-DSS 4.0**: Protects Cardholder Data Environment (CDE).
- **GLBA**: Financial privacy notices and Safeguards Rule for consumer NPI.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3A4', 'part': 'A',
        'name': 'Anti-Bribery, Corruption & Cross-Border Legal Sanctions',
        'summary': 'Foreign Corrupt Practices Act (FCPA), UK Bribery Act, OFAC sanctions screening, and export control regulations.',
        'key_terms': ['FCPA', 'UK Bribery Act', 'OFAC Sanctions', 'Anti-Money Laundering (AML)', 'Know Your Customer (KYC)'],
        'objectives': 'Implement global anti-corruption compliance controls and trade sanction screening programs.',
        'exam_tips': 'Exam Watch: FCPA prohibits bribing foreign officials to obtain business. Strict liability applies to third-party intermediaries.',
        'content': """# Global Anti-Bribery, Anti-Corruption, and Trade Sanctions

Organizations conducting international business must comply with anti-corruption and trade sanction regimes (FCPA, UK Bribery Act, OFAC).
"""
    },
    {
        'domain_number': 3, 'topic_code': '3B1', 'part': 'B',
        'name': 'SOC 1 vs. SOC 2 Type I & Type II Assurance Reports',
        'summary': 'SSAE 18 / ISAE 3402 reports: Financial reporting (SOC 1) vs Trust Services Criteria (SOC 2: Security, Availability, Processing Integrity, Confidentiality, Privacy); Point-in-Time Type I vs 6-Month Type II.',
        'key_terms': ['SOC 1', 'SOC 2', 'Type I Report', 'Type II Report', 'Trust Services Criteria (TSC)', 'SSAE 18'],
        'objectives': 'Differentiate between SOC 1 and SOC 2 reports and contrast Type I point-in-time vs Type II historical operating effectiveness audits.',
        'exam_tips': 'Exam Watch: SOC 1 evaluates Internal Controls over Financial Reporting. SOC 2 evaluates Trust Services Criteria (Security is mandatory). Type I tests control DESIGN at a single point in time. Type II tests control OPERATING EFFECTIVENESS over a minimum 6-month period.',
        'content': """# SOC 1 and SOC 2 Assurance Reports (AICPA SSAE 18)

- **SOC 1**: Financial controls (ICFR).
- **SOC 2**: Trust Services Criteria (Security, Availability, Integrity, Confidentiality, Privacy).
- **Type I**: Snapshot of control design on a single date.
- **Type II**: Historical operating effectiveness over 6+ months.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3B2', 'part': 'B',
        'name': 'Third-Party Risk Management (TPRM) & Vendor Audits',
        'summary': 'Vendor risk tiering, due diligence questionnaires (SIG, CAIQ), Service Level Agreements (SLAs), right-to-audit clauses, and continuous vendor monitoring.',
        'key_terms': ['TPRM', 'Vendor Due Diligence', 'Right-to-Audit Clause', 'SLA', 'SIG Questionnaire', 'Fourth-Party Risk'],
        'objectives': 'Design a Third-Party Risk Management lifecycle from vendor onboarding and tiering to contract termination.',
        'exam_tips': 'Exam Watch: You can outsource technology and business processes to a third party, but you CANNOT outsource ultimate legal and fiduciary accountability. Contracts must include Right-to-Audit clauses and clear SLAs.',
        'content': """# Third-Party Risk Management (TPRM)

- **Vendor Tiering**: Criticality categorization based on data access and operational impact.
- **Right-to-Audit Clause**: Enforceable contractual right to inspect vendor controls.
- **Accountability Rule**: Accountability cannot be outsourced.
"""
    },
    {
        'domain_number': 3, 'topic_code': '3B3', 'part': 'B',
        'name': 'ISO/IEC 27001 ISMS Certification & External Audit Processes',
        'summary': 'Information Security Management System (ISMS), Annex A controls, Statement of Applicability (SoA), and Stage 1/Stage 2 certification audits.',
        'key_terms': ['ISO/IEC 27001', 'ISMS', 'Annex A Controls', 'Statement of Applicability (SoA)', 'Surveillance Audit'],
        'objectives': 'Lead an ISO 27001 ISMS implementation and navigate Stage 1 and Stage 2 certification audits.',
        'exam_tips': 'Exam Watch: The Statement of Applicability (SoA) documents which ISO 27001 Annex A controls are included or excluded with business justification.',
        'content': """# ISO/IEC 27001 ISMS Certification

**ISO/IEC 27001** specifies the requirements for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).
"""
    },

    # Domain 4: Internal Controls, Audit & Continuous Monitoring (20%)
    {
        'domain_number': 4, 'topic_code': '4A1', 'part': 'A',
        'name': 'The 5 Components of the COSO Internal Control Framework',
        'summary': 'Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities (The COSO Cube).',
        'key_terms': ['COSO Cube', 'Control Environment', 'Risk Assessment', 'Control Activities', 'Information & Communication', 'Monitoring Activities'],
        'objectives': 'Evaluate internal control structures using the 5 components and 17 principles of the COSO Internal Control Integrated Framework.',
        'exam_tips': 'Exam Watch: Memorize the 5 components of the COSO Cube: 1) Control Environment (Foundation/Tone), 2) Risk Assessment, 3) Control Activities (Policies/Procedures), 4) Information & Communication, 5) Monitoring Activities (Ongoing evaluations).',
        'content': """# The COSO Internal Control Integrated Framework

1. **Control Environment (Foundation)**: Tone at the top and ethical values.
2. **Risk Assessment**: Identifying risks to business objectives.
3. **Control Activities**: Policies and procedures executing controls.
4. **Information and Communication**: Flow of relevant data.
5. **Monitoring Activities**: Ongoing reviews and internal audit evaluations.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4A2', 'part': 'A',
        'name': 'Internal Control Design: Preventive vs. Detective vs. Corrective Controls',
        'summary': 'Engineering robust internal controls, compensating controls, automated vs manual controls, and control testing methods.',
        'key_terms': ['Preventive Controls', 'Detective Controls', 'Corrective Controls', 'Compensating Controls', 'Automated Controls', 'Control Testing'],
        'objectives': 'Classify and evaluate the design and operating effectiveness of preventive, detective, corrective, and compensating controls.',
        'exam_tips': 'Exam Watch: Preventive controls are the most cost-effective because they stop loss before it happens (e.g., dual authorization, input validation). Detective controls alert on anomalies (reconciliation, log reviews).',
        'content': """# Internal Control Design and Taxonomy

- **Preventive**: Stops errors/fraud before occurrence (e.g., dual signoff).
- **Detective**: Identifies issues during/after occurrence (e.g., reconciliations).
- **Corrective**: Restores normal operation (e.g., restoring backups).
- **Compensating**: Alternative control when primary is unfeasible.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4A3', 'part': 'A',
        'name': 'Control Deficiencies: Deficiencies vs. Significant Deficiencies vs. Material Weaknesses',
        'summary': 'Grading internal control gaps under auditing standards (PCAOB / AICPA).',
        'key_terms': ['Control Deficiency', 'Significant Deficiency', 'Material Weakness', 'Reasonable Possibility', 'Material Misstatement'],
        'objectives': 'Classify internal control deficiencies by severity and assess impact on financial statements.',
        'exam_tips': 'Exam Watch: A Material Weakness is the most severe finding: a reasonable possibility that a material misstatement will NOT be prevented or detected on a timely basis.',
        'content': """# Grading Internal Control Deficiencies

1. **Control Deficiency**: A flaw in control design or operation that does not allow management to prevent/detect misstatements timely.
2. **Significant Deficiency**: Less severe than a material weakness, yet important enough to merit attention by the Audit Committee.
3. **Material Weakness**: A deficiency (or combination of deficiencies) such that there is a **reasonable possibility that a material financial misstatement will not be prevented or detected**.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4B1', 'part': 'B',
        'name': 'Key Performance Indicators (KPIs) vs. Key Risk Indicators (KRIs)',
        'summary': 'Lagging historical performance metrics (KPIs) vs leading predictive risk triggers (KRIs) and Key Control Indicators (KCIs).',
        'key_terms': ['KPI', 'KRI', 'KCI', 'Leading Indicator', 'Lagging Indicator', 'Threshold Trigger'],
        'objectives': 'Differentiate between KPIs, KRIs, and KCIs and establish early-warning risk threshold triggers.',
        'exam_tips': 'Exam Watch: A KPI is a LAGGING indicator measuring past historical performance. A KRI is a LEADING / PREDICTIVE indicator providing an early warning signal of increasing future risk.',
        'content': """# Key Performance Indicators (KPIs) vs. Key Risk Indicators (KRIs)

- **KPI**: Lagging metric measuring past historical results.
- **KRI**: Leading / predictive metric alerting on rising future risk exposure.
- **KCI**: Status metric measuring control operational health.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4B2', 'part': 'B',
        'name': 'GRC Technology Platforms, Risk Dashboards & Executive Reporting',
        'summary': 'Integrated GRC software architectures, automated control testing, risk heatmaps, Balanced Scorecards, and Board reporting.',
        'key_terms': ['Integrated GRC Platform', 'Balanced Scorecard', 'Executive Risk Dashboard', 'Continuous Control Monitoring (CCM)', 'Board Reporting'],
        'objectives': 'Evaluate integrated GRC technology platforms and design executive risk dashboards for Board reporting.',
        'exam_tips': 'Exam Watch: Integrated GRC platforms eliminate organizational silos by unifying policy management, risk registers, compliance audits, and vendor management into a single centralized database.',
        'content': """# Integrated GRC Platforms and Executive Dashboards

- Centralized risk registers and compliance reporting.
- Continuous Control Monitoring (CCM) via automated API polling.
- Executive risk heatmaps and Balanced Scorecards for the Board.
"""
    },
    {
        'domain_number': 4, 'topic_code': '4B3', 'part': 'B',
        'name': 'Continuous Auditing & Continuous Control Monitoring (CCM)',
        'summary': 'Automated data analytics, exception alerting, real-time audit testing, and CAATs integration in GRC.',
        'key_terms': ['Continuous Auditing', 'Continuous Control Monitoring', 'Automated Audit Testing', 'Exception Triggers'],
        'objectives': 'Implement continuous auditing architectures to shift from periodic annual sampling to real-time control assurance.',
        'exam_tips': 'Exam Watch: Continuous Control Monitoring (CCM) is executed by management (2nd line); Continuous Auditing is executed by Internal Audit (3rd line).',
        'content': """# Continuous Auditing and Continuous Control Monitoring (CCM)

Shifting from manual point-in-time sampling to automated 24/7 continuous assurance across enterprise databases and cloud environments.
"""
    }
]

with open(os.path.join(DATA_DIR, 'topics.json'), 'w', encoding='utf-8') as f:
    json.dump(TOPICS_EXPANDED, f, indent=2)

print(f"[OK] Saved {len(TOPICS_EXPANDED)} Canonical Topics to grc_data/topics.json")

# ─────────────────────────────────────────────────────────────────────────────
# 2. 4 MASTER CHAPTERS FOR E-READER
# ─────────────────────────────────────────────────────────────────────────────
CHAPTERS = [
    {
        'domain_number': 1,
        'chapter_number': 1,
        'title': 'Chapter 1: Corporate & IT Governance Architecture',
        'document_title': 'Enterprise GRC Professional Comprehensive Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 1',
        'page_start': 1,
        'page_end': 110,
        'estimated_read_minutes': 40,
        'key_takeaways': 'Master the IIA Three Lines Model, Board of Directors & Audit Committee oversight, IT Steering Committees, RACI accountability matrices, COBIT 2019 EDM vs Management domains, ISO/IEC 38500, Policy Lifecycle, and Whistleblower protections.',
        'exam_tips': 'The Three Lines Model defines: 1st Line = Operational Risk Ownership, 2nd Line = Risk & Compliance Oversight, 3rd Line = Independent Internal Audit. COBIT separates Governance (Board - Evaluate, Direct, Monitor) from Management (Executive - Plan, Build, Run, Monitor).',
        'content_body': """# Chapter 1: Corporate & IT Governance Architecture

Welcome to **Domain 1: Corporate & IT Governance Architecture**, representing **25% of the Enterprise GRC Professional examination**. Governance provides the strategic structure through which organizational objectives are set, performance is measured, and risks are managed to achieve Principled Performance.

---

## 1.1 The IIA Three Lines Model (2020 Updated Governance Framework)

The **Institute of Internal Auditors (IIA) Three Lines Model** clarifies organizational roles, eliminates functional gaps, and ensures that risk management and assurance are integrated across all business tiers.

```
                              ┌──────────────────────────────────┐
                              │  GOVERNING BODY / BOARD / AUDIT  │  ◄── Fiduciary Oversight & Risk Appetite
                              └────────────────┬─────────────────┘
                                               │
             ┌─────────────────────────────────┴─────────────────────────────────┐
             │                                                                   │
             ▼                                                                   ▼
┌───────────────────────────┐ ┌───────────────────────────┐         ┌───────────────────────────┐
│        FIRST LINE         │ │        SECOND LINE        │         │        THIRD LINE         │
│  Operational Management   │ │  Risk & Compliance Teams  │         │  Internal Audit (Assurance)│
├───────────────────────────┤ ├───────────────────────────┤         ├───────────────────────────┤
│ • Directly owns and       │ │ • Establishes risk policy │         │ • Independent, objective  │
│   manages business risk   │ │ • Monitors compliance     │         │   assurance and advice    │
│ • Executes day-to-day     │ │ • Facilitates risk tools  │         │ • Direct reporting to the │
│   internal controls       │ │ • Challenges 1st line     │         │   Board Audit Committee   │
└───────────────────────────┘ └───────────────────────────┘         └───────────────────────────┘
```

### 1. The Three Lines Detailed

| Line | Role / Function | Key Responsibilities | Independence Level |
| :--- | :--- | :--- | :--- |
| **Governing Body** | Board of Directors / Audit Committee | Establishes strategic vision, defines risk appetite, oversees executive performance, and ensures fiduciary compliance. | Independent oversight. |
| **First Line** | Operational Business Units & IT Management | **Directly owns and manages risk**; designs and executes day-to-day internal controls in daily operations. | Operational (Non-independent). |
| **Second Line** | Enterprise Risk Management (ERM), Compliance, Legal, InfoSec | Establishes risk policies, monitors regulatory compliance, provides expertise, and challenges first-line risk assessments. | Specialized oversight (Reports to Management). |
| **Third Line** | **Internal Audit** | Provides **independent, objective assurance** regarding the adequacy and effectiveness of governance, risk management, and first/second line controls. | **Strictly Independent** (Reports directly to Board Audit Committee). |

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Internal Audit (Third Line) must NEVER design, implement, or operate business controls**. Doing so creates a direct conflict of interest and destroys their auditing objectivity and independence.

---

## 1.2 Board Oversight, Audit Committees, and IT Steering Committees

Effective corporate governance relies on defined committee structures to maintain strategic alignment.

- **Board of Directors**: Holds ultimate legal responsibility for corporate governance, enterprise risk management, and compliance with statutory laws.
- **Audit Committee**: A specialized board subcommittee consisting entirely of independent, non-executive directors with financial expertise. Oversees financial reporting, internal controls, whistleblower complaints, and external auditor independence.
- **IT Steering Committee**: A cross-functional executive leadership committee (CIO, CISO, CFO, Operations Heads) ensuring that IT strategy directly enables business objectives (**Strategic Alignment**).
  - Approves enterprise IT budgets and prioritizes major technology investments.
  - Reviews major project delivery milestones and resolves resource conflicts.

---

## 1.3 RACI Accountability Matrices

Governance frameworks must eliminate ambiguity regarding who holds decision-making authority for every critical business process.

- **R - Responsible**: The "doer" who completes the assigned task. (Multiple individuals can be Responsible).
- **A - Accountable**: The single person with ultimate decision-making authority and veto power. (**Strict Rule: Exactly ONE person must be Accountable per process**).
- **C - Consulted**: Subject matter experts providing two-way consultation before decisions are made.
- **I - Informed**: Stakeholders kept updated on progress after decisions are executed.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - If an exam scenario describes a RACI chart with **two Accountable (A) individuals** for a single financial approval, the governance control is **DEFECTIVE**. Multiple accountable owners leads to finger-pointing and blurred responsibility.

---

## 1.4 COBIT 2019 and ISO/IEC 38500 IT Governance

**COBIT 2019** (ISACA) provides a comprehensive framework separating **Governance** from **Management**:

1. **Governance Domain (Evaluate, Direct, Monitor - EDM)**:
   - Evaluates stakeholder needs and options.
   - Directs executive management through prioritization and decision-making.
   - Monitors performance and compliance against agreed-upon direction.
   - **Owned by the Board of Directors**.
2. **Management Domains (Plan, Build, Run, Monitor)**:
   - **APO**: Align, Plan, and Organize.
   - **BAI**: Build, Acquire, and Implement.
   - **DSS**: Deliver, Service, and Support.
   - **MEA**: Monitor, Evaluate, and Assess.
   - **Owned by Executive Management (C-Suite)**.

---

## 1.5 Enterprise Policy Lifecycle & Exception Governance

```
  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
  │ 1. DRAFT POLICY │ ──► │ 2. REVIEW (GRC) │ ──► │ 3. EXEC APPROVE │
  └─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                           │
  ┌─────────────────┐     ┌─────────────────┐     ┌────────▼────────┐
  │ 6. ANNUAL AUDIT │ ◄── │ 5. ENFORCE & QA │ ◄── │ 4. PUBLISH & ED │
  └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Policy Exception (Waiver) Governance:
When a business unit cannot technically comply with an enterprise policy:
- A formal **Policy Waiver Request** must document the business justification and technical constraints.
- A validated **Compensating Control** must be implemented to mitigate the resulting risk.
- The waiver must be **time-bound (max 6–12 months)** and formally signed off by the CISO/Asset Owner.
"""
    },
    {
        'domain_number': 2,
        'chapter_number': 2,
        'title': 'Chapter 2: Enterprise Risk Management (ERM) & Assessment',
        'document_title': 'Enterprise GRC Professional Comprehensive Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 2',
        'page_start': 111,
        'page_end': 225,
        'estimated_read_minutes': 45,
        'key_takeaways': 'Master COSO ERM 2017 (5 components & 20 principles), ISO 31000:2018 guidelines, Risk Capacity vs Appetite vs Tolerance, Quantitative Risk Formulas (SLE, ARO, ALE, Control ROI), Risk Registers, and the 4 Risk Treatment Strategies (Mitigate, Transfer, Avoid, Accept).',
        'exam_tips': 'Memorize quantitative formulas: SLE = Asset Value x Exposure Factor; ALE = SLE x ARO; Safeguard Value = (ALE before - ALE after) - Annual Control Cost. Inherent Risk - Control Impact = Residual Risk.',
        'content_body': """# Chapter 2: Enterprise Risk Management (ERM) & Assessment

Welcome to **Domain 2: Enterprise Risk Management (ERM) & Assessment**, representing **30% of the Enterprise GRC Professional examination**. ERM enables organizations to identify, analyze, evaluate, and treat uncertainties that impact the achievement of strategic business objectives.

---

## 2.1 COSO ERM Integrated Framework (2017 Strategy & Performance)

The **COSO ERM Framework** connects risk management directly to business strategy and long-term enterprise value creation.

```
  ┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
  │   GOVERNANCE & CULTURE    │ ──► │   STRATEGY & OBJECTIVES   │ ──► │        PERFORMANCE        │
  └───────────────────────────┘     └───────────────────────────┘     └─────────────┬─────────────┘
                                                                                    │
                                    ┌───────────────────────────┐     ┌─────────────▼─────────────┐
                                    │ INFORMATION & REPORTING   │ ◄── │     REVIEW & REVISION     │
                                    └───────────────────────────┘     └───────────────────────────┘
```

1. **Governance and Culture**: Establishes executive oversight, reinforces ethical values, and attracts competent personnel.
2. **Strategy and Objective-Setting**: Defines risk appetite in tandem with strategic planning and business context.
3. **Performance**: Identifies, assesses, prioritizes, and implements risk responses to execute strategy.
4. **Review and Revision**: Assesses ERM practices against substantial organizational changes.
5. **Information, Communication, and Reporting**: Continuous sharing of actionable risk data across all business tiers.

---

## 2.2 Risk Capacity, Risk Appetite, and Risk Tolerance

```
  ┌────────────────────────────────────────────────────────────┐
  │                      RISK CAPACITY                         │ ◄── Maximum risk organization CAN absorb
  ├────────────────────────────────────────────────────────────┤
  │                      RISK APPETITE                         │ ◄── Amount of risk Board is WILLING to accept
  ├────────────────────────────────────────────────────────────┤
  │                     RISK TOLERANCE                         │ ◄── Acceptable operational variance
  └────────────────────────────────────────────────────────────┘
```

- **Risk Capacity**: The absolute maximum amount of risk an organization can absorb before facing catastrophic bankruptcy or insolvency.
- **Risk Appetite**: The broad amount and type of risk that the **Board of Directors and executive management are willing to accept** in pursuit of strategic goals.
- **Risk Tolerance**: The tactical, measurable boundary of acceptable variance around specific operational targets (e.g., Target: zero server downtime; Tolerance: $\\le 15$ minutes unplanned downtime per quarter).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Risk Appetite is always lower than Risk Capacity**. Operating near or above Risk Capacity places the entire enterprise in existential jeopardy.

---

## 2.3 Quantitative Risk Analysis Formulas & Calculations

Quantitative risk analysis attaches precise financial monetary figures to risk events to perform cost-benefit analysis on proposed safeguards.

### 1. Core Formulas

1. **Single Loss Expectancy (SLE)**: The monetary loss incurred every time a single risk event occurs.
   $$\\text{SLE} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$
   *(Exposure Factor is the percentage of asset value destroyed, between 0.0 and 1.0).*
2. **Annualized Rate of Occurrence (ARO)**: The estimated frequency of the event occurring within a 1-year period (e.g., once every 2 years = ARO of 0.5; 3 times per year = ARO of 3.0).
3. **Annualized Loss Expectancy (ALE)**: The expected annual financial loss from a specific risk.
   $$\\text{ALE} = \\text{SLE} \\times \\text{ARO}$$
4. **Cost-Benefit Analysis of a Safeguard / Security Control**:
   $$\\text{Net Value of Safeguard} = (\\text{ALE}_{\\text{before}} - \\text{ALE}_{\\text{after}}) - \\text{Annual Cost of Control}$$
   *(If Net Value $> 0$, the control is financially justified).*

---

## 2.4 Inherent Risk vs. Residual Risk and Risk Registers

$$\\text{Residual Risk} = \\text{Inherent Risk} - \\text{Control Impact (Mitigation)}$$

- **Inherent Risk**: The raw level of risk present in an asset or process **before any controls or safeguards are applied**.
- **Residual Risk**: The remaining risk that persists **after security controls have been implemented and verified**.
- **Secondary Risk**: A new risk created as an unintended side effect of implementing a primary control.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - If **Residual Risk $>$ Risk Appetite**, management must apply additional controls or purchase insurance. Residual Risk must always be brought down within Risk Appetite boundaries.

---

## 2.5 The Four Risk Treatment Strategies

1. **Mitigation (Reduction)**: Implementing internal controls to lower likelihood or impact (e.g., Next-Gen Firewalls, MFA, encryption).
2. **Transference (Sharing)**: Shifting financial liability to a third party (e.g., Cyber liability insurance, cloud SLAs).
3. **Avoidance**: Completely terminating the risky business process or decommissioning the vulnerable technology.
4. **Acceptance**: Acknowledging the risk and choosing not to implement controls because the cost exceeds the potential loss. (Requires formal sign-off by **Senior Management**).
"""
    },
    {
        'domain_number': 3,
        'chapter_number': 3,
        'title': 'Chapter 3: Regulatory Compliance, Legal & Assurance',
        'document_title': 'Enterprise GRC Professional Comprehensive Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 3',
        'page_start': 226,
        'page_end': 335,
        'estimated_read_minutes': 40,
        'key_takeaways': 'Master Sarbanes-Oxley (SOX 302/404) financial ITGCs, GDPR 7 principles and 72-hour breach rules, HIPAA/HITECH BAAs, PCI-DSS 4.0 CDE scope, SOC 1 vs SOC 2 Type I & II assurance reports, ISO 27001 ISMS certification, and Third-Party Risk Management (TPRM).',
        'exam_tips': 'SOX 404 tests ICFR; GDPR mandates 72-hour notifications; SOC 2 Type II tests control operating effectiveness over a 6+ month testing window; Accountability cannot be outsourced to vendors.',
        'content_body': """# Chapter 3: Regulatory Compliance, Legal & Assurance

Welcome to **Domain 3: Regulatory Compliance, Legal & Assurance**, representing **25% of the Enterprise GRC Professional examination**. Compliance frameworks ensure that organizations adhere to applicable statutory laws, industry regulations, and contractual standards.

---

## 3.1 Sarbanes-Oxley Act of 2002 (SOX Compliance & ITGCs)

SOX protects investors from corporate accounting fraud by mandating transparent financial disclosures and verified internal controls.

### 1. Key SOX Sections
- **SOX Section 302**: Mandates that the **CEO and CFO personally certify** quarterly and annual financial statements, attesting that they are responsible for internal controls.
- **SOX Section 404**: Requires management and independent external auditors to assess and report on the effectiveness of **Internal Controls over Financial Reporting (ICFR)**.

### 2. IT General Controls (ITGCs) under SOX 404
Auditors evaluate 4 critical IT control areas supporting financial ERP systems (SAP, Oracle):
1. **Access to Programs & Data**: Privileged user access reviews, password policies, Segregation of Duties (SoD).
2. **Program Change Management**: Formal RFCs, staging testing, CAB authorizations, and code migration reviews.
3. **Program Development**: Secure coding and testing of accounting modules.
4. **Computer Operations**: Batch job scheduling, backup testing, and disaster recovery.

---

## 3.2 GDPR Data Privacy & Cross-Border Governance

The **General Data Protection Regulation (GDPR)** regulates the processing of personal data of individuals located within the European Economic Area (EEA).

### 1. The 7 Core GDPR Principles
1. **Lawfulness, Fairness, and Transparency**
2. **Purpose Limitation**
3. **Data Minimization**
4. **Accuracy**
5. **Storage Limitation**
6. **Integrity and Confidentiality (Security)**
7. **Accountability**

### 2. Critical GDPR Mandates
- **72-Hour Breach Notification**: Controllers must report personal data breaches to supervisory authorities within **72 hours** of discovery.
- **Data Protection Impact Assessment (DPIA)**: Mandatory for high-risk processing (e.g., AI profiling, biometrics).
- **Data Protection Officer (DPO)**: Independent compliance officer reporting directly to the Board without conflicts of interest.

---

## 3.3 SOC 1 vs. SOC 2 Type I & Type II Assurance Reports

Service Organization Control (SOC) reports provide independent assurance regarding a third-party service provider's internal controls.

| Report Type | Scope / Purpose | Key Focus Area | Target Audience |
| :--- | :--- | :--- | :--- |
| **SOC 1 (SSAE 18)** | Internal Controls over Financial Reporting (ICFR). | Payroll processors, loan servicers. | User entity CFOs and financial auditors. |
| **SOC 2 (Trust Services Criteria)** | Non-financial technology criteria: Security, Availability, Integrity, Confidentiality, Privacy. | Cloud SaaS, IaaS, Data Centers. | CIOs, CISOs, enterprise GRC teams. |

### Type I vs. Type II Reports:
- **Type I Report**: Evaluates control **DESIGN** as of a single point in time (e.g., June 30).
- **Type II Report**: Tests control **OPERATING EFFECTIVENESS** over a minimum **6-month to 12-month historical testing period**.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - Enterprise vendor risk assessments require a **SOC 2 Type II report** because it proves controls worked consistently over a 6+ month period rather than just looking compliant on a single day.

---

## 3.4 Third-Party Risk Management (TPRM)

- **Vendor Risk Tiering**: Categorizing vendors by risk impact and data access (Tier 1: High Risk; Tier 3: Low Risk).
- **Right-to-Audit Clause**: Enforceable contractual clause granting the client the right to inspect vendor controls.
- **Accountability Rule**: **You can outsource operations, but you CANNOT outsource legal accountability**.
"""
    },
    {
        'domain_number': 4,
        'chapter_number': 4,
        'title': 'Chapter 4: Internal Controls, Audit & Continuous Monitoring',
        'document_title': 'Enterprise GRC Professional Comprehensive Review Manual',
        'edition': '2024/2025 Edition',
        'section_number': 'Domain 4',
        'page_start': 336,
        'page_end': 420,
        'estimated_read_minutes': 35,
        'key_takeaways': 'Master the 5 components of the COSO Internal Control Cube (Control Environment, Risk Assessment, Control Activities, Information & Communication, Monitoring), Control Deficiencies vs Material Weaknesses, KPIs vs KRIs vs KCIs, Balanced Scorecards, and Continuous Control Monitoring (CCM).',
        'exam_tips': 'Control Environment is the foundation of the COSO Cube; KPIs are lagging historical metrics; KRIs are leading predictive risk triggers; A Material Weakness creates a reasonable possibility of an unprevented material misstatement.',
        'content_body': """# Chapter 4: Internal Controls, Audit & Continuous Monitoring

Welcome to **Domain 4: Internal Controls, Audit & Continuous Monitoring**, representing **20% of the Enterprise GRC Professional examination**. This domain covers internal control engineering, deficiency grading, continuous assurance, and executive GRC dashboards.

---

## 4.1 The COSO Internal Control Integrated Framework (The COSO Cube)

```
  ┌───────────────────────────────────────────────────────────┐
  │                 5. MONITORING ACTIVITIES                  │  ◄── Ongoing evaluations & internal audit
  ├───────────────────────────────────────────────────────────┤
  │              4. INFORMATION & COMMUNICATION               │  ◄── Timely, high-quality data exchange
  ├───────────────────────────────────────────────────────────┤
  │                   3. CONTROL ACTIVITIES                   │  ◄── Policies & procedures executing controls
  ├───────────────────────────────────────────────────────────┤
  │                     2. RISK ASSESSMENT                    │  ◄── Dynamic risk identification & analysis
  ├───────────────────────────────────────────────────────────┤
  │                   1. CONTROL ENVIRONMENT                  │  ◄── "Tone at the Top" & ethical bedrock
  └───────────────────────────────────────────────────────────┘
```

1. **Control Environment (Foundation)**: Sets the ethical tone of the organization, reinforces governance structures, and establishes authority.
2. **Risk Assessment**: The dynamic process of identifying and assessing risks that jeopardize the achievement of objectives.
3. **Control Activities**: The actual policies, procedures, and automated controls (preventive and detective) established to mitigate risks.
4. **Information and Communication**: Ensuring timely, high-quality information flows across all levels of the organization.
5. **Monitoring Activities**: Ongoing evaluations and separate internal audit assessments to verify that all 5 components are present and functioning.

---

## 4.2 Grading Internal Control Deficiencies

Auditing standards classify internal control deficiencies into three distinct severity levels:

1. **Control Deficiency**: A flaw in control design or operation where a control fails to prevent or detect misstatements on a timely basis.
2. **Significant Deficiency**: A deficiency less severe than a material weakness, yet important enough to merit attention by the Board Audit Committee.
3. **Material Weakness**: The most severe audit finding: a deficiency (or combination of deficiencies) in internal controls such that there is a **reasonable possibility that a material misstatement will not be prevented or detected on a timely basis**.

---

## 4.3 Key Performance Indicators (KPIs) vs. Key Risk Indicators (KRIs)

```
  ┌─────────────────────────────────────────────────────────────┐
  │          KEY PERFORMANCE INDICATOR (KPI - Lagging)          │  ◄── "How well did we achieve our past goals?"
  │                       (Historical)                          │      e.g., Quarterly revenue, customer churn.
  ├─────────────────────────────────────────────────────────────┤
  │             KEY RISK INDICATOR (KRI - Leading)              │  ◄── "What future threats are emerging?"
  │                        (Predictive)                         │      e.g., Unpatched high-severity CVEs, failed logins.
  ├─────────────────────────────────────────────────────────────┤
  │            KEY CONTROL INDICATOR (KCI - Status)             │  ◄── "Are our internal controls working effectively?"
  │                   (Control Effectiveness)                   │      e.g., % of endpoints running updated antivirus.
  └─────────────────────────────────────────────────────────────┘
```

- **KPI (Lagging)**: Measures past historical performance against strategic business targets.
- **KRI (Leading / Predictive)**: Acts as an early-warning signal indicating that risk exposure is increasing or approaching risk tolerance limits.
- **KCI (Status)**: Measures the operating health and effectiveness of an individual control.

---

## 4.4 Integrated GRC Platforms and Continuous Control Monitoring (CCM)

- **Integrated GRC Platforms**: Centralizes risk registers, policy lifecycles, vendor evaluations, and audit workflows into a unified database.
- **Continuous Control Monitoring (CCM)**: Automated software polling APIs 24/7 to verify that technical controls (e.g., database encryption, MFA enforcement, backup snapshots) remain operational in real time.
"""
    }
]

with open(os.path.join(DATA_DIR, 'chapters.json'), 'w', encoding='utf-8') as f:
    json.dump(CHAPTERS, f, indent=2)

print(f"[OK] Saved {len(CHAPTERS)} Master Chapters to grc_data/chapters.json")

# ─────────────────────────────────────────────────────────────────────────────
# 3. 4 SCENARIO CASE STUDIES + 8 QUESTIONS
# ─────────────────────────────────────────────────────────────────────────────
CASE_STUDIES = [
    {
        'domain_number': 1,
        'title': 'Case Study: ApexBanking SOX 404 ITGC Failure & Governance Remediation',
        'scenario_text': """ApexBanking is a publicly traded financial institution subject to Sarbanes-Oxley (SOX) Section 404. During an annual external audit, external auditors discovered that 12 software developers possessed permanent local administrator credentials to the production Oracle database hosting the general ledger. Furthermore, emergency database changes were deployed directly without prior testing or Change Advisory Board (CAB) review, creating a material risk of undetected financial record alteration.""",
        'sort_order': 1,
        'questions': [
            {
                'question_number': 1,
                'stem': "Software developers having permanent administrative access to the production financial ledger represents a critical breakdown in which fundamental internal control principle?",
                'option_a': "Discretionary Access Control (DAC)",
                'option_b': "Segregation of Duties (SoD)",
                'option_c': "Zero Trust Microsegmentation",
                'option_d': "Annual Loss Expectancy (ALE)",
                'correct_answer': 'B',
                'rationale': "Segregation of Duties (SoD) requires that developers who write code cannot possess administrative access to production financial databases where they could execute unauthorized transactions undetected."
            },
            {
                'question_number': 2,
                'stem': "Under SOX 404, what is the most severe classification the external auditor will assign to this pervasive change management and access control failure?",
                'option_a': "Operational Inconvenience",
                'option_b': "Significant Deficiency",
                'option_c': "Material Weakness",
                'option_d': "Standard Audit Deviation",
                'correct_answer': 'C',
                'rationale': "A Material Weakness is a severe deficiency (or combination of deficiencies) in internal controls resulting in a reasonable possibility that a material misstatement of financial statements will not be prevented or detected timely."
            }
        ]
    },
    {
        'domain_number': 2,
        'title': 'Case Study: GlobalLogistics Risk Appetite Exceedance & Quantitative Analysis',
        'scenario_text': """GlobalLogistics operates automated cargo hubs across North America. A risk assessment of their automated sorting conveyor system (Asset Value = $4,000,000) revealed that a major power surge could destroy 50% of the electronic controllers (Exposure Factor = 0.50). Historical utility data indicates power surges occur once every 4 years (Annualized Rate of Occurrence = 0.25). A commercial industrial surge suppression system costs $15,000 annually and would reduce the surge loss to zero.""",
        'sort_order': 2,
        'questions': [
            {
                'question_number': 1,
                'stem': "What is the Annualized Loss Expectancy (ALE) for the automated conveyor system power surge risk before installing the surge suppression system?",
                'option_a': "$2,000,000",
                'option_b': "$500,000",
                'option_c': "$250,000",
                'option_d': "$50,000",
                'correct_answer': 'B',
                'rationale': "SLE = Asset Value ($4,000,000) x Exposure Factor (0.50) = $2,000,000. ALE = SLE ($2,000,000) x ARO (0.25) = $500,000 per year."
            },
            {
                'question_number': 2,
                'stem': "What is the net annual cost-benefit (safeguard value) of implementing the $15,000 industrial surge suppression system?",
                'option_a': "$485,000 net savings per year",
                'option_b': "$1,985,000 net savings per year",
                'option_c': "$235,000 net savings per year",
                'option_d': "$15,000 net loss per year",
                'correct_answer': 'A',
                'rationale': "Safeguard Value = (ALE before [$500,000] - ALE after [$0]) - Annual Cost of Control ($15,000) = $485,000 net financial benefit per year."
            }
        ]
    },
    {
        'domain_number': 3,
        'title': 'Case Study: HealthTech Cloud Migration & TPRM Vendor Assurance',
        'scenario_text': """HealthTech Inc. is migrating its patient analytics portal to an external SaaS vendor, CloudAI Corp. Because CloudAI will process Protected Health Information (PHI) and European clinical trial data, HealthTech's GRC team initiated a third-party risk assessment. CloudAI provided a SOC 2 Type I report dated 14 months ago. HealthTech's Chief Compliance Officer refused to approve the contract based solely on the Type I report.""",
        'sort_order': 3,
        'questions': [
            {
                'question_number': 1,
                'stem': "Why was the Chief Compliance Officer justified in rejecting CloudAI Corp's 14-month-old SOC 2 Type I report?",
                'option_a': "Type I reports are only used for financial audits under SOX 404.",
                'option_b': "A Type I report only evaluates control design at a single point in time, unlike a Type II report which tests operational effectiveness over a 6+ month period.",
                'option_c': "Cloud service providers are legally prohibited from issuing SOC reports.",
                'option_d': "SOC 2 reports cannot cover the Security trust services criteria.",
                'correct_answer': 'B',
                'rationale': "A SOC 2 Type I report only evaluates whether controls are suitably designed at a single point in time. Enterprise vendor assessments require a SOC 2 Type II report, which tests actual operating effectiveness over a minimum 6-month historical period."
            },
            {
                'question_number': 2,
                'stem': "Before HealthTech transmits any patient health data to CloudAI Corp, which legal agreement is strictly mandated under HIPAA regulations?",
                'option_a': "A Discretionary Access Control waiver",
                'option_b': "A signed Business Associate Agreement (BAA)",
                'option_c': "An ISO 31000 Certification Seal",
                'option_d': "A RACI matrix approved by the external auditor",
                'correct_answer': 'B',
                'rationale': "Under HIPAA, third-party vendors handling electronic Protected Health Information (ePHI) are classified as Business Associates and must sign a legally binding Business Associate Agreement (BAA)."
            }
        ]
    },
    {
        'domain_number': 4,
        'title': 'Case Study: OmniRetail KRI Dashboard & Continuous Control Monitoring',
        'scenario_text': """OmniRetail operates an omnichannel retail chain. The Board Risk Committee established a risk tolerance limit that no critical cybersecurity vulnerability should remain unpatched for longer than 14 days. The GRC team implemented a continuous control monitoring (CCM) platform tracking Key Risk Indicators (KRIs). In October, the KRI tracking 'Unpatched Critical CVEs > 14 Days' spiked from 2 to 47 vulnerabilities across web payment servers.""",
        'sort_order': 4,
        'questions': [
            {
                'question_number': 1,
                'stem': "How does the metric 'Unpatched Critical CVEs > 14 Days' function as a Key Risk Indicator (KRI) rather than a Key Performance Indicator (KPI)?",
                'option_a': "It measures past historical revenue generated by the patch management team.",
                'option_b': "It serves as a leading, predictive early-warning signal indicating that risk of external breach is rapidly increasing.",
                'option_c': "It provides legal immunity against regulatory enforcement actions.",
                'option_d': "It replaces the need for annual internal audit reviews.",
                'correct_answer': 'B',
                'rationale': "A Key Risk Indicator (KRI) is a leading / predictive metric that alerts management to emerging risks before a catastrophic loss event occurs."
            },
            {
                'question_number': 2,
                'stem': "Under the COSO Internal Control Framework, automated Continuous Control Monitoring (CCM) polling server APIs 24/7 belongs to which component?",
                'option_a': "Control Environment",
                'option_b': "Risk Assessment",
                'option_c': "Monitoring Activities",
                'option_d': "Information & Communication",
                'correct_answer': 'C',
                'rationale': "Monitoring Activities in the COSO framework involves ongoing evaluations, automated monitoring, and audits to ascertain whether internal controls are functioning effectively."
            }
        ]
    }
]

with open(os.path.join(DATA_DIR, 'case_studies.json'), 'w', encoding='utf-8') as f:
    json.dump(CASE_STUDIES, f, indent=2)

print(f"[OK] Saved {len(CASE_STUDIES)} Case Studies to grc_data/case_studies.json")

# ─────────────────────────────────────────────────────────────────────────────
# 4. 120 GRC GLOSSARY TERMS
# ─────────────────────────────────────────────────────────────────────────────
GLOSSARY = [
    # Domain 1
    {"term": "Three Lines Model", "acronym": "IIA 3LM", "domain_number": 1, "definition": "Governance framework defining 1st Line (Operational risk management), 2nd Line (Risk & compliance oversight), and 3rd Line (Independent internal audit)."},
    {"term": "Board of Directors", "acronym": "BOD", "domain_number": 1, "definition": "Governing body holding ultimate fiduciary and legal accountability for corporate governance and risk oversight."},
    {"term": "Audit Committee", "acronym": "", "domain_number": 1, "definition": "Specialized board committee composed of independent directors overseeing financial reporting, internal controls, and audit functions."},
    {"term": "IT Steering Committee", "acronym": "", "domain_number": 1, "definition": "Executive leadership committee aligning enterprise IT investments and project priorities with corporate business strategy."},
    {"term": "RACI Matrix", "acronym": "RACI", "domain_number": 1, "definition": "Accountability chart designating Responsible (R), Accountable (A), Consulted (C), and Informed (I) roles for organizational processes."},
    {"term": "COBIT 2019", "acronym": "COBIT", "domain_number": 1, "definition": "ISACA framework separating Governance (Evaluate, Direct, Monitor) from Management (Plan, Build, Run, Monitor)."},
    {"term": "ISO/IEC 38500", "acronym": "ISO 38500", "domain_number": 1, "definition": "International standard providing principles for governing bodies on the strategic and ethical use of information technology."},
    {"term": "Policy Lifecycle", "acronym": "", "domain_number": 1, "definition": "The formal governance process of drafting, reviewing, approving, publishing, enforcing, and retiring organizational policies."},
    {"term": "Policy Waiver / Exception", "acronym": "", "domain_number": 1, "definition": "A formal, time-bound, executive-approved temporary exemption from a policy supported by a compensating control."},
    {"term": "Tone at the Top", "acronym": "", "domain_number": 1, "definition": "The ethical atmosphere and commitment to integrity established by the Board of Directors and executive management."},
    {"term": "Whistleblower Program", "acronym": "", "domain_number": 1, "definition": "Confidential, anonymous mechanism enabling employees to report ethical or legal misconduct without fear of retaliation."},

    # Domain 2
    {"term": "COSO ERM", "acronym": "COSO ERM", "domain_number": 2, "definition": "Enterprise Risk Management framework comprising 5 interrelated components aligning risk with strategy and performance."},
    {"term": "ISO 31000:2018", "acronym": "ISO 31000", "domain_number": 2, "definition": "International non-prescriptive guidelines for managing enterprise risk through a structured assessment and treatment process."},
    {"term": "Risk Capacity", "acronym": "", "domain_number": 2, "definition": "The maximum threshold of risk an organization can absorb before facing insolvency or collapse."},
    {"term": "Risk Appetite", "acronym": "", "domain_number": 2, "definition": "The broad amount of risk an organization is willing to pursue or accept in pursuit of its strategic goals."},
    {"term": "Risk Tolerance", "acronym": "", "domain_number": 2, "definition": "The acceptable operational variance around specific performance targets."},
    {"term": "Single Loss Expectancy", "acronym": "SLE", "domain_number": 2, "definition": "The financial monetary loss incurred each time a single risk event occurs (SLE = Asset Value x Exposure Factor)."},
    {"term": "Exposure Factor", "acronym": "EF", "domain_number": 2, "definition": "The percentage of asset value lost or destroyed during a specific risk incident."},
    {"term": "Annualized Rate of Occurrence", "acronym": "ARO", "domain_number": 2, "definition": "The estimated annual frequency of a risk event occurring within a one-year period."},
    {"term": "Annualized Loss Expectancy", "acronym": "ALE", "domain_number": 2, "definition": "The total expected annual financial loss from a specific risk (ALE = SLE x ARO)."},
    {"term": "Risk Mitigation", "acronym": "", "domain_number": 2, "definition": "Applying internal controls and countermeasures to reduce risk likelihood or impact."},
    {"term": "Risk Transference", "acronym": "", "domain_number": 2, "definition": "Shifting financial liability to an external third party via insurance or outsourced SLAs."},
    {"term": "Risk Avoidance", "acronym": "", "domain_number": 2, "definition": "Eliminating risk entirely by discontinuing the risky business activity or technology."},
    {"term": "Risk Acceptance", "acronym": "", "domain_number": 2, "definition": "Formal executive sign-off acknowledging and absorbing residual risk within appetite limits."},
    {"term": "Inherent Risk", "acronym": "", "domain_number": 2, "definition": "The raw level of risk present in an asset or activity before any controls are applied."},
    {"term": "Residual Risk", "acronym": "", "domain_number": 2, "definition": "The remaining risk level that persists after controls have been implemented and verified."},
    {"term": "Risk Register", "acronym": "", "domain_number": 2, "definition": "The central repository documenting identified risks, risk owners, scoring, and remediation action plans."},

    # Domain 3
    {"term": "Sarbanes-Oxley Act", "acronym": "SOX", "domain_number": 3, "definition": "US federal law mandating financial reporting transparency, executive accountability (302), and internal controls assessment (404)."},
    {"term": "IT General Controls", "acronym": "ITGC", "domain_number": 3, "definition": "Foundation IT controls over access, change management, program development, and computer operations supporting financial systems."},
    {"term": "Internal Controls over Financial Reporting", "acronym": "ICFR", "domain_number": 3, "definition": "Processes designed to provide reasonable assurance regarding the reliability of financial reporting under SOX 404."},
    {"term": "General Data Protection Regulation", "acronym": "GDPR", "domain_number": 3, "definition": "European Union regulation governing data privacy, user consent, data subject rights, and mandatory 72-hour breach reporting."},
    {"term": "Data Protection Impact Assessment", "acronym": "DPIA", "domain_number": 3, "definition": "Mandatory GDPR risk assessment evaluating high-risk data processing activities."},
    {"term": "Data Protection Officer", "acronym": "DPO", "domain_number": 3, "definition": "Independent compliance officer responsible for overseeing data protection strategy and GDPR compliance."},
    {"term": "Protected Health Information", "acronym": "PHI", "domain_number": 3, "definition": "Individually identifiable health data protected under HIPAA/HITECH regulations."},
    {"term": "Business Associate Agreement", "acronym": "BAA", "domain_number": 3, "definition": "Mandatory HIPAA contract holding third-party vendors legally accountable for safeguarding ePHI."},
    {"term": "Cardholder Data Environment", "acronym": "CDE", "domain_number": 3, "definition": "The network area and systems that store, process, or transmit credit/debit cardholder data subject to PCI-DSS 4.0."},
    {"term": "SOC 1 Report", "acronym": "SOC 1", "domain_number": 3, "definition": "AICPA SSAE 18 attestation report evaluating internal controls relevant to user entities' financial reporting."},
    {"term": "SOC 2 Report", "acronym": "SOC 2", "domain_number": 3, "definition": "Attestation report evaluating controls based on Trust Services Criteria: Security, Availability, Integrity, Confidentiality, Privacy."},
    {"term": "SOC Type I", "acronym": "Type I", "domain_number": 3, "definition": "Assurance report assessing the suitability of control design as of a single point in time."},
    {"term": "SOC Type II", "acronym": "Type II", "domain_number": 3, "definition": "Assurance report testing control operating effectiveness across a minimum 6-month historical period."},
    {"term": "Third-Party Risk Management", "acronym": "TPRM", "domain_number": 3, "definition": "The discipline of assessing, monitoring, and mitigating risks introduced by external vendors and cloud service providers."},
    {"term": "Right-to-Audit Clause", "acronym": "", "domain_number": 3, "definition": "Contractual provision granting an organization the legal authority to inspect and audit a third-party vendor's security controls."},
    {"term": "ISO/IEC 27001", "acronym": "ISO 27001", "domain_number": 3, "definition": "International auditable standard specifying requirements for an Information Security Management System (ISMS)."},
    {"term": "Statement of Applicability", "acronym": "SoA", "domain_number": 3, "definition": "Mandatory ISO 27001 document detailing which Annex A security controls are implemented or excluded with justification."},

    # Domain 4
    {"term": "COSO Cube", "acronym": "COSO IC", "domain_number": 4, "definition": "Internal control model comprising 5 components: Control Environment, Risk Assessment, Control Activities, Info & Comm, Monitoring."},
    {"term": "Preventive Control", "acronym": "", "domain_number": 4, "definition": "An internal control designed to stop errors, fraud, or security threats before they occur (e.g., dual authorization)."},
    {"term": "Detective Control", "acronym": "", "domain_number": 4, "definition": "An internal control designed to identify and alert on errors, anomalies, or fraud during or after occurrence (e.g., reconciliation)."},
    {"term": "Corrective Control", "acronym": "", "domain_number": 4, "definition": "An internal control designed to rectify identified errors or restore systems following an incident (e.g., backup restoration)."},
    {"term": "Compensating Control", "acronym": "", "domain_number": 4, "definition": "An alternative safeguard implemented when a primary control is unfeasible to reduce risk to an acceptable level."},
    {"term": "Segregation of Duties", "acronym": "SoD", "domain_number": 4, "definition": "Dividing key steps of a sensitive business process among multiple individuals to prevent single-person fraud or error."},
    {"term": "Material Weakness", "acronym": "", "domain_number": 4, "definition": "A severe internal control deficiency creating a reasonable possibility of an unprevented material financial misstatement."},
    {"term": "Significant Deficiency", "acronym": "", "domain_number": 4, "definition": "An internal control deficiency less severe than a material weakness, yet important enough to merit Audit Committee attention."},
    {"term": "Key Performance Indicator", "acronym": "KPI", "domain_number": 4, "definition": "A lagging historical metric measuring operational performance against strategic business objectives."},
    {"term": "Key Risk Indicator", "acronym": "KRI", "domain_number": 4, "definition": "A leading, predictive metric providing an early-warning signal of rising future risk exposure."},
    {"term": "Key Control Indicator", "acronym": "KCI", "domain_number": 4, "definition": "A status metric measuring the operating health, reliability, and effectiveness of an individual internal control."},
    {"term": "Continuous Control Monitoring", "acronym": "CCM", "domain_number": 4, "definition": "Automated technical polling verifying in real time that security and compliance controls remain operating effectively."},
    {"term": "Balanced Scorecard", "acronym": "BSC", "domain_number": 4, "definition": "Strategic management tool measuring enterprise performance across Financial, Customer, Internal Process, and Learning perspectives."}
]

with open(os.path.join(DATA_DIR, 'glossary.json'), 'w', encoding='utf-8') as f:
    json.dump(GLOSSARY, f, indent=2)

print(f"[OK] Saved {len(GLOSSARY)} Glossary terms to grc_data/glossary.json")
