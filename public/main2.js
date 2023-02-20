import * as THREE from "https://unpkg.com/three@0.148.0/build/three.module.js";
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';

// Create scene, camera & renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 1, 1000);  // field of view (in degrees), aspect ratio, near clipping planes, far clipping plane
// All the objects from a distance of point 1 from the camera to 1000 units out there will be visible in the camera
const renderer = new THREE.WebGLRenderer();

const world = {
  plane: {
    width: 400,
    height: 200,
    widthSegments: 80,
    heightSegments: 77,
  }
}


const randomValues = [];
function generatePlane(){
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);

  // Add depth/jaggedness to the plane
  const {array} = plane.geometry.attributes.position;
  for(let i=0; i<array.length; i++){
    if(i%3==0){
      const x = array[i];
      const y = array[i+1];
      const z = array[i+2];
      array[i] = x + (Math.random() - 0.5)*5;
      array[i+1] = y + (Math.random() - 0.5)*5;
      array[i+2] = z + (Math.random() - 0.5)*5;
    }
    randomValues.push(Math.random() - 0.5);
  }
  plane.geometry.attributes.position.originalPosition = plane.geometry.attributes.position.array;
  plane.geometry.attributes.position.randomPosition = randomValues;



  const colors = [];
  for(let i=0; i<plane.geometry.attributes.position.count; i++){
    // colors.push(0, 0.19, 0.4);
    colors.push(0, 0.19, 0.4);
  }
  plane.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
}

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const homeContainer = document.getElementById("canvasContainer");
homeContainer.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// camera.position.z = 1500;
camera.position.z = 80;

// create a plane
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
const planeMaterial = new THREE.MeshPhongMaterial({ 
  // color: 0xff0000,
  side: THREE.DoubleSide, flatShading: true, vertexColors: true});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
backLight.position.set(0, 0, -1);
scene.add(backLight);

generatePlane();

// StarField creating ----------------------------
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({color: 0xffffff});

const starVertices = [];
for(let i=0; i<10000; i++){
  const x = (Math.random() - 0.5)*2000;
  const y = (Math.random() - 0.5)*2000;
  const z = (Math.random() - 0.5)*2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);




const colors = [];
for(let i=0; i<plane.geometry.attributes.position.count; i++){
  colors.push(0, 0.19, 0.4);
}
plane.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));

const raycaster = new THREE.Raycaster();
const mouse = {
  x: undefined,
  y: undefined
}
addEventListener("mousemove", (event)=>{
  mouse.x = (event.clientX/innerWidth)*2-1;
  mouse.y = -(event.clientY/innerHeight)*2+1;
})

let frame = 0;
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  frame += 0.01;
  const {array, originalPosition, randomPosition} = plane.geometry.attributes.position;
  for(let i=0; i<array.length; i+=3){
    array[i] = originalPosition[i] + Math.cos(frame + randomPosition[i])*0.025;
    array[i+1] = originalPosition[i+1] + Math.sin(frame + randomPosition[i+1])*0.025;
  }
  plane.geometry.attributes.position.needsUpdate = true;


  const intersectedObjects = raycaster.intersectObject(plane);
  if(intersectedObjects.length > 0){
    const {color} = intersectedObjects[0].object.geometry.attributes;
    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    };
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    };
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: ()=>{
        color.setX(intersectedObjects[0].face.a, hoverColor.r);
        color.setY(intersectedObjects[0].face.a, hoverColor.g);
        color.setZ(intersectedObjects[0].face.a, hoverColor.b);
        
        color.setX(intersectedObjects[0].face.b, hoverColor.r);
        color.setY(intersectedObjects[0].face.b, hoverColor.g);
        color.setZ(intersectedObjects[0].face.b, hoverColor.b);

        color.setX(intersectedObjects[0].face.c, hoverColor.r);
        color.setY(intersectedObjects[0].face.c, hoverColor.g);
        color.setZ(intersectedObjects[0].face.c, hoverColor.b);
      }
    });
    color.needsUpdate = true;
  }

  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;
  stars.rotation.z += 0.0005;
}

animate();

// const registerBtn = document.getElementById("registerBtn");
setTimeout(()=>{
  gsap.to("#homeContainer", {
    opacity: 0
  })
  gsap.to(camera.position, {
    z: 25,
    ease: "power3.inOut",
    duration: 1.5
  })
  gsap.to(camera.rotation, {
    x: 1.57,
    ease: "power3.inOut",
    duration: 1.5
  })
  gsap.to(camera.position, {
    y: 750,
    ease: "power3.in",
    duration: 2,
    delay: 1.5
  })
}, 1500)

window.addEventListener("resize", ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})