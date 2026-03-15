// Chinese Beginner Course Data
// CEFR A1 / HSK 1-2 Level - Pinyin, Basic Communication, Daily Life

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "chinese-beginner",
  slug: "chinese-beginner",
  title: "Mandarin Chinese A1 - Beginner",
  language: "zh",
  languageName: "Mandarin Chinese",
  proficiencyLevel: "A1" as const,
  description: "Start your Mandarin Chinese journey from zero. Learn pinyin, tones, greetings, numbers, and essential daily phrases. Covers HSK 1-2 vocabulary and grammar.",
  targetAudience: "Complete beginners with no prior Mandarin experience",
  estimatedHours: 80,
  icon: "🇨🇳",
  nextCourseSlug: "chinese-intermediate",
};

// ============================================
// Module 1: Pinyin & Tones
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l1",
    slug: "four-tones",
    title: "The Four Tones & Neutral Tone",
    content: `# The Four Tones & Neutral Tone

Mandarin is a tonal language -- the same syllable pronounced with different tones carries completely different meanings. Mastering tones is the single most important skill for being understood.

## The Four Tones

1. **First tone (-)** -- high and flat: mā (妈 mother)
2. **Second tone (/)** -- rising: má (麻 hemp)
3. **Third tone (v)** -- dipping then rising: mǎ (马 horse)
4. **Fourth tone (\\\\)** -- sharp falling: mà (骂 scold)

## Neutral Tone

Some syllables are unstressed and short, called the **neutral tone** (轻声):
- **ma** (吗) -- question particle
- **de** (的) -- possessive particle
- **le** (了) -- change-of-state particle

## Why Tones Matter

If you say "mǎ" (horse) instead of "mā" (mother), you are saying a completely different word. There is no way around learning tones -- they are not optional.

## Practice Tips

- Exaggerate tones at first; native speakers will still understand you
- Practice tone pairs, not isolated tones
- Record yourself and compare to native audio`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m1",
    moduleTitle: "Pinyin & Tones",
    order: 1,
    topicId: "zh-beginner-four-tones",
    vocabulary: [
      {
        word: "妈",
        translation: "mother",
        pronunciation: "mā",
        exampleSentence: "妈妈好。",
        exampleTranslation: "Mom is well.",
        partOfSpeech: "noun",
      },
      {
        word: "马",
        translation: "horse",
        pronunciation: "mǎ",
        exampleSentence: "这是一匹马。",
        exampleTranslation: "This is a horse.",
        partOfSpeech: "noun",
      },
      {
        word: "大",
        translation: "big",
        pronunciation: "dà",
        exampleSentence: "这个很大。",
        exampleTranslation: "This is very big.",
        partOfSpeech: "adjective",
      },
      {
        word: "吗",
        translation: "question particle",
        pronunciation: "ma",
        exampleSentence: "你好吗？",
        exampleTranslation: "How are you?",
        partOfSpeech: "particle",
      },
    ],
    grammarPoints: [
      {
        title: "Tone Marks on Pinyin",
        explanation: "Tone marks are placed over the main vowel of a syllable. When a syllable has two vowels, the mark goes on the one that is more open: a > e > o > i/u (if i and u appear together, the mark goes on the second one).",
        examples: [
          { correct: "hǎo", translation: "good (tone mark on a, not o)" },
          { correct: "duì", translation: "correct (tone mark on i, the second vowel)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "tone-practice",
        title: "Tone Drill",
        situation: "Your Chinese tutor is testing your tones",
        agentRole: "You are a patient Chinese tutor named Lǎoshī Zhāng. Say a word and ask the student to repeat it with the correct tone. Give gentle corrections.",
        userGoal: "Repeat words with correct tones for all four tones",
        targetPhrases: ["mā", "má", "mǎ", "mà", "hǎo", "dà"],
        successCriteria: ["Attempts all four tones", "Self-corrects when prompted", "Distinguishes rising vs. falling"],
      },
    ],
    culturalNotes: [
      {
        title: "Why Tones Exist",
        content: "Mandarin has far fewer possible syllables than English (about 400 vs. 15,000+). Tones multiply the number of distinct words that can be formed from these limited syllables, giving Mandarin roughly 1,600 tonal syllables. Without tones, the language simply would not have enough sounds to work.",
      },
    ],
  },
  {
    id: "zh-b-l2",
    slug: "initials-finals",
    title: "Initials & Finals",
    content: `# Initials & Finals

Every Chinese syllable is built from an **initial** (consonant at the start) and a **final** (vowel part that follows).

## Common Initials

| Pinyin | Sound | Example |
|--------|-------|---------|
| b | like "b" in boy | bā (八 eight) |
| p | aspirated "p" | pá (爬 climb) |
| m | like "m" in mom | mā (妈 mother) |
| d | like "d" in day | dà (大 big) |
| t | aspirated "t" | tā (他 he) |
| n | like "n" in no | nǐ (你 you) |
| l | like "l" in love | lái (来 come) |
| h | like "h" in hat | hǎo (好 good) |
| zh | like "j" in judge | zhōng (中 middle) |
| sh | like "sh" in ship | shì (是 is) |

## Common Finals

| Pinyin | Sound | Example |
|--------|-------|---------|
| a | like "ah" | bā (八) |
| o | like "or" (no r) | bō (波 wave) |
| e | like "uh" | hē (喝 drink) |
| i | like "ee" | nǐ (你) |
| u | like "oo" | wǔ (五 five) |
| ü | like French "u" | nǚ (女 female) |
| ai | like "eye" | lái (来) |
| ei | like "ay" | méi (没 not) |
| ao | like "ow" | hǎo (好) |
| ou | like "oh" | dōu (都 all) |

## Tricky Sounds

- **zh, ch, sh** are retroflex -- curl your tongue back
- **j, q, x** are palatal -- tongue touches the roof of your mouth
- **ü** only appears after n, l, j, q, x`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m1",
    moduleTitle: "Pinyin & Tones",
    order: 2,
    topicId: "zh-beginner-initials-finals",
    vocabulary: [
      {
        word: "八",
        translation: "eight",
        pronunciation: "bā",
        exampleSentence: "我有八个。",
        exampleTranslation: "I have eight.",
        partOfSpeech: "number",
      },
      {
        word: "五",
        translation: "five",
        pronunciation: "wǔ",
        exampleSentence: "五块钱。",
        exampleTranslation: "Five yuan.",
        partOfSpeech: "number",
      },
      {
        word: "他",
        translation: "he/him",
        pronunciation: "tā",
        exampleSentence: "他是我的朋友。",
        exampleTranslation: "He is my friend.",
        partOfSpeech: "pronoun",
      },
      {
        word: "来",
        translation: "come",
        pronunciation: "lái",
        exampleSentence: "你来吗？",
        exampleTranslation: "Are you coming?",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Syllable Structure in Mandarin",
        explanation: "Every Mandarin syllable follows the pattern: (Initial) + Final + Tone. Some syllables have no initial (e.g., ā, ài). There are no consonant clusters and every syllable ends in a vowel, -n, or -ng.",
        examples: [
          { correct: "nǐ = n + i (third tone)", translation: "you" },
          { correct: "hǎo = h + ao (third tone)", translation: "good" },
          { correct: "ài = (no initial) + ai (fourth tone)", translation: "love" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "pinyin-reading",
        title: "Reading Pinyin Aloud",
        situation: "Your tutor shows you pinyin syllables to read",
        agentRole: "You are Lǎoshī Zhāng. Present pinyin syllables one at a time and ask the student to pronounce them. Focus on initials zh/sh/ch and finals ü/ao/ou.",
        userGoal: "Correctly pronounce a series of pinyin syllables",
        targetPhrases: ["zhōng", "shì", "nǚ", "hǎo", "lái"],
        successCriteria: ["Pronounces retroflex initials", "Distinguishes u and ü", "Maintains correct tones"],
      },
    ],
  },
  {
    id: "zh-b-l3",
    slug: "tone-sandhi",
    title: "Tone Sandhi: Yī, Bù & Third-Tone Rules",
    content: `# Tone Sandhi: Yī, Bù & Third-Tone Rules

In real speech, tones sometimes change depending on what comes next. These changes are called **tone sandhi** (变调 biàndiào).

## Third Tone + Third Tone Rule

When two third tones appear in a row, the first one changes to a second tone:
- 你好 nǐ hǎo → actually pronounced **ní hǎo**
- 很好 hěn hǎo → actually pronounced **hén hǎo**

You still write the original tone marks -- the change is only in speech.

## 一 (yī) Tone Changes

The word 一 (one) changes tone based on what follows:
- Before a **4th tone**: yī → **yí** (一个 yí gè)
- Before **1st, 2nd, or 3rd tone**: yī → **yì** (一天 yì tiān)
- Standalone or counting: stays **yī**

## 不 (bù) Tone Change

不 (not) is normally 4th tone, but:
- Before another **4th tone**: bù → **bú** (不是 bú shì)
- Before all other tones: stays **bù** (不好 bù hǎo)

## Basic Stroke Order

Chinese characters are written in a specific order:
1. Top to bottom (三 sān)
2. Left to right (人 rén)
3. Horizontal before vertical (十 shí)`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m1",
    moduleTitle: "Pinyin & Tones",
    order: 3,
    topicId: "zh-beginner-tone-sandhi",
    vocabulary: [
      {
        word: "一",
        translation: "one",
        pronunciation: "yī",
        exampleSentence: "一个人。",
        exampleTranslation: "One person.",
        partOfSpeech: "number",
      },
      {
        word: "不",
        translation: "not",
        pronunciation: "bù",
        exampleSentence: "我不是学生。",
        exampleTranslation: "I am not a student.",
        partOfSpeech: "adverb",
      },
      {
        word: "好",
        translation: "good",
        pronunciation: "hǎo",
        exampleSentence: "很好！",
        exampleTranslation: "Very good!",
        partOfSpeech: "adjective",
      },
      {
        word: "很",
        translation: "very",
        pronunciation: "hěn",
        exampleSentence: "她很好。",
        exampleTranslation: "She is very well.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Tone Sandhi Is Automatic",
        explanation: "You do not choose when to apply tone sandhi -- it happens naturally in speech. When you see 你好, the pinyin is written nǐ hǎo but you must say ní hǎo. Practice until the changes feel automatic.",
        examples: [
          { correct: "你好 (ní hǎo)", translation: "hello (first third tone becomes second tone)", note: "Written nǐ hǎo, spoken ní hǎo" },
          { correct: "不是 (bú shì)", translation: "is not (bù becomes bú before 4th tone)" },
        ],
        commonMistakes: [
          {
            incorrect: "nǐ hǎo (both dipping tones)",
            correction: "ní hǎo (first rises, second dips)",
            explanation: "Two consecutive third tones are very difficult to say. The first naturally rises to a second tone.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "sandhi-drill",
        title: "Tone Sandhi Practice",
        situation: "Practicing tone sandhi pairs with your tutor",
        agentRole: "You are Lǎoshī Zhāng. Present pairs of words that trigger tone sandhi and ask the student to pronounce them correctly. Correct their tones gently.",
        userGoal: "Pronounce tone sandhi pairs correctly",
        targetPhrases: ["ní hǎo", "bú shì", "yí gè", "hén hǎo"],
        successCriteria: ["Applies 3-3 sandhi", "Applies bù sandhi", "Applies yī sandhi"],
      },
    ],
    culturalNotes: [
      {
        title: "Characters vs. Pinyin",
        content: "Pinyin was created in the 1950s as a romanization aid, not as a replacement for characters. Chinese children learn pinyin in first grade to help with pronunciation, then gradually transition to reading characters. As a learner, use pinyin as training wheels, but start recognizing common characters early -- menus, signs, and apps all use characters.",
      },
    ],
  },
];

// ============================================
// Module 2: Greetings
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l4",
    slug: "hello-goodbye",
    title: "Hello & Goodbye",
    content: `# Hello & Goodbye

The most essential phrases in any language. Chinese greetings are simpler than you might expect.

## Greetings

- **你好** (nǐ hǎo) -- Hello
- **你好吗？** (nǐ hǎo ma?) -- How are you?
- **早上好** (zǎoshang hǎo) -- Good morning
- **晚上好** (wǎnshang hǎo) -- Good evening
- **您好** (nín hǎo) -- Hello (polite/formal)

## Farewells

- **再见** (zàijiàn) -- Goodbye
- **明天见** (míngtiān jiàn) -- See you tomorrow
- **拜拜** (bàibai) -- Bye-bye (casual, borrowed from English)

## Responding to "How are you?"

- **我很好** (wǒ hěn hǎo) -- I'm fine
- **还好** (hái hǎo) -- So-so / Not bad
- **你呢？** (nǐ ne?) -- And you?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m2",
    moduleTitle: "Greetings",
    order: 4,
    topicId: "zh-beginner-hello-goodbye",
    vocabulary: [
      {
        word: "你好",
        translation: "hello",
        pronunciation: "nǐ hǎo",
        exampleSentence: "你好，我叫小明。",
        exampleTranslation: "Hello, my name is Xiao Ming.",
        partOfSpeech: "phrase",
      },
      {
        word: "再见",
        translation: "goodbye",
        pronunciation: "zàijiàn",
        exampleSentence: "再见，明天见！",
        exampleTranslation: "Goodbye, see you tomorrow!",
        partOfSpeech: "phrase",
      },
      {
        word: "早上好",
        translation: "good morning",
        pronunciation: "zǎoshang hǎo",
        exampleSentence: "早上好，老师！",
        exampleTranslation: "Good morning, teacher!",
        partOfSpeech: "phrase",
      },
      {
        word: "谢谢",
        translation: "thank you",
        pronunciation: "xièxie",
        exampleSentence: "谢谢你！",
        exampleTranslation: "Thank you!",
        partOfSpeech: "phrase",
      },
    ],
    grammarPoints: [
      {
        title: "The Particle 吗 (ma) for Yes/No Questions",
        explanation: "To turn any statement into a yes/no question, simply add 吗 at the end. No word-order change is needed.",
        examples: [
          { correct: "你好。→ 你好吗？", translation: "You're well. → Are you well?" },
          { correct: "他是学生。→ 他是学生吗？", translation: "He is a student. → Is he a student?" },
        ],
        commonMistakes: [
          {
            incorrect: "是你好吗？",
            correction: "你好吗？",
            explanation: "Do not rearrange words to form questions. Just add 吗 to the end of the statement.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "first-meeting",
        title: "Meeting a Chinese Friend",
        situation: "You are meeting a Chinese colleague for the first time",
        agentRole: "You are Xiǎo Lì, a friendly colleague. Greet the student, ask how they are, and respond warmly.",
        userGoal: "Greet Xiao Li, ask how she is, and say goodbye",
        targetPhrases: ["你好", "你好吗", "我很好", "再见"],
        successCriteria: ["Uses a greeting", "Asks how the other person is", "Responds to questions", "Says goodbye"],
      },
    ],
    culturalNotes: [
      {
        title: "Greetings Beyond 你好",
        content: "In daily life, Chinese people rarely say 你好 to friends or family -- it can sound stiff. Instead, they use context-based greetings like 你吃了吗？(Have you eaten?) or 你去哪儿？(Where are you going?). These are social greetings, not real questions. The expected answer to 你吃了吗 is simply 吃了 (I ate), even if you have not.",
      },
    ],
  },
  {
    id: "zh-b-l5",
    slug: "shi-sentences",
    title: "是 Sentences & Negation with 不",
    content: `# 是 Sentences & Negation with 不

The verb 是 (shì) means "to be" and is one of the most used words in Chinese. Combined with 不 (bù) for negation, you can make many basic sentences.

## 是 (shì) - "to be"

- **我是学生。** (Wǒ shì xuésheng.) -- I am a student.
- **她是老师。** (Tā shì lǎoshī.) -- She is a teacher.
- **这是书。** (Zhè shì shū.) -- This is a book.

## Negation with 不

Put 不 before the verb to negate it:
- **我不是老师。** (Wǒ bú shì lǎoshī.) -- I am not a teacher.
- **他不好。** (Tā bù hǎo.) -- He is not well.
- **不对。** (Bú duì.) -- Not correct.

## Important: 是 Is Not Always Needed

Unlike English, Chinese does NOT use 是 with adjectives:
- **我很好** (Wǒ hěn hǎo) -- I am well (NOT 我是好)
- **她很忙** (Tā hěn máng) -- She is busy (NOT 她是忙)`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m2",
    moduleTitle: "Greetings",
    order: 5,
    topicId: "zh-beginner-shi-sentences",
    vocabulary: [
      {
        word: "是",
        translation: "to be / is",
        pronunciation: "shì",
        exampleSentence: "我是中国人。",
        exampleTranslation: "I am Chinese.",
        partOfSpeech: "verb",
      },
      {
        word: "学生",
        translation: "student",
        pronunciation: "xuésheng",
        exampleSentence: "她是学生。",
        exampleTranslation: "She is a student.",
        partOfSpeech: "noun",
      },
      {
        word: "老师",
        translation: "teacher",
        pronunciation: "lǎoshī",
        exampleSentence: "他是老师。",
        exampleTranslation: "He is a teacher.",
        partOfSpeech: "noun",
      },
      {
        word: "朋友",
        translation: "friend",
        pronunciation: "péngyou",
        exampleSentence: "他是我的朋友。",
        exampleTranslation: "He is my friend.",
        partOfSpeech: "noun",
      },
      {
        word: "中国人",
        translation: "Chinese person",
        pronunciation: "zhōngguó rén",
        exampleSentence: "你是中国人吗？",
        exampleTranslation: "Are you Chinese?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "是 (shì) for Identity, Not Description",
        explanation: "Use 是 to equate nouns (A is B), NOT to link a noun with an adjective. For adjectives, use 很 + adjective directly.",
        examples: [
          { correct: "我是学生。", translation: "I am a student. (noun = noun)" },
          { correct: "我很好。", translation: "I am well. (adjective, no 是)" },
        ],
        commonMistakes: [
          {
            incorrect: "我是好。",
            correction: "我很好。",
            explanation: "Do not use 是 with adjectives. Use 很 (or another adverb) before the adjective instead.",
          },
        ],
      },
      {
        title: "Negation with 不 (bù)",
        explanation: "Place 不 directly before the verb to negate it. Remember: 不 changes to bú before a 4th tone (不是 = bú shì).",
        examples: [
          { correct: "我不是美国人。", translation: "I am not American." },
          { correct: "她不忙。", translation: "She is not busy." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "self-identity",
        title: "Saying Who You Are",
        situation: "A new acquaintance is asking about you",
        agentRole: "You are Wáng Wěi, a curious new acquaintance. Ask the student if they are a student or teacher, where they are from, and share your own details.",
        userGoal: "Use 是 sentences to describe yourself and negate incorrect guesses",
        targetPhrases: ["我是...", "我不是...", "你是...吗？"],
        successCriteria: ["Uses 是 correctly", "Negates with 不是", "Asks a 吗 question"],
      },
    ],
  },
  {
    id: "zh-b-l6",
    slug: "questions-ne",
    title: "Questions with 呢 and Follow-ups",
    content: `# Questions with 呢 and Follow-ups

Beyond 吗 questions, Chinese has other elegant ways to ask things.

## 呢 (ne) -- "And...?" / "What about...?"

呢 is used to bounce a question back or ask "what about X?":
- A: 你好吗？ B: 我很好。**你呢？** -- And you?
- A: 我是学生。**你呢？** -- I'm a student. What about you?
- **他呢？** -- What about him? / Where is he?

## Common Question Words

- **谁** (shéi) -- who?
- **什么** (shénme) -- what?
- **哪里** (nǎlǐ) -- where?

## Question Word Questions

Unlike 吗 questions, question-word questions do NOT add 吗:
- **你叫什么名字？** (Nǐ jiào shénme míngzi?) -- What is your name?
- **谁是老师？** (Shéi shì lǎoshī?) -- Who is the teacher?

## 叫 (jiào) -- "to be called"

- **我叫...** (Wǒ jiào...) -- My name is...
- **你叫什么？** (Nǐ jiào shénme?) -- What are you called?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m2",
    moduleTitle: "Greetings",
    order: 6,
    topicId: "zh-beginner-questions-ne",
    vocabulary: [
      {
        word: "呢",
        translation: "and you? / what about?",
        pronunciation: "ne",
        exampleSentence: "我很好，你呢？",
        exampleTranslation: "I'm fine, and you?",
        partOfSpeech: "particle",
      },
      {
        word: "什么",
        translation: "what",
        pronunciation: "shénme",
        exampleSentence: "这是什么？",
        exampleTranslation: "What is this?",
        partOfSpeech: "pronoun",
      },
      {
        word: "名字",
        translation: "name",
        pronunciation: "míngzi",
        exampleSentence: "你叫什么名字？",
        exampleTranslation: "What is your name?",
        partOfSpeech: "noun",
      },
      {
        word: "叫",
        translation: "to be called",
        pronunciation: "jiào",
        exampleSentence: "我叫大卫。",
        exampleTranslation: "My name is David.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "吗 Questions vs. Question-Word Questions",
        explanation: "If your question already contains a question word (什么, 谁, 哪里, etc.), do NOT add 吗. The question word itself signals that it is a question.",
        examples: [
          { correct: "你是学生吗？", translation: "Are you a student? (yes/no, use 吗)" },
          { correct: "你叫什么名字？", translation: "What is your name? (has 什么, no 吗)" },
        ],
        commonMistakes: [
          {
            incorrect: "你叫什么名字吗？",
            correction: "你叫什么名字？",
            explanation: "Do not use 吗 and a question word in the same sentence.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "getting-to-know",
        title: "Getting to Know Someone",
        situation: "You are chatting with a new classmate on the first day",
        agentRole: "You are Lín Nà, a classmate. Introduce yourself and ask the student questions. Use 呢 to bounce questions back.",
        userGoal: "Exchange names, ask follow-up questions using 呢",
        targetPhrases: ["我叫...", "你呢？", "你叫什么名字？"],
        successCriteria: ["Introduces self", "Uses 呢 for follow-up", "Asks a question-word question"],
      },
    ],
  },
];

// ============================================
// Module 3: Family & People
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l7",
    slug: "family-members",
    title: "Family Members",
    content: `# Family Members

Chinese family terms are very specific -- there are different words depending on whether someone is on the mother's or father's side, and whether they are older or younger.

## Immediate Family

- **爸爸** (bàba) -- dad
- **妈妈** (māma) -- mom
- **哥哥** (gēge) -- older brother
- **姐姐** (jiějie) -- older sister
- **弟弟** (dìdi) -- younger brother
- **妹妹** (mèimei) -- younger sister

## Other Family

- **爷爷** (yéye) -- paternal grandfather
- **奶奶** (nǎinai) -- paternal grandmother
- **儿子** (érzi) -- son
- **女儿** (nǚ'ér) -- daughter

## Talking About Family

- **我有一个哥哥。** -- I have an older brother.
- **我没有弟弟。** -- I don't have a younger brother.
- **你有几个兄弟姐妹？** -- How many siblings do you have?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m3",
    moduleTitle: "Family & People",
    order: 7,
    topicId: "zh-beginner-family-members",
    vocabulary: [
      {
        word: "爸爸",
        translation: "dad",
        pronunciation: "bàba",
        exampleSentence: "我爸爸是医生。",
        exampleTranslation: "My dad is a doctor.",
        partOfSpeech: "noun",
      },
      {
        word: "妈妈",
        translation: "mom",
        pronunciation: "māma",
        exampleSentence: "妈妈在家。",
        exampleTranslation: "Mom is at home.",
        partOfSpeech: "noun",
      },
      {
        word: "哥哥",
        translation: "older brother",
        pronunciation: "gēge",
        exampleSentence: "我哥哥很高。",
        exampleTranslation: "My older brother is very tall.",
        partOfSpeech: "noun",
      },
      {
        word: "姐姐",
        translation: "older sister",
        pronunciation: "jiějie",
        exampleSentence: "姐姐喜欢看书。",
        exampleTranslation: "Older sister likes reading.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "有 (yǒu) - To Have",
        explanation: "有 means 'to have'. Its negative is 没有 (méi yǒu), NOT 不有. This is the one major exception to using 不 for negation.",
        examples: [
          { correct: "我有两个姐姐。", translation: "I have two older sisters." },
          { correct: "我没有弟弟。", translation: "I don't have a younger brother." },
        ],
        commonMistakes: [
          {
            incorrect: "我不有弟弟。",
            correction: "我没有弟弟。",
            explanation: "Never say 不有. The negation of 有 is always 没有.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "family-chat",
        title: "Talking About Your Family",
        situation: "A friend is asking about your family",
        agentRole: "You are Zhāng Wěi, a curious friend. Ask the student about their family members -- how many siblings, parents' jobs, etc.",
        userGoal: "Describe your family using 有 and family vocabulary",
        targetPhrases: ["我有...", "我没有...", "我的爸爸..."],
        successCriteria: ["Names family members", "Uses 有 and 没有 correctly", "Provides basic details"],
      },
    ],
    culturalNotes: [
      {
        title: "Family Terms Reflect Hierarchy",
        content: "Chinese distinguishes older vs. younger siblings (哥哥/弟弟, 姐姐/妹妹) and maternal vs. paternal relatives (外公/爷爷 for grandfathers). This reflects the deep importance of family hierarchy in Chinese culture. When in doubt, using the respectful (older) term is always safer.",
      },
    ],
  },
  {
    id: "zh-b-l8",
    slug: "counting-measure-words",
    title: "Counting & Measure Word 个",
    content: `# Counting & Measure Word 个

Chinese requires a "measure word" (量词 liàngcí) between a number and a noun. The most common and versatile one is 个 (gè).

## Numbers 1-10

1. 一 (yī) 2. 二 (èr) 3. 三 (sān) 4. 四 (sì) 5. 五 (wǔ)
6. 六 (liù) 7. 七 (qī) 8. 八 (bā) 9. 九 (jiǔ) 10. 十 (shí)

## The Measure Word 个 (gè)

You cannot say "三书" (three books). You must say **三本书** (sān běn shū). For beginners, 个 works as a general-purpose measure word:

- **一个人** (yí gè rén) -- one person
- **两个朋友** (liǎng gè péngyou) -- two friends
- **三个苹果** (sān gè píngguǒ) -- three apples

## 几 vs. 多少 -- "How many?"

- **几** (jǐ) -- how many? (expects a small number, <10)
- **多少** (duōshao) -- how many/much? (any quantity)

Examples:
- **你有几个兄弟？** -- How many brothers do you have?
- **这个多少钱？** -- How much is this?

## 两 vs. 二

Before a measure word, use **两** (liǎng) instead of 二 (èr) for "two":
- **两个人** (NOT 二个人)`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m3",
    moduleTitle: "Family & People",
    order: 8,
    topicId: "zh-beginner-counting-measure-words",
    vocabulary: [
      {
        word: "个",
        translation: "general measure word",
        pronunciation: "gè",
        exampleSentence: "三个人。",
        exampleTranslation: "Three people.",
        partOfSpeech: "measure word",
      },
      {
        word: "几",
        translation: "how many (small number)",
        pronunciation: "jǐ",
        exampleSentence: "你有几个孩子？",
        exampleTranslation: "How many children do you have?",
        partOfSpeech: "pronoun",
      },
      {
        word: "多少",
        translation: "how many / how much",
        pronunciation: "duōshao",
        exampleSentence: "多少钱？",
        exampleTranslation: "How much money?",
        partOfSpeech: "pronoun",
      },
      {
        word: "两",
        translation: "two (before measure words)",
        pronunciation: "liǎng",
        exampleSentence: "我有两个姐姐。",
        exampleTranslation: "I have two older sisters.",
        partOfSpeech: "number",
      },
      {
        word: "人",
        translation: "person / people",
        pronunciation: "rén",
        exampleSentence: "这里有很多人。",
        exampleTranslation: "There are many people here.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Number + Measure Word + Noun",
        explanation: "In Chinese, you always need a measure word between a number (or demonstrative) and a noun. 个 is the most common and can be used as a fallback when you do not know the specific measure word.",
        examples: [
          { correct: "一个学生", translation: "one student" },
          { correct: "五个苹果", translation: "five apples" },
          { correct: "这个人", translation: "this person" },
        ],
        commonMistakes: [
          {
            incorrect: "三人",
            correction: "三个人",
            explanation: "You cannot place a number directly before a noun. A measure word is required.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "counting-things",
        title: "Counting Items",
        situation: "You are at a fruit stand counting items",
        agentRole: "You are a friendly fruit vendor. Ask the student how many of each fruit they want. Use numbers and measure words.",
        userGoal: "Use numbers and 个 to say how many items you want",
        targetPhrases: ["我要三个", "几个？", "两个苹果"],
        successCriteria: ["Uses number + 个 + noun", "Uses 两 instead of 二 before 个", "Responds to 几 questions"],
      },
    ],
  },
  {
    id: "zh-b-l9",
    slug: "possession-de",
    title: "Possession with 的",
    content: `# Possession with 的

The particle 的 (de) is the most common word in Chinese. Its main use is showing possession, similar to "'s" in English.

## Basic Possession

- **我的书** (wǒ de shū) -- my book
- **他的老师** (tā de lǎoshī) -- his teacher
- **妈妈的手机** (māma de shǒujī) -- mom's phone

## Dropping 的 with Close Relationships

With close family and personal relationships, 的 is often omitted:
- **我妈妈** = **我的妈妈** (my mom)
- **我朋友** = **我的朋友** (my friend)
- **我家** = **我的家** (my home)

## 的 for Description

的 also links descriptions to nouns:
- **漂亮的花** (piàoliang de huā) -- beautiful flowers
- **大的房子** (dà de fángzi) -- big house

## Whose? -- 谁的 (shéi de)

- **这是谁的？** (Zhè shì shéi de?) -- Whose is this?
- **这是我的。** (Zhè shì wǒ de.) -- This is mine.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m3",
    moduleTitle: "Family & People",
    order: 9,
    topicId: "zh-beginner-possession-de",
    vocabulary: [
      {
        word: "的",
        translation: "possessive particle / 's",
        pronunciation: "de",
        exampleSentence: "这是我的。",
        exampleTranslation: "This is mine.",
        partOfSpeech: "particle",
      },
      {
        word: "书",
        translation: "book",
        pronunciation: "shū",
        exampleSentence: "这本书很好。",
        exampleTranslation: "This book is very good.",
        partOfSpeech: "noun",
      },
      {
        word: "谁",
        translation: "who / whose",
        pronunciation: "shéi",
        exampleSentence: "这是谁的？",
        exampleTranslation: "Whose is this?",
        partOfSpeech: "pronoun",
      },
      {
        word: "家",
        translation: "home / family",
        pronunciation: "jiā",
        exampleSentence: "我家在北京。",
        exampleTranslation: "My home is in Beijing.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "When to Drop 的",
        explanation: "With close personal relationships (family, close friends) and personal pronouns + single-syllable nouns, 的 is commonly dropped. Keeping it is not wrong, just slightly formal.",
        examples: [
          { correct: "我妈妈", translation: "my mom (的 dropped, natural)" },
          { correct: "我的老师", translation: "my teacher (的 kept, also natural)" },
          { correct: "他家", translation: "his home (的 dropped)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "whose-stuff",
        title: "Whose Is This?",
        situation: "After class, items have been left behind",
        agentRole: "You are the teacher, holding up lost items and asking whose they are. Ask 这是谁的？ for different objects.",
        userGoal: "Claim your items and identify others' belongings using 的",
        targetPhrases: ["这是我的", "那是他的", "这是谁的？"],
        successCriteria: ["Claims items with 我的", "Attributes items to others with 他/她的", "Asks 谁的"],
      },
    ],
  },
];

// ============================================
// Module 4: Dates & Time
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l10",
    slug: "days-months",
    title: "Days of the Week & Months",
    content: `# Days of the Week & Months

Chinese dates are beautifully logical -- days of the week use numbers, and months are just "number + month."

## Days of the Week (星期 xīngqī)

- **星期一** (xīngqī yī) -- Monday (week-one)
- **星期二** (xīngqī èr) -- Tuesday
- **星期三** (xīngqī sān) -- Wednesday
- **星期四** (xīngqī sì) -- Thursday
- **星期五** (xīngqī wǔ) -- Friday
- **星期六** (xīngqī liù) -- Saturday
- **星期天/日** (xīngqī tiān/rì) -- Sunday

## Months (月 yuè)

- **一月** (yī yuè) -- January (month-one)
- **二月** (èr yuè) -- February
- ... all the way to **十二月** (shí'èr yuè) -- December

## Saying Dates

Dates go from LARGE to SMALL: year → month → day
- **2025年三月十五号** -- March 15, 2025
- **今天星期几？** (Jīntiān xīngqī jǐ?) -- What day is today?
- **今天几月几号？** (Jīntiān jǐ yuè jǐ hào?) -- What's today's date?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m4",
    moduleTitle: "Dates & Time",
    order: 10,
    topicId: "zh-beginner-days-months",
    vocabulary: [
      {
        word: "星期",
        translation: "week / day of the week",
        pronunciation: "xīngqī",
        exampleSentence: "今天星期几？",
        exampleTranslation: "What day of the week is it?",
        partOfSpeech: "noun",
      },
      {
        word: "月",
        translation: "month / moon",
        pronunciation: "yuè",
        exampleSentence: "三月很美。",
        exampleTranslation: "March is beautiful.",
        partOfSpeech: "noun",
      },
      {
        word: "今天",
        translation: "today",
        pronunciation: "jīntiān",
        exampleSentence: "今天是星期一。",
        exampleTranslation: "Today is Monday.",
        partOfSpeech: "noun",
      },
      {
        word: "号",
        translation: "day of the month / number",
        pronunciation: "hào",
        exampleSentence: "今天几号？",
        exampleTranslation: "What date is it today?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Date Order: Big to Small",
        explanation: "Chinese dates always go from the largest unit to the smallest: year (年) → month (月) → day (号/日). This is the opposite of American English.",
        examples: [
          { correct: "2025年一月一号", translation: "January 1, 2025" },
          { correct: "今天是三月十五号。", translation: "Today is March 15." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "whats-the-date",
        title: "Planning a Meeting",
        situation: "You are scheduling a study session with a classmate",
        agentRole: "You are a classmate named Chén Míng. Propose a day to meet and ask the student about their schedule.",
        userGoal: "Discuss days of the week and agree on a date to meet",
        targetPhrases: ["星期几", "今天是...", "星期六好吗？"],
        successCriteria: ["Names days of the week", "States today's date", "Agrees on a day"],
      },
    ],
  },
  {
    id: "zh-b-l11",
    slug: "telling-time",
    title: "Telling Time",
    content: `# Telling Time

Learn to ask and tell the time in Chinese.

## Asking the Time

- **现在几点？** (Xiànzài jǐ diǎn?) -- What time is it now?
- **几点了？** (Jǐ diǎn le?) -- What time is it? (casual)

## Telling the Time

- **点** (diǎn) = o'clock
- **分** (fēn) = minute
- **半** (bàn) = half (30 minutes)
- **刻** (kè) = quarter (15 minutes)

Examples:
- **三点** (sān diǎn) -- 3:00
- **三点半** (sān diǎn bàn) -- 3:30
- **三点十五分** (sān diǎn shíwǔ fēn) -- 3:15
- **差十分四点** (chà shí fēn sì diǎn) -- ten to four (3:50)

## Time Before Verb Rule

In Chinese, time expressions come BEFORE the verb:
- **我三点去。** (Wǒ sān diǎn qù.) -- I go at 3:00.
- **他八点吃早饭。** (Tā bā diǎn chī zǎofàn.) -- He eats breakfast at 8:00.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m4",
    moduleTitle: "Dates & Time",
    order: 11,
    topicId: "zh-beginner-telling-time",
    vocabulary: [
      {
        word: "点",
        translation: "o'clock / dot",
        pronunciation: "diǎn",
        exampleSentence: "现在三点。",
        exampleTranslation: "It's 3 o'clock now.",
        partOfSpeech: "noun",
      },
      {
        word: "现在",
        translation: "now",
        pronunciation: "xiànzài",
        exampleSentence: "现在几点？",
        exampleTranslation: "What time is it now?",
        partOfSpeech: "adverb",
      },
      {
        word: "半",
        translation: "half",
        pronunciation: "bàn",
        exampleSentence: "七点半。",
        exampleTranslation: "Seven thirty.",
        partOfSpeech: "number",
      },
      {
        word: "早上",
        translation: "morning",
        pronunciation: "zǎoshang",
        exampleSentence: "早上八点上课。",
        exampleTranslation: "Class starts at 8 AM.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Time Comes Before the Verb",
        explanation: "In Chinese, time expressions (when something happens) are placed BEFORE the verb, not after. The pattern is: Subject + Time + Verb + Object.",
        examples: [
          { correct: "我八点起床。", translation: "I get up at 8. (lit: I 8-o'clock get-up)" },
          { correct: "我们明天去。", translation: "We go tomorrow. (lit: We tomorrow go)" },
        ],
        commonMistakes: [
          {
            incorrect: "我去三点。",
            correction: "我三点去。",
            explanation: "Time must come before the verb, not after.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "daily-schedule",
        title: "Discussing Your Schedule",
        situation: "Talking about your daily routine with a language partner",
        agentRole: "You are a language partner named Xiǎo Hóng. Ask the student what time they do various activities and share your own schedule.",
        userGoal: "Tell someone your daily schedule using time expressions",
        targetPhrases: ["几点", "我...点...", "早上/下午"],
        successCriteria: ["States times correctly", "Places time before verb", "Describes at least 3 activities"],
      },
    ],
  },
  {
    id: "zh-b-l12",
    slug: "le-particle",
    title: "Introduction to 了",
    content: `# Introduction to 了

了 (le) is one of the most important -- and most confusing -- particles in Chinese. At the beginner level, we focus on its simplest use: indicating a completed action.

## 了 After a Verb = Completed Action

- **我吃了。** (Wǒ chī le.) -- I ate. / I've eaten.
- **他来了。** (Tā lái le.) -- He came. / He's here.
- **你买了什么？** (Nǐ mǎi le shénme?) -- What did you buy?

## 了 at End of Sentence = Change of State

- **下雨了。** (Xià yǔ le.) -- It started raining. (It wasn't raining before.)
- **三点了。** (Sān diǎn le.) -- It's 3 o'clock now. (Time has changed.)

## Negating Completed Actions: 没有

To say something did NOT happen, use 没有 (méi yǒu) or 没 (méi) -- do NOT use 了:
- **我没吃。** (Wǒ méi chī.) -- I didn't eat.
- **他没来。** (Tā méi lái.) -- He didn't come.

## Important

了 does NOT equal past tense. It marks completion or change, which can apply to the future too: 你吃了饭再走 (Eat first, then leave -- future completed action).`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m4",
    moduleTitle: "Dates & Time",
    order: 12,
    topicId: "zh-beginner-le-particle",
    vocabulary: [
      {
        word: "了",
        translation: "completed action / change of state particle",
        pronunciation: "le",
        exampleSentence: "我吃了。",
        exampleTranslation: "I've eaten.",
        partOfSpeech: "particle",
      },
      {
        word: "买",
        translation: "to buy",
        pronunciation: "mǎi",
        exampleSentence: "你买了什么？",
        exampleTranslation: "What did you buy?",
        partOfSpeech: "verb",
      },
      {
        word: "吃",
        translation: "to eat",
        pronunciation: "chī",
        exampleSentence: "我们吃了饭。",
        exampleTranslation: "We ate.",
        partOfSpeech: "verb",
      },
      {
        word: "没",
        translation: "not (for negating completed actions)",
        pronunciation: "méi",
        exampleSentence: "我没去。",
        exampleTranslation: "I didn't go.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "了 Is Not Past Tense",
        explanation: "Chinese verbs do not conjugate for tense. 了 signals that an action is completed or that a new situation has emerged. It is used with past events most often, but can appear in future or hypothetical contexts too.",
        examples: [
          { correct: "我吃了三个苹果。", translation: "I ate three apples. (completed)" },
          { correct: "下雨了！", translation: "It's raining now! (change of state)" },
        ],
        commonMistakes: [
          {
            incorrect: "我没吃了。",
            correction: "我没吃。",
            explanation: "When negating with 没, drop the 了. 没 already implies the action did not complete.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "what-did-you-do",
        title: "Talking About Yesterday",
        situation: "A friend asks what you did yesterday",
        agentRole: "You are Lǐ Míng, asking the student about their yesterday. Ask what they ate, where they went, and what they bought.",
        userGoal: "Describe completed actions using 了 and negate actions with 没",
        targetPhrases: ["我吃了...", "我没去", "你买了什么？"],
        successCriteria: ["Uses verb + 了 for completed actions", "Uses 没 for negation without 了", "Answers questions about past events"],
      },
    ],
  },
];

// ============================================
// Module 5: Hobbies
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l13",
    slug: "likes-xihuan",
    title: "Likes & Dislikes with 喜欢",
    content: `# Likes & Dislikes with 喜欢

Express your interests and ask about others'.

## 喜欢 (xǐhuan) -- to like

- **我喜欢看书。** (Wǒ xǐhuan kàn shū.) -- I like reading.
- **你喜欢什么？** (Nǐ xǐhuan shénme?) -- What do you like?
- **她喜欢跑步。** (Tā xǐhuan pǎobù.) -- She likes running.

## Common Hobbies

- **看书** (kàn shū) -- reading
- **看电影** (kàn diànyǐng) -- watching movies
- **听音乐** (tīng yīnyuè) -- listening to music
- **跑步** (pǎobù) -- running
- **游泳** (yóuyǒng) -- swimming
- **打篮球** (dǎ lánqiú) -- playing basketball

## Disliking

- **我不喜欢...** (Wǒ bù xǐhuan...) -- I don't like...
- **我不太喜欢...** (Wǒ bú tài xǐhuan...) -- I don't really like... (softer)`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m5",
    moduleTitle: "Hobbies",
    order: 13,
    topicId: "zh-beginner-likes-xihuan",
    vocabulary: [
      {
        word: "喜欢",
        translation: "to like",
        pronunciation: "xǐhuan",
        exampleSentence: "我喜欢中国菜。",
        exampleTranslation: "I like Chinese food.",
        partOfSpeech: "verb",
      },
      {
        word: "看",
        translation: "to look / to watch / to read",
        pronunciation: "kàn",
        exampleSentence: "我喜欢看书。",
        exampleTranslation: "I like reading books.",
        partOfSpeech: "verb",
      },
      {
        word: "听",
        translation: "to listen",
        pronunciation: "tīng",
        exampleSentence: "你喜欢听音乐吗？",
        exampleTranslation: "Do you like listening to music?",
        partOfSpeech: "verb",
      },
      {
        word: "电影",
        translation: "movie",
        pronunciation: "diànyǐng",
        exampleSentence: "这个电影很好看。",
        exampleTranslation: "This movie is very good.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "喜欢 + Verb",
        explanation: "Unlike English, you do not need a special form (like '-ing') after 喜欢. Just place the verb directly after it.",
        examples: [
          { correct: "我喜欢吃水果。", translation: "I like eating fruit." },
          { correct: "他喜欢打篮球。", translation: "He likes playing basketball." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "hobby-exchange",
        title: "Sharing Hobbies",
        situation: "Getting to know a new friend over tea",
        agentRole: "You are Xiǎo Méi, chatting about hobbies. Share yours and ask the student about theirs. React with enthusiasm.",
        userGoal: "Talk about hobbies you like and dislike",
        targetPhrases: ["我喜欢...", "我不喜欢...", "你喜欢什么？"],
        successCriteria: ["States at least 2 likes", "States at least 1 dislike", "Asks the other person"],
      },
    ],
  },
  {
    id: "zh-b-l14",
    slug: "suggestions-ba",
    title: "Suggestions with 吧 & 一起",
    content: `# Suggestions with 吧 & 一起

Learn to make suggestions and invite people to do things together.

## 吧 (ba) -- Suggestion / Softener

Adding 吧 to the end of a sentence makes it a suggestion or softens a command:
- **走吧！** (Zǒu ba!) -- Let's go!
- **吃吧。** (Chī ba.) -- Go ahead and eat.
- **我们看电影吧。** (Wǒmen kàn diànyǐng ba.) -- Let's watch a movie.

## 一起 (yìqǐ) -- Together

- **我们一起去吧！** (Wǒmen yìqǐ qù ba!) -- Let's go together!
- **一起吃饭吧。** (Yìqǐ chī fàn ba.) -- Let's eat together.
- **你想一起看电影吗？** (Nǐ xiǎng yìqǐ kàn diànyǐng ma?) -- Do you want to watch a movie together?

## Responding to Suggestions

- **好啊！** (Hǎo a!) -- Great! / Sure!
- **好的。** (Hǎo de.) -- OK.
- **不了，谢谢。** (Bù le, xièxie.) -- No thanks.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m5",
    moduleTitle: "Hobbies",
    order: 14,
    topicId: "zh-beginner-suggestions-ba",
    vocabulary: [
      {
        word: "吧",
        translation: "suggestion particle",
        pronunciation: "ba",
        exampleSentence: "走吧！",
        exampleTranslation: "Let's go!",
        partOfSpeech: "particle",
      },
      {
        word: "一起",
        translation: "together",
        pronunciation: "yìqǐ",
        exampleSentence: "我们一起去。",
        exampleTranslation: "Let's go together.",
        partOfSpeech: "adverb",
      },
      {
        word: "想",
        translation: "to want / to think",
        pronunciation: "xiǎng",
        exampleSentence: "你想去吗？",
        exampleTranslation: "Do you want to go?",
        partOfSpeech: "verb",
      },
      {
        word: "走",
        translation: "to walk / to go / to leave",
        pronunciation: "zǒu",
        exampleSentence: "我们走吧。",
        exampleTranslation: "Let's go.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "吧 for Suggestions vs. 吗 for Questions",
        explanation: "吧 makes a soft suggestion or seeks agreement. 吗 asks a genuine yes/no question. They have different tones and intentions.",
        examples: [
          { correct: "我们去吧。", translation: "Let's go. (suggestion)" },
          { correct: "我们去吗？", translation: "Are we going? (genuine question)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-plans",
        title: "Making Weekend Plans",
        situation: "It's Friday and you're making plans with a friend",
        agentRole: "You are Dà Wěi, suggesting weekend activities. Propose watching a movie, eating out, or playing sports. Use 吧 and 一起.",
        userGoal: "Make and respond to suggestions for weekend activities",
        targetPhrases: ["...吧", "一起...", "好啊！", "你想...吗？"],
        successCriteria: ["Makes a suggestion with 吧", "Uses 一起", "Responds to suggestions appropriately"],
      },
    ],
  },
  {
    id: "zh-b-l15",
    slug: "verb-de",
    title: "Describing Actions with Verb + 得",
    content: `# Describing Actions with Verb + 得

To describe HOW someone does something, use the complement structure: Verb + 得 (de) + Description.

## Basic Pattern

Verb + 得 + adjective/description:
- **他跑得很快。** (Tā pǎo de hěn kuài.) -- He runs very fast.
- **你说得很好。** (Nǐ shuō de hěn hǎo.) -- You speak very well.
- **她写得很漂亮。** (Tā xiě de hěn piàoliang.) -- She writes beautifully.

## Negative Form

Verb + 得 + 不 + adjective:
- **我说得不好。** (Wǒ shuō de bù hǎo.) -- I don't speak well.
- **他跑得不快。** (Tā pǎo de bú kuài.) -- He doesn't run fast.

## Asking "How well?"

Verb + 得 + 怎么样？ (zěnmeyàng):
- **你中文说得怎么样？** -- How well do you speak Chinese?

## Common Complements

- **快** (kuài) -- fast
- **慢** (màn) -- slow
- **好** (hǎo) -- well
- **多** (duō) -- a lot`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m5",
    moduleTitle: "Hobbies",
    order: 15,
    topicId: "zh-beginner-verb-de",
    vocabulary: [
      {
        word: "得",
        translation: "complement particle (how well)",
        pronunciation: "de",
        exampleSentence: "你说得很好。",
        exampleTranslation: "You speak very well.",
        partOfSpeech: "particle",
      },
      {
        word: "快",
        translation: "fast",
        pronunciation: "kuài",
        exampleSentence: "他跑得很快。",
        exampleTranslation: "He runs very fast.",
        partOfSpeech: "adjective",
      },
      {
        word: "说",
        translation: "to speak / to say",
        pronunciation: "shuō",
        exampleSentence: "请你再说一次。",
        exampleTranslation: "Please say it again.",
        partOfSpeech: "verb",
      },
      {
        word: "慢",
        translation: "slow",
        pronunciation: "màn",
        exampleSentence: "请说慢一点。",
        exampleTranslation: "Please speak more slowly.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Three De Particles: 的, 得, 地",
        explanation: "Chinese has three different 'de' particles, all pronounced 'de' but written differently. At this level, focus on: 的 (possession/description before nouns) and 得 (after verbs to describe how an action is done). The third, 地, comes later.",
        examples: [
          { correct: "我的书 (de: possession)", translation: "my book" },
          { correct: "说得好 (de: verb complement)", translation: "speak well" },
        ],
        commonMistakes: [
          {
            incorrect: "他跑的很快。",
            correction: "他跑得很快。",
            explanation: "After a verb describing how the action is done, use 得 (not 的).",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "complimenting-skills",
        title: "Complimenting Each Other",
        situation: "You and a friend are practicing Chinese and complimenting each other's skills",
        agentRole: "You are a language partner. Compliment the student's Chinese and ask how well they do various activities. Use verb + 得 structures.",
        userGoal: "Give and receive compliments about skills using verb + 得",
        targetPhrases: ["你说得很好", "我...得不好", "你...得怎么样？"],
        successCriteria: ["Uses verb + 得 + adjective", "Uses negative form with 不", "Asks a 得怎么样 question"],
      },
    ],
  },
];

// ============================================
// Module 6: Food & Dining
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l16",
    slug: "food-measure-words",
    title: "Food & Measure Words",
    content: `# Food & Measure Words

Different types of food and drink use different measure words. Here are the most common ones for dining.

## Food Measure Words

- **碗** (wǎn) -- bowl (for rice, noodles, soup)
- **杯** (bēi) -- cup/glass (for drinks)
- **瓶** (píng) -- bottle (for bottled drinks)
- **盘** (pán) -- plate/dish (for dishes of food)

## Common Foods

- **米饭** (mǐfàn) -- rice
- **面条** (miàntiáo) -- noodles
- **饺子** (jiǎozi) -- dumplings
- **菜** (cài) -- dish / vegetable
- **肉** (ròu) -- meat
- **鸡蛋** (jīdàn) -- egg
- **水果** (shuǐguǒ) -- fruit

## Common Drinks

- **水** (shuǐ) -- water
- **茶** (chá) -- tea
- **咖啡** (kāfēi) -- coffee
- **啤酒** (píjiǔ) -- beer

## Examples

- **一碗米饭** (yì wǎn mǐfàn) -- a bowl of rice
- **两杯茶** (liǎng bēi chá) -- two cups of tea
- **一瓶水** (yì píng shuǐ) -- a bottle of water`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m6",
    moduleTitle: "Food & Dining",
    order: 16,
    topicId: "zh-beginner-food-measure-words",
    vocabulary: [
      {
        word: "碗",
        translation: "bowl (measure word)",
        pronunciation: "wǎn",
        exampleSentence: "我要一碗面条。",
        exampleTranslation: "I want a bowl of noodles.",
        partOfSpeech: "measure word",
      },
      {
        word: "杯",
        translation: "cup / glass (measure word)",
        pronunciation: "bēi",
        exampleSentence: "请给我一杯水。",
        exampleTranslation: "Please give me a glass of water.",
        partOfSpeech: "measure word",
      },
      {
        word: "米饭",
        translation: "rice (cooked)",
        pronunciation: "mǐfàn",
        exampleSentence: "我喜欢吃米饭。",
        exampleTranslation: "I like eating rice.",
        partOfSpeech: "noun",
      },
      {
        word: "茶",
        translation: "tea",
        pronunciation: "chá",
        exampleSentence: "你喝茶吗？",
        exampleTranslation: "Do you drink tea?",
        partOfSpeech: "noun",
      },
      {
        word: "面条",
        translation: "noodles",
        pronunciation: "miàntiáo",
        exampleSentence: "一碗面条多少钱？",
        exampleTranslation: "How much is a bowl of noodles?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Specific Measure Words for Food",
        explanation: "While 个 is a general-purpose measure word, food and drinks have their own specific measure words. Using the correct one sounds more natural.",
        examples: [
          { correct: "一碗饭 (bowl of rice)", translation: "yì wǎn fàn" },
          { correct: "一杯咖啡 (cup of coffee)", translation: "yì bēi kāfēi" },
          { correct: "一瓶啤酒 (bottle of beer)", translation: "yì píng píjiǔ" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "restaurant-order",
        title: "Ordering at a Chinese Restaurant",
        situation: "You are at a small restaurant in China",
        agentRole: "You are a restaurant server. Welcome the customer, describe a few dishes, and take their order. Use measure words naturally.",
        userGoal: "Order food and drinks using correct measure words",
        targetPhrases: ["我要一碗...", "一杯...", "请给我..."],
        successCriteria: ["Uses 碗 for rice/noodles/soup", "Uses 杯 for drinks", "Orders at least 2 items"],
      },
    ],
    culturalNotes: [
      {
        title: "Tea Culture in China",
        content: "Tea (茶 chá) is deeply woven into Chinese culture. When someone pours tea for you, tap two fingers on the table as a silent 'thank you' -- this custom comes from a Qing dynasty emperor who disguised himself as a commoner, and his companions tapped fingers to 'bow' without revealing his identity.",
      },
    ],
  },
  {
    id: "zh-b-l17",
    slug: "want-xiang-yao",
    title: "Wanting: 想 vs. 要",
    content: `# Wanting: 想 vs. 要

Both 想 and 要 express wanting, but they differ in strength and nuance.

## 想 (xiǎng) -- Would Like / Want (softer)

- **我想吃饺子。** (Wǒ xiǎng chī jiǎozi.) -- I'd like to eat dumplings.
- **我想去中国。** (Wǒ xiǎng qù Zhōngguó.) -- I'd like to go to China.
- **你想喝什么？** (Nǐ xiǎng hē shénme?) -- What would you like to drink?

## 要 (yào) -- Want / Need / Will (stronger)

- **我要一杯水。** (Wǒ yào yì bēi shuǐ.) -- I want a glass of water.
- **我要去。** (Wǒ yào qù.) -- I'm going to go. / I want to go.
- **你要几个？** (Nǐ yào jǐ gè?) -- How many do you want?

## 太...了 (tài...le) -- Too...!

Express that something is excessive:
- **太好了！** (Tài hǎo le!) -- Great! / Awesome!
- **太贵了！** (Tài guì le!) -- Too expensive!
- **太辣了。** (Tài là le.) -- Too spicy.

## Negation

- **我不想吃。** -- I don't want to eat. (polite)
- **我不要。** -- I don't want it. (direct/blunt)`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m6",
    moduleTitle: "Food & Dining",
    order: 17,
    topicId: "zh-beginner-want-xiang-yao",
    vocabulary: [
      {
        word: "要",
        translation: "to want / to need / will",
        pronunciation: "yào",
        exampleSentence: "我要一个这个。",
        exampleTranslation: "I want one of these.",
        partOfSpeech: "verb",
      },
      {
        word: "太",
        translation: "too (excessive)",
        pronunciation: "tài",
        exampleSentence: "太贵了！",
        exampleTranslation: "Too expensive!",
        partOfSpeech: "adverb",
      },
      {
        word: "辣",
        translation: "spicy",
        pronunciation: "là",
        exampleSentence: "这个菜太辣了。",
        exampleTranslation: "This dish is too spicy.",
        partOfSpeech: "adjective",
      },
      {
        word: "好吃",
        translation: "delicious",
        pronunciation: "hǎochī",
        exampleSentence: "这个很好吃！",
        exampleTranslation: "This is delicious!",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "想 vs. 要",
        explanation: "想 is softer and more polite ('would like to'). 要 is more direct and assertive ('want' or 'need'). In restaurants, both are acceptable, but 想 sounds more polite.",
        examples: [
          { correct: "我想喝茶。", translation: "I'd like to drink tea. (polite)" },
          { correct: "我要茶。", translation: "I want tea. (direct, fine in a restaurant)" },
        ],
      },
      {
        title: "太 + Adjective + 了",
        explanation: "This structure means 'too [adjective]!' It can express both complaints and excitement. The 了 at the end is required.",
        examples: [
          { correct: "太好了！", translation: "Awesome! (lit: too good!)" },
          { correct: "太贵了。", translation: "Too expensive." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ordering-food",
        title: "A Full Meal Order",
        situation: "Ordering a complete meal at a restaurant",
        agentRole: "You are a waiter. Present the menu items, ask what the customer wants, and respond to feedback about food (too spicy, delicious, etc.).",
        userGoal: "Order a full meal using 想/要 and react to the food with 太...了",
        targetPhrases: ["我想要...", "太好吃了", "不要太辣"],
        successCriteria: ["Uses 想 or 要 to order", "Reacts with 太...了", "Completes a full order"],
      },
    ],
  },
  {
    id: "zh-b-l18",
    slug: "ordering-food",
    title: "Ordering at a Restaurant",
    content: `# Ordering at a Restaurant

Put it all together: ordering food like a local.

## Useful Restaurant Phrases

- **服务员！** (Fúwùyuán!) -- Waiter!/Waitress!
- **请给我菜单。** (Qǐng gěi wǒ càidān.) -- Please give me the menu.
- **我要点菜。** (Wǒ yào diǎn cài.) -- I'd like to order.
- **有没有...？** (Yǒu méi yǒu...?) -- Do you have...?
- **我吃素。** (Wǒ chī sù.) -- I'm vegetarian.
- **买单！/ 结账！** (Mǎidān! / Jiézhàng!) -- Check, please!

## Expressing Preferences

- **我不能吃...** (Wǒ bù néng chī...) -- I can't eat...
- **不要放味精。** (Bú yào fàng wèijīng.) -- Don't add MSG.
- **少放盐。** (Shǎo fàng yán.) -- Less salt, please.
- **多放辣椒。** (Duō fàng làjiāo.) -- More chili, please.

## Complimenting the Food

- **很好吃！** (Hěn hǎochī!) -- Very delicious!
- **味道很好。** (Wèidao hěn hǎo.) -- The flavor is great.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m6",
    moduleTitle: "Food & Dining",
    order: 18,
    topicId: "zh-beginner-ordering-food",
    vocabulary: [
      {
        word: "服务员",
        translation: "waiter / waitress",
        pronunciation: "fúwùyuán",
        exampleSentence: "服务员，买单！",
        exampleTranslation: "Waiter, the check please!",
        partOfSpeech: "noun",
      },
      {
        word: "菜单",
        translation: "menu",
        pronunciation: "càidān",
        exampleSentence: "请给我菜单。",
        exampleTranslation: "Please give me the menu.",
        partOfSpeech: "noun",
      },
      {
        word: "买单",
        translation: "to pay the bill",
        pronunciation: "mǎidān",
        exampleSentence: "我来买单。",
        exampleTranslation: "I'll get the check.",
        partOfSpeech: "verb",
      },
      {
        word: "请",
        translation: "please / to invite",
        pronunciation: "qǐng",
        exampleSentence: "请坐。",
        exampleTranslation: "Please sit.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "有没有 (yǒu méi yǒu) - Affirmative-Negative Questions",
        explanation: "Another way to ask yes/no questions is to put the positive and negative forms side by side. 有没有 literally means 'have-not-have?' This is very common in spoken Chinese.",
        examples: [
          { correct: "有没有可乐？", translation: "Do you have cola? (have-not-have cola?)" },
          { correct: "你是不是学生？", translation: "Are you a student? (are-not-are student?)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "full-restaurant-experience",
        title: "Full Restaurant Experience",
        situation: "From entering a restaurant to paying the bill",
        agentRole: "You are a server at a Beijing restaurant. Seat the customer, present recommendations, take the order, check how the food is, and bring the bill.",
        userGoal: "Navigate the entire restaurant experience from greeting to paying",
        targetPhrases: ["请给我菜单", "我要...", "有没有...", "买单"],
        successCriteria: ["Asks for menu", "Orders food and drink", "Asks about availability", "Asks for the bill"],
      },
    ],
    culturalNotes: [
      {
        title: "Paying the Bill in China",
        content: "Fighting over the bill (抢着买单 qiǎngzhe mǎidān) is a beloved Chinese tradition. When dining with Chinese friends, expect a friendly 'battle' over who pays. The host or the person who invited usually wins. Splitting the bill (AA制) is becoming more common among young people but is still uncommon in traditional settings.",
      },
    ],
  },
];

// ============================================
// Module 7: Shopping
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l19",
    slug: "this-that-colors",
    title: "This, That & Colors",
    content: `# This, That & Colors

Point at things and describe what you want.

## This and That

- **这** (zhè) -- this
- **那** (nà) -- that
- **这个** (zhège) -- this one
- **那个** (nàge) -- that one

Examples:
- **这个多少钱？** -- How much is this?
- **我要那个。** -- I want that one.
- **这个好看。** -- This one looks good.

## Colors

- **红色** (hóngsè) -- red
- **蓝色** (lánsè) -- blue
- **绿色** (lǜsè) -- green
- **黄色** (huángsè) -- yellow
- **白色** (báisè) -- white
- **黑色** (hēisè) -- black

## Colors as Descriptions

- **红色的** (hóngsè de) -- the red one
- **我要蓝色的。** -- I want the blue one.
- **有没有黑色的？** -- Do you have it in black?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m7",
    moduleTitle: "Shopping",
    order: 19,
    topicId: "zh-beginner-this-that-colors",
    vocabulary: [
      {
        word: "这",
        translation: "this",
        pronunciation: "zhè",
        exampleSentence: "这是什么？",
        exampleTranslation: "What is this?",
        partOfSpeech: "pronoun",
      },
      {
        word: "那",
        translation: "that",
        pronunciation: "nà",
        exampleSentence: "那个是我的。",
        exampleTranslation: "That one is mine.",
        partOfSpeech: "pronoun",
      },
      {
        word: "红色",
        translation: "red",
        pronunciation: "hóngsè",
        exampleSentence: "我喜欢红色。",
        exampleTranslation: "I like red.",
        partOfSpeech: "noun",
      },
      {
        word: "蓝色",
        translation: "blue",
        pronunciation: "lánsè",
        exampleSentence: "有蓝色的吗？",
        exampleTranslation: "Do you have it in blue?",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "这/那 + Measure Word + Noun",
        explanation: "Just like numbers, 这 and 那 require a measure word before the noun. 这个 and 那个 are the most common combinations.",
        examples: [
          { correct: "这个人", translation: "this person" },
          { correct: "那本书", translation: "that book" },
          { correct: "这杯茶", translation: "this cup of tea" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "pointing-shopping",
        title: "Window Shopping",
        situation: "You are browsing a clothing store",
        agentRole: "You are a shop assistant. Help the customer find items, suggest colors, and answer questions about products.",
        userGoal: "Ask about items using 这/那, ask about colors, and express preferences",
        targetPhrases: ["这个多少钱？", "有没有...色的？", "我要那个"],
        successCriteria: ["Uses 这/那 to point at items", "Asks about colors", "Makes a selection"],
      },
    ],
  },
  {
    id: "zh-b-l20",
    slug: "comparisons-bi",
    title: "Comparisons with 比",
    content: `# Comparisons with 比

Compare two things using the structure A 比 B + adjective.

## Basic Comparison: A 比 (bǐ) B + Adjective

- **他比我高。** (Tā bǐ wǒ gāo.) -- He is taller than me.
- **这个比那个贵。** (Zhège bǐ nàge guì.) -- This one is more expensive than that one.
- **今天比昨天冷。** (Jīntiān bǐ zuótiān lěng.) -- Today is colder than yesterday.

## 还是 (háishi) -- Or (in questions)

Used when asking someone to choose between options:
- **你要红色的还是蓝色的？** -- Do you want the red one or the blue one?
- **喝茶还是喝咖啡？** -- Tea or coffee?

## Shopping Phrases

- **大一点** (dà yìdiǎn) -- a little bigger
- **小一点** (xiǎo yìdiǎn) -- a little smaller
- **便宜一点** (piányi yìdiǎn) -- a little cheaper
- **有没有大一点的？** -- Do you have a slightly bigger one?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m7",
    moduleTitle: "Shopping",
    order: 20,
    topicId: "zh-beginner-comparisons-bi",
    vocabulary: [
      {
        word: "比",
        translation: "compared to / than",
        pronunciation: "bǐ",
        exampleSentence: "苹果比香蕉贵。",
        exampleTranslation: "Apples are more expensive than bananas.",
        partOfSpeech: "preposition",
      },
      {
        word: "贵",
        translation: "expensive",
        pronunciation: "guì",
        exampleSentence: "太贵了！",
        exampleTranslation: "Too expensive!",
        partOfSpeech: "adjective",
      },
      {
        word: "便宜",
        translation: "cheap / inexpensive",
        pronunciation: "piányi",
        exampleSentence: "这个很便宜。",
        exampleTranslation: "This is very cheap.",
        partOfSpeech: "adjective",
      },
      {
        word: "还是",
        translation: "or (in questions)",
        pronunciation: "háishi",
        exampleSentence: "你要大的还是小的？",
        exampleTranslation: "Do you want the big one or the small one?",
        partOfSpeech: "conjunction",
      },
    ],
    grammarPoints: [
      {
        title: "比 Comparisons",
        explanation: "The pattern is: A 比 B + adjective. Do NOT add 很 before the adjective in a 比 sentence. To say 'much more', add 多了 after the adjective.",
        examples: [
          { correct: "他比我高。", translation: "He is taller than me." },
          { correct: "这个比那个贵多了。", translation: "This one is much more expensive than that one." },
        ],
        commonMistakes: [
          {
            incorrect: "他比我很高。",
            correction: "他比我高。",
            explanation: "Do not use 很 in a 比 comparison. The comparison itself implies the degree.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "comparing-items",
        title: "Choosing Between Items",
        situation: "You are deciding between two products at a market",
        agentRole: "You are a vendor showing two versions of a product. Describe differences and ask which the customer prefers using 还是.",
        userGoal: "Compare items using 比, answer 还是 questions, and negotiate price",
        targetPhrases: ["这个比那个...", "还是...", "便宜一点"],
        successCriteria: ["Makes a comparison with 比", "Responds to 还是 question", "Attempts to negotiate"],
      },
    ],
  },
  {
    id: "zh-b-l21",
    slug: "bargaining",
    title: "Bargaining & Clothing",
    content: `# Bargaining & Clothing

In Chinese markets, bargaining is expected. Learn the phrases to get a good deal.

## Clothing Vocabulary

- **衣服** (yīfu) -- clothing
- **裤子** (kùzi) -- pants
- **鞋子** (xiézi) -- shoes
- **裙子** (qúnzi) -- skirt / dress
- **大** (dà) -- big / large
- **小** (xiǎo) -- small

## Bargaining Phrases

- **多少钱？** (Duōshao qián?) -- How much?
- **太贵了！** (Tài guì le!) -- Too expensive!
- **便宜一点吧。** (Piányi yìdiǎn ba.) -- Make it a little cheaper.
- **能不能便宜一点？** (Néng bù néng piányi yìdiǎn?) -- Can you make it cheaper?
- **最低多少？** (Zuìdī duōshao?) -- What's the lowest price?
- **算了，不要了。** (Suàn le, bú yào le.) -- Forget it, I don't want it.

## Sizes

- **大号** (dà hào) -- large size
- **中号** (zhōng hào) -- medium size
- **小号** (xiǎo hào) -- small size
- **有没有大一号的？** -- Do you have the next size up?`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m7",
    moduleTitle: "Shopping",
    order: 21,
    topicId: "zh-beginner-bargaining",
    vocabulary: [
      {
        word: "衣服",
        translation: "clothing",
        pronunciation: "yīfu",
        exampleSentence: "这件衣服很好看。",
        exampleTranslation: "This piece of clothing looks great.",
        partOfSpeech: "noun",
      },
      {
        word: "钱",
        translation: "money",
        pronunciation: "qián",
        exampleSentence: "多少钱？",
        exampleTranslation: "How much money?",
        partOfSpeech: "noun",
      },
      {
        word: "鞋子",
        translation: "shoes",
        pronunciation: "xiézi",
        exampleSentence: "这双鞋子太小了。",
        exampleTranslation: "These shoes are too small.",
        partOfSpeech: "noun",
      },
      {
        word: "能",
        translation: "can / able to",
        pronunciation: "néng",
        exampleSentence: "能便宜一点吗？",
        exampleTranslation: "Can you make it cheaper?",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "能不能 (néng bù néng) for Polite Requests",
        explanation: "Using the affirmative-negative pattern 能不能 softens a request into 'can you or can't you...?' This is more polite than a flat request.",
        examples: [
          { correct: "能不能便宜一点？", translation: "Could you make it a bit cheaper?" },
          { correct: "能不能帮我？", translation: "Could you help me?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "market-bargaining",
        title: "Bargaining at the Market",
        situation: "You are at a street market buying clothes",
        agentRole: "You are a market vendor. Quote a high initial price and be willing to negotiate. Use common bargaining tactics.",
        userGoal: "Ask prices, bargain down using standard phrases, and complete a purchase",
        targetPhrases: ["多少钱？", "太贵了", "便宜一点吧", "能不能..."],
        successCriteria: ["Asks the price", "Says it's too expensive", "Negotiates a lower price", "Completes the transaction"],
      },
    ],
    culturalNotes: [
      {
        title: "Where to Bargain in China",
        content: "Bargaining is expected at street markets, small shops, and tourist areas. However, do NOT bargain at department stores, supermarkets, or restaurants -- prices are fixed. A good rule: if there is no price tag, you can bargain. Start by offering about 50-60% of the asking price and negotiate from there.",
      },
    ],
  },
];

// ============================================
// Module 8: Transportation
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "zh-b-l22",
    slug: "location-zai",
    title: "Location with 在 & Position Words",
    content: `# Location with 在 & Position Words

在 (zài) indicates location -- where something is or where an action takes place.

## 在 (zài) -- At / In / On

- **我在家。** (Wǒ zài jiā.) -- I'm at home.
- **他在学校。** (Tā zài xuéxiào.) -- He's at school.
- **书在桌子上。** (Shū zài zhuōzi shang.) -- The book is on the table.

## Position Words (方位词)

- **里** (lǐ) -- inside
- **上** (shàng) -- on top / above
- **下** (xià) -- below / under
- **旁边** (pángbiān) -- beside / next to
- **前面** (qiánmiàn) -- in front
- **后面** (hòumiàn) -- behind
- **对面** (duìmiàn) -- opposite / across

## Pattern: Noun + Position Word

- **桌子上** (zhuōzi shàng) -- on the table
- **学校里** (xuéxiào lǐ) -- inside the school
- **银行旁边** (yínháng pángbiān) -- next to the bank
- **地铁站对面** (dìtiě zhàn duìmiàn) -- across from the subway station`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m8",
    moduleTitle: "Transportation",
    order: 22,
    topicId: "zh-beginner-location-zai",
    vocabulary: [
      {
        word: "在",
        translation: "at / in / on (location)",
        pronunciation: "zài",
        exampleSentence: "你在哪里？",
        exampleTranslation: "Where are you?",
        partOfSpeech: "preposition",
      },
      {
        word: "里",
        translation: "inside",
        pronunciation: "lǐ",
        exampleSentence: "猫在箱子里。",
        exampleTranslation: "The cat is inside the box.",
        partOfSpeech: "noun",
      },
      {
        word: "旁边",
        translation: "beside / next to",
        pronunciation: "pángbiān",
        exampleSentence: "银行在超市旁边。",
        exampleTranslation: "The bank is next to the supermarket.",
        partOfSpeech: "noun",
      },
      {
        word: "哪里",
        translation: "where",
        pronunciation: "nǎlǐ",
        exampleSentence: "厕所在哪里？",
        exampleTranslation: "Where is the restroom?",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "在 for Location vs. Action Location",
        explanation: "在 has two patterns: (1) Subject + 在 + Place = 'is at a place'; (2) Subject + 在 + Place + Verb = 'does something at a place'. Pattern 2 places 在 before the verb.",
        examples: [
          { correct: "我在家。", translation: "I'm at home. (location)" },
          { correct: "我在家吃饭。", translation: "I eat at home. (action at location)" },
        ],
        commonMistakes: [
          {
            incorrect: "我吃饭在家。",
            correction: "我在家吃饭。",
            explanation: "The location phrase (在 + place) comes BEFORE the verb, not after.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "finding-places",
        title: "Asking Where Things Are",
        situation: "You are looking for various places in a neighborhood",
        agentRole: "You are a helpful local. When asked about locations, describe where things are using position words.",
        userGoal: "Ask where places are and understand location descriptions",
        targetPhrases: ["在哪里？", "在...旁边", "在...对面"],
        successCriteria: ["Asks location questions", "Understands position words", "Confirms understanding"],
      },
    ],
  },
  {
    id: "zh-b-l23",
    slug: "from-to-cong-dao",
    title: "From...To with 从...到",
    content: `# From...To with 从...到

Describe routes and distances using 从 (cóng, from) and 到 (dào, to/arrive).

## 从...到 (cóng...dào) -- From...To

- **从这里到那里** (cóng zhèlǐ dào nàlǐ) -- from here to there
- **从家到学校** (cóng jiā dào xuéxiào) -- from home to school
- **从北京到上海** (cóng Běijīng dào Shànghǎi) -- from Beijing to Shanghai

## Asking "How?"

- **怎么** (zěnme) -- how?
- **怎么去？** (Zěnme qù?) -- How do I get there?
- **你怎么去上班？** (Nǐ zěnme qù shàngbān?) -- How do you get to work?

## Transportation

- **坐** (zuò) -- to ride / to take (transport)
- **坐地铁** (zuò dìtiě) -- take the subway
- **坐公交车** (zuò gōngjiāo chē) -- take the bus
- **坐出租车** (zuò chūzū chē) -- take a taxi
- **走路** (zǒu lù) -- walk
- **骑自行车** (qí zìxíngchē) -- ride a bicycle

## Example Sentences

- **从这里怎么去地铁站？** -- How do I get to the subway station from here?
- **坐地铁大概二十分钟。** -- By subway it takes about 20 minutes.
- **我每天坐公交车去上班。** -- I take the bus to work every day.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m8",
    moduleTitle: "Transportation",
    order: 23,
    topicId: "zh-beginner-from-to-cong-dao",
    vocabulary: [
      {
        word: "从",
        translation: "from",
        pronunciation: "cóng",
        exampleSentence: "从这里走。",
        exampleTranslation: "Walk from here.",
        partOfSpeech: "preposition",
      },
      {
        word: "到",
        translation: "to / arrive",
        pronunciation: "dào",
        exampleSentence: "到了！",
        exampleTranslation: "We've arrived!",
        partOfSpeech: "preposition",
      },
      {
        word: "怎么",
        translation: "how",
        pronunciation: "zěnme",
        exampleSentence: "怎么去？",
        exampleTranslation: "How do I get there?",
        partOfSpeech: "pronoun",
      },
      {
        word: "地铁",
        translation: "subway",
        pronunciation: "dìtiě",
        exampleSentence: "我坐地铁去。",
        exampleTranslation: "I go by subway.",
        partOfSpeech: "noun",
      },
      {
        word: "坐",
        translation: "to sit / to take (transport)",
        pronunciation: "zuò",
        exampleSentence: "坐出租车吧。",
        exampleTranslation: "Let's take a taxi.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "从...到 for Routes",
        explanation: "从 marks the starting point and 到 marks the destination. The structure is: 从 + Place A + 到 + Place B.",
        examples: [
          { correct: "从我家到学校很近。", translation: "From my home to school is very close." },
          { correct: "从北京到上海坐高铁四个小时。", translation: "From Beijing to Shanghai by high-speed train is 4 hours." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "getting-around",
        title: "Getting Around the City",
        situation: "You need to get from your hotel to a tourist site",
        agentRole: "You are a hotel concierge. Help the guest figure out how to get to popular destinations. Suggest transportation options.",
        userGoal: "Ask how to get somewhere using 从...到 and 怎么, and discuss transport options",
        targetPhrases: ["从这里到...怎么去？", "坐地铁", "多长时间？"],
        successCriteria: ["Uses 从...到", "Asks 怎么去", "Understands transport suggestions"],
      },
    ],
  },
  {
    id: "zh-b-l24",
    slug: "asking-directions",
    title: "Asking & Giving Directions",
    content: `# Asking & Giving Directions

Navigate Chinese cities with confidence.

## Asking for Directions

- **请问，...在哪里？** (Qǐngwèn, ...zài nǎlǐ?) -- Excuse me, where is...?
- **请问，怎么去...？** (Qǐngwèn, zěnme qù...?) -- Excuse me, how do I get to...?
- **离这里远吗？** (Lí zhèlǐ yuǎn ma?) -- Is it far from here?

## Direction Words

- **左** (zuǒ) -- left
- **右** (yòu) -- right
- **前** (qián) -- forward / ahead
- **一直走** (yìzhí zǒu) -- go straight
- **往左拐** (wǎng zuǒ guǎi) -- turn left
- **往右拐** (wǎng yòu guǎi) -- turn right

## Common Destinations

- **地铁站** (dìtiě zhàn) -- subway station
- **医院** (yīyuàn) -- hospital
- **超市** (chāoshì) -- supermarket
- **银行** (yínháng) -- bank
- **厕所** (cèsuǒ) -- restroom

## Useful Responses

- **在前面。** (Zài qiánmiàn.) -- It's up ahead.
- **不远，走路五分钟。** (Bù yuǎn, zǒu lù wǔ fēnzhōng.) -- Not far, 5 minutes on foot.
- **你走错了。** (Nǐ zǒu cuò le.) -- You went the wrong way.`,
    targetLanguage: "zh",
    proficiencyLevel: "A1",
    moduleId: "zh-b-m8",
    moduleTitle: "Transportation",
    order: 24,
    topicId: "zh-beginner-asking-directions",
    vocabulary: [
      {
        word: "请问",
        translation: "excuse me (polite way to ask)",
        pronunciation: "qǐngwèn",
        exampleSentence: "请问，地铁站在哪里？",
        exampleTranslation: "Excuse me, where is the subway station?",
        partOfSpeech: "phrase",
      },
      {
        word: "左",
        translation: "left",
        pronunciation: "zuǒ",
        exampleSentence: "往左拐。",
        exampleTranslation: "Turn left.",
        partOfSpeech: "noun",
      },
      {
        word: "右",
        translation: "right",
        pronunciation: "yòu",
        exampleSentence: "往右拐。",
        exampleTranslation: "Turn right.",
        partOfSpeech: "noun",
      },
      {
        word: "远",
        translation: "far",
        pronunciation: "yuǎn",
        exampleSentence: "离这里远吗？",
        exampleTranslation: "Is it far from here?",
        partOfSpeech: "adjective",
      },
      {
        word: "近",
        translation: "near / close",
        pronunciation: "jìn",
        exampleSentence: "很近，走路两分钟。",
        exampleTranslation: "Very close, 2 minutes on foot.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "往 (wǎng) for Direction of Movement",
        explanation: "往 indicates the direction of movement. The pattern is: 往 + direction + verb (usually 走 go or 拐 turn).",
        examples: [
          { correct: "往左拐。", translation: "Turn left." },
          { correct: "往前走。", translation: "Go forward / Go straight." },
        ],
      },
      {
        title: "离 (lí) for Distance Between Places",
        explanation: "离 expresses the distance between two places. Pattern: Place A + 离 + Place B + 远/近.",
        examples: [
          { correct: "我家离学校很近。", translation: "My home is very close to school." },
          { correct: "这里离地铁站远吗？", translation: "Is it far from the subway station here?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "lost-in-city",
        title: "Lost in the City",
        situation: "You are lost and need to find the subway station",
        agentRole: "You are a passerby on a Beijing street. Give the student directions to the subway station using left, right, straight, and landmarks.",
        userGoal: "Ask for directions, understand the response, and confirm the route",
        targetPhrases: ["请问", "在哪里", "往左还是往右", "谢谢"],
        successCriteria: ["Politely asks for directions", "Understands directional words", "Confirms or asks for clarification"],
      },
    ],
    culturalNotes: [
      {
        title: "Navigation in Modern China",
        content: "While knowing direction words is important, most Chinese people navigate using their phones. Apps like Gaode Maps (高德地图) and Baidu Maps (百度地图) are more popular than Google Maps in China. When giving directions, Chinese people often reference landmarks (在星巴克旁边 -- next to Starbucks) rather than street names.",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "zh-b-m1",
    title: "Module 1: Pinyin & Tones",
    description: "The four tones, initials/finals, tone sandhi, and basic strokes",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "zh-b-m2",
    title: "Module 2: Greetings",
    description: "Hello/goodbye, 是 sentences, 吗 questions, 呢, and negation with 不",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "zh-b-m3",
    title: "Module 3: Family & People",
    description: "Family members, 有, counting with 几/多少, measure word 个, and 的 possession",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "zh-b-m4",
    title: "Module 4: Dates & Time",
    description: "Days of the week, months, telling time, 了 particle, and time-before-verb rule",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "zh-b-m5",
    title: "Module 5: Hobbies",
    description: "喜欢 likes/dislikes, 吧 suggestions, verb + 得, and 一起",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "zh-b-m6",
    title: "Module 6: Food & Dining",
    description: "Food measure words 碗/杯/瓶, 想/要 wanting, 太...了, and ordering food",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "zh-b-m7",
    title: "Module 7: Shopping",
    description: "这/那 demonstratives, 比 comparisons, 还是, colors, clothing, and bargaining",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "zh-b-m8",
    title: "Module 8: Transportation",
    description: "在 location, 从...到, 怎么, and direction words 里/上/下/旁边",
    order: 8,
    lessons: module8Lessons,
  },
];

export const chineseBeginnerCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getChineseBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findChineseBeginnerLesson(slug: string) {
  return getChineseBeginnerLessons().find((l) => l.slug === slug);
}
