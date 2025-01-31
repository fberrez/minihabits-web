import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,jsx,css,html,png,svg,json,webp}"],
      },
      includeAssets: ["**/*"],
      manifest: {
        name: "MiniHabits",
        short_name: "MiniHabits",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "public/h-512.png",
            sizes: "512*512",
            type: "image/webp",
          },
          {
            src: "public/h-256.png",
            sizes: "256*256",
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
