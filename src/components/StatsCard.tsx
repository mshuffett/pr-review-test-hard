"use client";

interface StatsCardProps {
  title: string;
  value?: number;
  previousValue?: number;
  format?: "currency" | "number" | "percentage";
}

export function StatsCard({ title, value, previousValue, format }: StatsCardProps) {
  if (value == null) {
    return (
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>{title}</p>
        <p style={{ margin: "0.5rem 0", fontSize: "2rem", fontWeight: "bold" }}>
          --
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#999" }}>
          Loading...
        </p>
      </div>
    );
  }

  const formattedValue =
    format === "currency"
      ? `$${value.toLocaleString()}`
      : format === "percentage"
        ? `${value.toFixed(1)}%`
        : value.toLocaleString();

  // Fixed: use previousValue as denominator (not value), guard against zero/undefined
  const percentageChange =
    previousValue != null && previousValue !== 0
      ? ((value - previousValue) / previousValue) * 100
      : 0;

  const isPositive = percentageChange >= 0;

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>{title}</p>
      <p style={{ margin: "0.5rem 0", fontSize: "2rem", fontWeight: "bold" }}>
        {formattedValue}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          color: isPositive ? "#22c55e" : "#ef4444",
        }}
      >
        {isPositive ? "+" : ""}
        {percentageChange.toFixed(1)}% vs previous period
      </p>
    </div>
  );
}
