"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Mic, Square, AlertCircle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecorderProps {
  onRecordingComplete: (rawText: string) => void;
  onRecordingStart?: () => void;
  isProcessing: boolean;
}

export function Recorder({ onRecordingComplete, onRecordingStart, isProcessing }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analyserData, setAnalyserData] = useState<number[]>(new Array(48).fill(0));
  const [liveText, setLiveText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateAnalyser = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const bars = 48;
    const step = Math.floor(data.length / bars);
    const newData: number[] = [];
    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += data[i * step + j];
      newData.push(sum / step / 255);
    }
    setAnalyserData(newData);
    animFrameRef.current = requestAnimationFrame(updateAnalyser);
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setLiveText("");
      transcriptRef.current = "";

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech recognition is not supported. Please use Chrome.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) finalTranscript += result[0].transcript + " ";
          else interim += result[0].transcript;
        }
        transcriptRef.current = finalTranscript;
        setLiveText(finalTranscript + interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== "no-speech" && event.error !== "aborted")
          setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        if (recognitionRef.current && streamRef.current) {
          try { recognition.start(); } catch { /* already started or stopped */ }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setDuration(0);
      onRecordingStart?.();

      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      updateAnalyser();
    } catch {
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    analyserRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAnalyserData(new Array(48).fill(0));

    const finalText = transcriptRef.current.trim();
    if (finalText) {
      onRecordingComplete(finalText);
    } else {
      setError("No speech detected. Please try again and speak clearly.");
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">

      {/* ── Waveform panel ── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border/60 bg-card">
        {/* Scan-line sweep — only during recording */}
        {isRecording && (
          <div
            className="absolute inset-0 pointer-events-none z-10 animate-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.65 0.15 180 / 0.08) 40%, oklch(0.65 0.15 180 / 0.18) 50%, oklch(0.65 0.15 180 / 0.08) 60%, transparent 100%)",
              width: "25%",
            }}
          />
        )}

        {/* Grid lines — clinical graph paper feel */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0.4 0.1 185) 0px, transparent 1px, transparent 23px, oklch(0.4 0.1 185) 24px), repeating-linear-gradient(90deg, oklch(0.4 0.1 185) 0px, transparent 1px, transparent 23px, oklch(0.4 0.1 185) 24px)",
          }}
        />

        <div className="relative z-20 px-4 pt-3 pb-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Audio Monitor
            </span>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-red-500">
                <Radio className="h-3 w-3" />
                LIVE
              </span>
            )}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-center gap-[3px] h-20">
            {analyserData.map((val, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-75 flex-1 max-w-[5px]"
                style={{
                  height: `${Math.max(3, val * 80)}px`,
                  background: isRecording
                    ? `oklch(${0.62 + val * 0.12} 0.16 ${180 - val * 20} / ${0.45 + val * 0.55})`
                    : "oklch(0.85 0.02 250)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Timer ── */}
      <div className="flex items-center gap-3">
        <div className="font-mono text-4xl font-light tracking-widest text-foreground/80 tabular-nums">
          {formatTime(duration)}
        </div>
      </div>

      {/* ── Recording status indicator ── */}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          Recording — Patient consent required
        </div>
      )}

      {/* ── Live transcript preview ── */}
      {isRecording && liveText && (
        <div className="w-full bg-muted/40 rounded-xl border border-border/50 px-4 py-3 max-h-28 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
            Live Preview
          </p>
          <p className="text-sm text-foreground/70 font-mono leading-relaxed">
            {liveText}
            {/* Blinking cursor */}
            <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 align-middle animate-pulse" />
          </p>
        </div>
      )}

      {/* ── Main button with glow ring ── */}
      <div className="relative flex items-center justify-center">
        {/* Breathing ring behind button */}
        {isRecording && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              margin: "-14px",
              animation: "glow-ring 2s ease-in-out infinite",
            }}
          />
        )}

        {/* Outer decorative ring (idle) */}
        {!isRecording && !isProcessing && (
          <span className="absolute inset-0 rounded-full border-2 border-primary/15"
            style={{ margin: "-6px" }}
          />
        )}

        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing}
            size="lg"
            className="relative h-20 w-20 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 transition-all duration-200 hover:scale-105 active:scale-95 border-0"
          >
            <Mic className="h-8 w-8" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="relative h-20 w-20 rounded-full shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Square className="h-7 w-7 fill-current" />
          </Button>
        )}
      </div>

      {/* ── Helper text ── */}
      <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
        {isRecording
          ? "Audio is processed in-memory and deleted after note generation."
          : isProcessing
            ? "Processing your recording…"
            : "Click to start recording a consultation"}
      </p>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-xl w-full">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
