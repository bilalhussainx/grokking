import { Course } from "../types";
import { introductionModule } from "./01-introduction";
import { vedasUpanishadsModule } from "./02-vedas-upanishads";
import { bhagavadGitaModule } from "./03-bhagavad-gita";
import { pathsOfYogaModule } from "./04-paths-of-yoga";
import { ethicsDharmaModule } from "./05-ethics-dharma";
import { festivalsPracticesModule } from "./06-festivals-practices";
import { capstoneModule } from "./07-capstone";

export const hinduismFoundationsCourse: Course = {
  id: "hinduism-foundations",
  slug: "hinduism-foundations",
  title: "Hinduism: Paths to the Divine",
  description:
    "Explore Sanatana Dharma — the world's oldest living religion — through its sacred texts, philosophical traditions, ethical teachings, and living practices. From the Vedas to the Bhagavad Gita, discover how Hinduism addresses the deepest questions of human existence.",
  icon: "\u{1F64F}",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "hinduism",
  level: "beginner" as const,
  modules: [
    introductionModule,
    vedasUpanishadsModule,
    bhagavadGitaModule,
    pathsOfYogaModule,
    ethicsDharmaModule,
    festivalsPracticesModule,
    capstoneModule,
  ],
};
