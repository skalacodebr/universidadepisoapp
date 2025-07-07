-- Script para inserir equipamentos padrão na tabela equipamentos
-- Estes equipamentos terão user_id = '0' e estarão disponíveis para todos os usuários

-- Limpar equipamentos padrão existentes (opcional)
DELETE FROM equipamentos WHERE user_id = '0';

-- Inserir equipamentos padrão
INSERT INTO equipamentos (nome, valor_dia, user_id) VALUES
('Régua Vibratória', 50.00, '0'),
('Acabadora de Superfície', 45.00, '0'),
('Alisador de Piso', 35.00, '0'),
('Cortadora de Piso', 40.00, '0'),
('Desempenadeira Mecânica', 55.00, '0'),
('Bomba de Concreto', 150.00, '0'),
('Betoneira', 30.00, '0'),
('Serra Circular', 25.00, '0'),
('Furadeira de Impacto', 20.00, '0'),
('Compactador de Solo', 60.00, '0'),
('Nivelador a Laser', 45.00, '0'),
('Aspirador Industrial', 35.00, '0');

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_equipamentos_padrao FROM equipamentos WHERE user_id = '0'; 