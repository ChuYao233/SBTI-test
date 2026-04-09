import type { ScoreResult } from '../engine/score';
import { dimensionMeta, DIM_EXPLANATIONS, dimensionOrder } from '../data/dimensions';
import { TYPE_IMAGES } from '../data/types';

interface Props {
  result: ScoreResult;
  onRestart: () => void;
}

const LEVEL_COLOR: Record<string, string> = {
  L: 'text-[#c0392b] bg-[#fdecea]',
  M: 'text-[#d4800a] bg-[#fef3e2]',
  H: 'text-[#2d7a47] bg-[#e8f5ec]',
};
const LEVEL_LABEL: Record<string, string> = { L: '低', M: '中', H: '高' };

export default function ResultScreen({ result, onRestart }: Props) {
  const { finalType, dimScores, ranked } = result;
  const imgSrc = TYPE_IMAGES[finalType.code];
  const top3 = ranked.slice(0, 3);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* 头部：类型名 + 图 */}
        <div className="bg-white rounded-2xl border border-[#cde3d1] p-6 flex gap-5 items-start flex-wrap sm:flex-nowrap">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={finalType.cn}
              className="w-28 h-28 object-contain rounded-xl bg-[#f0f8f1] flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#5b9967] mb-1 tracking-widest">{finalType.modeKicker}</div>
            <div className="text-4xl font-black tracking-tight leading-none text-[#1a2b1e] mb-1">
              {finalType.code}
            </div>
            <div className="text-lg font-bold text-[#3a6644] mb-2">「{finalType.cn}」</div>
            <div className="inline-flex items-center gap-2 bg-[#e8f3ea] border border-[#c6e0cb] rounded-full px-3 py-1 text-xs font-bold text-[#3a6644] mb-3">
              {finalType.badge}
            </div>
            <p className="text-sm text-[#5a7060] italic">"{finalType.intro}"</p>
          </div>
        </div>

        {/* 人格描述 */}
        <div className="bg-white rounded-2xl border border-[#cde3d1] p-6">
          <h3 className="font-bold text-base mb-3">人格解读</h3>
          <p className="text-sm text-[#304034] leading-[1.95] whitespace-pre-wrap">{finalType.desc}</p>
        </div>

        {/* 副人格（酒鬼解锁时显示本来的类型） */}
        {result.secondaryType && (
          <div className="bg-[#fef9ec] rounded-2xl border border-[#f0d98a] p-5">
            <div className="text-xs font-bold text-[#b8860b] mb-1">若未饮酒，你本来的人格是</div>
            <div className="font-black text-2xl text-[#1a2b1e]">{result.secondaryType.code}</div>
            <div className="text-sm text-[#7a6020]">「{result.secondaryType.cn}」匹配度 {result.secondaryType.similarity}%</div>
          </div>
        )}

        {/* TOP3 匹配 */}
        <div className="bg-white rounded-2xl border border-[#cde3d1] p-6">
          <h3 className="font-bold text-base mb-3">概率前三人格</h3>
          <div className="space-y-2">
            {top3.map((t, i) => (
              <div key={t.code} className="flex items-center gap-3">
                <span className="text-xs font-black w-5 text-[#9ab5a0]">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#1a2b1e]">
                      {t.code} <span className="font-normal text-[#5a7060]">「{t.cn}」</span>
                    </span>
                    <span className="text-sm font-bold text-[#3a6644]">{t.similarity}%</span>
                  </div>
                  <div className="h-1.5 bg-[#e8f3ea] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7bbf8a] to-[#3a8050] rounded-full transition-all"
                      style={{ width: `${t.similarity}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#9ab5a0]">使用高斯概率密度匹配，分值越接近代表人格特征越吻合。</p>
        </div>

        {/* 15维度得分 */}
        <div className="bg-white rounded-2xl border border-[#cde3d1] p-6">
          <h3 className="font-bold text-base mb-4">15维度评分</h3>
          <div className="space-y-3">
            {dimensionOrder.map((dim) => {
              const ds = dimScores.find((d) => d.dim === dim);
              if (!ds) return null;
              const level = ds.level;
              const explanation = DIM_EXPLANATIONS[dim][level];
              const meta = dimensionMeta[dim];
              return (
                <div key={dim} className="rounded-xl border border-[#e8f0ea] p-3">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <span className="text-sm font-bold text-[#1a2b1e]">{meta.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-16 bg-[#e8f3ea] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3a8050] rounded-full"
                          style={{ width: `${ds.normalized * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLOR[level]}`}>
                        {LEVEL_LABEL[level]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5a7060] leading-relaxed">{explanation}</p>
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
          <div className="px-6 pb-5 border-t border-[#e8f0ea] space-y-3">
            <p className="text-sm text-[#304034] leading-relaxed mt-4">本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。</p>
            <p className="text-sm text-[#304034] leading-relaxed">由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。</p>
            <p className="text-sm text-[#304034] leading-relaxed">关于这个测试，我没法很好的平衡娱乐和专业性，如有冒犯非常抱歉！！随便搞搞先这样玩玩，好玩为主，还请不要用于盈利呀。</p>
          </div>
        </details>

        {/* 友情提示 */}
        <div className="bg-[#f0f8f1] rounded-2xl border border-[#cde3d1] p-5 text-sm text-[#5a7060] leading-relaxed">
          ⚠️ 本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl border border-[#cde3d1] bg-white text-sm font-bold
                       hover:border-[#5b9967] transition-colors"
          >
            重新测试
          </button>
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-[#3a8050] text-white text-sm font-bold
                       hover:bg-[#2d6640] active:scale-95 transition-all shadow-md shadow-[#3a805030]"
          >
            回到首页
          </button>
        </div>

        {/* 备案 */}
        <footer className="text-center text-xs text-[#9ab5a0] space-y-1 pb-8">
          <p>
            原作者：<a href="https://www.bilibili.com/video/BV1LpDHByET6/" className="underline hover:text-[#3a6644]" target="_blank" rel="noreferrer">B站@蛆肉儿串儿</a>
            　·　<a href="https://unun.dev" className="underline hover:text-[#3a6644]" target="_blank" rel="noreferrer">个人页</a>
          </p>
          <p>
            二改：<a href="https://space.bilibili.com/349638942" className="underline hover:text-[#3a6644]" target="_blank" rel="noreferrer">B站@尧Yao_y</a>
            　·　<a href="https://blog.2o.nz" className="underline hover:text-[#3a6644]" target="_blank" rel="noreferrer">个人页</a>
          </p>
          <p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-[#3a6644]">
              蜀ICP备2024102137号-3
            </a>
            　|　
            <a
              href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51080202020150"
              target="_blank" rel="noreferrer"
              className="hover:text-[#3a6644]"
            >
              川公网安备51080202020150号
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
