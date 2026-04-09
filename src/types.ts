export interface Option {
  label: string;
  value: number;
}

export interface Question {
  id: string;
  dim: string;
  text: string;
  options: Option[];
  special?: boolean;
  kind?: string;
}

export interface TypeInfo {
  code: string;
  cn: string;
  intro: string;
  desc: string;
}

export interface ComputedResult {
  rawScores: Record<string, number>;
  levels: Record<string, 'L' | 'M' | 'H'>;
  ranked: Array<TypeInfo & { distance: number; exact: number; similarity: number }>;
  bestNormal: TypeInfo & { distance: number; exact: number; similarity: number };
  finalType: TypeInfo;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: (TypeInfo & { similarity: number }) | null;
}
