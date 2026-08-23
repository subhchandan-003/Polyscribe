import type { SOAPNote } from "@/lib/claude";
import type { Specialty } from "@/lib/specialty-prompts";
import { getDoctorSeed, DOCTOR_SEEDS } from "@/lib/seed-sessions";

export interface SessionAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  category: "prescription" | "lab-report" | "scan" | "other";
  uploadedAt: number;
}

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
  /** Which doctor recorded this session — set automatically on save/seed. */
  doctorId?: string;
  doctorName?: string;
  /** Set when a doctor shares this note with a patient account, see
   * shareSessionWithPatient(). Lets the patient portal find it. */
  patientEmail?: string;
  /** Prescriptions, lab reports, and scans the doctor attached to this
   * consultation. Metadata only — the file content lives in IndexedDB,
   * see attachments-db.ts. Doctor-uploaded only; the patient side is
   * read-only. */
  attachments?: SessionAttachment[];
}

const SESSIONS_PREFIX = "polyscribe_sessions_";
const SEEDED_FLAG_PREFIX = "polyscribe_sessions_seeded_";
/** Bump this whenever DOCTOR_SEEDS content changes meaningfully, so
 * browsers that already seeded under an older shape pick up the new
 * data instead of being stuck with whatever was there on first login. */
const SEED_VERSION = "2";
const SEED_VERSION_PREFIX = "polyscribe_sessions_seed_version_";
const storageKey = (userId: string) => `${SESSIONS_PREFIX}${userId}`;
const seededFlagKey = (userId: string) => `${SEEDED_FLAG_PREFIX}${userId}`;
const seedVersionKey = (userId: string) => `${SEED_VERSION_PREFIX}${userId}`;

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

/** Seeds a directory doctor's history with starter sessions matching
 * their specialty and consulting language. Gated by SEED_VERSION rather
 * than a plain one-time flag: these are fixed demo accounts (no
 * signup), so when the seed data itself changes we want every browser
 * that already visited an account to pick up the new caseload instead
 * of being stuck with whatever it saw on first login. */
function ensureSeeded(userId: string): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(seedVersionKey(userId)) === SEED_VERSION) return;

  const seed = getDoctorSeed(userId);
  if (seed) {
    const now = Date.now();
    const seeded: Session[] = seed.sessions
      .map(({ daysAgo, ...rest }) => ({
        ...rest,
        id: crypto.randomUUID(),
        timestamp: now - daysAgo * 24 * 60 * 60 * 1000,
        doctorId: userId,
        doctorName: seed.doctorName,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    writeSessions(userId, seeded);
  }
  localStorage.setItem(seededFlagKey(userId), "1");
  localStorage.setItem(seedVersionKey(userId), SEED_VERSION);
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

/** Attaches a doctor-uploaded document (prescription, lab report, scan)
 * to a session. Call after the file's binary content has already been
 * saved to IndexedDB (see attachments-db.ts) — this only stores the
 * metadata alongside the session. */
export function addAttachment(
  userId: string,
  sessionId: string,
  attachment: SessionAttachment
): boolean {
  const sessions = readSessions(userId);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return false;
  sessions[idx] = {
    ...sessions[idx],
    attachments: [...(sessions[idx].attachments ?? []), attachment],
  };
  writeSessions(userId, sessions);
  return true;
}

export function removeAttachment(userId: string, sessionId: string, attachmentId: string): void {
  const sessions = readSessions(userId);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  sessions[idx] = {
    ...sessions[idx],
    attachments: (sessions[idx].attachments ?? []).filter((a) => a.id !== attachmentId),
  };
  writeSessions(userId, sessions);
}

/** Shares a saved session with a patient account by email, so it shows
 * up in that patient's portal. Doctor-side action from Session History. */
export function shareSessionWithPatient(
  doctorUserId: string,
  sessionId: string,
  patientEmail: string
): boolean {
  const sessions = readSessions(doctorUserId);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return false;
  sessions[idx] = { ...sessions[idx], patientEmail: patientEmail.trim().toLowerCase() };
  writeSessions(doctorUserId, sessions);
  return true;
}

export function unshareSessionFromPatient(doctorUserId: string, sessionId: string): void {
  const sessions = readSessions(doctorUserId);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  sessions[idx] = { ...sessions[idx], patientEmail: undefined };
  writeSessions(doctorUserId, sessions);
}

/** Aggregates every session shared with a given patient email, across
 * every doctor's own localStorage history in this browser. There's no
 * backend here, so this is the honest version of "linking" a note to a
 * patient: it only ever sees data already sitting in this browser. */
export function getPatientSessions(patientEmail: string): Session[] {
  if (typeof window === "undefined") return [];
  const email = patientEmail.trim().toLowerCase();

  // Make sure every quick-login doctor's starter history exists already,
  // even if that doctor has never actually logged in on this browser, so
  // a patient who signs in first still sees the seeded shared visits.
  Object.keys(DOCTOR_SEEDS).forEach((doctorId) => ensureSeeded(doctorId));

  const results: Session[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(SESSIONS_PREFIX) || key.startsWith(SEEDED_FLAG_PREFIX)) continue;
    try {
      const sessions: Session[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      sessions.forEach((s) => {
        if (s.patientEmail && s.patientEmail.toLowerCase() === email) results.push(s);
      });
    } catch {
      // skip malformed entries
    }
  }
  return results.sort((a, b) => b.timestamp - a.timestamp);
}
