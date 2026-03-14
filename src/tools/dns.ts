import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AdmClient } from "../adm-client.js";

export function registerDnsTools(server: McpServer, adm: AdmClient) {
  server.tool(
    "uua_dns_records",
    "List all DNS records for a domain",
    { domain_id: z.number().describe("Domain ID (from uua_domains)") },
    async ({ domain_id }) => {
      const { response } = await adm.call<{ list: Record<string, unknown>[] }>("dns/records_list", { domain_id });
      const records = response.list;
      if (!records?.length) return { content: [{ type: "text", text: "No DNS records." }] };

      const lines = [`# DNS Records (${records.length})`, ""];
      for (const r of records) {
        const type = r.type || "?";
        const name = r.record || r.name || "@";
        const data = r.data || r.value || "";
        const prio = r.priority ? ` (priority: ${r.priority})` : "";
        lines.push(`- **${type}** ${name} → ${data}${prio} (id: ${r.id || "?"})`);
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
    },
  );

  server.tool(
    "uua_dns_add",
    "Add a DNS record to a domain",
    {
      domain_id: z.number().describe("Domain ID"),
      type: z.enum(["A", "AAAA", "ALIAS", "CAA", "CNAME", "MX", "NS", "TXT", "SRV"]).describe("Record type"),
      record: z.string().describe("Subdomain name (@ for root, www, mail, etc.)"),
      data: z.string().describe("Record value (IP, hostname, text)"),
      priority: z.number().optional().default(0).describe("Priority (for MX records)"),
    },
    async ({ domain_id, type, record, data, priority }) => {
      await adm.call("dns/record_add", { domain_id, type, record, data, priority: priority ?? 0 });
      return { content: [{ type: "text", text: `DNS record added: ${type} ${record} → ${data}` }] };
    },
  );

  server.tool(
    "uua_dns_delete",
    "Delete a DNS record (careful!)",
    { subdomain_id: z.number().describe("DNS record ID (from uua_dns_records)") },
    async ({ subdomain_id }) => {
      await adm.call("dns/record_delete", { subdomain_id });
      return { content: [{ type: "text", text: `DNS record ${subdomain_id} deleted.` }] };
    },
  );
}
