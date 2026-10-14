# Part-time Coder — Automated Quality Assurance & Test Matrix

> **Document ID:** PTC-TEST-001  
> **Version:** 1.0.0  
> **Current Phase:** P00  
> **Updated:** 15 October 2026  
> **Test Frameworks:** Vitest (Unit/Integration), ESLint (Static Analysis), TypeScript (Type Safety), Playwright (E2E scheduled P12)  
> **Governing Sources:** `AGENTS.md` Section 12, `docs/IMPLEMENTATION_PLAN.md` Section 13

---

## 1. Master Test Catalog & Execution Register

| Test ID | Domain / Scope | Description | Phase | Type | Execution Command | Result | Evidence / Notes |
|---|---|---|---|---|---|---|---|
| `IMP-AT-001` | Architecture | Monorepo strict TypeScript typecheck | P00 | Static | `pnpm typecheck` | **PASS** | 8 workspace projects checked without errors (`tsc --noEmit`) |
| `IMP-AT-002` | Architecture | Monorepo static linting and import rules | P00 | Static | `pnpm lint` (`eslint .`) | **PASS** | Clean ESLint run across all packages |
| `IMP-AT-003` | Architecture | Package compilation and production build | P00 | Build | `pnpm build` | **PASS** | `@ptc/worker` tsc build and `@ptc/web` Next.js 14 SSG build clean |
| `IMP-AT-011` | Config / Security | Typed environment validation & secret redaction | P00 | Unit | `pnpm test:unit` | **PASS** | 23 unit tests in `packages/config/src/env.test.ts` passing (including 8 hardened security checks) |
| `IMP-AT-012` | Runtime | Health check REST endpoint verification | P00 | Integration | `GET /api/v1/health` | **PASS** | Responds 200 OK with `{ status: 'ok', app: 'Part-time Coder', version: 'v1' }` |
| `IMP-AT-013` | CI / DevOps | GitHub Actions CI workflow pipeline definition | P00 | Automated | Local validation: typecheck, lint, test, build, secret audits | **PASS** (Local) | `.github/workflows/ci.yml` defined; REMOTE_CI_STATUS: NOT_VERIFIED |
| `IMP-AT-004` | Isolation | Cross-client isolation & IDOR prevention | P02 | Integration | — | `not_run` | Scheduled for Phase P02 |
| `IMP-AT-005` | Auth / DTO | Client DTO serialization field stripping | P02 | Unit | — | `not_run` | Scheduled for Phase P02 |
| `IMP-AT-006` | Identity | Firebase session token exchange and cookie | P02 | Integration | — | `not_run` | Scheduled for Phase P02 |
| `IMP-AT-007` | Identity | Suspended user session immediate revocation | P02 | Integration | — | `not_run` | Scheduled for Phase P02 |
| `IMP-AT-008` | Governance | Last-owner deactivation lockout protection | P02 | Unit | — | `not_run` | Scheduled for Phase P02 |
| `IMP-AT-009` | Worker | Atomic job lease acquisition & locking | P07 | Unit | — | `not_run` | Scheduled for Phase P07 |
| `IMP-AT-010` | Worker | Job lease expiration & crash recovery | P07 | Integration | — | `not_run` | Scheduled for Phase P07 |

---

## 2. P00 Environment Validation Test Breakdown (`IMP-AT-011`)

| Scenario | Expected Behavior | Actual Result |
|---|---|---|
| Valid Local Configuration | Parses `APP_ENV=local`, defaults port 3000, normalizes private key newlines | **PASS** |
| Valid Production Configuration | Parses `APP_ENV=production`, enforces HTTPS cookie, validates Atlas URI | **PASS** |
| Missing Required Variable | Throws descriptive error without echoing secrets (`MONGODB_URI: Required`) | **PASS** |
| Short `SESSION_SECRET` (<32 chars) | Rejects with validation error, redacting secret input value | **PASS** |
| Invalid Port or URL | Rejects non-URL string and port > 65535 | **PASS** |
| Localhost MongoDB in Production | Custom refinement triggers fail-closed error preventing localhost in prod | **PASS** |
| Insecure Cookie in Production | Custom refinement enforces `SESSION_COOKIE_SECURE=true` in production | **PASS** |
| Missing Encryption Key in Prod | Custom refinement requires `INTEGRATION_ENCRYPTION_KEY` in production | **PASS** |
| Conditional Cloudinary Requirement | If `ENABLE_CLOUDINARY=true`, validates cloud name, API key, and secret | **PASS** |
| Disabled Optional Integrations | If `ENABLE_CLOUDINARY=false`, allows startup without Cloudinary credentials | **PASS** |
| Invalid Environment Type | Rejects arbitrary `APP_ENV` values not in `['local', 'test', 'staging', 'production']` | **PASS** |
| Public Allowlist Schema | Validates `NEXT_PUBLIC_*` variables required for browser client bundle | **PASS** |
| Public Missing Variable | Fails closed when required public client credentials are missing | **PASS** |
| Server Secrets Isolation | Confirms server secrets (`MONGODB_URI`, `SESSION_SECRET`) are never in public schema | **PASS** |
| Secret Redaction in Error Messages | Verifies error outputs omit sensitive user input values | **PASS** |
| Placeholder `SESSION_SECRET` in Prod | Rejects placeholder substrings (`replace_with`, `dummy`, etc.) in production | **PASS** |
| Placeholder `FIREBASE_PRIVATE_KEY` in Prod | Rejects placeholder private key tokens in production | **PASS** |
| Placeholder `FIREBASE_CLIENT_EMAIL` in Prod | Rejects `example.com` and placeholder emails in production | **PASS** |
| Placeholder `INTEGRATION_ENCRYPTION_KEY` in Prod | Rejects placeholder encryption keys in production | **PASS** |
| Placeholder `MONGODB_URI` in Prod | Rejects placeholder MongoDB connection strings in production | **PASS** |
| Firebase PEM Boundary Headers | Rejects private keys lacking `-----BEGIN/END PRIVATE KEY-----` | **PASS** |
| Production HTTPS Public URL | Requires `PUBLIC_APP_URL` to start with `https://` in production | **PASS** |
| Browser Context Server Env Guard | Throws fatal error if `validateServerEnv` is invoked in browser/client context | **PASS** |
