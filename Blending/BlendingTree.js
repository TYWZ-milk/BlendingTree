var canvas,width,height,renderer,scene,camera,tracontrols,Orbitcontrols,rotcontrols,scacontrols;
var normalTree=[];
var branch;
var pos = 1;
//var lbbs;
function init() {
  //  lbbs = new LBBs();
    canvas = document.getElementById("canvas");
    width = window.innerWidth;
    height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer.setSize(width,height);
    renderer.setClearColor(0xaaaaaa,1.0);

    scene = new THREE.Scene();
    scene.frustumCulled = false;
    scene.matrixAutoUpdate = false;

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0,1,1).normalize();
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff,1);
    scene.add(light);


    camera = new THREE.PerspectiveCamera(45,width/height,1,10000);
    camera.position.y = 20;
    camera.position.z = 20;

    tracontrols = new THREE.TransformControls(camera,canvas);
    tracontrols.addEventListener( 'change', render );
    tracontrols.setMode("translate");
    scene.add(tracontrols);

    rotcontrols = new THREE.TransformControls(camera,canvas);
    rotcontrols.addEventListener( 'change', render );
    rotcontrols.setMode("rotate");
    scene.add(rotcontrols);

    scacontrols = new THREE.TransformControls(camera,canvas);
    scacontrols.addEventListener( 'change', render );
    scacontrols.setMode("scale");
    scene.add(scacontrols);
    Orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );

    initScene();
    initObject();
    initGUI();
    readFile();

    canvas.addEventListener("click",onclick);

    animate();
}
function initObject(){
    var loader = new THREE.OBJLoader();
    loader.load('../models/AL06a.obj', function(geometry) {
        geometry.traverse(function (child) {
            if(child instanceof THREE.Mesh){
                child.material.depthTest = false;
                child.material.map = THREE.ImageUtils.loadTexture('../textures/tree/timg.jpg');
                child.geometry.computeBoundingSphere();
            }
        });
        geometry.scale.set(100, 100, 100);
        geometry.translateX(500);
        normalTree.push(geometry);
        scene.add(geometry);
    });

    loader=new THREE.OBJLoader();
    loader.load('../models/BS07a.obj', function(geometry) {
        geometry.traverse(function (child) {
            if(child instanceof THREE.Mesh){
                child.material.depthTest = false;
                child.material.map = THREE.ImageUtils.loadTexture('../textures/tree/timg.jpg');
                child.geometry.computeBoundingSphere();
            }
        });
        geometry.scale.set(100, 100, 100);
        geometry.translateX(-500);
        normalTree.push(geometry);
        scene.add(geometry);
    });

}
var struct1=[];
var struct2=[];
var tree1=null;
var tree2=null;
function readFile(){
    var loaderTree1 = new THREE.FileLoader();
    var loaderTree2 = new THREE.FileLoader();
//load a text file a output the result to the console
    loaderTree1.load(
        // resource URL
        '../models/tree1.txt',

        // Function when resource is loaded
        function ( data ) {
            var sequence=0;
            var circle;
            var x="", y="",z="";
            var radius="";
            var temp=0;
            var branchlength="";
            var trunk=[];
            var child="";
            var position="";
            // output the text to the console
            for(var i=0;i<data.length;i++) {
                temp = 0;
                x="";
                y="";
                z="";
                radius="";
                if(data[i]=='L'){
                    var number=data[i+9].toString();
                    if(data[i+10]!='\r') {
                        number += data[i + 10].toString();
                        if (data[i + 11] != '\r') {
                            number += data[i + 11].toString();
                            i+=14;
                        }
                        else{
                            i+=13;
                        }
                    }
                    else{
                        i+=12;
                    }
                    struct1.push(number);
                }
                if(data[i+5]=='\r'||data[i+4]=='\r'||data[i+3]=='\r') {
                    branchlength='';
                    child='';
                    position='';
                    while (data[i] != ' ') {
                        child += data[i].toString();
                        i++;
                    }
                    i++;
                    while (data[i] != '\r'){
                        position += data[i].toString();
                        i++;
                    }
                    i+=2;
                    while (data[i] != '\r') {
                        branchlength += data[i].toString();
                        i++;
                    }
                    sequence++;
                    i += 2;
                }
                for(var j=i;data[j]!='\r'&&j<data.length;j++) {
                    if(data[j]!=' ') {
                        if(temp==0){
                            x+=data[j];
                        }
                        if(temp==1){
                            y+=data[j];
                        }
                        if(temp==2){
                            z+=data[j];
                        }
                        if(temp==3){
                            radius+=data[j];
                        }
                    }
                    else{
                        temp++;
                    }
                }
                i = j+1;
                if(branchlength!=0) {
                    circle = {
                        sequence: sequence,
                        radius: radius * 100,
                        position:position,
                        pos: new THREE.Vector3(x * 100, y * 100, z * 100)
                    };
                    trunk.push(circle);
                    branchlength--;
                    if(branchlength==0){
                        if(tree1==null)
                            tree1 = new Tree(trunk);
                        else{
                            insert(trunk,child,struct1.length,tree1);
                        }
                        trunk=[];
                    }
                }
            }
            createTree();
            binaryTree();
            drawTree();
        },

        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // Function called when download errors
        function ( xhr ) {
            console.error( 'An error happened' );
        }
    );

    loaderTree2.load(
        // resource URL
        '../models/tree2.txt',

        // Function when resource is loaded
        function ( data ) {
            var sequence=0;
            var circle;
            var x="", y="",z="";
            var radius="";
            var temp=0;
            var branchlength="";
            var trunk=[];
            var child="";
            var position="";
            // output the text to the console
            for(var i=0;i<data.length;i++) {
                temp = 0;
                x="";
                y="";
                z="";
                radius="";
                if(data[i]=='L'){
                    var number=data[i+9].toString();
                    if(data[i+10]!='\r') {
                        number += data[i + 10].toString();
                        if (data[i + 11] != '\r') {
                            number += data[i + 11].toString();
                            i+=14;
                        }
                        else{
                            i+=13;
                        }
                    }
                    else{
                        i+=12;
                    }
                    struct2.push(number);
                }
                if(data[i+5]=='\r'||data[i+4]=='\r'||data[i+3]=='\r') {
                    branchlength='';
                    child='';
                    position='';
                    while (data[i] != ' ') {
                        child += data[i].toString();
                        i++;
                    }
                    i++;
                    while (data[i] != '\r'){
                        position += data[i].toString();
                        i++;
                    }
                    i+=2;
                    while (data[i] != '\r') {
                        branchlength += data[i].toString();
                        i++;
                    }
                    sequence++;
                    i += 2;
                }
                for(var j=i;data[j]!='\r'&&j<data.length;j++) {
                    if(data[j]!=' ') {
                        if(temp==0){
                            x+=data[j];
                        }
                        if(temp==1){
                            y+=data[j];
                        }
                        if(temp==2){
                            z+=data[j];
                        }
                        if(temp==3){
                            radius+=data[j];
                        }
                    }
                    else{
                        temp++;
                    }
                }
                i = j+1;
                if(branchlength!=0) {
                    circle = {
                        sequence: sequence,
                        radius: radius * 100,
                        position:position,
                        pos: new THREE.Vector3(x * 100, y * 100, z * 100)
                    };
                    trunk.push(circle);
                    branchlength--;
                    if(branchlength==0){
                        if(tree2==null)
                            tree2 = new Tree(trunk);
                        else{
                            insert(trunk,child,struct2.length,tree2);
                        }
                        trunk=[];
                    }
                }
            }

        },

        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // Function called when download errors
        function ( xhr ) {
            console.error( 'An error happened' );
        }
    );
}

