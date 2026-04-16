import { Course } from "../types";
import { module1 } from "./01-rn-fundamentals";
import { module2 } from "./02-navigation-state";
import { module3 } from "./03-animations-gestures";
import { module4 } from "./04-performance-offline";
import { module5 } from "./05-testing-deployment";

export const reactNativeMobileCourse: Course = {
  id: "react-native-mobile",
  slug: "react-native-mobile",
  title: "React Native Mobile Development",
  description: "Build iOS and Android apps from one codebase. Core components, React Navigation, Zustand, Reanimated animations, gesture handling, MMKV and WatermelonDB for offline-first data, Jest and Detox testing, EAS deployment, and in-app purchases with RevenueCat.",
  icon: "📱",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "intermediate",
  prerequisiteIds: ["react-complete"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
  ],
};
