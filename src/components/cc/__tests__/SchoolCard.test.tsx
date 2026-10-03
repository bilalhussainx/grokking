import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SchoolCard from "../SchoolCard";

const base = {
  id: "s1",
  state: null,
  province: null,
  school_type: "public",
  early_deadline: null,
};

const oxford = {
  ...base,
  name: "University of Oxford",
  city: "Oxford",
  country: "UK",
  application_platform: "UCAS",
  acceptance_rate: null,
  avg_net_price: null,
  test_policy: null,
  regular_deadline: "Oct 15",
};

const ucl = { ...oxford, name: "University College London", city: "London", regular_deadline: null };

const toronto = {
  ...base,
  name: "University of Toronto",
  city: "Toronto",
  province: "ON",
  country: "CA",
  application_platform: "OUAC",
  acceptance_rate: null,
  avg_net_price: null,
  test_policy: null,
  regular_deadline: null,
};

const mit = {
  ...base,
  name: "Massachusetts Institute of Technology",
  city: "Cambridge",
  state: "MA",
  country: "US",
  application_platform: null,
  school_type: "private",
  acceptance_rate: 0.04,
  avg_net_price: 22000,
  test_policy: "required",
  regular_deadline: "Jan 4",
};

describe("SchoolCard null fields", () => {
  it("hides acceptance, net price and test policy when they are null", () => {
    const { container } = render(<SchoolCard school={toronto} />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/% accept/);
    expect(text).not.toMatch(/0%/);
    expect(text).not.toMatch(/net/);
    expect(text).not.toMatch(/Test/);
    expect(text).not.toMatch(/null|undefined/);
  });

  it("shows the application system instead of US fields", () => {
    render(<SchoolCard school={toronto} />);
    expect(screen.getByText("Applies through OUAC")).toBeInTheDocument();
    expect(screen.getByText(/Toronto, ON, Canada/)).toBeInTheDocument();
  });

  it("points UK schools without a stored deadline to the UCAS deadline", () => {
    render(<SchoolCard school={ucl} />);
    expect(screen.getByText("Applies through UCAS")).toBeInTheDocument();
    expect(screen.getByText(/see the UCAS deadline/)).toBeInTheDocument();
  });

  it("shows a stored UK deadline", () => {
    render(<SchoolCard school={oxford} />);
    expect(screen.getByText("Oct 15")).toBeInTheDocument();
    expect(screen.queryByText(/see the UCAS deadline/)).toBeNull();
  });

  it("still shows US stats for US schools", () => {
    const { container } = render(<SchoolCard school={mit} />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/4% accept/);
    expect(text).toMatch(/\$22,000 net/);
    expect(text).toMatch(/Test required/);
    expect(text).not.toMatch(/Applies through/);
  });
});

describe("SchoolCard plan chips", () => {
  const listProps = { listEntryId: "e1", onPlanChange: vi.fn() };

  it("offers ED/EA/REA/RD/Rolling for US schools", () => {
    render(<SchoolCard school={mit} {...listProps} />);
    expect(screen.getByText("Applying as")).toBeInTheDocument();
    for (const l of ["ED", "EA", "REA", "RD", "Rolling"]) {
      expect(screen.getByRole("button", { name: l })).toBeInTheDocument();
    }
  });

  it("offers no US plan chips for UK or Canadian schools", () => {
    for (const s of [oxford, toronto]) {
      const { unmount } = render(<SchoolCard school={s} {...listProps} />);
      expect(screen.queryByText("Applying as")).toBeNull();
      expect(screen.queryByRole("button", { name: "ED" })).toBeNull();
      unmount();
    }
  });
});
