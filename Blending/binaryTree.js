/**
 * Created by deii66 on 2017/10/22.
 */
function BinaryNode(data,left,right) {
    this.data = data;
    this.left = left;
    this.right = right;
}
function BST(data) {
    var node = new BinaryNode(data,null,null);
    this.root = node;
}
function insertNode(data) {
    var n = new Node(data,null,null);
    if(this.root == null) {
        this.root = n;
    }else {
        var current = this.root;
        var parent;
        while(current) {
            parent = current;
            if(data <  current.data) {
                current = current.left;
                if(current == null) {
                    parent.left = n;
                    break;
                }
            }else {
                current = current.right;
                if(current == null) {
                    parent.right = n;
                    break;
                }
            }
        }
    }
}
var binaryTrees;
function binaryTree(){
    binaryTrees = new BST();

}