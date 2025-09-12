import en from './translations/en';
import tr from './translations/tr';

// All supported languages
export const translations = {
  en,
  tr,
};

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Available languages for selection
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
];

/**
 * Get translation by key with optional interpolation
 * @param t Translation object
 * @param key Dot notation key (e.g. 'common.welcome')
 * @param params Optional params for interpolation
 * @returns Translated string
 */
export const getTranslation = (t: any, key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value = t;
  
  // Navigate through the nested keys
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Handle interpolation with {{param}}
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey] || `{{${paramKey}}}`;
    });
  }
  
  return value;
};
