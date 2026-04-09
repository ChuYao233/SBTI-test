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

// ── 每个人格在15个维度上的期望分布（μ=均值, σ=标准差，值域0~1）
// μ: L≈0.17, M≈0.50, H≈0.83 对应原始三档；σ 越大越宽容
// prettier-ignore
const TYPE_PROFILES: Record<string, { mu: number; sigma: number }[]> = {
  CTRL:    [.83,.83,.83, .83,.50,.83, .50,.83,.83, .83,.83,.83, .50,.83,.50].map(mu=>({mu,sigma:0.18})),
  'ATM-er':[.83,.83,.83, .83,.83,.50, .83,.83,.83, .83,.50,.83, .50,.83,.17].map(mu=>({mu,sigma:0.18})),
  'Dior-s':[.50,.83,.50, .50,.50,.83, .50,.83,.50, .83,.50,.83, .17,.83,.17].map(mu=>({mu,sigma:0.20})),
  BOSS:    [.83,.83,.83, .83,.50,.83, .50,.50,.83, .83,.83,.83, .17,.83,.17].map(mu=>({mu,sigma:0.18})),
  'THAN-K':[.50,.83,.50, .83,.50,.50, .83,.83,.50, .50,.50,.83, .50,.83,.17].map(mu=>({mu,sigma:0.20})),
  'OH-NO': [.83,.83,.17, .17,.50,.83, .17,.83,.83, .83,.83,.50, .17,.83,.17].map(mu=>({mu,sigma:0.18})),
  GOGO:    [.83,.83,.50, .83,.50,.83, .50,.50,.83, .83,.83,.83, .50,.83,.50].map(mu=>({mu,sigma:0.20})),
  SEXY:    [.83,.50,.83, .83,.83,.17, .83,.50,.50, .83,.50,.50, .83,.17,.83].map(mu=>({mu,sigma:0.22})),
  'LOVE-R':[.50,.17,.83, .17,.83,.17, .83,.17,.83, .50,.17,.50, .50,.17,.83].map(mu=>({mu,sigma:0.20})),
  MUM:     [.50,.50,.83, .50,.83,.17, .83,.50,.50, .17,.50,.50, .83,.17,.17].map(mu=>({mu,sigma:0.22})),
  FAKE:    [.83,.17,.50, .50,.50,.17, .50,.17,.50, .50,.17,.50, .83,.17,.83].map(mu=>({mu,sigma:0.22})),
  OJBK:    [.50,.50,.83, .50,.50,.50, .83,.50,.17, .17,.50,.50, .50,.50,.17].map(mu=>({mu,sigma:0.22})),
  MALO:    [.50,.17,.83, .50,.83,.50, .50,.17,.83, .50,.17,.83, .50,.17,.83].map(mu=>({mu,sigma:0.22})),
  'JOKE-R':[.17,.17,.83, .17,.83,.17, .17,.50,.17, .17,.17,.17, .50,.17,.50].map(mu=>({mu,sigma:0.20})),
  'WOC!':  [.83,.83,.17, .83,.50,.83, .50,.50,.83, .83,.83,.50, .17,.83,.83].map(mu=>({mu,sigma:0.18})),
  'THIN-K':[.83,.83,.17, .83,.50,.83, .50,.17,.83, .50,.83,.50, .17,.83,.83].map(mu=>({mu,sigma:0.18})),
  SHIT:    [.83,.83,.17, .83,.17,.83, .17,.50,.50, .83,.83,.50, .17,.83,.83].map(mu=>({mu,sigma:0.18})),
  ZZZZ:    [.50,.83,.17, .50,.17,.83, .17,.50,.17, .50,.50,.17, .50,.50,.50].map(mu=>({mu,sigma:0.22})),
  POOR:    [.83,.83,.17, .50,.17,.83, .17,.50,.83, .83,.83,.83, .17,.83,.17].map(mu=>({mu,sigma:0.18})),
  MONK:    [.83,.83,.17, .17,.17,.83, .17,.17,.50, .50,.50,.17, .17,.83,.50].map(mu=>({mu,sigma:0.20})),
  IMSB:    [.17,.17,.50, .17,.50,.50, .17,.17,.17, .17,.17,.17, .50,.17,.50].map(mu=>({mu,sigma:0.22})),
  SOLO:    [.17,.50,.17, .17,.17,.83, .17,.83,.17, .17,.50,.17, .17,.83,.50].map(mu=>({mu,sigma:0.22})),
  FUCK:    [.50,.17,.17, .17,.83,.17, .17,.17,.50, .50,.17,.17, .83,.17,.83].map(mu=>({mu,sigma:0.22})),
  DEAD:    [.17,.17,.17, .17,.17,.50, .17,.50,.17, .17,.17,.17, .17,.83,.50].map(mu=>({mu,sigma:0.22})),
  IMFW:    [.17,.17,.83, .17,.83,.17, .17,.50,.17, .17,.17,.17, .50,.17,.17].map(mu=>({mu,sigma:0.22})),
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
  if (count === 0) return 0.5;
  const min = count;      // 每题最低1分
  const max = count * 3;
  return (raw - min) / (max - min);
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
      const p = gaussianScore(normVec[i], profile[i].mu, profile[i].sigma);
      logScore += Math.log(Math.max(p, 1e-10)); // 防止 log(0)
    }

    // 转换为相似度百分比（基于 logScore 范围映射）
    // 最大 logScore = 0（每维度完美匹配），最差约为 -15*10 = -150
    const similarity = Math.round(Math.max(0, Math.min(100, 100 * (1 + logScore / 50))));

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
  } else if (bestNormal.similarity < 60) {
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
