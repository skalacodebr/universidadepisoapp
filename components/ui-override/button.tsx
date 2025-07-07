"use client"

import type React from "react"

import { Button as ShadcnButton } from "@/components/ui/button"
import { forwardRef } from "react"

export const Button = forwardRef<
  React.ElementRef<typeof ShadcnButton>,
  React.ComponentPropsWithoutRef<typeof ShadcnButton>
>(({ className, variant, ...props }, ref) => {
  // Se não for especificado um variant, e não tiver className personalizada com bg-
  // então aplicamos nossa cor padrão
  const defaultClassName =
    variant === "default" && (!className || !className.includes("bg-"))
      ? "bg-[#007EA3] hover:bg-[#006a8a] text-white"
      : className

  return <ShadcnButton className={defaultClassName} variant={variant} ref={ref} {...props} />
})

Button.displayName = "Button"
