"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Copy,
  Check,
  Download,
  Printer,
  FileText,
  ClipboardList,
  Stethoscope as StethoscopeIcon,
} from "lucide-react";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";
import { SOAP_SECTIONS, buildNotePlainText, downloadNoteTxt, printNote } from "@/lib/note-export";
import type { Session } from "@/lib/sessions";

interface PatientNoteDetailProps {
  session: Session;
  onClose: () => void;
}

/* Friendlier reframing of the six SOAP sections for a patient audience,
 * shown by default instead of clinical jargon. */
const PLAIN_LABELS: Record<string, string> = {
  subjective: "What you told the doctor",
  objective: "What the doctor observed",
  assessment: "What we found",
  plan: "What to do next",
  medications: "Your medicines",
  followUp: "Follow-up",
};

export function PatientNoteDetail({ session, onClose }: PatientNoteDetailProps) {
  const [fullNote, setFullNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const spec = SPECIALTIES.find((s) => s.id === session.specialty);
  const Icon = spec ? SPECIALTY_ICONS[spec.id] : StethoscopeIcon;
  const colors = spec ? SPECIALTY_COLORS[spec.id] : { bg: "bg-accent", text: "text-primary", ring: "ring-primary/40" };

  const dateLabel = new Date(session.timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildNotePlainText(session.soapNote));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl max-h-[85vh] rounded-3xl glass-strong overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 p-6 pb-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-11 w-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-heading text-base font-bold text-foreground truncate">
                  {spec?.label ?? "Consultation"}
                  {session.doctorName ? ` with ${session.doctorName}` : ""}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{dateLabel}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* View toggle */}
          <div className="px-6 pb-4 shrink-0">
            <div className="flex items-center p-1 rounded-full bg-muted w-fit">
              <button
                onClick={() => setFullNote(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  !fullNote ? "bg-gradient-brand text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Plain summary
              </button>
              <button
                onClick={() => setFullNote(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  fullNote ? "bg-gradient-brand text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Full clinical note
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            {SOAP_SECTIONS.map((section) => (
              <div
                key={section.key}
                className="pl-3.5 rounded-r-lg"
                style={{ borderLeft: `3px solid ${section.hex}` }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wide mb-1.5 text-muted-foreground">
                  {fullNote ? section.label : PLAIN_LABELS[section.key]}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
                  {session.soapNote[section.key]}
                </p>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 p-6 pt-4 shrink-0 border-t border-border/60 mt-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-medium bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => downloadNoteTxt(session.soapNote, "my-consultation-note")}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-medium bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              onClick={() =>
                printNote(session.soapNote, {
                  title: spec ? `${spec.label} Consultation` : "Consultation Note",
                  dateLabel,
                })
              }
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-medium bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
