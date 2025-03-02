import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 支持的语言列表
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  
  // 获取当前语言
  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];
  
  // 切换语言
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className || ''}`}>
      {/* 语言切换按钮 */}
      <button
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      
      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div 
            className="py-1" 
            role="menu" 
            aria-orientation="vertical" 
            aria-labelledby="language-switcher"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`
                  w-full text-left block px-4 py-2 text-sm 
                  ${lang.code === i18n.language 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => changeLanguage(lang.code)}
                role="menuitem"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 