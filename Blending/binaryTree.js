/**
 * Created by deii66 on 2017/10/22.
 */
function BinaryNode(data,right) {
    this.data = data;
    this.leftNode = null;
    this.rightNode = right;
}
function BST(data,right) {
    var node = new BinaryNode(data,right);
    this.root = node;
}
function insertNode(data,right,binaryTree) {
    var node = new BinaryNode(data,right);
    var current = binaryTree.root;

    while(current) {
        if(!current.leftNode){
            current.leftNode = node;
            break;
        }
        else current=current.leftNode;
    }
}
var binaryTree1;
var binaryTree2;
function binaryTree(){
    createBinaryNode(1,tree1);
    createBinaryNode(2,tree2);
    blending();
}
function createBinaryNode(number,tree){
    var binaryTree;
    var current = tree.root.children[0];
    var parent = tree.root;
    var left=[];
    var i= 0,position = 0;

    while (current.right)current=current.right;
    while(current) {
        left=[];
        if(current.branch[0]!='0') {
            position = parseInt(current.branch[0].position);
            for (i; i < position; i++)
                left.push(parent.branch[i]);
        }
        else{
            left.push(parent.branch[i]);
            i++;
        }
        if(!binaryTree)
            binaryTree = new BST(left,current);
        else
            insertNode(left,current,binaryTree);
        current = current.left;
    }
    if(position < parent.branch.length) {
        left=[];
        for (var j = position; j < parent.branch.length; j++) {
            left.push(parent.branch[j]);
        }
        insertNode(left,null,binaryTree);
    }
    if(number ==1 )binaryTree1 = binaryTree;
    else
        binaryTree2=binaryTree;
}