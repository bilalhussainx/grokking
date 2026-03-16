import { Course } from "../types";
import { buddhasLifeModule } from "./01-buddhas-life";
import { fourNobleTruthsModule } from "./02-four-noble-truths";
import { eightfoldPathModule } from "./03-eightfold-path";
import { meditationTraditionsModule } from "./04-meditation-traditions";
import { keyScripturesModule } from "./05-key-scriptures";
import { buddhistEthicsModule } from "./06-buddhist-ethics";
import { capstoneModule } from "./07-capstone";

export const buddhismFoundationsCourse: Course = {
  id: "buddhism-foundations",
  slug: "buddhism-foundations",
  title: "Buddhism: Path to Inner Peace",
  description:
    "Explore the foundations of Buddhism through primary sources — the Pali Canon, Heart Sutra, and living traditions. From the Four Noble Truths to meditation practice, learn how the Buddha's teachings address suffering and cultivate wisdom and compassion.",
  icon: "\u{1F9D8}",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "buddhism",
  level: "beginner" as const,
  modules: [
    buddhasLifeModule,
    fourNobleTruthsModule,
    eightfoldPathModule,
    meditationTraditionsModule,
    keyScripturesModule,
    buddhistEthicsModule,
    capstoneModule,
  ],
};
