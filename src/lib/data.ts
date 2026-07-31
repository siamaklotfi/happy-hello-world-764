export type Field = {
  slug: string;
  name: string;
};

export const FIELDS: Field[] = [
  { slug: "engineering", name: "فنی و مهندسی" },
  { slug: "management", name: "مدیریت و اقتصاد" },
  { slug: "humanities", name: "علوم انسانی" },
  { slug: "medical", name: "علوم پزشکی" },
  { slug: "basic-science", name: "علوم پایه" },
  { slug: "agriculture", name: "کشاورزی و منابع طبیعی" },
  { slug: "art", name: "هنر و معماری" },
];

export const LEVELS = ["کارشناسی", "کارشناسی ارشد", "دکتری"] as const;
export type Level = (typeof LEVELS)[number];

export const SERVICES = [
  {
    slug: "consultation",
    title: "مشاوره پایان‌نامه",
    desc: "همراهی گام‌به‌گام از انتخاب موضوع تا دفاع، با پژوهشگر هم‌رشته.",
    icon: "GraduationCap",
  },
  {
    slug: "proposal",
    title: "پروپوزال نویسی",
    desc: "تدوین طرح تحقیق، بیان مسئله، پیشینه و روش‌شناسی مطابق فرمت دانشگاه.",
    icon: "FileText",
  },
  {
    slug: "paper",
    title: "مقاله علمی",
    desc: "آماده‌سازی مقاله برای مجلات ISI، Scopus و علمی‌پژوهشی داخلی.",
    icon: "BookOpen",
  },
  {
    slug: "statistics",
    title: "تحلیل آماری",
    desc: "تحلیل با SPSS، AMOS، Smart PLS و تفسیر خروجی‌ها.",
    icon: "BarChart3",
  },
  {
    slug: "matlab",
    title: "MATLAB و شبیه‌سازی",
    desc: "پیاده‌سازی الگوریتم، شبیه‌سازی عددی و پردازش داده.",
    icon: "Cpu",
  },
  {
    slug: "editing",
    title: "ویرایش علمی",
    desc: "ویراستاری، صفحه‌آرایی، رفرنس‌دهی و بررسی مشابهت‌یابی.",
    icon: "PenLine",
  },
  {
    slug: "data",
    title: "پردازش داده",
    desc: "پاک‌سازی، مدل‌سازی و مصورسازی داده‌های پژوهشی.",
    icon: "Database",
  },
  {
    slug: "writing-support",
    title: "همیاری در نگارش",
    desc: "بازنویسی فصول، تقویت ادبیات پژوهش و رفع ایرادات داوران.",
    icon: "NotebookPen",
  },
];

export type Researcher = {
  slug: string;
  name: string;
  degree: string;
  university: string;
  fieldSlug: string;
  major: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviews: number;
  projects: number;
  hourlyPrice: number;
  bio: string;
  publications: string[];
  portfolio: { title: string; year: number }[];
  avatarSeed: string;
};

