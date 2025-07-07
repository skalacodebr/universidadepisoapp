"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, FileText, Settings } from "lucide-react"

export function SimulacaoNavigation() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/simulacao/nova",
      label: "Nova Simulação",
      icon: Calculator,
      active: pathname === "/simulacao/nova",
    },
    {
      href: "/simulacao/salvas",
      label: "Simulações Salvas",
      icon: FileText,
      active: pathname === "/simulacao/salvas",
    },
    {
      href: "/simulacao/configuracoes",
      label: "Configurações",
      icon: Settings,
      active: pathname === "/simulacao/configuracoes",
    },
  ]

  return (
    <nav className="flex overflow-auto pb-2">
      <div className="flex items-center gap-4 border-b w-full">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              route.active ? "border-b-2 border-[#007EA3] text-[#007EA3]" : "text-muted-foreground"
            }`}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
