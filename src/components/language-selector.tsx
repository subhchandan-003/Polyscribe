"use client";

import { useState } from "react";
import { X, Globe, Check } from "lucide-react";

export interface LanguageConfig {
  inputLanguages: string[];
  outputLanguage: string;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "zh", label: "Mandarin", flag: "🇨🇳" },
  { code: "ms", label: "Malay", flag: "🇲🇾" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇮🇳" },
];

const OUTPUT_OPTIONS = [
  { code: "auto", label: "Same as source" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "zh", label: "Mandarin" },
  { code: "ms", label: "Malay" },
  { code: "ar", label: "Arabic" },
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

  const displayedLanguages = showAll ? LANGUAGES : LANGUAGES.slice(0, 5);

  return (
    <div className="w-full max-w-lg space-y-4">
      {/* Input languages */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Globe className="h-3.5 w-3.5" />
          Consultation Languages
        </label>
        <div className="flex flex-wrap gap-2">
          {displayedLanguages.map((lang) => {
            const isSelected = config.inputLanguages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                {lang.label}
                {isSelected && <Check className="h-3 w-3 ml-0.5" />}
              </button>
            );
          })}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted transition-colors"
            >
              +{LANGUAGES.length - 5} more
            </button>
          )}
        </div>
        {config.inputLanguages.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Select expected languages, or leave empty for auto-detection
          </p>
        )}
      </div>

      {/* Output language */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5 block">
          Output Note Language
        </label>
        <div className="flex flex-wrap gap-2">
          {OUTPUT_OPTIONS.map((opt) => {
            const isSelected = config.outputLanguage === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => onChange({ ...config, outputLanguage: opt.code })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
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
