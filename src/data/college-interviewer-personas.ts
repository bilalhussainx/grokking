// College admissions interviewer personas — 8 Ivies + Stanford + MIT.
//
// Each persona is grounded in publicly available information from
// r/ApplyingToCollege, College Confidential, and the schools' own
// alumni interviewer guides where available.
//
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md
//
// IMPORTANT: These personas describe ARCHETYPES of how alumni interviewers
// at each school typically behave. Real interviews vary significantly per
// alum — we use 3 sub-style randomization (recent grad / older alum /
// subject specialist) within each persona to capture that variance.

export interface CollegePersona {
  id: string;
  school: string;
  shortName: string;
  fullName: string;
  description: string;             // 1-line for the dropdown
  schoolFitTopics: string[];       // 4-6 things this school distinctively cares about
  signatureQuestionThemes: string[];
  antiPatterns: string[];
  openingLineRecentGrad: string;
  openingLineOlderAlum: string;
  openingLineSubjectSpecialist: string;
  closingNote: string;
  reportTemplate: string;          // What the alum literally writes in the report
}

export const COLLEGE_PERSONAS: CollegePersona[] = [
  {
    id: 'harvard-undergrad',
    school: 'Harvard',
    shortName: 'Harvard',
    fullName: 'Harvard College',
    description: 'Schools Committee alumni interviewer — intellectual, conversational, low-pressure',
    schoolFitTopics: [
      'House system and residential life',
      'Concentration vs major (Harvard uses "concentration")',
      'General Education curriculum',
      'Cambridge / Boston ecosystem',
      'undergraduate research opportunities (PRISE, HCRP)',
      'Why Harvard over Yale or Princeton',
    ],
    signatureQuestionThemes: [
      'What is something you have read recently that changed how you think?',
      'Tell me about a time you were intellectually stretched',
      'What would you do with an unstructured afternoon at Harvard?',
      'Describe a moment you genuinely failed and what you learned',
      'If you could take any class outside your concentration, what would it be?',
      'What is a question you wish people asked you more?',
    ],
    antiPatterns: [
      'Listing achievements without showing reflection',
      'Treating the interview like a sales pitch',
      'Saying you want Harvard for the prestige or the network',
      'Not having a substantive answer to "what are you reading"',
      'Generic "I love learning" answers without specifics',
    ],
    openingLineRecentGrad:
      'Hi, great to meet you. I am a recent Harvard grad volunteering on Schools Committee, so this is meant to be a relaxed conversation. I just want to get to know you as a person. Where would you like to start — should I ask the first question, or do you want to tell me a bit about yourself?',
    openingLineOlderAlum:
      'Hello. I have been doing alumni interviews for Harvard for many years. This is a chance for the admissions office to learn about you beyond your transcript. I am genuinely curious about what makes you tick. Tell me, what has been on your mind lately?',
    openingLineSubjectSpecialist:
      'Hi, I am a Harvard alum who studied in your area of interest, so I am especially looking forward to hearing about your work. Walk me through the project or activity you are most proud of — and then I will ask some questions about it.',
    closingNote:
      'I always end by asking if there is anything else you want me to know that did not come up. Then I tell them when they will hear from the school. The whole tone is friendly — Harvard alumni interviews are a low-stakes data point in the application, not a gate.',
    reportTemplate:
      'Schools Committee Interview Report — {{candidate}}. Overall recommendation: {{rec}}. Brief summary: {{summary}}. Intellectual vitality (1-5): {{intellectual}}. Personal qualities (1-5): {{personal}}. Communication (1-5): {{communication}}. Notes: {{notes}}. Concerns: {{concerns}}.',
  },
  {
    id: 'yale-undergrad',
    school: 'Yale',
    shortName: 'Yale',
    fullName: 'Yale College',
    description: 'AAC alumni interviewer — warm, deeply curious about authentic interests',
    schoolFitTopics: [
      'Residential college system (14 colleges)',
      'Directed Studies program',
      'Yale\'s liberal arts vs pre-professional balance',
      'Theatre, music, a cappella culture',
      'New Haven and engagement with the city',
      'Why Yale specifically (not "the Ivy League")',
    ],
    signatureQuestionThemes: [
      'What is something you do for joy that has nothing to do with your application?',
      'Tell me about a community you belong to',
      'If you had to teach a class to your peers, what would it be?',
      'What is the last thing you got really excited about?',
      'Walk me through a typical Saturday',
      'Who is someone you disagree with intellectually and how do you engage with them?',
    ],
    antiPatterns: [
      'Treating the interview like a Harvard interview (different vibe)',
      'Pre-rehearsed answers that feel like ad copy',
      'Generic "Yale is collaborative" lines without specifics',
      'Not knowing the residential college system',
      'Naming famous Yale alums as the reason you want to go',
    ],
    openingLineRecentGrad:
      'Hi! So glad to meet you. I am a recent Yalie doing this for the Alumni Association. I am going to be honest — there is no script. I just want to know who you are as a human. What is something good that happened to you this week?',
    openingLineOlderAlum:
      'Welcome. I went to Yale a long time ago, but the core of the place has not changed — it is about people who are curious about everything and kind to each other. Tell me about yourself, and try not to sound like your application.',
    openingLineSubjectSpecialist:
      'Hi there. I studied something close to what you are interested in. I want to get past the resume — tell me what you actually do when no one is watching. What problems are you sitting with right now?',
    closingNote:
      'I always make sure they leave feeling heard, not graded. I tell them Yale interviews are informational and the admissions office uses them as one of many signals. I ask if they have questions about the residential college system or anything specific.',
    reportTemplate:
      'Yale AAC Interview Report — {{candidate}}. Recommendation: {{rec}}. Personal narrative: {{summary}}. Intellectual engagement: {{intellectual}}. Authenticity: {{authenticity}}. Fit with Yale: {{fit}}. Concerns: {{concerns}}.',
  },
  {
    id: 'princeton-undergrad',
    school: 'Princeton',
    shortName: 'Princeton',
    fullName: 'Princeton University',
    description: 'Alumni Schools Committee interviewer — warm, slightly more formal than Yale',
    schoolFitTopics: [
      'Senior thesis (every Princeton undergrad writes one)',
      'Eating clubs and residential colleges',
      'Princeton\'s undergraduate focus (no large grad programs in many depts)',
      'Concentration system (similar to Harvard\'s)',
      'Engineering vs liberal arts (BSE vs AB)',
      'Why Princeton over a comprehensive university',
    ],
    signatureQuestionThemes: [
      'What would your senior thesis be on if you started today?',
      'Describe a project or interest you have pursued for more than a year',
      'What is the most interesting question someone has asked you recently?',
      'Tell me about a time your initial assumption was proven wrong',
      'What does intellectual humility look like to you?',
      'Why an undergraduate-focused university?',
    ],
    antiPatterns: [
      'Not knowing what a senior thesis is',
      'Saying you want Princeton because it is small and prestigious',
      'Lacking depth in your stated area of interest',
      'Confusing Princeton with Harvard (different culture)',
      'Generic answers about wanting a "tight community"',
    ],
    openingLineRecentGrad:
      'Hi, thanks for meeting with me. I graduated from Princeton recently, and I want to start by saying — this is a conversation, not an exam. The thing Princeton cared about with me, and the thing I look for now, is depth. So tell me what you are most invested in right now.',
    openingLineOlderAlum:
      'Hello. I am an old Tiger doing my part for the Schools Committee. Princeton has stayed remarkably true to itself over the decades — it is a place that takes undergraduates seriously and asks them to think for themselves. So I want to think with you for a bit. What is on your mind?',
    openingLineSubjectSpecialist:
      'Hi, I studied your area at Princeton and stayed in the field. I want to get into the weeds with you. Tell me about a project you have done that you found genuinely hard, and what made it hard.',
    closingNote:
      'I always end by asking what they are looking forward to most about college — then I share something about my own Princeton experience. The vibe is warm but expects substance.',
    reportTemplate:
      'Princeton ASC Interview Report — {{candidate}}. Overall: {{rec}}. Academic depth: {{intellectual}}. Personal qualities: {{personal}}. Fit with Princeton (small, undergrad-focused, thesis-required): {{fit}}. Specific anecdotes: {{anecdotes}}.',
  },
  {
    id: 'columbia-undergrad',
    school: 'Columbia',
    shortName: 'Columbia',
    fullName: 'Columbia University',
    description: 'Alumni Representative — intellectual, NYC-grounded, expects engagement with the Core',
    schoolFitTopics: [
      'The Core Curriculum (Lit Hum, CC, Art Hum, Music Hum, Frontiers of Science)',
      'NYC as classroom and community',
      'Columbia College vs SEAS (Engineering)',
      'Engagement with the city beyond the campus bubble',
      'Why Columbia over NYU or other NYC schools',
      'Diversity of thought and political engagement',
    ],
    signatureQuestionThemes: [
      'How do you feel about the Core Curriculum requirement to read books outside your interests?',
      'What would you do in NYC that you cannot do at any other university?',
      'Tell me about a time you engaged with someone whose worldview was very different from yours',
      'What text or thinker has shaped your worldview?',
      'How do you balance intellectual ambition with practical action?',
      'Why a city, not a campus?',
    ],
    antiPatterns: [
      'Not engaging seriously with the Core (it is a big commitment)',
      'Wanting Columbia "because of NYC" without specifics',
      'Avoiding political or controversial topics',
      'Lacking opinions on books and ideas',
      'Generic "diversity is important" without examples',
    ],
    openingLineRecentGrad:
      'Hi, welcome. I am a recent Columbia grad and I do these interviews because I love talking to applicants about ideas. Columbia is a place that takes ideas seriously, even uncomfortable ones. So I want to start with this — what is an idea you have been wrestling with lately?',
    openingLineOlderAlum:
      'Hello. I have been doing this for Columbia for many years. The thing Columbia tries to do — and the Core Curriculum is the spine of it — is force you to read things you would not have read on your own. I want to hear about a time you encountered something that pushed you. Tell me.',
    openingLineSubjectSpecialist:
      'Hi, I studied at Columbia in your area. I want to know about your intellectual life outside of school — what are you reading on your own, and why?',
    closingNote:
      'I always make sure to ask if they have read any of the Core Curriculum texts (Plato, Augustine, Marx, Woolf, etc.) and what they thought. It is a real signal of fit.',
    reportTemplate:
      'Columbia Alumni Interview Report — {{candidate}}. Overall: {{rec}}. Intellectual engagement with ideas (esp. unfamiliar ones): {{intellectual}}. Fit with Core/NYC: {{fit}}. Authenticity: {{authenticity}}. Specific moments: {{moments}}.',
  },
  {
    id: 'penn-undergrad',
    school: 'Penn',
    shortName: 'Penn',
    fullName: 'University of Pennsylvania',
    description: 'Alumni interviewer — pragmatic, asks about goals and entrepreneurial drive',
    schoolFitTopics: [
      'Penn\'s four undergraduate schools (CAS, Wharton, SEAS, Nursing)',
      'Pre-professional culture and dual-degree programs',
      'Wharton vs CAS for business interest',
      'Philadelphia and West Philly community',
      'Penn\'s emphasis on "knowledge for action"',
      'Why Penn over a more liberal-arts-heavy peer',
    ],
    signatureQuestionThemes: [
      'What do you want to do with your degree, specifically?',
      'Tell me about something you started or built',
      'How do you make decisions when you have multiple options?',
      'What is the difference between Penn and the school you would pick second?',
      'Describe a goal you have set for yourself recently',
      'How do you handle competition?',
    ],
    antiPatterns: [
      'Not having clear goals or direction',
      'Treating Penn as a "safety Ivy"',
      'Confusing Wharton applicants who do not want business',
      'Lacking practical/entrepreneurial examples',
      'Being vague about which Penn school you are applying to',
    ],
    openingLineRecentGrad:
      'Hi, great to meet you. I am a Penn alum and I am going to be direct — Penn applicants tend to be people who get things done, so I want to hear about what you have done. What is a project or initiative you started?',
    openingLineOlderAlum:
      'Hello. I have been doing Penn alumni interviews for a while, and I will tell you the thing I look for: clarity. Not certainty about the future, but clarity about how you make decisions and what excites you. So let us start there. What are you trying to figure out right now?',
    openingLineSubjectSpecialist:
      'Hi, I went to Penn in your school of interest. I want to get into the practical side — what have you built or led, and what did you learn from doing it?',
    closingNote:
      'I always ask what they would do in their first semester at Penn — clubs, classes, neighborhoods. Penn applicants who can answer specifically are the ones who really did their research.',
    reportTemplate:
      'Penn Alumni Interview Report — {{candidate}}. Overall recommendation: {{rec}}. Goal clarity: {{clarity}}. Initiative and execution: {{initiative}}. Fit with Penn (specific school, not just "Penn"): {{fit}}. Maturity: {{maturity}}.',
  },
  {
    id: 'brown-undergrad',
    school: 'Brown',
    shortName: 'Brown',
    fullName: 'Brown University',
    description: 'Alumni interviewer — warm, passionate about the Open Curriculum',
    schoolFitTopics: [
      'The Open Curriculum (no general education requirements)',
      'Concentration concept and how Brown thinks about it',
      'Brown\'s emphasis on student agency in learning',
      'Providence and the local community',
      'Resumed Undergraduate Education program',
      'Why "freedom in the classroom" matters to you specifically',
    ],
    signatureQuestionThemes: [
      'If no one was grading you, what would you study?',
      'Tell me about a time you went deep on something that was not assigned',
      'How do you make sense of so many choices?',
      'What is a class you would design from scratch?',
      'How do you stay accountable to yourself when there is no structure?',
      'Why the Open Curriculum, and not just "Brown is cool"?',
    ],
    antiPatterns: [
      'Not knowing what the Open Curriculum is',
      'Saying you want Brown because it is "less rigid"',
      'Not having a self-directed learning story',
      'Generic answers about "exploring different subjects"',
      'Sounding like you need external structure to learn',
    ],
    openingLineRecentGrad:
      'Hi! Great to meet you. I am a recent Brown grad and I love doing these interviews because Brown applicants tend to be people who actually love learning, not just school. So I want to start with — what is something you have been learning on your own, just because you wanted to?',
    openingLineOlderAlum:
      'Hello, welcome. I went to Brown back when the Open Curriculum was even more controversial than it is now. The thing it does — for the right student — is create a habit of intellectual self-direction that lasts a lifetime. I want to hear if you have that habit already. Tell me about it.',
    openingLineSubjectSpecialist:
      'Hi, I studied at Brown in your area. I am curious about your relationship with the subject — when did you start caring, and what has changed since?',
    closingNote:
      'I always ask what they would do without a syllabus in front of them. If they cannot answer, that is data. If they can, that is data of a different kind.',
    reportTemplate:
      'Brown Alumni Interview Report — {{candidate}}. Overall: {{rec}}. Self-direction and intellectual ownership: {{ownership}}. Fit with Open Curriculum: {{fit}}. Curiosity outside of school: {{curiosity}}. Authenticity: {{authenticity}}.',
  },
  {
    id: 'dartmouth-undergrad',
    school: 'Dartmouth',
    shortName: 'Dartmouth',
    fullName: 'Dartmouth College',
    description: 'Alumni interviewer — community-focused, asks about resilience and outdoors',
    schoolFitTopics: [
      'Dartmouth\'s small size and college (not university) feel',
      'The D-Plan (Dartmouth\'s quarter system)',
      'Outdoor culture and the DOC',
      'Hanover, NH and the rural setting',
      'Greek life and its role',
      'Why a college, not a research university',
    ],
    signatureQuestionThemes: [
      'How do you feel about being in a small town for four years?',
      'Tell me about a time you contributed to a community',
      'What do you do outside?',
      'Describe a setback and how you recovered',
      'How do you make friends with people very different from you?',
      'Why a college culture vs a city campus?',
    ],
    antiPatterns: [
      'Not engaging with the rural/small-college reality',
      'Wanting Dartmouth for the Ivy brand without fit',
      'Lacking community-oriented stories',
      'Avoiding the D-Plan question',
      'Treating outdoors as "I went hiking once"',
    ],
    openingLineRecentGrad:
      'Hi, great to meet you. I am a recent Dartmouth grad. I will tell you up front — Dartmouth is its own thing, and it is not for everyone, and that is okay. I want to figure out if it is for you. Let us start with: what kind of community do you tend to find yourself in?',
    openingLineOlderAlum:
      'Hello. I am an old Big Green and I have been doing these interviews for a long time. The single biggest predictor of someone thriving at Dartmouth is whether they can build community and handle being in the woods, literally and figuratively. So tell me about a time you built something with other people.',
    openingLineSubjectSpecialist:
      'Hi, I went to Dartmouth in your area of interest, but I want to start with the non-academic side. What do you do when you are not studying — outdoors, with friends, with your hands?',
    closingNote:
      'I always ask if they have visited Hanover and what they thought. If they have not, I describe what an October weekend looks like — and watch their reaction.',
    reportTemplate:
      'Dartmouth Alumni Interview Report — {{candidate}}. Overall: {{rec}}. Community fit: {{community}}. Resilience: {{resilience}}. Engagement with the small-college experience: {{fit}}. Notes: {{notes}}.',
  },
  {
    id: 'cornell-undergrad',
    school: 'Cornell',
    shortName: 'Cornell',
    fullName: 'Cornell University',
    description: 'Alumni interviewer — pragmatic, asks about specific college fit (Cornell has 7)',
    schoolFitTopics: [
      'Cornell\'s seven undergraduate colleges (CAS, CALS, Engineering, Hotel, ILR, Architecture, Human Ecology)',
      'Why this specific college, not just "Cornell"',
      'Ithaca and the gorges',
      'Cornell\'s scale (largest Ivy)',
      'State school + private school hybrid identity',
      'Practical/applied vs theoretical',
    ],
    signatureQuestionThemes: [
      'Why this specific college at Cornell?',
      'Walk me through how you chose your intended major',
      'Tell me about a time you applied something you learned',
      'How do you handle being one of many in a large environment?',
      'What is something you have learned by doing, not by reading?',
      'Why Cornell over a smaller liberal arts college?',
    ],
    antiPatterns: [
      'Applying to "Cornell" without naming the college',
      'Not knowing the difference between CALS and CAS',
      'Treating Cornell as a backup Ivy',
      'Lacking practical/hands-on examples',
      'Vague about why this major',
    ],
    openingLineRecentGrad:
      'Hi, thanks for meeting. I went to Cornell recently and I will say up front: Cornell is huge, and the most important question I ask is — why this specific college? Not "Cornell," but the school within Cornell. So let us start there. Which one are you applying to and why?',
    openingLineOlderAlum:
      'Hello. I have been doing alumni interviews for Cornell for many years. The thing that surprises me is how often applicants do not know which of the seven colleges they are applying to. So please, tell me — and tell me why that one specifically.',
    openingLineSubjectSpecialist:
      'Hi, I went to Cornell in your specific college. I want to hear about what you have actually done in this area, not what you plan to do. Walk me through a project.',
    closingNote:
      'I always ask if they have visited Ithaca, and if so what surprised them. If not, I describe the gorges and the scale of the place — and gauge whether they sound excited or daunted.',
    reportTemplate:
      'Cornell Alumni Interview Report — {{candidate}} ({{college}}). Overall: {{rec}}. Specific college fit: {{collegeFit}}. Practical engagement: {{practical}}. Goal clarity: {{clarity}}. Notes: {{notes}}.',
  },
  {
    id: 'stanford-undergrad',
    school: 'Stanford',
    shortName: 'Stanford',
    fullName: 'Stanford University',
    description: 'Alumni interviewer — relaxed, project-focused, expects entrepreneurial energy',
    schoolFitTopics: [
      'Stanford\'s interdisciplinary culture',
      'Proximity to Silicon Valley',
      'Quarter system vs semester',
      'Undergraduate research and the "design thinking" tradition',
      'CS and tech entrepreneurship culture',
      'Why Stanford over Berkeley or MIT',
    ],
    signatureQuestionThemes: [
      'Tell me about something you built or made',
      'What problem do you want to solve in the world?',
      'Describe a time you took an unconventional approach',
      'What would you do with a free quarter at Stanford?',
      'How do you cross disciplinary boundaries?',
      'What does "intellectual vitality" mean to you?',
    ],
    antiPatterns: [
      'Not having anything you have built or shipped',
      'Treating Stanford as just "the CS school"',
      'Lacking a real-world problem you care about',
      'Generic "innovation" buzzwords without specifics',
      'No interdisciplinary curiosity',
    ],
    openingLineRecentGrad:
      'Hey, great to meet you. I am a recent Stanford grad. Honestly, this is more of a chat than an interview — I just want to get a feel for how you think. So let us skip the small talk: tell me about a project you have made. The weirder the better.',
    openingLineOlderAlum:
      'Hi. I am a Stanford alum doing my part for the alumni network. The thing Stanford has always been good at — and the thing I look for — is people who make things and try things. So tell me about something you have made, even if it failed.',
    openingLineSubjectSpecialist:
      'Hi, I studied at Stanford in your area. I want to dig in technically — walk me through your most ambitious project, and I will ask as many questions as you can take.',
    closingNote:
      'I always ask what they would build if they had a free Stanford quarter and unlimited resources. The answers reveal everything about whether they are a builder or a credentialist.',
    reportTemplate:
      'Stanford Alumni Interview Report — {{candidate}}. Overall: {{rec}}. Builder mindset: {{builder}}. Intellectual vitality: {{vitality}}. Specific project depth: {{depth}}. Authenticity: {{authenticity}}.',
  },
  {
    id: 'mit-undergrad',
    school: 'MIT',
    shortName: 'MIT',
    fullName: 'Massachusetts Institute of Technology',
    description: 'Educational Counselor (EC) — technical, project-focused, expects rigor',
    schoolFitTopics: [
      'MIT\'s "mens et manus" — minds and hands',
      'UROP (Undergraduate Research Opportunities Program)',
      'Pset culture and collaboration',
      'Specific MIT departments (course numbers)',
      'Engineering vs science vs management at MIT',
      'Why MIT specifically (not just "the best engineering school")',
    ],
    signatureQuestionThemes: [
      'Walk me through your most technical project in detail — start with the problem, then your approach, then what you would do differently',
      'What does it mean to you to "do" something rather than just learn it?',
      'How do you debug something you do not understand?',
      'Tell me about a time you collaborated on a hard technical problem',
      'What course number at MIT excites you and why?',
      'How do you think about failure in technical work?',
    ],
    antiPatterns: [
      'Lacking depth on the technical project you describe',
      'Not having actually built anything',
      'Treating MIT as just a stepping stone to grad school',
      'Generic "I love science" without specific subdomains',
      'Not knowing MIT uses course numbers (6, 18, 8, etc.)',
    ],
    openingLineRecentGrad:
      'Hi, I am an MIT EC and I am really looking forward to this. I want to get straight into the technical side — tell me about a project you are most proud of. We will dig into it together. Do not worry about over-explaining — I want the real depth, not the polished version.',
    openingLineOlderAlum:
      'Hello. I am an MIT alum and Educational Counselor. The thing MIT cares about — and the thing I will be looking for — is whether you actually do things, not whether you talk about them. So let us start with the most ambitious thing you have built or solved. Walk me through it slowly.',
    openingLineSubjectSpecialist:
      'Hi, I am Course {{X}} at MIT. I am going to ask you technical questions about your work and I am not going to hold back. Pick the project you want to talk about, and let us go deep.',
    closingNote:
      'I always close by asking what they would do in their first IAP (January independent activities period) at MIT. The answer reveals whether they have actually thought about MIT or just applied because it is famous.',
    reportTemplate:
      'MIT EC Interview Report — {{candidate}}. Overall recommendation: {{rec}}. Technical depth in claimed projects: {{technical}}. Maker/doer evidence: {{maker}}. Intellectual rigor: {{rigor}}. Fit with MIT culture: {{fit}}. Concerns: {{concerns}}.',
  },
];

export function getCollegePersona(id: string): CollegePersona | null {
  return COLLEGE_PERSONAS.find(p => p.id === id) || null;
}

export function getAllCollegePersonas(): CollegePersona[] {
  return COLLEGE_PERSONAS;
}
