# Universal Analyzer — Review ANYTHING, Regardless of What It Is

**Type-agnostic. Domain-agnostic. Format-agnostic.**

Give it a single file, a whole project, a paragraph of text, a config snippet, a conversation log — anything. The analyzer figures out what it is, decomposes it, connects the parts, evaluates from every relevant angle, and synthesizes insights.

No `--type` flag. No depth selection. Just: "analyze this."

---

## Core Principle

**The artifact defines the analysis, not a pre-selected category.**

Traditional review: "This is code → check these code things → done."
Universal analyzer: "What IS this? → What are its parts? → How do they relate? → What lenses apply? → What's the story?"

The analyzer adapts to the content. A 10-line bash script doesn't get the same treatment as a 50-file web app. Each gets exactly the analysis it needs.

---

## The Process (5 Phases)

### Phase 1: ORIENT — What IS This?

**Goal**: Build a working understanding before doing anything else.

**Questions to answer** (answer in YOUR head, not in output):
1. What IS this thing? (Program? Document? Configuration? System? Data? Mixture?)
2. What is its apparent PURPOSE? What problem does it claim to solve?
3. What FORM does it take? (Single file? Directory of files? Text stream? Structured data?)
4. What DOMAIN does it live in? (Software engineering, finance, storytelling, system administration, etc.)
5. What SCALE are we dealing with? (10 lines? 1000 files? 1 config value?)

**Key rule**: If you're not sure what something is, STATE YOUR ASSUMPTION and proceed. Don't get stuck.

**Output at end of Phase 1**: A 2-3 sentence summary of what this thing is. This is YOUR working model — it guides everything else. (Include this in report.)

### Phase 2: DECOMPOSE — Break It Into Natural Parts

**Goal**: Find the artifact's NATURAL structure. Don't impose one.

**How to decompose based on form**:

| If the thing is... | Natural parts are... |
|---|---|
| A text document | Sections, arguments, claims, evidence, conclusions |
| Source code | Modules, functions, classes, types, imports |
| A project directory | Components, layers, entry points, config, tests, docs |
| A configuration file | Sections, keys, values, relationships between settings |
| A prompt/instruction | Task definition, constraints, examples, success criteria |
| A conversation/log | Turns, participants, topics, decisions, open questions |
| A data structure | Fields, types, constraints, relationships, sources |
| A system/architecture | Services, data stores, communication channels, boundaries |
| A process/workflow | Steps, decision points, inputs, outputs, actors |
| A mix of the above | Group by category FIRST, then decompose each category |

**MECE check** (Mutually Exclusive, Collectively Exhaustive):
- Do the parts overlap? → re-split
- Is anything left out? → add missing parts
- Can you name each part in a way that makes its role clear?

**What to document**: List the parts you found. This is the "exploded view" of the artifact.

### Phase 3: MAP — How Do the Parts Relate?

**Goal**: Understand connections, dependencies, and flows.

**Relationship types to look for** (not all apply to everything):

| Relationship | Meaning | Look for... |
|---|---|---|
| **Calls/Uses** | A invokes B | Function calls, imports, API calls |
| **Depends on** | A can't work without B | Imports, configuration, runtime dependencies |
| **Produces/Consumes** | A creates data, B reads it | Data flow, pipes, message queues |
| **Contains** | A holds B | Directory structure, composition, nesting |
| **Controls** | A directs B's behavior | Config → app, orchestrator → worker |
| **Precedes/Follows** | A must happen before B | Startup order, sequential steps |
| **Overrides** | A replaces or modifies B | Patches, monkey-patching, inheritance |
| **Conflicts with** | A and B can't coexist | Contradictory configs, mutual exclusion |
| **References** | A mentions B without controlling it | Documentation references, comments |
| **Is a type of** | A is a specific form of B | Inheritance, interface implementation |

**Key questions**:
- What is the CRITICAL PATH? (If this breaks, everything breaks)
- Are there circular relationships? (A→B→A)
- What relationships are IMPLICIT (not documented) vs EXPLICIT?
- Are there orphaned parts? (Not connected to anything else)

**What to document**: A relationship map. Can be textual (A depends on B, B produces data for C).

### Phase 4: EVALUATE — Apply Every Relevant Lens

**Goal**: Examine the artifact from every angle that MATTERS. Auto-detect which lenses apply.

**This is NOT a checklist to run through blindly.** For each lens, ask:
1. Does this lens apply to this artifact? (Yes/No/Partially)
2. If Yes: what's the quality? What problems exist?
3. If No: note briefly why not, move on.

**The 12 Lenses** (apply automatically based on artifact nature):

---

#### Lens 1: Structure & Organization
*Applies to: Everything with multiple parts*

