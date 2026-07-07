---
name: review-rigor
description: "Universal analyzer — review ANYTHING regardless of content type. Auto-discovers what the thing is, decomposes, maps relationships, applies 12 lenses, synthesizes insights. Works on code, config, docs, projects, prompts, specs, conversations — anything. Single-file type-based reviews still available as specialized tools."
version: "6.0"
updated: "2026-07-06"
---

# Review Rigor — Universal Analyzer

## Core Rule

**The artifact defines the analysis, not a pre-selected category.**

Traditional reviewers ask "what TYPE is this?" then apply that type's checklist. The universal analyzer asks "what IS this?" then automatically discovers what lenses matter.

For ANY review request, default to `prompts/universal-analyzer.md` unless you have a specific reason to use a single-file type-based review.

## Primary Interface: Universal Analyzer (type-agnostic)

**Use `prompts/universal-analyzer.md` — works on ANYTHING.**

No `--type` flag. No depth selection. Just give it content. The analyzer:
1. **Orient**: What IS this thing?
2. **Decompose**: Break into natural parts (MECE)
3. **Map**: How do parts relate? (calls, depends on, produces, overrides, conflicts)
4. **Evaluate**: Auto-apply 12 lenses (structure, coherence, correctness, completeness, security, efficiency, maintainability, usability, operations, documentation, strategic fit, robustness)
5. **Synthesize**: Patterns, root cause, bottleneck, the story

**When to use**: Any time the user says "review", "analyze", "nézd át", "mit gondolsz erről" — UNLESS they specify a narrow scope ("just security audit this file").

## Secondary: Single-File Type-Based Review (copy-paste)

**Use `prompts/universal-review.md` — requires `{TYPE}` and `{DEPTH}`.**

No OpenClaw. No API keys. No dependencies. Works in:
- **Cursor / Claude Code** — paste the prompt, let the agent review
- **ChatGPT / Claude web** — paste artifact + prompt
- **Any terminal** — pipe file into any LLM CLI tool

### Quick Start

```bash
# Generate review prompt → stdout (copy-paste into ANY LLM)
node review-rigor.js -f src/my-code.ts -d quick

# Pipe directly to any LLM CLI
node review-rigor.js -f src/my-code.ts | openclaw agent --agent alfred --message "$(cat)" --json
node review-rigor.js -f prompts/foo.txt -t prompt | cursor --prompt "$(cat)"

# Copy to clipboard (macOS)
node review-rigor.js -f config/my.service -t config | pbcopy
```

## Content Types

| Type | Auto-detect | Key concerns |
|------|------------|-------------|
| `project` | **"review the project / whole project / full audit / teljes"** | **All dimensions**: architecture, logical coherence, security, operations, code quality, config, specs, gaps, cross-cutting synthesis |
| `prompt` | `.txt`, `.md` in `prompts/` dir | Instruction clarity, completeness, guardrails, ambiguity |
| `spec` | `spec.md`, `proposal.md` | Technical soundness, edge cases, implementability |
| `code` | `.ts`, `.js`, `.svelte`, `.py`, etc. | Correctness, security, architecture, test coverage |
| `config` | `.json`, `.yaml`, `.toml`, `.service` | Security, completeness, drift |
| `general` | Everything else | Clarity, structure, completeness, logic |

## Depth Levels

| Depth | Scope |
|-------|-------|
| `project` | Full 5-phase process — mental models → 10-dimension audit → synthesis. **Read `prompts/project-review-process.md` first.** |
| `deep` | Web research + architecture + security audit + edge cases. **Default for single-file.** |
| `standard` | Full pass: correctness, clarity, completeness, consistency. |
| `quick` | Obvious, high-impact issues only. Gate check / re-review. |

## Verdict Thresholds

- **✅ MERGE**: 0 critical, ≤3 medium — good to go
- **🔧 ITERATE**: 1+ critical OR 4+ medium — needs fixes
- **⛔ REJECT**: ≥3 critical OR fundamental architectural problem — redesign needed

---

## Files

| File | Purpose |
|------|---------|
| `prompts/universal-analyzer.md` | **Universal analyzer** — review ANYTHING, auto-discovers type, applies 12 lenses |
| `prompts/universal-review.md` | **Single-file review** — copy-paste into any LLM (requires type+depth) |
| `prompts/project-review-process.md` | **Project review** — 5-phase process (legacy, use universal analyzer instead) |
| `references/review-criteria.md` | Full criteria by type×depth for single-file reviews |

---

## Advanced: OpenClaw Autofix Loop

When running inside OpenClaw, the reviewer can be spawned as an **isolated subagent** for maximum independence. The orchestrator runs an **autofix loop**: review → apply fixes → re-review → repeat until MERGE or max iterations.

### Configuration

| Option | Default | Values |
|--------|---------|--------|
| `autofix` | true (⚠️ false for code/config) | Apply fixes automatically in review loop |
| `maxIterations` | 3 | Max review-fix cycles before escalating | 
| `notify` | true | Report result to user chat |

### Spawn (for OpenClaw agents)

```
sessions_spawn(
  agentId="alfred",
  context="isolated",
  mode="run",
  label="rigor-<file>",
  timeoutSeconds=<depth * (maxIterations + 1)>,
  task=<orchestrator pipeline>
)
```

The orchestrator pipeline is identical to the universal prompt but wrapped in an autofix loop. The orchestrator:
1. Spawns a reviewer subagent (clean, isolated context)
2. Reads findings
3. If ITERATE + autofix: applies fixes → re-spawns reviewer at quick depth
4. Repeats until MERGE, REJECT, or max iterations

Full pipeline: see `references/review-criteria.md` `### Deep` for the orchestrator task template.

### Autofix Safety Rules
- **Max 3 iterations** — after 3rd ITERATE, escalate
- **REJECT always stops** — fundamental problems need redesign
- **Re-reviews are quick depth** — verify fixes only
- **Backup before fixing**: `git rev-parse HEAD` or `<file>.bak.vN`
- **Code/config default autofix=false** — override explicitly

---

## Project Review Mode (🧠 Full Project Audit)

When triggered with a **project-level** request ("review the whole project", "full audit", "teljes project review", "nézd át a teljes projektet"), follow `prompts/project-review-process.md`.

**This is NOT single-file review.** Project review:
1. Builds **4 mental models** (Actors, Data Flow, Responsibility, Time)
2. Audits across **10 dimensions** (architecture, coherence, security, operations, code, config, health, specs, gaps, synthesis)
3. Mandatory web research for security, operations, and deployment dimensions
4. **Connects dots** — finds cross-cutting patterns, cascading decisions, and the project's "story"

**Critical rules**:
- Mental models come BEFORE auditing — reviewing without a mental model is blind
- Web research is MANDATORY for dimensions 3 (Security), 4 (Operations), 6 (Deployment)
- Phase 4 (Synthesis) connects findings across dimensions — this is the most valuable phase
- Time budget: 40 min standard, 63 min deep

## When NOT to Use

Skip review-rigor when: content <20 lines, pure data entry, user explicitly approved, or rapid prototyping where speed > correctness.
