# SCHEMA COMPLETO DO BANCO DE DADOS SUPABASE

**Projeto:** UniversidadePisoApp
**Data da Extração:** 2025-10-09T13:07:51.410Z
**URL Supabase:** https://qxkwqonrfnpnhusxsppn.supabase.co

---

## Sumário Executivo

Este documento contém a análise completa do schema do banco de dados Supabase do projeto UniversidadePisoApp, um sistema para cálculo e gestão de pisos de concreto.

### Visão Geral

- **13 tabelas** identificadas no banco de dados
- **10 tabelas** contêm dados
- **3 tabelas** estão vazias (estrutura não disponível via API REST)
- **4 tabelas** referenciadas no código mas não existem no banco

### Principais Entidades

1. **usuarios** - Gestão de usuários do sistema
2. **obras** - Tabela principal com 72 colunas, armazena simulações e obras reais
3. **custofixo_usuario** - Custos fixos mensais da empresa (47 colunas)
4. **equipes_*** - 4 tabelas de equipes (concretagem, acabamento, preparação, finalização)
5. **veiculos** - Veículos disponíveis para as obras
6. **equipamentos** - Equipamentos utilizados nas obras
7. **tipo_acabamento** - Tipos de acabamento de piso
8. **tipo_reforco_estrutural** - Tipos de reforço estrutural

### Características Importantes

- **Modelo Híbrido:** Usa relacionamentos normalizados + campos JSONB para flexibilidade
- **Simulações:** A tabela `obras` serve para simulações e obras reais
- **Cálculos Complexos:** Muitos campos calculados (custos, prazos, lucros)
- **Campos JSONB:** Equipamentos e veículos armazenados como JSON na tabela obras

### Índice de Conteúdo

