interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Freshdesk MCP Pack — helpdesk ticket and contact management via Freshdesk API v2.
 *
 * BYO key: pass _apiKey (Freshdesk API key) and _domain (your Freshdesk subdomain).
 * Auth: HTTP Basic with apiKey as username, "X" as password.
 */


function fdHeaders(apiKey: string) {
  const encoded = btoa(`${apiKey}:X`);
  return {
    Authorization: `Basic ${encoded}`,
    'Content-Type': 'application/json',
  };
}

async function fdFetch(apiKey: string, domain: string, path: string) {
  const res = await fetch(`https://${domain}.freshdesk.com/api/v2${path}`, {
    headers: fdHeaders(apiKey),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Freshdesk API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'freshdesk_list_tickets',
    description: 'List tickets from Freshdesk. Supports filtering by status, priority, and pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Freshdesk API key' },
        _domain: { type: 'string', description: 'Freshdesk subdomain (e.g., "mycompany" for mycompany.freshdesk.com)' },
        page: { type: 'number', description: 'Page number for pagination (default 1)' },
        per_page: { type: 'number', description: 'Results per page (default 30, max 100)' },
        filter: {
          type: 'string',
          description: 'Predefined filter: new_and_my_open, watching, spam, deleted (default: new_and_my_open)',
        },
        order_by: { type: 'string', description: 'Sort by: created_at, due_by, updated_at, status (default: created_at)' },
        order_type: { type: 'string', description: 'Sort order: asc or desc (default: desc)' },
      },
      required: ['_apiKey', '_domain'],
    },
  },
  {
    name: 'freshdesk_get_ticket',
    description: 'Get a single Freshdesk ticket by its ID. Returns full ticket details including conversations.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Freshdesk API key' },
        _domain: { type: 'string', description: 'Freshdesk subdomain' },
        id: { type: 'number', description: 'Ticket ID' },
      },
      required: ['_apiKey', '_domain', 'id'],
    },
  },
  {
    name: 'freshdesk_search_tickets',
    description: 'Search Freshdesk tickets using a query string. Supports Freshdesk filter syntax (e.g., "status:2 AND priority:3").',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Freshdesk API key' },
        _domain: { type: 'string', description: 'Freshdesk subdomain' },
        query: {
          type: 'string',
          description: 'Search query in Freshdesk syntax (e.g., "status:2", "priority:1 AND type:\'Question\'")',
        },
      },
      required: ['_apiKey', '_domain', 'query'],
    },
  },
  {
    name: 'freshdesk_list_contacts',
    description: 'List contacts from Freshdesk. Supports pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Freshdesk API key' },
        _domain: { type: 'string', description: 'Freshdesk subdomain' },
        page: { type: 'number', description: 'Page number for pagination (default 1)' },
        per_page: { type: 'number', description: 'Results per page (default 30, max 100)' },
      },
      required: ['_apiKey', '_domain'],
    },
  },
  {
    name: 'freshdesk_get_contact',
    description: 'Get a single Freshdesk contact by ID. Returns full contact details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Freshdesk API key' },
        _domain: { type: 'string', description: 'Freshdesk subdomain' },
        id: { type: 'number', description: 'Contact ID' },
      },
      required: ['_apiKey', '_domain', 'id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string | undefined;
  const domain = args._domain as string | undefined;
  delete args._context;
  delete args._apiKey;
  delete args._domain;

  if (!apiKey) throw new Error('_apiKey is required for Freshdesk API access');
  if (!domain) throw new Error('_domain is required (your Freshdesk subdomain)');

  switch (name) {
    case 'freshdesk_list_tickets': {
      const params = new URLSearchParams();
      if (args.page) params.set('page', String(args.page));
      if (args.per_page) params.set('per_page', String(Math.min(100, args.per_page as number)));
      if (args.filter) params.set('filter', args.filter as string);
      if (args.order_by) params.set('order_by', args.order_by as string);
      if (args.order_type) params.set('order_type', args.order_type as string);
      const qs = params.toString();
      return fdFetch(apiKey, domain, `/tickets${qs ? `?${qs}` : ''}`);
    }
    case 'freshdesk_get_ticket':
      return fdFetch(apiKey, domain, `/tickets/${args.id}?include=conversations`);
    case 'freshdesk_search_tickets': {
      const params = new URLSearchParams({ query: `"${args.query}"` });
      return fdFetch(apiKey, domain, `/search/tickets?${params}`);
    }
    case 'freshdesk_list_contacts': {
      const params = new URLSearchParams();
      if (args.page) params.set('page', String(args.page));
      if (args.per_page) params.set('per_page', String(Math.min(100, args.per_page as number)));
      const qs = params.toString();
      return fdFetch(apiKey, domain, `/contacts${qs ? `?${qs}` : ''}`);
    }
    case 'freshdesk_get_contact':
      return fdFetch(apiKey, domain, `/contacts/${args.id}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
