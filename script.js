import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const cursor = {
    x: 0,
    y: 0
}
//Cursor
window.addEventListener('mousemove', function(event){
   cursor.x = (event.clientX / sizes.width - 0.5)
   cursor.y = - (event.clientY / sizes.height - 0.5)
})

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Objects

const group = new THREE.Group()
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)
cube2.position.x = -2
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x0000ff})
)
cube3.position.x = 2
group.add(cube3);

//group.position.y = 3

//Axes helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

//Sizes
const sizes = {
    width: 800,
    height: 600
}

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(-3 * aspectRatio, 3* aspectRatio, 3 , -3 , 0.1, 2000)
camera.position.set(1, 1, 6);
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//controls.target.y = 1;
//controls.update()

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height)

//Clock
const clock = new THREE.Clock()

//gsap.to(cube1.position, {duration: 1, delay: 1, x: 2})
//gsap.to(cube1.position, {duration: 1, delay: 2, x: 0})
//Animations
const loop = () => {

    
    //Clock
    const elapsedTime = clock.getElapsedTime()
    //const elapsedTime = Date.now()
    console.log(elapsedTime);

    //Update Objects
    //cube1.rotation.y = elapsedTime
    //cube1.position.y = Math.sin(elapsedTime)
   // cube1.position.x = Math.cos(elapsedTime)

   //Update Camera
   //camera.position.x = cursor.x * 8
   //camera.position.y = cursor.y * 8

   /*camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
   camera.position.y = cursor.y * 5
   camera.lookAt(group.position);*/

   controls.update()

    //Render
    renderer.render(scene, camera)
    
    //Request next frame
    window.requestAnimationFrame(loop)
}

loop();