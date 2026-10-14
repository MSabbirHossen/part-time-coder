# Architecture Decision Record (ADR-0002)

```yaml
id: ADR-0002
title: pnpm Monorepo Structure and Package Boundaries
status: approved
owner_decision: approved
decision_date: "2026-10-14"
approver: "Owner"
reason: "Establish clear workspace package layout and strict import boundaries to prevent circular dependencies, ensure clean domain separation, and maintain high developer velocity."
source_sections:
  - "docs/TRD.md: Section 1.3 (Monorepo and Package Architecture)"
  - "docs/IMPLEMENTATION_PLAN.md: Section 2.1 (Proposed Deployable Layout) & 2.2 (Layer/Ownership Contract)"
  - "AGENTS.md: Section 5 (Repository and Architectural Boundaries)"
requirement_ids:
  - PTC-GOV-004
  - PTC-NFR-011
  - PTC-NFR-012
affected_routes_apis_models:
  - "pnpm-workspace.yaml"
  - "package.json"
  - "apps/*"
  - "packages/*"
options_and_tradeoffs:
  - "Option A (Selected): pnpm workspaces with strict internal package boundaries and TypeScript path aliases."
  - "Option B: Polyrepo (separate Git repositories for web, worker, and libraries)."
  - "Option C: Flat monorepo with single monolithic package.json and directory-only separation."
security_privacy_finance_impact: "Prevents accidental exposure of backend database connection strings, internal service models, or server-side authorization secrets to browser-facing client packages."
provider_cost_or_approval_impact: "No additional tooling costs; pnpm uses content-addressable storage saving local and CI disk space and build time."
migration_and_rollback: "Packages can be versioned or extracted independently if future deployment requirements diverge."
updated_acceptance_tests:
  - IMP-AT-002
  - IMP-AT-003
```

---

## 1. Context and Problem Statement

The Part-time Coder codebase contains both user-facing applications (Next.js web frontend and API routes) and background worker services (Node.js worker process), as well as shared domain policies, database schemas, authentication evaluators, third-party integrations, and reusable UI components.

Without formal package boundaries and enforcement mechanisms:
1. Server-side secrets or Mongoose database models could be imported accidentally into client-side React components.
2. Circular dependencies could form between services, databases, and UI components.
3. Code duplication would emerge across apps and tools.

A robust workspace management and package boundary contract is necessary.

---

## 2. Applicable PRD Requirement IDs

- **PTC-GOV-004:** Maintainable codebase structure with modularity and explicit engineering standards.
- **PTC-NFR-011:** Full TypeScript strictness across all workspaces; no untyped cross-boundary leaks.
- **PTC-NFR-012:** Extensibility allowing new features and integrations to be introduced cleanly.

---

## 3. Technical and Business Constraints

- Use `pnpm` as the package manager with workspace protocol (`workspace:*`).
- Strict layer rules must be maintained:
  - UI layer (`packages/ui`, `apps/web/src/components`) MUST NOT import `packages/database` or `packages/integrations` directly.
  - Domain layer (`packages/core`) MUST NOT import UI components or HTTP request/response primitives.
  - Background worker (`apps/worker`) and web app (`apps/web`) consume shared domain packages, not each other's internal files.
- Zero circular package dependencies.

---

## 4. Alternatives Considered

1. **Option A (Selected): pnpm Monorepo with Domain Packages**
   - Workspace directories: `apps/*` and `packages/*`.
   - Explicit package names (`@ptc/core`, `@ptc/database`, `@ptc/auth`, `@ptc/integrations`, `@ptc/ui`, `@ptc/config`).
   - Fast, reproducible installations using hard links via pnpm.

2. **Option B: Polyrepo Structure**
   - Multiple separate GitHub repositories for UI, Backend, Worker, and Shared Libraries.
   - Requires private NPM registry or Git submodules, slow coordinated releases, and complex cross-repo PR workflows.

3. **Option C: Flat Single-Package Monorepo**
   - Everything inside a single `package.json` with arbitrary subfolder imports (`src/backend`, `src/frontend`).
   - High risk of architectural erosion, accidental circular imports, and client bundle contamination.

---

## 5. Selected Architecture

We select **Option A: pnpm Monorepo with Strict Package Boundaries**.

### Monorepo Structure

