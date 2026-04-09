import type { Question } from '../../types';

export const specialQuestions: Question[] = [
  {
    id: 'drink_gate_q1',
    dim: '',
    special: true,
    kind: 'drink_gate',
    text: '您平时有什么爱好？',
    options: [
      { label: '吃喝拉撒', value: 1 },
      { label: '艺术爱好', value: 2 },
      { label: '饮酒', value: 3 },
      { label: '健身', value: 4 },
    ],
  },
  {
    id: 'drink_gate_q2',
    dim: '',
    special: true,
    kind: 'drink_trigger',
    text: '您对饮酒的态度是？',
    options: [
      { label: '小酌怡情，喝不了太多。', value: 1 },
      { label: '我习惯将白酒灌在保温杯，当白开水喝，酒精令我信服。', value: 2 },
    ],
  },
  {
    id: 'heartbreak_q1',
    dim: '',
    special: true,
    kind: 'heartbreak_gate',
    text: '某天你的对象突然跑来，神情严肃地坐在你对面，深吸一口气，然后说："我觉得我们……不太合适，我不喜欢你了。"此刻你',
    options: [
      { label: '哦。（沉默三秒）好。（起身去倒了杯水，回来继续坐着）', value: 1 },
      { label: '啊？为什么？（开始理性分析原因，希望找到可以改进的地方）', value: 2 },
      { label: '裂开。字面意义上的裂开。整个人当场碎成17片。', value: 3 },
      { label: '我先问一句：是我的问题还是你变了？（侦探模式启动）', value: 4 },
    ],
  },
];
