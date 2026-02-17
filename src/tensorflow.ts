// https://storage.googleapis.com/tfjs-models/demos/hand-pose-detection/index.html?model=mediapipe_hands
import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import loadImage from "./loadImage";

const model = SupportedModels.MediaPipeHands;
const detector = await createDetector(model, {
  runtime: "mediapipe",
  solutionPath: "/mediapipe_hands",
  modelType: "full",
  maxHands: 2,
});

const image = await loadImage("/hand.jpg");

const hands = await detector.estimateHands(image);

console.log(hands);
