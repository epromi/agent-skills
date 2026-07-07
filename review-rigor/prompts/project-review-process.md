# Project Review Process — 5-Phase Framework

**This is a process guide for the orchestrator (Alfred), NOT a single LLM prompt.**
Project review requires reading 20-80 files, building mental models, and connecting dots — this cannot fit in one prompt.

## Why This Exists

Single-file review (`type=code/prompt/spec/config`) is great for changes. But when you need to review an **entire project**, you need a fundamentally different approach:

- Single-file: "Is this file correct?"
- Project: "Does this whole system make sense? What's missing? What's connected that shouldn't be?"

A good project reviewer thinks like a **new senior engineer joining the team** — they don't just check syntax, they build mental models, trace flows end-to-end, and identify emergent properties.

---

## Phase 1: DISCOVER (5 minutes)

**Goal**: Know what this project is, what it does, and what kind of project it is.

### 1.1 File Inventory
```bash
find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './build/*' -not -path './.svelte-kit/*' | sort
```

### 1.2 Project Type Identification
Answer these questions:
- What is this project? (web app, CLI, library, dashboard, automation tool...)
- What tech stack? (language, framework, build system, deployment target)
- Who is the audience? (end users, developers, internal, external)
- What problem does it solve?
- How is it deployed? (systemd, container, serverless, manual?)

### 1.3 Categorize All Files
Group every file into one of:
| Category | Example patterns |
|----------|-----------------|
| Source code | `src/`, `lib/`, `*.ts`, `*.js`, `*.svelte` |
| Tests | `tests/`, `*.test.ts`, `__tests__/` |
| Configuration | `*.config.*`, `*.service`, `.env*`, `docker-compose.*` |
| Build/Pipeline | `Makefile`, `Dockerfile`, CI configs, build scripts |
| Documentation | `README.md`, `CONTRIBUTING.md`, `docs/`, `*.md` |
| Specs/Prompts | `specs/`, `prompts/`, `design/`, `dev/packages/` |
| Data | `*.json`, `*.yaml`, `*.csv`, `*.sql` |
| Scripts/Tools | `scripts/`, `bin/`, `*.sh`, `*.cjs` not in build |
| Generated/Artifacts | `build/`, `dist/`, `.svelte-kit/`, `node_modules/` |

Generated artifacts are excluded from review but their EXISTENCE is noted (build works? artifacts complete?).

---

## Phase 2: BUILD MENTAL MODELS (10 minutes)

**Goal**: Form 4 mental models of the system. These models are HOW you will think about the project for the rest of the review.

### Model 1: Actors & Interactions
*"Who does what to whom?"*

**Do**:
- List every "actor" in the system: services, databases, APIs, file systems, cron jobs, UI components, external systems
- Map their interactions: HTTP calls, file reads/writes, database queries, WebSocket, process spawn
- Draw a rough mental map: what talks to what?
- Identify the PRIMARY actor (the one everything revolves around)

**Questions to answer**:
- If I start at the entry point (index.ts / main / +page.server.ts), what happens?
- Which components communicate with each other?
- Are there circular dependencies? (A → B → A)
- What's the trust boundary? (internal vs external)

### Model 2: Data Flow & Transformation
*"How does data move through the system?"*

**Do**:
- Trace data from origin to destination for 2-3 key use cases
- Note transformations at each step (parsing, validation, enrichment, serialization)
- Identify state: what's in memory? What's persisted? What's ephemeral?

**Questions to answer**:
- What is the "hottest" data path? (most frequently accessed)
- Where does data cross process / network boundaries?
- Is there data that could be stale? Is staleness handled?
- How does the system know its data is correct? (health checks, integrity verification)

### Model 3: Responsibility & Boundaries
*"What owns what?"*

**Do**:
- Map each responsibility domain: API → provider, cache → mutex, UI → reactive state
- Check boundary enforcement: does core/ import UI? Does provider call file system?
- Identify the single responsibility of each module

**Questions to answer**:
- Are there modules that do too much? (>5 responsibilities)
- Are there responsibilities shared across modules? (bad — single owner needed)
- Where would I add a new feature? Is the extension point clear?

