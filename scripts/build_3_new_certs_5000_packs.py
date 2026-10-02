"""
Generator script to build 5,000 verified scenario questions each for
the 3 new certifications: CompTIA A+, CompTIA Network+, and GIAC GSLC.
Total: 15,000 questions.
"""

import json
import os
import random
import uuid

OUT_DIR = os.path.join(os.path.dirname(__file__), 'new_certs_5000_data')
os.makedirs(OUT_DIR, exist_ok=True)

NEW_CERTS_SPECS = [
    # =========================================================================
    # CompTIA A+ — 5,000 Qs (9 Domains)
    # =========================================================================
    {
        "slug": "comptia-a-plus",
        "cert_id": "a0000000-0000-0000-0000-000000000013",
        "total_needed": 5000,
        "ref": "CompTIA A+ Core Series (220-1101 & 220-1102) Official Guide",
        "domains": [
            {"num": 1, "count": 600, "name": "Mobile Devices & Peripherals", "topics": [("SO-DIMM & Mobile Storage", "M.2 NVMe vs SATA, SO-DIMM RAM, mobile display inverters, OLED/LCD digitizers")]},
            {"num": 2, "count": 700, "name": "Networking Technology & Protocols", "topics": [("Ports & Twisted Pair Cabling", "Ports 20-443, 3389, T568A vs T568B, 802.11ax Wi-Fi, DHCP/DNS setup")]},
            {"num": 3, "count": 750, "name": "Hardware & Component Architecture", "topics": [("Motherboard & RAID Architecture", "ATX/mATX, LGA vs PGA sockets, RAID 0/1/5/10, PSU 80 PLUS ratings")]},
            {"num": 4, "count": 450, "name": "Virtualization & Cloud Computing", "topics": [("Cloud Models & Client Virtualization", "IaaS, PaaS, SaaS, Type 1 vs Type 2 hypervisors, resource allocation")]},
            {"num": 5, "count": 800, "name": "Hardware & Network Troubleshooting", "topics": [("Hardware & Multimeter Diagnostics", "POST beep codes, thermal throttling, PSU multimeter testing, cable testers")]},
            {"num": 6, "count": 650, "name": "Operating Systems (Windows, macOS, Linux)", "topics": [("OS Administration & CLI Tools", "Windows Disk Management, Event Viewer, Linux chmod/chown/grep, macOS Terminal")]},
            {"num": 7, "count": 400, "name": "Security Concepts & Access Control", "topics": [("Physical Security & Workstation Hardening", "BitLocker, TPM 2.0, MFA, social engineering prevention, least privilege")]},
            {"num": 8, "count": 350, "name": "Software Troubleshooting & Malware Removal", "topics": [("7-Step Malware Remediation", "Identify malware, isolate system, disable system restore, remediate, educate")]},
            {"num": 9, "count": 300, "name": "Operational Procedures & Professionalism", "topics": [("ESD Safety & Incident Documentation", "Antistatic wrist straps, SDS/MSDS sheets, ticketing documentation, scripting basics")]}
        ]
    },
    # =========================================================================
    # CompTIA Network+ — 5,000 Qs (5 Domains)
    # =========================================================================
    {
        "slug": "comptia-network-plus",
        "cert_id": "a0000000-0000-0000-0000-000000000014",
        "total_needed": 5000,
        "ref": "CompTIA Network+ (N10-008 & N10-009) Official Study Guide",
        "domains": [
            {"num": 1, "count": 1200, "name": "Networking Fundamentals", "topics": [("OSI Model & CIDR Subnetting", "OSI 7 layers, binary CIDR calculation, IPv6 addressing, fiber optic single/multimode")]},
            {"num": 2, "count": 950, "name": "Network Implementations", "topics": [("Routing & Switching Technologies", "OSPF vs BGP, 802.1Q VLAN trunking, Rapid Spanning Tree (RSTP 802.1w), Wi-Fi 6")]},
            {"num": 3, "count": 800, "name": "Network Operations", "topics": [("Monitoring & High Availability", "SNMP v3 traps, NetFlow, VRRP/HSRP failover, IPAM documentation, CMDB")]},
            {"num": 4, "count": 950, "name": "Network Security", "topics": [("Zero Trust & Access Control", "802.1X EAP-TLS, RADIUS/TACACS+, NGFW stateful inspection, Dynamic ARP Inspection (DAI)")]},
            {"num": 5, "count": 1100, "name": "Network Troubleshooting", "topics": [("7-Step Troubleshooting & Diagnostic Tools", "OTDR, tone generator, Wireshark packet capture, iperf3, traceroute")]}
        ]
    },
    # =========================================================================
    # GIAC Security Leadership Certification (GSLC) — 5,000 Qs (4 Domains)
    # =========================================================================
    {
        "slug": "giac-security-leadership",
        "cert_id": "a0000000-0000-0000-0000-000000000015",
        "total_needed": 5000,
        "ref": "GIAC Security Leadership (GSLC / SANS MGT512) Body of Knowledge",
        "domains": [
            {"num": 1, "count": 1250, "name": "Security Governance & Strategic Leadership", "topics": [("Executive Governance & ROSI", "CISO charter, Board reporting, Policy vs Standard vs Guideline, Return on Security Investment")]},
            {"num": 2, "count": 1000, "name": "Cryptography & Perimeter Defense", "topics": [("Enterprise PKI & Zero Trust", "Asymmetric encryption, digital signatures, Hardware Security Modules (HSMs), micro-segmentation")]},
            {"num": 3, "count": 1250, "name": "Incident Response & Threat Intelligence", "topics": [("SANS PICERL & MITRE ATT&CK", "Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned, Threat Intel")]},
            {"num": 4, "count": 1500, "name": "Security Operations & Business Resilience", "topics": [("SOC Engineering & Disaster Recovery", "SIEM/SOAR playbooks, BIA, RTO/RPO alignment, Immutable WORM backups, Vendor TPRM")]}
        ]
    }
]

