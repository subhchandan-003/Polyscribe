"use client";

import { useState } from "react";
import { Globe, Check, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface LanguageConfig {
  inputLanguages: string[];
  outputLanguage: string;
}

/** All 22 languages in the Eighth Schedule of the Indian Constitution, plus English. */
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", flag: "🇮🇳" },
  { code: "ur", label: "Urdu", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", flag: "🇮🇳" },
  { code: "or", label: "Odia", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", flag: "🇮🇳" },
  { code: "as", label: "Assamese", flag: "🇮🇳" },
  { code: "mai", label: "Maithili", flag: "🇮🇳" },
  { code: "sat", label: "Santali", flag: "🇮🇳" },
  { code: "ks", label: "Kashmiri", flag: "🇮🇳" },
  { code: "ne", label: "Nepali", flag: "🇮🇳" },
  { code: "sd", label: "Sindhi", flag: "🇮🇳" },
  { code: "kok", label: "Konkani", flag: "🇮🇳" },
  { code: "doi", label: "Dogri", flag: "🇮🇳" },
  { code: "mni", label: "Manipuri", flag: "🇮🇳" },
  { code: "brx", label: "Bodo", flag: "🇮🇳" },
  { code: "sa", label: "Sanskrit", flag: "🇮🇳" },
];

const OUTPUT_OPTIONS = [
  { code: "auto", label: "Same as source" },
  ...LANGUAGES,
];

interface LanguageSelectorProps {
  config: LanguageConfig;
  onChange: (config: LanguageConfig) => void;
}

export function LanguageSelector({ config, onChange }: LanguageSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  const toggleLanguage = (code: string) => {
    const current = config.inputLanguages;
    const updated = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    onChange({ ...config, inputLanguages: updated });
  };

  const displayedLanguages = showAll ? LANGUAGES : LANGUAGES.slice(0, 8);

  return (
    <div className="w-full space-y-4">
      {/* Input languages */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Globe className="h-3.5 w-3.5" />
          Consultation Languages
        </label>
        <div className="flex flex-wrap gap-1.5">
          {displayedLanguages.map((lang) => {
            const isSelected = config.inputLanguages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {lang.label}
                {isSelected && <Check className="h-3 w-3 ml-0.5" />}
              </button>
            );
          })}
          <button
            onClick={() => setShowAll((v) => !v)}
            className="px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted transition-colors"
          >
            {showAll ? "Show less" : `+${LANGUAGES.length - 8} more`}
          </button>
        </div>
        {config.inputLanguages.length === 0 && (
          <p className="text-[11px] text-muted-foreground mt-2">
            Select expected languages, or leave empty for auto-detection
          </p>
        )}
      </div>

      {/* Output language */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Languages className="h-3.5 w-3.5" />
          Output Note Language
        </label>
        <Select
          value={config.outputLanguage}
          onValueChange={(value) => {
            if (value) onChange({ ...config, outputLanguage: value });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OUTPUT_OPTIONS.map((opt) => (
              <SelectItem key={opt.code} value={opt.code}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function getLanguageNames(codes: string[]): string[] {
  return codes.map(
    (c) => LANGUAGES.find((l) => l.code === c)?.label ?? c
  );
}

export function getOutputLanguageName(code: string): string {
  if (code === "auto") return "same as source";
  return OUTPUT_OPTIONS.find((o) => o.code === code)?.label ?? code;
}
