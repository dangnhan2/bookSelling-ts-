import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "styles/global.scss";
import { App as AppAntd, ConfigProvider } from "antd";
import { Provider } from "./context/app.context.tsx";
import enUS from "antd/locale/en_US";
createRoot(document.getElementById("root")!).render(
  <AppAntd>
    <Provider>
      <ConfigProvider locale={enUS}>
        <App />
      </ConfigProvider>
    </Provider>
  </AppAntd>
);