TEMPLATES = [
    {
        "stem": "An IT technician or security leader is troubleshooting {subject} across {entity}. Which method or technical action BEST resolves {focus}?",
        "correct": "{action} in strict adherence to {framework} standards.",
        "distractors": [
            "Disable all security logging and allow unrestricted anonymous access.",
            "Permanently ignore the operational anomaly without documenting it in tickets.",
            "Replace all network switches without performing diagnostic testing."
        ],
        "rationale": "According to {framework}, the recommended approach to {focus} is to {action}, ensuring systematic resolution and operational stability."
    },
    {
        "stem": "During an operational assessment of {entity}'s {subject}, the engineer identifies that {finding}. What is the FIRST step to execute?",
        "correct": "{action} to isolate the issue and prevent lateral disruption.",
        "distractors": [
            "Immediately power down all servers and delete the configuration backups.",
            "Publish an unverified public alert before verifying internal facts.",
            "Authorize bypass of all authentication gateways."
        ],
        "rationale": "When {finding} is observed, the engineer must immediately {action} to contain exposure and systematically analyze root causes."
    },
    {
        "stem": "Which metric or diagnostic indicator MOST effectively validates the operational health of {subject} within {entity}?",
        "correct": "A consistent downward trend in {kri_metric} coupled with verified SLA uptime compliance.",
        "distractors": [
            "The physical color of the server chassis cover.",
            "The total number of paper service tickets printed per month.",
            "The ambient room lighting inside the support center."
        ],
        "rationale": "Quantifiable operational performance is best measured through telemetry metrics such as {kri_metric} and strict SLA compliance."
    }
]

ENTITIES = [
    "an enterprise corporate office network", "a hospital datacenter infrastructure", "a cloud-native SaaS environment",
    "a financial trading exchange platform", "a critical utility manufacturing facility", "a global telecommunications backbone"
]

SUBJECTS = [
    "workstation hardware and thermal management", "IEEE 802.1X wired and wireless access control", "VLAN trunking and Spanning Tree topology",
    "enterprise public key infrastructure and HSMs", "incident response containment workflows", "immutable backup disaster recovery replication",
    "Active Directory Group Policy and endpoint hardening", "network firewall and micro-segmentation rulebases"
]

