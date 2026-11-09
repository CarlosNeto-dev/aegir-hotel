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
  SETTINGS_KEY,
  type Settings,
} from "../settings-utils/settings-options";
import { applySettings } from "../settings-utils/settings-script";

type SettingsContextValue = {
  settings: Settings;
  update: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null");
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
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

  const value = useMemo(() => ({ settings, update }), [settings, update]);

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
