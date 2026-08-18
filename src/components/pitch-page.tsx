"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Globe, Zap, Target, TrendingUp, Users } from "lucide-react";

interface PitchPageProps {
  onBack: () => void;
}

export function PitchPage({ onBack }: PitchPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to console
        </Button>

        {/* Hero */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 text-xs">
            EthAum Venture Partners Hackathon — June 2026
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
            Every AI scribe is built for<br />
            <span className="text-primary">the wrong 400 million.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            PolyScribe is built for the other{" "}
            <span className="font-semibold text-foreground">5.5 billion</span>.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            The Problem
          </h2>
          <Card className="p-6 space-y-3">
            <p className="text-sm leading-relaxed text-foreground/85">
              Doctors in India, Southeast Asia, and the Middle East spend{" "}
              <span className="font-semibold">30–50% of their consultation
              time</span> on clinical documentation. Every well-funded AI scribe
              in the world — Abridge ($5.3B), Nuance DAX ($19.7B), Ambience,
              Freed, Nabla — is <span className="font-semibold">English-first
              and US-focused</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-center">
                <p className="text-lg font-bold text-destructive">English-only</p>
                <p className="text-[11px] text-muted-foreground">output layer in all competitors</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-center">
                <p className="text-lg font-bold text-destructive">No code-switching</p>
                <p className="text-[11px] text-muted-foreground">&ldquo;BP high hai, dawai lo&rdquo; breaks them</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-center">
                <p className="text-lg font-bold text-destructive">$100–250/mo</p>
                <p className="text-[11px] text-muted-foreground">unviable in emerging markets</p>
              </div>
            </div>
          </Card>
        </section>

        {/* The Solution */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            The Solution
          </h2>
          <Card className="p-6">
            <p className="text-lg font-semibold text-foreground mb-4 leading-snug">
              PolyScribe listens to doctor-patient conversations in{" "}
              <span className="text-primary">Hindi, Tamil, Mandarin, Malay,
              Arabic — or any mix of them</span> — and produces clean,
              structured SOAP notes in seconds.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Globe className="h-4 w-4 text-primary mb-1.5" />
                <p className="text-xs font-medium">10+ Languages</p>
                <p className="text-[10px] text-muted-foreground">Input and output in any language</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Zap className="h-4 w-4 text-primary mb-1.5" />
                <p className="text-xs font-medium">Code-switching native</p>
                <p className="text-[10px] text-muted-foreground">Hindi-English mid-sentence? No problem</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Users className="h-4 w-4 text-primary mb-1.5" />
                <p className="text-xs font-medium">5 Specialty Templates</p>
                <p className="text-[10px] text-muted-foreground">GP, Cardio, Peds, ENT, Derm</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <TrendingUp className="h-4 w-4 text-primary mb-1.5" />
                <p className="text-xs font-medium">From ₹1,500/mo</p>
                <p className="text-[10px] text-muted-foreground">5–10x cheaper than US alternatives</p>
              </div>
            </div>
          </Card>
        </section>

        {/* The Validation */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Validation
          </h2>
          <Card className="p-6 space-y-4">
            <blockquote className="border-l-2 border-primary pl-4 text-sm text-foreground/80 italic">
              SingHealth&apos;s Note Buddy has generated over 67,000 medical and
              administrative notes across SingHealth institutions, supporting
              5,000+ healthcare staff — validating demand decisively. But Note
              Buddy is an internal tool. It cannot be bought or deployed by any
              hospital in India, Indonesia, or the Middle East.
            </blockquote>
            <p className="text-sm text-foreground/80">
              A 2024{" "}
              <span className="font-semibold">NEJM Catalyst</span> study
              analyzed 303,000+ patient encounters: 81% of patients reported
              their physician spent less time looking at a screen when using AI
              scribes.
            </p>
          </Card>
        </section>

        {/* The Flywheel */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            The Flywheel
          </h2>
          <Card className="p-6">
            <div className="flex flex-col gap-3">
              {[
                { step: "1", text: "More doctors use PolyScribe" },
                { step: "2", text: "More multilingual consultation data" },
                { step: "3", text: "Better prompt tuning & specialty accuracy" },
                { step: "4", text: "Higher retention & word-of-mouth referrals" },
                { step: "5", text: "Faster geographic expansion at lower CAC" },
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{item.step}</span>
                  </div>
                  <p className="text-sm text-foreground/85">{item.text}</p>
                  {idx < 4 && (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Go-to-Market */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Go-to-Market
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-lg mb-1">🇸🇬</p>
              <p className="text-xs font-semibold mb-0.5">Singapore First</p>
              <p className="text-[10px] text-muted-foreground">
                5–10 pilot clinics via EthAum network (Parkway, Raffles, IHH)
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-lg mb-1">🇮🇳</p>
              <p className="text-xs font-semibold mb-0.5">India Second</p>
              <p className="text-[10px] text-muted-foreground">
                Tier-1 private clinics — Bangalore, Pune, Mumbai GP networks
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-lg mb-1">🌏</p>
              <p className="text-xs font-semibold mb-0.5">ASEAN & Gulf</p>
              <p className="text-[10px] text-muted-foreground">
                Malaysia, UAE, Saudi — Arabic & Malay code-switching markets
              </p>
            </Card>
          </div>
        </section>

        {/* Revenue Projection */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Revenue Trajectory
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-5 gap-3 text-center">
              {[
                { month: "M3", clinicians: "20", mrr: "$600" },
                { month: "M6", clinicians: "100", mrr: "$3.5K" },
                { month: "M12", clinicians: "500", mrr: "$18K" },
                { month: "M18", clinicians: "1,500", mrr: "$60K" },
                { month: "M24", clinicians: "3,500", mrr: "$150K" },
              ].map((d) => (
                <div key={d.month}>
                  <p className="text-[10px] text-muted-foreground mb-1">{d.month}</p>
                  <p className="text-sm font-bold text-primary">{d.mrr}</p>
                  <p className="text-[10px] text-muted-foreground">{d.clinicians} docs</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* The Ask */}
        <section className="mb-8">
          <Card className="p-8 bg-primary/5 border-primary/15 text-center">
            <h2 className="text-lg font-bold mb-2">The Ask</h2>
            <p className="text-sm text-foreground/80 max-w-md mx-auto leading-relaxed">
              PolyScribe is Singapore-positioned, India-priced, and
              multilingual-native. We&apos;re looking for pilot clinic
              introductions across EthAum&apos;s network and a seed investment
              to scale from MVP to 500 paying clinicians in 12 months.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
