export class MaxStack<T = number> {
  stack: Stack<T>;
  maxesstack: Stack<T>;

  constructor() {
    this.stack = new Stack();
    this.maxesstack = new Stack();
  }

  push(item: T) {
    this.stack.push(item);
    const max = this.maxesstack.peek();
    if (!max || item >= max) {
      this.maxesstack.push(item);
    }
  }

  pop() {
    const item = this.stack.pop();
    if (item === this.maxesstack.peek()) {
      this.maxesstack.pop();
    }
    return item;
  }

  getMax() {
    return this.maxesstack.peek();
  }
}

class Stack<T = number> {
  items: Array<T>;

  constructor() {
    // Initialize an empty stack
    this.items = [];
  }

  // Push a new item onto the stack
  push(item: T) {
    this.items.push(item);
  }

  // Remove and return the last item
  pop() {
    // If the stack is empty, return null
    // (It would also be reasonable to throw an exception)
    if (!this.items.length) {
      return null;
    }
    return this.items.pop();
  }

  // Return the last item without removing it
  peek() {
    if (!this.items.length) {
      return null;
    }
    return this.items[this.items.length - 1];
  }
}
