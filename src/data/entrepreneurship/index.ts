import { Course } from "../types";
import { mindsetModule } from "./01-mindset";
import { validationModule } from "./02-validation";
import { businessModelModule } from "./03-business-model";
import { fundingModule } from "./04-funding";
import { buildingModule } from "./05-building";
import { scalingModule } from "./06-scaling";
import { exitModule } from "./07-exit";

export const entrepreneurshipCourse: Course = {
  id: "entrepreneurship",
  slug: "entrepreneurship",
  title: "Entrepreneurship: From Idea to Scale",
  description:
    "Learn to build, launch, and scale a startup from scratch. From customer discovery to fundraising, from MVPs to IPOs \u2014 master the entrepreneurial journey with frameworks from HBS, Y Combinator, and Silicon Valley's best practitioners.",
  icon: "\uD83D\uDE80",
  tier: "pro",
  modules: [
    mindsetModule,
    validationModule,
    businessModelModule,
    fundingModule,
    buildingModule,
    scalingModule,
    exitModule,
  ],
};
