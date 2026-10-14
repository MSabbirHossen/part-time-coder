# Part-time Coder — Product Requirements Document (PRD)

> **Document ID:** PTC-PRD-001  
> **Version:** 1.0.0 — Architecture-baseline edition  
> **Status:** Draft PRD for owner sign-off; confirmed architecture decisions are binding; implementation subject to phase gates  
> **Prepared:** 14 October 2026  
> **Product:** Part-time Coder Unified Company Platform  
> **Intended readers:** Founder/Owner, project managers, engineers, designers, QA, security reviewers, and AI development agents  
> **Authoritative predecessors:** Part-time Coder Architecture Baseline v1.0 and the seven confirmed product decisions  
> **Next documents:** `docs/TRD.md` → `docs/APP_FLOW.md` → `docs/UI_UX_DESIGN_BRIEF.md` → `docs/BACKEND_SCHEMA.md` → `docs/IMPLEMENTATION_PLAN.md` → `AGENTS.md`

---

## 0. Document governance and reading guide

### 0.1 Quick navigation

- **Strategy and governance:** Sections 1–4.
- **Functional requirements:** Sections 5–12 (public/CMS, roles, CRM, delivery, client, social, finance, collaboration/analytics).
- **Security and quality:** Sections 13–14.
- **Dependencies and design input:** Sections 15–16.
- **Release plan, tests and risks:** Sections 17–20.
- **AI handoff and owner sign-off:** Sections 21–22; Appendices A–C.

### 0.2 Purpose
This PRD defines **what** Part-time Coder must accomplish, for whom, and what constitutes acceptance. It deliberately separates **product requirements** from low-level implementation details to be specified in the TRD, App Flow, UI/UX brief, backend schema, implementation plan, and AI rules. It is designed to support phased, AI-assisted engineering without accidental scope expansion or unverified claims of external API capability.

### 0.3 Normative terminology
- **MUST / SHALL:** mandatory for the stated release.
- **SHOULD:** recommended; deviation requires written rationale.
- **MAY:** optional and not a release blocker.
- **MVP:** first usable, production-eligible release, not a visual prototype.
- **Post-MVP:** explicitly excluded from MVP acceptance unless subsequently approved via change control.
- **Integration-gated:** implemented only to the degree authorized by the platform, available permissions, and budget. A documented fallback is mandatory.
- **Company:** Part-time Coder, the sole internal operator organization.
- **Client organization:** a separate customer account/organization whose users have scoped access to their own resources, not another instance of the company platform.
- **Workspace:** a role/permission-based UI partition of one integrated application, not a separate application.

### 0.4 Requirement format and traceability
Each mandatory requirement receives a stable ID: `PTC-<DOMAIN>-###`. The domain prefixes are `GOV`, `PUB`, `CMS`, `IAM`, `ORG`, `CRM`, `PRJ`, `EMP`, `CLI`, `SOC`, `FIN`, `COM`, `ANA`, `SEC`, `DATA`, `INT`, `NFR`, and `OPS`. IDs remain stable even if priorities change. Acceptance tests cite IDs directly. `P0` = launch blocking, `P1` = planned near-term improvement, `P2` = future enhancement. `M` = MVP; `F` = future; `C` = conditional on third-party availability. For implementation, a requirement cannot be marked complete without demonstrable acceptance evidence.

### 0.5 Change control
Any change to confirmed decisions, scope, a data boundary, external integration behavior, or security obligations SHALL be recorded as a decision/ADR with: reason, alternatives, affected requirement IDs, cost/risk impact, owner approval, and changed tests. The owner is the final product decision-maker. AI agents may propose but must not silently authorize changes.

### 0.6 Priority and launch policy
- All `P0/M` requirements must pass before production release; a conditional automatic publishing capability (`C`) can remain disabled if the required manual fallback, user-facing status, and integration test coverage work.
- `P1/F` and `P2/F` items must not prevent the MVP launch.
- Security, privacy, client isolation, financial integrity, backup restorability, accessibility of core journeys, and publishing correctness are non-negotiable launch gates.

---

## 1. Executive summary

### 1.1 Product vision
**Part-time Coder** will become an integrated operating platform for a hybrid software company that sells custom software services and develops its own products. It combines: (1) a polished public-facing business website and CMS, (2) a permission-controlled company workspace for administration and project delivery, (3) an isolated client-facing portal for requests and collaboration, and (4) a unified social-content operation across **Facebook, Instagram, LinkedIn, YouTube, X, and TikTok**. The solution begins with the core business workflows and grows toward advanced HR, finance, CRM, reporting, and automation without requiring a platform rewrite.

### 1.2 Problem statement
Small software teams often fragment operations across websites, task tools, spreadsheets, messaging apps, document storage, client communications, and separate social media dashboards. Fragmentation causes missed leads, unclear responsibilities, weak client visibility, duplicated content entry, inconsistent brand updates, limited auditability, and rising operating costs. Part-time Coder needs an owned source of truth with appropriate access boundaries and traceable work.

### 1.3 Strategic objectives
| ID | Objective | Evidence of success |
|---|---|---|
| OBJ-01 | Present a professional and credible software company identity | Prospects can identify services, browse case studies, and request quotations |
| OBJ-02 | Convert inquiries into manageable client engagements | Each lead can progress from submission to qualification and linked project |
| OBJ-03 | Coordinate actual delivery work | Assigned users can track tasks, milestones, and project outcomes |
| OBJ-04 | Offer trustworthy client self-service | Clients can review only their authorized work and submit feedback |
| OBJ-05 | Centralize company communications on social networks | Draft, review, schedule, publish/manual-post, and record outcomes per channel |
| OBJ-06 | Provide operational visibility without sacrificing privacy | Relevant dashboard KPIs show authorized data with auditable actions |
| OBJ-07 | Control early-stage costs while allowing commercial operation | Budget-aware, portable deployment with independent restore procedure |

### 1.4 Business model
- **Client services:** website/app development, web design, maintenance, technical consulting, and other configurable service offerings.
- **Own products:** a separate product portfolio with roadmaps, releases, links, launch updates, and optional customer interest forms; actual SaaS subscription provisioning is post-MVP.
- **Distribution:** company website, service inquiries, referrals, owned social accounts, and educational/technical content.
- **Revenue:** project/service fees, maintenance agreements, and eventual product revenue. Automated payments or tax reporting are not assumed at launch.

### 1.5 Company boundaries
Exactly one internal company operator exists at MVP. The system supports many **client organizations**, each with multiple members and potentially several projects, but DOES NOT sell the platform itself to independent software agencies. Company employees may be assigned to multiple projects and departments, while clients never become internal staff implicitly. Future multi-company SaaS would require an explicit architecture decision.

### 1.6 Primary value proposition
**One company, one platform, purpose-built workspaces, one auditable source of truth.** A visitor can request a service; a team can turn it into a managed engagement; the client can follow its delivery; marketing can turn approved outcomes into published updates.

---

## 2. Approved decisions and design constraints

### 2.1 Binding decision register
| Decision ID | Decision | Status | Consequence |
|---|---|---|---|
| DEC-001 | Hybrid software services plus owned products | Approved | Distinct service catalog and owned-product catalog |
| DEC-002 | One Part-time Coder operating company; multiple clients | Approved | Scoped client organizations, not multi-company SaaS |
| DEC-003 | Unified social drafts, approvals, scheduling, official API publishing, analytics | Approved with platform gates | Per-platform capability checks and manual fallback |
| DEC-004 | Facebook, Instagram, LinkedIn, YouTube, X, TikTok | Approved | All six modeled and visible; automation enabled independently |
| DEC-005 | Balanced MVP across public website, delivery/client operations, and social hub | Approved | Three complete workflows at launch |
| DEC-006 | Free-tier-first infrastructure | Approved with commercial-use and reliability qualification | Hosting and operations must be legally suitable for commercial use |
| DEC-007 | English launch; Bangla-ready architecture | Approved | Locale-aware UI architecture; Bangla translation rollout later |
| DEC-008 | Next.js + TypeScript, Firebase Auth, MongoDB Atlas | Architecture baseline | Modular monolith with server-enforced permissions |
| DEC-009 | Dedicated, supervised background worker | Architecture baseline | Durable publishing jobs; no browser-dependent scheduling |
| DEC-010 | REST API `/api/v1`; shared monorepo; GitHub Actions | Architecture baseline | Stable contracts and automated quality gates |
| DEC-011 | Role-based plus scoped resource permissions | Architecture baseline | No reliance on UI hiding for security |
| DEC-012 | SAR, BDT, USD supported; time stored in UTC | Architecture baseline | Money and timestamps have explicit precision and metadata |
| DEC-013 | Public self-registration creates only regular users; staff/client invitations controlled | Architecture baseline | No public elevated-role enrollment |
| DEC-014 | No production use of Vercel Hobby for commercial activity | Constraint | Select compliant commercial hosting before launch |
| DEC-015 | Real-time chat, payroll, advanced accounting, omnichannel inbox, SaaS reselling deferred | Scope boundary | No delivery promise in v1.0 |

### 2.2 Guiding principles
1. **Production integrity over dashboard count.** An end-to-end workflow is more valuable than an unfinished module.
2. **Privacy by default.** Least-privilege access and explicit ownership checks at every entry point.
3. **Capability truthfulness.** Social-network features appear only as available when provider access has been verified.
4. **Recoverable operations.** Publish jobs, data exports, and client deliverables must survive failures.
5. **No fake integrations.** Simulated adapters permitted in development/test only, visibly flagged.
6. **Accessibility and performance by design.** Avoid heavy 3D or animation in operational dashboards.
7. **Internationalization-ready.** English now; Bangla without rewriting components or data models.
8. **Cost observability.** Monitor API credits, storage, bandwidth, email volume, and job usage.

### 2.3 Known assumptions and validation points
| ID | Assumption / open operational input | Required validation point |
|---|---|---|
| ASM-001 | Domain, public email, legal entity details, and address are not yet supplied | Brand/content readiness gate |
| ASM-002 | Founder holds administrative control of company social accounts | Integration onboarding |
| ASM-003 | Platform API approvals/scopes may be unavailable during MVP | Adapter test + manual publishing fallback |
| ASM-004 | Production hosting expense may be nonzero | Pre-launch budget sign-off |
| ASM-005 | Tax, electronic invoicing, privacy notice and retention obligations depend on actual jurisdictions | Legal/compliance review before financial launch |
| ASM-006 | Exact storage/traffic/workforce volumes unknown | Revalidate capacity at performance gate |
| ASM-007 | Client feedback can initially be asynchronous; no live chat required | User acceptance testing |
| ASM-008 | Invoice records are operational records, not necessarily legally compliant tax invoices | Finance compliance review before issuing legally binding invoices |
| ASM-009 | Existing projects/content can be manually imported; no source migration is committed | Content import planning |

---

## 3. Personas, roles, and permissions

