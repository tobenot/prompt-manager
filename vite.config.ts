import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Prompt Manager - Vite配置
 * 
 * 数据安全声明：此配置文件仅用于构建设置，不包含任何用户数据处理逻辑。
 * 
 * @license MIT
 * @copyright Copyright (c) 2024
 */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置基础路径，用于GitHub Pages部署
  // 如果您的仓库名不是'prompt-manager'，请修改为实际的仓库名
  base: '/prompt-manager/',
})
