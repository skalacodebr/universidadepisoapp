"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BellRing, Smartphone } from "lucide-react"

interface AppTabProps {
  permissoesDespesas: Record<string, boolean>
  setPermissoesDespesas: (permissoes: Record<string, boolean>) => void
  novaDespesa: string
  setNovaDespesa: (value: string) => void
  notificacoesPush: boolean
  setNotificacoesPush: (value: boolean) => void
  adicionarNovaDespesa: () => void
  salvarConfiguracoesApp: () => void
  abrirModalDispositivos: () => void
}

export function AppTab({
  permissoesDespesas,
  setPermissoesDespesas,
  novaDespesa,
  setNovaDespesa,
  notificacoesPush,
  setNotificacoesPush,
  adicionarNovaDespesa,
  salvarConfiguracoesApp,
  abrirModalDispositivos,
}: AppTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permissões de Despesas */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Permissões de despesas</CardTitle>
            <CardDescription className="text-base">
              Defina quais categorias de despesas os usuários móveis podem registrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nova categoria de despesa"
                  value={novaDespesa}
                  onChange={(e) => setNovaDespesa(e.target.value)}
                />
                <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={adicionarNovaDespesa}>
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Categorias de Despesas Permitidas</Label>

                <div className="space-y-2">
                  {Object.entries(permissoesDespesas).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Checkbox
                        id={`despesa-${key}`}
                        className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                        checked={value}
                        onCheckedChange={(checked) =>
                          setPermissoesDespesas({ ...permissoesDespesas, [key]: checked === true })
                        }
                      />
                      <Label
                        htmlFor={`despesa-${key}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações no App */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Notificações no App</CardTitle>
            <CardDescription className="text-base">Configure as notificações push no aplicativo móvel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BellRing className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-700">Notificações Push para Aprovações</p>
                    <p className="text-sm text-gray-500">
                      Receba notificações para aprovações ou rejeições de despesas
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificacoesPush}
                  onCheckedChange={setNotificacoesPush}
                  className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-700">Dispositivos Conectados</p>
                    <p className="text-sm text-gray-500">Gerencie dispositivos que recebem notificações</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-[#007EA3] border-[#007EA3] hover:bg-[#007EA3] hover:text-white"
                  onClick={abrirModalDispositivos}
                >
                  Gerenciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={salvarConfiguracoesApp} className="bg-[#007EA3] hover:bg-[#006a8a]">
          Salvar alterações
        </Button>
      </div>
    </>
  )
}
