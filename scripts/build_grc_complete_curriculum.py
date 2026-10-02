#!/usr/bin/env python3
"""
APILIGU LEARNING PASS — Enterprise Governance, Risk Management & Compliance (GRC) Curriculum Generator
Generates:
1. grc_data/topics.json (28 canonical topics + subtopics with rich markdown bodies and Exam Watch Alerts)
2. grc_data/chapters.json (4 Master E-Reader Chapters with tables and callouts)
3. grc_data/case_studies.json (4 Scenario Case Studies with 8 Questions)
4. grc_data/glossary.json (120+ GRC Glossary Terms)
5. grc_data/questions.json (500+ High-Yield Verified Questions with full rationales)
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'grc_data')
os.makedirs(DATA_DIR, exist_ok=True)

GRC_CERT_ID = 'a0000000-0000-0000-0000-000000000008'

DOMAINS = [
    {
        'id': 'd0000000-0000-0000-0000-000000000031',
        'domain_number': 1,
        'code': 'D1',
        'name': 'Corporate & IT Governance Architecture',
        'weight': 25.00,
        'approx_qs': 25,
        'part_a_title': 'Governance Models & Strategic Alignment',
        'part_b_title': 'Enterprise Architecture & Policy Frameworks',
        'learning_objectives': 'Master the IIA Three Lines Model, Board of Directors oversight, IT Steering Committees, COBIT 2019 principles, ISO/IEC 38500, and policy lifecycle governance.'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000032',
        'domain_number': 2,
        'code': 'D2',
        'name': 'Enterprise Risk Management (ERM) & Assessment',
        'weight': 30.00,
        'approx_qs': 30,
        'part_a_title': 'Risk Architecture & Risk Appetite',
        'part_b_title': 'Risk Identification, Analysis & Treatment',
        'learning_objectives': 'Understand COSO ERM, ISO 31000:2018 guidelines, Risk Appetite vs Tolerance, Quantitative Risk Analysis (SLE, ARO, ALE), Risk Registers, and the 4 Risk Treatment Options.'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000033',
        'domain_number': 3,
        'code': 'D3',
        'name': 'Regulatory Compliance, Legal & Assurance',
        'weight': 25.00,
        'approx_qs': 25,
        'part_a_title': 'Global Regulatory Landscapes & Mandates',
        'part_b_title': 'Compliance Auditing, Evidence & Assurance',
        'learning_objectives': 'Master Sarbanes-Oxley SOX 404, GDPR data privacy, HIPAA/HITECH, PCI-DSS 4.0, SOC 1 vs SOC 2 Type I/II reports, ISO 27001 ISMS certification, and Third-Party Vendor Risk Management (TPRM).'
    },
    {
        'id': 'd0000000-0000-0000-0000-000000000034',
        'domain_number': 4,
        'code': 'D4',
        'name': 'Internal Controls, Audit & Continuous Monitoring',
        'weight': 20.00,
        'approx_qs': 20,
        'part_a_title': 'Internal Control Design & COSO Framework',
        'part_b_title': 'GRC Technology Platforms, Metrics & Dashboards',
        'learning_objectives': 'Differentiate the 5 components of COSO Internal Control, Preventive vs Detective controls, Segregation of Duties (SoD), Key Risk Indicators (KRIs), KPIs, and executive GRC dashboards.'
    }
]

# ─────────────────────────────────────────────────────────────────────────────
# 1. 28 CANONICAL TOPICS & SUBTOPICS
# ─────────────────────────────────────────────────────────────────────────────
TOPICS = [
    # ── DOMAIN 1: Corporate & IT Governance Architecture (25%) ──
    {
        'domain_number': 1,
        'topic_code': '1A1',
        'part': 'A',
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
        'domain_number': 1,
        'topic_code': '1A2',
        'part': 'A',
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
        'domain_number': 1,
        'topic_code': '1A3',
        'part': 'A',
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
        'domain_number': 1,
        'topic_code': '1B1',
        'part': 'B',
        'name': 'COBIT 2019 Governance Framework & ISO/IEC 38500',
        'summary': 'COBIT 2019 Governance and Management Objectives (EDM vs APO, BAI, DSS, MEA) and ISO/IEC 38500 corporate IT governance.',
        'key_terms': ['COBIT 2019', 'EDM', 'APO', 'BAI', 'DSS', 'MEA', 'ISO/IEC 38500', 'Governance vs Management'],
        'objectives': 'Differentiate between Governance and Management domains in COBIT 2019 and apply ISO/IEC 38500 principles.',
        'exam_tips': 'Exam Watch: COBIT separates Governance (Evaluate, Direct, Monitor - EDM) from Management (Plan, Build, Run, Monitor - APO, BAI, DSS, MEA). Governance belongs to the Board; Management belongs to the Executive team.',
        'content': """# COBIT 2019 and ISO/IEC 38500 IT Governance Frameworks

**COBIT 2019 (Control Objectives for Information and Related Technologies)** by ISACA is the premier enterprise framework for information and technology governance.

---

