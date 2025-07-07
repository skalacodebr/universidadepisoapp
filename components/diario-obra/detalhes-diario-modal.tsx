"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { DiarioObraData } from "./novo-diario-modal"

interface DetalhesDiarioModalProps {
  isOpen: boolean
  onClose: () => void
  diario: DiarioObraData | null
}

export function DetalhesDiarioModal({ isOpen, onClose, diario }: DetalhesDiarioModalProps) {
  if (!diario) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-4xl max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-center flex-1">Detalhes do Diário de Obra</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#0096b2]">Informações Principais</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data</p>
                  <p>{diario.informacoesPrincipais.data}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Responsável pela Obra</p>
                  <p>{diario.informacoesPrincipais.responsavelObra || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Obra</p>
                  <p>{diario.informacoesPrincipais.obra}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone do Responsável</p>
                  <p>{diario.informacoesPrincipais.telefoneResponsavel || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p>{diario.informacoesPrincipais.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail do Responsável</p>
                  <p>{diario.informacoesPrincipais.emailResponsavel || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Construtora</p>
                  <p>{diario.informacoesPrincipais.construtora}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Concreteira</p>
                  <p>{diario.informacoesPrincipais.concreteira || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço da Obra</p>
                  <p>{diario.informacoesPrincipais.enderecoObra || "Não informado"}</p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Informações da Obra</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Área Total da Obra</p>
                  <p>{diario.informacoesObra.areaTotal ? `${diario.informacoesObra.areaTotal} m²` : "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prazo de Execução</p>
                  <p>
                    {diario.informacoesObra.prazoExecucao
                      ? `${diario.informacoesObra.prazoExecucao} dias`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reforço Estrutural</p>
                  <p>
                    {diario.informacoesObra.reforcoEstrutural === "sim"
                      ? "Sim"
                      : diario.informacoesObra.reforcoEstrutural === "nao"
                        ? "Não"
                        : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Espessura do Piso</p>
                  <p>
                    {diario.informacoesObra.espessuraPiso
                      ? `${diario.informacoesObra.espessuraPiso} cm`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Lançamento do Concreto</p>
                  <p>
                    {diario.informacoesObra.lancamentoConcreto
                      ? `${diario.informacoesObra.lancamentoConcreto} m³/hora`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Acabamento</p>
                  <p>{diario.informacoesObra.tipoAcabamento || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Cura</p>
                  <p>
                    {diario.informacoesObra.tipoCura === "quimica"
                      ? "Química com membrana"
                      : diario.informacoesObra.tipoCura === "umida"
                        ? "Úmida"
                        : "Não informado"}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Condição do Tempo</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Manhã</p>
                  <p>{diario.condicaoTempo.manha || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tarde</p>
                  <p>{diario.condicaoTempo.tarde || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Noite</p>
                  <p>{diario.condicaoTempo.noite || "Não informado"}</p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Ocorrências na Obra</h3>
              <div className="space-y-1">
                {diario.ocorrencias.atrasoConcreto && <p>• Atraso de concreto</p>}
                {diario.ocorrencias.faltaAreaLiberada && <p>• Falta de área liberada</p>}
                {diario.ocorrencias.pegaDiferenciada && <p>• Pega diferenciada no concreto</p>}
                {diario.ocorrencias.espessuraSubBase && <p>• Espessura maior/menor na sub-base</p>}
                {diario.ocorrencias.quebraEquipamentos && <p>• Quebra de equipamentos</p>}
                {diario.ocorrencias.areaSemCobertura && <p>• Área sem cobertura</p>}
                {diario.ocorrencias.outro && <p>• Outro</p>}
                {diario.ocorrencias.nenhumaOcorrencia && <p>• Nenhuma ocorrência</p>}
                {!Object.values(diario.ocorrencias).some((v) => v) && <p>Nenhuma ocorrência registrada</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-[#0096b2]">Concretagem</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Início da Concretagem</p>
                  <p>
                    {diario.concretagem.inicioConcretagem.data && diario.concretagem.inicioConcretagem.hora
                      ? `${diario.concretagem.inicioConcretagem.data} às ${diario.concretagem.inicioConcretagem.hora}`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Início do Acabamento</p>
                  <p>
                    {diario.concretagem.inicioAcabamento.data && diario.concretagem.inicioAcabamento.hora
                      ? `${diario.concretagem.inicioAcabamento.data} às ${diario.concretagem.inicioAcabamento.hora}`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Término da Concretagem</p>
                  <p>
                    {diario.concretagem.terminoConcretagem.data && diario.concretagem.terminoConcretagem.hora
                      ? `${diario.concretagem.terminoConcretagem.data} às ${diario.concretagem.terminoConcretagem.hora}`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Término do Acabamento</p>
                  <p>
                    {diario.concretagem.terminoAcabamento.data && diario.concretagem.terminoAcabamento.hora
                      ? `${diario.concretagem.terminoAcabamento.data} às ${diario.concretagem.terminoAcabamento.hora}`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Produção Acumulada</p>
                  <p>
                    {diario.concretagem.producaoAcumulada
                      ? `${diario.concretagem.producaoAcumulada} m²`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Volume de Concreto Teórico</p>
                  <p>
                    {diario.concretagem.volumeConcreteTeorioco
                      ? `${diario.concretagem.volumeConcreteTeorioco} m³`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Volume de Concreto Real</p>
                  <p>
                    {diario.concretagem.volumeConcreteReal
                      ? `${diario.concretagem.volumeConcreteReal} m³`
                      : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Juntas Serradas</p>
                  <p>
                    {diario.concretagem.juntasSerradas === "sim"
                      ? "Sim"
                      : diario.concretagem.juntasSerradas === "nao"
                        ? "Não"
                        : "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Produção do Dia</p>
                  <p>{diario.concretagem.producaoDia ? `${diario.concretagem.producaoDia} m²` : "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Juntas de Encontro</p>
                  <p>
                    {diario.concretagem.juntasEncontro === "sim"
                      ? "Sim"
                      : diario.concretagem.juntasEncontro === "nao"
                        ? "Não"
                        : "Não informado"}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Equipe</h3>
              <div className="space-y-2">
                {diario.equipe.some((e) => e.selecionado) ? (
                  diario.equipe
                    .filter((e) => e.selecionado)
                    .map((funcionario, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{funcionario.nome}</span>
                        <span className="text-sm text-gray-500">
                          {funcionario.entrada && funcionario.saida
                            ? `${funcionario.entrada} - ${funcionario.saida}`
                            : "Horário não informado"}
                        </span>
                      </div>
                    ))
                ) : (
                  <p>Nenhum funcionário registrado</p>
                )}
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Equipamentos</h3>
              <div className="space-y-2">
                {diario.equipamentos.some((e) => e.selecionado) ? (
                  diario.equipamentos
                    .filter((e) => e.selecionado)
                    .map((equipamento, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{equipamento.nome}</span>
                        <span className="text-sm text-gray-500">
                          {equipamento.quantidade ? `${equipamento.quantidade} unidade(s)` : "Quantidade não informada"}
                        </span>
                      </div>
                    ))
                ) : (
                  <p>Nenhum equipamento registrado</p>
                )}
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-[#0096b2]">Avaliações</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(diario.avaliacoes).map(([key, value], index) => {
                  let label = ""
                  switch (key) {
                    case "juntasFrias":
                      label = "Juntas Fria / Pega diferenciada"
                      break
                    case "manchamentoSuperficial":
                      label = "Manchamento Superficial"
                      break
                    case "alinhamentoCorte":
                      label = "Alinhamento de corte"
                      break
                    case "profundidadeCorte":
                      label = "Profundidade do corte"
                      break
                    case "esborcinamentoCorte":
                      label = "Esborcinamento do corte"
                      break
                    case "qualidadeAcabamentoSuperficial":
                      label = "Qualidade do acabamento superficial"
                      break
                    case "qualidadeAcabamentoPeParede":
                      label = "Qualidade do acabamento no pé da parede"
                      break
                    case "planicidadeNivelamento":
                      label = "Planicidade e Nivelamento"
                      break
                    case "organizacaoLimpeza":
                      label = "Organização e Limpeza"
                      break
                    case "posicionamentoArmadura":
                      label = "Posicionamento da armadura"
                      break
                    case "posicionamentoReforcos":
                      label = "Posicionamento dos reforços"
                      break
                    case "fissurasSuperficie":
                      label = "Fissuras na superfície"
                      break
                    default:
                      label = key
                  }

                  return (
                    <div key={index}>
                      <p className="text-sm font-medium text-gray-500">{label}</p>
                      <p>{value || "Não avaliado"}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
