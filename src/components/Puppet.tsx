import { useGLTF } from "@react-three/drei";
import gltfUrl from "./Puppet.glb?url";
import { SheetProvider } from "@theatre/r3f";
import { useEffect } from "react";
import { types } from "@theatre/core";
import useHands from "../services/useHands";
import { Vector3 } from "three";
import { puppetSheet } from "../services/theatre";
import mapTo from "../services/mapTo";
import lerp from "../services/lerp";
import { clamp } from "three/src/math/MathUtils.js";

export default function Puppet() {
  const gltf = useGLTF(gltfUrl);
  const object = gltf.nodes.Puppet;

  useHands((hands) => {
    const hand = hands[0];
    if (!hand?.keypoints3D) {
      return;
    }
    const body = gltf.nodes.Body;
    const head = gltf.nodes.Head;
    const thumb = hand.keypoints3D[4];
    const indexMcp = hand.keypoints3D[5];
    const indexFinger = hand.keypoints3D[8];
    const middleFinger = hand.keypoints3D[12];
    const pinkyMcp = hand.keypoints3D[17];

    // Calculate the mouth opening based on the distance of the thumb and the index or middle finger.
    const thumbPos = new Vector3(thumb.x, thumb.y, thumb.z ?? 0);
    const distanceIndexFinger = new Vector3(
      indexFinger.x,
      indexFinger.y,
      indexFinger.z,
    ).distanceTo(thumbPos);
    const distanceMiddleFinger = new Vector3(
      middleFinger.x,
      middleFinger.y,
      middleFinger.z,
    ).distanceTo(thumbPos);

    const mouthAngle = mapTo(
      Math.min(distanceIndexFinger, distanceMiddleFinger),
      0.05,
      0.15,
      1.8,
      -0.4,
    );
    head.rotation.set(lerp(head.rotation.x, mouthAngle, 0.8), 0, 0);

    // Rotate body based on knuckle positions
    let angle = 0;
    const maxDistance = 0.052;
    if (hand.handedness === "Left" && pinkyMcp.x < indexMcp.x) {
      angle = maxDistance - clamp(indexMcp.x - pinkyMcp.x, 0, maxDistance);
      if (indexMcp.z < pinkyMcp.z) {
        angle *= -1;
      }
      angle *= 25;
      body.rotation.set(0, lerp(body.rotation.y, angle, 0.3), 0);
    } else if (hand.handedness === "Right" && indexMcp.x < pinkyMcp.x) {
      angle = maxDistance - clamp(pinkyMcp.x - indexMcp.x, 0, maxDistance);
      if (pinkyMcp.z < indexMcp.z) {
        angle *= -1;
      }
      angle *= 25;
      body.rotation.set(0, lerp(body.rotation.y, angle, 0.3), 0);
    }
    // Position based on 2D location on camera
    const x = mapTo(hand.keypoints[0].x, 0, 640, -2, 2);
    const y = mapTo(hand.keypoints[0].y, 0, 480, 0.5, -2.5);
    body.position.set(
      lerp(body.position.x, x, 0.9),
      lerp(body.position.y, y, 0.7),
      0,
    );
  });

  useEffect(() => {
    const head = gltf.nodes.Head;
    const editableHead = puppetSheet.object("Head", {
      rotation: types.compound({
        x: types.number(head.rotation.x, { range: [-1, 2] }),
        y: types.number(head.rotation.y),
        z: types.number(head.rotation.z),
      }),
    });
    editableHead.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      head.rotation.set(x, y, z);
    });

    const body = gltf.nodes.Body;
    const editableBody = puppetSheet.object("Body", {
      rotation: types.compound({
        x: types.number(body.rotation.x),
        y: types.number(body.rotation.y),
        z: types.number(body.rotation.z),
      }),
    });
    editableBody.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      body.rotation.set(x, y, z);
    });
    return () => {
      puppetSheet.detachObject("Body");
      puppetSheet.detachObject("Head");
    };
  }, []);
  return (
    <SheetProvider sheet={puppetSheet}>
      <primitive object={object} />
    </SheetProvider>
  );
}
