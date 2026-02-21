import { Canvas } from "@react-three/fiber";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { PerspectiveCamera } from "@react-three/drei";
import Puppet from "./Puppet";
import { sceneSheet } from "../services/theatre";
import HandsDebugger from "./HandsDebugger";

const EditableCamera = e(PerspectiveCamera, "perspectiveCamera");

export default function App() {
  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      style={{
        width: 640,
        height: 480,
        background: "linear-gradient(to bottom, #d6f2ff, #65beff)",
      }}
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

        <Puppet />
        <HandsDebugger scale={3} position={[0, -1.2, 0.5]} />
      </SheetProvider>
    </Canvas>
  );
}
