import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  Filter, 
  Edit, 
  Copy, 
  Trash2,
  Clock,
  DollarSign,
  BuildingIcon,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

// Definição de tipo para simulação
interface Simulacao {
  id: number;
  nomeObra: string;
  area: string;
  data: string;
  status: 'fechada' | 'perdida' | 'indefinida';
  valor: string;
  precoM2: string;
  lucro: string;
}

// Simulação de dados
const simulacoesMock: Simulacao[] = [
  {
    id: 1,
    nomeObra: "Condomínio Parque das Árvores",
    area: "1500 m²",
    data: "12/04/2024",
    status: "fechada",
    valor: "R$ 180.000,00",
    precoM2: "R$ 120,00",
    lucro: "22%",
  },
  {
    id: 2,
    nomeObra: "Edifício Comercial Centro",
    area: "800 m²",
    data: "10/04/2024",
    status: "perdida",
    valor: "R$ 104.000,00",
    precoM2: "R$ 130,00",
    lucro: "18%",
  },
  {
    id: 3,
    nomeObra: "Residencial Vista Mar",
    area: "2300 m²",
    data: "05/04/2024",
    status: "indefinida",
    valor: "R$ 299.000,00",
    precoM2: "R$ 130,00",
    lucro: "25%",
  },
  {
    id: 4,
    nomeObra: "Shopping Center Norte",
    area: "5000 m²",
    data: "28/03/2024",
    status: "fechada",
    valor: "R$ 650.000,00",
    precoM2: "R$ 130,00",
    lucro: "20%",
  },
  {
    id: 5,
    nomeObra: "Hospital Municipal",
    area: "3200 m²",
    data: "15/03/2024",
    status: "indefinida",
    valor: "R$ 384.000,00",
    precoM2: "R$ 120,00",
    lucro: "19%",
  }
];

export function SimulacaoSalvas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>(simulacoesMock);

  // Função para filtrar simulações
  const filtrarSimulacoes = () => {
    return simulacoesMock.filter(simulacao => {
      // Filtro de pesquisa por nome
      const matchesSearch = simulacao.nomeObra.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por status
      const matchesStatus = statusFilter === "todos" || simulacao.status === statusFilter;
      
      // Filtro por período (simulação simplificada)
      const matchesPeriodo = periodoFilter === "todos" || 
                           (periodoFilter === "30dias" && true) || 
                           (periodoFilter === "90dias" && true);
      
      return matchesSearch && matchesStatus && matchesPeriodo;
    });
  };

  // Renderiza o badge de status com cor apropriada
  const renderStatusBadge = (status: Simulacao['status']) => {
    switch (status) {
      case "fechada":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Fechada
          </Badge>
        );
      case "perdida":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" /> Perdida
          </Badge>
        );
      case "indefinida":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Indefinida
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Manipuladores de ação
  const handleEdit = (id: number) => {
    console.log(`Editar simulação ${id}`);
  };

  const handleDuplicate = (id: number) => {
    console.log(`Duplicar simulação ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Excluir simulação ${id}`);
    setSimulacoes(simulacoes.filter(s => s.id !== id));
  };

  const simulacoesFiltradas = filtrarSimulacoes();

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <label className="text-sm text-gray-500">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome da obra..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm text-gray-500">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="fechada">Fechada</SelectItem>
                  <SelectItem value="perdida">Perdida</SelectItem>
                  <SelectItem value="indefinida">Indefinida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm text-gray-500">Período</label>
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1">
              <Button variant="outline" className="w-full h-10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Simulações */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Simulações Salvas</h2>
          <p className="text-sm text-gray-500">{simulacoesFiltradas.length} resultados</p>
        </div>
        
        {simulacoesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {simulacoesFiltradas.map((simulacao) => (
              <Card key={simulacao.id} className="hover:border-gray-300 transition-colors">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded">
                          <BuildingIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{simulacao.nomeObra}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              {simulacao.area}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {simulacao.data}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-start md:justify-center">
                      {renderStatusBadge(simulacao.status)}
                    </div>
                    
                    <div className="md:col-span-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Preço/m²</p>
                        <p className="font-medium">{simulacao.precoM2}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Lucro</p>
                        <p className="font-medium">{simulacao.lucro}</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(simulacao.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDuplicate(simulacao.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(simulacao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma simulação encontrada</h3>
              <p className="text-gray-500 mb-4">
                Não encontramos nenhuma simulação com os filtros selecionados.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("todos");
                setPeriodoFilter("todos");
              }}>
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
