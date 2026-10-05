# Memory schema

Persistent memory is **scoped files**, not a chat transcript and not a vendor-global profile.

## Stores

```
memory/
  firm/              # analog of repo-wide architecture decisions
  clients/           # analog of user rules — but per client, never global
  jurisdictions/     # analog of language/framework notes, time-indexed
  matters/           # analog of the current repo + issue tracker
```

## Record shape

Machine records (precedent rules, proposed writes, defined-term locks) use JSON and must validate against `schemas/memory-record.schema.json` or the specialized schemas.

Human records (MATTER.md, chronology) are markdown with a YAML/JSON header where the runtime needs keys.

## Mutability

See `guides/06-memory-write-protocol.md`. The runtime `validateMemoryWrite` rejects:

- writes to ethical invariants
- `status: active` from the model
- client facts with `layer: firm`
- cross-scope ids (client memory whose `scope_id` is not the active client)
- missing `as_of` / `author`

## Real deployments

Gitignore live `memory/clients/*` and `memory/matters/*` except `_template/` and labeled fixtures. Vault them with the DMS. Fixtures in this pack are fictional.
