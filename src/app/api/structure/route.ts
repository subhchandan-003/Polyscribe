import { NextRequest, NextResponse } from "next/server";
import { structureSOAPNote } from "@/lib/claude";
import type { Specialty } from "@/lib/specialty-prompts";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { transcript, outputLanguage, specialty } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    if (transcript.trim().length < 10) {
      return NextResponse.json(
        { error: "Transcript is too short to generate a SOAP note." },
        { status: 400 }
      );
    }

    const validSpecialties = ["general", "cardiology", "pediatrics", "ent", "dermatology"];
    const spec: Specialty = validSpecialties.includes(specialty) ? specialty : "general";

    // Race against a 90-second timeout (SOAP generation is heavier)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const soapNote = await structureSOAPNote(
        transcript,
        typeof outputLanguage === "string" ? outputLanguage : "en",
        spec
      );
      clearTimeout(timeout);
      return NextResponse.json({ soapNote });
    } catch (err) {
      clearTimeout(timeout);
      if (controller.signal.aborted) {
        return NextResponse.json(
          { error: "SOAP generation timed out. Please try again with a shorter transcript." },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Structuring error:", error);
    const message =
      error instanceof Error ? error.message : "SOAP structuring failed";

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
