"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/components/login-page";
import { PatientDashboard } from "@/components/patient-dashboard";
import { Sidebar, type NavKey } from "@/components/sidebar";
import { Recorder } from "@/components/recorder";
import { TranscriptPanel } from "@/components/transcript-panel";
import { SOAPPanel } from "@/components/soap-panel";
import { ProcessingOverlay } from "@/components/processing-overlay";
import { SessionHistory } from "@/components/session-history";
import { SpecialtySelector } from "@/components/specialty-selector";
import { ConsentGate } from "@/components/consent-gate";
import { ImpactStats } from "@/components/impact-stats";
import { PricingPage } from "@/components/pricing-page";
import { DashboardPage } from "@/components/dashboard-page";
import { PitchPage } from "@/components/pitch-page";
import { DemoMode } from "@/components/demo-mode";
import type { DemoCase } from "@/lib/demo-transcripts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Loader2, History, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { LanguageSelector, type LanguageConfig } from "@/components/language-selector";
import { saveSession, type Session } from "@/lib/sessions";
import type { Specialty } from "@/lib/specialty-prompts";
import type { SOAPNote } from "@/lib/claude";

type AppState =
  | "idle"
  | "recording"
  | "transcribing"
  | "structuring"
  | "done"
  | "error"
  | "history"
  | "demo";

type Page = "home" | "pricing" | "dashboard" | "pitch";

const DEFAULT_LANG_CONFIG: LanguageConfig = {
  inputLanguages: ["en"],
  outputLanguage: "en",
};

