export const GAME_CONTENT = {
  prologue: [
    {
      speaker: "神秘的邀請函",
      text: "維港的星光散落成四段記憶。只有真正理解這段愛情的人，才能讓婚約再次完整。",
    },
    {
      speaker: "Bryan",
      text: "如果你拾起了這封信，請替我找回那些不能遺失的瞬間。",
    },
    {
      speaker: "Agnes",
      text: "答案不只藏在日期與地點裡，也藏在我們選擇彼此的理由之中。",
    },
  ],
  levels: {
    1: {
      chapter: "01",
      title: "霓虹下的初遇",
      subtitle: "維港的海風，把故事的第一頁留在尖沙咀岸邊。",
      scene: "/game/central-night.png",
      dialogues: [
        { speaker: "Bryan", text: "那晚海風很輕。她站在維港旁，身後是整片閃爍的城市天際線。" },
        { speaker: "Agnes", text: "鐘樓記住了時間，對岸的燈火則替我們收藏了第一次心動。" },
        { speaker: "旁白", text: "沿著三道記憶線索，找出兩人第一次正式約會的座標。" },
      ],
      clues: ["海風吹過長長的步道", "鐘樓守著維港歲月", "對岸燈火映進海面"],
      choices: [
        { id: "tsim-sha-tsui", label: "尖沙咀海旁", detail: "海風與鐘樓" },
        { id: "central", label: "中環街角", detail: "電車與舊街" },
        { id: "tai-o", label: "大澳漁村", detail: "棚屋與潮汐" },
        { id: "sai-kung", label: "西貢碼頭", detail: "漁船與山影" },
      ],
      hints: ["留意哪個選項同時擁有海旁與鐘樓。", "答案在九龍一側，能隔著維港眺望香港島。"],
    },
    2: {
      chapter: "02",
      title: "星時計的密語",
      subtitle: "兩枚星環分別守護月份與日期，只有婚約之日能讓它們共鳴。",
      dialogues: [
        { speaker: "Agnes", text: "有些日子看似普通，卻因為一句「我願意」而成為永恆。" },
        { speaker: "Bryan", text: "左邊是月份，右邊是日期。讓星環停在我們宴會的那一天。" },
      ],
      hints: ["婚宴在冬季，月份是十二月。", "邀請函上的完整日期是 2026 年 12 月 6 日。"],
    },
    3: {
      chapter: "03",
      title: "月夜花園的遺失物",
      subtitle: "五件回憶信物散落在酒店花園，等待敏銳的目光喚醒。",
      scene: "/game/garden-hidden.png",
      dialogues: [
        { speaker: "旁白", text: "午夜鐘響之前，花園收藏了五件與承諾有關的物品。" },
        { speaker: "Agnes", text: "戒指、羽毛、珍珠髮簪、心形封蠟信與懷錶——請把它們一一找回。" },
      ],
      objects: [
        { id: "ring", label: "金色戒指", x: 23, y: 67, size: 11 },
        { id: "feather", label: "白色羽毛", x: 76, y: 67, size: 12 },
        { id: "hairpin", label: "珍珠髮簪", x: 56, y: 80, size: 12 },
        { id: "letter", label: "封蠟信", x: 66, y: 83, size: 14 },
        { id: "watch", label: "懷錶", x: 85, y: 79, size: 14 },
      ],
      hints: ["三件物品藏在右下方的薄紗附近。", "戒指在左側圓桌上；其餘信物大多在右下角。"],
    },
    4: {
      chapter: "04",
      title: "最後的誓言",
      subtitle: "將散落的句子放回正確位置，讓未完的心意抵達永恆。",
      dialogues: [
        { speaker: "Bryan", text: "誓言不是華麗的句子，而是願意把每個平凡日子都交給同一個人。" },
        { speaker: "Agnes", text: "從相遇開始，經過光與四季，最後抵達同行。" },
      ],
      phrases: [
        { id: "seasons", text: "往後每一個四季" },
        { id: "meeting", text: "從相遇的那天起" },
        { id: "together", text: "我都想與你同行" },
        { id: "light", text: "你讓平凡有了光" },
        { id: "harbour", text: "讓維港替我們保守秘密" },
        { id: "stars", text: "直到所有星星停止閃爍" },
      ],
      hints: ["第一句由「相遇」開始，最後一句落在「同行」。", "正確順序：相遇 → 光 → 四季 → 同行。"],
    },
  },
};

export const ENDINGS = {
  eternal: {
    title: "星海永恆",
    subtitle: "你讀懂了每一個未說出口的心意。",
    quote: "當萬家燈火倒映在海面，我仍會在第一眼認出你。",
  },
  starlight: {
    title: "星光相隨",
    subtitle: "即使偶爾迷路，兩顆心仍會走向同一個方向。",
    quote: "愛不是從不迷失，而是每次都願意重新牽起彼此。",
  },
  promise: {
    title: "溫柔之約",
    subtitle: "所有答案最終都指向同一件事：選擇彼此。",
    quote: "故事不必完美，只要最後一頁仍寫著我們的名字。",
  },
};

export const ACHIEVEMENT_COPY = {
  no_hints: { title: "命運解讀者", detail: "不使用提示完成所有章節" },
  keen_eye: { title: "月夜觀察家", detail: "找回花園中的全部信物" },
  vow_keeper: { title: "誓言守護者", detail: "成功重組最後的誓言" },
  first_clear: { title: "婚約見證人", detail: "完成四段戀愛記憶" },
};
