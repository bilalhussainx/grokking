// Real-style alumni interview questions per school.
//
// Curated from publicly shared alumni interview debriefs (College Confidential,
// Reddit r/ApplyingToCollege, alumni blogs, school-published guidance).
// These are representative — alumni rarely follow a script, but the *themes*
// recur. Use this bank for the /college-interviews/questions/[schoolId] study page.
//
// Spec: CollegeVCareers.md SP-6.

export interface SchoolQuestionBank {
  schoolId: string;
  schoolName: string;
  /** One-sentence framing of what this school's alumni tend to care about */
  interviewerMindset: string;
  /** Real-style questions grouped by theme */
  groups: QuestionGroup[];
}

export interface QuestionGroup {
  theme: string;
  questions: string[];
}

export const COMMON_QUESTIONS: Record<string, SchoolQuestionBank> = {
  'harvard-undergrad': {
    schoolId: 'harvard-undergrad',
    schoolName: 'Harvard',
    interviewerMindset:
      'Harvard alumni are probing for intellectual vitality and genuine leadership — not just accomplishments, but how you think about them.',
    groups: [
      {
        theme: 'Intellectual life',
        questions: [
          'Tell me about a book, article, or idea from the last year that changed how you see something.',
          'What is something you have changed your mind about recently, and what caused the change?',
          "What is a class you've taken where you felt genuinely challenged, and why?",
          'If you could study anything at Harvard with no grade pressure, what would you dig into?',
        ],
      },
      {
        theme: 'Leadership and impact',
        questions: [
          'Tell me about a time you started something from scratch. What was hard about it?',
          'Describe a time you failed at something that mattered to you. What did you do next?',
          'Who do you lead, and how do they describe you when you are not in the room?',
        ],
      },
      {
        theme: 'Why Harvard',
        questions: [
          'Why Harvard, specifically? Not the Ivy League — Harvard.',
          'What is a specific Harvard class, professor, or house tradition that made you apply?',
          'What would you contribute to your Harvard house community that you have not already told us?',
        ],
      },
    ],
  },
  'yale-undergrad': {
    schoolId: 'yale-undergrad',
    schoolName: 'Yale',
    interviewerMindset:
      'Yale alumni prize warmth, community, and breadth. They want to know if you will enrich a residential college, not just attend one.',
    groups: [
      {
        theme: 'Community and character',
        questions: [
          'Tell me about a community you belong to — not your school — and what role you play in it.',
          'What is something you do for other people that nobody sees?',
          "Describe a friendship that changed you. What did you learn from them?",
        ],
      },
      {
        theme: 'Breadth of interests',
        questions: [
          'If you had to pick two unrelated things you love equally, what are they?',
          'What is a subject outside your intended major you would take a class in at Yale?',
          'Tell me about the last thing that made you fall into a rabbit hole.',
        ],
      },
      {
        theme: 'Why Yale',
        questions: [
          'Why Yale, specifically — not Harvard, Princeton, or Stanford?',
          'Which residential college theme speaks to you, and why?',
          'What about the shopping period or distribution requirements appeals to you?',
        ],
      },
    ],
  },
  'princeton-undergrad': {
    schoolId: 'princeton-undergrad',
    schoolName: 'Princeton',
    interviewerMindset:
      'Princeton alumni care about depth, independence, and whether you can carry a senior thesis. They probe for real intellectual commitment.',
    groups: [
      {
        theme: 'Intellectual depth',
        questions: [
          'Tell me about something you have studied so deeply that you have your own opinion on it.',
          'What question could you spend four years working on?',
          'If you wrote a senior thesis today, what would it be about?',
        ],
      },
      {
        theme: 'Service and character',
        questions: [
          'Princeton\'s motto is "in the nation\'s service." What does service look like in your life right now?',
          'Tell me about someone you respect who is not famous. What do they do, and why do they matter?',
        ],
      },
      {
        theme: 'Why Princeton',
        questions: [
          'Why Princeton? What about its undergraduate focus and thesis tradition attracts you?',
          'Which eating club or residential college dynamic appeals to you, and why?',
        ],
      },
    ],
  },
  'columbia-undergrad': {
    schoolId: 'columbia-undergrad',
    schoolName: 'Columbia',
    interviewerMindset:
      'Columbia alumni test whether you can handle the Core Curriculum and thrive in New York City — structured rigor plus urban intensity.',
    groups: [
      {
        theme: 'Core and intellectual range',
        questions: [
          'How do you feel about reading Plato, Homer, and Dante in your first year, even if you want to study engineering?',
          'What is a text — novel, film, essay — you think everyone should read, and why?',
          'Tell me about a time you had to engage seriously with an idea you disagreed with.',
        ],
      },
      {
        theme: 'New York City and urban fit',
        questions: [
          'Why study in New York City? What would you do with the city?',
          'Cities are noisy and expensive and relentless. How do you handle that?',
        ],
      },
      {
        theme: 'Why Columbia',
        questions: [
          'Why Columbia over Harvard or Yale?',
          'What specifically about the Core Curriculum excites you — or worries you?',
        ],
      },
    ],
  },
  'penn-undergrad': {
    schoolId: 'penn-undergrad',
    schoolName: 'Penn',
    interviewerMindset:
      'Penn alumni probe for ambition with a pragmatic edge. They want builders who can cross disciplines — Wharton mindset meets liberal arts.',
    groups: [
      {
        theme: 'Ambition and building',
        questions: [
          'Tell me about something you have built — a project, a club, a business, anything.',
          'What is a problem in the world you would want to work on, and what is your angle on it?',
          'Tell me about a time you turned an idea into a real thing other people used.',
        ],
      },
      {
        theme: 'Interdisciplinary thinking',
        questions: [
          'Name two subjects you would love to combine at Penn. What would that look like?',
          'Penn has dual-degree programs — M&T, Huntsman, LSM. Does that model attract you? Why?',
        ],
      },
      {
        theme: 'Why Penn',
        questions: [
          'Why Penn, specifically?',
          'How do you see yourself participating in both the undergraduate academic community and the broader Philadelphia community?',
        ],
      },
    ],
  },
  'brown-undergrad': {
    schoolId: 'brown-undergrad',
    schoolName: 'Brown',
    interviewerMindset:
      'Brown alumni test whether the Open Curriculum would liberate you or expose you. They want self-directed, intellectually risk-taking students.',
    groups: [
      {
        theme: 'Self-direction',
        questions: [
          'If no one assigned you anything for a semester, what would you study?',
          'Tell me about a time you pursued learning outside any class or club.',
          'The Open Curriculum means no one tells you what to take. How would you make sure you grow?',
        ],
      },
      {
        theme: 'Interdisciplinary interests',
        questions: [
          'What is an unusual combination of subjects that excites you?',
          'Tell me about a concentration you might design for yourself if Brown let you.',
        ],
      },
      {
        theme: 'Why Brown',
        questions: [
          'Why Brown? Why the Open Curriculum over a more structured program?',
          'What about the Brown student culture — activism, creativity, informality — feels right to you?',
        ],
      },
    ],
  },
  'dartmouth-undergrad': {
    schoolId: 'dartmouth-undergrad',
    schoolName: 'Dartmouth',
    interviewerMindset:
      'Dartmouth alumni care about fit with a small, tight, outdoorsy, teaching-focused community. They ask about people, not achievements.',
    groups: [
      {
        theme: 'Community fit',
        questions: [
          'How do you handle being in a small community where everyone knows everyone?',
          'Tell me about your best friend. What do they do, and what do you get from that friendship?',
          'What role do you usually play in groups?',
        ],
      },
      {
        theme: 'Outdoors and rural life',
        questions: [
          'How do you feel about being in a small New Hampshire town for four years?',
          'What is your relationship with the outdoors? Is it a real part of your life or more of an idea?',
        ],
      },
      {
        theme: 'Why Dartmouth',
        questions: [
          'Why Dartmouth? Why the D-Plan?',
          'Which Dartmouth tradition — First-Year Trips, the Lodge, the Green Key — feels like something you would actually join?',
        ],
      },
    ],
  },
  'cornell-undergrad': {
    schoolId: 'cornell-undergrad',
    schoolName: 'Cornell',
    interviewerMindset:
      'Cornell alumni ask school-specific fit questions — which of seven colleges, and why. They want substance over polish.',
    groups: [
      {
        theme: 'Specific college fit',
        questions: [
          'Why this specific Cornell college — not just Cornell the university?',
          'What in that college\'s curriculum or requirements excites you?',
          'Have you looked at the courses? Name one you want to take and tell me why.',
        ],
      },
      {
        theme: 'Work ethic',
        questions: [
          'Cornell has a reputation for being rigorous. Tell me about a time you pushed through something hard.',
          'What is your study routine like when you actually care about the subject?',
        ],
      },
      {
        theme: 'Why Cornell',
        questions: [
          'Why Cornell over other Ivies?',
          'What would you do with being at a university that has a big-state-school scale inside an Ivy?',
        ],
      },
    ],
  },
  'stanford-undergrad': {
    schoolId: 'stanford-undergrad',
    schoolName: 'Stanford',
    interviewerMindset:
      'Stanford alumni look for intellectual playfulness and "what matters to you and why." They punish rehearsed answers harder than most.',
    groups: [
      {
        theme: 'What matters to you',
        questions: [
          'What matters to you, and why?',
          'Tell me about an idea that has obsessed you recently.',
          'If you had a free afternoon and nobody was watching, what would you actually do?',
        ],
      },
      {
        theme: 'Intellectual play',
        questions: [
          'What is something you have built, written, or made just because you wanted to?',
          'Tell me about a time you fell down a rabbit hole you were not supposed to be in.',
          'What is something you are learning right now that has nothing to do with school?',
        ],
      },
      {
        theme: 'Why Stanford',
        questions: [
          'Why Stanford — and be honest, not the pitch.',
          'How do you think about the tech / startup culture around Stanford? Is that a feature or a bug for you?',
        ],
      },
    ],
  },
  'mit-undergrad': {
    schoolId: 'mit-undergrad',
    schoolName: 'MIT',
    interviewerMindset:
      'MIT alumni (via the Educational Counselor / EC interview) probe for mens et manus — mind and hand. They want people who actually build and break things, not talk about it.',
    groups: [
      {
        theme: 'Making things',
        questions: [
          'Tell me about something you built recently. Walk me through it end to end.',
          'What is something you took apart or tried to understand by dissecting it?',
          'Tell me about a technical problem you could not solve at first — what did you do?',
        ],
      },
      {
        theme: 'Collaboration and MIT culture',
        questions: [
          'MIT is intense and collaborative. How do you handle long, hard problem sets with a team?',
          'Tell me about a time you helped someone else understand something technical.',
        ],
      },
      {
        theme: 'Why MIT',
        questions: [
          'Why MIT specifically — not Caltech, not Stanford engineering?',
          'Which MIT tradition, lab, or UROP program are you drawn to?',
        ],
      },
    ],
  },
  'northwestern-undergrad': {
    schoolId: 'northwestern-undergrad',
    schoolName: 'Northwestern',
    interviewerMindset:
      'Northwestern alumni probe for "and/and" students — people who do journalism AND econ, or engineering AND theater — and test fit with the quarter system.',
    groups: [
      {
        theme: 'Dual interests',
        questions: [
          'Name two unrelated things you care about equally. How do they inform each other?',
          'Tell me about a time your two worlds collided and it helped you.',
        ],
      },
      {
        theme: 'Quarter system pace',
        questions: [
          'The quarter system is fast — ten weeks per course. How do you handle pace?',
          'What does your week look like when you are genuinely engaged in multiple things?',
        ],
      },
      {
        theme: 'Why Northwestern',
        questions: [
          'Why Northwestern over a Big Ten school, or over other journalism/ engineering schools?',
          'Which specific school within Northwestern (Medill, McCormick, Weinberg, Bienen, SoC) are you applying to, and why that one?',
        ],
      },
    ],
  },
  'uchicago-undergrad': {
    schoolId: 'uchicago-undergrad',
    schoolName: 'UChicago',
    interviewerMindset:
      'UChicago alumni want students who enjoy arguing with ideas — the life of the mind. They probe how you reason, not just what you know.',
    groups: [
      {
        theme: 'Life of the mind',
        questions: [
          'Tell me about an argument you had with a text — a book, paper, or film you disagreed with.',
          'What is a question you do not yet know the answer to, but think about?',
          'Describe a class where you learned to think differently, not just learned new facts.',
        ],
      },
      {
        theme: 'Intellectual rigor',
        questions: [
          "What is UChicago's reputation for rigor, and does that attract or scare you?",
          'Tell me about a time you were wrong and had to admit it.',
        ],
      },
      {
        theme: 'Why UChicago',
        questions: [
          'Why UChicago? Why the Core?',
          "What do you think of UChicago's famously quirky essay prompts, and what would you write about?",
        ],
      },
    ],
  },
  'duke-undergrad': {
    schoolId: 'duke-undergrad',
    schoolName: 'Duke',
    interviewerMindset:
      'Duke alumni test for ambitious, well-rounded students — strong academic + strong community + strong drive. They want substance, not just polish.',
    groups: [
      {
        theme: 'Ambition and drive',
        questions: [
          'What is something you have accomplished that surprised even you?',
          'Tell me about a goal you are working on right now that is longer than one semester.',
        ],
      },
      {
        theme: 'Community and team',
        questions: [
          'Tell me about a team you were part of that really clicked. What was your role?',
          'Duke has strong school spirit. What do you get out of being part of a tight community?',
        ],
      },
      {
        theme: 'Why Duke',
        questions: [
          'Why Duke over other top schools?',
          'Which Duke program — Trinity, Pratt, a specific minor — did you actually look into before applying?',
        ],
      },
    ],
  },
  'georgetown-undergrad': {
    schoolId: 'georgetown-undergrad',
    schoolName: 'Georgetown',
    interviewerMindset:
      'Georgetown alumni probe for engagement with service, policy, faith, or international issues. They test fit with the Jesuit tradition and DC context.',
    groups: [
      {
        theme: 'Service and values',
        questions: [
          'How do you define service in your own life, not as a resume line?',
          'Tell me about a value that has been tested recently and how you held on to it.',
        ],
      },
      {
        theme: 'Policy and the world',
        questions: [
          'What issue — domestic or international — do you actually follow and think about?',
          'Tell me about a time you changed your mind on a political or social issue.',
        ],
      },
      {
        theme: 'Why Georgetown',
        questions: [
          'Why Georgetown? Which school — SFS, College, MSB, NHS — and why that one?',
          "What do you make of Georgetown's Jesuit identity, whether you are Catholic or not?",
        ],
      },
    ],
  },
  'nyu-undergrad': {
    schoolId: 'nyu-undergrad',
    schoolName: 'NYU',
    interviewerMindset:
      'NYU alumni test whether you truly want to be *in New York City* — not just at a university that happens to be there. They probe for independence.',
    groups: [
      {
        theme: 'NYC fit',
        questions: [
          'Why New York City as the place you want to spend four years?',
          'What would you do in New York that you could not do in a college town?',
          'NYU has no traditional campus. How do you feel about a school woven into a city?',
        ],
      },
      {
        theme: 'Independence',
        questions: [
          'How independent are you right now? Walk me through a normal week.',
          'Tell me about a time you had to figure something out without help.',
        ],
      },
      {
        theme: 'Why NYU',
        questions: [
          'Why NYU specifically — which school (CAS, Stern, Tisch, Tandon, Gallatin) and why?',
          'What about the global network of NYU campuses interests you?',
        ],
      },
    ],
  },
  'vanderbilt-undergrad': {
    schoolId: 'vanderbilt-undergrad',
    schoolName: 'Vanderbilt',
    interviewerMindset:
      'Vanderbilt alumni look for academically strong students who are also warm and collaborative — work hard, be kind.',
    groups: [
      {
        theme: 'Warmth and collaboration',
        questions: [
          'Tell me about someone you helped recently and what it meant to you.',
          "Vanderbilt talks a lot about being warm and Southern. What does warmth look like in how you act?",
        ],
      },
      {
        theme: 'Academics',
        questions: [
          'What is a subject you would study at Vanderbilt that is not your intended major?',
          'Tell me about a class that changed your thinking.',
        ],
      },
      {
        theme: 'Why Vanderbilt',
        questions: [
          'Why Vanderbilt? Why Nashville?',
          'How do you see yourself contributing to The Commons (the first-year experience) and a residential college?',
        ],
      },
    ],
  },
  'emory-undergrad': {
    schoolId: 'emory-undergrad',
    schoolName: 'Emory',
    interviewerMindset:
      'Emory alumni look for service-oriented, often pre-health or pre-law students with genuine engagement in their community, Atlanta, and global health.',
    groups: [
      {
        theme: 'Service and engagement',
        questions: [
          'Tell me about a time you did something for your community that you were not asked to do.',
          'What is a cause you care about beyond a volunteer line on a resume?',
        ],
      },
      {
        theme: 'Pre-professional path',
        questions: [
          'If you are pre-health or pre-law, what has actually confirmed that for you?',
          "What is a moment that made you want to pursue this path, not a talking point — a moment?",
        ],
      },
      {
        theme: 'Why Emory',
        questions: [
          'Why Emory specifically? Why Atlanta?',
          "What about Emory's global health focus or CDC / Carter Center partnerships interests you?",
        ],
      },
    ],
  },
  'usc-undergrad': {
    schoolId: 'usc-undergrad',
    schoolName: 'USC',
    interviewerMindset:
      'USC alumni care about the Trojan Family — network, school spirit, creativity, and LA ambition. They probe for genuine ambition plus collaboration.',
    groups: [
      {
        theme: 'Creative ambition',
        questions: [
          'Tell me about something creative you made — writing, film, music, code, design — anything.',
          'What do you want to do that LA would accelerate?',
        ],
      },
      {
        theme: 'Trojan Family',
        questions: [
          'What do you make of "Trojan Family" — is that a real thing to you or just a slogan?',
          'Tell me about a time you mentored someone or were mentored by someone outside your family.',
        ],
      },
      {
        theme: 'Why USC',
        questions: [
          'Why USC — not UCLA, not Stanford?',
          "Which USC school — Viterbi, Marshall, Annenberg, SCA — and why that one?",
        ],
      },
    ],
  },
  'notre-dame-undergrad': {
    schoolId: 'notre-dame-undergrad',
    schoolName: 'Notre Dame',
    interviewerMindset:
      'Notre Dame alumni probe fit with a Catholic community (whether or not you are Catholic), and test for service, character, and tradition.',
    groups: [
      {
        theme: 'Faith, values, community',
        questions: [
          'Notre Dame has a Catholic identity. How do you think about that, whatever your own faith is?',
          'Tell me about a value you hold and how it has been tested.',
        ],
      },
      {
        theme: 'Service and character',
        questions: [
          'Tell me about service that has genuinely changed you, not just filled hours.',
          "Describe someone you respect and what you have tried to learn from them.",
        ],
      },
      {
        theme: 'Why Notre Dame',
        questions: [
          'Why Notre Dame? What about the residential hall system attracts you?',
          'What do you make of the tradition, the football Saturdays, the dorm rivalries — real for you, or peripheral?',
        ],
      },
    ],
  },
};

export function getQuestionsForSchool(schoolId: string): SchoolQuestionBank | null {
  return COMMON_QUESTIONS[schoolId] || null;
}

export function listQuestionBankSchools(): { id: string; name: string }[] {
  return Object.values(COMMON_QUESTIONS).map((q) => ({ id: q.schoolId, name: q.schoolName }));
}
