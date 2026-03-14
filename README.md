# u.ua MCP Server

MCP server for [ukraine.com.ua](https://ukraine.com.ua) (u.ua) hosting platform. Manage domains, DNS records, email, and billing from Cursor, Claude, or any MCP-compatible client.

13 tools for the adm.tools API.

## Requirements

- Node.js 20+
- u.ua API token (activate at [adm.tools/user/api](https://adm.tools/user/api/))

## Installation

```bash
npm ci
npm run build
```

## Configuration

Add to `~/.cursor/mcp.json`:

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
| `uua_domain_check` | Check domain availability for registration |
| `uua_domain_zones` | Available zones with registration prices |
| `uua_domain_add` | Add domain to NS servers for DNS management |
| `uua_get_id` | Get object ID by type and name |

### DNS

| Tool | Description |
|------|-------------|
| `uua_dns_records` | List DNS records for a domain |
| `uua_dns_add` | Add record (A, AAAA, ALIAS, CAA, CNAME, MX, NS, TXT, SRV) |
| `uua_dns_delete` | Delete a DNS record |

### Email

| Tool | Description |
|------|-------------|
| `uua_mail_domains` | List all mail domains |
| `uua_mailboxes` | List mailboxes and redirects for a domain |
| `uua_mailbox_delete` | Delete a mailbox |

### Billing

| Tool | Description |
|------|-------------|
| `uua_balance` | Current account balance (UAH) |

### Raw API

| Tool | Description |
|------|-------------|
| `uua_api_raw` | Call any adm.tools API endpoint directly |

## Security

- 30-second timeout on all HTTP requests
- API action path sanitized (leading/trailing slashes stripped)
- JSON parameters parsed in try/catch (prevents crashes on invalid input)
- Error responses truncated to 500 characters
- All parameters validated with Zod schemas

## Architecture

```
src/
  index.ts          Entry point, env validation
  adm-client.ts     API client (Bearer token, form-encoded POST)
  tools/
    domains.ts      Domain management (5 tools)
    dns.ts          DNS records (3 tools)
    mail.ts         Email management (3 tools)
    billing.ts      Balance and raw API (2 tools)
```

## Tech Stack

- TypeScript
- `@modelcontextprotocol/sdk`
- Zod (schema validation)
- Native `fetch`

## API Reference

- [adm.tools API](https://adm.tools/user/api/) (requires login)
- [Official PHP client](https://github.com/ukraine-com-ua/API)
- [Wiki](https://ukraine.com.ua/wiki/account/api/)

## License

[MIT](LICENSE)
