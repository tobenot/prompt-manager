import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enCommon from './locales/en/common.json';
import enPrompt from './locales/en/prompt.json';
import enSettings from './locales/en/settings.json';
import zhCommon from './locales/zh/common.json';
import zhPrompt from './locales/zh/prompt.json';
import zhSettings from './locales/zh/settings.json';

const resources = {
  en: {
    common: enCommon,
    prompt: enPrompt,
    settings: enSettings
  },
  zh: {
    common: zhCommon,
    prompt: zhPrompt,
    settings: zhSettings
  }
};

// 获取浏览器首选语言
const getBrowserLanguage = () => {
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh';
  return 'en'; // 默认英语
};

// 获取存储的语言偏好
const getSavedLanguage = () => {
  return localStorage.getItem('userLanguage') || getBrowserLanguage();
};

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    
    // 命名空间
    defaultNS: 'common',
    ns: ['common', 'prompt', 'settings'],
    
    // 调试模式
    debug: process.env.NODE_ENV === 'development',
    
    // 特性配置
    interpolation: {
      escapeValue: false // React已处理XSS防护
    },
    
    // 检测语言配置
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage']
    },
    
    // React特定配置
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      nsMode: 'default'
    }
  });

// 语言变更事件处理
i18n.on('languageChanged', (lng) => {
  // 保存用户语言偏好
  localStorage.setItem('userLanguage', lng);
  
  // 设置html的lang属性
  document.documentElement.setAttribute('lang', lng);
  
  // 字体调整或其他与语言相关的样式调整可以在这里处理
  if (lng === 'zh') {
    document.documentElement.classList.add('lang-zh');
    document.documentElement.classList.remove('lang-en');
  } else {
    document.documentElement.classList.add('lang-en');
    document.documentElement.classList.remove('lang-zh');
  }
});

export default i18n; 