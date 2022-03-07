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
let rotationRadius = 30; // Between 0 to 45
const distanceUnit = UNIT * 1.5;

/** Resize canvas and camera */
function resize () {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.position.set(UNIT, UNIT, UNIT * 2);
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
        const part = fbx.children[i].clone();
        part.castShadow = true;
        car.add(part);
      }
      const x = Math.cos((45 - rotationRadius / 2) / radian) * distanceUnit;
      car.position.set(x, 0, 0);
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

  const rotateRadiusSlider = document.getElementById('rotateRadius');
  rotationRadius = rotateRadiusSlider.value;
  rotateRadiusSlider.addEventListener('change', (ev) => {
    rotationRadius = ev.target.value;
  });

  const speedSlider = document.getElementById('speed');
  speedTimer = (10 - speedSlider.value) * 5;
  speedSlider.addEventListener('change', (ev) => {
    speedTimer = (10 - ev.target.value) * 5;
  });
}

let positionDegree = 0;
let rotationDegree = 0;
let inRadius = false;
let previousTimer = new Date();
const speedRate = 1;
const radian = 180 / Math.PI;
let speedTimer = 10;


function animate() {
	requestAnimationFrame(animate);
	// required if controls.enableDamping or controls.autoRotate are set to true

  controls.update();
	renderer.render(scene, camera);

  if (car) {
    const halfRadius = rotationRadius / 2;
    const currentTimer = new Date();
    if (animationOn && currentTimer - previousTimer > speedTimer) {
      previousTimer = currentTimer;
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

      // Need to reset in case of rotationRadius change from UI
      if ([0, 90, 180, 270].includes(positionDegree)) {
        rotationDegree = positionDegree;
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
      posX,
      car.position.y,
      posZ
    )
    car.rotation.set(0, -(rotationDegree - 90) / radian, 0);
  }
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
