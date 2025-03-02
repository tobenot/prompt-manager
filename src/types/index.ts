// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh';

// 多语言文本类型
export type I18nText = {
  [key in SupportedLanguage]: string;
};

// 基础实体类型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 提示词模型
export interface Prompt extends BaseEntity {
  title: I18nText;
  content: I18nText;
  description?: I18nText;
  tags: string[];
  categoryId: string;
  isFavorite: boolean;
  isPinned: boolean;
  usageCount: number;
  variables?: PromptVariable[];
}

// 提示词变量
export interface PromptVariable {
  id: string;
  name: string;
  description?: I18nText;
  defaultValue?: string;
  required: boolean;
}

// 提示词分类
export interface PromptCategory extends BaseEntity {
  name: I18nText;
  description?: I18nText;
  color?: string;
  icon?: string;
  promptCount: number;
}

// 标签
export interface Tag extends BaseEntity {
  name: I18nText;
  promptCount: number;
}

// 用户设置
export interface UserSettings {
  language: SupportedLanguage;
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  autoSave: boolean;
  exportFormat: 'json' | 'markdown' | 'text';
}

// 国际化状态
export interface I18nState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

// 提示词管理状态
export interface PromptState {
  prompts: Prompt[];
  categories: PromptCategory[];
  tags: Tag[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  incrementUsage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  addCategory: (category: Omit<PromptCategory, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) => void;
  updateCategory: (id: string, category: Partial<PromptCategory>) => void;
  deleteCategory: (id: string) => void;
}

// 应用设置状态
export interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

// 导入导出类型
export interface ImportData {
  prompts: Prompt[];
  categories: PromptCategory[];
  tags: Tag[];
  version: string;
  exportDate: string;
}

// API响应类型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
} 