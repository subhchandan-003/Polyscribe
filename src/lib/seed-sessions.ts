import type { Session } from "@/lib/sessions";
import type { Specialty } from "@/lib/specialty-prompts";

/**
 * Starter session history for the five quick-login doctors, one per
 * specialty and consulting language. Each doctor's history is scoped
 * to their own user id (see sessions.ts), so this data only ever
 * seeds an empty history the first time that doctor logs in — it
 * never overwrites real recorded sessions.
 */

type SeedSession = Omit<Session, "id" | "timestamp"> & { daysAgo: number };

interface DoctorSeed {
  specialty: Specialty;
  language: string;
  sessions: SeedSession[];
}

export const DOCTOR_SEEDS: Record<string, DoctorSeed> = {
  // Dr. Priya Sharma — General Practice — Hindi — Delhi
  "doc-1": {
    specialty: "general",
    language: "hi",
    sessions: [
      {
        daysAgo: 1,
        specialty: "general",
        inputLanguages: ["hi"],
        outputLanguage: "en",
        duration: 312,
        transcript:
          "Doctor: Namaste, kya problem hai aapko?\nPatient: Doctor sahab, teen din se bukhar hai aur pura sharir dukh raha hai.\nDoctor: Khaansi ya gala kharab bhi hai?\nPatient: Halka sa gala kharab hai, khaansi nahi hai.\nDoctor: Theek hai, temperature check karte hain. 100.8 F hai. BP normal hai, 118/76. Yeh viral fever lag raha hai.\nPatient: Kitne din lagenge thik hone mein?\nDoctor: Teen se paanch din mein theek ho jaayega. Paracetamol dijiyega bukhar ke liye aur aaram kariye, paani zyada piyiye.",
        soapNote: {
          subjective:
            "Patient reports 3 days of fever with generalized body ache. Mild sore throat present, no cough.",
          objective:
            "Temperature 100.8F. BP 118/76, pulse regular. Throat mildly erythematous, no exudate. Chest clear on auscultation.",
          assessment:
            "Viral febrile illness, likely self-limiting upper respiratory viral infection.",
          plan:
            "Symptomatic management, adequate hydration, and rest. Review in 3 to 5 days if fever persists or worsens.",
          medications:
            "Paracetamol 650mg every 6 hours as needed for fever, up to 4 days.",
          followUp:
            "Return if fever persists beyond 5 days, or if breathing difficulty or high-grade fever develops.",
        },
      },
      {
        daysAgo: 6,
        specialty: "general",
        inputLanguages: ["hi"],
        outputLanguage: "en",
        duration: 405,
        transcript:
          "Doctor: Namaste, sugar report kaisa aaya?\nPatient: Fasting 142 aaya hai, pehle se thoda zyada hai.\nDoctor: Diet aur exercise kaisi chal rahi hai?\nPatient: Walk toh roz karta hoon, par mithai kam nahi kar paaya.\nDoctor: Samajh sakta hoon. Metformin ki dose thodi badhaate hain, aur meetha strictly avoid kariye. Ek mahine baad phir se sugar test karvaiye.",
        soapNote: {
          subjective:
            "Patient with known type 2 diabetes returns for routine follow-up. Reports difficulty maintaining dietary sugar restriction despite regular walking.",
          objective:
            "Fasting blood glucose 142 mg/dL, mildly elevated from previous reading. Weight stable. No signs of diabetic complications on exam.",
          assessment:
            "Suboptimal glycemic control, likely dietary in origin, in an otherwise stable type 2 diabetic.",
          plan:
            "Increase metformin dose, reinforce dietary counseling around sugar intake, continue current exercise routine.",
          medications: "Metformin 1000mg twice daily (increased from 500mg twice daily).",
          followUp: "Repeat fasting blood glucose and HbA1c in 4 weeks.",
        },
      },
      {
        daysAgo: 11,
        specialty: "general",
        inputLanguages: ["hi"],
        outputLanguage: "en",
        duration: 268,
        transcript:
          "Doctor: Kya takleef hai?\nPatient: Sardi lagi hai, naak bah rahi hai aur halki khaansi hai.\nDoctor: Bukhar hai kya?\nPatient: Nahi, bukhar nahi hai.\nDoctor: Chest saaf hai, koi infection nahi lag raha. Yeh common cold hai, apne aap theek ho jaayega. Steam lijiye aur zaroorat pade toh cough syrup le sakte hain.",
        soapNote: {
          subjective:
            "Patient reports runny nose and mild cough for 2 days. No fever reported.",
          objective:
            "Afebrile. Lungs clear bilaterally. Nasal mucosa mildly congested, no purulent discharge.",
          assessment: "Common cold, uncomplicated upper respiratory tract infection.",
          plan: "Supportive care with steam inhalation and rest.",
          medications: "Cough syrup as needed, over-the-counter formulation.",
          followUp: "Return if symptoms persist beyond a week or fever develops.",
        },
      },
    ],
  },

  // Dr. Kavita Iyer — Cardiology — Tamil — Chennai
  "doc-3": {
    specialty: "cardiology",
    language: "ta",
    sessions: [
      {
        daysAgo: 2,
        specialty: "cardiology",
        inputLanguages: ["ta"],
        outputLanguage: "en",
        duration: 480,
        transcript:
          "Doctor: Vanakkam, eppadi irukinga? BP medicine sariya edukaringala?\nPatient: Aama doctor, but sometimes forget pandren.\nDoctor: BP ippo 148/94 irukku, konjam high a irukku. Salt intake kammi pannunga.\nPatient: Sari doctor, weight um konjam kooda irukku.\nDoctor: Amlodipine dose konjam increase pannalam. Exercise pannunga, walking 30 minutes daily.",
        soapNote: {
          subjective:
            "Known hypertensive patient reports inconsistent adherence to antihypertensive medication. No chest pain or breathlessness.",
          objective:
            "BP 148/94 mmHg, elevated from target. Weight mildly increased since last visit. Heart sounds normal, no murmurs.",
          assessment: "Suboptimally controlled essential hypertension, likely due to medication non-adherence and dietary sodium intake.",
          plan:
            "Increase amlodipine dose, reinforce medication adherence and low-sodium diet, encourage daily walking.",
          medications: "Amlodipine 10mg once daily (increased from 5mg).",
          followUp: "Recheck BP in 2 weeks. Fasting lipid profile at next visit.",
        },
      },
      {
        daysAgo: 5,
        specialty: "cardiology",
        inputLanguages: ["ta"],
        outputLanguage: "en",
        duration: 522,
        transcript:
          "Doctor: Enna problem?\nPatient: Doctor, nenjula pain irundhuchu, konjam neram than.\nDoctor: Exertion la varutha, rest pannumbodhu varutha?\nPatient: Naan nadandhu porenbodhu than varuthu.\nDoctor: ECG eduthu paakalam, troponin test um pannuvom. Family la yaarukavadhu heart problem irukka?\nPatient: Appa ku irundhuchu doctor.\nDoctor: Sari, ippo stable angina nu doubt irukku, konjam tests pannanum.",
        soapNote: {
          subjective:
            "Patient reports exertional chest discomfort lasting a few minutes, relieved by rest. Positive family history of cardiac disease in father.",
          objective:
            "BP 138/88, pulse 82 regular. ECG ordered, troponin levels pending. No acute distress on examination.",
          assessment: "Suspected stable angina, possible underlying coronary artery disease given exertional pattern and family history.",
          plan: "Order ECG, troponin, and lipid panel. Schedule stress test within the week.",
          medications: "Aspirin 75mg once daily started as precaution pending workup.",
          followUp: "Review in 1 week with test results. Advise emergency visit if pain occurs at rest.",
        },
      },
      {
        daysAgo: 14,
        specialty: "cardiology",
        inputLanguages: ["ta"],
        outputLanguage: "en",
        duration: 390,
        transcript:
          "Doctor: Angioplasty aana appuram eppadi irukinga?\nPatient: Nalla irukken doctor, pain edhuvum illa.\nDoctor: Medicines regular a edukaringala?\nPatient: Aama, ellam time ku eduthukren.\nDoctor: Nalla irukku. Wound site clean a irukku. Konjam heavy lifting avoid pannunga innum konjam naal.",
        soapNote: {
          subjective:
            "Patient post-angioplasty follow-up, reports no chest pain and good adherence to prescribed cardiac medications.",
          objective:
            "Access site well healed, no signs of infection or hematoma. Heart sounds normal, no new murmurs.",
          assessment: "Stable post-angioplasty recovery, no complications noted.",
          plan: "Continue current cardiac medication regimen, avoid heavy lifting for another 2 weeks.",
          medications: "Continue dual antiplatelet therapy and statin as previously prescribed.",
          followUp: "Follow-up in 4 weeks with repeat lipid profile.",
        },
      },
    ],
  },

  // Dr. Rohan Verma — Pediatrics — Marathi — Pune
  "doc-4": {
    specialty: "pediatrics",
    language: "mr",
    sessions: [
      {
        daysAgo: 1,
        specialty: "pediatrics",
        inputLanguages: ["mr"],
        outputLanguage: "en",
        duration: 240,
        transcript:
          "Doctor: Namaskar, aajcha vaccination sathi aala ka?\nPatient's parent: Ho doctor, sha varshacha DPT booster ghyaycha ahe.\nDoctor: Baalachi weight ani height baghto. Sagla normal distha. Vaccine deto, thoda taap yeu shakto ek don divas.\nParent: Thik ahe doctor, kahi precaution ghyaycha ka?\nDoctor: Taap alyavar paracetamol dya, ani injection chya jaghi swelling zali tar cold compress dya.",
        soapNote: {
          subjective:
            "Child presenting for scheduled DPT booster vaccination. Parent reports no current illness or fever.",
          objective:
            "Weight and height within normal range for age. No acute distress, afebrile at time of visit.",
          assessment: "Healthy child, due for routine DPT booster immunization.",
          plan: "Administer DPT booster as per immunization schedule. Counsel parent on expected mild post-vaccine fever.",
          medications: "Paracetamol pediatric dose as needed for post-vaccination fever.",
          followUp: "Next scheduled vaccination in 6 months, per immunization calendar.",
        },
      },
      {
        daysAgo: 4,
        specialty: "pediatrics",
        inputLanguages: ["mr"],
        outputLanguage: "en",
        duration: 300,
        transcript:
          "Doctor: Kay problem ahe baalala?\nParent: Doctor, don divas taap ahe ani khokla pan yeto ahe.\nDoctor: Baala jevla ka nit? Khup ashakt distoy ka?\nParent: Jevta ahe thoda kami, pan khelto ahe thoda.\nDoctor: Chest ऐकतो, clear ahe. Taap 101 F ahe. Hi viral infection distiye, kahi din madhe theek hoil.",
        soapNote: {
          subjective:
            "Child with 2-day history of fever and mild cough. Parent reports slightly reduced appetite but normal activity level.",
          objective:
            "Temperature 101F. Lungs clear on auscultation, no respiratory distress. Throat mildly congested.",
          assessment: "Viral upper respiratory infection in a well-appearing child.",
          plan: "Supportive care, encourage fluids, monitor for worsening symptoms.",
          medications: "Paracetamol pediatric syrup for fever as needed.",
          followUp: "Return if fever persists beyond 3 days or breathing difficulty develops.",
        },
      },
      {
        daysAgo: 9,
        specialty: "pediatrics",
        inputLanguages: ["mr"],
        outputLanguage: "en",
        duration: 275,
        transcript:
          "Doctor: Routine growth checkup sathi aala ahat na?\nParent: Ho doctor, weight thik vadhat ahe ka baghaycha hota.\nDoctor: Weight ani height chart baghto, growth curve nit ahe. Diet madhe kay deta roj?\nParent: Doodh, poli bhaji, phal detoy.\nDoctor: Chan ahe, iron rich pदार्थ pan thoda vadhava, jasa palak.",
        soapNote: {
          subjective:
            "Routine well-child visit for growth and nutrition assessment. Parent describes a balanced diet including milk, grains, vegetables, and fruit.",
          objective:
            "Growth parameters plotted on standard growth chart, tracking along expected percentile curve. No pallor or signs of malnutrition.",
          assessment: "Age-appropriate growth and development, adequate nutritional status.",
          plan: "Encourage increased iron-rich foods such as leafy greens in the diet.",
          medications: "None prescribed at this visit.",
          followUp: "Routine growth check at next scheduled well-child visit in 3 months.",
        },
      },
    ],
  },

  // Dr. Ananya Reddy — ENT — Telugu — Hyderabad
  "doc-5": {
    specialty: "ent",
    language: "te",
    sessions: [
      {
        daysAgo: 2,
        specialty: "ent",
        inputLanguages: ["te"],
        outputLanguage: "en",
        duration: 350,
        transcript:
          "Doctor: Namaskaram, ento samasya?\nPatient: Doctor, muku band ayindi vaara rojula nunchi, thala noppi kuda undi.\nDoctor: Face meeda pressure feel avutunda?\nPatient: Avunu, especially forehead daggara.\nDoctor: Sinus examination chesthanu, konchem inflammation kanipistundi. Idi chronic sinusitis laga undi, konni tests avasaram.",
        soapNote: {
          subjective:
            "Patient reports 1 week of nasal congestion with facial pressure and headache, worse over the forehead region.",
          objective:
            "Nasal mucosa inflamed with mild purulent discharge. Tenderness on palpation over frontal sinuses.",
          assessment: "Acute on chronic sinusitis.",
          plan: "Nasal saline irrigation, decongestant, and antibiotics if symptoms persist beyond 7 days. Consider sinus imaging if no improvement.",
          medications: "Amoxicillin-clavulanate 625mg twice daily for 5 days, nasal decongestant spray.",
          followUp: "Review in 1 week, sooner if symptoms worsen.",
        },
      },
      {
        daysAgo: 7,
        specialty: "ent",
        inputLanguages: ["te"],
        outputLanguage: "en",
        duration: 290,
        transcript:
          "Doctor: Emi samasya?\nPatient: Gొంతు noppi undi, medha okasari mingina noppi ekkuva avutundi.\nDoctor: Jwaram undha?\nPatient: Konchem undi, 100 daaka vachindi.\nDoctor: Throat examine chesthanu, tonsils swollen ga unnayi, white patches kuda kanipistunnayi. Idi tonsillitis.",
        soapNote: {
          subjective:
            "Patient reports sore throat with pain on swallowing, associated with low-grade fever.",
          objective:
            "Temperature 100F. Tonsils enlarged bilaterally with white exudate. Cervical lymphadenopathy present.",
          assessment: "Acute tonsillitis, likely bacterial given exudate and fever.",
          plan: "Antibiotic course, warm saline gargles, adequate fluid intake.",
          medications: "Amoxicillin 500mg three times daily for 7 days, paracetamol for fever and throat pain.",
          followUp: "Return if not improving in 3 days or difficulty breathing develops.",
        },
      },
      {
        daysAgo: 13,
        specialty: "ent",
        inputLanguages: ["te"],
        outputLanguage: "en",
        duration: 410,
        transcript:
          "Doctor: Vinikidi problem gurinchi cheppandi.\nPatient: Doctor, konni nelala nunchi vinadam kastam avutundi, especially right chevi lo.\nDoctor: Hearing test chesthanu, audiometry avasaram. Chevilo wax kuda konchem undi.\nPatient: Idi permanent ah doctor?\nDoctor: Test result tarvatha cheppagalanu, ippudu wax remove chesi malli test chesthanu.",
        soapNote: {
          subjective:
            "Patient reports progressive difficulty hearing over several months, more pronounced in the right ear.",
          objective:
            "Otoscopic exam reveals cerumen impaction in the right ear canal. Audiometry ordered to assess degree and type of hearing loss.",
          assessment: "Conductive hearing loss likely related to cerumen impaction, pending audiometry to rule out additional causes.",
          plan: "Cerumen removal followed by repeat audiometric testing.",
          medications: "Ear drops to soften cerumen prior to removal.",
          followUp: "Review audiometry results in 1 week after cerumen removal.",
        },
      },
    ],
  },

  // Dr. Vikram Nair — Dermatology — Malayalam — Kochi
  "doc-6": {
    specialty: "dermatology",
    language: "ml",
    sessions: [
      {
        daysAgo: 3,
        specialty: "dermatology",
        inputLanguages: ["ml"],
        outputLanguage: "en",
        duration: 260,
        transcript:
          "Doctor: Namaskaram, mukhathe pimples enthanu avastha?\nPatient: Doctor, konnu improve aayi but chila new pimples varunnu.\nDoctor: Face examine cheyyam. Redness kurayunnund, but chila active lesions undu.\nPatient: Medicine continue cheyyano doctor?\nDoctor: Cream continue cheyyu, but strength kurachu maattaam side effects ozhivakkan.",
        soapNote: {
          subjective:
            "Patient on treatment for acne reports partial improvement with some new lesions appearing.",
          objective:
            "Mild residual erythema, few new inflammatory papules on cheeks and forehead. No scarring noted.",
          assessment: "Acne vulgaris, moderate improvement on current treatment regimen.",
          plan: "Continue topical treatment at a lower strength to reduce irritation while maintaining efficacy.",
          medications: "Adapalene 0.1% gel at night, reduced frequency to alternate nights.",
          followUp: "Review in 4 weeks to assess further improvement.",
        },
      },
      {
        daysAgo: 8,
        specialty: "dermatology",
        inputLanguages: ["ml"],
        outputLanguage: "en",
        duration: 330,
        transcript:
          "Doctor: Enthanu prashnam?\nPatient: Doctor, kaikalilum kalilum chorച്ചil patches varunnu, valare chorachu.\nDoctor: Eppol thottanu thudangiyathu?\nPatient: Randu azhcha munp thottu.\nDoctor: Skin examine cheyyam, ithu eczema pole thonnunnu. Moisturizer regular aayi upayogikkanam.",
        soapNote: {
          subjective:
            "Patient reports itchy red patches on hands and legs for the past 2 weeks.",
          objective:
            "Erythematous, scaly patches noted on dorsal hands and shins, consistent with eczematous dermatitis. No signs of secondary infection.",
          assessment: "Atopic eczema, moderate severity.",
          plan: "Regular emollient use, topical corticosteroid for active flares, avoid known irritants.",
          medications: "Hydrocortisone 1% cream twice daily for 1 week, plus daily moisturizer.",
          followUp: "Review in 2 weeks, sooner if worsening or signs of infection appear.",
        },
      },
      {
        daysAgo: 15,
        specialty: "dermatology",
        inputLanguages: ["ml"],
        outputLanguage: "en",
        duration: 245,
        transcript:
          "Doctor: Kalinte vishayam parayu.\nPatient: Doctor, kalinte vira patches vannu, valare itchy aanu, edges il redness undu.\nDoctor: Konnu munp same problem undayirunno?\nPatient: Illa, puthiya prashnamanu.\nDoctor: Ithu fungal infection pole thonnunnu, examine cheyyam. Antifungal cream kodukkam.",
        soapNote: {
          subjective:
            "Patient presents with new-onset itchy patches on the leg with well-defined erythematous borders. No prior similar episodes.",
          objective:
            "Annular scaly lesion with central clearing and raised erythematous border, consistent with dermatophyte infection.",
          assessment: "Tinea corporis, fungal skin infection.",
          plan: "Topical antifungal treatment, keep area dry, avoid sharing personal items.",
          medications: "Clotrimazole 1% cream twice daily for 2 weeks.",
          followUp: "Review in 2 weeks if not resolved, consider oral antifungal if persistent.",
        },
      },
    ],
  },
};

export function getDoctorSeed(userId: string): DoctorSeed | undefined {
  return DOCTOR_SEEDS[userId];
}
