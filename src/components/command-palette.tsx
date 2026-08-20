"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Stethoscope,
  History,
  Sparkles,
  BarChart3,
  CreditCard,
  Presentation,
  Plus,
  LogOut,
  CornerDownLeft,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { NavKey } from "./command-bar";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (key: NavKey) => void;
  onNewConsultation: () => void;
}

interface Action {
  id: string;
  label: string;
  group: string;
  icon: typeof Stethoscope;
  run: () => void;
}

export function CommandPalette({ open, onOpenChange, onNavigate, onNewConsultation }: CommandPaletteProps) {
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(
    () => [
      { id: "new", label: "New Consultation", group: "Action", icon: Plus, run: onNewConsultation },
      { id: "console", label: "Go to Console", group: "Navigate", icon: Stethoscope, run: () => onNavigate("console") },
      { id: "history", label: "Go to Session History", group: "Navigate", icon: History, run: () => onNavigate("history") },
      { id: "demo", label: "Go to Try Demo", group: "Navigate", icon: Sparkles, run: () => onNavigate("demo") },
      { id: "dashboard", label: "Go to Dashboard", group: "Navigate", icon: BarChart3, run: () => onNavigate("dashboard") },
      { id: "pricing", label: "Go to Pricing", group: "Navigate", icon: CreditCard, run: () => onNavigate("pricing") },
      { id: "pitch", label: "Go to Pitch", group: "Navigate", icon: Presentation, run: () => onNavigate("pitch") },
      { id: "logout", label: "Log Out", group: "Action", icon: LogOut, run: logout },
    ],
    [onNavigate, onNewConsultation, logout]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  // Global Cmd/Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runAndClose = (action: Action) => {
    action.run();
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = filtered[activeIndex];
      if (action) runAndClose(action);
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl glass-strong overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2.5 px-4 h-13 py-3 border-b border-white/40">
              <Search className="h-4 w-4 text-primary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
              />
              <kbd className="text-[10px] text-muted-foreground/60 rounded-md bg-black/5 px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2 px-2">
              {filtered.length === 0 && (
                <p className="px-3.5 py-6 text-center text-xs text-muted-foreground">
                  No matching command
                </p>
              )}
              {filtered.map((action, i) => {
                const showGroupLabel = action.group !== lastGroup;
                lastGroup = action.group;
                return (
                  <div key={action.id}>
                    {showGroupLabel && (
                      <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                        {action.group}
                      </p>
                    )}
                    <button
                      onClick={() => runAndClose(action)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left cursor-pointer transition-colors duration-150 ${
                        i === activeIndex ? "bg-gradient-brand text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      <action.icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1">{action.label}</span>
                      {i === activeIndex && <CornerDownLeft className="h-3 w-3 opacity-70" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
