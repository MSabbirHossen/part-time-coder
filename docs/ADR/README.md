# Part-time Coder — Architecture Decision Records (ADR) Registry

> **Document ID:** PTC-ADR-REGISTRY-001  
> **Status:** Active registry  
> **Updated:** 14 October 2026  
> **Governing Policy:** `AGENTS.md` Section 1.5 & `docs/IMPLEMENTATION_PLAN.md` Ticket IMP-00-02

---

## Architecture Decision Records Index

| ADR ID | Title | Status | Owner Decision | Applicable PRD Requirements | Target Phase / Gate |
|---|---|---|---|---|---|
| [ADR-0001](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0001-modular-monolith-nextjs.md) | Modular Monolith and Next.js Application Architecture | `approved` | `approved` (2026-10-14) | PTC-GOV-001, PTC-NFR-001, PTC-NFR-002, PTC-NFR-011, PTC-NFR-012 | P00 / G0 |
| [ADR-0002](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0002-pnpm-monorepo-package-boundaries.md) | pnpm Monorepo Structure and Package Boundaries | `approved` | `approved` (2026-10-14) | PTC-GOV-004, PTC-NFR-011, PTC-NFR-012 | P00 / G0 |
| [ADR-0003](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0003-single-company-client-isolation.md) | Single-Company Architecture and Client Organization Isolation | `approved` | `approved` (2026-10-14) | PTC-GOV-002, PTC-ORG-001–006, PTC-SEC-001, PTC-SEC-002 | P00 / G0 |
| [ADR-0004](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0004-firebase-auth-scoped-rbac.md) | Firebase Authentication and Database-Backed Scoped RBAC | `approved` | `approved` (2026-10-14) | PTC-IAM-001–010, PTC-SEC-001, PTC-SEC-003, PTC-SEC-004 | P00 / G0 |
| [ADR-0005](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0005-dedicated-worker-durable-jobs.md) | Dedicated Background Worker and Durable Job Processing | `approved` | `approved` (2026-10-14) | PTC-SOC-004, PTC-SOC-005, PTC-OPS-004, PTC-NFR-007 | P00 / G0 |
| [ADR-0006](file:///f:/Code%20Practice/AI-Projects/part-time-coder/docs/ADR/ADR-0006-commercial-hosting-environment-strategy.md) | Commercial Hosting, Deployment Separation, and Environment Strategy | `approved` | `approved` (2026-10-14) | PTC-OPS-001, PTC-OPS-002, PTC-OPS-003, PTC-NFR-015 | P00 / G0 |

---

## Governance Note

All foundational Architecture Decision Records (ADR-0001 through ADR-0006) were formally reviewed and approved by the Part-time Coder Owner on 14 October 2026 with explicit clarifications on Spark/Blaze quotas, staging cost objectives, and MongoDB Atlas Free backup requirements. Subsequent architectural modifications require a new proposed ADR.
