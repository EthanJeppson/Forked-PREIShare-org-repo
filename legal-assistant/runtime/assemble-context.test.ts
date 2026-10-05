import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { applyBudget, assembleContext, forbiddenWorkingPath } from "./assemble-context.ts"
import { packRootFromRuntimeDir } from "./paths.ts"
import { matchPrecedentRules } from "./precedent.ts"
import { toolPolicyFor, webResearchAllowed } from "./privilege.ts"
import type { ContextSettings, MatterState, PrecedentRule } from "./types.ts"
import { validateMemoryWrite } from "./validate-memory.ts"

const root = packRootFromRuntimeDir()

const northwindRequest = {
  matterId: "2026-cv-northwind-meridian",
  documentType: "nda",
  jurisdiction: "delaware",
  privilegeClass: "confidential" as const,
  task: "review" as const,
  attorneyId: "a.reyes",
  workingDocumentPaths: ["examples/NDA-MER-v3.excerpt.md"],
  sessionInstructions: "Review v3. Do not send.",
}

describe("assembleContext", () => {
  it("loads layered firm, matter, client, skill, and working document context", () => {
    const assembled = assembleContext(northwindRequest, root)
    const paths = assembled.slices.map((slice) => slice.path)

    assert.equal(assembled.matterId, "2026-cv-northwind-meridian")
    assert.equal(assembled.clientId, "acme-holdings")
    assert.ok(paths.includes("guides/00-ethical-invariants.md"))
    assert.ok(paths.includes(".legalrules.md"))
    assert.ok(paths.includes("LEGAL.md"))
    assert.ok(paths.includes("memory/matters/2026-cv-northwind-meridian/decisions-log.md"))
    assert.ok(paths.includes("memory/matters/2026-cv-northwind-meridian/defined-terms.lock.json"))
    assert.ok(paths.includes("memory/clients/acme-holdings/preferences.md"))
    assert.ok(paths.includes("memory/jurisdictions/delaware.md"))
    assert.ok(paths.includes("skills/nda-review/SKILL.md"))
    assert.ok(paths.includes("examples/NDA-MER-v3.excerpt.md"))
    assert.deepEqual(assembled.skillsLoaded, ["nda-review"])
    assert.ok(assembled.contextPackIds.includes("nda"))
    assert.equal(assembled.slices[0]?.layer, "ethical_invariants")
  })

  it("never injects another client's memory into this matter", () => {
    const assembled = assembleContext(northwindRequest, root)
    const blob = assembled.slices.map((slice) => slice.content).join("\n")
    assert.equal(blob.includes("GLOBEX-SECRET-PREFERENCE-NEVER-INJECT"), false)
    assert.equal(
      assembled.slices.some((slice) => slice.path.includes("globex-industries")),
      false,
    )
  })

  it("remembers taken case positions from the decision log across documents", () => {
    const assembled = assembleContext(northwindRequest, root)
    const decisions = assembled.slices.find((slice) => slice.path.endsWith("decisions-log.md"))
    assert.ok(decisions)
    assert.match(decisions.content, /DEC-01/)
    assert.match(decisions.content, /Reject residuals/)
    assert.match(decisions.content, /taken_with_counterparty/)
  })

  it("disables web and outbound tools for confidential review even if the attorney asks for web", () => {
    const assembled = assembleContext(
      { ...northwindRequest, enableWebResearch: true },
      root,
    )
    assert.equal(assembled.toolPolicy.web_research, false)
    assert.equal(assembled.toolPolicy.email_send, false)
    assert.equal(assembled.toolPolicy.court_file, false)
    assert.equal(assembled.toolPolicy.memory_write_active, false)
    assert.equal(assembled.toolPolicy.memory_write_proposed, true)
  })

  it("allows web research only for public documents when the attorney enables it", () => {
    const assembled = assembleContext(
      {
        ...northwindRequest,
        privilegeClass: "public",
        enableWebResearch: true,
      },
      root,
    )
    assert.equal(assembled.toolPolicy.web_research, true)
    assert.equal(assembled.toolPolicy.email_send, false)
  })

  it("matches NDA firm precedents and not California employment hard stops", () => {
    const assembled = assembleContext(northwindRequest, root)
    assert.ok(assembled.matchingPrecedentRuleIds.includes("HQ-NDA-RESIDUALS"))
    assert.ok(assembled.matchingPrecedentRuleIds.includes("HQ-K-AI-TRAINING"))
    assert.equal(assembled.matchingPrecedentRuleIds.includes("HQ-EMP-CA-NONCOMPETE"), false)
    assert.equal(assembled.matchingPrecedentRuleIds.includes("HQ-K-SANDBAG-NY"), false)
  })

  it("omits walled and cross-matter working documents", () => {
    const assembled = assembleContext(
      {
        matterId: "2026-wall-demo",
        documentType: "nda",
        privilegeClass: "highly_restricted",
        task: "review",
        attorneyId: "n.park",
        workingDocumentPaths: [
          "memory/matters/2026-cv-northwind-meridian/MATTER.md",
          "memory/clients/acme-holdings/preferences.md",
        ],
      },
      root,
    )
    assert.equal(assembled.clientId, "globex-industries")
    const omittedPaths = assembled.omitted.map((row) => row.path)
    assert.ok(omittedPaths.includes("memory/matters/2026-cv-northwind-meridian/MATTER.md"))
    assert.ok(omittedPaths.includes("memory/clients/acme-holdings/preferences.md"))
    const blob = assembled.slices.map((slice) => slice.content).join("\n")
    assert.match(blob, /GLOBEX-SECRET-PREFERENCE-NEVER-INJECT/)
    assert.equal(blob.includes("evaluation of a spare-parts supply"), false)
  })

  it("throws when matter_id is missing or unknown", () => {
    assert.throws(() => assembleContext({ ...northwindRequest, matterId: "" }, root), /matter_id/)
    assert.throws(
      () => assembleContext({ ...northwindRequest, matterId: "no-such-matter" }, root),
      /unknown matter/,
    )
  })
})

