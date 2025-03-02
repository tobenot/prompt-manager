# 提示词管理器项目结构 | Prompt Manager Project Structure

## 项目结构 | Project Structure

```
prompt-manager/
│
├── public/                    # 静态资源 | Static assets
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── assets/                # 图片和图标 | Images and icons
│   │
│   ├── components/            # 可复用组件 | Reusable components
│   │   ├── common/            # 通用组件 | Common components
│   │   ├── layout/            # 布局组件 | Layout components
│   │   └── prompt/            # 提示词相关组件 | Prompt-related components
│   │
│   ├── hooks/                 # 自定义Hooks | Custom hooks
│   │
│   ├── i18n/                  # 国际化 | Internationalization
│   │   ├── config.js          # i18n配置 | i18n configuration
│   │   ├── locales/           # 翻译文件 | Translation files
│   │   │   ├── en/            # 英文翻译 | English translations
│   │   │   │   ├── common.json
│   │   │   │   ├── prompt.json
│   │   │   │   └── settings.json
│   │   │   │
│   │   │   └── zh/            # 中文翻译 | Chinese translations
│   │   │       ├── common.json
│   │   │       ├── prompt.json
│   │   │       └── settings.json
│   │   │
│   │   └── index.js           # i18n导出 | i18n exports
│   │
│   ├── pages/                 # 页面组件 | Page components
│   │   ├── Home/
│   │   ├── PromptEditor/
│   │   ├── PromptList/
│   │   └── Settings/
│   │
│   ├── services/              # 数据服务 | Data services
│   │   ├── db.js              # IndexedDB服务 | IndexedDB service
│   │   ├── promptService.js   # 提示词服务 | Prompt service
│   │   └── exportService.js   # 导入导出服务 | Import/export service
│   │
│   ├── store/                 # 状态管理 | State management
│   │   ├── promptStore.js
│   │   ├── settingsStore.js
│   │   └── index.js
│   │
│   ├── styles/                # 全局样式 | Global styles
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── types/                 # 类型定义 | Type definitions
│   │   └── index.ts
│   │
│   ├── utils/                 # 工具函数 | Utility functions
│   │   ├── format.js
│   │   └── storage.js
│   │
│   ├── App.jsx                # 应用根组件 | Root component
│   ├── main.jsx               # 入口文件 | Entry point
│   └── router.jsx             # 路由配置 | Router configuration
│
├── .eslintrc.js               # ESLint配置 | ESLint configuration
├── .gitignore
├── .prettierrc                # Prettier配置 | Prettier configuration
├── index.html
├── package.json
├── README.md
├── tailwind.config.js         # Tailwind CSS配置 | Tailwind CSS configuration
└── vite.config.js             # Vite配置 | Vite configuration
```

## 国际化实现 | Internationalization Implementation

### 技术选择 | Technology Selection

- **i18n库**：如果使用React，采用`react-i18next`；如果使用Vue，采用`vue-i18n`
- **翻译管理**：使用JSON文件组织翻译，按照功能模块划分

### 翻译文件示例 | Translation File Examples

#### English (en/common.json)
```json
{
  "app": {
    "name": "Prompt Manager",
    "tagline": "Manage your AI prompts efficiently"
  },
  "nav": {
    "home": "Home",
    "prompts": "Prompts",
    "categories": "Categories",
    "settings": "Settings"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "import": "Import",
    "export": "Export"
  }
}
```

#### 中文 (zh/common.json)
```json
{
  "app": {
    "name": "提示词管理器",
    "tagline": "高效管理你的AI提示词"
  },
  "nav": {
    "home": "首页",
    "prompts": "提示词",
    "categories": "分类",
    "settings": "设置"
  },
  "actions": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "create": "创建",
    "import": "导入",
    "export": "导出"
  }
}
```

### i18n配置示例 | i18n Configuration Example

```javascript
// src/i18n/config.js (React版本 | React version)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件 | Import translation files
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // React已处理XSS | React already handles XSS
    }
  });

export default i18n;
```

## 语言切换实现 | Language Switching Implementation

```jsx
// src/components/common/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('common');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 可以保存用户语言偏好到localStorage | Can save user language preference to localStorage
    localStorage.setItem('userLanguage', lng);
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('zh')}
        className={i18n.language === 'zh' ? 'active' : ''}
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;
```

## 使用翻译的组件示例 | Component Example Using Translations

```jsx
// src/components/prompt/PromptCard.jsx
import { useTranslation } from 'react-i18next';

const PromptCard = ({ prompt }) => {
  const { t } = useTranslation(['common', 'prompt']);

  return (
    <div className="prompt-card">
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <div className="actions">
        <button>{t('actions.edit')}</button>
        <button>{t('actions.delete')}</button>
        <button>{t('prompt:copy')}</button>
      </div>
    </div>
  );
};

export default PromptCard;
```

## 国际化字段数据模型 | Internationalized Data Model

对于需要国际化的内容，数据模型应支持多语言。例如提示词分类名称：

```javascript
// 提示词分类模型 | Prompt category model
{
  id: 'uuid-123',
  name: {
    en: 'Writing',
    zh: '写作'
  },
  description: {
    en: 'Prompts for creative writing and content creation',
    zh: '用于创意写作和内容创作的提示词'
  }
}
```

这样的数据结构可以根据当前语言显示相应的内容。 