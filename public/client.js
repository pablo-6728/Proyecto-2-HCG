import * as THREE from 'three'
import {OrbitControls} from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import * as obj from "./src/objects.js";
import {GLTFLoader} from "./jsm/loaders/GLTFLoader.js";

//añadir plano
const scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(5))
const plane = new obj.Plane(0, 0, 0, 200)
scene.add(plane.Mesh);

const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.5
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 50
camera.position.y = 50

const renderer =  new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x071924, 1)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const stats = Stats()
document.body.appendChild(stats.dom)

//A partir de aca cargamos los assets de la escena
const torch = new obj.Torch(30, 0, 30)
scene.add(torch.Mesh)

// Portal de obsidiana de Minecraft.
const minecraftPortal = new obj.Portal(70, 5, -95)
const portalTex = minecraftPortal.portalTex
scene.add(minecraftPortal.Mesh)

let update = 0

function animate(){
    let time = new Date()
    requestAnimationFrame(animate)
    portalTex.offset.y = Math.floor(update) / 32

    update += 0.3
    if (update >= 32) {
        update = 0
    }

    controls.update()
    render()
    stats.update()
}

//añadir assets
// TODO: Convertir a los assets en instancias de sus clases en objects.js
const villagerr01 = new GLTFLoader()
villagerr01.load(
    'assets/models/minecraft-villager/source/model.gltf', (gltfScene) => {
        gltfScene.scene.rotation.y = 180
        gltfScene.scene.scale.set(10, 10, 10)
        gltfScene.scene.position.set(50, 5, 0)
        scene.add(gltfScene.scene)
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log(error);
        console.log( 'An error happened' );

    }
)

const villagerr02 = new GLTFLoader()
villagerr02.load(
    'assets/models/minecraft-villager/source/model.gltf', (gltfScene) => {
        gltfScene.scene.rotation.y = 100
        gltfScene.scene.scale.set(10, 10, 10)
        gltfScene.scene.position.set(50, 5, 20)
        scene.add(gltfScene.scene)
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log(error);
        console.log( 'An error happened' );

    }
)

const villagerr03 = new GLTFLoader()
villagerr03.load(
    'assets/models/minecraft-villager/source/model.gltf', (gltfScene) => {
        gltfScene.scene.rotation.y = -180
        gltfScene.scene.scale.set(10, 10, 10)
        gltfScene.scene.position.set(70, 0, 0)
        scene.add(gltfScene.scene)
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log(error);
        console.log( 'An error happened' );

    }
)

const cat01 = new GLTFLoader()
cat01.load(
    'assets/models/minecraft-cat/source/minecraft-cat.gltf', (gltfScene) => {
        gltfScene.scene.rotation.y = 100
        gltfScene.scene.scale.set(10, 10, 10)
        gltfScene.scene.position.set(-50, 0, 20)
        scene.add(gltfScene.scene)
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log(error);
        console.log( 'An error happened' );

    }
)

function render(){
    renderer.render(scene, camera)
}

animate()