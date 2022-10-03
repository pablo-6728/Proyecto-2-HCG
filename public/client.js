import * as THREE from 'three'
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js'
import { RenderPass } from './jsm/postprocessing/RenderPass.js'
import { BloomPass } from './jsm/postprocessing/BloomPass.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import * as obj from "./src/objects.js";

//añadir plano
const scene = new THREE.Scene()
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

//añadir skybox
const scene_bg = new THREE.TextureLoader()
scene_bg.load('assets/textures/stars.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    scene.background = texture
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const stats = Stats()
document.body.appendChild(stats.dom)

//A partir de aca cargamos los assets de la escena
const torch = [
    new obj.Torch(30, 0, 30).Mesh,
    new obj.Torch(-20, 0, -80).Mesh
]
torch.forEach(model => {
    scene.add(model)
})

// Portal de obsidiana de Minecraft.
const minecraftPortal = new obj.Portal(70, 5, -95)
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

const steve = new obj.Steve()
steve.Mesh.position.z = -82
steve.Mesh.position.x = 25
steve.Mesh.rotation.y = 90
scene.add(steve.Mesh)

const enderman = new obj.Enderman()
enderman.Mesh.position.x = -20
scene.add(enderman.Mesh)

const table = new obj.CraftingTable(35, 0, -95)
scene.add(table.Mesh)

const sword = new obj.DiamondSword(35 ,10, -95)
scene.add(sword.Mesh)

// Añadiendo efecto partículas
let particles = []
for(let i = 0; i < 240; i++) {
    particles.push(new obj.Particle(70, 0, -95))
    scene.add(particles[i].Mesh)
}

//Postprocesamiento
const composer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
composer.addPass( renderPass )

const bloomPass = new BloomPass()
composer.addPass( bloomPass )


function animate(){
    requestAnimationFrame(animate)
    render()
    minecraftPortal.Update()

    for(let particle of particles) {
        particle.Update()
    }
    controls.update()
    stats.update()
}


function render(){
    renderer.render(scene, camera)
    composer.render()
}

animate()