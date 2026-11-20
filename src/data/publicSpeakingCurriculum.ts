/* ===================================================================
   ANOXPASS — Public Speaking Mastery Academy Curriculum
   Rhetoric, Vocal Delivery, Storytelling, Impromptu Speaking & Presence
   =================================================================== */

import type { AcademyTrack } from '../types/academy';

export const PUBLIC_SPEAKING_CURRICULUM: AcademyTrack = {
  id: 'public-speaking',
  title: 'Public Speaking Mastery',
  subtitle: 'Command any room, boardroom, or stage with clarity, poise, and persuasive power.',
  description:
    'A deliberate-practice academy combining classical rhetoric, vocal engineering, executive storytelling, and high-pressure impromptu speaking drills.',
  icon: '🎙️',
  accentColor: '#f59e0b',
  coachMode: 'speech_coach',
  estimatedHours: 12,
  coreOutcomes: [
    'Structure persuasive talks in 30 seconds using PREP, Pyramid Principle, and Ethos/Pathos/Logos',
    'Eliminate filler words ("um", "uh", "like") using deliberate strategic pauses',
    'Deliver compelling executive stories and handle hostile Q&A with calm authority',
    'Master vocal projection, pace modulation, and physical stage presence',
  ],
  modules: [
    {
      id: 'ps-mod-1',
      trackId: 'public-speaking',
      order: 1,
      title: 'Rhetorical Architecture & Executive Clarity',
      subtitle: 'Build unshakeable structure so audiences remember your core message.',
      estimatedMinutes: 90,
      lessons: [
        {
          id: 'ps-l1',
          moduleId: 'ps-mod-1',
          title: 'The Minto Pyramid & Bottom-Line-Up-Front (BLUF)',
          durationMinutes: 25,
          summary:
            'Executives and busy audiences tune out long build-ups. Start with your governing conclusion, support it with 3 logical pillars, and back each pillar with concrete evidence.',
          keyConcepts: ['BLUF Opening', 'Rule of Three', 'MECE Pillars', 'Signposting'],
          frameworkName: 'Minto Pyramid Principle',
          actionableTakeaway:
            'Never make your audience wait for the point—state your core recommendation in the first 20 seconds.',
          xpReward: 100,
          drill: {
            id: 'ps-d1',
            title: '60-Second BLUF Executive Briefing',
            type: 'timed_speech',
            durationMinutes: 3,
            prompt:
              'Brief a Board of Directors on why the organization must invest in automated backup immutability or a key strategic initiative—conclusion first, then 3 supporting reasons.',
            steps: [
              'State your recommendation in 1 crisp sentence (0:00–0:10).',
              'Deliver 3 numbered supporting points with concrete impact (0:10–0:45).',
              'Close with a clear decision ask (0:45–1:00).',
            ],
            successCriteria: [
              'Conclusion delivered within the first 10 seconds',
              'Exactly 3 distinct supporting points',
              'Zero filler words during transitions',
            ],
            coachMode: 'speech_coach',
            xpReward: 75,
          },
        },
        {
          id: 'ps-l2',
          moduleId: 'ps-mod-1',
          title: 'Aristotle’s Triad: Ethos, Pathos & Logos',
          durationMinutes: 30,
          summary:
            'Data alone rarely moves people to act. Balance credibility (Ethos), human stakes (Pathos), and airtight logic (Logos) to persuade skeptical audiences.',
          keyConcepts: ['Ethos (Credibility)', 'Pathos (Emotional Stakes)', 'Logos (Data & Logic)', 'Contrast Framing'],
          frameworkName: 'Classical Rhetorical Triad',
          actionableTakeaway:
            'Audit every high-stakes talk: if it is 100% Logos, add one human story; if it is 100% Pathos, anchor it with one hard metric.',
          xpReward: 100,
          drill: {
            id: 'ps-d2',
            title: '90-Second Persuasion Triad Drill',
            type: 'timed_speech',
            durationMinutes: 4,
            prompt:
              'Persuade a skeptical team to adopt a new cybersecurity or productivity standard using 30s of Ethos, 30s of Pathos, and 30s of Logos.',
            steps: [
              'Open with shared values and earned credibility (Ethos).',
              'Illustrate the human cost of inaction with a vivid scenario (Pathos).',
              'Close with measurable ROI and risk reduction (Logos).',
            ],
            successCriteria: [
              'Clear transition between credibility, emotion, and logic',
              'Concrete metric included in the Logos section',
            ],
            coachMode: 'speech_coach',
            xpReward: 80,
          },
        },
      ],
    },
    {
      id: 'ps-mod-2',
      trackId: 'public-speaking',
      order: 2,
      title: 'Vocal Delivery, Pacing & Strategic Pauses',
      subtitle: 'Turn your voice into an instrument of authority and warmth.',
      estimatedMinutes: 85,
      lessons: [
        {
          id: 'ps-l3',
          moduleId: 'ps-mod-2',
          title: 'The Power of the 2-Second Pause & Filler Elimination',
          durationMinutes: 25,
          summary:
            'Filler words ("um", "uh", "so", "you know") signal uncertainty. Replacing fillers with silent 2-second pauses projects composure and lets key ideas land.',
          keyConcepts: ['Diaphragmatic Breathing', '2-Second Power Pause', 'Downward Inflection', 'Pace Contrast (130–160 WPM)'],
          frameworkName: 'Pause-Breathe-Land Technique',
          actionableTakeaway:
            'End declarative sentences with a downward pitch inflection—never upspeak your conclusions.',
          xpReward: 100,
          drill: {
            id: 'ps-d3',
            title: 'Zero-Filler 60-Second Sprint',
            type: 'vocal_drill',
            durationMinutes: 3,
            prompt:
              'Explain a concept you studied today for 60 seconds. Every time you feel an "um" coming, close your mouth, breathe for 2 full seconds, and resume.',
            steps: [
              'Stand tall with shoulders relaxed and feet grounded.',
              'Speak at a deliberate 140 WPM with crisp articulation.',
              'Insert at least three intentional 2-second silent pauses.',
            ],
            successCriteria: [
              'Zero audible filler words',
              'At least 3 clean 2-second pauses',
              'Downward vocal inflection on the final sentence',
            ],
            coachMode: 'speech_coach',
            xpReward: 85,
          },
        },
      ],
    },
    {
      id: 'ps-mod-3',
      trackId: 'public-speaking',
      order: 3,
      title: 'Storytelling, Impromptu Speaking & Executive Presence',
      subtitle: 'Think on your feet and captivate audiences without notes.',
      estimatedMinutes: 100,
      lessons: [
        {
          id: 'ps-l4',
          moduleId: 'ps-mod-3',
          title: 'High-Impact Storytelling with Sparkline & STAR-L',
          durationMinutes: 30,
          summary:
            'Stories are 22x more memorable than raw facts. Contrast "What Is" with "What Could Be" to create narrative tension that pulls listeners toward your call to action.',
          keyConcepts: ['Status Quo vs Ideal Future', 'Sensory Anchoring', 'Vulnerability + Lesson', 'Call to Action'],
          frameworkName: 'Nancy Duarte Sparkline',
          actionableTakeaway:
            'Start stories in the middle of the action ("Last Tuesday at 2:00 AM...") rather than with dry background.',
          xpReward: 110,
          drill: {
            id: 'ps-d4',
            title: '2-Minute Leadership Story Drill',
            type: 'timed_speech',
            durationMinutes: 5,
            prompt:
              'Tell a 2-minute story about a setback or tough decision that taught you a lasting leadership or technical lesson.',
            steps: [
              'Drop the listener directly into the moment of tension (20s).',
              'Describe the turning point and decision made (50s).',
              'Deliver the universal takeaway for the audience (50s).',
            ],
            successCriteria: [
              'Starts in media res (inside the scene)',
              'Clear emotional or strategic turning point',
              'Memorable 1-sentence closing lesson',
            ],
            coachMode: 'speech_coach',
            xpReward: 90,
          },
        },
        {
          id: 'ps-l5',
          moduleId: 'ps-mod-3',
          title: 'Impromptu Mastery: PREP & Handling Tough Q&A',
          durationMinutes: 30,
          summary:
            'When put on the spot, use PREP (Point -> Reason -> Example -> Point) to deliver a structured, executive-grade answer with zero panic.',
          keyConcepts: ['PREP Framework', 'Bridge & Pivot', 'Buying Thinking Time', 'Eye-Contact Locking'],
          frameworkName: 'PREP Impromptu Framework',
          actionableTakeaway:
            'Pause 2 seconds after any tough question, validate the question, then lock into Point -> Reason -> Example -> Point.',
          xpReward: 120,
          drill: {
            id: 'ps-d5',
            title: 'Random Impromptu Executive Q&A',
            type: 'impromptu_prompt',
            durationMinutes: 4,
            prompt:
              'Answer on the spot with 10 seconds prep: "Why should we prioritize long-term standards over hitting this quarter’s short-term target?"',
            steps: [
              'Point: State your clear thesis in 1 sentence.',
              'Reason: Give the core strategic rationale.',
              'Example: Cite a concrete example (e.g., Bill Walsh or a real project).',
              'Point: Restate your thesis with conviction.',
            ],
            successCriteria: [
              'Completed within 60–90 seconds',
              'Cleanly followed all 4 PREP steps',
              'Calm posture and steady eye contact throughout',
            ],
            coachMode: 'speech_coach',
            xpReward: 100,
          },
        },
      ],
    },
  ],
};
