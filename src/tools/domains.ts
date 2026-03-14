import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AdmClient } from "../adm-client.js";

export function registerDomainTools(server: McpServer, adm: AdmClient) {
  server.tool("uua_domains", "List all domains in your u.ua account", {}, async () => {
    const { response } = await adm.call<{ list: Record<string, Record<string, unknown>> }>("dns/list");
    const domains = response.list;
    if (!domains || !Object.keys(domains).length) {
      return { content: [{ type: "text", text: "No domains found." }] };
    }

    const lines = [`# Domains (${Object.keys(domains).length})`, ""];
    for (const [name, info] of Object.entries(domains)) {
      const id = info.domain_id ?? info.id ?? "?";
      const expired = info.expired === "1" || info.expired === true;
      const pending = info.pending_delete === true;
      const paid = info.domain_paid === "1";
      const expiry = info.valid_untill_formatted || info.valid_untill || "";

      let status = "UNKNOWN";
      if (pending) status = "PENDING DELETE";
      else if (expired) status = "EXPIRED";
      else if (paid) status = "ACTIVE";

      lines.push(`- **${name}** (id: ${id}) [${status}]${expiry ? ` expires: ${expiry}` : ""}`);
    }
    return { content: [{ type: "text", text: lines.join("\n") }] };
  });

  server.tool(
    "uua_domain_check",
    "Check if a domain name is available for registration",
    { domain: z.string().describe("Domain to check (e.g. example.com.ua)") },
    async ({ domain }) => {
      const { result, response } = await adm.call<Record<string, unknown>>("domain/check", { domain });
      const lines = [`# Domain check: ${domain}`, `- Available: ${result ? "YES" : "NO"}`];
      if (response && typeof response === "object") {
        for (const [k, v] of Object.entries(response)) {
          if (v != null && v !== "") lines.push(`- ${k}: ${v}`);
        }
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
    },
  );

  server.tool("uua_domain_zones", "List available domain zones with prices", {}, async () => {
    const { response } = await adm.call<{ list: Record<string, unknown>[] }>("domain/zones");
    const zones = response.list;
    if (!zones?.length) return { content: [{ type: "text", text: "No zones." }] };

    const lines = [`# Available Zones (${zones.length})`, ""];
    for (const z of zones.slice(0, 50)) {
      const rec = z as Record<string, unknown>;
      lines.push(`- .${rec.zone || rec.name || "?"} ${rec.price_register || rec.price ? `— ${rec.price_register || rec.price} UAH` : ""}`);
    }
    if (zones.length > 50) lines.push(`\n... and ${zones.length - 50} more`);
    return { content: [{ type: "text", text: lines.join("\n") }] };
  });

  server.tool(
    "uua_domain_add",
    "Add a domain to NS servers (for DNS management)",
    { domain_name: z.string().describe("Domain name to add") },
    async ({ domain_name }) => {
      const { response } = await adm.call<{ domain_id: number }>("dns/add_foreign_domain", { domain_name });
      return { content: [{ type: "text", text: `Domain added. ID: ${response.domain_id}` }] };
    },
  );

  server.tool(
    "uua_get_id",
    "Get object ID by type and name (utility)",
    {
      type: z.string().describe("Object type (e.g. domain, hosting)"),
      name: z.string().describe("Object name"),
    },
    async ({ type, name }) => {
      const { response } = await adm.call<Record<string, unknown>>("get_id", { type, name });
      const id = Object.values(response)[0];
      return { content: [{ type: "text", text: `ID for ${type}/${name}: ${id}` }] };
    },
  );
}
