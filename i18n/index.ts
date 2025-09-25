import en from "./translations/en";
import tr from "./translations/tr";
import { SupportedLanguage } from "./types";

export const translations = {
  en,
  tr,
};

export const AVAILABLE_LANGUAGES = [
  { code: "en" as SupportedLanguage, name: "English" },
  { code: "tr" as SupportedLanguage, name: "Türkçe" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

// Helper function to get nested translation value
export const getTranslation = (
  translations: any,
  key: string,
  params?: { [key: string]: string | number }
): string => {
  const keys = key.split(".");
  let value = translations;

  // Navigate through the nested keys
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  // If value is a string, replace parameters
  if (typeof value === "string" && params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return typeof value === "string" ? value : key;
};
