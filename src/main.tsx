import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "styles/global.scss";
import { App as AppAntd } from "antd";
import { Provider } from "./context/app.context.tsx";
createRoot(document.getElementById("root")!).render(
  <AppAntd>
    <Provider>
      <App />
    </Provider>
  </AppAntd>
);
