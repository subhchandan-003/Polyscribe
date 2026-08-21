"use client";

import { useState } from "react";
import {
  getSessions,
  deleteSession,
  shareSessionWithPatient,
  unshareSessionFromPatient,
  type Session,
} from "@/lib/sessions";
import { useAuth } from "@/lib/auth-context";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS } from "@/lib/specialty-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  FileText,
  Trash2,
  ChevronRight,
  History,
  ArrowLeft,
  Stethoscope,
  Share2,
  X,
  Check,
} from "lucide-react";

interface SessionHistoryProps {
  onLoadSession: (session: Session) => void;
  onBack: () => void;
}

export function SessionHistory({ onLoadSession, onBack }: SessionHistoryProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>(() =>
    user ? getSessions(user.id) : []
  );
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");

  const handleDelete = (id: string) => {
    if (!user) return;
    deleteSession(user.id, id);
    setSessions(getSessions(user.id));
  };

  const handleShare = (id: string) => {
    if (!user || !shareEmail.trim()) return;
    shareSessionWithPatient(user.id, id, shareEmail.trim());
    setSessions(getSessions(user.id));
    setShareOpenId(null);
    setShareEmail("");
  };

  const handleUnshare = (id: string) => {
    if (!user) return;
    unshareSessionFromPatient(user.id, id);
    setSessions(getSessions(user.id));
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatFullDate = (ts: number) => {
    return new Date(ts).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getSpecialtyInfo = (id: string) =>
    SPECIALTIES.find((s) => s.id === id);

  // Group sessions by date
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, session) => {
    const d = new Date(session.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (d.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      key = "Yesterday";
    } else {
      key = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
    (acc[key] ??= []).push(session);
    return acc;
  }, {});

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
            <History className="h-5 w-5 text-primary" />
            Session History
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sessions.length} consultation{sessions.length !== 1 ? "s" : ""} saved locally
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-muted-foreground/50">
          <FileText className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No saved sessions yet</p>
          <p className="text-xs mt-1">
            Completed consultations will appear here
          </p>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            {Object.entries(grouped).map(([dateLabel, dateSessions]) => (
              <div key={dateLabel}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                  {dateLabel}
                </h3>
                <div className="space-y-2.5">
                  {dateSessions.map((session) => {
                    const spec = getSpecialtyInfo(session.specialty);
                    const SpecIcon = spec ? SPECIALTY_ICONS[spec.id] : Stethoscope;
                    const preview = session.soapNote.assessment.slice(0, 120);
                    const isSharing = shareOpenId === session.id;
                    return (
                      <Card
                        key={session.id}
                        className="p-4 card-hover-lift cursor-pointer group"
                        onClick={() => onLoadSession(session)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Specialty icon */}
                          <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
                            <SpecIcon className="h-4.5 w-4.5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {spec?.label ?? "General"}
                              </span>
                              {session.patientName && (
                                <span className="text-xs text-muted-foreground">
                                  · {session.patientName}
                                </span>
                              )}
                              <Badge
                                variant="secondary"
                                className="text-[10px] ml-auto shrink-0"
                              >
                                {formatDate(session.timestamp)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                              {preview}
                              {session.soapNote.assessment.length > 120 ? "…" : ""}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-muted-foreground/70">
                                {formatFullDate(session.timestamp)}
                              </span>
                              {session.duration && (
                                <span className="text-[10px] text-muted-foreground/70 flex items-center gap-0.5">
                                  <Clock className="h-2.5 w-2.5" />
                                  {Math.floor(session.duration / 60)}m{" "}
                                  {session.duration % 60}s
                                </span>
                              )}
                              {session.patientEmail && (
                                <span
                                  className="text-[10px] font-medium text-primary flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnshare(session.id);
                                  }}
                                  title="Click to stop sharing"
                                >
                                  <Check className="h-2.5 w-2.5" />
                                  Shared with {session.patientEmail}
                                  <X className="h-2.5 w-2.5" />
                                </span>
                              )}
                            </div>

                            {/* Share form */}
                            {isSharing && (
                              <div
                                className="flex items-center gap-2 mt-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  autoFocus
                                  type="email"
                                  value={shareEmail}
                                  onChange={(e) => setShareEmail(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleShare(session.id);
                                    if (e.key === "Escape") setShareOpenId(null);
                                  }}
                                  placeholder="patient@polyscribe.io"
                                  className="flex-1 h-8 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                                <Button
                                  size="sm"
                                  className="h-8 rounded-lg text-xs px-3"
                                  onClick={() => handleShare(session.id)}
                                >
                                  Share
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground"
                                  onClick={() => setShareOpenId(null)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!session.patientEmail && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-primary hover:bg-accent"
                                title="Share with patient"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShareEmail("");
                                  setShareOpenId(isSharing ? null : session.id);
                                }}
                              >
                                <Share2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(session.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
