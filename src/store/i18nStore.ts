import { create } from 'zustand';
import { I18nState, SupportedLanguage } from '../types';
import i18n from 'i18next';
import { localStorage } from '../utils/helpers';

// 获取浏览器语言设置
const getBrowserLanguage = (): SupportedLanguage => {
  // 获取浏览器语言
  const browserLang = navigator.language.toLowerCase();
  
  // 检查是否为支持的语言
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  // 默认返回英文
  return 'en';
};

// 获取初始语言
const getInitialLanguage = (): SupportedLanguage => {
  // 尝试从localStorage获取
  const savedLanguage = localStorage.get<SupportedLanguage | undefined>('language', undefined);
  
  // 如果有保存的语言设置，使用它
  if (savedLanguage) {
    return savedLanguage;
  }
  
  // 否则使用浏览器语言
  return getBrowserLanguage();
};

// 国际化状态存储
const useI18nStore = create<I18nState>((set) => ({
  // 当前语言
  language: getInitialLanguage(),
  
  // 设置语言
  setLanguage: (lang: SupportedLanguage) => {
    // 切换i18next语言
    i18n.changeLanguage(lang);
    
    // 保存到localStorage
    localStorage.set('language', lang);
    
    // 更新状态
    set({ language: lang });
    
    // 设置html的lang属性
    document.documentElement.lang = lang;
    
    // 如果是中文，添加中文字体类
    if (lang === 'zh') {
      document.documentElement.classList.add('lang-zh');
    } else {
      document.documentElement.classList.remove('lang-zh');
    }
  },
}));

// 在组件外初始化语言
const initLanguage = () => {
  const language = useI18nStore.getState().language;
  useI18nStore.getState().setLanguage(language);
};

// 初始化
initLanguage();

export default useI18nStore; 