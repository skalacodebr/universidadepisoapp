const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const SUPABASE_URL = 'https://qxkwqonrfnpnhusxsppn.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function executarSQL() {
  try {
    console.log('🚀 Lendo arquivo SQL...')
    const sqlPath = path.join(__dirname, 'criar-tabela-cargos.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Executando SQL no Supabase...')

    // Executar cada comando SQL separadamente
    const comandos = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    for (const comando of comandos) {
      if (comando.toLowerCase().includes('comment on')) {
        // Comentários não são suportados via RPC, pular
        console.log('⏭️  Pulando comando de comentário')
        continue
      }

      console.log(`\n▶️  Executando: ${comando.substring(0, 50)}...`)

      const { data, error } = await supabase.rpc('exec_sql', { sql_query: comando })

      if (error) {
        // Tentar via inserção direta se for INSERT
        if (comando.toLowerCase().includes('insert into cargos')) {
          console.log('  Tentando inserção direta...')
          const cargos = [
            { id: 1, nome: 'Engenheiro Civil', descricao: 'Responsável por projetos e execução de obras' },
            { id: 2, nome: 'Gerente de Projetos', descricao: 'Gerencia múltiplos projetos e equipes' },
            { id: 3, nome: 'Técnico de Obras', descricao: 'Realiza inspeções e acompanhamento técnico' },
            { id: 4, nome: 'Analista Financeiro', descricao: 'Gerencia orçamentos e finanças' },
            { id: 5, nome: 'Supervisor de Obras', descricao: 'Supervisiona a execução das obras' },
            { id: 6, nome: 'Assistente Administrativo', descricao: 'Suporte administrativo geral' },
          ]

          for (const cargo of cargos) {
            const { error: insertError } = await supabase
              .from('cargos')
              .upsert(cargo, { onConflict: 'id' })

            if (insertError) {
              console.log(`  ⚠️  Erro ao inserir cargo ${cargo.nome}: ${insertError.message}`)
            } else {
              console.log(`  ✅ Cargo ${cargo.nome} inserido/atualizado`)
            }
          }
        } else {
          console.log(`  ⚠️  Aviso: ${error.message}`)
        }
      } else {
        console.log('  ✅ Comando executado com sucesso')
      }
    }

    console.log('\n✅ Script executado com sucesso!')
    console.log('\n📊 Verificando cargos inseridos...')

    const { data: cargos, error: selectError } = await supabase
      .from('cargos')
      .select('*')
      .order('id')

    if (selectError) {
      console.error('❌ Erro ao buscar cargos:', selectError.message)
    } else {
      console.log(`\n✅ ${cargos.length} cargos encontrados:`)
      cargos.forEach(cargo => {
        console.log(`  - [${cargo.id}] ${cargo.nome}`)
      })
    }

  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

executarSQL()
