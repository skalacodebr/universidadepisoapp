"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados de exemplo para o diário de obras
const diarioData = [
  {
    id: 1,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 48,
  },
  {
    id: 2,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 45,
  },
  {
    id: 3,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 39,
  },
  {
    id: 4,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 32,
  },
  {
    id: 5,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 25,
  },
  {
    id: 6,
    data: "04/02/25",
    cadastradoPor: "Ronaldo Silva",
    percentualConcluido: 10,
  },
]

export default function DiarioObras() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("obras")
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  // Navegar para a página de perfil
  const goToProfile = () => {
    router.push("/perfil")
  }

  // Navegar para outras páginas
  const navigateTo = (page: string) => {
    router.push(`/${page}`)
  }

  // Abrir o modal de novo diário
  const openNewDiarioDialog = () => {
    setIsDialogOpen(true)
    setCurrentStep(1)
  }

  // Fechar o modal
  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  // Avançar para o próximo passo do formulário
  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  // Renderizar o conteúdo do modal baseado no passo atual
  const renderDialogContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Novo diário de obra</DialogTitle>
                <Button variant="ghost" size="icon" onClick={closeDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <h3 className="text-base font-medium mb-4">Informações Principais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">
                    Data <span className="text-xs text-gray-500">(Preenchimento automático)</span>
                  </Label>
                  <Input id="data" placeholder="DD/MM/AAAA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável pela Obra</Label>
                  <Input id="responsavel" placeholder="Digite o nome do Responsável pela Obra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obra">
                    Obra <span className="text-xs text-gray-500">(Preenchimento automático)</span>
                  </Label>
                  <Input id="obra" placeholder="Nome da Obra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone do Responsável</Label>
                  <Input id="telefone" placeholder="Digite o telefone do Responsável pela Obra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente">
                    Cliente <span className="text-xs text-gray-500">(Preenchimento automático)</span>
                  </Label>
                  <Input id="cliente" placeholder="Nome do cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail do Responsável</Label>
                  <Input id="email" placeholder="Digite o e-mail do Responsável pela Obra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="construtora">
                    Construtora <span className="text-xs text-gray-500">(Preenchimento automático)</span>
                  </Label>
                  <Input id="construtora" placeholder="Nome da construtora" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concreteira">Concreteira</Label>
                  <Input id="concreteira" placeholder="Digite o nome da Concreteira" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">
                    Endereço da Obra{" "}
                    <span className="text-xs text-gray-500">(Preenchimento automático com geolocalização)</span>
                  </Label>
                  <Input id="endereco" placeholder="Endereço da obra" />
                </div>
              </div>

              <h3 className="text-base font-medium mt-8 mb-4">Informações da Obra</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Área Total da Obra</Label>
                  <Input id="area" placeholder="m²" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lancamento">
                    Lançamento do Concreto <span className="text-xs text-gray-500">(o sistema calcula)</span>
                  </Label>
                  <Input id="lancamento" placeholder="m³/hora" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo de Execução</Label>
                  <Input id="prazo" placeholder="Quantidade de dias" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-acabamento">Tipo de Acabamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de acabamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="polido">Polido</SelectItem>
                      <SelectItem value="queimado">Queimado</SelectItem>
                      <SelectItem value="liso">Liso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reforco">Reforço Estrutural</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de reforço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-cura">Tipo de Cura</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de acabamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quimica">Química com membrana</SelectItem>
                      <SelectItem value="umida">Úmida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="espessura">Espessura do Piso</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Cm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 cm</SelectItem>
                      <SelectItem value="8">8 cm</SelectItem>
                      <SelectItem value="10">10 cm</SelectItem>
                      <SelectItem value="12">12 cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={nextStep} className="bg-[#0096b2] hover:bg-[#007a91]">
                Continuar
              </Button>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Novo diário de obra</DialogTitle>
                <Button variant="ghost" size="icon" onClick={closeDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inicio-concretagem">Início da Concretagem</Label>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <Input type="date" id="data-inicio-concretagem" />
                    </div>
                    <div className="w-1/2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="producao-acumulada">
                    Produção Acumulada <span className="text-xs text-gray-500">(o sistema calcula)</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a Produção do Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 m²</SelectItem>
                      <SelectItem value="200">200 m²</SelectItem>
                      <SelectItem value="300">300 m²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inicio-acabamento">Início do Acabamento</Label>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <Input type="date" id="data-inicio-acabamento" />
                    </div>
                    <div className="w-1/2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume-teorico">
                    Volume de Concreto Teórico <span className="text-xs text-gray-500">(o sistema calcula)</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a Produção do Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 m³</SelectItem>
                      <SelectItem value="20">20 m³</SelectItem>
                      <SelectItem value="30">30 m³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termino-concretagem">Término da Concretagem</Label>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <Input type="date" id="data-termino-concretagem" />
                    </div>
                    <div className="w-1/2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume-real">Volume de Concreto Real</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Volume de Concreto Real" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 m³</SelectItem>
                      <SelectItem value="20">20 m³</SelectItem>
                      <SelectItem value="30">30 m³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termino-acabamento">Término do Acabamento</Label>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <Input type="date" id="data-termino-acabamento" />
                    </div>
                    <div className="w-1/2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18:00">18:00</SelectItem>
                          <SelectItem value="19:00">19:00</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="juntas-serradas">Juntas Serradas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="producao-dia">Produção do Dia</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a Produção do Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 m²</SelectItem>
                      <SelectItem value="200">200 m²</SelectItem>
                      <SelectItem value="300">300 m²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="juntas-encontro">Juntas de Encontro</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-base font-medium mb-4">Equipe</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-sm">Nome do funcionário</div>
                  <div className="font-medium text-sm">Entrada</div>
                  <div className="font-medium text-sm">Saída</div>
                </div>
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center">
                      <Checkbox id={`funcionario-${index}`} className="mr-2" />
                      <Label htmlFor={`funcionario-${index}`}>Nome do funcionário</Label>
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-base font-medium mb-4">Equipamentos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-medium text-sm">Nome do equipamento</div>
                  <div className="font-medium text-sm">Quantidade</div>
                </div>
                {[1, 2, 3].map((index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center">
                      <Checkbox id={`equipamento-${index}`} className="mr-2" />
                      <Label htmlFor={`equipamento-${index}`}>Nome do equipamento</Label>
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Quantidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={nextStep} className="bg-[#0096b2] hover:bg-[#007a91]">
                Continuar
              </Button>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Novo diário de obra</DialogTitle>
                <Button variant="ghost" size="icon" onClick={closeDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base font-medium mb-4">Condição do Tempo</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Manhã</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensolarado">Ensolarado</SelectItem>
                          <SelectItem value="nublado">Nublado</SelectItem>
                          <SelectItem value="chuvoso">Chuvoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tarde</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensolarado">Ensolarado</SelectItem>
                          <SelectItem value="nublado">Nublado</SelectItem>
                          <SelectItem value="chuvoso">Chuvoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Noite</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensolarado">Ensolarado</SelectItem>
                          <SelectItem value="nublado">Nublado</SelectItem>
                          <SelectItem value="chuvoso">Chuvoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <h3 className="text-base font-medium mt-6 mb-4">Ocorrência na Obra</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="atraso" />
                      <Label htmlFor="atraso">Atraso de concreto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="falta-material" />
                      <Label htmlFor="falta-material">Falta de área liberada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pega-diferenciada" />
                      <Label htmlFor="pega-diferenciada">Pega diferenciada no concreto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="espessura" />
                      <Label htmlFor="espessura">Espessura maior/menor na sub-base</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="quebra" />
                      <Label htmlFor="quebra">Quebra de equipamentos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="area-sem-cobertura" />
                      <Label htmlFor="area-sem-cobertura">Área sem cobertura</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="outro" />
                      <Label htmlFor="outro">Outro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nenhuma" />
                      <Label htmlFor="nenhuma">Nenhuma ocorrência</Label>
                    </div>
                  </div>

                  <h3 className="text-base font-medium mt-6 mb-4">Avaliação dos trabalhos</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Juntas Fria / Pega diferenciada</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Manchamento Superficial</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-4">Alinhamento de corte das juntas</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Alinhamento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Profundidade do corte das juntas</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Esborcinamento do corte das juntas</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Qualidade do acabamento superficial</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Qualidade do acabamento no pé da parede/pilar</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Planicidade e Nivelamento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Organização e Limpeza</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Posicionamento da armadura</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Posicionamento dos reforços</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fissuras na superfície</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione de 1 a 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      Anexar imagem
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Você está offline. Seu registro será salvo quando conectar à uma rede.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={closeDialog} className="bg-[#0096b2] hover:bg-[#007a91]">
                Salvar
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Diário de Obras Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Diário de obras</h1>
              <Button className="bg-[#1e2a4a] hover:bg-[#15203a] text-white" onClick={openNewDiarioDialog}>
                Novo registro
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="w-64">
                <p className="text-sm text-gray-500 mb-1">Período</p>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="mes-atual">Mês Atual</SelectItem>
                    <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cadastrado por
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Concluída
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {diarioData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cadastradoPor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.percentualConcluido}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                                <span className="sr-only">Abrir menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>Mostrando 1-09 de 78</div>
              <div className="flex space-x-1">
                <button className="p-2 rounded-md hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="p-2 rounded-md hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para novo diário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">{renderDialogContent()}</DialogContent>
      </Dialog>
    </div>
  )
}
