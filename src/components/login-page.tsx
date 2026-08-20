"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Stethoscope,
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Activity,
  Lock,
} from "lucide-react";

type Tab = "doctor" | "patient";

/* ── Tiny ECG path for the doctor header decoration ── */
function EcgLine() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="w-28 h-6 opacity-30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0,12 L18,12 L22,12 L26,4 L30,20 L34,2 L38,22 L42,12 L46,12 L70,12 L74,12 L78,7 L82,17 L86,4 L90,20 L94,12 L98,12 L120,12" />
    </svg>
  );
}

/* ── Soft heartbeat path for the patient header decoration ── */
function HeartbeatLine() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="w-28 h-6 opacity-25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0,12 L30,12 L38,5 L44,19 L50,2 L56,22 L62,12 L90,12 L100,12" />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDoctor = tab === "doctor";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = login(email.trim(), password);
    if (!result.success) setError(result.error ?? "Login failed");
    setIsSubmitting(false);
  };

  const fillDemo = () => {
    setEmail(isDoctor ? "doctor@polyscribe.io" : "patient@polyscribe.io");
    setPassword(isDoctor ? "doctor123" : "patient123");
    setError(null);
  };

  const handleTabSwitch = (newTab: Tab) => {
    setTab(newTab);
    setEmail("");
    setPassword("");
    setError(null);
  };

  /* ── Design tokens per role ── */
  const tokens = isDoctor
    ? {
        pageBg: "bg-gradient-to-br from-slate-50 via-white to-teal-50/40",
        cardShadow: "shadow-xl shadow-teal-100/60 border-teal-200/50",
        topBar: "bg-gradient-to-r from-teal-500/70 via-teal-400/50 to-transparent",
        iconBg: "bg-teal-50 text-teal-700",
        logoRing: "bg-teal-600",
        tabActive: "text-teal-700 border-teal-600 bg-teal-50/60",
        inputFocus: "focus:ring-teal-500/20 focus:border-teal-500",
        btn: "bg-teal-600 hover:bg-teal-700 shadow-teal-200/70",
        demoHover: "hover:text-teal-700",
        subtitle: "text-teal-700/65",
        heading: "Clinical Portal",
        subheading: "Sign in to access consultation tools and SOAP note generation",
        emailLabel: "Work Email",
        emailPlaceholder: "doctor@polyscribe.io",
        btnText: "Access Clinical Portal",
        securityNote: "DPDP Act 2023 compliant — no raw audio stored",
      }
    : {
        pageBg: "bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40",
        cardShadow: "shadow-xl shadow-emerald-100/60 border-emerald-200/50",
        topBar: "bg-gradient-to-r from-emerald-500/70 via-emerald-400/50 to-transparent",
        iconBg: "bg-emerald-50 text-emerald-700",
        logoRing: "bg-emerald-600",
        tabActive: "text-emerald-700 border-emerald-600 bg-emerald-50/60",
        inputFocus: "focus:ring-emerald-500/20 focus:border-emerald-500",
        btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/70",
        demoHover: "hover:text-emerald-700",
        subtitle: "text-emerald-700/65",
        heading: "Health Portal",
        subheading: "View your consultation notes and health records",
        emailLabel: "Email Address",
        emailPlaceholder: "patient@polyscribe.io",
        btnText: "Access My Health Portal",
        securityNote: "Your health data is private and securely encrypted",
      };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-700 ${tokens.pageBg}`}
    >
      {/* ── Page header ── */}
      <div className="py-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-md transition-colors duration-500 ${tokens.logoRing}`}
          >
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">PolyScribe</h1>
        </div>

        {/* Role-aware subtitle with decorative line */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={`transition-colors duration-500 ${tokens.subtitle}`}>
            {isDoctor ? <EcgLine /> : <HeartbeatLine />}
          </span>
        </div>
        <p className={`text-sm mt-1 transition-colors duration-500 ${tokens.subtitle}`}>
          {isDoctor ? "AI-Powered Clinical Documentation" : "Your Personal Health Records"}
        </p>
      </div>

      {/* ── Login card ── */}
      <div className="flex-1 flex items-start justify-center px-6 pt-2 pb-16">
        <Card
          className={`w-full max-w-md p-0 overflow-hidden transition-all duration-500 ${tokens.cardShadow}`}
        >
          {/* ── Tabs ── */}
          <div className="flex border-b border-border">
            {(["doctor", "patient"] as Tab[]).map((t) => {
              const active = tab === t;
              const Icon = t === "doctor" ? Stethoscope : Heart;
              const activeClass =
                t === "doctor"
                  ? "text-teal-700 border-teal-600 bg-teal-50/60"
                  : "text-emerald-700 border-emerald-600 bg-emerald-50/60";
              return (
                <button
                  key={t}
                  onClick={() => handleTabSwitch(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-300 cursor-pointer ${
                    active
                      ? `border-b-2 ${activeClass}`
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      active ? "scale-110" : ""
                    } ${active && t === "patient" ? "animate-pulse-gentle" : ""}`}
                  />
                  {t === "doctor" ? "Doctor Login" : "Patient Login"}
                </button>
              );
            })}
          </div>

          {/* ── Role accent bar ── */}
          <div
            className={`h-[3px] transition-all duration-500 ${tokens.topBar}`}
          />

          {/* ── Form ── */}
          <form
            key={tab}
            onSubmit={handleSubmit}
            className="p-6 space-y-5 animate-tab-content-in"
          >
            {/* Role icon + heading */}
            <div className="text-center mb-1">
              <div
                className={`inline-flex items-center justify-center h-13 w-13 rounded-2xl mb-3 transition-colors duration-500 ${tokens.iconBg}`}
                style={{ height: "3.25rem", width: "3.25rem" }}
              >
                {isDoctor ? (
                  <Activity className="h-6 w-6" />
                ) : (
                  <Shield className="h-6 w-6 animate-pulse-gentle" />
                )}
              </div>
              <h2 className="font-heading text-lg font-semibold">{tokens.heading}</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                {tokens.subheading}
              </p>
            </div>

            {/* ── Inputs ── */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {tokens.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tokens.emailPlaceholder}
                  required
                  className={`w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none transition-all focus:ring-2 ${tokens.inputFocus}`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`w-full h-10 px-3 pr-10 rounded-lg border border-input bg-background text-sm outline-none transition-all focus:ring-2 ${tokens.inputFocus}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-10 rounded-lg font-medium text-sm text-white transition-all duration-200 disabled:opacity-60 active:scale-[0.98] shadow-sm cursor-pointer ${tokens.btn}`}
            >
              {isSubmitting ? "Signing in…" : tokens.btnText}
            </button>

            {/* Demo credentials */}
            <div className="pt-1 border-t border-border">
              <button
                type="button"
                onClick={fillDemo}
                className={`w-full text-xs text-muted-foreground py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${tokens.demoHover}`}
              >
                Use demo {tab} credentials
              </button>
            </div>

            {/* Security micro-note */}
            <p className="text-[10px] text-center text-muted-foreground/55 flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3" />
              {tokens.securityNote}
            </p>
          </form>
        </Card>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-4">
        <p className="text-center text-xs text-muted-foreground">
          PolyScribe — Built for India&apos;s DPDP Act 2023 compliance
        </p>
      </footer>
    </div>
  );
}
