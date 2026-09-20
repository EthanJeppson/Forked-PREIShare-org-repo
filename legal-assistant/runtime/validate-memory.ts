import type { MemoryRecord } from "./types.ts"

export type MemoryWriteContext = {
  actor: "model" | "attorney"
  activeClientId: string
  activeMatterId: string
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function validateMemoryWrite(
  record: MemoryRecord,
  ctx: MemoryWriteContext,
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = []

  if (!record.id) {
    errors.push("id is required")
  }
  if (!record.statement?.trim()) {
    errors.push("statement is required")
  }
  if (!record.author || record.author === "assistant") {
    errors.push("author must be a named attorney, not the assistant")
  }
  if (!DATE_RE.test(record.as_of)) {
    errors.push("as_of must be an ISO date")
  }
  if (!DATE_RE.test(record.observed_at)) {
    errors.push("observed_at must be an ISO date")
  }

  if (ctx.actor === "model" && record.status !== "proposed") {
    errors.push("the model may only write status=proposed")
  }

  if (record.layer === "client" && record.scope_id !== ctx.activeClientId) {
    errors.push("client memory scope_id must match the active client")
  }
  if (record.layer === "matter" && record.scope_id !== ctx.activeMatterId) {
    errors.push("matter memory scope_id must match the active matter")
  }
  if (record.layer === "firm" && ctx.actor === "model" && record.status === "active") {
    errors.push("firm precedent cannot be activated by the model")
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }
  return { ok: true }
}
