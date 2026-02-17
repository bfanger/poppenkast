// https://github.com/tensorflow/tfjs-models/blob/master/hand-pose-detection/README.md
// https://storage.googleapis.com/tfjs-models/demos/hand-pose-detection/index.html?model=mediapipe_hands
import {
  createDetector,
  SupportedModels,
  type Hand,
} from "@tensorflow-models/hand-pose-detection";
import loadImage from "./loadImage";
import getWebcam from "./webcam";

const model = SupportedModels.MediaPipeHands;
const detector = await createDetector(model, {
  runtime: "mediapipe",
  solutionPath: "/mediapipe_hands",
  modelType: "full",
  maxHands: 2,
});
const mode = "image" as "video" | "image";
let hands: Hand[] = [];
if (mode === "image") {
  const image = await loadImage("/hand.jpg");
  image.style.width = "100%";
  document.body.appendChild(image);
  hands = await detector.estimateHands(image);
  console.log(hands);
} else {
  const video = await getWebcam();
  document.body.append(video);

  let previousTime = 0;
  async function update() {
    const { currentTime } = video;
    if (currentTime !== previousTime) {
      previousTime = currentTime;
      hands = await detector.estimateHands(video);
      draw();
    }
    requestAnimationFrame(update);
  }
  update();
}

function draw() {
  console.log(hands);
}
