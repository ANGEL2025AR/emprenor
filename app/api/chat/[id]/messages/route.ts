import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const messages = await db
      .collection("messages")
      .find({ conversationId: new ObjectId(id) })
      .sort({ createdAt: 1 })
      .limit(100)
      .toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDb()

    const message = {
      conversationId: new ObjectId(id),
      senderId: new ObjectId(user._id),
      senderName: user.name,
      content: data.content,
      type: data.type || "text",
      attachments: data.attachments || [],
      createdAt: new Date(),
      readBy: [new ObjectId(user._id)],
    }

    const result = await db.collection("messages").insertOne(message)

    // Update last message in conversation
    await db.collection("conversations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          lastMessage: data.content,
          lastMessageAt: new Date(),
        },
      },
    )

    return NextResponse.json({ _id: result.insertedId, ...message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 })
  }
}
