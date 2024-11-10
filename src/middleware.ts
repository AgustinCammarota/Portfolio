import { middleware } from "astro:i18n";
import { defineMiddleware, sequence } from "astro:middleware";

/* eslint-disable no-empty-pattern */
const customLogic = defineMiddleware(
  async ({}, next: () => Promise<Response>) => {
    return await next();
  },
);

export const onRequest = sequence(
  customLogic,
  middleware({
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false,
    fallbackType: "rewrite",
  }),
);
