import React, { useState } from 'react';

interface DeltaFeature {
  id: string;
  domain: number;
  domainName: string;
  title: string;
  sectionRef: string;
  category: 'AI / Analytics' | 'Cybersecurity' | 'Resilience' | 'Governance & Privacy' | 'SDLC & Cloud';
  summary: string;
  whyAdded: string;
  auditorResponsibility: string;
  examTip: string;
  keyTerms: string[];
}

const deltaFeatures: DeltaFeature[] = [
  {
    id: 'ai-audit',
    domain: 1,
    domainName: 'Information System Auditing Process',
    title: 'Artificial Intelligence & Machine Learning in IS Audit',
    sectionRef: 'Section 1.8.4',
    category: 'AI / Analytics',
    summary: 'Integration of machine learning algorithms for continuous anomaly detection, automated risk scoring, and formal guidelines for auditing AI/ML models.',
    whyAdded: 'Enterprises increasingly deploy automated AI decision engines. Auditors must be equipped to evaluate algorithmic bias, training data integrity, and model drift.',
    auditorResponsibility: 'Verify data provenance, test AI model explainability, ensure human-in-the-loop oversight, and validate model performance metrics against established benchmarks.',
    examTip: 'Watch for questions on model explainability and algorithmic bias. The auditor must verify training data integrity before relying on AI outputs!',
    keyTerms: ['Audit Algorithms', 'Algorithmic Bias', 'Model Explainability', 'Model Drift', 'Continuous Auditing']
  },
  {
    id: 'agile-auditing',
    domain: 1,
    domainName: 'Information System Auditing Process',
    title: 'Agile Auditing Methodologies & Sprint Assurance',
    sectionRef: 'Section 1.5.6',
    category: 'AI / Analytics',
    summary: 'Applying agile sprint cycles (1-2 weeks), backlog prioritization, and iterative assurance reporting to match modern fast-paced software deployment cadences.',
    whyAdded: 'Traditional annual audit plans and 6-month waterfall audits are too slow for cloud CI/CD environments. Agile auditing delivers real-time risk insights.',
    auditorResponsibility: 'Maintain an audit backlog prioritized by risk, conduct daily standups, deliver incremental finding reports, and participate in sprint retrospectives.',
    examTip: 'Agile auditing does NOT compromise ITAF independence standards; it simply changes the delivery velocity and modularity of testing.',
    keyTerms: ['Audit Backlog', 'Audit Sprints', 'Incremental Reporting', 'User Story Assurance', 'Retrospectives']
  },
  {
    id: 'data-privacy',
    domain: 2,
    domainName: 'Governance and Management of IT',
    title: 'Data Privacy Programs & Transborder Governance',
    sectionRef: 'Sections 2.6 & 2.7',
    category: 'Governance & Privacy',
    summary: 'Comprehensive frameworks for managing data subject rights (GDPR, CCPA/CPRA), lawful processing basis, DPIAs, and cross-border data transfer safeguards.',
    whyAdded: 'Global regulatory penalties (up to 4% of global turnover) make data privacy a top-tier board governance priority requiring formal IS audit review.',
    auditorResponsibility: 'Evaluate data inventory and classification, verify consent management, audit DPIA completions, and verify Standard Contractual Clauses (SCCs) for cross-border flows.',
    examTip: 'Transborder data flows require adequate legal mechanisms (SCCs or BCRs) BEFORE personal data leaves the jurisdiction of origin.',
    keyTerms: ['GDPR', 'CCPA/CPRA', 'Data Subject Rights', 'Transborder Data Flow', 'DPIA', 'SCCs']
  },
  {
    id: 'devsecops',
    domain: 3,
    domainName: 'Information Systems Acquisition, Development & Implementation',
    title: 'DevSecOps & Shift-Left CI/CD Pipeline Security',
    sectionRef: 'Sections 3.3.5 & 5.8.10',
    category: 'SDLC & Cloud',
    summary: 'Embedding automated security testing (SAST, DAST, SCA) directly into continuous integration and continuous delivery (CI/CD) pipelines.',
    whyAdded: 'Security cannot be an afterthought at the end of the SDLC. Shift-left automation catches vulnerabilities when they are cheapest to remediate.',
    auditorResponsibility: 'Verify that automated security quality gates block vulnerable code from merging, audit secrets management in repos, and verify container vulnerability scanning.',
    examTip: 'SAST analyzes source code (white-box) during development. DAST tests running applications (black-box) during runtime.',
    keyTerms: ['Shift-Left Security', 'SAST vs DAST', 'Software Composition Analysis (SCA)', 'CI/CD Quality Gates', 'Infrastructure as Code (IaC)']
  },
  {
    id: 'shadow-it',
    domain: 4,
    domainName: 'Information Systems Operations and Business Resilience',
    title: 'Shadow IT & End-User Computing (EUC) Governance',
    sectionRef: 'Section 4.5',
    category: 'Resilience',
    summary: 'Governance protocols for discovering and managing unsanctioned SaaS tools, citizen development (low-code/no-code), and unmanaged spreadsheet models.',
    whyAdded: 'Unvetted cloud applications and complex business spreadsheets create massive blind spots for data breaches, compliance failures, and financial errors.',
    auditorResponsibility: 'Verify deployment of Cloud Access Security Brokers (CASBs), audit the inventory of critical financial spreadsheets, and review access controls on low-code platforms.',
    examTip: 'High-risk spreadsheets used for financial calculations require cell locking, version control, formula validation, and independent peer review.',
    keyTerms: ['Shadow IT', 'End-User Computing (EUC)', 'CASB', 'Citizen Development', 'Spreadsheet Model Auditing']
  },
  {
    id: 'resilient-backup',
    domain: 4,
    domainName: 'Information Systems Operations and Business Resilience',
    title: 'Modern Cyber Resilience & 3-2-1 Immutable Backup Architecture',
    sectionRef: 'Section 4.14.3',
    category: 'Resilience',
    summary: 'Mandating 3-2-1 backup architectures with immutable Write-Once-Read-Many (WORM) storage and air-gapped snapshots to guarantee ransomware survival.',
    whyAdded: 'Ransomware actors actively target and encrypt online backup repositories first. Immutable and air-gapped backups are the only fail-safe recovery mechanism.',
    auditorResponsibility: 'Verify physical/logical separation of backup networks, audit regular restoration test logs, verify immutability retention locks, and validate RPO/RTO calculations.',
    examTip: 'The 3-2-1 rule: 3 copies of data, on 2 different media, with 1 copy offsite/immutable. Regular restoration testing is mandatory to prove backup integrity!',
    keyTerms: ['3-2-1 Backup Strategy', 'Immutable Storage (WORM)', 'Air-Gapped Repositories', 'RPO / RTO', 'Restoration Verification']
  },
  {
    id: 'zero-trust',
    domain: 5,
    domainName: 'Protection of Information Assets',
    title: 'Zero Trust Architecture (ZTA) & Privileged Access Management (PAM)',
    sectionRef: 'Sections 5.3.3 & 5.3.4',
    category: 'Cybersecurity',
    summary: 'Adoption of NIST SP 800-207 Zero Trust ("Never Trust, Always Verify"), Just-In-Time (JIT) credential elevation, and automated identity governance (IGA).',
    whyAdded: 'Perimeter "castle-and-moat" defenses fail once attackers compromise credentials. Zero Trust continuously authenticates and authorizes every single request.',
    auditorResponsibility: 'Evaluate dynamic access policies, verify PAM vaulting and session recording for superusers, and test microsegmentation boundaries.',
    examTip: 'In Zero Trust, location on the internal corporate network grants ZERO implicit trust. Every session requires identity verification and device posture assessment.',
    keyTerms: ['Zero Trust (NIST SP 800-207)', 'PAM Vaulting', 'Just-In-Time (JIT) Access', 'Microsegmentation', 'IGA & IDaaS']
  },
  {
    id: 'soar-edr',
    domain: 5,
    domainName: 'Protection of Information Assets',
    title: 'Security Orchestration, Automation & Response (SOAR) & EDR/XDR',
    sectionRef: 'Sections 5.4.15 & 5.14.4',
    category: 'Cybersecurity',
    summary: 'Automating threat triage and containment via SOAR playbooks and replacing signature antivirus with behavioral Endpoint Detection and Response (EDR/XDR).',
    whyAdded: 'Cyber attacks happen in seconds. Manual SOC triage creates alert fatigue and delays containment. Automated playbooks isolate compromised nodes at machine speed.',
    auditorResponsibility: 'Audit SOAR playbook logic for unintended business disruption, test EDR sensor coverage across 100% of endpoints, and review SIEM correlation rules.',
    examTip: 'SIEM aggregates and correlates log data; SOAR executes automated response actions (e.g., auto-quarantining an endpoint or revoking a token) via playbooks.',
    keyTerms: ['SIEM', 'SOAR Playbooks', 'EDR / XDR', 'Automated Containment', 'SOC Tiering']
  }
];

