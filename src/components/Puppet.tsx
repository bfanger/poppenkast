import { useGLTF } from "@react-three/drei";
import gltfUrl from "./Puppet.glb?url";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { useEffect, useRef } from "react";
import { types } from "@theatre/core";
import useHands from "../services/useHands";
import { Group, Vector3 } from "three";
import { puppetSheet } from "../services/theatre";
import mapTo from "../services/mapTo";
import lerp from "../services/lerp";

export default function Puppet() {
  const gltf = useGLTF(gltfUrl);
  const object = gltf.nodes.Puppet;

  const debugRef = useRef<Group>(null);

  useHands((hands) => {
    const hand = hands[0];
    if (!hand?.keypoints3D) {
      return;
    }
    const indexFinger = hand.keypoints3D[8];
    const middleFinger = hand.keypoints3D[12];
    const thumb = hand.keypoints3D[4];
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
      1.6,
      0,
    );

    const head = gltf.nodes.Head;
    head.rotation.set(lerp(head.rotation.x, mouthAngle, 0.8), 0, 0);

    const scale = 10;
    debugRef.current?.children.map((mesh, i) => {
      const pos = hand.keypoints3D?.[i];
      if (pos) {
        mesh.position.set(
          pos.x * -scale - 1,
          pos.y * -scale,
          (pos.z ?? 0) * scale,
        );
      }
    });
  });

  useEffect(() => {
    const head = gltf.nodes.Head;
    const editableHead = puppetSheet.object("Head", {
      rotation: types.compound({
        x: types.number(head.rotation.x, { range: [0, 1.6] }),
        y: types.number(head.rotation.y),
        z: types.number(head.rotation.z),
      }),
    });
    editableHead.onValuesChange((values) => {
      const { x, y, z } = values.rotation;
      head.rotation.set(x, y, z);
    });

    const body = gltf.nodes.Body;
    body.position.x = 1;
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

      <group ref={debugRef}>
        {new Array(20).fill(0).map((_, i) => (
          <mesh key={i}>
            {i == 0 ? (
              <>
                <sphereGeometry args={[0.06]} />
                <meshStandardMaterial color="gray" />
              </>
            ) : i == 4 ? (
              <>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="red" />
              </>
            ) : i == 12 || i === 8 ? (
              <>
                <sphereGeometry args={[0.06]} />
                <meshStandardMaterial color="blue" />
              </>
            ) : (
              <>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial color="lightgray" />
              </>
            )}
          </mesh>
        ))}
      </group>
    </SheetProvider>
  );
}
