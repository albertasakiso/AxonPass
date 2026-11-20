/* ===================================================================
   ANOXPASS — Top Leadership Books Library
   Anchor Book: "The Score Takes Care of Itself" by Bill Walsh
   =================================================================== */

import type { LeadershipBook } from '../types/academy';

export const LEADERSHIP_BOOKS: LeadershipBook[] = [
  {
    id: 'the-score-takes-care-of-itself',
    title: 'The Score Takes Care of Itself',
    subtitle: 'My Philosophy of Leadership',
    author: 'Bill Walsh (with Steve Jamison & Craig Walsh)',
    year: 2009,
    category: 'Culture & Standards',
    featured: true,
    readTimeMinutes: 25,
    difficulty: 3,
    accentColor: '#d97706',
    executiveSummary:
      'Hall of Fame San Francisco 49ers head coach Bill Walsh reveals how he transformed the worst franchise in pro football into a three-time Super Bowl dynasty—not by obsessing over the scoreboard, but by installing an uncompromising "Standard of Performance" across every single person, habit, and detail in the organization.',
    whyItMatters:
      'Whether you are preparing for elite certifications, leading a security team, or building an enterprise, Walsh proves that championship results are the inevitable byproduct of meticulous daily standards, teaching, and contingency planning.',
    coreFramework: 'The Standard of Performance (Process & Culture -> Inevitable Score)',
    keyIdeas: [
      {
        id: 'walsh-1',
        number: 1,
        title: 'Install a Standard of Performance Before Chasing the Score',
        summary:
          'When Walsh took over a 2–14 team, he stopped talking about winning games. Instead, he defined exact behavioral and operational standards for everyone—from quarterbacks to receptionists—on how to dress, communicate, prepare, and execute.',
        mentalModel: 'Process-First Excellence: Standards create identity; identity creates results.',
        actionDrill:
          'Write 5 non-negotiable daily Standards of Performance for your study or leadership routine (e.g., how you start sessions, review mistakes, and close each day).',
        quote: 'The score takes care of itself when you take care of the Standard of Performance.',
      },
      {
        id: 'walsh-2',
        number: 2,
        title: 'Leadership Is Primarily Teaching',
        summary:
          'Walsh viewed himself first as a teacher, not a cheerleader or dictator. Great leaders break complex systems into teachable, repeatable fundamentals and drill them until execution becomes automatic under stress.',
        mentalModel: 'Coach-as-Teacher: Clarity + Repetition = Composure Under Pressure.',
        actionDrill:
          'Take one complex concept from your current certification or team workflow and teach it aloud in 3 minutes using simple, concrete steps.',
      },
      {
        id: 'walsh-3',
        number: 3,
        title: 'Scripted Contingency Planning Eliminates Panic',
        summary:
          'Walsh famously scripted the first 15–25 plays of every game and rehearsed rare crisis scenarios during calm mid-week practices so that when chaos hit on Sunday, his team executed calm, pre-decided responses.',
        mentalModel: 'Pre-Mortem Scripting: Make high-stakes decisions when your heart rate is low.',
        actionDrill:
          'Script your exact contingency plan for your next high-stakes exam or executive presentation (e.g., what to do if you fall behind on time or face an unexpected question).',
      },
      {
        id: 'walsh-4',
        number: 4,
        title: 'Precision in Communication & Emotional Discipline',
        summary:
          'A leader’s tone sets the emotional thermostat of the room. Walsh demanded concise, respectful, direct communication—avoiding public humiliation while holding people ruthlessly accountable to the standard.',
        mentalModel: 'Calm Intensity: High standards paired with emotional control.',
        actionDrill:
          'In your next difficult conversation or feedback session, state the standard objectively, explain the gap without blame, and agree on one immediate corrective action.',
      },
      {
        id: 'walsh-5',
        number: 5,
        title: 'Guard Against Complacency After Success',
        summary:
          'Walsh warned that the most dangerous moment for any leader or organization is right after a major victory. Continual innovation, humility, and refreshing the standard prevent the "disease of me."',
        mentalModel: 'Day-One Hunger: Re-earn your standard every single morning.',
        actionDrill:
          'Audit one area where you have become comfortable and raise one measurable standard by 10% this week.',
      },
    ],
    discussionPrompts: [
      'Where in your current work or study routine are you watching the scoreboard instead of upgrading your Standard of Performance?',
      'Which recurring crisis or bottleneck could you eliminate this week with a Walsh-style scripted contingency plan?',
      'How can you shift from managing/instructing to teaching in your next team interaction?',
    ],
    tags: ['Bill Walsh', 'Standard of Performance', 'Culture', 'Contingency Planning', 'Teaching'],
  },
  {
    id: 'extreme-ownership',
    title: 'Extreme Ownership',
    subtitle: 'How U.S. Navy SEALs Lead and Win',
    author: 'Jocko Willink & Leif Babin',
    year: 2015,
    category: 'Ownership & Execution',
    readTimeMinutes: 20,
    difficulty: 2,
    accentColor: '#dc2626',
    executiveSummary:
      'Former Navy SEAL commanders translate battlefield leadership lessons into business execution: there are no bad teams, only bad leaders—and total accountability is the foundation of trust and high performance.',
    whyItMatters:
      'Eliminates blame culture and builds the decisive clarity required for incident response, audit leadership, and high-stakes execution.',
    coreFramework: 'The 4 Laws of Combat: Cover & Move, Simple, Prioritize & Execute, Decentralized Command',
    keyIdeas: [
      {
        id: 'eo-1',
        number: 1,
        title: 'Own Everything in Your World',
        summary:
          'Leaders never blame subordinates, external conditions, or upper management. When something fails, the leader asks: "What could I have communicated, trained, or planned better?"',
        mentalModel: 'Zero-Excuse Accountability.',
        actionDrill:
          'Identify one recent setback and write down three actions strictly within your control that would prevent it next time.',
      },
      {
        id: 'eo-2',
        number: 2,
        title: 'Prioritize and Execute',
        summary:
          'When overwhelmed by multiple emergencies, step back, detach emotionally, identify the single highest-priority problem, direct all resources to it, and then move to the next.',
        mentalModel: 'Relax -> Look Around -> Make a Call.',
        actionDrill:
          'List your top 5 current tasks, pick the #1 highest-leverage item, and block 60 uninterrupted minutes to finish it first.',
      },
      {
        id: 'eo-3',
        number: 3,
        title: 'Decentralized Command',
        summary:
          'Micromanagement collapses under scale. Empower junior leaders by clearly communicating the Commander’s Intent (the "why") and boundaries, then let them execute.',
        mentalModel: 'Explain the Why, Not Every Step.',
        actionDrill:
          'When delegating your next task, state the desired outcome, why it matters, and decision boundaries—then let the owner choose the method.',
      },
    ],
    discussionPrompts: [
      'Where are you subtly blaming circumstances instead of taking Extreme Ownership?',
      'Which complex plan in your organization needs to be simplified so everyone understands the Commander’s Intent?',
    ],
    tags: ['Accountability', 'Execution', 'Decentralized Command', 'Crisis Leadership'],
  },
  {
    id: 'leaders-eat-last',
    title: 'Leaders Eat Last',
    subtitle: 'Why Some Teams Pull Together and Others Don’t',
    author: 'Simon Sinek',
    year: 2014,
    category: 'Trust & Team Leadership',
    readTimeMinutes: 18,
    difficulty: 2,
    accentColor: '#2563eb',
    executiveSummary:
      'Simon Sinek explains the biology of trust and psychological safety: great leaders build a "Circle of Safety" where people feel protected from internal politics so they can unite against external challenges.',
    whyItMatters:
      'High-trust teams innovate faster, report security risks earlier, and outperform fear-driven organizations over the long term.',
    coreFramework: 'The Circle of Safety (Oxytocin & Serotonin over Cortisol)',
    keyIdeas: [
      {
        id: 'lel-1',
        number: 1,
        title: 'Build the Circle of Safety',
        summary:
          'When employees fear internal politics or layoffs, cortisol spikes and energy goes to self-protection. When leaders protect their people, energy goes to mission and innovation.',
        mentalModel: 'Protect Inside -> Win Outside.',
        actionDrill:
          'In your next team meeting, explicitly ask: "What obstacle is slowing you down that I can remove for you this week?"',
      },
      {
        id: 'lel-2',
        number: 2,
        title: 'Leadership Is a Choice, Not a Rank',
        summary:
          'Authority comes from title; leadership comes from sacrificing your own comfort to help those around you succeed.',
        mentalModel: 'Service Over Status.',
        actionDrill:
          'Give public credit to a peer or team member for a win while privately absorbing the friction of a difficult task.',
      },
    ],
    discussionPrompts: [
      'How safe do people on your team feel admitting a mistake early?',
      'What is one small sacrifice you can make this week to strengthen trust with your team?',
    ],
    tags: ['Trust', 'Psychological Safety', 'Culture', 'Servant Leadership'],
  },
  {
    id: 'good-to-great',
    title: 'Good to Great',
    subtitle: 'Why Some Companies Make the Leap... and Others Don’t',
    author: 'Jim Collins',
    year: 2001,
    category: 'Strategy & Greatness',
    readTimeMinutes: 22,
    difficulty: 4,
    accentColor: '#7c3aed',
    executiveSummary:
      'Based on a five-year empirical study of companies that achieved sustained market-beating performance, Jim Collins uncovers the timeless principles of Level 5 Leadership, First Who Then What, the Hedgehog Concept, and the Flywheel.',
    whyItMatters:
      'Equips senior leaders and architects with strategic discipline to focus on what truly drives compounding organizational momentum.',
    coreFramework: 'Level 5 Leadership + Hedgehog Concept + Flywheel Effect',
    keyIdeas: [
      {
        id: 'gtg-1',
        number: 1,
        title: 'Level 5 Leadership: Humility + Fierce Resolve',
        summary:
          'The greatest leaders channel their ego away from themselves and into the larger goal of building a great institution—looking out the window to credit others and in the mirror to accept responsibility.',
        mentalModel: 'Window and Mirror Leadership.',
        actionDrill:
          'Review your last project outcome: write 2 external credits (window) and 2 personal improvements (mirror).',
      },
      {
        id: 'gtg-2',
        number: 2,
        title: 'Confront the Brutal Facts (The Stockdale Paradox)',
        summary:
          'Retain unwavering faith that you will prevail in the end, while simultaneously confronting the most brutal facts of your current reality.',
        mentalModel: 'Unflinching Realism + Unshakeable Faith.',
        actionDrill:
          'Write down the single hardest truth about your current exam readiness or project risk—and your concrete plan to face it.',
      },
      {
        id: 'gtg-3',
        number: 3,
        title: 'The Flywheel Effect',
        summary:
          'Breakthroughs never come from a single dramatic push. They come from relentlessly pushing a heavy flywheel in one consistent direction until momentum compounds.',
        mentalModel: 'Compounding Consistency Beats Sporadic Intensity.',
        actionDrill:
          'Define the 3 repeatable weekly habits that turn your personal mastery flywheel.',
      },
    ],
    discussionPrompts: [
      'What is your personal Hedgehog Concept—the intersection of what you are deeply passionate about, can be best in the world at, and drives your career engine?',
      'Which brutal fact have you been avoiding confronting?',
    ],
    tags: ['Strategy', 'Level 5 Leadership', 'Flywheel', 'Stockdale Paradox'],
  },
  {
    id: 'seven-habits',
    title: 'The 7 Habits of Highly Effective People',
    subtitle: 'Powerful Lessons in Personal Change',
    author: 'Stephen R. Covey',
    year: 1989,
    category: 'Personal Effectiveness',
    readTimeMinutes: 20,
    difficulty: 2,
    accentColor: '#059669',
    executiveSummary:
      'A principle-centered operating system moving from dependence to independence (Private Victory: Habits 1–3) and interdependence (Public Victory: Habits 4–6), sustained by continuous renewal (Habit 7).',
    whyItMatters:
      'Provides the personal time-management, communication, and integrity foundation behind every sustained leadership career.',
    coreFramework: 'Private Victory -> Public Victory -> Sharpen the Saw',
    keyIdeas: [
      {
        id: 'covey-1',
        number: 1,
        title: 'Focus on Your Circle of Influence',
        summary:
          'Proactive people focus their energy on what they can influence rather than complaining about their Circle of Concern.',
        mentalModel: 'Between Stimulus and Response Lies Choice.',
        actionDrill:
          'Sort your current worries into Circle of Concern vs Circle of Influence; commit to acting only on the latter today.',
      },
      {
        id: 'covey-2',
        number: 2,
        title: 'Put First Things First (Quadrant II)',
        summary:
          'High performers live in Quadrant II (Important, Not Urgent)—deep study, relationship building, prevention, and strategic planning—rather than firefighting Quadrant I crises.',
        mentalModel: 'Schedule Your Priorities, Don’t Prioritize Your Schedule.',
        actionDrill:
          'Block two 90-minute Quadrant II sessions on your calendar for next week before any meetings fill it.',
      },
      {
        id: 'covey-3',
        number: 3,
        title: 'Seek First to Understand, Then to Be Understood',
        summary:
          'Most people listen with the intent to reply, not to understand. Empathic listening builds instant influence and reveals root causes.',
        mentalModel: 'Diagnose Before You Prescribe.',
        actionDrill:
          'In your next conversation, paraphrase the other person’s point to their satisfaction before presenting your own view.',
      },
    ],
    discussionPrompts: [
      'How much of your week is currently spent in Quadrant II (Important, Not Urgent)?',
      'What does "Sharpening the Saw" look like for your mind, body, and craft this month?',
    ],
    tags: ['Effectiveness', 'Quadrant II', 'Proactivity', 'Empathic Listening'],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    year: 2018,
    category: 'Habits & Systems',
    readTimeMinutes: 16,
    difficulty: 1,
    accentColor: '#0ea5e9',
    executiveSummary:
      'James Clear demonstrates that tiny 1% daily improvements compound into extraordinary results—and that lasting change comes from upgrading your identity and environment rather than relying on willpower.',
    whyItMatters:
      'Directly powers daily study streaks, FSRS review consistency, and Bill Walsh’s Standard of Performance in everyday life.',
    coreFramework: 'The 4 Laws of Behavior Change: Obvious, Attractive, Easy, Satisfying',
    keyIdeas: [
      {
        id: 'ah-1',
        number: 1,
        title: 'You Fall to the Level of Your Systems',
        summary:
          'Winners and losers have the same goals. What separates them is the daily system of small, frictionless habits.',
        mentalModel: 'Systems > Goals.',
        actionDrill:
          'Redesign your study environment tonight so your AnoxPass review queue is the first thing visible when you sit down.',
      },
      {
        id: 'ah-2',
        number: 2,
        title: 'Identity-Based Habits & The 2-Minute Rule',
        summary:
          'Every action is a vote for the type of person you wish to become. Scale any new habit down to 2 minutes to master the art of showing up.',
        mentalModel: 'Never Miss Twice.',
        actionDrill:
          'Define a 2-minute minimum version of your daily study, reading, and speaking drills so you never break the chain.',
      },
    ],
    discussionPrompts: [
      'What single friction point is making your most important daily habit harder than it needs to be?',
      'What identity are you casting votes for with your current daily schedule?',
    ],
    tags: ['Habits', 'Systems', '1% Better', 'Identity'],
  },
  {
    id: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    subtitle: 'The Two Systems That Drive the Way We Think',
    author: 'Daniel Kahneman',
    year: 2011,
    category: 'Decision Science',
    readTimeMinutes: 22,
    difficulty: 4,
    accentColor: '#ec4899',
    executiveSummary:
      'Nobel laureate Daniel Kahneman maps the two modes of human cognition—fast, intuitive System 1 and slow, analytical System 2—and exposes the cognitive biases that distort executive decisions, risk assessments, and exam reasoning.',
    whyItMatters:
      'Essential for IT auditors, risk managers, and executives who must defeat anchoring, confirmation bias, and overconfidence.',
    coreFramework: 'System 1 (Fast/Intuitive) vs System 2 (Slow/Deliberate) + Pre-Mortem',
    keyIdeas: [
      {
        id: 'tfs-1',
        number: 1,
        title: 'Recognize When System 1 Hijacks System 2',
        summary:
          'Under time pressure or fatigue, System 1 substitutes an easier question for a hard one, causing snap judgments on complex risk or exam scenarios.',
        mentalModel: 'Slow Down When the Stakes Are High.',
        actionDrill:
          'On your next 10 difficult practice questions, force System 2 to engage by explicitly stating why each wrong distractor is eliminated.',
      },
      {
        id: 'tfs-2',
        number: 2,
        title: 'Use the Pre-Mortem to Defeat Overconfidence',
        summary:
          'Before launching a major project, imagine it is one year later and the project has failed catastrophically. Ask the team to write the history of why it failed.',
        mentalModel: 'Prospective Hindsight.',
        actionDrill:
          'Run a 5-minute pre-mortem on your upcoming certification exam or leadership initiative and list the top 3 failure modes.',
      },
    ],
    discussionPrompts: [
      'Which cognitive bias (anchoring, availability, confirmation bias) most frequently affects your decisions?',
      'Where can you install a checklist or pre-mortem to protect high-stakes judgments?',
    ],
    tags: ['Cognitive Biases', 'System 1 & 2', 'Decision Science', 'Pre-Mortem'],
  },
];
