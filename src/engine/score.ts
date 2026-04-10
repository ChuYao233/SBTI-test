/**
 * 评分引擎 - 高斯概率匹配
 *
 * 原理：
 *   1. 每个维度得分归一化到 [0,1]（原始分 / 最大可能分）
 *   2. 每个人格在每个维度上定义期望均值 μ 和宽容度 σ
 *   3. 用高斯概率密度 p(x|μ,σ) = exp(-(x-μ)²/(2σ²)) 计算单维度匹配概率（不加归一化系数，值域0~1）
 *   4. 各维度概率取对数后求和（log-sum），避免连乘下溢，最后转换为百分制相似度
 *   5. 比欧氏距离更科学：σ越大表示该维度对该人格"容忍度"越高，体现人格内部的弹性差异
 */

import { dimensionOrder, type DimKey } from '../data/dimensions';
import { NORMAL_TYPES, TYPE_LIBRARY } from '../data/types';
import type { Question } from '../types';

// ── 每个人格在15个维度上的期望分布
// μ: L≈0.17, M≈0.50, H≈0.83；sigma 越小 = 该维度对该人格越关键（区分力越强）
// 维度顺序：S1 S2 S3  E1 E2 E3  A1 A2 A3  Ac1 Ac2 Ac3  So1 So2 So3
// prettier-ignore
type DimProfile = { mu: number; sigma: number };
function p(mu: number, sigma: number): DimProfile { return { mu, sigma }; }

