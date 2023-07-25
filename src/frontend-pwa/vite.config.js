import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      // strategies: "injectManifest",
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: 'auto',
      includeAssets: ["**/*"],
      // includeAssets: [""],
      workbox: {
        importScripts: ["sw-custom.js"],
        globPatterns: ["**/*"],
        globFollow: true,
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      // cache: {
      //   prefix: 'wayfinder',
      //   suffix: 'v1',
      //   precache: 'precache',
      //   runtime: 'runtime-cache',
      // },
      manifest: {
        name: "BC Wayfinder",
        short_name: "BC Wayfinder",
        description: "Wayfinder: Connecting Citizens to Services through Mapping | Reporting | Trusted Location Data",
        theme_color: "#003366",
        start_url: "/",
      
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
  }
})
