function setItems (scene, baseUnit) {
  const geometry = new THREE.BoxGeometry(baseUnit * 3, 1, baseUnit * 3);
  const texture = new THREE.TextureLoader().load('models/GrassTile.jpg');
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.position.set(0, -.45, 0);
  scene.add(plane);

  scene.add(new THREE.AxesHelper(500));
}

function setSpotLight (x, y, z, scene, lightTarget, baseUnit) {
  const spotLight = new THREE.SpotLight(0x888844, 10, baseUnit * 2.5, Math.PI / 3);
  spotLight.position.set(x, y, z);
  spotLight.castShadow = true;
  spotLight.target = lightTarget;
  scene.add(spotLight);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32 );
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(spotLight.position);
  // sphere.castShadow = true; //default is false
  sphere.receiveShadow = false;
  scene.add(sphere);

  const lightOnSphere = new THREE.SpotLight(0xffffff, 10);
  lightOnSphere.position.copy(spotLight.position);
  lightOnSphere.position.x = lightOnSphere.position.x - ((x > 0) ? 1 : -1);
  lightOnSphere.position.z = lightOnSphere.position.z - ((z > 0) ? 1 : -1);
  lightOnSphere.distance = 2;
  lightOnSphere.target = sphere;
  scene.add(lightOnSphere);
}

function setLights (scene, baseUnit) {
  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, .2);
  scene.add(hemiLight);

  const lightTarget = new THREE.Object3D();
  lightTarget.position.set(0, baseUnit / 2, 0)
  scene.add(lightTarget);

  const lightUnit = baseUnit * 1.3;
  setSpotLight(lightUnit, 2, lightUnit, scene, lightTarget, baseUnit);
  setSpotLight(lightUnit, 2, -lightUnit, scene, lightTarget, baseUnit);
  setSpotLight(-lightUnit, 2, lightUnit, scene, lightTarget, baseUnit);
  setSpotLight(-lightUnit, 2, -lightUnit, scene, lightTarget, baseUnit);
}

function setHouse (scene) {
  // const fbxLoader = new THREE.FBXLoader();
  const glbLoader = new GLTFLoader();
  glbLoader.load(
    'models/House_001_GLB.glb',
    (gltf) => {
      console.log(gltf.scene)
      gltf.scene.castShadow = true;
      gltf.scene.receiveShadow = true;
      scene.add(gltf.scene);
    },
  /* fbxLoader.load(
    'models/House_001_FBX.fbx',
    (fbx) => {
      fbx.castShadow = true;
      fbx.receiveShadow = true;
      fbx.scale.set(0.01, 0.01, 0.01);
      fbx.rotation.set(-Math.PI / 2, 0, Math.PI);
      scene.add(fbx);
    }, */
    () => console.log('loading...'),
    console.error
  );
}

function getScene (baseUnit) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000022);

  setLights(scene, baseUnit);
  setItems(scene, baseUnit);
  setHouse(scene);

  return scene;
}
