import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// The domain is still open (see README, "Before launch").
// Set SITE_URL in the host's build settings, or change the fallback here.
const site = process.env.SITE_URL ?? "https://rahai.dev";

// profile.yaml is read with fs (see src/lib/profile.ts), so Vite does not
// know about it. Restart the dev server when it changes.
const reloadProfile = {
  name: "reload-profile",
  configureServer(server) {
    server.watcher.add("src/data/profile.yaml");
    server.watcher.on("change", (file) => {
      if (file.replaceAll("\\", "/").endsWith("src/data/profile.yaml")) server.restart();
    });
  },
};

export default defineConfig({
  site,
  vite: { plugins: [reloadProfile] },
  trailingSlash: "ignore",
  compressHTML: true,
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      provider: fontProviders.fontsource(),
      weights: ["300 600"],
      styles: ["normal"],
      subsets: ["latin"],
      formats: ["woff2"],
      fallbacks: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
    },
    {
      name: "Instrument Sans",
      cssVariable: "--font-instrument",
      provider: fontProviders.fontsource(),
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin"],
      formats: ["woff2"],
      fallbacks: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
    },
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 500],
      styles: ["normal"],
      subsets: ["latin"],
      formats: ["woff2"],
      fallbacks: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
    },
  ],
});
