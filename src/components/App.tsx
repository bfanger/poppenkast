import { Canvas } from "@react-three/fiber";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { PerspectiveCamera } from "@react-three/drei";
import Puppet from "./Puppet";
import { project } from "../services/theatre";

const sheet = project.sheet("Scene");

const EditableCamera = e(PerspectiveCamera, "perspectiveCamera");

export default function App() {
  // useEffect(() => {
  //   project.ready.then(() =>
  //     sheet.sequence.play({ iterationCount: Infinity, range: [0, 1.1] }),
  //   );
  // }, []);

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      style={{ width: 640, height: 480 }}
    >
      <SheetProvider sheet={sheet}>
        <EditableCamera
          theatreKey="camera"
          makeDefault
          position={[0, 3.5, 7]}
          rotation={[-0.1982128995274913, 0, 0]}
        />
        <e.ambientLight theatreKey="ambientLight" />
        <e.pointLight theatreKey="pointLight" position={[10, 10, 10]} />

        <Puppet />
      </SheetProvider>
    </Canvas>
  );
}
