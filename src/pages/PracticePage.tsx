import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import { supabase } from '../lib/supabase';
import { calculateTimeLimit } from '../lib/timer';
import { db } from '../lib/db';
import type { Certification, Domain, Topic, Question } from '../types';

export default function PracticePage() {
  const navigate = useNavigate();
  const { startQuiz } = useQuizStore();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCertSlug, setSelectedCertSlug] = useState<string>('cisa');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [totalQuestionsInBank, setTotalQuestionsInBank] = useState<number>(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Load Certifications
  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data) setCertifications(data);
    }
    loadCerts();
  }, []);

  // Load Domains, Topics & Count for Selected Cert
  useEffect(() => {
    async function loadCertInfo() {
      const cert = certifications.find(c => c.slug === selectedCertSlug);
      if (!cert) return;

      const { data: domData } = await supabase
        .from('domains')
        .select('*')
        .eq('certification_id', cert.id)
        .order('domain_number');
      if (domData) setDomains(domData);

      const { data: topData } = await supabase
        .from('topics')
        .select('*')
        .in('domain_id', domData ? domData.map(d => d.id) : [])
        .order('sort_order');
      if (topData) setTopics(topData);

      const { count } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('certification_id', cert.id)
        .eq('is_active', true);
      setTotalQuestionsInBank(count || 0);
    }

    if (certifications.length > 0) {
      loadCertInfo();
    }
  }, [certifications, selectedCertSlug]);

  const handleLaunchPractice = async (
    mode: 'custom' | 'quick' | 'exam_sim' | 'leitner_drill' | 'case_study' | 'topic_drill',
    targetTopicId?: string
  ) => {
    setIsLaunching(true);
    const cert = certifications.find(c => c.slug === selectedCertSlug);
    if (!cert) {
      setIsLaunching(false);
      return;
    }

    let qCount = questionCount;
    let feedbackPolicy: 'immediate' | 'delayed' = 'immediate';
    let durationSeconds = 1200; // default 20 mins

    if (mode === 'quick') {
      qCount = 10;
      durationSeconds = calculateTimeLimit({
        certDurationMinutes: cert.exam_duration_minutes || 240,
        certTotalQuestions: cert.total_exam_questions || 150,
        sessionQuestionCount: 10,
      });
    } else if (mode === 'exam_sim') {
      qCount = Math.min(cert.total_exam_questions || 150, 150);
      feedbackPolicy = 'delayed';
      durationSeconds = (cert.exam_duration_minutes || 240) * 60;
    } else if (mode === 'leitner_drill') {
      qCount = 15;
      durationSeconds = 900;
    } else if (mode === 'case_study') {
      qCount = 10;
      durationSeconds = 900;
    } else if (mode === 'topic_drill') {
      qCount = 10;
      durationSeconds = 600;
    } else {
      durationSeconds = calculateTimeLimit({
        certDurationMinutes: cert.exam_duration_minutes || 240,
        certTotalQuestions: cert.total_exam_questions || 150,
        sessionQuestionCount: qCount,
      });
    }

    // If Case study mode, query case_study_questions directly with scenario text
    if (mode === 'case_study') {
      const { data: csqData } = await supabase
        .from('case_study_questions')
        .select('*, case_studies(id, title, scenario_text, domain_id)')
        .order('sort_order');

      if (csqData && csqData.length > 0) {
        const formattedQuestions: Question[] = csqData.map((csq: any, idx: number) => ({
          id: csq.id,
          certification_id: cert.id,
          domain_id: csq.case_studies?.domain_id || cert.id,
          topic_id: null,
          subtopic_id: null,
          question_number: csq.question_number || idx + 1,
          question_type: 'case_study',
          stem: csq.stem,
          option_a: csq.option_a,
          option_b: csq.option_b,
          option_c: csq.option_c,
          option_d: csq.option_d,
          correct_answer: csq.correct_answer,
          rationale: csq.rationale || '',
          incorrect_rationale_a: null,
          incorrect_rationale_b: null,
          incorrect_rationale_c: null,
          incorrect_rationale_d: null,
          difficulty: 'hard',
          task_statement: null,
          tags: ['Case Study', 'Scenario'],
          source_reference: `Official Case Study: ${csq.case_studies?.title || ''}`,
          source_confidence: 'verified',
          scenario_text: csq.case_studies?.scenario_text || null,
          content_hash: null,
          is_active: true,
          created_at: csq.created_at || new Date().toISOString(),
          updated_at: csq.created_at || new Date().toISOString(),
        }));

        await startQuiz(
          formattedQuestions,
          'practice',
          1200,
          cert.id,
          null,
          'immediate'
        );
        setIsLaunching(false);
        navigate('/quiz');
        return;
      }
    }

    // Query questions
    let query = supabase
      .from('questions')
      .select('*')
      .eq('certification_id', cert.id)
      .eq('is_active', true);

    const activeTopic = targetTopicId || (selectedTopicId !== 'all' ? selectedTopicId : null);
    if (activeTopic) {
      query = query.eq('topic_id', activeTopic);
    } else if (selectedDomainId !== 'all') {
      query = query.eq('domain_id', selectedDomainId);
    }

    if (selectedDifficulty !== 'all' && mode === 'custom') {
      query = query.eq('difficulty', selectedDifficulty);
    }

    if (verifiedOnly && mode === 'custom') {
      query = query.eq('source_confidence', 'verified');
    }

    // If Leitner drill, filter weak question IDs from Dexie
    let targetQuestionIds: string[] = [];
    if (mode === 'leitner_drill') {
      const maxBox = selectedBoxFilter === 'box0' ? 0 : selectedBoxFilter === 'box1' ? 1 : 2;
      const weakProgress = await db.userProgress
        .where('box_level')
        .belowOrEqual(maxBox)
        .toArray();
      targetQuestionIds = weakProgress.map((p) => p.question_id);
    }

    if (targetQuestionIds.length > 0) {
      query = query.in('id', targetQuestionIds);
    }

    const { data: questionsData, error } = await query.limit(150);

    if (error || !questionsData || questionsData.length === 0) {
      // Fallback to general pool if no specific Leitner/case study records
      const { data: fallbackData } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', cert.id)
        .limit(qCount);

      if (!fallbackData || fallbackData.length === 0) {
        alert('No questions found matching your filter criteria.');
        setIsLaunching(false);
        return;
      }

      await startQuiz(
        fallbackData,
        mode === 'exam_sim' ? 'exam_sim' : 'practice',
        durationSeconds,
        cert.id,
        selectedDomainId !== 'all' ? selectedDomainId : null,
        feedbackPolicy
      );
      setIsLaunching(false);
      navigate('/quiz');
      return;
    }

    // Shuffle questions
    const shuffled: Question[] = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(qCount, questionsData.length));

    await startQuiz(
      shuffled,
      mode === 'exam_sim' ? 'exam_sim' : 'practice',
      durationSeconds,
      cert.id,
      selectedDomainId !== 'all' ? selectedDomainId : null,
      feedbackPolicy
    );

    setIsLaunching(false);
    navigate('/quiz');
  };

  const currentCert = certifications.find(c => c.slug === selectedCertSlug);

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      
      {/* Header Banner */}
      <div className="practice-header-banner">
        <div>
          <div className="learn-header-badge">
            <span>⚡</span> Adaptive Practice Center
          </div>
          <h1 className="learn-header-title">
            {currentCert?.name || 'Practice & Exam Simulator'}
          </h1>
          <p className="learn-header-desc">
            Access over <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{totalQuestionsInBank.toLocaleString()}</strong> verified CISA questions with full rationales, compressed exam pacing, and 5-Box Leitner spaced-repetition.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="cert-tabs-bar">
          {certifications.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCertSlug(c.slug)}
              className={`cert-tab-btn ${selectedCertSlug === c.slug ? 'active' : ''}`}
            >
              🎯 {c.code || c.slug.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Practice Modes */}
      <div className="practice-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        
        {/* Card 1: Quick Daily Drill */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box">
              ⏱️
            </div>
            <h3 className="practice-card-title">Quick 10-Question Drill</h3>
            <p className="practice-card-desc">
              Rapid, high-yield practice session with instant answer feedback and detailed rationales. Compressed ~82s/question pacing.
            </p>
          </div>
          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('quick')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Start Quick Drill ➔
          </button>
        </div>

        {/* Card 2: Spaced Repetition Weak-Spot Drill */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box" style={{ backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}>
              🧠
            </div>
            <h3 className="practice-card-title">Adaptive Leitner Drill</h3>
            <p className="practice-card-desc">
              Focuses on missed and Box 0–2 questions until reaching 80% mastery across 3 consecutive attempts (§7.4).
            </p>

            <div style={{ marginTop: 'var(--space-2)' }}>
              <select
                value={selectedBoxFilter}
                onChange={(e) => setSelectedBoxFilter(e.target.value)}
                className="input"
                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                <option value="all">All Weak Spots (Boxes 0–2)</option>
                <option value="box0">Box 0: Immediate Missed Only</option>
                <option value="box1">Box 1: Needs 2nd Confirmation</option>
              </select>
            </div>
          </div>
          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('leitner_drill')}
            className="btn btn-secondary"
            style={{ width: '100%', borderColor: '#d97706', color: '#92400e', marginTop: 'var(--space-3)' }}
          >
            Review Weak Spots ➔
          </button>
        </div>

        {/* Card 3: Full 150Q Exam Simulation */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-primary-100)', borderColor: 'var(--color-primary-200)' }}>
              🎯
            </div>
            <h3 className="practice-card-title">Full 150Q Exam Simulation</h3>
            <p className="practice-card-desc">
              Complete 150-question mock exam timed at 240 minutes under strict exam conditions (delayed feedback, scaled 200–800 scoring).
            </p>
          </div>
          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('exam_sim')}
            className="btn btn-primary"
            style={{ width: '100%', backgroundColor: 'var(--color-primary-hover)' }}
          >
            Launch Exam Simulator ➔
          </button>
        </div>

        {/* Card 4: Official Case Studies Simulator */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-info)', color: 'var(--color-info)' }}>
              📑
            </div>
            <h3 className="practice-card-title">Official Case Studies</h3>
            <p className="practice-card-desc">
              Multi-question complex scenario case studies assessing enterprise audit dilemmas, BIA analysis, cloud migration, and forensic response.
            </p>
          </div>
          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('case_study')}
            className="btn btn-primary"
            style={{ width: '100%', backgroundColor: 'var(--color-info)', borderColor: 'var(--color-info)' }}
          >
            Practice Case Studies ➔
          </button>
        </div>

        {/* Card 5: 60-Topic Targeted Drill */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)', color: 'var(--color-primary)' }}>
              🎯
            </div>
            <h3 className="practice-card-title">Targeted Topic Drill</h3>
            <p className="practice-card-desc">
              Focus specifically on any of the 60 canonical syllabus topics (1A1 through 5B6) with 10 instant practice questions.
            </p>

            <div style={{ marginTop: 'var(--space-2)' }}>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="input"
                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                <option value="all">Select from 60 Canonical Topics...</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.topic_code}] {t.name.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('topic_drill')}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'var(--space-3)' }}
          >
            Start Topic Drill ➔
          </button>
        </div>

        {/* Card 6: Custom Practice Builder */}
        <div className="practice-mode-card">
          <div>
            <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success-border)' }}>
              ⚙️
            </div>
            <h3 className="practice-card-title">Custom Practice Session</h3>
            
            {/* Domain Filter */}
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '2px' }}>
                Domain
              </label>
              <select
                value={selectedDomainId}
                onChange={(e) => setSelectedDomainId(e.target.value)}
                className="input"
                style={{ width: '100%', fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                <option value="all">All Domains (Comprehensive)</option>
                {domains.map(d => (
                  <option key={d.id} value={d.id}>
                    Domain {d.domain_number}: {d.name.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Questions Count Pills */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-ink-muted)' }}>
                  Questions ({questionCount})
                </label>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[5, 10, 20, 30, 50].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`btn btn-sm ${questionCount === count ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      flex: 1,
                      minWidth: '40px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {count}Q
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '2px' }}>
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input"
                style={{ width: '100%', fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Verified Only Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <label htmlFor="verifiedOnly" style={{ fontSize: '11px', color: 'var(--color-ink)', cursor: 'pointer' }}>
                Verified Corroborated Keys Only (§7.5)
              </label>
            </div>
          </div>

          <button
            disabled={isLaunching}
            onClick={() => handleLaunchPractice('custom')}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Build Custom Quiz ➔
          </button>
        </div>

      </div>
    </div>
  );
}
