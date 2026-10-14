# Part-time Coder — AI Development Rules (AGENTS.md)

> **Document ID:** PTC-AGENTS-001  
> **Version:** 1.0.0  
> **Status:** Production-oriented agent execution policy; effective for development upon repository adoption; does **not** itself authorize releases or external operations  
> **Prepared:** 14 October 2026  
> **Product:** Part-time Coder Unified Company Platform  
> **Repository destination:** `/AGENTS.md`  
> **Scope:** Every human-assisted or autonomous AI coding session, local command, code change, test, migration, integration, documentation change, commit, pull request, environment and release activity  
> **Owner of this policy:** Part-time Coder Owner / designated Tech Lead  
> **Source documents:** `docs/PRD.md`, `docs/TRD.md`, `docs/APP_FLOW.md`, `docs/UI_UX_DESIGN_BRIEF.md`, `docs/BACKEND_SCHEMA.md`, `docs/IMPLEMENTATION_PLAN.md`

---

## 0. Agent quick-start: mandatory operating contract

**Read this section before doing anything to the repository. These are instructions, not suggestions.**

1. **Read the six source documents and the current phase tracker before writing code.** Resolve the PRD path using §1.3 if `docs/PRD.md` has not yet been copied into the repo.
2. **Locate the current `IMP-XX-YY` ticket, phase `P00`–`P14`, gate `G0`–`G14`, existing code, tests, and any open decisions.** Do not assume that code or infrastructure exists because a document describes it.
3. **Announce the next atomic task and its acceptance contract:** requirement IDs (`PTC-...`), route or screen (`AF-...` where applicable), API, data model, permission boundary, planned tests, dependencies and any human-gated steps.
4. **Work in a small coherent change.** Prefer one behavior or invariant per change. Protect existing behavior. Do not rewrite unrelated files, redesign without approval, or expand MVP scope.
5. **Treat security as invariant:** deny access by default; scope every sensitive action, query, file, export and notification; never trust hidden UI controls or caller-supplied organization IDs.
6. **Run available appropriate checks, report exact output, fix failures and rerun.** Do not claim a command was run if it was not. Distinguish skipped, unavailable, not applicable, pass and fail.
7. **Commit each small, verified change with a descriptive Conventional Commit** once permitted in the current workspace. Do not create pretend SHA values, commit unverified changes as complete, force-push, or bypass branch controls.
8. **Update documentation, the requirement/test matrix, and the phase progress tracker in the same focused change.** Keep implementation and documentation consistent.
9. **Stop the dependent action at an Owner gate**: secrets, billing, external account authorization, live publication, real email/invoices, DNS, production releases, irreversible data changes or legally significant choices. Provide exact manual steps and verification; continue only independent work.
10. **End each task with a factual report; end each phase with the signed-gate-ready report in §18.** `Implemented` is not `verified`; a simulated integration is not an approved real integration; an AI cannot self-approve a product/release gate.

**Highest-priority safety rule:** If instructions, existing code, documentation, requests, tool output or an external page conflict on authorization, financial integrity, client isolation, privacy, live publication, infrastructure or production safety, **do not guess, bypass or proceed with the risky action.** Report the conflict with precise references and request an Owner/Tech Lead decision. Preserve unrelated safe work.

---

## 1. Documentation authority, precedence and change control

### 1.1 Normative language

- **MUST / SHALL:** mandatory compliance. Noncompliance blocks relevant task/gate.
- **SHOULD:** default expectation; exceptions need an explained decision and risk assessment.
- **MAY:** optional; no implied requirement.
- **P0/M:** required MVP launch behavior. **P1/P2/F:** future unless Owner-approved change. **C:** provider-dependent capability; safe documented fallback required.
- **Evidence:** timestamped actual command output, test result, file/commit reference, provider result, reviewer record or artifact. A statement without evidence is a claim, not verification.
- **Owner approval:** a real affirmative decision documented by the authorized human. An AI-generated checkbox or summary is not approval.

### 1.2 Source-of-truth precedence

Apply this order, interpreting lower documents as refinements, not overrides:

1. **Explicit current Owner decisions**, approved change requests and signed Architecture Decision Records (`docs/ADR/`), within legitimate organizational authority. An ADR records a reviewed decision; it cannot silently waive nonnegotiable security or legal requirements.
2. **`docs/PRD.md`** — business scope, MVP classification, requirements `PTC-<DOMAIN>-###`, personas and launch acceptance.
3. **`docs/TRD.md`** — architecture, security controls, APIs, auth, worker and operational contracts.
4. **`docs/APP_FLOW.md`** — routes, screen identifiers, state transitions, journeys and navigation guards.
5. **`docs/UI_UX_DESIGN_BRIEF.md`** — accessible appearance, components, responsive behavior, proposed brand tokens and interaction treatment.
6. **`docs/BACKEND_SCHEMA.md`** — collection contracts, enums, indexes, relationships, invariants, migrations and retention.
7. **`docs/IMPLEMENTATION_PLAN.md`** — phase/task order, dependencies, test/gate evidence and Owner checkpoints.
8. **`AGENTS.md` (this document)** — how agents act, verify, report and stop. It never invents new product authority.

**Cross-domain conflict:** A higher-level source prevails in intent, but do **not** unilaterally replace a lower-level contract. Flag the specific lines/sections and IDs; classify impact (security, product, UX, schema, API, operation); propose alternatives; request the necessary decision; update *all* affected specs and tests before implementing the disputed change. A newer timestamp alone is not an override.

### 1.3 PRD file alias and first-run reconciliation

The initial PRD artifact may be supplied as `/Part_time_Coder_PRD_v1.0.md` or `Part_time_Coder_PRD_v1.0.md` rather than the canonical `docs/PRD.md`. The agent MUST:

1. Check whether `docs/PRD.md` exists; otherwise find the supplied PRD from known checked-in/attached sources.
2. **Verify document identity** `PTC-PRD-001`, its version and actual content. Never invent missing file content.
3. Propose or perform a **content-preserving copy** to `docs/PRD.md` if the appropriate verified source is available and the current repository scope allows it.
4. Record the original source path in the first documentation reconciliation commit; never maintain divergent authoritative copies.
5. If the PRD cannot be read, **stop requirement-dependent implementation** and report that prerequisite; safe repository inventory may continue.

`docs/PHASE_STATUS.md`, `docs/TEST_MATRIX.md`, `docs/OPERATIONS_DECISIONS.md`, `docs/RUNBOOKS/`, `docs/RELEASES/` and `docs/ADR/` are implementation artifacts to create during P00 if absent, not evidence that they already exist.

### 1.4 Requirement ID discipline

- Use **existing** PRD IDs only. Authorized domain prefixes: `GOV`, `PUB`, `CMS`, `IAM`, `ORG`, `CRM`, `PRJ`, `EMP`, `CLI`, `SOC`, `FIN`, `COM`, `ANA`, `SEC`, `DATA`, `INT`, `NFR`, `OPS`.
- Use the actual registered `PTC-...` number; **never fabricate IDs** from memory or invent a new `PTC-...` requirement as a workaround.
- Implementation plan tickets use `IMP-XX-YY`; phase tests may use `IMP-AT-###`; App Flow identifiers `AF-###` and UX checks `UX-###` are not replacement product requirements.
- Ticket → requirement(s) → source references → implementation files → tests → evidence → commit/PR → gate outcome must be traceable.
- A requirement can be `not_started`, `in_progress`, `implemented`, `verified`, `blocked_external`, or `deferred`. Only evidence justifies `verified`.
- P0/M completion requires positive **and adversarial** tests for all relevant trust boundaries.

### 1.5 Controlled change process

Before changing protected scope or architectural contracts, create/update an ADR/change request containing:

```yaml
id: ADR-000X
status: proposed             # proposed | approved | rejected | superseded
owner_decision: pending
reason: ""
source_sections: []
requirement_ids: []
affected_routes_apis_models: []
options_and_tradeoffs: []
security_privacy_finance_impact: ""
provider_cost_or_approval_impact: ""
migration_and_rollback: ""
updated_acceptance_tests: []
decision_date: null
approver: null
```

Agent may draft the ADR. Only the authorized human may approve scope, risk, spending, irreversible changes or an external commitment. **Do not implement an ADR as approved while its status is `proposed`.**

---

## 2. Immutable product and release boundaries

The following baseline decisions are binding unless changed through authorized change control:

