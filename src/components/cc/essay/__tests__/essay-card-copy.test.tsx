import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import EssayCard from "../EssayCard";

const card = (commentCount: number) =>
  render(
    <EssayCard id="e1" essayType="personal_statement" promptText="Prompt" phase="draft" wordCount={100} wordLimit={650}
      updatedAt="2026-10-01T00:00:00Z" commentCount={commentCount} />,
  ).container.textContent ?? "";

describe("EssayCard comment count", () => {
  it("says '1 comment', not '1 comments'", () => {
    const text = card(1);
    expect(text).toContain("1 comment");
    expect(text).not.toContain("1 comments");
  });
  it("pluralizes above one", () => {
    expect(card(3)).toContain("3 comments");
  });
});
