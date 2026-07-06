#!/usr/bin/env node
/**
 * review-rigor.js — Generate a universal review prompt.
 *
 * Reads a file, fills the universal-review.md template, and outputs
 * the completed prompt to stdout. Copy-paste into ANY LLM or pipe:
 *
 *   node review-rigor.js -f src/my-code.ts | openclaw agent --agent alfred --message "$(cat)" --json
 *   node review-rigor.js -f prompts/foo.txt -t prompt | pbcopy   # macOS clipboard
 *   node review-rigor.js -f config/my.service -t config | your-llm-cli
 *
 * Zero dependencies on any specific LLM platform.
 */

const { readFileSync, existsSync } = require("node:fs");
const { resolve, basename, extname, dirname } = require("node:path");

const SKILL_ROOT = resolve(__dirname, "..", "skills", "review-rigor");
const TEMPLATE = resolve(SKILL_ROOT, "prompts", "universal-review.md");

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { file: null, type: null, depth: "standard", help: false };
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case "-f": case "--file": o.file = a[++i]; break;
      case "-t": case "--type": o.type = a[++i]; break;
      case "-d": case "--depth": o.depth = a[++i]; break;
      case "-h": case "--help": o.help = true; break;
      default: if (!o.file && !a[i].startsWith("-")) o.file = a[i];
    }
  }
  return o;
}

function detectType(fp) {
  const ext = extname(fp).toLowerCase();
  const bn = basename(fp).toLowerCase();
  const dr = dirname(fp);
  if (ext === ".md" || ext === ".txt") {
    if (dr.includes("prompt")) return "prompt";
    if (bn.includes("spec") || bn.includes("proposal")) return "spec";
    return "general";
  }
  const code = [".ts", ".js", ".tsx", ".jsx", ".svelte", ".vue", ".py", ".go", ".rs", ".java"];
  if (code.includes(ext)) return "code";
  const cfg = [".json", ".yaml", ".yml", ".toml", ".service", ".conf", ".ini"];
  if (cfg.includes(ext)) return "config";
  return "general";
}

function main() {
  const o = parseArgs();
  if (o.help || !o.file) {
    console.log(`review-rigor — Generate a universal review prompt

Usage:
  node review-rigor.js --file <path> [--type <type>] [--depth <depth>]

Options:
  -f, --file <path>    File to review (required)
  -t, --type <type>    prompt|spec|code|config|general (auto-detect)
  -d, --depth <depth>  quick|standard|deep (default: standard)

Output: filled prompt → stdout. Pipe to any LLM or copy-paste.

Examples:
  node review-rigor.js -f src/lib/core/h1.ts -d quick
  node review-rigor.js -f prompts/cursor.txt -t prompt -d deep | pbcopy
  node review-rigor.js -f src/foo.ts | openclaw agent --agent alfred --message "\$(cat)" --json`);
    process.exit(o.help ? 0 : 1);
  }

  const fp = resolve(o.file);
  if (!existsSync(fp)) { console.error(`❌ File not found: ${fp}`); process.exit(1); }

  const type = o.type || detectType(fp);
  const content = readFileSync(fp, "utf8");
  const raw = readFileSync(TEMPLATE, "utf8");

  // Strip human README — keep only the LLM prompt
  const splitMarker = "<!-- LLM_PROMPT_START -->";
  const idx = raw.indexOf(splitMarker);
  const llmSection = idx >= 0 ? raw.slice(idx + splitMarker.length) : raw;
  const filled = llmSection
    .replace(/\{FILE_CONTENT\}/g, content)
    .replace(/\{TYPE\}/g, type)
    .replace(/\{DEPTH\}/g, o.depth);

  process.stdout.write(filled.trimStart());
}

main();
