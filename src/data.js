
export const batchOptions = [
  { label: "7:30 AM – 9:00 AM", value: "7:30-9:00" },
  { label: "9:00 AM – 10:30 AM", value: "9:00-10:30" },
  { label: "10:30 AM – 12:30 PM", value: "10:30-12:30" },
  { label: "12:30 PM – 1:30 PM", value: "12:30-1:30" },
  { label: "2:00 PM – 3:30 PM", value: "2:00-3:30" },
  { label: "3:30 PM – 5:00 PM", value: "3:30-5:00" },
  { label: "5:00 PM – 6:30 PM", value: "5:00-6:30" },
];

export const daysOptions = [
  { label: "Monday, Wednesday, Friday (MWF)", value: "MWF" },
  { label: "Tuesday, Thursday, Saturday (TTS)", value: "TTS" },
  { label: "Daily (Mon-Sat)", value: "Daily" },
  { label: "Weekend (Sat-Sun)", value: "Weekend" },
];

export const courseOptions = [
  "English Speaking Course",
  "DCAP",
  "ADCE",
  "AI&ML",
  "MDCE",
  "PDSHE",
  "SOFTWARE&HARDWARE",
  "PDSEA",
  "DCHN",
  "ADCHN",
  "E-ACCOUNTING",
  "TALLY PRIME",
  "PDEA",
  "ADEA",
  "ANIMATION",
  "ADVANCE ANIMATION",
  "MASTERS IN ANIMATION",
  "DIPLOMA IN WEBSITE ENGINEERING",
  "ADVANCE DIPLOMA IN WEBSITE ENGINEERING",
  "DM",
  "CYBER SECURITY & ETHICAL HACKING",
  "DATA SCIENCE",
  "CHATGPT",
  "MOBILE APPLICATION DEVELOPMENT",
  "CLOUD COMPUTING",
  "BPO",
].map((course) => ({ label: course, value: course }));