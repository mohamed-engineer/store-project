'use client';

import React from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useRealtimeNotifications } from '@/context/RealtimeNotificationContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui/Button';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { language, t } = useI18n();
  const {
    soundEnabled,
    setSoundEnabled,
    triggerTestOrderAlert,
  } = useRealtimeNotifications();

  return (
    <header className="h-16 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{t.admin.liveBadge}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simulate Realtime Order Button */}
        <Button
          onClick={triggerTestOrderAlert}
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-bold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 gap-1.5 hidden md:inline-flex"
          title="Simulate a live customer order placing"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{language === 'ar' ? 'تجربة إشعار فوري (Live Order)' : 'Simulate Order Alert'}</span>
        </Button>

        {/* Audio Sound Chime Mute/Unmute */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          title={soundEnabled ? 'Mute Order Chime' : 'Enable Order Chime'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher compact />

        {/* Dark/Light mode */}
        <ThemeToggle />
      </div>
    </header>
  );
}
