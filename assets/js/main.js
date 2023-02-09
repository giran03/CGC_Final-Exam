//  Created by: https://github.com/giran03
//  Computer Graphics Computing - M3 FINAL EXAM
//  Description

import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { FlyControls } from './FlyControls.js';
import * as TWEEN from './tween.esm.js';

// S E T
let baseGroundGeometry, baseGroundMaterial, baseGround;
let pathWayGeometry, pathWayMaterial, pathWay;
let waterDropletsGeo, waterDropletsMat, waterDroplets;
let tween1;

// ⚙️ S E T T I N G S ⚙️
// 'true'   |   'false'
let wireframeStatus = false;     // set to 'true' to enable wireframe.
let enableGridHelper = true;     // set to 'true' to enable grid helper. 
let enableLightHelper =  false;  // set to 'true' to enable light helper. 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const flyControls = new FlyControls( camera, renderer.domElement);

// L O A D I N G  3 D  M O D E L S
const progressBar = document.getElementById('progress-bar');
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}
const progressBarContainer = document.querySelector('.progress-bar-container')
loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
    tween1.start();
}
const gltfloader = new GLTFLoader(loadingManager);
// const gltfloader = new GLTFLoader();

renderer.setSize( window .innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// C A M E R A  C O N T R O L S
flyControls.movementSpeed = .5;
flyControls.dragToLook = true;
flyControls.rollSpeed = .005;
camera.position.set(-22,20,1.5);
camera.lookAt(30,0,0);

// 🕶️ S H D A D O W S 🕶️
renderer.shadowMap.enabled = true; // set to 'true' to enable shadows. 'true'|'false'
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 🕳️ T E X T U R E S 🕳️
let sceneBackground = new THREE.TextureLoader().load( './assets/textures/background/genshin_sky.jpg')
sceneBackground.wrapS = THREE.MirroredRepeatWrapping;
sceneBackground.wrapT = THREE.MirroredRepeatWrapping;
scene.background = sceneBackground

let concreteTexture = new THREE.TextureLoader().load( './assets/textures/Concrete/Concrete_BaseColor.jpg');
let concreteNormal = new THREE.TextureLoader().load( './assets/textures/Concrete/Concrete_Normal.jpg');
let concreteRoughness = new THREE.TextureLoader().load( './assets/textures/Concrete/Concrete_Roughness.jpg');
let concreteAO = new THREE.TextureLoader().load( './assets/textures/Concrete/Concrete_ambientOcclusion.jpg');
concreteTexture.wrapS = THREE.RepeatWrapping;
concreteTexture.wrapT = THREE.RepeatWrapping;
concreteTexture.repeat.set(3,3);

let grassTexture = new THREE.TextureLoader().load( './assets/textures/Grass/Grass_BaseColor.jpg');
let grassTexture2 = new THREE.TextureLoader().load( './assets/textures/Grass/Grass_BaseColor.jpg');
let grassNormal = new THREE.TextureLoader().load( './assets/textures/Grass/Grass_Normal.jpg');
let grassRoughness = new THREE.TextureLoader().load( './assets/textures/Grass/Grass_Roughness.jpg');
let grassAO = new THREE.TextureLoader().load( './assets/textures/Grass/Grass_ambientOcclusion.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(6,6);
grassTexture2.wrapS = THREE.RepeatWrapping;
grassTexture2.wrapT = THREE.RepeatWrapping;
grassTexture2.repeat.set(53,35);

let dirtTexture = new THREE.TextureLoader().load( './assets/textures/Dirt/GroundDirt_basecolor.jpg');
let dirtNormal = new THREE.TextureLoader().load( './assets/textures/Dirt/GroundDirt_Normal.jpg');
let dirtRoughness = new THREE.TextureLoader().load( './assets/textures/Dirt/GroundDirt_Roughness.jpg');
let dirtAO = new THREE.TextureLoader().load( './assets/textures/Dirt/GroundDirt_ambientOcclusion.jpg');
dirtTexture.wrapS = THREE.RepeatWrapping;
dirtTexture.wrapT = THREE.RepeatWrapping;
dirtTexture.repeat.set(1,1);

let stoneFloorTexture = new THREE.TextureLoader().load( './assets/textures/stoneFloor/Stylized_Stone_Floor_basecolor.jpg');
let stoneFloorNormal = new THREE.TextureLoader().load( './assets/textures/stoneFloor/Stylized_Stone_Floor_Normal.jpg');
let stoneFloorRoughness = new THREE.TextureLoader().load( './assets/textures/stoneFloor/Stylized_Stone_Floor_Roughness.jpg');
let stoneFloorAO = new THREE.TextureLoader().load( './assets/textures/stoneFloor/Stylized_Stone_Floor_ambientOcclusion.jpg');
stoneFloorTexture.wrapS = THREE.RepeatWrapping;
stoneFloorTexture.wrapT = THREE.RepeatWrapping;
stoneFloorTexture.repeat.set(53,3);

// 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧 START 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧

// G R O U N D  B A S E
waterOrbParticles();

baseGroundGeometry = new THREE.BoxGeometry(53, 35, .2,1,1,1);
baseGroundMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture2,
    normalMap: grassNormal,
    bumpMap: grassRoughness,
    aoMap: grassAO,
    emissive: 0x3fff38,
    emissiveIntensity: .05,
    wireframe: wireframeStatus
});
baseGround = new THREE.Mesh(baseGroundGeometry,baseGroundMaterial);
baseGround.receiveShadow = true;
baseGround.rotation.y = Math.PI*.06;
baseGround.rotation.x = Math.PI*.5;
baseGround.position.set(12, 3.9, -1);
scene.add(baseGround)

