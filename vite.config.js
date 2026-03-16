import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/EmbeddedC_App/', // Add this line! Use your repo name.
  plugins: [react()],
})
