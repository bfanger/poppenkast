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
  const {
    nodes: { Puppet: puppet, Body: body, Head: head, Jaw: jaw },
  } = useGraph(clone);

  useHands((hands) => {
    const hand = hands.find((h) => h.handedness === handedness);
    if (!hand?.keypoints3D) {
      // eslint-disable-next-line react-hooks/immutability
      puppet.visible = false;
      return;
    }
    puppet.visible = true;
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
      -0.25,
      -2,
    );
    head.rotation.set(lerp(head.rotation.x, mouthAngle, 0.85), 0, 0);

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
        (outward ? -20 : 20);
      const rotation = lerp(body.rotation.y, angle, 0.3);
      body.rotation.set(0, rotation, 0);
      jaw.rotation.set(jaw.rotation.x, jaw.rotation.y, rotation * -0.7);
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
    const range: [min: number, max: number] = [-Math.PI, Math.PI];
    const editableBody = puppetSheet.object(`Body_${handedness}`, {
      rotation: types.compound({
        x: types.number(body.rotation.x, { range }),
        y: types.number(body.rotation.y, { range }),
        z: types.number(body.rotation.z, { range }),
      }),
    });
    editableBody.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      body.rotation.set(x, y, z);
    });

    const editableJaw = puppetSheet.object(`Jaw_${handedness}`, {
      rotation: types.compound({
        x: types.number(jaw.rotation.x, { range }),
        y: types.number(jaw.rotation.y, { range }),
        z: types.number(jaw.rotation.z, { range }),
      }),
    });
    editableJaw.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      jaw.rotation.set(x, y, z);
    });

    const editableHead = puppetSheet.object(`Head_${handedness}`, {
      rotation: types.compound({
        x: types.number(head.rotation.x, { range }),
        y: types.number(head.rotation.y, { range }),
        z: types.number(head.rotation.z, { range }),
      }),
    });
    editableHead.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      head.rotation.set(x, y, z);
    });

    return () => {
      puppetSheet.detachObject(`Body_${handedness}`);
      puppetSheet.detachObject(`Jaw_${handedness}`);
      puppetSheet.detachObject(`Head_${handedness}`);
    };
  }, [handedness, body, jaw, head]);
  return (
    <SheetProvider sheet={puppetSheet}>
      <primitive object={puppet} />
    </SheetProvider>
  );
}
