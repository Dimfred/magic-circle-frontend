import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import App from "./components/App";
import MainPage from "./components/MainPage";
import "./index.css";
import { routes } from "./routes";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <MantineProvider theme={theme}>
      <Routes>
        <Route path={routes.root} element={<App />} />
        <Route path={routes.main} element={<MainPage />} />
      </Routes>
    </MantineProvider>
  </Router>,
);
