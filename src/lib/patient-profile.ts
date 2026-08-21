export interface PatientProfile {
  age?: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: string;
}

const key = (userId: string) => `polyscribe_patient_profile_${userId}`;

export function getPatientProfile(userId: string): PatientProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePatientProfile(userId: string, profile: PatientProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId), JSON.stringify(profile));
}