```text
part-time-coder/
├── apps/
│   ├── web/                     # Next.js App Router (Public site, Dashboards, /api/v1)
│   └── worker/                  # Supervised Node.js process (durable jobs, outbox)
├── packages/
│   ├── core/                    # Domain logic, entity policies, state machines, audit events
│   ├── database/                # Mongoose models, repository access, indexes, migrations
│   ├── auth/                    # Firebase token verification, session cookies, RBAC evaluator
│   ├── integrations/            # Third-party adapters (Social platforms, Cloudinary, Email)
│   ├── ui/                      # Reusable accessible UI components (Tailwind, shadcn/ui)
│   └── config/                  # Shared ESLint, Prettier, TypeScript configurations
├── docs/                        # Architecture, specs, audit, ADRs, runbooks, release records
├── .github/workflows/           # CI/CD workflows
├── pnpm-workspace.yaml          # Workspace declaration
└── package.json                 # Monorepo root scripts and tooling
```

### Dependency Flow Matrix

```text
apps/web          --> @ptc/ui, @ptc/core, @ptc/auth, @ptc/config
apps/worker       --> @ptc/core, @ptc/database, @ptc/integrations, @ptc/config
@ptc/database     --> @ptc/core, @ptc/config
@ptc/auth         --> @ptc/core, @ptc/database, @ptc/config
@ptc/integrations --> @ptc/core, @ptc/config
@ptc/core         --> @ptc/config
@ptc/ui           --> @ptc/config
```

**Forbidden Import Rules:**
- `@ptc/core` CANNOT import `@ptc/database` (preserves Dependency Inversion; domain logic must never couple to persistence technology).
- `@ptc/ui` CANNOT import `@ptc/database`, `@ptc/core`, or `@ptc/auth`.
- `@ptc/core` CANNOT import `@ptc/ui` or Next.js route handlers.
- `apps/web` CANNOT import `apps/worker` and vice versa.

---

## 6. Justification and Trade-offs

### Advantages
- Single pull request covers schema changes, domain rules, API endpoints, and UI views atomically.
- Shared TypeScript types prevent drift between API producers and consumers.
- pnpm's content-addressable storage ensures deterministic installs and saves disk space.
- Tooling (ESLint, Prettier, TypeScript) is centralized in `@ptc/config`.

### Trade-offs
- Requires discipline in configuring `tsconfig.json` path references and package exports.
- Monorepo tooling setup overhead during Phase P00.

---

## 7. Security, Performance, and Operational Implications

- **Security:** Strict package boundaries guarantee server secrets (database URIs, Firebase service account keys, social client secrets) remain isolated in backend packages and never leak into `@ptc/ui` or client bundle graphs.
- **Performance:** pnpm caching and modular builds prevent unnecessary rebuilds of unchanged packages.
- **Operations:** Unified CI pipeline tests and builds all workspaces deterministically with `pnpm --filter`.

---

## 8. Cost Implications

- Zero licensing or software costs (pnpm is free, open source, and natively supported in major CI platforms).

---

## 9. Migration or Future Scalability Considerations

Incremental package extraction: If the team grows or an integration package requires independent deployment, individual packages can be published to a private registry or split into separate repos with minimal refactoring.

---

## 10. Rejected Alternatives and Reasons

- **Polyrepo (Option B) Rejected:** Massive friction for a lean engineering team; coordinated atomic changes across multiple repos introduce version mismatches and administrative burden.
- **Flat Monorepo (Option C) Rejected:** Lack of structural enforcement leads to spaghetti architecture, untracked dependencies, and accidental client bundle leaks.

---

## 11. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Accidental cross-package circular dependency | Enforce with ESLint import rules and TypeScript project references in CI. |
| Dependency version drift across packages | Use pnpm catalog or synchronized dependency versions at workspace root. |
| Monorepo configuration drift | Centralize all configs in `packages/config`. |

---

## 12. Verification Requirements

- `pnpm install --frozen-lockfile` runs cleanly without dependency warnings.
- `pnpm typecheck` verifies all packages without circular reference errors.
- Automated lint rule validates that `@ptc/ui` never imports `@ptc/database` or `@ptc/auth`.

---

## 13. Decision Owner and Review Status

- **Proposed by:** AI Development Agent (Antigravity)
- **Reviewer:** Part-time Coder Owner / Tech Lead
- **Status:** `approved` (Approved by Owner on 14 October 2026)
