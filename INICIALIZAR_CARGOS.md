# Inicializar Tabela de Cargos

## ⚠️ IMPORTANTE - Executar na primeira vez

Antes de usar o sistema de usuários, você precisa criar e popular a tabela `cargos` no Supabase.

## Como Inicializar

### Opção 1: Via API (Recomendado)

1. Certifique-se de que o servidor está rodando:
   ```bash
   npm run dev
   ```

2. Execute a rota de criação via cURL, Postman ou qualquer cliente HTTP:
   ```bash
   curl -X POST http://localhost:3000/api/cargos/criar
   ```

3. Você deve receber uma resposta como:
   ```json
   {
     "success": true,
     "message": "Cargos criados/atualizados com sucesso!",
     "cargos": [
       { "id": 1, "nome": "Engenheiro Civil" },
       { "id": 2, "nome": "Gerente de Projetos" },
       ...
     ]
   }
   ```

### Opção 2: Via SQL Editor do Supabase

1. Acesse: https://supabase.com/dashboard/project/qxkwqonrfnpnhusxsppn/editor
2. Vá em "SQL Editor"
3. Execute o SQL do arquivo `scripts/criar-tabela-cargos.sql`

## Cargos Padrão

Os seguintes cargos serão criados:

1. **Engenheiro Civil** - Responsável por projetos e execução de obras
2. **Gerente de Projetos** - Gerencia múltiplos projetos e equipes
3. **Técnico de Obras** - Realiza inspeções e acompanhamento técnico
4. **Analista Financeiro** - Gerencia orçamentos e finanças
5. **Supervisor de Obras** - Supervisiona a execução das obras
6. **Assistente Administrativo** - Suporte administrativo geral

## Verificar se os Cargos Foram Criados

Execute:
```bash
curl http://localhost:3000/api/cargos
```

Resposta esperada:
```json
{
  "success": true,
  "data": [
    { "id": 1, "nome": "Engenheiro Civil", ... },
    ...
  ]
}
```

## Após a Inicialização

Depois de criar a tabela de cargos, o formulário de cadastro de usuários irá:
- ✅ Carregar os cargos dinamicamente do banco
- ✅ Exibir "Carregando cargos..." enquanto busca
- ✅ Permitir seleção apenas dos cargos existentes
- ✅ Associar corretamente o `cargos_id` ao criar/editar usuários

## Adicionar Novos Cargos

Para adicionar novos cargos no futuro, insira diretamente na tabela `cargos`:

```sql
INSERT INTO cargos (nome, descricao)
VALUES ('Novo Cargo', 'Descrição do cargo');
```

Ou crie uma interface de administração de cargos! 🚀
