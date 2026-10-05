import { assembleContext, defaultPackRoot } from "./assemble-context.ts"
import type { PrivilegeClass, Task } from "./types.ts"

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1) {
    return undefined
  }
  return process.argv[index + 1]
}

const assembled = assembleContext(
  {
    matterId: arg("matter") ?? "2026-cv-northwind-meridian",
    documentType: arg("doc-type") ?? "nda",
    jurisdiction: arg("jurisdiction"),
    privilegeClass: (arg("privilege") ?? "confidential") as PrivilegeClass,
    task: (arg("task") ?? "review") as Task,
    attorneyId: arg("attorney") ?? "a.reyes",
    workingDocumentPaths: [arg("doc") ?? "examples/NDA-MER-v3.excerpt.md"],
    sessionInstructions: arg("session") ?? "Review v3 against the decision log. Do not send.",
    enableWebResearch: process.argv.includes("--web"),
  },
  defaultPackRoot(),
)

const manifest = {
  matterId: assembled.matterId,
  clientId: assembled.clientId,
  toolPolicy: assembled.toolPolicy,
  skillsLoaded: assembled.skillsLoaded,
  contextPackIds: assembled.contextPackIds,
  matchingPrecedentRuleIds: assembled.matchingPrecedentRuleIds,
  warnings: assembled.warnings,
  slices: assembled.slices.map((slice) => ({
    layer: slice.layer,
    path: slice.path,
    tokensEstimate: slice.tokensEstimate,
    always: slice.always,
  })),
  omitted: assembled.omitted,
}

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`)
