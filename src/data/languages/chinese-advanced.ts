// Chinese Advanced Course Data
// CEFR C1 Level - HSK 5-6, Advanced Mandarin

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "chinese-advanced",
  slug: "chinese-advanced",
  title: "Mandarin Chinese C1 - Advanced",
  language: "zh",
  languageName: "Mandarin Chinese",
  proficiencyLevel: "C1" as const,
  description: "Master advanced Mandarin Chinese through news analysis, literary criticism, business communication, and academic discourse. Covers HSK 5-6 grammar, chengyu idioms, and formal register switching.",
  targetAudience: "Intermediate Mandarin speakers ready for advanced fluency and professional/academic contexts",
  estimatedHours: 120,
  icon: "🇨🇳",
  prerequisiteCourseSlug: "chinese-intermediate",
};

// ============================================
// Module 1: News & Current Events
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l1",
    slug: "formal-connectors",
    title: "Formal Connectors in News Writing",
    content: `# Formal Connectors in News Writing

Master the formal connectors used in Chinese news articles and broadcasts.

## Causal Connectors

- **由于** (yóuyú) - Due to / Because of (formal)
- **鉴于** (jiànyú) - In view of / Considering

## Reporting Language

- **据说** (jùshuō) - It is said that
- **据报道** (jù bàodào) - According to reports

## Contrastive Connectors

- **而** (ér) - And yet / But / While (literary connector)
- **然而** (rán'ér) - However (formal)

## Usage Notes

由于 introduces a cause before its effect. It is far more formal than 因为 and appears constantly in written news.

鉴于 is used when a decision or judgment follows from known circumstances — common in policy statements.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m1",
    moduleTitle: "News & Current Events",
    order: 1,
    topicId: "zh-advanced-formal-connectors",
    vocabulary: [
      {
        word: "由于",
        translation: "due to / because of",
        pronunciation: "yóuyú",
        exampleSentence: "由于天气恶劣，航班被迫取消。",
        exampleTranslation: "Due to severe weather, the flight was forced to cancel.",
        partOfSpeech: "conjunction",
      },
      {
        word: "鉴于",
        translation: "in view of / considering",
        pronunciation: "jiànyú",
        exampleSentence: "鉴于目前的经济形势，政府决定采取新措施。",
        exampleTranslation: "In view of the current economic situation, the government decided to adopt new measures.",
        partOfSpeech: "conjunction",
      },
      {
        word: "据报道",
        translation: "according to reports",
        pronunciation: "jù bàodào",
        exampleSentence: "据报道，该公司计划明年上市。",
        exampleTranslation: "According to reports, the company plans to go public next year.",
        partOfSpeech: "phrase",
      },
      {
        word: "而",
        translation: "and yet / but / while",
        pronunciation: "ér",
        exampleSentence: "他成绩优秀，而他的弟弟却不太用功。",
        exampleTranslation: "His grades are excellent, while his younger brother is not very diligent.",
        partOfSpeech: "conjunction",
      },
      {
        word: "然而",
        translation: "however (formal)",
        pronunciation: "rán'ér",
        exampleSentence: "计划已经制定；然而，执行过程中遇到了困难。",
        exampleTranslation: "The plan was established; however, difficulties were encountered during execution.",
        partOfSpeech: "conjunction",
      },
    ],
    grammarPoints: [
      {
        title: "由于...因此/所以 (Formal Cause-Effect)",
        explanation: "由于 introduces the cause at the beginning of a sentence, often paired with 因此 or 所以 in the second clause. Unlike 因为, 由于 is almost exclusively written/formal and cannot appear in the second clause.",
        examples: [
          { correct: "由于交通拥堵，他因此迟到了。", translation: "Due to traffic congestion, he was therefore late.", note: "由于 must appear in the first clause" },
          { correct: "由于资金不足，该项目被暂停。", translation: "Due to insufficient funding, the project was suspended." },
        ],
        commonMistakes: [
          {
            incorrect: "他迟到了由于交通拥堵。",
            correction: "由于交通拥堵，他迟到了。",
            explanation: "由于 must come at the beginning of the sentence, introducing the cause first.",
          },
        ],
      },
      {
        title: "而 as a Contrastive Connector",
        explanation: "而 links two contrasting or parallel clauses in formal writing. It is lighter than 但是 and often implies a natural contrast rather than an unexpected one.",
        examples: [
          { correct: "城市在发展，而农村却在衰落。", translation: "The cities are developing, while the rural areas are declining." },
          { correct: "这种方法简单而有效。", translation: "This method is simple yet effective.", note: "而 can also link adjectives" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "news-discussion",
        title: "Discussing a News Article",
        situation: "You are discussing a recent economic news article with a colleague",
        agentRole: "You are a Chinese journalist named 李明. Discuss a recent economic development using formal register. Ask the student their opinion and whether they agree with the government's response.",
        userGoal: "Summarize a news event using formal connectors and express your opinion",
        targetPhrases: ["由于", "据报道", "然而", "鉴于"],
        successCriteria: ["Uses at least two formal connectors", "Expresses opinion on the topic", "Maintains formal register"],
      },
    ],
    culturalNotes: [
      {
        title: "Chinese News Language Register",
        content: "Chinese news writing uses a distinctly formal register (书面语) that differs significantly from spoken Mandarin. Connectors like 由于, 鉴于, and 而 are hallmarks of this register. Understanding this distinction is essential for reading People's Daily (人民日报) or Xinhua (新华社) articles.",
      },
    ],
  },
  {
    id: "zh-adv-l2",
    slug: "nominalization-suo",
    title: "Nominalization with 所",
    content: `# Nominalization with 所

The particle 所 transforms verbs into noun phrases, creating formal and literary expressions.

## Core Pattern: 所 + Verb

- **所有** (suǒyǒu) - all that one has → everything
- **所说** (suǒ shuō) - that which is said
- **所见** (suǒ jiàn) - that which is seen
- **所知** (suǒ zhī) - that which is known

## Common Fixed Expressions

- **所以** - therefore (originally "that by which")
- **所谓** (suǒwèi) - so-called
- **有所** + verb - to have some [verb]
- **无所** + verb - to have no [verb]

## In Formal Writing

