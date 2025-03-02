import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/common/LanguageSwitcher.tsx'
import './App.css'

function App() {
  const { t } = useTranslation('common')
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('app.name')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('app.tagline')}</h2>
          <p className="text-lg mb-4">{t('app.description')}</p>
          
          <div className="card">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="btn btn-primary"
            >
              {t('actions.add')} ({count})
            </button>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('nav.prompts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card">
                <h3 className="font-medium">{t('prompt.title')} {item}</h3>
                <p className="text-muted-foreground">{t('prompt.description')}</p>
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
                  <button className="btn btn-ghost btn-sm">{t('actions.copy')}</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border p-4">
        <div className="container mx-auto text-center text-muted-foreground">
          Prompt Manager &copy; 2024
        </div>
      </footer>
    </div>
  )
}

export default App
