"use client";

import { useState } from "react";
import { ArrowLeft, Users, FileText, ChevronRight } from "lucide-react";
import { useAuth, getUserNameByEmail } from "@/lib/auth-context";
import { getSessions, getPatientSessions, type Session } from "@/lib/sessions";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS } from "@/lib/specialty-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PatientNoteDetail } from "@/components/patient-note-detail";

interface DoctorPatientsPageProps {
  onBack: () => void;
}

interface PatientSummary {
  email: string;
  name: string;
  sharedByMe: number;
}

/** Launch Product mode: lets a doctor go straight from their own shared
 * sessions to a patient's full record, reusing the same aggregation
 * (getPatientSessions) and detail view the patient portal itself uses. */
export function DoctorPatientsPage({ onBack }: DoctorPatientsPageProps) {
  const { user } = useAuth();
  const [patients] = useState<PatientSummary[]>(() => {
    if (!user) return [];
    const mySessions = getSessions(user.id);
    const counts = new Map<string, { count: number; name: string }>();
    mySessions.forEach((s) => {
      if (!s.patientEmail) return;
      const existing = counts.get(s.patientEmail);
      const name = s.patientName ?? getUserNameByEmail(s.patientEmail) ?? s.patientEmail;
      counts.set(s.patientEmail, { count: (existing?.count ?? 0) + 1, name });
    });
    return Array.from(counts.entries())
      .map(([email, { count, name }]) => ({ email, name, sharedByMe: count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [patientSessions, setPatientSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const handleSelectPatient = (email: string) => {
    setSelectedEmail(email);
    setPatientSessions(getPatientSessions(email));
  };

  const selectedPatient = patients.find((p) => p.email === selectedEmail);

  if (selectedEmail) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEmail(null)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Avatar name={selectedPatient?.name ?? selectedEmail} />
            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight">
                {selectedPatient?.name ?? selectedEmail}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {`${patientSessions.length} consultation${patientSessions.length !== 1 ? "s" : ""} on record`}
              </p>
            </div>
          </div>
        </div>

        {patientSessions.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-muted-foreground/50">
            <FileText className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No records yet</p>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {patientSessions.map((s) => {
              const spec = SPECIALTIES.find((sp) => sp.id === s.specialty);
              const Icon = SPECIALTY_ICONS[s.specialty];
              return (
                <Card
                  key={s.id}
                  className="p-4 card-hover-lift cursor-pointer"
                  onClick={() => setActiveSession(s)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{spec?.label ?? "General"}</span>
                        {s.doctorName && (
                          <span className="text-xs text-muted-foreground">· {s.doctorName}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {s.soapNote.assessment}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeSession && (
          <PatientNoteDetail session={activeSession} onClose={() => setActiveSession(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Patients
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {`${patients.length} patient${patients.length !== 1 ? "s" : ""} you’ve shared notes with`}
          </p>
        </div>
      </div>

      {patients.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-muted-foreground/50">
          <Users className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No patients linked yet</p>
          <p className="text-xs mt-1 text-center max-w-xs">
            Share a consultation note with a patient from Session History to see them here
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {patients.map((p) => (
            <Card
              key={p.email}
              className="p-4 card-hover-lift cursor-pointer"
              onClick={() => handleSelectPatient(p.email)}
            >
              <div className="flex items-center gap-3">
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                </div>
                <span className="text-xs font-medium text-primary rounded-full bg-accent px-2.5 py-1 shrink-0">
                  {`${p.sharedByMe} note${p.sharedByMe !== 1 ? "s" : ""}`}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
