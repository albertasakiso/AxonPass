PRODUCT REQUIREMENTS AND TECHNICAL SPECIFICATION
LearningPass
A private, mobile-first certification learning and practice-exam PWA
Field
Specification
Purpose
Build-ready specification for a single-owner study platform that starts with CISA Domain 1 and can expand to additional professional certifications.
Prepared from
The supplied 21-minute requirements recording and the two supplied CISA Domain 1 question documents.
Initial corpus
A 1,000-question CISA Domain 1 corpus with answer-key and rationale material, subject to import validation and the owner confirming content rights.
Architecture
React/Next.js PWA, Supabase Auth/Postgres/Storage, local-first offline cache and synchronisation queue.
Scope status
Requirements baseline - implementation has not begun.
Date
2026-08-12
Key product decision
LearningPass must be an engaging personal learning product, not a public content service. It must keep owner-provided study content private, use a conventional premium light UI (no glassmorphism), and have no dependency on paid AI services.
1. Executive summary
LearningPass is a private, single-owner progressive web application (PWA) for learning professional certification material, practising multiple-choice questions, receiving immediate explanations, and tracking mastery over time. CISA is the initial certification; the platform must make certification, edition, domain, module, content and exam configuration data-driven so the same product can later support CISSP, CISM and other owner-supplied study programs.
The supplied CISA documents establish the first seed corpus: a Domain 1 bank whose questions, answer key and rationales can be imported and reconciled. The application must not assume that each uploaded source has the same layout. It must parse into a staged import, surface uncertain matches, require the owner to review them, and only publish a validated version of the corpus.
Definition of done for the product
The owner can sign in, install the app, study a sequenced module, complete a timed practice set, get immediate answer feedback and rationale, review precisely the weak concepts, resume offline work, see progress, import a new versioned question set, and configure reminders without any paid AI integration.
2. Product boundaries and assumptions
Field
Specification
Primary user
One authenticated owner. The data model still carries user_id on all personal state so a future migration to multiple accounts is safe.
Content ownership
Only study material the owner is authorised to store and transform may be uploaded. The product must not expose it publicly, train third-party services on it, or bundle it into public client assets.
Initial implementation
CISA Domain 1 first. The current ISACA outline shows five CISA domains with weights of 18%, 18%, 12%, 26% and 26%; store that as a versioned blueprint, not application code.
Exam profile
The current official CISA outline describes 150 questions across five domains. An official-like CISA profile is 150 questions / 240 minutes; its configuration must be re-confirmed from the active candidate guide before release.
User-requested drill
A separate high-pressure 1,000-question / 135-minute drill is supported as a custom endurance mode. It must be labelled a personal drill, not an official CISA simulation (about 8.1 seconds per question).
No paid AI
Core functions use deterministic parsing, validation, search and recommendation logic. A local/open-source model is optional later and may never be required for learning, importing or scoring.
Design
Light mode only; royal blue and white; mobile-first; accessible conventional components; no glassmorphic interface.
3. Goals, non-goals and success measures
3.1 Product goals
Convert owner-provided certification material into an ordered learning path with small, understandable modules and embedded assessment.
Make every question attempt useful: immediate correctness state, correct option when missed, explanation, relevant concept tags, time consumed and an explicit next action.
Adapt practice based on demonstrated weakness without hiding the rule: repeated misses, low mastery and overdue review all increase item priority.
Support focused learning on a phone while remaining comfortable on tablet and desktop, including installable PWA and safe offline continuation.
Let the owner version, import, validate, correct and publish content without rebuilding the application.
Make progress credible with transparent metrics: completion, accuracy, mastery, streak, time spent, readiness and topic-level weakness.
3.2 Explicit non-goals for the first release
Public marketplace, social sharing, teams, leaderboards across users, instructor portals, payments or multi-tenant collaboration.
Automatic creation of copyrighted learning material, exam dumps, or unreviewed answer keys.
Claims that a custom practice mode reproduces the official examination unless its blueprint, timing and content are deliberately configured and labelled as such.
Dependency on commercial LLM APIs, external AI scoring, or cloud AI for core flows.
A dark-mode design system in the initial build.
3.3 Acceptance-level outcomes
Outcome
Measure
Initial target
Learning continuity
A learner resumes the exact module/question state after refresh or reconnect.
100% of automated resume tests pass
Question integrity
Published questions have four options, one valid answer, a source ID, and no unresolved import error.
0 publish-blocking validation failures
Feedback latency
Correctness and rationale render after a submitted choice.
Under 200 ms from local state; no network wait
Offline durability
Queued attempts synchronise idempotently once connected.
No duplicate attempts in reconnection tests
Actionable review
Every incorrect answer appears in a tagged weak-area review path.
100% of incorrect attempts have a next review action
4. Experience map
The main loop is deliberately simple: select or resume a certification -> complete the next lesson/module -> take a short timed quiz -> get feedback -> review weak concepts -> retake a targeted set -> move forward once mastery is achieved. The owner can always use practice mode, but the recommended learning path remains sequential.
Stage
Learner experience
System responsibility
Onboard
Sign in, choose CISA and set study goal/reminder.
Create learner profile, default plan and consent/preferences.
Learn
Read a short module with concepts, examples and links to owned material.
Track module progress, allow resume, cache safe text/media offline.
Check
Answer a focused MCQ set with visible countdown and flag control.
Snapshot the item set, measure timing, lock answer once submitted and persist attempt events.
Understand
See green correct state or correct option plus rationale when wrong.
Render rationale locally, record outcome, update mastery and schedule review.
Recover
Open a narrow review of exact weak concepts rather than a generic re-read.
Build review queue from concept tags, misses, confidence and recency.
Prove
Take domain and full-bank timed drills, then study a clear results breakdown.
Use immutable exam sessions, calculate metrics and keep a results history.
5. Functional requirements by module
5.1 App shell, authentication and profile
Requirement
UI behaviour
Backend/data behaviour
AUTH-01
Email/password or magic-link sign-in; a clean sign-out control; no social-login requirement.
Supabase Auth session; redirect URLs configured for localhost, production domain and preview domain.
AUTH-02
First launch creates a single owner profile and opens onboarding.
profiles row is created from auth user; account bootstrap is idempotent.
AUTH-03
Profile shows preferred study days, reminder time, timezone and target date.
Store profile/preferences; all personal tables are scoped by user_id and protected with RLS.
SHELL-01
Persistent mobile bottom navigation: Home, Learn, Practice, Insights, Admin; desktop uses a compact side rail.
Route guards prevent unauthenticated access; app version is available for support.
SHELL-02
Install prompt is contextual and never blocks study.
Manifest, icons, service worker and app-shell cache meet PWA install criteria.
5.2 Certification library and learning path
Requirement
UI behaviour
Backend/data behaviour
CERT-01
Certification library presents cards with edition, status, total domains, completion and next task.
certifications and certification_revisions are versioned independently from learner progress.
CERT-02
A domain screen shows weighted blueprint, modules, estimated time, mastery and lock/recommended state.
domains belong to a revision; domain order and weighting are data fields, never hard-coded.
LEARN-01
Lesson pages use short sections, plain language, expandable definitions and an end-of-module check.
lessons, lesson_blocks and objectives are structured records with content version and source locator.
LEARN-02
The next button recommends the next module after a mastery threshold; the owner may override a lock.
module_progress stores status, completion percentage, mastery score, last position and override reason.
LEARN-03
A module explains why it matters and maps each check to a learning objective.
questions may link to module, objective and one or more concepts via join tables.
5.3 Question and quiz engine
Requirement
UI behaviour
Backend/data behaviour
QUIZ-01
One question per screen on mobile. The stem, four labelled answer choices, timer, progress, flag and exit are always obvious.
exam_session_items freezes item order, options and answer/rationale version at session start.
QUIZ-02
Submitting an answer immediately marks correct green or incorrect red, reveals the correct option and shows a concise explanation.
attempt event is written with selected option, correct option, elapsed seconds, result and client/offline ID.
QUIZ-03
The learner may read the explanation before moving on; in test mode, feedback waits until submission.
mode configuration controls feedback timing, answer change policy, review policy and navigation.
QUIZ-04
A visible countdown warns at configured thresholds and handles expiry without losing an answer.
Server-authoritative session end timestamp; client countdown is presentation only; autosave every answer.
QUIZ-05
Flagged items, skipped items and unanswered count are available in review mode.
Session item status supports unseen, answered, flagged, skipped, expired and reviewed.
QUIZ-06
The learner sees the rationale and linked concepts; no answer is only 'wrong'.
Every published question requires a correct_option and rationale. Missing rationale blocks publication unless a deliberate exception is recorded.
5.4 Mastery, adaptive practice and targeted review
The first release must use a deterministic, explainable priority rule rather than an AI model. This keeps the personal product private, debuggable and useful offline. The owner can inspect why an item appeared: missed recently, weak concept, overdue review, low confidence or insufficient exposures.
Rule
Requirement
Initial implementation
MAST-01
Mastery is tracked at question, concept, objective, module, domain and certification level.
Weighted moving score: accuracy, recency, response time and confidence. Clamp 0-100.
ADAPT-01
Incorrect or low-confidence items return sooner; consecutive successes space them out.
Priority = miss severity + overdue weight + low-mastery weight + content-blueprint weight - recent-success weight.
ADAPT-02
The review view names the weak concept and offers 'relearn', '10-question repair set' and 'retry module check'.
Generate a review_queue record with reason codes and a due_at timestamp.
ADAPT-03
A module is 'mastered' at configurable threshold, initially 80%, and never hides remaining weak items.
Threshold stored in certification/module configuration; preserve historical threshold with attempt results.
ADAPT-04
The owner can disable adaptive ordering and run random, newest, flagged-only or by-domain practice.
practice presets materialise selection rules, seed and filters for reproducibility.
5.5 Timed practice and mock examinations
Mode
Purpose
Required configuration
Quick check
5-20 items after a lesson.
Question count, time per question or total time, immediate feedback, retry policy.
Module check
Prove understanding before recommendation to continue.
Selected concepts, mastery threshold, feedback after item, retake delay/limit optional.
Domain practice
Build stamina and diagnose a CISA domain.
Blueprint weight, question count, difficulty mix, random seed, target time.
Official-like CISA simulation
Practice an exam-shaped session without claiming official affiliation.
Default 150 questions / 240 minutes, five-domain blueprint, delayed feedback, flags, review page. Verify active official settings before publishing.
Endurance drill
Owner's requested speed/volume practice.
Default 1,000 questions / 135 minutes; label custom, calculate 8.1 seconds per item, allow pause policy to be configured.
Repair set
Reinforce a precisely weak area.
10/20/50 items from failed/low-confidence/overdue concepts, immediate feedback and repetition cap.
5.6 Dashboard, insights and reminders
Requirement
UI behaviour
Backend/data behaviour
HOME-01
Dashboard opens with next action, today’s target, streak, recent score, review count and readiness signal.
Read model aggregates attempts/progress; update incrementally rather than scanning all attempts on every view.
INSIGHT-01
Charts show accuracy over time, mastery by domain/module/concept, time spent, speed, question exposure and error categories.
Daily snapshots support fast rendering; raw attempts remain the audit trail.
INSIGHT-02
Results show score, correct/incorrect/skipped, time, question review list and recommended repairs.
exam_results is derived from immutable session items and attempt events; never recalculate historical results against edited content.
REMIND-01
Settings permit study-day/time reminders, break reminder, goal reminder and exam-date countdown.
notification_preferences, reminder schedule, opt-in platform permission, timezone-aware delivery and in-app fallback.
REMIND-02
After a focus interval the app gently suggests a break; it never interrupts an active timed test.
Client timer respects session mode; notification job suppresses reminders during active exam sessions.
5.7 Admin and content operations
Requirement
UI behaviour
Backend/data behaviour
ADMIN-01
Admin opens a private content workspace with Certifications, Revisions, Domains, Modules, Questions, Imports, Templates, Settings and Audit Log.
Owner-only role check in addition to RLS; no service key in the browser.
ADMIN-02
Draft/published/archive state is visible on every content asset. Published data cannot be edited in place.
Versioned rows or immutable published revision plus successor draft; preserve source locator and change history.
ADMIN-03
Question editor validates stem, exactly four choices, unique option labels, answer, rationale, tags and source reference.
Validation stored with severity; publish action fails if any blocking error remains.
ADMIN-04
Owner can set module order, prerequisites, mastery threshold, timings and exam blueprints without code.
configuration JSON is schema-validated and belongs to a revision/profile.
ADMIN-05
Owner can export personal progress and content metadata, and delete imported source files.
Exports are generated server-side; deletion follows owner-controlled retention policy and audit records the event.
6. Content ingestion and validation
The CISA source documents demonstrate a common split-source pattern: question stems/options, an answer key, and detailed answer/rationale material. The importer must not silently assume paragraph position equals question number. It must normalise sources into a preview dataset, match by external question ID, report confidence, and require review before publishing.
6.1 Supported intake routes
Route
MVP support
Rules
CSV
Required
Preferred canonical import. Header mapping screen; row-level validation; downloadable template.
JSON
Required
Canonical schema for exports/backups and programmatic migration.
DOCX
Required for current corpus
Local server-side parsing of paragraphs/tables. Use labelled patterns, not generative inference. Surface uncertain blocks for review.
XLSX
Phase 2
Map sheets and headers to question, answer and rationale datasets.
PDF/image
Phase 2 / optional
Only use local OCR where permitted. Require owner review; never auto-publish extracted content.
Manual entry
Required
Add or correct a question/rationale in the admin editor with audit trail.
6.2 Canonical templates
Template
Required columns
Validation
questions.csv
external_id, certification_code, revision, domain_code, module_code, objective_code, stem, option_a, option_b, option_c, option_d, difficulty, tags, source_locator
Unique external_id inside revision; non-empty stem; four non-duplicate options; all mapped domain/module values exist.
answers.csv
external_id, correct_option, rationale, reference_locator
One answer per question; option is A-D; rationale required for publish; references optional but recommended.
modules.csv
module_code, domain_code, title, sequence, objective, estimated_minutes, prerequisite_code
Sequential codes unique; prerequisite resolves in same revision; minutes positive.
blueprint.csv
domain_code, weight_percent, question_count_target, official_reference_url, effective_date
Weights total 100 for a published profile; references and dates retained.
6.3 Import pipeline
Upload a source to private Storage with content type, checksum, owner, certification revision and declared rights/notes.
Create an import_job and parse into raw staging rows; keep parser version and source locations for traceability.
Normalise numbering, option labels, whitespace and duplicated headers; split question, answer-key and rationale blocks.
Run deterministic matching by external ID, then fallback matching only when uniquely identifiable. Calculate a confidence score and list all ambiguous matches.
Show a review screen with side-by-side source excerpt, proposed record and warnings. The owner corrects or accepts each exception.
Run publication validation: four options, one answer, rationale, tags, source reference, no duplicate external IDs and no unresolved rows.
Publish a new immutable content revision. Existing attempts remain associated with the exact item/rationale snapshot used at the time.
Important constraint
Do not use a paid AI service to deduce questions, answers or explanations. Deterministic parsers are the default. An optional local model may assist with an owner-reviewed draft only after it is separately enabled, license-reviewed and made non-essential.
7. UX and visual design requirements
The design must feel like a well-made learning product: direct, focused and rewarding. Use a royal blue primary palette on white, generous tap targets, readable type, clear status colour and conventional cards, sheets, tabs, progress bars, charts and dialogs. Avoid glass effects, translucent panels, excessive gradients, novelty animation and dense dashboard chrome.
Screen
Key content
Interaction requirements
Home
Next action, daily goal, review queue, streak, readiness and recent performance.
One primary action; secondary widgets collapse on narrow widths.
Learn
Domain/module outline, lesson blocks, objective checklist and module progress.
Sticky progress only when helpful; continue from saved position; lightweight offline cache.
Question
Stem, options, timer, item count, flag, submit and rationale feedback.
44 px minimum targets; no accidental submit; keyboard support; answer feedback is colour plus text/icon.
Exam review
Question grid with answered/flagged/unanswered state.
Jump safely between items; confirmation before final submit; accessible labels, not colour-only status.
Results
Score, readiness, timing, domain/skill breakdown, wrong-answer repair list.
Charts have text alternatives and an actionable next step.
Admin import
File, field mapping, preview, warnings, match confidence and publish gate.
Never auto-publish; support undo before publish; show source trace for every conflict.
Settings
Exam profiles, mastery threshold, timer policy, notification preferences, content rights note and data export.
Every change has description, default and reset option.
7.1 Accessibility and responsive acceptance criteria
WCAG 2.2 AA target: keyboard-operable interactive controls, visible focus, sufficient contrast, semantic headings/labels, and no colour-only correctness state.
Minimum phone width of 320 CSS px without horizontal scrolling; primary quiz flow optimised for 360-430 px devices; tablet and desktop retain readable max-widths.
System text scaling up to 200% preserves question options, timer and submit action without overlap or clipping.
Motion is restrained and respects reduced-motion preference; timer is readable and not conveyed by animation alone.
Charts and progress indicators provide a textual summary suitable for screen readers.
8. Technical architecture
Recommended stack: Next.js (React and TypeScript) for the web application, Supabase for Auth/Postgres/Storage/Edge Functions, a PWA service worker and IndexedDB for local-first state. Deploy the web app to Vercel or Netlify and configure the exact production, preview and localhost redirect URLs in Supabase Auth. This architecture meets the requested React, Supabase, PWA, offline and single-user goals without a paid AI dependency.
Layer
Responsibilities
Implementation requirements
Web client
Routes, UI state, local cache, accessibility, quiz interaction, charts and installation.
Next.js App Router + TypeScript; component library with conventional accessible primitives; client must never carry service-role keys.
PWA/offline
App shell cache, safe lesson/question cache, local attempts and sync queue.
Service worker; IndexedDB outbox with UUID idempotency keys; versioned cache invalidation; do not cache private source files beyond owner-controlled device cache.
Authentication
Single-owner sign-in, session refresh, redirect handling and optional MFA.
Supabase Auth with production/preview redirect allow-list. Create profile on first sign-in; session expiry does not lose local unsynced work.
Postgres
Canonical content, settings, attempts, analytics snapshots, import metadata and audit trail.
Migrations in source control; RLS enabled on every exposed table; indexes on user_id, revision_id, session_id, due_at and event timestamps.
Storage
Private source uploads and generated exports.
Private bucket; object paths include owner/revision/import IDs; signed URLs only when needed; no public bucket for study material.
Edge/server actions
Publish gate, import parsing, aggregation, export, reminder scheduling and sensitive operations.
Validate Auth/JWT; apply rate limits; use service role only server-side; return structured errors.
Observability
Errors, sync health, import quality and background job state.
Privacy-preserving logs; never log source text, answer rationales or auth tokens; retention configurable.
8.1 Offline synchronisation contract
Every learner action that changes progress or an attempt is written first to local IndexedDB with a client-generated UUID, entity type, payload, created_at and retry count.
The UI reads optimistic local state immediately. A visible but unobtrusive sync status distinguishes synced, pending and conflict states.
When online, process the outbox in creation order. Each server mutation is idempotent on user_id + client_event_id, so retries cannot duplicate an attempt.
If content changed since an offline session started, preserve the session snapshot, sync the attempt, and show that a newer content revision is available next time.
If Background Sync is unsupported, retry when the service worker/app starts and when online status changes. The app must not promise instantaneous background delivery on every browser.
Offline design guardrail
Offline is for progress, practice and pre-cached learning. Content import, publishing, notification scheduling and large source uploads require a connection. The UI must say this plainly.
9. Data model and access control
Use UUID primary keys, created_at/updated_at timestamps, an optional deleted_at for soft deletion where useful, and explicit revision IDs. Published content is versioned; learner activity references immutable item/session snapshots so later corrections do not rewrite history.
Entity
Purpose
Key fields / relationships
profiles
Owner settings and role.
id = auth.users.id, display_name, timezone, role, onboarding_state.
certifications
Stable certification identity.
code, name, issuer, status; one-to-many certification_revisions.
certification_revisions
Edition/blueprint/content lifecycle.
certification_id, label, effective_date, source_notes, state, owner_id.
domains / modules / lessons
Sequenced learning structure.
revision_id, parent ID, code, title, sequence, objective, estimated_minutes, configuration.
concepts / objectives
Cross-cutting learning taxonomy.
revision_id, code, label, description; joins to modules/questions.
questions / question_options
Versioned question item and choices.
revision_id, external_id, stem, difficulty, source_locator, four options, correct option, rationale.
exam_profiles
Timed modes and blueprint rules.
revision_id, mode, question_count, duration_seconds, feedback_policy, selection rules.
exam_sessions / session_items
Immutable practice/test run.
user_id, profile_id, snapshot revision, started/ended, session item order, question snapshot, status.
attempt_events
Raw learner answer history.
user_id, session_item_id, client_event_id unique, selected_option, result, elapsed_seconds, confidence.
mastery / review_queue
Derived learner model and next actions.
user_id, scope type/id, score, exposures, due_at, reason codes, state.
imports / import_rows
Private staged content ingestion.
owner_id, source file, checksum, parser version, state, raw/source locator, validation errors.
notification_preferences / audit_events
Reminder choices and operational traceability.
user_id, schedule, permission state; actor, action, entity, metadata.
9.1 Row Level Security policy baseline
Enable RLS on every table in the exposed schema. For personal state, select/insert/update/delete policy must require authenticated auth.uid() = user_id (plus an explicit authenticated check).
Content can be read only by the owner while private. If a future public catalog exists, move curated public data to a separate, deliberately exposed model rather than weakening personal-content policies.
Storage objects must live under an owner-prefixed path and Storage policies must verify the matching authenticated user. Imported source documents are private by default.
Service-role credentials exist only in server/edge runtime secrets. Never expose them to the Next.js client or PWA cache.
Use a dedicated owner/admin role in app_metadata or a server-enforced allow-list for publishing/import operations, even with one user today.
10. API, job and configuration contracts
Contract
Method
Behaviour
Start practice
POST /api/sessions
Validates profile/filter; selects questions with seed; stores immutable session_items; returns session snapshot.
Record answer
POST /api/attempt-events
Idempotent by client_event_id; validates session ownership and state; returns result/rationale per feedback policy.
Synchronise outbox
POST /api/sync/batch
Accepts ordered client events; de-duplicates; returns per-event status and server timestamps.
Create import
POST /api/imports
Creates private source object/import_job; detects declared file type; parser runs in background.
Review/publish import
POST /api/imports/:id/publish
Fails closed on blocking validation/errors; publishes a new content revision atomically.
Insights
GET /api/insights
Returns cached aggregates + last refresh; raw attempt detail is paginated.
Reminders
Scheduled edge job
Evaluates due reminders in owner timezone; suppresses timed exams; records delivery result.
10.1 Configuration that must be data-driven
Certification and edition metadata; domains, weights, modules, prerequisites and learning objectives.
Question selection rules, random seed, difficulty distribution, exclusions and option-shuffle policy.
Exam profiles: count, duration, feedback timing, flags, pause allowance, answer changes and review access.
Mastery threshold, adaptive-priority weights, review intervals, repetition cap and confidence prompts.
Reminder time/day, break cadence, study target, timezone and notification permission state.
Theme tokens (royal blue/white light system) and platform copy - but not an unrestricted user theme generator in v1.
11. Privacy, security, licensing and reliability
Area
Requirement
Verification
Content rights
Before upload, prompt the owner to confirm they have the right to store/use the source privately. Do not package source content in a public build or share it with third parties.
Import record captures declaration; private bucket policy test.
Secrets
Publishable Supabase key may be in client config; service-role key and notification secrets are server-only.
Automated secret scan and runtime config review.
Account security
Strong password/magic link; optional MFA; narrow redirect allow-list; sign-out invalidates local session material where requested.
Auth flow, expired session and redirect tests.
Data recovery
Daily database backup policy and owner export of progress/content metadata; versioned content preserves prior published versions.
Restore drill and export/import test.
Reliability
Answer events are idempotent; sync retries use bounded exponential backoff; a failure never silently drops an attempt.
Airplane-mode, reconnect and duplicate-submit tests.
Privacy
No source text/rationales/tokens in analytics or error logs. Anonymous product metrics are opt-in and disabled by default.
Log redaction tests and observability review.
12. Non-functional requirements
Category
Requirement
Acceptance target
Performance
Interactive navigation and local feedback should feel immediate on a mid-range phone.
LCP under 2.5 s on a representative 4G test for cached/app-shell routes; local feedback under 200 ms.
Availability
Learning works with intermittent connectivity after app shell and assigned content are cached.
Offline quiz completion and eventual sync test passes.
Data consistency
Published questions and exam sessions are immutable snapshots.
Historical results do not change after an admin edits a successor revision.
Maintainability
Typed contracts, migration scripts, feature flags and modular domain services.
CI checks TypeScript, tests, schema migration and linting on every change.
Accessibility
Mobile-first accessible conventional UI.
Automated axe baseline plus keyboard/screen-reader manual test for auth, quiz, review and import.
Security
Least privilege through RLS, private storage and server-only privileged actions.
RLS test suite denies cross-owner and anonymous access.
13. Delivery roadmap
Phase
Scope
Exit criteria
0. Foundation
Repository, Next.js shell, Supabase project, migrations, Auth, RLS, private Storage, design tokens, environment/redirect setup.
Authenticated owner can reach a protected empty dashboard; cross-owner/anonymous access tests fail correctly.
1. CISA pilot
Certification/domain/module data model, manual question editor, CSV/JSON template import, current Domain 1 seed staging/validation, short quiz and immediate feedback.
A reviewed subset of owner-provided CISA material can be published, practised and audited end-to-end.
2. Learning loop
Lesson/module progress, mastery, targeted review queue, dashboard and results analytics.
Wrong answers reliably create a precise review action; 80% mastery recommendation works.
3. Timed exams + PWA
Exam profiles, snapshots, flags/review, full results, installability, IndexedDB outbox, reconnect sync and mobile QA.
Official-like and custom endurance profiles run with no lost answers through offline/reconnect testing.
4. Content operations
DOCX parser, mapping UI, import review, version publication, exports, audit log, reminders and notification preferences.
CISA split-source documents can be imported into a review queue and published only after validation.
5. Extension
Additional certification revisions, optional local-only OCR/model assistance, deeper analytics and content update workflow.
A second certification can be added without schema or route redesign; optional model remains disabled by default.
14. Risks and decisions to resolve before build
Decision / risk
Why it matters
Recommended resolution
CISA source rights
Purchased/official materials can have redistribution and transformation restrictions even for private tools.
Keep the product private; capture owner declaration; avoid public hosting/share features; obtain legal/licensing advice if distribution is ever considered.
Lesson content source
The supplied files establish a question bank, but not the complete instructional content for each module.
Create lesson blocks from owner-authorised material; begin with a CISA Domain 1 curriculum map and link back to source locators.
Timer realism
1,000 questions in 135 minutes is an extreme custom drill and differs from the CISA-shaped 150-item / 240-minute profile.
Ship both as separately named configurable profiles; never label the endurance drill official.
Browser notifications
Delivery varies by browser/OS and requires user permission.
Implement reliable in-app reminders first; enable push only after permission and document browser limitations.
Offline import
Large DOCX/PDF imports are unsuitable for offline client parsing and require secure processing.
Limit offline scope to study/practice. Queue only lightweight learner events; require online admin import/publish.
Optional local models
Models add hardware, licensing, evaluation and inaccurate-extraction risk.
Defer from MVP. If later adopted, self-host locally, require owner review and preserve deterministic parser as baseline.
15. Build handoff checklist
Confirm the launch name, production domain, hosting choice (Vercel or Netlify), and Supabase project location.
Confirm the content-rights posture for the supplied CISA material and whether original manual excerpts will be uploaded for lesson-authoring.
Approve the first CISA Domain 1 curriculum map: modules, learning objectives, source references and publish threshold.
Approve the two initial exam profiles: CISA-shaped 150/240 and the requested endurance 1,000/135, plus pause/review behaviour.
Implement Phase 0 and seed a deliberately small, owner-reviewed question subset before importing all 1,000 questions.
Validate the import mapping against the two supplied DOCX structures; fix parser rules and review exceptions before bulk publish.
Run security, accessibility, mobile, offline/reconnect and timer-expiry acceptance tests before personal daily use.
Appendix A. CISA seed configuration
Initial reference configuration only. It must remain editable because certification blueprints and official instructions can change. The platform stores it as a dated certification revision, not as fixed application logic.
Domain
Weight
Initial platform treatment
1. Information Systems Auditing Process
18%
Initial pilot corpus and lesson pathway. Split into Planning and Execution modules, then tag questions to subtopics/concepts.
2. Governance & Management of IT
18%
Future import and modules; retain blueprint allocation in full-exam profile.
3. IS Acquisition, Development & Implementation
12%
Future import and modules; retain blueprint allocation in full-exam profile.
4. IS Operations & Business Resilience
26%
Future import and modules; retain blueprint allocation in full-exam profile.
5. Protection of Information Assets
26%
Future import and modules; retain blueprint allocation in full-exam profile.
Appendix B. Research sources used for this specification
These sources inform the current CISA baseline, PWA synchronisation design and Supabase security recommendation. Verify live exam settings and vendor documentation again at implementation kickoff.
ISACA - CISA Exam Content Outline: https://www.isaca.org/credentialing/cisa/cisa-exam-content-outline
ISACA - Publications (CISA Official Review Manual, 28th Edition eBook 2024): https://www.isaca.org/resources/insights-and-expertise/publications
ISACA - Exam Candidate Guides: https://www.isaca.org/credentialing/exam-candidate-guides
Supabase - Auth: https://supabase.com/docs/guides/auth
Supabase - Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
Chrome for Developers - Workbox Background Sync: https://developer.chrome.com/docs/workbox/modules/workbox-background-sync