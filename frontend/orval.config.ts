import "dotenv/config";
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: process.env.OPENAPI_URL!,
    output: {
      target: "./src/api/generated.ts",
      override: {
        mutator: {
          path: "./src/api/api.ts",
          name: "api",
        },
      },
    },
  },
});
