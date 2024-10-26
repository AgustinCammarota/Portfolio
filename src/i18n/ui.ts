enum Path {
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

export const PATHS = Object.freeze({
  en: Path.en,
  es: Path.es
});

export const ROUTES: string[] = ['works', 'skills', 'projects', 'contact'];
