export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig<TBody = unknown> {
  body?: TBody;
  headers?: HeadersInit;
  method?: HttpMethod;
  path: string;
  query?: Record<string, boolean | number | string | undefined>;
  signal?: AbortSignal;
}

export interface ApiResult<TData> {
  data: TData;
  status: number;
}

export class ApiAdapterError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(message);
    this.name = "ApiAdapterError";
  }
}

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export async function requestJson<TData, TBody = unknown>({
  body,
  headers,
  method = "GET",
  path,
  query,
  signal,
}: RequestConfig<TBody>): Promise<ApiResult<TData>> {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    method,
    signal,
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiAdapterError(
      `Request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return {
    data: payload as TData,
    status: response.status,
  };
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
