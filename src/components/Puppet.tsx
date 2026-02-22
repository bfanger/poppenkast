import { SheetProvider } from "@theatre/r3f";
import { useEffect, useMemo } from "react";
import { types } from "@theatre/core";
import useHands, { type Hand3D } from "../services/useHands";
import { Vector3 } from "three";
import { puppetSheet } from "../services/theatre";
import mapTo from "../services/mapTo";
import lerp from "../services/lerp";
import { clamp } from "three/src/math/MathUtils.js";
import { useGraph, type ObjectMap } from "@react-three/fiber";
import { SkeletonUtils, type GLTF } from "three-stdlib";
import { cameraHeight, cameraWidth } from "../services/webcam";

type Props = {
  handedness: Hand3D["handedness"];
  gltf: ObjectMap & GLTF;
};
export default function Puppet({ handedness, gltf }: Props) {
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  const { nodes } = useGraph(clone);

  useHands((hands) => {
    const hand = hands.find((h) => h.handedness === handedness);
    if (!hand?.keypoints3D) {
      nodes.Puppet.visible = false;
      return;
    }
    nodes.Puppet.visible = true;
    const body = nodes.Body;
    const head = nodes.Head;
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
    let outward = false;
    let knuckleDistance: number | undefined;
    if (hand.handedness === "Left" && pinkyMcp.x < indexMcp.x) {
      outward = indexMcp.z > pinkyMcp.z;
      knuckleDistance = indexMcp.x - pinkyMcp.x;
    } else if (hand.handedness === "Right" && indexMcp.x < pinkyMcp.x) {
      outward = pinkyMcp.z > indexMcp.z;
      knuckleDistance = pinkyMcp.x - indexMcp.x;
    }
    if (knuckleDistance !== undefined) {
      const maxDistance = 0.052;
      const angle =
        (maxDistance - clamp(knuckleDistance, 0, maxDistance)) *
        (outward ? -25 : 25);
      body.rotation.set(0, lerp(body.rotation.y, angle, 0.3), 0);
    }

    // Position based on 2D location on camera
    const x = mapTo(hand.keypoints[0].x, 0, cameraWidth, 2, -2);
    const y = mapTo(hand.keypoints[0].y, 0, cameraHeight, 0.5, -2.5);
    const offset = handedness === "Left" ? 0.2 : -0.2;
    body.position.set(
      lerp(body.position.x, x + offset, 0.9),
      lerp(body.position.y, y, 0.7),
      0,
    );
  });

  useEffect(() => {
    const head = nodes.Head;
    const editableHead = puppetSheet.object("Head" + handedness, {
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

    const body = nodes.Body;
    const editableBody = puppetSheet.object("Body" + handedness, {
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
      puppetSheet.detachObject("Body" + handedness);
      puppetSheet.detachObject("Head" + handedness);
    };
  }, []);
  return (
    <SheetProvider sheet={puppetSheet}>
      <primitive object={nodes.Puppet} />
    </SheetProvider>
  );
}
