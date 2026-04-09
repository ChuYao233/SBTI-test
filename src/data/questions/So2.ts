import type { Question } from '../../types';

const So2: Question[] = [
  {
    id: 'So2_1', dim: 'So2',
    text: '我和人相处主打一个电子围栏，靠太近会自动报警。',
    options: [
      { label: '认同', value: 3 },
      { label: '中立', value: 2 },
      { label: '不认同', value: 1 },
    ],
  },
  {
    id: 'So2_2', dim: 'So2',
    text: '我渴望和我信任的人关系密切，熟得像失散多年的亲戚。',
    options: [
      { label: '认同', value: 1 },
      { label: '中立', value: 2 },
      { label: '不认同', value: 3 },
    ],
  },
  {
    id: 'So2_3', dim: 'So2',
    text: '朋友突然来你家，没提前通知，你',
    options: [
      { label: '当然欢迎，随时来随时欢迎。', value: 1 },
      { label: '有点小惊讶，但还好。', value: 2 },
      { label: '稍微有点不舒服，私人空间应该提前打招呼。', value: 3 },
    ],
  },
  {
    id: 'So2_4', dim: 'So2',
    text: '朋友在你不知情的情况下把你的电话给了别人，你',
    options: [
      { label: '没关系，都是朋友。', value: 1 },
      { label: '有点介意，但算了。', value: 2 },
      { label: '不高兴，应该先问我的。', value: 3 },
    ],
  },
  {
    id: 'So2_5', dim: 'So2',
    text: '你觉得多近的关系才算"好朋友"？',
    options: [
      { label: '能住一起、能分享所有事、像家人那种。', value: 1 },
      { label: '能说心里话，有事互帮。', value: 2 },
      { label: '相互尊重，有分寸，不需要无时无刻腻在一起。', value: 3 },
    ],
  },
  {
    id: 'So2_6', dim: 'So2',
    text: '朋友问你的薪资，你',
    options: [
      { label: '直接说，朋友之间有什么好瞒的。', value: 1 },
      { label: '说个大概范围。', value: 2 },
      { label: '礼貌地回避，这是个人隐私。', value: 3 },
    ],
  },
  {
    id: 'So2_7', dim: 'So2',
    text: '朋友借了你的东西很久没还，你会',
    options: [
      { label: '不好意思开口，算了，算送给ta了。', value: 1 },
      { label: '找个时机提一下。', value: 2 },
      { label: '直接问，借了多久了，还我吧。', value: 3 },
    ],
  },
  {
    id: 'So2_8', dim: 'So2',
    text: '有人总是向你倾诉负面情绪，你',
    options: [
      { label: '一直听，感觉自己有责任帮对方。', value: 1 },
      { label: '听，但有时候会累。', value: 2 },
      { label: '会听，但也会设定自己的能量边界，不无限输出。', value: 3 },
    ],
  },
  {
    id: 'So2_9', dim: 'So2',
    text: '你和不太熟的人吃饭，对方问你很私人的问题，你',
    options: [
      { label: '不好意思拒绝，老老实实回答了。', value: 1 },
      { label: '含糊其辞，应付一下。', value: 2 },
      { label: '微笑着说：这个我不太方便说。', value: 3 },
    ],
  },
  {
    id: 'So2_10', dim: 'So2',
    text: '你对"被人依赖"这件事的感受是',
    options: [
      { label: '好温暖，被需要让我有价值感。', value: 1 },
      { label: '有时开心，有时是负担。', value: 2 },
      { label: '适度可以，但我有自己的边界。', value: 3 },
    ],
  },
  {
    id: 'So2_11', dim: 'So2',
    text: '朋友让你帮一个不太合适的忙，你',
    options: [
      { label: '硬着头皮帮，拒绝太难了。', value: 1 },
      { label: '犹豫，委婉提条件。', value: 2 },
      { label: '直接说不太方便，拒绝就拒绝。', value: 3 },
    ],
  },
  {
    id: 'So2_12', dim: 'So2',
    text: '你觉得关系越亲密，边界',
    options: [
      { label: '越模糊越好，那才叫亲密。', value: 1 },
      { label: '会自然松动，但不会完全消失。', value: 2 },
      { label: '应该一直存在，亲密不代表没有边界。', value: 3 },
    ],
  },
  {
    id: 'So2_13', dim: 'So2',
    text: '你和一个好朋友吃饭，ta突然叹了口气说"最近很烦，跟你说个事"，然后开始讲一件你完全帮不上忙、只能听着的困扰，讲了二十分钟，你的内心状态是',
    options: [
      { label: '全神贯注，帮ta分析，替ta焦虑，比ta还认真。', value: 1 },
      { label: '认真听，回应，但不会把ta的事带回家继续想。', value: 2 },
      { label: '听着，不插话，给ta说完的空间，不急着给意见。', value: 3 },
    ],
  },
  {
    id: 'So2_14', dim: 'So2',
    text: '朋友圈里有一个你不太熟的人发了条状态，说"最近真的好难，感觉支撑不下去了"，配了一张灰色天空的图，你',
    options: [
      { label: '直接发消息过去问：你还好吗，怎么了？', value: 1 },
      { label: '点了个赞，看情况，如果是真的熟人才会私信。', value: 2 },
      { label: '看了，但没有行动，不知道说什么，也不确定对方想要什么。', value: 3 },
    ],
  },
  {
    id: 'So2_15', dim: 'So2',
    text: '一个你关系一般的同事突然问你能不能帮ta请个假，说家里有急事，但ta已经今年请过很多次了，你帮了的话自己也要承担一点额外工作，你',
    options: [
      { label: '帮了，说不出口拒绝，但心里一直在挣扎。', value: 1 },
      { label: '帮了，但说清楚这次是特殊情况。', value: 2 },
      { label: '委婉说明了自己的情况，拒绝了，这不是我的责任范围。', value: 3 },
    ],
  },
  {
    id: 'So2_16', dim: 'So2',
    text: '你认识一个朋友，每次见面必倾诉、必要你帮ta分析人生、必然哭一次、必然让你劝到凌晨两点，但ta从不问你最近怎么样，这段关系持续了两年，你',
    options: [
      { label: '一直撑着，ta需要我，我走了ta怎么办。', value: 1 },
      { label: '开始慢慢减少回应的频率，但没有说破。', value: 2 },
      { label: '直接找个时机告诉ta：这段关系对我来说太消耗了，我们聊聊。', value: 3 },
    ],
  },
];

export default So2;
