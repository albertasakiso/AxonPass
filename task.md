# Apiligu Learning Pass — Task Tracker

## Phase 0 — Foundation
- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies (Zustand, Dexie, Recharts, Supabase, mammoth, ReactMarkdown, remarkGfm, rehypeKatex, etc.)
- [x] Configure Vite + PWA plugin
- [x] Create design system (CSS tokens, reset, utilities)
- [x] Create TypeScript types
- [x] Build Supabase client + Dexie.js database schema
- [x] Build core UI components (Button, Card, ProgressBar, Badge, Modal, Toast)
- [x] Build layout components (AppShell, BottomNav, SideRail, Header)
- [x] Build auth flow (LoginPage, auth store, route guards)
- [x] Build page shells (Home, Learn, Practice, Quiz, Results, Insights, Admin, Settings)
- [x] Configure routing (React Router)
- [x] Create SQL migrations (001 through 015)
- [x] Create PWA manifest + icons
- [x] Create Netlify config

## Phase 1 — CISA 28th Edition (2024) Integration & Pilot
- [x] Extract and analyze CISA Official Review Manual, 28th Edition (2024) (577 pages)
- [x] Seed CISA certification data (5 domains updated to August 2024 blueprint weights: 18%, 18%, 12%, 26%, 26%)
- [x] Seed 60 syllabus topics (1A1 through 5B6) with rich interactive subtopics
- [x] Seed 5 full e-reader manual chapters into `study_materials` (Domains 1-5 with key takeaways & exam watch tips)
- [x] Seed 5 official ISACA Case Studies (Betatronics, Accenco, Wonderwheels, GlobalCloud Logistics, Spectertainment)
- [x] Seed 10 multi-question case study scenarios with full rationales
- [x] Seed 283 official CISA 28th Edition Glossary Terms & definitions
- [x] Seed high-yield topic-aligned practice questions with 4-option rationale breakdowns (4,082 verified questions in CISA bank)
- [x] Build DocumentReader with chapter navigation, key takeaways, exam watch callouts, and font size controls
- [x] Build GlossaryDrawer with search and category filtering
- [x] Build InteractiveCalculators (BIA/ALE/SLE/ARO, Sample Size, Leitner interval simulators)

## Phase 2 — Learning Loop
- [x] Build lesson/module progress tracking
- [x] Implement 5-box Leitner engine
- [x] Build mastery computation
- [x] Build adaptive question selector
- [x] Build review queue
- [x] Build dashboard (HomePage)
- [x] Build insights charts (Recharts)
- [x] Build results page

## Phase 3 — Timed Exams + PWA
- [x] Build exam profile configurations (150Q / 4-hr August 2024 Blueprint Simulation)
- [x] Build offline sync engine (Dexie.js IndexedDB)
- [x] Build sync indicator
- [x] Implement service worker caching strategies
- [x] PWA install flow
- [x] Offline/reconnect testing

## Phase 4 — Content Operations
- [x] Build DOCX parser (mammoth.js)
- [x] Build CSV/JSON import pipeline & template generator
- [x] Build duplicate detection (Dice coefficient similarity engine)
- [x] Build audit log
- [x] Build export functionality

## Phase 5 — Open-Source AI/ML Cognitive Reasoning Engine
- [x] Create Technical Requirements Specification (`TECHNICAL_REQUIREMENTS_SPECIFICATION_ML_ENGINE.md`)
- [x] Ingest & index 100% of 60 canonical topics into `src/lib/ml/knowledgeGraph.ts` with BM25 vector corpus & inverted index
- [x] Build Bayesian Knowledge Tracing (BKT) & 2PL IRT Scaled Score Engine (`src/lib/ml/bktEngine.ts`)
- [x] Build ISACA Cognitive Operator Dissector & Choice Comparison Matrix (`src/lib/ml/explainerEngine.ts`)
- [x] Build Interactive AI Cognitive Explainer Drawer (`src/components/quiz/AiExplainerDrawer.tsx`)
- [x] Build Interactive Concept Graph & Knowledge Map Explorer (`src/components/learn/ConceptGraphExplorer.tsx`)
- [x] Build Python continuous learning corpus indexing pipeline (`ml_engine/train_and_index.py`)
- [x] Integrate ML predictions, IRT 95% Confidence Intervals, and Knowledge Graph across `LearnPage`, `InsightsPage`, `HomePage`, `ResultsPage`, and `RationalePanel`
- [x] Build and run automated 402-point verification test suite (`scripts/verify-ml-engine-complete.js`)

## Phase 6 — Enterprise Multi-Track Ecosystem & Operations
- [x] Expand platform to 15 Tier-1 Certifications (CISA, CISSP, CISM, CRISC, AWS SAA-C03, NIST, GRC, CompTIA A+, CySA+, Network+, GIAC GSLC, CCSP, CGEIT, ISC2 CC, FIFA Agent 2026)
- [x] Seed and verify 75,000 topic-aligned 4-option practice questions with granular rationales (5,000 per track)
- [x] Ingest and link 112 comprehensive textbook/study material chapters with exam callouts
- [x] Seed 869 official glossary terms & flashcard definitions across all 15 domains
- [x] Seed 77 multi-part real-world Case Studies with verified rationales
- [x] Build native SheetJS Excel (.xlsx/.xls) question parser and template generator
- [x] Build duplicate question cluster detector using Dice token similarity
- [x] Build Admin Studio with QuestionBankManager, FieldMappingStudio, BatchHistoryView, and QuestionEditorModal
- [x] Zero-warning linter pass (`oxlint`) and zero-error production TypeScript/Vite PWA bundle build


