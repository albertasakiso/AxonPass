g 

# Technical Requirements Specification (TRS)

## Open-Source, Free, Offline-First Machine Learning & Cognitive Reasoning Engine

**Project:** Apiligu Learning Pass (Private Certification Mastery Platform)
**Document Version:** 1.0.0
**Target Certification:** ISACA® CISA (28th Edition), CISM, CRISC & Multi-Cert Architecture
**Execution Environment:** Dual Runtime (Client-Side TypeScript/WASM/IndexedDB + Local Python 3.11 Pipeline)
**Licensing & Cost:** 100% Free, Open Source (Apache-2.0 / MIT), Zero Paid API Dependencies, Zero Cloud LLM Subscriptions

---

## 1. Executive Summary & Core Objectives

### 1.1 Purpose

The Apiligu Learning Pass ML/AI Engine is designed to serve as the intelligent reasoning and adaptive learning backbone for the platform. It replaces generic "go back and read chapter X" feedback with **exact problem dissection, mathematical knowledge tracing, option-by-option justifications, distractor elimination heuristics, and semantic concept linkage**, without relying on paid external APIs (e.g., OpenAI, Anthropic, Gemini API keys).

### 1.2 Guiding Principles

1. **Zero Recurring Cost**: Built entirely on free and open-source machine learning algorithms (Item Response Theory, Bayesian Knowledge Tracing, BM25 / TF-IDF Vector Spaces, Cosine Semantic Similarity, and Deterministic NLP Reasoning Trees).
2. **100% Knowledge Ingestion (Corpus Digestion)**: Ingests, indexes, and correlates 100% of syllabus topics (60 canonical topics: 1A1 through 5B6), subtopics, 5-chapter Review Manual, 28th Edition Delta updates, Task Statements (T1.1–T5.6), Knowledge Statements (K1.1–K5.12), and complete Question Banks.
3. **Non-Destructive Augmentation**: The ML system strictly layers on top of existing database records, study materials, and Dexie IndexedDB schemas—enriching rationales without modifying or deleting base resources.
4. **Offline-First & Zero Latency**: Executes directly in the user's browser runtime (via client-side vector search and mathematical engines) and offline via local Python training scripts, ensuring total privacy and instant sub-10ms response times.
5. **Exact Problem Justifications**: Breaks down every question using the ISACA Cognitive Decision Framework, identifying focus operators (`PRIMARY`, `MOST`, `FIRST`, `LEAST`, `BEST`), analyzing why correct options prevail, and providing surgical refutations for each distractor.

---

## 2. System Architecture & Component Design

