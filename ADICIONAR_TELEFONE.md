# Adicionar Coluna Telefone na Tabela Usuarios

## Método 1: Via Supabase Dashboard (RECOMENDADO)

1. Acesse o Supabase Dashboard: https://app.supabase.com/
2. Selecione seu projeto: **qxkwqonrfnpnhusxsppn**
3. No menu lateral, clique em **SQL Editor**
4. Cole o seguinte SQL:

```sql
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS telefone VARCHAR(15);

COMMENT ON COLUMN usuarios.telefone IS 'Telefone do usuário no formato (XX) XXXXX-XXXX';
```

5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se a execução foi bem-sucedida

## Método 2: Via API Route (Alternativo)

Se preferir, você pode tentar executar via API:

1. Certifique-se de que seu servidor está rodando (`npm run dev`)
2. Execute no navegador ou via curl:

```bash
curl -X POST http://localhost:3000/api/migrations/telefone
```

## Verificação

Após executar a migração, você pode verificar se a coluna foi adicionada:

```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
```

## Estrutura Final Esperada da Tabela usuarios

| Coluna | Tipo | Permite NULL | Observações |
|--------|------|--------------|-------------|
| id | bigint | não | PRIMARY KEY |
| nome | text | não | Nome completo |
| cpf | text | não | CPF formatado |
| email | text | não | Email único |
| senha | text | não | Hash SHA-256 |
| cargos_id | bigint | não | FK para cargos |
| status | boolean | não | Ativo/Inativo |
| salario | numeric | não | Salário |
| beneficios | text | sim | Benefícios |
| encargos | text | sim | Encargos |
| faturamento_anual | numeric | não | Faturamento |
| **telefone** | varchar(15) | **sim** | **Telefone (novo)** |

## Atualizar o banco-geral.md

Após executar a migração, você pode atualizar o arquivo `banco-geral.md` para refletir a nova estrutura.
