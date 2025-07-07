"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
}

export function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: {
      aberta: true,
      fechada: true,
      cancelada: false,
    },
    tipo: {
      residencial: true,
      comercial: true,
      industrial: false,
    }
  })

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  const handleFilterChange = (category: string, item: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [item]: checked
      }
    }))
    
    onFilterChange(filters)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar por nome, cliente ou local..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-aberta" 
                checked={filters.status.aberta}
                onCheckedChange={(checked) => 
                  handleFilterChange('status', 'aberta', checked as boolean)
                }
              />
              <label htmlFor="filter-aberta" className="flex-1 cursor-pointer">Aberta</label>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-fechada" 
                checked={filters.status.fechada}
                onCheckedChange={(checked) => 
                  handleFilterChange('status', 'fechada', checked as boolean)
                }
              />
              <label htmlFor="filter-fechada" className="flex-1 cursor-pointer">Fechada</label>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-cancelada" 
                checked={filters.status.cancelada}
                onCheckedChange={(checked) => 
                  handleFilterChange('status', 'cancelada', checked as boolean)
                }
              />
              <label htmlFor="filter-cancelada" className="flex-1 cursor-pointer">Cancelada</label>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Tipo de Obra</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-residencial" 
                checked={filters.tipo.residencial}
                onCheckedChange={(checked) => 
                  handleFilterChange('tipo', 'residencial', checked as boolean)
                }
              />
              <label htmlFor="filter-residencial" className="flex-1 cursor-pointer">Residencial</label>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-comercial" 
                checked={filters.tipo.comercial}
                onCheckedChange={(checked) => 
                  handleFilterChange('tipo', 'comercial', checked as boolean)
                }
              />
              <label htmlFor="filter-comercial" className="flex-1 cursor-pointer">Comercial</label>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Checkbox 
                id="filter-industrial" 
                checked={filters.tipo.industrial}
                onCheckedChange={(checked) => 
                  handleFilterChange('tipo', 'industrial', checked as boolean)
                }
              />
              <label htmlFor="filter-industrial" className="flex-1 cursor-pointer">Industrial</label>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  )
}
