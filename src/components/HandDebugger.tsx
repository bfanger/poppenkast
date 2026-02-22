import { useRef } from "react";
import useHands, { type Hand3D } from "../services/useHands";
import { Group } from "three";

type Props = {
  handedness: Hand3D["handedness"];
  scale: number;
  position?: [x: number, y: number, z: number];
};
export default function HandDebugger({ handedness, scale, position }: Props) {
  const groupRef = useRef<Group>(null);

  useHands((hands) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const hand = hands.find((h) => h.handedness === handedness);
    if (!hand?.keypoints3D) {
      group.visible = false;
      return;
    }
    group.visible = true;
    group.children.map((mesh, i) => {
      const pos = hand.keypoints3D?.[i];
      if (pos) {
        mesh.position.set(
          pos.x * scale * -1,
          pos.y * scale * -1,
          (pos.z ?? 0) * scale,
        );
      }
    });
  });
  const color = handedness === "Left" ? "red" : "blue";

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
              <meshStandardMaterial color={color} />
            </>
          ) : i == 12 || i === 8 ? (
            <>
              <sphereGeometry args={[0.008 * scale]} />
              <meshStandardMaterial color={color} />
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
