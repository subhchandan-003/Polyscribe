"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { useAppMode, type AppMode } from "@/lib/app-mode";
import { SPECIALTIES, type Specialty } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";
import { DOCTOR_DIRECTORY } from "@/lib/doctor-directory";
import { Avatar } from "@/components/ui/avatar";
import {
  Stethoscope,
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Sparkles,
  Activity,
  Zap,
  FlaskConical,
  Rocket,
  Users,
  Check,
} from "lucide-react";

type Tab = "doctor" | "patient";

interface QuickLoginDoctor {
  name: string;
  email: string;
  password: string;
  specialty: Specialty;
  language: string;
}

/* Five doctors, five specialties, five consulting languages, one tap
 * each to sign in. Their histories and stats are pre-seeded and kept
 * fully separate per doctor (see seed-sessions.ts). */
const QUICK_LOGIN_DOCTORS: QuickLoginDoctor[] = [
  { name: "Dr. Priya Sharma", email: "doctor@polyscribe.io", password: "doctor123", specialty: "general", language: "Hindi" },
  { name: "Dr. Kavita Iyer", email: "kavita.iyer@polyscribe.io", password: "doctor123", specialty: "cardiology", language: "Tamil" },
  { name: "Dr. Rohan Verma", email: "rohan.verma@polyscribe.io", password: "doctor123", specialty: "pediatrics", language: "Marathi" },
  { name: "Dr. Ananya Reddy", email: "ananya.reddy@polyscribe.io", password: "doctor123", specialty: "ent", language: "Telugu" },
  { name: "Dr. Vikram Nair", email: "vikram.nair@polyscribe.io", password: "doctor123", specialty: "dermatology", language: "Malayalam" },
];

interface QuickLoginPatient {
  name: string;
  email: string;
  password: string;
  focus: string;
  visits: number;
}

/* Five patients, each with a different care-team makeup and their own
 * pre-seeded, shared consultation history (see seed-sessions.ts). */
const QUICK_LOGIN_PATIENTS: QuickLoginPatient[] = [
  { name: "Rahul Mehta", email: "patient@polyscribe.io", password: "patient123", focus: "General, Cardiology & Dermatology", visits: 3 },
  { name: "Anjali Nair", email: "anjali.nair@polyscribe.io", password: "patient123", focus: "Pediatric care", visits: 3 },
  { name: "Suresh Kumar", email: "suresh.kumar@polyscribe.io", password: "patient123", focus: "ENT care", visits: 3 },
  { name: "Meera Pillai", email: "meera.pillai@polyscribe.io", password: "patient123", focus: "General & Cardiology", visits: 3 },
  { name: "Arjun Das", email: "arjun.das@polyscribe.io", password: "patient123", focus: "Cardiology & Dermatology", visits: 3 },
];

