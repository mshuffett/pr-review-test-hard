const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL environment variable is not set. " +
      "Copy .env.example to .env.local and configure it."
  );
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { data, status: response.status };
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, { method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
