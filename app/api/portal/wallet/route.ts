import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// GET: Obtener saldo y movimientos de billetera
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const db = await getDb()
    const wallet = await db.collection("wallets").findOne({ userId: new ObjectId(user._id) })

    if (!wallet) {
      // Crear billetera si no existe
      const newWallet = {
        userId: new ObjectId(user._id),
        balance: 0,
        aguinaldo: 0,
        advances: 0,
        accounts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection("wallets").insertOne(newWallet)
      return NextResponse.json({ wallet: { ...newWallet, _id: newWallet.userId.toString() }, movements: [] })
    }

    const movements = await db
      .collection("wallet_movements")
      .find({ userId: new ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      wallet: { ...wallet, _id: wallet._id.toString() },
      movements: movements.map((m) => ({ ...m, _id: m._id.toString() })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar billetera" }, { status: 500 })
  }
}

// POST: Solicitar retiro de fondos
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    const { amount, destinationAccount, destinationType } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    if (!destinationAccount) {
      return NextResponse.json({ error: "Cuenta de destino requerida" }, { status: 400 })
    }

    const db = await getDb()
    const wallet = await db.collection("wallets").findOne({ userId: new ObjectId(user._id) })

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 })
    }

    // Crear movimiento de retiro
    await db.collection("wallet_movements").insertOne({
      userId: new ObjectId(user._id),
      type: "egreso",
      category: "retiro",
      amount,
      description: `Retiro a ${destinationType || "CBU"}: ${destinationAccount}`,
      destinationAccount,
      destinationType: destinationType || "cbu",
      status: "pendiente",
      createdAt: new Date(),
    })

    // Descontar del saldo
    await db.collection("wallets").updateOne(
      { userId: new ObjectId(user._id) },
      { $inc: { balance: -amount }, $set: { updatedAt: new Date() } },
    )

    return NextResponse.json({ success: true, message: "Retiro solicitado correctamente" })
  } catch {
    return NextResponse.json({ error: "Error al procesar retiro" }, { status: 500 })
  }
}
