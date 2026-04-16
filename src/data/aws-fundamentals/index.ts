import { Course } from "../types";
import { module1 } from "./01-iam-core-services";
import { module2 } from "./02-networking-databases";
import { module3 } from "./03-serverless-lambda";
import { module4 } from "./04-ecs-cloudformation";
import { module5 } from "./05-monitoring-cost";

export const awsFundamentalsCourse: Course = {
  id: "aws-fundamentals",
  slug: "aws-fundamentals",
  title: "AWS Cloud Fundamentals",
  description: "From IAM and VPC to Lambda, ECS Fargate, CloudFormation, and cost optimization. Build production-grade architectures on AWS using the Well-Architected Framework.",
  icon: "☁️",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["docker-kubernetes"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
  ],
};
