import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

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
  define: {
    global: "globalThis",
  },
  // 🔥 Nuclear: Replace icons with empty module
  optimizeDeps: {
    include: ["@chakra-ui/icons > @chakra-ui/icon"],
    exclude: []
  },
  build: {
    rollupOptions: {
      // Block icons completely
      external: (id) => id.includes("@chakra-ui/icons"),
    },
  },
});
