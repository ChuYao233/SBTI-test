import type { QuestionCount } from '../engine/sampler';

interface Props {
  onStart: (count: QuestionCount) => void;
}

const QUIZ_OPTIONS: { count: QuestionCount; label: string; desc: string; time: string; color: string }[] = [
  { count: 30, label: '30 题', desc: '每维度 2 题，极速体验', time: '约 5 分钟', color: 'from-[#e8f5ec] to-[#f4fbf5]' },
  { count: 60, label: '60 题', desc: '每维度 4 题，标准精度', time: '约 10 分钟', color: 'from-[#dff0e5] to-[#edf7f0]' },
  { count: 90, label: '90 题', desc: '每维度 6 题，深度分析', time: '约 15 分钟', color: 'from-[#d2eada] to-[#e5f4ea]' },
];

const AUTHORS = [
  {
    role: '原作者',
    name: '蛆肉儿串儿',
    bili: 'https://www.bilibili.com/video/BV1LpDHByET6/',
    site: 'https://unun.dev',
    github: 'https://github.com/UnluckyNinja',
  },
  {
    role: '二改作者',
    name: '尧 Yao_y',
    bili: 'https://space.bilibili.com/349638942',
    site: 'https://blog.2o.nz',
    github: 'https://github.com/chuyao233',
  },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#f4f8f4]">
      <div className="w-full max-w-2xl space-y-6">

        {/* ── 标题区 ── */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-[#daeeda] text-[#3a6644] text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a6644] animate-pulse" />
            SBTI · 人格测试
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight mb-5 text-[#1a2b1e]">
            MBTI 已经过时，<br />
            <span className="text-[#3a8050]">SBTI</span> 来了。
          </h1>
          <p className="text-[#5a7060] text-base leading-relaxed max-w-md mx-auto">
            基于 15 维度人格模型，采用<strong className="text-[#3a6644]">贝叶斯概率匹配</strong>算法。<br />
            本测试仅供娱乐，别拿它当诊断书。
          </p>
        </div>

        {/* ── 选题量 ── */}
        <div>
          <p className="text-sm font-bold text-[#3a6644] mb-3 px-1">选择题目数量</p>
          <div className="grid grid-cols-3 gap-4">
            {QUIZ_OPTIONS.map(({ count, label, desc, time, color }) => (
              <button
                key={count}
                onClick={() => onStart(count)}
                className={`group flex flex-col items-start gap-2 p-5 rounded-2xl border border-[#cde3d1]
                            bg-gradient-to-br ${color}
                            hover:border-[#5b9967] hover:shadow-xl hover:shadow-[#5b996718]
                            active:scale-95 transition-all duration-150 text-left`}
              >
                <span className="text-2xl font-black text-[#1a2b1e] group-hover:text-[#3a6644] transition-colors leading-none">
                  {label}
                </span>
                <span className="text-xs text-[#5a7060] leading-relaxed">{desc}</span>
                <span className="mt-auto text-[11px] font-semibold text-[#7aad88] bg-white/70 px-2.5 py-1 rounded-full border border-[#cde3d1]">
                  {time}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 算法说明 ── */}
        <div className="rounded-2xl border border-[#cde3d1] bg-white p-6">
          <h3 className="font-bold text-sm text-[#1a2b1e] mb-3">关于算法</h3>
          <ul className="text-sm text-[#5a7060] space-y-2">
            <li className="flex items-start gap-2"><span className="text-[#3a8050] mt-0.5">✦</span>每次从题库随机抽取，同一人多次作答结果可能不同</li>
            <li className="flex items-start gap-2"><span className="text-[#3a8050] mt-0.5">✦</span>题目越多，维度采样越充分，结果越稳定</li>
          </ul>
        </div>

        {/* ── 作者卡片 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUTHORS.map((a) => (
            <div key={a.role} className="rounded-2xl border border-[#cde3d1] bg-white p-5">
              <div className="text-[10px] font-bold text-[#7aad88] tracking-widest mb-1 uppercase">{a.role}</div>
              <div className="font-black text-lg text-[#1a2b1e] mb-3">@{a.name}</div>
              <div className="flex flex-wrap gap-2">
                <a href={a.bili} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f0f8f1] border border-[#cde3d1] text-[#3a6644] hover:bg-[#daeeda] transition-colors">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>
                  B站
                </a>
                <a href={a.site} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f0f8f1] border border-[#cde3d1] text-[#3a6644] hover:bg-[#daeeda] transition-colors">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.07 16zm2.95-8H5.07a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
                  个人页
                </a>
                <a href={a.github} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f0f8f1] border border-[#cde3d1] text-[#3a6644] hover:bg-[#daeeda] transition-colors">
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="pt-2 pb-6 space-y-3">
          {/* CDN 说明 */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#9ab5a0]">
            <span>本站 CDN 由</span>
            <img src="https://api.yaooa.cn/icons/foot-esa.png" alt="阿里云 ESA" title="阿里云 ESA" className="h-4 opacity-70 hover:opacity-100 transition-opacity" />
            <span>提供</span>
          </div>

          {/* 备案行 */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#9ab5a0]">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#3a6644] transition-colors">
              <img src="https://api.yaooa.cn/icons/foot-icp.png" alt="ICP" className="h-3.5 opacity-70" />
              蜀ICP备2024102137号-3
            </a>
            <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51080202020150"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#3a6644] transition-colors">
              <img src="https://api.yaooa.cn/icons/foot-ga.png" alt="公安备案" className="h-3.5 opacity-70" />
              川公网安备51080202020150号
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
