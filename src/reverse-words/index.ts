export function reverseWords(message: readonly string[]) {
  let mirrored = reverseCharacters(message, 0, message.length - 1);

  let currentWordStartIndex = 0;
  for (let i = 0; i < mirrored.length; i++) {
    const isEndOfWord = i === mirrored.length || mirrored[i] === " ";
    if (isEndOfWord) {
      mirrored = reverseCharacters(mirrored, currentWordStartIndex, i - 1);
      currentWordStartIndex = i + 1;
    }
  }

  return mirrored.join("");
}

function reverseCharacters(
  message: readonly string[],
  leftIndex: number,
  rightIndex: number,
) {
  const clone = [...message];

  while (leftIndex < rightIndex) {
    const temp = clone[leftIndex];
    clone[leftIndex] = clone[rightIndex];
    clone[rightIndex] = temp;
    leftIndex++;
    rightIndex--;
  }

  return clone;
}
