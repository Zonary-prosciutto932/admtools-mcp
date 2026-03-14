const BASE = "https://adm.tools/action";
const TIMEOUT_MS = 30_000;

export class AdmClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async call<T = Record<string, unknown>>(
    action: string,
    params?: Record<string, string | number>,
  ): Promise<{ result: boolean; response: T }> {
    const sanitized = action.replace(/^\/+/, "").replace(/\/+$/, "");
    const url = `${BASE}/${sanitized}/`;

    const body = params
      ? new URLSearchParams(
          Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
        ).toString()
      : "";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`adm.tools ${sanitized} → ${res.status}: ${text.slice(0, 500)}`);
    }

    let json: { result: boolean; response: T; error?: string };
    try {
      json = JSON.parse(text) as { result: boolean; response: T; error?: string };
    } catch {
      throw new Error(`API returned non-JSON response: ${text.slice(0, 200)}`);
    }
    if (!json.result && json.error) {
      throw new Error(`adm.tools ${sanitized}: ${json.error}`);
    }

    return { result: json.result, response: json.response };
  }
}
