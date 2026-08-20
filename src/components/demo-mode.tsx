"use client";

import { useState } from "react";
import { Play, Sparkles, Globe, Clock, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_CASES, type DemoCase } from "@/lib/demo-transcripts";
import { SPECIALTY_ICONS } from "@/lib/specialty-icons";

interface DemoModeProps {
  onRunDemo: (demoCase: DemoCase) => void;
  onBack: () => void;
  isProcessing: boolean;
}

const SPECIALTY_LABELS: Record<string, string> = {
  general: "General Practice",
  cardiology: "Cardiology",
  pediatrics: "Pediatrics",
  ent: "ENT",
  dermatology: "Dermatology",
};

export function DemoMode({ onRunDemo, onBack, isProcessing }: DemoModeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary text-xs font-semibold px-3.5 py-1.5 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Demo Mode
        </div>
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">
          Try <span className="text-gradient-brand">PolyScribe</span> Instantly
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Select a sample consultation below. PolyScribe will process the
          pre-recorded transcript through the full pipeline: cleanup, diarization,
          and SOAP note generation.
        </p>
      </div>

      <div className="grid gap-4">
        {DEMO_CASES.map((demo) => {
          const SpecIcon = SPECIALTY_ICONS[demo.specialty];
          return (
          <Card
            key={demo.id}
            className={`p-5 cursor-pointer card-hover-lift ring-2 ${
              selected === demo.id
                ? "ring-primary/50 bg-accent/30"
                : "ring-transparent"
            }`}
            onClick={() => setSelected(demo.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="h-11 w-11 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
                    <SpecIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground truncate">
                    {demo.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {demo.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Globe className="h-3 w-3" />
                    {demo.language}
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <SpecIcon className="h-3 w-3" />
                    {SPECIALTY_LABELS[demo.specialty]}
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {demo.duration}
                  </Badge>
                </div>
              </div>
              {selected === demo.id && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunDemo(demo);
                  }}
                  disabled={isProcessing}
                  className="gap-1.5 shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  Run Demo
                </Button>
              )}
            </div>
          </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-md mx-auto">
        Demo transcripts are synthetic examples. No real patient data is used.
        The full Claude AI pipeline runs on each demo exactly as it would on a live recording.
      </p>
    </div>
  );
}
