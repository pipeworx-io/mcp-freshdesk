# mcp-freshdesk

Freshdesk MCP Pack — helpdesk ticket and contact management via Freshdesk API v2.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `freshdesk_list_tickets` | List support tickets filtered by status (e.g., "open", "closed") and priority (e.g., "1" for urgent). Returns ticket ID, subject, status, priority, and requester. |
| `freshdesk_get_ticket` | Get full ticket details by ID including subject, status, priority, description, conversations, attachments, and resolution notes. |
| `freshdesk_search_tickets` | Search tickets by query (e.g., "status:2 AND priority:3" or keyword text). Returns matching ticket ID, subject, status, and priority. |
| `freshdesk_list_contacts` | List customer contacts. Returns name, email, phone, company, and contact ID for filtering and pagination. |
| `freshdesk_get_contact` | Get full contact details by ID including name, email, phone, company, address, and ticket history. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "freshdesk": {
      "url": "https://gateway.pipeworx.io/freshdesk/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Freshdesk data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
