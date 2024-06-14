import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin({ topExecutionPriority: false })],
  server: {
    host: '0.0.0.0',
    port: 1980
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    lib: {
      entry: './packages/index.ts',
      name: 'element-pivot',
      fileName: 'element-pivot'
    },
    rollupOptions: {
      external: ['mttk-vue-wrap', 'vue', 'element-plus'],
      output: {
        globals: {},
        assetFileNames: 'index.css'
      }
    }
  }
})
