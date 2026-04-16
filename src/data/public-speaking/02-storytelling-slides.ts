import { Module } from "../types";

export const module2: Module = {
  id: "storytelling-slides",
  title: "Storytelling, Slide Design & Q&A Mastery",
  description: "Tell stories that change minds, design slides that enhance (not replace) your message, and handle hostile Q&A with confidence",
  lessons: [
    {
      id: "storytelling-qa",
      slug: "storytelling-qa",
      title: "Storytelling, Slides & Handling Q&A",
      content: `# Storytelling, Slides & Q&A

The best speakers aren't the best talkers — they're the best storytellers. Stories bypass the rational mind and connect directly to emotion and memory.

---

## The Neuroscience of Storytelling

\`\`\`concept
{
  "title": "Why Stories Work",
  "variant": "mental-model",
  "content": "When someone hears a data point, only the language processing areas of the brain activate. When someone hears a story, multiple brain regions activate simultaneously: sensory cortex (they feel it), motor cortex (they simulate the actions), frontal cortex (they evaluate decisions). Stories produce neural coupling — the listener's brain syncs with the speaker's. Data informs; stories transform."
}
\`\`\`

---

## The Story Structure That Works

\`\`\`compare
{
  "title": "Business Story Elements",
  "items": [
    {
      "name": "Context (Setting the Scene)",
      "description": "Who, where, when. 'It was Q3 2023. Our team was 6 people, 3 months into a pivot.' Make it specific — specificity creates credibility and visual imagery. Vague context = vague engagement."
    },
    {
      "name": "Conflict (The Stakes)",
      "description": "Stories without conflict are reports. What was threatened? Revenue, reputation, relationship, opportunity? 'We had 30 days to save the product or the company would shut us down.' Conflict creates the tension that makes people listen."
    },
    {
      "name": "Turning Point",
      "description": "The moment of decision or discovery. 'Then we noticed something strange in the data — our highest-churn users were our highest-engagement users.' The insight that changes the trajectory."
    },
    {
      "name": "Resolution + Lesson",
      "description": "What happened. What changed. What it means for the audience. 'We shipped it in 3 weeks. Revenue 3x'd. The lesson: sometimes the obvious solution is wrong — ask why twice before acting.'"
    }
  ]
}
\`\`\`

## The Personal Story Formula

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Vulnerability Stories",
      "icon": "💙",
      "content": "### Stories That Build Connection\\n\\nVulnerability creates connection. The most memorable speakers are the ones who shared something real — a failure, a fear, a moment of doubt.\\n\\n**Structure:**\\n1. Set the scene specifically (time, place, stakes)\\n2. Describe what you thought vs. what was true\\n3. The moment you realized you were wrong\\n4. What you changed\\n5. What it means for them\\n\\n**Example:** 'I spent 3 years building the wrong product. I was so convinced I knew what users wanted that I stopped asking. The day I finally listened, a user said 9 words that changed everything: I use it, but I don't need it...'\\n\\n**Warning:** Vulnerability ≠ oversharing. Share struggles you've resolved. Ongoing struggles make the audience uncomfortable."
    },
    {
      "label": "Data + Story",
      "icon": "📊",
      "content": "### Make Data Human\\n\\nNumbers don't stick. Stories do. Combine them.\\n\\n**Bad:** 'We reduced customer churn by 23% in Q3.'\\n**Good:** 'Emma had been a customer for 6 months when she cancelled. Her reason? She wasn't sure she was making progress. That feedback, from Emma and 4,000 others like her, led us to build our progress tracking feature. Three months later, churn dropped 23%.'\\n\\n**Technique:** For every key metric, find the human story behind it. One person who represents the change.\\n\\n**Rule:** Introduce statistics AFTER the story, not before. The story gives the number meaning."
    }
  ]
}
\`\`\`

## Slide Design Principles

\`\`\`compare
{
  "title": "Slide Design Rules",
  "items": [
    {
      "name": "One idea per slide",
      "description": "If a slide has two ideas, make two slides. Cognitive load kills comprehension. The audience is either reading your slide OR listening to you — not both. One claim per slide means one thing to read, then full attention back to you."
    },
    {
      "name": "Use images, not bullets",
      "description": "Bullet points create a list to read, not a visual to process. Replace 3 bullets with 1 powerful image + your spoken words. Image memory is nearly perfect; text memory is poor. Exception: technical slides for developer audiences who will read them later."
    },
    {
      "name": "Contrast ratio",
      "description": "Dark text on light background (or vice versa) — minimum 4.5:1 ratio for readability. Gray text on white background is elegant on your laptop, invisible to the back row. When in doubt, increase contrast."
    },
    {
      "name": "Assertion headlines",
      "description": "Most slide titles are nouns: 'Q3 Sales Performance'. Change to assertion: 'Q3 Sales 47% Above Target — Led by Enterprise'. The headline tells the point; the chart provides evidence. Skimmers get the story from headlines alone."
    }
  ]
}
\`\`\`

## Mastering Q&A

\`\`\`concept
{
  "title": "Q&A is Part of Your Talk",
  "variant": "practical",
  "content": "Q&A is not a trap — it's your highest-credibility moment. Calm, thoughtful answers under pressure signal deep expertise. Defensive or flustered answers undermine everything you built. Treat every question as a gift, even hostile ones."
}
\`\`\`

**The Q&A Protocol:**
1. **Listen fully** — don't start answering before they finish
2. **Pause 2 seconds** — signals you're thinking, not reacting
3. **Restate the question** — ensures you understood, gives you time, re-focuses the room
4. **Answer briefly** — 1-3 sentences max, then stop
5. **Check in** — "Does that address what you were asking?"

**Handling hostile questions:**
- "That's a challenging perspective. Here's how I see it..."
- "I hear the frustration. Let me address the concern directly..."
- Never attack back. The audience is watching how you handle pressure.
- "That deserves a longer conversation. Can we connect after?"

**The question you don't know:**
Never fake an answer. "I don't know the specific data, but my intuition is... I'll follow up with you after." Honesty about limits is more credible than a bluffed answer.

\`\`\`takeaways
["Stories activate multiple brain regions simultaneously — emotions, senses, motor cortex. Data only activates language areas.", "Story formula: Context (specific) → Conflict (stakes) → Turning Point (insight) → Resolution + Lesson", "Data + story: introduce the human case first, then the statistic. The story gives the number meaning.", "Assertion headlines: 'Q3 Revenue 47% Above Target' not 'Q3 Revenue'. Skimmers get the story from headlines.", "Q&A: pause 2 seconds before answering, restate the question, answer in 1-3 sentences, check in", "'I don't know, I'll follow up' is more credible than a bluffed answer — honesty about limits builds trust"]
\`\`\`
`,
    },
  ],
};
