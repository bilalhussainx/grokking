import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { peopleModule } from "./02-people";
import { decisionMakingModule } from "./03-decision-making";
import { changeModule } from "./04-change";
import { communicationModule } from "./05-communication";
import { orgDesignModule } from "./06-org-design";
import { ethicsModule } from "./07-ethics";

export const leadershipManagementCourse: Course = {
  id: "leadership-management",
  slug: "leadership-management",
  title: "Leadership & Management Essentials",
  description:
    "Develop the leadership and management skills that drive organizational success. From emotional intelligence to change management, from team building to ethical leadership \u2014 master the human side of business. Inspired by HBS curriculum.",
  icon: "\uD83D\uDC54",
  tier: "pro",
  modules: [
    foundationsModule,
    peopleModule,
    decisionMakingModule,
    changeModule,
    communicationModule,
    orgDesignModule,
    ethicsModule,
  ],
};
