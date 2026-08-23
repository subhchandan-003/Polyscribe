"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AppMode = "beta" | "launch";

const STORAGE_KEY = "polyscribe_app_mode";

function readStoredMode(): AppMode {
  if (typeof window === "undefined") return "beta";
  return localStorage.getItem(STORAGE_KEY) === "launch" ? "launch" : "beta";
}

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextType | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(readStoredMode);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error("useAppMode must be used within AppModeProvider");
  return ctx;
}