pathWayGeometry = new THREE.BoxGeometry(52, 3, .3,1,1,1);
pathWayMaterial = new THREE.MeshStandardMaterial({
    map: stoneFloorTexture,
    normalMap: stoneFloorNormal,
    bumpMap: stoneFloorRoughness,
    aoMap: stoneFloorAO,
    emissive: 0xb3734d,
    emissiveIntensity: .05,
    wireframe: wireframeStatus
});
pathWay = new THREE.Mesh(pathWayGeometry,pathWayMaterial);
pathWay.receiveShadow = true;
pathWay.rotation.y = Math.PI*.06;
pathWay.rotation.x = Math.PI*.5;
pathWay.position.set(12, 3.9, -1);
scene.add(pathWay)

// C r e a t i n g  3 D  O b j e c t s
createToriiGate(-2.5,0,-1);
createToriiGate(13,6,-1);
createToriiGate(30,10,-1);
// right side
createLamp(-10,.6,2.25)
createLamp(-2.5,2.5,1.5)
createLamp(12,8.2,1.5)
createLamp(22,10.2,1.5)
// left side
createLamp(-10,.6,-5)
createLamp(-11,.6,-3.5) 
createLamp(1.5,4.3,-3.5)
createLamp(6.3,6.3,-5)
createLamp(12.5,8.2,-5)
// Tall Bush
createBush(-2,8,-7, 1,.6,1)
createBush(-6,3,-7, .5,.4,.5)
createBush(-2,1,-5, .5,.4,.5)
createBush(13,9,-9, .8,1.5,.8)
createBush(18,5,-11, .4,.5,.8)

createBush(-8,0,2, .3,.3,.3)
createBush(3,6,7, .6,.4,1)
createBush(13,9,8, .5,1,.5)
createBush(26,9,4, .5,.4,.5)
createBush(28,9,4, .7,.8,.7)

// S E E L I E
createSeelie(1,5,1)

// S T O N E  S T E P S
// 1st step
createStoneBricks(-1.5, 5.5, 2)
createStoneBricks(-1.5, 5.5, 11)
// 2nd step
createStoneBricks(7, 7.5, 11)
createStoneBricks(10.9,9.2, 2)
// 3rd step
createStoneBricks(15.9,11.2, 11)
createStoneBricks(15.9,11.2, 2)
// 4th step
createStoneBricks(21.9,13.2, 11)
createStoneBricks(21.9,13.2, 2)
// 5th step
createStoneBricksCustom(34, 7.2, 3, 17, 5, 5)
createStoneBricksCustom(34, 7.2, -6, 17, 5, 5)

// W A L L S
// right side
createRockWallsCustom(6,2,8,20,3,6)
createRockWallsCustom(32,5,8,30,3,6)
// left side
createRockWallsCustom(6,-1,-11,20,3,6)
createRockWallsCustom(12,5,-11,17,3,6)
createRockWallsCustom(-3,-2.5,-8,3,1,6)