| Boundary | Agent obligation |
|---|---|
| Company structure | One internal Part-time Coder company, multiple isolated client organizations; do **not** build multi-tenant white-label SaaS. |
| Business model | Hybrid client services + owned software products; separate client projects and internal products. |
| MVP pillars | Deliver public lead acquisition/CMS, internal project delivery/client collaboration, and usable six-network social workflow end-to-end. |
| Social networks | Facebook, Instagram, LinkedIn, YouTube, X and TikTok are supported as **content targets**; real API publication is independently capability/permission/approval gated. |
| Budget | Free/low-cost where lawful and technically adequate; **commercial production hosting must permit commercial operation**. No fabricated perpetual-free assumption. |
| Language | English first; architecture prepared for Bangla (`bn`), not full Bangla translation presumed in MVP. |
| Core stack | TypeScript monorepo; Next.js App Router; React/Tailwind/shadcn; Firebase Auth; MongoDB Atlas/Mongoose; Zod; `/api/v1` REST; separate supervised Node worker. |
| Access | Firebase identifies users; MongoDB internal records and scoped grants authorize them. Default deny, including for API responses, files and background jobs. |
| Finance | Invoice and payment records, exact money and client permissions; **not** a certified tax engine or a promised payment-gateway integration. |
| Scope control | Do not add complex HR/payroll, SaaS billing, social inbox/listening, unattended AI posting or speculative microservices to MVP. |

Use feature flags to distinguish `implemented`, `approved_for_environment`, `enabled_for_account`, `provider_supported`, and `customer_visible`. Disabled integration code is **not** a license to display unsupported promises.

---

## 3. Session startup and repository reconnaissance

### 3.1 Read-first checklist

Each new agent session MUST:

1. Confirm the repository root, branch, working tree status (`git status --short --branch`), existing remotes and worktree context.
2. Read this `AGENTS.md` and the six source docs, at minimum all governing sections for the current task. Use file search for cross-references, not guessed requirements.
3. Inspect `docs/PHASE_STATUS.md`, `docs/TEST_MATRIX.md`, latest gate record, linked issue/task, ADRs, runbooks and open blockers **if they exist**.
4. Inspect manifests (`package.json`, workspace and lockfile), Next.js configuration, tests, CI, database models, migrations, environment examples and current integration implementations.
5. Check for uncommitted edits **made by others**. Do not reset, overwrite, reformat, stash, cherry-pick or commit unrelated work without appropriate instruction.
6. State precisely what is present vs only proposed. A documentation-only repo starts at P00; it must not be described as an implemented application.
7. Verify installation/build script availability before trying commands. Define missing scripts as a P00 deliverable, never claim they already exist.

### 3.2 Session opening note

Before each substantial task, report concisely:

```text
CURRENT PHASE: P__ / G__ | GATE STATUS: ______
TASK: IMP-__-__ — short name
SOURCE: PRD IDs + relevant TRD/App Flow/UX/Schema sections
BASELINE: branch/commit; files affected; current test status
DEPENDENCIES: verified / blocked / unverified
CHANGES PLANNED: one atomic behavior + tests + docs
SECURITY/PRIVACY IMPACT: ______
OWNER INPUT: none / exact required action (do not ask for already-known facts)
SUCCESS: observable acceptance tests and artifacts
```

### 3.3 No undocumented assumptions

- Never claim to have accessed a provider console, installed dependency, created a secret, checked an endpoint, posted content, passed a test or inspected a file unless the corresponding action happened.
- Do not silently treat a default, mock, screenshot, copied console output or sample data as production evidence.
- If access is unavailable, write a reproducible offline plan, mark checks `not_run`/`blocked_external`, and complete only safe independent work.
- Existing credentials or private content in input are sensitive; do not repeat, expose or commit them.

---

## 4. Atomic task execution protocol

### 4.1 Definition of Ready (DoR)

No implementation ticket begins until it records:

- `IMP-XX-YY`, phase, goal, Owner/assignee and relevant `PTC-...` IDs.
- Verified dependencies and whether the task is MVP, future or provider-conditional.
- User/persona, route/screen IDs, state transitions and expected empty/error/recovery states.
- API request/response, permission check, data ownership, Zod DTO and affected collection/index.
- Positive, negative/abuse, race/replay, accessibility and integration tests appropriate to the change.
- Data migration, feature-flag, privacy, email/publishing, budget and rollback implications.
- Owner-only prerequisites and how their completion will be verified.

If an essential contract is absent or contradictory, stop **only the affected task**, record the blocker, and proceed with a safe independent task when possible.

### 4.2 Task loop — repeat for **every** coherent change

1. **Observe:** inspect existing files, tests, baseline and contracts. Record pre-existing failures.
2. **Design narrowly:** choose smallest change consistent with architecture; document any new cross-boundary interface.
3. **Test-first for high-risk code:** create/extend tests for permissions, financial computations, state transitions, queue leases and migrations before or with production code.
4. **Implement:** modify only related files; no random global formatting or dependency upgrades.
5. **Verify:** run scoped tests, lint/type checks, and relevant integration/E2E/security checks; preserve exact exit codes and actual outputs.
6. **Review:** inspect `git diff --check`, changed files, accidental secrets, broken UX states, types, queries, sensitive logs, migration effects and API compatibility.
7. **Document:** update relevant docs, tests, runbooks and phase status; cross-link existing requirement IDs.
8. **Commit:** make a clean, appropriately scoped Conventional Commit **after passing available required checks** and verifying staged content.
9. **Report:** identify commit SHA (only if real), what changed, checks run/blocked, limitations and next dependency.
10. **Stop at a gate:** never skip mandated review/owner decision merely because the agent has more tasks to do.

### 4.3 Scope budget and iteration

- Aim for one domain behavior/invariant per atomic task. Avoid mixing auth, CMS, database migrations and social publishing in one commit.
- For large features, split into schema + tests → service + permission checks → API → UI → E2E → docs, each with a safe, verifiable intermediate state.
- Prefer compatible incremental changes (expand/backfill/verify/contract); maintain compilable code and migration-safe contracts.
- Do not upgrade major dependencies or redesign package boundaries without an ADR, justification, rollback impact and relevant test coverage.
- Do not delete existing behavior, data, comments explaining constraints, tests or legal text to simplify a passing demo.
- Leave feature flags disabled until permissions, data and worker recovery are proven for the intended environment.

### 4.4 Definition of Done (DoD)

A task is complete only when all **applicable** items pass:

- [ ] Requirement IDs and acceptance conditions satisfied without unapproved scope creep.
- [ ] Domain code uses approved contract, Zod validation, safe DTO serialization and permitted data scope.
- [ ] Appropriate positive, denial, concurrency, failure and regression tests actually run and pass.
- [ ] UI has meaningful loading/empty/error/success/retry states, keyboard/screen-reader semantics and mobile usability where applicable.
- [ ] Typecheck, lint, affected unit/integration tests and build pass; security scans reviewed.
- [ ] No secret, provider token, real customer artifact or privileged data in staged files, logs or frontend bundle.
- [ ] Migrations/indexes are repeatable, measured and independently reviewed when risky.
- [ ] Documentation, test matrix, phase tracker and runbook updated.
- [ ] PR contains reviewer-ready evidence; small verified commit(s) exist when Git writes are authorized.
- [ ] Owner/provider manual gates remain visibly blocked until real evidence/approval.

**A passing build alone is never sufficient.** If a required check is unavailable, label the task `implemented / verification_blocked` (or `in_progress` in the canonical tracker); do not mark `verified` or pass its gate.

---

## 5. Repository and architectural boundaries

### 5.1 Target monorepo layout

```text
part-time-coder/
├── AGENTS.md
├── apps/
│   ├── web/                     # Next.js App Router, React, API /api/v1
│   └── worker/                  # supervised Node worker, durable jobs/outbox
├── packages/
│   ├── core/                    # domain services, policies, transitions
│   ├── database/                # Mongoose, repositories, indexes, migrations
│   ├── auth/                    # Firebase server auth, sessions, grants
│   ├── integrations/            # social providers, email, storage
│   ├── ui/                      # reusable accessible design-system components
│   └── config/                  # TypeScript, ESLint, tooling
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── APP_FLOW.md
│   ├── UI_UX_DESIGN_BRIEF.md
│   ├── BACKEND_SCHEMA.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PHASE_STATUS.md
│   ├── TEST_MATRIX.md
│   ├── OPERATIONS_DECISIONS.md
│   ├── ADR/
│   ├── RUNBOOKS/
│   └── RELEASES/
├── .github/workflows/
├── pnpm-workspace.yaml
└── package.json
```

**This is the intended structure, not a statement about current files.** Packages may start consolidated and be extracted when justified. Avoid circular imports and unnecessary boilerplate.

### 5.2 Layer rules

