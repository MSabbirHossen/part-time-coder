# Architecture Decision Record (ADR-0001)

```yaml
id: ADR-0001
title: Modular Monolith and Next.js Application Architecture
status: approved
owner_decision: approved
decision_date: "2026-10-14"
approver: "Owner"
reason: "Establish the foundational application architecture for the Part-time Coder unified platform balancing operational simplicity, developer productivity, and strict domain boundaries."
source_sections:
  - "docs/PRD.md: Section 3 (System Architecture & Principles)"
  - "docs/TRD.md: Section 1 (Architecture Overview) & Section 2 (Application Layer)"
  - "docs/IMPLEMENTATION_PLAN.md: Section 2 (Engineering Foundation)"
requirement_ids:
  - PTC-GOV-001
  - PTC-NFR-001
  - PTC-NFR-002
  - PTC-NFR-011
  - PTC-NFR-012
affected_routes_apis_models:
  - "apps/web/src/app/**"
  - "apps/web/src/app/api/v1/**"
  - "packages/core/**"
options_and_tradeoffs:
  - "Option A (Selected): Modular Monolith on Next.js App Router with domain-driven packages and explicit REST /api/v1 endpoints."
  - "Option B: Distributed Microservices architecture."
  - "Option C: Classic Single-Page Application (SPA) with separate Express/Fastify REST backend."
security_privacy_finance_impact: "Enforces single security boundary where authentication and authorization occur at the Next.js API/Route Handler and core domain layers. Eliminates network hops and internal service authentication complexities."
provider_cost_or_approval_impact: "Lowest operational overhead; runs on unified Node.js hosting without container orchestration clusters or multi-service routing fees."
migration_and_rollback: "Clean package separation allows individual domain extraction into independent services in the future if scale requires it."
updated_acceptance_tests:
  - IMP-AT-001
  - IMP-AT-002
```

---

## 1. Context and Problem Statement

Part-time Coder requires a unified company platform serving three core pillars:
1. Public website, product catalog, and CMS.
2. Internal agency project delivery, task management, and scoped client portal.
3. Multi-platform social media campaign management, approval workflow, and publishing.

The system is developed and operated by a lean engineering team (part-time contributors and founder). The architecture must minimize DevOps overhead, avoid premature distributed systems complexity, guarantee fast client-side performance and accessibility (WCAG 2.2 AA), and strictly enforce domain boundaries so business logic does not leak into UI rendering components.

---

## 2. Applicable PRD Requirement IDs

- **PTC-GOV-001:** Single, unified internal platform with clear domain boundaries rather than fractured SaaS services.
- **PTC-NFR-001:** Sub-second server response times on standard operations; Core Web Vitals compliance.
- **PTC-NFR-002:** Mobile and desktop responsiveness across viewport sizes.
- **PTC-NFR-011:** Strict TypeScript types across all layers; zero unchecked `any`.
- **PTC-NFR-012:** Modular, extensible architecture allowing future features without rewrites.

---

## 3. Technical and Business Constraints

- Monorepo managed with `pnpm`.
- Next.js App Router with React Server Components (RSC) and Client Components.
- API layer must expose versioned REST routes under `/api/v1`.
- TypeScript strict mode enabled across all apps and packages.
- Zero server-side rendering execution of client secrets or unchecked user input.
- Must cleanly interface with a separately deployed background worker (`apps/worker`).

---

## 4. Alternatives Considered

1. **Option A (Selected): Modular Monolith with Next.js App Router & Internal Packages**
   - Single Next.js application handling public marketing, authenticated workspaces, and `/api/v1` endpoints.
   - Core domain logic encapsulated in `packages/core` and `packages/database`.
   - Dedicated separate background worker for asynchronous queues (`apps/worker`).

2. **Option B: Distributed Microservices Architecture**
   - Independent services for Auth, CMS, Projects, Social Publishing, and Invoicing.
   - Separate API Gateway, service mesh, and independent database per service.

