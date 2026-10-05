import type { PrivilegeClass, ToolPolicy } from "./types.ts"
import { PRIVILEGE_RANK } from "./types.ts"

export function stricterPrivilege(a: PrivilegeClass, b: PrivilegeClass): PrivilegeClass {
  return PRIVILEGE_RANK[a] >= PRIVILEGE_RANK[b] ? a : b
}

export function webResearchAllowed(
  privilegeClass: PrivilegeClass,
  attorneyEnable: boolean,
  allowedClasses: PrivilegeClass[],
): boolean {
  return attorneyEnable && allowedClasses.includes(privilegeClass)
}

export function toolPolicyFor(
  defaults: ToolPolicy,
  privilegeClass: PrivilegeClass,
  attorneyEnableWeb: boolean,
  allowedWebClasses: PrivilegeClass[],
  packOverride?: Partial<ToolPolicy>,
): ToolPolicy {
  const web = webResearchAllowed(privilegeClass, attorneyEnableWeb, allowedWebClasses)
  const outboundBlocked = privilegeClass !== "public"
  return {
    ...defaults,
    ...packOverride,
    web_research: web && packOverride?.web_research !== false,
    email_send: outboundBlocked ? false : (packOverride?.email_send ?? defaults.email_send),
    court_file: false,
    dms_write_final: false,
    memory_write_active: false,
    memory_write_proposed: packOverride?.memory_write_proposed ?? defaults.memory_write_proposed,
    dms_read: packOverride?.dms_read ?? defaults.dms_read,
  }
}
