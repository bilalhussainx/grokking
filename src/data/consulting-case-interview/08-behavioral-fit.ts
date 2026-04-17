import { Module } from "../types";

export const module8: Module = {
  id: "behavioral-fit",
  title: "Behavioral & Fit Interviews (PEI)",
  description: "McKinsey's Personal Experience Interview, Bain's PEI, BCG's behavioral round — how to craft leadership stories, demonstrate consulting qualities, and answer the 'Why consulting?' question perfectly",
  lessons: [
    {
      id: "pei-framework",
      slug: "pei-framework",
      title: "The Personal Experience Interview (PEI)",
      content: `# The Personal Experience Interview

The PEI (McKinsey's term) or behavioral round tests whether you have the personal qualities to succeed as a consultant: leadership, impact, resilience, and the ability to work with people. A perfect case performance can be undone by weak behavioral answers.

---

\`\`\`concept
{
  "title": "What PEI Actually Tests",
  "variant": "mental-model",
  "content": "Firms aren't collecting your biography — they're screening for consulting-relevant character. McKinsey's PEI probes three qualities: (1) Personal impact — did you influence people who didn't report to you? (2) Leadership — did you guide a team through ambiguity without a formal mandate? (3) Entrepreneurial drive — did you create something from nothing or push through obstacles? BCG focuses on: leadership, teamwork, and conflict/failure handling. Bain probes: leadership, impact, and adaptability. The common thread: they want evidence that you operate like a consultant already, even before joining."
}
\`\`\`

---

## The STAR+ Framework

\`\`\`
Standard STAR (Situation-Task-Action-Result) is not enough for consulting.
You need STAR+:

S — Situation (20% of answer)
  Set context briefly. Don't over-narrate history.
  "During my second year at [company/school], we faced [specific challenge]."
  Keep this to 2-3 sentences.

T — Task (10% of answer)
  What was YOUR role and responsibility?
  Not the team's task — YOUR specific mandate.
  "My job was to [specific outcome], which meant [specific challenge unique to you]."

A — Action (50% of answer) ← THIS IS THE MOST IMPORTANT PART
  What did YOU specifically do?
  NOT: "We decided to..."
  YES: "I analyzed X, then persuaded Y by doing Z, which involved..."

  Break this into 2-3 clear action phases:
  1. How you diagnosed/assessed the situation
  2. How you influenced/led/acted
  3. How you course-corrected when obstacles appeared

R — Result (15% of answer)
  Quantify the outcome whenever possible.
  "The project delivered \$3.2M in savings / The team exceeded quota by 40% / etc."

+ — Reflection (5% of answer)
  One sentence: what would you do differently?
  This shows maturity and self-awareness — especially important at McKinsey.
\`\`\`

## The 5 Stories You Must Prepare

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Leadership Story",
      "content": "THE QUESTION: 'Tell me about a time you led a team through a difficult challenge.'\n\nWhat they want: Evidence you guided others WITHOUT formal authority — peers, seniors, or external stakeholders.\n\nCommon mistake: Describing when you were the boss and people just did what you said.\nWhat consulting looks for: Influencing without authority, mobilizing people who don't report to you.\n\nStrong story elements:\n• Stakeholders with conflicting interests that you aligned\n• Resistance you overcame (without power to force compliance)\n• Ambiguous situation where you set direction without a playbook\n• Measurable impact on the team's outcome\n\nSample story structure:\n'As a junior analyst, I noticed our client project was stalling because three senior partners disagreed on the approach. Although I had no formal authority, I [action: synthesized the disagreements, proposed a framework both sides could accept, facilitated a structured session, etc.]. The result was [specific outcome]. In retrospect, I would have [self-correction].'"
    },
    {
      "label": "Impact Story",
      "content": "THE QUESTION: 'Tell me about a time you had a significant impact on an organization or group.'\n\nWhat they want: You created measurable, lasting change — not just did your job well.\n\nKey elements:\n• Impact that outlasted your individual involvement\n• Scope that exceeded your formal role\n• Quantified outcomes (revenue, cost, users affected, process improvement %)\n\nTypes of impact consulting firms value:\n• Turned around a failing initiative\n• Built something that didn't exist (new process, product, organization)\n• Influenced a decision at a level above your seniority\n• Delivered measurable financial or operational results\n\nPitfall to avoid: Stories where the impact was 'I did good work on a project that went well.' That's not impact — that's performance. Impact means you changed something that wouldn't have changed without you."
    },
    {
      "label": "Failure/Challenge Story",
      "content": "THE QUESTION: 'Tell me about your biggest professional failure. / Describe a time things went wrong.'\n\nWhat they want: Maturity, self-awareness, and resilience — NOT perfection.\n\nThe trap: Fake failures ('I work too hard') or transferring blame ('the team didn't execute').\n\nWhat interviewers want to see:\n1. You acknowledge genuine responsibility without catastrophizing\n2. You took concrete action to salvage the situation\n3. You learned something specific that changed your behavior\n4. You can discuss it with equanimity (not still defensive)\n\nStructure:\n'I led a project where [describe genuine failure — missed deadline, wrong analysis, poor client communication]. My role in this was [specific contribution to the failure — don't blame others]. I responded by [actions taken to mitigate]. The lesson I internalized was [specific behavioral change, with example of applying it since].'\n\nPowerful closing: 'Since then, I always [specific behavior change] because I've seen firsthand what happens when [failure condition] goes unaddressed.'"
    },
    {
      "label": "Teamwork/Conflict Story",
      "content": "THE QUESTION: 'Describe a time you worked with a difficult team member / navigated conflict.'\n\nWhat they want: Emotional intelligence, constructive conflict resolution, and team orientation.\n\nPitfall: Stories where you were obviously right and the other person was obviously wrong. Interviewers know real conflict is more nuanced.\n\nGood conflict story elements:\n• The other person had a legitimate perspective (even if you disagreed)\n• You tried to understand their position before advocating yours\n• Resolution served the project/team, not just your preference\n• Relationship was preserved or improved\n\nMcKinsey specifically probes: 'What would they say about you?' — Be prepared to give an honest, non-defensive answer that demonstrates empathy and self-awareness.\n\nStructure for conflict with a peer:\n'A teammate and I fundamentally disagreed about [approach]. I first tried to understand their perspective by [specific action — asking questions, reading their analysis]. I realized [genuine insight into their view]. I then proposed [specific resolution — compromise, escalation, test, etc.]. The outcome was [result that served the team].'"
    },
    {
      "label": "Why Consulting?",
      "content": "THE QUESTION: 'Why consulting? Why McKinsey/BCG/Bain specifically?'\n\nThis is mandatory and universally asked. A weak answer here fails the interview regardless of case performance.\n\nWhat they're testing: Are you here for the right reasons? Will you stay when it gets hard?\n\nWeak answers (immediately raise red flags):\n• 'I want to learn a lot' (every job has learning)\n• 'I like solving problems' (too generic)\n• 'The compensation is great' (never say this)\n• 'I don't know what I want to do yet' (why should we invest in training you?)\n\nStrong answer structure (3 parts):\n1. PULL toward consulting (what specifically draws you)\n   → The breadth of problems, working with C-suite early, the feedback culture, the model of external advisory\n   → Be specific: reference a consulting output you found compelling (McKinsey report, BCG case study, etc.)\n\n2. YOUR FIT with consulting (why you, specifically)\n   → Connect your actual experience: 'When I did [X], I realized I thrive in [consulting-relevant context]'\n   → Show you've already been doing consulting-like work\n\n3. Why THIS FIRM (not just consulting generally)\n   → McKinsey: global footprint, transformation work, PST rigor, alumni network\n   → BCG: innovation/R&D cases, BCG Henderson Institute, Henderson's legacy\n   → Bain: PE practice (#1 in PE work), results orientation, Bain culture ('Bain World')\n   → Be genuine — if you've spoken with consultants from the firm, mention what you learned"
    }
  ]
}
\`\`\`

## Delivering PEI Stories: The Mechanics

\`\`\`
PACING AND DELIVERY:

Length: 2-3 minutes per story (not longer — they'll interrupt)
Start with the punchline: 'A story that shows my leadership is when I turned around
a failing student government initiative before our university's biggest conference.'
Then STAR+ in order.

COMMON MISTAKES:
1. Too much context (spending 90 seconds on setup before the interesting part)
2. Using 'we' when they want 'I' — always attribute your specific actions
3. No numbers — quantify everything possible
4. Stopping at the result without reflection
5. Single-story preparation — prepare 5 distinct stories, not 1 told 5 ways

MCKINSEY-SPECIFIC: They will probe each story with follow-ups:
'What was the hardest part of that?'
'What would you do differently now?'
'How did [specific person] respond when you did that?'
Practice your stories deeply enough to answer detailed follow-ups without stumbling.
\`\`\`

\`\`\`takeaways
["PEI tests leadership, personal impact, and entrepreneurial drive — not just case-solving ability.", "STAR+: Situation (brief), Task (your role), Action (50% of answer — be specific with 'I'), Result (quantified), Reflection (what you'd change).", "The Action is the most important part — consultants want to see HOW you influenced, not just that things worked out.", "Prepare 5 distinct stories: leadership, impact, failure, conflict, and why consulting.", "Why consulting: pull toward the work + your fit + why THIS firm specifically (not generic reasons).", "Always quantify outcomes. 'The project went well' is not a result. '\$2.3M in savings delivered, 6 weeks ahead of schedule' is."]
\`\`\`
`,
    },
  ],
};
