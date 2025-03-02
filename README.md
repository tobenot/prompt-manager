# Prompt Manager | 提示词管理器

[English](#english) | [中文](#chinese)

<a name="english"></a>
## 🌍 English

A lightweight browser-side prompt management tool that helps users create, edit, categorize and export prompt templates. Data is stored locally in the browser without the need for a backend server.

### 🚀 Features

- **Create & Edit**: Add new prompts and edit existing ones
- **Categorize & Tag**: Organize prompts with categories and tags for easy retrieval
- **Search & Filter**: Quickly find prompts by keywords, tags, or categories
- **Favorites & Pins**: Mark frequently used prompts
- **Copy Functions**: One-click copy of prompts to clipboard
- **Data Storage & Sync**: Local browser storage with import/export capabilities
- **Version History**: Track modifications to your prompts
- **Templates**: Pre-defined templates for common use cases
- **Variable Replacement**: Set variables in prompts for quick replacement
- **Preview Function**: Quick preview of prompt effects
- **Drag & Drop Ordering**: Adjust the order of prompts
- **Dark Mode**: Light/dark theme support
- **Internationalization**: Support for multiple languages (currently English and Chinese)

### 🔧 Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Storage**: IndexedDB for prompt data, localStorage for user preferences
- **Build Tools**: Vite, ESLint, and Prettier
- **i18n**: react-i18next for internationalization

### 📦 Installation & Usage

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-manager.git

# Navigate to the project directory
cd prompt-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 🔮 Future Enhancements

1. **Cloud Sync**: Optional cloud storage synchronization
2. **Community Sharing**: Share and acquire high-quality prompts
3. **Browser Extension**: Develop browser extensions for more convenient prompt management
4. **AI Rating System**: AI-assisted tools to evaluate prompt quality
5. **More Languages**: Expand internationalization support

### 📝 License

MIT

---

<a name="chinese"></a>
## 🌍 中文

一个轻量级的浏览器端提示词管理工具，帮助用户创建、编辑、分类和导出提示词模板。数据存储在浏览器本地，无需后端服务器。

### 🚀 功能特点

- **创建与编辑**：添加新提示词，编辑已有提示词
- **分类与标签**：对提示词进行分类，添加标签便于检索
- **搜索与过滤**：根据关键词、标签或分类快速查找提示词
- **收藏与置顶**：标记常用提示词
- **复制功能**：一键复制提示词到剪贴板
- **数据存储与同步**：使用浏览器的本地存储，支持导入导出
- **版本历史**：记录提示词的修改历史
- **提示词模板**：预设常用模板供用户选择
- **变量替换**：支持在提示词中设置变量，使用时可快速替换
- **预览功能**：快速预览提示词效果
- **拖拽排序**：调整提示词顺序
- **暗黑模式**：支持亮色/暗色主题切换
- **国际化**：支持多语言（目前支持英语和中文）

### 🔧 技术栈

- **前端框架**：React配合TypeScript
- **样式设计**：TailwindCSS
- **状态管理**：Zustand
- **存储方案**：IndexedDB存储提示词数据，localStorage存储用户偏好
- **构建工具**：Vite、ESLint和Prettier
- **国际化**：使用react-i18next实现多语言支持

### 📦 安装与使用

```bash
# 克隆仓库
git clone https://github.com/yourusername/prompt-manager.git

# 进入项目目录
cd prompt-manager

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 🔮 未来拓展方向

1. **云端同步**：添加可选的云端存储同步功能
2. **社区共享**：允许用户分享和获取高质量提示词
3. **浏览器插件**：开发浏览器扩展，使提示词管理更加便捷
4. **AI评分系统**：评估提示词质量的AI辅助工具
5. **更多语言**：扩展国际化支持

### 📝 许可证

MIT

## Development Notes

This project was created with Vite, React, and TypeScript. The template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