// S T O N E  S T A I R S | ascending
createStoneStairs(1,1.7,1)
createStoneStairs(2.1,1.9,1)
createStoneStairs(3.1,2.1,1)
createStoneStairs(4.1,2.4,1)

createStoneStairs(11,3.7,1)
createStoneStairs(12,3.9,1)
createStoneStairs(13,4.1,1)
createStoneStairs(14,4.3,1)
createStoneStairs(15,4.6,1)

createStoneStairs(20,5.4,1)
createStoneStairs(21,5.7,1)
createStoneStairs(22,5.8,1)
createStoneStairs(23,6.1,1)

createStoneStairs(33,7.8,1)
createStoneStairs(34,8.1,1)
createStoneStairs(35,8.4,1)
createStoneStairs(36,8.7,1)
createStoneStairs(37,9,1)

// S T O N E  R U B B L E S
createStoneRubble(-4.5,1,-3.5)
createStoneRubble(0,3,-4.5)

createStoneRubble(-4.5,1,2)
createStoneRubble(5.5,3,2)

// G R A S S  T O P  L A Y E R
// left side
createGrassTop(-8,3.5,-11, 10,1,10)
createGrassTop(6.5,9.7,-11, 20,1,10)

createGrassTop(-2.8,-.5,-5.3, 18,2,5) // 1st
createGrassTop(9.6,1.7,-5.3, 18,5,5) // 2nd
createGrassTop(14.6,3.7,-5.3, 18,5,5) // 3rd
createGrassTop(20.6,5.7,-5.3, 18,5,5) // 4th
createGrassTop(29.1,7.5,-5.5, 18,5,5) // 5th

// right side
createGrassTop(-4.5,6.5,8, 16.5,1,10)
createGrassTop(12,9.5,8, 16,1,10)

createGrassTop(-7.7,-.5,3.3, 8,2,5) // 1st
createGrassTop(.2,1.4,3.3, 7,2,5) // 2nd
createGrassTop(9.1,4.3,3.3, 7,4,5) // 3rd
createGrassTop(16,6.1,3.3, 9,4,5) // 4th
createGrassTop(29,7.8,6.5, 18,5,11) // 5th

// 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧 END 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧

window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

// L I G H T S
const hemiSphrLight = new THREE.HemisphereLight( 0x2d3de3, 0x27d927, 1.7 );
const hemiSphrLight2 = new THREE.HemisphereLight( 0xffffff, 0xffffff, .3 );
scene.add( hemiSphrLight,hemiSphrLight2 );

const spotLight = new THREE.SpotLight( 0xffffff, 1 );
spotLight.position.set( -20, 100, 30 );
spotLight.angle = .5;
spotLight.castShadow = true;
scene.add( spotLight );

// s h a d o w  c o n f i g
spotLight.shadow.mapSize.width = 4096;
spotLight.shadow.mapSize.height = 4096;


// 🫂 H E L P E R 🫂
const gridHelper = new THREE.GridHelper( 100, 100 );
if (enableGridHelper == true)
    scene.add( gridHelper );

if (enableLightHelper == true)
{
    const spotLightShadowHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( spotLightHelper, spotLightShadowHelper );
}

function animate() {
	requestAnimationFrame( animate );

    TWEEN.update()
    flyControls.update(.5);
    // console.log(camera.position);

    if (waterDroplets.position.y <= 12)
        waterDroplets.position.y += .005;
    else {
        scene.remove(waterDroplets)
        waterOrbParticles()
    }
renderer.render( scene, camera );
}
animate();

