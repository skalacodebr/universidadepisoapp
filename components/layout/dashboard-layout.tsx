"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeMenu?: string
  title?: string
}

export function DashboardLayout({ children, activeMenu, title }: DashboardLayoutProps) {
  const router = useRouter()

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        {/* Dashboard Content */}
        <main className="h-full overflow-y-auto bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </MainLayout>
  )
}
