import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // GitHub Pages 子路径:通过 GITHUB_REPOSITORY 注入 /<repo-name>/
  // 仓库名提供时走 Pages 子路径;本机构建时默认 /
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '舒尔特方格',
        short_name: 'Schulte',
        description: '舒尔特方格注意力训练',
        theme_color: '#0ea5e9',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        // 同样跟随 GITHUB_REPOSITORY;本机构建时为 /
        start_url: process.env.GITHUB_REPOSITORY
          ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
          : '/',
        scope: process.env.GITHUB_REPOSITORY
          ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
          : '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
})
