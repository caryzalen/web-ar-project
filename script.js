const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
  'assets/posx.jpg', 'assets/negx.jpg',
  'assets/posy.jpg', 'assets/negy.jpg',
  'assets/posz.jpg', 'assets/negz.jpg'
], () => {
  console.log('Environment map loaded successfully');
}, undefined, (error) => {
  console.error('Error loading environment map:', error);
});

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('assets/ring.gltf', (gltf) => {
  ring = gltf.scene;
  ring.traverse((node) => {
    if (node.isMesh) {
      node.material.envMap = textureCube;
      node.material.metalness = 1.0;
      node.material.roughness = 0.2;
      node.material.reflectivity = 1.0;
    }
  });
  scene.add(ring);
  ring.scale.set(0.1, 0.1, 0.1); // 根據模型尺寸調整縮放比例
  console.log('Model loaded successfully');
}, undefined, (error) => {
  console.error('Error loading model:', error);
});
