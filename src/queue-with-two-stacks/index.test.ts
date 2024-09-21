import { QueueTwoStacks } from ".";

let q: QueueTwoStacks;

beforeEach(() => {
  q = new QueueTwoStacks();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
});

describe("Values 1->2->3", () => {
  test("dequeue #1", () => {
    expect(q.dequeue()).toEqual(1);
  });

  test("dequeue #2", () => {
    q.dequeue();
    expect(q.dequeue()).toEqual(2);
  });

  describe("Now 1->2->3->4", () => {
    beforeEach(() => {
      q.enqueue(4);
    });

    test("dequeue #3", () => {
      q.dequeue();
      q.dequeue();
      expect(q.dequeue()).toEqual(3);
    });

    test("dequeue #4", () => {
      q.dequeue();
      q.dequeue();
      q.dequeue();
      expect(q.dequeue()).toEqual(4);
    });

    test("dequeue from empty queue", () => {
      q.dequeue();
      q.dequeue();
      q.dequeue();
      q.dequeue();
      expect(q.dequeue()).toBeUndefined();
    });
  });
});
