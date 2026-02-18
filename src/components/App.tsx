import { getProject } from "@theatre/core";
import { Canvas } from "@react-three/fiber";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { PerspectiveCamera } from "@react-three/drei";
import state from "./state.json";
import { useEffect } from "react";

if (import.meta.env.DEV) {
  import("./studio");
}

const project = getProject("Poppenkast", { state });
const sheet = project.sheet("Ernie");

const EditableCamera = e(PerspectiveCamera, "perspectiveCamera");

export default function App() {
  useEffect(() => {
    project.ready.then(() =>
      sheet.sequence.play({ iterationCount: Infinity, range: [0, 1.1] }),
    );
  }, []);

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      style={{ width: 640, height: 480 }}
    >
      <SheetProvider sheet={sheet}>
        <EditableCamera theatreKey="camera" makeDefault />
        <e.ambientLight theatreKey="ambientLight" />
        <e.pointLight theatreKey="pointLight" position={[10, 10, 10]} />
        <e.mesh theatreKey="mesh">
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </e.mesh>
      </SheetProvider>
    </Canvas>
  );
}
