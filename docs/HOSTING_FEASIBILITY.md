# Part-time Coder — Commercial Hosting Feasibility Assessment (IMP-00-07)

> **Document ID:** PTC-FEASIBILITY-001  
> **Version:** 1.1.0  
> **Task ID:** `IMP-00-07`  
> **Phase:** P00 (Discovery, Environment, CI and Feasibility)  
> **Gate:** G0  
> **Status:** Reconciled Preliminary Assessment — Awaiting Owner Decision at Gate Pre-Flight  
> **Last Verified & Updated:** 15 October 2026  
> **Governing Policy:** `AGENTS.md` Section 2, `docs/ADR/ADR-0006-commercial-hosting-environment-strategy.md`, `docs/TRD.md` Section 7  
> **Applicable Requirement IDs:** `PTC-OPS-001`, `PTC-NFR-015`

---

## 1. Executive Summary & Cost Policy Baseline

In accordance with **ADR-0006** ("Commercial Hosting, Deployment Separation, and Environment Strategy"), this assessment provides an evidence-backed evaluation of commercial hosting options for the independent deployment of:
1. **`apps/web`**: Next.js 16 (App Router, React 19, Turbopack, REST API at `/api/v1`)
2. **`apps/worker`**: Dedicated Node.js background process (durable job leases, outbox dispatch, social queue processing)

### Cost Policy Constraints & Epistemic Boundaries
- **`[FREE-TIER ASSUMPTION]`**: Development and staging tiers maximize lawful free services (local emulators, MongoDB Atlas M0, Firebase Spark, Cloudflare R2, Cloudinary Free tier). Target staging objective is $0/month.
- **`[VERIFIED PROVIDER FACT]`**: Commercial production hosting must adhere strictly to provider Terms of Service. Non-commercial personal "hobby" tiers (e.g., Vercel Hobby) are strictly disqualified for production client services.
- **`[ESTIMATED PROJECTION]`**: Platform traffic, transaction frequency, and media transform volumes are projected estimates based on PRD Section 14 assumptions, not historical measurements.
- **`[UNMEASURED RELIABILITY TARGET]`**: RPO (≤ 24h) and RTO (≤ 4h) are architectural objectives to be verified during Phase P11 disaster recovery rehearsals and P12 staging chaos testing.
- **Owner Pre-Approval Gate**: No paid hosting plan, database tier, or external provider subscription is contracted during Phase P00. All financial commitments require **explicit Owner approval** prior to provisioning.

---

## 2. Technical Evaluation Across 10 Operational Dimensions

### 2.1 Dimension 1 — Node.js-Compatible Commercial Web Hosting (`apps/web`)
`apps/web` requires Node.js 22 LTS, standalone containerized execution, dynamic Route Handler execution for `/api/v1`, and static asset serving.

