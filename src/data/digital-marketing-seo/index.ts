import { Course } from "../types";
import { module1 } from "./01-seo-fundamentals";
import { module2 } from "./02-content-analytics";
import { module3 } from "./03-link-building-offpage";
import { module4 } from "./04-social-media-paid";
import { module5 } from "./05-conversion-optimization";
import { module6 } from "./06-analytics-attribution";
import { module7 } from "./07-growth-strategy";

export const digitalMarketingSEOCourse: Course = {
  id: "digital-marketing-seo",
  slug: "digital-marketing-seo",
  title: "Digital Marketing & SEO",
  description: "From keyword research and technical SEO to link building, Google Ads, Meta Ads, conversion rate optimization, GA4 attribution modeling, and growth flywheels. Build marketing systems that compound over time.",
  icon: "📈",
  tier: "pro",
  featured: false,
  domain: "finance-business",
  level: "beginner",
  prerequisiteIds: [],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
  ],
};
