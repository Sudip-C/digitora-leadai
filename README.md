# Digitora LeadAI

AI-powered lead discovery, outreach and CRM automation for Digitora Solutions.

## What it does

Digitora LeadAI discovers suitable business leads, enriches and qualifies them with NVIDIA Nemotron, prepares personalized outreach, tracks conversations, schedules compliant follow-ups, and maintains the complete sales pipeline.

## Planned stack

- React + JavaScript + Vite
- Tailwind CSS
- Node.js + Express
- Supabase PostgreSQL + Auth
- NVIDIA Nemotron through NVIDIA NIM
- Redis + BullMQ
- Official WhatsApp Business Platform
- Vercel for the web app
- Railway for API and workers

## Safety boundary

The AI proposes. The backend validates and decides. No model output can directly invoke a messaging integration. The MVP requires human approval before first contact, enforces duplicate and suppression checks, and stops follow-ups when a lead replies or opts out.

## Repository layout

```text
apps/web       React dashboard
apps/api       Express API and webhooks
apps/worker    BullMQ workers and scheduler
packages/      Shared domain, schemas, database and integrations
supabase/      Database migrations and seed configuration
docs/          System design and implementation documentation
```

## Local development

Requirements: Node.js 22 or newer and npm 10 or newer.

```bash
npm install
npm run dev
```

Run all quality checks:

```bash
npm run check
```

See the [local development guide](docs/local-development.md) for complete setup instructions.
For environment variables, hosted Auth configuration, protected routes, and security rules, see the [Supabase authentication guide](docs/supabase-authentication.md).

## Development plan

The first production pilot is planned across five weeks:

1. Foundation and CRM
2. Discovery, enrichment and qualification
3. Message generation and WhatsApp
4. Inbox, reply intelligence and follow-ups
5. Analytics, hardening and deployment

See [the complete system design](docs/system-design.md).

## Status

Parts 1–4 are complete: monorepo foundation, frontend design system, Express API foundation, Supabase tenant schema, and authenticated web and API routes.

Next: build the core lead CRM domain and workflows.

## License

License to be selected before public distribution.
