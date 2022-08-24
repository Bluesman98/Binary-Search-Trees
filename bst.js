class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(array, root) {
    this.array = array.sort(function (a, b) {
      return a - b;
    });
    this.root = this.buildTree(array);
  }
  buildTree(array) {
    if (array.length) {
      let start = 0;
      let end = array.length - 1;
      let mid = Math.floor((start + end) / 2);
      let left = this.buildTree(array.slice(start, mid));
      let right = this.buildTree(array.slice(mid + 1, end + 1));
      return new Node(array[mid], left, right);
    }
    return null;
  }

  insert(data, node = this.root) {
    if (data < node.data) {
      if (node.left == null) {
        node.left = new Node(data);
        return 0;
      }
      return this.insert(data, node.left);
    } else {
      if (node.right == null) {
        node.right = new Node(data);
        return 0;
      }
      this.insert(data, node.right);
    }
  }

  delete(data, root = this.root) {
    let node = this.find(data, root);
    console.log(node);
    let parent = this.parentNode(data, root);

    if (node == null) return null;
    else if ((node.left == null) & (node.right == null)) {
      if (parent.left != null && parent.left.data == data) {
        parent.left = null;
      } else if (parent.right != null && parent.right.data == data) {
        parent.right = null;
      }
      return 0;
    } else if (node.left == null || node.right == null) {
      let child = node.left == null ? node.right : node.left;
      console.log(child);
      if (parent.left != null && parent.left.data == data) {
        parent.left = child;
      } else if (parent.right != null && parent.right.data == data) {
        parent.right = child;
      }
      return 0;
    } else {
      let succesor = this.getSuccesor(data);
      let temp = succesor.data;
      this.delete(succesor.data, node);
      node.data = temp;
    }
  }

  find(data, node = this.root) {
    if (node != null) {
      if (data === node.data) return node;
      else if (data < node.data) return this.find(data, node.left);
      else return this.find(data, node.right);
    } else return null;
  }

  levelOrder(
    root = this.root,
    func = (a) => {
      return a;
    }
  ) {
    let stack = [root];
    let data_array = [];
    while (stack.length) {
      if (stack[0] != null) {
        data_array.push(func(stack[0].data));
        stack.push(stack[0].left);
        stack.push(stack[0].right);
      }
      stack.shift();
    }
    return data_array;
  }

  inorder(root = this.root, data_array = []) {
    if (root == null) return null;

    this.inorder(root.left, data_array);
    data_array.push(root.data);
    this.inorder(root.right, data_array);
    return data_array;
  }

  preorder(root = this.root, data_array = []) {
    if (root == null) return null;

    data_array.push(root.data);
    this.preorder(root.left, data_array);
    this.preorder(root.right, data_array);
    return data_array;
  }

  postorder(root = this.root, data_array = []) {
    if (root == null) return null;

    this.postorder(root.left, data_array);
    this.postorder(root.right, data_array);
    data_array.push(root.data);
    return data_array;
  }

  height(root = this.root) {
    let height_left = 0;
    let height_right = 0;

    if (root.left) {
      height_left++;
      height_left += this.height(root.left);
    }

    if (root.right) {
      height_right++;
      height_right += this.height(root.right);
    }
    return height_left > height_right ? height_left : height_right;
  }

  depth(data, node = this.root, depth = -1) {
    if (node != null) {
      depth++;
      if (data === node.data) return depth;
      else if (data < node.data) return this.depth(data, node.left, depth);
      else return this.depth(data, node.right, depth);
    } else return null;
  }

  getSuccesor(data, root = this.root) {
    let current = this.find(data, root);
    if (current == null) return null;
    else if (current.right) {
      return this.min(current.right);
    } else {
      let succesor = null;
      let ancestor = root;
      while (ancestor != current) {
        if (current.data < ancestor.data) {
          succesor = ancestor;
          ancestor = ancestor.left;
        } else ancestor = ancestor.right;
      }
      return succesor;
    }
  }

  isBalanced(root = this.root) {
    if (root == null) return true;

    let left_height = 0;
    if (root.left) left_height = this.height(root.left);
    let right_height = 0;
    if (root.right) right_height = this.height(root.right);

    if (
      Math.abs(left_height - right_height) <= 1 &&
      this.isBalanced(root.left) &&
      this.isBalanced(root.right)
    ) {
      return true;
    }

    return false;
  }

  rebalance() {
    let data_array = this.inorder();
    this.root = this.buildTree(data_array);
  }

  min(root = this.root) {
    if (root == null) return null;
    while (root.left) {
      root = root.left;
    }
    return root;
  }

  parentNode(data, root = this.root) {
    if (this.find(data) == null) return null;
    if (data == root.data) return null;
    while (true) {
      if (root.left != null && root.left.data == data) {
        return root;
      }

      if (root.right != null && root.right.data == data) {
        return root;
      }

      if (data < root.data) {
        root = root.left;
      } else root = root.right;
    }
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
