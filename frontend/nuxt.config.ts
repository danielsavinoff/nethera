import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";
import { contentLocales } from "./i18n/i18n.map";

const backendHost = process.env.BACKEND_HOST ?? "localhost";
const backendPort = process.env.BACKEND_PORT ?? "3000";
const backendUrl = `http://${backendHost}:${backendPort}`;

export default defineNuxtConfig({
  modules: [
    "@bitrix24/b24ui-nuxt",
    "@bitrix24/b24jssdk-nuxt",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],

  ssr: false,

  devtools: { enabled: false },

  runtimeConfig: {
    /**
     * @memo this will be overwritten from .env or Docker_*
     * @see https://nuxt.com/docs/guide/going-further/runtime-config#example
     */
    public: {
      appUrl: "",
      apiUrl: "/api",
    },
  },

  compatibilityDate: "2025-07-16",

  app: {
    head: {
      title: "Starter",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      htmlAttrs: { class: "light" },
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
      allowedHosts: [process.env.VIRTUAL_HOST as string],
      hmr: {
        protocol: "wss",
        host: process.env.VIRTUAL_HOST,
        clientPort: Number(process.env.VIRTUAL_PORT),
      },
    },
  },

  nitro: {
    devProxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
    },
    routeRules: {
      "/api/**": {
        proxy: `${backendUrl}/api/**`,
      },
    },
  },

  i18n: {
    detectBrowserLanguage: false,
    strategy: "no_prefix",
    langDir: "locales",
    locales: contentLocales,
    defaultLocale: "en",
  },
});
