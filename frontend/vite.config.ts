import path from "path";

import solid from "vite-plugin-solid";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [solid(), tailwindcss()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.FRONTEND_PORT) || 5173,
      proxy: {
        // Only for development.
        // For production use api.* subdomain.
        "/api": {
          target: env.BACKEND_URL,
          changeOrigin: true,

          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
