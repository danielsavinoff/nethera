import path from "path";

import solid from "vite-plugin-solid";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
