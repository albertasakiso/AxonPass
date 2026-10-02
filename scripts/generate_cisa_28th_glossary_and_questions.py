import os
import json
import re

DATA_DIR = 'scripts/cisa_28th_data'
EXTRACTED_DIR = 'scripts/cisa_28th_extracted'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

print("Extracting and structuring 28th Edition Glossary & Practice Questions...")

raw_glossary_file = os.path.join(EXTRACTED_DIR, "glossary.txt")
raw_terms = []

if os.path.exists(raw_glossary_file):
    with open(raw_glossary_file, 'r', encoding='utf-8') as f:
        gloss_text = f.read()

    lines = gloss_text.split('\n')
    current_term = None
    current_def = []

    for line in lines:
        line_clean = line.strip()
        if not line_clean or line_clean.startswith('--- PAGE') or 'CISA' in line_clean and 'Edition' in line_clean or 'ISACA. All Rights' in line_clean or len(line_clean) == 1:
            continue
        
        m = re.match(r'^([A-Z0-9][A-Za-z0-9\s/(),.\-–’\']{1,60})\s*[-—–]\s*(.+)$', line_clean)
        if m and not line_clean.startswith('Figure ') and not line_clean.startswith('Table ') and not re.match(r'^\d+\.', line_clean):
            if current_term and current_def:
                defn_full = " ".join(current_def).strip()
                if len(defn_full) > 15:
                    raw_terms.append((current_term, defn_full, "CISA 28th Edition Official Glossary"))
            current_term = m.group(1).strip()
            current_def = [m.group(2).strip()]
        elif current_term:
            current_def.append(line_clean)

    if current_term and current_def:
        defn_full = " ".join(current_def).strip()
        if len(defn_full) > 15:
            raw_terms.append((current_term, defn_full, "CISA 28th Edition Official Glossary"))

