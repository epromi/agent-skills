---
name: review-rigor
description: "Independent review for any content type (code, prompts, specs, configs, proposals). Copy-paste the universal prompt into ANY LLM — ChatGPT, Claude, Cursor, or terminal. Zero dependencies. Supports three depths (quick/standard/deep), autofix loop (OpenClaw only). Trigger words: nézesd át, review, cross-check, double-check, sanity check, rigor check. Do NOT trigger for: trivial formatting, user-explicitly-approved content, files <20 lines, pure data entries."
version: "4.0"
updated: "2026-07-06"
---

# Review Rigor — Universal Independent Review

## Core Rule

**Never self-review.** Get a second pair of eyes. Self-review misses 10-20× more problems. (v5 self-review: 0 criticals caught; independent reviewer: 4 criticals.)

## Primary Interface: Universal Prompt (works everywhere)

**Copy `prompts/universal-review.md`, replace `{FILE_CONTENT}` and `{TYPE}`, paste into ANY LLM.**

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
| `prompt` | `.txt`, `.md` in `prompts/` dir | Instruction clarity, completeness, guardrails, ambiguity |
| `spec` | `spec.md`, `proposal.md` | Technical soundness, edge cases, implementability |
| `code` | `.ts`, `.js`, `.svelte`, `.py`, etc. | Correctness, security, architecture, test coverage |
| `config` | `.json`, `.yaml`, `.toml`, `.service` | Security, completeness, drift |
| `general` | Everything else | Clarity, structure, completeness, logic |

## Depth Levels

| Depth | Scope |
|-------|-------|
| `deep` | Web research + architecture + security audit + edge cases. **Default.** |
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
| `prompts/universal-review.md` | **Universal prompt** — copy-paste into any LLM |
| `references/review-criteria.md` | Full criteria by type×depth (loaded by OpenClaw agent or referenced manually) |

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

## When NOT to Use

Skip review-rigor when: content <20 lines, pure data entry, user explicitly approved, or rapid prototyping where speed > correctness.
