export type SupportedLanguage = "en" | "tr";

export interface TranslationParams {
  [key: string]: string | number;
}

export interface I18n {
  t: (key: string, params?: TranslationParams, returnRaw?: boolean) => any;
  locale: SupportedLanguage;
  setLocale: (locale: SupportedLanguage) => Promise<void>;
  locales: Array<{ code: SupportedLanguage; name: string }>;
}
