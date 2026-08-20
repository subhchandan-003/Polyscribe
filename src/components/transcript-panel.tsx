"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

/* Pre-computed widths — no Math.random() on render */
const SKELETON_WIDTHS = ["95%", "72%", "88%", "65%", "80%", "92%", "70%", "85%"];

interface TranscriptPanelProps {
  transcript: string | null;
  isLoading: boolean;
}

export function TranscriptPanel({ transcript, isLoading }: TranscriptPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <h2 className="text-sm font-bold text-foreground">
            Transcript
          </h2>
        </div>

        {/* Skeleton lines */}
        <div className="flex-1 space-y-3">
          {SKELETON_WIDTHS.map((w, i) => (
            <div key={i} className="relative h-3.5 rounded-full bg-muted overflow-hidden animate-shimmer" style={{ width: w }} />
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
          Diarizing &amp; cleaning with Claude…
        </p>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40">
        <p className="text-sm">Transcript will appear here after recording</p>
      </div>
    );
  }

  /* ── Render the formatted transcript, highlighting Speaker: labels ── */
  const lines = transcript.split("\n");

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h2 className="text-sm font-bold text-foreground">
          Transcript
        </h2>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-3">
          {lines.map((line, i) => {
            const doctorMatch = line.match(/^(Doctor):(.*)$/i);
            const patientMatch = line.match(/^(Patient):(.*)$/i);

            if (doctorMatch) {
              return (
                <div key={i} className="flex gap-2.5">
                  <span className="shrink-0 text-[10px] font-bold text-primary-foreground bg-gradient-brand rounded-full px-2.5 py-1 h-fit mt-0.5">
                    Dr
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85 pt-0.5">
                    {doctorMatch[2].trim()}
                  </p>
                </div>
              );
            }

            if (patientMatch) {
              return (
                <div key={i} className="flex gap-2.5">
                  <span className="shrink-0 text-[10px] font-bold text-secondary-foreground bg-secondary rounded-full px-2.5 py-1 h-fit mt-0.5">
                    Pt
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85 pt-0.5">
                    {patientMatch[2].trim()}
                  </p>
                </div>
              );
            }

            /* Meta lines (language detection, blank lines) */
            if (!line.trim()) return <div key={i} className="h-2" />;

            return (
              <p key={i} className="text-xs text-muted-foreground/70 italic">
                {line}
              </p>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
