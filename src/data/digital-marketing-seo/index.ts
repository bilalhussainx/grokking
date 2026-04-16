import { Course } from "../types";
import { module1 } from "./01-seo-fundamentals";
import { module2 } from "./02-content-analytics";

export const digitalMarketingSEOCourse: Course = {
  id: "digital-marketing-seo",
  slug: "digital-marketing-seo",
  title: "Digital Marketing & SEO",
  description: "From keyword research and technical SEO to content strategy, GA4 analytics, Google Ads, and email funnels. Build marketing systems that compound over time.",
  icon: "📈",
  tier: "pro",
  featured: false,
  domain: "finance-business",
  level: "beginner",
  prerequisiteIds: [],
  modules: [
    module1,
    module2,
  ],
};
