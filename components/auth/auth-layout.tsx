import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  leftContainer: React.ReactNode
}

export function AuthLayout({ children, leftContainer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Container esquerdo */}
      {leftContainer}

      {/* Container direito - Formulário */}
      <div className="w-full md:w-1/2 bg-[#007EA3] flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">{children}</div>
    </div>
  )
}
