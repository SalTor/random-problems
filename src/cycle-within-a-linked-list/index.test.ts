/**
 * class LinkedListNode {
 *   constructor(value) {
 *     this.value = value;
 *     this.next = null;
 *   }
 * }
 *
 * // A line of people waiting for a movie
 * const person_sal     = new LinkedListNode("Sal");
 * const person_andrew  = new LinkedListNode("Andrew");
 * const person_richard = new LinkedListNode("Richard");
 *
 * -- without a cycle
 * person_sal.next = person_andrew;
 * person_andrew.next = person.richard;
 *
 * -- with a cycle
 *  person_sal.next = person_andrew;
 *  person_andrew.next = person_sal;
 */

import { getContainsCycle, LinkedListNode } from ".";

describe("It reports no cycle", () => {
  test("When there is none", () => {
    const person_1 = new LinkedListNode("sal");
    const person_2 = new LinkedListNode("andrew");
    const person_3 = new LinkedListNode("richard");

    person_1.next = person_2;
    person_2.next = person_3;

    expect(getContainsCycle(person_1)).toBe(false);
  });

  test("When a single element in the list (that doesn't link to itself)", () => {
    const list = valuesToList([1]);
    expect(getContainsCycle(list[0])).toBe(false);
  });
});

describe("Reports a cycle", () => {
  test("When it loops to beginning", () => {
    const list = valuesToList([1, 2, 3, 4]);
    list[3].next = list[0];
    expect(getContainsCycle(list[0])).toBe(true);
  });

  test("When it loops the middle", () => {
    const list = valuesToList([1, 2, 3, 4, 5]);
    list[4].next = list[2];
    expect(getContainsCycle(list[0])).toBe(true);
  });

  test("When two nodes cycle at the end", () => {
    const list = valuesToList([1, 2, 3, 4, 5]);
    list[4].next = list[3];
    expect(getContainsCycle(list[0])).toBe(true);
  });

  test("When only element links back to itself", () => {
    const list = valuesToList([1]);
    list[0].next = list[0];
    expect(getContainsCycle(list[0])).toBe(true);
  });
});

function valuesToList(values: Array<unknown>) {
  const nodes = [];
  for (let i = 0; i < values.length; i++) {
    const node = new LinkedListNode(values[i]);
    if (i > 0) {
      nodes[i - 1].next = node;
    }
    nodes.push(node);
  }
  return nodes;
}
