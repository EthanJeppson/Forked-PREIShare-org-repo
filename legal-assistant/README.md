# Legal Document Review AI — Configuration Pack

A portable analog of IDE assistant integration (Cursor-style rules, `AGENTS.md`, skills, and scoped memory) for a law-firm document review platform such as Harvey, a custom GPT, or a private retrieval assistant.

This pack is a **configuration**, not legal advice. All clients, captions, and holdings below are fictional teaching fixtures.

## Invariant core principle

**An assistant becomes consistent when instructions, memory, and work product are layered files in a shared workspace: injected by scope and trigger, versioned with the work, and writable only under explicit gates.**

That is the same principle that makes coding agents reliable. The model is not trusted to “remember the firm.” The **workspace is the source of truth**. Chat is ephemeral. Durable facts live in files with an owner, a scope, and a review rule.

The principle is domain-agnostic because it does not encode Python or contracts. It encodes four properties of professional work:

1. **Authority is layered.** Some rules may never change in-session (ethics, privilege). Some are firm defaults. Some are client preferences. Some are this matter’s current positions. Mixing those layers is how assistants hallucinate policy.
2. **Scope selects context.** A coding agent does not load every file; it loads rules that match the files in play. A legal agent must not load every client; it loads the matter, the document type, the jurisdiction, and the privilege class in play.
3. **Skills are procedures, not personality.** Large playbooks are loaded on demand when the task matches, the way an IDE loads a testing skill only when you are writing tests.
4. **Writes are gated.** Evolving memory is allowed, but never into the invariant layer, and never without attribution, as-of date, and a human promotion path — the analog of “copy, propose, standards check, merge to main.”

If a platform cannot do those four things, no amount of prompt engineering will make Harvey and a custom GPT behave like the same firm.

## IDE primitive → legal primitive

| IDE (Cursor / coding agent) | Legal review assistant | Layer | Who may change it |
| --- | --- | --- | --- |
| System prompt | Professional-responsibility + platform safety | Platform | Ethics / GC + vendor |
| User rules | Individual attorney working style | Person | That attorney |
| `.cursorrules` / always-apply rules | Firm review standards | Firm | Partner-approved |
| `AGENTS.md` | `LEGAL.md` (firm) + `MATTER.md` (case) | Firm / matter | Partners / assigned team |
| Glob-scoped rules | Context packs (doc type × jurisdiction × privilege) | Conditional | Practice group |
| Intent / agent skills | Document-type playbooks (`skills/*/SKILL.md`) | On-demand | Practice group |
| Open editors / current file | Working set of documents under review | Session | Reviewer |
| Persistent agent memory | Client prefs, jurisdiction notes, matter decision log | Multi-scope | Write protocol |
| `.env` / secrets | Privileged and highly restricted material | Isolated | Never in web tools or global memory |
| Git + CI | DMS versions + citation / privilege / conflict gates | Audit | Supervising attorney |
| Tests | Structured findings, authority checks, issue lists | Gate | Reviewer + partner |

## What stayed structurally similar vs what had to be re-expressed

### Remained similar

- **File-based guides** instead of a hidden system prompt only the vendor can see.
- **Always-on / conditional / on-demand** injection, not one mega-prompt.
- **A project constitution** (`LEGAL.md`) that is loaded for every turn in this workspace.
- **Skill frontmatter** (`name`, `description`, triggers) so a router can pick procedures.
- **Token budgets with drop order** — never drop ethics to keep a clause.
- **Templates for a new unit of work** (new repo ↔ new matter).
- **Human merge to “main”** before a preference becomes firm policy.

### Had to be re-expressed

| Coding encoding | Legal re-expression | Why it could not stay as-is |
| --- | --- | --- |
| File globs (`**/*.ts`) | Document type + jurisdiction + privilege class | Legal “files” are not a typed tree; the same PDF may be a production, a draft, and a privileged memo. |
| Compiler / test suite | Citation, authority-date, and conflict/privilege screens | There is no compiler for a redline. Wrongness is silent unless you add gates. |
| “Don’t leak `.env`” | Matter isolation, ethical walls, privilege tool-gating | Secrets are not one file; they are a *relationship* (client, adversary, co-counsel). |
| Code style | House style **and** negotiation posture **and** defined-term lock | Style can change legal meaning (`best efforts` vs `commercially reasonable efforts`). |
| Types / interfaces | Defined-terms table + issue codes + finding schema | The contract’s dictionary is the type system. Drift across documents is a defect. |
| Breaking API change | Change to a taken legal position or reservation of rights | Positions already sent to the other side are sticky in a way refactors are not. |
| CI required checks | Supervising-attorney sign-off on hard_stop findings | The accountable human is part of the runtime, not an afterthought. |
| Global user memory | **Forbidden** for client facts | ChatGPT-style global memory is the wrong grain. It cross-contaminates matters. |

