"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/components/login-page";
import { PatientDashboard } from "@/components/patient-dashboard";
import { CommandBar, type NavKey } from "@/components/command-bar";
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
    async (rawText: string, audioBlob: Blob | null) => {
      try {
        setAppState("transcribing");
        setError(null);
        setSaved(false);

        // Step 0 (optional): refine the rough Web Speech transcript with a
        // proper Whisper pass over the recorded audio. Falls back silently
        // to the live-preview text if Whisper isn't configured or fails,
        // so a flaky third-party call never blocks the consultation.
        let bestRawText = rawText;
        if (audioBlob) {
          try {
            const whisperForm = new FormData();
            whisperForm.append("audio", audioBlob, "consultation.webm");
            if (langConfig.inputLanguages.length === 1) {
              whisperForm.append("language", langConfig.inputLanguages[0]);
            }

            const whisperRes = await fetch("/api/whisper-transcribe", {
              method: "POST",
              body: whisperForm,
            });

            if (whisperRes.ok) {
              const { transcript: whisperText } = await whisperRes.json();
              if (typeof whisperText === "string" && whisperText.trim().length > 0) {
                bestRawText = whisperText;
              }
            }
          } catch {
            // Whisper refinement is best-effort; keep the Web Speech text.
          }
        }

        // Step 1: Clean up raw speech text with Claude
        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawText: bestRawText,
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

        // Auto-save session, scoped to the logged-in doctor
        const duration = recordingStartRef.current
          ? Math.round((Date.now() - recordingStartRef.current) / 1000)
          : undefined;
        if (user) {
          saveSession(user.id, {
            specialty,
            inputLanguages: langConfig.inputLanguages,
            outputLanguage: langConfig.outputLanguage,
            transcript: rawTranscript,
            soapNote: note,
            duration,
            doctorId: user.id,
            doctorName: user.name,
          });
        }
        setSaved(true);
      } catch (err) {
        let msg = "Something went wrong";
        if (err instanceof TypeError && err.message.includes("fetch")) {
          msg = "Network error. Check your internet connection and try again.";
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
        setAppState("error");
      }
    },
    [langConfig, specialty, user]
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

  const handleNav = (key: NavKey) => {
    switch (key) {
      case "console":
        setPage("home");
        setAppState((s) => (s === "history" || s === "demo" ? "idle" : s));
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
      processRecording(demoCase.rawTranscript, null);
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

  // Doctor portal → command bar shell + full-width console
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div className="gradient-mesh" />
      <CommandBar active={activeNav} onNavigate={handleNav} onNewConsultation={handleNewSession} />

      <div className="flex-1 overflow-y-auto">
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

            {/* Recording / Idle State.
                Pre-consent: consent gate + consultation setup live side by side.
                Once consent is confirmed, the setup panel goes away. The
                recorder is the only thing on screen. */}
            {(appState === "idle" || appState === "recording") && (
              <div
                className={
                  !consented
                    ? "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start animate-fade-in-up"
                    : "flex flex-col items-center text-center gap-7 max-w-xl mx-auto animate-fade-in-up"
                }
              >
                {/* Main column */}
                <div
                  className={
                    !consented
                      ? "flex flex-col items-center lg:items-start text-center lg:text-left gap-7 lg:pt-4"
                      : "flex flex-col items-center text-center gap-7 w-full"
                  }
                >
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary rounded-full bg-accent px-3 py-1.5 mb-4 whitespace-nowrap">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                      New Consultation
                    </div>
                    <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-3">
                      Start <span className="text-gradient-brand">Recording</span>
                    </h2>
                    <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                      Record your patient conversation and PolyScribe takes care of
                      transcription, diarization, and SOAP structuring automatically.
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

                {/* Side panel: specialty + language, only while consent hasn't been given yet */}
                {!consented && (
                  <aside className="w-full lg:sticky lg:top-20">
                    <Card className="p-6">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
                          <SlidersHorizontal className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-heading text-sm font-bold">Consultation Setup</h3>
                      </div>
                      <div className="space-y-5">
                        <SpecialtySelector value={specialty} onChange={setSpecialty} />
                        <Separator className="bg-border/60" />
                        <LanguageSelector config={langConfig} onChange={setLangConfig} />
                      </div>
                    </Card>
                  </aside>
                )}
              </div>
            )}

            {/* Processing State */}
            {appState === "transcribing" && !transcript && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <ProcessingOverlay stage="transcribing" />
              </div>
            )}

            {/* Results: two panel layout */}
            {(showResults || (appState === "transcribing" && transcript)) && (
              <div className="space-y-5 animate-fade-in-up">
                {/* Results header bar */}
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-xl font-bold tracking-tight">
                      Consultation Notes
                    </h2>
                    {saved && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary rounded-full bg-accent px-2.5 py-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Auto-saved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppState("history")}
                      className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-xl"
                    >
                      <History className="h-3.5 w-3.5" />
                      History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNewSession}
                      className="gap-1.5 h-8 text-xs rounded-xl"
                    >
                      <RotateCcw className="h-3 w-3" />
                      New Session
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 min-h-[60vh]">
                  <Card className="p-6 overflow-hidden">
                    <TranscriptPanel
                      transcript={transcript}
                      isLoading={appState === "transcribing"}
                    />
                  </Card>
                  <Card className="p-6 overflow-hidden">
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
                <Button onClick={handleNewSession} variant="outline" className="gap-2 rounded-xl">
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
