import { Course } from "../types";
import { systemDesignFoundationsModule } from "./01-system-design-foundations";
import { scalabilityAndPerformanceModule } from "./02-scalability-and-performance";
import { cachingStrategiesModule } from "./03-caching-strategies";
import { dataStorageAndDatabasesModule } from "./04-data-storage-and-databases";
import { distributedSystemsFundamentalsModule } from "./05-distributed-systems-fundamentals";
import { networkingAndCommunicationModule } from "./06-networking-and-communication";
import { reliabilityAndResiliencyModule } from "./07-reliability-and-resiliency";
import { coreSystemCaseStudiesModule } from "./08-core-system-case-studies";
import { socialAndMediaCaseStudiesModule } from "./09-social-and-media-case-studies";
import { realtimeAndMarketplaceCaseStudiesModule } from "./10-realtime-and-marketplace-case-studies";
import { microservicesAndArchitecturePatternsModule } from "./11-microservices-and-architecture-patterns";
import { interviewMasteryAndPracticeModule } from "./12-interview-mastery-and-practice";

export const systemDesignCourse: Course = {
  id: "system-design",
  slug: "system-design",
  title: "Grokking System Design & Architecture",
  description: "Learn how to design large-scale distributed systems. Covers fundamentals, key concepts, and 10 real-world system design case studies with detailed architecture diagrams and trade-off analysis.",
  icon: "🏗️",
  tier: "pro",
  domain: "computer-science",
  variation: "interview-prep",
  level: "advanced",
  featured: true,
  modules: [
    systemDesignFoundationsModule,
    scalabilityAndPerformanceModule,
    cachingStrategiesModule,
    dataStorageAndDatabasesModule,
    distributedSystemsFundamentalsModule,
    networkingAndCommunicationModule,
    reliabilityAndResiliencyModule,
    coreSystemCaseStudiesModule,
    socialAndMediaCaseStudiesModule,
    realtimeAndMarketplaceCaseStudiesModule,
    microservicesAndArchitecturePatternsModule,
    interviewMasteryAndPracticeModule,
  ],
};
