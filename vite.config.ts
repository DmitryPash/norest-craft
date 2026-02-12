import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],

  resolve: {
    alias: {
      // удобные сокращения для импортов
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
      // если нужно — можно добавить другие
      // 'components': path.resolve(__dirname, './src/components'),
    },
  },

  // Базовый путь (важно для сборки и деплоя)
  base: '/',  // ← для большинства случаев оставляй так
              // если деплоишь в подпапку (github pages /my-app/) → base: '/my-app/'

  // Оптимизация сборки
  build: {
    // Уменьшает размер чанков (полезно для больших проектов)
    chunkSizeWarningLimit: 1000,  // в kb

    // Разделение вендора (Pinia, Vue и т.д. в отдельный чанк)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
        },
      },
    },
  },

  // Сервер для разработки
  server: {
    port: 5173,           // можно изменить
    open: true,           // автоматически открывать браузер
    // proxy: {           // если нужен прокси на бэкенд
    //   '/api': 'http://localhost:3000',
    // },
  },

  // Оптимизация для продакшена
  optimizeDeps: {
    include: ['vue', 'pinia'],
  },
})