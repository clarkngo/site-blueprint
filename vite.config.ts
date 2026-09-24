import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Project site: https://clarkngo.github.io/site-blueprint/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/site-blueprint/' : '/',
  plugins: [react(), tailwindcss()],
}))
