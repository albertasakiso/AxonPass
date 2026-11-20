/* ===================================================================
   ANOXPASS — Reading Mastery Academy Curriculum
   Active, Analytical & Syntopical Reading, Speed & Retention, SQ3R & Zettelkasten
   =================================================================== */

import type { AcademyTrack } from '../types/academy';

export const READING_MASTERY_CURRICULUM: AcademyTrack = {
  id: 'reading-mastery',
  title: 'Reading Mastery',
  subtitle: 'Read faster, comprehend deeper, and turn every book or manual into permanent knowledge.',
  description:
    'Built on Mortimer Adler’s Four Levels of Reading, cognitive memory science, SQ3R, and Zettelkasten synthesis to help you conquer dense technical manuals and leadership classics.',
  icon: '📖',
  accentColor: '#3b82f6',
  coachMode: 'reading_coach',
  estimatedHours: 10,
  coreOutcomes: [
    'Pre-read any 500-page certification manual in 15 minutes using Inspectional X-Raying',
    'Eliminate regression and subvocalization bottlenecks to double effective reading speed',
    'Synthesize complex books using SQ3R and atomic Zettelkasten evergreen notes',
    'Cross-reference multiple authorities using Syntopical Reading',
  ],
  modules: [
    {
      id: 'rm-mod-1',
      trackId: 'reading-mastery',
      order: 1,
      title: 'Active & Inspectional Reading (Adler’s Levels 1–2)',
      subtitle: 'Stop reading passively from page 1—map the skeleton of any text first.',
      estimatedMinutes: 75,
      lessons: [
        {
          id: 'rm-l1',
          moduleId: 'rm-mod-1',
          title: 'The 15-Minute Book X-Ray (Systematic Skimming)',
          durationMinutes: 25,
          summary:
            'Before diving into Chapter 1, inspect the title, table of contents, index, preface, and pivotal chapters to build a mental scaffold. Your brain retains 3x more when it knows where details fit.',
          keyConcepts: ['Inspectional Reading', 'Mental Scaffolding', 'Structural Mapping', 'Question-Driven Reading'],
          frameworkName: 'Mortimer Adler Inspectional X-Ray',
          actionableTakeaway:
            'Never read a technical manual or nonfiction book cold—spend 10 minutes mapping its structure and writing 3 questions you want answered.',
          xpReward: 100,
          drill: {
            id: 'rm-d1',
            title: '10-Minute Chapter X-Ray Sprint',
            type: 'reading_sprint',
            durationMinutes: 10,
            prompt:
              'Pick a chapter from your CISA/CISSP/AWS guide or Bill Walsh’s book. Read only the headings, bold terms, first/last paragraphs, and diagrams—then summarize the chapter thesis in 3 sentences.',
            steps: [
              'Scan all headings and subheadings (2 min).',
              'Read the opening and closing paragraphs of each section (5 min).',
              'Write a 3-sentence structural summary without looking back (3 min).',
            ],
            successCriteria: [
              'Identified the author’s primary thesis',
              'Listed 3 core supporting arguments',
              'Generated 2 high-value questions for deep reading',
            ],
            coachMode: 'reading_coach',
            xpReward: 80,
          },
        },
        {
          id: 'rm-l2',
          moduleId: 'rm-mod-1',
          title: 'Speed & Retention Mechanics: Visual Pacing & Chunking',
          durationMinutes: 25,
          summary:
            'Slow reading is caused by eye regression (re-reading lines) and word-by-word fixation. Using a visual pacer and expanding peripheral eye span boosts speed without sacrificing comprehension.',
          keyConcepts: ['Visual Pacer', 'Regression Elimination', 'Phrase Chunking (3–4 words)', 'Comprehension Calibration'],
          frameworkName: 'Guided Visual Pacing',
          actionableTakeaway:
            'Use a finger, pen, or cursor smoothly under each line to stop involuntary back-skipping.',
          xpReward: 100,
          drill: {
            id: 'rm-d2',
            title: '3-Minute Paced Reading & Recall Check',
            type: 'reading_sprint',
            durationMinutes: 5,
            prompt:
              'Read 2 pages of dense material using a smooth visual pacer at 1.25x your normal pace, then close the text and write every key fact you recall.',
            steps: [
              'Set a 3-minute timer and track smoothly with a pacer—zero back-skipping.',
              'Close the page immediately when the timer ends.',
              'Spend 2 minutes writing a free-recall bullet list and grade your retention.',
            ],
            successCriteria: [
              'Zero eye regressions during the 3-minute sprint',
              'Recalled at least 5 distinct concepts accurately',
            ],
            coachMode: 'reading_coach',
            xpReward: 85,
          },
        },
      ],
    },
    {
      id: 'rm-mod-2',
      trackId: 'reading-mastery',
      order: 2,
      title: 'Analytical Reading, SQ3R & Zettelkasten Synthesis',
      subtitle: 'Convert what you read into permanent, retrievable long-term memory.',
      estimatedMinutes: 95,
      lessons: [
        {
          id: 'rm-l3',
          moduleId: 'rm-mod-2',
          title: 'SQ3R Mastery for High-Stakes Technical Exams',
          durationMinutes: 30,
          summary:
            'Survey, Question, Read, Recite, Review transforms passive highlighting (low retention) into active retrieval practice (high retention).',
          keyConcepts: ['Survey', 'Question', 'Active Read', 'Closed-Book Recite', 'Spaced Review (FSRS)'],
          frameworkName: 'SQ3R + Active Recall',
          actionableTakeaway:
            'Stop highlighting paragraphs; instead, turn every heading into a question and recite the answer from memory.',
          xpReward: 110,
          drill: {
            id: 'rm-d3',
            title: 'SQ3R Closed-Book Synthesis',
            type: 'sq3r_synthesis',
            durationMinutes: 8,
            prompt:
              'Take one certification domain topic (e.g., Zero Trust or Risk Appetite) and execute all 5 SQ3R steps, ending with 2 FSRS flashcards.',
            steps: [
              'Turn 3 subheadings into exam-style questions.',
              'Read to extract exact answers.',
              'Close the text and recite the answers aloud or in writing.',
              'Distill the 2 highest-yield insights into Q&A flashcards.',
            ],
            successCriteria: [
              '3 clear questions created before reading',
              'Closed-book recitation completed accurately',
              '2 atomic FSRS cards drafted',
            ],
            coachMode: 'reading_coach',
            xpReward: 95,
          },
        },
        {
          id: 'rm-l4',
          moduleId: 'rm-mod-2',
          title: 'Zettelkasten & Syntopical Reading Across Multiple Books',
          durationMinutes: 35,
          summary:
            'Build an interconnected web of atomic notes in your own words, and compare how two different authors (e.g., Bill Walsh vs Jim Collins) solve the same leadership problem.',
          keyConcepts: ['Atomic Notes', 'Own-Words Translation', 'Cross-Linking', 'Syntopical Comparison'],
          frameworkName: 'Zettelkasten + Syntopical Synthesis',
          actionableTakeaway:
            'One note = one idea in your own words, linked to at least one other idea you already know.',
          xpReward: 120,
          drill: {
            id: 'rm-d4',
            title: 'Atomic Zettelkasten Note & Cross-Book Link',
            type: 'zettelkasten_card',
            durationMinutes: 7,
            prompt:
              'Write one atomic note connecting Bill Walsh’s "Standard of Performance" with James Clear’s "Systems over Goals" or ISACA’s "Control Environment".',
            steps: [
              'Give the note a claim-based title (e.g., "Daily Standards Outperform Outcome Obsession").',
              'Explain the idea in 4–5 sentences strictly in your own words.',
              'Add 2 explicit links to other books or certification domains.',
            ],
            successCriteria: [
              'Claim-based title (not a vague topic label)',
              '100% original wording without copy-pasting',
              'At least 2 meaningful cross-domain links',
            ],
            coachMode: 'reading_coach',
            xpReward: 100,
          },
        },
      ],
    },
  ],
};
