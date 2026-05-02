import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MobileSearchSheet from "./MobileSearchSheet";

describe("MobileSearchSheet", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <MobileSearchSheet open={false} onClose={() => {}} onSlashCommand={() => {}} />,
    );
    expect(container.querySelector("input")).toBeNull();
  });

  it("renders and auto-focuses the input when open", async () => {
    render(<MobileSearchSheet open={true} onClose={() => {}} onSlashCommand={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(input));
  });

  it("renders default Pages + Actions groups when query is empty", () => {
    render(<MobileSearchSheet open={true} onClose={() => {}} onSlashCommand={() => {}} />);
    expect(screen.getByText("Pages")).toBeTruthy();
    expect(screen.getByText("Actions")).toBeTruthy();
  });

  it("filters palette when query is typed", () => {
    render(<MobileSearchSheet open={true} onClose={() => {}} onSlashCommand={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "translate" } });
    expect(screen.getByText(/Translate brag sheet/i)).toBeTruthy();
  });

  it("flips into Coach mode when query starts with /", () => {
    render(<MobileSearchSheet open={true} onClose={() => {}} onSlashCommand={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "/why is my reach list so heavy" } });
    expect(screen.getByText(/Asking Coach Kairos/i)).toBeTruthy();
  });

  it("calls onSlashCommand when Enter is pressed in slash mode", () => {
    const onSlashCommand = vi.fn();
    const onClose = vi.fn();
    render(
      <MobileSearchSheet open={true} onClose={onClose} onSlashCommand={onSlashCommand} />,
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "/help" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSlashCommand).toHaveBeenCalledWith("help");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<MobileSearchSheet open={true} onClose={onClose} onSlashCommand={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
