import { NextResponse } from "next/server";

// Mock API route — provides realistic dashboard data for development/testing
// since the real API at API_BASE_URL doesn't exist
export async function GET() {
  return NextResponse.json({
    revenue: [4200, 5100, 4800, 6200, 7100, 6800, 7500, 8200, 7900, 8800, 9500, 10200],
    users: [120, 150, 180, 210, 250, 280, 310, 340, 370, 400, 430, 460],
    orders: [45, 52, 48, 63, 71, 68, 75, 82, 79, 88, 95, 102],
    summary: {
      totalRevenue: 86300,
      totalUsers: 3500,
      totalOrders: 868,
      previousRevenue: 72000,
      previousUsers: 2800,
      previousOrders: 720,
    },
  });
}
