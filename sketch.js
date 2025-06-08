let video;
let handPose;
let hands = [];
let circleX = 320;
let circleY = 240;
let startTime;
let elapsedTime = 0;
let leftHandScore = 0;
let rightHandScore = 0;
let displayText = "";
let isStarted = false; // 控制是否開始互動
let isFinished = false; // 控制是否結束互動

const leftHandWords = ["教", "育", "科", "技"];
const rightHandWords = ["淡", "江", "大", "學"];

function preload() {
  try {
    handPose = ml5.handPose({ flipped: true });
    console.log("HandPose model loaded successfully.");
  } catch (error) {
    console.error("Failed to load HandPose model:", error);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Fullscreen canvas
  video = createCapture(VIDEO, { flipped: true }); // 翻轉鏡頭影像
  video.size(windowWidth, windowHeight);
  video.hide();

  startTime = millis(); // 記錄開始時間
}

function draw() {
  image(video, 0, 0, windowWidth, windowHeight); // 顯示翻轉後的鏡頭影像

  if (!isStarted) {
    // 顯示開始按鈕
    fill(0, 0, 255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100, 20);
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("開始", width / 2, height / 2);
    return; // 暫停互動，直到按下開始鍵
  }

  if (isFinished) {
    // 顯示結束後的總時間
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(`總共時間: ${elapsedTime} 秒`, width / 2, height / 2);
    return;
  }

  // 繪製圓形
  fill(255, 0, 0);
  noStroke();

  if (hands.length > 0) {
    let hand = hands[0]; // 使用第一隻偵測到的手
    let indexFinger = hand.annotations.indexFinger; // 取得食指的關鍵點

    if (indexFinger && indexFinger.length > 0) {
      let tip = indexFinger[3]; // 食指尖端
      circleX = lerp(circleX, tip[0], 0.2); // 平滑移動
      circleY = lerp(circleY, tip[1], 0.2);
    }
  }

  ellipse(circleX, circleY, 30, 30);

  // 顯示文字
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  text("TKUET413730861魏彤紜", width / 2, 10);

  // 顯示計時器
  elapsedTime = floor((millis() - startTime) / 1000); // 轉換為秒
  textAlign(RIGHT, TOP);
  text(elapsedTime + " 秒", width - 10, 10);

  // 顯示分數和文字
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  text(displayText, width / 2, height / 2);
}

function mousePressed() {
  if (!isStarted) {
    // 檢查是否點擊了開始按鈕
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 50 &&
      mouseY < height / 2 + 50
    ) {
      isStarted = true; // 開始互動
      handPose.on("predict", gotHands); // 啟動手部偵測
      handPose.start(video);
      startTime = millis(); // 重置開始時間
    }
    return;
  }

  if (hands.length > 0) {
    let hand = hands[0]; // 使用第一隻偵測到的手
    let indexFinger = hand.annotations.indexFinger; // 取得食指的關鍵點

    if (indexFinger && indexFinger.length > 0) {
      let tip = indexFinger[3]; // 食指尖端
      let distance = dist(circleX, circleY, tip[0], tip[1]);

      if (distance < 30) {
        if (hand.label === "left") {
          if (leftHandScore < leftHandWords.length) {
            displayText = leftHandWords[leftHandScore];
            leftHandScore++;
          }
        } else if (hand.label === "right") {
          if (rightHandScore < rightHandWords.length) {
            displayText = rightHandWords[rightHandScore];
            rightHandScore++;
          }
        }

        // 檢查是否完成所有文字
        if (
          leftHandScore === leftHandWords.length &&
          rightHandScore === rightHandWords.length
        ) {
          isFinished = true; // 結束互動
        }
      }
    }
  }
}

function gotHands(results) {
  hands = results;
}
