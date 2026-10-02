/* ===================================================================
   APILIGU LEARNING PASS — QuizPage Component
   Full quiz player supporting immediate feedback, timing,
   question switching, answer persistence, formula lookup, and exam submission.
   =================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import QuestionCard from '../components/quiz/QuestionCard';
import Timer from '../components/quiz/Timer';
import QuizProgress from '../components/quiz/QuizProgress';
import ReviewGrid from '../components/quiz/ReviewGrid';
import { calculateTimeLimit, CISA_PROFILES } from '../lib/timer';
import { supabase } from '../lib/supabase';
import type { Question } from '../types';

// Authoritative 28th Edition seed questions for instant offline practice
const SAMPLE_CISA_QUESTIONS: Question[] = [
  {
    id: 'sample-q-1',
    certification_id: 'a0000000-0000-0000-0000-000000000001',
    domain_id: 'd0000000-0000-0000-0000-000000000001',
    topic_id: null,
    subtopic_id: null,
    question_number: 1,
    question_type: 'mcq',
    stem: 'Which of the following defines mandatory requirements for information systems audit and assurance practices under ITAF 4th Edition?',
    scenario_text: null,
    option_a: 'ISACA IS Audit and Assurance Guidelines',
    option_b: 'ISACA IS Audit Tools and Techniques',
    option_c: 'ISACA IS Audit and Assurance Standards',
    option_d: 'ISACA Code of Professional Ethics',
    correct_answer: 'C',
    rationale: 'Under ITAF 4th Edition, ISACA IS Audit and Assurance Standards define mandatory requirements for all IS audit engagements. Guidelines provide advisory guidance, while tools/techniques provide procedural steps.',
    incorrect_rationale_a: 'Guidelines provide guidance in applying standards, not mandatory requirements.',
    incorrect_rationale_b: 'Tools and techniques provide operational examples, not mandatory standards.',
    incorrect_rationale_c: null,
    incorrect_rationale_d: 'The Code of Professional Ethics governs personal behavior, while Standards define mandatory engagement requirements.',
    difficulty: 'medium',
    task_statement: 'T1.1',
    tags: ['IS Audit Standards', 'ITAF 4th Edition', 'Governance'],
    source_reference: 'CISA Review Manual 28th Ed, Section 1.1.1',
    source_confidence: 'verified',
    content_hash: 'hash-sample-1',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-q-2',
    certification_id: 'a0000000-0000-0000-0000-000000000001',
    domain_id: 'd0000000-0000-0000-0000-000000000001',
    topic_id: null,
    subtopic_id: null,
    question_number: 2,
    question_type: 'mcq',
    stem: 'An IS auditor is reviewing an organization’s audit charter. Which of the following is the MOST critical element that must be documented in the charter?',
    scenario_text: null,
    option_a: 'The overall scope, authority, and independent reporting line of the audit function',
    option_b: 'The detailed annual audit schedule and staffing budget',
    option_c: 'The specific Computer-Assisted Audit Techniques (CAATs) to be utilized',
    option_d: 'The minimum academic qualifications for audit staff',
    correct_answer: 'A',
    rationale: 'The audit charter is approved by the audit committee/board and must establish the scope, authority, independence, and reporting responsibilities of the IS internal audit function.',
    incorrect_rationale_a: null,
    incorrect_rationale_b: 'The annual plan is an operational document, not part of the overarching charter.',
    incorrect_rationale_c: 'Tools and techniques are operational decisions for individual assignments.',
    incorrect_rationale_d: 'Staff qualifications are managed through internal HR and training policies.',
    difficulty: 'medium',
    task_statement: 'T1.1',
    tags: ['Audit Charter', 'Authority', 'Planning'],
    source_reference: 'CISA Review Manual 28th Ed, Section 1.1.5',
    source_confidence: 'verified',
    content_hash: 'hash-sample-2',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-q-3',
    certification_id: 'a0000000-0000-0000-0000-000000000001',
    domain_id: 'd0000000-0000-0000-0000-000000000001',
    topic_id: null,
    subtopic_id: null,
    question_number: 3,
    question_type: 'mcq',
    stem: 'When performing a risk-based audit planning process, the PRIMARY reason for assessing inherent risk is to:',
    scenario_text: null,
    option_a: 'Evaluate the operational effectiveness of existing internal controls',
    option_b: 'Identify areas where the risk of material misstatement or control failure is highest before considering controls',
    option_c: 'Calculate the total financial liability of the organization',
    option_d: 'Determine the statistical sample size for substantive compliance testing',
    correct_answer: 'B',
    rationale: 'Inherent risk represents the susceptibility of an audit area to error or fraud in the absence of internal controls. Assessing inherent risk ensures high-exposure areas receive primary audit focus.',
    incorrect_rationale_a: 'Evaluating existing controls is the assessment of control risk.',
    incorrect_rationale_b: null,
    incorrect_rationale_c: 'Audit risk assessment focuses on control risk and materiality, not financial liability.',
    incorrect_rationale_d: 'Sample size depends on detection risk, confidence intervals, and tolerable error rates.',
    difficulty: 'hard',
    task_statement: 'T1.3',
    tags: ['Audit Risk', 'Inherent Risk', 'Planning'],
    source_reference: 'CISA Review Manual 28th Ed, Section 1.3.3',
    source_confidence: 'verified',
    content_hash: 'hash-sample-3',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-q-4',
    certification_id: 'a0000000-0000-0000-0000-000000000001',
    domain_id: 'd0000000-0000-0000-0000-000000000001',
    topic_id: null,
    subtopic_id: null,
    question_number: 4,
    question_type: 'mcq',
    stem: 'In a small organization where the database administrator also develops application code, which of the following is the BEST compensating control?',
    scenario_text: null,
    option_a: 'Enforcing strong MFA passwords for all database accounts',
    option_b: 'Implementing daily independent review and analysis of database audit logs',
    option_c: 'Restricting physical badge access to the server room',
    option_d: 'Purchasing cybersecurity breach insurance',
    correct_answer: 'B',
    rationale: 'A compensating control reduces risk when primary segregation of duties (SoD) cannot be implemented. Independent daily review of audit logs mitigates the risk of unauthorized database changes.',
    incorrect_rationale_a: 'Password policies do not compensate for segregation of duties conflicts.',
    incorrect_rationale_b: null,
    incorrect_rationale_c: 'Physical security does not address logical development conflicts.',
    incorrect_rationale_d: 'Insurance transfers financial impact but does not serve as an internal control.',
    difficulty: 'medium',
    task_statement: 'T1.4',
    tags: ['Compensating Controls', 'Segregation of Duties', 'Internal Controls'],
    source_reference: 'CISA Review Manual 28th Ed, Section 1.4.3',
    source_confidence: 'verified',
    content_hash: 'hash-sample-4',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-q-5',
    certification_id: 'a0000000-0000-0000-0000-000000000001',
    domain_id: 'd0000000-0000-0000-0000-000000000001',
    topic_id: null,
    subtopic_id: null,
    question_number: 5,
    question_type: 'mcq',
    stem: 'An IS auditor wants to evaluate 100% of transaction logs across cloud environments to detect anomalous activity. Which technique is MOST appropriate?',
    scenario_text: null,
    option_a: 'Statistical attribute sampling',
    option_b: 'Generalized Audit Software (GAS) and Computer-Assisted Audit Techniques (CAATs)',
    option_c: 'Manual walkthrough testing',
    option_d: 'Control Self-Assessment (CSA) workshops',
    correct_answer: 'B',
    rationale: 'Generalized Audit Software (GAS) and Computer-Assisted Audit Techniques (CAATs) enable the auditor to perform 100% population analysis efficiently and detect anomalies across complex data sets.',
    incorrect_rationale_a: 'Sampling only evaluates a fraction of the population.',
    incorrect_rationale_b: null,
    incorrect_rationale_c: 'Walkthroughs cannot process complete transaction log populations.',
    incorrect_rationale_d: 'CSA is a management self-evaluation technique, not a data extraction tool.',
    difficulty: 'easy',
    task_statement: 'T1.8',
    tags: ['CAATs', 'Data Analytics', 'Continuous Auditing'],
    source_reference: 'CISA Review Manual 28th Ed, Section 1.8.1',
    source_confidence: 'verified',
    content_hash: 'hash-sample-5',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    sessionId,
    questions,
    currentIndex,
    selectedAnswer,
    isAnswerSubmitted,
    answers,
    flaggedQuestionIds,
    sectionTitle,
    timeLimitSeconds,
    timeRemainingSeconds,
    isTimerRunning,
    isPaused,
    isAutoPausedForReview,
    autoPauseSource,
    feedbackPolicy,
    isCompleted,
    result,
    startQuiz,
    selectOption,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    toggleFlag,
    pauseQuiz,
    resumeQuiz,
    setReviewPause,
    tickTimer,
    finishQuiz,
    resetQuiz,
  } = useQuizStore();

  const [showGridModal, setShowGridModal] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);

  // Navigate to results when completed
  useEffect(() => {
    if (isCompleted && result) {
      navigate('/results');
    }
  }, [isCompleted, result, navigate]);

  // Load questions if not yet in store
  const handleStartQuickCheck = async () => {
    try {
      const { data: liveQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      const targetPool = liveQuestions && liveQuestions.length >= 5 ? liveQuestions : SAMPLE_CISA_QUESTIONS;
      const shuffled: Question[] = [...targetPool].sort(() => Math.random() - 0.5);
      const timeSec = calculateTimeLimit(CISA_PROFILES.quickCheck(shuffled.length));
      
      await startQuiz(
        shuffled,
        'quick_check',
        timeSec,
        shuffled[0].certification_id,
        shuffled[0].domain_id || null,
        'immediate'
      );
    } catch {
      const timeSec = calculateTimeLimit(CISA_PROFILES.quickCheck(SAMPLE_CISA_QUESTIONS.length));
      await startQuiz(
        SAMPLE_CISA_QUESTIONS,
        'quick_check',
        timeSec,
        'a0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'immediate'
      );
    }
  };

  if (!sessionId || questions.length === 0) {
    return (
      <div className="quiz-page" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="card text-center">
          <div className="card-body">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎯</div>
            <h2 className="mb-2">Ready to Practice?</h2>
            <p className="text-muted mb-6">
              Test your knowledge on CISA Domain 1 with instant rationale feedback and timer compression.
            </p>
            <div className="flex flex-col gap-3 max-w-content mx-auto">
              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={handleStartQuickCheck}
              >
                ⚡ Start 5-Question Quick Check (Immediate Feedback)
              </button>
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => navigate('/practice')}
              >
                View All Practice Modes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isFlagged = flaggedQuestionIds.has(currentQ.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const answeredTotal = Object.values(answers).filter((a) => a.status === 'answered').length;

  return (
    <div className="quiz-page" style={{ paddingBottom: 'calc(var(--safe-bottom) + 90px)' }}>
      {/* Header bar: Timer + Formula + Finish */}
      <div className="quiz-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-3)' }}>
        <Timer
          totalSeconds={timeLimitSeconds}
          remainingSeconds={timeRemainingSeconds}
          questionsAnswered={answeredTotal}
          totalQuestions={questions.length}
          isRunning={isTimerRunning}
          isPaused={isPaused}
          isAutoPaused={isAutoPausedForReview}
          autoPauseSource={autoPauseSource}
          onTick={tickTimer}
          onPause={pauseQuiz}
          onResume={resumeQuiz}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setReviewPause(true, 'formula_drawer');
              setShowFormulaDrawer(true);
            }}
            title="Formula Reference Sheet"
          >
            🧮 Formulas
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              setReviewPause(true, 'stop_quiz');
              setShowStopModal(true);
            }}
            title="Stop or Abandon Quiz Session"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderColor: '#ef4444',
              color: '#ef4444',
              fontWeight: 'bold',
            }}
          >
            <span>⏹</span>
            <span>Stop Quiz</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setReviewPause(true, 'confirm_finish');
              setShowConfirmFinish(true);
            }}
          >
            Finish Exam
          </button>
        </div>
      </div>

      {/* Section Practice Context Banner */}
      {sectionTitle && (
        <div
          className="animate-fade-in"
          style={{
            marginBottom: 'var(--space-3)',
            padding: '8px 14px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🎯</span>
            <span>
              Practicing Section: <strong>{sectionTitle}</strong>
            </span>
          </div>
          <span className="badge badge-primary font-mono" style={{ fontSize: '10px' }}>
            {questions.length} Questions
          </span>
        </div>
      )}

      {/* Progress & Flag bar */}
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        isFlagged={isFlagged}
        onToggleFlag={() => toggleFlag(currentQ.id)}
        onOpenReviewGrid={() => {
          setReviewPause(true, 'grid_modal');
          setShowGridModal(true);
        }}
      />

      {/* Active Question Card */}
      <QuestionCard
        question={currentQ}
        selectedOption={selectedAnswer}
        isSubmitted={isAnswerSubmitted}
        showFeedback={feedbackPolicy === 'immediate'}
        onSelectOption={selectOption}
      />

      {/* Sticky Mobile / Desktop Action Bar */}
      <div className="mobile-action-bar">
        {/* Left: Flag Toggle */}
        <button
          type="button"
          onClick={() => toggleFlag(currentQ.id)}
          className={`btn btn-sm ${isFlagged ? 'btn-warning' : 'btn-secondary'}`}
          style={{ minHeight: '42px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title={isFlagged ? 'Flagged for Review' : 'Flag Question'}
          aria-label={isFlagged ? 'Remove Flag' : 'Flag for Review'}
        >
          <span>🚩</span>
          <span className="desktop-only">{isFlagged ? 'Flagged' : 'Flag'}</span>
        </button>

        {/* Center: Question Matrix Drawer Toggle */}
        <button
          type="button"
          onClick={() => {
            setReviewPause(true, 'grid_modal');
            setShowGridModal(true);
          }}
          className="btn btn-secondary btn-sm"
          style={{ minHeight: '42px', padding: '0 12px', fontWeight: 'bold' }}
          title="Open Question Navigator"
        >
          📑 {currentIndex + 1} / {questions.length}
        </button>

        {/* Right: Prev & Next/Submit Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={isFirstQuestion}
            onClick={prevQuestion}
            style={{ minHeight: '42px', padding: '0 12px' }}
          >
            ← Prev
          </button>

          {!isAnswerSubmitted && selectedAnswer && feedbackPolicy === 'immediate' ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => submitAnswer()}
              style={{ minHeight: '42px', padding: '0 16px', fontWeight: 'bold' }}
            >
              Submit ✓
            </button>
          ) : !isLastQuestion ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={nextQuestion}
              style={{ minHeight: '42px', padding: '0 16px', fontWeight: 'bold' }}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => setShowConfirmFinish(true)}
              style={{ minHeight: '42px', padding: '0 16px', fontWeight: 'bold' }}
            >
              Finish ✓
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator Modal */}
      {showGridModal && (
        <div className="modal-backdrop" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <ReviewGrid
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              flaggedIds={flaggedQuestionIds}
              onSelectIndex={(idx) => {
                goToQuestion(idx);
                setReviewPause(false);
                setShowGridModal(false);
              }}
              onClose={() => {
                setReviewPause(false);
                setShowGridModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Formula & Calculator Reference Drawer */}
      {showFormulaDrawer && (
        <div className="modal-backdrop" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧮</span>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Exam Formula Reference</h3>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setReviewPause(false);
                  setShowFormulaDrawer(false);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div className="card card-body" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)' }}>
                <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-sm)' }}>Risk Assessment &amp; ALE</h4>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>
                  ALE = SLE × ARO<br />
                  SLE = AV (Asset Value) × EF (Exposure Factor)
                </div>
              </div>

              <div className="card card-body" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)' }}>
                <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-sm)' }}>Overall Audit Risk Model</h4>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>
                  Audit Risk = Inherent Risk × Control Risk × Detection Risk<br />
                  (AR = IR × CR × DR)
                </div>
              </div>

              <div className="card card-body" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)' }}>
                <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-sm)' }}>BIA &amp; Availability Target Metrics</h4>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                  <strong>RTO (Recovery Time Objective):</strong> Max acceptable downtime before financial/operational disaster.<br />
                  <strong>RPO (Recovery Point Objective):</strong> Max acceptable data loss measured in time.<br />
                  <strong>MTBF / MTTR:</strong> Mean Time Between Failures / Mean Time to Repair.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setReviewPause(false);
                  setShowFormulaDrawer(false);
                }}
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Quiz Modal */}
      {showStopModal && (
        <div className="modal-backdrop" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>⏹</span>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Stop Quiz Session?</h3>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowStopModal(false);
                  setReviewPause(false);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ padding: 'var(--space-4)' }}>
              <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                You have answered <strong>{answeredTotal}</strong> of <strong>{questions.length}</strong> questions in this session.
              </p>
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginBottom: 'var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  lineHeight: 1.6,
                }}
              >
                <strong>Choose your preferred exit action:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li><strong>Grade &amp; View Results:</strong> Scores your answered questions, stores the session in your analytics history, and opens the diagnostic report.</li>
                  <li><strong>Discard &amp; Exit:</strong> Leaves immediately without saving or scoring this incomplete attempt.</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowStopModal(false);
                  setReviewPause(false);
                }}
              >
                Resume Quiz
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={() => {
                    setShowStopModal(false);
                    setReviewPause(false);
                    resetQuiz();
                    navigate('/practice');
                  }}
                  title="Discard this session without saving"
                >
                  Discard &amp; Exit
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm font-bold"
                  onClick={async () => {
                    setShowStopModal(false);
                    setReviewPause(false);
                    await finishQuiz();
                  }}
                  title="Grade answered questions and view results"
                >
                  Grade &amp; View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finish Modal */}
      {showConfirmFinish && (
        <div className="modal-backdrop" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Finish Quiz?</h3>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setReviewPause(false);
                  setShowConfirmFinish(false);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 'var(--space-3)' }}>
                You have answered <strong>{answeredTotal}</strong> of{' '}
                <strong>{questions.length}</strong> questions.
              </p>
              {questions.length - answeredTotal > 0 && (
                <div className="badge badge-warning mb-4" style={{ display: 'inline-flex' }}>
                  ⚠ {questions.length - answeredTotal} unanswered questions remaining
                </div>
              )}
              <p className="text-sm text-muted">
                Are you ready to submit and calculate your scaled score (200–800)?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setReviewPause(false);
                  setShowConfirmFinish(false);
                }}
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  setReviewPause(false);
                  setShowConfirmFinish(false);
                  await finishQuiz();
                }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
