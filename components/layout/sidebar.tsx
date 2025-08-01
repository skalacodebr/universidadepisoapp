"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { BarChart3, Users, FileText, Settings, Home, DollarSign, Calculator, LogOut, Wallet } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = [
    { icon: <BarChart3 className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <Home className="h-5 w-5" />, label: "Obras", path: "/obras" },
    { icon: <FileText className="h-5 w-5" />, label: "Relatórios", path: "/relatorios" },
    { icon: <Calculator className="h-5 w-5" />, label: "Simulação", path: "/simulacao" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Financeiro", path: "/financeiro" },
    { icon: <Wallet className="h-5 w-5" />, label: "Custo Fixo", path: "/custo-fixo" },
    { icon: <Users className="h-5 w-5" />, label: "Usuários", path: "/usuarios" },
    { icon: <Settings className="h-5 w-5" />, label: "Configurações", path: "/configuracoes" },
  ]

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    router.push(path)
  }

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    await logout()
    // The logout function already handles the redirect to /login
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <aside className="w-64 bg-white border-r flex flex-col fixed top-0 left-0 z-30 h-screen">
      {/* Logo */}
      <div className="p-4 flex justify-center">
        <Image
          src="/universidade-piso-logo.jpeg"
          alt="Universidade do Piso"
          width={140}
          height={62}
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md mx-2 ${
                  isActive(item.path) ? "bg-[#007EA3] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={(e) => handleNavigation(e, item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="/login"
              className="flex items-center px-4 py-3 text-sm rounded-md mx-2 text-gray-700 hover:bg-gray-100 mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sair da Conta</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => router.push("/perfil")}
        title="Ir para perfil"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#007EA3] flex items-center justify-center text-white font-medium">
            {user?.nome
              ? user.nome.charAt(0).toUpperCase()
              : user?.email
                ? user.email.split("@")[0].charAt(0).toUpperCase()
                : "U"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.nome || user?.email?.split("@")[0] || "Usuário"}</p>
            <p className="text-xs text-gray-500">{user?.email || "usuario@exemplo.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
