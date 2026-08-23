"use client";

import { useCallback, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  X,
  ExternalLink,
  AlertCircle,
  Paperclip,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  addAttachment,
  removeAttachment,
  getSession,
  type SessionAttachment,
} from "@/lib/sessions";
import { saveAttachmentBlob, getAttachmentBlob, deleteAttachmentBlob } from "@/lib/attachments-db";

type Category = SessionAttachment["category"];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "prescription", label: "Prescription" },
  { key: "lab-report", label: "Lab Report" },
  { key: "scan", label: "Scan / Imaging" },
  { key: "other", label: "Other" },
];

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB, generous for scans/PDFs given IndexedDB
const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconForType(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type === "application/pdf") return FileText;
  return FileIcon;
}

interface DocumentUploadProps {
  userId: string;
  sessionId: string;
}

/** Lets a doctor attach prescriptions, lab reports, and scans to a
 * consultation right after the SOAP note is generated. Doctor-only —
 * uploads happen here and nowhere else; the patient side only ever
 * gets a read-only view (see patient-note-detail.tsx). File content
 * lives in IndexedDB (attachments-db.ts), metadata on the session
 * itself in localStorage. */
export function DocumentUpload({ userId, sessionId }: DocumentUploadProps) {
  const [attachments, setAttachments] = useState<SessionAttachment[]>(
    () => getSession(userId, sessionId)?.attachments ?? []
  );
  const [category, setCategory] = useState<Category>("prescription");
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);
      setBusy(true);
      try {
        for (const file of Array.from(files)) {
          if (file.size > MAX_FILE_BYTES) {
            setError(`${file.name} is over the 15MB limit and was skipped.`);
            continue;
          }
          const id = crypto.randomUUID();
          await saveAttachmentBlob(id, file);
          const attachment: SessionAttachment = {
            id,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            category,
            uploadedAt: Date.now(),
          };
          addAttachment(userId, sessionId, attachment);
          setAttachments((prev) => [...prev, attachment]);
        }
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [userId, sessionId, category]
  );

  const handleRemove = async (attachmentId: string) => {
    removeAttachment(userId, sessionId, attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    await deleteAttachmentBlob(attachmentId).catch(() => {});
  };

  const handleView = async (attachment: SessionAttachment) => {
    const blob = await getAttachmentBlob(attachment.id);
    if (!blob) return;
    // An anchor click opens a blob: URL far more reliably across
    // browsers than window.open(), which can silently fail to resolve
    // the blob in the new tab.
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Paperclip className="h-4 w-4 text-primary" />
        <h3 className="font-heading text-base font-bold text-foreground">Attach Documents</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Upload prescriptions, lab reports, or scans for this consultation. Visible to you and,
        once shared, read-only to the patient.
      </p>

      {/* Category picker */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 cursor-pointer ${
              category === c.key
                ? "bg-gradient-brand text-primary-foreground shadow-sm shadow-teal-500/25"
                : "bg-muted/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 px-4 text-center cursor-pointer transition-colors duration-300 ${
          dragOver ? "border-primary bg-accent/60" : "border-border hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {busy ? "Uploading…" : "Drop files here or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC — up to 15MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive mt-3 rounded-xl border border-destructive/25 bg-destructive/8 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Attached files */}
      {attachments.length > 0 && (
        <div className="space-y-2 mt-4">
          {attachments.map((a) => {
            const Icon = iconForType(a.type);
            const categoryLabel = CATEGORIES.find((c) => c.key === a.category)?.label ?? "Other";
            return (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-2xl p-3 bg-muted/40"
              >
                <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabel} · {formatBytes(a.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleView(a)}
                  className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted cursor-pointer shrink-0"
                  title="View"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(a.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-muted cursor-pointer shrink-0"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
