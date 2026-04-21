import { Module } from "../types";

export const lifeOfJesusModule: Module = {
  id: "christianity-life-of-jesus",
  title: "The Life and Teachings of Jesus",
  description: "Explore the ministry, parables, miracles, death, and resurrection of Jesus of Nazareth as presented in the four Gospels. Resources: N.T. Wright, Simply Jesus; Richard Bauckham, Jesus and the Eyewitnesses.",
  lessons: [
    {
      id: "christianity-ministry-of-jesus",
      slug: "ministry-of-jesus",
      title: "The Ministry of Jesus",
      content: `## The Ministry of Jesus

<!-- voice:section_check concept="Jesus' public ministry — teaching, parables, and the Kingdom of God" -->

Jesus began his public ministry around age 30, after being baptized by **John the Baptist** in the Jordan River. This moment launched a period scholars estimate at approximately three years, based on references to multiple Passover feasts in the Gospel of John (John 2:13, 6:4, 11:55–57). His opening proclamation set the agenda for everything that followed:

> "The time has come. The kingdom of God has come near. Repent and believe the good news!"
> — Mark 1:15 NIV

\`\`\`concept
{
  "title": "The Kingdom of God (Basileia tou Theou)",
  "variant": "mental-model",
  "content": "The Kingdom of God is not a geographical territory — it is the reign and rule of God actively breaking into human history. Jesus announced that this reign was arriving through his own presence and work. Think of it less like a place you enter and more like a power that enters the world: healing, restoring, reversing the damage of sin, and calling people into a new way of life under God's authority."
}
\`\`\`

### Parables: The Kingdom in Story Form

Jesus taught the Kingdom through vivid **parables** — short stories drawn from everyday life that carry a subversive punch. A full treatment of the parables appears in Klyne Snodgrass, *Stories with Intent* (Eerdmans, 2008).

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Good Samaritan",
      "icon": "🛣️",
      "content": "**Luke 10:25–37** — A man beaten on the road to Jericho is ignored by a priest and a Levite, but rescued by a Samaritan — the ethnic and religious outsider.\\n\\n**The subversion:** Jesus makes the despised foreigner the moral hero. When a Jewish lawyer asked 'Who is my neighbour?' he expected the answer to confirm his boundaries. Jesus explodes them.\\n\\n**Kingdom teaching:** Love crosses every ethnic and religious boundary."
    },
    {
      "label": "Prodigal Son",
      "icon": "🏠",
      "content": "**Luke 15:11–32** — A son demands his inheritance early (tantamount to wishing his father dead in the ancient world), wastes it, and returns in desperation. The father runs to meet him.\\n\\n**The subversion:** The father's extravagant welcome — robe, ring, fatted calf — violates the expected narrative of shame and consequence. The dutiful elder brother's resentment mirrors those who resent God's grace toward 'sinners.'\\n\\n**Kingdom teaching:** God's welcome is extravagant and unconditional, not earned."
    },
    {
      "label": "Mustard Seed",
      "icon": "🌱",
      "content": "**Mark 4:30–32** — The Kingdom is compared to the smallest of seeds, which grows into a tree large enough for birds to nest in.\\n\\n**The subversion:** Jesus' movement looked insignificant — a handful of Galilean fishermen. The parable insists that humble, invisible beginnings are no measure of ultimate impact.\\n\\n**Kingdom teaching:** The Kingdom starts small but its growth is unstoppable."
    },
    {
      "label": "The Sower",
      "icon": "🌾",
      "content": "**Mark 4:1–20** — Seed falls on four types of ground: the path (birds eat it), rocky soil (no roots), thorns (choked), and good soil (abundant harvest).\\n\\n**The subversion:** Jesus offers an explanation for why his own message was not universally received — the problem is not with the seed but with the condition of the hearer's heart.\\n\\n**Kingdom teaching:** How we receive God's word determines the fruit it bears in our lives."
    },
    {
      "label": "Sheep & Goats",
      "icon": "⚖️",
      "content": "**Matthew 25:31–46** — At the final judgment, the king separates 'sheep' from 'goats' based on whether they fed the hungry, clothed the naked, and visited the imprisoned. The righteous are surprised — they didn't realise they were serving the king.\\n\\n**The subversion:** Judgment is not based on religious performance or doctrinal knowledge but on concrete acts of mercy toward 'the least of these.'\\n\\n**Kingdom teaching:** Caring for the vulnerable is caring for Christ himself."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Parables Are Not Simple Moral Fables",
  "content": "A common misreading treats parables as gentle illustrations. In context they are *subversive*. The Good Samaritan crowns the despised outsider as the hero. The Prodigal Son celebrates a wasteful sinner over a dutiful elder brother. The Sheep and Goats ties salvation to acts of mercy, not Temple observance. The Kingdom Jesus proclaimed consistently inverted social expectations — the last shall be first, the meek shall inherit the earth, tax collectors enter ahead of the righteous."
}
\`\`\`

### The Sermon on the Mount

Jesus' longest recorded teaching — **Matthew 5–7** — opens with the **Beatitudes**: a series of blessings pronounced on precisely those people first-century society overlooked or condemned.

\`\`\`steps
{
  "title": "Structure of the Sermon on the Mount (Matthew 5–7)",
  "steps": [
    {
      "title": "The Beatitudes (5:3–12)",
      "content": "Eight blessings on the 'poor in spirit,' the mourning, the meek, the persecuted. These are not instructions ('try to be meek') but announcements: God's kingdom belongs to people on the margins, not the powerful.\\n\\n> 'Blessed are the meek, for they will inherit the earth.' — Matthew 5:5"
    },
    {
      "title": "Salt, Light, and the Law (5:13–48)",
      "content": "Jesus positions his followers as 'salt of the earth' and 'light of the world.' He then offers a series of *antitheses*: 'You have heard it said... but I say to you.' He radicalises the Torah inward — anger is the root of murder; lust is the root of adultery — showing that righteousness must exceed mere outward compliance.\\n\\nHe also commands love of enemies: *'Love your enemies and pray for those who persecute you.'* — Matthew 5:44"
    },
    {
      "title": "Authentic Piety (6:1–18)",
      "content": "Three religious practices — giving, prayer, fasting — are each reoriented away from public performance and toward a private relationship with God.\\n\\nAt the centre sits the **Lord's Prayer** (Matthew 6:9–13), a model of how to pray: addressing God as Father, seeking his kingdom's arrival, asking for daily provision and forgiveness."
    },
    {
      "title": "Treasure, Anxiety, and Judgement (6:19–7:12)",
      "content": "Jesus addresses the twin anxieties of wealth and worry. 'You cannot serve both God and money' (6:24). He calls hearers to trust God for material needs, and climaxes with the **Golden Rule**:\\n\\n> 'Do to others what you would have them do to you, for this sums up the Law and the Prophets.' — Matthew 7:12"
    },
    {
      "title": "Two Paths and Two Builders (7:13–29)",
      "content": "The sermon closes with stark alternatives: the narrow vs. wide gate, true vs. false prophets, and the famous parable of the two builders. The wise builder hears *and acts* on Jesus' words — the house stands in the storm. The foolish builder hears but does not act — the house collapses.\\n\\nThe crowds were 'amazed' because Jesus taught 'as one who had authority, not as their teachers of the law' (7:28–29)."
    }
  ]
}
\`\`\`

### The Ministry's Arc

\`\`\`mermaid
graph LR
    A[Baptism] --> B[Galilee<br>Ministry]
    B --> C[Transfiguration]
    C --> D[Jerusalem<br>Entry]
    D --> E[Crucifixion]
    E --> F[Resurrection]
\`\`\`

The ministry moved geographically from the margins to the centre — from rural Galilee to the Temple in Jerusalem — and theologically from proclamation to confrontation to sacrifice.

### Jesus and the Marginalized

A striking feature of Jesus' ministry was his consistent, deliberate attention to people excluded from the social and religious mainstream:

| Group | Example | Significance |
|-------|---------|--------------|
| **Women** | Mary Magdalene, Joanna, Susanna (Luke 8:1–3) | Included as active followers and witnesses |
| **Tax collectors** | Eating with Matthew and Zacchaeus (Mark 2:15–17; Luke 19) | Crossed social taboos with public sinners |
| **Lepers** | Touched and healed (Mark 1:40–42) | Physical contact with the ritually 'untouchable' |
| **Gentiles** | Healed the centurion's servant (Matthew 8:5–13) | Extended God's mercy beyond ethnic Israel |
| **Children** | Held them up as models of the Kingdom (Mark 10:13–16) | Reversed status hierarchies |

\`\`\`concept
{
  "title": "A Common Misconception: Jesus Drew Only Large Crowds",
  "variant": "insight",
  "content": "Historical scholarship notes that Jesus' ministry often took place at meals and small gatherings rather than mass rallies. Large crowds gathering around a charismatic teacher would have attracted swift Roman military attention. Much of Jesus' most intimate teaching — including many parables — happened around dinner tables, in homes, and in village synagogues."
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: N.T. Wright on the Kingdom and Empire",
  "content": "N.T. Wright (*Simply Jesus*, HarperOne, 2011) argues that the Kingdom of God announcement was politically charged in a way modern readers often miss. First-century Jews lived under Roman occupation and longed for God to reassert his rule over the world. Jesus was announcing that this moment had arrived — but in a shockingly unexpected way: not through military uprising but through his own person, teachings, and ultimate self-giving.\\n\\nThe Sermon on the Mount's command to 'turn the other cheek' and 'go the extra mile' were not passive capitulations but acts of active, creative non-violence that subverted the honour/shame dynamics of Roman domination. The Kingdom Jesus proclaimed was a direct challenge to Caesar's empire — just not on Caesar's terms."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding: The Ministry of Jesus",
  "questions": [
    {
      "question": "What is the central theme of Jesus' public teaching?",
      "options": [
        "The importance of Temple sacrifice",
        "The Kingdom of God — God's reign breaking into human history",
        "The coming destruction of Jerusalem",
        "Personal moral self-improvement"
      ],
      "answer": 1,
      "explanation": "The Kingdom of God (Greek: basileia tou theou) is universally recognised by scholars as the controlling theme of Jesus' proclamation. His opening words in Mark 1:15 announce its arrival, and nearly all his parables describe its nature."
    },
    {
      "question": "Which parable makes a Samaritan — a despised ethnic outsider — the moral hero of the story?",
      "options": [
        "The Prodigal Son",
        "The Mustard Seed",
        "The Good Samaritan",
        "The Sower"
      ],
      "answer": 2,
      "explanation": "In Luke 10:25–37 Jesus answers 'Who is my neighbour?' by telling of a man beaten on the road who is helped not by a priest or Levite but by a Samaritan. The parable subverts the questioner's ethnic assumptions entirely."
    },
    {
      "question": "The Gospel of John references multiple annual Passover feasts during Jesus' ministry. Why does this matter?",
      "options": [
        "It confirms Jesus observed Jewish dietary laws",
        "It suggests the ministry lasted approximately three years",
        "It explains why Jesus was arrested at Passover",
        "It shows Jesus rejected Roman festivals"
      ],
      "answer": 1,
      "explanation": "John 2:13, 6:4, and 11:55–57 each mention a Passover during Jesus' ministry. Since Passover is an annual feast, three references imply a ministry spanning roughly three years — the traditional scholarly estimate."
    },
    {
      "question": "According to the parable of the Sheep and Goats (Matthew 25:31–46), what is the basis for the final judgment?",
      "options": [
        "Correct theological belief about Jesus' identity",
        "Regular attendance at synagogue or Temple",
        "Concrete acts of mercy toward the hungry, naked, and imprisoned",
        "Formal repentance and water baptism"
      ],
      "answer": 2,
      "explanation": "In this parable, the king separates people based on whether they fed the hungry, welcomed strangers, clothed the naked, and visited the sick and imprisoned. The righteous are even *surprised* — they did not realise they were serving Christ in caring for 'the least of these.'"
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Jesus' ministry (~3 years, based on John's Passover references) centred on announcing the Kingdom of God — God's active reign breaking into history.",
    "His parables were subversive, not sentimental: they gave the moral hero's role to outsiders, celebrated the lost over the dutiful, and consistently inverted social hierarchies.",
    "The Sermon on the Mount radicalises the Torah inward — righteousness must exceed outward compliance and must include love of enemies.",
    "Jesus consistently included those society excluded: women, tax collectors, lepers, Gentiles, and children — a pattern that revealed God's character.",
    "The Kingdom Jesus proclaimed was politically charged: it was a direct challenge to the logic of Roman empire, waged not by violence but by self-giving love."
  ]
}
\`\`\`

### Further Reading

- **N.T. Wright**, *Simply Jesus*, HarperOne, 2011 — the best single-volume introduction to Jesus in his first-century context
- **Klyne Snodgrass**, *Stories with Intent: A Comprehensive Guide to the Parables of Jesus*, Eerdmans, 2008 — exhaustive parable scholarship
- **Richard Bauckham**, *Jesus and the Eyewitnesses*, Eerdmans, 2006 — on the historical reliability of the Gospel tradition`,
    },
    {
      id: "christianity-death-resurrection",
      slug: "death-and-resurrection",
      title: "The Death and Resurrection of Jesus",
      content: `## The Death and Resurrection of Jesus

<!-- voice:section_check concept="The crucifixion and resurrection — the central events of Christian faith" -->

The final week of Jesus' life — known as **Holy Week** or **Passion Week** — contains the events that form the absolute center of Christian faith. Without the cross and the empty tomb, there is no Christianity. Every Gospel narrative drives relentlessly toward these days; everything Jesus taught and did finds its ultimate meaning here.

\`\`\`concept
{ "title": "The Hinge of History", "variant": "mental-model", "content": "Christians do not regard the cross primarily as a tragedy and the resurrection primarily as a miracle. They read them together as a single event: the death that brings life. N.T. Wright describes this as God defeating the powers of evil and death not by avoiding them but by going through them. The cross is not the worst thing that happened before the good news — it is part of the good news." }
\`\`\`

---

### The Road to the Cross

\`\`\`steps
{ "title": "Holy Week: Day by Day", "steps": [ { "title": "Palm Sunday — Triumphal Entry", "content": "Jesus rode into Jerusalem on a donkey to the acclaim of crowds waving palm branches and shouting *Hosanna* (Mark 11:1-10). The imagery evoked Zechariah 9:9 — a king coming in peace rather than on a warhorse. The crowd expected a political liberator; what they received would confound those expectations entirely." }, { "title": "Monday — Cleansing the Temple", "content": "Jesus overturned the money changers' tables in the Temple courts, declaring: *'My house will be called a house of prayer, but you are making it a den of robbers'* (Mark 11:17, quoting Isaiah 56:7 and Jeremiah 7:11). This was not a fit of anger but a prophetic act — a direct challenge to the Temple establishment's corruption and a signal that the Temple's era was ending." }, { "title": "Thursday Evening — The Last Supper", "content": "Jesus shared a final Passover meal with his twelve disciples. He reinterpreted the Passover symbols around himself:\\n\\n> *'This is my body given for you; do this in remembrance of me... This cup is the new covenant in my blood, which is poured out for you.'*\\n> — Luke 22:19-20 NIV\\n\\nThis meal — called **Communion**, **Eucharist**, or **the Lord's Supper** across Christian traditions — has been re-enacted by Christians in every century since." }, { "title": "Thursday Night — Gethsemane", "content": "After the supper, Jesus withdrew to the Garden of Gethsemane on the Mount of Olives to pray. The Gospels record a moment of profound anguish:\\n\\n> *'Abba, Father... take this cup from me. Yet not what I will, but what you will.'*\\n> — Mark 14:36 NIV\\n\\nThis prayer is one of the most theologically significant moments in the Gospels — the fully human Jesus recoiling from suffering, yet choosing submission. Judas Iscariot then arrived with armed men and betrayed Jesus with a kiss." }, { "title": "Friday — Trial and Crucifixion", "content": "Jesus was tried before the Jewish Sanhedrin (charged with blasphemy) and then before the Roman prefect **Pontius Pilate** (charged with sedition). Pilate, finding no grounds for execution but unwilling to provoke the crowd, handed Jesus over. He was executed by crucifixion — the Roman death reserved for slaves, rebels, and the lowest criminals — at approximately 9 a.m. on a Friday." }, { "title": "Sunday — The Empty Tomb", "content": "On the third day (Sunday morning by Jewish counting), women who went to anoint the body found the tomb empty and were told by an angelic figure: *'He is not here; he has risen, just as he said'* (Matthew 28:6 NIV). Resurrection appearances followed to individuals and groups over a period of forty days." } ] }
\`\`\`

---

### The Crucifixion

Jesus was executed at a place called **Golgotha** ("the place of the skull") outside Jerusalem's walls. The Gospels narrate his final hours with deliberate restraint — no extended theological commentary, just witness:

> *"It was nine in the morning when they crucified him."*
> — Mark 15:25 NIV

From the cross, Jesus is recorded as speaking seven times. Two of these sayings reveal the full range of his experience:

\`\`\`tabs
{ "tabs": [ { "label": "Forgiving His Killers", "icon": "🕊️", "content": "> *'Father, forgive them, for they do not know what they are doing.'*\\n> — Luke 23:34 NIV\\n\\nThis word of forgiveness, spoken toward those actively executing him, has been read by Christian interpreters as the cross itself in miniature — not judgment returned for injustice, but mercy extended into the worst of human violence." }, { "label": "The Cry of Dereliction", "icon": "💔", "content": "> *'My God, my God, why have you forsaken me?'*\\n> — Matthew 27:46 NIV\\n\\nThis is a direct quotation of **Psalm 22:1** — a psalm that begins in desolation but ends in vindication. Jesus did not improvise these words; he reached for Israel's own scripture of abandonment and suffering. Scholars debate whether he quoted only the opening line while implying the whole psalm, or whether the cry expresses real God-forsakenness that the resurrection would reverse." }, { "label": "The Historical Context of Crucifixion", "icon": "🏛️", "content": "Crucifixion was designed not merely to kill but to humiliate and deter. The victim was displayed publicly, often on a major road, as a warning. Roman law prohibited crucifying Roman citizens. For first-century Jewish readers, a crucified messiah was a profound contradiction — Deuteronomy 21:23 declared that anyone hung on a tree was 'under God's curse.' The apostle Paul confronted this head-on: *'Christ redeemed us from the curse of the law by becoming a curse for us'* (Galatians 3:13 NIV)." } ] }
\`\`\`

<!-- voice:key_insight insight="Christians believe the cross is not a defeat but the means of salvation. The apostle Paul wrote: 'God demonstrates his own love for us in this: While we were still sinners, Christ died for us' (Romans 5:8 NIV). The cross reveals a God who enters the deepest human suffering rather than observing it from a distance." -->

---

### The Resurrection

On Easter Sunday, women who went to anoint Jesus' body found the tomb empty. The Gospels — Matthew, Mark, Luke, and John — all record this discovery, though they vary in detail (the number of women, the number of angels). Historians note that all four place **women** as the primary witnesses, a detail that would have carried little weight in first-century legal culture and thus is unlikely to have been invented.

The apostle Paul, writing around **55 CE** (roughly 25 years after the events), preserved the earliest formal account of resurrection appearances — an account most scholars believe he received within a few years of the crucifixion itself:

> *"He appeared to Cephas, and then to the Twelve. After that, he appeared to more than five hundred of the brothers and sisters at the same time, most of whom are still living."*
> — 1 Corinthians 15:5-6 NIV

\`\`\`callout
{ "type": "info", "title": "Why Paul's List Matters Historically", "content": "Paul wrote 1 Corinthians around 55 CE, but the formulaic language of 1 Corinthians 15:3-5 ('I received... I passed on') indicates he is quoting an earlier tradition — most scholars date its origin to within 2-5 years of the crucifixion itself, making it among the earliest Christian sources. Paul also notes that many of the 500 witnesses were 'still living,' implying the claims could be checked by his readers." }
\`\`\`

Paul considered the resurrection not an optional miracle added to Christian faith but its very foundation:

> *"If Christ has not been raised, your faith is futile; you are still in your sins."*
> — 1 Corinthians 15:17 NIV

---

### Why It Matters: The Theology of Cross and Empty Tomb

\`\`\`tabs
{ "tabs": [ { "label": "Atonement", "icon": "⚖️", "content": "**Atonement** means 'at-one-ment' — the restoration of a broken relationship. Christian theology has developed several models for how Jesus' death accomplishes this:\\n\\n- **Substitution**: Jesus bore the penalty humanity deserved\\n- **Moral influence**: The cross reveals God's love so powerfully it transforms the human heart\\n- **Christus Victor**: Jesus defeated the powers of sin, death, and evil on their own territory\\n- **Participation**: Through union with Christ, believers die and rise with him\\n\\nNo single model exhausts the meaning; the New Testament itself uses multiple images." }, { "label": "Victory Over Death", "icon": "🌅", "content": "The resurrection is not merely Jesus surviving death — it is the first instance of a new kind of existence that Christians believe awaits all humanity. Paul calls Jesus the **'firstfruits'** of a coming harvest (1 Corinthians 15:20): his resurrection is the beginning, not the exception, of God's project to renew creation.\\n\\nThis distinguishes Christian hope from simple immortality of the soul. The resurrection promise is bodily — transformed, glorified, but genuinely physical." }, { "label": "New Creation", "icon": "🌱", "content": "N.T. Wright argues that Easter is not about 'going to heaven when you die' but about God beginning the renewal of the entire created order. The resurrection of Jesus is the first moment of the new creation breaking into the old.\\n\\nThis has ethical implications: if God is renewing the world, then justice, beauty, healing, and reconciliation are not temporary distractions but anticipations of the coming kingdom." }, { "label": "Hope for Believers", "icon": "✨", "content": "Paul writes that believers 'share in' Christ's resurrection — both spiritually now (being 'raised with Christ' to new life, Colossians 3:1) and bodily in the future (1 Corinthians 15:42-44). Christian hope is not escape from the world but its transformation.\\n\\nThis changes how Christians approach suffering, mortality, and meaning — not because pain becomes unreal, but because the story does not end with the tomb." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What did Paul mean when he called the resurrection 'of first importance' in 1 Corinthians 15?", "options": [ "That it was more miraculous than Jesus' other miracles", "That without the resurrection, Christian faith has no basis and no hope", "That Jesus was more divine than human", "That the resurrection is the most historically provable event in the Gospels" ], "answer": 1, "explanation": "Paul's argument in 1 Corinthians 15 is explicit: 'If Christ has not been raised, your faith is futile; you are still in your sins' (v.17). He treats the resurrection not as an add-on miracle but as the structural foundation without which the entire edifice collapses." }, { "question": "Why do scholars consider the detail that women were the primary witnesses to the empty tomb historically significant?", "options": [ "Because women were known to be more reliable witnesses in Roman law", "Because it is an unlikely detail to invent, since women's testimony had little legal standing in the first century", "Because the Gospel writers were trying to honor Mary Magdalene", "Because women were the only ones present at the tomb" ], "answer": 1, "explanation": "In first-century Jewish and Roman legal culture, women's testimony was often discounted. If the resurrection accounts were invented, the authors would likely have chosen more socially credible witnesses — such as the male apostles. The presence of women as primary witnesses is therefore considered an indicator of authentic memory rather than fabrication." }, { "question": "Jesus' cry from the cross, 'My God, my God, why have you forsaken me?' is drawn from:", "options": [ "The book of Isaiah's Servant Songs", "Psalm 22, a psalm that moves from desolation to vindication", "Lamentations 3, the book of grief", "Ezekiel's vision of the valley of dry bones" ], "answer": 1, "explanation": "Matthew 27:46 and Mark 15:34 record Jesus quoting Psalm 22:1 verbatim. Psalm 22 begins in anguish — 'My God, my God, why have you forsaken me?' — but ends with trust and praise. Many interpreters see Jesus invoking the entire psalm, not just its opening cry." }, { "question": "Which of the following best describes the Christian theological claim about the cross?", "options": [ "The cross was a tragic accident that God used for good", "The cross was primarily a moral example of self-sacrifice", "The cross was the defeat of Jesus that the resurrection reversed", "The cross and resurrection are a single event through which God defeated evil and death" ], "answer": 3, "explanation": "Mainstream Christian theology does not treat the cross as defeat and the resurrection as recovery. Rather, they are read as one unified act: Jesus entering into the full weight of sin, suffering, and death, and the resurrection vindicating and transforming what happened there." } ] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: The Historical Questions Around the Resurrection", "content": "Historians approach the resurrection differently than theologians, but both engage seriously with the evidence. Several facts are widely accepted even by non-Christian scholars:\\n\\n1. **Jesus died by crucifixion** under Pontius Pilate — attested in Roman historian Tacitus (*Annals* 15.44) and Josephus (*Antiquities* 18.3).\\n2. **The tomb was reported empty** within days of the execution — early Jewish polemics against Christianity argued the disciples stole the body (Matthew 28:11-15), not that the tomb was occupied.\\n3. **The disciples underwent a genuine transformation** — from scattered, frightened fugitives to people willing to die proclaiming the resurrection. Something dramatic happened to produce this change.\\n4. **Paul's early creed** (1 Corinthians 15:3-5) dates to within years of the crucifixion and lists named eyewitnesses.\\n\\nHistorians debate what best explains these facts. Richard Bauckham's *Jesus and the Eyewitnesses* (Eerdmans, 2006) argues the Gospels preserve direct eyewitness testimony with striking geographical and personal specificity. N.T. Wright's *The Resurrection of the Son of God* (Fortress Press, 2003) examines every theory — hallucination, legend, metaphor — and argues the bodily resurrection remains the most historically coherent explanation for all the evidence." }
\`\`\`

---

### Reflection Questions

1. Why is the resurrection, rather than Jesus' moral teaching, considered the *foundation* of Christian faith rather than its crown jewel?
2. Jesus praying *"take this cup from me"* in Gethsemane is one of the most intimate moments in the Gospels. How does this prayer shape your understanding of his humanity — and of prayer itself?
3. What would it mean — for ethics, hope, and meaning — if the resurrection really happened? What would it mean if it did not?

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Holy Week moves from Palm Sunday's triumph through betrayal, trial, and crucifixion to the empty tomb — the entire arc is intentional, not accidental.", "Jesus' crucifixion was a Roman execution reserved for the lowest criminals; early Christians understood this shame as itself part of the redemptive act.", "Paul's early creed in 1 Corinthians 15 (c. 55 CE) records resurrection appearances to named individuals and groups, including more than 500 people 'most of whom are still living.'", "Christian theology holds that the cross and resurrection together constitute a single saving event — not tragedy followed by recovery, but God's defeat of evil through entering it.", "The resurrection is understood not as mere resuscitation but as the beginning of a new creation, carrying implications for how believers live now." ] }
\`\`\`

### Deeper Reading

- **N.T. Wright**, *The Resurrection of the Son of God*, Fortress Press, 2003
- **Richard Bauckham**, *Jesus and the Eyewitnesses*, Eerdmans, 2006
- **N.T. Wright**, *Simply Jesus*, HarperOne, 2011 — accessible introduction to the whole story`,
    },
    {
      id: "christianity-life-of-jesus-checkpoint",
      slug: "life-of-jesus-checkpoint",
      title: "Checkpoint: The Life of Jesus",
      content: `## Checkpoint: The Life of Jesus

Wonderful work engaging with the Gospel accounts. This checkpoint draws together the key threads from the module — the Kingdom proclamation, the Sermon on the Mount, the Last Supper, and the resurrection witness. Work through the quiz carefully, then prepare your voice summary before moving on.

\`\`\`concept
{ "title": "The Kingdom of God — Core Lens", "variant": "mental-model", "content": "Everything Jesus said and did can be read through one central lens: the Kingdom of God. This is not primarily a place people go after death, but the reign and rule of God actively breaking into human history. N.T. Wright describes it as God becoming King of the world in and through Jesus. Parables, miracles, ethical teaching, the cross, and the resurrection all make their fullest sense within this frame." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "Kingdom of God", "icon": "👑", "content": "**The Central Proclamation**\\n\\nJesus opened his public ministry with: *'The time has come. The Kingdom of God has come near. Repent and believe the good news'* (Mark 1:15 NIV). This was not abstract theology — it was a direct announcement that Israel's God was acting decisively in history. The Kingdom was both present (breaking in now, through healings and forgiveness) and future (consummated at the end of the age)." },
  { "label": "Sermon on the Mount", "icon": "⛰️", "content": "**The Ethics of the Kingdom**\\n\\nMatthew 5–7 presents Jesus' most sustained ethical teaching. The Beatitudes (5:3–10) open by pronouncing blessing on people the world overlooks: the poor in spirit, the mourning, the meek, those who hunger for righteousness, the merciful, the pure in heart, peacemakers, and the persecuted. They invert every conventional standard of honor and status. The rest of the Sermon deepens the Torah — not abolishing it but radicalising it from the inside out." },
  { "label": "Cross & Resurrection", "icon": "✝️", "content": "**The Climax of the Story**\\n\\nJesus entered Jerusalem during Passover — a moment charged with liberation symbolism — and was executed by Roman crucifixion after a conspiracy between the temple authorities and Pilate. For Paul (1 Cor 15:3–4), his death was 'for our sins according to the Scriptures,' and his bodily resurrection on the third day was the validation of everything he had claimed. Paul's early creedal formula (written c. 55 CE) lists resurrection appearances to Peter, the Twelve, 500+ witnesses, and finally Paul himself." },
  { "label": "Last Supper", "icon": "🍞", "content": "**A New Covenant Meal**\\n\\nOn the night before his crucifixion, Jesus took bread and wine at the Passover meal and identified them with his body and blood: *'Do this in remembrance of me'* (Luke 22:19 NIV). He called the cup 'the new covenant in my blood' — a deliberate allusion to Jeremiah 31:31–34, where God promised a covenant written on hearts rather than stone. The Eucharist (also called Communion or the Lord's Supper) has been the central ritual of Christian worship ever since." }
] }
\`\`\`

\`\`\`quiz
{ "title": "The Life and Teachings of Jesus — Review", "questions": [
  {
    "question": "What was the central theme of Jesus' teaching throughout his ministry?",
    "options": ["The importance of following religious law strictly", "The Kingdom of God — the reign of God breaking into history", "Achieving personal immortality after death", "The imminent destruction of the Roman Empire"],
    "answer": 1,
    "explanation": "The Kingdom of God — the active reign and rule of God in the world — was the unifying theme of everything Jesus taught. N.T. Wright emphasises that Jesus proclaimed God becoming King in and through his own ministry, death, and resurrection."
  },
  {
    "question": "The Beatitudes (Matthew 5:3–10) are best described as:",
    "options": ["A summary of the Ten Commandments for a new generation", "A set of rules for becoming worthy of God's favor", "Blessings pronounced on people the world typically overlooks, inverting social expectations", "A prophecy about the end of the age"],
    "answer": 2,
    "explanation": "The Beatitudes pronounce blessing on the poor in spirit, those who mourn, the meek, those who hunger for righteousness, the merciful, the pure in heart, peacemakers, and the persecuted — people society does not typically honor. They invert conventional assumptions about who is valued and blessed."
  },
  {
    "question": "At the Last Supper, Jesus described the cup as 'the new covenant in my blood.' Which Old Testament prophet had foretold a 'new covenant'?",
    "options": ["Isaiah", "Ezekiel", "Jeremiah", "Daniel"],
    "answer": 2,
    "explanation": "Jeremiah 31:31–34 contains the promise of a new covenant written on hearts rather than stone tablets. Jesus' words at the Last Supper deliberately echo this passage, framing his coming death as the inauguration of that covenant."
  },
  {
    "question": "Why is 1 Corinthians 15:3–8 considered historically significant by scholars?",
    "options": ["It is the oldest surviving complete Gospel", "It is the earliest written record of resurrection appearances, citing Peter, the Twelve, 500+ witnesses, and Paul", "It describes the founding of the Jerusalem church", "It contains the full text of the Lord's Prayer"],
    "answer": 1,
    "explanation": "Written by Paul around 55 CE — within roughly 25 years of the crucifixion — 1 Corinthians 15 preserves an early creedal formula (vv. 3–4) that many scholars date to within a few years of the events. Paul notes that most of the 500+ witnesses were still alive at the time of writing and could be consulted directly."
  },
  {
    "question": "According to Paul in 1 Corinthians 15:17, what is the consequence if Christ has not been raised?",
    "options": ["Christianity becomes a purely ethical religion without supernatural claims", "Faith is futile and believers are still in their sins", "The Church must find a new savior figure", "The Old Testament covenant remains fully in force"],
    "answer": 1,
    "explanation": "Paul is unambiguous: 'If Christ has not been raised, your faith is futile; you are still in your sins' (1 Cor 15:17 NIV). For Paul, the resurrection is not an optional extra — it is the load-bearing pillar of the entire Christian message. Without it, forgiveness, hope, and new life all collapse."
  }
] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Resource Spotlight", "content": "**N.T. Wright, *Simply Jesus* (2011):** Wright argues that Jesus must be understood within first-century Jewish hopes for God to become King — not as a timeless moral teacher, but as the decisive agent through whom Israel's God was reclaiming creation.\\n\\n**Richard Bauckham, *Jesus and the Eyewitnesses* (2006):** Bauckham makes the case that the Gospels preserve testimony that can be traced back to named eyewitnesses — particularly Peter behind Mark, and the Beloved Disciple behind John. This challenges the assumption that the Gospel traditions were shaped primarily by anonymous communities." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The Kingdom of God — God's active reign breaking into history — is the unifying theme of Jesus' teaching, miracles, death, and resurrection.",
  "The Beatitudes invert the world's honor system: blessing falls on the overlooked, the mourning, the meek, and the persecuted.",
  "The Last Supper established the Eucharist and framed Jesus' death as the inauguration of the new covenant prophesied by Jeremiah.",
  "1 Corinthians 15:3–8 is the earliest written testimony to the resurrection, citing multiple named witnesses still living at Paul's time of writing.",
  "For Paul, the resurrection is foundational — without it, Christian faith loses its basis for forgiveness and hope entirely."
] }
\`\`\`

---

### Voice Summary

Before moving on, explain aloud:

1. **What the Kingdom of God means** in Jesus' teaching — why it is not simply "heaven after death" but something breaking into the present
2. **The significance of the cross and resurrection** for Christian theology — using Paul's own words from 1 Corinthians 15
3. **One parable** from the module that challenged your assumptions about who God values or how the Kingdom works

> *Next: Christian Ethics — how Jesus' teachings shape moral life, from the Sermon on the Mount to the Great Commandment.*`,
    },
  ],
};