```
+----------------------------------------------------------------------------------------------------+
|                                    APILIGU LEARNING PASS APPLICATION                               |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +---------------------------+  +-------------------------------+  +----------------------------+  |
|  |     LEARN & SYLLABUS      |  |      ACTIVE EXAM ENGINE       |  |     ANALYTICS & RESULTS    |  |
|  | (Concept Graph, Delta)    |  | (Question Card, Action Bar)   |  | (Scaled Score, Diagnostics)|  |
|  +-------------+-------------+  +---------------+---------------+  +--------------+-------------+  |
|                |                                |                                 |                |
|                +--------------------------------+---------------------------------+                |
|                                                 |                                                  |
|                                                 v                                                  |
|                        +-------------------------------------------------+                         |
|                        |          AI / ML COGNITIVE REASONING HUB        |                         |
|                        |             (src/lib/ml/engine.ts)              |                         |
|                        +------------------------+------------------------+                         |
|                                                 |                                                  |
|        +-------------------------+--------------+--------------+--------------------------+        |
|        |                         |                             |                          |        |
|        v                         v                             v                          v        |
| +--------------+        +-----------------+           +------------------+       +---------------+ |
| |  BM25/TF-IDF |        |  ISACA Operator |           |     Bayesian     |       | Option-by-    | |
| | Vector Store |        | Reasoning Tree  |           | Knowledge Tracer |       | Option Solver | |
| | (Embeddings) |        | (MOST/FIRST/etc)|           | (IRT & Scaled)   |       | & Citations   | |
| +-------+------+        +--------+--------+           +--------+---------+       +-------+-------+ |
|         |                        |                             |                         |         |
|         +------------------------+--------------+--------------+-------------------------+         |
|                                                 |                                                  |
|                                                 v                                                  |
+----------------------------------------------------------------------------------------------------+
|                                      PERSISTENCE & CORPUS LAYER                                    |
|  +-------------------------------------+  +-----------------------------------------------------+  |
|  |   Dexie.js IndexedDB Local Storage  |  |   Authoritative 28th Ed Knowledge Graph (JSON)      |  |
|  |  (User Progress, Answers, Sessions) |  |   (60 Topics, 5 Ch Manual, Task/Knowledge Links)    |  |
|  +-------------------------------------+  +-----------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Mathematical & Algorithmic Specifications

### 3.1 Adaptive Bayesian Knowledge Tracing (BKT) & Item Response Theory (IRT)

For each topic $k \in \{1, \dots, 60\}$ and learner interaction at step $t$:

$$
P(L_{t+1} \mid \text{Correct}) = \frac{P(L_t) \cdot (1 - P(S))}{P(L_t) \cdot (1 - P(S)) + (1 - P(L_t)) \cdot P(G)}
$$

$$
P(L_{t+1} \mid \text{Incorrect}) = \frac{P(L_t) \cdot P(S)}{P(L_t) \cdot P(S) + (1 - P(L_t)) \cdot (1 - P(G))}
$$

Where:

- $P(L_t)$: Prior probability the learner has mastered topic $k$.
- $P(G)$: Guess parameter ($0.25$ for 4-option MCQ).
- $P(S)$: Slip parameter ($0.10$ chance a knowledgeable learner makes an accidental mistake).
- $P(T)$: Transit parameter ($0.15$ transition probability from unlearned to learned state per interaction).

### 3.2 2-Parameter Logistic (2PL) Scaled Score Projection (200–800)

The probability of a correct response to question $i$ with ability $\theta$ is:

$$
P(Y_i = 1 \mid \theta) = \frac{1}{1 + e^{-a_i (\theta - b_i)}}
$$

Where $a_i$ is item discrimination ($0.8 - 2.0$) and $b_i$ is item difficulty ($-2.5 \le b_i \le 2.5$).
The estimated ability $\hat{\theta}$ is linearly mapped into the official ISACA 200–800 scale:

$$
\text{Scaled Score} = 500 + 100 \cdot \hat{\theta}, \quad \text{Clamped: } [200, 800]
$$

Passing Threshold $\ge 450$ corresponds to $\hat{\theta} \ge -0.50$ (consistent with $\approx 65\% - 70\%$ raw accuracy weighted across blueprint domains).

### 3.3 Semantic BM25 / TF-IDF Vector Search & Topic Grounding

To ground every question in the exact textbook paragraph:

$$
\text{Score}(D, Q) = \sum_{i=1}^{N} \text{IDF}(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}
$$

Parameters:

- $k_1 = 1.5$ (term frequency saturation).
- $b = 0.75$ (document length penalization).

---

## 4. Problem Dissection & Answer Justification Engine

### 4.1 ISACA Cognitive Decision Framework

The engine parses stems for focus operators:

- **`PRIMARY` / `MAIN`**: Identifies fundamental governance, overarching policies, or root causes over tactical symptoms.
- **`FIRST` / `INITIAL`**: Sequence-based operator requiring the initial investigative or planning action before taking remedial steps.
- **`MOST` / `BEST`**: Relative efficacy operator evaluating which control provides the highest risk reduction per unit of exposure.
- **`LEAST`**: Inverse operator evaluating what is not recommended or has the lowest audit relevance.

### 4.2 Four-Part Deep Explainer Schema

Every AI-generated or AI-augmented explainer outputs the following structured fields:

1. **Decision Keyword Dissection**: Extracts the operational verb and ISACA decision modifier.
2. **Concept & Syllabus Grounding**: Explicit link to Domain Number, Canonical Topic Code (e.g., `1A3`), Task Statement (e.g., `T1.2`), and Review Manual Section (e.g., `1.2.4`).
3. **Choice Comparison Matrix**:
   - `Option A`: Verdict (Correct / Distractor / Secondary / Unrelated) + Justification.
   - `Option B`: Verdict + Justification.
   - `Option C`: Verdict + Justification.
   - `Option D`: Verdict + Justification.
4. **Exam Strategy & Trap Avoidance Heuristic**: Direct advice on how candidate traps are structured by ISACA test writers.

---

## 5. Offline Knowledge Ingestion & Continuous Learning Pipeline

### 5.1 Precomputed Knowledge Graph (`src/lib/ml/knowledgeGraph.ts`)

A compiled JSON knowledge base containing:

- Full hierarchical ontology of all 5 Domains, 60 Topics, and 180+ Subtopics.
- 5 Chapter Summaries and 28th Edition Delta additions (AI in audit, Cloud Security Alliance CCM, zero-trust controls, ITAF 4th Ed).
- Inverted keyword index for instant offline token search.

### 5.2 Python Ingestion & Validation Script (`ml_engine/train_and_index.py`)

- Reads all database seeds, syllabus markdown files, and question banks.
- Computes vector embeddings and similarity matrices.
- Performs self-consistency validation (checks that every question has corroborated keys and complete rationales).
- Outputs the production-ready client bundle `knowledgeGraph.json`.

---

## 6. Implementation Deliverables

1. `TECHNICAL_REQUIREMENTS_SPECIFICATION_ML_ENGINE.md` (This Specification)
2. `src/lib/ml/types.ts`: TypeScript interfaces for knowledge nodes, reasoning trees, and BKT estimators.
3. `src/lib/ml/knowledgeGraph.ts`: Ingested knowledge corpus for offline grounding.
4. `src/lib/ml/bktEngine.ts`: Bayesian Knowledge Tracing & IRT Scaled Score Predictor.
5. `src/lib/ml/explainerEngine.ts`: Automated Option Dissector & ISACA Operator Solver.
6. `src/components/quiz/AiExplainerDrawer.tsx`: Interactive Explainer Modal / Drawer with Choice Matrix, Trap Alerts, and Section References.
7. `src/components/learn/ConceptGraphExplorer.tsx`: Interactive visual concept explorer showing knowledge linkages.
8. `ml_engine/train_and_index.py`: Free, open-source Python continuous learning and corpus indexing pipeline.

---

## 7. Verification & Quality Gates

- **Zero Paid API Calls**: Zero requests sent to external paid AI endpoints.
- **Offline Integrity**: Operates with 100% fidelity in airplane mode / offline service worker.
- **Build Validation**: `tsc -b && vite build` passes with zero compilation or lint errors.
- **Coverage**: 100% of all 60 canonical syllabus topics and question archetypes are digested.
