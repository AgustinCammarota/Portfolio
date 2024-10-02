// @ts-check
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon(),
    solid({ devtools: true })
  ],
  prefetch: true,
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite"
    },
    fallback: {
      es: "en"
    },
  }
});
