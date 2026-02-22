// https://github.com/tensorflow/tfjs-models/blob/master/hand-pose-detection/README.md
// https://storage.googleapis.com/tfjs-models/demos/hand-pose-detection/index.html?model=mediapipe_hands
import {
  createDetector,
  SupportedModels,
  type Hand,
  type Keypoint,
} from "@tensorflow-models/hand-pose-detection";
import getWebcam from "./webcam";
import { useEffect } from "react";

const model = SupportedModels.MediaPipeHands;
const detector = await createDetector(model, {
  runtime: "mediapipe",
  solutionPath: "/mediapipe_hands",
  modelType: "full",
  maxHands: 2,
});
type Keypoint3D = Omit<Keypoint, "z"> & { z: number };
export type Hand3D = Omit<Hand, "keypoints3D"> & { keypoints3D: Keypoint3D[] };

const video = await getWebcam();

let previousTime = 0;
async function update() {
  const { currentTime } = video;
  if (currentTime !== previousTime) {
    previousTime = currentTime;
    const hands = (await detector.estimateHands(video)) as Hand3D[];
    dispatch(hands);
  }
  requestAnimationFrame(update);
}
update();
type Callback = (hands: Hand3D[]) => void;
let eventBus: Callback[] = [];

function dispatch(hands: Hand3D[]) {
  for (const fn of eventBus) {
    fn(hands);
  }
}

export default function useHands(fn: Callback) {
  useEffect(() => {
    eventBus.push(fn);

    return () => {
      eventBus = eventBus.filter((entry) => entry != fn);
    };
  });
}
