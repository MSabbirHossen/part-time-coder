# Part-time Coder — Commercial Hosting Feasibility Assessment (IMP-00-07)

> **Document ID:** PTC-FEASIBILITY-001  
> **Version:** 1.0.0  
> **Task ID:** `IMP-00-07`  
> **Phase:** P00 (Discovery, Environment, CI and Feasibility)  
> **Gate:** G0  
> **Status:** Completed Feasibility Assessment — Awaiting Owner Review & Authorization  
> **Prepared:** 15 October 2026  
> **Governing Policy:** `AGENTS.md` Section 2, `docs/ADR/ADR-0006-commercial-hosting-environment-strategy.md`, `docs/TRD.md` Section 7  
> **Applicable Requirement IDs:** `PTC-OPS-001`, `PTC-NFR-015`

---

## 1. Executive Summary & Cost Policy Baseline

In accordance with **ADR-0006** ("Commercial Hosting, Deployment Separation, and Environment Strategy"), this assessment evaluates production hosting alternatives for the independent deployment of:
1. **`apps/web`**: Next.js 16 (App Router, React 19, Turbopack, REST API at `/api/v1`)
2. **`apps/worker`**: Dedicated Node.js background process (durable job leases, outbox dispatch, social queue processing)

### Cost Policy Constraints (Binding Principles)
- **Free-Tier-First Development & Staging:** Local development and staging environments must maximize lawful free tiers ($0/month target).
- **Commercial Production Compliance:** Production hosting must strictly comply with provider Terms of Service and commercial licensing. Personal "hobby" plans that forbid commercial client operations (e.g., Vercel Hobby) are strictly disqualified for production.
- **No Pre-Approved Budget:** No fixed monthly infrastructure budget is assumed. All paid hosting, database upgrades, worker subscriptions, and paid API tiers require **explicit Owner approval** prior to provisioning.
- **Zero Paid Commitments at P00:** No infrastructure is purchased or provisioned during Phase P00. This document provides the evaluative basis for Owner decisions before production launch (Phase P13 / Gate G13).

---

## 2. Technical Evaluation Across 10 Operational Dimensions

### 2.1 Dimension 1 — Node.js-Compatible Commercial Web Hosting
`apps/web` requires Node.js 22 LTS support, standalone HTTP serving, dynamic SSR/Route Handler execution for `/api/v1`, and static asset optimization.

| Provider / Tier | Compute Specs | Monthly Cost | Commercial Terms & Notes |
|---|---|---|---|
| **Render Web Service (Starter)** | 0.5 vCPU, 512 MB RAM | **$7.00 / mo** | Commercial use permitted. Dedicated process, no idle spin-down, automated SSL. |
| **Render Web Service (Standard)** | 1.0 vCPU, 2 GB RAM | **$25.00 / mo** | Commercial use permitted. Suitable for higher concurrent web traffic. |
| **DigitalOcean App Platform (Basic)** | 1 vCPU, 512 MB RAM | **$5.00 / mo** | Commercial use permitted. Global CDN edge, 100 GB transfer included. |
| **Railway (Pro / Metered)** | Metered: $10/GB RAM + $20/vCPU | **~$5–$12 / mo** | Commercial use permitted. Billed per second; $20 included usage credit on Pro ($20/mo workspace). |
| **Hetzner Cloud VPS (CX22)** | 2 vCPU, 4 GB RAM, 40 GB NVMe | **~€3.79 (~$4.15) / mo** | Commercial use permitted. Unrestricted full root access, 20 TB traffic included. |
| **Vercel (Pro)** | Serverless compute | **$20.00 / user / mo** | Commercial permitted on Pro. **Disqualified for worker** (serverless execution limits break long queue leases). |

### 2.2 Dimension 2 — Persistent Background Workers
`apps/worker` requires a continuously running Node.js process with a persistent event loop to poll MongoDB for due jobs, acquire atomic distributed leases, maintain heartbeat updates, and process media encoding and publishing without HTTP request timeouts (ADR-0005).

