function Node(branch) {
    this.branch = branch;
    this.parent = null;
    this.left = null;
    this.right =null;
    this.children = [];  //先声明一维
}
function Tree (data) {
    var node = new Node(data);
    this.root = node;
}
function insert(data,child,layer) {
    var n = new Node(data);
    var current = tree1.root;
    var temp=child;
    var parent;
    while(current) {
        parent = current;
        if(layer-1==1) {
            while(child!=temp) {
                parent = parent.right;
                temp--;
            }
            parent.children[child].push(data);
            current=parent.children[child];
            current.parent=parent;
            if(child!=0)
                parent.children[child-1].right=current;
        }
        else{
            current=parent.children[0];
        }
    }
}