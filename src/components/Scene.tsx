import { Canvas } from "@react-three/fiber";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { PerspectiveCamera } from "@react-three/drei";
import Puppet from "./Puppet";
import { sceneSheet } from "../services/theatre";
import HandDebugger from "./HandDebugger";
import useHands from "../services/useHands";
import { useRef } from "react";

const EditableCamera = e(PerspectiveCamera, "perspectiveCamera");

export default function Scene() {
  const noHandsRef = useRef<HTMLDivElement>(null);
  useHands((hands) => {
    const div = noHandsRef.current;
    if (!div) {
      return;
    }
    const handsDetected = hands.length !== 0;
    div.style.opacity = handsDetected ? "0" : "1";
    div.style.transition = handsDetected
      ? "opacity 0.1s 0s"
      : "opacity 0.2s 0.5s";
  });

  return (
    <>
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        className="[background:var(--background-gradient)]"
      >
        <SheetProvider sheet={sceneSheet}>
          <EditableCamera
            theatreKey="camera"
            makeDefault
            position={[0, 0.8, 4]}
            rotation={[-0.2, 0, 0]}
          />
          <e.ambientLight theatreKey="ambientLight" />
          <e.pointLight
            theatreKey="pointLight"
            position={[-1, 3, 2]}
            intensity={5}
          />

          <Puppet handedness="Left" />
          <Puppet handedness="Right" />
          {import.meta.env.DEV && (
            <>
              <HandDebugger
                handedness="Left"
                scale={2.5}
                position={[0.35, -0.9, 1.2]}
              />
              <HandDebugger
                handedness="Right"
                scale={2.5}
                position={[-0.35, -0.9, 1.2]}
              />
            </>
          )}
        </SheetProvider>
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={noHandsRef}
          className="rounded-full bg-black/30 px-8 py-6 text-2xl"
        >
          Geen handen gedetecteerd
        </div>
      </div>
    </>
  );
}
