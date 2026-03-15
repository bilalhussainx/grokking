import { Course } from "../types";
import { introductionModule } from "./01-introduction";
import { theQuranModule } from "./02-the-quran";
import { fivePillarsModule } from "./03-five-pillars";
import { faithImanModule } from "./04-faith-iman";
import { ethicsCharacterModule } from "./05-ethics-character";
import { familyCommunityModule } from "./06-family-community";
import { modernWorldModule } from "./07-modern-world";
import { capstoneModule } from "./08-capstone";

export const islamFoundationsCourse: Course = {
  id: "islam-foundations",
  slug: "islam-foundations",
  title: "Islam: Foundations & Practice",
  description:
    "Explore the foundations of Islam through primary sources — the Quran, Hadith, and scholarly tradition. From the Five Pillars to Islamic ethics, learn how Muslims understand and practice their faith.",
  icon: "\u{1F54C}",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "islam",
  level: "beginner" as const,
  modules: [
    introductionModule,
    theQuranModule,
    fivePillarsModule,
    faithImanModule,
    ethicsCharacterModule,
    familyCommunityModule,
    modernWorldModule,
    capstoneModule,
  ],
};
