const BASE = "https://adm.tools/action";

export class AdmClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async call<T = Record<string, unknown>>(
    action: string,
    params?: Record<string, string | number>,
  ): Promise<{ result: boolean; response: T }> {
    const url = `${BASE}/${action.replace(/^\/+/, "")}/`;

    const body = params
      ? new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)]),
          ),
        ).toString()
      : "";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`adm.tools ${action} → ${res.status}: ${text.slice(0, 500)}`);
    }

    const json = JSON.parse(text) as { result: boolean; response: T; error?: string };

    if (!json.result && json.error) {
      throw new Error(`adm.tools ${action}: ${json.error}`);
    }

    return { result: json.result, response: json.response };
  }
}
