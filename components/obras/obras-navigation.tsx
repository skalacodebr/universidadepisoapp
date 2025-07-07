"use client"

import { useRouter, usePathname } from "next/navigation"
import { Building, FileText, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ObrasNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex space-x-2 mb-6">
      <Button
        variant={pathname === "/obras" ? "default" : "outline"}
        className={pathname === "/obras" ? "bg-[#007EA3]" : ""}
        onClick={() => router.push("/obras")}
      >
        <Building className="mr-2 h-4 w-4" />
        Obras
      </Button>
      <Button
        variant={pathname === "/obras/diario" ? "default" : "outline"}
        className={pathname === "/obras/diario" ? "bg-[#007EA3]" : ""}
        onClick={() => router.push("/obras/diario")}
      >
        <FileText className="mr-2 h-4 w-4" />
        Diário de obras
      </Button>
      <Button
        variant={pathname === "/obras/despesas" ? "default" : "outline"}
        className={pathname === "/obras/despesas" ? "bg-[#007EA3]" : ""}
        onClick={() => router.push("/obras/despesas")}
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Registro de despesa
      </Button>
    </div>
  )
}
