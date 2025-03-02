// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh';

// 简化后的文本类型 - 不再使用多语言对象
// export type I18nText = {
//   [key in SupportedLanguage]: string;
// };

// 基础实体类型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 提示词模型
export interface Prompt extends BaseEntity {
  title: string;
  content: string;
  description?: string;
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
  description?: string;
  defaultValue?: string;
  required: boolean;
}

// 提示词分类
export interface PromptCategory extends BaseEntity {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  promptCount: number;
}

// 标签
export interface Tag extends BaseEntity {
  name: string;
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
  initialize: () => Promise<void>;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<string | null>;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => Promise<boolean>;
  deletePrompt: (id: string) => Promise<boolean>;
  incrementUsage: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
  togglePin: (id: string) => Promise<boolean>;
  addCategory: (category: Omit<PromptCategory, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) => Promise<string | null>;
  updateCategory: (id: string, category: Partial<PromptCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateCategoryPromptCount: (categoryId: string) => Promise<boolean>;
  updateTagsPromptCount: (tagNames: string[]) => Promise<boolean>;
}

// 应用设置状态
export interface SettingsState {
  settings: UserSettings;
  initialize: () => Promise<UserSettings>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
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