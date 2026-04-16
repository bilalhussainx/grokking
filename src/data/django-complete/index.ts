import { Course } from "../types";
import { module1 } from "./01-fundamentals";
import { module2 } from "./02-models-orm";
import { module3 } from "./03-views-templates";
import { module4 } from "./04-drf";
import { module5 } from "./05-auth-admin";
import { module6 } from "./06-advanced-deployment";

export const djangoCompleteCourse: Course = {
  id: "django-complete",
  slug: "django-complete",
  title: "Django: Complete Web Development",
  description:
    "Full-stack Python web development with Django — ORM, MVT pattern, class-based views, Django REST Framework, authentication, Celery, Redis caching, and production deployment.",
  icon: "🌿",
  tier: "pro",
  featured: true,
  domain: "backend",
  level: "intermediate",
  prerequisiteIds: ["python-fundamentals"],
  modules: [module1, module2, module3, module4, module5, module6],
};