| Layer | Allowed | Forbidden |
|---|---|---|
| UI/page | Render server-approved DTOs, form state, accessible UX, permission-informed navigation | Reading DB/secret/token directly; UI-only authority; implicit client scope |
| Route/handler | Verify session, validate input, invoke domain service, serialize allowlisted result, enforce CSRF/origin and rate limit | Unreviewed business state changes in handlers; returning raw Mongoose docs |
| Domain service | Resource policy, invariants, transaction orchestration, business events and audit | Bypassing resource scope based solely on a provided ID |
| Data repository | Scoped queries, indexes, safe projections, optimistic concurrency, migrations | Unfiltered private queries; automatic destructive production schema/index changes |
| Integration adapter | Provider-specific OAuth, capabilities, rate limits, result normalization | Storing tokens in frontend or bypassing API restrictions |
| Worker | Durable claim/lease, recheck authorization/approval, bounded retry/reconciliation | Blind duplicate side effects, infinite retry, silent unknown outcomes |

### 5.3 Code quality and consistency

- Prefer explicit TypeScript types and strict checking; disallow unchecked `any` and unsafe type casts at trust boundaries.
- Prefer clear domain-driven names over generic `utils` and catch-all services. Keep implementation understandable to part-time contributors.
- Use one environment/config abstraction with startup validation; do not hardcode secrets, domains, hosts or credentials.
- Use stable API version `/api/v1` and schemas that can generate or validate OpenAPI contracts.
- Use ESLint/formatter and consistent imports defined during P00; a formatter does not justify touching the entire repo.
- Avoid shipping commented-out experimental routes or invented realistic customer testimonials/project evidence.
- Respect license terms for all packages, images, icons, templates and borrowed code; verify before distributing commercial builds.
- New dependency needs a short decision record for maintenance, license, security, bundle/performance and operational impact.

---

## 6. Authentication, sessions, RBAC and client isolation

### 6.1 Identity boundary

- Firebase `uid` is the external identity key; **MongoDB internal user status, memberships, grants, project scope and resource state are the authorization source of truth**.
- Use Firebase Admin SDK **server-side only**. Validate signed session cookies with an appropriate revocation strategy and fail closed for privileged/high-risk operations.
- Use secure `HttpOnly` cookies; `Secure` for HTTPS production; an appropriate SameSite policy; origin/CSRF checks for mutations; expiration and recent reauthentication requirements from TRD.
- Never store Firebase Admin private keys, social refresh tokens, bearer/session tokens or privileged authorization records in browser storage or client bundles.
- Public self-registration grants only the baseline regular-user role. Staff/client invitations require authorized issuance, expiry/replay checks and bound target membership.
- Privileged MFA must be enforced, including for Owner/admin and sensitive credential/finance operations. The implementation and selected Firebase features must be verified before declaring readiness.
- On suspension, termination or grant revocation, deny requests and stop in-flight privileged workflows according to the approved revocation policy; audit the change.
- Prevent loss of the last valid Owner; test recovery under nonproduction conditions.

### 6.2 Authorization rule for every protected operation

**All of the following are evaluated at the service/repository boundary:**

```text
allow = authenticated_session_valid
    AND user_active
    AND privilege_factors_satisfied_if_required
    AND has_permission(action, resource_type, effective_memberships)
    AND company_or_client_scope_matches(resource, user)
    AND project_or_document_grant_exists_if_required
    AND resource_state_allows(action)
    AND request_version_or_approval_revision_is_current
```

- Prefer denial/404 behavior that does not leak the existence of another client's records.
- Do not trust `userId`, `clientOrgId`, `companyId`, `projectId`, role name, scope or billing permissions from a form body without server-derived checks.
- Organization membership **does not automatically grant access to every project** in that organization; use explicit project/document grants as specified.
- Apply the same rules to list counts, autocomplete, searches, exports, media links, audit history, analytics, notifications and job payloads.
- A notification URL is not authorization; re-check when clicked and when queried.
- Admin capabilities are scoped and auditable; do not implicitly equate any departmental `manager` role with unrestricted Owner permissions.

### 6.3 Mandatory adversarial tests

- Anonymous → protected API denied.
- Regular user → role escalation/privileged endpoint denied.
- Client A → Client B object guessed via ID, filename, URL, report/export/filter and nested resource denied.
- Same-client member without project grant → project/deliverable denied.
- Suspended user with previously valid cookie → denied.
- Invite replay/expiry/target mismatch → rejected.
- Permission removal while an update or scheduled job is pending → action held or denied by current policy.
- Employee/client attempts to read internal comments, profit data, unreleased deliverables and provider secrets → denied.
- Last Owner demotion/deletion → prevented and audited.

Do not mark G2, G6 or G11 passed without stored negative-test evidence.

---

## 7. Backend validation, persistence and data integrity

### 7.1 API contracts

- Define exact request DTO, response DTO, error shape, pagination and field-level permission before implementing the route.
- Use Zod to validate external inputs at every boundary; sanitize rich text and validate upload metadata/content separately.
- Avoid passing untrusted filter or sort objects straight into MongoDB; enforce allowlists and indexes.
- Use structured errors and correlation IDs; follow TRD semantics for `400`, `401`, `403`, `404`, `409`, `412`, `422`, `429` and `5xx`.
- Never expose stack traces, raw internal IDs used as secrets, token data, database connection details or other-client existence.
- Use pagination and size/time limits; rate-limit high-risk public/auth/expensive endpoints.
- Version data formats and document backward compatibility. Do not silently rename public endpoints or state enum values.

### 7.2 MongoDB data rules

- Follow `docs/BACKEND_SCHEMA.md` collection names, exact field contracts, indexes, enums, TTL rules and lifecycle states. No invented duplicate collections.
- Ensure query filters include required company/client/project scopes. Use safe projections and deny-by-default DTO serialization.
- Schema migrations are **versioned, reviewed, repeatable and observed**. Do not rely on Mongoose automatic production index creation.
- Use optimistic concurrency/revision guards for content, approvals, tasks and deliverables; surface stale writes (`409`/`412` per contract) instead of overwriting.
- Model money with exact supported representation (e.g., decimal strings or integer minor units with currency-specific precision), **never JavaScript float accounting**.
- Invoice numbering must be unique/atomic; payment and reversal history append-only and auditable. Do not rewrite historical issued invoices or payment evidence silently.
- Financial, audit and legally retained records are **not** silently deleted by a generic TTL policy. Approve retention and redaction/legal hold behavior.
- Use idempotency with canonical request fingerprint for lead conversion, invoice issue, payment, manual completion, and other high-risk mutations; same key + changed body must fail safely.
- For related records/events, use MongoDB transactions where the target deployment supports them; record the transaction capability during P00/G0.
- Persist outbox events inside the same transaction as business state change; external communication happens **after** commit.

### 7.3 Migration discipline

Follow **expand → backfill → verify → contract** for breaking database changes:

1. Review data classification, backward compatibility, traffic, relevant indexes and deployment order.
2. Prepare deterministic migration script with version ID, dry-run, resumable checkpoint and explicit failure behavior.
3. Test on isolated representative data; capture counts/checksums and logical invariants; test old/new app overlap.
4. Obtain Owner approval for production-impacting, irreversible, destructive or large-volume changes.
5. Take/verify backup and a feasible compensating strategy; never promise automatic rollback if data loss is unavoidable.
6. Execute in authorized maintenance window with observability and a defined abort threshold.
7. Reconcile counts/invariants, record command results and evidence; **only then** remove deprecated fields/indexes in a separate reviewed step.

**STOP immediately** if a migration could expose cross-client data, corrupt financial/audit history, drop records, break running versions or lacks verified backup/rollback control.

---

## 8. Frontend UI/UX, accessibility and localization

- `docs/APP_FLOW.md` owns route map, `AF-###` screen families, transitions and role workspace behavior; `docs/UI_UX_DESIGN_BRIEF.md` owns presentation and accessibility acceptance (`UX-###`).
- Use shared semantic UI components with Tailwind CSS + shadcn primitives where suitable; do not bypass a component's accessibility contract for appearance.
- Proposed brand palette, fonts, logo and imagery require Owner sign-off. **Do not imply that proposed visual tokens are approved brand assets.**
- Implement adaptive public, auth and private workspace shells. Hide inaccessible actions for clarity, but enforce authority only on the server.
- All user-affecting async views need `loading`, `empty`, `success`, `validation_error`, `permission_denied`, `conflict`, `dependency_unavailable`, `retry`, and where relevant `unknown_outcome` states.
- Support keyboard navigation, focus management, visible focus, logical heading order, semantic controls, form labels, error announcements, reduced motion and contrast targets aligned to WCAG 2.2 AA.
- Kanban, drag/drop and calendar interactions require keyboard/touch-accessible list or action alternatives. Do not make critical workflows dependent on drag/drop alone.
- Design stable layouts at documented test widths; validate browser zoom, reduced-motion preference, long text, and delayed/network-failed loads.
- English `en` is the MVP locale. Extract user-visible strings and structure routes/messages for future Bangla `bn`; do not embed untranslated strings throughout components.
- Store time instants in UTC with explicit timezone context; display locale/timezone distinctly, especially social schedule and client deadlines.
- Never conflate `published_api_confirmed`, `published_manual_reported`, `scheduled`, `failed`, `not_supported`, `blocked`, or `unknown_outcome` as a single green “Published” status.
- Do not use fake revenue numbers, actual-client identifiers or false KPI cards in a production page; fixtures must be labeled demo data and excluded from real analytics.

