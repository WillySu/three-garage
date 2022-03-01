const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.position.x = 64;
  camera.position.y = -64;
  camera.position.z = 64;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  controls.maxPolarAngle = Math.PI / 2;
  controls.update();

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

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
