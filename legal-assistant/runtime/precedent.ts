import type { PrecedentRule } from "./types.ts"

export function matchPrecedentRules(
  rules: PrecedentRule[],
  documentType: string,
  jurisdiction: string | undefined,
  practiceAreas: string[] = [],
): PrecedentRule[] {
  return rules.filter((rule) => {
    const docOk = rule.document_types.includes(documentType)
    if (!docOk) {
      return false
    }
    const jurisdictionOk =
      rule.jurisdictions.includes("*") ||
      (jurisdiction !== undefined && rule.jurisdictions.includes(jurisdiction))
    if (!jurisdictionOk) {
      return false
    }
    if (rule.practice_areas && rule.practice_areas.length > 0) {
      const overlap = rule.practice_areas.some((area) => practiceAreas.includes(area))
      if (!overlap) {
        return false
      }
    }
    return true
  })
}
