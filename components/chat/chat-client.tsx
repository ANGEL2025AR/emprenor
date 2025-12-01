"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Search, Plus, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"

export default function ChatClient({ user }: { user: any }) {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/chat")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setLoading(true)
    try {
      const response = await fetch(`/api/chat/${selectedConversation._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          type: "text",
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages([...messages, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <Card className="w-80 shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mensajes</h2>
            <Button size="icon" variant="ghost">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar conversación..." className="pl-10" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">No hay conversaciones</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedConversation?._id === conv._id ? "bg-green-50 border border-green-200" : "hover:bg-slate-50"
                  }`}
                >
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {conv.name ? conv.name.substring(0, 2).toUpperCase() : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 truncate">{conv.name || "Sin nombre"}</p>
                      <span className="text-xs text-slate-500">
                        {conv.lastMessageAt
                          ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{conv.lastMessage || "Sin mensajes"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-600">
                    {selectedConversation.name ? selectedConversation.name.substring(0, 2).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedConversation.name || "Sin nombre"}</h3>
                  <p className="text-sm text-green-500">En línea</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay mensajes</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user._id
                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMe ? "bg-green-500 text-white rounded-br-md" : "bg-slate-100 text-slate-900 rounded-bl-md"
                          }`}
                        >
                          {!isMe && <p className="text-xs font-medium text-green-600 mb-1">{msg.senderName}</p>}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-green-100" : "text-slate-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button onClick={handleSend} size="icon" disabled={loading}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">Selecciona una conversación</h3>
              <p className="text-slate-500">Elige una conversación para comenzar a chatear</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
