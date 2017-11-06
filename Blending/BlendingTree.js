var canvas,width,height,renderer,scene,camera,tracontrols,Orbitcontrols,rotcontrols,scacontrols;
var normalTree=[];
var branch;
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
            createTree();
            binaryTree();
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
        for(var temp=currentTree2.children[0];temp.parent==currentTree2 && temp.right!=null;temp=temp.right){
            if(currentTree1.children[0]==null){
                currentTree1.children[0]=new Node('0');
                currentTree1.children[0].parent=currentTree1;
                if(currentTree1.left!=null) {
                    var leftParent = currentTree1.left.children[0];
                    while (leftParent.right)leftParent = leftParent.right;
                    currentTree1.children[0].left = leftParent;
                    leftParent.right = currentTree1.children[0];
                }
            }
            else{
                var current = currentTree1.children[0];
                while (current.right)current = current.right;
                var zero = new Node('0');
                current.right = zero;
                zero.left=current;
                zero.parent=currentTree1;
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

    for(; zeroNumber >0;currentTree1=currentTree1.right,currentTree2=currentTree2.right){
       // if(currentTree2.branch=="0" && currentTree2.right !=null)currentTree2=currentTree2.right;
        flag=false;
        for(i;i%interval!=0 && zeroNumber>0;i++){
            var zero = new Node('0');
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
function createTree(){
    for(var m=0;m<struct1.length||m<struct2.length;m++) {
       /* if(m<struct1.length && m<struct2.length && parseInt(struct1[m])==parseInt(struct2[m])) {
            for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                find(tree1,l,1);
                find(tree2,l,2);
            }
        }*/
        if(m>=struct1.length){
            /*l=0;
            for(var i=0;i<m;i++){
                l += parseInt(struct2[i]);
            }
            l++;
            for (l,maxsequence = l+parseInt(struct2[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                find(tree2,l,2);
                trunk1.push('0');*/
            addLayer(m,tree1,tree2);
        }
        else if(m>=struct2.length){
            /*l=0;
            for(var i=0;i<m;i++){
                l+=parseInt(struct1[i]);
            }
            l++;
            for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                find(tree1,l,1);
                trunk2.push('0');

            }*/
            addLayer(m,tree2,tree1);
        }
        else if(m<struct1.length && m<struct2.length && parseInt(struct1[m])!=parseInt(struct2[m])){
            if(parseInt(struct1[m])>parseInt(struct2[m])){
                addZero(m,tree1,tree2);
            }
            else{
                addZero(m,tree2,tree1);
            }
            /*var interval;
            var  minsequence=0;
            var max2sequence=0;
            var t=1;
            var flag=false;
            if(parseInt(struct1[m])>parseInt(struct2[m])){
                interval=parseInt(parseInt(struct1[m])/parseInt(struct2[m]));
                for(var i=0;i<m;i++){
                    minsequence+=parseInt(struct2[i]);
                }
                for(var i=0;i<=m;i++){
                    max2sequence+=parseInt(struct2[i]);
                }
                for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                    trunk1 = [];
                    trunk2 = [];
                    find(tree1,l,1);

                    if(minsequence+1-l/interval>1 && flag==false) {
                        t = parseInt(minsequence + 1 - l / interval);
                        flag=true;
                    }

                    if(l%interval==0 && l/interval+t<=max2sequence && currenttrunk.parent.half==false)
                        find(tree2,l/interval+t,2);
                    else{
                        trunk2.push('0');
                        find(tree1,l,0);
                    }
                }
            }
            else{
                interval=parseInt(parseInt(struct2[m])/parseInt(struct1[m]));
                for(var i=0;i<m;i++){
                    minsequence+=parseInt(struct1[i]);
                }
                for(var i=0;i<=m;i++){
                    max2sequence+=parseInt(struct1[i]);
                }

                for (l,maxsequence=l+parseInt(struct2[m])-1; l <= maxsequence; l++) {
                    trunk1 = [];
                    trunk2 = [];
                    find(tree2,l,2);
                    if(minsequence+1-l/interval>1 && flag==false) {
                        t = parseInt(minsequence + 1 - l / interval);
                        flag=true;
                    }

                    if(l%interval==0&&l/interval+t<=max2sequence)
                        find(tree1,l/interval+t,1);
                    else{
                        trunk1.push('0');
                    }

                }
            }*/
        }
    }
}
function drawBranch() {
    var seg = 30;
    var geo = new THREE.Geometry();
    for(var i = 0, l = midtrunk.length; i < l; i ++){
        var circle = midtrunk[i];
        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            var posx=0,posy=0,posz=0;
            if(i>0) {
                posx = Math.abs(midtrunk[i].pos.x - midtrunk[i - 1].pos.x);
                posy = Math.abs(midtrunk[i].pos.y - midtrunk[i - 1].pos.y);
                posz = Math.abs(midtrunk[i].pos.z - midtrunk[i - 1].pos.z);
            }
            if(i==0){
                posx = Math.abs(midtrunk[i+1].pos.x - midtrunk[i].pos.x);
                posy = Math.abs(midtrunk[i+1].pos.y - midtrunk[i].pos.y);
                posz = Math.abs(midtrunk[i+1].pos.z - midtrunk[i].pos.z);
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