import fs from "node:fs"
import path from "node:path"
import type {
  AssembleRequest,
  AssembledContext,
  ContextLayer,
  ContextPack,
  ContextSettings,
  ContextSlice,
  MatterState,
  OmittedSlice,
  PrecedentRule,
} from "./types.ts"
import { LAYER_PRIORITY } from "./types.ts"
import { estimateTokens, packRootFromRuntimeDir } from "./paths.ts"
import { matchPrecedentRules } from "./precedent.ts"
import { toolPolicyFor } from "./privilege.ts"

export { packRootFromRuntimeDir as defaultPackRoot }

export function forbiddenWorkingPath(relPath: string, matter: MatterState): string | undefined {
  const normalized = relPath.replaceAll("\\", "/")
  const matterMatch = /memory\/matters\/([^/]+)/.exec(normalized)
  if (matterMatch) {
    const otherId = matterMatch[1]
    if (otherId !== matter.matter_id) {
      const walled =
        matter.ethical_wall === true || (matter.walled_from_matter_ids ?? []).includes(otherId)
      if (walled) {
        return `ethical wall blocks matter ${otherId}`
      }
      if (!(matter.related_matter_ids ?? []).includes(otherId)) {
        return `cross-matter retrieval of ${otherId} is not on related_matter_ids`
      }
    }
  }
  const clientMatch = /memory\/clients\/([^/]+)/.exec(normalized)
  if (clientMatch && clientMatch[1] !== matter.client_id) {
    return `cross-client retrieval of ${clientMatch[1]} is forbidden`
  }
  return undefined
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
}

function tryRead(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined
  }
  return fs.readFileSync(filePath, "utf8")
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replaceAll(/\{([a-z_]+)\}/g, (_full, key: string) => vars[key] ?? "")
}

function loadContextPacks(root: string): ContextPack[] {
  const dir = path.join(root, "context-packs")
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson<ContextPack>(path.join(dir, name)))
}

function packMatches(pack: ContextPack, request: AssembleRequest): boolean {
  const types = pack.triggers.document_types ?? []
  if (types.length > 0 && !types.includes(request.documentType)) {
    return false
  }
  const tasks = pack.triggers.tasks ?? []
  if (tasks.length > 0 && !tasks.includes(request.task)) {
    return false
  }
  const jurisdictions = pack.triggers.jurisdictions ?? []
  if (
    jurisdictions.length > 0 &&
    request.jurisdiction !== undefined &&
    !jurisdictions.includes(request.jurisdiction)
  ) {
    return false
  }
  return true
}

function pushSlice(
  slices: ContextSlice[],
  omitted: OmittedSlice[],
  layer: ContextLayer,
  relPath: string,
  absPath: string,
  always: boolean,
  charsPerToken: number,
): void {
  const content = tryRead(absPath)
  if (content === undefined) {
    omitted.push({ path: relPath, reason: "file not found" })
    return
  }
  slices.push({
    layer,
    path: relPath,
    content,
    tokensEstimate: estimateTokens(content, charsPerToken),
    always,
  })
}

function neverDropSlice(slice: ContextSlice, neverDrop: string[]): boolean {
  if (neverDrop.includes(slice.layer)) {
    return true
  }
  if (neverDrop.includes("matter_taken_positions")) {
    return (
      slice.path.endsWith("decisions-log.md") || slice.path.endsWith("defined-terms.lock.json")
    )
  }
  return slice.always && slice.layer === "ethical_invariants"
}

