import type { Question } from '../../types';

const A1: Question[] = [
  {
    id: 'A1_1', dim: 'A1',
    text: '大多数人是善良的',
    options: [
      { label: '其实邪恶的人心比世界上的痔疮更多。', value: 1 },
      { label: '也许吧。', value: 2 },
      { label: '是的，我愿相信好人更多。', value: 3 },
    ],
  },
  {
    id: 'A1_2', dim: 'A1',
    text: '你走在街上，一位萌萌的小女孩蹦蹦跳跳地朝你走来（正脸、侧脸看都萌，用vivo、苹果、华为、OPPO手机看都萌，实在是非常萌的那种），她递给你一根棒棒糖，此时你作何感想？',
    options: [
      { label: '呜呜她真好真可爱！居然给我棒棒糖！', value: 3 },
      { label: '一脸懵逼，作挠头状', value: 2 },
      { label: '这也许是一种新型诈骗？还是走开为好。', value: 1 },
    ],
  },
  {
    id: 'A1_3', dim: 'A1',
    text: '新闻里出现了一则"陌生人帮助老人"的好人好事，你第一反应是',
    options: [
      { label: '背后肯定有什么利益关系，没有无缘无故的好。', value: 1 },
      { label: '也许是真的，但也说不一定。', value: 2 },
      { label: '看到心里暖暖的，世界上还是有好人。', value: 3 },
    ],
  },
  {
    id: 'A1_4', dim: 'A1',
    text: '你路边看到有个老人摔倒了，你会',
    options: [
      { label: '先在脑子里快速推演一遍"扶了会被讹"的剧情。', value: 1 },
      { label: '想扶，但有点犹豫。', value: 2 },
      { label: '直接上去扶，想那么多干什么。', value: 3 },
    ],
  },
  {
    id: 'A1_5', dim: 'A1',
    text: '你的朋友突然对你特别好，请你吃饭、嘘寒问暖，你会想',
    options: [
      { label: '他肯定有什么事要求我，没有无缘无故的好。', value: 1 },
      { label: '有点奇怪，但也许只是他心情好。', value: 2 },
      { label: '开心，有这样的朋友真好。', value: 3 },
    ],
  },
  {
    id: 'A1_6', dim: 'A1',
    text: '你觉得这个世界总体上是',
    options: [
      { label: '危险的、充满套路和算计的。', value: 1 },
      { label: '有好有坏，看你怎么遇。', value: 2 },
      { label: '基本良善的，值得期待。', value: 3 },
    ],
  },
  {
    id: 'A1_7', dim: 'A1',
    text: '"人心隔肚皮"这句话，你认为',
    options: [
      { label: '千真万确，我用血泪验证过多少次了。', value: 1 },
      { label: '有道理，但不是绝对的。', value: 2 },
      { label: '太悲观了，我不这么想。', value: 3 },
    ],
  },
  {
    id: 'A1_8', dim: 'A1',
    text: '你捡到一个钱包，里面有现金和证件，你会',
    options: [
      { label: '交警察，但心想失主也不一定是什么好人，随缘。', value: 1 },
      { label: '联系失主或者上交，这是应该的。', value: 2 },
      { label: '第一时间想办法还给失主，想到丢了多着急。', value: 3 },
    ],
  },
  {
    id: 'A1_9', dim: 'A1',
    text: '你在网上认识了一个人，对方约你线下见面，你',
    options: [
      { label: '拒绝，网上的人我不知道是什么人。', value: 1 },
      { label: '犹豫，约在公共场所也许可以。', value: 2 },
      { label: '去！多认识一个人有什么不好的。', value: 3 },
    ],
  },
  {
    id: 'A1_10', dim: 'A1',
    text: '朋友说你对别人"太好了，小心被人欺负"，你',
    options: [
      { label: '说得对，我确实被欺负过太多次了。', value: 1 },
      { label: '也许，我有时候是要谨慎一点。', value: 2 },
      { label: '我愿意对人好，这没有什么问题。', value: 3 },
    ],
  },
  {
    id: 'A1_11', dim: 'A1',
    text: '你对"人性本善"的看法是',
    options: [
      { label: '扯淡，人性本恶，善是后天装出来的。', value: 1 },
      { label: '说不清，善恶都有。', value: 2 },
      { label: '我相信人的底色是善的。', value: 3 },
    ],
  },
  {
    id: 'A1_12', dim: 'A1',
    text: '当一个完全陌生的人无缘无故给你帮了个忙，你心里',
    options: [
      { label: '警惕，他图什么？', value: 1 },
      { label: '有点惊讶，但也不过度解读。', value: 2 },
      { label: '感动，谢谢你这个陌生人。', value: 3 },
    ],
  },
];

export default A1;
