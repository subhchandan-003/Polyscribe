"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/components/login-page";
import { PatientDashboard } from "@/components/patient-dashboard";
import { Header } from "@/components/header";
import { Recorder } from "@/components/recorder";
import { TranscriptPanel } from "@/components/transcript-panel";
import { SOAPPanel } from "@/components/soap-panel";
import { ProcessingOverlay } from "@/components/processing-overlay";
import { SessionHistory } from "@/components/session-history";
import { SpecialtySelector } from "@/components/specialty-selector";
import { ConsentGate } from "@/components/consent-gate";
import { PricingPage } from "@/components/pricing-page";
import { DashboardPage } from "@/components/dashboard-page";
import { PitchPage } from "@/components/pitch-page";
import { DemoMode } from "@/components/demo-mode";
import type { DemoCase } from "@/lib/demo-transcripts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, History, CheckCircle2, Sparkles } from "lucide-react";
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
    setAppState("done");
  };

  const handleNavigate = (target: string) => {
    setPage(target as Page);
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

  // Business layer pages
  if (page === "pricing") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1">
          <PricingPage onBack={() => setPage("home")} />
        </main>
      </div>
    );
  }

  if (page === "dashboard") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          <DashboardPage onBack={() => setPage("home")} />
        </main>
      </div>
    );
  }

  if (page === "pitch") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1">
          <PitchPage onBack={() => setPage("home")} />
        </main>
      </div>
    );
  }

  // Doctor portal → show consultation tools
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50/60 to-background">
      <Header onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
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

        {/* Recording / Idle State */}
        {(appState === "idle" || appState === "recording") && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            {/* Section heading */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-teal-600/70 bg-teal-50 border border-teal-100 rounded-full px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                New Consultation
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Start Recording
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Record your patient conversation — PolyScribe handles transcription,
                diarization, and SOAP structuring automatically.
              </p>
            </div>

            {/* History & Demo buttons */}
            <div className="flex items-center gap-3 mb-7">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAppState("history")}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" />
                Session History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAppState("demo")}
                className="gap-1.5 text-teal-700 border-teal-200 hover:bg-teal-50/60"
              >
                <Sparkles className="h-4 w-4" />
                Try Demo
              </Button>
            </div>

            <div className="mb-6 w-full max-w-lg">
              <SpecialtySelector value={specialty} onChange={setSpecialty} />
            </div>

            <div className="mb-10 w-full max-w-lg">
              <LanguageSelector config={langConfig} onChange={setLangConfig} />
            </div>

            {/* Consent gate — shown before recorder is available */}
            {!consented ? (
              <div className="w-full flex justify-center">
                <ConsentGate onConsent={() => setConsented(true)} />
              </div>
            ) : (
              <Recorder
                onRecordingComplete={processRecording}
                onRecordingStart={handleRecordingStart}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}

        {/* Processing State */}
        {appState === "transcribing" && !transcript && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
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
                <h2 className="text-base font-bold tracking-tight">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[65vh]">
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in-up">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            PolyScribe supports India DPDP Act and Singapore PDPA compliance
          </p>
          <p>Audio deleted after note generation</p>
        </div>
      </footer>
    </div>
  );
}
