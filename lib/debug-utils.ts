/**
 * Debug utilities for troubleshooting client-side cache issues
 * Designed to help identify and resolve persistent cache problems
 */

export interface DebugInfo {
  version: string
  timestamp: string
  userAgent: string
  url: string
  localStorage: Record<string, string>
  sessionStorage: Record<string, string>
  cookies: string
}

export class DebugManager {
  private static readonly DEBUG_KEY = 'debug_session'
  private static readonly VERSION_KEY = 'app_version'
  private static readonly BUILD_TIMESTAMP_KEY = 'build_timestamp'
  private static readonly LAST_ACCESS_KEY = 'last_access'
  
  /**
   * Força limpeza completa de cache e dados persistentes
   */
  static forceClearCache(): boolean {
    try {
      console.log('[DEBUG] Iniciando limpeza forçada de cache...')
      
      // Limpa localStorage
      const localStorageKeys = Object.keys(localStorage)
      console.log(`[DEBUG] Limpando ${localStorageKeys.length} itens do localStorage:`, localStorageKeys)
      localStorage.clear()
      
      // Limpa sessionStorage
      const sessionStorageKeys = Object.keys(sessionStorage)
      console.log(`[DEBUG] Limpando ${sessionStorageKeys.length} itens do sessionStorage:`, sessionStorageKeys)
      sessionStorage.clear()
      
      // Força reload sem cache
      console.log('[DEBUG] Cache limpo com sucesso. Recarregando página...')
      
      // Define uma flag para indicar que foi feita limpeza
      localStorage.setItem('cache_cleared_at', new Date().toISOString())
      
      return true
    } catch (error) {
      console.error('[DEBUG] Erro ao limpar cache:', error)
      return false
    }
  }