export const RESEARCHERS: Researcher[] = [
  {
    slug: "sara-tehrani",
    name: "دکتر سارا تهرانی",
    degree: "دکتری",
    university: "دانشگاه تهران",
    fieldSlug: "management",
    major: "مدیریت بازرگانی",
    specialties: ["رفتار مصرف‌کننده", "مدل‌سازی معادلات ساختاری", "Smart PLS"],
    experience: 11,
    rating: 4.9,
    reviews: 132,
    projects: 210,
    hourlyPrice: 850000,
    bio: "پژوهشگر و مدرس مدیریت با تمرکز بر پژوهش‌های کمی و مدل‌سازی معادلات ساختاری. راهنمای بیش از ۲۰۰ پروژه پایان‌نامه در مقاطع ارشد و دکتری.",
    publications: [
      "طراحی مدل وفاداری مشتری در خرده‌فروشی آنلاین، فصلنامه مدیریت بازرگانی",
      "Consumer trust in digital marketplaces, Journal of Retailing Studies",
    ],
    portfolio: [
      { title: "پایان‌نامه ارشد: تأثیر بازاریابی محتوایی بر قصد خرید", year: 1402 },
      { title: "مقاله Scopus: مدل‌سازی وفاداری برند", year: 1403 },
    ],
    avatarSeed: "ST",
  },
  {
    slug: "mohammad-rezaei",
    name: "دکتر محمد رضایی",
    degree: "دکتری",
    university: "دانشگاه صنعتی شریف",
    fieldSlug: "engineering",
    major: "مهندسی برق - کنترل",
    specialties: ["MATLAB", "کنترل بهینه", "یادگیری ماشین"],
    experience: 14,
    rating: 4.8,
    reviews: 98,
    projects: 175,
    hourlyPrice: 1200000,
    bio: "متخصص شبیه‌سازی سیستم‌های کنترلی و پیاده‌سازی الگوریتم‌های یادگیری ماشین در MATLAB و Python.",
    publications: [
      "Robust control of nonlinear systems, IEEE Transactions",
      "بهینه‌سازی مصرف انرژی در ریزشبکه‌ها، نشریه مهندسی برق",
    ],
    portfolio: [
      { title: "شبیه‌سازی ریزشبکه هوشمند در MATLAB/Simulink", year: 1403 },
      { title: "پایان‌نامه دکتری: کنترل تطبیقی ربات‌های متحرک", year: 1401 },
    ],
    avatarSeed: "MR",
  },
  {
    slug: "elham-kazemi",
    name: "دکتر الهام کاظمی",
    degree: "دکتری",
    university: "دانشگاه علامه طباطبائی",
    fieldSlug: "humanities",
    major: "روان‌شناسی تربیتی",
    specialties: ["پژوهش کیفی", "SPSS", "روش تحقیق آمیخته"],
    experience: 9,
    rating: 4.9,
    reviews: 76,
    projects: 140,
    hourlyPrice: 700000,
    bio: "پژوهشگر حوزه روان‌شناسی تربیتی با تجربه در طراحی ابزار پژوهش، مصاحبه عمیق و تحلیل مضمون.",
    publications: ["اثربخشی آموزش تاب‌آوری بر سازگاری تحصیلی، فصلنامه روان‌شناسی تربیتی"],
    portfolio: [{ title: "پروپوزال دکتری: الگوی یادگیری خودتنظیم", year: 1403 }],
    avatarSeed: "EK",
  },
  {
    slug: "arash-nouri",
    name: "دکتر آرش نوری",
    degree: "دکتری",
    university: "دانشگاه علوم پزشکی شهید بهشتی",
    fieldSlug: "medical",
    major: "اپیدمیولوژی",
    specialties: ["تحلیل آماری پزشکی", "STATA", "مرور سیستماتیک"],
    experience: 12,
    rating: 4.7,
    reviews: 64,
    projects: 118,
    hourlyPrice: 1100000,
    bio: "متخصص اپیدمیولوژی و آمار زیستی؛ همکاری در طراحی مطالعات بالینی و نگارش مقالات بین‌المللی.",
    publications: ["Systematic review of metabolic risk factors, BMC Public Health"],
    portfolio: [{ title: "مرور سیستماتیک و متاآنالیز عوامل خطر دیابت", year: 1402 }],
    avatarSeed: "AN",
  },
  {
    slug: "narges-shahbazi",
    name: "دکتر نرگس شهبازی",
    degree: "دکتری",
    university: "دانشگاه فردوسی مشهد",
    fieldSlug: "basic-science",
    major: "آمار ریاضی",
    specialties: ["R", "مدل‌های خطی تعمیم‌یافته", "سری زمانی"],
    experience: 8,
    rating: 4.8,
    reviews: 51,
    projects: 96,
    hourlyPrice: 780000,
    bio: "تحلیل‌گر داده و پژوهشگر آمار با تمرکز بر مدل‌سازی سری زمانی و تحلیل داده‌های پرحجم.",
    publications: ["Bayesian time series forecasting, Statistical Papers"],
    portfolio: [{ title: "پیش‌بینی تقاضای انرژی با مدل ARIMA", year: 1403 }],
    avatarSeed: "NS",
  },
  {
    slug: "hossein-maleki",
    name: "مهندس حسین ملکی",
    degree: "کارشناسی ارشد",
    university: "دانشگاه صنعتی امیرکبیر",
    fieldSlug: "engineering",
    major: "مهندسی کامپیوتر - هوش مصنوعی",
    specialties: ["یادگیری عمیق", "پردازش تصویر", "Python"],
    experience: 7,
    rating: 4.6,
    reviews: 44,
    projects: 88,
    hourlyPrice: 900000,
    bio: "توسعه‌دهنده و پژوهشگر هوش مصنوعی؛ پیاده‌سازی مدل‌های بینایی ماشین برای پروژه‌های دانشگاهی.",
    publications: ["Lightweight CNN for medical imaging, Elsevier Procedia"],
    portfolio: [{ title: "تشخیص ضایعات پوستی با شبکه عصبی عمیق", year: 1403 }],
    avatarSeed: "HM",
  },
  {
    slug: "zeinab-farhadi",
    name: "دکتر زینب فرهادی",
    degree: "دکتری",
    university: "دانشگاه شیراز",
    fieldSlug: "agriculture",
    major: "اقتصاد کشاورزی",
    specialties: ["مدل‌های اقتصادسنجی", "Eviews", "ارزیابی طرح"],
    experience: 10,
    rating: 4.7,
    reviews: 39,
    projects: 74,
    hourlyPrice: 650000,
    bio: "پژوهشگر اقتصاد کشاورزی با تمرکز بر ارزیابی اقتصادی طرح‌ها و مدل‌سازی اقتصادسنجی.",
    publications: ["کارایی فنی مزارع گندم، اقتصاد کشاورزی و توسعه"],
    portfolio: [{ title: "تحلیل بهره‌وری آب در مزارع جنوب کشور", year: 1402 }],
    avatarSeed: "ZF",
  },
  {
    slug: "kamran-ahmadi",
    name: "دکتر کامران احمدی",
    degree: "دکتری",
    university: "دانشگاه هنر تهران",
    fieldSlug: "art",
    major: "معماری",
    specialties: ["معماری پایدار", "Grasshopper", "پژوهش طراحی‌محور"],
    experience: 13,
    rating: 4.8,
    reviews: 33,
    projects: 61,
    hourlyPrice: 950000,
    bio: "پژوهشگر معماری پایدار و مدرس دانشگاه؛ راهنمایی رساله‌های طراحی‌محور و شبیه‌سازی انرژی ساختمان.",
    publications: ["Passive design strategies in hot-arid climates, Building & Environment"],
    portfolio: [{ title: "رساله ارشد: بهینه‌سازی پوسته ساختمان", year: 1403 }],
    avatarSeed: "KA",
  },
];

