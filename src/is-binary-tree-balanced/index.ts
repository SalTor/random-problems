export class BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;

  constructor(num: number) {
    this.value = num;
    this.left = null;
    this.right = null;
  }

  insertLeft(num: number) {
    this.left = new BinaryTreeNode(num);
    return this.left;
  }

  insertRight(num: number) {
    this.right = new BinaryTreeNode(num);
    return this.right;
  }
}

export function getIsBalanced(node: BinaryTreeNode) {
  return node;
}
