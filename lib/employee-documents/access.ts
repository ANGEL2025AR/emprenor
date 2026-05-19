import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import {
  COMPANY_DOCUMENT_TYPES,
  PERSONAL_DOCUMENT_TYPES,
  getDocumentCategory,
  type EmployeeDocumentCategory,
  type EmployeeDocumentType,
} from "@/lib/employee-documents/types"

export function canViewEmployeeDocuments(role: UserRole): boolean {
  return (
    hasPermission(role, "employees.documents.view") ||
    hasPermission(role, "employees.documents.manage") ||
    hasPermission(role, "employees.documents.upload_own")
  )
}

export function canManageEmployeeDocuments(role: UserRole): boolean {
  return hasPermission(role, "employees.documents.manage")
}

export function canUploadOwnDocuments(role: UserRole): boolean {
  return hasPermission(role, "employees.documents.upload_own")
}

export function canUploadDocumentType(
  role: UserRole,
  type: EmployeeDocumentType,
  opts: { isOwnProfile: boolean },
): boolean {
  const category = getDocumentCategory(type)

  if (canManageEmployeeDocuments(role)) return true

  if (!opts.isOwnProfile || !canUploadOwnDocuments(role)) return false

  return category === "personal" || COMPANY_DOCUMENT_TYPES.includes(type) === false
}

export function allowedUploadTypesForRole(
  role: UserRole,
  opts: { isOwnProfile: boolean },
): EmployeeDocumentType[] {
  if (canManageEmployeeDocuments(role)) {
    return [...COMPANY_DOCUMENT_TYPES, ...PERSONAL_DOCUMENT_TYPES]
  }

  if (opts.isOwnProfile && canUploadOwnDocuments(role)) {
    return [...PERSONAL_DOCUMENT_TYPES]
  }

  return []
}

export function canDeleteDocument(
  role: UserRole,
  opts: {
    isOwnProfile: boolean
    uploadedByUserId: string
    currentUserId: string
    category: EmployeeDocumentCategory
  },
): boolean {
  if (canManageEmployeeDocuments(role)) return true
  if (!opts.isOwnProfile) return false
  if (opts.uploadedByUserId !== opts.currentUserId) return false
  return opts.category === "personal"
}
