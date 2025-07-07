"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"
import type { SimulacaoItem } from "../hooks/useSimulacoes"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  simulacao: SimulacaoItem | null
  onConfirm: () => void
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  simulacao,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[450px]">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-800 text-center">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 text-center">
              Tem certeza que deseja excluir esta simulação?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {simulacao && (
            <div className="my-6 w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Nome:</span>
                  <span className="text-sm font-semibold text-gray-700">{simulacao.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Área:</span>
                  <span className="text-sm font-semibold text-gray-700">{simulacao.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Data:</span>
                  <span className="text-sm font-semibold text-gray-700">{simulacao.data}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className="text-sm font-semibold text-gray-700">{simulacao.status}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-red-600 font-medium mb-6 text-center">Esta ação não pode ser desfeita.</p>

          <AlertDialogFooter className="w-full flex justify-between gap-3">
            <AlertDialogCancel className="border border-gray-300 font-medium flex-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium flex-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
