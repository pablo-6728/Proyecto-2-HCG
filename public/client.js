import * as THREE from 'three'
import {OrbitControls} from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import * as obj from "./src/objects.js";

//añadir plano
const scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(5))
const planeSize = 200
const plane = new obj.Plane(0, 0, 0, planeSize, planeSize)
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

//añadir assets
const villagers = [
    new obj.Villager(50).Mesh,
    new obj.Villager(50, 0, 20).Mesh,
    new obj.Villager(70).Mesh
]

villagers[0].rotation.y = 180
villagers[1].rotation.y = 100
villagers[2].rotation.y = -180

villagers.forEach(model => {
    scene.add(model)
})

const cat = new obj.Cat(-50, 0, 20)
cat.Mesh.rotation.y = 100
scene.add(cat.Mesh)

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

function render(){
    renderer.render(scene, camera)
}

animate()