class TreeNode {
  private data: any;
  private children: TreeNode[];

  constructor(data: any) {
    this.data = data;

    this.children = [];
  }

  add(data) {
    this.children.push(new TreeNode(data));
  }

  remove(data) {
    this.children = this.children.filter((node) => node.data !== data);
  }
}

export class Tree {
  private root: TreeNode;

  constructor() {
    this.root = new TreeNode(null);
  }
}
