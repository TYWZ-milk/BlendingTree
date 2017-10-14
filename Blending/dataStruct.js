function Node(branch) {
    this.branch = branch;
    this.parent = null;
    this.right =null;
    this.children = [];
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
    while(current) {
        parent = current;
        if(layer-1==1) {
            if (parent.children[child] == null&&child==0) {
                parent.children[child] = n;
            }
            else if(child>0){
                while(temp!=0){
                    parent=parent.right;
                    temp--;
                }
                if(parent.children[0]==null)
                    parent.children[0]=n;
                else{
                    current = parent.children[0];
                    while (current.right)current = current.right;
                    current.right = n;
                }
            }
            else {
                current = parent.children[0];
                while (current.right)current = current.right;
                current.right = n;
            }
            current = n;
            current.parent = parent;
            break;
        }
        else{
            current=parent.children[0];
            layer--;
        }
/*        if(layer-1==1) {
            while(child!=temp) {
                parent = parent.right;
                temp--;
            }
            if(parent.children[child]==null) {
                parent.children[child] = n;
            }
            else{
                current=parent.children[child];
                while(current.right)current=current.right;
                current.right=n;

            }
            current = n;
            current.parent = parent;
            if (child != 0)
                parent.children[child - 1].right = current;
            break;

        }
        else{
            if(child==0)
                current=parent.children[0];
            else

            layer--;
        }*/
    }
}

function find(tree,sequence,type){
    var current;
    if(tree.parent==null)
        current = tree.root;
    else
        current = tree;
    var parent = current;
    if(current.branch[0].sequence==sequence){
        if(type==1)
            trunk1=current.branch;
        if(type==2)
            trunk2=current.branch;
    }
    else{
        for(var i=0;i<parent.children.length;i++)
            find(parent.children[i],sequence,type);
    }
}