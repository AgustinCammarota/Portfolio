enum Routes {
  en = '/',
  es = '/es/'
}

enum Language {
  en = 'English',
  es = 'Español'
}

export const languages = {
  en: Language.en,
  es: Language.es,
};

export const defaultLang = 'en';

export const ROUTES = Object.freeze({
  en: Routes.en,
  es: Routes.es
});
