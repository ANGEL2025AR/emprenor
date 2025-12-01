import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const conversations = await db
      .collection("conversations")
      .find({
        participants: new ObjectId(user._id),
      })
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Error al obtener conversaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDb()

    const conversation = {
      participants: data.participants.map((p: string) => new ObjectId(p)),
      isGroup: data.isGroup || false,
      name: data.name || "",
      lastMessage: "",
      lastMessageAt: new Date(),
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    }

    const result = await db.collection("conversations").insertOne(conversation)

    return NextResponse.json({ _id: result.insertedId, ...conversation })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Error al crear conversación" }, { status: 500 })
  }
}
