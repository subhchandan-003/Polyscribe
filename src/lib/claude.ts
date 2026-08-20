import Anthropic from "@anthropic-ai/sdk";
import { getSOAPPrompt } from "./prompts";
import type { Specialty } from "./specialty-prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  medications: string;
  followUp: string;
}

export async function structureSOAPNote(
  transcript: string,
  outputLanguage: string = "en",
  specialty: Specialty = "general"
): Promise<SOAPNote> {
  if (!transcript || transcript.trim().length < 10) {
    throw new Error(
      "Transcript is too short to generate a meaningful SOAP note. Please record a longer consultation."
    );
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: getSOAPPrompt(transcript, outputLanguage, specialty),
      },
    ],
  });

  // Claude Sonnet 5 runs adaptive thinking by default, so a `thinking` block
  // can precede the `text` block, so don't assume content[0] is the answer.
  const content = message.content.find((block) => block.type === "text");
  if (!content) {
    throw new Error("Unexpected response type from Claude");
  }

  // Robust JSON extraction, handles markdown fences and leading text
  let jsonText = content.text.trim();
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  }

  let parsed: SOAPNote;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Try to extract JSON object from surrounding text
    const braceMatch = jsonText.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        parsed = JSON.parse(braceMatch[0]);
      } catch {
        throw new Error(
          "Could not parse SOAP note from AI response. Please try again."
        );
      }
    } else {
      throw new Error(
        "AI returned an unexpected format. Please try again."
      );
    }
  }

  // Validate required fields exist
  const required: (keyof SOAPNote)[] = [
    "subjective",
    "objective",
    "assessment",
    "plan",
    "medications",
    "followUp",
  ];
  for (const key of required) {
    if (typeof parsed[key] !== "string") {
      parsed[key] = parsed[key] ? String(parsed[key]) : "Not documented";
    }
  }

  return parsed;
}
