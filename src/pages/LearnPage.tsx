import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useQuizStore } from '../stores/quizStore';
import { useAuthStore } from '../stores/authStore';
import { useLessonProgressStore } from '../stores/lessonProgressStore';
import { LessonViewer } from '../components/learn/LessonViewer';
import { GlossaryDrawer } from '../components/learn/GlossaryDrawer';
import { DocumentReader } from '../components/learn/DocumentReader';
import { InteractiveCalculators } from '../components/learn/InteractiveCalculators';
import { CertVersionDeltaViewer } from '../components/learn/CertVersionDeltaViewer';
import { TaskStatementsDrawer } from '../components/learn/TaskStatementsDrawer';
import { ConceptGraphExplorer } from '../components/learn/ConceptGraphExplorer';
import type { Certification, Domain, Topic, Subtopic, Question, GlossaryTerm, StudyMaterial, TaskStatement, DocumentIngestionRecord } from '../types';

export default function LearnPage() {
  const navigate = useNavigate();
  const { startQuiz } = useQuizStore();

  const { activeCertificationSlug, setActiveCertification } = useAuthStore();
  const effectiveCertSlug = activeCertificationSlug || 'cisa';

  const [viewMode, setViewMode] = useState<'syllabus' | 'documents' | 'graph' | 'delta' | 'calculators'>('syllabus');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [allCertTopics, setAllCertTopics] = useState<Topic[]>([]);
  const [allCertSubtopics, setAllCertSubtopics] = useState<Subtopic[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [vaultDocuments, setVaultDocuments] = useState<DocumentIngestionRecord[]>([]);
  const [taskStatements, setTaskStatements] = useState<TaskStatement[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Load Certifications
  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data && data.length > 0) {
        setCertifications(data);
      }
    }
    loadCerts();
  }, []);

  // 2. Load Domains, Glossary, Tasks & Study Materials for Selected Certification
  useEffect(() => {
    async function loadCertData() {
      setLoading(true);
      const currentCert = certifications.find(c => c.slug === effectiveCertSlug);
      if (!currentCert) {
        setLoading(false);
        return;
      }

      // Domains
      const { data: domData } = await supabase
        .from('domains')
        .select('*')
        .eq('certification_id', currentCert.id)
        .order('domain_number');

      if (domData && domData.length > 0) {
        setDomains(domData);
        setSelectedDomainId(domData[0].id);

        // Load all topics and subtopics for this cert (for comprehensive review manual reading)
        const domainIds = domData.map(d => d.id);
        const { data: allTData } = await supabase
          .from('topics')
          .select('*')
          .in('domain_id', domainIds)
          .order('sort_order');
        setAllCertTopics(allTData || []);

        if (allTData && allTData.length > 0) {
          const topicIds = allTData.map(t => t.id);
          const { data: allSData } = await supabase
            .from('subtopics')
            .select('*')
            .in('topic_id', topicIds)
            .order('sort_order');
          setAllCertSubtopics(allSData || []);
        } else {
          setAllCertSubtopics([]);
        }
      } else {
        setDomains([]);
        setSelectedDomainId(null);
        setAllCertTopics([]);
        setAllCertSubtopics([]);
      }

      // Glossary
      const { data: glossData } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('certification_id', currentCert.id)
        .order('term');
      if (glossData) setGlossaryTerms(glossData);

      // Task Statements
      const { data: taskData } = await supabase
        .from('task_statements')
        .select('*')
        .eq('certification_id', currentCert.id)
        .order('task_code');
      if (taskData) setTaskStatements(taskData);

      // Study Materials / Full Manual Chapters
      const { data: matData } = await supabase
        .from('study_materials')
        .select('*')
        .eq('certification_id', currentCert.id)
        .order('chapter_number')
        .order('sort_order');

      if (matData && matData.length > 0) {
        setStudyMaterials(matData);
        setSelectedMaterialId(matData[0].id);
      } else {
        setStudyMaterials([]);
        setSelectedMaterialId(null);
      }

      // Ingested Storage Vault Documents (Load all documents so learner can filter or view active cert)
      const { data: vaultData } = await supabase
        .from('document_ingestion_ledger')
        .select('*')
        .order('file_name');

      if (vaultData) {
        setVaultDocuments(vaultData as DocumentIngestionRecord[]);
      } else {
        setVaultDocuments([]);
      }

      setLoading(false);
    }

    if (certifications.length > 0) {
      loadCertData();
    }
  }, [certifications, effectiveCertSlug]);

  // 3. Load Topics & Subtopics for Selected Domain
  useEffect(() => {
    async function loadDomainContent() {
      if (!selectedDomainId) {
        setTopics([]);
        setSubtopics([]);
        return;
      }

      const { data: tData } = await supabase
        .from('topics')
        .select('*')
        .eq('domain_id', selectedDomainId)
        .order('sort_order');

      if (tData) {
        setTopics(tData);
        const topicIds = tData.map(t => t.id);

        if (topicIds.length > 0) {
          const { data: sData } = await supabase
            .from('subtopics')
            .select('*')
            .in('topic_id', topicIds)
            .order('sort_order');
          if (sData) setSubtopics(sData);
        } else {
          setSubtopics([]);
        }
      }
    }

    loadDomainContent();
  }, [selectedDomainId]);

  const currentCert = certifications.find(c => c.slug === effectiveCertSlug);
  const currentDomain = domains.find(d => d.id === selectedDomainId);

  const {
    isSubtopicCompleted,
    isSubtopicRelearn,
    getDomainCompletionStats,
  } = useLessonProgressStore();

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'relearn' | 'uncompleted'>('all');

  // Filter topics and subtopics by search query and status
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const topicSubs = subtopics.filter(s => s.topic_id === t.id);
      
      // Filter subtopics by search and status
      const matchingSubs = topicSubs.filter(s => {
        // Status filter
        if (statusFilter === 'completed' && !isSubtopicCompleted(s.id)) return false;
        if (statusFilter === 'relearn' && !isSubtopicRelearn(s.id)) return false;
        if (statusFilter === 'uncompleted' && (isSubtopicCompleted(s.id) || isSubtopicRelearn(s.id))) return false;

        // Search term
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          s.name.toLowerCase().includes(term) ||
          s.subtopic_code.toLowerCase().includes(term) ||
          (s.key_terms && s.key_terms.some(k => k.toLowerCase().includes(term)))
        );
      });

      if (statusFilter !== 'all') {
        return matchingSubs.length > 0;
      }

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchTopic = t.name.toLowerCase().includes(term) || t.topic_code.toLowerCase().includes(term) || (t.content_summary && t.content_summary.toLowerCase().includes(term));
      return matchTopic || matchingSubs.length > 0;
    });
  }, [topics, subtopics, searchTerm, statusFilter, isSubtopicCompleted, isSubtopicRelearn]);

  // Group filtered topics into Part A and Part B
  const partATopics = useMemo(() => filteredTopics.filter(t => t.part === 'A'), [filteredTopics]);
  const partBTopics = useMemo(() => filteredTopics.filter(t => t.part === 'B'), [filteredTopics]);

  // Distinct chapter and publication counts for the active certification
  const distinctChapterCount = useMemo(() => {
    const nums = new Set(studyMaterials.map((m) => m.chapter_number).filter((n) => n !== null && n !== undefined));
    return nums.size;
  }, [studyMaterials]);

  const distinctManualCount = useMemo(() => {
    const titles = new Set(studyMaterials.map((m) => m.document_title).filter(Boolean));
    return titles.size;
  }, [studyMaterials]);

  const handleStartDomainQuiz = async (domainId: string) => {
    if (!currentCert) return;
    setLoading(true);
    try {
      const targetDomain = domains.find((d) => d.id === domainId);
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', currentCert.id)
        .eq('domain_id', domainId)
        .eq('is_active', true);

      if (!qData || qData.length === 0) {
        alert('No questions found specifically for this domain.');
        setLoading(false);
        return;
      }

      const shuffled = [...qData].sort(() => Math.random() - 0.5).slice(0, 15);
      const title = targetDomain ? `Domain ${targetDomain.domain_number}: ${targetDomain.name}` : 'Domain Drill';

      await startQuiz(
        shuffled,
        'domain_drill',
        1200,
        currentCert.id,
        domainId,
        'immediate',
        null,
        title
      );
      setLoading(false);
      navigate('/quiz');
    } catch (err: any) {
      console.error('Failed to launch domain quiz:', err);
      setLoading(false);
    }
  };

  const handleStartSectionQuiz = async (subtopic: Subtopic, topic?: Topic | null) => {
    if (!currentCert) return;
    setLoading(true);
    try {
      // 1. Query questions specifically tagged to this exact subtopic / section
      let pool: Question[] = [];
      const { data: subQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', currentCert.id)
        .eq('subtopic_id', subtopic.id)
        .eq('is_active', true);

      if (subQuestions && subQuestions.length > 0) {
        pool = [...subQuestions];
      }

      // 2. If subtopic pool has fewer than 10 questions, pull questions from parent topic
      const parentTopicId = subtopic.topic_id || topic?.id;
      if (pool.length < 10 && parentTopicId) {
        const { data: topicQuestions } = await supabase
          .from('questions')
          .select('*')
          .eq('certification_id', currentCert.id)
          .eq('topic_id', parentTopicId)
          .eq('is_active', true);

        if (topicQuestions && topicQuestions.length > 0) {
          const existingIds = new Set(pool.map((q) => q.id));
          const additions = topicQuestions.filter((q) => !existingIds.has(q.id));
          pool = [...pool, ...additions];
        }
      }

      // 3. Fallback to subtopic_code in source_reference within this certification
      if (pool.length === 0) {
        const cleanCode = subtopic.subtopic_code.trim();
        const { data: taggedQ } = await supabase
          .from('questions')
          .select('*')
          .eq('certification_id', currentCert.id)
          .or(`source_reference.ilike.%${cleanCode}%,stem.ilike.%${cleanCode}%`)
          .eq('is_active', true);

        if (taggedQ && taggedQ.length > 0) {
          pool = taggedQ;
        }
      }

      if (pool.length === 0) {
        alert(`No questions found specifically for Section ${subtopic.subtopic_code} (${subtopic.name}). Please practice the parent domain or another section.`);
        setLoading(false);
        return;
      }

      // Shuffle section questions and take up to 10
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
      const sectionTitle = `Section ${subtopic.subtopic_code}: ${subtopic.name}`;

      await startQuiz(
        shuffled,
        'topic_drill',
        600,
        currentCert.id,
        currentDomain?.id || null,
        'immediate',
        parentTopicId || null,
        sectionTitle
      );
      setLoading(false);
      navigate('/quiz');
    } catch (err: any) {
      console.error('Failed to launch section quiz:', err);
      alert('Error loading section questions: ' + err.message);
      setLoading(false);
    }
  };

  const handleStartTopicQuiz = async (topicId: string, topicName?: string, topicCode?: string) => {
    if (!currentCert) return;
    setLoading(true);
    try {
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', currentCert.id)
        .eq('topic_id', topicId)
        .eq('is_active', true);

      if (!qData || qData.length === 0) {
        alert('No questions found specifically for this topic.');
        setLoading(false);
        return;
      }

      // Shuffle and pick up to 10
      const shuffled = [...qData].sort(() => Math.random() - 0.5).slice(0, 10);
      const title = topicCode && topicName ? `Topic ${topicCode}: ${topicName}` : topicCode || 'Topic Practice';

      await startQuiz(
        shuffled,
        'topic_drill',
        600,
        currentCert.id,
        selectedDomainId,
        'immediate',
        topicId,
        title
      );
      setLoading(false);
      navigate('/quiz');
    } catch (err: any) {
      console.error('Failed to launch topic quiz:', err);
      setLoading(false);
    }
  };

  const handleStartDeltaQuiz = async () => {
    if (!currentCert) return;
    setLoading(true);
    const { data: qData } = await supabase
      .from('questions')
      .select('*')
      .eq('certification_id', currentCert.id)
      .eq('is_active', true)
      .limit(20);

    if (qData && qData.length > 0) {
      const shuffled = [...qData].sort(() => Math.random() - 0.5);
      await startQuiz(shuffled, 'quick_check', 1200, currentCert.id, null, 'immediate', null, 'CISA Delta Diagnostic');
      setLoading(false);
      navigate('/quiz');
    } else {
      setLoading(false);
    }
  };

  const handleStartTopicCodeQuiz = async (topicCode: string) => {
    if (!currentCert) return;
    setLoading(true);
    try {
      // Find matching topic in allCertTopics
      const matchingTopic = allCertTopics.find(
        (t) => t.topic_code === topicCode || t.topic_code.replace(/[^0-9]/g, '') === topicCode.replace(/[^0-9]/g, '')
      );
      if (matchingTopic) {
        await handleStartTopicQuiz(matchingTopic.id, matchingTopic.name, matchingTopic.topic_code);
        return;
      }

      // Or matching subtopic
      const matchingSub = allCertSubtopics.find((s) => s.subtopic_code === topicCode);
      if (matchingSub) {
        const parentT = allCertTopics.find((t) => t.id === matchingSub.topic_id);
        await handleStartSectionQuiz(matchingSub, parentT);
        return;
      }

      // Otherwise domain drill
      const domainNum = parseInt(topicCode[0]) || 1;
      const targetDomain = domains.find((d) => d.domain_number === domainNum);
      if (targetDomain) {
        await handleStartDomainQuiz(targetDomain.id);
      } else {
        alert(`No questions found specifically for ${topicCode}.`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error starting concept quiz:', err);
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      {/* Certification Track Switcher */}
      <div className="cert-tabs-bar mb-4" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
        {certifications.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCertification(c.slug)}
            className={`cert-tab-btn ${effectiveCertSlug === c.slug ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 'bold',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap',
            }}
          >
            🎯 {c.code || c.name.split('—')[0].trim()}
          </button>
        ))}
      </div>

      {/* Header Banner */}
      <div className="learn-header-banner">
        <div>
          <div className="learn-header-badge">
            <span>📚</span> {currentCert?.code || 'Certification'} Official Curriculum &amp; Library
          </div>
          <h1 className="learn-header-title">
            {currentCert?.name || 'Certification Curriculum'}
          </h1>
          <p className="learn-header-desc">
            {currentCert?.description || `Curriculum organized across ${domains.length} domains, ${allCertTopics.length} topics, and ${allCertSubtopics.length} granular lessons with authoritative Review Manual text.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="learn-actions">
          {taskStatements.length > 0 && (
            <button
              onClick={() => setIsTasksOpen(true)}
              className="btn btn-secondary"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              📋 Task Statements ({taskStatements.length})
            </button>
          )}

          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="btn btn-secondary"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            📖 Glossary ({glossaryTerms.length})
          </button>
          
          {selectedDomainId && (
            <button
              onClick={() => handleStartDomainQuiz(selectedDomainId)}
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary-light)' }}
            >
              ⚡ Quiz Domain
            </button>
          )}
        </div>
      </div>

      {/* Primary Learning Mode Switcher Toolbar */}
      <div className="learn-toolbar mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        
        {/* Segmented Pill Navigation */}
        <div className="segmented-nav" role="tablist">
          <button
            onClick={() => setViewMode('syllabus')}
            className={`segmented-pill ${viewMode === 'syllabus' ? 'active' : ''}`}
            role="tab"
            aria-selected={viewMode === 'syllabus'}
          >
            <span>🌳</span> Syllabus ({allCertTopics.length > 0 ? allCertTopics.length : topics.length} Topics)
          </button>

          <button
            onClick={() => setViewMode('documents')}
            className={`segmented-pill ${viewMode === 'documents' ? 'active' : ''}`}
            role="tab"
            aria-selected={viewMode === 'documents'}
          >
            <span>📖</span> Review Manual ({distinctChapterCount > 0 ? distinctChapterCount : studyMaterials.length} Ch{distinctManualCount > 1 ? ` • ${distinctManualCount} Manuals` : ''})
          </button>

          <button
            onClick={() => setViewMode('graph')}
            className={`segmented-pill ${viewMode === 'graph' ? 'active' : ''}`}
            role="tab"
            aria-selected={viewMode === 'graph'}
          >
            <span>🧠</span> Knowledge Graph
          </button>

          <button
            onClick={() => setViewMode('delta')}
            className={`segmented-pill ${viewMode === 'delta' ? 'active' : ''}`}
            role="tab"
            aria-selected={viewMode === 'delta'}
          >
            <span>✨</span> Blueprint Delta Gap
          </button>

          <button
            onClick={() => setViewMode('calculators')}
            className={`segmented-pill ${viewMode === 'calculators' ? 'active' : ''}`}
            role="tab"
            aria-selected={viewMode === 'calculators'}
          >
            <span>🧮</span> Calculators
          </button>
        </div>

        {/* Dynamic Track Blueprint Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-primary font-bold desktop-only" style={{ fontSize: '11px' }}>
            {currentCert?.code ? `${currentCert.code} Official Blueprint` : 'Official Blueprint'}
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <div className="animate-spin" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>
            ⟳
          </div>
          <p className="text-muted" style={{ marginTop: 'var(--space-3)' }}>Loading study materials...</p>
        </div>
      ) : viewMode === 'graph' ? (
        /* View: AI Knowledge Graph & Concept Ontology Explorer */
        <ConceptGraphExplorer
          certSlug={effectiveCertSlug}
          certCode={currentCert?.code || undefined}
          certName={currentCert?.name}
          onStartTopicQuiz={handleStartTopicCodeQuiz}
        />
      ) : viewMode === 'delta' ? (
        /* View 4: Version Blueprint Gap & Delta Analysis across all certifications */
        <CertVersionDeltaViewer
          certSlug={effectiveCertSlug}
          certCode={currentCert?.code || undefined}
          onStartDeltaQuiz={handleStartDeltaQuiz}
        />
      ) : viewMode === 'documents' ? (
        /* View 1: Full Document E-Reader & Audio Player */
        <DocumentReader
          materials={studyMaterials}
          vaultDocuments={vaultDocuments}
          allTopics={allCertTopics}
          allSubtopics={allCertSubtopics}
          domains={domains}
          activeCertificationSlug={effectiveCertSlug}
          activeMaterialId={selectedMaterialId}
          onSelectMaterial={(m) => setSelectedMaterialId(m.id)}
          onPracticeSection={handleStartSectionQuiz}
          onPracticeChapter={(domId) => handleStartDomainQuiz(domId)}
        />
      ) : viewMode === 'calculators' ? (
        /* View 2: Interactive Calculators & Simulators */
        <InteractiveCalculators />
      ) : (
        /* View 3: Interactive Syllabus Modules */
        <div>
          {/* Mobile Horizontal Domain Selector Chips */}
          <div className="mobile-only mb-4" style={{ overflowX: 'auto', display: 'flex', gap: 'var(--space-2)', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {domains.map((d) => {
              const isSelected = d.id === selectedDomainId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDomainId(d.id);
                    setSearchTerm('');
                  }}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  <span>Domain {d.domain_number} ({d.exam_weight_percent}%)</span>
                </button>
              );
            })}
          </div>

          <div className="syllabus-grid">
            {/* Desktop Left Column: 5 Official Domain Selector Cards */}
            <div className="domain-sidebar-list desktop-only">
              <div className="domain-sidebar-header">
                <span>5 Official Domains</span>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>ISACA 28th Ed.</span>
              </div>

              {domains.map((d) => {
                const isSelected = d.id === selectedDomainId;
                const domSubIds = subtopics.map(s => s.id);
                const stats = getDomainCompletionStats(domSubIds);

                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDomainId(d.id);
                      setSearchTerm('');
                    }}
                    className={`domain-sidebar-card ${isSelected ? 'active' : ''}`}
                  >
                    <div className="domain-badge-row">
                      <span className="domain-pill">
                        Domain {d.domain_number}
                      </span>
                      <span className="domain-weight">
                        {d.exam_weight_percent}% Weight
                      </span>
                    </div>
                    <h4 className="domain-card-title">
                      {d.name}
                    </h4>
                    {isSelected && stats.total > 0 && (
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-ink-muted)', marginBottom: '2px' }}>
                          <span>Progress</span>
                          <span>{stats.completed}/{stats.total} ({stats.percent}%)</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: 'var(--color-bg-muted)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: 'var(--color-success)', width: `${stats.percent}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          {/* Right Column: Topics & Structured Lessons */}
          <div>
            {currentDomain ? (
              <>
                {/* Domain Header Card */}
                <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                      DOMAIN {currentDomain.domain_number} SYLLABUS LESSONS
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      ~{currentDomain.approx_exam_questions} Exam Questions • {topics.length} Topics
                    </span>
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
                    {currentDomain.name}
                  </h2>
                  {currentDomain.learning_objectives && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', marginTop: 'var(--space-2)' }}>
                      {currentDomain.learning_objectives}
                    </p>
                  )}

                  {/* Search Filter Bar & Learning Action Status Filters */}
                  <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="🔍 Search topics, sections (e.g. 1.1, 5.3, AI, Zero Trust, BIA), or key terms..."
                      className="input"
                      style={{ fontSize: 'var(--text-sm)' }}
                    />

                    {/* Status Filter Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-ink-muted)' }}>Filter Lessons:</span>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '11px', padding: '2px 8px', minHeight: '24px' }}
                      >
                        All Lessons ({subtopics.length})
                      </button>
                      <button
                        onClick={() => setStatusFilter('completed')}
                        className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-success' : 'btn-secondary'}`}
                        style={{ fontSize: '11px', padding: '2px 8px', minHeight: '24px' }}
                      >
                        ✓ Completed
                      </button>
                      <button
                        onClick={() => setStatusFilter('relearn')}
                        className={`btn btn-sm ${statusFilter === 'relearn' ? 'btn-warning' : 'btn-secondary'}`}
                        style={{ fontSize: '11px', padding: '2px 8px', minHeight: '24px', backgroundColor: statusFilter === 'relearn' ? '#f59e0b' : undefined, color: statusFilter === 'relearn' ? '#fff' : undefined }}
                      >
                        🔄 Relearn Queue
                      </button>
                      <button
                        onClick={() => setStatusFilter('uncompleted')}
                        className={`btn btn-sm ${statusFilter === 'uncompleted' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '11px', padding: '2px 8px', minHeight: '24px' }}
                      >
                        ⚪ Uncompleted
                      </button>
                    </div>
                  </div>
                </div>

                {/* Topics Panels */}
                <div>
                  {filteredTopics.length === 0 ? (
                    <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                      <p className="text-muted">No topics matched your search or status filter.</p>
                      {statusFilter !== 'all' && (
                        <button
                          onClick={() => setStatusFilter('all')}
                          className="btn btn-secondary btn-sm mt-3"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Part A Section */}
                      {partATopics.length > 0 && (
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                            <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                              PART A
                            </span>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)' }}>
                              {currentDomain.part_a_title?.replace('Part A:', '').trim() || 'Core Principles & Frameworks'} ({partATopics.length} Topics)
                            </span>
                          </div>

                          {partATopics.map(topic => renderTopicPanel(topic))}
                        </div>
                      )}

                      {/* Part B Section */}
                      {partBTopics.length > 0 && (
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                            <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                              PART B
                            </span>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)' }}>
                              {currentDomain.part_b_title?.replace('Part B:', '').trim() || 'Operations, Execution & Controls'} ({partBTopics.length} Topics)
                            </span>
                          </div>

                          {partBTopics.map(topic => renderTopicPanel(topic))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                <p className="text-muted">Select a domain from the left to view lessons.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Lesson Viewer Modal */}
      {activeSubtopic && (
        <LessonViewer
          subtopic={activeSubtopic}
          topic={allCertTopics.find((t) => t.id === activeSubtopic.topic_id) || topics.find((t) => t.id === activeSubtopic.topic_id)}
          domain={currentDomain}
          allSubtopics={subtopics}
          onSelectSubtopic={(nextSub) => setActiveSubtopic(nextSub)}
          onClose={() => setActiveSubtopic(null)}
          onPracticeSection={handleStartSectionQuiz}
          onPracticeTopic={(tId) => handleStartTopicQuiz(tId)}
        />
      )}

      {/* Glossary Modal */}
      {isGlossaryOpen && (
        <GlossaryDrawer
          terms={glossaryTerms}
          onClose={() => setIsGlossaryOpen(false)}
        />
      )}

      {/* Task Statements Modal */}
      {isTasksOpen && (
        <TaskStatementsDrawer
          taskStatements={taskStatements}
          onClose={() => setIsTasksOpen(false)}
        />
      )}
    </div>
  );

  function renderTopicPanel(topic: Topic) {
    const topicSubs = subtopics.filter(s => s.topic_id === topic.id);
    const completedTopicSubs = topicSubs.filter(s => isSubtopicCompleted(s.id)).length;
    const isTopicFullyDone = topicSubs.length > 0 && completedTopicSubs === topicSubs.length;

    return (
      <div key={topic.id} className="topic-panel">
        {/* Topic Header */}
        <div className="topic-panel-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <span className="topic-code-tag">
                {topic.topic_code}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 'var(--weight-bold)' }}>
                Part {topic.part}
              </span>
              {isTopicFullyDone && (
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  ✓ Mastered
                </span>
              )}
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
              {topic.name}
            </h3>
            {topic.content_summary && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: 'var(--space-1)', marginBottom: 0 }}>
                {topic.content_summary}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
              {completedTopicSubs}/{topicSubs.length} done
            </span>
            <button
              onClick={() => handleStartTopicQuiz(topic.id, topic.name, topic.topic_code)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
            >
              ⚡ Practice 10Q
            </button>
          </div>
        </div>

        {/* Granular Subtopics / Modules List */}
        {topicSubs.length > 0 && (
          <div className="subtopic-list">
            {topicSubs.map((sub) => {
              const subDone = isSubtopicCompleted(sub.id);
              const subRelearn = isSubtopicRelearn(sub.id);

              return (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubtopic(sub)}
                  className={`subtopic-item ${subDone ? 'completed' : ''}`}
                  style={{
                    borderLeft: subDone
                      ? '3px solid var(--color-success)'
                      : subRelearn
                      ? '3px solid #f59e0b'
                      : undefined,
                  }}
                >
                  <div className="subtopic-left">
                    <span className="subtopic-code">
                      {subDone ? '✓ ' : subRelearn ? '🔄 ' : ''}{sub.subtopic_code}
                    </span>
                    <div>
                      <h4 className="subtopic-name">
                        {sub.name}
                      </h4>
                      {sub.key_terms && sub.key_terms.length > 0 && (
                        <div className="key-terms-row">
                          {sub.key_terms.slice(0, 3).map((term, i) => (
                            <span key={i} className="term-chip">
                              {term}
                            </span>
                          ))}
                          {sub.key_terms.length > 3 && (
                            <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                              +{sub.key_terms.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="subtopic-right">
                    {subRelearn && (
                      <span className="badge badge-warning" style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                        Needs Relearn
                      </span>
                    )}
                    {subDone && (
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>
                        Completed
                      </span>
                    )}
                    <span className="subtopic-read-time">
                      ⏱ {sub.estimated_read_minutes || 15}m
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }}
                    >
                      Read →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
