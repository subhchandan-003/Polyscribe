"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Square, AlertCircle, Radio } from "lucide-react";

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
      <div className="relative w-full overflow-hidden rounded-2xl glass">
        {/* Scan-line sweep — only during recording */}
        {isRecording && (
          <div
            className="absolute inset-0 pointer-events-none z-10 animate-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.65 0.14 190 / 0.12) 40%, oklch(0.65 0.14 190 / 0.25) 50%, oklch(0.65 0.14 190 / 0.12) 60%, transparent 100%)",
              width: "25%",
            }}
          />
        )}

        <div className="relative z-20 px-5 pt-4 pb-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Audio Monitor
            </span>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <Radio className="h-3 w-3" />
                Live
              </span>
            )}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-center gap-[3px] h-20">
            {analyserData.map((val, i) => (
              <div
                key={i}
                className="transition-all duration-75 flex-1 max-w-[6px] rounded-full"
                style={{
                  height: `${Math.max(4, val * 80)}px`,
                  background: isRecording
                    ? `linear-gradient(180deg, oklch(0.72 0.16 158 / ${0.55 + val * 0.45}), oklch(0.62 0.14 195 / ${0.55 + val * 0.45}))`
                    : "oklch(0.85 0.02 210)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Timer ── */}
      <div className="flex items-center gap-3">
        <div className="font-heading text-4xl font-bold tracking-tight text-foreground/90 tabular-nums">
          {formatTime(duration)}
        </div>
      </div>

      {/* ── Recording status indicator ── */}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-destructive font-semibold rounded-full bg-destructive/10 px-3.5 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
          </span>
          Recording — patient consent required
        </div>
      )}

      {/* ── Live transcript preview ── */}
      <AnimatePresence>
        {isRecording && liveText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full rounded-2xl glass-subtle px-4 py-3 max-h-28 overflow-y-auto"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Live Preview
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {liveText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main button ── */}
      <div className="relative flex items-center justify-center py-2">
        {!isRecording && !isProcessing && (
          <>
            <span className="absolute h-28 w-28 rounded-full animate-ring-expand bg-primary/10" />
            <span className="absolute h-28 w-28 rounded-full animate-ring-expand bg-primary/10" style={{ animationDelay: "0.6s" }} />
          </>
        )}

        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={startRecording}
            disabled={isProcessing}
            className="relative h-20 w-20 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-xl shadow-teal-500/35 disabled:opacity-50 cursor-pointer transition-shadow"
          >
            <Mic className="h-8 w-8" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={stopRecording}
            className="relative h-20 w-20 rounded-full bg-destructive text-white flex items-center justify-center shadow-xl shadow-red-500/35 cursor-pointer animate-glow-pulse"
          >
            <Square className="h-7 w-7 fill-current" />
          </motion.button>
        )}
      </div>

      {/* ── Helper text ── */}
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        {isRecording
          ? "Audio is processed in-memory and deleted after note generation."
          : isProcessing
            ? "Processing your recording…"
            : "Click to start recording a consultation"}
      </p>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive rounded-xl bg-destructive/10 border border-destructive/25 px-4 py-2.5 w-full">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