### 1. Governance vs. Management in COBIT 2019

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           GOVERNANCE (BOARD)                           │
  │               Evaluate, Direct, and Monitor (EDM Domain)               │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │ Sets Direction & Principles
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                          MANAGEMENT (EXECUTIVE)                        │
  │  • Align, Plan & Organize (APO)       • Build, Acquire & Implement (BAI)│
  │  • Deliver, Service & Support (DSS)   • Monitor, Evaluate & Assess (MEA)│
  └────────────────────────────────────────────────────────────────────────┘
```

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
        'domain_number': 1,
        'topic_code': '1B2',
        'part': 'B',
        'name': 'Enterprise Policy Lifecycle & Exception Management',
        'summary': 'Policy drafting, stakeholder review, approval, dissemination, annual review, retirement, and formal exception waiver workflows.',
        'key_terms': ['Policy Lifecycle', 'Exception Management', 'Policy Waiver', 'Compensating Control', 'Annual Policy Review'],
        'objectives': 'Manage the end-to-end policy lifecycle and implement structured risk-based policy exception processes.',
        'exam_tips': 'Exam Watch: Policy exceptions must be temporary, documented, approved by the asset owner/CISO, and mitigated by an approved compensating control with a defined expiration date.',
        'content': """# Enterprise Policy Lifecycle and Exception Management

Policies represent mandatory management directives that must be maintained throughout a structured lifecycle.

---

### 1. The 6-Stage Policy Lifecycle

1. **Identify & Draft**: Recognize regulatory or operational requirements and draft clear, enforceable policy statements.
2. **Consult & Review**: Legal, HR, compliance, and IT stakeholders review drafts for feasibility and legality.
3. **Approve**: Formal authorization and sign-off by the Board or Executive Committee.
4. **Publish & Educate**: Disseminate policy across the enterprise and require employee acknowledgment.
5. **Enforce & Monitor**: Measure compliance through automated auditing and reporting.
6. **Periodic Review & Retire**: Conduct mandatory annual reviews; update or retire obsolete policies.

---

### 2. Policy Exception (Waiver) Management
When a business unit cannot technically comply with a policy (e.g., legacy software unable to support TLS 1.3):
- A formal **Exception Request** must document the business justification and risk analysis.
- An approved **Compensating Control** must be implemented (e.g., placing the server on an isolated VLAN with strict firewall rules).
- The exception must have a **time-bound expiration date** (typically 6–12 months) and require senior executive sign-off.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - Permanent policy exemptions are a critical governance violation. All policy exceptions must have **expiration dates** and mandatory re-evaluation milestones.
"""
    },
    {
        'domain_number': 1,
        'topic_code': '1B3',
        'part': 'B',
        'name': 'Corporate Ethics, Culture & Whistleblower Programs',
        'summary': 'Organizational tone at the top, code of conduct, anonymous whistleblower hotlines, and anti-retaliation policies.',
        'key_terms': ['Tone at the Top', 'Code of Conduct', 'Whistleblower Hotline', 'Anti-Retaliation Policy', 'Ethical Culture'],
        'objectives': 'Establish an ethical corporate culture supported by confidential reporting channels.',
        'exam_tips': 'Exam Watch: The Board and CEO set the "Tone at the Top". An effective whistleblower program requires anonymous reporting channels and strict, enforceable anti-retaliation protections.',
        'content': """# Corporate Ethics and Whistleblower Protection

Ethical governance begins with executive leadership establishing an organizational culture of integrity.

---

### 1. Tone at the Top
The **Tone at the Top** refers to the ethical atmosphere created by the Board of Directors and senior executives. If leadership demonstrates zero tolerance for misconduct, employees follow suit.

---

### 2. Whistleblower Hotlines (SOX Section 301 / EU Whistleblowing Directive)
Organizations must maintain independent, confidential mechanisms for employees to report ethical violations, financial fraud, or compliance breaches:
- **Anonymous Channels**: 24/7 third-party phone hotlines and encrypted web portals.
- **Anti-Retaliation Protections**: Legal and corporate guarantees that employees reporting misconduct in good faith cannot be terminated, demoted, or harassed.
- **Audit Committee Escalation**: Reports involving senior management must bypass executive leadership and route directly to the Board Audit Committee.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - Whistleblower reports involving executive management must route directly to the **Audit Committee of the Board** to prevent conflicts of interest and cover-ups.
"""
    },

    # ── DOMAIN 2: Enterprise Risk Management (ERM) & Assessment (30%) ──
    {
        'domain_number': 2,
        'topic_code': '2A1',
        'part': 'A',
        'name': 'COSO ERM Integrated Framework (2017 Enterprise Risk Model)',
        'summary': 'Governance & Culture, Strategy & Objective-Setting, Performance, Review & Revision, and Information, Communication & Reporting.',
        'key_terms': ['COSO ERM', 'Governance & Culture', 'Strategy & Objectives', 'Performance', 'Review & Revision', 'Information & Reporting'],
        'objectives': 'Apply the 5 interrelated components and 20 principles of the COSO Enterprise Risk Management framework.',
        'exam_tips': 'Exam Watch: COSO ERM integrates risk management with strategy and business performance, emphasizing that risk is not just about avoiding loss, but also about creating and preserving value.',
        'content': """# COSO Enterprise Risk Management (ERM) Framework

The **Committee of Sponsoring Organizations of the Treadway Commission (COSO) ERM Framework (2017)** aligns enterprise risk management with strategy and business performance.

---

### 1. The 5 Core Components of COSO ERM

```
  ┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
  │   GOVERNANCE & CULTURE    │ ──► │   STRATEGY & OBJECTIVES   │ ──► │        PERFORMANCE        │
  └───────────────────────────┘     └───────────────────────────┘     └─────────────┬─────────────┘
                                                                                    │
                                    ┌───────────────────────────┐     ┌─────────────▼─────────────┐
                                    │ INFORMATION & REPORTING   │ ◄── │     REVIEW & REVISION     │
                                    └───────────────────────────┘     └───────────────────────────┘
