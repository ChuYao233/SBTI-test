import { useState, useCallback } from 'react';
import IntroScreen from './components/IntroScreen';
import TestScreen from './components/TestScreen';
import ResultScreen from './components/ResultScreen';
import { sampleQuestions, type QuestionCount } from './engine/sampler';
import { computeScore, type ScoreResult } from './engine/score';
import type { Question } from './types';
import { specialQuestions } from './data/questions/index';

type Screen = 'intro' | 'test' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<ScoreResult | null>(null);

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
      setScreen('result');
    },
    [questions],
  );

  const handleRestart = useCallback(() => {
    setScreen('intro');
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f8f4] font-sans text-[#1a2b1e]">
      {screen === 'intro' && <IntroScreen onStart={handleStart} />}
      {screen === 'test' && (
        <TestScreen
          questions={questions}
          onSubmit={handleSubmit}
          onBack={handleRestart}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}
