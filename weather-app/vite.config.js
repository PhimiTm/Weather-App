import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  darkMode: 'class', // <-- Add this
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#f0f0f0',
          text: '#333333',
        },
        dark: {
          background: '#1a1a1a',
          text: '#f0f0f0',
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
})