"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

interface ConfigurarPermissoesFormProps {
  usuario: any
  onClose: () => void
}

export function ConfigurarPermissoesForm({ usuario, onClose }: ConfigurarPermissoesFormProps) {
  // Estados para as permissões globais
  const [permissoesGlobais, setPermissoesGlobais] = useState({
    dashboard: true,
    obras: true,
    relatorios: true,
    simulacao: false,
    financeiro: false,
    usuarios: false,
    configuracoes: false,
  })

  // Estados para as permissões de despesas no app móvel
  const [permissoesDespesas, setPermissoesDespesas] = useState({
    combustivel: true,
    refeicao: true,
    hospedagem: true,
    aluguelEquipamentos: false,
    materiais: false,
    outros: false,
  })

  // Função para lidar com a mudança nas permissões globais
  const handlePermissaoGlobalChange = (permissao: string, checked: boolean) => {
    setPermissoesGlobais({
      ...permissoesGlobais,
      [permissao]: checked,
    })
  }

  // Função para lidar com a mudança nas permissões de despesas
  const handlePermissaoDespesaChange = (permissao: string, checked: boolean) => {
    setPermissoesDespesas({
      ...permissoesDespesas,
      [permissao]: checked,
    })
  }

  // Função para salvar as permissões
  const handleSave = () => {
    // Aqui implementaria a lógica para salvar as permissões
    console.log({
      usuario,
      permissoesGlobais,
      permissoesDespesas,
    })
    onClose()
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-1">
      <DialogHeader className="mb-4 sticky top-0 bg-white z-10 pb-2">
        <DialogTitle className="text-xl font-semibold text-gray-800">Configurar Permissões</DialogTitle>
        <DialogDescription className="text-base text-gray-600">
          Configure as permissões de acesso para {usuario?.nome}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Resumo do Usuário */}
        <Card className="p-4 bg-gray-50 border shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Resumo do Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex">
              <span className="text-sm font-medium w-20">Nome:</span>
              <span className="text-sm text-gray-700">{usuario?.nome}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium w-20">CPF:</span>
              <span className="text-sm text-gray-700">{usuario?.cpf}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium w-20">Cargo:</span>
              <span className="text-sm text-gray-700">{usuario?.cargo}</span>
            </div>
          </div>
        </Card>

        {/* Permissões Globais */}
        <div>
          <h3 className="text-lg font-medium mb-3">Permissões Globais</h3>
          <Card className="p-4 border shadow-sm">
            <p className="text-sm text-gray-500 mb-3">Selecione os módulos que o usuário terá acesso no sistema web.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dashboard"
                  checked={permissoesGlobais.dashboard}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("dashboard", checked === true)}
                />
                <Label htmlFor="dashboard" className="cursor-pointer">
                  Dashboard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="obras"
                  checked={permissoesGlobais.obras}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("obras", checked === true)}
                />
                <Label htmlFor="obras" className="cursor-pointer">
                  Obras
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relatorios"
                  checked={permissoesGlobais.relatorios}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("relatorios", checked === true)}
                />
                <Label htmlFor="relatorios" className="cursor-pointer">
                  Relatórios
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="simulacao"
                  checked={permissoesGlobais.simulacao}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("simulacao", checked === true)}
                />
                <Label htmlFor="simulacao" className="cursor-pointer">
                  Simulação
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financeiro"
                  checked={permissoesGlobais.financeiro}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("financeiro", checked === true)}
                />
                <Label htmlFor="financeiro" className="cursor-pointer">
                  Financeiro
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usuarios"
                  checked={permissoesGlobais.usuarios}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("usuarios", checked === true)}
                />
                <Label htmlFor="usuarios" className="cursor-pointer">
                  Usuários
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="configuracoes"
                  checked={permissoesGlobais.configuracoes}
                  onCheckedChange={(checked) => handlePermissaoGlobalChange("configuracoes", checked === true)}
                />
                <Label htmlFor="configuracoes" className="cursor-pointer">
                  Configurações
                </Label>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Permissões no Aplicativo Móvel */}
        <div>
          <h3 className="text-lg font-medium mb-3">Permissões no Aplicativo Móvel</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card className="p-4 border shadow-sm">
              <p className="text-sm text-gray-500 mb-3">
                Configure quais tipos de despesas o usuário pode registrar no aplicativo móvel.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="combustivel-app"
                    checked={permissoesDespesas.combustivel}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("combustivel", checked === true)}
                  />
                  <Label htmlFor="combustivel-app" className="cursor-pointer">
                    Combustível
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refeicao-app"
                    checked={permissoesDespesas.refeicao}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("refeicao", checked === true)}
                  />
                  <Label htmlFor="refeicao-app" className="cursor-pointer">
                    Refeição
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hospedagem-app"
                    checked={permissoesDespesas.hospedagem}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("hospedagem", checked === true)}
                  />
                  <Label htmlFor="hospedagem-app" className="cursor-pointer">
                    Hospedagem
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aluguel-equipamentos-app"
                    checked={permissoesDespesas.aluguelEquipamentos}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("aluguelEquipamentos", checked === true)}
                  />
                  <Label htmlFor="aluguel-equipamentos-app" className="cursor-pointer">
                    Aluguel de Equipamentos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="materiais-app"
                    checked={permissoesDespesas.materiais}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("materiais", checked === true)}
                  />
                  <Label htmlFor="materiais-app" className="cursor-pointer">
                    Materiais
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outros-app"
                    checked={permissoesDespesas.outros}
                    onCheckedChange={(checked) => handlePermissaoDespesaChange("outros", checked === true)}
                  />
                  <Label htmlFor="outros-app" className="cursor-pointer">
                    Outros (campo personalizável)
                  </Label>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-cyan-50 border border-cyan-200">
              <h4 className="text-base font-medium mb-3 text-cyan-800">Status atual das permissões</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-cyan-700">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Combustível
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Refeição
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Hospedagem
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-cyan-700">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Aluguel de Equipamentos
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Materiais
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Outros (campo personalizável)
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <DialogFooter className="mt-6 sticky bottom-0 bg-white pt-2 z-10">
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogFooter>
    </div>
  )
}
