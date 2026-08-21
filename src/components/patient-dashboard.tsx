"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Clock, Globe, Shield, Heart, Mic, Languages, LogOut, Activity,
  Pencil, Users, Pill, CalendarClock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getPatientSessions, type Session } from "@/lib/sessions";
import { getPatientProfile, savePatientProfile, type PatientProfile } from "@/lib/patient-profile";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";
import { PatientNoteDetail } from "@/components/patient-note-detail";

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", bn: "Bengali", mr: "Marathi", te: "Telugu",
  ta: "Tamil", gu: "Gujarati", ur: "Urdu", kn: "Kannada", ml: "Malayalam",
  or: "Odia", pa: "Punjabi", as: "Assamese", mai: "Maithili", sat: "Santali",
  ks: "Kashmiri", ne: "Nepali", sd: "Sindhi", kok: "Konkani", doi: "Dogri",
  mni: "Manipuri", brx: "Bodo", sa: "Sanskrit",
};

function computeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

/* ── Stat card ── */
function HealthCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-5 relative overflow-hidden stat-card-accent">
      <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center mb-3">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-foreground/80 mt-0.5">{label}</p>
      <p className="text-[11px] text-muted-foreground mt-1 truncate">{sub}</p>
    </Card>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={value ? "font-medium text-foreground" : "text-muted-foreground/50 italic"}>
        {value || "Not set"}
      </span>
    </div>
  );
}

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const [greeting] = useState(computeGreeting);
  const [sessions] = useState<Session[]>(() => (user ? getPatientSessions(user.email) : []));
  const [profile, setProfile] = useState<PatientProfile>(() => (user ? getPatientProfile(user.id) : {}));
  const [profileDraft, setProfileDraft] = useState<PatientProfile>(profile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const firstName = user?.name.split(" ")[0] ?? "there";

  const languagesUsed = Array.from(new Set(sessions.flatMap((s) => s.inputLanguages)));
  const lastVisit = sessions[0];
  const lastVisitSpecialty = lastVisit
    ? SPECIALTIES.find((s) => s.id === lastVisit.specialty)?.label
    : undefined;

  const careTeam = Array.from(
    new Map(
      sessions
        .filter((s) => s.doctorId)
        .map((s) => [
          s.doctorId,
          { doctorId: s.doctorId as string, doctorName: s.doctorName ?? "Doctor", specialty: s.specialty },
        ])
    ).values()
  );

  const medicationVisits = sessions.filter(
    (s) => s.soapNote.medications && !/^(none|no medications?)\b/i.test(s.soapNote.medications.trim())
  );
  const followUpVisits = sessions.filter((s) => s.soapNote.followUp?.trim());

  const handleEditProfile = () => {
    setProfileDraft(profile);
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    savePatientProfile(user.id, profileDraft);
    setProfile(profileDraft);
    setEditingProfile(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="gradient-mesh" />

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 px-3 pt-3 shrink-0">
        <div className="max-w-4xl mx-auto w-full h-14 flex items-center px-4 rounded-2xl glass">
          <div className="h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md shadow-teal-500/25 mr-2.5">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-[15px] font-bold tracking-tight">PolyScribe</span>
          <span className="ml-2.5 text-[10px] font-semibold text-primary rounded-full bg-accent px-2 py-0.5">
            Patient
          </span>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">{user.name}</span>
              <Button variant="ghost" size="icon-sm" onClick={logout} className="text-muted-foreground hover:text-foreground rounded-xl">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* ── Welcome ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-7 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {greeting},
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              <span className="text-gradient-brand">{firstName}</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md leading-relaxed">
              Your health story, organized and always private.
            </p>

            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary rounded-full bg-accent px-3 py-1.5">
                <Shield className="h-3 w-3" />
                End-to-end encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary rounded-full bg-accent px-3 py-1.5">
                DPDP Act 2023 compliant
              </span>
            </div>
          </Card>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <HealthCard
            icon={FileText}
            label="Consultation Notes"
            value={String(sessions.length)}
            sub={sessions.length > 0 ? "Records shared by your doctors" : "None shared yet"}
          />
          <HealthCard
            icon={Clock}
            label="Last Visit"
            value={lastVisit ? formatRelative(lastVisit.timestamp) : "N/A"}
            sub={lastVisitSpecialty ?? "No visits recorded yet"}
          />
          <HealthCard
            icon={Globe}
            label="Languages"
            value={String(languagesUsed.length)}
            sub={languagesUsed.length > 0 ? languagesUsed.map((l) => LANG_NAMES[l] ?? l).join(", ") : "Multilingual consultations"}
          />
        </div>

        {/* ── Profile + Care Team ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your Profile
              </h3>
              {!editingProfile && (
                <button
                  onClick={handleEditProfile}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  title="Edit profile"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Age</label>
                    <input
                      value={profileDraft.age ?? ""}
                      onChange={(e) => setProfileDraft({ ...profileDraft, age: e.target.value })}
                      placeholder="34"
                      className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Blood Group</label>
                    <input
                      value={profileDraft.bloodGroup ?? ""}
                      onChange={(e) => setProfileDraft({ ...profileDraft, bloodGroup: e.target.value })}
                      placeholder="O+"
                      className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Known Allergies</label>
                  <input
                    value={profileDraft.allergies ?? ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, allergies: e.target.value })}
                    placeholder="Penicillin"
                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Emergency Contact</label>
                  <input
                    value={profileDraft.emergencyContact ?? ""}
                    onChange={(e) => setProfileDraft({ ...profileDraft, emergencyContact: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="h-8 text-xs rounded-lg" onClick={handleSaveProfile}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs rounded-lg" onClick={() => setEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <ProfileRow label="Age" value={profile.age} />
                <ProfileRow label="Blood Group" value={profile.bloodGroup} />
                <ProfileRow label="Known Allergies" value={profile.allergies} />
                <ProfileRow label="Emergency Contact" value={profile.emergencyContact} />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              My Care Team
            </h3>
            {careTeam.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 py-6 text-center">No doctors linked yet</p>
            ) : (
              <div className="space-y-3.5">
                {careTeam.map((doc) => {
                  const specInfo = SPECIALTIES.find((s) => s.id === doc.specialty);
                  const Icon = SPECIALTY_ICONS[doc.specialty];
                  const colors = SPECIALTY_COLORS[doc.specialty];
                  return (
                    <div key={doc.doctorId} className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.doctorName}</p>
                        <p className="text-xs text-muted-foreground truncate">{specInfo?.label ?? doc.specialty}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ── Medications + Follow-ups ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Pill className="h-3.5 w-3.5" />
              Medications
            </h3>
            {medicationVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 py-6 text-center">No medications recorded yet</p>
            ) : (
              <div className="space-y-3">
                {medicationVisits.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-muted/40">
                    <p className="text-[11px] text-muted-foreground mb-1">
                      {s.doctorName ?? "Doctor"} · {formatRelative(s.timestamp)}
                    </p>
                    <p className="text-sm text-foreground/85 line-clamp-2">{s.soapNote.medications}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <CalendarClock className="h-3.5 w-3.5" />
              Follow-ups
            </h3>
            {followUpVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 py-6 text-center">Nothing pending</p>
            ) : (
              <div className="space-y-3">
                {followUpVisits.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-primary/8">
                    <p className="text-[11px] text-muted-foreground mb-1">
                      {s.doctorName ?? "Doctor"} · {formatRelative(s.timestamp)}
                    </p>
                    <p className="text-sm text-foreground/85 line-clamp-2">{s.soapNote.followUp}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Recent consultations ── */}
        <Card className="overflow-hidden mb-6">
          <div className="px-6 pt-5 pb-4 border-b border-border/60">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent Consultations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notes shared by your doctors after each visit
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                No consultation records yet
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                After each consultation, your doctor will generate and share
                structured notes here. They will always be private to you.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {[
                  { icon: Shield, text: "Private by default" },
                  { icon: FileText, text: "Structured clinical notes" },
                  { icon: Globe, text: "Multilingual support" },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground rounded-full bg-muted/70 px-2.5 py-1.5"
                  >
                    <Icon className="h-3 w-3" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {sessions.map((s) => {
                const specInfo = SPECIALTIES.find((sp) => sp.id === s.specialty);
                const Icon = SPECIALTY_ICONS[s.specialty];
                const colors = SPECIALTY_COLORS[s.specialty];
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSession(s)}
                    className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className={`h-10 w-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {specInfo?.label ?? "Consultation"}
                        {s.doctorName ? ` · ${s.doctorName}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {s.soapNote.assessment}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelative(s.timestamp)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* ── Activity log ── */}
        <Card className="p-6 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Activity Log
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground/60 py-2">Nothing to show yet</p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-start gap-3 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-foreground/80">
                    Consultation with <span className="font-medium">{s.doctorName ?? "your doctor"}</span> recorded and shared
                    <span className="text-muted-foreground"> · {formatFullDate(s.timestamp)}</span>
                  </p>
                </div>
              ))}
              <div className="flex items-start gap-3 text-xs pt-2 mt-2 border-t border-border/60">
                <Shield className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">
                  Audio is never stored, only structured notes are kept, and only after your consent.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ── How it works ── */}
        <Card className="p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-5">
            How your notes reach you
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Consultation recorded", desc: "Your doctor records the visit with your consent" },
              { icon: Languages, title: "AI structures the note", desc: "Transcribed and organized into a clinical SOAP note" },
              { icon: Heart, title: "Shared with you", desc: "The finished note appears here, private to you" },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-2.5">
                <div className="h-12 w-12 rounded-2xl bg-accent text-primary flex items-center justify-center">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 mt-4 relative">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          PolyScribe protects your health data under India&apos;s DPDP Act 2023
        </div>
      </footer>

      {activeSession && (
        <PatientNoteDetail session={activeSession} onClose={() => setActiveSession(null)} />
      )}
    </div>
  );
}
