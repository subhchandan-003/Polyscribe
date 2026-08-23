import type { Specialty } from "@/lib/specialty-prompts";

export interface DoctorDirectoryEntry {
  id: string;
  name: string;
  email: string;
  specialty: Specialty;
}

/** Every doctor account has one fixed specialty, two doctors per
 * specialty. This is the source of truth both for the Launch Product
 * login directory and for locking the Consultation Setup specialty
 * picker to a doctor's own specialty. */
export const DOCTOR_DIRECTORY: DoctorDirectoryEntry[] = [
  { id: "doc-1", name: "Dr. Priya Sharma", email: "doctor@polyscribe.io", specialty: "general" },
  { id: "doc-2", name: "Dr. Arjun Mehta", email: "arjun.mehta@polyscribe.io", specialty: "general" },
  { id: "doc-3", name: "Dr. Kavita Iyer", email: "kavita.iyer@polyscribe.io", specialty: "cardiology" },
  { id: "doc-7", name: "Dr. Sneha Kapoor", email: "sneha.kapoor@polyscribe.io", specialty: "cardiology" },
  { id: "doc-4", name: "Dr. Rohan Verma", email: "rohan.verma@polyscribe.io", specialty: "pediatrics" },
  { id: "doc-8", name: "Dr. Aditya Rao", email: "aditya.rao@polyscribe.io", specialty: "pediatrics" },
  { id: "doc-5", name: "Dr. Ananya Reddy", email: "ananya.reddy@polyscribe.io", specialty: "ent" },
  { id: "doc-9", name: "Dr. Meera Joshi", email: "meera.joshi@polyscribe.io", specialty: "ent" },
  { id: "doc-6", name: "Dr. Vikram Nair", email: "vikram.nair@polyscribe.io", specialty: "dermatology" },
  { id: "doc-10", name: "Dr. Karan Malhotra", email: "karan.malhotra@polyscribe.io", specialty: "dermatology" },
];

export const DOCTOR_SPECIALTY: Record<string, Specialty> = Object.fromEntries(
  DOCTOR_DIRECTORY.map((d) => [d.id, d.specialty])
);
