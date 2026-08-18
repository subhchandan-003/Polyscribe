"use client";

import {
  FileText,
  LogOut,
  Stethoscope,
  Heart,
  CreditCard,
  BarChart3,
  Presentation,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();
  const isPatient = user?.role === "patient";

  /* ── Doctor header ── */
  if (!isPatient) {
    return (
      <header className="border-b border-border/50 bg-card/90 backdrop-blur-md sticky top-0 z-50">
        {/* Thin clinical accent bar at top */}
        <div className="h-[2px] bg-gradient-to-r from-teal-500/80 via-teal-400/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm shadow-teal-200/60">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-base font-semibold tracking-tight leading-none text-foreground">
                  PolyScribe
                </h1>
                <p className="text-[10px] text-teal-600/70 mt-0.5 tracking-wide font-medium">
                  Clinical Documentation
                </p>
              </div>
            </button>

            {/* Nav links — doctor only */}
            {user?.role === "doctor" && onNavigate && (
              <nav className="hidden md:flex items-center gap-0.5 ml-4 border-l border-border/60 pl-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("dashboard")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2.5"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("pricing")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2.5"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("pitch")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2.5"
                >
                  <Presentation className="h-3.5 w-3.5" />
                  Pitch
                </Button>
              </nav>
            )}
          </div>

          {/* Right: user info */}
          <div className="flex items-center gap-2.5">
            {user && (
              <>
                {/* ECG micro-indicator */}
                <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-teal-600/70 font-medium bg-teal-50/80 border border-teal-100 rounded-md px-2.5 py-1">
                  <Activity className="h-3 w-3" />
                  Active Session
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center">
                    <Stethoscope className="h-4 w-4 text-teal-700" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-[10px] text-teal-600/70 mt-0.5 font-medium">
                      Doctor Portal
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  /* ── Patient header ── */
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/60">
      {/* Warm accent bar */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-400/80 via-teal-400/50 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200/60">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight leading-none">
              PolyScribe
            </h1>
            <p className="text-[10px] text-emerald-600/70 mt-0.5 font-medium tracking-wide">
              Your Health Records
            </p>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2.5">
            {/* Privacy chip */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
              <Heart className="h-3 w-3 animate-pulse-gentle" />
              Private &amp; Secure
            </span>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                <Heart className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-[10px] text-emerald-600/70 mt-0.5 font-medium">
                  Patient Portal
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="hidden md:flex text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100"
            >
              Patient Portal
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
