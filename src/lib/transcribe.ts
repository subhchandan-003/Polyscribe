import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
  ta: "Tamil",
  gu: "Gujarati",
  ur: "Urdu",
  kn: "Kannada",
  ml: "Malayalam",
  or: "Odia",
  pa: "Punjabi",
  as: "Assamese",
  mai: "Maithili",
  sat: "Santali",
  ks: "Kashmiri",
  ne: "Nepali",
  sd: "Sindhi",
  kok: "Konkani",
  doi: "Dogri",
  mni: "Manipuri",
  brx: "Bodo",
  sa: "Sanskrit",
};

export async function cleanupTranscript(
  rawText: string,
  inputLanguages: string[] = []
): Promise<string> {
  const langHint =
    inputLanguages.length > 0
      ? `Expected languages in this consultation: ${inputLanguages.map((c) => LANGUAGE_MAP[c] ?? c).join(", ")}. Use this as a hint for recognizing words, but auto-detect if additional languages appear.`
      : "Auto-detect all languages spoken. No language hint was provided.";

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `You are a medical transcription assistant performing speaker diarization and transcript cleanup for a MULTILINGUAL clinical consultation.

The following is raw speech-to-text output from a doctor-patient consultation captured via browser speech recognition. The audio was a continuous stream with no speaker labels.

RAW SPEECH TEXT:
${rawText}

LANGUAGE CONTEXT:
${langHint}

SPEAKER IDENTIFICATION RULES:
- The FIRST speaker is ALWAYS the Doctor
- Use conversational context to identify speaker turns throughout:
  * Doctor: asks clinical questions, gives medical instructions, discusses diagnoses, prescribes medication, mentions examination findings
  * Patient: reports symptoms, describes pain/discomfort, answers questions about medical history, expresses concerns
- When a speaker change is detected (shift from questioning to answering, or from reporting to instructing), label the new speaker accordingly
- If uncertain about a speaker change, maintain the current speaker

MULTILINGUAL RULES:
- Detect and note ALL languages at the very first line as: [Language: detected language(s)]
- Preserve EVERY language exactly as spoken — do NOT translate anything
- If code-switching occurs (e.g., "Your BP is high, take this dawai morning and night, theek hai?"), preserve the exact mix
- For Indian-language words captured in romanized form by speech recognition (e.g. Hindi "dawai", Tamil "marunthu"), keep them romanized rather than transliterating into native script
- For medical terms spoken in English within a non-English conversation, keep them in English
- Recognize common colloquial medical vocabulary across Indian languages — e.g. Hindi: dawai (medicine), bukhar (fever), dard (pain), pet (stomach); Tamil: marunthu (medicine), kaichal (fever), vali (pain); Bengali: oshudh (medicine), jor (fever); Telugu: mandu (medicine), jwaram (fever) — and apply the same recognition principle to any other Indian language spoken in the consultation

TRANSCRIPT CLEANUP RULES:
- Fix grammar, punctuation, and sentence structure while preserving the original language
- Label each speaker turn as "Doctor:" or "Patient:"
- Preserve ALL medically relevant content — do not omit any symptoms, vitals, medications, or instructions
- Fix obvious speech recognition errors (e.g., "blood pressure one twenty over eighty" → "blood pressure 120/80")
- Keep the natural conversational flow including code-switching
- Do NOT add any information not present in the raw text
- Do NOT summarize — keep the full conversation
- Output plain text only, no markdown formatting`,
      },
    ],
  });

  // Claude Sonnet 5 runs adaptive thinking by default, so a `thinking` block
  // can precede the `text` block — don't assume content[0] is the answer.
  const content = message.content.find((block) => block.type === "text");
  if (!content) {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}
