export class LinkedListNode {
  value: unknown;
  next: LinkedListNode | null;

  constructor(value: unknown) {
    this.value = value;
    this.next = null;
  }
}

export function getContainsCycle(linked_list: LinkedListNode): boolean {
  const visited = new Set<LinkedListNode>();
  let current = linked_list;
  while (current.next) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = current.next;
  }
  return false;
}