  /**
   * Verifica se a versão da aplicação mudou e limpa cache se necessário
   * Também detecta rollbacks da Vercel
   */
  static checkVersionAndClearIfNeeded(): boolean {
    try {
      const currentVersion = process.env.npm_package_version || '0.1.0'
      const currentBuildTimestamp = Date.now()
      const buildId = currentBuildTimestamp.toString().slice(-6)
      const versionKey = `${currentVersion}-${buildId}`
      
      const storedVersion = localStorage.getItem(this.VERSION_KEY)
      const storedBuildTimestamp = localStorage.getItem(this.BUILD_TIMESTAMP_KEY)
      const lastAccess = localStorage.getItem(this.LAST_ACCESS_KEY)
      
      // Atualiza último acesso
      localStorage.setItem(this.LAST_ACCESS_KEY, new Date().toISOString())
      
      // Se não tiver versão armazenada, é primeira vez
      if (!storedVersion) {
        console.log('[DEBUG] Primeira vez acessando. Definindo versão atual.')
        localStorage.setItem(this.VERSION_KEY, versionKey)
        localStorage.setItem(this.BUILD_TIMESTAMP_KEY, currentBuildTimestamp.toString())
        return false
      }
      
      // Se a versão mudou
      if (storedVersion !== versionKey) {
        console.log(`[DEBUG] Versão mudou de "${storedVersion}" para "${versionKey}".`)
        
        // Verifica se é um rollback (versão mais antiga)
        if (storedBuildTimestamp) {
          const storedTimestamp = parseInt(storedBuildTimestamp)
          
          if (currentBuildTimestamp < storedTimestamp) {
            console.warn(`[DEBUG] ⚠️ ROLLBACK DETECTADO! Build atual (${buildId}) é mais antigo que o armazenado. Forçando limpeza completa...`)
            
            // Mostra alert para o usuário
            this.showRollbackAlert(buildId, storedBuildTimestamp)
            
            this.forceClearCache()
            localStorage.setItem(this.VERSION_KEY, versionKey)
            localStorage.setItem(this.BUILD_TIMESTAMP_KEY, currentBuildTimestamp.toString())
            
            // Força reload após 3 segundos para dar tempo do usuário ler o alert
            setTimeout(() => {
              console.log('[DEBUG] Forçando reload devido a rollback...')
              window.location.reload()
            }, 3000)
            
            return true
          }
        }
        
        console.log('[DEBUG] Nova versão detectada. Limpando cache...')
        this.forceClearCache()
        localStorage.setItem(this.VERSION_KEY, versionKey)
        localStorage.setItem(this.BUILD_TIMESTAMP_KEY, currentBuildTimestamp.toString())
        
        return true
      }
      
      // Verifica se passou muito tempo sem acessar (possível cache stale)
      if (lastAccess) {
        const lastAccessTime = new Date(lastAccess).getTime()
        const timeDiff = Date.now() - lastAccessTime
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff > 24) {
          console.log(`[DEBUG] Última visita há ${Math.round(hoursDiff)}h. Limpando cache preventivo...`)
          this.forceClearCache()
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('[DEBUG] Erro ao verificar versão:', error)
      // Em caso de erro, limpa cache por segurança
      this.forceClearCache()
      return true
    }
  }

  /**
   * Coleta informações de debug completas
   */
  static collectDebugInfo(): DebugInfo {
    const debugInfo: DebugInfo = {
      version: process.env.npm_package_version || '0.1.0',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      localStorage: {},
      sessionStorage: {},
      cookies: typeof document !== 'undefined' ? document.cookie : 'N/A'
    }

    // Coleta dados do localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          debugInfo.localStorage[key] = localStorage.getItem(key) || ''
        }
      }
    } catch (e) {
      debugInfo.localStorage = { error: 'Could not access localStorage' }
    }

    // Coleta dados do sessionStorage
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) {
          debugInfo.sessionStorage[key] = sessionStorage.getItem(key) || ''
        }
      }
    } catch (e) {
      debugInfo.sessionStorage = { error: 'Could not access sessionStorage' }
    }

    return debugInfo
  }

  /**
   * Exibe informações de debug no console de forma organizada
   */
  static logDebugInfo(): void {
    const info = this.collectDebugInfo()
    
    console.group('🔍 DEBUG INFO - Universidade Piso App')
    console.log('📅 Timestamp:', info.timestamp)
    console.log('🔢 Version:', info.version)
    console.log('🌐 URL:', info.url)
    console.log('💻 User Agent:', info.userAgent)
    
    console.group('💾 LocalStorage')
    Object.keys(info.localStorage).forEach(key => {
      console.log(`${key}:`, info.localStorage[key])
    })
    console.groupEnd()
    
    console.group('🗂️ SessionStorage')
    Object.keys(info.sessionStorage).forEach(key => {
      console.log(`${key}:`, info.sessionStorage[key])
    })
    console.groupEnd()
    
    console.log('🍪 Cookies:', info.cookies)
    console.groupEnd()
  }

  /**
   * Inicia uma sessão de debug
   */
  static startDebugSession(): void {
    const sessionInfo = {
      started: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      cleared: this.checkVersionAndClearIfNeeded()
    }
    
    localStorage.setItem(this.DEBUG_KEY, JSON.stringify(sessionInfo))
    
    console.log('🚀 [DEBUG] Sessão de debug iniciada:', sessionInfo)
    
    // Log das informações de debug
    this.logDebugInfo()
    
    // Adiciona listener para mudanças no localStorage
    window.addEventListener('storage', (e) => {
      console.log('📝 [DEBUG] Storage changed:', {
        key: e.key,
        oldValue: e.oldValue,
        newValue: e.newValue,
        storageArea: e.storageArea === localStorage ? 'localStorage' : 'sessionStorage'
      })
    })
  }

  /**
   * Mostra alert visual para rollbacks detectados
   */
  static showRollbackAlert(currentBuild: string, storedTimestamp: string): void {
    const storedBuild = storedTimestamp.slice(-6)
    const message = `⚠️ ROLLBACK DETECTADO!\n\nVersão anterior detectada:\nBuild atual: ${currentBuild}\nBuild anterior: ${storedBuild}\n\nLimpando cache automaticamente...\nA página será recarregada em 3 segundos.`
    
    alert(message)
  }

  /**
   * Para depuração manual via console do navegador
   */
  static exposeGlobalHelpers(): void {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.debugClearCache = () => this.forceClearCache()
      // @ts-ignore
      window.debugInfo = () => this.logDebugInfo()
      // @ts-ignore
      window.debugCollect = () => this.collectDebugInfo()
      
      console.log(`
🔧 DEBUG HELPERS AVAILABLE:
- debugClearCache() - Limpa todo o cache
- debugInfo() - Mostra informações de debug
- debugCollect() - Coleta dados de debug
      `)
    }
  }
}