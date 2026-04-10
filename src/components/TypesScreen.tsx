import { useState } from 'react';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_IMAGES } from '../data/types';
import SiteFooter from './SiteFooter';
import type { UmamiStats } from '../engine/umami';

interface Props {
  onBack: () => void;
  umamiStats?: UmamiStats;
  statsLoaded?: boolean;
}

// 特殊人格（不在 NORMAL_TYPES 里的）
const SPECIAL_CODES = ['HHHH', 'DRUNK'];

// 所有人格列表：普通 + 特殊
const ALL_TYPES = [
  ...NORMAL_TYPES.map((t) => t.code),
  ...SPECIAL_CODES,
];

export default function TypesScreen({ onBack, umamiStats, statsLoaded = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const statsTotal = umamiStats?.total ?? 0;
  const typeCounts = umamiStats?.typeCounts ?? {};

  const selectedType = selected ? TYPE_LIBRARY[selected] : null;
  const selectedImg = selected ? TYPE_IMAGES[selected] : null;
  const isSpecial = selected ? SPECIAL_CODES.includes(selected) : false;

  return (
    <div className="min-h-screen bg-[#f4f8f4] py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* 顶部导航 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-[#5a7060] hover:text-[#3a6644] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            返回首页
          </button>
          <div className="h-4 w-px bg-[#cde3d1]" />
          <h1 className="text-xl font-black text-[#1a2b1e]">人格图鉴</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold text-[#9ab5a0] bg-white border border-[#cde3d1] px-3 py-1 rounded-full">
              共 {ALL_TYPES.length} 种人格
            </span>
            <span className="text-xs font-bold text-[#3a6644] bg-[#e8f3ea] border border-[#b8dfc4] px-3 py-1 rounded-full">
              累计访问数：{statsLoaded ? statsTotal.toLocaleString() : '···'}
            </span>
          </div>
        </div>

        {/* 人格卡片网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {ALL_TYPES.map((code) => {
            const info = TYPE_LIBRARY[code];
            const img = TYPE_IMAGES[code];
            const isSpecialCard = SPECIAL_CODES.includes(code);
            const isActive = selected === code;
            return (
              <button
                key={code}
                onClick={() => setSelected(isActive ? null : code)}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-150 text-center
                  ${isActive
                    ? 'border-[#3a8050] bg-[#edf7ef] shadow-md shadow-[#3a805020]'
                    : 'border-[#cde3d1] bg-white hover:border-[#7bbf8a] hover:bg-[#f4fbf5]'
                  }`}
              >
                {/* 特殊人格标记 */}
                {isSpecialCard && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-[#3a8050] text-white px-1.5 py-0.5 rounded-full leading-none">
                    隐藏
                  </span>
                )}
                {/* 头像 */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#e8f3ea] flex-shrink-0">
                  {img
                    ? <img src={img} alt={code} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#7bbf8a]">
                        {code.slice(0, 1)}
                      </div>
                  }
                </div>
                <div>
                  <div className="text-sm font-black text-[#1a2b1e] leading-tight">{code}</div>
                  <div className="text-xs text-[#7aad88] leading-tight mt-0.5">「{info?.cn}」</div>
                  {(
                    <div className="text-[10px] text-[#9ab5a0] mt-0.5">
                      {statsLoaded ? `${typeCounts[code] ?? 0} 人测出` : '···'}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 详情展开区 */}
        {selectedType && (
          <div className="bg-white rounded-2xl border border-[#cde3d1] overflow-hidden mb-8 shadow-sm">
            {/* 头部 */}
            <div className="flex items-center gap-5 p-6 border-b border-[#e8f0ea]">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#e8f3ea] flex-shrink-0">
                {selectedImg
                  ? <img src={selectedImg} alt={selectedType.code} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[#7bbf8a]">
                      {selectedType.code.slice(0, 1)}
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-black text-[#1a2b1e]">{selectedType.code}</span>
                  <span className="text-sm font-bold text-[#5a7060]">「{selectedType.cn}」</span>
                  {isSpecial && (
                    <span className="text-[10px] font-black bg-[#3a8050] text-white px-2 py-0.5 rounded-full">
                      隐藏人格
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#7aad88] italic mt-1">"{selectedType.intro}"</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#9ab5a0] hover:text-[#3a6644] transition-colors flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* 描述 */}
            <div className="p-6">
              <p className="text-sm text-[#304034] leading-relaxed">{selectedType.desc}</p>
            </div>
          </div>
        )}

        {/* 空态提示 */}
        {!selected && (
          <div className="text-center py-4 text-sm text-[#9ab5a0]">
            点击上方任意人格卡片查看详细介绍
          </div>
        )}

        <SiteFooter />
      </div>
    </div>
  );
}
