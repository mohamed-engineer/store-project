'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction } from '@/types';
import { en } from '@/locales/en';
import { ar } from '@/locales/ar';
import { formatPrice as utilsFormatPrice } from '@/lib/utils';

type Translations = typeof en;

interface I18nContextType {
  language: Language;
  direction: Direction;
  isRtl: boolean;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  formatPrice: (amount: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'hakim_store_lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar'); // Default to Arabic (luxury heritage)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (savedLang === 'en' || savedLang === 'ar') {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (language === 'ar') {
        document.documentElement.classList.add('font-cairo');
        document.documentElement.classList.remove('font-inter');
      } else {
        document.documentElement.classList.add('font-inter');
        document.documentElement.classList.remove('font-cairo');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  const t = language === 'ar' ? ar : en;
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';

  const formatPrice = (amount: number) => {
    return utilsFormatPrice(amount, language);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        direction,
        isRtl,
        t,
        setLanguage,
        toggleLanguage,
        formatPrice,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