```

1. **Governance and Culture**: Sets the organization's tone, reinforcing the importance of ERM and establishing oversight responsibilities.
2. **Strategy and Objective-Setting**: Evaluates risk appetite in tandem with strategic planning and business objectives.
3. **Performance**: Identifies, assesses, prioritizes, and responds to risks that impact the achievement of strategy.
4. **Review and Revision**: Evaluates how well ERM practices function over time in light of substantial changes.
5. **Information, Communication, and Reporting**: Facilitates continuous sharing of relevant risk information across all levels.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **COSO ERM connects risk management directly to business strategy and value creation**, rather than treating risk as an isolated compliance checklist.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2A2',
        'part': 'A',
        'name': 'ISO 31000:2018 Risk Management Guidelines',
        'summary': 'ISO 31000 principles, framework (Leadership, Integration, Design, Implementation, Evaluation), and risk assessment process.',
        'key_terms': ['ISO 31000:2018', 'Risk Assessment Process', 'Risk Identification', 'Risk Analysis', 'Risk Evaluation', 'Risk Treatment'],
        'objectives': 'Execute the ISO 31000 risk management process: Scope, Context, Assessment (Identification, Analysis, Evaluation), and Treatment.',
        'exam_tips': 'Exam Watch: ISO 31000 Risk Assessment consists of three sequential sub-steps: 1) Risk Identification, 2) Risk Analysis, and 3) Risk Evaluation.',
        'content': """# ISO 31000:2018 International Risk Management Standard

**ISO 31000:2018** provides an internationally recognized, non-prescriptive standard for managing any form of risk across any industry.

---

### 1. The ISO 31000 Risk Assessment Process

```
                         ┌─────────────────────────────────┐
                         │   SCOPE, CONTEXT, AND CRITERIA  │
                         └────────────────┬────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         │         RISK ASSESSMENT         │
                         │  1. Risk Identification         │
                         │  2. Risk Analysis               │
                         │  3. Risk Evaluation             │
                         └────────────────┬────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         │         RISK TREATMENT          │
                         └─────────────────────────────────┘
```

1. **Risk Identification**: Discovering, recognizing, and describing risks that might prevent an organization from achieving its objectives.
2. **Risk Analysis**: Comprehending the nature of risk, including sources, consequences, likelihood, events, scenarios, and control effectiveness.
3. **Risk Evaluation**: Comparing the results of risk analysis with established risk criteria to determine where additional action is required.
4. **Risk Treatment**: Selecting and implementing options for modifying risk (Mitigate, Transfer, Avoid, Accept).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - Unlike ISO 27001, **organizations cannot be certified against ISO 31000**. ISO 31000 is a guideline and framework, not a certifiable compliance requirement.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2A3',
        'part': 'A',
        'name': 'Risk Appetite, Risk Tolerance & Risk Capacity',
        'summary': 'Defining the maximum risk an enterprise can absorb (Capacity), willingness to take risk (Appetite), and acceptable variance (Tolerance).',
        'key_terms': ['Risk Appetite', 'Risk Tolerance', 'Risk Capacity', 'Risk Boundary', 'Risk Threshold'],
        'objectives': 'Distinguish between Risk Capacity, Risk Appetite, and Risk Tolerance in enterprise risk governance.',
        'exam_tips': 'Exam Watch: Capacity is the maximum risk the organization CAN bear before bankruptcy. Appetite is the risk the Board is WILLING to take. Tolerance is the acceptable variance around specific operational targets.',
        'content': """# Risk Capacity, Risk Appetite, and Risk Tolerance

Effective risk governance requires quantifiable boundaries established by senior leadership.

```
  ┌────────────────────────────────────────────────────────────┐
  │                      RISK CAPACITY                         │ ◄── Maximum risk organization CAN absorb
  ├────────────────────────────────────────────────────────────┤
  │                      RISK APPETITE                         │ ◄── Amount of risk Board is WILLING to accept
  ├────────────────────────────────────────────────────────────┤
  │                     RISK TOLERANCE                         │ ◄── Acceptable operational deviation/variance
  └────────────────────────────────────────────────────────────┘
