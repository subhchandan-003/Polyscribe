"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ProcessingOverlayProps {
  stage: "transcribing" | "structuring";
}

export function ProcessingOverlay({ stage }: ProcessingOverlayProps) {
  const isTranscribing = stage === "transcribing";

  return (
    <div className="flex flex-col items-center gap-7 py-12 animate-fade-in-up">
      {/* ECG / SOAP animated graphic */}
      <div className="relative w-80 h-24 overflow-hidden rounded-2xl glass">
        {/* ECG path */}
        <svg
          viewBox="0 0 200 50"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ecg-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.72 0.16 158)" />
              <stop offset="100%" stopColor="oklch(0.62 0.14 195)" />
            </linearGradient>
          </defs>
          <path
            d="M0,25 L30,25 L35,25 L40,10 L45,40 L50,5 L55,45 L60,25 L65,25 L100,25 L105,25 L110,15 L115,35 L120,8 L125,42 L130,25 L135,25 L200,25"
            fill="none"
            stroke="url(#ecg-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-ecg"
          />
        </svg>

        {/* Stage label */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wide">
            {isTranscribing ? "Diarization" : "SOAP Structuring"}
          </span>
          <span className="text-[10px] font-semibold text-primary/80">
            Claude AI
          </span>
        </div>
      </div>

      {/* Status row */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-sm font-semibold text-foreground/85">
            {isTranscribing
              ? "Cleaning & diarizing transcript…"
              : "Structuring SOAP note…"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground/70">
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
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={step.active ? { scale: [1, 1.35, 1] } : {}}
                transition={{ duration: 1.2, repeat: step.active ? Infinity : 0 }}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  step.done
                    ? "bg-primary"
                    : step.active
                      ? "bg-primary/70"
                      : "bg-muted-foreground/20"
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  step.done || step.active
                    ? "text-primary"
                    : "text-muted-foreground/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < 3 && (
              <div
                className={`h-0.5 w-6 -mt-4 rounded-full transition-colors duration-300 ${
                  step.done ? "bg-primary/50" : "bg-muted-foreground/15"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
