/* ===================================================================
   APILIGU LEARNING PASS — Insights & Readiness Diagnostic Page
   Real-time live analytics across ALL certifications.
   Zero mock data, zero synthetic fallbacks, clear empty states.
   =================================================================== */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useProgressStore } from '../stores/progressStore';
import { useLessonProgressStore } from '../stores/lessonProgressStore';
import { useQuizStore } from '../stores/quizStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { CompositeReadinessGauge } from '../components/insights/CompositeReadinessGauge';
import {
  calculateCompositeReadiness,
  launchDiagnosticExam,
  getTargetExamDate,
} from '../lib/scoring/readinessGauge';
import type { Certification } from '../types';

export default function InsightsPage() {
  const navigate = useNavigate();
  const { startQuiz } = useQuizStore();
  const { activeCertificationSlug, setActiveCertification, user } = useAuthStore();
  const completedSubtopicsCount = useLessonProgressStore((state) => state.completedSubtopicIds.size);

  const {
    activeCertificationId,
    totalAttempted,
    overallAccuracy,
    totalStudyMinutes,
    streakDays,
    reviewDueCount,
    predictedScaledScore,
    irtEstimate,
    averagePacingSeconds,
    recentSessions,
    domainSummaries,
    topicSummaries,
    incorrectQuestions,
    boxCounts,
    weeklyStudyMinutes,
    isLoading,
    refreshProgress,
  } = useProgressStore();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCertSlug, setSelectedCertSlug] = useState<string>(activeCertificationSlug || 'cisa');
  const [targetExamDate, setTargetExamDate] = useState<string | null>(() => getTargetExamDate(selectedCertSlug));
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'mistakes'>('overview');
  const [topicSearchTerm, setTopicSearchTerm] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<number | 'all'>('all');

  // Sync target exam date when selected cert changes
  useEffect(() => {
    setTargetExamDate(getTargetExamDate(selectedCertSlug));
  }, [selectedCertSlug]);

  // Load available certifications
  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data && data.length > 0) {
        setCertifications(data);
      }
    }
    loadCerts();
  }, []);

  // Sync with global auth store certification
  useEffect(() => {
    if (activeCertificationSlug && activeCertificationSlug !== selectedCertSlug) {
      setSelectedCertSlug(activeCertificationSlug);
    }
  }, [activeCertificationSlug, selectedCertSlug]);

  // Refresh live progress whenever selected certification changes
  useEffect(() => {
    refreshProgress(selectedCertSlug);
  }, [selectedCertSlug, refreshProgress]);

  const currentCert = certifications.find((c) => c.slug === selectedCertSlug);

  // Radar data: Domain proficiency vs 80% pass benchmark
  const radarData = domainSummaries.map((d) => ({
    subject: `D${d.domainNumber}`,
    fullName: d.name,
    accuracy: d.accuracy || 0,
    target: 80,
  }));

  // Leitner box data from real records
  const boxChartData = [
    { name: 'Box 0 (Missed)', count: boxCounts[0], fill: 'var(--color-error)' },
    { name: 'Box 1 (Review)', count: boxCounts[1], fill: 'var(--color-warning)' },
    { name: 'Box 2 (Learning)', count: boxCounts[2], fill: 'var(--color-primary-light)' },
    { name: 'Box 3 (Mastered)', count: boxCounts[3], fill: 'var(--color-success)' },
    { name: 'Box 4 (Retained)', count: boxCounts[4], fill: 'var(--color-primary)' },
  ];

  // Session trend data from real sessions
  const sessionTrendData = recentSessions
    .slice()
    .reverse()
    .map((s, idx) => ({
      session: `#${idx + 1}`,
      score: s.score_percent || 0,
      passing: 80,
      date: s.started_at ? new Date(s.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
    }));

  // Filter topics for the active certification
  const filteredTopics = useMemo(() => {
    return topicSummaries.filter((t) => {
      const matchDomain = selectedDomainFilter === 'all' || t.domainNumber === selectedDomainFilter;
      const matchSearch = !topicSearchTerm.trim() || (
        t.topicCode.toLowerCase().includes(topicSearchTerm.toLowerCase()) ||
        t.name.toLowerCase().includes(topicSearchTerm.toLowerCase())
      );
      return matchDomain && matchSearch;
    });
  }, [topicSummaries, selectedDomainFilter, topicSearchTerm]);

  // Launch a topic drill directly from Insights
  const handleLaunchTopicDrill = async (topicId: string, domainId: string) => {
    const certId = activeCertificationId || 'a0000000-0000-0000-0000-000000000001';
    let query = supabase.from('questions').select('*').eq('certification_id', certId).eq('is_active', true);
    if (topicId) query = query.eq('topic_id', topicId);
    else if (domainId) query = query.eq('domain_id', domainId);

    const { data: qData } = await query.limit(10);
    const questions = qData && qData.length > 0 ? qData : [];

    if (questions.length > 0) {
      await startQuiz(questions, 'topic_drill', 600, certId, domainId || null, 'immediate');
      navigate('/quiz');
    }
  };

  // Launch a retry for a specific incorrect question
  const handleRetryQuestion = async (question: any) => {
    await startQuiz([question], 'practice', 120, question.certification_id, question.domain_id, 'immediate');
    navigate('/quiz');
  };

  // Compute Unified Composite Readiness Index (Testing 55%, Syllabus 25%, Leitner 20%)
  const compositeReadiness = useMemo(() => {
    return calculateCompositeReadiness({
      certSlug: selectedCertSlug,
      irtEstimate,
      totalAttempted,
      overallAccuracy,
      boxCounts,
      totalCertQuestions: 5000,
      totalSubtopics: topicSummaries.length > 0 ? topicSummaries.length : 0,
      completedSubtopicsCount,
      targetExamDate,
    });
  }, [
    selectedCertSlug,
    irtEstimate,
    totalAttempted,
    overallAccuracy,
    boxCounts,
    topicSummaries.length,
    completedSubtopicsCount,
    targetExamDate,
  ]);

  // Start 20-Question Adaptive Baseline Diagnostic Exam
  const handleStartDiagnostic = async () => {
    const certId = currentCert?.id || activeCertificationId || 'a0000000-0000-0000-0000-000000000001';
    await launchDiagnosticExam(certId, startQuiz, navigate);
  };

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      
      {/* Header Banner */}
      <div className="learn-header-banner">
        <div>
          <div className="learn-header-badge" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <span>📈</span> Real-Time Diagnostic Intelligence &amp; Analytics
            {user && (
              <span style={{ opacity: 0.85, fontWeight: 'normal', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '8px' }}>
                👤 {user.full_name || user.email}
              </span>
            )}
          </div>
          <h1 className="learn-header-title">
            {currentCert?.name || 'Certification'} Performance Insights
          </h1>
          <p className="learn-header-desc">
            Live accuracy tracking, domain mastery radar, {topicSummaries.length}-topic diagnostic matrix, Leitner memory retention, and mistake notebook computed from your actual test history.
          </p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="segmented-nav mt-4" style={{ display: 'inline-flex' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`segmented-pill ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <span>📊</span> Overview
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`segmented-pill ${activeTab === 'topics' ? 'active' : ''}`}
          >
            <span>🌳</span> Topic Matrix ({topicSummaries.length})
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`segmented-pill ${activeTab === 'mistakes' ? 'active' : ''}`}
          >
            <span>📓</span> Mistake Vault ({incorrectQuestions.length})
          </button>
        </div>
      </div>

      {/* Track Switcher Toolbar */}
      <div className="learn-toolbar" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div className="cert-tabs-bar">
          {certifications.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCertSlug(c.slug);
                setActiveCertification(c.slug);
                setTopicSearchTerm('');
                setSelectedDomainFilter('all');
              }}
              className={`cert-tab-btn ${selectedCertSlug === c.slug ? 'active' : ''}`}
            >
              🎯 {c.code || c.name.split('—')[0].trim()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={handleStartDiagnostic}
            className="btn btn-primary btn-sm"
            style={{ fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>⚡ Start Diagnostic Drill</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <div className="animate-spin" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>
            ⟳
          </div>
          <p className="text-muted" style={{ marginTop: 'var(--space-3)' }}>Calculating live performance metrics...</p>
        </div>
      ) : (
        <>
          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: EXECUTIVE OVERVIEW & CHARTS                           */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              
              {/* Unified Composite Readiness Gauge & Pacing Cockpit */}
              <CompositeReadinessGauge
                readiness={compositeReadiness}
                certSlug={selectedCertSlug}
                certCode={currentCert?.code || 'CERT'}
                onRefresh={() => {
                  setTargetExamDate(getTargetExamDate(selectedCertSlug));
                  refreshProgress(selectedCertSlug);
                }}
                onStartDiagnostic={handleStartDiagnostic}
              />

              {/* Key KPI Stats Grid */}
              <div className="dashboard-stats mb-6">
                {/* KPI 1: AI IRT Predicted Scaled Score */}
                <div className="card stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="stat-label">AI Scaled Score (IRT 2PL)</span>
                    {predictedScaledScore !== null ? (
                      <span className={`badge ${predictedScaledScore >= 450 ? 'badge-success' : 'badge-warning'}`}>
                        {predictedScaledScore >= 450 ? '✓ Passing (≥450)' : 'Below 450 Target'}
                      </span>
                    ) : (
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        Diagnostic Needed
                      </span>
                    )}
                  </div>
                  <div className={`stat-value ${predictedScaledScore && predictedScaledScore >= 450 ? 'text-success' : 'text-primary'}`} style={{ fontSize: '2rem' }}>
                    {predictedScaledScore !== null ? (
                      <>
                        {predictedScaledScore} <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>/ 800</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-ink-muted)' }}>—</span>
                    )}
                  </div>
                  {irtEstimate && (
                    <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>95% CI: [{irtEstimate.confidenceIntervalLow}–{irtEstimate.confidenceIntervalHigh}]</span>
                      <span style={{ fontWeight: 600, color: irtEstimate.passingProbability >= 0.8 ? 'var(--color-success)' : undefined }}>
                        {Math.round(irtEstimate.passingProbability * 100)}% Pass Prob
                      </span>
                    </div>
                  )}
                  <div className="progress-bar progress-bar-sm" style={{ marginTop: 'var(--space-2)' }}>
                    <div
                      className={`progress-bar-fill ${predictedScaledScore && predictedScaledScore >= 450 ? 'success' : 'warning'}`}
                      style={{ width: predictedScaledScore ? `${Math.min(100, Math.max(0, ((predictedScaledScore - 200) / 600) * 100))}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* KPI 2: Overall Accuracy */}
                <div className="card stat-card">
                  <span className="stat-label">Overall Accuracy</span>
                  <div className="stat-value text-primary">
                    {totalAttempted > 0 ? `${overallAccuracy}%` : '—'}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>
                    {totalAttempted > 0 ? `${totalAttempted} unique questions attempted` : '0 questions answered yet'}
                  </div>
                </div>

                {/* KPI 3: Study Time & Streak */}
                <div className="card stat-card">
                  <span className="stat-label">Study Time &amp; Streak</span>
                  <div className="stat-value">
                    {totalStudyMinutes}m
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>
                    {streakDays} active study streak day{streakDays !== 1 ? 's' : ''} • {reviewDueCount} due
                  </div>
                </div>

                {/* KPI 4: Response Pacing Velocity */}
                <div className="card stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="stat-label">Pacing Velocity</span>
                    <span className={`badge ${averagePacingSeconds && averagePacingSeconds <= 82 ? 'badge-success' : 'badge-neutral'}`}>
                      Goal: ≤82s/Q
                    </span>
                  </div>
                  <div className="stat-value" style={{ color: averagePacingSeconds && averagePacingSeconds <= 82 ? 'var(--color-success)' : undefined }}>
                    {averagePacingSeconds !== null ? `${averagePacingSeconds}s` : '—'}
                    {averagePacingSeconds !== null && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}> / question</span>}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>
                    {averagePacingSeconds !== null ? 'Target: 150 Qs in 240 mins' : 'No timed sessions recorded'}
                  </div>
                </div>
              </div>

              {/* Charts Grid: Radar + Spaced Repetition + Study Velocity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                
                {/* Chart 1: Radar Chart */}
                <div className="card chart-card">
                  <div className="card-header flex items-center justify-between">
                    <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>Domain Blueprint Proficiency</span>
                    <span className="badge badge-primary">Pass Mark: 80%</span>
                  </div>
                  <div className="card-body" style={{ minHeight: '290px', padding: 'var(--space-2)' }}>
                    {radarData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={270}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="var(--border-color)" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'var(--color-ink)', fontSize: 11, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--color-ink-subtle)" />
                          <Radar
                            name="Your Accuracy (%)"
                            dataKey="accuracy"
                            stroke="var(--color-primary-light)"
                            fill="var(--color-primary-light)"
                            fillOpacity={0.45}
                          />
                          <Radar
                            name="Pass Mark (80%)"
                            dataKey="target"
                            stroke="var(--color-error)"
                            fill="none"
                            strokeDasharray="4 4"
                          />
                          <Tooltip
                            formatter={(value: any, name: any) => [`${value}%`, name]}
                            contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-muted" style={{ padding: 'var(--space-12)' }}>
                        No domains configured for this track.
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 2: Leitner Box Distribution */}
                <div className="card chart-card">
                  <div className="card-header flex items-center justify-between">
                    <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>5-Box Leitner Memory Retention</span>
                    <span className="badge badge-success">Box 3+ = Mastered</span>
                  </div>
                  <div className="card-body" style={{ minHeight: '290px', padding: 'var(--space-2)' }}>
                    <ResponsiveContainer width="100%" height={270}>
                      <BarChart data={boxChartData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                        <XAxis type="number" stroke="var(--color-ink-muted)" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={115} tick={{ fontSize: 10 }} stroke="var(--color-ink)" />
                        <Tooltip
                          formatter={(value: any) => [`${value} questions`, 'Count']}
                          contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {boxChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Weekly Study Minutes Velocity */}
                <div className="card chart-card">
                  <div className="card-header flex items-center justify-between">
                    <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>7-Day Study Velocity History</span>
                    <span className="badge badge-neutral">Actual Minutes</span>
                  </div>
                  <div className="card-body" style={{ minHeight: '290px', padding: 'var(--space-2)' }}>
                    <ResponsiveContainer width="100%" height={270}>
                      <BarChart data={weeklyStudyMinutes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="day" stroke="var(--color-ink-muted)" tick={{ fontSize: 11 }} />
                        <YAxis stroke="var(--color-ink-muted)" tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(val: any) => [`${val} min`, 'Study Time']}
                          contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="minutes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Session Score Trend Line Chart */}
              {sessionTrendData.length > 0 && (
                <div className="card chart-card mb-6">
                  <div className="card-header flex items-center justify-between">
                    <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>Score History Across Recent Practice Sessions</span>
                    <span className="badge badge-success">Target: ≥ 80%</span>
                  </div>
                  <div className="card-body" style={{ minHeight: '250px', padding: 'var(--space-4)' }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={sessionTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="session" stroke="var(--color-ink-muted)" />
                        <YAxis domain={[0, 100]} stroke="var(--color-ink-muted)" tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          formatter={(val: any) => [`${val}%`, 'Score']}
                          contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="var(--color-primary)"
                          strokeWidth={3}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="passing"
                          stroke="var(--color-success)"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Domain Breakdown Section */}
              <div className="mb-6">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-3)' }}>
                  Domain-by-Domain Examination Readiness
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {domainSummaries.length === 0 ? (
                    <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                      <p className="text-muted">No domains found for this certification track.</p>
                    </div>
                  ) : (
                    domainSummaries.map((d) => {
                      const isTargetMet = d.attempted > 0 && d.accuracy >= 80;
                      return (
                        <div key={d.domainId} className="card" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: 'var(--color-primary)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: 'var(--text-sm)',
                                  flexShrink: 0,
                                }}
                              >
                                D{d.domainNumber}
                              </div>
                              <div>
                                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
                                  Domain {d.domainNumber}: {d.name}
                                </h4>
                                <div className="text-xs text-muted" style={{ display: 'flex', gap: 'var(--space-3)', marginTop: '2px', flexWrap: 'wrap' }}>
                                  <span>Weight: <strong>{d.weight}%</strong></span>
                                  <span>Attempted: <strong>{d.attempted}</strong> Qs</span>
                                  <span>Mastered: <strong>{d.masteredCount}</strong> in Box 3+</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <div className="text-right">
                                <div className={`text-mono font-bold ${d.attempted === 0 ? 'text-muted' : isTargetMet ? 'text-success' : 'text-primary'}`} style={{ fontSize: 'var(--text-base)' }}>
                                  {d.attempted > 0 ? `${d.accuracy}%` : 'Unseen'}
                                </div>
                                <span className={`badge ${d.attempted === 0 ? 'badge-neutral' : isTargetMet ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                                  {d.attempted === 0 ? 'Not Started' : isTargetMet ? '✓ Pass Ready' : 'In Progress'}
                                </span>
                              </div>

                              <button
                                onClick={() => handleLaunchTopicDrill('', d.domainId)}
                                className="btn btn-secondary btn-sm"
                              >
                                ⚡ Practice
                              </button>
                            </div>
                          </div>

                          <div className="progress-bar progress-bar-sm" style={{ marginTop: 'var(--space-3)' }}>
                            <div
                              className={`progress-bar-fill ${
                                d.attempted === 0 ? 'neutral' : d.accuracy >= 80 ? 'success' : d.accuracy >= 60 ? 'warning' : 'error'
                              }`}
                              style={{ width: `${d.attempted > 0 ? Math.min(100, d.accuracy) : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: TOPIC MASTERY MATRIX                                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'topics' && (
            <div className="animate-fade-in">
              <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
                      {topicSummaries.length} Canonical Topic Mastery Matrix
                    </h3>
                    <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                      Real-time topic accuracy, Leitner memory box tier, and questions attempted for {currentCert?.name || 'this track'}.
                    </p>
                  </div>

                  {/* Domain Filter Pills */}
                  <div className="cert-tabs-bar">
                    <button
                      onClick={() => setSelectedDomainFilter('all')}
                      className={`cert-tab-btn ${selectedDomainFilter === 'all' ? 'active' : ''}`}
                    >
                      All Domains ({topicSummaries.length})
                    </button>
                    {domainSummaries.map((dm) => (
                      <button
                        key={dm.domainId}
                        onClick={() => setSelectedDomainFilter(dm.domainNumber)}
                        className={`cert-tab-btn ${selectedDomainFilter === dm.domainNumber ? 'active' : ''}`}
                      >
                        Domain {dm.domainNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={topicSearchTerm}
                  onChange={(e) => setTopicSearchTerm(e.target.value)}
                  placeholder="🔍 Search topics by code (e.g. 1.1, 5.3, IAM, BIA) or title..."
                  className="input"
                  style={{ fontSize: 'var(--text-xs)' }}
                />
              </div>

              {/* Topics List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {filteredTopics.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p className="text-muted">No topics matched your search filter for this certification.</p>
                  </div>
                ) : (
                  filteredTopics.map((top) => {
                    const statusBadge =
                      top.status === 'mastered'
                        ? { label: '✓ Mastered', class: 'badge-success' }
                        : top.status === 'reviewing'
                        ? { label: 'Reviewing', class: 'badge-warning' }
                        : top.status === 'needs_practice'
                        ? { label: 'Needs Practice', class: 'badge-error' }
                        : { label: 'Unseen', class: 'badge-neutral' };

                    return (
                      <div
                        key={top.topicId}
                        className="card"
                        style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                          <span className="topic-code-tag" style={{ fontSize: '11px', flexShrink: 0 }}>
                            {top.topicCode}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {top.name}
                            </div>
                            <div className="text-xs text-muted" style={{ display: 'flex', gap: 'var(--space-2)', marginTop: '2px' }}>
                              <span>D{top.domainNumber} Part {top.part}</span>
                              <span>•</span>
                              <span>{top.totalQuestions} Qs in bank</span>
                              {top.attempted > 0 ? (
                                <>
                                  <span>•</span>
                                  <span>{top.attempted} attempted</span>
                                </>
                              ) : (
                                <>
                                  <span>•</span>
                                  <span style={{ fontStyle: 'italic' }}>Not attempted yet</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                          <div className="text-right">
                            <div className="text-mono font-bold text-xs">
                              {top.attempted > 0 ? `${top.accuracy}%` : '—'}
                            </div>
                            <span className={`badge ${statusBadge.class}`} style={{ fontSize: '10px' }}>
                              {statusBadge.label}
                            </span>
                          </div>

                          <button
                            onClick={() => handleLaunchTopicDrill(top.topicId, top.domainId)}
                            className="btn btn-primary btn-sm"
                            style={{ minHeight: '32px', padding: '4px 10px', fontSize: '11px' }}
                          >
                            ⚡ Practice
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: MISTAKE NOTEBOOK                                       */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'mistakes' && (
            <div className="animate-fade-in">
              <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
                  📓 Targeted Mistake Notebook ({incorrectQuestions.length})
                </h3>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                  Review real questions answered incorrectly in recent practice sessions to reinforce key principles and achieve permanent retention.
                </p>
              </div>

              {incorrectQuestions.length === 0 ? (
                <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>
                    No Active Mistakes in {currentCert?.code || 'Track'} Notebook!
                  </h4>
                  <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: '4px', maxWidth: '460px', margin: '4px auto 16px auto' }}>
                    You have answered all attempted questions correctly or reviewed your missed items. Launch a practice drill to test new concepts.
                  </p>
                  <button
                    onClick={handleStartDiagnostic}
                    className="btn btn-primary btn-sm"
                  >
                    ⚡ Start Practice Set
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {incorrectQuestions.map((item, idx) => {
                    const q = item.question;
                    if (!q) return null;
                    return (
                      <div key={item.questionId || idx} className="card" style={{ padding: 'var(--space-5)', borderLeft: '4px solid var(--color-error)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span className="badge badge-error">
                              Missed {item.timesIncorrect}x
                            </span>
                            <span className="text-xs text-muted">
                              Box {item.boxLevel} • Seen {item.timesSeen}x
                            </span>
                          </div>

                          <button
                            onClick={() => handleRetryQuestion(q)}
                            className="btn btn-primary btn-sm"
                            style={{ minHeight: '32px', fontSize: '11px' }}
                          >
                            ⚡ Retry Question
                          </button>
                        </div>

                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
                          {q.stem}
                        </h4>

                        {/* Correct Option Highlight */}
                        <div style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'var(--weight-bold)', color: 'var(--color-success)', textTransform: 'uppercase' }}>
                            ✓ Correct Answer: Option {q.correct_answer}
                          </span>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', marginTop: '2px', margin: 0 }}>
                            {q.correct_answer === 'A' ? q.option_a : q.correct_answer === 'B' ? q.option_b : q.correct_answer === 'C' ? q.option_c : q.option_d}
                          </p>
                        </div>

                        {/* Rationale */}
                        {q.rationale && (
                          <div style={{ backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
                            <strong>Exam Rationale:</strong> {q.rationale}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
