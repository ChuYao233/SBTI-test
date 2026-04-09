import type { Question } from '../../types';

const Ac1: Question[] = [
  {
    id: 'Ac1_1', dim: 'Ac1',
    text: '我做事主要为了取得成果和进步，而不是避免麻烦和风险。',
    options: [
      { label: '不认同', value: 1 },
      { label: '中立', value: 2 },
      { label: '认同', value: 3 },
    ],
  },
  {
    id: 'Ac1_2', dim: 'Ac1',
    text: '你因便秘坐在马桶上（已长达30分钟），拉不出很难受。此时你更像',
    options: [
      { label: '再坐三十分钟看看，说不定就有了。', value: 1 },
      { label: '用力拍打自己的屁股并说："死屁股，快拉啊！"', value: 2 },
      { label: '使用开塞露，快点拉出来才好。', value: 3 },
    ],
  },
  {
    id: 'Ac1_3', dim: 'Ac1',
    text: '你工作努力，最主要的原因是',
    options: [
      { label: '怕被骂、怕丢工作。', value: 1 },
      { label: '有时是热情，有时是压力，混着的。', value: 2 },
      { label: '真心喜欢把事情做好，有成就感。', value: 3 },
    ],
  },
  {
    id: 'Ac1_4', dim: 'Ac1',
    text: '有一个高风险高回报的机会摆在你面前，你',
    options: [
      { label: '算了，风险太高，赔了怎么办。', value: 1 },
      { label: '评估一下再说。', value: 2 },
      { label: '值得冲，不试怎么知道。', value: 3 },
    ],
  },
  {
    id: 'Ac1_5', dim: 'Ac1',
    text: '你学一项新技能，主要是因为',
    options: [
      { label: '怕落后，不学会被人超过。', value: 1 },
      { label: '一部分机会，一部分防御。', value: 2 },
      { label: '我真的想成长，想变得更厉害。', value: 3 },
    ],
  },
  {
    id: 'Ac1_6', dim: 'Ac1',
    text: '你选择一份工作，最主要的考量是',
    options: [
      { label: '稳定、风险小、不会被裁。', value: 1 },
      { label: '稳定和发展空间兼顾。', value: 2 },
      { label: '有没有挑战性和成长空间。', value: 3 },
    ],
  },
  {
    id: 'Ac1_7', dim: 'Ac1',
    text: '你做一件事，失败率可能很高，你会',
    options: [
      { label: '不做，失败了很难看。', value: 1 },
      { label: '考虑一下可接受的失败成本。', value: 2 },
      { label: '愿意试，失败了也是经验。', value: 3 },
    ],
  },
  {
    id: 'Ac1_8', dim: 'Ac1',
    text: '你读书学习，通常是因为',
    options: [
      { label: '考试要考，不然我才不学。', value: 1 },
      { label: '有时被逼，有时自愿，各占一半。', value: 2 },
      { label: '好奇心驱动，真的想知道更多东西。', value: 3 },
    ],
  },
  {
    id: 'Ac1_9', dim: 'Ac1',
    text: '给你一个完全没有外部压力的空闲月，你会',
    options: [
      { label: '终于可以什么都不干了，躺到天荒地老。', value: 1 },
      { label: '放松一阵，慢慢再找点事做。', value: 2 },
      { label: '主动给自己设任务，推进一个想做的项目。', value: 3 },
    ],
  },
  {
    id: 'Ac1_10', dim: 'Ac1',
    text: '你加班了，理由是',
    options: [
      { label: '不加不行，老板会说我。', value: 1 },
      { label: '有时有必要，有时是迫于压力。', value: 2 },
      { label: '任务没完成我自己不踏实，自愿加的。', value: 3 },
    ],
  },
  {
    id: 'Ac1_11', dim: 'Ac1',
    text: '你运动健身，动力来自',
    options: [
      { label: '朋友说我胖了，不得不动。', value: 1 },
      { label: '保持健康，偶尔也为好看。', value: 2 },
      { label: '突破自己，享受进步感。', value: 3 },
    ],
  },
  {
    id: 'Ac1_12', dim: 'Ac1',
    text: '你做一件事，失败了，你会',
    options: [
      { label: '很沮丧，怀疑自己根本不适合做这个。', value: 1 },
      { label: '难受一阵，慢慢调整。', value: 2 },
      { label: '复盘哪里出了问题，再来一次。', value: 3 },
    ],
  },
  {
    id: 'Ac1_13', dim: 'Ac1',
    text: '你在做一件事的时候，旁边有人对你说"你这样做没有任何意义，最后也不会有什么结果"，你当时的反应是',
    options: [
      { label: '停下来了。因为他说的话触发了我自己本来就有的怀疑。', value: 1 },
      { label: '有点烦，但继续做，也许他有一点点道理。', value: 2 },
      { label: '继续。你说没意义是你的事，我觉得有意义就够了。', value: 3 },
    ],
  },
  {
    id: 'Ac1_14', dim: 'Ac1',
    text: '你参加了一个考试，复习的时候你认认真真地准备了三周，结果考完发现有两道大题是你完全没复习到的知识点，你当时心里',
    options: [
      { label: '完了，这两题没了，感觉什么都做不好。', value: 1 },
      { label: '遗憾，但反正其他题还好，等成绩吧。', value: 2 },
      { label: '记下来，回去查，下次不再遗漏这个点。', value: 3 },
    ],
  },
  {
    id: 'Ac1_15', dim: 'Ac1',
    text: '你报名参加了一个全年的学习计划，付了一笔不小的钱，前两个月你都坚持得不错，到了第三个月某一周因为工作太忙断了四天，你的第一反应是',
    options: [
      { label: '完了，断了就是断了，这计划算是废了，大概率不想继续了。', value: 1 },
      { label: '有点愧疚，但告诉自己从下周重新开始。', value: 2 },
      { label: '把这四天的内容周末补上，继续走。', value: 3 },
    ],
  },
  {
    id: 'Ac1_16', dim: 'Ac1',
    text: '假设你现在刚看完一个关于"某天才年轻人在23岁创业成功改变行业"的纪录片，看完之后你想到了自己，你脑子里最接近的一个念头是',
    options: [
      { label: '人和人的差距真的像银河系和微生物之间的距离，我这辈子就这样了。', value: 1 },
      { label: '他有他的条件，我有我的处境，硬比没意义，但也想做点什么。', value: 2 },
      { label: '我不会成为他，但我有我想做的事，我先把那个做好。', value: 3 },
    ],
  },
];

export default Ac1;
