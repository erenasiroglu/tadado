export type SupportedLanguage = 'en' | 'tr' | 'de' | 'es' | 'ar';

export interface Language {
  code: SupportedLanguage;
  name: string;
}

export interface TranslationParams {
  [key: string]: string;
}

export interface I18n {
  t: (key: string, params?: TranslationParams, returnRaw?: boolean) => any;
  locale: SupportedLanguage;
  setLocale: (locale: SupportedLanguage) => void;
  locales: Language[];
}