ESSENTIAL_TERMS = [
    ("Audit Charter", "An official document approved by the audit committee or board of directors that defines the internal audit activity's purpose, authority, responsibility, and standing within the organization.", "Domain 1: Audit Process"),
    ("ITAF", "Information Technology Assurance Framework: A comprehensive set of mandatory standards, advisory guidelines, and tools/techniques developed by ISACA for IT audit and assurance professionals.", "Domain 1: Audit Process"),
    ("Inherent Risk", "The susceptibility of an audit area, business process, or technology asset to material error, fraud, or security breach, assuming there are no related internal controls.", "Domain 1: Audit Process"),
    ("Control Risk", "The risk that internal controls designed and implemented by management will fail to prevent, detect, or correct a material error or security incident on a timely basis.", "Domain 1: Audit Process"),
    ("Detection Risk", "The risk that the auditor's testing procedures will fail to detect a material error, misstatement, or control weakness.", "Domain 1: Audit Process"),
    ("COBIT 2019", "A comprehensive business framework for the governance and management of enterprise IT developed by ISACA, separating governance (EDM) from management (APO, BAI, DSS, MEA).", "Domain 2: IT Governance"),
    ("Risk Appetite", "The amount and type of risk that an enterprise is willing to accept in pursuit of its business objectives, formally established by the board of directors.", "Domain 2: IT Governance"),
    ("Risk Tolerance", "The acceptable operational variation in the size and degree of a specific risk outcome relative to enterprise objectives.", "Domain 2: IT Governance"),
    ("Segregation of Duties (SoD)", "An internal control policy preventing a single individual from having the ability to both execute and conceal fraud or errors by dividing critical tasks among multiple personnel.", "Domain 2: IT Governance"),
    ("SOC 2 Type II", "An independent service auditor's examination evaluating both the suitability of control design and the operating effectiveness of service organization controls over a minimum 6-month period.", "Domain 2: IT Governance"),
    ("User Acceptance Testing (UAT)", "The final phase of software testing conducted by business process users in a staging environment to validate that system functionality fulfills business requirements prior to go-live.", "Domain 3: Acquisition & Development"),
    ("Direct Cutover", "A system deployment strategy where the legacy system is discontinued and the new system goes live at a specific instant; carries the highest operational risk.", "Domain 3: Acquisition & Development"),
    ("Post-Implementation Review (PIR)", "A formal evaluation performed 3 to 6 months after system stabilization to determine whether intended business benefits, controls, and ROI were achieved.", "Domain 3: Acquisition & Development"),
    ("Business Impact Analysis (BIA)", "A foundational assessment that identifies critical business functions and determines Maximum Tolerable Downtime (MTD), Recovery Time Objectives (RTO), and Recovery Point Objectives (RPO).", "Domain 4: Operations & Resilience"),
    ("Recovery Time Objective (RTO)", "The target time within which a business process or IT system must be restored following an outage before intolerable impact occurs.", "Domain 4: Operations & Resilience"),
    ("Recovery Point Objective (RPO)", "The maximum acceptable amount of data loss resulting from an outage, measured in units of time (e.g., maximum allowable time gap between backup and disaster).", "Domain 4: Operations & Resilience"),
    ("Maximum Tolerable Downtime (MTD)", "The absolute maximum duration that a business process can be inoperable before the viability of the enterprise is threatened.", "Domain 4: Operations & Resilience"),
    ("Hot Site", "A fully operational, geographically separated disaster recovery data center equipped with complete hardware, networks, and continuously replicated data ready for near-instantaneous failover.", "Domain 4: Operations & Resilience"),
    ("Cold Site", "A disaster recovery facility providing physical space, power, and environmental controls, but lacking computing hardware, requiring days or weeks to procure and configure systems.", "Domain 4: Operations & Resilience"),
    ("Zero Trust Architecture (ZTA)", "An enterprise cybersecurity architecture based on the principle of 'never trust, always verify', enforcing continuous authentication and least privilege on every transaction regardless of network location.", "Domain 5: Protection of Assets"),
    ("Privileged Access Management (PAM)", "A specialized cybersecurity capability managing, vaulting, monitoring, and recording elevated administrative credentials and sessions.", "Domain 5: Protection of Assets"),
    ("Digital Signature", "A cryptographic mechanism providing authentication, integrity, and non-repudiation, generated by encrypting a document hash with the sender's private key and verified with their public key.", "Domain 5: Protection of Assets"),
    ("Public Key Infrastructure (PKI)", "A system of digital certificates, Certificate Authorities (CAs), Registration Authorities (RAs), and cryptographic key management protocols that establish trust across digital networks.", "Domain 5: Protection of Assets"),
    ("Data Loss Prevention (DLP)", "A comprehensive set of technologies and processes designed to detect, monitor, and prevent unauthorized transmission or exfiltration of sensitive data at rest, in motion, and in use.", "Domain 5: Protection of Assets"),
    ("SIEM", "Security Information and Event Management: A centralized software platform aggregating, normalizing, correlating, and analyzing real-time security event logs across the enterprise.", "Domain 5: Protection of Assets"),
    ("SOAR", "Security Orchestration, Automation and Response: Technology enabling automated threat triage, alert enrichment, and automated playbook execution to accelerate incident response.", "Domain 5: Protection of Assets"),
    ("Chain of Custody", "The chronological, unbroken documentary trail demonstrating the seizure, custody, control, transfer, analysis, and disposition of digital evidence in a forensic investigation.", "Domain 5: Protection of Assets"),
    ("Order of Volatility", "The sequence in which digital evidence must be preserved during forensic acquisition, starting with the most volatile components (Registers/Cache, RAM) to least volatile (Disk, Tape).", "Domain 5: Protection of Assets")
]

# Deduplicate strictly
seen = set()
deduped_terms = []

# Add essential terms first
for term, defn, cat in ESSENTIAL_TERMS:
    norm = term.strip().lower()
    if norm not in seen:
        seen.add(norm)
        deduped_terms.append({
            "certification_id": CISA_CERT_ID,
            "term": term.strip(),
            "definition": defn.strip(),
            "category": cat
        })

# Add parsed terms
for term, defn, cat in raw_terms:
    norm = term.strip().lower()
    if norm not in seen and len(norm) > 2:
        seen.add(norm)
        deduped_terms.append({
            "certification_id": CISA_CERT_ID,
            "term": term.strip(),
            "definition": defn.strip(),
            "category": cat
        })

with open(os.path.join(DATA_DIR, "glossary_terms.json"), "w", encoding="utf-8") as f:
    json.dump(deduped_terms, f, indent=2)

print(f"Saved {len(deduped_terms)} strictly deduplicated glossary terms.")
