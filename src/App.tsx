import { useState, useCallback, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import TestScreen from './components/TestScreen';
import ResultScreen from './components/ResultScreen';
import TypesScreen from './components/TypesScreen';
import { sampleQuestions, type QuestionCount } from './engine/sampler';
import { computeScore, type ScoreResult } from './engine/score';
import { fetchUmamiStats, trackEvent, type UmamiStats } from './engine/umami';
import { decodeShare, decodeDimsLegacy } from './engine/encode';
import { TYPE_LIBRARY } from './data/types';
import { dimensionOrder } from './data/dimensions';
import type { Question } from './types';
import { specialQuestions } from './data/questions/index';

type Screen = 'intro' | 'test' | 'result' | 'types';

function normToLevel(n: number): 'L' | 'M' | 'H' {
  if (n < 0.37) return 'L';
  if (n < 0.67) return 'M';
  return 'H';
}

/** 从 URL ?e= 参数还原分享结果（兼容旧格式 ?r=&d= / ?r=&e= / ?result=） */
function buildShareResult(params: URLSearchParams): ScoreResult | null {
  const eStr = params.get('e');

  // 新格式：?e=26chars（包含人格+相似度+维度+副人格）
  if (eStr) {
    const decoded = decodeShare(eStr);
    if (!decoded) return null;
    const info = TYPE_LIBRARY[decoded.code];
    if (!info) return null;
    const isSpecial = decoded.code === 'DRUNK' || decoded.code === 'HHHH';
    const fakeType = {
      code: decoded.code, cn: info.cn, intro: info.intro, desc: info.desc,
      similarity: decoded.similarity, logScore: 0,
      modeKicker: '分享结果',
      badge: `人格 ${decoded.code}「${info.cn}」· 匹配度 ${decoded.similarity}%`,
      sub: '', special: isSpecial,
    };
    const dimScores = dimensionOrder.map((dim, i) => {
      const normalized = decoded.norms[i] ?? 0.5;
      return { dim, raw: 0, normalized, level: normToLevel(normalized) };
    });
    const levels = Object.fromEntries(dimScores.map((d) => [d.dim, d.level])) as Record<typeof dimensionOrder[number], 'L'|'M'|'H'>;
    let secondaryType = null;
    if (decoded.secondaryCode && TYPE_LIBRARY[decoded.secondaryCode]) {
      const s2 = TYPE_LIBRARY[decoded.secondaryCode];
      secondaryType = { code: decoded.secondaryCode, cn: s2.cn, intro: s2.intro, desc: s2.desc, similarity: decoded.secondarySimilarity ?? 0, logScore: 0 };
    }
    return { dimScores, levels, ranked: [], bestNormal: fakeType, finalType: fakeType, secondaryType, drunkTriggered: decoded.code === 'DRUNK' };
  }

  // 兼容旧格式 ?r=CODE&d=encoded 或 ?result=CODE
  const code = params.get('r') ?? params.get('result');
  if (!code) return null;
  const info = TYPE_LIBRARY[code];
  if (!info) return null;
  const isSpecial = code === 'DRUNK' || code === 'HHHH';
  const similarity = parseInt(params.get('s') ?? '100', 10);
  const dStr = params.get('d');
  const dimNorms = dStr
    ? (decodeDimsLegacy(dStr) ?? dimensionOrder.map(() => 0.5))
    : dimensionOrder.map(() => 0.5);
  const fakeType = {
    code, cn: info.cn, intro: info.intro, desc: info.desc,
    similarity, logScore: 0, modeKicker: '分享结果',
    badge: `人格 ${code}「${info.cn}」· 匹配度 ${similarity}%`,
    sub: '', special: isSpecial,
  };
  const dimScores = dimensionOrder.map((dim, i) => {
    const normalized = dimNorms[i] ?? 0.5;
    return { dim, raw: 0, normalized, level: normToLevel(normalized) };
  });
  const levels = Object.fromEntries(dimScores.map((d) => [d.dim, d.level])) as Record<typeof dimensionOrder[number], 'L'|'M'|'H'>;
  return { dimScores, levels, ranked: [], bestNormal: fakeType, finalType: fakeType, secondaryType: null, drunkTriggered: code === 'DRUNK' };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isShareView, setIsShareView] = useState(false);
  const [umamiStats, setUmamiStats] = useState<UmamiStats>({ total: 0, typeCounts: {} });
  const [statsLoaded, setStatsLoaded] = useState(false);

  // 启动时拉取统计数据
  useEffect(() => {
    fetchUmamiStats().then((s) => {
      setUmamiStats(s);
      setStatsLoaded(true);
    });
  }, []);

  // 启动时检测分享链接 ?e=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('e') ? '_share_' : (params.get('r') ?? params.get('result'));
    if (code) {
      const shareRes = buildShareResult(params);
      if (shareRes) {
        setResult(shareRes);
        setIsShareView(true);
        setScreen('result');
        trackEvent('share_view', { type: code });
      }
    }
  }, []);

  const handleStart = useCallback((count: QuestionCount) => {
    setQuestions(sampleQuestions(count));
    setResult(null);
    setScreen('test');
  }, []);

  const handleSubmit = useCallback(
    (answers: Record<string, number>) => {
      const drunkTriggered = answers[specialQuestions[1]?.id] === 2;
      const res = computeScore(answers, questions, drunkTriggered);
      setResult(res);
      setIsShareView(false);
      setScreen('result');
      // 上报测试完成
      trackEvent('test_complete', { type: res.finalType.code });
    },
    [questions],
  );

  const handleRestart = useCallback(() => {
    // 清除 URL 参数
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsShareView(false);
    setScreen('intro');
  }, []);

  const handleOpenTypes = useCallback(() => {
    setScreen('types');
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f8f4] font-sans text-[#1a2b1e]">
      {screen === 'intro' && <IntroScreen onStart={handleStart} onOpenTypes={handleOpenTypes} statsTotal={umamiStats.total} statsLoaded={statsLoaded} />}
      {screen === 'types' && <TypesScreen onBack={handleRestart} umamiStats={umamiStats} statsLoaded={statsLoaded} />}
      {screen === 'test' && (
        <TestScreen
          questions={questions}
          onSubmit={handleSubmit}
          onBack={handleRestart}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} isShareView={isShareView} typeCounts={umamiStats.typeCounts} />
      )}
    </div>
  );
}