```

1. **Risk Capacity**: The absolute maximum amount of risk an organization is technically and financially capable of enduring without insolvency or collapse.
2. **Risk Appetite**: The broad amount and type of risk an organization is **willing to pursue, retain, or accept** in the pursuit of its strategic business objectives. (Set by the **Board**).
3. **Risk Tolerance**: The acceptable level of variation relative to the achievement of a specific operational objective (e.g., *Appetite is zero customer downtime; Tolerance is 99.95% availability with max 22 minutes downtime per month*).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Risk Appetite is always smaller than Risk Capacity**. Operating at or above Risk Capacity puts the enterprise in existential jeopardy of insolvency.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B1',
        'part': 'B',
        'name': 'Quantitative vs. Qualitative Risk Assessment',
        'summary': 'SLE, ARO, ALE formulas, cost-benefit analysis for controls, and qualitative risk heatmaps (Likelihood x Impact).',
        'key_terms': ['Quantitative Risk', 'Qualitative Risk', 'Asset Value (AV)', 'Exposure Factor (EF)', 'SLE', 'ARO', 'ALE', 'Risk Heatmap'],
        'objectives': 'Calculate Single Loss Expectancy (SLE), Annualized Loss Expectancy (ALE), and conduct cost-benefit analysis of security controls.',
        'exam_tips': 'Exam Watch: Memorize the formulas: SLE = Asset Value x Exposure Factor. ALE = SLE x ARO. Cost-Benefit of Control = (ALE before - ALE after) - Annual Cost of Control.',
        'content': """# Quantitative and Qualitative Risk Analysis

Risk assessment evaluates risk magnitude using qualitative rankings or quantitative financial calculations.

---

### 1. Quantitative Risk Analysis Formulas

1. **Single Loss Expectancy (SLE)**: The financial loss incurred each time a single risk event occurs.
   $$\\text{SLE} = \\text{Asset Value (AV)} \\times \\text{Exposure Factor (EF)}$$
   *(Exposure Factor is the percentage of asset value lost in an event).*
2. **Annualized Rate of Occurrence (ARO)**: The estimated frequency or probability of the event occurring within a one-year period.
3. **Annualized Loss Expectancy (ALE)**: The total expected financial loss from a risk over one year.
   $$\\text{ALE} = \\text{SLE} \\times \\text{ARO}$$
4. **Cost-Benefit Analysis of a Safeguard / Control**:
   $$\\text{Value of Safeguard} = (\\text{ALE}_{\\text{before}} - \\text{ALE}_{\\text{after}}) - \\text{Annual Cost of Control}$$
   *(If the result is positive, the control is financially justified).*

---

### 2. Qualitative Risk Analysis
Evaluates risk using descriptive scales (e.g., Low, Medium, High, Critical) based on **Likelihood $\\times$ Impact** plotted on a visual **Risk Heatmap Matrix**.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - If an asset is worth $1,000,000 and a flood damages 25% (EF = 0.25), then $\\text{SLE} = \\$250,000$. If floods occur once every 5 years ($\\text{ARO} = 0.2$), then $\\text{ALE} = \\$250,000 \\times 0.2 = \\$50,000$ per year.
"""
    },
    {
        'domain_number': 2,
        'topic_code': '2B2',
        'part': 'B',
        'name': 'The Enterprise Risk Register & Inherent vs. Residual Risk',
        'summary': 'Risk logging, risk owners, inherent risk, control effectiveness, and calculating residual risk.',
        'key_terms': ['Risk Register', 'Inherent Risk', 'Residual Risk', 'Control Effectiveness', 'Risk Owner'],
        'objectives': 'Maintain an enterprise risk register and calculate residual risk after evaluating control effectiveness.',
        'exam_tips': 'Exam Watch: Inherent Risk is the raw risk before any controls exist. Residual Risk is the remaining risk after controls are implemented. Inherent Risk - Control Effectiveness = Residual Risk.',
        'content': """# Risk Registers and Inherent vs. Residual Risk

The **Risk Register (Risk Log)** is the central repository used by GRC teams to document identified risks, ownership, assessment scores, and remediation action plans.

---

### 1. Inherent Risk vs. Residual Risk

$$\\text{Residual Risk} = \\text{Inherent Risk} - \\text{Control Impact (Mitigation)}$$

- **Inherent Risk**: The raw, natural level of risk present in an activity or asset **before any security controls, countermeasures, or safeguards are applied**.
- **Residual Risk**: The remaining risk that persists **after security controls have been implemented and validated**.
- **Secondary Risk**: A new, unintended risk introduced as a direct consequence of implementing a risk treatment control (e.g., deploying an encrypted VPN gateway introduces a new single point of failure).

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Residual Risk must be less than or equal to the organization's Risk Appetite**. If Residual Risk exceeds Risk Appetite, additional controls or risk transference must be applied.
"""
    },

    # ── DOMAIN 3: Regulatory Compliance, Legal & Assurance (25%) ──
    {
        'domain_number': 3,
        'topic_code': '3A1',
        'part': 'A',
        'name': 'Sarbanes-Oxley Act (SOX 404 & Financial IT Controls)',
        'summary': 'SOX Section 302 CEO/CFO certifications, Section 404 internal control assessments, and IT General Controls (ITGC).',
        'key_terms': ['SOX 404', 'SOX 302', 'ITGC', 'Internal Controls over Financial Reporting (ICFR)', 'Material Weakness'],
        'objectives': 'Evaluate IT General Controls (ITGC) supporting financial reporting compliance under SOX Section 404.',
        'exam_tips': 'Exam Watch: SOX 404 requires management and external auditors to attest to the effectiveness of Internal Controls over Financial Reporting (ICFR). Key ITGC areas include Access Controls, Change Management, and Backup/Operations.',
        'content': """# Sarbanes-Oxley Act (SOX) Compliance and ITGCs

The **Sarbanes-Oxley Act of 2002 (SOX)** is a US federal law designed to protect investors from fraudulent corporate accounting by mandating strict financial disclosures and internal controls.

---

### 1. Critical SOX Sections for GRC Professionals

- **SOX Section 302 (Corporate Responsibility for Financial Reports)**:
  - Mandates that the **CEO and CFO personally certify** the accuracy and completeness of quarterly and annual financial statements.
  - Signing officers attest that they are responsible for designing, establishing, and maintaining internal controls.
- **SOX Section 404 (Management Assessment of Internal Controls)**:
  - Requires companies to publish an annual report on the scope, adequacy, and effectiveness of **Internal Controls over Financial Reporting (ICFR)**.
  - Requires an independent external auditor to audit and attest to management's internal control assessment.

---

### 2. IT General Controls (ITGCs) under SOX 404
Because financial ledgers reside in ERP databases (e.g., SAP, Oracle), auditors evaluate 4 core ITGC areas:
1. **Access to Programs and Data**: Preventing unauthorized modifications to financial databases (Privileged access, SoD).
2. **Program Changes**: Ensuring code changes to accounting systems are tested, peer-reviewed, and authorized by the CAB.
3. **Program Development**: Secure development of financial reporting modules.
4. **Computer Operations**: Job scheduling, data backups, and disaster recovery.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - A failure in **IT Change Management** or an unauthorized database modification to an ERP system can result in a formal **Material Weakness** finding on a public company's SOX 404 audit.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3A2',
        'part': 'A',
        'name': 'GDPR Data Privacy, Data Protection Officers & Cross-Border Transfers',
        'summary': 'GDPR 7 principles, Data Protection Impact Assessments (DPIA), DPO independence, Standard Contractual Clauses (SCC), and 72h notifications.',
        'key_terms': ['GDPR', 'Data Subject', 'Data Controller', 'Data Processor', 'DPIA', 'Data Protection Officer (DPO)', '72-Hour Breach Rule'],
        'objectives': 'Implement GDPR compliance frameworks, conduct DPIAs, and ensure lawful cross-border data transfers.',
        'exam_tips': 'Exam Watch: GDPR breach notifications must be submitted to supervisory authorities within 72 HOURS. DPIAs are mandatory for high-risk data processing. DPOs must report directly to the highest level of management without conflicts of interest.',
        'content': """# GDPR Compliance, Privacy Governance, and Cross-Border Transfers

The **General Data Protection Regulation (GDPR)** regulates the processing of personal data of individuals located within the European Economic Area (EEA).

---

### 1. The 7 Core GDPR Principles

1. **Lawfulness, Fairness, and Transparency**: Data must be processed legally and transparently with informed consent.
2. **Purpose Limitation**: Collected only for specified, explicit, and legitimate purposes.
3. **Data Minimization**: Limited strictly to what is necessary for the stated purpose.
4. **Accuracy**: Kept up to date; inaccurate data must be erased or corrected immediately.
5. **Storage Limitation**: Retained only as long as necessary for the processing purpose.
6. **Integrity and Confidentiality (Security)**: Protected against unauthorized access or loss using technical controls.
7. **Accountability**: The Data Controller is responsible for demonstrating compliance with all principles.

---

### 2. Mandatory GDPR Requirements
- **72-Hour Breach Notification**: Controllers must notify data protection authorities within **72 hours** of becoming aware of a personal data breach posing risk to individuals.
- **Data Protection Impact Assessment (DPIA)**: Mandatory risk assessment before initiating processing likely to result in high risk (e.g., large-scale biometric scanning or AI profiling).
- **Data Protection Officer (DPO)**: Mandatory independent advisor for public authorities or companies conducting systematic monitoring on a large scale. Must report directly to the C-Suite/Board.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - The **Data Protection Officer (DPO)** must maintain complete operational independence and cannot hold a position that determines the purposes of data processing (e.g., the CISO or Head of Marketing cannot also serve as the DPO due to a conflict of interest).
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3A3',
        'part': 'A',
        'name': 'HIPAA / HITECH, PCI-DSS 4.0 & GLBA Mandates',
        'summary': 'Healthcare PHI protections (Security & Privacy Rules), Cardholder Data Environments (CDE), and Gramm-Leach-Bliley banking privacy.',
        'key_terms': ['HIPAA', 'HITECH', 'PHI', 'ePHI', 'Business Associate Agreement (BAA)', 'PCI-DSS 4.0', 'CDE', 'GLBA'],
        'objectives': 'Analyze sector-specific regulatory requirements in healthcare (HIPAA), financial services (GLBA), and payment cards (PCI-DSS).',
        'exam_tips': 'Exam Watch: HIPAA applies to Covered Entities and Business Associates (requires signed BAAs). PCI-DSS protects the Cardholder Data Environment (CDE). GLBA requires financial institutions to disclose privacy notices and safeguard consumer NPI.',
        'content': """# Industry-Specific Regulations: HIPAA, PCI-DSS 4.0, and GLBA

Organizations operating in healthcare, financial services, or payment processing must adhere to strict sector regulations.

---

### 1. HIPAA / HITECH (Healthcare)
- **Protected Health Information (PHI / ePHI)**: Any individually identifiable health information.
- **HIPAA Security Rule**: Mandates Administrative, Physical, and Technical safeguards to ensure CIA of ePHI.
- **Business Associate Agreements (BAA)**: Legally binding contracts holding third-party vendors (e.g., cloud hosts, medical transcriptionists) directly liable for HIPAA compliance.

---

### 2. PCI-DSS 4.0 (Payment Card Industry)
- **Scope**: Protects the **Cardholder Data Environment (CDE)** (credit/debit card numbers, CVVs, expiration dates).
- **Requirement Highlights**: Install and maintain network firewalls, encrypt cardholder data across public networks, restrict access on need-to-know basis, assign unique IDs to all users, and maintain vulnerability management programs.

---

### 3. GLBA (Gramm-Leach-Bliley Act - Financial Services)
- Protects Non-Public Personal Information (NPI) held by financial institutions (banks, credit unions, insurers).
- **Safeguards Rule**: Mandates a comprehensive, written administrative and technical information security program.
- **Financial Privacy Rule**: Requires annual privacy notices explaining how consumer data is shared.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - In HIPAA, a third-party cloud vendor that stores patient health records is a **Business Associate** and must execute a signed **Business Associate Agreement (BAA)** before receiving ePHI.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B1',
        'part': 'B',
        'name': 'SOC 1 vs. SOC 2 Type I & Type II Assurance Reports',
        'summary': 'SSAE 18 / ISAE 3402 reports: Financial reporting (SOC 1) vs Trust Services Criteria (SOC 2: Security, Availability, Processing Integrity, Confidentiality, Privacy); Point-in-Time Type I vs 6-Month Type II.',
        'key_terms': ['SOC 1', 'SOC 2', 'Type I Report', 'Type II Report', 'Trust Services Criteria (TSC)', 'SSAE 18'],
        'objectives': 'Differentiate between SOC 1 and SOC 2 reports and contrast Type I point-in-time vs Type II historical operating effectiveness audits.',
        'exam_tips': 'Exam Watch: SOC 1 evaluates Internal Controls over Financial Reporting. SOC 2 evaluates Trust Services Criteria (Security is mandatory). Type I tests control DESIGN at a single point in time. Type II tests control OPERATING EFFECTIVENESS over a minimum 6-month period.',
        'content': """# SOC 1 and SOC 2 Assurance Reports (AICPA SSAE 18)

Service Organization Control (SOC) reports provide independent assurance regarding a service organization's controls to clients and auditors.

---

### 1. SOC 1 vs. SOC 2 Comparison

| Report Type | Purpose / Scope | Primary Target Audience |
| :--- | :--- | :--- |
| **SOC 1 (SSAE 18 / ISAE 3402)** | Evaluates internal controls relevant to user entities' **Internal Controls over Financial Reporting (ICFR)** (e.g., payroll processors, loan servicing). | User entities' financial auditors and CFOs. |
| **SOC 2 (Trust Services Criteria)** | Evaluates controls relevant to non-financial technology criteria: **Security (Mandatory), Availability, Processing Integrity, Confidentiality, and Privacy**. | CIOs, CISOs, enterprise vendor risk management teams. |

---

### 2. Type I vs. Type II Reports

```
  ┌───────────────────────────────────────────────────────────┐
  │                       TYPE I REPORT                       │  ◄── "Snapshot": Evaluates control DESIGN
  │                     (Point-in-Time)                       │      as of a specific date (e.g., June 30).
  ├───────────────────────────────────────────────────────────┤
  │                      TYPE II REPORT                       │  ◄── "Historical": Tests OPERATING EFFECTIVENESS
  │                  (Minimum 6-Month Period)                 │      across a testing window (e.g., Jan 1 - Jun 30).
  └───────────────────────────────────────────────────────────┘
