'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeOrderNotification } from '@/types';
import { realtimeEmitter, supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ToastItem extends RealtimeOrderNotification {
  dismissed?: boolean;
}

interface RealtimeContextType {
  notifications: ToastItem[];
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  playOrderChime: () => void;
  triggerTestOrderAlert: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const RealtimeNotificationContext = createContext<RealtimeContextType | undefined>(undefined);

// Web Audio synthesizer for crisp luxury notification bell chime
function playWebAudioChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    
    // Tone 1: High crisp chime (E6 ~ 1318.5 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.5, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Tone 2: Harmonious lower shimmer (B5 ~ 987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.5);
  } catch (err) {
    console.warn('Audio chime could not play due to browser policy:', err);
  }
}

export function RealtimeNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<ToastItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playOrderChime = useCallback(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      playWebAudioChime();
    }
  }, [soundEnabled]);

  const handleNewOrder = useCallback((notification: RealtimeOrderNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    playOrderChime();
  }, [playOrderChime]);

  useEffect(() => {
    // 1. Subscribe to local event emitter (works across components & simulation)
    const unsubscribeLocal = realtimeEmitter.subscribe(handleNewOrder);

    // 2. Subscribe to cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hakim_last_realtime_order' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleNewOrder(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Subscribe to Supabase Postgres Realtime if connected
    let supabaseChannel: RealtimeChannel | null = null;
    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel('public:orders')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            const row = payload.new as {
              id: string;
              order_number: string;
              customer_name: string;
              total: number;
              created_at: string;
            };
            handleNewOrder({
              id: row.id,
              orderNumber: row.order_number,
              customerName: row.customer_name,
              total: Number(row.total),
              itemCount: 1,
              timestamp: row.created_at || new Date().toISOString(),
            });
          }
        )
        .subscribe();
    }

    return () => {
      unsubscribeLocal();
      window.removeEventListener('storage', handleStorage);
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  }, [handleNewOrder]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const triggerTestOrderAlert = () => {
    const randomTotal = Math.floor(450 + Math.random() * 2500);
    const orderNumber = `HKM-${Math.floor(1000 + Math.random() * 9000)}`;
    const names = ['Abdullah Al-Ghamdi', 'Reem Al-Saud', 'Mansour Al-Mutairi', 'Layla Al-Amoudi'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const testNotification: RealtimeOrderNotification = {
      id: `test-${Date.now()}`,
      orderNumber,
      customerName: randomName,
      total: randomTotal,
      itemCount: Math.floor(Math.random() * 3 + 1),
      timestamp: new Date().toISOString(),
    };

    realtimeEmitter.broadcastOrder(testNotification);
  };

  return (
    <RealtimeNotificationContext.Provider
      value={{
        notifications,
        dismissNotification,
        clearAll,
        playOrderChime,
        triggerTestOrderAlert,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </RealtimeNotificationContext.Provider>
  );
}

export function useRealtimeNotifications() {
  const context = useContext(RealtimeNotificationContext);
  if (!context) {
    throw new Error('useRealtimeNotifications must be used within RealtimeNotificationProvider');
  }
  return context;
}
