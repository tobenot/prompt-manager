import { create } from 'zustand';
import { SettingsState, UserSettings } from '../types';
import db from '../utils/indexedDB';
import { localStorage } from '../utils/helpers';

// 默认设置
const DEFAULT_SETTINGS: UserSettings = {
  language: 'en', // 默认语言
  theme: 'system', // 默认主题
  fontSize: 16, // 默认字体大小
  autoSave: true, // 默认自动保存
  exportFormat: 'json', // 默认导出格式
};

// 设置状态存储
const useSettingsStore = create<SettingsState>((set) => ({
  // 设置状态
  settings: DEFAULT_SETTINGS,
  
  // 初始化设置
  initialize: async () => {
    try {
      // 首先尝试从IndexedDB获取设置
      const dbSettings = await db.settings.get();
      
      // 如果没有找到，尝试从localStorage获取
      const localSettings = localStorage.get<UserSettings>('user-settings', DEFAULT_SETTINGS);
      
      // 合并设置，优先使用数据库设置
      const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...localSettings,
        ...(dbSettings || {}),
      };
      
      // 更新状态
      set({ settings: mergedSettings });
      
      // 如果设置存在于localStorage但不在IndexedDB，则保存到IndexedDB
      if (localSettings && !dbSettings) {
        await db.settings.save(mergedSettings);
      }
      
      // 应用主题
      applyTheme(mergedSettings.theme);
      
      return mergedSettings;
    } catch (error) {
      console.error('初始化设置失败:', error);
      
      // 失败时使用默认设置
      set({ settings: DEFAULT_SETTINGS });
      return DEFAULT_SETTINGS;
    }
  },
  
  // 更新设置
  updateSettings: async (updates: Partial<UserSettings>) => {
    try {
      // 获取当前设置
      const currentSettings = useSettingsStore.getState().settings;
      
      // 合并更新
      const updatedSettings = {
        ...currentSettings,
        ...updates,
      };
      
      // 更新状态
      set({ settings: updatedSettings });
      
      // 保存到IndexedDB
      await db.settings.save(updatedSettings);
      
      // 保存到localStorage作为备份
      localStorage.set('user-settings', updatedSettings);
      
      // 如果主题变更，应用新主题
      if (updates.theme) {
        applyTheme(updates.theme);
      }
      
      return true;
    } catch (error) {
      console.error('更新设置失败:', error);
      return false;
    }
  },
  
  // 重置设置
  resetSettings: async () => {
    try {
      // 更新状态
      set({ settings: DEFAULT_SETTINGS });
      
      // 保存到IndexedDB
      await db.settings.save(DEFAULT_SETTINGS);
      
      // 保存到localStorage
      localStorage.set('user-settings', DEFAULT_SETTINGS);
      
      // 应用默认主题
      applyTheme(DEFAULT_SETTINGS.theme);
      
      return true;
    } catch (error) {
      console.error('重置设置失败:', error);
      return false;
    }
  },
}));

// 应用主题
const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  // 获取html元素
  const html = document.documentElement;
  
  // 移除现有主题类
  html.classList.remove('light', 'dark');
  
  // 应用新主题
  if (theme === 'system') {
    // 检测系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(prefersDark ? 'dark' : 'light');
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      html.classList.remove('light', 'dark');
      html.classList.add(e.matches ? 'dark' : 'light');
    });
  } else {
    // 应用指定主题
    html.classList.add(theme);
  }
};

export default useSettingsStore; 