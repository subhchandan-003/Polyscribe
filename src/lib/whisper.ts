const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

interface GroqTranscriptionResponse {
  text: string;
}

/** Sends recorded consultation audio to Groq's whisper-large-v3 for a more
 * accurate final transcript than the browser's live Web Speech preview.
 * Groq's endpoint is OpenAI-compatible and responds synchronously, so
 * there's no job polling involved. */
export async function transcribeWithWhisper(
  audio: Blob,
  options: { language?: string } = {}
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const form = new FormData();
  form.append("file", audio, "consultation.webm");
  form.append("model", "whisper-large-v3");
  form.append("response_format", "json");
  form.append(
    "prompt",
    "Multilingual doctor-patient medical consultation in India, may include code-switching between English and Indian languages, and clinical terminology."
  );
  if (options.language) form.append("language", options.language);

  const res = await fetch(GROQ_TRANSCRIPTION_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq transcription failed (${res.status}): ${body}`);
  }

  const data: GroqTranscriptionResponse = await res.json();
  if (!data.text || !data.text.trim()) {
    throw new Error("Groq transcription completed with no result");
  }
  return data.text;
}
