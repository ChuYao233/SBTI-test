import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import SiteFooter from './SiteFooter';
import type { Question } from '../types';
import { specialQuestions } from '../data/questions/index';

interface Props {
  questions: Question[];
  onSubmit: (answers: Record<string, number>) => void;
  onBack: () => void;
}

const CODES = ['A', 'B', 'C', 'D'];

export default function TestScreen({ questions, onSubmit, onBack }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // 动态可见题目（酒门题触发后插入追问）
  const visible = useMemo(() => {
    const list = [...questions];
    const gateIdx = list.findIndex((q) => q.id === 'drink_gate_q1');
    if (gateIdx !== -1 && answers['drink_gate_q1'] === 3) {
      list.splice(gateIdx + 1, 0, specialQuestions[1]);
    }
    return list;
  }, [questions, answers]);

  const total = visible.length;
  const done = visible.filter((q) => answers[q.id] !== undefined).length;
  const percent = total > 0 ? (done / total) * 100 : 0;
  const complete = done === total && total > 0;

  // 重置答案（换题组时）
  useEffect(() => { setAnswers({}); }, [questions]);

  // 跳到第一道未答题
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToFirst = useCallback(() => {
    const first = visible.find((q) => answers[q.id] === undefined);
    if (!first) return;
    const el = document.querySelector(`[data-qid="${first.id}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(first.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 1800);
  }, [visible, answers]);

  function handleChange(qid: string, value: number, isGate: boolean) {
    setAnswers((prev) => {
      const next = { ...prev, [qid]: value };
      if (isGate && value !== 3) delete next['drink_gate_q2'];
      return next;
    });
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 进度条 */}
        <div className="sticky top-4 z-10 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#cde3d1] px-5 py-3 flex items-center gap-4 shadow-sm">
          <div className="flex-1 h-2 bg-[#e8f3ea] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7bbf8a] to-[#3a8050] rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#3a6644] whitespace-nowrap">{done} / {total}</span>
        </div>

        {/* 题目列表 */}
        <div className="space-y-4">
          {visible.map((q, idx) => (
            <article
              key={q.id}
              data-qid={q.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all duration-300
                ${
                  highlightId === q.id
                    ? 'border-[#3a8050] bg-[#edf7ef] shadow-[#3a805030] shadow-md'
                    : 'bg-white border-[#cde3d1]'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-[#e8f3ea] text-[#3a6644] px-3 py-1 rounded-full">
                  第 {idx + 1} 题
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#1a2b1e] mb-4 whitespace-pre-wrap">
                {q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const checked = answers[q.id] === opt.value;
                  const isGate = q.kind === 'drink_gate';
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150
                        ${checked
                          ? 'border-[#5b9967] bg-[#edf7ef] shadow-sm'
                          : 'border-[#e0ece2] bg-[#fafcfa] hover:border-[#a8d4b0] hover:bg-[#f4fbf5]'
                        }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={checked}
                        onChange={() => handleChange(q.id, opt.value, isGate)}
                        className="mt-0.5 accent-[#3a8050] flex-shrink-0"
                      />
                      <span className="font-bold text-[#3a6644] text-sm w-4 flex-shrink-0">
                        {CODES[i]}
                      </span>
                      <span className="text-sm text-[#1a2b1e] leading-relaxed">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {/* 底部操作栏 */}
        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className={`text-sm ${complete ? 'text-[#3a6644] font-bold' : 'text-[#9ab5a0]'}`}>
              {complete
                ? '✓ 都做完了。现在可以把你的电子魂魄交给结果页审判。'
                : '全选完才会放行。世界已经够乱了，起码把题做完整。'}
            </p>
            {!complete && (
              <button
                onClick={scrollToFirst}
                className="self-start flex items-center gap-1.5 text-xs font-bold text-[#3a8050]
                           bg-[#edf7ef] border border-[#a8d4b0] px-3 py-1.5 rounded-lg
                           hover:bg-[#daeeda] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                跳到未做题（还剩 {total - done} 题）
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-[#cde3d1] bg-white text-sm font-bold
                         hover:border-[#5b9967] transition-colors"
            >
              返回首页
            </button>
            <button
              onClick={() => complete && onSubmit(answers)}
              disabled={!complete}
              className="px-5 py-2.5 rounded-xl bg-[#3a8050] text-white text-sm font-bold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-[#2d6640] active:scale-95 transition-all shadow-md shadow-[#3a805030]"
            >
              提交并查看结果
            </button>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
