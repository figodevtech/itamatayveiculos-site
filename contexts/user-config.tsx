"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { PublicAppSettings } from "@/types/settings";

interface UserConfigContextValue {
  settings: PublicAppSettings | null;
  primaryColor?: string;
  secondaryColor?: string;
  applySettings: (settings: PublicAppSettings | null) => void;
}

const UserConfigContext = createContext<UserConfigContextValue>({
  settings: null,
  applySettings: () => {},
});

interface UserConfigProviderProps {
  settings: PublicAppSettings | null;
  children: ReactNode;
}

export function UserConfigProvider({
  settings: initialSettings,
  children,
}: UserConfigProviderProps) {
  const [settings, applySettings] = useState(initialSettings);
  const value = useMemo<UserConfigContextValue>(
    () => ({
      settings,
      primaryColor: settings?.primary_color,
      secondaryColor: settings?.secondary_color,
      applySettings,
    }),
    [settings],
  );

  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
}

/** Receives streamed settings without holding up the page's first HTML. */
export function ApplyPublicSettings({ settings }: { settings: PublicAppSettings | null }) {
  const { applySettings } = useUserConfig();
  useEffect(() => applySettings(settings), [applySettings, settings]);
  return null;
}

export function useUserConfig() {
  return useContext(UserConfigContext);
}

export function UserConfig() {
  return useUserConfig();
}