所 nominalizations are pervasive in legal, academic, and journalistic Chinese. They compact relative clauses into concise noun phrases.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m1",
    moduleTitle: "News & Current Events",
    order: 2,
    topicId: "zh-advanced-nominalization-suo",
    vocabulary: [
      {
        word: "所谓",
        translation: "so-called",
        pronunciation: "suǒwèi",
        exampleSentence: "所谓的专家并不一定可靠。",
        exampleTranslation: "So-called experts are not necessarily reliable.",
        partOfSpeech: "adjective",
      },
      {
        word: "有所改善",
        translation: "to have somewhat improved",
        pronunciation: "yǒu suǒ gǎishàn",
        exampleSentence: "空气质量有所改善。",
        exampleTranslation: "Air quality has somewhat improved.",
        partOfSpeech: "phrase",
      },
      {
        word: "所面临",
        translation: "that which is faced",
        pronunciation: "suǒ miànlín",
        exampleSentence: "我们所面临的挑战是前所未有的。",
        exampleTranslation: "The challenges we face are unprecedented.",
        partOfSpeech: "phrase",
      },
      {
        word: "前所未有",
        translation: "unprecedented",
        pronunciation: "qián suǒ wèi yǒu",
        exampleSentence: "这是一次前所未有的机遇。",
        exampleTranslation: "This is an unprecedented opportunity.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "所 + Verb as Noun Phrase",
        explanation: "所 placed before a verb creates a noun phrase meaning 'that which is [verb]ed.' This is a classical Chinese structure that remains productive in modern formal writing. It often appears with 的 at the end: 所 + V + 的.",
        examples: [
          { correct: "我所知道的都告诉你了。", translation: "I've told you everything I know.", note: "所知道的 = that which I know" },
          { correct: "他所做的一切都是为了家人。", translation: "Everything he has done is for his family." },
        ],
        commonMistakes: [
          {
            incorrect: "所他说的话",
            correction: "他所说的话",
            explanation: "The subject comes before 所, not after it.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "editorial-discussion",
        title: "Discussing an Editorial",
        situation: "You are analyzing a newspaper editorial about urban development",
        agentRole: "You are a university professor named 张教授. Discuss the editorial's arguments using formal language. Challenge the student to rephrase informal expressions using 所 constructions.",
        userGoal: "Analyze the editorial using 所-based nominalization and formal expressions",
        targetPhrases: ["所面临的", "有所改善", "所谓", "前所未有"],
        successCriteria: ["Uses 所 nominalization correctly", "Discusses content analytically", "Maintains academic register"],
      },
    ],
  },
  {
    id: "zh-adv-l3",
    slug: "news-analysis-practice",
    title: "News Analysis & Commentary",
    content: `# News Analysis & Commentary

Bring together formal connectors and nominalization to analyze current events like a native speaker.

## Analysis Vocabulary

- **分析** (fēnxī) - to analyze
- **评论** (pínglùn) - commentary / to comment
- **趋势** (qūshì) - trend
- **影响** (yǐngxiǎng) - influence / impact
- **观点** (guāndiǎn) - viewpoint

## Commentary Structures

- **从...角度来看** - From the perspective of...
- **值得注意的是** - What's worth noting is...
- **不可否认** - It cannot be denied that...
- **总而言之** - In summary / All in all`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m1",
    moduleTitle: "News & Current Events",
    order: 3,
    topicId: "zh-advanced-news-analysis",
    vocabulary: [
      {
        word: "趋势",
        translation: "trend",
        pronunciation: "qūshì",
        exampleSentence: "全球化是不可逆转的趋势。",
        exampleTranslation: "Globalization is an irreversible trend.",
        partOfSpeech: "noun",
      },
      {
        word: "不可否认",
        translation: "it cannot be denied",
        pronunciation: "bùkě fǒurèn",
        exampleSentence: "不可否认，科技改变了我们的生活。",
        exampleTranslation: "It cannot be denied that technology has changed our lives.",
        partOfSpeech: "phrase",
      },
      {
        word: "值得注意",
        translation: "worth noting",
        pronunciation: "zhídé zhùyì",
        exampleSentence: "值得注意的是，这一现象并非个例。",
        exampleTranslation: "What's worth noting is that this phenomenon is not an isolated case.",
        partOfSpeech: "phrase",
      },
      {
        word: "观点",
        translation: "viewpoint / perspective",
        pronunciation: "guāndiǎn",
        exampleSentence: "不同的学者持有不同的观点。",
        exampleTranslation: "Different scholars hold different viewpoints.",
        partOfSpeech: "noun",
      },
      {
        word: "总而言之",
        translation: "in summary / all in all",
        pronunciation: "zǒng ér yán zhī",
        exampleSentence: "总而言之，改革取得了显著成效。",
        exampleTranslation: "All in all, the reforms have achieved notable results.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "从...角度来看 (From the Perspective of...)",
        explanation: "This frame introduces an analytical viewpoint. It signals that the speaker is about to offer a particular lens through which to interpret a situation. It elevates register immediately.",
        examples: [
          { correct: "从经济角度来看，这项政策是合理的。", translation: "From an economic perspective, this policy is reasonable." },
          { correct: "从环保角度来看，我们需要减少碳排放。", translation: "From an environmental perspective, we need to reduce carbon emissions." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "panel-discussion",
        title: "News Panel Discussion",
        situation: "You are participating in a panel discussion about technology's impact on society",
        agentRole: "You are a TV host named 王主持. Moderate a discussion about whether AI will replace human jobs. Ask the student to present arguments using formal connectors and analytical language.",
        userGoal: "Present a structured argument about AI and employment using formal register",
        targetPhrases: ["从...角度来看", "不可否认", "值得注意的是", "总而言之"],
        successCriteria: ["Presents structured argument", "Uses analytical vocabulary", "Draws a conclusion"],
      },
    ],
  },
];

// ============================================
// Module 2: History & Philosophy
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l4",
    slug: "confucianism-daoism",
    title: "Confucianism & Daoism",
    content: `# Confucianism & Daoism

Explore the philosophical foundations of Chinese civilization.

## Confucianism 儒家思想

- **孔子** (Kǒngzǐ) - Confucius
- **儒家** (Rújiā) - Confucianism / Confucian school
- **仁** (rén) - benevolence / humaneness
- **礼** (lǐ) - ritual propriety / rites
- **君子** (jūnzǐ) - the virtuous person / gentleman

## Daoism 道家思想

- **老子** (Lǎozǐ) - Laozi
- **道** (dào) - the Way
- **无为** (wúwéi) - non-action / effortless action
- **自然** (zìrán) - naturalness / nature

## Key Contrasts

Confucianism emphasizes social harmony through moral cultivation and ritual. Daoism emphasizes harmony with nature through spontaneity and non-interference.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m2",
    moduleTitle: "History & Philosophy",
    order: 4,
    topicId: "zh-advanced-confucianism-daoism",
    vocabulary: [
      {
        word: "儒家",
        translation: "Confucianism / Confucian school",
        pronunciation: "Rújiā",
        exampleSentence: "儒家思想对中国文化影响深远。",
        exampleTranslation: "Confucian thought has had a profound influence on Chinese culture.",
        partOfSpeech: "noun",
      },
      {
        word: "仁",
        translation: "benevolence / humaneness",
        pronunciation: "rén",
        exampleSentence: "孔子认为仁是最高的道德标准。",
        exampleTranslation: "Confucius considered benevolence the highest moral standard.",
        partOfSpeech: "noun",
      },
      {
        word: "无为",
        translation: "non-action / effortless action",
        pronunciation: "wúwéi",
        exampleSentence: "老子提倡无为而治。",
        exampleTranslation: "Laozi advocated governing through non-action.",
        partOfSpeech: "noun",
      },
      {
        word: "君子",
        translation: "virtuous person / gentleman",
        pronunciation: "jūnzǐ",
        exampleSentence: "君子坦荡荡，小人长戚戚。",
        exampleTranslation: "The virtuous person is open and at ease; the petty person is always anxious.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Classical Particles: 之, 乎, 者",
        explanation: "Classical Chinese (文言文) particles appear frequently in proverbs, idioms, and philosophical quotes. 之 functions like 的 (possessive/connector), 乎 is a question/exclamation particle, and 者 nominalizes ('one who...').",
        examples: [
          { correct: "学而时习之，不亦说乎？", translation: "To study and practice regularly — is that not a joy?", note: "之 = it (object), 乎 = rhetorical question marker" },
          { correct: "知之者不如好之者。", translation: "One who knows it is not as good as one who loves it.", note: "者 = one who, 之 = it" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "philosophy-debate",
        title: "Philosophy Seminar",
        situation: "You are in a university seminar comparing Confucianism and Daoism",
        agentRole: "You are Professor 陈 at a Chinese university. Lead a seminar discussion on whether Confucian or Daoist principles are more relevant to modern society. Use classical quotes to support your points.",
        userGoal: "Compare Confucian and Daoist ideas and argue which is more relevant today",
        targetPhrases: ["儒家", "道家", "仁", "无为", "君子"],
        successCriteria: ["Compares both philosophies", "Uses philosophical vocabulary", "Supports argument with reasoning"],
      },
    ],
    culturalNotes: [
      {
        title: "The Living Legacy of Confucianism",
        content: "Confucian values — filial piety (孝 xiào), respect for education, social harmony — remain deeply embedded in Chinese society. Understanding these concepts is essential for navigating Chinese business culture, family dynamics, and social expectations. The annual Confucius ceremony at Qufu (曲阜) attracts thousands.",
      },
    ],
  },
  {
    id: "zh-adv-l5",
    slug: "chengyu-intro",
    title: "Introduction to Chengyu",
    content: `# Introduction to Chengyu 成语

Chengyu (成语) are four-character idiomatic expressions drawn from classical Chinese literature, history, and fables.

## Structure

Most chengyu follow a 4-character pattern: ABCD, often with internal parallelism (AB mirrors CD).

## Essential Chengyu for C1

- **一举两得** (yī jǔ liǎng dé) - Kill two birds with one stone
- **半途而废** (bàntú ér fèi) - Give up halfway
- **自相矛盾** (zì xiāng máodùn) - Self-contradictory
- **对牛弹琴** (duì niú tán qín) - Playing music to a cow (pearls before swine)

## Using Chengyu

Chengyu elevate your Chinese from fluent to cultured. They are used in formal writing, speeches, and even daily conversation among educated speakers.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m2",
    moduleTitle: "History & Philosophy",
    order: 5,
    topicId: "zh-advanced-chengyu-intro",
    vocabulary: [
      {
        word: "一举两得",
        translation: "kill two birds with one stone",
        pronunciation: "yī jǔ liǎng dé",
        exampleSentence: "骑自行车上班既锻炼身体又环保，一举两得。",
        exampleTranslation: "Cycling to work exercises your body and protects the environment — two birds with one stone.",
        partOfSpeech: "idiom",
      },
      {
        word: "半途而废",
        translation: "to give up halfway",
        pronunciation: "bàntú ér fèi",
        exampleSentence: "学语言不能半途而废。",
        exampleTranslation: "You can't give up halfway when learning a language.",
        partOfSpeech: "idiom",
      },
      {
        word: "自相矛盾",
        translation: "self-contradictory",
        pronunciation: "zì xiāng máodùn",
        exampleSentence: "他的论点自相矛盾。",
        exampleTranslation: "His arguments are self-contradictory.",
        partOfSpeech: "idiom",
      },
      {
        word: "对牛弹琴",
        translation: "to play music to a cow (wasted effort on wrong audience)",
        pronunciation: "duì niú tán qín",
        exampleSentence: "跟他解释量子物理简直是对牛弹琴。",
        exampleTranslation: "Explaining quantum physics to him is like playing music to a cow.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Using Chengyu in Sentences",
        explanation: "Chengyu function as single units — adjectives, predicates, or adverbials. They cannot be broken apart or rearranged. Most chengyu carry an implicit classical grammar that differs from modern Mandarin.",
        examples: [
          { correct: "这件事让他受益匪浅。", translation: "This matter benefited him greatly.", note: "受益匪浅 used as predicate" },
          { correct: "他用半途而废的态度对待工作。", translation: "He treats work with a give-up-halfway attitude.", note: "Used as attributive with 的" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "chengyu-stories",
        title: "Chengyu Story Telling",
        situation: "A friend asks you to explain the stories behind famous chengyu",
        agentRole: "You are a Chinese literature enthusiast named 小雅. Ask the student to tell the story behind a chengyu and use it in a modern context.",
        userGoal: "Explain the origin story of a chengyu and use it naturally in conversation",
        targetPhrases: ["一举两得", "半途而废", "对牛弹琴", "自相矛盾"],
        successCriteria: ["Explains a chengyu's background", "Uses chengyu in a modern sentence", "Responds naturally to follow-up"],
      },
    ],
  },
  {
    id: "zh-adv-l6",
    slug: "wenyanwen-basics",
    title: "Classical Chinese in Modern Usage",
    content: `# Classical Chinese (文言文) in Modern Usage

Classical Chinese particles and structures survive in modern Mandarin through proverbs, formal writing, and set phrases.

## Key Classical Particles

- **之** (zhī) - of / it (possessive & object marker)
- **乎** (hū) - question/exclamation particle
- **者** (zhě) - one who / that which
- **也** (yě) - (classical assertive particle, different from modern 也)
- **矣** (yǐ) - (indicates completion/change, literary)

## Famous Classical Phrases in Daily Use

- **不亦乐乎** - Is it not joyful? → extremely (做得不亦乐乎)
- **之所以** - the reason why
- **所谓** - so-called
- **言之有理** - what is said has reason → makes sense`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m2",
    moduleTitle: "History & Philosophy",
    order: 6,
    topicId: "zh-advanced-wenyanwen",
    vocabulary: [
      {
        word: "之所以",
        translation: "the reason why",
        pronunciation: "zhī suǒyǐ",
        exampleSentence: "他之所以成功，是因为他从不放弃。",
        exampleTranslation: "The reason he succeeded is because he never gave up.",
        partOfSpeech: "phrase",
      },
      {
        word: "不亦乐乎",
        translation: "is it not joyful? / extremely (doing sth with gusto)",
        pronunciation: "bù yì lè hū",
        exampleSentence: "孩子们玩得不亦乐乎。",
        exampleTranslation: "The children played with great delight.",
        partOfSpeech: "idiom",
      },
      {
        word: "言之有理",
        translation: "what is said makes sense",
        pronunciation: "yán zhī yǒu lǐ",
        exampleSentence: "你说得言之有理，我同意你的看法。",
        exampleTranslation: "What you say makes sense; I agree with your view.",
        partOfSpeech: "idiom",
      },
      {
        word: "矣",
        translation: "(literary particle indicating completion)",
        pronunciation: "yǐ",
        exampleSentence: "逝者如斯夫，不舍昼夜。",
        exampleTranslation: "Time flows on like this river, never ceasing day or night. (Confucius)",
        partOfSpeech: "particle",
      },
    ],
    grammarPoints: [
      {
        title: "之所以...是因为 (The reason... is because)",
        explanation: "This formal structure places emphasis on the cause. 之所以 introduces the result first, then 是因为 introduces the cause. This is the reverse of the normal 因为...所以 order and is more literary.",
        examples: [
          { correct: "中国之所以发展迅速，是因为改革开放的政策。", translation: "The reason China developed rapidly is because of the reform and opening-up policy." },
          { correct: "她之所以哭了，是因为太感动了。", translation: "The reason she cried is because she was too moved." },
        ],
        commonMistakes: [
          {
            incorrect: "之所以他成功是因为努力。",
            correction: "他之所以成功，是因为努力。",
            explanation: "The subject goes before 之所以, not after it.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "classical-modern",
        title: "Classical Quotes in Modern Debate",
        situation: "You are debating the relevance of classical Chinese education in modern schools",
        agentRole: "You are a high school teacher named 刘老师 who believes classical Chinese should remain in the curriculum. Argue your case using classical expressions and ask the student to respond.",
        userGoal: "Debate whether classical Chinese should still be taught, using classical phrases naturally",
        targetPhrases: ["之所以", "不亦乐乎", "言之有理"],
        successCriteria: ["Takes a position", "Uses classical expressions", "Engages in back-and-forth debate"],
      },
    ],
    culturalNotes: [
      {
        title: "文言文 in the Chinese Education System",
        content: "Chinese students study classical texts (文言文) throughout middle and high school. The gaokao (高考) national exam includes classical Chinese reading comprehension. This means educated Chinese speakers naturally pepper their speech with classical phrases — mastering them signals cultural literacy.",
      },
    ],
  },
];

// ============================================
// Module 3: Business & Economics
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l7",
    slug: "formal-business-patterns",
    title: "Formal Business Patterns",
    content: `# Formal Business Patterns

Master the formal patterns used in Chinese business communication.

## Formal Function Words

- **以** (yǐ) - in order to / by means of (literary)
- **予以** (yǔyǐ) - to give / to grant (formal)
- **关于** (guānyú) - regarding / concerning
- **至于** (zhìyú) - as for / as to

## Formal Demonstratives

- **本** (běn) - this (our) — 本公司 = this company (our company)
- **该** (gāi) - said / the aforementioned — 该项目 = said project
- **其** (qí) - its / his / their (formal) — 其结果 = its result

## Business Context

These patterns appear in contracts, business correspondence, presentations, and formal meetings. Using them correctly signals professionalism.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m3",
    moduleTitle: "Business & Economics",
    order: 7,
    topicId: "zh-advanced-formal-business",
    vocabulary: [
      {
        word: "以",
        translation: "in order to / by means of",
        pronunciation: "yǐ",
        exampleSentence: "以提高效率为目标。",
        exampleTranslation: "With the goal of improving efficiency.",
        partOfSpeech: "preposition",
      },
      {
        word: "予以",
        translation: "to give / to grant (formal)",
        pronunciation: "yǔyǐ",
        exampleSentence: "违规行为将予以严惩。",
        exampleTranslation: "Violations will be severely punished.",
        partOfSpeech: "verb",
      },
      {
        word: "本公司",
        translation: "this company (our company)",
        pronunciation: "běn gōngsī",
        exampleSentence: "本公司致力于可持续发展。",
        exampleTranslation: "Our company is committed to sustainable development.",
        partOfSpeech: "noun",
      },
      {
        word: "该",
        translation: "said / the aforementioned",
        pronunciation: "gāi",
        exampleSentence: "该协议于下月生效。",
        exampleTranslation: "Said agreement takes effect next month.",
        partOfSpeech: "determiner",
      },
      {
        word: "其",
        translation: "its / his / their (formal)",
        pronunciation: "qí",
        exampleSentence: "该公司及其子公司。",
        exampleTranslation: "The company and its subsidiaries.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "以 as Formal 'In Order To'",
        explanation: "以 replaces 为了 in formal writing to express purpose. It can also mean 'by means of.' Pattern: 以 + [goal/method] + 为 + [frame].",
        examples: [
          { correct: "以客户为中心", translation: "With the customer as the center (customer-centric)" },
          { correct: "以质量求生存，以信誉求发展。", translation: "Seek survival through quality, seek development through reputation." },
        ],
      },
      {
        title: "关于 vs 至于",
        explanation: "关于 introduces the main topic ('regarding X'). 至于 shifts to a secondary or contrasting topic ('as for X'). 至于 often implies the speaker considers the secondary topic less important or is setting it aside.",
        examples: [
          { correct: "关于这个项目，我有几点建议。", translation: "Regarding this project, I have a few suggestions." },
          { correct: "至于价格问题，我们可以以后再谈。", translation: "As for the price issue, we can discuss it later." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "business-meeting",
        title: "Board Meeting Presentation",
        situation: "You are presenting a quarterly report at a board meeting",
        agentRole: "You are the CEO, 陈总. Listen to the student's quarterly report and ask probing questions about performance metrics and strategy.",
        userGoal: "Present business results using formal business register",
        targetPhrases: ["本公司", "以...为", "予以", "关于", "其"],
        successCriteria: ["Uses formal business vocabulary", "Presents information structurally", "Responds to questions professionally"],
      },
    ],
  },
  {
    id: "zh-adv-l8",
    slug: "ecommerce-economy",
    title: "E-Commerce & Digital Economy",
    content: `# E-Commerce & Digital Economy

Navigate China's digital economy landscape.

## E-Commerce Vocabulary

- **电子商务** (diànzǐ shāngwù) - e-commerce
- **网购** (wǎng gòu) - online shopping
- **直播带货** (zhíbō dài huò) - livestream selling
- **移动支付** (yídòng zhīfù) - mobile payment
- **供应链** (gōngyìng liàn) - supply chain

## Economic Terms

- **国内生产总值** (GDP) - Gross Domestic Product
- **通货膨胀** (tōnghuò péngzhàng) - inflation
- **消费者** (xiāofèi zhě) - consumer
- **市场份额** (shìchǎng fèn'é) - market share`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m3",
    moduleTitle: "Business & Economics",
    order: 8,
    topicId: "zh-advanced-ecommerce",
    vocabulary: [
      {
        word: "直播带货",
        translation: "livestream selling",
        pronunciation: "zhíbō dài huò",
        exampleSentence: "直播带货已经成为一种新的商业模式。",
        exampleTranslation: "Livestream selling has become a new business model.",
        partOfSpeech: "noun",
      },
      {
        word: "移动支付",
        translation: "mobile payment",
        pronunciation: "yídòng zhīfù",
        exampleSentence: "中国的移动支付在全球领先。",
        exampleTranslation: "China's mobile payment leads the world.",
        partOfSpeech: "noun",
      },
      {
        word: "供应链",
        translation: "supply chain",
        pronunciation: "gōngyìng liàn",
        exampleSentence: "疫情严重影响了全球供应链。",
        exampleTranslation: "The pandemic severely affected global supply chains.",
        partOfSpeech: "noun",
      },
      {
        word: "市场份额",
        translation: "market share",
        pronunciation: "shìchǎng fèn'é",
        exampleSentence: "该品牌的市场份额持续增长。",
        exampleTranslation: "The brand's market share continues to grow.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Formal Reporting Patterns",
        explanation: "Business Chinese uses set patterns for reporting data and trends. Key structures include 达到 (to reach), 增长了 (grew by), 下降了 (declined by), and 占 (to account for).",
        examples: [
          { correct: "销售额增长了百分之二十。", translation: "Sales revenue grew by twenty percent." },
          { correct: "网购占零售总额的百分之三十。", translation: "Online shopping accounts for thirty percent of total retail." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tech-investment",
        title: "Tech Investment Discussion",
        situation: "You are discussing investment opportunities in China's tech sector",
        agentRole: "You are a venture capitalist named 赵总. Discuss trends in Chinese e-commerce and ask the student which sector they think has the most potential.",
        userGoal: "Discuss digital economy trends and defend an investment thesis",
        targetPhrases: ["直播带货", "移动支付", "市场份额", "供应链"],
        successCriteria: ["Uses business/economic vocabulary", "Analyzes trends", "Defends a position with evidence"],
      },
    ],
  },
  {
    id: "zh-adv-l9",
    slug: "business-correspondence",
    title: "Business Correspondence & Emails",
    content: `# Business Correspondence & Emails

Write professional Chinese business emails and letters.

## Email Structure

- **尊敬的...** (zūnjìng de) - Dear... (formal)
- **您好！** - Hello! (formal greeting)
- **此致敬礼** (cǐ zhì jìnglǐ) - Respectfully yours (closing)
- **顺祝商祺** (shùn zhù shāng qí) - Best business regards

## Useful Phrases

- **烦请** (fán qǐng) - Would you kindly... (polite request)
- **敬请回复** (jìng qǐng huífù) - Please kindly reply
- **随函附上** (suí hán fù shàng) - Enclosed herewith
- **如有任何问题，请随时联系** - Should you have any questions, please contact us at any time`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m3",
    moduleTitle: "Business & Economics",
    order: 9,
    topicId: "zh-advanced-business-correspondence",
    vocabulary: [
      {
        word: "尊敬的",
        translation: "dear / respected (formal address)",
        pronunciation: "zūnjìng de",
        exampleSentence: "尊敬的王总，您好！",
        exampleTranslation: "Dear Director Wang, hello!",
        partOfSpeech: "adjective",
      },
      {
        word: "烦请",
        translation: "would you kindly",
        pronunciation: "fán qǐng",
        exampleSentence: "烦请您在周五之前回复。",
        exampleTranslation: "Would you kindly reply before Friday.",
        partOfSpeech: "phrase",
      },
      {
        word: "此致敬礼",
        translation: "respectfully yours (letter closing)",
        pronunciation: "cǐ zhì jìnglǐ",
        exampleSentence: "期待您的回复。此致敬礼。",
        exampleTranslation: "Looking forward to your reply. Respectfully yours.",
        partOfSpeech: "phrase",
      },
      {
        word: "随函附上",
        translation: "enclosed herewith",
        pronunciation: "suí hán fù shàng",
        exampleSentence: "随函附上合同副本一份。",
        exampleTranslation: "Enclosed herewith is one copy of the contract.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Formal Request Patterns",
        explanation: "Chinese business correspondence uses escalating politeness: 请 (please) < 烦请 (trouble you to) < 敬请 (respectfully request). The choice signals the writer's deference and the request's importance.",
        examples: [
          { correct: "请查收附件。", translation: "Please check the attachment." },
          { correct: "烦请贵公司尽快确认订单。", translation: "Would you kindly confirm the order as soon as possible." },
          { correct: "敬请拨冗出席。", translation: "We respectfully request you find time to attend." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "email-dictation",
        title: "Dictating a Business Email",
        situation: "You need to dictate a formal business email to your assistant",
        agentRole: "You are an executive assistant named 小李. Take dictation for a business email and ask clarifying questions about tone and content.",
        userGoal: "Dictate a professional email using formal business Chinese",
        targetPhrases: ["尊敬的", "烦请", "此致敬礼", "随函附上"],
        successCriteria: ["Uses proper email structure", "Maintains formal register", "Includes appropriate opening and closing"],
      },
    ],
  },
];

// ============================================
// Module 4: Science & Environment
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l10",
    slug: "complex-concession",
    title: "Complex Concession Patterns",
    content: `# Complex Concession Patterns

Master advanced concessive structures for nuanced argumentation.

## Concessive Connectors

- **尽管...但是** (jǐnguǎn...dànshì) - Even though... but
- **即使...也** (jíshǐ...yě) - Even if... still
- **要不是** (yào bú shì) - If it weren't for / If not for
- **纵然** (zòngrán) - Even if (literary)

## Key Distinction

尽管 deals with facts (conceding something true). 即使 deals with hypotheticals (conceding something that may or may not be true).`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m4",
    moduleTitle: "Science & Environment",
    order: 10,
    topicId: "zh-advanced-complex-concession",
    vocabulary: [
      {
        word: "尽管",
        translation: "even though / despite",
        pronunciation: "jǐnguǎn",
        exampleSentence: "尽管困难重重，他们仍然坚持研究。",
        exampleTranslation: "Even though difficulties were numerous, they still persisted in their research.",
        partOfSpeech: "conjunction",
      },
      {
        word: "即使",
        translation: "even if",
        pronunciation: "jíshǐ",
        exampleSentence: "即使失败了，我也不会放弃。",
        exampleTranslation: "Even if I fail, I still won't give up.",
        partOfSpeech: "conjunction",
      },
      {
        word: "要不是",
        translation: "if it weren't for",
        pronunciation: "yào bú shì",
        exampleSentence: "要不是他提醒我，我就忘了。",
        exampleTranslation: "If it weren't for his reminder, I would have forgotten.",
        partOfSpeech: "conjunction",
      },
      {
        word: "纵然",
        translation: "even if (literary)",
        pronunciation: "zòngrán",
        exampleSentence: "纵然前路艰难，我们也要勇往直前。",
        exampleTranslation: "Even if the road ahead is difficult, we must press forward courageously.",
        partOfSpeech: "conjunction",
      },
    ],
    grammarPoints: [
      {
        title: "尽管 vs 即使",
        explanation: "尽管 concedes a FACT (something already true), while 即使 concedes a HYPOTHETICAL (something that might happen). This distinction is crucial for precise argumentation.",
        examples: [
          { correct: "尽管他很努力，但是成绩还是不理想。", translation: "Even though he works hard (fact), his grades are still unsatisfactory.", note: "尽管 = he IS working hard" },
          { correct: "即使他更努力，成绩也不一定会提高。", translation: "Even if he worked harder (hypothetical), grades wouldn't necessarily improve.", note: "即使 = he MIGHT work harder" },
        ],
        commonMistakes: [
          {
            incorrect: "即使下雨了，但是我们还是去了。",
            correction: "尽管下雨了，我们还是去了。",
            explanation: "Since it already rained (fact), use 尽管, not 即使.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "climate-debate",
        title: "Climate Policy Debate",
        situation: "You are debating climate change policy at an academic forum",
        agentRole: "You are an environmental scientist named 林博士. Debate whether economic growth and environmental protection can coexist. Use concessive structures to acknowledge the other side's points.",
        userGoal: "Argue a position on climate policy using concessive structures",
        targetPhrases: ["尽管...但是", "即使...也", "要不是", "纵然"],
        successCriteria: ["Uses concessive patterns correctly", "Distinguishes fact from hypothetical", "Builds a nuanced argument"],
      },
    ],
  },
  {
    id: "zh-adv-l11",
    slug: "rhetorical-questions",
    title: "Rhetorical Questions & Emphasis",
    content: `# Rhetorical Questions & Emphasis

Use rhetorical questions to strengthen arguments in Chinese.

## Rhetorical Question Patterns

- **难道...吗？** (nándào...ma?) - Could it really be that...? (expects "no")
- **不是...吗？** (bú shì...ma?) - Isn't it...? (expects "yes")
- **何必** (hébì) - Why bother? What's the need?
- **何况** (hékuàng) - Let alone / Much less

## Function

Rhetorical questions in Chinese are powerful persuasion tools. They assert a point by framing it as an obvious question, making the answer feel self-evident.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m4",
    moduleTitle: "Science & Environment",
    order: 11,
    topicId: "zh-advanced-rhetorical-questions",
    vocabulary: [
      {
        word: "难道",
        translation: "could it be that (rhetorical)",
        pronunciation: "nándào",
        exampleSentence: "难道你不觉得这很重要吗？",
        exampleTranslation: "Don't you think this is important? (rhetorical — of course it is)",
        partOfSpeech: "adverb",
      },
      {
        word: "何必",
        translation: "why bother / what's the need",
        pronunciation: "hébì",
        exampleSentence: "何必为这种小事生气？",
        exampleTranslation: "Why bother getting angry over such a small matter?",
        partOfSpeech: "adverb",
      },
      {
        word: "何况",
        translation: "let alone / much less",
        pronunciation: "hékuàng",
        exampleSentence: "大人都做不到，何况孩子？",
        exampleTranslation: "Adults can't even do it, let alone children.",
        partOfSpeech: "conjunction",
      },
      {
        word: "岂不是",
        translation: "wouldn't that be (rhetorical)",
        pronunciation: "qǐ bú shì",
        exampleSentence: "那岂不是更麻烦了？",
        exampleTranslation: "Wouldn't that be even more troublesome?",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "难道...吗 Rhetorical Pattern",
        explanation: "难道...吗 frames a statement as a question that expects agreement. It implies 'surely you agree that...' The expected answer is always the opposite of what the surface question asks.",
        examples: [
          { correct: "难道我们不应该保护环境吗？", translation: "Shouldn't we protect the environment? (Of course we should!)" },
          { correct: "难道这还不够说明问题吗？", translation: "Isn't this enough to illustrate the problem? (Of course it is!)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "environmental-speech",
        title: "Environmental Advocacy Speech",
        situation: "You are giving a speech about plastic pollution to a community group",
        agentRole: "You are an audience member named 王阿姨 who is skeptical about environmental regulations. Challenge the student's arguments, forcing them to use rhetorical questions for emphasis.",
        userGoal: "Persuade the audience about environmental action using rhetorical questions",
        targetPhrases: ["难道...吗", "何必", "何况", "岂不是"],
        successCriteria: ["Uses rhetorical questions effectively", "Responds to counterarguments", "Builds persuasive case"],
      },
    ],
  },
  {
    id: "zh-adv-l12",
    slug: "science-technology",
    title: "Science & Technology Discourse",
    content: `# Science & Technology Discourse

Discuss scientific topics with precision and authority.

## Science Vocabulary

- **研究** (yánjiū) - research
- **实验** (shíyàn) - experiment
- **数据** (shùjù) - data
- **结论** (jiélùn) - conclusion
- **证明** (zhèngmíng) - to prove / proof

## Environmental Terms

- **可再生能源** (kě zàishēng néngyuán) - renewable energy
- **碳排放** (tàn páifàng) - carbon emissions
- **生态系统** (shēngtài xìtǒng) - ecosystem
- **可持续发展** (kě chíxù fāzhǎn) - sustainable development`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m4",
    moduleTitle: "Science & Environment",
    order: 12,
    topicId: "zh-advanced-science-technology",
    vocabulary: [
      {
        word: "可再生能源",
        translation: "renewable energy",
        pronunciation: "kě zàishēng néngyuán",
        exampleSentence: "中国在可再生能源领域投资巨大。",
        exampleTranslation: "China has invested enormously in the renewable energy sector.",
        partOfSpeech: "noun",
      },
      {
        word: "碳排放",
        translation: "carbon emissions",
        pronunciation: "tàn páifàng",
        exampleSentence: "减少碳排放是全球共同的责任。",
        exampleTranslation: "Reducing carbon emissions is a shared global responsibility.",
        partOfSpeech: "noun",
      },
      {
        word: "可持续发展",
        translation: "sustainable development",
        pronunciation: "kě chíxù fāzhǎn",
        exampleSentence: "可持续发展需要平衡经济和环境。",
        exampleTranslation: "Sustainable development requires balancing economy and environment.",
        partOfSpeech: "noun",
      },
      {
        word: "生态系统",
        translation: "ecosystem",
        pronunciation: "shēngtài xìtǒng",
        exampleSentence: "人类活动正在破坏海洋生态系统。",
        exampleTranslation: "Human activities are destroying marine ecosystems.",
        partOfSpeech: "noun",
      },
      {
        word: "数据",
        translation: "data",
        pronunciation: "shùjù",
        exampleSentence: "数据显示全球气温在持续上升。",
        exampleTranslation: "Data shows global temperatures are continuously rising.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Presenting Evidence: 据/根据...显示/表明",
        explanation: "Academic and scientific Chinese uses 据 or 根据 (according to) paired with 显示 (shows) or 表明 (indicates) to cite evidence. This structure is essential for any formal presentation of data.",
        examples: [
          { correct: "根据最新数据显示，碳排放量有所下降。", translation: "According to the latest data, carbon emissions have somewhat decreased." },
          { correct: "研究表明，可再生能源的成本正在降低。", translation: "Research indicates that the cost of renewable energy is decreasing." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "research-presentation",
        title: "Research Presentation",
        situation: "You are presenting environmental research findings at a conference",
        agentRole: "You are a fellow researcher named 孙博士. Ask probing questions about the student's methodology and conclusions.",
        userGoal: "Present research findings using academic vocabulary and evidence-citing patterns",
        targetPhrases: ["根据...显示", "数据表明", "可持续发展", "碳排放"],
        successCriteria: ["Presents data clearly", "Uses academic register", "Responds to technical questions"],
      },
    ],
  },
];

// ============================================
// Module 5: Literature & Arts
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l13",
    slug: "preference-sacrifice",
    title: "Preference & Sacrifice Patterns",
    content: `# Preference & Sacrifice Patterns

Express strong preferences and resolute choices.

## Key Patterns

- **与其...不如** (yǔqí...bùrú) - Rather than... it would be better to
- **宁可...也不** (nìngkě...yě bù) - Would rather... than (even at a cost)
- **宁愿** (nìngyuàn) - Would rather / prefer to
- **无论...都** (wúlùn...dōu) - No matter... all / regardless

## Nuance

与其...不如 is a rational comparison ("X is better than Y").
宁可...也不 expresses determination and willingness to sacrifice ("I'd rather X even if it costs me").`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m5",
    moduleTitle: "Literature & Arts",
    order: 13,
    topicId: "zh-advanced-preference-sacrifice",
    vocabulary: [
      {
        word: "与其",
        translation: "rather than",
        pronunciation: "yǔqí",
        exampleSentence: "与其抱怨，不如行动。",
        exampleTranslation: "Rather than complaining, it would be better to take action.",
        partOfSpeech: "conjunction",
      },
      {
        word: "宁可",
        translation: "would rather (at a cost)",
        pronunciation: "nìngkě",
        exampleSentence: "他宁可饿死，也不向敌人投降。",
        exampleTranslation: "He would rather starve than surrender to the enemy.",
        partOfSpeech: "adverb",
      },
      {
        word: "无论",
        translation: "no matter / regardless",
        pronunciation: "wúlùn",
        exampleSentence: "无论发生什么，我都会支持你。",
        exampleTranslation: "No matter what happens, I will support you.",
        partOfSpeech: "conjunction",
      },
      {
        word: "宁愿",
        translation: "would rather / prefer to",
        pronunciation: "nìngyuàn",
        exampleSentence: "我宁愿一个人待着。",
        exampleTranslation: "I would rather stay alone.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "与其...不如 vs 宁可...也不",
        explanation: "与其...不如 makes a rational comparison between two options. 宁可...也不 expresses determination with emotional weight — the speaker is willing to endure hardship to avoid the alternative.",
        examples: [
          { correct: "与其浪费时间，不如早点开始。", translation: "Rather than wasting time, it's better to start early.", note: "Rational comparison" },
          { correct: "他宁可一个人走，也不愿意求人帮忙。", translation: "He would rather walk alone than ask others for help.", note: "Emotional determination" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "literary-analysis",
        title: "Analyzing a Literary Character",
        situation: "You are discussing a character's motivations in a Chinese novel",
        agentRole: "You are a book club leader named 方姐. Discuss a character who makes a difficult sacrifice and ask whether the student agrees with their choice.",
        userGoal: "Analyze a character's choices using preference and sacrifice patterns",
        targetPhrases: ["与其...不如", "宁可...也不", "无论...都"],
        successCriteria: ["Uses preference patterns correctly", "Analyzes character motivation", "Expresses personal judgment"],
      },
    ],
  },
  {
    id: "zh-adv-l14",
    slug: "tang-poetry",
    title: "Tang Poetry & Literary Appreciation",
    content: `# Tang Poetry & Literary Appreciation

Explore the golden age of Chinese poetry — the Tang Dynasty (618-907).

## Famous Poems

### 静夜思 — 李白 (Quiet Night Thought — Li Bai)
床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。

*Moonlight before my bed, / Perhaps frost on the ground. / I raise my head to gaze at the moon, / I lower my head and think of home.*

### 登鹳雀楼 — 王之涣
白日依山尽，
黄河入海流。
欲穷千里目，
更上一层楼。

*The sun along the mountains bows, / The Yellow River seaward flows. / To see a thousand miles ahead, / Ascend another flight of stairs.*

## Literary Terms

- **意境** (yìjìng) - artistic mood / imagery
- **韵律** (yùnlǜ) - rhythm and rhyme
- **比喻** (bǐyù) - metaphor`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m5",
    moduleTitle: "Literature & Arts",
    order: 14,
    topicId: "zh-advanced-tang-poetry",
    vocabulary: [
      {
        word: "意境",
        translation: "artistic mood / imagery",
        pronunciation: "yìjìng",
        exampleSentence: "这首诗的意境非常优美。",
        exampleTranslation: "The artistic mood of this poem is very beautiful.",
        partOfSpeech: "noun",
      },
      {
        word: "故乡",
        translation: "hometown / homeland",
        pronunciation: "gùxiāng",
        exampleSentence: "每到中秋，我就想起故乡。",
        exampleTranslation: "Every Mid-Autumn Festival, I think of my hometown.",
        partOfSpeech: "noun",
      },
      {
        word: "比喻",
        translation: "metaphor",
        pronunciation: "bǐyù",
        exampleSentence: "诗人用月亮比喻思乡之情。",
        exampleTranslation: "The poet uses the moon as a metaphor for homesickness.",
        partOfSpeech: "noun",
      },
      {
        word: "韵律",
        translation: "rhythm and rhyme",
        pronunciation: "yùnlǜ",
        exampleSentence: "唐诗讲究韵律和对仗。",
        exampleTranslation: "Tang poetry emphasizes rhythm, rhyme, and parallelism.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Reading Classical Poetry Structure",
        explanation: "Tang poems follow strict structures: 五言 (5 characters per line) or 七言 (7 characters per line). Each line is a complete thought. Classical grammar omits subjects and uses compressed syntax. Understanding the structure helps decode meaning.",
        examples: [
          { correct: "举头望明月", translation: "Raise head, gaze at bright moon", note: "Subject 'I' is omitted; 举 and 望 are both verbs" },
          { correct: "欲穷千里目", translation: "Wanting to exhaust thousand-mile sight", note: "欲 = want to; 穷 = exhaust; 千里目 = thousand-mile gaze" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "poetry-recitation",
        title: "Poetry Appreciation Session",
        situation: "You are at a Chinese cultural event discussing Tang poetry",
        agentRole: "You are a calligraphy teacher named 赵老师. Recite a Tang poem and ask the student to explain its meaning and discuss its imagery.",
        userGoal: "Discuss Tang poetry, explain imagery, and connect themes to modern life",
        targetPhrases: ["意境", "比喻", "故乡", "韵律"],
        successCriteria: ["Interprets a poem's meaning", "Discusses literary devices", "Connects to personal experience"],
      },
    ],
    culturalNotes: [
      {
        title: "The Four Great Classical Novels (四大名著)",
        content: "The 四大名著 are: 《三国演义》(Romance of the Three Kingdoms), 《水浒传》(Water Margin), 《西游记》(Journey to the West), and 《红楼梦》(Dream of the Red Chamber). These novels form the backbone of Chinese literary culture. References to their characters and stories appear constantly in everyday Chinese — knowing them is essential cultural literacy.",
      },
    ],
  },
  {
    id: "zh-adv-l15",
    slug: "four-great-novels",
    title: "The Four Great Classical Novels",
    content: `# The Four Great Classical Novels 四大名著

Explore the masterworks that shaped Chinese literary and cultural identity.

## The Four Novels

1. **《三国演义》** (Sānguó Yǎnyì) - Romance of the Three Kingdoms — strategy, loyalty, war
2. **《水浒传》** (Shuǐhǔ Zhuàn) - Water Margin — rebellion, justice, brotherhood
3. **《西游记》** (Xīyóu Jì) - Journey to the West — adventure, Buddhism, perseverance
4. **《红楼梦》** (Hónglóu Mèng) - Dream of the Red Chamber — love, decline, philosophy

## Cultural References in Daily Life

- **三十六计，走为上计** - Of the 36 stratagems, fleeing is the best (from 三国)
- **孙悟空** - The Monkey King (from 西游记)
- **逼上梁山** - Forced to become an outlaw / forced into action (from 水浒传)`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m5",
    moduleTitle: "Literature & Arts",
    order: 15,
    topicId: "zh-advanced-four-great-novels",
    vocabulary: [
      {
        word: "名著",
        translation: "masterwork / classic literary work",
        pronunciation: "míngzhù",
        exampleSentence: "你读过中国的四大名著吗？",
        exampleTranslation: "Have you read China's Four Great Classical Novels?",
        partOfSpeech: "noun",
      },
      {
        word: "逼上梁山",
        translation: "forced into drastic action",
        pronunciation: "bī shàng liáng shān",
        exampleSentence: "他是被逼上梁山的，不得已才辞职。",
        exampleTranslation: "He was forced into drastic action and had no choice but to resign.",
        partOfSpeech: "idiom",
      },
      {
        word: "忠义",
        translation: "loyalty and righteousness",
        pronunciation: "zhōngyì",
        exampleSentence: "关羽是忠义的象征。",
        exampleTranslation: "Guan Yu is a symbol of loyalty and righteousness.",
        partOfSpeech: "noun",
      },
      {
        word: "取经",
        translation: "to seek scriptures / to learn from experience",
        pronunciation: "qǔ jīng",
        exampleSentence: "我们去那家公司取取经吧。",
        exampleTranslation: "Let's go learn from that company's experience.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Literary Allusions as Idiomatic Expressions",
        explanation: "References to the Four Great Novels function as chengyu-like expressions in modern Chinese. They carry the weight of the original story and are used metaphorically. Understanding the source story unlocks the meaning.",
        examples: [
          { correct: "这简直是空城计！", translation: "This is clearly an empty-city stratagem!", note: "From Three Kingdoms — a bluff" },
          { correct: "别跟我耍孙悟空的把戏。", translation: "Don't play Monkey King tricks on me.", note: "From Journey to the West — mischief/deception" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "book-club",
        title: "Classical Literature Book Club",
        situation: "You are at a book club discussing your favorite of the Four Great Novels",
        agentRole: "You are a retired literature professor named 周教授. Ask which novel the student has read, discuss its themes, and connect them to modern Chinese society.",
        userGoal: "Discuss a classical novel's themes and their modern relevance",
        targetPhrases: ["四大名著", "忠义", "逼上梁山", "取经"],
        successCriteria: ["Demonstrates knowledge of a novel", "Uses literary allusions", "Connects themes to modern life"],
      },
    ],
  },
];

// ============================================
// Module 6: Society & Abstract Topics
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l16",
    slug: "topic-comment",
    title: "Topic-Comment Patterns",
    content: `# Topic-Comment Patterns

Master the distinctly Chinese way of structuring sentences around topics.

## What is Topic-Comment?

Chinese is a topic-prominent language. The topic is stated first, then a comment is made about it. The topic doesn't need to be the grammatical subject.

## Patterns

- **Topic + 嘛/呢** — casual topic-fronting
- **至于 + Topic** — shifting to a new topic
- **关于 + Topic + 的问题** — formal topic introduction
- **...的话** (...de huà) — "speaking of..." / "if..."

## Examples of Topic-Comment

- **这件事，我已经知道了。** — This matter, I already know about.
- **中文，语法不太难，但是汉字很难。** — Chinese: grammar isn't hard, but characters are.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m6",
    moduleTitle: "Society & Abstract Topics",
    order: 16,
    topicId: "zh-advanced-topic-comment",
    vocabulary: [
      {
        word: "而言",
        translation: "in terms of / as far as... is concerned",
        pronunciation: "ér yán",
        exampleSentence: "就目前而言，情况还算稳定。",
        exampleTranslation: "As far as the present situation is concerned, things are still stable.",
        partOfSpeech: "phrase",
      },
      {
        word: "来说",
        translation: "speaking of / for",
        pronunciation: "lái shuō",
        exampleSentence: "对我来说，健康比金钱更重要。",
        exampleTranslation: "For me, health is more important than money.",
        partOfSpeech: "phrase",
      },
      {
        word: "从...来看",
        translation: "looking at it from...",
        pronunciation: "cóng...lái kàn",
        exampleSentence: "从长远来看，教育投资是值得的。",
        exampleTranslation: "Looking at it from a long-term perspective, investing in education is worthwhile.",
        partOfSpeech: "phrase",
      },
      {
        word: "就...而言",
        translation: "as far as... is concerned",
        pronunciation: "jiù...ér yán",
        exampleSentence: "就质量而言，这个品牌是最好的。",
        exampleTranslation: "As far as quality is concerned, this brand is the best.",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Advanced Topic-Fronting Structures",
        explanation: "At the C1 level, topic-comment mastery means smoothly fronting topics and using frame-setting adverbials. The key structures are: 就X而言, 从X来看, 对X来说, and 关于X. Each has a slightly different nuance of formality and scope.",
        examples: [
          { correct: "就工作效率而言，他是团队里最好的。", translation: "As far as work efficiency is concerned, he is the best on the team." },
          { correct: "从文化角度来看，这个决定是有争议的。", translation: "From a cultural perspective, this decision is controversial." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "social-discussion",
        title: "Social Issues Discussion",
        situation: "You are discussing generational differences in Chinese society",
        agentRole: "You are a sociology graduate student named 小周. Discuss how different generations view work, marriage, and success. Shift between topics naturally.",
        userGoal: "Discuss social topics using topic-comment structures and frame-setting expressions",
        targetPhrases: ["就...而言", "从...来看", "对...来说", "至于"],
        successCriteria: ["Shifts between topics smoothly", "Uses frame-setting expressions", "Discusses abstract social concepts"],
      },
    ],
  },
  {
    id: "zh-adv-l17",
    slug: "complex-passive-voice",
    title: "Complex Passive Constructions",
    content: `# Complex Passive Constructions

Chinese uses multiple passive strategies beyond the basic 被 structure.

## Passive Markers

- **被** (bèi) - by (standard passive, often negative)
- **受到** (shòu dào) - to receive / to be subjected to
- **遭到** (zāo dào) - to suffer / to be subjected to (negative)
- **得到** (dé dào) - to obtain / to receive (positive)

## Formal Passive Without 被

- **为...所** (wéi...suǒ) - classical passive: "by X, [verb]ed"
- **受...影响** - influenced by...

## Register Notes

被 is neutral to negative in register. 受到 is formal and neutral. 遭到 always implies something bad happened. 得到 implies something good was received.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m6",
    moduleTitle: "Society & Abstract Topics",
    order: 17,
    topicId: "zh-advanced-complex-passive",
    vocabulary: [
      {
        word: "受到",
        translation: "to receive / to be subjected to",
        pronunciation: "shòu dào",
        exampleSentence: "他的作品受到广泛好评。",
        exampleTranslation: "His work received widespread positive reviews.",
        partOfSpeech: "verb",
      },
      {
        word: "遭到",
        translation: "to suffer / to be subjected to (negative)",
        pronunciation: "zāo dào",
        exampleSentence: "该提案遭到强烈反对。",
        exampleTranslation: "The proposal met with strong opposition.",
        partOfSpeech: "verb",
      },
      {
        word: "得到",
        translation: "to obtain / to receive (positive)",
        pronunciation: "dé dào",
        exampleSentence: "这个方案得到了大家的支持。",
        exampleTranslation: "This plan received everyone's support.",
        partOfSpeech: "verb",
      },
      {
        word: "为...所",
        translation: "by... (classical passive)",
        pronunciation: "wéi...suǒ",
        exampleSentence: "我为他的勇气所感动。",
        exampleTranslation: "I was moved by his courage.",
        partOfSpeech: "pattern",
      },
    ],
    grammarPoints: [
      {
        title: "Choosing the Right Passive Marker",
        explanation: "The choice of passive marker signals the speaker's attitude. 被 is neutral-negative and common in speech. 受到 is formal and neutral. 遭到 signals victimhood or misfortune. 得到 signals benefit. 为...所 is literary/formal.",
        examples: [
          { correct: "他被批评了。", translation: "He was criticized. (neutral/negative, spoken)" },
          { correct: "该项目受到政府的支持。", translation: "The project received government support. (formal, neutral)" },
          { correct: "村庄遭到洪水袭击。", translation: "The village was hit by flooding. (negative event)" },
          { correct: "她的努力得到了认可。", translation: "Her efforts received recognition. (positive outcome)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "news-report",
        title: "News Report Role Play",
        situation: "You are reporting on a social event for a news broadcast",
        agentRole: "You are a news anchor named 杨主播. Co-anchor a news segment with the student, covering both positive and negative stories.",
        userGoal: "Report news using appropriate passive constructions for positive and negative events",
        targetPhrases: ["受到", "遭到", "得到", "为...所"],
        successCriteria: ["Matches passive marker to event valence", "Maintains news register", "Reports clearly and concisely"],
      },
    ],
  },
  {
    id: "zh-adv-l18",
    slug: "register-distinctions",
    title: "Register Distinctions in Chinese",
    content: `# Register Distinctions in Chinese

Navigate the spectrum from casual speech (口语) to formal writing (书面语).

## Spoken vs Written Equivalents

| Spoken (口语) | Written (书面语) | Meaning |
|---|---|---|
| 但是 | 然而 | however |
| 因为 | 由于 | because |
| 虽然 | 尽管 | although |
| 如果 | 倘若 | if |
| 马上 | 即刻 | immediately |
| 很多 | 众多 | many |

## When to Switch Registers

- **Casual**: friends, family, texting, social media
- **Semi-formal**: workplace conversations, presentations
- **Formal**: business correspondence, academic papers, news
- **Literary**: essays, speeches, formal ceremonies`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m6",
    moduleTitle: "Society & Abstract Topics",
    order: 18,
    topicId: "zh-advanced-register-distinctions",
    vocabulary: [
      {
        word: "倘若",
        translation: "if / supposing (formal)",
        pronunciation: "tǎngruò",
        exampleSentence: "倘若他不同意，我们该怎么办？",
        exampleTranslation: "If he doesn't agree, what should we do?",
        partOfSpeech: "conjunction",
      },
      {
        word: "即刻",
        translation: "immediately (formal)",
        pronunciation: "jíkè",
        exampleSentence: "请即刻回复此邮件。",
        exampleTranslation: "Please reply to this email immediately.",
        partOfSpeech: "adverb",
      },
      {
        word: "众多",
        translation: "numerous / many (formal)",
        pronunciation: "zhòngduō",
        exampleSentence: "众多学者对此表示关注。",
        exampleTranslation: "Numerous scholars have expressed concern about this.",
        partOfSpeech: "adjective",
      },
      {
        word: "口语",
        translation: "spoken language / colloquial",
        pronunciation: "kǒuyǔ",
        exampleSentence: "口语和书面语的差别很大。",
        exampleTranslation: "The difference between spoken and written language is significant.",
        partOfSpeech: "noun",
      },
      {
        word: "书面语",
        translation: "written/formal language",
        pronunciation: "shūmiànyǔ",
        exampleSentence: "这篇文章用的是书面语。",
        exampleTranslation: "This article uses formal written language.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Register Switching in Practice",
        explanation: "A hallmark of C1 proficiency is the ability to switch registers fluidly. The same idea expressed in different registers can change meaning, tone, and social signaling. Practice identifying when to use 口语 vs 书面语.",
        examples: [
          { correct: "我觉得这个不太好。(口语)", translation: "I think this isn't very good. (casual)" },
          { correct: "本人认为此方案有待改进。(书面语)", translation: "I believe this proposal needs improvement. (formal)", note: "本人 replaces 我, 此 replaces 这个, 有待改进 replaces 不太好" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "register-challenge",
        title: "Register Switching Challenge",
        situation: "You must express the same ideas in different registers",
        agentRole: "You are a language coach named 韩老师. Give the student sentences in casual Chinese and ask them to 'upgrade' to formal register, then vice versa.",
        userGoal: "Transform sentences between casual and formal registers",
        targetPhrases: ["倘若", "即刻", "众多", "书面语", "口语"],
        successCriteria: ["Correctly identifies register level", "Transforms between registers", "Explains the differences"],
      },
    ],
  },
];

// ============================================
// Module 7: Chengyu & Idioms
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l19",
    slug: "chengyu-stories-1",
    title: "Chengyu with Stories: Part 1",
    content: `# Chengyu with Stories: Part 1

Learn chengyu through their origin stories.

## 画蛇添足 (huà shé tiān zú)
**Drawing a snake and adding feet** — To ruin something by overdoing it.

*Story:* Men competed to drink wine by drawing snakes. The fastest drawer, confident he'd won, added feet to his snake. Another man finished and said: "Snakes don't have feet — yours isn't a snake." He took the wine.

## 守株待兔 (shǒu zhū dài tù)
**Guarding a tree stump waiting for a rabbit** — Relying on luck instead of effort.

*Story:* A farmer saw a rabbit run into a tree stump and die. He stopped farming and waited by the stump every day, but no rabbit ever came again. His fields went to waste.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m7",
    moduleTitle: "Chengyu & Idioms",
    order: 19,
    topicId: "zh-advanced-chengyu-stories-1",
    vocabulary: [
      {
        word: "画蛇添足",
        translation: "to ruin by overdoing / gilding the lily",
        pronunciation: "huà shé tiān zú",
        exampleSentence: "你的文章已经很好了，再改就是画蛇添足。",
        exampleTranslation: "Your essay is already great — editing more would be gilding the lily.",
        partOfSpeech: "idiom",
      },
      {
        word: "守株待兔",
        translation: "to wait for a windfall / rely on luck",
        pronunciation: "shǒu zhū dài tù",
        exampleSentence: "找工作不能守株待兔，要主动出击。",
        exampleTranslation: "You can't just wait for a job to fall in your lap — you need to be proactive.",
        partOfSpeech: "idiom",
      },
      {
        word: "多此一举",
        translation: "an unnecessary action",
        pronunciation: "duō cǐ yī jǔ",
        exampleSentence: "你这样做完全是多此一举。",
        exampleTranslation: "What you're doing is completely unnecessary.",
        partOfSpeech: "idiom",
      },
      {
        word: "弄巧成拙",
        translation: "to outsmart oneself / backfire",
        pronunciation: "nòng qiǎo chéng zhuō",
        exampleSentence: "他想走捷径，结果弄巧成拙。",
        exampleTranslation: "He tried to take a shortcut but it backfired.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Chengyu as Predicates and Complements",
        explanation: "Chengyu can function as predicates (他画蛇添足), attributives (画蛇添足的做法), or adverbials. At C1 level, practice using them naturally within complex sentences rather than as standalone phrases.",
        examples: [
          { correct: "他这种守株待兔的心态要不得。", translation: "This wait-for-a-windfall mentality of his is unacceptable.", note: "Chengyu as attributive" },
          { correct: "别画蛇添足了，就这样交上去吧。", translation: "Don't gild the lily — just submit it as is.", note: "Chengyu as predicate in imperative" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "chengyu-application",
        title: "Applying Chengyu to Real Life",
        situation: "You are telling a friend about a situation where a chengyu perfectly applies",
        agentRole: "You are a friend named 小明. Share a story about a colleague who over-complicated a project, and ask the student which chengyu fits best.",
        userGoal: "Identify and apply the correct chengyu to real-life situations",
        targetPhrases: ["画蛇添足", "守株待兔", "多此一举", "弄巧成拙"],
        successCriteria: ["Selects appropriate chengyu", "Uses it in context", "Tells their own example"],
      },
    ],
    culturalNotes: [
      {
        title: "Chengyu in Chinese Communication",
        content: "Using chengyu correctly is a social signal of education and cultural refinement. In business settings, sprinkling appropriate chengyu into presentations or negotiations can build credibility. However, misusing a chengyu is worse than not using one — it signals pretension without substance.",
      },
    ],
  },
  {
    id: "zh-adv-l20",
    slug: "chengyu-stories-2",
    title: "Chengyu with Stories: Part 2",
    content: `# Chengyu with Stories: Part 2

More chengyu with their famous origin stories.

## 塞翁失马 (sài wēng shī mǎ)
**The old man at the frontier lost his horse** — A blessing in disguise; things may not be as bad as they seem.

*Story:* An old man's horse ran away. Neighbors said "How unfortunate!" He said "Perhaps." The horse returned with a wild stallion. "How fortunate!" "Perhaps." His son rode the stallion and broke his leg. "How unfortunate!" "Perhaps." War came and his son was spared from conscription.

## 掩耳盗铃 (yǎn ěr dào líng)
**Covering one's ears to steal a bell** — Self-deception.

*Story:* A thief wanted to steal a bronze bell. He knew striking it would make noise and alert others. So he covered his own ears, thinking: "If I can't hear it, nobody can."`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m7",
    moduleTitle: "Chengyu & Idioms",
    order: 20,
    topicId: "zh-advanced-chengyu-stories-2",
    vocabulary: [
      {
        word: "塞翁失马",
        translation: "a blessing in disguise",
        pronunciation: "sài wēng shī mǎ",
        exampleSentence: "被裁员后他创业成功了，真是塞翁失马，焉知非福。",
        exampleTranslation: "After being laid off, he started a successful business — truly a blessing in disguise.",
        partOfSpeech: "idiom",
      },
      {
        word: "掩耳盗铃",
        translation: "to deceive oneself",
        pronunciation: "yǎn ěr dào líng",
        exampleSentence: "不看体检报告就以为自己健康，是掩耳盗铃。",
        exampleTranslation: "Thinking you're healthy just because you don't look at your medical report is self-deception.",
        partOfSpeech: "idiom",
      },
      {
        word: "焉知非福",
        translation: "how do you know it's not a blessing?",
        pronunciation: "yān zhī fēi fú",
        exampleSentence: "塞翁失马，焉知非福。",
        exampleTranslation: "The old man lost his horse — how do you know it's not a blessing?",
        partOfSpeech: "phrase",
      },
      {
        word: "亡羊补牢",
        translation: "to mend the pen after losing sheep / better late than never",
        pronunciation: "wáng yáng bǔ láo",
        exampleSentence: "虽然已经出了问题，但亡羊补牢，为时未晚。",
        exampleTranslation: "Although problems have occurred, it's not too late to fix them.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Chengyu in Complex Sentences",
        explanation: "Advanced chengyu usage involves embedding them in complex grammatical structures — as part of 虽然...但是, 即使...也, or topic-comment patterns. This shows true integration rather than surface-level insertion.",
        examples: [
          { correct: "虽然失败了，但塞翁失马，也许这是一个新的开始。", translation: "Although we failed, perhaps this is a blessing in disguise — a new beginning." },
          { correct: "即使亡羊补牢，损失也已经很大了。", translation: "Even if we fix things now, the losses are already significant." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "chengyu-wisdom",
        title: "Sharing Wisdom Through Chengyu",
        situation: "A friend is upset about losing their job and you want to comfort them",
        agentRole: "You are a distressed friend named 小丽 who just lost her job. Express frustration and ask the student for advice.",
        userGoal: "Comfort a friend using appropriate chengyu about perspective and resilience",
        targetPhrases: ["塞翁失马", "焉知非福", "亡羊补牢"],
        successCriteria: ["Uses chengyu empathetically", "Provides genuine comfort", "Tells the origin story if asked"],
      },
    ],
  },
  {
    id: "zh-adv-l21",
    slug: "proverbs-yanyu",
    title: "Proverbs & Popular Sayings",
    content: `# Proverbs & Popular Sayings 谚语

Beyond chengyu, Chinese has a rich tradition of folk proverbs (谚语 yànyǔ) — longer sayings that encode practical wisdom.

## Common Proverbs

- **入乡随俗** (rù xiāng suí sú) - When in Rome, do as the Romans do
- **三人行，必有我师** (sān rén xíng, bì yǒu wǒ shī) - Among three people walking, one is surely my teacher (Confucius)
- **活到老，学到老** (huó dào lǎo, xué dào lǎo) - Live till old, learn till old (never stop learning)
- **百闻不如一见** (bǎi wén bù rú yī jiàn) - Hearing a hundred times is not as good as seeing once

## Weather & Life Proverbs

- **吃一堑，长一智** (chī yī qiàn, zhǎng yī zhì) - Fall into a pit, gain wisdom (learn from mistakes)
- **功夫不负有心人** (gōngfu bù fù yǒuxīn rén) - Hard work doesn't disappoint the dedicated`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m7",
    moduleTitle: "Chengyu & Idioms",
    order: 21,
    topicId: "zh-advanced-proverbs",
    vocabulary: [
      {
        word: "入乡随俗",
        translation: "when in Rome, do as the Romans do",
        pronunciation: "rù xiāng suí sú",
        exampleSentence: "到了国外要入乡随俗。",
        exampleTranslation: "When abroad, you should follow local customs.",
        partOfSpeech: "idiom",
      },
      {
        word: "百闻不如一见",
        translation: "seeing is believing",
        pronunciation: "bǎi wén bù rú yī jiàn",
        exampleSentence: "百闻不如一见，你应该亲自去看看。",
        exampleTranslation: "Seeing is believing — you should go see for yourself.",
        partOfSpeech: "proverb",
      },
      {
        word: "吃一堑长一智",
        translation: "learn from one's mistakes",
        pronunciation: "chī yī qiàn zhǎng yī zhì",
        exampleSentence: "吃一堑长一智，下次一定要小心。",
        exampleTranslation: "Learn from your mistakes — be careful next time.",
        partOfSpeech: "proverb",
      },
      {
        word: "功夫不负有心人",
        translation: "hard work pays off for the dedicated",
        pronunciation: "gōngfu bù fù yǒuxīn rén",
        exampleSentence: "他终于考上了北大，功夫不负有心人。",
        exampleTranslation: "He finally got into Peking University — hard work pays off.",
        partOfSpeech: "proverb",
      },
    ],
    grammarPoints: [
      {
        title: "Using Proverbs to Conclude Arguments",
        explanation: "Proverbs are powerful rhetorical closers in Chinese. They lend authority to your point by invoking collective wisdom. In debates, essays, and speeches, ending with an apt proverb signals cultural fluency and adds weight.",
        examples: [
          { correct: "所以我认为我们应该坚持下去，毕竟功夫不负有心人。", translation: "So I believe we should persevere — after all, hard work pays off." },
          { correct: "正所谓百闻不如一见，你还是自己去体验一下吧。", translation: "As the saying goes, seeing is believing — you should experience it yourself." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "proverb-advice",
        title: "Giving Advice with Proverbs",
        situation: "A younger student asks for your advice about studying abroad",
        agentRole: "You are a university student named 小海 considering studying abroad. Ask the older student for advice about adapting to a new culture.",
        userGoal: "Give advice about studying abroad using Chinese proverbs naturally",
        targetPhrases: ["入乡随俗", "百闻不如一见", "活到老学到老"],
        successCriteria: ["Uses proverbs in context", "Gives practical advice", "Connects proverbs to real situations"],
      },
    ],
  },
];

// ============================================
// Module 8: Academic Mastery
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "zh-adv-l22",
    slug: "formal-presentations",
    title: "Formal Presentations & Speeches",
    content: `# Formal Presentations & Speeches

Deliver polished presentations in professional and academic Chinese.

## Opening Phrases

- **各位来宾，大家好！** - Distinguished guests, hello!
- **今天我要谈的主题是...** - The topic I'll discuss today is...
- **首先，我想介绍一下背景。** - First, let me introduce some background.

## Transition Phrases

- **接下来** - Next / Moving on
- **换句话说** - In other words
- **综上所述** - In summary / To sum up
- **最后** - Finally / In conclusion

## Closing Phrases

- **谢谢大家的聆听。** - Thank you for listening.
- **欢迎大家提问。** - Questions are welcome.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m8",
    moduleTitle: "Academic Mastery",
    order: 22,
    topicId: "zh-advanced-formal-presentations",
    vocabulary: [
      {
        word: "各位",
        translation: "everyone / all of you (formal address)",
        pronunciation: "gèwèi",
        exampleSentence: "各位同事，下午好！",
        exampleTranslation: "Good afternoon, colleagues!",
        partOfSpeech: "pronoun",
      },
      {
        word: "综上所述",
        translation: "in summary / to sum up",
        pronunciation: "zōng shàng suǒ shù",
        exampleSentence: "综上所述，我们需要调整策略。",
        exampleTranslation: "In summary, we need to adjust our strategy.",
        partOfSpeech: "phrase",
      },
      {
        word: "换句话说",
        translation: "in other words",
        pronunciation: "huàn jù huà shuō",
        exampleSentence: "换句话说，我们需要更多时间。",
        exampleTranslation: "In other words, we need more time.",
        partOfSpeech: "phrase",
      },
      {
        word: "聆听",
        translation: "to listen attentively (formal)",
        pronunciation: "língtīng",
        exampleSentence: "感谢各位的聆听。",
        exampleTranslation: "Thank you all for listening attentively.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Structuring a Formal Presentation",
        explanation: "Chinese presentations follow a clear structure: opening greeting + topic statement + background + main points (首先/其次/最后) + conclusion (综上所述) + closing. Signpost phrases are essential for guiding the audience.",
        examples: [
          { correct: "首先，让我们看一下数据。其次，分析其原因。最后，提出解决方案。", translation: "First, let's look at the data. Second, analyze the causes. Finally, propose solutions." },
          { correct: "综上所述，我们可以得出以下结论。", translation: "In summary, we can draw the following conclusions." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "conference-talk",
        title: "Conference Presentation",
        situation: "You are presenting at an academic conference on urban planning",
        agentRole: "You are the conference moderator named 马教授. Introduce the speaker, then ask challenging questions after the presentation.",
        userGoal: "Deliver a structured presentation using formal academic Chinese",
        targetPhrases: ["各位", "综上所述", "换句话说", "首先...其次...最后"],
        successCriteria: ["Opens formally", "Uses signpost phrases", "Handles Q&A confidently"],
      },
    ],
  },
  {
    id: "zh-adv-l23",
    slug: "academic-writing",
    title: "Academic Writing & Translation",
    content: `# Academic Writing & Translation

Write academic Chinese and develop translation skills between Chinese and English.

## Academic Writing Conventions

- **摘要** (zhāiyào) - abstract
- **论点** (lùndiǎn) - thesis / argument
- **论据** (lùnjù) - evidence / supporting argument
- **引用** (yǐnyòng) - citation / to cite
- **结论** (jiélùn) - conclusion

## Translation Challenges

### Chinese → English
- Four-character expressions have no direct English equivalents
- Topic-comment structures must be restructured into subject-verb-object
- Classical allusions need explanatory context

### English → Chinese
- English passive constructions need careful handling with 被/受到/得到
- Long English sentences should be broken into shorter Chinese sentences
- Technical terms may require transliteration (音译) or meaning-translation (意译)`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m8",
    moduleTitle: "Academic Mastery",
    order: 23,
    topicId: "zh-advanced-academic-writing",
    vocabulary: [
      {
        word: "摘要",
        translation: "abstract (academic)",
        pronunciation: "zhāiyào",
        exampleSentence: "请先阅读论文的摘要。",
        exampleTranslation: "Please read the paper's abstract first.",
        partOfSpeech: "noun",
      },
      {
        word: "论点",
        translation: "thesis / argument",
        pronunciation: "lùndiǎn",
        exampleSentence: "你的论点缺乏足够的论据支持。",
        exampleTranslation: "Your thesis lacks sufficient evidence to support it.",
        partOfSpeech: "noun",
      },
      {
        word: "引用",
        translation: "citation / to cite",
        pronunciation: "yǐnyòng",
        exampleSentence: "请注明引用的出处。",
        exampleTranslation: "Please indicate the source of citations.",
        partOfSpeech: "noun/verb",
      },
      {
        word: "意译",
        translation: "meaning-translation (free translation)",
        pronunciation: "yìyì",
        exampleSentence: "这个术语适合意译而不是音译。",
        exampleTranslation: "This term is better translated by meaning rather than transliteration.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Academic Hedging in Chinese",
        explanation: "Academic Chinese uses hedging to soften claims, similar to English. Key hedging phrases include 似乎 (seemingly), 可能 (possibly), 在一定程度上 (to a certain extent), and 有待进一步研究 (requires further research).",
        examples: [
          { correct: "数据似乎表明这一趋势将持续。", translation: "The data seems to indicate this trend will continue." },
          { correct: "这一结论在一定程度上受到样本量的限制。", translation: "This conclusion is, to a certain extent, limited by sample size." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "thesis-defense",
        title: "Thesis Defense Practice",
        situation: "You are defending your thesis to a panel of professors",
        agentRole: "You are a thesis committee member named 黄教授. Ask probing questions about methodology, evidence, and conclusions. Challenge weak arguments.",
        userGoal: "Defend your thesis using academic vocabulary, hedging language, and evidence-based argumentation",
        targetPhrases: ["论点", "论据", "摘要", "在一定程度上"],
        successCriteria: ["Presents thesis clearly", "Defends with evidence", "Uses academic hedging appropriately"],
      },
    ],
  },
  {
    id: "zh-adv-l24",
    slug: "register-switching-mastery",
    title: "Register Switching Mastery",
    content: `# Register Switching Mastery

The capstone skill: moving fluidly between registers in real-time conversation.

## The Four Registers Revisited

1. **日常口语** - Casual speech (friends, family)
2. **一般正式** - Semi-formal (workplace)
3. **正式书面** - Formal written (business, academic)
4. **文学/古典** - Literary/classical (ceremonies, essays)

## Switching Triggers

- **Audience change**: Boss enters → upgrade register
- **Topic change**: Small talk → business → upgrade
- **Medium change**: Speaking → writing → upgrade
- **Emotional shift**: Calm analysis → passionate argument → may downgrade for emphasis

## Integration Exercise

Take any idea and express it across all four registers. This is the ultimate test of C1 proficiency.`,
    targetLanguage: "zh",
    proficiencyLevel: "C1",
    moduleId: "zh-adv-m8",
    moduleTitle: "Academic Mastery",
    order: 24,
    topicId: "zh-advanced-register-switching",
    vocabulary: [
      {
        word: "灵活运用",
        translation: "to use flexibly / to apply nimbly",
        pronunciation: "línghuó yùnyòng",
        exampleSentence: "学语言要灵活运用，不能死记硬背。",
        exampleTranslation: "Learning a language requires flexible application, not rote memorization.",
        partOfSpeech: "phrase",
      },
      {
        word: "得体",
        translation: "appropriate / proper (behavior/speech)",
        pronunciation: "détǐ",
        exampleSentence: "在正式场合说话要得体。",
        exampleTranslation: "One should speak appropriately in formal settings.",
        partOfSpeech: "adjective",
      },
      {
        word: "场合",
        translation: "occasion / setting",
        pronunciation: "chǎnghé",
        exampleSentence: "不同的场合需要不同的语言风格。",
        exampleTranslation: "Different occasions require different language styles.",
        partOfSpeech: "noun",
      },
      {
        word: "融会贯通",
        translation: "to achieve thorough understanding / to master through integration",
        pronunciation: "róng huì guàn tōng",
        exampleSentence: "学到的知识要融会贯通才能真正掌握。",
        exampleTranslation: "Knowledge must be thoroughly integrated to be truly mastered.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Register Awareness as Grammar",
        explanation: "At C1, register choice IS grammar. Choosing 倘若 over 如果, 本人 over 我, or 予以 over 给 is not just vocabulary — it restructures the entire sentence's tone and social meaning. Master this and you sound truly fluent.",
        examples: [
          { correct: "你要是不来，我就自己去。(口语)", translation: "If you're not coming, I'll go by myself. (casual)" },
          { correct: "倘若贵方无法出席，本公司将自行处理。(书面语)", translation: "Should your party be unable to attend, our company will handle matters independently. (formal)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "full-register-test",
        title: "Full Register Mastery Test",
        situation: "You move through four social situations in one evening: texting a friend, meeting a colleague, giving a toast at a banquet, and writing a thank-you note",
        agentRole: "You are a versatile conversation partner. Play four roles in sequence: a close friend (casual), a business colleague (semi-formal), a banquet host (formal), and an email recipient (written formal). Evaluate the student's register switching.",
        userGoal: "Navigate all four registers in a continuous conversation",
        targetPhrases: ["灵活运用", "得体", "融会贯通"],
        successCriteria: ["Switches registers appropriately", "Matches language to context", "Demonstrates range across all four levels"],
      },
    ],
    culturalNotes: [
      {
        title: "What C1 Means in Chinese Culture",
        content: "Reaching C1 in Chinese means more than grammar and vocabulary — it means being able to read between the lines, understand indirect communication (含蓄 hánxù), use appropriate formality levels, and recognize when someone is being polite versus sincere. Chinese communication values context and relationship dynamics. True fluency is social as much as linguistic.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "zh-adv-m1",
    title: "Module 1: News & Current Events",
    description: "Formal connectors, nominalization, and news analysis",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "zh-adv-m2",
    title: "Module 2: History & Philosophy",
    description: "Confucianism, Daoism, chengyu introduction, and classical Chinese particles",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "zh-adv-m3",
    title: "Module 3: Business & Economics",
    description: "Formal business patterns, e-commerce vocabulary, and correspondence",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "zh-adv-m4",
    title: "Module 4: Science & Environment",
    description: "Complex concession, rhetorical questions, and scientific discourse",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "zh-adv-m5",
    title: "Module 5: Literature & Arts",
    description: "Preference patterns, Tang poetry, and the Four Great Novels",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "zh-adv-m6",
    title: "Module 6: Society & Abstract Topics",
    description: "Topic-comment patterns, complex passive, and register distinctions",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "zh-adv-m7",
    title: "Module 7: Chengyu & Idioms",
    description: "Chengyu with origin stories and Chinese proverbs",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "zh-adv-m8",
    title: "Module 8: Academic Mastery",
    description: "Formal presentations, academic writing, and register switching mastery",
    order: 8,
    lessons: module8Lessons,
  },
];

export const chineseAdvancedCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getChineseAdvancedLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findChineseAdvancedLesson(slug: string) {
  return getChineseAdvancedLessons().find((l) => l.slug === slug);
}
