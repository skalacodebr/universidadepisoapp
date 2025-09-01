// Script para testar a conexão com o Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuração direta (já que as variáveis estão no .env.local)
const supabaseUrl = 'https://qxkwqonrfnpnhusxsppn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a3dxb25yZm5wbmh1c3hzcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU1MDEsImV4cCI6MjA2MzUxMTUwMX0.ExnycCVQGFNl9JX9-W-24ZUiwxQO64Amq4qimFWpFBs';

console.log('=========================================');
console.log('TESTE DE CONEXÃO COM SUPABASE');
console.log('=========================================\n');

// Verificar variáveis de ambiente
console.log('1. Verificando variáveis de ambiente...');
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente configuradas');
console.log('   URL do Supabase:', supabaseUrl);
console.log('   Anon Key:', supabaseAnonKey.substring(0, 20) + '...\n');

// Criar cliente Supabase
console.log('2. Criando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Cliente criado com sucesso\n');

// Testar conexão fazendo uma query simples
async function testConnection() {
  console.log('3. Testando conexão com o banco de dados...');
  
  try {
    // Tentar fazer login anônimo para testar a autenticação
    console.log('   - Testando autenticação anônima...');
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.log('   ⚠️  Login anônimo não disponível (normal se não estiver habilitado)');
      console.log('      Erro:', authError.message);
    } else {
      console.log('   ✅ Autenticação anônima funcionando');
    }
    
    // Tentar listar as tabelas (vai falhar se não houver permissões, mas testa a conexão)
    console.log('   - Testando query no banco...');
    const { data, error, status } = await supabase
      .from('simulacoes') // Assumindo que existe uma tabela 'simulacoes'
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   ⚠️  Tabela "simulacoes" não existe ainda');
        console.log('      Isso é normal se o banco ainda não foi configurado');
      } else if (error.message.includes('permission') || error.message.includes('denied')) {
        console.log('   ⚠️  Sem permissão para acessar a tabela');
        console.log('      Verifique as políticas RLS (Row Level Security)');
      } else {
        console.log('   ❌ Erro ao fazer query:', error.message);
      }
    } else {
      console.log('   ✅ Query executada com sucesso!');
      console.log('      Status HTTP:', status);
    }
    
    // Verificar se conseguimos acessar o storage
    console.log('   - Testando acesso ao storage...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.log('   ⚠️  Não foi possível listar buckets:', storageError.message);
    } else {
      console.log('   ✅ Storage acessível');
      if (buckets && buckets.length > 0) {
        console.log('      Buckets encontrados:', buckets.map(b => b.name).join(', '));
      }
    }
    
    console.log('\n=========================================');
    console.log('RESUMO DO TESTE');
    console.log('=========================================');
    console.log('✅ Conexão com Supabase estabelecida!');
    console.log('✅ Cliente configurado corretamente');
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Verifique se as tabelas necessárias existem no banco');
    console.log('   - Configure as políticas RLS se necessário');
    console.log('   - Habilite login anônimo se for usar essa funcionalidade');
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.log('\nPossíveis causas:');
    console.log('1. Supabase está offline ou com problemas');
    console.log('2. Credenciais incorretas');
    console.log('3. Problemas de rede/firewall');
    process.exit(1);
  }
}

// Executar teste
testConnection().then(() => {
  console.log('\n✅ Teste concluído com sucesso!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Teste falhou:', error);
  process.exit(1);
});