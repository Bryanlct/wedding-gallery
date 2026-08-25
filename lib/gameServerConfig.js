const firstDateRoute = ["walk", "clock", "lights", "dessert"];
const weddingDate = "1206";
const venueItems = ["cake", "flowers", "rings", "chairs", "champagne", "photo"];
const vowOrder = ["meeting", "light", "seasons", "together"];

function sameSequence(answer, expected) {
  return (
    Array.isArray(answer) &&
    answer.length === expected.length &&
    answer.every((value, index) => value === expected[index])
  );
}

export function validateLevelAnswer(level, answer) {
  switch (Number(level)) {
    case 1:
      return sameSequence(answer, firstDateRoute);
    case 2:
      return answer === weddingDate;
    case 3:
      return (
        Array.isArray(answer) &&
        venueItems.every((item) => answer.includes(item)) &&
        new Set(answer).size === venueItems.length
      );
    case 4:
      return sameSequence(answer, vowOrder);
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