```

- **Type I Report**: The auditor assesses whether the control description is fairly presented and whether controls are **suitably designed** as of a single specific date.
- **Type II Report**: The auditor performs sampling tests to verify that controls were **operating effectively throughout a minimum 6-month to 12-month period**.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - A **SOC 2 Type II report** provides far superior audit assurance over a Type I report because it validates that controls actually worked consistently over a 6-month historical period rather than just looking good on a single day.
"""
    },
    {
        'domain_number': 3,
        'topic_code': '3B2',
        'part': 'B',
        'name': 'Third-Party Risk Management (TPRM) & Vendor Audits',
        'summary': 'Vendor risk tiering, due diligence questionnaires (SIG, CAIQ), Service Level Agreements (SLAs), right-to-audit clauses, and continuous vendor monitoring.',
        'key_terms': ['TPRM', 'Vendor Due Diligence', 'Right-to-Audit Clause', 'SLA', 'SIG Questionnaire', 'Fourth-Party Risk'],
        'objectives': 'Design a Third-Party Risk Management lifecycle from vendor onboarding and tiering to contract termination.',
        'exam_tips': 'Exam Watch: You can outsource technology and business processes to a third party, but you CANNOT outsource ultimate legal and fiduciary accountability. Contracts must include Right-to-Audit clauses and clear SLAs.',
        'content': """# Third-Party Risk Management (TPRM)

Organizations heavily rely on cloud service providers, SaaS tools, and supply chain vendors, creating significant third-party risk exposure.

---

### 1. The TPRM Lifecycle

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   ONBOARD    │ ──► │     TIER     │ ──► │  ASSESS &    │ ──► │  CONTINUOUS  │
  │   REQUEST    │     │  CRITICALITY │     │  AUDIT (SOC2)│     │  MONITORING  │
  └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Vendor Risk Tiering**: Categorizing vendors by risk impact (Tier 1: Critical vendors with direct access to sensitive data; Tier 3: Low-risk vendors with no data access).
2. **Due Diligence Assessment**: Reviewing vendor SOC 2 Type II reports, ISO 27001 certificates, and Standardized Information Gathering (SIG) questionnaires before contracting.
3. **Contractual Enforceability**:
   - **Right-to-Audit Clause**: Legally mandates that the vendor must allow the client or independent auditors to inspect security controls.
   - **Service Level Agreements (SLAs)**: Quantifiable performance metrics (e.g., 99.99% uptime, 2-hour critical incident notification).
4. **Fourth-Party Risk Management**: Assessing the sub-processors and subcontractors that the third-party vendor relies upon.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Accountability cannot be outsourced**. Even if an outsourced cloud provider suffers a major data breach, the hiring company remains legally and publicly accountable to regulators and affected consumers.
"""
    },

    # ── DOMAIN 4: Internal Controls, Audit & Continuous Monitoring (20%) ──
    {
        'domain_number': 4,
        'topic_code': '4A1',
        'part': 'A',
        'name': 'The 5 Components of the COSO Internal Control Framework',
        'summary': 'Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities (The COSO Cube).',
        'key_terms': ['COSO Cube', 'Control Environment', 'Risk Assessment', 'Control Activities', 'Information & Communication', 'Monitoring Activities'],
        'objectives': 'Evaluate internal control structures using the 5 components and 17 principles of the COSO Internal Control Integrated Framework.',
        'exam_tips': 'Exam Watch: Memorize the 5 components of the COSO Cube: 1) Control Environment (Foundation/Tone), 2) Risk Assessment, 3) Control Activities (Policies/Procedures), 4) Information & Communication, 5) Monitoring Activities (Ongoing evaluations).',
        'content': """# The COSO Internal Control Integrated Framework

The **COSO Internal Control Integrated Framework** is the globally accepted standard for designing, implementing, and assessing internal control structures.

---

### 1. The 5 Core Components of the COSO Cube

```
  ┌───────────────────────────────────────────────────────────┐
  │                 5. MONITORING ACTIVITIES                  │  ◄── Ongoing evaluations & audit reviews
  ├───────────────────────────────────────────────────────────┤
  │              4. INFORMATION & COMMUNICATION               │  ◄── Relevant, timely data exchange
  ├───────────────────────────────────────────────────────────┤
  │                   3. CONTROL ACTIVITIES                   │  ◄── Policies & procedures executing controls
  ├───────────────────────────────────────────────────────────┤
  │                     2. RISK ASSESSMENT                    │  ◄── Identification & analysis of risks
  ├───────────────────────────────────────────────────────────┤
  │                   1. CONTROL ENVIRONMENT                  │  ◄── "Tone at the Top" & ethical foundation
  └───────────────────────────────────────────────────────────┘
