import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AdmClient } from "./adm-client.js";
import { registerDomainTools } from "./tools/domains.js";
import { registerDnsTools } from "./tools/dns.js";
import { registerBillingTools } from "./tools/billing.js";
import { registerMailTools } from "./tools/mail.js";

function env(name: string): string {
  const val = process.env[name];
  if (!val) {
    process.stderr.write(`Missing required env var: ${name}\n`);
    process.exit(1);
  }
  return val;
}

const client = new AdmClient(env("ADMTOOLS_API_TOKEN"));
const server = new McpServer({ name: "admtools", version: "2.0.0" });

registerDomainTools(server, client);
registerDnsTools(server, client);
registerBillingTools(server, client);
registerMailTools(server, client);

await server.connect(new StdioServerTransport());
