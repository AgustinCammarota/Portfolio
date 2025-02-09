// @ts-check
import { defineConfig, envField } from "astro/config";
import solid from "@astrojs/solid-js";
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://agustincammarota.com",
  output: "static",
  adapter: netlify({
    imageCDN: true,
    cacheOnDemandPages: true,
    edgeMiddleware: true,
  }),
  integrations: [
    icon(),
    solid({ devtools: true }),
    partytown({
      config: {
        debug: false,
        forward: [["dataLayer.push"], ["gtag"]],
      },
    }),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es",
        },
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    fallback: {
      es: "en",
    },
    routing: {
      fallbackType: "rewrite",
    },
  },
  env: {
    schema: {
      PUBLIC_EMAIL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_GITHUB: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_WHATSAPP: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_LINKEDIN: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_API_EMAILJS: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_API_RECAPTCHA: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_TAG_MANAGER_KEY: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      SECRET_RECAPTCHA_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      SECRET_SERVICE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SECRET_TEMPLATE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SECRET_USER_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SECRET_PRIVATE_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
});
