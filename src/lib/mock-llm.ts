import type { Choice, ChatMessage } from '@/lib/game-types';
import { INITIAL_EMOTION, QUALITY_EMOTION_MAP, EMOTION_WIN, EMOTION_LOSE, MAX_ROUNDS } from '@/lib/game-prompts';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CONFLICT_SCENARIOS = [
  {
    conflictReason: '忘记了恋爱纪念日',
    firstMessage: '哼，某人今天好像忘了什么重要的日子呢...[翻白眼]',
    replies: [
      { emotionRange: [0, 40], texts: ['还知道来哄我？晚了！', '纪念日都能忘，你心里还有我吗？', '算了，反正你也不在乎'] },
      { emotionRange: [41, 70], texts: ['哼，算你还有点良心...', '那你准备怎么补偿我？', '好吧，我勉为其难听一下'] },
      { emotionRange: [71, 100], texts: ['好吧好吧，原谅你了~', '看在你这么诚恳的份上...', '下次再忘就真的不理你了！'] },
    ],
    choices: {
      good: ['亲爱的对不起！我准备了惊喜！', '纪念日快乐！礼物已经买好了', '我错了！今晚带你去吃大餐'],
      neutral: ['啊？今天是什么日子？', '不好意思，最近太忙了', '下次一定记住'],
      bad: ['纪念日而已，有那么重要吗？', '忘了就忘了，下次补上', '你怎么又生气了？'],
    },
  },
  {
    conflictReason: '打游戏不接电话',
    firstMessage: '打游戏打得连电话都不接了是吧？[生气]',
    replies: [
      { emotionRange: [0, 40], texts: ['游戏比我重要是吧？', '你继续打啊，别理我！', '行，那你跟游戏过去吧'] },
      { emotionRange: [41, 70], texts: ['哼，现在知道来找我了？', '那你说说看，游戏好玩还是我好玩？', '我生气的时候你在打游戏？'] },
      { emotionRange: [71, 100], texts: ['好吧...下次不许这样了', '真的不打了？那陪我聊天', '看你这么紧张的份上，原谅你'] },
    ],
    choices: {
      good: ['宝贝对不起！游戏不重要你才重要', '马上退出游戏！现在只陪你', '我错了！以后优先接你电话'],
      neutral: ['刚才团战太激烈了没听见', '打完这局就接了', '下次会注意的'],
      bad: ['就打个游戏而已至于吗？', '你怎么老在我打游戏的时候打电话', '游戏马上就赢了，你急什么'],
    },
  },
  {
    conflictReason: '回消息太慢',
    firstMessage: '一条消息要等半小时？你是在干嘛啊？[撇嘴]',
    replies: [
      { emotionRange: [0, 40], texts: ['半小时都不回，你是不是不在乎我了？', '算了，我也不想说了', '别人秒回就你最慢'] },
      { emotionRange: [41, 70], texts: ['哼，现在知道回了？', '那你刚才在忙什么？', '下次再这样我就不回你了'] },
      { emotionRange: [71, 100], texts: ['好吧，相信你一次', '那你要补偿我', '下次不许让我等那么久！'] },
    ],
    choices: {
      good: ['宝贝对不起！刚才在忙重要的事，现在立刻陪你', '让你等太久了！我错了！', '以后每小时都主动跟你汇报'],
      neutral: ['刚才有点事', '手机放一边没看到', '下次会快点回'],
      bad: ['你也太粘人了吧', '回消息慢怎么了', '我忙我的不行吗'],
    },
  },
  {
    conflictReason: '和异性聊天被看到',
    firstMessage: '跟谁聊天呢？笑得那么开心？[怀疑]',
    replies: [
      { emotionRange: [0, 40], texts: ['行啊你，当着我的面跟别人聊得挺嗨', '我看你们聊得挺开心的嘛', '既然她那么好，你去找她啊'] },
      { emotionRange: [41, 70], texts: ['真的只是普通朋友？', '那你为什么笑得那么开心？', '下次不许跟她聊那么久'] },
      { emotionRange: [71, 100], texts: ['好吧，相信你一次', '那你要答应我少跟她聊天', '下次再让我看到就不理你了！'] },
    ],
    choices: {
      good: ['只是同事/同学啦！你才是最重要的', '宝贝别吃醋！我只喜欢你', '马上删掉！以后只跟你聊天'],
      neutral: ['就是普通朋友', '工作上的事', '你想多了'],
      bad: ['你管太多了吧', '聊个天怎么了', '你是不是太敏感了'],
    },
  },
  {
    conflictReason: '忘记买奶茶',
    firstMessage: '说好的奶茶呢？你又忘了！[委屈]',
    replies: [
      { emotionRange: [0, 40], texts: ['每次都忘，你根本不把我的话放心上', '算了，不喝了', '我就知道你不会记得'] },
      { emotionRange: [41, 70], texts: ['哼，现在知道了？', '那你准备怎么补偿我？', '下次再忘我真的生气了'] },
      { emotionRange: [71, 100], texts: ['好吧好吧，原谅你了', '那你现在去买！', '下次不许再忘了！'] },
    ],
    choices: {
      good: ['立刻去买！再加一份小蛋糕赔罪！', '宝贝对不起！我马上点外卖！', '我错了！以后每天都给你买奶茶'],
      neutral: ['刚才忘了', '下次一定买', '要不今天不喝了？'],
      bad: ['奶茶有那么重要吗？', '忘了就忘了，明天再买', '你怎么天天都要喝奶茶'],
    },
  },
];

