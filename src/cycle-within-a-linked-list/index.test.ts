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

describe("Without a cycle", () => {
  test("It reports back there is no cycle", () => {
    const person_1 = new LinkedListNode("sal");
    const person_2 = new LinkedListNode("andrew");
    const person_3 = new LinkedListNode("richard");

    person_1.next = person_2;
    person_2.next = person_3;

    expect(getContainsCycle(person_1)).toBe(false);
  });
});

describe("With a cycle", () => {
  test("It reports back that there is a cycle", () => {
    const person_1 = new LinkedListNode("sal");
    const person_2 = new LinkedListNode("andrew");

    person_1.next = person_2;
    person_2.next = person_1;

    expect(getContainsCycle(person_1)).toBe(true);
  });
});
