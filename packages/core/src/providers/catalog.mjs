export const METHOD_OPTIONS = Object.freeze([
  { id: "turkey", label: "Diyanet / Turkey (offline approximation)" },
  { id: "ummAlQura", label: "Umm al-Qura, Makkah" },
  { id: "muslimWorldLeague", label: "Muslim World League" },
  { id: "moonsightingCommittee", label: "Moonsighting Committee" },
  { id: "egyptian", label: "Egyptian General Authority of Survey" },
  { id: "karachi", label: "University of Islamic Sciences, Karachi" },
  { id: "dubai", label: "Dubai" },
  { id: "qatar", label: "Qatar" },
  { id: "kuwait", label: "Kuwait" },
  { id: "singapore", label: "Singapore / Malaysia / Indonesia" },
  { id: "tehran", label: "Institute of Geophysics, Tehran" },
  { id: "northAmerica", label: "ISNA / North America" },
]);

export const COUNTRY_OPTIONS = Object.freeze([
  { code: "TR", ar: "تركيا", en: "Türkiye" },
  { code: "SA", ar: "السعودية", en: "Saudi Arabia" },
  { code: "AE", ar: "الإمارات", en: "United Arab Emirates" },
  { code: "QA", ar: "قطر", en: "Qatar" },
  { code: "KW", ar: "الكويت", en: "Kuwait" },
  { code: "EG", ar: "مصر", en: "Egypt" },
  { code: "GB", ar: "المملكة المتحدة", en: "United Kingdom" },
  { code: "DE", ar: "ألمانيا", en: "Germany" },
  { code: "FR", ar: "فرنسا", en: "France" },
  { code: "NL", ar: "هولندا", en: "Netherlands" },
  { code: "SE", ar: "السويد", en: "Sweden" },
  { code: "NO", ar: "النرويج", en: "Norway" },
  { code: "US", ar: "الولايات المتحدة", en: "United States" },
  { code: "CA", ar: "كندا", en: "Canada" },
  { code: "PK", ar: "باكستان", en: "Pakistan" },
  { code: "IN", ar: "الهند", en: "India" },
  { code: "BD", ar: "بنغلاديش", en: "Bangladesh" },
  { code: "MY", ar: "ماليزيا", en: "Malaysia" },
  { code: "ID", ar: "إندونيسيا", en: "Indonesia" },
  { code: "SG", ar: "سنغافورة", en: "Singapore" },
  { code: "IR", ar: "إيران", en: "Iran" },
  { code: "OTHER", ar: "دولة أخرى", en: "Other" },
]);

const PRESETS = Object.freeze({
  TR: {
    method: "turkey",
    authority: "رئاسة الشؤون الدينية التركية (Diyanet)",
    note: "يستخدم التطبيق حساب تركيا دون إنترنت. يمكن ربط واجهة Diyanet الرسمية للحصول على جدول السلطة المحلية.",
  },
  SA: {
    method: "ummAlQura",
    authority: "تقويم أم القرى، مكة المكرمة",
    note: "اختيار مناسب للسعودية. أضف تعديل رمضان للعشاء إذا أوصت الجهة المحلية بذلك.",
  },
  AE: { method: "dubai", authority: "طريقة دبي", note: "حساب محلي للإمارات؛ راجع هيئة الشؤون الإسلامية في مدينتك." },
  QA: { method: "qatar", authority: "طريقة قطر", note: "حساب قطر مع فترة ثابتة للعشاء." },
  KW: { method: "kuwait", authority: "طريقة الكويت", note: "حساب الكويت دون إنترنت." },
  EG: { method: "egyptian", authority: "الهيئة المصرية العامة للمساحة", note: "الطريقة المصرية للحساب دون إنترنت." },
  GB: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "ملائم لبريطانيا وخطوط العرض المرتفعة؛ أكّد اختيار مسجدك المحلي." },
  IE: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "ملائم لأيرلندا وخطوط العرض المرتفعة." },
  SE: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "تُطبّق قاعدة خطوط العرض المرتفعة تلقائياً." },
  NO: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "تُطبّق قاعدة خطوط العرض المرتفعة تلقائياً." },
  FI: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "تُطبّق قاعدة خطوط العرض المرتفعة تلقائياً." },
  DK: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "أكّد اختيار الجمعية الإسلامية المحلية." },
  IS: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "تُطبّق قاعدة خطوط العرض المرتفعة تلقائياً." },
  US: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "موصى به افتراضياً لأمريكا الشمالية؛ يمكن اختيار ISNA يدوياً." },
  CA: { method: "moonsightingCommittee", authority: "Moonsighting Committee", note: "موصى به افتراضياً لكندا مع دعم خطوط العرض المرتفعة." },
  PK: { method: "karachi", authority: "جامعة العلوم الإسلامية، كراتشي", note: "طريقة شائعة في جنوب آسيا." },
  IN: { method: "karachi", authority: "جامعة العلوم الإسلامية، كراتشي", note: "اختيار ابتدائي؛ أكّد جدول المسجد المحلي." },
  BD: { method: "karachi", authority: "جامعة العلوم الإسلامية، كراتشي", note: "اختيار ابتدائي؛ أكّد جدول المسجد المحلي." },
  MY: { method: "singapore", authority: "طريقة سنغافورة / جنوب شرق آسيا", note: "راجع JAKIM أو الجهة المحلية عند توفر جدول رسمي." },
  ID: { method: "singapore", authority: "طريقة جنوب شرق آسيا", note: "راجع Kementerian Agama أو الجهة المحلية عند توفر جدول رسمي." },
  SG: { method: "singapore", authority: "Majlis Ugama Islam Singapura", note: "طريقة سنغافورة للحساب دون إنترنت." },
  IR: { method: "tehran", authority: "معهد الجيوفيزياء، جامعة طهران", note: "طريقة طهران للحساب دون إنترنت." },
});

const EUROPE = new Set([
  "AT", "BE", "CH", "CZ", "DE", "ES", "FR", "GR", "HR", "HU", "IT",
  "LU", "NL", "PL", "PT", "RO", "RS", "SI", "SK",
]);

export function countryPreset(countryCode) {
  const code = String(countryCode || "OTHER").toUpperCase();
  if (PRESETS[code]) return { country: code, ...PRESETS[code] };
  if (EUROPE.has(code)) {
    return {
      country: code,
      method: "muslimWorldLeague",
      authority: "رابطة العالم الإسلامي",
      note: "اختيار ابتدائي لأوروبا الوسطى. الجهة المحلية أو المسجد قد يستخدمان طريقة مختلفة.",
    };
  }
  return {
    country: code,
    method: "muslimWorldLeague",
    authority: "رابطة العالم الإسلامي",
    note: "اختيار عالمي ابتدائي. قارنه بجدول المسجد أو السلطة المحلية قبل تشغيل الأذان.",
  };
}

export function methodOption(methodId) {
  return METHOD_OPTIONS.find(({ id }) => id === methodId) ?? METHOD_OPTIONS[2];
}

const TIME_ZONE_COUNTRIES = Object.freeze({
  "Europe/Istanbul": "TR",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Qatar": "QA",
  "Asia/Kuwait": "KW",
  "Africa/Cairo": "EG",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Amsterdam": "NL",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Dhaka": "BD",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID",
  "Asia/Singapore": "SG",
  "Asia/Tehran": "IR",
});

export function countryForTimeZone(timeZone, localeRegion = "") {
  return TIME_ZONE_COUNTRIES[timeZone]
    ?? (COUNTRY_OPTIONS.some(({ code }) => code === localeRegion) ? localeRegion : "OTHER");
}
