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
var tree2=[];
var midTree=[];
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
                    while (data[i] != ' ') {
                        child += data[i].toString();
                        i++;
                    }
                    while (data[i] != '\n')i++;
                    i++;
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
                        pos: new THREE.Vector3(x * 100, y * 100, z * 100)
                    };
                    trunk.push(circle);
                    branchlength--;
                    if(branchlength==0){
                        if(tree1==null)
                            tree1 = new Tree(trunk);
                        else{
                            insert(trunk,child,struct1.length);
                        }
                        trunk=[];
                    }
                }
            }
            createTree();
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
            var branchlength=0;
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
                            i+=21;
                        }
                        else{
                            i+=20;
                        }
                    }
                    else{
                        i+=19;
                    }
                    struct2.push(number);
                    if(data[i]=='\r')
                        i--;
                    if(data[i-1]=='\r')
                    i-=2;
                }
                if(data[i+2]=='\r') {
                    branchlength = data[i].toString() + data[i + 1].toString();
                    i += 4;
                    sequence++;
                }
                if(data[i+1]=='\r'){
                    branchlength = data[i].toString();
                    i += 3;
                    sequence++;
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
                        pos: new THREE.Vector3(x * 100, y * 100, z * 100)
                    };
                    tree2.push(circle);
                    branchlength--;
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
var trunk1;
var trunk2;
function createTree(){
    var maxsequence;
    var l= 1;
    var i=0;
    var j=0;
    for(var m=0;m<struct1.length||m<struct2.length;m++) {
        if(m<struct1.length && m<struct2.length && parseInt(struct1[m])==parseInt(struct2[m])) {
            for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                for ( i ; i < tree1.length; i++) {
                    if (tree1[i].sequence == l) {
                        trunk1.push(tree1[i]);
                        if (tree1[i + 1].sequence != l)
                            break;
                    }
                }
                for (j ; j < tree2.length; j++) {
                    if (tree2[j].sequence == l) {
                        trunk2.push(tree2[j]);
                        if (tree2[j + 1].sequence != l)
                            break;
                    }
                }
                blending();
            }
        }
        else if(m>=struct1.length){
            for (l=tree2[j].sequence,maxsequence=l+parseInt(struct2[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                for (j; j < tree2.length; j++) {
                    if (tree2[j].sequence == l) {
                        trunk2.push(tree2[j]);
                        if (j+1<tree2.length && tree2[j + 1].sequence != l)
                            break;
                    }
                }
                trunk1.push('0');
                blending();
            }
        }
        else if(m>=struct2.length){
            for (l=tree1[j].sequence,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                trunk1 = [];
                trunk2 = [];
                for (j; j < tree1.length; j++) {
                    if (tree1[j].sequence == l) {
                        trunk1.push(tree1[j]);
                        if (j+1<tree1.length && tree1[j + 1].sequence != l)
                            break;
                    }
                }
                trunk2.push('0');
                blending();
            }
        }
        else if(m<struct1.length && m<struct2.length && parseInt(struct1[m])!=parseInt(struct2[m])){
            var interval;
            var t=1;
            if(parseInt(struct1[m])>parseInt(struct2[m])){
                interval=parseInt(parseInt(struct1[m])/parseInt(struct2[m]));
                var minsequence = parseInt(struct2[m])+l-1;
                for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                    trunk1 = [];
                    trunk2 = [];
                    for ( i ; i < tree1.length; i++) {
                        if (tree1[i].sequence == l) {
                            trunk1.push(tree1[i]);
                            if (i+1<tree1.length&&tree1[i + 1].sequence != l)
                                break;
                        }
                    }

                    if(tree2[j].sequence-l/interval>1)
                        t=parseInt(tree2[j].sequence-l/interval);
                    for (j ; j < tree2.length; j++) {
                        if (tree2[j].sequence == l/interval+t && tree2[j].sequence<= minsequence) {
                            trunk2.push(tree2[j]);
                            if (tree2[j + 1].sequence != l/interval+t){
                                j++;
                                break;
                            }
                        }
                        else if(tree2[j+1].sequence == l/interval+t&& tree2[j].sequence<= minsequence){

                        }
                        else{
                            trunk2.push('0');
                            break;
                        }
                    }
                    blending();
                }
            }
            else{
                interval=parseInt(parseInt(struct2[m])/parseInt(struct1[m]));
                minsequence = parseInt(struct1[m])+l-1;
                for (l,maxsequence=l+parseInt(struct1[m])-1; l <= maxsequence; l++) {
                    trunk1 = [];
                    trunk2 = [];
                    for ( j ; j < tree2.length; j++) {
                        if (tree2[j].sequence == l) {
                            trunk2.push(tree2[j]);
                            if (j+1<tree2.length&&tree2[j + 1].sequence != l)
                                break;
                        }
                    }

                    if(tree1[i].sequence-l/interval>1)
                        t=parseInt(tree1[i].sequence-l/interval);
                    for (i ; i < tree1.length; i++) {
                        if (tree1[i].sequence == l/interval+t && tree1[i].sequence<= minsequence) {
                            trunk1.push(tree1[i]);
                            if (tree1[i + 1].sequence != l/interval+t){
                                i++;
                                break;
                            }
                        }
                        else if(tree1[i+1].sequence == l/interval+t&& tree1[i].sequence<= minsequence){

                        }
                        else{
                            trunk1.push('0');
                            break;
                        }
                    }
                    blending();
                }
            }
        }
    }
}
function blending(){
    midTree=[];
    if(trunk1.length ==trunk2.length&& trunk2[0]!='0'){
        for(var i=0;i<trunk1.length;i++) {
            var cicle = {
                radius: (trunk1[i].radius + trunk2[i].radius) / 2,
                pos: trunk1[i].pos.add(trunk2[i].pos).divideScalar(2)
            };
            midTree.push(cicle);
        }
    }
    if(trunk1.length >trunk2.length&& trunk2[0]!='0'){
        for(var i=1;i<=trunk2.length;i++) {
            var cicle = {
                radius: (trunk1[i*parseInt(trunk1.length/trunk2.length)-1].radius + trunk2[i-1].radius) / 2,
                pos: trunk1[i*parseInt(trunk1.length/trunk2.length)-1].pos.add(trunk2[i-1].pos).divideScalar(2)
            };
            midTree.push(cicle);
        }
    }
    if(trunk1.length <trunk2.length && trunk1[0]!='0'){
        for(var i=0;i<trunk1.length;i++) {
            var cicle = {
                radius: (trunk2[i*parseInt(trunk2.length/trunk1.length)-1].radius + trunk1[i-1].radius) / 2,
                pos: trunk2[i*parseInt(trunk2.length/trunk1.length)-1].pos.add(trunk1[i-1].pos).divideScalar(2)
            };
            midTree.push(cicle);
        }
    }
    if(trunk2[0]=='0'){
        for(var i=0;i<trunk1.length;i++) {
                var cicle={radius:(trunk1[i].radius)/2,pos:trunk1[i].pos.divideScalar(2)};
            midTree.push(cicle);
            }
    }
    if(trunk1[0]=='0'){
        for(var i=0;i<trunk2.length;i++) {
            var cicle={radius:(trunk2[i].radius)/2,pos:trunk2[i].pos.divideScalar(2)};
            midTree.push(cicle);
        }
    }
    drawBranch();
    scene.add(branch);
}
function drawBranch() {
    var seg = 30;
    var geo = new THREE.Geometry();
    for(var i = 0, l = midTree.length; i < l; i ++){
        var circle = midTree[i];
        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            var posx=0,posy=0,posz=0;
            if(i>0) {
                posx = Math.abs(midTree[i].pos.x - midTree[i - 1].pos.x);
                posy = Math.abs(midTree[i].pos.y - midTree[i - 1].pos.y);
                posz = Math.abs(midTree[i].pos.z - midTree[i - 1].pos.z);
            }
            if(i==0){
                posx = Math.abs(midTree[i+1].pos.x - midTree[i].pos.x);
                posy = Math.abs(midTree[i+1].pos.y - midTree[i].pos.y);
                posz = Math.abs(midTree[i+1].pos.z - midTree[i].pos.z);
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
/*function cut(){
    forest.remove(selected);
    forests.push(forest);
    sequence=forests.length-1;
    removeByValue(normalTree, cutTree);
    scene.remove(selected);
    forestsize--;
}
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
function copy(){
    forestsize++;
    var copy=selected.clone();
    copy.position.x=0;
    copy.position.z=0;
    forest.add(copy);
    forests.push(forest);
    normalTree.push(copy.children[0]);
    sequence=forests.length-1;
    scene.add(forest);
}*/
var treeParameter = {
    scale:false
//    copy:copy,
 //   cut:cut
};
var gui;
function initGUI() {
    gui = new dat.gui.GUI();
    gui.remember(treeParameter);

    gui.add( treeParameter, 'scale').onFinishChange(function (e) {
        treeParameter.scale=e;
    });
 //   gui.add(treeParameter,"copy");
  //  gui.add(treeParameter,"cut");
}


var mouse = new THREE.Vector2();
var selected = null;
var cutTree = null;
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
        cutTree = intersects01[0].object;
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
        cutTree = intersects02[0].object;
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