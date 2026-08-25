export const GAME_CONTENT = {
  prologue: [
    {
      speaker: "甜蜜的邀請函",
      text: "今晚有四個小遊戲：連連看、翻牌、佈置會場，最後再一起完成告白。",
    },
    {
      speaker: "Bryan",
      text: "不是考試，是陪我們重走一遍戀愛。連錯了也沒關係，再試就好。",
    },
    {
      speaker: "Agnes",
      text: "準備好了嗎？第一關，先把我們第一次約會的路線連起來。",
    },
  ],
  levels: {
    1: {
      chapter: "01",
      title: "第一次心動",
      subtitle: "先配對回憶，再按順序走完那天的約會路線。",
      scene: "/game/central-night.png",
      dialogues: [
        { speaker: "Bryan", text: "那天我們沿著海旁走，後來抬頭看見鐘樓，再一起看對岸燈火。" },
        { speaker: "Agnes", text: "最後當然要吃甜品。你先把風景配起來，再幫我們走一次路線。" },
      ],
      pairs: [
        { id: "walk", left: "沿著海旁吹風", right: "尖沙咀海旁" },
        { id: "clock", left: "抬頭看見鐘樓", right: "歷史鐘樓" },
        { id: "lights", left: "對岸燈火很亮", right: "維港夜景" },
        { id: "dessert", left: "約會最後的甜", right: "海旁甜品店" },
      ],
      route: [
        { id: "walk", label: "海旁散步", step: 1 },
        { id: "clock", label: "看見鐘樓", step: 2 },
        { id: "lights", label: "看對岸燈火", step: 3 },
        { id: "dessert", label: "一起吃甜品", step: 4 },
        { id: "tram", label: "坐叮叮車", decoy: true },
      ],
      hints: [
        "左邊是那天做過的事，右邊是對應的風景，四組都要配對。",
        "路線順序：散步 → 鐘樓 → 燈火 → 甜品。叮叮車不是那天的行程。",
      ],
    },
    2: {
      chapter: "02",
      title: "翻開好日子",
      subtitle: "先翻牌配對四組回憶，再按正確順序點出婚宴日期。",
      dialogues: [
        { speaker: "Agnes", text: "先玩翻牌。配對成功後，日期碎片就會出現。" },
        { speaker: "Bryan", text: "那四個數字要依月份再到日期的順序點。想不起來就看提示。" },
      ],
      cards: [
        { id: "c1", pair: "ring", label: "求婚戒指", icon: "ring" },
        { id: "c2", pair: "ring", label: "單膝跪下", icon: "ring" },
        { id: "c3", pair: "harbour", label: "維港夜景", icon: "harbour" },
        { id: "c4", pair: "harbour", label: "第一次約會", icon: "harbour" },
        { id: "c5", pair: "cake", label: "甜品約會", icon: "cake" },
        { id: "c6", pair: "cake", label: "分享一口", icon: "cake" },
        { id: "c7", pair: "letter", label: "手寫情書", icon: "letter" },
        { id: "c8", pair: "letter", label: "沒說完的話", icon: "letter" },
      ],
      digits: [
        { id: "d1", value: "1" },
        { id: "d2", value: "2" },
        { id: "d3", value: "0" },
        { id: "d4", value: "6" },
      ],
      hints: [
        "四組牌分別是：戒指與求婚、維港與初遇、甜品、情書。",
        "數字要點成月份再日期：十二月是 1 與 2，六日是 0 與 6。",
      ],
    },
    3: {
      chapter: "03",
      title: "婚禮大作戰",
      subtitle: "把對的東西放到會場位置，兩件多餘的不要放進去。",
      scene: "/game/garden-bright.png",
      dialogues: [
        { speaker: "旁白", text: "黃昏花園要辦婚禮了。你是今晚的神秘籌備員。" },
        { speaker: "Agnes", text: "先點物品，再點會場格子。雨傘和行李箱是多餘的喔。" },
      ],
      slots: [
        { id: "cake", label: "甜點桌" },
        { id: "flowers", label: "花拱門" },
        { id: "rings", label: "誓詞台" },
        { id: "chairs", label: "賓客席" },
        { id: "champagne", label: "敬酒區" },
        { id: "photo", label: "迎賓區" },
      ],
      items: [
        { id: "cake", label: "婚禮蛋糕" },
        { id: "flowers", label: "鮮花拱門" },
        { id: "rings", label: "一對戒指" },
        { id: "chairs", label: "賓客座椅" },
        { id: "champagne", label: "香檳塔" },
        { id: "photo", label: "迎賓相框" },
        { id: "umbrella", label: "雨傘", decoy: true },
        { id: "luggage", label: "行李箱", decoy: true },
      ],
      hints: [
        "蛋糕放甜點桌，鮮花放花拱門，戒指放誓詞台。",
        "雨傘和行李箱不要放進會場。相片放迎賓區，香檳放敬酒區。",
      ],
    },
    4: {
      chapter: "04",
      title: "告白填詞",
      subtitle: "把正確的詞填進四句告白，再長按完成求婚。",
      dialogues: [
        { speaker: "Bryan", text: "句子缺了關鍵的詞。選對的字放進去，假的詞不要理它。" },
        { speaker: "Agnes", text: "填完四句之後，長按把這段告白說出口。" },
      ],
      lines: [
        { id: "meeting", before: "從", after: "的那天起", answer: "相遇" },
        { id: "light", before: "你讓平凡有了", after: "", answer: "光" },
        { id: "seasons", before: "往後每一個", after: "", answer: "四季" },
        { id: "together", before: "我都想與你", after: "", answer: "同行" },
      ],
      words: ["相遇", "光", "四季", "同行", "秘密", "星星", "維港", "永遠"],
      hints: [
        "第一句缺的是「相遇」，最後一句缺的是「同行」。",
        "四個正確的詞：相遇、光、四季、同行。",
      ],
    },
  },
};

export const ENDINGS = {
  eternal: {
    title: "星海永恆",
    subtitle: "四個小遊戲你都玩得很開心，也把故事記在心上。",
    quote: "當萬家燈火倒映在海面，我仍會在第一眼認出你。",
  },
  starlight: {
    title: "星光相隨",
    subtitle: "就算連錯過幾次，最後還是走到同一段幸福。",
    quote: "愛不是從不迷失，而是每次都願意重新牽起彼此。",
  },
  promise: {
    title: "溫柔之約",
    subtitle: "最重要的答案只有一句：選擇彼此。",
    quote: "故事不必完美，只要最後一頁仍寫著我們的名字。",
  },
};

export const ACHIEVEMENT_COPY = {
  no_hints: { title: "一次就心動", detail: "不使用提示完成所有章節" },
  keen_eye: { title: "婚禮籌備員", detail: "把會場佈置完成" },
  vow_keeper: { title: "告白達人", detail: "填對四句告白" },
  first_clear: { title: "婚約見證人", detail: "完成四個戀愛小遊戲" },
};
