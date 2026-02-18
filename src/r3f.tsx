import { createRoot } from "react-dom/client";
import App from "./components/App";

const el = document.createElement("react-app");
document.body.appendChild(el);
const root = createRoot(el);
root.render(<App />);
