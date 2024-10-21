// @ts-ignore
import { middleware } from 'astro:i18n';
// @ts-ignore
import { defineMiddleware, sequence } from 'astro:middleware';

const customLogic = defineMiddleware(async ({} ,next: () => Promise<Response>) => {
  return await next();
});

export const onRequest = sequence(customLogic, middleware({
  prefixDefaultLocale: false,
  redirectToDefaultLocale: false,
  fallbackType: "rewrite"
}));
