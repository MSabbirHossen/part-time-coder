# Architecture Decision Record (ADR-0007)

```yaml
id: ADR-0007
title: Next.js 16 Framework Security and Support Migration
status: proposed
owner_decision: pending
decision_date: null
approver: null
reason: "Next.js 14 is out of official security support. Migrate the web application framework to Next.js 16 LTS (16.4.1) to maintain ongoing security patches, framework stability, and upstream dependency compatibility."
source_sections:
  - "docs/TRD.md: Section 2.1 (Web Application Architecture)"
  - "AGENTS.md: Section 1.5 (Controlled change process) & Section 4.3 (Scope budget and iteration)"
  - "docs/ADR/ADR-0001-modular-monolith-nextjs.md"
requirement_ids:
  - PTC-GOV-001
  - PTC-NFR-001
  - PTC-NFR-011
  - PTC-NFR-012
  - PTC-SEC-001
affected_routes_apis_models:
  - "apps/web/package.json"
  - "apps/web/src/app/**"
  - "apps/web/src/app/api/v1/**"
options_and_tradeoffs:
  - "Option A (Proposed): Upgrade to Next.js 16.4.1 while retaining React 18.3.1 (or upgrading to React 19 in lockstep), keeping App Router architecture unchanged."
  - "Option B: Upgrade to Next.js 15 LTS backport (15.5.28) as intermediate step."
  - "Option C (Rejected): Retain unsupported Next.js 14.2.15 (leaves application vulnerable to unpatched framework CVEs)."
security_privacy_finance_impact: "Restores vendor security patch eligibility. Mitigates known App Router server actions and cache poisoning vulnerabilities discovered in older Next.js releases. $0 license impact (MIT)."
provider_cost_or_approval_impact: "None. Runs on standard Node.js runtime and existing monorepo build pipelines."
migration_and_rollback: "Update apps/web/package.json and run pnpm install. If regressions occur, revert commit to restore Next.js 14 and existing pnpm-lock.yaml."
updated_acceptance_tests:
  - IMP-AT-001
  - IMP-AT-003
```

---

## 1. Context and Problem Statement

During the technical review in Phase P00, it was identified that Next.js 14 has reached End-of-Life (EOL) upstream and is no longer receiving official security patches or vulnerability fixes from Vercel. Continued reliance on Next.js 14 introduces security risks (unpatched framework CVEs) and technical debt for new features.

`AGENTS.md` §4.3 mandates:
> "Do not upgrade major dependencies or redesign package boundaries without an ADR, justification, rollback impact and relevant test coverage."

`AGENTS.md` §1.5 mandates:
> "Agent may draft the ADR. Only the authorized human may approve scope, risk, spending, irreversible changes or an external commitment. Do not implement an ADR as approved while its status is proposed."

This ADR is submitted to the Owner for approval prior to upgrading the web application dependencies.

---

## 2. Alternatives Evaluated

1. **Option A (Recommended): Migrate to Next.js 16.4.1**
   - Active, supported release receiving security updates.
   - Fully compatible with React 18.3.1 peer dependencies (`^18.2.0 || ^19.0.0`).
   - Retains existing App Router architecture, TypeScript strict mode, and `/api/v1` route handlers.
   - Compatible with pnpm monorepo layout and standalone worker architecture.

2. **Option B: Migrate to Next.js 15.5.28 (Backport Maintenance)**
   - Shorter maintenance window; still requires future migration to 16.x.

3. **Option C: Remain on Next.js 14.2.15**
   - **Rejected**: Fails security compliance requirements. Security audits in CI will flag unsupported framework dependencies and unpatched CVEs.

---

## 3. Migration and Compatibility Verification Plan

1. Update `apps/web/package.json` to `"next": "^16.4.1"`.
2. Run `pnpm install` with lockfile reconciliation.
3. Verify App Router conventions:
   - In Next.js 15+, dynamic route parameters and headers/cookies APIs return Promises if used. Our existing `/api/v1/health` endpoint is static and does not use dynamic route params, guaranteeing zero breaking changes.
4. Execute full quality gates:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test:unit`
   - `pnpm --filter @ptc/web build`
   - Health check probe: `GET /api/v1/health` -> HTTP 200 `{"status": "ok", "app": "part-time-coder"}`.
5. Rollback strategy: Revert Git commit if any peer dependency conflict or runtime regression is detected.

---

## 4. Current Status and Owner Action Required

- **Status:** `proposed` (Pending Owner Decision)
- **Action Required:** Owner review and approval of ADR-0007. Per change-control rules, dependency migration is halted pending authorization; independent CI implementation (`IMP-00-05`) proceeds without blocker.
