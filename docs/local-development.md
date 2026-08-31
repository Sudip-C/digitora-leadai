# Local Development

This guide explains how to run the Digitora LeadAI monorepo locally.

## Requirements

- Git
- Node.js 20 or newer
- npm 10 or newer
- VS Code or another code editor

Check the installed versions:

```powershell
node --version
npm --version
git --version
```

## Installation

Clone and open the repository:

```powershell
git clone https://github.com/Sudip-C/digitora-leadai.git
cd digitora-leadai
code .
```

Install all workspace dependencies:

```powershell
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

The `.env` file is ignored by Git. Never commit real credentials.

## Development

Start the web, API, and worker workspaces together:

```powershell
npm run dev
```

Stop all processes with `Ctrl+C`.

## Quality checks

```powershell
npm run format:check
npm run lint
npm test
npm run build
```

Run every check with one command:

```powershell
npm run check
```

## Workspace commands

Run a command for only one workspace:

```powershell
npm test --workspace @digitora/web
npm test --workspace @digitora/api
npm test --workspace @digitora/worker
npm test --workspace @digitora/config
```

## Current workspaces

| Workspace          | Purpose                        |
| ------------------ | ------------------------------ |
| `@digitora/web`    | React dashboard foundation     |
| `@digitora/api`    | Express API and webhooks       |
| `@digitora/worker` | Background jobs and scheduling |
| `@digitora/config` | Shared application constants   |

React, Express, Supabase, Redis, NVIDIA Nemotron, and WhatsApp are added in their dedicated project parts.
