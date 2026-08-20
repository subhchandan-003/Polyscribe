"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { FileText, Clock, Globe, Shield, Heart, Sparkles, Mic, Languages } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/* ── Decorative floating blob — pure CSS, no images ── */
function Blob({
  className,
  delay = "0s",
}: {
  className: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className} animate-float`}
      style={{ animationDelay: delay }}
    />
  );
}

/* ── Stat card ── */
function HealthCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accent: string;
  delay: string;
}) {
  return (
    <Card
      className="stagger-child p-5 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative"
      style={{ animationDelay: delay }}
    >
      {/* Soft tinted bg blob */}
      <div
        className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-20 ${accent}`}
      />
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${accent} bg-opacity-20`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-foreground/70 mt-0.5">{label}</p>
      <p className="text-[11px] text-muted-foreground mt-1 truncate">{sub}</p>
    </Card>
  );
}

export function PatientDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="patient-portal-bg min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">

        {/* ─────────────────────────────────────────────
            WELCOME HERO
        ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 text-white p-8 mb-6 animate-fade-scale-in">
          {/* Decorative blobs */}
          <Blob className="h-40 w-40 bg-white/10 -top-10 -right-10" delay="0s" />
          <Blob className="h-24 w-24 bg-white/8  bottom-2  -right-4"  delay="1.2s" />
          <Blob className="h-16 w-16 bg-white/12 top-4    left-1/2"   delay="0.6s" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100/80 text-sm font-medium mb-1">
                {greeting},
              </p>
              <h2 className="font-heading text-2xl font-bold tracking-tight">{firstName}</h2>
              <p className="text-emerald-100/70 text-sm mt-2 max-w-xs leading-relaxed">
                Your health story, beautifully organized and always private.
              </p>
            </div>

            {/* Animated health icon */}
            <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/15 items-center justify-center shrink-0 backdrop-blur-sm animate-pulse-gentle">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Bottom sparkle row */}
          <div className="relative z-10 flex items-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/15 text-white/90 rounded-full px-3 py-1 backdrop-blur-sm">
              <Shield className="h-3 w-3" />
              End-to-end encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/15 text-white/90 rounded-full px-3 py-1 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              DPDP Act 2023 compliant
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            STATS ROW
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <HealthCard
            icon={FileText}
            label="Consultation Notes"
            value="0"
            sub="Records shared by your doctor"
            accent="bg-emerald-500 text-emerald-700"
            delay="0.05s"
          />
          <HealthCard
            icon={Clock}
            label="Last Visit"
            value="—"
            sub="No visits recorded yet"
            accent="bg-teal-500 text-teal-700"
            delay="0.12s"
          />
          <HealthCard
            icon={Globe}
            label="Languages"
            value="—"
            sub="Multilingual consultations"
            accent="bg-cyan-500 text-cyan-700"
            delay="0.19s"
          />
        </div>

        {/* ─────────────────────────────────────────────
            HOW IT WORKS — real journey, colorful step badges
        ───────────────────────────────────────────── */}
        <Card className="rounded-2xl p-6 mb-6 animate-fade-scale-in" style={{ animationDelay: "0.18s" }}>
          <h3 className="text-sm font-semibold text-foreground tracking-tight mb-5">
            How your notes reach you
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Mic, bg: "bg-sky-100", text: "text-sky-600", title: "Consultation recorded", desc: "Your doctor records the visit with your consent" },
              { icon: Languages, bg: "bg-violet-100", text: "text-violet-600", title: "AI structures the note", desc: "Transcribed and organized into a clinical SOAP note" },
              { icon: Heart, bg: "bg-emerald-100", text: "text-emerald-600", title: "Shared with you", desc: "The finished note appears here, private to you" },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-2.5">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${step.bg} ${step.text}`}>
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
        <Card className="rounded-2xl border-emerald-100/60 shadow-sm overflow-hidden animate-fade-scale-in" style={{ animationDelay: "0.22s" }}>
          {/* Card header */}
          <div className="px-6 pt-5 pb-4 border-b border-emerald-50">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Recent Consultations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notes shared by your doctor after each visit
            </p>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Animated icon */}
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 animate-pulse-gentle">
              <Heart className="h-8 w-8 text-emerald-400" />
            </div>

            <p className="text-sm font-medium text-foreground/70">
              No consultation records yet
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
              After each consultation, your doctor will generate and share
              structured notes here. They will always be private to you.
            </p>

            {/* Reassurance chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { icon: Shield, text: "Private by default" },
                { icon: FileText, text: "Structured clinical notes" },
                { icon: Globe, text: "Multilingual support" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1"
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
      <footer className="border-t border-emerald-100/50 py-4 mt-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          PolyScribe protects your health data under India&apos;s DPDP Act 2023
        </div>
      </footer>
    </div>
  );
}
