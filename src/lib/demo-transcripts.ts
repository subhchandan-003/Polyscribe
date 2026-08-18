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
    flag: "🇬🇧",
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
    id: "ms-pediatrics",
    title: "Demam Anak — Child Fever",
    language: "Malay",
    languageCode: "ms",
    specialty: "pediatrics",
    flag: "🇲🇾",
    duration: "~3 min consultation",
    description:
      "A mother brings her 4-year-old son with high fever and rash for 2 days. Malay consultation typical of a Malaysian clinic.",
    rawTranscript: `Doctor: Selamat pagi Puan. Sila duduk. Ini anak puan ya? Apa masalahnya?

Patient: Selamat pagi Doktor. Anak saya Ahmad, dia empat tahun. Dua hari demam tinggi dan keluar ruam merah di badan.

Doctor: Demam berapa ya? Ada check?

Patient: Semalam 39.5 darjah. Hari ni pun masih panas. Dia tak mahu makan, cuma minum air sikit-sikit.

Doctor: Ruam tu macam mana? Ada gatal tak?

Patient: Ruam merah-merah macam bintik, mula kat muka lepas tu turun ke badan dan tangan. Dia tak garu sangat.

Doctor: Ada batuk, selesema, atau mata merah?

Patient: Mata dia merah sikit dan berair. Hidung pun meleleh. Batuk sikit-sikit ada.

Doctor: Dia dah ambil vaksin lengkap tak?

Patient: Sebenarnya Doktor, saya ada miss satu appointment dulu masa dia dua tahun. Saya tak pasti dia dapat semua vaksin.

Doctor: OK, saya nak check dia ya. Ahmad, Uncle Doktor nak tengok sikit ya... Baik. Temperature sekarang 39.2. Ada conjunctivitis bilateral. Koplik spots kat dalam mulut. Ruam maculopapular dah spread ke trunk dan arms. Throat merah. Lungs clear.

Doctor: Puan, based on findings ni — demam tinggi, mata merah, Koplik spots, dan ruam yang spread dari muka ke bawah — saya suspect ini measles. Campak.

Patient: Ya Allah, campak ke Doktor? Bahaya tak?

Doctor: Kita kena monitor closely. Saya nak buat blood test untuk confirm dan check complications. Buat masa ni, saya bagi paracetamol untuk demam — bagi ikut berat badan dia. Vitamin A supplement penting untuk measles. Pastikan dia minum air banyak. Dia kena isolate dari budak-budak lain ya, campak sangat mudah berjangkit.

Patient: Bila saya kena datang balik?

Doctor: Kalau demam naik lagi, ada sesak nafas, atau dia jadi sangat lemah, bawa terus ke emergency. Kalau stabil, datang jumpa saya dalam dua hari untuk follow-up. Saya akan report kes ni ke KKM sebab measles kena notify.

Patient: Terima kasih banyak Doktor.

Doctor: Sama-sama. Jaga Ahmad baik-baik ya.`,
  },
];
