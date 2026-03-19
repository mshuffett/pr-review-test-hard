"use client";

interface StatsCardProps {
  title: string;
  value?: number;
  previousValue?: number;
  format?: "currency" | "number" | "percentage";
}

export function StatsCard({ title, value, previousValue, format }: StatsCardProps) {
  // BUG: No null check — accessing .toFixed() on undefined will throw
  // when data hasn't loaded yet (value is undefined before API responds)
  const formattedValue =
    format === "currency"
      ? `$${value!.toLocaleString()}`
      : format === "percentage"
        ? `${value!.toFixed(1)}%`
        : value!.toLocaleString();

  // BUG: Percentage change calculation divides by previousValue, but should
  // handle the case where previousValue is 0 or undefined.
  // Also: the formula is wrong — it calculates (current - previous) / current
  // instead of the correct (current - previous) / previous
  const percentageChange = ((value! - previousValue!) / value!) * 100;

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