## New challenges when the helper leaves the IDE

A coding agent sits inside a repo with an AST, a language server, git blame, and a compiler. A legal assistant sits inside a document-review platform. These are new failure modes, not cosmetic ones.

1. **No ground-truth oracle.** A failed test is a signal. A fluent but uncited memo is not. Every finding must carry `authority`, `as_of`, and `confidence`, or it is a draft opinion, not a review product.
2. **Privilege is a runtime type.** Tools (web research, email, opposing-counsel portals, even some vendor logs) are unsafe for some slices. The assembler must **strip tools**, not merely warn.
3. **Ethical walls and matter isolation.** The default in an IDE is “the whole repo.” The default here must be “this matter, this client, this wall.” Loading a sibling client’s playbook is a conflict incident.
4. **Law is time-indexed and split.** Code has a version pin. Law has `as_of` dates, circuit splits, and pending legislation. Jurisdiction memory must store splits as *open*, not as a picked holding, unless a partner picked it.
5. **The document is not the program.** OCR, exhibits, definitions used before they are defined, and five parallel drafts of the same SPA mean retrieval must be version-aware, not “newest file wins.”
6. **Positions leak across the table.** A comment the assistant suggests can become a waiver or a concession if pasted into a cover email. Redlines are classified (`internal_only` vs `sendable`).
7. **Global product memory is hostile.** Harvey vaults, GPT knowledge uploads, and ChatGPT Memory do not natively match matter scope. Adapters must **compile** always-on text and **keep client memory out of global slots**.
8. **Accountability and audit.** Malpractice and professional-conduct rules require who asked, what was loaded, what the model said, and who accepted it. The assembled context manifest is part of the work product.
9. **Retention and legal hold.** Evolving memory files are records. They follow hold, retention, and destruction rules the IDE `.cursor` folder never had.
10. **The lawyer remains the operator.** The assistant may draft; it may not file, send, or “agree” to a change in legal position. That is a hard tool policy, not a vibe.

## How a review turn is assembled

```
platform invariants (vendor + ethics)
  → 00-ethical-invariants (always)
  → firm .legalrules + LEGAL.md (always, this workspace)
  → privilege / confidentiality guide (always if any doc ≥ confidential)
  → MATTER.md + issue/decision memory (this matter only)
  → jurisdiction notes (matching governing law / forum)
  → client preferences (this client only, behind the wall)
  → matching context pack + skill (document type)
  → working documents (current draft, prior redline, defined-terms lock)
  → session instructions (this reviewer request)
```

Drop order if the window overflows: session → extra working text (summarize) → client style → jurisdiction color → **never** ethics, firm hard stops, or matter positions already taken.

The runtime that implements this is `runtime/assemble-context.ts`. Run:

```bash
npm run test:legal-assistant
npm run legal-assistant:assemble -- --matter 2026-cv-northwind-meridian --doc-type nda --jurisdiction delaware
```

## Directory map

| Path | Role |
| --- | --- |
| `LEGAL.md` | Firm constitution (`AGENTS.md` analog) |
| `.legalrules.md` | Always-on firm constraints (`.cursorrules` analog) |
| `guides/` | Special guide files: ethics, review standards, citations, redlines, privilege, jurisdiction, memory writes |
| `skills/` | On-demand playbooks with trigger frontmatter |
| `context/` | Window budgets, retrieval policy, layer model |
| `context-packs/` | Conditional injection (doc type × jurisdiction) |
| `memory/` | Firm / client / jurisdiction / matter stores + write protocol |
| `schemas/` | Machine-checkable shapes for findings, redlines, memory records |
| `adapters/` | How to compile this pack into Harvey, a custom GPT, or Cursor itself |
| `examples/` | A worked NDA review pass using the sample matter |
| `runtime/` | Assembler, isolation, privilege gating, tests |

## What this pack does *not* do

- It does not replace a supervising attorney.
- It does not connect to a live DMS, conflict system, or court PACER.
- It does not store real client data. Sample memory is fictional and labeled as such.
- It does not authorize sending mail, filing, or committing a negotiation position.
