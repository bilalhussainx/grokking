import { Course } from "../types";
import { digitalInformationModule } from "./01-digital-information";
import { theInternetModule } from "./02-the-internet";
import { programmingFundamentalsModule } from "./03-programming-fundamentals";
import { algorithmsModule } from "./04-algorithms";
import { dataAnalysisModule } from "./05-data-analysis";
import { simulationsModule } from "./06-simulations";
import { onlineSecurityModule } from "./07-online-security";
import { apExamPrepModule } from "./08-ap-exam-prep";

export const apCsPrinciplesCourse: Course = {
  id: "ap-cs-principles",
  slug: "ap-cs-principles",
  title: "AP Computer Science Principles",
  description:
    "Master the AP CSP curriculum -- binary, the Internet, Python programming, algorithms, data analysis, simulations, and cybersecurity. Aligned with College Board standards.",
  icon: "\u{1F4BB}",
  tier: "free",
  featured: true,
  domain: "computer-science",
  variation: "systems-programming",
  level: "beginner" as const,
  modules: [
    digitalInformationModule,
    theInternetModule,
    programmingFundamentalsModule,
    algorithmsModule,
    dataAnalysisModule,
    simulationsModule,
    onlineSecurityModule,
    apExamPrepModule,
  ],
};