export function applyBudget(
  slices: ContextSlice[],
  settings: ContextSettings,
): { slices: ContextSlice[]; omitted: OmittedSlice[] } {
  const omitted: OmittedSlice[] = []
  const byLayer = new Map<ContextLayer, ContextSlice[]>()
  for (const layer of LAYER_PRIORITY) {
    byLayer.set(layer, [])
  }
  for (const slice of slices) {
    byLayer.get(slice.layer)?.push(slice)
  }

  const capped: ContextSlice[] = []
  for (const layer of LAYER_PRIORITY) {
    const budget = settings.window.layer_budgets[layer]
    const layerSlices = byLayer.get(layer) ?? []
    if (budget === undefined) {
      capped.push(...layerSlices)
      continue
    }
    let used = 0
    for (const slice of layerSlices) {
      if (used + slice.tokensEstimate <= budget || neverDropSlice(slice, settings.window.never_drop)) {
        capped.push(slice)
        used += slice.tokensEstimate
      } else {
        omitted.push({ path: slice.path, reason: `layer budget exceeded for ${layer}` })
      }
    }
  }

  let total = capped.reduce((sum, slice) => sum + slice.tokensEstimate, 0)
  const kept = [...capped]
  for (const dropLayer of settings.window.drop_order) {
    if (total <= settings.window.max_input_tokens) {
      break
    }
    for (let i = kept.length - 1; i >= 0; i -= 1) {
      if (total <= settings.window.max_input_tokens) {
        break
      }
      const slice = kept[i]
      if (slice.layer !== dropLayer) {
        continue
      }
      if (neverDropSlice(slice, settings.window.never_drop)) {
        continue
      }
      total -= slice.tokensEstimate
      omitted.push({ path: slice.path, reason: `window overflow dropped ${dropLayer}` })
      kept.splice(i, 1)
    }
  }

  kept.sort((a, b) => LAYER_PRIORITY.indexOf(a.layer) - LAYER_PRIORITY.indexOf(b.layer))
  return { slices: kept, omitted }
}

