export class QueueTwoStacks {
  values: Array<number>;

  constructor() {
    this.values = [];
  }

  enqueue(num: number) {
    // TODO: Implement
    this.values = [num, ...this.values];
  }

  dequeue() {
    return this.values.pop();
  }
}
