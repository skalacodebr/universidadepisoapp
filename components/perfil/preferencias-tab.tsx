"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BellRing, LogOut, Mail } from "lucide-react"

interface PreferenciasTabProps {
  emailNotifications: boolean
  setEmailNotifications: (value: boolean) => void
  pushNotifications: boolean
  setPushNotifications: (value: boolean) => void
  signOut: () => void
}

export function PreferenciasTab({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  signOut,
}: PreferenciasTabProps) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-6 bg-white">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Preferências</h3>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-800 mb-4">Notificações</h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notificações por Email</p>
                    <p className="text-xs text-gray-500">Receba atualizações por email</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BellRing className="h-5 w-5 text-[#007EA3]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notificações Push</p>
                    <p className="text-xs text-gray-500">Receba notificações no navegador</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-red-100 p-2 rounded-full">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-800">Sair da Conta</h4>
                  <p className="text-sm text-gray-500 mt-1">Encerrar sua sessão atual em todos os dispositivos</p>
                </div>
              </div>
              <Button variant="destructive" onClick={signOut} className="bg-red-600 hover:bg-red-700">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
