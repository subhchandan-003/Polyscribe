"use client";

import { useState } from "react";
import { Play, Sparkles, Stethoscope, Globe, Clock, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_CASES, type DemoCase } from "@/lib/demo-transcripts";

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
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Demo Mode
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Try PolyScribe Instantly
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Select a sample consultation below. PolyScribe will process the
          pre-recorded transcript through the full pipeline — cleanup, diarization,
          and SOAP note generation.
        </p>
      </div>

      <div className="grid gap-4">
        {DEMO_CASES.map((demo) => (
          <Card
            key={demo.id}
            className={`p-5 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${
              selected === demo.id
                ? "ring-2 ring-primary border-primary/50 shadow-md"
                : ""
            }`}
            onClick={() => setSelected(demo.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{demo.flag}</span>
                  <h3 className="font-semibold text-foreground truncate">
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
                    <Stethoscope className="h-3 w-3" />
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
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-md mx-auto">
        Demo transcripts are synthetic examples. No real patient data is used.
        The full Claude AI pipeline runs on each demo exactly as it would on a live recording.
      </p>
    </div>
  );
}