---

## 9. Six-platform social media integration contract

### 9.1 No implied API entitlement

The platform manages campaign variants for **Facebook Pages, Instagram Professional, LinkedIn Organizations, YouTube, X and TikTok**. **Each provider, developer app, credential, account, scope, endpoint, publishing action, metric and environment is independently gated.**

- Query the provider's **current official documentation and developer console** at time of implementation; never assume historical quotas/prices/permissions remain current.
- Build only with authorized public APIs, official SDKs or documented allowed methods. Do **not** scrape logged-in sessions, imitate personal-account apps, use private endpoints, automate browsers to evade restrictions, or borrow another account's consent.
- Store `account_id`, environment, provider permissions, app review/audit status, quota/billing status, capabilities and last-verified timestamp (with no secrets in reports).
- Approval of one Facebook Page or LinkedIn Organization does not grant permissions on another account; approval of one provider does not authorize the other five.
- Use separate encrypted OAuth credentials server-side, least-privilege scopes, validated state/redirect/replay checks, secure rotation and explicit disconnect/revoke behavior.
- All six must have a usable draft/review/calendar/manual-publishing pathway even if no provider grants API publishing rights.

### 9.2 Authoring, approval and scheduling

- Model `campaign → platform-specific variant → approval of exact content revision/hash → schedule eligibility → per-account publish job → outcome evidence`.
- Different networks may require distinct text, media, format, visibility, title, thumbnail, caption or API operations. Do not assume one payload works everywhere.
- A creator **cannot self-approve by default**. Approver authorization and separation-of-duties policy apply.
- Editing approved text, media, target, account or material fields **invalidates approval** and any queued dispatch eligibility until reapproved.
- Persist schedule in UTC; capture selected IANA timezone, user intent and DST ambiguity resolution. Never silently shift a scheduled post.
- The scheduler must work without an open browser and survive worker restarts.
- Manual publishing is a first-class flow: export approved media/caption, show platform instructions, record operator/time/proof, and use **manual-reported** status, not API-confirmed status.

### 9.3 Worker reliability and external side effects

- Persistent job record must include stable idempotency/deduplication key, account/variant/revision reference, due time, status, attempts, lease owner/expiry, last safe error, policy flags and outcome evidence.
- Atomically claim work with an expiring lease; test concurrent workers and crash recovery.
- Before dispatch, revalidate account state, consent, scopes, cost limits, approval revision hash, campaign status, permission policy and media readiness.
- Bound retries with exponential backoff/jitter for **provably safe** transient failures; respect provider rate limits and expiration.
- If the provider **might have accepted a post** before a timeout/connection loss, persist `unknown_outcome` (or the exact canonical equivalent in source spec), **hold** automatic retries, and reconcile using supported official evidence or seek human resolution. Never blindly repost.
- A successful local queue write is **not** successful publication. Save an external post ID/URL or equivalent verifiable provider evidence before asserting API-confirmed success.
- Record one outcome per platform/account. A failed X attempt must not flip Facebook's independently confirmed outcome.
- Store logs and telemetry with redaction and correlation IDs; alert on backlog, unknown outcomes, repeated failures, revoked tokens and unexpected costs.

### 9.4 Provider-specific go/no-go

| Provider | Required Owner/provider gate | If unavailable |
|---|---|---|
| Facebook Pages | Eligible Page, authorized Meta app, approved scopes, controlled live test | Keep draft, review and manual Page workflow |
| Instagram Professional | Eligible professional account, permitted API flow/scopes and media constraints | Manual publishing with truthful status |
| LinkedIn Organization | Company Page admin rights, approved API product/scopes and test evidence | Manual Organization publishing instructions |
| YouTube | Authorized channel, OAuth consent/quota/upload eligibility and resumable upload validation | Manual upload to YouTube Studio |
| X | Approved developer access and explicit metered API budget; allowed post/media endpoints | Disabled automatic dispatch, manual export |
| TikTok | Approved app/account publishing scope; visibility/audit limitations verified | Manual workflow; never claim unapproved public posting |

**Live publication STOP:** Do not create real posts, videos, comments, deletions or edits until the Owner authorizes the exact provider, account, audience/visibility, content, test purpose, timing and spend. Use sandbox/fake adapters and synthetic media in ordinary CI.

---
## 10. CRM, project delivery, client portal and finance invariants

### 10.1 Public site / CMS

- Public projects, services, owned products, case studies, blog and legal pages use **explicit publishable revisions**; drafts/archived material must not appear in public queries, Open Graph metadata, sitemap, search indexes, feeds or caches.
- Secure preview routes must verify authorization and expiration; never use unguessable URLs as the sole privacy control.
- Public contact and quotation forms need server validation, abuse controls, consent/retention notice where applicable and safe acknowledgement without leaking CRM records.
- New uploaded assets require type/size validation, ownership, storage namespace controls, scanning or appropriate malware defenses, and private signed delivery for client content.
- Public testimonials, customer logos, project results and business claims must be supplied/approved by the Owner; generated fictional examples must be labeled as examples and never shipped as authentic references.

### 10.2 CRM and client lifecycle

- Follow the state sequence **inquiry → lead → consultation/quote → authorized conversion → client/project** as defined in PRD and App Flow; transitions and assignment permissions are server-enforced.
- Prevent duplicate conversions via idempotency and linked-record transactions; failure midway must not leave orphaned client/project records or duplicate notifications.
- Separate client organization membership, client representative contacts and internal ownership; never use email-domain matching as blanket access to a client organization.
- Respect client data export, status visibility and lead retention policies; protect contact details from unrelated staff.

### 10.3 Delivery projects and workspaces

- Project managers operate within assignments/authorized scopes. Employees may update only accessible tasks and report progress through documented transitions.
- Employee workspace pages are permission-shaped views over shared data, **not** alternate authorization backends.
- Tasks, milestones, progress and file visibility must correctly separate internal-only material from client-visible releases.
- Deliverable acceptance binds to the exact visible revision; an old or superseded revision cannot be accepted after a new release.
- Project linked comments, activity and notifications inherit project scope and visibility classification; no information leak via counts, search, mention previews or exports.
- Apply concurrency guards to competing task updates, reviews, assignments and milestone transitions.

### 10.4 Finance

- Scope quotation/invoice creation, issue, void, payment, reversal and export to authorized finance/administrative users.
- Use exact currency precision with **SAR, BDT and USD** support as configured, and persist historical amounts/currency metadata. Do not recalculate old booked amounts using today's exchange rates.
- Invoice issue numbering is unique/atomic; amount and tax/discount calculation is deterministic and unit tested.
- Issued invoices and payment/reversal ledger records require immutable or append-only history, reason codes and audit trail.
- Client portal invoices must be filtered by active client organization/project authorization; signed download URLs must be access-scoped and short-lived.
- Do not create real invoices, charge customer cards, send billing emails, submit tax reports or promise jurisdictional compliance without Owner approval of the actual legal/business process.

---

## 11. Privacy, secrets, secure coding and supply-chain rules

### 11.1 Secrets and sensitive data

**Never** write secrets to Git, issue comments, pull request text, documentation, chat transcripts, error reports, fixtures, traces, screenshots, sample SQL/Mongo exports, build artifacts or frontend environment variables.

Restricted material includes: `.env` content, Firebase service-account JSON, MongoDB URI credentials, JWT/session cookies, OAuth access/refresh tokens, provider app secrets, encryption keys, client files, customer PII, real invoice/payment records, passwords and API credentials.

- Commit only sanitized `.env.example` with **placeholder values** and safe explanatory comments.
- Use distinct dev/staging/prod secrets; least-privilege service accounts; secret managers or protected injection; auditable key rotation.
- Maintain denylist and positive allowlist redaction for structured logs; secrets are never logged to help debugging.
- If a secret is suspected to be exposed: **STOP use, quarantine output, notify Owner, rotate/revoke affected credentials, investigate exposure and document incident**. Merely deleting a committed secret is insufficient.
- CI secret scanning and dependency/licensing checks must run without silently swallowing nonzero exits.

### 11.2 Standard threat model

For each feature, consider: broken object-level authorization/IDOR, privilege escalation, CSRF, XSS, injection and unsafe Mongo queries, server-side request forgery (SSRF), insecure direct file access, replay/idempotency errors, token theft, OAuth state forgery, brute-force/abuse, race conditions, exposed audit/PII, supply-chain compromise and denial of service.

At minimum:

