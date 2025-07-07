# 🚗 Problema: Veículos com Custo R$ 0,00

## 🚨 Diagnóstico do Problema ATUALIZADO

O custo dos veículos está aparecendo como **R$ 0,00** na simulação por **DOIS** problemas:

1. ✅ **Tabela `veiculos` vazia** (RESOLVIDO - dados inseridos)
2. 🚨 **RLS (Row Level Security) bloqueando acesso** (PROBLEMA ATUAL)

## 🔍 Fluxo do Problema Atualizado

```
1. Usuário adiciona "Pick Up" → ✅ Salva em obras_veiculos_simulacao
2. Simulação busca "Pick Up" na tabela veiculos → ❌ RLS BLOQUEIA (Array(0))
3. rsKm = 0 (fallback)
4. Cálculo: 25km × 2 × 8 dias × 1 × R$ 0,00 = R$ 0,00 ❌
```

## ✅ Solução Completa

### 1. ✅ Popular a tabela `veiculos` (JÁ FEITO)

```sql
INSERT INTO veiculos (veiculo, rs_km) VALUES
('Pick Up', 0.8),
('Caminhão', 1.2),
('Kombi', 0.7),
('Passeio 5 pessoas', 0.6)
ON CONFLICT (veiculo) DO UPDATE SET rs_km = EXCLUDED.rs_km;
```

### 2. 🔧 Configurar RLS na tabela `veiculos` (NECESSÁRIO)

Execute no **Supabase SQL Editor**:

```sql
-- Habilitar RLS
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

-- Permitir SELECT para usuários autenticados
CREATE POLICY "Permitir SELECT para usuários autenticados" ON veiculos
    FOR SELECT TO authenticated USING (true);

-- Permitir INSERT para usuários autenticados  
CREATE POLICY "Permitir INSERT para usuários autenticados" ON veiculos
    FOR INSERT TO authenticated WITH CHECK (true);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Permitir UPDATE para usuários autenticados" ON veiculos
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Permitir DELETE para usuários autenticados" ON veiculos
    FOR DELETE TO authenticated USING (true);
```

### 3. ✅ Verificar se funcionou

Após executar os scripts, teste uma nova simulação. O log deve mostrar:

```
✅ Todos os veículos na tabela 'veiculos': Array(4) [Pick Up, Caminhão, ...]
✅ Comparando: "pick up" === "pick up" = true
✅ Veículo encontrado: Pick Up = R$ 0.8/km
Veículo Pick Up: 25km × 2 (ida/volta) × 8 dias × 1 × R$0.8/km = R$320
```

## 🔧 Logs de Debug Implementados

O sistema agora mostra logs detalhados:

- 🔍 **Todos os veículos na tabela 'veiculos'**: Array completo ou vazio (indica RLS)
- 🔍 **Comparando**: nomes normalizados para case-insensitive
- ✅ **Veículos encontrados após filtro manual**: resultado final

## 📊 Resultado Esperado

**ANTES (PROBLEMA RLS):**
```
Todos os veículos na tabela 'veiculos': Array(0)
Pick Up: R$ 0,00/km → Custo Total: R$ 0,00
```

**DEPOIS (RLS CONFIGURADO):**
```
Todos os veículos na tabela 'veiculos': Array(4)
Pick Up: R$ 0,80/km → Custo Total: R$ 320,00
(25km × 2 × 8 dias × 1 × R$ 0,80)
```

## 🎯 Próximos Passos

1. ✅ ~~Execute o script de população~~ (FEITO)
2. 🔧 **Execute o script de RLS** (`scripts/configure-rls-veiculos.sql`)
3. 🧪 Teste uma nova simulação
4. 📊 Verifique os logs no console
5. ✅ Confirme que o custo não está mais R$ 0,00

## 📁 Scripts Criados

- ✅ `scripts/populate-veiculos.sql` - Popular dados
- 🔧 `scripts/configure-rls-veiculos.sql` - Configurar RLS
- 📖 `README-VEICULOS-PROBLEMA.md` - Documentação completa 