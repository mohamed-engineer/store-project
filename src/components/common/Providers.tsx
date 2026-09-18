'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/context/I18nContext';
import { RealtimeNotificationProvider } from '@/context/RealtimeNotificationContext';
import { AppLayoutWrapper } from '@/components/common/AppLayoutWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <RealtimeNotificationProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </RealtimeNotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
