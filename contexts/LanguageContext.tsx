import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, getTranslation, translations } from '@/i18n';
import { I18n, SupportedLanguage, TranslationParams } from '@/i18n/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = '@tadado_language';

// Create context with default values
const LanguageContext = createContext<I18n>({
  t: (key: string) => key,
  locale: DEFAULT_LANGUAGE,
  setLocale: () => {},
  locales: AVAILABLE_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
          setLocale(savedLanguage as SupportedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  // Save language preference when it changes
  const changeLocale = async (newLocale: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
      setLocale(newLocale);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  // Translation function
  const t = (key: string, params?: TranslationParams): string => {
    return getTranslation(translations[locale], key, params);
  };

  const value: I18n = {
    t,
    locale,
    setLocale: changeLocale,
    locales: AVAILABLE_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): I18n => useContext(LanguageContext);
