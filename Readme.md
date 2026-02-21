# Puppet Webcam Experiment

I thought it would be a fun idea if you could control a 3D puppet using your hands.

Visit [poppenkast.bfanger.nl](https://poppenkast.bfanger.nl/) to see it in action.

## Inspiration & Tech

After watching [Chrome for Developers - LiteRT.js, Google’s high performance WebAI runtime](https://youtu.be/HAjotVloAvI?si=i8qlXh0lmOj0WN4l&t=641).
[Huggingface](https://huggingface.co/) has multiple models for hand detection, but they all seem to use the [MediaPipe Hand Landmarker task](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) underneath.

For rendering I'm using [Three.js](https://threejs.org/) via [r3f](https://r3f.docs.pmnd.rs/) (React-Three-Fiber).
Using the [Theatre.js Studio](https://www.theatrejs.com/) made it easy to tweak camera, lights, etc.

## 3D modelling

I started with a generated 3D scan using [ComfyUI](https://www.comfy.org/) and a local AI running https://hunyuan-3d.org/ image-to-3D model.

I used the generated model as a base to create a new lightweight model in [Blender](https://blender.org/) using retopology techniques.
This lightweight model is suited for rigging and applying materials.

## Dev setup

```sh
pnpm install
pnpm dev --open
```