function addLayer(m,currentTree1,currentTree2){

    var layer = m;
    currentTree2 = currentTree2.root;
    currentTree1 = currentTree1.root;
    for(layer=layer-1;layer>0;layer--){
        currentTree2 = currentTree2.children[0];
        currentTree1 = currentTree1.children[0];
    }

    for(;currentTree2!=null;currentTree2=currentTree2.right,currentTree1=currentTree1.right){
        if(currentTree2.branch != '0'){
            if(currentTree1.children[0] == null){
                currentTree1.children[0] = new Node('0');
                currentTree1.children[0].zeroSeq = pos;
                pos++;
                currentTree1.children[0].parent = currentTree1;
                if(currentTree1.left != null) {
                    var leftParent = currentTree1.left;
                    while(leftParent.children[0] == null)
                        leftParent = leftParent.left;
                    leftParent = leftParent.children[0];
                    while (leftParent.right)leftParent = leftParent.right;
                    currentTree1.children[0].left = leftParent;
                    leftParent.right = currentTree1.children[0];
                }
            }
            var temp = currentTree2.children[0];

            while(temp.right != null && temp.right.parent == currentTree2){
                var current = currentTree1.children[0];
                while (current.right)current = current.right;
                var zero = new Node('0');
                zero.zeroSeq = pos;
                pos++;
                current.right = zero;
                zero.left=current;
                zero.parent=currentTree1;
                temp = temp.right;
            }
        }
    }
}

