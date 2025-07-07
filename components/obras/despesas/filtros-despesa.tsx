import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FiltrosDespesaProps {
  pesquisaDescricao: string;
  setPesquisaDescricao: (value: string) => void;
  filtroPeriodo: string;
  setFiltroPeriodo: (value: string) => void;
}

export function FiltrosDespesa({
  pesquisaDescricao,
  setPesquisaDescricao,
  filtroPeriodo,
  setFiltroPeriodo
}: FiltrosDespesaProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-3/4">
            <Label htmlFor="pesquisa" className="text-sm text-gray-500 mb-1">Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="pesquisa"
                placeholder="Pesquisar descrição ou categoria..."
                className="pl-8"
                value={pesquisaDescricao}
                onChange={(e) => setPesquisaDescricao(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <Label htmlFor="periodo" className="text-sm text-gray-500 mb-1">Período</Label>
            <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
              <SelectTrigger id="periodo" className="w-full bg-white">
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
      </CardContent>
    </Card>
  );
}
