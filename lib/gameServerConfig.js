const vowOrder = ["meeting", "light", "seasons", "together"];
const hiddenObjects = ["ring", "feather", "hairpin", "letter", "watch"];

export function validateLevelAnswer(level, answer) {
  switch (Number(level)) {
    case 1:
      return answer === "tsim-sha-tsui";
    case 2:
      return answer === "1206";
    case 3:
      return (
        Array.isArray(answer) &&
        hiddenObjects.every((object) => answer.includes(object)) &&
        new Set(answer).size === hiddenObjects.length
      );
    case 4:
      return (
        Array.isArray(answer) &&
        answer.length === vowOrder.length &&
        answer.every((phrase, index) => phrase === vowOrder[index])
      );
    default:
      return false;
  }
}

export function getEnding({ hintsUsed = 0, attempts = 0 }) {
  const score = Math.max(0, 100 - hintsUsed * 8 - Math.max(0, attempts - 4) * 3);
  if (score >= 90) return { endingType: "eternal", score };
  if (score >= 65) return { endingType: "starlight", score };
  return { endingType: "promise", score };
}

export function getAchievements({ hintsUsed = 0, level }) {
  const achievements = ["first_clear", "keen_eye", "vow_keeper"];
  if (hintsUsed === 0) achievements.unshift("no_hints");
  return level >= 4 ? achievements : [];
}
