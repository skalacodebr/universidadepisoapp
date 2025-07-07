"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Mail, MapPin, Phone, Save, User, X } from "lucide-react"

interface InformacoesTabProps {
  user: any
  nome: string
  setNome: (nome: string) => void
  telefone: string
  setTelefone: (telefone: string) => void
  cidade: string
  setCidade: (cidade: string) => void
  estado: string
  setEstado: (estado: string) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  handleSaveProfile: (e: React.FormEvent) => void
}

export function InformacoesTab({
  user,
  nome,
  setNome,
  telefone,
  setTelefone,
  cidade,
  setCidade,
  estado,
  setEstado,
  isEditing,
  setIsEditing,
  handleSaveProfile,
}: InformacoesTabProps) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Informações Pessoais</h3>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="text-[#007EA3] border-[#007EA3] hover:bg-[#007EA3] hover:text-white transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveProfile} className="bg-[#007EA3] hover:bg-[#006a8a]">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome Completo
                </Label>
                {isEditing ? (
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                ) : (
                  <div className="flex items-center p-3 border rounded-md bg-gray-50 text-gray-700 h-10">
                    <User className="h-4 w-4 mr-3 text-[#007EA3]" />
                    <span>{nome || "Não informado"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="flex items-center p-3 border rounded-md bg-gray-50 text-gray-700 h-10">
                  <Mail className="h-4 w-4 mr-3 text-[#007EA3]" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                  Telefone
                </Label>
                {isEditing ? (
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                ) : (
                  <div className="flex items-center p-3 border rounded-md bg-gray-50 text-gray-700 h-10">
                    <Phone className="h-4 w-4 mr-3 text-[#007EA3]" />
                    <span>{telefone || "Não informado"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                  Cidade
                </Label>
                {isEditing ? (
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                    className="focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                ) : (
                  <div className="flex items-center p-3 border rounded-md bg-gray-50 text-gray-700 h-10">
                    <MapPin className="h-4 w-4 mr-3 text-[#007EA3]" />
                    <span>{cidade || "Não informado"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
                </Label>
                {isEditing ? (
                  <Input
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Seu estado"
                    className="focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                ) : (
                  <div className="flex items-center p-3 border rounded-md bg-gray-50 text-gray-700 h-10">
                    <MapPin className="h-4 w-4 mr-3 text-[#007EA3]" />
                    <span>{estado || "Não informado"}</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
