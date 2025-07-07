"use client"

import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="h-16 border-b bg-white/90 backdrop-blur-sm">
      <div className="flex items-center gap-4 h-full justify-end px-6">
        <Button
          variant="outline"
          size="sm"
          className="relative rounded-full w-9 h-9 p-0 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          onClick={() => router.push("/notificacoes")}
        >
          <Bell className="h-5 w-5 text-gray-700" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-4 w-4 flex items-center justify-center p-0 bg-[#007EA3] text-white text-[10px] rounded-full border border-white"
          >
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}
