import { Course } from "../types";
import { module1 } from "./01-containers-docker";
import { module2 } from "./02-docker-compose";
import { module3 } from "./03-kubernetes-architecture";
import { module4 } from "./04-helm-cicd";
import { module5 } from "./05-production-ops";

export const dockerKubernetesCourse: Course = {
  id: "docker-kubernetes",
  slug: "docker-kubernetes",
  title: "Docker & Kubernetes Complete",
  description: "Master containerization from Dockerfile basics to production Kubernetes clusters. Covers Docker, Docker Compose, K8s architecture, Helm, CI/CD pipelines, RBAC security, and observability.",
  icon: "🐳",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["nodejs-complete"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
  ],
};
