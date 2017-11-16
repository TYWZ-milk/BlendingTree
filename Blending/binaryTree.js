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
    if(binaryTree.root)
    var current = binaryTree.root;
    else
    var current = binaryTree.data;
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
    compact();
}
function compact(){ //紧凑化处理
    var current = blendingTree.root;
    var right;
    var x, y,z;
    while(current.rightNode.length != 0){

        if(current.rightNode != '0') {
            right = current.rightNode;
            x = current.data[0].pos.x - right[0].pos.x;
            y = current.data[0].pos.y - right[0].pos.y;
            z = current.data[0].pos.z - right[0].pos.z;

            for(var i=0;i<right.length;i++){
                right[i].pos.x += x;
                right[i].pos.y += y;
                right[i].pos.z += z;
            }
        }

        current = current.leftNode;
    }
}
function blending(){
    var point1 = binaryTree1.root;
    var point2 = binaryTree2.root;
    var partTree;
    var left = [];
    var right = [];
    var child1,child2;
    var temp;

    while(point1) {  //point1是拓扑结构第一层指针 child1是第二层
        left = [];
        right = [];

        for (var i = 0; i < point1.data.length || i < point2.data.length; i++) {   //第一层拓扑结构
            var cicle = {
                radius: (point1.data[i].radius + point2.data[i].radius) / 2,
                pos: point1.data[i].pos.add(point2.data[i].pos).divideScalar(2)
            };
            left.push(cicle);
        }

        if(point1.rightNode) {                    //第二层拓扑结构
            child1 = point1.rightNode;
            child2 = point2.rightNode;

            for (var i = 0; i < child1.data.length || i < child2.data.length; i++) {
                if (child2.data[0].branch == "0")
                    cicle = {
                        radius: (child1.data[i].radius) / 2,
                        pos: child1.data[i].pos.divideScalar(2)
                    };
                else if (child1.data[0].branch == "0")
                    cicle = {
                        radius: (child2.data[i].radius) / 2,
                        pos: child2.data[i].pos.divideScalar(2)
                    };
                else if(i < child1.data.length && i < child2.data.length)
                    cicle = {
                        radius: (child1.data[i].radius + child2.data[i].radius) / 2,
                        pos: child1.data[i].pos.add(child2.data[i].pos).divideScalar(2)
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

        temp = child1;          //第三层拓扑结构

        while(temp) {
            left = [];
            right = [];
            for (var i = 0; i < child1.length || i < child2.length; i++) {
                var cicle = {
                    radius: (child1.data[i].radius + child2.data[i].radius) / 2,
                    pos: child1.data[i].pos.add(child2.data[i].pos).divideScalar(2)
                };
                left.push(cicle);
            }

            for (var i = 0; i < child1.rightNode.data.length || i < child2.rightNode.data.length; i++) {
                if (child2.rightNode.data[0].branch == "0")
                    cicle = {
                        radius: (child1.rightNode.data[i].radius) / 2,
                        pos: child1.rightNode.data[i].pos.divideScalar(2)
                    };
                else if (child1.rightNode.data[0].branch == "0")
                    cicle = {
                        radius: (child2.rightNode.data[i].radius) / 2,
                        pos: child2.rightNode.data[i].pos.divideScalar(2)
                    };
                else if (i < child1.rightNode.data.length && i < child2.rightNode.data.length)
                    cicle = {
                        radius: (child1.rightNode.data[i].radius + child2.rightNode.data[i].radius) / 2,
                        pos: child1.rightNode.data[i].pos.add(child2.rightNode.data[i].pos).divideScalar(2)
                    };
                else break;
                right.push(cicle);
            }
            if (!partTree)
                partTree = new BST(left, right);
            else
                insertNode(left, right, partTree);

            temp = temp.leftNode;
        }
        child1.rightNode = partTree.root;

        left = right;
        right = [];
        partTree = null;
        if(child1.rightNode.rightNode){
            for (var i = 0; i < child1.rightNode.rightNode.data.length || i<child2.rightNode.rightNode.data.length; i++) {    //第四层拓扑结构
                if (child2.rightNode.rightNode.data[0].branch == "0")
                    cicle = {
                        radius: (child1.rightNode.rightNode.data[i].radius) /2,
                        pos: child1.rightNode.rightNode.data[i].pos.divideScalar(2)
                    };
                else if (child1.rightNode.rightNode.data[0].branch == "0")
                    cicle = {
                        radius: (child2.rightNode.rightNode.data[i].radius) / 2,
                        pos: child2.rightNode.rightNode.data[i].pos.divideScalar(2)
                    };
                else if(i<child1.rightNode.rightNode.data.length && i<child2.rightNode.rightNode.data.length)
                    cicle = {
                        radius: (child1.rightNode.rightNode.data[i].radius + child2.rightNode.rightNode.data[i].radius) / 2,
                        pos: child1.rightNode.rightNode.data[i].pos.add(child2.rightNode.rightNode.data[i].pos).divideScalar(2)
                    };
                else break;
                right.push(cicle);
            }
        }
        if(!partTree)
            partTree = new BST(left,right);
        else
            insertNode(left,right,partTree);
        child1.rightNode.rightNode = partTree.root;


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
    while(current) {//前两层拓扑结构构造
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

    current = tree.root.children[0].children[0];   //三四层拓扑结构构建
    while(current.right)current = current.right;  //current为层次结构中第三层的指针
    parent = binaryTree.root;                       //parent为拓扑结构中的根节点的右节点
    i=0;
    var temp = parent;
    var partTree;
    while(parent.leftNode) {
        temp = parent;
        parent = parent.rightNode;
        partTree = null;
        i = 0; position = 0;

        while ((current != null && current.branch != '0' && current.parent.branch[0].position == parent.branch[0].position) || (current != null && current.branch == '0' && current.parent.zeroSeq == parent.zeroSeq )) {
            left = [];

            if(current.branch != '0') {
                position = parseInt(current.branch[0].position);
                if (i > position) {
                    for (; i > position; position++)
                        left.push(parent.branch[i]);
                }
                /*else if (i == position) {
                    left.push(parent.branch[i]);
                }*/
                else
                    for (i; i < position; i++)
                        left.push(parent.branch[i]);
            }
            else if(parent.branch == '0' && current.branch != '0'){
                left.push(parent);
            }
            else{
                left.push(current);
            }
            if(current.children.length > 0){
                current.rightNode = current.children[0];
            }
            if(!partTree)
                partTree = new BST(left,current);
            else
                insertNode(left,current,partTree);

            current = current.left;
        }
        if( position < parent.branch.length) {   //拓扑结构最底层无右节点
            left=[];
            if(parent.branch != '0') {
                for (var j = position; j < parent.branch.length; j++) {
                    left.push(parent.branch[j]);
                }
            }
            else {
                left.push(parent);
            }
            insertNode(left,null,partTree);
        }

        parent = temp;
        parent.rightNode = partTree.root;
        parent = parent.leftNode;
    }

    if(number ==1 )binaryTree1 = binaryTree;
    else
        binaryTree2=binaryTree;
}