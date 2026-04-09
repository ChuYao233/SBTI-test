import type { Question } from '../../types';

const S2: Question[] = [
  {
    id: 'S2_1', dim: 'S2',
    text: '我很清楚真正的自己是什么样的',
    options: [
      { label: '不认同', value: 1 },
      { label: '中立', value: 2 },
      { label: '认同', value: 3 },
    ],
  },
  {
    id: 'S2_2', dim: 'S2',
    text: '我内心有真正追求的东西',
    options: [
      { label: '不认同', value: 1 },
      { label: '中立', value: 2 },
      { label: '认同', value: 3 },
    ],
  },
  {
    id: 'S2_3', dim: 'S2',
    text: '有人问你"你是个什么样的人"，你',
    options: [
      { label: '愣住了，我……是什么样的人来着？', value: 1 },
      { label: '支吾几个形容词应付过去。', value: 2 },
      { label: '有几个词立刻就说出来了，很清楚。', value: 3 },
    ],
  },
  {
    id: 'S2_4', dim: 'S2',
    text: '你正在做一件事，中途突然产生了"我他妈为什么要做这个"的终极拷问，你会',
    options: [
      { label: '就这一句话就让我陷入了长达数日的存在主义危机。', value: 1 },
      { label: '想了想，给自己找了个理由，继续做。', value: 2 },
      { label: '因为我知道为什么，所以继续做。', value: 3 },
    ],
  },
  {
    id: 'S2_5', dim: 'S2',
    text: '朋友说你"最近变了"，你心里',
    options: [
      { label: '有点慌，我真的不确定我是谁了。', value: 1 },
      { label: '也许吧，人都会变的。', value: 2 },
      { label: '没有，我内核从没变过，变的只是表达方式。', value: 3 },
    ],
  },
  {
    id: 'S2_6', dim: 'S2',
    text: '你觉得你的性格是',
    options: [
      { label: '飘忽不定，今天一个样明天又是另一个样。', value: 1 },
      { label: '有稳定的底色，但会随情境波动。', value: 2 },
      { label: '非常稳定，我太了解自己了。', value: 3 },
    ],
  },
  {
    id: 'S2_7', dim: 'S2',
    text: '别人说"我看不懂你这个人"，你',
    options: [
      { label: '连我自己都看不懂我，所以……正常。', value: 1 },
      { label: '我可能比较复杂，没关系。', value: 2 },
      { label: '我看得懂我自己，这就够了。', value: 3 },
    ],
  },
  {
    id: 'S2_8', dim: 'S2',
    text: '如果要给自己写一份"用户手册"，你会',
    options: [
      { label: '无从下笔，我是个黑箱，连我自己也不知道怎么用。', value: 1 },
      { label: '能写个大概，但很多地方说不清楚。', value: 2 },
      { label: '写得很详尽，我对自己了如指掌。', value: 3 },
    ],
  },
  {
    id: 'S2_9', dim: 'S2',
    text: '你和五年前的自己相比，你会说',
    options: [
      { label: '我好像一直在漂流，不确定自己是谁。', value: 1 },
      { label: '有些地方变了，有些地方没变，说不清。', value: 2 },
      { label: '外表不同了，但内核没变，我知道自己是谁。', value: 3 },
    ],
  },
  {
    id: 'S2_10', dim: 'S2',
    text: '你最近有没有在做真正符合自己内心的事？',
    options: [
      { label: '我的"真正内心"是什么我都不知道。', value: 1 },
      { label: '大概有一些吧，说不准。', value: 2 },
      { label: '有，而且我很清楚那是我想要的。', value: 3 },
    ],
  },
  {
    id: 'S2_11', dim: 'S2',
    text: '你在选择两件截然不同的事时，通常',
    options: [
      { label: '不知道自己到底想要哪个，拖着拖着就过去了。', value: 1 },
      { label: '纠结，但最终凭直觉选一个。', value: 2 },
      { label: '很快就知道哪个更适合自己，不用想太久。', value: 3 },
    ],
  },
  {
    id: 'S2_12', dim: 'S2',
    text: '你的价值观是',
    options: [
      { label: '说不上来，感觉每段时间都不太一样。', value: 1 },
      { label: '大致有，但没认真梳理过。', value: 2 },
      { label: '很清晰，我知道自己在乎什么、不在乎什么。', value: 3 },
    ],
  },
];

export default S2;
