export type SeedLang = "hi" | "ta" | "mr" | "te" | "ml" | "bn" | "kn" | "pa" | "gu" | "or";

interface LangPhrases {
  greeting: string;
  askProblem: string;
  ok: string;
  planIntro: string;
}

/** Small connector-word set per language used to give seeded transcripts a
 * regional voice, in the same code-switched register (native connectors
 * around English clinical terms) that real Indian consultations tend to
 * use — matches the flavor of the original five hand-written seeds. */
export const LANG_STYLE: Record<SeedLang, LangPhrases> = {
  hi: { greeting: "Namaste", askProblem: "kya problem hai aapko?", ok: "Theek hai doctor", planIntro: "Ab" },
  ta: { greeting: "Vanakkam", askProblem: "enna problem?", ok: "Sari doctor", planIntro: "Ippo" },
  mr: { greeting: "Namaskar", askProblem: "kay tras hoto ahe?", ok: "Thik ahe doctor", planIntro: "Ata" },
  te: { greeting: "Namaskaram", askProblem: "emi samasya?", ok: "Sare doctor", planIntro: "Ippudu" },
  ml: { greeting: "Namaskaram", askProblem: "enthanu prashnam?", ok: "Sheri doctor", planIntro: "Ippol" },
  bn: { greeting: "Nomoshkar", askProblem: "ki samasya hocche?", ok: "Thik achhe doctor", planIntro: "Ekhon" },
  kn: { greeting: "Namaskara", askProblem: "enu samasye?", ok: "Sari doctor", planIntro: "Ivaga" },
  pa: { greeting: "Sat sri akal", askProblem: "ki takleef hai?", ok: "Theek hai doctor", planIntro: "Hun" },
  gu: { greeting: "Namaste", askProblem: "shu taklif chhe?", ok: "Saru doctor", planIntro: "Have" },
  or: { greeting: "Namaskar", askProblem: "kana asubidha achhi?", ok: "Thik achhi doctor", planIntro: "Ebe" },
};

/** Assembles a short seeded consultation transcript in the given
 * language's voice around case-specific complaint/exam/plan lines. */
export function buildTranscript(
  lang: SeedLang,
  complaint: string,
  examLine: string,
  planLine: string
): string {
  const s = LANG_STYLE[lang];
  return [
    `Doctor: ${s.greeting}, ${s.askProblem}`,
    `Patient: Doctor, ${complaint}`,
    `Doctor: ${examLine}`,
    `Patient: ${s.ok}.`,
    `Doctor: ${s.planIntro}, ${planLine}`,
  ].join("\n");
}
