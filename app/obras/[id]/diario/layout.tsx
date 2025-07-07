import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function DiarioObraEspecificaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">{children}</div>
    </ProtectedRoute>
  )
}
