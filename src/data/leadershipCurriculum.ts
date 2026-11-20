/* ===================================================================
   ANOXPASS — Leadership Mastery Academy Curriculum
   Anchored by Bill Walsh's Standard of Performance + Global Classics
   =================================================================== */

import type { AcademyTrack } from '../types/academy';

export const LEADERSHIP_CURRICULUM: AcademyTrack = {
  id: 'leadership-mastery',
  title: 'Leadership Mastery',
  subtitle: 'Build championship standards, decisive judgment, and high-trust teams.',
  description:
    'An executive leadership academy integrating Bill Walsh’s Standard of Performance, Extreme Ownership, Level 5 Leadership, and Kahneman’s Decision Science into weekly case-study drills.',
  icon: '👑',
  accentColor: '#8b5cf6',
  coachMode: 'leadership_mentor',
  estimatedHours: 14,
  coreOutcomes: [
    'Design and enforce a Bill Walsh-style Standard of Performance for yourself and your team',
    'Lead through crises using scripted contingency plans and calm emotional discipline',
    'Practice Extreme Ownership and Decentralized Command without micromanagement',
    'Make bias-resistant executive decisions using pre-mortems and System 2 checklists',
  ],
  modules: [
    {
      id: 'ld-mod-1',
      trackId: 'leadership-mastery',
      order: 1,
      title: 'The Standard of Performance (Bill Walsh Operating System)',
      subtitle: 'Why elite leaders obsess over daily standards rather than the scoreboard.',
      estimatedMinutes: 90,
      lessons: [
        {
          id: 'ld-l1',
          moduleId: 'ld-mod-1',
          title: 'Designing Your Standard of Performance',
          durationMinutes: 30,
          summary:
            'Bill Walsh rebuilt the 49ers from worst to first by defining exact behavioral standards for every role. When standards are crystal clear and non-negotiable, excellence becomes cultural habit.',
          keyConcepts: ['Process Over Scoreboard', 'Behavioral Precision', 'Culture of Accountability', 'Coach as Teacher'],
          frameworkName: 'Bill Walsh Standard of Performance',
          actionableTakeaway:
            'Replace vague goals ("do better") with observable daily standards ("every incident report includes root cause, owner, and 48-hour verification").',
          xpReward: 110,
          drill: {
            id: 'ld-d1',
            title: 'Draft a 5-Point Standard of Performance Charter',
            type: 'decision_matrix',
            durationMinutes: 8,
            prompt:
              'You just inherited an underperforming IT security or project team with missed deadlines and low morale. Draft 5 concrete, observable Standards of Performance you will install in Week 1.',
            steps: [
              'Define 2 communication & preparation standards.',
              'Define 2 execution & quality standards.',
              'Define 1 accountability & post-mortem standard.',
            ],
            successCriteria: [
              'Every standard is observable and measurable (not vague)',
              'Focuses on behaviors within the team’s direct control',
              'Explains how you will teach and model each standard',
            ],
            coachMode: 'leadership_mentor',
            xpReward: 95,
          },
        },
        {
          id: 'ld-l2',
          moduleId: 'ld-mod-1',
          title: 'Scripted Contingency Planning & Calm Crisis Command',
          durationMinutes: 30,
          summary:
            'Great leaders do not improvise in a fire—they script responses in calm weather. Combine Walsh’s scripted playbooks with Jocko Willink’s Prioritize & Execute.',
          keyConcepts: ['Pre-Decided Playbooks', 'Emotional Detachment', 'Prioritize & Execute', 'Commander’s Intent'],
          frameworkName: 'Walsh Scripting + Combat Laws',
          actionableTakeaway:
            'In any crisis: detach emotionally, identify the #1 threat, execute the pre-scripted containment, and communicate clearly.',
          xpReward: 110,
          drill: {
            id: 'ld-d2',
            title: 'Ransomware / Executive Crisis Case Study',
            type: 'case_study',
            durationMinutes: 10,
            prompt:
              'At 4:45 PM Friday, a critical production database shows anomalous encryption activity while the CEO is demanding an immediate press statement. Walk through your first 15 minutes as leader.',
            steps: [
              'Apply "Detach -> Prioritize -> Execute" to rank your top 3 actions.',
              'State how you protect the team from panic (Circle of Safety).',
              'Draft your 3-sentence BLUF update to the CEO.',
            ],
            successCriteria: [
              'Containment prioritized before premature public statements',
              'Clear delegation with Commander’s Intent',
              'Calm, factual executive communication',
            ],
            coachMode: 'leadership_mentor',
            xpReward: 100,
          },
        },
      ],
    },
    {
      id: 'ld-mod-2',
      trackId: 'leadership-mastery',
      order: 2,
      title: 'Trust, Ownership & Bias-Resistant Decision Science',
      subtitle: 'Combine psychological safety with unflinching realism and Level 5 resolve.',
      estimatedMinutes: 90,
      lessons: [
        {
          id: 'ld-l3',
          moduleId: 'ld-mod-2',
          title: 'Extreme Ownership Meets the Circle of Safety',
          durationMinutes: 30,
          summary:
            'High-performing teams pair radical personal accountability (Extreme Ownership) with deep interpersonal trust (Leaders Eat Last). Own failures publicly; share credit generously.',
          keyConcepts: ['Window & Mirror', 'Decentralized Command', 'Psychological Safety', 'Blameless Post-Mortems'],
          frameworkName: 'High-Trust Accountability Loop',
          actionableTakeaway:
            'When a mistake happens, ask "What failed in our system or clarity?" before ever blaming an individual.',
          xpReward: 110,
          drill: {
            id: 'ld-d3',
            title: 'Difficult Accountability Conversation Simulation',
            type: 'case_study',
            durationMinutes: 8,
            prompt:
              'A talented senior engineer missed a critical compliance deadline because they got pulled into ad-hoc requests. Script your 1-on-1 feedback conversation using Extreme Ownership + Walsh’s calm intensity.',
            steps: [
              'Take ownership of any unclear prioritization on your part.',
              'State the non-negotiable standard objectively.',
              'Co-create a concrete boundary/system to prevent recurrence.',
            ],
            successCriteria: [
              'Zero sarcasm, blame, or passive-aggressiveness',
              'Clear accountability + supportive system fix',
            ],
            coachMode: 'leadership_mentor',
            xpReward: 95,
          },
        },
        {
          id: 'ld-l4',
          moduleId: 'ld-mod-2',
          title: 'Executive Decision Science: Pre-Mortems & Stockdale Paradox',
          durationMinutes: 30,
          summary:
            'Defeat System 1 overconfidence and groupthink by running Kahneman’s Pre-Mortem and confronting Jim Collins’s Brutal Facts before committing major resources.',
          keyConcepts: ['System 1 vs System 2', 'Pre-Mortem Analysis', 'Stockdale Paradox', 'Base-Rate Thinking'],
          frameworkName: 'Kahneman Pre-Mortem Protocol',
          actionableTakeaway:
            'Before any major launch or career bet, spend 10 minutes assuming it failed and listing the top 3 reasons why.',
          xpReward: 120,
          drill: {
            id: 'ld-d4',
            title: 'Run a 5-Minute Executive Pre-Mortem',
            type: 'reflection',
            durationMinutes: 6,
            prompt:
              'Imagine 6 months from today your top certification or leadership initiative has failed. Write the 3 most likely root causes and 1 preventative guardrail for each.',
            steps: [
              'Identify 3 brutal, realistic failure modes (e.g., inconsistent schedule, weak domain avoidance).',
              'Attach 1 concrete, automated guardrail to each failure mode.',
            ],
            successCriteria: [
              '3 specific, non-generic failure modes',
              'Each paired with a concrete weekly guardrail',
            ],
            coachMode: 'leadership_mentor',
            xpReward: 100,
          },
        },
      ],
    },
  ],
};
