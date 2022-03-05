const UNIT = 16;

const scene = getScene(UNIT);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExplosure = 2.3;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;

let car

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.position.set(UNIT, UNIT / 2, UNIT * 1.5);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  controls.update();

  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
}

let animationOn = false;
function init () {
  const fbxLoader = new THREE.FBXLoader();
  fbxLoader.load(
    'models/Police_Vehicle.fbx',
    (fbx) => {
      car = new THREE.Object3D();
      for (let i = 0; i < fbx.children.length; i++) {
        car.add(fbx.children[i].clone());
      }
      car.position.set(UNIT, 0, 0);
      car.scale.set(.075, .075, .075);
      scene.add(car);
    },
    () => console.log('loading...'),
    console.error
  )

  resize();
  document.body.appendChild(renderer.domElement);
  animate();

  const startStopBtn = document.getElementById('startStopBtn');
  startStopBtn.addEventListener('click', () => {
    animationOn = !animationOn;
  });
}

let positionDegree = 0;
let rotationDegree = 0;
let inRadius = false
const rotationRadius = 30; // Between 0 to 45
const speedRate = 1;
const radian = 180 / Math.PI;
const distanceUnit = UNIT * 1.5;

function animate() {
	requestAnimationFrame(animate);
	// required if controls.enableDamping or controls.autoRotate are set to true

  controls.update();
	renderer.render(scene, camera);

  if (car) {
    const halfRadius = rotationRadius / 2;
    if (animationOn) {
      positionDegree += speedRate;
      
      if (positionDegree >= 360) {
        positionDegree = 0;
      }
      const degreeToBeRotated = 90 / rotationRadius  * speedRate;
      if (
        (positionDegree > 45 - halfRadius && positionDegree <= 45 + halfRadius)
        || (positionDegree > 135 - halfRadius && positionDegree <= 135 + halfRadius)
        || (positionDegree > 225 - halfRadius && positionDegree <= 225 + halfRadius)
        || (positionDegree > 315 - halfRadius && positionDegree <= 315 + halfRadius)
      ) {
        rotationDegree += degreeToBeRotated;
        inRadius = true;
      } else {
        inRadius = false;
      }

      if (rotationDegree >= 360) {
        rotationDegree = 0;
      }
    }

    let posX;
    if (
      (positionDegree >= 315 + halfRadius || positionDegree < 45 - halfRadius)
      || (positionDegree >= 135 + halfRadius && positionDegree < 225 - halfRadius)
    ) {
      posX = car.position.x;
    } else {
      posX = Math.cos(positionDegree / radian) * distanceUnit;
    }
    let posZ;
    if (
      (positionDegree >= 45 + halfRadius && positionDegree < 135 - halfRadius)
      || (positionDegree >= 225 + halfRadius && positionDegree < 315 - halfRadius)
    ) {
      posZ = car.position.z;
    } else {
      posZ = Math.sin(positionDegree / radian) * distanceUnit;
    }

    car.position.set(
      // Math.cos(positionDegree / radian) * distanceUnit,
      posX,
      car.position.y,
      // Math.sin(positionDegree / radian) * distanceUnit,
      posZ
    )
    // car.rotation.set(0, -(positionDegree - 90) / radian, 0);
    // car.rotation.set(0, -(positionDegree) / radian, 0);
    car.rotation.set(0, -(rotationDegree - 90) / radian, 0);
  }
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
