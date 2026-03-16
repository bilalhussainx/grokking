import { Course } from "../types";
import { nodeBasicsModule } from "./01-node-basics";
import { httpModule } from "./02-http";
import { expressModule } from "./03-express";
import { databasesModule } from "./04-databases";
import { authModule } from "./05-auth";
import { restApiModule } from "./06-rest-api";
import { projectsModule } from "./07-projects";

export const nodejsBackendCourse: Course = {
  id: "nodejs-backend",
  slug: "nodejs-backend",
  title: "Node.js Backend Development",
  description:
    "Build server-side applications with Node.js — from core modules and HTTP to Express, databases, authentication, and RESTful APIs.",
  icon: "\u{1F7E2}",
  tier: "pro",
  modules: [
    nodeBasicsModule,
    httpModule,
    expressModule,
    databasesModule,
    authModule,
    restApiModule,
    projectsModule,
  ],
};
