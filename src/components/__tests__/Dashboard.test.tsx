import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Dashboard } from "../Dashboard";

// Mock the api-client module
vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    // Mock apiGet to never resolve (stays loading)
    vi.doMock("@/lib/api-client", () => ({
      apiGet: vi.fn(() => new Promise(() => {})),
    }));

    render(<Dashboard />);
    expect(screen.getByText("Loading dashboard data...")).toBeTruthy();
  });

  it("shows error state when API fails", async () => {
    vi.doMock("@/lib/api-client", () => ({
      apiGet: vi.fn(() => Promise.reject(new Error("Network error"))),
    }));

    // Need to re-import to pick up the new mock
    const { Dashboard: FreshDashboard } = await import("../Dashboard");
    render(<FreshDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeTruthy();
    });
  });

  it("renders dashboard with data", async () => {
    const mockData = {
      revenue: [1000, 2000, 3000, 4000, 5000],
      users: [100, 200, 300],
      orders: [50, 100, 150],
      summary: {
        totalRevenue: 15000,
        totalUsers: 600,
        totalOrders: 300,
        previousRevenue: 12000,
        previousUsers: 500,
        previousOrders: 250,
      },
    };

    vi.doMock("@/lib/api-client", () => ({
      apiGet: vi.fn(() => Promise.resolve({ data: mockData, status: 200 })),
    }));

    const { Dashboard: FreshDashboard } = await import("../Dashboard");
    render(<FreshDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeTruthy();
      expect(screen.getByText("Revenue Trend")).toBeTruthy();
    });
  });

  it("handles empty revenue array without NaN", async () => {
    const mockData = {
      revenue: [],
      users: [],
      orders: [],
      summary: {
        totalRevenue: 0,
        totalUsers: 0,
        totalOrders: 0,
        previousRevenue: 0,
        previousUsers: 0,
        previousOrders: 0,
      },
    };

    vi.doMock("@/lib/api-client", () => ({
      apiGet: vi.fn(() => Promise.resolve({ data: mockData, status: 200 })),
    }));

    const { Dashboard: FreshDashboard } = await import("../Dashboard");
    const { container } = render(<FreshDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Revenue Trend")).toBeTruthy();
    });

    // Should not produce any NaN values in the rendered output
    expect(container.innerHTML).not.toContain("NaN");
  });
});