### Model 4: Time & Events
*"What happens when?"*

**Do**:
- Startup: what initializes? In what order?
- Steady state: what runs periodically? (cron, collectors, refresh cycles)
- Shutdown: what cleans up? Is it graceful?
- Error state: what happens when something fails?

**Questions to answer**:
- Are there race conditions? (two things happening simultaneously on shared state)
- Are there startup ordering dependencies?
- What happens if a cron job never runs? Is there a fallback?

---

## Phase 3: MULTI-DIMENSIONAL AUDIT (20 minutes)

**Goal**: Review the project from 10 dimensions. Each dimension has specific checks. Mandatory web research is called out per dimension.

**⚠️ For each dimension, run web research BEFORE analyzing files.** The web tells you what to look FOR in the files.

### Dimension 1: Architecture & Structure

**Web research**: `web_fetch DDG Lite: "best practices <framework> project structure 2025 2026"`
- For SvelteKit: search for recommended directory structure, adapter patterns
- For any framework: search for anti-patterns

**File review**:
- [ ] Entry point is clean and obvious (not split across 3 files)
- [ ] Directory structure follows framework conventions
- [ ] Component nesting depth ≤ 4 levels
- [ ] No circular imports (check with `madge` or manual: does A import B import A?)
- [ ] Separation of concerns: core logic vs presentation vs data access
- [ ] Module sizes: any file >500 lines? (>300 for non-component code)
- [ ] Interface/type files are centralized or co-located with consumers (not scattered)
- [ ] Generated code is NOT committed (unless intentional)

### Dimension 2: Logical Coherence & End-to-End Flow

**No web research needed** — this is the "thinking" dimension.

**Do**:
- Pick 3 user journeys. For each, trace the ENTIRE path through the system.
- Journey 1: Primary happy path (e.g., "user loads dashboard → sees real-time data")
- Journey 2: Edge case (e.g., "API returns error → what's displayed?")
- Journey 3: Background task (e.g., "cron fires → collector runs → data updates")

**Questions per journey**:
- At each step: what if this fails? Is the error handled? Is it visible?
- Does data transformation make sense at each step?
- Is there a "missing link" — a function that should exist but doesn't?
- Are there two ways to do the same thing? (inconsistency)

**Key check**: Can I explain the system to someone in 60 seconds?

### Dimension 3: Security

**⚠️ MANDATORY web research — this is the most research-heavy dimension.**

**Web research (3 searches minimum)**:
1. `web_fetch DDG Lite: "<framework> <version> CVE vulnerability 2025 2026"`
2. `web_fetch DDG Lite: "<key dependency> <version> CVE security advisory 2025 2026"`
3. `web_fetch DDG Lite: "<project type> security best practices 2025 2026"`

**File review**:
- [ ] Dependency audit: `npm audit` or `pnpm audit` or equivalent
- [ ] Network exposure: `ss -tlnp` — what ports are open? On which interfaces?
- [ ] AuthN/AuthZ: is there authentication? Is it enforced on EVERY endpoint?
- [ ] Secrets: any hardcoded keys, tokens, passwords? (grep for `key`, `secret`, `token`, `password`, `api_key`)
- [ ] TLS: is encryption in transit enforced? Any `NODE_TLS_REJECT_UNAUTHORIZED=0` or equivalent?
- [ ] Input validation: do API endpoints validate input?
- [ ] File permissions: any world-readable sensitive configs?
- [ ] Service hardening: `NoNewPrivileges`, `ProtectSystem`, `ReadOnlyPaths` in systemd units?
- [ ] CORS / CSRF: properly configured? Not overly permissive?

### Dimension 4: Operational Readiness

**Web research**: `web_fetch DDG Lite: "production readiness checklist <deployment type> 2025"`

