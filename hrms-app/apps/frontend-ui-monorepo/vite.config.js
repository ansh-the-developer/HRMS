import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname not defined in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../../packages/shared"),
    },
  },
  // 🔧 Chakra UI Icons + Rollup Fix
  optimizeDeps: {
    exclude: ['@chakra-ui/icons'],
  },
  define: {
    global: 'globalThis',
  },
  // 🔧 Additional Vite stability for Chakra v3
  build: {
    rollupOptions: {
      external: ['@chakra-ui/icons'],
    },
  },
});
