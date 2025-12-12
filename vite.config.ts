import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Gunakan base relatif agar bundle di folder dist bisa di-serve dari sub-path atau lewat file:// tanpa memecah path asset.
  base: './',
  plugins: [react()],
})
