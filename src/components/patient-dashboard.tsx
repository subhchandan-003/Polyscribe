"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Globe, Shield, Heart, Mic, Languages, LogOut, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function computeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Stat card ── */
function HealthCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-5 relative overflow-hidden stat-card-accent">
      <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center mb-3">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-foreground/80 mt-0.5">{label}</p>
      <p className="text-[11px] text-muted-foreground mt-1 truncate">{sub}</p>
    </Card>
  );
}

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const [greeting] = useState(computeGreeting);
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="gradient-mesh" />

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 px-3 pt-3 shrink-0">
        <div className="max-w-4xl mx-auto w-full h-14 flex items-center px-4 rounded-2xl glass">
          <div className="h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md shadow-teal-500/25 mr-2.5">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-[15px] font-bold tracking-tight">PolyScribe</span>
          <span className="ml-2.5 text-[10px] font-semibold text-primary rounded-full bg-accent px-2 py-0.5">
            Patient
          </span>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">{user.name}</span>
              <Button variant="ghost" size="icon-sm" onClick={logout} className="text-muted-foreground hover:text-foreground rounded-xl">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* ─────────────────────────────────────────────
            WELCOME
        ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-7 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {greeting},
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              <span className="text-gradient-brand">{firstName}</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md leading-relaxed">
              Your health story, organized and always private.
            </p>

            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary rounded-full bg-accent px-3 py-1.5">
                <Shield className="h-3 w-3" />
                End-to-end encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary rounded-full bg-accent px-3 py-1.5">
                DPDP Act 2023 compliant
              </span>
            </div>
          </Card>
        </motion.div>

        {/* ─────────────────────────────────────────────
            STATS ROW
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <HealthCard
            icon={FileText}
            label="Consultation Notes"
            value="0"
            sub="Records shared by your doctor"
          />
          <HealthCard
            icon={Clock}
            label="Last Visit"
            value="N/A"
            sub="No visits recorded yet"
          />
          <HealthCard
            icon={Globe}
            label="Languages"
            value="N/A"
            sub="Multilingual consultations"
          />
        </div>

        {/* ─────────────────────────────────────────────
            HOW IT WORKS
        ───────────────────────────────────────────── */}
        <Card className="p-6 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-5">
            How your notes reach you
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Consultation recorded", desc: "Your doctor records the visit with your consent" },
              { icon: Languages, title: "AI structures the note", desc: "Transcribed and organized into a clinical SOAP note" },
              { icon: Heart, title: "Shared with you", desc: "The finished note appears here, private to you" },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-2.5">
                <div className="h-12 w-12 rounded-2xl bg-accent text-primary flex items-center justify-center">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ─────────────────────────────────────────────
            RECORDS LIST
        ───────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-border/60">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent Consultations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notes shared by your doctor after each visit
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>

            <p className="text-sm font-medium text-foreground/80">
              No consultation records yet
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
              After each consultation, your doctor will generate and share
              structured notes here. They will always be private to you.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { icon: Shield, text: "Private by default" },
                { icon: FileText, text: "Structured clinical notes" },
                { icon: Globe, text: "Multilingual support" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground rounded-full bg-muted/70 px-2.5 py-1.5"
                >
                  <Icon className="h-3 w-3" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 mt-4 relative">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          PolyScribe protects your health data under India&apos;s DPDP Act 2023
        </div>
      </footer>
    </div>
  );
}