- Validate untrusted input and outputs at every boundary; sanitize rich content and safe URLs.
- Disable arbitrary outbound URLs and enforce allowlists/host checks for provider callbacks and server fetches; block private/IP metadata destinations to reduce SSRF.
- Apply secure cookie attributes, CSRF/origin enforcement, upload restrictions, CSP and other headers appropriate to the app.
- Use server-generated or checked roles/grants and parameterized, schema-constrained Mongo operations.
- Rate limit auth/public lead forms, uploads, external paid API calls and expensive analytics queries.
- Protect backups with encryption and restricted access, separate from production deployment credentials.
- Support account suspension, incident containment, session invalidation and mandatory audit on privileged actions.
- Follow approved retention, privacy/cookie notice, export/deletion and legal-hold processes; do not assume statutory retention periods without legal review.

### 11.3 Security-stop conditions

The agent MUST **stop the affected implementation, merge or release** when it detects any of the following:

- Real or plausible cross-client data exposure, API privilege escalation or last-Owner lockout.
- Credential/token in client build, Git history, logs, notifications, or public file URL.
- Missing enforceable MFA/revocation for privileged capabilities.
- Unsafe duplicate external publishing, ambiguous post auto-retry, or unauthorized live provider action.
- Financial rounding/invoice/payment-history corruption; unapproved real payment or tax action.
- Destructive production migration without verified backup and compensating plan.
- Unresolved critical/high-impact vulnerability, unlawful commercial deployment terms or material privacy-policy gap.
- Required automated checks deliberately disabled or evidence altered to pass a gate.

File a focused issue/security incident, identify the failing invariant and tests, suggest a non-destructive remediation, and request appropriate Owner/Tech Lead authorization before resuming risky work.

---

## 12. Quality standards, tests, CI and validation evidence

### 12.1 Required script contracts

Create the actual scripts during P00 (or verify existing equivalents). **Do not assume these commands exist before checking `package.json`**:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm build
pnpm test:e2e             # isolated seeded test/staging environment
pnpm security:scan        # secrets, dependencies, policy/static scans
pnpm db:index:verify      # read-only index drift check
```

Optional but recommended when relevant: contract/OpenAPI validation, visual regression, `pnpm test:a11y`, load tests, migration dry-run, repository dependency graph/cycle scan, and provider **sandbox-only** adapter conformance tests.

### 12.2 Test pyramid and negative cases

| Change | Minimum evidence |
|---|---|
| Pure utilities/Zod schemas | Deterministic unit tests + edge boundaries |
| Auth/session/grants | Realistic authenticated integration tests + deny/suspension/revocation/cross-organization tests |
| Database/index/migration | Isolated MongoDB integration tests, collision/race checks, migration dry-run, rollback/restore consideration |
| CMS/public SEO | Draft privacy, preview access, sanitization, sitemap, cache and indexing regression |
| CRM/project/delivery | State transition, idempotency, assignment, version conflict, file/project/client visibility tests |
| Social core | Fake adapters, exact-revision approvals, DST scheduling, lease concurrency, crash recovery, ambiguous outcome hold, manual completion |
| Live social adapter | Official permission/entitlement evidence, controlled Owner-authorized real test, safe revoke/reconcile; **outside ordinary CI** |
| Finance | Exact arithmetic, concurrency, duplicate keys/numbers, append-only history, client download denial |
| UI/components | Keyboard, focus, responsive, empty/error, semantics and accessibility checks with representative flows |
| Infrastructure | Health alerts, secrets scan, worker restart, recoverable backups, staged deploy/rollback test |

Run malicious/negative tests before passing gates, including at least the security cases listed in §6.3 and the applicable test catalogs: PRD `AT-001`–`AT-022`; App Flow `AC-AF-...`; Backend Schema `BS-AT-001`–`BS-AT-056`; Implementation Plan `IMP-AT-001`–`IMP-AT-030`. Consult the actual source for **exact identifiers**; never infer numbering to pad a report.

### 12.3 Testing integrity

- **Never** turn failing checks green by deleting tests, reducing assertions, blanket `skip`, broad mocking of the exact behavior under test, `|| true` or manipulating fixtures.
- Identify known pre-existing errors separately; preserve them as tracked failures, and don't mislabel new regressions as pre-existing.
- Capture actual command, environment, exit code, summarized results, failing test names and relevant artifact/log path (redacted).
- Distinguish `passed`, `failed`, `not_run`, `blocked`, `not_applicable`, and `flaky_under_investigation`.
- Mock-only acceptance never proves provider API entitlement, measured latency, production recovery or real invoice/legal readiness.
- Use synthetic fixtures for client and finance tests. Never run destructive suites against production or another tenant's real data.
- Green CI alone does not authorize a phase gate or production deployment.

### 12.4 CI gate

For an affected PR, require as applicable:

1. Install reproducibly with lockfile; lint and typecheck.
2. Unit tests and domain integrations (with isolated database/fixtures).
3. Scoped permissions/negative checks and contract tests.
4. Build and server/client secret-leak inspection.
5. Secret, dependency, license and baseline static scans.
6. E2E preview/staging smoke tests for affected user journeys.
7. Automated accessibility plus manual review for significant UI flows.
8. Migration dry-run/index check for schema change.
9. Human review of architectural, privacy, finance or provider-impacting work.

If a job cannot run due to absent environment/permission, mark it **blocked**, never pass. PR merge/release controls must enforce the agreed required-check set.

---

## 13. Git, branches, pull requests and commit policy

### 13.1 Safety and branch rules

- `main` is protected production source; adopt `dev` only if the actual team workflow justifies it. Make feature/fix/doc branches from a known stable base.
- Examples: `feat/imp-05-03-project-tasks`, `fix/imp-07-06-publish-lease`, `docs/agents-governance`.
- No force pushes, history rewrites, branch protection bypass or unreviewed direct pushes to production branches.
- Do not commit other agents' or humans' unrelated working tree changes. Stage explicit paths/hunks where appropriate, inspect `git diff --cached`, then commit.
- Do not silently initialize new Git history, replace remotes, change repo visibility, alter protected branch rules, or publish a repository without Owner authorization.
- Maintain `README.md`, `.gitignore`, `.env.example`, lockfile, CI and license information consistent with reality.

### 13.2 Conventional Commits after each verified small change

Use the grammar:

```text
<type>(<scope>): <imperative description>

Optional body: why, requirement IDs, migration/integration impact
Refs: IMP-05-03; PTC-PRJ-004
```

Types include `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `build`, `ci`, `security`, `revert` (or explicitly supported repository convention).

Examples:

```bash
git add packages/auth/src/policies.ts packages/auth/test/policies.test.ts
git commit -m "fix(auth): deny client access without project grant"

git add apps/worker/src/jobs packages/integrations/src/social
git commit -m "feat(social): hold ambiguous publishing outcomes"

git add docs/PHASE_STATUS.md docs/TEST_MATRIX.md
git commit -m "docs(progress): record G7 social worker verification"
```

**These are illustrative; never claim they ran.**

- Commit once a coherent change and relevant checks pass, not once per keystroke or whole development phase.
- Commit refactor/behavior/test/documentation separately **when useful for independent review**, while preserving intermediate compatibility.
- A change is *not complete* until its required tests and status/docs updates are included in the reviewed work, even when those are split across commits in one PR.
- If Git writes are disallowed or unavailable, provide a truthful staged-diff/commit-message recommendation; never invent a SHA.
- Do not use `--no-verify` to bypass precommit checks without explicit authorized emergency approval and documented rationale.

### 13.3 PR description template

```markdown
## Intent
- Ticket: IMP-__-__
- Requirements: PTC-___-___
- Phase/gate: P__ / G__
- Problem solved and user-visible result:

## Changes
- Code, API, schema, UI, docs:
- Out of scope:

## Security and data boundaries
- Auth/role/client/project access reviewed:
- Secret/PII handling:
- Idempotency, finance, or social side effects:

## Evidence (real, not anticipated)
| Check | Command / test | Result | Evidence |
|---|---|---|---|
| lint | | not_run | |
| typecheck | | not_run | |
| unit | | not_run | |
| integration | | not_run | |
| E2E/negative | | not_run | |
| build/security | | not_run | |

## Manual actions and deployment
- Owner steps and verification:
- Environment variables (names only):
- Data migration / index changes:
- Rollback/compensation:
- Feature flag / provider approval:

## Review
- Commit SHAs:
- Known risks and blockers:
- Required approver(s):
```

---

## 14. Progress tracking and documentation synchronization

### 14.1 Minimum tracking files

Create and maintain the following at P00, without falsifying historical progress:

