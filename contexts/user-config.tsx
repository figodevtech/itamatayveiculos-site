"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { AppSettings } from "@/types/settings";

interface UserConfigContextValue {
  settings: AppSettings | null;
  primaryColor?: string;
  secondaryColor?: string;
}

const UserConfigContext = createContext<UserConfigContextValue>({
  settings: null,
});

interface UserConfigProviderProps {
  settings: AppSettings | null;
  children: ReactNode;
}

export function UserConfigProvider({
  settings,
  children,
}: UserConfigProviderProps) {
  const value = useMemo<UserConfigContextValue>(
    () => ({
      settings,
      primaryColor: settings?.primary_color,
      secondaryColor: settings?.secondary_color,
    }),
    [settings],
  );

  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig() {
  return useContext(UserConfigContext);
}

export function UserConfig() {
  return useUserConfig();
}
