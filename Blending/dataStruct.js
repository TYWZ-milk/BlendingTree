function Node(branch) {
    this.branch = branch;
    this.parent = null;
    this.right =null;
    this.left=null;
    this.children = [];
    this.zeroSeq = 0;
}
function Tree (data) {
    var node = new Node(data);
    this.root = node;
}
function insert(data,child,layer,tree) {
    var n = new Node(data);
    var current = tree.root;
    child=parseInt(child);
    var temp=child;
    var parent;
    var leftParent;
    while(current) {
        parent = current;
        if(layer-1==1) {
            if (parent.children[child] == null&&child==0) {
                parent.children[child] = n;
            }
            else if(child>0){
                while(temp!=0){
                    leftParent=parent;
                    parent=parent.right;
                    temp--;
                }
                if(parent.children[0]==null){
                    parent.children[0]=n;
                    leftParent=leftParent.children[0];
                    while(leftParent.right)leftParent=leftParent.right;
                    leftParent.right=n;
                    n.left=leftParent;
                }
                else{
                    current = parent.children[0];
                    while (current.right)current = current.right;
                    current.right = n;
                    n.left=current;
                }
            }
            else {
                current = parent.children[0];
                while (current.right)current = current.right;
                current.right = n;
                n.left=current;
            }
            current = n;
            current.parent = parent;
            break;
        }
        else{
            current=parent.children[0];
            layer--;
        }
    }
}