- `docs/PHASE_STATUS.md` — all phases P00–P14, gates, tickets, owners, current states, blockers, evidence and approvals.
- `docs/TEST_MATRIX.md` — requirement ID → acceptance test → environment → last result → evidence → issue/commit.
- `docs/OPERATIONS_DECISIONS.md` — hosting/cost/providers/legal/manual setup decision log (**nonsecret values only**).
- `docs/ADR/` — approved and proposed architectural decisions.
- `docs/RUNBOOKS/` — operations, provider reconciliation, incident response, rollback and restore instructions.
- `docs/RELEASES/` — candidate manifests, release notes, signed gates and post-launch status.

Preserve IDs and history. If a tracker has its own schema, follow the existing schema instead of overwriting it.

### 14.2 Status tracking structure

```yaml
phase: P07
phase_name: social_core_and_worker
gate: G7
status: not_started            # not_started|in_progress|blocked|ready_for_review|approved
owner: ""
source_requirements: []        # existing PTC-* IDs only
tasks:
  - id: IMP-07-01
    status: not_started         # not_started|in_progress|implemented|verified|blocked_external|deferred
    changed_files: []
    commit_shas: []
    test_evidence: []
    blockers: []
manual_gates:
  - action: "Owner choose social account + reviewer policy"
    status: pending
    verification: null
security_review: pending
rollback_review: pending
owner_gate_decision: pending
approval_evidence: null
```

This example does not assert implementation. Real entries must use actual source ticket IDs.

### 14.3 Update rules

- Update the tracker after **every coherent ticket/commit**, not only at the end of a phase.
- Map introduced/modified tests to the exact relevant requirement IDs; do not claim 100% coverage from a documentation-only register.
- Update affected docs alongside schema, API, route, UI, auth, social policy or operations changes, and include version/decision note for meaningful contract changes.
- Report external blocker `blocked_external` without making the entire phase seem complete. Do not convert missing provider approval into a fake feature.
- Every status transition to `verified` requires a reproducible evidence link or artifact; `approved` gate requires recorded authorized review.
- If source documents conflict, mark specific impacted tasks blocked, record the proposed resolution and keep working on unrelated safe tasks.
- Never overwrite the PRD to match an accidental implementation. Code must follow the approved requirements or enter change control.

---

## 15. Manual Owner checkpoints: stop and give executable steps

An agent may prepare code, local mocks, documentation and safe scripts. It MUST **not** autonomously perform actions that require the Owner's credentials, money, consent, publication authority, legal judgment or irreversible production control. Tool availability does not equal permission.

### 15.1 Gate decision matrix

| Checkpoint | Agent may do | Requires explicit human authorization | How to verify |
|---|---|---|---|
| GitHub repository/branch protection | Draft workflow/config, propose checks | Create/change production repo visibility, access, branch protection, secrets | Owner checks repo rules, CI run and permissions |
| Domain, DNS, branding | Draft records/layout, test local branding | Buy domain, change live DNS, approve logo/trademarks/legal statements | Live DNS and approved brand/version record |
| Hosting and budget | Benchmark/options, dry-run manifest | Subscribe/pay, select commercial production host, expose public app | Provider terms/budget decision, successful sanctioned deployment |
| Firebase | Implement auth against test fixtures; document console steps | Create/authorize production project, identity provider, secrets, privileged user and MFA | Redacted project ID/config plus auth/revocation test |
| MongoDB Atlas | Migrations/test DB, setup guide | Approve prod credentials/network, destructive migration, restore of customer data | DB role/network checks, migration report, restore proof |
| Media/email | Provider abstractions, sandbox tests, templates | Production storage/email sender credentials, DNS verification, real sends | Approved sender domain, scoped storage/access tests |
| Social accounts | Capability registry, mock adapters, docs | Connect real account, app audit/review, approve scopes, billable API, real post/delete | Per-account permission and live controlled evidence |
| Finance/legal | Fake quotes/invoices, templates, exact math tests | Real invoice issue/payment, legal tax/VAT wording, payment charges | Approved invoice template, jurisdictional/legal decision |
| Security/privacy | Threat review and safe fixes | Approve retention/legal hold, risky customer data transfer or emergency disclosure | Signed policy/ADR and test result |
| Production release | CI/staging tests, rollback runbook, candidate manifest | Deploy/cut over, modify production secrets/DNS, activate billable services | Signed G13, deployment commit/tag, smoke/alert/restore record |

### 15.2 Required manual checkpoint message

Whenever a task depends on a human action, provide this exact structure (with real specifics, not placeholders where known):

```markdown
### MANUAL OWNER CHECKPOINT — [ID / phase / gate]
**Why this is required:** [authorization, provider, cost, security or legal reason]
**Dependency blocked:** [IMP ticket, route/integration/operation]
**Safe independent work continuing:** [specific tasks or none]

**Owner actions:**
1. Open the relevant official console/account. Use your own credentials; do not paste secrets into chat or Git.
2. Navigate to [exact current navigation if verified, otherwise identify navigation as needs verification].
3. Configure [nonsecret settings and least-privilege roles].
4. Store any secret in approved protected secret storage, not in chat/repo.
5. Run or request the described test, limited to approved account/environment/audience.
6. Return ONLY nonsecret verification: project/app ID (if nonsecret), enabled scopes, status, redacted test evidence, budget approval and date.

**Expected verification:** [one reproducible positive + negative check]
**Stop condition:** [no valid permission / denied review / uncertain scope / billing not approved]
**Agent continuation criterion:** [verified owner decision and relevant gate updated]
```

- Never request the Owner's password, OTP, private key, service-account JSON or long-lived OAuth tokens.
- Do not promise or pretend to monitor approval asynchronously.
- A manual step can block a dependent integration while other parts of the MVP proceed.

### 15.3 Additional mandatory pauses

Pause before using a tool to: send real communications, publish/delete externally, initiate payment, buy resources, change production configuration, modify privileges, grant project-wide access, export sensitive production records, run destructive migrations, rotate production keys, change live DNS, or execute a release/rollback affecting users. **Request approval for the specific action and scope, not a blanket authorization.**

---

## 16. Phases P00–P14 and required gate discipline

**The authoritative granular tickets and dependencies are in `docs/IMPLEMENTATION_PLAN.md`.** Do not replace their ticket descriptions with this overview or start another phase just because its label appears below.

| Phase / gate | Core outcomes | Mandatory gate evidence | Human or external dependency |
|---|---|---|---|
| **P00 / G0** | Repo baseline, docs reconciliation, toolchain/scripts/CI, threat model, feasibility and cost registry | Real install/lint/build, CI failure injection, Mongo transaction/index feasibility, initial ADRs | Repo ownership, commercial-host shortlist, cost ceiling |
| **P01 / G1** | UI tokens, public/auth/workspace shells, responsive/accessibility primitives | Component tests, keyboard/responsive evidence and Owner design-token decision | Logo, visual brand approval |
| **P02 / G2** | Firebase sessions, invitation, grant engine, owner recovery, client scopes | MFA/revoke/suspend/IDOR tests, deny matrix, audit evidence | Firebase project/config, privileged account setup |
| **P03 / G3** | Public website, CMS, products/services/blog/case studies and safe media | Public/CMS E2E, sanitization, sitemap/draft privacy, SEO/media permissions | Final public content, rights, domain/legal copy |
| **P04 / G4** | Public inquiry, CRM, proposals and idempotent lead conversion | End-to-end visitor → lead → quote/project, duplicate/race tests | Approved sales messaging, quote policy |
| **P05 / G5** | Projects, tasks, assignments, staff/PM workspaces, milestones | Scoped access/assignment/version conflicts and internal/released separation | Initial team/project templates |
| **P06 / G6** | Client dashboard, controlled invitations, released deliverable review | Cross-org/file/export negative matrix, exact revision approval and pilot journey | Authorized client test participants |
| **P07 / G7** | Six-network composer, draft/review/approval/calendar, durable worker, manual fallback | Fake-provider contract suite, lease/race/crash/DST/unknown-outcome tests, six manual paths | Social account owner, approval policy |
| **P08 / G8** | Official authorized provider adapters and initial analytics | **Per-account** scopes/eligibility/budget/live-test evidence or clear blocked/disabled record | Meta, LinkedIn, YouTube, X, TikTok developer approvals and spend consent |
| **P09 / G9** | Quotes/invoices/manual payments, exact money and finance UI | Atomic numbering, amount precision, duplicate payment, client scope | Approved legal invoice text, currencies, tax review |
| **P10 / G10** | Notifications, analytics, monitoring, runbooks | Scoped recipient/click-time checks, alerts, KPIs, spend guardrail rehearsal | Email sender and alert destination approvals |
| **P11 / G11** | Security/privacy/reliability/restoration hardening | Secret/IDOR/security scan, incident tabletop, real independent restore and RPO/RTO record | Retention/legal policy, backup owner |
| **P12 / G12** | Staging E2E, UAT, performance/a11y, release rehearsal | All P0/M evidence, test matrix, migration dry-run, release candidate SHA | UAT and security reviewers |
| **P13 / G13** | Commercial production cutover and approved go-live | Signed Owner go/no-go, deployment + smoke/alerts, rollback/restore, final known limits | Owner approval, live hosting/DNS/secrets/legal readiness |
| **P14 / G14** | Hypercare, operational learning and approved next roadmap | Actual incident/usage/feedback report, 30/60/90-day decisions | Owner prioritization and continuous operations |

