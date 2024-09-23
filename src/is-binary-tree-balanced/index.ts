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

export function getIsBalancedRecursive(node: BinaryTreeNode) {
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

export function getIsBalancedIterative(node: BinaryTreeNode) {
  if (!node) {
    return true;
  }

  const depths = new Set<number>();

  const pairsOfNodesAndDepths: Array<[BinaryTreeNode, number]> = [];
  pairsOfNodesAndDepths.push([node, 0]);

  while (pairsOfNodesAndDepths.length) {
    const pair = pairsOfNodesAndDepths.pop();
    if (!pair) return false;

    const [node, depth] = pair;

    if (!node.left && !node.right) {
      if (!depths.has(depth)) {
        depths.add(depth);

        if (depths.size > 2) {
          return false;
        }

        if (depths.size === 2) {
          const [depth_a, depth_b] = depths.values();
          if (Math.abs(depth_a - depth_b) > 1) {
            return false;
          }
        }
      }
    } else {
      if (node.left) {
        pairsOfNodesAndDepths.push([node.left, depth + 1]);
      }
      if (node.right) {
        pairsOfNodesAndDepths.push([node.right, depth + 1]);
      }
    }
  }

  return true;
}
