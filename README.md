# u.ua MCP Server

MCP (Model Context Protocol) server for [ukraine.com.ua](https://ukraine.com.ua) (u.ua) hosting platform. Manage domains, DNS records, email, and billing directly from AI assistants like Cursor and Claude.

## Features

- **Domains** — list domains, check availability, available zones with pricing
- **DNS Management** — full CRUD for DNS records (A, AAAA, CNAME, MX, TXT, etc.)
- **Email** — list mail domains, mailboxes, redirects
- **Billing** — account balance
- **Raw API Access** — call any adm.tools endpoint directly

13 tools total.

## Requirements

- Node.js 20+
- u.ua API token (activate at [adm.tools/user/api](https://adm.tools/user/api/))

## Setup

```bash
npm install
npm run build
```

## Configuration

Add to your MCP config (`~/.cursor/mcp.json` or Claude `settings.json`):

```json
{
  "mcpServers": {
    "uua": {
      "command": "node",
      "args": ["path/to/uua-mcp/dist/index.js"],
      "env": {
        "UUA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UUA_API_TOKEN` | Yes | Bearer token from adm.tools API settings |

## Tools

### Domains

| Tool | Description |
|------|-------------|
| `uua_domains` | List all domains with status and expiry |
| `uua_domain_check` | Check domain availability |
| `uua_domain_zones` | Available zones with registration prices |
| `uua_domain_add` | Add domain to NS servers |
| `uua_get_id` | Get object ID by type and name |

### DNS

| Tool | Description |
|------|-------------|
| `uua_dns_records` | List DNS records for a domain |
| `uua_dns_add` | Add DNS record (A, AAAA, ALIAS, CAA, CNAME, MX, NS, TXT, SRV) |
| `uua_dns_delete` | Delete DNS record |

### Email

| Tool | Description |
|------|-------------|
| `uua_mail_domains` | List all mail domains |
| `uua_mailboxes` | List mailboxes/redirects for a domain |
| `uua_mailbox_delete` | Delete a mailbox |

### Billing

| Tool | Description |
|------|-------------|
| `uua_balance` | Current account balance (UAH) |

### Advanced

| Tool | Description |
|------|-------------|
| `uua_api_raw` | Call any adm.tools API endpoint directly |

## API Reference

- API documentation: [adm.tools/user/api](https://adm.tools/user/api/) (requires login)
- Official PHP client: [github.com/ukraine-com-ua/API](https://github.com/ukraine-com-ua/API)
- Wiki: [ukraine.com.ua/wiki/account/api](https://ukraine.com.ua/wiki/account/api/)

## Tech Stack

- TypeScript, MCP SDK (`@modelcontextprotocol/sdk`)
- Zod schema validation
- Native `fetch` with `Authorization: Bearer` auth

## License

MIT
