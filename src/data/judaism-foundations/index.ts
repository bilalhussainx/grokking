import { Course } from "../types";
import { whatIsJudaismModule } from "./01-what-is-judaism";
import { torahTanakhModule } from "./02-torah-tanakh";
import { talmudOralLawModule } from "./03-talmud-oral-law";
import { jewishEthicsModule } from "./04-jewish-ethics";
import { holidaysShabbatModule } from "./05-holidays-shabbat";
import { denominationsModule } from "./06-denominations";
import { capstoneModule } from "./07-capstone";

export const judaismFoundationsCourse: Course = {
  id: "judaism-foundations",
  slug: "judaism-foundations",
  title: "Judaism: Torah & Tradition",
  description:
    "Explore the world's oldest monotheistic tradition -- from the covenant at Sinai to the Talmud, Jewish ethics, holidays, and modern denominations. Engage with primary sources and scholarly commentary.",
  icon: "\u2721\uFE0F",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "judaism",
  level: "beginner" as const,
  modules: [
    whatIsJudaismModule,
    torahTanakhModule,
    talmudOralLawModule,
    jewishEthicsModule,
    holidaysShabbatModule,
    denominationsModule,
    capstoneModule,
  ],
};
