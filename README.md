# Agent Skills

Curated, universal agent skills — importable into OpenClaw and any LLM platform. Each skill is a self-contained directory with SKILL.md + prompts + references.

## Skills

### [review-rigor](./review-rigor/)
**Universal artifact analyzer** — review ANYTHING regardless of type. Auto-discovers what the thing is, decomposes it, maps relationships, applies 12 analytical lenses, synthesizes insights. Works on code, configs, docs, projects, prompts, specs, conversations — anything.

Version 6.0 (2026-07-06). Used in production for protocol architecture reviews, code reviews, project audits.

**Structure:**
- `SKILL.md` — Skill definition and usage
- `prompts/` — Universal analyzer + project review prompt templates
- `references/` — Review criteria reference
- `scripts/` — CLI tools

## Development

Every repo has pre-commit secret scanning + CI pipeline. Skills follow the OpenClaw [skill-creator](https://docs.openclaw.ai/skills/skill-creator) conventions.

## License

MIT © Andras Enyedi
