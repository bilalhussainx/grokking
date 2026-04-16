import { Course } from "../types";
import { module1 } from "./01-go-fundamentals";
import { module2 } from "./02-goroutines-channels";
import { module3 } from "./03-interfaces-http";
import { module4 } from "./04-generics-error-handling";
import { module5 } from "./05-testing-benchmarking";
import { module6 } from "./06-database-sqlx";
import { module7 } from "./07-grpc-protobuf";
import { module8 } from "./08-modules-deployment";

export const golangCompleteCourse: Course = {
  id: "golang-complete",
  slug: "golang-complete",
  title: "Go (Golang) Complete",
  description: "Master Go from syntax and goroutines to production microservices. Covers the type system, channels, generics, error handling, database access with sqlx/pgx, gRPC + protobuf, testing with benchmarks, and Docker deployment patterns.",
  icon: "🐹",
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
    module6,
    module7,
    module8,
  ],
};
