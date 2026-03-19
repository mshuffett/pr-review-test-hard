import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("api-client", () => {
  const originalEnv = process.env.API_BASE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.API_BASE_URL = originalEnv;
    } else {
      delete process.env.API_BASE_URL;
    }
  });

  it("throws if API_BASE_URL is not set", async () => {
    delete process.env.API_BASE_URL;
    await expect(() => import("../api-client")).rejects.toThrow(
      "API_BASE_URL environment variable is not set"
    );
  });

  it("makes GET requests correctly", async () => {
    process.env.API_BASE_URL = "http://localhost:3001/api";
    const mockResponse = { data: { test: true }, status: 200 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse.data),
    });

    const { apiGet } = await import("../api-client");
    const result = await apiGet("/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/test",
      expect.objectContaining({ method: "GET" })
    );
    expect(result.data).toEqual({ test: true });
  });

  it("throws on non-ok response", async () => {
    process.env.API_BASE_URL = "http://localhost:3001/api";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { apiFetch } = await import("../api-client");
    await expect(apiFetch("/fail")).rejects.toThrow("API error: 500");
  });

  it("makes POST requests with body", async () => {
    process.env.API_BASE_URL = "http://localhost:3001/api";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 1 }),
    });

    const { apiPost } = await import("../api-client");
    const result = await apiPost("/items", { name: "test" });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/items",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      })
    );
    expect(result.data).toEqual({ id: 1 });
  });
});
