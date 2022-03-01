const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.position.x = 64;
  camera.position.y = -64;
  camera.position.z = 128;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

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
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
