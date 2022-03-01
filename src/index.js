const UNIT = 16;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.position.x = UNIT;
  camera.position.y = -UNIT;
  camera.position.z = UNIT;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  controls.maxPolarAngle = Math.PI / 2;
  controls.update();

  /* const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube); */

  /* const geometry = new THREE.PlaneGeometry(UNIT * 2, UNIT * 2);
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane); */

  const geometry = new THREE.BoxGeometry(UNIT * 2, 1, UNIT * 2);
  const material = new THREE.MeshLambertMaterial( {color: 0x004400, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh(geometry, material);
  // plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  /* const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
  scene.add(directionalLight); */

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set(1, UNIT, UNIT);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const loader = new GLTFLoader();
  loader.load('glb/House_001_GLB.glb', (gltf) => {
    scene.add( gltf.scene );
  }, undefined, (error) => {
    console.error(error);
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
}

function init () {
  resize();
  document.body.appendChild(renderer.domElement);
  animate();
}

function animate() {
	requestAnimationFrame(animate);
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