- Is the structure logical and intuitive?
- Would a newcomer find things where they expect them?
- Is there a clear hierarchy or is it flat everywhere?
- Are there naming conventions? Are they followed consistently?
- Is the structure appropriate for the SCALE? (A 3-file project doesn't need deep nesting)

---

#### Lens 2: Logical Coherence
*Applies to: Everything*

- Do the parts make sense TOGETHER?
- Is the same concept called different names in different places?
- Is the same name used for different concepts?
- Are there contradictions? ("Never do X" on page 2, "Do X for Y" on page 5)
- If you trace a USE CASE through the system, does every step make sense?
- Is anything true in one place but false in another?

---

#### Lens 3: Correctness
*Applies to: Code, configs, data, factual claims, logic*

- Are there errors? (Type errors, syntax errors, logical fallacies)
- Do factual claims check out? (If verifiable: VERIFY)
- If it's code: does it build? Do tests pass?
- If it's config: is syntax valid? Will it parse?
- If it's an argument: are premises valid? Does the conclusion follow?

---

#### Lens 4: Completeness
*Applies to: Everything*

- Is anything clearly MISSING?
- Are there TODO/FIXME/TBD markers?
- Are edge cases handled? (Empty input, null, zero, maximum, error states)
- Is the "happy path" the ONLY path documented/implemented?
- What happens when things go wrong? Is there handling for it?
- If this is a specification: can you implement from it without guessing?
- If this is documentation: can you USE the thing after reading it?

---

#### Lens 5: Security
*Applies to: Code, configs, systems, APIs, processes*

- **Web research (mandatory if applies)**: Search for CVEs, advisories, known exploits in dependencies/versions
- Dependency audit: any known vulnerabilities?
- Network exposure: what's accessible from where?
- Authentication: is there any? Is it enforced everywhere?
- Secrets: any hardcoded keys, tokens, passwords?
- Input validation: is untrusted input sanitized?
- Least privilege: does it run with minimal necessary permissions?
- Supply chain: are dependencies from trusted sources?

---

#### Lens 6: Efficiency & Performance
*Applies to: Code, systems, algorithms, processes, workflows*

- What's the algorithmic complexity? (O(n), O(n²)?)
- Are there obvious bottlenecks?
- Is anything done redundantly? (Same work done multiple times)
- Are resources bounded? (Memory limits, timeouts, rate limits)
- Does it scale? (What happens at 10×, 100×, 1000× input?)

---

#### Lens 7: Maintainability
*Applies to: Code, documentation, systems, processes*

- How hard is it to CHANGE this?
- Are there hardcoded values that should be configurable?
- Is the code self-documenting or mystery meat?
- Are there tests? Do they inspire confidence?
- What's the bus factor? (How many people need to understand this?)
- Is there duplication? (Same logic in multiple places)
- How long would it take a new person to understand this?

---

#### Lens 8: Usability
*Applies to: UIs, APIs, CLIs, documentation, processes, prompts*

- Can the INTENDED USER actually use this?
- Are error messages actionable? Or "Error: something went wrong"?
- Is the interface consistent? (Same pattern for similar actions)
- Are defaults sensible?
- Is the learning curve appropriate for the audience?

---

#### Lens 9: Operational Readiness
*Applies to: Deployed systems, services, cron jobs, production configs*

- How is this deployed? Is the deployment documented?
- Does it have health checks?
- Does it log? Are logs useful for debugging?
- Does it handle graceful shutdown?
- Are resource limits defined? (CPU, memory, disk)
- What happens when it crashes? Automatic restart? Data loss?
- Is there monitoring? Alerting?

---

#### Lens 10: Documentation & Communication
*Applies to: Everything*

- Is the thing itself clear? Or does it need external explanation?
- If there IS documentation: is it accurate? Up to date? Findable?
- Can someone understand what this is in 60 seconds?
- Are naming and structure communicating intent?
- What would a README need to say?

---

#### Lens 11: Strategic Fit
*Applies to: Projects, proposals, features within a larger system*

- Does this achieve its stated PURPOSE? (From Phase 1)
- Is this the RIGHT solution for the problem?
- Is there unnecessary complexity? (Over-engineering)
- Is there unnecessary simplicity? (Under-engineering that will break soon)
- What's the cost of NOT having this? What's the cost of HAVING this?
- Are there simpler alternatives that achieve the same goal?

---

#### Lens 12: Robustness & Edge Cases
*Applies to: Everything*

- What happens if input is empty? Null? Malformed? Malicious?
- What happens if a dependency is unavailable?
- What happens at the boundaries? (Min/max values, timeouts, overflow)
- Are there race conditions? (Concurrent access to shared state)
- What state can this get into that it can't get out of?
- Does it fail open or fail closed? Is that the right choice?

---

**After Phase 4**: You have a list of FINDINGS organized by lens. Each finding: WHAT the issue is, WHY it matters, and WHERE/how it appears.

### Phase 5: SYNTHESIZE — Connect, Prioritize, Tell the Story

**Goal**: This is the most valuable phase. Individual findings are just data. Synthesis is INSIGHT.

**Step 1: Find Patterns**
- What issue type appears across MULTIPLE lenses? (e.g., "no error handling" shows up in Correctness, Robustness, AND Operational)
- Is there a ROOT CAUSE behind multiple findings? (e.g., "no tests" explains correctness + maintainability + robustness issues)
- What's a STRENGTH pattern? (e.g., "consistent naming" shows up in Structure, Coherence, AND Usability)

**Step 2: Find the Bottleneck**
- What is THE ONE THING that, if fixed, would:
  - Resolve the most critical findings?
  - Unlock the most value?
  - Prevent the most future problems?
- This is often NOT the highest-severity individual finding. It's the root cause.

**Step 3: Tell the Story**
- In 3-5 sentences: what is this artifact, what's its current state, what's its biggest strength, what's its biggest weakness, what should happen next?
- This is what a senior engineer tells their manager after reviewing a project.

**Step 4: Prioritize**
- Every finding gets: Severity × Effort → Priority
- Critical + easy = fix NOW
- Critical + hard = plan carefully
- Low + easy = fix when touching that area
- Low + hard = note and move on

---

## Output Format

```markdown
# 🔍 Universal Analysis: <Name/Title>

**Analyst**: review-rigor universal analyzer
**What this is**: <2-3 sentence summary from Phase 1>
**Scale**: <N files / N lines / N components>
**Verdict**: ✅ HEALTHY | ⚠️ NEEDS WORK | ⛔ CRITICAL ISSUES

---

## 🧩 Decomposition

### Parts
<list the natural parts found in Phase 2>

### Relationships
<key relationships from Phase 3>

### Critical Path
<the one chain that everything depends on>

---

## 🔎 Findings by Lens

### Lenses that applied: <list>
### Lenses that didn't apply: <list with one-line reasons>

#### Lens: <Name>
- **<severity>**: <finding> — <why it matters>
  → <concrete fix>

<repeat for each relevant lens>

---

## 🧠 Synthesis

### Recurring Patterns
- **Strengths**: <3-5 patterns of things done well>
- **Weaknesses**: <3-5 patterns of recurring problems>

### Root Cause
<if one thing causes many problems, name it here>

### 🎯 The One Thing
<the bottleneck — fixing this unlocks the most value>

### The Story
<3-5 sentence summary: what this is, current state, biggest strength, biggest weakness, what's next>

---

## 📊 Priorities

| # | Severity | Effort | What | Fix |
|---|----------|--------|------|-----|
| 1 | 🔴 Critical | 5 min | <finding> | <action> |
| 2 | 🟠 High | 30 min | <finding> | <action> |
| ... | ... | ... | ... | ... |

---

## 🌐 Web Research
<List all searches performed, URLs, and key findings. 
If none relevant: "No web research performed — artifact type doesn't warrant external verification.">
```

---

## When to Use

**Use the universal analyzer when:**
- The user says "review this" without specifying what "this" is
- You're not sure what content type the thing belongs to
- The thing spans multiple categories (a project = code + config + docs + specs)
- The user says "analyze this", "break this down", "what do you think of this"
- You want the FULL picture, not just one dimension

**Use single-file review (universal-review.md) when:**
- You know exactly what type it is AND only one dimension matters
- Speed is critical (single-file review is faster)
- The user wants a specific type of check (e.g., "just security audit this")

**Skip analysis entirely when:**
- The artifact is trivially small (<20 meaningful lines)
- The user explicitly says "don't analyze, just do X"
- Pure data entry with no structure to analyze

---

## Time Budget

| Phase | Small (<100 lines, 1 file) | Medium (100-1000 lines, 2-10 files) | Large (project, 10+ files) |
|-------|---------------------------|-------------------------------------|---------------------------|
| 1. Orient | 1 min | 2 min | 5 min |
| 2. Decompose | 1 min | 3 min | 8 min |
| 3. Map | 1 min | 3 min | 8 min |
| 4. Evaluate | 3 min (covers 4-6 lenses) | 8 min (covers 6-9 lenses) | 20 min (covers 8-12 lenses) |
| 5. Synthesize | 1 min | 2 min | 5 min |
| **Total** | **7 min** | **18 min** | **46 min** |

---

## Design Notes

### Why no `--type` flag?

Because the type EMERGES from the content, it shouldn't be DECLARED by the user. The analyzer's first job is to figure out what it's looking at. Pre-labeling introduces bias: "This is code → apply code criteria" means you might miss that it's also a configuration file, a security risk, and a documentation artifact.

### Why 12 lenses instead of 10 or 20?

12 covers the major quality dimensions recognized by ISO/IEC 25010 (software quality), extended with practical categories from architecture review and systems thinking. These 12 are broad enough to cover any artifact while specific enough to produce actionable findings.

### What if I'm not sure a lens applies?

Apply it LIGHTLY. Spend 30 seconds looking through that lens. If nothing stands out, note "No significant findings" and move on. Better to spend 30 seconds on an irrelevant lens than to miss a finding because you assumed a lens didn't apply.

### Web research: when is it mandatory?

- Security lens: ALWAYS (if the artifact has any code, dependencies, or network exposure)
- Correctness lens: SOMETIMES (if the artifact makes claims that can be fact-checked)
- Strategic fit lens: OPTIONAL (if the artifact is in a domain you're unfamiliar with)
- All other lenses: by judgment

Web research budget: 2-4 searches, 90 seconds total. Use DDG Lite (web_fetch), not web_search.
