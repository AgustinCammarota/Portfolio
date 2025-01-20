import { defineMiddleware, sequence } from "astro:middleware";
import { getRelativeLocaleUrl } from "astro:i18n";

let SELECTED_LANG = "";
const DEFAULT_LANG = "en";
const LANG_COOKIE_NAME = "lang";
const LANG_PREFIXES = {
  es: "/es",
  en: "",
};

const detectPreferredLanguage = (acceptLanguage: string | null): string => {
  if (!acceptLanguage) return DEFAULT_LANG;
  const preferredLang =
    acceptLanguage.split(",")[0]?.split("-")[0] || DEFAULT_LANG;
  return preferredLang.includes("es") ? "es" : DEFAULT_LANG;
};

const determineTargetUrl = (lang: string, pathname: string): string => {
  const route = pathname.startsWith(LANG_PREFIXES.es)
    ? pathname.slice(LANG_PREFIXES.es.length)
    : pathname;
  return getRelativeLocaleUrl(lang, route);
};

const customLogic = defineMiddleware(
  async ({ request, redirect, url, cookies }, next) => {
    const acceptLanguage = request.headers.get("accept-language");
    const preferredLanguage = detectPreferredLanguage(acceptLanguage);
    const currentLangFromCookies = cookies.get(LANG_COOKIE_NAME)?.value;
    const pathname = url.pathname;

    if (currentLangFromCookies) {
      SELECTED_LANG = currentLangFromCookies;
      return await next();
    }

    const isPathStartsWithEs = pathname.startsWith(LANG_PREFIXES.es);
    const isCorrectPathForLang =
      (preferredLanguage === "es" && isPathStartsWithEs) ||
      (preferredLanguage === "en" && !isPathStartsWithEs);

    if (isCorrectPathForLang) {
      return await next();
    }

    const targetUrl = determineTargetUrl(preferredLanguage, pathname);

    if (targetUrl && !SELECTED_LANG) {
      return redirect(targetUrl, 307);
    }

    return await next();
  },
);

export const onRequest = sequence(customLogic);
