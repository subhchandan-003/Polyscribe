"use client";

import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  stage: "transcribing" | "structuring";
}

export function ProcessingOverlay({ stage }: ProcessingOverlayProps) {
  const isTranscribing = stage === "transcribing";

  return (
    <div className="flex flex-col items-center gap-7 py-12 animate-fade-in-up">
      {/* ECG / SOAP animated graphic */}
      <div className="relative w-72 h-20 overflow-hidden rounded-xl border border-border/50 bg-card">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0.4 0.1 185) 0px, transparent 1px, transparent 19px, oklch(0.4 0.1 185) 20px), repeating-linear-gradient(90deg, oklch(0.4 0.1 185) 0px, transparent 1px, transparent 19px, oklch(0.4 0.1 185) 20px)",
          }}
        />
        {/* ECG path */}
        <svg
          viewBox="0 0 200 50"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,25 L30,25 L35,25 L40,10 L45,40 L50,5 L55,45 L60,25 L65,25 L100,25 L105,25 L110,15 L115,35 L120,8 L125,42 L130,25 L135,25 L200,25"
            fill="none"
            stroke="oklch(0.62 0.16 185)"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="animate-ecg"
          />
        </svg>
        {/* Fade mask edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card pointer-events-none" />

        {/* Stage label */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="text-[9px] font-mono font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {isTranscribing ? "Diarization" : "SOAP Structuring"}
          </span>
          <span className="text-[9px] font-mono text-teal-500/60">
            Claude AI
          </span>
        </div>
      </div>

      {/* Status row */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-foreground/80">
            {isTranscribing
              ? "Cleaning & diarizing transcript…"
              : "Structuring SOAP note…"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground/60">
          {isTranscribing
            ? "Speaker diarization · Multilingual cleanup · Code-switching detection"
            : "Clinical documentation · Specialty-aware formatting · Medication extraction"}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {[
          { label: "Record", done: true },
          { label: "Transcribe", done: !isTranscribing, active: isTranscribing },
          { label: "SOAP", done: false, active: !isTranscribing },
          { label: "Done", done: false },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                  step.done
                    ? "bg-teal-500"
                    : step.active
                      ? "bg-teal-400 animate-pulse"
                      : "bg-muted-foreground/20"
                }`}
              />
              <span
                className={`text-[9px] font-medium transition-colors ${
                  step.done || step.active
                    ? "text-teal-600"
                    : "text-muted-foreground/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < 3 && (
              <div
                className={`h-px w-6 -mt-3 transition-colors duration-500 ${
                  step.done ? "bg-teal-400/60" : "bg-muted-foreground/15"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