| Provider / Tier | Compute Specs | Monthly Cost `[VERIFIED PROVIDER FACT]` | Commercial Terms & Source Verification |
|---|---|---|---|
| **Render Web Service (Starter)** | 0.5 vCPU, 512 MB RAM | **$7.00 / mo** | Commercial use permitted. Dedicated container, zero idle sleep, automated TLS. Source: [Render Pricing](https://render.com/pricing) (Verified 15 Oct 2026). |
| **Render Web Service (Standard)** | 1.0 vCPU, 2 GB RAM | **$25.00 / mo** | Commercial use permitted. Scales vertically for higher concurrency. Source: [Render Pricing](https://render.com/pricing) (Verified 15 Oct 2026). |
| **DigitalOcean App Platform (Basic)** | 1 vCPU, 512 MB RAM | **$5.00 / mo** | Commercial use permitted. Global CDN, 100 GB egress included. Source: [DO Pricing](https://www.digitalocean.com/pricing/app-platform) (Verified 15 Oct 2026). |
| **Hetzner Cloud VPS (CX22)** | 2 vCPU, 4 GB RAM, 40 GB NVMe | **€3.79 (~$4.15) / mo** (excl. VAT)<br>€4.51 / mo (incl. 19% VAT) | Commercial use permitted. Root access; 20 TB monthly traffic included. Optional primary IPv4: +€0.60/mo (~$0.65). Locations: DE, FI, US (Ashburn/Hillsboro). Source: [Hetzner Cloud](https://www.hetzner.com/cloud) (Verified 15 Oct 2026). |
| **Railway (Metered Compute)** | Metered: $10/GB RAM + $20/vCPU | **~$5.00–$12.00 / mo** `[ESTIMATED PROJECTION]` | Commercial use permitted. Billed per second; Pro workspace ($20/mo) includes $20 credit. Source: [Railway Pricing](https://railway.com/pricing) (Verified 15 Oct 2026). |
| **Vercel (Pro)** | Serverless compute | **$20.00 / user / mo** | Commercial permitted on Pro. **Disqualified for worker** (execution timeouts break long queue leases). Source: [Vercel Pricing](https://vercel.com/pricing) (Verified 15 Oct 2026). |

### 2.2 Dimension 2 — Persistent Background Workers (`apps/worker`)
`apps/worker` requires a 24/7 continuous Node.js runtime with a persistent event loop to poll MongoDB for scheduled jobs, acquire atomic distributed leases, update heartbeats every 30s, and execute long-running media encoding and publishing jobs without HTTP gateway timeouts (ADR-0005).

| Provider / Option | Worker Capability | Monthly Cost `[VERIFIED PROVIDER FACT]` | Technical Evaluation & Fit |
|---|---|---|---|
| **Render Background Worker** | Dedicated persistent daemon (no exposed HTTP port) | **$7.00 / mo** (Starter, 512 MB) | **Optimal PaaS Fit.** True background daemon, automatic supervisor restart, independent deployment and log stream. Does not sleep. |
| **DigitalOcean Worker Component** | Dedicated background container | **$5.00 / mo** (512 MB) | **Strong Alternative.** Co-locates with web service inside single App Platform project with internal private networking. |
| **Hetzner Cloud VPS Container** | Docker Compose container on shared VPS | **$0 extra** (included in VPS) | **Maximum Cost Efficiency.** Runs alongside web in isolated container on single 4 GB server. |
| **Railway Container Service** | Always-on container process | **~$5.00–$7.50 / mo** (512 MB) `[ESTIMATED]` | **Viable.** Runs 24/7; memory billed every second (~$5/mo base memory footprint for 512 MB). |
| **Serverless Ephemeral Crons** | Vercel Cron / AWS Lambda | Variable | **REJECTED.** Violates ADR-0005. Cannot maintain distributed leases, heartbeats, or resilient retries. |

### 2.3 Dimension 3 — MongoDB Atlas Database Requirements
The platform requires a MongoDB replica set with WiredTiger storage engine supporting multi-document ACID transactions, compound unique indexes, and tenant isolation (ADR-0003, ADR-0006).

| Atlas Tier | Compute & Storage `[VERIFIED PROVIDER FACT]` | Backups & Point-in-Time Recovery | Monthly Cost | Recommendation / Verdict |
|---|---|---|---|---|
| **M0 Free Tier** | 512 MB storage, shared RAM/vCPU | **NO automated backups. NO PITR.** | **$0 / mo** `[FREE-TIER ASSUMPTION]` | **Staging only.** Unacceptable for commercial production without automated external backup scripts. Source: [Atlas M0](https://www.mongodb.com/pricing). |
| **Atlas Flex Tier** | 5 GB storage, burstable compute | Daily snapshots retained up to 7 days. **NO continuous PITR.** | Usage-based: $0.16/M reads, $1.25/M writes, $0.25/GB storage. **Capped at $30.00 / mo** (Typically ~$8–$15/mo `[ESTIMATED]`). | **Recommended for Initial Production.** Replaced legacy M2/M5 tiers; affordable, burstable, predictable spend ceiling. Source: [Atlas Flex](https://www.mongodb.com/pricing). |
| **Atlas Dedicated M10** | 2 GB RAM, 10 GB SSD, 3-node replica set | Continuous Cloud Backup with Point-in-Time Recovery (PITR) up to 35 days. | Starts at **~$58.00 / mo** (~$0.08/hr) + snapshot storage charges. | **Growth Tier.** Full production resilience, dedicated hardware, high IOPs, commercial SLA. Target for Phase P14. Source: [Atlas Dedicated](https://www.mongodb.com/pricing). |

### 2.4 Dimension 4 — Media Storage and Offsite Backups
Media assets (social images/videos, CMS uploads, invoice PDFs) and database backup snapshots must be securely stored with geographic redundancy.

- **Primary Media Vault (Cloudinary):**
  - **`[VERIFIED PROVIDER FACT]`**: The Cloudinary Free tier provides **25 monthly credits shared across all dimensions**.
  - **Credit Conversion Formula**: 1 Credit = 1,000 transformations OR 1 GB of managed storage OR 1 GB of net viewing bandwidth.
  - **Shared Quota Clarification**: This is **not** 25 GB storage + 25 GB bandwidth + 25k transformations simultaneously. For example, storing 10 GB of assets leaves 15 credits shared between transformations and outbound delivery.
  - **Commercial Compliance**: Permitted on Free and Plus tiers.
  - **Upgrade Path**: Plus plan ($89/month) only when monthly active asset transform volume exceeds free credits. Source: [Cloudinary Pricing](https://cloudinary.com/pricing) (Verified 15 Oct 2026).
- **Offsite Database Backup Vault (Cloudflare R2):**
  - **`[VERIFIED PROVIDER FACT]`**: Cloudflare R2 includes **10 GB storage/month free**, 1,000,000 Class A operations (writes, lists) free/month, and 10,000,000 Class B operations (reads) free/month.
  - **Egress Fees**: **$0.00 forever** (zero data transfer charges across public internet).
  - **Overages**: $0.015/GB-month storage, $4.50/million Class A, $0.36/million Class B.
  - **Projected Cost**: **$0.00 / month** for MVP daily encrypted `mongodump` archives. Source: [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) (Verified 15 Oct 2026).

### 2.5 Dimension 5 — Deployment from GitHub
- **Render / DigitalOcean App Platform / Railway:** Native GitHub repository integration. Automatically compiles and deploys on push to `main` (production) or `feat/**` (staging previews).
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
  - *Sentry (Developer Free):* 5,000 errors/month, performance tracing. Source: [Sentry Pricing](https://sentry.io/pricing/) (Verified 15 Oct 2026).
  - *BetterStack / UptimeRobot (Free):* 50 uptime monitors, 3-minute checks with email/webhook alerting. Source: [BetterStack](https://betterstack.com/pricing) (Verified 15 Oct 2026).
- **Provider Log Streams:** Render / DO / Railway provide 7 to 30 days of searchable runtime and build logs with zero additional setup.

### 2.8 Dimension 8 — Safe Rollback and Recovery
- **PaaS One-Click Rollback:** Render and DigitalOcean preserve prior build image SHAs. A bad deployment can be rolled back to the previous stable release artifact within seconds without triggering a re-build.
- **Database Schema Protection:** All schema updates adhere to the expand/backfill/verify/contract pattern (`docs/BACKEND_SCHEMA.md`). Additive schema changes ensure a rolled-back application code version remains fully operational against the active database.
- **`[UNMEASURED RELIABILITY TARGET]`**: RPO (Recovery Point Objective) ≤ 24 hours; RTO (Recovery Time Objective) ≤ 4 hours (to be tested during P11 disaster recovery drills).

### 2.9 Dimension 9 — Scaling and Resource Limits
- **`[ESTIMATED PROJECTION]` MVP Capacity Target:** 10 concurrent internal staff, 25 client organizations, 1,000 monthly social posts, 50,000 monthly public visitors (PRD Section 14).
- **Vertical Scaling:** PaaS platforms allow 1-click resource resizing (e.g., from 512 MB to 2 GB RAM) with zero code modifications.
- **Horizontal Web Scaling:** Available on Render Pro ($25/mo workspace) and DO App Platform.
- **Worker Concurrency Bounds:** Worker job concurrency is governed in code by lease batch limits (`MAX_CONCURRENT_JOBS = 5`), preventing CPU starvation or memory thrashing under burst loads.

### 2.10 Dimension 10 — Monthly Costs and Potential Hidden Charges
A critical risk in cloud hosting is unexpected overages. Below is an audit of verified cost vectors:

1. **Bandwidth Egress:**
   - Render: Hobby includes 5 GB; Pro includes 25 GB. Overage is **$0.15/GB**.
   - DigitalOcean: 100 GB included on Basic; overage is **$0.02/GB**.
   - Hetzner: **20 TB free** monthly traffic included.
   - Cloudflare R2: **$0.00** egress fees.
2. **Build Minute Overages:**
   - Render includes 500 min (Hobby) or 1,000 min (Pro); overage is **$5 per 1,000 extra minutes**.
3. **Database Backup Storage:**
   - Atlas M10 continuous backup charges ~$0.10/GB-month for snapshot and oplog storage.
4. **Firebase Auth SMS MFA:**
   - 10 free SMS/day on Spark. On Blaze, phone verification costs ~$0.01–$0.06 per SMS. TOTP/Email MFA incurs zero per-event carrier charges.
5. **Third-Party Social APIs:**
   - X (Twitter) Developer API charges $100/month for Basic tier (read/write). If unpaid, X publishing remains disabled or manual-only as permitted by PRD.

---

## 3. Decision Matrix Comparing Deployment Architectures

| Evaluation Criterion | Option 1: Render PaaS (Preferred) | Option 2: DigitalOcean App Platform | Option 3: Hetzner Cloud VPS (Fallback) | Option 4: Railway Metered PaaS | Option 5: AWS Enterprise Stack |
|---|---|---|---|---|---|
| **Web Hosting Cost** | $7.00 / mo (Starter) | $5.00 / mo (Basic) | Included in VPS | ~$5.00–$10.00 / mo | ~$25.00 / mo (App Runner) |
| **Worker Hosting Cost** | $7.00 / mo (Starter Daemon) | $5.00 / mo (Worker) | Included in VPS | ~$5.00–$7.50 / mo | ~$20.00 / mo (ECS Fargate) |
| **Database Cost (Atlas)** | ~$8.00–$30.00 / mo (Flex) | ~$8.00–$30.00 / mo (Flex) | $0 (M0 + R2) or Flex | ~$8.00–$30.00 / mo (Flex) | ~$58.00 / mo (M10 Dedicated) |
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

## 6. Official Source References (Verified October 2026)

- **Render Pricing & Terms**: [https://render.com/pricing](https://render.com/pricing)
- **Hetzner Cloud Server Pricing**: [https://www.hetzner.com/cloud](https://www.hetzner.com/cloud)
- **DigitalOcean App Platform Pricing**: [https://www.digitalocean.com/pricing/app-platform](https://www.digitalocean.com/pricing/app-platform)
- **MongoDB Atlas Cluster Pricing**: [https://www.mongodb.com/pricing](https://www.mongodb.com/pricing)
- **Cloudinary Pricing & Credit Allocation**: [https://cloudinary.com/pricing](https://cloudinary.com/pricing)
- **Cloudflare R2 Storage Pricing**: [https://www.cloudflare.com/developer-platform/products/r2/](https://www.cloudflare.com/developer-platform/products/r2/)
- **Sentry Pricing**: [https://sentry.io/pricing/](https://sentry.io/pricing/)
