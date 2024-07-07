const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// 啟動相機
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {video.srcObject = stream;
  });
  .catch(error => {
    console.error('Error accessing camera:', error);
  });
