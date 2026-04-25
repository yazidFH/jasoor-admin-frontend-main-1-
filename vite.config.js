import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import critical from 'rollup-plugin-critical'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    critical({
      criticalBase: 'dist/',       // folder where your build output is
      criticalPages: [
        { uri: '', template: 'index.html' } // main page
      ],
      inline: true,                // inline critical CSS into index.html
      minify: true,                // minify critical CSS
      extract: true,               // extract remaining CSS to separate file
    })
  ],
  build: {
    target: 'esnext',              // modern JS only
    polyfillDynamicImport: false,  // don’t include extra polyfills
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'       // separate vendor bundle
          }
        }
      }
    }
  }
})