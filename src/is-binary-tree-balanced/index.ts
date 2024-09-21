export class BinaryTreeNode {
  value: number;
  leftNode: BinaryTreeNode | null;
  rightNode: BinaryTreeNode | null;

  constructor(num: number) {
    this.value = num;
    this.leftNode = null;
    this.rightNode = null;
  }

  insertLeft(num: number) {
    // TODO: implement
    return new BinaryTreeNode(num);
  }

  insertRight(num: number) {
    // TODO: implement
    return new BinaryTreeNode(num);
  }
}

export function getIsBalanced(node: BinaryTreeNode) {
  return node;
}
