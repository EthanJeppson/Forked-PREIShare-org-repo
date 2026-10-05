export const PRIVILEGE_RANK = {
  public: 0,
  confidential: 1,
  attorney_client: 2,
  work_product: 3,
  highly_restricted: 4,
} as const

export type PrivilegeClass = keyof typeof PRIVILEGE_RANK

export type ContextLayer =
  | "ethical_invariants"
  | "firm_rules"
  | "matter_constitution"
  | "privilege_policy"
  | "jurisdiction"
  | "client_preferences"
  | "skill"
  | "working_documents"
  | "session"

export const LAYER_PRIORITY: ContextLayer[] = [
  "ethical_invariants",
  "firm_rules",
  "matter_constitution",
  "privilege_policy",
  "jurisdiction",
  "client_preferences",
  "skill",
  "working_documents",
  "session",
]

export type Task =
  | "review"
  | "redline"
  | "privilege-screen"
  | "log"
  | "memo"
  | "cite-check"

export type MatterState = {
  matter_id: string
  client_id: string
  caption?: string
  supervising_attorney: string
  privilege_class_default: PrivilegeClass
  governing_law: string
  forum?: string
  ethical_wall?: boolean
  walled_from_matter_ids?: string[]
  related_matter_ids?: string[]
  practice_areas?: string[]
}

export type AssembleRequest = {
  matterId: string
  documentType: string
  jurisdiction?: string
  privilegeClass: PrivilegeClass
  task: Task
  attorneyId: string
  workingDocumentPaths?: string[]
  sessionInstructions?: string
  enableWebResearch?: boolean
}

export type ContextSlice = {
  layer: ContextLayer
  path: string
  content: string
  tokensEstimate: number
  always: boolean
}

export type ToolPolicy = {
  dms_read: boolean
  dms_write_final: boolean
  web_research: boolean
  email_send: boolean
  court_file: boolean
  memory_write_proposed: boolean
  memory_write_active: boolean
}

export type OmittedSlice = {
  path: string
  reason: string
}

export type AssembledContext = {
  matterId: string
  clientId: string
  slices: ContextSlice[]
  omitted: OmittedSlice[]
  toolPolicy: ToolPolicy
  skillsLoaded: string[]
  contextPackIds: string[]
  warnings: string[]
  matchingPrecedentRuleIds: string[]
}

export type PrecedentRule = {
  id: string
  statement: string
  severity: "hard_stop" | "partner_approval" | "material" | "housekeeping" | "note"
  document_types: string[]
  jurisdictions: string[]
  practice_areas?: string[]
  exception_if?: string
  owner?: string
  last_reviewed?: string
}

export type MemoryLayer = "firm" | "client" | "jurisdiction" | "matter" | "session"

export type MemoryRecord = {
  id: string
  layer: MemoryLayer
  scope_id: string
  statement: string
  status: "proposed" | "active" | "superseded"
  confidence: "verified_in_context" | "unverified" | "split"
  as_of: string
  observed_at: string
  author: string
  source_document_ids?: string[]
  supersedes?: string
  precedent_rule_id?: string
}

export type ContextPack = {
  id: string
  always_apply?: boolean
  triggers: {
    document_types?: string[]
    tasks?: string[]
    jurisdictions?: string[]
  }
  guides?: string[]
  skills?: string[]
  memory?: string[]
  tools_override?: Partial<ToolPolicy>
}

export type ContextSettings = {
  window: {
    max_input_tokens: number
    chars_per_token_estimate: number
    layer_budgets: Partial<Record<ContextLayer, number>>
    drop_order: string[]
    never_drop: string[]
  }
  injection: {
    always: string[]
    if_not_public: string[]
    if_redline: string[]
    jurisdiction_guide: string
  }
  tools: {
    default: ToolPolicy
    web_research_requires: {
      privilege_class: PrivilegeClass[]
      attorney_enable: boolean
    }
  }
}
