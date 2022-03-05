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

function setLights (scene, baseUnit) {
  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.5);
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight(0xffa95c, 5);
  spotLight.position.set(1, baseUnit, baseUnit);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function setHouse (scene) {
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
}

function getScene (baseUnit) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000022);

  setHouse(scene);
  setLights(scene, baseUnit);
  setItems(scene, baseUnit);

  return scene;
}
