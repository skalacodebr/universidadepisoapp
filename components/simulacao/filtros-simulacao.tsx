import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FiltrosSimulacaoProps {
  termoPesquisa: string;
  setTermoPesquisa: (value: string) => void;
  statusFiltro: string;
  setStatusFiltro: (value: string) => void;
  periodoFiltro: string;
  setPeriodoFiltro: (value: string) => void;
  tipoObraFiltro: string;
  setTipoObraFiltro: (value: string) => void;
}

export function FiltrosSimulacao({
  termoPesquisa,
  setTermoPesquisa,
  statusFiltro,
  setStatusFiltro,
  periodoFiltro,
  setPeriodoFiltro,
  tipoObraFiltro,
  setTipoObraFiltro
}: FiltrosSimulacaoProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="pesquisa" className="text-sm text-gray-500">Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="pesquisa"
                placeholder="Buscar por nome ou construtora..."
                className="pl-8"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm text-gray-500">Status</Label>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger id="status" className="w-full bg-white">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="fechada">Fechada</SelectItem>
                <SelectItem value="perdida">Perdida</SelectItem>
                <SelectItem value="indefinida">Indefinida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodo" className="text-sm text-gray-500">Período</Label>
            <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
              <SelectTrigger id="periodo" className="w-full bg-white">
                <SelectValue placeholder="Todos os períodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoObra" className="text-sm text-gray-500">Tipo de Obra</Label>
            <Select value={tipoObraFiltro} onValueChange={setTipoObraFiltro}>
              <SelectTrigger id="tipoObra" className="w-full bg-white">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="residencial">Residencial</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
