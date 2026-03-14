import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AdmClient } from "../adm-client.js";

function fmt(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function registerBillingTools(server: McpServer, adm: AdmClient) {
  server.tool("uua_balance", "Get current account balance", {}, async () => {
    const { response } = await adm.call<{ balance: number }>("billing/balance_get");
    return { content: [{ type: "text", text: `# Account Balance\n\n**${response.balance} UAH**` }] };
  });

  server.tool(
    "uua_api_raw",
    "Call any adm.tools API endpoint directly. See https://adm.tools/user/api/ for all methods.",
    {
      action: z.string().describe("API action path (e.g. dns/list, billing/balance_get, domain/check)"),
      params: z.string().optional().describe("JSON object of POST parameters"),
    },
    async ({ action, params }) => {
      const parsedParams = params ? JSON.parse(params) : undefined;
      const { result, response } = await adm.call(action, parsedParams);
      return {
        content: [{
          type: "text",
          text: `# ${action}\n- Result: ${result}\n\n\`\`\`json\n${fmt(response)}\n\`\`\``,
        }],
      };
    },
  );
}
