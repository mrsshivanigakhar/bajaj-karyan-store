import React from 'react';
import { getStoreSettings } from '@/services/store-service';
import { SettingsClient } from './SettingsClient';

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Store & System Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure public store contact details, operating hours, delivery thresholds, and order prefixes.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
