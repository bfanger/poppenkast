import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import "./app.css";

const LazyApp = lazy(() => import("./components/App"));

const el = document.createElement("react-app");
el.className = "contents";
document.body.appendChild(el);
const root = createRoot(el);
root.render(
  <Suspense fallback={Loading()}>
    <div className="m-auto aspect-4/3 max-h-screen [background:var(--background-gradient)]">
      <LazyApp />
    </div>
  </Suspense>,
);