### 16.1 No gate jumping

- Respect the dependency DAG in Implementation Plan §1.2. Safe parallel work is allowed only when shared contracts and security prerequisites are met.
- An external provider may be `blocked_external`; G8 must reflect that honestly. **The six-network manual social MVP can launch without production posting approval** when all manual/safe-core acceptance gates pass and the Owner records any applicable release exception.
- G11 security hardening cannot excuse insecure earlier phases: authorization, validation, audit and operational recovery hooks start with their first dependent feature.
- No Owner gate is auto-approved by green CI or a generated report.
- Do not claim the platform is production-ready before G12 verification and G13 explicit sign-off.

### 16.2 Minimum go/no-go rule

Block release for any unresolved critical: cross-client data exposure; credential/token leak; broken last-owner recovery or privileged MFA; financial or audit corruption; duplicate public post risk; unobservable/vanishing queue jobs; backup without successful restore evidence; forbidden commercial hosting; material privacy/legal deficiency; essential inaccessible workflow; untested rollback; missing monitoring; or absent Owner sign-off. See PRD §19.3 and Implementation Plan §20.3 for authoritative lists.

---

## 17. Deployment, migrations, monitoring and recovery

### 17.1 Environment policy

- Distinguish **development**, **staging** and **production** Firebase projects, MongoDB credentials/databases, file namespaces, social app settings and token keys.
- Production uses a provider/licensing tier that permits commercial workloads and supports the supervised Node worker; do not rely on a web request or Hobby-only cron for scheduled publishing.
- All deployments require identifiable artifact SHA/tag, environment config names (not values), migration set, health checks and release owner.
- Apply least privilege to database/service accounts, network policy, CI identities and deployment credentials.
- Avoid logging PII or secrets; use correlation IDs across web/API/job/worker and redacted analytics.

### 17.2 Observability and recovery

- Instrument API request latency/error, session/auth denial, queued/due/stuck/unknown publish jobs, worker lease conflicts, provider errors/quotas, notification failures, cost consumption and backup jobs.
- Separate `/health/live` from `/health/ready` where supported, including meaningful worker readiness; do not claim a worker is healthy merely because web is reachable.
- Alert on failed scheduled publications and `unknown_outcome`, not just HTTP 500s.
- Maintain documented retention and alert destination; Owner approves recipient and alert severity policy.
- Back up database **and necessary media/config manifests** independently of the production host. Encrypt access, test a restoration to isolated infrastructure and record actual RPO/RTO.
- For production schema changes: dry-run → backup verification → Owner approval → staged migration → invariant checks → monitored release → approved rollback/compensating plan.
- A rollback of code does not undo published external posts, sent emails, invoices or destructive data operations. State irreversibility explicitly.

### 17.3 Incidents and emergency behavior

If a possible incident occurs:

1. **Contain:** stop only the harmful workflow, disable affected feature flag/account/job safely, preserve logs and evidence, do not delete history.
2. **Classify:** possible credentials, client isolation, finance, publish duplication, data loss or downtime; note severity and affected environments.
3. **Escalate:** notify the designated Owner/security/operations reviewer without exposing confidential details in public channels.
4. **Investigate:** record evidence, correlation/commit/job IDs, account, scope and timing, with private information redacted.
5. **Remediate:** test in isolation, rotate/revoke if credentials affected, protect old state, perform reviewed fix and regression tests.
6. **Recover:** obtain authorized go/no-go for production actions; check external effects and data reconciliation.
7. **Report:** timeline, root cause, impact, preventative tests, docs/runbook/ADR updates and Owner sign-off.

**No autonomous production data restore, mass customer outreach, social deletion, secret rotation or payment reversal** without specific human authority, except operations explicitly delegated by an approved incident runbook and tool permissions.

---

## 18. Mandatory end-of-task and end-of-phase reporting

### 18.1 End-of-task report (every atomic task)

```markdown
### Task report — IMP-__-__
- **Phase/gate:** P__ / G__
- **State:** implemented | verified | blocked_external | in_progress
- **Requirement IDs:** [verified existing PTC-...]
- **Behavior delivered:** [specific, observable]
- **Files changed:** [paths]
- **Database/API/permission impact:** [none or exact]
- **Checks actually run:**
  - `[command]`: [PASS/FAIL/BLOCKED/NOT_RUN], [observed output summary]
- **Security/negative tests:** [case + outcome]
- **UI states/accessibility:** [cases + evidence, if relevant]
- **Git:** [real branch, commit SHA(s), PR link or `not_committed`]
- **Docs/status changed:** [paths + requirement references]
- **Manual or provider blockers:** [step, owner, verification criterion]
- **Known limitations/rollback:** [specific]
- **Next dependency:** [IMP-__-__ or gate]
```

An automated report must distinguish observed facts from recommendations and tests to be executed later. Do not write `All tests passed` without evidence.

### 18.2 End-of-phase report (mandatory before next dependent phase)

Create/update `docs/RELEASES/PHASE_PXX_GX_REPORT.md` (or an existing equivalent approved convention) and summarize to the Owner using this template:

```markdown
# Part-time Coder — Phase P__ / Gate G__ report

## 1. Executive result
- Phase name:
- Current status: not_started | in_progress | blocked | ready_for_review | approved
- **Gate decision:** PENDING OWNER / APPROVED / REJECTED / CONDITIONAL
- Date / environment / base SHA / final SHA:

## 2. Scope and traceability
| Ticket | PRD IDs | Deliverable | Status | Evidence |
|---|---|---|---|---|
| IMP-__-__ | PTC-... | | | |

## 3. Completed versus pending
- Implemented and verified:
- Implemented but unverified:
- Blocked by Owner/provider:
- Intentionally deferred (with PRD reason):

## 4. Changes made
- Git branch and actual commits/PRs:
- Code/files/components/APIs/collections changed:
- Configuration changes (names only):
- Migration IDs, index changes and compatibility:

## 5. Verification evidence
| Check/test catalog | Environment and command | Observed outcome | Evidence artifact |
|---|---|---|---|
| lint/typecheck/build | | not_run | |
| unit/integration/contract | | not_run | |
| E2E/negative/permission | | not_run | |
| security/secret/dependency | | not_run | |
| accessibility/performance | | not_run | |
| backup/worker/recovery | | not_run | |
| real provider tests if authorized | | blocked_external | |

## 6. Security and operational impact
- Client/org/project isolation and denial tests:
- Data privacy/retention/logging review:
- Social/publishing safety and external outcomes:
- Finance/integrity review:
- Cost/quotas/alerts/backup status:

## 7. Manual Owner operations REQUIRED before dependent work
| Action | Exact steps / console | Nonsecret verification | Status |
|---|---|---|---|
| | | | pending |

## 8. Defects, risks and decisions
| Severity | Description | Affected ticket/requirement | Mitigation | Owner |
|---|---|---|---|---|
| | | | | |
- ADR/change-control references:
- Provider approval/entitlement status:
- Known limitations and release exceptions:

## 9. Deployment and rollback
- Deployed environment and artifact:
- Migration snapshot/restore evidence:
- Safe rollback or compensating actions:
- Impact on existing users/data/provider-side effects:

## 10. Gate decision and next steps
- Gate checks met/not met:
- Owner/QA/Security reviewers and approval record:
- Eligible independent work:
- Next dependent phase (only if approved):
- Owner action/request (if any):
```

### 18.3 Gate verdict semantics

| Gate verdict | Meaning | Agent action |
|---|---|---|
| `PENDING_OWNER` | Evidence gathered but authorized decision absent | **Stop dependent phase**, request sign-off; independent tasks may continue |
| `APPROVED` | Checks met and authorized approval recorded | Proceed within agreed dependency graph |
| `REJECTED` | Required check failed or Owner declined | Fix, retest, present new evidence; do not override |
| `CONDITIONAL` | Explicit documented external/provider exception allowed by PRD | Proceed only permitted paths, keep blocked integration off and track risks |
| `BLOCKED` | Missing essential capability/evidence/secret/recovery | Stop dependent action; provide exact remediation |

**Never present `PENDING_OWNER` as `APPROVED`; never automatically insert Owner signature.**

---

## 19. AI implementation handoff and prompting rules

### 19.1 Preferred prompt for a coding agent

