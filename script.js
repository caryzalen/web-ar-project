const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// 啟動相機
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// 初始化 MediaPipe Hands
const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// 初始化Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 定向光
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// 加載環境貼圖
const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
  'assets/posx.jpg', 'assets/negx.jpg',
  'assets/posy.jpg', 'assets/negy.jpg',
  'assets/posz.jpg', 'assets/negz.jpg'
]);
scene.background = textureCube;

// 加載自定義3D模型
const gltfLoader = new THREE.GLTFLoader();
let ring;
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
});

// 手部追蹤
hands.onResults(results => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const middleFingerTip = landmarks[12]; // 中指指尖
    if (ring) {
      ring.position.set(middleFingerTip.x * 2 - 1, -middleFingerTip.y * 2 + 1, 0);
    }
  }
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

const handLandmarker = async () => {
  await hands.initialize();
  hands.send({ image: video });
  requestAnimationFrame(handLandmarker);
};
handLandmarker();
