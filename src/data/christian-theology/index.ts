import { Course } from "../types";
import { introductionModule } from "./01-introduction";
import { oldTestamentModule } from "./02-old-testament";
import { lifeOfJesusModule } from "./03-life-of-jesus";
import { christianEthicsModule } from "./04-christian-ethics";
import { denominationsModule } from "./05-denominations";
import { modernWorldModule } from "./06-modern-world";
import { capstoneModule } from "./07-capstone";

export const christianTheologyCourse: Course = {
  id: "christian-theology",
  slug: "christian-theology",
  title: "Christian Ethics & Theology",
  description:
    "Explore the foundations of Christianity through scripture, theology, and ethics. From the Old Testament to the life of Jesus, from the Sermon on the Mount to the civil rights movement, understand how Christians have understood and lived their faith across two millennia.",
  icon: "\u271D\uFE0F",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "christianity",
  level: "beginner" as const,
  modules: [
    introductionModule,
    oldTestamentModule,
    lifeOfJesusModule,
    christianEthicsModule,
    denominationsModule,
    modernWorldModule,
    capstoneModule,
  ],
};
