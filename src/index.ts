import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AdmClient } from "./adm-client.js";
import { registerDomainTools } from "./tools/domains.js";
import { registerDnsTools } from "./tools/dns.js";
import { registerBillingTools } from "./tools/billing.js";
import { registerMailTools } from "./tools/mail.js";

const token = process.env.UUA_API_TOKEN;
if (!token) {
  process.stderr.write("Missing env var: UUA_API_TOKEN\n");
  process.exit(1);
}

const client = new AdmClient(token);

const server = new McpServer({
  name: "uua",
  version: "1.0.0",
});

registerDomainTools(server, client);
registerDnsTools(server, client);
registerBillingTools(server, client);
registerMailTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
