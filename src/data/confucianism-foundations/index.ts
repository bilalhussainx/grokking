import { Course } from "../types";
import { confuciusModule } from "./01-confucius";
import { analectsModule } from "./02-analects";
import { fiveRelationshipsModule } from "./03-five-relationships";
import { renJunziModule } from "./04-ren-junzi";
import { neoConfucianismModule } from "./05-neo-confucianism";
import { capstoneModule } from "./06-capstone";

export const confucianismFoundationsCourse: Course = {
  id: "confucianism-foundations",
  slug: "confucianism-foundations",
  title: "Confucianism: Virtue & Society",
  description:
    "Explore the teachings of Confucius and the Confucian tradition — from the Analects and the Five Relationships to Neo-Confucian metaphysics. Learn how ren (benevolence), li (ritual propriety), and the ideal of the junzi shaped East Asian civilization for over two millennia.",
  icon: "\u{1F3EF}",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "confucianism",
  level: "beginner" as const,
  modules: [
    confuciusModule,
    analectsModule,
    fiveRelationshipsModule,
    renJunziModule,
    neoConfucianismModule,
    capstoneModule,
  ],
};
