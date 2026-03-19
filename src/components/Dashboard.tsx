"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "./StatsCard";

interface DashboardData {
  revenue: number[];
  users: number[];
  orders: number[];
  summary: {
    totalRevenue: number;
    totalUsers: number;
    totalOrders: number;
    previousRevenue: number;
    previousUsers: number;
    previousOrders: number;
  };
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // BUG: This will throw at module load time if API_BASE_URL is not set,
    // because api-client.ts throws on import when the env var is missing.
    // The skill needs to create .env.local or mock the API to get past this.
    const fetchData = async () => {
      const { apiGet } = await import("@/lib/api-client");
      const response = await apiGet<DashboardData>("/dashboard/stats");
      setData(response.data);
    };

    fetchData();
  }, []);

  // BUG: No loading state — renders chart immediately with null data
  // which will cause the chart calculation below to blow up

  const chartData = data?.revenue ?? [];

  // BUG: Division by zero when chartData is empty (no data yet or API returns empty array)
  const maxValue = Math.max(...chartData);
  const normalizedData = chartData.map((value) => value / maxValue);
  // When chartData is empty, Math.max() returns -Infinity, and division produces NaN

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatsCard
          title="Revenue"
          value={data?.summary.totalRevenue}
          previousValue={data?.summary.previousRevenue}
          format="currency"
        />
        <StatsCard
          title="Users"
          value={data?.summary.totalUsers}
          previousValue={data?.summary.previousUsers}
          format="number"
        />
        <StatsCard
          title="Orders"
          value={data?.summary.totalOrders}
          previousValue={data?.summary.previousOrders}
          format="number"
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Revenue Trend</h2>
        <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "4px" }}>
          {normalizedData.map((value, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${value * 100}%`,
                backgroundColor: "#0070f3",
                borderRadius: "4px 4px 0 0",
                minHeight: "2px",
              }}
              title={`$${chartData[index]?.toLocaleString()}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
