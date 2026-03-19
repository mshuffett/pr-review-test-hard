import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../StatsCard";

describe("StatsCard", () => {
  it("renders loading state when value is undefined", () => {
    render(<StatsCard title="Revenue" format="currency" />);
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("--")).toBeTruthy();
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders currency format correctly", () => {
    render(
      <StatsCard
        title="Revenue"
        value={12500}
        previousValue={10000}
        format="currency"
      />
    );
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("$12,500")).toBeTruthy();
    // (12500 - 10000) / 10000 * 100 = 25%
    expect(screen.getByText("+25.0% vs previous period")).toBeTruthy();
  });

  it("renders number format correctly", () => {
    render(
      <StatsCard
        title="Users"
        value={5000}
        previousValue={4000}
        format="number"
      />
    );
    expect(screen.getByText("Users")).toBeTruthy();
    expect(screen.getByText("5,000")).toBeTruthy();
    // (5000 - 4000) / 4000 * 100 = 25%
    expect(screen.getByText("+25.0% vs previous period")).toBeTruthy();
  });

  it("renders percentage format correctly", () => {
    render(
      <StatsCard
        title="Conversion"
        value={75.5}
        previousValue={70}
        format="percentage"
      />
    );
    expect(screen.getByText("Conversion")).toBeTruthy();
    expect(screen.getByText("75.5%")).toBeTruthy();
  });

  it("handles negative percentage change", () => {
    render(
      <StatsCard
        title="Orders"
        value={800}
        previousValue={1000}
        format="number"
      />
    );
    // (800 - 1000) / 1000 * 100 = -20%
    expect(screen.getByText("-20.0% vs previous period")).toBeTruthy();
  });

  it("handles zero previousValue without crashing", () => {
    render(
      <StatsCard
        title="Revenue"
        value={100}
        previousValue={0}
        format="number"
      />
    );
    // Should show 0% change instead of Infinity
    expect(screen.getByText("+0.0% vs previous period")).toBeTruthy();
  });

  it("handles undefined previousValue without crashing", () => {
    render(
      <StatsCard title="Revenue" value={100} format="number" />
    );
    // Should show 0% change instead of NaN
    expect(screen.getByText("+0.0% vs previous period")).toBeTruthy();
  });
});
