import { Course } from "../types";
import { module1 } from "./01-rn-fundamentals";
import { module2 } from "./02-navigation-state";

export const reactNativeMobileCourse: Course = {
  id: "react-native-mobile",
  slug: "react-native-mobile",
  title: "React Native Mobile Development",
  description: "Build iOS and Android apps from one codebase. Core components, FlatList, React Navigation, Zustand, Expo native APIs, and deploying to App Store and Play Store with EAS.",
  icon: "📱",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["react-complete"],
  modules: [
    module1,
    module2,
  ],
};
