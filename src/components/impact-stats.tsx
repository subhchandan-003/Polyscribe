"use client";

import { useState } from "react";
import { getSessions } from "@/lib/sessions";
import { useAuth } from "@/lib/auth-context";
import { FileText, Clock, CalendarCheck } from "lucide-react";

function computeStats(userId: string): Stats {
  const sessions = getSessions(userId);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    notes: sessions.length,
    timeSavedMinutes: sessions.length * 3,
    thisWeek: sessions.filter((s) => s.timestamp >= weekAgo).length,
  };
}

interface Stats {
  notes: number;
  timeSavedMinutes: number;
  thisWeek: number;
}

const ITEMS = [
  { key: "notes" as const, icon: FileText, label: "Notes Generated", format: (s: Stats) => `${s.notes}` },
  { key: "timeSaved" as const, icon: Clock, label: "Time Saved", format: (s: Stats) => `${s.timeSavedMinutes}m` },
  { key: "thisWeek" as const, icon: CalendarCheck, label: "This Week", format: (s: Stats) => `${s.thisWeek}` },
];

/** Compact real-data stat strip. Mirrors the "10y+ / 30k+ / 4.9" pattern
 * seen on doctor-profile reference designs, but grounded in this doctor's
 * actual saved sessions. Hidden until there's at least one real session,
 * so a fresh account never shows a misleading row of zeros. */
export function ImpactStats() {
  const { user } = useAuth();
  const [stats] = useState<Stats>(() => computeStats(user?.id ?? ""));

  if (stats.notes === 0) return null;

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {ITEMS.map(({ key, icon: Icon, label, format }, i) => (
        <div key={key} className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold leading-none">{format(stats)}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide font-medium">{label}</p>
            </div>
          </div>
          {i < ITEMS.length - 1 && <div className="h-8 w-px bg-border/60" />}
        </div>
      ))}
    </div>
  );
}
