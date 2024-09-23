import { BinaryTreeNode, getIsBalancedRecursive } from ".";

let treeRoot;
let leftNode;
let rightNode;

test("Full tree", () => {
  treeRoot = new BinaryTreeNode(5);
  leftNode = treeRoot.insertLeft(8);
  leftNode.insertLeft(1);
  leftNode.insertRight(2);
  let rightNode = treeRoot.insertRight(6);
  rightNode.insertLeft(3);
  rightNode.insertRight(4);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});

test("Both leaves at the same depth", () => {
  treeRoot = new BinaryTreeNode(3);
  leftNode = treeRoot.insertLeft(4);
  leftNode.insertLeft(1);
  rightNode = treeRoot.insertRight(6);
  rightNode.insertRight(9);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});

test("leaf heights differ by one", () => {
  treeRoot = new BinaryTreeNode(6);
  leftNode = treeRoot.insertLeft(1);
  rightNode = treeRoot.insertRight(0);
  rightNode.insertRight(7);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});

test("leaf heights differ by two", () => {
  treeRoot = new BinaryTreeNode(6);
  leftNode = treeRoot.insertLeft(1);
  rightNode = treeRoot.insertRight(0);
  rightNode.insertRight(7).insertRight(8);
  expect(getIsBalancedRecursive(treeRoot)).toBe(false);
});

test("three leaves total", () => {
  treeRoot = new BinaryTreeNode(1);
  leftNode = treeRoot.insertLeft(5);
  rightNode = treeRoot.insertRight(9);
  rightNode.insertLeft(8);
  rightNode.insertRight(5);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});

test("both subtrees superbalanced", () => {
  treeRoot = new BinaryTreeNode(1);
  leftNode = treeRoot.insertLeft(5);
  rightNode = treeRoot.insertRight(9);
  rightNode.insertLeft(8).insertLeft(7);
  rightNode.insertRight(5);
  expect(getIsBalancedRecursive(treeRoot)).toBe(false);
});

test("both subtrees superbalanced two", () => {
  treeRoot = new BinaryTreeNode(1);
  leftNode = treeRoot.insertLeft(2);
  leftNode.insertLeft(3);
  leftNode.insertRight(7).insertRight(8);
  treeRoot.insertRight(4).insertRight(5).insertRight(6).insertRight(9);
  expect(getIsBalancedRecursive(treeRoot)).toBe(false);
});

test("three leaves at different levels", () => {
  treeRoot = new BinaryTreeNode(1);
  leftNode = treeRoot.insertLeft(2);
  let leftLeft = leftNode.insertLeft(3);
  leftNode.insertRight(4);
  leftLeft.insertLeft(5);
  leftLeft.insertRight(6);
  treeRoot.insertRight(7).insertRight(8).insertRight(9).insertRight(10);
  expect(getIsBalancedRecursive(treeRoot)).toBe(false);
});

test("only one node", () => {
  treeRoot = new BinaryTreeNode(1);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});

test("linked list tree", () => {
  treeRoot = new BinaryTreeNode(1);
  treeRoot.insertRight(2).insertRight(3).insertRight(4);
  expect(getIsBalancedRecursive(treeRoot)).toBe(true);
});
