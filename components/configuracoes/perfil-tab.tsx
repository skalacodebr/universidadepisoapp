"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Mail, MessageSquare } from "lucide-react"

interface PerfilTabProps {
  emailNotifications: boolean
  setEmailNotifications: (value: boolean) => void
  smsNotifications: boolean
  setSmsNotifications: (value: boolean) => void
  salvarConfiguracoesPerfil: () => void
}

export function PerfilTab({
  emailNotifications,
  setEmailNotifications,
  smsNotifications,
  setSmsNotifications,
  salvarConfiguracoesPerfil,
}: PerfilTabProps) {
  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Notificações</CardTitle>
          <CardDescription className="text-base">Configure como deseja receber notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-[#007EA3]" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700">Notificações por E-mail</p>
                  <p className="text-sm text-gray-500">Receba lembretes e avisos de saldo crítico por e-mail</p>
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
                  <MessageSquare className="h-5 w-5 text-[#007EA3]" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700">Notificações por SMS</p>
                  <p className="text-sm text-gray-500">Receba lembretes e avisos de saldo crítico por SMS</p>
                </div>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
                className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button onClick={salvarConfiguracoesPerfil} className="bg-[#007EA3] hover:bg-[#006a8a]">
          Salvar alterações
        </Button>
      </div>
    </>
  )
}
