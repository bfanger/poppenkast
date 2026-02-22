import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./app.css";

const el = document.createElement("react-app");
el.className = "contents";
document.body.appendChild(el);
const root = createRoot(el);
root.render(<App />);
