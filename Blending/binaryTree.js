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
var blendingTree;
function binaryTree(){
    createBinaryNode(1,tree1);
    createBinaryNode(2,tree2);
    blending();
}
function blending(){
    var point1 = binaryTree1.root;
    var point2 = binaryTree2.root;
    var left = [];
    var right = [];
    var child1,child2;

    while(point1) {
        left = [];
        right = [];


        var cicle = {
            radius: (point1.data[0].radius + point2.data[0].radius) / 2,
            pos: point1.data[0].pos.add(point2.data[0].pos).divideScalar(2)
        };
        left.push(cicle);

        if(point1.rightNode) {
            child1 = point1.rightNode;
            child2 = point2.rightNode;

            for (var i = 0; i < child1.branch.length || i<child2.branch.length; i++) {
                if (child2.branch == "0")
                    cicle = {
                        radius: (child1.branch[i].radius),
                        pos: child1.branch[i].pos
                    };
                else if (child1.branch == "0")
                    cicle = {
                        radius: (child2.branch[i].radius) / 2,
                        pos: child2.branch[i].pos.divideScalar(2)
                    };
                else if(i<child1.branch.length && i<child2.branch.length)
                    cicle = {
                        radius: (child1.branch[i].radius + child2.branch[i].radius) / 2,
                        pos: child1.branch[i].pos.add(child2.branch[i].pos).divideScalar(2)
                    };
                else break;
                right.push(cicle);
            }
        }
        if(!blendingTree){
            blendingTree = new BST(left,right);
        }
        else{
            insertNode(left,right,blendingTree);
        }
        point1 = point1.leftNode;
        point2 = point2.leftNode;
    }
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
            if(i>position){
                for (; i > position; position++)
                    left.push(parent.branch[i]);
            }
            else if(i==position){
                left.push(parent.branch[i]);
            }
            else
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
    if(position < parent.branch.length) {   //拓扑结构最底层无右节点
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