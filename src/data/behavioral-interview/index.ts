import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { leadershipModule } from "./02-leadership";
import { problemSolvingModule } from "./03-problem-solving";
import { teamworkModule } from "./04-teamwork";
import { failureGrowthModule } from "./05-failure-growth";
import { customerImpactModule } from "./06-customer-impact";
import { companySpecificModule } from "./07-company-specific";

export const behavioralInterviewCourse: Course = {
  id: "behavioral-interview",
  slug: "behavioral-interview",
  title: "Ace the Behavioral Interview",
  description: "Ace behavioral interviews at FAANG and top tech companies. Master STAR method, build your story bank, and learn company-specific strategies with real example answers.",
  icon: "🎯",
  tier: "pro",
  modules: [fundamentalsModule, leadershipModule, problemSolvingModule, teamworkModule, failureGrowthModule, customerImpactModule, companySpecificModule],
};