// 🛟 U S E R  D E F I N E D  F U N C T I O N S 
function createSeelie(x,y,z) {
    gltfloader.load('./assets/models/seelie/seelie.glb', function(gltfScene) {
        const model = gltfScene.scene;
        model.position.set(x,y,z);
        model.scale.set(5,5,5);
        model.rotation.y = Math.PI * 1;
        model.traverse(function(node) {
            if(node.isMesh)
                node.castShadow = true;
        })
        model.castShadow = true;
        scene.add(model);

        tween1 = new TWEEN.Tween({x: -10, y: 10.4, z: 6.5})
        .to({ x: 0.4, y: 13.2, z: -8}, 5000)
        .onUpdate((coords) => {
            model.position.x = coords.x;
            model.position.y = coords.y;
            model.position.z = coords.z;
        })
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .delay(100)

        const tween2 = new TWEEN.Tween({x: 0.4, y: 13.2, z: -8})
        .to({ x: 14.8, y: 13.2, z: -7.5}, 3000)
        .onUpdate((coords) => {
            model.position.x = coords.x;
            model.position.y = coords.y;
            model.position.z = coords.z;
        })
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .delay(100)

        const tween3 = new TWEEN.Tween({x: 14.8, y: 13.2, z: -7.5})
        .to({ x: 20.7, y: 12.6, z: -1}, 3000)
        .onUpdate((coords) => {
            model.position.x = coords.x;
            model.position.y = coords.y;
            model.position.z = coords.z;
        })
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .delay(100)

        const tween4 = new TWEEN.Tween({x: 20.7, y: 12.6, z: -1})
        .to({ x: 35.7, y: 14.6, z: -1}, 3000)
        .onUpdate((coords) => {
            model.position.x = coords.x;
            model.position.y = coords.y;
            model.position.z = coords.z;
        })
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .delay(100)

        tween1.chain(tween2);
        tween2.chain(tween3);
        tween3.chain(tween4);
        tween4.chain(tween1);
        // tween1.start();
        });
}

function waterOrbParticles() {
    const points = [];
  
    for (let i = 0; i < 150; i++) {
      let waterDrop = new THREE.Vector3(
        Math.random() * 80 - 40,
        Math.random() * 50 - 10,
        Math.random() * 50 - 25
      );
      points.push(waterDrop);
    }
  
    waterDropletsGeo = new THREE.BufferGeometry().setFromPoints(points);
  
    let sprite = new THREE.TextureLoader().load("assets/images/water_orb.png");
    waterDropletsMat = new THREE.PointsMaterial({
      color: 0x42a1ff,
      size: 0.7,
      map: sprite,
      transparent: true
    });
    waterDropletsMat.opacity = Math.random() * 2;

    waterDroplets = new THREE.Points(waterDropletsGeo, waterDropletsMat);
    
    scene.add(waterDroplets);
}