| Provider / Option | Worker Capability | Monthly Cost | Evaluation & Fit |
|---|---|---|---|
| **Render Background Worker** | Dedicated persistent daemon (no incoming HTTP port) | **$7.00 / mo** (Starter, 512 MB) | **Optimal for PaaS.** True background daemon, automatic supervisor restart, independent deployment and log stream. |
| **DigitalOcean Worker Component** | Dedicated background container | **$5.00 / mo** (512 MB) | **Strong.** Deploys alongside web in single DO App Platform project with internal networking. |
| **Railway Container Service** | Always-on container process | **~$5.00–$7.50 / mo** (512 MB) | **Viable.** Continuously runs 24/7; memory billed every second (~$5/mo for 512 MB). |
| **Hetzner Cloud VPS Container** | Docker Compose service on same host | **$0 extra** (included in VPS) | **Maximum Efficiency.** Runs in isolated container alongside web process on single 4 GB server. |
| **AWS ECS Fargate** | Managed container task | **~$15–$25 / mo** | Overkill for MVP; requires VPC, NAT gateway, and CloudWatch log infrastructure. |
| **Serverless Ephemeral Crons** | Vercel Cron / AWS Lambda | Variable | **REJECTED.** Violates ADR-0005. Cannot maintain distributed leases, heartbeats, or resilient retries. |

### 2.3 Dimension 3 — MongoDB Atlas Database Requirements
The platform requires a MongoDB replica set with WiredTiger storage engine supporting multi-document ACID transactions, compound unique indexes, and tenant isolation (ADR-0003, ADR-0006).

| Atlas Tier | Compute & Storage | Backups & Point-in-Time Recovery | Monthly Cost | Recommendation / Verdict |
|---|---|---|---|---|
| **M0 Free Tier** | 512 MB storage, shared RAM/vCPU | **NO automated backups. NO PITR.** | **$0 / mo** | **Staging only.** Unacceptable for commercial production unless backed by an automated, offsite encrypted snapshot tool. |
| **Atlas Flex Tier** | 5 GB storage, burstable compute | Lightweight snapshot backups (up to 7 days) | **~$8.00–$30.00 / mo** (Hard cap $30) | **Recommended for Initial Production.** Replaced legacy M2/M5 tiers; affordable, burstable, predictable spend ceiling. |
| **Atlas Dedicated M10** | 2 GB RAM, 10 GB SSD, 3-node replica set | Continuous Cloud Backup with Point-in-Time Recovery (PITR) up to 35 days | **~$58.00 / mo** (~$0.08/hr) | **Growth Tier.** Full production resilience, dedicated hardware, high IOPs, commercial SLA. Target for Phase P14. |

### 2.4 Dimension 4 — Media Storage and Backups
Media assets (social post images/videos, CMS uploads, invoice PDFs) and database backup snapshots must be securely stored with geographic redundancy.

- **Primary Asset Vault (Cloudinary):**
  - *Free Tier:* 25 monthly credits (equivalent to 25 GB managed storage or 25 GB net bandwidth). Fully sufficient for MVP development, staging, and early production.
  - *Commercial License:* Permitted on Free and Plus tiers.
  - *Upgrade Path:* Plus plan ($89/month) only when monthly active asset transform volume exceeds free credits.
- **Offsite Database Backup Vault (Cloudflare R2 / AWS S3):**
  - Automated offsite backups stream encrypted `mongodump` archives daily to an S3-compatible bucket outside Atlas.
  - *Cloudflare R2:* **$0 egress fees**, $0.015/GB storage. First 10 GB/month are **free**.
  - *Monthly Cost:* **$0.00–$1.00 / month**.

### 2.5 Dimension 5 — Deployment from GitHub
- **Render / Railway / DigitalOcean App Platform:** Native GitHub app integration. Automatically builds and deploys on push to `main` (production) or `feat/**` (staging previews).
- **Hetzner Cloud VPS:** Continuous delivery via GitHub Actions using SSH deploy keys to trigger `docker compose pull && docker compose up -d` with zero downtime via health-checked containers.
- **Artifact Security:** All sensitive environment variables are injected securely at runtime via provider secret stores, never baked into Docker images.

### 2.6 Dimension 6 — Environment Variables and Secret Management
- **PaaS Secret Stores (Render / DO / Railway):** Web dashboard secrets with separate environment scopes (`staging` vs. `production`). Values are encrypted at rest and injected into the container environment.
- **Startup Validation:** Centralized typed validation in `packages/config/src/env.ts` guarantees the container fails immediately on boot if any secret is missing, misconfigured, or contains insecure placeholders.
- **Zero Secret Sprawl:** No secrets committed to Git, logged in console outputs, or exposed to browser client bundles.

### 2.7 Dimension 7 — Logging and Health Monitoring
- **Platform Health Endpoints:** `@ptc/web` exposes `GET /api/v1/health` (verified HTTP 200 with database connectivity and version metadata).
- **Worker Heartbeat:** `@ptc/worker` maintains an atomic heartbeat document in MongoDB (`worker_heartbeats` collection) updated every 30 seconds.
- **Application Monitoring (Free Tiers):**
  - *Sentry (Developer Free):* 5,000 errors/month, performance tracing.
  - *BetterStack / UptimeRobot (Free):* 50 uptime monitors, 3-minute checks with email/webhook alerting.
