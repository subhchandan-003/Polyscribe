import { getSpecialtyContext, type Specialty } from "./specialty-prompts";

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
  auto: "the same language(s) as the transcript",
};

export function getSOAPPrompt(
  transcript: string,
  outputLanguage: string = "en",
  specialty: Specialty = "general"
): string {
  const langName = LANGUAGE_MAP[outputLanguage] ?? outputLanguage;
  const langInstruction =
    outputLanguage === "auto"
      ? "Write the SOAP note in the same language as the consultation transcript. If the transcript contains code-switching, use the dominant language for the note."
      : `Write the SOAP note entirely in ${langName}. All section content must be in ${langName}, using appropriate medical terminology for that language. If the transcript is in a different language, translate the clinical content accurately.`;

  const specialtyContext = getSpecialtyContext(specialty);

  return `You are an expert multilingual clinical documentation assistant. Given the following doctor-patient consultation transcript, generate a structured SOAP note.

TRANSCRIPT:
${transcript}

${specialtyContext}

OUTPUT LANGUAGE:
${langInstruction}

OUTPUT INSTRUCTIONS:
- Return ONLY valid JSON, no markdown, no code fences, no extra text
- Use this exact JSON structure:
{
  "subjective": "Patient's reported symptoms, history, and complaints in clinical language",
  "objective": "Documented vital signs, examination findings, and observable data",
  "assessment": "Clinical assessment and differential diagnosis",
  "plan": "Treatment plan, prescriptions, and next steps",
  "medications": "All medications mentioned with dosage and frequency",
  "followUp": "Follow-up instructions and timeline"
}

CLINICAL DOCUMENTATION RULES:
- Use professional medical terminology appropriate to the output language
- Be concise but thorough, capturing all clinically relevant details from the transcript
- Follow the specialty-specific documentation guidelines above closely
- If a SOAP section has no relevant data in the transcript, write "Not documented in this consultation" (in the output language)
- Do not invent or hallucinate information not present in the transcript
- Medications should include drug name, dosage, route, and frequency when mentioned
- Follow-up should include specific timeframes when mentioned
- Keep medical drug names in their international form (e.g., "Sumatriptan" not translated)
- For non-English output, use standard medical abbreviations common in that language's clinical practice`;
}
