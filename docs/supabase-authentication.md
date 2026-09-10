# Supabase Authentication

This guide describes how Digitora LeadAI uses Supabase Auth, PostgreSQL row-level security, and protected API routes.

## Architecture

| Layer              | Responsibility                                                       |
| ------------------ | -------------------------------------------------------------------- |
| React web app      | Signup, login, session restoration, logout, and protected routes     |
| Express API        | Validates bearer tokens and creates an authenticated Supabase client |
| Supabase Auth      | Issues and refreshes user sessions                                   |
| PostgreSQL         | Stores profiles, organizations, memberships, and roles               |
| Row-level security | Restricts data access to the authenticated user's organization       |

Authentication proves the user's identity. Authorization is determined by organization memberships and database policies.

User metadata such as `full_name` may be used for display, but it must never determine permissions.

## Environment variables

Copy the example environment file before starting the application:

```powershell
Copy-Item .env.example .env
```