```text
You are implementing Part-time Coder in the current repository.
Read AGENTS.md and the six authoritative docs under docs/ before coding.
Inspect actual git status, existing code, tests, current phase tracker and ADRs.
Identify the first eligible task from docs/IMPLEMENTATION_PLAN.md, preserving P00–P14 dependencies.
State the task ID, real PRD requirement IDs, impacted routes/API/schema, tests and any manual Owner gates.
Implement ONLY one small coherent verified change at a time.
Follow default-deny authorization, client organization/project scoping and approved source contracts.
Run affected test/build/security checks, record actual results, inspect staged changes, make a descriptive Conventional Commit if authorized, and update docs/PHASE_STATUS.md + docs/TEST_MATRIX.md.
Do not invent execution evidence, expand scope, post to real social accounts, make production changes, or handle secrets without authorization.
At each phase exit, produce the mandatory G0–G14 evidence report and STOP dependent implementation pending human sign-off.
If blocked on Owner/provider decisions, provide numbered manual steps and continue only independent safe work.
```

### 19.2 Agent-to-agent handoff packet

An agent handing off work MUST provide:

- Repository root, branch, clean/dirty state, base SHA, actually committed SHAs and PR links.
- Current `PXX/GX`, ticket statuses, verified tests and unresolved failures.
- Changed API/schema/permission contracts, migrations, feature flags and rollout constraints.
- External/provider statuses and nonsecret Owner actions awaiting approval.
- Precise remaining task(s), blockers and dependencies; references to affected docs/tests/runbooks.
- Cautions about irreversible side effects, any unknown publishing outcomes, and existing incidents.

Do not assume a new agent has access to previous private reasoning, terminal history, external accounts or uncommitted work; place durable facts in repository documents and actionable tickets.

### 19.3 Automated assistance limits

- AI may propose design alternatives, draft ADRs, generate fixtures, create documentation and write safe code/tests.
- AI MUST not impersonate a reviewer/Owner/client/provider, falsify approvals, manufacture business content/testimonials, claim legal compliance without review or label demo data real.
- AI cannot self-authorize provider scopes, credits, hosting purchase, customer communications, invoicing, destructive actions or production deployment.
- Tools that can perform an action still require explicit appropriate authority; do not assume a connected service is blanket authorization.
- When tool or platform access is unavailable, say so. Avoid empty status updates or promises of asynchronous future execution.

---

## 20. Traceability and compliance matrix

The agent's behavior must satisfy the following **existing** contractual sources. Requirement references below are examples of IDs verified at task time; the full canonical register remains in the PRD and Implementation Plan. The scope summary is not permission to drop less-visible requirements.

| Enforcement area | Source of authority | Agent's review obligation | Primary gate(s) |
|---|---|---|---|
| Scope, decisions, P0/M/F/C | PRD §0–2, §17, §21–22 | No unauthorized MVP expansion; map task to registered IDs | All |
| Public website and CMS | PRD §5; App Flow §2–4; UX §6/11 | Publication state, preview security, safe public content | G3 |
| Identity and organization | PRD §6, §13; TRD §4; Backend Schema §6 | Firebase auth, scoped permission, revocation, last owner | G2/G11 |
| Lead/CRM conversion | PRD §7; App Flow §4; Backend Schema §8 | Idempotent transitions and transactional boundaries | G4 |
| Delivery and employee UI | PRD §8–9; App Flow §4; UX §8–9 | Assignment/grant, revision-specific client visibility | G5/G6 |
| Social content and provider APIs | PRD §10; TRD §8; App Flow §5; Backend Schema §9 | Approved revision, safe worker, six adapters, per-account gates | G7/G8 |
| Finance | PRD §11; TRD §7; Backend Schema §10 | Exact money, issued invoice immutability, finance scope | G9 |
| Notifications and analytics | PRD §12; TRD §13; App Flow §6 | Scoped recipients and truthful metric provenance | G10 |
| Privacy/security | PRD §13; TRD §10; Backend Schema §11–13 | Negative tests, secrets, retention, audit, recovery | Continuous/G11 |
| UX/accessibility | UX §2–14; App Flow §9–10 | WCAG-oriented states, keyboard, responsive, truthful badges | G1/G12 |
| Operations/NFR | PRD §14; TRD §12–15 | Compliance, staging, alerting, measured restore/rollback | G11/G12/G13 |
| Milestones and QA | Implementation Plan §1–20 | `IMP` IDs, `IMP-AT`, gate packets and Owner signoffs | G0–G14 |

Before any ticket is declared complete, perform **live reference resolution** against the checked-in source: exact `PTC-...`, `IMP-...`, `AF-...`, `UX-...` and test IDs cited must exist and match their intended semantics. Do not assert exhaustive test coverage solely because all IDs appear in a markdown table.

---

## 21. In-session self-review and forbidden shortcuts

### 21.1 Before reporting success, ask

1. Did I inspect the **current** repository and source documents rather than rely on assumed project status?
2. Did I respect the current phase dependencies and approved product scope?
3. Does this change preserve client data, finance records, provider actions and audit integrity?
4. Are the authorization checks actually enforced on server, worker and data access paths?
5. Do tests cover failure, conflict and unauthorized access—not just the happy path?
6. Did the commands **really run**, and are their outputs represented accurately?
7. Are external API entitlement, costs and live publication claims independently verified?
8. Did I review the staged diff for secrets, unrelated edits and unsafe mutations?
9. Did I update real progress/evidence and create only actual permitted commits?
10. Is the next action gated by Owner/provider approval—and if so, did I stop it and provide exact steps?

### 21.2 Strictly forbidden

- Fabricating test, CI, deploy, Git SHA, provider approval, analytics, live post, data migration or Owner sign-off evidence.
- Weakening security for an attractive demo; hardcoding `admin=true`, trusting client roles/org IDs or disabling real access checks.
- Silently deleting tests, snapshots, security scans or error handlers to make builds pass.
- Posting/charging/sending real-world content or spending API credits without scoped Owner authorization.
- Treating a provider timeout as success or triggering a potentially duplicate external post on blind retry.
- Sending Firebase/MongoDB/third-party keys to chat, source control, frontend or user-visible logs.
- Hiding an integration failure or claiming all six providers are connected because their icons are present.
- Running destructive migrations/data purges or issuing real invoices without explicit review and tested recovery.
- Skipping project gates, rewriting requirement IDs, or overwriting signed documentation to match unapproved code.
- Force-pushing to protected branches, overwriting other contributors' work, or deploying a commercial platform to a host whose terms prohibit such use.
- Promising production readiness on mocks, screenshots or a single green build.

---

## 22. First session when no application code exists

If only planning documents are present, the agent begins with **P00 discovery/foundation**, not with speculative dashboards or provider authorization. The safe initial execution order is:

1. Confirm all six docs are readable; reconcile PRD canonical path with no content changes.
2. Inspect Git state and existing package manifests, CI/scripts and any code; capture a factual baseline.
3. Create `docs/PHASE_STATUS.md`, `docs/TEST_MATRIX.md`, `docs/OPERATIONS_DECISIONS.md` as empty/status-correct templates if absent.
4. Create root workspace/package scripts and lint/typecheck/test foundations consistent with TRD and Implementation Plan; use small commits.
5. Prove install/build/CI baseline in a minimal application **without claiming any product feature implemented**.
6. Verify Mongo transaction/index behavior in an isolated development environment; if credentials are missing, provide safe manual setup steps and mark those checks blocked.
7. Document hosting commercial-use, external integrations and secrets as pending Owner decisions; do not invent approved accounts.
8. Produce G0 evidence packet. **Pause before G1-dependent work unless Owner or delegated approver grants G0.**

If the repository is already underway, **do not reinitialize it**; identify the last verified gate and resume the next eligible ticket based on actual evidence and Owner decisions.

---

## 23. Maintenance, amendments and ownership

- Keep this policy versioned. Substantive rule changes need an ADR/Owner review and a changelog entry describing which tasks/phases are affected.
- Policy updates should revise examples only when they reflect actual current scripts, commands and workflows.
- Where a command or provider constraint becomes outdated, research/verify the new official behavior and update relevant TRD/Implementation Plan/provider registry via change control, without silently changing core business requirements.
- Periodically audit agent compliance: commit granularity, evidence completeness, security denials, skipped tests, manual gate quality and phase-signoff accuracy.
- The Owner or delegated Tech Lead may tighten this policy, but nobody may unilaterally waive essential client, finance, privacy, publishing or recovery protections.

### Document integrity statement

This `AGENTS.md` is a **behavioral contract for AI-assisted development**. It describes required future practices and acceptance evidence; it **does not attest that software has been implemented, tests have been run, social provider apps have been approved, backups have been restored or production is live**. Those claims require actual repository/tool evidence and Owner sign-off.

**End of `AGENTS.md` — PTC-AGENTS-001 v1.0.0**
