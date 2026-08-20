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
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "mr", label: "Marathi" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "gu", label: "Gujarati" },
  { code: "ur", label: "Urdu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "or", label: "Odia" },
  { code: "pa", label: "Punjabi" },
  { code: "as", label: "Assamese" },
  { code: "mai", label: "Maithili" },
  { code: "sat", label: "Santali" },
  { code: "ks", label: "Kashmiri" },
  { code: "ne", label: "Nepali" },
  { code: "sd", label: "Sindhi" },
  { code: "kok", label: "Konkani" },
  { code: "doi", label: "Dogri" },
  { code: "mni", label: "Manipuri" },
  { code: "brx", label: "Bodo" },
  { code: "sa", label: "Sanskrit" },
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
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2.5">
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-brand text-primary-foreground shadow-sm shadow-teal-500/25"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {lang.label}
                {isSelected && <Check className="h-3 w-3 ml-0.5" />}
              </button>
            );
          })}
          <button
            onClick={() => setShowAll((v) => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-primary bg-muted/40 hover:bg-accent transition-colors duration-300 cursor-pointer"
          >
            {showAll ? "Show less" : `+${LANGUAGES.length - 8} more`}
          </button>
        </div>
        {config.inputLanguages.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2.5">
            Select expected languages, or leave empty for auto-detection
          </p>
        )}
      </div>

      {/* Output language */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5 flex items-center gap-1.5">
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
