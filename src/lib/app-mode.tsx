"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/** "clinic" — Private Clinics: doctors and patients both sign in, one
 * roster of demo accounts, notes link between them (formerly "Beta
 * Testing"). "hospital" — Hospitals: a fixed 10-doctor directory with
 * specialty-locked accounts and no separate patient login; doctors
 * reach their patients' records directly (formerly "Launch Product"). */
export type AppMode = "clinic" | "hospital";

const STORAGE_KEY = "polyscribe_app_mode";

function readStoredMode(): AppMode {
  if (typeof window === "undefined") return "clinic";
  const stored = localStorage.getItem(STORAGE_KEY);
  // Accepts the legacy "launch" value so anyone who picked it before
  // the Hospitals/Private Clinics rename keeps their chosen mode.
  return stored === "hospital" || stored === "launch" ? "hospital" : "clinic";
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
