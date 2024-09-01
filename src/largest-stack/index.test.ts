import { MaxStack } from ".";

describe("No pushes", () => {
  const s = new MaxStack();

  test("Max is the current value", () => {
    expect(s.getMax()).toBeNull();
  });
});

describe("One push", () => {
  const s = new MaxStack();
  s.push(5);

  test("Max is the current value", () => {
    expect(s.getMax()).toBe(5);
  });
});

describe("Multiple pushes", () => {
  const s = new MaxStack();
  s.push(5);

  s.push(4);
  s.push(7);
  s.push(7);
  s.push(8);

  test("check before 1st pop", () => {
    expect(s.getMax()).toBe(8);
  });
  test("check pop #1", () => {
    expect(s.pop()).toBe(8);
  });
  test("check max after 1st pop", () => {
    expect(s.getMax()).toBe(7);
  });
  test("check pop #2", () => {
    expect(s.pop()).toBe(7);
  });
  test("check max after 2nd pop", () => {
    expect(s.getMax()).toBe(7);
  });
  test("check pop #3", () => {
    expect(s.pop()).toBe(7);
  });
  test("check max after 3rd pop", () => {
    expect(s.getMax()).toBe(5);
  });
  test("check pop #4", () => {
    expect(s.pop()).toBe(4);
  });
  test("check max after 4th pop", () => {
    expect(s.getMax()).toBe(5);
  });
});
