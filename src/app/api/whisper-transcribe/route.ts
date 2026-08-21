import { NextRequest, NextResponse } from "next/server";
import { transcribeWithWhisper } from "@/lib/whisper";

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Whisper transcription is not configured" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");
    const language = formData.get("language");

    if (!(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const transcript = await transcribeWithWhisper(audio, {
      language: typeof language === "string" && language ? language : undefined,
    });

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Whisper transcription error:", error);
    const message = error instanceof Error ? error.message : "Whisper transcription failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