const domainWeightComparison = [
  { domain: 1, name: 'IS Auditing Process', v27: 21, v28: 18, delta: -3, impact: 'Shifted to Operations & Cyber Resilience' },
  { domain: 2, name: 'Governance & Management of IT', v27: 17, v28: 18, delta: +1, impact: 'Expanded Data Privacy, ERM & Three Lines Model' },
  { domain: 3, name: 'IS Acquisition & Development', v27: 12, v28: 12, delta: 0, impact: 'Integrated DevSecOps, Agile & Cloud Architectures' },
  { domain: 4, name: 'IS Operations & Business Resilience', v27: 20, v28: 26, delta: +6, impact: 'MAJOR EXPANSION: Shadow IT, Cloud HA, 3-2-1 Backups' },
  { domain: 5, name: 'Protection of Information Assets', v27: 30, v28: 26, delta: -4, impact: 'Refocused on Zero Trust, PAM, EDR/XDR & SOAR' }
];

export const CisaVersionDeltaViewer: React.FC<{ onStartDeltaQuiz?: () => void }> = ({ onStartDeltaQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<DeltaFeature | null>(deltaFeatures[0]);

  const categories = ['All', 'AI / Analytics', 'Cybersecurity', 'Resilience', 'Governance & Privacy', 'SDLC & Cloud'];

  const filteredFeatures = deltaFeatures.filter(f => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.keyTerms.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.domainName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner */}
      <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-success" style={{ fontWeight: 'var(--weight-bold)' }}>
                ✨ 2024 BLUEPRINT UPGRADE
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ISACA Official Job Practice Evolution
              </span>
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
              CISA Version 28 vs Version 27 Gap & Delta Analysis
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', marginTop: 'var(--space-2)', maxWidth: '750px', lineHeight: 1.5 }}>
              Explore the critical changes introduced in the 28th Edition: Domain 4 expansion (+6%), the addition of AI & Machine Learning in audit, Zero Trust Architecture, DevSecOps, Shadow IT governance, and modern 3-2-1 cyber resilience.
            </p>
          </div>

          {onStartDeltaQuiz && (
            <button
              onClick={onStartDeltaQuiz}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', alignSelf: 'center' }}
            >
              <span>⚡</span> Practice v28 Delta Questions
            </button>
          )}
        </div>
      </div>

      {/* Domain Weighting Shifts Matrix */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>⚖️</span> Domain Examination Weighting Shifts (v27 ➔ v28)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {domainWeightComparison.map(d => (
            <div
              key={d.domain}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    Domain {d.domain}
                  </span>
                  <span
                    className={`badge ${d.delta > 0 ? 'badge-success' : d.delta < 0 ? 'badge-warning' : 'badge-neutral'}`}
                    style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)' }}
                  >
                    {d.delta > 0 ? `+${d.delta}%` : d.delta < 0 ? `${d.delta}%` : '0%'}
                  </span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: '0 0 var(--space-2) 0' }}>
                  {d.name}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.4, margin: '0 0 var(--space-3) 0' }}>
                  {d.impact}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                  <span>v27: <strong>{d.v27}%</strong></span>
                  <span>➔</span>
                  <span>v28: <strong style={{ color: d.delta > 0 ? 'var(--color-success)' : 'var(--color-ink)' }}>{d.v28}%</strong></span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${d.v28 * 2.5}%`, backgroundColor: d.delta > 0 ? 'var(--color-success)' : 'var(--color-primary)', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`btn btn-secondary ${selectedCategory === c ? 'active' : ''}`}
              style={{
                fontSize: 'var(--text-xs)',
                padding: 'var(--space-1) var(--space-3)',
                backgroundColor: selectedCategory === c ? 'var(--color-primary)' : undefined,
                color: selectedCategory === c ? '#fff' : undefined,
                borderColor: selectedCategory === c ? 'var(--color-primary)' : undefined
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search new topics, terms (e.g. AI, Zero Trust, SOAR, EUC)..."
          className="input"
          style={{ maxWidth: '350px', fontSize: 'var(--text-xs)' }}
        />
      </div>

      {/* Grid: Feature Cards and Detail View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-5)' }}>
        {/* Left: Feature Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredFeatures.map(feat => {
            const isSelected = activeFeature?.id === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveFeature(feat)}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : 'var(--color-surface)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                    Domain {feat.domain} • {feat.sectionRef}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    {feat.category}
                  </span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: '0 0 var(--space-1) 0' }}>
                  {feat.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.4, margin: 0 }}>
                  {feat.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Deep Dive Explainer Panel */}
        {activeFeature && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>
                DOMAIN {activeFeature.domain}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontWeight: 'var(--weight-bold)' }}>
                {activeFeature.sectionRef}
              </span>
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: '0 0 var(--space-2) 0' }}>
              {activeFeature.title}
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: 'var(--space-4)' }}>
              {activeFeature.keyTerms.map((term, idx) => (
                <span key={idx} className="term-chip">
                  {term}
                </span>
              ))}
            </div>

            {/* Why ISACA Added This */}
            <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', textTransform: 'uppercase', margin: '0 0 var(--space-1) 0' }}>
                💡 Why ISACA Added This in Version 28
              </h5>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', margin: 0, lineHeight: 1.5 }}>
                {activeFeature.whyAdded}
              </p>
            </div>

            {/* Auditor Responsibility */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h5 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', textTransform: 'uppercase', margin: '0 0 var(--space-1) 0' }}>
                🛡️ IS Auditor\'s Action & Evaluation Checklist
              </h5>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.5 }}>
                {activeFeature.auditorResponsibility}
              </p>
            </div>

            {/* Exam Watch Alert */}
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid var(--color-error)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)' }}>⚠️</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-error)' }}>
                  EXAM WATCH & TRAPS
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', margin: 0, lineHeight: 1.5 }}>
                {activeFeature.examTip}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
