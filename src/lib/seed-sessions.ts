import type { Session } from "@/lib/sessions";
import type { Specialty } from "@/lib/specialty-prompts";
import { DOCTOR_DIRECTORY } from "@/lib/doctor-directory";
import { CASE_BANK, type Vitals } from "@/lib/case-bank";
import { buildTranscript, type SeedLang } from "@/lib/lang-style";
import { PATIENT_ROSTER } from "@/lib/patient-roster";

/**
 * Starter session history for every doctor in the Hospitals mode
 * directory (and the five Private Clinics quick-login doctors, same
 * ten accounts). Each doctor gets a randomized 5-to-20 patient caseload
 * generated from a shared case bank, so a fresh directory login never
 * looks empty. Seeding is scoped to that doctor's own user id and
 * version-gated (see ensureSeeded in sessions.ts).
 */

type SeedSession = Omit<Session, "id" | "timestamp"> & { daysAgo: number };

interface DoctorSeed {
  doctorName: string;
  specialty: Specialty;
  language: string;
  sessions: SeedSession[];
}

/** Kept for backward compatibility with anything keying off the five
 * original quick-login patient accounts by name. */
export const DEMO_PATIENTS = {
  rahul: "patient@polyscribe.io",
  anjali: "anjali.nair@polyscribe.io",
  suresh: "suresh.kumar@polyscribe.io",
  meera: "meera.pillai@polyscribe.io",
  arjun: "arjun.das@polyscribe.io",
} as const;

/** Each doctor's consulting language and home city, two per specialty. */
const DOCTOR_LOCALE: Record<string, { lang: SeedLang; city: string }> = {
  "doc-1": { lang: "hi", city: "Delhi" },
  "doc-2": { lang: "bn", city: "Kolkata" },
  "doc-3": { lang: "ta", city: "Chennai" },
  "doc-7": { lang: "kn", city: "Bangalore" },
  "doc-4": { lang: "mr", city: "Pune" },
  "doc-8": { lang: "pa", city: "Chandigarh" },
  "doc-5": { lang: "te", city: "Hyderabad" },
  "doc-9": { lang: "gu", city: "Ahmedabad" },
  "doc-6": { lang: "ml", city: "Kochi" },
  "doc-10": { lang: "or", city: "Bhubaneswar" },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Deterministic PRNG so each doctor's "random" caseload is stable
 * across reloads before it gets persisted to localStorage. */
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildVitals(rng: () => number): Vitals {
  return {
    days: 1 + Math.floor(rng() * 7),
    temp: Math.round((99 + rng() * 4) * 10) / 10,
    bpSys: 110 + Math.floor(rng() * 40),
    bpDia: 70 + Math.floor(rng() * 20),
    pulse: 68 + Math.floor(rng() * 25),
  };
}

function generateDoctorSeed(
  doctorId: string,
  doctorName: string,
  specialty: Specialty,
  lang: SeedLang
): DoctorSeed {
  const rng = mulberry32(hashString(doctorId));
  const patientCount = 5 + Math.floor(rng() * 16); // 5 to 20 inclusive
  const cases = CASE_BANK[specialty];

  const roster = [...PATIENT_ROSTER];
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [roster[i], roster[j]] = [roster[j], roster[i]];
  }
  const patients = roster.slice(0, patientCount);

  const sessions: SeedSession[] = patients.map((patient, i) => {
    const blueprint = cases[i % cases.length];
    const v = buildVitals(rng);
    const daysAgo = 1 + Math.floor(rng() * 55);
    return {
      daysAgo,
      specialty,
      inputLanguages: [lang],
      outputLanguage: "en",
      duration: 180 + Math.floor(rng() * 360),
      patientEmail: patient.email,
      patientName: patient.name,
      transcript: buildTranscript(
        lang,
        blueprint.complaint(v),
        blueprint.examLine(v),
        blueprint.planLine(v)
      ),
      soapNote: {
        subjective: blueprint.subjective(v),
        objective: blueprint.objective(v),
        assessment: blueprint.assessment(v),
        plan: blueprint.plan(v),
        medications: blueprint.medications(v),
        followUp: blueprint.followUp(v),
      },
    };
  });

  return { doctorName, specialty, language: lang, sessions };
}

export const DOCTOR_SEEDS: Record<string, DoctorSeed> = Object.fromEntries(
  DOCTOR_DIRECTORY.map((entry) => {
    const locale = DOCTOR_LOCALE[entry.id];
    return [
      entry.id,
      generateDoctorSeed(entry.id, entry.name, entry.specialty, locale.lang),
    ];
  })
);

export function getDoctorSeed(userId: string): DoctorSeed | undefined {
  return DOCTOR_SEEDS[userId];
}
