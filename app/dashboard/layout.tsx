import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import { MainLayout } from "@/components/layout/main-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