describe("isolation helpers", () => {
  const matter: MatterState = {
    matter_id: "2026-cv-northwind-meridian",
    client_id: "acme-holdings",
    supervising_attorney: "a.reyes",
    privilege_class_default: "confidential",
    governing_law: "delaware",
    ethical_wall: false,
    walled_from_matter_ids: [],
    related_matter_ids: [],
  }

  it("forbids sibling matters and other clients", () => {
    assert.match(
      forbiddenWorkingPath("memory/matters/2026-wall-demo/MATTER.md", matter) ?? "",
      /cross-matter/,
    )
    assert.match(
      forbiddenWorkingPath("memory/clients/globex-industries/preferences.md", matter) ?? "",
      /cross-client/,
    )
    assert.equal(forbiddenWorkingPath("examples/NDA-MER-v3.excerpt.md", matter), undefined)
  })
})

describe("privilege tool gating", () => {
  it("treats web research as a privilege-typed tool", () => {
    assert.equal(webResearchAllowed("confidential", true, ["public"]), false)
    assert.equal(webResearchAllowed("public", false, ["public"]), false)
    assert.equal(webResearchAllowed("public", true, ["public"]), true)
  })

  it("never enables filing or final DMS writes from defaults", () => {
    const policy = toolPolicyFor(
      {
        dms_read: true,
        dms_write_final: true,
        web_research: true,
        email_send: true,
        court_file: true,
        memory_write_proposed: true,
        memory_write_active: true,
      },
      "public",
      true,
      ["public"],
    )
    assert.equal(policy.court_file, false)
    assert.equal(policy.dms_write_final, false)
    assert.equal(policy.memory_write_active, false)
    assert.equal(policy.web_research, true)
  })
})

describe("validateMemoryWrite", () => {
  const ctx = {
    actor: "model" as const,
    activeClientId: "acme-holdings",
    activeMatterId: "2026-cv-northwind-meridian",
  }

  const proposed = {
    id: "MEM-1",
    layer: "matter" as const,
    scope_id: "2026-cv-northwind-meridian",
    statement: "v3 reintroduced residuals; keep DEC-01.",
    status: "proposed" as const,
    confidence: "verified_in_context" as const,
    as_of: "2026-09-18",
    observed_at: "2026-09-18",
    author: "a.reyes",
    source_document_ids: ["NDA-MER-v3"],
  }

  it("accepts a proposed matter record attributed to the attorney", () => {
    assert.deepEqual(validateMemoryWrite(proposed, ctx), { ok: true })
  })

  it("rejects model activation, assistant authorship, and cross-client scope", () => {
    const active = validateMemoryWrite({ ...proposed, status: "active" }, ctx)
    assert.equal(active.ok, false)

    const bot = validateMemoryWrite({ ...proposed, author: "assistant" }, ctx)
    assert.equal(bot.ok, false)

    const leak = validateMemoryWrite(
      { ...proposed, layer: "client", scope_id: "globex-industries" },
      ctx,
    )
    assert.equal(leak.ok, false)
  })
})

describe("applyBudget", () => {
  it("never drops ethical invariants to keep working text", () => {
    const settings: ContextSettings = {
      window: {
        max_input_tokens: 50,
        chars_per_token_estimate: 4,
        layer_budgets: {},
        drop_order: ["working_documents", "session"],
        never_drop: ["ethical_invariants", "firm_rules", "privilege_policy", "matter_taken_positions"],
      },
      injection: {
        always: [],
        if_not_public: [],
        if_redline: [],
        jurisdiction_guide: "guides/05-jurisdiction-routing.md",
      },
      tools: {
        default: {
          dms_read: true,
          dms_write_final: false,
          web_research: false,
          email_send: false,
          court_file: false,
          memory_write_proposed: true,
          memory_write_active: false,
        },
        web_research_requires: { privilege_class: ["public"], attorney_enable: true },
      },
    }

    const result = applyBudget(
      [
        {
          layer: "ethical_invariants",
          path: "guides/00-ethical-invariants.md",
          content: "ethics ".repeat(20),
          tokensEstimate: 40,
          always: true,
        },
        {
          layer: "working_documents",
          path: "examples/NDA-MER-v3.excerpt.md",
          content: "clause ".repeat(40),
          tokensEstimate: 80,
          always: false,
        },
      ],
      settings,
    )

    assert.equal(result.slices.some((slice) => slice.layer === "ethical_invariants"), true)
    assert.equal(result.slices.some((slice) => slice.layer === "working_documents"), false)
  })
})

describe("matchPrecedentRules", () => {
  const rules: PrecedentRule[] = [
    {
      id: "STAR",
      statement: "all ndas",
      severity: "hard_stop",
      document_types: ["nda"],
      jurisdictions: ["*"],
    },
    {
      id: "CA-ONLY",
      statement: "ca employment",
      severity: "hard_stop",
      document_types: ["nda"],
      jurisdictions: ["california"],
      practice_areas: ["employment"],
    },
  ]

  it("requires both document type and jurisdiction, plus practice area when listed", () => {
    const matched = matchPrecedentRules(rules, "nda", "delaware", ["commercial-contracts"])
    assert.deepEqual(
      matched.map((rule) => rule.id),
      ["STAR"],
    )
  })
})
