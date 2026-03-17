import { Course } from "../types";
import { whatIsSufismModule } from "./01-what-is-sufism";
import { rumiModule } from "./02-rumi";
import { ibnArabiModule } from "./03-ibn-arabi";
import { sufiOrdersModule } from "./04-sufi-orders";
import { practicesModule } from "./05-practices";
import { sufismIslamModule } from "./06-sufism-islam";
import { capstoneModule } from "./07-capstone";

export const sufismFoundationsCourse: Course = {
  id: "sufism-foundations",
  slug: "sufism-foundations",
  title: "Sufism: The Mystical Path",
  description:
    "Journey into the mystical heart of Islam through Sufism. From Rumi's love poetry to Ibn Arabi's metaphysics, from dhikr and whirling to al-Ghazali's great synthesis — explore how Sufis seek direct, experiential knowledge of God through purification of the heart.",
  icon: "\u{1F300}",
  tier: "free",
  featured: true,
  domain: "religious-studies",
  variation: "sufism",
  level: "beginner" as const,
  modules: [
    whatIsSufismModule,
    rumiModule,
    ibnArabiModule,
    sufiOrdersModule,
    practicesModule,
    sufismIslamModule,
    capstoneModule,
  ],
};
