import { Course } from "../types";
import { canvasBasicsModule } from "./01-canvas-basics";
import { gameLoopModule } from "./02-game-loop";
import { inputHandlingModule } from "./03-input-handling";
import { collisionModule } from "./04-collision";
import { gameProjectsModule } from "./05-game-projects";

export const gameDevelopmentCourse: Course = {
  id: "game-development",
  slug: "game-development",
  title: "Game Development Fundamentals",
  description:
    "Learn programming by building games — from Pong to Space Shooter using JavaScript and HTML5 Canvas concepts.",
  icon: "\u{1F3AE}",
  modules: [
    canvasBasicsModule,
    gameLoopModule,
    inputHandlingModule,
    collisionModule,
    gameProjectsModule,
  ],
};
