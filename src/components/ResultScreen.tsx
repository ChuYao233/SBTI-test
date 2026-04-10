import type { ScoreResult } from '../engine/score';
import { dimensionMeta, DIM_EXPLANATIONS, dimensionOrder } from '../data/dimensions';
import { TYPE_IMAGES } from '../data/types';
import SiteFooter from './SiteFooter';
import { useState, useCallback } from 'react';
import { encodeShare } from '../engine/encode';

interface Props {
  result: ScoreResult;
  onRestart: () => void;
  isShareView?: boolean;
  typeCounts?: Record<string, number>;
}

const LEVEL_COLOR: Record<string, string> = {
  L: 'text-[#c0392b] bg-[#fdecea] border-[#f5c6c2]',
  M: 'text-[#d4800a] bg-[#fef3e2] border-[#f5dba8]',
  H: 'text-[#2d7a47] bg-[#e8f5ec] border-[#b8dfc4]',
};
const LEVEL_LABEL: Record<string, string> = { L: '低', M: '中', H: '高' };
const RANK_MEDAL = ['🥇', '🥈', '🥉'];

export default function ResultScreen({ result, onRestart, isShareView = false, typeCounts = {} }: Props) {
  const { finalType, dimScores, ranked } = result;
  const imgSrc = TYPE_IMAGES[finalType.code];
  const top3 = ranked.slice(0, 3);

  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(async () => {
    const eParam = encodeShare({
      code: finalType.code,
      similarity: finalType.similarity,
      norms: dimScores.map((d) => d.normalized),
      secondaryCode: result.secondaryType?.code,
      secondarySimilarity: result.secondaryType?.similarity,
    });
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = `${base}?e=${eParam}`;
    const shareData = {
      title: `我的 SBTI 人格是 ${finalType.code}「${finalType.cn}」`,
      text: `${finalType.intro}\n来测测你是什么人格？`,
      url,
    };
    // 优先唤起系统分享
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // 用户取消分享，不做处理
        return;
      }
    }
    // 不支持 Web Share API，回退到复制链接
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      prompt('复制下方链接分享给朋友：', url);
    });
  }, [finalType.code, finalType.cn, finalType.intro]);

  return (
    <div className="min-h-screen bg-[#f4f8f4] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* 分享模式横幅 */}
        {isShareView && (
          <div className="flex items-center justify-between gap-4 bg-[#1a2b1e] text-white px-5 py-3.5 rounded-2xl">
            <span className="text-sm font-bold">👀 你正在查看朋友的测试结果 · 想知道你是什么人格？</span>
            <button
              onClick={onRestart}
              className="shrink-0 text-xs font-black bg-[#3a8050] hover:bg-[#2d6640] px-4 py-2 rounded-xl transition-colors"
            >
              去测一测
            </button>
          </div>
        )}

        {/* ── 头部：人格卡 ── */}
        <div className="bg-white rounded-3xl border border-[#cde3d1] overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-0">
            {/* 左：图片区 */}
            {imgSrc && (
              <div className="sm:w-56 shrink-0 bg-gradient-to-br from-[#e8f5ec] to-[#d2eada] flex items-center justify-center p-6">
                <img
                  src={imgSrc}
                  alt={finalType.cn}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-md"
                />
              </div>
            )}
            {/* 右：文字区 */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
              <div className="text-xs font-bold text-[#5b9967] tracking-widest mb-2 uppercase">
                {finalType.modeKicker}
              </div>
              <div className="flex items-end gap-3 flex-wrap mb-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-[#1a2b1e] leading-none">
                  {finalType.code}
                </span>
                <span className="text-xl font-bold text-[#3a6644] pb-1">「{finalType.cn}」</span>
              </div>
              <div className="inline-flex w-fit items-center gap-2 bg-[#e8f3ea] border border-[#c6e0cb] rounded-full px-4 py-1.5 text-xs font-bold text-[#3a6644] mb-4">
                {finalType.badge}
              </div>
              {typeCounts[finalType.code] !== undefined && typeCounts[finalType.code] > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[#9ab5a0] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bbf8a]" />
                  已有 <span className="font-bold text-[#5a7060]">{typeCounts[finalType.code].toLocaleString()}</span> 人测出此人格
                </div>
              )}
              <p className="text-base text-[#5a7060] italic leading-relaxed">"{finalType.intro}"</p>
            </div>
          </div>
        </div>

        {/* ── 桌面双栏：左=描述+作者，右=TOP3+副人格 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* 左栏（占2/3） */}
          <div className="lg:col-span-2 space-y-5">

            {/* 人格描述 */}
            <div className="bg-white rounded-2xl border border-[#cde3d1] p-6 sm:p-8">
              <h3 className="font-bold text-base text-[#1a2b1e] mb-4">人格解读</h3>
              <p className="text-sm sm:text-base text-[#304034] leading-[2] whitespace-pre-wrap">
                {finalType.desc}
              </p>
            </div>

            {/* 15维度评分 */}
            <div className="bg-white rounded-2xl border border-[#cde3d1] p-6 sm:p-8">
              <h3 className="font-bold text-base text-[#1a2b1e] mb-4">15 维度评分</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {dimensionOrder.map((dim) => {
                  const ds = dimScores.find((d) => d.dim === dim);
                  if (!ds) return null;
                  const level = ds.level;
                  return (
                    <div key={dim} className="rounded-xl border border-[#e8f0ea] bg-[#fafcfa] p-3">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-xs font-bold text-[#1a2b1e] truncate">
                          {dimensionMeta[dim].name}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${LEVEL_COLOR[level]}`}>
                          {LEVEL_LABEL[level]}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#e8f3ea] rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-[#7bbf8a] to-[#3a8050] rounded-full transition-all"
                          style={{ width: `${ds.normalized * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#6a8870] leading-relaxed">
                        {DIM_EXPLANATIONS[dim][level]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 作者的话 */}
            <details className="bg-white rounded-2xl border border-[#cde3d1] overflow-hidden group">
              <summary className="px-6 py-4 font-bold text-sm cursor-pointer flex items-center justify-between list-none select-none">
                作者的话
                <span className="text-xs font-bold text-[#5b9967] border border-[#cde3d1] bg-[#f0f8f1] px-3 py-1 rounded-full group-open:hidden">展开</span>
                <span className="text-xs font-bold text-[#5b9967] border border-[#cde3d1] bg-[#f0f8f1] px-3 py-1 rounded-full hidden group-open:inline">收起</span>
              </summary>
              <div className="px-6 pb-6 border-t border-[#e8f0ea] space-y-3">
                <p className="text-sm text-[#304034] leading-relaxed mt-4">本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。</p>
                <p className="text-sm text-[#304034] leading-relaxed mt-4">好吧二改作者也有点emo,是因为失恋了呜呜呜呜（B站ID349638942）</p>
                <p className="text-sm text-[#304034] leading-relaxed">由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。</p>
                 <p className="text-sm text-[#304034] leading-relaxed">二改作者为什么测出来是个尤物啊喂喂喂喂，没招了！我是绝世大帅逼（好吧有点胆怯了）</p>
                <p className="text-sm text-[#304034] leading-relaxed">关于这个测试，我没法很好的平衡娱乐和专业性，如有冒犯非常抱歉！！随便搞搞先这样玩玩，好玩为主，还请不要用于盈利呀。</p>
                 <p className="text-sm text-[#304034] leading-relaxed">改了算法应该要准一点喵</p>
              </div>
            </details>
          </div>

          {/* 右栏（占1/3） */}
          <div className="space-y-5">

            {/* TOP3 */}
            <div className="bg-white rounded-2xl border border-[#cde3d1] p-6">
              <h3 className="font-bold text-base text-[#1a2b1e] mb-4">概率前三人格</h3>
              <div className="space-y-3">
                {top3.map((t, i) => (
                  <div key={t.code}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{RANK_MEDAL[i]}</span>
                        <div>
                          <span className="text-sm font-black text-[#1a2b1e]">{t.code}</span>
                          <span className="text-xs text-[#5a7060] ml-1">「{t.cn}」</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#3a6644]">{t.similarity}%</span>
                    </div>
                    <div className="h-2 bg-[#e8f3ea] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7bbf8a] to-[#3a8050] rounded-full transition-all"
                        style={{ width: `${t.similarity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 副人格（酒鬼） */}
            {result.secondaryType && (
              <div className="bg-[#fef9ec] rounded-2xl border border-[#f0d98a] p-5">
                <div className="text-xs font-bold text-[#b8860b] mb-2">若未饮酒，你本来的人格是</div>
                <div className="font-black text-2xl text-[#1a2b1e]">{result.secondaryType.code}</div>
                <div className="text-sm text-[#7a6020]">
                  「{result.secondaryType.cn}」匹配度 {result.secondaryType.similarity}%
                </div>
              </div>
            )}

            {/* 友情提示 */}
            <div className="bg-[#f0f8f1] rounded-2xl border border-[#cde3d1] p-5 text-sm text-[#5a7060] leading-relaxed">
              ⚠️ 本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3">
              {!isShareView && (
                <button
                  onClick={onRestart}
                  className="w-full py-3 rounded-xl bg-[#3a8050] text-white text-sm font-bold
                             hover:bg-[#2d6640] active:scale-95 transition-all shadow-md shadow-[#3a805030]"
                >
                  重新测试
                </button>
              )}
              <button
                onClick={handleShare}
                className="w-full py-3 rounded-xl border border-[#cde3d1] bg-white text-sm font-bold
                           hover:border-[#5b9967] transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '✓ 已复制链接' : '🔗 分享给朋友'}
              </button>
              <button
                onClick={onRestart}
                className="w-full py-3 rounded-xl border border-[#cde3d1] bg-white text-sm font-bold
                           hover:border-[#5b9967] transition-colors"
              >
                {isShareView ? '我也要测' : '回到首页'}
              </button>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
