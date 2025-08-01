export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      custofixo_usuario: {
        Row: {
          id: number
          userid: string
          total: number
          created_at: string
          aluguel: number
          irpj_sobre_aluguel: number
          iptu: number
          seguranca_monitorada: number
          seguro_predial: number
          conta_agua: number
          conta_luz: number
          material_higiene_limpeza: number
          manutencao_predial: number
          seguro_vida_colaboradores: number
          servico_limpeza: number
          assistencia_medica: number
          equipe_administrativa: number
          alimentacao_equipe: number
          pro_labore_socios: number
          beneficios_cesta_basica: number
          cipa: number
          ppra: number
          pcmat: number
          assessoria_juridica: number
          telefonia_fixa: number
          telefonia_celular: number
          telefonia_radio: number
          combustivel_veiculos: number
          seguro_veiculos: number
          ipva: number
          dpvat: number
          licenciamento_veicular: number
          manutencao_veiculos: number
          assessoria_contabil: number
          softwares_licenciamento: number
          sem_parar_pedagios: number
          assessoria_em_informatica: number
          banda_larga: number
          servicos_cartorio: number
          servico_mensageiro: number
          material_escritorio: number
          alvara_funcionamento: number
        }
        Insert: {
          id?: number
          userid: string
          total: number
          created_at?: string
          aluguel: number
          irpj_sobre_aluguel: number
          iptu: number
          seguranca_monitorada: number
          seguro_predial: number
          conta_agua: number
          conta_luz: number
          material_higiene_limpeza: number
          manutencao_predial: number
          seguro_vida_colaboradores: number
          servico_limpeza: number
          assistencia_medica: number
          equipe_administrativa: number
          alimentacao_equipe: number
          pro_labore_socios: number
          beneficios_cesta_basica: number
          cipa: number
          ppra: number
          pcmat: number
          assessoria_juridica: number
          telefonia_fixa: number
          telefonia_celular: number
          telefonia_radio: number
          combustivel_veiculos: number
          seguro_veiculos: number
          ipva: number
          dpvat: number
          licenciamento_veicular: number
          manutencao_veiculos: number
          assessoria_contabil: number
          softwares_licenciamento: number
          sem_parar_pedagios: number
          assessoria_em_informatica: number
          banda_larga: number
          servicos_cartorio: number
          servico_mensageiro: number
          material_escritorio: number
          alvara_funcionamento: number
        }
        Update: {
          id?: number
          userid?: string
          total?: number
          created_at?: string
          aluguel?: number
          irpj_sobre_aluguel?: number
          iptu?: number
          seguranca_monitorada?: number
          seguro_predial?: number
          conta_agua?: number
          conta_luz?: number
          material_higiene_limpeza?: number
          manutencao_predial?: number
          seguro_vida_colaboradores?: number
          servico_limpeza?: number
          assistencia_medica?: number
          equipe_administrativa?: number
          alimentacao_equipe?: number
          pro_labore_socios?: number
          beneficios_cesta_basica?: number
          cipa?: number
          ppra?: number
          pcmat?: number
          assessoria_juridica?: number
          telefonia_fixa?: number
          telefonia_celular?: number
          telefonia_radio?: number
          combustivel_veiculos?: number
          seguro_veiculos?: number
          ipva?: number
          dpvat?: number
          licenciamento_veicular?: number
          manutencao_veiculos?: number
          assessoria_contabil?: number
          softwares_licenciamento?: number
          sem_parar_pedagios?: number
          assessoria_em_informatica?: number
          banda_larga?: number
          servicos_cartorio?: number
          servico_mensageiro?: number
          material_escritorio?: number
          alvara_funcionamento?: number
        }
      }
      // ... other tables ...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 