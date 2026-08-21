"use client";

import { useState, useEffect } from "react";
import { Copy, Check, FileText, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SOAPNote } from "@/lib/claude";
import { SOAP_SECTIONS, buildNotePlainText, downloadNoteTxt, printNote } from "@/lib/note-export";

interface SOAPPanelProps {
  soapNote: SOAPNote | null;
  isLoading: boolean;
}

/* Distinct legend hues for quick section scanning. Deliberately avoids
 * teal, which is reserved as the primary UI accent color. */
const SECTION_COLORS: Record<keyof SOAPNote, string> = {
  subjective: "text-blue-400",
  objective: "text-cyan-400",
  assessment: "text-amber-400",
  plan: "text-violet-400",
  medications: "text-rose-400",
  followUp: "text-orange-400",
};

/* Pre-computed skeleton widths, avoids Math.random() on every render */
const SKELETON_WIDTHS = ["85%", "68%", "90%", "72%", "78%", "83%"];

export function SOAPPanel({ soapNote, isLoading }: SOAPPanelProps) {
  const [copied, setCopied] = useState(false);
  const [editedNote, setEditedNote] = useState<SOAPNote | null>(null);

  /* Reset local edits when a new soapNote arrives (e.g. loading a session) */
  useEffect(() => {
    setEditedNote(null);
  }, [soapNote]);

  const currentNote = editedNote ?? soapNote;

  const handleCopy = async () => {
    if (!currentNote) return;
    await navigator.clipboard.writeText(buildNotePlainText(currentNote));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    if (currentNote) downloadNoteTxt(currentNote);
  };

  const handleExportPdf = () => {
    if (currentNote) printNote(currentNote);
  };

  const handleSectionEdit = (key: keyof SOAPNote, value: string) => {
    const base = currentNote ?? {
      subjective: "", objective: "", assessment: "", plan: "", medications: "", followUp: "",
    };
    setEditedNote({ ...base, [key]: value });
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <h2 className="text-sm font-bold text-foreground">
            SOAP Note
          </h2>
        </div>
        <div className="flex-1 space-y-5">
          {SOAP_SECTIONS.map((s, idx) => (
            <div key={s.key} className="space-y-2 pl-3.5 rounded-r-lg" style={{ borderLeft: `3px solid ${s.hex}40` }}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="relative h-3.5 rounded-full bg-muted overflow-hidden animate-shimmer w-full" />
              <div className="relative h-3.5 rounded-full bg-muted overflow-hidden animate-shimmer" style={{ width: SKELETON_WIDTHS[idx] }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
          Structuring note with Claude…
        </p>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
        <FileText className="h-8 w-8 mb-3 opacity-20" />
        <p className="text-sm">SOAP note will appear here after processing</p>
      </div>
    );
  }

  /* ── Populated state ── */
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <h2 className="text-sm font-bold text-foreground">
            SOAP Note
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy to clipboard"
            className="h-8 px-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportTxt} title="Export .txt"
            className="h-8 px-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportPdf} title="Print / Export PDF"
            className="h-8 px-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60">
            <Printer className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-5">
          {SOAP_SECTIONS.map((section, idx) => (
            <div key={section.key}>
              {/* Section with clinical left-border accent */}
              <div
                className="pl-3.5 rounded-r-lg transition-colors"
                style={{ borderLeft: `3px solid ${section.hex}` }}
              >
                <h3
                  className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${SECTION_COLORS[section.key]}`}
                >
                  {section.label}
                </h3>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleSectionEdit(section.key, e.currentTarget.textContent ?? "")
                  }
                  className="text-sm leading-relaxed text-foreground/85 outline-none px-2.5 py-1.5 -mx-2.5 rounded-lg transition-colors hover:bg-muted/50 focus:bg-muted/50"
                >
                  {currentNote[section.key]}
                </div>
              </div>
              {idx < SOAP_SECTIONS.length - 1 && (
                <Separator className="mt-4 opacity-40" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
