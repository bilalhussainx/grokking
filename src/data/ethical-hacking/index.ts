import { Course } from "../types";
import { securityMindsetModule } from "./01-security-mindset";
import { networkFundamentalsModule } from "./02-network-fundamentals";
import { webVulnerabilitiesModule } from "./03-web-vulnerabilities";
import { cryptographyModule } from "./04-cryptography";
import { socialEngineeringModule } from "./05-social-engineering";
import { defensiveSecurityModule } from "./06-defensive-security";
import { capstoneSecurityAuditModule } from "./07-capstone";

export const ethicalHackingCourse: Course = {
  id: "ethical-hacking",
  slug: "ethical-hacking",
  title: "Ethical Hacking & Cybersecurity",
  description:
    "Learn cybersecurity from both sides — understand how attackers think, then build the defenses that stop them. Covers OWASP Top 10, cryptography, social engineering, and hands-on security tools in Python.",
  icon: "\u{1F6E1}\u{FE0F}",
  tier: "pro",
  featured: false,
  domain: "computer-science",
  variation: "security",
  level: "beginner" as const,
  modules: [
    securityMindsetModule,
    networkFundamentalsModule,
    webVulnerabilitiesModule,
    cryptographyModule,
    socialEngineeringModule,
    defensiveSecurityModule,
    capstoneSecurityAuditModule,
  ],
};
