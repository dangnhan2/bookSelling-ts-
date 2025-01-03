import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "styles/global.scss";
import { App as AppAntd } from "antd";

createRoot(document.getElementById("root")!).render(
  <AppAntd>
    <App />
  </AppAntd>
);
