import { Course } from "../types";
import { module1 } from "./01-structure-delivery";
import { module2 } from "./02-storytelling-slides";

export const publicSpeakingCourse: Course = {
  id: "public-speaking",
  slug: "public-speaking",
  title: "Public Speaking Mastery",
  description: "From structure and delivery to storytelling and Q&A. Master the techniques that make TED speakers compelling, business pitches land, and presentations change minds.",
  icon: "🎤",
  tier: "pro",
  featured: false,
  domain: "health-wellness",
  level: "beginner",
  prerequisiteIds: [],
  modules: [
    module1,
    module2,
  ],
};
