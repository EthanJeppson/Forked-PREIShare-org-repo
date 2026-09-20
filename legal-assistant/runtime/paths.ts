import path from "node:path"
import { fileURLToPath } from "node:url"

export function packRootFromRuntimeDir(runtimeDir: string = path.dirname(fileURLToPath(import.meta.url))): string {
  return path.resolve(runtimeDir, "..")
}

export function estimateTokens(content: string, charsPerToken: number): number {
  if (content.length === 0) {
    return 0
  }
  return Math.ceil(content.length / charsPerToken)
}
