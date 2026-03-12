import { Course } from "../types";
import { htmlModule } from "./01-html";
import { cssModule } from "./02-css";
import { responsiveModule } from "./03-responsive";
import { jsDomModule } from "./04-js-dom";
import { gitModule } from "./05-git";
import { projectsModule } from "./06-projects";

export const webDevelopmentCourse: Course = {
  id: "web-development",
  slug: "web-development",
  title: "Web Development Fundamentals",
  description:
    "Learn the foundations of web development from scratch -- HTML, CSS, responsive design, JavaScript DOM manipulation, Git, and portfolio projects.",
  icon: "\u{1F310}",
  modules: [
    htmlModule,
    cssModule,
    responsiveModule,
    jsDomModule,
    gitModule,
    projectsModule,
  ],
};