**File review**:
- [ ] Service management: systemd unit, supervisor config, or container orchestration?
- [ ] Health checks: `GET /health` or equivalent? Does it verify dependencies?
- [ ] Logging: structured (JSON) or unstructured? Where do logs go?
- [ ] Monitoring: metrics exposed? Prometheus endpoint? Dashboard?
- [ ] Alerting: who gets paged when it breaks?
- [ ] Graceful shutdown: SIGTERM handling? Connection draining?
- [ ] Resource limits: CPU, memory, disk quotas defined?
- [ ] Startup dependencies: does it wait for dependencies? (network, database, etc.)
- [ ] Restart policy: what happens after crash? Backoff?
- [ ] Backup: stateful data backed up? Restore tested?

### Dimension 5: Code Quality & Maintainability

**Web research**: None needed — this is hands-on code review.

**File review**:
- [ ] Build: `pnpm build` / `npm run build` / equivalent — clean output?
- [ ] Tests: `pnpm test` / equivalent — all pass? Coverage ≥ 70%?
- [ ] Type safety: TypeScript strict mode? Any `any` types?
- [ ] Dead code: exports never imported, functions never called, variables unused
- [ ] Error handling: try/catch at module boundaries, typed errors, not swallowing
- [ ] Error messages: actionable? Include context? Not generic "Error occurred"?
- [ ] Comments: explain WHY, not WHAT. Any stale comments?
- [ ] Naming: consistent? Descriptive? No `data`, `tmp`, `obj`, `result` without context?
- [ ] Functions: any >50 lines? Any with >5 parameters?
- [ ] Magic numbers: hardcoded values without explanation?
- [ ] Copy-paste: duplicate code across files?

### Dimension 6: Deployment & Configuration

**Web research**: `web_fetch DDG Lite: "<build tool> <deployment> best practices production configuration 2025"`

**File review**:
- [ ] Environment parity: does dev config differ from prod? Are differences documented?
- [ ] Build output: is it complete? Can I run `node build` and it works?
- [ ] Environment variables: documented? Defaults safe? Required ones validated at startup?
- [ ] Config files: valid syntax? No deprecated options?
- [ ] Secrets management: `.env` in `.gitignore`? No secrets in config files?
- [ ] Host/port binding: localhost-only where appropriate? Documented if exposed?
- [ ] Allowed hosts: appropriate for the environment?

### Dimension 7: Project Health & Dependencies

**Web research**: None — use tooling.

**File review**:
- [ ] Package management: lockfile present and up to date?
- [ ] Dependency freshness: any packages >1 year without update? (check with `npm outdated`)
- [ ] Deprecated packages: any warnings on install?
- [ ] Version pinning: `^` vs `~` vs exact? Appropriate for the project?
- [ ] Dev vs prod dependencies: correctly separated?
- [ ] Build scripts: `prepare`, `preinstall` hooks — any that run untrusted code?
- [ ] Git hygiene: `.gitignore` comprehensive? No secrets in history?
- [ ] Technical debt markers: TODO/FIXME/HACK count? Any with dates >6 months?

### Dimension 8: Spec & Prompt Quality (AI-driven projects)

**Applies to**: Projects using AI agents for implementation (Noema, Cursor-based).

**Web research**: None.

**File review**:
- [ ] What's generating the AI prompts? Is the template complete?
- [ ] Placeholder filling: does the generator fill ALL placeholders?
- [ ] Ambiguity handling: can the AI get stuck? Is there an escalation path?
- [ ] Spec format: consistent across all packages?
- [ ] Phase granularity: are phases too big (>5 files) or too small?
- [ ] Research topics in specs: concrete questions or vague exploration?
- [ ] Acceptance criteria: how does the AI know it's done?

### Dimension 9: Gap Analysis

**No web research** — this is pure reasoning.

**Ask yourself**:
- What should exist but doesn't?
  - Tests for critical paths? (auth, data integrity, error recovery)
  - Documentation for setup/deployment?
  - Monitoring/alerting?
  - Disaster recovery plan?
  - Security scanning in CI?
- What's the next logical feature? Does the architecture support it?
- What edge case is NOT handled?
- What would break if traffic 10x'd tomorrow?
- What would a new team member struggle with?
- Is there a README that gets you from zero to running in <5 min?

