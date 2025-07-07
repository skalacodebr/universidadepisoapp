import React, { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, ImageIcon, Upload, X } from "lucide-react";

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

interface ModalNovaDespesaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDespesa: (despesa: Omit<Despesa, 'id'>) => void;
}

export function ModalNovaDespesa({ isOpen, onOpenChange, onAddDespesa }: ModalNovaDespesaProps) {
  // Estados para o formulário de nova despesa
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState<Date | undefined>(undefined);
  const [categoria, setCategoria] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Função para lidar com o upload de imagem
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover a imagem
  const handleRemoveImage = () => {
    setImagem(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setDescricao("");
    setValor("");
    setData(undefined);
    setCategoria("");
    setFornecedor("");
    setObservacoes("");
    setImagem(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Função para submeter o formulário
  const handleSubmit = () => {
    if (!descricao || !valor || !data || !categoria) {
      // Validação básica
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const novaDespesa = {
      descricao,
      valor,
      data: format(data, "dd/MM/yyyy"),
      categoria,
      cadastradoPor: "Usuário Atual", // Em um sistema real, seria o usuário logado
      fornecedor,
      comprovante: imagem ? imagem.name : "",
      observacoes,
    };

    // Adicionar a despesa na página atual
    onAddDespesa(novaDespesa);

    // Salvar a despesa para a página de detalhes da obra também
    try {
      // Buscar despesas existentes do localStorage
      const obraId = window.location.pathname.split('/')[2]; // Pega o ID da obra da URL
      const despesasStorage = localStorage.getItem(`despesas_obra_${obraId}`);
      const despesasAtuais = despesasStorage ? JSON.parse(despesasStorage) : [];
      
      // Criar objeto no formato esperado pela página de detalhes
      const despesaParaDetalhes = {
        data: `Dia ${format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
        valor: valor.startsWith('R$') ? valor : `R$ ${valor}`,
        categoria: categoria,
        descricao: descricao
      };
      
      // Adicionar nova despesa no início do array
      const novasDespesas = [despesaParaDetalhes, ...despesasAtuais];
      
      // Limitar para manter apenas as 10 despesas mais recentes
      const despesasLimitadas = novasDespesas.slice(0, 10);
      
      // Salvar de volta no localStorage
      localStorage.setItem(`despesas_obra_${obraId}`, JSON.stringify(despesasLimitadas));
      
      console.log('Despesa salva com sucesso para a página de detalhes da obra');
    } catch (error) {
      console.error('Erro ao salvar despesa para a página de detalhes:', error);
    }

    resetForm();
    onOpenChange(false);
  };

  // Verificar se todos os campos obrigatórios estão preenchidos
  const isFormValid = descricao && valor && data && categoria;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] p-0 border-none overflow-visible"
      >
        <div className="p-10 overflow-y-auto max-h-[85vh]">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl">Novo registro de despesa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="categoria">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-full focus:outline-none focus:ring-2 focus:ring-offset-0">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                  <SelectItem value="Combustível">Combustível</SelectItem>
                  <SelectItem value="Ferramenta">Ferramenta</SelectItem>
                  <SelectItem value="Peças">Peças</SelectItem>
                  <SelectItem value="Materiais">Materiais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="descricao">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a despesa"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-0"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="valor">
                Valor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="valor"
                mask="dinheiro"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-0"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="date">
                Data <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal focus:outline-none focus:ring-2 focus:ring-offset-0",
                      !data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? formatDate(data) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                placeholder="Nome do fornecedor"
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-0"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="comprovante">Comprovante</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="comprovante"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*,.pdf"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-offset-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar arquivo
                </Button>
              </div>
              {previewUrl && (
                <div className="mt-2 relative">
                  <div className="border rounded p-2 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      {previewUrl.startsWith("data:image") ? (
                        <ImageIcon className="h-5 w-5 mr-2 text-gray-600" />
                      ) : (
                        <FileText className="h-5 w-5 mr-2 text-gray-600" />
                      )}
                      <span className="text-sm truncate max-w-[200px]">
                        {imagem?.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-500"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
                className="min-h-[100px] w-full focus:outline-none focus:ring-2 focus:ring-offset-0"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="focus:outline-none focus:ring-2 focus:ring-offset-0"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={cn(
                "bg-[#007EA3] hover:bg-[#006a8a] focus:outline-none focus:ring-2 focus:ring-offset-0",
                !isFormValid && "opacity-50 cursor-not-allowed"
              )}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
