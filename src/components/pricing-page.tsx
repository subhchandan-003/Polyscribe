"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check, ArrowLeft, Sparkles, MapPin, Globe,
  X, Loader2, CheckCircle2, ChevronDown,
} from "lucide-react";

interface PricingPageProps {
  onBack: () => void;
}

/* ── Types ── */
type Region  = "india" | "international";
type Period  = "monthly" | "quarterly" | "halfyearly" | "yearly";

/* ── Nominal discount labels shown on the period selector ── */
const DISCOUNT: Record<Period, number> = {
  monthly: 0, quarterly: 5, halfyearly: 10, yearly: 20,
};

const PERIOD_LABEL: Record<Period, string> = {
  monthly: "Monthly", quarterly: "Quarterly",
  halfyearly: "Half-yearly", yearly: "Yearly",
};

const BILLED_NOTE: Record<Period, string> = {
  monthly:    "billed monthly",
  quarterly:  "billed every 3 months",
  halfyearly: "billed every 6 months",
  yearly:     "billed annually",
};

/* ── Tier definitions ── */
interface Tier {
  id:         string;
  nameIndia:  string;
  nameIntl:   string;
  baseInr:    number | null;
  baseUsd:    number | null;
  period:     string;
  target:     string;
  badge:      string | null;
  highlight:  boolean;
  showIndia:  boolean;
  showIntl:   boolean;
  features:   string[];
  cta:        "trial" | "sales";
}

const TIERS: Tier[] = [
  {
    id: "starter", nameIndia: "India Starter", nameIntl: "Starter",
    baseInr: 1500, baseUsd: 18, period: "/clinician/month",
    target: "Solo GPs, Tier-2/3 Indian clinics",
    badge: null, highlight: false, showIndia: true, showIntl: true,
    features: [
      "3 language support", "200 notes per month",
      "Basic specialty templates", "SOAP note generation",
      "Copy & export (TXT)", "DPDP-compliant architecture",
    ],
    cta: "trial",
  },
  {
    id: "pro", nameIndia: "India Pro", nameIntl: "Pro",
    baseInr: 3500, baseUsd: 42, period: "/clinician/month",
    target: "Tier-1 clinics, multi-doctor practices",
    badge: "Most Popular", highlight: true, showIndia: true, showIntl: true,
    features: [
      "All 10+ languages", "Unlimited notes",
      "All 5 specialty templates", "Session history & search",
      "PDF export & inline editing", "Code-switching support",
      "Priority email support",
    ],
    cta: "trial",
  },
  {
    id: "asean", nameIndia: "ASEAN / Gulf", nameIntl: "ASEAN / Gulf",
    baseInr: null, baseUsd: 80, period: "/clinician/month",
    target: "Singapore, Malaysia, UAE clinics",
    badge: null, highlight: false, showIndia: false, showIntl: true,
    features: [
      "Everything in Pro", "Arabic & Malay optimization",
      "Priority support (< 4h)", "Dedicated onboarding",
      "PDPA-compliant architecture", "Custom branding option",
    ],
    cta: "sales",
  },
  {
    id: "enterprise", nameIndia: "Enterprise", nameIntl: "Enterprise",
    baseInr: null, baseUsd: null, period: "",
    target: "Hospital systems, telemedicine platforms",
    badge: null, highlight: false, showIndia: true, showIntl: true,
    features: [
      "Everything in ASEAN/Gulf", "Volume pricing",
      "EHR integration (Epic, Apollo HIS)", "SLA guarantee (99.9%)",
      "Data processing agreement (DPA)", "On-premise deployment option",
      "Dedicated account manager",
    ],
    cta: "sales",
  },
];

/* ── Clean price lookup table ── */
const PRICE_TABLE: Record<
  string,
  { inr: Record<Period, number | null>; usd: Record<Period, number | null> }
> = {
  starter: {
    inr: { monthly: 1500, quarterly: 1400, halfyearly: 1350, yearly: 1200 },
    usd: { monthly:   18, quarterly:   17, halfyearly:   16, yearly:   14 },
  },
  pro: {
    inr: { monthly: 3500, quarterly: 3300, halfyearly: 3150, yearly: 2800 },
    usd: { monthly:   42, quarterly:   40, halfyearly:   38, yearly:   34 },
  },
  asean: {
    inr: { monthly: null, quarterly: null, halfyearly: null, yearly: null },
    usd: { monthly:   80, quarterly:   76, halfyearly:   72, yearly:   64 },
  },
  enterprise: {
    inr: { monthly: null, quarterly: null, halfyearly: null, yearly: null },
    usd: { monthly: null, quarterly: null, halfyearly: null, yearly: null },
  },
};

