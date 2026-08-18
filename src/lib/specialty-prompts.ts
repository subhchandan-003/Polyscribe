export type Specialty =
  | "general"
  | "cardiology"
  | "pediatrics"
  | "ent"
  | "dermatology";

export interface SpecialtyInfo {
  id: Specialty;
  label: string;
  icon: string;
  description: string;
}

export const SPECIALTIES: SpecialtyInfo[] = [
  {
    id: "general",
    label: "General Practice",
    icon: "🩺",
    description: "General consultations, broad symptom coverage",
  },
  {
    id: "cardiology",
    label: "Cardiology",
    icon: "❤️",
    description: "Cardiovascular, chest pain, ECG, BP",
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    icon: "👶",
    description: "Growth, immunization, developmental milestones",
  },
  {
    id: "ent",
    label: "ENT",
    icon: "👂",
    description: "Ear, nose, throat, audiometry, voice",
  },
  {
    id: "dermatology",
    label: "Dermatology",
    icon: "🔬",
    description: "Skin lesions, morphology, distribution patterns",
  },
];

const SPECIALTY_CONTEXT: Record<Specialty, string> = {
  general: `SPECIALTY CONTEXT: General Practice
- Cover all organ systems relevant to the presenting complaint
- Include social history and lifestyle factors when mentioned
- Note any screening or preventive health items discussed
- Document medication reconciliation if applicable
- Flag any red flags or referral needs`,

  cardiology: `SPECIALTY CONTEXT: Cardiology
- SUBJECTIVE: Characterize chest pain using the 7 attributes (location, quality, severity, timing, onset, aggravating/relieving factors, associated symptoms). Document dyspnea class (NYHA if applicable), palpitations, syncope/presyncope, edema, orthopnea, PND
- OBJECTIVE: Prioritize BP (both arms if mentioned), heart rate/rhythm, JVP, heart sounds (S1/S2/S3/S4, murmurs graded I-VI), peripheral pulses, edema grading, lung auscultation for crackles. Note any ECG, echocardiogram, or stress test findings
- ASSESSMENT: Use standard cardiovascular diagnoses. Note risk stratification (HEART score, TIMI, CHA₂DS₂-VASc if relevant). Include ejection fraction if mentioned
- PLAN: Detail antiplatelet/anticoagulant regimens, statin therapy, beta-blockers, ACE-I/ARBs with specific doses. Note cardiac rehab, lifestyle modifications, and follow-up imaging/testing
- MEDICATIONS: Pay special attention to anticoagulant dosing, dual antiplatelet therapy duration, and heart failure medication titration schedules`,

  pediatrics: `SPECIALTY CONTEXT: Pediatrics
- SUBJECTIVE: Include parental/caregiver concerns prominently. Document feeding history (breastfed/formula, weaning), sleep patterns, developmental milestones (motor, speech, social). For older children: school performance, behavioral concerns
- OBJECTIVE: Prioritize growth parameters (weight, height/length, head circumference) with percentiles if mentioned. Fontanelle status for infants. Developmental screening results. Vaccination status
- ASSESSMENT: Use age-appropriate differential diagnoses. Note growth trajectory concerns. Flag developmental delays or red flags
- PLAN: Medication dosing MUST be weight-based (mg/kg) when mentioned. Include immunization catch-up if discussed. Document anticipatory guidance given to parents. Note next well-child visit schedule
- MEDICATIONS: Always note weight-based dosing, formulation (syrup/drops/tablet), and palatability considerations mentioned
- FOLLOW-UP: Include developmental milestones to monitor at next visit`,

  ent: `SPECIALTY CONTEXT: ENT (Ear, Nose & Throat)
- SUBJECTIVE: Characterize hearing loss (unilateral/bilateral, sudden/gradual, conductive/sensorineural symptoms). Document tinnitus (pulsatile/non-pulsatile), vertigo (true rotatory vs lightheadedness, duration, triggers). Nasal symptoms: obstruction (unilateral/bilateral), discharge (nature, blood), smell changes. Throat: dysphagia (solids/liquids), voice changes (hoarseness duration), globus sensation
- OBJECTIVE: Otoscopy findings (TM appearance, mobility, discharge). Anterior rhinoscopy/nasal endoscopy findings. Oropharyngeal examination (tonsils graded 0-4, palate, base of tongue). Neck: lymphadenopathy (levels), thyroid, salivary glands. Audiometry results if available. Flexible nasolaryngoscopy findings
- ASSESSMENT: Use standard ENT diagnoses with laterality. Note hearing loss classification. Grade tonsil/adenoid hypertrophy
- PLAN: Detail surgical vs medical management rationale. Specify audiological follow-up. Note speech therapy referrals if discussed
- MEDICATIONS: Include topical preparations (ear drops, nasal sprays) with specific instructions on administration technique discussed`,

  dermatology: `SPECIALTY CONTEXT: Dermatology
- SUBJECTIVE: Document lesion timeline (acute/chronic/recurrent), symptoms (pruritus, pain, burning), triggers (sun, contact, stress, medications), previous treatments tried and response. Family history of skin conditions. Occupational/environmental exposures
- OBJECTIVE: Describe lesions systematically: morphology (macule/papule/plaque/nodule/vesicle/bulla/pustule/wheal), color, size (measure in mm/cm), shape (round/oval/irregular/annular), border (well-defined/ill-defined), surface (smooth/rough/scaly/crusted), distribution (localized/generalized, symmetric/asymmetric), arrangement (clustered/linear/dermatomal). Use ABCDE criteria for pigmented lesions. Note Fitzpatrick skin type if mentioned. Document dermoscopy findings if available
- ASSESSMENT: Include morphological description in diagnosis. Note differential diagnoses ranked by likelihood. Specify if biopsy is needed for confirmation
- PLAN: Detail topical therapy (vehicle, potency class for steroids, application frequency and duration). Note phototherapy parameters if discussed. Document biopsy plan (type: shave/punch/excisional, site). Include sun protection counseling
- MEDICATIONS: Specify topical vs systemic. For topicals: formulation (cream/ointment/gel/solution), application area and frequency. For systemic: note monitoring requirements (labs for methotrexate, biologics)`,
};

export function getSpecialtyContext(specialty: Specialty): string {
  return SPECIALTY_CONTEXT[specialty];
}
