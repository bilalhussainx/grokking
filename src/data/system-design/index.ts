import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { keyConceptsModule } from "./02-key-concepts";
import { urlShortenerModule } from "./03-url-shortener";
import { instagramModule } from "./04-instagram";
import { twitterModule } from "./05-twitter";
import { chatSystemModule } from "./06-chat-system";
import { webCrawlerModule } from "./07-web-crawler";
import { notificationSystemModule } from "./08-notification-system";
import { rateLimiterModule } from "./09-rate-limiter";
import { keyValueStoreModule } from "./10-key-value-store";
import { youtubeModule } from "./11-youtube";
import { googleDocsModule } from "./12-google-docs";

export const systemDesignCourse: Course = {
  id: "system-design",
  slug: "system-design",
  title: "Grokking System Design & Architecture",
  description:
    "Learn how to design large-scale distributed systems. Covers fundamentals, key concepts, and 10 real-world system design case studies with detailed architecture diagrams and trade-off analysis.",
  icon: "\u{1F3D7}\u{FE0F}",
  modules: [
    fundamentalsModule,
    keyConceptsModule,
    urlShortenerModule,
    instagramModule,
    twitterModule,
    chatSystemModule,
    webCrawlerModule,
    notificationSystemModule,
    rateLimiterModule,
    keyValueStoreModule,
    youtubeModule,
    googleDocsModule,
  ],
};
