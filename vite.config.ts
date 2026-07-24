import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // npm run dev — 컨테이너 안에서 실행할 때 컨테이너 밖(호스트)에서 접근 가능하도록
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
})
