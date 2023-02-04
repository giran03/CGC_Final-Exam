//  Created by: https://github.com/giran03
//  Computer Graphics Computing - M3 EXAM
//  Description

import * as THREE from './three.module.js';
import { Clock } from './Clock.js';
import { OrbitControls } from './OrbitControls.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import { GLTFLoader } from './GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const orbitControls = new OrbitControls( camera, renderer.domElement );
const fpControls = new FirstPersonControls(camera, renderer.domElement );
const gltfloader = new GLTFLoader();

scene.background = new THREE.Color( 0x525252 );
renderer.setSize( window .innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 📝 I N I T I A L I Z E  V A R I A B L E S 📝
let rotateNinetyDegrees = Math.PI*0.5; // used for 90 degrees rotation.

// I N I T I A L I Z E  G E O M E T R I E S
let mesh;
let floorGeo, floorMat, floorMesh;
let baseGroundGeometry, baseGroundMaterial, baseGround

// ⚙️ S E T T I N G S ⚙️
// 'true'   |   'false'
let wireframeStatus = false;                    // set to 'true' to enable wireframe.
let enableGridHelper = false;               // set to 'true' to enable grid helper. 
let enableLightHelper =  false;             // set to 'true' to enable light helper. 
let enableTextures =  false;                // set to 'true' to enable textures.
let enableOrbitCamera =  true;              // set to 'true' to enable orbit controls for camera. 
                                            // ⚠️ 'true' = disables first person controls.
let enableOrbitAutoRotate =  false;         // set to 'true' to enable camera auto rotate.
                                            // can be used with first person controls.
                                            // move with Mouse control, WASD, or arrow keys.

fpControls.enabled = true; // ⚠️ change "enableOrbitCamera" to 'true' instead.

// 🕶️ S H D A D O W S 🕶️
renderer.shadowMap.enabled = true; // set to 'true' to enable shadows. 'true'|'false'
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // add "mesh.castShadow = "true" or mesh.receiveShadow = "true" "
    // to enable shadow for that mesh

// 🕳️ T E X T U R E S 🕳️
let concreteTexture = new THREE.TextureLoader().load( './assets/materials/Concrete/Concrete_BaseColor.jpg');
let concreteNormal = new THREE.TextureLoader().load( './assets/materials/Concrete/Concrete_Normal.jpg');
let concreteRoughness = new THREE.TextureLoader().load( './assets/materials/Concrete/Concrete_Roughness.jpg');
let concreteAO = new THREE.TextureLoader().load( './assets/materials/Concrete/Concrete_ambientOcclusion.jpg');
concreteTexture.wrapS = THREE.RepeatWrapping;
concreteTexture.wrapT = THREE.RepeatWrapping;
concreteTexture.repeat.set(3,3);

let grassTexture = new THREE.TextureLoader().load( './assets/materials/Grass/Grass_BaseColor.jpg');
let grassNormal = new THREE.TextureLoader().load( './assets/materials/Grass/Grass_Normal.jpg');
let grassRoughness = new THREE.TextureLoader().load( './assets/materials/Grass/Grass_Roughness.jpg');
let grassAO = new THREE.TextureLoader().load( './assets/materials/Grass/Grass_ambientOcclusion.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(13,13);

// 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧 START 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧

// 3 D  M O D E L S
floorMesh = new THREE.Mesh(
    floorGeo = new THREE.PlaneGeometry(15,15),
    floorMat = new THREE.MeshNormalMaterial({
        wireframe: wireframeStatus,
        side: THREE.DoubleSide,
    })
)
floorMesh.rotation.x = rotateNinetyDegrees;
scene.add(floorMesh);

// G R O U N D
baseGroundGeometry = new THREE.BoxGeometry(50, 25, .2,1,1,1);
baseGroundMaterial = new THREE.MeshStandardMaterial({
    color:0x52b04a,
    wireframe: wireframeStatus
});
baseGround = new THREE.Mesh(baseGroundGeometry,baseGroundMaterial);
baseGround.rotation.y = Math.PI*.06;
baseGround.rotation.x = Math.PI*.5;
baseGround.position.set(12, 3.9, 0);
scene.add(baseGround)

createToriiGate(-2.5,0,-1);
createToriiGate(13,6,-1);
createToriiGate(30,10,-1);

// createRockWall(-2, 2, -8, 6, 5, 6)
// createRockWall(-7.5, 0, -8, 5.5, 5, 6)

// createRockWall(2, 2.7, 7, 11, 5, 8)
// createRockWall(-5, 3, 7, 5, 5, 5)
// createRockWall(-5, 0, 7, 10.5, 5, 8)

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
createStoneBricks(20.9,13.2, 11)
createStoneBricks(20.9,13.2, 2)
// 5th step
createStoneBricksCustom(29.9, 7.2, 3, 17, 5, 5)
createStoneBricksCustom(29.9, 7.2, -6, 17, 5, 5)

// createStoneBricks(12.9,10.2, 2)
// createStoneBricks(12.9,10.2, 11)

// 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧 END 🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧🫧

// 🕶️⚙️ S H A D O W  P R O P E R T I E S ⚙️🕶️
// change light to desired light
// Light.shadow.mapSize.width = 512;
// Light.shadow.mapSize.height = 512;

// 🫂 H E L P E R 🫂
const gridHelper = new THREE.GridHelper( 15, 15 );
if (enableGridHelper == true)
    scene.add( gridHelper );

if (enableLightHelper == true)
{
    // insert code
}

// C O N T R O L S
if (enableOrbitCamera == true) {
    fpControls.enabled = false;
    // controls.enableDamping = true;
    orbitControls.target.set(0, 0, 0);
}
if (enableOrbitAutoRotate == true) {
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 1;
}
fpControls.movementSpeed = 20;
fpControls.lookSpeed = .5;
fpControls.lookVertical = true;

// 📷 C A M E R A  P O S I T I O N  &  L O O K  A T 📷
// update values on desired cords
// camera.position.set( -24,10,4 );
// camera.lookAt(0,20,20);
camera.position.set( 13, 15, 11)
orbitControls.update();

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};

// L I G H T S
const hemiSphrLight = new THREE.HemisphereLight( 0x2d3de3, 0x27d927, .8 );
const hemiSphrLight2 = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
scene.add( hemiSphrLight,hemiSphrLight2 );

function animate() {
	requestAnimationFrame( animate );

    fpControls.update(clock.getDelta());
    orbitControls.update(clock.getDelta())
    console.log(camera.position)

renderer.render( scene, camera );
}
animate();

// U S E R  D E F I N E D  F U N C T I O N S
function createRockWall(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width,height,depth);
    const material = new THREE.MeshStandardMaterial({
        color:0x875435,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.Mesh(geometry,material);
    mesh.position.set(x, y, z);
  
    scene.add(mesh)
}
function createStoneBricks(x,y,z) {
    const geometry = new THREE.BoxGeometry(1.5,.5,1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        aoMap: concreteAO,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 3500);
    scene.add(mesh);

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
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: concreteTexture,
        normalMap: concreteNormal,
        bumpMap: concreteRoughness,
        wireframe: wireframeStatus
    });
    const mesh = new THREE.InstancedMesh(geometry,material, 3500);
    scene.add(mesh);

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
    gltfloader.load('./assets/models/torii_gate/scene.gltf', (gltfScene) => {
    gltfScene.scene.position.set(x,y,z);
    gltfScene.scene.scale.set(.015,.015,.015);
    scene.add(gltfScene.scene);
    });
}