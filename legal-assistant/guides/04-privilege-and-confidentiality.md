---
id: privilege-and-confidentiality
always_apply: true
---

# Privilege and confidentiality

Privilege is a **runtime type** of the assembled context, not a disclaimer at the end of an answer.

## Classes

| `privilege_class` | Typical examples | Web research | Email / send | Global memory |
| --- | --- | --- | --- | --- |
| `public` | Filed, non-sealed pleadings; press | Allowed if attorney enables | Allowed if attorney enables | Still no client facts |
| `confidential` | Draft contracts, business terms | Off by default | Off | Forbidden |
| `attorney_client` | Legal advice communications | Off | Off | Forbidden |
| `work_product` | Internal memos, review notes, strategy | Off | Off | Forbidden |
| `highly_restricted` | Ethical wall, criminal, special counsel | Off | Off | Forbidden |

If the working set is mixed, the **strictest** class wins for tool policy.

## Production and logs

- Privilege log skills must not put narrative legal advice in a log description field.
- Context manifests stored for audit should record *paths loaded*, not paste privileged body text into a non-privileged store.
- Do not use client-identifying filenames in screenshots or vendor tickets.

## Ethical walls

Wall metadata lives on the matter file (`ethical_wall`, `walled_from_matter_ids`). The assembler enforces this; a chat override is a failed invariant, not a configuration option.