/* Heartbeat trace, shared decorative motif */
function TraceLine() {
  return (
    <svg
      viewBox="0 0 200 24"
      className="w-44 h-6 text-primary/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M0,12 L30,12 L34,12 L38,4 L42,20 L46,2 L50,22 L54,12 L58,12 L120,12 L124,12 L128,7 L132,17 L136,4 L140,20 L144,12 L148,12 L200,12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const { mode, setMode } = useAppMode();
  const [tab, setTab] = useState<Tab>("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLaunch = mode === "launch";
  const isDoctor = isLaunch ? true : tab === "doctor";

  const handleModeSwitch = (next: AppMode) => {
    setMode(next);
    if (next === "launch") handleTabSwitch("doctor");
  };

  const handleDirectoryPick = (doctor: { email: string; password: string }) => {
    setEmail(doctor.email);
    setPassword(doctor.password);
    setError(null);
  };

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

  const handleQuickLogin = (account: { email: string; password: string }) => {
    setError(null);
    setIsSubmitting(true);
    const result = login(account.email, account.password);
    if (!result.success) setError(result.error ?? "Login failed");
    setIsSubmitting(false);
  };

  const handleTabSwitch = (newTab: Tab) => {
    setTab(newTab);
    setEmail("");
    setPassword("");
    setError(null);
  };

  const copy = isDoctor
    ? {
        heading: "Welcome back, Doctor",
        subheading: "Sign in to access consultation tools and SOAP note generation",
        emailLabel: "Work Email",
        emailPlaceholder: "doctor@polyscribe.io",
        btnText: "Access Clinical Portal",
        securityNote: "DPDP Act 2023 compliant, no raw audio stored",
      }
    : {
        heading: "Welcome back",
        subheading: "View your consultation notes and health records",
        emailLabel: "Email Address",
        emailPlaceholder: "patient@polyscribe.io",
        btnText: "View My Health Portal",
        securityNote: "Your health data is private and securely encrypted",
      };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="gradient-mesh" />
      <div className="gradient-mesh-blob-3" />

      {/* ── Mode toggle ── */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center p-1 rounded-full glass gap-1">
        {(["beta", "launch"] as AppMode[]).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => handleModeSwitch(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                active
                  ? "bg-gradient-brand text-primary-foreground shadow-sm shadow-teal-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "beta" ? <FlaskConical className="h-3.5 w-3.5" /> : <Rocket className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{m === "beta" ? "Beta Testing" : "Launch Product"}</span>
            </button>
          );
        })}
      </div>

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pt-14 pb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-11 w-11 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-teal-500/30"
          >
            <Activity className="h-5.5 w-5.5 text-white" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-gradient-brand">
            PolyScribe
          </h1>
        </div>

        <div className="flex items-center justify-center">
          <TraceLine />
        </div>
        <p className="text-sm mt-2 text-muted-foreground font-medium">
          {isDoctor ? "AI-Powered Clinical Documentation" : "Your Personal Health Records"}
        </p>
      </motion.div>

      {/* ── Login panel ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch justify-center gap-6 px-6 pt-2 pb-16 relative max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full max-w-md rounded-3xl glass-strong overflow-hidden mx-auto lg:mx-0 flex flex-col"
        >
          {/* ── Tabs — doctor-only in Launch Product mode, no patient login ── */}
          {isLaunch ? (
            <div className="flex items-center gap-2 p-4 pb-2 text-primary">
              <Stethoscope className="h-4 w-4" />
              <span className="text-sm font-semibold">Doctor Login</span>
            </div>
          ) : (
            <div className="flex gap-1.5 p-2">
              {(["doctor", "patient"] as Tab[]).map((t) => {
                const active = tab === t;
                const Icon = t === "doctor" ? Stethoscope : Heart;
                return (
                  <button
                    key={t}
                    onClick={() => handleTabSwitch(t)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold cursor-pointer transition-colors duration-300 ${
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="login-tab-bg"
                        className="absolute inset-0 rounded-2xl bg-gradient-brand shadow-md shadow-teal-500/25"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{t === "doctor" ? "Doctor Login" : "Patient Login"}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Form ── */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isDoctor ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 pt-4 flex-1 flex flex-col space-y-5"
            >
              <div className="text-center mb-1">
                <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">{copy.heading}</h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {copy.subheading}
                </p>
              </div>

              {/* ── Inputs ── */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                    {copy.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-input bg-white/70 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full h-11 px-4 pr-11 rounded-xl border border-input bg-white/70 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
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
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive rounded-xl border border-destructive/25 bg-destructive/8 px-3.5 py-2.5"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-brand shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 transition-shadow duration-300 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Signing in…" : copy.btnText}
              </motion.button>

              {/* Demo credentials + security note settle to the bottom of the
                  card, so both login panels match the quick-login panel's
                  height instead of leaving an awkward gap or falling short. */}
              <div className="mt-auto space-y-4">
                {!isLaunch && (
                  <div className="pt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="w-full text-xs font-medium text-muted-foreground py-2.5 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Use demo {tab} credentials
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-center text-muted-foreground/80 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  {copy.securityNote}
                </p>
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* ── Right panel: Doctor Directory in Launch mode, Quick Login in Beta mode ── */}
        <AnimatePresence mode="wait">
          {isLaunch ? (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="w-full max-w-md rounded-3xl glass-strong overflow-hidden p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-base font-bold text-foreground">Doctor Directory</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Select your name to fill in your credentials, then confirm to sign in.
              </p>

              <div className="space-y-2 my-auto max-h-[420px] overflow-y-auto pr-1">
                {DOCTOR_DIRECTORY.map((doc) => {
                  const Icon = SPECIALTY_ICONS[doc.specialty];
                  const colors = SPECIALTY_COLORS[doc.specialty];
                  const specialtyLabel = SPECIALTIES.find((s) => s.id === doc.specialty)?.label ?? doc.specialty;
                  const selected = email.trim().toLowerCase() === doc.email;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleDirectoryPick(doc)}
                      className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-colors duration-300 cursor-pointer ${
                        selected ? "bg-accent ring-2 ring-primary/30" : "hover:bg-muted/60"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{specialtyLabel}</p>
                      </div>
                      {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="w-full max-w-md rounded-3xl glass-strong overflow-hidden p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-base font-bold text-foreground">Quick Login</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {isDoctor
                  ? "Jump straight in as one of five demo doctors, each with their own specialty, language, and consultation history."
                  : "Jump straight in as one of five demo patients, each with their own care team and shared consultation history."}
              </p>

              <div className="space-y-2 my-auto">
                {isDoctor
                  ? QUICK_LOGIN_DOCTORS.map((doctor) => {
                      const Icon = SPECIALTY_ICONS[doctor.specialty];
                      const colors = SPECIALTY_COLORS[doctor.specialty];
                      const specialtyLabel =
                        SPECIALTIES.find((s) => s.id === doctor.specialty)?.label ?? doctor.specialty;
                      return (
                        <button
                          key={doctor.email}
                          type="button"
                          onClick={() => handleQuickLogin(doctor)}
                          disabled={isSubmitting}
                          className="w-full flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-muted/60 transition-colors duration-300 cursor-pointer disabled:opacity-60"
                        >
                          <div className={`h-10 w-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{specialtyLabel}</p>
                          </div>
                          <span className="text-xs font-medium text-primary rounded-full bg-accent px-2.5 py-1 shrink-0">
                            {doctor.language}
                          </span>
                        </button>
                      );
                    })
                  : QUICK_LOGIN_PATIENTS.map((patient) => (
                      <button
                        key={patient.email}
                        type="button"
                        onClick={() => handleQuickLogin(patient)}
                        disabled={isSubmitting}
                        className="w-full flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-muted/60 transition-colors duration-300 cursor-pointer disabled:opacity-60"
                      >
                        <Avatar name={patient.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{patient.focus}</p>
                        </div>
                        <span className="text-xs font-medium text-primary rounded-full bg-accent px-2.5 py-1 shrink-0">
                          {patient.visits} visits
                        </span>
                      </button>
                    ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <footer className="py-5 relative">
        <p className="text-center text-xs text-muted-foreground/70">
          PolyScribe is built for India&apos;s DPDP Act 2023 compliance
        </p>
      </footer>
    </div>
  );
}
