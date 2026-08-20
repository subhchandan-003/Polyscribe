import { Stethoscope, HeartPulse, Baby, Ear, Microscope, type LucideIcon } from "lucide-react";
import type { Specialty } from "./specialty-prompts";

export const SPECIALTY_ICONS: Record<Specialty, LucideIcon> = {
  general: Stethoscope,
  cardiology: HeartPulse,
  pediatrics: Baby,
  ent: Ear,
  dermatology: Microscope,
};

/** Distinct accent per specialty for circular category badges — bg for the
 * badge fill, text for the icon/label color. Reused wherever a specialty
 * needs a colorful, at-a-glance identity (selector, cards, breakdown). */
export const SPECIALTY_COLORS: Record<Specialty, { bg: string; text: string; ring: string }> = {
  general: { bg: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-200" },
  cardiology: { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-200" },
  pediatrics: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200" },
  ent: { bg: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-200" },
  dermatology: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200" },
};
