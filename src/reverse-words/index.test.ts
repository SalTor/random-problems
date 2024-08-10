import { reverseWords } from ".";

describe("Reverse words", () => {
  test.each([
    ["two words", "thief cake", "cake thief"],
    // ["three words", "one another get", "get another one"],
    // [
    //   "multiple words same length",
    //   "rat the ate cat the",
    //   "the cat ate the rat",
    // ],
    // [
    //   "multiple words different length",
    //   "yummy is cake bundt chocolate",
    //   "chocolate bundt cake is yummy",
    // ],
    // ["empty string", "", ""],
  ])("%s", (_, input, output) => {
    expect(reverseWords(input.split(""))).toEqual(output);
  });
});
