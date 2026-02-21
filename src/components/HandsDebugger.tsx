import { useRef } from "react";
import useHands from "../services/useHands";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import type { Hand } from "@tensorflow-models/hand-pose-detection";

type Props = {
  scale: number;
  position?: [x: number, y: number, z: number];
};
export default function HandsDebugger({ scale, position }: Props) {
  const groupRef = useRef<Group>(null);

  useHands((hands) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const hand = hands[0];
    group.visible = !!hand?.keypoints3D;
    if (!group.visible) {
      return;
    }
    group.children.map((mesh, i) => {
      const pos = hand.keypoints3D?.[i];
      if (pos) {
        mesh.position.set(pos.x * -scale, pos.y * -scale, (pos.z ?? 0) * scale);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {new Array(20).fill(0).map((_, i) => (
        <mesh key={i}>
          {i == 0 ? (
            <>
              <sphereGeometry args={[0.008 * scale]} />
              <meshStandardMaterial color="gray" />
            </>
          ) : i == 4 ? (
            <>
              <sphereGeometry args={[0.01 * scale]} />
              <meshStandardMaterial color="red" />
            </>
          ) : i == 12 || i === 8 ? (
            <>
              <sphereGeometry args={[0.01 * scale]} />
              <meshStandardMaterial color="blue" />
            </>
          ) : (
            <>
              <sphereGeometry args={[0.006 * scale]} />
              <meshStandardMaterial color="lightgray" />
            </>
          )}
        </mesh>
      ))}
    </group>
  );
}