// prettier-ignore
const TYPE_PROFILES: Record<string, DimProfile[]> = {
  // S1    S2    S3    E1    E2    E3    A1    A2    A3    Ac1   Ac2   Ac3   So1   So2   So3
  CTRL:    [p(.83,.12),p(.83,.15),p(.83,.12),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.12),p(.83,.12),p(.83,.12),p(.83,.12),p(.83,.12),p(.50,.22),p(.83,.18),p(.50,.22)],
  'ATM-er':[p(.83,.15),p(.83,.15),p(.83,.15),p(.83,.18),p(.83,.12),p(.50,.22),p(.83,.15),p(.83,.18),p(.83,.18),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.12),p(.17,.15)],
  'Dior-s':[p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.12),p(.17,.15),p(.83,.18),p(.17,.15)],
  BOSS:    [p(.83,.12),p(.83,.15),p(.83,.12),p(.83,.18),p(.50,.22),p(.83,.18),p(.50,.22),p(.50,.22),p(.83,.12),p(.83,.12),p(.83,.12),p(.83,.12),p(.17,.15),p(.83,.18),p(.17,.18)],
  'THAN-K':[p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.83,.12),p(.83,.15),p(.50,.22),p(.50,.22),p(.50,.22),p(.83,.18),p(.50,.22),p(.83,.15),p(.17,.15)],
  'OH-NO': [p(.83,.15),p(.83,.15),p(.17,.15),p(.17,.15),p(.50,.22),p(.83,.12),p(.17,.12),p(.83,.15),p(.83,.15),p(.83,.15),p(.83,.15),p(.50,.22),p(.17,.18),p(.83,.15),p(.17,.18)],
  GOGO:    [p(.83,.15),p(.83,.18),p(.50,.22),p(.83,.18),p(.50,.22),p(.83,.18),p(.50,.22),p(.50,.22),p(.83,.12),p(.83,.12),p(.83,.12),p(.83,.12),p(.50,.22),p(.83,.18),p(.50,.22)],
  SEXY:    [p(.83,.12),p(.50,.22),p(.83,.12),p(.83,.15),p(.83,.12),p(.17,.15),p(.83,.15),p(.50,.22),p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.83,.12),p(.17,.18),p(.83,.12)],
  'LOVE-R':[p(.50,.22),p(.17,.15),p(.83,.15),p(.17,.15),p(.83,.12),p(.17,.15),p(.83,.18),p(.17,.15),p(.83,.15),p(.50,.22),p(.17,.22),p(.50,.22),p(.50,.22),p(.17,.18),p(.83,.12)],
  MUM:     [p(.50,.22),p(.50,.22),p(.83,.15),p(.50,.22),p(.83,.12),p(.17,.15),p(.83,.15),p(.50,.22),p(.50,.22),p(.17,.18),p(.50,.22),p(.50,.22),p(.83,.15),p(.17,.15),p(.17,.18)],
  FAKE:    [p(.83,.15),p(.17,.15),p(.50,.22),p(.50,.22),p(.50,.22),p(.17,.18),p(.50,.22),p(.17,.18),p(.50,.22),p(.50,.22),p(.17,.22),p(.50,.22),p(.83,.15),p(.17,.15),p(.83,.12)],
  OJBK:    [p(.50,.22),p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.50,.22),p(.83,.18),p(.50,.22),p(.17,.18),p(.17,.18),p(.50,.22),p(.50,.22),p(.50,.22),p(.50,.22),p(.17,.22)],
  MALO:    [p(.50,.22),p(.17,.18),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.17,.18),p(.83,.15),p(.50,.22),p(.17,.22),p(.83,.15),p(.50,.22),p(.17,.18),p(.83,.12)],
  'JOKE-R':[p(.17,.15),p(.17,.18),p(.83,.15),p(.17,.15),p(.83,.15),p(.17,.18),p(.17,.18),p(.50,.22),p(.17,.18),p(.17,.18),p(.17,.22),p(.17,.18),p(.50,.22),p(.17,.15),p(.50,.22)],
  'WOC!':  [p(.83,.15),p(.83,.15),p(.17,.15),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.50,.22),p(.83,.15),p(.83,.15),p(.83,.15),p(.50,.22),p(.17,.18),p(.83,.15),p(.83,.12)],
  'THIN-K':[p(.83,.12),p(.83,.12),p(.17,.15),p(.83,.15),p(.50,.22),p(.83,.15),p(.50,.22),p(.17,.15),p(.83,.12),p(.50,.22),p(.83,.15),p(.50,.22),p(.17,.18),p(.83,.15),p(.83,.12)],
  SHIT:    [p(.83,.12),p(.83,.15),p(.17,.15),p(.83,.15),p(.17,.15),p(.83,.15),p(.17,.15),p(.50,.22),p(.50,.22),p(.83,.15),p(.83,.15),p(.50,.22),p(.17,.18),p(.83,.15),p(.83,.12)],
  ZZZZ:    [p(.50,.22),p(.83,.18),p(.17,.15),p(.50,.22),p(.17,.18),p(.83,.15),p(.17,.18),p(.50,.22),p(.17,.18),p(.50,.22),p(.50,.22),p(.17,.15),p(.50,.22),p(.50,.22),p(.50,.22)],
  POOR:    [p(.83,.15),p(.83,.15),p(.17,.15),p(.50,.22),p(.17,.15),p(.83,.15),p(.17,.15),p(.50,.22),p(.83,.12),p(.83,.12),p(.83,.12),p(.83,.12),p(.17,.15),p(.83,.18),p(.17,.18)],
  MONK:    [p(.83,.15),p(.83,.15),p(.17,.15),p(.17,.15),p(.17,.15),p(.83,.12),p(.17,.12),p(.17,.15),p(.50,.22),p(.50,.22),p(.50,.22),p(.17,.18),p(.17,.12),p(.83,.15),p(.50,.22)],
  IMSB:    [p(.17,.15),p(.17,.15),p(.50,.22),p(.17,.18),p(.50,.22),p(.50,.22),p(.17,.18),p(.17,.18),p(.17,.18),p(.17,.18),p(.17,.18),p(.17,.15),p(.50,.22),p(.17,.15),p(.50,.22)],
  SOLO:    [p(.17,.15),p(.50,.22),p(.17,.18),p(.17,.15),p(.17,.18),p(.83,.12),p(.17,.15),p(.83,.18),p(.17,.18),p(.17,.18),p(.50,.22),p(.17,.18),p(.17,.12),p(.83,.12),p(.50,.22)],
  FUCK:    [p(.50,.22),p(.17,.18),p(.17,.18),p(.17,.18),p(.83,.12),p(.17,.15),p(.17,.18),p(.17,.15),p(.50,.22),p(.50,.22),p(.17,.22),p(.17,.18),p(.83,.15),p(.17,.18),p(.83,.12)],
  DEAD:    [p(.17,.15),p(.17,.15),p(.17,.12),p(.17,.18),p(.17,.18),p(.50,.22),p(.17,.15),p(.50,.22),p(.17,.12),p(.17,.15),p(.17,.18),p(.17,.12),p(.17,.15),p(.83,.18),p(.50,.22)],
  IMFW:    [p(.17,.15),p(.17,.18),p(.83,.18),p(.17,.15),p(.83,.15),p(.17,.18),p(.17,.18),p(.50,.22),p(.17,.18),p(.17,.15),p(.17,.18),p(.17,.15),p(.50,.22),p(.17,.15),p(.17,.22)],
};

/** 高斯概率密度（无归一化常数，值域0~1） */
function gaussianScore(x: number, mu: number, sigma: number): number {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
}

export interface DimScore {
  dim: DimKey;
  raw: number;
  normalized: number;
  level: 'L' | 'M' | 'H';
}

export interface TypeMatch {
  code: string;
  cn: string;
  intro: string;
  desc: string;
  similarity: number;
  logScore: number;
}

export interface ScoreResult {
  dimScores: DimScore[];
  levels: Record<DimKey, 'L' | 'M' | 'H'>;
  ranked: TypeMatch[];
  bestNormal: TypeMatch;
  finalType: TypeMatch & { modeKicker: string; badge: string; sub: string; special: boolean };
  secondaryType: TypeMatch | null;
  drunkTriggered: boolean;
}

/** 每题满分3分，n题总分 3n，归一化到0~1 */
function normalize(raw: number, count: number): number {
  if (count === 0) return 0.5; // 无答题时回退到中性值，不偏向任何方向
  const min = count;           // 每题最低1分
  const max = count * 3;
  return (raw - min) / (max - min);
}

