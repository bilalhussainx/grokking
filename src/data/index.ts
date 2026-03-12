import { Course } from "./types";
import { codingInterviewCourse } from "./coding-interview";
import { systemDesignCourse } from "./system-design";
import { pythonFundamentalsCourse } from "./python-fundamentals";
import { javascriptFundamentalsCourse } from "./javascript-fundamentals";
import { reactDevelopmentCourse } from "./react-development";
import { cppFundamentalsCourse } from "./cpp-fundamentals";
import { csharpFundamentalsCourse } from "./csharp-fundamentals";
import { nodejsBackendCourse } from "./nodejs-backend";
import { mernStackCourse } from "./mern-stack";
import { dataStructuresAlgorithmsCourse } from "./data-structures-algorithms";
import { webDevelopmentCourse } from "./web-development";
import { gameDevelopmentCourse } from "./game-development";
import { mcpClaudeCodeCourse } from "./mcp-claude-code";

export const courses: Course[] = [
  webDevelopmentCourse,
  pythonFundamentalsCourse,
  javascriptFundamentalsCourse,
  gameDevelopmentCourse,
  reactDevelopmentCourse,
  nodejsBackendCourse,
  mernStackCourse,
  dataStructuresAlgorithmsCourse,
  cppFundamentalsCourse,
  csharpFundamentalsCourse,
  codingInterviewCourse,
  systemDesignCourse,
  mcpClaudeCodeCourse,
];
