"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [{ icon: <Settings className="h-4 w-4" />, label: "Geral", path: "/configuracoes" }]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside className="w-60 bg-gray-100 border-r">
      <div className="py-4 px-6">
        <h2 className="text-lg font-semibold text-gray-700">Menu</h2>
      </div>
      <nav className="py-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className="w-full justify-start rounded-none shadow-none hover:bg-gray-200"
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
