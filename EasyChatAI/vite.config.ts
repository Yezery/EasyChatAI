import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { join } from "node:path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        index: join(__dirname, 'index.html')
      },
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.type === 'asset' && /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name)) {
            return 'static/img/[name].[hash][ext]';
          }   if (assetInfo.type === 'asset' && /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name)) {
            return 'static/fonts/[name].[hash][ext]';
          } 
          return 'static/[ext]/name1-[hash].[ext]';
        },
      }
    }
  },
  base:"./",
  resolve: {
    alias: {
      '@':join(__dirname,'./src/')
    }
  },
  server: {
    host: '0.0.0.0',
    hmr: true,
    strictPort: false,
  }
})
