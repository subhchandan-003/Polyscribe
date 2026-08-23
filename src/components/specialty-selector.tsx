"use client";

import { Lock } from "lucide-react";
import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";

interface SpecialtySelectorProps {
  value: Specialty;
  onChange: (specialty: Specialty) => void;
  /** Hospitals mode: each doctor has one fixed specialty and can't
   * switch templates, so render it as a locked badge instead of a picker. */
  locked?: boolean;
}

export function SpecialtySelector({ value, onChange, locked = false }: SpecialtySelectorProps) {
  if (locked) {
    const spec = SPECIALTIES.find((s) => s.id === value);
    const Icon = SPECIALTY_ICONS[value];
    const colors = SPECIALTY_COLORS[value];
    return (
      <div className="w-full">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Specialty Template
        </label>
        <div className={`flex items-center gap-3 rounded-xl p-3 ${colors.bg} ${colors.text}`}>
          <div className="h-9 w-9 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{spec?.label ?? value}</p>
            <p className="text-[11px] opacity-80">Fixed to your specialty</p>
          </div>
          <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
        Specialty Template
      </label>
      <div className="grid grid-cols-3 gap-2">
        {SPECIALTIES.map((spec) => {
          const isSelected = value === spec.id;
          const Icon = SPECIALTY_ICONS[spec.id];
          const colors = SPECIALTY_COLORS[spec.id];
          return (
            <button
              key={spec.id}
              onClick={() => onChange(spec.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `${colors.bg} ${colors.text} ring-2 ${colors.ring} shadow-sm`
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[11px] font-medium text-center leading-tight">
                {spec.label === "General Practice" ? "General" : spec.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
