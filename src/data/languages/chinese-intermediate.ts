// Chinese Intermediate Course Data
// CEFR B1 Level - HSK3-4, Expanding Grammar & Real-Life Topics

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "chinese-intermediate",
  slug: "chinese-intermediate",
  title: "Mandarin Chinese B1 - Intermediate",
  language: "zh",
  languageName: "Mandarin Chinese",
  proficiencyLevel: "B1" as const,
  description:
    "Expand your Mandarin with complex grammar structures, real-life topics, and cultural fluency. Covers HSK3-4 vocabulary, compound sentences, complements, and the 把 construction.",
  targetAudience:
    "Learners who have completed beginner Chinese and can handle basic conversations",
  estimatedHours: 100,
  icon: "🇨🇳",
  prerequisiteCourseSlug: "chinese-beginner",
  nextCourseSlug: "chinese-advanced",
};

// ============================================
// Module 1: School & Education
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l1",
    slug: "cause-and-effect",
    title: "Because & Therefore",
    content: `# 因为...所以 — Because...Therefore

Express cause and effect clearly in Chinese.

## Pattern

**因为 (yīnwèi)...所以 (suǒyǐ)...** — Because...therefore...

In Chinese, the cause comes first with 因为, and the result follows with 所以. You can drop either half if context is clear.

## Academic Subjects

- **数学** (shùxué) — mathematics
- **历史** (lìshǐ) — history
- **科学** (kēxué) — science
- **英语** (yīngyǔ) — English`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m1",
    moduleTitle: "School & Education",
    order: 1,
    topicId: "zh-intermediate-cause-and-effect",
    vocabulary: [
      {
        word: "因为",
        translation: "because",
        pronunciation: "yīnwèi",
        exampleSentence: "因为下雨了，所以我没去。",
        exampleTranslation: "Because it rained, I didn't go.",
        partOfSpeech: "conjunction",
      },
      {
        word: "所以",
        translation: "therefore",
        pronunciation: "suǒyǐ",
        exampleSentence: "他很忙，所以没来。",
        exampleTranslation: "He was busy, so he didn't come.",
        partOfSpeech: "conjunction",
      },
      {
        word: "数学",
        translation: "mathematics",
        pronunciation: "shùxué",
        exampleSentence: "我最喜欢数学课。",
        exampleTranslation: "I like math class the most.",
        partOfSpeech: "noun",
      },
      {
        word: "考试",
        translation: "exam",
        pronunciation: "kǎoshì",
        exampleSentence: "明天有一个考试。",
        exampleTranslation: "There is an exam tomorrow.",
        partOfSpeech: "noun",
      },
      {
        word: "成绩",
        translation: "grades / results",
        pronunciation: "chéngjì",
        exampleSentence: "她的成绩很好。",
        exampleTranslation: "Her grades are very good.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "因为...所以 (Because...Therefore)",
        explanation:
          "This paired conjunction expresses cause and effect. 因为 introduces the reason, 所以 introduces the result. Either half can be omitted when context is clear, but never use both 因为 and 所以 with 但是.",
        examples: [
          {
            correct: "因为他生病了，所以没来上课。",
            translation: "Because he was sick, he didn't come to class.",
          },
          {
            correct: "我迟到了，因为路上堵车。",
            translation: "I was late because there was traffic.",
            note: "所以 omitted — result stated first",
          },
        ],
        commonMistakes: [
          {
            incorrect: "因为他生病了，但是没来上课。",
            correction: "因为他生病了，所以没来上课。",
            explanation:
              "Do not mix 因为 with 但是 (but). Use 所以 for the result clause.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "school-excuse",
        title: "Explaining an Absence",
        situation: "You missed class yesterday and your teacher asks why.",
        agentRole:
          "You are 王老师 (Wáng lǎoshī), a Chinese teacher. Ask the student why they were absent and follow up.",
        userGoal:
          "Explain why you missed class using 因为...所以 and ask about homework",
        targetPhrases: [
          "因为...所以...",
          "作业",
          "对不起",
          "考试",
        ],
        successCriteria: [
          "Uses 因为...所以 correctly",
          "Gives a reason for absence",
          "Asks about missed work",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Education in Chinese Culture",
        content:
          "Education (教育 jiàoyù) holds a central place in Chinese culture, rooted in Confucian values. The 高考 (gāokǎo), China's national college entrance exam, is one of the most important events in a student's life. Respect for teachers (尊师重道 zūnshī zhòngdào) is deeply embedded.",
      },
    ],
  },
  {
    id: "zh-int-l2",
    slug: "although-but",
    title: "Although...But",
    content: `# 虽然...但是 — Although...But

Express contrast and concession in Chinese.

## Pattern

**虽然 (suīrán)...但是 (dànshì)...** — Although...but...

Unlike English, Chinese uses BOTH "although" and "but" in the same sentence. This is required, not redundant.

## School Life Vocabulary

- **功课** (gōngkè) — homework / schoolwork
- **老师** (lǎoshī) — teacher
- **同学** (tóngxué) — classmate`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m1",
    moduleTitle: "School & Education",
    order: 2,
    topicId: "zh-intermediate-although-but",
    vocabulary: [
      {
        word: "虽然",
        translation: "although",
        pronunciation: "suīrán",
        exampleSentence: "虽然很难，但是我会努力。",
        exampleTranslation: "Although it's hard, I will work hard.",
        partOfSpeech: "conjunction",
      },
      {
        word: "但是",
        translation: "but / however",
        pronunciation: "dànshì",
        exampleSentence: "我想去，但是没有时间。",
        exampleTranslation: "I want to go, but I don't have time.",
        partOfSpeech: "conjunction",
      },
      {
        word: "功课",
        translation: "homework",
        pronunciation: "gōngkè",
        exampleSentence: "今天的功课很多。",
        exampleTranslation: "There is a lot of homework today.",
        partOfSpeech: "noun",
      },
      {
        word: "努力",
        translation: "to work hard",
        pronunciation: "nǔlì",
        exampleSentence: "他学习很努力。",
        exampleTranslation: "He studies very hard.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "虽然...但是 (Although...But)",
        explanation:
          "In Chinese, both halves of this structure are typically used together. The 虽然 clause states the concession, and the 但是 clause states the contrasting fact. 可是 or 不过 can replace 但是.",
        examples: [
          {
            correct: "虽然他很年轻，但是很有经验。",
            translation: "Although he is young, he is very experienced.",
          },
          {
            correct: "虽然考试很难，但是大家都通过了。",
            translation: "Although the exam was hard, everyone passed.",
          },
        ],
        commonMistakes: [
          {
            incorrect: "虽然他很聪明，所以成绩很好。",
            correction: "虽然他很聪明，但是成绩不好。/ 因为他很聪明，所以成绩很好。",
            explanation:
              "Do not pair 虽然 with 所以. Use 但是 for contrast, or switch to 因为...所以 for cause-effect.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "study-discussion",
        title: "Discussing a Difficult Subject",
        situation:
          "You are talking to a classmate about a subject you find difficult but interesting.",
        agentRole:
          "You are 小明 (Xiǎo Míng), a classmate. Discuss your favorite and least favorite subjects.",
        userGoal:
          "Express contrast using 虽然...但是 while discussing school subjects",
        targetPhrases: [
          "虽然...但是...",
          "数学",
          "有意思",
          "难",
        ],
        successCriteria: [
          "Uses 虽然...但是 correctly",
          "Names school subjects",
          "Expresses opinion about difficulty",
        ],
      },
    ],
  },
  {
    id: "zh-int-l3",
    slug: "if-then",
    title: "If...Then",
    content: `# 如果...就 — If...Then

Express conditions and hypotheticals.

## Pattern

**如果 (rúguǒ)...就 (jiù)...** — If...then...

如果 introduces the condition, and 就 marks the result. 就 goes before the verb in the result clause.

## More Academic Vocabulary

- **毕业** (bìyè) — to graduate
- **专业** (zhuānyè) — major / specialty
- **奖学金** (jiǎngxuéjīn) — scholarship`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m1",
    moduleTitle: "School & Education",
    order: 3,
    topicId: "zh-intermediate-if-then",
    vocabulary: [
      {
        word: "如果",
        translation: "if",
        pronunciation: "rúguǒ",
        exampleSentence: "如果明天下雨，我们就不去了。",
        exampleTranslation: "If it rains tomorrow, we won't go.",
        partOfSpeech: "conjunction",
      },
      {
        word: "就",
        translation: "then / right away",
        pronunciation: "jiù",
        exampleSentence: "你来了我就走。",
        exampleTranslation: "When you come, I'll leave.",
        partOfSpeech: "adverb",
      },
      {
        word: "毕业",
        translation: "to graduate",
        pronunciation: "bìyè",
        exampleSentence: "他明年就要毕业了。",
        exampleTranslation: "He is going to graduate next year.",
        partOfSpeech: "verb",
      },
      {
        word: "专业",
        translation: "major / specialty",
        pronunciation: "zhuānyè",
        exampleSentence: "你的专业是什么？",
        exampleTranslation: "What is your major?",
        partOfSpeech: "noun",
      },
      {
        word: "奖学金",
        translation: "scholarship",
        pronunciation: "jiǎngxuéjīn",
        exampleSentence: "如果成绩好，就能拿奖学金。",
        exampleTranslation:
          "If your grades are good, you can get a scholarship.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "如果...就 (If...Then)",
        explanation:
          "如果 introduces the condition and is placed before the subject or after it. 就 appears in the result clause, directly before the verb. 的话 can optionally follow the condition clause for emphasis.",
        examples: [
          {
            correct: "如果你有时间，就来找我吧。",
            translation: "If you have time, then come find me.",
          },
          {
            correct: "如果不努力学习的话，就不能毕业。",
            translation:
              "If you don't study hard, you won't be able to graduate.",
            note: "的话 adds emphasis to the condition",
          },
        ],
      },
      {
        title: "就 Placement",
        explanation:
          "就 always goes before the main verb in the result clause, after the subject and any time/manner adverbs.",
        examples: [
          {
            correct: "我就去。",
            translation: "I'll go right away.",
          },
          {
            correct: "他明天就回来。",
            translation: "He'll be back tomorrow (sooner than expected).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "career-planning",
        title: "Planning After Graduation",
        situation:
          "You are discussing future plans with a friend after graduation.",
        agentRole:
          "You are 李华 (Lǐ Huá), a university student. Discuss what you'll do if you pass or fail exams, and your career plans.",
        userGoal: "Discuss hypothetical plans using 如果...就",
        targetPhrases: [
          "如果...就...",
          "毕业",
          "工作",
          "专业",
        ],
        successCriteria: [
          "Uses 如果...就 at least twice",
          "Discusses future plans",
          "Responds to follow-up questions",
        ],
      },
    ],
  },
];

// ============================================
// Module 2: Weather & Seasons
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l4",
    slug: "comparisons",
    title: "Making Comparisons",
    content: `# 比 Expanded — Making Comparisons

Go beyond simple comparisons with detailed structures.

## Patterns

- **A 比 B + adj** — A is more [adj] than B
- **A 比 B + adj + 得多 / 多了** — A is much more [adj] than B
- **A 比 B + adj + 一点儿** — A is a little more [adj] than B

## Weather Vocabulary

- **天气** (tiānqì) — weather
- **温度** (wēndù) — temperature
- **冷** (lěng) — cold
- **热** (rè) — hot
- **凉快** (liángkuai) — cool / pleasantly cool`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m2",
    moduleTitle: "Weather & Seasons",
    order: 4,
    topicId: "zh-intermediate-comparisons",
    vocabulary: [
      {
        word: "天气",
        translation: "weather",
        pronunciation: "tiānqì",
        exampleSentence: "今天天气怎么样？",
        exampleTranslation: "How is the weather today?",
        partOfSpeech: "noun",
      },
      {
        word: "温度",
        translation: "temperature",
        pronunciation: "wēndù",
        exampleSentence: "今天温度比昨天高。",
        exampleTranslation: "Today's temperature is higher than yesterday's.",
        partOfSpeech: "noun",
      },
      {
        word: "凉快",
        translation: "cool / pleasantly cool",
        pronunciation: "liángkuai",
        exampleSentence: "秋天很凉快。",
        exampleTranslation: "Autumn is pleasantly cool.",
        partOfSpeech: "adjective",
      },
      {
        word: "比",
        translation: "compared to / than",
        pronunciation: "bǐ",
        exampleSentence: "北京比上海冷。",
        exampleTranslation: "Beijing is colder than Shanghai.",
        partOfSpeech: "preposition",
      },
    ],
    grammarPoints: [
      {
        title: "比 Comparisons — Expanded",
        explanation:
          "The basic 比 comparison can be modified with degree words. Use 得多/多了 for 'much more,' 一点儿 for 'a little more.' Never use 很 before the adjective in a 比 comparison.",
        examples: [
          {
            correct: "今天比昨天冷得多。",
            translation: "Today is much colder than yesterday.",
          },
          {
            correct: "春天比冬天暖和一点儿。",
            translation: "Spring is a little warmer than winter.",
          },
        ],
        commonMistakes: [
          {
            incorrect: "今天比昨天很冷。",
            correction: "今天比昨天冷。",
            explanation:
              "Never use 很 in a 比 sentence. The comparison itself implies degree.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weather-chat",
        title: "Comparing the Weather",
        situation:
          "You are chatting with a friend about weather in different cities.",
        agentRole:
          "You are 小红 (Xiǎo Hóng), from Harbin. Compare the weather in your city with the student's city.",
        userGoal: "Compare weather between two places using 比 structures",
        targetPhrases: [
          "比...冷",
          "比...热得多",
          "天气",
          "温度",
        ],
        successCriteria: [
          "Uses 比 correctly",
          "Adds degree modifiers (得多, 一点儿)",
          "Discusses weather naturally",
        ],
      },
    ],
  },
  {
    id: "zh-int-l5",
    slug: "same-and-similar",
    title: "Same & Similar",
    content: `# 跟...一样 & 越来越 — Same, Similar, and Changing

## Patterns

- **A 跟 B 一样 + adj** — A is the same as B
- **A 跟 B 不一样** — A and B are different
- **越来越 + adj** — more and more [adj]

## Seasons Vocabulary

- **春天** (chūntiān) — spring
- **夏天** (xiàtiān) — summer
- **秋天** (qiūtiān) — autumn
- **冬天** (dōngtiān) — winter`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m2",
    moduleTitle: "Weather & Seasons",
    order: 5,
    topicId: "zh-intermediate-same-and-similar",
    vocabulary: [
      {
        word: "一样",
        translation: "same / alike",
        pronunciation: "yīyàng",
        exampleSentence: "这两件衣服一样大。",
        exampleTranslation: "These two pieces of clothing are the same size.",
        partOfSpeech: "adjective",
      },
      {
        word: "春天",
        translation: "spring",
        pronunciation: "chūntiān",
        exampleSentence: "春天的花很漂亮。",
        exampleTranslation: "The flowers in spring are beautiful.",
        partOfSpeech: "noun",
      },
      {
        word: "夏天",
        translation: "summer",
        pronunciation: "xiàtiān",
        exampleSentence: "夏天越来越热了。",
        exampleTranslation: "Summer is getting hotter and hotter.",
        partOfSpeech: "noun",
      },
      {
        word: "秋天",
        translation: "autumn",
        pronunciation: "qiūtiān",
        exampleSentence: "秋天跟春天一样凉快。",
        exampleTranslation: "Autumn is as cool as spring.",
        partOfSpeech: "noun",
      },
      {
        word: "越来越",
        translation: "more and more",
        pronunciation: "yuè lái yuè",
        exampleSentence: "天气越来越冷了。",
        exampleTranslation: "The weather is getting colder and colder.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "跟...一样 (Same As)",
        explanation:
          "A 跟 B 一样 means A is the same as B. Add an adjective after 一样 to specify in what way they are the same. Negate with 不 before 一样.",
        examples: [
          {
            correct: "他跟我一样高。",
            translation: "He is as tall as I am.",
          },
          {
            correct: "今天跟昨天不一样。",
            translation: "Today is different from yesterday.",
          },
        ],
      },
      {
        title: "越来越 (More and More)",
        explanation:
          "越来越 + adjective/verb expresses a progressive change. It describes something becoming more and more of a quality over time.",
        examples: [
          {
            correct: "他的中文越来越好了。",
            translation: "His Chinese is getting better and better.",
          },
          {
            correct: "冬天越来越近了。",
            translation: "Winter is getting closer and closer.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "seasons-compare",
        title: "Favorite Season",
        situation: "Discussing your favorite season and seasonal changes.",
        agentRole:
          "You are 张伟 (Zhāng Wěi). Talk about which seasons you like and how the climate is changing.",
        userGoal:
          "Compare seasons using 跟...一样 and describe changes with 越来越",
        targetPhrases: [
          "跟...一样",
          "越来越",
          "春天",
          "冬天",
        ],
        successCriteria: [
          "Uses 跟...一样 at least once",
          "Uses 越来越 at least once",
          "Discusses seasons naturally",
        ],
      },
    ],
  },
  {
    id: "zh-int-l6",
    slug: "degree-complements",
    title: "Degree Complements with 得",
    content: `# Degree Complements with 得

Describe how well or to what degree an action is performed.

## Pattern

**Verb + 得 + description** — describes the manner or degree of the action

## Weather Description Vocabulary

- **刮风** (guā fēng) — to be windy
- **下雪** (xià xuě) — to snow
- **下雨** (xià yǔ) — to rain
- **晴天** (qíngtiān) — sunny day`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m2",
    moduleTitle: "Weather & Seasons",
    order: 6,
    topicId: "zh-intermediate-degree-complements",
    vocabulary: [
      {
        word: "刮风",
        translation: "to be windy",
        pronunciation: "guā fēng",
        exampleSentence: "外面刮风刮得很大。",
        exampleTranslation: "It's very windy outside.",
        partOfSpeech: "verb",
      },
      {
        word: "下雪",
        translation: "to snow",
        pronunciation: "xià xuě",
        exampleSentence: "昨天下雪下得很大。",
        exampleTranslation: "It snowed heavily yesterday.",
        partOfSpeech: "verb",
      },
      {
        word: "下雨",
        translation: "to rain",
        pronunciation: "xià yǔ",
        exampleSentence: "今天雨下得不大。",
        exampleTranslation: "It's not raining heavily today.",
        partOfSpeech: "verb",
      },
      {
        word: "晴天",
        translation: "sunny day",
        pronunciation: "qíngtiān",
        exampleSentence: "明天是晴天。",
        exampleTranslation: "Tomorrow will be sunny.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Degree Complements with 得",
        explanation:
          "Place 得 after a verb to add a description of how the action is done. If the verb has an object, repeat the verb or move the object before the verb. The complement after 得 can be an adjective, phrase, or clause.",
        examples: [
          {
            correct: "她说中文说得很流利。",
            translation: "She speaks Chinese very fluently.",
            note: "Verb repeated because 中文 is the object",
          },
          {
            correct: "他跑得很快。",
            translation: "He runs very fast.",
          },
          {
            correct: "雨下得不大。",
            translation: "It's not raining hard.",
          },
        ],
        commonMistakes: [
          {
            incorrect: "她说中文得很好。",
            correction: "她说中文说得很好。/ 她中文说得很好。",
            explanation:
              "When a verb has an object, you must repeat the verb before 得 or move the object before the verb.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weather-report",
        title: "Describing Today's Weather",
        situation: "A friend is calling to ask about the weather in your city.",
        agentRole:
          "You are 小丽 (Xiǎo Lì), calling from another city. Ask about the weather and plan a visit.",
        userGoal:
          "Describe weather conditions using degree complements with 得",
        targetPhrases: [
          "下雨下得...",
          "刮风刮得...",
          "很大",
          "不太冷",
        ],
        successCriteria: [
          "Uses V得 complement at least twice",
          "Describes weather conditions",
          "Gives advice about visiting",
        ],
      },
    ],
  },
];

// ============================================
// Module 3: Health
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l7",
    slug: "ba-construction-intro",
    title: "The 把 Construction — Introduction",
    content: `# 把 Construction — Introduction

Handle and manipulate objects with the 把 sentence.

## Pattern

**Subject + 把 + Object + Verb + Complement** — The subject does something to the object

The 把 construction emphasizes what happens to the object. The verb must have a complement or result — it cannot stand alone.

## Health Vocabulary

- **药** (yào) — medicine
- **医生** (yīshēng) — doctor
- **医院** (yīyuàn) — hospital
- **身体** (shēntǐ) — body / health`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m3",
    moduleTitle: "Health",
    order: 7,
    topicId: "zh-intermediate-ba-construction-intro",
    vocabulary: [
      {
        word: "把",
        translation: "(object marker)",
        pronunciation: "bǎ",
        exampleSentence: "请把门关上。",
        exampleTranslation: "Please close the door.",
        partOfSpeech: "preposition",
      },
      {
        word: "药",
        translation: "medicine",
        pronunciation: "yào",
        exampleSentence: "你把药吃了吗？",
        exampleTranslation: "Did you take the medicine?",
        partOfSpeech: "noun",
      },
      {
        word: "医生",
        translation: "doctor",
        pronunciation: "yīshēng",
        exampleSentence: "医生让我多休息。",
        exampleTranslation: "The doctor told me to rest more.",
        partOfSpeech: "noun",
      },
      {
        word: "身体",
        translation: "body / health",
        pronunciation: "shēntǐ",
        exampleSentence: "你的身体怎么样？",
        exampleTranslation: "How is your health?",
        partOfSpeech: "noun",
      },
      {
        word: "医院",
        translation: "hospital",
        pronunciation: "yīyuàn",
        exampleSentence: "他去医院看病了。",
        exampleTranslation: "He went to the hospital to see a doctor.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "把 Construction — Basics",
        explanation:
          "The 把 construction moves the object before the verb to emphasize what happens to it. The verb MUST have a complement (result, direction, 了, etc.) — a bare verb is not allowed after 把. Use 把 when the action causes a change of state or location.",
        examples: [
          {
            correct: "请把窗户打开。",
            translation: "Please open the window.",
            note: "打开 = result complement (open)",
          },
          {
            correct: "他把药吃了。",
            translation: "He took the medicine.",
            note: "了 = completion",
          },
        ],
        commonMistakes: [
          {
            incorrect: "他把药吃。",
            correction: "他把药吃了。",
            explanation:
              "The verb after 把 cannot stand alone. Add a complement like 了, 完, or a result.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "doctor-visit",
        title: "At the Doctor's Office",
        situation: "You are at a Chinese clinic describing your symptoms.",
        agentRole:
          "You are Dr. 陈 (Chén yīshēng). Ask the patient about symptoms, give instructions using 把.",
        userGoal:
          "Describe symptoms and understand instructions that use 把",
        targetPhrases: [
          "把药吃了",
          "身体",
          "不舒服",
          "头疼",
        ],
        successCriteria: [
          "Describes symptoms",
          "Understands 把 instructions",
          "Asks follow-up health questions",
        ],
      },
    ],
  },
  {
    id: "zh-int-l8",
    slug: "result-complements",
    title: "Result Complements",
    content: `# Result Complements — 好/完/到/见

Indicate the result or outcome of an action.

## Common Result Complements

- **V + 好** — done well / completed properly
- **V + 完** — finished completely
- **V + 到** — achieved / reached
- **V + 见** — perceived (heard, seen)

## Health Action Vocabulary

- **检查** (jiǎnchá) — to examine / check-up
- **休息** (xiūxi) — to rest
- **锻炼** (duànliàn) — to exercise`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m3",
    moduleTitle: "Health",
    order: 8,
    topicId: "zh-intermediate-result-complements",
    vocabulary: [
      {
        word: "检查",
        translation: "to examine / check-up",
        pronunciation: "jiǎnchá",
        exampleSentence: "医生帮我检查了身体。",
        exampleTranslation: "The doctor gave me a check-up.",
        partOfSpeech: "verb",
      },
      {
        word: "休息",
        translation: "to rest",
        pronunciation: "xiūxi",
        exampleSentence: "你应该好好休息。",
        exampleTranslation: "You should rest well.",
        partOfSpeech: "verb",
      },
      {
        word: "锻炼",
        translation: "to exercise",
        pronunciation: "duànliàn",
        exampleSentence: "每天锻炼对身体好。",
        exampleTranslation: "Exercising every day is good for your health.",
        partOfSpeech: "verb",
      },
      {
        word: "感冒",
        translation: "cold (illness)",
        pronunciation: "gǎnmào",
        exampleSentence: "我感冒了，头疼。",
        exampleTranslation: "I have a cold and a headache.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Result Complements (好/完/到/见)",
        explanation:
          "Result complements attach to verbs to show the outcome of an action. 好 = satisfactorily done; 完 = completely finished; 到 = successfully reached/achieved; 见 = perceived by senses. Negate with 没 (not 不) for completed actions.",
        examples: [
          {
            correct: "作业做完了。",
            translation: "The homework is finished.",
          },
          {
            correct: "我听见了你说的话。",
            translation: "I heard what you said.",
          },
          {
            correct: "饭做好了，快来吃！",
            translation: "The food is ready, come eat!",
          },
          {
            correct: "我找到了那家医院。",
            translation: "I found that hospital.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "health-checkup",
        title: "After a Health Check-up",
        situation:
          "You are discussing your health check-up results with a friend.",
        agentRole:
          "You are 王芳 (Wáng Fāng), a concerned friend. Ask about the check-up and give health advice.",
        userGoal:
          "Describe check-up results using result complements",
        targetPhrases: [
          "检查完了",
          "找到",
          "看好",
          "休息好",
        ],
        successCriteria: [
          "Uses result complements naturally",
          "Discusses health topics",
          "Responds to advice",
        ],
      },
    ],
  },
  {
    id: "zh-int-l9",
    slug: "change-of-state-le",
    title: "了 as Change of State",
    content: `# 了 — Change of State

Express that a new situation has come about.

## Pattern

**Sentence + 了** — indicates a new state or changed circumstance

This is different from verb 了 (completion). Sentence-final 了 signals that something is NOW the case, whereas before it wasn't.

## Health Status Vocabulary

- **胖** (pàng) — fat / overweight
- **瘦** (shòu) — thin
- **好** (hǎo) — well / recovered
- **舒服** (shūfu) — comfortable`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m3",
    moduleTitle: "Health",
    order: 9,
    topicId: "zh-intermediate-change-of-state-le",
    vocabulary: [
      {
        word: "胖",
        translation: "fat / overweight",
        pronunciation: "pàng",
        exampleSentence: "他最近胖了。",
        exampleTranslation: "He has gained weight recently.",
        partOfSpeech: "adjective",
      },
      {
        word: "瘦",
        translation: "thin",
        pronunciation: "shòu",
        exampleSentence: "你瘦了！",
        exampleTranslation: "You've lost weight!",
        partOfSpeech: "adjective",
      },
      {
        word: "舒服",
        translation: "comfortable",
        pronunciation: "shūfu",
        exampleSentence: "吃了药以后舒服多了。",
        exampleTranslation: "I feel much better after taking the medicine.",
        partOfSpeech: "adjective",
      },
      {
        word: "发烧",
        translation: "to have a fever",
        pronunciation: "fā shāo",
        exampleSentence: "他不发烧了。",
        exampleTranslation: "He no longer has a fever.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Sentence-Final 了 (Change of State)",
        explanation:
          "Sentence-final 了 indicates a new situation. It marks a CHANGE — something is now different from before. Contrast with verb 了 (after the verb), which marks completion. Often both appear together: 他吃了饭了 (He has eaten — new state: he's no longer hungry).",
        examples: [
          {
            correct: "他好了。",
            translation: "He's recovered. (Was sick, now well)",
          },
          {
            correct: "天气冷了。",
            translation:
              "It's gotten cold. (Was warm before, now it's cold)",
          },
          {
            correct: "我不想吃了。",
            translation:
              "I don't want to eat anymore. (Changed my mind)",
          },
        ],
        commonMistakes: [
          {
            incorrect: "他好。(when meaning recovery)",
            correction: "他好了。",
            explanation:
              "Without 了, this is a general statement. Add 了 to show change of state (he has gotten better).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "recovery-update",
        title: "Checking on a Sick Friend",
        situation:
          "Your friend was sick last week. You call to check on them.",
        agentRole:
          "You are 大明 (Dà Míng), recovering from a cold. Describe how you feel now vs. before.",
        userGoal:
          "Ask about recovery and understand change-of-state descriptions",
        targetPhrases: [
          "好了",
          "不发烧了",
          "舒服多了",
          "瘦了",
        ],
        successCriteria: [
          "Understands change-of-state 了",
          "Asks about health changes",
          "Shows concern appropriately",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Traditional Chinese Medicine",
        content:
          "中医 (zhōngyī, Traditional Chinese Medicine) is widely practiced alongside Western medicine in China. Concepts like 上火 (shànghuǒ, internal heat) and 凉 (liáng, cooling foods) influence everyday health discussions. Don't be surprised if a Chinese friend suggests drinking hot water (多喝热水 duō hē rè shuǐ) as a cure-all!",
      },
    ],
  },
];

// ============================================
// Module 4: Housing
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l10",
    slug: "directional-complements",
    title: "Directional Complements",
    content: `# Directional Complements — 上来/下去/出来

Add direction to your verbs.

## Simple Directional Complements

- **来** (lái) — toward the speaker
- **去** (qù) — away from the speaker

## Compound Directional Complements

- **上来** (shànglái) — come up
- **下去** (xiàqù) — go down
- **出来** (chūlái) — come out
- **进去** (jìnqù) — go in
- **回来** (huílái) — come back

## Housing Vocabulary

- **楼** (lóu) — building / floor
- **房间** (fángjiān) — room
- **客厅** (kètīng) — living room`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m4",
    moduleTitle: "Housing",
    order: 10,
    topicId: "zh-intermediate-directional-complements",
    vocabulary: [
      {
        word: "楼",
        translation: "building / floor",
        pronunciation: "lóu",
        exampleSentence: "我住在三楼。",
        exampleTranslation: "I live on the third floor.",
        partOfSpeech: "noun",
      },
      {
        word: "房间",
        translation: "room",
        pronunciation: "fángjiān",
        exampleSentence: "这个房间很大。",
        exampleTranslation: "This room is very big.",
        partOfSpeech: "noun",
      },
      {
        word: "客厅",
        translation: "living room",
        pronunciation: "kètīng",
        exampleSentence: "请到客厅坐。",
        exampleTranslation: "Please sit in the living room.",
        partOfSpeech: "noun",
      },
      {
        word: "搬",
        translation: "to move (residence)",
        pronunciation: "bān",
        exampleSentence: "我们下个月搬家。",
        exampleTranslation: "We're moving next month.",
        partOfSpeech: "verb",
      },
      {
        word: "电梯",
        translation: "elevator",
        pronunciation: "diàntī",
        exampleSentence: "坐电梯上去吧。",
        exampleTranslation: "Let's take the elevator up.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Directional Complements",
        explanation:
          "Directional complements attach to verbs to show the direction of movement relative to the speaker. 来 = toward speaker, 去 = away from speaker. Compound forms: 上来/上去, 下来/下去, 进来/进去, 出来/出去, 回来/回去. If the verb has an object that is a place, the object goes between the two parts: 走进教室来.",
        examples: [
          {
            correct: "请你上来！",
            translation: "Please come up!",
          },
          {
            correct: "他走出去了。",
            translation: "He walked out (away from speaker).",
          },
          {
            correct: "把东西搬进房间来。",
            translation: "Move the things into the room (toward speaker).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "apartment-tour",
        title: "Showing Your New Apartment",
        situation: "A friend is visiting your new apartment for the first time.",
        agentRole:
          "You are 小刚 (Xiǎo Gāng), visiting a friend's new apartment. Ask about the rooms and location.",
        userGoal:
          "Give a tour of your apartment using directional complements",
        targetPhrases: [
          "上来",
          "进来",
          "出去",
          "客厅",
          "房间",
        ],
        successCriteria: [
          "Uses directional complements naturally",
          "Describes apartment layout",
          "Gives directions within the space",
        ],
      },
    ],
  },
  {
    id: "zh-int-l11",
    slug: "existential-sentences",
    title: "Existential 有/是 and Describing Spaces",
    content: `# Existential 有/是 — Describing What's Where

Describe the contents and layout of spaces.

## Patterns

- **Place + 有 + thing** — There is [thing] at [place]
- **Place + 是 + thing** — [Place] is [thing] (identification)
- **Place + V + 着 + thing** — [Thing] is V-ing at [place] (static state)

## Home Furnishing Vocabulary

- **沙发** (shāfā) — sofa
- **桌子** (zhuōzi) — table
- **厨房** (chúfáng) — kitchen
- **阳台** (yángtái) — balcony`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m4",
    moduleTitle: "Housing",
    order: 11,
    topicId: "zh-intermediate-existential-sentences",
    vocabulary: [
      {
        word: "沙发",
        translation: "sofa",
        pronunciation: "shāfā",
        exampleSentence: "客厅里有一个大沙发。",
        exampleTranslation: "There is a big sofa in the living room.",
        partOfSpeech: "noun",
      },
      {
        word: "厨房",
        translation: "kitchen",
        pronunciation: "chúfáng",
        exampleSentence: "厨房在左边。",
        exampleTranslation: "The kitchen is on the left.",
        partOfSpeech: "noun",
      },
      {
        word: "阳台",
        translation: "balcony",
        pronunciation: "yángtái",
        exampleSentence: "阳台上放着花。",
        exampleTranslation: "There are flowers on the balcony.",
        partOfSpeech: "noun",
      },
      {
        word: "旁边",
        translation: "beside / next to",
        pronunciation: "pángbiān",
        exampleSentence: "桌子旁边有一把椅子。",
        exampleTranslation: "There is a chair beside the table.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Existential 有 vs. 是",
        explanation:
          "Place + 有 introduces the existence of something at a location. Place + 是 identifies or characterizes a location. Use 有 for 'there is/are,' use 是 for 'it is.'",
        examples: [
          {
            correct: "桌子上有一本书。",
            translation: "There is a book on the table.",
          },
          {
            correct: "桌子上是我的书。",
            translation: "What's on the table is my book.",
            note: "是 identifies the specific item",
          },
        ],
      },
      {
        title: "着 for Continuous State",
        explanation:
          "V + 着 describes a continuous state resulting from an action. It indicates something is currently in that state, not that the action is happening right now.",
        examples: [
          {
            correct: "门开着。",
            translation: "The door is open. (state, not action)",
          },
          {
            correct: "墙上挂着一幅画。",
            translation: "A painting is hanging on the wall.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-home",
        title: "Describing Your Home to a Friend",
        situation:
          "Your friend is asking about your new apartment over the phone.",
        agentRole:
          "You are 美美 (Měiměi), curious about your friend's new place. Ask about rooms, furniture, and the neighborhood.",
        userGoal:
          "Describe your home's layout and contents using existential sentences",
        targetPhrases: [
          "有...",
          "...放着...",
          "旁边",
          "厨房",
        ],
        successCriteria: [
          "Uses 有 for existence",
          "Uses 着 for static descriptions",
          "Describes multiple rooms",
        ],
      },
    ],
  },
  {
    id: "zh-int-l12",
    slug: "zhe-continuous",
    title: "着 — Actions in Progress and Manner",
    content: `# 着 — Ongoing State and Manner

Use 着 for actions in progress and to describe manner.

## Patterns

- **V + 着** — ongoing state (the door is open)
- **V1 + 着 + V2** — doing V2 while in state of V1

## Living Situation Vocabulary

- **租** (zū) — to rent
- **房租** (fángzū) — rent (cost)
- **邻居** (línjū) — neighbor
- **安静** (ānjìng) — quiet`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m4",
    moduleTitle: "Housing",
    order: 12,
    topicId: "zh-intermediate-zhe-continuous",
    vocabulary: [
      {
        word: "租",
        translation: "to rent",
        pronunciation: "zū",
        exampleSentence: "我在这儿租了一间房。",
        exampleTranslation: "I rented a room here.",
        partOfSpeech: "verb",
      },
      {
        word: "房租",
        translation: "rent (cost)",
        pronunciation: "fángzū",
        exampleSentence: "这里的房租越来越贵了。",
        exampleTranslation: "The rent here is getting more and more expensive.",
        partOfSpeech: "noun",
      },
      {
        word: "邻居",
        translation: "neighbor",
        pronunciation: "línjū",
        exampleSentence: "我的邻居很友好。",
        exampleTranslation: "My neighbors are very friendly.",
        partOfSpeech: "noun",
      },
      {
        word: "安静",
        translation: "quiet",
        pronunciation: "ānjìng",
        exampleSentence: "这个小区很安静。",
        exampleTranslation: "This residential area is very quiet.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "V1着V2 — Simultaneous Actions",
        explanation:
          "V1着 describes a manner or accompanying state while V2 is the main action. The first verb sets the scene or posture, and the second verb is what the person is actually doing.",
        examples: [
          {
            correct: "他站着吃饭。",
            translation: "He eats while standing.",
          },
          {
            correct: "她笑着说。",
            translation: "She said with a smile. (Smiling, she spoke.)",
          },
          {
            correct: "别躺着看书，对眼睛不好。",
            translation:
              "Don't read while lying down, it's bad for your eyes.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "apartment-hunting",
        title: "Looking for an Apartment",
        situation: "You are asking a rental agent about available apartments.",
        agentRole:
          "You are a rental agent 刘先生 (Liú xiānsheng). Show apartments and describe features using 着 for current states.",
        userGoal:
          "Ask about apartments, describe your needs, understand descriptions with 着",
        targetPhrases: [
          "开着",
          "放着",
          "房租",
          "安静",
        ],
        successCriteria: [
          "Understands 着 descriptions",
          "Asks about rent and location",
          "Expresses housing preferences",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Housing in China",
        content:
          "In Chinese cities, most people live in apartment complexes called 小区 (xiǎoqū). These gated communities often have gardens, security guards, and shared facilities. Buying property is a major life goal, and real estate prices in cities like Beijing and Shanghai are among the highest in the world. The phrase 房奴 (fángnú, 'house slave') describes people burdened by mortgage payments.",
      },
    ],
  },
];

// ============================================
// Module 5: Travel
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l13",
    slug: "experiential-guo",
    title: "过 — Have You Ever...?",
    content: `# 过 — Experiential Aspect

Talk about past experiences.

## Pattern

**V + 过** — have done [V] before (at some point in life)

Negation: **没(有) + V + 过** — have never done [V]

## Travel Vocabulary

- **旅游** (lǚyóu) — to travel / tourism
- **护照** (hùzhào) — passport
- **签证** (qiānzhèng) — visa
- **飞机** (fēijī) — airplane`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m5",
    moduleTitle: "Travel",
    order: 13,
    topicId: "zh-intermediate-experiential-guo",
    vocabulary: [
      {
        word: "旅游",
        translation: "to travel / tourism",
        pronunciation: "lǚyóu",
        exampleSentence: "你去中国旅游过吗？",
        exampleTranslation: "Have you ever traveled to China?",
        partOfSpeech: "verb",
      },
      {
        word: "护照",
        translation: "passport",
        pronunciation: "hùzhào",
        exampleSentence: "别忘了带护照。",
        exampleTranslation: "Don't forget to bring your passport.",
        partOfSpeech: "noun",
      },
      {
        word: "签证",
        translation: "visa",
        pronunciation: "qiānzhèng",
        exampleSentence: "我还没办签证。",
        exampleTranslation: "I haven't gotten my visa yet.",
        partOfSpeech: "noun",
      },
      {
        word: "飞机",
        translation: "airplane",
        pronunciation: "fēijī",
        exampleSentence: "我坐过很多次飞机。",
        exampleTranslation: "I've taken airplanes many times.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "过 — Experiential Aspect",
        explanation:
          "V + 过 indicates that an action has been experienced at some unspecified time in the past. It focuses on the experience, not when it happened. Negate with 没(有)...过. Compare with 了 which marks completed actions at a specific time.",
        examples: [
          {
            correct: "我去过北京。",
            translation: "I've been to Beijing (at some point).",
          },
          {
            correct: "我没吃过北京烤鸭。",
            translation: "I've never eaten Peking duck.",
          },
          {
            correct: "你坐过高铁吗？",
            translation: "Have you ever ridden a bullet train?",
          },
        ],
        commonMistakes: [
          {
            incorrect: "我昨天去过北京。",
            correction: "我昨天去了北京。",
            explanation:
              "过 is for general experience, not specific times. Use 了 for specific past events.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-stories",
        title: "Sharing Travel Experiences",
        situation:
          "You're chatting with a new friend about places you've visited.",
        agentRole:
          "You are 小龙 (Xiǎo Lóng), a travel enthusiast. Share experiences and ask about the student's travels.",
        userGoal: "Discuss travel experiences using 过",
        targetPhrases: [
          "去过",
          "没...过",
          "坐过飞机",
          "旅游",
        ],
        successCriteria: [
          "Uses V过 for experiences",
          "Asks about others' experiences",
          "Describes travel memories",
        ],
      },
    ],
  },
  {
    id: "zh-int-l14",
    slug: "duration-complements",
    title: "Duration Complements",
    content: `# Duration Complements — How Long?

Express how long an action lasts.

## Patterns

- **V + duration** — did [V] for [duration]
- **V + 了 + duration + 的 + object** — did [V] for [duration] (with object)

## Travel Time Vocabulary

- **小时** (xiǎoshí) — hour
- **分钟** (fēnzhōng) — minute
- **天** (tiān) — day
- **火车** (huǒchē) — train`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m5",
    moduleTitle: "Travel",
    order: 14,
    topicId: "zh-intermediate-duration-complements",
    vocabulary: [
      {
        word: "小时",
        translation: "hour",
        pronunciation: "xiǎoshí",
        exampleSentence: "坐了三个小时的火车。",
        exampleTranslation: "Took a three-hour train ride.",
        partOfSpeech: "noun",
      },
      {
        word: "火车",
        translation: "train",
        pronunciation: "huǒchē",
        exampleSentence: "我们坐火车去上海。",
        exampleTranslation: "We take the train to Shanghai.",
        partOfSpeech: "noun",
      },
      {
        word: "航班",
        translation: "flight",
        pronunciation: "hángbān",
        exampleSentence: "航班晚了两个小时。",
        exampleTranslation: "The flight was two hours late.",
        partOfSpeech: "noun",
      },
      {
        word: "高铁",
        translation: "bullet train / high-speed rail",
        pronunciation: "gāotiě",
        exampleSentence: "坐高铁只要四个小时。",
        exampleTranslation: "Taking the bullet train only takes four hours.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Duration Complements",
        explanation:
          "Duration goes after the verb. If the verb has an object, place the duration between the verb and object with 的, or repeat the verb. For ongoing actions, add 了 after the verb to indicate 'so far.'",
        examples: [
          {
            correct: "我等了两个小时。",
            translation: "I waited for two hours.",
          },
          {
            correct: "他学了三年的中文。",
            translation: "He studied Chinese for three years.",
            note: "的 links duration to object",
          },
          {
            correct: "我来北京已经一个月了。",
            translation: "I've been in Beijing for a month already.",
            note: "Ongoing situation",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-planning",
        title: "Planning a Trip",
        situation: "You are planning a trip across China with a friend.",
        agentRole:
          "You are 阿丽 (Ā Lì), planning a trip with the student. Discuss travel times between cities.",
        userGoal:
          "Discuss travel times and durations using duration complements",
        targetPhrases: [
          "坐...个小时",
          "要多长时间",
          "高铁",
          "飞机",
        ],
        successCriteria: [
          "Uses duration complements correctly",
          "Compares travel options",
          "Discusses trip planning",
        ],
      },
    ],
  },
  {
    id: "zh-int-l15",
    slug: "passive-bei",
    title: "被 Passive and 就/才 Contrast",
    content: `# 被 Passive & 就/才

Express passive voice and contrast expectations.

## 被 Passive Pattern

**Object + 被 + (agent) + V + complement** — [Object] was [V]-ed (by agent)

被 sentences often carry negative connotations (something unfortunate happened).

## 就 vs. 才

- **就** — earlier/sooner than expected, emphasis on speed
- **才** — later/slower than expected, emphasis on lateness

## Travel Problem Vocabulary

- **丢** (diū) — to lose
- **行李** (xíngli) — luggage
- **迟到** (chídào) — to be late`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m5",
    moduleTitle: "Travel",
    order: 15,
    topicId: "zh-intermediate-passive-bei",
    vocabulary: [
      {
        word: "被",
        translation: "(passive marker)",
        pronunciation: "bèi",
        exampleSentence: "我的护照被偷了。",
        exampleTranslation: "My passport was stolen.",
        partOfSpeech: "preposition",
      },
      {
        word: "丢",
        translation: "to lose",
        pronunciation: "diū",
        exampleSentence: "行李丢了！",
        exampleTranslation: "The luggage is lost!",
        partOfSpeech: "verb",
      },
      {
        word: "行李",
        translation: "luggage",
        pronunciation: "xíngli",
        exampleSentence: "请把行李放在这里。",
        exampleTranslation: "Please put the luggage here.",
        partOfSpeech: "noun",
      },
      {
        word: "迟到",
        translation: "to be late",
        pronunciation: "chídào",
        exampleSentence: "飞机才迟到了一个小时。",
        exampleTranslation:
          "The plane was only an hour late (later than expected).",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "被 Passive Construction",
        explanation:
          "被 marks the passive voice. The subject receives the action. The verb must have a complement (了, result, etc.). In spoken Chinese, 被 often implies something unpleasant happened. The agent can be omitted if unknown.",
        examples: [
          {
            correct: "我的钱包被人偷了。",
            translation: "My wallet was stolen by someone.",
          },
          {
            correct: "那个航班被取消了。",
            translation: "That flight was cancelled.",
            note: "Agent omitted",
          },
        ],
      },
      {
        title: "就 vs. 才 — Expectation Contrast",
        explanation:
          "就 implies something happened sooner/easier than expected. 才 implies it happened later/harder than expected. 就 pairs with 了; 才 does NOT take 了.",
        examples: [
          {
            correct: "他八点就到了。",
            translation: "He arrived at 8 (earlier than expected).",
          },
          {
            correct: "他十点才到。",
            translation: "He didn't arrive until 10 (later than expected).",
            note: "No 了 after 才",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "travel-trouble",
        title: "Travel Problems",
        situation:
          "You had problems during your trip and are telling a friend about them.",
        agentRole:
          "You are 小云 (Xiǎo Yún). Listen to travel stories and sympathize. Ask about what happened.",
        userGoal:
          "Describe travel mishaps using 被 passive and 就/才 for timing",
        targetPhrases: [
          "被...了",
          "才到",
          "就出发了",
          "行李",
        ],
        successCriteria: [
          "Uses 被 for negative events",
          "Contrasts 就 and 才 for timing",
          "Tells a coherent travel story",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Travel in China",
        content:
          "China's high-speed rail network (高铁 gāotiě) is the world's largest, connecting major cities at speeds up to 350 km/h. For domestic travel, the 12306 app is essential for booking trains. During holidays like 春运 (chūnyùn, Spring Festival travel rush), hundreds of millions of people travel simultaneously — it's the world's largest annual human migration.",
      },
    ],
  },
];

// ============================================
// Module 6: Work & Career
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l16",
    slug: "ba-expanded",
    title: "把 Construction — Expanded",
    content: `# 把 Construction — Expanded

Use 把 for more complex manipulations and instructions.

## Advanced 把 Patterns

- **把 + O + V + 在 + place** — move something to a place
- **把 + O + V + 给 + person** — do something to/for someone
- **把 + O + V + 成 + result** — turn something into something

## Work Vocabulary

- **公司** (gōngsī) — company
- **办公室** (bàngōngshì) — office
- **文件** (wénjiàn) — document / file
- **报告** (bàogào) — report`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m6",
    moduleTitle: "Work & Career",
    order: 16,
    topicId: "zh-intermediate-ba-expanded",
    vocabulary: [
      {
        word: "公司",
        translation: "company",
        pronunciation: "gōngsī",
        exampleSentence: "他在一家大公司工作。",
        exampleTranslation: "He works at a big company.",
        partOfSpeech: "noun",
      },
      {
        word: "办公室",
        translation: "office",
        pronunciation: "bàngōngshì",
        exampleSentence: "请把文件放在办公室。",
        exampleTranslation: "Please put the documents in the office.",
        partOfSpeech: "noun",
      },
      {
        word: "文件",
        translation: "document / file",
        pronunciation: "wénjiàn",
        exampleSentence: "把这个文件发给经理。",
        exampleTranslation: "Send this document to the manager.",
        partOfSpeech: "noun",
      },
      {
        word: "报告",
        translation: "report",
        pronunciation: "bàogào",
        exampleSentence: "我把报告写完了。",
        exampleTranslation: "I finished writing the report.",
        partOfSpeech: "noun",
      },
      {
        word: "经理",
        translation: "manager",
        pronunciation: "jīnglǐ",
        exampleSentence: "经理让我把报告改一下。",
        exampleTranslation: "The manager asked me to revise the report.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "把 + V + 在/给/成",
        explanation:
          "These three patterns extend 把 for workplace contexts. V在 places something somewhere, V给 directs something to someone, V成 transforms something into something else.",
        examples: [
          {
            correct: "请把车停在那边。",
            translation: "Please park the car over there.",
          },
          {
            correct: "把这个消息告诉给大家。",
            translation: "Tell this news to everyone.",
          },
          {
            correct: "他把中文翻译成英文了。",
            translation: "He translated the Chinese into English.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "office-tasks",
        title: "Office Instructions",
        situation: "Your manager is assigning tasks at work.",
        agentRole:
          "You are 赵经理 (Zhào jīnglǐ), a Chinese office manager. Give instructions using 把 and ask about progress on tasks.",
        userGoal:
          "Understand and respond to work instructions using 把",
        targetPhrases: [
          "把...放在...",
          "把...发给...",
          "报告",
          "文件",
        ],
        successCriteria: [
          "Understands 把 instructions",
          "Confirms task completion",
          "Asks clarifying questions",
        ],
      },
    ],
  },
  {
    id: "zh-int-l17",
    slug: "shi-de-emphasis",
    title: "是...的 Emphasis Structure",
    content: `# 是...的 — Emphasizing Details

Highlight specific details about past events.

## Pattern

**是 + detail + V + 的** — It was [detail] that [V]

Used to emphasize the time, place, manner, or purpose of a completed action. The action itself is known; the focus is on the circumstances.

## Career Vocabulary

- **面试** (miànshì) — interview
- **简历** (jiǎnlì) — resume / CV
- **工资** (gōngzī) — salary
- **经验** (jīngyàn) — experience`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m6",
    moduleTitle: "Work & Career",
    order: 17,
    topicId: "zh-intermediate-shi-de-emphasis",
    vocabulary: [
      {
        word: "面试",
        translation: "interview",
        pronunciation: "miànshì",
        exampleSentence: "我是上个月面试的。",
        exampleTranslation: "I interviewed last month.",
        partOfSpeech: "noun",
      },
      {
        word: "简历",
        translation: "resume / CV",
        pronunciation: "jiǎnlì",
        exampleSentence: "你是什么时候投的简历？",
        exampleTranslation: "When did you submit your resume?",
        partOfSpeech: "noun",
      },
      {
        word: "工资",
        translation: "salary",
        pronunciation: "gōngzī",
        exampleSentence: "工资是每月发的。",
        exampleTranslation: "The salary is paid monthly.",
        partOfSpeech: "noun",
      },
      {
        word: "经验",
        translation: "experience",
        pronunciation: "jīngyàn",
        exampleSentence: "他的工作经验很丰富。",
        exampleTranslation: "He has rich work experience.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "是...的 Emphasis",
        explanation:
          "When a past action is already known, use 是...的 to highlight HOW, WHEN, WHERE, or WHY it happened. 是 goes before the emphasized detail, 的 goes at the end (or before a pronoun object). The action completion is presupposed.",
        examples: [
          {
            correct: "我是在网上申请的。",
            translation: "I applied online. (emphasis on method)",
          },
          {
            correct: "他是去年毕业的。",
            translation: "He graduated last year. (emphasis on when)",
          },
          {
            correct: "你是怎么找到这份工作的？",
            translation:
              "How did you find this job? (emphasis on method)",
          },
        ],
        commonMistakes: [
          {
            incorrect: "我是昨天去了北京的。",
            correction: "我是昨天去的北京。",
            explanation:
              "Don't use 了 inside 是...的. The completion is already implied.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "job-interview-prep",
        title: "Discussing Career Background",
        situation: "You're talking to a colleague about your career path.",
        agentRole:
          "You are 陈姐 (Chén jiě), a senior colleague. Ask about the student's background using 是...的.",
        userGoal:
          "Answer career questions using 是...的 for emphasis",
        targetPhrases: [
          "是...的",
          "毕业",
          "面试",
          "经验",
        ],
        successCriteria: [
          "Uses 是...的 to emphasize details",
          "Discusses career history",
          "Answers follow-up questions",
        ],
      },
    ],
  },
  {
    id: "zh-int-l18",
    slug: "potential-complements",
    title: "Potential Complements",
    content: `# Potential Complements — V得了/V不了

Express ability or inability to complete an action.

## Pattern

- **V + 得了 (deliǎo)** — can do / able to manage
- **V + 不了 (buliǎo)** — cannot do / unable to manage
- **V + 得 + complement** — can achieve [result]
- **V + 不 + complement** — cannot achieve [result]

## Workplace Ability Vocabulary

- **完成** (wánchéng) — to complete
- **来得及** (láidejí) — have enough time to
- **来不及** (láibùjí) — not have enough time to
- **加班** (jiābān) — to work overtime`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m6",
    moduleTitle: "Work & Career",
    order: 18,
    topicId: "zh-intermediate-potential-complements",
    vocabulary: [
      {
        word: "完成",
        translation: "to complete",
        pronunciation: "wánchéng",
        exampleSentence: "这个任务今天完成得了吗？",
        exampleTranslation: "Can this task be completed today?",
        partOfSpeech: "verb",
      },
      {
        word: "来得及",
        translation: "have enough time to",
        pronunciation: "láidejí",
        exampleSentence: "还来得及，别着急。",
        exampleTranslation: "There's still time, don't worry.",
        partOfSpeech: "verb",
      },
      {
        word: "来不及",
        translation: "not have enough time to",
        pronunciation: "láibùjí",
        exampleSentence: "来不及了，我们迟到了！",
        exampleTranslation: "There's no time, we're late!",
        partOfSpeech: "verb",
      },
      {
        word: "加班",
        translation: "to work overtime",
        pronunciation: "jiābān",
        exampleSentence: "今天又要加班了。",
        exampleTranslation: "I have to work overtime again today.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Potential Complements (V得/V不 + Complement)",
        explanation:
          "Insert 得 or 不 between a verb and its result/directional complement to express potential (can/can't achieve the result). V得了 = can manage; V不了 = can't manage. This is different from degree complements — potential complements express ability, not description.",
        examples: [
          {
            correct: "这么多饭，我吃不了。",
            translation: "So much food, I can't eat it all.",
          },
          {
            correct: "你看得见吗？",
            translation: "Can you see it?",
          },
          {
            correct: "这个工作我做得完。",
            translation: "I can finish this work.",
          },
          {
            correct: "今天来不及了，明天再说吧。",
            translation: "There's no time today, let's talk tomorrow.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "work-deadlines",
        title: "Discussing Work Deadlines",
        situation:
          "You are discussing deadlines and workload with a colleague.",
        agentRole:
          "You are 李明 (Lǐ Míng), a busy colleague. Discuss what can and can't be finished on time.",
        userGoal:
          "Discuss ability to meet deadlines using potential complements",
        targetPhrases: [
          "做得完",
          "来不及",
          "完成得了",
          "加班",
        ],
        successCriteria: [
          "Uses potential complements correctly",
          "Discusses workload and deadlines",
          "Proposes solutions",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Work Culture in China",
        content:
          "The term 996 (jiǔ jiǔ liù) refers to the controversial work schedule of 9 AM to 9 PM, 6 days a week, common in China's tech industry. While officially discouraged, long hours remain culturally embedded. The concept of 关系 (guānxi, connections/relationships) plays a crucial role in Chinese business culture — who you know often matters as much as what you know.",
      },
    ],
  },
];

// ============================================
// Module 7: Chinese Festivals
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l19",
    slug: "as-soon-as",
    title: "一...就 — As Soon As",
    content: `# 一...就 — As Soon As

Express immediate sequences of events.

## Pattern

**一 + V1 + 就 + V2** — As soon as [V1], then [V2]

## Festival Preparation Vocabulary

- **春节** (Chūnjié) — Spring Festival / Chinese New Year
- **准备** (zhǔnbèi) — to prepare
- **放假** (fàngjià) — to have a holiday
- **红包** (hóngbāo) — red envelope (with money)`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m7",
    moduleTitle: "Chinese Festivals",
    order: 19,
    topicId: "zh-intermediate-as-soon-as",
    vocabulary: [
      {
        word: "春节",
        translation: "Spring Festival / Chinese New Year",
        pronunciation: "Chūnjié",
        exampleSentence: "春节是中国最重要的节日。",
        exampleTranslation:
          "Spring Festival is China's most important holiday.",
        partOfSpeech: "noun",
      },
      {
        word: "准备",
        translation: "to prepare",
        pronunciation: "zhǔnbèi",
        exampleSentence: "妈妈一过年就准备年夜饭。",
        exampleTranslation:
          "Mom starts preparing New Year's Eve dinner as soon as the new year comes.",
        partOfSpeech: "verb",
      },
      {
        word: "红包",
        translation: "red envelope",
        pronunciation: "hóngbāo",
        exampleSentence: "孩子们一过年就收红包。",
        exampleTranslation:
          "Children receive red envelopes as soon as it's New Year.",
        partOfSpeech: "noun",
      },
      {
        word: "放假",
        translation: "to have a holiday",
        pronunciation: "fàngjià",
        exampleSentence: "一放假就回老家。",
        exampleTranslation: "As soon as the holiday starts, I go back to my hometown.",
        partOfSpeech: "verb",
      },
      {
        word: "饺子",
        translation: "dumplings",
        pronunciation: "jiǎozi",
        exampleSentence: "过年一定要吃饺子。",
        exampleTranslation: "You must eat dumplings during New Year.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "一...就 (As Soon As)",
        explanation:
          "一 + V1 + 就 + V2 means 'as soon as V1 happens, V2 follows.' It emphasizes the immediacy between two actions. Can describe habitual patterns or one-time events.",
        examples: [
          {
            correct: "他一到家就做饭。",
            translation: "As soon as he gets home, he cooks.",
          },
          {
            correct: "一下雪，孩子们就高兴。",
            translation: "As soon as it snows, the children are happy.",
          },
          {
            correct: "我一听到这个消息就告诉你。",
            translation:
              "I'll tell you as soon as I hear the news.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "spring-festival-plans",
        title: "Spring Festival Plans",
        situation:
          "Discussing plans for the upcoming Spring Festival with a Chinese friend.",
        agentRole:
          "You are 小芳 (Xiǎo Fāng), excitedly discussing Spring Festival plans. Ask what the student will do during the holiday.",
        userGoal:
          "Discuss festival plans using 一...就 and festival vocabulary",
        targetPhrases: [
          "一...就...",
          "春节",
          "红包",
          "饺子",
        ],
        successCriteria: [
          "Uses 一...就 naturally",
          "Discusses festival activities",
          "Asks and answers about traditions",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Spring Festival (春节)",
        content:
          "春节 (Chūnjié) is the most important holiday in China, based on the lunar calendar (usually late January to mid-February). Traditions include 贴春联 (tiē chūnlián, posting couplets), 放鞭炮 (fàng biānpào, setting off firecrackers), eating 年夜饭 (niányèfàn, reunion dinner), and giving 红包 (hóngbāo, red envelopes with money). The celebration lasts 15 days, ending with 元宵节 (Yuánxiāo Jié, Lantern Festival).",
      },
    ],
  },
  {
    id: "zh-int-l20",
    slug: "first-then",
    title: "先...再 — First...Then",
    content: `# 先...再 — Sequencing Actions

Describe the order of planned actions.

## Pattern

- **先 + V1, 再 + V2** — First [V1], then [V2]
- **先 + V1, 然后 + V2** — First [V1], after that [V2]

## Festival Activities Vocabulary

- **贴** (tiē) — to stick / paste
- **春联** (chūnlián) — Spring Festival couplets
- **打扫** (dǎsǎo) — to clean
- **团圆** (tuányuán) — reunion`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m7",
    moduleTitle: "Chinese Festivals",
    order: 20,
    topicId: "zh-intermediate-first-then",
    vocabulary: [
      {
        word: "贴",
        translation: "to stick / paste",
        pronunciation: "tiē",
        exampleSentence: "先贴春联，再挂灯笼。",
        exampleTranslation:
          "First paste the couplets, then hang the lanterns.",
        partOfSpeech: "verb",
      },
      {
        word: "春联",
        translation: "Spring Festival couplets",
        pronunciation: "chūnlián",
        exampleSentence: "门上贴着春联。",
        exampleTranslation: "Spring Festival couplets are posted on the door.",
        partOfSpeech: "noun",
      },
      {
        word: "打扫",
        translation: "to clean",
        pronunciation: "dǎsǎo",
        exampleSentence: "过年前要先打扫房子。",
        exampleTranslation:
          "Before New Year, you need to clean the house first.",
        partOfSpeech: "verb",
      },
      {
        word: "团圆",
        translation: "reunion",
        pronunciation: "tuányuán",
        exampleSentence: "春节是家人团圆的日子。",
        exampleTranslation:
          "Spring Festival is a time for family reunions.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "先...再/然后 (First...Then)",
        explanation:
          "先 marks the first action in a sequence; 再 or 然后 marks the following action. Use 再 for planned future sequences and 然后 for either planned or narrated sequences.",
        examples: [
          {
            correct: "先吃饭，再看电视。",
            translation: "First eat, then watch TV.",
          },
          {
            correct: "我们先打扫房子，然后贴春联。",
            translation:
              "We'll clean the house first, then put up couplets.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "festival-prep",
        title: "Preparing for the Festival",
        situation:
          "You are helping a Chinese family prepare for Spring Festival.",
        agentRole:
          "You are 阿姨 (āyí, auntie), organizing the family to prepare. Give step-by-step instructions.",
        userGoal:
          "Follow and discuss preparation steps using 先...再",
        targetPhrases: [
          "先...再...",
          "打扫",
          "贴春联",
          "准备",
        ],
        successCriteria: [
          "Uses 先...再 for sequencing",
          "Follows instructions",
          "Asks what to do next",
        ],
      },
    ],
  },
  {
    id: "zh-int-l21",
    slug: "except-besides",
    title: "除了...以外 — Besides / Except",
    content: `# 除了...以外 — Besides & Except

Express inclusion or exclusion.

## Patterns

- **除了 A 以外，还...** — Besides A, also... (inclusive)
- **除了 A 以外，都...** — Except for A, all... (exclusive)

## Mid-Autumn & Other Festivals

- **中秋节** (Zhōngqiū Jié) — Mid-Autumn Festival
- **月饼** (yuèbing) — mooncake
- **端午节** (Duānwǔ Jié) — Dragon Boat Festival
- **粽子** (zòngzi) — sticky rice dumpling`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m7",
    moduleTitle: "Chinese Festivals",
    order: 21,
    topicId: "zh-intermediate-except-besides",
    vocabulary: [
      {
        word: "中秋节",
        translation: "Mid-Autumn Festival",
        pronunciation: "Zhōngqiū Jié",
        exampleSentence: "中秋节要吃月饼。",
        exampleTranslation: "You eat mooncakes during Mid-Autumn Festival.",
        partOfSpeech: "noun",
      },
      {
        word: "月饼",
        translation: "mooncake",
        pronunciation: "yuèbing",
        exampleSentence: "除了月饼以外，还吃水果。",
        exampleTranslation: "Besides mooncakes, we also eat fruit.",
        partOfSpeech: "noun",
      },
      {
        word: "端午节",
        translation: "Dragon Boat Festival",
        pronunciation: "Duānwǔ Jié",
        exampleSentence: "端午节吃粽子。",
        exampleTranslation:
          "We eat zongzi during Dragon Boat Festival.",
        partOfSpeech: "noun",
      },
      {
        word: "粽子",
        translation: "sticky rice dumpling",
        pronunciation: "zòngzi",
        exampleSentence: "奶奶包的粽子最好吃。",
        exampleTranslation: "Grandma's zongzi are the most delicious.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "除了...以外 (Besides / Except)",
        explanation:
          "除了 A 以外 + 还 = 'besides A, also...' (inclusive). 除了 A 以外 + 都 = 'except for A, everyone/everything else...' (exclusive). 以外 can be omitted in casual speech.",
        examples: [
          {
            correct: "除了春节以外，我还喜欢中秋节。",
            translation:
              "Besides Spring Festival, I also like Mid-Autumn Festival.",
            note: "还 = inclusive (in addition)",
          },
          {
            correct: "除了他以外，大家都来了。",
            translation: "Except for him, everyone came.",
            note: "都 = exclusive (everyone else)",
          },
        ],
        commonMistakes: [
          {
            incorrect: "除了春节以外，我都喜欢中秋节。",
            correction: "除了春节以外，我还喜欢中秋节。",
            explanation:
              "Use 还 (also) for addition, 都 (all) for exclusion. Mixing them changes the meaning.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "festival-comparison",
        title: "Comparing Chinese Festivals",
        situation:
          "Discussing different Chinese festivals and their traditions.",
        agentRole:
          "You are 小张 (Xiǎo Zhāng), enthusiastic about Chinese culture. Compare different festivals with the student.",
        userGoal:
          "Compare festivals using 除了...以外 for inclusion and exclusion",
        targetPhrases: [
          "除了...以外，还...",
          "除了...以外，都...",
          "中秋节",
          "春节",
        ],
        successCriteria: [
          "Uses 除了...以外 correctly",
          "Distinguishes inclusive vs. exclusive",
          "Discusses multiple festivals",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Mid-Autumn Festival (中秋节)",
        content:
          "中秋节 (Zhōngqiū Jié) falls on the 15th day of the 8th lunar month, when the moon is fullest. Families gather to eat 月饼 (yuèbing, mooncakes), admire the moon (赏月 shǎngyuè), and tell the story of 嫦娥 (Cháng'é), the moon goddess. It symbolizes family reunion and togetherness, similar to Thanksgiving in spirit.",
      },
    ],
  },
];

// ============================================
// Module 8: Relationships
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "zh-int-l22",
    slug: "causative-rang-jiao",
    title: "让/叫 — Causative Constructions",
    content: `# 让/叫 — Making Someone Do Something

Express causing, allowing, or requesting someone to do something.

## Patterns

- **让 + person + V** — let/make/have someone do
- **叫 + person + V** — tell/have someone do (more colloquial)

## Relationship Vocabulary

- **父母** (fùmǔ) — parents
- **朋友** (péngyou) — friend
- **关系** (guānxi) — relationship
- **担心** (dānxīn) — to worry`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m8",
    moduleTitle: "Relationships",
    order: 22,
    topicId: "zh-intermediate-causative-rang-jiao",
    vocabulary: [
      {
        word: "让",
        translation: "to let / to make",
        pronunciation: "ràng",
        exampleSentence: "妈妈不让我出去玩。",
        exampleTranslation: "Mom won't let me go out to play.",
        partOfSpeech: "verb",
      },
      {
        word: "叫",
        translation: "to tell / to have (someone do)",
        pronunciation: "jiào",
        exampleSentence: "老师叫我回答问题。",
        exampleTranslation: "The teacher told me to answer the question.",
        partOfSpeech: "verb",
      },
      {
        word: "父母",
        translation: "parents",
        pronunciation: "fùmǔ",
        exampleSentence: "父母让我好好学习。",
        exampleTranslation: "My parents want me to study hard.",
        partOfSpeech: "noun",
      },
      {
        word: "担心",
        translation: "to worry",
        pronunciation: "dānxīn",
        exampleSentence: "别让父母担心。",
        exampleTranslation: "Don't make your parents worry.",
        partOfSpeech: "verb",
      },
      {
        word: "关系",
        translation: "relationship",
        pronunciation: "guānxi",
        exampleSentence: "他们的关系很好。",
        exampleTranslation: "Their relationship is very good.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "让/叫 Causative",
        explanation:
          "让 and 叫 both mean 'to make/let/have someone do something.' 让 is more formal and versatile (let, allow, make, request). 叫 is more colloquial and direct (tell, have). Both follow: Subject + 让/叫 + Person + Verb Phrase. Negate with 不 before 让/叫 to mean 'not allow.'",
        examples: [
          {
            correct: "他让我帮他搬家。",
            translation: "He asked me to help him move.",
          },
          {
            correct: "老板叫大家开会。",
            translation: "The boss told everyone to have a meeting.",
          },
          {
            correct: "妈妈不让我看电视。",
            translation: "Mom doesn't let me watch TV.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "family-expectations",
        title: "Family Expectations",
        situation:
          "Discussing what your parents expect you to do and your own plans.",
        agentRole:
          "You are 小美 (Xiǎo Měi), a friend discussing family pressure and expectations. Share your experience and ask about the student's.",
        userGoal:
          "Discuss family expectations using 让/叫 causative structures",
        targetPhrases: [
          "让我...",
          "不让...",
          "叫我...",
          "父母",
        ],
        successCriteria: [
          "Uses 让/叫 correctly",
          "Discusses expectations",
          "Expresses personal feelings",
        ],
      },
    ],
  },
  {
    id: "zh-int-l23",
    slug: "not-only-but-also",
    title: "不但...而且 — Not Only...But Also",
    content: `# 不但...而且 — Not Only...But Also

Build complex sentences that add information progressively.

## Pattern

**不但 (bùdàn)...而且 (érqiě)...** — Not only...but also...

The second clause adds stronger or more surprising information.

## Describing People Vocabulary

- **聪明** (cōngming) — smart
- **友好** (yǒuhǎo) — friendly
- **热情** (rèqíng) — enthusiastic / warm
- **可靠** (kěkào) — reliable`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m8",
    moduleTitle: "Relationships",
    order: 23,
    topicId: "zh-intermediate-not-only-but-also",
    vocabulary: [
      {
        word: "不但",
        translation: "not only",
        pronunciation: "bùdàn",
        exampleSentence: "她不但聪明，而且很努力。",
        exampleTranslation: "She is not only smart, but also very hardworking.",
        partOfSpeech: "conjunction",
      },
      {
        word: "而且",
        translation: "but also / moreover",
        pronunciation: "érqiě",
        exampleSentence: "这个地方不但漂亮，而且安静。",
        exampleTranslation: "This place is not only beautiful, but also quiet.",
        partOfSpeech: "conjunction",
      },
      {
        word: "聪明",
        translation: "smart / clever",
        pronunciation: "cōngming",
        exampleSentence: "这个孩子很聪明。",
        exampleTranslation: "This child is very smart.",
        partOfSpeech: "adjective",
      },
      {
        word: "热情",
        translation: "enthusiastic / warm",
        pronunciation: "rèqíng",
        exampleSentence: "中国人对客人很热情。",
        exampleTranslation: "Chinese people are very warm toward guests.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "不但...而且 (Not Only...But Also)",
        explanation:
          "This structure escalates: the 而且 clause adds something stronger. When the subject is the same in both clauses, 不但 goes after the subject. When subjects differ, 不但 goes before the first subject.",
        examples: [
          {
            correct: "他不但会说中文，而且会说日文。",
            translation:
              "He can not only speak Chinese, but also Japanese.",
            note: "Same subject — 不但 after subject",
          },
          {
            correct: "不但他来了，而且他妈妈也来了。",
            translation:
              "Not only he came, but his mother also came.",
            note: "Different subjects — 不但 before first subject",
          },
        ],
        commonMistakes: [
          {
            incorrect: "不但他会说中文，而且会说日文。",
            correction: "他不但会说中文，而且会说日文。",
            explanation:
              "When the subject is the same, 不但 goes AFTER the subject, not before.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describing-friends",
        title: "Describing a Good Friend",
        situation:
          "You are introducing your best friend to someone new.",
        agentRole:
          "You are 大卫 (Dàwèi), meeting the student's friend for the first time. Ask about the friend's qualities.",
        userGoal:
          "Describe a friend's positive qualities using 不但...而且",
        targetPhrases: [
          "不但...而且...",
          "聪明",
          "热情",
          "可靠",
        ],
        successCriteria: [
          "Uses 不但...而且 correctly",
          "Describes multiple qualities",
          "Maintains natural conversation",
        ],
      },
    ],
  },
  {
    id: "zh-int-l24",
    slug: "even-lian-dou",
    title: "连...都/也 — Even...",
    content: `# 连...都/也 — Even...

Emphasize extremes and surprising facts.

## Pattern

**连 (lián) + [extreme example] + 都/也 + V** — Even [extreme example]...

This structure highlights that something is surprising or beyond expectations. 连 marks the unexpected element; 都 or 也 reinforces it.

## Relationship Expression Vocabulary

- **理解** (lǐjiě) — to understand
- **原谅** (yuánliàng) — to forgive
- **相信** (xiāngxìn) — to believe / trust
- **感动** (gǎndòng) — to be moved / touched`,
    targetLanguage: "zh",
    proficiencyLevel: "B1",
    moduleId: "zh-int-m8",
    moduleTitle: "Relationships",
    order: 24,
    topicId: "zh-intermediate-even-lian-dou",
    vocabulary: [
      {
        word: "连",
        translation: "even",
        pronunciation: "lián",
        exampleSentence: "他连自己的名字都不会写。",
        exampleTranslation: "He can't even write his own name.",
        partOfSpeech: "adverb",
      },
      {
        word: "理解",
        translation: "to understand",
        pronunciation: "lǐjiě",
        exampleSentence: "我理解你的感受。",
        exampleTranslation: "I understand your feelings.",
        partOfSpeech: "verb",
      },
      {
        word: "原谅",
        translation: "to forgive",
        pronunciation: "yuánliàng",
        exampleSentence: "请你原谅我。",
        exampleTranslation: "Please forgive me.",
        partOfSpeech: "verb",
      },
      {
        word: "相信",
        translation: "to believe / trust",
        pronunciation: "xiāngxìn",
        exampleSentence: "我相信你说的话。",
        exampleTranslation: "I believe what you said.",
        partOfSpeech: "verb",
      },
      {
        word: "感动",
        translation: "to be moved / touched",
        pronunciation: "gǎndòng",
        exampleSentence: "他的话让我很感动。",
        exampleTranslation: "His words really moved me.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "连...都/也 (Even...)",
        explanation:
          "连 highlights something unexpected or extreme. 都 or 也 appears before the verb to reinforce the emphasis. Use this when you want to say 'even X does/doesn't...' to show surprise. 都 is more common; 也 is softer.",
        examples: [
          {
            correct: "他连饭都没吃就走了。",
            translation: "He left without even eating.",
          },
          {
            correct: "这道题连老师也不会做。",
            translation: "Even the teacher can't solve this problem.",
          },
          {
            correct: "她感动得连话都说不出来了。",
            translation:
              "She was so moved she couldn't even speak.",
          },
        ],
        commonMistakes: [
          {
            incorrect: "连他不来。",
            correction: "连他都不来。/ 连他也不来。",
            explanation:
              "连 must pair with 都 or 也 before the verb. Without them, the emphasis structure is broken.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "friendship-story",
        title: "A Touching Friendship Story",
        situation:
          "You are sharing a story about something a friend did that surprised or moved you.",
        agentRole:
          "You are 小花 (Xiǎo Huā), a close friend. Share stories about friendship and discuss what makes a good friend.",
        userGoal:
          "Tell a story using 连...都/也 to emphasize surprising details",
        targetPhrases: [
          "连...都...",
          "感动",
          "相信",
          "原谅",
        ],
        successCriteria: [
          "Uses 连...都/也 for emphasis",
          "Tells a coherent story",
          "Expresses emotions about relationships",
        ],
      },
    ],
    culturalNotes: [
      {
        title: "Relationships and Face in China",
        content:
          "In Chinese culture, 面子 (miànzi, face) deeply influences relationships. Giving face (给面子 gěi miànzi) means showing respect and consideration, while losing face (丢面子 diū miànzi) causes deep embarrassment. Good friends help each other maintain face. The concept of 人情 (rénqíng, social favors) also shapes friendships — favors given are expected to be returned, creating a web of mutual obligation.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "zh-int-m1",
    title: "Module 1: School & Education",
    description:
      "Cause-effect, contrast, and conditional sentences with academic vocabulary",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "zh-int-m2",
    title: "Module 2: Weather & Seasons",
    description:
      "Comparisons, similarity, and degree complements for describing weather",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "zh-int-m3",
    title: "Module 3: Health",
    description:
      "The 把 construction, result complements, and change-of-state 了",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "zh-int-m4",
    title: "Module 4: Housing",
    description:
      "Directional complements, existential sentences, and 着 continuous",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "zh-int-m5",
    title: "Module 5: Travel",
    description:
      "Experiential 过, duration complements, 被 passive, and 就/才",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "zh-int-m6",
    title: "Module 6: Work & Career",
    description:
      "Advanced 把, 是...的 emphasis, and potential complements",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "zh-int-m7",
    title: "Module 7: Chinese Festivals",
    description:
      "一...就, 先...再, 除了...以外 with Spring Festival and Mid-Autumn",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "zh-int-m8",
    title: "Module 8: Relationships",
    description:
      "让/叫 causative, 不但...而且, and 连...都/也 emphasis",
    order: 8,
    lessons: module8Lessons,
  },
];

export const chineseIntermediateCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getChineseIntermediateLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findChineseIntermediateLesson(slug: string) {
  return getChineseIntermediateLessons().find((l) => l.slug === slug);
}
