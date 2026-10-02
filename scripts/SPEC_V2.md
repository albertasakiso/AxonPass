APILIGU LEARNING PASS
Software & Technical Requirements Specification
Consolidated, enhanced edition — v2.0
A single-user, offline-first PWA for professional certification mastery
Baseline content: ISACA CISA  ·  Extensible to CISM, CRISC, CISSP
Document status
Draft v2.0 — consolidates and extends the original NTRS/TRS outline and SRS
Prepared
13 August 2026
Scope
Single-user certification prep PWA — architecture, data model, functional modules, and delivery plan
Source material
Original founder specification (NTRS/TRS outline + SRS draft) plus first-hand findings from parsing the CISA Domain 1 content set
Table of Contents
1. Executive Summary	3
2. Goals, Non-Goals, and Constraints	4
3. User Persona and Experience Strategy	4
4. Brand and Visual Design System	5
5. System Architecture	7
6. Data Model	9
7. Functional Modules	10
7.1 Module 1 — Architecture, Deployment and Sync	10
7.2 Module 2 — Certification and Course Engine	10
7.3 Module 3 — MCQ Exam and Visualization Engine	10
7.4 Module 4 — Adaptive (“Protracted”) Review Engine	11
7.5 Module 5 — Admin Import and Content Parser	11
7.6 Module 6 — Reminders and Notification Subsystem	12
8. Non-Functional Requirements	14
9. Testing and Quality Assurance Strategy	15
10. Risks, Assumptions, and Open Questions	16
11. Roadmap and Phasing	17
12. Glossary	18
1. Executive Summary
1.1 Vision and Core Promise
Apiligu Learning Pass is a bespoke, single-user Progressive Web App (PWA) that turns dense certification manuals into a focused, mobile-first study system. The founding brief describes the core promise precisely: a premium, addictive learning experience that behaves as both a teaching tool and a proctored exam simulator for a novice audience. This revision keeps that promise intact and adds the structural detail — data model, algorithms, testing strategy, and phasing — needed to build it.
1.2 What Changed in This Revision
The original brief existed as two overlapping documents: a short NTRS/TRS outline and a more detailed SRS. This edition merges them into one specification, resolves the handful of places where they disagreed with each other, and adds nine sections the originals didn't cover — a concrete data model, a formalized spaced-repetition algorithm, verified exam parameters for all four certifications, a testing strategy, and a phased roadmap. Where a decision was previously left open (for example, "Vite, Next.js, or Remix"), this revision makes a call and states the reasoning, so the document can be handed to a developer without a follow-up conversation.
1.3 Target User
A single named individual: a working professional in Ghana pursuing ISACA/ISC² certification (CISA first, with CISM, CRISC, and CISSP as the schema expands) with little to no prior background in IT audit, security management, or risk. The system is deliberately not a multi-tenant product — it is one learner's private study environment, which simplifies auth, removes the need for content moderation, and allows the whole app to be opinionated about a single learning path.
1.4 Success Criteria
The original brief describes the experience qualitatively ("premium," "addictive") but doesn't say how the team will know it worked. This revision adds measurable targets:
Mastery: the learner can sustain ≥80% accuracy across three consecutive attempts in every domain of a certification before the app considers that certification "exam ready."
Realism: a full-length timed session mirrors the real exam's question count and (compressed) pacing closely enough that exam day pacing feels rehearsed, not new.
Continuity: a study session started offline on a commute and finished later at home resumes with zero lost answers or duplicate submissions.
Content trust: every imported question carries a visible confidence marker, so the learner always knows whether an answer has been corroborated or should be treated with a healthy dose of skepticism.
Frictionless capture: importing a new raw question set (docx or Excel) to a study-ready state takes minutes of admin time, not manual re-typing.
1.5 Document Map
Section 2 sets goals and explicit non-goals. Sections 3–4 cover the user and the visual system. Section 5 is the architecture; Section 6 is the data model. Section 7 details each functional module. Sections 8–9 cover non-functional requirements and testing. Section 10 lists risks and open questions — including three that surfaced directly while preparing this revision. Section 11 proposes a phased build order, and Section 12 is a glossary.
2. Goals, Non-Goals, and Constraints
2.1 Goals
Convert raw, messy certification content (docx exports, Excel sheets, PDFs) into a clean, domain-tagged question bank with minimal manual re-entry.
Deliver a mobile-first practice and timed-exam experience that works fully offline and syncs opportunistically.
Track mastery per question and per domain, and use that signal to decide what the learner sees next.
Present a distinctive, premium, Ghanaian-centric visual identity — not a generic ed-tech template.
Scale the content schema to more certifications without code changes.
2.2 Explicit Non-Goals
No multi-tenant support. One user, one Supabase project, one RLS-locked UID. Do not build shared leaderboards, cohorts, or admin-manages-many-learners features.
No paid or commercial LLM APIs anywhere in the shipped product's runtime path. (Note: this constraint governs the running app, not the development process used to build it — see the callout in Section 7.5.)
No attempt, in the first release, to literally reproduce CISSP's computerized-adaptive-testing (CAT) scoring engine. See Section 7.3 and the open question in Section 10.
No public content marketplace or sharing of the learner's question bank with other users.
2.3 Constraints and Assumptions
The learner has an Android or iOS device (or desktop browser) capable of running a modern PWA with IndexedDB support.
Network connectivity is intermittent by design assumption, not by exception — every write path must work offline first.
Source content arrives in inconsistent, sometimes AI-generated formats. The import pipeline is a first-class module, not an afterthought (Section 7.5).
Hosting and backend costs must stay within free or near-free tiers appropriate for a single user (Supabase free tier, Vercel/Netlify hobby tier).
3. User Persona and Experience Strategy
3.1 Primary Persona — The Novice Professional Learner
A working professional pursuing an ISACA or ISC² credential with little or no prior background in IT auditing, security management, or risk. They are studying around a full-time job, primarily on a phone, in short and often interrupted sessions. Confidence is as much the product to build as knowledge is: a novice who feels lost in jargon disengages long before they run out of study time.
3.2 UX Principles
Reduce cognitive load first, always: one primary action per screen, no competing calls to attention.
Scaffold before testing. Every domain opens with plain-language “explainer nodes” (e.g. “What is an Information Systems Audit?”) before the learner meets exam-style questions on that material.
Protect deep work: no interstitial ads, upsells, or attention-fragmenting animation during an active study or exam session.
Momentum over guilt: streaks, toasts, and reminders should feel encouraging, never punitive — see Section 7.6.
3.3 Accessibility Requirements
The original brief specifies oversized touch targets but doesn't set a formal accessibility bar. This revision adds one:
Target WCAG 2.1 AA. Body text against the white background must clear a 4.5:1 contrast ratio; Royal Blue (#002366) on white measures well above this, so the palette is compliant as specified.
Minimum touch target 44×44px (already specified) with at least 8px spacing between adjacent targets.
Full functionality without color as the only signal — the MCQ correct/incorrect feedback (Section 7.3) must pair green/red with an icon and text label, not color alone.
Respect prefers-reduced-motion for all transitions and celebratory animations.
4. Brand and Visual Design System
4.1 Visual Identity Principles
“Premium Traditional” is the guiding phrase in the original brief: structured, credible components in the spirit of 21st.dev, styled through a Ghanaian-centric lens rather than a generic SaaS look. Two things are explicitly ruled out — glassmorphism and a dark-mode toggle. The app ships light-mode only.
4.2 Color Palette
Role
Value
Usage
Primary — Royal Blue
#002366
Headers, primary buttons, active states, progress indicators
Secondary — White
#FFFFFF
Base background, card surfaces
Feedback — Correct
Green (defined in Section 7.3)
Correct-answer highlight, paired with a check icon
Feedback — Incorrect
Red (defined in Section 7.3)
Incorrect-answer highlight, paired with an icon, never color alone
Ink / body text
Near-black, not pure #000
Body copy, for a softer premium read against white
4.3 Typography (new — not specified in the original brief)
The brief sets color and component rules but leaves type unspecified. To match “premium traditional” without drifting into a generic template feel, this revision proposes two directions for the design owner to choose between rather than defaulting to whatever the frontend framework ships with:
Option A — Structured Editorial: a confident slab or transitional serif (e.g. Fraunces or Source Serif 4) for headings and question stems, paired with a clean grotesk (e.g. Inter or IBM Plex Sans) for UI chrome and body text. Reads credible and “manual-like,” reinforcing that the content is authoritative study material.
Option B — Technical Precision: a geometric sans display face (e.g. General Sans or Space Grotesk) throughout, with a monospace accent (e.g. IBM Plex Mono) reserved for scores, timers, and question numbers — reinforcing the exam-simulator half of the product's identity.
Either direction should define at minimum a 5-step type scale (display, H1, H2, body, caption) with explicit weights, so the mobile-first layouts in Section 4.5 don't drift into ad-hoc sizing per screen.
4.4 Component System
Solid, structured components — cards with real borders/shadows, not translucent or blurred surfaces (no glassmorphism, per the brief).
Light mode only; no dark-mode toggle in scope for v1.
A Kente-inspired grid system: structured, rhythmic alignment (consistent block widths and gutters echoing woven-strip patterns) that adapts from single-column mobile stacks to multi-column desktop rows — a structural nod to the brand's cultural reference point, not a literal pattern applied as decoration.
4.5 Responsive Breakpoints
Breakpoint
Reference viewport
Primary navigation pattern
Mobile — small
360 × 800
Bottom-sheet navigation, single-column
Mobile — standard
390 × 844
Bottom-sheet navigation, single-column
Mobile — large
412 × 915
Bottom-sheet navigation, single-column
Tablet / desktop
≥ 768 width
Persistent side navigation; Kente-grid multi-column layout
5. System Architecture
5.1 Architecture Overview
A client-heavy, offline-first single-page application talking to a thin Supabase backend. All exam logic, timing, scoring, and the spaced-repetition scheduler run entirely on-device against a local IndexedDB mirror; Supabase exists as a durable backup and multi-device sync point, not as a system the app depends on to function moment-to-moment.
Request flow (steady state): Learner action → local state update → IndexedDB write → UI reflects instantly → background sync queue → Supabase upsert when online.
5.2 Frontend: React + Vite (decision resolved)
The original NTRS/TRS outline left this open (“React (Vite, Next.js, or Remix)”). This revision commits to React with Vite and React Router, for a specific reason: Next.js and Remix are built around server rendering and server-side data loading, which add real complexity for a benefit this product doesn't need — there's no SEO surface, no multi-user server session, and the entire point of Module 1 is that the app must work with no server reachable at all. A pure client-side SPA, built with Vite, is simpler to make truly offline-first and has nothing server-side to fail over or misconfigure.
5.3 Backend: Supabase
Postgres database for the durable copy of the certification schema, question bank, and user progress.
Supabase Auth, restricted to a single provisioned account — see Section 8.2 for the Row-Level Security policy shape.
Supabase Storage for any binary assets (imported source files, exported reports).
5.4 Hosting and Deployment
Factor
Vercel
Netlify
SPA fallback config
vercel.json rewrites
Simpler _redirects file
Free-tier fit for a single-user PWA
Yes
Yes
Recommendation
Acceptable
Slight preference — the _redirects file is one line and there's less to misconfigure for a pure client-side SPA
Either platform satisfies the requirement; pick one and standardize the CI pipeline around it rather than supporting both.
5.5 PWA and Offline Subsystem
Service worker precaches the app shell and the active certification's question bank on first successful sync.
Web App Manifest for installability (icons, theme color set to Royal Blue #002366, standalone display mode).
IndexedDB via Dexie.js is the system of record on-device — large enough for “thousands of questions, images, and interactive models,” which exceeds the ~5–10MB practical ceiling of localStorage the brief correctly rules out.
A persistent sync queue (also in IndexedDB) records every write made while offline, replayed in order once connectivity returns.
5.6 Offline-First Sync Sequence
Learner answers a question, completes a session, or updates a setting.
The change is written to IndexedDB and applied to local UI state immediately — no network round-trip blocks the interaction.
The same change is appended to a durable sync queue with a client-generated UUID and timestamp.
When the app detects connectivity, queued items are replayed against Supabase as idempotent upserts keyed on that UUID, so a retried replay never double-counts a session.
Conflicts (the same record changed on two devices while both were offline) resolve by last-write-wins on a server timestamp, except progress counters (times seen / times correct), which merge additively rather than overwrite, so offline study on two devices is never silently lost.
6. Data Model
The original brief describes the schema only as “hierarchical JSONB”. This section proposes the concrete relational shape that JSONB structure should resolve to — the minimum needed for the import pipeline, exam engine, and review engine in Section 7 to actually be buildable.
6.1 Entity Overview
Four clusters of tables: (1) certification content — certifications, domains, questions, options, explanations; (2) import provenance — import_batches, import_flags, which exist specifically to carry forward the confidence-tracking behavior described in Section 7.5; (3) learner state — user_progress, quiz_sessions, session_answers; (4) engagement — notifications_log.
6.2 Core Tables
Table
Key fields
Purpose
certifications
code, body, format, question_count, duration_min, passing_score, score_scale_max
One row per credential (CISA, CISM, CRISC, CISSP…); see Section 7.2 for verified values
domains
certification_id, code, name, weight_percent, sort_order
Job-practice domains within a certification
questions
domain_id, stem, status, content_hash, difficulty (nullable)
content_hash supports the near-duplicate detection in Section 7.5
options
question_id, label (A–D), text, is_correct
Four rows per question
explanations
question_id, body_text, source_confidence
source_confidence is verified / unverified — see Section 7.5
import_batches
filename, imported_at, parser_version, questions_found, questions_flagged
One row per admin import run
import_flags
question_id, batch_id, flag_type, detail_text, resolved
e.g. answer_source_conflict, possible_duplicate_of‹id›
user_progress
question_id, box_level, consecutive_correct, times_seen, times_correct, last_seen_at
Drives the spaced-repetition engine in Section 7.4
quiz_sessions
certification_id, domain_id (nullable), mode, question_count, time_allotted_s, time_taken_s, score_percent
One row per practice or timed session
session_answers
session_id, question_id, selected_option_id, is_correct, time_spent_s
One row per answered question within a session
notifications_log
type, scheduled_at, delivered_at, dismissed_at
Supports the reminder cadence in Section 7.6
6.3 IndexedDB Mirror
Dexie.js schema mirrors the tables above one-to-one for questions, options, explanations, user_progress, and a local-only sync_queue table that does not exist server-side. Keeping the shapes identical means the sync layer in Section 5.6 is a straight upsert, not a transform.
7. Functional Modules
7.1 Module 1 — Architecture, Deployment and Sync
Covered fully in Section 5. No additional functional requirements beyond the architecture itself.
7.2 Module 2 — Certification and Course Engine
The original brief assumes a uniform five-domain structure across all certifications. That isn't accurate, and the schema needs to account for the real shape of each exam. The table below reflects currently published, verified exam parameters (2026):
Cert
Body
Domains
Format
Questions
Duration
Passing score
CISA
ISACA
5 (18/18/12/26/26%)
Fixed-form
150
4 hrs
450 / 800
CISM
ISACA
4
Fixed-form
150
4 hrs
450 / 800
CRISC
ISACA
4 (26/20/32/22%)
Fixed-form
150
4 hrs
450 / 800
CISSP
ISC²
8
Adaptive (CAT)
125–175
4 hrs
700 / 1000
Two implications for the schema: first, domain_count and weight_percent must be per-certification data, not a hardcoded assumption — the certifications and domains tables in Section 6.2 already model this correctly. Second, CISSP's adaptive format is structurally different from the other three; see Section 7.3 for how the exam engine should treat it.
Content structure
Explicit “explainer nodes” precede each domain's question set (e.g. “What is an Information Systems Audit?”, “The Role of Audit Assurance”, “Foundations of Risk Management and Frameworks (NIST, RMF)”), as specified in the original persona requirements.
Navigation is chronological-by-default (Domain 1 → 5) but non-restrictive — the learner may jump to any unlocked module to target a known weak spot.
Content evolves through data (new manual editions, e.g. CISA v27 → v28) via import, never through a code change or app release.
7.3 Module 3 — MCQ Exam and Visualization Engine
Timer compression
The brief's own worked example doesn't match its stated rule — it specifies a 15% reduction but illustrates it as “2 hours 50 minutes instead of 3 hours,” which is roughly a 5.6% cut, and CISA's real exam window is 4 hours, not 3. This revision replaces the fixed example with the general formula the engine actually needs, since it has to work for any certification and any session length, not just one hardcoded case:
Timer compression formula
allotted_time = (certification.duration_min ÷ certification.question_count) × session.question_count × 0.85
Worked example, full CISA exam (150 Q / 240 min): 240 ÷ 150 × 150 × 0.85 = 204 minutes (3 h 24 m) — versus the real 4 h 0 m.
Per-question pacing this implies: 96 seconds/question at real pace, compressed to ≈82 seconds/question — about 14 seconds tighter per question, which is the number to surface on a live pacing indicator.
Immediate feedback
On selection: green highlight with a check icon for correct; red highlight with an icon and the correct option revealed for incorrect (color is never the only signal — see Section 3.3).
A contextual explanation appears immediately below the question on selection, sourced from the explanations table, and visibly marked verified or unverified per Section 7.5.
Question logic
Support for “best fit” / “optimal solution” style items, where more than one option is defensible but one is most correct — the standard ISACA/ISC² question style — by allowing an explanation to address why the near-miss options are inferior, not only why the correct one is right.
CISSP's adaptive format — scoping note
Rebuilding true CAT (item-response-theory-calibrated question selection, 95%-confidence early stopping) is a research-grade undertaking, not a v1 feature. Recommendation: offer CISSP in fixed-form practice mode like the other three certifications for content mastery, and track “true adaptive simulation” as an explicit stretch goal (Section 10, Section 11) rather than a silent gap.
Post-quiz metrics
Historical accuracy trend, per-domain performance breakdown, and time-per-question metrics, rendered as the brief specifies: traditional charts and tables, not experimental visualization types, consistent with the “no AI-generated look” brand constraint.
7.4 Module 4 — Adaptive (“Protracted”) Review Engine
The brief describes the outcome (“re-queued with increasing frequency until 80% mastery across three consecutive attempts”) without specifying the mechanism. This revision formalizes it as a five-box Leitner-style scheduler, which is simple enough to implement and reason about entirely on-device with no server-side ML:
Box
Meaning
Review cadence
0
New or just missed
Every session
1
1 correct answer, not yet consistent
Every 2 sessions
2
2 consecutive correct
Every 4 sessions
3
3 consecutive correct — mastery threshold met
Every 8 sessions
4
Sustained mastery
Light-touch review every ≈20 sessions, to catch decay
A correct answer advances a question one box; an incorrect answer resets it to Box 0 and resets its consecutive-correct counter, regardless of prior box.
A domain is “exam ready” once every question the learner has seen in it sits at Box 3 or above, matching the 80%-across-three-attempts language in the original brief.
Micro-reviews present only the specific explainer text tied to currently-missed concepts (per the brief), not a generic full-course summary — pulled via the domain/question relationship in Section 6.2.
7.5 Module 5 — Admin Import and Content Parser
Grounded in direct experience, not a generic requirement
While preparing this revision, the actual CISA Domain 1 question set intended for this app's first import was parsed by hand as a proof of concept. Three findings from that exercise are load-bearing for this section, not theoretical:
1) AI-generated question exports mix at least two or three formatting conventions in the same file (inline-bold answers, a separately-listed answer key, and prose-style rationales), sometimes inconsistently escaping characters batch to batch.
2) Independent answer sources inside the very same document can disagree — in the sampled set, a plain recited answer key disagreed with the answer marked inline at question-writing time roughly one time in three, and the inline-marked answer was correct in every disagreement spot-checked against subject-matter knowledge.
3) Repeated-prompt generation produces heavy topical duplication — the same underlying question rephrased dozens of times — at a rate high enough to change the effective size of a “1,000-question” bank by more than half once duplicates are collapsed.
Multi-file import and mapping
Support uploading a question file, an answer key, and an explanation document as separate files, with an admin UI to map them together (e.g., matching “Question 1” text to “Answer 1: A” in a key) when they don't arrive pre-merged.
Standardized Excel template (Question, Options A–D, Correct Answer, Explanation columns) as the clean-path import format for hand-curated content.
Offline docx/text parser
Client-side or local-only parsing via mammoth.js (docx → HTML) plus rule-based pattern extraction — no paid or commercial LLM API calls at runtime, per the non-goal in Section 2.2.
The parser must tolerate the real-world format drift found in finding (1) above: multiple answer-marker conventions, inconsistent bold/escape handling, and stray section headings interleaved with question content.
Multi-source answer resolution (new requirement, direct result of finding 2)
When a source document offers more than one signal for the correct answer (inline marker, separate key, stated rationale), the parser must capture all of them per question rather than picking one blindly, and store an explicit confidence level: verified when at least one independently-generated signal is available and corroborated, unverified when only a single, uncorroborated signal exists.
Confidence is a first-class, visible property of a question in study mode (Section 7.3), not just an internal admin note — the learner should be able to filter practice to verified-only questions before a high-stakes review session.
Duplicate detection (new requirement, direct result of finding 3)
On import, compute a similarity signature per question (e.g. token-overlap on the question stem, weighted separately from the answer options) and cluster near-duplicates for admin review rather than silently keeping every rephrasing or silently discarding them — over-aggressive automatic merging risks conflating genuinely different questions that merely share a scenario.
The admin review queue (import_flags table, Section 6.2) is where a human makes the final call on borderline clusters and answer-source conflicts — full automation of this step is not realistic given finding (1), and pretending otherwise would trade a visible admin task for invisible, silent errors in study content.
7.6 Module 6 — Reminders and Notification Subsystem
Native PWA local notifications for daily study reminders and session goals.
In-app, non-intrusive toasts for encouragement (“Mastery of Domain 2 complete!”) and mandatory break reminders after 60 continuous minutes of activity.
Tone follows the interface-voice guidance in Section 3.2: encouraging, specific, never guilt-driven.
8. Non-Functional Requirements
8.1 Performance
Lighthouse PWA, Performance, and Accessibility scores each ≥90 on a mid-range Android device profile.
Time-to-interactive for the question screen under 2 seconds on a warm cache (offline or online).
Local scoring, timer updates, and box-scheduling recalculation must never block on network — all are pure client-side computation per Section 5.
8.2 Security and Privacy
Supabase Row-Level Security policies scope every table to a single provisioned auth.uid(); no table should be reachable by any other principal, including anonymous.
Data in transit via TLS (default for Supabase/Vercel/Netlify); data at rest via Supabase's standard encryption.
No third-party analytics SDK that fingerprints or tracks the learner beyond first-party, on-device progress metrics.
8.3 Reliability and Offline Resilience
Sync replay is idempotent (Section 5.6) — a dropped connection mid-sync must never duplicate a session or answer record on reconnect.
The app must remain fully navigable and fully functional for study and timed-exam purposes with zero network connectivity from first install (after the initial content sync).
8.4 Cost Constraints
No paid or commercial LLM API calls in the running product (Section 2.2, Section 7.5).
Backend and hosting must operate within Supabase's and Vercel's/Netlify's free tiers for a single-user load profile; flag in the risk register (Section 10) if IndexedDB-synced asset volume threatens Supabase Storage free-tier limits.
8.5 Maintainability
Adding a new certification or a new manual edition is a data operation (rows in certifications/domains/questions) via Module 5, never a code change or redeploy.
9. Testing and Quality Assurance Strategy
Not present in the original brief. Added because a study tool that silently serves a wrong answer is worse than no tool at all — verification strategy deserves the same weight as the features themselves.
9.1 Automated Testing
Unit tests for the box-scheduling algorithm (Section 7.4) and the timer-compression formula (Section 7.3) — both are pure functions and should be tested as such.
Integration tests for the offline sync queue: write while offline, go online, verify exactly-once application server-side.
End-to-end tests for a full timed session: start → answer all → submit → review → confirm score and per-domain breakdown match the recorded answers.
9.2 PWA-Specific Testing
Airplane-mode test pass on real Android and iOS devices, not just DevTools network throttling — iOS Safari's IndexedDB and service-worker behavior has known quirks worth catching before launch (see Section 10).
Service-worker update flow: confirm a new deployed version prompts the learner to refresh rather than silently serving stale cached content mid-session.
9.3 Content Parser Validation
Golden-file regression tests built from the actual messy source documents encountered during development (Section 7.5) — not synthetic clean fixtures — so parser changes are checked against the real formatting drift the tool must survive.
A standing metric on every import: percentage of questions landing as verified vs. unverified, and count of duplicate clusters flagged, tracked over time to confirm the parser is improving rather than regressing.
9.4 Accessibility and Performance Audits
Lighthouse CI on every deploy, gated on the thresholds in Section 8.1.
Manual screen-reader pass (VoiceOver/TalkBack) on the exam-taking flow specifically, since it's the highest-stakes screen in the product.
10. Risks, Assumptions, and Open Questions
#
Risk / open question
Why it matters
Recommendation
1
iOS Safari IndexedDB eviction
iOS can clear IndexedDB for installed PWAs under storage pressure or after ~7 days of non-use in some Safari versions, which would silently drop offline progress.
Test explicitly on iOS; treat Supabase as the recovery path and sync aggressively whenever a connection is available, rather than treating IndexedDB as fully durable.
2
Parser accuracy ceiling
Finding (2) in Section 7.5 shows even a careful manual pass left a meaningful share of answers single-sourced and unverifiable without the source manual.
Ship the verified/unverified distinction (Section 7.5) as user-facing from day one rather than presenting all imported content with equal confidence.
3
Duplicate-detection precision
Automated similarity clustering can conflate genuinely different questions that share a scenario (e.g., two different questions both set at the same facility). Over-merging silently loses valid content.
Keep duplicate resolution admin-in-the-loop (import_flags review queue) rather than fully automated in v1.
4
CISSP CAT fidelity
True adaptive testing needs calibrated item-difficulty parameters this content set doesn't have.
Ship CISSP as fixed-form practice first (Section 7.3); revisit true CAT simulation only if calibration data becomes available.
5
Hosting platform lock-in
Brief lists Vercel or Netlify without a firm choice.
Standardize on one (Section 5.4) to avoid maintaining two deployment configs.
6
Single-device recovery
A single-user, single-UID system has no “admin” fallback if the primary device is lost before a sync.
Confirm an account-recovery path (e.g., magic-link email) is provisioned even though there's only one user.
11. Roadmap and Phasing
Not present in the original brief. The full scope above is substantial for a single-user app; sequencing it protects the “exam ready for CISA” goal from being delayed by lower-priority polish.
Phase
Scope
Exit criteria
1 — MVP
CISA only. Core data model, offline-first architecture, MCQ engine with immediate feedback, manual Excel-template import (Module 5's clean path only).
Learner can complete a full offline CISA practice session with accurate scoring.
2 — Study system
Box-based review engine (7.4), timer compression (7.3), post-quiz metrics, notifications (7.6).
Learner reaches and can sustain the 80%-mastery success criterion (Section 1.4).
3 — Scale content
docx/multi-file parser with duplicate detection and confidence flagging (7.5 in full), CISM and CRISC added to the schema.
A new raw question set can be imported to study-ready state without manual re-typing.
4 — Stretch
CISSP fixed-form content; investigate true CAT simulation if calibration data is available.
Open — depends on Phase 3 outcomes and content availability.
12. Glossary
Term
Meaning
PWA
Progressive Web App — an installable, offline-capable web application
RLS
Row-Level Security — Postgres/Supabase access control scoped per database row
IndexedDB
Browser-native database used here as the offline system of record (via Dexie.js)
CAT
Computerized Adaptive Testing — CISSP's exam format, where question difficulty adapts to performance in real time
Leitner system
A spaced-repetition scheduling method using “boxes” of increasing review interval
Fixed-form exam
An exam where every candidate sees the same question count in a set format (CISA, CISM, CRISC)
Domain
A weighted knowledge area within a certification's job-practice outline
Verified / unverified
This spec's confidence marker for an imported answer, per Section 7.5