import { reverseWords } from ".";

test("Empty string", () => {
  expect(reverseWords("")).toEqual("");
});

test("One word", () => {
  expect(reverseWords("hello")).toEqual("hello");
});

test("Two words", () => {
  expect(reverseWords("thief cake")).toEqual("cake thief");
});

describe("Multiple words", () => {
  test("Each of the same length", () => {
    expect(reverseWords("rat the ate cat the")).toEqual("the cat ate the rat");
  });

  test("Of varying lengths", () => {
    expect(reverseWords("yummy is cake bundt chocolate")).toEqual(
      "chocolate bundt cake is yummy",
    );
  });
});
