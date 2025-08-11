export type SupportedLanguage = 'en' | 'tr' | 'de';

export interface Language {
  code: SupportedLanguage;
  name: string;
}

export interface TranslationParams {
  [key: string]: string;
}

export interface I18n {
  t: (key: string, params?: TranslationParams) => string;
  locale: SupportedLanguage;
  setLocale: (locale: SupportedLanguage) => void;
  locales: Language[];
}
