"use client";

import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";

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
          return (
            <button
              key={spec.id}
              onClick={() => onChange(spec.id)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                isSelected
                  ? "bg-primary/10 ring-1 ring-primary/30 text-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-base leading-none shrink-0">{spec.icon}</span>
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
