import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import ChatClient from "@/components/chat/chat-client"

export default async function ChatPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <ChatClient user={user} />
}
