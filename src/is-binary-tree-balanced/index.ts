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
  return recursiveSolution(node);
}

function recursiveSolution(node: BinaryTreeNode) {
  const leafs = getLeafs(node, 0, []);
  const min = Math.min(...leafs);
  const max = Math.max(...leafs);
  return Math.abs(max - min) <= 1;
}

function getLeafs(
  node: BinaryTreeNode,
  depth: number,
  leafs: Array<number>,
): Array<number> {
  if (node.left === null && node.right === null) {
    return [depth, ...leafs];
  }

  let left: Array<number> = leafs;
  if (node.left) {
    left = getLeafs(node.left, depth + 1, leafs);
  }
  let right: Array<number> = leafs;
  if (node.right) {
    right = getLeafs(node.right, depth + 1, leafs);
  }

  return [...left, ...right];
}
