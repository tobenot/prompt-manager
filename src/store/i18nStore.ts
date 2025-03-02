import { create } from 'zustand';
import { I18nState, SupportedLanguage } from '../types';
import i18n from 'i18next';
import { localStorage } from '../utils/helpers';

// 国际化状态存储
const useI18nStore = create<I18nState>((set) => ({
  // 当前语言
  language: (localStorage.get<SupportedLanguage>('language', 'en')),
  
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