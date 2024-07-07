const videoElement = document.getElementById('video');
const overlayElement = document.getElementById('overlay');

// 初始化MediaPipe Hands
const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({maxNumHands: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

// 初始化Three.js
const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
overlayElement.appendChild(renderer.domElement);

// 加載3D模型
const loader = new THREE.GLTFLoader();
let ring;
loader.load('path/to/your/ring_model.glb', function(gltf) {
  ring = gltf.scene;
  ring.scale.set(0.1, 0.1, 0.1);
  scene.add(ring);
});

camera3D.position.z = 5;

function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const wrist = landmarks[0];
    // 更新3D模型位置
    if (ring) {
      ring.position.set(wrist.x * 10 - 5, -wrist.y * 10 + 5, wrist.z * 10 - 5);
    }
  }
  renderer.render(scene, camera3D);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();
