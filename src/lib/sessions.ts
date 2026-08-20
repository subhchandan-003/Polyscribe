import type { SOAPNote } from "@/lib/claude";
import type { Specialty } from "@/lib/specialty-prompts";
import { getDoctorSeed } from "@/lib/seed-sessions";

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

const storageKey = (userId: string) => `polyscribe_sessions_${userId}`;
const seededFlagKey = (userId: string) => `polyscribe_sessions_seeded_${userId}`;

function readSessions(userId: string): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSessions(userId: string, sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(sessions));
}

/** Seeds a quick-login doctor's history with starter sessions matching
 * their specialty and consulting language, but only once, and only if
 * they have no sessions yet — so it never clobbers real recordings or
 * re-appears after the user deletes everything on purpose. */
function ensureSeeded(userId: string): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(seededFlagKey(userId))) return;

  const seed = getDoctorSeed(userId);
  if (seed) {
    const existing = readSessions(userId);
    if (existing.length === 0) {
      const now = Date.now();
      const seeded: Session[] = seed.sessions
        .map(({ daysAgo, ...rest }) => ({
          ...rest,
          id: crypto.randomUUID(),
          timestamp: now - daysAgo * 24 * 60 * 60 * 1000,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      writeSessions(userId, seeded);
    }
  }
  localStorage.setItem(seededFlagKey(userId), "1");
}

export function saveSession(
  userId: string,
  session: Omit<Session, "id" | "timestamp">
): Session {
  const full: Session = {
    ...session,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const sessions = readSessions(userId);
  sessions.unshift(full);
  // Keep last 50 sessions
  writeSessions(userId, sessions.slice(0, 50));
  return full;
}

export function getSessions(userId: string): Session[] {
  ensureSeeded(userId);
  return readSessions(userId);
}

export function getSession(userId: string, id: string): Session | undefined {
  return readSessions(userId).find((s) => s.id === id);
}

export function deleteSession(userId: string, id: string): void {
  const sessions = readSessions(userId).filter((s) => s.id !== id);
  writeSessions(userId, sessions);
}

export function clearSessions(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(userId));
}
