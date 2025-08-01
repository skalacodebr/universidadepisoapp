-- Primeiro, limpar equipamentos padrão existentes
DELETE FROM public.equipamentos WHERE user_id = '0';

-- Inserir equipamentos padrão
INSERT INTO public.equipamentos (nome, valor_dia, user_id) VALUES
  ('Régua Vibratória', 50.00, '0'),
  ('Acabadora de Superfície', 45.00, '0'),
  ('Alisador de Piso', 35.00, '0'),
  ('Cortadora de Piso', 40.00, '0'),
  ('Desempenadeira Mecânica', 55.00, '0'),
  ('Bomba de Concreto', 150.00, '0'),
  ('Betoneira', 30.00, '0'),
  ('Serra Circular', 25.00, '0'); 