function createRockWallsCustom(x,y,z,ax,ay,az) {
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshStandardMaterial({
        map:dirtTexture,
        normalMap: dirtNormal,
        bumpMap: dirtRoughness,
        aoMap: dirtAO,
        emissive: 0x875435,
        emissiveIntensity: .2,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 500);
    scene.add(mesh);
    
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    mesh.castShadow = true
    mesh.receiveShadow = true;

    const obj = new THREE.Object3D();
    for (let i = 0; i < 500; i++) {
        obj.position.x = Math.random() * ax - ax+3; // " * a - b " | a = towards -x & b = towards +x if decreased
        obj.position.y = Math.random() * ay - ay+3;
        obj.position.z = Math.random() * az - az+3;

        obj.scale.x = obj.scale.y = obj.scale.z = Math.random();

        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    }
}

function createStoneBricks(x,y,z) {
    const geometry = new THREE.BoxGeometry(1.5,.5,1);
    const material = new THREE.MeshLambertMaterial({
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        aoMap: concreteAO,
        emissive: 0x9fc2c7,
        emissiveIntensity: .1,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 3500);
    scene.add(mesh);

    mesh.castShadow = true
    mesh.receiveShadow = true;

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    const obj = new THREE.Object3D();
    for (let i = 0; i < 3500; i++) {
        obj.position.x = Math.random() * 9 - 10; // " * a - b " | a = towards -x & b = towards +x ,if decreased
        obj.position.y = Math.random() * 3 - 8;
        obj.position.z = Math.random() * 5 - 10;

        obj.scale.x = obj.scale.y = obj.scale.z = Math.random();

        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    }
}

function createStoneBricksCustom(x,y,z,ax,ay,az) {
    const geometry = new THREE.BoxGeometry(1.5,.5,1);
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 3500);
    scene.add(mesh);

    mesh.castShadow = true
    mesh.receiveShadow = true;

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    const obj = new THREE.Object3D();
    for (let i = 0; i < 3500; i++) {
        obj.position.x = Math.random() * ax - ax+3; // " * a - b " | a = towards -x & b = towards +x if decreased
        obj.position.y = Math.random() * ay - ay+3;
        obj.position.z = Math.random() * az - az+3;

        obj.scale.x = obj.scale.y = obj.scale.z = Math.random();

        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    }
}

function createToriiGate(x,y,z) {
    gltfloader.load('./assets/models/torii_gate/scene.gltf', function(gltfScene) {
    const model = gltfScene.scene;
    model.position.set(x,y,z);
    model.scale.set(.015,.015,.015);

    model.traverse(function(node) {
        if(node.isMesh)
        {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    })
    model.getObjectByName('Cylinder_torii_0').material.emissive.setHex(0xff3b52);
    model.getObjectByName('Cylinder_torii_0').material.emissiveIntensity = .05;
    model.receiveShadow = true;
    scene.add(model);
    });
}

function createLamp(x,y,z) {
    gltfloader.load('./assets/models/stone_lamp/scene.gltf', function(gltfScene) {
        const model = gltfScene.scene;
        model.position.set(x,y,z);
        model.scale.set(.05,.05,.05);

        model.traverse(function(node) {
            if(node.isMesh)
                node.castShadow = true;
                node.receiveShadow = true;
        })
        model.getObjectByName('Object_2').material.map=concreteTexture;
        model.getObjectByName('Object_2').material.emissive.setHex(0x9daec9);
        model.getObjectByName('Object_2').material.emissiveIntensity = .2;
        scene.add(model);
        });
}

function createBush(x,y,z,width,height,depth) {
    gltfloader.load('./assets/models/tall_bush/scene.gltf', function(gltfScene) {
        const model = gltfScene.scene;
        model.position.set(x,y,z);
        model.scale.set(width,height,depth);

        model.traverse(function(node) {
            if(node.isMesh)
                node.castShadow = true;
        })
        model.getObjectByName('ST_TallBush_ST_Blades_1_Mat_0').material.emissive.setHex(0x30ff4e);
        model.getObjectByName('ST_TallBush_ST_Blades_2_Mat_0').material.emissive.setHex(0x19ff3b);
        model.getObjectByName('ST_TallBush_ST_Blades_1_Mat_0').material.emissiveIntensity = .4;
        model.getObjectByName('ST_TallBush_ST_Blades_2_Mat_0').material.emissiveIntensity = .2;
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        });
}

function createGrassTop(x,y,z,width,height,depth) {
    const geometry = new THREE.BoxGeometry(width,height,depth)
    const material = new THREE.MeshToonMaterial({
        map: grassTexture,
        normalMap: grassNormal,
        bumpMap: grassRoughness,
        aoMap: grassAO,
        emissive: 0x3fff38,
        emissiveIntensity: .02,
        wireframe: wireframeStatus
    })
    const mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(x,y,z)
    scene.add(mesh)

    mesh.castShadow = true;
    mesh.receiveShadow = true;
}

function createStoneStairs (x,y,z) {
    const geometry = new THREE.BoxGeometry(2,.5,3);
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 5);
    scene.add(mesh);

    mesh.castShadow = true
    mesh.receiveShadow = true;

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    const obj = new THREE.Object3D();
    for (let i = 0; i < 5; i++) {
        obj.position.z = Math.random() * 5 - 4; // " * a - b " | a = towards -x & b = towards +x if decreased

        obj.scale.y = Math.random();

        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    }
}

function createStoneRubble(x,y,z) {
    const geometry = new THREE.BoxGeometry(1.5,.5,1);
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 7);
    scene.add(mesh);

    mesh.castShadow = true
    mesh.receiveShadow = true;

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    mesh.rotation.z = Math.PI * 0.1;
    const obj = new THREE.Object3D();
    for (let i = 0; i < 7; i++) {
        obj.position.x = Math.random() * 3 - 2; // " * a - b " | a = towards -x & b = towards +x if decreased
        obj.position.z = Math.random() * 3 - 2;
        obj.position.z = Math.random() * 2 - 1;

        obj.scale.x = obj.scale.y = obj.scale.z = Math.random();
        obj.rotation.x = Math.random();
        obj.rotation.y = Math.random();
        obj.rotation.z = Math.random();

        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    }
}