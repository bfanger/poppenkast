// https://github.com/tensorflow/tfjs-models/blob/master/hand-pose-detection/README.md
// https://storage.googleapis.com/tfjs-models/demos/hand-pose-detection/index.html?model=mediapipe_hands
import {
  createDetector,
  SupportedModels,
  type Hand,
} from "@tensorflow-models/hand-pose-detection";
import getWebcam from "../webcam";
import { useEffect } from "react";

const model = SupportedModels.MediaPipeHands;
const detector = await createDetector(model, {
  runtime: "mediapipe",
  solutionPath: "/mediapipe_hands",
  modelType: "full",
  maxHands: 2,
});
let hands: Hand[] = [];

const video = await getWebcam();

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
type Callback = (hands: Hand[]) => void;
let eventBus: Callback[] = [];

function draw() {
  for (const fn of eventBus) {
    fn(hands);
  }
}

export default function useHands(fn: Callback) {
  useEffect(() => {
    eventBus.push(fn);
    document.body.append(video);

    return () => {
      eventBus = eventBus.filter((entry) => entry != fn);
    };
  });
}
