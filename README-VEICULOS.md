# Sistema de Cálculo de Veículos - Simulação

## Resumo
O sistema agora inclui o cálculo automático dos custos de veículos na simulação de obras.

## Funcionalidades Implementadas

### 1. Gerenciamento de Veículos
- **Aba "Veículos da Obra"** na página de simulação
- Adicionar veículos com tipo e quantidade
- Listar veículos cadastrados
- Excluir veículos

### 2. Cálculo Automático
**Fórmula de Cálculo:**
```
Custo Total = Distância da Obra × Dias da Obra × Quantidade × R$/Km
```

**Exemplo:**
- Distância da obra: 50 km
- Dias da obra: 10 dias  
- Pick Up (quantidade: 2, R$/km: 0,80)
- Cálculo: 50 × 10 × 2 × 0,80 = R$ 800,00

### 3. Integração com Banco de Dados
- **Tabela `obras_veiculos_simulacao`**: Armazena veículos selecionados pelo usuário
- **Tabela `veiculos`**: Contém informações dos veículos (nome, R$/km)
- **Campo `custo_veiculos`**: Salva o custo total calculado na tabela `obras`

### 4. Visualização no Resultado
- Nova seção "Veículos" no resultado da simulação
- Exibe detalhes: nome, tipo, R$/km, quantidade, custo total
- Mostra custo total e percentual sobre o valor da obra

## Estrutura Técnica

### Interfaces TypeScript
```typescript
interface VeiculoComCusto {
  veiculo: string
  tipo: string
  quantidade: number
  rs_km: number
  distancia_obra: number
  dias_obra: number
  custo_total: number
}

interface Veiculos {
  veiculos: VeiculoComCusto[]
  totalVeiculos: number
  percentualTotalVeiculos: number
}
```

### Fluxo de Dados
1. Usuário adiciona veículos na aba "Veículos da Obra"
2. Dados salvos em `obras_veiculos_simulacao`
3. Durante simulação: sistema busca veículos do usuário
4. Calcula custos usando distância e dias da obra
5. Inclui resultado na visualização e salva no banco

## Tipos de Veículos Suportados
- **PREPARAÇÃO DA OBRA**
- **CONCRETAGEM E ACABAMENTO**  
- **CORTE E/OU FINALIZAÇÃO**

## Scripts de Configuração
- `scripts/disable-rls-obras-veiculos-simulacao.sql`: Desabilita RLS (desenvolvimento)
- `scripts/add-columns-obras-veiculos-simulacao.sql`: Adiciona colunas tipo e quantidade

## Status
✅ **Implementado e funcionando**
- Cálculo automático dos custos
- Integração com banco de dados
- Visualização no resultado da simulação
- Interface de gerenciamento de veículos 