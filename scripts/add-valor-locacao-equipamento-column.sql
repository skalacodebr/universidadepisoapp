-- Adicionar coluna valor_locacao_equipamento na tabela obras
ALTER TABLE obras ADD COLUMN valor_locacao_equipamento DECIMAL(10,2) DEFAULT 0;

-- Atualizar registros existentes para definir valor padrão
UPDATE obras SET valor_locacao_equipamento = 0 WHERE valor_locacao_equipamento IS NULL;

-- Comentário da coluna
COMMENT ON COLUMN obras.valor_locacao_equipamento IS 'Valor da locação de equipamentos para a obra';