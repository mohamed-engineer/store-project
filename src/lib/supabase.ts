import { createClient } from '@supabase/supabase-js';
import { RealtimeOrderNotification } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Custom Browser Realtime Event Bus for dual-mode support
type RealtimeCallback = (notification: RealtimeOrderNotification) => void;
const listeners: Set<RealtimeCallback> = new Set();

export const realtimeEmitter = {
  subscribe(callback: RealtimeCallback) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  broadcastOrder(notification: RealtimeOrderNotification) {
    listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (err) {
        console.error('Error dispatching realtime notification:', err);
      }
    });

    // Cross-tab broadcast via window storage event
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('hakim_last_realtime_order', JSON.stringify({
          ...notification,
          _timestamp: Date.now(),
        }));
      } catch (e) {
        // LocalStorage fallback
      }
    }
  },
};
