import { Course } from "../types";
import { introductionModule } from "./01-introduction";
import { promisedMessiahModule } from "./02-promised-messiah";
import { khilafatModule } from "./03-khilafat";
import { beliefsDistinctionsModule } from "./04-beliefs-distinctions";
import { modernWorldModule } from "./05-modern-world";
import { capstoneModule } from "./06-capstone";

export const ahmadiyyaFoundationsCourse: Course = {
  id: "ahmadiyya-foundations",
  slug: "ahmadiyya-foundations",
  title: "Ahmadiyya Islam: Peace & Renewal",
  description:
    "Explore the Ahmadiyya Muslim Community — its origins, theology, Khilafat system, and global peace mission. Learn how this 19th-century revival movement understands Islam and engages with the modern world.",
  icon: "\u262A\uFE0F",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "ahmadiyya-islam",
  level: "beginner" as const,
  modules: [
    introductionModule,
    promisedMessiahModule,
    khilafatModule,
    beliefsDistinctionsModule,
    modernWorldModule,
    capstoneModule,
  ],
};
