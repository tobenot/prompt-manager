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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <h1 className="text-2xl font-bold">{t('app.name')}</h1>
          <div className="flex items-center gap-4">
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
      
      <main className="flex-1">
        <HomePage />
      </main>
      
      <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          {t('app.footer', { year: new Date().getFullYear() })}
        </div>
      </footer>
    </div>
  )
}

export default App
