// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-router-dom"],
    },
  },
  optimizeDeps: {
    include: ["react-router-dom"],
  },
};
