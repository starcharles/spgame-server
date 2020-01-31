import {CardRank, CardType, default as Card} from "../src/models/card";
import {default as SpellCard, SpellType, TargetType} from "../src/models/spellCard";

const cards = {
  spell: [
    {
      name: "rob",
      nameJa: "強奪",
      cardNo: 1021,
      rank: CardRank.B,
      cardType: CardType.Spell,
      limit: 100,
      content: "他プレイヤー１名の持ちカードをどれでも好きに１枚奪う。",
    }, {
      name: "defensiveWall",
      nameJa: "防壁",
      cardNo: 1003,
      rank: CardRank.D,
      cardType: CardType.Spell,
      limit: 100,
      content: "他プレイヤーからの攻撃呪文を１度だけ防ぐ。",
    }, {
      name: "reflection",
      nameJa: "反射",
      cardNo: 1004,
      rank: CardRank.E,
      cardType: CardType.Spell,
      limit: 120,
      content: "他のプレイヤーからの攻撃呪文をはね返し、効果を相手プレイヤーに返す。",
    }, {
      name: "pickPocket",
      nameJa: "掏摸(ピックポケット)",
      cardNo: 1006,
      rank: CardRank.F,
      cardType: CardType.Spell,
      limit: 170,
      content: "他プレイヤー１名のフリーポケットのカードをランダムに一枚奪う。",
    }, {
      name: "levy",
      nameJa: "徴収(レヴィ)",
      cardNo: 1018,
      rank: CardRank.B,
      cardType: CardType.Spell,
      limit: 25,
      content: "呪文を使用したプレイヤーの半径20m以内にいるプレイヤー全員から１枚ランダムにカードを奪う。",
    },
  ],
  normal: [
    {
      name: "stone",
      nameJa: "石ころ",
      rank: CardRank.Z,
      cardNo: 1500,
      cardType: CardType.Item,
      limit: null,
      content: "そこらへんにある石ころ",
    },
    {
      name: "garbage",
      nameJa: "ゴミクズ",
      rank: CardRank.Z,
      cardNo: 1501,
      cardType: CardType.Item,
      limit: null,
      content: "ゴミクズ",
    },
  ],
  special: [
    {
      name: "Hitotsubo no mitsurin",
      nameJa: "一坪の密林",
      rank: CardRank.SS,
      cardNo: 1,
      cardType: CardType.Item,
      limit: 3,
      content: "「山神の庭」と呼ばれる巨大な森への入り口.この森にしかいない固有種のみが数多く生息する。どの動物も人によくなつく。",
    },
    {
      name: "hitotsubo no kaigansen",
      nameJa: "一坪の海岸線",
      rank: CardRank.SS,
      cardNo: 2,
      cardType: CardType.Item,
      limit: 5,
      content: "「海神の棲み家」と呼ばれる海底洞窟への入り口。この洞窟は入る度に中の姿を変え侵入者を迷わせる。",
    },
    {
      name: "daitenshi",
      nameJa: "大天使の息吹",
      rank: CardRank.SS,
      cardNo: 3,
      cardType: CardType.Item,
      limit: 5,
      content: "瀕死の重症、不治の病　なんでも一息で治してくれる天使。ただし姿を現してくれるのはたった１度だけ。",
    },
    {
      name: "risky dice",
      nameJa: "リスキーダイス",
      rank: CardRank.B,
      cardNo: 4,
      cardType: CardType.Item,
      limit: 5,
      content: "20面体のサイコロ。１面が大凶で19面が大吉。大吉が出ればとてもいい事が起きる. ただし大凶が出るとそれまでに出た大吉分がチャラになるほどの不幸が起こる。",
    },
    {
      name: "seikishi no kubikazari",
      nameJa: "聖騎士の首飾り",
      rank: CardRank.D,
      cardNo: 5,
      cardType: CardType.Item,
      limit: 5,
      content: "これを身につけたプレイヤーは呪いをはね返すことができる上、触れたカードの呪いも解くことができる。",
    },
  ],
};

const spellCards = [
  {
    cardNo: 1021,
    spellType: SpellType.Attack,
    targetType: TargetType.Short,
    isInteractive: true,
    isMultipleTarget: false,
  },
  {
    cardNo: 1003,
    spellType: SpellType.Defense,
    targetType: TargetType.Short,
    isInteractive: false,
    isMultipleTarget: false,
  },
  {
    cardNo: 1004,
    spellType: SpellType.Defense,
    targetType: TargetType.Short,
    isInteractive: false,
    isMultipleTarget: false,
  }, {
    cardNo: 1006,
    spellType: SpellType.Attack,
    targetType: TargetType.Short,
    isInteractive: true,
    isMultipleTarget: false,
  }, {
    cardNo: 1018,
    spellType: SpellType.Attack,
    targetType: TargetType.Short,
    isInteractive: false,
    isMultipleTarget: true,
  },
];

export {
  cards,
  spellCards,
};
