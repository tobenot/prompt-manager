import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '提示词管理器 | Prompt Manager',
        short_name: 'Prompt Manager',
        description: '提示词管理器 - 本地保存、分类管理与复用提示词，纯浏览器运行。',
        theme_color: '#0ea5e9',
        background_color: '#0ea5e9',
        display: 'standalone',
        lang: 'zh-CN',
        start_url: '/prompt-manager/',
        scope: '/prompt-manager/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  // 设置基础路径，用于GitHub Pages部署
  // 如果您的仓库名不是'prompt-manager'，请修改为实际的仓库名
  base: '/prompt-manager/',
})
