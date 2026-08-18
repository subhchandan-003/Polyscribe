import { NextRequest, NextResponse } from "next/server";
import { cleanupTranscript } from "@/lib/transcribe";

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  try {
    const { rawText, inputLanguages } = await request.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "No transcript text provided" },
        { status: 400 }
      );
    }

    if (rawText.trim().length < 5) {
      return NextResponse.json(
        { error: "Recording was too short. Please speak for at least a few sentences." },
        { status: 400 }
      );
    }

    const languages: string[] = Array.isArray(inputLanguages) ? inputLanguages : [];

    // Race against a 60-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const transcript = await cleanupTranscript(rawText, languages);
      clearTimeout(timeout);
      return NextResponse.json({ transcript });
    } catch (err) {
      clearTimeout(timeout);
      if (controller.signal.aborted) {
        return NextResponse.json(
          { error: "Transcription timed out. Please try a shorter recording." },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Transcription cleanup error:", error);
    const message =
      error instanceof Error ? error.message : "Transcript cleanup failed";

    // Detect network / API key issues
    if (message.includes("401") || message.includes("authentication")) {
      return NextResponse.json(
        { error: "AI service authentication failed. Check API key configuration." },
        { status: 502 }
      );
    }
    if (message.includes("429") || message.includes("rate")) {
      return NextResponse.json(
        { error: "AI service rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