1. [Lista de Tabelas](#lista-de-tabelas)
2. [Estrutura Detalhada das Tabelas](#estrutura-detalhada-das-tabelas)
3. [Relacionamentos Detectados](#relacionamentos-detectados)
4. [Diagrama de Relacionamentos (ER)](#diagrama-de-relacionamentos-er-diagram-em-texto)
5. [Análise Adicional](#análise-adicional)
6. [Recomendações](#recomendações)
7. [Resumo](#resumo)

---

## Lista de Tabelas

✓ usuarios (3 registros)
✓ custofixo_usuario (2 registros)
✓ simples_brackets (vazia)
✓ equipes_concretagem (5 registros)
✓ equipes_acabamento (5 registros)
✓ equipes_preparacao (5 registros)
✓ equipes_finalizacao (5 registros)
✓ equipamentos (vazia)
✓ tipo_acabamento (3 registros)
✓ obras_veiculos_simulacao (vazia)
✓ veiculos (5 registros)
✓ obras (5 registros)
✓ tipo_reforco_estrutural (4 registros)

**Total de Tabelas Encontradas:** 13
**Total de Tabelas Ausentes:** 0

---

## Estrutura Detalhada das Tabelas

### usuarios

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| cpf | varchar/text | Provavelmente não |  |
| email | varchar/text | Provavelmente não |  |
| senha | text | Provavelmente não |  |
| cargos_id | integer/bigint | Provavelmente não | Provável FK para cargoss |
| status | boolean | Provavelmente não |  |
| salario | integer/bigint | Provavelmente não |  |
| beneficios | varchar/text | Sim |  |
| encargos | varchar/text | Sim |  |
| faturamento_anual | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 2,
  "nome": "Arthur Stein",
  "cpf": "047.900.900-90",
  "email": "arthurschmidtttt@gmail.com",
  "senha": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
  "cargos_id": 1,
  "status": true,
  "salario": 0,
  "beneficios": "",
  "encargos": "",
  "faturamento_anual": 190000
}
```

---

### custofixo_usuario

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| userid | integer/bigint | Provavelmente não | Provável FK para usuarios |
| total | integer/bigint | Provavelmente não |  |
| created_at | timestamp/timestamptz | Provavelmente não | Campo de auditoria |
| aluguel | integer/bigint | Provavelmente não |  |
| irpj_sobre_aluguel | integer/bigint | Provavelmente não |  |
| iptu | integer/bigint | Provavelmente não |  |
| seguranca_monitorada | integer/bigint | Provavelmente não |  |
| seguro_predial | integer/bigint | Provavelmente não |  |
| conta_agua | integer/bigint | Provavelmente não |  |
| conta_luz | integer/bigint | Provavelmente não |  |
| material_higiene_limpeza | integer/bigint | Provavelmente não |  |
| manutencao_predial | integer/bigint | Provavelmente não |  |
| seguro_vida_colaboradores | integer/bigint | Provavelmente não |  |
| servico_limpeza | integer/bigint | Provavelmente não |  |
| assistencia_medica | integer/bigint | Provavelmente não |  |
| equipe_administrativa | integer/bigint | Provavelmente não |  |
| alimentacao_equipe_administrativa | integer/bigint | Provavelmente não |  |
| pro_labore_socios | integer/bigint | Provavelmente não |  |
| beneficios_cesta_basica_auxilio_educacao |  | Sim |  |
| cipa | integer/bigint | Provavelmente não |  |
| ppra | integer/bigint | Provavelmente não |  |
| pcmat | integer/bigint | Provavelmente não |  |
| assessoria_juridica | integer/bigint | Provavelmente não |  |
| telefonia_fixa | integer/bigint | Provavelmente não |  |
| telefonia_celular | integer/bigint | Provavelmente não |  |
| telefonia_radio | integer/bigint | Provavelmente não |  |
| combustivel_veiculos | integer/bigint | Provavelmente não |  |
| seguro_veiculos | integer/bigint | Provavelmente não |  |
| ipva | integer/bigint | Provavelmente não |  |
| dpvat | integer/bigint | Provavelmente não |  |
| licenciamento_veicular | integer/bigint | Provavelmente não |  |
| manutencao_veiculos | integer/bigint | Provavelmente não |  |
| assessoria_contabil | integer/bigint | Provavelmente não |  |
| softwares_licenciamento | integer/bigint | Provavelmente não |  |
| sem_parar_pedagios | integer/bigint | Provavelmente não |  |
| assessoria_em_informatica | integer/bigint | Provavelmente não |  |
| banda_larga | integer/bigint | Provavelmente não |  |
| servicos_cartorio | integer/bigint | Provavelmente não |  |
| servico_mensageiro_motoboy | integer/bigint | Provavelmente não |  |
| material_escritorio | integer/bigint | Provavelmente não |  |
| alvara_funcionamento | integer/bigint | Provavelmente não |  |
| despesas_correio | integer/bigint | Provavelmente não |  |
| custos_bancarios | integer/bigint | Provavelmente não |  |
| taxas_municipais_estaduais_federais | integer/bigint | Provavelmente não |  |
| sindicatos_patronal | integer/bigint | Provavelmente não |  |
| hospedagem_manutencao_site | integer/bigint | Provavelmente não |  |
| beneficios_cesta_basica | integer/bigint | Provavelmente não |  |
| faturamento_12 | varchar/text | Provavelmente não |  |
| media_mes | integer/bigint | Provavelmente não |  |
| media_final | numeric/float/double | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 2,
  "userid": 1,
  "total": 73850,
  "created_at": "2025-07-04T19:39:43.287289+00:00",
  "aluguel": 50400,
  "irpj_sobre_aluguel": 500,
  "iptu": 250,
  "seguranca_monitorada": 500,
  "seguro_predial": 5700,
  "conta_agua": 500,
  "conta_luz": 500,
  "material_higiene_limpeza": 500,
  "manutencao_predial": 500,
  "seguro_vida_colaboradores": 500,
  "servico_limpeza": 500,
  "assistencia_medica": 500,
  "equipe_administrativa": 500,
  "alimentacao_equipe_administrativa": 500,
  "pro_labore_socios": 500,
  "beneficios_cesta_basica_auxilio_educacao": null,
  "cipa": 0,
  "ppra": 500,
  "pcmat": 0,
  "assessoria_juridica": 500,
  "telefonia_fixa": 0,
  "telefonia_celular": 0,
  "telefonia_radio": 0,
  "combustivel_veiculos": 0,
  "seguro_veiculos": 0,
  "ipva": 0,
  "dpvat": 0,
  "licenciamento_veicular": 0,
  "manutencao_veiculos": 0,
  "assessoria_contabil": 0,
  "softwares_licenciamento": 0,
  "sem_parar_pedagios": 0,
  "assessoria_em_informatica": 0,
  "banda_larga": 0,
  "servicos_cartorio": 0,
  "servico_mensageiro_motoboy": 0,
  "material_escritorio": 0,
  "alvara_funcionamento": 0,
  "despesas_correio": 0,
  "custos_bancarios": 0,
  "taxas_municipais_estaduais_federais": 0,
  "sindicatos_patronal": 0,
  "hospedagem_manutencao_site": 0,
  "beneficios_cesta_basica": 500,
  "faturamento_12": "180000.01-360000",
  "media_mes": 10000,
  "media_final": 7.385
}
```

---

### simples_brackets

**Status:** Tabela vazia - estrutura não pode ser inferida via API REST

---

### equipes_concretagem

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| qtd_pessoas | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 8,
  "nome": "Completo",
  "qtd_pessoas": 8
}
```

---

### equipes_acabamento

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| qtd_pessoas | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 8,
  "nome": "Completo",
  "qtd_pessoas": 8
}
```

---

### equipes_preparacao

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| qtd_pessoas | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 8,
  "nome": "Completo",
  "qtd_pessoas": 8
}
```

---

### equipes_finalizacao

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| qtd_pessoas | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 8,
  "nome": "Completo",
  "qtd_pessoas": 8
}
```

---

### equipamentos

**Status:** Tabela vazia - estrutura não pode ser inferida via API REST

---

### tipo_acabamento

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |
| area500 | numeric/float/double | Provavelmente não |  |
| area1000 | numeric/float/double | Provavelmente não |  |
| area1500 | numeric/float/double | Provavelmente não |  |
| area2000mais | numeric/float/double | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 3,
  "nome": "Liso Polido",
  "area500": 0.32,
  "area1000": 0.4,
  "area1500": 0.6,
  "area2000mais": 0.66
}
```

---

### obras_veiculos_simulacao

**Status:** Tabela vazia - estrutura não pode ser inferida via API REST

---

### veiculos

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| veiculo | varchar/text | Provavelmente não |  |
| created_at | timestamp/timestamptz | Provavelmente não | Campo de auditoria |
| rs_km | numeric/float/double | Provavelmente não |  |
| user_id | integer/bigint | Provavelmente não | Provável FK para users |

**Exemplo de Dados:**

```json
{
  "id": 1,
  "veiculo": "Pick Up",
  "created_at": "2025-06-16T17:18:23.087266+00:00",
  "rs_km": 0.8,
  "user_id": 0
}
```

---

### obras

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| usuarios_id | integer/bigint | Provavelmente não | Provável FK para usuarioss |
| simulacao | boolean | Provavelmente não |  |
| tipo_obra_id |  | Sim | Provável FK para tipo_obras |
| tipo_fundacao_id |  | Sim | Provável FK para tipo_fundacaos |
| nome | varchar/text | Provavelmente não |  |
| construtora | varchar/text | Provavelmente não |  |
| data_inicio | timestamp/timestamptz | Sim |  |
| data_previsao_termino |  | Sim |  |
| data_concretagem |  | Sim |  |
| status | varchar/text | Provavelmente não |  |
| cliente |  | Sim |  |
| responsavel |  | Sim |  |
| telefone_responsavel | varchar/text | Provavelmente não |  |
| email_responsavel |  | Sim |  |
| telefone_contato |  | Sim |  |
| concreteira |  | Sim |  |
| contato_concreteira |  | Sim |  |
| area_total_metros_quadrados | integer/bigint | Provavelmente não |  |
| tipo_acabamento_id | integer/bigint | Provavelmente não | Provável FK para tipo_acabamentos |
| tipo_cura_id |  | Sim | Provável FK para tipo_curas |
| distancia_ate_obra | integer/bigint | Provavelmente não |  |
| equipes_concretagem_id | integer/bigint | Provavelmente não | Provável FK para equipes_concretagems |
| equipes_acabamento_id | integer/bigint | Provavelmente não | Provável FK para equipes_acabamentos |
| equipes_preparacao_id | integer/bigint | Provavelmente não | Provável FK para equipes_preparacaos |
| equipes_finalizacao_id | integer/bigint | Provavelmente não | Provável FK para equipes_finalizacaos |
| prazo_preparacao_obra | integer/bigint | Provavelmente não |  |
| prazo_finalizacao_obra | integer/bigint | Provavelmente não |  |
| valor_frete | integer/bigint | Sim |  |
| valor_hospedagem |  | Sim |  |
| custo_veiculos | integer/bigint | Provavelmente não |  |
| valor_material | integer/bigint | Sim |  |
| valor_passagem |  | Sim |  |
| valor_extra |  | Sim |  |
| percentual_comissao | integer/bigint | Provavelmente não |  |
| preco_venda_metro_quadrado | integer/bigint | Provavelmente não |  |
| percentual_lucro_desejado | integer/bigint | Provavelmente não |  |
| valor_total | numeric/float/double | Provavelmente não |  |
| lucro_total | numeric/float/double | Provavelmente não |  |
| horas_inicio_concretagem | varchar/text | Provavelmente não |  |
| horas_inicio_acabamento | varchar/text | Provavelmente não |  |
| equipamentos_selecionados | array/json/jsonb | Provavelmente não |  |
| area_por_dia | integer/bigint | Provavelmente não |  |
| custo_equipamentos | numeric/float/double | Provavelmente não |  |
| custo_mao_obra | integer/bigint | Provavelmente não |  |
| custo_materiais | integer/bigint | Provavelmente não |  |
| custos_diversos |  | Sim |  |
| distancia_obra | integer/bigint | Provavelmente não |  |
| espessura_piso | integer/bigint | Provavelmente não |  |
| lancamento_concreto | varchar/text | Provavelmente não |  |
| nome_contato | varchar/text | Provavelmente não |  |
| prazo_obra | integer/bigint | Provavelmente não |  |
| tipo_reforco_estrutural_id | integer/bigint | Provavelmente não | Provável FK para tipo_reforco_estruturals |
| area_por_hora | numeric/float/double, integer/bigint | Provavelmente não |  |
| final_concretagem | varchar/text | Provavelmente não |  |
| final_acabamento | varchar/text | Provavelmente não |  |
| hora_concretagem | integer/bigint | Provavelmente não |  |
| hora_acabamento | integer/bigint | Provavelmente não |  |
| sobreposicao_ca | integer/bigint | Provavelmente não |  |
| endereco | varchar/text | Provavelmente não |  |
| valor_locacao_veiculos |  | Sim |  |
| custo_horas_extra_concretagem | integer/bigint | Provavelmente não |  |
| custo_horas_extra_acabamento | numeric/float/double | Provavelmente não |  |
| custo_total_horas_extras | numeric/float/double | Provavelmente não |  |
| horas_extra_acabamento | integer/bigint | Provavelmente não |  |
| horas_extra_concretagem | integer/bigint | Provavelmente não |  |
| custo_finalizacao | numeric/float/double | Provavelmente não |  |
| custo_preparacao | numeric/float/double | Provavelmente não |  |
| valor_locacao_equipamento | integer/bigint | Provavelmente não |  |
| preco_venda_metro_quadrado_calculo | numeric/float/double | Provavelmente não |  |
| custo_total_obra | numeric/float/double | Provavelmente não |  |
| custo_insumos | integer/bigint | Provavelmente não |  |
| prazo_concretagem |  | Sim |  |
| prazo_acabamento |  | Sim |  |
| veiculos_selecionados | array/json/jsonb | Provavelmente não |  |
| lucro_manual | numeric/float/double | Provavelmente não |  |
| percentual_lucro_manual | numeric/float/double | Provavelmente não |  |
| valor_total_manual | integer/bigint | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 220,
  "usuarios_id": 3,
  "simulacao": true,
  "tipo_obra_id": null,
  "tipo_fundacao_id": null,
  "nome": "Fiat",
  "construtora": "",
  "data_inicio": "2025-09-22",
  "data_previsao_termino": null,
  "data_concretagem": null,
  "status": "SIMULACAO",
  "cliente": null,
  "responsavel": null,
  "telefone_responsavel": "",
  "email_responsavel": null,
  "telefone_contato": null,
  "concreteira": null,
  "contato_concreteira": null,
  "area_total_metros_quadrados": 15000,
  "tipo_acabamento_id": 3,
  "tipo_cura_id": null,
  "distancia_ate_obra": 100,
  "equipes_concretagem_id": 8,
  "equipes_acabamento_id": 4,
  "equipes_preparacao_id": 2,
  "equipes_finalizacao_id": 3,
  "prazo_preparacao_obra": 3,
  "prazo_finalizacao_obra": 1,
  "valor_frete": null,
  "valor_hospedagem": null,
  "custo_veiculos": 18240,
  "valor_material": null,
  "valor_passagem": null,
  "valor_extra": null,
  "percentual_comissao": 0,
  "preco_venda_metro_quadrado": 22,
  "percentual_lucro_desejado": 30,
  "valor_total": 542000.2305475504,
  "lucro_total": 162600.0691642651,
  "horas_inicio_concretagem": "08:00",
  "horas_inicio_acabamento": "13:00",
  "equipamentos_selecionados": [
    {
      "id": 46,
      "nome": "Dupla 36",
      "quantidade": 5,
      "selecionado": true
    },
    {
      "id": 50,
      "nome": "Reg. Alum.",
      "quantidade": 3,
      "selecionado": true
    },
    {
      "id": 52,
      "nome": "Vib. Eletrico",
      "quantidade": 6,
      "selecionado": true
    }
  ],
  "area_por_dia": 1000,
  "custo_equipamentos": 5676.06,
  "custo_mao_obra": 0,
  "custo_materiais": 0,
  "custos_diversos": null,
  "distancia_obra": 100,
  "espessura_piso": 13,
  "lancamento_concreto": "24",
  "nome_contato": "",
  "prazo_obra": 15,
  "tipo_reforco_estrutural_id": 4,
  "area_por_hora": 184.615384615385,
  "final_concretagem": "14:00",
  "final_acabamento": "19:00",
  "hora_concretagem": 6,
  "hora_acabamento": 6,
  "sobreposicao_ca": 1,
  "endereco": "",
  "valor_locacao_veiculos": null,
  "custo_horas_extra_concretagem": 0,
  "custo_horas_extra_acabamento": 22162.8,
  "custo_total_horas_extras": 22162.8,
  "horas_extra_acabamento": 2,
  "horas_extra_concretagem": 0,
  "custo_finalizacao": 5493.88,
  "custo_preparacao": 8240.82,
  "valor_locacao_equipamento": 20000,
  "preco_venda_metro_quadrado_calculo": 36.13334870317002,
  "custo_total_obra": 376148.16,
  "custo_insumos": 4800,
  "prazo_concretagem": null,
  "prazo_acabamento": null,
  "veiculos_selecionados": [
    {
      "id": 2,
      "tipo": "CORTE E/OU FINALIZAÇÃO",
      "rs_km": 1.2,
      "veiculo": "Kombi",
      "quantidade": 4,
      "veiculo_id": 2,
      "selecionado": true
    }
  ],
  "lucro_manual": -46148.16,
  "percentual_lucro_manual": -13.98,
  "valor_total_manual": 330000
}
```

---

### tipo_reforco_estrutural

**Colunas:**

| Coluna | Tipo Inferido | Permite NULL | Observações |
|--------|---------------|--------------|-------------|
| id | integer/bigint | Provavelmente não | Provável PRIMARY KEY |
| nome | varchar/text | Provavelmente não |  |

**Exemplo de Dados:**

```json
{
  "id": 1,
  "nome": "Tela simples"
}
```

---

## Relacionamentos Detectados

Baseado na análise dos nomes das colunas, os seguintes relacionamentos foram identificados:

**usuarios:**
  - cargos_id → cargos.id

**custofixo_usuario:**
  - userid → usuarios.id

**veiculos:**
  - user_id → users.id (inferido)

**obras:**
  - usuarios_id → usuarios.id
  - tipo_obra_id → tipo_obras.id (inferido)
  - tipo_fundacao_id → tipo_fundacaos.id (inferido)
  - tipo_acabamento_id → tipo_acabamentos.id (inferido)
  - tipo_cura_id → tipo_curas.id (inferido)
  - equipes_concretagem_id → equipes_concretagems.id (inferido)
  - equipes_acabamento_id → equipes_acabamentos.id (inferido)
  - equipes_preparacao_id → equipes_preparacaos.id (inferido)
  - equipes_finalizacao_id → equipes_finalizacaos.id (inferido)
  - tipo_reforco_estrutural_id → tipo_reforco_estruturals.id (inferido)

---

## Resumo

- **Total de Tabelas:** 13
- **Tabelas com Dados:** 10
- **Tabelas Vazias:** 3
- **Tabelas Não Encontradas:** 0

---

## Notas Importantes

1. **Limitações da API REST:** A API REST do Supabase não permite acesso direto ao information_schema, portanto:
   - Os tipos de dados são inferidos com base nos valores dos dados
   - Foreign keys são detectadas por convenção de nomenclatura
   - Constraints, índices e triggers não podem ser listados via API REST
   - Tabelas vazias não podem ter sua estrutura inferida

2. **Acesso Completo ao Schema:** Para informações completas sobre constraints, índices, triggers e a estrutura exata das tabelas vazias, seria necessário:
   - Acesso direto ao PostgreSQL via ferramenta como `psql` ou DBeaver
   - Ou acesso ao painel do Supabase (Table Editor)

3. **Convenções de Nomenclatura:**
   - Colunas terminando em `_id` são tratadas como foreign keys
   - A coluna `id` é assumida como primary key
   - A coluna `userid` é assumida como foreign key para `usuarios`

---

## Diagrama de Relacionamentos (ER Diagram em Texto)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TABELAS CENTRAIS                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│    usuarios      │
│ ───────────────  │
│ • id (PK)        │
│   nome           │
│   cpf            │
│   email          │
│   senha          │
│   cargos_id (FK) │◄─── (referencia tabela "cargos" não encontrada)
│   status         │
│   salario        │
│   beneficios     │
│   encargos       │
│   faturamento_   │
│     anual        │
└────────┬─────────┘
         │
         │ 1:N
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌─────────────────┐
│ custofixo_usuario│      │     obras       │
│ ──────────────── │      │ ─────────────── │
│ • id (PK)        │      │ • id (PK)       │
│   userid (FK) ───┼──┐   │   usuarios_id   │
│   total          │  │   │     (FK) ───────┼────────┐
│   created_at     │  │   │   simulacao     │        │
│   aluguel        │  │   │   nome          │        │
│   ... (45+ cols) │  │   │   construtora   │        │
│   media_final    │  │   │   status        │        │
└──────────────────┘  │   │   area_total_   │        │
                      │   │     metros_     │        │
                      │   │     quadrados   │        │
                      │   │                 │        │
                      │   │   equipamentos_ │        │
                      │   │     selecionados│        │
                      │   │     (JSONB)     │        │
                      │   │                 │        │
                      │   │   veiculos_     │        │
                      │   │     selecionados│        │
                      │   │     (JSONB)     │        │
                      │   │                 │        │
                      │   │   ... (70+ cols)│        │
                      │   └────────┬────────┘        │
                      │            │                 │
                      │            │                 │
                      └────────────┼─────────────────┘
                                   │
                                   │ N:1
                  ┌────────────────┼────────────────┬───────────────────┐
                  │                │                │                   │
                  ▼                ▼                ▼                   ▼
         ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │equipes_         │ │equipes_      │ │equipes_      │ │equipes_      │
         │  concretagem    │ │  acabamento  │ │  preparacao  │ │  finalizacao │
         │ ─────────────── │ │───────────── │ │───────────── │ │───────────── │
         │ • id (PK)       │ │• id (PK)     │ │• id (PK)     │ │• id (PK)     │
         │   nome          │ │  nome        │ │  nome        │ │  nome        │
         │   qtd_pessoas   │ │  qtd_pessoas │ │  qtd_pessoas │ │  qtd_pessoas │
         └─────────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      TABELAS DE REFERÊNCIA                          │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────┐          ┌───────────────────────┐
│ tipo_acabamento   │          │tipo_reforco_          │
│ ─────────────────│          │  estrutural           │
│ • id (PK)         │          │───────────────────────│
│   nome            │          │• id (PK)              │
│   area500         │          │  nome                 │
│   area1000        │          └───────────────────────┘
│   area1500        │                    ▲
│   area2000mais    │                    │
└─────────┬─────────┘                    │
          │                              │
          │                              │
          │ N:1                          │ N:1
          │                              │
          └──────────────┐   ┌───────────┘
                         │   │
                         ▼   ▼
                   ┌─────────────────┐
                   │     obras       │◄───── (tabela principal já mostrada acima)
                   │                 │
                   │ tipo_acabamento │
                   │   _id (FK)      │
                   │                 │
                   │ tipo_reforco_   │
                   │   estrutural_id │
                   │   (FK)          │
                   └─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      TABELAS DE APOIO                               │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐          ┌──────────────────┐
│   veiculos       │          │  equipamentos    │
│ ──────────────── │          │ ──────────────── │
│ • id (PK)        │          │ • id (PK)        │
│   veiculo        │          │   nome           │
│   created_at     │          │   ... (colunas)  │
│   rs_km          │          │                  │
│   user_id (FK)   │◄─┐       └──────────────────┘
└──────────────────┘  │               ▲
                      │               │
                      │               │ (Referenciados via JSONB
                      │               │  em obras.equipamentos_
                      │               │  selecionados)
                      │               │
                      └───────────────┼────────────────┐
                                      │                │
                                      ▼                ▼
                              ┌────────────────────────────┐
                              │        obras               │
                              │  equipamentos_selecionados │
                              │  veiculos_selecionados     │
                              │  (campos JSONB)            │
                              └────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      TABELAS VAZIAS                                 │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐
│ simples_brackets      │
│ ───────────────────── │
│ (estrutura           │
│  desconhecida)       │
└───────────────────────┘

┌────────────────────────┐
│ obras_veiculos_        │
│   simulacao            │
│ ────────────────────── │
│ (estrutura             │
│  desconhecida)         │
└────────────────────────┘

┌────────────────────────┐
│ equipamentos (vazia)   │
│ ────────────────────── │
│ (estrutura             │
│  desconhecida)         │
└────────────────────────┘
```

### Legenda do Diagrama

- **PK** = Primary Key (Chave Primária)
- **FK** = Foreign Key (Chave Estrangeira)
- **1:N** = Relação um-para-muitos
- **N:1** = Relação muitos-para-um
- **◄───** = Seta indicando direção do relacionamento
- **JSONB** = Campo JSON/JSONB contendo dados estruturados

### Observações sobre Relacionamentos

1. **usuarios → obras**: Um usuário pode ter várias obras/simulações
2. **usuarios → custofixo_usuario**: Um usuário pode ter vários registros de custo fixo (histórico)
3. **obras → equipes_***: Cada obra referencia uma equipe de cada tipo (concretagem, acabamento, preparação, finalização)
4. **obras → tipo_acabamento**: Cada obra tem um tipo de acabamento
5. **obras → tipo_reforco_estrutural**: Cada obra tem um tipo de reforço estrutural
6. **obras → equipamentos/veiculos**: Relacionamento através de campos JSONB (não normalizado)

### Tabelas Referenciadas mas Não Encontradas

As seguintes tabelas são referenciadas no código mas não existem no banco de dados:

- **cargos** (referenciada por usuarios.cargos_id)
- **tipo_obras** (referenciada por obras.tipo_obra_id)
- **tipo_fundacaos** (referenciada por obras.tipo_fundacao_id)
- **tipo_curas** (referenciada por obras.tipo_cura_id)

---

## Análise Adicional

### Campos JSONB em "obras"

A tabela **obras** usa campos JSONB para armazenar arrays de objetos:

**equipamentos_selecionados:**
```json
[
  {
    "id": 46,
    "nome": "Dupla 36",
    "quantidade": 5,
    "selecionado": true
  }
]
```

**veiculos_selecionados:**
```json
[
  {
    "id": 2,
    "tipo": "CORTE E/OU FINALIZAÇÃO",
    "rs_km": 1.2,
    "veiculo": "Kombi",
    "quantidade": 4,
    "veiculo_id": 2,
    "selecionado": true
  }
]
```

Esta abordagem permite flexibilidade mas dificulta queries relacionais e integridade referencial.

### Tabela "custofixo_usuario"

Esta tabela contém **47 colunas** relacionadas a custos fixos mensais de uma empresa:

- Custos prediais (aluguel, IPTU, seguros)
- Custos administrativos (equipe, pró-labore, assessorias)
- Custos operacionais (veículos, telefonia, informática)
- Custos regulatórios (CIPA, PPRA, PCMAT, taxas)

O campo `faturamento_12` armazena uma string que representa a faixa de faturamento anual, usada para cálculo do Simples Nacional.

### Tabela "obras"

A tabela principal do sistema com **72 colunas** que armazena:

- Dados básicos da obra (nome, endereço, área)
- Dados do cliente e responsáveis
- Dados de equipes e equipamentos
- Cálculos de custos (mão de obra, materiais, equipamentos, veículos)
- Cálculos de tempo (prazos, horas de trabalho, horas extras)
- Cálculos financeiros (valores totais, lucros, percentuais)
- Status e controle (simulação vs obra real)

Esta tabela serve tanto para **simulações** quanto para **obras reais**, diferenciadas pela coluna `simulacao` (boolean).

---

## Recomendações

Com base na análise do schema, aqui estão algumas recomendações:

### 1. Normalização

**Problema:** A tabela `obras` usa campos JSONB para armazenar equipamentos e veículos selecionados.

**Recomendação:** Criar tabelas de junção:
- `obras_equipamentos` (obra_id, equipamento_id, quantidade)
- `obras_veiculos` (obra_id, veiculo_id, quantidade, tipo)

**Benefícios:**
- Integridade referencial
- Queries mais eficientes
- Histórico de alterações
- Constraints de banco de dados

### 2. Tabelas Faltantes

**Problema:** Existem foreign keys apontando para tabelas inexistentes.

**Recomendação:** Criar as tabelas:
- `cargos` (id, nome, descricao)
- `tipo_obras` (id, nome)
- `tipo_fundacaos` (id, nome)
- `tipo_curas` (id, nome)

### 3. Campos de Auditoria

**Problema:** Poucas tabelas têm campos de auditoria (created_at, updated_at).

**Recomendação:** Adicionar em todas as tabelas:
- `created_at TIMESTAMPTZ DEFAULT NOW()`
- `updated_at TIMESTAMPTZ DEFAULT NOW()`
- Trigger para atualizar `updated_at` automaticamente

### 4. Índices

**Problema:** Não podemos ver os índices via API REST, mas é importante tê-los.

**Recomendação:** Garantir índices em:
- Todas as foreign keys
- Campos usados em WHERE (ex: `obras.simulacao`, `obras.status`, `obras.usuarios_id`)
- Campos usados em ORDER BY

### 5. Constraints

**Recomendação:** Adicionar constraints para garantir integridade:
- CHECK constraints para valores válidos (ex: percentuais entre 0-100)
- NOT NULL em campos obrigatórios
- UNIQUE em campos que devem ser únicos (ex: `usuarios.email`, `usuarios.cpf`)

### 6. Separação Simulação/Obra

**Problema:** A tabela `obras` mistura simulações e obras reais.

**Recomendação:** Considerar separar em:
- `simulacoes` - para cálculos e propostas
- `obras` - para obras em andamento/concluídas
- Ou manter unificado mas adicionar mais campos de controle de estado

### 7. Segurança

**Observações:**
- Senhas estão hasheadas (SHA-256)
- Row Level Security (RLS) do Supabase deve estar configurado
- Verificar políticas de acesso para cada tabela

---

