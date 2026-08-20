"use client";

import { useState } from "react";
import {
  FileText,
  Stethoscope,
  History,
  Sparkles,
  BarChart3,
  CreditCard,
  Presentation,
  Plus,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export type NavKey =
  | "console"
  | "history"
  | "demo"
  | "dashboard"
  | "pricing"
  | "pitch";

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewConsultation: () => void;
}

const CONSOLE_ITEMS: { key: NavKey; label: string; icon: typeof Stethoscope }[] = [
  { key: "console", label: "Console", icon: Stethoscope },
  { key: "history", label: "Session History", icon: History },
  { key: "demo", label: "Try Demo", icon: Sparkles },
];

const BUSINESS_ITEMS: { key: NavKey; label: string; icon: typeof Stethoscope }[] = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "pricing", label: "Pricing", icon: CreditCard },
  { key: "pitch", label: "Pitch", icon: Presentation },
];

function NavList({
  active,
  onSelect,
}: {
  active: NavKey;
  onSelect: (key: NavKey) => void;
}) {
  const renderGroup = (
    items: typeof CONSOLE_ITEMS,
    label: string
  ) => (
    <div>
      <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <nav className="flex flex-col gap-5">
      {renderGroup(CONSOLE_ITEMS, "Consultation")}
      {renderGroup(BUSINESS_ITEMS, "Business")}
    </nav>
  );
}

function SidebarBody({
  active,
  onNavigate,
  onNewConsultation,
}: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm shadow-teal-200/60">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-sm font-semibold tracking-tight leading-none">PolyScribe</h1>
          <p className="text-[10px] text-teal-600/70 mt-0.5 tracking-wide font-medium">
            Clinical Documentation
          </p>
        </div>
      </div>

      {/* New consultation CTA */}
      <div className="px-3 mb-5">
        <Button
          onClick={onNewConsultation}
          className="w-full gap-1.5 justify-center bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-200/60"
        >
          <Plus className="h-4 w-4" />
          New Consultation
        </Button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3">
        <NavList active={active} onSelect={onNavigate} />
      </div>

      {/* Footer: active session + user + compliance */}
      <div className="shrink-0 px-3 pb-4 pt-3 border-t border-border/50 space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] text-teal-600/70 font-medium bg-teal-50/80 border border-teal-100 rounded-md px-2.5 py-1.5">
          <Activity className="h-3 w-3" />
          Active Session
        </div>

        {user && (
          <div className="flex items-center gap-2 px-1">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shrink-0 shadow-sm shadow-teal-200/60">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate leading-none">{user.name}</p>
              <p className="text-[10px] text-teal-600/70 mt-0.5 font-medium">Doctor Portal</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground/70 px-1 leading-relaxed">
          DPDP Act 2023 · PDPA compliant — audio never stored
        </p>
      </div>
    </div>
  );
}

const BOTTOM_NAV_ITEMS: { key: NavKey; label: string; icon: typeof Stethoscope }[] = [
  { key: "console", label: "Console", icon: Stethoscope },
  { key: "history", label: "History", icon: History },
  { key: "demo", label: "Demo", icon: Sparkles },
  { key: "dashboard", label: "Stats", icon: BarChart3 },
];

export function Sidebar(props: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-border/50 bg-card/60">
        <SidebarBody {...props} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-border/50 bg-card/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-teal-600 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">PolyScribe</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4.5 w-4.5" />
        </Button>
      </div>

      {/* Mobile floating bottom nav — icon-only for guaranteed fit on narrow screens */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center">
        <div className="flex items-center gap-1 bg-card/95 backdrop-blur-md border border-border/60 rounded-full shadow-lg shadow-black/10 px-1.5 py-1.5">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = props.active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => props.onNavigate(item.key)}
                aria-label={item.label}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isActive ? "bg-teal-600 text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
              </button>
            );
          })}
          <button
            onClick={props.onNewConsultation}
            aria-label="New Consultation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm shadow-teal-300/50 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in-up"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card shadow-xl flex flex-col">
            <div className="flex items-center justify-end px-3 h-14 shrink-0 border-b border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarBody
                {...props}
                onNavigate={(key) => {
                  props.onNavigate(key);
                  setMobileOpen(false);
                }}
                onNewConsultation={() => {
                  props.onNewConsultation();
                  setMobileOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
