import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Despesa {
  id: number;
  descricao: string;
  valor: string;
  data: string;
  categoria: string;
  cadastradoPor: string;
  fornecedor: string;
  comprovante: string;
  observacoes: string;
}

interface TabelaDespesaProps {
  despesas: Despesa[];
  onDeleteDespesa: (id: number) => void;
}

export function TabelaDespesa({ despesas, onDeleteDespesa }: TabelaDespesaProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastrado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de despesa
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {despesas.length > 0 ? (
                despesas.map((despesa) => (
                  <tr key={despesa.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{despesa.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{despesa.valor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{despesa.cadastradoPor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{despesa.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteDespesa(despesa.id)} className="cursor-pointer text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    Nenhuma despesa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