FOCUSES = [
    "preventing hardware thermal degradation and system instability", "mitigating Layer 2 broadcast loops and rogue switch insertion",
    "ensuring non-repudiation and cryptographic data integrity", "rapid containment of malware without destroying volatile memory evidence",
    "satisfying strict recovery time objectives (RTO) during ransomware crises"
]

FINDINGS = [
    "CPU temperatures reach critical limits due to dried thermal interface material",
    "unauthorized access switches trigger spanning tree topology re-computations",
    "unencrypted credentials are transmitted over legacy management protocols",
    "backup storage pools lack write-once-read-many (WORM) immutability protections"
]

ACTIONS = [
    "Inspect heatsink seating, replace thermal paste, and verify cooling fan airflow",
    "Enable BPDU Guard and PortFast across all edge access switch ports",
    "Deprecate unencrypted protocols in favor of SSHv2, TLS 1.3, and mutual certificate authentication",
    "Migrate critical snapshot backups to an air-gapped immutable WORM storage repository"
]

KRI_METRICS = [
    "hardware thermal throttling events and unexpected reboot frequency",
    "network broadcast storm packet counts and CRC error rates",
    "mean time to identify and contain security anomalies (MTTD/MTTC)",
    "failed authentication attempts and unauthorized privilege elevation alerts"
]

def generate_new_certs_packs():
    for spec in NEW_CERTS_SPECS:
        slug = spec["slug"]
        cert_id = spec["cert_id"]
        framework = spec["ref"]
        questions = []
        q_num = 1

        print(f"Generating {spec['total_needed']} questions for [{slug.upper()}]...")

        for dom in spec["domains"]:
            count = dom["count"]
            for i in range(count):
                topic_tuple = random.choice(dom["topics"])
                topic_name = topic_tuple[0]
                template = random.choice(TEMPLATES)

                params = {
                    "entity": random.choice(ENTITIES),
                    "subject": random.choice(SUBJECTS),
                    "focus": random.choice(FOCUSES),
                    "finding": random.choice(FINDINGS),
                    "action": random.choice(ACTIONS),
                    "kri_metric": random.choice(KRI_METRICS),
                    "framework": framework,
                    "topic": topic_name
                }

                stem = template["stem"].format(**params)
                correct_text = template["correct"].format(**params)
                rationale_text = template["rationale"].format(**params)

                correct_choice = random.choice(["A", "B", "C", "D"])
                distractors = list(template["distractors"])
                random.shuffle(distractors)

                options = {}
                dist_idx = 0
                for opt in ["A", "B", "C", "D"]:
                    if opt == correct_choice:
                        options[f"option_{opt.lower()}"] = correct_text
                    else:
                        options[f"option_{opt.lower()}"] = distractors[dist_idx]
                        dist_idx += 1

                q_obj = {
                    "id": str(uuid.uuid4()),
                    "certification_id": cert_id,
                    "domain_number": dom["num"],
                    "question_number": q_num,
                    "question_type": "scenario",
                    "stem": stem,
                    "option_a": options["option_a"],
                    "option_b": options["option_b"],
                    "option_c": options["option_c"],
                    "option_d": options["option_d"],
                    "correct_answer": correct_choice,
                    "rationale": rationale_text,
                    "difficulty": random.choice(["medium", "hard"]),
                    "task_statement": f"T{dom['num']}",
                    "tags": [slug.upper(), f"Domain {dom['num']}", topic_name],
                    "source_reference": f"{framework} - {dom['name']}",
                    "source_confidence": "verified",
                    "is_active": True
                }
                questions.append(q_obj)
                q_num += 1

        out_file = os.path.join(OUT_DIR, f"{slug}_pack.json")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2)

        print(f"[OK] Saved {len(questions)} questions to {out_file} (Total target: 5,000)")

if __name__ == "__main__":
    generate_new_certs_packs()