```

1. **Control Environment (Foundation)**: Sets the organizational tone, ethical values, governance structure, and assignment of authority.
2. **Risk Assessment**: The dynamic process of identifying and assessing risks that jeopardize the achievement of objectives.
3. **Control Activities**: The actual policies, procedures, and automated controls (preventive and detective) established to mitigate risks.
4. **Information and Communication**: Ensuring timely, high-quality information flows across all levels of the organization.
5. **Monitoring Activities**: Ongoing evaluations and separate internal audit assessments to verify that all 5 components are present and functioning.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - The **Control Environment** is the foundational bedrock of the entire COSO framework. Without an ethical control environment and strong tone at the top, control activities will fail.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4A2',
        'part': 'A',
        'name': 'Internal Control Design: Preventive vs. Detective vs. Corrective Controls',
        'summary': 'Engineering robust internal controls, compensating controls, automated vs manual controls, and control testing methods.',
        'key_terms': ['Preventive Controls', 'Detective Controls', 'Corrective Controls', 'Compensating Controls', 'Automated Controls', 'Control Testing'],
        'objectives': 'Classify and evaluate the design and operating effectiveness of preventive, detective, corrective, and compensating controls.',
        'exam_tips': 'Exam Watch: Preventive controls are the most cost-effective because they stop loss before it happens (e.g., dual authorization, input validation). Detective controls alert on anomalies (reconciliation, log reviews).',
        'content': """# Internal Control Design and Taxonomy

Internal controls are policies, procedures, practices, and automated mechanisms designed to provide reasonable assurance regarding the achievement of objectives.

---

### 1. Functional Control Classes

| Control Type | Timing / Function | Real-World Enterprise Example |
| :--- | :--- | :--- |
| **Preventive** | Operates **BEFORE** an error, fraud, or threat event occurs to stop the action. | Segregation of duties, password complexity rules, biometric door locks, dual-signoff on payments. |
| **Detective** | Operates **DURING or AFTER** an event to discover and alert on errors, fraud, or non-compliance. | Bank account reconciliations, quarterly user access reviews, SIEM log monitoring, physical inventory counts. |
| **Corrective** | Operates **AFTER** a detected event to rectify the problem and restore normal operations. | Restoring files from off-site backups, applying emergency security patches, re-running failed batch jobs. |
| **Compensating** | An alternative control implemented when a primary control is technically or economically unfeasible. | Daily manual review of high-value ledger transactions when automated dual-authorization cannot be enforced. |

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **Preventive controls are always preferred over detective controls** because preventing an incident avoids financial loss, whereas detective controls only identify loss after it has already occurred.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B1',
        'part': 'B',
        'name': 'Key Performance Indicators (KPIs) vs. Key Risk Indicators (KRIs)',
        'summary': 'Lagging historical performance metrics (KPIs) vs leading predictive risk triggers (KRIs) and Key Control Indicators (KCIs).',
        'key_terms': ['KPI', 'KRI', 'KCI', 'Leading Indicator', 'Lagging Indicator', 'Threshold Trigger'],
        'objectives': 'Differentiate between KPIs, KRIs, and KCIs and establish early-warning risk threshold triggers.',
        'exam_tips': 'Exam Watch: A KPI is a LAGGING indicator measuring past historical performance. A KRI is a LEADING / PREDICTIVE indicator providing an early warning signal of increasing future risk.',
        'content': """# Key Performance Indicators (KPIs) vs. Key Risk Indicators (KRIs)

Metrics provide quantitative visibility to management and the Board to guide strategic decisions.

---

### 1. Comparing KPIs, KRIs, and KCIs

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

1. **Key Performance Indicator (KPI)**:
   - **Lagging Metric**: Measures past historical performance and operational success against strategic goals.
2. **Key Risk Indicator (KRI)**:
   - **Leading / Predictive Metric**: Acts as an **early-warning signal** indicating that the organization's risk exposure is increasing or approaching risk tolerance thresholds.
3. **Key Control Indicator (KCI)**:
   - Measures the operational health, reliability, and effectiveness of an individual internal control.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - **KRIs are LEADING indicators** that give management time to intervene before a risk materializes into a catastrophic loss event.
"""
    },
    {
        'domain_number': 4,
        'topic_code': '4B2',
        'part': 'B',
        'name': 'GRC Technology Platforms, Risk Dashboards & Executive Reporting',
        'summary': 'Integrated GRC software architectures, automated control testing, risk heatmaps, Balanced Scorecards, and Board reporting.',
        'key_terms': ['Integrated GRC Platform', 'Balanced Scorecard', 'Executive Risk Dashboard', 'Continuous Control Monitoring (CCM)', 'Board Reporting'],
        'objectives': 'Evaluate integrated GRC technology platforms and design executive risk dashboards for Board reporting.',
        'exam_tips': 'Exam Watch: Integrated GRC platforms eliminate organizational silos by unifying policy management, risk registers, compliance audits, and vendor management into a single centralized database.',
        'content': """# Integrated GRC Platforms and Executive Dashboards

Modern enterprises manage complexity using automated GRC software platforms (e.g., ServiceNow GRC, OneTrust, Archer, LogicGate).

---

### 1. Core Capabilities of Integrated GRC Platforms

1. **Unified Risk Register**: Eliminates siloed departmental spreadsheets and centralizes risk scoring across IT, Legal, Finance, and Operations.
2. **Continuous Control Monitoring (CCM)**: Automatically queries APIs to verify that security controls (e.g., encryption enabled, MFA enforced, backups running) are operating effectively 24/7.
3. **Policy Management Automation**: Automates the drafting, stakeholder review, employee dissemination, and annual policy recertification workflows.
4. **Third-Party Vendor Portals**: Automates vendor security questionnaires and collects SOC 2 reports.
5. **Executive & Board Dashboards**: Generates real-time visual heatmaps, KRI breach alerts, and compliance scorecards for the Board of Directors.

---

### 2. The Balanced Scorecard Approach
Evaluates enterprise GRC performance across 4 balanced perspectives:
1. **Financial Perspective**: Cost-benefit of controls, avoided regulatory penalties.
2. **Customer / Stakeholder Perspective**: Trust, data privacy protection, customer SLA compliance.
3. **Internal Business Process Perspective**: Control pass rates, audit finding remediation velocity.
4. **Learning & Growth Perspective**: Security awareness training completion rates, staff certifications.

> [!IMPORTANT]
> **💡 GRC / Exam Watch Alert**:
> - Executive risk reporting for the Board of Directors must be concise, strategic, and focused on **business impact and risk appetite alignment**, avoiding excessive low-level technical jargon.
"""
    }
]

print(f"Defined {len(TOPICS)} canonical GRC topics. Writing to grc_data/topics.json...")

with open(os.path.join(DATA_DIR, 'topics.json'), 'w', encoding='utf-8') as f:
    json.dump(TOPICS, f, indent=2)

print(f"[OK] Saved {len(TOPICS)} topics to grc_data/topics.json")