function addZero(m,currentTree1,currentTree2){
    var zeroNumber = parseInt(struct1[m])-parseInt(struct2[m]);
    var interval = parseInt(parseInt(struct1[m])/parseInt(struct2[m]));

    currentTree1 = tree1.root;
    currentTree2 = tree2.root;

    for(var layer=m;layer>0;layer--){
        currentTree2 = currentTree2.children[0];
        currentTree1 = currentTree1.children[0];
    }

    var parentNode1 = currentTree1.parent;
    var parentNode2 = currentTree2.parent;

    var i=1;
    var flag = false;

    for(; zeroNumber >0 ;currentTree1=currentTree1.right,currentTree2=currentTree2.right){
        flag=false;
        for(i;i%interval!=0 && zeroNumber>0;i++){
            var zero = new Node('0');
            zero.zeroSeq = pos;
            pos++;
            if(currentTree2.right!=null) {
                var temp = currentTree2.right;
                currentTree2.right = zero;
                zero.left = currentTree2;
                zero.right = temp;
                temp.left = zero;
                if(currentTree1.parent == parentNode1)
                    zero.parent = currentTree2.parent;
                else{
                    parentNode1 = parentNode1.right;
                    parentNode2 = parentNode2.right;
                    zero.parent = parentNode2;
                }
                zeroNumber--;
                flag = true;
            }
            else{
                currentTree2.right = zero;
                zero.left = currentTree2;
                zero.parent = currentTree2.parent;
                zeroNumber--;
                flag = true;
            }
        }
        if(flag==false) {
            i++;
            if(currentTree2.right==null)
                currentTree2 = currentTree2.left;
        }
        if(currentTree1 ==null) break;
    }
}
function add2Zero(m,currentTree1,currentTree2) {
    var zeroNumber = parseInt(struct1[m]) - parseInt(struct2[m]);

    currentTree1 = tree1.root;
    currentTree2 = tree2.root;

    for (var layer = m; layer > 0; layer--) {
        currentTree2 = currentTree2.children[0];
        currentTree1 = currentTree1.children[0];
    }

    var parentNode1 = currentTree1.parent;
    var parentNode2 = currentTree2.parent;
    var changeParent = false;

    for (; zeroNumber > 0 && currentTree1.right != null; currentTree1 = currentTree1.right, currentTree2 = currentTree2.right) {

        if ( currentTree1.right.parent != currentTree1.parent) {
            parentNode1 = parentNode1.right;
            parentNode2 = parentNode2.right;
            changeParent = true;
        }

            if ((currentTree2.right == null ) ||(currentTree2.right.parent != currentTree2.parent && currentTree1.right.parent == currentTree1.parent) ||  parentNode2.branch == '0') {

                var zero = new Node('0');
                zero.zeroSeq = pos;
                pos++;
                if (currentTree2.right != null) {
                    var temp = currentTree2.right;

                    currentTree2.right = zero;
                    zero.left = currentTree2;
                    zero.right = temp;
                    temp.left = zero;
                    zero.parent = parentNode2;
                }
                else {
                    currentTree2.right = zero;
                    zero.left = currentTree2;
                    zero.parent = parentNode2;

                }
                if(changeParent == true && parentNode2.branch == '0'){
                    parentNode2.children[0] = zero;
                    changeParent = false;
                }
                zeroNumber--;
            }
        }
}
function createTree(){
    for(var m=0;m<struct1.length||m<struct2.length;m++) {
        if(m>=struct1.length){
            addLayer(m,tree1,tree2);
        }
        else if(m>=struct2.length){
            addLayer(m,tree2,tree1);
        }
        else if(m==1 && m<struct1.length && m<struct2.length && parseInt(struct1[m])!=parseInt(struct2[m])){
            if(parseInt(struct1[m])>parseInt(struct2[m])){
                addZero(m,tree1,tree2);
            }
            else{
                addZero(m,tree2,tree1);
            }
        }
        else if(m==2 && m<struct1.length && m<struct2.length && parseInt(struct1[m])!=parseInt(struct2[m])){
            if(parseInt(struct1[m])>parseInt(struct2[m])){
                add2Zero(m,tree1,tree2);
            }
            else{
                add2Zero(m,tree2,tree1);
            }
        }
    }
}
function drawTree(){
    var trunk = [];
    var childtrunk = [];
    var current = blendingTree.root;
    while(current){  //画主枝干
        trunk.push(current.data[0]);
        current = current.leftNode;
    }
    drawBranch(trunk);
    scene.add(branch);

    current = blendingTree.root;

    while(current.rightNode){//画子枝干
        var child = current.rightNode;
        trunk = [];
        while(child) {
            childtrunk = [];
            if(child.rightNode){
                for (var i = 0; i < child.rightNode.data.length; i++)
                    childtrunk.push(child.rightNode.data[i]);
                drawBranch(childtrunk);
                scene.add(branch);
            }

            childtrunk = [];
            if(child.rightNode != null && child.rightNode.rightNode != null && child.rightNode.rightNode.data.length>0){
                for (var i = 0; i < child.rightNode.rightNode.data.length; i++)
                    childtrunk.push(child.rightNode.rightNode.data[i]);
                drawBranch(childtrunk);
                scene.add(branch);
            }

            for (var i = 0; i < child.data.length; i++)
                trunk.push(child.data[i]);
            child = child.leftNode;
        }
        drawBranch(trunk);
        scene.add(branch);
        current = current.leftNode;
    }
}
function drawBranch(trunk) {
    var seg = 30;
    var geo = new THREE.Geometry();
    for(var i = 0, l = trunk.length; i < l; i ++){
        var circle = trunk[i];
        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            var posx=0,posy=0,posz=0;
            if(i>0) {
                posx = Math.abs(trunk[i].pos.x - trunk[i - 1].pos.x);
                posy = Math.abs(trunk[i].pos.y - trunk[i - 1].pos.y);
                posz = Math.abs(trunk[i].pos.z - trunk[i - 1].pos.z);
            }
            if(i==0){
                posx = Math.abs(trunk[i+1].pos.x - trunk[i].pos.x);
                posy = Math.abs(trunk[i+1].pos.y - trunk[i].pos.y);
                posz = Math.abs(trunk[i+1].pos.z - trunk[i].pos.z);
            }
            if(posx>=posy&&posx>=posz) {
                pos.x = 0;
                pos.y = rd * Math.sin(2 * Math.PI / seg * s);
                pos.z = rd * Math.cos(2 * Math.PI / seg * s);
            }
            if(posz>=posx&&posz>=posy){
                pos.x = rd * Math.sin(2 * Math.PI / seg * s);
                pos.y = rd * Math.cos(2 * Math.PI / seg * s);
                pos.z = 0;
            }
            if(posy>=posz&&posy>=posx) {
                pos.x = rd * Math.cos(2 * Math.PI / seg * s);
                pos.y = 0;
                pos.z = rd * Math.sin(2 * Math.PI / seg * s);
            }
            geo.vertices.push(pos.add(circle.pos));
        }
    }

    for(i=0;i<l-1;i++){
        for(s=0;s<seg;s++){
            var v1 = i*seg+s;
            var v2 = i*seg+(s+1)%seg;
            var v3 = (i+1)*seg+(s+1)%seg;
            var v4 = (i+1)*seg+s;

            geo.faces.push(new THREE.Face3(v1,v2,v3));
            geo.faceVertexUvs[0].push([new THREE.Vector2(s/seg,0),new THREE.Vector2((s+1)/seg,0),new THREE.Vector2((s+1)/seg,1)]);
            geo.faces.push(new THREE.Face3(v3,v4,v1));
            geo.faceVertexUvs[0].push([new THREE.Vector2((s+1)/seg,1),new THREE.Vector2((s)/seg,1),new THREE.Vector2((s)/seg,0)]);
        }
    }//add faces and uv
    geo.computeFaceNormals();
    branch = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({
        // wireframe:true,
        side:THREE.DoubleSide,
        map:THREE.ImageUtils.loadTexture("../textures/tree/timg.jpg")
    }));
}
function initScene() {
    scene.add(loadGround());
    scene.add(loadSky());
}

