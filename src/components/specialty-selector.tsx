"use client";

import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";

interface SpecialtySelectorProps {
  value: Specialty;
  onChange: (specialty: Specialty) => void;
}

export function SpecialtySelector({ value, onChange }: SpecialtySelectorProps) {
  return (
    <div className="w-full max-w-lg">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5 block">
        Specialty Template
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SPECIALTIES.map((spec) => {
          const isSelected = value === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => onChange(spec.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-primary/10 ring-1 ring-primary/30 text-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-lg leading-none">{spec.icon}</span>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : ""}`}>
                  {spec.label}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {spec.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
