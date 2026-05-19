import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { requirePortalApi } from "@/lib/auth/portal-api"
import { computeDocumentStatus } from "@/lib/employee-documents/types"

export async function GET() {
  try {
    const auth = await requirePortalApi("portal.personnel_file")
    if ("response" in auth) return auth.response
    const user = auth.user

    const db = await getDb()
    const userObjectId = new ObjectId(user._id)

    const [employee, legacyFile, documents] = await Promise.all([
      db.collection("employees").findOne({ userId: userObjectId }),
      db.collection("personnel_files").findOne({ userId: userObjectId }),
      db
        .collection("employee_documents")
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .toArray(),
    ])

    const personal = {
      fullName: `${user.name} ${user.lastName}`.trim(),
      dni: employee?.dni || legacyFile?.dni,
      cuil: legacyFile?.cuil || employee?.cuil,
      birthDate: employee?.birthDate || legacyFile?.birthDate,
      address: employee?.address || legacyFile?.address,
      phone: user.phone || employee?.phone,
      email: user.email,
      emergencyContact: employee?.emergencyContact
        ? typeof employee.emergencyContact === "string"
          ? { name: employee.emergencyContact, phone: employee.emergencyPhone || "" }
          : employee.emergencyContact
        : undefined,
    }

    const employment = {
      position: employee?.position || employee?.role,
      department: employee?.department,
      startDate: employee?.hireDate,
      category: legacyFile?.category,
      contractType: employee?.contractType || legacyFile?.contractType,
      artProvider: legacyFile?.artCredential?.provider || legacyFile?.artProvider,
      healthInsurance: legacyFile?.obraSocial || legacyFile?.healthInsurance,
      status: employee?.status || "activo",
    }

    const serializedDocs = documents.map((d) => ({
      _id: d._id.toString(),
      name: d.name,
      type: d.type,
      category: d.category,
      fileUrl: d.fileUrl,
      uploadedAt: d.createdAt,
      expiresAt: d.expiresAt,
      status: computeDocumentStatus(d.expiresAt as Date | undefined),
    }))

    return NextResponse.json({ personal, employment, documents: serializedDocs })
  } catch {
    return NextResponse.json({ error: "Error al cargar legajo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requirePortalApi("portal.personnel_file")
    if ("response" in auth) return auth.response

    const user = auth.user
    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const allowedFields = [
      "afipRegistration",
      "artCredential",
      "lifeInsurance",
      "personalDocs",
      "medicalExams",
      "trainings",
      "cuil",
      "cbu",
      "obraSocial",
      "sindicato",
    ]
    const updateData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    updateData.updatedAt = new Date()

    const db = await getDb()
    const targetUserId = body.targetUserId || user._id

    await db.collection("personnel_files").updateOne(
      { userId: new ObjectId(targetUserId) },
      { $set: updateData },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar legajo" }, { status: 500 })
  }
}
