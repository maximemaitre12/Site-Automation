import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Remove the static loader once React mounts
const removeLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 300);
  }
};

createRoot(document.getElementById("root")!).render(<App />);
removeLoader();
