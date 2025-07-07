"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, Key, Lock, Smartphone, Laptop, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SegurancaTab() {
  const { toast } = useToast()
  const [alterarSenhaOpen, setAlterarSenhaOpen] = useState(false)
  const [dispositivosOpen, setDispositivosOpen] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Dispositivos mockados para demonstração
  const dispositivos = [
    { id: 1, nome: "iPhone 13", tipo: "mobile", ultimoAcesso: "Hoje, 14:30", atual: true },
    { id: 2, nome: "MacBook Pro", tipo: "desktop", ultimoAcesso: "Hoje, 10:15", atual: true },
    { id: 3, nome: "Windows PC", tipo: "desktop", ultimoAcesso: "Ontem, 18:45", atual: false },
    { id: 4, nome: "iPad", tipo: "tablet", ultimoAcesso: "15/04/2023", atual: false },
  ]

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault()

    if (novaSenha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      })

      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
      setAlterarSenhaOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar sua senha",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevogarAcesso = async (id: number) => {
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Acesso revogado",
        description: "O acesso do dispositivo foi revogado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível revogar o acesso",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Segurança da Conta</h3>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-blue-100 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-800">Alterar Senha</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      É recomendado alterar sua senha periodicamente para maior segurança
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-[#007EA3] border-[#007EA3] hover:bg-[#007EA3] hover:text-white transition-colors"
                  onClick={() => setAlterarSenhaOpen(true)}
                >
                  Alterar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-blue-100 p-2 rounded-full">
                    <Key className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-800">Dispositivos Conectados</h4>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os dispositivos que têm acesso à sua conta</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-[#007EA3] border-[#007EA3] hover:bg-[#007EA3] hover:text-white transition-colors"
                  onClick={() => setDispositivosOpen(true)}
                >
                  Visualizar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Alterar Senha */}
      <Dialog open={alterarSenhaOpen} onOpenChange={setAlterarSenhaOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAlterarSenha} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="senha-atual">Senha Atual</Label>
              <Input
                id="senha-atual"
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nova-senha">Nova Senha</Label>
              <Input
                id="nova-senha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setAlterarSenhaOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#007EA3] hover:bg-[#006d8f]" disabled={isLoading}>
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Dispositivos Conectados */}
      <Dialog open={dispositivosOpen} onOpenChange={setDispositivosOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dispositivos Conectados</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {dispositivos.map((dispositivo) => (
                <div key={dispositivo.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-4 bg-blue-100 p-2 rounded-full">
                      {dispositivo.tipo === "mobile" ? (
                        <Smartphone className="h-5 w-5 text-[#007EA3]" />
                      ) : (
                        <Laptop className="h-5 w-5 text-[#007EA3]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-base font-medium text-gray-800">{dispositivo.nome}</h4>
                        {dispositivo.atual && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Último acesso: {dispositivo.ultimoAcesso}</p>
                    </div>
                  </div>
                  {!dispositivo.atual && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleRevogarAcesso(dispositivo.id)}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Revogar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