/** 计算某人格在最差情况（所有维度反向极端）下的 logScore 下界（用于归一化分母） */
function worstLogScore(profile: DimProfile[]): number {
  let s = 0;
  for (const { mu, sigma } of profile) {
    // 最差点：mu<0.5 时 x=1.0，mu>=0.5 时 x=0.0
    const worst = mu < 0.5 ? 1.0 : 0.0;
    s += Math.log(Math.max(gaussianScore(worst, mu, sigma), 1e-10));
  }
  return s;
}

function toLevel(norm: number): 'L' | 'M' | 'H' {
  if (norm < 0.37) return 'L';
  if (norm < 0.67) return 'M';
  return 'H';
}

export function computeScore(
  answers: Record<string, number>,
  questions: Question[],
  drunkTriggered: boolean,
): ScoreResult {
  // ── 1. 统计每维度原始分和题数
  const rawMap: Partial<Record<DimKey, number>> = {};
  const countMap: Partial<Record<DimKey, number>> = {};

  for (const q of questions) {
    if (q.special) continue;
    const dim = q.dim as DimKey;
    const val = answers[q.id] ?? 0;
    if (val === 0) continue;
    rawMap[dim] = (rawMap[dim] ?? 0) + val;
    countMap[dim] = (countMap[dim] ?? 0) + 1;
  }

  // ── 2. 归一化 + 分级
  const dimScores: DimScore[] = dimensionOrder.map((dim) => {
    const raw = rawMap[dim] ?? 0;
    const count = countMap[dim] ?? 1;
    const normalized = normalize(raw, count);
    return { dim, raw, normalized, level: toLevel(normalized) };
  });

  const levels = Object.fromEntries(
    dimScores.map((d) => [d.dim, d.level])
  ) as Record<DimKey, 'L' | 'M' | 'H'>;

  const normVec = dimScores.map((d) => d.normalized);

  // ── 3. 高斯概率匹配：对每个人格计算 log 联合概率
  const ranked: TypeMatch[] = NORMAL_TYPES.map(({ code }) => {
    const profile = TYPE_PROFILES[code];
    if (!profile) return null;

    // log-sum：各维度高斯对数概率之和，避免连乘下溢
    let logScore = 0;
    for (let i = 0; i < normVec.length; i++) {
      const g = gaussianScore(normVec[i], profile[i].mu, profile[i].sigma);
      logScore += Math.log(Math.max(g, 1e-10)); // 防止 log(0)
    }

    // 动态归一化：用该人格自身最差得分作分母，使不同 sigma 的人格可比
    // perfectLogScore = 0（所有维度完美匹配），worst < 0
    const worst = worstLogScore(profile); // 负数
    const similarity = Math.round(Math.max(0, Math.min(100,
      worst === 0 ? 100 : 100 * (logScore - worst) / (0 - worst)
    )));

    const typeInfo = TYPE_LIBRARY[code];
    return { code, cn: typeInfo.cn, intro: typeInfo.intro, desc: typeInfo.desc, similarity, logScore };
  }).filter(Boolean).sort((a, b) => b!.logScore - a!.logScore) as TypeMatch[];

  const bestNormal = ranked[0];

  // ── 4. 特殊人格判断
  let finalType: TypeMatch & { modeKicker: string; badge: string; sub: string; special: boolean };
  let secondaryType: TypeMatch | null = null;

  if (drunkTriggered) {
    const drunkInfo = TYPE_LIBRARY['DRUNK'];
    finalType = {
      code: 'DRUNK', cn: drunkInfo.cn, intro: drunkInfo.intro, desc: drunkInfo.desc,
      similarity: 100, logScore: 0,
      modeKicker: '隐藏人格已激活',
      badge: '匹配度 100% · 酒精异常因子已接管',
      sub: '乙醇亲和性过强，系统已直接跳过常规人格审判。',
      special: true,
    };
    secondaryType = bestNormal;
  } else if (bestNormal.similarity < 55) {
    const hhhhInfo = TYPE_LIBRARY['HHHH'];
    finalType = {
      code: 'HHHH', cn: hhhhInfo.cn, intro: hhhhInfo.intro, desc: hhhhInfo.desc,
      similarity: bestNormal.similarity, logScore: bestNormal.logScore,
      modeKicker: '系统强制兜底',
      badge: `标准人格库最高匹配仅 ${bestNormal.similarity}%`,
      sub: '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。',
      special: true,
    };
  } else {
    finalType = {
      ...bestNormal,
      modeKicker: '你的主类型',
      badge: `匹配度 ${bestNormal.similarity}% · 贝叶斯最优解`,
      sub: `与 ${ranked[1]?.cn ?? '次选'} 的差距：${bestNormal.similarity - (ranked[1]?.similarity ?? 0)}%`,
      special: false,
    };
  }

  return { dimScores, levels, ranked, bestNormal, finalType, secondaryType, drunkTriggered };
}
