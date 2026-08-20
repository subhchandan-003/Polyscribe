"use client";

import { useState, useEffect } from "react";
import { getSessions, deleteSession, type Session } from "@/lib/sessions";
import { SPECIALTIES } from "@/lib/specialty-prompts";
import { SPECIALTY_ICONS, SPECIALTY_COLORS } from "@/lib/specialty-icons";
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
} from "lucide-react";

interface SessionHistoryProps {
  onLoadSession: (session: Session) => void;
  onBack: () => void;
}

export function SessionHistory({ onLoadSession, onBack }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions(getSessions());
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
          <h2 className="font-heading text-xl font-semibold tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Session History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sessions.length} consultation{sessions.length !== 1 ? "s" : ""} saved locally
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-muted-foreground/50">
          <FileText className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No saved sessions yet</p>
          <p className="text-xs mt-1">
            Completed consultations will appear here
          </p>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            {Object.entries(grouped).map(([dateLabel, dateSessions]) => (
              <div key={dateLabel}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  {dateLabel}
                </h3>
                <div className="space-y-2">
                  {dateSessions.map((session) => {
                    const spec = getSpecialtyInfo(session.specialty);
                    const SpecIcon = spec ? SPECIALTY_ICONS[spec.id] : Stethoscope;
                    const colors = spec ? SPECIALTY_COLORS[spec.id] : SPECIALTY_COLORS.general;
                    const preview = session.soapNote.assessment.slice(0, 120);
                    return (
                      <Card
                        key={session.id}
                        className="p-4 card-hover-lift cursor-pointer"
                        onClick={() => onLoadSession(session)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Specialty avatar badge */}
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                            <SpecIcon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {spec?.label ?? "General"}
                              </span>
                              {session.patientName && (
                                <span className="text-xs text-muted-foreground">
                                  — {session.patientName}
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
                            <div className="flex items-center gap-2">
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
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
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
