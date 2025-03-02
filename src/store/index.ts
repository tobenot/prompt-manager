import usePromptStore from './promptsStore';
import useSettingsStore from './settingsStore';
import useI18nStore from './i18nStore';

// 初始化所有存储
export const initializeStores = async () => {
  // 按顺序初始化
  // 先初始化设置，因为其他状态可能依赖于设置
  const settings = await useSettingsStore.getState().initialize?.();
  
  // 然后初始化提示词存储
  await usePromptStore.getState().initialize?.();
  
  return { settings };
};

export {
  usePromptStore,
  useSettingsStore,
  useI18nStore,
}; 