import { Course } from "../types";
import { module1 } from "./01-structure-delivery";
import { module2 } from "./02-storytelling-slides";
import { module3 } from "./03-vocal-body-language";
import { module4 } from "./04-impromptu-qa";
import { module5 } from "./05-virtual-presentations";
import { module6 } from "./06-speaking-career";

export const publicSpeakingCourse: Course = {
  id: "public-speaking",
  slug: "public-speaking",
  title: "Public Speaking Mastery",
  description: "From structure and delivery to storytelling, vocal technique, Q&A mastery, and virtual presentations. Master the techniques TED speakers use, how to think on your feet, and how to build a speaking career with genuine thought leadership.",
  icon: "🎤",
  tier: "pro",
  featured: false,
  domain: "health-wellness",
  level: "beginner",
  prerequisiteIds: [],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
  ],
};
