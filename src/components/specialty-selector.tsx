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
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
        Specialty Template
      </label>
      <div className="grid grid-cols-3 gap-x-1 gap-y-3">
        {SPECIALTIES.map((spec) => {
          const isSelected = value === spec.id;
          const Icon = SPECIALTY_ICONS[spec.id];
          const colors = SPECIALTY_COLORS[spec.id];
          return (
            <button
              key={spec.id}
              onClick={() => onChange(spec.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${colors.bg} ${colors.text} ${
                  isSelected
                    ? `ring-2 ring-offset-2 ring-offset-card ${colors.ring} scale-105`
                    : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`text-[10.5px] font-medium leading-tight text-center ${
                  isSelected ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {spec.label === "General Practice" ? "General" : spec.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