### 3.1 Audience
- **Guest:** prospective customer, job applicant, or reader.
- **Registered user:** self-service profile holder who can submit requests and track their own inquiries.
- **Client organization administrator:** oversees the client's authorized engagements and invited client members.
- **Client member:** reviews explicitly assigned resources and contributes feedback.
- **Employee/contributor:** delivers assigned development, design, support, or operations work.
- **Project manager:** owns delivery schedules and authorizes project assignments and releases within scope.
- **Marketing creator/approver:** produces campaigns, reviews content, manages publishing where authorized.
- **HR/Finance/Operations staff:** handles specific company data through limited permissions.
- **Company admin:** manages day-to-day systems, users, and content.
- **Owner/Super Admin:** holds final authority over high-risk changes and company ownership.

### 3.2 Baseline roles
| Role | Landing area | Core scope | Explicit exclusions |
|---|---|---|---|
| Guest | Public | Read published pages, submit contact/quote | Internal resources |
| Regular User | `/dashboard` or `/account` | Own profile and inquiries | Client/employee access |
| Client Member | `/client` | Explicitly granted client project resources | Other clients, internal-only records |
| Client Admin | `/client` | Client-member administration subject to policy; own organization data | Company user/role administration |
| Employee | `/workspace` | Own tasks, assigned project records | Unassigned confidential projects |
| Project Manager | `/workspace/projects` | Scoped projects, tasks, milestones, project-facing client updates | Company-wide finance, other PM projects |
| Operations Staff | `/workspace` | Assigned operational tools | Finance/HR unless granted |
| HR Manager | `/hr` | Authorized employee/leave records | Social tokens, non-HR finances |
| Finance Manager | `/finance` | Quotations, invoices, payment and expense records | Owner security settings |
| Content Creator | `/marketing` | Draft content and media, submit reviews | Publish without permission |
| Marketing Manager | `/marketing` | Campaign approvals, authorized social connections and publication | Project confidential records unless granted |
| Department Manager | `/workspace` | Department employees/resources with explicit grants | Cross-department records by default |
| Admin | `/admin` | Routine company configuration, users, projects, CMS | Transfer or disable last owner without separate control |
| Owner / Super Admin | `/admin` | Full legitimate access; recovery and security oversight | Cannot bypass externally imposed legal requirements |

### 3.3 Effective authorization model
Permission evaluation SHALL consider **identity, account status, role grants, department membership, client-organization membership, project membership, per-resource assignment, action, and workflow state**. A person may simultaneously hold several roles, but client membership must not automatically grant access to internal company data. Admin impersonation, if ever offered, is future scope and requires audit/consent controls. Public visibility is a separate publication state rather than a role.

### 3.4 Permission examples
| Action | Owner/Admin | PM | Employee | Marketing Creator | Marketing Manager | Client Admin/Member | Regular User |
|---|---|---|---|---|---|---|---|
| Publish website case study | Authorized | Request approval | No | Draft only if granted | Only if CMS grant | No | No |
| Create company project | Yes | Scoped grant | No | No | No | No | No |
| Read assigned project tasks | Yes | Own scope | Assigned scope | Only if project member | Only if project member | Only client-visible subset | No |
| View internal profit/margin | Finance-specific grant | No by default | No | No | No | No | No |
| View client deliverable | Yes | Own scope | Assigned scope | No by default | No by default | Own org + permitted project | No |
| Create social draft | Yes | If granted | If granted | Yes | Yes | No | No |
| Approve social draft | Authorized | Only if approved as reviewer | No | Not own draft by default | Yes | No | No |
| Connect/disconnect company social account | Owner or delegated admin | No | No | No | Explicit trusted grant | No | No |
| See audit log | Owner/security-specific grant | No | No | No | No | No | No |

**Separation of duties:** For company publishing, the creator should not approve their own draft by default; owner emergency override requires a recorded reason. Sensitive permission grants, credential operations, account deletion, and owner recovery require a fresh authentication check and audit event.

---

## 4. Product architecture and navigation (functional view)