3. **Option C: Separate React SPA + Standalone Express/NestJS Backend**
   - Traditional client-side SPA (Vite + React) talking across CORS to a standalone Node.js REST API server.

---

## 5. Selected Architecture

We select **Option A: Modular Monolith with Next.js App Router and Internal Packages**.

- **Web Application (`apps/web`):**
  - Next.js App Router with route groups:
    - `(public)`: Marketing, service catalog, product portfolio, case studies, blog, public quote form.
    - `(auth)`: Login, password reset, invitation acceptance, onboarding.
    - `(dashboard)`: Authenticated staff and client workspaces with role-based layout shells.
    - `api/v1`: Stable, versioned REST endpoints backed by Zod validation schemas.
- **Decoupled Business Logic:** UI components do not query the database directly. All mutations and sensitive queries route through domain services in `packages/core`.
- **Worker Separation:** High-latency, durable, or scheduled workflows run outside the web process in `apps/worker`.

---

## 6. Justification and Trade-offs

### Advantages
- **Shared Type Safety:** End-to-end TypeScript validation from database schema (Mongoose/Zod) through domain DTOs to UI forms.
- **Operational Simplicity:** Single web application deployment; no multi-service networking, service discovery, or distributed transaction complexities.
- **Optimal Web Vitals:** Next.js Server Components and streaming SSR provide excellent performance and SEO for public pages, while rich React components power workspace dashboards.
- **Modular Boundaries:** Clean internal packages (`packages/core`, `packages/database`, `packages/auth`) prevent tight coupling and allow modular testing.

### Trade-offs
- **Shared Runtime:** A crash in a web route handler could affect web availability (mitigated by isolated try-catch, process management, and health checks).
- **Build Times:** Monolithic bundle compiles both public and private routes (mitigated by pnpm caching, Next.js incremental compilation, and modular package boundaries).

---

## 7. Security, Performance, and Operational Implications

- **Security:** CSRF protection, secure `HttpOnly` cookies, strict CORS, and Zod input sanitization at the `/api/v1` boundary.
- **Performance:** Dynamic server rendering where personalized data is needed; static generation with revalidation (ISR) for public CMS content; zero client bundle bloat for server-only dependencies.
- **Operations:** Single web deploy pipeline to Node-compatible hosting (Vercel, Render, Railway, or VPS).

---

## 8. Cost Implications

- Eliminates multi-cluster infrastructure costs.
- Operates comfortably within standard entry-level commercial hosting tiers ($10–$25/month) during MVP.

---

## 9. Migration or Future Scalability Considerations

Because domain logic is strictly isolated in `packages/core` and accessed via well-defined DTOs and interfaces, any individual domain (e.g., Social Publishing or Analytics) can be carved out into an independent service in the future with zero changes to business logic contracts.

---

## 10. Rejected Alternatives and Reasons

- **Microservices (Option B) Rejected:** Massive operational overhead, distributed transaction failures, network latency, and high financial cost inappropriate for a lean, single-company platform.
- **SPA + Express (Option C) Rejected:** Loses server-side rendering benefits for public SEO/performance; introduces CORS friction and duplicate DTO type definitions.

---

## 11. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Domain leakage between packages | Enforce strict ESLint boundary rules and TypeScript project references. |
| Memory leaks or event loop blocking | Keep long-running and heavy CPU operations in `apps/worker`, never in web request handlers. |
| Route handler bloat | Require route handlers to act purely as controllers: authenticate, validate with Zod, delegate to `packages/core`, return DTO. |

---

## 12. Verification Requirements

- TypeScript compilation in strict mode across the workspace.
- Next.js production build succeeds with clean lint checks.
- API route handlers reject unvalidated input with consistent 400 Bad Request error schemas.
- Unit and integration tests verify domain logic independent of Next.js HTTP context.

---

## 13. Decision Owner and Review Status

- **Proposed by:** AI Development Agent (Antigravity)
- **Reviewer:** Part-time Coder Owner / Tech Lead
- **Status:** `approved` (Approved by Owner on 14 October 2026)
