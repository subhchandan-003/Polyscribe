"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConsentGateProps {
  onConsent: () => void;
}

export function ConsentGate({ onConsent }: ConsentGateProps) {
  const [checked, setChecked] = useState(false);

  return (
    <Card className="w-full max-w-md p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Patient Consent Required</h3>
          <p className="text-[11px] text-muted-foreground">
            Before starting the recording
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
        <p>
          PolyScribe will record this consultation to generate a clinical SOAP
          note. Please ensure the following:
        </p>
        <ul className="space-y-1.5 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            The patient has been verbally informed that the conversation will be
            recorded
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Audio is processed in-memory only and deleted immediately after
            transcription
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Only the structured SOAP note is saved — no raw audio is retained
          </li>
        </ul>
      </div>

      {/* Compliance badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
          🇮🇳 DPDP Act 2023
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
          🇸🇬 PDPA
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
          🔒 No audio persistence
        </span>
      </div>

      {/* Consent checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-[oklch(0.65_0.15_180)]"
        />
        <span className="text-sm text-foreground/80 leading-snug group-hover:text-foreground transition-colors">
          Patient has been informed and consented to recording this consultation
        </span>
      </label>

      {/* Warning if not checked */}
      {!checked && (
        <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-500/5 px-3 py-2 rounded-md">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Consent must be confirmed before recording can begin
        </div>
      )}

      <Button
        onClick={onConsent}
        disabled={!checked}
        className="w-full"
      >
        <ShieldCheck className="h-4 w-4 mr-2" />
        Confirm Consent &amp; Continue
      </Button>
    </Card>
  );
}
