"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DispositivosModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DispositivosModal({ isOpen, onOpenChange }: DispositivosModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Dispositivos Conectados</DialogTitle>
          <DialogDescription>Veja e gerencie os dispositivos que recebem notificações do aplicativo.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-4">
            {/* Lista de dispositivos de exemplo */}
            {[
              { id: 1, nome: "iPhone 13", ultimoAcesso: "Hoje, 10:30" },
              { id: 2, nome: "Samsung Galaxy S21", ultimoAcesso: "Ontem, 15:45" },
              { id: 3, nome: "iPad Pro", ultimoAcesso: "23/04/2025, 08:15" },
            ].map((dispositivo) => (
              <div key={dispositivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">{dispositivo.nome}</p>
                  <p className="text-xs text-gray-500">Último acesso: {dispositivo.ultimoAcesso}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={() => onOpenChange(false)}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
