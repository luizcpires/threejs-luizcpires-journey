import './src/style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'



/******** Debug UI *********/
const gui = new GUI({
    width: 320,
    title: "Nice debug UI",
    closeFolders: false
});
//gui.close();
//gui.hide();

/***Debug UI TOGGLE KEYDOWN: H ***/

window.addEventListener('keydown', (event) => {
    if(event.key == 'h'){
        //gui.show()
        gui.show(gui._hidden)
    }
})

/*** Debug Object ***/
const debugObject = {};
debugObject.color = 0xff0000
debugObject.subdivision = 2;


const cursor = {
    x: 0,
    y: 0
}
/*********Cursor**********/
window.addEventListener('mousemove', function(event){
   cursor.x = (event.clientX / sizes.width - 0.5)
   cursor.y = - (event.clientY / sizes.height - 0.5)
})


/*********Canvas**********/
const canvas = document.querySelector('canvas.webgl')

/*********Scene**********/
const scene = new THREE.Scene()

/********* Custom Geometry **********/

const customGeometry = new THREE.BufferGeometry()

const count = 50
const positionsArray = new Float32Array(count * 3 * 3)

for(let i = 0; i < count * 3 * 3 ; i++){
   // positionsArray[i] = Math.random() * 4;
   positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
customGeometry.setAttribute('position', positionsAttribute)



/******** Material ********/
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: debugObject.color,
    wireframe: true
})

/*********Objects**********/

const group = new THREE.Group()
scene.add(group);


/****** Cube 1 *******/
const cube1 = new THREE.Mesh(
    customGeometry,
    cubeMaterial
)

const cube1TweakFolder = gui.addFolder("Cube 1");
const cube2TweakFolder = gui.addFolder("Cube 2");

/**** GUI CUBE1 POSITION y ****/
cube1TweakFolder
    .add(cube1.position, "y")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Elevation")

cube1TweakFolder
    .add(cube1, 'visible')

cube1TweakFolder
    .add(cubeMaterial, 'wireframe')

cube1TweakFolder
    .addColor(debugObject, 'color')
    .onChange((value) => {
        cubeMaterial.color.set(debugObject.color)
    })

/** GUI Animation SPIN **/
debugObject.spin = () => {
    
    gsap.to(cube1.rotation, {y: cube1.rotation.y + Math.PI * 2})
}

cube1TweakFolder.add(debugObject, 'spin')

group.add(cube1);

/****** Cube 2 *******/
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
)
cube2.position.x = -2

cube2TweakFolder
.add(debugObject, 'subdivision')
.min(1)
.max(20)
.step(1)
.onFinishChange(()=>{

    cube2.geometry.dispose()
    cube2.geometry = new THREE.BoxGeometry(
        1,1,1,
        debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    )
})

group.add(cube2);

/****** Cube 3 *******/

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x0000ff})
)
cube3.position.x = 2
group.add(cube3);


/**** Textures *****/
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('./src/Door_Wood_001_basecolor.jpg')
const alphaTexture = textureLoader.load('./src/Door_Wood_001_opacity.jpg')
const heightTexture = textureLoader.load('./src/Door_Wood_001_height.jpg')
const normalTexture = textureLoader.load('./src/Door_Wood_001_normal.jpg')
const ambientOcclusionTexture = textureLoader.load('./src/Door_Wood_001_ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('./src/Door_Wood_001_metallic.jpg')
const roughnessTexture = textureLoader.load('./src/Door_Wood_001_roughness.jpg')
//texture.colorSpace = THREE.SRGBColorSpace

loadingManager.onStart = () =>{
    console.log('onStart')
}

loadingManager.onLoad = () =>{
    console.log('onLoaded')
}

loadingManager.onProgress = () =>{
    console.log('onProgress')
}

loadingManager.onError = () =>{
    console.log('onError')
}

/****** Cube 4 *******/
const cube4 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({map:colorTexture})   
)
cube4.position.x = 2;
cube4.position.y = 1.5;
group.add(cube4);

//group.position.y = 3

//Axes helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/*********Resize**********/
window.addEventListener('resize', (event) => {
    
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/*********Full screen**********/
window.addEventListener('dblclick', (event) => {
    
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    
    if(!fullscreenElement){
       
        if(canvas.requestFullscreen){
            canvas.requestFullscreen()
        }else if (canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
        
        
    }else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        }else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
        
    }
})

/*********Camera**********/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(-3 * aspectRatio, 3* aspectRatio, 3 , -3 , 0.1, 2000)
camera.position.set(1, 1, 6);
scene.add(camera)

/*********Controls**********/
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//controls.target.y = 1;
//controls.update()

/*********Renderer**********/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*********Clock**********/
const clock = new THREE.Clock()

//gsap.to(cube1.position, {duration: 1, delay: 1, x: 2})
//gsap.to(cube1.position, {duration: 1, delay: 2, x: 0})
//Animations

/*********Loop**********/
const loop = () => {

    
    //Clock
    const elapsedTime = clock.getElapsedTime()
    //const elapsedTime = Date.now()
    

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
