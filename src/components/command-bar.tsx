"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Stethoscope,
  History,
  Sparkles,
  BarChart3,
  Plus,
  LogOut,
  Search,
  Radio,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";

export type NavKey =
  | "console"
  | "history"
  | "demo"
  | "dashboard"
  | "pricing"
  | "pitch";

interface CommandBarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewConsultation: () => void;
}

const TABS: { key: NavKey; label: string; icon: typeof Stethoscope }[] = [
  { key: "console", label: "Console", icon: Stethoscope },
  { key: "history", label: "History", icon: History },
  { key: "demo", label: "Demo", icon: Sparkles },
  { key: "dashboard", label: "Stats", icon: BarChart3 },
];

export function CommandBar({ active, onNavigate, onNewConsultation }: CommandBarProps) {
  const { user, logout } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 shrink-0">
        <div className="flex items-center h-14 px-3 gap-1 rounded-2xl glass">
          {/* Brand */}
          <button
            onClick={() => onNavigate("console")}
            className="flex items-center gap-2 pr-3 mr-1 h-full shrink-0 cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md shadow-teal-500/25">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-[15px] font-bold tracking-tight hidden sm:inline text-foreground">
              PolyScribe
            </span>
          </button>

          {/* Tabs — desktop only, palette covers everything on mobile */}
          <nav className="hidden md:flex items-center h-full gap-1">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onNavigate(tab.key)}
                  className={`relative flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors duration-300 ${
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
                  <tab.icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Live indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-primary px-2.5 mr-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <Radio className="h-2 w-2 relative text-primary" />
            </span>
            Live
          </div>

          {/* Command palette trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-xl bg-white/60 border border-white/50 text-muted-foreground hover:text-foreground hover:bg-white/80 transition-colors duration-300 text-xs cursor-pointer mr-1"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] rounded-md bg-black/5 px-1.5 py-0.5 ml-1">⌘K</kbd>
          </button>

          {/* New consultation */}
          <Button
            onClick={onNewConsultation}
            size="sm"
            className="h-9 gap-1 rounded-xl text-xs font-semibold mr-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </Button>

          {/* User */}
          {user && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/50 h-full">
              <span className="hidden sm:block text-xs font-medium text-muted-foreground truncate max-w-[100px]">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground rounded-xl"
              >
                <LogOut className="h-3.5 w-3.5" />
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
      />
    </>
  );
}
