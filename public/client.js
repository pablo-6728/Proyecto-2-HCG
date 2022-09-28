import * as THREE from 'three'
import {OrbitControls} from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { OBJLoader } from './jsm/loaders/OBJLoader.js'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


//añadir plano
const scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(5))
const planeSize = 200
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeTex = new THREE.TextureLoader().load("assets/textures/grass.jpg")
planeTex.wrapS = THREE.RepeatWrapping
planeTex.wrapT = THREE.RepeatWrapping
planeTex.repeat.x = planeSize / 10
planeTex.repeat.y = planeSize / 10
const planeMat = new THREE.MeshPhongMaterial({
    map: planeTex,
    //color: 0x36cf3b,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.receiveShadow = true
scene.add(mesh);

const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.5
scene.add(ambientLight)

const light = new THREE.PointLight()
light.intensity = 1
light.position.set(0, 100, 50)
light.castShadow = true
//scene.add(light)

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

// Portal de obsidiana de Minecraft.
const minecraftPortal = newPortal()
scene.add(minecraftPortal)

function animate(){
    requestAnimationFrame(animate)
    controls.update()
    render()
    stats.update()
}

// Crea un portal de Minecraft con las coordenadas establecidas.
function newPortal(x = 0, y = 0, z = 0) {
    const obsidianVerticalGeo = new THREE.BoxGeometry(10, 50, 10)
    const obsidianVerticalTex = new THREE.TextureLoader().load("assets/textures/obsidian.webp")
    obsidianVerticalTex.wrapS = THREE.RepeatWrapping
    obsidianVerticalTex.wrapT = THREE.RepeatWrapping
    obsidianVerticalTex.repeat.y = 5
    const obsidianVerticalMat = new THREE.MeshPhongMaterial({
        map: obsidianVerticalTex
    })
    const obsidianLeft = new THREE.Mesh(obsidianVerticalGeo, obsidianVerticalMat)
    obsidianLeft.position.y = 25
    obsidianLeft.position.x = 15
    obsidianLeft.castShadow = true
    obsidianLeft.receiveShadow = true
    //scene.add(obsidianLeft)

    const obsidianRight = obsidianLeft.clone()
    obsidianRight.position.x *= -1
    //scene.add(obsidianRight)

    const obsidian2Geo = new THREE.BoxGeometry(20, 10, 10)
    const obsidian2Tex = new THREE.TextureLoader().load("assets/textures/obsidian.webp")
    obsidian2Tex.wrapS = THREE.RepeatWrapping
    obsidian2Tex.wrapT = THREE.RepeatWrapping
    obsidian2Tex.repeat.x = 2
    const obsidian2Mat = new THREE.MeshPhongMaterial({
        map: obsidian2Tex
    })
    const obsidianBottom = new THREE.Mesh(obsidian2Geo, obsidian2Mat)
    obsidianBottom.position.y = 5
    obsidianBottom.castShadow = true
    obsidianBottom.receiveShadow = true
    //scene.add(obsidianBottom)

    const obsidianTop = obsidianBottom.clone()
    obsidianTop.position.y = 45
    //scene.add(obsidianTop)

    const portalTopLeftGeo = new THREE.PlaneGeometry(10, 10)
    const portalTopLeftTex = new THREE.TextureLoader().load("assets/textures/obsidian.webp")
    const portalTopLeftMat = new THREE.MeshPhongMaterial({
        map: portalTopLeftTex,
        side: THREE.DoubleSide
    })
    const portalTopLeft = new THREE.Mesh(portalTopLeftGeo, portalTopLeftMat)
    portalTopLeft.rotation.x = - Math.PI /2
    portalTopLeft.position.set(15, 50.001, 0)
    portalTopLeft.castShadow = true
    portalTopLeft.receiveShadow = true
    //scene.add(portalTopLeft)

    const portalTopRight = portalTopLeft.clone()
    portalTopRight.position.x *= -1
    //scene.add(portalTopRight)

    const portalGeo = new THREE.PlaneGeometry(20, 30)
    const portalTex = new THREE.TextureLoader().load("assets/textures/portal.jpg")
    portalTex.wrapS = THREE.RepeatWrapping
    portalTex.wrapT = THREE.RepeatWrapping
    portalTex.repeat.x = 2
    portalTex.repeat.y = 3
    const portalMat = new THREE.MeshBasicMaterial({
        map: portalTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    })
    const portal = new THREE.Mesh(portalGeo, portalMat)
    portal.position.set(0, 25, 0)

    const portalLight = new THREE.PointLight(0xbb29d9, 2)
    portalLight.position.set(0, 25, 0)
    portalLight.castShadow = true
    //scene.add(portal)

    // Une todos los componentes del portal en uno solo
    const MCPortal = new THREE.Group()
    MCPortal.add(obsidianLeft)
    MCPortal.add(obsidianRight)
    MCPortal.add(obsidianBottom)
    MCPortal.add(obsidianTop)
    MCPortal.add(portalTopRight)
    MCPortal.add(portalTopLeft)
    MCPortal.add(portal)
    MCPortal.add(portalLight)

    MCPortal.position.set(x, y, z)

    return MCPortal
}

//añadir assets
const villagerr01 = new GLTFLoader()
villagerr01.load(
    'assets/models/minecraft-villager/source/model.gltf', (gltfScene) => {
        gltfScene.scene.rotation.y = 180
        gltfScene.scene.scale.set(10, 10, 10)
        gltfScene.scene.position.set(50, 0, 0)
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
        gltfScene.scene.position.set(50, 0, 20)
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

function render(){
    renderer.render(scene, camera)
}

animate()