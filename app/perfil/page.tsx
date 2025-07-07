"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InformacoesTab } from "@/components/perfil/informacoes-tab"
import { SegurancaTab } from "@/components/perfil/seguranca-tab"
import { PreferenciasTab } from "@/components/perfil/preferencias-tab"

export default function Perfil() {
  const { user, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Estados para os campos do formulário
  const [nome, setNome] = useState(user?.displayName || "")
  const [telefone, setTelefone] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")

  // Estados para notificações
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  // Função para obter a inicial do nome do usuário
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Função para obter o nome de exibição do usuário
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName
    } else if (user?.email) {
      // Se não tiver nome, usa a parte antes do @ do email
      return user.email.split("@")[0]
    }
    return "Usuário"
  }

  // Salvar alterações do perfil
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaria a lógica para salvar as alterações no perfil
    setIsEditing(false)
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <style jsx global>{`
          .max-w-7xl input:not([type="checkbox"]):not([type="radio"]) {
            height: 40px !important;
          }
        `}</style>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Perfil</h1>

        <div className="mt-4">
          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="mb-8 w-full justify-start border-b pb-0 bg-transparent">
              <TabsTrigger
                value="informacoes"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
              >
                Informações Pessoais
              </TabsTrigger>
              <TabsTrigger
                value="seguranca"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
              >
                Segurança
              </TabsTrigger>
              <TabsTrigger
                value="preferencias"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
              >
                Preferências
              </TabsTrigger>
            </TabsList>

            <TabsContent value="informacoes">
              <InformacoesTab
                user={user}
                nome={nome}
                setNome={setNome}
                telefone={telefone}
                setTelefone={setTelefone}
                cidade={cidade}
                setCidade={setCidade}
                estado={estado}
                setEstado={setEstado}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSaveProfile={handleSaveProfile}
              />
            </TabsContent>

            <TabsContent value="seguranca">
              <SegurancaTab />
            </TabsContent>

            <TabsContent value="preferencias">
              <PreferenciasTab
                emailNotifications={emailNotifications}
                setEmailNotifications={setEmailNotifications}
                pushNotifications={pushNotifications}
                setPushNotifications={setPushNotifications}
                signOut={signOut}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
