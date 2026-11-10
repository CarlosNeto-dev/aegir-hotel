"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SETTINGS,
  PRESETS,
  SETTINGS_KEY,
  matchPreset,
  type PresetId,
  type Settings,
} from "../settings-utils/settings-options";
import { applySettings, loadSettings } from "../settings-utils/settings-script";

type SettingsContextValue = {
  settings: Settings;
  ready: boolean;
  preset: PresetId | null;
  update: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void;
  applyPreset: (id: PresetId) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applySettings(settings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [ready, settings]);

  const update = useCallback(
    <Key extends keyof Settings>(key: Key, value: Settings[Key]) =>
      setSettings((current) => ({ ...current, [key]: value })),
    [],
  );

  const applyPreset = useCallback(
    (id: PresetId) => setSettings((current) => ({ ...current, ...PRESETS[id] })),
    [],
  );

  const value = useMemo(
    () => ({ settings, ready, preset: matchPreset(settings), update, applyPreset }),
    [settings, ready, update, applyPreset],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings precisa estar dentro do SettingsProvider");
  }
  return context;
}
