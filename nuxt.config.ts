// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${path.resolve(
              __dirname,
              "assets/styles/variable.scss"
          )}";
          @import "${path.resolve(__dirname, "assets/styles/mixin.scss")}";
          
          `,
        },
      },
    },
  }
})