- **Provider Log Streams:** Render / DO / Railway provide 7 to 30 days of searchable runtime and build logs with zero additional setup.

### 2.8 Dimension 8 — Safe Rollback and Recovery
- **PaaS One-Click Rollback:** Render and DigitalOcean preserve prior build image SHAs. A bad deployment can be rolled back to the previous stable release artifact within seconds without triggering a re-build.
- **Database Schema Protection:** All schema updates adhere to the expand/backfill/verify/contract pattern (`docs/BACKEND_SCHEMA.md`). Additive schema changes ensure a rolled-back application code version remains fully operational against the active database.
- **Disaster Recovery Target:** RPO (Recovery Point Objective) ≤ 24 hours; RTO (Recovery Time Objective) ≤ 4 hours.

### 2.9 Dimension 9 — Scaling and Resource Limits
- **MVP Capacity Target:** 10 concurrent internal staff, 25 client organizations, 1,000 monthly social posts, 50,000 monthly public visitors (PRD Section 14).
- **Vertical Scaling:** PaaS platforms allow 1-click resource resizing (e.g., from 512 MB to 2 GB RAM) with zero code modifications.
- **Horizontal Web Scaling:** Available on Render Pro ($25/mo workspace) and DO App Platform.
- **Worker Concurrency Bounds:** Worker job concurrency is governed in code by lease batch limits (`MAX_CONCURRENT_JOBS = 5`), preventing CPU starvation or memory thrashing under burst loads.

### 2.10 Dimension 10 — Monthly Costs and Potential Hidden Charges
A critical risk in cloud hosting is unexpected overages. Below is an audit of potential hidden cost vectors:

1. **Bandwidth Egress:** Render ($0.15/GB above 25 GB), Railway ($0.05/GB), DigitalOcean ($0.02/GB above 100 GB), Hetzner (20 TB included free).
2. **Build Minute Overages:** Render ($5 per 1,000 extra minutes). Mitigated by lightweight pnpm monorepo caching.
3. **Database Backup Storage:** Atlas M10 continuous backup charges ~$0.10/GB-month for snapshot and oplog storage.
4. **Firebase Auth SMS MFA:** 10 free SMS/day on Spark. On Blaze, phone verification costs ~$0.01–$0.06 per SMS. TOTP/Email MFA avoids SMS carrier surcharges.
5. **Third-Party Social APIs:** X (Twitter) Developer API charges $100/month for Basic tier (read/write). If unpaid, X publishing remains disabled or manual-only as permitted by PRD.

---

## 3. Decision Matrix Comparing Deployment Architectures

| Evaluation Criterion | Option 1: Render PaaS (Preferred) | Option 2: DigitalOcean App Platform | Option 3: Hetzner Cloud VPS (Fallback) | Option 4: Railway Metered PaaS | Option 5: AWS Enterprise Stack |
|---|---|---|---|---|---|
| **Web Hosting Cost** | $7.00 / mo (Starter) | $5.00 / mo (Basic) | Included in VPS | ~$5.00–$10.00 / mo | ~$25.00 / mo (App Runner) |
| **Worker Hosting Cost** | $7.00 / mo (Starter Daemon) | $5.00 / mo (Worker) | Included in VPS | ~$5.00–$7.50 / mo | ~$20.00 / mo (ECS Fargate) |
| **Database Cost (Atlas)** | ~$8.00–$30.00 / mo (Flex) | ~$8.00–$30.00 / mo (Flex) | $0 (M0 + Offsite) or Flex | ~$8.00–$30.00 / mo (Flex) | ~$58.00 / mo (M10 Dedicated) |
| **Media & Backups** | $0.00 (Cloudinary + R2) | $0.00 (Cloudinary + R2) | $0.00 (Cloudinary + R2) | $0.00 (Cloudinary + R2) | ~$5.00 / mo (S3) |
| **Estimated Base Total** | **~$22.00–$44.00 / month** | **~$18.00–$40.00 / month** | **~$4.15–$15.00 / month** | **~$25.00–$50.00 / month** | **~$108.00–$150.00 / month** |
| **Worker Independence** | Excellent (First-class daemon) | Good (Dedicated worker component) | Excellent (Dedicated Docker container) | Good (Persistent container) | Excellent (ECS task) |
| **Commercial Compliance** | Full (Standard ToS) | Full (Standard ToS) | Full (Standard ToS) | Full (Standard ToS) | Full (Standard ToS) |
| **DevOps Overhead** | Zero (Fully managed) | Minimal (Fully managed) | Moderate (Requires OS/Docker maintenance) | Minimal (Metered PaaS) | High (VPC, IAM, CloudWatch) |
| **One-Click Rollbacks** | Yes (Built-in) | Yes (Built-in) | Manual via Docker tags | Yes (Built-in) | Yes via CodeDeploy |
| **Spend Predictability** | High (Flat instance pricing) | High (Flat instance pricing) | Highest (Flat monthly server fee) | Medium (Usage overages possible) | Low (Complex variable billing) |

