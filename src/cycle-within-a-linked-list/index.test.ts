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
