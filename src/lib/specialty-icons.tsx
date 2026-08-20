import { Stethoscope, HeartPulse, Baby, Ear, Microscope, type LucideIcon } from "lucide-react";
import type { Specialty } from "./specialty-prompts";

export const SPECIALTY_ICONS: Record<Specialty, LucideIcon> = {
  general: Stethoscope,
  cardiology: HeartPulse,
  pediatrics: Baby,
  ent: Ear,
  dermatology: Microscope,
};
