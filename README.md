# mcp-freshdesk

Freshdesk MCP Pack — helpdesk ticket and contact management via Freshdesk API v2.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `freshdesk_list_tickets` | List tickets from Freshdesk. Supports filtering by status, priority, and pagination. |
| `freshdesk_get_ticket` | Get a single Freshdesk ticket by its ID. Returns full ticket details including conversations. |
| `freshdesk_search_tickets` | Search Freshdesk tickets using a query string. Supports Freshdesk filter syntax (e.g., "status:2 AND priority:3"). |
| `freshdesk_list_contacts` | List contacts from Freshdesk. Supports pagination. |
| `freshdesk_get_contact` | Get a single Freshdesk contact by ID. Returns full contact details. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "freshdesk": {
      "url": "https://gateway.pipeworx.io/freshdesk/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use freshdesk
```

## License

MIT
