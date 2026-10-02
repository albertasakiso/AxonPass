import os
import json

DATA_DIR = 'scripts/cisa_28th_data'
os.makedirs(DATA_DIR, exist_ok=True)

CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001'

DOMAINS = [
    {
        "id": "d0000000-0000-0000-0000-000000000001",
        "domain_number": 1,
        "name": "Information System Auditing Process",
        "code": "1",
        "exam_weight_percent": 18.00,
        "approx_exam_questions": 27,
        "learning_objectives": "Provide audit services in accordance with IS audit standards to assist organizations in protecting and controlling information systems. Master ITAF standards, risk-based audit planning, sampling, CAATs, data analytics, and reporting."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000002",
        "domain_number": 2,
        "name": "Governance and Management of IT",
        "code": "2",
        "exam_weight_percent": 18.00,
        "approx_exam_questions": 27,
        "learning_objectives": "Provide assurance that the necessary leadership, organizational structures, and processes are in place to achieve objectives and support the strategy of the organization. Master COBIT 2019, ERM, privacy programs, data governance, vendor management, and SoD."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000003",
        "domain_number": 3,
        "name": "IS Acquisition, Development, and Implementation",
        "code": "3",
        "exam_weight_percent": 12.00,
        "approx_exam_questions": 18,
        "learning_objectives": "Provide assurance that the practices for the acquisition, development, testing, and implementation of information systems meet organizational strategies and objectives. Master business cases, Agile/DevSecOps, UAT, data migration, cutover strategies, and PIR."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000004",
        "domain_number": 4,
        "name": "IS Operations and Business Resilience",
        "code": "4",
        "exam_weight_percent": 26.00,
        "approx_exam_questions": 39,
        "learning_objectives": "Provide assurance that the processes for information systems operations, maintenance, and support meet organizational strategies and objectives. Master IT service management, EUC/Shadow IT, BIA, MTD/RTO/RPO metrics, backup strategies, and BCP/DRP testing."
    },
    {
        "id": "d0000000-0000-0000-0000-000000000005",
        "domain_number": 5,
        "name": "Protection of Information Assets",
        "code": "5",
        "exam_weight_percent": 26.00,
        "approx_exam_questions": 39,
        "learning_objectives": "Provide assurance that the organization’s policies, standards, procedures, and controls ensure the confidentiality, integrity, and availability of information assets. Master Zero Trust (ZTA), IAM/PAM, PKI, cryptography, DLP, SIEM/SOAR, incident response, and digital forensics."
    }
]

with open(os.path.join(DATA_DIR, "domains.json"), "w", encoding="utf-8") as f:
    json.dump(DOMAINS, f, indent=2)

print("Domains generated successfully.")
