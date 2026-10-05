# Adapter: Cursor / IDE parity

This pack is the legal re-expression of the same files a coding agent already understands. If the “document review platform” is actually a matter repository opened in Cursor, map as follows.

| Legal pack | Cursor |
| --- | --- |
| `.legalrules.md` | `.cursorrules` or `.cursor/rules/firm.mdc` with `alwaysApply: true` |
| `LEGAL.md` | `AGENTS.md` |
| `guides/*.md` | `.cursor/rules/*.mdc` with frontmatter |
| `context-packs/*.json` `triggers` | `globs` + `description` |
| `skills/*/SKILL.md` | Agent skills |
| `memory/matters/<id>/` | the repo itself |
| `memory/firm/precedent-rules.json` | architecture decision records |
| Assembler `never_drop` | system + user + workspace rules |
| Privilege tool gating | “do not exfiltrate `.env`” |
| Memory write protocol | PR to main; no direct push |

The invariant is unchanged: **the workspace is the source of truth; chat is not.**

What the IDE still cannot do without extra work:

- ethical walls across two checked-out matters (two workspaces, two agents)
- PACER / DMS connectors with privilege-typed tools
- as-of dated jurisdiction verification

Those are platform features. Do not pretend a markdown pack replaces them.
