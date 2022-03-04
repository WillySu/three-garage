const UNIT = 16;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExplosure = 2.3;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;

let car

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  // camera.position.set(UNIT, UNIT / 2, UNIT);
  camera.position.set(UNIT, UNIT / 2, UNIT * 1.5);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  controls.update();

  const geometry = new THREE.BoxGeometry(UNIT * 3, 1, UNIT * 3);
  const texture = new THREE.TextureLoader().load('models/GrassTile.jpg');
  const material = new THREE.MeshLambertMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, -.45, 0);
  scene.add(plane);

  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight(0xffa95c, 5);
  spotLight.position.set(1, UNIT, UNIT);
  spotLight.castShadow = true;
  scene.add(spotLight);

  scene.add(new THREE.AxesHelper(500));

  const glbLoader = new GLTFLoader();
  glbLoader.load(
    'models/House_001_GLB.glb',
    (gltf) => {
      gltf.scene.castShadow = true;
      scene.add(gltf.scene);
    },
    () => console.log('loading...'),
    console.error
  );

  const fbxLoader = new THREE.FBXLoader();
  fbxLoader.load(
    'models/Police_Vehicle.fbx',
    (fbx) => {
      car = new THREE.Object3D();
      for (let i = 0; i < fbx.children.length; i++) {
        car.add(fbx.children[i].clone());
      }
      // car.position.set(UNIT /2, 0, UNIT / 2);
      // car.rotation.set(0, Math.PI / 3, 0);
      car.scale.set(.075, .075, .075);
      scene.add(car);
    },
    () => console.log('loading...'),
    console.error
  )

  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
}

function init () {
  resize();
  document.body.appendChild(renderer.domElement);
  animate();
}


let degree = 0;
const radian = 180 / Math.PI;
const DISTANCE_UNIT = UNIT;
function animate() {
	requestAnimationFrame(animate);
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render(scene, camera);

  if (car) {
    degree += 0.0005;
    if (degree >= 360) {
      degree = 0;
    }

    car.position.set(
      // car.position.x,
      Math.cos(degree * radian) * DISTANCE_UNIT,
      car.position.y,
      // car.position.z
      Math.sin(degree * radian) * DISTANCE_UNIT
    )
    car.rotation.set(0, -degree * radian, 0);
  }
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
