import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './server.key',
      cert: './server.cert',
    },
  },
  plugins: [vue()],
})
