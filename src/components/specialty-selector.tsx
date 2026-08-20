"use client";

import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";

interface SpecialtySelectorProps {
  value: Specialty;
  onChange: (specialty: Specialty) => void;
}

export function SpecialtySelector({ value, onChange }: SpecialtySelectorProps) {
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
