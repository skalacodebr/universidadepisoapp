-- Este script encontra usuários na sua tabela 'usuarios' que NÃO têm um
-- usuário correspondente na tabela 'auth.users' do Supabase.
-- Estes são os usuários que precisam ser criados no sistema de autenticação.

SELECT
  u.email,
  u.nome,
  u.id as seu_id_atual
FROM
  public.usuarios u
LEFT JOIN
  auth.users s ON u.email = s.email
WHERE
  s.id IS NULL; 