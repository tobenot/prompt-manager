/**
 * Prompt Manager
 * 
 * 数据安全声明：本应用所有数据均存储在本地浏览器中，不会上传到任何服务器。
 * 开源声明：本项目代码基于MIT许可证开源，欢迎贡献和使用。
 * 
 * @license MIT
 * @copyright Copyright (c) 2024
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/common/LanguageSwitcher'
import HomePage from './pages/HomePage'
import { initializeStores, useSettingsStore } from './store'
import './App.css'

function App() {
  const { t } = useTranslation('common')
  const { settings, updateSettings } = useSettingsStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)

  // 初始化所有状态
  useEffect(() => {
    const init = async () => {
      await initializeStores()
      setIsLoading(false)
    }
    
    init()
  }, [])
  
  // 切换主题
  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
    updateSettings({ theme: newTheme })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>{t('message.initializing')}</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 数据安全提示横幅 */}
      {showPrivacyBanner && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center relative animate-fade-in">
          <p className="text-xs md:text-sm">
            <span role="img" aria-label="安全" className="mr-1.5">🔒</span>
            <strong>{t('privacy.title')}：</strong> {t('privacy.localDataOnly')}
          </p>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
            onClick={() => setShowPrivacyBanner(false)}
            aria-label={t('actions.close')}
          >
            ×
          </button>
        </div>
      )}
      
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-xs z-10">
        <div className="container mx-auto flex justify-between items-center h-14 md:h-16 px-4">
          <h1 className="text-xl md:text-2xl font-bold truncate">{t('app.name')}</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              onClick={toggleTheme}
              title={settings.theme === 'dark' ? t('actions.lightMode') : t('actions.darkMode')}
            >
              {settings.theme === 'dark' ? '🌞' : '🌙'}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <HomePage />
      </main>
      
      <footer className="border-t border-border py-3 md:py-4 text-center text-xs md:text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
            <p>{t('app.footer', { year: new Date().getFullYear() })}</p>
            <div className="flex items-center">
              <span className="hidden md:inline mx-2">•</span>
              <span className="text-primary flex items-center">
                <span role="img" aria-label="安全" className="mr-1">🔒</span>
                {t('privacy.shortNotice')}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
