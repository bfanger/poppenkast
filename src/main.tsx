import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";

const LazyApp = lazy(() => import("./components/App"));

const el = document.createElement("react-app");
document.body.appendChild(el);
const root = createRoot(el);
root.render(
  <Suspense fallback={Loading()}>
    {" "}
    <LazyApp />
  </Suspense>,
);
