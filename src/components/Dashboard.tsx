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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { apiGet } = await import("@/lib/api-client");
        const response = await apiGet<DashboardData>("/dashboard/stats");
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Dashboard</h1>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Dashboard</h1>
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
      </div>
    );
  }

  const chartData = data?.revenue ?? [];

  // Guard against empty arrays: Math.max(...[]) returns -Infinity
  const maxValue = chartData.length > 0 ? Math.max(...chartData) : 0;
  const normalizedData =
    maxValue > 0 ? chartData.map((value) => value / maxValue) : chartData.map(() => 0);

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
