import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { corePatternsModule } from "./02-core-patterns";
import { twitterApiModule } from "./03-twitter-api";
import { stripeApiModule } from "./04-stripe-api";
import { fileStorageApiModule } from "./05-file-storage-api";
import { messagingApiModule } from "./06-messaging-api";
import { marketplaceApiModule } from "./07-marketplace-api";

export const apiDesignInterviewCourse: Course = {
  id: "api-design-interview",
  slug: "api-design-interview",
  title: "API Design Masterclass",
  description:
    "Master API design for interviews. Learn REST, GraphQL, gRPC and design real-world APIs for Twitter, Stripe, Dropbox, WhatsApp, and Airbnb.",
  icon: "\u{1F50C}",
  tier: "pro",
  modules: [
    fundamentalsModule,
    corePatternsModule,
    twitterApiModule,
    stripeApiModule,
    fileStorageApiModule,
    messagingApiModule,
    marketplaceApiModule,
  ],
};
