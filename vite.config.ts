import { copyFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/wenxian/',
  plugins: [
    vue(),
    {
      // GitHub Pages 无服务端重写，用 404.html 兜底 SPA 深链刷新
      name: 'gh-pages-spa-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: '@use "@/styles/variables.scss" as *;'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 1500
  }
})