function getReplyByEmotion(scenario: typeof CONFLICT_SCENARIOS[0], emotion: number): string {
  for (const group of scenario.replies) {
    if (emotion >= group.emotionRange[0] && emotion <= group.emotionRange[1]) {
      return group.texts[randomInt(0, group.texts.length - 1)];
    }
  }
  return scenario.replies[1].texts[0];
}

function generateChoices(scenario: typeof CONFLICT_SCENARIOS[0], emotion: number): Choice[] {
  const goodText = scenario.choices.good[randomInt(0, scenario.choices.good.length - 1)];
  const neutralText = scenario.choices.neutral[randomInt(0, scenario.choices.neutral.length - 1)];
  const badText = scenario.choices.bad[randomInt(0, scenario.choices.bad.length - 1)];
  
  const [goodMin, goodMax] = QUALITY_EMOTION_MAP.good;
  const [neutralMin, neutralMax] = QUALITY_EMOTION_MAP.neutral;
  const [badMin, badMax] = QUALITY_EMOTION_MAP.bad;
  
  const choices: Choice[] = [
    { id: 'choice-0', text: goodText, emotionDelta: randomInt(goodMin, goodMax) },
    { id: 'choice-1', text: neutralText, emotionDelta: randomInt(neutralMin, neutralMax) },
    { id: 'choice-2', text: badText, emotionDelta: randomInt(badMin, badMax) },
  ];
  
  return choices.sort(() => Math.random() - 0.5);
}

export function generateGameStart(): {
  conflictReason: string;
  firstMessage: string;
  choices: Choice[];
  emotion: number;
} {
  const scenario = CONFLICT_SCENARIOS[randomInt(0, CONFLICT_SCENARIOS.length - 1)];
  return {
    conflictReason: scenario.conflictReason,
    firstMessage: scenario.firstMessage,
    choices: generateChoices(scenario, INITIAL_EMOTION),
    emotion: INITIAL_EMOTION,
  };
}

export function generateGameContinue(
  conflictReason: string,
  emotion: number,
  round: number
): {
  reply: string;
  choices: Choice[];
} {
  const scenario = CONFLICT_SCENARIOS.find(s => s.conflictReason === conflictReason) || CONFLICT_SCENARIOS[0];
  
  const reply = getReplyByEmotion(scenario, emotion);
  const choices = generateChoices(scenario, emotion);
  
  return { reply, choices };
}

export function determineResult(emotion: number, round: number): { isGameOver: boolean; result: 'won' | 'lost' | 'cold_war' | null } {
  if (emotion >= EMOTION_WIN) {
    return { isGameOver: true, result: 'won' };
  }
  if (emotion <= EMOTION_LOSE) {
    return { isGameOver: true, result: 'lost' };
  }
  if (round >= MAX_ROUNDS) {
    return { isGameOver: true, result: 'cold_war' };
  }
  return { isGameOver: false, result: null };
}
