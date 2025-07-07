import type React from "react"
import type { Metadata } from "next"
import ProtectedRoute from "@/components/protected-route"
import { MainLayout } from "@/components/layout/main-layout"

export const metadata: Metadata = {
  title: "Simulação | Universidade do Piso",
  description: "Simulação de preço de venda para projetos de piso",
}

export default function SimulacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
