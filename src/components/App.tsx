import { lazy, Suspense, useState } from "react";
import LandingPage from "./LandingPage";
import Loading from "./Loading";

const preload = () => import("./Scene");
const LazyScene = lazy(preload);

export default function App() {
  let [visible, setVisible] = useState(false);
  return (
    <div className="m-auto aspect-4/3 max-h-screen">
      {visible ? (
        <Suspense fallback={Loading()}>
          <LazyScene />
        </Suspense>
      ) : (
        <LandingPage preload={preload} onStart={() => setVisible(true)} />
      )}
    </div>
  );
}
