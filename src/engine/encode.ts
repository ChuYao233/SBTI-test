/**
 * 分享链接编码/解码
 *
 * 布局（19字节，XOR混淆后Base64URL，输出26字符）：
 *   [0]      主人格序号 (0-26)
 *   [1]      主人格相似度 (0-100)
 *   [2..16]  15个维度 normalized×100 (0-100)
 *   [17]     副人格序号 (0-26，0xFF=无副人格)
 *   [18]     副人格相似度 (0-100，副人格不存在时为0)
 *
 * 分享链接只有一个参数：?e=26chars
 */

import { NORMAL_TYPES } from '../data/types';

const KEY = 0x5B;

// 所有人格列表（普通+特殊），序号固定不能改变
const ALL_CODES = [...NORMAL_TYPES.map((t) => t.code), 'HHHH', 'DRUNK'];

function codeToIndex(code: string): number {
  const i = ALL_CODES.indexOf(code);
  return i >= 0 ? i : 0;
}

function indexToCode(i: number): string {
  return ALL_CODES[i] ?? ALL_CODES[0];
}

function xor(bytes: number[]): number[] {
  return bytes.map((b, i) => (b ^ KEY ^ (i * 11 + 31)) & 0xff);
}

function toBase64url(bytes: number[]): string {
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64url(s: string): number[] {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Array.from(bin).map((c) => c.charCodeAt(0));
}

export interface ShareData {
  code: string;
  similarity: number;
  norms: number[];
  secondaryCode?: string;
  secondarySimilarity?: number;
}

/** 编码全部分享数据 → 26字符 URL 安全字符串 */
export function encodeShare(data: ShareData): string {
  const s2idx = data.secondaryCode ? codeToIndex(data.secondaryCode) : 0xff;
  const s2sim = data.secondarySimilarity ?? 0;
  const raw = [
    codeToIndex(data.code),
    Math.round(Math.max(0, Math.min(100, data.similarity))),
    ...data.norms.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 100)),
    s2idx,
    Math.round(Math.max(0, Math.min(100, s2sim))),
  ];
  return toBase64url(xor(raw));
}

/** 解码 → ShareData，失败返回 null */
export function decodeShare(encoded: string): ShareData | null {
  try {
    const raw = xor(fromBase64url(encoded));
    if (raw.length !== 19) return null;
    const code = indexToCode(raw[0]);
    const similarity = raw[1];
    const norms = raw.slice(2, 17).map((v) => Math.min(1, Math.max(0, v / 100)));
    const s2idx = raw[17];
    const s2sim = raw[18];
    const secondaryCode = s2idx === 0xff ? undefined : indexToCode(s2idx);
    return {
      code,
      similarity,
      norms,
      secondaryCode,
      secondarySimilarity: secondaryCode ? s2sim : undefined,
    };
  } catch {
    return null;
  }
}

/** 兼容旧格式 ?r=CODE&d=encoded（旧版，仅维度无人格） */
export function decodeDimsLegacy(encoded: string): number[] | null {
  try {
    const bytes = fromBase64url(encoded);
    if (bytes.length !== 15) return null;
    return bytes.map((b, i) => {
      const original = (b ^ KEY ^ (i * 7)) & 0xff;
      return Math.min(1, Math.max(0, original / 100));
    });
  } catch {
    return null;
  }
}
