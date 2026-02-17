// https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker

import { Hands } from "@mediapipe/hands";
import loadImage from "./loadImage";

const hands = new Hands({
  locateFile: (file) => `mediapipe_hands/${file}`,
  //   locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
});
await hands.initialize();
await hands.setOptions({ maxNumHands: 2 });

const image = await loadImage("/hand.jpg");
hands.onResults((results) => {
  console.log(results);
});
await hands.send({ image });
