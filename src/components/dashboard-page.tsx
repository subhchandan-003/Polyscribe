"use client";

import { useState } from "react";
import { getSessions } from "@/lib/sessions";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS } from "@/lib/specialty-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Clock,
  Globe,
  TrendingUp,
  Stethoscope,
  BarChart3,
} from "lucide-react";

interface DashboardPageProps {
  onBack: () => void;
}

interface Stats {
  totalNotes: number;
  totalTimeSaved: number;
  totalDuration: number;
  languagesUsed: string[];
  specialtyBreakdown: Record<string, number>;
  notesThisWeek: number;
  avgDuration: number;
}

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
  ta: "Tamil",
  gu: "Gujarati",
  ur: "Urdu",
  kn: "Kannada",
  ml: "Malayalam",
  or: "Odia",
  pa: "Punjabi",
  as: "Assamese",
  mai: "Maithili",
  sat: "Santali",
  ks: "Kashmiri",
  ne: "Nepali",
  sd: "Sindhi",
  kok: "Konkani",
  doi: "Dogri",
  mni: "Manipuri",
  brx: "Bodo",
  sa: "Sanskrit",
};

function computeStats(): Stats {
  const sessions = getSessions();
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const langs = new Set<string>();
  const specBreakdown: Record<string, number> = {};
  let totalDur = 0;
  let notesWeek = 0;

  sessions.forEach((s) => {
    s.inputLanguages.forEach((l) => langs.add(l));
    if (s.outputLanguage && s.outputLanguage !== "auto") langs.add(s.outputLanguage);
    specBreakdown[s.specialty] = (specBreakdown[s.specialty] || 0) + 1;
    if (s.duration) totalDur += s.duration;
    if (s.timestamp >= weekAgo) notesWeek++;
  });

  // Estimate 3 min saved per note (from PRD metric)
  const timeSaved = sessions.length * 3;

  return {
    totalNotes: sessions.length,
    totalTimeSaved: timeSaved,
    totalDuration: totalDur,
    languagesUsed: Array.from(langs),
    specialtyBreakdown: specBreakdown,
    notesThisWeek: notesWeek,
    avgDuration: sessions.length > 0 ? Math.round(totalDur / sessions.length) : 0,
  };
}

export function DashboardPage({ onBack }: DashboardPageProps) {
  const [stats] = useState<Stats>(computeStats);

  const statCards = [
    {
      label: "Notes Generated",
      value: stats.totalNotes,
      sub: `${stats.notesThisWeek} this week`,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Time Saved",
      value: `${stats.totalTimeSaved}m`,
      sub: `≈ ${(stats.totalTimeSaved / 60).toFixed(1)} hours total`,
      icon: Clock,
      color: "text-sky-500",
    },
    {
      label: "Languages Used",
      value: stats.languagesUsed.length,
      sub: stats.languagesUsed.map((l) => LANG_NAMES[l] || l).join(", ") || "—",
      icon: Globe,
      color: "text-violet-500",
    },
    {
      label: "Avg. Consultation",
      value: stats.avgDuration > 0 ? `${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s` : "—",
      sub: `${stats.totalNotes} sessions recorded`,
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aggregated stats across all sessions
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label} className="relative p-5 card-hover-lift stat-card-accent overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl bg-accent flex items-center justify-center ${s.color}`}>
                <s.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="font-heading text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Specialty breakdown + Impact estimate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Specialty breakdown */}
        <Card className="p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Notes by Specialty
          </h3>
          {Object.keys(stats.specialtyBreakdown).length === 0 ? (
            <p className="text-sm text-muted-foreground/50 py-8 text-center">
              No sessions yet
            </p>
          ) : (
            <div className="space-y-3.5">
              {SPECIALTIES.map((spec) => {
                const count = stats.specialtyBreakdown[spec.id] || 0;
                if (count === 0) return null;
                const pct =
                  stats.totalNotes > 0
                    ? Math.round((count / stats.totalNotes) * 100)
                    : 0;
                const Icon = SPECIALTY_ICONS[spec.id];
                return (
                  <div key={spec.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 font-medium">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {spec.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Impact estimate */}
        <Card className="p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projected Impact
          </h3>
          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-primary/8">
              <p className="text-xs text-muted-foreground mb-1">
                If used for 40 patients/day (Dr. Priya persona)
              </p>
              <p className="font-heading text-2xl font-bold text-primary">2.5 hours</p>
              <p className="text-xs text-muted-foreground">saved per day on documentation</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-500/8">
              <p className="text-xs text-muted-foreground mb-1">
                Annual time reclaimed
              </p>
              <p className="font-heading text-2xl font-bold text-sky-500">625 hours</p>
              <p className="text-xs text-muted-foreground">≈ 26 full days of documentation eliminated</p>
            </div>
            <div className="p-4 rounded-xl bg-violet-500/8">
              <p className="text-xs text-muted-foreground mb-1">
                At India Pro pricing (₹3,500/mo)
              </p>
              <p className="font-heading text-2xl font-bold text-violet-500">₹70</p>
              <p className="text-xs text-muted-foreground">per consultation — less than the cost of a chai</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