---

## 4. Architectural Recommendations

### 4.1 Preferred Architecture — Option 1: Render PaaS Stack
**Recommendation:** Deploy independent Web and Worker instances on **Render** paired with **MongoDB Atlas Flex** and **Cloudflare R2** for offsite backup storage.

- **Why Render?**
  1. **Native Background Worker Support:** Render provides an explicit "Background Worker" service type that runs a persistent Node.js daemon without exposing public HTTP endpoints, complete with independent environment variables, restart policies, and resource metrics.
  2. **Predictable Flat Pricing:** Starter instances are billed at a predictable flat rate ($7/mo web + $7/mo worker = $14/mo base compute), avoiding usage-metered surprises.
  3. **Zero DevOps Burden:** Automated TLS certificate provisioning, Git integration, zero-downtime rolling deploys, and instant rollbacks allow part-time engineering focus on product delivery rather than Linux systems administration.
  4. **Commercial Terms Alignment:** Fully compliant with commercial SaaS/agency operations.

### 4.2 Practical Fallback Architecture — Option 3: Hetzner Cloud VPS (Dockerized)
**Recommendation:** In the event that budget constraints dictate minimizing recurring monthly spend below $10/month, deploy a single **Hetzner Cloud CX22 VPS** running Docker Compose.

- **Why Hetzner VPS?**
  1. **Unrivaled Cost-to-Performance Ratio:** For **€3.79 (~$4.15) / month**, the server delivers 2 vCPUs, 4 GB RAM, 40 GB NVMe SSD, and 20 TB of free outbound bandwidth.
  2. **Unified Host for Web and Worker:** Both `@ptc/web` and `@ptc/worker` run in isolated Docker containers on the same physical host, connected via an internal bridge network, with Caddy providing automatic Let's Encrypt SSL termination.
  3. **Trade-off:** Requires basic system maintenance (OS security patches, Docker updates, UFW firewall configuration), which is documented via an operational runbook.

---

## 5. Owner Decision Checkpoints & Action Plan

No financial commitment or production infrastructure provisioning is authorized at this stage. The following actions will take place at the designated implementation gates:

| Decision Checkpoint | Target Phase / Gate | Required Owner Action | AI Agent Obligation |
|---|---|---|---|
| **Staging Hosting Selection** | Phase P12 / Gate G12 | Approve deployment of staging candidate to Render Free / Preview sandbox. | Configure GitHub Actions deployment workflow with staging secrets. |
| **Production Provider Selection** | Phase P13 / Gate G13 | Review and select Option 1 (Render) or Option 3 (Hetzner) based on budget ceiling. | Provide verified deployment templates and pre-flight configuration checks. |
| **Database Tier & Backup Approval** | Phase P13 / Gate G13 | Authorize MongoDB Atlas Flex tier or mandate Atlas M0 + automated offsite R2 snapshot scripts. | Implement and rehearse end-to-end backup and restore verification prior to cutover. |
| **Domain & DNS Registration** | Phase P13 / Gate G13 | Authorize purchase/configuration of custom production domain (e.g. `parttimecoder.com`). | Configure DNS records, CNAME, and SSL verification. |

---

## 6. Verification and Acceptance

- [x] Evaluated 10 operational dimensions for both `@ptc/web` and `@ptc/worker`.
- [x] Verified current provider pricing from official documentation.
- [x] Confirmed commercial licensing terms and disqualified non-commercial hobby tiers for production.
- [x] Guaranteed persistent background worker independence consistent with ADR-0005.
- [x] Maintained compliance with ADR-0006 ($0 development, free-tier-first staging, Owner-approved production).
- [x] Delivered structured decision matrix with 1 preferred option and 1 practical fallback.
- [x] Verified that zero paid services have been provisioned without Owner authorization.