export function assembleContext(
  request: AssembleRequest,
  root: string = packRootFromRuntimeDir(),
): AssembledContext {
  if (!request.matterId.trim()) {
    throw new Error("matter_id is required")
  }

  const settings = readJson<ContextSettings>(path.join(root, "context/settings.json"))
  const chars = settings.window.chars_per_token_estimate
  const matterDir = path.join(root, "memory/matters", request.matterId)
  const statePath = path.join(matterDir, "matter-state.json")
  if (!fs.existsSync(statePath)) {
    throw new Error(`unknown matter: ${request.matterId}`)
  }
  const matter = readJson<MatterState>(statePath)
  if (matter.client_id.length === 0 || matter.supervising_attorney.length === 0) {
    throw new Error(`matter ${request.matterId} is missing client_id or supervising_attorney`)
  }

  const warnings: string[] = []
  const omitted: OmittedSlice[] = []
  const slices: ContextSlice[] = []
  const vars = {
    matter_id: matter.matter_id,
    client_id: matter.client_id,
    jurisdiction: request.jurisdiction ?? matter.governing_law,
  }

  const add = (layer: ContextLayer, relPath: string, always: boolean): void => {
    const isolated = forbiddenWorkingPath(relPath, matter)
    if (isolated) {
      omitted.push({ path: relPath, reason: isolated })
      return
    }
    pushSlice(slices, omitted, layer, relPath, path.join(root, relPath), always, chars)
  }

  for (const rel of settings.injection.always) {
    const layer: ContextLayer = rel.includes("00-ethical") ? "ethical_invariants" : "firm_rules"
    add(layer, rel, true)
  }
  add("firm_rules", settings.injection.jurisdiction_guide, true)
  add("firm_rules", "memory/firm/house-style.md", false)
  add("firm_rules", "memory/firm/precedent-rules.json", true)

  if (request.privilegeClass !== "public") {
    for (const rel of settings.injection.if_not_public) {
      add("privilege_policy", rel, true)
    }
  }
  if (request.task === "redline" || request.task === "review") {
    for (const rel of settings.injection.if_redline) {
      add("firm_rules", rel, false)
    }
  }

  add("matter_constitution", `memory/matters/${matter.matter_id}/MATTER.md`, true)
  add("matter_constitution", `memory/matters/${matter.matter_id}/matter-state.json`, true)
  add("matter_constitution", `memory/matters/${matter.matter_id}/decisions-log.md`, true)
  add("matter_constitution", `memory/matters/${matter.matter_id}/defined-terms.lock.json`, true)
  add("matter_constitution", `memory/matters/${matter.matter_id}/parties.md`, false)
  add("matter_constitution", `memory/matters/${matter.matter_id}/issues.md`, false)
  add("matter_constitution", `memory/matters/${matter.matter_id}/chronology.md`, false)
  add("matter_constitution", `memory/matters/${matter.matter_id}/open-questions.md`, false)
  add("matter_constitution", `memory/matters/${matter.matter_id}/document-index.md`, false)

  const jurisdictionIds = new Set<string>([matter.governing_law])
  if (request.jurisdiction) {
    jurisdictionIds.add(request.jurisdiction)
  }
  if (request.jurisdiction && request.jurisdiction !== matter.governing_law) {
    warnings.push(
      `request jurisdiction ${request.jurisdiction} differs from matter governing_law ${matter.governing_law}`,
    )
  }
  for (const id of jurisdictionIds) {
    const rel = `memory/jurisdictions/${id}.md`
    const abs = path.join(root, rel)
    if (fs.existsSync(abs)) {
      add("jurisdiction", rel, false)
    } else {
      warnings.push(`missing jurisdiction memory for ${id}`)
      add("jurisdiction", "memory/jurisdictions/_template.md", false)
    }
  }

  add("client_preferences", `memory/clients/${matter.client_id}/preferences.md`, false)
  add("client_preferences", `memory/clients/${matter.client_id}/style.md`, false)
  add("client_preferences", `memory/clients/${matter.client_id}/risk-tolerance.md`, false)

  const packs = loadContextPacks(root).filter((pack) => packMatches(pack, request))
  const skillsLoaded: string[] = []
  let packOverride: ContextPack["tools_override"]
  for (const pack of packs) {
    for (const guide of pack.guides ?? []) {
      add("firm_rules", guide, false)
    }
    for (const skill of pack.skills ?? []) {
      add("skill", `skills/${skill}/SKILL.md`, false)
      skillsLoaded.push(skill)
    }
    for (const memoryPath of pack.memory ?? []) {
      add("matter_constitution", interpolate(memoryPath, vars), false)
    }
    if (pack.tools_override) {
      packOverride = { ...packOverride, ...pack.tools_override }
    }
  }

  for (const rel of request.workingDocumentPaths ?? []) {
    const isolated = forbiddenWorkingPath(rel, matter)
    if (isolated) {
      omitted.push({ path: rel, reason: isolated })
      continue
    }
    pushSlice(
      slices,
      omitted,
      "working_documents",
      rel,
      path.join(root, rel),
      false,
      chars,
    )
  }

  if (request.sessionInstructions) {
    slices.push({
      layer: "session",
      path: "session://instructions",
      content: request.sessionInstructions,
      tokensEstimate: estimateTokens(request.sessionInstructions, chars),
      always: false,
    })
  }

  const uniqueSlices: ContextSlice[] = []
  const seenPaths = new Set<string>()
  for (const slice of slices) {
    if (seenPaths.has(slice.path)) {
      continue
    }
    seenPaths.add(slice.path)
    uniqueSlices.push(slice)
  }

  const budgeted = applyBudget(uniqueSlices, settings)

  const firmBook = readJson<{ rules: PrecedentRule[] }>(
    path.join(root, "memory/firm/precedent-rules.json"),
  )
  const matching = matchPrecedentRules(
    firmBook.rules,
    request.documentType,
    request.jurisdiction ?? matter.governing_law,
    matter.practice_areas ?? [],
  )

  const toolPolicy = toolPolicyFor(
    settings.tools.default,
    request.privilegeClass,
    request.enableWebResearch === true,
    settings.tools.web_research_requires.privilege_class,
    packOverride,
  )

  return {
    matterId: matter.matter_id,
    clientId: matter.client_id,
    slices: budgeted.slices,
    omitted: [...omitted, ...budgeted.omitted],
    toolPolicy,
    skillsLoaded: [...new Set(skillsLoaded)],
    contextPackIds: packs.map((pack) => pack.id),
    warnings,
    matchingPrecedentRuleIds: matching.map((rule) => rule.id),
  }
}