export default function Home() {
  const { user, isLoading } = useAuth();
  const [page, setPage] = useState<Page>("home");
  const [appState, setAppState] = useState<AppState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [soapNote, setSoapNote] = useState<SOAPNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [langConfig, setLangConfig] = useState<LanguageConfig>(DEFAULT_LANG_CONFIG);
  const [specialty, setSpecialty] = useState<Specialty>("general");
  const [saved, setSaved] = useState(false);
  const [consented, setConsented] = useState(false);
  const recordingStartRef = useRef<number>(0);

  const processRecording = useCallback(
    async (rawText: string) => {
      try {
        setAppState("transcribing");
        setError(null);
        setSaved(false);

        // Step 1: Clean up raw speech text with Claude
        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawText,
            inputLanguages: langConfig.inputLanguages,
          }),
        });

        if (!transcribeRes.ok) {
          const err = await transcribeRes.json();
          throw new Error(err.error || "Transcription failed");
        }

        const { transcript: rawTranscript } = await transcribeRes.json();
        setTranscript(rawTranscript);

        // Step 2: Structure SOAP note with Claude
        setAppState("structuring");

        const structureRes = await fetch("/api/structure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: rawTranscript,
            outputLanguage: langConfig.outputLanguage,
            specialty,
          }),
        });

        if (!structureRes.ok) {
          const err = await structureRes.json();
          throw new Error(err.error || "SOAP structuring failed");
        }

        const { soapNote: note } = await structureRes.json();
        setSoapNote(note);
        setAppState("done");

        // Auto-save session
        const duration = recordingStartRef.current
          ? Math.round((Date.now() - recordingStartRef.current) / 1000)
          : undefined;
        saveSession({
          specialty,
          inputLanguages: langConfig.inputLanguages,
          outputLanguage: langConfig.outputLanguage,
          transcript: rawTranscript,
          soapNote: note,
          duration,
        });
        setSaved(true);
      } catch (err) {
        let msg = "Something went wrong";
        if (err instanceof TypeError && err.message.includes("fetch")) {
          msg = "Network error — check your internet connection and try again.";
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
        setAppState("error");
      }
    },
    [langConfig, specialty]
  );

  const handleRecordingStart = useCallback(() => {
    recordingStartRef.current = Date.now();
  }, []);

  const handleNewSession = () => {
    setPage("home");
    setAppState("idle");
    setTranscript(null);
    setSoapNote(null);
    setError(null);
    setSaved(false);
    setConsented(false);
  };

  const handleLoadSession = (session: Session) => {
    setTranscript(session.transcript);
    setSoapNote(session.soapNote);
    setSpecialty(session.specialty);
    setLangConfig({
      inputLanguages: session.inputLanguages,
      outputLanguage: session.outputLanguage,
    });
    setSaved(true);
    setPage("home");
    setAppState("done");
  };

  const activeNav: NavKey =
    page === "dashboard"
      ? "dashboard"
      : page === "pricing"
        ? "pricing"
        : page === "pitch"
          ? "pitch"
          : appState === "history"
            ? "history"
            : appState === "demo"
              ? "demo"
              : "console";

  const handleSidebarNav = (key: NavKey) => {
    switch (key) {
      case "console":
        setPage("home");
        break;
      case "history":
        setPage("home");
        setAppState("history");
        break;
      case "demo":
        setPage("home");
        setAppState("demo");
        break;
      case "dashboard":
        setPage("dashboard");
        break;
      case "pricing":
        setPage("pricing");
        break;
      case "pitch":
        setPage("pitch");
        break;
    }
  };

  const handleRunDemo = useCallback(
    (demoCase: DemoCase) => {
      setSpecialty(demoCase.specialty);
      setLangConfig({
        inputLanguages: [demoCase.languageCode],
        outputLanguage: demoCase.languageCode === "en" ? "en" : "auto",
      });
      recordingStartRef.current = Date.now() - 180_000; // simulate ~3min
      processRecording(demoCase.rawTranscript);
    },
    [processRecording]
  );

  const isProcessing = appState === "transcribing" || appState === "structuring";
  const showResults = appState === "done" || appState === "structuring";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  // Patient portal → show patient dashboard
  if (user.role === "patient") {
    return <PatientDashboard />;
  }

  // Doctor portal → persistent sidebar shell + full-width console
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        active={activeNav}
        onNavigate={handleSidebarNav}
        onNewConsultation={handleNewSession}
      />

      <div className="flex-1 flex flex-col overflow-y-auto pb-24 lg:pb-0">
        {/* Business layer pages */}
        {page === "pricing" && (
          <div className="max-w-6xl mx-auto w-full px-6 lg:px-10 py-8">
            <PricingPage onBack={() => setPage("home")} />
          </div>
        )}

        {page === "dashboard" && (
          <div className="max-w-6xl mx-auto w-full px-6 lg:px-10 py-8">
            <DashboardPage onBack={() => setPage("home")} />
          </div>
        )}

        {page === "pitch" && (
          <div className="max-w-4xl mx-auto w-full px-6 lg:px-10 py-8">
            <PitchPage onBack={() => setPage("home")} />
          </div>
        )}

        {/* Console */}
        {page === "home" && (
          <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-10 py-8">
            {/* Session History */}
            {appState === "history" && (
              <SessionHistory
                onLoadSession={handleLoadSession}
                onBack={() => setAppState("idle")}
              />
            )}

            {/* Demo Mode */}
            {appState === "demo" && (
              <div className="animate-fade-in-up">
                <DemoMode
                  onRunDemo={handleRunDemo}
                  onBack={() => setAppState("idle")}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Recording / Idle State — recorder is the hero; setup lives beside it, never above it */}
            {(appState === "idle" || appState === "recording") && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start animate-fade-in-up">
                {/* Main column */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-7 lg:pt-6">
                  <div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-teal-600/70 bg-teal-50 border border-teal-100 rounded-full px-3 py-1 mb-3 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                      New Consultation
                    </div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">
                      Start Recording
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                      Record your patient conversation — PolyScribe handles transcription,
                      diarization, and SOAP structuring automatically.
                    </p>
                  </div>

                  <ImpactStats />

                  <div className="w-full flex justify-center lg:justify-start">
                    {!consented ? (
                      <ConsentGate onConsent={() => setConsented(true)} />
                    ) : (
                      <Recorder
                        onRecordingComplete={processRecording}
                        onRecordingStart={handleRecordingStart}
                        isProcessing={isProcessing}
                      />
                    )}
                  </div>
                </div>

                {/* Side panel — Specialty + Language, beside the recorder */}
                <aside className="w-full lg:sticky lg:top-8">
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <SlidersHorizontal className="h-4 w-4 text-teal-600" />
                      <h3 className="font-heading text-sm font-semibold">Consultation Setup</h3>
                    </div>
                    <div className="space-y-5">
                      <SpecialtySelector value={specialty} onChange={setSpecialty} />
                      <Separator />
                      <LanguageSelector config={langConfig} onChange={setLangConfig} />
                    </div>
                  </Card>
                </aside>
              </div>
            )}

            {/* Processing State */}
            {appState === "transcribing" && !transcript && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <ProcessingOverlay stage="transcribing" />
              </div>
            )}

            {/* Results — Two Panel Layout */}
            {(showResults || (appState === "transcribing" && transcript)) && (
              <div className="space-y-5 animate-fade-in-up">
                {/* Results header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-5 rounded-full bg-teal-500/60" />
                    <h2 className="font-heading text-base font-bold tracking-tight">
                      Consultation Notes
                    </h2>
                    {saved && (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Auto-saved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppState("history")}
                      className="gap-1.5 text-muted-foreground hover:text-foreground h-7 text-xs"
                    >
                      <History className="h-3.5 w-3.5" />
                      History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNewSession}
                      className="gap-1.5 h-7 text-xs border-teal-200 text-teal-700 hover:bg-teal-50/60"
                    >
                      <RotateCcw className="h-3 w-3" />
                      New Session
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 min-h-[60vh]">
                  <Card className="p-6 overflow-hidden border-border/60 shadow-sm">
                    <TranscriptPanel
                      transcript={transcript}
                      isLoading={appState === "transcribing"}
                    />
                  </Card>
                  <Card className="p-6 overflow-hidden border-border/60 shadow-sm">
                    <SOAPPanel
                      soapNote={soapNote}
                      isLoading={appState === "structuring"}
                    />
                  </Card>
                </div>
              </div>
            )}

            {/* Error State */}
            {appState === "error" && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-fade-in-up">
                <div className="text-center">
                  <h2 className="font-heading text-xl font-semibold text-destructive mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md">{error}</p>
                </div>
                <Button onClick={handleNewSession} variant="outline" className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50/60">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