### 4.1 Product surfaces
1. **Public:** `/`, `/about`, `/services`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/products`, `/products/[slug]`, `/blog`, `/blog/[slug]`, `/careers`, `/contact`, `/get-quote`, `/privacy`, `/terms`.
2. **Identity:** `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-email`, `/auth/accept-invite`.
3. **User:** `/dashboard`, `/account`, `/account/requests`, `/account/notifications`.
4. **Admin:** `/admin`, `/admin/users`, `/admin/clients`, `/admin/projects`, `/admin/cms`, `/admin/settings`, `/admin/audit-logs`.
5. **Employee/project:** `/workspace`, `/workspace/projects`, `/workspace/projects/[id]`, `/workspace/my-tasks`, `/workspace/notifications`.
6. **Client:** `/client`, `/client/projects`, `/client/projects/[id]`, `/client/requests`, `/client/deliverables`, `/client/messages`.
7. **Marketing:** `/marketing`, `/marketing/composer`, `/marketing/calendar`, `/marketing/posts`, `/marketing/campaigns`, `/marketing/accounts`, `/marketing/analytics`.
8. **Finance (MVP subset):** `/finance/quotes`, `/finance/invoices`; detailed expense/accounting modules are later.
9. **HR (future expansion):** `/hr/employees`, `/hr/attendance`, `/hr/leave`, `/hr/recruitment`, `/hr/performance`.

Detailed route-state and interaction contracts belong in `APP_FLOW.md`. All listed pages are **potential/approved information architecture**, not promises that post-MVP sections ship in the MVP. Only routes required by explicit MVP requirements are launch-blocking.

### 4.2 Common UI behavior
The user sees permitted navigation and personalized summary cards. A role selector may allow switching between accessible workspaces without changing identity. Breadcrumbs, consistent tables, responsive navigation, semantic status indicators, saved filters where useful, human-readable errors, and accessible empty states are shared patterns. Attempts to deep-link into unauthorized resources must be denied by the server even if a UI link is hidden.

---

## 5. Functional requirements — public website and CMS

### 5.1 Public site
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-PUB-001 | P0/M | Responsive company homepage with purpose, services, featured projects/products, recent updates, trust signals, and clear CTA | Guest understands offering and navigates to quotation within two interactions from hero |
| PTC-PUB-002 | P0/M | About and team/public company information controlled by CMS | Only approved/published team data visible; no automatic exposure of employee directory |
| PTC-PUB-003 | P0/M | Service catalog with slug, summary, scope, deliverables, and quote CTA | Published service appears at stable route and is searchable |
| PTC-PUB-004 | P0/M | Portfolio/case studies with categories, tech stacks, approved media, outcome and external links | Draft/private project not discoverable; no client-confidential data leaks |
| PTC-PUB-005 | P0/M | Owned-product showcase separate from client case studies | Public product shows description, lifecycle label, release link if present |
| PTC-PUB-006 | P0/M | Technical blog/news/updates with categories, author attribution policy, and timestamps | Published article available via canonical URL and public index |
| PTC-PUB-007 | P0/M | Contact, service inquiry, and quote request forms with validation and anti-abuse measures | Submission creates traceable lead/request; duplicate retries do not create unwanted clones |
| PTC-PUB-008 | P0/M | Legal pages and cookie/consent handling where required | Owner can publish policies; tracking/consent implementation matches approved legal policy |
| PTC-PUB-009 | P0/M | SEO essentials: title, description, Open Graph, sitemap, robots, canonical URLs, structured markup where appropriate | Indexable pages pass metadata checks; drafts and private routes excluded |
| PTC-PUB-010 | P1/F | Careers board and applicant workflow | Applicants can submit securely and staff can triage |
| PTC-PUB-011 | P1/F | Newsletter opt-in and campaign subscriptions | Explicit subscription preferences and unsubscribe flow |
| PTC-PUB-012 | P1/F | Bangla translation of public routes | Supported content and UI locale correctly switch |

### 5.2 CMS
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-CMS-001 | P0/M | Authorized CMS management of services, case studies, products, articles, team/public details, homepage sections, testimonials | Content editor can add/edit content without editing application code |
| PTC-CMS-002 | P0/M | Content states `draft → in_review → published → archived` with explicit permissions | Unpublished content is never served publicly; transitions logged |
| PTC-CMS-003 | P0/M | Slug uniqueness, revision metadata, scheduled publish optional only if worker safely supports it | Concurrent conflicting slugs rejected; change history records editor |
| PTC-CMS-004 | P0/M | Media library with safe uploads, alt text, ownership, and allowed media types | Disallowed file rejected; published media accessible via intended policy |
| PTC-CMS-005 | P0/M | Preview unpublished content for authorized editors via access-controlled preview | Guessing preview URL without authorization reveals nothing |
| PTC-CMS-006 | P0/M | Public project publication requires explicit selection of sanitized case-study fields rather than exposing project database records | Internal budgets, messages, client files absent from public response |
| PTC-CMS-007 | P1/F | Rich revision diff, rollback, editorial scheduling, multi-language content workflows | Prior revision can be restored with audit trail |

---

## 6. Functional requirements — identity, organization and administration

### 6.1 Identity and access
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-IAM-001 | P0/M | Firebase Authentication sign-up/sign-in, email verification, password reset, logout, and session expiry | Authenticated server session tied to verified identity; expired sessions rejected |
| PTC-IAM-002 | P0/M | Server-side verification of identity and app authorization on all private APIs | Forged/stale client claims cannot bypass access rules |
| PTC-IAM-003 | P0/M | Public registration defaults exclusively to Regular User | Crafted signup payload cannot self-assign admin/client/staff role |
| PTC-IAM-004 | P0/M | Authorized staff/client invitation and acceptance with expiry and single-use semantics | Revoked/expired invitations unusable; membership created only for target principal |
| PTC-IAM-005 | P0/M | Many roles per user; explicit scoped grants and project/department/client membership | UI reflects changes; server immediately enforces revocation according to session policy |
| PTC-IAM-006 | P0/M | Account states invited, active, suspended, deactivated | Suspended users cannot access private APIs or active background operations |
| PTC-IAM-007 | P0/M | Privileged account MFA and reauthentication for critical operations | Privileged action denied unless verification meets policy |
| PTC-IAM-008 | P0/M | Owner safety invariant: cannot remove/deactivate last active owner via ordinary administration | Attempt blocked and audited |
| PTC-IAM-009 | P0/M | Secure login redirect and profile settings; notification preferences | Open redirects prevented; users can manage own public profile/preferences |
| PTC-IAM-010 | P1/F | Optional organizational SSO and delegated access-review workflow | Owner-approved enterprise integration tested |

### 6.2 Company administration
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-ORG-001 | P0/M | One company record with brand, logo, services, approved contacts, locale and currencies | Authorized admins update settings; public/private visibility separated |
| PTC-ORG-002 | P0/M | Departments and internal membership registry | Department membership does not itself expose confidential cross-department data |
| PTC-ORG-003 | P0/M | Admin dashboard with counts for leads, projects, pending reviews, publishing issues, and assigned activity | Counts align with authorized query scopes and underlying records |
| PTC-ORG-004 | P0/M | User search, invite, suspend, assign/revoke permitted roles, and view restricted activity | Every access change creates audit event |
| PTC-ORG-005 | P0/M | Feature/integration settings with safe configuration validation | Invalid config rejected; secrets never returned to frontend |
| PTC-ORG-006 | P1/F | Employee asset inventory, policy acknowledgments, advanced directory | Staff can view own asset assignments without seeing other staff private details |

---

## 7. Functional requirements — CRM, sales and client onboarding

### 7.1 Lead-to-project lifecycle
Recommended lead stages: `new → contacted → qualified → proposal_sent → negotiation → won / lost / closed`. Moving to `won` does not itself create a paid transaction; authorized conversion can create/link a client organization and project while preserving lead provenance.

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-CRM-001 | P0/M | Public inquiry/quote request stored with selected service, contact, requirements, consent and source | New lead visible to authorized operator only |
| PTC-CRM-002 | P0/M | Lead dashboard with status, assignee, notes, filters, and last contact activity | Assigned staff updates stage with timestamp; history preserved |
| PTC-CRM-003 | P0/M | Basic quotation creation with line items, currency, expiration, notes, status | Quotation values calculate consistently and cannot be edited by client |
| PTC-CRM-004 | P0/M | Convert qualified lead to client organization and project, without duplicate creation | Conversion is idempotent; origin lead remains linked |
| PTC-CRM-005 | P0/M | Client organization profile, authorized contacts, access invitations | Contacts cannot see a project until explicit project access is granted |
| PTC-CRM-006 | P0/M | Record key client communications and next action | Internal-only notes never appear in client-facing response |
| PTC-CRM-007 | P1/F | Versioned proposals, e-signatures, sales pipeline forecasting and reminder automation | Signed version bound to offer and immutable record |
| PTC-CRM-008 | P2/F | Marketing attribution and multi-touch lead scoring | Report methodology documented |

### 7.2 User story examples
- **US-CRM-01:** As a guest, I want to submit a scoped project inquiry so a team member can assess feasibility.
- **US-CRM-02:** As an admin, I want to assign and qualify leads so requests do not get lost.
- **US-CRM-03:** As a client admin, I want to see accepted project details without gaining access to internal estimates or sales negotiations.

### 7.3 Workflow acceptance
**WF-CRM-01 — Quote to project:** Guest submits form → protected endpoint validates and rate-limits → lead created and acknowledged → authorized staff qualifies → quotation recorded → status accepted/approved by staff → project and client records created/linked → invitation sent → client sees permitted dashboard. If any linking step fails, the operation is retryable and cannot create duplicated active clients/projects for the same conversion idempotency key.

---

## 8. Functional requirements — delivery projects and employee workspace

### 8.1 Project model and delivery
Project types: `client`, `internal_product`, `internal_operations`. Visibility levels: `internal_only`, `client_summary`, `client_collaborative` with additional per-record policy. Proposed lifecycle: `proposed → planned → active → client_review → delivered → maintenance → archived`; `on_hold` and `cancelled` are permitted exception states with an audit reason.

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-PRJ-001 | P0/M | Project record: name, description, type, owner, client link when relevant, team, visibility, dates, status | Project visible only to authorized principals |
| PTC-PRJ-002 | P0/M | Tasks with title, assignee(s), priority, due date, status, optional checklist and comments | Assignment and status changes traceable |
| PTC-PRJ-003 | P0/M | Milestones with target date, status, and client-facing summary | Client progress computed from approved visibility rules, not arbitrary internal data |
| PTC-PRJ-004 | P0/M | List and Kanban views for permitted projects/tasks | Filters do not bypass authorization; keyboard access works |
| PTC-PRJ-005 | P0/M | Scoped project membership, invite/assign/revoke team members | Revoked team member cannot read files/tasks afterward |
| PTC-PRJ-006 | P0/M | Secure project document attachment and access policies | No client access to internal-only file through direct storage URL |
| PTC-PRJ-007 | P0/M | Client-visible status summaries and deliverables are explicitly marked/approved | Internal task comments do not leak into client views |
| PTC-PRJ-008 | P0/M | Project activity log, change timestamps and notification triggers | Assignee sees relevant update and activity record is retained |
| PTC-PRJ-009 | P0/M | Owner/admin can associate public showcase content through sanitized CMS publishing workflow | Client delivery records are never directly mapped into public pages |
| PTC-PRJ-010 | P1/F | GitHub issues/commits/PR status linkage and deployment status | Authorized project integrates selected repository with minimum required scope |
| PTC-PRJ-011 | P1/F | Sprint planning, dependencies, time logs, advanced reporting, QA signoff, release workflow | Defined workflow and test evidence for each feature |
| PTC-PRJ-012 | P2/F | Resource capacity, Gantt/critical path, multi-project portfolio management | Capacity aggregates correct project membership |

### 8.2 Employee workspace
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-EMP-001 | P0/M | Personalized dashboard of own tasks, upcoming due dates, assigned projects and notifications | Another employee's sensitive work does not appear |
| PTC-EMP-002 | P0/M | Employee can update permitted task status, comments, and assigned attachments | Unauthorized task mutation rejected |
| PTC-EMP-003 | P0/M | Employee profile with limited job/skill info and editable preferences | Private personal information not in public team pages |
| PTC-EMP-004 | P0/M | Task/project activity and mention notifications | Message links honor authorization on open |
| PTC-EMP-005 | P1/F | Timesheets, leave requests, attendance, holidays and approvals | Sensitive HR access separated from PM access |
| PTC-EMP-006 | P2/F | Recruitment, onboarding/offboarding checklists, performance reviews and payroll | HR retention, policy and compliance review completed first |

### 8.3 User stories and workflow
- **US-PRJ-01:** As a project manager, I can plan delivery and assign tasks within my projects.
- **US-PRJ-02:** As an employee, I can see my own workload and update delivery progress.
- **US-PRJ-03:** As an admin, I can separate private internal tasks from approved client-facing progress.
- **WF-PRJ-01 — Delivery:** Authorized PM creates project → adds scoped members → defines milestone/task → assignee receives notification → work proceeds with comments/assets → PM marks milestone client-visible → client reviews approved deliverable → PM records acceptance/feedback → project status advances → optional approved case study is separately authored.

---
## 9. Functional requirements — client portal

### 9.1 Principles
Every client user belongs to one or more explicitly granted client organizations. Data must be scoped by both organization and project membership, and each field/file must be classified as client-visible or internal-only. The portal is **not** a read-only clone of the internal project view. Client communication must not be confused with employee private notes.

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-CLI-001 | P0/M | Client landing page with authorized project list, current milestones and recent relevant messages | Client with two organizations sees only explicitly selected/allowed resources |
| PTC-CLI-002 | P0/M | Project overview displays approved progress, due dates, deliverables and contact/PM reference | Internal comments/budgets and other projects excluded |
| PTC-CLI-003 | P0/M | Client may submit structured feedback/revision request on a visible deliverable | Feedback linked to project/deliverable and assigned for internal follow-up |
| PTC-CLI-004 | P0/M | Client may download/upload approved file types only through scoped access checks | Cross-client and expired download links denied |
| PTC-CLI-005 | P0/M | Client Admin may invite/revoke its own members within configured policy, not expand resource access beyond admin's organization | Client Admin cannot add company staff roles or access new projects by inference |
| PTC-CLI-006 | P0/M | Client sees own service requests, quotation summaries, and applicable invoice statuses | Any detailed financial document is served with explicit client ownership checks |
| PTC-CLI-007 | P0/M | Project-linked client communications and relevant notification preferences | Confidential internal messages never included in client thread |
| PTC-CLI-008 | P1/F | Client approval/signoff forms with immutable accepted version and timestamp | Client identity, document version, and approval evidence captured |
| PTC-CLI-009 | P1/F | Maintenance tickets, SLAs, recurring support subscriptions | Client sees only own support cases and entitlements |

### 9.2 Portal user stories
- **US-CLI-01:** As a client member, I want to see where my project stands without contacting the development team for every update.
- **US-CLI-02:** As a client admin, I want to invite my colleague without needing company administrator rights.
- **US-CLI-03:** As a client reviewer, I want to annotate or comment on an approved deliverable so the team can process a revision.

### 9.3 Client visibility policy
Every response to client-facing endpoints SHALL be built from a client-safe DTO/serializer with an explicit allowlist. Relevant fields may include public project name, approved description, client-facing milestone title/status, planned date, approved deliverable metadata, and publicly shareable attachments. Fields that SHALL NOT leak include internal cost/margin, salary/hourly rates, unrelated clients, secrets, technical vulnerabilities, staff HR records, private communications, unpublished source documents, and audit internals. The same rule applies to search, CSV exports, push notifications, email links, and document previews.

### 9.4 Workflow
**WF-CLI-01 — Client review:** PM marks deliverable `ready_for_client_review` and approves a client-safe attachment → authorized client receives link/notification → server verifies organization/project entitlement → client downloads, comments, or requests revision → PM receives linked issue → PM responds and reissues version → original revision/history retained. **MVP requirement:** feedback and traceability; formal contractually binding electronic approval is post-MVP.

---

## 10. Functional requirements — unified social media hub

### 10.1 Product contract
The hub gives Part-time Coder one place to compose, review, schedule and track posts for **Facebook Pages, Instagram Professional accounts, LinkedIn organization/company pages, YouTube channels, X accounts, and TikTok creator/business accounts** where authorized by each service. It must accurately distinguish between: `modeled`, `connectable`, `connected`, `publish_enabled`, `analytics_enabled`, and `manual_only`. An account being "connected" does **not** imply it is permitted to publish or to read metrics.

### 10.2 End-to-end workflow and status models
- **Campaign:** `draft`, `active`, `completed`, `archived`.
- **Content master:** `draft → in_review → approved → scheduled / publish_requested → completed` with `rejected`, `cancelled`, `archived` branches. Only authorized approvers can approve. Any material edit after approval invalidates approval and returns the changed variant to `draft` or `in_review`.
- **Platform variant:** independent text, media assets, preview, intended target account, media type, capability validation, and approval revision.
- **Publish job:** `pending → claimed → publishing → published` or `retry_scheduled`, `failed`, `needs_manual_action`, `cancelled`, `unknown_outcome`. A network timeout after sending a request can produce an **unknown outcome** that must be reconciled against provider post identifiers/history before retrying. Do not promise exactly-once network publication without provider guarantees.
- **Manual publication:** `manual_ready → instructions_viewed → confirmation_pending → manually_published / cancelled`, with optional proof URL and operator identity. "Manually published" SHALL NOT be counted as an API-confirmed publication.
- **Analytics:** per-platform/source timestamp, metric name, value, sampling window, reliability metadata, and unsupported/permission-denied state; do not present incomparable metrics as equivalent.

### 10.3 Social requirements
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-SOC-001 | P0/M | Represent all six networks via adapter registry with capabilities and support matrix | Dashboard shows supported/disabled/manual modes truthfully |
| PTC-SOC-002 | P0/M | Authorized OAuth connection where approved, account inventory, token/permission health, safe disconnect | Expired/revoked credentials detected; secrets never exposed in response/log |
| PTC-SOC-003 | P0/M | Unified composer creates a campaign and one or more independently editable platform variants | Editing Instagram caption does not mutate approved LinkedIn variant |
| PTC-SOC-004 | P0/M | Support draft, submit-for-review, approve, reject, request-change, and audit of content decisions | Creator cannot self-approve by default; approval bound to content revision |
| PTC-SOC-005 | P0/M | Calendar supports timezone-aware scheduled content, status filters, and conflict visibility | Local time converted to UTC; DST ambiguity handled by explicit zone |
| PTC-SOC-006 | P0/M | Durable scheduled jobs with deterministic identifiers, atomic claiming, capped retries, exponential backoff/jitter and reconciliation | Worker restart preserves schedule; ambiguous post not duplicated blindly |
| PTC-SOC-007 | P0/M/C | Official API publishing for each platform only when required scope, app approval, quota and account eligibility pass | Certified integration tests and known-good real account demonstration before enablement |
| PTC-SOC-008 | P0/M | Human-guided fallback with platform-ready text/media, instructions and explicit completion record | Operator can complete campaign even when API is unsupported or unapproved |
| PTC-SOC-009 | P0/M | Post-by-platform status and publication log with provider ID/URL when available, attempts, errors and next actions | One network's failure does not change other variant outcomes |
| PTC-SOC-010 | P0/M | Content validations based on dynamically maintained account/platform media and caption constraints | Invalid media rejected before scheduling where constraints are known; uncertainty displayed |
| PTC-SOC-011 | P0/M | Secure media upload and reusable asset library with platform-specific derivatives when needed | User authorized to access original/derived asset and provider upload path |
| PTC-SOC-012 | P0/M | Basic analytics display for provider-supported verified metrics; unavailable metrics marked `not_available` not zero | Correct attribution of metric source/date and no fabricated metrics |
| PTC-SOC-013 | P0/M | Marketing dashboard: drafts awaiting review, upcoming posts, failed jobs, accounts requiring action, published totals | Each tile links to filtered authorized detail list |
| PTC-SOC-014 | P0/M | Approvers can override a schedule/cancel future posts based on policy, with history | Already-published posts not represented as cancellable; external deletion out of scope |
| PTC-SOC-015 | P0/M | Budget guardrails and optional cost-warning for metered integrations | Integration can be disabled without breaking campaign drafting/history |
| PTC-SOC-016 | P1/F | Advanced campaign analytics, cross-channel performance normalization with explicit formulas, reports/export | Metric definitions documented; unsupported comparisons labeled |
| PTC-SOC-017 | P1/F | AI-assisted caption ideation, translation, alt text, hashtag suggestions under human review | AI content always editable and never self-publishes |
| PTC-SOC-018 | P2/F | Unified inbox, comment moderation, social listening and automated response suggestions | Subject to specific API permissions and privacy controls |
| PTC-SOC-019 | P2/F | Automatic A/B optimization and marketing attribution | Measured experiment methods and opt-in approved |

### 10.4 Six-platform support contract
**Every network is in the v1 data model and UI. Automated publishing, analytics, media types and scheduling are conditional on provider policy, authorization, verification and budget.** No unsupported feature may appear as working.

| Platform | Intended first-class account | MVP workflow available without approval | Conditional automation/analytics gate |
|---|---|---|---|
| Facebook | Company Page, not personal timeline | Draft, approve, calendar, copy/media/manual status | Meta app setup, Page role, approved permissions, supported Graph endpoints and rate limits |
| Instagram | Professional account (business/creator as supported) | Draft, approve, media preview, manual export/status | Appropriate Instagram API login configuration and publishing scopes; no assumption personal consumer accounts work |
| LinkedIn | Company/Organization Page | Draft, review, scheduled task or manual publishing | Eligible Page role, authorized app, organization posting permission and applicable API version |
| YouTube | Authorized channel | Video metadata draft, file selection, upload checklist, manual fallback | OAuth, API project quota/audit restrictions, verified upload/public-visibility behavior and supported upload mechanism |
| X | Company-owned authorized account | Draft, review, schedule and manual fallback | API plan/credits, post/media endpoints, access tiers and current provider billing policy |
| TikTok | Authorized professional/creator account as permitted | Video/photo assets, captions, calendar, manual workflow | Content Posting API approved scopes, creator consent, audit/visibility restrictions and upload limits |

### 10.5 Integration design and failure behavior
Each adapter SHALL expose an internal, versioned provider-neutral interface covering: `getCapabilities(account)`, `getConnectionHealth(account)`, `validateContent(variant)`, `prepareUpload(assets)`, `publish(variant, idempotencyContext)`, `lookupPublication(attempt)`, and `collectMetrics(post, range)` where available. Unsupported operations return structured `UNSUPPORTED_CAPABILITY`, not silent success. External APIs must be called only from trusted server/worker environments and only after verifying company authorization and account scope.

- **Rate limits:** honor provider headers; queue and back off, with clear retry time/status.
- **Auth expiry:** refresh only if supported; otherwise mark `needs_reauthorization` and stop repeat attempts.
- **Deletion/revocation:** disconnection immediately prevents future calls and safely cancels/reclassifies pending jobs; histories remain per retention policy.
- **Unknown outcome:** reconcile remote post or require operator confirmation before retry; never assume timeout means failure.
- **Content changes:** approval must be reobtained after changing approved text, target, media, or schedule where policy requires.
- **Media privacy:** temporary source URLs and upload credentials expire; URLs must not reveal client files.
- **Multiple targets:** one account failure must not roll back successful publications to other platforms.
- **Account health:** capability may degrade at runtime; surface the specific permission, quota, policy, or provider cause.

### 10.6 Social user stories
- **US-SOC-01:** As a content creator, I can produce a campaign once and tailor each platform's variant so I do not rewrite everything externally.
- **US-SOC-02:** As a marketing manager, I can approve the exact version that will be scheduled so unreviewed edits are not published.
- **US-SOC-03:** As an operator, I can complete a planned post manually if its API is unavailable and record a verifiable outcome.
- **US-SOC-04:** As the owner, I can tell whether a published count reflects provider-confirmed posts or staff-reported manual posts.

### 10.7 Social workflow test scenarios
**WF-SOC-01 — Happy path:** Creator drafts campaign for Facebook, Instagram and LinkedIn → variants validated → submits → manager approves → scheduling stored in UTC → worker claims eligible jobs → each adapter publishes if authorized → provider ID/URL captured → metrics collected where allowed → audit and UI updated.

**WF-SOC-02 — Partial failure:** Facebook posts successfully; Instagram permission expires; LinkedIn API returns temporary rate limit → Facebook remains `published`; Instagram becomes `needs_reauthorization`; LinkedIn becomes `retry_scheduled` → owner sees a single campaign with three independent outcomes.

**WF-SOC-03 — No API approval:** Creator prepares TikTok variant → UI shows `manual_only` with explanation → approved assets/caption become ready for human publishing → operator completes on official platform and stores URL if available → status becomes `manually_published` with actor and timestamp, never provider-confirmed.

**WF-SOC-04 — Uncertain network response:** Worker sends YouTube/other provider request; connection drops before confirmation → job becomes `unknown_outcome` → reconciliation checks provider job/resource ID where possible → only safe retry after non-publication confirmed or human decision logged. This must be a release-gate integration test.

---

## 11. Functional requirements — quotations, invoices, finance, HR and operations

### 11.1 Finance MVP vs future
MVP handles operational sales documents and status tracking, **not** a complete accounting ledger, payroll system, tax engine, or automated payment reconciliation.

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-FIN-001 | P0/M | Currency-aware quotation records including subtotal, optional discount/tax fields, total, status, expiry and owner | Money stored in integer minor units or exact decimal with currency precision; no floating-point drift |
| PTC-FIN-002 | P0/M | Basic invoice records linked to client/project, invoice number, issue/due dates, currency and statuses (`draft`, `issued`, `partially_paid`, `paid`, `void`, `overdue`) | Unique invoice number within company scope; server enforces allowed transitions |
| PTC-FIN-003 | P0/M | Record manual payments and remaining invoice balance with audit trail | Overpayment/duplicate payment handling explicit; balance reconciles with recorded payments |
| PTC-FIN-004 | P0/M | Client can view/download only its own issued financial documents when explicitly allowed | Another client's invoice ID yields no content |
| PTC-FIN-005 | P0/M | Support SAR, BDT, USD; store transaction currency, exchange-rate source and timestamp if conversion used | Historical totals not silently recalculated after rate changes |
| PTC-FIN-006 | P0/M | Financial views require dedicated grants; internal costs/margins not shown to client or general employee | Permission matrix tests pass |
| PTC-FIN-007 | P1/F | Business expenses, cost categories, vendor registry, profit-margin reporting | Expense attachments protected and balances reproducible |
| PTC-FIN-008 | P1/F | Payment-gateway integration, webhook verification, refunds, recurring billing | Provider settlement reconciliation and secure webhook processing |
| PTC-FIN-009 | P2/F | Payroll, taxation, accounting exports, jurisdiction-specific compliant invoicing | Requires qualified legal/accounting review and approval |

### 11.2 Company operations extensions
- **P1/F — HR:** basic employee directory, leaves, attendance, holidays, recruiting intake, performance; no salary/payslip data in basic employee profiles.
- **P1/F — Customer support:** ticket creation, priorities, attachments, assignment, linked project/service, escalation.
- **P2/F — Enterprise:** procurement, device inventory, SLA reporting, formal approvals, automation builder.

---

## 12. Functional requirements — collaboration, notification, analytics

### 12.1 Communication
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-COM-001 | P0/M | Project/task comments with explicit visibility and author/time | Client-visible and internal-only threads separated in API serialization |
| PTC-COM-002 | P0/M | In-app notifications for invitations, task assignments, client feedback, review approvals and social publish failures | Notifications delivered to authorized recipients with valid scoped URLs |
| PTC-COM-003 | P0/M | Email notifications for high-value events with templates, rate limits and retry monitoring | Delivery failure logged and does not corrupt business state |
| PTC-COM-004 | P0/M | Per-user read/unread and basic opt-out preferences for non-essential messages | Security/transactional notifications follow applicable policy |
| PTC-COM-005 | P1/F | Digest emails, mentions, escalation reminders and configurable notification rules | Duplicate prevention and consent policy respected |
| PTC-COM-006 | P2/F | Full live internal chat or video meetings integration | Independent privacy and cost assessment |

### 12.2 Metrics and reporting
The dashboard SHALL state date range, timezone, counting method, source and update recency. Metrics must distinguish **records in the platform** from **verified business events**. Examples: `published_posts_provider_confirmed` and `published_posts_manual_reported` are separate measures.

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-ANA-001 | P0/M | Admin overview: new/open leads, projects by status, overdue tasks, pending approvals, publishing failures | Widget numbers reconcile to scoped source lists |
| PTC-ANA-002 | P0/M | Project workspace: my tasks, due soon, milestone completion, project activity | Data excludes unassigned/unauthorized work |
| PTC-ANA-003 | P0/M | Marketing metrics: planned, approved, attempted, API-confirmed, manually reported and failed posts | Publish counts never collapse unknown outcomes into success |
| PTC-ANA-004 | P0/M | Client dashboard: approved milestone progress, open client feedback, deliverables | Data derived only from client-visible records |
| PTC-ANA-005 | P0/M | Finance: invoices by status and outstanding balances for authorized finance users | Reports reconcile to financial records |
| PTC-ANA-006 | P0/M | Instrument analytics/data quality diagnostics and metric timestamps | Empty/unsupported/late data shown distinctly from numeric zero |
| PTC-ANA-007 | P1/F | Scheduled exports, campaign charts, lead conversion funnel, project profitability reports | Export follows identical authorization filters |
| PTC-ANA-008 | P2/F | AI-generated management summaries and forecasts with source attribution | No fabricated company figures; reviewable inputs |

### 12.3 Initial KPIs and definitions
| KPI | Definition | Proposed early target (validate after baseline) |
|---|---|---|
| Lead capture completeness | Valid inquiries saved / accepted form submissions | ≥ 99.5% excluding rejected spam/invalid input |
| Quote-to-project traceability | Converted/won leads with linked project and client | 100% of conversions via application workflow |
| Project task accountability | Open tasks assigned to an active owner / all open tasks | ≥ 95% |
| Client isolation incidents | Confirmed unauthorized cross-client disclosure | **0** |
| On-time job execution | Eligible publish jobs initiated within schedule tolerance / eligible jobs, excluding provider outage | ≥ 95% within 5 min, measured after worker and host SLA validation |
| Publication record integrity | API-confirmed posts carrying provider reference or evidence | 100% where provider supplies an ID; unknown outcomes explicitly flagged |
| Content review compliance | Scheduled posts with valid current approval revision / scheduled posts | 100% |
| Backup drill success | Latest restorable backup validates in isolated environment | 100% of scheduled drill runs |
| Form-to-lead visibility | Successful submissions appearing in admin work queue | ≥ 99.5% |
| Accessibility | Core journeys meet targeted WCAG 2.2 AA criteria | 100% of tested blocking success criteria |

These are **product targets**, not existing performance claims. Targets shall be adjusted only via documented review, not quietly softened after failing testing.

---

## 13. Security, privacy, data boundaries and retention

### 13.1 Mandatory security requirements
| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-SEC-001 | P0/M | Deny-by-default authorization enforced server-side on every private route/action and on background jobs | Horizontal/vertical privilege escalation automated tests pass |
| PTC-SEC-002 | P0/M | Client-org, project, department and record visibility checks at query, service and serialization boundaries | Cross-tenant/client access tests cover reads, writes, files, search and exports |
| PTC-SEC-003 | P0/M | MFA for privileged identities, limited sessions, verified logout/session invalidation policy | Lost/expired/suspended account cannot perform privileged action |
| PTC-SEC-004 | P0/M | Secrets and OAuth tokens encrypted at rest, restricted in memory/access, redacted from logs, rotated where possible | Secret-scanning and log-review checks detect no plaintext tokens |
| PTC-SEC-005 | P0/M | Structured audit log for authentication changes, permission grants, financial changes, publication approvals, social account changes, client visibility and deletion | Event captures actor, action, scope, subject, timestamp, sanitized metadata |
| PTC-SEC-006 | P0/M | Input validation, safe HTML rendering, CSRF/session protection appropriate to architecture, secure headers and output encoding | XSS, injection, CSRF and unsafe redirect tests pass |
| PTC-SEC-007 | P0/M | Rate limits, abuse prevention, file type/size validation and server-side upload authorization | Excessive/invalid submissions safely rejected with actionable errors |
| PTC-SEC-008 | P0/M | Protected storage access with expiring signed URLs or proxy authorization for private files | Direct stale/cross-client URLs unusable |
| PTC-SEC-009 | P0/M | Logging and observability redact PII, client files, passwords, access tokens and sensitive payloads | Automated checks plus manual inspection of representative traces |
| PTC-SEC-010 | P0/M | Documented incident response, emergency account/token revocation, backup recovery and owner access restoration | Tabletop or drill evidence before production |
| PTC-SEC-011 | P0/M | Controlled data export/deletion and documented retention policy | Only authorized export can access protected data; deletion audited |
| PTC-SEC-012 | P1/F | Periodic delegated access reviews, advanced anomaly detection, security event automation | Access reports support approval and revocation |

### 13.2 Data classification
| Class | Examples | Default handling |
|---|---|---|
| Public | Published services, approved case studies, public articles | Public, cached/indexable according to policy |
| Internal | Task discussions, internal plans, employee project notes | Authenticated company staff with scoped permissions |
| Client-confidential | Deliverables, requirements, contracts, customer messages | Authorized client org and assigned internal staff only |
| Restricted | Employee HR data, financial rates/margins, identity evidence | Dedicated business permissions, stronger audit |
| Secret | OAuth tokens, private keys, database credentials | Server-only, encrypted, rotated; never user-facing |

### 13.3 Core ownership invariants
- Every client-specific project has a canonical `clientOrganizationId` unless it is an explicit internal project.
- Every client portal query scopes organization **and** effective membership, not just an untrusted request parameter.
- Marketing/social accounts belong to the single operating company, not to arbitrary clients, until an explicit new product decision is approved.
- A media asset has owner domain, visibility, allowed resource references and retention policy; possession of a URL is never the sole authorization evidence for private files.
- Audit logs cannot be modified by standard administrators and do not become publicly searchable.
- Employees do not gain client privileges by assignment unless the specific client-facing scope is granted.
- An unpublished CMS record is not equivalent to a publicly visible project or published post.

### 13.4 Privacy and retention policy requirements
**PTC-DATA-001 (P0/M):** Data inventory must document personal-data types, collection purpose, lawful handling basis as applicable, internal access, storage provider, retention, and deletion/archival procedure. **PTC-DATA-002 (P0/M):** Define retention classes and lifecycle for leads, client content, invoices, employee details, audit events, OAuth credentials, published content and backup copies before go-live. **PTC-DATA-003 (P0/M):** Provide client/user request workflow for access, correction and deletion subject to contracts, lawful retention and identity verification. **PTC-DATA-004 (P0/M):** Backups are encrypted, stored independently, rotated and restorable; recovery tests executed. **PTC-DATA-005 (P1/F):** Self-service data export and programmable retention rules.

**Jurisdiction disclaimer:** Legal obligations regarding electronic invoices, consent, cookie tracking, cross-border transfer, privacy disclosures and workforce data must be reviewed for the business's actual legal domicile and countries served. This PRD makes no claim of automatic statutory compliance.

### 13.5 Security user stories
- **US-SEC-01:** As a client, I never see confidential records belonging to a different client even if I alter an ID in a URL.
- **US-SEC-02:** As an owner, I can revoke employee access promptly after offboarding and verify the result.
- **US-SEC-03:** As a reviewer, I can see who approved a social campaign and what precise revision was published.

---
## 14. Nonfunctional product requirements and service targets

The following are **proposed MVP service objectives** to be confirmed against the chosen commercial-use-compatible hosting configuration and expected traffic. They are acceptance goals, not promises of provider uptime beyond Part-time Coder's control.

| ID | Area | P0/M requirement | Measurement / acceptance |
|---|---|---|---|
| PTC-NFR-001 | Responsiveness | Mobile-first public pages; all critical dashboards usable on modern phones/tablets/desktops | Test at 360px, 768px, 1280px, 1920px; no horizontal overflow for essential workflows |
| PTC-NFR-002 | Accessibility | WCAG 2.2 AA target across core routes: keyboard operability, focus, contrast, semantics, labels, error states and reduced motion | Automated scans plus manual keyboard/screen-reader checks; release-blocking failures resolved |
| PTC-NFR-003 | Public performance | Target Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on supported real-user conditions | RUM or Lighthouse field/lab distinction explicitly recorded; images/media optimized |
| PTC-NFR-004 | API latency | At expected initial traffic, p95 non-upload interactive reads ≤ 500 ms, non-upload mutations ≤ 1 s excluding known third-party waits | Load test records concurrency, dataset, region and environment; investigate deviations |
| PTC-NFR-005 | Availability | Initial operational objective ≥ 99.5% monthly for app-owned availability, excluding defined provider outages/maintenance | Health checks, incident log and monthly calculation |
| PTC-NFR-006 | Data durability | Recoverable business data with proposed RPO ≤ 24 h and RTO ≤ 8 h at launch, subject to tested backup infrastructure | Restore rehearsal meets measured recovery targets or launch is blocked/escalated |
| PTC-NFR-007 | Scheduling | Persist posts across restarts; eligible scheduled job begins within 5 minutes of target time in healthy infrastructure | Simulated restart, clock/timezone and queue backlog tests; provider throttling reported separately |
| PTC-NFR-008 | Internationalization | All UI text externalized, locale-aware dates/numbers/currency, language config prepared for `en` and `bn` | No hardcoded display strings in audited UI components; English functional |
| PTC-NFR-009 | Security quality | No unresolved Critical/High security vulnerability judged exploitable in production; dependency and secret scanning enabled | Security gate report and risk sign-off |
| PTC-NFR-010 | Observability | Central structured app/worker logs; correlation IDs; health and publish-job dashboards; alerting for critical failures | Induce controlled error and prove traceability/alert route |
| PTC-NFR-011 | Testability | Unit, integration, permission/negative-path and E2E tests for P0 workflows; no dependency on real paid external APIs for CI | Deterministic test fixtures and mock adapters in CI; separate live sandbox check |
| PTC-NFR-012 | Portability | No permanent commitment to one deployment vendor; documented environment variables, build and restore | Rebuild/deploy in clean environment from documented repo artifacts |
| PTC-NFR-013 | Accessibility of data | Loading, empty, error and unauthorized states distinct; pending work not silently lost | UX acceptance journeys show recovery and persistence |
| PTC-NFR-014 | SEO/discoverability | Public pages have crawl policy, metadata and fast structured navigation | Sitemap and robots checked; nonpublic URLs blocked from indexing and auth enforced |
| PTC-NFR-015 | Cost sustainability | Deployment budget, API usage and storage consumption observable; configurable integration disable switches | Cost review reports monthly spend and projected overage |
| PTC-NFR-016 | Browser support | Current stable Chrome, Firefox, Safari and Edge, plus modern iOS/Android browsers | Smoke testing matrix captures supported versions at release |

**Capacity baseline assumption (for test planning, not a hard business ceiling):** 25 internal staff, 100 client users, 50 simultaneous authenticated sessions, 100 active projects, 10,000 tasks, 5,000 media records, 500 monthly campaign variants and 100 public quote requests/day. Design indexes and query plans for these initial figures, verify with representative fixtures, and revisit when actual data exceeds assumptions. Capacity targets do not imply social-provider quotas.

### 14.1 System behavior on degraded dependencies
- If **Firebase Authentication** is unavailable: existing valid sessions may remain usable only to the degree safely verifiable; otherwise private mutation is denied, never bypassed.
- If **MongoDB** is unavailable: forms should fail explicitly with retry guidance; no false success toast; publishing worker pauses safely.
- If **email provider** is unavailable: persist notification job and retry within policy; business transaction remains recorded.
- If **social API** is unavailable: each post shows queued/retry/manual action; no automatic success claim.
- If **worker** is offline: scheduling can still be entered, but health/status surfaces warn and overdue jobs are recovered upon return.
- If **media storage** fails: pending assets are not marked successfully uploaded; publishing requiring them is blocked.

---

### 14.2 Operational readiness requirements

| ID | Priority/Release | Requirement | Acceptance evidence |
|---|---|---|---|
| PTC-OPS-001 | P0/M | Maintain separate development, test/staging and production configurations, with independently restricted secrets | Production credentials absent from test builds and CI logs |
| PTC-OPS-002 | P0/M | Automated CI gates for lint, TypeScript type checks, unit/integration tests, build, secret detection and dependency checks | Pull request fails visibly when a blocking check fails |
| PTC-OPS-003 | P0/M | Production deployment and rollback playbook, with migration execution/verification procedures | Operator can restore previous release without corrupting application data |
| PTC-OPS-004 | P0/M | Worker liveness/readiness, queue lag alerts, failed-job dashboard and supervised automatic restart | Kill worker during test; alert fires and pending jobs recover safely |
| PTC-OPS-005 | P0/M | Database and media backup/export schedule with independent offsite destination and tested recovery | Restore rehearsal results logged with actual RPO and RTO |
| PTC-OPS-006 | P0/M | Incident severity policy, incident owner, emergency contact path and documented response steps | Tabletop exercise and postmortem template completed |
| PTC-OPS-007 | P0/M | Cost guardrails for hosting, API calls, messaging and storage with disabled/paused behavior when limits are reached | Artificial threshold triggers alert and safe degradation rather than accidental overspend |
| PTC-OPS-008 | P0/M | Operational runbooks for OAuth reauthorization, failed publishes, account offboarding, credential rotation and client data requests | Authorized operator follows rehearsed procedures without needing source-code edits |

---

## 15. External integrations and licensing/budget gates

### 15.1 Integration register
| ID | Integration | MVP purpose | Gate / fallback |
|---|---|---|---|
| PTC-INT-001 | Firebase Authentication | Identity, login, account verification | Server SDK/API validity test; internal role DB remains authority |
| PTC-INT-002 | MongoDB Atlas | Primary business database | Capacity/backup plan validated; independent restore procedure |
| PTC-INT-003 | Commercial-use-compatible Node host | Next.js web and independently supervised worker | Cost, persistence, scheduling, TLS and operational ownership approved |
| PTC-INT-004 | Media storage provider | Public and protected images/files/video references | Permission-aware asset delivery and lifecycle policies |
| PTC-INT-005 | Email provider (SMTP/transactional) | Invitations, lead acknowledgments, important notifications | Verified domain and sending limits; retry queue |
| PTC-INT-006 | Meta — Facebook | Page posts and available insights | Developer app, official permissions and Page authorization; manual fallback |
| PTC-INT-007 | Meta — Instagram | Professional account publishing/insights | Correct API login path, professional eligibility, approved scopes; manual fallback |
| PTC-INT-008 | LinkedIn API | Organization posts, available metrics | Page role, authorized app and version/scopes; manual fallback |
| PTC-INT-009 | YouTube Data/Analytics APIs | Upload metadata/video and metrics when approved | OAuth, quota and upload visibility audit; manual fallback |
| PTC-INT-010 | X API | Posts/media and selected metrics when funded/authorized | Credit-based charges/access validation; manual fallback |
| PTC-INT-011 | TikTok Content Posting API | Authorized photo/video sharing or direct posting | Approved scopes, creator consent, audit/visibility restrictions; manual fallback |
| PTC-INT-012 | GitHub | Source control, CI/CD, optional public repo links | No broad repository OAuth required for MVP; deeper PM linkage is future |
| PTC-INT-013 | Error monitoring | Operational error tracking | Redaction, privacy policy and free/paid allowance checked |
| PTC-INT-014 | AI provider | Post drafting/summarization (future) | Consent, costs, data processing and owner approval |
| PTC-INT-015 | Payment gateway | Online collections (future) | Company legal eligibility, PCI scope and webhook validation |

### 15.2 Provider-policy reality check (14 October 2026)
Provider access is a dynamic operational dependency. Before enabling each adapter, engineering must recheck the *current* official docs and developer dashboard and record the result in a dated integration ADR. Key verification references:

- **Vercel commercial restrictions:** https://vercel.com/docs/plans/hobby ; https://vercel.com/docs/limits/fair-use-guidelines — Hobby is for non-commercial personal use; choose a suitable commercial plan/host for production.
- **Meta Instagram professional-account integration:** https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api — provider-maintained API collection documents professional account/scope constraints.
- **LinkedIn organization posting:** https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api — app permissions, Page roles, versioning and media differences.
- **YouTube uploads and privacy checks:** https://developers.google.com/youtube/v3/docs/videos and https://developers.google.com/youtube/v3/docs/videos/insert — validate upload visibility, OAuth, API quota and audits for the specific developer project.
- **X developer billing:** https://developer.x.com/ — consumption/credits may impose direct usage costs.
- **TikTok posting and audit:** https://developers.tiktok.com/docs/en/content-posting-api-get-started — unaudited apps have restricted public posting; explicit creator authorization and audit are material.
- **MongoDB Atlas free-tier backups:** https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/ — Atlas Free does not provide built-in managed backups; plan independent `mongodump`/restore or budget for an eligible tier.

The PRD does **not** warrant that any external platform will approve Part-time Coder's application. Provider policies supersede proposed integration behavior. No scraping, credential-sharing workaround, simulated API posting, or unauthorized automation may be substituted to bypass these requirements.

### 15.3 Commercial cost framework
The owner will approve an initial monthly operating envelope during TRD/deployment planning. Track at least: (a) web hosting and worker runtime, (b) MongoDB tier and backup destination, (c) object storage/bandwidth, (d) transactional email, (e) error monitoring, (f) domain/DNS, (g) social API consumption/credits, and (h) optional AI usage. Zero-dollar developer tiers are not presumed to allow commercial workloads. Production launch requires a credible hosting budget and cost-alert thresholds.

---

## 16. Data domain overview (not the detailed backend schema)

### 16.1 Core entities
| Domain | Entity examples | Important relations / boundaries |
|---|---|---|
| Identity | User, AuthIdentity, Invitation, RoleGrant, SessionRecord | Firebase `uid` links to internal user; roles never trusted from public input |
| Internal company | Company, Department, EmployeeProfile, CompanySetting | Exactly one internal operating company; departments do not equal tenant boundaries |
| Clients | ClientOrganization, ClientMembership, ClientContact | Separate organizations; only authorized membership unlocks client records |
| Sales | Lead, ServiceRequest, Quotation, LeadActivity | Lead may become client/project through controlled conversion |
| Delivery | Project, ProjectMembership, Task, Milestone, Deliverable, Feedback | Project references client org where client-owned; item-level visibility controls |
| Content | Service, Product, CaseStudy, Article, ContentRevision, MediaAsset | Published CMS content decoupled from private project source |
| Marketing | SocialAccount, Campaign, PostVariant, Approval, PublishJob, PublishAttempt, MetricSnapshot | Each publish variant targets one authorized platform/account; per-attempt logs retained |
| Finance | Invoice, PaymentRecord, ExchangeRateSnapshot | Currency values exact; client-safe invoice presentation separate from internal fields |
| Collaboration | Comment, Notification, EmailJob, ActivityEvent | Messages have explicit audience/privacy classification |
| Governance | AuditEvent, IntegrationCredentialReference, FeatureFlag, RetentionPolicy | Credential payload never exposed to ordinary database readers or API DTOs |

### 16.2 Modeling invariants for later `BACKEND_SCHEMA.md`
- Every entity has immutable identifier and created/updated metadata; status transitions are validated.
- Business identifiers and slugs are unique at their intended scope; display names may repeat.
- `userId` and `clientOrganizationId` are never inferred from unsanitized request bodies when authenticated context already determines them.
- Relationship cardinality and ownership must be explicitly specified (employee↔department, user↔client-org, project↔client, project↔staff, post↔campaign, post↔account).
- Large media is stored outside MongoDB; only metadata, references, checksums and access controls in the database.
- Content revision and social approval records are version-specific, not mutable global flags.
- `PublishAttempt` retains provider request correlation and reconciliation state; retries do not overwrite prior attempts.
- Soft-delete is applied only where retention/restore use cases justify it; deletion and anonymization behavior documented by domain.
- Money uses fixed precision and explicit ISO currency; business timestamps are UTC instants plus, where relevant, original IANA timezone.
- Indexes must protect uniqueness and efficiently query by `clientOrganizationId`, user membership, project, status, due date and publish schedule.

### 16.3 API contract requirements
**PTC-GOV-001 (P0/M):** All private REST APIs are documented under `/api/v1`, use consistent HTTP statuses, validate input schemas, and return structured safe errors (with a correlation ID). **PTC-GOV-002 (P0/M):** Collection endpoints provide stable pagination, scoped filters, sorting where useful, and avoid unbounded reads. **PTC-GOV-003 (P0/M):** Sensitive mutations support idempotency keys or optimistic concurrency where needed (lead conversion, payment recording, publish dispatch, content approval). **PTC-GOV-004 (P0/M):** APIs provide versioned client-safe DTOs and never expose database documents or secrets directly. **PTC-GOV-005 (P0/M):** API changes requiring public/frontend consumers have contract-test coverage and documented compatibility policy.

---

## 17. MVP release plan and phased roadmap

Phase names are sequencing boundaries, not fixed-date delivery commitments. Every phase has a documented gate, successful tests and owner approval before dependent work begins.

| Phase | Goal | Must-have outputs | Exit gate |
|---|---|---|---|
| Phase 0 — Discovery/Foundation | Repository, conventions, diagrams, auth/security skeleton, CI, hosting feasibility | Monorepo, decision log, env template, threat-model draft, smoke CI, brand tokens | **G0:** reproducible local build, lint/typecheck/test pipeline, accepted core architecture |
| Phase 1 — Public + CMS | Professional discoverable site and owned-content management | Homepage/services/products/portfolio/blog, basic CMS, inquiry forms, SEO | **G1:** editors publish securely; visitor inquiry saved and visible |
| Phase 2 — Identity + RBAC | Secure staff, user and client access with permission boundaries | Firebase server auth, invites, multi-role grants, protected routes, audit | **G2:** cross-role and cross-client access tests pass; owner invariant verified |
| Phase 3 — CRM + Delivery | Lead conversion and project/task/milestone workflow | CRM, client records, projects, tasks, documents, employee workspace | **G3:** visitor lead converts to project; employee updates authorized task |
| Phase 4 — Client Portal | Authorized client visibility and collaboration | Client project view, deliverables, feedback, notifications, quotation/invoice summaries | **G4:** client review flow passes negative data-isolation tests |
| Phase 5 — Social Hub | Unified creation, approvals, scheduling, adapter/fallback and supported publishing | Six adapters in registry, social account health, creator/reviewer UI, worker, retries/manual flows | **G5:** simulated + approved provider scenarios pass; no duplicate on unknown outcome |
| Phase 6 — Finance/Reporting | Operational records and coherent dashboards | Quote and invoice records, manual payment status, KPIs, owner overview | **G6:** finance math, privacy and reports reconcile |
| Phase 7 — Production Hardening | Secure, monitored, recoverable MVP | E2E, accessibility, load, penetration-focused negative tests, backups, runbooks, domain and hosting | **G7:** all P0/M requirements, legal/provider blockers, and drills signed off |
| Post-MVP — Growth | Expand based on usage | Advanced HR, support, GitHub sync, AI, deeper analytics, payments, Bangla translation | Separately scoped and approved |

**Execution note:** Some underlying foundations (auth/authorization and CMS permission guards) must be implemented before their feature UI is public. Phase labels do not prohibit necessary dependency work across phases. The implementation plan must sequence dependencies rather than blindly force waterfall implementation.

### 17.1 MVP functional minimum (three complete outcomes)
**Outcome A — Public conversion:** published company presentation → quote request → assigned lead → basic quotation → client/project conversion.

**Outcome B — Delivery:** authorized project and employee assignment → task progress → client-safe milestone/deliverable → feedback → recorded completion.

**Outcome C — Social management:** creator drafts six-network campaign where desired → editor/manager review → schedule UTC posts → publish through authorized adapters OR present manual workflow → record verified/manual/error statuses → display supported metrics and failures.

### 17.2 Explicitly excluded from MVP
SaaS licensing/reselling of company platform; public multitenancy for third-party agencies; payroll; tax engine; comprehensive accounting; live omnichannel inbox; automatic social DM replies; social scraping; unsupported publishing through unofficial automation; advanced GitHub project sync; employee performance scoring; advanced AI autonomy; online payment checkout; automated legally binding e-signatures; recruitment applicant tracking; complete Bangla localization; expensive video transcoding service; internal real-time messaging suite; and native mobile applications.

---

## 18. Master user journeys and acceptance tests

### 18.1 Acceptance test format
Each test must record: Test ID, associated requirement IDs, persona, initial data and permissions, action sequence, expected result, negative cases, test evidence (URL/screenshot/log/test name), environment, and result. AI agents shall not claim pass without executing the test or explicitly marking it unverified.

| Test ID | End-to-end scenario | Requirement mapping | Expected pass condition |
|---|---|---|---|
| AT-001 | Guest browses services and requests quote | PTC-PUB-001/003/007, PTC-CRM-001 | Valid submission creates lead; error/abuse states safe |
| AT-002 | Admin publishes and unpublishes case study | PTC-CMS-001/002/006, PTC-PUB-004 | Public only sees approved content; confidential project fields never included |
| AT-003 | Public registrant tries to assign privileged role | PTC-IAM-002/003, PTC-SEC-001 | Escalation blocked and recorded |
| AT-004 | Staff invitation expires and client invitation reused | PTC-IAM-004 | Both attempts rejected after invalidation |
| AT-005 | Owner tries to deactivate last owner | PTC-IAM-008 | Rejected with audit event |
| AT-006 | Lead converts to client and project twice | PTC-CRM-004, PTC-GOV-003 | Exactly one linked conversion outcome under same idempotency key |
| AT-007 | Project manager assigns and employee updates task | PTC-PRJ-001/002/005, PTC-EMP-001/002 | Correct scope updates; unassigned employee denied |
| AT-008 | Client accesses another client's project ID | PTC-CLI-001/002, PTC-SEC-002 | Unauthorized response; no data in body, file, export or notification |
| AT-009 | Client feedback triggers internal action | PTC-CLI-003/007, PTC-COM-002 | Feedback linked; PM receives scoped notification |
| AT-010 | Creator edits approved social content | PTC-SOC-003/004 | Approval invalidated; cannot publish until reapproved |
| AT-011 | Schedule post for different timezones | PTC-SOC-005/006, PTC-NFR-007 | Correct UTC instant; DST ambiguity explicit; no duplicate dispatch |
| AT-012 | Provider A success; provider B revoked; provider C throttled | PTC-SOC-007/009, PTC-SOC-006 | Independent states; safe retry, clear next action |
| AT-013 | Worker loses connection after publish attempt | PTC-SOC-006/009 | Unknown outcome reconciled; no blind duplicate |
| AT-014 | TikTok/X API disabled while campaign remains active | PTC-SOC-001/008/015 | Manual fallback available, visibly not API-confirmed |
| AT-015 | Client queries invoice owned by another client | PTC-FIN-004/006, PTC-SEC-002 | Access denied without sensitive metadata |
| AT-016 | Currency and manual payment reconciliation | PTC-FIN-001/002/003/005 | Decimal precision, correct balances, immutable audit trail |
| AT-017 | Restore most recent backup to isolated environment | PTC-DATA-004, PTC-NFR-006, PTC-SEC-010 | Recovery verified without leaking production credentials |
| AT-018 | Mobile and accessibility core journeys | PTC-NFR-001/002/013 | Keyboard, labels, focus and mobile task success |
| AT-019 | Suspended employee attempts API and file access | PTC-IAM-006, PTC-SEC-001/008 | Denied consistently after suspension |
| AT-020 | Dashboards show correct counts and missing metrics | PTC-ANA-001/003/006 | Aggregates reconcile; unsupported/unknown not reported as zero |
| AT-021 | Secret scanner and logs inspect provider failures | PTC-SEC-004/009 | No sensitive credentials in logs or frontend |
| AT-022 | Operational dependency failure | PTC-NFR-010, PTC-INT-003, PTC-SOC-006 | Failures are observable, queue recoverable, never silently successful |

### 18.2 Required negative tests by domain
- **Auth:** unauthenticated requests, expired sessions, disabled accounts, revoked roles, forged requests, stolen invitation tokens, invalid email verification.
- **Client:** changing IDs in URLs, search/filter injections, CSV/export links, file signed URL reuse, shared clients with multiple projects, revoked membership.
- **CMS:** preview token guessed/reused, archived content inadvertently cached, unsafe HTML/script payload, malformed slugs.
- **Social:** invalid OAuth, token refresh failure, API quota exhaustion, duplicate cron trigger, worker crash, network timeout after provider acceptance, unauthorized approver, canceled schedule after job claim.
- **Finance:** missing currency, non-decimal-safe amounts, negative totals beyond policy, payment duplicate, editing issued invoice without reversal/versioning, cross-client exposure.
- **Availability:** database restart, email outage, storage outage, zero worker processes, stale queue locks, failed restore.

### 18.3 Product definition of done
A P0 requirement is **Done** only when: feature implemented; user-facing states complete; authorization/ownership checked; data validated; tests written and executed; audit/observability present where relevant; documentation and requirement trace updated; accessibility considered; cost and provider limitations noted; migration/rollback documented if necessary; changes committed with clear conventional message; and manual dependencies explicitly described. A feature requiring external approval may be **Integration Blocked — Fallback Ready**, but it must never be labeled **Fully Integrated** without live evidence.

---

## 19. Dependencies, risks and mitigation plan

### 19.1 Dependency register
| ID | Dependency | Owner / decision needed | Impact if late |
|---|---|---|---|
| DEP-001 | Registered domain, company contact, approved identity and brand assets | Owner | Cannot complete production brand/legal contact surfaces |
| DEP-002 | Firebase project, authorized domains, production service credentials | Owner + engineering | Login and invitations blocked |
| DEP-003 | MongoDB production project/network credentials and backup destination | Engineering | Data persistence and recoverability blocked |
| DEP-004 | Approved compliant hosting plan and deployment access | Owner | Production launch blocked |
| DEP-005 | Email sending domain verification and provider credentials | Owner/engineering | Invitations and transactional notices impaired |
| DEP-006 | Meta app + Page/professional account permissions | Marketing owner | Facebook/Instagram auto-post gated; manual workflow available |
| DEP-007 | LinkedIn organization authorization | Page admin | LinkedIn auto-post gated |
| DEP-008 | Google Cloud OAuth/API project, channel authorization and upload validation | Channel owner | YouTube auto-upload gated |
| DEP-009 | X API credits/account access | Owner | X auto-post gated or costs money |
| DEP-010 | TikTok app scope, user authorization and audit | Owner | TikTok public auto-post gated |
| DEP-011 | Approved privacy/terms, invoice policy, retention settings | Owner + qualified reviewer | Production legal/financial publication blocked |
| DEP-012 | Project and media samples cleared for public sharing | Owner/clients | Portfolio publication limited to safe content |

### 19.2 Risk register
| Risk ID | Risk | Impact / likelihood | Mitigation and acceptance strategy |
|---|---|---|---|
| RSK-001 | Social API permission or audit denied | High / High | Per-network flags, manual fallback, no hard API promises |
| RSK-002 | Commercial infrastructure exceeds free-tier limits | High / Medium | Compliant cost envelope, usage alerts, lightweight architecture |
| RSK-003 | Duplicate social publication after timeout | High / Medium | Provider reconciliation, stable request identifiers, unknown-outcome state, manual hold |
| RSK-004 | Client-to-client data disclosure | Critical / Medium | Scoped queries/DTOs, authorization tests, external security review before launch |
| RSK-005 | Compromised OAuth credentials | Critical / Medium | Encrypted tokens, least scopes, rotation, audit and disconnect |
| RSK-006 | Lost data on a free database tier | High / Medium | Independently tested backups and restoration; budget upgrade when needed |
| RSK-007 | Scope creep from enterprise features | High / High | MVP list, change-control ADR, phase-gate discipline |
| RSK-008 | Inconsistent metric definitions across social providers | Medium / High | Source-specific metrics, named dimensions and unsupported markers |
| RSK-009 | Performance deteriorates from media-heavy content | Medium / Medium | CDN/optimized media, upload boundaries, CWV testing |
| RSK-010 | Client expectations exceed portal scope | Medium / Medium | Clear client-facing status and approval semantics |
| RSK-011 | Unclear legal/privacy/tax obligations | High / Medium | Jurisdiction review, configurable document policies, no compliance claims |
| RSK-012 | AI-generated code diverges across packages/docs | High / High | Authoritative docs, code review, gates, conventional commits and requirement IDs |
| RSK-013 | Single background worker stopped indefinitely | High / Medium | Supervision, heartbeat alert, backlog monitor and recovery test |
| RSK-014 | Employee offboarding leaves residual access | Critical / Medium | Deactivation procedure, session revocation, scoped credential audit |

### 19.3 No-go conditions
Production is blocked if: (1) any confirmed cross-client leak remains; (2) last-owner recovery is unsafe; (3) publish jobs can blindly duplicate on unknown outcome; (4) production has no tested backup recovery; (5) commercial hosting violates provider terms; (6) provider tokens can be read by unauthorized users; (7) required legal/company contact disclosures are missing; (8) essential P0 workflows fail; or (9) emergency observability/recovery procedures have not been tested.

---

## 20. Success measurement and staged product learning

### 20.1 Instrumentation plan
Key events: `public_page_view`, `service_view`, `quote_submitted`, `lead_qualified`, `quote_issued`, `lead_converted`, `project_created`, `task_assigned`, `milestone_client_visible`, `deliverable_feedback_created`, `social_draft_created`, `social_approved`, `social_schedule_created`, `social_publish_attempted`, `social_api_confirmed`, `social_manual_confirmed`, `social_publish_failed`, `social_account_reauthorization_needed`, `invoice_issued`, `invoice_payment_recorded`. These are event **names**, not permission to collect unnecessary personal data; event payloads shall minimize or pseudonymize identifiers according to policy.

### 20.2 Dashboard dimensions
Metrics should support authorized filtering by date, service, lead status, project, department, campaign, platform/account, and client organization where appropriate. Percentages require explicit numerator, denominator, period, and handling of missing records. Avoid ranking individual staff by opaque AI-derived "productivity" measures in MVP.

### 20.3 Measurement cadence
- **Daily operations:** pending quotes, overdue tasks, posts awaiting review, accounts requiring reconnect, failed jobs.
- **Weekly team review:** lead progression, milestone health, workflow bottlenecks, client feedback backlog and campaign output.
- **Monthly owner review:** operating costs, project status mix, acquired leads, conversion rate (if sample sufficient), platform utilization and security incidents.
- **After release:** collect user interviews from internal staff and at least one consenting pilot client before expanding HR/finance capabilities.

### 20.4 First 30/60/90 days after launch (proposed learning goals)
| Period | Objective | Decision output |
|---|---|---|
| 0–30 days | Verify lead capture, delivery workflow, role isolation, and social posting status integrity | Fix production blockers and remove friction |
| 31–60 days | Review client and team usage patterns, bottlenecks and publishing reliability | Prioritize highest-value P1 work |
| 61–90 days | Evaluate operating spend, provider approvals and measurable client value | Approve next quarterly roadmap and tier upgrades |

No fabricated revenue, user adoption, uptime, traffic or engagement baselines should appear in company dashboards. Baselines will be derived from actual telemetry after launch.

---

## 21. AI-assisted engineering and documentation handoff

### 21.1 Source-of-truth hierarchy
1. Approved decisions in this PRD and signed ADRs.
2. `TRD.md` for technical choices and threat/architecture controls.
3. `APP_FLOW.md` for UX flows, routes, transitions and permission gates.
4. `UI_UX_DESIGN_BRIEF.md` for design system and accessibility patterns.
5. `BACKEND_SCHEMA.md` for models, indexes, invariants and migrations.
6. `IMPLEMENTATION_PLAN.md` for phase ordering, verification and deployment procedures.
7. `AGENTS.md` for mandatory AI behavior, Git, review and stopping rules.

Where two artifacts conflict, the agent must flag the contradiction and request/record a decision before implementation; later technical specs may *refine*, not silently override, approved product scope.

### 21.2 Engineering rules that future `AGENTS.md` must encode
- Before coding a feature, cite its requirement IDs and related flow/schema/API contracts.
- Implement one focused change at a time, validate it, and commit with a clear conventional commit (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Never commit passwords, OAuth tokens, `.env` secrets, private files or generated credentials.
- Add or update tests with any permission, lifecycle, data schema or status transition change.
- Use secure defaults; avoid bypassing protected routes to make demos work.
- Update relevant docs and phase status after changes; maintain a verifiable change log.
- Never mark an external API integration ready because mock calls pass; separately report real provider approval and test evidence.
- Before every phase gate, present: completed vs pending, test/build outputs, security checks, changed files/commits, deployment impact, open decisions and rollback steps.
- If a human must create accounts, approve provider permissions, add DNS records, configure secrets or authorize payments, stop **that dependent action** and give exact manual steps before proceeding. Work on independent tasks may continue.
- Do not fabricate tool outputs, commits, live posts, performance data, successful tests or deployment confirmations.
- Document safe rollback for schema migrations and customer-impacting operations; preserve audit continuity.

### 21.3 Requirement-to-document mapping
| PRD domain | Primary elaborating document | Minimum detail required next |
|---|---|---|
| Identity/access: IAM, SEC | TRD, APP_FLOW, BACKEND_SCHEMA | Server authorization matrix, grants/relations, session and owner recovery |
| Public site/CMS: PUB, CMS | UI_UX, APP_FLOW, BACKEND_SCHEMA | Page states, content revisions, SEO, safe preview, file policy |
| CRM/delivery: CRM, PRJ, EMP | APP_FLOW, BACKEND_SCHEMA, IMPLEMENTATION_PLAN | Lifecycle diagrams, scoped DTOs, conversion idempotency |
| Client: CLI | APP_FLOW, TRD, BACKEND_SCHEMA | Resource isolation, file URLs, organization membership tests |
| Social: SOC, INT | TRD, BACKEND_SCHEMA, IMPLEMENTATION_PLAN | Adapter contracts, worker state machine, provider gates and recovery |
| Finance: FIN | BACKEND_SCHEMA, TRD | Exact money model, invoice state transitions, access policies |
| Communication/analytics: COM, ANA | TRD, UI_UX, APP_FLOW | Delivery queues, event names, metric definitions, privacy |
| Operations: NFR, OPS, DATA | TRD, IMPLEMENTATION_PLAN, AGENTS | Hosting, backup drills, monitoring, cost gates, deployment runbooks |

---

## 22. Final MVP sign-off checklist

The Owner/QA lead shall explicitly approve each category below before labeling v1.0 "production-ready":

- [ ] **Product scope:** all P0/M requirements traced to tests/evidence; P1/F and P2/F clearly deferred.
- [ ] **Brand/public:** required identity, contact/legal pages, services, products, CMS and case study publication verified.
- [ ] **Lead conversion:** public inquiry → tracked lead → quote → linked client/project works without duplicates.
- [ ] **Authentication:** Firebase session verification, registration baseline, invited roles, privileged MFA and owner recovery tested.
- [ ] **Authorization:** horizontal/vertical privilege escalation, client isolation, files, exports and notifications negative tests pass.
- [ ] **Projects:** PM assignment, staff task updates, client-safe milestone and deliverable feedback flow verified.
- [ ] **Social:** six adapters recognized, real capabilities shown, approval revision rules enforced, scheduling durable, manual fallback complete, ambiguous outcomes safe; each enabled API passes live test.
- [ ] **Finance:** exact money, invoice numbering/status, client visibility, payment records and audit tested.
- [ ] **UX/accessibility:** keyboard/mobile/core accessibility checks and meaningful failure states verified.
- [ ] **Operations:** compliant commercial hosting selected, secure environment configured, monitoring/alerts active, worker recovery demonstrated.
- [ ] **Backups:** protected independent backup exists, restore drill performed, RPO/RTO measured.
- [ ] **Compliance:** approved policy disclosures, data retention and finance/invoicing legal review completed where applicable.
- [ ] **Documentation:** PRD/TRD/App Flow/UI/Backend Schema/Implementation Plan/AGENTS aligned; unresolved risks noted.
- [ ] **Release evidence:** test reports, deployment record, version/tag, known limitations, rollback instructions, owner sign-off.

### 22.1 Baseline approval statement
This document defines Part-time Coder's **approved product baseline**, with all six social networks in scope for **content management and capability-based integration**, not a guarantee of unrestricted automated publishing. The MVP must deliver practical functionality across public business acquisition, internal project delivery and client collaboration, and social content operations. Expansion beyond this baseline requires explicit product change control.

---

## Appendix A — glossary

| Term | Definition |
|---|---|
| RBAC | Role-based access control; refined with contextual resource grants |
| CMS | Content management system for company pages, articles and public portfolio |
| CRM | Customer relationship management for inquiries, leads and client relationships |
| DTO | Explicitly shaped API response/input contract, not raw database object |
| OAuth | Standardized delegated authorization used for supported social accounts |
| Adapter | Provider-specific integration implementing a common internal interface |
| Capability gate | Runtime and administrative check that a provider operation is actually available |
| Idempotency | Repeating the same business command does not create unintended duplicate effects |
| Reconciliation | Determining whether a provider accepted an uncertain publication/payment operation |
| RPO | Recovery point objective: maximum acceptable data loss time |
| RTO | Recovery time objective: maximum acceptable service restoration time |
| WCAG 2.2 AA | Target level of web content accessibility conformance |
| P0/M | Required before MVP production launch |
| P1/F and P2/F | Post-MVP improvements and longer-range capabilities |
| G0–G7 | Phase acceptance gates; a gate is approved only after evidence review |

## Appendix B — authoritative engineering follow-up questions

These are **not blockers to writing this PRD**. The TRD and implementation plan must resolve them before affected production work:

1. Exact production hosting/provider, legal commercial eligibility, and monthly budget ceiling.
2. Cloud region choice and data residence/legal needs for staff and client data.
3. Asset provider and private-file delivery technique; media size limits by use case.
4. Backup encryption key custody, offsite destination, frequency and restore owner.
5. Firebase session model and MFA enforcement approach; identity recovery workflow.
6. Client Admin invitation rules, internal role authority and emergency access revocation.
7. Official social developer applications/approvals, account ownership and per-provider publishing/analytics permissions.
8. Posting cost ceiling for X and maximum spend alert behavior.
9. Formal published content approval chain and any permitted emergency override.
10. Invoice jurisdiction, numbering, sales tax handling, and whether issued documents carry legal/tax meaning.
11. Initial team size, project/media volume and stakeholder review of capacity assumptions.
12. Public domain, company legal identity, finalized logo, copy, approved portfolio content and support email.

## Appendix C — release state template

Use this in phase reports:

```text
Phase / Gate:
Requirements addressed:
Implemented and verified:
Implemented but unverified:
Integration blocked / fallback:
Deferred (approved):
Build / typecheck / lint / unit / E2E / security results:
Live provider approval status and evidence:
Security/privacy/access findings:
Manual actions required before next dependent step:
Changed files and conventional commits:
Documentation updates:
Known issues, rollback plan, owner decision:
Gate verdict: PASS / CONDITIONAL / FAIL
```

---

**End of PRD v1.0.0 — pending owner sign-off**  
**Next artifact:** `docs/TRD.md` — architecture, authentication/session design, API conventions, provider adapters, worker durability, error handling, hosting, threat model, observability, and cost/security controls, mapped to the requirement IDs above.
