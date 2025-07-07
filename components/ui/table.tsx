import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} />
  ),
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  ),
)
TableRow.displayName = "TableRow"

// Vamos modificar o componente TableHead para facilitar o alinhamento centralizado
// Manteremos o comportamento padrão de alinhamento à esquerda, mas melhoraremos a forma
// como o alinhamento pode ser sobrescrito

// Modifique o componente TableHead para incluir melhor suporte para alinhamento:

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        // Removemos o "text-left" fixo da classe padrão para permitir sobrescrever mais facilmente
        // Se não houver uma classe de alinhamento explícita, usamos text-left como padrão
        !className?.includes("text-center") && !className?.includes("text-right") ? "text-left" : "",
        className,
      )}
      {...props}
    />
  ),
)
TableHead.displayName = "TableHead"

// Agora vamos ajustar o TableCell para ter melhor suporte para ícones
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
)
TableCell.displayName = "TableCell"

// Agora, vamos adicionar o novo componente TableCellActions logo após o TableCell
// Este componente será específico para células que contêm menus de ações

interface TableCellActionsProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  items?: React.ReactNode
}

const TableCellActions = React.forwardRef<HTMLTableCellElement, TableCellActionsProps>(
  ({ className, items, children, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle text-center", className)} {...props}>
      {items ? <div className="flex justify-center">{items}</div> : children}
    </td>
  ),
)
TableCellActions.displayName = "TableCellActions"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
)
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TableCellActions }
