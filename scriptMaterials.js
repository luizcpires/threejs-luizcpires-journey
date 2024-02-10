import './src/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/******** DEBUG *********/
const gui = new GUI()

/*********** Lights ************/
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/************ Environment Map ************/
const rgbeLoader = new RGBELoader()
rgbeLoader.load('././static/textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/********* Textures **********/
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("././static/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("././static/textures/door/alpha.jpg")
const doorMetalnessTexture = textureLoader.load("././static/textures/door/metalness.jpg")
const doorHeightTexture = textureLoader.load("././static/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("././static/textures/door/normal.jpg")
const doorRoughnessTexture = textureLoader.load("././static/textures/door/Roughness.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("././static/textures/door/ambientOcclusion.jpg")
const matcapTexture = textureLoader.load('././static/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('././static/textures/gradient/3.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/****** Material ******/
const objectMaterial = new THREE.MeshStandardMaterial()
//objectMaterial.metalness = 0.7
//objectMaterial.roughness = 0.2
objectMaterial.map = doorColorTexture
objectMaterial.aoMap = doorAmbientOcclusionTexture
objectMaterial.aoMapIntensity = 1
objectMaterial.displacementMap = doorHeightTexture
objectMaterial.displacementScale = 0.05
objectMaterial.metalnessMap = doorMetalnessTexture
objectMaterial.roughnessMap = doorRoughnessTexture
objectMaterial.normalMap = doorNormalTexture
//objectMaterial.normalScale.set(0.5, 0.5)
objectMaterial.transparent = true;
objectMaterial.alphaMap = doorAlphaTexture

gui.add(objectMaterial, "metalness")
.min(0)
.max(1)
.step(0.0001)

gui.add(objectMaterial, "roughness")
.min(0)
.max(1)
.step(0.0001)

/******** Sphere Object *******/
const sphereGeometry = new THREE.SphereGeometry(0.5,64,64)

const sphere = new THREE.Mesh(
    sphereGeometry,
    objectMaterial
)
sphere.position.x = -2
scene.add(sphere)

/******** Plane Object *******/
const planeGeometry = new THREE.PlaneGeometry(1,1, 64, 64)

const plane = new THREE.Mesh(
    planeGeometry,
    objectMaterial
)
scene.add(plane)

/******** Torus Object *******/
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)

const torus = new THREE.Mesh(
    torusGeometry,
    objectMaterial
)
torus.position.x = 2
scene.add(torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()