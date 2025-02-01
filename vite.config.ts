import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "generateSW",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,jsx,css,html,png,svg,json,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.habits\.mdelarue\.dev/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "robots.txt", "h-512.png", "h-192.png"],
      manifest: {
        name: "MiniHabits",
        description: "A simple habit tracker",
        short_name: "MiniHabits",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "h-512.png",
            sizes: "512x512",
            type: "image/webp",
          },
          {
            src: "h-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
