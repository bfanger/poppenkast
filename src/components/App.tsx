import { lazy, useState } from "react";
import LandingPage, { type PuppetUrls } from "./LandingPage";

const preload = () => import("./Scene");
const LazyScene = lazy(preload);

export default function App() {
  let [urls, setUrls] = useState<undefined | PuppetUrls>();
  return (
    <div className="m-auto aspect-4/3 max-h-screen">
      {urls ? (
        <LazyScene leftGlb={urls.left} rightGlb={urls.right} />
      ) : (
        <LandingPage preload={preload} onStart={setUrls} />
      )}
    </div>
  );
}
