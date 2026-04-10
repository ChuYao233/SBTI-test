/**
 * Umami Share API 工具
 * 先换取 share token，再携带 x-umami-share-token header 请求正式 API
 */

const SHARE_ID = '0TfVwBbUC8uRiZR9';
const WEBSITE_ID = '2329af43-b02a-4f9d-bed8-7eb82bef95cd';
const UMAMI_BASE = 'https://umami.2o.nz';

export interface UmamiStats {
  total: number;                          // 总 pageview
  typeCounts: Record<string, number>;     // 各人格测试次数
}

let cachedStats: UmamiStats | null = null;
let fetchPromise: Promise<UmamiStats> | null = null;

export async function fetchUmamiStats(): Promise<UmamiStats> {
  if (cachedStats) return cachedStats;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const now = Date.now();
    const start = 1000000000000; // 2001-09 起，避免 startAt=0 边界问题

    // 1. 换取 share token
    const tokenRes = await fetch(`${UMAMI_BASE}/api/share/${SHARE_ID}`);
    if (!tokenRes.ok) throw new Error(`share token ${tokenRes.status}`);
    const tokenData = await tokenRes.json();
    const token: string = tokenData?.token ?? '';
    if (!token) throw new Error('empty token');

    const headers: HeadersInit = { 'x-umami-share-token': token };

    // 2. 总 pageview
    const statsRes = await fetch(
      `${UMAMI_BASE}/api/websites/${WEBSITE_ID}/stats?startAt=${start}&endAt=${now}`,
      { headers }
    );
    if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);
    const stats = await statsRes.json();
    // API 返回 {pageviews: 29, visitors: 1, ...}，直接是数字
    const total: number = typeof stats?.pageviews === 'number' ? stats.pageviews : (stats?.pageviews?.value ?? 0);

    // 3. 各人格测试次数（event-data 明细）
    const dataRes = await fetch(
      `${UMAMI_BASE}/api/websites/${WEBSITE_ID}/event-data/fields?startAt=${start}&endAt=${now}&eventName=test_complete`,
      { headers }
    );
    const typeCounts: Record<string, number> = {};
    if (dataRes.ok) {
      const dataJson = await dataRes.json();
      // 格式: [{propertyName:'type', value:'CTRL', total:42}, ...]
      if (Array.isArray(dataJson)) {
        for (const row of dataJson) {
          if (row.propertyName === 'type' && row.value) {
            typeCounts[String(row.value)] = Number(row.total) || 0;
          }
        }
      }
    }

    const result: UmamiStats = { total, typeCounts };
    // 只有拿到有效数据才缓存，避免网络抖动把空结果缓存死
    if (total > 0 || Object.keys(typeCounts).length > 0) {
      cachedStats = result;
    } else {
      fetchPromise = null; // 允许重试
    }
    return result;
  })().catch((err) => {
    console.warn('[Umami] fetchStats failed:', err);
    fetchPromise = null; // 失败后允许重试
    return { total: 0, typeCounts: {} };
  });

  return fetchPromise;
}

/** 向 Umami 上报自定义事件 */
export function trackEvent(eventName: string, data?: Record<string, string>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = (window as any).umami;
  if (u?.track) u.track(eventName, data);
}
