import * as THREE from 'three'
import { GLTFLoader } from "/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "/jsm/loaders/DRACOLoader.js"

/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Clases que usan elementos propios de Three.js *
 * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Plano con textura de pasto de Minecraft.
class Plane {
    #mesh

    constructor(x = 0, y = 0, z = 0, width = 10, depth = 10) {
        const planeGeo = new THREE.BoxGeometry(width, 10, depth);
        const planeTex = {
            'top': new THREE.TextureLoader().load("assets/textures/grass_block_top.png"),
            'side': new THREE.TextureLoader().load("assets/textures/grass_block_side.png"),
            'bottom': new THREE.TextureLoader().load("assets/textures/dirt.png")
        }
        planeTex.top.wrapS = planeTex.bottom.wrapS = THREE.RepeatWrapping
        planeTex.top.wrapT = planeTex.bottom.wrapT = THREE.RepeatWrapping
        planeTex.top.repeat.x = planeTex.bottom.repeat.x = width / 10
        planeTex.top.repeat.y = planeTex.bottom.repeat.y = depth / 10
        planeTex.top.magFilter = planeTex.bottom.magFilter = THREE.NearestFilter

        planeTex.side.wrapS = THREE.RepeatWrapping
        planeTex.side.repeat.x = width / 10
        planeTex.side.magFilter = THREE.NearestFilter

        const planeMat = [
            new THREE.MeshStandardMaterial({
                map: planeTex.side,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: planeTex.side,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: planeTex.top,
                color: 0x91BD59,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: planeTex.bottom,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: planeTex.side,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: planeTex.side,
                side: THREE.DoubleSide
            }),
        ]
        this.#mesh = new THREE.Mesh(planeGeo, planeMat);
        this.#mesh.receiveShadow = true
        this.#mesh.position.set(x, y, z)
    }

    get Mesh() {
        return this.#mesh
    }
}

// Portal de Minecraft
class Portal {
    #portalTex
    #portal
    #MCPortal

