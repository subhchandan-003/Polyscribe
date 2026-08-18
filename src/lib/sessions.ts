import type { SOAPNote } from "@/lib/claude";
import type { Specialty } from "@/lib/specialty-prompts";

export interface Session {
  id: string;
  timestamp: number;
  specialty: Specialty;
  inputLanguages: string[];
  outputLanguage: string;
  transcript: string;
  soapNote: SOAPNote;
  patientName?: string;
  duration?: number;
}

const STORAGE_KEY = "polyscribe_sessions";

function readSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function saveSession(session: Omit<Session, "id" | "timestamp">): Session {
  const full: Session = {
    ...session,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const sessions = readSessions();
  sessions.unshift(full);
  // Keep last 50 sessions
  writeSessions(sessions.slice(0, 50));
  return full;
}

export function getSessions(): Session[] {
  return readSessions();
}

export function getSession(id: string): Session | undefined {
  return readSessions().find((s) => s.id === id);
}

export function deleteSession(id: string): void {
  const sessions = readSessions().filter((s) => s.id !== id);
  writeSessions(sessions);
}

export function clearSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
