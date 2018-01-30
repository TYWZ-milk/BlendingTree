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
    var child;
    var x, y,z;
    while(current!=null && current.rightNode.length != 0){
        if(current.rightNode != '0') {       //第二层紧凑化处理
            right = current.rightNode;
            x = current.data[0].pos.x - right.data[0].pos.x;
            y = current.data[0].pos.y - right.data[0].pos.y;
            z = current.data[0].pos.z - right.data[0].pos.z;

            for(var i=0;i<right.data.length;i++){
                right.data[i].pos.x += x;
                right.data[i].pos.y += y;
                right.data[i].pos.z += z;
            }
            child = current.rightNode.leftNode;
            while(child) {
            /*    x = right.data[right.data.length-1].pos.x - child.data[0].pos.x;
                y = right.data[right.data.length-1].pos.y - child.data[0].pos.y;
                z = right.data[right.data.length-1].pos.z - child.data[0].pos.z;*/
                for (var i = 0; i < child.data.length; i++) {
                    child.data[i].pos.x += x;
                    child.data[i].pos.y += y;
                    child.data[i].pos.z += z;
                }
               // right = child;
                child = child.leftNode;
            }
        }
        child = current.rightNode;  //三四层紧凑化处理
        while(child){

            if(child.rightNode != null && child.rightNode != '0') {
                right = child.rightNode;
                x = child.data[0].pos.x - right.data[0].pos.x;
                y = child.data[0].pos.y - right.data[0].pos.y;
                z = child.data[0].pos.z - right.data[0].pos.z;

                for(var i=0;i<right.data.length;i++){
                    right.data[i].pos.x += x;
                    right.data[i].pos.y += y;
                    right.data[i].pos.z += z;
                }
                if(child.rightNode.rightNode !=null && child.rightNode.rightNode.data.length>0 && child.rightNode.rightNode != '0') {
                    right = child.rightNode.rightNode;
                    x = child.rightNode.data[0].pos.x - right.data[0].pos.x;
                    y = child.rightNode.data[0].pos.y - right.data[0].pos.y;
                    z = child.rightNode.data[0].pos.z - right.data[0].pos.z;

                    for(var i=0;i<right.data.length;i++){
                        right.data[i].pos.x += x;
                        right.data[i].pos.y += y;
                        right.data[i].pos.z += z;
                    }
                }
            }

            child = child.leftNode;
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
    var temp1,temp2;
    var current;   // blendingTree的指针

    while(point1) {  //point1是拓扑结构第一层指针 child1是第二层
        left = [];
        right = [];
        var position = new THREE.Vector3(point1.data[0].pos.x+point2.data[0].pos.x,point1.data[0].pos.y+point2.data[0].pos.y,point1.data[0].pos.z+point2.data[0].pos.z);
        var cicle = {
            radius: (point1.data[0].radius + point2.data[0].radius) / 2,
            pos: position.divideScalar(2)
        };
        left.push(cicle);


        if(point1.rightNode) {                     //第二层拓扑结构
            child1 = point1.rightNode;
            child2 = point2.rightNode;

            for (var i = 0; i < child1.data.length || i < child2.data.length; i++) {
                if (child2.data[0].branch == "0") {
                    position = new THREE.Vector3(child1.data[i].pos.x,child1.data[i].pos.y,child1.data[i].pos.z);
                    cicle = {
                        radius: (child1.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else if (child1.data[0].branch == "0") {
                    position = new THREE.Vector3(child2.data[i].pos.x,child2.data[i].pos.y,child2.data[i].pos.z);
                    cicle = {
                        radius: (child2.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else if(i < child1.data.length && i < child2.data.length) {
                    position = new THREE.Vector3(child1.data[i].pos.x+child2.data[i].pos.x,child1.data[i].pos.y+child2.data[i].pos.y,child1.data[i].pos.z+child2.data[i].pos.z);
                    cicle = {
                        radius: (child1.data[i].radius + child2.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else break;
                right.push(cicle);
            }
        }
        if(!blendingTree){
            blendingTree = new BST(left,right);
            current = blendingTree.root;
        }
        else{
            insertNode(left,right,blendingTree);
            current = current.leftNode;
        }

        temp1 = child1;          //第三层拓扑结构
        temp2 = child2;
        partTree = null;

        while(temp1 && temp2) {
            left = [];
            right = [];

            for (var i = 0; i < temp1.data.length || i < temp2.data.length; i++) {
                if (temp2.data[0].branch == "0") {
                    position = new THREE.Vector3(temp1.data[i].pos.x,temp1.data[i].pos.y,temp1.data[i].pos.z);
                    cicle = {
                        radius: (temp1.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else if (temp1.data[0].branch  == "0"){
                    position = new THREE.Vector3(temp2.data[i].pos.x,temp2.data[i].pos.y,temp2.data[i].pos.z);
                    cicle = {
                        radius: (temp2.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else if (i < temp1.data.length && i < temp2.data.length) {
                    position = new THREE.Vector3(temp1.data[i].pos.x+temp2.data[i].pos.x,temp1.data[i].pos.y+temp2.data[i].pos.y,temp1.data[i].pos.z+temp2.data[i].pos.z);
                    cicle = {
                        radius: (temp1.data[i].radius + temp2.data[i].radius) / 2,
                        pos: position.divideScalar(2)
                    };
                }
                else break;
                left.push(cicle);
            }
            if(temp1.rightNode != null) {
                for (var i = 0; i < temp1.rightNode.branch.length || i < temp2.rightNode.branch.length; i++) {
                    if (temp2.rightNode.branch == "0") {
                        position = new THREE.Vector3(temp1.rightNode.branch[i].pos.x,temp1.rightNode.branch[i].pos.y,temp1.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp1.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else if (temp1.rightNode.branch == "0") {
                        position = new THREE.Vector3(temp2.rightNode.branch[i].pos.x,temp2.rightNode.branch[i].pos.y,temp2.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp2.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else if (i < temp1.rightNode.branch.length && i < temp2.rightNode.branch.length) {
                        position = new THREE.Vector3(temp1.rightNode.branch[i].pos.x+temp2.rightNode.branch[i].pos.x,temp1.rightNode.branch[i].pos.y+temp2.rightNode.branch[i].pos.y,temp1.rightNode.branch[i].pos.z+temp2.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp1.rightNode.branch[i].radius + temp2.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else break;
                    right.push(cicle);
                }
            }

            var add = [];
            if(temp1.rightNode != null && temp1.rightNode.rightNode != null){
                add = [];
                for (var i = 0; i < temp1.rightNode.rightNode.branch.length || i < temp2.rightNode.rightNode.branch.length; i++) {    //第四层拓扑结构
                    if (temp2.rightNode.rightNode != null && temp2.rightNode.rightNode.branch == "0") {
                        position = new THREE.Vector3(temp1.rightNode.rightNode.branch[i].pos.x,temp1.rightNode.rightNode.branch[i].pos.y,temp1.rightNode.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp1.rightNode.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else if (temp1.rightNode.rightNode != null && temp1.rightNode.rightNode.branch == "0") {
                        position = new THREE.Vector3(temp2.rightNode.rightNode.branch[i].pos.x,temp2.rightNode.rightNode.branch[i].pos.y,temp2.rightNode.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp2.rightNode.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else if (i < temp1.rightNode.rightNode.branch.length && i < temp2.rightNode.rightNode.branch.length) {
                        position = new THREE.Vector3(temp1.rightNode.rightNode.branch[i].pos.x+temp2.rightNode.rightNode.branch[i].pos.x,temp1.rightNode.rightNode.branch[i].pos.y+temp2.rightNode.rightNode.branch[i].pos.y,temp1.rightNode.rightNode.branch[i].pos.z+temp2.rightNode.rightNode.branch[i].pos.z);
                        cicle = {
                            radius: (temp1.rightNode.rightNode.branch[i].radius + temp2.rightNode.rightNode.branch[i].radius) / 2,
                            pos: position.divideScalar(2)
                        };
                    }
                    else break;
                    add.push(cicle);
                }

            }

            if (!partTree && temp1.rightNode == null) {
                var node = new BinaryNode(right,null);
                partTree = new BST(left, node);
            }
            else if (!partTree && temp1.rightNode != null) {
                var node = new BinaryNode(add,null);
                var addTree = new BST(right,node);
                partTree = new BST(left, addTree.root);
            }
            else if(partTree && temp1.rightNode == null)
                insertNode(left,null,partTree);
            else{
                var node = new BinaryNode(add,null);
                var addTree = new BST(right,node);
                insertNode(left,addTree.root,partTree);
            }

            temp1 = temp1.leftNode;
            temp2 = temp2.leftNode;
        }
        current.rightNode = partTree.root;


        point1 = point1.leftNode;
        point2 = point2.leftNode;
    }
}
function createBinaryNode(number,tree){         //两棵模型树木的拓扑结构
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
            else if(parent.branch != '0' && current.branch == '0'){
                left.push(parent.branch[0]);
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