    constructor(x = 0, y = 0, z = 0) {
        // Pilares verticales.
        const obsidianVerticalGeo = new THREE.BoxGeometry(10, 50, 10)
        const obsidianVerticalTex = new THREE.TextureLoader().load("assets/textures/obsidian.png")
        obsidianVerticalTex.wrapS = THREE.RepeatWrapping
        obsidianVerticalTex.wrapT = THREE.RepeatWrapping
        obsidianVerticalTex.repeat.y = 5
        obsidianVerticalTex.magFilter = THREE.NearestFilter
        const obsidianVerticalMat = new THREE.MeshLambertMaterial({
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

        // Pilares horizontales
        const obsidian2Geo = new THREE.BoxGeometry(20, 10, 10)
        const obsidian2Tex = new THREE.TextureLoader().load("assets/textures/obsidian.png")
        obsidian2Tex.wrapS = THREE.RepeatWrapping
        obsidian2Tex.wrapT = THREE.RepeatWrapping
        obsidian2Tex.repeat.x = 2
        obsidian2Tex.magFilter = THREE.NearestFilter
        const obsidian2Mat = new THREE.MeshLambertMaterial({
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

        // Parches
        // TODO: Hacer que los pilares verticales aparezcan sin las caras superiores estiradas.
        const portalTopLeftGeo = new THREE.PlaneGeometry(10, 10)
        const portalTopLeftTex = new THREE.TextureLoader().load("assets/textures/obsidian.png")
        portalTopLeftTex.magFilter = THREE.NearestFilter
        const portalTopLeftMat = new THREE.MeshLambertMaterial({
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

        // Portal
        const portalGeo = new THREE.PlaneGeometry(20, 30)
        this.#portalTex = new THREE.TextureLoader().load("assets/textures/nether_portal.png")
        this.#portalTex.wrapS = THREE.RepeatWrapping
        this.#portalTex.wrapT = THREE.RepeatWrapping
        this.#portalTex.repeat.set(2, 3/32)
        //portalTex.offset.set(1, 31/32)
        this.#portalTex.magFilter = THREE.NearestFilter
        const portalMat = new THREE.MeshBasicMaterial({
            map: this.#portalTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        })
        this.#portal = new THREE.Mesh(portalGeo, portalMat)
        this.#portal.position.set(0, 25, 0)
        this.#portal.name = "portal"

        const portalLight = new THREE.PointLight(0xbb29d9, 2, 80)
        portalLight.position.set(0, 25, 0)
        portalLight.castShadow = true
        //scene.add(portal)

        // Une todos los componentes del portal en uno solo
        this.#MCPortal = new THREE.Group()
        this.#MCPortal.add(obsidianLeft)
        this.#MCPortal.add(obsidianRight)
        this.#MCPortal.add(obsidianBottom)
        this.#MCPortal.add(obsidianTop)
        this.#MCPortal.add(portalTopRight)
        this.#MCPortal.add(portalTopLeft)
        this.#MCPortal.add(this.#portal)
        this.#MCPortal.add(portalLight)

        this.#MCPortal.position.set(x, y, z)
    }

    get portalTex() {
        return this.#portalTex
    }
    get Mesh() {
        return this.#MCPortal
    }
}

class CraftingTable {
    #mesh = new THREE.Group()

    constructor(x = 0, y = 0, z = 0) {
        const texture = {
            'top': new THREE.TextureLoader().load("assets/textures/crafting_table_top.png"),
            'side': new THREE.TextureLoader().load("assets/textures/crafting_table_side.png"),
            'front': new THREE.TextureLoader().load("assets/textures/crafting_table_front.png"),
            'bottom': new THREE.TextureLoader().load("assets/textures/oak_planks.png")
        }

        for(let face in texture) {
            texture[face].magFilter = THREE.NearestFilter
        }

        const geometry = new THREE.BoxGeometry(10, 10, 10)
        const material = [
            new THREE.MeshPhongMaterial({
                map: texture.side,
                side: THREE.DoubleSide
            }),
            new THREE.MeshPhongMaterial({
                map: texture.side,
                side: THREE.DoubleSide
            }),
            new THREE.MeshPhongMaterial({
                map: texture.top,
                side: THREE.DoubleSide
            }),
            new THREE.MeshPhongMaterial({
                map: texture.bottom,
                side: THREE.DoubleSide
            }),
            new THREE.MeshPhongMaterial({
                map: texture.front,
                side: THREE.DoubleSide
            }),
            new THREE.MeshPhongMaterial({
                map: texture.side,
                side: THREE.DoubleSide
            }),
        ]

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = 10
        this.#mesh.add(mesh)
        this.#mesh.position.set(x, y, z)
        this.#mesh.receiveShadow = true
    }

    get Mesh() {
        return this.#mesh
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * *
 * Clases que usan elementos modelos precargados *
 * * * * * * * * * * * * * * * * * * * * * * * * *
 */

class Model {
    #mesh = new THREE.Group()
    #model = new THREE.Group()

    constructor(gltfPath = "") {
        const loader = new GLTFLoader()
        loader.load(
            `assets/models/${gltfPath}`, (gltfScene) => {
                this.#model.add(gltfScene.scene)
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                console.log(error);
                console.log( 'An error happened' );

            }
        )
    }
    get _Model() {
        return this.#model
    }

    get Mesh() {
        return this.#mesh
    }
}

// Antorcha de Minecraft sacada de un modelo que alumbra con un pointLight.
class Torch extends Model {
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft-torch/scene.gltf")

        const light = new THREE.PointLight(0xf0ed48, 1, 80, 0.75)
        light.position.set(0, 10.625, 0)
        light.castShadow = true
        this.Mesh.add(light)

        this._Model.position.set(0, 8.125, 0)
        this._Model.scale.set(5, 5, 5)
        this.Mesh.add(this._Model)

        this.Mesh.position.set(x, y, z)
    }
}

class Villager extends Model {
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft-villager/source/model.gltf")

        this._Model.scale.set(10, 10, 10)
        this._Model.position.y = 5
        this.Mesh.add(this._Model)

        this.Mesh.position.set(x, y, z)
    }
}

class DiamondSword extends Model{
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft_diamond-sword/scene.gltf")

        this._Model.scale.set(.25, .25, .25)
        this._Model.position.y = 5.25
        this.Mesh.add(this._Model)

        this.Mesh.position.set(x, y, z)
    }
}

class Cat extends Model {
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft-cat/source/minecraft-cat.gltf")

        this._Model.scale.set(10, 10, 10)
        this._Model.position.y = 5
        this.Mesh.add(this._Model)

        this.Mesh.position.set(x, y, z)
    }
}

class Steve extends Model {
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft_steve/scene.gltf")

        this._Model.scale.set(7, 7, 7)
        this._Model.position.y = 18.5
        this.Mesh.add(this._Model)
        this.Mesh.position.set(x, y, z)
    }
}

class Enderman extends Model {
    constructor(x = 0, y = 0, z = 0) {
        super("minecraft_enderman/scene.gltf")

        this._Model.scale.set(0.6, 0.6, 0.6)
        this._Model.position.y = 20
        this.Mesh.add(this._Model)
        this.Mesh.position.set(x, y, z)
    }
}

export {
    Plane,
    Portal,
    Torch,
    Villager,
    DiamondSword,
    Cat,
    CraftingTable,
    Steve,
    Enderman
}