### Dimension 10: Synthesis & Cross-Cutting

**No web research** — this connects everything.

**Do**:
- Identify 3-5 patterns that recur across files (both good and bad)
- Find design decisions that cascade (changing X forces changes in Y, Z)
- What is the "bottleneck" — the one thing that, if fixed, would unlock the most value?
- What is the "story" of this project? (e.g., "well-architected dashboard with one critical security gap")
- Overall verdict: does this project meet its stated goals? Is it production-ready?

---

## Phase 4: VERDICT & PRIORITIZATION (3 minutes)

**Do NOT just list findings.** Prioritize by IMPACT × EASE:

| Priority | Meaning |
|----------|---------|
| 🔴 Critical | Deploy blocker — security, data loss, corruption, <10 min to fix |
| 🟠 High | Major quality/security issue — should fix before next release |
| 🟡 Medium | Improvement — fix when touching that area |
| 🔵 Low | Nice to have — no urgency |
| 💡 Suggestion | Idea for future — not a problem, just an opportunity |

Each finding: **What** (concrete, with line/file) → **Why** (impact in one sentence) → **Fix** (actionable) → **Time** (estimated fix time).

---

## Phase 5: REPORT (2 minutes)

### Report Format

```markdown
# 🧠 <Project Name> — Comprehensive Project Review (<Date>)

**Reviewer**: <name> (review-rigor project mode)
**Scope**: Full project — <N> files across <M> categories
**Verdict**: ⛔ REJECT | 🔧 ITERATE | ✅ HEALTHY

---

## Mental Models

### Actors & Interactions
<summary>

### Data Flow
<summary>

### Responsibility & Boundaries
<summary>

### Time & Events
<summary>

---

## Findings by Severity

### 🔴 Critical (N)

### 🟠 High (N)

### 🟡 Medium (N)

### 🔵 Low (N)

### 💡 Suggestions (N)

---

## Cross-Cutting Patterns

### ✅ Strengths
<3-5 things the project does well>

### ⚠️ Weaknesses
<3-5 recurring issues>

### 🎯 Top Bottleneck
<The one thing that would unlock the most value>

---

## Web Research Evidence
<List all web searches performed, with queries and key findings>

---

## Fix Priority (Top 5)

| # | Time | Severity | What | Fix |
|---|------|----------|------|-----|

---

## Files Reviewed

| Category | Files | Count |
|----------|-------|-------|
```

---

## When to Use Project Review

| Signal | Action |
|--------|--------|
| User says "review the whole project" | Run full 5-phase process |
| User says "review <specific file>" | Use single-file mode (type=code/prompt/etc.) |
| User says "security review" | Skip non-security dimensions OR run full project review |
| New feature going to production | Run quick project review (skip mental models, focus on dims 3-6) |
| Quarterly health check | Run full 5-phase process |

## Time Budget

| Phase | Quick | Standard | Deep (default) |
|-------|-------|----------|----------------|
| 1. Discover | 3 min | 5 min | 10 min |
| 2. Mental Models | 5 min | 10 min | 15 min |
| 3. Multi-Dim Audit | 10 min (dims 3-6 only) | 20 min (all 10) | 30 min (all 10 + extra research) |
| 4. Verdict | 2 min | 3 min | 5 min |
| 5. Report | 2 min | 2 min | 3 min |
| **Total** | **22 min** | **40 min** | **63 min** |

## Orchestrator Notes

- **Phase 3 can be parallelized**: spawn one subagent per dimension in isolated context, then synthesize in Phase 4. But for most projects, sequential is faster (context switching overhead).
- **If spawning sub-reviewers**: each gets `<project root path>` + `<dimension name>` + `<review criteria for that dimension>`. Max 3 parallel subagents.
- **Mental models are YOUR notes** — they guide what you look at in Phase 3. Don't skip them just because "they're not in the output format." A reviewer without mental models is reviewing blind.
- **Web research is NOT optional** for dimensions 3, 6, and 8. The web tells you what problems to look for BEFORE you find them in code.
