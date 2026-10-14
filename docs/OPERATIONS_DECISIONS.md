# Part-time Coder — Foundational Operations & Deployment Decisions (IMP-00-08)

> **Document ID:** PTC-OPS-DEC-001  
> **Version:** 1.0.0  
> **Task ID:** `IMP-00-08`  
> **Phase:** P00 (Discovery, Environment, CI and Feasibility)  
> **Gate:** G0  
> **Status:** Active Operational Policy  
> **Effective Date:** 15 October 2026  
> **Governing Documents:** `AGENTS.md` Section 2, `docs/PRD.md` Section 14, `docs/TRD.md` Section 7, `docs/ADR/` (ADR-0001 through ADR-0007), `docs/HOSTING_FEASIBILITY.md`  
> **Applicable Requirement IDs:** `PTC-OPS-001`, `PTC-OPS-002`, `PTC-OPS-003`, `PTC-OPS-004`, `PTC-NFR-007`, `PTC-NFR-015`

---

## 1. Executive Summary & Operational Scope

This document establishes the binding operational rules, architectural trade-offs, financial checkpoints, and environment isolation policies governing the Part-time Coder platform across development, continuous integration, staging, and commercial production tiers.

---

## 2. Multi-Environment Lifecycle & Tier Isolation (`PTC-OPS-002`)

The platform operates across four strictly isolated environments:

| Environment | Identifier | Target URL Contract | Database Binding | Secrets Scope | Purpose |
|---|---|---|---|---|---|
| **Local Development** | `local` | `http://localhost:3000` | Local MongoDB or in-memory replica set | `.env.local` (git-ignored) | Individual feature development and unit testing |
| **Test / CI** | `test` | `http://localhost:3000` | In-memory `MongoMemoryReplSet` (WiredTiger) | Ephemeral workflow environment variables | Automated GitHub Actions CI pipeline |
| **Staging** | `staging` | `https://staging.parttimecoder.com` (or preview URL) | Dedicated MongoDB Atlas M0 cluster (No production data) | Staging secret store (Render/DO) | Pre-release QA, UAT, and migration dry-runs |
| **Production** | `production` | `https://parttimecoder.com` | Dedicated MongoDB Atlas Flex / Dedicated replica set | Production secret store (Restricted access) | Live commercial customer and client operations |

### Invariants:
1. **Zero Cross-Tier Pollution:** Staging databases must never contain real production customer data or unredacted financial records.
2. **Localhost Prohibition in Production:** Process startup fails immediately if `MONGODB_URI` points to `localhost` or `127.0.0.1` when `APP_ENV=production`.
3. **Transport Security:** `SESSION_COOKIE_SECURE=true` and HTTPS URLs are strictly enforced on production startup by `packages/config/src/env.ts`.

---

## 3. Secret Management & Cryptographic Boundaries (`PTC-OPS-003`)

1. **Zero Hardcoded Credentials:** No secret, token, private key, or password may be committed to Git. Enforced by local and CI Gitleaks scans (pinned SHA `e0c47f4`).
2. **Typed Startup Validation:** All environment variables are validated at process boot using Zod schemas (`packages/config/src/env.ts`). Processes fail closed with descriptive messages while redacting raw secret values.
3. **Sensitive Integration Token Encryption:** Social OAuth refresh tokens, access tokens, and API credentials stored in MongoDB must be encrypted at rest using AES-256-GCM authenticated encryption utilizing `INTEGRATION_ENCRYPTION_KEY` (minimum 32 characters, enforced in production).
4. **Session Secret Security:** `SESSION_SECRET` requires a minimum length of 32 characters. Insecure placeholder strings (`replace_with`, `dummy`, `test`, `change_me`) are rejected in production.

---

## 4. Commercial Hosting Architecture (`PTC-OPS-001`, `PTC-NFR-015`)

In accordance with ADR-0006 and `docs/HOSTING_FEASIBILITY.md`:

### 4.1 Preferred Architecture — Render PaaS
- **Web Platform (`apps/web`):** Render Web Service (Starter tier: $7.00/mo, 0.5 vCPU, 512 MB RAM, persistent container, automated TLS).
- **Background Worker (`apps/worker`):** Render Background Worker (Starter tier: $7.00/mo, 0.5 vCPU, 512 MB RAM, dedicated daemon, zero sleep).
- **Database:** MongoDB Atlas Flex tier (usage-based, $8–$30/mo, 5 GB storage, capped spending).
- **Media & Offsite Backups:** Cloudinary Free tier (25 monthly shared credits) + Cloudflare R2 (10 GB free storage, $0 egress).
- **Base Projected Cost:** **~$22.00–$44.00 / month**.

### 4.2 Practical Fallback Architecture — Hetzner Cloud VPS
- **Server:** Hetzner Cloud CX22 VPS (2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic @ €3.79/mo excl. VAT / ~$4.15 USD).
- **Deployment Strategy:** Docker Compose with isolated containers for `@ptc/web`, `@ptc/worker`, and Caddy SSL reverse proxy.
- **Base Projected Cost:** **~$4.15–$15.00 / month**.

---

## 5. Background Worker & Durable Job Policies (`PTC-OPS-004`, `PTC-NFR-007`)

1. **Persistent Execution:** Background worker runs continuously; ephemeral serverless functions (e.g. Vercel Cron) are prohibited for durable queue leases.
2. **Atomic Lease Protocol:** Worker leases jobs via atomic `findOneAndUpdate` queries on MongoDB (`status: 'pending'`, `lockedAt: null`).
3. **Lease Duration & Heartbeat:** Default job lease is 60,000ms. Worker updates its heartbeat every 30,000ms in `worker_heartbeats`.
4. **Crash Recovery:** Jobs with expired leases (`lockedAt < Date.now() - 60000`) and uncompleted status are reclaimed automatically.
5. **Bounded Concurrency:** Worker concurrency is capped at `MAX_CONCURRENT_JOBS = 5` to prevent CPU and memory exhaustion.

---

## 6. Database Disaster Recovery & Backups (`PTC-OPS-005`, `PTC-NFR-006`)

1. **Atlas Free/Flex Limitation:** Atlas M0 and Flex do not provide continuous Point-in-Time Recovery (PITR).
2. **Automated Offsite Backup Policy:** A scheduled daily script executes encrypted `mongodump` archives streamed to Cloudflare R2.
3. **Retention Schedule:** Daily backups retained for 30 days; weekly snapshots retained for 90 days.
4. **Recovery Objectives:**
   - **RPO (Recovery Point Objective):** ≤ 24 hours.
   - **RTO (Recovery Time Objective):** ≤ 4 hours.
   - Rehearsed and verified under non-production conditions during Phase P11 (`IMP-11-06`, `IMP-11-07`).

---

## 7. Owner Financial Checkpoints & Governance Gates

The following operational actions strictly require explicit Owner authorization:

| Operational Action | Governing Boundary | Pre-requisite Phase / Gate |
|---|---|---|
| Paid Web / Worker Hosting Selection | ADR-0006, IMP-00-07 | Phase P13 / Gate G13 |
| Production Database Upgrade (Atlas Flex / M10) | ADR-0006 | Phase P13 / Gate G13 |
| Paid Social API Tiers (e.g. X API $100/mo) | PRD Section 11, ADR-0006 | Phase P08 / Gate G8 |
| Firebase Blaze Upgrade (SMS MFA quotas) | ADR-0004 | Phase P02 / Gate G2 |
| Custom Domain Purchase & DNS Registration | ADR-0006 | Phase P13 / Gate G13 |
| Live Email Delivery & Invoicing | PRD Section 12, 13 | Phase P09, P10 |