const PERIOD_MONTHS: Record<Period, number> = {
  monthly: 1, quarterly: 3, halfyearly: 6, yearly: 12,
};

function fmtInr(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function fmtUsd(n: number) { return `$${n}`; }

function getDisplayPrice(tier: Tier, region: Region, period: Period) {
  const table = PRICE_TABLE[tier.id];
  if (!table) return { main: "Custom", sub: null, usdHint: null };

  if (region === "india") {
    const m = table.inr[period];
    if (m === null) return { main: "Custom", sub: null, usdHint: null };
    const total  = m * PERIOD_MONTHS[period];
    const sub    = period !== "monthly" ? `${fmtInr(total)} ${BILLED_NOTE[period]}` : null;
    const usdB   = table.usd.monthly;
    const usdHint = period === "monthly" && usdB !== null ? `≈ ${fmtUsd(usdB)} USD` : null;
    return { main: fmtInr(m), sub, usdHint };
  }
  const m = table.usd[period];
  if (m === null) return { main: "Custom", sub: null, usdHint: null };
  const total = m * PERIOD_MONTHS[period];
  const sub   = period !== "monthly" ? `${fmtUsd(total)} ${BILLED_NOTE[period]}` : null;
  return { main: fmtUsd(m), sub, usdHint: null };
}

/* ════════════════════════════════════════════════════════════
   SHARED MODAL SHELL
════════════════════════════════════════════════════════════ */
function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-up"
        style={{ animationDuration: "0.15s" }}
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md animate-fade-scale-in">
        {children}
      </div>
    </div>
  );
}

/* ── Reusable labeled input ── */
function Field({
  label, id, type = "text", placeholder, required = true, value, onChange,
}: {
  label: string; id: string; type?: string;
  placeholder: string; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>
  );
}

