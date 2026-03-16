import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { preparationModule } from "./02-preparation";
import { tacticsModule } from "./03-tactics";
import { psychologyModule } from "./04-psychology";
import { complexModule } from "./05-complex";
import { applicationsModule } from "./06-applications";

export const negotiationInfluenceCourse: Course = {
  id: "negotiation-influence",
  slug: "negotiation-influence",
  title: "Negotiation & Influence Mastery",
  description:
    "Master the art and science of negotiation. From BATNA to anchoring, from emotional intelligence to multi-party dynamics \u2014 learn the frameworks used by Harvard's top negotiators to create value and reach better agreements.",
  icon: "\uD83E\uDD1D",
  tier: "pro",
  modules: [
    foundationsModule,
    preparationModule,
    tacticsModule,
    psychologyModule,
    complexModule,
    applicationsModule,
  ],
};
