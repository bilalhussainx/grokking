// src/components/cc/dashboard/sections/__tests__/CourseRigorGrid.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseRigorGrid from "../CourseRigorGrid";
import type { DashboardSummary } from "../types";

const baseSummary: DashboardSummary = {
  firstName: "Sam",
  brief: null,
  schools: [],
  personalStatement: null,
  activities: { logged: 0, optimized: 0 },
  variantKey: "g9",
  statusLabel: "Grade 9",
  statusTone: "leaf",
  courses: null,
  psatPlan: null,
  whyTransferEssay: null,
  priorityWidgets: [],
  footerWidgets: [],
  observations: {},
};

describe("CourseRigorGrid", () => {
  it("renders empty-state CTA when no courses", () => {
    render(<CourseRigorGrid summary={{ ...baseSummary, courses: [] }} />);
    expect(screen.getByText(/Log your courses/i)).toBeTruthy();
    expect(screen.getByText(/Add your courses/i)).toBeTruthy();
  });
  it("renders up to 4 course cards when courses are present", () => {
    const courses = Array.from({ length: 6 }, (_, i) => ({
      id: `c${i}`, courseName: `Course ${i}`, level: i < 3 ? "Honors" : null, grade: "A", inProgress: false,
    }));
    render(<CourseRigorGrid summary={{ ...baseSummary, courses }} />);
    expect(screen.getByText("showing 4 of 6", { exact: false })).toBeTruthy();
    expect(screen.getByText("Course 0")).toBeTruthy();
    expect(screen.getByText("Course 3")).toBeTruthy();
    expect(screen.queryByText("Course 4")).toBeNull(); // capped at 4
  });
});
