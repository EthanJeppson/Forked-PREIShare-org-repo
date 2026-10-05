# Investor Listing Domain Brief (PREIshare)

Sprint 2, Topic 1 — Step 1 (domain map). Business language only: this document contains no code. The companion file is `docs/domain/listing-field-inventory.md`.

Items marked **TODO** are decisions I could not verify from the client story or the repo. They are collected in "Open questions (TODO)" below and must be confirmed before they are treated as final.

## Purpose

PREIshare shows investors property opportunities ("investor listings"). The client story says the team keeps getting production bugs from loose data: a missing price, a status spelled three different ways, and a nested address field that disappears on one screen.

This brief defines, in plain language, what an investor listing is, which states it can be in, which groups of data it contains, and what makes it valid. Later steps will turn this into TypeScript. Those later definitions must match this brief; the brief does not bend to fit the code.

## Actors

- **Listing editor (internal operations)** — creates and updates listings before investors see them. Needs to save incomplete work as a draft without being blocked.
- **Investor (end user)** — browses listings that are visible to investors and relies on every visible listing being complete and consistent.
- **Reviewer / compliance** — checks that status, price, address, and contact information are trustworthy before a listing becomes visible. TODO: confirm with the client whether this is a real role or part of the editor's job.
- **Listing contact (broker, owner representative, property manager)** — a person named on a listing whom an investor can reach. They are data on the listing, not users of the system in this sprint.
- **Future systems (website screens, API, database)** — all will read the same listing shape. Today the app is still the starter UI (`/` and `/about`), and no database is wired, so these are future consumers only.

## Business goals

- One shared definition of an investor listing for every screen and every teammate, so nobody invents their own fields.
- Catch missing or invalid data before it reaches production, ideally at build time once code definitions exist.
- Allow only the statuses and property classifications PREIshare actually uses, so there is exactly one spelling of each.
- Keep real-world nested data intact: the address, the financial summary, the investor contacts, and the ownership details travel together with the listing.
- Let editors save unfinished drafts, while making sure nothing incomplete is shown to investors.

## Listing lifecycle statuses (closed list)

A listing has exactly one status at a time. The allowed values are exactly these five, spelled exactly like this, in lowercase with underscores. Free text, other spellings, and other values are not allowed.

| Status | Meaning | Visible to investors? | Must meet the full validity rules? |
| --- | --- | --- | --- |
| `draft` | Being prepared by the internal team | No | No — may be incomplete |
| `published` | Open for investors to review | Yes | Yes |
| `under_offer` | An offer is in progress; still shown, still structured like a published listing | Yes | Yes |
| `sold` | The deal has closed; kept for history | Yes (TODO: confirm investors should still see sold listings) | Yes |
| `archived` | Removed from active browsing; never deleted | No | TODO: decide (see open questions) |

"Investor-visible statuses" in this project means `published`, `under_offer`, and `sold`. Any rule below that mentions investor-visible listings applies to those three.

Allowed property classifications are also a closed list (see the field inventory): `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`.

## Nested data groups

A listing is not one flat record. It has four groups of related data. Each group is described in detail, field by field, in the field inventory.

- **Address (one group, always one address per listing)** — street line, optional second line, city, region/state, postal code, country. Together these must be enough to locate the property.
- **Financial summary (one group)** — asking price and currency, plus two optional return figures the team may track (projected return and cap rate).
- **Investor contacts (a list, one or more entries)** — each entry is a person with an identifier, a name, a role on the listing, and at least one way to reach them (email or phone).
- **Ownership (a list)** — each entry links one contact to the property with a fixed relationship (for example primary owner or co-owner) and an optional ownership share.

## Core identity fields

These sit directly on the listing, outside the nested groups:

- Listing id — stable and unique; never reused.
- Title — the short, human-readable name investors see.
- Description — a short investor-facing summary.
- Status — one value from the closed list above.
- Property classification (`propertyType`) — one value from the closed list in the field inventory.
- Created and updated times — when the listing record was created and last meaningfully changed.

## Success criteria for a valid listing

A listing is **valid for investors** when all of the following are true. This list is the checklist for rejecting bad agent output, so keep the numbering stable.

1. The listing has a non-empty id and a non-empty title.
2. The status is exactly one of: `draft`, `published`, `under_offer`, `sold`, `archived`. No other spelling or free text.
3. The property classification is exactly one of: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`.
4. The address is a nested group (not loose top-level fields) and includes street line, city, region/state, postal code, and country, all non-empty.
5. The financial summary is a nested group (not loose top-level fields) with a numeric asking price greater than zero and a currency from the allowed currency list.
6. The contacts are a list with at least one entry, and every entry has a non-empty name and at least one reachable channel (email or phone).
7. Every contact has a role from the fixed role list, and every ownership entry uses a relationship from the fixed relationship list. No free text.
8. Every ownership entry refers to a contact that exists on the same listing, and every contact on the listing is referred to by at least one ownership entry. TODO: confirm with the client.
9. If ownership shares are given, each is between 0 and 100, and the shares on one listing add up to no more than 100.
10. The description is present and non-empty for investor-visible statuses.
11. Created and updated times are present, and updated is not earlier than created.
12. Criteria 4 through 10 must hold for `published`, `under_offer`, and `sold`. A `draft` only needs criteria 1, 2, 3, and 11. Optional fields may be absent in every status.

Anything not listed here (for example a field called "details", "metadata", or "notes") is not part of a valid listing.

## Out of scope

- Building screens or forms for listings.
- API routes and database tables or Supabase wiring (none exists in the repo yet).
- Authentication, user roles, and permissions.
- Payments, offers, and document uploads.
- Exact TypeScript syntax and sample data files (later steps).
- Lint, tests, and CI setup.

## Open questions (TODO)

None of these can be answered from the repo, so each is a proposed default for the client or instructor to confirm.

1. **Archived listings** — must they stay fully valid, or only keep their identity and status? Proposed: no extra validity rules beyond criteria 1, 2, 3, and 11.
2. **Sold listings** — should investors still see them? Proposed: yes, as history.
3. **Reviewer role** — is there a separate approver, or does the editor publish directly?
4. **Currencies** — which are allowed? Proposed: `USD` only for now; add others only after the client names them.
5. **Country format** — proposed: two-letter uppercase country code such as `US`.
6. **Money format** — proposed: asking price is a whole-number or decimal amount in the major currency unit (dollars, not cents).
7. **Contact roles and ownership relationships** — the lists in the field inventory are proposals taken from the lesson scaffold, not from the client.
8. **Contact ids** — I added an id to each contact so that ownership entries can point at a contact unambiguously. The lesson scaffold used "name or id" in one field, which is ambiguous when two contacts share a name.
9. **Time format** — proposed: international date-time text in UTC, for example `2026-03-01T10:00:00Z`.

## Handoff note

Later steps must define code that honors this brief and `docs/domain/listing-field-inventory.md`. If a definition allows a status, property classification, field, or group that is not listed in these two files, the definition is wrong. If a rule here turns out to be unworkable, change these documents first, then the code. Do not rename or move these files; later steps look for them at these exact paths.