/* ── Reusable select ── */
function SelectField({
  label, id, value, onChange, options,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground mb-1.5 block">
        {label} <span className="text-destructive">*</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full h-10 pl-3 pr-8 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

/* ── Plan summary pill ── */
function PlanPill({
  tier, region, period, main, sub,
}: {
  tier: Tier; region: Region; period: Period; main: string; sub: string | null;
}) {
  const name = region === "india" ? tier.nameIndia : tier.nameIntl;
  return (
    <div className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3 mb-5">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
          Selected Plan
        </p>
        <p className="text-sm font-bold text-foreground mt-0.5">{name}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary tabular-nums">{main}</p>
        {tier.period && (
          <p className="text-[10px] text-muted-foreground">{tier.period}</p>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FREE TRIAL MODAL
════════════════════════════════════════════════════════════ */
const SPECIALTIES = [
  { value: "", label: "Select specialty…" },
  { value: "general",     label: "General Practice" },
  { value: "cardiology",  label: "Cardiology" },
  { value: "pediatrics",  label: "Pediatrics" },
  { value: "ent",         label: "ENT" },
  { value: "dermatology", label: "Dermatology" },
  { value: "other",       label: "Other" },
];

function TrialModal({
  tier, region, period, main, sub,
  onClose,
}: {
  tier: Tier; region: Region; period: Period;
  main: string; sub: string | null;
  onClose: () => void;
}) {
  const [name,       setName]       = useState("");
  const [clinic,     setClinic]     = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [specialty,  setSpecialty]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    /* Simulate API call */
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  const planName = region === "india" ? tier.nameIndia : tier.nameIntl;

  return (
    <Modal onClose={onClose}>
      <Card className="p-6 border-border">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">
              {submitted ? "You&apos;re all set!" : "Start your 14-day free trial"}
            </h2>
            {!submitted && (
              <p className="text-xs text-muted-foreground mt-0.5">
                No credit card required · Cancel anytime
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-col items-center py-6 gap-4 text-center animate-fade-scale-in">
            <div className="h-16 w-16 rounded-full bg-accent/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Check your inbox</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                We&apos;ve sent your trial activation link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Your {planName} trial starts immediately.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-primary rounded-xl bg-accent/40 px-3 py-2.5 w-full justify-center">
              <Check className="h-3.5 w-3.5" />
              14-day full access · No billing until trial ends
            </div>
            <Button onClick={onClose} className="w-full mt-1">
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Plan summary */}
            <PlanPill tier={tier} region={region} period={period} main={main} sub={sub} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name"   id="trial-name"   placeholder="Dr. Priya Sharma" value={name}  onChange={setName}  />
                <Field label="Clinic Name" id="trial-clinic" placeholder="City Clinic"       value={clinic} onChange={setClinic} />
              </div>
              <Field
                label="Work Email" id="trial-email" type="email"
                placeholder="doctor@clinic.com" value={email} onChange={setEmail}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Phone" id="trial-phone" type="tel"
                  placeholder="+91 98765 43210" required={false}
                  value={phone} onChange={setPhone}
                />
                <SelectField
                  label="Specialty" id="trial-specialty"
                  value={specialty} onChange={setSpecialty}
                  options={SPECIALTIES}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name || !email || !clinic || !specialty}
                className="w-full h-11 mt-1 rounded-xl bg-gradient-brand hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 text-primary-foreground font-semibold text-sm shadow-md shadow-teal-500/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Activating trial…</>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Start Free Trial for {planName}
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground/60">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </>
        )}
      </Card>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════
   CONTACT SALES MODAL
════════════════════════════════════════════════════════════ */
const COUNTRIES = [
  { value: "",  label: "Select country…" },
  { value: "IN", label: "India" },
  { value: "SG", label: "Singapore" },
  { value: "MY", label: "Malaysia" },
  { value: "AE", label: "UAE" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "AU", label: "Australia" },
  { value: "other", label: "Other" },
];

const TEAM_SIZES = [
  { value: "",     label: "Select team size…" },
  { value: "1",    label: "Solo practitioner" },
  { value: "2-5",  label: "2–5 clinicians" },
  { value: "6-20", label: "6–20 clinicians" },
  { value: "21-50",  label: "21–50 clinicians" },
  { value: "50+",  label: "50+ clinicians" },
];

function SalesModal({
  tier, region,
  onClose,
}: {
  tier: Tier; region: Region;
  onClose: () => void;
}) {
  const [name,     setName]     = useState("");
  const [org,      setOrg]      = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [country,  setCountry]  = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [submitted,setSubmitted]= useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  const planName = region === "india" ? tier.nameIndia : tier.nameIntl;
  const canSubmit = name && org && email && country && teamSize;

  return (
    <Modal onClose={onClose}>
      <Card className="p-6 border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">
              {submitted ? "Message received!" : "Talk to our sales team"}
            </h2>
            {!submitted && (
              <p className="text-xs text-muted-foreground mt-0.5">
                We respond within 4 business hours
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-col items-center py-6 gap-4 text-center animate-fade-scale-in">
            <div className="h-16 w-16 rounded-full bg-accent/40 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">We&apos;ll be in touch shortly</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Our sales team will reach out to{" "}
                <span className="font-medium text-foreground">{email}</span>{" "}
                within 4 hours to discuss {planName}.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-primary rounded-xl bg-accent/40 px-3 py-2.5 w-full justify-center">
              <Check className="h-3.5 w-3.5" />
              Average response time: under 4 hours
            </div>
            <Button onClick={onClose} className="w-full mt-1">
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Plan context */}
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 mb-5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm text-foreground/80">
                Enquiring about <span className="font-semibold">{planName}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Your Name"      id="sales-name"   placeholder="Dr. Arjun Mehta" value={name} onChange={setName} />
                <Field label="Organisation"   id="sales-org"    placeholder="Apollo Hospital"  value={org}  onChange={setOrg}  />
              </div>
              <Field
                label="Work Email" id="sales-email" type="email"
                placeholder="arjun@hospital.com" value={email} onChange={setEmail}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Phone" id="sales-phone" type="tel"
                  placeholder="+65 9123 4567" required={false}
                  value={phone} onChange={setPhone}
                />
                <SelectField
                  label="Country" id="sales-country"
                  value={country} onChange={setCountry}
                  options={COUNTRIES}
                />
              </div>
              <SelectField
                label="Team Size" id="sales-team"
                value={teamSize} onChange={setTeamSize}
                options={TEAM_SIZES}
              />

              {/* Message */}
              <div>
                <label htmlFor="sales-msg" className="text-sm font-medium text-foreground mb-1.5 block">
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  ref={textareaRef}
                  id="sales-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your clinic setup, integrations you need, or any questions…"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full h-11 mt-1 rounded-xl bg-gradient-brand hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 text-primary-foreground font-semibold text-sm shadow-md shadow-teal-500/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : (
                  "Send Message"
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground/60">
                We will never share your details with third parties.
              </p>
            </form>
          </>
        )}
      </Card>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════
   PRICING PAGE
════════════════════════════════════════════════════════════ */
type ActiveModal = { kind: "trial" | "sales"; tier: Tier } | null;

export function PricingPage({ onBack }: PricingPageProps) {
  const [region,      setRegion]      = useState<Region>("india");
  const [period,      setPeriod]      = useState<Period>("monthly");
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const visibleTiers = TIERS.filter(
    (t) => (region === "india" ? t.showIndia : t.showIntl)
  );

  const gridCols =
    visibleTiers.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Back ── */}
        <Button
          variant="ghost" size="sm" onClick={onBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to console
        </Button>

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
            Pricing built for emerging markets
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Every AI scribe charges $100–250/month for US doctors. PolyScribe
            starts at ₹1,500 because the other 5.5 billion people deserve
            AI-powered clinical documentation too.
          </p>
        </div>

        {/* ── Controls row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">

          {/* Region selector */}
          <div className="flex items-center p-1 rounded-full bg-muted gap-1">
            {([
              { id: "india",         icon: MapPin, label: "India",         sym: "₹" },
              { id: "international", icon: Globe,  label: "International", sym: "$" },
            ] as const).map(({ id, icon: Icon, label, sym }) => (
              <button
                key={id}
                onClick={() => setRegion(id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  region === id
                    ? "bg-gradient-brand text-primary-foreground shadow-sm shadow-teal-500/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className={region === id ? "font-normal opacity-80" : "text-muted-foreground font-normal"}>{sym}</span>
              </button>
            ))}
          </div>

          {/* Billing period selector */}
          <div className="flex items-center p-1 rounded-full bg-muted gap-1">
            {(["monthly", "quarterly", "halfyearly", "yearly"] as Period[]).map((p) => {
              const disc   = DISCOUNT[p];
              const active = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-gradient-brand text-primary-foreground shadow-sm shadow-teal-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {PERIOD_LABEL[p]}
                  {disc > 0 && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}>
                      -{disc}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Pricing grid ── */}
        <div className={`grid ${gridCols} gap-5 mb-14`}>
          {visibleTiers.map((tier) => {
            const { main, sub, usdHint } = getDisplayPrice(tier, region, period);
            const savings  = DISCOUNT[period];
            const isCustom = main === "Custom";

            return (
              <Card
                key={tier.id}
                className={`relative flex flex-col p-6 card-hover-lift ${
                  tier.highlight ? "card-featured" : ""
                }`}
              >
                {/* Badge slot, in-flow, fixes overlap */}
                <div className="h-6 flex items-center justify-center mb-3">
                  {tier.badge && (
                    <span className="inline-flex items-center text-[10px] font-semibold rounded-full bg-gradient-brand text-primary-foreground px-3 py-1 tracking-wide shadow-sm shadow-teal-500/25">
                      {tier.badge}
                    </span>
                  )}
                </div>

                {/* Name + target */}
                <div className="mb-4">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {region === "india" ? tier.nameIndia : tier.nameIntl}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {tier.target}
                  </p>
                </div>

                {/* Price block */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-bold tracking-tight tabular-nums">
                      {main}
                    </span>
                    {!isCustom && tier.period && (
                      <span className="text-xs text-muted-foreground">{tier.period}</span>
                    )}
                    {!isCustom && savings > 0 && (
                      <span className="inline-flex items-center text-[10px] font-semibold text-primary bg-accent rounded-full px-2 py-0.5 ml-auto">
                        Save {savings}%
                      </span>
                    )}
                  </div>
                  {sub ? (
                    <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
                  ) : !isCustom && period === "monthly" ? (
                    <p className="text-[11px] text-muted-foreground mt-1">billed monthly</p>
                  ) : null}
                  {usdHint && (
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{usdHint}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${tier.highlight ? "text-primary" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA button, wired up */}
                <button
                  onClick={() => setActiveModal({ kind: tier.cta, tier })}
                  className={`w-full h-11 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    tier.highlight
                      ? "bg-gradient-brand hover:shadow-lg hover:shadow-teal-500/30 text-primary-foreground shadow-md shadow-teal-500/20"
                      : "bg-muted/70 hover:bg-muted text-foreground"
                  }`}
                >
                  {tier.cta === "trial" ? "Start Free Trial" : "Contact Sales"}
                </button>
              </Card>
            );
          })}
        </div>

        {/* ── Comparison callout ── */}
        <Card className="p-7 bg-muted/30">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                Why are we 5–10× cheaper than US competitors?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                US AI scribes charge $100–250/clinician/month. PolyScribe uses
                the same foundation models (Claude, Gemini) but optimizes for
                emerging market economics: lean architecture, no on-premise
                overhead, and aggressive prompt efficiency. A doctor in Pune
                seeing 50 patients/day at ₹3,500/month saves 2.5+ hours daily.
                That&apos;s ₹70 per consultation, less than the cost of a chai.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Modals ── */}
      {activeModal?.kind === "trial" && (() => {
        const { main, sub } = getDisplayPrice(activeModal.tier, region, period);
        return (
          <TrialModal
            tier={activeModal.tier}
            region={region}
            period={period}
            main={main}
            sub={sub}
            onClose={() => setActiveModal(null)}
          />
        );
      })()}

      {activeModal?.kind === "sales" && (
        <SalesModal
          tier={activeModal.tier}
          region={region}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
