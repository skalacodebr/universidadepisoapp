-- Primeiro, limpar tipos de acabamento existentes
DELETE FROM public.tipo_acabamento;
 
-- Inserir tipos de acabamento
INSERT INTO public.tipo_acabamento (id, nome) VALUES
  (1, 'Liso Vítreo'),
  (2, 'Camurçado'),
  (3, 'Vassourado'); 