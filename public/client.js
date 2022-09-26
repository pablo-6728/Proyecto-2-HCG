import * as THREE from 'three'
import {OrbitControls} from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { OBJLoader } from './jsm/loaders/OBJLoader.js'
import { MTLLoader } from './jsm/loaders/MTLLoader.js'

//añadir plano
const scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(5))
const planeSize = 80
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshBasicMaterial({
  color: 0xeab676,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.receiveShadow = true
mesh.receiveShadow = true
scene.add(mesh);

const light = new THREE.AmbientLight()
light.intensity = 8
//light.position.x = 10
//light.position.y = 150
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 3
camera.position.y = 1

const renderer =  new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x0fd8d8, 1)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const stats = Stats()
document.body.appendChild(stats.dom)

//A partir de aca cargamos los assets de la escena

function animate(){
    requestAnimationFrame(animate)
    controls.update()
    render()
    stats.update()
}

function render(){
    renderer.render(scene, camera)
}

animate()