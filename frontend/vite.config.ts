import path from "path";

import solid from "vite-plugin-solid";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { createProxyMiddleware } from "http-proxy-middleware";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      solid(),
      tailwindcss(),
      {
        name: "api-subdomain-proxy",

        configureServer(server) {
          const proxy = createProxyMiddleware({
            target: env.BACKEND_URL,
            changeOrigin: true,
          });

          server.middlewares.use((req, res, next) => {
            const host = req.headers.host?.split(":")[0] ?? "";

            if (host.startsWith("api.")) {
              return proxy(req, res, next);
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
