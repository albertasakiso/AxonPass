/* ===================================================================
   ANOXPASS — End-to-End Certification Course: FIFA Football Agent Exam
   2026 Edition — Open-Book Regulatory Precision Mastery (Tier 3)
   Grounded verbatim in my_documents/FIFA AGENT LICENSE/:
   - 20260115_Study Materials_EN_FINAL_CLEAN.pdf (Jan 2026, 1,010 pp.)
   - 20260113_FINAL CLEAN_FIFA-Football-Agent-Exam-Rules-6th-Edition-JAN-2026-edition_EN.pdf
   - Circular 1956 (2026 Exam), Circular 1873, Circular 1917 (Diarra),
     Circular 1918, Circular 1919 (Online Exam), Circular 1887.
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const FIFA_AGENT_COURSE: CertificationCourse = {
  certId: 'fifa-agent',
  certCode: 'FIFA-AGENT',
  title: 'FIFA Licensed Football Agent Examination (2026 Edition)',
  provider: 'FIFA',
  tier: 3,
  tagline:
    'Master the 1,010-page January 2026 FIFA Study Materials—FFAR, RSTP (incl. Diarra Circular 1917), Football Tribunal, Clearing House, and Guardians Safeguarding.',
  estimatedTotalHours: 65,
  passingScore: '75% (15 / 20 correct in 60 minutes — Online Open-Book Digital Format)',
  domains: [
    // =================================================================
    // DOMAIN 1: FIFA Football Agent Regulations — FFAR (40%)
    // =================================================================
    {
      id: 'fifa-d1',
      domainNumber: 1,
      title: 'FIFA Football Agent Regulations (FFAR — Jan 2025 Ed. & Circulars)',
      examWeightPercent: 40,
      overview:
        'The largest exam pillar (40%). Covers licensing eligibility (Art. 4–5), 2026 online Exam Rules (6th Ed.) & CPD (Art. 9), Representation Agreements, exclusivity, minors (Art. 13), sole permitted dual representation (Art. 12), marginal service fee cap math (Art. 14–15), Circular 1873 suspensions, and 14-day/30-day Platform disclosure rules (Art. 16).',
      lessons: [
        {
          id: 'fifa-d1-l1',
          title: 'Licensing Eligibility (Art. 4–5), 2026 Online Exam Rules & CPD Requirements',
          estimatedMinutes: 45,
          summary:
            'Master who can hold a FIFA Football Agent licence, permanent vs. 5-year vs. 12-month eligibility disqualifiers, Agency liability rules (Art. 11), annual CPD obligations (Art. 9), and the January 2026 online proctored Exam Rules (Circulars 1919 & 1956).',
          learningObjectives: [
            'Verify all four mandatory conditions to become a FIFA Football Agent (Art. 4) and understand that ONLY natural persons—never companies—can be licensed.',
            'Memorize exact FFAR Art. 5 eligibility timelines: permanent criminal disqualifiers, 5-year bankruptcy bar, 24-month unlicensed-service bar, and 12-month sports-betting interest bar.',
            'Apply FFAR Art. 11 Agency rules: non-licensed employees/contractors may NEVER perform Football Agent Services or Approach clients, and prohibited parties cannot hold an Interest in an Agency.',
            'Navigate the 2026 online Exam Rules (6th Edition) and Circular 1956 rules: 20 questions, 60 minutes, 75% pass mark, digital-only open-book Study Materials.',
          ],
          coreConcepts: [
            {
              heading: 'Becoming a Licensed Agent (FFAR Art. 4 & Art. 5 Eligibility Clock)',
              explanation:
                'Under FFAR Art. 4, ONLY a **natural person** (never a corporate agency!) may become a FIFA Football Agent by: (a) submitting a complete application via the FIFA Agent Platform, (b) satisfying Art. 5 eligibility requirements at application AND continuously at all times after licensing, (c) passing the FIFA exam, and (d) paying the annual licence fee. Memorize the Art. 5 time windows cold:\n• **Never (Lifetime)**: False/misleading application statements; criminal convictions (including settlements!) for organized crime, drug trafficking, corruption, bribery, money laundering, tax evasion, fraud, match manipulation, misappropriation of funds, sexual offences, or violence.\n• **Past 5 Years (and continuously after)**: Personal bankruptcy, or being a majority shareholder/director/key office holder of a business entering bankruptcy, administration, or liquidation.\n• **Past 24 Months**: Caught performing Football Agent Services without a required licence.\n• **Past 12 Months (and continuously after)**: Holding any Interest in any entity/company that brokers, arranges, or conducts sports betting activities.\n• **Ongoing Conflict Bar**: Cannot be an official/employee of FIFA, a confederation, member association, league, or club (sole narrow exception: appointed/elected player-representative body).',
              mentalModel:
                'Art. 5 Eligibility Countdown: Lifetime (Major Crimes & Lying) -> 5 Years (Bankruptcy) -> 24 Months (Unlicensed Acting) -> 12 Months (Betting Interest). Every single requirement stays active FOREVER after licensing!',
              formulaOrRule:
                'Eligibility Clocks: Crime = Never | Bankruptcy = 5 yrs | Unlicensed Acting = 24 mos | Sports Betting Interest = 12 mos.',
            },
            {
              heading: 'Agencies (Art. 11), Annual CPD (Art. 9) & Licence Termination (Art. 10)',
              explanation:
                'An agent may operate through a corporate Agency (Art. 11 para 3), BUT: (1) any non-licensed employees or contractors hired by the Agency are STRICTLY PROHIBITED from performing Football Agent Services or making an Approach to a potential Client; (2) the licensed Football Agent remains fully liable for regulatory breaches by their Agency or staff; and (3) Clients, ineligible persons (Art. 5), and anyone holding rights to player registration/transfer compensation may NOT hold any Interest in the Agency (Art. 11 para 4). To keep a licence active, agents must satisfy annual Continuing Professional Development (CPD) credits (Art. 9) and pay the annual fee. If an agent voluntarily requests permanent licence termination (Art. 10), returning later requires repeating the ENTIRE application and exam process from scratch!',
              mentalModel:
                'An Agency is just the office building and billing wrapper—only the licensed human being can legally scout, approach, negotiate, or sign clients.',
            },
            {
              heading: '2026 Online Exam Rules (6th Ed.) & Circular 1919 / 1956',
              explanation:
                'Following Circular 1919 (effective 1 Jan 2025 FFAR amendments) and Circular 1956 (21 Jan 2026), the FIFA Football Agent Exam is conducted **online with remote invigilation** (2026 sessions: 28–30 April and 5–7 May 2026 — the ONLY sessions of the year!). Format: **20 Platform-generated multiple-choice questions** (single- or multi-select—note: multi-select requires ALL correct options with NO partial credit!), **60 minutes**, **75% passing score (15/20)**. Critically, under the Jan 2026 Exam Rules, candidates may consult the official Study Materials **in DIGITAL format ONLY** on their device (meaning lightning-fast PDF `Ctrl+F` keyword search and bookmarking are your ultimate competitive weapons!).',
              mentalModel:
                'The FIFA Exam is NOT a memory test of 1,010 pages—it is a 3-minute-per-question legal research sprint rewarding instant article lookup plus rock-solid calculation mechanics.',
              formulaOrRule:
                '2026 Exam Format: 20 Questions | 60 Minutes (3 min/Q) | 15/20 (75%) to Pass | Remote Proctored Online | Digital Study Materials ONLY.',
            },
          ],
          realWorldScenario: {
            title: 'The Non-Licensed "Talent Scout" Hiring Trap',
            situation:
              'Marco, a newly licensed FIFA Football Agent, incorporates "Apex Sports Agency Ltd." He hires his retired-player cousin Luca (unlicensed) to DM academy prospects on Instagram and pitch signing with Apex Sports. Meanwhile, Marco’s agency accepts a 10% silent equity investment from a current Premier League striker who is also Marco’s Client.',
            analysis:
              'TWO severe FFAR Art. 11 violations occurred immediately: (1) Under Art. 11 para 3, unlicensed Agency employees/contractors (Luca) CANNOT make any Approach to a potential Client or provide Football Agent Services—and Marco is personally disciplined for Luca’s conduct; (2) Under Art. 11 para 4(a), a **Client** (the Premier League striker) is strictly prohibited from holding ANY Interest (equity/ownership) in a Football Agent’s Agency!',
            takeaway:
              'Unlicensed agency staff can handle admin/marketing/PR ("Other Services"), NEVER Approaches or Football Agent Services—and Clients can NEVER own shares in an Agent’s Agency.',
          },
          examTraps: [
            'Trap: Thinking a sports agency company can apply for a FIFA Football Agent licence. ONLY a natural person can be licensed (Art. 4 para 1).',
            'Trap: Mixing up the Art. 5 timelines: Bankruptcy = 5 years, Unlicensed services = 24 months, Sports Betting Interest = 12 months! Always check the exact unit (months vs. years) in the PDF.',
            'Trap: Forgetting that Art. 5 eligibility applies BOTH at application AND continuously AFTER receiving the licence—taking a betting company board seat 2 years after licensing immediately violates eligibility!',
            'Trap: Missing ONE option on a multi-select FIFA exam question. FIFA awards ZERO partial credit on multi-answer questions—verify EVERY option against the exact article text.',
          ],
          keyTerms: [
            {
              term: 'Football Agent Services',
              definition:
                'Football-related services performed for or on behalf of a Client, including any negotiation, communication, or preparatory activity with the purpose of concluding a Transaction.',
            },
            {
              term: 'Other Services',
              definition:
                'Non-agent services performed for a Client (e.g., legal advice, financial planning, scouting, consulting, image rights management, commercial contracts)—subject to anti-circumvention fee scrutiny.',
            },
            {
              term: 'Approach',
              definition:
                'Any physical, in-person, electronic, or third-party contact (direct or indirect) with a Client or anyone connected to a Client to establish Football Agent Services.',
            },
            {
              term: 'Interest (FFAR Definition)',
              definition:
                'Any beneficial ownership, equity share, voting right, profit-sharing right, or influence over a legal entity or person’s affairs.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d1-l1-q1',
              question:
                'Four years ago, Elena was a director of a sports apparel company that entered liquidation. Eight months ago, she sold all her shares in a regulated online sports-betting brokerage. Under FFAR Art. 5, is Elena eligible to apply for a FIFA Football Agent licence today?',
              options: [
                'Yes, because both events happened before she submitted her application',
                'No—she fails BOTH the 5-year bankruptcy/liquidation bar AND the 12-month sports-betting interest bar',
                'No—she passes the liquidation bar (3-year limit) but fails the betting bar',
                'Yes, provided she passes the exam with at least 90% and pays double the annual fee',
              ],
              correctIndex: 1,
              rationale:
                'Under FFAR Art. 5 para 1(c)(i), an applicant must not have been a director of a liquidated business in the past 5 years (Elena is at 4 years -> INELIGIBLE). Under Art. 5 para 1(d)(i), an applicant must not have held any Interest in a sports-betting entity in the past 12 months (Elena sold 8 months ago -> INELIGIBLE).',
            },
            {
              id: 'fifa-d1-l1-q2',
              question:
                'Which of the following statements regarding an Agency operated by a licensed FIFA Football Agent is CORRECT under FFAR Art. 11?',
              options: [
                'A licensed agent’s active professional player Client may own 15% non-voting shares in the Agency',
                'Unlicensed employees of the Agency may Approach potential players to pitch Representation Agreements as long as the licensed agent signs the final contract',
                'The licensed Football Agent remains fully responsible for regulatory breaches committed by their Agency’s employees, contractors, or representatives',
                'An Agency itself receives a corporate FIFA Football Agent licence alongside the natural person',
              ],
              correctIndex: 2,
              rationale:
                'FFAR Art. 11 para 3 explicitly holds the licensed agent fully responsible for any violations by their Agency or its staff. Clients cannot hold any Interest (Art. 11 para 4a), unlicensed staff cannot make Approaches (Art. 11 para 3), and only natural persons can hold a licence (Art. 4).',
            },
          ],
          practicalDrill: {
            title: 'Speed-Lookup Drill: Navigating the 1,010-Page Digital PDF',
            prompt:
              'Practice locating exact FFAR articles inside `20260115_Study Materials_EN_FINAL_CLEAN.pdf` in under 30 seconds each.',
            steps: [
              'Use `Ctrl+F` to jump directly to FFAR Article 5 (Eligibility) and verify all four time bars.',
              'Locate FFAR Article 9 (CPD) and Article 10 (Suspension/Termination) and note the consequence of voluntary permanent termination.',
              'Open `Circular 1956` and confirm the 2026 online exam dates, application window, and single annual cycle rule.',
              'Create a 1-page personal Digital Bookmark Sheet listing exact PDF page numbers for Statutes, Disciplinary Code, Ethics, RSTP, Procedural Rules, Clearing House, FFAR, Guardians, and key Circulars.',
            ],
            successCriteria:
              'Locates any FFAR article in under 30 seconds using exact PDF page bookmarks without scrolling aimlessly.',
          },
          flashcards: [
            {
              front: 'What are the 4 time-based disqualifiers in FFAR Article 5 (Eligibility)?',
              back: 'Lifetime: major criminal convictions/false info; 5 years: personal or corporate director bankruptcy/liquidation; 24 months: performing unlicensed agent services; 12 months: holding any Interest in a sports-betting entity.',
              tag: 'FIFA-D1',
            },
            {
              front: 'Can an unlicensed employee of a licensed agent’s Agency make an initial Approach to a prospective player?',
              back: 'NO! Under FFAR Art. 11 para 3, unlicensed employees/contractors may NEVER perform Football Agent Services or make any Approach to a potential Client.',
              tag: 'FIFA-D1',
            },
            {
              front: 'What is the passing score, question count, and time limit for the 2026 FIFA Football Agent Exam?',
              back: '75% (15 out of 20 questions), 60 minutes, held online with remote invigilation and digital-format Study Materials only.',
              tag: 'FIFA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
            'my_documents/FIFA AGENT LICENSE/20260113_FINAL CLEAN_FIFA-Football-Agent-Exam-Rules-6th-Edition-JAN-2026-edition_EN.pdf',
            'my_documents/FIFA AGENT LICENSE/Circular 1956_FIFA football agent exam - 2026 edition_EN.pdf',
          ],
        },
        {
          id: 'fifa-d1-l2',
          title: 'Representation Agreements (Art. 12), Minors (Art. 13) & Permitted Dual Representation',
          estimatedMinutes: 55,
          summary:
            'Nail the highest-tested FFAR legal rules: mandatory written elements, 2-year maximum duration for Individuals, exclusive approach windows (final 2 months!), sole permitted dual representation, autonomous negotiation rights, and strict minor protection (Art. 13).',
          learningObjectives: [
            'Verify all 5 minimum validity requirements of a Representation Agreement (Art. 12 para 7) and maximum duration limits (2 years for Individuals; NO maximum for Clubs/Entities!).',
            'Apply the Exclusive Representation Agreement approach restriction (no Approach except during the FINAL TWO MONTHS of an existing exclusive agreement).',
            'Apply Art. 12 para 8–10 Dual Representation rules cold: ONLY Individual + Engaging Entity with PRIOR EXPLICIT WRITTEN CONSENT—NEVER involving the Releasing Entity!',
            'Enforce all FFAR Art. 13 Minor Representation requirements: 6-month window before legal professional-contract age, prior written guardian consent, mandatory CPD course on minors, dual signatures, and minimum sanctions.',
          ],
          coreConcepts: [
            {
              heading: 'Representation Agreements: Validity, Duration, Exclusivity & Autonomous Negotiation (Art. 12)',
              explanation:
                'An agent can ONLY perform Football Agent Services after entering a **written** Representation Agreement (Art. 12 para 1). Check every exam trap in Art. 12:\n• **5 Minimum Requirements (Art. 12 para 7)**: (a) Names of parties, (b) Duration (if applicable), (c) Service fee amount, (d) Nature of Football Agent Services, (e) Signatures of parties.\n• **Maximum Duration (Art. 12 para 3–5)**: With an **Individual (player/coach)** -> MAXIMUM **2 years**! Automatic renewal clauses are **NULL AND VOID** (must sign a brand-new written agreement to extend!). An agent may have only ONE Representation Agreement with the same Individual at a time. With an **Engaging or Releasing Entity (Club/Association/League)** -> **NO maximum duration**, and multiple agreements with the same club are allowed for *different* Transactions (Art. 12 para 6)!\n• **Exclusive Approach Rule (Art. 16 para 1b)**: Never Approach a Client bound by an exclusive Representation Agreement with another agent EXCEPT during the **final 2 months** of that exclusive agreement!\n• **Independent Legal Advice Notice**: Before signing/amending a Representation Agreement with an Individual, the agent MUST inform the Individual in writing that they should consider taking independent legal advice AND obtain the Individual’s written confirmation that they either took or chose not to take it!\n• **Autonomous Self-Negotiation (Art. 12 para 12–13)**: A Client can ALWAYS negotiate a deal without an agent. Any clause restricting or penalizing an Individual for self-negotiating is **NULL AND VOID**!',
              mentalModel:
                'Individual protection armor: Written first -> Legal-advice warning first -> Max 2 years -> No auto-renewal -> Free to self-negotiate -> Rival agents stay away until the last 2 months!',
              formulaOrRule:
                'Max Duration: Individual = 2 Years (no auto-renew) | Club = Unlimited | Final Approach Window on Exclusive Contract = Last 2 Months.',
            },
            {
              heading: 'The Golden Rule of Dual Representation (FFAR Art. 12 para 8–10)',
              explanation:
                'By default, a Football Agent (and any Connected Football Agent in the same Agency/cooperation!) may represent **ONLY ONE PARTY** in a Transaction.\n• **SOLE PERMITTED EXCEPTION (Art. 12 para 8a)**: Simultaneous representation of **Individual (Player/Coach) + Engaging Entity (Buying Club)** in the same Transaction—ONLY if **PRIOR EXPLICIT WRITTEN CONSENT** is given by BOTH Clients!\n• **STRICTLY PROHIBITED COMBINATIONS (Art. 12 para 9)**:\n  1. Releasing (Selling) Club + Individual -> FORBIDDEN!\n  2. Releasing (Selling) Club + Engaging (Buying) Club -> FORBIDDEN!\n  3. All 3 parties (Releasing + Engaging + Individual) -> FORBIDDEN!\n  4. Two Connected Football Agents splitting forbidden sides -> ALSO FORBIDDEN (Art. 12 para 10)!',
              mentalModel:
                'The Releasing (Selling) Club is ALWAYS a SOLO ISLAND! If you or your connected partner represent the Selling Club, you CANNOT touch anyone else in that transfer!',
              formulaOrRule:
                'ONLY Permitted Dual Rep = Individual + Engaging Entity (+ Prior Explicit Written Consent from BOTH). Selling Club + Anybody Else = ILLEGAL!',
            },
            {
              heading: 'Representation of Minors (FFAR Art. 13 — Zero-Tolerance Exam Favorite!)',
              explanation:
                'A minor is a player under age 18. FFAR Art. 13 imposes four strict cumulative safeguards:\n1. **6-Month Approach Window**: An Approach (or signing a Representation Agreement) to a minor or guardian may ONLY occur **no more than 6 months before** the minor reaches the legal age to sign their **first professional contract** in the country/territory where the minor will be employed (e.g., if national law allows pro contracts at age 16, earliest permitted Approach is age **15 years and 6 months**!).\n2. **Prior Written Guardian Consent**: Even inside that 6-month window, you MUST obtain **prior written consent from the minor’s legal guardian** BEFORE making the Approach!\n3. **Designated CPD Course on Minors**: Any agent representing a minor—OR representing a CLUB in a Transaction involving a minor!—must FIRST complete FIFA’s designated CPD course on minors AND comply with national law.\n4. **Enforceability & Sanctions**: Agreement must be signed by BOTH the minor AND their legal guardian (Art. 13 para 3c). Violating the 6-month/guardian Approach rule carries a MANDATORY MINIMUM sanction of a **fine AND licence suspension of up to 2 years** (Art. 13 para 4)! Also under Art. 14 para 9, an agent CANNOT charge any service fee regarding a minor UNLESS the minor is signing their first or subsequent *professional* contract!',
              mentalModel:
                'Minor Checklist = Legal Pro Age − 6 Months + Prior Written Guardian Consent + Minors CPD Course + Both Signatures + Zero Fee on Amateur/Youth Deals!',
              formulaOrRule:
                'Earliest Minor Approach = (National First Pro Contract Age) − 6 Months (WITH Prior Written Guardian Consent!). Violation = Minimum Fine + Up to 2-Year Suspension!',
            },
          ],
          realWorldScenario: {
            title: 'The 15-Year-Old Prodigy & the Connected Agency Workaround',
            situation:
              'In Country X, national law allows a player to sign a first professional contract at age 16. Agent Sofia (who has NOT taken the FIFA CPD course on minors) emails a 15-year-3-month-old academy striker directly without contacting the parents. Meanwhile, in a separate transfer, Sofia represents Selling Club A while her Agency co-founder Pedro represents Buying Club B in the exact same player transfer.',
            analysis:
              'Multiple fatal FFAR breaches! First, on the minor: (a) 15 years and 3 months is 9 months before age 16—violating the 6-month window (earliest allowed is 15y 6m); (b) Sofia lacked prior written consent from the legal guardian; and (c) Sofia hadn’t completed the mandatory CPD course on minors. Under Art. 13 para 4, Sofia faces a minimum fine AND licence suspension up to 2 years! Second, Sofia and Pedro are Connected Football Agents (same Agency), so representing Selling Club A and Buying Club B in the same Transaction violates Art. 12 para 9(b) & 10!',
            takeaway:
              'Always check (1) national pro-contract age minus 6 months, (2) whether a CLUB-side agent also needs the Minors CPD course (YES!), and (3) whether two agents in the same Agency are "Connected Football Agents"!',
          },
          examTraps: [
            'Trap: Thinking the 6-month minor window is always "17 years and 6 months" (6 months before turning 18). WRONG! Art. 13 para 1 anchors to **6 months before the age the minor may sign their first PROFESSIONAL contract** under applicable national law (often 16 -> 15y 6m, or 15 -> 14y 6m—read the question’s national age carefully!).',
            'Trap: Thinking an agent representing a BUYING CLUB in a transfer of a 17-year-old doesn’t need the Minors CPD course. Art. 13 para 2 explicitly requires the Minors CPD course whether representing the minor OR representing a CLUB in a transaction involving a minor!',
            'Trap: Thinking a Representation Agreement with a CLUB has a 2-year maximum duration. ONLY Representation Agreements with an INDIVIDUAL have the 2-year maximum; Club agreements have NO maximum duration!',
            'Trap: Assuming a Client can sign away their right to self-negotiate by paying a penalty fee. Art. 12 para 13 renders any clause restricting or penalizing autonomous negotiation NULL AND VOID!',
          ],
          keyTerms: [
            {
              term: 'Permitted Dual Representation (Art. 12 para 8a)',
              definition:
                'The sole exception to single-party representation: acting for BOTH the Individual and Engaging Entity in the same Transaction with prior explicit written consent from both.',
            },
            {
              term: 'Connected Football Agent',
              definition:
                'Agents connected via the same Agency, shared ownership/management, profit/fee sharing, family ties, or formal cooperation—treated as one unit under conflict-of-interest bans.',
            },
            {
              term: 'Just Cause (Representation Agreement — Art. 12 para 14)',
              definition:
                'Circumstances where a party cannot reasonably be expected in good faith to continue the agreement (e.g., licence withdrawal/suspension, football activity ban, or club registration ban for >=1 full window).',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d1-l2-q1',
              question:
                'In Country Y, national law permits a player to sign their first professional contract upon turning 16. A talented academy player turns 16 on 1 November 2026. Under FFAR Art. 13, what is the EARLIEST date a FIFA Football Agent may legally Approach the player’s legal guardian (having completed the Minors CPD course and obtained prior written guardian consent)?',
              options: [
                '1 November 2025 (12 months prior)',
                '1 May 2026 (6 months prior to reaching legal first-pro-contract age)',
                '1 November 2026 (on the player’s 16th birthday)',
                '1 May 2028 (6 months prior to turning 18)',
              ],
              correctIndex: 1,
              rationale:
                'FFAR Art. 13 para 1 permits an Approach no more than 6 months before the minor reaches the age to sign their first professional contract under applicable national law (1 Nov 2026 minus 6 months = 1 May 2026), with prior written guardian consent.',
            },
            {
              id: 'fifa-d1-l2-q2',
              question:
                'Which multi-party representation scenario is PERMITTED under FFAR Art. 12?',
              options: [
                'Representing the Releasing Club and the Player with prior written consent from both',
                'Representing the Releasing Club and the Engaging Club with prior written consent from both',
                'Representing the Engaging Club and the Player in the same Transaction with prior explicit written consent from both',
                'Representing the Releasing Club while a Connected Football Agent from your Agency represents the Engaging Club',
              ],
              correctIndex: 2,
              rationale:
                'Art. 12 para 8(a) makes Individual + Engaging Entity (with prior explicit written consent from both) the SOLE permitted dual representation. Any combination involving the Releasing Entity (even via Connected Agents) is strictly prohibited.',
            },
            {
              id: 'fifa-d1-l2-q3',
              question:
                'A star midfielder signed a 2-year exclusive Representation Agreement with Agent A running from 1 July 2025 to 30 June 2027, including a clause stating "automatically renews for 2 more years unless cancelled." When may rival Agent B legally Approach the player, and is the auto-renewal valid?',
              options: [
                'Agent B may approach on 1 January 2027; auto-renewal is valid',
                'Agent B may approach starting 1 May 2027 (final 2 months of the exclusive term); the automatic renewal clause is NULL AND VOID',
                'Agent B may approach at any time; auto-renewal is valid if notarized',
                'Agent B must wait until 1 July 2027; auto-renewal is valid for 1 extra year',
              ],
              correctIndex: 1,
              rationale:
                'Under FFAR Art. 12 para 3, automatic extension clauses for Individuals are null and void. Under Art. 16 para 1(b), a rival agent may only Approach an exclusively represented Client during the final 2 months of the agreement (May–June 2027).',
            },
          ],
          practicalDrill: {
            title: 'Representation Agreement Red-Flag Clause Audit',
            prompt:
              'Spot and fix 5 illegal clauses inside a draft Representation Agreement for a 17-year-old signing a first professional contract.',
            steps: [
              'Draft Clause 1: "Duration: 3 years with automatic 1-year renewal." -> Fix per Art. 12 para 3.',
              'Draft Clause 2: "Player owes Agent €50,000 liquidated damages if Player negotiates own contract extension." -> Cite Art. 12 para 13.',
              'Draft Clause 3: "Agent represents Selling Club, Buying Club, and Player." -> Fix per Art. 12 para 8–9.',
              'Draft Clause 4: "Signed solely by the 17-year-old Player." -> Fix per Art. 13 para 3(c).',
              'Draft Clause 5: "No written independent legal advice notice provided." -> Cite Art. 12 para 2.',
            ],
            successCriteria:
              'Identifies exact FFAR article violations for all 5 clauses and states exact compliant wording.',
          },
          flashcards: [
            {
              front: 'What are the 5 minimum validity requirements of a Representation Agreement (FFAR Art. 12 para 7)?',
              back: '1. Names of parties, 2. Duration (if applicable), 3. Service fee amount, 4. Nature of Football Agent Services, 5. Signatures of the parties.',
              tag: 'FIFA-D1',
            },
            {
              front: 'What is the ONLY permitted dual representation under FFAR Art. 12 para 8(a)?',
              back: 'Acting simultaneously for the Individual (Player/Coach) AND the Engaging Entity (Buying Club) with PRIOR EXPLICIT WRITTEN CONSENT from both Clients.',
              tag: 'FIFA-D1',
            },
            {
              front: 'What is the minimum sanction for violating the FFAR Art. 13 para 1 minor approach rule?',
              back: 'At a minimum: a fine AND a suspension of the Football Agent’s licence of up to two (2) years.',
              tag: 'FIFA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
            'my_documents/FIFA AGENT LICENSE/FIFA Football Agent Regulations_EN.pdf',
          ],
        },
        {
          id: 'fifa-d1-l3',
          title: 'Service Fee Caps (Art. 14–15 Marginal Math), Circular 1873 Suspensions & 14-Day Platform Rules',
          estimatedMinutes: 55,
          summary:
            'Master the progressive USD 200,000 service fee cap calculation verbatim, the Client-Pays Principle exception, pro-rata quarterly payments, Circular 1873 temporary suspensions, and every Art. 16 upload deadline (14 days vs. 30 days).',
          learningObjectives: [
            'Calculate exact maximum service fees under FFAR Art. 15 para 2 using MARGINAL BRACKET math (first USD 200,000 at 5%/10%, annual excess above USD 200,000 at 3%/6%, Releasing Entity 10% excluding sell-on fees and Art. 17 compensation).',
            'Apply the Client-Pays Principle and its ONLY exception (Engaging Entity paying for Individual ONLY if annual base Remuneration is STRICTLY < USD 200,000, without deducting from salary!).',
            'Apply quarterly pro-rata payment rules (every 3 months after window closure; single end-of-contract payment if contract < 6 months) and permitted dual-rep 50% employer cap.',
            'Distinguish which FFAR provisions were temporarily suspended globally by Circular 1873 vs. which rules remain fully active—and memorize every Art. 16 Platform upload deadline (14 days vs. 30 days).',
          ],
          coreConcepts: [
            {
              heading: 'Service Fee Cap Marginal Bracket Formula (FFAR Art. 15 — #1 Exam Calculation!)',
              explanation:
                'Read FFAR Art. 15 para 2 with surgical care—candidates lose easy points by misapplying the USD 200,000 threshold!\n• **Base Remuneration Rule**: Calculate based on fixed annual Remuneration—**EXCLUDE all conditional payments/bonuses** (Art. 15 para 2a)!\n• **Bracket 1 (Up to & including USD 200,000/yr)**:\n  – Representing **Individual ONLY** -> **5%**\n  – Representing **Engaging Entity ONLY** -> **5%**\n  – **Permitted Dual Rep (Engaging + Individual)** -> **10%**\n• **Bracket 2 (Annual EXCESS strictly above USD 200,000/yr — MARGINAL SPLIT per Art. 15 para 2b!)**:\n  – Representing **Individual ONLY** -> **3%** on the excess!\n  – Representing **Engaging Entity ONLY** -> **3%** on the excess!\n  – **Permitted Dual Rep (Engaging + Individual)** -> **6%** on the excess!\n• **Representing Releasing (Selling) Entity**: **10% of transfer compensation**—explicitly **EXCLUDING** (i) Art. 17 / Annexe 2 breach compensation AND (ii) **sell-on fees** (Art. 15 para 2c)!\n*Worked Example*: Annual fixed salary = USD 500,000 (+ USD 100,000 goal bonus -> IGNORED!).\n– Individual-only max annual fee = `(200,000 × 5%) + (300,000 × 3%) = $10,000 + $9,000 = $19,000`!\n– Permitted Dual Rep max annual fee = `(200,000 × 10%) + (300,000 × 6%) = $20,000 + $18,000 = $38,000` (and Engaging Club may pay at most 50% = `$19,000` per Art. 14 para 10!).',
              mentalModel:
                'Income-tax bracket rule: NEVER multiply the whole $500,000 by 3%! The first $200,000 ALWAYS earns the 5% (or 10% dual) rate, and ONLY the slice ABOVE $200,000 earns 3% (or 6% dual)!',
              formulaOrRule:
                'Salary > $200k: Individual/Engaging Cap = ($200k × 5%) + ((Salary − $200k) × 3%) | Dual Rep Cap = ($200k × 10%) + ((Salary − $200k) × 6%) [Club max 50%].',
            },
            {
              heading: 'Client-Pays Principle, Pro-Rata Payments & Fee Forfeiture (Art. 14)',
              explanation:
                '• **Client-Pays Rule (Art. 14 para 2–3)**: ONLY the Client pays their own agent. **SOLE EXCEPTION**: When representing an Individual whose annual fixed Remuneration is **STRICTLY LESS THAN USD 200,000** (excluding conditional payments), the Engaging Club may pay the agent on the Individual’s behalf PROVIDED: (a) no dependency/fiduciary impairment, (b) payment does not exceed the Representation Agreement fee, and (c) the club does **NOT deduct it from the Individual’s Remuneration**!\n• **Payment Timing (Art. 14 para 6–8)**: Paid on an **invoice basis**, AFTER closure of the relevant registration period, in **quarterly instalments (every 3 months)** strictly pro-rata on Remuneration **actually received**! If the negotiated employment contract is **less than 6 months**, paid in a **single instalment at contract expiry**.\n• **Releasing Club Agent**: Paid following each transfer-fee instalment received by the Releasing Club (Art. 14 para 11).\n• **Loss of Future Fee (Art. 14 para 12)**: Agent forfeits remaining future instalments if (a) player transfers to another club before contract expiry, or (b) player prematurely terminates without just cause while still represented by the agent.\n• **Anti-Circumvention (Art. 15 para 3–4)**: "Other Services" fees invoiced within 24 months before/after a Transaction are presumed part of the service fee unless the agent proves otherwise!',
              mentalModel:
                'No upfront lump-sum payday: You get paid every 3 months strictly as your player actually gets paid—if they transfer early or quit without just cause, future instalments stop.',
            },
            {
              heading: 'Circular 1873 Temporary Suspensions & Art. 16 Platform Upload Deadlines',
              explanation:
                'Crucial 2026 regulatory update! Following the German District Court of Dortmund preliminary injunction, **FIFA Circular no. 1873 (30 Dec 2023)** temporarily suspended SPECIFIC FFAR rules worldwide pending final ECJ ruling—including: the Service Fee Cap (Art. 15 para 1–4), Service Fee Payment Rules (Art. 14 para 6, 8, 11), Client-Pays Rule (Art. 14 para 2–3), Dual Representation restriction (Art. 12 para 8–10), Reporting/Disclosure rules (Art. 16 para 2h, j, k), and Clearing House agent fee payment (Art. 14 para 13). **HOWEVER**, licensing, eligibility, the exam, CPD, and core conduct rules remain FULLY IN FORCE—and the FIFA Exam tests BOTH the written FFAR articles AND Circular 1873 itself!\nFor Art. 16 Platform Uploads, memorize the two exact deadlines:\n• **14 DAYS**: Execution/amendment/termination of Representation Agreement; Other Services agreements; service fee payments; fee-sharing/cooperation arrangements between agents; changes impacting eligibility; settlement agreements; AND initial Agency ownership/shareholder/employee details (within 14 days of Agency’s first Transaction).\n• **30 DAYS**: Subsequent **changes** to previously uploaded Agency information (Art. 16 para 2k(iii))!',
              mentalModel:
                'Platform Upload shortcut: Almost EVERYTHING is **14 DAYS**; ONLY updates/changes to previously filed Agency info get **30 DAYS**!',
              formulaOrRule:
                'Platform Deadlines: All Agreements, Payments, Settlements, Eligibility Impacts & Initial Agency Filing = 14 Days | Subsequent Agency Info Changes = 30 Days.',
            },
          ],
          realWorldScenario: {
            title: 'Calculating a Permitted Dual-Representation Transfer Package',
            situation:
              'Agent Carlos has prior explicit written consent to represent both Player Diego and Buying Club FC Metro (permitted dual representation). Diego signs a 3-year contract earning USD 400,000/year guaranteed fixed base salary PLUS USD 150,000/year conditional Champions League qualification bonus. Meanwhile, Selling Club FC Verde uses independent Agent Nora to negotiate a USD 5,000,000 transfer fee PLUS a 15% sell-on clause.',
            analysis:
              '1) Carlos’s Annual Cap (Dual Rep): Ignore the $150,000 conditional bonus (Art. 15 para 2a)! Split $400,000 marginally: `($200,000 × 10%) + ($200,000 × 6%) = $20,000 + $12,000 = $32,000/year` (total $96,000 over 3 years if all salary is actually received!). Under Art. 14 para 10, FC Metro can pay at most 50% (`$16,000/yr`), and Diego pays the rest (`$16,000/yr`) in quarterly instalments after the window closes!\n2) Nora’s Cap (Releasing Entity): `10% × $5,000,000 = $500,000`, paid proportionally as FC Verde receives each transfer instalment. The 15% sell-on clause is EXCLUDED from Nora’s cap base (Art. 15 para 2c(ii))!',
            takeaway:
              'Every single exam calculation tests those exact 4 filters: (1) strip conditional bonuses, (2) split marginally at $200,000, (3) cap Engaging Club at 50% in dual rep, and (4) strip sell-on fees & Art. 17 compensation from Releasing Club transfer fees!',
          },
          examTraps: [
            'Trap: Multiplying a USD 600,000 salary straight by 3% (`$18,000`) instead of applying the marginal bracket `($200k × 5%) + ($400k × 3%) = $10,000 + $12,000 = $22,000`!',
            'Trap: Including conditional performance bonuses (appearance/goal bonuses) in the USD 200,000 cap calculation or Client-Pays threshold. Art. 14 para 3 & Art. 15 para 2(a) explicitly EXCLUDE conditional payments!',
            'Trap: Including a future sell-on fee or Article 17 breach compensation when calculating a Releasing Club agent’s 10% transfer-fee cap. Both are expressly EXCLUDED under Art. 15 para 2(c)!',
            'Trap: Allowing the Engaging Club to pay an Individual’s agent when annual salary is EXACTLY USD 200,000. Art. 14 para 3 says **strictly LESS THAN USD 200,000** (unlike Art. 15’s cap bracket which says "less than or equal to USD 200,000")!',
          ],
          keyTerms: [
            {
              term: 'Client-Pays Principle (Art. 14 para 2)',
              definition:
                'Rule that only the Client may pay their Football Agent, with the sole exception allowing an Engaging Club to pay on an Individual’s behalf if fixed annual salary is < USD 200,000 without salary deduction.',
            },
            {
              term: 'Circular no. 1873',
              definition:
                'FIFA circular (30 Dec 2023) enacting global temporary suspension of specific FFAR provisions (caps, payment rules, dual-rep limit, disclosures) following the Dortmund court injunction pending ECJ review.',
            },
            {
              term: 'Pro-Rata Quarterly Payment (Art. 14 para 6–7)',
              definition:
                'Requirement that agent fees be paid every 3 months after window closure strictly proportional to Remuneration actually received by the Individual.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d1-l3-q1',
              question:
                'A FIFA Football Agent represents ONLY a player signing a 1-year contract with fixed annual Remuneration of USD 350,000 plus a USD 50,000 conditional title bonus. Under FFAR Art. 15 para 2, what is the MAXIMUM service fee cap?',
              options: [
                'USD 10,500 (3% of 350,000)',
                'USD 12,000 (3% of 400,000)',
                'USD 14,500 (5% of first 200,000 + 3% of excess 150,000)',
                'USD 17,500 (5% of 350,000)',
              ],
              correctIndex: 2,
              rationale:
                'Conditional bonuses ($50,000) are excluded. Applying Art. 15 para 2(b) marginal brackets to USD 350,000: `(200,000 × 5%) + (150,000 × 3%) = $10,000 + $4,500 = USD 14,500`.',
            },
            {
              id: 'fifa-d1-l3-q2',
              question:
                'A player signs a 4-month short-term employment contract earning USD 120,000 total. Under FFAR Art. 14 para 8, when is the Football Agent’s service fee payable?',
              options: [
                'In full upfront on the day the contract is signed',
                'In a single instalment at the expiry of the negotiated 4-month employment contract',
                'In four monthly instalments before the registration period closes',
                'Directly out of FIFA’s annual solidarity pool',
              ],
              correctIndex: 1,
              rationale:
                'Under FFAR Art. 14 para 8, when a negotiated employment contract is LESS than 6 months in duration, payment is made in a single instalment at the expiry of the employment contract.',
            },
            {
              id: 'fifa-d1-l3-q3',
              question:
                'Under FFAR Art. 16 para 2(k), within how many days must a Football Agent upload (i) initial Agency ownership/employee details after the Agency’s first Transaction, and (ii) any subsequent change to Agency information?',
              options: [
                '7 days initial; 14 days for changes',
                '14 days initial; 30 days for subsequent changes',
                '30 days initial; 60 days for subsequent changes',
                '14 days initial; 14 days for subsequent changes',
              ],
              correctIndex: 1,
              rationale:
                'FFAR Art. 16 para 2(k)(i)–(ii) mandates 14 days after the Agency’s first Transaction for initial ownership/employee filings, and Art. 16 para 2(k)(iii) mandates 30 days for subsequent changes.',
            },
          ],
          practicalDrill: {
            title: 'FFAR Service Fee Cap Speed-Math Workout',
            prompt:
              'Solve three exam-caliber fee-cap scenarios without a single bracket error.',
            steps: [
              'Case A (Individual Only): Fixed salary USD 600,000/yr + USD 100,000 goal bonus -> Compute max annual fee.',
              'Case B (Permitted Dual Rep): Fixed salary USD 300,000/yr -> Compute max total annual fee AND max amount the Engaging Club may pay.',
              'Case C (Releasing Club): Transfer fee EUR 8,000,000 + EUR 1,500,000 Art. 17 breach compensation + 20% sell-on clause -> Compute max Releasing Club agent fee.',
            ],
            successCriteria:
              'Case A = $10k + $12k = $22,000; Case B = $20k + $6k = $26,000 (Club max 50% = $13,000); Case C = 10% of EUR 8M = EUR 800,000 (excluding both Art. 17 comp and sell-on!).',
          },
          flashcards: [
            {
              front: 'What are the FFAR Art. 15 service fee cap percentages below/equal to USD 200k vs. on the excess above USD 200k?',
              back: 'Individual or Engaging Entity: 5% up to $200k, 3% on excess above $200k. Permitted Dual Rep: 10% up to $200k, 6% on excess above $200k. Releasing Entity: 10% of transfer fee.',
              tag: 'FIFA-D1',
            },
            {
              front: 'In Permitted Dual Representation, what is the maximum percentage of the total service fee the Engaging Club may pay (Art. 14 para 10)?',
              back: 'Up to 50% of the total service fee due.',
              tag: 'FIFA-D1',
            },
            {
              front: 'Which two items are EXCLUDED from transfer compensation when calculating a Releasing Club agent’s 10% fee cap (Art. 15 para 2c)?',
              back: '1. Compensation for breach of contract under RSTP Art. 17 or Annexe 2; 2. Any sell-on fee.',
              tag: 'FIFA-D1',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
            'my_documents/FIFA AGENT LICENSE/FIFA Football Agent Regulations_EN.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 2: Regulations on the Status and Transfer of Players — RSTP (35%)
    // =================================================================
    {
      id: 'fifa-d2',
      domainNumber: 2,
      title: 'Regulations on the Status and Transfer of Players (RSTP — July 2025 Ed.)',
      examWeightPercent: 35,
      overview:
        '35% of the exam! Covers player registration & the 3-club/2-club rule (Art. 5), registration periods (Art. 6), loan limits (Art. 10), TPO/TPI bans (Art. 18bis/18ter) & Bridge Transfers (Art. 5bis), Contract Stability, Protected Period, Circular 1917 (Diarra Interim Framework) & Circular 1887 (Female Players), Protection of Minors (Art. 19 exceptions!), Training Compensation, and Solidarity Mechanism exact math.',
      lessons: [
        {
          id: 'fifa-d2-l1',
          title: 'Registration Rules, 3-Club/2-Club Rule, Loans, Bridge Transfers & TPO Bans (Art. 5–10, 18bis/ter)',
          estimatedMinutes: 50,
          summary:
            'Master RSTP operational transfer mechanics: Amateur vs. Professional reacquisition (30 days!), the 3-club registered / 2-club played rule, international loan caps (6 in / 6 out), Bridge Transfers (16-week presumption!), and Third-Party Influence/Ownership bans.',
          learningObjectives: [
            'Apply the RSTP Art. 5 para 4 rule: a player may be registered with a maximum of 3 clubs during one season, but is eligible to play official matches for only 2 clubs (plus the overlapping-season exception!).',
            'Identify Bridge Transfers (Art. 5bis — 16-week consecutive transfer presumption) and distinguish Third-Party Influence (Art. 18bis) from Third-Party Ownership of economic rights (Art. 18ter).',
            'Verify Registration Period maximum durations (Art. 6: max 12 weeks first window, max 4 weeks second window; total <= 16 weeks) and international loan limits (Art. 10: max 6 loaned out / 6 loaned in, max 3 between same two clubs, max 1 year duration, U21 club-trained exemption).',
          ],
          coreConcepts: [
            {
              heading: 'Status, Registration Periods & the 3-Club / 2-Club Rule (RSTP Art. 2–6)',
              explanation:
                '• **Professional vs. Amateur (Art. 2–3)**: A Professional has a written contract and is paid MORE than expenses effectively incurred. Reacquiring amateur status requires **30 days** after the player’s last match as a professional (Art. 3 para 1)—and no compensation is payable upon reacquisition unless the player re-registers as a pro within 30 months!\n• **3-Club / 2-Club Rule (Art. 5 para 4)**: Within one season, a player may be REGISTERED with at most **3 clubs**, and may PLAY official matches for at most **2 clubs**. *Exam Exception*: A player moving between two clubs belonging to associations with **overlapping seasons** (e.g., summer-calendar Sweden/Brazil moving to winter-calendar Europe) MAY be eligible to play official matches for a **3rd club** during the relevant season, provided contractual obligations were fully respected!\n• **Registration Periods (Art. 6)**: Two annual windows per association: First window (post-season) = **8 to 12 weeks**; Second window (mid-season) = **4 to 8 weeks**; Combined total MUST NOT exceed **16 weeks**! Out-of-contract professionals whose contracts expired BEFORE the window closed (or terminated with just cause, or maternity exceptions) may register outside the window.',
              mentalModel:
                'Season ceiling: Registered = 3 max; Official matches = 2 max (3rd ONLY on overlapping seasons!). Windows = 16 weeks total max!',
              formulaOrRule:
                '3-2 Rule: Max 3 Clubs Registered / Max 2 Clubs Played per Season | Amateur Waiting Period = 30 Days | Max Combined Windows = 16 Weeks.',
            },
            {
              heading: 'International Loan Caps (Art. 10), Bridge Transfers (Art. 5bis) & TPO/TPI (Art. 18bis/ter)',
              explanation:
                '• **International Loans (Art. 10 — fully phased in from 1 July 2024!)**: Minimum duration = time between two registration periods; Maximum duration = **1 year**; Sub-loaning to a 3rd club is **PROHIBITED**; A club may have at most **6 professionals loaned out** AND **6 loaned in** at any given time, with at most **3 loaned out to / 3 loaned in from the same specific club**. **EXEMPTION**: Players aged **21 or younger AND club-trained** are EXEMPT from the 6-player cap!\n• **Bridge Transfers (Art. 5bis)**: Two consecutive transfers (national or international) of the same player connected to each other designed to circumvent regulations (e.g., dodging training compensation or tax/TPO bans). If two consecutive transfers occur within **16 WEEKS**, it is **PRESUMED** to be a Bridge Transfer unless the parties prove otherwise!\n• **Art. 18bis (Third-Party Influence — TPI)**: No club may enter a contract enabling ANY counter-party or third party to influence its independence in employment/transfer matters.\n• **Art. 18ter (Third-Party Ownership — TPO)**: No club or player may enter an agreement with a third party granting that third party entitlement to participate in compensation payable on a player’s future transfer! (Remember: a **player’s former club** holding a sell-on clause is NOT a "third party" under FIFA definitions—sell-on clauses between clubs are LEGAL; investors/agents holding transfer stakes are ILLEGAL!).',
              mentalModel:
                'Loans: 6 in, 6 out, 3 same-club, 1 year max, NO sub-loans (U21 club-trained exempt). Bridge Transfer red flag = 2 transfers inside 16 weeks. Club sell-on = LEGAL; Agent/Investor TPO = ILLEGAL!',
              formulaOrRule:
                'Bridge Transfer Presumption = 16 Weeks | Loan Cap = 6 Out / 6 In (3 per club partner, 1 yr max; U21 + Club-Trained Exempt).',
            },
          ],
          realWorldScenario: {
            title: 'The 12-Week "Stopover Club" & U21 Loan Quota Check',
            situation:
              'Club Alpha in Brazil transfers a 22-year-old striker to Club Beta in Uruguay on 10 January for $50,000. Club Beta never plays him and transfers him 9 weeks later on 14 March to Club Gamma in Spain for $3,000,000. Separately, Club Gamma already has 6 senior players loaned out internationally and wants to loan out a 20-year-old academy graduate who trained at Gamma since age 16.',
            analysis:
              '1) Alpha -> Beta -> Gamma occurred within 9 weeks (< 16-week threshold under RSTP Art. 5bis), triggering an automatic legal **presumption of an illegal Bridge Transfer** subject to FIFA Disciplinary sanctions unless all parties prove a legitimate sporting reason!\n2) Club Gamma CAN loan out the 20-year-old academy graduate internationally because under RSTP Art. 10 para 7, players aged **21 or younger AND club-trained** are **EXEMPT** from the 6-player international loan cap!',
            takeaway:
              'Memorize the exact numerical triggers: 16 weeks (Bridge Transfer), 6/6/3 & U21+Club-Trained (Loans), 30 days (Amateur status), and 3-registered/2-played (Season limits).',
          },
          examTraps: [
            'Trap: Confusing a **club-to-club sell-on fee** (LEGAL—clubs transferring the player are NOT "third parties") with **Third-Party Ownership (TPO)** under Art. 18ter (ILLEGAL—agents, investment funds, or unrelated parties owning transfer rights!).',
            'Trap: Forgetting the **BOTH** condition for the Loan Cap exemption: a player must be **21 or younger AND club-trained** (an externally bought 19-year-old who is NOT club-trained STILL counts toward the 6-loan cap!).',
            'Trap: Claiming a player can NEVER play official matches for 3 clubs in one season. Under Art. 5 para 4, the overlapping-seasons exception allows playing for a 3rd club!',
          ],
          keyTerms: [
            {
              term: 'Bridge Transfer (RSTP Art. 5bis)',
              definition:
                'Two connected consecutive transfers used to circumvent regulations or defraud another party—legally presumed when occurring within 16 weeks.',
            },
            {
              term: 'Third-Party Ownership — TPO (RSTP Art. 18ter)',
              definition:
                'Strict prohibition against third parties (such as investment funds or agents) holding economic rights to future transfer compensation of a player.',
            },
            {
              term: 'International Transfer Certificate (ITC)',
              definition:
                'Mandatory electronic clearance issued via FIFA TMS between member associations required before a player registered in one association can be registered in another.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d2-l1-q1',
              question:
                'Under RSTP Art. 5bis, within what timeframe do two consecutive transfers of the same player create a rebuttable presumption of a prohibited Bridge Transfer?',
              options: [
                '6 weeks',
                '16 weeks',
                '6 months',
                '12 months',
              ],
              correctIndex: 1,
              rationale:
                'RSTP Art. 5bis para 2 expressly establishes a presumption of a Bridge Transfer whenever two consecutive transfers (national or international) of the same player occur within 16 weeks.',
            },
            {
              id: 'fifa-d2-l1-q2',
              question:
                'A European club currently has 6 professionals loaned out internationally under RSTP Art. 10. Which additional player may the club STILL loan out internationally without breaching the Art. 10 cap?',
              options: [
                'A 20-year-old striker purchased 3 months ago from another country',
                'A 23-year-old club-trained defender who grew up in the club’s academy',
                'A 19-year-old club-trained midfielder who qualifies under BOTH the age (<=21) and club-trained criteria',
                'A 25-year-old goalkeeper sub-loaned to a third club',
              ],
              correctIndex: 2,
              rationale:
                'RSTP Art. 10 exempts players ONLY if they are BOTH aged 21 or younger AND club-trained. Sub-loaning to a third club is strictly prohibited.',
            },
          ],
          practicalDrill: {
            title: 'RSTP Transfer Compliance Audit Checklist',
            prompt:
              'Verify legality across four tricky transfer scenarios citing exact RSTP articles.',
            steps: [
              'Check whether a player who played in England (Aug–Dec) and Spain (Jan–Feb) can play official matches in Brazil (new season starting March) -> Cite Art. 5 para 4.',
              'Check whether a selling club retaining a 20% sell-on clause violates Art. 18ter -> Explain why YES or NO.',
              'Check whether a club can insert a 6-year contract term for a 21-year-old vs. a 17-year-old (Art. 18 para 2: max 5 years for adults unless national law permits longer; MAX 3 YEARS for players under 18!).',
            ],
            successCriteria:
              'Exact citations: Overlapping seasons exception (Art. 5.4), former club is not a third party under Art. 18ter, and strict 3-year max contract length for minors under Art. 18.2.',
          },
          flashcards: [
            {
              front: 'What is the maximum contract duration for a player under age 18 vs. age 18+ under RSTP Art. 18 para 2?',
              back: 'Under 18: MAXIMUM 3 years (any longer clause is not recognized!). Age 18+: maximum 5 years (unless expressly permitted by national law).',
              tag: 'FIFA-D2',
            },
            {
              front: 'What is the RSTP Art. 5 para 4 "3-2 Rule" and its sole exception?',
              back: 'Max 3 clubs registered / max 2 clubs played official matches in one season—exception: may play for a 3rd club when moving between associations with overlapping seasons.',
              tag: 'FIFA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
        {
          id: 'fifa-d2-l2',
          title: 'Contract Stability, Just Cause, Protected Period, Diarra (Circular 1917) & Female Players (Circular 1887)',
          estimatedMinutes: 55,
          summary:
            'Master RSTP Art. 13–18 contract stability: Just Cause, 2-month overdue salaries (Art. 14bis), Sporting Just Cause (<10% official matches), Protected Period (3 yrs <28 / 2 yrs >=28), the landmark Dec 2024 Diarra Interim Framework (Circular 1917), and maternity/adoption protections (Art. 18quater & Circular 1887).',
          learningObjectives: [
            'Distinguish Just Cause (Art. 14), Overdue Payables Just Cause (Art. 14bis: 2 monthly salaries overdue + 15-day written default notice!), and Sporting Just Cause (Art. 15: established pro playing <10% official matches, notice within 15 days of last match!).',
            'Calculate the Protected Period cold (3 entire seasons/years if signed BEFORE 28th birthday; 2 entire seasons/years if signed ON OR AFTER 28th birthday) and the 6-month free-negotiation rule (Art. 18 para 3).',
            'Apply the landmark Circular 1917 (Lassana Diarra CJEU Interim Regulatory Framework): codified Just Cause definition, objective damage calculation (positive interest), NO automatic presumption that the new club induced breach, duty to collaborate/adverse inference, and simplified non-blocking ITC issuance!',
            'Apply RSTP Art. 18quater & Circular 1887 protections for female players and coaches (minimum 14 weeks paid maternity leave, adoption/family leave, zero validity conditions tied to pregnancy).',
          ],
          coreConcepts: [
            {
              heading: 'Just Cause, Art. 14bis Overdue Payables & Art. 15 Sporting Just Cause',
              explanation:
                'Under Art. 13, contracts can ONLY end on expiry or mutual agreement—unilateral termination requires **Just Cause** (Art. 14, codified by Circular 1917: when a party can no longer reasonably be expected in good faith to continue the employment relationship).\n• **Art. 14bis (Unpaid Salaries Just Cause — EXACT NUMBERS!)**: If a club unlawfully fails to pay at least **2 monthly salaries** on their due dates, the player has Just Cause to terminate ONLY AFTER putting the club in default **in writing** and granting a deadline of at least **15 days** to cure the debt!\n• **Art. 15 (Sporting Just Cause)**: An **established professional** who appears in **FEWER THAN 10%** of the club’s official matches during the season may terminate prematurely on Sporting Just Cause—MUST notify the club within **15 days following the last official match of the season**! (No sporting sanctions, though compensation may still apply!).\n• **Art. 18 para 3 (The 6-Month Approach Rule)**: A club intending to sign a professional MUST inform their current club in writing BEFORE entering negotiations. A player may ONLY sign a pre-contract with a new club freely if their current contract expires within **6 MONTHS**!',
              mentalModel:
                'Exact 15-Day Twins: Art. 14bis = 2 unpaid monthly salaries + 15-day written cure notice; Art. 15 Sporting Just Cause = <10% matches + notice within 15 days after final match!',
              formulaOrRule:
                'Art. 14bis = >=2 Monthly Salaries Unpaid + 15-Day Written Notice | Art. 15 = <10% Official Matches + 15 Days Post-Season | Art. 18.3 = Free to Sign in Final 6 Months.',
            },
            {
              heading: 'Protected Period & Landmark Diarra Interim Framework (Circular 1917 — Jan 2026 Exam Hot Topic!)',
              explanation:
                '• **Protected Period**: **3 entire seasons or 3 years** (whichever comes first) if the contract is signed **PRIOR to the player’s 28th birthday**; **2 entire seasons or 2 years** (whichever comes first) if signed **ON OR AFTER the player’s 28th birthday**! Breaching without just cause during the Protected Period triggers severe sporting sanctions (4–6 month playing ban for player; 2-window registration ban for inducing club).\n• **Circular 1917 (23 Dec 2024 — CJEU Case C-650/22 *Lassana Diarra* Interim Amendments, IN YOUR 2026 STUDY MATERIALS!)**:\n  1. **Codified Just Cause (Art. 14 para 1)**: Explicitly defines Just Cause in RSTP text.\n  2. **End of Automatic Inducement Presumption (Art. 17)**: Previously, a new club signing a player who breached without just cause was *automatically presumed* to have induced the breach and held automatically jointly liable! Under Circular 1917, the former club now bears the **BURDEN OF PROOF** to prove the new club actually induced the breach before joint liability or a 2-window ban applies!\n  3. **Objective Compensation Criteria (Art. 17)**: Compensation calculated on objective "positive interest" principles (replacing vague "specificity of sport" uncertainty).\n  4. **Simplified ITC Rule (Annexe 3 Art. 11)**: Member associations can NO LONGER block/reject issuing an International Transfer Certificate (ITC) solely due to an ongoing contractual dispute!\n  5. **Duty to Collaborate & Adverse Inference (Procedural Rules Art. 13 para 6)**: Parties MUST comply with evidentiary requests or the Football Tribunal may draw an adverse inference!',
              mentalModel:
                'Pre-Diarra = New club automatically guilty of inducement & old FA could block ITC; Post-Diarra (Circular 1917 — 2026 Exam!) = Former club must PROVE inducement, and old FA CANNOT block the ITC over a contract dispute!',
              formulaOrRule:
                'Protected Period: Signed <28 = 3 Seasons/Years | Signed >=28 = 2 Seasons/Years | Circular 1917: NO automatic new-club inducement presumption & NO blocking ITC over disputes!',
            },
            {
              heading: 'Female Players, Maternity, Adoption & Coaches Protections (Art. 18quater & Circular 1887)',
              explanation:
                'Under RSTP Art. 18quater and **Circular 1887** (incorporated into July 2025 RSTP), validity of a contract can NEVER depend on a medical exam, work permit, or pregnancy status (Art. 18 para 4). Female players and coaches are guaranteed a **minimum 14 weeks of paid maternity leave** (at least 8 weeks AFTER birth) paid at a minimum of **two-thirds (2/3)** of contracted salary (unless national law/CBA is more favorable), plus paid **adoption leave** (at least 8 weeks for child <2 yrs) and **family leave** (at least 8 weeks for non-biological parent), menstrual-health accommodations, and the right to register a replacement player outside the transfer window! Terminating a player because she is pregnant carries a rebuttable presumption of termination without just cause + enhanced compensation + sporting sanctions!',
              mentalModel:
                'Maternity floor: 14 weeks minimum (at least 8 post-birth) at >= 2/3 salary—and Circular 1887 extended key protections to coaches, adoptive parents, and family leave!',
            },
          ],
          realWorldScenario: {
            title: 'Applying Circular 1917 (Diarra) & Art. 14bis Together',
            situation:
              'A 26-year-old winger in Year 1 of a 4-year deal has not been paid for 3 consecutive months. On 1 June, he sends a formal written notice giving Club A 15 days to pay. Club A ignores him; on 18 June he terminates for Just Cause and signs with Club B in another country. Club A claims breach without just cause, asks its National Association to refuse the ITC, and demands Club B be automatically presumed guilty of inducement.',
            analysis:
              'Club A loses on EVERY point! (1) Under Art. 14bis, 3 months unpaid (>=2 months) + formal 15-day written cure notice gives the winger ironclad **Just Cause**; (2) Under Circular 1917 (Annexe 3 Art. 11), Club A’s National Association is strictly **precluded from rejecting ITC issuance** over a contractual dispute; and (3) Even if breach HAD been without just cause, Circular 1917 abolished the automatic presumption that Club B induced breach—Club A would bear the burden of proving actual inducement!',
            takeaway:
              'Circular 1917 is brand-new inside the January 2026 FIFA Study Materials—expect at least 1–2 questions directly testing the Diarra interim rules!',
          },
          examTraps: [
            'Trap: Giving an outdated pre-2025 answer claiming "the new club is automatically presumed to have induced the breach" or "the former association can reject the ITC during a contract dispute." Under **Circular 1917 (July 2025 RSTP)**, BOTH old rules were replaced!',
            'Trap: Forgetting the **15-day written default notice** under Art. 14bis! Two unpaid monthly salaries ALONE do not grant immediate termination—the player MUST first put the club in written default with >=15 days to pay!',
            'Trap: Making a contract "subject to passing a medical exam or obtaining a work permit." Under RSTP Art. 18 para 4, validity of a contract may NEVER be made subject to a successful medical examination or the grant of a work permit!',
          ],
          keyTerms: [
            {
              term: 'Protected Period',
              definition:
                'First 3 entire seasons/years of a contract signed before age 28, or first 2 entire seasons/years if signed on or after age 28.',
            },
            {
              term: 'Circular 1917 (Diarra Interim Framework)',
              definition:
                'Dec 2024 FIFA amendments codifying Just Cause, removing the automatic new-club inducement presumption, simplifying ITC issuance during disputes, and adding party duty to collaborate.',
            },
            {
              term: 'Sporting Just Cause (RSTP Art. 15)',
              definition:
                'Right of an established professional who played in <10% of official matches during a season to terminate within 15 days of the season’s final official match.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d2-l2-q1',
              question:
                'Under the Circular 1917 interim regulatory framework (incorporated into the July 2025 RSTP), what is the legal rule regarding a new club signing a player who unilaterally terminated their prior contract without just cause?',
              options: [
                'The new club is automatically presumed to have induced the breach unless it proves its innocence',
                'There is NO automatic presumption of inducement; the former club must prove the new club actually induced the breach to establish joint liability/sanctions',
                'The former national association may permanently block the International Transfer Certificate (ITC) until full compensation is paid',
                'The player is banned from football for life under Article 17',
              ],
              correctIndex: 1,
              rationale:
                'Circular 1917 (following CJEU *Diarra* C-650/22) abolished the automatic inducement presumption against the new club AND precluded member associations from rejecting ITC issuance over a contractual dispute.',
            },
            {
              id: 'fifa-d2-l2-q2',
              question:
                'A 28-year-old defender signs a brand-new 4-year professional contract on the exact day of his 28th birthday. How long is his Protected Period under the RSTP?',
              options: [
                '3 entire seasons or 3 years, whichever comes first',
                '2 entire seasons or 2 years, whichever comes first',
                '4 entire seasons (the full contract length)',
                '1 entire season',
              ],
              correctIndex: 1,
              rationale:
                'The Protected Period is 3 seasons/years ONLY if the contract is concluded PRIOR to the player’s 28th birthday; ON OR AFTER the 28th birthday it is 2 entire seasons or 2 years, whichever comes first.',
            },
          ],
          practicalDrill: {
            title: 'Contract Stability & Circular 1917 Rapid Drill',
            prompt:
              'Resolve four high-frequency RSTP contract disputes citing the exact rule.',
            steps: [
              'Club owes a player 2 months’ salary; player walks out the next morning with zero written warning -> Valid Art. 14bis Just Cause? Explain!',
              'Contract includes "Valid only upon passing medical check next Tuesday" -> Valid clause under Art. 18 para 4?',
              'Player’s contract expires 30 June 2027. On 5 January 2027, rival Club Z wants to sign a pre-contract -> What must Club Z do first (Art. 18 para 3)?',
              'Female player gives birth -> State minimum maternity leave weeks (total & post-birth) and minimum pay fraction (Art. 18quater).',
            ],
            successCriteria:
              '1=No (missing 15-day written default notice), 2=Invalid (Art. 18.4 bans medical/work-permit conditions), 3=Inside final 6 months so eligible, MUST inform current club in writing BEFORE negotiating, 4=14 wks (>=8 post-birth) at >=2/3 salary.',
          },
          flashcards: [
            {
              front: 'What are the two requirements for Art. 14bis overdue-salary Just Cause?',
              back: 'At least TWO (2) monthly salaries unlawfully unpaid on due dates PLUS putting the club in written default with at least FIFTEEN (15) days to pay.',
              tag: 'FIFA-D2',
            },
            {
              front: 'How did Circular 1917 (Diarra) change the RSTP regarding (1) New Club Inducement and (2) ITC Issuance?',
              back: '1. Removed the automatic presumption that the new club induced breach (burden of proof is on claimant); 2. Precluded member associations from blocking/rejecting ITC issuance due to a contractual dispute.',
              tag: 'FIFA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
        {
          id: 'fifa-d2-l3',
          title: 'Protection of Minors (Art. 19 Exceptions), Training Compensation & Solidarity Mechanism Math',
          estimatedMinutes: 55,
          summary:
            'Master the RSTP Art. 19 ban on international minor transfers and ALL FIVE exact exceptions, plus exact Training Compensation triggers (Cat I–IV, age 12–21, payable up to 23) and the 5% Solidarity Contribution math table!',
          learningObjectives: [
            'Memorize the RSTP Art. 19 rule prohibiting international transfers of players under 18 and ALL FIVE narrow exceptions (non-football parental move, EU/EEA 16–18, 50km+50km border rule, humanitarian/refugee, academic exchange) + the 5-year rule (Art. 19 para 3)!',
            'Identify exactly WHEN Training Compensation is triggered (first pro registration + every international transfer until end of calendar year of 23rd birthday, covering training from calendar year of 12th to 21st birthday) and WHEN it is NOT payable (e.g., Cat IV club, reacquisition of amateur status, termination without just cause by former club).',
            'Compute Solidarity Mechanism payouts with 100% accuracy: 5% total deduction from transfer compensation, exact percentage per birthday calendar year (0.25% for ages 12–15; 0.50% for ages 16–23)!',
          ],
          coreConcepts: [
            {
              heading: 'Protection of Minors: Art. 19 Ban & The 5 Exceptions (Mandatory Sub-Committee Approval!)',
              explanation:
                'Under RSTP Art. 19, international transfers of players are ONLY permitted if the player is **over the age of 18**. Every single exception below requires **prior approval from the FIFA Football Tribunal Sub-Committee** (via TMS)!\n**The 5 Exceptions (Art. 19 para 2)**:\n1. **Parents Move (Art. 19.2a)**: Player’s parents move to the new country for **reasons NOT linked to football**.\n2. **EU/EEA Transfer (Art. 19.2b)**: Transfer takes place inside the EU/EEA (or between two associations in the same country) and the player is aged **16 to 18**—with strict club duties for football education, academic/vocational schooling, optimal living conditions/host family, and association verification.\n3. **50 km / 100 km Cross-Border Rule (Art. 19.2c)**: Player lives no further than **50 km** from a national border AND the new club is within **50 km** of that border (maximum **100 km** total distance between domicile and club HQ), while the player continues living at home and both associations consent!\n4. **Humanitarian / Refugee (Art. 19.2d)**: Player flees home country for humanitarian reasons (life/freedom threatened on race, religion, nationality, political opinion) with or without parents.\n5. **Academic Exchange Student (Art. 19.2e)**: Student moving temporarily without parents strictly for academic exchange (max 1 year, purely amateur club with no pro team or pro affiliation).\n*Plus Art. 19 para 3 (First Registration)*: Same rule applies to first registration of a foreign minor UNLESS the minor has lived continuously in that country for at least **5 YEARS** immediately prior!',
              mentalModel:
                'Art. 19 Five Fingers: 1. Parents non-football move | 2. EU/EEA 16–18 | 3. 50km+50km (<=100km) Border | 4. Refugee/Humanitarian | 5. Amateur Exchange Student (+ 5-year residency for first registration!).',
              formulaOrRule:
                'Border Rule = <=50km Home + <=50km Club (Max 100km Total) | EU/EEA = Age 16–18 | First Registration Residency Exemption = 5 Continuous Years.',
            },
            {
              heading: 'Training Compensation (RSTP Art. 20 & Annexe 4)',
              explanation:
                '• **Training Period Counted**: Calendar year of player’s **12th birthday** through calendar year of **21st birthday** (unless training clearly completed before 21).\n• **Payable Up To**: End of calendar year of player’s **23rd birthday**!\n• **Two Triggers**: (1) Player registers for the **first time as a professional** (all training clubs from 12–21 get paid!); (2) Every subsequent **international transfer** of a professional up to end of calendar year of 23rd birthday (ONLY the **immediately previous club** gets paid for the time it actually trained the player!).\n• **NOT Payable When**: (a) Former club terminates contract without just cause; (b) Player transfers to a **Category IV (purely amateur)** club; (c) Player reacquires amateur status upon transfer; (d) Inside EU/EEA if former club fails to offer a new contract in writing by registered post at least **60 days** before expiry!\n• **Calculation (Annexe 4)**: Multiply **NEW club’s training category cost** × years trained (Exception: for ages **12–15**, ALWAYS use **Category IV** cost to avoid artificially inflating fees for young kids—UNLESS triggering event occurs BEFORE the end of the calendar year of the player’s 18th birthday! For EU/EEA transfers moving up/down categories, take the **AVERAGE** of the two clubs’ categories!).',
              mentalModel:
                'Training Comp Age Clock: Earned from 12 to 21; Paid on triggers up to 23; Ages 12–15 priced at Cat IV; Paid by NEW club via FIFA Clearing House!',
            },
            {
              heading: 'Solidarity Mechanism Exact Math Table (RSTP Art. 21 & Annexe 5 — GUARANTEED EXAM CALCULATION!)',
              explanation:
                'Whenever a professional transfers **before the expiry of their contract** for a **transfer fee** (international transfer—or domestic transfer with an international dimension where a foreign club trained the player!), the **NEW CLUB deducts 5% of the transfer compensation** (excluding training compensation) and distributes it proportionally to EVERY club that trained the player between the calendar years of their **12th and 23rd birthdays**!\n**MEMORIZE THE EXACT SOLIDARITY PERCENTAGE TABLE (Sums to 100% of the 5% = 5.0% of total transfer fee!)**:\n• **Ages 12, 13, 14, 15** (4 years): Each full calendar year = **5% of the 5%** = **0.25% of total transfer fee** (`4 × 0.25% = 1.0%`).\n• **Ages 16, 17, 18, 19, 20, 21, 22, 23** (8 years): Each full calendar year = **10% of the 5%** = **0.50% of total transfer fee** (`8 × 0.50% = 4.0%`).\n• Total across all 12 years (12–23) = `1.0% + 4.0% = 5.0%` of total transfer fee! Partial calendar years are prorated by exact days registered divided by 365 (or 366 in leap year)!',
              mentalModel:
                'Quick-Calc Formula: Every full year at age 12–15 = **0.25%** of the transfer fee; Every full year at age 16–23 = **0.50%** of the transfer fee! Just add the percentages and multiply by the transfer fee!',
              formulaOrRule:
                'Solidarity Payout = Transfer Fee × [ (Years age 12–15 × 0.25%) + (Years age 16–23 × 0.50%) ] (Max total pool = 5%).',
            },
          ],
          realWorldScenario: {
            title: 'Calculating Exact Solidarity Contribution on a EUR 10,000,000 Transfer',
            situation:
              'A 24-year-old striker transfers internationally from Club X (Portugal) to Club Y (England) before contract expiry for a fixed transfer fee of EUR 10,000,000. Academy Club Z trained the player continuously for the complete calendar years of his 14th, 15th, 16th, and 17th birthdays.',
            analysis:
              'Let’s compute Club Z’s exact Solidarity Contribution using the Annexe 5 table:\n• Calendar year of 14th birthday = `0.25%` (5% of 5%)\n• Calendar year of 15th birthday = `0.25%` (5% of 5%)\n• Calendar year of 16th birthday = `0.50%` (10% of 5%)\n• Calendar year of 17th birthday = `0.50%` (10% of 5%)\n• Total % of transfer fee owed to Club Z = `0.25% + 0.25% + 0.50% + 0.50% = 1.50%`!\n• EUR `10,000,000 × 1.50% = EUR 150,000` (deducted from the 5% solidarity pool of EUR 500,000 and routed automatically via the **FIFA Clearing House**!).',
            takeaway:
              'Never panic on Solidarity math—just tally `0.25%` per year for ages 12–15 and `0.50%` per year for ages 16–23, sum them, and multiply by the transfer fee!',
          },
          examTraps: [
            'Trap: Applying Solidarity Mechanism to a **FREE TRANSFER** (expired contract, $0 transfer fee). Solidarity applies ONLY when a professional transfers BEFORE contract expiry for transfer compensation (including paid loan fees!).',
            'Trap: Mixing up Training Comp age cap (**12–21**, payable up to **23**) vs. Solidarity age span (**12–23**)! Training stops counting after calendar year of 21st birthday; Solidarity counts all the way through calendar year of 23rd birthday!',
            'Trap: Forgetting the **Category IV** rule for Training Compensation ages 12–15, OR forgetting that transferring TO a Category IV club triggers ZERO Training Compensation!',
            'Trap: Saying a 17-year-old living 60 km from the border transferring to a club 30 km across the border qualifies under Art. 19.2(c) because total distance is 90 km (<100 km). WRONG! BOTH distances must individually be **<= 50 km** from the border!',
          ],
          keyTerms: [
            {
              term: 'Solidarity Mechanism (RSTP Art. 21 & Annexe 5)',
              definition:
                '5% deduction from transfer compensation paid for a contracted player, distributed to clubs that trained the player between the calendar years of their 12th and 23rd birthdays.',
            },
            {
              term: 'Training Compensation (RSTP Art. 20 & Annexe 4)',
              definition:
                'Fixed-category fee compensating clubs for training a player (ages 12–21), triggered on first pro contract or international transfer up to age 23.',
            },
            {
              term: 'Art. 19.2(c) Cross-Border Exception',
              definition:
                'Minor transfer exception where player domicile is <=50 km from border AND club HQ is <=50 km from border (<=100 km total) while player stays living at home.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d2-l3-q1',
              question:
                'A 25-year-old midfielder transfers internationally before contract expiry for EUR 20,000,000. Youth Club M trained him for the full calendar years of his 12th, 13th, and 16th birthdays. How much Solidarity Contribution is due to Club M?',
              options: [
                'EUR 100,000 (0.50%)',
                'EUR 200,000 (1.00%)',
                'EUR 300,000 (1.50%)',
                'EUR 1,000,000 (5.00%)',
              ],
              correctIndex: 1,
              rationale:
                'Age 12 = 0.25%, Age 13 = 0.25%, Age 16 = 0.50%. Sum = `0.25% + 0.25% + 0.50% = 1.00%` of EUR 20,000,000 = `EUR 200,000`.',
            },
            {
              id: 'fifa-d2-l3-q2',
              question:
                'A 16-year-old amateur player lives 55 km from the border between Country A and Country B, and wants to join an academy located 20 km inside Country B (75 km total distance) while continuing to live at home. Does this qualify under the RSTP Art. 19 para 2(c) border exception?',
              options: [
                'Yes, because total distance is 75 km, which is under the 100 km maximum',
                'No, because the player’s domicile exceeds the mandatory individual 50 km distance limit from the border',
                'Yes, because the player is 16 years old',
                'Yes, provided the player’s agent signs a waiver',
              ],
              correctIndex: 1,
              rationale:
                'RSTP Art. 19 para 2(c) imposes THREE cumulative distance caps: domicile <=50 km from border, club <=50 km from border, AND total distance <=100 km. At 55 km, the player fails the individual 50 km cap.',
            },
          ],
          practicalDrill: {
            title: 'Solidarity Math & Art. 19 Exception Lab',
            prompt:
              'Compute two Solidarity payouts (including a 6-month partial year!) and judge two Art. 19 minor cases.',
            steps: [
              'EUR 4,000,000 transfer: Club A trained player for full calendar year of 15th birthday (0.25%) + exactly half (6 months) of calendar year of 16th birthday (0.25%) -> Compute exact EUR payout.',
              'Check whether Training Compensation is payable when a 22-year-old pro transfers from a Cat I club to a Cat IV amateur club -> Cite Annexe 4.',
              'List all 5 Art. 19 para 2 exceptions from memory and state which body MUST approve every exception before registration (Football Tribunal Sub-Committee).',
            ],
            successCriteria:
              'EUR 4,000,000 × (0.25% + 0.25% = 0.50%) = EUR 20,000; Zero training comp when moving to Cat IV; all 5 exceptions accurate.',
          },
          flashcards: [
            {
              front: 'What exact percentage of a transfer fee does Solidarity Mechanism award per full calendar year for ages 12–15 vs. ages 16–23?',
              back: 'Ages 12–15: 0.25% per full year (5% of the 5% pool). Ages 16–23: 0.50% per full year (10% of the 5% pool). Total pool = 5%.',
              tag: 'FIFA-D2',
            },
            {
              front: 'List the 5 exceptions permitting an international transfer of a minor under RSTP Art. 19 para 2.',
              back: '1. Parents move for non-football reasons; 2. EU/EEA transfer aged 16–18; 3. 50km+50km (<=100km) cross-border rule; 4. Humanitarian/refugee; 5. Amateur academic exchange student (<=1 yr).',
              tag: 'FIFA-D2',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 3: FIFA Statutes, Football Tribunal & Disciplinary/Ethics (15%)
    // =================================================================
    {
      id: 'fifa-d3',
      domainNumber: 3,
      title: 'FIFA Statutes, Football Tribunal & Disciplinary/Ethics Codes',
      examWeightPercent: 15,
      overview:
        'Covers FIFA’s institutional governance (Congress, Council, General Secretariat, Judicial Bodies), the three Chambers of the FIFA Football Tribunal (DRC, PSC, Agents Chamber), Procedural Rules (Jan 2026 ed.) & CAS 21-day appeal window, FIFA Disciplinary Code (Sept 2025 ed.), and FIFA Code of Ethics (2023 ed.).',
      lessons: [
        {
          id: 'fifa-d3-l1',
          title: 'FIFA Statutes (May 2024), Football Tribunal Chambers (Jan 2026 Rules) & CAS Appeals',
          estimatedMinutes: 45,
          summary:
            'Navigate FIFA’s governing organs cleanly and know EXACTLY which Football Tribunal chamber (DRC, PSC, or Agents Chamber) hears any dispute, plus the 2-year statute of limitations, procedural fees, and 21-day CAS appeal window.',
          learningObjectives: [
            'Distinguish FIFA’s legislative body (Congress), strategic/oversight body (Council — 37 members), executive/operational body (General Secretariat), and independent Judicial Bodies (Disciplinary, Ethics, Appeal Committees).',
            'Route ANY football dispute to the exact FIFA Football Tribunal Chamber: Dispute Resolution Chamber (DRC), Players’ Status Chamber (PSC), or Agents Chamber.',
            'Memorize critical Procedural Rules deadlines: 2-year limitation period to file claims, 10 days to request motivated decision grounds, and 21 days to appeal final FIFA decisions to CAS.',
          ],
          coreConcepts: [
            {
              heading: 'FIFA Statutes Organs & The 3 Football Tribunal Chambers',
              explanation:
                'Under the **FIFA Statutes (May 2024 edition)**: **Congress** is the supreme and legislative body (211 member associations, 1 vote each); **Council** (37 members: President, 8 VPs, 28 members—at least 1 female per confederation) is the strategic and oversight body; **General Secretariat** is the executive/operational/administrative body; **Judicial Bodies** (Disciplinary Committee, Ethics Committee, Appeal Committee) are independent.\nFor contractual and regulatory disputes, the **FIFA Football Tribunal** has **THREE distinct chambers**:\n1. **Dispute Resolution Chamber (DRC)**: Equal player/club representation! Hears **employment-related disputes between a CLUB and a PLAYER of an international dimension** (plus training compensation & solidarity disputes between clubs from different associations!). **FREE** of procedural costs for players!\n2. **Players’ Status Chamber (PSC)**: Hears **employment disputes between a CLUB/ASSOCIATION and a COACH** of an international dimension, **club-vs-club transfer fee disputes** of an international dimension, and **regulatory applications** (Art. 19 minor approvals via Sub-Committee, ITC disputes, eligibility/change of association)!\n3. **Agents Chamber (FFAR Art. 20)**: Hears **Representation Agreement disputes of an international dimension** involving a FIFA Football Agent (NOTE: temporarily impacted by Circular 1873 suspension regarding mandatory submission, but tested under FFAR & Procedural Rules!).',
              mentalModel:
                'Tribunal Routing Cheat Code: Club vs. PLAYER = **DRC** | Club vs. COACH or Club vs. Club Transfer Fee or Minor Art. 19 = **PSC** | Agent vs. Client Representation Fee (int’l) = **Agents Chamber**!',
              formulaOrRule:
                'Limitation Period = 2 Years from event | Request Written Grounds = 10 Days | Appeal to CAS = 21 Days from receipt of motivated decision!',
            },
            {
              heading: 'Procedural Rules (Jan 2026 Ed.) & CAS Appeals (FIFA Statutes Art. 56–57)',
              explanation:
                '• **2-Year Limitation Period**: The Football Tribunal will NOT hear any claim if more than **2 years** have elapsed since the event giving rise to the dispute.\n• **Free Proceedings**: Claims before the DRC and Agents Chamber (and claims involving individuals/coaches below specified thresholds) carry ZERO procedural costs for natural persons; club-vs-club PSC transfer disputes carry procedural fees.\n• **Motivated Decision & CAS Appeal**: After receiving the operative decision (findings), a party has **10 days** to request the full written grounds (failing to request grounds within 10 days makes the decision final and waives the right to appeal!). Once full motivated grounds are notified, the party has **21 days** to lodge an appeal before the **Court of Arbitration for Sport (CAS)** in Lausanne, Switzerland! Note: Recourse to ordinary civil courts is generally prohibited by FIFA Statutes Art. 58 unless explicitly allowed.',
              mentalModel:
                'Appeal Countdown Clock: Event -> File within **2 years** -> Decision arrives -> Request grounds within **10 days** -> File CAS appeal within **21 days**!',
            },
          ],
          realWorldScenario: {
            title: 'Routing Three Simultaneous International Disputes',
            situation:
              'On the same week, three disputes arise: (1) A Colombian head coach sues a Turkish club for unpaid severance; (2) A Senegalese striker sues a Belgian club for overdue wages; (3) A French club sues an Italian club over an unpaid EUR 2M transfer instalment. The Turkish club loses and waits 14 days before asking for written grounds so it can appeal to CAS.',
            analysis:
              '1) Colombian Coach vs. Turkish Club -> **Players’ Status Chamber (PSC)** (NOT DRC—coaches always go to PSC!).\n2) Senegalese Striker vs. Belgian Club -> **Dispute Resolution Chamber (DRC)** (international player-club employment dispute).\n3) French Club vs. Italian Club -> **Players’ Status Chamber (PSC)** (international club-club transfer dispute).\n4) Turkish club waited 14 days (> **10-day deadline** to request grounds!), so the decision became **final and binding**, forfeiting its right to appeal to CAS!',
            takeaway:
              'Remember the #1 Tribunal trap: **COACHES go to the PSC, NEVER the DRC!** And missing the 10-day request-for-grounds deadline kills your CAS appeal before the 21-day clock even starts!',
          },
          examTraps: [
            'Trap: Routing an international **Coach vs. Club** employment dispute to the DRC. Players go to DRC; **COACHES always go to the Players’ Status Chamber (PSC)**!',
            'Trap: Mixing up **10 days** (deadline to request motivated grounds) with **21 days** (deadline to appeal to CAS after receiving grounds).',
            'Trap: Assuming the FIFA Football Tribunal hears purely **DOMESTIC** disputes (same nationality player/agent and domestic club). FIFA Football Tribunal requires an **INTERNATIONAL DIMENSION**!',
          ],
          keyTerms: [
            {
              term: 'Dispute Resolution Chamber (DRC)',
              definition:
                'Football Tribunal chamber with equal player/club representation deciding international club-player employment disputes and training/solidarity claims.',
            },
            {
              term: 'Players’ Status Chamber (PSC)',
              definition:
                'Football Tribunal chamber deciding international club-coach disputes, club-club transfer disputes, and regulatory applications (including Art. 19 minors).',
            },
            {
              term: 'Court of Arbitration for Sport (CAS)',
              definition:
                'Independent sports arbitration court in Lausanne recognized by FIFA Statutes as the appellate body for final FIFA decisions (21-day appeal window).',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d3-l1-q1',
              question:
                'A Portuguese head coach terminates his contract with a Saudi Arabian club for unpaid salaries and wants to file a claim before FIFA. Which chamber of the FIFA Football Tribunal has jurisdiction?',
              options: [
                'Dispute Resolution Chamber (DRC)',
                'Players’ Status Chamber (PSC)',
                'Agents Chamber',
                'FIFA Congress',
              ],
              correctIndex: 1,
              rationale:
                'International employment disputes between a club/association and a COACH always fall under the **Players’ Status Chamber (PSC)**, whereas player-club disputes go to the DRC.',
            },
            {
              id: 'fifa-d3-l1-q2',
              question:
                'A club receives an adverse operative decision (findings only) from the FIFA Football Tribunal on 1 June. Within how many days must it request the motivated written grounds, and within how many days of receiving those grounds must it appeal to CAS?',
              options: [
                '5 days to request grounds; 14 days to appeal to CAS',
                '10 days to request grounds; 21 days to appeal to CAS',
                '15 days to request grounds; 30 days to appeal to CAS',
                '21 days to request grounds; 60 days to appeal to CAS',
              ],
              correctIndex: 1,
              rationale:
                'Procedural Rules grant 10 days from notification of findings to request motivated grounds; FIFA Statutes grant 21 days from receipt of the motivated decision to lodge an appeal at CAS.',
            },
          ],
          practicalDrill: {
            title: 'FIFA Dispute Routing & Deadline Mastery Table',
            prompt:
              'Route 5 disputes and verify exact statutory deadlines.',
            steps: [
              'Route: (1) Foreign player vs. club wages; (2) Foreign coach vs. club termination; (3) Club A vs. Club B transfer fee; (4) Art. 19 minor transfer approval; (5) Domestic player vs. domestic club in same country.',
              'State the exact Football Tribunal statute of limitations (2 years), grounds request window (10 days), and CAS appeal window (21 days).',
              'Name the 3 independent FIFA Judicial Bodies (Disciplinary, Ethics, Appeal Committees).',
            ],
            successCriteria:
              '1=DRC, 2=PSC, 3=PSC, 4=PSC Sub-Committee, 5=National NDRC/association (no international dimension!). Exact 2y/10d/21d numbers.',
          },
          flashcards: [
            {
              front: 'Which Football Tribunal chamber hears (a) Player vs. Club, (b) Coach vs. Club, and (c) Club vs. Club international transfer disputes?',
              back: '(a) DRC (Dispute Resolution Chamber), (b) PSC (Players’ Status Chamber), (c) PSC (Players’ Status Chamber).',
              tag: 'FIFA-D3',
            },
            {
              front: 'What are the 3 key FIFA dispute deadlines: Statute of Limitations, Requesting Grounds, and Appealing to CAS?',
              back: '2 years to file claim; 10 days to request written grounds; 21 days from receipt of written grounds to appeal to CAS.',
              tag: 'FIFA-D3',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
        {
          id: 'fifa-d3-l2',
          title: 'FIFA Disciplinary Code (Sept 2025 Ed.) & Code of Ethics (2023 Ed.)',
          estimatedMinutes: 45,
          summary:
            'Master disciplinary enforcement (Art. 21 failure to respect decisions/settlement agreements via Circular 1867, strict liability, match manipulation) and Ethics Code prohibitions (bribery, conflicts of interest, gifts, betting, abuse, limitation periods).',
          learningObjectives: [
            'Distinguish the jurisdiction of the FIFA Disciplinary Committee (on-field misconduct, failure to comply with FIFA/CAS decisions & settlement agreements, match manipulation, discrimination) vs. the FIFA Ethics Committee (Investigatory & Adjudicatory Chambers: bribery, corruption, misappropriation, conflicts of interest, betting, abuse).',
            'Apply FIFA Disciplinary Code (Sept 2025 ed. / Circular 1934) and Circular 1867 rules on failure to respect decisions and settlement agreements (45-day payment grace period -> automatic registration ban up to 3 consecutive windows!).',
            'Memorize FIFA Code of Ethics (2023 ed.) core offences and limitation periods: NO statute of limitations for sexual abuse/exploitation; 10 years for bribery/misappropriation/match manipulation; 5 years for general ethics breaches!',
          ],
          coreConcepts: [
            {
              heading: 'FIFA Disciplinary Code (Sept 2025 Ed.) & Failure to Respect Decisions (Art. 21)',
              explanation:
                'The **FIFA Disciplinary Committee** sanctions violations of FIFA regulations outside the Ethics Committee’s remit—notably:\n• **Failure to Respect Decisions (Art. 21) & Settlement Agreements (Circular 1867)**: If a club or individual fails to pay sums ordered by a FIFA body, CAS, or a valid **settlement agreement** signed after a FIFA/CAS decision, the Disciplinary Committee imposes a fine AND (for clubs) a **ban on registering new players nationally and internationally** (typically up to **3 entire consecutive registration periods**—lifted immediately once debt is paid in full!), or (for individuals) a ban on football-related activity!\n• **Match Manipulation (Art. 20 FDC / Art. 30 FCE)**: Minimum **5-year ban** on taking part in any football-related activity plus minimum CHF 100,000 fine—and duty to IMMEDIATELY report any approach!\n• **Discrimination (FDC Sept 2025 / Circular 1934)**: Toughened sanctions (minimum 10-match ban for players/officials, enhanced fines, 3-step anti-racism match protocol).\n• **Limitation Periods (FDC Art. 10)**: 2 years for match infringements; 10 years for anti-doping; **NO limitation period** for match manipulation!',
              mentalModel:
                'Art. 21 Debt Enforcement hammer: Don’t pay a FIFA/CAS award or settlement -> automatic transfer/registration ban across up to 3 consecutive windows until every cent is paid!',
              formulaOrRule:
                'Ethics Limitation Periods (FCE Art. 12): Sexual Abuse = NONE (Unlimited) | Bribery, Misappropriation, Match Manipulation = 10 Years | All Other Ethics Offences = 5 Years.',
            },
            {
              heading: 'FIFA Code of Ethics (2023 Ed.): Two Chambers, Betting, Gifts & Duty to Report',
              explanation:
                'The **FIFA Ethics Committee** applies to ALL officials, match agents, and **FIFA Football Agents**—and is strictly split into an **Investigatory Chamber** (investigates & prosecutes) and an **Adjudicatory Chamber** (judges & sanctions—never overlapping!). Core prohibitions for agents:\n• **Conflicts of Interest (Art. 20)**: Must immediately disclose and abstain whenever personal/financial interests conflict with duties.\n• **Gifts & Benefits (Art. 21)**: May ONLY offer/accept symbolic or trivial gifts with no undue influence—NEVER cash!\n• **Bribery (Art. 28) & Misappropriation of Funds (Art. 29)**: Strictly banned (minimum 5-year football ban + CHF 100k fine; lifetime ban for serious cases!).\n• **Involvement in Betting & Gambling (Art. 27)**: Strictly forbidden from participating directly or indirectly in betting, gambling, lotteries, or holding financial interests in betting entities related to football matches (minimum 3-year ban + CHF 100k fine!).\n• **Protection of Physical & Mental Integrity (Art. 24)**: Zero tolerance for harassment, sexual abuse, or exploitation (**NO limitation period**; minimum 10-year to lifetime ban!).\n• **Duty to Report (Art. 18)**: Bound persons MUST immediately report any potential Ethics Code breach to the Investigatory Chamber secretariat!',
              mentalModel:
                'Ethics Committee = Police + Judge split cleanly (Investigatory vs. Adjudicatory). Betting = min 3-yr ban; Bribery/Match-Fixing = min 5-yr ban; Abuse = min 10-yr to lifetime (ZERO expiry clock!).',
            },
          ],
          realWorldScenario: {
            title: 'The Agent Who Kept Quiet About a Match-Fixing Approach',
            situation:
              'A syndicate offers FIFA Football Agent Viktor EUR 50,000 to persuade his goalkeeper client to concede a penalty in a cup qualifier. Viktor refuses the money and never talks to the goalkeeper, BUT stays silent and fails to report the approach to FIFA because he "doesn’t want drama." Separately, Viktor places a EUR 20 recreational accumulator bet on Champions League matches where none of his clients play.',
            analysis:
              'Viktor committed TWO serious Ethics Code offences! (1) Under FCE Art. 18 & Art. 30, merely refusing a match-manipulation approach is NOT enough—agents have an affirmative **duty to IMMEDIATELY report** any approach or breach! (2) Under FCE Art. 27, Football Agents are STRICTLY prohibited from betting on ANY football matches/competitions worldwide—even EUR 20 on games involving zero clients—carrying a minimum 3-year football ban and fine!',
            takeaway:
              'Silence in the face of a match-fixing or bribery approach is itself a punishable offence, and recreational football betting is 100% forbidden for licensed agents!',
          },
          examTraps: [
            'Trap: Thinking a Football Agent can bet small recreational amounts on football leagues where they have NO clients. FCE Art. 27 bans agents from betting on football matches entirely!',
            'Trap: Mixing up the Ethics Committee’s Investigatory Chamber (investigates) and Adjudicatory Chamber (renders binding sanctions).',
            'Trap: Assuming a 5-year or 10-year statute of limitations protects perpetrators of sexual abuse/exploitation under the FIFA Code of Ethics. FCE Art. 12 imposes **NO limitation period** for sexual abuse/exploitation!',
          ],
          keyTerms: [
            {
              term: 'Investigatory vs. Adjudicatory Chamber (FCE)',
              definition:
                'The two strictly separated chambers of the independent FIFA Ethics Committee: Investigatory investigates/prosecutes; Adjudicatory adjudicates and imposes sanctions.',
            },
            {
              term: 'Circular no. 1867',
              definition:
                'FIFA circular clarifying that the Disciplinary Committee enforces failure to respect settlement agreements concluded after FIFA/CAS proceedings.',
            },
            {
              term: 'Duty to Report (FCE Art. 18)',
              definition:
                'Mandatory obligation requiring bound individuals (including Football Agents) to report immediately any suspected ethics breach or match-manipulation approach.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d3-l2-q1',
              question:
                'Under the FIFA Code of Ethics (2023 edition), what is the limitation period for prosecuting (a) bribery/match manipulation, and (b) sexual abuse or exploitation?',
              options: [
                '5 years for bribery; 10 years for sexual abuse',
                '10 years for bribery/match manipulation; NO limitation period for sexual abuse/exploitation',
                '2 years for bribery; 5 years for sexual abuse',
                '15 years for both',
              ],
              correctIndex: 1,
              rationale:
                'Under FCE Art. 12, bribery, misappropriation of funds, and manipulation of football matches carry a 10-year limitation period, general breaches carry 5 years, and sexual abuse/exploitation has NO limitation period.',
            },
            {
              id: 'fifa-d3-l2-q2',
              question:
                'A FIFA Football Agent is approached by a third party offering payment to influence a match result. The agent firmly rejects the offer and never contacts any player, but decides not to report the incident to FIFA. Did the agent violate the FIFA Code of Ethics?',
              options: [
                'No, because the agent rejected the bribe and no match was manipulated',
                'Yes—failure to immediately report an approach to manipulate a match violates the mandatory Duty to Report',
                'No, unless the approach occurred inside Switzerland',
                'Only if the offered bribe exceeded CHF 100,000',
              ],
              correctIndex: 1,
              rationale:
                'Both the Code of Ethics (Art. 18 & 30) and FFAR (Art. 16 para 2i) impose an immediate, mandatory duty to report any breach or match-manipulation approach.',
            },
          ],
          practicalDrill: {
            title: 'Disciplinary vs. Ethics Committee Jurisdiction & Sanctions Check',
            prompt:
              'Classify four misconduct cases into the exact FIFA Judicial Body and cite the governing rule.',
            steps: [
              'Case 1: Club ignores a final CAS payment award for 60 days -> Body + exact sanction.',
              'Case 2: Football Agent accepts an undeclared CHF 25,000 cash "thank-you gift" from a federation official -> Body + Chamber + offence.',
              'Case 3: Football Agent places online sports bets on World Cup qualifiers -> Offence + minimum ban duration.',
              'Case 4: Football Agent fails to report a colleague’s match-fixing proposal -> Exact duty breached.',
            ],
            successCriteria:
              '1=Disciplinary Committee (Art. 21 fine + registration ban up to 3 windows), 2=Ethics Investigatory->Adjudicatory (Bribery/Gifts Art. 21/28), 3=FCE Art. 27 (min 3-yr ban), 4=Duty to Report (FCE Art. 18/30).',
          },
          flashcards: [
            {
              front: 'What are the three limitation periods under FIFA Code of Ethics Art. 12?',
              back: 'General offences = 5 years; Bribery, misappropriation & match manipulation = 10 years; Sexual abuse/exploitation = NO limitation period.',
              tag: 'FIFA-D3',
            },
            {
              front: 'What sanction does the Disciplinary Committee impose on a club that refuses to pay a final FIFA/CAS monetary award (FDC Art. 21)?',
              back: 'A fine AND a ban on registering new players (nationally and internationally) until the debt is paid in full (up to 3 entire consecutive registration periods).',
              tag: 'FIFA-D3',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
      ],
    },

    // =================================================================
    // DOMAIN 4: FIFA Clearing House, Safeguarding Minors & Ethical Recruitment (10%)
    // =================================================================
    {
      id: 'fifa-d4',
      domainNumber: 4,
      title: 'FIFA Clearing House, Safeguarding Minors & Ethical Recruitment',
      examWeightPercent: 10,
      overview:
        'High-precision "free points" domain (10%): covers the FIFA Clearing House Regulations (Jan 2026 ed. & Circular 1918 — EPP, Allocation Statements, 30-day payment clock, KYC/AML Compliance Assessments), FIFA Guardians Child Safeguarding Toolkit & Course 1 Essentials, and the FIFA Ethical Recruitment Guide.',
      lessons: [
        {
          id: 'fifa-d4-l1',
          title: 'FIFA Clearing House Regulations (Jan 2026 Ed.): EPP, Allocation Statements & AML Compliance',
          estimatedMinutes: 40,
          summary:
            'Trace every automated step of how the FIFA Clearing House (Paris SAS) processes Training Rewards (Training Compensation & Solidarity): Electronic Player Passport (EPP), 10-day review window, Allocation Statement, 30-day payment rule, and Compliance Assessments.',
          learningObjectives: [
            'Trace the end-to-end FIFA Clearing House workflow: Trigger in TMS -> Provisional EPP generated -> 10-day inspection/review period -> Final EPP -> Allocation Statement -> Payment Notice -> 30-day payment to Clearing House -> KYC/AML Compliance Assessment -> Distribution to Training Clubs!',
            'Explain the strict ban on bypassing the FIFA Clearing House (paying Training Rewards directly to clubs or signing side waivers once triggered!) and consequences of failing Compliance Assessments.',
            'Understand updates in the January 2026 Clearing House Regulations & Circular 1918 (electronic payment transparency, AML/sanctions screening, non-compliance penalties).',
          ],
          coreConcepts: [
            {
              heading: 'The Electronic Player Passport (EPP) & Clearing House Workflow',
              explanation:
                'Established as an independent payment institution in Paris (FIFA Clearing House SAS), the Clearing House centralizes, automates, and audits **Training Rewards** (Training Compensation + Solidarity Contributions) so grassroots academies actually get paid and football money stays clean of money laundering!\nMemorize the exact sequence & clocks:\n1. **Trigger**: First pro registration or international transfer with fee recorded in FIFA TMS.\n2. **Provisional EPP**: FIFA automatically generates an **Electronic Player Passport (EPP)** compiling the player’s registration history from age **12** onward via Member Association electronic systems (FIFA Connect).\n3. **Inspection & Review Period**: Member Associations and clubs inspect the provisional EPP (strict **10-day inspection window** to flag errors or request EPP Review!).\n4. **Final EPP & Allocation Statement**: FIFA approves the final EPP and issues the **Allocation Statement** calculating exact EUR/USD amounts owed to every training club.\n5. **30-Day Payment Rule**: The New Club receives a Payment Notification from the FIFA Clearing House and MUST pay the full sum to the Clearing House within **30 DAYS**! (CRITICAL: Paying the training club directly instead of via the Clearing House does NOT discharge your debt—you violate FCH Regulations and face a **2.5% administrative levy** and Disciplinary transfer ban!).\n6. **Compliance Assessment (KYC / AML / Sanctions)**: BOTH the paying New Club AND every receiving Training Club must pass strict Clearing House KYC/AML/sanctions vetting (beneficial ownership, source of funds, PEP checks). If a club fails a **first** Compliance Assessment -> 6-month re-assessment window; failing a **second** Compliance Assessment -> Training Club forfeits entitlement to that reward (or Paying Club faces Disciplinary sanctions)!',
              mentalModel:
                'Automated Escrow Bank for Grassroots Football: TMS Trigger -> Provisional EPP (10-day check) -> Final EPP & Allocation Statement -> New Club pays Clearing House in 30 days -> AML/KYC Check -> Academies paid cleanly!',
              formulaOrRule:
                'Clearing House Clocks: EPP Inspection = 10 Days | New Club Payment = 30 Days | Late/Non-Payment Admin Levy = 2.5% + Disciplinary Transfer Ban!',
            },
          ],
          realWorldScenario: {
            title: 'The "Friendly Direct Wire" That Violated FIFA Clearing House Rules',
            situation:
              'After buying a 21-year-old defender internationally, Club Novo receives an Allocation Statement from FIFA instructing it to pay EUR 120,000 in Training Compensation via the FIFA Clearing House within 30 days. Instead, Club Novo’s Sporting Director wires EUR 100,000 directly to the player’s old academy after signing a bilateral "settlement discount" email.',
            analysis:
              'Direct payment bypasses the mandatory FIFA Clearing House AML/KYC clearing process! Under the FIFA Clearing House Regulations (Jan 2026 ed.), once an Allocation Statement is issued, Training Rewards MUST be paid exclusively through the Clearing House (clubs cannot privately settle/bypass FCH after trigger to evade compliance screening). Club Novo remains non-compliant and faces the administrative levy and FIFA Disciplinary Committee sanctions!',
            takeaway:
              'Never bypass the FIFA Clearing House once an EPP/Allocation Statement triggers—pay through FCH within 30 days and pass Compliance Assessment cleanly.',
          },
          examTraps: [
            'Trap: Thinking a New Club can legally bypass the FIFA Clearing House by wiring Training Compensation directly to the grassroots club. FCH processing is MANDATORY!',
            'Trap: Confusing the **10-day** provisional EPP inspection window with the **30-day** New Club payment deadline to the Clearing House.',
            'Trap: Forgetting that BOTH the **Paying Club** AND the **Receiving Training Club** must pass the FIFA Clearing House KYC/AML Compliance Assessment!',
          ],
          keyTerms: [
            {
              term: 'Electronic Player Passport (EPP)',
              definition:
                'Consolidated electronic document automatically compiled by FIFA listing a player’s complete registration history from age 12 onward to calculate Training Rewards.',
            },
            {
              term: 'Allocation Statement',
              definition:
                'Binding FIFA calculation detailing the exact Training Compensation or Solidarity amounts payable by the New Club to each eligible training club via the Clearing House.',
            },
            {
              term: 'FCH Compliance Assessment',
              definition:
                'Mandatory KYC, beneficial ownership, source-of-funds, and anti-money-laundering/sanctions vetting conducted by the FIFA Clearing House on paying and receiving clubs.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d4-l1-q1',
              question:
                'Under the FIFA Clearing House Regulations (January 2026 edition), within how many days of receiving the Payment Notification must a New Club transfer the required Training Rewards to the FIFA Clearing House?',
              options: [
                '10 days',
                '14 days',
                '30 days',
                '60 days',
              ],
              correctIndex: 2,
              rationale:
                'The New Club has 30 days from receipt of the Payment Notification from the FIFA Clearing House to settle the full Allocation Statement amount.',
            },
            {
              id: 'fifa-d4-l1-q2',
              question:
                'Which parties must successfully pass a FIFA Clearing House Compliance Assessment (KYC/AML vetting) before Training Rewards are distributed?',
              options: [
                'Only the Paying (New) Club',
                'Only the Receiving Training Clubs',
                'BOTH the Paying (New) Club AND each Receiving Training Club',
                'Only the player’s Football Agent',
              ],
              correctIndex: 2,
              rationale:
                'As a regulated French payment institution enforcing AML/CFT compliance, the FIFA Clearing House conducts mandatory Compliance Assessments on BOTH the paying club (source of funds) AND every receiving club (beneficial ownership/sanctions).',
            },
          ],
          practicalDrill: {
            title: 'Trace a Training Reward Through the FIFA Clearing House',
            prompt:
              'Sequence all 6 stages from TMS transfer entry to final academy payout.',
            steps: [
              'List the 6 chronological steps (Trigger -> Provisional EPP -> 10-Day Inspection -> Final EPP & Allocation Statement -> 30-Day Payment -> KYC/AML & Payout).',
              'Explain what happens if a grassroots academy discovers a missing registration year during the 10-day EPP review window.',
              'State the consequence if a paying club pays late or fails its Compliance Assessment twice.',
            ],
            successCriteria:
              'Exact sequence, exact 10-day and 30-day clocks, and accurate Compliance Assessment failure outcomes.',
          },
          flashcards: [
            {
              front: 'What is the Electronic Player Passport (EPP) and what age does it start tracking?',
              back: 'FIFA’s automated official record of a player’s complete club registration history starting from the calendar year of their 12th birthday, used to compute Training Rewards.',
              tag: 'FIFA-D4',
            },
            {
              front: 'What are the two core deadlines in the FIFA Clearing House process?',
              back: '10 days for EPP inspection/review; 30 days for the New Club to pay the FIFA Clearing House after receiving Payment Notification.',
              tag: 'FIFA-D4',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
        {
          id: 'fifa-d4-l2',
          title: 'FIFA Guardians Child Safeguarding & FIFA Ethical Recruitment Guide',
          estimatedMinutes: 45,
          summary:
            'Master the human-rights and child-protection modules embedded in the 2026 FIFA Study Materials: the 5 FIFA Guardians Principles, 5 Pillars of Safeguarding, recognizing the 5 types of abuse & grooming, responding safely to child disclosures, and fighting fake-agent trafficking via the FIFA Ethical Recruitment Guide.',
          learningObjectives: [
            'Recall the 5 FIFA Guardians Safeguarding Principles and 5 Pillars (Prevent, Embed, Safeguard/Respond, Protect, Review) from the FIFA Guardians Toolkit & Course 1 Essentials.',
            'Identify all 5 categories of harm/abuse (Physical, Emotional/Psychological, Sexual, Neglect, Bullying/Cyberbullying) plus warning signs of grooming and trafficking of young players.',
            'Execute the exact trauma-informed response protocol when a child discloses abuse (STAY CALM, LISTEN, REASSURE, DO NOT PROMISE SECRECY, DO NOT INVESTIGATE YOURSELF, RECORD FACTUALLY, REPORT IMMEDIATELY to Safeguarding Officer / Authorities!).',
            'Apply the FIFA Ethical Recruitment Guide to detect human trafficking indicators (debt bondage, passport confiscation, upfront "trial fees," false promises, abandoned minors abroad).',
          ],
          coreConcepts: [
            {
              heading: 'FIFA Guardians Safeguarding Essentials: Principles, Abuse Types & Disclosure Protocol',
              explanation:
                'Every candidate MUST study pages 300–438 of the January 2026 Study Materials—FIFA reliably puts 1–2 questions directly from Guardians & Ethical Recruitment!\n• **Definition of a Child**: Any person **under the age of 18** (UN Convention on the Rights of the Child).\n• **5 Types of Harm/Abuse**: (1) Physical abuse, (2) Emotional/Psychological abuse, (3) Sexual abuse & exploitation, (4) Neglect, and (5) Bullying (including cyberbullying/hazing).\n• **Golden Disclosure Protocol (WHEN A CHILD TELLS YOU THEY ARE BEING ABUSED — MEMORIZE EVERY "DO" & "DON’T"!)**:\n  – **DO**: Stay calm and composed; listen actively without interrupting; reassure the child they did the right thing and it is NOT their fault; write down exact factual words/timestamps promptly; **report IMMEDIATELY** to the designated Safeguarding Officer (or police/child protection if in immediate danger)!\n  – **DON’T**: NEVER promise total secrecy ("I promise I won’t tell anyone" -> WRONG, you MUST report to protect them!); NEVER ask leading/interrogating questions or conduct your OWN investigation; NEVER confront the alleged perpetrator yourself (risks destroying evidence or triggering retaliation against the child!).',
              mentalModel:
                'Guardians Disclosure Rule: **Listen, Reassure, Record, Report** — NEVER Promise Secrecy, NEVER Play Detective, NEVER Confront the Perpetrator!',
              formulaOrRule:
                'Child Disclosure Rule: Listen Calmly -> Reassure (Not Their Fault) -> Explain You Must Tell Someone Who Can Help (NO Secrecy!) -> Record Exact Facts -> Report Immediately to Safeguarding Officer/Police.',
            },
            {
              heading: 'FIFA Ethical Recruitment Guide: Combating Youth Trafficking & Fake-Agent Scams',
              explanation:
                'Included in Chapter I of the Jan 2026 Study Materials (pp. 439–522), the **FIFA Ethical Recruitment Guide** protects vulnerable players (especially youth from Africa, Latin America, and developing regions) from trafficking and exploitation disguised as football trials. Red flags of unethical/trafficking recruitment:\n• Charging **upfront "trial fees," visa fees, or travel debts** (creating debt bondage!).\n• **Confiscating passports**, identity papers, or phones upon arrival abroad.\n• Making unrealistic guarantees of European pro contracts to families who sell land/homes to pay fake agents.\n• Bypassing **RSTP Art. 19** by moving minors on tourist/student visas into unregulated "informal academies" and abandoning them undocumented when trials fail.\nEthical agents verify club legitimacy in writing, NEVER charge recruitment/trial fees to minors, ensure legal guardian involvement & written transparent contracts, respect Art. 19 strictly, and ensure safe repatriation/return-home plans!',
              mentalModel:
                'If someone asks a 16-year-old’s family for $5,000 cash for a "guaranteed European trial" and holds the boy’s passport at the airport—that is NOT football agency, that is **human trafficking**.',
            },
          ],
          realWorldScenario: {
            title: 'Handling a 16-Year-Old Client’s Abuse Disclosure Properly',
            situation:
              'After a youth tournament, a 16-year-old player pulls his licensed agent aside in tears and says, "Please promise you won’t tell anyone, but the academy assistant coach has been sending me explicit late-night messages and threatening to drop me if I don’t meet him alone."',
            analysis:
              'Under FIFA Guardians Safeguarding Essentials: (1) The agent MUST stay calm, listen, and reassure the player it is NOT his fault; (2) The agent MUST gently explain he **cannot promise secrecy** because keeping the player safe requires reporting to someone who can protect him; (3) The agent MUST NOT call or confront the assistant coach and MUST NOT interrogate the player or launch a personal investigation; (4) The agent records exact factual details promptly and reports IMMEDIATELY to the club/association Safeguarding Officer, FIFA Safeguarding/Ethics, and statutory child-protection/police authorities!',
            takeaway:
              'On FIFA Guardians questions, ALWAYS reject any option that says "promise confidentiality," "confront the coach," or "wait to gather more proof yourself"!',
          },
          examTraps: [
            'Trap: Picking "Promise the child you will keep it strictly secret to maintain trust." NEVER promise secrecy in a child abuse disclosure—explain honestly that you must inform a safeguarding professional to keep them safe!',
            'Trap: Picking "Confront the suspected coach immediately to hear their side of the story." Confronting a perpetrator endangers the child and compromises criminal/safeguarding investigations!',
            'Trap: Skipping pages 300–522 of the 2026 Study Materials assuming the exam is "only FFAR and RSTP." Guardians Safeguarding and Ethical Recruitment regularly appear on the 20-question exam—and they are fast, guaranteed points when prepared!',
          ],
          keyTerms: [
            {
              term: 'Grooming',
              definition:
                'Deliberate process by which an abuser builds trust, emotional dependency, or secrecy with a child (and often their family/environment) to facilitate abuse or exploitation.',
            },
            {
              term: 'FIFA Guardians',
              definition:
                'FIFA’s global child safeguarding program providing principles, toolkits, and educational courses to prevent and respond to harm/abuse against minors in football.',
            },
            {
              term: 'Debt Bondage (Ethical Recruitment)',
              definition:
                'Exploitative trafficking practice trapping young players or families in inflated debts for visas, flights, or fake trials to coerce compliance.',
            },
          ],
          conceptChecks: [
            {
              id: 'fifa-d4-l2-q1',
              question:
                'A 15-year-old academy player confides in you that a club staff member has been physically abusing him and begs you to promise not to tell anyone. Under FIFA Guardians Safeguarding Essentials, what is the CORRECT response?',
              options: [
                'Promise total secrecy so the player continues trusting you while you privately observe the coach',
                'Confront the club staff member immediately in the locker room to stop the behavior',
                'Stay calm, reassure the player it is not their fault, explain honestly that you cannot promise secrecy because their safety comes first, record exact facts, and report immediately to the designated Safeguarding Officer/authorities',
                'Ask the player to secretly film the staff member to collect courtroom proof first',
              ],
              correctIndex: 2,
              rationale:
                'FIFA Guardians strictly mandates: Listen calmly, reassure, NEVER promise secrecy, NEVER confront the suspect or self-investigate, record factual notes, and report immediately to safeguarding/statutory authorities.',
            },
            {
              id: 'fifa-d4-l2-q2',
              question:
                'Which combination of behaviors is a classic warning sign of youth player trafficking highlighted in the FIFA Ethical Recruitment Guide?',
              options: [
                'Completing the FIFA Minors CPD course and requesting FIFA Football Tribunal Sub-Committee approval under RSTP Art. 19',
                'Charging a minor’s family upfront cash for a "guaranteed overseas trial," bringing the minor abroad on a tourist visa, and confiscating their passport upon arrival',
                'Ensuring a minor’s legal guardian attends all club meetings and receives written translated contracts',
                'Verifying a club’s official invitation directly with the relevant Member Association',
              ],
              correctIndex: 1,
              rationale:
                'Upfront trial fees (debt bondage), irregular tourist-visa migration bypassing RSTP Art. 19, and passport confiscation are hallmark trafficking indicators condemned by the FIFA Ethical Recruitment Guide.',
            },
          ],
          practicalDrill: {
            title: 'Safeguarding & Ethical Recruitment Red-Flag Audit',
            prompt:
              'Review a proposed overseas youth trial invitation for a 16-year-old player and apply both Guardians and Ethical Recruitment safeguards.',
            steps: [
              'List 4 verification steps confirming an overseas club trial is genuine and compliant with the FIFA Ethical Recruitment Guide.',
              'Write the exact 5-step FIFA Guardians disclosure checklist from memory (Listen -> Reassure -> No Secrecy -> Factually Record -> Immediate Report).',
              'Identify how RSTP Art. 19, FFAR Art. 13, and FIFA Guardians work together as a three-layer protective shield for minors.',
            ],
            successCriteria:
              'Zero tolerance for upfront minor trial fees or passport retention, complete 5-step disclosure response, and seamless integration across FFAR/RSTP/Guardians.',
          },
          flashcards: [
            {
              front: 'What are the 3 absolute "NEVER DOs" when a child discloses abuse under FIFA Guardians?',
              back: '1. NEVER promise total secrecy; 2. NEVER interrogate/conduct your own investigation; 3. NEVER confront the alleged perpetrator yourself.',
              tag: 'FIFA-D4',
            },
            {
              front: 'Name 4 hallmark red flags of football youth trafficking in the FIFA Ethical Recruitment Guide.',
              back: 'Upfront trial/visa fees (debt bondage), confiscating passports/IDs, bypassing RSTP Art. 19 via tourist visas, and abandoning unsuccessful minors abroad without return support.',
              tag: 'FIFA-D4',
            },
          ],
          sourceRefs: [
            'my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf',
          ],
        },
      ],
    },
  ],
  capstone: {
    title: 'Capstone: Full-Cycle International Transfer, Fee Cap, Solidarity & Tribunal Case (2026 Edition)',
    scenario:
      'On 1 July 2026, 22-year-old striker Kofi (registered at Ghanaian Academy Club A from ages 12–17, and sold to French Club B at age 18) transfers internationally from French Club B to English Club C with 2 years remaining on his contract for a fixed transfer fee of EUR 6,000,000 PLUS a 15% future sell-on clause. Kofi signs a 4-year contract with English Club C earning USD 500,000/year guaranteed fixed base salary PLUS USD 120,000/year conditional goal bonus. Licensed FIFA Agent Nadia obtains prior explicit written consent from BOTH Kofi and Club C to act in Permitted Dual Representation. Meanwhile, licensed Agent Sam represents Selling Club B. Two days later, an unrelated 16-year-old youth player at Club C confides in Nadia that a scout demanded EUR 3,000 cash from his parents for a fake overseas trial and kept his passport.',
    tasks: [
      'FFAR Dual Rep & Service Fee Cap Math: Verify whether Nadia’s dual representation is legal (Art. 12 para 8a), calculate Nadia’s MAXIMUM annual service fee cap using Art. 15 para 2(b) marginal brackets, calculate the max Club C can pay (Art. 14 para 10), specify payment frequency (Art. 14 para 6), and calculate Sam’s max fee for Selling Club B (Art. 15 para 2c).',
      'RSTP Solidarity Mechanism Math & Clearing House: Calculate Ghanaian Academy Club A’s exact Solidarity Contribution (trained Kofi for full calendar years of ages 12, 13, 14, 15, 16, and 17!) on the EUR 6,000,000 transfer, and trace the exact FIFA Clearing House steps & deadlines (10-day EPP, 30-day payment, dual KYC/AML).',
      'Platform Disclosures & Circular 1873: State Nadia’s Art. 16 Platform upload deadlines (14 days vs. 30 days) and explain how Circular 1873 temporarily affects FFAR enforcement vs. licensing.',
      'Diarra (Circular 1917) & Tribunal Routing: If Kofi later has an unpaid salary dispute with Club C (2 months unpaid), trace exact Art. 14bis steps, identify the competent FIFA Tribunal chamber (DRC vs. PSC), note the 10-day grounds & 21-day CAS deadlines, and explain why Circular 1917 prevents blocking his ITC.',
      'Guardians & Ethical Recruitment: State Nadia’s immediate legal and ethical obligations regarding the 16-year-old’s disclosure of the EUR 3,000 scam and passport confiscation.',
    ],
    modelSolution:
      '1) FFAR Dual Rep & Caps: Nadia’s dual representation (Individual + Engaging Entity with prior explicit written consent from BOTH) is the SOLE legal dual representation under Art. 12 para 8(a). Exclude Kofi’s $120,000 conditional bonus (Art. 15 para 2a). On fixed salary $500,000/yr using marginal brackets (Art. 15 para 2b): `($200,000 × 10%) + ($300,000 × 6%) = $20,000 + $18,000 = USD 38,000/year` max total fee! Under Art. 14 para 10, Club C may pay at most 50% (`USD 19,000/yr`), paid quarterly (every 3 months) after window closure pro-rata on salary actually received (Art. 14 para 6–7). Agent Sam (Releasing Club B) is capped at `10% × EUR 6,000,000 = EUR 600,000`—the 15% sell-on clause is EXCLUDED under Art. 15 para 2(c)(ii)!\n2) Solidarity Math & Clearing House: Club A trained Kofi for ages 12, 13, 14, 15 (`4 × 0.25% = 1.00%`) plus ages 16, 17 (`2 × 0.50% = 1.00%`) -> Total = `2.00%` of EUR 6,000,000 = **EUR 120,000**! Workflow: TMS trigger -> Provisional EPP (10-day inspection window) -> Final EPP & Allocation Statement -> Club C MUST pay full solidarity pool through the FIFA Clearing House within **30 days** (no direct bypass!) -> BOTH Club C and Club A must pass Clearing House KYC/AML Compliance Assessments -> Payout to Club A!\n3) Platform & Circular 1873: Under Art. 16, Nadia uploads Representation Agreements, fee payments, and initial Agency ownership within **14 days** (and subsequent Agency changes within **30 days**). Under Circular 1873, fee caps, dual-rep limits, payment rules, and certain disclosures are temporarily suspended pending ECJ resolution, while licensing, eligibility, exam, CPD, and core conduct rules remain fully active.\n4) Art. 14bis, Tribunal & Diarra (Circular 1917): With 2 unpaid monthly salaries, Kofi MUST first send Club C a formal written default notice granting **>=15 days** to pay before terminating with Just Cause. His international player-vs-club dispute goes to the **Dispute Resolution Chamber (DRC)** (free of procedural costs; 2-year filing limit; 10 days to request written grounds; 21 days to appeal to CAS). Under Circular 1917 (Annexe 3 Art. 11), the FA is strictly barred from rejecting Kofi’s ITC due to a contractual dispute, and any new club faces NO automatic presumption of inducement!\n5) Safeguarding & Ethical Recruitment: Nadia stays calm, reassures the 16-year-old it is not his fault, makes NO promise of secrecy, does NOT confront the scout or self-investigate, records exact facts, and reports IMMEDIATELY to the Safeguarding Officer, FIFA Ethics/Disciplinary (Duty to Report — FCE Art. 18 & FFAR Art. 16.2i), and law enforcement (passport confiscation + upfront youth fee = human trafficking under the FIFA Ethical Recruitment Guide!).',
  },
  examStrategy: {
    examFormat:
      '2026 FIFA Football Agent Exam (Circular 1956 & 6th Ed. Jan 2026 Exam Rules): 20 Platform-generated multiple-choice questions (single- or multi-select, ZERO partial credit!) in 60 minutes (3 minutes/question). Passing score: 75% (15 / 20). Held ONLINE with remote invigilation; Study Materials allowed in DIGITAL FORMAT ONLY!',
    timeManagementPlan:
      'Hard cap of 3 minutes per question (check the clock at Q5 = 15 min, Q10 = 30 min, Q15 = 45 min). Because you have the 1,010-page searchable PDF open digitally, NEVER guess a number or date from vague memory—verify EVERY exact word via `Ctrl+F` in 30–45 seconds! If a math or multi-select question stalls past 3 minutes, select your best verified answer, flag it, and return in the final 8 minutes.',
    mindsetRules: [
      'Master Digital `Ctrl+F` Precision: Build a 1-page PDF Page-Index bookmark cheat sheet for all 10 Chapter I documents + key Circulars (1867, 1873, 1887, 1917, 1918, 1919) BEFORE exam day.',
      'Check EVERY Option on Multi-Select Questions: FIFA gives ZERO partial credit—verify each option word-for-word against the exact article (watch for tiny traps like "strictly less than" vs. "less than or equal to" or "natural person" vs. "agency"!).',
      'Watch Marginal Cap Brackets & Exclusions: On FFAR Art. 15 math, ALWAYS strip conditional bonuses, split marginally at USD 200,000 (5%/3% or 10%/6%), cap Engaging Club at 50% in dual rep, and exclude sell-on fees + Art. 17 breach comp from Releasing Club caps!',
      'Memorize Every Short Clock & Number: 5y bankruptcy, 24m unlicensed, 12m betting; 2y max Individual rep; 2m final exclusive window; 6m minor pro-age window; 14d/30d Platform uploads; 16w Bridge Transfer; 6/6/3 loans; 15d Art. 14bis/15 notices; 10d EPP / 30d Clearing House; 2y/10d/21d Tribunal/CAS!',
      'Apply 2026 Circulars Over Outdated 2023 Summaries: Remember Circular 1917 (Diarra — no automatic new-club inducement presumption & non-blocking ITC!), Circular 1887 (coaches/adoption/family leave), and Circular 1919 (online exam)!',
      'Verify Chamber Routing Cold: Player vs. Club = DRC; Coach vs. Club OR Club vs. Club Transfer Fee OR Art. 19 Minors = PSC!',
    ],
    finalWeekChecklist: [
      'Open `my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf` and practice 20 rapid `Ctrl+F` lookups until you locate any article in under 25 seconds.',
      'Drill 10 FFAR Art. 15 marginal fee-cap calculations and 10 RSTP Annexe 5 Solidarity calculations (including leap-year/partial-year prorating) to 100% accuracy.',
      'Review `Circular 1873`, `Circular 1887`, `Circular 1917 (Diarra)`, `Circular 1918`, `Circular 1919`, and `Circular 1956` side-by-side.',
      'Review the Jan 2026 6th Edition Exam Rules (`20260113_FINAL CLEAN_FIFA-Football-Agent-Exam-Rules-6th-Edition-JAN-2026-edition_EN.pdf`) to verify exact hardware, camera, internet, and allowed digital-file technical rules so you cannot be disqualified!',
      'Complete 3 strict 60-minute, 20-question timed open-book PDF mocks scoring >= 18/20 (90%) before exam day.',
    ],
  },
};
