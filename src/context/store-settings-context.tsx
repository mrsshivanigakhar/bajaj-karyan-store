'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreSettings } from '@/types/database';
import { fallbackStoreSettings } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

interface StoreSettingsContextType {
  settings: StoreSettings;
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: fallbackStoreSettings,
  refreshSettings: async () => {},
});

export function StoreSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: StoreSettings;
}) {
  const [settings, setSettings] = useState<StoreSettings>(
    initialSettings || fallbackStoreSettings
  );

  const fetchLatestSettings = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        setSettings(data as StoreSettings);
      }
    } catch (err) {
      console.error('Failed to fetch store settings', err);
    }
  };

  // Sync if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  // Real-time subscription to Supabase store_settings changes
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('store-settings-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        (payload) => {
          if (payload.new) {
            setSettings(payload.new as StoreSettings);
          } else {
            fetchLatestSettings();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StoreSettingsContext.Provider
      value={{ settings, refreshSettings: fetchLatestSettings }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    return {
      settings: fallbackStoreSettings,
      refreshSettings: async () => {},
    };
  }
  return context;
}
