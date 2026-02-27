import { useState, useCallback } from 'react';
import { type Language, type TranslationKey, translations } from '../i18n/translations';

const LANGUAGE_KEY = 'jp-language';

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'en' || stored === 'ta') return stored;
  } catch {
    // ignore
  }
  return 'en';
}

// Module-level state so all hook instances share the same language
let currentLanguage: Language = getStoredLanguage();
const listeners = new Set<() => void>();

export function useLanguage() {
  const [, forceUpdate] = useState(0);

  const changeLanguage = useCallback((lang: Language) => {
    currentLanguage = lang;
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // ignore
    }
    listeners.forEach(fn => fn());
  }, []);

  const toggleLanguage = useCallback(() => {
    changeLanguage(currentLanguage === 'en' ? 'ta' : 'en');
  }, [changeLanguage]);

  // Auto-subscribe on mount
  useState(() => {
    const update = () => forceUpdate(n => n + 1);
    listeners.add(update);
    return () => listeners.delete(update);
  });

  const t = useCallback((key: TranslationKey): string => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  }, []);

  return {
    language: currentLanguage,
    setLanguage: changeLanguage,
    changeLanguage,
    toggleLanguage,
    t,
  };
}
