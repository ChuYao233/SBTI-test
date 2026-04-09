/**
 * 题目采样器
 * 支持 30 / 60 / 90 题三档
 * 每档均匀地从每个维度（15个）随机抽取：
 *   30题 → 每维度2题
 *   60题 → 每维度4题
 *   90题 → 每维度6题
 */

import type { Question } from '../types';
import { dimensionOrder, type DimKey } from '../data/dimensions';
import { allQuestions, specialQuestions } from '../data/questions/index';

export type QuestionCount = 30 | 60 | 90;

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleQuestions(count: QuestionCount): Question[] {
  const perDim = count / 15; // 2 | 4 | 6

  const byDim: Partial<Record<DimKey, Question[]>> = {};
  for (const dim of dimensionOrder) byDim[dim] = [];
  for (const q of allQuestions) {
    const dim = q.dim as DimKey;
    if (byDim[dim]) byDim[dim]!.push(q);
  }

  const picked: Question[] = [];
  for (const dim of dimensionOrder) {
    const pool = byDim[dim] ?? [];
    picked.push(...shuffle(pool).slice(0, perDim));
  }

  // 整体再洗一次打乱顺序
  const shuffled = shuffle(picked);

  // 插入补充题（随机位置）
  const insertAt = Math.floor(Math.random() * shuffled.length) + 1;
  // 失恋题插入不同位置，与饮酒题错开
  const insertAt2 = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
  const hbPos = insertAt2 >= insertAt ? insertAt2 + 1 : insertAt2;

  const mid = [
    ...shuffled.slice(0, insertAt),
    specialQuestions[0],
    ...shuffled.slice(insertAt),
  ];
  return [
    ...mid.slice(0, hbPos),
    specialQuestions[2],
    ...mid.slice(hbPos),
  ];
}
