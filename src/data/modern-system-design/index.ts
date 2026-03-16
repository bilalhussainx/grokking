import { Course } from "../types";
import { foundationsModule } from "./01-foundations";
import { microservicesCommunicationModule } from "./02-microservices-communication";
import { slackModule } from "./03-slack";
import { netflixModule } from "./04-netflix";
import { uberModule } from "./05-uber";
import { stripeModule } from "./06-stripe";
import { googleDocsModule } from "./07-google-docs";
import { socialNetworkModule } from "./08-social-network";

export const modernSystemDesignCourse: Course = {
  id: "modern-system-design",
  slug: "modern-system-design",
  title: "Modern System Architecture",
  description:
    "Design modern distributed systems with microservices, event-driven architecture, and real-time systems. Covers Slack, Netflix, Uber, Stripe, Google Docs, and more.",
  icon: "🔮",
  tier: "pro",
  modules: [
    foundationsModule,
    microservicesCommunicationModule,
    slackModule,
    netflixModule,
    uberModule,
    stripeModule,
    googleDocsModule,
    socialNetworkModule,
  ],
};
