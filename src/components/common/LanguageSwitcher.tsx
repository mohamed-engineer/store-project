'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { language, toggleLanguage } = useI18n();

  return (
    <Button
      variant="outline"
      size={compact ? "sm" : "md"}
      onClick={toggleLanguage}
      className={cn(
        "rounded-xl border-border/80 hover:border-primary/50 text-xs font-semibold px-3 py-1.5 h-9 transition-all gap-1.5",
        className
      )}
      title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label="Language Switcher"
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
      <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
    </Button>
  );
}
