# PREIshare semantic search — requirements brief

This brief is the contract for the semantic search steps that come after it. It covers the problem and the scope only. It sets no database columns, no embedding model or vector size, no API shape and no UI component names; later design steps decide those and must meet this brief. If a later prompt asks for something this brief puts out of scope, cut it.

## Problem

PREIshare buyers describe what they want in everyday words, mixing lifestyle and investment goals: "quiet cabin near water with good rental upside." Keyword search only finds listings that contain the same words. A lakeside A-frame described as "secluded retreat on the shoreline, strong vacation-rental history" never says "cabin," "water," or "upside," so keyword search misses it, even though it's exactly what the buyer meant. This tutorial adds a small search that matches by meaning ("meaning-aware match"), not by shared words. It searches a small set of sample listings and shows the best matches first, so a buyer can find good homes they would otherwise miss.

## Actors

| Actor | Goal |
| --- | --- |
| Buyer / investor (signed in) | Type an intent in plain language and see sample listings ranked by how well they match that intent, even when the wording differs. |
| PREIshare builder / operator (us) | Show trustworthy matches on sample data, prove each success criterion in a demo, and hand off cleanly. |
| Coding agent | Build only what this brief puts in scope, and stop and ask when a step would go beyond it. |

How this fits the existing app:

- **Data:** search looks only at a separate, public, made-up **sample set** of listings. It does not read sponsors' private rows in `property_listings`, and it does not change their Row Level Security. The existing non-goal "Investors browsing sponsors' listings" (in `docs/sponsor-auth-requirements.md`) still stands.
- **Access:** the search page is for signed-in users only and sits behind the existing `/dashboard` sign-in check. This topic adds no new sign-in, sign-up or role work.

## Sample set (what the demo data must contain)

These are content rules, not a storage design. How the set is stored is decided later. The sample set must include at least:

- **A. Waterfront getaway:** a lakeside or riverside retreat with a vacation-rental track record. Its description must **not** contain the words "cabin," "water," or "upside."
- **B. Family suburban home:** near well-regarded schools and parks. Its description must **not** contain the words "family-friendly" or "schools."
- **C. Walkable city condo:** downtown, close to cafés and nightlife. Its description must **not** contain "walkable" or "restaurants."
- **D. Working farmland:** acreage for crops or livestock. This listing is used for the control check.
- At least **8 listings in total**, so a ranking is meaningful. Every listing must have a description of at least one full sentence.

All sample listings are made up. No real addresses or real people.

## Example queries (these drive later tests)

"Top 3" means the first three results the search returns for that query.

| # | Query | A good top result looks like… | Keyword search fails because… | Pass / fail check |
| --- | --- | --- | --- | --- |
| 1 | "quiet cabin near water with good rental upside" | A secluded place by a lake or river that already earns or could earn rental income. | The best match (A) uses none of "cabin," "water," or "upside." | Listing A is in the top 3. Listing D is not ranked #1. |
| 2 | "family-friendly home close to good schools" | A house in a calm neighborhood near schools and parks, with room for kids. | Listing B never says "family-friendly" or "schools." | Listing B is in the top 3. |
| 3 | "downtown condo walkable to restaurants" | A city unit where food and nightlife are a short walk away. | Listing C never says "walkable" or "restaurants." | Listing C is in the top 3. |
| 4 | "lake house I can rent out on weekends" (a reworded #1) | The same waterfront getaway as #1. | It shares almost no words with #1, yet means nearly the same thing. | Listing A is in the top 3, the same as for #1. |
| 5 (control) | "large acreage for growing crops" | The farmland listing; the cabins and condos are poor matches. | (Keyword search may work here; this checks that semantic search doesn't push unrelated listings above the obvious match.) | Listing D is ranked #1. Listings A, B and C are not in the top 3. |

## Success criteria (observable)

A stranger watching a demo should be able to mark each box pass or fail without asking us what "good" means. Boxes stay unticked here; later steps record their results in their verification notes.

- [ ] The sample set meets every rule in "Sample set" above (anyone can check this by reading the listings).
- [ ] Every sample listing has stored meaning data ("embedding") generated from its description. A count shows the same number of listings and of stored embeddings.
- [ ] Running a natural-language query returns a list ordered from best to worst match, with a visible score or rank number on every result.
- [ ] Queries 1–5 in the table above each meet their pass/fail check.
- [ ] For query 1, a plain keyword search (looking for the query's words in the descriptions) does **not** return listing A, while semantic search does. The demo shows both results side by side or one after the other.
- [ ] Running the same query twice on unchanged data returns the same top 3 in the same order.
- [ ] An empty or whitespace-only query shows a clear message and runs no search. It does not crash or show an error page.
- [ ] A signed-out visitor who opens the search page is sent to `/login`, like every other `/dashboard` page.
- [ ] Searching never shows any row from sponsors' private `property_listings`. Only sample listings appear.
- [ ] No secret key appears in the browser bundle, in network requests, in git, or in screenshots. Environment variables are named in docs only, never shown with values.
- [ ] A beginner can say in one sentence, for query 1, why keyword search fails and semantic search succeeds.

## In scope for this tutorial

- A plain-language explanation of embeddings and similarity (in later steps).
- A data design for the sample listings and their embeddings in Supabase PostgreSQL with pgvector, decided in the data-model step.
- A new migration that enables pgvector and stores the sample embeddings. Existing migrations are not edited.
- A TypeScript helper that creates an embedding for a piece of listing text.
- A seed/backfill path that loads the sample set and its embeddings.
- A similarity search (SQL plus a TypeScript helper) that returns ranked results.
- A minimal server endpoint and a simple React search page under `/dashboard` in TanStack Start.
- End-to-end verification notes against the criteria above, and a handoff doc.

## Out of scope (explicit non-goals)

- Searching sponsors' private `property_listings`, or changing their RLS policies.
- New authentication, roles, invites or sign-up changes (the existing sign-in check is reused as is).
- Map search, or filters such as price, beds, location or property type.
- Payments, messaging, saved searches, alerts or favorites.
- Production embedding operations: provider billing, rate-limit handling, queues, scheduled re-embedding, or large batch jobs.
- Advanced ranking: personalization, business rules, or tuning a hybrid of keyword and vector search. The keyword comparison in the success criteria is only a demo baseline, not a feature.
- Automatic embedding when a sponsor creates or edits a listing.
- Design polish beyond a readable, usable page, and any mobile app work.

## Assumptions and open questions

Assumptions:

- A free-tier Supabase project is enough for a sample set of this size.
- An embedding provider can be called from server-only code, with its key in Vercel and `.env.local` only and never in git or a `VITE_*` variable.
- The sample set is small (roughly 8–20 listings), so speed is not a concern for this tutorial.

Open questions (decided in later steps, then kept the same end to end):

- Which embedding provider and model to use, and therefore the vector size.
- Which distance measure to use (for example cosine), and whether to show a raw score or only a rank.
- Exactly how many sample listings there are, and who writes their text.
- How many results the page shows (at least 3, so the top-3 checks can be run).
- Whether a minimum match score should hide weak results, or whether every listing is always ranked.

## Handoff note for later steps

Each implementation step must point to the success criteria above that it moves forward, and the final verification must run queries 1–5 and record pass or fail for each. Any check that needs the real Supabase project or a browser stays "not run" until a human runs it.
