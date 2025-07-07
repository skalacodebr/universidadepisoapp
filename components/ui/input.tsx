"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: "cpf" | "cnpj" | "telefone" | "cep" | "dinheiro" | "data" | "numero" | "porcentagem"
  onValueChange?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, onChange, onValueChange, value: propValue, defaultValue, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      if (propValue !== undefined && typeof propValue === "string") {
        return formatValue(propValue.toString(), mask)
      }
      if (defaultValue !== undefined && typeof defaultValue === "string") {
        return formatValue(defaultValue.toString(), mask)
      }
      return ""
    })

    React.useEffect(() => {
      if (propValue !== undefined && typeof propValue === "string") {
        setDisplayValue(formatValue(propValue, mask))
      }
    }, [propValue, mask])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatValue(rawValue, mask)
      setDisplayValue(formattedValue)

      // Create a new event with the formatted value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      }

      // Chama o onChange padrão com o evento modificado
      if (onChange) {
        onChange(newEvent as React.ChangeEvent<HTMLInputElement>)
      }

      // Chama o onValueChange com o valor sem formatação
      if (onValueChange) {
        const unformattedValue = unformatValue(formattedValue, mask)
        onValueChange(unformattedValue)
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

// Funções auxiliares para formatação
function formatValue(value: string | undefined, mask?: string): string {
  if (!value) return ""

  // Remove caracteres não numéricos para máscaras numéricas
  const digits = value.replace(/\D/g, "")

  switch (mask) {
    case "cpf":
      return formatCPF(digits)
    case "cnpj":
      return formatCNPJ(digits)
    case "telefone":
      return formatTelefone(digits)
    case "cep":
      return formatCEP(digits)
    case "dinheiro":
      return formatDinheiro(digits)
    case "data":
      return formatData(digits)
    case "numero":
      return formatNumero(value)
    case "porcentagem":
      return formatPorcentagem(digits)
    default:
      return value
  }
}

function unformatValue(value: string, mask?: string): string {
  if (!value) return ""

  switch (mask) {
    case "cpf":
    case "cnpj":
    case "telefone":
    case "cep":
      return value.replace(/\D/g, "")
    case "dinheiro":
      return value.replace(/[^\d,]/g, "").replace(",", ".")
    case "porcentagem":
      return value
        .replace(/[^\d,]/g, "")
        .replace(",", ".")
        .replace("%", "")
    default:
      return value
  }
}

function formatCPF(value: string): string {
  if (value.length <= 3) return value
  if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`
  if (value.length <= 9) return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`
  return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`
}

function formatCNPJ(value: string): string {
  if (value.length <= 2) return value
  if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`
  if (value.length <= 8) return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`
  if (value.length <= 12) return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`
  return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`
}

function formatTelefone(value: string): string {
  if (value.length <= 2) return value
  if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`
  if (value.length <= 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
  return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`
}

function formatCEP(value: string): string {
  if (value.length <= 5) return value
  return `${value.slice(0, 5)}-${value.slice(5, 8)}`
}

function formatDinheiro(value: string): string {
  if (!value) return "R$ 0,00"

  // Converte para centavos
  const cents = Number.parseInt(value, 10)

  // Formata com separadores de milhar e decimal
  const formatted = (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatted
}

function formatData(value: string): string {
  if (value.length <= 2) return value
  if (value.length <= 4) return `${value.slice(0, 2)}/${value.slice(2)}`
  return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`
}

function formatNumero(value: string): string {
  // Permite apenas números e vírgula
  const cleaned = value.replace(/[^\d,]/g, "")

  // Garante apenas uma vírgula
  const parts = cleaned.split(",")
  if (parts.length > 2) {
    return `${parts[0]},${parts.slice(1).join("")}`
  }

  return cleaned
}

function formatPorcentagem(value: string): string {
  if (!value) return "0%"

  // Converte para número
  const num = Number.parseInt(value, 10)

  // Formata com duas casas decimais
  const formatted = (num / 100).toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatted
}

export { Input }
