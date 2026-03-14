import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AdmClient } from "../adm-client.js";

function parseJson(raw: string, label: string): Record<string, string | number> {
  try {
    return JSON.parse(raw) as Record<string, string | number>;
  } catch {
    throw new Error(`Invalid JSON in ${label}: ${raw.slice(0, 100)}`);
  }
}

export function registerBillingTools(server: McpServer, adm: AdmClient) {
  server.tool("uua_balance", "Get current account balance", {}, async () => {
    const { response } = await adm.call<{ balance: number }>("billing/balance_get");
    return { content: [{ type: "text", text: `# Account Balance\n\n**${response.balance} UAH**` }] };
  });

  server.tool(
    "uua_api_raw",
    "Call any adm.tools API endpoint directly (advanced)",
    {
      action: z.string().describe("API action path (e.g. dns/list, billing/balance_get, domain/check)"),
      params: z.string().optional().describe("JSON object of POST parameters"),
    },
    async ({ action, params }) => {
      const parsed = params ? parseJson(params, "params") : undefined;
      const { result, response } = await adm.call(action, parsed);
      return {
        content: [{
          type: "text",
          text: `# ${action}\n- Result: ${result}\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\``,
        }],
      };
    },
  );
}