var gui;
var treeParameter;
function initGUI() {
    gui = new dat.gui.GUI();
    treeParameter = {
        scale:false
    };
    gui.remember(treeParameter);

    gui.add( treeParameter, 'scale').onFinishChange(function (e) {
        treeParameter.scale=e;
    });

}


var mouse = new THREE.Vector2();
var selected = null;
function onclick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    vector.unproject(camera);

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects01 = raycaster.intersectObjects( normalTree[0].children);
    var intersects02 = raycaster.intersectObjects( normalTree[1].children);
    if(intersects01.length) {
        gui.domElement.hidden = false;
        selected=normalTree[0];
        if (!treeParameter.scale) {
            tracontrols.attach(selected);
            rotcontrols.attach(selected);
        }
        else{
            scacontrols.attach(selected);
        }

    }
    else if(intersects02.length) {
        gui.domElement.hidden = false;
        selected=normalTree[1];
        if (!treeParameter.scale) {
            tracontrols.attach(selected);
            rotcontrols.attach(selected);
        }
        else{
            scacontrols.attach(selected);
        }

    }else{
        gui.domElement.hidden = true;
        tracontrols.detach(selected);
        rotcontrols.detach(selected);
        scacontrols.detach(selected);
    }
}

function animate() {
    tracontrols.update();
    rotcontrols.update();
    scacontrols.update();
    Orbitcontrols.update();
    render();
   // lbbs.update();
    requestAnimationFrame(animate);
}

function render() {

    renderer.clear();
    renderer.render(scene,camera);
}