export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: number;
  body: string[];
};

export const POST_CATEGORIES = [
  "روش تحقیق",
  "آموزش پایان‌نامه",
  "مقاله نویسی",
  "تحلیل آماری",
  "آموزش دانشگاهی",
];

export const POSTS: Post[] = [
  {
    slug: "thesis-cost-guide",
    title: "هزینه پایان‌نامه در سال ۱۴۰۴ چگونه محاسبه می‌شود؟",
    category: "آموزش پایان‌نامه",
    excerpt:
      "راهنمای کامل عوامل مؤثر بر هزینه پایان‌نامه: مقطع تحصیلی، رشته، نوع خدمت، فوریت و پیچیدگی پژوهش.",
    date: "1404/03/12",
    readingTime: 7,
    body: [
      "هزینه مشاوره پایان‌نامه یک عدد ثابت نیست؛ برآیندی از مقطع تحصیلی، حجم کار، سطح تخصص پژوهشگر و زمان باقی‌مانده تا تحویل است.",
      "در مقطع کارشناسی ارشد، بیشترین بخش هزینه مربوط به فصل سوم و چهارم (روش تحقیق و تحلیل داده) است، در حالی که در دکتری نوآوری علمی و نگارش مقاله مستخرج وزن بیشتری دارد.",
      "برای شفافیت، در رساله ابتدا یک بازه تخمینی به شما نمایش داده می‌شود و سپس پژوهشگران پیشنهاد قیمت دقیق خود را ثبت می‌کنند.",
    ],
  },
  {
    slug: "choose-research-method",
    title: "چگونه روش تحقیق مناسب پایان‌نامه خود را انتخاب کنیم؟",
    category: "روش تحقیق",
    excerpt:
      "تفاوت پژوهش کمی، کیفی و آمیخته و معیارهای انتخاب روش متناسب با سؤال پژوهش شما.",
    date: "1404/02/28",
    readingTime: 9,
    body: [
      "انتخاب روش تحقیق باید از دل سؤال پژوهش بیرون بیاید، نه از روی سلیقه یا سهولت اجرا.",
      "اگر به دنبال سنجش رابطه بین متغیرها هستید، رویکرد کمی و ابزار پرسشنامه گزینه مناسب است؛ اگر می‌خواهید یک پدیده را عمیقاً بفهمید، پژوهش کیفی و تحلیل مضمون کارآمدتر است.",
      "روش آمیخته زمانی ارزش دارد که یک لایه از پژوهش بدون لایه دیگر ناقص بماند.",
    ],
  },
  {
    slug: "isi-paper-checklist",
    title: "چک‌لیست پذیرش مقاله در مجلات ISI",
    category: "مقاله نویسی",
    excerpt:
      "از انتخاب مجله هدف تا پاسخ به داوران؛ مسیر عملی برای افزایش شانس پذیرش مقاله علمی.",
    date: "1404/02/05",
    readingTime: 8,
    body: [
      "پیش از نگارش، مجله هدف را انتخاب کنید؛ ساختار و لحن مقاله باید با Scope مجله هم‌راستا باشد.",
      "بخش Methods باید آن‌قدر دقیق باشد که پژوهشگر دیگری بتواند مطالعه شما را بازتولید کند.",
      "پاسخ به داوران را نقطه‌به‌نقطه و مؤدبانه بنویسید و تغییرات را در متن هایلایت کنید.",
    ],
  },
  {
    slug: "spss-common-mistakes",
    title: "۶ اشتباه رایج در تحلیل آماری با SPSS",
    category: "تحلیل آماری",
    excerpt:
      "خطاهایی که باعث رد شدن فصل چهارم پایان‌نامه می‌شوند و راه‌های پیشگیری از آن‌ها.",
    date: "1404/01/19",
    readingTime: 6,
    body: [
      "نادیده گرفتن پیش‌فرض‌های آزمون، شایع‌ترین ایراد داوران در جلسه دفاع است.",
      "حجم نمونه ناکافی، تفسیر اشتباه سطح معناداری و گزارش‌نکردن اندازه اثر از دیگر خطاهای پرتکرار هستند.",
      "همیشه خروجی نرم‌افزار را با زبان پژوهش تفسیر کنید، نه صرفاً کپی جدول‌ها.",
    ],
  },
  {
    slug: "defense-session-tips",
    title: "آمادگی برای جلسه دفاع: راهنمای عملی",
    category: "آموزش دانشگاهی",
    excerpt: "ساختار ارائه، مدیریت زمان و پاسخ به سؤالات داوران در جلسه دفاع.",
    date: "1403/12/22",
    readingTime: 5,
    body: [
      "ارائه دفاع یک خلاصه از پایان‌نامه نیست؛ روایتی است از مسئله، راه‌حل و یافته.",
      "برای هر اسلاید حداکثر یک پیام اصلی در نظر بگیرید و زمان‌بندی را تمرین کنید.",
      "سؤالات محتمل داوران را از پیش فهرست کنید و پاسخ کوتاه و مستند آماده داشته باشید.",
    ],
  },
  {
    slug: "literature-review-workflow",
    title: "روش سیستماتیک مرور ادبیات پژوهش",
    category: "روش تحقیق",
    excerpt: "از جست‌وجوی کلیدواژه تا جدول خلاصه مطالعات؛ گردش‌کاری قابل تکرار.",
    date: "1403/11/30",
    readingTime: 7,
    body: [
      "مرور ادبیات بدون استراتژی جست‌وجو، به انباشت بی‌هدف منابع تبدیل می‌شود.",
      "کلیدواژه‌ها را با عملگرهای بولی ترکیب کنید و معیارهای ورود و خروج را از ابتدا مشخص کنید.",
      "یک جدول خلاصه (نویسنده، سال، روش، یافته، شکاف) بسازید تا شکاف پژوهشی خودبه‌خود آشکار شود.",
    ],
  },
];

export const fieldName = (slug: string) =>
  FIELDS.find((f) => f.slug === slug)?.name ?? slug;

export const toFa = (n: number) =>
  n.toLocaleString("fa-IR", { maximumFractionDigits: 0 });
