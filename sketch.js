//https://medium.com/@jamischarles/what-is-debouncing-2505c0648ff1
//We use debouncing to do a quick pinch click interaction
//We wait for a few milliseconds before "clicking" / pinching
//This helps with noisy input, like losing tracking of the fingers

let handpose;
let video;
let predictions = [];
let pinchStarted = false;
let gifs = []
let index = 0;
function preload() {
  // 在preload函数中加载你的动态图像
  gifs.push(loadImage('1.gif'));
  gifs.push(loadImage('2.gif'));
  gifs.push(loadImage('3.gif'));
  gifs.push(loadImage('4.gif'));
  gifs.push(loadImage('5.gif'));

}


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  imageMode(CORNER)
  image(video, 0, 0, width, height);
  tint(255)
  imageMode(CENTER)
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  doPinch();

}

//draw pinch
function doPinch() {
  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      //get our thumb and index finger
      const indexF = prediction.annotations.indexFinger[3];//获取食指坐标
      const thumb = prediction.annotations.thumb[3];//获取母指坐标
      // print(prediction.annotations)
      //draw top of thumb and index finger circle
      fill(255, 255, 0);
      noStroke();
      ellipse(indexF[0], indexF[1], 10, 10);//食指位置绘制黄色圈
      fill(255, 0, 0);
      ellipse(thumb[0], thumb[1], 10, 10);//拇指位置红圈
      //each digit is represented by an array of 4 sets of xyz coordinates, e.g.
      //x -> thumb[0]
      //y -> thumb[1]
      //z -> thumb[2]
      //get distance between x & y coordinates of thumb & finger
      let pinchDist = dist(thumb[0], thumb[1], indexF[0], indexF[1]); //计算拇指食指距离

      //the z position from camera is a bit noisy, but this scales the distance to check against by z pos
      let zOffset = map(thumb[2], 20, -100, 10, 80);//映射拇指深度
      if (pinchDist < 50) {
        let x = (thumb[0] + indexF[0]) / 2
        let y = (thumb[1] + indexF[1]) / 2
        image(gifs[index], x, y)
        if (pinchStarted == false) {
          index = int(random(gifs.length))
          pinchStarted = true
        }
      }
      else if (pinchStarted) {
        pinchStarted = false
      }
    }
  }
}




// A function to draw ellipses over the detected keypoints
function drawKeypoints() {

  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];

    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

  }

}
