import type { Specialty } from "./specialty-prompts";

export interface DemoCase {
  id: string;
  title: string;
  language: string;
  languageCode: string;
  specialty: Specialty;
  flag: string;
  duration: string;
  description: string;
  /** Pre-written raw transcript (as if captured by Web Speech API) */
  rawTranscript: string;
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: "en-cardiology",
    title: "Chest Pain Evaluation",
    language: "English",
    languageCode: "en",
    specialty: "cardiology",
    flag: "🇮🇳",
    duration: "~4 min consultation",
    description:
      "A 58-year-old male presents with exertional chest pain radiating to the left arm. History of hypertension and smoking.",
    rawTranscript: `Doctor: Good morning Mr. Sharma, please have a seat. What brings you in today?

Patient: Good morning Doctor. I've been having this chest pain for the past two weeks. It comes when I climb stairs or walk fast.

Doctor: Can you describe the pain? Where exactly do you feel it?

Patient: It's like a heavy pressure right in the center of my chest. Sometimes it goes to my left arm and jaw.

Doctor: How long does the pain last when it happens?

Patient: Maybe five to ten minutes. It goes away when I sit down and rest.

Doctor: Do you get any shortness of breath, sweating, or nausea with it?

Patient: Yes, I do feel some breathlessness and I sweat more than usual. No nausea though.

Doctor: I see. Do you have any other medical conditions? Are you on any medications?

Patient: I have high blood pressure. I take amlodipine 5 mg daily. My father had a heart attack when he was 60.

Doctor: Do you smoke?

Patient: I used to smoke a pack a day for twenty years. I quit three years ago.

Doctor: Good that you quit. Let me examine you now. Your blood pressure is 148 over 92, which is a bit elevated. Heart rate is 78, regular. I can hear a soft S4 gallop. Lungs are clear. No peripheral edema.

Patient: Is it serious Doctor?

Doctor: We need to run some tests. I'm going to order an ECG, troponin levels, a lipid panel, and we should get a stress test done this week. Based on your symptoms and risk factors — the chest pain pattern, family history, smoking history, and hypertension — I'm concerned about stable angina, possibly coronary artery disease.

Patient: What should I do in the meantime?

Doctor: I'm starting you on aspirin 75 mg daily and atorvastatin 20 mg at night. Please keep taking your amlodipine. If you get sudden severe chest pain that doesn't go away with rest, go straight to the emergency room. I want to see you back in one week with the test results. Avoid heavy exertion until then.

Patient: Thank you Doctor. I'll do the tests right away.

Doctor: Take care Mr. Sharma. My assistant will help you schedule everything.`,
  },
  {
    id: "hi-general",
    title: "बुखार और खांसी — Fever & Cough",
    language: "Hindi",
    languageCode: "hi",
    specialty: "general",
    flag: "🇮🇳",
    duration: "~3 min consultation",
    description:
      "A 35-year-old woman presents with fever, cough, and body pain for 5 days. Hindi-medium consultation with code-switching.",
    rawTranscript: `Doctor: Namaste ji, baithiye. Kya taklif hai aapko?

Patient: Namaste Doctor sahab. Mujhe paanch din se bukhar aa raha hai, khoob khansi ho rahi hai, aur pura badan dard kar raha hai.

Doctor: Bukhar kitna aata hai? Thermometer se check kiya hai?

Patient: Haan ji, kal raat 102 tha. Subah thoda kam ho jata hai lekin shaam ko phir se badh jata hai.

Doctor: Khansi mein kuch aata hai? Balgam ya khoon?

Patient: Haan, yellowish balgam aa rahi hai. Khoon nahi aaya abhi tak.

Doctor: Gale mein dard hai? Saans lene mein taklif?

Patient: Gale mein thoda dard hai. Saans mein zyada dikkat nahi hai, but kabhi kabhi khansi ke waqt chest mein thoda heav feel hota hai.

Doctor: Koi aur bimari hai? Koi medicine chal rahi hai?

Patient: Nahi Doctor, koi badi bimari nahi hai. Maine paracetamol kha li thi, usse bukhar thodi der ke liye utar jata hai.

Doctor: Aapke ghar mein kisi ko bhi aisi taklif hai? Aur aap kahan kaam karti hain?

Patient: Mere bache ko bhi thoda sardi ho rahi hai. Main ek school mein teacher hoon.

Doctor: Theek hai, main aapko check karti hoon. Temperature abhi 101.2 hai. Throat congested hai. Chest mein right side mein thode crackles hain. Baaki normal hai.

Doctor: Dekhiye, aapko upper respiratory tract infection lag raha hai, aur right side mein early signs of possible chest infection bhi hain. Main aapko antibiotic deti hoon — Amoxicillin 500 mg din mein teen baar khaana hai saat din tak. Paracetamol 650 mg har 6 ghante bukhar ke liye. Cough syrup dinmein teen baar. Aur garam paani ke gargle kariye.

Patient: Koi test karana padega Doctor?

Doctor: Main chest X-ray likh rahi hoon aur CBC blood test bhi. Agar do din mein bukhar nahi utra ya saans mein dikkat ho, toh foran aana. Rest kariye, paani khoob peejiye.

Patient: Dhanyavaad Doctor.

Doctor: Jaldi theek hoiye. Apna khayal rakhiye.`,
  },
  {
    id: "ta-pediatrics",
    title: "குழந்தைக்கு காய்ச்சல் — Child Fever",
    language: "Tamil",
    languageCode: "ta",
    specialty: "pediatrics",
    flag: "🇮🇳",
    duration: "~3 min consultation",
    description:
      "A mother brings her 4-year-old son with high fever and a body rash for 2 days. Tamil-medium consultation typical of a Chennai clinic, with English medical terms code-switched in.",
    rawTranscript: `Doctor: Vanakkam Amma, ukkarunga. Idhu ungal paiyana? Enna problem?

Patient: Vanakkam Doctor. En magan peru Arun, avanukku naalu vayasu. Rendu naal ah high fever irukku, mattum body la red rash vandhurukku.

Doctor: Fever eppadi irukku? Thermometer la check panninga?

Patient: Neththu 103 degree irundhuchu. Innaiku kammiya irukku aana innum sudu dhaan. Sapada mattaan, thanni mattum konjam konjam kudikaraan.

Doctor: Andha rash eppadi irukku? Itching irukka?

Patient: Chinna chinna red spots maadhiri, mudhalla mugathula start aayiduchu apparam body kum kaikkum spread aachu. Adhigama sorandhu kaamittu illa.

Doctor: Irumal, jaladhosham, kann sivandhu irukka?

Patient: Kannu konjam sivappa irukku, thanni vidudhu. Mookilirundhum thanni varudhu. Konjam irumal um irukku.

Doctor: Vaccination full ah eduthirukeengala?

Patient: Actually Doctor, avanukku rendu vayasula oru appointment miss pannitten. Ella vaccine um kedaichuchaanu therla.

Doctor: Sari, naan avana check pannaren. Arun, kunju... naan konjam paakaren aa... Sari. Temperature ippo 102.6 irukku. Rendu kannilayum conjunctivitis irukku. Vaaikkulla Koplik spots irukku. Rash trunk-um kaikkum spread aayirukku. Throat red-a irukku. Lungs clear.

Doctor: Amma, indha findings vachu paathaa — high fever, red eyes, Koplik spots, mattum mugathula irundhu keela spread aana rash — measles-a irukalaam nu doubt.

Patient: Aiyayo, measles-a Doctor? Danger-a irukkaa?

Doctor: Naanga closely monitor pannanum. Confirm pannaradhukku blood test edukaren, complications um check pannaren. Ippo paracetamol kudukaren fever-ukku — weight vachu dose calculate pannuven. Vitamin A supplement measles-ku romba mukkiyam. Adhigama thanni kudikkanum. Vera pasangalodu vidama isolate pannunga, measles romba fast-a spread aagum.

Patient: Naan eppo thirumba varanum?

Doctor: Fever innum kooda vandha, breathing problem irundha, illa romba weak ah aanaalum udane emergency-kku poidunga. Stable-a irundha, rendu naal kalichu follow-up-ku vaanga. Ithu notifiable disease nu report pannuven.

Patient: Nandri Doctor.

Doctor: Paravalla. Arun-a nalla paathukonga.`,
  },
];
