"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Stethoscope,
  History,
  Sparkles,
  BarChart3,
  Users,
  Plus,
  LogOut,
  Search,
  Radio,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CommandPalette } from "@/components/command-palette";

export type NavKey =
  | "console"
  | "history"
  | "demo"
  | "dashboard"
  | "pricing"
  | "pitch"
  | "patients";

interface CommandBarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewConsultation: () => void;
  /** Hospitals mode: doctors get direct access to their patients'
   * records, so show an extra nav tab for it. */
  showPatients?: boolean;
}

const BASE_TABS: { key: NavKey; label: string; icon: typeof Stethoscope }[] = [
  { key: "console", label: "Console", icon: Stethoscope },
  { key: "history", label: "History", icon: History },
  { key: "demo", label: "Demo", icon: Sparkles },
  { key: "dashboard", label: "Stats", icon: BarChart3 },
];

const PATIENTS_TAB: { key: NavKey; label: string; icon: typeof Stethoscope } = {
  key: "patients",
  label: "Patients",
  icon: Users,
};

export function CommandBar({ active, onNavigate, onNewConsultation, showPatients = false }: CommandBarProps) {
  const { user, logout } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const tabs = showPatients
    ? [BASE_TABS[0], PATIENTS_TAB, ...BASE_TABS.slice(1)]
    : BASE_TABS;

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4 shrink-0">
        <div className="flex items-center h-[4.5rem] px-4 gap-1.5 rounded-2xl glass">
          {/* Brand */}
          <button
            onClick={() => onNavigate("console")}
            className="flex items-center gap-2.5 pr-4 mr-1.5 h-full shrink-0 cursor-pointer"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md shadow-teal-500/25">
              <Activity className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight hidden sm:inline text-foreground">
              PolyScribe
            </span>
          </button>

          {/* Tabs: desktop only, palette covers everything on mobile */}
          <nav className="hidden md:flex items-center h-full gap-1.5">
            {tabs.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onNavigate(tab.key)}
                  className={`relative flex items-center gap-2 h-11 px-4 rounded-xl text-base font-semibold cursor-pointer transition-colors duration-300 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-tab-bg"
                      className="absolute inset-0 rounded-xl bg-gradient-brand shadow-sm shadow-teal-500/25"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <tab.icon className="h-4.5 w-4.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Live indicator */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-primary px-3 mr-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <Radio className="h-2.5 w-2.5 relative text-primary" />
            </span>
            Live
          </div>

          {/* Command palette trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2.5 h-11 px-4 rounded-xl bg-white/60 border border-white/50 text-muted-foreground hover:text-foreground hover:bg-white/80 transition-colors duration-300 text-base cursor-pointer mr-1.5"
          >
            <Search className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-xs rounded-md bg-black/5 px-2 py-1 ml-1">⌘K</kbd>
          </button>

          {/* New consultation */}
          <Button
            onClick={onNewConsultation}
            className="h-11 gap-1.5 rounded-xl text-base font-semibold px-4 mr-2.5"
          >
            <Plus className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">New</span>
          </Button>

          {/* User */}
          {user && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/50 h-full">
              <Avatar name={user.name} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-muted-foreground truncate max-w-[120px]">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground rounded-xl h-10 w-10"
              >
                <LogOut className="h-4.5 w-4.5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNavigate={onNavigate}
        onNewConsultation={onNewConsultation}
        showPatients={showPatients}
      />
    </>
  );
}
