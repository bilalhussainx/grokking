import { Course } from "../types";
import { whatIsTaoismModule } from "./01-what-is-taoism";
import { taoTeChingModule } from "./02-tao-te-ching";
import { zhuangziModule } from "./03-zhuangzi";
import { wuWeiModule } from "./04-wu-wei";
import { taoistPracticesModule } from "./05-taoist-practices";
import { taoismCapstoneModule } from "./06-capstone";

export const taoismFoundationsCourse: Course = {
  id: "taoism-foundations",
  slug: "taoism-foundations",
  title: "Taoism: The Way of Nature",
  description:
    "Explore the ancient Chinese tradition of Taoism -- from the paradoxes of the Tao Te Ching to Zhuangzi's stories, wu wei, and the art of living in harmony with nature.",
  icon: "262FFE0F",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "taoism",
  level: "beginner" as const,
  modules: [
    whatIsTaoismModule,
    taoTeChingModule,
    zhuangziModule,
    wuWeiModule,
    taoistPracticesModule,
    taoismCapstoneModule,
  ],
};
