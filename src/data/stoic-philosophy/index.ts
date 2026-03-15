import { Course } from "../types";
import { whatIsStoicismModule } from "./01-what-is-stoicism";
import { dichotomyOfControlModule } from "./02-dichotomy-of-control";
import { marcusAureliusModule } from "./03-marcus-aurelius";
import { senecaModule } from "./04-seneca";
import { stoicEthicsModule } from "./05-stoic-ethics";
import { stoicPracticesModule } from "./06-stoic-practices";
import { capstoneModule } from "./07-capstone";

export const stoicPhilosophyCourse: Course = {
  id: "stoic-philosophy",
  slug: "stoic-philosophy",
  title: "Stoic Philosophy for Modern Life",
  description:
    "Learn practical wisdom from Marcus Aurelius, Epictetus, and Seneca. Apply ancient Stoic principles to modern challenges \u2014 from emotional resilience to ethical decision-making.",
  icon: "\u{1F3DB}\uFE0F",
  tier: "free",
  featured: true,
  domain: "philosophy",
  variation: "ethics",
  level: "beginner",
  modules: [
    whatIsStoicismModule,
    dichotomyOfControlModule,
    marcusAureliusModule,
    senecaModule,
    stoicEthicsModule,
    stoicPracticesModule,
    capstoneModule,
  ],
};
