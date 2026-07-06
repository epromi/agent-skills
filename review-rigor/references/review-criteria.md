# Review Criteria by Content Type and Depth

## Contents

- [Prompt Review](#prompt-review---type-prompt)
  - Quick · Standard · Deep
- [Spec Review](#spec-review---type-spec)
  - Quick · Standard · Deep
- [Code Review](#code-review---type-code)
  - Quick · Standard · Deep
- [Config Review](#config-review---type-config)
  - Quick · Standard · Deep
- [General Review](#general-review---type-general)
  - Quick · Standard · Deep
- [Verdict Criteria](#verdict-criteria)
- [Known Best Practices (2026)](#known-best-practices-2026)

---

## Prompt Review (--type prompt)

### Quick (spot-check)
- [ ] All placeholders resolve: grep for `PLACEHOLDER`, `TODO`, `FIXME` — none should remain
- [ ] File paths referenced actually exist (verify with `ls`)
- [ ] No contradictory instructions (e.g., "skip X" and "always do X" in same prompt)
- [ ] Obvious missing section? (e.g., no commit instructions for an implementation prompt)

### Standard (full pass)
- [ ] All Quick checks
- [ ] Every section has an active purpose — no dead weight ("silently", filler paragraphs)
- [ ] Hard rules are unambiguous: "NEVER" / "ALWAYS" must not have loopholes
- [ ] Reference examples exist at the specified paths and match the described patterns
- [ ] Ambiguity handling: is there a "⛔ BLOCKED / escalate" path for unclear situations?
- [ ] Phase gates / checkpoints: are success criteria concrete and testable?
- [ ] Placeholder completeness: does the pipeline actually fill every placeholder? (cross-check with dev-loop.sh or equivalent)
- [ ] Best-practice coverage: does it match known patterns for this prompt type? (Cursor implementation prompts: task, architecture, reference, plan, phases, done checklist, commit, troubleshooting — 8 elements)

### Deep
- [ ] All Standard checks
- [ ] **Research validation** (mandatory): web-fetch DDG Lite for current best practices, web-fetch specific articles for deep reading
- [ ] **Best-practice gap**: compare against known patterns (8 elements for implementation prompts)
- [ ] Architecture constraints: do the prompt's rules prevent violations of the system's architectural boundaries?
- [ ] Safety net: can the agent break things by following the prompt literally? (e.g., "fix old tests when your code breaks them")
- [ ] Freedom vs. guardrail balance: too tight = agent can't adapt, too loose = agent goes off-script
- [ ] Edge cases: empty input, single-phase package, research needed but file missing
- [ ] Agent autonomy: will it stall waiting for human input on things it can figure out?

---

## Spec Review (--type spec)

### Quick
- [ ] PKG ID matches directory name
- [ ] Scope lists concrete files (not "various files" or "TBD")
- [ ] Status is defined (draft/review/ready/implementing)
- [ ] Phases numbered (F1, F2...) and each has a deliverable

### Standard
- [ ] All Quick checks
- [ ] Every file in Scope exists or has a clear creation path
- [ ] Phases are ordered correctly (core → UI → wiring → polish)
- [ ] Acceptance criteria: how do we know this is done?
- [ ] Dependencies: does this depend on other packages? Are they completed?
- [ ] Research topics (if any): concrete questions, not vague exploration
- [ ] "Mehet" readiness: can Cursor implement this without guessing?

### Deep
- [ ] All Standard checks
- [ ] **Research validation** (mandatory): web-fetch DDG Lite for existing solutions, libraries, known issues
- [ ] Architecture fit: does this package respect the system's architecture (e.g., core vs components boundary)?
- [ ] Reusability: is anything being built that should be a shared utility instead?
- [ ] Regression risk: what existing functionality could this break?
- [ ] Test strategy: what should be tested and how?

---

## Code Review (--type code)

### Quick
- [ ] Build system identified and succeeds (auto-detect: `package.json` → `pnpm build`, `Cargo.toml` → `cargo build`, `go.mod` → `go build`, `pyproject.toml` → `pip install -e .`, `Makefile` → `make`, etc.)
- [ ] Test runner identified and passes (auto-detect corresponding: `pnpm test`, `cargo test`, `go test`, `pytest`, etc.)
- [ ] No obvious type errors, imports resolve
- [ ] No `console.log` left in, no debug code

### Standard
- [ ] All Quick checks
- [ ] Coverage on new/changed code: ≥70% (if coverage tooling exists; otherwise note as recommendation)
- [ ] Architecture boundaries respected (e.g., core/ doesn't import Svelte, components don't call providers)
- [ ] Error handling: try/catch at module boundaries, typed errors
- [ ] No breaking API changes (props, parameters, return types)
- [ ] Gardening is within bounds (only changed files, no design token changes)
- [ ] Commit message format matches project conventions

### Deep
- [ ] All Standard checks
- [ ] **Security research** (mandatory): web-fetch DDG Lite for CVEs, advisories, known exploits in dependencies/patterns; web-fetch specific CVE pages
- [ ] Security: injection risks, auth bypass, data exposure, dependency audit, supply chain
- [ ] Performance: memory leaks, blocking calls, N+1 queries, unbounded growth
- [ ] Error propagation: are errors caught AND surfaced to the right layer?
- [ ] Thread safety / async correctness: race conditions, deadlocks, unhandled rejections
- [ ] Backward compatibility: will this break existing consumers?

---

## Config Review (--type config)

### Quick
- [ ] Valid syntax (identify format first — JSON, YAML, TOML, INI, systemd, nginx, etc. — then use appropriate validator)
- [ ] No hardcoded secrets (API keys, tokens, passwords)
- [ ] File permissions appropriate (check if executable, world-readable)
- [ ] Service files: `systemd-analyze verify` passes (if systemd unit)

### Standard
- [ ] All Quick checks
- [ ] Every referenced file path exists
- [ ] Every referenced service/port resolves
- [ ] Security posture: TLS, auth, least privilege
- [ ] Environment parity: does this config work in prod AND dev?
- [ ] Emergency contacts / escalation paths defined
- [ ] No deprecated options or known-unsafe defaults

### Deep
- [ ] All Standard checks
- [ ] **Security research** (mandatory): web-fetch for known vulnerabilities in configured services/versions
- [ ] Failover / high availability: single point of failure analysis
- [ ] Resource limits: CPU, memory, disk quotas defined
- [ ] Audit trail: logging, monitoring, alerting configured
- [ ] Disaster recovery: backup, restore, rollback procedures

---

## General Review (--type general)

### Quick
- [ ] Obvious typos, grammar issues, broken links
- [ ] File metadata present (date, author, status if applicable)
- [ ] No placeholder text left ("TODO", "TBD", "FIXME")

### Standard
- [ ] All Quick checks
- [ ] Logical flow: does the argument/build-up make sense?
- [ ] Completeness: are all claimed sections/subtopics actually covered?
- [ ] Factual check: are dates, names, numbers, URLs correct?
- [ ] Audience fit: appropriate level of detail and tone for the intended reader?
- [ ] Actionability: does the reader know what to DO after reading?

### Deep
- [ ] All Standard checks
- [ ] **Research validation** (mandatory): web-fetch for counter-arguments, alternative perspectives, factual verification
- [ ] Depth vs. length: is the document long because it's thorough, or because it's unfocused?
- [ ] Longevity: will this be useful in 6 months? Or is it timestamp-dependent?

---

## Verdict Criteria

Verdict thresholds are defined in the task template's `<output_format>` block (SKILL.md). Follow those exactly — this is the single source of truth.

---

## Known Best Practices (2026)

### Cursor / Claude Code Implementation Prompts
The 8-element pattern (validated via web research, 2026-07-06):
1. **TASK** — What to build, in one sentence
2. **ARCHITECTURE** — System context, boundaries, constraints
3. **REFERENCE** — Key files to read, codebase navigation hints
4. **PLAN** — Phases with deliverables, ordered by dependency
5. **IMPLEMENTATION** — Per-phase instructions with check+test gates
6. **DONE CHECKLIST** — Concrete, verifiable completion criteria
7. **COMMIT** — Explicit git instructions (message format, what to stage)
8. **TROUBLESHOOTING** — Common failure modes and how to recover

### Web Research Protocol (for deep reviews)
- Primary: `web_fetch` DDG Lite (`https://lite.duckduckgo.com/lite/?q=<query>`) — lightweight, no CAPTCHA
- Deep read: `web_fetch` on specific article/API/doc URLs
- Budget: 2-3 searches, 60s total
- Do NOT use `web_search` tool — DDG API scraper runs into bot detection
