# Samsara.ai MCP Skills Server

MCP server that exposes Samsara.ai's course and lesson planning methodology as tools.

## What This Exposes

**The methodology, NOT the content.** Other AI agents can call these tools to learn HOW
to create courses following Samsara.ai's standards — they don't get access to the actual
course library.

## Tools

| Tool | Description |
|------|-------------|
| `samsara_list_domains` | List all supported domains and variations |
| `samsara_get_skill` | Read the full skill file (course-planning or lesson-planning) |
| `samsara_plan_course` | Get instructions for designing a complete course skeleton |
| `samsara_plan_lesson` | Get instructions for generating individual lesson content |

## Setup

```bash
cd mcp-samsara
npm install
npm run build
```

## Usage with Claude Code

Add to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "samsara-skills": {
      "command": "node",
      "args": ["./mcp-samsara/dist/index.js"],
      "env": {
        "SAMSARA_API_KEY": "optional-for-auth"
      }
    }
  }
}
```

## Usage with Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "samsara-skills": {
      "command": "node",
      "args": ["./mcp-samsara/dist/index.js"]
    }
  }
}
```

## Authentication

Set `SAMSARA_API_KEY` env var to require API key authentication.
If not set, tools are open access (for local development).

## Monetization

For paid access, set `SAMSARA_API_KEY` and distribute keys to paying customers.
Future: integrate with Stripe/Paddle for metered billing per tool call.
