import { FIELDS } from "./data";

export const URGENCY = ["عادی (بیش از ۳ ماه)", "فوری (۱ تا ۳ ماه)", "بسیار فوری (کمتر از ۱ ماه)"] as const;
export const COMPLEXITY = ["ساده", "متوسط", "پیچیده"] as const;

const LEVEL_BASE: Record<string, number> = {
  "کارشناسی": 6_000_000,
  "کارشناسی ارشد": 16_000_000,
  "دکتری": 34_000_000,
};

const SERVICE_FACTOR: Record<string, number> = {
  consultation: 0.7,
  proposal: 0.45,
  paper: 0.8,
  statistics: 0.55,
  matlab: 0.9,
  editing: 0.3,
  data: 0.6,
  "writing-support": 1,
};

const FIELD_FACTOR: Record<string, number> = {
  engineering: 1.2,
  medical: 1.25,
  "basic-science": 1.1,
  management: 1,
  humanities: 0.9,
  agriculture: 0.95,
  art: 1.05,
};

const URGENCY_FACTOR: Record<string, number> = {
  [URGENCY[0]]: 1,
  [URGENCY[1]]: 1.2,
  [URGENCY[2]]: 1.45,
};

const COMPLEXITY_FACTOR: Record<string, number> = {
  ساده: 0.85,
  متوسط: 1,
  پیچیده: 1.3,
};

export type EstimateInput = {
  level: string;
  fieldSlug: string;
  serviceSlug: string;
  urgency: string;
  complexity: string;
};

export type EstimateResult = { min: number; max: number };

const round = (n: number) => Math.round(n / 500_000) * 500_000;

export function estimatePrice(input: EstimateInput): EstimateResult {
  const base = LEVEL_BASE[input.level] ?? 16_000_000;
  const factor =
    (SERVICE_FACTOR[input.serviceSlug] ?? 0.7) *
    (FIELD_FACTOR[input.fieldSlug] ?? 1) *
    (URGENCY_FACTOR[input.urgency] ?? 1) *
    (COMPLEXITY_FACTOR[input.complexity] ?? 1);

  const center = base * factor;
  return { min: round(center * 0.8), max: round(center * 1.35) };
}

export const FIELD_OPTIONS = FIELDS;
