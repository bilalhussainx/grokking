import { Course } from "../types";
import { overviewModule } from "./01-overview";
import { backendSetupModule } from "./02-backend-setup";
import { frontendSetupModule } from "./03-frontend-setup";
import { authFlowModule } from "./04-auth-flow";
import { crudAppModule } from "./05-crud-app";
import { deploymentModule } from "./06-deployment";

export const mernStackCourse: Course = {
  id: "mern-stack",
  slug: "mern-stack",
  title: "MERN Stack Development",
  description:
    "Build full-stack web applications with MongoDB, Express, React, and Node.js. From project setup to deployment with Docker.",
  icon: "\u{1F525}",
  modules: [
    overviewModule,
    backendSetupModule,
    frontendSetupModule,
    authFlowModule,
    crudAppModule,
    deploymentModule,
  ],
};
