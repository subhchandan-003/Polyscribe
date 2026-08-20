"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, Landmark, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConsentGateProps {
  onConsent: () => void;
}

export function ConsentGate({ onConsent }: ConsentGateProps) {
  const [checked, setChecked] = useState(false);

  return (
    <Card className="w-full max-w-3xl p-7 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-bold">Patient Consent Required</h3>
          <p className="text-xs text-muted-foreground">
            Before starting the recording
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          PolyScribe will record this consultation to generate a clinical SOAP
          note. Please ensure the following:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 ml-1">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            The patient has been verbally informed that the conversation will be
            recorded
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            Audio is processed in-memory only and deleted immediately after
            transcription
          </li>
          <li className="flex items-start gap-2 sm:col-span-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            Only the structured SOAP note is saved. No raw audio is retained
          </li>
        </ul>
      </div>

      {/* Compliance badges + consent checkbox, side by side on wider screens */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent text-xs font-medium text-secondary-foreground">
            <Landmark className="h-3 w-3" />
            DPDP Act 2023
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent text-xs font-medium text-secondary-foreground">
            <Lock className="h-3 w-3" />
            No audio persistence
          </span>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group flex-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <span className="text-sm text-foreground/80 leading-snug group-hover:text-foreground transition-colors">
            Patient has been informed and consented to recording this consultation
          </span>
        </label>
      </div>

      {/* Warning + submit, side by side on wider screens */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {!checked && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-600 rounded-xl bg-amber-500/10 px-3.5 py-2.5 sm:flex-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Consent must be confirmed before recording can begin
          </div>
        )}

        <Button
          onClick={onConsent}
          disabled={!checked}
          className={checked ? "w-full" : "w-full sm:w-auto sm:shrink-0"}
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          Confirm Consent &amp; Continue
        </Button>
      </div>
    </Card>
  );
}
