export interface RosterPatient {
  name: string;
  email: string;
}

/** Pool of patient identities used to seed realistic doctor caseloads.
 * The first five are the real quick-login patient accounts (Private
 * Clinics mode); the rest are display-only identities that populate a
 * Hospitals mode doctor's Patients tab, Session History, and stats without needing a
 * login of their own. Reused across doctors on purpose, so a patient can
 * show up in more than one doctor's caseload — the same cross-doctor
 * record aggregation getPatientSessions() already does for real users. */
export const PATIENT_ROSTER: RosterPatient[] = [
  { name: "Rahul Mehta", email: "patient@polyscribe.io" },
  { name: "Anjali Nair", email: "anjali.nair@polyscribe.io" },
  { name: "Suresh Kumar", email: "suresh.kumar@polyscribe.io" },
  { name: "Meera Pillai", email: "meera.pillai@polyscribe.io" },
  { name: "Arjun Das", email: "arjun.das@polyscribe.io" },
  { name: "Kavita Joshi", email: "kavita.joshi@patient.polyscribe.demo" },
  { name: "Vikram Singh", email: "vikram.singh@patient.polyscribe.demo" },
  { name: "Priya Menon", email: "priya.menon@patient.polyscribe.demo" },
  { name: "Ramesh Gupta", email: "ramesh.gupta@patient.polyscribe.demo" },
  { name: "Sunita Rao", email: "sunita.rao@patient.polyscribe.demo" },
  { name: "Amit Verma", email: "amit.verma@patient.polyscribe.demo" },
  { name: "Deepa Krishnan", email: "deepa.krishnan@patient.polyscribe.demo" },
  { name: "Manoj Tiwari", email: "manoj.tiwari@patient.polyscribe.demo" },
  { name: "Neha Kulkarni", email: "neha.kulkarni@patient.polyscribe.demo" },
  { name: "Sanjay Bhatt", email: "sanjay.bhatt@patient.polyscribe.demo" },
  { name: "Pooja Iyer", email: "pooja.iyer@patient.polyscribe.demo" },
  { name: "Rajesh Nambiar", email: "rajesh.nambiar@patient.polyscribe.demo" },
  { name: "Kiran Shetty", email: "kiran.shetty@patient.polyscribe.demo" },
  { name: "Anita Desai", email: "anita.desai@patient.polyscribe.demo" },
  { name: "Farhan Sheikh", email: "farhan.sheikh@patient.polyscribe.demo" },
  { name: "Divya Pillai", email: "divya.pillai@patient.polyscribe.demo" },
  { name: "Rohit Chauhan", email: "rohit.chauhan@patient.polyscribe.demo" },
  { name: "Lakshmi Narayan", email: "lakshmi.narayan@patient.polyscribe.demo" },
  { name: "Vivek Anand", email: "vivek.anand@patient.polyscribe.demo" },
  { name: "Shreya Ghosh", email: "shreya.ghosh@patient.polyscribe.demo" },
  { name: "Naveen Reddy", email: "naveen.reddy@patient.polyscribe.demo" },
  { name: "Ritu Malhotra", email: "ritu.malhotra@patient.polyscribe.demo" },
  { name: "Ashok Pandey", email: "ashok.pandey@patient.polyscribe.demo" },
  { name: "Geeta Chandran", email: "geeta.chandran@patient.polyscribe.demo" },
  { name: "Imran Qureshi", email: "imran.qureshi@patient.polyscribe.demo" },
];
