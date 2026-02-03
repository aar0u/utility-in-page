import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 不内联资产，保持 WASM 文件独立
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // 简化文件命名
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    },
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@imgly/background-removal']
  },
  server: {
    port: 5173,
    open: true
  }
});
