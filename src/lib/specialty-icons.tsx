import { Stethoscope, HeartPulse, Baby, Ear, Microscope, type LucideIcon } from "lucide-react";
import type { Specialty } from "./specialty-prompts";

export const SPECIALTY_ICONS: Record<Specialty, LucideIcon> = {
  general: Stethoscope,
  cardiology: HeartPulse,
  pediatrics: Baby,
  ent: Ear,
  dermatology: Microscope,
};

/** Each specialty gets its own warm accent so the console feels alive,
 * while staying inside the blue-green brand family. */
export const SPECIALTY_COLORS: Record<Specialty, { bg: string; text: string; ring: string }> = {
  general: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-400/40" },
  cardiology: { bg: "bg-rose-50", text: "text-rose-500", ring: "ring-rose-400/40" },
  pediatrics: { bg: "bg-amber-50", text: "text-amber-500", ring: "ring-amber-400/40" },
  ent: { bg: "bg-sky-50", text: "text-sky-500", ring: "ring-sky-400/40" },
  dermatology: { bg: "bg-violet-50", text: "text-violet-500", ring: "ring-violet-400/40" },
};
