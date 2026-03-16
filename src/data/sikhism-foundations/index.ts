import { Course } from "../types";
import { guruNanakModule } from "./01-guru-nanak";
import { guruGranthSahibModule } from "./02-guru-granth-sahib";
import { fiveKsKhalsaModule } from "./03-five-ks-khalsa";
import { sikhEthicsModule } from "./04-sikh-ethics";
import { sikhHistoryModule } from "./05-sikh-history";
import { capstoneModule } from "./06-capstone";

export const sikhismFoundationsCourse: Course = {
  id: "sikhism-foundations",
  slug: "sikhism-foundations",
  title: "Sikhism: The Guru's Path",
  description:
    "Walk the path of the Gurus — from Guru Nanak's revolutionary message of oneness to the Khalsa's fearless commitment to justice. Explore the Guru Granth Sahib, the Five Ks, Sikh ethics of Seva and equality, and a history defined by courage and sacrifice.",
  icon: "\u262C",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "sikhism",
  level: "beginner" as const,
  modules: [
    guruNanakModule,
    guruGranthSahibModule,
    fiveKsKhalsaModule,
    sikhEthicsModule,
    sikhHistoryModule,
    capstoneModule,
  ],
};
