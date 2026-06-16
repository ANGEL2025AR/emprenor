import type { BrochureContentDocument, BrochureDirectoryMember } from "@/lib/db/models"

export type ResolvedBrochureContent = Omit<BrochureContentDocument, "_id" | "createdAt" | "updatedAt" | "updatedBy">

export type ResolvedBrochureDirectoryMember = Omit<
  BrochureDirectoryMember,
  "_id" | "createdAt" | "updatedAt" | "updatedBy"
> & { _id?: string }

export function groupDirectoryByDepartment(members: ResolvedBrochureDirectoryMember[]) {
  const map = new Map<string, ResolvedBrochureDirectoryMember[]>()
  for (const member of members) {
    const dept = member.department?.trim() || "GENERAL"
    const list = map.get(dept) || []
    list.push(member)
    map.set(dept, list)
  }
  return Array.from(map.entries()).map(([department, items]) => ({
    department,
    members: items.sort((a, b) => a.order - b.order),
  }))
}
