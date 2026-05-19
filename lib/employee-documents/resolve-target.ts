import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"

export async function resolveEmployeeDocumentTarget(opts: {
  userId?: string | null
  employeeId?: string | null
}): Promise<{ userId?: ObjectId; employeeId?: ObjectId } | null> {
  const db = await getDb()

  if (opts.userId && ObjectId.isValid(opts.userId)) {
    const userId = new ObjectId(opts.userId)
    const employee = await db.collection("employees").findOne({ userId })
    return { userId, employeeId: employee?._id as ObjectId | undefined }
  }

  if (opts.employeeId && ObjectId.isValid(opts.employeeId)) {
    const employeeId = new ObjectId(opts.employeeId)
    const employee = await db.collection("employees").findOne({ _id: employeeId })
    if (!employee) return null
    const userId =
      employee.userId && ObjectId.isValid(String(employee.userId))
        ? new ObjectId(String(employee.userId))
        : undefined

    if (!userId && employee.email) {
      const user = await db.collection("users").findOne({ email: String(employee.email).toLowerCase() })
      if (user?._id) {
        await db.collection("employees").updateOne(
          { _id: employeeId },
          { $set: { userId: user._id, updatedAt: new Date() } },
        )
        return { userId: user._id as ObjectId, employeeId }
      }
    }

    return { userId, employeeId }
  }

  return null
}

export async function linkEmployeeToUserByEmail(employeeId: ObjectId, email?: string) {
  if (!email) return
  const db = await getDb()
  const user = await db.collection("users").findOne({ email: email.toLowerCase() })
  if (user?._id) {
    await db.collection("employees").updateOne(
      { _id: employeeId },
      { $set: { userId: user._id, updatedAt: new Date() } },
    )
  }
}
