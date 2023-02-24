import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { fileURLToPath } from "url";
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      runMode: "web-client",
      // sassVariables: "src/quasar.variables.sass",
    }),
    VueI18nPlugin({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,
      include: fileURLToPath(new URL("./src/locales/**", import.meta.url)),
      defaultSFCLang: "json",
    }),
  ],
  server: {
    fs: {
      allow: [".."],
    },
    host: true,
    port: 8080,
  },
});
