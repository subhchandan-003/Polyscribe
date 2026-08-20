"use client";

import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS } from "@/lib/specialty-icons";

interface SpecialtySelectorProps {
  value: Specialty;
  onChange: (specialty: Specialty) => void;
}

export function SpecialtySelector({ value, onChange }: SpecialtySelectorProps) {
  return (
    <div className="w-full">
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
        Specialty Template
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {SPECIALTIES.map((spec) => {
          const isSelected = value === spec.id;
          const Icon = SPECIALTY_ICONS[spec.id];
          return (
            <button
              key={spec.id}
              onClick={() => onChange(spec.id)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary/10 ring-1 ring-primary/30 text-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : ""}`} />
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${isSelected ? "text-primary" : ""}`}>
                  {spec.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
